var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { ScreenSaverPilot } from "../pilots/screenSaverPilot.js";
import { Autopilot } from "../pilots/autopilot.js";
import { bee, controls, modules, portals } from "../global.js";
import { Utils } from "../utils.js";
import { Pencil } from "../pencil.js";
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
        spawnDelayRange: { min: 10000, max: 30000 }
    };
    const settings = [];
    let pencil;
    let pencilIcon;
    let cycleColorButt;
    let saveSettingsButt;
    let resetSettingsButt;
    let settingsSaveButtonText;
    let autopilotButtonTextSpan;
    let autopilotButton;
    let screenSaverPilot;
    let autopilot;
    let pilotOrderText;
    let hueSlide;
    modules.push(run);
    function run() {
        // Must initialize it here cuz typescript dumb.
        hueSlide = document.getElementById("hue-slider");
        autopilotButton = document.getElementById("pilot-button");
        autopilotButtonTextSpan = document.getElementById("js-pilot-button-text-span");
        pilotOrderText = document.getElementById("pilot-order");
        cycleColorButt = document.getElementById("cycle-hue-button");
        saveSettingsButt = document.getElementById("save-settings-button");
        settingsSaveButtonText = document.getElementById("save-settings-button-text");
        resetSettingsButt = document.getElementById("reset-settings-button");
        pencilIcon = document.getElementById("pencil");
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext("2d");
        const settingsBee = document.getElementById("settings-bee");
        const settingsCircle = document.getElementById("settings-bee-circle");
        const settingsMenuContainer = document.getElementById("settings-menu-container");
        const settingsMenu = document.getElementById("settings-menu");
        const settingsMenuIcon = document.getElementById("settings-menu-icon");
        const cycleSpeedSlider = document.getElementById("cycle-speed-slider");
        const drawOverlay = document.getElementById("draw-canvas");
        const pencilSpeedSlider = document.getElementById("pencil-speed-slider");
        pencil = new Pencil(drawOverlay, bee.circleProps, () => pencilIcon.classList.remove("on"));
        ctx.canvas.width = document.body.clientWidth;
        ctx.canvas.height = document.body.clientHeight;
        canvas.style.position = "absolute";
        addListenersToElements();
        startCyclingColor();
        addSettings(settingsBee, settingsCircle);
        const onHueCyclingSpeedChange = (value) => {
            stopCyclingColor();
            colorCycling.updateFreq.value = value;
            startCyclingColor();
        };
        addSetting(cycleSpeedSlider, colorCycling.updateFreq, { name: "Cycle Speed", showValue: false, onChange: onHueCyclingSpeedChange });
        addSetting(pencilSpeedSlider, pencil.speed, { name: "Drawing Speed", showValue: false, onChange: (value) => pencil.changeSpeed(value) });
        setUpSettingsMenu(settingsMenuContainer, settingsMenu, settingsMenuIcon);
        if (pilotOrderText)
            pilotOrderText.innerText = "1/3";
        screenSaverPilot = new ScreenSaverPilot(bee, controls);
        autopilot = new Autopilot(bee, controls);
        startGeneratingPortals(canvas);
    }
    function setUpSettingsMenu(menuContainer, menu, menuButton) {
        // If menuContainer bottom is below zero, make it the opposite of the current bottom on menuButtom click.
        menuButton.addEventListener("click", () => toggleSettingsMenu(menuContainer, menu));
        document.addEventListener("keypress", (e) => {
            if (e.key.toLowerCase() === "q")
                toggleSettingsMenu(menuContainer, menu);
        });
        toggleSettingsMenu(menuContainer, menu);
    }
    function toggleSettingsMenu(menuContainer, menu) {
        if (parseInt(menuContainer.style.bottom) < 0)
            menuContainer.style.bottom = "0px";
        else
            menuContainer.style.bottom = -menu.offsetHeight + "px";
    }
    function startGeneratingPortals(canvas) {
        portals.generateRandomPortal(portalGeneration.duration, canvas, bee);
        setTimeout(() => startGeneratingPortals(canvas), Utils.randomIntFromInterval(portalGeneration.spawnDelayRange.min, portalGeneration.spawnDelayRange.max));
    }
    function addListenersToElements() {
        autopilotButton.addEventListener("mousedown", (e) => handlePilotButtonClick());
        cycleColorButt.addEventListener("click", (e) => colorCycling.intervalId ? stopCyclingColor() : startCyclingColor());
        hueSlide.addEventListener("input", (e) => {
            stopCyclingColor();
            bee.circleProps.hue.value = parseInt(hueSlide.value);
        });
        pencilIcon.addEventListener("click", () => {
            if (pencil.running) {
                pencilIcon.classList.remove("on");
                pencil.stop();
            }
            else {
                pencilIcon.classList.add("on");
                pencil.start();
            }
        });
        let timeoutSet = false;
        saveSettingsButt.addEventListener("click", (e) => {
            bee.saveProps();
            const prevText = settingsSaveButtonText.innerText;
            const newText = saveSettingsButt.classList.contains("saved") ? "Already Saved" : "Saved!";
            saveSettingsButt.classList.replace("unsaved", "saved");
            if (!timeoutSet) {
                timeoutSet = true;
                settingsSaveButtonText.innerText = newText;
                setTimeout(() => {
                    settingsSaveButtonText.innerText = prevText;
                    timeoutSet = false;
                }, 1000);
            }
            //Utils.resetAnimation(settingsSaveConfirmation);
        });
    }
    function startCyclingColor() {
        if (colorCycling.intervalId)
            return;
        colorCycling.currColorValue = parseInt(hueSlide.value);
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
    function addSettings(settingsBee, settingsCircle) {
        addSetting(settingsBee, bee.props.maxSpeed, { name: "Speed", showValue: true });
        addSetting(settingsBee, bee.acceleration.acceleration, { name: "Acceleration", showValue: true });
        addSetting(settingsCircle, bee.circleProps.durationNormal, { name: "Duration", showValue: true, unit: "ms" });
        addSetting(settingsCircle, bee.circleProps.durationShift, { name: "Duration Shift / Drawing", showValue: true, unit: "ms" });
        //addSetting(settingsCircle, bee.circleProps.frequency, {name: "Frequency", showValue: true, unit: "ms/circle"});
        addSetting(settingsCircle, bee.circleProps.size, { name: "Size", showValue: true, unit: "px" });
    }
    function addSetting(toElement, props, _a) {
        var { step = 1 } = _a, rest = __rest(_a, ["step"]);
        const setting = createSettingElement(props, Object.assign({ step }, rest));
        toElement.appendChild(setting.element);
        setting.parts.slider.addEventListener("input", (e) => handleSettingValueChange(setting, props, rest.onChange));
        [setting.parts.defaultValue, resetSettingsButt].forEach((el) => el.addEventListener("click", (e) => {
            if (setting.parts.slider.value !== props.values.default + "") {
                setting.parts.slider.value = props.values.default + "";
                handleSettingValueChange(setting, props, rest.onChange);
            }
        }));
        settings.push({ setting: setting, props: props });
    }
    function handleSettingValueChange(setting, props, onChange) {
        if (onChange)
            onChange(parseFloat(setting.parts.slider.value));
        else
            props.value = parseFloat(setting.parts.slider.value);
        setting.parts.sliderValue.innerText = setting.parts.slider.value;
        saveSettingsButt.classList.replace("saved", "unsaved");
    }
    function createSettingElement(props, { step, showValue, unit, name }) {
        const settingDiv = Utils.htmlToElement(`<div class="setting"></div>`);
        const nameSpan = Utils.htmlToElement(`<span class="setting-name">${name}:</span>`);
        const sliderContainer = Utils.htmlToElement(`<span class="slider-container"></span>`);
        const slider = Utils.htmlToElement(`<input class="slider small-slider" type="range" step="${step}" min="${props.values.min}" max="${props.values.max}" value="${props.value}">`);
        const sliderValue = Utils.htmlToElement(`<span class="slider-value">${props.value}</span>`);
        const sliderUnit = Utils.htmlToElement(`<span class="slider-unit"> ${unit !== null && unit !== void 0 ? unit : ""}</span>`);
        const defaultValue = Utils.htmlToElement(`<span class="default-value"> (default: ${props.values.default})</span>`);
        if (name)
            settingDiv.appendChild(nameSpan);
        settingDiv.appendChild(sliderContainer);
        sliderContainer.appendChild(slider);
        if (showValue) {
            sliderContainer.appendChild(sliderValue);
            sliderContainer.appendChild(sliderUnit);
            sliderContainer.appendChild(defaultValue);
        }
        return { element: settingDiv, parts: { slider, sliderValue, defaultValue } };
    }
    function handlePilotButtonClick() {
        {
            const autoPilotOff = "Autopilot OFF";
            const majaBeeOn = "Včelka mája ON";
            const screenSaverOn = "Screen Saver ON";
            // TODO: Make this non-retarded.
            const screenSaverAccelerationIncrease = 0.3;
            const screenSaverSpeedDecrease = 3;
            const majaBeeSpeedDecrease = 1;
            const modes = 3;
            // TODO: FIx autopilot.
            autopilotButtonTextSpan.innerHTML = autopilotButtonTextSpan.innerHTML.trim();
            switch (autopilotButtonTextSpan.innerHTML) {
                case autoPilotOff:
                    autopilotButtonTextSpan.innerHTML = majaBeeOn;
                    portals.setSidePortalsDisplay(false);
                    autopilot.start();
                    controls.ignoreUserInput = true;
                    pilotOrderText.innerText = "2/" + modes;
                    bee.props.maxSpeed.value -= majaBeeSpeedDecrease;
                    break;
                case majaBeeOn:
                    autopilotButtonTextSpan.innerHTML = screenSaverOn;
                    portals.setSidePortalsDisplay(false);
                    autopilot.stop();
                    screenSaverPilot.start();
                    bee.props.maxSpeed.value += majaBeeSpeedDecrease;
                    bee.acceleration.acceleration.value += screenSaverAccelerationIncrease;
                    bee.props.maxSpeed.value -= screenSaverSpeedDecrease;
                    controls.ignoreUserInput = true;
                    pilotOrderText.innerText = "3/" + modes;
                    break;
                case screenSaverOn:
                    screenSaverPilot.stop();
                    portals.setSidePortalsDisplay(true);
                    bee.acceleration.acceleration.value -= screenSaverAccelerationIncrease;
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