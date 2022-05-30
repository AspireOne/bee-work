import {Database} from "../scripts/database/database";
import {mongoose} from "@typegoose/typegoose";
import {Models} from "../scripts/database/models";
import User = Models.User;
import errors = Database.errors;

export function getReturnForError(statusCode: number, error: Database.Error, errorMessage: string = "") {
    return {
        statusCode: statusCode,
        body: JSON.stringify({
            code: error.code,
            errorMessage: errorMessage
        })
    };
}
export function getReturn(statusCode: number, body: object) {
    return {
        statusCode: statusCode,
        body: JSON.stringify(body),
    };
};

export async function findUser(user: Models.User.Interface, userModel: mongoose.Model<User.Interface>) {
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

export async function checkUniqueAndReturnError(user: Models.User.Interface, userModel: mongoose.Model<Models.User.Interface>): Promise<Database.Error | null> {
    const usernameExists = await userModel.findOne({ "username": user.username });
    if (usernameExists)
        return errors.usernameAlreadyExists;

    const emailExists = await userModel.findOne({ "email": user.email });
    if (emailExists)
        return errors.emailAlreadyExists;

    return null;
}

export const getDbUri = (password: string, db: string = "bee-work") => `mongodb+srv://Aspire:${password}@cluster0.2j2lg.mongodb.net/${db}`; //?retryWrites=true&w=majority