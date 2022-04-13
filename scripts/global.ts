import {Bee} from "./bee.js";
import {Controls} from "./controls.js";
import {Portals} from "./portals.js";
import {Utils} from "./utils.js";
import {Types} from "./types.js";
import {VanishingCircle} from "./vanishingCircle.js";
import Point = Types.Point;
import {CollisionChecker} from "./collisionChecker.js";

export const modules: (() => void)[] = [];
export const controls = new Controls();
export let collisionChecker: CollisionChecker;
export let portals: Portals;
export let bee: Bee;
const collisionButtMinEnterTime = 350;
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

    const pos = getBeeInitialPos(params);
    bee.element.style.left = pos.x + "px";
    bee.element.style.top = pos.y + "px";
    bee.start();

    Utils.addValueToSliders();
    registerCollideButtons();
    // Invoke all modules waiting for main to be ready.
    modules.forEach(module => module());
});

function registerCollideButtons() {
    for (let butt of document.getElementsByClassName("collide-button")) {
        const realButt = butt as HTMLElement;
        let enterTime = 0;
        collisionChecker.addObject({
            element: realButt,
            onCollisionEnter: () => {
                realButt.classList.add("over");
                enterTime = Date.now();
            },
            onCollisionLeave: () => {
                const timeDiff = Date.now() - enterTime;
                setTimeout(() => realButt.classList.remove("over"), timeDiff < collisionButtMinEnterTime ? collisionButtMinEnterTime - timeDiff : 0);
            }});
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

function getUrlParams(): { [key: string]: string } {
    const urlSearchParams = new URLSearchParams(window.location.search);
    return Object.fromEntries(urlSearchParams.entries());
}

// Adds circleVanishing effect to the cursor.
/*document.addEventListener('mousemove', e => {
    const offset = 33;
    new VanishingCircle({x: e.x - offset, y: e.y - offset}, {duration: 700, size: 80}).show();
});*/
