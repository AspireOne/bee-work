import {Bee} from "./bee.js";
import {Controls} from "./controls.js";
import {Portals} from "./portals.js";
import {Utils} from "./utils/utils.js";
import {Types} from "./utils/types.js";
import {CollisionChecker} from "./collisionChecker.js";
import Point = Types.Point;
import {Models} from "./database/models";
import {Database} from "./database/database.js";

export const modules: (() => void)[] = [];
export const controls = new Controls();
export let user: Models.User.Interface | null = null;
export let collisionChecker: CollisionChecker;
export let portals: Portals;
export let bee: Bee;
let userSet: boolean = false;
const userLoadedCallbacks: ((user: Models.User.Interface) => void)[] = [];
const userNotLoadedCallbacks: (() => void)[] = [];
const beeElementHTML =
    `
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
        const userFromLocalStorage = JSON.parse(userFromLocalStorageStr) as Models.User.Interface;
        Database.post<Models.User.Interface>("login-user", userFromLocalStorage)
            .then(userFromDb => {
            console.log("Loaded user from database.");
            setUser(userFromDb);
        }).catch(err => {
            console.error("Could not load user from database. Error: " + err);
            setUser(null);
        });
    }

    // Initialization.
    document.body.appendChild(Utils.htmlToElement(beeElementHTML));
    const beeElement = document.getElementById("bee") as HTMLElement;
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

export function setUser(newUser: Models.User.Interface | null) {
    user = newUser;
    userSet = true;

    if (newUser === null) {
        localStorage.removeItem("user");
        userNotLoadedCallbacks.forEach(callback => callback());
    } else {
        localStorage.setItem("user", JSON.stringify(newUser));
        userLoadedCallbacks.forEach(callback => callback(newUser));
    }
}

export function onUserLoaded(callback: (user: Models.User.Interface) => void): void {
    userLoadedCallbacks.push(callback);
    if (user != null)
        callback(user);
}

export function onUserNotLoaded(callback: () => void): void {
    userNotLoadedCallbacks.push(callback);
    if (user == null && userSet)
        callback();
}

function registerCollideButtons() {
    for (let butt of document.getElementsByClassName("collide-button")) {
        const realButt = butt as HTMLElement;
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

function getBeeInitialPos(searchParams: {[key: string]: string}): Point {
    const beePos = {x: document.body.clientWidth/2 - bee.element.clientWidth/2, y: document.body.clientHeight };
    const offset = 90;

    if (searchParams.from === "left")
        beePos.x = document.body.clientWidth - bee.element.clientWidth - offset;
    else if (searchParams.from === "right")
        beePos.x = offset;

    if (searchParams.from)
        beePos.y = document.body.clientHeight/2;

    return {x: beePos.x, y: beePos.y};
}

function handleUrlParams(params: {[key: string]: string}): void {
    if (params.from) {
        for (let key in params)
            Controls.changePressStateByName(key, params[key] === "true");
    }
}

function getUrlParams(): {[key: string]: string} {
    const urlSearchParams = new URLSearchParams(window.location.search);
    return Object.fromEntries(urlSearchParams.entries());
}

// Adds circleVanishing effect to the cursor.
/*document.addEventListener('mousemove', e => {
    const offset = 33;
    new VanishingCircle({x: e.x - offset, y: e.y - offset}, {duration: 700, size: 80}).show();
});*/
