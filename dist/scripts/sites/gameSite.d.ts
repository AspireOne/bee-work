import { Game } from "../games/game.js";
/** Manages things shared across games (menus etc.). Manages switches between menu - game - game menu - end menu */
export declare module GameSite {
    type Score = {
        name: string;
        timestamp: number;
    };
    /** A global function so that the Game can add itself to the site's game script. */
    export function addGame(getGameFunction: (endCallback: (endScreenData: HTMLElement) => void) => Game): void;
    export function getScoreTableRow(score: Score, rank: number, scoreDataHTML: string): HTMLElement;
    export {};
}
