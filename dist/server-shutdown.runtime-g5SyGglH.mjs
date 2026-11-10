//#region src/gateway/server-shutdown.runtime.ts
async function prepareGatewayShutdownRuntime() {
	const [{ prepareGatewayClose, completeGatewayClose, drainActiveSessionsForShutdown, runGatewayClosePrelude }, { runGlobalGatewayStopSafely }, { flushPendingSessionsChangedEvents }, { drainSessionEventPublications }, { closeMcpLoopbackServer }, { markRestartAbortedMainSessions }, { disposeAllBundleLspRuntimes }, { drainRetainedOpenAiEmbeddingProviders }, { stopGmailWatcher }, { stopCronMaintenance }, { disposeAllCodeModeRuns }, { closeProviderTransportDispatcherPool }, { prepareActivePluginRegistryShutdown }, { waitForPluginCacheRetirement }, { loadSubagentSessionCleanupRuntime }] = await Promise.all([
		import("./server-close.runtime.js"),
		import("./plugins/hook-runner-global.js"),
		import("./session-change-event-BVoaT_E4.mjs"),
		import("./session-event-prepared-row-D-lFPeV2.mjs"),
		import("./mcp-http-B99WYsXv.mjs"),
		import("./main-session-restart-recovery-BBdP2m5e.mjs"),
		import("./agent-bundle-lsp-runtime-A6is_Cr4.mjs"),
		import("./embeddings-provider-lifetime-ouceEZy6.mjs"),
		import("./gmail-watcher-C1dDDvD6.mjs"),
		import("./maintenance-B0-QKfYN.mjs"),
		import("./code-mode-state-BqU78l-R.mjs"),
		import("./provider-transport-dispatcher-pool-B5vw4wIs.mjs"),
		import("./runtime-BDZ4lDip.mjs"),
		import("./plugin-cache-B1jqWOmJ.mjs"),
		import("./subagent-session-cleanup-DeyThtgS.mjs")
	]);
	await Promise.all([prepareActivePluginRegistryShutdown(), loadSubagentSessionCleanupRuntime()]);
	return {
		prepareGatewayClose,
		completeGatewayClose,
		drainActiveSessionsForShutdown,
		runGatewayClosePrelude,
		runGlobalGatewayStopSafely,
		flushPendingSessionsChangedEvents,
		drainSessionEventPublications,
		closeMcpLoopbackServer,
		markRestartAbortedMainSessions,
		disposeAllBundleLspRuntimes,
		drainRetainedOpenAiEmbeddingProviders,
		stopGmailWatcher,
		stopCronMaintenance,
		disposeAllCodeModeRuns,
		closeProviderTransportDispatcherPool,
		waitForPluginCacheRetirement
	};
}
//#endregion
export { prepareGatewayShutdownRuntime };
