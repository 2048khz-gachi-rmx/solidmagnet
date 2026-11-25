import { createMemo, For, Show } from "solid-js";
import { Card, CardContent, ProgressBar } from "~/components/ui/Card";
import { Checkbox } from "~/components/ui/Field";
import { Icon, MagnetIcon } from "~/components/ui/Icon";
import { formatFilesize, formatTimeAgo } from "~/lib/format/format";
import { useBreakpoints } from "~/lib/platform/breakpoints";
import { useI18n } from "~/lib/i18n/I18nProvider";
import { contentTypeInfo } from "~/lib/content-types";
import type { TorrentContentFragment } from "~/lib/graphql/generated";
import type { TorrentSelection, TorrentTabSelection } from "./search-controls";
import { TorrentChips } from "./TorrentChips";
import { TorrentContent } from "./TorrentContent";

export const allColumns = [
  "select",
  "summary",
  "size",
  "publishedAt",
  "peers",
  "magnet",
] as const;

export const compactColumns = ["select", "summary", "size", "magnet"] as const;

export type Column = (typeof allColumns)[number];

type TorrentsTableProps = {
  items: TorrentContentFragment[];
  loading: boolean;
  selected: string[];
  selectedTorrent?: TorrentSelection;
  onSelectionChange: (infoHashes: string[]) => void;
  onToggleTorrent: (infoHash: string) => void;
  onTabSelected: (infoHash: string, tab: TorrentTabSelection) => void;
  onUpdated: () => void;
};

export function TorrentsTable(props: TorrentsTableProps) {
  const { t, lang } = useI18n();
  const { atLeast } = useBreakpoints();

  const columns = createMemo<readonly Column[]>(() =>
    atLeast("Medium") ? allColumns : compactColumns,
  );

  const hasColumn = (column: Column) => columns().includes(column);

  const isSelected = (infoHash: string) => props.selected.includes(infoHash);

  const allSelected = () =>
    props.items.length > 0 &&
    props.items.every((item) => isSelected(item.infoHash));

  const someSelected = () => props.selected.length > 0 && !allSelected();

  const toggleAll = () => {
    if (allSelected()) {
      props.onSelectionChange([]);
      return;
    }
    props.onSelectionChange(props.items.map((item) => item.infoHash));
  };

  const toggleOne = (infoHash: string) => {
    if (isSelected(infoHash)) {
      props.onSelectionChange(
        props.selected.filter((entry) => entry !== infoHash),
      );
    } else {
      props.onSelectionChange([...props.selected, infoHash]);
    }
  };

  const isExpanded = (infoHash: string) =>
    props.selectedTorrent?.infoHash === infoHash;

  return (
    <div class="torrents-table-wrap">
      <ProgressBar indeterminate={props.loading} />
      <table class="table torrents-table">
        <thead>
          <tr>
            <Show when={hasColumn("select")}>
              <th class="column-select">
                <Checkbox
                  checked={allSelected()}
                  indeterminate={someSelected()}
                  ariaLabel={
                    allSelected()
                      ? t("torrents.deselect_all")
                      : t("torrents.select_all")
                  }
                  onChange={toggleAll}
                />
              </th>
            </Show>
            <th>{t("torrents.summary")}</th>
            <Show when={hasColumn("size")}>
              <th class="column-size">{t("torrents.size")}</th>
            </Show>
            <Show when={hasColumn("publishedAt")}>
              <th class="column-published-at">{t("torrents.published")}</th>
            </Show>
            <Show when={hasColumn("peers")}>
              <th class="column-peers">
                <abbr
                  title={`${t("torrents.seeders")} / ${t("torrents.leechers")}`}
                >
                  {t("torrents.s_l")}
                </abbr>
              </th>
            </Show>
            <Show when={hasColumn("magnet")}>
              <th class="column-magnet">{t("torrents.magnet")}</th>
            </Show>
          </tr>
        </thead>
        <tbody>
          {/* Results are keyed by info hash so a torrent keeps its row when
              it survives a refresh. */}
          <For each={props.items} keyed={(item) => item.infoHash}>
            {(item) => (
              <>
                <tr
                  class={[
                    "summary-row",
                    { expanded: isExpanded(item().infoHash) },
                  ]}
                >
                  <Show when={hasColumn("select")}>
                    <td class="column-select">
                      <Checkbox
                        checked={isSelected(item().infoHash)}
                        ariaLabel={t("torrents.select_all")}
                        onChange={() => toggleOne(item().infoHash)}
                      />
                    </td>
                  </Show>
                  <td
                    class="column-summary"
                    onClick={() => props.onToggleTorrent(item().infoHash)}
                  >
                    <div class="summary-cell">
                      <Icon
                        name={
                          contentTypeInfo(item().contentType)?.icon ??
                          "question_mark"
                        }
                        class="content-type-icon"
                        title={t(
                          `content_types.singular.${item().contentType ?? "null"}`,
                        )}
                      />
                      <span class="title" title={item().torrent.name}>
                        {item().title}
                      </span>
                      <TorrentChips torrentContent={item()} />
                    </div>
                  </td>
                  <Show when={hasColumn("size")}>
                    <td class="column-size">
                      <span
                        class="filesize"
                        title={formatFilesize(item().torrent.size, lang(), 10)}
                      >
                        {formatFilesize(item().torrent.size, lang())}
                      </span>
                    </td>
                  </Show>
                  <Show when={hasColumn("publishedAt")}>
                    <td class="column-published-at">
                      <abbr title={item().publishedAt}>
                        {formatTimeAgo(item().publishedAt, lang())}
                      </abbr>
                    </td>
                  </Show>
                  <Show when={hasColumn("peers")}>
                    <td class="column-peers">
                      {item().seeders ?? "?"} / {item().leechers ?? "?"}
                    </td>
                  </Show>
                  <Show when={hasColumn("magnet")}>
                    <td class="column-magnet">
                      <a
                        href={item().torrent.magnetUri}
                        class="magnet-link"
                        title={t("torrents.magnet")}
                      >
                        <MagnetIcon />
                      </a>
                    </td>
                  </Show>
                </tr>
                <Show when={isExpanded(item().infoHash)}>
                  <tr class="detail-row">
                    <td colspan={columns().length}>
                      <div class="item-detail expanded">
                        <div class="item-detail-inner">
                          <Card class="detail-card">
                            <CardContent>
                              <TorrentContent
                                torrentContent={item()}
                                size={false}
                                published={atLeast("Medium")}
                                peers={atLeast("Medium")}
                                selectedTab={props.selectedTorrent?.tab}
                                onTabSelected={(tab) =>
                                  props.onTabSelected(item().infoHash, tab)
                                }
                                onUpdated={() => props.onUpdated()}
                              />
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </td>
                  </tr>
                </Show>
              </>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
}
