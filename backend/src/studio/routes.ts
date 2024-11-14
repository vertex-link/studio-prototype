import type { Context, Router } from "@oak/oak";
import { createNewSocket } from "@backend/studio/index.ts";
import { getUserFromSession } from "@services/user.ts";
import type { AppState } from "@backend/types/application.ts";

const setUpWebSocket = async (context: Context<AppState>) => {
    const userId = context.request.url.searchParams.get("userId") as string;

    console.log("quserId", userId);

    if (!context.isUpgradable || userId === undefined) {
        context.throw(501);
    }
    const ws = context.upgrade();

    const socketResponse = createNewSocket(ws, context.response, userId);

    return socketResponse;
};

const getScene = async (ctx: Context<AppState>) => {
    return ctx.response;
}

export const addStudioRoutes = (router: Router<AppState>) => {
    router
        .get('/studio/scene/', getScene)
        .get("/studio/socket", setUpWebSocket);
};
