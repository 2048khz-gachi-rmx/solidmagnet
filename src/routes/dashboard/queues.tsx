import type { RouteSectionProps } from "@solidjs/router";
import { useLocation } from "@solidjs/router";
import { useI18n } from "~/lib/i18n/I18nProvider";
import { paths } from "~/router";
import { Card, CardHeader, CardContent, Divider } from "~/components/ui/Card";
import { QueueIcon } from "~/components/ui/Icon";
import { TabNav } from "~/components/ui/Tabs";
import "~/components/queue/queue.css";

export default function QueueDashboardLayout(props: RouteSectionProps) {
  const { t } = useI18n();
  const location = useLocation();

  const links = () => [
    {
      key: "visualize",
      href: paths.dashboard.queues.visualize(),
      label: t("routes.visualize"),
      icon: "monitoring",
      active: location.pathname.includes("/queues/visualize"),
    },
    {
      key: "jobs",
      href: paths.dashboard.queues.jobs(),
      label: t("routes.jobs"),
      icon: "toc",
      active: location.pathname.includes("/queues/jobs"),
    },
    {
      key: "admin",
      href: paths.dashboard.queues.admin(),
      label: t("routes.admin"),
      icon: "construction",
      active: location.pathname.includes("/queues/admin"),
    },
  ];

  return (
    <Card class="dashboard-card">
      <CardHeader>
        <div class="card-toolbar">
          <TabNav
            links={links()}
            title={
              <>
                <QueueIcon />
                {t("routes.queues")}
              </>
            }
          />
        </div>
      </CardHeader>
      <Divider />
      <CardContent>{props.children}</CardContent>
    </Card>
  );
}
