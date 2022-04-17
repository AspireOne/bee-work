import {collisionChecker} from "../../global.js";
import {GameSite} from "../../sites/gameSite.js";
import {RandomBallGenerator} from "./randomBallGenerator.js";
import {Achivement, Game} from "../game.js";
import {Utils} from "../../utils.js";
import htmlToElement = Utils.htmlToElement;
import collides = Utils.collides;
import {CollisionChecker} from "../../collisionChecker.js";

type TimeAchivement = Achivement & { timePointSecs: number; }

type Achivements = {
    maxSpeed: Achivement;
    maxSize: Achivement;
    maxFrequency: Achivement;
}

type TimeAchivements = {
    initialPhasePassed: TimeAchivement;
    doingGood: TimeAchivement;
    recordBreaker: TimeAchivement;
    freakingLegend: TimeAchivement;
}

// IDEAS:
// - Allow the bee to shoot drops of honey.
/** There are flies coming from all sides, and your duty is to not touch them. They're getting gradually more frequent and faster. */
class Avoider extends Game {
    private static readonly stepFrequency = 1000;
    private static readonly propsStep = {
        generationFrequency: {
            step: 4,
            max: 65,
        },
        speed: {
            step: 6,
            max: 580,
        },
        size: {
            step: 0.028,
            max: 3.5
        }
    }
    private readonly initialProps: RandomBallGenerator.Props = {
        generationFrequency: 340,
        speed: 40,
        size: 1
    }
    private readonly timeAchivements: TimeAchivements = {
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
    }
    private readonly propAchivements: Achivements = {
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
    }
    private readonly DOMelements: {
        time: HTMLSpanElement,
        game: HTMLDivElement,
    };
    private readonly randomBallGenerator;
    private lastPause = {start: 0, stop: 0};
    private updateTimeCounter = 0;
    private stepCounter = 0;
    private pauseTime = 0;

    private updatesStartTimestamp: number | undefined;
    private prevUpdateTimestamp: number | undefined;

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
        this.DOMelements = {
            game: document.getElementById("game") as HTMLDivElement,
            time: document.getElementById("time-span") as HTMLSpanElement,
        }
        this.randomBallGenerator = new RandomBallGenerator(this.DOMelements.game, this.initialProps, () => this.handleCollision());
    }

    public startGame() {
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
        this.randomBallGenerator.update(delta, diffBetweenFrames);
        this.updateTimeCounter += diffBetweenFrames;
        this.stepCounter += diffBetweenFrames;
        if (this.updateTimeCounter >= 100) {
            // Base time counting on performance.now(), not on javascript setinterval, because that's not precise.
            if (this.lastPause.stop !== 0) {
                const pause = this.lastPause.stop - this.lastPause.start;
                this.pauseTime += pause;
                this.lastPause = {start: 0, stop: 0};
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
    public stopGame() {
        if (!this.running)
            return;

        this.running = false;
        this.paused = false;
        this.DOMelements.time.innerText = "";
        collisionChecker.delta = CollisionChecker.defaultDelta;
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
        if (this.paused)
            return;

        this.paused = true;
        this.lastPause.start += performance.now();
    }

    public resumeGame() {
        if (!this.paused)
            return;

        this.lastPause.stop += performance.now();
        this.paused = false;
    }
}
GameSite.addGame((endCallback: (endScreenData: HTMLElement) => void) => new Avoider(endCallback));