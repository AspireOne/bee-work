export declare module Game {
    type Score = {
        name: string;
        timestamp: number;
    };
    export function getTableRow(score: Score, rank: number, scoreDataHTML: string): HTMLElement;
    export {};
}
