import {Bee} from "./bee.js";
import {Controls} from "./controls.js";
import {Portals} from "./portals.js";
import {Utils} from "./utils.js";
import {Types} from "./types";
import Point = Types.Point;

export let controls = new Controls();
export let bee: Bee;
export let portals: Portals;
export const modules: (() => void)[] = [];

const beeElementHTML =
    `
        <div>
            <p id="bee-text"></p>
            <img src="../resources/bee.png" draggable="false" class="unselectable" id="bee"/>
        </div>
    `;

//document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener("DOMContentLoaded", _ => {
    document.body.appendChild(Utils.htmlToElement(beeElementHTML));
    const beeElement = document.getElementById("bee") as HTMLElement;

    portals = new Portals(beeElement);
    portals.registerSidePortals();
    portals.startCheckingCollisions();

    bee = new Bee(beeElement, controls);
    setBeeInitialPos();

    bee.start();

    Utils.addValueToSliders();
    // Invoke all modules waiting for main to be ready.
    modules.forEach(module => module());
});

function setBeeInitialPos() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    history.pushState("", document.title, window.location.pathname);

    const beePos = {x: document.body.clientWidth/2 - bee.element.clientWidth/2, y: 0 };
    const offset = 90;

    if (params.from === "left")
        beePos.x = document.body.clientWidth - bee.element.clientWidth - offset;
    else if (params.from === "right")
        beePos.x = offset;

    if (params.from) {
        beePos.y = document.body.clientHeight/2;
        Controls.changePressStateByName("up", params.up === "true");
        Controls.changePressStateByName("left", params.left === "true");
        Controls.changePressStateByName("right", params.right === "true");
        bee.element.style.left = beePos.x + "px";
        bee.element.style.top = beePos.y + "px";
    }
}

/*
// Adds circleVanishing effect to the cursor.
document.addEventListener('mousemove', e => {
    const offset = 33;
    new VanishingCircle(e.x - offset, e.y - offset, 700, 80, 1).show();
});
*/