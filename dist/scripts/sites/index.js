var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener("DOMContentLoaded", _ => {
    const user = {
        username: "Aspirateuasdasdr",
        password: "1234",
        email: "matejpesl@seznamaasda.cz"
    };
    (() => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield postData("/.netlify/functions/register-user", user)
            .catch(error => console.error("ERRORRAA: " + error))
            .then(data => {
            console.log(data); // JSON data parsed by `data.json()` call
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
function postData(url, data) {
    return __awaiter(this, void 0, void 0, function* () {
        // Default options are marked with *
        const response = yield fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return yield response.json(); // parses JSON response into native JavaScript objects
    });
}
export {};
//# sourceMappingURL=index.js.map