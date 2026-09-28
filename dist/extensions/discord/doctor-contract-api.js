import { n as DISCORD_COMMAND_DEPLOY_HASH_NAMESPACE, t as DISCORD_COMMAND_DEPLOY_HASH_MAX_ENTRIES } from "./.setup/command-deploy-store-DFkBTViB.mjs";
import { n as normalizeCompatibilityConfig, t as legacyConfigRules } from "./.setup/doctor-contract-Co5vRCZ6.mjs";
import { i as sanitizeRecentModels, r as preferenceTimestampMs, t as buildPreferenceModelKey } from "./.setup/model-picker-preference-primitives-BHT1LkR_.mjs";
import { MAX_DATE_TIMESTAMP_MS, timestampMsToIsoString } from "openclaw/plugin-sdk/number-runtime";
import path from "node:path";
import { definePluginDoctorMigrationFromPlans } from "openclaw/plugin-sdk/runtime-doctor-migrations";
import fs from "node:fs";
//#region extensions/discord/src/monitor/model-picker-preferences-migrations.ts
const PREFERENCE_MAX_ENTRIES = 2e3;
const MAX_PLUGIN_STATE_KEY_BYTES = 512;
const textEncoder = new TextEncoder();
function fileExists(filePath) {
	try {
		return fs.statSync(filePath).isFile();
	} catch {
		return false;
	}
}
function readLegacyStore(filePath) {
	try {
		const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
		return parsed && typeof parsed === "object" ? parsed : null;
	} catch {
		return null;
	}
}
function readLegacyThreadBindingsStore(filePath) {
	const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
	if (!parsed || typeof parsed !== "object") throw new Error("legacy Discord thread bindings store must be an object");
	return parsed;
}
function normalizeLegacyPreferenceKey(key) {
	const trimmed = key.trim();
	if (!trimmed || textEncoder.encode(trimmed).length > MAX_PLUGIN_STATE_KEY_BYTES) return;
	return trimmed;
}
function legacyUpdatedAtForIndex(updatedAt, index, total) {
	const baseMs = preferenceTimestampMs(updatedAt);
	const shiftedMs = Math.min(baseMs + Math.max(0, total), MAX_DATE_TIMESTAMP_MS) - Math.max(0, index);
	return timestampMsToIsoString(shiftedMs) ?? timestampMsToIsoString(baseMs) ?? timestampMsToIsoString(Math.max(0, total - index)) ?? "1970-01-01T00:00:00.000Z";
}
function readFiniteNumberField(entry, key) {
	const value = entry[key];
	return typeof value === "number" && Number.isFinite(value) ? Math.floor(value) : void 0;
}
function upgradeLegacyThreadBindingShape(rawEntry) {
	if (!rawEntry || typeof rawEntry !== "object" || Array.isArray(rawEntry)) return rawEntry;
	const entry = { ...rawEntry };
	if (entry.targetSessionKey === void 0 && typeof entry.sessionKey === "string") entry.targetSessionKey = entry.sessionKey;
	delete entry.sessionKey;
	const expiresAt = readFiniteNumberField(entry, "expiresAt");
	delete entry.expiresAt;
	if (entry.idleTimeoutMs === void 0 && entry.maxAgeMs === void 0 && expiresAt !== void 0) {
		entry.idleTimeoutMs = 0;
		if (expiresAt <= 0) entry.maxAgeMs = 0;
		else {
			const boundAt = readFiniteNumberField(entry, "boundAt") ?? 0;
			const lastActivityAt = readFiniteNumberField(entry, "lastActivityAt") ?? 0;
			entry.maxAgeMs = Math.max(1, expiresAt - Math.max(0, boundAt > 0 ? boundAt : lastActivityAt));
		}
	}
	return entry;
}
const detectDiscordLegacyStateMigrations = async ({ stateDir }) => {
	const plans = [];
	const commandDeployCacheSourcePath = path.join(stateDir, "discord", "command-deploy-cache.json");
	if (fileExists(commandDeployCacheSourcePath)) plans.push({
		kind: "plugin-state-import",
		label: "Discord command deployment cache",
		sourcePath: commandDeployCacheSourcePath,
		targetPath: `plugin state:${DISCORD_COMMAND_DEPLOY_HASH_NAMESPACE}`,
		pluginId: "discord",
		namespace: DISCORD_COMMAND_DEPLOY_HASH_NAMESPACE,
		maxEntries: DISCORD_COMMAND_DEPLOY_HASH_MAX_ENTRIES,
		scopeKey: "",
		cleanupSource: "remove",
		cleanupWhenEmpty: true,
		cleanupWarningDisposition: "recoverable",
		readEntries: () => []
	});
	const modelPickerSourcePath = path.join(stateDir, "discord", "model-picker-preferences.json");
	if (fileExists(modelPickerSourcePath)) plans.push({
		kind: "plugin-state-import",
		label: "Discord model picker preferences",
		sourcePath: modelPickerSourcePath,
		targetPath: "plugin state:model-picker-preferences",
		pluginId: "discord",
		namespace: "model-picker-preferences",
		maxEntries: PREFERENCE_MAX_ENTRIES,
		scopeKey: "",
		cleanupSource: "rename",
		readEntries: () => {
			const store = readLegacyStore(modelPickerSourcePath);
			if (!store || !store.entries || typeof store.entries !== "object") return [];
			const out = [];
			for (const [rawKey, rawEntry] of Object.entries(store.entries)) {
				const scopeKey = normalizeLegacyPreferenceKey(rawKey);
				if (!scopeKey || !rawEntry || typeof rawEntry !== "object") continue;
				const recent = sanitizeRecentModels(rawEntry.recent, 10);
				for (const [index, modelRef] of recent.entries()) out.push({
					key: buildPreferenceModelKey(scopeKey, modelRef),
					value: {
						scopeKey,
						modelRef,
						updatedAt: legacyUpdatedAtForIndex(rawEntry.updatedAt, index, recent.length)
					}
				});
			}
			return out;
		}
	});
	const threadBindingsSourcePath = path.join(stateDir, "discord", "thread-bindings.json");
	if (fileExists(threadBindingsSourcePath)) {
		const { normalizePersistedBinding, THREAD_BINDINGS_MAX_ENTRIES, THREAD_BINDINGS_NAMESPACE, toBindingRecordKey } = await import("./.setup/thread-bindings.state-BThFQEga.mjs").then((n) => n.O);
		plans.push({
			kind: "plugin-state-import",
			label: "Discord thread bindings",
			sourcePath: threadBindingsSourcePath,
			targetPath: `plugin state:${THREAD_BINDINGS_NAMESPACE}`,
			pluginId: "discord",
			namespace: THREAD_BINDINGS_NAMESPACE,
			maxEntries: THREAD_BINDINGS_MAX_ENTRIES,
			scopeKey: "",
			cleanupSource: "rename",
			cleanupWhenEmpty: true,
			readEntries: () => {
				const store = readLegacyThreadBindingsStore(threadBindingsSourcePath);
				if (store?.version !== 1 || !store.bindings || typeof store.bindings !== "object") throw new Error("legacy Discord thread bindings store must have version 1 bindings");
				const out = [];
				for (const [rawKey, rawEntry] of Object.entries(store.bindings)) {
					const normalized = normalizePersistedBinding(rawKey, upgradeLegacyThreadBindingShape(rawEntry));
					if (normalized) out.push({
						key: toBindingRecordKey(normalized),
						value: normalized
					});
				}
				return out;
			}
		});
	}
	return plans;
};
//#endregion
//#region extensions/discord/doctor-contract-api.ts
const stateMigrations = [definePluginDoctorMigrationFromPlans({
	id: "discord-legacy-state",
	label: "Discord legacy state",
	resolvePlans: detectDiscordLegacyStateMigrations
})];
//#endregion
export { legacyConfigRules, normalizeCompatibilityConfig, stateMigrations };
