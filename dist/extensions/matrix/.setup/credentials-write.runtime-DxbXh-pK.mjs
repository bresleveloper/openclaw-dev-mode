import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
//#region extensions/matrix/src/matrix/credentials-write.runtime.ts
const loadMatrixCredentialsRuntime = createLazyRuntimeModule(() => import("./credentials-BGKfiaJW.mjs"));
async function saveMatrixCredentials(...args) {
	return (await loadMatrixCredentialsRuntime()).saveMatrixCredentials(...args);
}
async function saveBackfilledMatrixDeviceId(...args) {
	return (await loadMatrixCredentialsRuntime()).saveBackfilledMatrixDeviceId(...args);
}
async function touchMatrixCredentials(...args) {
	return (await loadMatrixCredentialsRuntime()).touchMatrixCredentials(...args);
}
//#endregion
export { saveBackfilledMatrixDeviceId, saveMatrixCredentials, touchMatrixCredentials };
