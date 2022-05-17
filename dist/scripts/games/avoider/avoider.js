import { collisionChecker } from "../../global.js";
import { GameSite } from "../../sites/gameSite.js";
import { RandomBallGenerator } from "./randomBallGenerator.js";
import { Game } from "../game.js";
import { Utils } from "../../utils.js";
var htmlToElement = Utils.htmlToElement;
import { CollisionChecker } from "../../collisionChecker.js";
// IDEAS:
// - Allow the bee to shoot drops of honey.
/** There are flies coming from all sides, and your duty is to not touch them. They're getting gradually more frequent and faster. */
class Avoider extends Game {
    constructor(onGameEnded) {
        super(onGameEnded);
        this.initialProps = {
            generationFrequency: 315,
            speed: 62,
            size: 1.05
        };
        this.timeAchivements = {
            initialPhasePassed: {
                name: "WARMUP PASSED",
                description: "The warmup is behind you, now onto the real deal",
                timePointSecs: 25,
                passed: false
            },
            doingGood: {
                name: "DOING GOOD",
                description: "Imagine the balls are your mom's slippers!",
                timePointSecs: 50,
                passed: false
            },
            recordBreaker: {
                name: "RECORD BREAKER",
                description: "You are about to set the world record!",
                timePointSecs: 80,
                passed: false
            },
            freakingLegend: {
                name: "FREAKING LEGEND",
                description: "You are the freaking legend of the avoider game!",
                timePointSecs: 100,
                passed: false
            },
        };
        this.propAchivements = {
            maxSpeed: {
                name: "MAXIMAL SPEED",
                description: "You have reached the maximal ball speed",
                passed: false
            },
            maxSize: {
                name: "MAXIMAL SIZE",
                description: "You have reached the maximal ball size",
                passed: false
            },
            maxFrequency: {
                name: "MAXIMAL FREQUENCY",
                description: "You have reached the maximal ball frequency",
                passed: false
            },
        };
        this.lastPause = { start: 0, stop: 0 };
        this.updateTimeCounter = 0;
        this.stepCounter = 0;
        this.pauseTime = 0;
        this._running = false;
        this._paused = false;
        this._totalPassed = 0;
        this._startTime = 0;
        this.DOMelements = {
            game: document.getElementById("game"),
            time: document.getElementById("time-span"),
        };
        this.randomBallGenerator = new RandomBallGenerator(this.DOMelements.game, this.initialProps, () => this.handleCollision());
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
        collisionChecker.delta = 50;
        this.running = true;
        this.startTime = performance.now();
        requestAnimationFrame((timestamp) => {
            this.updatesStartTimestamp = timestamp;
            this.prevUpdateTimestamp = timestamp;
            requestAnimationFrame(this.step.bind(this));
        });
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
        this.randomBallGenerator.update(delta, diffBetweenFrames);
        this.updateTimeCounter += diffBetweenFrames;
        this.stepCounter += diffBetweenFrames;
        if (this.updateTimeCounter >= 100) {
            // Base time counting on performance.now(), not on javascript setinterval, because that's not precise.
            if (this.lastPause.stop !== 0) {
                const pause = this.lastPause.stop - this.lastPause.start;
                this.pauseTime += pause;
                this.lastPause = { start: 0, stop: 0 };
            }
            this.updateTimeCounter = 0;
            this.totalPassed = (performance.now() - this.startTime) - this.pauseTime;
            this.DOMelements.time.innerText = (this.totalPassed / 1000).toFixed(1) + "s";
        }
        if (this.stepCounter >= Avoider.stepFrequency) {
            this.stepCounter = 0;
            if (this.randomBallGenerator.props.generationFrequency > Avoider.propsStep.generationFrequency.max)
                this.randomBallGenerator.props.generationFrequency -= Avoider.propsStep.generationFrequency.step;
            else if (!this.propAchivements.maxFrequency.passed)
                super.showAchivement(this.propAchivements.maxFrequency);
            if (this.randomBallGenerator.props.size < Avoider.propsStep.size.max)
                this.randomBallGenerator.props.size += Avoider.propsStep.size.step;
            else if (!this.propAchivements.maxSize.passed)
                super.showAchivement(this.propAchivements.maxSize);
            if (this.randomBallGenerator.props.speed < Avoider.propsStep.speed.max)
                this.randomBallGenerator.props.speed += Avoider.propsStep.speed.step;
            else if (!this.propAchivements.maxSpeed.passed)
                super.showAchivement(this.propAchivements.maxSpeed);
            // Iterate over timeAchivements and if the total time passed is greater than the time value in the achivement,
            // pass the achivement to showAchivement method.
            for (const [key, value] of Object.entries(this.timeAchivements))
                if (!value.passed && this.totalPassed / 1000 >= value.timePointSecs)
                    super.showAchivement(value);
        }
    }
    stopGame() {
        if (!this.running)
            return;
        this.running = false;
        this.paused = false;
        this.DOMelements.time.innerText = "";
        collisionChecker.delta = CollisionChecker.defaultDelta;
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
        if (this.paused)
            return;
        this.paused = true;
        this.lastPause.start += performance.now();
    }
    resumeGame() {
        if (!this.paused)
            return;
        this.lastPause.stop += performance.now();
        this.paused = false;
    }
}
Avoider.stepFrequency = 1000;
Avoider.propsStep = {
    generationFrequency: {
        step: 3,
        max: 65,
    },
    speed: {
        step: 5,
        max: 580,
    },
    size: {
        step: 0.025,
        max: 2.8
    }
};
GameSite.addGame((endCallback) => new Avoider(endCallback));
//# sourceMappingURL=avoider.js.map