import type {
  MetricsBucketDuration,
  QueueJobStatus,
} from "~/lib/graphql/schema-types";

export type BucketParams<WithAuto extends boolean = boolean> = {
  duration: WithAuto extends true
    ? "AUTO" | MetricsBucketDuration
    : MetricsBucketDuration;
  multiplier: WithAuto extends true ? "AUTO" | number : number;
  timeframe: TimeframeName;
};

export type StatusCounts = Record<QueueJobStatus, number>;

export type EventName = (typeof eventNames)[number];

export type TimeframeName = (typeof timeframeNames)[number];

export type AutoRefreshInterval = (typeof autoRefreshIntervalNames)[number];

export type Params<WithAuto extends boolean = boolean> = {
  buckets: BucketParams<WithAuto>;
  queue?: string;
  event?: EventName;
  autoRefresh: AutoRefreshInterval;
};

export const eventNames = ["created", "processed", "failed"] as const;

export const statusNames = ["pending", "processed", "retry", "failed"] as const;

export const resolutionNames = ["day", "hour", "minute"] as const;

export const timeframeNames = [
  "minutes_15",
  "minutes_30",
  "hours_1",
  "hours_6",
  "hours_12",
  "days_1",
  "weeks_1",
  "all",
] as const;

export const timeframeLengths: Record<TimeframeName, number> = {
  minutes_15: 60 * 15,
  minutes_30: 60 * 30,
  hours_1: 60 * 60,
  hours_6: 60 * 60 * 6,
  hours_12: 60 * 60 * 12,
  days_1: 60 * 60 * 24,
  weeks_1: 60 * 60 * 24 * 7,
  all: Infinity,
};

export const durationSeconds: Record<MetricsBucketDuration, number> = {
  minute: 60,
  hour: 60 * 60,
  day: 60 * 60 * 24,
};

export const availableQueueNames = ["process_torrent", "process_torrent_batch"];

export const autoRefreshIntervalNames = [
  "off",
  "seconds_10",
  "seconds_30",
  "minutes_1",
  "minutes_5",
  "minutes_15",
  "minutes_30",
  "hours_1",
  "hours_6",
  "hours_12",
  "days_1",
  "weeks_1",
] as const;

export const autoRefreshIntervals: Record<AutoRefreshInterval, number | null> =
  {
    off: null,
    seconds_10: 10,
    seconds_30: 30,
    minutes_1: 60,
    minutes_5: 60 * 5,
    minutes_15: 60 * 15,
    minutes_30: 60 * 30,
    hours_1: 60 * 60,
    hours_6: 60 * 60 * 6,
    hours_12: 60 * 60 * 12,
    days_1: 60 * 60 * 24,
    weeks_1: 60 * 60 * 24 * 7,
  };

export const emptyStatusCounts: StatusCounts = {
  pending: 0,
  failed: 0,
  retry: 0,
  processed: 0,
};

export const defaultParams: Params<true> = {
  buckets: {
    duration: "AUTO",
    multiplier: "AUTO",
    timeframe: "all",
  },
  autoRefresh: "seconds_30",
};
