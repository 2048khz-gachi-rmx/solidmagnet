import { createMemo, createSignal, For, Match, Show, Switch } from "solid-js";
import { Button } from "~/components/ui/Button";
import { Card, CardActions, CardContent, Divider } from "~/components/ui/Card";
import { Icon } from "~/components/ui/Icon";
import { Tabs, type TabItem } from "~/components/ui/Tabs";
import { paths } from "~/router";
import { useBreakpoints } from "~/lib/platform/breakpoints";
import { useI18n } from "~/lib/i18n/I18nProvider";
import { useNotify } from "~/lib/notify/NotifyProvider";
import { copyToClipboard } from "~/lib/platform/clipboard";
import { formatFilesize, formatTimeAgo } from "~/lib/format/format";
import { graphqlRequest } from "~/lib/graphql/client";
import {
  TorrentDeleteDocument,
  type TorrentContentFragment,
} from "~/lib/graphql/generated";
import type { TorrentTab, TorrentTabSelection } from "./search-controls";
import { TorrentEditTags } from "./TorrentEditTags";
import { TorrentFilesTable } from "./TorrentFilesTable";
import { TorrentReprocess } from "./TorrentReprocess";
import { errorMessage } from "./util";
import "./torrents.css";

type TorrentContentProps = {
  torrentContent: TorrentContentFragment;
  heading?: boolean;
  size?: boolean;
  peers?: boolean;
  published?: boolean;
  selectedTab?: TorrentTabSelection;
  onTabSelected?: (tab: TorrentTabSelection) => void;
  onUpdated: () => void;
};

export function TorrentContent(props: TorrentContentProps) {
  const { t, lang, formatNumber } = useI18n();
  const { atLeast } = useBreakpoints();
  const notify = useNotify();

  const [localTab, setLocalTab] = createSignal<TorrentTabSelection>(
    () => props.selectedTab,
  );

  const activeTab = (): TorrentTabSelection =>
    props.onTabSelected ? props.selectedTab : localTab();

  const selectTab = (tab: TorrentTabSelection) => {
    if (props.onTabSelected) props.onTabSelected(tab);
    else setLocalTab(tab);
  };

  const attribute = (key: string, source?: string): string | undefined =>
    props.torrentContent.content?.attributes?.find(
      (entry) =>
        entry.key === key && (source === undefined || entry.source === source),
    )?.value;

  const posterPath = () => attribute("poster_path", "tmdb");

  const genres = (): string[] | undefined => {
    const collections = props.torrentContent.content?.collections
      ?.filter((collection) => collection.type === "genre")
      .map((collection) => collection.name);
    return collections?.length ? [...collections].sort() : undefined;
  };

  const languages = (): string | undefined => {
    const list = props.torrentContent.languages;
    if (!list?.length) return undefined;
    const originalId = props.torrentContent.content?.originalLanguage?.id;
    return list
      .map((language) =>
        language.id === originalId
          ? `${language.name} (original)`
          : language.name,
      )
      .join(", ");
  };

  const filesCount = (): number | undefined => {
    if (props.torrentContent.torrent.filesStatus === "single") return 1;
    return props.torrentContent.torrent.filesCount ?? undefined;
  };

  const tabItems = createMemo<TabItem[]>(() => [
    {
      key: "files",
      icon: "file_present",
      label: (
        <>
          <span class="tab-label-text">{t("torrents.files")}</span>
          <Show when={filesCount()}>
            {(count) => (
              <span class="files-count">({formatNumber(count())})</span>
            )}
          </Show>
        </>
      ),
    },
    {
      key: "tags",
      icon: "sell",
      label: <span class="tab-label-text">{t("torrents.edit_tags")}</span>,
    },
    {
      key: "reprocess",
      icon: "category",
      label: <span class="tab-label-text">{t("torrents.classification")}</span>,
    },
    {
      key: "delete",
      icon: "delete_forever",
      label: <span class="tab-label-text">{t("torrents.delete")}</span>,
    },
  ]);

  const copyHash = async () => {
    try {
      await copyToClipboard(props.torrentContent.infoHash);
      notify.info(t("torrents.copy_to_clipboard"));
    } catch (error) {
      notify.error(errorMessage(error));
    }
  };

  const deleteTorrent = async () => {
    try {
      await graphqlRequest(TorrentDeleteDocument, {
        infoHashes: [props.torrentContent.infoHash],
      });
      props.onUpdated();
    } catch (error) {
      notify.error(`Error deleting torrent: ${errorMessage(error)}`);
    }
  };

  return (
    <div class="torrent-content">
      <Show when={posterPath()}>
        {(path) => (
          <img
            class="poster"
            src={`https://image.tmdb.org/t/p/w300/${path()}`}
            alt={t("torrents.poster")}
            width={atLeast("Medium") ? 300 : 150}
            height={atLeast("Medium") ? 450 : 225}
            loading="lazy"
          />
        )}
      </Show>

      <Show when={props.heading !== false}>
        <h2 class="torrent-heading">
          <a
            href={paths.torrents.permalink(props.torrentContent.infoHash)}
            title={t("torrents.permalink")}
          >
            {props.torrentContent.torrent.name}
          </a>
        </h2>
      </Show>

      <Show when={props.size !== false}>
        <p class="size">
          <strong>{t("torrents.size")}:</strong>&nbsp;
          <span
            class="filesize"
            title={formatFilesize(
              props.torrentContent.torrent.size,
              lang(),
              10,
            )}
          >
            {formatFilesize(props.torrentContent.torrent.size, lang())}
          </span>
        </p>
      </Show>

      <Show when={props.published !== false}>
        <p class="published">
          <strong>{t("torrents.published")}</strong>{" "}
          {formatTimeAgo(props.torrentContent.publishedAt, lang())}
        </p>
      </Show>

      <Show when={props.peers !== false}>
        <p class="peers">
          <strong>{t("torrents.s_l")}:</strong>{" "}
          {props.torrentContent.seeders ?? "?"} /{" "}
          {props.torrentContent.leechers ?? "?"}
        </p>
      </Show>

      <p class="info-hash">
        <strong>{t("torrents.info_hash")}:</strong>
        <span
          title={t("torrents.copy_to_clipboard")}
          onClick={() => void copyHash()}
        >
          {props.torrentContent.infoHash}
        </span>
      </p>

      <p>
        <strong>{t("torrents.source")}:</strong>&nbsp;
        <For each={props.torrentContent.torrent.sources}>
          {(source, index) => (
            <span>
              {index() > 0 ? ", " : ""}
              {source.name}
            </span>
          )}
        </For>
      </p>

      <Show when={props.torrentContent.content?.title}>
        {(title) => (
          <p>
            <strong>{t("torrents.title")}:</strong> {title()}
          </p>
        )}
      </Show>

      <Show when={languages()}>
        {(value) => (
          <p>
            <strong>{t("torrents.languages")}:</strong>&nbsp;{value()}
          </p>
        )}
      </Show>

      <Show when={props.torrentContent.content?.releaseYear}>
        <p>
          <strong>{t("torrents.original_release_date")}:</strong>{" "}
          {props.torrentContent.content?.releaseDate ??
            props.torrentContent.content?.releaseYear}
        </p>
      </Show>

      <Show when={props.torrentContent.episodes}>
        {(episodes) => (
          <p>
            <strong>{t("torrents.episodes")}:</strong> {episodes().label}
          </p>
        )}
      </Show>

      <Show when={props.torrentContent.content?.overview}>
        {(overview) => <p>{overview()}</p>}
      </Show>

      <Show when={genres()}>
        {(value) => (
          <p>
            <strong>{t("torrents.genres")}:</strong> {value().join(", ")}
          </p>
        )}
      </Show>

      <Show when={props.torrentContent.content?.voteAverage != null}>
        <p>
          <strong>{t("torrents.rating")}:</strong>{" "}
          {props.torrentContent.content?.voteAverage} / 10{" "}
          <Show when={props.torrentContent.content?.voteCount != null}>
            (
            {t("torrents.votes_count_n", {
              count: formatNumber(props.torrentContent.content?.voteCount ?? 0),
            })}
            )
          </Show>
        </p>
      </Show>

      <Show when={props.torrentContent.content?.externalLinks?.length}>
        <p>
          <strong>{t("torrents.external_links")}:</strong>&nbsp;
          <For each={props.torrentContent.content?.externalLinks ?? []}>
            {(link, index) => (
              <>
                {index() > 0 ? ", " : ""}
                <a href={link.url} target="_blank" rel="noreferrer">
                  {link.metadataSource.name}
                </a>
              </>
            )}
          </For>
        </p>
      </Show>

      <Divider class="torrent-content-divider" />

      <Tabs
        class="torrent-tabs"
        items={tabItems()}
        value={activeTab() ?? ""}
        onChange={(key) => {
          const tab = key as TorrentTab;
          selectTab(activeTab() === tab ? undefined : tab);
        }}
      />

      <Switch>
        <Match when={activeTab() === "files"}>
          <Card class="torrent-files">
            <Show when={props.torrentContent.torrent.filesStatus === "no_info"}>
              <p class="files-no-info">{t("torrents.files_no_info")}</p>
            </Show>
            <TorrentFilesTable torrent={props.torrentContent.torrent} />
          </Card>
        </Match>

        <Match when={activeTab() === "tags"}>
          <TorrentEditTags
            torrentContent={props.torrentContent}
            onUpdated={() => props.onUpdated()}
          />
        </Match>

        <Match when={activeTab() === "reprocess"}>
          <TorrentReprocess
            infoHashes={[props.torrentContent.infoHash]}
            onUpdated={() => props.onUpdated()}
          />
        </Match>

        <Match when={activeTab() === "delete"}>
          <Card>
            <CardContent class="delete-confirmation">
              <p>
                <strong>{t("torrents.delete_are_you_sure")}</strong>
                <br />
                {t("torrents.delete_action_cannot_be_undone")}
              </p>
            </CardContent>
            <CardActions class="button-row">
              <Button variant="warning" onClick={() => void deleteTorrent()}>
                <Icon name="delete_forever" />
                {t("torrents.delete")}
              </Button>
            </CardActions>
          </Card>
        </Match>
      </Switch>
    </div>
  );
}
