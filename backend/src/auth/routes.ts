import { Context, Router } from "@oak/oak";
import type { AppState } from "@backend/types/application.ts";
import { getAuthState, login, logout } from "@backend/auth/controller/login.ts";
import { registration } from "@backend/auth/controller/registration.ts";
import { invite } from "@backend/auth/controller/invite.ts";
import { isUsernameAvail } from "@services/user.ts";
import { helpers } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { getUsers } from "@services/mongo/index.ts";

export default new Router<AppState>()
    .post("/login", (ctx: Context<AppState>) => login(ctx))
    .post("/logout", (ctx: Context<AppState>) => logout(ctx))
    .post("/registration", (ctx: Context) => registration(ctx))
    .post("/invite", (ctx: Context<AppState>) => invite(ctx))
    .get("/authstate", (ctx: Context<AppState>) => getAuthState(ctx))
    .get("/user/name-available/:name", async (ctx: Context) => {
        const params = helpers.getQuery(ctx, { mergeParams: true });

        const request = await isUsernameAvail(params.name);

        ctx.response.body = request;
    })
    .get("/user/:id", (context: Context) => {
        const obj = helpers.getQuery(context, { mergeParams: true });

        context.response.body = obj;
    })
    .get("/user/:id/:name", (context: Context) => {
        const obj = helpers.getQuery(context, { mergeParams: true });

        context.response.body = { ...obj, parsed: true };
    })
    .get("/users", async (context: Context) => {
        const result = await getUsers().catch((err) => {
            return {
                type: "Error",
                code: 600,
                message: err,
            };
        });

        context.response.body = result;
    });
