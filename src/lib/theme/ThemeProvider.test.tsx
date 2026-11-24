import { render, fireEvent } from "@solidjs/testing-library";
import { flush } from "solid-js";
import { describe, expect, test } from "vitest";
import { ThemeProvider, useTheme } from "./ThemeProvider";

function Probe() {
  const { theme, colors, isDark, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme()}</span>
      <span data-testid="dark">{String(isDark())}</span>
      <span data-testid="background">{colors().background}</span>
      <button type="button" onClick={() => setTheme("neon")}>
        neon
      </button>
    </div>
  );
}

describe("<ThemeProvider />", () => {
  test("defaults to classic and applies the theme variables", () => {
    const { getByTestId, getByText } = render(() => (
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    ));

    expect(getByTestId("theme").textContent).toBe("classic");
    expect(getByTestId("background").textContent).toBe("#fbf8fd");
    expect(document.documentElement.dataset.bitmagnetTheme).toBe("classic");

    fireEvent.click(getByText("neon"));
    flush();

    expect(getByTestId("theme").textContent).toBe("neon");
    expect(getByTestId("dark").textContent).toBe("true");
    expect(
      document.documentElement.style.getPropertyValue("--color-background"),
    ).toBe("#0c0f10");
  });
});
