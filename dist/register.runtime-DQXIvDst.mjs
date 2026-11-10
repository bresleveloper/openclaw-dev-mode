import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { a as createLazyRuntimeSurface, r as createLazyRuntimeModule, t as createLazyRuntimeMethod } from "./lazy-runtime-CJrzFzqU.mjs";
import { C as supportsClaudeNativeMaxEffort, _ as resolveClaudeSonnet55ModelIdentity, b as supportsClaudeAdaptiveThinking, d as resolveClaudeHaiku55ModelIdentity, f as resolveClaudeModelIdentity, g as resolveClaudeOpus5ModelIdentity, l as requiresClaudeMandatoryAdaptiveThinking, p as resolveClaudeMythos5ModelIdentity, u as resolveClaudeFable5ModelIdentity, v as resolveClaudeSonnet5ModelIdentity, w as supportsClaudeNativeXhighEffort, y as supportsClaude1MContext } from "./anthropic-B3HirzdP.mjs";
import { n as buildManifestModelProviderConfig } from "./provider-catalog-D0GOHaAj.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { c as cloneFirstTemplateModel, o as modelCostsEqual, r as buildProviderReplayFamilyHooks } from "./provider-model-shared-B_4afNJ5.mjs";
import { n as createProviderApiKeyAuthMethod } from "./provider-api-key-auth-ZKXZrO2f.mjs";
import "./provider-catalog-shared-Di2nlF3g.mjs";
import "./provider-entry-CKUq_-Jy.mjs";
import { c as CLAUDE_CLI_PROFILE_ID, d as CLAUDE_MODEL_ID_ALIASES, n as CLAUDE_CLI_CANONICAL_DEFAULT_MODEL_REF, o as CLAUDE_CLI_NATIVE_AUTH_MARKER, p as modelCatalog, t as CLAUDE_CLI_BACKEND_ID } from "./cli-constants-Cgfnh_uF.mjs";
import { t as buildAnthropicCliBackend } from "./cli-backend-B6Sgfcv8.mjs";
import { t as createClaudeCodeVersionProbe } from "./cli-version-O_LFm7_F.mjs";
import { n as normalizeAnthropicProviderConfigForProvider, t as applyAnthropicConfigDefaults } from "./config-defaults-DyBXpJmd.mjs";
import { r as resolveFastModeSupport } from "./fast-mode-policy-BZ2pCI7E.mjs";
import { t as anthropicMediaUnderstandingProvider } from "./media-understanding-provider-DH7eUQst.mjs";
import { n as createAnthropicProvider, t as createAnthropicAuthMethods } from "./provider-contract-api-QBvYhD5y.mjs";
import { t as probeClaudeCliAuthStatus } from "./cli-auth-seam-D_qDTt5a.mjs";
import { t as discoverClaudeCliModels } from "./cli-model-discovery-nGYChQbW.mjs";
import { r as resolveThinkingProfile } from "./provider-policy-api-DSLfcNKP.mjs";
import { n as registerClaudeSessionDiscovery, t as createClaudeSessionNodeInvokePolicies } from "./session-catalog-registration-C-fNCCst.mjs";
import { n as resolveAnthropicUsageAuth, t as fetchAnthropicUsage } from "./usage-Dh8eFj5u.mjs";
//#region extensions/anthropic/provider-discovery.ts
const modelCaptures = /* @__PURE__ */ new WeakMap();
const availability = /* @__PURE__ */ new WeakMap();
async function prepareClaudeCliAuth({ config, provider, env = process.env, signal }) {
	signal?.throwIfAborted();
	if (!config || normalizeLowercaseStringOrEmpty(provider) !== "claude-cli") return;
	const environments = availability.get(config) ?? /* @__PURE__ */ new WeakMap();
	availability.set(config, environments);
	const captures = environments.get(env) ?? /* @__PURE__ */ new WeakMap();
	environments.set(env, captures);
	const owner = signal ?? config;
	const now = Date.now();
	let capture = captures.get(owner);
	if (!capture || capture.expiresAt <= now) {
		capture = {
			expiresAt: now + 6e4,
			pending: probeClaudeCliAuthStatus({
				env,
				signal
			})
		};
		captures.set(owner, capture);
	}
	const result = await capture.pending;
	signal?.throwIfAborted();
	return result.status !== "missing" && result.status !== "not-installed" ? {
		apiKey: CLAUDE_CLI_NATIVE_AUTH_MARKER,
		source: "Claude CLI native auth",
		mode: "oauth",
		nativeAuth: {
			runtime: CLAUDE_CLI_BACKEND_ID,
			mode: "oauth"
		}
	} : void 0;
}
const anthropicProviderDiscovery = {
	id: CLAUDE_CLI_BACKEND_ID,
	label: "Claude CLI",
	docsPath: "/providers/models",
	auth: [],
	catalog: {
		order: "simple",
		async run(ctx) {
			if (ctx.providerIds && !ctx.providerIds.includes("claude-cli")) return null;
			if (!(await prepareClaudeCliAuth({
				config: ctx.config,
				provider: "claude-cli",
				env: ctx.env,
				signal: ctx.signal
			}))?.apiKey) return null;
			ctx.signal?.throwIfAborted();
			const environments = modelCaptures.get(ctx.config) ?? /* @__PURE__ */ new WeakMap();
			modelCaptures.set(ctx.config, environments);
			const captures = environments.get(ctx.env) ?? /* @__PURE__ */ new WeakMap();
			environments.set(ctx.env, captures);
			const owner = ctx.signal ?? ctx.config;
			const pending = captures.get(owner) ?? discoverClaudeCliModels(ctx);
			captures.set(owner, pending);
			try {
				const models = await pending;
				ctx.signal?.throwIfAborted();
				return {
					providers: { [CLAUDE_CLI_BACKEND_ID]: {
						baseUrl: "https://api.anthropic.com",
						api: "anthropic-messages",
						models
					} },
					outcomes: [{
						provider: CLAUDE_CLI_BACKEND_ID,
						status: "ready",
						listedModelIds: models.map((model) => model.id)
					}]
				};
			} catch {
				ctx.signal?.throwIfAborted();
				return {
					providers: { [CLAUDE_CLI_BACKEND_ID]: {
						baseUrl: "https://api.anthropic.com",
						api: "anthropic-messages",
						models: []
					} },
					outcomes: [{
						provider: CLAUDE_CLI_BACKEND_ID,
						status: "unavailable"
					}]
				};
			}
		}
	},
	prepareSyntheticAuth: prepareClaudeCliAuth
};
//#endregion
//#region extensions/anthropic/register.runtime.ts
const loadAuthRuntime = createLazyRuntimeModule(() => import("./extensions/anthropic/auth.runtime.js"));
const loadStreamRuntime = createLazyRuntimeModule(() => import("./extensions/anthropic/stream-wrappers.js"));
const buildOpenAICompatibleProviderCatalog = createLazyRuntimeMethod(createLazyRuntimeModule(() => import("./plugin-sdk/provider-catalog-live-runtime.js")), (runtime) => runtime.buildOpenAICompatibleProviderCatalog);
const PROVIDER_ID = "anthropic";
function classifyAnthropicFailoverDescriptor(value) {
	switch (value?.trim().toUpperCase()) {
		case "RATE_LIMIT_ERROR": return "rate_limit";
		case "API_ERROR": return "server_error";
		default: return;
	}
}
const ANTHROPIC_1M_CONTEXT_TOKENS = 1e6;
const ANTHROPIC_MODERN_MAX_OUTPUT_TOKENS = 128e3;
const ANTHROPIC_4X_TEMPLATE_REPLACEMENTS = Object.entries({
	"claude-opus-4-8": "claude-opus-4-7",
	"claude-opus-4.8": "claude-opus-4.7",
	"claude-opus-4-7": "claude-opus-4-6",
	"claude-opus-4.7": "claude-opus-4.6",
	"claude-opus-4-6": "claude-opus-4-7",
	"claude-opus-4.6": "claude-opus-4-6",
	"claude-sonnet-4-6": "claude-sonnet-4-6",
	"claude-sonnet-4.6": "claude-sonnet-4-6"
});
function buildAnthropicCatalogProvider() {
	return buildManifestModelProviderConfig({
		providerId: PROVIDER_ID,
		catalog: modelCatalog.providers.anthropic
	});
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
	return modelCatalog.providers.anthropic.models.find((model) => model.id === id)?.cost ? resolveAnthropicManifestModel(id)?.cost : void 0;
}
function resolveAnthropic4xForwardCompatModel(ctx) {
	const trimmedModelId = ctx.modelId.trim();
	const lower = normalizeLowercaseStringOrEmpty(trimmedModelId);
	if (trimmedModelId !== lower) return;
	const replacement = ANTHROPIC_4X_TEMPLATE_REPLACEMENTS.find(([modelId]) => lower === modelId || lower.startsWith(`${modelId}-`));
	if (!replacement) return;
	const [modelId, templateId] = replacement;
	const family = modelId.startsWith("claude-sonnet-") ? "sonnet" : "opus";
	return cloneFirstTemplateModel({
		providerId: PROVIDER_ID,
		modelId: trimmedModelId,
		templateIds: [
			lower.replace(modelId, templateId),
			`claude-${family}-4-6`,
			`claude-${family}-4.6`
		],
		ctx,
		patch: normalizeLowercaseStringOrEmpty(ctx.provider) === "claude-cli" ? { provider: CLAUDE_CLI_BACKEND_ID } : void 0
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
/**
* Claude ids from a generation newer than anything this plugin encodes. Request
* shaping is selected by version predicates in `@openclaw/llm-core`, so such an
* id would otherwise fall through to pre-4.6 shaping — manual `budget_tokens`
* plus caller sampling params — which current models reject outright.
*/
function isAnthropicUnreleasedGenerationModel(modelId) {
	if (matchesAnthropicModernModel(modelId)) return false;
	const match = /claude-[a-z]+-(\d{1,2})(?:-(\d{1,2}))?(?![0-9])/.exec(modelId) ?? /claude-(\d{1,2})(?:-(\d{1,2}))?(?![0-9])/.exec(modelId);
	if (!match) return false;
	const major = Number(match[1]);
	return major > 5 || major === 5 && Number(match[2] ?? 0) > 0;
}
/**
* Route an unreleased id onto the newest contract we encode, matching family
* when we recognize it. Stamping `canonicalModelId` is the same seam Bedrock and
* Mantle use to map a provider-native id onto a canonical Claude contract, so
* shaping follows without teaching the shared contracts about unknown ids.
*/
function resolveAnthropicUnreleasedCanonicalModelId(modelId) {
	return /(?:^|-)claude-sonnet-/.test(modelId) ? "claude-sonnet-5-5" : "claude-opus-5-5";
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
function buildAnthropicForwardCompatModel(ctx) {
	const trimmedModelId = ctx.modelId.trim();
	const lower = normalizeLowercaseStringOrEmpty(trimmedModelId);
	const normalizedProvider = normalizeLowercaseStringOrEmpty(ctx.provider);
	const unreleasedGeneration = isAnthropicUnreleasedGenerationModel(lower);
	if (trimmedModelId !== lower || !(matchesAnthropicModernModel(lower) || unreleasedGeneration)) return;
	if (isAnthropicMandatoryClaude5Model(lower) && normalizedProvider !== PROVIDER_ID) return;
	const provider = normalizedProvider === "claude-cli" ? CLAUDE_CLI_BACKEND_ID : PROVIDER_ID;
	const catalogModel = ctx.modelRegistry.find(provider, trimmedModelId);
	const manifestModel = provider === PROVIDER_ID ? resolveAnthropicManifestModel(trimmedModelId) : void 0;
	const compat = catalogModel?.compat ?? manifestModel?.compat;
	return {
		id: trimmedModelId,
		name: trimmedModelId,
		provider,
		...compat ? { compat } : {},
		...manifestModel?.contextWindows ? {
			contextWindows: manifestModel.contextWindows,
			contextWindowDefault: manifestModel.contextWindowDefault
		} : {},
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
		...unreleasedGeneration ? { params: { canonicalModelId: resolveAnthropicUnreleasedCanonicalModelId(lower) } } : {}
	};
}
function resolveAnthropicForwardCompatModel(ctx) {
	return resolveAnthropicSnapshotModel(ctx) ?? resolveAnthropic4xForwardCompatModel(ctx) ?? buildAnthropicForwardCompatModel(ctx);
}
function isAnthropicMandatoryClaude5Model(modelId) {
	return resolveClaudeFable5ModelIdentity({ id: modelId }) !== void 0 || resolveClaudeMythos5ModelIdentity({ id: modelId }) !== void 0;
}
function isAnthropicExact1MClaude5Model(modelId) {
	return isAnthropicMandatoryClaude5Model(modelId) || resolveClaudeHaiku55ModelIdentity({ id: modelId }) !== void 0 || resolveClaudeSonnet5ModelIdentity({ id: modelId }) !== void 0 || resolveClaudeOpus5ModelIdentity({ id: modelId }) !== void 0;
}
function resolveAnthropicFixedContextWindow(provider, modelId) {
	return isAnthropicExact1MClaude5Model(modelId) || supportsClaude1MContext({ id: modelId }) && (normalizeLowercaseStringOrEmpty(provider) !== "claude-cli" || normalizeLowercaseStringOrEmpty(modelId).endsWith("[1m]")) ? ANTHROPIC_1M_CONTEXT_TOKENS : void 0;
}
function isAnthropic128kOutputModel(modelId) {
	return isAnthropicExact1MClaude5Model(modelId) || supportsClaude1MContext({ id: modelId });
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
	return Object.entries(providers).some(([providerId, providerConfig]) => normalizeLowercaseStringOrEmpty(providerId) === normalizedProvider && Array.isArray(providerConfig?.models) && providerConfig.models.some((model) => normalizeLowercaseStringOrEmpty(model?.id) === normalizedModelId && (override === "cost" ? model?.cost !== void 0 : typeof model?.contextTokens === "number" && model.contextTokens > 0 || typeof model?.contextWindow === "number" && model.contextWindow > 0)));
}
function matchesAnthropicModernModel(modelId) {
	return supportsClaudeAdaptiveThinking({ id: modelId }) || isAnthropicMythosPreviewModel(modelId);
}
function normalizeAnthropicResolvedModel(ctx) {
	const model = ctx.model;
	const contractModelId = resolveClaudeModelIdentity({
		id: ctx.modelId,
		params: model.params
	});
	const provider = normalizeLowercaseStringOrEmpty(ctx.provider);
	if (isAnthropicMandatoryClaude5Model(contractModelId) && provider !== PROVIDER_ID) return;
	const patch = {};
	const exactContextWindow = isAnthropicExact1MClaude5Model(contractModelId);
	if (exactContextWindow && !model.reasoning) patch.reasoning = true;
	const imageRefs = [contractModelId, model.name].filter((value) => typeof value === "string");
	if (imageRefs.some(matchesAnthropicModernModel)) {
		if (!Array.isArray(model.input) || !model.input.includes("image")) patch.input = ["text", "image"];
		const sidePx = imageRefs.some((id) => supportsClaudeNativeXhighEffort({ id })) ? 2576 : 1568;
		patch.mediaInput = {
			...model.mediaInput,
			image: {
				maxSidePx: sidePx,
				preferredSidePx: sidePx,
				tokenMode: "provider",
				...model.mediaInput?.image
			}
		};
	}
	if (model.maxTokensSource !== "configured" && isAnthropic128kOutputModel(contractModelId) && !((model.maxTokens ?? 0) >= ANTHROPIC_MODERN_MAX_OUTPUT_TOKENS)) patch.maxTokens = ANTHROPIC_MODERN_MAX_OUTPUT_TOKENS;
	if (supportsAnthropicNativeMaxEffort(contractModelId)) {
		const current = model.thinkingLevelMap;
		const preview = isAnthropicMythosPreviewModel(contractModelId);
		const mandatory = requiresClaudeMandatoryAdaptiveThinking({ id: contractModelId });
		const remapsMinimal = mandatory || resolveClaudeSonnet55ModelIdentity({ id: contractModelId }) !== void 0 || resolveClaudeHaiku55ModelIdentity({ id: contractModelId }) !== void 0;
		if (current?.max === void 0 || !preview && (current?.xhigh === void 0 || remapsMinimal && current?.minimal === void 0)) patch.thinkingLevelMap = {
			...preview ? { max: "max" } : {
				...remapsMinimal ? { minimal: "low" } : {},
				xhigh: mandatory || supportsClaudeNativeXhighEffort({ id: contractModelId }) ? "xhigh" : null,
				max: "max"
			},
			...current
		};
	}
	const fixedContextWindow = resolveAnthropicFixedContextWindow(ctx.provider, contractModelId);
	if (fixedContextWindow !== void 0 && !hasConfiguredModelOverride(ctx.config, ctx.provider, ctx.modelId, "context")) {
		const contextWindow = exactContextWindow ? fixedContextWindow : Math.max(model.contextWindow ?? 0, fixedContextWindow);
		const contextTokens = exactContextWindow ? fixedContextWindow : typeof model.contextTokens === "number" ? Math.max(model.contextTokens, fixedContextWindow) : fixedContextWindow;
		if (contextWindow !== model.contextWindow || contextTokens !== model.contextTokens) {
			patch.contextWindow = contextWindow;
			patch.contextTokens = contextTokens;
		}
	}
	const cost = resolveAnthropicModelCost(contractModelId);
	if (provider === PROVIDER_ID && !hasConfiguredModelOverride(ctx.config, ctx.provider, ctx.modelId, "cost") && cost && !modelCostsEqual(model.cost, cost)) patch.cost = cost;
	return Object.keys(patch).length > 0 ? {
		...model,
		...patch
	} : void 0;
}
function buildAnthropicProvider() {
	const providerId = "anthropic";
	const defaultAnthropicModel = CLAUDE_CLI_CANONICAL_DEFAULT_MODEL_REF;
	const { cli, setupToken, apiKey: apiKeyMethod } = createAnthropicAuthMethods();
	const apiKeyAuth = createProviderApiKeyAuthMethod({
		providerId,
		methodId: apiKeyMethod.id,
		label: apiKeyMethod.label,
		hint: apiKeyMethod.hint,
		optionKey: "anthropicApiKey",
		flagName: "--anthropic-api-key",
		envVar: "ANTHROPIC_API_KEY",
		promptMessage: "Enter Anthropic API key",
		defaultModel: defaultAnthropicModel,
		expectedProviders: ["anthropic"],
		wizard: apiKeyMethod.wizard
	});
	return {
		...createAnthropicProvider(),
		deprecatedProfileIds: [CLAUDE_CLI_PROFILE_ID],
		oauthProfileIdRepairs: [{
			legacyProfileId: "anthropic:default",
			promptLabel: "Anthropic"
		}],
		auth: [
			{
				...cli,
				wizard: {
					...cli.wizard,
					assistantPriority: -20,
					modelAllowlist: {
						allowedKeys: [CLAUDE_CLI_CANONICAL_DEFAULT_MODEL_REF],
						initialSelections: [CLAUDE_CLI_CANONICAL_DEFAULT_MODEL_REF],
						message: "Claude CLI models"
					}
				},
				run: async (ctx) => (await loadAuthRuntime()).runAnthropicCliMigration(ctx),
				runNonInteractive: async (ctx) => (await loadAuthRuntime()).runAnthropicCliMigrationNonInteractive({
					config: ctx.config,
					runtime: ctx.runtime,
					agentDir: ctx.agentDir
				})
			},
			{
				...setupToken,
				wizard: {
					...setupToken.wizard,
					assistantPriority: 40
				},
				run: async (ctx) => (await loadAuthRuntime()).runAnthropicSetupTokenAuth(ctx, defaultAnthropicModel),
				validateNonInteractive: async (ctx) => Boolean((await loadAuthRuntime()).validateAnthropicSetupTokenNonInteractive(ctx)),
				runNonInteractive: async (ctx) => (await loadAuthRuntime()).runAnthropicSetupTokenNonInteractive(ctx, defaultAnthropicModel)
			},
			{
				...apiKeyAuth,
				run: async (ctx) => (await loadAuthRuntime()).runAnthropicApiKeyAuth(ctx, apiKeyAuth.run)
			}
		],
		catalog: {
			order: "simple",
			run: async (ctx) => {
				const [{ projectAnthropicLiveModels }, { isAnthropicOAuthApiKey }] = await Promise.all([import("./extensions/anthropic/live-model-projection.js"), import("./plugin-sdk/provider-stream-shared.js")]);
				const buildAuthHeaders = (key) => !key ? {} : isAnthropicOAuthApiKey(key) ? { authorization: `Bearer ${key}` } : { "x-api-key": key };
				const result = restoreUnpublishedAnthropicModels(await buildOpenAICompatibleProviderCatalog({
					discoveryMode: "strict",
					ctx,
					providerId,
					buildProvider: buildAnthropicCatalogProvider,
					modelDiscovery: {
						endpointPath: "v1/models",
						buildRequestHeaders: ({ apiKey, discoveryApiKey }) => ({
							"anthropic-version": "2023-06-01",
							...buildAuthHeaders(discoveryApiKey ?? apiKey)
						}),
						projectRows: projectAnthropicLiveModels
					}
				}));
				return result && "provider" in result ? {
					providers: { [providerId]: result.provider },
					...result.outcomes ? { outcomes: result.outcomes } : {}
				} : result;
			}
		},
		staticCatalog: {
			order: "simple",
			run: async () => ({ providers: { [providerId]: buildAnthropicCatalogProvider() } })
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
		normalizeResolvedModel: normalizeAnthropicResolvedModel,
		prepareSyntheticAuth: anthropicProviderDiscovery.prepareSyntheticAuth,
		...buildProviderReplayFamilyHooks({ family: "native-anthropic-by-model" }),
		isModernModelRef: ({ provider, modelId }) => matchesAnthropicModernModel(modelId) && (!isAnthropicMandatoryClaude5Model(modelId) || normalizeLowercaseStringOrEmpty(provider) === PROVIDER_ID),
		resolveReasoningOutputMode: () => "native",
		classifyFailoverReason: ({ code, errorType }) => classifyAnthropicFailoverDescriptor(errorType) ?? classifyAnthropicFailoverDescriptor(code),
		resolveThinkingProfile,
		wrapStreamFn: (ctx) => {
			const loadStream = createLazyRuntimeSurface(loadStreamRuntime, (runtime) => runtime.wrapAnthropicProviderStream(ctx));
			return async (...args) => (await loadStream())(...args);
		},
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
function registerAnthropicPlugin(api) {
	const version = createClaudeCodeVersionProbe(api);
	api.registerCliBackend(buildAnthropicCliBackend(version));
	api.registerProvider({
		...buildAnthropicProvider(),
		wrapStreamFn: (ctx) => {
			const loadStream = createLazyRuntimeSurface(loadStreamRuntime, (runtime) => runtime.createAnthropicClaudeCodeIdentityWrapper(runtime.wrapAnthropicProviderStream(ctx), version.resolveVersion));
			return async (...args) => (await loadStream())(...args);
		},
		wrapSimpleCompletionStreamFn: (ctx) => {
			const loadStream = createLazyRuntimeSurface(loadStreamRuntime, (runtime) => runtime.createAnthropicClaudeCodeIdentityWrapper(ctx.streamFn, version.resolveVersion, ctx.sourceApi));
			return async (...args) => (await loadStream())(...args);
		}
	});
	api.registerMediaUnderstandingProvider(anthropicMediaUnderstandingProvider);
	registerClaudeSessionDiscovery(api);
	for (const policy of createClaudeSessionNodeInvokePolicies()) api.registerNodeInvokePolicy(policy);
}
//#endregion
export { registerAnthropicPlugin as n, buildAnthropicProvider as t };
