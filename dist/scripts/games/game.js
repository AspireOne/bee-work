import { Utils } from "../utils/utils.js";
export class Game {
    constructor(beeProps, onGameEnded) {
        this.pauseTime = 0;
        this.lastPause = { start: 0, stop: 0 };
        this._startTime = 0;
        this._totalPassed = 0;
        this._running = false;
        this._paused = false;
        this.onGameEnded = onGameEnded;
        this.beeProps = beeProps;
        this.DOMElements = {
            achivement: document.getElementById("achivement"),
            achivementName: document.getElementById("achivement-name"),
            achivementDescription: document.getElementById("achivement-description"),
        };
    }
    get startTime() { return this._startTime; }
    set startTime(value) { this._startTime = value; }
    get totalPassed() { return this._totalPassed; }
    set totalPassed(value) { this._totalPassed = value; }
    get running() { return this._running; }
    set running(value) { this._running = value; }
    get paused() { return this._paused; }
    set paused(value) { this._paused = value; }
    startGame() {
        if (this.running)
            throw new Error("Game was attempted to be started but is already running.");
        this.running = true;
        this.startTime = performance.now();
        requestAnimationFrame((timestamp) => {
            this.updatesStartTimestamp = timestamp;
            this.prevUpdateTimestamp = timestamp;
            requestAnimationFrame(this.step.bind(this));
        });
    }
    stopGame() {
        if (!this.running)
            return;
        this.running = false;
        this.paused = false;
    }
    resumeGame() {
        if (!this.paused)
            return;
        this.lastPause.stop += performance.now();
        this.paused = false;
    }
    pauseGame() {
        if (this.paused)
            return;
        this.paused = true;
        this.lastPause.start += performance.now();
    }
    step(timestamp) {
        const diffBetweenFrames = timestamp - this.prevUpdateTimestamp;
        const delta = diffBetweenFrames / 1000;
        if (!this.paused)
            this.update(delta, diffBetweenFrames);
        this.prevUpdateTimestamp = timestamp;
        if (this.running)
            requestAnimationFrame(this.step.bind(this));
    }
    update(delta, diffBetweenFrames) {
        if (this.updateMethod == undefined)
            throw new Error("Update method was not asssigned from derived class to super class Game.");
        this.totalPassed = (performance.now() - this.startTime) - this.pauseTime;
        if (this.lastPause.stop !== 0) {
            const pause = this.lastPause.stop - this.lastPause.start;
            this.pauseTime += pause;
            this.lastPause = { start: 0, stop: 0 };
        }
        this.updateMethod(delta, diffBetweenFrames);
    }
    showAchivement(achivement) {
        achivement.passed = true;
        Utils.resetAnimation(this.DOMElements.achivement);
        this.DOMElements.achivementName.innerText = achivement.name;
        this.DOMElements.achivementDescription.innerText = achivement.description;
        this.DOMElements.achivement.style.animation = "var(--achivement-animation)";
    }
}
//# sourceMappingURL=game.js.map