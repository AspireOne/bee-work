import {Models} from "../database/models";
import {Database} from "../database/database.js";
import errors = Database.errors;
import restrictions = Database.restrictions;
import {controls, onUserLoaded, onUserNotLoaded, setUser} from "../global.js";

document.addEventListener("DOMContentLoaded", _ => {
    const registerScreen = document.getElementById("register-screen") as HTMLDivElement;
    const loginScreen = document.getElementById("login-screen") as HTMLDivElement;
    const loggedInScreen = document.getElementById("logged-in-screen") as HTMLDivElement;

    const loginMenu = document.getElementById("login-menu") as HTMLElement;
    const loginMenuCloseButt = document.getElementById("login-menu-close-button") as HTMLElement;
    const loginOverlay = document.getElementById("login-overlay") as HTMLElement;
    const accountButt = document.getElementById("account-button") as HTMLElement;

    onUserLoaded((user) => {
        (document.getElementById("username") as HTMLSpanElement).innerText = user.username as string;
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

    (document.getElementById("log-out-button") as HTMLElement).addEventListener("click", (e) => setUser(null));

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !loginOverlay.classList.contains("hidden"))
            changeLoginOverlayState(loginOverlay, false);
    });

    Array.from(loginMenu.getElementsByTagName("input")).forEach((el) => {
        (el as HTMLInputElement).addEventListener("keydown", (e) => clearErrors());
    });
});

function registerLoginButton(screen: HTMLDivElement, checkMail: boolean, endpoint: string, callback: (user: Models.User.Interface) => void): void {
    screen.getElementsByClassName("login-button")[0].addEventListener("click", async (e) => {
        const fields = extractFields(screen);
        const user: Models.User.Interface = {
            username: fields.username,
            password: fields.password,
            email: fields.email
        }

        const error = Database.checkDataExistenceAndReturnError(user, true, true, checkMail) ?? Database.checkDataValidityAndReturnError(user);
        if (error != null) {
            showError(error, screen);
            return;
        }

        await Database.post<Models.User.Interface>(endpoint, user)
            .then(user => callback(user))
            .catch(error => showError(error, screen));
    });
}

function changeLoginOverlayState(loginOverlay: HTMLElement, on: boolean) {
    controls.ignoreUserInput = on;
    if (on)
        loginOverlay.classList.remove("hidden");
    else
        loginOverlay.classList.add("hidden");
}

function showError(error: Database.Error, screen: HTMLDivElement) {
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
        field = screen.querySelector(`div[field-type="${fieldType}"]`) as HTMLElement;

    const errorContainer = field?.getElementsByClassName("field-error")[0] as HTMLElement ?? document.getElementById("global-error-field");
    errorContainer.innerText = error.message;
}

const clearErrors = () => Array.from(document.getElementsByClassName("field-error")).forEach((el) => (el as HTMLParagraphElement).innerText = "");

function extractFields(screen: HTMLDivElement): {username: string, password: string, email: string | undefined} {
    const usernameInput = screen.querySelector<HTMLInputElement>('input[type="username"]') as HTMLInputElement;
    const passwordInput = screen.querySelector<HTMLInputElement>('input[type="password"]') as HTMLInputElement;
    const emailInput = screen.querySelector<HTMLInputElement>('input[type="email"]');

    return {username: usernameInput.value, password: passwordInput.value, email: emailInput?.value}
}

function switchLoginScreen(newScreen: HTMLDivElement) {
    Array.from(document.getElementsByClassName("login-menu-screen"))
        .forEach((el) => (el as HTMLDivElement).classList.add("hidden"));
    newScreen.classList.remove("hidden");
}