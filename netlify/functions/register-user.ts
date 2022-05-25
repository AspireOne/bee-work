import { Handler } from "@netlify/functions";
import {Models} from "../../scripts/database/models";
import {Database} from "../../scripts/database";
import {mongoose} from "@typegoose/typegoose";
import {errors, restrictions} from "./register-exports";
const bcrypt = require('bcrypt');

const mongodbPassword = process.env.MONGODB_PASSWORD;
const uri = `mongodb+srv://Aspire:${mongodbPassword}@cluster0.2j2lg.mongodb.net/bee-work`; //?retryWrites=true&w=majority

const handler: Handler = async (event, context) => {
    if (event.httpMethod !== "POST")
        return getReturnForError(405, Database.globalErrors.noGet);

    const user: Models.User.Interface = JSON.parse(event.body ?? "{}");

    let error = checkHasRequiredAndReturnError(user);
    error ??= checkDataValidityAndReturnError(user);

    if (error !== null)
        return getReturnForError(400, error);

    const UserModel = mongoose.model<Models.User.Interface>('User', Models.User.Schema);
    await mongoose.connect(uri);

    error = await checkUniqueAndReturnError(user, UserModel);
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

const getReturnForError = (statusCode: number, error: Database.Error | Database.GlobalError) => {
    let obj = {
        code: error.code,
        type: (<Database.GlobalError>error).type === undefined
            ? Database.errorType.specific
            : Database.errorType.global
    };

    return getReturn(statusCode, obj);
}

const getReturn = (statusCode: number, body: object) => ({statusCode: statusCode, body: JSON.stringify(body)});

async function checkUniqueAndReturnError(user: Models.User.Interface, userModel: mongoose.Model<Models.User.Interface>): Promise<Database.Error | null> {
    let usernameExists = await userModel.findOne({ "username": user.username});
    let emailExists = await userModel.findOne({ "email": user.email});

    if (usernameExists)
        return errors.usernameAlreadyExists;
    else if (emailExists)
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