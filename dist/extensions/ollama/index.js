import { a as coerceSecretRef } from "../../types.secrets-Dgbd2kyP.mjs";
import { t as findNormalizedProviderKey } from "../../provider-id-D1VImdKk.mjs";
import { a as createLazyRuntimeSurface, r as createLazyRuntimeModule } from "../../lazy-runtime-CJrzFzqU.mjs";
import { N as collectConfiguredModelRefValues } from "../../runtime-snapshot-BBYDJbw9.mjs";
import { t as splitTrailingAuthProfile } from "../../model-ref-profile-BNjB2hED.mjs";
import { s as isNonSecretApiKeyMarker } from "../../model-auth-markers-Clx9vUna.mjs";
import { a as buildOpenAICompatibleReplayPolicy } from "../../provider-replay-helpers-B7QyB_ca.mjs";
import { t as definePluginEntry } from "../../plugin-entry-D4OPnFRH.mjs";
import "../../provider-model-shared-B_4afNJ5.mjs";
import "../../model-ref-parse-BdNlL-Mg.mjs";
import { r as resolvePluginConfigObject } from "../../plugin-config-runtime-Dm1sl1ov.mjs";
import "../../provider-auth-JCvgbsWg.mjs";
import { n as createProviderApiKeyAuthMethod } from "../../provider-api-key-auth-ZKXZrO2f.mjs";
import { h as runLiveProviderCatalog } from "../../provider-catalog-live-runtime-BILEsjga.mjs";
import "../../provider-entry-CKUq_-Jy.mjs";
import "../../provider-model-metadata-DkObn07R.mjs";
import { r as buildProviderToolCompatFamilyHooks } from "../../provider-tools-DynDHTtQ.mjs";
import { n as resolveConfiguredSecretInputString } from "../../secret-input-runtime-D_NUng8k.mjs";
import { _ as resolveOllamaSetupDefaultBaseUrl, a as OLLAMA_DEFAULT_API_KEY, f as isHostedOllamaCloud, i as OLLAMA_CLOUD_PROVIDER_ID, n as OLLAMA_CLOUD_BASE_URL, o as OLLAMA_DEFAULT_BASE_URL, r as OLLAMA_CLOUD_DEFAULT_MODELS, t as DEFAULT_OLLAMA_EMBEDDING_MODEL, u as OLLAMA_GLM52_CLOUD_MODEL_ID } from "../../defaults-CDpC0pZy.mjs";
import { t as readProviderBaseUrl } from "../../provider-base-url-CJ296Qbv.mjs";
import { i as resolveThinkingProfile, n as normalizeResolvedModel } from "../../provider-policy-api-TrGaY2-Z.mjs";
import { t as findAvailableOllamaModelName } from "../../model-id-C2JO-_3r.mjs";
import { _ as queryOllamaModelShowInfo, a as capLocalOllamaModelContext, d as isOllamaCloudModel, i as buildOllamaProvider, l as fetchLoadedOllamaModelNames, o as capLocalOllamaProviderContext, p as isOllamaRemoteModel, r as buildOllamaModelDefinition, t as buildDefaultOllamaCloudModelDefinition, u as fetchOllamaModels, x as toDynamicOllamaModel, y as resolveOllamaApiBase } from "../../provider-models-CAeiI0VX.mjs";
import { d as isLocalOllamaBaseUrl, f as isOllamaApiKeyMarker, g as shouldUseSyntheticOllamaAuth, h as resolveOllamaRuntimeBaseUrl, l as OLLAMA_PROVIDER_ID, m as resolveOllamaDiscoveryResult, p as readOllamaStringValue, s as orderPreferredOllamaModelIds, u as getUnlistedOllamaConfiguredModelIds } from "../../setup-model-selection-BOBztTbL.mjs";
import { c as OLLAMA_MODELS_COMMAND, d as OLLAMA_NODE_INFERENCE_DEFAULT_PLATFORMS, f as ollamaNodeInferenceToolDefinition, l as OLLAMA_NODE_INFERENCE_CAPABILITY, s as OLLAMA_CHAT_COMMAND, u as OLLAMA_NODE_INFERENCE_COMMANDS } from "../../node-inference-contract-BBr-6oLF.mjs";
import { r as resolveConfiguredOllamaProviderConfig, t as createConfiguredOllamaCompatStreamWrapper } from "../../stream-compat-D3t5jDw2.mjs";
import "../../stream-contract-CbZ8xqzG.mjs";
import { t as createLazyOllamaWebSearchProvider } from "../../web-search-provider-registration-CksgIYIK.mjs";
//#region extensions/ollama/src/cloud-auth.ts
function createOllamaCloudAuthMethod() {
	return createProviderApiKeyAuthMethod({
		providerId: OLLAMA_CLOUD_PROVIDER_ID,
		methodId: "api-key",
		label: "Ollama Cloud API key",
		hint: "Hosted models via ollama.com",
		optionKey: "ollamaCloudApiKey",
		flagName: "--ollama-cloud-api-key",
		envVar: "OLLAMA_API_KEY",
		promptMessage: "Enter Ollama Cloud API key",
		validateApiKey: (apiKey) => apiKey.trim() === "ollama-local" ? "Ollama Cloud requires a hosted API key from https://ollama.com/settings/keys; ollama-local is only for local Ollama hosts." : void 0,
		defaultModel: `${OLLAMA_CLOUD_PROVIDER_ID}/${OLLAMA_CLOUD_DEFAULT_MODELS[0].id}`,
		noteTitle: "Ollama Cloud",
		noteMessage: "Manage API keys at https://ollama.com/settings/keys",
		wizard: {
			choiceId: "ollama-cloud",
			choiceLabel: "Ollama Cloud",
			choiceHint: "Hosted models via ollama.com",
			groupId: "ollama",
			groupLabel: "Ollama",
			groupHint: "Cloud and local open models"
		}
	});
}
//#endregion
//#region extensions/ollama/src/media-understanding-provider.ts
const ollamaMediaUnderstandingProvider = {
	id: OLLAMA_PROVIDER_ID,
	capabilities: ["image"]
};
//#endregion
//#region extensions/ollama/src/node-inference-registration.ts
const loadOllamaNodeInference = createLazyRuntimeModule(() => import("../../node-inference-Cx83IJO1.mjs"));
function createLazyNodeHostCommand(command) {
	const loadRuntimeCommand = createLazyRuntimeSurface(loadOllamaNodeInference, (runtime) => {
		const runtimeCommand = runtime.createOllamaNodeHostCommands().find((candidate) => candidate.command === command);
		if (!runtimeCommand) throw new Error(`Ollama node inference runtime missing ${command}`);
		return runtimeCommand;
	});
	return {
		command,
		cap: OLLAMA_NODE_INFERENCE_CAPABILITY,
		hasActiveWork: () => false,
		handle: async (paramsJSON, io, context) => {
			return await (await loadRuntimeCommand()).handle(paramsJSON, io, context);
		}
	};
}
function createLazyOllamaNodeHostCommands() {
	return [createLazyNodeHostCommand(OLLAMA_MODELS_COMMAND), createLazyNodeHostCommand(OLLAMA_CHAT_COMMAND)];
}
function createOllamaNodeInvokePolicy() {
	return {
		commands: [...OLLAMA_NODE_INFERENCE_COMMANDS],
		defaultPlatforms: [...OLLAMA_NODE_INFERENCE_DEFAULT_PLATFORMS],
		handle: async (ctx) => await ctx.invokeNode()
	};
}
function createLazyOllamaNodeInferenceTool(api) {
	const loadTool = createLazyRuntimeSurface(loadOllamaNodeInference, (runtime) => runtime.createOllamaNodeInferenceTool(api));
	return {
		...ollamaNodeInferenceToolDefinition,
		execute: async (...args) => {
			return await (await loadTool()).execute(...args);
		}
	};
}
//#endregion
//#region extensions/ollama/src/stream-registration.ts
const loadOllamaStreamRuntime = createLazyRuntimeModule(() => import("../../stream.runtime-CdrPQpyx.mjs"));
function createLazyConfiguredOllamaStreamFn(params) {
	const streamFnPromise = loadOllamaStreamRuntime().then((runtime) => runtime.createConfiguredOllamaStreamFn(params));
	return async (...args) => {
		return (await streamFnPromise)(...args);
	};
}
//#endregion
//#region extensions/ollama/src/usage-registration.ts
const loadOllamaUsage = createLazyRuntimeModule(() => import("../../usage-CU6ML-_O.mjs"));
function createOllamaUsageHooks() {
	return {
		resolveUsageAuth: async (ctx) => {
			const provider = ctx.config.models?.providers?.ollama;
			if (!provider && ctx.env.OLLAMA_API_KEY?.trim() !== "ollama-local" && !collectConfiguredModelRefValues(ctx.config).some((ref) => ref.toLowerCase().startsWith("ollama/"))) return { handled: true };
			const baseUrl = readProviderBaseUrl(provider) ?? "http://127.0.0.1:11434";
			const input = provider?.apiKey;
			const local = isLocalOllamaBaseUrl(baseUrl);
			if (input == null || local && isOllamaApiKeyMarker(readOllamaStringValue(input))) {
				const candidates = await ctx.resolveApiKeyCandidatesFromConfigAndStore?.() ?? [];
				const token = local ? candidates.find((key) => key !== ctx.env.OLLAMA_API_KEY?.trim() && !isOllamaApiKeyMarker(key)) ?? "ollama-local" : candidates[0];
				return token ? { token } : { handled: true };
			}
			const resolved = await resolveConfiguredSecretInputString({
				config: ctx.config,
				env: ctx.env,
				value: input,
				path: "models.providers.ollama.apiKey",
				unresolvedReasonStyle: "detailed"
			});
			if (resolved.unresolvedRefReason) return { handled: true };
			const value = readOllamaStringValue(resolved.value);
			const token = value === "OLLAMA_API_KEY" ? ctx.env.OLLAMA_API_KEY?.trim() : value;
			return token ? { token } : { handled: true };
		},
		fetchUsageSnapshot: async (ctx) => await (await loadOllamaUsage()).fetchOllamaUsage({
			baseUrl: resolveOllamaApiBase(readProviderBaseUrl(ctx.config.models?.providers?.ollama) ?? "http://127.0.0.1:11434"),
			token: ctx.token,
			timeoutMs: ctx.timeoutMs,
			fetchFn: ctx.fetchFn
		})
	};
}
//#endregion
//#region extensions/ollama/index.ts
const loadOllamaSetup = createLazyRuntimeModule(() => import("../../setup.runtime-oosFtyNs.mjs"));
const loadOllamaMemoryEmbeddingProviderAdapter = createLazyRuntimeModule(async () => (await import("../../memory-embedding-adapter-CjBqijRO.mjs")).ollamaMemoryEmbeddingProviderAdapter);
const lazyOllamaMemoryEmbeddingProviderAdapter = {
	id: OLLAMA_PROVIDER_ID,
	defaultModel: DEFAULT_OLLAMA_EMBEDDING_MODEL,
	transport: "remote",
	authProviderId: OLLAMA_PROVIDER_ID,
	create: async (options) => await (await loadOllamaMemoryEmbeddingProviderAdapter()).create(options)
};
async function checkWsl2CrashLoopRiskLazily(api) {
	try {
		const { isWSL2Sync } = await import("../../plugin-sdk/runtime-env.js");
		if (!isWSL2Sync()) return;
		const { checkWsl2CrashLoopRisk } = await import("../../wsl2-crash-loop-check-DapmSUNm.mjs");
		await checkWsl2CrashLoopRisk(api.logger);
	} catch {}
}
function matchesOllamaContextOverflowError(errorMessage) {
	return /\bollama\b.*(?:context length|too many tokens|context window)/i.test(errorMessage) || /\btruncating input\b.*\btoo long\b/i.test(errorMessage);
}
const OLLAMA_CONFIGURED_SHOW_CONCURRENCY = 4;
const OLLAMA_CONFIGURED_SHOW_MAX_MODELS = 8;
async function buildLocalOllamaProvider(configuredBaseUrl, opts) {
	return capLocalOllamaProviderContext(await buildOllamaProvider(configuredBaseUrl, opts));
}
async function resolveAppGuidedOllamaConnection(ctx) {
	if (resolvePluginConfigObject(ctx.config, "ollama")?.discovery?.enabled === false) return null;
	const existing = resolveConfiguredOllamaProviderConfig({
		config: ctx.config,
		providerId: OLLAMA_PROVIDER_ID
	});
	const accessValue = await resolveAppGuidedOllamaApiKey(ctx, existing);
	return {
		existing,
		accessValue,
		discoveryAccess: accessValue ? { apiKey: accessValue } : {},
		baseUrl: resolveOllamaApiBase(readProviderBaseUrl(existing) ?? resolveOllamaSetupDefaultBaseUrl(ctx.env))
	};
}
async function detectAppGuidedOllamaAvailability(ctx) {
	const connection = await resolveAppGuidedOllamaConnection(ctx);
	if (!connection) return false;
	return (await fetchOllamaModels(connection.baseUrl, {
		...connection.discoveryAccess,
		...ctx.signal ? { signal: ctx.signal } : {}
	})).reachable;
}
async function discoverAppGuidedOllamaModel(ctx, options) {
	const connection = await resolveAppGuidedOllamaConnection(ctx);
	if (!connection) return null;
	const requestedPrefix = `${OLLAMA_PROVIDER_ID}/`;
	const requestedModelId = options?.modelRef?.startsWith(requestedPrefix) ? options.modelRef.slice(requestedPrefix.length) : void 0;
	if (options?.modelRef && !requestedModelId) return null;
	const configuredModels = connection.existing?.models ?? [];
	const requestedConfiguredModel = requestedModelId ? configuredModels.find((candidate) => findAvailableOllamaModelName(candidate.id, [requestedModelId]) !== void 0) : void 0;
	const requestOptions = {
		...connection.discoveryAccess,
		...ctx.signal ? { signal: ctx.signal } : {}
	};
	let availableModelNames;
	if (requestedModelId) {
		if (!requestedConfiguredModel && !isOllamaCloudModel(requestedModelId)) {
			const loaded = await fetchLoadedOllamaModelNames(connection.baseUrl, requestOptions);
			if (!loaded.reachable || findAvailableOllamaModelName(requestedModelId, loaded.models) === void 0) return null;
		}
		availableModelNames = [requestedModelId];
	} else {
		const loaded = await fetchLoadedOllamaModelNames(connection.baseUrl, requestOptions);
		if (!loaded.reachable || loaded.models.length === 0) return null;
		availableModelNames = loaded.models;
	}
	const { models: installedModels } = await fetchOllamaModels(connection.baseUrl, requestOptions);
	const candidateIds = installedModels.filter((candidate) => findAvailableOllamaModelName(candidate.name, availableModelNames)).map((candidate) => candidate.name);
	const configuredCloudModel = requestedConfiguredModel && isOllamaCloudModel(requestedConfiguredModel.id) ? requestedConfiguredModel : void 0;
	if (configuredCloudModel && !candidateIds.includes(configuredCloudModel.id)) candidateIds.push(configuredCloudModel.id);
	let model;
	for (const candidateId of orderPreferredOllamaModelIds(candidateIds)) {
		const showInfo = await queryOllamaModelShowInfo(connection.baseUrl, candidateId, requestOptions);
		const contextWindow = showInfo.contextWindow ?? configuredCloudModel?.contextWindow;
		const supportsTools = showInfo.capabilities?.includes("tools") ?? configuredCloudModel?.compat?.supportsTools === true;
		const supportsCompletion = showInfo.capabilities?.includes("completion") ?? Boolean(configuredCloudModel);
		if (!supportsTools || !supportsCompletion || contextWindow === void 0 || contextWindow < 16384) continue;
		const definition = configuredCloudModel ?? buildOllamaModelDefinition(candidateId, contextWindow, showInfo.capabilities, {
			...showInfo,
			remote: isHostedOllamaCloud(connection.baseUrl) || installedModels.some((candidate) => candidate.name === candidateId && isOllamaRemoteModel(candidate))
		});
		model = capLocalOllamaModelContext({
			...definition,
			maxTokens: requestedConfiguredModel?.maxTokens ?? definition.maxTokens,
			thinkingLevelMap: definition.thinkingLevelMap ?? showInfo.thinkingLevelMap,
			contextWindow,
			compat: {
				...definition.compat,
				supportsTools: true
			}
		}, connection.baseUrl);
		break;
	}
	if (!model) return null;
	const preparedProvider = {
		baseUrl: connection.baseUrl,
		api: "ollama",
		models: configuredModels.some((candidate) => candidate.id === model.id) ? configuredModels.map((candidate) => candidate.id === model.id ? model : candidate) : [...configuredModels, model]
	};
	const ownerValue = connection.existing?.apiKey ?? (connection.accessValue ? "OLLAMA_API_KEY" : "ollama-local");
	return {
		existing: connection.existing,
		provider: preparedProvider,
		model,
		ownerValue
	};
}
function hasOllamaDiscoverySignal(providerConfig) {
	return Boolean(process.env.OLLAMA_API_KEY?.trim()) || shouldUseSyntheticOllamaAuth(providerConfig) || Boolean(providerConfig?.apiKey);
}
function needsOllamaCatalogMetadata(entry) {
	return !(entry.contextWindow !== void 0 || entry.contextTokens !== void 0) || entry.reasoning === void 0 || entry.input === void 0 || entry.compat === void 0;
}
function readConcreteOllamaApiKey(value) {
	if (coerceSecretRef(value)) return;
	const apiKey = readOllamaStringValue(value);
	return apiKey && !isNonSecretApiKeyMarker(apiKey) ? apiKey : void 0;
}
async function resolveAppGuidedOllamaApiKey(ctx, provider) {
	const input = provider?.apiKey;
	if (input === void 0 || input === null) {
		const configuredBaseUrl = readProviderBaseUrl(provider);
		if (!configuredBaseUrl || isLocalOllamaBaseUrl(configuredBaseUrl)) return;
		return readConcreteOllamaApiKey(ctx.env.OLLAMA_API_KEY);
	}
	const resolved = await resolveConfiguredSecretInputString({
		config: ctx.config,
		env: ctx.env,
		value: input,
		path: `models.providers.${OLLAMA_PROVIDER_ID}.apiKey`,
		unresolvedReasonStyle: "detailed"
	});
	if (resolved.unresolvedRefReason) return;
	const value = readOllamaStringValue(resolved.value);
	return value === "OLLAMA_API_KEY" ? readConcreteOllamaApiKey(ctx.env.OLLAMA_API_KEY) : readConcreteOllamaApiKey(value);
}
function readEnvBackedOllamaApiKey(value, env) {
	const ref = coerceSecretRef(value);
	if (ref?.source === "env") return readConcreteOllamaApiKey(env[ref.id.trim()]);
}
function isAmbientOllamaApiKeyMarker(value) {
	return value === "ollama-local" || value === "OLLAMA_API_KEY";
}
function readUsableOllamaShowApiKey(params) {
	const explicitEnvApiKey = readEnvBackedOllamaApiKey(params.explicitApiKey, params.env);
	if (explicitEnvApiKey) return explicitEnvApiKey;
	const explicitApiKey = readConcreteOllamaApiKey(params.explicitApiKey);
	if (explicitApiKey) return explicitApiKey;
	const resolvedApiKey = readOllamaStringValue(params.resolved?.apiKey);
	const canUseResolvedDiscovery = params.allowAmbientEnvFallback || !isAmbientOllamaApiKeyMarker(resolvedApiKey);
	const discoveryApiKey = readConcreteOllamaApiKey(params.resolved?.discoveryApiKey);
	if (discoveryApiKey && canUseResolvedDiscovery) return discoveryApiKey;
	const resolvedEnvApiKey = readEnvBackedOllamaApiKey(params.resolved?.apiKey, params.env);
	if (resolvedEnvApiKey && canUseResolvedDiscovery) return resolvedEnvApiKey;
	const apiKey = readConcreteOllamaApiKey(params.resolved?.apiKey);
	if (apiKey) return apiKey;
	return params.allowAmbientEnvFallback ? readConcreteOllamaApiKey(params.env.OLLAMA_API_KEY) : void 0;
}
function collectConfiguredOllamaModelIds(params) {
	const providerPrefix = `${params.provider.toLowerCase()}/`;
	const models = /* @__PURE__ */ new Map();
	const addModelId = (modelId, api, name) => {
		const trimmed = modelId.trim();
		if (!trimmed || trimmed === "*") return;
		const trimmedName = typeof name === "string" ? name.trim() : "";
		const existing = models.get(trimmed);
		if (existing) {
			if (!existing.api && api) existing.api = api;
			if (!existing.name && trimmedName) existing.name = trimmedName;
			return;
		}
		models.set(trimmed, {
			id: trimmed,
			...api ? { api } : {},
			...trimmedName ? { name: trimmedName } : {}
		});
	};
	const addRef = (raw) => {
		if (typeof raw !== "string") return;
		const trimmed = splitTrailingAuthProfile(raw).model;
		if (!trimmed.toLowerCase().startsWith(providerPrefix)) return;
		const modelId = trimmed.slice(providerPrefix.length).trim();
		addModelId(modelId);
	};
	for (const ref of collectConfiguredModelRefValues(params.config)) addRef(ref);
	for (const entry of params.entries ?? []) if (entry.provider.toLowerCase() === params.provider.toLowerCase() && entry.id.trim() && needsOllamaCatalogMetadata(entry)) addModelId(entry.id.trim(), entry.api, entry.name);
	return [...models.values()];
}
function buildStaticOllamaCloudProvider() {
	return {
		baseUrl: OLLAMA_CLOUD_BASE_URL,
		api: "ollama",
		models: OLLAMA_CLOUD_DEFAULT_MODELS.map(buildDefaultOllamaCloudModelDefinition)
	};
}
async function buildOllamaCloudProvider(apiKey) {
	const discovered = await buildOllamaProvider(OLLAMA_CLOUD_BASE_URL, {
		...apiKey ? { apiKey } : {},
		discoveryMode: "strict"
	});
	if (!discovered.models.length || !apiKey || discovered.models.some((model) => model.id === "glm-5.2")) return discovered;
	const showInfo = await queryOllamaModelShowInfo(OLLAMA_CLOUD_BASE_URL, OLLAMA_GLM52_CLOUD_MODEL_ID, { apiKey });
	if (typeof showInfo.contextWindow !== "number" && (showInfo.capabilities?.length ?? 0) === 0 && !showInfo.thinkingLevelMap) return discovered;
	const defaultModel = OLLAMA_CLOUD_DEFAULT_MODELS.find((model) => model.id === OLLAMA_GLM52_CLOUD_MODEL_ID);
	if (!defaultModel) return discovered;
	return {
		...discovered,
		models: [...discovered.models, buildOllamaModelDefinition(defaultModel.id, showInfo.contextWindow ?? defaultModel.contextWindow, showInfo.capabilities ?? [...defaultModel.capabilities], {
			...showInfo,
			remote: true
		})]
	};
}
async function resolveRequestedDynamicOllamaModel(params) {
	const showBaseUrl = readProviderBaseUrl(params.providerConfig) ?? "http://127.0.0.1:11434";
	const showInfo = params.showApiKey ? await queryOllamaModelShowInfo(showBaseUrl, params.modelId, { apiKey: params.showApiKey }) : await queryOllamaModelShowInfo(showBaseUrl, params.modelId);
	if (typeof showInfo.contextWindow !== "number" && (showInfo.capabilities?.length ?? 0) === 0 && !showInfo.thinkingLevelMap) return;
	const definition = buildOllamaModelDefinition(params.modelId, showInfo.contextWindow, showInfo.capabilities, {
		...showInfo,
		remote: isHostedOllamaCloud(showBaseUrl)
	});
	const model = params.capContextTokens ? capLocalOllamaModelContext(definition, showBaseUrl) : definition;
	return toDynamicOllamaModel({
		provider: params.provider,
		providerConfig: params.providerConfig,
		model
	});
}
async function augmentConfiguredOllamaCatalogModels(params) {
	const models = collectConfiguredOllamaModelIds({
		config: params.config,
		provider: params.provider,
		entries: params.entries
	});
	if (models.length === 0) return [];
	const configuredProvider = resolveConfiguredOllamaProviderConfig({
		config: params.config,
		providerId: params.provider
	});
	const baseUrl = readProviderBaseUrl(configuredProvider) ?? params.defaultBaseUrl;
	const isLocalBaseUrl = isLocalOllamaBaseUrl(baseUrl);
	const showApiKey = readUsableOllamaShowApiKey({
		env: params.env,
		allowAmbientEnvFallback: !isLocalBaseUrl,
		explicitApiKey: configuredProvider?.apiKey,
		resolved: params.resolveProviderApiKey?.(params.provider)
	});
	if (!isLocalBaseUrl && !showApiKey) return [];
	const providerConfig = {
		...configuredProvider,
		models: configuredProvider?.models ?? [],
		baseUrl,
		api: configuredProvider?.api ?? "ollama"
	};
	const entries = [];
	const modelsToProbe = models.slice(0, OLLAMA_CONFIGURED_SHOW_MAX_MODELS);
	for (let index = 0; index < modelsToProbe.length; index += OLLAMA_CONFIGURED_SHOW_CONCURRENCY) {
		const batch = modelsToProbe.slice(index, index + OLLAMA_CONFIGURED_SHOW_CONCURRENCY);
		const rows = await Promise.all(batch.map(async (model) => {
			const requested = await resolveRequestedDynamicOllamaModel({
				provider: params.provider,
				providerConfig,
				modelId: model.id,
				showApiKey,
				capContextTokens: params.capContextTokens
			});
			return requested ? {
				id: requested.id,
				name: model.name ?? requested.name,
				provider: requested.provider,
				api: model.api ?? providerConfig.api,
				reasoning: requested.reasoning,
				input: requested.input,
				contextWindow: requested.contextWindow,
				contextTokens: requested.contextTokens,
				thinkingLevelMap: requested.thinkingLevelMap,
				compat: requested.compat
			} : void 0;
		}));
		for (const row of rows) if (row) entries.push(row);
	}
	return entries;
}
const createOllamaSharedProviderHooks = (api) => ({
	...buildProviderToolCompatFamilyHooks("llamacpp-gbnf"),
	supportsSystemPromptCacheBoundary: true,
	createStreamFn: ({ config, model, provider }) => {
		if (model.api !== "ollama") return;
		const { acquireLocalService } = api.runtime.llm;
		const configuredProviderId = findNormalizedProviderKey(config?.models?.providers, provider) ?? provider;
		return createLazyConfiguredOllamaStreamFn({
			model,
			localService: {
				providerId: configuredProviderId,
				acquire: acquireLocalService
			},
			providerBaseUrl: readProviderBaseUrl(resolveConfiguredOllamaProviderConfig({
				config,
				providerId: configuredProviderId
			})) ?? (provider === "ollama-cloud" ? "https://ollama.com" : void 0)
		});
	},
	buildReplayPolicy: ({ modelApi }) => modelApi === "ollama" ? {
		...buildOpenAICompatibleReplayPolicy("openai-completions", {
			sanitizeToolCallIds: false,
			dropReasoningFromHistory: false
		}),
		sanitizeToolCallIds: false
	} : buildOpenAICompatibleReplayPolicy(modelApi),
	resolveReasoningOutputMode: () => "native",
	resolveThinkingProfile,
	normalizeResolvedModel,
	wrapStreamFn: createConfiguredOllamaCompatStreamWrapper,
	matchesContextOverflowError: ({ errorMessage }) => matchesOllamaContextOverflowError(errorMessage),
	classifyFailoverReason: ({ errorMessage }) => errorMessage.trim() === "Ollama API stream ended without a final response" ? "server_error" : void 0
});
var ollama_default = definePluginEntry({
	id: "ollama",
	name: "Ollama Provider",
	description: "Bundled Ollama provider plugin",
	register(api) {
		const startupPluginConfig = api.pluginConfig ?? {};
		const providerHooks = createOllamaSharedProviderHooks(api);
		if (api.registrationMode === "full") checkWsl2CrashLoopRiskLazily(api);
		api.registerEmbeddingProvider(lazyOllamaMemoryEmbeddingProviderAdapter);
		api.registerMediaUnderstandingProvider(ollamaMediaUnderstandingProvider);
		if (startupPluginConfig.nodeInference?.enabled !== false) for (const command of createLazyOllamaNodeHostCommands()) api.registerNodeHostCommand(command);
		api.registerNodeInvokePolicy(createOllamaNodeInvokePolicy());
		api.registerTool(createLazyOllamaNodeInferenceTool(api));
		const resolveCurrentPluginConfig = (config) => {
			const runtimePluginConfig = resolvePluginConfigObject(config, "ollama");
			if (runtimePluginConfig) return runtimePluginConfig;
			return config ? {} : startupPluginConfig;
		};
		api.registerWebSearchProvider(createLazyOllamaWebSearchProvider());
		api.registerProvider({
			id: OLLAMA_CLOUD_PROVIDER_ID,
			label: "Ollama Cloud",
			docsPath: "/providers/ollama",
			envVars: ["OLLAMA_API_KEY"],
			auth: [createOllamaCloudAuthMethod()],
			catalog: {
				order: "simple",
				run: async (ctx) => {
					if (ctx.providerIds && !ctx.providerIds.includes("ollama-cloud")) return null;
					const resolvedAuth = ctx.resolveProviderApiKey(OLLAMA_CLOUD_PROVIDER_ID);
					const apiKey = resolvedAuth.apiKey ?? resolvedAuth.discoveryApiKey;
					const discoveryApiKey = resolvedAuth.discoveryApiKey ?? readConcreteOllamaApiKey(resolvedAuth.apiKey);
					if (!apiKey || !discoveryApiKey) return null;
					return await runLiveProviderCatalog({
						providerId: OLLAMA_CLOUD_PROVIDER_ID,
						profileId: resolvedAuth.profileId,
						run: async () => ({ provider: {
							...await buildOllamaCloudProvider(discoveryApiKey),
							apiKey
						} })
					});
				}
			},
			staticCatalog: {
				order: "simple",
				run: async () => ({ provider: buildStaticOllamaCloudProvider() })
			},
			...providerHooks,
			resolveDynamicModel: ({ provider, modelId }) => {
				const cloudProvider = buildStaticOllamaCloudProvider();
				const model = cloudProvider.models?.find((entry) => entry.id === modelId);
				return model ? toDynamicOllamaModel({
					provider,
					providerConfig: cloudProvider,
					model
				}) : void 0;
			},
			augmentModelCatalog: async (ctx) => await augmentConfiguredOllamaCatalogModels({
				config: ctx.config,
				defaultBaseUrl: OLLAMA_CLOUD_BASE_URL,
				env: ctx.env,
				provider: OLLAMA_CLOUD_PROVIDER_ID,
				entries: ctx.entries,
				resolveProviderApiKey: ctx.resolveProviderApiKey
			}),
			buildUnknownModelHint: () => "Ollama Cloud requires an API key. Set OLLAMA_API_KEY or run \"openclaw onboard --auth-choice ollama-cloud\". See: https://docs.openclaw.ai/providers/ollama"
		});
		api.registerProvider({
			id: OLLAMA_PROVIDER_ID,
			label: "Ollama",
			docsPath: "/providers/ollama",
			envVars: ["OLLAMA_API_KEY"],
			...createOllamaUsageHooks(),
			auth: [{
				id: "local",
				label: "Ollama",
				hint: "Connect to an Ollama server and select a cloud or local model",
				kind: "custom",
				appGuidedSetup: {
					detectAvailability: detectAppGuidedOllamaAvailability,
					detect: async (ctx) => {
						const discovered = await discoverAppGuidedOllamaModel(ctx);
						if (!discovered) return null;
						return {
							modelRef: `${OLLAMA_PROVIDER_ID}/${discovered.model.id}`,
							detail: `${discovered.model.id} at ${discovered.provider.baseUrl}`
						};
					},
					prepare: async (ctx) => {
						const discovered = await discoverAppGuidedOllamaModel(ctx, { modelRef: ctx.modelRef });
						const prefix = `${OLLAMA_PROVIDER_ID}/`;
						if (!discovered || !ctx.modelRef.startsWith(prefix)) return null;
						if (ctx.modelRef.slice(prefix.length) !== discovered.model.id) return null;
						return {
							profiles: [],
							defaultModel: ctx.modelRef,
							configPatch: { models: {
								mode: ctx.config.models?.mode ?? "merge",
								providers: { [OLLAMA_PROVIDER_ID]: {
									...discovered.existing,
									...discovered.provider,
									...discovered.ownerValue ? { apiKey: discovered.ownerValue } : {},
									models: discovered.provider.models
								} }
							} }
						};
					}
				},
				run: async (ctx) => {
					const { promptAndConfigureOllama } = await loadOllamaSetup();
					const result = await promptAndConfigureOllama({
						cfg: ctx.config,
						env: ctx.env,
						prompter: ctx.prompter,
						...ctx.signal ? { signal: ctx.signal } : {}
					});
					return {
						profiles: [],
						configPatch: result.config,
						...result.defaultModel ? { defaultModel: result.defaultModel } : {}
					};
				},
				validateNonInteractive: async (ctx) => await (await loadOllamaSetup()).validateOllamaNonInteractive(ctx),
				runNonInteractive: async (ctx) => {
					const { configureOllamaNonInteractive } = await loadOllamaSetup();
					return await configureOllamaNonInteractive({
						nextConfig: ctx.config,
						opts: {
							customBaseUrl: ctx.opts.customBaseUrl,
							customModelId: ctx.opts.customModelId
						},
						runtime: ctx.runtime,
						agentDir: ctx.agentDir
					});
				}
			}],
			catalog: {
				order: "late",
				getUnlistedConfiguredModelIds: getUnlistedOllamaConfiguredModelIds,
				run: async (ctx) => await resolveOllamaDiscoveryResult({
					ctx,
					pluginConfig: resolveCurrentPluginConfig(ctx.config),
					buildProvider: buildLocalOllamaProvider
				})
			},
			wizard: {
				setup: {
					choiceId: "ollama",
					choiceLabel: "Ollama",
					choiceHint: "Connect to an Ollama server and select a cloud or local model",
					groupId: "ollama",
					groupLabel: "Ollama",
					groupHint: "Cloud and local open models",
					methodId: "local",
					modelSelection: {
						promptWhenAuthChoiceProvided: true,
						allowKeepCurrent: false
					}
				},
				modelPicker: {
					label: "Ollama (custom)",
					hint: "Detect models from a local or remote Ollama instance",
					methodId: "local"
				}
			},
			onModelSelected: async ({ config, model, prompter }) => {
				if (!model.startsWith("ollama/")) return;
				const { ensureOllamaModelPulled } = await loadOllamaSetup();
				await ensureOllamaModelPulled({
					config,
					model,
					prompter
				});
			},
			...providerHooks,
			augmentModelCatalog: async (ctx) => await augmentConfiguredOllamaCatalogModels({
				config: ctx.config,
				defaultBaseUrl: OLLAMA_DEFAULT_BASE_URL,
				env: ctx.env,
				provider: OLLAMA_PROVIDER_ID,
				entries: ctx.entries,
				resolveProviderApiKey: ctx.resolveProviderApiKey,
				capContextTokens: true
			}),
			resolveSyntheticAuth: ({ provider, providerConfig }) => {
				if (!shouldUseSyntheticOllamaAuth(providerConfig)) return;
				return {
					apiKey: OLLAMA_DEFAULT_API_KEY,
					source: `models.providers.${provider ?? "ollama"} (synthetic local key)`,
					mode: "api-key"
				};
			},
			shouldDeferSyntheticProfileAuth: ({ resolvedApiKey }) => resolvedApiKey?.trim() === OLLAMA_DEFAULT_API_KEY,
			prepareDynamicModel: async (ctx) => {
				const providerConfig = resolveConfiguredOllamaProviderConfig({
					config: ctx.config,
					providerId: ctx.provider
				});
				if (!hasOllamaDiscoverySignal(providerConfig)) return;
				const baseUrl = readProviderBaseUrl(providerConfig);
				let discoveryApiKey;
				if (providerConfig?.apiKey !== void 0 && providerConfig.apiKey !== null) {
					const resolved = await resolveConfiguredSecretInputString({
						config: ctx.config ?? {},
						env: process.env,
						value: providerConfig.apiKey,
						path: `models.providers[${JSON.stringify(ctx.provider)}].apiKey`,
						unresolvedReasonStyle: "detailed"
					});
					if (resolved.unresolvedRefReason) return;
					const resolvedApiKey = readOllamaStringValue(resolved.value);
					const configuredSecretRef = coerceSecretRef(providerConfig.apiKey);
					discoveryApiKey = configuredSecretRef ? resolvedApiKey : resolvedApiKey === "OLLAMA_API_KEY" ? readConcreteOllamaApiKey(process.env.OLLAMA_API_KEY) : readConcreteOllamaApiKey(resolvedApiKey);
					if (configuredSecretRef && !discoveryApiKey) return;
				} else if (!isLocalOllamaBaseUrl(baseUrl)) discoveryApiKey = readConcreteOllamaApiKey(process.env.OLLAMA_API_KEY);
				const provider = await buildLocalOllamaProvider(baseUrl, {
					quiet: true,
					...discoveryApiKey ? { apiKey: discoveryApiKey } : {}
				});
				const dynamicApi = providerConfig?.api ?? provider.api;
				const dynamicProvider = {
					...provider,
					baseUrl: resolveOllamaRuntimeBaseUrl({
						api: dynamicApi,
						configuredBaseUrl: baseUrl,
						discoveredBaseUrl: provider.baseUrl
					}),
					api: dynamicApi
				};
				const discoveredModel = dynamicProvider.models?.find((model) => model.id === ctx.modelId);
				if (discoveredModel) return toDynamicOllamaModel({
					provider: ctx.provider,
					providerConfig: dynamicProvider,
					model: discoveredModel
				});
				return await resolveRequestedDynamicOllamaModel({
					provider: ctx.provider,
					providerConfig: dynamicProvider,
					modelId: ctx.modelId,
					showApiKey: discoveryApiKey,
					capContextTokens: true
				});
			},
			buildUnknownModelHint: () => "Ollama requires authentication to be registered as a provider. Set OLLAMA_API_KEY=\"ollama-local\" (any value works) or run \"openclaw configure\". See: https://docs.openclaw.ai/providers/ollama"
		});
	}
});
//#endregion
export { ollama_default as default };
