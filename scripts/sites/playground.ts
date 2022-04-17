import {ScreenSaverPilot} from "../pilots/screenSaverPilot.js";
import {Autopilot} from "../pilots/autopilot.js";
import {bee, controls, modules, portals} from "../global.js";
import {Utils} from "../utils.js";
import {Types} from "../types.js";
import {Pencil} from "../pencil.js";
import {Bee} from "../bee.js";

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
        unit?: string;
        showValue: boolean;
    }

    const settings: { setting: Setting, props: Types.ModifiableProp }[] = [];

    let pencil: Pencil;

    let pencilIcon: HTMLElement;
    let cycleColorButt: HTMLElement;
    let saveSettingsButt: HTMLElement;
    let resetSettingsButt: HTMLElement;
    let settingsSaveButtonText: HTMLSpanElement;

    let autopilotButtonTextSpan: HTMLElement;
    let autopilotButton: HTMLInputElement;

    let screenSaverPilot: ScreenSaverPilot;
    let autopilot: Autopilot;

    let pilotOrderText: HTMLElement;
    let hueSlide: HTMLInputElement;

    modules.push(run);

    function run() {
        // Must initialize it here cuz typescript dumb.
        hueSlide = document.getElementById("hue-slider") as HTMLInputElement;
        autopilotButton = document.getElementById("pilot-button") as HTMLInputElement;
        autopilotButtonTextSpan = document.getElementById("js-pilot-button-text-span") as HTMLElement;
        pilotOrderText = document.getElementById("pilot-order") as HTMLElement;
        cycleColorButt = document.getElementById("cycle-hue-button") as HTMLElement;
        saveSettingsButt = document.getElementById("save-settings-button") as HTMLElement;
        settingsSaveButtonText = document.getElementById("save-settings-button-text") as HTMLSpanElement;
        resetSettingsButt = document.getElementById("reset-settings-button") as HTMLElement;
        pencilIcon = document.getElementById("pencil") as HTMLElement;

        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        const settingsBee = document.getElementById("settings-bee") as HTMLDivElement;
        const settingsCircle = document.getElementById("settings-bee-circle") as HTMLDivElement;
        const settingsMenuContainer = document.getElementById("settings-menu-container") as HTMLDivElement;
        const settingsMenu = document.getElementById("settings-menu") as HTMLDivElement;
        const settingsMenuIcon = document.getElementById("settings-menu-icon") as HTMLElement;
        const cycleSpeedSlider = document.getElementById("cycle-speed-slider") as HTMLElement;
        const drawOverlay = document.getElementById("draw-canvas") as HTMLDivElement;
        const pencilSpeedSlider = document.getElementById("pencil-speed-slider") as HTMLElement;

        pencil = new Pencil(drawOverlay, bee.circleProps, () => pencilIcon.classList.remove("on"));

        ctx.canvas.width  = document.body.clientWidth;
        ctx.canvas.height = document.body.clientHeight;
        canvas.style.position = "absolute";
        addListenersToElements();
        startCyclingColor();
        addSettings(settingsBee, settingsCircle);

        const onHueCyclingSpeedChange = (value: number) => {
            stopCyclingColor();
            colorCycling.updateFreq.value = value;
            startCyclingColor();
        };
        addSetting(cycleSpeedSlider, colorCycling.updateFreq, {name: "Cycle Speed", showValue: false, onChange: onHueCyclingSpeedChange});
        addSetting(pencilSpeedSlider, pencil.speed, {name: "Drawing Speed", showValue: false, onChange: (value: number) => pencil.changeSpeed(value)});

        setUpSettingsMenu(settingsMenuContainer, settingsMenu, settingsMenuIcon);

        if (pilotOrderText)
            pilotOrderText.innerText = "1/3";

        screenSaverPilot = new ScreenSaverPilot(bee, controls);
        autopilot = new Autopilot(bee, controls);
        startGeneratingPortals(canvas);
    }

    function setUpSettingsMenu(menuContainer: HTMLDivElement, menu: HTMLDivElement, menuButton: HTMLElement) {
        // If menuContainer bottom is below zero, make it the opposite of the current bottom on menuButtom click.
        menuButton.addEventListener("click", () => toggleSettingsMenu(menuContainer, menu));
        document.addEventListener("keypress", (e) => {
            if (e.key.toLowerCase() === "q")
                toggleSettingsMenu(menuContainer, menu);
        });

        toggleSettingsMenu(menuContainer, menu);
    }

    function toggleSettingsMenu(menuContainer: HTMLDivElement, menu: HTMLDivElement) {
        if (parseInt(menuContainer.style.bottom) < 0)
            menuContainer.style.bottom = "0px";
        else
            menuContainer.style.bottom = -menu.offsetHeight + "px";
    }

    function startGeneratingPortals(canvas: HTMLCanvasElement) {
        portals.generateRandomPortal(portalGeneration.duration, canvas, bee);
        setTimeout(
            () => startGeneratingPortals(canvas),
            Utils.randomIntFromInterval(portalGeneration.spawnDelayRange.min, portalGeneration.spawnDelayRange.max));
    }

    function addListenersToElements() {
        autopilotButton.addEventListener("mousedown", (e) => handlePilotButtonClick());
        cycleColorButt.addEventListener("click", (e) => colorCycling.intervalId ? stopCyclingColor() : startCyclingColor());

        hueSlide.addEventListener("input", (e) => {
            console.log(hueSlide.value);
            stopCyclingColor();
            bee.circleProps.hue.value = parseInt(hueSlide.value);
        });

        pencilIcon.addEventListener("click", () => {
            if (pencil.running) {
                pencilIcon.classList.remove("on");
                pencil.stop()
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

    function addSettings(settingsBee: HTMLDivElement, settingsCircle: HTMLDivElement) {
        addSetting(settingsBee, bee.props.maxSpeed, {name: "Speed", showValue: true, unit: ""});
        addSetting(settingsBee, bee.acceleration.acceleration, {name: "Acceleration", showValue: true });
        addSetting(settingsCircle, bee.circleProps.durationNormal, {name: "Duration", showValue: true, unit: "ms"});
        addSetting(settingsCircle, bee.circleProps.durationShift, {name: "Duration Shift / Drawing", showValue: true, unit: "ms"});
        //addSetting(settingsCircle, bee.circleProps.frequency, {name: "Frequency", showValue: true, unit: "ms/circle"});
        addSetting(settingsCircle, bee.circleProps.size, {name: "Size", showValue: true, unit: "px"});
    }

    function addSetting(toElement: HTMLElement, props: Types.ModifiableProp, {step = 1, ...rest}: SettingProps) {
        const setting = createSettingElement(props, {step, ...rest});
        toElement.appendChild(setting.element);

        setting.parts.slider.addEventListener("input", (e) => handleSettingValueChange(setting, props, rest.onChange));

        [setting.parts.defaultValue, resetSettingsButt].forEach((el) => el.addEventListener("click", (e) => {
            if (setting.parts.slider.value !== props.values.default + "") {
                setting.parts.slider.value = props.values.default + "";
                handleSettingValueChange(setting, props, rest.onChange);
            }
        }));

        settings.push({setting: setting, props: props});
    }

    function handleSettingValueChange(setting: Setting, props: Types.ModifiableProp, onChange?: (value: number) => void) {
        if (onChange)
            onChange(parseFloat(setting.parts.slider.value));
        else
            props.value = parseFloat(setting.parts.slider.value);

        setting.parts.sliderValue.innerText = setting.parts.slider.value;
        saveSettingsButt.classList.replace("saved", "unsaved");
    }

    function createSettingElement(props: Types.ModifiableProp, {step, showValue, unit, name}: SettingProps): Setting {
        const settingDiv = Utils.htmlToElement(`<div class="setting"></div>`) as HTMLDivElement;
        const nameSpan = Utils.htmlToElement(`<span class="setting-name">${name}:</span>`) as HTMLSpanElement;
        const sliderContainer = Utils.htmlToElement(`<span class="slider-container"></span>`) as HTMLSpanElement;
        const slider = Utils.htmlToElement(`<input class="slider small-slider" type="range" step="${step}" min="${props.values.min}" max="${props.values.max}" value="${props.value}">`) as HTMLInputElement;
        const sliderValue = Utils.htmlToElement(`<span class="slider-value">${props.value}</span>`) as HTMLSpanElement;
        const sliderUnit = Utils.htmlToElement(`<span class="slider-unit"> ${unit}</span>`) as HTMLSpanElement;
        const defaultValue = Utils.htmlToElement(`<span class="default-value"> (default: ${props.values.default})</span>`) as HTMLSpanElement;

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
}