export function getReturnForError(statusCode, error, errorMessage = "") {
    return {
        statusCode: statusCode,
        body: JSON.stringify({
            code: error.code,
            errorMessage: errorMessage
        })
    };
}
export function getReturn(statusCode, body) {
    return {
        statusCode: statusCode,
        body: JSON.stringify(body),
    };
}
;
export const getDbUri = (password) => `mongodb+srv://Aspire:${password}@cluster0.2j2lg.mongodb.net/bee-work`; //?retryWrites=true&w=majority
//# sourceMappingURL=utils.js.map