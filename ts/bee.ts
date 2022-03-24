import {VanishingCircle} from "./vanishingCircle.js";
import {getAvailableHeight, getAvailableWidth} from "./utils.js";
import {Controls} from "./controls.js";
import {Acceleration, WayX} from "./pilotUtils.js";

export class Bee {
    public currY = 0;
    public currX = 0;
    public element: HTMLElement;
    public maxSpeed = 7;
    public deltaTime = 8;
    public accelerationData = new Acceleration();
    public circleHue = 0;
    private id: number | null = null;
    private wayX: WayX = WayX.NONE;
    private timeFromLastCircle = 0;
    private circleFrequency = 9;
    private scale = 0;
    private controls: Controls;

    constructor(element: HTMLElement, controls: Controls) {
        this.controls = controls;
        this.element = element;
        this.scale = parseInt(element.style.transform.replace(/\D/g, ""));

        this.element.style.top = getAvailableHeight() - this.element.offsetHeight + "px";
        this.element.style.left = "0px";
        this.element.onclick = () => {
            let text = document.getElementById("js-rect-text") as HTMLElement;
            text.innerHTML = "Bzzzzz";
            text.style.left = element.style.left;
            text.style.top = parseInt(element.style.top) - 40 + "px";
            setTimeout(() => text.innerHTML = "", 1500);
        }
    }

    public start() {
        VanishingCircle.runLoop();
        if (this.id === null)
            this.id = setInterval(() => this.frame(), this.deltaTime);
    }

    public stop() {
        if (this.id !== null) {
            clearInterval(this.id);
            this.id = null;
        }
    }

    private frame() {
        let newY = this.calculateNewY();
        let newX = this.calculateNewX();
        this.currY = newY;
        this.currX = newX;

        this.element.style.top = newY + "px";
        this.element.style.left = newX + "px";

        this.flipElementIfShould();

        if ((this.timeFromLastCircle += this.deltaTime) >= this.circleFrequency) {
            this.timeFromLastCircle = 0;
            new VanishingCircle(newX, newY, Controls.keys.floss.downPressed ? 2000 : 400, 80, 1, this.circleHue).show();
        }
    }

    private flipElementIfShould() {
        let scale = 0;

        if (Controls.keys.right.downPressed)
            scale = -1;
        else if (Controls.keys.left.downPressed)
            scale = 1;

        if (scale !== 0 && scale !== this.scale) {
            this.element.style.setProperty("transform", "scaleX(" + scale + ")");
            this.scale = scale;
        }
    }

    private calculateNewX(): number {
        const currPosX = parseInt(this.element.style.left);
        const width = this.element.offsetWidth;
        const maxX = getAvailableWidth() - width;
        const getUpdatedWay = (): WayX => {
            if (this.accelerationData.currAccelerationX > 0)
                return WayX.RIGHT;
            else if (this.accelerationData.currAccelerationX < 0)
                return WayX.LEFT;
            else
                return WayX.NONE;
        }
        const updatedWay = getUpdatedWay();

        let newAcceleration = this.accelerationData.currAccelerationX;

        if (Controls.keys.left.downPressed)
            newAcceleration -= this.accelerationData.acceleration;
        else if (Controls.keys.right.downPressed)
            newAcceleration += this.accelerationData.acceleration;
        else {
            if (updatedWay != this.wayX)
                newAcceleration = 0;
            else if (this.accelerationData.currAccelerationX > 0)
                newAcceleration -= this.accelerationData.acceleration;
            else if (this.accelerationData.currAccelerationX < 0)
                newAcceleration += this.accelerationData.acceleration;
        }

        let newPosX = currPosX + newAcceleration;

        this.accelerationData.currAccelerationX = this.correctAcceleration(newAcceleration);
        this.wayX = updatedWay;

        if (newPosX < 0) {
            newPosX = 0;
            this.accelerationData.currAccelerationX = 0;
        } else if (newPosX > maxX) {
            newPosX = maxX;
            this.accelerationData.currAccelerationX = 0;
        }

        return newPosX;
    }

    private calculateNewY(): number {
        const currPosY = parseInt(this.element.style.top);
        const height = this.element.offsetHeight;
        const maxY = getAvailableHeight() - height;

        let newAcceleration = this.accelerationData.currAccelerationY + (Controls.keys.up.downPressed ? -this.accelerationData.acceleration : this.accelerationData.acceleration);
        let newPosY = currPosY + newAcceleration;

        this.accelerationData.currAccelerationY = this.correctAcceleration(newAcceleration);

        if (newPosY < 0) {
            newPosY = 0;
            this.accelerationData.currAccelerationY = 0;
        } else if (newPosY > maxY) {
            newPosY = maxY;
            this.accelerationData.currAccelerationY = 0;
        }

        return newPosY;
    }

    private correctAcceleration(acceleration: number): number {
        if (acceleration > this.maxSpeed)
            return this.maxSpeed;
        else if (acceleration < -this.maxSpeed)
            return -this.maxSpeed;

        return acceleration;
    }
}