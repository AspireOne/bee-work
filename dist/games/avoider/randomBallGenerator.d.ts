import Props = RandomBallGenerator.Props;
export declare module RandomBallGenerator {
    type Props = {
        speed: number;
        size: number;
        generationFrequency: number;
    };
}
export declare class RandomBallGenerator {
    private static readonly angleOffset;
    private readonly div;
    private readonly balls;
    private readonly onCollision;
    readonly props: Props;
    private ballGenerationTimer;
    constructor(div: HTMLElement, props: Props, onCollision: () => void);
    update(delta: number, diffBetweenFrames: number): void;
    private addNewBall;
    private removeBall;
    finish(): void;
    private getRandomStartingPos;
    private getSpecialCaseSide;
    private getRandomSide;
    private getRandomPoint;
    private generateBall;
    private createBallElement;
    private getNewPos;
}
