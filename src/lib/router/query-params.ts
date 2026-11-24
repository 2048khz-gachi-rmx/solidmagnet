export type QueryParams = Record<string, string | string[] | undefined>;

export const stringParam = (
  params: QueryParams,
  key: string,
): string | undefined => {
  const value = params[key];
  if (typeof value !== "string") return undefined;
  try {
    return decodeURIComponent(value) || undefined;
  } catch {
    return value || undefined;
  }
};

export const intParam = (
  params: QueryParams,
  key: string,
): number | undefined => {
  const value = params[key];
  if (typeof value === "string" && /^\d+$/.test(value)) {
    return Number.parseInt(value, 10);
  }
  return undefined;
};

export const stringListParam = (
  params: QueryParams,
  key: string,
): string[] | undefined => {
  const value = stringParam(params, key);
  const list = value
    ?.split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
  return list?.length ? Array.from(new Set(list)).sort() : undefined;
};
