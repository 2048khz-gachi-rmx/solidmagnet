import { createStore } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import type { Translate } from "~/lib/i18n/I18nProvider";
import type { QueryParams } from "~/lib/router/query-params";
import {
  intParam,
  stringListParam,
  stringParam,
} from "~/lib/router/query-params";
import type {
  TorrentContentSearchQueryVariables,
  TorrentContentSearchResultFragment,
} from "~/lib/graphql/generated";
import type {
  ContentType,
  FileType,
  Language,
  TorrentContentOrderByField,
  VideoResolution,
  VideoSource,
} from "~/lib/graphql/schema-types";
import type { PageEvent } from "~/components/ui/Paginator";
import { contentTypeMap } from "~/lib/content-types";

export type FacetInput = {
  active: boolean;
  filter?: Array<string | null>;
};

export type ContentTypeSelection = ContentType | "null" | null;

export const torrentTabNames = [
  "files",
  "tags",
  "reprocess",
  "delete",
] as const;

export type TorrentTab = (typeof torrentTabNames)[number];

export type TorrentTabSelection = TorrentTab | undefined;

export type TorrentSelection = {
  infoHash: string;
  tab: TorrentTabSelection;
};

export type TorrentFacets = {
  genre: FacetInput;
  language: FacetInput;
  fileType: FacetInput;
  torrentSource: FacetInput;
  torrentTag: FacetInput;
  videoResolution: FacetInput;
  videoSource: FacetInput;
};

export type OrderBySelection = {
  field: TorrentContentOrderByField;
  descending: boolean;
};

export type QueryControls = {
  limit: number;
  page: number;
  queryString?: string;
  contentType: ContentTypeSelection;
  orderBy: OrderBySelection;
  facets: TorrentFacets;
};

export type SelectionState = {
  selectedTorrent?: TorrentSelection;
};

export const inactiveFacet: FacetInput = { active: false };

export type Agg = {
  value: string | null;
  label: string;
  count: number;
  isEstimate: boolean;
};

type Aggregations = TorrentContentSearchResultFragment["aggregations"];

export type FacetDefinition = {
  /** URL param name, matching the Angular controller's facet keys. */
  key: string;
  /** Key of the facet within QueryControls["facets"]. */
  inputKey: keyof TorrentFacets;
  icon: string;
  contentTypes?: ContentType[];
  allowNull: boolean;
  extractAggregations: (aggs: Aggregations) => Agg[];
  resolveLabel: (agg: Agg, t: Translate) => string;
};

const toAgg = (agg: {
  value: string | null;
  label: string;
  count: number;
  isEstimate: boolean;
}): Agg => ({
  value: agg.value,
  label: agg.label,
  count: agg.count,
  isEstimate: agg.isEstimate,
});

export const torrentSourceFacet: FacetDefinition = {
  key: "torrent_source",
  inputKey: "torrentSource",
  icon: "mediation",
  allowNull: false,
  extractAggregations: (aggs) => (aggs.torrentSource ?? []).map(toAgg),
  resolveLabel: (agg) => agg.label,
};

export const torrentTagFacet: FacetDefinition = {
  key: "torrent_tag",
  inputKey: "torrentTag",
  icon: "sell",
  allowNull: false,
  extractAggregations: (aggs) => (aggs.torrentTag ?? []).map(toAgg),
  resolveLabel: (agg) => agg.value ?? agg.label,
};

export const fileTypeFacet: FacetDefinition = {
  key: "file_type",
  inputKey: "fileType",
  icon: "file_present",
  allowNull: false,
  extractAggregations: (aggs) => (aggs.torrentFileType ?? []).map(toAgg),
  resolveLabel: (agg, t) => t(`file_types.${agg.value ?? "unknown"}`),
};

export const languageFacet: FacetDefinition = {
  key: "language",
  inputKey: "language",
  icon: "translate",
  allowNull: false,
  extractAggregations: (aggs) => (aggs.language ?? []).map(toAgg),
  resolveLabel: (agg, t) => t(`languages.${agg.value ?? ""}`),
};

export const genreFacet: FacetDefinition = {
  key: "genre",
  inputKey: "genre",
  icon: "theater_comedy",
  allowNull: false,
  contentTypes: ["movie", "tv_show"],
  extractAggregations: (aggs) => (aggs.genre ?? []).map(toAgg),
  resolveLabel: (agg) => agg.label,
};

export const videoResolutionFacet: FacetDefinition = {
  key: "video_resolution",
  inputKey: "videoResolution",
  icon: "aspect_ratio",
  allowNull: true,
  contentTypes: ["movie", "tv_show", "xxx"],
  extractAggregations: (aggs) =>
    (aggs.videoResolution ?? []).map((agg) => ({
      ...toAgg(agg),
      value: agg.value ?? null,
    })),
  resolveLabel: (agg) => agg.value?.slice(1) ?? "?",
};

export const videoSourceFacet: FacetDefinition = {
  key: "video_source",
  inputKey: "videoSource",
  icon: "album",
  allowNull: true,
  contentTypes: ["movie", "tv_show", "xxx"],
  extractAggregations: (aggs) =>
    (aggs.videoSource ?? []).map((agg) => ({
      ...toAgg(agg),
      value: agg.value ?? null,
    })),
  resolveLabel: (agg) => agg.value ?? "?",
};

export const facets: FacetDefinition[] = [
  torrentSourceFacet,
  torrentTagFacet,
  fileTypeFacet,
  languageFacet,
  genreFacet,
  videoResolutionFacet,
  videoSourceFacet,
];

export const orderByOptions: OrderBySelection[] = [
  { field: "relevance", descending: true },
  { field: "published_at", descending: true },
  { field: "updated_at", descending: true },
  { field: "size", descending: true },
  { field: "files_count", descending: true },
  { field: "seeders", descending: true },
  { field: "leechers", descending: true },
  { field: "name", descending: false },
];

export const defaultOrderBy: OrderBySelection = {
  field: "published_at",
  descending: true,
};

export const defaultQueryOrderBy: OrderBySelection = {
  field: "relevance",
  descending: true,
};

export const defaultLimit = 20;

export const initControls: QueryControls = {
  page: 1,
  limit: defaultLimit,
  contentType: null,
  orderBy: defaultOrderBy,
  facets: {
    genre: inactiveFacet,
    language: inactiveFacet,
    fileType: inactiveFacet,
    torrentSource: inactiveFacet,
    torrentTag: inactiveFacet,
    videoResolution: inactiveFacet,
    videoSource: inactiveFacet,
  },
};

export const matchesContentType = (
  selection: ContentTypeSelection,
  contentTypes?: ContentType[],
): boolean =>
  !contentTypes ||
  (!!selection &&
    selection !== "null" &&
    contentTypes.includes(selection as ContentType));

export const isDefaultOrdering = (ctrl: QueryControls): boolean => {
  if (!ctrl.orderBy.descending) return false;
  return (
    ctrl.orderBy.field === (ctrl.queryString ? "relevance" : "published_at")
  );
};

const patchFacet = (
  facetsInput: TorrentFacets,
  key: keyof TorrentFacets,
  input: FacetInput,
): TorrentFacets => ({ ...facetsInput, [key]: input });

const contentTypeParam = (params: QueryParams): ContentTypeSelection => {
  const str = stringParam(params, "content_type");
  return str && str in contentTypeMap ? (str as ContentTypeSelection) : null;
};

const orderByParam = (
  params: QueryParams,
  hasQuery: boolean,
): OrderBySelection => {
  let descending: boolean | null = null;
  const strDesc = stringParam(params, "desc");
  if (strDesc === "1") descending = true;
  else if (strDesc === "0") descending = false;

  const field = stringParam(params, "order");
  for (const option of orderByOptions) {
    if (option.field === field) {
      return {
        field: option.field,
        descending: descending ?? option.descending,
      };
    }
  }
  return {
    field: hasQuery ? "relevance" : "published_at",
    descending: descending ?? true,
  };
};

export const paramsToQueryControls = (params: QueryParams): QueryControls => {
  const queryString = stringParam(params, "query");
  const activeFacets = stringListParam(params, "facets");

  let facetState: TorrentFacets = initControls.facets;
  for (const facet of facets) {
    facetState = patchFacet(facetState, facet.inputKey, {
      active: activeFacets?.includes(facet.key) ?? false,
      filter: stringListParam(params, facet.key),
    });
  }

  return {
    queryString,
    orderBy: orderByParam(params, !!queryString),
    contentType: contentTypeParam(params),
    limit: intParam(params, "limit") ?? defaultLimit,
    page: intParam(params, "page") ?? 1,
    facets: facetState,
  };
};

export const paramsToSelection = (params: QueryParams): SelectionState => {
  const selectedTorrentParam = stringParam(params, "torrent");
  if (!selectedTorrentParam) return { selectedTorrent: undefined };

  let tab: TorrentTabSelection;
  const strTab = stringParam(params, "tab");
  if (torrentTabNames.includes(strTab as TorrentTab)) {
    tab = strTab as TorrentTab;
  }
  return { selectedTorrent: { infoHash: selectedTorrentParam, tab } };
};

export type SearchParamsWrite = Record<string, string | number | undefined>;

export const queryControlsToParams = (
  ctrl: QueryControls,
): SearchParamsWrite => {
  let page: number | undefined = ctrl.page;
  let limit: number | undefined = ctrl.limit;
  if (page === 1) page = undefined;
  if (limit === defaultLimit) limit = undefined;

  const orderBy = isDefaultOrdering(ctrl) ? undefined : ctrl.orderBy;
  const desc = orderBy ? (orderBy.descending ? "1" : "0") : undefined;

  const activeFacets: string[] = [];
  const filterParams: Record<string, string | undefined> = {};
  for (const facet of facets) {
    const input = ctrl.facets[facet.inputKey];
    if (input.active) activeFacets.push(facet.key);
    filterParams[facet.key] = input.active
      ? input.filter?.length
        ? encodeURIComponent(input.filter.join(","))
        : undefined
      : undefined;
  }

  return {
    query: ctrl.queryString ? encodeURIComponent(ctrl.queryString) : undefined,
    page,
    limit,
    content_type: ctrl.contentType ?? undefined,
    order: orderBy?.field,
    desc,
    facets: activeFacets.length ? activeFacets.join(",") : undefined,
    ...filterParams,
  };
};

export const selectionToParams = (
  selection: SelectionState,
): SearchParamsWrite => ({
  torrent: selection.selectedTorrent?.infoHash,
  tab: selection.selectedTorrent?.tab,
});

export const controlsToQueryVariables = (
  ctrl: QueryControls,
  cached = true,
): TorrentContentSearchQueryVariables => {
  const { facets: f } = ctrl;
  const filter = (input: FacetInput) =>
    input.filter && input.filter.length ? input.filter : undefined;

  return {
    input: {
      queryString: ctrl.queryString,
      limit: ctrl.limit,
      page: ctrl.page,
      totalCount: true,
      hasNextPage: true,
      cached,
      orderBy: [ctrl.orderBy],
      facets: {
        contentType: {
          aggregate: true,
          filter: ctrl.contentType
            ? [ctrl.contentType === "null" ? null : ctrl.contentType]
            : undefined,
        },
        genre: f.genre.active
          ? {
              aggregate: true,
              filter: filter(f.genre) as unknown as string[] | undefined,
            }
          : undefined,
        language: f.language.active
          ? {
              aggregate: f.language.active,
              filter: filter(f.language) as unknown as Language[] | undefined,
            }
          : undefined,
        torrentFileType: f.fileType.active
          ? {
              aggregate: true,
              filter: filter(f.fileType) as unknown as FileType[] | undefined,
            }
          : undefined,
        torrentSource: f.torrentSource.active
          ? {
              aggregate: true,
              filter: filter(f.torrentSource) as unknown as
                string[] | undefined,
            }
          : undefined,
        torrentTag: f.torrentTag.active
          ? {
              aggregate: true,
              filter: filter(f.torrentTag) as unknown as string[] | undefined,
            }
          : undefined,
        videoResolution: f.videoResolution.active
          ? {
              aggregate: true,
              filter: filter(f.videoResolution) as unknown as
                VideoResolution[] | undefined,
            }
          : undefined,
        videoSource: f.videoSource.active
          ? {
              aggregate: true,
              filter: filter(f.videoSource) as unknown as
                VideoSource[] | undefined,
            }
          : undefined,
      },
    },
  };
};

export type TorrentsSearchState = {
  query: QueryControls;
  selection: SelectionState;
  selectContentType: (contentType: ContentTypeSelection) => void;
  activateFacet: (facet: FacetDefinition) => void;
  deactivateFacet: (facet: FacetDefinition) => void;
  activateFilter: (facet: FacetDefinition, value: string | null) => void;
  deactivateFilter: (facet: FacetDefinition, value: string | null) => void;
  setQueryString: (queryString?: string | null) => void;
  selectOrderBy: (field: TorrentContentOrderByField) => void;
  toggleOrderByDirection: () => void;
  handlePageEvent: (event: PageEvent) => void;
  selectTorrent: (infoHash: string, tab?: TorrentTabSelection | null) => void;
  toggleSelectedTorrent: (infoHash: string) => void;
};

/**
 * Search state lives entirely in the URL. Query state and the selected
 * torrent are projected into separate stores, so UI-only changes (expanding
 * a row, switching a tab) cannot invalidate the GraphQL variables.
 */
export function useTorrentsSearch(
  onQueryChange?: () => void,
): TorrentsSearchState {
  const [params, setParams] = useSearchParams();

  const [query] = createStore(() => paramsToQueryControls(params), null);
  const [selection] = createStore(() => paramsToSelection(params), null);

  const write = (nextQuery: QueryControls, nextSelection: SelectionState) => {
    setParams(
      {
        ...queryControlsToParams(nextQuery),
        ...selectionToParams(nextSelection),
      },
      { replace: true },
    );
  };

  const updateQuery = (fn: (controls: QueryControls) => QueryControls) => {
    const next = fn(paramsToQueryControls(params));
    onQueryChange?.();
    write(next, paramsToSelection(params));
  };

  const selectContentType = (contentType: ContentTypeSelection) => {
    updateQuery((ctrl) => ({
      ...ctrl,
      contentType,
      page: 1,
      facets: {
        ...ctrl.facets,
        genre: matchesContentType(contentType, genreFacet.contentTypes)
          ? ctrl.facets.genre
          : inactiveFacet,
        videoResolution: matchesContentType(
          contentType,
          videoResolutionFacet.contentTypes,
        )
          ? ctrl.facets.videoResolution
          : inactiveFacet,
        videoSource: matchesContentType(
          contentType,
          videoSourceFacet.contentTypes,
        )
          ? ctrl.facets.videoSource
          : inactiveFacet,
      },
    }));
  };

  const activateFacet = (facet: FacetDefinition) => {
    updateQuery((ctrl) => {
      const input = ctrl.facets[facet.inputKey];
      return {
        ...ctrl,
        facets: patchFacet(ctrl.facets, facet.inputKey, {
          ...input,
          active: true,
        }),
      };
    });
  };

  const deactivateFacet = (facet: FacetDefinition) => {
    updateQuery((ctrl) => {
      const input = ctrl.facets[facet.inputKey];
      return {
        ...ctrl,
        page: input.filter ? 1 : ctrl.page,
        facets: patchFacet(ctrl.facets, facet.inputKey, {
          ...input,
          active: false,
          filter: undefined,
        }),
      };
    });
  };

  const activateFilter = (facet: FacetDefinition, value: string | null) => {
    updateQuery((ctrl) => {
      const input = ctrl.facets[facet.inputKey];
      return {
        ...ctrl,
        page: 1,
        facets: patchFacet(ctrl.facets, facet.inputKey, {
          ...input,
          filter: Array.from(new Set([...(input.filter ?? []), value])).sort(),
        }),
      };
    });
  };

  const deactivateFilter = (facet: FacetDefinition, value: string | null) => {
    updateQuery((ctrl) => {
      const input = ctrl.facets[facet.inputKey];
      const nextFilter = input.filter?.filter((entry) => entry !== value);
      return {
        ...ctrl,
        page: 1,
        facets: patchFacet(ctrl.facets, facet.inputKey, {
          ...input,
          filter: nextFilter?.length ? nextFilter : undefined,
        }),
      };
    });
  };

  const setQueryString = (queryString?: string | null) => {
    const str = queryString || undefined;
    updateQuery((ctrl) => {
      let orderBy = ctrl.orderBy;
      if (str) {
        if (str !== ctrl.queryString) {
          orderBy = defaultQueryOrderBy;
        }
      } else if (orderBy.field === "relevance") {
        orderBy = defaultOrderBy;
      }
      return {
        ...ctrl,
        queryString: str,
        orderBy,
        page: str === ctrl.queryString ? ctrl.page : 1,
      };
    });
  };

  const selectOrderBy = (field: TorrentContentOrderByField) => {
    const orderBy: OrderBySelection = {
      field,
      descending:
        orderByOptions.find((option) => option.field === field)?.descending ??
        false,
    };
    updateQuery((ctrl) => ({
      ...ctrl,
      orderBy:
        orderBy.field !== "relevance" || ctrl.queryString
          ? orderBy
          : defaultOrderBy,
      page: 1,
    }));
  };

  const toggleOrderByDirection = () => {
    updateQuery((ctrl) => ({
      ...ctrl,
      orderBy: {
        ...ctrl.orderBy,
        descending: !ctrl.orderBy.descending,
      },
      page: 1,
    }));
  };

  const handlePageEvent = (event: PageEvent) => {
    updateQuery((ctrl) => ({
      ...ctrl,
      limit: event.pageSize,
      page: event.page,
    }));
  };

  const selectTorrent = (
    infoHash: string,
    tab?: TorrentTabSelection | null,
  ) => {
    const current = paramsToSelection(params);
    let nextTab: TorrentTabSelection;
    if (tab === undefined) nextTab = current.selectedTorrent?.tab;
    else if (tab === null) nextTab = undefined;
    else nextTab = tab;
    write(paramsToQueryControls(params), {
      selectedTorrent: { infoHash, tab: nextTab },
    });
  };

  const toggleSelectedTorrent = (infoHash: string) => {
    const current = paramsToSelection(params);
    write(paramsToQueryControls(params), {
      selectedTorrent:
        current.selectedTorrent?.infoHash === infoHash
          ? undefined
          : { infoHash, tab: current.selectedTorrent?.tab },
    });
  };

  return {
    query,
    selection,
    selectContentType,
    activateFacet,
    deactivateFacet,
    activateFilter,
    deactivateFilter,
    setQueryString,
    selectOrderBy,
    toggleOrderByDirection,
    handlePageEvent,
    selectTorrent,
    toggleSelectedTorrent,
  };
}
