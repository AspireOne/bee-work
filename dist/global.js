import { Bee } from "./bee.js";
import { Controls } from "./controls.js";
import { Portals } from "./portals.js";
import { htmlToElement, addValueToSliders } from "./utils.js";
export let controls = new Controls();
export let bee;
export let portals;
export const modules = [];
const beeElementHTML = `
        <div>
            <p id="bee-text"></p>
            <img src="../resources/bee.png" draggable="false" class="unselectable" id="bee"/>
        </div>
    `;
document.addEventListener("DOMContentLoaded", _ => {
    document.body.appendChild(htmlToElement(beeElementHTML));
    const beeElement = document.getElementById("bee");
    portals = new Portals(beeElement);
    portals.getSidePortalsFromDoc().forEach(portal => portals.addPortal(portal, null));
    portals.startChecking();
    bee = new Bee(beeElement, controls);
    bee.start();
    addValueToSliders();
    // Invoke all modules waiting for main to be ready.
    modules.forEach(module => module());
});
/*
// Adds circleVanishing effect to the cursor.
document.addEventListener('mousemove', e => {
    const offset = 33;
    new VanishingCircle(e.x - offset, e.y - offset, 700, 80, 1).show();
});
*/ 
//# sourceMappingURL=global.js.map