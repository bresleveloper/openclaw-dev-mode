import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as formatTokenCount } from "./token-format-BRba24iW.mjs";
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
function buildStatusAllAgentsValue(params) {
	const activeAgents = countActiveStatusAgents(params);
	return `${params.agentStatus.agents.length} total · ${params.agentStatus.bootstrapPendingCount} bootstrapping · ${activeAgents} active · ${params.agentStatus.totalSessions} sessions`;
}
function buildStatusSecretsValue(count) {
	return count > 0 ? `${count} diagnostic${count === 1 ? "" : "s"}` : "none";
}
function buildStatusEventsValue(params) {
	return params.queuedSystemEvents.length > 0 ? `${params.queuedSystemEvents.length} queued` : "none";
}
function buildStatusProbesValue(params) {
	return params.health ? theme.success("enabled") : theme.muted("skipped (use --deep)");
}
function buildStatusPluginCompatibilityValue(params) {
	if (params.notices.length === 0) return theme.success("none");
	const pluginCount = new Set(params.notices.map((notice) => notice.pluginId ?? notice.plugin ?? "")).size;
	return theme.warn(`${params.notices.length} notice${params.notices.length === 1 ? "" : "s"} · ${pluginCount} plugin${pluginCount === 1 ? "" : "s"}`);
}
function buildStatusSessionsOverviewValue(params) {
	const defaultCtx = params.sessions.defaults.contextTokens ? ` (${formatTokenCount(params.sessions.defaults.contextTokens)} ctx)` : "";
	const storeLabel = params.sessions.paths.length > 1 ? `${params.sessions.paths.length} stores` : params.sessions.paths[0] ?? "unknown";
	return `${params.sessions.count} stored · default ${params.sessions.defaults.model ?? "unknown"}${defaultCtx} · ${storeLabel}`;
}
//#endregion
export { buildStatusSecretsValue as a, formatHostDesktopStatus as c, buildStatusProbesValue as i, buildStatusEventsValue as n, buildStatusSessionsOverviewValue as o, buildStatusPluginCompatibilityValue as r, countActiveStatusAgents as s, buildStatusAllAgentsValue as t };
