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
import { getDbUri, getReturn, getReturnForError } from "../utils";
const bcrypt = require('bcryptjs');
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (event.httpMethod !== "POST")
        return getReturnForError(405, errors.noGet);
    if (process.env.MONGODB_PASSWORD == null)
        return getReturnForError(500, errors.missingDbPassword);
    const user = JSON.parse((_a = event.body) !== null && _a !== void 0 ? _a : "{}");
    let error = (_b = Database.checkDataExistenceAndReturnError(user)) !== null && _b !== void 0 ? _b : Database.checkDataValidityAndReturnError(user);
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
    user.hashed_password = bcrypt.hashSync(user.password, 10);
    user.password = undefined;
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
export { handler };
//# sourceMappingURL=register-user.js.map