import { d as asPositiveSafeInteger, h as finiteSecondsToTimerSafeMilliseconds, p as clampPositiveTimerTimeoutMs } from "../../number-coercion-CkhMiRw8.mjs";
import { d as toErrorObject } from "../../error-coercion-BwMr25F8.mjs";
import { c as isRecord, o as asRecord } from "../../record-coerce-TIsquoVR.mjs";
import { n as filterStringEntries, y as uniqueStrings } from "../../string-normalization-D6DKCpwE.mjs";
import { o as racePromiseWithAbortSignal } from "../../src-Bzfi3cQM.mjs";
import { t as createSubsystemLogger } from "../../subsystem-mStysHHC.mjs";
import { n as createLazyRuntimeMethodBinder, r as createLazyRuntimeModule } from "../../lazy-runtime-CJrzFzqU.mjs";
import { t as normalizeOptionalSecretInput } from "../../normalize-secret-input-DBJvdk-L.mjs";
import { S as createAssistantMessageEventStream } from "../../llm-YCnSGJtn.mjs";
import { n as CUSTOM_LOCAL_AUTH_MARKER } from "../../model-auth-markers-Clx9vUna.mjs";
import { h as ssrfPolicyFromHttpBaseUrlAllowedHostname } from "../../ssrf-K50Tjeok.mjs";
import "../../error-runtime-ikopZs5O.mjs";
import "../../string-coerce-runtime-BbIJhy7G.mjs";
import "../../number-runtime-D3v2w3D4.mjs";
import "../../time-runtime-D6GzEQJ4.mjs";
import { i as streamSimple } from "../../stream-NAsW_bVF.mjs";
import { t as buildAssistantMessage } from "../../stream-message-shared-CYuIJ_XF.mjs";
import { f as createOpenAICompatibleCompletionsThinkingOffWrapper, m as createPlainTextToolCallCompatWrapper } from "../../provider-stream-shared-Ond8mlRx.mjs";
import { t as definePluginEntry } from "../../plugin-entry-D4OPnFRH.mjs";
import "../../ssrf-runtime-z2wN0VZP.mjs";
import "../../logging-core-CsXmxYo2.mjs";
import "../../provider-auth-JCvgbsWg.mjs";
import { s as createEmptyTransportUsage } from "../../provider-transport-runtime-DyX8vIBV.mjs";
import { r as buildProviderToolCompatFamilyHooks } from "../../provider-tools-DynDHTtQ.mjs";
import { C as normalizeLmstudioModelKey, E as resolveLmstudioInferenceBase, H as LMSTUDIO_PROVIDER_ID, M as LMSTUDIO_DEFAULT_API_KEY_ENV_VAR, U as LMSTUDIO_PROVIDER_LABEL, a as prepareLmstudioModelForInference, f as resolveLmstudioRuntimeApiKey, m as resolveLmstudioProviderAuthMode, p as hasLmstudioAuthorizationHeader, s as buildLmstudioAuthHeaders, t as LmstudioModelLoadError, u as resolveLmstudioProviderHeaders, v as getUnlistedLmstudioConfiguredModelIds, w as normalizeLmstudioProviderConfig, x as normalizeLmstudioConfiguredCatalogEntries } from "../../models.fetch-B9hVA3qO.mjs";
import { t as lmstudioMemoryEmbeddingProviderAdapter } from "../../memory-embedding-adapter-BRc0eRbp.mjs";
import { createHash } from "node:crypto";
//#region extensions/lmstudio/provider-discovery.ts
var provider_discovery_default = {
	id: LMSTUDIO_PROVIDER_ID,
	label: "LM Studio",
	docsPath: "/providers/lmstudio",
	envVars: [LMSTUDIO_DEFAULT_API_KEY_ENV_VAR],
	auth: [],
	catalog: {
		order: "late",
		getUnlistedConfiguredModelIds: getUnlistedLmstudioConfiguredModelIds,
		run: async (ctx) => {
			const { discoverLmstudioProvider } = await import("../../catalog-lIqiO1uC.mjs");
			return await discoverLmstudioProvider(ctx, { discoveryMode: "strict" });
		}
	},
	resolveSyntheticAuth: ({ providerConfig }) => {
		if (!providerConfig || resolveLmstudioProviderAuthMode(providerConfig.apiKey) || hasLmstudioAuthorizationHeader(providerConfig.headers)) return;
		return {
			apiKey: CUSTOM_LOCAL_AUTH_MARKER,
			source: "models.providers.lmstudio (synthetic local key)",
			mode: "api-key"
		};
	}
};
//#endregion
//#region extensions/lmstudio/src/stream.ts
const log = createSubsystemLogger("extensions/lmstudio/stream");
const preloadInFlight = /* @__PURE__ */ new Map();
const preloadCooldown = /* @__PURE__ */ new Map();
const PRELOAD_BACKOFF_BASE_MS = 5e3;
const PRELOAD_BACKOFF_MAX_MS = 3e5;
function recordPreloadFailure(preloadKey, now, error) {
	const existing = preloadCooldown.get(preloadKey);
	const consecutiveFailures = (existing?.consecutiveFailures ?? 0) + 1;
	const persistedResolvedModelKey = error instanceof LmstudioModelLoadError ? error.resolvedModelKey : existing?.resolvedModelKey;
	const entry = {
		consecutiveFailures,
		error: existing?.error instanceof LmstudioModelLoadError && existing.error.requiredContextLength !== void 0 ? existing.error : error,
		untilMs: now + Math.min(PRELOAD_BACKOFF_MAX_MS, PRELOAD_BACKOFF_BASE_MS * 2 ** Math.max(0, consecutiveFailures - 1)),
		...persistedResolvedModelKey ? { resolvedModelKey: persistedResolvedModelKey } : {}
	};
	preloadCooldown.set(preloadKey, entry);
	return entry;
}
function withLmstudioUsageCompat(model) {
	const compat = model.compat && typeof model.compat === "object" ? model.compat : {};
	const unsupportedToolSchemaKeywords = "unsupportedToolSchemaKeywords" in compat ? filterStringEntries(compat.unsupportedToolSchemaKeywords) : [];
	const normalizedCompat = {
		...compat,
		supportsUsageInStreaming: true,
		unsupportedToolSchemaKeywords: uniqueStrings([...unsupportedToolSchemaKeywords, "pattern"])
	};
	return {
		...model,
		compat: normalizedCompat
	};
}
async function resolveLmstudioPreloadRequest(params) {
	const providerHeaders = {
		...(params.ctx.config?.models?.providers?.[LMSTUDIO_PROVIDER_ID])?.headers,
		...params.modelHeaders
	};
	const runtimeApiKey = typeof params.options?.apiKey === "string" && params.options.apiKey.trim().length > 0 ? params.options.apiKey.trim() : void 0;
	const headers = await resolveLmstudioProviderHeaders({
		config: params.ctx.config,
		headers: providerHeaders
	});
	const configuredApiKey = runtimeApiKey !== void 0 ? void 0 : await resolveLmstudioRuntimeApiKey({
		config: params.ctx.config,
		agentDir: params.ctx.agentDir,
		headers: providerHeaders
	});
	return {
		baseUrl: params.baseUrl,
		apiKey: runtimeApiKey ?? configuredApiKey,
		headers,
		ssrfPolicy: ssrfPolicyFromHttpBaseUrlAllowedHostname(params.baseUrl),
		modelKey: params.modelKey,
		requestedContextLength: params.requestedContextLength,
		timeoutMs: params.timeoutMs ?? 12e4
	};
}
function wrapLmstudioInferencePreload(ctx) {
	const underlying = ctx.streamFn ?? streamSimple;
	const streamWithThinkingLevel = createOpenAICompatibleCompletionsThinkingOffWrapper(createPlainTextToolCallCompatWrapper(underlying), ctx.thinkingLevel);
	return (model, context, options) => {
		if (model.provider !== "lmstudio") return underlying(model, context, options);
		const modelKey = normalizeLmstudioModelKey(model.id);
		if (!modelKey) return underlying(model, context, options);
		options?.signal?.throwIfAborted();
		const providerConfig = ctx.config?.models?.providers?.[LMSTUDIO_PROVIDER_ID];
		if (asRecord(providerConfig?.params).preload === false) return streamWithThinkingLevel(withLmstudioUsageCompat(model), context, options);
		const providerBaseUrl = providerConfig?.baseUrl;
		const resolvedBaseUrl = resolveLmstudioInferenceBase(typeof model.baseUrl === "string" ? model.baseUrl : providerBaseUrl);
		const requestedContextLength = asPositiveSafeInteger(model.contextTokens) ?? asPositiveSafeInteger(model.contextWindow);
		return (async () => {
			let request;
			try {
				request = await resolveLmstudioPreloadRequest({
					baseUrl: resolvedBaseUrl,
					modelKey,
					requestedContextLength,
					timeoutMs: clampPositiveTimerTimeoutMs(options?.timeoutMs ?? asRecord(model).requestTimeoutMs) ?? finiteSecondsToTimerSafeMilliseconds(providerConfig?.timeoutSeconds),
					options,
					ctx,
					modelHeaders: isRecord(model.headers) ? model.headers : void 0
				});
			} catch (error) {
				options?.signal?.throwIfAborted();
				log.warn(`LM Studio inference preload failed for "${modelKey}": ${String(error)}`);
				return streamWithThinkingLevel(withLmstudioUsageCompat(model), context, options);
			}
			options?.signal?.throwIfAborted();
			const preloadKey = createHash("sha256").update(JSON.stringify([
				resolvedBaseUrl,
				modelKey,
				requestedContextLength ?? null,
				ctx.agentDir ?? null,
				request.timeoutMs,
				[...new Headers(buildLmstudioAuthHeaders(request)).entries()]
			])).digest("hex");
			const cooldown = preloadCooldown.get(preloadKey);
			const cooldownEntry = cooldown && cooldown.untilMs > Date.now() ? cooldown : void 0;
			const preloadPromise = preloadInFlight.get(preloadKey) ?? (cooldownEntry ? void 0 : (() => {
				const created = prepareLmstudioModelForInference(request).then((preparedModel) => {
					preloadCooldown.delete(preloadKey);
					return preparedModel;
				}, (error) => {
					recordPreloadFailure(preloadKey, Date.now(), error);
					throw error;
				}).finally(() => {
					preloadInFlight.delete(preloadKey);
				});
				preloadInFlight.set(preloadKey, created);
				return created;
			})());
			let preparedModel;
			let failure = cooldownEntry;
			if (preloadPromise) try {
				preparedModel = await racePromiseWithAbortSignal(preloadPromise, options?.signal, (signal) => toErrorObject(signal.reason, "LM Studio preload aborted"));
			} catch {
				options?.signal?.throwIfAborted();
				failure = preloadCooldown.get(preloadKey);
			}
			if (failure) {
				const error = failure.error;
				if (preloadPromise) log.warn(`LM Studio inference preload failed for "${modelKey}": ${String(error)}`);
				if (error instanceof LmstudioModelLoadError && error.requiredContextLength !== void 0) {
					const stream = createAssistantMessageEventStream();
					stream.push({
						type: "error",
						reason: "error",
						error: {
							...buildAssistantMessage({
								model,
								content: [],
								stopReason: "error",
								usage: createEmptyTransportUsage()
							}),
							errorMessage: error.message,
							errorCode: "model_load_failed",
							errorBody: JSON.stringify({ requestedContextLength: error.requiredContextLength })
						}
					});
					stream.end();
					return stream;
				}
				const resolvedModelKey = failure.resolvedModelKey;
				preparedModel = resolvedModelKey ? { modelKey: resolvedModelKey } : void 0;
			}
			const modelId = preparedModel?.modelKey;
			const streamModel = modelId && modelId !== model.id ? {
				...model,
				id: modelId
			} : model;
			const instanceId = preparedModel?.instanceId;
			return await streamWithThinkingLevel(withLmstudioUsageCompat(streamModel), context, instanceId ? {
				...options,
				async onPayload(payload, payloadModel) {
					asRecord(payload).model = instanceId;
					const replacement = await options?.onPayload?.(payload, payloadModel);
					asRecord(replacement ?? payload).model = instanceId;
					return replacement;
				}
			} : options);
		})();
	};
}
//#endregion
//#region extensions/lmstudio/index.ts
const PROVIDER_ID = "lmstudio";
const loadSetup = createLazyRuntimeModule(() => import("../../setup-CGxleAjA.mjs"));
const setupMethod = createLazyRuntimeMethodBinder(loadSetup);
function resolveLmstudioAugmentedCatalogEntries(config) {
	return normalizeLmstudioConfiguredCatalogEntries(config?.models?.providers?.lmstudio?.models).map((entry) => Object.assign({}, entry, {
		provider: PROVIDER_ID,
		name: entry.name ?? entry.id,
		compat: {
			...entry.compat,
			supportsUsageInStreaming: true
		}
	}));
}
var lmstudio_default = definePluginEntry({
	id: PROVIDER_ID,
	name: "LM Studio Provider",
	description: "Bundled LM Studio provider plugin",
	register(api) {
		api.registerEmbeddingProvider(lmstudioMemoryEmbeddingProviderAdapter);
		api.registerProvider({
			...provider_discovery_default,
			auth: [{
				id: "custom",
				label: LMSTUDIO_PROVIDER_LABEL,
				hint: "Connect to a running LM Studio server and use an already loaded model",
				kind: "custom",
				appGuidedSetup: {
					detectAvailability: setupMethod((setup) => setup.detectAppGuidedLmstudioAvailability),
					detect: async (ctx) => {
						const result = await (await loadSetup()).prepareAppGuidedLmstudioSetup(ctx);
						if (!result?.defaultModel) return null;
						const provider = result.configPatch?.models?.providers?.[PROVIDER_ID];
						return {
							modelRef: result.defaultModel,
							detail: `${result.defaultModel.slice(`${PROVIDER_ID}/`.length)} at ${provider?.baseUrl ?? "LM Studio"}`
						};
					},
					prepare: setupMethod((setup) => setup.prepareAppGuidedLmstudioSetup)
				},
				run: async (ctx) => {
					const providerSetup = await loadSetup();
					const suppliedApiKey = ctx.opts?.tokenProvider === PROVIDER_ID ? normalizeOptionalSecretInput(ctx.opts.token) : void 0;
					return await providerSetup.promptAndConfigureLmstudioInteractive({
						config: ctx.config,
						agentDir: ctx.agentDir,
						workspaceDir: ctx.workspaceDir,
						prompter: ctx.prompter,
						secretInputMode: ctx.secretInputMode,
						allowSecretRefPrompt: ctx.allowSecretRefPrompt,
						isRemote: ctx.isRemote,
						signal: ctx.signal,
						...suppliedApiKey ? {
							suppliedApiKey,
							requestedModelId: normalizeOptionalSecretInput(ctx.opts?.customModelId)
						} : {}
					});
				},
				validateNonInteractive: setupMethod((setup) => setup.validateLmstudioNonInteractive),
				runNonInteractive: setupMethod((setup) => setup.configureLmstudioNonInteractive)
			}],
			shouldDeferSyntheticProfileAuth: ({ resolvedApiKey }) => resolvedApiKey?.trim() === "lmstudio-local" || resolvedApiKey?.trim() === "custom-local",
			normalizeConfig: ({ providerConfig }) => normalizeLmstudioProviderConfig(providerConfig),
			prepareDynamicModel: setupMethod((setup) => setup.prepareLmstudioDynamicModel),
			augmentModelCatalog: (ctx) => resolveLmstudioAugmentedCatalogEntries(ctx.config),
			wrapStreamFn: wrapLmstudioInferencePreload,
			...buildProviderToolCompatFamilyHooks("llamacpp-gbnf"),
			wizard: {
				setup: {
					choiceId: PROVIDER_ID,
					choiceLabel: "LM Studio",
					choiceHint: "Connect to a running LM Studio server and use an already loaded model",
					groupId: PROVIDER_ID,
					groupLabel: "LM Studio",
					groupHint: "Self-hosted open-weight models",
					methodId: "custom"
				},
				modelPicker: {
					label: "LM Studio (custom)",
					hint: "Detect models from LM Studio /api/v1/models",
					methodId: "custom"
				}
			}
		});
	}
});
//#endregion
export { lmstudio_default as default };
