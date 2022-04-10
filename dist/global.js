import { Bee } from "./bee.js";
import { Controls } from "./controls.js";
import { Portals } from "./portals.js";
import { Utils } from "./utils.js";
export const modules = [];
export const controls = new Controls();
export let portals;
export let bee;
const beeElementHTML = `
        <div>
            <p id="bee-text"></p>
            <img src="../resources/bee.png" draggable="false" class="unselectable" id="bee"/>
        </div>
    `;
// Get them as soon as possible.
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
if (params.from) {
    for (let key in params)
        Controls.changePressStateByName(key, params[key] === "true");
}
history.pushState("", document.title, window.location.pathname);
//document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener("DOMContentLoaded", _ => {
    document.body.appendChild(Utils.htmlToElement(beeElementHTML));
    const beeElement = document.getElementById("bee");
    portals = new Portals(beeElement);
    portals.registerSidePortals();
    portals.startCheckingCollisions();
    bee = new Bee(beeElement, controls);
    const pos = getBeeInitialPos(params);
    bee.element.style.left = pos.x + "px";
    bee.element.style.top = pos.y + "px";
    bee.start();
    Utils.addValueToSliders();
    // Invoke all modules waiting for main to be ready.
    modules.forEach(module => module());
});
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
// Adds circleVanishing effect to the cursor.
/*document.addEventListener('mousemove', e => {
    const offset = 33;
    new VanishingCircle({x: e.x - offset, y: e.y - offset}, {duration: 700, size: 80}).show();
});*/
//# sourceMappingURL=global.js.map