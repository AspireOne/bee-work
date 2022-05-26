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
import { mongoose } from "@typegoose/typegoose";
import { errors } from "./register-exports";
const bcrypt = require('bcrypt');
const mongodbPassword = process.env.MONGODB_PASSWORD;
const uri = `mongodb+srv://Aspire:${mongodbPassword}@cluster0.2j2lg.mongodb.net/bee-work`; //?retryWrites=true&w=majority
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (event.httpMethod !== "POST")
        return getReturnForError(405, errors.noGet);
    const user = JSON.parse((_a = event.body) !== null && _a !== void 0 ? _a : "{}");
    let error = checkHasRequiredAndReturnError(user);
    if (error !== null)
        return getReturnForError(400, error);
    const UserModel = mongoose.model('User', Models.User.Schema);
    yield mongoose.connect(uri);
    const userFromDb = yield getUserFromDb(user, UserModel);
    if (userFromDb == null || userFromDb.username != user.username || userFromDb.email != user.email)
        return getReturnForError(400, errors.userNotExist);
    // Not saving salt because bcrypt already saves it combined with the hash.
    // TODO: This doesnt work.
    if (bcrypt.compareSync(user.password, userFromDb.password))
        getReturn(200, userFromDb);
    return getReturnForError(400, errors.wrongPassword);
});
function getUserFromDb(user, userModel) {
    return __awaiter(this, void 0, void 0, function* () {
        const findByUsername = yield userModel.findOne({ "username": user.username });
        if (findByUsername)
            return findByUsername;
        const findByEmail = yield userModel.findOne({ "email": user.email });
        if (findByEmail)
            return findByEmail;
        return null;
    });
}
// TODO: Make this shared.
const getReturnForError = (statusCode, error) => ({ statusCode: statusCode, body: JSON.stringify({ code: error.code }) });
const getReturn = (statusCode, body) => ({ statusCode: statusCode, body: JSON.stringify(body) });
function checkHasRequiredAndReturnError(user) {
    if (user.password == null)
        return errors.passwordIsMissing;
    if (user.username == null && user.email == null)
        return errors.usernameOrEmailMissing;
    return null;
}
export { handler };
//# sourceMappingURL=login-user.js.map