//#region src/gateway/server-shutdown.runtime.ts
async function prepareGatewayShutdownRuntime() {
	const [{ prepareGatewayClose, completeGatewayClose, drainActiveSessionsForShutdown, runGatewayClosePrelude }, { runGlobalGatewayStopSafely }, { flushPendingSessionsChangedEvents }, { drainSessionEventPublications }, { closeMcpLoopbackServer }, { markRestartAbortedMainSessions }, { disposeAllBundleLspRuntimes }, { drainRetainedOpenAiEmbeddingProviders }, { stopGmailWatcher }, { stopCronMaintenance }, { disposeAllCodeModeRuns }, { closeProviderTransportDispatcherPool }, { prepareActivePluginRegistryShutdown }, { waitForPluginCacheRetirement }, { loadSubagentSessionCleanupRuntime }] = await Promise.all([
		import("./server-close.runtime.js"),
		import("./plugins/hook-runner-global.js"),
		import("./session-change-event-BBeWI0r2.mjs"),
		import("./session-event-prepared-row-BOeBfdAU.mjs"),
		import("./mcp-http-DfkbA3yf.mjs"),
		import("./main-session-restart-recovery-DmlrrezG.mjs"),
		import("./agent-bundle-lsp-runtime-mxhx3pML.mjs"),
		import("./embeddings-provider-lifetime-bYyw9RTe.mjs"),
		import("./gmail-watcher-bElfJsz7.mjs"),
		import("./maintenance-B8A-Kijh.mjs"),
		import("./code-mode-state-DMEWZG9M.mjs"),
		import("./provider-transport-dispatcher-pool-CIlvbSmB.mjs"),
		import("./runtime-DZJLuLMr.mjs"),
		import("./plugin-cache-C7OQTvG6.mjs"),
		import("./subagent-session-cleanup-DT2Xpwej.mjs")
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
