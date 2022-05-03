export declare type Achivement = {
    name: string;
    description: string;
    passed: boolean;
};
declare type BeePropsValues = {
    [key: string]: number;
};
export declare abstract class Game {
    abstract stopGame(): void;
    abstract resumeGame(): void;
    abstract pauseGame(): void;
    abstract startGame(): void;
    abstract running: boolean;
    readonly beeProps: BeePropsValues;
    protected readonly onGameEnded: (endScreenData: HTMLElement) => void;
    private DOMElements;
    protected constructor(beeProps: BeePropsValues, onGameEnded: (endScreenData: HTMLElement) => void);
    protected showAchivement(achivement: Achivement): void;
}
export {};
