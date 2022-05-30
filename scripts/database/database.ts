import {Models} from "./models";

export module Database {
    export const restrictions = {
        usernameLength: {min: 3, max: 32},
        passwordLength: {min: 4, max: 64},
        emailLength: {min: 6, max: 64},
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
        },
        usernameTooShort: {
            code: 22,
            message: "Username is too short"
        },
        passwordTooShort: {
            code: 23,
            message: "Password is too short"
        },
        emailTooShort: {
            code: 24,
            message: "Email is too short"
        },
        couldNotUpdateUser: {
            code: 25,
            message: "Could not update user"
        },
        userIdMissing: {
            code: 26,
            message: "User ID is missing"
        },
        noDataToUpdate: {
            code: 27,
            message: "No data to update"
        },
        scoreTimeMissing: {
            code: 28,
            message: "Score time is missing"
        },
        scoreAchievedTimeMissing: {
            code: 29,
            message: "Score achieved time is missing"
        },
        couldNotAddScore: {
            code: 30,
            message: "Could not add score"
        },
        couldNotGetScores: {
            code: 31,
            message: "Could not get scores"
        }
    }

    export type Error = { code: number, message: string };

    export function getError(code: number): Error {
        const obj = Object.entries(errors).find(([key, err]) => code === err.code);
        return obj === undefined ? errors.unknownError : obj[1];
    }

    export async function request<T>(endpoint: string, data?: object) {
        return fetch(`/.netlify/functions/${endpoint}`, {
            method: data ? 'POST' : 'GET',
            headers: {'Accept': 'application/json', 'Content-Type': 'application/json'},
            body: data ? JSON.stringify(data) : undefined // body data type must match "Content-Type" header.
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

                console.log("Fetch error: ");
                console.log(error);
                throw errors.fetchFailed;
            });
    }

    // Checks strictly validity, not existence.
    export function checkDataValidityAndReturnError(user: Models.User.Interface): Database.Error | null {
        if (user.username != null) {
            if (user.username.length > restrictions.usernameLength.max)
                return errors.usernameTooLong;
            if (user.username.length < restrictions.usernameLength.min)
                return errors.usernameTooShort;
        }

        if (user.email != null) {
            if (user.email.length > restrictions.emailLength.max)
                return errors.emailTooLong;
            if (user.email.length < restrictions.emailLength.min)
                return errors.emailTooShort;

            if (!isEmailValid(user.email))
                return errors.emailNotValid;
        }

        if (user.password != null) {
            if (user.password.length > restrictions.passwordLength.max)
                return errors.passwordTooLong;
            if (user.password.length < restrictions.passwordLength.min)
                return errors.passwordTooShort;
        }

        return null;
    }

    export function checkDataExistenceAndReturnError(user: Models.User.Interface, username = true, password = true, email = true): Error | null {
        if (username && !user.username)
            return errors.usernameIsMissing;

        if (email && !user.email)
            return errors.emailIsMissing;

        if (password && !user.password)
            return errors.passwordIsMissing;

        return null;
    }

    const isEmailValid = (email: string): boolean => {
        const matches = email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return matches !== null && matches.length > 0;
    };
}