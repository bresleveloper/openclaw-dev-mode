import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { s as resolveAgentModelPrimaryValue } from "./model-input-C9K4a_6k.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./agent-scope-runtime-DMJYuX7c.mjs";
import "./provider-onboard-CF3Sw4qH.mjs";
import { n as CLAUDE_CLI_CANONICAL_ALLOWLIST_REFS, u as CLAUDE_CLI_PROFILE_ID } from "./cli-constants-D6douw4O.mjs";
import { a as resolveKnownAnthropicModelRef, i as resolveClaudeCliAnthropicModelRefs, n as normalizeAnthropicProviderId, r as parseAnthropicModelRef, t as modelEntryWithClaudeCliRuntime } from "./claude-model-refs-BrOsU52V.mjs";
//#region extensions/anthropic/config-defaults.ts
const ANTHROPIC_PROVIDER_API = "anthropic-messages";
const ANTHROPIC_API_KEY_DEFAULT_ALLOWLIST_REFS = [
	"anthropic/claude-sonnet-5-5",
	"anthropic/claude-sonnet-5",
	"anthropic/claude-sonnet-4-6"
];
function resolveAnthropicDefaultAuthMode(config, env) {
	if (usesRetiredClaudeCliProviderEntry(config)) return "oauth";
	const profiles = config.auth?.profiles ?? {};
	const anthropicProfiles = Object.entries(profiles).filter(([, profile]) => profile?.provider === "anthropic" || profile?.provider === "claude-cli");
	const order = [...config.auth?.order?.anthropic ?? [], ...config.auth?.order?.["claude-cli"] ?? []];
	for (const profileId of order) {
		const entry = profiles[profileId];
		if (!entry || entry.provider !== "anthropic" && entry.provider !== "claude-cli") continue;
		if (entry.provider === "claude-cli") return "oauth";
		if (entry.mode === "api_key") return "api_key";
		if (entry.mode === "oauth" || entry.mode === "token") return "oauth";
	}
	const hasApiKey = anthropicProfiles.some(([, profile]) => profile?.provider === "anthropic" && profile?.mode === "api_key");
	const hasOauth = anthropicProfiles.some(([, profile]) => profile?.provider === "claude-cli" || profile?.mode === "oauth" || profile?.mode === "token");
	if (hasApiKey && !hasOauth) return "api_key";
	if (hasOauth && !hasApiKey) return "oauth";
	if (env.ANTHROPIC_OAUTH_TOKEN?.trim()) return "oauth";
	if (env.ANTHROPIC_API_KEY?.trim()) return "api_key";
	return null;
}
function usesRetiredClaudeCliProviderEntry(config) {
	return Object.entries(config.models?.providers ?? {}).some(([provider, entry]) => normalizeAnthropicProviderId(provider) === "anthropic" && entry.apiKey === CLAUDE_CLI_PROFILE_ID);
}
function isAnthropicCacheRetentionTarget(parsed) {
	return Boolean(parsed && (parsed.provider === "anthropic" || parsed.provider === "amazon-bedrock" && normalizeLowercaseStringOrEmpty(parsed.model).includes("anthropic.claude")));
}
function usesClaudeCliModelSelection(config) {
	const primary = resolveAgentModelPrimaryValue(config.agents?.defaults?.model);
	if ((primary ? parseAnthropicModelRef(primary) : null)?.provider === "claude-cli") return true;
	return Object.entries(config.agents?.defaults?.models ?? {}).some(([key, entry]) => {
		const parsed = parseAnthropicModelRef(key);
		if (parsed?.provider === "claude-cli") return true;
		const runtimeId = isRecord(entry?.agentRuntime) ? entry.agentRuntime.id : void 0;
		return parsed?.provider === "anthropic" && normalizeLowercaseStringOrEmpty(runtimeId) === "claude-cli";
	});
}
function usesSelectedClaudeCliAuthProfile(config) {
	if (usesRetiredClaudeCliProviderEntry(config)) return true;
	const profiles = config.auth?.profiles ?? {};
	const orderedProfileIds = [...config.auth?.order?.anthropic ?? [], ...config.auth?.order?.["claude-cli"] ?? []];
	for (const profileId of orderedProfileIds) {
		const provider = profiles[profileId]?.provider;
		if (provider === "claude-cli") return true;
		if (provider === "anthropic") return false;
	}
	let hasClaudeCliProfile = false;
	let hasAnthropicProfile = false;
	for (const profile of Object.values(profiles)) {
		if (profile?.provider === "claude-cli") hasClaudeCliProfile = true;
		if (profile?.provider === "anthropic") hasAnthropicProfile = true;
	}
	return hasClaudeCliProfile && !hasAnthropicProfile;
}
function collectClaudeCliRuntimeRefsFromConfig(config) {
	const selections = [{
		model: config.agents?.defaults?.model,
		models: config.agents?.defaults?.models
	}, ...listAgentIds(config).map((agentId) => {
		const agent = resolveAgentConfig(config, agentId);
		return {
			model: agent?.model,
			models: agent?.models
		};
	})];
	const refs = /* @__PURE__ */ new Set();
	for (const { model, models } of selections) {
		const selected = typeof model === "string" ? [model] : [model?.primary, ...model?.fallbacks ?? []];
		for (const rawRef of [...selected, ...Object.keys(models ?? {})]) {
			if (typeof rawRef !== "string") continue;
			for (const ref of resolveClaudeCliAnthropicModelRefs(rawRef)?.runtimeRefs ?? []) refs.add(ref);
		}
	}
	return [...refs];
}
function normalizeAnthropicProviderConfigForProvider(params) {
	const { providerConfig } = params;
	const provider = normalizeAnthropicProviderId(params.provider);
	if (provider !== "anthropic" && provider !== "claude-cli" || providerConfig.api || !Array.isArray(providerConfig.models) || providerConfig.models.length === 0) return providerConfig;
	return {
		...providerConfig,
		api: ANTHROPIC_PROVIDER_API
	};
}
function applyAnthropicConfigDefaults(params) {
	const defaults = params.config.agents?.defaults;
	if (!defaults) return params.config;
	const authMode = resolveAnthropicDefaultAuthMode(params.config, params.env);
	if (!authMode) return params.config;
	let mutated = false;
	const nextDefaults = { ...defaults };
	if (defaults.contextPruning?.mode === void 0) {
		nextDefaults.contextPruning = {
			...defaults.contextPruning,
			mode: "cache-ttl",
			ttl: defaults.contextPruning?.ttl ?? "1h"
		};
		mutated = true;
	}
	if (defaults.heartbeat?.every === void 0) {
		nextDefaults.heartbeat = {
			...defaults.heartbeat,
			every: authMode === "oauth" ? "1h" : "30m"
		};
		mutated = true;
	}
	const nextModels = { ...defaults.models };
	let modelsMutated = false;
	if (authMode === "api_key") {
		const primary = resolveKnownAnthropicModelRef(resolveAgentModelPrimaryValue(defaults.model));
		const parsedPrimary = primary ? parseAnthropicModelRef(primary) : null;
		const refs = [...Object.keys(nextModels), ...isAnthropicCacheRetentionTarget(parsedPrimary) ? [`${parsedPrimary.provider}/${parsedPrimary.model}`] : []];
		for (const key of refs) {
			if (!isAnthropicCacheRetentionTarget(parseAnthropicModelRef(key))) continue;
			const current = nextModels[key] ?? {};
			const paramsValue = current.params ?? {};
			if (typeof paramsValue.cacheRetention === "string") continue;
			nextModels[key] = {
				...current,
				params: {
					...paramsValue,
					cacheRetention: "short"
				}
			};
			modelsMutated = true;
		}
		if (Object.keys(nextModels).some((key) => isAnthropicCacheRetentionTarget(parseAnthropicModelRef(key)))) for (const ref of ANTHROPIC_API_KEY_DEFAULT_ALLOWLIST_REFS) {
			if (ref in nextModels) continue;
			nextModels[ref] = { params: { cacheRetention: "short" } };
			modelsMutated = true;
		}
	}
	if (authMode === "oauth" && (usesClaudeCliModelSelection(params.config) || usesSelectedClaudeCliAuthProfile(params.config))) {
		const runtimeRefs = /* @__PURE__ */ new Set([...collectClaudeCliRuntimeRefsFromConfig(params.config), ...CLAUDE_CLI_CANONICAL_ALLOWLIST_REFS]);
		for (const ref of runtimeRefs) {
			const current = nextModels[ref];
			const updated = modelEntryWithClaudeCliRuntime(current);
			if (JSON.stringify(updated) === JSON.stringify(current ?? {})) continue;
			nextModels[ref] = updated;
			modelsMutated = true;
		}
	}
	if (modelsMutated) {
		nextDefaults.models = nextModels;
		mutated = true;
	}
	if (!mutated) return params.config;
	return {
		...params.config,
		agents: {
			...params.config.agents,
			defaults: nextDefaults
		}
	};
}
//#endregion
export { normalizeAnthropicProviderConfigForProvider as n, applyAnthropicConfigDefaults as t };
