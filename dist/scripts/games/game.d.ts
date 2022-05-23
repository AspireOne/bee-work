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
    set startTime(value: number);
    private _totalPassed;
    get totalPassed(): number;
    set totalPassed(value: number);
    private _running;
    get running(): boolean;
    set running(value: boolean);
    private _paused;
    get paused(): boolean;
    set paused(value: boolean);
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
