import { Database } from "../scripts/database/database";
export declare function getReturnForError(statusCode: number, error: Database.Error, errorMessage?: string): {
    statusCode: number;
    body: string;
};
export declare function getReturn(statusCode: number, body: object): {
    statusCode: number;
    body: string;
};
export declare const getDbUri: (password: string) => string;
