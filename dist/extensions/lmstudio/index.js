import { d as asPositiveSafeInteger } from "../../number-coercion-CLj0HTDM.mjs";
import { o as asRecord } from "../../record-coerce-DItp3I4t.mjs";
import { y as uniqueStrings } from "../../string-normalization-_gRhJUDw.mjs";
import { t as createSubsystemLogger } from "../../subsystem-DleLyu58.mjs";
import { y as ssrfPolicyFromHttpBaseUrlAllowedHostname } from "../../ssrf-BQRtcdBp.mjs";
import { t as normalizeOptionalSecretInput } from "../../normalize-secret-input-Df_qhWv_.mjs";
import { n as CUSTOM_LOCAL_AUTH_MARKER } from "../../model-auth-markers-BfYDKFYI.mjs";
import "../../llm-CLV5ZXaS.mjs";
import "../../string-coerce-runtime-C_MKhRVt.mjs";
import { i as streamSimple } from "../../stream-BDeJVJpD.mjs";
import { f as createPlainTextToolCallCompatWrapper, u as createOpenAICompatibleCompletionsThinkingOffWrapper } from "../../provider-stream-shared-CuBHNQvM.mjs";
import { t as definePluginEntry } from "../../plugin-entry-BOulgRcx.mjs";
import "../../ssrf-runtime-Darh53Ay.mjs";
import "../../logging-core-PsFqpLw0.mjs";
import "../../provider-auth-eHeoP8se.mjs";
import { r as buildProviderToolCompatFamilyHooks } from "../../provider-tools-BDV45rRZ.mjs";
import { B as LMSTUDIO_PROVIDER_LABEL, S as normalizeLmstudioProviderConfig, b as normalizeLmstudioConfiguredCatalogEntries, d as resolveLmstudioRuntimeApiKey, g as shouldUseLmstudioSyntheticAuth, i as prepareLmstudioModelForInference, k as LMSTUDIO_DEFAULT_API_KEY_ENV_VAR, l as resolveLmstudioProviderHeaders, w as resolveLmstudioInferenceBase, z as LMSTUDIO_PROVIDER_ID } from "../../models.fetch-BKIrnKDJ.mjs";
import { t as lmstudioMemoryEmbeddingProviderAdapter } from "../../memory-embedding-adapter-DhZRvRe1.mjs";
//#region extensions/lmstudio/src/stream.ts
const log = createSubsystemLogger("extensions/lmstudio/stream");
const preloadInFlight = /* @__PURE__ */ new Map();
const preloadCooldown = /* @__PURE__ */ new Map();
const PRELOAD_BACKOFF_BASE_MS = 5e3;
const PRELOAD_BACKOFF_MAX_MS = 3e5;
function computePreloadBackoffMs(consecutiveFailures) {
	const exponent = Math.max(0, consecutiveFailures - 1);
	const raw = PRELOAD_BACKOFF_BASE_MS * 2 ** exponent;
	return Math.min(PRELOAD_BACKOFF_MAX_MS, raw);
}
function recordPreloadSuccess(preloadKey) {
	preloadCooldown.delete(preloadKey);
}
function recordPreloadFailure(preloadKey, now, resolvedModelKey) {
	const existing = preloadCooldown.get(preloadKey);
	const consecutiveFailures = (existing?.consecutiveFailures ?? 0) + 1;
	const persistedResolvedModelKey = resolvedModelKey ?? existing?.resolvedModelKey;
	const entry = {
		consecutiveFailures,
		untilMs: now + computePreloadBackoffMs(consecutiveFailures),
		...persistedResolvedModelKey ? { resolvedModelKey: persistedResolvedModelKey } : {}
	};
	preloadCooldown.set(preloadKey, entry);
	return entry;
}
function isPreloadCoolingDown(preloadKey, now) {
	const entry = preloadCooldown.get(preloadKey);
	if (!entry) return;
	if (entry.untilMs <= now) return;
	return entry;
}
function normalizeLmstudioModelKey(modelId) {
	const trimmed = modelId.trim();
	if (trimmed.toLowerCase().startsWith("lmstudio/")) return trimmed.slice(9).trim();
	return trimmed;
}
function resolveRequestedContextLength(model) {
	const contextTokens = asPositiveSafeInteger(model.contextTokens);
	if (contextTokens !== void 0) return contextTokens;
	const contextWindow = asPositiveSafeInteger(model.contextWindow);
	if (contextWindow !== void 0) return contextWindow;
}
function resolveModelHeaders(model) {
	if (!model.headers || typeof model.headers !== "object" || Array.isArray(model.headers)) return;
	return model.headers;
}
function shouldPreloadLmstudioModels(value) {
	const providerConfig = asRecord(value);
	return asRecord(providerConfig.params).preload !== false;
}
function withLmstudioUsageCompat(model) {
	const compat = model.compat && typeof model.compat === "object" ? model.compat : {};
	const unsupportedToolSchemaKeywords = "unsupportedToolSchemaKeywords" in compat && Array.isArray(compat.unsupportedToolSchemaKeywords) ? compat.unsupportedToolSchemaKeywords.filter((keyword) => typeof keyword === "string") : [];
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
function withLmstudioResolvedModelKey(model, resolvedModelKey) {
	if (!resolvedModelKey || model.id === resolvedModelKey) return model;
	return {
		...model,
		id: resolvedModelKey
	};
}
function resolveLmstudioModelKeyFromError(error) {
	let current = error;
	const seen = /* @__PURE__ */ new Set();
	while (current && typeof current === "object" && !seen.has(current)) {
		seen.add(current);
		const record = current;
		const resolvedModelKey = typeof record.resolvedModelKey === "string" ? record.resolvedModelKey.trim() : "";
		if (resolvedModelKey) return resolvedModelKey;
		current = record.cause;
	}
}
function createPreloadKey(params) {
	return `${params.baseUrl}::${params.modelKey}::${params.requestedContextLength ?? "default"}`;
}
function toLmstudioPreloadError(reason, message) {
	return reason instanceof Error ? reason : new Error(message, { cause: reason });
}
function waitForLmstudioPreload(preload, signal) {
	if (!signal) return preload;
	if (signal.aborted) return Promise.reject(toLmstudioPreloadError(signal.reason, "LM Studio preload aborted"));
	return new Promise((resolve, reject) => {
		const onAbort = () => reject(toLmstudioPreloadError(signal.reason, "LM Studio preload aborted"));
		signal.addEventListener("abort", onAbort, { once: true });
		preload.then((modelKey) => {
			signal.removeEventListener("abort", onAbort);
			resolve(modelKey);
		}, (error) => {
			signal.removeEventListener("abort", onAbort);
			reject(toLmstudioPreloadError(error, "LM Studio model preload failed"));
		});
	});
}
async function ensureLmstudioModelLoadedBestEffort(params) {
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
	return await prepareLmstudioModelForInference({
		baseUrl: params.baseUrl,
		apiKey: runtimeApiKey ?? configuredApiKey,
		headers,
		ssrfPolicy: ssrfPolicyFromHttpBaseUrlAllowedHostname(params.baseUrl),
		modelKey: params.modelKey,
		requestedContextLength: params.requestedContextLength
	});
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
		if (!shouldPreloadLmstudioModels(providerConfig)) return streamWithThinkingLevel(withLmstudioUsageCompat(model), context, options);
		const providerBaseUrl = providerConfig?.baseUrl;
		const resolvedBaseUrl = resolveLmstudioInferenceBase(typeof model.baseUrl === "string" ? model.baseUrl : providerBaseUrl);
		const requestedContextLength = resolveRequestedContextLength(model);
		const preloadKey = createPreloadKey({
			baseUrl: resolvedBaseUrl,
			modelKey,
			requestedContextLength
		});
		const cooldownEntry = isPreloadCoolingDown(preloadKey, Date.now());
		const preloadPromise = preloadInFlight.get(preloadKey) ?? (cooldownEntry ? void 0 : (() => {
			const created = ensureLmstudioModelLoadedBestEffort({
				baseUrl: resolvedBaseUrl,
				modelKey,
				requestedContextLength,
				options,
				ctx,
				modelHeaders: resolveModelHeaders(model)
			}).then((preparedModel) => {
				recordPreloadSuccess(preloadKey);
				return preparedModel;
			}, (error) => {
				const resolvedModelKey = resolveLmstudioModelKeyFromError(error);
				const entry = recordPreloadFailure(preloadKey, Date.now(), resolvedModelKey);
				throw Object.assign(/* @__PURE__ */ new Error("preload-failed"), {
					cause: error,
					consecutiveFailures: entry.consecutiveFailures,
					cooldownMs: entry.untilMs - Date.now(),
					resolvedModelKey
				});
			}).finally(() => {
				preloadInFlight.delete(preloadKey);
			});
			preloadInFlight.set(preloadKey, created);
			return created;
		})());
		return (async () => {
			let preparedModel;
			if (preloadPromise) try {
				preparedModel = await waitForLmstudioPreload(preloadPromise, options?.signal);
			} catch (error) {
				options?.signal?.throwIfAborted();
				const annotated = error;
				const resolvedModelKey = resolveLmstudioModelKeyFromError(error);
				preparedModel = resolvedModelKey ? { modelKey: resolvedModelKey } : void 0;
				const cause = annotated.cause ?? error;
				const failures = annotated.consecutiveFailures ?? 1;
				const cooldownSec = Math.max(0, Math.round((annotated.cooldownMs ?? 0) / 1e3));
				log.warn(`LM Studio inference preload failed for "${modelKey}" (${failures} consecutive failure${failures === 1 ? "" : "s"}, next preload attempt skipped for ~${cooldownSec}s); continuing without preload: ${String(cause)}`);
			}
			else if (cooldownEntry) {
				const resolvedModelKey = cooldownEntry.resolvedModelKey;
				preparedModel = resolvedModelKey ? { modelKey: resolvedModelKey } : void 0;
				log.debug(`LM Studio inference preload for "${modelKey}" skipped while backoff active (${cooldownEntry.consecutiveFailures} prior failures)`);
			}
			const streamModel = withLmstudioResolvedModelKey(model, preparedModel?.modelKey);
			const instanceId = preparedModel?.instanceId;
			const stream = streamWithThinkingLevel(withLmstudioUsageCompat(streamModel), context, instanceId ? {
				...options,
				async onPayload(payload, payloadModel) {
					asRecord(payload).model = instanceId;
					const replacement = await options?.onPayload?.(payload, payloadModel);
					asRecord(replacement ?? payload).model = instanceId;
					return replacement;
				}
			} : options);
			return stream instanceof Promise ? await stream : stream;
		})();
	};
}
//#endregion
//#region extensions/lmstudio/index.ts
const PROVIDER_ID = "lmstudio";
function resolveLmstudioAugmentedCatalogEntries(config) {
	if (!config) return [];
	return normalizeLmstudioConfiguredCatalogEntries(config.models?.providers?.lmstudio?.models).map((entry) => ({
		provider: PROVIDER_ID,
		id: entry.id,
		name: entry.name ?? entry.id,
		compat: {
			...entry.compat,
			supportsUsageInStreaming: true
		},
		contextWindow: entry.contextWindow,
		contextTokens: entry.contextTokens,
		reasoning: entry.reasoning,
		input: entry.input
	}));
}
/** Lazily loads setup helpers so provider wiring stays lightweight at startup. */
async function loadProviderSetup() {
	return await import("../../setup-BwOaGb_S.mjs");
}
var lmstudio_default = definePluginEntry({
	id: PROVIDER_ID,
	name: "LM Studio Provider",
	description: "Bundled LM Studio provider plugin",
	register(api) {
		api.registerEmbeddingProvider(lmstudioMemoryEmbeddingProviderAdapter);
		api.registerProvider({
			id: PROVIDER_ID,
			label: "LM Studio",
			docsPath: "/providers/lmstudio",
			envVars: [LMSTUDIO_DEFAULT_API_KEY_ENV_VAR],
			auth: [{
				id: "custom",
				label: LMSTUDIO_PROVIDER_LABEL,
				hint: "Connect to a running LM Studio server and use an already loaded model",
				kind: "custom",
				appGuidedSetup: {
					detectAvailability: async (ctx) => {
						return await (await loadProviderSetup()).detectAppGuidedLmstudioAvailability(ctx);
					},
					detect: async (ctx) => {
						const result = await (await loadProviderSetup()).prepareAppGuidedLmstudioSetup(ctx);
						if (!result?.defaultModel) return null;
						const provider = result.configPatch?.models?.providers?.[PROVIDER_ID];
						return {
							modelRef: result.defaultModel,
							detail: `${result.defaultModel.slice(`${PROVIDER_ID}/`.length)} at ${provider?.baseUrl ?? "LM Studio"}`
						};
					},
					prepare: async (ctx) => {
						return await (await loadProviderSetup()).prepareAppGuidedLmstudioSetup(ctx);
					}
				},
				run: async (ctx) => {
					const providerSetup = await loadProviderSetup();
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
				validateNonInteractive: async (ctx) => {
					return await (await loadProviderSetup()).validateLmstudioNonInteractive(ctx);
				},
				runNonInteractive: async (ctx) => {
					return await (await loadProviderSetup()).configureLmstudioNonInteractive(ctx);
				}
			}],
			catalog: {
				order: "late",
				run: async (ctx) => {
					return await (await loadProviderSetup()).discoverLmstudioProvider(ctx, { discoveryMode: "strict" });
				}
			},
			resolveSyntheticAuth: ({ providerConfig }) => {
				if (!shouldUseLmstudioSyntheticAuth(providerConfig)) return;
				return {
					apiKey: CUSTOM_LOCAL_AUTH_MARKER,
					source: "models.providers.lmstudio (synthetic local key)",
					mode: "api-key"
				};
			},
			shouldDeferSyntheticProfileAuth: ({ resolvedApiKey }) => resolvedApiKey?.trim() === "lmstudio-local" || resolvedApiKey?.trim() === "custom-local",
			normalizeConfig: ({ providerConfig }) => normalizeLmstudioProviderConfig(providerConfig),
			prepareDynamicModel: async (ctx) => {
				return await (await loadProviderSetup()).prepareLmstudioDynamicModel(ctx);
			},
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
