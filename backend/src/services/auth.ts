import { decodeBase64 } from "@std/encoding";
import type { Context } from "@oak/oak";

import { create, getNumericDate, Header, Payload, verify } from "@wok/djwt";
import { getExplorationDateInH } from "@services/explorationDate.ts";
import { isUserAuthenticated } from "@services/user.ts";
import type { AppState } from "@backend/types/application.ts";

export const importCryptoKey = async () => {
    const key: string = Deno.env.get("JWT_SECRET") as string;
    console.log("key", key);

    return await crypto.subtle.importKey(
        "raw",
        decodeBase64(key.replace(/-/g, "+").replace(/_/g, "/")),
        { name: "HMAC", hash: "SHA-512" },
        true,
        [
            "sign",
            "verify",
        ],
    );
};

export async function getHash(src: string) {
    // TODO: replace with simple hashing method (see token stuff)
    const strBytes = new TextEncoder().encode(src);
    const rawHash = await crypto.subtle.digest("SHA-256", strBytes);
    const bufArr = new Uint8Array(rawHash);
    const hexString = Array.from(bufArr)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    return hexString;
}

export const getValidatedRequest = async (ctx: Context) => {
    const result = await ctx.request.body.text();
        let req;

    if (ctx.request.headers.get("Content-Type") !== "application/json") {
        ctx.response.status = 415;
        req = null;
        return;
    } else {
        req = result;
    }

    return req;
};

type GenerateJWT = {
    aud: string;
    sub: string;
    iss: string;
    expInH: number;
};

export const generateJWT = async (
    { aud, sub, iss, expInH = 1 }: GenerateJWT,
) => {
    const key = await importCryptoKey();

    console.log(key);

    const payload: Payload = {
        iss,
        sub,
        aud,
        exp: getNumericDate(getExplorationDateInH(expInH)),
    };
    const header: Header = {
        alg: "HS512",
        typ: "JWT",
    };

    const token = await create(header, payload, key);

    return token;
};

export const isJWTValid = async (token: string, mail: string) => {
    const key = await importCryptoKey();

    const payload = await verify(token, key);

    if (payload && payload.aud === mail) {
        return true;
    } else {
        return false;
    }
};

export const handleUserAuthentication = async (ctx: Context<AppState>) => {
    const userAuthenticated = await isUserAuthenticated(ctx);
    if (!userAuthenticated) {
        ctx.response.status = 400;
        return Promise.reject();
    }
    return Promise.resolve();
};
