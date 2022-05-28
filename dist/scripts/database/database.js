var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export var Database;
(function (Database) {
    Database.restrictions = {
        maxUsernameLength: 32,
        maxPasswordLength: 64,
        maxEmailLength: 64,
    };
    Database.errors = {
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
        }
    };
    function getError(code) {
        const obj = Object.entries(Database.errors).find(([key, err]) => code === err.code);
        return obj === undefined ? Database.errors.unknownError : obj[1];
    }
    Database.getError = getError;
    function post(endpoint, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return fetch(`/.netlify/functions/${endpoint}`, {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                body: JSON.stringify(data) // body data type must match "Content-Type" header.
            }).then(response => response.json().then(data => ({ body: data, status: response.status })));
        });
    }
    Database.post = post;
})(Database || (Database = {}));
//# sourceMappingURL=database.js.map