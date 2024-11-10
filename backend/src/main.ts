import { Application } from "@oak/oak";
import { AppState } from "./types/application.ts";
import { Session } from "sessions";
import staticRoutes from "@backend/static/routes.ts";
import auth from "@backend/auth/routes.ts";
import { oakCors } from "@tajpouria/cors";
const app = new Application<AppState>();

// const store = await createSessionStore();

const sessionMiddleware = Session.initMiddleware();

const cors = oakCors({
  credentials: true,
  origin: Deno.env.get("CORS_ORIGIN"),
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
});

app.use(cors);
app.use(sessionMiddleware);

app.use(auth.routes());
// app.use(router.routes());
app.use(staticRoutes.routes());

const port = parseInt(Deno.env.get("BE_INTERN_PORT") || "8080");
await app.listen({ port });
