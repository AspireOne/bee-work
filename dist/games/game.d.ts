export declare abstract class Game {
    abstract stopGame(): void;
    abstract resumeGame(): void;
    abstract pauseGame(): void;
    abstract startGame(): void;
    abstract running: boolean;
    protected readonly onGameEnded: (endScreenData: HTMLElement) => void;
    protected constructor(onGameEnded: (endScreenData: HTMLElement) => void);
}
