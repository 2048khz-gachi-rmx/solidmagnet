import { describe, expect, test } from "vitest";
import { translate } from "./messages";

describe("translate", () => {
  test("resolves nested keys and interpolates params", () => {
    expect(translate("en", "routes.torrents")).toBe("Torrents");
    expect(translate("en", "paginator.page_x", { x: 3 })).toBe("Page 3");
  });

  test("uses the active locale when a translation exists", () => {
    expect(translate("de", "paginator.page_x", { x: 2 })).toBe("Seite 2");
  });

  test("returns the key when nothing matches", () => {
    expect(translate("en", "does.not.exist")).toBe("does.not.exist");
  });
});
