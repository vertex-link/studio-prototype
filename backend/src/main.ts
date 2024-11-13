import { Application, Router } from "@oak/oak";
import { AppState } from "./types/application.ts";
import { Session } from "sessions";
import staticRoutes from "@backend/static/routes.ts";
import { addAuthRoutes } from "@backend/auth/routes.ts";
import { oakCors } from "@tajpouria/cors";
import { addUserRoutes } from "@backend/user/routes.ts";
import { addStudioRoutes } from "@backend/studio/routes.ts";

const app = new Application<AppState>();

// const store = await createSessionStore();

const router = new Router<AppState>();

const cors = oakCors({
  credentials: true,
  origin: Deno.env.get("CORS_ORIGIN"),
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
});

app.use(cors);
app.use(Session.initMiddleware());

addAuthRoutes(router);
addUserRoutes(router);
addStudioRoutes(router);

app.use(router.routes());
// app.use(router.routes());
app.use(staticRoutes.routes());

const port = parseInt(Deno.env.get("BE_INTERN_PORT") || "8080");
await app.listen({ port });
