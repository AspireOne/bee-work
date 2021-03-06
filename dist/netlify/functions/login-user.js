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
import { findUser, getDbUri, getReturn, getReturnForError } from "../utils";
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
    let userFromDb;
    try {
        userFromDb = yield findUser(user, UserModel);
    }
    catch (error) {
        return getReturnForError(500, errors.couldNotRetrieveDocument, error.toString());
    }
    mongoose.disconnect();
    if (userFromDb == null || (user.username && userFromDb.username != user.username) || (user.email && userFromDb.email != user.email))
        return getReturnForError(400, errors.userNotExist);
    if (user.password != null && bcrypt.compareSync(user.password, userFromDb.hashed_password))
        return getReturn(200, userFromDb);
    if (user.hashed_password != null && user.hashed_password === userFromDb.hashed_password)
        return getReturn(200, userFromDb);
    return getReturnForError(400, errors.wrongPassword);
});
function checkHasRequiredAndReturnError(user) {
    if (user.password == null && user.hashed_password == null)
        return errors.passwordIsMissing;
    if (user.username == null && user.email == null && user._id == null)
        return user.username == null ? errors.usernameIsMissing : errors.emailIsMissing;
    return null;
}
export { handler };
//# sourceMappingURL=login-user.js.map