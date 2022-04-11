export declare module Types {
    type Point = {
        x: number;
        y: number;
    };
    type Range = {
        min: number;
        max: number;
    };
    type SavedModifiableProp = {
        [p: string]: number;
    };
    type ModifiableProp = {
        value: number;
        values: {
            readonly default: number;
            readonly min: number;
            readonly max: number;
        };
    };
    enum WayX {
        LEFT = 0,
        RIGHT = 1,
        NONE = 2
    }
    enum WayY {
        UP = 0,
        DOWN = 1,
        NONE = 2
    }
}
