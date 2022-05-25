import {Models} from "../database/models";

document.addEventListener("DOMContentLoaded", _ => {
    const user: Models.User.Interface = {
        username: "Aspirateur",
        password: "1234",
        email: "matejpesl@seznam.cz"
    };
    (async () => {
        const data = await postData("http://localhost:8888/.netlify/functions/register-user", user)
            .catch(error => console.error("ERRORRAA: " + error))
            .then(data => {
                console.log(data); // JSON data parsed by `data.json()` call
            });
        console.log(data);
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


async function postData(url: string, data: { [key: string]: any }) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });

    return await response.json(); // parses JSON response into native JavaScript objects
}