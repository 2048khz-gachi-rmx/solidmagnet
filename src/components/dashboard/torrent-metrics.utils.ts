import type { TorrentMetricsQuery } from "~/lib/graphql/generated";
import type { MetricsBucketDuration } from "~/lib/graphql/schema-types";
import { durationSeconds, timeframeLengths } from "./torrent-metrics.constants";
import type {
  BucketParams,
  BucketSpan,
  EventBucket,
  EventBucketEntries,
  EventBuckets,
  EventName,
  Params,
  Result,
  TorrentEvents,
} from "./torrent-metrics.types";

/**
 * Turns the raw GraphQL buckets into one normalized series per source, with
 * bucket indexes aligned to the selected duration/multiplier grid.
 */
export const createResult = (
  params: Params,
  rawResult: TorrentMetricsQuery,
): Result => {
  const { bucketParams, earliestBucket } = createBucketParams(
    params,
    rawResult,
  );
  const sources = Object.entries(
    rawResult.torrent.metrics.buckets.reduce<
      Record<string, Partial<Record<EventName, EventBucketEntries>>>
    >((acc, next) => {
      if (next.source !== (params.source ?? next.source)) {
        return acc;
      }
      let bucket: NormalizedBucket | undefined = normalizeBucket(
        next.bucket,
        bucketParams,
      );
      if (earliestBucket && earliestBucket.index > bucket.index) {
        bucket = undefined;
      }
      if (!bucket) {
        return acc;
      }
      const currentEventBuckets = acc[next.source] ?? {};
      return {
        ...acc,
        [next.source]: {
          created: !next.updated
            ? {
                ...currentEventBuckets.created,
                [bucket.key]: {
                  count:
                    next.count +
                    (currentEventBuckets.created?.[bucket.key]?.count ?? 0),
                  startTime: bucket.start,
                },
              }
            : currentEventBuckets.created,
          updated: next.updated
            ? {
                ...currentEventBuckets.updated,
                [bucket.key]: {
                  count:
                    next.count +
                    (currentEventBuckets.updated?.[bucket.key]?.count ?? 0),
                  startTime: bucket.start,
                },
              }
            : currentEventBuckets.updated,
        },
      };
    }, {}),
  ).map(([source, eventBuckets]) => {
    let events: TorrentEvents | undefined;
    if (Object.keys(eventBuckets).length) {
      const bucketDates: number[] = [];
      const buckets: EventBuckets = fromEntries(
        Array<EventName>("created", "updated").flatMap<
          [EventName, EventBucket]
        >((event): [EventName, EventBucket][] => {
          const entries = fromEntries(
            Object.entries(eventBuckets[event] ?? {})
              .filter(([, value]) => value?.count)
              .sort(([a], [b]) => (parseInt(a) < parseInt(b) ? 1 : -1)),
          );
          const keys = Object.keys(entries);
          if (!keys.length) {
            return [];
          }
          const earliestBucket = parseInt(keys[0]);
          const latestBucket = parseInt(keys[keys.length - 1]);
          bucketDates.push(earliestBucket, latestBucket);
          return [
            [
              event,
              {
                earliestBucket,
                latestBucket,
                entries,
              },
            ],
          ];
        }),
      );
      bucketDates.sort((a, b) => a - b);
      events = {
        bucketDuration: bucketParams.duration,
        earliestBucket: bucketDates[0],
        latestBucket: bucketDates[bucketDates.length - 1],
        eventBuckets: buckets,
      };
    }
    return {
      source,
      events,
      isEmpty: !events?.eventBuckets,
    };
  });
  let bucketSpan: BucketSpan | undefined;
  const earliestFoundBucket = sources
    .flatMap((query) => (query.events ? [query.events.earliestBucket] : []))
    .sort((a, b) => a - b)[0];
  const latestFoundBucket = sources
    .flatMap((query) => (query.events ? [query.events.latestBucket] : []))
    .sort((a, b) => a - b)
    .reverse()[0];
  if (earliestFoundBucket && latestFoundBucket) {
    bucketSpan = {
      earliestBucket: earliestFoundBucket,
      latestBucket: latestFoundBucket,
    };
  }
  return {
    params: {
      ...params,
      buckets: bucketParams,
    },
    sourceSummaries: sources,
    bucketSpan,
    availableSources: rawResult.torrent.listSources.sources.map((source) => ({
      key: source.key,
      name: source.name,
    })),
  };
};

const fromEntries = <K extends string, V>(
  entries: Array<[K, V]>,
): Partial<Record<K, V>> =>
  Object.fromEntries(entries) as Partial<Record<K, V>>;

const createBucketParams = (
  params: Params,
  rawResult: TorrentMetricsQuery,
): {
  bucketParams: BucketParams<false>;
  earliestBucket: NormalizedBucket;
  latestBucket: NormalizedBucket;
} => {
  const duration: MetricsBucketDuration =
    params.buckets.duration === "AUTO" ? "hour" : params.buckets.duration;
  let multiplier =
    params.buckets.multiplier === "AUTO" ? 1 : params.buckets.multiplier;
  const timeframe = params.buckets.timeframe;
  const now = new Date();
  const nowBucket = normalizeBucket(now, { duration, multiplier });
  const startBucket = normalizeBucket(
    now.getTime() - 1000 * timeframeLengths[timeframe],
    { duration, multiplier },
  );
  const allBuckets = [
    startBucket,
    ...rawResult.torrent.metrics.buckets.map((bucket) =>
      normalizeBucket(bucket.bucket, { duration, multiplier }),
    ),
    nowBucket,
  ]
    .filter((bucket) => bucket.index >= startBucket.index)
    .sort((a, b) => a.index - b.index);
  const minBucket = allBuckets[0];
  const maxBucket = allBuckets[allBuckets.length - 1];
  if (params.buckets.multiplier === "AUTO") {
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
    earliestBucket: normalizeBucket(
      now.getTime() - 1000 * timeframeLengths[timeframe],
      { duration, multiplier },
    ),
    latestBucket: normalizeBucket(
      Math.max(now.getTime(), maxBucket.start.getTime()),
      { duration, multiplier },
    ),
  };
};

type NormalizedBucket = {
  key: string;
  index: number;
  start: Date;
};

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
