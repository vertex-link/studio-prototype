import { UserAuth } from "@backend/types/user.ts";

import { getValidatedRequest, isJWTValid } from "@services/auth.ts";
import { attemptRegistration } from "@services/registration.ts";
import { deleteUsedInvite } from "@services/mongo/users.ts";
import { isUsernameAvail } from "@services/user.ts";

import type { Context } from "@oak/oak";

export async function registration(ctx: Context) {
    const req = JSON.parse(await getValidatedRequest(ctx));

    console.log(req);

    if (
        !(req.token && req.mail && req.password && req.password_repeat &&
            req.username)
    ) {
        ctx.response.body = "not all set";
        ctx.response.status = 400;
        return;
    }

    if (req.password !== req.password_repeat) {
        ctx.response.status = 400;
        return;
    }

    if (!isUsernameAvail(req.username)) {
        ctx.response.status = 400;
        return;
    }

    try {
        const isTokenValid = await isJWTValid(req.token, req.mail);

        if (!isTokenValid) {
            throw new Error("token not valid");
        }
    } catch (e) {
        ctx.response.status = 500;
        console.error(e);
    }

    try {
        const user: UserAuth = {
            password: req.password,
            username: req.username,
            mail: req.mail,
        };

        await attemptRegistration(user);
        await deleteUsedInvite(user.mail);

        ctx.response.status = 201;
        return;
    } catch (e) {
        ctx.response.status = 500;
        if (e instanceof Deno.errors.AlreadyExists) {
            ctx.response.body = "User already exists";
        }
    }
}
