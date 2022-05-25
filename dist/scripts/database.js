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
    Database.errorType = { specific: "specific", global: "global" };
    Database.globalErrors = {
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
    };
    function kokot() { }
    Database.kokot = kokot;
    function getError(error, specificErrorsArray) {
        const obj = Object.entries(isGlobalError(error) ? Database.globalErrors : specificErrorsArray).find(([key, err]) => err.code === error.code);
        return obj === undefined ? Database.globalErrors.unknownError : obj[1];
    }
    Database.getError = getError;
    const isGlobalError = (obj) => obj.type === Database.errorType.global;
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