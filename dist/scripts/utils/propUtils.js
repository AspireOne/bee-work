export var PropUtils;
(function (PropUtils) {
    function saveProps(props, name) {
        const saveableProps = convertPropsToSaveProps(props);
        localStorage.setItem(name, JSON.stringify(saveableProps));
    }
    PropUtils.saveProps = saveProps;
    function getSavedProps(name) {
        let props = localStorage.getItem(name);
        if (props != null) {
            const propsValues = JSON.parse(props);
            return propsValues;
        }
        return null;
    }
    PropUtils.getSavedProps = getSavedProps;
    function applySavedProps(targetProps, savedProps) {
        Object.entries(savedProps).forEach(([key, value]) => {
            if (targetProps[key])
                targetProps[key].value = value;
            else
                console.warn("Could not apply saved prop: " + key);
        });
    }
    PropUtils.applySavedProps = applySavedProps;
    /** Creates an object with only the current values of the props.
     * @param sourceProps The props to create the object from.
     * @returns An object with the current values of the props.
     */
    function convertPropsToSaveProps(sourceProps) {
        const values = {};
        Object.entries(sourceProps).forEach(([key, value]) => values[key] = value.value);
        return values;
    }
    PropUtils.convertPropsToSaveProps = convertPropsToSaveProps;
})(PropUtils || (PropUtils = {}));
//# sourceMappingURL=propUtils.js.map