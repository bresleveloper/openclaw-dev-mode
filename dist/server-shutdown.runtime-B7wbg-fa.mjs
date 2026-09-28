//#region src/gateway/server-shutdown.runtime.ts
async function prepareGatewayShutdownRuntime() {
	const [{ prepareGatewayClose, completeGatewayClose, drainActiveSessionsForShutdown, runGatewayClosePrelude }, { runGlobalGatewayStopSafely }, { flushPendingSessionsChangedEvents }, { closeMcpLoopbackServer }, { stopTaskRegistryMaintenance }, { markRestartAbortedMainSessions }, { disposeAllBundleLspRuntimes }, { drainRetainedOpenAiEmbeddingProviders }, { stopGmailWatcher }, { disposeAllCodeModeRuns }, { closeProviderTransportDispatcherPool }, { prepareActivePluginRegistryShutdown }, { waitForPluginCacheRetirement }] = await Promise.all([
		import("./server-close.runtime.js"),
		import("./plugins/hook-runner-global.js"),
		import("./session-change-event-C4HsIHlC.mjs"),
		import("./mcp-http-KHwRWVq6.mjs"),
		import("./task-registry.maintenance-DpeVtl6M.mjs"),
		import("./main-session-restart-recovery-BCS2H6TT.mjs"),
		import("./agent-bundle-lsp-runtime-C8LDbWdE.mjs"),
		import("./embeddings-provider-lifetime-C7iXoH4l.mjs"),
		import("./gmail-watcher-CmV9DZ9w.mjs"),
		import("./code-mode-state-DcLI-KgR.mjs"),
		import("./provider-transport-dispatcher-pool-u84GT_QT.mjs"),
		import("./runtime-_Jm6s-iG.mjs"),
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
