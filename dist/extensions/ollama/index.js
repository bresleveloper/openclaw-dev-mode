import { s as coerceSecretRef } from "../../types.secrets-lIZQEgMF.js";
import { g as collectConfiguredModelRefValues } from "../../gateway-startup-speech-providers-CQCz_cL7.js";
import { n as isWSL2Sync } from "../../wsl-DNPNwOqt.js";
import { d as isNonSecretApiKeyMarker } from "../../model-auth-markers-C4s6SbvA.js";
import { r as describeImagesWithModel, t as describeImageWithModel } from "../../image-runtime-BQzspu3i.js";
import "../../media-understanding-D06kjTwz.js";
import "../../runtime-env-oOti2yy7.js";
import { a as buildOpenAICompatibleReplayPolicy } from "../../provider-replay-helpers-DtVD32X4.js";
import { t as definePluginEntry } from "../../plugin-entry-BZpzqykQ.js";
import { r as OPENAI_COMPATIBLE_REPLAY_HOOKS } from "../../provider-model-shared-pp09751S.js";
import { n as buildApiKeyCredential } from "../../provider-auth-helpers-sTwxNMVI.js";
import { t as createProviderApiKeyAuthMethod } from "../../provider-api-key-auth-BJsVS391.js";
import "../../provider-auth-DKbeFxjY.js";
import { r as resolvePluginConfigObject } from "../../plugin-config-runtime-DWfSLpLu.js";
import "../../provider-auth-api-key-N3OQ6un7.js";
import { i as OLLAMA_DEFAULT_BASE_URL, n as OLLAMA_CLOUD_DEFAULT_MODELS, r as OLLAMA_CLOUD_PROVIDER_ID, t as OLLAMA_CLOUD_BASE_URL, u as OLLAMA_GLM52_CLOUD_MODEL_ID } from "../../defaults-W8ZJNfBr.js";
import { i as buildOllamaProvider, l as queryOllamaModelShowInfo, r as buildOllamaModelDefinition, t as readProviderBaseUrl } from "../../provider-base-url-DZGs0EvZ.js";
import { i as promptAndConfigureOllama, n as configureOllamaNonInteractive, r as ensureOllamaModelPulled } from "../../setup-BrCrgyOG.js";
import { d as resolveConfiguredOllamaProviderConfig, o as createConfiguredOllamaCompatStreamWrapper, s as createConfiguredOllamaStreamFn } from "../../stream-Cs_EmZgp.js";
import "../../api-DAVCVI7Q.js";
import { n as resolveThinkingProfile } from "../../provider-policy-api-CJLL3faK.js";
import { a as resolveOllamaRuntimeBaseUrl, i as resolveOllamaDiscoveryResult, n as OLLAMA_PROVIDER_ID, o as shouldUseSyntheticOllamaAuth, r as isLocalOllamaBaseUrl, t as OLLAMA_DEFAULT_API_KEY } from "../../discovery-shared-0micmVyK.js";
import { n as createOllamaEmbeddingProvider, t as DEFAULT_OLLAMA_EMBEDDING_MODEL } from "../../embedding-provider-d4arbb28.js";
import { t as createOllamaWebSearchProvider } from "../../web-search-provider-CSfbMVOM.js";
import { access } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
//#region extensions/ollama/src/media-understanding-provider.ts
const ollamaMediaUnderstandingProvider = {
	id: OLLAMA_PROVIDER_ID,
	capabilities: ["image"],
	describeImage: describeImageWithModel,
	describeImages: describeImagesWithModel
};
//#endregion
//#region extensions/ollama/src/memory-embedding-adapter.ts
const ollamaMemoryEmbeddingProviderAdapter = {
	id: "ollama",
	defaultModel: DEFAULT_OLLAMA_EMBEDDING_MODEL,
	transport: "remote",
	authProviderId: "ollama",
	create: async (options) => {
		const { provider, client } = await createOllamaEmbeddingProvider({
			...options,
			provider: "ollama",
			fallback: "none"
		});
		return {
			provider,
			runtime: {
				id: "ollama",
				inlineBatchTimeoutMs: 10 * 6e4,
				cacheKeyData: {
					provider: "ollama",
					model: client.model,
					outputDimensionality: client.outputDimensionality
				}
			}
		};
	}
};
//#endregion
//#region extensions/ollama/src/wsl2-crash-loop-check.ts
const execFileAsync = promisify(execFile);
const SYSTEMCTL_TIMEOUT_MS = 5e3;
const WSL_CUDA_MARKERS = [
	"/dev/dxg",
	"/usr/lib/wsl/lib/nvidia-smi",
	"/usr/lib/wsl/lib/libcuda.so.1",
	"/usr/local/cuda"
];
function parseSystemctlShowProperties(stdout) {
	const properties = /* @__PURE__ */ new Map();
	for (const line of stdout.split(/\r?\n/u)) {
		const separator = line.indexOf("=");
		if (separator <= 0) continue;
		properties.set(line.slice(0, separator), line.slice(separator + 1));
	}
	return properties;
}
async function isOllamaEnabledWithRestartAlways() {
	try {
		const { stdout } = await execFileAsync("systemctl", [
			"show",
			"ollama.service",
			"--property=UnitFileState,Restart",
			"--no-pager"
		], { timeout: SYSTEMCTL_TIMEOUT_MS });
		const properties = parseSystemctlShowProperties(stdout);
		return properties.get("UnitFileState") === "enabled" && properties.get("Restart") === "always";
	} catch {
		return false;
	}
}
async function hasWslCuda() {
	for (const marker of WSL_CUDA_MARKERS) try {
		await access(marker);
		return true;
	} catch {}
	return false;
}
async function checkWsl2CrashLoopRisk(logger) {
	try {
		if (!isWSL2Sync()) return;
		if (!await isOllamaEnabledWithRestartAlways()) return;
		if (!await hasWslCuda()) return;
		logger.warn([
			"[ollama] WSL2 crash-loop risk: ollama.service is enabled with Restart=always and CUDA is visible.",
			"On WSL2, GPU-backed Ollama can pin host memory while loading a model.",
			"Hyper-V memory reclaim cannot always reclaim those pinned pages, so Windows can terminate and restart the WSL2 VM.",
			"",
			"Common evidence: repeated WSL2 reboots, high CPU in app.slice at startup, and SIGTERM from systemd rather than the Linux OOM killer.",
			"See: https://github.com/ollama/ollama/issues/11317",
			"",
			"Mitigation:",
			"  1. Disable autostart: sudo systemctl disable ollama",
			"  2. Add [experimental] autoMemoryReclaim=disabled to %USERPROFILE%\\.wslconfig on Windows, then run wsl --shutdown",
			"  3. Set OLLAMA_KEEP_ALIVE=5m in the Ollama service environment or start ollama serve manually when needed"
		].join("\n"));
	} catch {}
}
//#endregion
//#region extensions/ollama/index.ts
function buildNativeOllamaReplayPolicy() {
	return {
		...buildOpenAICompatibleReplayPolicy("openai-completions", { sanitizeToolCallIds: false }),
		sanitizeToolCallIds: false
	};
}
const dynamicModelCache = /* @__PURE__ */ new Map();
const OLLAMA_CLOUD_DEFAULT_MODEL_REF = `${OLLAMA_CLOUD_PROVIDER_ID}/${OLLAMA_CLOUD_DEFAULT_MODELS[0]}`;
const OLLAMA_CONFIGURED_SHOW_CONCURRENCY = 4;
const OLLAMA_CONFIGURED_SHOW_MAX_MODELS = 8;
function buildDynamicCacheKey(provider, baseUrl) {
	return `${provider}\0${baseUrl ?? ""}`;
}
function hasOllamaDiscoverySignal(providerConfig) {
	return Boolean(process.env.OLLAMA_API_KEY?.trim()) || shouldUseSyntheticOllamaAuth(providerConfig) || Boolean(providerConfig?.apiKey);
}
function toDynamicOllamaModel(params) {
	const input = (params.model.input ?? ["text"]).filter((value) => value === "text" || value === "image");
	return {
		id: params.model.id,
		name: params.model.name ?? params.model.id,
		provider: params.provider,
		api: params.providerConfig.api ?? "ollama",
		baseUrl: readProviderBaseUrl(params.providerConfig) ?? "",
		reasoning: params.model.reasoning ?? false,
		input: input.length > 0 ? input : ["text"],
		cost: params.model.cost ?? {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow: params.model.contextWindow ?? 8192,
		maxTokens: params.model.maxTokens ?? 8192,
		...params.model.compat ? { compat: params.model.compat } : {},
		...params.model.params ? { params: params.model.params } : {}
	};
}
function stripTrailingAuthProfile(raw) {
	const trimmed = raw.trim();
	const lastSlash = trimmed.lastIndexOf("/");
	let delimiter = trimmed.indexOf("@", lastSlash + 1);
	if (delimiter <= 0) return trimmed;
	const suffix = () => trimmed.slice(delimiter + 1);
	if (/^\d{8}(?:@|$)/.test(suffix())) {
		const next = trimmed.indexOf("@", delimiter + 9);
		if (next < 0) return trimmed;
		delimiter = next;
	}
	if (/^(?:i?q\d+(?:_[a-z0-9]+)*|\d+bit)(?:@|$)/i.test(suffix())) {
		const next = trimmed.indexOf("@", delimiter + 1);
		if (next < 0) return trimmed;
		delimiter = next;
	}
	const model = trimmed.slice(0, delimiter).trim();
	const profile = trimmed.slice(delimiter + 1).trim();
	return model && profile ? model : trimmed;
}
function needsOllamaCatalogMetadata(entry) {
	return !(entry.contextWindow !== void 0 || entry.contextTokens !== void 0) || entry.reasoning === void 0 || entry.input === void 0 || entry.compat === void 0;
}
function readConfiguredOllamaApiKey(value) {
	if (typeof value === "string") return value.trim() || void 0;
	if (value && typeof value === "object" && "value" in value) {
		const resolved = value.value;
		if (typeof resolved === "string") return resolved.trim() || void 0;
	}
}
function readConcreteOllamaApiKey(value) {
	if (coerceSecretRef(value)) return;
	const apiKey = readConfiguredOllamaApiKey(value);
	return apiKey && !isNonSecretApiKeyMarker(apiKey) ? apiKey : void 0;
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
	const resolvedApiKey = readConfiguredOllamaApiKey(params.resolved?.apiKey);
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
			if (!existing.api && api || !existing.name && trimmedName) models.set(trimmed, {
				...existing,
				...api && !existing.api ? { api } : {},
				...trimmedName && !existing.name ? { name: trimmedName } : {}
			});
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
		const trimmed = stripTrailingAuthProfile(raw);
		if (!trimmed.toLowerCase().startsWith(providerPrefix)) return;
		addModelId(trimmed.slice(providerPrefix.length).trim());
	};
	for (const ref of collectConfiguredModelRefValues(params.config)) addRef(ref);
	for (const entry of params.entries ?? []) if (entry.provider.toLowerCase() === params.provider.toLowerCase() && entry.id.trim() && needsOllamaCatalogMetadata(entry)) addModelId(entry.id.trim(), entry.api, entry.name);
	return [...models.values()];
}
function buildStaticOllamaCloudProvider() {
	return {
		baseUrl: OLLAMA_CLOUD_BASE_URL,
		api: "ollama",
		models: OLLAMA_CLOUD_DEFAULT_MODELS.map((model) => buildOllamaModelDefinition(model))
	};
}
async function buildOllamaCloudProvider(apiKey) {
	const discovered = await buildOllamaProvider(OLLAMA_CLOUD_BASE_URL, {
		...apiKey ? { apiKey } : {},
		quiet: true
	});
	if (!discovered.models?.length) return buildStaticOllamaCloudProvider();
	if (!apiKey || discovered.models.some((model) => model.id === "glm-5.2:cloud")) return discovered;
	const showInfo = await queryOllamaModelShowInfo(OLLAMA_CLOUD_BASE_URL, OLLAMA_GLM52_CLOUD_MODEL_ID, { apiKey });
	if (typeof showInfo.contextWindow !== "number" && (showInfo.capabilities?.length ?? 0) === 0) return discovered;
	return {
		...discovered,
		models: [...discovered.models, buildOllamaModelDefinition(OLLAMA_GLM52_CLOUD_MODEL_ID, showInfo.contextWindow, showInfo.capabilities)]
	};
}
async function resolveRequestedDynamicOllamaModel(params) {
	const showBaseUrl = readProviderBaseUrl(params.providerConfig) ?? "http://127.0.0.1:11434";
	const showInfo = params.showApiKey ? await queryOllamaModelShowInfo(showBaseUrl, params.modelId, { apiKey: params.showApiKey }) : await queryOllamaModelShowInfo(showBaseUrl, params.modelId);
	if (typeof showInfo.contextWindow !== "number" && (showInfo.capabilities?.length ?? 0) === 0) return;
	return toDynamicOllamaModel({
		provider: params.provider,
		providerConfig: params.providerConfig,
		model: buildOllamaModelDefinition(params.modelId, showInfo.contextWindow, showInfo.capabilities)
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
				showApiKey
			});
			return requested ? {
				id: requested.id,
				name: model.name ?? requested.name,
				provider: requested.provider,
				api: model.api ?? providerConfig.api,
				reasoning: requested.reasoning,
				input: requested.input,
				contextWindow: requested.contextWindow,
				compat: requested.compat
			} : void 0;
		}));
		for (const row of rows) if (row) entries.push(row);
	}
	return entries;
}
var ollama_default = definePluginEntry({
	id: "ollama",
	name: "Ollama Provider",
	description: "Bundled Ollama provider plugin",
	register(api) {
		if (api.registrationMode === "full") checkWsl2CrashLoopRisk(api.logger);
		api.registerMemoryEmbeddingProvider(ollamaMemoryEmbeddingProviderAdapter);
		api.registerMediaUnderstandingProvider(ollamaMediaUnderstandingProvider);
		const startupPluginConfig = api.pluginConfig ?? {};
		const resolveCurrentPluginConfig = (config) => {
			const runtimePluginConfig = resolvePluginConfigObject(config, "ollama");
			if (runtimePluginConfig) return runtimePluginConfig;
			return config ? {} : startupPluginConfig;
		};
		api.registerWebSearchProvider(createOllamaWebSearchProvider());
		api.registerProvider({
			id: OLLAMA_CLOUD_PROVIDER_ID,
			label: "Ollama Cloud",
			docsPath: "/providers/ollama",
			envVars: ["OLLAMA_API_KEY"],
			auth: [createProviderApiKeyAuthMethod({
				providerId: OLLAMA_CLOUD_PROVIDER_ID,
				methodId: "api-key",
				label: "Ollama Cloud API key",
				hint: "Hosted models via ollama.com",
				optionKey: "ollamaCloudApiKey",
				flagName: "--ollama-cloud-api-key",
				envVar: "OLLAMA_API_KEY",
				promptMessage: "Enter Ollama Cloud API key",
				defaultModel: OLLAMA_CLOUD_DEFAULT_MODEL_REF,
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
			})],
			catalog: {
				order: "simple",
				run: async (ctx) => {
					const resolvedAuth = ctx.resolveProviderApiKey(OLLAMA_CLOUD_PROVIDER_ID);
					const apiKey = resolvedAuth.apiKey ?? resolvedAuth.discoveryApiKey;
					if (!apiKey) return null;
					return { provider: {
						...await buildOllamaCloudProvider(readUsableOllamaShowApiKey({
							env: ctx.env,
							allowAmbientEnvFallback: true,
							resolved: resolvedAuth
						})),
						apiKey
					} };
				}
			},
			staticCatalog: {
				order: "simple",
				run: async () => ({ provider: buildStaticOllamaCloudProvider() })
			},
			createStreamFn: ({ config, model, provider }) => {
				if (model.api !== "ollama") return;
				return createConfiguredOllamaStreamFn({
					model,
					providerBaseUrl: readProviderBaseUrl(resolveConfiguredOllamaProviderConfig({
						config,
						providerId: provider
					})) ?? "https://ollama.com"
				});
			},
			...OPENAI_COMPATIBLE_REPLAY_HOOKS,
			buildReplayPolicy: (ctx) => ctx.modelApi === "ollama" ? buildNativeOllamaReplayPolicy() : buildOpenAICompatibleReplayPolicy(ctx.modelApi),
			resolveReasoningOutputMode: () => "native",
			resolveThinkingProfile,
			wrapStreamFn: createConfiguredOllamaCompatStreamWrapper,
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
			matchesContextOverflowError: ({ errorMessage }) => /\bollama\b.*(?:context length|too many tokens|context window)/i.test(errorMessage) || /\btruncating input\b.*\btoo long\b/i.test(errorMessage),
			buildUnknownModelHint: () => "Ollama Cloud requires an API key. Set OLLAMA_API_KEY or run \"openclaw onboard --auth-choice ollama-cloud\". See: https://docs.openclaw.ai/providers/ollama"
		});
		api.registerProvider({
			id: OLLAMA_PROVIDER_ID,
			label: "Ollama",
			docsPath: "/providers/ollama",
			envVars: ["OLLAMA_API_KEY"],
			auth: [{
				id: "local",
				label: "Ollama",
				hint: "Cloud and local open models",
				kind: "custom",
				run: async (ctx) => {
					const result = await promptAndConfigureOllama({
						cfg: ctx.config,
						env: ctx.env,
						opts: ctx.opts,
						prompter: ctx.prompter,
						secretInputMode: ctx.secretInputMode,
						allowSecretRefPrompt: ctx.allowSecretRefPrompt
					});
					return {
						profiles: [{
							profileId: "ollama:default",
							credential: buildApiKeyCredential(OLLAMA_PROVIDER_ID, result.credential, void 0, result.credentialMode ? {
								secretInputMode: result.credentialMode,
								config: ctx.config
							} : void 0)
						}],
						configPatch: result.config
					};
				},
				runNonInteractive: async (ctx) => {
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
				run: async (ctx) => await resolveOllamaDiscoveryResult({
					ctx,
					pluginConfig: resolveCurrentPluginConfig(ctx.config),
					buildProvider: buildOllamaProvider
				})
			},
			wizard: {
				setup: {
					choiceId: "ollama",
					choiceLabel: "Ollama",
					choiceHint: "Cloud and local open models",
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
				await ensureOllamaModelPulled({
					config,
					model,
					prompter
				});
			},
			createStreamFn: ({ config, model, provider }) => {
				if (model.api !== "ollama") return;
				return createConfiguredOllamaStreamFn({
					model,
					providerBaseUrl: readProviderBaseUrl(resolveConfiguredOllamaProviderConfig({
						config,
						providerId: provider
					}))
				});
			},
			...OPENAI_COMPATIBLE_REPLAY_HOOKS,
			buildReplayPolicy: (ctx) => ctx.modelApi === "ollama" ? buildNativeOllamaReplayPolicy() : buildOpenAICompatibleReplayPolicy(ctx.modelApi),
			resolveReasoningOutputMode: () => "native",
			resolveThinkingProfile,
			wrapStreamFn: createConfiguredOllamaCompatStreamWrapper,
			augmentModelCatalog: async (ctx) => await augmentConfiguredOllamaCatalogModels({
				config: ctx.config,
				defaultBaseUrl: OLLAMA_DEFAULT_BASE_URL,
				env: ctx.env,
				provider: OLLAMA_PROVIDER_ID,
				entries: ctx.entries,
				resolveProviderApiKey: ctx.resolveProviderApiKey
			}),
			createEmbeddingProvider: async ({ config, model, provider: embeddingProvider, remote }) => {
				const { provider, client } = await createOllamaEmbeddingProvider({
					config,
					remote,
					model: model || "nomic-embed-text",
					provider: embeddingProvider || "ollama"
				});
				return {
					...provider,
					client
				};
			},
			matchesContextOverflowError: ({ errorMessage }) => /\bollama\b.*(?:context length|too many tokens|context window)/i.test(errorMessage) || /\btruncating input\b.*\btoo long\b/i.test(errorMessage),
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
				const provider = await buildOllamaProvider(baseUrl, { quiet: true });
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
				const dynamicModels = (dynamicProvider.models ?? []).map((model) => toDynamicOllamaModel({
					provider: ctx.provider,
					providerConfig: dynamicProvider,
					model
				}));
				if (!dynamicModels.some((model) => model.id === ctx.modelId)) {
					const requestedModel = await resolveRequestedDynamicOllamaModel({
						provider: ctx.provider,
						providerConfig: dynamicProvider,
						modelId: ctx.modelId
					});
					if (requestedModel) dynamicModels.push(requestedModel);
				}
				dynamicModelCache.set(buildDynamicCacheKey(ctx.provider, baseUrl), dynamicModels);
			},
			resolveDynamicModel: (ctx) => {
				const providerConfig = resolveConfiguredOllamaProviderConfig({
					config: ctx.config,
					providerId: ctx.provider
				});
				return dynamicModelCache.get(buildDynamicCacheKey(ctx.provider, readProviderBaseUrl(providerConfig)))?.find((model) => model.id === ctx.modelId);
			},
			buildUnknownModelHint: () => "Ollama requires authentication to be registered as a provider. Set OLLAMA_API_KEY=\"ollama-local\" (any value works) or run \"openclaw configure\". See: https://docs.openclaw.ai/providers/ollama"
		});
	}
});
//#endregion
export { ollama_default as default };
