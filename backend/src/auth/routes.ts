import { Context, Router } from "@oak/oak";
import type { AppState } from "@backend/types/application.ts";
import { getAuthState, login, logout } from "@backend/auth/controller/login.ts";
import { registration } from "@backend/auth/controller/registration.ts";
import { invite } from "@backend/auth/controller/invite.ts";

export const addAuthRoutes = (router: Router) => {
    router.post("/login", (ctx: Context<AppState>) => login(ctx))
        .post("/logout", (ctx: Context<AppState>) => logout(ctx))
        .post("/registration", (ctx: Context) => registration(ctx))
        .post("/invite", (ctx: Context<AppState>) => invite(ctx))
        .get("/authstate", (ctx: Context<AppState>) => getAuthState(ctx));
};
