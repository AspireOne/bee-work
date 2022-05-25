import {Models} from "../database/models";
import {Database} from "../database.js";
import {errors, restrictions} from "../../netlify/functions/register-exports.js";

document.addEventListener("DOMContentLoaded", _ => {
    const user: Models.User.Interface = {
        username: "Aspirateuasdasdr",
        password: "1234",
        email: "matejpesl@seznamaasda.cz"
    };

    (async () => {
        Database.post("register-user", user)
            .then(obj => {
                if (obj.status === 200)
                    console.log("status 200 " + obj);
                else
                {
                    console.log("whoopsie, status code was not 200");
                    const error = Database.getError(obj.body, errors);
                }
            })
            .catch(error => {
                console.log("ERROR " + error);
            })
    })();

    const loginButt = document.getElementById("login-button") as HTMLElement;
    const loginMenu = document.getElementById("login-menu") as HTMLElement;

    loginButt.addEventListener("click", () => {
        loginMenu.classList.toggle("hidden");
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !loginMenu.classList.contains("hidden"))
            loginMenu.classList.add("hidden");
    });
});