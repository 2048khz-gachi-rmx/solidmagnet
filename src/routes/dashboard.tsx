import { createSignal, Show } from "solid-js";
import type { RouteSectionProps } from "@solidjs/router";
import { paths } from "~/router";
import { useBreakpoints } from "~/lib/platform/breakpoints";
import { useI18n } from "~/lib/i18n/I18nProvider";
import { IconButton } from "~/components/ui/Button";
import { Icon, MagnetIcon, QueueIcon } from "~/components/ui/Icon";
import { Sidebar, DrawerLayout } from "~/components/ui/Sidebar";

export default function DashboardLayout(props: RouteSectionProps) {
  const { t } = useI18n();
  const { atLeast } = useBreakpoints();
  const [mobileOpen, setMobileOpen] = createSignal(false);
  const open = () => atLeast("Medium") || mobileOpen();

  return (
    <DrawerLayout
      sidebar={
        <Sidebar open={open()} onClose={() => setMobileOpen(false)}>
          <nav class="sidebar-nav">
            <ul>
              <li>
                <a class="btn btn-text sidebar-link" href={paths.dashboard()}>
                  <Icon name="dashboard" />
                  {t("routes.home")}
                </a>
              </li>
              <li>
                <a
                  class="btn btn-text sidebar-link"
                  href={paths.dashboard.queues()}
                >
                  <QueueIcon />
                  {t("routes.queues")}
                </a>
              </li>
              <li>
                <a
                  class="btn btn-text sidebar-link"
                  href={paths.dashboard.torrents()}
                >
                  <MagnetIcon />
                  {t("routes.torrents")}
                </a>
              </li>
            </ul>
          </nav>
        </Sidebar>
      }
    >
      <Show when={!atLeast("Medium")}>
        <div class="drawer-toggle-row">
          <IconButton
            label={t("torrents.toggle_drawer")}
            onClick={() => setMobileOpen((value) => !value)}
          >
            <Icon name={open() ? "arrow_circle_left" : "arrow_circle_right"} />
          </IconButton>
        </div>
      </Show>
      {props.children}
    </DrawerLayout>
  );
}
