export declare type Achivement = {
    name: string;
    description: string;
    passed: boolean;
};
export declare abstract class Game {
    abstract stopGame(): void;
    abstract resumeGame(): void;
    abstract pauseGame(): void;
    abstract startGame(): void;
    abstract running: boolean;
    protected readonly onGameEnded: (endScreenData: HTMLElement) => void;
    private DOMElements;
    protected constructor(onGameEnded: (endScreenData: HTMLElement) => void);
    protected showAchivement(achivement: Achivement): void;
}
