import {mongoose} from "@typegoose/typegoose";
import { Handler } from "@netlify/functions";
import {Models} from "../../scripts/database/models";
import {Database} from "../../scripts/database/database";
import errors = Database.errors;
import {checkUniqueAndReturnError, findUser, getDbUri, getReturn, getReturnForError} from "../utils";
import getError = Database.getError;
import User = Models.User;

const handler: Handler = async (event, context) => {
    if (event.httpMethod !== "POST") return getReturnForError(405, errors.noPost);
    if (process.env.MONGODB_PASSWORD == null) return getReturnForError(500, errors.missingDbPassword);

    const score: Models.Score.Interface = JSON.parse(event.body ?? "{}");
    const ScoreModel = mongoose.model<Models.Score.Interface>('Score', Models.Score.Schema);
    const UserModel = mongoose.model<Models.User.Interface>('User', Models.User.Schema);

    try {
        await mongoose.connect(getDbUri(process.env.MONGODB_PASSWORD as string));
    } catch (error: any) {
        return getReturnForError(500, errors.couldNotConnectDb, error.toString());
    }

    console.log(score);
    let scores = null;
    try {
        scores = await ScoreModel.find(score).populate("user").exec();
    } catch (error: any) {
        console.log(error);
        return getReturnForError(500, errors.couldNotGetScores, error.toString());
    }

    return getReturn(200, scores);
};

export { handler };