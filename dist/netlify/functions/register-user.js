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
const mongodbPassword = process.env.MONGODB_PASSWORD;
const uri = `mongodb+srv://Aspire:${mongodbPassword}@cluster0.2j2lg.mongodb.net/bee-work`; //?retryWrites=true&w=majority
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (event.httpMethod !== "POST")
        return getReturnForError(405, "GET Not Allowed");
    const user = JSON.parse((_a = event.body) !== null && _a !== void 0 ? _a : "{}");
    let error = checkRequiredAndReturnError(user);
    if (error !== null)
        return getReturnForError(400, error);
    const UserModel = mongoose.model('User', Models.User.Schema);
    yield mongoose.connect(uri);
    let usernameExists = yield UserModel.findOne({ "username": user.username });
    let emailExists = yield UserModel.findOne({ "email": user.email });
    if (usernameExists)
        error = "Username already exists";
    else if (emailExists)
        error = "Email already exists";
    if (error !== null)
        return getReturnForError(400, error);
    const User = new UserModel(user);
    const saveResult = yield User.save();
    if (!saveResult)
        return getReturnForError(500, "Could not save user");
    return getReturn(200, saveResult);
});
function getReturnForError(statusCode, error) {
    return { statusCode: statusCode, body: JSON.stringify({ error: error }) };
}
function getReturn(statusCode, body) {
    return { statusCode: statusCode, body: JSON.stringify(body) };
}
function checkRequiredAndReturnError(user) {
    if (user.username == null)
        return "Username is missing";
    else if (user.password == null)
        return "Password is missing";
    else if (user.email == null)
        return "Email is missing";
    return null;
}
export { handler };
//# sourceMappingURL=register-user.js.map