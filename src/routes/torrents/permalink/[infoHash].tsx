import { createMemo, Loading, Show } from "solid-js";
import { Title } from "@solidjs/meta";
import { useParams } from "@solidjs/router";
import {
  Card,
  CardContent,
  CardHeader,
  ProgressBar,
  ProgressBarContainer,
} from "~/components/ui/Card";
import { Icon, MagnetIcon } from "~/components/ui/Icon";
import { TorrentChips } from "~/components/torrents/TorrentChips";
import { TorrentContent } from "~/components/torrents/TorrentContent";
import { createGraphqlQuery } from "~/lib/graphql/query";
import {
  TorrentContentSearchDocument,
  type TorrentContentFragment,
} from "~/lib/graphql/generated";
import { useI18n } from "~/lib/i18n/I18nProvider";
import { contentTypeInfo } from "~/lib/content-types";

const infoHashPattern = /^[0-9a-f]{40}$/;

export default function TorrentPermalinkPage() {
  const params = useParams();

  const infoHash = () => String(params.infoHash ?? "");
  const valid = () => infoHashPattern.test(infoHash());

  const query = createGraphqlQuery(TorrentContentSearchDocument, () =>
    valid() ? { input: { infoHashes: [infoHash()] } } : undefined,
  );

  const torrentContent = () =>
    query.data()?.torrentContent.search.items[0] as
      TorrentContentFragment | undefined;

  return (
    <Show when={valid()} fallback={<NotFoundCard />}>
      <Loading
        fallback={
          <ProgressBarContainer>
            <ProgressBar indeterminate />
          </ProgressBarContainer>
        }
      >
        <Show when={torrentContent()} fallback={<NotFoundCard />}>
          {(content) => (
            <PermalinkCard
              torrentContent={content()}
              onUpdated={() => query.refetch()}
            />
          )}
        </Show>
      </Loading>
    </Show>
  );
}

function NotFoundCard() {
  const { t } = useI18n();
  return (
    <>
      <Title>{`${t("general.page_not_found")} - bitmagnet`}</Title>
      <Card class="not-found-card">
        <CardContent>
          <h2>{t("general.page_not_found")}</h2>
        </CardContent>
      </Card>
    </>
  );
}

type PermalinkCardProps = {
  torrentContent: TorrentContentFragment;
  onUpdated: () => void;
};

function PermalinkCard(props: PermalinkCardProps) {
  const { t } = useI18n();

  const typeInfo = createMemo(() =>
    contentTypeInfo(
      props.torrentContent.contentType === null
        ? "null"
        : props.torrentContent.contentType,
    ),
  );

  const title = createMemo(() => {
    const parts = [
      props.torrentContent.title,
      t("torrents.permalink"),
      "bitmagnet",
    ];
    return parts.filter(Boolean).join(" - ");
  });

  return (
    <>
      <Title>{title()}</Title>
      <Card class="torrent-permalink">
        <CardHeader class="permalink-header">
          <span class="permalink-type-icon">
            <Icon
              name={typeInfo()?.icon ?? "question_mark"}
              title={t(
                `content_types.singular.${
                  props.torrentContent.contentType ?? "null"
                }`,
              )}
            />
          </span>
          <div class="permalink-heading">
            <h2>{props.torrentContent.torrent.name}</h2>
            <TorrentChips torrentContent={props.torrentContent} />
          </div>
          <a
            class="magnet-link"
            href={props.torrentContent.torrent.magnetUri}
            title={t("torrents.magnet")}
          >
            <MagnetIcon />
          </a>
        </CardHeader>
        <CardContent>
          <TorrentContent
            torrentContent={props.torrentContent}
            heading={false}
            onUpdated={() => props.onUpdated()}
          />
        </CardContent>
      </Card>
    </>
  );
}
