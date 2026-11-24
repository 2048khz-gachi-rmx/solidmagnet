import {
  createEffect,
  createMemo,
  createSignal,
  For,
  isPending,
  Loading,
  Show,
} from "solid-js";
import { Title } from "@solidjs/meta";
import { useSearchParams } from "@solidjs/router";
import { createGraphqlQuery } from "~/lib/graphql/query";
import { QueueJobsDocument } from "~/lib/graphql/generated";
import type {
  QueueJobStatus,
  QueueJobsOrderByField,
} from "~/lib/graphql/schema-types";
import { useI18n } from "~/lib/i18n/I18nProvider";
import { useBreakpoints } from "~/lib/platform/breakpoints";
import { Button, IconButton } from "~/components/ui/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ProgressBar,
  ProgressBarContainer,
} from "~/components/ui/Card";
import { Checkbox, Select } from "~/components/ui/Field";
import { Icon } from "~/components/ui/Icon";
import { Paginator, type PageEvent } from "~/components/ui/Paginator";
import { DrawerLayout, Sidebar } from "~/components/ui/Sidebar";
import {
  buildFacetInfos,
  controlsToParams,
  controlsToQueryVariables,
  orderByOptions,
  paramsToControls,
  type FacetInfo,
  type FacetKey,
  type QueueJobsControls,
} from "./queue-jobs";
import { QueueJobsTable } from "./QueueJobsTable";

const withFacetFilter = (
  controls: QueueJobsControls,
  key: FacetKey,
  filter: string[] | undefined,
): QueueJobsControls =>
  key === "status"
    ? {
        ...controls,
        facets: {
          ...controls.facets,
          status: { filter: filter as QueueJobStatus[] | undefined },
        },
      }
    : { ...controls, facets: { ...controls.facets, queue: { filter } } };

export default function QueueJobsPage() {
  const { t, formatNumber } = useI18n();
  const breakpoints = useBreakpoints();
  const [searchParams, setSearchParams] = useSearchParams();
  const [drawerOpen, setDrawerOpen] = createSignal(false);

  createEffect(
    () => breakpoints.atLeast("Medium"),
    (atLeast) => {
      setDrawerOpen(atLeast);
    },
  );

  const controls = createMemo(() => paramsToControls(searchParams));
  const jobs = createGraphqlQuery(QueueJobsDocument, () =>
    controlsToQueryVariables(controls()),
  );
  const result = createMemo(() => jobs.data()!.queue.jobs);
  const facetInfos = createMemo(() =>
    buildFacetInfos(controls(), result().aggregations, t),
  );

  const updateControls = (
    fn: (current: QueueJobsControls) => QueueJobsControls,
  ) => {
    const next = fn(controls());
    setSearchParams(controlsToParams(next), { replace: true });
  };

  const setFacetFilter = (key: FacetKey, filter: string[] | undefined) => {
    updateControls((current) => ({
      ...withFacetFilter(current, key, filter),
      page: 1,
    }));
  };

  const activateFilter = (facet: FacetInfo, value: string) => {
    setFacetFilter(
      facet.key,
      Array.from(new Set([...(facet.filter ?? []), value])).sort(),
    );
  };

  const deactivateFilter = (facet: FacetInfo, value: string) => {
    const next = (facet.filter ?? []).filter((entry) => entry !== value);
    setFacetFilter(facet.key, next.length ? next : undefined);
  };

  const selectOrderBy = (field: QueueJobsOrderByField) => {
    const option = orderByOptions.find(
      (candidate) => candidate.field === field,
    );
    updateControls((current) => ({
      ...current,
      orderBy: { field, descending: option?.descending ?? false },
      page: 1,
    }));
  };

  const toggleOrderByDirection = () => {
    updateControls((current) => ({
      ...current,
      orderBy: {
        ...current.orderBy,
        descending: !current.orderBy.descending,
      },
      page: 1,
    }));
  };

  const handlePageEvent = (event: PageEvent) => {
    updateControls((current) => ({
      ...current,
      limit: event.pageSize,
      page: event.page,
    }));
  };

  return (
    <>
      <Title>
        {`${t("routes.jobs")} - ${t("routes.queues")} - ${t(
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
        <DrawerLayout
          sidebar={
            <Sidebar
              open={drawerOpen()}
              onClose={() => setDrawerOpen(false)}
              class="queue-jobs-sidebar"
            >
              <For each={facetInfos()}>
                {(facet) => (
                  <Card>
                    <CardHeader>
                      <CardTitle>{t(`facets.${facet.key}`)}</CardTitle>
                    </CardHeader>
                    <CardContent
                      class={facet.filter?.length ? "filtered" : "unfiltered"}
                    >
                      <For each={facet.aggregations}>
                        {(agg) => (
                          <Checkbox
                            checked={facet.filter?.includes(agg.value) ?? false}
                            label={
                              <>
                                {agg.label}{" "}
                                <small>{formatNumber(agg.count)}</small>
                              </>
                            }
                            onChange={(checked) =>
                              checked
                                ? activateFilter(facet, agg.value)
                                : deactivateFilter(facet, agg.value)
                            }
                          />
                        )}
                      </For>
                      <Show when={facet.aggregations.length === 0}>
                        <span class="muted small">{t("general.none")}</span>
                      </Show>
                    </CardContent>
                  </Card>
                )}
              </For>
            </Sidebar>
          }
        >
          <div class="query-form">
            <div class="form-field-container button-container-toggle-drawer">
              <IconButton
                label={t("torrents.toggle_drawer")}
                onClick={() => setDrawerOpen((open) => !open)}
              >
                <Icon
                  name={
                    drawerOpen() ? "arrow_circle_left" : "arrow_circle_right"
                  }
                />
              </IconButton>
            </div>
            <div class="form-field-container form-field-container-order-by">
              <Select
                class="queue-order-by"
                label={t("torrents.order_by")}
                value={controls().orderBy.field}
                options={orderByOptions.map((option) => ({
                  value: option.field,
                  label: t(`dashboard.queues.${option.field}`),
                }))}
                onChange={(field) => selectOrderBy(field)}
              />
              <IconButton
                label={t("torrents.order_direction_toggle")}
                onClick={toggleOrderByDirection}
              >
                <Icon
                  name={
                    controls().orderBy.descending
                      ? "arrow_downward"
                      : "arrow_upward"
                  }
                />
              </IconButton>
            </div>
            <div class="form-field-container button-container-refresh">
              <Button
                variant="mini-fab"
                title={t("torrents.refresh")}
                onClick={() => jobs.refetch()}
              >
                <Icon name="sync" />
              </Button>
            </div>
          </div>
          <ProgressBarContainer>
            <ProgressBar
              indeterminate={isPending(() => jobs.data())}
              value={0}
            />
          </ProgressBarContainer>
          <QueueJobsTable items={result().items} />
          <Paginator
            page={controls().page}
            pageSize={controls().limit}
            pageLength={result().items.length}
            totalLength={result().totalCount}
            totalIsEstimate={false}
            hasNextPage={result().hasNextPage}
            showLastPage
            onPageChange={handlePageEvent}
          />
        </DrawerLayout>
      </Loading>
    </>
  );
}
