import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
//#region extensions/whatsapp/login-qr-runtime.ts
const loadLoginQrModule = createLazyRuntimeModule(() => import("./.setup/login-qr-B90zLAiS.mjs"));
async function startWebLoginWithQr(...args) {
	const { startWebLoginWithQr: startWebLoginWithQrLocal } = await loadLoginQrModule();
	return await startWebLoginWithQrLocal(...args);
}
async function waitForWebLogin(...args) {
	const { waitForWebLogin: waitForWebLoginLocal } = await loadLoginQrModule();
	return await waitForWebLoginLocal(...args);
}
//#endregion
export { startWebLoginWithQr, waitForWebLogin };
