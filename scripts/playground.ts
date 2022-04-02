import {ScreenSaverPilot} from "./screenSaverPilot.js";
import {Autopilot} from "./autopilot.js";
import {bee, controls, modules, portals} from "./global.js";
import {Utils} from "./utils.js";

export module Playground {
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
        spawnDelayRange: {min: 10000, max: 30000}
    };

    type Setting = {
        element: HTMLDivElement;
        parts: {
            slider: HTMLInputElement;
            sliderValue: HTMLSpanElement;
            defaultValue: HTMLSpanElement;
        }
    }

    type SettingProps = {
        name?: string;
        onChange?: (value: number) => void;
        step?: number;
        showValue: boolean;
    }

    const settings: { setting: Setting, props: Utils.ModifiableProp }[] = [];

    let cycleColorButt: HTMLElement;
    let saveSettingsButt: HTMLElement;
    let resetSettingsButt: HTMLElement;
    let settingsSaveConfirmation: HTMLElement;

    let autopilotButtonTextSpan: HTMLElement;
    let autopilotButton: HTMLInputElement;

    let screenSaverPilot: ScreenSaverPilot;
    let autopilot: Autopilot;

    let pilotOrderText: HTMLElement;
    let hueSlide: HTMLInputElement;

    modules.push(() => run());

    function run() {
        // Must initialize it here cuz typescript dumb.
        hueSlide = document.getElementById("hue-slider") as HTMLInputElement;
        autopilotButton = document.getElementById("pilot-button") as HTMLInputElement;
        autopilotButtonTextSpan = document.getElementById("js-pilot-button-text-span") as HTMLElement;
        pilotOrderText = document.getElementById("pilot-order") as HTMLElement;
        cycleColorButt = document.getElementById("cycle-hue-button") as HTMLElement;
        saveSettingsButt = document.getElementById("save-settings-button") as HTMLElement;
        settingsSaveConfirmation = document.getElementById("settings-save-confirmation") as HTMLElement;
        resetSettingsButt = document.getElementById("reset-settings-button") as HTMLElement;

        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        const settingsDiv = document.getElementById("settings-div") as HTMLDivElement;
        const settingsMenuContainer = document.getElementById("settings-menu-container") as HTMLDivElement;
        const settingsMenuIcon = document.getElementById("settings-menu-icon") as HTMLElement;
        const cycleSpeedSlider = document.getElementById("cycle-speed-slider") as HTMLElement;

        ctx.canvas.width  = Utils.getAvailableWidth();
        ctx.canvas.height = Utils.getAvailableHeight();
        canvas.style.position = "absolute";


        addListenersToElements();
        startCyclingColor();
        addSettings(settingsDiv);

        const onHueValueChange = (value: number) => {
            stopCyclingColor();
            colorCycling.updateFreq.value = value;
            startCyclingColor();
        };
        addSetting(cycleSpeedSlider, colorCycling.updateFreq, {name: "Cycle Speed", showValue: false, onChange: onHueValueChange});
        setUpSettingsMenu(settingsMenuContainer, settingsMenuIcon);

        if (pilotOrderText)
            pilotOrderText.innerText = "1/3";

        screenSaverPilot = new ScreenSaverPilot(bee, controls);
        autopilot = new Autopilot(bee, controls);
        startGeneratingPortals(canvas);
    }

    function setUpSettingsMenu(menuContainer: HTMLDivElement, menuButton: HTMLElement) {
        // If menuContainer bottom is below zero, make it the opposite of the current bottom on menuButtom click.
        menuButton.addEventListener("click", () => toggleSettingsMenu(menuContainer));
        document.addEventListener("keypress", (e) => {
            if (e.key.toLowerCase() === "q")
                toggleSettingsMenu(menuContainer);
        });
        menuContainer.style.bottom = -menuContainer.offsetHeight + "px";
    }

    function toggleSettingsMenu(menuContainer: HTMLDivElement) {
        if (parseInt(menuContainer.style.bottom) < 0)
            menuContainer.style.bottom = "0px";
        else
            menuContainer.style.bottom = -menuContainer.offsetHeight + 50 + "px";
    }

    function startGeneratingPortals(canvas: HTMLCanvasElement) {
        portals.generateRandomPortal(portalGeneration.duration, canvas);
        setTimeout(
            () => startGeneratingPortals(canvas),
            Utils.randomIntFromInterval(portalGeneration.spawnDelayRange.min, portalGeneration.spawnDelayRange.max));
    }

    function addListenersToElements() {
        hueSlide.addEventListener("input", (e) => {
            stopCyclingColor();
            bee.circleProps.hue.value = parseInt(hueSlide.value);
        });
        autopilotButton.addEventListener("mousedown", (e) => handlePilotButtonClick());
        cycleColorButt.addEventListener("click", (e) => colorCycling.intervalId ? stopCyclingColor() : startCyclingColor());
        saveSettingsButt.addEventListener("click", (e) => {
            bee.saveCurrentSettings();
            Utils.resetAnimation(settingsSaveConfirmation);
        });
        resetSettingsButt.addEventListener("click", (e) => {
            bee.resetSettings();
            settings.forEach(setting => {
                setting.setting.parts.sliderValue.innerText = setting.props.value + "";
                setting.setting.parts.slider.value = setting.props.value + "";
            });
            bee.stop();
            bee.start();
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

    function addSettings(toElement: HTMLElement) {
        const onDeltaChange = (value: number) => {
            bee.props.deltaTime.value = value;
            bee.stop();
            bee.start();
        };

        addSetting(toElement, bee.props.deltaTime, {name: "Delta", showValue: true, onChange: onDeltaChange});
        addSetting(toElement, bee.accelerationData.acceleration, {name: "Acceleration", showValue: true, step: 0.01 });
        addSetting(toElement, bee.props.maxSpeed, {name: "Speed", showValue: true});
        addSetting(toElement, bee.circleProps.durationNormal, {name: "Circle Duration", showValue: true});
        addSetting(toElement, bee.circleProps.durationShift, {name: "Cirlce Duration Shift", showValue: true});
        addSetting(toElement, bee.circleProps.frequency, {name: "Circle Frequency", showValue: true});
        addSetting(toElement, bee.circleProps.size, {name: "Circle Size", showValue: true});
    }

    function addSetting(toElement: HTMLElement, props: Utils.ModifiableProp, {step = 1, ...rest}: SettingProps) {
        const setting = createSettingElement(props, {step, ...rest});
        toElement.appendChild(setting.element);

        setting.parts.slider.addEventListener("input", (e) => handleSettingValueChange(setting, props, rest.onChange));
        setting.parts.defaultValue.addEventListener("click", (e) => {
            setting.parts.slider.value = props.values.default + "";
            handleSettingValueChange(setting, props, rest.onChange);
        });
        settings.push({setting: setting, props: props});
    }

    function handleSettingValueChange(setting: Setting, props: Utils.ModifiableProp, onChange?: (value: number) => void) {
        if (onChange)
            onChange(parseFloat(setting.parts.slider.value));
        else
            props.value = parseFloat(setting.parts.slider.value);

        setting.parts.sliderValue.innerText = setting.parts.slider.value;
    }

    function createSettingElement(props: Utils.ModifiableProp, {step, showValue, name}: SettingProps): Setting {
        const settingDiv = Utils.htmlToElement(`<div class="setting"></div>`) as HTMLDivElement;
        const nameSpan = Utils.htmlToElement(`<span class="setting-name">${name}:</span>`) as HTMLSpanElement;
        const sliderContainer = Utils.htmlToElement(`<span class="slider-container"></span>`) as HTMLSpanElement;
        const slider = Utils.htmlToElement(`<input class="slider small-slider" type="range" step="${step}" min="${props.values.min}" max="${props.values.max}" value="${props.value}">`) as HTMLInputElement;
        const sliderValue = Utils.htmlToElement(`<span class="slider-value">${props.value}</span>`) as HTMLSpanElement;
        const defaultValue = Utils.htmlToElement(`<span class="default-value"> (default: ${props.values.default})</span>`) as HTMLSpanElement;

        if (name)
            settingDiv.appendChild(nameSpan);
        settingDiv.appendChild(sliderContainer);
        sliderContainer.appendChild(slider);
        if (showValue) {
            sliderContainer.appendChild(sliderValue);
            sliderContainer.appendChild(defaultValue);
        }

        return { element: settingDiv, parts: { slider, sliderValue, defaultValue } };
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
                    bee.accelerationData.acceleration.value += screenSaverAccelerationIncrease;
                    bee.props.maxSpeed.value -= screenSaverSpeedDecrease;
                    controls.ignoreUserInput = true;
                    pilotOrderText.innerText = "3/" + modes;
                    break;
                case screenSaverOn:
                    screenSaverPilot.stop();
                    portals.setTargetPortalsDisplay(true);
                    bee.accelerationData.acceleration.value -= screenSaverAccelerationIncrease;
                    bee.props.maxSpeed.value += screenSaverSpeedDecrease;
                    autopilotButtonTextSpan.innerHTML = autoPilotOff;
                    controls.ignoreUserInput = false;
                    pilotOrderText.innerText = "1/" + modes;
                    break;
            }
        }
    }
}