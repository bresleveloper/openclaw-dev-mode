import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { g as resolveDefaultAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import { C as setAgentEffectiveModelPrimary, o as resolveAgentEffectiveModelPrimary } from "./agent-scope-CG17uXFn.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./agent-runtime-CozKBj9N.mjs";
import { d as markMigrationItemSkipped, l as markMigrationItemConflict, u as markMigrationItemError, v as resolveMigrationConfigRuntime } from "./migration-BeM6IrM8.mjs";
import { a as HERMES_REASON_DEFAULT_MODEL_CONFIGURED, i as HERMES_REASON_CONFIG_RUNTIME_UNAVAILABLE, p as readHermesModelDetails, t as HERMES_REASON_ALREADY_CONFIGURED } from "./items-Ow1uFW0E.mjs";
//#region extensions/migrate-hermes/model.ts
const HERMES_PROVIDER_ALIASES = {
	alibaba: "qwen",
	"alibaba-cloud": "qwen",
	"alibaba-coding": "qwen",
	"alibaba-coding-plan": "qwen",
	alibaba_coding: "qwen",
	alibaba_coding_plan: "qwen",
	aliyun: "qwen",
	"azure-foundry": "microsoft-foundry",
	bedrock: "amazon-bedrock",
	claude: "anthropic",
	"claude-code": "anthropic",
	copilot: "github-copilot",
	gemini: "google",
	github: "github-copilot",
	"github-model": "github-copilot",
	"github-models": "github-copilot",
	glm: "zai",
	"google-ai-studio": "google",
	"google-gemini": "google",
	grok: "xai",
	kilo: "kilocode",
	"kilo-code": "kilocode",
	"kilo-gateway": "kilocode",
	"kimi-cn": "moonshot",
	"kimi-for-coding": "kimi",
	"kimi-coding": "kimi",
	"kimi-coding-cn": "moonshot",
	"moonshot-cn": "moonshot",
	"minimax-global": "minimax-portal",
	"minimax-cn": "minimax",
	"minimax-oauth": "minimax-portal",
	minimax_oauth: "minimax-portal",
	"opencode-zen": "opencode",
	"openai-api": "openai",
	"openai-codex": "openai",
	dashscope: "qwen",
	"qwen-cli": "qwen",
	"qwen-oauth": "qwen",
	"qwen-portal": "qwen",
	"x-ai": "xai",
	"x-ai-oauth": "xai",
	"x.ai": "xai",
	"xai-grok-oauth": "xai",
	"xai-oauth": "xai",
	"grok-oauth": "xai",
	"z-ai": "zai",
	"z.ai": "zai",
	zen: "opencode",
	zhipu: "zai",
	vertex: "google-vertex"
};
const HERMES_CANONICAL_PROVIDER_IDS = /* @__PURE__ */ new Set([
	"alibaba",
	"alibaba-coding-plan",
	"anthropic",
	"arcee",
	"azure-foundry",
	"bedrock",
	"copilot",
	"copilot-acp",
	"deepseek",
	"fireworks",
	"github-copilot",
	"gemini",
	"gmi",
	"huggingface",
	"kilo",
	"kilocode",
	"kimi-coding",
	"kimi-coding-cn",
	"kimi-for-coding",
	"lmstudio",
	"minimax",
	"minimax-cn",
	"minimax-oauth",
	"moa",
	"nous",
	"novita",
	"nvidia",
	"ollama-cloud",
	"openai-api",
	"openai-codex",
	"opencode",
	"opencode-go",
	"opencode-zen",
	"openrouter",
	"stepfun",
	"tencent-tokenhub",
	"xai",
	"xai-oauth",
	"xiaomi",
	"zai",
	"vertex"
]);
const HERMES_DYNAMIC_KIMI_PROVIDER_IDS = /* @__PURE__ */ new Set([
	"kimi",
	"kimi-coding",
	"kimi-for-coding",
	"moonshot"
]);
const HERMES_RETIRED_QWEN_PROVIDER_IDS = /* @__PURE__ */ new Set([
	"qwen-cli",
	"qwen-oauth",
	"qwen-portal"
]);
function normalizeHermesProviderId(provider) {
	const normalized = normalizeHermesCustomProviderId(provider);
	return HERMES_PROVIDER_ALIASES[normalized] ?? normalized;
}
function normalizeHermesCustomProviderId(provider) {
	const normalized = provider.trim().toLowerCase();
	return (normalized.startsWith("custom:") ? normalized.slice(7) : normalized).replaceAll(" ", "-");
}
function isRetiredHermesQwenProviderValue(value) {
	const slash = value.indexOf("/");
	const provider = slash > 0 ? value.slice(0, slash) : value;
	return HERMES_RETIRED_QWEN_PROVIDER_IDS.has(normalizeHermesCustomProviderId(provider));
}
function usesRetiredHermesQwenProvider(config) {
	const model = asOptionalRecord(config.model);
	return [
		normalizeOptionalString(config.provider),
		typeof config.model === "string" ? config.model : void 0,
		normalizeOptionalString(model?.provider),
		normalizeOptionalString(model?.default),
		normalizeOptionalString(model?.model),
		normalizeOptionalString(config.default_model),
		normalizeOptionalString(config.model_name)
	].some((value) => value !== void 0 && isRetiredHermesQwenProviderValue(value));
}
function readHermesBaseUrl(value) {
	return value ? normalizeOptionalString(value.base_url) ?? normalizeOptionalString(value.baseUrl) ?? normalizeOptionalString(value.url) ?? normalizeOptionalString(value.api) : void 0;
}
function readKimiBaseUrl(config, provider, env) {
	const model = asOptionalRecord(config.model);
	const selectedProvider = normalizeOptionalString(model?.provider) ?? normalizeOptionalString(config.provider);
	if (selectedProvider && HERMES_DYNAMIC_KIMI_PROVIDER_IDS.has(normalizeHermesCustomProviderId(selectedProvider))) {
		const modelBaseUrl = readHermesBaseUrl(model);
		if (modelBaseUrl) return modelBaseUrl;
	}
	const providers = asOptionalRecord(config.providers);
	for (const [id, value] of Object.entries(providers ?? {})) if (normalizeHermesCustomProviderId(id) === normalizeHermesCustomProviderId(provider)) {
		const providerBaseUrl = readHermesBaseUrl(asOptionalRecord(value));
		if (providerBaseUrl) return providerBaseUrl;
	}
	return env.KIMI_BASE_URL?.trim() || void 0;
}
function resolveHermesKimiProviderId(config, provider, env) {
	const sourceProvider = normalizeHermesCustomProviderId(provider);
	if (!HERMES_DYNAMIC_KIMI_PROVIDER_IDS.has(sourceProvider)) return;
	const baseUrl = readKimiBaseUrl(config, sourceProvider, env);
	if (baseUrl) {
		try {
			const parsed = new URL(baseUrl);
			const hostname = parsed.hostname.toLowerCase();
			const pathname = parsed.pathname.toLowerCase().replace(/\/+$/u, "");
			if (hostname === "api.kimi.com" && (pathname === "/coding" || pathname === "/coding/v1")) return "kimi";
			if (hostname === "api.moonshot.ai") return "moonshot";
		} catch {}
		return normalizeHermesProviderId(sourceProvider) === "moonshot" ? "moonshot" : "kimi";
	}
	return (env.KIMI_API_KEY?.trim() || env.KIMI_CODING_API_KEY?.trim())?.startsWith("sk-kimi-") ? "kimi" : "moonshot";
}
function hasExplicitHermesProvider(config, provider) {
	const normalized = normalizeHermesCustomProviderId(provider);
	if (HERMES_CANONICAL_PROVIDER_IDS.has(normalized) || HERMES_RETIRED_QWEN_PROVIDER_IDS.has(normalized)) return false;
	const providers = config.providers;
	if (isRecord(providers) && Object.keys(providers).some((id) => normalizeHermesCustomProviderId(id) === normalized)) return true;
	return Array.isArray(config.custom_providers) && config.custom_providers.some((entry) => {
		if (!isRecord(entry)) return false;
		const id = normalizeOptionalString(entry.name) ?? normalizeOptionalString(entry.id);
		return id ? normalizeHermesCustomProviderId(id) === normalized : false;
	});
}
function resolveHermesConfiguredProviderId(config, provider, env = {}) {
	if (hasExplicitHermesProvider(config, provider)) return normalizeHermesCustomProviderId(provider);
	return resolveHermesKimiProviderId(config, provider, env) ?? normalizeHermesProviderId(provider);
}
function joinHermesProviderModel(config, provider, model, env) {
	if (!provider) {
		const slash = model.indexOf("/");
		if (slash > 0 && isRetiredHermesQwenProviderValue(model)) return `qwen/${model.slice(slash + 1)}`;
		return model;
	}
	if (provider.trim().toLowerCase() === "auto") {
		const slash = model.indexOf("/");
		return slash > 0 ? `${resolveHermesConfiguredProviderId(config, model.slice(0, slash), env)}/${model.slice(slash + 1)}` : model;
	}
	const explicitProvider = hasExplicitHermesProvider(config, provider);
	const normalizedProvider = resolveHermesConfiguredProviderId(config, provider, env);
	const slash = model.indexOf("/");
	if (slash > 0) {
		if ((explicitProvider ? normalizeHermesCustomProviderId(model.slice(0, slash)) : resolveHermesConfiguredProviderId(config, model.slice(0, slash), env)) === normalizedProvider) return `${normalizedProvider}/${model.slice(slash + 1)}`;
	}
	return model.startsWith(`${normalizedProvider}/`) ? model : `${normalizedProvider}/${model}`;
}
function resolveHermesModelRef(config, env = {}) {
	const model = config.model;
	if (typeof model === "string" && model.trim()) {
		const rawModel = model.trim();
		return joinHermesProviderModel(config, normalizeOptionalString(config.provider), rawModel, env);
	}
	if (isRecord(model)) {
		const rawModel = normalizeOptionalString(model.default) ?? normalizeOptionalString(model.model);
		const hasCustomEndpoint = Boolean(normalizeOptionalString(model.base_url) ?? normalizeOptionalString(model.baseUrl));
		const provider = normalizeOptionalString(model.provider) ?? (hasCustomEndpoint ? "custom" : void 0);
		return rawModel ? joinHermesProviderModel(config, provider, rawModel, env) : void 0;
	}
	const rootModel = normalizeOptionalString(config.default_model) ?? normalizeOptionalString(config.model_name);
	const rootProvider = normalizeOptionalString(config.provider);
	return rootModel ? joinHermesProviderModel(config, rootProvider, rootModel, env) : void 0;
}
function resolveCurrentModelRef(ctx) {
	return resolveAgentEffectiveModelPrimary(ctx.config, ctx.targetAgentId ?? resolveDefaultAgentId(ctx.config));
}
var ModelApplyAbortError = class extends Error {
	constructor(status, reason) {
		super(reason);
		this.status = status;
		this.reason = reason;
		this.name = "ModelApplyAbortError";
	}
};
async function applyModelItem(ctx, item) {
	const details = readHermesModelDetails(item);
	if (!details || item.status !== "planned") return item;
	try {
		const configApi = resolveMigrationConfigRuntime(ctx);
		if (!configApi?.current || !configApi.mutateConfigFile) return markMigrationItemError(item, HERMES_REASON_CONFIG_RUNTIME_UNAVAILABLE);
		const agentId = ctx.targetAgentId ?? resolveDefaultAgentId(ctx.config);
		const currentModel = resolveAgentEffectiveModelPrimary(configApi.current(), agentId);
		if (currentModel === details.model) return markMigrationItemSkipped(item, HERMES_REASON_ALREADY_CONFIGURED);
		if (currentModel && !ctx.overwrite) return markMigrationItemConflict(item, HERMES_REASON_DEFAULT_MODEL_CONFIGURED);
		await configApi.mutateConfigFile({
			base: "runtime",
			afterWrite: { mode: "auto" },
			mutate(draft) {
				const mutationModel = resolveAgentEffectiveModelPrimary(draft, agentId);
				if (mutationModel === details.model) throw new ModelApplyAbortError("skipped", HERMES_REASON_ALREADY_CONFIGURED);
				if (mutationModel && !ctx.overwrite) throw new ModelApplyAbortError("conflict", HERMES_REASON_DEFAULT_MODEL_CONFIGURED);
				setAgentEffectiveModelPrimary(draft, agentId, details.model, { forceAgent: Boolean(ctx.targetAgentId) });
			}
		});
		return {
			...item,
			status: "migrated"
		};
	} catch (err) {
		if (err instanceof ModelApplyAbortError) return err.status === "conflict" ? markMigrationItemConflict(item, err.reason) : markMigrationItemSkipped(item, err.reason);
		return markMigrationItemError(item, err instanceof Error ? err.message : String(err));
	}
}
//#endregion
export { resolveCurrentModelRef as a, usesRetiredHermesQwenProvider as c, readHermesBaseUrl as i, normalizeHermesCustomProviderId as n, resolveHermesConfiguredProviderId as o, normalizeHermesProviderId as r, resolveHermesModelRef as s, applyModelItem as t };
