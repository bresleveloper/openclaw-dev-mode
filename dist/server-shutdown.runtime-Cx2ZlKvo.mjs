//#region src/gateway/server-shutdown.runtime.ts
async function prepareGatewayShutdownRuntime() {
	const [{ prepareGatewayClose, completeGatewayClose, drainActiveSessionsForShutdown, runGatewayClosePrelude }, { runGlobalGatewayStopSafely }, { flushPendingSessionsChangedEvents }, { closeMcpLoopbackServer }, { stopTaskRegistryMaintenance }, { markRestartAbortedMainSessions }, { disposeAllBundleLspRuntimes }, { drainRetainedOpenAiEmbeddingProviders }, { stopGmailWatcher }, { disposeAllCodeModeRuns }, { closeProviderTransportDispatcherPool }, { prepareActivePluginRegistryShutdown }, { waitForPluginCacheRetirement }] = await Promise.all([
		import("./server-close.runtime.js"),
		import("./plugins/hook-runner-global.js"),
		import("./session-change-event-CvFx1v7-.mjs"),
		import("./mcp-http-C-eUQxbV.mjs"),
		import("./task-registry.maintenance-Bp2j8DUt.mjs"),
		import("./main-session-restart-recovery-x2BD6vuX.mjs"),
		import("./agent-bundle-lsp-runtime-C8LDbWdE.mjs"),
		import("./embeddings-provider-lifetime-C7iXoH4l.mjs"),
		import("./gmail-watcher-N6HKvjrt.mjs"),
		import("./code-mode-state-CtM8ooUM.mjs"),
		import("./provider-transport-dispatcher-pool-u84GT_QT.mjs"),
		import("./runtime-Bp5QGz2j.mjs"),
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
