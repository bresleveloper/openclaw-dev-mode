//#region src/process/supervisor/service-child-protocol.ts
function encodeServiceChildMessage(message) {
	return `${JSON.stringify(message)}\n`;
}
function supportsNodeWorkerProcessOwner(platform = process.platform) {
	return platform === "linux" || platform === "darwin";
}
//#endregion
export { supportsNodeWorkerProcessOwner as n, encodeServiceChildMessage as t };
