document.addEventListener("DOMContentLoaded", _ => {
    const user = {
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
    const registerScreen = document.getElementById("register-screen");
    const loginScreen = document.getElementById("login-screen");
    const loggedInScreen = document.getElementById("logged-in-screen");
    const loginMenu = document.getElementById("login-menu");
    const loginMenuCloseButt = document.getElementById("login-menu-close-button");
    const loginOverlay = document.getElementById("login-overlay");
    const accountButt = document.getElementById("account-button");
    accountButt.addEventListener("click", (e) => loginOverlay.classList.remove("hidden"));
    loginMenuCloseButt.addEventListener("click", (e) => loginOverlay.classList.add("hidden"));
    registerScreen.getElementsByClassName("or-button")[0].addEventListener("click", (e) => switchLoginScreen(loginScreen));
    loginScreen.getElementsByClassName("or-button")[0].addEventListener("click", (e) => switchLoginScreen(registerScreen));
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !loginOverlay.classList.contains("hidden"))
            loginOverlay.classList.add("hidden");
    });
});
function switchLoginScreen(newScreen) {
    Array.from(document.getElementsByClassName("login-menu-screen"))
        .forEach((el) => el.classList.add("hidden"));
    newScreen.classList.remove("hidden");
}
export {};
//# sourceMappingURL=index.js.map