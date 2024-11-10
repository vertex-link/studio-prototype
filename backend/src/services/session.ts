import { MongoStore } from "sessions";
import { getDB } from "@services/mongo/database.ts";
export const createSessionStore = async () => {
    const db = await getDB();
    return new MongoStore(db);
};
