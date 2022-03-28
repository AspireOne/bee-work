import {Autopilot} from "./autopilot.js";
import {Bee} from "./bee.js";
import {ScreenSaverPilot} from "./screenSaverPilot.js";
import {Controls} from "./controls.js";
import {Portals} from "./portals.js";
import {getAvailableHeight, getAvailableWidth} from "./utils.js";

export let controls = new Controls();
export let canvas: HTMLCanvasElement;
export let ctx: CanvasRenderingContext2D;
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
    canvas = document.getElementById("canvas") as HTMLCanvasElement;
    ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    ctx.canvas.width  = getAvailableWidth();
    ctx.canvas.height = getAvailableHeight();
    canvas.style.position = "absolute";

    portals = new Portals(beeElement);
    portals.getPortalsFromDoc().forEach(portal => portals.addPortal(portal, null));
    portals.startChecking();

    bee = new Bee(beeElement, controls);
    bee.start();

    // Invoke all modules waiting for main to be ready.
    modules.forEach(module => module());
});

function htmlToElement(html: string): HTMLElement {
    const template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result.
    template.innerHTML = html;
    return template.content.firstChild as HTMLElement;
}

function htmlToElements(html: string): HTMLElement[] {
    const template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result.
    template.innerHTML = html;
    return Array.from(template.content.childNodes).map(node => node as HTMLElement);
}

/*
// Adds circleVanishing effect to the cursor.
document.addEventListener('mousemove', e => {
    const offset = 33;
    new VanishingCircle(e.x - offset, e.y - offset, 700, 80, 1).show();
});
*/