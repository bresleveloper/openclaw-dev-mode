//#region src/gateway/server-shutdown.runtime.ts
async function prepareGatewayShutdownRuntime() {
	const [{ prepareGatewayClose, completeGatewayClose, drainActiveSessionsForShutdown, runGatewayClosePrelude }, { runGlobalGatewayStopSafely }, { flushPendingSessionsChangedEvents }, { closeMcpLoopbackServer }, { stopTaskRegistryMaintenance }, { markRestartAbortedMainSessions }, { disposeAllBundleLspRuntimes }, { drainRetainedOpenAiEmbeddingProviders }, { stopGmailWatcher }, { disposeAllCodeModeRuns }, { closeProviderTransportDispatcherPool }, { prepareActivePluginRegistryShutdown }, { waitForPluginCacheRetirement }] = await Promise.all([
		import("./server-close.runtime.js"),
		import("./plugins/hook-runner-global.js"),
		import("./session-change-event-CkMFZD_o.mjs"),
		import("./mcp-http-DBCvLZvF.mjs"),
		import("./task-registry.maintenance-B6YyvefO.mjs"),
		import("./main-session-restart-recovery-C5gDP3KZ.mjs"),
		import("./agent-bundle-lsp-runtime-C8LDbWdE.mjs"),
		import("./embeddings-provider-lifetime-C7iXoH4l.mjs"),
		import("./gmail-watcher-C6PrUbqm.mjs"),
		import("./code-mode-state-D_cgHD2Q.mjs"),
		import("./provider-transport-dispatcher-pool-u84GT_QT.mjs"),
		import("./runtime-Dnbq1jEu.mjs"),
		import("./plugin-cache-B8iOCWkW.mjs")
	]);
	await prepareActivePluginRegistryShutdown();
	return {
		prepareGatewayClose,
		completeGatewayClose,
		drainActiveSessionsForShutdown,
		runGatewayClosePrelude,
		runGlobalGatewayStopSafely,
		flushPendingSessionsChangedEvents,
		closeMcpLoopbackServer,
		stopTaskRegistryMaintenance,
		markRestartAbortedMainSessions,
		disposeAllBundleLspRuntimes,
		drainRetainedOpenAiEmbeddingProviders,
		stopGmailWatcher,
		disposeAllCodeModeRuns,
		closeProviderTransportDispatcherPool,
		waitForPluginCacheRetirement
	};
}
//#endregion
export { prepareGatewayShutdownRuntime };
