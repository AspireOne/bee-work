var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Database } from "../database/database.js";
var errors = Database.errors;
import { controls, onUserLoaded, onUserNotLoaded, setUser } from "../global.js";
document.addEventListener("DOMContentLoaded", _ => {
    const registerScreen = document.getElementById("register-screen");
    const loginScreen = document.getElementById("login-screen");
    const loggedInScreen = document.getElementById("logged-in-screen");
    const loginMenu = document.getElementById("login-menu");
    const loginMenuCloseButt = document.getElementById("login-menu-close-button");
    const loginOverlay = document.getElementById("login-overlay");
    const accountButt = document.getElementById("account-button");
    onUserLoaded((user) => {
        document.getElementById("username").innerText = user.username;
        switchLoginScreen(loggedInScreen);
    });
    onUserNotLoaded(() => {
        console.log("on user not loaded executed.");
        switchLoginScreen(loginScreen);
    });
    accountButt.addEventListener("click", (e) => changeLoginOverlayState(loginOverlay, true));
    loginMenuCloseButt.addEventListener("click", (e) => changeLoginOverlayState(loginOverlay, false));
    registerScreen.getElementsByClassName("or-button")[0].addEventListener("click", (e) => switchLoginScreen(loginScreen));
    loginScreen.getElementsByClassName("or-button")[0].addEventListener("click", (e) => switchLoginScreen(registerScreen));
    registerLoginButton(registerScreen, true, "register-user", (user) => setUser(user));
    registerLoginButton(loginScreen, false, "login-user", (user) => setUser(user));
    document.getElementById("log-out-button").addEventListener("click", (e) => setUser(null));
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !loginOverlay.classList.contains("hidden"))
            changeLoginOverlayState(loginOverlay, false);
    });
    Array.from(loginMenu.getElementsByTagName("input")).forEach((el) => {
        el.addEventListener("keydown", (e) => clearErrors());
    });
});
function registerLoginButton(screen, checkMail, endpoint, callback) {
    screen.getElementsByClassName("login-button")[0].addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const fields = extractFields(screen);
        const user = {
            username: fields.username,
            password: fields.password,
            email: fields.email
        };
        const error = (_a = Database.checkDataExistenceAndReturnError(user, true, true, checkMail)) !== null && _a !== void 0 ? _a : Database.checkDataValidityAndReturnError(user);
        if (error != null) {
            showError(error, screen);
            return;
        }
        yield Database.post(endpoint, user)
            .then(user => callback(user))
            .catch(error => showError(error, screen));
    }));
}
function changeLoginOverlayState(loginOverlay, on) {
    controls.ignoreUserInput = on;
    if (on)
        loginOverlay.classList.remove("hidden");
    else
        loginOverlay.classList.add("hidden");
}
function showError(error, screen) {
    var _a;
    clearErrors();
    let fieldType = null;
    switch (error) {
        case errors.usernameTooShort:
        case errors.usernameTooLong:
        case errors.usernameAlreadyExists:
        case errors.usernameIsMissing:
            fieldType = "username";
            break;
        case errors.passwordTooShort:
        case errors.passwordTooLong:
        case errors.passwordIsMissing:
        case errors.wrongPassword:
            fieldType = "password";
            break;
        case errors.emailIsMissing:
        case errors.emailAlreadyExists:
        case errors.emailNotValid:
        case errors.emailTooShort:
        case errors.emailTooLong:
            fieldType = "email";
            break;
    }
    let field = null;
    if (fieldType !== null)
        field = screen.querySelector(`div[field-type="${fieldType}"]`);
    const errorContainer = (_a = field === null || field === void 0 ? void 0 : field.getElementsByClassName("field-error")[0]) !== null && _a !== void 0 ? _a : document.getElementById("global-error-field");
    errorContainer.innerText = error.message;
}
const clearErrors = () => Array.from(document.getElementsByClassName("field-error")).forEach((el) => el.innerText = "");
function extractFields(screen) {
    const usernameInput = screen.querySelector('input[type="username"]');
    const passwordInput = screen.querySelector('input[type="password"]');
    const emailInput = screen.querySelector('input[type="email"]');
    return { username: usernameInput.value, password: passwordInput.value, email: emailInput === null || emailInput === void 0 ? void 0 : emailInput.value };
}
function switchLoginScreen(newScreen) {
    Array.from(document.getElementsByClassName("login-menu-screen"))
        .forEach((el) => el.classList.add("hidden"));
    newScreen.classList.remove("hidden");
}
//# sourceMappingURL=index.js.map