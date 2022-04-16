import {collisionChecker, modules} from "../../global.js";
import {Utils} from "../../utils.js";
import htmlToElement = Utils.htmlToElement;
import {Types} from "../../types.js";
import Point = Types.Point;
import randomIntFromInterval = Utils.randomIntFromInterval;
import {VanishingCircle} from "../../vanishingCircle.js";
import {CollisionChecker} from "../../collisionChecker";
import Props = RandomBallGenerator.Props;

type Ball = {
    readonly element: HTMLElement;
    readonly degrees: number;
    currPos: Point;
};

enum Side { LEFT, RIGHT, TOP, BOTTOM, NONE };

export module RandomBallGenerator {
    export type Props = {
        speed: number;
        size: number;
        generationFrequency: number;
    }
}

export class RandomBallGenerator {
    private static readonly angleOffset = 20;
    private readonly div: HTMLElement;
    private readonly balls: Ball[] = [];
    private readonly onCollision: () => void;
    public readonly props: Props;
    private ballGenerationTimer = 0;

    constructor(div: HTMLElement, props: Props, onCollision: () => void) {
        this.div = div;
        this.onCollision = onCollision;
        this.props = props;
    }
    public update(delta: number) {
        this.ballGenerationTimer += delta;

        this.balls.forEach(ball => {
            this.getNewPos(ball);
            ball.element.style.left = ball.currPos.x + "px";
            ball.element.style.top = ball.currPos.y + "px";
            if (ball.currPos.y < -this.props.size - 10 || ball.currPos.y > document.body.clientHeight || ball.currPos.x < -this.props.size - 10 || ball.currPos.x > document.body.clientWidth) {
                this.removeBall(ball);
            }
        });

        if (this.ballGenerationTimer >= this.props.generationFrequency) {
            this.ballGenerationTimer = 0;
            this.addNewBall();
        }
    }

    private addNewBall() {
        const ball = this.generateBall();
        this.div.appendChild(ball.element);
        collisionChecker.add({element: ball.element, onCollisionEnter: this.onCollision});
        this.balls.push(ball);
    }

    private removeBall(ball: Ball, notFromArray: boolean = false) {
        ball.element.remove();
        collisionChecker.remove(ball.element);
        if (!notFromArray)
            this.balls.splice(this.balls.indexOf(ball), 1);
    }

    public finish() {
        this.balls.forEach(ball => this.removeBall(ball, true));
    }

    private getRandomStartingPos(degrees: number): Point {
        let side: Side;
        // Pick a side randomly based on degrees (trajectory).
        side = this.getRandomSide(degrees);

        if (side === Side.NONE)
            side = this.getSpecialCaseSide(degrees);

        if (side === Side.NONE)
            throw new Error("Could not find a starting side for " + degrees + " degrees.");

        return this.getRandomPoint(side);
    }

    // Special cases where the angle is so close to full 90deg that starting from any other side than parallel is not desirable.
    private getSpecialCaseSide(degrees: number): Side {
        const offset = RandomBallGenerator.angleOffset;

        if (degrees >= 360 - offset || degrees <= offset)
            return Side.BOTTOM;
        else if (degrees >= 90 - offset && degrees <= 90 + offset)
            return Side.RIGHT;
        else if (degrees >= 180 - offset && degrees <= 180 + offset)
            return Side.TOP;
        else if (degrees >= 270 - offset && degrees <= 270 + offset)
            return Side.LEFT;
        else
            return Side.NONE;
    }

    private getRandomSide(degrees: number): Side {
        let possibleSides: { one: Side, two: Side } = {one: Side.NONE, two: Side.NONE};
        const offset = RandomBallGenerator.angleOffset;

        if (degrees > offset && degrees < 90 - offset) // Left, bottom
            possibleSides = {one: Side.LEFT, two: Side.BOTTOM};
        else if (degrees > 90 + offset && degrees < 180 - offset) // Left, top
            possibleSides = {one: Side.LEFT, two: Side.TOP};
        else if (degrees > 180 + offset && degrees < 270 - offset) // Right, top
            possibleSides = {one: Side.RIGHT, two: Side.TOP};
        else if (degrees > 270 + offset && degrees < 360 - offset) // Right, bottom
            possibleSides = {one: Side.RIGHT, two: Side.BOTTOM};

        return randomIntFromInterval(0, 2) ? possibleSides.one : possibleSides.two;
    }

    private getRandomPoint(side: Side): Point {
        const point: Point = {x: 0, y: 0};
        switch (side) {
            case Side.TOP:
                point.y = -this.props.size;
                point.x = Math.random() * document.body.clientWidth;
                break;
            case Side.RIGHT:
                point.x = document.body.clientWidth;
                point.y = Math.random() * document.body.clientHeight;
                break;
            case Side.BOTTOM:
                point.y = document.body.clientHeight;
                point.x = Math.random() * document.body.clientWidth;
                break;
            case Side.LEFT:
                point.x = -this.props.size;
                point.y = Math.random() * document.body.clientHeight;
                break;
        }
        return point;
    }

    private generateBall(): Ball {
        const degrees = Math.floor(Math.random() * 360);
        const startingPos = this.getRandomStartingPos(degrees);
        const ballElement = this.createBallElement(startingPos);
        return {degrees: degrees, currPos: startingPos, element: ballElement};
    }

    private createBallElement(pos: Point): HTMLElement {
        const ball = htmlToElement(`<img src="../../../resources/ball.png">`);
        ball.style.position = "absolute";
        ball.style.width = this.props.size + "px";
        ball.style.height = this.props.size + "px";
        ball.style.left = pos.x + "px";
        ball.style.top = pos.y + "px";
        return ball;
    }

    private getNewPos(ball: Ball): void {
        const degrees = ball.degrees - 90;

        let rad = degrees * Math.PI / 180;
        ball.currPos.x = ball.currPos.x + Math.cos(rad) * this.props.speed;
        ball.currPos.y = ball.currPos.y + Math.sin(rad) * this.props.speed;
    }
}