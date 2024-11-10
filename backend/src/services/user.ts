import { ObjectId } from "@db/mongo";
import { User } from "@backend/types/user.ts";
import { getHash } from "@services/auth.ts";
import { getOneUser, getUsers } from "@services/mongo/users.ts";
import type { AuthState } from "@interface_types/auth.ts";
import type { Context } from "@oak/oak";
import type { AppState } from "@backend/types/application.ts";

export const isUsernameAvail = async (name: string) => {
    const users = await getUsers({ username: { $eq: name } }, { username: 1 });

    if (users.length > 0) {
        return false;
    }

    return true;
};

export const attemptLogin = async (userData: User): Promise<AuthState> => {
    const user: User[] = await getUsers({ mail: { $eq: userData.mail } }, {
        mail: 1,
        password: 1,
    });

    if (!(user[0] as unknown as User) || !user[0].password) {
        return {
            authorized: false,
        };
    }
    const passHash = await getHash(userData.password as string);

    if (passHash === user[0].password) {
        return {
            authorized: true,
            mail: userData.mail,
            id: user[0]?._id?.toString(),
        };
    }

    return {
        authorized: false,
    };
};

export const isUserAuthenticated = async (
    ctx: Context<AppState>,
): Promise<boolean> => {
    const sessionMail = await ctx.state.session.get("mail");
    const sessionId = await ctx.state.session.get("id");
    return !!(sessionMail && sessionId);
};

export const getUserFromSession = async (
    ctx: Context<AppState>,
): Promise<User | undefined> => {
    try {
        const userId = (await ctx.state.session.get("id")) as string;
        const user = await getOneUser({ _id: new ObjectId(userId) });
        return Promise.resolve(user);
    } catch (e) {
        console.log("ERROR getUserFromSession: ", e);
        return Promise.reject();
    }
};
