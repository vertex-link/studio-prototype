import { Context } from "@oak/oak";
import { getValidatedRequest } from "@backend/services/auth.ts";
import { attemptLogin } from "@services/user.ts";
import { AppState } from "@backend/types/application.ts";
import { AuthState } from "@interface_types/auth.ts";
import { User } from "../../types/user.ts";

const logout = async (ctx: Context<AppState>) => {
    await ctx.state.session.deleteSession();
    ctx.response.body = { authorized: false };
};

const login = async (ctx: Context<AppState>) => {
    const sessionMail = await ctx.state.session.get("mail");
    const userId = await ctx.state.session.get("id");

    const req = JSON.parse(
        await getValidatedRequest(ctx) as string,
    ) as unknown as User;

    if (sessionMail && userId) {
        ctx.response.body = {
            loggedInFromSession: true,
        };

        return;
    }

    try {
        const status = await attemptLogin(req);

        console.log("status", status);

        if (status?.authorized) {
            ctx.state.session.set("mail", status.mail);
            ctx.state.session.set("id", status.id);

            ctx.state.session.set("failed-login-attempts", null);
            // Set flash data in the session. This will be removed the first time it's accessed with get
            ctx.state.session.flash("message", "Login successful");
        } else {
            const failedLoginAttempts =
                ((await ctx.state.session.get("failed-login-attempts")) ||
                    0) as number;
            ctx.state.session.set(
                "failed-login-attempts",
                failedLoginAttempts + 1,
            );
            ctx.state.session.flash("error", "Incorrect username or password");
        }

        ctx.response.body = { status };
    } catch (e) {
        ctx.response.status = 401;
        if (e instanceof Deno.errors.NotFound) {
            ctx.response.body = "User does not exists";
        } else if (e instanceof Deno.errors.PermissionDenied) {
            ctx.response.body = "Wrong password";
        }
    }
};

const getAuthState = async (ctx: Context<AppState>) => {
    const session = ctx.state.session;
    const sessionMail = session.get("mail");
    const userId = session.get("id");
    console.log("userId", userId);

    let authState: AuthState = {
        authorized: false,
    };

    if (userId) {
        authState = {
            authorized: true,
            mail: sessionMail as string,
            id: userId as string,
        };
    }

    ctx.response.body = authState;
};

export { getAuthState, login, logout };
