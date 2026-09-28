//#region src/commands/status.scan-result.ts
/** Flattens overview, gateway, channel, summary, memory, and compatibility inputs into a scan result. */
function buildStatusScanResult(params) {
	const { gatewaySnapshot, advertisedControlUiLinks, ...result } = params;
	return {
		...result,
		...advertisedControlUiLinks ? { advertisedControlUiLinks } : {},
		gatewayConnection: gatewaySnapshot.gatewayConnection,
		remoteUrlMissing: gatewaySnapshot.remoteUrlMissing,
		gatewayMode: gatewaySnapshot.gatewayMode,
		gatewayProbeAuth: gatewaySnapshot.gatewayProbeAuth,
		gatewayProbeAuthWarning: gatewaySnapshot.gatewayProbeAuthWarning,
		gatewayProbe: gatewaySnapshot.gatewayProbe,
		gatewayReachable: gatewaySnapshot.gatewayReachable,
		gatewaySelf: gatewaySnapshot.gatewaySelf
	};
}
//#endregion
export { buildStatusScanResult as t };
