import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { f as runPluginStreamConsumer } from "./plugin-instance-scope-BoTOTPL4.mjs";
import { _ as resolveDefaultAgentId, f as resolveAgentWorkspaceDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import { a as isCurrentPluginMetadataSnapshotRuntimeGeneration, i as getCurrentPluginMetadataSnapshot } from "./current-plugin-metadata-snapshot-BK2DY7Lo.mjs";
import { u as resolvePluginMetadataSnapshot } from "./plugin-metadata-snapshot-DET-4y9k.mjs";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-DBJvdk-L.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { n as modelTransportRoutesMatch } from "./model-compat-catalog-VI3Psdyr.mjs";
import { n as projectConfigOntoRuntimeSourceSnapshot } from "./runtime-source-projection-DAkjzBhe.mjs";
import { r as normalizeResolvedPricing } from "./usage-cost-Va5dwVFW.mjs";
import "./src-D3H6pm7W.mjs";
import "./config-B3oiWDlr.mjs";
import { o as normalizeProviderMapKeys, r as mergeProviderModels, t as buildSourceModelFields } from "./models-config.merge-C-G9Ur64.mjs";
import { p as resolveManagedSecretRefRuntimeProviderAuth } from "./loader-runtime-load-DzFljQbT.mjs";
import { a as hasUsableCustomProviderApiKey } from "./model-auth-provider-config-C_EL9CxV.mjs";
import { t as getAgentDir } from "./config-BWKdpC6X.mjs";
import { t as loadPersistedPluginModelCatalogs } from "./plugin-model-catalog-execution-D64dZ7z1.mjs";
import { a as getAuthStorageOAuthProviderRegistry, i as resolveHeadersOrThrow, n as resolveConfigValueOrThrow, r as resolveConfigValueUncached } from "./auth-storage-DHC97REI.mjs";
import { a as sanitizeModelHeaders } from "./model.inline-provider-DwjZUIZW.mjs";
import { t as parseModelCatalogJson } from "./model-catalog-json-CxUsDrkg.mjs";
import { t as materializeConfiguredProviderCatalogModels } from "./models-config.providers.catalog-CUFun5bM.mjs";
import { n as isGeneratedPluginModelCatalog } from "./plugin-model-catalog-repair-gbFum2dR.mjs";
import { a as loadPersistedPluginModelCatalogsReadOnly, i as inspectLegacyPluginModelCatalogs, r as filterGeneratedPluginModelCatalogProviders } from "./plugin-model-catalog-BSKD3sUS.mjs";
import { r as bindStreamLlmRuntime } from "./model-runtime-binding-DgnrsJj9.mjs";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { Type } from "typebox";
import { Pointer } from "typebox/schema";
import { Compile as Compile$1 } from "typebox/compile";
import { createApiRegistry, createLlmRuntime } from "@openclaw/ai";
import { registerBuiltInApiProviders } from "@openclaw/ai/providers";
//#region src/agents/model-discovery-context.ts
/**
* Shared context resolvers for model discovery.
* Keeps callers from reaching into runtime config or plugin metadata snapshot
* plumbing directly.
*/
function resolveModelWorkspaceDir(cfg, explicitWorkspaceDir, agentId) {
	if (explicitWorkspaceDir !== void 0 || !cfg) return explicitWorkspaceDir;
	return resolveAgentWorkspaceDir(cfg, agentId ?? resolveDefaultAgentId(cfg));
}
/**
* Explicit snapshots win for tests and prepared runtimes. Otherwise we prefer
* the current process snapshot, then fall back to resolving from config/env.
*/
function resolveModelPluginMetadataSnapshot(params) {
	if (params.pluginMetadataSnapshot) return params.pluginMetadataSnapshot;
	const env = process.env;
	try {
		if (!params.config) {
			const current = getCurrentPluginMetadataSnapshot({
				allowWorkspaceScopedSnapshot: true,
				allowSynchronousPolicyRead: false,
				env,
				...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
			});
			if (current && isCurrentPluginMetadataSnapshotRuntimeGeneration(current)) return current;
		}
		const config = params.config ?? readRuntimeConfig();
		return getCurrentPluginMetadataSnapshot({
			allowWorkspaceScopedSnapshot: true,
			env,
			config,
			...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {}
		}) ?? resolvePluginMetadataSnapshot({
			config,
			env,
			...params.workspaceDir ? { workspaceDir: params.workspaceDir } : {},
			...params.allowWorkspaceScopedCurrent !== void 0 ? { allowWorkspaceScopedCurrent: params.allowWorkspaceScopedCurrent } : {}
		});
	} catch {
		return;
	}
}
//#endregion
//#region src/agents/sessions/model-registry-runtime.ts
const modelRegistryRuntimes = /* @__PURE__ */ new WeakMap();
function resetApiRegistry(runtime) {
	runtime.apiRegistry.clearApiProviders();
	registerBuiltInApiProviders(runtime.apiRegistry);
}
/** Creates the runtime facts owned by one model-registry lifecycle. */
function initializeModelRegistryRuntime(owner) {
	const apiRegistry = createApiRegistry();
	const llmRuntime = {
		...createLlmRuntime(apiRegistry),
		runStream: runPluginStreamConsumer
	};
	const runtime = {
		apiRegistry,
		llmRuntime
	};
	bindStreamLlmRuntime(llmRuntime.streamSimple, llmRuntime);
	resetApiRegistry(runtime);
	modelRegistryRuntimes.set(owner, runtime);
}
/** Returns the prepared runtime facts for one model-registry lifecycle. */
function getModelRegistryRuntime(owner) {
	const runtime = modelRegistryRuntimes.get(owner);
	if (!runtime) throw new Error("Model registry runtime is not initialized");
	return runtime;
}
function resetModelRegistryRuntime(owner) {
	resetApiRegistry(getModelRegistryRuntime(owner));
}
//#endregion
//#region src/agents/sessions/model-registry-schema.ts
/** Validation for authored and generated model registry catalogs. */
const PercentileCutoffsSchema = Type.Object({
	p50: Type.Optional(Type.Number()),
	p75: Type.Optional(Type.Number()),
	p90: Type.Optional(Type.Number()),
	p99: Type.Optional(Type.Number())
});
const OpenRouterRoutingSchema = Type.Object({
	allow_fallbacks: Type.Optional(Type.Boolean()),
	require_parameters: Type.Optional(Type.Boolean()),
	data_collection: Type.Optional(Type.Union([Type.Literal("deny"), Type.Literal("allow")])),
	zdr: Type.Optional(Type.Boolean()),
	enforce_distillable_text: Type.Optional(Type.Boolean()),
	order: Type.Optional(Type.Array(Type.String())),
	only: Type.Optional(Type.Array(Type.String())),
	ignore: Type.Optional(Type.Array(Type.String())),
	quantizations: Type.Optional(Type.Array(Type.String())),
	sort: Type.Optional(Type.Union([Type.String(), Type.Object({
		by: Type.Optional(Type.String()),
		partition: Type.Optional(Type.Union([Type.String(), Type.Null()]))
	})])),
	max_price: Type.Optional(Type.Object({
		prompt: Type.Optional(Type.Union([Type.Number(), Type.String()])),
		completion: Type.Optional(Type.Union([Type.Number(), Type.String()])),
		image: Type.Optional(Type.Union([Type.Number(), Type.String()])),
		audio: Type.Optional(Type.Union([Type.Number(), Type.String()])),
		request: Type.Optional(Type.Union([Type.Number(), Type.String()]))
	})),
	preferred_min_throughput: Type.Optional(Type.Union([Type.Number(), PercentileCutoffsSchema])),
	preferred_max_latency: Type.Optional(Type.Union([Type.Number(), PercentileCutoffsSchema]))
});
const VercelGatewayRoutingSchema = Type.Object({
	only: Type.Optional(Type.Array(Type.String())),
	order: Type.Optional(Type.Array(Type.String()))
});
const ThinkingLevelMapValueSchema = Type.Union([Type.String(), Type.Null()]);
const ThinkingLevelMapSchema = Type.Object({
	off: Type.Optional(ThinkingLevelMapValueSchema),
	minimal: Type.Optional(ThinkingLevelMapValueSchema),
	low: Type.Optional(ThinkingLevelMapValueSchema),
	medium: Type.Optional(ThinkingLevelMapValueSchema),
	high: Type.Optional(ThinkingLevelMapValueSchema),
	xhigh: Type.Optional(ThinkingLevelMapValueSchema),
	max: Type.Optional(ThinkingLevelMapValueSchema)
});
const OpenAICompletionsCompatSchema = Type.Object({
	supportsStore: Type.Optional(Type.Boolean()),
	supportsDeveloperRole: Type.Optional(Type.Boolean()),
	supportsReasoningEffort: Type.Optional(Type.Boolean()),
	supportsUsageInStreaming: Type.Optional(Type.Boolean()),
	maxTokensField: Type.Optional(Type.Union([Type.Literal("max_completion_tokens"), Type.Literal("max_tokens")])),
	requiresToolResultName: Type.Optional(Type.Boolean()),
	requiresAssistantAfterToolResult: Type.Optional(Type.Boolean()),
	requiresThinkingAsText: Type.Optional(Type.Boolean()),
	requiresReasoningContentOnAssistantMessages: Type.Optional(Type.Boolean()),
	thinkingFormat: Type.Optional(Type.Union([
		Type.Literal("openai"),
		Type.Literal("openrouter"),
		Type.Literal("together"),
		Type.Literal("deepseek"),
		Type.Literal("zai"),
		Type.Literal("qwen"),
		Type.Literal("qwen-chat-template")
	])),
	cacheControlFormat: Type.Optional(Type.Literal("anthropic")),
	openRouterRouting: Type.Optional(OpenRouterRoutingSchema),
	vercelGatewayRouting: Type.Optional(VercelGatewayRoutingSchema),
	supportsStrictMode: Type.Optional(Type.Boolean()),
	supportsJsonSchemaResponseFormat: Type.Optional(Type.Boolean()),
	supportsLongCacheRetention: Type.Optional(Type.Boolean())
});
const OpenAIResponsesCompatSchema = Type.Object({
	supportsTemperature: Type.Optional(Type.Boolean()),
	supportsInstructions: Type.Optional(Type.Boolean()),
	sendSessionIdHeader: Type.Optional(Type.Boolean()),
	supportsLongCacheRetention: Type.Optional(Type.Boolean())
});
const AnthropicMessagesCompatSchema = Type.Object({
	supportsEagerToolInputStreaming: Type.Optional(Type.Boolean()),
	supportsLongCacheRetention: Type.Optional(Type.Boolean())
});
const ProviderCompatSchema = Type.Union([
	OpenAICompletionsCompatSchema,
	OpenAIResponsesCompatSchema,
	AnthropicMessagesCompatSchema
]);
const ProviderAuthModeSchema = Type.Union([
	Type.Literal("api-key"),
	Type.Literal("aws-sdk"),
	Type.Literal("oauth"),
	Type.Literal("token")
]);
const ModelDefinitionSchema = Type.Object({
	id: Type.String({ minLength: 1 }),
	name: Type.Optional(Type.String({ minLength: 1 })),
	api: Type.Optional(Type.String({ minLength: 1 })),
	baseUrl: Type.Optional(Type.String({ minLength: 1 })),
	reasoning: Type.Optional(Type.Boolean()),
	thinkingLevelMap: Type.Optional(ThinkingLevelMapSchema),
	input: Type.Optional(Type.Array(Type.Union([
		Type.Literal("text"),
		Type.Literal("image"),
		Type.Literal("audio"),
		Type.Literal("video")
	]))),
	cost: Type.Optional(Type.Object({
		input: Type.Number(),
		output: Type.Number(),
		cacheRead: Type.Number(),
		cacheWrite: Type.Number()
	})),
	contextWindow: Type.Optional(Type.Number()),
	contextTokens: Type.Optional(Type.Number()),
	maxTokens: Type.Optional(Type.Number()),
	params: Type.Optional(Type.Record(Type.String(), Type.Unknown())),
	headers: Type.Optional(Type.Record(Type.String(), Type.String())),
	compat: Type.Optional(ProviderCompatSchema)
});
const ProviderConfigSchema = Type.Object({
	name: Type.Optional(Type.String({ minLength: 1 })),
	baseUrl: Type.Optional(Type.String({ minLength: 1 })),
	apiKey: Type.Optional(Type.String({ minLength: 1 })),
	auth: Type.Optional(ProviderAuthModeSchema),
	api: Type.Optional(Type.String({ minLength: 1 })),
	headers: Type.Optional(Type.Record(Type.String(), Type.String())),
	compat: Type.Optional(ProviderCompatSchema),
	authHeader: Type.Optional(Type.Boolean()),
	models: Type.Optional(Type.Array(ModelDefinitionSchema))
});
const ModelsConfigSchema = Type.Object({
	generatedBy: Type.Optional(Type.String()),
	providers: Type.Record(Type.String(), ProviderConfigSchema)
});
const validateModelsConfig = Compile$1(ModelsConfigSchema);
/** Omit malformed pricing, retaining the rows for semantic validation before exclusion. */
function omitInvalidModelCosts(value) {
	const paths = /* @__PURE__ */ new Set();
	for (const error of validateModelsConfig.Errors(value)) {
		const match = /^(\/providers\/[^/]+\/models\/\d+)\/cost(?:\/|$)/.exec(error.instancePath);
		if (!match?.[1]) return /* @__PURE__ */ new Set();
		paths.add(match[1]);
	}
	const models = /* @__PURE__ */ new Set();
	for (const modelPath of paths) {
		models.add(Pointer.Get(value, modelPath));
		Pointer.Delete(value, `${modelPath}/cost`);
	}
	return models;
}
function formatValidationPath(error) {
	const path = Pointer.Indices(error.instancePath).join(".").replace(/\//g, ".");
	if (error.keyword === "required") {
		const requiredProperty = error.params.requiredProperties[0];
		if (requiredProperty) return path ? `${path}.${requiredProperty}` : requiredProperty;
	}
	return path || "root";
}
//#endregion
//#region src/agents/sessions/model-registry-sources.ts
function captureProviderSource(...[provider, source]) {
	return {
		...source === "authored" ? provider : {
			api: provider.api,
			baseUrl: provider.baseUrl,
			compat: provider.compat
		},
		models: provider.models?.map((model) => {
			const { headers: _headers, ...inventory } = model;
			const maxTokensSource = source === "composed" ? model.maxTokensSource : source === "static" ? "discovered" : "configured";
			return Object.assign(source === "authored" ? model : inventory, {
				api: model.api ?? provider.api,
				baseUrl: model.baseUrl ?? provider.baseUrl,
				maxTokensSource,
				compat: source === "composed" ? model.compat : mergeCompat(provider.compat, model.compat)
			});
		})
	};
}
function cloneMapValues(source) {
	return new Map([...source].map(([key, value]) => [key, { ...value }]));
}
function mergeCompat(baseCompat, overrideCompat) {
	if (!overrideCompat) return baseCompat;
	const merged = {
		...baseCompat,
		...overrideCompat
	};
	for (const routing of ["openRouterRouting", "vercelGatewayRouting"]) if (baseCompat?.[routing] || overrideCompat[routing]) merged[routing] = {
		...baseCompat?.[routing],
		...overrideCompat[routing]
	};
	return merged;
}
async function readModelRegistryPluginCatalogs(modelsJsonPath, options) {
	if (options.config?.models?.mode === "replace" || options.modelsJsonContents === null || options.modelsJsonContents === void 0 && !existsSync(modelsJsonPath)) return { catalogs: [] };
	try {
		return { catalogs: await loadPersistedPluginModelCatalogs(dirname(modelsJsonPath)) };
	} catch (error) {
		return {
			catalogs: [],
			error: `Failed to load generated plugin model catalogs: ${error instanceof Error ? error.message : String(error)}`
		};
	}
}
function emptyCustomModelsResult(error) {
	return {
		providers: {},
		error
	};
}
//#endregion
//#region src/agents/sessions/provider-display-names.ts
/**
* Built-in provider labels shown in session/model UI when plugin metadata does
* not supply a display name.
*/
const BUILT_IN_PROVIDER_DISPLAY_NAMES = {
	anthropic: "Anthropic",
	"amazon-bedrock": "Amazon Bedrock",
	"azure-openai-responses": "Azure OpenAI Responses",
	cerebras: "Cerebras",
	"cloudflare-ai-gateway": "Cloudflare AI Gateway",
	"cloudflare-workers-ai": "Cloudflare Workers AI",
	deepseek: "DeepSeek",
	fireworks: "Fireworks",
	google: "Google Gemini",
	"google-vertex": "Google Vertex AI",
	groq: "Groq",
	huggingface: "Hugging Face",
	"kimi-coding": "Kimi For Coding",
	meta: "Meta",
	mistral: "Mistral",
	minimax: "MiniMax",
	"minimax-cn": "MiniMax (China)",
	moonshotai: "Moonshot AI",
	"moonshotai-cn": "Moonshot AI (China)",
	opencode: "OpenCode Zen",
	"opencode-go": "OpenCode Go",
	openai: "OpenAI",
	openrouter: "OpenRouter",
	together: "Together AI",
	"vercel-ai-gateway": "Vercel AI Gateway",
	xai: "xAI",
	zai: "ZAI",
	xiaomi: "Xiaomi MiMo",
	"xiaomi-token-plan-cn": "Xiaomi MiMo Token Plan (China)",
	"xiaomi-token-plan-ams": "Xiaomi MiMo Token Plan (Amsterdam)",
	"xiaomi-token-plan-sgp": "Xiaomi MiMo Token Plan (Singapore)"
};
//#endregion
//#region src/agents/sessions/model-registry.ts
const log = createSubsystemLogger("agents/model-registry");
var ModelRegistry = class ModelRegistry {
	constructor(authStorage, modelsJsonPath, options = {}, publishedModels, preparedCatalogs) {
		this.models = [];
		this.providerRequestConfigs = /* @__PURE__ */ new Map();
		this.modelRequestHeaders = /* @__PURE__ */ new Map();
		this.registeredProviders = /* @__PURE__ */ new Map();
		this.loadError = void 0;
		this.includePluginCatalogs = true;
		this.authStorage = authStorage;
		this.config = options.config ?? options.sourceSnapshot?.config;
		this.includePluginCatalogs = options.includePluginCatalogs !== false;
		this.reloadPluginCatalogs = this.includePluginCatalogs && options.pluginCatalogs === void 0;
		initializeModelRegistryRuntime(this);
		if (options.sourceSnapshot) {
			const source = options.sourceSnapshot;
			const captured = source.baseCatalogSnapshot ?? source.captureCatalogSnapshot();
			const sourceSnapshot = publishedModels ? {
				...captured,
				models: [...captured.models.filter((model) => !publishedModels.has(model.provider)), ...[...publishedModels.values()].flat()]
			} : captured;
			this.sourceSnapshot = sourceSnapshot;
			this.baseCatalogSnapshot = sourceSnapshot;
			this.restoreSourceCatalog(sourceSnapshot);
			this.registeredProviders = cloneMapValues(source.registeredProviders);
			getAuthStorageOAuthProviderRegistry(authStorage).reset();
			for (const oauthProvider of sourceSnapshot.oauthProviders) getAuthStorageOAuthProviderRegistry(authStorage).register(oauthProvider);
			for (const [providerName, config] of this.registeredProviders.entries()) this.applyProviderConfig(providerName, config);
			return;
		}
		this.modelsJsonPath = modelsJsonPath;
		this.modelsJsonContents = options.modelsJsonContents;
		this.pluginCatalogs = preparedCatalogs?.catalogs ?? options.pluginCatalogs;
		this.pluginCatalogReadError = preparedCatalogs?.error;
		this.staticProviderConfigs = options.staticProviderConfigs;
		this.pluginMetadataSnapshot = resolveModelPluginMetadataSnapshot({
			config: this.config,
			...options.pluginMetadataSnapshot ? { pluginMetadataSnapshot: options.pluginMetadataSnapshot } : {},
			...options.workspaceDir ? { workspaceDir: options.workspaceDir } : {},
			allowWorkspaceScopedCurrent: true
		});
		this.loadModels();
		this.baseCatalogSnapshot = this.captureCatalogSnapshot();
	}
	captureCatalogSnapshot() {
		return {
			models: structuredClone(this.models),
			providerRequestConfigs: cloneMapValues(this.providerRequestConfigs),
			modelRequestHeaders: cloneMapValues(this.modelRequestHeaders),
			loadError: this.loadError,
			pluginMetadataSnapshot: this.pluginMetadataSnapshot,
			oauthProviders: [...this.authStorage.getOAuthProviders()]
		};
	}
	restoreSourceCatalog(source) {
		this.models = structuredClone(source.models);
		this.providerRequestConfigs = cloneMapValues(source.providerRequestConfigs);
		this.modelRequestHeaders = cloneMapValues(source.modelRequestHeaders);
		this.loadError = source.loadError;
		this.pluginMetadataSnapshot = source.pluginMetadataSnapshot;
	}
	/** @deprecated Use createAsync or fromCapturedSources. Supported through 2026-12-31. */
	static create(authStorage, modelsJsonPath = join(getAgentDir(), "models.json"), options = {}) {
		if (options.pluginCatalogs === void 0 && options.includePluginCatalogs !== false) ModelRegistry.warnNativeCatalogRead("ModelRegistry.create", "ModelRegistry.createAsync");
		return new ModelRegistry(authStorage, modelsJsonPath, options);
	}
	/** Read persisted plugin catalogs through their worker before publishing the registry. */
	static async createAsync(authStorage, modelsJsonPath = join(getAgentDir(), "models.json"), options = {}) {
		const prepared = options.pluginCatalogs === void 0 && options.includePluginCatalogs !== false ? await readModelRegistryPluginCatalogs(modelsJsonPath, options) : void 0;
		return new ModelRegistry(authStorage, modelsJsonPath, options, void 0, prepared);
	}
	/** Parse owner-prepared catalogs without opening their persistence store. */
	static fromCapturedSources(authStorage, modelsJsonPath, options) {
		return new ModelRegistry(authStorage, modelsJsonPath, options);
	}
	static warnNativeCatalogRead(method, replacement) {
		warnPluginSdkDeprecation({
			family: "model-registry-native-read",
			method,
			replacement
		});
	}
	static inMemory(authStorage) {
		return new ModelRegistry(authStorage, void 0);
	}
	/** Creates a request-isolated registry from this lifecycle-owned catalog snapshot. */
	fork(authStorage, publishedModels) {
		return new ModelRegistry(authStorage, void 0, { sourceSnapshot: this }, publishedModels);
	}
	/** @deprecated Await refreshAsync for disk-backed catalogs. Supported through 2026-12-31. */
	refresh() {
		if (this.reloadPluginCatalogs && this.modelsJsonPath) {
			ModelRegistry.warnNativeCatalogRead("ModelRegistry.refresh", "ModelRegistry.refreshAsync");
			this.pluginCatalogs = void 0;
			this.pluginCatalogReadError = void 0;
		}
		this.reload();
	}
	async refreshAsync() {
		if (this.reloadPluginCatalogs && this.modelsJsonPath) {
			const prepared = await readModelRegistryPluginCatalogs(this.modelsJsonPath, {
				config: this.config,
				modelsJsonContents: this.modelsJsonContents
			});
			this.pluginCatalogs = prepared.catalogs;
			this.pluginCatalogReadError = prepared.error;
		}
		this.reload();
	}
	reload() {
		this.providerRequestConfigs.clear();
		this.modelRequestHeaders.clear();
		this.loadError = void 0;
		resetModelRegistryRuntime(this);
		getAuthStorageOAuthProviderRegistry(this.authStorage).reset();
		if (this.sourceSnapshot) {
			this.restoreSourceCatalog(this.sourceSnapshot);
			for (const oauthProvider of this.sourceSnapshot.oauthProviders) getAuthStorageOAuthProviderRegistry(this.authStorage).register(oauthProvider);
		} else {
			this.loadModels();
			this.baseCatalogSnapshot = this.captureCatalogSnapshot();
		}
		for (const [providerName, config] of this.registeredProviders.entries()) this.applyProviderConfig(providerName, config);
	}
	/** Get any root or generated plugin catalog load error. */
	getError() {
		return this.loadError;
	}
	/** Returns the exact plugin metadata generation captured with this registry. */
	getProviderMetadataOwners() {
		return this.pluginMetadataSnapshot?.owners;
	}
	loadModels() {
		const replace = this.config?.models?.mode === "replace";
		const customResult = !replace && this.modelsJsonPath && this.modelsJsonContents !== null ? this.loadCustomModels(this.modelsJsonPath, {
			...this.modelsJsonContents !== void 0 ? { contents: this.modelsJsonContents } : {},
			includePluginCatalogs: this.includePluginCatalogs && this.pluginCatalogs === void 0
		}) : emptyCustomModelsResult();
		const capturedPluginResult = !replace && this.includePluginCatalogs && this.pluginCatalogs !== void 0 ? this.loadCapturedPluginCatalogs(this.pluginCatalogs) : emptyCustomModelsResult();
		const errors = [
			customResult.error,
			capturedPluginResult.error,
			this.pluginCatalogReadError
		].filter((error) => Boolean(error));
		if (!replace && this.modelsJsonPath && this.modelsJsonContents === void 0 && this.reloadPluginCatalogs && this.staticProviderConfigs === void 0 && this.includePluginCatalogs) {
			const inspected = inspectLegacyPluginModelCatalogs(dirname(this.modelsJsonPath));
			const diagnostics = [...inspected.warnings, ...inspected.catalogs.map(({ pathname }) => `Legacy generated provider catalog: ${pathname}`)];
			if (diagnostics.length > 0) errors.push(`${diagnostics.join("\n")}\nRun openclaw doctor --fix to verify and import legacy provider catalogs.`);
		}
		if (errors.length > 0) {
			this.loadError = errors.join("\n\n");
			log.warn(`model catalog load issue: ${this.loadError}`);
		}
		const providers = this.mergeProviderSources(replace ? {} : Object.fromEntries(Object.entries(this.staticProviderConfigs ?? {}).map(([provider, config]) => [provider, captureProviderSource(config, "static")])), capturedPluginResult.providers, customResult.providers);
		const sourceFields = buildSourceModelFields(materializeConfiguredProviderCatalogModels(this.config && projectConfigOntoRuntimeSourceSnapshot(this.config).models?.providers, { manifestPlugins: this.pluginMetadataSnapshot }));
		for (const [providerId, configured] of Object.entries(normalizeProviderMapKeys(materializeConfiguredProviderCatalogModels(this.config?.models?.providers, { manifestPlugins: this.pluginMetadataSnapshot })))) {
			const inherited = providers[providerId];
			const accepted = new Map(inherited?.models?.map((model) => [model.id, model]));
			const current = {
				api: configured.api,
				baseUrl: configured.baseUrl,
				models: configured.models?.map((model) => ({
					...model,
					api: model.api ?? accepted.get(model.id)?.api ?? configured.api,
					baseUrl: model.baseUrl ?? accepted.get(model.id)?.baseUrl ?? configured.baseUrl,
					maxTokensSource: "configured",
					headers: sanitizeModelHeaders(model.headers)
				}))
			};
			providers[providerId] = inherited ? mergeProviderModels(captureProviderSource(inherited, "composed"), current, {
				providerId,
				modelIdMatching: "exact",
				sourceModelFields: sourceFields
			}) : current;
			this.providerRequestConfigs.delete(providerId);
			this.storeProviderRequestConfig(providerId, {
				apiKey: normalizeOptionalSecretInput(configured.apiKey),
				auth: configured.auth,
				authHeader: configured.authHeader,
				headers: sanitizeModelHeaders(configured.headers)
			});
		}
		let combined = this.parseModels(providers);
		for (const oauthProvider of this.authStorage.getOAuthProviders()) {
			const cred = this.authStorage.get(oauthProvider.id);
			if (cred?.type === "oauth" && oauthProvider.modifyModels) combined = oauthProvider.modifyModels(combined, cred);
		}
		this.models = combined;
	}
	mergeProviderSources(...sources) {
		const providers = {};
		for (const source of sources) for (const [providerId, provider] of Object.entries(source)) {
			const existing = providers[providerId];
			providers[providerId] = existing ? mergeProviderModels(existing, provider, {
				providerId,
				modelIdMatching: "exact"
			}) : provider;
		}
		return providers;
	}
	loadCapturedPluginCatalogs(pluginCatalogs) {
		let providers = {};
		const errors = [];
		for (const pluginCatalog of pluginCatalogs) {
			const result = this.loadCustomModels(`sqlite:plugin-model-catalog/${pluginCatalog.pluginId}`, {
				catalogPluginId: pluginCatalog.pluginId,
				contents: pluginCatalog.contents,
				includePluginCatalogs: false,
				requireGeneratedCatalog: true
			});
			providers = this.mergeProviderSources(providers, result.providers);
			if (result.error) errors.push(result.error);
		}
		return {
			providers,
			error: errors.join("\n\n") || void 0
		};
	}
	loadCustomModels(modelsJsonPath, options = { includePluginCatalogs: true }) {
		if (options.contents === void 0 && !existsSync(modelsJsonPath)) return emptyCustomModelsResult();
		try {
			const content = options.contents ?? readFileSync(modelsJsonPath, "utf-8");
			const parsed = parseModelCatalogJson(content);
			if (options.requireGeneratedCatalog === true && !isGeneratedPluginModelCatalog(parsed)) return emptyCustomModelsResult();
			const valid = validateModelsConfig.Check(parsed);
			const invalidCosts = valid ? void 0 : omitInvalidModelCosts(parsed);
			if (!valid && !validateModelsConfig.Check(parsed)) return emptyCustomModelsResult(`Invalid models.json schema:\n${validateModelsConfig.Errors(parsed).map((error) => `  - ${formatValidationPath(error)}: ${error.message}`).join("\n") || "Unknown schema error"}\n\nFile: ${modelsJsonPath}`);
			const providers = options.requireGeneratedCatalog === true ? filterGeneratedPluginModelCatalogProviders({
				catalogPluginId: options.catalogPluginId,
				config: this.config,
				isProviderAvailable: (providerId) => this.authStorage.hasAuth(normalizeProviderId(providerId)) || hasUsableCustomProviderApiKey(this.config, providerId) || resolveManagedSecretRefRuntimeProviderAuth({
					cfg: this.config,
					provider: providerId
				}) !== void 0,
				parsedCatalog: parsed,
				pluginMetadataSnapshot: this.pluginMetadataSnapshot,
				providers: parsed.providers
			}) : parsed.providers;
			if (options.requireGeneratedCatalog === true && Object.keys(providers).length === 0) return emptyCustomModelsResult();
			const catalogWarnings = [];
			for (const [providerName, providerConfig] of Object.entries(providers)) {
				this.validateProviderModels(providerName, providerConfig, "catalog");
				if (invalidCosts?.size && providerConfig.models) providerConfig.models = providerConfig.models.filter((model) => {
					if (!invalidCosts.has(model)) return true;
					const source = options.requireGeneratedCatalog ? "the provider's catalog source" : modelsJsonPath;
					catalogWarnings.push(`Skipped model ${providerName}/${model.id}: invalid cost. Fix or remove its cost block in ${source}, then refresh the model catalog.`);
					return false;
				});
			}
			const generated = options.requireGeneratedCatalog === true;
			let sourceProviders = {};
			for (const [providerName, providerConfig] of Object.entries(providers)) {
				if (!generated && (providerConfig.models ?? []).length > 0) this.storeProviderRequestConfig(providerName, providerConfig);
				sourceProviders[providerName] = generated ? captureProviderSource(providerConfig, "static") : captureProviderSource(providerConfig, "authored");
			}
			const pluginCatalogErrors = catalogWarnings.map((warning) => `${warning}\nFile: ${modelsJsonPath}`);
			if (options.includePluginCatalogs !== false) {
				let pluginCatalogs = [];
				try {
					pluginCatalogs = loadPersistedPluginModelCatalogsReadOnly(dirname(modelsJsonPath));
				} catch (error) {
					pluginCatalogErrors.push(`Failed to load generated plugin model catalogs: ${error instanceof Error ? error.message : String(error)}`);
				}
				const pluginResult = this.loadCapturedPluginCatalogs(pluginCatalogs);
				sourceProviders = this.mergeProviderSources(pluginResult.providers, sourceProviders);
				if (pluginResult.error) pluginCatalogErrors.push(`${pluginResult.error}\nRun openclaw doctor --fix to repair persisted generated provider catalogs.`);
			}
			return {
				providers: sourceProviders,
				error: pluginCatalogErrors.join("\n\n") || void 0
			};
		} catch (error) {
			if (error instanceof SyntaxError) {
				if (options.requireGeneratedCatalog === true) return emptyCustomModelsResult();
				return emptyCustomModelsResult(`Failed to parse models.json: ${error.message}\n\nFile: ${modelsJsonPath}`);
			}
			return emptyCustomModelsResult(`Failed to load models.json: ${error instanceof Error ? error.message : String(error)}\n\nFile: ${modelsJsonPath}`);
		}
	}
	validateProviderModels(providerName, config, source) {
		const models = config.models ?? [];
		if (models.length > 0 && !config.baseUrl) throw new Error(`Provider ${providerName}: "baseUrl" is required when defining ${source === "catalog" ? "custom models" : "models"}.`);
		for (const model of models) {
			if (!model.api && !config.api) {
				const guidance = source === "catalog" ? " Set at provider or model level." : "";
				throw new Error(`Provider ${providerName}, model ${model.id}: no "api" specified.${guidance}`);
			}
			if (source === "catalog") {
				for (const field of ["contextWindow", "maxTokens"]) if (model[field] !== void 0 && model[field] <= 0) throw new Error(`Provider ${providerName}, model ${model.id}: invalid ${field}`);
			}
		}
	}
	parseModels(providers) {
		const models = [];
		for (const [providerName, providerConfig] of Object.entries(providers)) for (const modelDef of providerConfig.models ?? []) {
			const api = modelDef.api ?? providerConfig.api;
			if (!api) continue;
			const baseUrl = modelDef.baseUrl ?? providerConfig.baseUrl;
			if (!baseUrl) continue;
			const runtimeInput = (modelDef.input ?? ["text"]).filter((input) => input === "text" || input === "image");
			if ((modelDef.input?.length ?? 0) > 0 && runtimeInput.length === 0) continue;
			this.storeModelHeaders(providerName, modelDef.id, modelDef.headers);
			models.push(this.createRuntimeModel(providerName, providerConfig, modelDef, api, {
				baseUrl,
				input: runtimeInput
			}));
		}
		return models;
	}
	createRuntimeModel(provider, config, model, api, catalog) {
		return {
			id: model.id,
			name: catalog ? model.name ?? model.id : model.name,
			api,
			provider,
			baseUrl: catalog ? catalog.baseUrl : model.baseUrl ?? config.baseUrl,
			reasoning: catalog ? model.reasoning ?? false : model.reasoning,
			thinkingLevelMap: model.thinkingLevelMap,
			input: catalog ? catalog.input : model.input,
			cost: catalog ? normalizeResolvedPricing(model.cost ?? {}) : model.cost,
			contextWindow: model.contextWindow ?? Math.max(model.contextTokens ?? 0, 128e3),
			...model.contextWindow === void 0 ? { contextWindowSource: "synthetic" } : {},
			contextTokens: model.contextTokens,
			contextWindows: model.contextWindows,
			contextWindowDefault: model.contextWindowDefault,
			maxTokens: catalog ? model.maxTokens ?? 16384 : model.maxTokens,
			...catalog && model.maxTokens !== void 0 ? { maxTokensSource: model.maxTokensSource } : {},
			params: model.params,
			headers: void 0,
			compat: model.compat
		};
	}
	getAll() {
		return this.models;
	}
	/**
	* Get only models that have auth configured.
	* This is a fast check that doesn't refresh OAuth tokens.
	*/
	getAvailable() {
		return this.models.filter((m) => this.hasConfiguredAuth(m));
	}
	find(provider, modelId) {
		return this.models.find((m) => m.provider === provider && m.id === modelId);
	}
	hasConfiguredAuth(model) {
		const providerConfig = this.getModelProviderRequestConfig(model);
		return this.authStorage.hasAuth(model.provider) || providerConfig?.auth === "aws-sdk" || providerConfig?.apiKey !== void 0;
	}
	getModelProviderRequestConfig(model) {
		const config = this.providerRequestConfigs.get(model.provider);
		if (config?.baseUrls && !config.baseUrls.some((baseUrl) => modelTransportRoutesMatch({ baseUrl }, { baseUrl: model.baseUrl }))) return;
		return config;
	}
	getModelRequestKey(provider, modelId) {
		return JSON.stringify([provider, modelId]);
	}
	storeProviderRequestConfig(providerName, config) {
		if (!config.apiKey && !config.auth && !config.headers && !config.authHeader) return;
		this.providerRequestConfigs.set(providerName, {
			baseUrls: config.baseUrl ? [config.baseUrl, ...(config.models ?? []).flatMap((model) => model.baseUrl ?? [])] : void 0,
			apiKey: config.apiKey,
			auth: config.auth,
			headers: config.headers,
			authHeader: config.authHeader
		});
	}
	storeModelHeaders(providerName, modelId, headers) {
		const key = this.getModelRequestKey(providerName, modelId);
		if (!headers || Object.keys(headers).length === 0) {
			this.modelRequestHeaders.delete(key);
			return;
		}
		this.modelRequestHeaders.set(key, headers);
	}
	async getApiKeyAndHeaders(model) {
		try {
			const providerConfig = this.getModelProviderRequestConfig(model);
			const usesAwsSdkAuth = providerConfig?.auth === "aws-sdk";
			const apiKey = (usesAwsSdkAuth ? void 0 : await this.authStorage.getApiKey(model.provider, {
				includeFallback: false,
				baseUrl: model.baseUrl
			})) ?? (!usesAwsSdkAuth && providerConfig?.apiKey ? resolveConfigValueOrThrow(providerConfig.apiKey, `API key for provider "${model.provider}"`) : void 0);
			const providerHeaders = resolveHeadersOrThrow(providerConfig?.headers, `provider "${model.provider}"`);
			const modelHeaders = resolveHeadersOrThrow(this.modelRequestHeaders.get(this.getModelRequestKey(model.provider, model.id)), `model "${model.provider}/${model.id}"`);
			let headers = model.headers || providerHeaders || modelHeaders ? {
				...model.headers,
				...providerHeaders,
				...modelHeaders
			} : void 0;
			if (providerConfig?.authHeader) {
				if (!apiKey) return {
					ok: false,
					error: `No API key found for "${model.provider}"`
				};
				headers = {
					...headers,
					Authorization: `Bearer ${apiKey}`
				};
			}
			return {
				ok: true,
				apiKey,
				headers: headers && Object.keys(headers).length > 0 ? headers : void 0
			};
		} catch (error) {
			return {
				ok: false,
				error: error instanceof Error ? error.message : String(error)
			};
		}
	}
	/**
	* Return auth status for a provider, including request auth configured in models.json.
	* This intentionally does not execute command-backed config values.
	*/
	getProviderAuthStatus(provider) {
		const providerRequestConfig = this.providerRequestConfigs.get(provider);
		if (providerRequestConfig?.auth === "aws-sdk") return {
			configured: true,
			source: "models_json_key",
			label: providerRequestConfig.auth
		};
		const authStatus = this.authStorage.getAuthStatus(provider);
		if (authStatus.source) return authStatus;
		const providerApiKey = providerRequestConfig?.apiKey;
		if (!providerApiKey) return authStatus;
		if (providerApiKey.startsWith("!")) return {
			configured: true,
			source: "models_json_command"
		};
		if (process.env[providerApiKey]) return {
			configured: true,
			source: "environment",
			label: providerApiKey
		};
		return {
			configured: true,
			source: "models_json_key"
		};
	}
	getProviderDisplayName(provider) {
		const registeredProvider = this.registeredProviders.get(provider);
		const oauthProvider = this.authStorage.getOAuthProviders().find((p) => p.id === provider);
		return registeredProvider?.name ?? registeredProvider?.oauth?.name ?? oauthProvider?.name ?? BUILT_IN_PROVIDER_DISPLAY_NAMES[provider] ?? provider;
	}
	async getApiKeyForProvider(provider) {
		const apiKey = await this.authStorage.getApiKey(provider, { includeFallback: false });
		if (apiKey !== void 0) return apiKey;
		const providerApiKey = this.providerRequestConfigs.get(provider)?.apiKey;
		return providerApiKey ? resolveConfigValueUncached(providerApiKey) : void 0;
	}
	isUsingOAuth(model) {
		return this.authStorage.get(model.provider)?.type === "oauth";
	}
	/**
	* Register a provider dynamically (from extensions).
	*
	* If provider has models: replaces all existing models for this provider.
	* Provider-level request settings are stored for already-known models but
	* never create implicit model rows.
	* If provider has oauth: registers OAuth provider for /login support.
	*/
	registerProvider(providerName, config) {
		if (config.streamSimple && !config.api) throw new Error(`Provider ${providerName}: "api" is required when registering streamSimple.`);
		this.validateProviderModels(providerName, config, "registration");
		this.applyProviderConfig(providerName, config);
		const existing = this.registeredProviders.get(providerName);
		if (!existing) {
			this.registeredProviders.set(providerName, config);
			return;
		}
		for (const k of Object.keys(config)) if (config[k] !== void 0) existing[k] = config[k];
	}
	/**
	* Unregister a previously registered provider.
	*
	* Removes the provider from the registry and reloads models from disk.
	* Also resets dynamic OAuth and API stream registrations before reapplying
	* remaining dynamic providers.
	* Has no effect if the provider was never registered.
	* @deprecated Use unregisterProviderAsync for disk-backed registries. Supported through 2026-12-31.
	*/
	unregisterProvider(providerName) {
		if (!this.registeredProviders.has(providerName)) return;
		this.registeredProviders.delete(providerName);
		this.refresh();
	}
	async unregisterProviderAsync(providerName) {
		if (!this.registeredProviders.delete(providerName)) return;
		await this.refreshAsync();
	}
	applyProviderConfig(providerName, config) {
		if (config.oauth) {
			const oauthProvider = {
				...config.oauth,
				id: providerName
			};
			getAuthStorageOAuthProviderRegistry(this.authStorage).register(oauthProvider);
		}
		if (config.streamSimple) {
			const streamSimple = config.streamSimple;
			getModelRegistryRuntime(this).apiRegistry.registerApiProvider({
				api: config.api,
				stream: (model, context, options) => streamSimple(model, context, options),
				streamSimple
			}, `provider:${providerName}`);
		}
		this.storeProviderRequestConfig(providerName, config);
		if (config.models && config.models.length > 0) {
			this.models = this.models.filter((m) => m.provider !== providerName);
			for (const modelDef of config.models) {
				const api = modelDef.api || config.api;
				this.storeModelHeaders(providerName, modelDef.id, modelDef.headers);
				this.models.push(this.createRuntimeModel(providerName, config, modelDef, api));
			}
			if (config.oauth?.modifyModels) {
				const cred = this.authStorage.get(providerName);
				if (cred?.type === "oauth") this.models = config.oauth.modifyModels(this.models, cred);
			}
		}
	}
};
//#endregion
export { resolveModelWorkspaceDir as i, getModelRegistryRuntime as n, resolveModelPluginMetadataSnapshot as r, ModelRegistry as t };
