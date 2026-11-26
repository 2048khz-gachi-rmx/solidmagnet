import {
  createEffect,
  createMemo,
  createSignal,
  For,
  Show,
  untrack,
  type Accessor,
} from "solid-js";
import { ProgressBar, ProgressBarContainer } from "~/components/ui/Card";
import { Icon } from "~/components/ui/Icon";
import { Paginator, type PageEvent } from "~/components/ui/Paginator";
import { graphqlRequest } from "~/lib/graphql/client";
import {
  TorrentFilesDocument,
  type TorrentFilesQueryResultFragment,
  type TorrentFileFragment,
  type TorrentFragment,
} from "~/lib/graphql/generated";
import { formatFilesize } from "~/lib/format/format";
import { useI18n } from "~/lib/i18n/I18nProvider";
import { useNotify } from "~/lib/notify/NotifyProvider";
import { errorMessage, fileTypeIcon } from "./util";

/**
 * The files of a torrent, and the paging they are built from.
 * This is deliberately created above the table (and handed down) instead of
 * inside it: the detail row is re-created whenever the result page around it
 * changes, and a request owned by that row would be restarted with it. The
 * fetch is also a plain signal rather than an async memo, so paging through
 * files can never suspend the page that contains the table.
 */
export type TorrentFilesState = {
  data: Accessor<TorrentFilesQueryResultFragment | undefined>;
  pending: Accessor<boolean>;
  totalCount: Accessor<number | undefined>;
  page: Accessor<number>;
  pageSize: Accessor<number>;
  setPage: (page: number, pageSize: number) => void;
};

export function createTorrentFilesState(
  torrent: Accessor<TorrentFragment | undefined>,
): TorrentFilesState {
  const notify = useNotify();

  const [page, setPageSignal] = createSignal(1);
  const [pageSize, setPageSize] = createSignal(10);
  const [data, setData] = createSignal<TorrentFilesQueryResultFragment>();
  const [pending, setPending] = createSignal(false);

  // Only real changes to the request may re-run it: the fragment around it
  // gets a new object identity on every result page.
  const infoHash = createMemo(() => torrent()?.infoHash);
  const filesStatus = createMemo(() => torrent()?.filesStatus);

  const variables = createMemo(() => {
    const currentInfoHash = infoHash();
    if (!currentInfoHash || filesStatus() === "single") return undefined;
    return {
      input: {
        infoHashes: [currentInfoHash],
        limit: pageSize(),
        page: page(),
        totalCount: true,
        hasNextPage: false,
      },
    };
  });

  let latestRequest = 0;
  createEffect(variables, (vars) => {
    if (!vars) {
      setData(undefined);
      setPending(false);
      return;
    }
    const request = ++latestRequest;
    setPending(true);
    graphqlRequest(TorrentFilesDocument, vars)
      .then((result) => {
        if (request === latestRequest) setData(result.torrent.files);
      })
      .catch((error) => {
        if (request === latestRequest) setData(undefined);
        notify.error(errorMessage(error));
      })
      .finally(() => {
        if (request === latestRequest) setPending(false);
      });
  });

  const setPage = (nextPage: number, nextPageSize: number) => {
    setPageSignal(nextPage);
    setPageSize(nextPageSize);
  };

  return {
    data,
    pending,
    totalCount: () => data()?.totalCount,
    page,
    pageSize,
    setPage,
  };
}

type TorrentFilesTableProps = {
  torrent: TorrentFragment;
  /** Shared with the page so re-renders don't restart the request. */
  state?: TorrentFilesState;
};

const singleFileResult = (
  torrent: TorrentFragment,
): TorrentFilesQueryResultFragment => ({
  totalCount: 1,
  hasNextPage: false,
  items: [
    {
      infoHash: torrent.infoHash,
      index: 0,
      path: torrent.name,
      size: torrent.size,
      fileType: torrent.fileType,
      createdAt: torrent.createdAt,
      updatedAt: torrent.updatedAt,
    },
  ],
});

export function TorrentFilesTable(props: TorrentFilesTableProps) {
  const { t, lang, formatNumber } = useI18n();

  // Only created when the page doesn't already own one, so a row that is
  // re-created by a new result page reuses the request instead of repeating it.
  const state =
    untrack(() => props.state) ?? createTorrentFilesState(() => props.torrent);

  const isSingle = () => props.torrent.filesStatus === "single";

  const result = (): TorrentFilesQueryResultFragment | undefined =>
    isSingle() ? singleFileResult(props.torrent) : state.data();

  // The fragment already knows (at least roughly) how many files there are,
  // so the header and the paginator are on screen before the first page has
  // loaded; the exact total replaces it once the page arrives.
  const knownTotal = () => result()?.totalCount;
  const hasMoreThanOnePage = () =>
    (knownTotal() ?? props.torrent.filesCount ?? 0) > state.pageSize();

  return (
    <div class="files-table">
      <ProgressBarContainer>
        <ProgressBar indeterminate={!isSingle() && state.pending()} />
      </ProgressBarContainer>
      <Show when={props.torrent.filesStatus === "over_threshold"}>
        <p class="files-table-summary">
          {t("torrents.showing_x_of_y_files", {
            x: formatNumber(knownTotal() ?? 0),
            y:
              props.torrent.filesCount == null
                ? "?"
                : formatNumber(props.torrent.filesCount),
          })}
        </p>
      </Show>
      <Show when={hasMoreThanOnePage()}>
        <Paginator
          page={state.page()}
          pageSize={state.pageSize()}
          pageLength={result()?.items.length ?? 0}
          totalLength={knownTotal()}
          totalIsEstimate={false}
          showLastPage
          onPageChange={(event: PageEvent) =>
            state.setPage(event.page, event.pageSize)
          }
        />
      </Show>
      <table class="table torrent-files-table">
        <thead>
          <tr>
            <th class="file-index">{t("torrents.file_index")}</th>
            <th class="file-path">{t("torrents.file_path")}</th>
            <th class="file-size">{t("torrents.file_size")}</th>
          </tr>
        </thead>
        <tbody>
          <Show
            when={result()?.items}
            fallback={
              <tr class="files-page-loading">
                <td colspan="3">
                  <ProgressBarContainer>
                    <ProgressBar indeterminate />
                  </ProgressBarContainer>
                </td>
              </tr>
            }
          >
            {(items) => (
              <For each={items()}>
                {(file: TorrentFileFragment) => (
                  <tr>
                    <td class="file-index">{file.index}</td>
                    <td class="file-path">
                      <span class="file-path-content">
                        <Icon
                          name={fileTypeIcon(file.fileType)}
                          title={t(`file_types.${file.fileType ?? "unknown"}`)}
                        />
                        <span class="file-path-text">{file.path}</span>
                      </span>
                    </td>
                    <td class="file-size">
                      <span
                        class="filesize"
                        title={formatFilesize(file.size, lang(), 10)}
                      >
                        {formatFilesize(file.size, lang())}
                      </span>
                    </td>
                  </tr>
                )}
              </For>
            )}
          </Show>
        </tbody>
      </table>
    </div>
  );
}
