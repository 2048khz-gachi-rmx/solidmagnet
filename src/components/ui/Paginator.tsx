import { Show } from "solid-js";
import { useI18n } from "~/lib/i18n/I18nProvider";
import { formatIntEstimate } from "~/lib/format/format";
import { Icon } from "./Icon";
import { IconButton } from "./Button";
import { Select } from "./Field";

export type PageEvent = {
  page: number;
  pageSize: number;
};

type PaginatorProps = {
  page: number;
  pageSize: number;
  pageSizes?: number[];
  pageLength: number;
  totalLength?: number | null;
  totalIsEstimate?: boolean;
  hasNextPage?: boolean | null;
  showLastPage?: boolean;
  onPageChange: (event: PageEvent) => void;
};

export function Paginator(props: PaginatorProps) {
  const { t, lang } = useI18n();

  const firstItemIndex = () => (props.page - 1) * props.pageSize + 1;
  const lastItemIndex = () =>
    (props.page - 1) * props.pageSize + props.pageLength;
  const hasTotalLength = () => typeof props.totalLength === "number";
  const hasPreviousPage = () => props.page > 1;
  const pageCount = () => {
    if (typeof props.totalLength !== "number") return null;
    return Math.ceil(props.totalLength / props.pageSize);
  };
  const actuallyHasNextPage = () => {
    if (typeof props.hasNextPage === "boolean") return props.hasNextPage;
    if (typeof props.totalLength !== "number") return false;
    return props.page * props.pageSize < props.totalLength;
  };

  const emit = (page: number, pageSize = props.pageSize) =>
    props.onPageChange({ page, pageSize });

  const sizes = () => props.pageSizes ?? [10, 20, 50, 100];

  return (
    <div class="paginator">
      <Select
        class="field-items-per-page"
        label={t("paginator.items_per_page")}
        value={props.pageSize}
        options={sizes().map((size) => ({ value: size, label: String(size) }))}
        onChange={(size) => emit(1, size)}
      />
      <p class="paginator-description">
        <Show
          when={hasTotalLength()}
          fallback={t("paginator.x_to_y", {
            x: firstItemIndex(),
            y: lastItemIndex(),
          })}
        >
          {t("paginator.x_to_y_of_z", {
            x: firstItemIndex(),
            y: lastItemIndex(),
            z: formatIntEstimate(
              props.totalLength ?? 0,
              lang(),
              props.totalIsEstimate,
            ),
          })}
        </Show>
      </p>
      <div class="paginator-navigation">
        <IconButton
          label={t("paginator.first_page")}
          disabled={!hasPreviousPage()}
          onClick={() => emit(1)}
        >
          <Icon name="first_page" />
        </IconButton>
        <IconButton
          label={t("paginator.previous_page")}
          disabled={!hasPreviousPage()}
          onClick={() => emit(props.page - 1)}
        >
          <Icon name="navigate_before" />
        </IconButton>
        <IconButton
          label={t("paginator.next_page")}
          disabled={!actuallyHasNextPage()}
          onClick={() => emit(props.page + 1)}
        >
          <Icon name="navigate_next" />
        </IconButton>
        <Show when={props.showLastPage}>
          <IconButton
            label={t("paginator.last_page")}
            disabled={pageCount() === null || pageCount() === props.page}
            onClick={() => emit(pageCount() ?? 1)}
          >
            <Icon name="last_page" />
          </IconButton>
        </Show>
      </div>
    </div>
  );
}
