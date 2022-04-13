export declare class RandomBallGenerator {
    readonly ballProps: {
        speed: number;
        width: number;
    };
    private static readonly angleOffset;
    static generationFrequency: number;
    private readonly div;
    private readonly balls;
    private ballGenerationTimer;
    private onCollision;
    constructor(div: HTMLElement, onCollision: () => void);
    update(delta: number): void;
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
