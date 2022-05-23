import { Handler } from "@netlify/functions";
import {Collection, Db, MongoClient, WithId} from 'mongodb';
import {Models} from "../../scripts/database/models";
import mongoose from "mongoose";

const mongodbPassword = process.env.MONGODB_PASSWORD;
const uri = `mongodb+srv://Aspire:${mongodbPassword}@cluster0.2j2lg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

const handler: Handler = async (event, context) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "GET Not allowed" };
    }

    const user: Models.User.IUser = JSON.parse(event.body ?? "{}");
    let error = null;

    error = checkRequiredAndReturnError(user);
    if (error !== null)
        return { statusCode: 400, body: error };

    await client.connect();
    const database = client.db("bee-work");
    const users = database.collection("users");

    const usernameExists = await users.findOne({ username: user.username });
    const emailExists = await users.findOne({ email: user });

    if (usernameExists !== null)
        error = "Username already exists";
    if (emailExists !== null)
        error = "Email already exists";

    if (error !== null)
        return { statusCode: 400, body: error };

    /*const model = new Models.User.User(user);
    mongoose.connect();*/

    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Hello World" }),
    };

    await client.close();
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Hello World", movie: null })
    };
};

function checkRequiredAndReturnError(user: Models.User.IUser): string | null {
    if (user.username == null)
        return "Username is missing";
    else if (user.password == null)
        return "Password is missing";
    else if (user.email == null)
        return "Email is missing";
    return null;
}

export { handler };