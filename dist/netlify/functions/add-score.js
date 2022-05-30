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
//const bcrypt = require('bcryptjs');
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (event.httpMethod !== "POST")
        return getReturnForError(405, errors.noGet);
    if (process.env.MONGODB_PASSWORD == null)
        return getReturnForError(500, errors.missingDbPassword);
    const newScore = JSON.parse((_a = event.body) !== null && _a !== void 0 ? _a : "{}");
    console.log(newScore);
    let error = checkHasRequiredAndReturnError(newScore);
    if (error !== null)
        return getReturnForError(400, error);
    /*const UserModel = mongoose.model<Models.User.Interface>('User', Models.User.Schema);*/
    const ScoreModel = mongoose.model('Score', Models.Score.Schema);
    try {
        yield mongoose.connect(getDbUri(process.env.MONGODB_PASSWORD));
    }
    catch (error) {
        return getReturnForError(500, errors.couldNotConnectDb, error.toString());
    }
    /*const userExists = await UserModel.exists({ _id: newScore.user_id })
    if (!userExists)
        return getReturnForError(500, errors.userNotExist);*/
    const NewScore = new ScoreModel(newScore);
    const bestScore = yield ScoreModel.findOne({ user: newScore.user });
    let saveResult;
    if (!bestScore) {
        saveResult = yield NewScore.save();
    }
    else if (bestScore.time < newScore.time) {
        const response = yield bestScore.updateOne(newScore);
        if (response)
            saveResult = newScore;
    }
    else if (bestScore.time >= newScore.time) {
        return getReturn(200, {});
    }
    if (!saveResult)
        return getReturnForError(500, errors.couldNotAddScore);
    return getReturn(200, saveResult);
});
function checkHasRequiredAndReturnError(score) {
    if (!score.user)
        return errors.userIdMissing;
    if (!score.time)
        return errors.scoreTimeMissing;
    if (!score.time_achieved_unix)
        return errors.scoreAchievedTimeMissing;
    return null;
}
export { handler };
//# sourceMappingURL=add-score.js.map