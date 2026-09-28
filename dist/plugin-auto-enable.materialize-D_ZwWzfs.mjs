import { a as asOptionalRecord, c as isRecord, i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { _ as resolveConfigDir } from "./utils-aKqR_F_U.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { l as pluginCacheRealpathSync, p as readPluginCacheJsonFile, s as pluginCacheExistsSync } from "./package-manifest-C8sTeZKW.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { i as normalizeChatChannelId } from "./ids-NACrHrny.mjs";
import { l as normalizePluginsConfig } from "./config-state-BEAL5gWH.mjs";
import { l as findUninspectedPluginDiagnostic } from "./discovery-D_5mAUI7.mjs";
import { o as isOfficialExternalPluginId } from "./official-external-plugin-catalog-CzZljLFK.mjs";
import { t as hasExplicitManifestOwnerTrust } from "./manifest-owner-policy-D9DuiaNx.mjs";
import { i as listBundledChannelIdsForPackageState, n as hasBundledChannelPackageState } from "./package-state-probes-lXYCPihJ.mjs";
import { i as listPotentialConfiguredChannelPresenceSignals } from "./config-presence-D97iwlYy.mjs";
import { t as ensurePluginAllowlisted } from "./plugins-allowlist-DGbUrepm.mjs";
import { t as isChannelConfigured } from "./channel-configured-CMGjO82Q.mjs";
import { t as findChatChannelMeta } from "./chat-meta-CrZhPtTU.mjs";
import { i as isNativeSessionCatalogOptOutOnly } from "./native-session-catalog-config-CYC8tjEu.mjs";
import path from "node:path";
//#region src/config/plugin-auto-enable.channels.ts
function normalizeManifestChannelId(channelId) {
	return normalizeChatChannelId(channelId) ?? channelId;
}
function collectPluginIdsForConfiguredChannel(channelId, config, registry) {
	const normalizedChannelId = normalizeManifestChannelId(channelId);
	const builtInId = normalizeChatChannelId(normalizedChannelId);
	const normalizedConfig = normalizePluginsConfig(config.plugins);
	const claims = registry.plugins.filter((record) => (record.origin !== "workspace" || hasExplicitManifestOwnerTrust({
		plugin: record,
		normalizedConfig
	})) && record.channels.some((id) => normalizeManifestChannelId(id) === normalizedChannelId));
	if (claims.length === 0) return builtInId ? [builtInId] : [];
	const claimIds = new Set(claims.map((claim) => claim.id));
	if (builtInId) claimIds.add(builtInId);
	const preferredIds = /* @__PURE__ */ new Set();
	for (const claim of claims) for (const preferredOverId of claim.channelConfigs?.[normalizedChannelId]?.preferOver ?? []) if (claimIds.has(preferredOverId)) {
		preferredIds.add(claim.id);
		preferredIds.add(preferredOverId);
	}
	if (preferredIds.size > 0) return [...preferredIds].toSorted((left, right) => left.localeCompare(right));
	return [claims[0]?.id ?? builtInId ?? normalizedChannelId];
}
function collectAutoEnableChannelIds(cfg, env, discovery, ambientEnvTriggers = "allow") {
	const configuredStateChannelIds = new Set(listBundledChannelIdsForPackageState("configuredState", discovery));
	return listPotentialConfiguredChannelPresenceSignals(cfg, env, {
		includePersistedAuthState: false,
		discovery,
		ambientEnvTriggers
	}).map((signal) => ({
		source: signal.source,
		channelId: normalizeChatChannelId(signal.channelId) ?? signal.channelId
	})).filter(({ channelId, source }) => isAutoEnableConfiguredChannelSignal({
		cfg,
		env,
		channelId,
		source,
		configuredStateChannelIds,
		discovery
	})).map(({ channelId }) => channelId);
}
function isAutoEnableConfiguredChannelSignal(params) {
	if (params.source === "env" && params.configuredStateChannelIds.has(params.channelId) && !hasBundledChannelPackageState({
		metadataKey: "configuredState",
		channelId: params.channelId,
		cfg: params.cfg,
		env: params.env,
		discovery: params.discovery
	})) return false;
	return isChannelConfigured(params.cfg, params.channelId, params.env);
}
function resolveConfiguredChannelAutoEnableCandidates(params) {
	const changes = [];
	for (const channelId of params.configuredChannelIds ?? collectAutoEnableChannelIds(params.config, params.env)) for (const pluginId of collectPluginIdsForConfiguredChannel(channelId, params.config, params.registry)) changes.push({
		pluginId,
		kind: "channel-configured",
		channelId
	});
	return changes;
}
//#endregion
//#region src/config/plugin-auto-enable.prefer-over.ts
/** Maximum bytes to read from an external catalog file before rejecting it. */
const MAX_EXTERNAL_CATALOG_BYTES = 16777216;
const log = createSubsystemLogger("config/plugin-catalog");
const ENV_CATALOG_PATHS = ["OPENCLAW_PLUGIN_CATALOG_PATHS", "OPENCLAW_MPM_CATALOG_PATHS"];
function splitEnvPaths(value) {
	const trimmed = normalizeOptionalString(value) ?? "";
	if (!trimmed) return [];
	return normalizeStringEntries(trimmed.split(/[;,]/g).flatMap((chunk) => chunk.split(path.delimiter)));
}
function resolveExternalCatalogPaths(env) {
	for (const key of ENV_CATALOG_PATHS) {
		const raw = normalizeOptionalString(env[key]);
		if (raw) return splitEnvPaths(raw);
	}
	const configDir = resolveConfigDir(env);
	return [
		path.join(configDir, "mpm", "plugins.json"),
		path.join(configDir, "mpm", "catalog.json"),
		path.join(configDir, "plugins", "catalog.json")
	];
}
function parseExternalCatalogChannelEntries(raw) {
	const list = (() => {
		if (Array.isArray(raw)) return raw;
		if (!isRecord(raw)) return [];
		const entries = raw.entries ?? raw.packages ?? raw.plugins;
		return Array.isArray(entries) ? entries : [];
	})();
	const channels = [];
	for (const entry of list) {
		if (!isRecord(entry) || !isRecord(entry.openclaw) || !isRecord(entry.openclaw.channel)) continue;
		const channel = entry.openclaw.channel;
		const id = normalizeOptionalString(channel.id) ?? "";
		if (!id) continue;
		const preferOver = Array.isArray(channel.preferOver) ? channel.preferOver.filter((value) => typeof value === "string") : [];
		channels.push({
			id,
			preferOver
		});
	}
	return channels;
}
function resolveExternalCatalogPreferOver(channelId, env) {
	for (const rawPath of resolveExternalCatalogPaths(env)) {
		const resolved = resolveUserPath(rawPath, env);
		if (!pluginCacheExistsSync(resolved)) continue;
		try {
			const resolvedRealPath = pluginCacheRealpathSync(resolved);
			if (!resolvedRealPath) continue;
			const payload = readPluginCacheJsonFile(resolvedRealPath, { maxBytes: MAX_EXTERNAL_CATALOG_BYTES });
			if (!payload.ok) throw payload.error;
			const channel = parseExternalCatalogChannelEntries(payload.value).find((entry) => entry.id === channelId);
			if (channel) return channel.preferOver;
		} catch (err) {
			if (err instanceof Error && err.message.startsWith("File exceeds")) log.warn(`skipping oversized external catalog file (max ${MAX_EXTERNAL_CATALOG_BYTES} bytes): ${resolved}`);
		}
	}
	return [];
}
function resolveBuiltInChannelPreferOver(channelId) {
	const builtInChannelId = normalizeChatChannelId(channelId);
	if (!builtInChannelId) return [];
	return findChatChannelMeta(builtInChannelId)?.preferOver ?? [];
}
function resolvePreferredOverIds(candidate, env, registry) {
	const channelId = candidate.kind === "channel-configured" ? candidate.channelId : candidate.pluginId;
	const installedPlugin = registry.plugins.find((record) => record.id === candidate.pluginId);
	const manifestChannelPreferOver = installedPlugin?.channelConfigs?.[channelId]?.preferOver;
	if (manifestChannelPreferOver?.length) return [...manifestChannelPreferOver];
	const installedChannelMeta = installedPlugin?.channelCatalogMeta;
	if (installedChannelMeta?.preferOver?.length) return [...installedChannelMeta.preferOver];
	const builtInChannelPreferOver = resolveBuiltInChannelPreferOver(channelId);
	if (builtInChannelPreferOver.length) return [...builtInChannelPreferOver];
	return resolveExternalCatalogPreferOver(channelId, env);
}
function getPluginAutoEnableCandidateCacheKey(candidate) {
	return `${candidate.pluginId}:${candidate.kind === "channel-configured" ? candidate.channelId : candidate.pluginId}`;
}
function shouldSkipPreferredPluginAutoEnable(params) {
	const getPreferredOverIds = (candidate) => {
		const cacheKey = getPluginAutoEnableCandidateCacheKey(candidate);
		const cached = params.preferOverCache.get(cacheKey);
		if (cached) return cached;
		const resolved = resolvePreferredOverIds(candidate, params.env, params.registry);
		params.preferOverCache.set(cacheKey, resolved);
		return resolved;
	};
	for (const other of params.configured) {
		if (other.pluginId === params.entry.pluginId) continue;
		if (params.isPluginDenied(params.config, other.pluginId) || params.isPluginExplicitlyDisabled(params.config, other.pluginId)) continue;
		if (getPreferredOverIds(other).includes(params.entry.pluginId)) return true;
	}
	return false;
}
//#endregion
//#region src/config/plugin-auto-enable.materialize.ts
function resolvePluginAutoEnableCandidateReason(candidate) {
	switch (candidate.kind) {
		case "channel-configured": return `${candidate.channelId} configured`;
		case "provider-auth-configured": return `${candidate.providerId} auth configured`;
		case "provider-model-configured": return `${candidate.modelRef} model configured`;
		case "speech-provider-selected": return `${candidate.providerId} speech provider selected`;
		case "worker-provider-selected": return `${candidate.providerId} worker provider selected`;
		case "decision-provider-selected": return `${candidate.providerId} decision provider selected`;
		case "agent-harness-runtime-configured": return `${candidate.runtime} agent runtime configured`;
		case "web-search-provider-selected": return `${candidate.providerId} web search provider selected`;
		case "web-fetch-provider-selected": return `${candidate.providerId} web fetch provider selected`;
		case "plugin-web-search-configured": return `${candidate.pluginId} web search configured`;
		case "plugin-web-fetch-configured": return `${candidate.pluginId} web fetch configured`;
		case "plugin-tool-configured": return `${candidate.pluginId} tool configured`;
		case "configured-plugin-repaired": return `${candidate.pluginId} installed for existing configuration`;
		case "setup-auto-enable": return candidate.reason;
	}
	throw new Error("Unsupported plugin auto-enable candidate");
}
function isPluginExplicitlyDisabled(cfg, pluginId) {
	const builtInChannelId = normalizeChatChannelId(pluginId);
	if (builtInChannelId) {
		const channels = cfg.channels;
		if (asOptionalRecord(channels?.[builtInChannelId])?.enabled === false) return true;
	}
	return cfg.plugins?.entries?.[pluginId]?.enabled === false;
}
function isPluginDenied(cfg, pluginId) {
	const deny = cfg.plugins?.deny;
	return Array.isArray(deny) && deny.includes(pluginId);
}
function isPluginExplicitlySelected(cfg, pluginId) {
	const allow = cfg.plugins?.allow;
	if (Array.isArray(allow) && allow.includes(pluginId)) return true;
	return hasMaterialPluginEntryConfig(cfg.plugins?.entries?.[pluginId]);
}
function disableImplicitPreferredOverPlugin(params) {
	if (isPluginExplicitlySelected(params.originalConfig, params.pluginId)) return params.config;
	if (!params.manifestRegistry.plugins.some((plugin) => plugin.id === params.pluginId)) return params.config;
	const existingEntry = params.config.plugins?.entries?.[params.pluginId];
	return {
		...params.config,
		plugins: {
			...params.config.plugins,
			entries: {
				...params.config.plugins?.entries,
				[params.pluginId]: {
					...asOptionalObjectRecord(existingEntry),
					enabled: false
				}
			}
		}
	};
}
function isBuiltInChannelAlreadyEnabled(cfg, channelId) {
	const channels = cfg.channels;
	return asOptionalRecord(channels?.[channelId])?.enabled === true;
}
function resolveAutoEnableChannelId(params) {
	if (params.entry.kind === "configured-plugin-repaired") return null;
	const plugin = params.manifestRegistry.plugins.find((record) => record.id === params.entry.pluginId);
	if (plugin && plugin.origin !== "bundled") {
		if (params.entry.kind !== "channel-configured") return null;
		const channelId = normalizeChatChannelId(params.entry.channelId) ?? params.entry.channelId;
		if ((plugin.channels ?? []).some((id) => (normalizeChatChannelId(id) ?? id) === channelId)) return null;
	}
	const builtInChannelId = normalizeChatChannelId(params.entry.pluginId);
	if (builtInChannelId) return builtInChannelId;
	if (params.entry.kind !== "channel-configured") return null;
	if (plugin?.origin !== "bundled") return null;
	const channelId = normalizeChatChannelId(params.entry.channelId) ?? params.entry.channelId;
	return (plugin.channels ?? []).some((id) => (normalizeChatChannelId(id) ?? id) === channelId) ? channelId : null;
}
function registerPluginEntry(cfg, entry, manifestRegistry) {
	const builtInChannelId = resolveAutoEnableChannelId({
		entry,
		manifestRegistry
	});
	if (builtInChannelId) {
		const channels = cfg.channels;
		return {
			...cfg,
			channels: {
				...cfg.channels,
				[builtInChannelId]: {
					...asOptionalRecord(channels?.[builtInChannelId]),
					enabled: true
				}
			}
		};
	}
	return {
		...cfg,
		plugins: {
			...cfg.plugins,
			entries: {
				...cfg.plugins?.entries,
				[entry.pluginId]: {
					...cfg.plugins?.entries?.[entry.pluginId],
					enabled: true
				}
			}
		}
	};
}
function hasMaterialPluginEntryConfig(entry) {
	if (!isRecord(entry)) return false;
	return entry.enabled === true || isRecord(entry.config) || isRecord(entry.hooks) || isRecord(entry.subagent) || isRecord(entry.llm) || entry.apiKey !== void 0 || entry.env !== void 0;
}
function isKnownPluginId(pluginId, manifestRegistry) {
	if (normalizeChatChannelId(pluginId)) return true;
	return manifestRegistry.plugins.some((plugin) => plugin.id === pluginId) || isOfficialExternalPluginId(pluginId);
}
function materializeConfiguredPluginEntryAllowlist(params) {
	let next = params.config;
	const allow = next.plugins?.allow;
	const entries = asOptionalObjectRecord(next.plugins?.entries);
	if (!Array.isArray(allow) || allow.length === 0 || !entries) return next;
	for (const pluginId of Object.keys(entries).toSorted((left, right) => left.localeCompare(right))) {
		const entry = entries[pluginId];
		if (isNativeSessionCatalogOptOutOnly(pluginId, entry) || !hasMaterialPluginEntryConfig(entry) || isPluginDenied(next, pluginId) || isPluginExplicitlyDisabled(next, pluginId) || allow.includes(pluginId) || !isKnownPluginId(pluginId, params.manifestRegistry)) continue;
		next = ensurePluginAllowlisted(next, pluginId);
		params.changes.push(`${pluginId} plugin config present, added to plugin allowlist.`);
	}
	return next;
}
function resolveChannelAutoEnableDisplayLabel(entry, manifestRegistry) {
	const builtInChannelId = normalizeChatChannelId(entry.channelId);
	const plugin = manifestRegistry.plugins.find((record) => record.id === entry.pluginId);
	return (builtInChannelId ? findChatChannelMeta(builtInChannelId)?.label : void 0) ?? plugin?.channelConfigs?.[entry.channelId]?.label ?? plugin?.channelCatalogMeta?.label;
}
function formatAutoEnableChange(entry, manifestRegistry) {
	if (entry.kind === "channel-configured") {
		const label = resolveChannelAutoEnableDisplayLabel(entry, manifestRegistry);
		if (label) return `${label} configured, enabled automatically.`;
	}
	return `${resolvePluginAutoEnableCandidateReason(entry).trim()}, enabled automatically.`;
}
function materializePluginAutoEnableCandidatesInternal(params) {
	let next = params.config ?? {};
	const changes = [];
	const autoEnabledReasons = /* @__PURE__ */ new Map();
	if (next.plugins?.enabled === false || findUninspectedPluginDiagnostic(params.manifestRegistry.diagnostics)) return {
		config: next,
		changes,
		autoEnabledReasons: {}
	};
	const preferOverCache = /* @__PURE__ */ new Map();
	const workspacePluginIds = new Set(params.manifestRegistry.plugins.filter((plugin) => plugin.origin === "workspace").map((plugin) => plugin.id));
	const normalizedConfig = normalizePluginsConfig(next.plugins);
	const preferenceCandidates = params.candidates.filter((entry) => {
		if (!workspacePluginIds.has(entry.pluginId)) return true;
		return hasExplicitManifestOwnerTrust({
			plugin: { id: entry.pluginId },
			normalizedConfig
		});
	});
	const candidates = preferenceCandidates.filter((entry) => !workspacePluginIds.has(entry.pluginId));
	for (const entry of candidates) {
		const builtInChannelId = resolveAutoEnableChannelId({
			entry,
			manifestRegistry: params.manifestRegistry
		});
		if (isPluginDenied(next, entry.pluginId) || isPluginExplicitlyDisabled(next, entry.pluginId)) continue;
		if (shouldSkipPreferredPluginAutoEnable({
			config: next,
			entry,
			configured: preferenceCandidates,
			env: params.env,
			registry: params.manifestRegistry,
			isPluginDenied,
			isPluginExplicitlyDisabled,
			preferOverCache
		})) {
			next = disableImplicitPreferredOverPlugin({
				config: next,
				originalConfig: params.config ?? {},
				pluginId: entry.pluginId,
				manifestRegistry: params.manifestRegistry
			});
			continue;
		}
		const allow = next.plugins?.allow;
		const hasRestrictiveAllowlist = Array.isArray(allow) && allow.length > 0;
		const allowMissing = hasRestrictiveAllowlist && !allow.includes(entry.pluginId);
		if ((builtInChannelId != null ? isBuiltInChannelAlreadyEnabled(next, builtInChannelId) : next.plugins?.entries?.[entry.pluginId]?.enabled === true) && !allowMissing) continue;
		next = registerPluginEntry(next, entry, params.manifestRegistry);
		if (hasRestrictiveAllowlist) next = ensurePluginAllowlisted(next, entry.pluginId);
		const reason = resolvePluginAutoEnableCandidateReason(entry);
		autoEnabledReasons.set(entry.pluginId, [...autoEnabledReasons.get(entry.pluginId) ?? [], reason]);
		changes.push(formatAutoEnableChange(entry, params.manifestRegistry));
	}
	next = materializeConfiguredPluginEntryAllowlist({
		config: next,
		changes,
		manifestRegistry: params.manifestRegistry
	});
	const autoEnabledReasonRecord = Object.create(null);
	for (const [pluginId, reasons] of autoEnabledReasons) if (!isBlockedObjectKey(pluginId)) autoEnabledReasonRecord[pluginId] = [...reasons];
	return {
		config: next,
		changes,
		autoEnabledReasons: autoEnabledReasonRecord
	};
}
//#endregion
export { resolveConfiguredChannelAutoEnableCandidates as a, collectAutoEnableChannelIds as i, materializePluginAutoEnableCandidatesInternal as n, resolvePluginAutoEnableCandidateReason as r, hasMaterialPluginEntryConfig as t };
