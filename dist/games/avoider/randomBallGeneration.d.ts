import { Types } from "../../types.js";
import Point = Types.Point;
export declare class RandomBallGenerator {
    ballProps: {
        speed: number;
        width: number;
        generationFrequency: number;
    };
    private static readonly delta;
    private static readonly angleOffset;
    private readonly balls;
    run(): void;
    private getRandomStartingPos;
    private getSpecialCaseSide;
    private getRandomSide;
    private getRandomPoint;
    private generateBall;
    private createBallElement;
    private getNewPos;
}
export declare module RandomBallGenerator {
    type Ball = {
        readonly element: HTMLElement;
        readonly degrees: number;
        currPos: Point;
    };
    enum Side {
        LEFT = 0,
        RIGHT = 1,
        TOP = 2,
        BOTTOM = 3,
        NONE = 4
    }
}
