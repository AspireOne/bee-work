import { Bee } from "./bee.js";
import { Controls } from "./controls.js";
import { Portals } from "./portals.js";
import { Utils } from "./utils/utils.js";
import { CollisionChecker } from "./collisionChecker.js";
import { Database } from "./database/database.js";
export const modules = [];
export const controls = new Controls();
export let user = null;
export let collisionChecker;
export let portals;
export let bee;
let userSet = false;
const userLoadedCallbacks = [];
const userNotLoadedCallbacks = [];
const beeElementHTML = `
        <div>
            <p id="bee-text"></p>
            <img src="../resources/bee.png" draggable="false" class="unselectable" id="bee"/>
        </div>
    `;
// Get them as soon as possible.
const params = getUrlParams();
handleUrlParams(params);
history.pushState("", document.title, window.location.pathname);
//document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener("DOMContentLoaded", _ => {
    const userFromLocalStorageStr = localStorage.getItem("user");
    console.log(userFromLocalStorageStr);
    if (userFromLocalStorageStr === null)
        setUser(null);
    else {
        const userFromLocalStorage = JSON.parse(userFromLocalStorageStr);
        Database.post("login-user", userFromLocalStorage)
            .then(userFromDb => {
            console.log("Loaded user from database.");
            setUser(userFromDb);
        }).catch(err => {
            console.error("Could not load user from database. Error: " + JSON.stringify(err));
            setUser(null);
        });
    }
    // Initialization.
    document.body.appendChild(Utils.htmlToElement(beeElementHTML));
    const beeElement = document.getElementById("bee");
    collisionChecker = new CollisionChecker(beeElement);
    portals = new Portals(beeElement);
    bee = new Bee(beeElement, controls);
    // Logic.
    document.body.appendChild(beeElement);
    collisionChecker.startChecking();
    portals.registerSidePortals();
    bee.currPos = getBeeInitialPos(params);
    bee.start();
    Utils.addValueToSliders();
    registerCollideButtons();
    // Invoke all modules waiting for main to be ready.
    modules.forEach(module => module());
});
export function setUser(newUser) {
    user = newUser;
    userSet = true;
    if (newUser === null) {
        localStorage.removeItem("user");
        userNotLoadedCallbacks.forEach(callback => callback());
    }
    else {
        localStorage.setItem("user", JSON.stringify(newUser));
        userLoadedCallbacks.forEach(callback => callback(newUser));
    }
}
export function onUserLoaded(callback) {
    userLoadedCallbacks.push(callback);
    if (user != null)
        callback(user);
}
export function onUserNotLoaded(callback) {
    userNotLoadedCallbacks.push(callback);
    if (user == null && userSet)
        callback();
}
function registerCollideButtons() {
    for (let butt of document.getElementsByClassName("collide-button")) {
        const realButt = butt;
        let id = 0;
        collisionChecker.add({
            element: realButt,
            unremovable: true,
            onCollisionEnter: () => {
                realButt.classList.add("over");
                id = window.setTimeout(() => realButt.classList.remove("over"), 700);
            },
            onCollisionLeave: () => {
                realButt.classList.remove("over");
                clearTimeout(id);
            }
        });
    }
}
function getBeeInitialPos(searchParams) {
    const beePos = { x: document.body.clientWidth / 2 - bee.element.clientWidth / 2, y: document.body.clientHeight };
    const offset = 90;
    if (searchParams.from === "left")
        beePos.x = document.body.clientWidth - bee.element.clientWidth - offset;
    else if (searchParams.from === "right")
        beePos.x = offset;
    if (searchParams.from)
        beePos.y = document.body.clientHeight / 2;
    return { x: beePos.x, y: beePos.y };
}
function handleUrlParams(params) {
    if (params.from) {
        for (let key in params)
            Controls.changePressStateByName(key, params[key] === "true");
    }
}
function getUrlParams() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    return Object.fromEntries(urlSearchParams.entries());
}
// Adds circleVanishing effect to the cursor.
/*document.addEventListener('mousemove', e => {
    const offset = 33;
    new VanishingCircle({x: e.x - offset, y: e.y - offset}, {duration: 700, size: 80}).show();
});*/
//# sourceMappingURL=global.js.map