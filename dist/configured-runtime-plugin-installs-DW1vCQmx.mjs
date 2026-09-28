import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as collectConfiguredAgentHarnessRuntimes } from "./harness-runtimes-DBwiH9TR.mjs";
//#region src/commands/doctor/shared/configured-runtime-plugin-installs.ts
const CONFIGURED_RUNTIME_PLUGIN_INSTALL_CANDIDATES = [{
	pluginId: "acpx",
	label: "ACPX Runtime",
	npmSpec: "@openclaw/acpx",
	trustedSourceLinkedOfficialInstall: true
}, {
	pluginId: "codex",
	label: "Codex",
	npmSpec: "@openclaw/codex",
	trustedSourceLinkedOfficialInstall: true,
	versionBoundToOpenClaw: true
}];
const VERSION_BOUND_RUNTIME_PLUGIN_IDS = new Set(CONFIGURED_RUNTIME_PLUGIN_INSTALL_CANDIDATES.filter((candidate) => candidate.versionBoundToOpenClaw).map((candidate) => candidate.pluginId));
const VERSION_BOUND_RUNTIME_PLUGIN_POLICY_IDS_BY_SURFACE = {
	allow: VERSION_BOUND_RUNTIME_PLUGIN_IDS,
	deny: VERSION_BOUND_RUNTIME_PLUGIN_IDS,
	entries: VERSION_BOUND_RUNTIME_PLUGIN_IDS
};
/** Resolve the official install candidate for a configured runtime id. */
function resolveConfiguredRuntimePluginInstallCandidate(runtimeId) {
	return CONFIGURED_RUNTIME_PLUGIN_INSTALL_CANDIDATES.find((candidate) => candidate.pluginId === runtimeId);
}
function acpxRuntimeIsConfigured(cfg) {
	const acp = asOptionalRecord(cfg.acp);
	const backend = typeof acp?.backend === "string" ? acp.backend.trim().toLowerCase() : "";
	return (backend === "acpx" || acp?.enabled === true || asOptionalRecord(acp?.dispatch)?.enabled === true) && (!backend || backend === "acpx");
}
/** Collect runtime ids without loading plugin metadata during startup planning. */
function collectConfiguredRuntimeIds(cfg, options) {
	const ids = new Set(collectConfiguredAgentHarnessRuntimes(cfg, options));
	if (acpxRuntimeIsConfigured(cfg)) ids.add("acpx");
	return [...ids].toSorted((left, right) => left.localeCompare(right));
}
//#endregion
export { resolveConfiguredRuntimePluginInstallCandidate as a, collectConfiguredRuntimeIds as i, VERSION_BOUND_RUNTIME_PLUGIN_IDS as n, VERSION_BOUND_RUNTIME_PLUGIN_POLICY_IDS_BY_SURFACE as r, CONFIGURED_RUNTIME_PLUGIN_INSTALL_CANDIDATES as t };
