//#region src/commands/status-overview-values.ts
function formatHostDesktopStatus(status) {
	if (!status || status.state === "disabled") return "disabled";
	if (status.state === "managed") return status.managedState === "running" ? `managed · running · display :${status.display} · 127.0.0.1:${status.port} · security VncAuth` : status.managedState === "failed" ? `managed · failed: ${status.error}` : status.managedState === "unknown" ? "managed · runtime state unavailable" : `managed · ${status.managedState === "not-started" ? "not started" : "starting"}`;
	return `${status.state} · 127.0.0.1:${status.port}${status.security ? ` · security ${status.security}` : ""}`;
}
function countActiveStatusAgents(params) {
	const activeThresholdMs = params.activeThresholdMs ?? 6e5;
	return params.agentStatus.agents.filter((agent) => agent.lastActiveAgeMs != null && agent.lastActiveAgeMs <= activeThresholdMs).length;
}
/** Formats the status-all agents overview cell. */
function buildStatusAllAgentsValue(params) {
	const activeAgents = countActiveStatusAgents(params);
	return `${params.agentStatus.agents.length} total · ${params.agentStatus.bootstrapPendingCount} bootstrapping · ${activeAgents} active · ${params.agentStatus.totalSessions} sessions`;
}
/** Formats the secrets diagnostics count for overview output. */
function buildStatusSecretsValue(count) {
	return count > 0 ? `${count} diagnostic${count === 1 ? "" : "s"}` : "none";
}
/** Formats queued system-event count for overview output. */
function buildStatusEventsValue(params) {
	return params.queuedSystemEvents.length > 0 ? `${params.queuedSystemEvents.length} queued` : "none";
}
/** Formats whether deep probe data was collected. */
function buildStatusProbesValue(params) {
	return params.health ? params.ok("enabled") : params.muted("skipped (use --deep)");
}
/** Formats plugin compatibility notices as a compact count by notice and plugin. */
function buildStatusPluginCompatibilityValue(params) {
	if (params.notices.length === 0) return params.ok("none");
	const pluginCount = new Set(params.notices.map((notice) => notice.pluginId ?? notice.plugin ?? "")).size;
	return params.warn(`${params.notices.length} notice${params.notices.length === 1 ? "" : "s"} · ${pluginCount} plugin${pluginCount === 1 ? "" : "s"}`);
}
/** Formats stored session count, default model/context, and backing store summary. */
function buildStatusSessionsOverviewValue(params) {
	const defaultCtx = params.sessions.defaults.contextTokens ? ` (${params.formatKTokens(params.sessions.defaults.contextTokens)} ctx)` : "";
	const storeLabel = params.sessions.paths.length > 1 ? `${params.sessions.paths.length} stores` : params.sessions.paths[0] ?? "unknown";
	return `${params.sessions.count} stored · default ${params.sessions.defaults.model ?? "unknown"}${defaultCtx} · ${storeLabel}`;
}
//#endregion
export { buildStatusSecretsValue as a, buildStatusProbesValue as i, buildStatusEventsValue as n, buildStatusSessionsOverviewValue as o, buildStatusPluginCompatibilityValue as r, formatHostDesktopStatus as s, buildStatusAllAgentsValue as t };
