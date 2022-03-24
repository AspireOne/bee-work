const widthIndicator = document.getElementById("js-width-indicator") as HTMLElement;
const heightIndicator = document.getElementById("js-height-indicator") as HTMLElement;
export const getAvailableHeight = () => heightIndicator?.clientHeight;
export const getAvailableWidth = () => widthIndicator?.clientWidth;