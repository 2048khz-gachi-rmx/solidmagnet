import { pageRoutes } from "virtual:file-routes";
import { createRouter, pendingLinks } from "@solidjs/router";
import { fileRoutes } from "@solidjs/router/fs";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

export const Router = createRouter({
  base,
  routes: fileRoutes(pageRoutes),
  links: pendingLinks,
});

export const { paths } = Router;
