import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { m as resolveDefaultAgentId } from "./agent-scope-config-IQKOEtZ4.mjs";
import { o as resolveAgentEffectiveModelPrimary, w as setAgentEffectiveModelPrimary } from "./agent-scope-CTuYDtny.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./agent-runtime-BXs_VkH-.mjs";
import { v as resolveMigrationConfigRuntime } from "./migration-DepQtnwV.mjs";
import { a as HERMES_REASON_DEFAULT_MODEL_CONFIGURED, g as readHermesModelDetails, h as hermesItemSkipped, i as HERMES_REASON_CONFIG_RUNTIME_UNAVAILABLE, m as hermesItemError, p as hermesItemConflict, t as HERMES_REASON_ALREADY_CONFIGURED } from "./items-c7FuCabr.mjs";
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
	"github-copilot": "github-copilot",
	"github-model": "github-copilot",
	"github-models": "github-copilot",
	glm: "zai",
	google: "google",
	"google-ai-studio": "google",
	"google-gemini": "google",
	grok: "xai",
	kilo: "kilocode",
	"kilo-code": "kilocode",
	"kilo-gateway": "kilocode",
	kimi: "kimi",
	"kimi-cn": "moonshot",
	"kimi-for-coding": "kimi",
	"kimi-coding": "kimi",
	"kimi-coding-cn": "moonshot",
	"moonshot-cn": "moonshot",
	moonshot: "moonshot",
	"minimax-global": "minimax-portal",
	"minimax-cn": "minimax",
	"minimax-oauth": "minimax-portal",
	"minimax-portal": "minimax-portal",
	minimax_oauth: "minimax-portal",
	"opencode-zen": "opencode",
	"openai-api": "openai",
	"openai-codex": "openai",
	dashscope: "qwen",
	qwen: "qwen",
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
function readBaseUrl(value) {
	return value ? normalizeOptionalString(value.base_url) ?? normalizeOptionalString(value.baseUrl) ?? normalizeOptionalString(value.url) ?? normalizeOptionalString(value.api) : void 0;
}
function readKimiBaseUrl(config, provider, env) {
	const model = asOptionalRecord(config.model);
	const selectedProvider = normalizeOptionalString(model?.provider) ?? normalizeOptionalString(config.provider);
	if (selectedProvider && HERMES_DYNAMIC_KIMI_PROVIDER_IDS.has(normalizeHermesCustomProviderId(selectedProvider))) {
		const modelBaseUrl = readBaseUrl(model);
		if (modelBaseUrl) return modelBaseUrl;
	}
	const providers = asOptionalRecord(config.providers);
	for (const [id, value] of Object.entries(providers ?? {})) if (normalizeHermesCustomProviderId(id) === normalizeHermesCustomProviderId(provider) && asOptionalRecord(value)) {
		const providerBaseUrl = readBaseUrl(asOptionalRecord(value));
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
	if (providers && typeof providers === "object" && !Array.isArray(providers) && Object.keys(providers).some((id) => normalizeHermesCustomProviderId(id) === normalized)) return true;
	return Array.isArray(config.custom_providers) && config.custom_providers.some((entry) => {
		if (!entry || typeof entry !== "object" || Array.isArray(entry)) return false;
		const record = entry;
		const id = normalizeOptionalString(record.name) ?? normalizeOptionalString(record.id);
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
	if (model && typeof model === "object" && !Array.isArray(model)) {
		const modelRecord = model;
		const rawModel = normalizeOptionalString(modelRecord.default) ?? normalizeOptionalString(modelRecord.model);
		const hasCustomEndpoint = Boolean(normalizeOptionalString(modelRecord.base_url) ?? normalizeOptionalString(modelRecord.baseUrl));
		const provider = normalizeOptionalString(modelRecord.provider) ?? (hasCustomEndpoint ? "custom" : void 0);
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
		if (!configApi?.current || !configApi.mutateConfigFile) return hermesItemError(item, HERMES_REASON_CONFIG_RUNTIME_UNAVAILABLE);
		const agentId = ctx.targetAgentId ?? resolveDefaultAgentId(ctx.config);
		const currentModel = resolveAgentEffectiveModelPrimary(configApi.current(), agentId);
		if (currentModel === details.model) return hermesItemSkipped(item, HERMES_REASON_ALREADY_CONFIGURED);
		if (currentModel && !ctx.overwrite) return hermesItemConflict(item, HERMES_REASON_DEFAULT_MODEL_CONFIGURED);
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
		if (err instanceof ModelApplyAbortError) return err.status === "conflict" ? hermesItemConflict(item, err.reason) : hermesItemSkipped(item, err.reason);
		return hermesItemError(item, err instanceof Error ? err.message : String(err));
	}
}
//#endregion
export { resolveHermesConfiguredProviderId as a, resolveCurrentModelRef as i, normalizeHermesCustomProviderId as n, resolveHermesModelRef as o, normalizeHermesProviderId as r, usesRetiredHermesQwenProvider as s, applyModelItem as t };
