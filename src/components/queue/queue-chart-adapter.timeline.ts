import type { ChartConfiguration } from "chart.js";
import { format as formatDate } from "date-fns";
import { translate } from "~/lib/i18n/messages";
import {
  formatDuration,
  formatIntEstimate,
  resolveDateLocale,
} from "~/lib/format/format";
import type { ChartAdapter, ChartContext } from "~/components/charts/Chart";
import {
  durationSeconds,
  eventNames,
  timeframeLengths,
  type BucketParams,
  type EventName,
} from "./queue.constants";
import {
  normalizeBucket,
  type EventBucketEntries,
  type Result,
} from "./queue-metrics";

const eventPaletteIndex: Record<EventName, number> = {
  created: 0,
  processed: 5,
  failed: 3,
};

const paletteColor = (colors: ChartContext["colors"], index: number) =>
  colors.chartPalette[index % colors.chartPalette.length] ?? colors.text;

const formatBucketKey = (
  params: BucketParams<false>,
  key: number,
  lang: string,
): string => {
  let formatStr: string;
  switch (params.duration) {
    case "day":
      formatStr = "d LLL";
      break;
    case "hour":
      formatStr = "d LLL H:00";
      break;
    case "minute":
      formatStr = "H:mm";
      break;
  }
  return formatDate(
    new Date(1000 * durationSeconds[params.duration] * params.multiplier * key),
    formatStr,
    { locale: resolveDateLocale(lang) },
  );
};

/** Mirrors the Angular adapter's coarse latency formatting. */
const formatLatency = (value: number | string, lang: string): string => {
  let total = typeof value === "string" ? Number.parseInt(value, 10) : value;
  if (!total) {
    return "0";
  }
  let seconds = total;
  let minutes = 0;
  let hours = 0;
  let days = 0;
  if (seconds >= 60) {
    minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    if (minutes >= 5) {
      seconds = 0;
      if (minutes >= 60) {
        hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
        if (hours >= 5) {
          minutes = 0;
          if (hours >= 24) {
            days = Math.floor(hours / 24);
            hours = hours % 24;
          }
        }
      }
    }
  }
  return formatDuration({ days, hours, minutes, seconds }, lang);
};

const countInBucket = (
  entries: EventBucketEntries | undefined,
  index: number,
): number => entries?.[`${index}`]?.count ?? 0;

/**
 * Job throughput per queue and event (plus a latency series) over time.
 * Port of the Angular QueueChartAdapterTimeline.
 */
export const queueTimelineAdapter: ChartAdapter<Result, "line"> = {
  create(result, context) {
    const { legend, lang, colors } = context;
    const labels: string[] = [];
    const datasets: ChartConfiguration<"line">["data"]["datasets"] = [];
    if (result) {
      const nonEmptyQueues = result.queues.filter((queue) => !queue.isEmpty);
      const nonEmptyBuckets = Array.from(
        new Set(
          nonEmptyQueues.flatMap((queue) =>
            queue.events
              ? [queue.events.earliestBucket, queue.events.latestBucket]
              : [],
          ),
        ),
      ).sort((a, b) => a - b);
      if (nonEmptyBuckets.length) {
        const now = new Date();
        const timeframe = result.params.buckets.timeframe;
        const minBucket =
          timeframe === "all"
            ? nonEmptyBuckets[0]
            : Math.min(
                nonEmptyBuckets[0],
                normalizeBucket(
                  Date.now() - 1000 * timeframeLengths[timeframe],
                  result.params.buckets,
                ).index,
              );
        const maxBucket = Math.max(
          nonEmptyBuckets[nonEmptyBuckets.length - 1],
          normalizeBucket(now, result.params.buckets).index,
        );
        for (let index = minBucket; index <= maxBucket; index += 1) {
          labels.push(formatBucketKey(result.params.buckets, index, lang));
        }
        const relevantEvents = eventNames.filter(
          (event) =>
            result.params.event === undefined || result.params.event === event,
        );
        for (const queue of nonEmptyQueues) {
          for (const event of relevantEvents) {
            const series: number[] = [];
            for (let index = minBucket; index <= maxBucket; index += 1) {
              series.push(
                countInBucket(
                  queue.events?.eventBuckets[event]?.entries,
                  index,
                ),
              );
            }
            const color = paletteColor(colors, eventPaletteIndex[event]);
            datasets.push({
              yAxisID: "yCount",
              label: `${queue.queue}: ${translate(
                lang,
                `dashboard.queues.${event}`,
              )}`,
              data: series,
              borderColor: color,
              pointBackgroundColor: color,
              pointBorderColor: colors.background,
              pointHoverBackgroundColor: color,
              pointHoverBorderColor: colors.text,
            });
          }
          const latencyEvents = (["processed", "failed"] as const).filter(
            (event) => relevantEvents.includes(event),
          );
          if (latencyEvents.length) {
            const latencySeries: Array<number | null> = [];
            for (let index = minBucket; index <= maxBucket; index += 1) {
              const aggregate = latencyEvents.reduce<[number, number] | null>(
                (acc, event) => {
                  const entry =
                    queue.events?.eventBuckets[event]?.entries?.[`${index}`];
                  if (!entry?.count) {
                    return acc;
                  }
                  return [
                    (acc?.[0] ?? 0) + entry.latency,
                    (acc?.[1] ?? 0) + entry.count,
                  ];
                },
                null,
              );
              latencySeries.push(
                aggregate ? aggregate[0] / aggregate[1] : null,
              );
            }
            datasets.push({
              yAxisID: "yLatency",
              label: `${queue.queue}: ${translate(
                lang,
                "dashboard.queues.latency",
              )}`,
              data: latencySeries,
              borderColor: paletteColor(colors, 2),
              pointHoverBackgroundColor: paletteColor(colors, 2),
              pointHoverBorderColor: colors.text,
            });
          }
        }
      }
    }
    return {
      type: "line",
      options: {
        animation: false,
        responsive: true,
        elements: {
          line: {
            tension: 0.5,
          },
        },
        scales: {
          x: {
            ticks: { color: colors.textMuted },
            grid: { color: colors.chartGrid },
          },
          yCount: {
            position: "left",
            ticks: {
              color: colors.text,
              callback: (value) =>
                formatIntEstimate(Number(value), lang, false),
            },
            grid: { color: colors.chartGrid },
          },
          yLatency: {
            position: "right",
            ticks: {
              color: colors.text,
              callback: (value) => formatLatency(Number(value), lang),
            },
            grid: { color: colors.chartGrid },
          },
        },
        plugins: {
          legend: {
            display: legend,
            labels: { color: colors.text },
          },
          decimation: {
            enabled: true,
          },
          tooltip: {
            backgroundColor: colors.surfaceRaised,
            titleColor: colors.text,
            bodyColor: colors.text,
            borderColor: colors.border,
            borderWidth: 1,
            callbacks: {
              label: (tooltipContext) =>
                tooltipContext.dataset.yAxisID === "yCount"
                  ? tooltipContext.formattedValue
                  : formatLatency(tooltipContext.parsed.y ?? 0, lang),
            },
          },
        },
      },
      data: {
        labels,
        datasets,
      },
    };
  },
};
