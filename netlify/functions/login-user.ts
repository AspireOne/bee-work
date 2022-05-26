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
        return getReturnForError(405, errors.noGet);

    const user: Models.User.Interface = JSON.parse(event.body ?? "{}");
    let error = checkHasRequiredAndReturnError(user);

    if (error !== null)
        return getReturnForError(400, error);

    const UserModel = mongoose.model<Models.User.Interface>('User', Models.User.Schema);
    await mongoose.connect(uri);

    const userFromDb = await getUserFromDb(user, UserModel);
    if (userFromDb == null || userFromDb.username != user.username || userFromDb.email != user.email)
        return getReturnForError(400, errors.userNotExist);

    // Not saving salt because bcrypt already saves it combined with the hash.
    // TODO: This doesnt work.
    if (bcrypt.compareSync(user.password, userFromDb.password))
        getReturn(200, userFromDb);

    return getReturnForError(400, errors.wrongPassword);
};

async function getUserFromDb(user: Models.User.Interface, userModel: mongoose.Model<Models.User.Interface>) {
    const findByUsername = await userModel.findOne({ "username": user.username});
    if (findByUsername)
        return findByUsername;

    const findByEmail = await userModel.findOne({ "email": user.email});
    if (findByEmail)
        return findByEmail;

    return null;
}

// TODO: Make this shared.
const getReturnForError = (statusCode: number, error: Database.Error) => ({statusCode: statusCode, body: JSON.stringify({code: error.code})})
const getReturn = (statusCode: number, body: object) => ({statusCode: statusCode, body: JSON.stringify(body)});

function checkHasRequiredAndReturnError(user: Models.User.Interface): Database.Error | null {
    if (user.password == null)
        return errors.passwordIsMissing;
    if (user.username == null && user.email == null)
        return errors.usernameOrEmailMissing;
    return null;
}

export { handler };