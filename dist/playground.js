import { ScreenSaverPilot } from "./screenSaverPilot.js";
import { Autopilot } from "./autopilot.js";
import { bee, controls, modules, portals } from "./global.js";
import { getAvailableHeight, getAvailableWidth, htmlToElement, randomIntFromInterval } from "./utils.js";
export var Playground;
(function (Playground) {
    const colorCycling = {
        cyclingUp: true,
        currColorValue: 0,
        intervalId: 0,
        updateFreq: {
            value: 25,
            values: {
                default: 25,
                max: 50,
                min: 1
            }
        }
    };
    const portalGeneration = {
        duration: 5000,
        spawnDelayRange: [10000, 30000]
    };
    let cycleColorButt;
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
        cycleColorButt = document.getElementById("cycle-hue-button");
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        const settingsDiv = document.getElementById("settings-div");
        const settingsMenuContainer = document.getElementById("settings-menu-container");
        const settingsMenuIcon = document.getElementById("settings-menu-icon");
        const cycleSpeedSlider = document.getElementById("cycle-speed-slider");
        ctx.canvas.width = getAvailableWidth();
        ctx.canvas.height = getAvailableHeight();
        canvas.style.position = "absolute";
        addListenersToElements();
        startCyclingColor();
        addSettings(settingsDiv);
        addSetting(cycleSpeedSlider, colorCycling.updateFreq, "Cycle Speed", (value) => {
            stopCyclingColor();
            colorCycling.updateFreq.value = value;
            startCyclingColor();
        }, false);
        setUpSettingsMenu(settingsMenuContainer, settingsMenuIcon);
        if (pilotOrderText)
            pilotOrderText.innerText = "1/3";
        screenSaverPilot = new ScreenSaverPilot(bee, controls);
        autopilot = new Autopilot(bee, controls);
        startGeneratingPortals(canvas);
    }
    function setUpSettingsMenu(menuContainer, menuButton) {
        // If menuContainer bottom is below zero, make it the opposite of the current bottom on menuButtom click.
        menuButton.addEventListener("click", () => {
            if (parseInt(menuContainer.style.bottom.replace("px", "")) < 0)
                menuContainer.style.bottom = "0px";
            else
                menuContainer.style.bottom = -menuContainer.offsetHeight + 50 + "px";
        });
        menuContainer.style.bottom = -menuContainer.offsetHeight + "px";
    }
    function startGeneratingPortals(canvas) {
        portals.generateRandomPortal(portalGeneration.duration, canvas);
        setTimeout(() => {
            startGeneratingPortals(canvas);
        }, randomIntFromInterval(portalGeneration.spawnDelayRange[0], portalGeneration.spawnDelayRange[1]));
    }
    function addListenersToElements() {
        hueSlide.addEventListener("input", (e) => stopCyclingColor());
        autopilotButton.addEventListener("mousedown", (e) => handlePilotButtonClick());
        cycleColorButt.addEventListener("click", (e) => colorCycling.intervalId ? stopCyclingColor() : startCyclingColor());
    }
    function startCyclingColor() {
        if (colorCycling.intervalId)
            return;
        colorCycling.currColorValue = Number(hueSlide.value.replace("px", ""));
        cycleColorButt.classList.replace("off", "on");
        colorCycling.intervalId = setInterval(() => {
            if (colorCycling.currColorValue >= 360)
                colorCycling.cyclingUp = false;
            else if (colorCycling.currColorValue <= 0)
                colorCycling.cyclingUp = true;
            hueSlide.value = (colorCycling.currColorValue += colorCycling.cyclingUp ? 1 : -1) + "";
            bee.circleProps.hue.value = colorCycling.currColorValue;
        }, colorCycling.updateFreq.value);
    }
    function stopCyclingColor() {
        if (!colorCycling.intervalId)
            return;
        clearInterval(colorCycling.intervalId);
        colorCycling.intervalId = 0;
        cycleColorButt.classList.replace("on", "off");
    }
    function addSettings(toElement) {
        const accelerationProps = {
            value: bee.accelerationData.acceleration,
            values: {
                default: bee.accelerationData.acceleration,
                max: 2,
                min: 0.05
            }
        };
        addSetting(toElement, bee.props.deltaTime, "Delta", (value) => {
            bee.props.deltaTime.value = value;
            bee.stop();
            bee.start();
        });
        addSetting(toElement, accelerationProps, "Acceleration", (value) => bee.accelerationData.acceleration = value);
        addSetting(toElement, bee.props.maxSpeed, "Speed");
        addSetting(toElement, bee.circleProps.durationNormal, "Circle Duration");
        addSetting(toElement, bee.circleProps.durationShift, "Circle Duration Shift");
        addSetting(toElement, bee.circleProps.frequency, "Circle Frequency");
        addSetting(toElement, bee.circleProps.size, "Circle Size");
    }
    function addSetting(toElement, props, name, onChange, showValue = true) {
        const setting = createSettingElement(props, showValue, name);
        toElement.appendChild(setting.element);
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
    function createSettingElement(props, showValue, name) {
        const settingDiv = htmlToElement(`<div class="setting"></div>`);
        const nameSpan = htmlToElement(`<span class="setting-name">${name}:</span>`);
        const sliderContainer = htmlToElement(`<span class="slider-container"></span>`);
        const slider = htmlToElement(`<input class="slider small-slider" type="range" step="0.1" min="${props.values.min}" max="${props.values.max}" value="${props.value}">`);
        const sliderValue = htmlToElement(`<span class="slider-value">${props.value}</span>`);
        if (name)
            settingDiv.appendChild(nameSpan);
        settingDiv.appendChild(sliderContainer);
        sliderContainer.appendChild(slider);
        if (showValue)
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