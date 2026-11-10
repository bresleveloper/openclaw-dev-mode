//#region src/infra/gateway-drain.ts
/** The inspector owns the scope; waiting never discovers or cancels other work. */
async function waitForGatewayDrain(inspect, timeoutMs, options) {
	const startedAt = Date.now();
	const deadlineAt = typeof timeoutMs === "number" && Number.isFinite(timeoutMs) ? startedAt + Math.max(0, Math.floor(timeoutMs)) : void 0;
	while (true) {
		const snapshot = inspect();
		options.onSnapshot?.(snapshot);
		const elapsedMs = Date.now() - startedAt;
		const remainingMs = deadlineAt === void 0 ? void 0 : deadlineAt - Date.now();
		if (snapshot.idle || remainingMs !== void 0 && remainingMs <= 0) return {
			drained: snapshot.idle,
			elapsedMs,
			snapshot
		};
		await new Promise((resolve) => {
			const timer = setTimeout(resolve, Math.min(options.pollMs, remainingMs ?? Infinity));
			if (options.ref === false) timer.unref();
		});
	}
}
function formatGatewayDrainCounts(snapshot) {
	return Object.entries(snapshot.counts).filter(([name, count]) => name !== "totalActive" && count > 0).map(([name, count]) => `${name}=${count}`).join(" ");
}
//#endregion
export { waitForGatewayDrain as n, formatGatewayDrainCounts as t };
