import {Types} from "./types";

export module PropUtils {

    export function saveProps(props: {[key: string]: Types.ModifiableProp}, name: string) {
        const saveableProps = convertPropsToSaveProps(props);
        localStorage.setItem(name, JSON.stringify(saveableProps));
    }

    export function getSavedProps(name: string): Types.SavedModifiableProp | null {
        let props = localStorage.getItem(name);
        if (props != null) {
            const propsValues = JSON.parse(props) as Types.SavedModifiableProp;
            return propsValues;
        }
        return null;
    }

    export function applySavedProps(targetProps: {[key: string]: Types.ModifiableProp}, savedProps: Types.SavedModifiableProp) {
        Object.entries(savedProps).forEach(([key, value]) => {
            if (targetProps[key])
                targetProps[key].value = value;
            else
                console.warn("Could not apply saved prop: " + key);
        });
    }

    /** Creates an object with only the current values of the props.
     * @param sourceProps The props to create the object from.
     * @returns An object with the current values of the props.
     */
    function convertPropsToSaveProps(sourceProps: {[key: string]: Types.ModifiableProp}): Types.SavedModifiableProp {
        const values: Types.SavedModifiableProp = {};
        Object.entries(sourceProps).forEach(([key, value]) => values[key] = value.value);
        return values;
    }
}