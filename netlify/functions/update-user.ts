import { Handler } from "@netlify/functions";
import {Models} from "../../scripts/database/models";
import {Database} from "../../scripts/database/database";
import {mongoose} from "@typegoose/typegoose";
import errors = Database.errors;
import {checkUniqueAndReturnError, findUser, getDbUri, getReturn, getReturnForError} from "../utils";
import getError = Database.getError;
import User = Models.User;
const bcrypt = require('bcryptjs');

const handler: Handler = async (event, context) => {
    if (event.httpMethod !== "POST") return getReturnForError(405, errors.noGet);
    if (process.env.MONGODB_PASSWORD == null) return getReturnForError(500, errors.missingDbPassword);

    const user: Models.User.Interface = JSON.parse(event.body ?? "{}");
    let error = checkHasRequiredAndReturnError(user);
    if (error !== null)
        return getReturnForError(400, error);

    const UserModel = mongoose.model<Models.User.Interface>('User', Models.User.Schema);

    try {
        await mongoose.connect(getDbUri(process.env.MONGODB_PASSWORD as string));
    } catch (error: any) {
        return getReturnForError(500, errors.couldNotConnectDb, error.toString());
    }

    let userFromDb: (mongoose.Document<unknown, any, User.Interface> & User.Interface & { _id: string | undefined; }) | null = null;
    try {
        userFromDb = await UserModel.findById(user._id);
    } catch (error: any) {
        return getReturnForError(500, errors.couldNotRetrieveDocument, error.toString());
    }

    if (userFromDb == null)
        return getReturnForError(400, errors.userNotExist);

    let authenticated = false;

    if (user.password != null && bcrypt.compareSync(user.password, userFromDb.hashed_password))
        authenticated = true;
    if (user.hashed_password != null && user.hashed_password === userFromDb.hashed_password)
        authenticated = true;

    if (!authenticated)
        return getReturnForError(400, errors.wrongPassword);

    // TODO: Remove properties that are the same in userFromDb and user.
    Object.keys(user).forEach(function(key, index) {
        const value = (user as any)[key];

        if (value == (userFromDb as any)[key] || value == null || value === "" ||  key === "hashed_password")
            delete (user as any)[key];
    });

    console.log("only unique: " + JSON.stringify(user));

    if (Object.keys(user).length === 0)
        return getReturnForError(400, errors.noDataToUpdate);

    error = await checkUniqueAndReturnError(user, UserModel);
    if (error !== null)
        return getReturnForError(400, error);

    let newUserFromDb = null;
    try {
        newUserFromDb = Object.assign(userFromDb, user).save();
    } catch (error: any) {
        return getReturnForError(500, errors.couldNotUpdateUser, error.toString());
    }

    return getReturn(200, newUserFromDb);
};

/*function filterValues(user: Models.User.Interface): Models.User.Interface {
    const ret = {};
    Object.keys(user)
        .filter((key) => {
            const value = (user as any)[key];
            return value != null && value !== "" && key !== "hashed_password";
        })
        .forEach((key) => (ret as any)[key] = (user as any)[key]);
    return ret;
}*/

function checkHasRequiredAndReturnError(user: Models.User.Interface): Database.Error | null {
    if (user.password == null && user.hashed_password == null)
        return errors.passwordIsMissing;
    if (user._id == null)
        return errors.userIdMissing;
    return null;
}

export { handler };