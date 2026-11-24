import { Loading, Errored } from "solid-js";
import { Title } from "@solidjs/meta";
import { Router } from "./router";
import { I18nProvider } from "~/lib/i18n/I18nProvider";
import { ThemeProvider } from "~/lib/theme/ThemeProvider";
import { BreakpointsProvider } from "~/lib/platform/breakpoints";
import { NotifyProvider } from "~/lib/notify/NotifyProvider";
import { HealthProvider } from "~/components/health/HealthWidget";
import { Header } from "~/components/layout/Header";
import { ProgressBar } from "~/components/ui/Card";
import "~/styles/global.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "@fontsource/material-symbols-outlined/400.css";

function PageFallback() {
  return (
    <div class="page-loading">
      <ProgressBar indeterminate />
    </div>
  );
}

function RouteError(props: { error: unknown; reset: () => void }) {
  return (
    <div class="error-panel">
      <h2>Something went wrong</h2>
      <p>{String(props.error)}</p>
      <button
        type="button"
        class="btn btn-stroked"
        onClick={() => props.reset()}
      >
        Try again
      </button>
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <BreakpointsProvider>
        <ThemeProvider>
          <NotifyProvider>
            <HealthProvider>
              <Title>bitmagnet</Title>
              <Header />
              <main class="app-content">
                <Router>
                  {(props) => (
                    <Errored
                      fallback={(error, reset) => (
                        <RouteError error={error()} reset={reset} />
                      )}
                    >
                      <Loading fallback={<PageFallback />}>
                        {props.children}
                      </Loading>
                    </Errored>
                  )}
                </Router>
              </main>
            </HealthProvider>
          </NotifyProvider>
        </ThemeProvider>
      </BreakpointsProvider>
    </I18nProvider>
  );
}
