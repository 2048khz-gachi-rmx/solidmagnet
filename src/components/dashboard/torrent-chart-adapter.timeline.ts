import type { ChartConfiguration } from "chart.js";
import { format as formatDate } from "date-fns";
import type { ChartAdapter } from "~/components/charts/Chart";
import { resolveDateLocale } from "~/lib/format/format";
import {
  durationSeconds,
  eventNames,
  timeframeLengths,
} from "./torrent-metrics.constants";
import type { BucketParams, EventName, Result } from "./torrent-metrics.types";
import { normalizeBucket } from "./torrent-metrics.utils";

/** Palette slots, following the original primary/secondary event colors. */
const eventColorIndex: Record<EventName, number> = {
  created: 0,
  updated: 1,
};

const withAlpha = (color: string, alpha: number): string => {
  const hex = color.trim();
  if (!hex.startsWith("#")) return color;
  const expanded =
    hex.length === 4
      ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
      : hex;
  if (expanded.length !== 7) return color;
  const red = parseInt(expanded.slice(1, 3), 16);
  const green = parseInt(expanded.slice(3, 5), 16);
  const blue = parseInt(expanded.slice(5, 7), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

/**
 * Timeline adapter: event counts per source over the selected bucket grid.
 * Ported from torrent-chart-adapter.timeline.ts.
 */
export const torrentTimelineAdapter: ChartAdapter<Result, "line"> = {
  create(result, { legend, lang, colors }) {
    const labels: string[] = [];
    const datasets: ChartConfiguration<"line">["data"]["datasets"] = [];
    const palette =
      colors.chartPalette.length > 0 ? colors.chartPalette : [colors.primary];
    if (result) {
      const nonEmptySources = result.sourceSummaries.filter(
        (source) => !source.isEmpty,
      );
      const nonEmptyBuckets = Array.from(
        new Set(
          nonEmptySources.flatMap((source) =>
            source.events
              ? [source.events.earliestBucket, source.events.latestBucket]
              : [],
          ),
        ),
      ).sort((a, b) => a - b);
      if (nonEmptyBuckets.length) {
        const now = new Date();
        const minBucket = Math.min(
          nonEmptyBuckets[0],
          normalizeBucket(
            now.getTime() -
              1000 * timeframeLengths[result.params.buckets.timeframe],
            result.params.buckets,
          ).index,
        );
        const maxBucket = Math.max(
          nonEmptyBuckets[nonEmptyBuckets.length - 1],
          normalizeBucket(now, result.params.buckets).index,
        );
        for (let i = minBucket; i <= maxBucket; i++) {
          labels.push(formatBucketKey(result.params.buckets, i, lang));
        }
        const relevantEvents = eventNames.filter(
          (name) => (result.params.event ?? name) === name,
        );
        for (const source of nonEmptySources) {
          for (const event of relevantEvents) {
            const series: number[] = [];
            for (let i = minBucket; i <= maxBucket; i++) {
              series.push(
                source.events?.eventBuckets?.[event]?.entries?.[`${i}`]
                  ?.count ?? 0,
              );
            }
            const baseColor =
              palette[eventColorIndex[event] % palette.length] ?? colors.text;
            datasets.push({
              yAxisID: "yCount",
              label: [source.source, event].join("/"),
              data: series,
              borderColor: baseColor,
              pointBackgroundColor: withAlpha(baseColor, 0.2),
              pointBorderColor: baseColor,
              pointHoverBackgroundColor: withAlpha(baseColor, 0.4),
              pointHoverBorderColor: withAlpha(baseColor, 0.6),
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
            ticks: {
              color: colors.textMuted,
            },
            grid: {
              color: colors.chartGrid,
            },
          },
          yCount: {
            position: "left",
            ticks: {
              color: colors.text,
              callback: (value) =>
                parseInt(value as string).toLocaleString(lang),
            },
            grid: {
              color: colors.chartGrid,
            },
          },
        },
        plugins: {
          legend: {
            display: legend,
            labels: {
              color: colors.text,
            },
          },
          tooltip: {
            backgroundColor: colors.background,
            titleColor: colors.text,
            bodyColor: colors.text,
            borderColor: colors.chartGrid,
            borderWidth: 1,
            callbacks: {
              label: (item) =>
                `${item.dataset.label ?? ""}: ${new Intl.NumberFormat(lang).format(Number(item.parsed.y))}`,
            },
          },
          decimation: {
            enabled: true,
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
