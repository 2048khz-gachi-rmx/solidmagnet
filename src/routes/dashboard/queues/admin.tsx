import { Title } from "@solidjs/meta";
import { useI18n } from "~/lib/i18n/I18nProvider";
import { QueueAdmin } from "~/components/queue/QueueAdmin";

export default function QueueAdminRoute() {
  const { t } = useI18n();
  return (
    <>
      <Title>
        {`${t("routes.admin")} - ${t("routes.queues")} - ${t(
          "routes.dashboard",
        )} - bitmagnet`}
      </Title>
      <QueueAdmin />
    </>
  );
}
