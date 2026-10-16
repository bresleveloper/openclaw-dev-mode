import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/config/recovery-policy.ts
const PLUGIN_ENTRY_PATH_PREFIX = "plugins.entries.";
const PLUGIN_POLICY_PATHS = /* @__PURE__ */ new Set(["plugins.allow", "plugins.deny"]);
const COMPILED_RUNTIME_OUTPUT_DIAGNOSTIC = "compiled runtime output";
const PLUGIN_DIAGNOSTIC_PREFIX_PATTERN = /^plugin\s+([^:\s]+):\s/u;
const PLUGIN_NOT_FOUND_PATTERN = /^plugin not found:\s*([^\s(]+)/u;
function isPluginsPath(path) {
	return path === "plugins" || path.startsWith("plugins.");
}
/** Return true for plugin validation issues caused by missing compiled runtime output. */
function isPluginPackagingRuntimeOutputIssue(issue) {
	const path = issue.path.trim();
	const message = issue.message.trim().toLowerCase();
	return isPluginsPath(path) && message.includes(COMPILED_RUNTIME_OUTPUT_DIAGNOSTIC);
}
function normalizePluginIssueId(value) {
	return value?.trim().toLowerCase() || null;
}
function extractPluginNotFoundIssuePluginId(issue) {
	return isPluginsPath(issue.path.trim()) ? normalizePluginIssueId(PLUGIN_NOT_FOUND_PATTERN.exec(issue.message.trim())?.[1]) : null;
}
/**
* Return true when an invalid config snapshot is blocked only by plugin packaging fallout.
* This lets callers show plugin repair hints instead of treating user config as corrupted.
*/
function isPluginPackagingRuntimeOutputInvalidConfigSnapshot(snapshot) {
	if (snapshot.valid || (snapshot.legacyIssues?.length ?? 0) > 0 || snapshot.issues.length === 0) return false;
	const packagingIssues = [...snapshot.issues, ...snapshot.warnings ?? []].filter(isPluginPackagingRuntimeOutputIssue);
	const packagingPluginIds = new Set(packagingIssues.map((issue) => normalizePluginIssueId(PLUGIN_DIAGNOSTIC_PREFIX_PATTERN.exec(issue.message.trim())?.[1])).filter((pluginId) => pluginId !== null));
	return packagingIssues.length > 0 && snapshot.issues.every((issue) => {
		if (isPluginPackagingRuntimeOutputIssue(issue)) return true;
		const pluginId = extractPluginNotFoundIssuePluginId(issue);
		return pluginId !== null && packagingPluginIds.has(pluginId);
	});
}
/**
* Return true when an invalid config snapshot is scoped entirely to stale plugin refs.
* Whole-file recovery is skipped for these snapshots so plugin cleanup can preserve user config.
*/
function isPluginLocalInvalidConfigSnapshot(snapshot) {
	if (snapshot.valid || snapshot.legacyIssues.length > 0 || snapshot.issues.length === 0) return false;
	return snapshot.issues.every((issue) => {
		const path = issue.path.trim();
		return path.startsWith(PLUGIN_ENTRY_PATH_PREFIX) && path.slice(16).trim().length > 0 || PLUGIN_POLICY_PATHS.has(path) && issue.message.trim().startsWith("plugin not found:");
	});
}
/**
* Decide whether whole-file last-known-good recovery is appropriate for an invalid snapshot.
* Plugin-local failures stay on the current file so targeted plugin cleanup can run.
*/
function shouldAttemptLastKnownGoodRecovery(snapshot) {
	return !snapshot.valid && !isPluginLocalInvalidConfigSnapshot(snapshot);
}
function isSensitiveConfigPath(pathLabel) {
	return /(^|\.)(api[-_]?key|auth|bearer|credential|password|private[-_]?key|secret|token)(\.|$)/i.test(pathLabel);
}
function collectPollutedSecretPlaceholders(value, pathLabel = "", output = []) {
	if (typeof value === "string") {
		const trimmed = value.trim();
		if (trimmed === "***" || trimmed === "[redacted]") {
			output.push(pathLabel || "<root>");
			return output;
		}
		if (isSensitiveConfigPath(pathLabel) && (trimmed.includes("...") || trimmed.includes("…"))) output.push(pathLabel || "<root>");
		return output;
	}
	if (Array.isArray(value)) {
		value.forEach((item, index) => collectPollutedSecretPlaceholders(item, `${pathLabel}[${index}]`, output));
		return output;
	}
	if (isRecord(value)) for (const [key, child] of Object.entries(value)) collectPollutedSecretPlaceholders(child, pathLabel ? `${pathLabel}.${key}` : key, output);
	return output;
}
//#endregion
export { shouldAttemptLastKnownGoodRecovery as i, isPluginLocalInvalidConfigSnapshot as n, isPluginPackagingRuntimeOutputInvalidConfigSnapshot as r, collectPollutedSecretPlaceholders as t };
