import { SMTPClient } from "SMTPClient";
// import { Invite } from '@schema/invite.ts';
// import { renderMarkup, RENDER_TYPE } from './markup.ts';

import type { Invite } from "@backend/types/invite.ts";

// const DENO_ENV = Deno.env.get('ENVIRONMENT');

const FRONTEND_URL = Deno.env.get("CORS_ORIGIN");

const MAIL_REGISTER_PASSWORD = Deno.env.get("MAIL_REGISTER_PASSWORD");
const MAIL_REGISTER_USER = Deno.env.get("MAIL_REGISTER_USER");
const MAIL_SERVER = Deno.env.get("MAIL_SERVER") || "";
const MAIL_PORT = 25;
const MAIL_TLS = false;

const sendInviteMail = (invite: Invite) => {
    // const content = await renderMarkup({
    //     layout: "invite",
    //     type: "mail" as unknown as RENDER_TYPE,
    //     parameters: {
    //         link: `${FRONTEND_URL}/registration?token=${
    //             encodeURIComponent(invite.token)
    //         }&mail=${
    //             encodeURIComponent(
    //                 invite.aud,
    //             )
    //         }`,
    //     },
    // });

    const content = `${FRONTEND_URL}/registration?token=${
        encodeURIComponent(invite.token)
    }&mail=${
        encodeURIComponent(
            invite.aud,
        )
    }`;

    try {
        sendMail({
            content,
            aud: invite.aud,
            user: MAIL_REGISTER_USER,
            password: MAIL_REGISTER_PASSWORD,
            subject: "Fintrack Invitation",
        });
    } catch {
        Promise.reject("email cant be send");
    }
};

type SendMail = {
    aud: string;
    content: string;
    user: string | undefined;
    password: string | undefined;
    subject: string;
};

const sendMail = async (
    { aud, content, user, password, subject }: SendMail,
) => {
    // TODO: ERROR HANDLING + SEND MAIL
    if (!user || !password) {
        return Promise.reject({
            code: 600,
            message: "Missing user or password",
        });
    }
    if (!aud) {
        return Promise.reject({
            code: 601,
            message: 'Missing receiver provided: "' + aud + '"',
        });
    }

    try {
        if (!MAIL_SERVER) return Promise.reject();

        const client: SMTPClient = new SMTPClient({
            connection: {
                hostname: MAIL_SERVER,
                port: MAIL_PORT,
                tls: MAIL_TLS,
                auth: {
                    username: user,
                    password: password,
                },
            },
        });

        await client.send({
            from: user,
            to: aud,
            subject: subject,
            content: content,
            html: content,
        });

        await client.close();
        return Promise.resolve();
    } catch (err) {
        console.log("ERROR WHILE SENDING MAIL WITH ERROR: ", err);
        return Promise.reject();
    }
};

export { sendInviteMail };
