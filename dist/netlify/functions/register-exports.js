// We have to declare the variables outside the real function like dumbasses, because otherwise it throws typeerror on
// mongoose import when accessing the server function from website code.
export const restrictions = {
    maxUsernameLength: 32,
    maxPasswordLength: 64,
    maxEmailLength: 64,
};
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
    }
};
//# sourceMappingURL=register-exports.js.map