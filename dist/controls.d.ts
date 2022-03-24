export declare class Controls {
    ignoreUserInput: boolean;
    static keys: Readonly<any>;
    constructor();
    onKeyDown: (e: KeyboardEvent | string) => void;
    onKeyUp: (e: KeyboardEvent | string) => void;
    onKeyChange(e: KeyboardEvent | string, keyDown: boolean): void;
}
