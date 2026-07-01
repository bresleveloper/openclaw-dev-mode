import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { o as isRecord$1 } from "./record-coerce-DHZ4bFlT.js";
import { y as resolveStateDir } from "./paths-DyelItkH.js";
import { i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import { _ as uniqueStrings, d as normalizeTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
import { c as isBundledSourceOverlayPath } from "./discovery-DM5vTQts.js";
import { c as isRecord$2, f as resolveConfigDir, m as resolveUserPath } from "./utils-BApvfmPs.js";
import { t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import { a as listOfficialExternalChannelEnvVars } from "./official-external-plugin-catalog-0lYbGRYY.js";
import { n as normalizeAccountId } from "./account-id-5IgE9UKY.js";
import { u as normalizeAgentId } from "./session-key-pTKRJb0m.js";
import { n as getCachedPluginModuleLoader } from "./plugin-module-loader-cache-BUYaqF6E.js";
import { t as listChannelCatalogEntries } from "./channel-catalog-registry-BokgJgGN.js";
import { h as resolveExistingPluginModulePath, m as loadChannelPluginModule } from "./bundled-rTRi0B0q.js";
import { r as listBundledChannelIds } from "./bootstrap-registry-DdTgUtyx.js";
import { i as hasNonEmptyString } from "./channel-target-C1SvT627.js";
import fs, { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import os from "node:os";
//#region packages/model-catalog-core/src/configured-model-refs.ts
/** Narrow unknown values to plain records. */
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
/** Agent config keys that can contain direct model references. */
const AGENT_MODEL_CONFIG_KEYS = [
	"model",
	"imageModel",
	"imageGenerationModel",
	"videoGenerationModel",
	"musicGenerationModel",
	"voiceModel",
	"pdfModel"
];
/** Collect configured model references from agents, channels, hooks, and message config. */
function collectConfiguredModelRefs(config, options = {}) {
	const refs = [];
	const pushModelRef = (path, value) => {
		if (typeof value === "string" && value.trim()) refs.push({
			path,
			value: value.trim()
		});
	};
	const collectModelConfig = (path, value) => {
		if (typeof value === "string") {
			pushModelRef(path, value);
			return;
		}
		if (!isRecord(value)) return;
		pushModelRef(`${path}.primary`, value.primary);
		if (Array.isArray(value.fallbacks)) for (const [index, entry] of value.fallbacks.entries()) pushModelRef(`${path}.fallbacks.${index}`, entry);
	};
	const collectFromAgent = (path, agent) => {
		if (!isRecord(agent)) return;
		for (const key of AGENT_MODEL_CONFIG_KEYS) collectModelConfig(`${path}.${key}`, agent[key]);
		pushModelRef(`${path}.heartbeat.model`, isRecord(agent.heartbeat) ? agent.heartbeat.model : void 0);
		collectModelConfig(`${path}.subagents.model`, isRecord(agent.subagents) ? agent.subagents.model : void 0);
		if (isRecord(agent.compaction)) {
			pushModelRef(`${path}.compaction.model`, agent.compaction.model);
			pushModelRef(`${path}.compaction.memoryFlush.model`, isRecord(agent.compaction.memoryFlush) ? agent.compaction.memoryFlush.model : void 0);
		}
		if (isRecord(agent.models)) for (const modelRef of Object.keys(agent.models)) pushModelRef(`${path}.models.${modelRef}`, modelRef);
	};
	const root = isRecord(config) ? config : {};
	const agents = isRecord(root.agents) ? root.agents : {};
	collectFromAgent("agents.defaults", agents.defaults);
	if (Array.isArray(agents.list)) for (const [index, entry] of agents.list.entries()) collectFromAgent(`agents.list.${index}`, entry);
	if (options.includeChannelModelOverrides !== false) {
		const channels = isRecord(root.channels) ? root.channels : {};
		const modelByChannel = isRecord(channels.modelByChannel) ? channels.modelByChannel : {};
		for (const [channelId, channelMap] of Object.entries(modelByChannel)) {
			if (!isRecord(channelMap)) continue;
			for (const [targetId, modelRef] of Object.entries(channelMap)) pushModelRef(`channels.modelByChannel.${channelId}.${targetId}`, modelRef);
		}
	}
	const hooks = isRecord(root.hooks) ? root.hooks : {};
	if (Array.isArray(hooks.mappings)) for (const [index, mapping] of hooks.mappings.entries()) pushModelRef(`hooks.mappings.${index}.model`, isRecord(mapping) ? mapping.model : void 0);
	pushModelRef("hooks.gmail.model", isRecord(hooks.gmail) ? hooks.gmail.model : void 0);
	pushModelRef("messages.tts.summaryModel", isRecord(root.messages) && isRecord(root.messages.tts) ? root.messages.tts.summaryModel : void 0);
	pushModelRef("channels.discord.voice.model", isRecord(root.channels) && isRecord(root.channels.discord) && isRecord(root.channels.discord.voice) ? root.channels.discord.voice.model : void 0);
	return refs;
}
/** Collect only configured model reference values. */
function collectConfiguredModelRefValues(config, options) {
	return collectConfiguredModelRefs(config, options).map((ref) => ref.value);
}
//#endregion
//#region src/channels/plugins/package-state-probes.ts
/**
* Bundled channel package-state probes.
*
* Resolves lightweight configured/auth state checkers from package metadata and source overlays.
*/
const log = createSubsystemLogger("channels");
const sourcePackageStateLoaderCache = /* @__PURE__ */ new Map();
function isSourceModulePath(modulePath) {
	return /\.(?:c|m)?tsx?$/iu.test(modulePath);
}
function loadChannelPackageStateModule(params) {
	try {
		return loadChannelPluginModule(params);
	} catch (error) {
		if (!isSourceModulePath(params.modulePath)) throw error;
		return getCachedPluginModuleLoader({
			cache: sourcePackageStateLoaderCache,
			modulePath: params.modulePath,
			importerUrl: import.meta.url,
			tryNative: true,
			cacheScopeKey: "channel-package-state"
		})(params.modulePath);
	}
}
function hasNonEmptyEnvValue(env, key) {
	return typeof env?.[key] === "string" && env[key].trim().length > 0;
}
function resolveSourceBundledPluginRoot(rootDir) {
	const pluginRoot = path.resolve(rootDir);
	const extensionsDir = path.dirname(pluginRoot);
	if (path.basename(extensionsDir) !== "extensions") return null;
	const packageRoot = path.dirname(extensionsDir);
	if (path.basename(packageRoot) === "dist" || path.basename(packageRoot) === "dist-runtime") return null;
	return {
		packageRoot,
		dirName: path.basename(pluginRoot)
	};
}
function isBundledSourceOverlayPluginRoot(rootDir) {
	const pluginRoot = path.resolve(rootDir);
	return isBundledSourceOverlayPath({ sourcePath: pluginRoot }) || path.basename(path.dirname(pluginRoot)) === "extensions" && isBundledSourceOverlayPath({ sourcePath: path.dirname(pluginRoot) });
}
function listBuiltBundledPackageStateModules(params) {
	if (isBundledSourceOverlayPluginRoot(params.rootDir)) return [];
	const sourceRoot = resolveSourceBundledPluginRoot(params.rootDir);
	if (!sourceRoot) return [];
	const locations = [];
	for (const rootDir of [path.join(sourceRoot.packageRoot, "dist", "extensions", sourceRoot.dirName), path.join(sourceRoot.packageRoot, "dist-runtime", "extensions", sourceRoot.dirName)]) {
		const modulePath = resolveExistingPluginModulePath(rootDir, params.specifier);
		if (fs.existsSync(modulePath) && !isSourceModulePath(modulePath)) locations.push({
			modulePath,
			rootDir
		});
	}
	return locations;
}
function resolveChannelPackageStateModuleLocation(params) {
	return {
		modulePath: resolveExistingPluginModulePath(params.entry.rootDir, params.specifier),
		rootDir: params.entry.rootDir
	};
}
function listChannelPackageStateModuleLocations(params) {
	const source = resolveChannelPackageStateModuleLocation(params);
	return [...listBuiltBundledPackageStateModules({
		rootDir: params.entry.rootDir,
		specifier: params.specifier
	}).filter((location) => location.modulePath !== source.modulePath), source];
}
function resolveChannelPackageStateMetadata(entry, metadataKey) {
	const metadata = entry.channel[metadataKey];
	if (!metadata || typeof metadata !== "object") return null;
	const specifier = normalizeOptionalString(metadata.specifier) ?? "";
	const exportName = normalizeOptionalString(metadata.exportName) ?? "";
	const envMetadata = "env" in metadata ? metadata.env : void 0;
	const allOf = normalizeTrimmedStringList(envMetadata?.allOf);
	const anyOf = normalizeTrimmedStringList(envMetadata?.anyOf);
	const env = allOf.length > 0 || anyOf.length > 0 ? {
		allOf,
		anyOf
	} : void 0;
	if ((!specifier || !exportName) && !env) return null;
	return {
		...specifier ? { specifier } : {},
		...exportName ? { exportName } : {},
		...env ? { env } : {}
	};
}
function listChannelPackageStateCatalog(metadataKey, discovery) {
	return listChannelCatalogEntries({
		origin: "bundled",
		discovery
	}).filter((entry) => Boolean(resolveChannelPackageStateMetadata(entry, metadataKey)));
}
function resolveChannelPackageStateChecker(params) {
	const metadata = resolveChannelPackageStateMetadata(params.entry, params.metadataKey);
	if (!metadata) return null;
	if (metadata.env) return ({ env }) => {
		const allOf = metadata.env?.allOf ?? [];
		const anyOf = metadata.env?.anyOf ?? [];
		return allOf.every((key) => hasNonEmptyEnvValue(env, key)) && (anyOf.length === 0 || anyOf.some((key) => hasNonEmptyEnvValue(env, key)));
	};
	let loadError;
	for (const location of listChannelPackageStateModuleLocations({
		entry: params.entry,
		specifier: metadata.specifier
	})) try {
		const checker = loadChannelPackageStateModule({
			modulePath: location.modulePath,
			rootDir: location.rootDir
		})[metadata.exportName];
		if (typeof checker !== "function") throw new Error(`missing ${params.metadataKey} export ${metadata.exportName}`);
		return checker;
	} catch (error) {
		loadError = error;
	}
	if (loadError) {
		const detail = formatErrorMessage(loadError);
		log.warn(`[channels] failed to load ${params.metadataKey} checker for ${params.entry.pluginId}: ${detail}`);
	}
	return null;
}
function resolvePackageStateChannelId(entry) {
	return normalizeOptionalString(entry.channel.id);
}
/**
* Lists bundled channel ids that declare the requested package-state metadata.
*/
function listBundledChannelIdsForPackageState(metadataKey, discovery) {
	return listChannelPackageStateCatalog(metadataKey, discovery).map((entry) => resolvePackageStateChannelId(entry)).filter((channelId) => Boolean(channelId)).toSorted((left, right) => left.localeCompare(right));
}
/**
* Returns whether a bundled channel reports configured/auth package state.
*/
function hasBundledChannelPackageState(params) {
	const requestedChannelId = normalizeOptionalString(params.channelId);
	const entry = listChannelPackageStateCatalog(params.metadataKey, params.discovery).find((candidate) => resolvePackageStateChannelId(candidate) === requestedChannelId);
	if (!entry) return false;
	const checker = resolveChannelPackageStateChecker({
		entry,
		metadataKey: params.metadataKey
	});
	return checker ? checker({
		cfg: params.cfg,
		env: params.env
	}) : false;
}
//#endregion
//#region src/channels/plugins/persisted-auth-state.ts
/**
* Lists bundled channels that declare persisted-auth state metadata.
*/
function listBundledChannelIdsWithPersistedAuthState(discovery) {
	return listBundledChannelIdsForPackageState("persistedAuthState", discovery);
}
/**
* Returns whether a bundled channel reports persisted auth state.
*/
function hasBundledChannelPersistedAuthState(params) {
	return hasBundledChannelPackageState({
		metadataKey: "persistedAuthState",
		channelId: params.channelId,
		cfg: params.cfg,
		env: params.env,
		discovery: params.discovery
	});
}
//#endregion
//#region src/channels/config-presence.ts
/**
* Channel configuration presence detection.
*
* Finds channels made available by config, env, persisted auth, or plugin discovery signals.
*/
const IGNORED_CHANNEL_CONFIG_KEYS = new Set(["defaults", "modelByChannel"]);
/** Returns true when a channel config entry contains settings beyond enabled/disabled state. */
function hasMeaningfulChannelConfig(value) {
	if (!isRecord$2(value)) return false;
	return Object.keys(value).some((key) => key !== "enabled");
}
/** Lists channels explicitly disabled in config so activation logic can suppress auto-detection. */
function listExplicitlyDisabledChannelIdsForConfig(cfg) {
	const channels = isRecord$2(cfg.channels) ? cfg.channels : null;
	if (!channels) return [];
	return Object.entries(channels).filter(([, value]) => isRecord$2(value) && value.enabled === false).map(([channelId]) => normalizeOptionalLowercaseString(channelId)).filter((channelId) => Boolean(channelId));
}
function listChannelEnvPrefixes(channelIds) {
	return channelIds.map((channelId) => [`${channelId.replace(/[^a-z0-9]+/gi, "_").toUpperCase()}_`, channelId]);
}
function hasPersistedChannelState(env) {
	return fs.existsSync(resolveStateDir(env, os.homedir));
}
let persistedAuthStateChannelIds = null;
function listPersistedAuthStateChannelIds(options) {
	const override = options.persistedAuthStateProbe?.listChannelIds();
	if (override) return override;
	if (options.discovery) return listBundledChannelIdsWithPersistedAuthState(options.discovery);
	if (persistedAuthStateChannelIds) return persistedAuthStateChannelIds;
	persistedAuthStateChannelIds = listBundledChannelIdsWithPersistedAuthState();
	return persistedAuthStateChannelIds;
}
function hasPersistedAuthState(params) {
	const override = params.options.persistedAuthStateProbe;
	if (override) return override.hasState(params);
	return hasBundledChannelPersistedAuthState({
		channelId: params.channelId,
		cfg: params.cfg,
		env: params.env,
		discovery: params.options.discovery
	});
}
/** Lists channel ids detected from config, env vars, or persisted auth state. */
function listPotentialConfiguredChannelIds(cfg, env = process.env, options = {}) {
	return uniqueStrings(listPotentialConfiguredChannelPresenceSignals(cfg, env, options).map((signal) => signal.channelId));
}
/** Lists deduplicated channel presence signals with their detection source. */
function listPotentialConfiguredChannelPresenceSignals(cfg, env = process.env, options = {}) {
	const signals = [];
	const seenSignals = /* @__PURE__ */ new Set();
	const addSignal = (channelId, source) => {
		const key = `${source}:${channelId}`;
		if (seenSignals.has(key)) return;
		seenSignals.add(key);
		signals.push({
			channelId,
			source
		});
	};
	const configuredChannelIds = /* @__PURE__ */ new Set();
	const channelEnvPrefixes = listChannelEnvPrefixes(options.channelIds ?? listBundledChannelIds(env, options.discovery));
	const scopedChannelIds = options.channelIds ? new Set(options.channelIds.map((channelId) => normalizeOptionalLowercaseString(channelId)).filter((channelId) => Boolean(channelId))) : void 0;
	const officialExternalChannelEnvVars = listOfficialExternalChannelEnvVars().filter(({ channelId }) => !scopedChannelIds || scopedChannelIds.has(channelId));
	const channels = isRecord$2(cfg.channels) ? cfg.channels : null;
	if (channels) for (const [key, value] of Object.entries(channels)) {
		if (IGNORED_CHANNEL_CONFIG_KEYS.has(key)) continue;
		if (hasMeaningfulChannelConfig(value)) {
			configuredChannelIds.add(key);
			addSignal(key, "config");
		}
	}
	for (const [key, value] of Object.entries(env)) {
		if (!hasNonEmptyString(value)) continue;
		for (const [prefix, channelId] of channelEnvPrefixes) if (key.startsWith(prefix)) {
			configuredChannelIds.add(channelId);
			addSignal(channelId, "env");
		}
		for (const { channelId, envVars } of officialExternalChannelEnvVars) if (envVars.includes(key)) {
			configuredChannelIds.add(channelId);
			addSignal(channelId, "env");
		}
	}
	if (options.includePersistedAuthState !== false && hasPersistedChannelState(env)) {
		for (const channelId of listPersistedAuthStateChannelIds(options)) if (hasPersistedAuthState({
			channelId,
			cfg,
			env,
			options
		})) {
			configuredChannelIds.add(channelId);
			addSignal(channelId, "persisted-auth");
		}
	}
	return signals.filter((signal) => configuredChannelIds.has(signal.channelId));
}
//#endregion
//#region src/tts/tts-auto-mode.ts
/** Accepted TTS auto modes from config, prefs, and session-level overrides. */
const TTS_AUTO_MODES = new Set([
	"off",
	"always",
	"inbound",
	"tagged"
]);
/** Normalize an unknown value into a supported TTS auto mode. */
function normalizeTtsAutoMode(value) {
	if (typeof value !== "string") return;
	const normalized = normalizeOptionalLowercaseString(value);
	if (TTS_AUTO_MODES.has(normalized)) return normalized;
}
//#endregion
//#region src/tts/tts-config.ts
const BLOCKED_MERGE_KEYS = new Set([
	"__proto__",
	"prototype",
	"constructor"
]);
function deepMergeDefined(base, override) {
	if (!isRecord$1(base) || !isRecord$1(override)) return override === void 0 ? base : override;
	const result = { ...base };
	for (const [key, value] of Object.entries(override)) {
		if (BLOCKED_MERGE_KEYS.has(key) || value === void 0) continue;
		const existing = result[key];
		result[key] = key in result ? deepMergeDefined(existing, value) : value;
	}
	return result;
}
function resolveAgentTtsOverride(cfg, agentId) {
	if (!agentId || !Array.isArray(cfg.agents?.list)) return;
	const normalized = normalizeAgentId(agentId);
	return cfg.agents.list.find((entry) => normalizeAgentId(entry.id) === normalized)?.tts;
}
function resolveTtsConfigContext(contextOrAgentId) {
	return typeof contextOrAgentId === "string" ? { agentId: contextOrAgentId } : contextOrAgentId ?? {};
}
function resolveRecordEntry(entries, id, normalize) {
	const normalizedId = normalizeOptionalString(id);
	if (!entries || !normalizedId) return;
	if (Object.hasOwn(entries, normalizedId)) return entries[normalizedId];
	const normalized = normalize(normalizedId);
	const key = Object.keys(entries).find((candidate) => normalize(candidate) === normalized);
	return key ? entries[key] : void 0;
}
function asTtsConfig(value) {
	return isRecord$1(value) ? value : void 0;
}
function asObjectRecord(value) {
	return isRecord$1(value) ? value : void 0;
}
function resolveChannelConfig(cfg, channelId) {
	if (!isRecord$1(cfg.channels)) return;
	const normalizedChannelId = normalizeOptionalString(channelId);
	if (!normalizedChannelId) return;
	return asObjectRecord(resolveRecordEntry(cfg.channels, normalizedChannelId, normalizeLowercaseStringOrEmpty));
}
function resolveChannelTtsOverride(cfg, context) {
	return asTtsConfig(resolveChannelConfig(cfg, context.channelId)?.tts);
}
function resolveAccountTtsOverride(cfg, context) {
	const channelConfig = resolveChannelConfig(cfg, context.channelId);
	return asTtsConfig(asObjectRecord(resolveRecordEntry(isRecord$1(channelConfig?.accounts) ? channelConfig.accounts : void 0, context.accountId, normalizeAccountId))?.tts);
}
/** Resolve effective TTS config after applying global, agent, channel, and account layers. */
function resolveEffectiveTtsConfig(cfg, contextOrAgentId) {
	const context = resolveTtsConfigContext(contextOrAgentId);
	const base = cfg.messages?.tts ?? {};
	const agentOverride = resolveAgentTtsOverride(cfg, context.agentId);
	const channelOverride = resolveChannelTtsOverride(cfg, context);
	const accountOverride = resolveAccountTtsOverride(cfg, context);
	let merged = base;
	for (const override of [
		agentOverride,
		channelOverride,
		accountOverride
	]) merged = deepMergeDefined(merged, override ?? {});
	return merged;
}
/** Resolve the configured TTS mode, defaulting to final-answer synthesis. */
function resolveConfiguredTtsMode(cfg, contextOrAgentId) {
	return resolveEffectiveTtsConfig(cfg, contextOrAgentId).mode ?? "final";
}
function resolveTtsPrefsPathValue(prefsPath) {
	if (prefsPath?.trim()) return resolveUserPath(prefsPath.trim());
	const envPath = process.env.OPENCLAW_TTS_PREFS?.trim();
	if (envPath) return resolveUserPath(envPath);
	return path.join(resolveConfigDir(process.env), "settings", "tts.json");
}
function readTtsPrefsAutoMode(prefsPath) {
	try {
		if (!existsSync(prefsPath)) return;
		const prefs = JSON.parse(readFileSync(prefsPath, "utf8"));
		const auto = normalizeTtsAutoMode(prefs.tts?.auto);
		if (auto) return auto;
		if (typeof prefs.tts?.enabled === "boolean") return prefs.tts.enabled ? "always" : "off";
	} catch {
		return;
	}
}
/** Return whether this payload should attempt TTS based on session, prefs, and config. */
function shouldAttemptTtsPayload(params) {
	const sessionAuto = normalizeTtsAutoMode(params.ttsAuto);
	if (sessionAuto) return sessionAuto !== "off";
	const raw = resolveEffectiveTtsConfig(params.cfg, params);
	const prefsAuto = readTtsPrefsAutoMode(resolveTtsPrefsPathValue(raw?.prefsPath));
	if (prefsAuto) return prefsAuto !== "off";
	const configuredAuto = normalizeTtsAutoMode(raw?.auto);
	if (configuredAuto) return configuredAuto !== "off";
	return raw?.enabled === true;
}
/** Return whether TTS directive markup should be stripped from user-visible text. */
function shouldCleanTtsDirectiveText(params) {
	if (!shouldAttemptTtsPayload(params)) return false;
	return resolveEffectiveTtsConfig(params.cfg, params).modelOverrides?.enabled !== false;
}
//#endregion
//#region src/plugins/gateway-startup-speech-providers.ts
const TTS_PROVIDER_CONFIG_RESERVED_KEYS = new Set([
	"auto",
	"enabled",
	"maxTextLength",
	"mode",
	"modelOverrides",
	"persona",
	"personas",
	"prefsPath",
	"provider",
	"providers",
	"summaryModel",
	"timeoutMs"
]);
/** Treats missing activation as enabled while honoring explicit false values. */
function isConfigActivationValueEnabled(value) {
	if (value === false) return false;
	if (isRecord$1(value) && value.enabled === false) return false;
	return true;
}
/** Normalizes configured TTS provider ids for startup plugin selection. */
function normalizeConfiguredSpeechProviderIdForStartup(value) {
	if (typeof value !== "string") return;
	const normalized = normalizeOptionalLowercaseString(value);
	if (!normalized) return;
	return normalized === "edge" ? "microsoft" : normalized;
}
/** Resolves provider activation from both canonical providers maps and legacy root keys. */
function resolveProviderConfigActivation(ttsConfig, providerId) {
	let fromProviders;
	if (isRecord$1(ttsConfig.providers)) {
		for (const [key, providerConfig] of Object.entries(ttsConfig.providers)) if (normalizeConfiguredSpeechProviderIdForStartup(key) === providerId) fromProviders = isConfigActivationValueEnabled(providerConfig);
	}
	if (fromProviders !== void 0) return fromProviders;
	for (const [key, providerConfig] of Object.entries(ttsConfig)) {
		if (TTS_PROVIDER_CONFIG_RESERVED_KEYS.has(key) || !isRecord$1(providerConfig)) continue;
		if (normalizeConfiguredSpeechProviderIdForStartup(key) === providerId) return isConfigActivationValueEnabled(providerConfig);
	}
}
function addProviderIfEnabled(target, ttsConfig, providerId) {
	const normalized = normalizeConfiguredSpeechProviderIdForStartup(providerId);
	if (!normalized) return;
	if (resolveProviderConfigActivation(ttsConfig, normalized) !== false) target.add(normalized);
}
function findActivePersona(ttsConfig) {
	const personaId = normalizeOptionalLowercaseString(typeof ttsConfig.persona === "string" ? ttsConfig.persona : void 0);
	if (!personaId || !isRecord$1(ttsConfig.personas)) return;
	for (const [id, persona] of Object.entries(ttsConfig.personas)) if (normalizeOptionalLowercaseString(id) === personaId && isRecord$1(persona)) return persona;
}
function addActivePersonaProvider(target, ttsConfig) {
	const persona = findActivePersona(ttsConfig);
	if (!persona) return;
	const provider = normalizeConfiguredSpeechProviderIdForStartup(persona.provider);
	if (!provider) return;
	const rootActivation = resolveProviderConfigActivation(ttsConfig, provider);
	if ((resolveProviderConfigActivation(persona, provider) ?? rootActivation) !== false) target.add(provider);
}
function addConfiguredTtsProviderIds(target, value) {
	if (!isRecord$1(value)) return;
	addProviderIfEnabled(target, value, value.provider);
	addActivePersonaProvider(target, value);
	if (isRecord$1(value.providers)) {
		for (const [providerId, providerConfig] of Object.entries(value.providers)) if (isConfigActivationValueEnabled(providerConfig)) addProviderIfEnabled(target, value, providerId);
	}
	for (const [key, providerConfig] of Object.entries(value)) {
		if (TTS_PROVIDER_CONFIG_RESERVED_KEYS.has(key) || !isRecord$1(providerConfig)) continue;
		if (isConfigActivationValueEnabled(providerConfig)) addProviderIfEnabled(target, value, key);
	}
}
/** Collects TTS provider ids referenced by root, agent, channel, account, and plugin config. */
function collectConfiguredSpeechProviderIds(config) {
	const configured = /* @__PURE__ */ new Set();
	addConfiguredTtsProviderIds(configured, resolveEffectiveTtsConfig(config));
	const agents = config.agents;
	if (isRecord$1(agents) && Array.isArray(agents.list)) {
		for (const agent of agents.list) if (isRecord$1(agent)) if (typeof agent.id === "string") addConfiguredTtsProviderIds(configured, resolveEffectiveTtsConfig(config, { agentId: agent.id }));
		else addConfiguredTtsProviderIds(configured, agent.tts);
	}
	const channels = config.channels;
	if (isRecord$1(channels)) for (const [channelId, channelConfig] of Object.entries(channels)) {
		if (!isRecord$1(channelConfig)) continue;
		addConfiguredTtsProviderIds(configured, resolveEffectiveTtsConfig(config, { channelId }));
		if (isRecord$1(channelConfig.voice)) addConfiguredTtsProviderIds(configured, channelConfig.voice.tts);
		if (isRecord$1(channelConfig.accounts)) for (const [accountId, accountConfig] of Object.entries(channelConfig.accounts)) {
			if (!isRecord$1(accountConfig)) continue;
			addConfiguredTtsProviderIds(configured, resolveEffectiveTtsConfig(config, {
				channelId,
				accountId
			}));
			if (isRecord$1(accountConfig.voice)) addConfiguredTtsProviderIds(configured, accountConfig.voice.tts);
		}
	}
	const pluginEntries = config.plugins?.entries;
	if (isRecord$1(pluginEntries)) {
		for (const entry of Object.values(pluginEntries)) if (isRecord$1(entry) && isRecord$1(entry.config)) addConfiguredTtsProviderIds(configured, entry.config.tts);
	}
	return configured;
}
//#endregion
export { collectConfiguredModelRefs as _, shouldAttemptTtsPayload as a, normalizeTtsAutoMode as c, listPotentialConfiguredChannelIds as d, listPotentialConfiguredChannelPresenceSignals as f, collectConfiguredModelRefValues as g, AGENT_MODEL_CONFIG_KEYS as h, resolveEffectiveTtsConfig as i, hasMeaningfulChannelConfig as l, listBundledChannelIdsForPackageState as m, normalizeConfiguredSpeechProviderIdForStartup as n, shouldCleanTtsDirectiveText as o, hasBundledChannelPackageState as p, resolveConfiguredTtsMode as r, TTS_AUTO_MODES as s, collectConfiguredSpeechProviderIds as t, listExplicitlyDisabledChannelIdsForConfig as u };
