import {Models} from "./models";

export module Database {
    export const restrictions = {
        maxUsernameLength: 32,
        maxPasswordLength: 64,
        maxEmailLength: 64,
    }

    export const errors = {
        usernameAlreadyExists: {
            code: 1,
            message: "Username already exists"
        },
        emailAlreadyExists: {
            code: 2,
            message: "Email already exists"
        },
        emailNotValid: {
            code: 3,
            message: "Email is not valid"
        },
        usernameTooLong: {
            code: 4,
            message: "Username is too long"
        },
        passwordTooLong: {
            code: 5,
            message: "Password is too long"
        },
        emailTooLong: {
            code: 6,
            message: "Email is too long"
        },
        emailIsMissing: {
            code: 7,
            message: "Email is missing"
        },
        usernameIsMissing: {
            code: 8,
            message: "Username is missing"
        },
        passwordIsMissing: {
            code: 9,
            message: "Password is missing"
        },
        couldNotSaveUser: {
            code: 10,
            message: "Could not save user"
        },

        noGet: {
            code: 11,
            message: "GET Not Allowed",
        },
        noPost: {
            code: 12,
            message: "POST Not Allowed",
        },
        unknownError: {
            code: 13,
            message: "Unknown error occured",
        },

        usernameOrEmailMissing: {
            code: 14,
            message: "Username or email is missing"
        },
        userNotExist: {
            code: 15,
            message: "User does not exist"
        },
        wrongPassword: {
            code: 16,
            message: "Password is incorrect"
        },
        jsonParsingError: {
            code: 17,
            message: "Could not parse incoming JSON"
        },
        couldNotConnectDb: {
            code: 18,
            message: "Could not connect to database"
        },
        couldNotRetrieveDocument: {
            code: 19,
            message: "Could not retrieve document"
        },
        missingDbPassword: {
            code: 20,
            message: "Missing database password"
        },
        fetchFailed: {
            code: 21,
            message: "Fetch failed"
        }
    }

    export type Error = { code: number, message: string };

    export function getError(code: number): Error {
        const obj = Object.entries(errors).find(([key, err]) => code === err.code);
        return obj === undefined ? errors.unknownError : obj[1];
    }

    export async function post<T>(endpoint: string, data: object): Promise<T> {
        return fetch(`/.netlify/functions/${endpoint}`, {
            method: 'POST',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: JSON.stringify(data) // body data type must match "Content-Type" header.
        })
            .then(response => response.json().then(data => ({body: data, status: response.status})))
            .then(resp => {
                if (resp.status === 200)
                    return resp.body as T;

                const error = Database.getError(resp.body.code);
                throw(error);
            })
            .catch(error => {
                if (error.code != null)
                    throw error;

                console.log("Fetch error: " + error);
                throw errors.fetchFailed;
            });
    }
}