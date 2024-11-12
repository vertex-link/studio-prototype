import type { Context, Router } from "@oak/oak";
import { helpers } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { isUsernameAvail } from "@services/user.ts";
import { getUsers } from "@services/mongo/users.ts";

export const addUserRoutes = (router: Router) => {
    router.get("/user/name-available/:name", async (ctx: Context) => {
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

    return router;
};
