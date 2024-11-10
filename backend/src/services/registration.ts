import type { User, UserAuth } from "@backend/types/user.ts";
import { getHash } from "@services/auth.ts";
import { addUser, getUserByFilter } from "@services/mongo/index.ts";

export const attemptRegistration = async (userData: UserAuth) => {
    console.log(userData);

    if (!userData.mail) return;

    const user: User = await getUserByFilter("mail", userData.mail);
    console.log(user);

    if (user) {
        throw new Deno.errors.AlreadyExists();
    }

    if (!userData.password) {
        throw new Deno.errors.InvalidData();
    }

    userData.password = await getHash(userData.password);
    await addUser(userData);
};
