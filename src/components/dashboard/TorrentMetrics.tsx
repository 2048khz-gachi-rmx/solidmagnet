import { For, Loading, Show, isPending } from "solid-js";
import type { JSX } from "@solidjs/web";
import { ChartCard } from "~/components/charts/Chart";
import {
  Card,
  CardContent,
  CardHeader,
  ProgressBar,
  ProgressBarContainer,
} from "~/components/ui/Card";
import { Icon } from "~/components/ui/Icon";
import { IconButton } from "~/components/ui/Button";
import { Select, TextInput } from "~/components/ui/Field";
import { useI18n } from "~/lib/i18n/I18nProvider";
import {
  autoRefreshIntervalNames,
  eventNames,
  resolutionNames,
  timeframeNames,
} from "./torrent-metrics.constants";
import {
  createTorrentMetricsController,
  type TorrentMetricsController,
} from "./torrent-metrics.controller";
import { torrentTimelineAdapter } from "./torrent-chart-adapter.timeline";
import "./dashboard.css";

function MetricsCard(props: { title: string; children: JSX.Element }) {
  return (
    <Card class="metrics-control-card">
      <CardHeader>
        <h4 class="metrics-card-title">{props.title}</h4>
      </CardHeader>
      <CardContent class="metrics-card-content">{props.children}</CardContent>
    </Card>
  );
}

function TimeframeCard(props: { controller: TorrentMetricsController }) {
  const { t } = useI18n();
  const index = () =>
    timeframeNames.indexOf(props.controller.params().buckets.timeframe);
  const at = (position: number) => timeframeNames[position];

  return (
    <MetricsCard title={t("dashboard.metrics.timeframe")}>
      <Select
        class="metrics-select"
        ariaLabel={t("dashboard.metrics.timeframe")}
        value={props.controller.params().buckets.timeframe}
        options={timeframeNames.map((name) => ({
          value: name,
          label: t(`dashboard.interval.${name}`),
        }))}
        onChange={(value) => props.controller.setTimeframe(value)}
      />
      <div class="metrics-actions">
        <IconButton
          label={t("paginator.first_page")}
          disabled={index() <= 0}
          onClick={() => props.controller.setTimeframe(at(0))}
        >
          <Icon name="first_page" />
        </IconButton>
        <IconButton
          label={t("paginator.previous_page")}
          disabled={index() <= 0}
          onClick={() => props.controller.setTimeframe(at(index() - 1))}
        >
          <Icon name="navigate_before" />
        </IconButton>
        <IconButton
          label={t("paginator.next_page")}
          disabled={index() >= timeframeNames.length - 1}
          onClick={() => props.controller.setTimeframe(at(index() + 1))}
        >
          <Icon name="navigate_next" />
        </IconButton>
        <IconButton
          label={t("paginator.last_page")}
          disabled={index() >= timeframeNames.length - 1}
          onClick={() =>
            props.controller.setTimeframe(at(timeframeNames.length - 1))
          }
        >
          <Icon name="last_page" />
        </IconButton>
      </div>
    </MetricsCard>
  );
}

function ResolutionCard(props: { controller: TorrentMetricsController }) {
  const { t } = useI18n();
  const index = () =>
    resolutionNames.indexOf(props.controller.bucketDuration());
  const at = (position: number) => resolutionNames[position];
  const multiplier = () => props.controller.params().buckets.multiplier;

  return (
    <MetricsCard title={t("dashboard.metrics.resolution")}>
      <div class="metrics-resolution-row">
        <TextInput
          class="metrics-multiplier-field"
          type="number"
          value={typeof multiplier() === "number" ? String(multiplier()) : ""}
          placeholder={String(props.controller.bucketMultiplier())}
          ariaLabel={t("dashboard.metrics.resolution")}
          onInput={(value) =>
            props.controller.setBucketMultiplier(
              /^\d+$/.test(value) ? parseInt(value, 10) : "AUTO",
            )
          }
        />
        <Select
          class="metrics-duration-field"
          ariaLabel={t("dashboard.metrics.resolution")}
          value={props.controller.bucketDuration()}
          options={resolutionNames.map((name) => ({
            value: name,
            label: t(`dashboard.interval.${name}s`),
          }))}
          onChange={(value) => props.controller.setBucketDuration(value)}
        />
      </div>
      <div class="metrics-actions metrics-resolution-actions">
        <IconButton
          label={`${t("dashboard.metrics.resolution")} −`}
          disabled={props.controller.bucketMultiplier() === 1}
          onClick={() =>
            props.controller.setBucketMultiplier(
              props.controller.bucketMultiplier() - 1,
            )
          }
        >
          <Icon name="remove" />
        </IconButton>
        <IconButton
          label={`${t("dashboard.metrics.resolution")} +`}
          onClick={() =>
            props.controller.setBucketMultiplier(
              props.controller.bucketMultiplier() + 1,
            )
          }
        >
          <Icon name="add" />
        </IconButton>
        <IconButton
          label={t("paginator.first_page")}
          disabled={index() <= 0}
          onClick={() => props.controller.setBucketDuration(at(0), undefined)}
        >
          <Icon name="first_page" />
        </IconButton>
        <IconButton
          label={t("paginator.previous_page")}
          disabled={index() <= 0}
          onClick={() =>
            props.controller.setBucketDuration(at(index() - 1), undefined)
          }
        >
          <Icon name="navigate_before" />
        </IconButton>
        <IconButton
          label={t("paginator.next_page")}
          disabled={index() >= resolutionNames.length - 1}
          onClick={() =>
            props.controller.setBucketDuration(at(index() + 1), undefined)
          }
        >
          <Icon name="navigate_next" />
        </IconButton>
        <IconButton
          label={t("paginator.last_page")}
          disabled={index() >= resolutionNames.length - 1}
          onClick={() =>
            props.controller.setBucketDuration(
              at(resolutionNames.length - 1),
              undefined,
            )
          }
        >
          <Icon name="last_page" />
        </IconButton>
      </div>
    </MetricsCard>
  );
}

function SourceCard(props: { controller: TorrentMetricsController }) {
  const { t } = useI18n();
  const sources = () => props.controller.result().availableSources;
  const selected = () => props.controller.params().source;

  return (
    <MetricsCard title={t("torrents.source")}>
      <Select
        class="metrics-select"
        ariaLabel={t("torrents.source")}
        value={selected() ?? "_all"}
        options={[
          { value: "_all", label: t("general.all") },
          ...sources().map((source) => ({
            value: source.key,
            label: source.name,
          })),
        ]}
        onChange={(value) =>
          props.controller.setSource(value === "_all" ? null : value)
        }
      />
      <div class="metrics-actions">
        <IconButton
          class={selected() ? "deselected" : "selected"}
          label={t("general.all")}
          onClick={() => props.controller.setSource(null)}
        >
          <Icon name="workspaces" />
        </IconButton>
        <For each={["dht"]}>
          {(source) => (
            <IconButton
              class={selected() === source ? "selected" : "deselected"}
              label={source}
              onClick={() =>
                selected() === source || props.controller.setSource(source)
              }
            >
              <Icon
                name={
                  selected() === source
                    ? "radio_button_checked"
                    : "radio_button_unchecked"
                }
              />
            </IconButton>
          )}
        </For>
      </div>
    </MetricsCard>
  );
}

function EventCard(props: { controller: TorrentMetricsController }) {
  const { t } = useI18n();
  const selected = () => props.controller.params().event;

  return (
    <MetricsCard title={t("dashboard.metrics.event")}>
      <Select
        class="metrics-select"
        ariaLabel={t("dashboard.metrics.event")}
        value={selected() ?? "_all"}
        options={[
          { value: "_all", label: t("general.all") },
          ...eventNames.map((name) => ({
            value: name,
            label: t(`dashboard.event.${name}`),
          })),
        ]}
        onChange={(value) =>
          props.controller.setEvent(value === "_all" ? null : value)
        }
      />
      <div class="metrics-actions">
        <IconButton
          class={!selected() ? "selected" : "deselected"}
          label={t("general.all")}
          onClick={() => props.controller.setEvent(null)}
        >
          <Icon name="radio_button_checked" />
        </IconButton>
        <IconButton
          class={selected() === "created" ? "selected" : "deselected"}
          label={t("dashboard.event.created")}
          onClick={() =>
            selected() === "created" || props.controller.setEvent("created")
          }
        >
          <Icon name="add_circle" />
        </IconButton>
        <IconButton
          class={selected() === "updated" ? "selected" : "deselected"}
          label={t("dashboard.event.updated")}
          onClick={() =>
            selected() === "updated" || props.controller.setEvent("updated")
          }
        >
          <Icon name="check_circle" />
        </IconButton>
      </div>
    </MetricsCard>
  );
}

function RefreshCard(props: { controller: TorrentMetricsController }) {
  const { t } = useI18n();

  return (
    <MetricsCard title={t("general.refresh")}>
      <Select
        class="metrics-select"
        ariaLabel={t("general.refresh")}
        value={props.controller.params().autoRefresh}
        options={autoRefreshIntervalNames.map((name) => ({
          value: name,
          label: t(`dashboard.interval.${name}`),
        }))}
        onChange={(value) => props.controller.setAutoRefreshInterval(value)}
      />
      <div class="metrics-actions">
        <IconButton
          label={t("general.refresh")}
          onClick={() => props.controller.refresh()}
        >
          <Icon name="sync" />
        </IconButton>
      </div>
    </MetricsCard>
  );
}

/**
 * Torrent metrics dashboard: timeframe/resolution/source/event/refresh
 * controls and the throughput timeline chart.
 */
export function TorrentMetrics() {
  const { t } = useI18n();
  const controller = createTorrentMetricsController();

  return (
    <Loading
      fallback={
        <ProgressBarContainer>
          <ProgressBar indeterminate />
        </ProgressBarContainer>
      }
    >
      <div class="metrics">
        <div class="dashboard-grid metrics-controls">
          <TimeframeCard controller={controller} />
          <ResolutionCard controller={controller} />
          <SourceCard controller={controller} />
          <EventCard controller={controller} />
          <RefreshCard controller={controller} />
        </div>
        <ProgressBarContainer>
          <ProgressBar
            indeterminate={isPending(() => controller.result())}
            value={0}
          />
        </ProgressBarContainer>
        <div class="chart-grid metrics-charts">
          <Show when={controller.result()}>
            {(data) => (
              <ChartCard
                title={t("dashboard.metrics.throughput")}
                data={data()}
                adapter={torrentTimelineAdapter}
                width={550}
                height={400}
              />
            )}
          </Show>
        </div>
      </div>
    </Loading>
  );
}
