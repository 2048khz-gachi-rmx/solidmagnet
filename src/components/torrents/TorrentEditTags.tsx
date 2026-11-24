import { createSignal } from "solid-js";
import { Card } from "~/components/ui/Card";
import { graphqlRequest } from "~/lib/graphql/client";
import { TorrentSetTagsDocument } from "~/lib/graphql/generated";
import type { TorrentContentFragment } from "~/lib/graphql/generated";
import { useI18n } from "~/lib/i18n/I18nProvider";
import { useNotify } from "~/lib/notify/NotifyProvider";
import { TagInput } from "./TagInput";
import { errorMessage } from "./util";

type TorrentEditTagsProps = {
  torrentContent: TorrentContentFragment;
  onUpdated: () => void;
};

export function TorrentEditTags(props: TorrentEditTagsProps) {
  const { t } = useI18n();
  const notify = useNotify();

  const [editedTags, setEditedTags] = createSignal<string[]>(() => [
    ...props.torrentContent.torrent.tagNames,
  ]);
  const [newTag, setNewTag] = createSignal("");

  const saveTags = async (tagNames: string[]) => {
    try {
      await graphqlRequest(TorrentSetTagsDocument, {
        infoHashes: [props.torrentContent.infoHash],
        tagNames,
      });
      props.onUpdated();
    } catch (error) {
      notify.error(`Error saving tags: ${errorMessage(error)}`);
    }
  };

  const addTag = (tag: string) => {
    const current = editedTags();
    if (current.includes(tag)) return;
    const next = [...current, tag];
    setEditedTags(next);
    void saveTags(next);
  };

  const removeTag = (tag: string) => {
    const next = editedTags().filter((entry) => entry !== tag);
    setEditedTags(next);
    void saveTags(next);
  };

  return (
    <Card class="edit-tags-card">
      <div class="edit-tags-body">
        <TagInput
          tags={editedTags()}
          value={newTag()}
          placeholder={t("torrents.new_tag")}
          exclusions={editedTags()}
          onValueChange={setNewTag}
          onAdd={addTag}
          onRemove={removeTag}
        />
      </div>
    </Card>
  );
}
