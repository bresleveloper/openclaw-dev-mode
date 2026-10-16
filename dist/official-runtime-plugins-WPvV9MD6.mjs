//#region src/plugins/official-runtime-plugins.ts
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
	versionBoundToOpenClaw: true,
	minimumCompatibleVersion: "2026.9.7"
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
//#endregion
export { resolveConfiguredRuntimePluginInstallCandidate as i, VERSION_BOUND_RUNTIME_PLUGIN_IDS as n, VERSION_BOUND_RUNTIME_PLUGIN_POLICY_IDS_BY_SURFACE as r, CONFIGURED_RUNTIME_PLUGIN_INSTALL_CANDIDATES as t };
