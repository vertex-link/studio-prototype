import { Database } from "@db/mongo";
import { client, connect } from "@services/mongo/client.ts";
export enum DATABASE_NAME {
    STUDIO = "studio-prototype",
}

export const getDB = async (
    name = DATABASE_NAME.STUDIO,
): Promise<Database> => {
    try {
        await connect();
        return Promise.resolve(client.database(name));
    } catch (e) {
        console.log(":::[ERROR]> Could not connect DB « Error: ", e);
        return Promise.reject(e);
    }
};
