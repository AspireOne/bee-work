var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Database } from "../scripts/database/database";
var errors = Database.errors;
export function getReturnForError(statusCode, error, errorMessage = "") {
    return {
        statusCode: statusCode,
        body: JSON.stringify({
            code: error.code,
            errorMessage: errorMessage
        })
    };
}
export function getReturn(statusCode, body) {
    return {
        statusCode: statusCode,
        body: JSON.stringify(body),
    };
}
;
export function findUser(user, userModel) {
    return __awaiter(this, void 0, void 0, function* () {
        let userFromDb = null;
        if (user.username != null)
            userFromDb = yield userModel.findOne({ "username": user.username });
        if (userFromDb != null)
            return userFromDb;
        if (user.email != null)
            userFromDb = yield userModel.findOne({ "email": user.email });
        if (userFromDb != null)
            return userFromDb;
        if (user._id != null)
            userFromDb = yield userModel.findById(user._id);
        return userFromDb;
    });
}
export function checkUniqueAndReturnError(user, userModel) {
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
export const getDbUri = (password, db = "bee-work") => `mongodb+srv://Aspire:${password}@cluster0.2j2lg.mongodb.net/${db}`; //?retryWrites=true&w=majority
//# sourceMappingURL=utils.js.map