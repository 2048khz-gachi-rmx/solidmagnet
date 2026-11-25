import { createEffect, createSignal } from "solid-js";
import {
  Chart as ChartJs,
  registerables,
  type ChartConfiguration,
  type ChartType,
} from "chart.js";
import { useI18n } from "~/lib/i18n/I18nProvider";
import { useTheme } from "~/lib/theme/ThemeProvider";
import type { ThemeColors } from "~/lib/theme/themes";
import { Card, CardContent, CardHeader } from "~/components/ui/Card";
import { Icon } from "~/components/ui/Icon";

ChartJs.register(...registerables);

export type ChartContext = {
  legend: boolean;
  lang: string;
  colors: ThemeColors;
};

export type ChartConfigFactory<
  Data = unknown,
  Type extends ChartType = ChartType,
> = (data: Data | undefined, context: ChartContext) => ChartConfiguration<Type>;

export interface ChartAdapter<
  Data = unknown,
  Type extends ChartType = ChartType,
> {
  create: ChartConfigFactory<Data, Type>;
}

type ChartCardProps<Data> = {
  title: string;
  data: Data | undefined;
  adapter: ChartAdapter<Data>;
  width?: number;
  height?: number;
};

/**
 * Thin Chart.js wrapper. Data is passed as a value; adapters are pure
 * functions of (data, theme, language, legend) so charts re-render correctly
 * after a theme or language change.
 */
export function ChartCard<Data>(props: ChartCardProps<Data>) {
  const { t, lang } = useI18n();
  const { colors } = useTheme();
  const [legend, setLegend] = createSignal(true);
  let canvas!: HTMLCanvasElement;
  let chart: ChartJs | undefined;

  createEffect(
    () =>
      props.adapter.create(props.data, {
        legend: legend(),
        lang: lang(),
        colors: colors(),
      }),
    (configuration) => {
      chart?.destroy();
      configuration.options = {
        ...configuration.options,
        responsive: true,
        maintainAspectRatio: false,
      };
      chart = new ChartJs(canvas, configuration);
      return () => {
        chart?.destroy();
        chart = undefined;
      };
    },
  );

  return (
    <Card class="chart-card">
      <CardHeader>
        <h4 class="card-title">
          <button
            type="button"
            class={["btn btn-icon legend-toggle", { active: legend() }]}
            title={t("dashboard.metrics.toggle_legend")}
            onClick={() => setLegend((value) => !value)}
          >
            <Icon name="legend_toggle" />
          </button>
          {props.title}
        </h4>
      </CardHeader>
      <CardContent>
        <div
          class="chart-canvas-wrap"
          style={{ height: `${props.height ?? 400}px` }}
        >
          <canvas
            ref={canvas}
            width={props.width ?? 550}
            height={props.height ?? 400}
          />
        </div>
      </CardContent>
    </Card>
  );
}
