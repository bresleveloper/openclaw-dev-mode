//#region extensions/canvas/src/host/a2ui-shared.ts
/** Stable hosted paths for Canvas-owned widget resources. */
/** Hosted path prefix for bundled A2UI renderer assets. */
const A2UI_PATH = "/__openclaw__/a2ui";
/** Hosted path prefix for managed widget documents. */
const CANVAS_HOST_PATH = "/__openclaw__/canvas";
/** Returns whether a URL path targets the hosted A2UI asset surface. */
function isA2uiPath(pathname) {
	return pathname === "/__openclaw__/a2ui" || pathname.startsWith(`/__openclaw__/a2ui/`);
}
//#endregion
export { CANVAS_HOST_PATH as n, isA2uiPath as r, A2UI_PATH as t };
