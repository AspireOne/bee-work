var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Database } from "../database.js";
import { errors } from "../../netlify/functions/register-exports.js";
document.addEventListener("DOMContentLoaded", _ => {
    const user = {
        username: "Aspirateuasdasdr",
        password: "1234",
        email: "matejpesl@seznamaasda.cz"
    };
    (() => __awaiter(void 0, void 0, void 0, function* () {
        Database.post("register-user", user)
            .then(obj => {
            if (obj.status === 200)
                console.log("status 200 " + obj);
            else {
                console.log("whoopsie, status code was not 200");
                const error = Database.getError(obj.body, errors);
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