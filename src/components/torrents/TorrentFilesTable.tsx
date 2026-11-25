import { createSignal, For, isPending, Loading, Show } from "solid-js";
import { ProgressBar, ProgressBarContainer } from "~/components/ui/Card";
import { Icon } from "~/components/ui/Icon";
import { Paginator, type PageEvent } from "~/components/ui/Paginator";
import { createGraphqlQuery } from "~/lib/graphql/query";
import {
  TorrentFilesDocument,
  type TorrentFileFragment,
  type TorrentFilesQueryResultFragment,
  type TorrentFragment,
} from "~/lib/graphql/generated";
import { formatFilesize } from "~/lib/format/format";
import { useI18n } from "~/lib/i18n/I18nProvider";
import { fileTypeIcon } from "./util";

type TorrentFilesTableProps = {
  torrent: TorrentFragment;
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

  const [page, setPage] = createSignal(1);
  const [pageSize, setPageSize] = createSignal(10);

  const isSingle = () => props.torrent.filesStatus === "single";

  const files = createGraphqlQuery(TorrentFilesDocument, () =>
    isSingle()
      ? undefined
      : {
          input: {
            infoHashes: [props.torrent.infoHash],
            limit: pageSize(),
            page: page(),
            totalCount: true,
            hasNextPage: false,
          },
        },
  );

  const result = (): TorrentFilesQueryResultFragment | undefined =>
    isSingle() ? singleFileResult(props.torrent) : files.data()?.torrent.files;

  const handlePage = (event: PageEvent) => {
    setPage(event.page);
    setPageSize(event.pageSize);
  };

  return (
    <Loading
      fallback={
        <ProgressBarContainer>
          <ProgressBar indeterminate />
        </ProgressBarContainer>
      }
    >
      <div class="files-table">
        <ProgressBarContainer>
          <ProgressBar
            indeterminate={!isSingle() && isPending(() => files.data())}
          />
        </ProgressBarContainer>
        <Show when={props.torrent.filesStatus === "over_threshold"}>
          <p class="files-table-summary">
            {t("torrents.showing_x_of_y_files", {
              x: formatNumber(result()?.totalCount ?? 0),
              y:
                props.torrent.filesCount == null
                  ? "?"
                  : formatNumber(props.torrent.filesCount),
            })}
          </p>
        </Show>
        <Show when={(result()?.totalCount ?? 0) > 10}>
          <Paginator
            page={page()}
            pageSize={pageSize()}
            pageLength={result()?.items.length ?? 0}
            totalLength={result()?.totalCount ?? 0}
            totalIsEstimate={false}
            showLastPage
            onPageChange={handlePage}
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
            <For each={result()?.items ?? []}>
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
          </tbody>
        </table>
      </div>
    </Loading>
  );
}
