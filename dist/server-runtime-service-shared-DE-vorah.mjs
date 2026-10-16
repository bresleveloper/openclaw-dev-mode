//#region src/gateway/server-maintenance-lifecycle.ts
async function clearGatewayMaintenanceHandles(maintenance) {
	if (!maintenance) return;
	const failures = (await Promise.allSettled([maintenance.stopPeriodicTasks, maintenance.skillUsageCleanup].map(async (stop) => await stop()))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (failures.length > 0) throw new AggregateError(failures, "Gateway maintenance cleanup failed");
}
//#endregion
//#region src/gateway/server-runtime-service-shared.ts
/** Creates a heartbeat runner placeholder for minimal/test gateway service state. */
function createNoopHeartbeatRunner() {
	return {
		stop: () => {},
		updateConfig: (_cfg) => {}
	};
}
//#endregion
export { clearGatewayMaintenanceHandles as n, createNoopHeartbeatRunner as t };
