import {ScreenSaverPilot} from "./screenSaverPilot.js";
import {Autopilot} from "./autopilot.js";
import {bee, controls, modules, portals} from "./global.js";
import {Bee, modifiableProp} from "./bee.js";
import {getAvailableHeight, getAvailableWidth, htmlToElement, randomIntFromInterval} from "./utils.js";

export namespace Playground {
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

    interface setting {
        element: HTMLDivElement;
        parts: {
            slider: HTMLInputElement;
            sliderValue: HTMLSpanElement;
        }
    }

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
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
        const settingsDiv = document.getElementById("settings-div") as HTMLDivElement;
        const settingsMenuContainer = document.getElementById("settings-menu-container") as HTMLDivElement;
        const settingsMenuIcon = document.getElementById("settings-menu-icon") as HTMLElement;

        ctx.canvas.width  = getAvailableWidth();
        ctx.canvas.height = getAvailableHeight();
        canvas.style.position = "absolute";

        addListenersToElements();
        addSettings(settingsDiv);
        setUpSettingsMenu(settingsMenuContainer, settingsMenuIcon);

        if (pilotOrderText)
            pilotOrderText.innerText = "1/3";

        screenSaverPilot = new ScreenSaverPilot(bee, controls);
        autopilot = new Autopilot(bee, controls);
        startGeneratingPortals(canvas);
    }

    function setUpSettingsMenu(menuContainer: HTMLDivElement, menuButton: HTMLElement) {
        // If menuContainer bottom is below zero, make it the opposite of the current bottom on menuButtom click.
        menuButton.addEventListener("click", () => {
            if (Number(menuContainer.style.bottom.replace("px", "")) < 0) {
                menuContainer.style.bottom = "0px";
            } else {
                menuContainer.style.bottom = -menuContainer.offsetHeight + 50 + "px";
            }
        });

        menuContainer.style.bottom = -menuContainer.offsetHeight + "px";
    }

    function startGeneratingPortals(canvas: HTMLCanvasElement) {
        portals.generateRandomPortal(portalGeneration.duration, canvas);
        setTimeout(() => {
            startGeneratingPortals(canvas);
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

    function addSettings(toElement: HTMLElement) {
        const accelerationProps: modifiableProp = {
            value: bee.accelerationData.acceleration,
            values: {
                default: bee.accelerationData.acceleration,
                max: 2,
                min: 0.05
            }
        }

        addSetting(toElement, "Delta", bee.props.deltaTime, (value) => {
            bee.props.deltaTime.value = value;
            bee.stop();
            bee.start();
        });
        addSetting(toElement, "Acceleration", accelerationProps, (value) => bee.accelerationData.acceleration = value);
        addSetting(toElement, "Speed", bee.props.maxSpeed);
        addSetting(toElement, "Circle Duration", bee.circleProps.durationNormal);
        addSetting(toElement, "Circle Duration Shift", bee.circleProps.durationShift);
        addSetting(toElement, "Circle Frequency", bee.circleProps.frequency);
        addSetting(toElement, "Circle Size", bee.circleProps.size);

    }

    function addSetting(toElement: HTMLElement, name: string, props: modifiableProp, onChange?: (value: number) => void) {
        const setting = createSettingElement(name, props);
        toElement.appendChild(setting.element);

        setting.parts.slider.addEventListener("input", (e) => handleSettingValueChange(setting, props, onChange));
    }

    function handleSettingValueChange(setting: setting, props: modifiableProp, onChange?: (value: number) => void) {
        if (onChange)
            onChange(parseFloat(setting.parts.slider.value));
        else
            props.value = parseFloat(setting.parts.slider.value);

        setting.parts.sliderValue.innerText = setting.parts.slider.value;
        console.log(setting.parts.slider.value);
    }

    function createSettingElement(name: string, props: modifiableProp): setting {
        const settingDiv = htmlToElement(`<div class="setting"></div>`) as HTMLDivElement;
        const nameSpan = htmlToElement(`<span class="setting-name">${name}:</span>`) as HTMLSpanElement;
        const sliderContainer = htmlToElement(`<span class="slider-container"></span>`) as HTMLSpanElement;
        const slider = htmlToElement(`<input class="slider small-slider" type="range" step="0.1" min="${props.values.min}" max="${props.values.max}" value="${props.value}">`) as HTMLInputElement;
        const sliderValue = htmlToElement(`<span class="slider-value">${props.value}</span>`) as HTMLSpanElement;

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
}