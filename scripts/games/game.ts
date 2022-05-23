import {Utils} from "../utils/utils.js";
import {Bee} from "../bee.js";
import {bee} from "../global.js";
import {Models} from "../database/models";

export type Achivement = {
    name: string;
    description: string;
    passed: boolean;
}

type BeePropsValues = {
    [key: string]: number;
}

type UpdateMethod = (delta: number, diffBetweenFrames: number) => void;

export abstract class Game {
    public readonly beeProps: BeePropsValues;
    protected readonly onGameEnded: (endScreenData: HTMLElement) => void;
    protected updateMethod: UpdateMethod | undefined;
    protected pauseTime = 0;

    private lastPause = {start: 0, stop: 0};
    private DOMElements: {
        achivement: HTMLElement,
        achivementName: HTMLElement,
        achivementDescription: HTMLElement,
    };

    private updatesStartTimestamp: number | undefined;
    private prevUpdateTimestamp: number | undefined;

    private _startTime: number = 0;
    public get startTime(): number { return this._startTime; }
    public set startTime(value: number) { this._startTime = value; }

    private _totalPassed: number = 0;
    public get totalPassed(): number { return this._totalPassed; }
    public set totalPassed(value: number) { this._totalPassed = value; }

    private _running: boolean = false;
    public get running(): boolean { return this._running; }
    public set running(value: boolean) { this._running = value; }

    private _paused: boolean = false;
    public get paused(): boolean { return this._paused; }
    public set paused(value: boolean) { this._paused = value; }

    protected constructor(beeProps: BeePropsValues, onGameEnded: (endScreenData: HTMLElement) => void) {
        this.onGameEnded = onGameEnded;
        this.beeProps = beeProps;

        this.DOMElements = {
            achivement: document.getElementById("achivement") as HTMLElement,
            achivementName: document.getElementById("achivement-name") as HTMLElement,
            achivementDescription: document.getElementById("achivement-description") as HTMLElement,
        }
    }

    public startGame() {
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
    public stopGame() {
        if (!this.running)
            return;

        this.running = false;
        this.paused = false;
    }

    public resumeGame() {
        if (!this.paused)
            return;

        this.lastPause.stop += performance.now();
        this.paused = false;
    }

    public pauseGame() {
        if (this.paused)
            return;

        this.paused = true;
        this.lastPause.start += performance.now();
    }

    private step(timestamp: number) {
        const diffBetweenFrames = timestamp - (this.prevUpdateTimestamp as number);
        const delta = diffBetweenFrames / 1000;

        if (!this.paused)
            this.update(delta, diffBetweenFrames);

        this.prevUpdateTimestamp = timestamp;
        if (this.running)
            requestAnimationFrame(this.step.bind(this));
    }

    private update(delta: number, diffBetweenFrames: number) {
        if (this.updateMethod == undefined)
            throw new Error("Update method was not asssigned from derived class to super class Game.");

        this.totalPassed = (performance.now() - this.startTime) - this.pauseTime;
        if (this.lastPause.stop !== 0) {
            const pause = this.lastPause.stop - this.lastPause.start;
            this.pauseTime += pause;
            this.lastPause = {start: 0, stop: 0};
        }

        this.updateMethod(delta, diffBetweenFrames);
    }

    protected showAchivement(achivement: Achivement) {
        achivement.passed = true;
        Utils.resetAnimation(this.DOMElements.achivement);
        this.DOMElements.achivementName.innerText = achivement.name;
        this.DOMElements.achivementDescription.innerText = achivement.description;
        this.DOMElements.achivement.style.animation = "var(--achivement-animation)";
    }
}
