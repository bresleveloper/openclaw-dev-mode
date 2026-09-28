import { p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
//#region src/cli/plugins-list-format.ts
function formatPluginBundleFormat(bundleFormat) {
	return bundleFormat === "agent" ? "agent (Agent Plugins)" : bundleFormat;
}
/** Snapshot status describes enablement; only explicit runtime inspection reports loading. */
function formatPluginStatus(plugin, runtimeInspection = false) {
	if (plugin.status === "error") return theme.error("error");
	return (runtimeInspection ? plugin.status === "loaded" : plugin.enabled) ? theme.success(runtimeInspection ? "loaded" : "enabled") : theme.warn("disabled");
}
function formatPluginLine(plugin) {
	const name = theme.command(plugin.name || plugin.id);
	const idSuffix = plugin.name && plugin.name !== plugin.id ? theme.muted(` (${plugin.id})`) : "";
	const format = plugin.format ?? "openclaw";
	const parts = [
		`${name}${idSuffix} ${formatPluginStatus(plugin)}`,
		`  format: ${format}`,
		`  source: ${theme.muted(shortenHomePath(plugin.source))}`,
		`  origin: ${plugin.origin}`
	];
	if (plugin.bundleFormat) parts.push(`  bundle format: ${formatPluginBundleFormat(plugin.bundleFormat)}`);
	if (plugin.bundleCapabilities?.length) parts.push(`  bundle capabilities: ${plugin.bundleCapabilities.join(", ")}`);
	if (plugin.version) parts.push(`  version: ${plugin.version}`);
	if (plugin.activated !== void 0) parts.push(`  activated: ${plugin.activated ? "yes" : "no"}`);
	if (plugin.imported !== void 0) parts.push(`  imported: ${plugin.imported ? "yes" : "no"}`);
	if (plugin.explicitlyEnabled !== void 0) parts.push(`  explicitly enabled: ${plugin.explicitlyEnabled ? "yes" : "no"}`);
	if (plugin.activationSource) parts.push(`  activation source: ${plugin.activationSource}`);
	if (plugin.activationReason) parts.push(`  activation reason: ${sanitizeTerminalText(plugin.activationReason)}`);
	if (plugin.providerIds.length > 0) parts.push(`  providers: ${plugin.providerIds.join(", ")}`);
	if (plugin.activated !== void 0 || plugin.activationSource || plugin.activationReason) {
		const activationSummary = plugin.activated === false ? "inactive" : plugin.activationSource ?? (plugin.activated ? "active" : "inactive");
		parts.push(`  activation: ${activationSummary}`);
	}
	if (plugin.status === "error" && plugin.error) parts.push(theme.error(`  error: ${plugin.error}`));
	return parts.join("\n");
}
//#endregion
export { formatPluginLine as n, formatPluginStatus as r, formatPluginBundleFormat as t };
