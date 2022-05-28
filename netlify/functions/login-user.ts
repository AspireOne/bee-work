import { Handler } from "@netlify/functions";
import {Models} from "../../scripts/database/models";
import {Database} from "../../scripts/database/database";
import {mongoose} from "@typegoose/typegoose";
import errors = Database.errors;
import {getDbUri, getReturn, getReturnForError} from "../utils";
import getError = Database.getError;
import User = Models.User;
const bcrypt = require('bcryptjs');

const handler: Handler = async (event, context) => {
    if (event.httpMethod !== "POST")
        return getReturnForError(405, errors.noGet);

    if (process.env.MONGODB_PASSWORD == null)
        return getReturnForError(500, errors.missingDbPassword);

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

    let userFromDb;
    try {
        userFromDb = await findUser(user, UserModel) as User.Interface | null;
    } catch (error: any) {
        return getReturnForError(500, errors.couldNotRetrieveDocument, error.toString());
    }

    mongoose.disconnect();

    if (userFromDb == null || (user.username && userFromDb.username != user.username) || (user.email && userFromDb.email != user.email))
        return getReturnForError(400, errors.userNotExist);

    if (user.password != null && bcrypt.compareSync(user.password, userFromDb.hashed_password))
        return getReturn(200, userFromDb);
    if (user.hashed_password != null && user.hashed_password === userFromDb.hashed_password)
        return getReturn(200, userFromDb);

    return getReturnForError(400, errors.wrongPassword);
};

async function findUser(user: Models.User.Interface, userModel: mongoose.Model<User.Interface>) {
    let userFromDb = null;
    if (user.username != null)
        userFromDb = await userModel.findOne({ "username": user.username });

    if (userFromDb != null)
        return userFromDb;

    if (user.email != null)
        userFromDb = await userModel.findOne({ "email": user.email });

    if (userFromDb != null)
        return userFromDb;

    if (user._id != null)
        userFromDb = await userModel.findById(user._id);

    return userFromDb;
}

function checkHasRequiredAndReturnError(user: Models.User.Interface): Database.Error | null {
    if (user.password == null && user.hashed_password == null)
        return errors.passwordIsMissing;
    if (user.username == null && user.email == null && user._id == null)
        return user.username == null ? errors.usernameIsMissing : errors.emailIsMissing;
    return null;
}

export { handler };