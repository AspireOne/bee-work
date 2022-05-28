var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Models } from "../../scripts/database/models";
import { Database } from "../../scripts/database/database";
import { mongoose } from "@typegoose/typegoose";
var errors = Database.errors;
import { checkUniqueAndReturnError, getDbUri, getReturn, getReturnForError } from "../utils";
const bcrypt = require('bcryptjs');
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (event.httpMethod !== "POST")
        return getReturnForError(405, errors.noGet);
    if (process.env.MONGODB_PASSWORD == null)
        return getReturnForError(500, errors.missingDbPassword);
    const user = JSON.parse((_a = event.body) !== null && _a !== void 0 ? _a : "{}");
    let error = checkHasRequiredAndReturnError(user);
    if (error !== null)
        return getReturnForError(400, error);
    const UserModel = mongoose.model('User', Models.User.Schema);
    try {
        yield mongoose.connect(getDbUri(process.env.MONGODB_PASSWORD));
    }
    catch (error) {
        return getReturnForError(500, errors.couldNotConnectDb, error.toString());
    }
    let userFromDb = null;
    try {
        userFromDb = yield UserModel.findById(user._id);
    }
    catch (error) {
        return getReturnForError(500, errors.couldNotRetrieveDocument, error.toString());
    }
    if (userFromDb == null)
        return getReturnForError(400, errors.userNotExist);
    let authenticated = false;
    if (user.password != null && bcrypt.compareSync(user.password, userFromDb.hashed_password))
        authenticated = true;
    if (user.hashed_password != null && user.hashed_password === userFromDb.hashed_password)
        authenticated = true;
    if (!authenticated)
        return getReturnForError(400, errors.wrongPassword);
    // TODO: Remove properties that are the same in userFromDb and user.
    Object.keys(user).forEach(function (key, index) {
        const value = user[key];
        if (value == userFromDb[key] || value == null || value === "" || key === "hashed_password")
            delete user[key];
    });
    console.log("only unique: " + JSON.stringify(user));
    if (Object.keys(user).length === 0)
        return getReturnForError(400, errors.noDataToUpdate);
    error = yield checkUniqueAndReturnError(user, UserModel);
    if (error !== null)
        return getReturnForError(400, error);
    let newUserFromDb = null;
    try {
        newUserFromDb = Object.assign(userFromDb, user).save();
    }
    catch (error) {
        return getReturnForError(500, errors.couldNotUpdateUser, error.toString());
    }
    return getReturn(200, newUserFromDb);
});
/*function filterValues(user: Models.User.Interface): Models.User.Interface {
    const ret = {};
    Object.keys(user)
        .filter((key) => {
            const value = (user as any)[key];
            return value != null && value !== "" && key !== "hashed_password";
        })
        .forEach((key) => (ret as any)[key] = (user as any)[key]);
    return ret;
}*/
function checkHasRequiredAndReturnError(user) {
    if (user.password == null && user.hashed_password == null)
        return errors.passwordIsMissing;
    if (user._id == null)
        return errors.userIdMissing;
    return null;
}
export { handler };
//# sourceMappingURL=update-user.js.map