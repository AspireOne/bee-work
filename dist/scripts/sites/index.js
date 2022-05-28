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
document.addEventListener("DOMContentLoaded", _ => {
    const user = {
        username: "natálie",
        password: "goddamn",
        email: "natalie@seznam.cz"
    };
    /*    (async () => {
            Database.post("register-user", user)
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
        })();*/
    (() => __awaiter(void 0, void 0, void 0, function* () {
        Database.post("login-user", user)
            .then(resp => {
            if (resp.status === 200)
                console.log("status 200 " + JSON.stringify(resp.body));
            else {
                console.log("whoopsie, status code was not 200");
                const error = Database.getError(resp.body.code);
                console.log(error);
            }
        })
            .catch(error => {
            console.log("ERROR " + error);
        });
    }))();
    const loginButt = document.getElementById("login-button");
    const loginMenu = document.getElementById("login-menu");
    loginButt.addEventListener("click", () => {
        loginMenu.classList.toggle("hidden");
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !loginMenu.classList.contains("hidden"))
            loginMenu.classList.add("hidden");
    });
});
//# sourceMappingURL=index.js.map