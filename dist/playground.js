import { ScreenSaverPilot } from "./screenSaverPilot.js";
import { Autopilot } from "./autopilot.js";
import { bee, controls, modules, portals } from "./global.js";
import { getAvailableHeight, getAvailableWidth, htmlToElement, randomIntFromInterval } from "./utils.js";
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
    let settingsDiv;
    let autopilotButtonTextSpan;
    let autopilotButton;
    let screenSaverPilot;
    let autopilot;
    let pilotOrderText;
    let hueSlide;
    modules.push(() => run());
    function run() {
        // Must initialize it here cuz typescript dumb.
        hueSlide = document.getElementById("hue-slider");
        autopilotButton = document.getElementById("pilot-button");
        autopilotButtonTextSpan = document.getElementById("js-pilot-button-text-span");
        pilotOrderText = document.getElementById("pilot-order");
        canvas = document.getElementById("canvas");
        settingsDiv = document.getElementById("settings-div");
        const ctx = canvas.getContext("2d");
        ctx.canvas.width = getAvailableWidth();
        ctx.canvas.height = getAvailableHeight();
        canvas.style.position = "absolute";
        addListenersToElements();
        addSettings();
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
                return bee.circleProps.hue.value = parseInt(hueSlide.value);
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
            bee.circleProps.hue.value = colorCycling.currColorValue;
        }, colorCycling.updateFreq);
        if (autopilotButton === null)
            return;
        autopilotButton.addEventListener("mousedown", (e) => handlePilotButtonClick());
    }
    function addSettings() {
        const accelerationProps = {
            value: bee.accelerationData.acceleration,
            values: {
                default: bee.accelerationData.acceleration,
                max: 2,
                min: 0.05
            }
        };
        addSetting("Delta", bee.props.deltaTime, (value) => {
            bee.props.deltaTime.value = value;
            bee.stop();
            bee.start();
        });
        addSetting("Acceleration", accelerationProps, (value) => bee.accelerationData.acceleration = value);
        addSetting("Speed", bee.props.maxSpeed);
        addSetting("Circle Duration", bee.circleProps.durationNormal);
        addSetting("Circle Duration Shift", bee.circleProps.durationShift);
        addSetting("Circle Frequency", bee.circleProps.frequency);
        addSetting("Circle Size", bee.circleProps.size);
    }
    function addSetting(name, props, onChange) {
        const setting = createSettingElement(name, props);
        settingsDiv.appendChild(setting.element);
        setting.parts.slider.addEventListener("input", (e) => handleSettingValueChange(setting, props, onChange));
    }
    function handleSettingValueChange(setting, props, onChange) {
        if (onChange)
            onChange(parseFloat(setting.parts.slider.value));
        else
            props.value = parseFloat(setting.parts.slider.value);
        setting.parts.sliderValue.innerText = setting.parts.slider.value;
        console.log(setting.parts.slider.value);
    }
    function createSettingElement(name, props) {
        const settingDiv = htmlToElement(`<div class="setting"></div>`);
        const nameSpan = htmlToElement(`<span>${name}:</span>`);
        const sliderContainer = htmlToElement(`<span class="slider-container"></span>`);
        const slider = htmlToElement(`<input class="slider small-slider" type="range" step="0.1" min="${props.values.min}" max="${props.values.max}" value="${props.value}">`);
        const sliderValue = htmlToElement(`<span class="slider-value">${props.value}</span>`);
        settingDiv.appendChild(nameSpan);
        settingDiv.appendChild(sliderContainer);
        sliderContainer.appendChild(slider);
        sliderContainer.appendChild(sliderValue);
        return { element: settingDiv, parts: { slider, sliderValue } };
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
                    bee.props.maxSpeed.value -= majaBeeSpeedDecrease;
                    break;
                case majaBeeOn:
                    autopilotButtonTextSpan.innerHTML = screenSaverOn;
                    portals.setTargetPortalsDisplay(false);
                    autopilot.stop();
                    screenSaverPilot.start();
                    bee.props.maxSpeed.value += majaBeeSpeedDecrease;
                    bee.accelerationData.acceleration += screenSaverAccelerationIncrease;
                    bee.props.maxSpeed.value -= screenSaverSpeedDecrease;
                    controls.ignoreUserInput = true;
                    pilotOrderText.innerText = "3/" + modes;
                    break;
                case screenSaverOn:
                    screenSaverPilot.stop();
                    portals.setTargetPortalsDisplay(true);
                    bee.accelerationData.acceleration -= screenSaverAccelerationIncrease;
                    bee.props.maxSpeed.value += screenSaverSpeedDecrease;
                    autopilotButtonTextSpan.innerHTML = autoPilotOff;
                    controls.ignoreUserInput = false;
                    pilotOrderText.innerText = "1/" + modes;
                    break;
            }
        }
    }
})(Playground || (Playground = {}));
//# sourceMappingURL=playground.js.map