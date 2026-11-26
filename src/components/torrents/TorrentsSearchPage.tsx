import {
  createEffect,
  createMemo,
  createSignal,
  For,
  Loading,
  Show,
  isPending,
} from "solid-js";
import { Title } from "@solidjs/meta";
import { Button, IconButton } from "~/components/ui/Button";
import { Divider, ProgressBar } from "~/components/ui/Card";
import { Checkbox, Select, TextInput } from "~/components/ui/Field";
import { ExpansionPanel } from "~/components/ui/ExpansionPanel";
import { Icon } from "~/components/ui/Icon";
import { Paginator } from "~/components/ui/Paginator";
import { DrawerLayout, Sidebar } from "~/components/ui/Sidebar";
import { createGraphqlQuery, type QueryResult } from "~/lib/graphql/query";
import {
  TorrentContentSearchDocument,
  type TorrentContentSearchQuery,
  type TorrentContentSearchQueryVariables,
} from "~/lib/graphql/generated";
import type { ContentType } from "~/lib/graphql/schema-types";
import { formatIntEstimate } from "~/lib/format/format";
import { useI18n } from "~/lib/i18n/I18nProvider";
import { useBreakpoints } from "~/lib/platform/breakpoints";
import { contentTypeList } from "~/lib/content-types";
import { TorrentsBulkActions } from "./TorrentsBulkActions";
import { TorrentsTable } from "./TorrentsTable";
import { createTorrentFilesState } from "./TorrentFilesTable";
import {
  controlsToQueryVariables,
  facets,
  orderByOptions,
  useTorrentsSearch,
  type TorrentsSearchState,
} from "./search-controls";

export default function TorrentsSearchPage() {
  const { t } = useI18n();
  const [cached, setCached] = createSignal(true);
  const [refreshVersion, setRefreshVersion] = createSignal(0);

  const search = useTorrentsSearch(() => setCached(true));

  const variables = createMemo<TorrentContentSearchQueryVariables>(() => {
    refreshVersion();
    return controlsToQueryVariables(search.query, cached());
  });

  const query = createGraphqlQuery(TorrentContentSearchDocument, variables);

  const refresh = () => {
    setCached(false);
    setRefreshVersion((version) => version + 1);
  };

  const title = createMemo(() => {
    const query = search.query;
    const parts = [
      query.queryString,
      query.contentType && query.contentType !== "null"
        ? t(`content_types.plural.${query.contentType}`)
        : null,
      query.page > 1 ? t("paginator.page_x", { x: query.page }) : null,
      t("routes.torrents"),
      "bitmagnet",
    ];
    return parts.filter(Boolean).join(" - ");
  });

  return (
    <>
      <Title>{title()}</Title>
      <Loading
        fallback={
          <div class="page-loading">
            <ProgressBar indeterminate />
          </div>
        }
      >
        <TorrentsSearchBody search={search} query={query} refresh={refresh} />
      </Loading>
    </>
  );
}

type TorrentsSearchBodyProps = {
  search: TorrentsSearchState;
  query: QueryResult<TorrentContentSearchQuery>;
  refresh: () => void;
};

function TorrentsSearchBody(props: TorrentsSearchBodyProps) {
  const { t, lang } = useI18n();
  const { atLeast } = useBreakpoints();

  const [mobileOpen, setMobileOpen] = createSignal(false);
  const [desktopOpen, setDesktopOpen] = createSignal(true);
  const drawerOpen = () => (atLeast("Medium") ? desktopOpen() : mobileOpen());
  const toggleDrawer = () => {
    if (atLeast("Medium")) setDesktopOpen((open) => !open);
    else setMobileOpen((open) => !open);
  };
  const [contentTypeOpen, setContentTypeOpen] = createSignal(true);

  const [draft, setDraft] = createSignal("");
  createEffect(
    () => props.search.query.queryString,
    (queryString) => {
      setDraft(queryString ?? "");
    },
  );

  const [selection, setSelection] = createSignal<string[]>([]);

  // The files of the expanded torrent are the page's business: the detail row
  // is re-created whenever the result page around it changes, and a request
  // owned by that row would be restarted with it.
  const expandedTorrent = createMemo(() =>
    props.query
      .data()!
      .torrentContent.search.items.find(
        (item) =>
          item.infoHash === props.search.selection.selectedTorrent?.infoHash,
      ),
  );
  const filesState = createTorrentFilesState(() => expandedTorrent()?.torrent);

  const result = () => props.query.data()!.torrentContent.search;
  const items = () => result().items;
  const loading = createMemo(() => isPending(() => props.query.data()));

  const selectedItems = createMemo(() => {
    const selected = new Set(selection());
    return items().filter((item) => selected.has(item.infoHash));
  });

  // Selections that fall outside the current result set stay in the signal but
  // are filtered out here, so no effect has to relay query data into the
  // selection signal.

  const contentTypeCounts = createMemo(() => {
    const counts: Record<string, { count: number; isEstimate: boolean }> = {};
    for (const agg of result().aggregations.contentType ?? []) {
      counts[agg.value ?? "null"] = {
        count: agg.count,
        isEstimate: agg.isEstimate,
      };
    }
    return counts;
  });

  const overallTotalCount = createMemo(() => {
    let count = 0;
    let isEstimate = false;
    for (const agg of result().aggregations.contentType ?? []) {
      count += agg.count;
      isEstimate = isEstimate || agg.isEstimate;
    }
    return { count, isEstimate };
  });

  const [availableContentTypes, setAvailableContentTypes] = createSignal<
    string[]
  >([]);
  createEffect(
    () => result().aggregations.contentType,
    (aggregations) => {
      const values = (aggregations ?? []).flatMap((agg) =>
        agg.value ? [agg.value] : [],
      );
      if (!values.length) return;
      setAvailableContentTypes((previous) => {
        const next = new Set<string>(previous);
        for (const value of values) next.add(value);
        return [...next];
      });
    },
  );

  const facetInfos = createMemo(() => {
    const query = props.search.query;
    return facets.map((facet) => {
      const input = query.facets[facet.inputKey];
      const contentType = query.contentType;
      return {
        facet,
        active: input.active,
        filter: input.filter,
        relevant:
          !facet.contentTypes ||
          (!!contentType &&
            contentType !== "null" &&
            facet.contentTypes.includes(contentType as ContentType)),
        aggregations: facet
          .extractAggregations(result().aggregations)
          .map((aggregation) => ({
            ...aggregation,
            label: facet.resolveLabel(aggregation, t),
          })),
      };
    });
  });

  const orderOptions = createMemo(() =>
    orderByOptions.filter(
      (option) =>
        option.field !== "relevance" ||
        !!draft() ||
        !!props.search.query.queryString,
    ),
  );

  const clearQuery = () => {
    setDraft("");
    props.search.setQueryString(null);
  };

  return (
    <DrawerLayout
      class="torrents-layout"
      sidebar={
        <Sidebar
          open={drawerOpen()}
          onClose={() => setMobileOpen(false)}
          class={!drawerOpen() ? "torrents-sidebar-closed" : undefined}
        >
          <ExpansionPanel
            class="panel-content-type"
            title={t("facets.content_type")}
            icon="interests"
            open={contentTypeOpen()}
            onToggle={setContentTypeOpen}
          >
            <nav class="content-type-nav">
              <ul>
                <li
                  class={{
                    active: props.search.query.contentType === null,
                  }}
                  onClick={() => props.search.selectContentType(null)}
                >
                  <Icon name="emergency" />
                  <span>{t("content_types.plural.all")}</span>
                  <small>
                    {formatIntEstimate(
                      overallTotalCount().count,
                      lang(),
                      overallTotalCount().isEstimate,
                    )}
                  </small>
                </li>
                <For each={contentTypeList}>
                  {(contentType) => (
                    <Show
                      when={
                        contentType.key === "null" ||
                        availableContentTypes().includes(contentType.key) ||
                        props.search.query.contentType === contentType.key
                      }
                    >
                      <li
                        class={{
                          active:
                            props.search.query.contentType === contentType.key,
                        }}
                        onClick={() =>
                          props.search.selectContentType(contentType.key)
                        }
                      >
                        <Icon name={contentType.icon} />
                        <span>
                          {t(`content_types.plural.${contentType.key}`)}
                        </span>
                        <small>
                          {formatIntEstimate(
                            contentTypeCounts()[contentType.key]?.count ?? 0,
                            lang(),
                            contentTypeCounts()[contentType.key]?.isEstimate ??
                              false,
                          )}
                        </small>
                      </li>
                    </Show>
                  )}
                </For>
              </ul>
            </nav>
          </ExpansionPanel>

          <For each={facetInfos()}>
            {(info) => (
              <Show when={info.relevant}>
                <ExpansionPanel
                  title={t(`facets.${info.facet.key}`)}
                  icon={info.facet.icon}
                  open={info.active}
                  onToggle={(open) => {
                    if (open) props.search.activateFacet(info.facet);
                    else props.search.deactivateFacet(info.facet);
                  }}
                >
                  <Show
                    when={info.filter?.length}
                    fallback={
                      <section class="facet-values unfiltered">
                        <Show
                          when={info.aggregations.length}
                          fallback={<span>{t("general.none")}</span>}
                        >
                          <For each={info.aggregations}>
                            {(aggregation) => (
                              <Checkbox
                                checked
                                label={
                                  <>
                                    {aggregation.label}
                                    <small>
                                      {formatIntEstimate(
                                        aggregation.count,
                                        lang(),
                                        aggregation.isEstimate,
                                      )}
                                    </small>
                                  </>
                                }
                                onChange={() =>
                                  props.search.activateFilter(
                                    info.facet,
                                    aggregation.value,
                                  )
                                }
                              />
                            )}
                          </For>
                        </Show>
                      </section>
                    }
                  >
                    <section class="facet-values filtered">
                      <For each={info.aggregations}>
                        {(aggregation) => (
                          <Checkbox
                            checked={
                              info.filter?.includes(aggregation.value) ?? false
                            }
                            label={
                              <>
                                {aggregation.label}
                                <small>
                                  {formatIntEstimate(
                                    aggregation.count,
                                    lang(),
                                    aggregation.isEstimate,
                                  )}
                                </small>
                              </>
                            }
                            onChange={(checked) => {
                              if (checked)
                                props.search.activateFilter(
                                  info.facet,
                                  aggregation.value,
                                );
                              else
                                props.search.deactivateFilter(
                                  info.facet,
                                  aggregation.value,
                                );
                            }}
                          />
                        )}
                      </For>
                    </section>
                  </Show>
                </ExpansionPanel>
              </Show>
            )}
          </For>
        </Sidebar>
      }
    >
      <div class="search-form">
        <IconButton
          class="button-toggle-drawer"
          label={t("torrents.toggle_drawer")}
          onClick={toggleDrawer}
        >
          <Icon
            name={drawerOpen() ? "arrow_circle_left" : "arrow_circle_right"}
          />
        </IconButton>

        <div class="search-field">
          <TextInput
            class="search-query"
            value={draft()}
            placeholder={t("torrents.search")}
            ariaLabel={t("torrents.search")}
            onInput={setDraft}
            onEnter={(value) => props.search.setQueryString(value)}
          />
          <Show when={draft()}>
            <IconButton
              class="search-clear"
              label={t("torrents.clear_search")}
              onClick={clearQuery}
            >
              <Icon name="close" />
            </IconButton>
          </Show>
          <IconButton
            class="search-submit"
            label={t("torrents.search")}
            onClick={() => props.search.setQueryString(draft())}
          >
            <Icon name="search" />
          </IconButton>
        </div>

        <div class="order-by-field">
          <Select
            class="order-by-select"
            label={t("torrents.order_by")}
            value={props.search.query.orderBy.field}
            options={orderOptions().map((option) => ({
              value: option.field,
              label: t(`torrents.ordering.${option.field}`),
            }))}
            onChange={(field) => props.search.selectOrderBy(field)}
          />
          <IconButton
            label={t("torrents.order_direction_toggle")}
            onClick={() => props.search.toggleOrderByDirection()}
          >
            <Icon
              name={
                props.search.query.orderBy.descending
                  ? "arrow_downward"
                  : "arrow_upward"
              }
            />
          </IconButton>
        </div>

        <Button
          variant="mini-fab"
          title={t("torrents.refresh")}
          onClick={() => props.refresh()}
        >
          <Icon name="sync" />
        </Button>
      </div>

      <Divider />
      <Paginator
        page={props.search.query.page}
        pageSize={props.search.query.limit}
        pageLength={items().length}
        totalLength={result().totalCount}
        totalIsEstimate={result().totalCountIsEstimate}
        hasNextPage={result().hasNextPage}
        onPageChange={(event) => props.search.handlePageEvent(event)}
      />
      <TorrentsTable
        items={items()}
        filesState={filesState}
        loading={loading()}
        selected={selection()}
        selectedTorrent={props.search.selection.selectedTorrent}
        onSelectionChange={setSelection}
        onToggleTorrent={(infoHash) =>
          props.search.toggleSelectedTorrent(infoHash)
        }
        onTabSelected={(infoHash, tab) =>
          props.search.selectTorrent(infoHash, tab ?? null)
        }
        onUpdated={() => props.refresh()}
      />
      <Paginator
        page={props.search.query.page}
        pageSize={props.search.query.limit}
        pageLength={items().length}
        totalLength={result().totalCount}
        totalIsEstimate={result().totalCountIsEstimate}
        hasNextPage={result().hasNextPage}
        onPageChange={(event) => props.search.handlePageEvent(event)}
      />
      <Show when={selection().length > 0}>
        <div class="bulk-actions-spacer" aria-hidden="true" />
      </Show>
      <TorrentsBulkActions
        selectedItems={selectedItems()}
        onUpdated={() => props.refresh()}
      />
    </DrawerLayout>
  );
}
