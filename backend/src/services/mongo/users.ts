// import { User, UserAuth } from '@schema/user.ts';
// import { getDB } from '@backend/services/mongo/index.ts';
// import { Filter } from '@backend/deps/mongo.ts';
// import { Invite } from '@schema/invite.ts';
// import { AggregatePipeline } from '@deps/mongo.ts';

import type { UserReturn } from "@backend/types/DatabaseUser.ts";
import { COLLECTION } from "@backend/types/DatabaseCollection.ts";

import type { User, UserAuth } from "@backend/types/user.ts";
import type { AggregatePipeline, Filter } from "@db/mongo";
import { getDB } from "@services/mongo/database.ts";
import type { Invite } from "@backend/types/invite.ts";

const DEFAULT_RETURN: UserReturn = {
    _id: 1,
    username: 1,
    mail: 1,
};

export const getUserByFilter = async (
    filter: keyof User,
    value: string | number,
) => {
    const userArray = await getUsers({ [filter]: { $eq: value } }).catch(
        (err) => {
            console.error("An error occured:", err);
            return [];
        },
    );

    return userArray[0];
};

export const getUsers = async (
    options?: Filter<User>,
    filter = DEFAULT_RETURN,
) => {
    try {
        const db = await getDB();
        const selectedCollection = db.collection<User>(COLLECTION.USERS);


        const allUsers: User[] = await selectedCollection
            .find(options, {
                projection: filter,
            })
            .toArray();
        return Promise.resolve(allUsers);
    } catch (e) {
        console.log(":::[ERROR]> Could not get User data « Error: ", e);
        return Promise.reject(e);
    }
};
export const getOneUser = async (
    options?: Filter<User>,
    filter = DEFAULT_RETURN,
) => {
    try {
        const db = await getDB();
        const selectedCollection = db.collection<User>(COLLECTION.USERS);
        const user: User | undefined = await selectedCollection.findOne(
            options,
            {
                projection: filter,
            },
        );
        if (!user) throw new Error("No user found");
        return Promise.resolve(user);
    } catch (e) {
        console.log(":::[ERROR]> Could not get User data « Error: ", e);
        return Promise.reject(e);
    }
};

export const aggregateUsers = async (
    aggregation: AggregatePipeline<User>[],
) => {
    try {
        const db = await getDB();
        const selectedCollection = db.collection<User>(COLLECTION.USERS);
        const user: User[] = await selectedCollection.aggregate(aggregation)
            .toArray();
        return Promise.resolve(user);
    } catch (e) {
        return Promise.reject(e);
    }
};

export const addUser = async (data: UserAuth) => {
    const db = await getDB();
    const selectedCollection = db.collection<User>(COLLECTION.USERS);
    selectedCollection.insertOne(data);
    return Promise.resolve();
};

export const inviteUser = async (invite: Invite) => {
    const db = await getDB();
    const selectedCollection = db.collection<Invite>("invites");
    const existingInvite = await selectedCollection.findOne({
        aud: invite.aud,
    });
    const user: User = await getUserByFilter("mail", invite.aud);

    if (existingInvite || user) {
        return Promise.reject("user or invite alredy exist");
    }

    await selectedCollection.insertOne(invite);
    return Promise.resolve();
};

export const deleteUsedInvite = async (mail: string) => {
    const db = await getDB();
    const selectedCollection = db.collection<Invite>("invites");

    await selectedCollection.deleteOne({ aud: mail });
    return Promise.resolve();
};
