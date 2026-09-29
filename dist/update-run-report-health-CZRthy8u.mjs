//#region src/infra/update-run-report-health.ts
/** A read-only observation of the recorded endpoint, never a new update verdict. */
async function readUpdateRunReportHealth(verification, options = {}) {
	if (verification.port === void 0) return { kind: "unavailable" };
	try {
		const { confirmGatewayReachable } = await import("./restart-health-probe-Dxxhehv-.mjs");
		const health = await confirmGatewayReachable({
			port: verification.port,
			...options
		});
		return health.reachable && health.gatewayVersion ? {
			kind: "responding",
			version: health.gatewayVersion
		} : { kind: "unavailable" };
	} catch {
		return { kind: "unavailable" };
	}
}
//#endregion
export { readUpdateRunReportHealth as t };
