import { Game } from "../game.js";
import { GameSite } from "../../sites/gameSite.js";
class Follower extends Game {
    constructor(onGameEnded) {
        super(Follower.beeProps, onGameEnded);
    }
    pauseGame() {
    }
    resumeGame() {
    }
    startGame() {
    }
    stopGame() {
    }
}
Follower.beeProps = {
    maxSpeed: 11,
    acceleration: 70
};
GameSite.addGame((endCallback) => new Follower(endCallback));
//# sourceMappingURL=follower.js.map