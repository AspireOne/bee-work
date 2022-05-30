var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { mongoose } from "@typegoose/typegoose";
import { Models } from "../../scripts/database/models";
import { Database } from "../../scripts/database/database";
var errors = Database.errors;
import { getDbUri, getReturn, getReturnForError } from "../utils";
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (event.httpMethod !== "POST")
        return getReturnForError(405, errors.noPost);
    if (process.env.MONGODB_PASSWORD == null)
        return getReturnForError(500, errors.missingDbPassword);
    const score = JSON.parse((_a = event.body) !== null && _a !== void 0 ? _a : "{}");
    const ScoreModel = mongoose.model('Score', Models.Score.Schema);
    try {
        yield mongoose.connect(getDbUri(process.env.MONGODB_PASSWORD));
    }
    catch (error) {
        return getReturnForError(500, errors.couldNotConnectDb, error.toString());
    }
    console.log(score);
    let scores = null;
    try {
        scores = yield ScoreModel.find(score).populate("user").exec();
    }
    catch (error) {
        console.log(error);
        return getReturnForError(500, errors.couldNotGetScores, error.toString());
    }
    return getReturn(200, scores);
});
export { handler };
//# sourceMappingURL=get-scores.js.map