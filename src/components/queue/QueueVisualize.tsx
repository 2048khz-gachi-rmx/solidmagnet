import {
  createEffect,
  createMemo,
  createSignal,
  createStore,
  For,
  isPending,
  Loading,
  type Accessor,
} from "solid-js";
import { Title } from "@solidjs/meta";
import { createGraphqlQuery } from "~/lib/graphql/query";
import {
  QueueMetricsDocument,
  type QueueMetricsQuery,
} from "~/lib/graphql/generated";
import type { MetricsBucketDuration } from "~/lib/graphql/schema-types";
import { useI18n } from "~/lib/i18n/I18nProvider";
import {
  Card,
  CardContent,
  CardHeader,
  ProgressBar,
  ProgressBarContainer,
} from "~/components/ui/Card";
import { IconButton } from "~/components/ui/Button";
import { NumberInput, Select } from "~/components/ui/Field";
import { Icon } from "~/components/ui/Icon";
import { ChartCard } from "~/components/charts/Chart";
import {
  autoRefreshIntervalNames,
  autoRefreshIntervals,
  availableQueueNames,
  defaultParams,
  eventNames,
  resolutionNames,
  timeframeNames,
  type AutoRefreshInterval,
  type EventName,
  type Params,
  type TimeframeName,
} from "./queue.constants";
import { createResult, createVariables, type Result } from "./queue-metrics";
import { queueTotalsAdapter } from "./queue-chart-adapter.totals";
import { queueTimelineAdapter } from "./queue-chart-adapter.timeline";

const eventIcons: Record<EventName, string> = {
  created: "add_circle",
  processed: "check_circle",
  failed: "error",
};

type QueueMetricsPanelProps = {
  params: Params<true>;
  data: Accessor<QueueMetricsQuery | undefined>;
  onTimeframe: (timeframe: TimeframeName) => void;
  onBucketDuration: (duration: MetricsBucketDuration) => void;
  onBucketMultiplier: (multiplier: number | "AUTO") => void;
  onQueue: (queue: string | null) => void;
  onEvent: (event: EventName | null) => void;
  onAutoRefresh: (interval: AutoRefreshInterval) => void;
  onRefresh: () => void;
};

function QueueMetricsPanel(props: QueueMetricsPanelProps) {
  const { t } = useI18n();
  const result = createMemo(() => createResult(props.params, props.data()!));

  // Match the Angular default: when there is less than 12 hours of data,
  // switch an "all time" AUTO-hour view to minute resolution.
  createEffect(
    () => result(),
    (current: Result) => {
      if (
        props.params.buckets.timeframe !== "all" ||
        props.params.buckets.duration !== "AUTO" ||
        current.params.buckets.duration !== "hour"
      ) {
        return;
      }
      const span = current.bucketSpan;
      if (span && span.latestBucket - span.earliestBucket < 12) {
        props.onBucketDuration("minute");
      }
    },
  );

  const timeframeIndex = () =>
    timeframeNames.indexOf(props.params.buckets.timeframe);
  const bucketDuration = (): MetricsBucketDuration =>
    props.params.buckets.duration === "AUTO"
      ? "hour"
      : props.params.buckets.duration;
  const bucketMultiplier = () => result().params.buckets.multiplier;
  const resolutionIndex = () => resolutionNames.indexOf(bucketDuration());
  const pending = () => isPending(() => props.data());

  return (
    <>
      <div class="dashboard-grid queue-control-grid">
        <Card class="queue-control">
          <CardHeader>
            <h4>{t("dashboard.metrics.timeframe")}</h4>
          </CardHeader>
          <CardContent>
            <Select
              value={props.params.buckets.timeframe}
              options={timeframeNames.map((name) => ({
                value: name,
                label: t(`dashboard.interval.${name}`),
              }))}
              onChange={(value) => props.onTimeframe(value)}
            />
            <div class="queue-actions">
              <IconButton
                label={t("paginator.first_page")}
                disabled={timeframeIndex() <= 0}
                onClick={() => props.onTimeframe(timeframeNames[0])}
              >
                <Icon name="first_page" />
              </IconButton>
              <IconButton
                label={t("paginator.previous_page")}
                disabled={timeframeIndex() <= 0}
                onClick={() =>
                  props.onTimeframe(timeframeNames[timeframeIndex() - 1])
                }
              >
                <Icon name="navigate_before" />
              </IconButton>
              <IconButton
                label={t("paginator.next_page")}
                disabled={timeframeIndex() >= timeframeNames.length - 1}
                onClick={() =>
                  props.onTimeframe(timeframeNames[timeframeIndex() + 1])
                }
              >
                <Icon name="navigate_next" />
              </IconButton>
              <IconButton
                label={t("paginator.last_page")}
                disabled={timeframeIndex() >= timeframeNames.length - 1}
                onClick={() =>
                  props.onTimeframe(timeframeNames[timeframeNames.length - 1])
                }
              >
                <Icon name="last_page" />
              </IconButton>
            </div>
          </CardContent>
        </Card>

        <Card class="queue-control">
          <CardHeader>
            <h4>{t("dashboard.metrics.resolution")}</h4>
          </CardHeader>
          <CardContent>
            <div class="queue-resolution-inputs">
              <NumberInput
                class="queue-number-input"
                value={bucketMultiplier()}
                min={1}
                ariaLabel={t("dashboard.metrics.resolution")}
                onInput={(value) =>
                  props.onBucketMultiplier(
                    Number.isInteger(value) && value >= 1 ? value : "AUTO",
                  )
                }
              />
              <Select
                class="queue-duration"
                value={bucketDuration()}
                options={resolutionNames.map((name) => ({
                  value: name,
                  label: t(`dashboard.interval.${name}s`),
                }))}
                onChange={(value) => props.onBucketDuration(value)}
              />
            </div>
            <div class="queue-actions">
              <IconButton
                label={t("paginator.first_page")}
                disabled={resolutionIndex() <= 0}
                onClick={() => props.onBucketDuration(resolutionNames[0])}
              >
                <Icon name="first_page" />
              </IconButton>
              <IconButton
                label={t("paginator.previous_page")}
                disabled={resolutionIndex() <= 0}
                onClick={() =>
                  props.onBucketDuration(resolutionNames[resolutionIndex() - 1])
                }
              >
                <Icon name="navigate_before" />
              </IconButton>
              <IconButton
                label={t("paginator.next_page")}
                disabled={resolutionIndex() >= resolutionNames.length - 1}
                onClick={() =>
                  props.onBucketDuration(resolutionNames[resolutionIndex() + 1])
                }
              >
                <Icon name="navigate_next" />
              </IconButton>
              <IconButton
                label={t("paginator.last_page")}
                disabled={resolutionIndex() >= resolutionNames.length - 1}
                onClick={() =>
                  props.onBucketDuration(
                    resolutionNames[resolutionNames.length - 1],
                  )
                }
              >
                <Icon name="last_page" />
              </IconButton>
            </div>
          </CardContent>
        </Card>

        <Card class="queue-control">
          <CardHeader>
            <h4>{t("dashboard.queues.queue")}</h4>
          </CardHeader>
          <CardContent>
            <Select
              value={props.params.queue ?? "_all"}
              options={[
                { value: "_all", label: t("general.all") },
                ...availableQueueNames.map((queue) => ({
                  value: queue,
                  label: queue,
                })),
              ]}
              onChange={(value) =>
                props.onQueue(value === "_all" ? null : value)
              }
            />
            <div class="queue-actions">
              <IconButton
                label={t("general.all")}
                class={props.params.queue ? "deselected" : "selected"}
                onClick={() => props.onQueue(null)}
              >
                <Icon name="workspaces" />
              </IconButton>
              <For each={availableQueueNames}>
                {(queue) => (
                  <IconButton
                    label={queue}
                    class={
                      props.params.queue === queue ? "selected" : "deselected"
                    }
                    onClick={() => {
                      if (props.params.queue !== queue) props.onQueue(queue);
                    }}
                  >
                    <Icon
                      name={
                        props.params.queue === queue
                          ? "radio_button_checked"
                          : "radio_button_unchecked"
                      }
                    />
                  </IconButton>
                )}
              </For>
            </div>
          </CardContent>
        </Card>

        <Card class="queue-control">
          <CardHeader>
            <h4>{t("dashboard.metrics.event")}</h4>
          </CardHeader>
          <CardContent>
            <Select
              value={props.params.event ?? "_all"}
              options={[
                { value: "_all", label: t("general.all") },
                ...eventNames.map((event) => ({
                  value: event,
                  label: t(`dashboard.event.${event}`),
                })),
              ]}
              onChange={(value) =>
                props.onEvent(value === "_all" ? null : value)
              }
            />
            <div class="queue-actions">
              <IconButton
                label={t("general.all")}
                class={props.params.event ? "deselected" : "selected"}
                onClick={() => props.onEvent(null)}
              >
                <Icon
                  name={
                    props.params.event
                      ? "radio_button_unchecked"
                      : "radio_button_checked"
                  }
                />
              </IconButton>
              <For each={eventNames}>
                {(event) => (
                  <IconButton
                    label={t(`dashboard.queues.${event}`)}
                    class={
                      props.params.event === event ? "selected" : "deselected"
                    }
                    onClick={() => {
                      if (props.params.event !== event) props.onEvent(event);
                    }}
                  >
                    <Icon name={eventIcons[event]} />
                  </IconButton>
                )}
              </For>
            </div>
          </CardContent>
        </Card>

        <Card class="queue-control">
          <CardHeader>
            <h4>{t("general.refresh")}</h4>
          </CardHeader>
          <CardContent>
            <Select
              value={props.params.autoRefresh}
              options={autoRefreshIntervalNames.map((name) => ({
                value: name,
                label: t(`dashboard.interval.${name}`),
              }))}
              onChange={(value) => props.onAutoRefresh(value)}
            />
            <div class="queue-actions">
              <IconButton
                label={t("general.refresh")}
                onClick={() => props.onRefresh()}
              >
                <Icon name="sync" />
              </IconButton>
            </div>
          </CardContent>
        </Card>
      </div>

      <ProgressBarContainer>
        <ProgressBar indeterminate={pending()} value={0} />
      </ProgressBarContainer>

      <div class="chart-grid">
        <ChartCard
          title={t("dashboard.queues.total_counts_by_status")}
          data={result()}
          adapter={queueTotalsAdapter}
          width={550}
          height={400}
        />
        <ChartCard
          title={t("dashboard.metrics.throughput")}
          data={result()}
          adapter={queueTimelineAdapter}
          width={550}
          height={400}
        />
      </div>
    </>
  );
}

export default function QueueVisualizePage() {
  const { t } = useI18n();
  const [params, setParams] = createStore<Params<true>>({
    ...defaultParams,
    buckets: { ...defaultParams.buckets },
  });
  const [refresh, setRefresh] = createSignal(0);
  const metrics = createGraphqlQuery(QueueMetricsDocument, () => {
    refresh();
    return createVariables(params);
  });

  createEffect(
    () => autoRefreshIntervals[params.autoRefresh],
    (delay) => {
      if (!delay) {
        return;
      }
      const id = setInterval(() => {
        setRefresh((value) => value + 1);
      }, delay * 1000);
      return () => clearInterval(id);
    },
  );

  const setTimeframe = (timeframe: TimeframeName) => {
    setParams((draft) => {
      draft.buckets.timeframe = timeframe;
    });
  };

  const setBucketDuration = (duration: MetricsBucketDuration) => {
    setParams((draft) => {
      draft.buckets.duration = duration;
      draft.buckets.multiplier = "AUTO";
    });
  };

  const setBucketMultiplier = (multiplier: number | "AUTO") => {
    setParams((draft) => {
      draft.buckets.multiplier = multiplier;
    });
  };

  const setQueue = (selection: string | null) => {
    setParams((draft) => {
      draft.queue = selection ?? undefined;
    });
  };

  const setEvent = (selection: EventName | null) => {
    setParams((draft) => {
      draft.event = selection ?? undefined;
    });
  };

  const setAutoRefresh = (interval: AutoRefreshInterval) => {
    setParams((draft) => {
      draft.autoRefresh = interval;
    });
  };

  return (
    <>
      <Title>
        {`${t("routes.visualize")} - ${t("routes.queues")} - ${t(
          "routes.dashboard",
        )} - bitmagnet`}
      </Title>
      <Loading
        fallback={
          <ProgressBarContainer>
            <ProgressBar indeterminate />
          </ProgressBarContainer>
        }
      >
        <QueueMetricsPanel
          params={params}
          data={metrics.data}
          onTimeframe={setTimeframe}
          onBucketDuration={setBucketDuration}
          onBucketMultiplier={setBucketMultiplier}
          onQueue={setQueue}
          onEvent={setEvent}
          onAutoRefresh={setAutoRefresh}
          onRefresh={() => setRefresh((value) => value + 1)}
        />
      </Loading>
    </>
  );
}
