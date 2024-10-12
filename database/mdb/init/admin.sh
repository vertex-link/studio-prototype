#!/bin/bash
set -e

mongosh <<EOF
use admin 


db.createUser(
  {
    user: "${MONGO_APP_USER}",
    pwd: "${MONGO_APP_PASSWORD}",
    roles: [ { role: "readWrite", db: "${MONGO_APP_DB}" } ]
  }
)

use $MONGO_APP_DB

db.users.insertMany([{
  username: "${APP_ROOT_USERNAME}",
  mail: "${APP_ROOT_MAIL}",
  password: "${APP_ROOT_PASSWORD_HASH}"
}])

EOF