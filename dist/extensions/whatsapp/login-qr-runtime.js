// extensions/whatsapp/login-qr-runtime.ts
async function startWebLoginWithQr(...args) {
	const { startWebLoginWithQr: startWebLoginWithQrLocal } = await import("./.setup/login-qr-CFV1qhFc.mjs");
	return await startWebLoginWithQrLocal(...args);
}
async function waitForWebLogin(...args) {
	const { waitForWebLogin: waitForWebLoginLocal } = await import("./.setup/login-qr-CFV1qhFc.mjs");
	return await waitForWebLoginLocal(...args);
}
export { startWebLoginWithQr, waitForWebLogin };
