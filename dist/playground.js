import { ScreenSaverPilot } from "./screenSaverPilot.js";
import { Autopilot } from "./autopilot.js";
import { bee, controls, modules, portals } from "./global.js";
import { randomIntFromInterval } from "./utils.js";
export var Playground;
(function (Playground) {
    let cyclingCircleColor = true;
    let cycleUp = true;
    let currValue = 0;
    let portal;
    let autopilotButtonTextSpan;
    let autopilotButton;
    let pilotOrderText;
    let hueSlide;
    let screenSaverPilot;
    let autopilot;
    modules.push(() => run());
    function run() {
        // Must initialize it here cuz typescript dumb.
        hueSlide = document.getElementById("hue-slide");
        autopilotButton = document.getElementById("autopilot-button");
        autopilotButtonTextSpan = document.getElementById("js-autopilot-button-text-span");
        pilotOrderText = document.getElementById("pilot-order");
        portal = document.getElementById("portal");
        addListenersToElements();
        if (pilotOrderText)
            pilotOrderText.innerText = "1/3";
        screenSaverPilot = new ScreenSaverPilot(bee, controls);
        autopilot = new Autopilot(bee, controls);
        startGeneratingPortals();
    }
    function startGeneratingPortals() {
        portals.generateRandomPortal(5000);
        setTimeout(() => {
            startGeneratingPortals();
        }, randomIntFromInterval(10000, 11000));
    }
    function addListenersToElements() {
        if (hueSlide !== null) {
            hueSlide.addEventListener("input", (e) => {
                cyclingCircleColor = false;
                return bee.circleHue = parseInt(hueSlide.value);
            });
        }
        const id = setInterval(() => {
            if (!cyclingCircleColor) {
                clearInterval(id);
                return;
            }
            if (currValue >= 360)
                cycleUp = false;
            else if (currValue <= 0)
                cycleUp = true;
            hueSlide.value = (currValue += cycleUp ? 1 : -1) + "";
            bee.circleHue = currValue;
        }, 25);
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