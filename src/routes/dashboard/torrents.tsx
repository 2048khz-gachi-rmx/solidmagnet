import { Title } from "@solidjs/meta";
import { useI18n } from "~/lib/i18n/I18nProvider";
import { Card, CardHeader, CardContent, Divider } from "~/components/ui/Card";
import { MagnetIcon } from "~/components/ui/Icon";
import { TorrentMetrics } from "~/components/dashboard/TorrentMetrics";

export default function TorrentsDashboardPage() {
  const { t } = useI18n();
  return (
    <>
      <Title>{`${t("routes.torrents")} - ${t("routes.dashboard")} - bitmagnet`}</Title>
      <Card class="dashboard-card">
        <CardHeader>
          <div class="card-toolbar">
            <h2>
              <MagnetIcon />
              {t("routes.torrents")}
            </h2>
          </div>
        </CardHeader>
        <Divider />
        <CardContent>
          <TorrentMetrics />
        </CardContent>
      </Card>
    </>
  );
}
