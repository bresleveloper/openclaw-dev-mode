import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import { a as asOptionalRecord, c as isRecord, i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import "./utils-DgZn2dLu.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { a as copyConfigResolutionFactsThroughRewrite } from "./resolution-facts-HH1cnmIY.mjs";
import { l as pluginCacheRealpathSync, p as readPluginCacheJsonFile, s as pluginCacheExistsSync } from "./package-manifest-CEbdS_C4.mjs";
import { i as normalizeChatChannelId } from "./ids-BFfFS5ep.mjs";
import { u as normalizePluginsConfig } from "./config-state-DY_WJYue.mjs";
import { u as findUninspectedPluginDiagnostic } from "./discovery-Dma3bVNk.mjs";
import { o as isOfficialExternalPluginId } from "./official-external-plugin-catalog-DWheKC4x.mjs";
import { i as listBundledChannelIdsForPackageState, n as hasBundledChannelPackageState } from "./package-state-probes-DT9QRO40.mjs";
import { r as listPotentialConfiguredChannelPresenceSignals } from "./config-presence-bjA_OXo5.mjs";
import { t as hasExplicitManifestOwnerTrust } from "./manifest-owner-policy-B2H7kBCF.mjs";
import { a as findChatChannelMeta } from "./registry-B3Y-vjit.mjs";
import { t as ensurePluginAllowlisted } from "./plugins-allowlist-DGbUrepm.mjs";
import { t as isChannelConfigured } from "./channel-configured-CfgGCCVe.mjs";
import { i as isNativeSessionCatalogOptOutOnly } from "./native-session-catalog-config-Cw2NJHbW.mjs";
import { n as resolveExternalPluginCatalogPaths, t as parseExternalPluginCatalogEntries } from "./plugin-catalog-source-AYVlnf_X.mjs";
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
function collectAutoEnableChannelIds(cfg, env, discovery, ambientEnvTriggers) {
	const configuredStateChannelIds = new Set(listBundledChannelIdsForPackageState("configuredState", discovery));
	return listPotentialConfiguredChannelPresenceSignals(cfg, env, {
		includePersistedAuthState: false,
		discovery,
		ambientEnvTriggers
	}).flatMap((signal) => {
		const channelId = normalizeManifestChannelId(signal.channelId);
		if (signal.source === "env" && configuredStateChannelIds.has(channelId) && !hasBundledChannelPackageState({
			metadataKey: "configuredState",
			channelId,
			cfg,
			env,
			discovery
		})) return [];
		return isChannelConfigured(cfg, channelId, env) ? [channelId] : [];
	});
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
function resolveExternalCatalogPreferOver(channelId, env) {
	for (const rawPath of resolveExternalPluginCatalogPaths({ env })) {
		const resolved = resolveUserPath(rawPath, env);
		if (!pluginCacheExistsSync(resolved)) continue;
		try {
			const resolvedRealPath = pluginCacheRealpathSync(resolved);
			if (!resolvedRealPath) continue;
			const payload = readPluginCacheJsonFile(resolvedRealPath, { maxBytes: MAX_EXTERNAL_CATALOG_BYTES });
			if (!payload.ok) throw payload.error;
			for (const entry of parseExternalPluginCatalogEntries(payload.value)) {
				const channel = isRecord(entry.openclaw) ? entry.openclaw.channel : void 0;
				if (!isRecord(channel) || normalizeOptionalString(channel.id) !== channelId) continue;
				return Array.isArray(channel.preferOver) ? channel.preferOver.filter((value) => typeof value === "string") : [];
			}
		} catch (err) {
			if (err instanceof Error && err.message.startsWith("File exceeds")) log.warn(`skipping oversized external catalog file (max ${MAX_EXTERNAL_CATALOG_BYTES} bytes): ${resolved}`);
		}
	}
	return [];
}
function resolvePreferredOverIds(candidate, env, registry) {
	const channelId = candidate.kind === "channel-configured" ? candidate.channelId : candidate.pluginId;
	const installedPlugin = registry.plugins.find((record) => record.id === candidate.pluginId);
	const manifestChannelPreferOver = installedPlugin?.channelConfigs?.[channelId]?.preferOver;
	if (manifestChannelPreferOver?.length) return [...manifestChannelPreferOver];
	const installedChannelMeta = installedPlugin?.channelCatalogMeta;
	if (installedChannelMeta?.preferOver?.length) return [...installedChannelMeta.preferOver];
	const builtInChannelId = normalizeChatChannelId(channelId);
	const builtInChannelPreferOver = builtInChannelId ? findChatChannelMeta(builtInChannelId)?.preferOver : void 0;
	if (builtInChannelPreferOver?.length) return [...builtInChannelPreferOver];
	return resolveExternalCatalogPreferOver(channelId, env);
}
function shouldSkipPreferredPluginAutoEnable(params) {
	const getPreferredOverIds = (candidate) => {
		const cacheKey = `${candidate.pluginId}:${candidate.kind === "channel-configured" ? candidate.channelId : candidate.pluginId}`;
		const cached = params.preferOverCache.get(cacheKey);
		if (cached) return cached;
		const resolved = resolvePreferredOverIds(candidate, params.env, params.registry);
		params.preferOverCache.set(cacheKey, resolved);
		return resolved;
	};
	return params.configured.some((other) => other.pluginId !== params.entry.pluginId && !params.isPluginDenied(params.config, other.pluginId) && !params.isPluginExplicitlyDisabled(params.config, other.pluginId) && getPreferredOverIds(other).includes(params.entry.pluginId));
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
		case "storage-provider-selected": return `${candidate.providerId} storage provider selected`;
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
function resolveAutoEnableChannelId(params) {
	if (params.entry.kind === "configured-plugin-repaired") return null;
	const plugin = params.manifestRegistry.plugins.find((record) => record.id === params.entry.pluginId);
	const channelId = params.entry.kind === "channel-configured" ? normalizeChatChannelId(params.entry.channelId) ?? params.entry.channelId : null;
	const claimsChannel = channelId !== null && (plugin?.channels ?? []).some((id) => (normalizeChatChannelId(id) ?? id) === channelId);
	if (plugin && plugin.origin !== "bundled" && (channelId === null || claimsChannel)) return null;
	return normalizeChatChannelId(params.entry.pluginId) ?? (plugin?.origin === "bundled" && claimsChannel ? channelId : null);
}
function registerPluginEntry(cfg, entry, builtInChannelId) {
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
function formatAutoEnableChange(entry, manifestRegistry) {
	if (entry.kind === "channel-configured") {
		const builtInChannelId = normalizeChatChannelId(entry.channelId);
		const plugin = manifestRegistry.plugins.find((record) => record.id === entry.pluginId);
		const label = (builtInChannelId ? findChatChannelMeta(builtInChannelId)?.label : void 0) ?? plugin?.channelConfigs?.[entry.channelId]?.label ?? plugin?.channelCatalogMeta?.label;
		if (label) return `${label} configured, enabled automatically.`;
	}
	return `${resolvePluginAutoEnableCandidateReason(entry).trim()}, enabled automatically.`;
}
function materializePluginAutoEnableCandidatesInternal(params) {
	let next = params.config ?? {};
	const changes = [];
	const autoEnabledReasons = Object.create(null);
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
		if ((builtInChannelId != null ? asOptionalRecord(next.channels?.[builtInChannelId])?.enabled === true : next.plugins?.entries?.[entry.pluginId]?.enabled === true) && !allowMissing) continue;
		next = registerPluginEntry(next, entry, builtInChannelId);
		if (hasRestrictiveAllowlist) next = ensurePluginAllowlisted(next, entry.pluginId);
		const reason = resolvePluginAutoEnableCandidateReason(entry);
		if (!isBlockedObjectKey(entry.pluginId)) (autoEnabledReasons[entry.pluginId] ??= []).push(reason);
		changes.push(formatAutoEnableChange(entry, params.manifestRegistry));
	}
	next = materializeConfiguredPluginEntryAllowlist({
		config: next,
		changes,
		manifestRegistry: params.manifestRegistry
	});
	if (next !== params.config) copyConfigResolutionFactsThroughRewrite(params.config, next);
	return {
		config: next,
		changes,
		autoEnabledReasons
	};
}
//#endregion
export { resolveConfiguredChannelAutoEnableCandidates as i, materializePluginAutoEnableCandidatesInternal as n, collectAutoEnableChannelIds as r, hasMaterialPluginEntryConfig as t };
