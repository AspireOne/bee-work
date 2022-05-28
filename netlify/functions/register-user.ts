import { Handler } from "@netlify/functions";
import {Models} from "../../scripts/database/models";
import {Database} from "../../scripts/database/database";
import {mongoose} from "@typegoose/typegoose";
import errors = Database.errors;
import restrictions = Database.restrictions;
import {getDbUri, getReturn, getReturnForError} from "../utils";
const bcrypt = require('bcryptjs');


const handler: Handler = async (event, context) => {
    if (event.httpMethod !== "POST")
        return getReturnForError(405, errors.noGet);

    if (process.env.MONGODB_PASSWORD == null)
        return getReturnForError(500, errors.missingDbPassword);

    const user: Models.User.Interface = JSON.parse(event.body ?? "{}");
    let error = Database.checkDataExistenceAndReturnError(user) ?? Database.checkDataValidityAndReturnError(user);

    if (error !== null)
        return getReturnForError(400, error);

    const UserModel = mongoose.model<Models.User.Interface>('User', Models.User.Schema);

    try {
        await mongoose.connect(getDbUri(process.env.MONGODB_PASSWORD as string));
    } catch (error: any) {
        return getReturnForError(500, errors.couldNotConnectDb, error.toString());
    }

    try {
        error = await checkUniqueAndReturnError(user, UserModel);
    } catch (error: any) {
        return getReturnForError(500, errors.couldNotRetrieveDocument, error.toString());
    }

    if (error !== null)
        return getReturnForError(400, error);

    // Not saving salt because bcrypt already saves it combined with the hash.
    user.hashed_password = bcrypt.hashSync(user.password, 10);
    user.password = undefined;

    const User = new UserModel(user);
    const saveResult = await User.save();
    if (!saveResult)
        return getReturnForError(500, errors.couldNotSaveUser);

    return getReturn(200, saveResult);
};

async function checkUniqueAndReturnError(user: Models.User.Interface, userModel: mongoose.Model<Models.User.Interface>): Promise<Database.Error | null> {
    const usernameExists = await userModel.findOne({ "username": user.username });
    if (usernameExists)
        return errors.usernameAlreadyExists;

    const emailExists = await userModel.findOne({ "email": user.email });
    if (emailExists)
        return errors.emailAlreadyExists;

    return null;
}

export { handler };