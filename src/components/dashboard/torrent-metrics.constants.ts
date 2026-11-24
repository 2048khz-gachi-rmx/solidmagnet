import type { TorrentMetricsQuery } from "~/lib/graphql/generated";
import type { MetricsBucketDuration } from "~/lib/graphql/schema-types";
import type {
  AutoRefreshInterval,
  BucketParams,
  Params,
} from "./torrent-metrics.types";

export const defaultBucketParams: BucketParams = {
  duration: "minute",
  multiplier: 1,
  timeframe: "hours_1",
};

export const resolutionNames = ["day", "hour", "minute"] as const;

export const durationSeconds: Record<MetricsBucketDuration, number> = {
  minute: 60,
  hour: 60 * 60,
  day: 60 * 60 * 24,
};

export const emptyParams: Params = {
  buckets: defaultBucketParams,
  autoRefresh: "off",
};

export const emptyRawResult: TorrentMetricsQuery = {
  torrent: {
    metrics: {
      buckets: [],
    },
    listSources: {
      sources: [
        {
          key: "dht",
          name: "DHT",
        },
      ],
    },
  },
};

export const eventNames = ["created", "updated"] as const;

export const timeframeNames = [
  "minutes_15",
  "minutes_30",
  "hours_1",
  "hours_6",
  "hours_12",
  "days_1",
  "weeks_1",
] as const;

export const timeframeLengths: Record<(typeof timeframeNames)[number], number> =
  {
    minutes_15: 60 * 15,
    minutes_30: 60 * 30,
    hours_1: 60 * 60,
    hours_6: 60 * 60 * 6,
    hours_12: 60 * 60 * 12,
    days_1: 60 * 60 * 24,
    weeks_1: 60 * 60 * 24 * 7,
  };

/** Refresh choices offered by the metrics page. */
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

/** The component starts with a 30 second refresh, like the original. */
export const defaultParams: Params = {
  buckets: defaultBucketParams,
  autoRefresh: "seconds_30",
};
