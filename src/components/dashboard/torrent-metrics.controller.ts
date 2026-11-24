import {
  createEffect,
  createMemo,
  createSignal,
  NotReadyError,
  type Accessor,
} from "solid-js";
import { createGraphqlQuery } from "~/lib/graphql/query";
import { useNotify } from "~/lib/notify/NotifyProvider";
import {
  TorrentMetricsDocument,
  type TorrentMetricsQueryVariables,
} from "~/lib/graphql/generated";
import type { MetricsBucketDuration } from "~/lib/graphql/schema-types";
import {
  autoRefreshIntervals,
  defaultParams,
  emptyRawResult,
  timeframeLengths,
} from "./torrent-metrics.constants";
import type {
  AutoRefreshInterval,
  EventName,
  Params,
  Result,
  TimeframeName,
} from "./torrent-metrics.types";
import { createResult } from "./torrent-metrics.utils";

export type TorrentMetricsController = {
  params: Accessor<Params>;
  result: Accessor<Result>;
  variables: Accessor<TorrentMetricsQueryVariables>;
  bucketDuration: Accessor<MetricsBucketDuration>;
  bucketMultiplier: Accessor<number>;
  setTimeframe: (timeframe: TimeframeName) => void;
  setSource: (source: string | null) => void;
  setEvent: (event: EventName | null) => void;
  setBucketDuration: (
    duration: MetricsBucketDuration,
    multiplier?: number,
  ) => void;
  setBucketMultiplier: (multiplier: number | "AUTO") => void;
  setAutoRefreshInterval: (interval: AutoRefreshInterval) => void;
  refresh: () => void;
};

/**
 * Solid port of TorrentMetricsController.
 *
 * Query-affecting state (resolution, source, timeframe) lives in its own
 * signals, so changing the event filter or multiplier only recomputes the
 * normalized result and never refetches. `refreshCount` is the explicit
 * refresh counter; because the variables memo reads it, a manual or timed
 * refresh is a real change and the loading indicator reports it.
 */
export function createTorrentMetricsController(
  initParams: Params = defaultParams,
): TorrentMetricsController {
  const initialDuration: MetricsBucketDuration =
    initParams.buckets.duration === "AUTO"
      ? "hour"
      : initParams.buckets.duration;
  const [timeframe, setTimeframeSignal] = createSignal<TimeframeName>(
    initParams.buckets.timeframe,
  );
  const [bucketDuration, setBucketDurationSignal] =
    createSignal<MetricsBucketDuration>(initialDuration);
  const [multiplier, setMultiplierSignal] = createSignal<"AUTO" | number>(
    initParams.buckets.multiplier,
  );
  const [source, setSourceSignal] = createSignal<string | undefined>(
    initParams.source,
  );
  const [event, setEventSignal] = createSignal<EventName | undefined>(
    initParams.event,
  );
  const [autoRefresh, setAutoRefreshSignal] = createSignal<AutoRefreshInterval>(
    initParams.autoRefresh,
  );
  const [refreshCount, setRefreshCount] = createSignal(0);

  const params = createMemo<Params<true>>(() => ({
    buckets: {
      duration: bucketDuration(),
      multiplier: multiplier(),
      timeframe: timeframe(),
    },
    source: source(),
    event: event(),
    autoRefresh: autoRefresh(),
  }));

  const variables = createMemo<TorrentMetricsQueryVariables>(() => {
    refreshCount();
    const selectedSource = source();
    return {
      input: {
        bucketDuration: bucketDuration(),
        sources: selectedSource ? [selectedSource] : undefined,
        startTime: new Date(
          Date.now() - 1000 * timeframeLengths[timeframe()],
        ).toISOString(),
      },
    };
  });

  const notify = useNotify();
  const rawResult = createGraphqlQuery(TorrentMetricsDocument, variables);

  // Read the reactive inputs before the await: reads after an await are no
  // longer tracked by the memo.
  const result = createMemo<Result>(async (previous) => {
    const currentParams = params();
    try {
      const data = await rawResult.data();
      return createResult(currentParams, data ?? emptyRawResult);
    } catch (error) {
      // Suspension is not a request failure; let the Loading boundary see it.
      if (error instanceof NotReadyError) throw error;
      notify.error(
        `Failed to load torrent metrics: ${error instanceof Error ? error.message : String(error)}`,
      );
      return previous ?? createResult(currentParams, emptyRawResult);
    }
  });

  const setTimeframe = (next: TimeframeName) => setTimeframeSignal(next);

  const setSource = (next: string | null) => setSourceSignal(next ?? undefined);

  const setEvent = (next: EventName | null) =>
    setEventSignal(next ?? undefined);

  const setBucketDuration = (
    duration: MetricsBucketDuration,
    nextMultiplier?: number,
  ) => {
    setBucketDurationSignal(duration);
    setMultiplierSignal(nextMultiplier ?? "AUTO");
  };

  const setBucketMultiplier = (next: number | "AUTO") =>
    setMultiplierSignal(next);

  const setAutoRefreshInterval = (next: AutoRefreshInterval) =>
    setAutoRefreshSignal(next);

  const refresh = () => setRefreshCount((count) => count + 1);

  createEffect(
    () => autoRefresh(),
    (name) => {
      const seconds = autoRefreshIntervals[name];
      if (!seconds) return;
      const timer = setInterval(refresh, seconds * 1000);
      return () => clearInterval(timer);
    },
  );

  return {
    params,
    result,
    variables,
    bucketDuration,
    bucketMultiplier: () =>
      result()?.params.buckets.multiplier ??
      (multiplier() === "AUTO" ? 1 : multiplier()),
    setTimeframe,
    setSource,
    setEvent,
    setBucketDuration,
    setBucketMultiplier,
    setAutoRefreshInterval,
    refresh,
  };
}
