import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as createLazyRuntimeModule, t as createLazyRuntimeMethod } from "./lazy-runtime-BPNHa36e.mjs";
import { c as resolveClaudeFable5ModelIdentity, g as supportsClaudeAdaptiveThinking, h as supportsClaude1MContext, l as resolveClaudeModelIdentity, m as resolveClaudeSonnet5ModelIdentity, p as resolveClaudeOpus5ModelIdentity, s as requiresClaudeMandatoryAdaptiveThinking, u as resolveClaudeMythos5ModelIdentity, v as supportsClaudeNativeMaxEffort, y as supportsClaudeNativeXhighEffort } from "./anthropic-Cy4mTngV.mjs";
import { n as buildManifestModelProviderConfig } from "./provider-catalog-DaDnKUnq.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { h as isAnthropicOAuthApiKey } from "./provider-stream-shared-CuBHNQvM.mjs";
import { a as buildProviderReplayFamilyHooks, c as modelCostsEqual, u as cloneFirstTemplateModel } from "./provider-model-shared-DwrT_ZjA.mjs";
import { n as createProviderApiKeyAuthMethod } from "./provider-api-key-auth-Chp7QFG3.mjs";
import "./provider-catalog-shared-D7_lTYyN.mjs";
import "./provider-entry-D3wDLM3X.mjs";
import { f as CLAUDE_MODEL_ID_ALIASES, i as CLAUDE_CLI_DEFAULT_ALLOWLIST_REFS, l as CLAUDE_CLI_PROFILE_ID, n as CLAUDE_CLI_CANONICAL_DEFAULT_MODEL_REF, p as modelCatalog, s as CLAUDE_CLI_NATIVE_AUTH_MARKER, t as CLAUDE_CLI_BACKEND_ID } from "./cli-constants-0f4y8Jm6.mjs";
import "./cli-shared-BBdnRLY0.mjs";
import { t as buildAnthropicCliBackend } from "./cli-backend-CP9ybtr0.mjs";
import { t as createClaudeCodeVersionProbe } from "./cli-version-B2LlsSBN.mjs";
import { n as normalizeAnthropicProviderConfigForProvider, t as applyAnthropicConfigDefaults } from "./config-defaults-CeOhF0jY.mjs";
import { r as resolveFastModeSupport } from "./fast-mode-policy-gV8RHRpC.mjs";
import { t as acceptsAnthropicLiveModelContract } from "./live-model-contract-gate-VFLg7PhS.mjs";
import { t as anthropicMediaUnderstandingProvider } from "./media-understanding-provider-Da7rtyfS.mjs";
import { t as probeClaudeCliAuthStatus } from "./cli-auth-seam-Bgklw1Tj.mjs";
import { i as resolveThinkingProfile } from "./provider-policy-api-Cu19RssU.mjs";
import { n as registerClaudeSessionDiscovery, t as createClaudeSessionNodeInvokePolicies } from "./session-catalog-registration-Bu5gm3lR.mjs";
import { c as wrapAnthropicProviderStream, n as createAnthropicClaudeCodeIdentityWrapper } from "./stream-wrappers-McLbfWyW.mjs";
import { n as resolveAnthropicUsageAuth, t as fetchAnthropicUsage } from "./usage-DnpPOO8j.mjs";
//#region extensions/anthropic/provider-discovery.ts
const availability = /* @__PURE__ */ new WeakMap();
const anthropicProviderDiscovery = {
	id: CLAUDE_CLI_BACKEND_ID,
	label: "Claude CLI",
	docsPath: "/providers/models",
	auth: [],
	async prepareSyntheticAuth({ config, provider, env = process.env, signal }) {
		signal?.throwIfAborted();
		if (!config || normalizeLowercaseStringOrEmpty(provider) !== "claude-cli") return;
		const environments = availability.get(config) ?? /* @__PURE__ */ new WeakMap();
		availability.set(config, environments);
		const captures = environments.get(env) ?? /* @__PURE__ */ new WeakMap();
		environments.set(env, captures);
		const owner = signal ?? config;
		const pending = captures.get(owner) ?? probeClaudeCliAuthStatus({
			env,
			signal
		});
		captures.set(owner, pending);
		const result = await pending;
		signal?.throwIfAborted();
		return result.status === "available" ? {
			apiKey: CLAUDE_CLI_NATIVE_AUTH_MARKER,
			source: "Claude CLI native auth",
			mode: "oauth"
		} : void 0;
	}
};
//#endregion
//#region extensions/anthropic/register.runtime.ts
/**
* Anthropic provider runtime registration. It owns API-key/setup-token/Claude
* CLI auth, dynamic model normalization, usage auth, media, and stream wrappers.
*/
const loadAuthRuntime = createLazyRuntimeModule(() => import("./extensions/anthropic/auth.runtime.js"));
const buildOpenAICompatibleProviderCatalog = createLazyRuntimeMethod(createLazyRuntimeModule(() => import("./plugin-sdk/provider-catalog-live-runtime.js")), (runtime) => runtime.buildOpenAICompatibleProviderCatalog);
const PROVIDER_ID = "anthropic";
function classifyAnthropicFailoverDescriptor(value) {
	switch (value?.trim().toUpperCase()) {
		case "RATE_LIMIT_ERROR": return "rate_limit";
		case "API_ERROR": return "server_error";
		default: return;
	}
}
const DEFAULT_ANTHROPIC_MODEL = "anthropic/claude-opus-5";
const ANTHROPIC_OPUS_48_MODEL_ID = "claude-opus-4-8";
const ANTHROPIC_OPUS_48_DOT_MODEL_ID = "claude-opus-4.8";
const ANTHROPIC_OPUS_47_MODEL_ID = "claude-opus-4-7";
const ANTHROPIC_OPUS_47_DOT_MODEL_ID = "claude-opus-4.7";
const ANTHROPIC_1M_CONTEXT_TOKENS = 1e6;
const ANTHROPIC_MODERN_MAX_OUTPUT_TOKENS = 128e3;
const ANTHROPIC_OPUS_46_MODEL_ID = "claude-opus-4-6";
const ANTHROPIC_OPUS_46_DOT_MODEL_ID = "claude-opus-4.6";
const ANTHROPIC_OPUS_47_TEMPLATE_MODEL_IDS = [ANTHROPIC_OPUS_46_MODEL_ID, ANTHROPIC_OPUS_46_DOT_MODEL_ID];
const ANTHROPIC_SONNET_46_MODEL_ID = "claude-sonnet-4-6";
const ANTHROPIC_SONNET_46_DOT_MODEL_ID = "claude-sonnet-4.6";
function buildAnthropicCatalogProvider() {
	return buildManifestModelProviderConfig({
		providerId: PROVIDER_ID,
		catalog: modelCatalog.providers.anthropic
	});
}
/**
* Discovery credentials arrive as either an API key or a Claude subscription
* OAuth access token. Anthropic rejects an OAuth token sent as `x-api-key`, and
* rejects the request outright when both auth headers are present, so the two
* shapes must select mutually exclusive headers.
*/
function buildAnthropicDiscoveryAuthHeaders(key) {
	if (!key) return {};
	return isAnthropicOAuthApiKey(key) ? { authorization: `Bearer ${key}` } : { "x-api-key": key };
}
/**
* Live discovery replaces the seed catalog with whatever `/v1/models` returns.
* Anthropic does not publish every model it serves, so replacement alone would
* hide shipped entries that have no live row. Re-add the manifest models the
* live response omitted; discovered rows still win on shared ids.
*/
function restoreUnpublishedAnthropicModels(result) {
	if (!result || !("provider" in result)) return result;
	const discovered = result.provider.models ?? [];
	if (discovered.length === 0) return result;
	const discoveredIds = new Set(discovered.map((model) => model.id));
	const unpublished = (buildAnthropicCatalogProvider().models ?? []).filter((model) => !discoveredIds.has(model.id));
	if (unpublished.length === 0) return result;
	return {
		...result,
		provider: {
			...result.provider,
			models: [...discovered, ...unpublished.toSorted((a, b) => a.id.localeCompare(b.id))]
		}
	};
}
function resolveAnthropicModelCost(modelId) {
	const normalized = resolveClaudeModelIdentity({ id: modelId }).replace(/-\d{8}$/, "");
	const id = CLAUDE_MODEL_ID_ALIASES.get(normalized) ?? normalized;
	return modelCatalog.providers.anthropic.models.find((model) => model.id === id)?.cost;
}
const CLAUDE_CLI_CANONICAL_ALLOWLIST_REFS = CLAUDE_CLI_DEFAULT_ALLOWLIST_REFS.map((ref) => ref.startsWith(`claude-cli/`) ? `anthropic/${ref.slice(CLAUDE_CLI_BACKEND_ID.length + 1)}` : ref);
function resolveAnthropic46ForwardCompatModel(params) {
	const trimmedModelId = params.ctx.modelId.trim();
	const lower = normalizeLowercaseStringOrEmpty(trimmedModelId);
	if (trimmedModelId !== lower) return;
	if (!(lower === params.dashModelId || lower === params.dotModelId || lower.startsWith(`${params.dashModelId}-`) || lower.startsWith(`${params.dotModelId}-`))) return;
	const templateIds = [];
	if (lower.startsWith(params.dashModelId)) templateIds.push(lower.replace(params.dashModelId, params.dashTemplateId));
	if (lower.startsWith(params.dotModelId)) templateIds.push(lower.replace(params.dotModelId, params.dotTemplateId));
	templateIds.push(...params.fallbackTemplateIds);
	return cloneFirstTemplateModel({
		providerId: PROVIDER_ID,
		modelId: trimmedModelId,
		templateIds,
		ctx: params.ctx,
		patch: normalizeLowercaseStringOrEmpty(params.ctx.provider) === "claude-cli" ? { provider: CLAUDE_CLI_BACKEND_ID } : void 0
	});
}
function resolveAnthropicSnapshotModel(ctx) {
	const modelId = ctx.modelId.trim();
	const normalizedModelId = normalizeLowercaseStringOrEmpty(modelId);
	const match = /^(claude-[a-z0-9]+(?:-[a-z0-9]+)*)-\d{8}$/.exec(normalizedModelId);
	if (modelId !== normalizedModelId || normalizeLowercaseStringOrEmpty(ctx.provider) !== PROVIDER_ID || !match) return;
	const templateId = match[1];
	const captured = cloneFirstTemplateModel({
		providerId: PROVIDER_ID,
		modelId,
		templateIds: [templateId],
		ctx
	});
	if (captured) return captured;
	const template = resolveAnthropicManifestModel(templateId);
	return template ? {
		...template,
		id: modelId,
		name: modelId
	} : void 0;
}
/** Newest Claude generation whose request contract this plugin encodes. */
const ANTHROPIC_NEWEST_KNOWN_GENERATION = {
	major: 5,
	minor: 0
};
/**
* Read the generation from either Claude id order: `claude-<family>-<major>[-<minor>]`
* (4.6 onward) and `claude-<major>[-<minor>]-<family>` (through 3.7). The minor
* capture is bounded to two digits so a trailing snapshot date such as
* `claude-opus-4-20250514` does not parse as a minor version.
*/
function resolveAnthropicModelGeneration(modelId) {
	const match = /claude-[a-z]+-(\d{1,2})(?:-(\d{1,2}))?(?![0-9])/.exec(modelId) ?? /claude-(\d{1,2})(?:-(\d{1,2}))?(?![0-9])/.exec(modelId);
	if (!match) return;
	return {
		major: Number(match[1]),
		minor: match[2] === void 0 ? 0 : Number(match[2])
	};
}
/**
* Claude ids from a generation newer than anything this plugin encodes. Request
* shaping is selected by version predicates in `@openclaw/llm-core`, so such an
* id would otherwise fall through to pre-4.6 shaping — manual `budget_tokens`
* plus caller sampling params — which current models reject outright.
*/
function isAnthropicUnreleasedGenerationModel(modelId) {
	if (matchesAnthropicModernModel(modelId)) return false;
	const generation = resolveAnthropicModelGeneration(modelId);
	if (!generation) return false;
	return generation.major > ANTHROPIC_NEWEST_KNOWN_GENERATION.major || generation.major === ANTHROPIC_NEWEST_KNOWN_GENERATION.major && generation.minor > ANTHROPIC_NEWEST_KNOWN_GENERATION.minor;
}
/**
* Route an unreleased id onto the newest contract we encode, matching family
* when we recognize it. Stamping `canonicalModelId` is the same seam Bedrock and
* Mantle use to map a provider-native id onto a canonical Claude contract, so
* shaping follows without teaching the shared contracts about unknown ids.
*/
function resolveAnthropicUnreleasedCanonicalModelId(modelId) {
	return /(?:^|-)claude-sonnet-/.test(modelId) ? "claude-sonnet-5" : "claude-opus-5";
}
let anthropicManifestModelIndex;
function resolveAnthropicManifestModel(modelId) {
	if (!anthropicManifestModelIndex) {
		anthropicManifestModelIndex = /* @__PURE__ */ new Map();
		const catalog = buildAnthropicCatalogProvider();
		for (const model of catalog.models ?? []) {
			const api = model.api ?? catalog.api;
			const baseUrl = model.baseUrl ?? catalog.baseUrl;
			if (api && baseUrl) anthropicManifestModelIndex.set(model.id, {
				...model,
				input: model.input.filter((item) => item === "text" || item === "image"),
				provider: PROVIDER_ID,
				api,
				baseUrl
			});
		}
	}
	return anthropicManifestModelIndex.get(modelId);
}
function resolveAnthropicManifestCompat(provider, modelId) {
	return normalizeLowercaseStringOrEmpty(provider) === PROVIDER_ID ? resolveAnthropicManifestModel(modelId)?.compat : void 0;
}
function buildAnthropicForwardCompatModel(ctx) {
	const trimmedModelId = ctx.modelId.trim();
	const lower = normalizeLowercaseStringOrEmpty(trimmedModelId);
	const normalizedProvider = normalizeLowercaseStringOrEmpty(ctx.provider);
	const unreleasedGeneration = isAnthropicUnreleasedGenerationModel(lower);
	if (trimmedModelId !== lower || !(matchesAnthropicModernModel(lower) || unreleasedGeneration)) return;
	if (isAnthropicMandatoryClaude5Model(lower) && normalizedProvider !== PROVIDER_ID) return;
	const provider = normalizedProvider === "claude-cli" ? CLAUDE_CLI_BACKEND_ID : PROVIDER_ID;
	const compat = ctx.modelRegistry.find(provider, trimmedModelId)?.compat ?? resolveAnthropicManifestCompat(provider, trimmedModelId);
	return {
		id: trimmedModelId,
		name: trimmedModelId,
		provider,
		...compat ? { compat } : {},
		api: "anthropic-messages",
		baseUrl: "https://api.anthropic.com",
		reasoning: true,
		input: ["text", "image"],
		cost: (provider === PROVIDER_ID ? resolveAnthropicModelCost(trimmedModelId) : void 0) ?? {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow: resolveAnthropicFixedContextWindow(provider, trimmedModelId) ?? 2e5,
		maxTokens: isAnthropic128kOutputModel(trimmedModelId) ? ANTHROPIC_MODERN_MAX_OUTPUT_TOKENS : 64e3,
		...unreleasedGeneration ? { params: { canonicalModelId: resolveAnthropicUnreleasedCanonicalModelId(lower) } } : {},
		...supportsClaudeNativeXhighEffort({ id: trimmedModelId }) ? { thinkingLevelMap: {
			...requiresClaudeMandatoryAdaptiveThinking({ id: trimmedModelId }) ? { minimal: "low" } : {},
			xhigh: "xhigh",
			max: "max"
		} } : supportsAnthropicNativeMaxEffort(trimmedModelId) ? { thinkingLevelMap: { max: "max" } } : {}
	};
}
function resolveAnthropicForwardCompatModel(ctx) {
	return resolveAnthropicSnapshotModel(ctx) ?? resolveAnthropic46ForwardCompatModel({
		ctx,
		dashModelId: ANTHROPIC_OPUS_48_MODEL_ID,
		dotModelId: ANTHROPIC_OPUS_48_DOT_MODEL_ID,
		dashTemplateId: ANTHROPIC_OPUS_47_MODEL_ID,
		dotTemplateId: ANTHROPIC_OPUS_47_DOT_MODEL_ID,
		fallbackTemplateIds: ANTHROPIC_OPUS_47_TEMPLATE_MODEL_IDS
	}) ?? resolveAnthropic46ForwardCompatModel({
		ctx,
		dashModelId: ANTHROPIC_OPUS_47_MODEL_ID,
		dotModelId: ANTHROPIC_OPUS_47_DOT_MODEL_ID,
		dashTemplateId: ANTHROPIC_OPUS_46_MODEL_ID,
		dotTemplateId: ANTHROPIC_OPUS_46_DOT_MODEL_ID,
		fallbackTemplateIds: ANTHROPIC_OPUS_47_TEMPLATE_MODEL_IDS
	}) ?? resolveAnthropic46ForwardCompatModel({
		ctx,
		dashModelId: ANTHROPIC_OPUS_46_MODEL_ID,
		dotModelId: ANTHROPIC_OPUS_46_DOT_MODEL_ID,
		dashTemplateId: ANTHROPIC_OPUS_47_MODEL_ID,
		dotTemplateId: ANTHROPIC_OPUS_46_MODEL_ID,
		fallbackTemplateIds: ANTHROPIC_OPUS_47_TEMPLATE_MODEL_IDS
	}) ?? resolveAnthropic46ForwardCompatModel({
		ctx,
		dashModelId: ANTHROPIC_SONNET_46_MODEL_ID,
		dotModelId: ANTHROPIC_SONNET_46_DOT_MODEL_ID,
		dashTemplateId: ANTHROPIC_SONNET_46_MODEL_ID,
		dotTemplateId: ANTHROPIC_SONNET_46_MODEL_ID,
		fallbackTemplateIds: [ANTHROPIC_SONNET_46_MODEL_ID, ANTHROPIC_SONNET_46_DOT_MODEL_ID]
	}) ?? buildAnthropicForwardCompatModel(ctx);
}
function isAnthropicGa1MModel(modelId) {
	return supportsClaude1MContext({ id: modelId });
}
function isAnthropicMandatoryClaude5Model(modelId) {
	return resolveClaudeFable5ModelIdentity({ id: modelId }) !== void 0 || resolveClaudeMythos5ModelIdentity({ id: modelId }) !== void 0;
}
function isAnthropicSonnet5Model(modelId) {
	return resolveClaudeSonnet5ModelIdentity({ id: modelId }) !== void 0;
}
function isAnthropicOpus5Model(modelId) {
	return resolveClaudeOpus5ModelIdentity({ id: modelId }) !== void 0;
}
function isAnthropicExact1MClaude5Model(modelId) {
	return isAnthropicMandatoryClaude5Model(modelId) || isAnthropicSonnet5Model(modelId) || isAnthropicOpus5Model(modelId);
}
function resolveAnthropicFixedContextWindow(provider, modelId) {
	return isAnthropicExact1MClaude5Model(modelId) || isAnthropicGa1MModel(modelId) && (normalizeLowercaseStringOrEmpty(provider) !== "claude-cli" || normalizeLowercaseStringOrEmpty(modelId).endsWith("[1m]")) ? ANTHROPIC_1M_CONTEXT_TOKENS : void 0;
}
function isAnthropic128kOutputModel(modelId) {
	return isAnthropicExact1MClaude5Model(modelId) || isAnthropicGa1MModel(modelId);
}
function isAnthropicLargeImageModel(modelId) {
	return supportsClaudeNativeXhighEffort({ id: modelId });
}
function isAnthropicMythosPreviewModel(modelId) {
	return /(?:^|-)claude-mythos-preview(?=$|[^a-z0-9])/.test(resolveClaudeModelIdentity({ id: modelId }));
}
function supportsAnthropicNativeMaxEffort(modelId) {
	return supportsClaudeNativeMaxEffort({ id: modelId }) || isAnthropicMythosPreviewModel(modelId);
}
function hasConfiguredModelOverride(config, provider, modelId, override) {
	const providers = config?.models?.providers;
	if (!providers || typeof providers !== "object") return false;
	const normalizedProvider = normalizeLowercaseStringOrEmpty(provider);
	const normalizedModelId = normalizeLowercaseStringOrEmpty(modelId);
	for (const [providerId, providerConfig] of Object.entries(providers)) {
		if (normalizeLowercaseStringOrEmpty(providerId) !== normalizedProvider) continue;
		if (!Array.isArray(providerConfig?.models)) continue;
		for (const model of providerConfig.models) {
			if (normalizeLowercaseStringOrEmpty(typeof model?.id === "string" ? model.id : "") !== normalizedModelId) continue;
			if (override === "cost" ? model?.cost !== void 0 : typeof model?.contextTokens === "number" && model.contextTokens > 0 || typeof model?.contextWindow === "number" && model.contextWindow > 0) return true;
		}
	}
	return false;
}
function applyAnthropicFixedContextWindow(params) {
	const fixedContextWindow = resolveAnthropicFixedContextWindow(params.provider, params.contractModelId);
	if (fixedContextWindow === void 0) return;
	if (hasConfiguredModelOverride(params.config, params.provider, params.modelId, "context")) return;
	const exactContextWindow = isAnthropicExact1MClaude5Model(params.contractModelId);
	const nextContextWindow = exactContextWindow ? fixedContextWindow : Math.max(params.model.contextWindow ?? 0, fixedContextWindow);
	const nextContextTokens = exactContextWindow ? fixedContextWindow : typeof params.model.contextTokens === "number" ? Math.max(params.model.contextTokens, fixedContextWindow) : fixedContextWindow;
	if (nextContextWindow === params.model.contextWindow && nextContextTokens === params.model.contextTokens) return;
	return {
		...params.model,
		contextWindow: nextContextWindow,
		contextTokens: nextContextTokens
	};
}
function applyAnthropicModernMaxTokens(params) {
	if (params.model.maxTokensSource === "configured" || !isAnthropic128kOutputModel(params.modelId)) return;
	if ((params.model.maxTokens ?? 0) >= ANTHROPIC_MODERN_MAX_OUTPUT_TOKENS) return;
	return {
		...params.model,
		maxTokens: ANTHROPIC_MODERN_MAX_OUTPUT_TOKENS
	};
}
function applyAnthropicThinkingLevelMap(params) {
	const mandatoryClaude5 = requiresClaudeMandatoryAdaptiveThinking({ id: params.modelId });
	const nativeXhigh = mandatoryClaude5 || supportsClaudeNativeXhighEffort({ id: params.modelId });
	if (!supportsAnthropicNativeMaxEffort(params.modelId)) return;
	const current = params.model.thinkingLevelMap;
	const nativeDefaults = isAnthropicMythosPreviewModel(params.modelId) ? { max: "max" } : {
		...mandatoryClaude5 ? { minimal: "low" } : {},
		xhigh: nativeXhigh ? "xhigh" : null,
		max: "max"
	};
	const currentEfforts = current;
	if (Object.keys(nativeDefaults).every((level) => currentEfforts?.[level] !== void 0)) return;
	return {
		...params.model,
		thinkingLevelMap: {
			...nativeDefaults,
			...current
		}
	};
}
function matchesAnthropicModernModel(modelId) {
	return supportsClaudeAdaptiveThinking({ id: modelId }) || isAnthropicMythosPreviewModel(modelId);
}
function hasImageInput(input) {
	return Array.isArray(input) && input.includes("image");
}
function supportsAnthropicImageInput(modelId, modelName) {
	return [modelId, modelName].filter((value) => typeof value === "string").some((candidate) => matchesAnthropicModernModel(candidate));
}
function resolveAnthropicImageMediaInput(modelId, modelName) {
	if (!supportsAnthropicImageInput(modelId, modelName)) return;
	const largeImageModel = [modelId, modelName].filter((value) => typeof value === "string").some((ref) => isAnthropicLargeImageModel(ref));
	return { image: {
		maxSidePx: largeImageModel ? 2576 : 1568,
		preferredSidePx: largeImageModel ? 2576 : 1568,
		tokenMode: "provider"
	} };
}
function applyAnthropicImageInputCapability(params) {
	if (hasImageInput(params.model.input)) return;
	if (!supportsAnthropicImageInput(params.modelId, params.model.name)) return;
	return {
		...params.model,
		input: ["text", "image"]
	};
}
function normalizeAnthropicResolvedModel(ctx) {
	const contractModelId = resolveClaudeModelIdentity({
		id: ctx.modelId,
		params: ctx.model.params
	});
	if (isAnthropicMandatoryClaude5Model(contractModelId) && normalizeLowercaseStringOrEmpty(ctx.provider) !== PROVIDER_ID) return;
	const contractModel = isAnthropicExact1MClaude5Model(contractModelId) && !ctx.model.reasoning ? {
		...ctx.model,
		reasoning: true
	} : ctx.model;
	const imageCapableModel = applyAnthropicImageInputCapability({
		modelId: contractModelId,
		model: contractModel
	}) ?? contractModel;
	const mediaInput = resolveAnthropicImageMediaInput(contractModelId, imageCapableModel.name);
	const mediaInputModel = mediaInput ? {
		...imageCapableModel,
		mediaInput: {
			...mediaInput,
			...imageCapableModel.mediaInput,
			image: {
				...mediaInput.image,
				...imageCapableModel.mediaInput?.image
			}
		}
	} : imageCapableModel;
	const outputModel = applyAnthropicModernMaxTokens({
		modelId: contractModelId,
		model: mediaInputModel
	}) ?? mediaInputModel;
	const thinkingLevelModel = applyAnthropicThinkingLevelMap({
		modelId: contractModelId,
		model: outputModel
	}) ?? outputModel;
	const contextWindowModel = applyAnthropicFixedContextWindow({
		config: ctx.config,
		provider: ctx.provider,
		modelId: ctx.modelId,
		contractModelId,
		model: thinkingLevelModel
	}) ?? thinkingLevelModel;
	const cost = resolveAnthropicModelCost(contractModelId);
	const pricingModel = normalizeLowercaseStringOrEmpty(ctx.provider) === PROVIDER_ID && !hasConfiguredModelOverride(ctx.config, ctx.provider, ctx.modelId, "cost") && cost && !modelCostsEqual(contextWindowModel.cost, cost) ? {
		...contextWindowModel,
		cost
	} : contextWindowModel;
	return pricingModel === ctx.model ? void 0 : pricingModel;
}
/** Build the full Anthropic provider descriptor used by runtime registration. */
function buildAnthropicProvider() {
	const providerId = "anthropic";
	const defaultAnthropicModel = DEFAULT_ANTHROPIC_MODEL;
	return {
		id: providerId,
		label: "Anthropic",
		deprecatedProfileIds: [CLAUDE_CLI_PROFILE_ID],
		docsPath: "/providers/models",
		hookAliases: [CLAUDE_CLI_BACKEND_ID],
		envVars: ["ANTHROPIC_OAUTH_TOKEN", "ANTHROPIC_API_KEY"],
		oauthProfileIdRepairs: [{
			legacyProfileId: "anthropic:default",
			promptLabel: "Anthropic"
		}],
		auth: [
			{
				id: "cli",
				label: "Claude CLI",
				hint: "Keep using a local Claude CLI login and run Anthropic models through the Claude CLI runtime",
				kind: "custom",
				wizard: {
					choiceId: "anthropic-cli",
					choiceLabel: "Anthropic Claude CLI",
					choiceHint: "Keep using an existing Claude Code CLI login on this host",
					assistantPriority: -20,
					groupId: "anthropic",
					groupLabel: "Anthropic",
					groupHint: "Claude CLI + API key",
					modelAllowlist: {
						allowedKeys: [...CLAUDE_CLI_CANONICAL_ALLOWLIST_REFS],
						initialSelections: [CLAUDE_CLI_CANONICAL_DEFAULT_MODEL_REF],
						message: "Claude CLI models"
					}
				},
				run: async (ctx) => await (await loadAuthRuntime()).runAnthropicCliMigration(ctx),
				runNonInteractive: async (ctx) => await (await loadAuthRuntime()).runAnthropicCliMigrationNonInteractive({
					config: ctx.config,
					runtime: ctx.runtime,
					agentDir: ctx.agentDir
				})
			},
			{
				id: "setup-token",
				label: "Anthropic setup-token",
				hint: "Paste a long-lived token created with 'claude setup-token'",
				kind: "token",
				wizard: {
					choiceId: "setup-token",
					choiceLabel: "Anthropic setup-token",
					choiceHint: "Token created by running 'claude setup-token' in your terminal",
					assistantPriority: 40,
					groupId: "anthropic",
					groupLabel: "Anthropic",
					groupHint: "Claude CLI + API key + token"
				},
				run: async (ctx) => await (await loadAuthRuntime()).runAnthropicSetupTokenAuth(ctx, defaultAnthropicModel),
				validateNonInteractive: async (ctx) => Boolean((await loadAuthRuntime()).validateAnthropicSetupTokenNonInteractive(ctx)),
				runNonInteractive: async (ctx) => await (await loadAuthRuntime()).runAnthropicSetupTokenNonInteractive(ctx, defaultAnthropicModel)
			},
			createProviderApiKeyAuthMethod({
				providerId,
				methodId: "api-key",
				label: "Anthropic API key",
				hint: "Direct Anthropic API key",
				optionKey: "anthropicApiKey",
				flagName: "--anthropic-api-key",
				envVar: "ANTHROPIC_API_KEY",
				promptMessage: "Enter Anthropic API key",
				defaultModel: defaultAnthropicModel,
				expectedProviders: ["anthropic"],
				wizard: {
					choiceId: "apiKey",
					choiceLabel: "Anthropic API key",
					groupId: "anthropic",
					groupLabel: "Anthropic",
					groupHint: "Claude CLI + API key"
				}
			})
		],
		catalog: {
			order: "simple",
			run: async (ctx) => restoreUnpublishedAnthropicModels(await buildOpenAICompatibleProviderCatalog({
				discoveryMode: "strict",
				ctx,
				providerId,
				buildProvider: buildAnthropicCatalogProvider,
				modelDiscovery: {
					endpointPath: "v1/models",
					buildRequestHeaders: ({ apiKey, discoveryApiKey }) => ({
						"anthropic-version": "2023-06-01",
						...buildAnthropicDiscoveryAuthHeaders(discoveryApiKey ?? apiKey)
					}),
					acceptUnknownModel: acceptsAnthropicLiveModelContract
				}
			}))
		},
		staticCatalog: {
			order: "simple",
			run: async () => ({ provider: buildAnthropicCatalogProvider() })
		},
		normalizeConfig: ({ provider, providerConfig }) => normalizeAnthropicProviderConfigForProvider({
			provider,
			providerConfig
		}),
		applyConfigDefaults: ({ config, env }) => applyAnthropicConfigDefaults({
			config,
			env
		}),
		resolveDynamicModel: (ctx) => {
			const model = resolveAnthropicForwardCompatModel(ctx);
			if (!model) return;
			return normalizeAnthropicResolvedModel({
				config: ctx.config,
				provider: ctx.provider,
				modelId: ctx.modelId,
				model
			}) ?? model;
		},
		normalizeResolvedModel: (ctx) => normalizeAnthropicResolvedModel(ctx),
		prepareSyntheticAuth: anthropicProviderDiscovery.prepareSyntheticAuth,
		...buildProviderReplayFamilyHooks({ family: "native-anthropic-by-model" }),
		isModernModelRef: ({ provider, modelId }) => matchesAnthropicModernModel(modelId) && (!isAnthropicMandatoryClaude5Model(modelId) || normalizeLowercaseStringOrEmpty(provider) === PROVIDER_ID),
		resolveReasoningOutputMode: () => "native",
		classifyFailoverReason: ({ code, errorType }) => classifyAnthropicFailoverDescriptor(errorType) ?? classifyAnthropicFailoverDescriptor(code),
		resolveThinkingProfile,
		wrapStreamFn: wrapAnthropicProviderStream,
		resolveFastModeSupport,
		resolveUsageAuth: resolveAnthropicUsageAuth,
		fetchUsageSnapshot: fetchAnthropicUsage,
		isCacheTtlEligible: () => true,
		buildAuthDoctorHint: async (ctx) => (await loadAuthRuntime()).buildAnthropicAuthDoctorHint({
			config: ctx.config,
			store: ctx.store,
			profileId: ctx.profileId
		})
	};
}
/** Register Anthropic provider, Claude CLI backend, and media understanding provider. */
function registerAnthropicPlugin(api) {
	const version = createClaudeCodeVersionProbe(api);
	api.registerCliBackend(buildAnthropicCliBackend(version));
	api.registerProvider({
		...buildAnthropicProvider(),
		wrapStreamFn: (ctx) => createAnthropicClaudeCodeIdentityWrapper(wrapAnthropicProviderStream(ctx), version.resolveVersion),
		wrapSimpleCompletionStreamFn: (ctx) => createAnthropicClaudeCodeIdentityWrapper(ctx.streamFn, version.resolveVersion, ctx.sourceApi)
	});
	api.registerMediaUnderstandingProvider(anthropicMediaUnderstandingProvider);
	registerClaudeSessionDiscovery(api);
	for (const policy of createClaudeSessionNodeInvokePolicies()) api.registerNodeInvokePolicy(policy);
}
//#endregion
export { registerAnthropicPlugin as n, buildAnthropicProvider as t };
