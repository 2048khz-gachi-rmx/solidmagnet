import type { ChartConfiguration } from "chart.js";
import type { QueueJobStatus } from "~/lib/graphql/schema-types";
import { formatIntEstimate } from "~/lib/format/format";
import type { ChartAdapter, ChartContext } from "~/components/charts/Chart";
import { statusNames } from "./queue.constants";
import type { Result } from "./queue-metrics";
import { translate } from "~/lib/i18n/messages";

const statusPaletteIndex: Record<QueueJobStatus, number> = {
  pending: 0,
  processed: 5,
  failed: 3,
  retry: 4,
};

const paletteColor = (colors: ChartContext["colors"], index: number) =>
  colors.chartPalette[index % colors.chartPalette.length] ?? colors.text;

/**
 * Total job counts per queue and status. Port of the Angular
 * QueueChartAdapterTotals.
 */
export const queueTotalsAdapter: ChartAdapter<Result, "bar"> = {
  create(result, context) {
    const { legend, lang, colors } = context;
    const labels: string[] = [];
    const datasets: ChartConfiguration<"bar">["data"]["datasets"] = [];
    if (result) {
      const nonEmptyQueues = result.queues.filter((queue) => !queue.isEmpty);
      labels.push(...nonEmptyQueues.map((queue) => queue.queue));
      const statuses: QueueJobStatus[] = [];
      switch (result.params.event) {
        case "created":
          statuses.push("pending");
          break;
        case "processed":
          statuses.push("processed");
          break;
        case "failed":
          statuses.push("retry", "failed");
          break;
        default:
          statuses.push(...statusNames);
          break;
      }
      datasets.push(
        ...statuses.map((status) => ({
          label: translate(lang, `dashboard.queues.${status}`),
          data: nonEmptyQueues.map((queue) => queue.statusCounts[status]),
          backgroundColor: paletteColor(colors, statusPaletteIndex[status]),
        })),
      );
    }
    return {
      type: "bar",
      options: {
        animation: false,
        responsive: true,
        indexAxis: "y",
        scales: {
          x: {
            ticks: {
              color: colors.textMuted,
              callback: (value) =>
                formatIntEstimate(Number(value), lang, false),
            },
            grid: { color: colors.chartGrid },
          },
          y: {
            ticks: { color: colors.text },
            grid: { color: colors.chartGrid },
          },
        },
        plugins: {
          legend: {
            display: legend,
            labels: { color: colors.text },
          },
          tooltip: {
            backgroundColor: colors.surfaceRaised,
            titleColor: colors.text,
            bodyColor: colors.text,
            borderColor: colors.border,
            borderWidth: 1,
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
