import {
  createEffect,
  createMemo,
  createSignal,
  For,
  Match,
  Show,
  Switch,
} from "solid-js";
import { Button, IconButton } from "~/components/ui/Button";
import { Card, CardActions, CardContent } from "~/components/ui/Card";
import { Icon, MagnetIcon } from "~/components/ui/Icon";
import { copyToClipboard } from "~/lib/platform/clipboard";
import { useI18n } from "~/lib/i18n/I18nProvider";
import { useNotify } from "~/lib/notify/NotifyProvider";
import { graphqlRequest } from "~/lib/graphql/client";
import {
  TorrentDeleteDocument,
  TorrentDeleteTagsDocument,
  TorrentPutTagsDocument,
  TorrentSetTagsDocument,
  type TorrentContentFragment,
} from "~/lib/graphql/generated";
import { TagInput } from "./TagInput";
import { TorrentReprocess } from "./TorrentReprocess";
import { errorMessage, normalizeTagInput } from "./util";

type TorrentsBulkActionsProps = {
  selectedItems: TorrentContentFragment[];
  onUpdated: () => void;
};

type BulkAction = {
  key: "copy" | "tags" | "reprocess" | "delete";
  icon: string;
  label: string;
};

export function TorrentsBulkActions(props: TorrentsBulkActionsProps) {
  const { t } = useI18n();
  const notify = useNotify();

  const [activeAction, setActiveAction] = createSignal("");
  const [editedTags, setEditedTags] = createSignal<string[]>([]);
  const [newTag, setNewTag] = createSignal("");

  // The bar is only usable while rows are selected; close any open intent
  // when the selection is cleared.
  createEffect(
    () => props.selectedItems.length,
    (length) => {
      if (length === 0) setActiveAction("");
    },
  );

  const infoHashes = createMemo(() =>
    props.selectedItems.map((item) => item.infoHash),
  );

  const actions = createMemo<BulkAction[]>(() => [
    {
      key: "copy",
      icon: "content_copy",
      label: t("torrents.copy"),
    },
    {
      key: "tags",
      icon: "sell",
      label: t("torrents.edit_tags"),
    },
    {
      key: "reprocess",
      icon: "category",
      label: t("torrents.classification"),
    },
    {
      key: "delete",
      icon: "delete_forever",
      label: t("torrents.delete"),
    },
  ]);

  const activeActionLabel = createMemo(
    () =>
      actions().find((action) => action.key === activeAction())?.label ?? "",
  );

  const toggleAction = (key: BulkAction["key"]) => {
    setActiveAction((current) => (current === key ? "" : key));
  };

  const copy = async (text: string) => {
    if (!text) return;
    try {
      await copyToClipboard(text);
      notify.info(t("torrents.copy_to_clipboard"));
    } catch (error) {
      notify.error(errorMessage(error));
    }
  };

  const magnetLinks = () =>
    props.selectedItems.map((item) => item.torrent.magnetUri).join("\n");

  const infoHashLines = () => infoHashes().join("\n");

  const addTag = (tag: string) => {
    const current = editedTags();
    if (!current.includes(tag)) setEditedTags([...current, tag]);
    setNewTag("");
  };

  const removeTag = (tag: string) => {
    setEditedTags(editedTags().filter((entry) => entry !== tag));
  };

  const tagsToSave = (): string[] => {
    const draft = normalizeTagInput(newTag());
    const current = editedTags();
    if (draft && !current.includes(draft)) return [...current, draft];
    return current;
  };

  const saveTags = async (mode: "set" | "put" | "delete") => {
    const hashes = infoHashes();
    if (!hashes.length) return;
    const tagNames = tagsToSave();
    setEditedTags(tagNames);
    setNewTag("");
    try {
      if (mode === "set") {
        await graphqlRequest(TorrentSetTagsDocument, {
          infoHashes: hashes,
          tagNames,
        });
      } else if (mode === "put") {
        await graphqlRequest(TorrentPutTagsDocument, {
          infoHashes: hashes,
          tagNames,
        });
      } else {
        await graphqlRequest(TorrentDeleteTagsDocument, {
          infoHashes: hashes,
          tagNames,
        });
      }
      props.onUpdated();
    } catch (error) {
      const label =
        mode === "set" ? "setting" : mode === "put" ? "putting" : "deleting";
      notify.error(`Error ${label} tags: ${errorMessage(error)}`);
    }
  };

  const deleteTorrents = async () => {
    const hashes = infoHashes();
    if (!hashes.length) return;
    try {
      await graphqlRequest(TorrentDeleteDocument, { infoHashes: hashes });
      props.onUpdated();
    } catch (error) {
      notify.error(`Error deleting torrents: ${errorMessage(error)}`);
    }
  };

  return (
    <Show when={props.selectedItems.length > 0}>
      <div class="bulk-actions">
        <Show when={activeAction()}>
          <div class="bulk-actions-panel">
            <div class="bulk-actions-panel-header">
              <span>{activeActionLabel()}</span>
              <IconButton
                label={t("general.dismiss")}
                onClick={() => setActiveAction("")}
              >
                <Icon name="close" />
              </IconButton>
            </div>

            <Switch>
              <Match when={activeAction() === "copy"}>
                <Card>
                  <CardActions class="button-row">
                    <Button
                      variant="stroked"
                      disabled={!props.selectedItems.length}
                      title={t("torrents.copy_to_clipboard")}
                      onClick={() => void copy(magnetLinks())}
                    >
                      <MagnetIcon />
                      {t("torrents.magnet_links")}
                    </Button>
                    <Button
                      variant="stroked"
                      disabled={!props.selectedItems.length}
                      title={t("torrents.copy_to_clipboard")}
                      onClick={() => void copy(infoHashLines())}
                    >
                      <Icon name="tag" />
                      {t("torrents.info_hashes")}
                    </Button>
                  </CardActions>
                </Card>
              </Match>

              <Match when={activeAction() === "tags"}>
                <Card>
                  <CardContent class="bulk-tags-content">
                    <TagInput
                      tags={editedTags()}
                      value={newTag()}
                      placeholder={t("torrents.tags.placeholder")}
                      exclusions={editedTags()}
                      onValueChange={setNewTag}
                      onAdd={addTag}
                      onRemove={removeTag}
                    />
                  </CardContent>
                  <CardActions class="button-row">
                    <Button
                      variant="stroked"
                      disabled={!props.selectedItems.length}
                      title={t("torrents.tags.set_tip")}
                      onClick={() => void saveTags("set")}
                    >
                      {t("torrents.tags.set")}
                    </Button>
                    <Button
                      variant="stroked"
                      disabled={
                        !props.selectedItems.length ||
                        (!editedTags().length && !newTag())
                      }
                      title={t("torrents.tags.put_tip")}
                      onClick={() => void saveTags("put")}
                    >
                      {t("torrents.tags.put")}
                    </Button>
                    <Button
                      variant="stroked"
                      disabled={
                        !props.selectedItems.length ||
                        (!editedTags().length && !newTag())
                      }
                      title={t("torrents.tags.delete_tip")}
                      onClick={() => void saveTags("delete")}
                    >
                      {t("torrents.tags.delete")}
                    </Button>
                  </CardActions>
                </Card>
              </Match>

              <Match when={activeAction() === "reprocess"}>
                <TorrentReprocess
                  infoHashes={infoHashes()}
                  onUpdated={() => props.onUpdated()}
                />
              </Match>

              <Match when={activeAction() === "delete"}>
                <Card>
                  <CardContent class="delete-confirmation">
                    <p>
                      <strong>{t("torrents.delete_are_you_sure")}</strong>
                      <br />
                      {t("torrents.delete_action_cannot_be_undone")}.
                    </p>
                  </CardContent>
                  <CardActions class="button-row">
                    <Button
                      variant="warning"
                      disabled={!props.selectedItems.length}
                      onClick={() => void deleteTorrents()}
                    >
                      <Icon name="delete_forever" />
                      {t("torrents.delete")}
                    </Button>
                  </CardActions>
                </Card>
              </Match>
            </Switch>
          </div>
        </Show>

        <div class="bulk-actions-bar" role="toolbar">
          <For each={actions()}>
            {(action) => (
              <button
                type="button"
                class={[
                  "bulk-action",
                  { active: activeAction() === action.key },
                ]}
                title={action.label}
                onClick={() => toggleAction(action.key)}
              >
                <Icon name={action.icon} />
                <span class="bulk-action-label">{action.label}</span>
              </button>
            )}
          </For>
        </div>
      </div>
    </Show>
  );
}
