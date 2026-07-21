import { r as createLazyRuntimeModule } from "./lazy-runtime-BgpbKGBP.js";
//#region extensions/whatsapp/login-qr-runtime.ts
const loadLoginQrModule = createLazyRuntimeModule(() => import("./login-qr-B39xKrn7.js"));
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
