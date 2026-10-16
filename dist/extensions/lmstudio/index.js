import { d as asPositiveSafeInteger } from "../../number-coercion-CuVhdCBs.mjs";
import { n as createLazyRuntimeMethodBinder, r as createLazyRuntimeModule } from "../../lazy-runtime-CJrzFzqU.mjs";
import { c as isRecord, o as asRecord } from "../../record-coerce-TIsquoVR.mjs";
import { n as filterStringEntries, y as uniqueStrings } from "../../string-normalization-CECOqf64.mjs";
import { t as createSubsystemLogger } from "../../subsystem-I-uqdx4f.mjs";
import "../../llm--QylqK5V.mjs";
import { h as ssrfPolicyFromHttpBaseUrlAllowedHostname } from "../../ssrf-v45DW-yR.mjs";
import { t as normalizeOptionalSecretInput } from "../../normalize-secret-input-DBJvdk-L.mjs";
import { n as CUSTOM_LOCAL_AUTH_MARKER } from "../../model-auth-markers-Cuz_bq6T.mjs";
import "../../string-coerce-runtime-50qKeWeL.mjs";
import { i as streamSimple } from "../../stream-4ZQq1Iyd.mjs";
import { d as createOpenAICompatibleCompletionsThinkingOffWrapper, p as createPlainTextToolCallCompatWrapper } from "../../provider-stream-shared-D8q3R1a-.mjs";
import { t as definePluginEntry } from "../../plugin-entry-2l_2QeB2.mjs";
import "../../ssrf-runtime-BzkFo_VJ.mjs";
import "../../logging-core-LMmGpAHM.mjs";
import "../../provider-auth-C3BBF7yn.mjs";
import { r as buildProviderToolCompatFamilyHooks } from "../../provider-tools-DajrfQK1.mjs";
import { A as LMSTUDIO_DEFAULT_API_KEY_ENV_VAR, B as LMSTUDIO_PROVIDER_ID, S as normalizeLmstudioProviderConfig, V as LMSTUDIO_PROVIDER_LABEL, b as normalizeLmstudioConfiguredCatalogEntries, d as resolveLmstudioRuntimeApiKey, g as shouldUseLmstudioSyntheticAuth, i as prepareLmstudioModelForInference, l as resolveLmstudioProviderHeaders, w as resolveLmstudioInferenceBase } from "../../models.fetch-CSolZJOV.mjs";
import { t as lmstudioMemoryEmbeddingProviderAdapter } from "../../memory-embedding-adapter-BZKbJzsu.mjs";
//#region extensions/lmstudio/src/stream.ts
const log = createSubsystemLogger("extensions/lmstudio/stream");
const preloadInFlight = /* @__PURE__ */ new Map();
const preloadCooldown = /* @__PURE__ */ new Map();
const PRELOAD_BACKOFF_BASE_MS = 5e3;
const PRELOAD_BACKOFF_MAX_MS = 3e5;
function recordPreloadFailure(preloadKey, now, resolvedModelKey) {
	const existing = preloadCooldown.get(preloadKey);
	const consecutiveFailures = (existing?.consecutiveFailures ?? 0) + 1;
	const persistedResolvedModelKey = resolvedModelKey ?? existing?.resolvedModelKey;
	const entry = {
		consecutiveFailures,
		untilMs: now + Math.min(PRELOAD_BACKOFF_MAX_MS, PRELOAD_BACKOFF_BASE_MS * 2 ** Math.max(0, consecutiveFailures - 1)),
		...persistedResolvedModelKey ? { resolvedModelKey: persistedResolvedModelKey } : {}
	};
	preloadCooldown.set(preloadKey, entry);
	return entry;
}
function normalizeLmstudioModelKey(modelId) {
	const trimmed = modelId.trim();
	if (trimmed.toLowerCase().startsWith("lmstudio/")) return trimmed.slice(9).trim();
	return trimmed;
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
		if (asRecord(providerConfig?.params).preload === false) return streamWithThinkingLevel(withLmstudioUsageCompat(model), context, options);
		const providerBaseUrl = providerConfig?.baseUrl;
		const resolvedBaseUrl = resolveLmstudioInferenceBase(typeof model.baseUrl === "string" ? model.baseUrl : providerBaseUrl);
		const requestedContextLength = asPositiveSafeInteger(model.contextTokens) ?? asPositiveSafeInteger(model.contextWindow);
		const preloadKey = `${resolvedBaseUrl}::${modelKey}::${requestedContextLength ?? "default"}`;
		const cooldown = preloadCooldown.get(preloadKey);
		const cooldownEntry = cooldown && cooldown.untilMs > Date.now() ? cooldown : void 0;
		const preloadPromise = preloadInFlight.get(preloadKey) ?? (cooldownEntry ? void 0 : (() => {
			const created = ensureLmstudioModelLoadedBestEffort({
				baseUrl: resolvedBaseUrl,
				modelKey,
				requestedContextLength,
				options,
				ctx,
				modelHeaders: isRecord(model.headers) ? model.headers : void 0
			}).then((preparedModel) => {
				preloadCooldown.delete(preloadKey);
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
const loadSetup = createLazyRuntimeModule(() => import("../../setup-0QkZaN11.mjs"));
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
			catalog: {
				order: "late",
				run: async (ctx) => {
					return await (await loadSetup()).discoverLmstudioProvider(ctx, { discoveryMode: "strict" });
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
