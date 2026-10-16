//#region src/commands/gateway-startup-timing.ts
function resolveGatewayStartupTiming() {
	const windows = process.platform === "win32";
	return {
		deadlineMs: windows ? 9e4 : 45e3,
		probeTimeoutMs: windows ? 15e3 : 1e4
	};
}
//#endregion
export { resolveGatewayStartupTiming as t };
