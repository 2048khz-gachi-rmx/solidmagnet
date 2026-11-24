import { fileRoutes } from "filesystem-routing/vite";
import solid from "@solidjs/vite-plugin";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const configuredBase = env.BASE_PATH || "/webui/";

  return {
    base: configuredBase.endsWith("/") ? configuredBase : `${configuredBase}/`,
    resolve: {
      alias: {
        "~": new URL("./src", import.meta.url).pathname,
      },
    },
    plugins: [
      solid({
        start: true,
        extensions: [".jsx", ".tsx"],
        diagnostics: false,
      }),
      fileRoutes({ types: true }),
    ],
    build: {
      outDir: "dist/client",
      emptyOutDir: true,
    },
    server: {
      port: 4200,
      allowedHosts: true,
      proxy: {
        "/graphql": {
          target: "http://localhost:3333",
          changeOrigin: true,
        },
      },
    },
    preview: {
      allowedHosts: true,
    },
  };
});
