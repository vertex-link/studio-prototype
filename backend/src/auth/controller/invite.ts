/*
    generate invite mail with token (invites collection)
    save token to db

    validate token and create new user

 */

import { generateJWT, getValidatedRequest } from "@services/auth.ts";
import { getExplorationDateInH } from "@services/explorationDate.ts";
import { inviteUser } from "@services/mongo/index.ts";
import { isUserAuthenticated } from "@services/user.ts";
import { sendInviteMail } from "@backend/services/mail.ts";

import type { Context } from "@oak/oak";
import type { Invite } from "@backend/types/invite.ts";
import type { AppState } from "@backend/types/application.ts";

const invite = async (ctx: Context<AppState>) => {
    const userAuthenticated = await isUserAuthenticated(ctx);
    
    if (!userAuthenticated) {
        ctx.response.status = 400;
        return;
    }

    const req = await getValidatedRequest(ctx);

    console.log('invite req', req);


    const token = await generateJWT({
        aud: req,
        expInH: 24,
        iss: req.iss,
        sub: "invite",
    });

    const invite: Invite = {
        aud: req.mail,
        token: token,
        expireAt: getExplorationDateInH(1),
    };
    

    try {
        await inviteUser(invite);
    } catch (e) {
        console.error("invite cant be sended:", e);
        ctx.response.body = "invite failed";
        ctx.response.status = 400;

        return;
    }

    try {
        await sendInviteMail(invite);
    } catch {
        console.log("mail error");
    }

    ctx.response.status = 200;
};

export { invite };
