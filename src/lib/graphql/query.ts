import { createMemo, createSignal, type Accessor } from "solid-js";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { graphqlRequest } from "./client";

export type QueryResult<TData> = {
  /** Async accessor; read it under a <Loading> boundary. */
  data: Accessor<TData | undefined>;
  /** Re-runs the query, keeping the current value visible while pending. */
  refetch: () => void;
  /** Change counter, useful as a stable dependency for derived state. */
  version: Accessor<number>;
};

/**
 * Builds a reactive GraphQL read from an accessor of variables.
 *
 * The returned accessor is an async memo: when the variables change the
 * previous value stays on screen until the new one lands (Solid 2's built-in
 * transition behaviour), and `isPending(() => data())` reports the refresh.
 * Pass `undefined` variables to skip the request.
 */
export function createGraphqlQuery<TData, TVariables>(
  document: TypedDocumentNode<TData, TVariables>,
  variables: Accessor<TVariables | undefined>,
): QueryResult<TData> {
  const [version, setVersion] = createSignal(0);

  const data = createMemo<TData | undefined>(async () => {
    // Re-run when refetch() is called.
    version();
    const vars = variables();
    if (vars === undefined) return undefined;
    return graphqlRequest(document, vars);
  });

  return {
    data,
    refetch: () => setVersion((current) => current + 1),
    version,
  };
}
