import {Autopilot} from "./autopilot.js";
import {Bee} from "./bee.js";
import {ScreenSaverPilot} from "./screenSaverPilot.js";
import {Controls} from "./controls.js";
import {Portals} from "./portals.js";
import {getAvailableHeight, getAvailableWidth} from "./utils.js";

export let controls = new Controls();
export let beeElement: HTMLElement;
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

document.addEventListener("DOMContentLoaded", _ => {
    document.body.appendChild(htmlToElement(beeElementHTML));
    beeElement = document.getElementById("bee") as HTMLElement;

    portals = new Portals(beeElement);
    portals.getSidePortalsFromDoc().forEach(portal => portals.addPortal(portal, null));
    portals.startChecking();

    bee = new Bee(beeElement, controls);
    bee.start();

    addValueToSliders();
    // Invoke all modules waiting for main to be ready.
    modules.forEach(module => module());
});

function addValueToSliders() {
    const containers = document.getElementsByClassName("slider-container");
    for (let i = 0; i < containers.length; i++) {
        const container = containers[i] as HTMLDivElement;
        // Find child node with tag p and make text red.
        const text = container.getElementsByTagName("span")[0] as HTMLParagraphElement;
        const slider = container.getElementsByClassName("slider")[0] as HTMLInputElement;
        if (!text || !slider)
            continue;

        slider.addEventListener("input", _ => text.innerText = slider.value);
        text.innerText = slider.value;
    }
}

function htmlToElement(html: string): HTMLElement {
    const template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result.
    template.innerHTML = html;
    return template.content.firstChild as HTMLElement;
}

/*
// Adds circleVanishing effect to the cursor.
document.addEventListener('mousemove', e => {
    const offset = 33;
    new VanishingCircle(e.x - offset, e.y - offset, 700, 80, 1).show();
});
*/