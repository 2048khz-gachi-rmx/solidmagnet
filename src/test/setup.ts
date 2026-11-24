import "@testing-library/jest-dom/vitest";
import { configure } from "@solidjs/testing-library";

// The integration test renders the full router and lazily-loaded route modules.
// CI can be slower than a local machine, so don't fail after Testing Library's
// one-second default while those first modules are still loading.
configure({ asyncUtilTimeout: 5000 });

if (!window.matchMedia) {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;
}
