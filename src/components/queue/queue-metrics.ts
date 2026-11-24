import type { Duration } from "date-fns";
import type { MetricsBucketDuration } from "~/lib/graphql/schema-types";
import type {
  QueueMetricsQuery,
  QueueMetricsQueryVariables,
} from "~/lib/graphql/generated";
import { parseIsoDuration } from "~/lib/format/format";
import {
  durationSeconds,
  emptyStatusCounts,
  eventNames,
  timeframeLengths,
  type BucketParams,
  type EventName,
  type Params,
  type StatusCounts,
} from "./queue.constants";

export type EventBucketEntry = {
  startTime: Date;
  count: number;
  latency: number;
};

export type EventBucketEntries = Partial<Record<string, EventBucketEntry>>;

export type BucketSpan = {
  earliestBucket: number;
  latestBucket: number;
};

export type EventBucket = BucketSpan & {
  entries: EventBucketEntries;
};

export type EventBuckets = Partial<Record<EventName, EventBucket>>;

export type QueueEvents = BucketSpan & {
  bucketDuration: MetricsBucketDuration;
  eventBuckets: EventBuckets;
};

export type QueueSummary = {
  queue: string;
  isEmpty: boolean;
  statusCounts: StatusCounts;
  events: QueueEvents | undefined;
};

export type Result = {
  params: Params<false>;
  bucketSpan?: BucketSpan;
  queues: QueueSummary[];
};

export type NormalizedBucket = {
  key: string;
  index: number;
  start: Date;
};

export const createVariables = (
  params: Params<true>,
): QueueMetricsQueryVariables => ({
  input: {
    bucketDuration:
      params.buckets.duration === "AUTO" ? "hour" : params.buckets.duration,
    queues: params.queue ? [params.queue] : undefined,
    startTime:
      params.buckets.timeframe === "all"
        ? undefined
        : new Date(
            Date.now() - 1000 * timeframeLengths[params.buckets.timeframe],
          ).toISOString(),
  },
});

export const normalizeBucket = (
  rawDate: string | number | Date,
  params: Pick<BucketParams<false>, "duration" | "multiplier">,
): NormalizedBucket => {
  const date = new Date(rawDate);
  const msMultiplier =
    1000 * durationSeconds[params.duration] * params.multiplier;
  const baseNumber = Math.floor(date.getTime() / msMultiplier);
  return {
    key: `${baseNumber}`,
    index: baseNumber,
    start: new Date(baseNumber * msMultiplier),
  };
};

const durationToSeconds = (duration: Duration): number =>
  (duration.years ?? 0) * 60 * 60 * 24 * 365 +
  (duration.months ?? 0) * 60 * 60 * 24 * 30 +
  (duration.weeks ?? 0) * 60 * 60 * 24 * 7 +
  (duration.days ?? 0) * 60 * 60 * 24 +
  (duration.hours ?? 0) * 60 * 60 +
  (duration.minutes ?? 0) * 60 +
  Math.floor(duration.seconds ?? 0);

const createBucketParams = (
  params: Params<true>,
  rawResult: QueueMetricsQuery,
): {
  bucketParams: BucketParams<false>;
  earliestBucket: NormalizedBucket | undefined;
  latestBucket: NormalizedBucket;
} => {
  const duration =
    params.buckets.duration === "AUTO" ? "hour" : params.buckets.duration;
  let multiplier =
    params.buckets.multiplier === "AUTO" ? 1 : params.buckets.multiplier;
  const timeframe = params.buckets.timeframe;
  const now = new Date();
  const nowBucket = normalizeBucket(now, { duration, multiplier });
  const startBucket =
    timeframe === "all"
      ? undefined
      : normalizeBucket(Date.now() - 1000 * timeframeLengths[timeframe], {
          duration,
          multiplier,
        });
  const allBuckets = [
    ...(startBucket ? [startBucket] : []),
    ...rawResult.queue.metrics.buckets.flatMap((bucket) => [
      normalizeBucket(bucket.createdAtBucket, { duration, multiplier }),
      ...(bucket.ranAtBucket
        ? [normalizeBucket(bucket.ranAtBucket, { duration, multiplier })]
        : []),
    ]),
    nowBucket,
  ]
    .filter((bucket) => !startBucket || bucket.index >= startBucket.index)
    .sort((a, b) => a.index - b.index);
  const minBucket = allBuckets[0];
  const maxBucket = allBuckets[allBuckets.length - 1];
  if (params.buckets.multiplier === "AUTO" && minBucket && maxBucket) {
    const targetSpan = 20;
    const span = maxBucket.index - minBucket.index;
    multiplier = Math.min(
      60,
      Math.max(Math.floor(span / (targetSpan * 5)) * 5, 1),
    );
  }
  return {
    bucketParams: {
      duration,
      multiplier,
      timeframe,
    },
    earliestBucket:
      timeframe === "all"
        ? undefined
        : normalizeBucket(Date.now() - 1000 * timeframeLengths[timeframe], {
            duration,
            multiplier,
          }),
    latestBucket: normalizeBucket(
      Math.max(Date.now(), maxBucket?.start.getTime() ?? Date.now()),
      { duration, multiplier },
    ),
  };
};

const eventsMatch = (
  selected: EventName | undefined,
  event: EventName,
): boolean => selected === undefined || selected === event;

export const createResult = (
  params: Params<true>,
  rawResult: QueueMetricsQuery,
): Result => {
  const { bucketParams, earliestBucket, latestBucket } = createBucketParams(
    params,
    rawResult,
  );
  const acc: Record<
    string,
    {
      statusCounts: StatusCounts;
      events: Partial<Record<EventName, EventBucketEntries>>;
    }
  > = {};

  for (const next of rawResult.queue.metrics.buckets) {
    if (params.queue && next.queue !== params.queue) {
      continue;
    }
    let createdAt: NormalizedBucket | undefined = normalizeBucket(
      next.createdAtBucket,
      bucketParams,
    );
    if (earliestBucket && earliestBucket.index > createdAt.index) {
      createdAt = undefined;
    }
    let ranAt: NormalizedBucket | undefined;
    if (next.ranAtBucket && params.event !== "created") {
      ranAt = normalizeBucket(next.ranAtBucket, bucketParams);
      if (
        ranAt &&
        (latestBucket.index < ranAt.index ||
          (earliestBucket && earliestBucket.index > ranAt.index))
      ) {
        ranAt = undefined;
      }
    }
    if (
      params.queue === undefined &&
      !createdAt &&
      (!ranAt || next.status === "pending")
    ) {
      continue;
    }
    const entry = acc[next.queue] ?? {
      statusCounts: { ...emptyStatusCounts },
      events: {},
    };
    const currentStatusCounts = entry.statusCounts;
    const currentEventBuckets = entry.events;
    const currentLatency = next.latency
      ? durationToSeconds(parseIsoDuration(next.latency))
      : undefined;
    const statusBucket = next.status === "pending" ? createdAt : ranAt;
    acc[next.queue] = {
      statusCounts: statusBucket
        ? {
            ...currentStatusCounts,
            [next.status]: next.count + currentStatusCounts[next.status],
          }
        : currentStatusCounts,
      events: {
        created:
          createdAt && eventsMatch(params.event, "created")
            ? {
                ...currentEventBuckets.created,
                [createdAt.key]: {
                  count:
                    next.count +
                    (currentEventBuckets.created?.[createdAt.key]?.count ?? 0),
                  latency: 0,
                  startTime: createdAt.start,
                },
              }
            : currentEventBuckets.created,
        processed:
          ranAt &&
          next.status === "processed" &&
          eventsMatch(params.event, "processed")
            ? {
                ...currentEventBuckets.processed,
                [ranAt.key]: {
                  count:
                    next.count +
                    (currentEventBuckets.processed?.[ranAt.key]?.count ?? 0),
                  latency:
                    (currentEventBuckets.processed?.[ranAt.key]?.latency ?? 0) +
                    (currentLatency ?? 0),
                  startTime: ranAt.start,
                },
              }
            : currentEventBuckets.processed,
        failed:
          ranAt &&
          next.status === "failed" &&
          eventsMatch(params.event, "failed")
            ? {
                ...currentEventBuckets.failed,
                [ranAt.key]: {
                  count:
                    next.count +
                    (currentEventBuckets.failed?.[ranAt.key]?.count ?? 0),
                  latency:
                    (currentEventBuckets.failed?.[ranAt.key]?.latency ?? 0) +
                    (currentLatency ?? 0),
                  startTime: ranAt.start,
                },
              }
            : currentEventBuckets.failed,
      },
    };
  }

  const queues = Object.entries(acc).map<QueueSummary>(([queue, entry]) => {
    const bucketDates: number[] = [];
    const eventBuckets: EventBuckets = {};
    for (const event of eventNames) {
      const source = entry.events[event];
      if (!source) {
        continue;
      }
      const entries: EventBucketEntries = {};
      for (const [key, value] of Object.entries(source)) {
        if (value?.count) {
          entries[key] = value;
        }
      }
      const indexes = Object.keys(entries)
        .map((key) => Number.parseInt(key, 10))
        .sort((a, b) => a - b);
      if (!indexes.length) {
        continue;
      }
      const earliest = indexes[0];
      const latest = indexes[indexes.length - 1];
      eventBuckets[event] = {
        earliestBucket: earliest,
        latestBucket: latest,
        entries,
      };
      bucketDates.push(earliest, latest);
    }
    const queueEvents: QueueEvents | undefined = bucketDates.length
      ? {
          bucketDuration: bucketParams.duration,
          earliestBucket: Math.min(...bucketDates),
          latestBucket: Math.max(...bucketDates),
          eventBuckets,
        }
      : undefined;
    return {
      queue,
      statusCounts: entry.statusCounts,
      events: queueEvents,
      isEmpty: !queueEvents,
    };
  });

  const foundEarliest = queues
    .flatMap((queue) => (queue.events ? [queue.events.earliestBucket] : []))
    .sort((a, b) => a - b)[0];
  const foundLatest = queues
    .flatMap((queue) => (queue.events ? [queue.events.latestBucket] : []))
    .sort((a, b) => b - a)[0];
  const bucketSpan =
    foundEarliest !== undefined && foundLatest !== undefined
      ? { earliestBucket: foundEarliest, latestBucket: foundLatest }
      : undefined;

  return {
    params: {
      ...params,
      buckets: bucketParams,
    },
    queues,
    bucketSpan,
  };
};
