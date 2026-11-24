import { For, Show } from "solid-js";
import { paths } from "~/router";
import { useTheme } from "~/lib/theme/ThemeProvider";
import { useI18n } from "~/lib/i18n/I18nProvider";
import { useBreakpoints } from "~/lib/platform/breakpoints";
import { Icon, MagnetIcon, ExternalLinkIcon } from "~/components/ui/Icon";
import { Menu, MenuItem } from "~/components/ui/Menu";
import { HealthWidget } from "~/components/health/HealthWidget";
import { Version } from "./Version";

export function Header() {
  const { t } = useI18n();
  const { availableThemes, theme, setTheme } = useTheme();
  const { availableLanguages, lang, setLanguage } = useI18n();
  const { atLeast } = useBreakpoints();

  return (
    <header class="toolbar-header">
      <h1>
        <a href={paths.torrents()} class="brand">
          <MagnetIcon size={30} class="brand-icon" />
          <Show when={atLeast("Medium")}>
            <span class="name">bitmagnet</span>
            <Version />
          </Show>
        </a>
      </h1>
      <Show
        when={atLeast("Medium")}
        fallback={
          <a
            class="btn btn-icon"
            href={paths.dashboard()}
            title={t("routes.dashboard")}
          >
            <Icon name="dashboard" />
          </a>
        }
      >
        <nav class="main-nav">
          <a class="btn btn-text nav-link" href={paths.torrents()}>
            <MagnetIcon size={22} />
            <span>{t("routes.torrents")}</span>
          </a>
          <a class="btn btn-text nav-link" href={paths.dashboard()}>
            <Icon name="dashboard" />
            <span>{t("routes.dashboard")}</span>
          </a>
        </nav>
      </Show>
      <span class="spacer" />
      <HealthWidget />
      <Menu
        label={t("layout.change_theme")}
        trigger={<Icon name="apparel" />}
        align="end"
      >
        <For each={availableThemes}>
          {(candidate) => (
            <MenuItem
              active={theme() === candidate.key}
              onClick={() => setTheme(candidate.key)}
            >
              <Icon name={candidate.dark ? "dark_mode" : "light_mode"} />
              {candidate.label}
            </MenuItem>
          )}
        </For>
      </Menu>
      <Menu
        label={t("layout.translate")}
        trigger={<Icon name="translate" />}
        align="end"
      >
        <For each={availableLanguages}>
          {(language) => (
            <MenuItem
              active={lang() === language.id}
              onClick={() => setLanguage(language.id)}
            >
              {language.label}
            </MenuItem>
          )}
        </For>
      </Menu>
      <Menu
        label={t("layout.external_links")}
        trigger={<ExternalLinkIcon size={20} />}
        align="end"
      >
        <MenuItem href="https://bitmagnet.io" target="_blank">
          bitmagnet.io
        </MenuItem>
        <MenuItem href="https://discord.gg/6mFNszX8qM" target="_blank">
          {t("layout.bitmagnet_on_service", { service: "Discord" })}
        </MenuItem>
        <MenuItem
          href="https://github.com/bitmagnet-io/bitmagnet"
          target="_blank"
        >
          {t("layout.bitmagnet_on_service", { service: "GitHub" })}
        </MenuItem>
        <MenuItem href="https://opencollective.com/bitmagnet" target="_blank">
          {t("layout.bitmagnet_on_service", { service: "OpenCollective" })}
        </MenuItem>
      </Menu>
      <a
        class={
          atLeast("Medium")
            ? "btn btn-text button-sponsor"
            : "btn btn-icon button-sponsor"
        }
        href="https://opencollective.com/bitmagnet"
        target="_blank"
        rel="noreferrer"
        title={t("layout.support_bitmagnet")}
      >
        <Icon name="favorite" />
        <Show when={atLeast("Medium")}>{t("layout.sponsor")}</Show>
      </a>
    </header>
  );
}
