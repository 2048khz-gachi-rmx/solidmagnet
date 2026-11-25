import { describe, expect, test } from "vitest";
import { filesize } from "filesize";
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

  test("matches the filesize library for all size classes", () => {
    const values = [
      0,
      1,
      2,
      999,
      1000,
      1023,
      1024,
      1025,
      1536,
      2047,
      2048,
      1e6,
      1048575,
      1048576,
      1596373554,
      23043633119,
      55284993247232,
      1e15,
      9e18,
      1e19,
      Number("123456789012345678901234"),
      -1536,
      -1e9,
      0.5,
      1.5,
    ];
    for (const base of [2, 10] as const)
      for (const value of values)
        expect(formatFilesize(value, "en", base)).toBe(
          filesize(value, { locale: "en", base }),
        );
  });

  test("matches the filesize library for several locales", () => {
    for (const lang of ["en", "de", "ru", "ja", "xx"])
      for (const value of [0, 1, 1536, 55284993247232, -2048])
        expect(formatFilesize(value, lang)).toBe(
          filesize(value, { locale: lang, base: 2 }),
        );
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
