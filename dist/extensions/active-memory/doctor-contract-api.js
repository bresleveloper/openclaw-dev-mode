import { r as asNullableRecord } from "../../record-coerce-DItp3I4t.mjs";
import { r as defineLegacyJsonStateMigration } from "../../runtime-doctor-migrations-_pMXigSc.mjs";
import path from "node:path";
import crypto from "node:crypto";
//#region extensions/active-memory/doctor-contract-api.ts
/**
* Doctor migration contract for Active Memory state. It moves legacy per-session
* toggle JSON into the plugin state keyed store used by current runtimes.
*/
const TOGGLE_STATE_FILE = "session-toggles.json";
const SESSION_TOGGLES_NAMESPACE = "session-toggles";
const MAX_TOGGLE_ENTRIES = 1e4;
/** Retired Active Memory QMD override detected before strict manifest validation. */
const legacyConfigRules = [{
	path: [
		"plugins",
		"entries",
		"active-memory",
		"config",
		"qmd"
	],
	message: "plugins.entries.active-memory.config.qmd is retired because the QMD memory backend was removed. Run \"openclaw doctor --fix\"."
}];
/** Removes the retired plugin-owned QMD override. */
function normalizeCompatibilityConfig({ cfg }) {
	const entry = asNullableRecord(cfg.plugins?.entries?.["active-memory"]);
	const pluginConfig = asNullableRecord(entry?.config);
	if (!pluginConfig || !Object.hasOwn(pluginConfig, "qmd")) return {
		config: cfg,
		changes: []
	};
	const nextConfig = structuredClone(cfg);
	const nextEntry = asNullableRecord(nextConfig.plugins?.entries?.["active-memory"]);
	const nextPluginConfig = asNullableRecord(nextEntry?.config);
	if (!nextPluginConfig) return {
		config: cfg,
		changes: []
	};
	delete nextPluginConfig.qmd;
	return {
		config: nextConfig,
		changes: ["Removed retired Active Memory QMD search-mode configuration."]
	};
}
function resolveToggleStatePath(stateDir) {
	return path.join(stateDir, "plugins", "active-memory", TOGGLE_STATE_FILE);
}
function activeMemoryToggleKey(sessionKey) {
	return crypto.createHash("sha256").update(sessionKey, "utf8").digest("hex");
}
function normalizeLegacyUpdatedAt(value) {
	return typeof value === "number" && Number.isFinite(value) ? value : Date.now();
}
function parseLegacyToggleEntries(parsed) {
	if (!parsed || typeof parsed !== "object") return null;
	const sessions = parsed.sessions;
	if (!sessions || typeof sessions !== "object" || Array.isArray(sessions)) return null;
	const entries = [];
	for (const [sessionKey, value] of Object.entries(sessions)) {
		if (!sessionKey.trim() || !value || typeof value !== "object" || Array.isArray(value)) continue;
		if (value.disabled !== true) continue;
		const updatedAt = normalizeLegacyUpdatedAt(value.updatedAt);
		entries.push({
			sessionKey,
			disabled: true,
			updatedAt
		});
	}
	return entries;
}
/** State migrations exposed to OpenClaw doctor for Active Memory. */
const stateMigrations = [defineLegacyJsonStateMigration({
	id: "active-memory-session-toggles-json-to-plugin-state",
	label: "Active Memory session toggles",
	resolvePath: resolveToggleStatePath,
	parse: parseLegacyToggleEntries,
	namespace: SESSION_TOGGLES_NAMESPACE,
	maxEntries: MAX_TOGGLE_ENTRIES,
	capacityPrecheck: { warning: ({ available, missing }) => `Skipped Active Memory session toggle migration because plugin state has room for ${available} of ${missing} missing entries; left legacy source in place` },
	describeEntries: (entries) => ({
		preview: [`- Active Memory session toggles: ${entries.length} ${entries.length === 1 ? "entry" : "entries"} -> plugin state (${SESSION_TOGGLES_NAMESPACE})`],
		change: ({ imported }) => imported > 0 ? `Migrated ${imported} Active Memory session toggle ${imported === 1 ? "entry" : "entries"} -> plugin state` : null
	}),
	toRows: (entries) => entries.map((entry) => ({
		key: activeMemoryToggleKey(entry.sessionKey),
		value: entry
	}))
})];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };
