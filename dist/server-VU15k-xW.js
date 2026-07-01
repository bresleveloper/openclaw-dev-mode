import { t as truncateCloseReason } from "./close-reason-4zH9gzER.js";
//#region src/gateway/server.ts
function emitStartupTrace(name, durationMs, totalMs) {
	if (!process.env.OPENCLAW_GATEWAY_STARTUP_TRACE) return;
	process.stderr.write(`[gateway] startup trace: ${name} ${durationMs.toFixed(1)}ms total=${totalMs.toFixed(1)}ms\n`);
}
async function loadServerImpl() {
	const startupStartedAt = performance.now();
	const before = performance.now();
	try {
		return await import("./server.impl-Bu9Nlrpo.js");
	} finally {
		const now = performance.now();
		emitStartupTrace("gateway.server-impl-import", now - before, now - startupStartedAt);
	}
}
/** Starts the gateway server after lazily loading the full server implementation. */
async function startGatewayServer(...args) {
	return await (await loadServerImpl()).startGatewayServer(...args);
}
/** Clears the server implementation's model-catalog cache between tests. */
async function resetModelCatalogCacheForTest() {
	await (await loadServerImpl()).resetModelCatalogCacheForTest();
}
//#endregion
export { resetModelCatalogCacheForTest, startGatewayServer, truncateCloseReason };
