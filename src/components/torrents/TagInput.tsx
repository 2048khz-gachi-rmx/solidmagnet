import { createEffect, createSignal, For, Show } from "solid-js";
import { Icon } from "~/components/ui/Icon";
import { graphqlRequest } from "~/lib/graphql/client";
import { TorrentSuggestTagsDocument } from "~/lib/graphql/generated";
import { normalizeTagInput } from "./util";

type TagInputProps = {
  tags: string[];
  value: string;
  placeholder?: string;
  exclusions?: string[];
  onValueChange: (value: string) => void;
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
};

/**
 * Chip input with debounced tag suggestions. The parent owns the draft value
 * so it can flush a pending tag before a bulk mutation.
 */
export function TagInput(props: TagInputProps) {
  const [suggestions, setSuggestions] = createSignal<string[]>([]);
  const [focused, setFocused] = createSignal(false);
  let requestId = 0;

  const loadSuggestions = async (value: string) => {
    const id = ++requestId;
    try {
      const data = await graphqlRequest(TorrentSuggestTagsDocument, {
        input: {
          prefix: value ? normalizeTagInput(value) : undefined,
          exclusions: props.exclusions,
        },
      });
      if (id === requestId) {
        setSuggestions(
          data.torrent.suggestTags.suggestions.map((tag) => tag.name),
        );
      }
    } catch {
      // Suggestions are best-effort; a failed lookup must not interrupt typing.
    }
  };

  createEffect(
    () => ({ value: props.value, exclusions: props.exclusions }),
    ({ value }) => {
      const handle = window.setTimeout(() => {
        void loadSuggestions(value);
      }, 300);
      return () => window.clearTimeout(handle);
    },
  );

  const commit = () => {
    const tag = normalizeTagInput(props.value);
    if (!tag) return;
    props.onAdd(tag);
    props.onValueChange("");
  };

  return (
    <div class="tag-input">
      <div class="tag-input-chips">
        <For each={props.tags}>
          {(tag) => (
            <span class="chip">
              <span class="chip-label">{tag}</span>
              <button
                type="button"
                class="chip-remove"
                aria-label="Remove"
                onClick={() => props.onRemove(tag)}
              >
                <Icon name="cancel" />
              </button>
            </span>
          )}
        </For>
        <input
          class="tag-input-field"
          type="text"
          value={props.value}
          placeholder={props.placeholder}
          autocapitalize="none"
          autocomplete="off"
          onInput={(event) => props.onValueChange(event.currentTarget.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              commit();
            }
          }}
        />
      </div>
      <Show when={focused() && suggestions().length > 0}>
        <ul class="tag-suggestions">
          <For each={suggestions()}>
            {(suggestion) => (
              <li>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    props.onAdd(suggestion);
                    props.onValueChange("");
                  }}
                >
                  {suggestion}
                </button>
              </li>
            )}
          </For>
        </ul>
      </Show>
    </div>
  );
}
