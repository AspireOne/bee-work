import {collisionChecker} from "../global.js";
import {Game} from "../game.js";

class Avoider implements Game.IGame {
    public _running: boolean = false;
    public _paused: boolean = false;
    private static readonly delta = 16;
    private id = 0;

    public get running(): boolean { return this._running; }
    private set running(value: boolean) { this._running = value; }

    public get paused(): boolean { return this._paused; }
    private set paused(value: boolean) { this._paused = value; }

    public startGame() {
        if (this.running) {
            throw new Error("Game was attempted to be started but is already running.");
            return;
        }
        this.running = true;

        this.id = setInterval(() => {
            if (this.paused)
                return;

            this.update();
        }, Avoider.delta);
    }

    private update() {
        console.log("updoot");
    }

    public stopGame() {
        this.running = false;
        this.paused = false;
        clearInterval(this.id);
        this.id = 0;
    }

    public pauseGame() {
        this.paused = true;
    }

    public resumeGame() {
        this.paused = false;
    }
}
Game.addGame(new Avoider());