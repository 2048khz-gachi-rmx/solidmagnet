import { Title } from "@solidjs/meta";
import { useI18n } from "~/lib/i18n/I18nProvider";
import { Card, CardHeader, Divider } from "~/components/ui/Card";
import { Icon } from "~/components/ui/Icon";
import { HealthCard } from "~/components/health/HealthCard";

export default function DashboardHomePage() {
  const { t } = useI18n();
  return (
    <>
      <Title>{`${t("routes.dashboard")} - bitmagnet`}</Title>
      <Card class="dashboard-card">
        <CardHeader>
          <div class="card-toolbar">
            <h2>
              <Icon name="dashboard" />
              {t("routes.dashboard")}
            </h2>
          </div>
        </CardHeader>
        <Divider />
        <div class="card-content">
          <HealthCard />
        </div>
      </Card>
    </>
  );
}
