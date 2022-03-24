import { Autopilot } from "./autopilot.js";
import { Bee } from "./bee.js";
import { ScreenSaverPilot } from "./screenSaverPilot.js";
import { Controls } from "./controls.js";
var Program;
(function (Program) {
    let controls = new Controls();
    let autopilotButtonTextSpan;
    let autopilotButton;
    let pilotOrderText;
    let hueSlide;
    let circle;
    let screenSaverPilot;
    let autopilot;
    let bee;
    //#region event listeners.
    document.addEventListener("DOMContentLoaded", _ => {
        initElements();
        addListenersToElements();
        if (pilotOrderText !== null)
            pilotOrderText.innerText = "1/3";
        bee = new Bee(circle, controls);
        screenSaverPilot = new ScreenSaverPilot(bee, controls);
        autopilot = new Autopilot(bee, controls);
        bee.start();
        //setTimeout(() => window.location.replace("http://localhost:63342/bee-main/playground.html?_ijt=j10bok8nb763g23ebmqkghl0oh&_ij_reload=RELOAD_ON_SAVE"), 5000)
    });
    function initElements() {
        circle = document.getElementById("js-rect");
        hueSlide = document.getElementById("hue-slide");
        autopilotButton = document.getElementById("autopilot-button");
        autopilotButtonTextSpan = document.getElementById("js-autopilot-button-text-span");
        pilotOrderText = document.getElementById("pilot-order");
    }
    /*
    // Adds circleVanishing effect to the cursor.
    document.addEventListener('mousemove', e => {
        const offset = 33;
        new VanishingCircle(e.x - offset, e.y - offset, 700, 80, 1).show();
    });
    */
    function addListenersToElements() {
        if (hueSlide !== null)
            hueSlide.addEventListener("input", (e) => bee.circleHue = parseInt(hueSlide.value));
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
                    autopilot.start();
                    controls.ignoreUserInput = true;
                    pilotOrderText.innerText = "2/" + modes;
                    bee.maxSpeed -= majaBeeSpeedDecrease;
                    break;
                case majaBeeOn:
                    autopilotButtonTextSpan.innerHTML = screenSaverOn;
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
                    bee.accelerationData.acceleration -= screenSaverAccelerationIncrease;
                    bee.maxSpeed += screenSaverSpeedDecrease;
                    autopilotButtonTextSpan.innerHTML = autoPilotOff;
                    controls.ignoreUserInput = false;
                    pilotOrderText.innerText = "1/" + modes;
                    break;
            }
        }
    }
})(Program || (Program = {}));
//# sourceMappingURL=main.js.map