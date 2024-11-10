import { ObjectId } from "@db/mongo";

export interface User {
    _id: ObjectId;
    username?: string;
    mail: string;
    token?: string;
    password?: string;
    password_repeat?: string;
}

export type UserLogin = {
    mail: string;
    password: string;
};

export type UserAuth = {
    username: string;
    password: string;
    mail: string;
};

export interface UserHousehold extends User {
    isAdmin: boolean;
    isWatcher: boolean;
    isInvited?: boolean;
}
