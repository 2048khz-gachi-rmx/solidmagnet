import { describe, expect, test } from "vitest";
import { paths } from "./router";

describe("typed paths", () => {
  test("build route URLs from the route tree", () => {
    expect(paths.torrents()).toMatch(/\/torrents$/);
    expect(paths.dashboard()).toMatch(/\/dashboard$/);
    expect(paths.dashboard.queues.visualize()).toMatch(
      /\/dashboard\/queues\/visualize$/,
    );
    expect(String(paths.torrents.permalink("a".repeat(40)))).toMatch(
      new RegExp(`/torrents/permalink/${"a".repeat(40)}$`),
    );
  });
});
