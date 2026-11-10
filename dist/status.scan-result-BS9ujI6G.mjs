//#region src/commands/status.scan-result.ts
/** Flattens overview, gateway, channel, summary, memory, and compatibility inputs into a scan result. */
function buildStatusScanResult(params) {
	const { gatewaySnapshot, advertisedControlUiLinks, ...result } = params;
	const { gatewayCallOverrides: _gatewayCallOverrides, ...gateway } = gatewaySnapshot;
	return {
		...result,
		...advertisedControlUiLinks ? { advertisedControlUiLinks } : {},
		...gateway,
		gatewayProbeAuthWarning: gatewaySnapshot.gatewayProbeAuthWarning,
		localGatewayHealthy: gatewaySnapshot.localGatewayHealthy
	};
}
//#endregion
export { buildStatusScanResult as t };
