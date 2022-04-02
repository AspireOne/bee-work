declare type Key = {
    [key: string]: {
        definition: string[];
        pressed: boolean;
    };
};
export declare class Controls {
    private static instanceCreated;
    static keys: Readonly<Key>;
    ignoreUserInput: boolean;
    static changePressState(definition: string, pressed: boolean): boolean;
    constructor();
    onKeyChange(eOrKey: KeyboardEvent | string, keyDown: boolean): void;
}
export {};
