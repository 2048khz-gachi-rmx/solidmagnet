import { Title } from "@solidjs/meta";
import { useI18n } from "~/lib/i18n/I18nProvider";
import { Card, CardContent } from "~/components/ui/Card";

export default function NotFoundPage() {
  const { t } = useI18n();
  return (
    <>
      <Title>{`${t("general.page_not_found")} - bitmagnet`}</Title>
      <Card class="not-found-card">
        <CardContent>
          <h2>{t("general.page_not_found")}</h2>
        </CardContent>
      </Card>
    </>
  );
}
