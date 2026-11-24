import { createSignal, onSettled } from "solid-js";
import { graphqlRequest } from "~/lib/graphql/client";
import { VersionDocument } from "~/lib/graphql/generated";
import { useI18n } from "~/lib/i18n/I18nProvider";

const defaultVersionName = "v-unknown";

export function Version() {
  const { t } = useI18n();
  const [version, setVersion] = createSignal(defaultVersionName);
  const [unknown, setUnknown] = createSignal(true);

  onSettled(() => {
    let cancelled = false;
    graphqlRequest(VersionDocument, {})
      .then((data) => {
        if (cancelled) return;
        if (data.version) {
          setVersion(data.version);
          setUnknown(false);
        }
      })
      .catch(() => {
        // keep the unknown placeholder
      });
    return () => {
      cancelled = true;
    };
  });

  return (
    <span
      class="version"
      title={t("version.bitmagnet_version", {
        version: unknown() ? t("version.unknown") : version(),
      })}
    >
      {version()}
    </span>
  );
}
