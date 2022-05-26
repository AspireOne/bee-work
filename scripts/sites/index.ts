import {Models} from "../database/models";
import {Database} from "../database.js";
import {errors, restrictions} from "../../netlify/functions/register-exports.js";

document.addEventListener("DOMContentLoaded", _ => {
    const user: Models.User.Interface = {
        username: "alala",
        password: "1234",
        email: "alala@seznam.cz"
    };


/*    (async () => {
        Database.post("register-user", user)
            .then(resp => {
                if (resp.status === 200)
                    console.log("status 200 " + resp.body);
                else
                {
                    console.log("whoopsie, status code was not 200");
                    const error = Database.getError(resp.body.code);
                    console.log(error);
                }
            })
            .catch(error => {
                console.log("ERROR " + error);
            })
    })();*/

    (async () => {
        Database.post("login-user", user)
            .then(resp => {
                if (resp.status === 200)
                    console.log("status 200 " + JSON.stringify(resp.body));
                else
                {
                    console.log("whoopsie, status code was not 200");
                    const error = Database.getError(resp.body.code);
                    console.log(error);
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