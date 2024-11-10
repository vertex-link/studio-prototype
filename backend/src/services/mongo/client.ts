import { MongoClient } from "@db/mongo";

const DEFAULT_URL = `mongodb://${Deno.env.get("MONGO_APP_USER")}:${
    Deno.env.get("MONGO_APP_PASSWORD")
}@${
    Deno.env.get(
        "MONGO_SERVER",
    )
}:27017`;

console.log(DEFAULT_URL);

export const client = new MongoClient();

export const connect = async (url = DEFAULT_URL): Promise<void> => {
    try {
        await client.connect(url);
        return Promise.resolve();
    } catch (e) {
        console.log(":::[ERROR]> Connect to MongoDB « Error: ", e);
        return Promise.reject();
    }
};
