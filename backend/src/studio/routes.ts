import type { Context, Router } from "@oak/oak";
import { createNewSocket } from "@backend/studio/index.ts";

export const addStudioRoutes = (router: Router) => {
    router.get("/studio/socket", (context: Context) => {
        if (!context.isUpgradable) {
            context.throw(501);
        }
        const ws = context.upgrade();

        const params = new URL(context.request.url).searchParams;
        const userId = params.get("userId") || "";

        // console.log(cookie);

        // console.log(Object.fromEntries([...headers]), req);

        // const url = new URL(req.url);

        // if (req.body) {
        //   const body = await req.text();
        //   console.log("Body:", body);
        // }
        const socketResponse = createNewSocket(ws, context.response, userId);

        return socketResponse;
    });
};
