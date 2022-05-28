import {Database} from "../scripts/database/database";
import {mongoose} from "@typegoose/typegoose";
import {Models} from "../scripts/database/models";

export function getReturnForError(statusCode: number, error: Database.Error, errorMessage: string = "") {
    return {
        statusCode: statusCode,
        body: JSON.stringify({
            code: error.code,
            errorMessage: errorMessage
        })
    };
}
export function getReturn(statusCode: number, body: object) {
    return {
        statusCode: statusCode,
        body: JSON.stringify(body),
    };
};

export const getDbUri = (password: string) => `mongodb+srv://Aspire:${password}@cluster0.2j2lg.mongodb.net/bee-work`; //?retryWrites=true&w=majority