//#region src/infra/embedded-mode.ts
let embeddedModeValue = false;
/** Sets the process-local embedded-mode flag used by UI and hosted runtimes. */
function setEmbeddedMode(value) {
	embeddedModeValue = value;
}
/** Returns whether the current process is running inside an embedded OpenClaw host. */
function isEmbeddedMode() {
	return embeddedModeValue;
}
//#endregion
export { setEmbeddedMode as n, isEmbeddedMode as t };
