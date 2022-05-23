import { Types } from "../types";
export declare module PropUtils {
    function saveProps(props: {
        [key: string]: Types.ModifiableProp;
    }, name: string): void;
    function getSavedProps(name: string): Types.SavedModifiableProp | null;
    function applySavedProps(targetProps: {
        [key: string]: Types.ModifiableProp;
    }, savedProps: Types.SavedModifiableProp): void;
}
