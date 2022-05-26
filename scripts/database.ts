import {errors} from "../netlify/functions/register-exports.js";

export module Database {
    export type Error = { code: number, message: string };

    export function getError(code: number): Error {
        const obj = Object.entries(errors).find(([key, err]) => code === err.code);
        return obj === undefined ? errors.unknownError : obj[1];
    }

    export async function post(endpoint: string, data: object) {
        return fetch(`/.netlify/functions/${endpoint}`, {
            method: 'POST',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify(data) // body data type must match "Content-Type" header.
        }).then(response => response.json().then(data => ({body: data, status: response.status})) );
    }
}