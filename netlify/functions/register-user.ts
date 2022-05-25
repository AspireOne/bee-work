import { Handler } from "@netlify/functions";
import {Models} from "../../scripts/database/models";
import mongoose from "mongoose";
const bcrypt = require('bcrypt');

export const maxUsernameLength = 32;
export const maxPasswordLength = 64;
export const maxEmailLength = 64;
const mongodbPassword = process.env.MONGODB_PASSWORD;
const uri = `mongodb+srv://Aspire:${mongodbPassword}@cluster0.2j2lg.mongodb.net/bee-work`; //?retryWrites=true&w=majority

const handler: Handler = async (event, context) => {
    if (event.httpMethod !== "POST")
        return getReturnForError(405, "GET Not Allowed");

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
        return getReturnForError(500, "Could not save user");

    return getReturn(200, saveResult);
};

const getReturnForError = (statusCode: number, error: string) => getReturn(statusCode, {error: error});
const getReturn = (statusCode: number, body: object) => ({statusCode: statusCode, body: JSON.stringify(body)});

async function checkUniqueAndReturnError(user: Models.User.Interface, userModel: mongoose.Model<Models.User.Interface>): Promise<string | null> {
    let usernameExists = await userModel.findOne({ "username": user.username});
    let emailExists = await userModel.findOne({ "email": user.email});

    if (usernameExists)
        return "Username already exists";
    else if (emailExists)
        return "Email already exists";

    return null;
}

function checkDataValidityAndReturnError(user: Models.User.Interface): string | null {
    if (user.email.length > maxEmailLength)
        return "Email is too long";
    if (user.username.length > maxUsernameLength)
        return "Username is too long";
    if (user.password.length > maxPasswordLength)
        return "Password is too long";
    if (!isEmailValid(user.email))
        return "Email is not valid";
    return null;
}

function checkHasRequiredAndReturnError(user: Models.User.Interface): string | null {
    if (user.username == null)
        return "Username is missing";
    else if (user.password == null)
        return "Password is missing";
    else if (user.email == null)
        return "Email is missing";
    return null;
}

const isEmailValid = (email: string): boolean => {
    const matches = email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return matches !== null && matches.length > 0;
};

export { handler };