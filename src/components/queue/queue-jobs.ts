import type {
  QueueJobStatus,
  QueueJobsOrderByField,
  QueueJobsQueryResult,
} from "~/lib/graphql/schema-types";
import type { QueueJobsQueryVariables } from "~/lib/graphql/generated";
import {
  intParam,
  stringListParam,
  stringParam,
  type QueryParams,
} from "~/lib/router/query-params";

export const defaultLimit = 20;

export type OrderBySelection = {
  field: QueueJobsOrderByField;
  descending: boolean;
};

export const orderByOptions: OrderBySelection[] = [
  { field: "created_at", descending: true },
  { field: "ran_at", descending: true },
  { field: "priority", descending: false },
];

export const defaultOrderBy: OrderBySelection = {
  field: "ran_at",
  descending: true,
};

export type FacetInput<TValue = unknown> = {
  filter?: TValue[];
};

export type QueueJobsControls = {
  limit: number;
  page: number;
  orderBy: OrderBySelection;
  facets: {
    queue: FacetInput<string>;
    status: FacetInput<QueueJobStatus>;
  };
};

export type QueueJobsParams = Record<
  string,
  string | string[] | number | undefined
>;

export type Agg<T> = {
  value: T;
  label: string;
  count: number;
};

export type FacetKey = keyof QueueJobsControls["facets"];

export type FacetInfo = {
  key: FacetKey;
  filter: string[] | undefined;
  aggregations: Array<Agg<string>>;
};

export const isQueueJobStatus = (value: string): value is QueueJobStatus =>
  value === "pending" ||
  value === "processed" ||
  value === "retry" ||
  value === "failed";

const orderByParam = (params: QueryParams): OrderBySelection => {
  const field = stringParam(params, "order");
  const direction = stringParam(params, "desc");
  const option = orderByOptions.find((candidate) => candidate.field === field);
  if (!option) {
    return { ...defaultOrderBy };
  }
  return {
    field: option.field,
    descending:
      direction === "1" ? true : direction === "0" ? false : option.descending,
  };
};

export const paramsToControls = (params: QueryParams): QueueJobsControls => {
  const statuses = stringListParam(params, "status")?.filter(isQueueJobStatus);
  return {
    limit: intParam(params, "limit") ?? defaultLimit,
    page: intParam(params, "page") ?? 1,
    orderBy: orderByParam(params),
    facets: {
      queue: { filter: stringListParam(params, "queue") },
      status: { filter: statuses?.length ? statuses : undefined },
    },
  };
};

const isDefaultOrdering = (orderBy: OrderBySelection): boolean =>
  orderBy.field === defaultOrderBy.field &&
  orderBy.descending === defaultOrderBy.descending;

export const controlsToParams = (
  controls: QueueJobsControls,
): QueueJobsParams => {
  const orderByIsDefault = isDefaultOrdering(controls.orderBy);
  return {
    page: controls.page === 1 ? undefined : controls.page,
    limit: controls.limit === defaultLimit ? undefined : controls.limit,
    order: orderByIsDefault ? undefined : controls.orderBy.field,
    desc: orderByIsDefault
      ? undefined
      : controls.orderBy.descending
        ? "1"
        : "0",
    queue: controls.facets.queue.filter?.length
      ? controls.facets.queue.filter.join(",")
      : undefined,
    status: controls.facets.status.filter?.length
      ? controls.facets.status.filter.join(",")
      : undefined,
  };
};

export const controlsToQueryVariables = (
  controls: QueueJobsControls,
): QueueJobsQueryVariables => ({
  input: {
    limit: controls.limit,
    page: controls.page,
    totalCount: true,
    orderBy: [
      controls.orderBy,
      ...(controls.orderBy.field !== "created_at"
        ? [
            {
              field: "created_at" as const,
              descending: controls.orderBy.descending,
            },
          ]
        : []),
    ],
    queues: controls.facets.queue.filter,
    statuses: controls.facets.status.filter,
    facets: {
      queue: {
        aggregate: true,
        filter: controls.facets.queue.filter,
      },
      status: {
        aggregate: true,
        filter: controls.facets.status.filter,
      },
    },
  },
});

export const buildFacetInfos = (
  controls: QueueJobsControls,
  aggregations: QueueJobsQueryResult["aggregations"],
  t: (key: string) => string,
): FacetInfo[] => [
  {
    key: "queue",
    filter: controls.facets.queue.filter,
    aggregations: aggregations.queue ?? [],
  },
  {
    key: "status",
    filter: controls.facets.status.filter,
    aggregations: (aggregations.status ?? []).map((agg) => ({
      ...agg,
      label: t(`dashboard.queues.${agg.value}`),
    })),
  },
];
