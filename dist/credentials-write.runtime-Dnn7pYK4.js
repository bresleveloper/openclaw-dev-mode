import { r as createLazyRuntimeModule } from "./lazy-runtime-BgpbKGBP.js";
//#region extensions/matrix/src/matrix/credentials-write.runtime.ts
const loadMatrixCredentialsRuntime = createLazyRuntimeModule(() => import("./credentials-BeduXRdC.js"));
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
