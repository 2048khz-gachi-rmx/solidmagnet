import { describe, expect, test } from "vitest";
import { formatFilesize, formatIntEstimate, parseIsoDuration } from "./format";

describe("formatIntEstimate", () => {
  test("rounds estimates to significant figures and prefixes ~", () => {
    expect(formatIntEstimate(12345, "en", true)).toBe("~12,000");
    expect(formatIntEstimate(12345, "en", false)).toBe("12,345");
    expect(formatIntEstimate(0, "en", true)).toBe("~0");
  });
});

describe("formatFilesize", () => {
  test("formats bytes with binary units", () => {
    expect(formatFilesize(1536, "en")).toBe("1.5 KiB");
    expect(formatFilesize(0, "en")).toBe("0 B");
  });
});

describe("parseIsoDuration", () => {
  test("parses metric resolutions", () => {
    expect(parseIsoDuration("PT15M")).toMatchObject({
      minutes: 15,
      seconds: 0,
    });
    expect(parseIsoDuration("P1DT2H")).toMatchObject({
      days: 1,
      hours: 2,
    });
  });

  test("rejects invalid durations", () => {
    expect(() => parseIsoDuration("nope")).toThrow(RangeError);
  });
});
