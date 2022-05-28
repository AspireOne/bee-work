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
var restrictions = Database.restrictions;
import { getDbUri, getReturn, getReturnForError } from "../utils";
const bcrypt = require('bcryptjs');
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (event.httpMethod !== "POST")
        return getReturnForError(405, errors.noGet);
    const user = JSON.parse((_a = event.body) !== null && _a !== void 0 ? _a : "{}");
    let error = (_b = checkHasRequiredAndReturnError(user)) !== null && _b !== void 0 ? _b : checkDataValidityAndReturnError(user);
    if (error !== null)
        return getReturnForError(400, error);
    const UserModel = mongoose.model('User', Models.User.Schema);
    try {
        yield mongoose.connect(getDbUri(process.env.MONGODB_PASSWORD));
    }
    catch (error) {
        return getReturnForError(500, errors.couldNotConnectDb, error.toString());
    }
    try {
        error = yield checkUniqueAndReturnError(user, UserModel);
    }
    catch (error) {
        return getReturnForError(500, errors.couldNotRetrieveDocument, error.toString());
    }
    if (error !== null)
        return getReturnForError(400, error);
    // Not saving salt because bcrypt already saves it combined with the hash.
    user.password = bcrypt.hashSync(user.password, 10);
    const User = new UserModel(user);
    const saveResult = yield User.save();
    if (!saveResult)
        return getReturnForError(500, errors.couldNotSaveUser);
    return getReturn(200, saveResult);
});
function checkUniqueAndReturnError(user, userModel) {
    return __awaiter(this, void 0, void 0, function* () {
        const usernameExists = yield userModel.findOne({ "username": user.username });
        if (usernameExists)
            return errors.usernameAlreadyExists;
        const emailExists = yield userModel.findOne({ "email": user.email });
        if (emailExists)
            return errors.emailAlreadyExists;
        return null;
    });
}
function checkDataValidityAndReturnError(user) {
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
function checkHasRequiredAndReturnError(user) {
    if (user.username == null)
        return errors.usernameIsMissing;
    else if (user.password == null)
        return errors.passwordIsMissing;
    else if (user.email == null)
        return errors.emailIsMissing;
    return null;
}
const isEmailValid = (email) => {
    const matches = email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return matches !== null && matches.length > 0;
};
export { handler };
//# sourceMappingURL=register-user.js.map