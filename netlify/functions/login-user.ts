import { Handler } from "@netlify/functions";
import {Models} from "../../scripts/database/models";
import {Database} from "../../scripts/database/database";
import {mongoose} from "@typegoose/typegoose";
import errors = Database.errors;
import {getDbUri, getReturn, getReturnForError} from "../utils";
const bcrypt = require('bcryptjs');

const handler: Handler = async (event, context) => {
    if (event.httpMethod !== "POST")
        return getReturnForError(405, errors.noGet);

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

    // This would be in a separate functions, but webstorm hangs in infinite analysis cycle if it is.
    //const userFromDb = await getUserFromDb(user, UserModel);
    let userFromDb;
    try {
        userFromDb = await UserModel.findOne({ "username": user.username });
    } catch (error: any) {
        return getReturnForError(500, errors.couldNotRetrieveDocument, error.toString());
    }

    mongoose.disconnect();

    if (userFromDb == null || userFromDb.username != user.username || userFromDb.email != user.email)
        return getReturnForError(400, errors.userNotExist);

    if (bcrypt.compareSync(user.password, userFromDb.password))
        return getReturn(200, userFromDb);

    return getReturnForError(400, errors.wrongPassword);
};

function checkHasRequiredAndReturnError(user: Models.User.Interface): Database.Error | null {
    if (user.password == null)
        return errors.passwordIsMissing;
    if (user.username == null && user.email == null)
        return errors.usernameOrEmailMissing;
    return null;
}

export { handler };