import { print } from "graphql";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";

/**
 * In development the Vite proxy forwards /graphql to the bitmagnet API.
 * In production the default is same-origin, which works when bitmagnet serves
 * this UI. Set VITE_GRAPHQL_ENDPOINT at build time when hosting separately.
 */
const configuredEndpoint = (
  import.meta.env.VITE_GRAPHQL_ENDPOINT as string | undefined
)?.trim();

export const graphqlEndpoint =
  configuredEndpoint ||
  (typeof window === "undefined"
    ? "/graphql"
    : `${window.location.protocol}//${window.location.host}/graphql`);

export type GraphqlErrorPayload = {
  message: string;
  path?: Array<string | number>;
  extensions?: Record<string, unknown>;
};

export class GraphqlError extends Error {
  readonly errors: GraphqlErrorPayload[];

  constructor(message: string, errors: GraphqlErrorPayload[] = []) {
    super(message);
    this.name = "GraphqlError";
    this.errors = errors;
  }
}

type GraphqlResponse<TData> = {
  data?: TData;
  errors?: GraphqlErrorPayload[];
};

export async function graphqlRequest<TData, TVariables>(
  document: TypedDocumentNode<TData, TVariables>,
  variables: TVariables,
  options: { signal?: AbortSignal } = {},
): Promise<TData> {
  const response = await fetch(graphqlEndpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query: print(document), variables }),
    signal: options.signal,
  });

  let payload: GraphqlResponse<TData> | undefined;
  try {
    payload = (await response.json()) as GraphqlResponse<TData>;
  } catch {
    throw new GraphqlError(
      `Unexpected response from GraphQL API (${response.status})`,
    );
  }

  if (payload.errors?.length) {
    throw new GraphqlError(
      payload.errors.map((error) => error.message).join("; "),
      payload.errors,
    );
  }
  if (!response.ok) {
    throw new GraphqlError(`GraphQL request failed (${response.status})`);
  }
  if (!payload.data) {
    throw new GraphqlError("GraphQL response contained no data");
  }
  return payload.data;
}
