import { ScreenSaverPilot } from "./screenSaverPilot.js";
import { Autopilot } from "./autopilot.js";
import { bee, controls, modules, portals } from "./global.js";
import { getAvailableHeight, getAvailableWidth, randomIntFromInterval } from "./utils.js";
export var Playground;
(function (Playground) {
    const colorCycling = {
        cyclingCircleColor: true,
        cycleUp: true,
        currColorValue: 0,
        updateFreq: 25
    };
    const portalGeneration = {
        duration: 5000,
        spawnDelayRange: [10000, 30000]
    };
    let canvas;
    let autopilotButtonTextSpan;
    let autopilotButton;
    let pilotOrderText;
    let hueSlide;
    let screenSaverPilot;
    let autopilot;
    modules.push(() => run());
    function run() {
        // Must initialize it here cuz typescript dumb.
        hueSlide = document.getElementById("hue-slider");
        autopilotButton = document.getElementById("pilot-button");
        autopilotButtonTextSpan = document.getElementById("js-pilot-button-text-span");
        pilotOrderText = document.getElementById("pilot-order");
        canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        ctx.canvas.width = getAvailableWidth();
        ctx.canvas.height = getAvailableHeight();
        canvas.style.position = "absolute";
        addListenersToElements();
        if (pilotOrderText)
            pilotOrderText.innerText = "1/3";
        screenSaverPilot = new ScreenSaverPilot(bee, controls);
        autopilot = new Autopilot(bee, controls);
        startGeneratingPortals();
    }
    function startGeneratingPortals() {
        portals.generateRandomPortal(portalGeneration.duration, canvas);
        setTimeout(() => {
            startGeneratingPortals();
        }, randomIntFromInterval(portalGeneration.spawnDelayRange[0], portalGeneration.spawnDelayRange[1]));
    }
    function addListenersToElements() {
        if (hueSlide !== null) {
            hueSlide.addEventListener("input", (e) => {
                colorCycling.cyclingCircleColor = false;
                return bee.circle.hue = parseInt(hueSlide.value);
            });
        }
        const id = setInterval(() => {
            if (!colorCycling.cyclingCircleColor) {
                clearInterval(id);
                return;
            }
            if (colorCycling.currColorValue >= 360)
                colorCycling.cycleUp = false;
            else if (colorCycling.currColorValue <= 0)
                colorCycling.cycleUp = true;
            hueSlide.value = (colorCycling.currColorValue += colorCycling.cycleUp ? 1 : -1) + "";
            bee.circle.hue = colorCycling.currColorValue;
        }, colorCycling.updateFreq);
        if (autopilotButton === null)
            return;
        autopilotButton.addEventListener("mousedown", (e) => handlePilotButtonClick());
    }
    function handlePilotButtonClick() {
        {
            const autoPilotOff = "Autopilot OFF";
            const majaBeeOn = "Včelka mája ON";
            const screenSaverOn = "Screen Saver ON";
            const screenSaverAccelerationIncrease = 0.3;
            const screenSaverSpeedDecrease = 3;
            const majaBeeSpeedDecrease = 1;
            const modes = 3;
            autopilotButtonTextSpan.innerHTML = autopilotButtonTextSpan.innerHTML.trim();
            switch (autopilotButtonTextSpan.innerHTML) {
                case autoPilotOff:
                    autopilotButtonTextSpan.innerHTML = majaBeeOn;
                    portals.setTargetPortalsDisplay(false);
                    autopilot.start();
                    controls.ignoreUserInput = true;
                    pilotOrderText.innerText = "2/" + modes;
                    bee.maxSpeed -= majaBeeSpeedDecrease;
                    break;
                case majaBeeOn:
                    autopilotButtonTextSpan.innerHTML = screenSaverOn;
                    portals.setTargetPortalsDisplay(false);
                    autopilot.stop();
                    screenSaverPilot.start();
                    bee.maxSpeed += majaBeeSpeedDecrease;
                    bee.accelerationData.acceleration += screenSaverAccelerationIncrease;
                    bee.maxSpeed -= screenSaverSpeedDecrease;
                    controls.ignoreUserInput = true;
                    pilotOrderText.innerText = "3/" + modes;
                    break;
                case screenSaverOn:
                    screenSaverPilot.stop();
                    portals.setTargetPortalsDisplay(true);
                    bee.accelerationData.acceleration -= screenSaverAccelerationIncrease;
                    bee.maxSpeed += screenSaverSpeedDecrease;
                    autopilotButtonTextSpan.innerHTML = autoPilotOff;
                    controls.ignoreUserInput = false;
                    pilotOrderText.innerText = "1/" + modes;
                    break;
            }
        }
    }
})(Playground || (Playground = {}));
//# sourceMappingURL=playground.js.map