import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@solidjs/testing-library";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import App from "./App";

const searchResponse = (items: unknown[]) => ({
  torrentContent: {
    search: {
      totalCount: items.length,
      totalCountIsEstimate: false,
      hasNextPage: false,
      items,
      aggregations: {
        contentType: null,
        torrentSource: null,
        torrentTag: null,
        torrentFileType: null,
        language: null,
        genre: null,
        releaseYear: null,
        videoResolution: null,
        videoSource: null,
      },
    },
  },
});

const emptySearch = searchResponse([]);

const torrentItem = {
  id: "1",
  infoHash: "a".repeat(40),
  contentType: "movie",
  title: "Example.Release.1080p",
  video3d: null,
  videoCodec: null,
  videoModifier: null,
  videoResolution: "r1080p",
  videoSource: null,
  seeders: 12,
  leechers: 3,
  publishedAt: "2024-01-01T00:00:00Z",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  torrent: {
    infoHash: "a".repeat(40),
    name: "Example.Release.1080p",
    size: 1024 * 1024,
    filesStatus: "no_info",
    filesCount: null,
    hasFilesInfo: false,
    singleFile: null,
    fileType: null,
    seeders: 12,
    leechers: 3,
    tagNames: [],
    magnetUri: "magnet:?xt=urn:btih:" + "a".repeat(40),
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    sources: [],
  },
  content: null,
  languages: null,
  episodes: null,
};

const queueJobs = {
  queue: {
    jobs: {
      totalCount: 0,
      hasNextPage: false,
      items: [],
      aggregations: { queue: [], status: [] },
    },
  },
};

const queueMetrics = { queue: { metrics: { buckets: [] } } };

const torrentMetrics = {
  torrent: { metrics: { buckets: [] }, listSources: { sources: [] } },
};

const health = {
  health: { status: "up", checks: [] },
  workers: { listAll: { workers: [] } },
};

const respond = (data: unknown) =>
  new Response(JSON.stringify({ data }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });

let currentSearch = emptySearch;

beforeEach(() => {
  currentSearch = emptySearch;
  window.history.replaceState({}, "", "/torrents");
  vi.stubGlobal(
    "fetch",
    vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
      const body = String(init?.body ?? "");
      if (body.includes("HealthCheck")) return Promise.resolve(respond(health));
      if (body.includes("QueueJobs"))
        return Promise.resolve(respond(queueJobs));
      if (body.includes("QueueMetrics"))
        return Promise.resolve(respond(queueMetrics));
      if (body.includes("TorrentMetrics"))
        return Promise.resolve(respond(torrentMetrics));
      if (body.includes("Version"))
        return Promise.resolve(respond({ version: "dev" }));
      return Promise.resolve(respond(currentSearch));
    }),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  window.history.replaceState({}, "", "/");
});

test("renders the torrent search page against the GraphQL API", async () => {
  render(() => <App />);

  expect(await screen.findByPlaceholderText("Search")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /dashboard/i })).toBeInTheDocument();
  expect(screen.getByText("bitmagnet")).toBeInTheDocument();
});

test("renders the not found page", async () => {
  window.history.replaceState({}, "", "/does-not-exist");
  render(() => <App />);

  expect(await screen.findByText("Page not found")).toBeInTheDocument();
});

test("renders the dashboard health page", async () => {
  window.history.replaceState({}, "", "/dashboard");
  render(() => <App />);
  expect(await screen.findByText(/bitmagnet is up/i)).toBeInTheDocument();
});

test("renders the queue admin page", async () => {
  window.history.replaceState({}, "", "/dashboard/queues/admin");
  render(() => <App />);
  expect(
    await screen.findByRole("button", { name: "Purge queue jobs" }),
  ).toBeInTheDocument();
});

test("renders the empty queue jobs page", async () => {
  window.history.replaceState({}, "", "/dashboard/queues/jobs");
  render(() => <App />);
  expect(await screen.findByRole("link", { name: "Jobs" })).toBeInTheDocument();
  expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
});

test("renders the empty queue visualize page", async () => {
  window.history.replaceState({}, "", "/dashboard/queues/visualize");
  render(() => <App />);
  expect(
    await screen.findByRole("link", { name: "Visualize" }),
  ).toBeInTheDocument();
  expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
});

test("renders the empty torrent metrics page", async () => {
  window.history.replaceState({}, "", "/dashboard/torrents");
  render(() => <App />);
  expect((await screen.findAllByText("Throughput")).length).toBeGreaterThan(0);
  expect(screen.queryByText("Something went wrong")).not.toBeInTheDocument();
});

test("renders a torrent row from search results", async () => {
  currentSearch = searchResponse([torrentItem]);
  render(() => <App />);
  expect(
    (await screen.findAllByText("Example.Release.1080p")).length,
  ).toBeGreaterThan(0);
  expect(screen.getAllByText("12 / 3").length).toBeGreaterThan(0);
});

test("renders a torrent permalink", async () => {
  currentSearch = searchResponse([torrentItem]);
  window.history.replaceState({}, "", `/torrents/permalink/${"a".repeat(40)}`);
  render(() => <App />);
  expect(
    await screen.findByRole("link", { name: /magnet/i }),
  ).toBeInTheDocument();
  expect(screen.queryByText("Page not found")).not.toBeInTheDocument();
});

test("mounts the torrent detail only after expanding", async () => {
  currentSearch = searchResponse([torrentItem]);
  render(() => <App />);
  expect(
    await screen.findByText("Example.Release.1080p", { selector: "span" }),
  ).toBeInTheDocument();
  expect(screen.queryByText("Info hash:")).not.toBeInTheDocument();

  fireEvent.click(
    screen.getByText("Example.Release.1080p", { selector: "span" }),
  );
  expect(await screen.findByText("Info hash:")).toBeInTheDocument();
});

test("refetches search when a query control changes", async () => {
  currentSearch = searchResponse([torrentItem]);
  render(() => <App />);
  await screen.findByText("Example.Release.1080p", { selector: "span" });

  const searchCalls = () =>
    (
      fetch as unknown as {
        mock: { calls: Array<[unknown, RequestInit | undefined]> };
      }
    ).mock.calls.filter(([, init]) =>
      String(init?.body ?? "").includes("TorrentContentSearch"),
    ).length;

  const input = screen.getByPlaceholderText("Search");
  fireEvent.input(input, { target: { value: "ubuntu" } });
  fireEvent.keyDown(input, { key: "Enter" });

  await waitFor(() => expect(searchCalls()).toBe(2));
});

test("does not refetch search results for detail-only URL state", async () => {
  currentSearch = searchResponse([torrentItem]);
  render(() => <App />);
  await screen.findByText("Example.Release.1080p", { selector: "span" });

  const searchCalls = () =>
    (
      fetch as unknown as {
        mock: { calls: Array<[unknown, RequestInit | undefined]> };
      }
    ).mock.calls.filter(([, init]) =>
      String(init?.body ?? "").includes("TorrentContentSearch"),
    ).length;

  expect(searchCalls()).toBe(1);

  fireEvent.click(
    screen.getByText("Example.Release.1080p", { selector: "span" }),
  );
  await screen.findByText("Info hash:");

  const detail = (await screen.findByText("Info hash:")).closest(
    ".torrent-content",
  ) as HTMLElement;
  fireEvent.click(within(detail).getByRole("tab", { name: /edit tags/i }));
  await within(detail).findByPlaceholderText("New tag");

  expect(searchCalls()).toBe(1);
});
