import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString, p as normalizeStringifiedOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { p as normalizeTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { t as listOpenClawPluginManifestMetadata } from "./manifest-metadata-scan-DIjm0r-Z.mjs";
import { d as parseConfiguredModelVisibilityEntries } from "./model-selection-shared-0uvJbX1M.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { t as cancelUnreadResponseBody } from "./http-response-body-DXfezLdR.mjs";
import "./http-body-Bl_jph25.mjs";
import { m as readProviderJsonResponse } from "./provider-http-errors-CTY_-ABT.mjs";
import { b as ssrfPolicyFromHttpBaseUrlAllowedOrigin } from "./ssrf-BQRtcdBp.mjs";
import { i as fetchWithSsrFGuard } from "./fetch-guard-EFfAF2PS.mjs";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-Df_qhWv_.mjs";
import { l as upsertAuthProfileWithLock } from "./profiles-DblRQQgZ.mjs";
import { s as isNonSecretApiKeyMarker } from "./model-auth-markers-BfYDKFYI.mjs";
import { t as applyAuthProfileConfig } from "./provider-auth-helpers-CVzRzfCc.mjs";
import "./provider-model-shared-DwrT_ZjA.mjs";
//#region src/agents/self-hosted-provider-defaults.ts
/**
* Conservative defaults for self-hosted providers when the model catalog
* cannot supply pricing or token limits.
*/
/** Default context window used for self-hosted provider catalog entries. */
const SELF_HOSTED_DEFAULT_CONTEXT_WINDOW = 128e3;
/** Default output-token cap used for self-hosted provider catalog entries. */
const SELF_HOSTED_DEFAULT_MAX_TOKENS = 8192;
/** Zero-cost pricing used for self-hosted provider catalog entries. */
const SELF_HOSTED_DEFAULT_COST = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0
};
//#endregion
//#region src/plugins/provider-self-hosted-setup.ts
function applyProviderDefaultModel(cfg, modelRef) {
	const existingModel = cfg.agents?.defaults?.model;
	const fallbacks = existingModel && typeof existingModel === "object" && "fallbacks" in existingModel ? existingModel.fallbacks : void 0;
	return {
		...cfg,
		agents: {
			...cfg.agents,
			defaults: {
				...cfg.agents?.defaults,
				model: {
					...fallbacks ? { fallbacks } : void 0,
					primary: modelRef
				}
			}
		}
	};
}
function buildOpenAICompatibleSelfHostedProviderConfig(params) {
	const modelRef = `${params.providerId}/${params.modelId}`;
	const profileId = `${params.providerId}:default`;
	return {
		config: {
			...params.cfg,
			models: {
				...params.cfg.models,
				mode: params.cfg.models?.mode ?? "merge",
				providers: {
					...params.cfg.models?.providers,
					[params.providerId]: {
						baseUrl: params.baseUrl,
						api: "openai-completions",
						apiKey: params.providerApiKey,
						models: [{
							id: params.modelId,
							name: params.modelId,
							reasoning: params.reasoning ?? false,
							input: params.input ?? ["text"],
							cost: SELF_HOSTED_DEFAULT_COST,
							contextWindow: params.contextWindow ?? 128e3,
							maxTokens: params.maxTokens ?? 8192
						}]
					}
				}
			}
		},
		modelRef,
		profileId
	};
}
async function promptAndConfigureOpenAICompatibleSelfHostedProviderAuth(params) {
	const baseUrlRaw = await params.prompter.text({
		message: `${params.providerLabel} base URL`,
		initialValue: params.defaultBaseUrl,
		placeholder: params.defaultBaseUrl,
		validate: (value) => value?.trim() ? void 0 : "Required"
	});
	const apiKeyRaw = await params.prompter.text({
		message: `${params.providerLabel} API key`,
		placeholder: "sk-... (or any non-empty string)",
		validate: (value) => value?.trim() ? void 0 : "Required",
		sensitive: true
	});
	const modelIdRaw = await params.prompter.text({
		message: `${params.providerLabel} model`,
		placeholder: params.modelPlaceholder,
		validate: (value) => value?.trim() ? void 0 : "Required"
	});
	const baseUrl = (baseUrlRaw ?? "").trim().replace(/\/+$/, "");
	const apiKey = normalizeStringifiedOptionalString(apiKeyRaw) ?? "";
	const modelId = normalizeStringifiedOptionalString(modelIdRaw) ?? "";
	const credential = {
		type: "api_key",
		provider: params.providerId,
		key: apiKey
	};
	const configured = buildOpenAICompatibleSelfHostedProviderConfig({
		cfg: params.cfg,
		providerId: params.providerId,
		baseUrl,
		providerApiKey: params.defaultApiKeyEnvVar,
		modelId,
		input: params.input,
		reasoning: params.reasoning,
		contextWindow: params.contextWindow,
		maxTokens: params.maxTokens
	});
	return {
		profiles: [{
			profileId: configured.profileId,
			credential
		}],
		configPatch: configured.config,
		defaultModel: configured.modelRef
	};
}
async function discoverOpenAICompatibleSelfHostedProvider(params) {
	const configuredProvider = findNormalizedProviderValue(params.ctx.config.models?.providers, params.providerId);
	const configuredBaseUrl = configuredProvider ? normalizeOptionalString(configuredProvider.baseUrl) : void 0;
	if (configuredProvider) {
		if (!parseConfiguredModelVisibilityEntries({ cfg: params.ctx.config }).providerWildcards.has(normalizeProviderId(params.providerId))) return null;
	}
	const { apiKey, discoveryApiKey } = params.ctx.resolveProviderApiKey(params.providerId);
	if (!apiKey) return null;
	return { provider: {
		...await params.buildProvider({
			apiKey: discoveryApiKey,
			...configuredBaseUrl ? { baseUrl: configuredBaseUrl } : {}
		}),
		apiKey
	} };
}
function buildMissingNonInteractiveModelIdMessage(params) {
	return [`Missing --custom-model-id for --auth-choice ${params.authChoice}.`, `Pass the ${params.providerLabel} model id to use, for example ${params.modelPlaceholder}.`].join("\n");
}
function isProviderOwnedSyntheticAuthMarker(providerId, resolved) {
	if (resolved.source !== "flag" || !isNonSecretApiKeyMarker(resolved.key, { includeEnvVarName: false })) return false;
	const normalizedProvider = normalizeProviderId(providerId);
	const matchesProvider = (provider) => normalizeProviderId(provider) === normalizedProvider;
	const normalizedValue = resolved.key.trim();
	return listOpenClawPluginManifestMetadata().some(({ origin, manifest }) => origin === "bundled" && normalizeTrimmedStringList(manifest.providers).some(matchesProvider) && normalizeTrimmedStringList(manifest.syntheticAuthRefs).some(matchesProvider) && (normalizedValue === "custom-local" || normalizeTrimmedStringList(manifest.nonSecretAuthMarkers).includes(normalizedValue)));
}
async function configureOpenAICompatibleSelfHostedProviderNonInteractive(params) {
	const baseUrl = (normalizeOptionalSecretInput(params.ctx.opts.customBaseUrl) ?? params.defaultBaseUrl).replace(/\/+$/, "");
	const modelId = normalizeOptionalSecretInput(params.ctx.opts.customModelId);
	if (!modelId) {
		params.ctx.runtime.error(buildMissingNonInteractiveModelIdMessage({
			authChoice: params.ctx.authChoice,
			providerLabel: params.providerLabel,
			modelPlaceholder: params.modelPlaceholder
		}));
		params.ctx.runtime.exit(1);
		return null;
	}
	const resolved = await params.ctx.resolveApiKey({
		provider: params.providerId,
		flagValue: normalizeOptionalSecretInput(params.ctx.opts.customApiKey),
		flagName: "--custom-api-key",
		envVar: params.defaultApiKeyEnvVar,
		envVarName: params.defaultApiKeyEnvVar
	});
	if (!resolved) return null;
	const storesCredential = !isProviderOwnedSyntheticAuthMarker(params.providerId, resolved) && resolved.source !== "profile";
	const configured = buildOpenAICompatibleSelfHostedProviderConfig({
		cfg: params.ctx.config,
		providerId: params.providerId,
		baseUrl,
		providerApiKey: params.defaultApiKeyEnvVar,
		modelId,
		input: params.input,
		reasoning: params.reasoning,
		contextWindow: params.contextWindow,
		maxTokens: params.maxTokens
	});
	if (storesCredential) {
		const credential = params.ctx.toApiKeyCredential({
			provider: params.providerId,
			resolved
		});
		if (!credential) return null;
		await upsertAuthProfileWithLock({
			profileId: configured.profileId,
			credential,
			agentDir: params.ctx.agentDir
		});
	}
	const withProfile = storesCredential ? applyAuthProfileConfig(configured.config, {
		profileId: configured.profileId,
		provider: params.providerId,
		mode: "api_key"
	}) : configured.config;
	params.ctx.runtime.log(`Default ${params.providerLabel} model: ${modelId}`);
	return applyProviderDefaultModel(withProfile, configured.modelRef);
}
//#endregion
//#region src/plugins/provider-self-hosted-discovery.ts
const log = createSubsystemLogger("plugins/self-hosted-provider-discovery");
const SELF_HOSTED_DISCOVERY_JSON_MAX_BYTES = 16777216;
const SELF_HOSTED_RUNTIME_CONTEXT_MAX_MODELS = 200;
const SELF_HOSTED_RUNTIME_CONTEXT_CONCURRENCY = 8;
function readPositiveInteger(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return;
	return Math.trunc(value);
}
const OPENAI_COMPAT_CONTEXT_WINDOW_FIELDS = [
	"context_length",
	"context_window",
	"context_size",
	"max_model_len"
];
function readOpenAICompatibleContextWindow(model) {
	for (const field of OPENAI_COMPAT_CONTEXT_WINDOW_FIELDS) {
		const contextWindow = readPositiveInteger(model?.[field]);
		if (contextWindow !== void 0) return contextWindow;
	}
}
function buildSelfHostedDiscoveryHeaders(params) {
	const headers = {
		...params.acceptJson ? { Accept: "application/json" } : {},
		...params.headers
	};
	const hasAuthorization = Object.keys(headers).some((name) => name.trim().toLowerCase() === "authorization");
	const apiKey = normalizeOptionalString(params.apiKey);
	if (apiKey && !isNonSecretApiKeyMarker(apiKey) && !hasAuthorization) headers.Authorization = `Bearer ${apiKey}`;
	return Object.keys(headers).length > 0 ? headers : void 0;
}
async function fetchSelfHostedDiscoveryJson(params) {
	let guarded;
	try {
		guarded = await fetchWithSsrFGuard({
			url: params.url,
			init: { headers: buildSelfHostedDiscoveryHeaders(params) },
			policy: ssrfPolicyFromHttpBaseUrlAllowedOrigin(params.origin),
			timeoutMs: params.timeoutMs,
			signal: params.signal,
			auditContext: "self-hosted-provider-discovery"
		});
	} catch (error) {
		return {
			kind: "unreachable",
			error
		};
	}
	try {
		if (!params.readBody || !guarded.response.ok) return {
			kind: "response",
			ok: guarded.response.ok,
			status: guarded.response.status
		};
		try {
			return {
				kind: "response",
				ok: true,
				status: guarded.response.status,
				body: await readProviderJsonResponse(guarded.response, `${params.label} discovery`, { maxBytes: SELF_HOSTED_DISCOVERY_JSON_MAX_BYTES })
			};
		} catch (error) {
			return {
				kind: "invalid-response",
				error
			};
		}
	} finally {
		await cancelUnreadResponseBody(guarded.response);
		await guarded.release();
	}
}
function readDiscoveryRows(body) {
	const bodyRecord = asOptionalRecord(body);
	if (!Array.isArray(bodyRecord?.data)) throw new Error("model list must contain data[]");
	return bodyRecord.data.filter(isRecord);
}
function shouldProbeRuntimeProps(model) {
	const status = asOptionalRecord(model.status)?.value;
	return status === void 0 || status === "loaded" || status === "sleeping";
}
function resolveRuntimePropsUrl(params) {
	const url = new URL(`${params.serverBaseUrl.replace(/\/+$/, "")}/props`);
	const modelId = normalizeOptionalString(params.modelId);
	if (modelId) {
		url.searchParams.set("model", modelId);
		url.searchParams.set("autoload", "false");
	}
	return url.toString();
}
/** Guarded model-row discovery for OpenAI-compatible self-hosted servers. */
async function discoverOpenAICompatibleModelRows(params) {
	const inferenceBaseUrl = params.baseUrl.trim().replace(/\/+$/, "");
	const inferredServerBaseUrl = inferenceBaseUrl.replace(/\/v1$/u, "");
	const serverBaseUrl = (params.serverBaseUrl ?? inferredServerBaseUrl).replace(/\/+$/, "");
	const timeoutMs = params.timeoutMs ?? 5e3;
	const request = {
		...params,
		origin: new URL(serverBaseUrl).origin,
		timeoutMs,
		acceptJson: params.modelsPathOrder === "server-first",
		readBody: true
	};
	let health = "unknown";
	if (params.healthPath) {
		const path = params.healthPath;
		const healthResult = await fetchSelfHostedDiscoveryJson({
			...request,
			url: `${serverBaseUrl}${path}`,
			acceptJson: true,
			readBody: false
		});
		if (healthResult.kind === "unreachable") return healthResult;
		if (healthResult.kind === "invalid-response") return {
			...healthResult,
			path
		};
		health = healthResult.status === 200 ? "ready" : healthResult.status === 503 ? "loading" : "unknown";
		if (![
			200,
			404,
			503
		].includes(healthResult.status)) return {
			kind: "http-error",
			path,
			status: healthResult.status
		};
	}
	const modelCandidates = params.modelsPathOrder === "server-first" ? [{
		path: "/models",
		url: `${serverBaseUrl}/models`
	}, {
		path: "/v1/models",
		url: `${inferenceBaseUrl}/models`
	}] : [{
		path: "/v1/models",
		url: `${inferenceBaseUrl}/models`
	}];
	let modelList;
	for (const candidate of modelCandidates) {
		const result = await fetchSelfHostedDiscoveryJson({
			...request,
			url: candidate.url
		});
		if (result.kind === "unreachable") return result;
		if (result.kind === "invalid-response") modelList = {
			...result,
			path: candidate.path
		};
		else if (!result.ok) modelList = {
			kind: "http-error",
			path: candidate.path,
			status: result.status
		};
		else try {
			modelList = {
				kind: "success",
				models: readDiscoveryRows(result.body)
			};
		} catch (error) {
			modelList = {
				kind: "invalid-response",
				path: candidate.path,
				error
			};
		}
		if (modelList.kind === "success" || modelList.kind === "http-error" && modelList.status !== 404) break;
	}
	if (!modelList || modelList.kind !== "success") return modelList ?? {
		kind: "unreachable",
		error: /* @__PURE__ */ new Error("missing model response")
	};
	const rows = modelList.models.map((model) => ({ model }));
	if (params.discoverRuntimeContext !== false) {
		const queryByModel = params.routerModelProps && rows.some(({ model }) => asOptionalRecord(model.status) !== void 0) || !params.routerModelProps && rows.length > 1;
		const probeRows = rows.filter(({ model }) => shouldProbeRuntimeProps(model)).slice(0, SELF_HOSTED_RUNTIME_CONTEXT_MAX_MODELS);
		const deadline = performance.now() + timeoutMs;
		await runTasksWithConcurrency({
			limit: SELF_HOSTED_RUNTIME_CONTEXT_CONCURRENCY,
			errorMode: "stop",
			throwOnError: true,
			tasks: probeRows.map((row) => async () => {
				const remainingMs = deadline - performance.now();
				if (remainingMs <= 0) return;
				const modelId = normalizeOptionalString(row.model.id);
				if (!modelId) return;
				const result = await fetchSelfHostedDiscoveryJson({
					...request,
					url: resolveRuntimePropsUrl({
						serverBaseUrl,
						modelId: queryByModel ? modelId : void 0
					}),
					timeoutMs: Math.min(params.propsTimeoutMs ?? timeoutMs, remainingMs),
					label: `${params.label} /props`
				});
				const props = result.kind === "response" && result.ok ? asOptionalRecord(result.body) : void 0;
				if (props) row.props = props;
			})
		});
	}
	return {
		kind: "success",
		health,
		rows,
		fetchedAt: Date.now()
	};
}
async function discoverOpenAICompatibleLocalModels(params) {
	const env = params.env ?? process.env;
	if (!params.rawResult && (env.VITEST || env.NODE_ENV === "test")) return [];
	const result = await discoverOpenAICompatibleModelRows({
		...params,
		discoverRuntimeContext: params.contextWindow === void 0 && params.discoverRuntimeContext !== false,
		propsTimeoutMs: params.propsTimeoutMs ?? 2500
	});
	if (params.rawResult) return result;
	if (result.kind !== "success") {
		if (result.kind === "invalid-response") log.warn(`${params.label} discovery: malformed JSON response: ${String(result.error)}`);
		else {
			const detail = result.kind === "http-error" ? result.status : String(result.error);
			log.warn(`Failed to discover ${params.label} models: ${detail}`);
		}
		return [];
	}
	if (result.rows.length === 0) {
		log.warn(`No ${params.label} models found on local instance`);
		return [];
	}
	const topLevelContextByModelId = /* @__PURE__ */ new Map();
	for (const { model } of result.rows) {
		const modelId = normalizeOptionalString(model.id);
		const contextWindow = readOpenAICompatibleContextWindow(model);
		if (modelId && contextWindow !== void 0) topLevelContextByModelId.set(modelId, contextWindow);
	}
	return result.rows.flatMap(({ model, props }) => {
		const modelId = normalizeOptionalString(model.id);
		if (!modelId) return [];
		const meta = asOptionalRecord(model.meta);
		const parentId = normalizeOptionalString(model.parent);
		const parentContextWindow = parentId && parentId !== modelId ? topLevelContextByModelId.get(parentId) : void 0;
		const runtimeContextTokens = readPositiveInteger(asOptionalRecord(props?.default_generation_settings)?.n_ctx) ?? readPositiveInteger(props?.n_ctx);
		return [{
			id: modelId,
			name: modelId,
			reasoning: /r1|reasoning|think|reason/i.test(modelId),
			input: ["text"],
			cost: SELF_HOSTED_DEFAULT_COST,
			contextWindow: params.contextWindow ?? readPositiveInteger(meta?.n_ctx_train) ?? readOpenAICompatibleContextWindow(model) ?? parentContextWindow ?? 128e3,
			maxTokens: params.maxTokens ?? 8192,
			...runtimeContextTokens ? { contextTokens: runtimeContextTokens } : {}
		}];
	});
}
//#endregion
export { promptAndConfigureOpenAICompatibleSelfHostedProviderAuth as a, SELF_HOSTED_DEFAULT_MAX_TOKENS as c, discoverOpenAICompatibleSelfHostedProvider as i, applyProviderDefaultModel as n, SELF_HOSTED_DEFAULT_CONTEXT_WINDOW as o, configureOpenAICompatibleSelfHostedProviderNonInteractive as r, SELF_HOSTED_DEFAULT_COST as s, discoverOpenAICompatibleLocalModels as t };
