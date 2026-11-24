import {
  createContext,
  createMemo,
  createSignal,
  For,
  onSettled,
  Show,
  useContext,
  type Accessor,
} from "solid-js";
import type { JSX } from "@solidjs/web";
import { graphqlRequest } from "~/lib/graphql/client";
import {
  HealthCheckDocument,
  type HealthCheckQuery,
} from "~/lib/graphql/generated";
import type { HealthStatus as ApiHealthStatus } from "~/lib/graphql/schema-types";
import { useI18n } from "~/lib/i18n/I18nProvider";
import { Icon } from "~/components/ui/Icon";
import { IconButton, Button } from "~/components/ui/Button";
import { Modal } from "~/components/ui/Modal";

export type HealthStatus = ApiHealthStatus | "started" | "error" | "degraded";

const icons: Record<HealthStatus, string> = {
  error: "error",
  degraded: "warning",
  down: "warning",
  unknown: "pending",
  inactive: "circle",
  up: "check_circle",
  started: "play_circle",
};

type Check = HealthCheckQuery["health"]["checks"][number] & { icon: string };
type Worker = HealthCheckQuery["workers"]["listAll"]["workers"][number] & {
  icon: string;
};

export type HealthResult = {
  status: HealthStatus;
  checks: Check[];
  workers: Worker[];
  error: Error | null;
  icon: string;
};

const initialResult: HealthResult = {
  status: "unknown",
  checks: [],
  icon: icons.unknown,
  workers: [],
  error: null,
};

const pollInterval = 10_000;

const HealthContext = createContext<Accessor<HealthResult>>();

function createHealthPolling() {
  const [result, setResult] = createSignal<HealthResult>(initialResult);
  let timer: number | undefined;
  let disposed = false;

  const poll = () => {
    graphqlRequest(HealthCheckDocument, {})
      .then((data) => {
        if (disposed) return;
        setResult({
          status:
            data.health.status === "down" ? "degraded" : data.health.status,
          checks: data.health.checks.map((check) => ({
            ...check,
            icon: icons[check.status],
          })),
          workers: data.workers.listAll.workers.map((worker) => ({
            ...worker,
            icon: icons[worker.started ? "started" : "inactive"],
          })),
          icon: icons[data.health.status],
          error: null,
        });
      })
      .catch((error: Error) => {
        if (disposed) return;
        setResult({
          status: "error",
          checks: [],
          workers: [],
          error,
          icon: icons.error,
        });
      })
      .finally(() => {
        if (!disposed) timer = window.setTimeout(poll, pollInterval);
      });
  };

  onSettled(() => {
    poll();
    return () => {
      disposed = true;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  });

  return result;
}

export function HealthProvider(props: { children?: JSX.Element }) {
  const health = createHealthPolling();
  return <HealthContext value={health}>{props.children}</HealthContext>;
}

export function useHealthResult() {
  return useContext(HealthContext);
}

export function HealthWidget() {
  const { t } = useI18n();
  const health = useHealthResult();
  const [open, setOpen] = createSignal(false);

  const statusKey = () => (health().error ? "down" : health().status);

  return (
    <>
      <IconButton
        label={t("health.bitmagnet_is_status", {
          status: t(`health.statuses.${health().status}`),
        })}
        class={`health-icon health-icon-${health().status}`}
        onClick={() => setOpen(true)}
      >
        <Icon name={health().icon} />
      </IconButton>
      <Modal
        open={open()}
        onClose={() => setOpen(false)}
        title={`${t("health.summary")}: ${t("health.bitmagnet_is_status", {
          status: t(`health.statuses.${statusKey()}`),
        })}`}
        actions={
          <Button onClick={() => setOpen(false)}>{t("general.dismiss")}</Button>
        }
      >
        <HealthSummary result={health()} />
      </Modal>
    </>
  );
}

export function HealthSummary(props: { result: HealthResult }) {
  const { t } = useI18n();
  const isDown = createMemo(() => props.result.status === "down");

  return (
    <Show
      when={!props.result.error}
      fallback={
        <p>
          {t("health.check_failed_with_error")}: {String(props.result.error)}
        </p>
      }
    >
      <table class="table-health">
        <thead>
          <tr>
            <th />
            <th>{t("health.component")}</th>
            <th>{t("general.status")}</th>
            <Show when={isDown()}>
              <th>{t("general.error")}</th>
            </Show>
          </tr>
        </thead>
        <tbody>
          <For each={props.result.checks}>
            {(check) => (
              <tr>
                <td class="td-icon">
                  <Icon name={check.icon} />
                </td>
                <th scope="row">{t(`health.components.${check.key}`)}</th>
                <td>{t(`health.statuses.${check.status}`)}</td>
                <Show when={isDown()}>
                  <td>{check.error}</td>
                </Show>
              </tr>
            )}
          </For>
          <For each={props.result.workers}>
            {(worker) => (
              <tr>
                <td class="td-icon">
                  <Icon name={worker.icon} />
                </td>
                <th scope="row">
                  {t("health.worker")}: {t(`health.workers.${worker.key}`)}
                </th>
                <td>
                  {t(
                    `health.statuses.${worker.started ? "started" : "inactive"}`,
                  )}
                </td>
                <Show when={isDown()}>
                  <td />
                </Show>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </Show>
  );
}
