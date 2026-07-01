//#region extensions/whatsapp/login-qr-runtime.ts
let loginQrModulePromise = null;
function loadLoginQrModule() {
	loginQrModulePromise ??= import("./login-qr-UzKCI8hH.js");
	return loginQrModulePromise;
}
async function startWebLoginWithQr(...args) {
	const { startWebLoginWithQr: startWebLoginWithQrLocal } = await loadLoginQrModule();
	return await startWebLoginWithQrLocal(...args);
}
async function waitForWebLogin(...args) {
	const { waitForWebLogin: waitForWebLoginLocal } = await loadLoginQrModule();
	return await waitForWebLoginLocal(...args);
}
//#endregion
export { waitForWebLogin as n, startWebLoginWithQr as t };
