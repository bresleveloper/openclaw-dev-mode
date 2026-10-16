//#region src/gateway/server-shutdown.runtime.ts
async function prepareGatewayShutdownRuntime() {
	const [{ prepareGatewayClose, completeGatewayClose, drainActiveSessionsForShutdown, runGatewayClosePrelude }, { runGlobalGatewayStopSafely }, { flushPendingSessionsChangedEvents }, { drainSessionEventPublications }, { closeMcpLoopbackServer }, { markRestartAbortedMainSessions }, { disposeAllBundleLspRuntimes }, { drainRetainedOpenAiEmbeddingProviders }, { stopGmailWatcher }, { stopCronMaintenance }, { disposeAllCodeModeRuns }, { closeProviderTransportDispatcherPool }, { prepareActivePluginRegistryShutdown }, { waitForPluginCacheRetirement }, { loadSubagentSessionCleanupRuntime }] = await Promise.all([
		import("./server-close.runtime.js"),
		import("./plugins/hook-runner-global.js"),
		import("./session-change-event-B-8MjzW2.mjs"),
		import("./session-event-prepared-row-Dr_u-8QU.mjs"),
		import("./mcp-http-QFiYA06n.mjs"),
		import("./main-session-restart-recovery-CRcOoTnm.mjs"),
		import("./agent-bundle-lsp-runtime-mxhx3pML.mjs"),
		import("./embeddings-provider-lifetime-bYyw9RTe.mjs"),
		import("./gmail-watcher-DKTowLMZ.mjs"),
		import("./maintenance-CR192Kbk.mjs"),
		import("./code-mode-state-Bu_5cDuB.mjs"),
		import("./provider-transport-dispatcher-pool-CIlvbSmB.mjs"),
		import("./runtime-H3kSuoER.mjs"),
		import("./plugin-cache-C7OQTvG6.mjs"),
		import("./subagent-session-cleanup-CShih9Ta.mjs")
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
