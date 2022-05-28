import {Models} from "../database/models";
import {Database} from "../database/database.js";

document.addEventListener("DOMContentLoaded", _ => {
    const user: Models.User.Interface = {
        username: "natálie",
        password: "goddamnd",
        email: "natalie@seznam.cz"
    };

/*    Database.post<Models.User.Interface>("login-user", user)
        .then(user => {
            console.log("Successfully logged in: " + JSON.stringify(user));
        })
        .catch(error => {
            console.log("Error logging in: " + JSON.stringify(error));
        })
*/

    const registerScreen = document.getElementById("register-screen") as HTMLDivElement;
    const loginScreen = document.getElementById("login-screen") as HTMLDivElement;
    const loggedInScreen = document.getElementById("logged-in-screen") as HTMLDivElement;

    const loginMenu = document.getElementById("login-menu") as HTMLElement;
    const loginMenuCloseButt = document.getElementById("login-menu-close-button") as HTMLElement;
    const loginOverlay = document.getElementById("login-overlay") as HTMLElement;
    const accountButt = document.getElementById("account-button") as HTMLElement;

    accountButt.addEventListener("click", (e) => loginOverlay.classList.remove("hidden"));
    loginMenuCloseButt.addEventListener("click", (e) => loginOverlay.classList.add("hidden"));

    registerScreen.getElementsByClassName("or-button")[0].addEventListener("click", (e) => switchLoginScreen(loginScreen));
    loginScreen.getElementsByClassName("or-button")[0].addEventListener("click", (e) => switchLoginScreen(registerScreen));



    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !loginOverlay.classList.contains("hidden"))
            loginOverlay.classList.add("hidden");
    });
});

function switchLoginScreen(newScreen: HTMLDivElement) {
    Array.from(document.getElementsByClassName("login-menu-screen"))
        .forEach((el) => (el as HTMLDivElement).classList.add("hidden"));
    newScreen.classList.remove("hidden");
}