const widthIndicator = document.getElementById("js-width-indicator");
const heightIndicator = document.getElementById("js-height-indicator");
export const getAvailableHeight = () => heightIndicator === null || heightIndicator === void 0 ? void 0 : heightIndicator.clientHeight;
export const getAvailableWidth = () => widthIndicator === null || widthIndicator === void 0 ? void 0 : widthIndicator.clientWidth;
//# sourceMappingURL=utils.js.map