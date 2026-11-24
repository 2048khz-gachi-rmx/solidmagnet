import { Card, CardContent, CardHeader } from "~/components/ui/Card";
import { Icon } from "~/components/ui/Icon";
import { useI18n } from "~/lib/i18n/I18nProvider";
import { HealthSummary, useHealthResult } from "./HealthWidget";

export function HealthCard() {
  const { t } = useI18n();
  const health = useHealthResult();
  const statusKey = () => (health().error ? "down" : health().status);

  return (
    <Card class="dashboard-card-health">
      <CardHeader>
        <h3 class="card-title">
          <Icon name={health().icon} />
          {t("health.bitmagnet_is_status", {
            status: t(`health.statuses.${statusKey()}`),
          })}
        </h3>
      </CardHeader>
      <CardContent>
        <HealthSummary result={health()} />
      </CardContent>
    </Card>
  );
}
