import { render, fireEvent } from "@solidjs/testing-library";
import { flush } from "solid-js";
import { describe, expect, test } from "vitest";
import { I18nProvider } from "~/lib/i18n/I18nProvider";
import { Paginator, type PageEvent } from "./Paginator";

describe("<Paginator />", () => {
  test("emits next/previous page events and disables the edges", () => {
    const events: PageEvent[] = [];
    const { getByTitle, getByText } = render(() => (
      <I18nProvider>
        <Paginator
          page={2}
          pageSize={20}
          pageLength={20}
          totalLength={100}
          totalIsEstimate={false}
          hasNextPage={true}
          showLastPage={true}
          onPageChange={(event) => events.push(event)}
        />
      </I18nProvider>
    ));

    expect(getByText("21 to 40 of 100")).toBeInTheDocument();

    fireEvent.click(getByTitle("Next page"));
    flush();
    fireEvent.click(getByTitle("Previous page"));
    flush();
    fireEvent.click(getByTitle("First page"));
    flush();
    fireEvent.click(getByTitle("Last page"));
    flush();

    expect(events).toEqual([
      { page: 3, pageSize: 20 },
      { page: 1, pageSize: 20 },
      { page: 1, pageSize: 20 },
      { page: 5, pageSize: 20 },
    ]);
  });

  test("changes page size and resets to page 1", () => {
    const events: PageEvent[] = [];
    const { getByLabelText } = render(() => (
      <I18nProvider>
        <Paginator
          page={3}
          pageSize={20}
          pageLength={20}
          totalLength={100}
          onPageChange={(event) => events.push(event)}
        />
      </I18nProvider>
    ));

    fireEvent.change(getByLabelText("Items per page"), {
      target: { value: "50" },
    });
    flush();

    expect(events).toEqual([{ page: 1, pageSize: 50 }]);
  });
});
