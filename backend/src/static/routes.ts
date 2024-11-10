import { Context, Router } from "@oak/oak";
import { AppState } from "@backend/types/application.ts";

interface CustomContext extends Context {
    // deno-lint-ignore no-explicit-any
    params?: string | any;
}

export default new Router<AppState>()
    .get("/", (context: Context) => {
        context.response.body = "Router is running";
    })
    .get("/ping", (context: Context) => {
        context.response.body = { data: "pong" };
    })
    .get("/(.*)", (context: Context) => {
        context.response.status = 404;
        context.response.body = "404 | Page not Found";
    });
