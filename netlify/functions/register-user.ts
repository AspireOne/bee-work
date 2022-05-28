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

    const user: Models.User.Interface = JSON.parse(event.body ?? "{}");
    let error = checkHasRequiredAndReturnError(user) ?? checkDataValidityAndReturnError(user);

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
    user.password = bcrypt.hashSync(user.password, 10);

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

function checkDataValidityAndReturnError(user: Models.User.Interface): Database.Error | null {
    if (user.email.length > restrictions.maxEmailLength)
        return errors.emailTooLong;
    if (user.username.length > restrictions.maxUsernameLength)
        return errors.usernameTooLong;
    if (user.password.length > restrictions.maxPasswordLength)
        return errors.passwordTooLong;
    if (!isEmailValid(user.email))
        return errors.emailNotValid;
    return null;
}

function checkHasRequiredAndReturnError(user: Models.User.Interface): Database.Error | null {
    if (user.username == null)
        return errors.usernameIsMissing;
    else if (user.password == null)
        return errors.passwordIsMissing;
    else if (user.email == null)
        return errors.emailIsMissing;
    return null;
}

const isEmailValid = (email: string): boolean => {
    const matches = email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return matches !== null && matches.length > 0;
};

export { handler };