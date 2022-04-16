import {collisionChecker} from "../../global.js";
import {GameSite} from "../../sites/gameSite.js";
import {RandomBallGenerator} from "./randomBallGenerator.js";
import {Game} from "../game.js";
import {Utils} from "../../utils.js";
import htmlToElement = Utils.htmlToElement;

// IDEAS:
// - Allow the bee to shoot drops of honey.
/** There are flies coming from all sides, and your duty is to not touch them. They're getting gradually more frequent and faster. */
class Avoider extends Game {
    private static readonly delta = 16;
    private static readonly stepFrequency = 1000;
    private static readonly propsStep: RandomBallGenerator.Props = {
        generationFrequency: 5,
        speed: 0.16,
        size: 0.78,
    }
    private readonly initialProps: RandomBallGenerator.Props = {
        generationFrequency: 385,
        speed: 1.45,
        size: 43
    }
    private readonly timeElement: HTMLSpanElement;
    private readonly gameDiv: HTMLDivElement;
    private readonly randomBallGenerator;
    private lastPause = {start: 0, stop: 0};
    private updateTimeCounter = 0;
    private stepCounter = 0;
    private pauseTime = 0;
    private id = 0;

    public _running: boolean = false;
    public _paused: boolean = false;

    public _totalPassed: number = 0;
    public _startTime: number = 0;


    public get running(): boolean { return this._running; }
    private set running(value: boolean) { this._running = value; }

    public get paused(): boolean { return this._paused; }
    private set paused(value: boolean) { this._paused = value; }

    public get totalPassed(): number { return this._totalPassed; }
    private set totalPassed(value: number) { this._totalPassed = value; }

    public get startTime(): number { return this._startTime; }
    private set startTime(value: number) { this._startTime = value; }

    constructor(onGameEnded: (endScreenData: HTMLElement) => void) {
        super(onGameEnded);
        this.timeElement = document.getElementById("time-span") as HTMLSpanElement;
        this.gameDiv = document.getElementById("game") as HTMLDivElement;
        this.randomBallGenerator = new RandomBallGenerator(this.gameDiv, this.initialProps, () => this.handleCollision());
    }

    public startGame() {
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

    private update() {
        this.randomBallGenerator.update(Avoider.delta);
        this.updateTimeCounter += Avoider.delta;
        this.stepCounter += Avoider.delta;
        if (this.updateTimeCounter >= 100) {
            // Base time counting on Date.now(), not on javascript setinterval, because that's not precise.
            if (this.lastPause.stop !== 0) {
                const pause = this.lastPause.stop - this.lastPause.start;
                this.pauseTime += pause;
                this.lastPause = {start: 0, stop: 0};
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

    public stopGame() {
        clearInterval(this.id);
        this.running = false;
        this.paused = false;
        this.id = 0;
        this.timeElement.innerText = "";
        this.randomBallGenerator.finish();
    }

    private handleCollision() {
        this.stopGame();
        this.handleGameFinish();
    }

    private handleGameFinish() {
        this.onGameEnded(htmlToElement("<p>You survived for " + (this.totalPassed / 1000).toFixed(1) + " seconds.</p>"));
    }

    public pauseGame() {
        this.paused = true;
        this.lastPause.start += Date.now();
    }

    public resumeGame() {
        this.lastPause.stop += Date.now();
        this.paused = false;
    }
}
GameSite.addGame((endCallback: (endScreenData: HTMLElement) => void) => new Avoider(endCallback));