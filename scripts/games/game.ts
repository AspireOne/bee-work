import {Utils} from "../utils.js";

export type Achivement = {
    name: string;
    description: string;
    passed: boolean;
}

export abstract class Game {
    public abstract stopGame(): void;
    public abstract resumeGame(): void;
    public abstract pauseGame(): void;
    public abstract startGame(): void;
    public abstract running: boolean;
    protected readonly onGameEnded: (endScreenData: HTMLElement) => void;

    private DOMElements: {
        achivement: HTMLElement,
        achivementName: HTMLElement,
        achivementDescription: HTMLElement,
    };

    protected constructor(onGameEnded: (endScreenData: HTMLElement) => void) {
        this.onGameEnded = onGameEnded;
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
