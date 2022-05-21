import {Game} from "../game.js";
import {GameSite} from "../../sites/gameSite.js";

class Follower extends Game {
    private static readonly beeProps = {
        maxSpeed: 11,
        acceleration: 70
    };
    constructor(onGameEnded: (endScreenData: HTMLElement) => void) {
        super(Follower.beeProps, onGameEnded);
    }

    pauseGame(): void {

    }

    resumeGame(): void {
    }

    startGame(): void {
    }

    stopGame(): void {
    }
}
GameSite.addGame((endCallback: (endScreenData: HTMLElement) => void) => new Follower(endCallback));