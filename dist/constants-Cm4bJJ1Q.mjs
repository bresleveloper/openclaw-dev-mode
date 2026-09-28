const CANVAS_DOCUMENTS_PATH = `/__openclaw__/canvas/documents`;
/** Keep the historical Canvas plugin scope so existing capability URLs remain valid. */
const CANVAS_NODE_CAPABILITY = {
	surface: "canvas",
	scopeKey: "canvas:canvas"
};
/** Returns true only for the core-owned Canvas document subtree. */
function isCanvasDocumentHttpPath(pathname) {
	return pathname.startsWith(`${CANVAS_DOCUMENTS_PATH}/`);
}
/** Resolves auth for any canonicalized candidate targeting core Canvas documents. */
function resolveCanvasNodeCapability(pathCandidates) {
	return pathCandidates.some(isCanvasDocumentHttpPath) ? CANVAS_NODE_CAPABILITY : void 0;
}
/** Adds the core Canvas surface while removing stale plugin-owned duplicates. */
function withCoreCanvasNodeCapability(surfaces, enabled = true) {
	const withoutStaleCanvas = surfaces.filter((entry) => entry.surface.trim() !== CANVAS_NODE_CAPABILITY.surface);
	return enabled ? [CANVAS_NODE_CAPABILITY, ...withoutStaleCanvas] : withoutStaleCanvas;
}
//#endregion
export { withCoreCanvasNodeCapability as i, isCanvasDocumentHttpPath as n, resolveCanvasNodeCapability as r, CANVAS_DOCUMENTS_PATH as t };
