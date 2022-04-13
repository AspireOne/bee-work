import { Game } from "../../game.js";
import { RandomBallGenerator } from "./randomBallGenerator.js";
// IDEAS:
// - Allow the bee to shoot drops of honey.
/** There are flies coming from all sides, and your duty is to not touch them. They're getting gradually more frequent and a bit faster. */
class Avoider {
    constructor() {
        this.id = 0;
        this.updateTimeCounter = 0;
        this.pauseTime = 0;
        this.lastPause = { start: 0, stop: 0 };
        this._running = false;
        this._paused = false;
        this._totalPassed = 0;
        this._startTime = 0;
        this.timeElement = document.getElementById("time-span");
        this.gameDiv = document.getElementById("game");
        this.randomBallGenerator = new RandomBallGenerator(this.gameDiv);
    }
    get running() { return this._running; }
    set running(value) { this._running = value; }
    get paused() { return this._paused; }
    set paused(value) { this._paused = value; }
    get totalPassed() { return this._totalPassed; }
    set totalPassed(value) { this._totalPassed = value; }
    get startTime() { return this._startTime; }
    set startTime(value) { this._startTime = value; }
    startGame() {
        if (this.running) {
            throw new Error("Game was attempted to be started but is already running.");
            return;
        }
        this.running = true;
        this.startTime = Date.now();
        this.id = setInterval(() => {
            if (this.paused)
                return;
            this.update();
        }, Avoider.delta);
    }
    update() {
        this.randomBallGenerator.update(Avoider.delta);
        this.updateTimeCounter += Avoider.delta;
        if (this.updateTimeCounter >= 100 - Avoider.delta - 1) {
            // Base time counting on Date.now(), not on javascript setinterval, because that's not precise.
            if (this.lastPause.stop !== 0) {
                const pause = this.lastPause.stop - this.lastPause.start;
                this.pauseTime += pause;
                this.lastPause = { start: 0, stop: 0 };
            }
            this.updateTimeCounter = 0;
            this.totalPassed = (Date.now() - this.startTime) - this.pauseTime;
            this.timeElement.innerText = (this.totalPassed / 1000).toFixed(1) + "s";
        }
    }
    stopGame() {
        clearInterval(this.id);
        this.running = false;
        this.paused = false;
        this.id = 0;
        this.timeElement.innerText = "";
        this.randomBallGenerator.finish();
    }
    pauseGame() {
        this.paused = true;
        this.lastPause.start += Date.now();
    }
    resumeGame() {
        this.lastPause.stop += Date.now();
        this.paused = false;
    }
}
Avoider.delta = 16;
Game.addGame(() => new Avoider());
//# sourceMappingURL=avoider.js.map