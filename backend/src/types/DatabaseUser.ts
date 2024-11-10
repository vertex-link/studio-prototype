import { ObjectId } from "@db/mongo";

export interface User {
    _id: ObjectId;
    username: string;
    mail: string;
    password: string;
}

export type UserReturn = {
    [key in keyof User]?: 1 | 0;
};
