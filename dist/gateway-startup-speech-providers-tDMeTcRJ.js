import { a as normalizeLowercaseStringOrEmpty, c as normalizeOptionalString, s as normalizeOptionalLowercaseString } from "./string-coerce-DW4mBlAt.js";
import { o as isRecord$1 } from "./record-coerce-DHZ4bFlT.js";
import { f as resolveConfigDir, m as resolveUserPath } from "./utils-CRO4LGEB.js";
import { n as normalizeAccountId } from "./account-id-C7N4Rwku.js";
import { u as normalizeAgentId } from "./session-key-VWT_xzM9.js";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
//#region packages/model-catalog-core/src/configured-model-refs.ts
/** Narrow unknown values to plain records. */
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
/** Agent config keys that can contain direct model references. */
const AGENT_MODEL_CONFIG_KEYS = [
	"model",
	"utilityModel",
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
//#region src/tts/tts-auto-mode.ts
/** Accepted TTS auto modes from config, prefs, and session-level overrides. */
const TTS_AUTO_MODES = /* @__PURE__ */ new Set([
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
const BLOCKED_MERGE_KEYS = /* @__PURE__ */ new Set([
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
const TTS_PROVIDER_CONFIG_RESERVED_KEYS = /* @__PURE__ */ new Set([
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
export { shouldAttemptTtsPayload as a, normalizeTtsAutoMode as c, collectConfiguredModelRefs as d, resolveEffectiveTtsConfig as i, AGENT_MODEL_CONFIG_KEYS as l, normalizeConfiguredSpeechProviderIdForStartup as n, shouldCleanTtsDirectiveText as o, resolveConfiguredTtsMode as r, TTS_AUTO_MODES as s, collectConfiguredSpeechProviderIds as t, collectConfiguredModelRefValues as u };
