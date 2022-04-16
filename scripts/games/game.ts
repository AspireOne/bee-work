import {portals} from "../global.js";

export abstract class Game {
    public abstract stopGame(): void;

    public abstract resumeGame(): void;

    public abstract pauseGame(): void;

    public abstract startGame(): void;

    public abstract running: boolean;

    protected readonly onGameEnded: (endScreenData: HTMLElement) => void

    protected constructor(onGameEnded: (endScreenData: HTMLElement) => void) {
        this.onGameEnded = onGameEnded;
    }
}
