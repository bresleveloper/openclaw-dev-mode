//#region extensions/whatsapp/login-qr-runtime.ts
async function startWebLoginWithQr(...args) {
	const { startWebLoginWithQr: startWebLoginWithQrLocal } = await import("./.setup/login-qr-BpUg-7uW.mjs");
	return await startWebLoginWithQrLocal(...args);
}
async function waitForWebLogin(...args) {
	const { waitForWebLogin: waitForWebLoginLocal } = await import("./.setup/login-qr-BpUg-7uW.mjs");
	return await waitForWebLoginLocal(...args);
}
//#endregion
export { startWebLoginWithQr, waitForWebLogin };
