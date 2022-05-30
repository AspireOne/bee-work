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
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (event.httpMethod !== "POST")
        return getReturnForError(405, errors.noGet);
    if (process.env.MONGODB_PASSWORD == null)
        return getReturnForError(500, errors.missingDbPassword);
    const score = JSON.parse((_a = event.body) !== null && _a !== void 0 ? _a : "{}");
    let error = checkHasRequiredAndReturnError(score);
    if (error !== null)
        return getReturnForError(400, error);
    const ScoreModel = mongoose.model('Score', Models.Score.Schema);
    try {
        yield mongoose.connect(getDbUri(process.env.MONGODB_PASSWORD));
    }
    catch (error) {
        return getReturnForError(500, errors.couldNotConnectDb, error.toString());
    }
    const Score = new ScoreModel(score);
    const saveResult = yield Score.save();
    if (!saveResult)
        return getReturnForError(500, errors.couldNotSaveUser);
    return getReturn(200, saveResult);
});
function checkHasRequiredAndReturnError(score) {
    if (score.user_id == null)
        return errors.userIdMissing;
    if (score.time == null)
        return errors.scoreTimeMissing;
    if (score.time_achieved_unix == null)
        return errors.scoreAchievedTimeMissing;
    return null;
}
export { handler };
//# sourceMappingURL=get-score.js.map