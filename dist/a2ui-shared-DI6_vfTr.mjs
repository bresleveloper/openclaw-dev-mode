//#region extensions/canvas/src/host/a2ui-shared.ts
const A2UI_PATH = "/__openclaw__/a2ui";
const CANVAS_HOST_PATH = "/__openclaw__/canvas";
function isA2uiPath(pathname) {
	return pathname === "/__openclaw__/a2ui" || pathname.startsWith(`/__openclaw__/a2ui/`);
}
//#endregion
export { CANVAS_HOST_PATH as n, isA2uiPath as r, A2UI_PATH as t };
