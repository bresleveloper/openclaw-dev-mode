//#region src/agents/prepared-model-runtime.startup-status.ts
let startupStatus;
/** Diagnostic projection of the publication owner; reads never start acquisition. */
function getPreparedModelRuntimeStartupStatus() {
	return startupStatus;
}
function setPreparedModelRuntimeStartupStatus(value) {
	startupStatus = value;
}
//#endregion
export { setPreparedModelRuntimeStartupStatus as n, getPreparedModelRuntimeStartupStatus as t };
