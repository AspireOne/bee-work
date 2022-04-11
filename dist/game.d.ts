export declare module Game {
    export type IGame = {
        startGame: () => void;
        stopGame: () => void;
        resumeGame: () => void;
        pauseGame: () => void;
        running: boolean;
    };
    type Score = {
        name: string;
        timestamp: number;
    };
    export function addGame(gamee: IGame): void;
    export function getScoreTableRow(score: Score, rank: number, scoreDataHTML: string): HTMLElement;
    export {};
}
