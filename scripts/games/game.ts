import {Utils} from "../utils.js";
import {Bee} from "../bee.js";
import {bee} from "../global.js";

export type Achivement = {
    name: string;
    description: string;
    passed: boolean;
}

type BeePropsValues = {
    [key: string]: number;
}

export abstract class Game {
    public abstract stopGame(): void;
    public abstract resumeGame(): void;
    public abstract pauseGame(): void;
    public abstract startGame(): void;
    public abstract running: boolean;
    public readonly beeProps: BeePropsValues;
    protected readonly onGameEnded: (endScreenData: HTMLElement) => void;

    private DOMElements: {
        achivement: HTMLElement,
        achivementName: HTMLElement,
        achivementDescription: HTMLElement,
    };

    protected constructor(beeProps: BeePropsValues, onGameEnded: (endScreenData: HTMLElement) => void) {
        this.onGameEnded = onGameEnded;
        this.beeProps = beeProps;

        this.DOMElements = {
            achivement: document.getElementById("achivement") as HTMLElement,
            achivementName: document.getElementById("achivement-name") as HTMLElement,
            achivementDescription: document.getElementById("achivement-description") as HTMLElement,
        }
    }

    protected showAchivement(achivement: Achivement) {
        achivement.passed = true;
        Utils.resetAnimation(this.DOMElements.achivement);
        this.DOMElements.achivementName.innerText = achivement.name;
        this.DOMElements.achivementDescription.innerText = achivement.description;
        this.DOMElements.achivement.style.animation = "var(--achivement-animation)";
    }
}
