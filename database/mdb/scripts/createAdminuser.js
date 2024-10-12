const env = process.env;
const USER = env.MONGO_APP_USER;
const PASSWORD = env.MONGO_APP_PASSWORD;
const DB = env.MONGO_APP_DB;

const ROOT_USER = env.APP_ROOT_USERNAME;
const ROOT_PW_HASH = env.APP_ROOT_PASSWORD_HASH;
const ROOT_MAIL = env.APP_ROOT_MAIL;

const host = `mongodb://${USER}:${PASSWORD}@localhost`;

const createAdminUser = () => {
    const db = new Mongo(host).getDB(DB);

    const admin = db.users.find({ username: ROOT_USER });
    if (admin && admin.size() < 2) {
        db.users.findOneAndUpdate(
            { username: ROOT_USER },
            {
                $set: {
                    username: ROOT_USER,
                    password: ROOT_PW_HASH,
                },
            }
        );
        return;
    }
    if (admin.size() > 1) {
        db.users.deleteMany({ username: ROOT_USER });
    }
    db.users.insertOne({
        username: ROOT_USER,
        password: ROOT_PW_HASH,
        mail: ROOT_MAIL,
    });
};

createAdminUser();

// https://www.mongodb.com/docs/mongodb-shell/reference/methods/