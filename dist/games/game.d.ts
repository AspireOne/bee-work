export declare type Achivement = {
    name: string;
    description: string;
    passed: boolean;
};
declare type BeePropsValues = {
    [key: string]: number;
};
declare type UpdateMethod = (delta: number, diffBetweenFrames: number) => void;
export declare abstract class Game {
    readonly beeProps: BeePropsValues;
    protected readonly onGameEnded: (endScreenData: HTMLElement) => void;
    protected updateMethod: UpdateMethod | undefined;
    protected pauseTime: number;
    private lastPause;
    private DOMElements;
    private updatesStartTimestamp;
    private prevUpdateTimestamp;
    private _startTime;
    get startTime(): number;
    private set startTime(value);
    private _totalPassed;
    get totalPassed(): number;
    private set totalPassed(value);
    private _running;
    get running(): boolean;
    private set running(value);
    private _paused;
    get paused(): boolean;
    private set paused(value);
    protected constructor(beeProps: BeePropsValues, onGameEnded: (endScreenData: HTMLElement) => void);
    startGame(): void;
    stopGame(): void;
    resumeGame(): void;
    pauseGame(): void;
    private step;
    private update;
    protected showAchivement(achivement: Achivement): void;
}
export {};
