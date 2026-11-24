import { createMemo } from "solid-js";
import { Chips, type ChipItem } from "~/components/ui/Chips";
import type { TorrentContentFragment } from "~/lib/graphql/generated";
import { useI18n } from "~/lib/i18n/I18nProvider";

type TorrentChipsProps = {
  torrentContent: TorrentContentFragment;
};

export function TorrentChips(props: TorrentChipsProps) {
  const { t } = useI18n();

  const items = createMemo<ChipItem[]>(() => {
    const torrent = props.torrentContent;
    const result: ChipItem[] = [];

    for (const tagName of torrent.torrent.tagNames) {
      result.push({
        key: `tag:${tagName}`,
        label: tagName,
        icon: "sell",
        variant: "primary",
      });
    }

    if (torrent.languages && torrent.languages.length) {
      result.push({
        key: "languages",
        label: torrent.languages
          .map((language) => t(`languages.${language.id}`))
          .join(", "),
        icon: "translate",
      });
    }

    if (torrent.video3d) {
      result.push({ key: "video3d", label: torrent.video3d.slice(1) });
    }
    if (torrent.videoResolution) {
      result.push({
        key: "videoResolution",
        label: torrent.videoResolution.slice(1),
        icon: "aspect_ratio",
      });
    }
    if (torrent.videoSource) {
      result.push({
        key: "videoSource",
        label: torrent.videoSource,
        icon: "album",
      });
    }
    if (torrent.videoCodec) {
      result.push({
        key: "videoCodec",
        label: torrent.videoCodec,
        icon: "code",
      });
    }
    if (torrent.videoModifier) {
      result.push({ key: "videoModifier", label: torrent.videoModifier });
    }

    return result;
  });

  return <Chips items={items()} class="torrent-chips" />;
}
