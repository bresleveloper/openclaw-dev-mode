//#region src/gateway/server-shutdown.runtime.ts
async function prepareGatewayShutdownRuntime() {
	const [{ prepareGatewayClose, completeGatewayClose, drainActiveSessionsForShutdown, runGatewayClosePrelude }, { runGlobalGatewayStopSafely }, { flushPendingSessionsChangedEvents }, { closeMcpLoopbackServer }, { stopTaskRegistryMaintenance }, { markRestartAbortedMainSessions }, { disposeAllBundleLspRuntimes }, { drainRetainedOpenAiEmbeddingProviders }, { stopGmailWatcher }, { disposeAllCodeModeRuns }, { closeProviderTransportDispatcherPool }, { prepareActivePluginRegistryShutdown }, { waitForPluginCacheRetirement }] = await Promise.all([
		import("./server-close.runtime.js"),
		import("./plugins/hook-runner-global.js"),
		import("./session-change-event-DUpEJPXg.mjs"),
		import("./mcp-http-C41a945u.mjs"),
		import("./task-registry.maintenance-C1r3rlBh.mjs"),
		import("./main-session-restart-recovery-BmvAB1L8.mjs"),
		import("./agent-bundle-lsp-runtime-C8LDbWdE.mjs"),
		import("./embeddings-provider-lifetime-C7iXoH4l.mjs"),
		import("./gmail-watcher-D2qkfbMt.mjs"),
		import("./code-mode-state-C2hQMBDV.mjs"),
		import("./provider-transport-dispatcher-pool-u84GT_QT.mjs"),
		import("./runtime-BHWxdDfk.mjs"),
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
