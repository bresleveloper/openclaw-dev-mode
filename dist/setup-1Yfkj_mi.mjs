import { w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { n as isTruthyEnvValue } from "./env-C4a8LL2I.mjs";
import { o as hasConfiguredSecretInput } from "./types.secrets-B5xWSzLp.mjs";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-Df_qhWv_.mjs";
import { a as removeProviderAuthProfilesWithLock } from "./profiles-DblRQQgZ.mjs";
import { s as isNonSecretApiKeyMarker } from "./model-auth-markers-BfYDKFYI.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./runtime-env-BaPIl5PP.mjs";
import "./number-runtime-CGwowceO.mjs";
import { n as WizardCancelledError } from "./prompts-DLsO8MlU.mjs";
import { n as buildApiKeyCredential } from "./provider-auth-helpers-CVzRzfCc.mjs";
import { y as withAgentModelAliases } from "./provider-onboard-Be0xLg2V.mjs";
import { n as applyProviderDefaultModel, r as configureOpenAICompatibleSelfHostedProviderNonInteractive } from "./provider-setup-Be3-VKqw.mjs";
import { l as selectPreferredLocalModelId } from "./provider-model-shared-DwrT_ZjA.mjs";
import "./setup-CQOexhh9.mjs";
import "./provider-auth-runtime-CYwZwijM.mjs";
import "./provider-auth-eHeoP8se.mjs";
import { t as ensureApiKeyFromEnvOrPrompt } from "./provider-auth-input-Bs4B3uJA.mjs";
import { h as runLiveProviderCatalog } from "./provider-catalog-live-runtime-8rOzIDOV.mjs";
import { A as LMSTUDIO_DEFAULT_BASE_URL, B as LMSTUDIO_PROVIDER_LABEL, F as LMSTUDIO_DOCKER_HOST_BASE_URL, I as LMSTUDIO_DOCKER_HOST_INFERENCE_BASE_URL, L as LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER, M as LMSTUDIO_DEFAULT_INFERENCE_BASE_URL, O as resolveLoadedContextWindow, P as LMSTUDIO_DEFAULT_MODEL_ID, R as LMSTUDIO_MODEL_PLACEHOLDER, a as LmstudioConfigResolutionError, h as shouldUseLmstudioApiKeyPlaceholder, k as LMSTUDIO_DEFAULT_API_KEY_ENV_VAR, l as resolveLmstudioProviderHeaders, m as resolveLmstudioProviderAuthMode, p as hasLmstudioAuthorizationHeader, r as fetchLmstudioModels, s as resolveLmstudioConfiguredApiKey, t as discoverLmstudioModels, u as resolveLmstudioRequestContext, w as resolveLmstudioInferenceBase, y as mapLmstudioWireModelsToConfig, z as LMSTUDIO_PROVIDER_ID } from "./models.fetch-BKIrnKDJ.mjs";
//#region extensions/lmstudio/src/setup.ts
const LMSTUDIO_APP_GUIDED_MIN_CONTEXT_TOKENS = 16384;
function resolveLmstudioSetupDefaultBaseUrl(env = process.env) {
	return isTruthyEnvValue(env.OPENCLAW_DOCKER_SETUP) ? LMSTUDIO_DOCKER_HOST_BASE_URL : LMSTUDIO_DEFAULT_BASE_URL;
}
function resolveLmstudioSetupDefaultInferenceBaseUrl(env = process.env) {
	return isTruthyEnvValue(env.OPENCLAW_DOCKER_SETUP) ? LMSTUDIO_DOCKER_HOST_INFERENCE_BASE_URL : LMSTUDIO_DEFAULT_INFERENCE_BASE_URL;
}
function stripLmstudioStoredAuthConfig(cfg) {
	const { profiles: _profiles, order: _order, ...restAuth } = cfg.auth ?? {};
	const nextProfiles = Object.fromEntries(Object.entries(cfg.auth?.profiles ?? {}).filter(([, profile]) => profile.provider !== LMSTUDIO_PROVIDER_ID));
	const nextOrder = Object.fromEntries(Object.entries(cfg.auth?.order ?? {}).filter(([providerId]) => providerId !== LMSTUDIO_PROVIDER_ID));
	return {
		...cfg,
		auth: Object.keys(restAuth).length > 0 || Object.keys(nextProfiles).length > 0 || Object.keys(nextOrder).length > 0 ? {
			...restAuth,
			...Object.keys(nextProfiles).length > 0 ? { profiles: nextProfiles } : {},
			...Object.keys(nextOrder).length > 0 ? { order: nextOrder } : {}
		} : void 0
	};
}
function resolvePositiveInteger(value) {
	if (typeof value === "number" && Number.isFinite(value)) {
		const normalized = Math.floor(value);
		return normalized > 0 ? normalized : void 0;
	}
	if (typeof value !== "string") return;
	const trimmed = value.trim();
	if (!trimmed || !/^\d+$/.test(trimmed)) return;
	return parseStrictPositiveInteger(trimmed);
}
function buildLmstudioSetupProviderConfig(params) {
	const existingWithoutAuth = params.existingProvider ? (({ auth: _auth, apiKey: _apiKey, ...rest }) => rest)(params.existingProvider) : void 0;
	const sharedWithoutAuth = params.sharedProvider ? (({ auth: _auth, apiKey: _apiKey, ...rest }) => rest)(params.sharedProvider) : void 0;
	const resolvedAuth = resolveLmstudioProviderAuthMode(params.apiKey);
	return {
		...existingWithoutAuth,
		...sharedWithoutAuth,
		baseUrl: params.baseUrl,
		api: params.sharedProvider?.api ?? params.existingProvider?.api ?? "openai-completions",
		...resolvedAuth ? { auth: resolvedAuth } : {},
		...params.apiKey !== void 0 ? { apiKey: params.apiKey } : {},
		headers: params.headers,
		models: params.models
	};
}
function resolveLmstudioModelAdvertisedContextLimit(entry) {
	const raw = entry.max_context_length;
	if (raw === void 0 || !Number.isFinite(raw) || raw <= 0) return;
	return Math.floor(raw);
}
function applyModelContextTokensOverride(model, contextTokens) {
	return {
		...model,
		contextTokens,
		maxTokens: Math.min(model.maxTokens, contextTokens)
	};
}
function applyRequestedContextWindowToAllModels(params) {
	const requestedContextWindow = params.requestedContextWindow;
	if (!requestedContextWindow) return params.models;
	const contextLimitByModelId = new Map(params.discoveryModels.map((entry) => {
		const modelId = entry.key?.trim();
		if (!modelId) return null;
		return [modelId, resolveLmstudioModelAdvertisedContextLimit(entry)];
	}).filter((entry) => Boolean(entry)));
	return params.models.map((model) => applyModelContextTokensOverride(model, Math.min(requestedContextWindow, contextLimitByModelId.get(model.id) ?? requestedContextWindow)));
}
function collectLoadedLmstudioModelIds(discovery) {
	return new Set(discovery.models.flatMap((entry) => {
		const id = entry.key?.trim();
		return entry.type === "llm" && id && resolveLoadedContextWindow(entry) !== null ? [id] : [];
	}));
}
function resolveLmstudioDiscoveryFailure(params) {
	const { baseUrl, discovery } = params;
	if (!discovery.reachable) return {
		noteLines: [`LM Studio could not be reached at ${baseUrl}.`, "Start LM Studio (or run lms server start) and re-run setup."],
		retryLine: "Start LM Studio (or run lms server start), then continue to retry.",
		reason: "LM Studio not reachable"
	};
	if (discovery.status !== void 0 && discovery.status >= 400) {
		const retryable = discovery.status === 408 || discovery.status === 425 || discovery.status === 429 || discovery.status >= 500;
		return {
			noteLines: [`LM Studio returned HTTP ${discovery.status} while listing models at ${baseUrl}.`, retryable && !params.resetPreflight ? "Wait for LM Studio to recover, then re-run setup." : "Check the base URL and API key, then re-run setup."],
			...retryable ? { retryLine: "Wait for LM Studio to recover, then continue to retry." } : {},
			reason: `LM Studio discovery failed (${discovery.status})`
		};
	}
	if (!(params.resetPreflight && params.requestedModelId) && collectLoadedLmstudioModelIds(discovery).size === 0) return {
		noteLines: [`No loaded LM Studio LLM models were found at ${baseUrl}.`, "Load a model in LM Studio (or run lms load <model>), then re-run setup."],
		retryLine: "Load a model in LM Studio (or run lms load <model>), then continue to retry.",
		reason: "No loaded LM Studio models found"
	};
	return null;
}
function resolvePersistedLmstudioApiKey(params) {
	if (params.explicitAuth === "api-key") {
		if (params.preferFallbackApiKey && params.fallbackApiKey !== void 0) return params.fallbackApiKey;
		if (resolveLmstudioProviderAuthMode(params.currentApiKey)) return params.currentApiKey;
		return params.fallbackApiKey;
	}
	return shouldUseLmstudioApiKeyPlaceholder({
		hasModels: params.hasModels,
		resolvedApiKey: params.currentApiKey,
		hasAuthorizationHeader: params.hasAuthorizationHeader
	}) ? LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER : void 0;
}
/** Preserves existing allowlist metadata and appends discovered LM Studio model refs. */
function mergeDiscoveredLmstudioAllowlistEntries(params) {
	return withAgentModelAliases(params.existing, normalizeStringEntries(params.discoveredModels.map((model) => model.id)).map((id) => `${LMSTUDIO_PROVIDER_ID}/${id}`));
}
function selectDefaultLmstudioModelId(discoveredModels) {
	const ids = normalizeStringEntries(discoveredModels.map((model) => model.id));
	if (ids.length === 0) return;
	return ids.includes("qwen/qwen3.5-9b") ? LMSTUDIO_DEFAULT_MODEL_ID : selectPreferredLocalModelId(ids) ?? ids[0];
}
function collectAppGuidedLmstudioModelIds(discovery) {
	return new Set(discovery.models.flatMap((entry) => {
		const id = entry.key?.trim();
		if (entry.type !== "llm" || entry.capabilities?.trained_for_tool_use !== true || !id) return [];
		const loadedContextWindow = resolveLoadedContextWindow(entry);
		return loadedContextWindow !== null && loadedContextWindow >= LMSTUDIO_APP_GUIDED_MIN_CONTEXT_TOKENS ? [id] : [];
	}));
}
async function discoverLmstudioSetupModels(params) {
	const discovery = await fetchLmstudioModels({
		baseUrl: params.baseUrl,
		apiKey: params.apiKey,
		...params.headers ? { headers: params.headers } : {},
		timeoutMs: params.timeoutMs ?? 5e3
	});
	const failure = resolveLmstudioDiscoveryFailure({
		baseUrl: params.baseUrl,
		discovery,
		requestedModelId: params.requestedModelId,
		resetPreflight: params.resetPreflight
	});
	if (failure) return { failure };
	const models = mapLmstudioWireModelsToConfig(discovery.models);
	const loadedModelIds = collectLoadedLmstudioModelIds(discovery);
	const defaultModelId = selectDefaultLmstudioModelId(models.filter((model) => loadedModelIds.has(model.id)));
	return { value: {
		discovery,
		models,
		loadedModelIds,
		defaultModel: defaultModelId ? `${LMSTUDIO_PROVIDER_ID}/${defaultModelId}` : void 0,
		defaultModelId
	} };
}
async function resolveAppGuidedLmstudioConnection(ctx) {
	const existingProvider = ctx.config.models?.providers?.[LMSTUDIO_PROVIDER_ID];
	const baseUrl = resolveLmstudioInferenceBase(existingProvider?.baseUrl ?? resolveLmstudioSetupDefaultInferenceBaseUrl(ctx.env));
	try {
		const headers = await resolveLmstudioProviderHeaders({
			config: ctx.config,
			env: ctx.env,
			headers: existingProvider?.headers
		});
		const accessValue = await resolveLmstudioConfiguredApiKey({
			config: ctx.config,
			env: ctx.env,
			allowUnresolved: true
		}) ?? ctx.env["LM_API_TOKEN"]?.trim();
		return {
			existingProvider,
			accessValue,
			discoveryRequest: {
				baseUrl,
				apiKey: accessValue ?? "lmstudio-local",
				...headers ? { headers } : {},
				timeoutMs: 5e3
			}
		};
	} catch {
		return null;
	}
}
/** Read-only local discovery plus a success-gated config proposal for guided setup. */
async function prepareAppGuidedLmstudioSetup(ctx) {
	const connection = await resolveAppGuidedLmstudioConnection(ctx);
	if (!connection) return null;
	const { existingProvider, accessValue, discoveryRequest } = connection;
	const { baseUrl, headers } = discoveryRequest;
	const setupDiscovery = await discoverLmstudioSetupModels(discoveryRequest);
	if ("failure" in setupDiscovery) return null;
	const requestedPrefix = `${LMSTUDIO_PROVIDER_ID}/`;
	const requestedModelId = ctx.modelRef?.startsWith(requestedPrefix) ? ctx.modelRef.slice(requestedPrefix.length) : void 0;
	const appGuidedModelIds = collectAppGuidedLmstudioModelIds(setupDiscovery.value.discovery);
	const selectedModelId = requestedModelId ?? selectDefaultLmstudioModelId(setupDiscovery.value.models.filter((model) => appGuidedModelIds.has(model.id)));
	if (!selectedModelId || !appGuidedModelIds.has(selectedModelId) || !setupDiscovery.value.models.some((model) => model.id === selectedModelId)) return null;
	const persistedAccess = accessValue ? existingProvider?.apiKey ?? "LM_API_TOKEN" : shouldUseLmstudioApiKeyPlaceholder({
		hasModels: true,
		resolvedApiKey: void 0,
		hasAuthorizationHeader: hasLmstudioAuthorizationHeader(headers)
	}) ? LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER : void 0;
	return {
		profiles: [],
		defaultModel: `${LMSTUDIO_PROVIDER_ID}/${selectedModelId}`,
		configPatch: { models: {
			mode: ctx.config.models?.mode ?? "merge",
			providers: { [LMSTUDIO_PROVIDER_ID]: buildLmstudioSetupProviderConfig({
				existingProvider,
				baseUrl,
				apiKey: persistedAccess,
				headers: existingProvider?.headers,
				models: setupDiscovery.value.models
			}) }
		} }
	};
}
/** Read-only reachability probe for app-guided setup when no loaded model qualifies. */
async function detectAppGuidedLmstudioAvailability(ctx) {
	const connection = await resolveAppGuidedLmstudioConnection(ctx);
	if (!connection) return false;
	return (await fetchLmstudioModels(connection.discoveryRequest)).reachable;
}
/** Interactive LM Studio setup with connectivity and model-availability checks. */
async function promptAndConfigureLmstudioInteractive(params) {
	const promptText = params.prompter ? params.prompter.text.bind(params.prompter) : params.promptText;
	if (!promptText) throw new Error("LM Studio interactive setup requires a text prompter.");
	const note = params.prompter ? params.prompter.note.bind(params.prompter) : params.note;
	const defaultBaseUrl = resolveLmstudioSetupDefaultBaseUrl();
	const baseUrlRaw = params.suppliedApiKey ? params.config.models?.providers?.["lmstudio"]?.baseUrl ?? defaultBaseUrl : await promptText({
		message: `${LMSTUDIO_PROVIDER_LABEL} base URL`,
		initialValue: defaultBaseUrl,
		placeholder: defaultBaseUrl,
		validate: (value) => value?.trim() ? void 0 : "Required"
	});
	const baseUrl = resolveLmstudioInferenceBase(baseUrlRaw ?? defaultBaseUrl);
	let credentialInput = params.suppliedApiKey;
	let credentialMode;
	const implicitRefMode = params.allowSecretRefPrompt === false && !params.secretInputMode;
	const autoRefEnvKey = process.env[LMSTUDIO_DEFAULT_API_KEY_ENV_VAR]?.trim();
	const apiKey = params.suppliedApiKey ? params.suppliedApiKey : params.prompter && implicitRefMode && autoRefEnvKey ? autoRefEnvKey : params.prompter ? await ensureApiKeyFromEnvOrPrompt({
		config: params.config,
		workspaceDir: params.workspaceDir,
		provider: LMSTUDIO_PROVIDER_ID,
		envLabel: LMSTUDIO_DEFAULT_API_KEY_ENV_VAR,
		promptMessage: `${LMSTUDIO_PROVIDER_LABEL} API key`,
		normalize: (value) => value.trim(),
		validate: () => void 0,
		prompter: params.prompter,
		secretInputMode: params.allowSecretRefPrompt === false ? params.secretInputMode ?? "plaintext" : params.secretInputMode,
		setCredential: async (apiKeyValue, mode) => {
			credentialInput = apiKeyValue;
			credentialMode = mode;
		}
	}) : (await promptText({
		message: `LM Studio API key`,
		placeholder: "sk-... (leave blank if auth is disabled)",
		validate: () => void 0
	}) ?? "").trim();
	const normalizedApiKey = normalizeOptionalSecretInput(apiKey);
	const credentialSource = credentialInput ?? (implicitRefMode && autoRefEnvKey ? `\${LM_API_TOKEN}` : apiKey);
	const credential = (params.prompter ? credentialMode === "ref" || hasConfiguredSecretInput(credentialSource) : normalizedApiKey !== void 0) ? params.prompter ? buildApiKeyCredential(LMSTUDIO_PROVIDER_ID, credentialSource, void 0, params.suppliedApiKey ? { secretInputMode: "plaintext" } : credentialMode ? { secretInputMode: credentialMode } : implicitRefMode && autoRefEnvKey ? { secretInputMode: "ref" } : void 0) : {
		type: "api_key",
		provider: LMSTUDIO_PROVIDER_ID,
		key: normalizedApiKey ?? apiKey
	} : void 0;
	const existingProvider = params.config.models?.providers?.[LMSTUDIO_PROVIDER_ID];
	const persistedHeaders = existingProvider?.headers;
	const resolvedHeaders = await resolveLmstudioProviderHeaders({
		config: params.config,
		env: process.env,
		headers: persistedHeaders
	});
	const hasAuthorizationHeader = hasLmstudioAuthorizationHeader(resolvedHeaders);
	const setupDiscoveryApiKey = normalizedApiKey ?? (shouldUseLmstudioApiKeyPlaceholder({
		hasModels: true,
		resolvedApiKey: void 0,
		hasAuthorizationHeader
	}) ? "lmstudio-local" : void 0);
	const discoverSetupModels = async () => {
		const result = await discoverLmstudioSetupModels({
			baseUrl,
			apiKey: setupDiscoveryApiKey,
			...resolvedHeaders ? { headers: resolvedHeaders } : {},
			timeoutMs: 5e3
		});
		params.signal?.throwIfAborted();
		return result;
	};
	let setupDiscovery = await discoverSetupModels();
	while ("failure" in setupDiscovery) {
		if (params.suppliedApiKey || !params.isRemote || !params.prompter) {
			await note?.(setupDiscovery.failure.noteLines.join("\n"), "LM Studio");
			throw new WizardCancelledError(setupDiscovery.failure.reason);
		}
		if (!setupDiscovery.failure.retryLine) {
			await note?.(setupDiscovery.failure.noteLines.join("\n"), "LM Studio");
			throw new WizardCancelledError(setupDiscovery.failure.reason);
		}
		await note?.([setupDiscovery.failure.noteLines[0], setupDiscovery.failure.retryLine].join("\n"), "LM Studio");
		if (!await params.prompter.confirm({
			message: "Retry this LM Studio connection now?",
			initialValue: true
		})) throw new WizardCancelledError("LM Studio setup cancelled");
		params.signal?.throwIfAborted();
		setupDiscovery = await discoverSetupModels();
	}
	let discoveredModels = setupDiscovery.value.models;
	if (params.prompter && !params.isRemote && !params.suppliedApiKey) {
		const requestedContextWindow = resolvePositiveInteger(await params.prompter.text({
			message: "Preferred context length to load LM Studio models with (optional)",
			placeholder: "e.g. 32768 (leave blank to skip)",
			validate: (value) => value?.trim() ? resolvePositiveInteger(value) ? void 0 : "Enter a positive integer token count" : void 0
		}));
		discoveredModels = applyRequestedContextWindowToAllModels({
			models: discoveredModels,
			discoveryModels: setupDiscovery.value.discovery.models,
			requestedContextWindow
		});
	}
	const allowlistEntries = mergeDiscoveredLmstudioAllowlistEntries({
		existing: params.config.agents?.defaults?.models,
		discoveredModels
	});
	const defaultModel = params.requestedModelId ? `${LMSTUDIO_PROVIDER_ID}/${params.requestedModelId}` : setupDiscovery.value.defaultModel;
	if (params.requestedModelId && !setupDiscovery.value.loadedModelIds.has(params.requestedModelId)) throw new Error(`LM Studio model ${params.requestedModelId} is not loaded at ${baseUrl}. Load it before retrying setup.`);
	const persistedApiKey = resolvePersistedLmstudioApiKey({
		currentApiKey: normalizedApiKey ? existingProvider?.apiKey : void 0,
		explicitAuth: resolveLmstudioProviderAuthMode(normalizedApiKey),
		fallbackApiKey: normalizedApiKey ? "LM_API_TOKEN" : void 0,
		preferFallbackApiKey: true,
		hasModels: discoveredModels.length > 0,
		hasAuthorizationHeader
	}) ?? (normalizedApiKey ? "LM_API_TOKEN" : void 0);
	if (!credential) await removeProviderAuthProfilesWithLock({
		cfg: params.config,
		provider: LMSTUDIO_PROVIDER_ID,
		agentDir: params.agentDir
	});
	return {
		profiles: credential ? [{
			profileId: `${LMSTUDIO_PROVIDER_ID}:default`,
			credential
		}] : [],
		configPatch: {
			agents: { defaults: { models: allowlistEntries } },
			models: {
				mode: params.config.models?.mode ?? "merge",
				providers: { [LMSTUDIO_PROVIDER_ID]: buildLmstudioSetupProviderConfig({
					existingProvider,
					baseUrl,
					apiKey: persistedApiKey,
					headers: persistedHeaders,
					models: discoveredModels
				}) }
			}
		},
		defaultModel
	};
}
async function validateNonInteractiveLmstudioDiscovery(ctx, resetPreflight = false) {
	const customBaseUrl = normalizeOptionalSecretInput(ctx.opts.customBaseUrl);
	const baseUrl = resolveLmstudioInferenceBase(customBaseUrl || resolveLmstudioSetupDefaultInferenceBaseUrl());
	const requestedModelId = normalizeOptionalSecretInput(ctx.opts.customModelId);
	const providerApiKey = normalizeOptionalSecretInput(ctx.opts.lmstudioApiKey);
	const resolved = await ctx.resolveApiKey({
		provider: LMSTUDIO_PROVIDER_ID,
		flagValue: providerApiKey ?? normalizeOptionalSecretInput(ctx.opts.customApiKey),
		flagName: providerApiKey === void 0 ? "--custom-api-key" : "--lmstudio-api-key",
		envVar: LMSTUDIO_DEFAULT_API_KEY_ENV_VAR,
		envVarName: LMSTUDIO_DEFAULT_API_KEY_ENV_VAR,
		required: false
	});
	const existingProvider = ctx.config.models?.providers?.[LMSTUDIO_PROVIDER_ID];
	const persistedHeaders = existingProvider?.headers;
	const resolvedHeaders = await resolveLmstudioProviderHeaders({
		config: ctx.config,
		env: process.env,
		headers: persistedHeaders
	});
	const hasAuthorizationHeader = hasLmstudioAuthorizationHeader(resolvedHeaders);
	const useHeaderOnlyAuth = hasAuthorizationHeader && (!resolved || resolved.source !== "flag");
	const setupDiscoveryApiKey = (useHeaderOnlyAuth ? void 0 : resolved?.key) ?? (shouldUseLmstudioApiKeyPlaceholder({
		hasModels: true,
		resolvedApiKey: void 0,
		hasAuthorizationHeader
	}) ? "lmstudio-local" : void 0);
	if (!setupDiscoveryApiKey && !hasAuthorizationHeader) {
		ctx.runtime.error(`LM Studio API key is required. Set ${LMSTUDIO_DEFAULT_API_KEY_ENV_VAR} or pass --lmstudio-api-key.`);
		ctx.runtime.exit(1);
		return null;
	}
	const setupDiscovery = await discoverLmstudioSetupModels({
		baseUrl,
		apiKey: setupDiscoveryApiKey,
		...resolvedHeaders ? { headers: resolvedHeaders } : {},
		requestedModelId,
		resetPreflight,
		timeoutMs: 5e3
	});
	if ("failure" in setupDiscovery) {
		ctx.runtime.error(setupDiscovery.failure.noteLines.join("\n"));
		ctx.runtime.exit(1);
		return null;
	}
	const discoveredModels = setupDiscovery.value.models;
	const selectedModelId = requestedModelId ?? setupDiscovery.value.defaultModelId;
	const selectedModel = selectedModelId ? discoveredModels.find((model) => model.id === selectedModelId) : void 0;
	const selectedModelLoaded = selectedModelId !== void 0 && setupDiscovery.value.loadedModelIds.has(selectedModelId);
	if (!selectedModelId || !selectedModel || !selectedModelLoaded) {
		const availableModels = discoveredModels.map((model) => model.id).join(", ");
		ctx.runtime.error(requestedModelId && selectedModel && !selectedModelLoaded ? [`LM Studio model ${requestedModelId} is installed but not loaded at ${baseUrl}.`, "Load that model in LM Studio, then re-run setup."].join("\n") : requestedModelId ? [`LM Studio model ${requestedModelId} was not found at ${baseUrl}.`, `Available models: ${availableModels}`].join("\n") : [`LM Studio did not expose a usable default model at ${baseUrl}.`, `Available models: ${availableModels || "(none)"}`].join("\n"));
		ctx.runtime.exit(1);
		return null;
	}
	return {
		baseUrl,
		customBaseUrl,
		discoveredModels,
		existingProvider,
		persistedHeaders,
		resolved,
		resolvedHeaders,
		selectedModelId,
		setupDiscoveryApiKey,
		useHeaderOnlyAuth
	};
}
/** Checks endpoint auth and loaded models without mutating config, profiles, or the server. */
async function validateLmstudioNonInteractive(ctx) {
	return Boolean(await validateNonInteractiveLmstudioDiscovery(ctx, true));
}
/** Non-interactive setup path backed by the shared self-hosted helper. */
async function configureLmstudioNonInteractive(ctx) {
	const validated = await validateNonInteractiveLmstudioDiscovery(ctx);
	if (!validated) return null;
	const { baseUrl, customBaseUrl, discoveredModels, existingProvider, persistedHeaders, resolved, resolvedHeaders, selectedModelId, setupDiscoveryApiKey, useHeaderOnlyAuth } = validated;
	const normalizedCtx = customBaseUrl ? {
		...ctx,
		opts: {
			...ctx.opts,
			customBaseUrl: baseUrl
		}
	} : ctx;
	if (useHeaderOnlyAuth) {
		await removeProviderAuthProfilesWithLock({
			cfg: normalizedCtx.config,
			provider: LMSTUDIO_PROVIDER_ID,
			agentDir: normalizedCtx.agentDir
		});
		const configWithoutStoredLmstudioAuth = stripLmstudioStoredAuthConfig(normalizedCtx.config);
		return applyProviderDefaultModel({
			...configWithoutStoredLmstudioAuth,
			models: {
				...configWithoutStoredLmstudioAuth.models,
				mode: configWithoutStoredLmstudioAuth.models?.mode ?? "merge",
				providers: {
					...configWithoutStoredLmstudioAuth.models?.providers,
					[LMSTUDIO_PROVIDER_ID]: buildLmstudioSetupProviderConfig({
						existingProvider,
						baseUrl,
						headers: persistedHeaders,
						models: discoveredModels
					})
				}
			}
		}, `${LMSTUDIO_PROVIDER_ID}/${selectedModelId}`);
	}
	const resolvedOrSynthetic = resolved ?? (setupDiscoveryApiKey ? {
		key: setupDiscoveryApiKey,
		source: "flag"
	} : null);
	if (!resolvedOrSynthetic) return null;
	const configured = await configureOpenAICompatibleSelfHostedProviderNonInteractive({
		ctx: {
			...normalizedCtx,
			opts: {
				...normalizedCtx.opts,
				customModelId: selectedModelId
			},
			resolveApiKey: async () => resolvedOrSynthetic
		},
		providerId: LMSTUDIO_PROVIDER_ID,
		providerLabel: LMSTUDIO_PROVIDER_LABEL,
		defaultBaseUrl: resolveLmstudioSetupDefaultInferenceBaseUrl(),
		defaultApiKeyEnvVar: LMSTUDIO_DEFAULT_API_KEY_ENV_VAR,
		modelPlaceholder: LMSTUDIO_MODEL_PLACEHOLDER
	});
	if (!configured) return null;
	const sharedProvider = configured.models?.providers?.[LMSTUDIO_PROVIDER_ID];
	const resolvedSyntheticLocalKey = resolvedOrSynthetic.key === LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER;
	const persistedApiKey = resolvePersistedLmstudioApiKey({
		currentApiKey: resolvedSyntheticLocalKey ? void 0 : existingProvider?.apiKey,
		explicitAuth: resolveLmstudioProviderAuthMode(resolvedOrSynthetic.key),
		fallbackApiKey: resolvedSyntheticLocalKey ? LMSTUDIO_LOCAL_API_KEY_PLACEHOLDER : configured.models?.providers?.["lmstudio"]?.apiKey ?? "LM_API_TOKEN",
		preferFallbackApiKey: true,
		hasModels: discoveredModels.length > 0,
		hasAuthorizationHeader: hasLmstudioAuthorizationHeader(resolvedHeaders)
	});
	return {
		...configured,
		models: {
			...configured.models,
			providers: {
				...configured.models?.providers,
				[LMSTUDIO_PROVIDER_ID]: buildLmstudioSetupProviderConfig({
					existingProvider,
					sharedProvider,
					baseUrl,
					apiKey: persistedApiKey,
					headers: persistedHeaders,
					models: discoveredModels
				})
			}
		}
	};
}
async function discoverLmstudioProvider(ctx, options) {
	if (ctx.providerIds && !ctx.providerIds.includes("lmstudio")) return null;
	const explicit = ctx.config.models?.providers?.[LMSTUDIO_PROVIDER_ID];
	const { headers: _headers, auth: explicitAuth, apiKey: _apiKey, ...explicitWithoutHeaders } = explicit ?? {};
	const hasExplicitModels = Array.isArray(explicit?.models) && explicit.models.length > 0;
	const { apiKey, discoveryApiKey, profileId } = ctx.resolveProviderApiKey(LMSTUDIO_PROVIDER_ID);
	let resolvedHeaders;
	let hasAuthorizationHeader;
	let configuredDiscoveryApiKey;
	try {
		resolvedHeaders = await resolveLmstudioProviderHeaders({
			config: ctx.config,
			env: ctx.env,
			headers: explicit?.headers
		});
		hasAuthorizationHeader = hasLmstudioAuthorizationHeader(resolvedHeaders);
		configuredDiscoveryApiKey = await resolveLmstudioConfiguredApiKey({
			config: ctx.config,
			env: ctx.env,
			allowUnresolved: hasAuthorizationHeader || Boolean(discoveryApiKey)
		});
	} catch (error) {
		if (error instanceof LmstudioConfigResolutionError) return null;
		throw error;
	}
	const resolvedDiscoveryApiKey = hasAuthorizationHeader ? void 0 : discoveryApiKey ?? configuredDiscoveryApiKey;
	const resolvedApiKey = apiKey ?? explicit?.apiKey;
	const baseUrl = resolveLmstudioInferenceBase(explicit?.baseUrl);
	const quiet = !apiKey && !explicit && !resolvedDiscoveryApiKey;
	const run = async () => {
		const models = hasExplicitModels ? explicit.models : await discoverLmstudioModels({
			baseUrl,
			apiKey: resolvedDiscoveryApiKey ?? "",
			headers: resolvedHeaders,
			quiet,
			...!quiet && options ? options : {}
		});
		if (models.length === 0 && (options ? quiet : !apiKey && !explicit?.apiKey)) return null;
		const persistedApiKey = resolvePersistedLmstudioApiKey({
			currentApiKey: resolvedApiKey,
			explicitAuth,
			fallbackApiKey: LMSTUDIO_DEFAULT_API_KEY_ENV_VAR,
			hasModels: models.length > 0,
			hasAuthorizationHeader
		});
		const persistedAuth = resolveLmstudioProviderAuthMode(persistedApiKey);
		return { provider: {
			...explicitWithoutHeaders,
			baseUrl,
			api: explicit?.api ?? "openai-completions",
			...resolvedHeaders ? { headers: resolvedHeaders } : {},
			...persistedApiKey ? { apiKey: persistedApiKey } : {},
			...persistedAuth ? { auth: persistedAuth } : {},
			models
		} };
	};
	return options && !hasExplicitModels ? await runLiveProviderCatalog({
		providerId: LMSTUDIO_PROVIDER_ID,
		profileId: !hasAuthorizationHeader && discoveryApiKey && !isNonSecretApiKeyMarker(discoveryApiKey) ? profileId : void 0,
		run
	}) : await run();
}
async function prepareLmstudioDynamicModel(ctx) {
	const baseUrl = resolveLmstudioInferenceBase(ctx.providerConfig?.baseUrl);
	const { apiKey, headers } = await resolveLmstudioRequestContext({
		config: ctx.config,
		agentDir: ctx.agentDir,
		env: process.env,
		providerHeaders: ctx.providerConfig?.headers
	});
	const model = (await discoverLmstudioModels({
		baseUrl,
		apiKey: apiKey ?? "",
		headers,
		quiet: true
	})).find((candidate) => candidate.id === ctx.modelId);
	if (!model) return;
	return {
		...model,
		provider: LMSTUDIO_PROVIDER_ID,
		api: ctx.providerConfig?.api ?? "openai-completions",
		baseUrl,
		input: model.input.filter((entry) => entry === "text" || entry === "image")
	};
}
//#endregion
export { prepareLmstudioDynamicModel as a, prepareAppGuidedLmstudioSetup as i, detectAppGuidedLmstudioAvailability as n, promptAndConfigureLmstudioInteractive as o, discoverLmstudioProvider as r, validateLmstudioNonInteractive as s, configureLmstudioNonInteractive as t };
