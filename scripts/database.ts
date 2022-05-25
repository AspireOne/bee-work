export module Database {
    export const errorType = { specific: "specific", global: "global" }
    export type Error = { code: number, message: string };
    export type GlobalError = Error & { type: "global" };

    export const globalErrors = {
        noGet: {
            code: 1,
            message: "GET Not Allowed",
            type: "global",
        },
        noPost: {
            code: 2,
            message: "POST Not Allowed",
            type: "global",
        },
        unknownError: {
            code: 3,
            message: "Unknown error occured",
            type: "global"
        }
    }

    export function kokot() {}

    export function getError(error: {code: number, type: string}, specificErrorsArray: { [key: string]: Error }): Error {
        const obj = Object.entries(isGlobalError(error) ? globalErrors : specificErrorsArray).find(([key, err]) => err.code === error.code);
        return obj === undefined ? globalErrors.unknownError : obj[1];
    }

    const isGlobalError = (obj: object): boolean => (obj as any).type === errorType.global

    export async function post(endpoint: string, data: object) {
        return fetch(`/.netlify/functions/${endpoint}`, {
            method: 'POST',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify(data) // body data type must match "Content-Type" header.
        }).then(response => response.json().then(data => ({body: data, status: response.status})) );
    }
}