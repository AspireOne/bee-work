import {collisionChecker} from "../../global.js";
import {GameSite} from "../../sites/gameSite.js";
import {RandomBallGenerator} from "./randomBallGenerator.js";
import {Achivement, Game} from "../game.js";
import {Utils} from "../../utils/utils.js";
import htmlToElement = Utils.htmlToElement;
import collides = Utils.collides;
import {CollisionChecker} from "../../collisionChecker.js";
import {Bee} from "../../bee.js";
import {Types} from "../../utils/types";
import KeysMatching = Types.KeysMatching;
import EndScreenCallback = GameSite.EndScreenCallback;

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
    private static readonly beeProps = {
        /*maxSpeed: 11,
        acceleration: 70*/
    };
    private static readonly stepFrequency = 1000;
    private static readonly propsStep = {
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
    }
    private readonly initialProps: RandomBallGenerator.Props = {
        generationFrequency: 315,
        speed: 62,
        size: 1.05
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
    private updateTimeCounter = 0;
    private stepCounter = 0;

    constructor(onGameEnded: (endScreenData: HTMLElement) => void) {
        super(Avoider.beeProps, "Avoider", onGameEnded);

        this.DOMelements = {
            game: document.getElementById("game") as HTMLDivElement,
            time: document.getElementById("time-span") as HTMLSpanElement,
        }
        this.randomBallGenerator = new RandomBallGenerator(this.DOMelements.game, this.initialProps, () => this.handleCollision());
    }

    public override startGame() {
        super.updateMethod = this.onUpdate;
        collisionChecker.delta = 50;
        super.startGame();
    }

    public override stopGame() {
        super.stopGame();

        this.DOMelements.time.innerText = "";
        collisionChecker.delta = CollisionChecker.defaultDelta;
        this.randomBallGenerator.finish();
    }

    private onUpdate(delta: number, diffBetweenFrames: number) {
        this.randomBallGenerator.update(delta, diffBetweenFrames);
        this.updateTimeCounter += diffBetweenFrames;
        this.stepCounter += diffBetweenFrames;

        if (this.updateTimeCounter >= 100) {
            this.updateTimeCounter = 0;
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

    private handleCollision() {
        this.stopGame();
        this.handleGameFinish();
    }

    private handleGameFinish() {
        this.onGameEnded(htmlToElement("<p>You survived for " + (this.totalPassed / 1000).toFixed(1) + " seconds.</p>"));
    }
}
GameSite.addGame((endCallback: EndScreenCallback) => new Avoider(endCallback));