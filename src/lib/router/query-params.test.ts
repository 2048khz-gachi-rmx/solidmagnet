import { describe, expect, test } from "vitest";
import { intParam, stringListParam, stringParam } from "./query-params";

describe("query-param helpers", () => {
  test("decodes strings and rejects arrays", () => {
    expect(stringParam({ q: "hello%20world" }, "q")).toBe("hello world");
    expect(stringParam({ q: ["a", "b"] }, "q")).toBeUndefined();
    expect(stringParam({}, "q")).toBeUndefined();
  });

  test("parses positive integers", () => {
    expect(intParam({ page: "3" }, "page")).toBe(3);
    expect(intParam({ page: "-1" }, "page")).toBeUndefined();
    expect(intParam({ page: "3.5" }, "page")).toBeUndefined();
  });

  test("parses comma-separated lists, deduped and sorted", () => {
    expect(stringListParam({ facets: "b, a,b" }, "facets")).toEqual(["a", "b"]);
    expect(stringListParam({ facets: " , " }, "facets")).toBeUndefined();
  });
});
