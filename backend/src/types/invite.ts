import { ObjectId } from "@db/mongo";

export interface Invite {
    _id?: ObjectId;
    aud: string;
    token: string;
    expireAt: Date;
}
