import { asNullableRecord, isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __reExport = (target, mod, secondTarget) => (__copyProps(target, mod, "default"), secondTarget && __copyProps(secondTarget, mod, "default"));
//#endregion
//#region packages/normalization-core/src/record-coerce.ts
/** Type guard for non-array object records at browser-safe boundaries. */
function isRecord$1(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
/** Returns a non-array record or null. */
function asNullableRecord$1(value) {
	return isRecord$1(value) ? value : null;
}
//#endregion
//#region src/config/channel-config-normalization.ts
/** Applies one channel-specific doctor migration to every object-shaped account. */
function normalizeChannelAccounts(params) {
	const rawAccounts = asNullableRecord$1(params.entry.accounts);
	if (!rawAccounts) return {
		entry: params.entry,
		changed: false
	};
	let changed = false;
	const accounts = { ...rawAccounts };
	for (const [accountId, value] of Object.entries(rawAccounts)) {
		const account = asNullableRecord$1(value);
		if (!account) continue;
		const normalized = params.normalizeAccount({
			account,
			accountId,
			pathPrefix: `${params.pathPrefix}.accounts.${accountId}`,
			changes: params.changes
		});
		if (normalized.changed) {
			accounts[accountId] = normalized.entry;
			changed = true;
		}
	}
	return changed ? {
		entry: {
			...params.entry,
			accounts
		},
		changed: true
	} : {
		entry: params.entry,
		changed: false
	};
}
/** Applies the same channel-specific doctor migration at root and account scope. */
function normalizeChannelConfigEntries(params) {
	const changes = params.changes ?? [];
	const channels = params.cfg.channels;
	const entry = asNullableRecord$1(channels?.[params.channelId]);
	if (!entry) return {
		config: params.cfg,
		changes
	};
	const channelPath = `channels.${params.channelId}`;
	const root = params.normalizeEntry({
		entry,
		pathPrefix: channelPath,
		changes
	});
	const accounts = normalizeChannelAccounts({
		entry: root.entry,
		pathPrefix: channelPath,
		changes,
		normalizeAccount: (accountParams) => params.normalizeEntry({
			entry: accountParams.account,
			accountId: accountParams.accountId,
			pathPrefix: accountParams.pathPrefix,
			changes: accountParams.changes
		})
	});
	if (!root.changed && !accounts.changed) return {
		config: params.cfg,
		changes
	};
	return {
		config: {
			...params.cfg,
			channels: {
				...channels,
				[params.channelId]: accounts.entry
			}
		},
		changes
	};
}
//#endregion
//#region src/plugin-sdk/legacy-webhook-listener-migration.ts
/** Preserve explicitly configured webhook listeners while moving ingress onto Gateway routes. */
function createLegacyWebhookListenerDoctorContract(params) {
	const portKey = params.portKey ?? "webhookPort";
	const hostKey = params.hostKey === void 0 ? "webhookHost" : params.hostKey;
	const source = (entry) => params.webhookKey ? asNullableRecord$1(entry[params.webhookKey]) : entry;
	const hasLegacy = (value) => {
		const entry = asNullableRecord$1(value);
		const listener = entry && source(entry);
		return Boolean(listener && (Object.hasOwn(listener, portKey) || hostKey && Object.hasOwn(listener, hostKey)));
	};
	const prefix = `channels.${params.channelKey}`;
	return {
		historicalWebhookListener: {
			channelId: params.channelKey,
			port: params.defaultPort,
			preserveAuthoredActivation: params.preserveAuthoredActivation,
			...params.defaultHost === void 0 ? {} : { host: params.defaultHost }
		},
		legacyConfigRules: [{
			path: ["channels", params.channelKey],
			message: `${prefix} webhook listeners moved to Gateway routes. Run "openclaw doctor --fix" to preserve explicitly configured listener settings as legacyWebhook.`,
			match: (value) => {
				const accounts = asNullableRecord$1(asNullableRecord$1(value)?.accounts);
				return hasLegacy(value) || Object.values(accounts ?? {}).some(hasLegacy);
			}
		}],
		normalizeCompatibilityConfig: ({ cfg }) => {
			const root = asNullableRecord$1(asNullableRecord$1(cfg.channels)?.[params.channelKey]);
			const inherited = root && source(root);
			const canonicalRoot = asNullableRecord$1(root?.legacyWebhook);
			return normalizeChannelConfigEntries({
				cfg,
				channelId: params.channelKey,
				normalizeEntry: ({ entry, accountId, pathPrefix, changes }) => {
					const listener = source(entry);
					if (!listener || !hasLegacy(entry)) return {
						entry,
						changed: false
					};
					const next = { ...entry };
					const port = Object.hasOwn(listener, portKey) ? listener[portKey] : (accountId ? canonicalRoot?.port ?? inherited?.[portKey] : void 0) ?? params.defaultPort;
					const inheritedHost = accountId ? canonicalRoot ? canonicalRoot.host : (hostKey ? inherited?.[hostKey] : void 0) ?? params.defaultHost : params.defaultHost;
					const host = hostKey ? listener[hostKey] ?? inheritedHost : inheritedHost;
					const legacyPath = [pathPrefix, params.webhookKey].filter(Boolean).join(".");
					if (Object.hasOwn(entry, "legacyWebhook")) changes.push(`Removed ${legacyPath} legacy listener keys; ${pathPrefix}.legacyWebhook is already configured.`);
					else if (accountId && root?.legacyWebhook === false) changes.push(`Removed ${legacyPath} legacy listener keys; ${prefix}.legacyWebhook: false keeps this account's inherited listener disabled.`);
					else {
						next.legacyWebhook = {
							port,
							...host !== void 0 ? { host } : {}
						};
						changes.push(`Moved ${legacyPath} listener settings to ${pathPrefix}.legacyWebhook. Point the external callback or reverse proxy at the Gateway port and webhook path, verify delivery, then set legacyWebhook: false to disable legacy forwarding.`);
					}
					const updated = params.webhookKey ? { ...listener } : next;
					delete updated[portKey];
					if (hostKey) delete updated[hostKey];
					if (params.webhookKey) {
						if (Object.keys(updated).length) next[params.webhookKey] = updated;
						else delete next[params.webhookKey];
					}
					return {
						entry: next,
						changed: true
					};
				}
			});
		}
	};
}
//#endregion
//#region \0openclaw:bundled-sdk:openclaw/plugin-sdk/runtime-doctor-migrations
var runtime_doctor_migrations_exports = /* @__PURE__ */ __exportAll({ createLegacyWebhookListenerDoctorContract: () => createLegacyWebhookListenerDoctorContract });
import * as import_openclaw_plugin_sdk_runtime_doctor_migrations from "openclaw/plugin-sdk/runtime-doctor-migrations";
__reExport(runtime_doctor_migrations_exports, import_openclaw_plugin_sdk_runtime_doctor_migrations);
//#endregion
//#region extensions/amazon-bedrock/config-compat.ts
/**
* Legacy config migration for Amazon Bedrock discovery settings. It moves
* old `models.bedrockDiscovery` config into plugin-local config shape.
*/
const LEGACY_PATH = "models.bedrockDiscovery";
const TARGET_PATH = "plugins.entries.amazon-bedrock.config.discovery";
function ensureRecord(root, key) {
	const existing = root[key];
	if (isRecord(existing)) return existing;
	const next = {};
	root[key] = next;
	return next;
}
function resolveLegacyBedrockDiscoveryConfig(raw) {
	if (!isRecord(raw)) return;
	const models = asNullableRecord(raw.models);
	return asNullableRecord(models?.bedrockDiscovery) ?? void 0;
}
function pruneEmptyModelsRoot(root) {
	const models = asNullableRecord(root.models);
	if (models && Object.keys(models).length === 0) delete root.models;
}
/** Migrate legacy Bedrock discovery config into `plugins.entries.amazon-bedrock.config`. */
function migrateAmazonBedrockLegacyConfig(raw) {
	if (!isRecord(raw)) return {
		config: raw,
		changes: []
	};
	const legacy = resolveLegacyBedrockDiscoveryConfig(raw);
	if (!legacy) return {
		config: raw,
		changes: []
	};
	const nextRoot = structuredClone(raw);
	const models = ensureRecord(nextRoot, "models");
	delete models.bedrockDiscovery;
	pruneEmptyModelsRoot(nextRoot);
	const changes = [];
	if (Object.keys(legacy).length === 0) {
		changes.push(`Removed empty ${LEGACY_PATH}.`);
		return {
			config: nextRoot,
			changes
		};
	}
	const config = ensureRecord(ensureRecord(ensureRecord(ensureRecord(nextRoot, "plugins"), "entries"), "amazon-bedrock"), "config");
	const existing = asNullableRecord(config.discovery) ?? void 0;
	if (!existing) {
		config.discovery = { ...legacy };
		changes.push(`Moved ${LEGACY_PATH} → ${TARGET_PATH}.`);
		return {
			config: nextRoot,
			changes
		};
	}
	const merged = { ...existing };
	(0, runtime_doctor_migrations_exports.mergeMissing)(merged, legacy);
	config.discovery = merged;
	if (JSON.stringify(merged) !== JSON.stringify(existing)) {
		changes.push(`Merged ${LEGACY_PATH} → ${TARGET_PATH} (filled missing fields from legacy; kept explicit plugin config values).`);
		return {
			config: nextRoot,
			changes
		};
	}
	changes.push(`Removed ${LEGACY_PATH} (${TARGET_PATH} already set).`);
	return {
		config: nextRoot,
		changes
	};
}
//#endregion
export { migrateAmazonBedrockLegacyConfig as t };
