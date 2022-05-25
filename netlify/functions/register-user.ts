import { Handler } from "@netlify/functions";
import {Models} from "../../scripts/database/models";
import mongoose from "mongoose";

const mongodbPassword = process.env.MONGODB_PASSWORD;
const uri = `mongodb+srv://Aspire:${mongodbPassword}@cluster0.2j2lg.mongodb.net/bee-work`; //?retryWrites=true&w=majority

const handler: Handler = async (event, context) => {
    if (event.httpMethod !== "POST")
        return getReturnForError(405, "GET Not Allowed");

    const user: Models.User.Interface = JSON.parse(event.body ?? "{}");
    let error = checkRequiredAndReturnError(user);
    if (error !== null)
        return getReturnForError(400, error);

    const UserModel = mongoose.model<Models.User.Interface>('User', Models.User.Schema);
    await mongoose.connect(uri);

    let usernameExists = await UserModel.findOne({ "username": user.username});
    let emailExists = await UserModel.findOne({ "email": user.email});

    if (usernameExists)
        error = "Username already exists";
    else if (emailExists)
        error = "Email already exists";

    if (error !== null)
        return getReturnForError(400, error);

    const User = new UserModel(user);
    const saveResult = await User.save();
    if (!saveResult)
        return getReturnForError(500, "Could not save user");

    return getReturn(200, saveResult);
};

function getReturnForError(statusCode: number, error: string) {
    return {statusCode: statusCode, body: JSON.stringify({error: error})};
}
function getReturn(statusCode: number, body: object) {
    return {statusCode: statusCode, body: JSON.stringify(body)};
}

function checkRequiredAndReturnError(user: Models.User.Interface): string | null {
    if (user.username == null)
        return "Username is missing";
    else if (user.password == null)
        return "Password is missing";
    else if (user.email == null)
        return "Email is missing";
    return null;
}

export { handler };