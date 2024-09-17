import { staticPlugin } from "@elysiajs/static";
import { Elysia } from "elysia";

import api from "./api";

async function serveProductionFrontendAssetsIfAvailable(app: Elysia) {
  const indexHTML = Bun.file("dist/index.html");
  if (!(await indexHTML.exists())) return;

  app
    .use(staticPlugin({ assets: "public", indexHTML: false }))
    .use(
      staticPlugin({
        assets: "dist/assets",
        prefix: "/assets",
        indexHTML: false,
      }),
    )
    .get("/", () => indexHTML);
}

export const app = new Elysia().use(api);

await serveProductionFrontendAssetsIfAvailable(app);

app.listen({ port: 8000 });

console.log(`🦊 Elysia is running at ${app.server?.url}`);

export type Server = typeof app;
