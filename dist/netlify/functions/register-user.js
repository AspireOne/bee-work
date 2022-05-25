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
import mongoose from "mongoose";
const bcrypt = require('bcrypt');
export const maxUsernameLength = 32;
export const maxPasswordLength = 64;
export const maxEmailLength = 64;
const mongodbPassword = process.env.MONGODB_PASSWORD;
const uri = `mongodb+srv://Aspire:${mongodbPassword}@cluster0.2j2lg.mongodb.net/bee-work`; //?retryWrites=true&w=majority
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (event.httpMethod !== "POST")
        return getReturnForError(405, "GET Not Allowed");
    const user = JSON.parse((_a = event.body) !== null && _a !== void 0 ? _a : "{}");
    let error = checkHasRequiredAndReturnError(user);
    error !== null && error !== void 0 ? error : (error = checkDataValidityAndReturnError(user));
    if (error !== null)
        return getReturnForError(400, error);
    const UserModel = mongoose.model('User', Models.User.Schema);
    yield mongoose.connect(uri);
    error = yield checkUniqueAndReturnError(user, UserModel);
    if (error !== null)
        return getReturnForError(400, error);
    // Not saving salt because bcrypt already saves it combined with the hash.
    user.password = bcrypt.hashSync(user.password, 10);
    const User = new UserModel(user);
    const saveResult = yield User.save();
    if (!saveResult)
        return getReturnForError(500, "Could not save user");
    return getReturn(200, saveResult);
});
const getReturnForError = (statusCode, error) => getReturn(statusCode, { error: error });
const getReturn = (statusCode, body) => ({ statusCode: statusCode, body: JSON.stringify(body) });
function checkUniqueAndReturnError(user, userModel) {
    return __awaiter(this, void 0, void 0, function* () {
        let usernameExists = yield userModel.findOne({ "username": user.username });
        let emailExists = yield userModel.findOne({ "email": user.email });
        if (usernameExists)
            return "Username already exists";
        else if (emailExists)
            return "Email already exists";
        return null;
    });
}
function checkDataValidityAndReturnError(user) {
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
function checkHasRequiredAndReturnError(user) {
    if (user.username == null)
        return "Username is missing";
    else if (user.password == null)
        return "Password is missing";
    else if (user.email == null)
        return "Email is missing";
    return null;
}
const isEmailValid = (email) => {
    const matches = email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return matches !== null && matches.length > 0;
};
export { handler };
//# sourceMappingURL=register-user.js.map