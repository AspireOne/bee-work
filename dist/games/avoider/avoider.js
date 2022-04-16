import { GameSite } from "../../sites/gameSite.js";
import { RandomBallGenerator } from "./randomBallGenerator.js";
import { Game } from "../game.js";
import { Utils } from "../../utils.js";
var htmlToElement = Utils.htmlToElement;
// IDEAS:
// - Allow the bee to shoot drops of honey.
/** There are flies coming from all sides, and your duty is to not touch them. They're getting gradually more frequent and faster. */
class Avoider extends Game {
    constructor(onGameEnded) {
        super(onGameEnded);
        this.initialProps = {
            generationFrequency: 385,
            speed: 1.45,
            size: 43
        };
        this.lastPause = { start: 0, stop: 0 };
        this.updateTimeCounter = 0;
        this.stepCounter = 0;
        this.pauseTime = 0;
        this.id = 0;
        this._running = false;
        this._paused = false;
        this._totalPassed = 0;
        this._startTime = 0;
        this.timeElement = document.getElementById("time-span");
        this.gameDiv = document.getElementById("game");
        this.randomBallGenerator = new RandomBallGenerator(this.gameDiv, this.initialProps, () => this.handleCollision());
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
        this.stepCounter += Avoider.delta;
        if (this.updateTimeCounter >= 100) {
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
        if (this.stepCounter >= Avoider.stepFrequency) {
            console.log("stepping");
            console.log(this.randomBallGenerator.props);
            this.stepCounter = 0;
            this.randomBallGenerator.props.generationFrequency -= Avoider.propsStep.generationFrequency;
            this.randomBallGenerator.props.size += Avoider.propsStep.size;
            this.randomBallGenerator.props.speed += Avoider.propsStep.speed;
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
    handleCollision() {
        this.stopGame();
        this.handleGameFinish();
    }
    handleGameFinish() {
        this.onGameEnded(htmlToElement("<p>You survived for " + (this.totalPassed / 1000).toFixed(1) + " seconds.</p>"));
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
Avoider.stepFrequency = 1000;
Avoider.propsStep = {
    generationFrequency: 5,
    speed: 0.16,
    size: 0.78,
};
GameSite.addGame((endCallback) => new Avoider(endCallback));
//# sourceMappingURL=avoider.js.map