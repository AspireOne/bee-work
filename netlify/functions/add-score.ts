import { Handler } from "@netlify/functions";
import {Models} from "../../scripts/database/models";
import {Database} from "../../scripts/database/database";
import {mongoose} from "@typegoose/typegoose";
import errors = Database.errors;
import {checkUniqueAndReturnError, findUser, getDbUri, getReturn, getReturnForError} from "../utils";
import getError = Database.getError;
import User = Models.User;
//const bcrypt = require('bcryptjs');

const handler: Handler = async (event, context) => {
    return;
    if (event.httpMethod !== "POST") return getReturnForError(405, errors.noGet);
    if (process.env.MONGODB_PASSWORD == null) return getReturnForError(500, errors.missingDbPassword);

    const newScore: Models.Score.Interface = JSON.parse(event.body ?? "{}");
    console.log(newScore);
    let error = checkHasRequiredAndReturnError(newScore);
    if (error !== null)
        return getReturnForError(400, error);

    /*const UserModel = mongoose.model<Models.User.Interface>('User', Models.User.Schema);*/
    const ScoreModel = mongoose.model<Models.Score.Interface>('Score', Models.Score.Schema);

    try {
        await mongoose.connect(getDbUri(process.env.MONGODB_PASSWORD as string));
    } catch (error: any) {
        return getReturnForError(500, errors.couldNotConnectDb, error.toString());
    }

    /*const userExists = await UserModel.exists({ _id: newScore.user_id })
    if (!userExists)
        return getReturnForError(500, errors.userNotExist);*/

    const NewScore = new ScoreModel(newScore);
    const bestScore = await ScoreModel.findOne({ user: newScore.user });

    let saveResult;
    if (!bestScore) {
        saveResult = await NewScore.save();
    }
    else if ((bestScore.time as number) < (newScore.time as number)) {
        const response = await bestScore.updateOne(newScore);
        if (response)
            saveResult = newScore;
    }
    else if ((bestScore.time as number) >= (newScore.time as number)) {
        return getReturn(200, {});
    }

    if (!saveResult)
        return getReturnForError(500, errors.couldNotAddScore);

    return getReturn(200, saveResult);
};

function checkHasRequiredAndReturnError(score: Models.Score.Interface): Database.Error | null {
    if (!score.user)
        return errors.userIdMissing;
    if (!score.time)
        return errors.scoreTimeMissing;
    if (!score.time_achieved_unix)
        return errors.scoreAchievedTimeMissing;
    return null;
}

export { handler };