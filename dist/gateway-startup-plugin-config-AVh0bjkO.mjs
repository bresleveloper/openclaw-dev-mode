import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { n as findNormalizedProviderValue, r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { i as parseModelCatalogRef, t as buildModelCatalogMergeKey } from "./model-catalog-refs-B9ftF0Cz.mjs";
import { E as listAgentEntries, O as listAgentIds } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as appendConfigPathSegment } from "./dot-path-BSC76DAI.mjs";
import { l as normalizeResolvedSecretInputString } from "./types.secrets-B5xWSzLp.mjs";
import "./plugin-instance-scope-C9hxyH_A.mjs";
import { r as readBundledDiscoveryMode } from "./bundled-discovery-state-BnkoG5eV.mjs";
import { n as normalizePluginsConfigWithResolverCore } from "./config-normalization-shared-B7M6gfm-.mjs";
import { d as resolveEffectivePluginActivationState, h as resolveSelectedContextEnginePluginIdFromConfig } from "./config-state-BEAL5gWH.mjs";
import { t as isPluginEnabledByDefaultForPlatform } from "./default-enablement-CEIbpabL.mjs";
import { t as collectPluginConfigContractMatches } from "./config-contract-matches-BX-jIwaa.mjs";
import { i as listModelRefsFromConfigValue, r as collectConfiguredModelRefs } from "./configured-model-refs-ngXQhRsV.mjs";
import "./plugin-registry-contributions-CHC0CCKR.mjs";
import { i as listPotentialConfiguredChannelPresenceSignals, n as listExplicitlyDisabledChannelIdsForConfig, r as listPotentialConfiguredChannelIds } from "./config-presence-D97iwlYy.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { s as listExplicitConfiguredChannelIdsForConfig } from "./channel-presence-policy-C83ks5im.mjs";
import { a as resolveConfiguredTalkRealtimeProviderId } from "./talk-CaH8Mknv.mjs";
import { t as CORE_BUILT_IN_MODEL_APIS } from "./provider-config-owner-CewfXQTW.mjs";
import { t as planEffectiveModelCatalogRows } from "./model-catalog-BFaZ221R.mjs";
import "./config-contracts-qz7Zs8kR.mjs";
import { c as shouldUseEnvHttpProxyForUrl } from "./proxy-env-BwCPCI9p.mjs";
import { n as readResponseTextPrefix } from "./http-response-body-DXfezLdR.mjs";
import "./http-body-Bl_jph25.mjs";
import { b as redactProviderResponseErrorText, f as readProviderJsonArrayFieldResponse, o as createProviderHttpError$1 } from "./provider-http-errors-CTY_-ABT.mjs";
import { y as requireActivePluginRegistry } from "./runtime-BvdPUus5.mjs";
import { y as ssrfPolicyFromHttpBaseUrlAllowedHostname } from "./ssrf-BQRtcdBp.mjs";
import { i as fetchWithSsrFGuard } from "./fetch-guard-EFfAF2PS.mjs";
import { C as resolveMemoryDreamingPluginConfig, S as resolveMemoryDreamingConfig, l as DEFAULT_MEMORY_DREAMING_PLUGIN_ID, w as resolveMemoryDreamingPluginId } from "./dreaming-Rnb_FGdU.mjs";
import { t as resolveConfiguredGenericEmbeddingProviderId } from "./embedding-provider-config-CcgUkcEv.mjs";
import { t as collectConfiguredSpeechProviderIds } from "./gateway-startup-speech-providers-CXRk02Zm.mjs";
//#region packages/memory-host-sdk/src/host/embedding-vectors.ts
/** Validate provider embeddings and restore their original request order. */
function readEmbeddingVectors(data, expectedCount, errorPrefix) {
	const malformedResponse = () => /* @__PURE__ */ new Error(`${errorPrefix}: malformed JSON response`);
	if (!Array.isArray(data) || expectedCount !== void 0 && data.length !== expectedCount) throw malformedResponse();
	const vectors = [];
	let indexed;
	for (let position = 0; position < data.length; position += 1) {
		const entry = asOptionalRecord(data[position]);
		const embedding = entry?.embedding;
		const usesIndex = entry?.index !== void 0;
		if (!entry || !Array.isArray(embedding) || embedding.length === 0 || indexed !== void 0 && indexed !== usesIndex) throw malformedResponse();
		for (const coordinate of embedding) if (typeof coordinate !== "number" || !Number.isFinite(coordinate)) throw malformedResponse();
		indexed = usesIndex;
		const index = usesIndex ? entry.index : position;
		if (typeof index !== "number" || !Number.isInteger(index) || index < 0 || index >= data.length || vectors[index] !== void 0) throw malformedResponse();
		vectors[index] = embedding;
	}
	return vectors;
}
/** Replace invalid coordinates and L2-normalize non-empty vectors. */
function sanitizeAndNormalizeEmbedding(vec) {
	const sanitized = vec.map((value) => Number.isFinite(value) ? value : 0);
	const magnitude = Math.sqrt(sanitized.reduce((sum, value) => sum + value * value, 0));
	if (magnitude < 1e-10) return sanitized;
	return sanitized.map((value) => value / magnitude);
}
//#endregion
//#region packages/memory-host-sdk/src/host/openclaw-runtime-network.ts
const createProviderHttpError = async (...args) => {
	return (await import("./provider-http-errors-gSC1RW2x.mjs")).createProviderHttpError(...args);
};
//#endregion
//#region packages/memory-host-sdk/src/host/remote-http.ts
/** Proxy mode used only for URLs that the runtime classified as env-proxy safe. */
const MEMORY_REMOTE_TRUSTED_ENV_PROXY_MODE = "trusted_env_proxy";
/** Build an SSRF allow policy from a configured remote base URL. */
const buildRemoteBaseUrlPolicy = ssrfPolicyFromHttpBaseUrlAllowedHostname;
/** Execute a remote HTTP request under SSRF guard and always release the response handle. */
async function withRemoteHttpResponse(params) {
	const guardedFetch = params.fetchWithSsrFGuardImpl ?? fetchWithSsrFGuard;
	const shouldUseEnvProxy = params.shouldUseEnvHttpProxyForUrlImpl ?? shouldUseEnvHttpProxyForUrl;
	const { response, release } = await guardedFetch({
		url: params.url,
		fetchImpl: params.fetchImpl,
		init: params.init,
		signal: params.signal,
		policy: params.ssrfPolicy,
		auditContext: params.auditContext ?? "memory-remote",
		...shouldUseEnvProxy(params.url) ? { mode: MEMORY_REMOTE_TRUSTED_ENV_PROXY_MODE } : {}
	});
	try {
		return await params.onResponse(response);
	} finally {
		await release();
	}
}
//#endregion
//#region packages/memory-host-sdk/src/host/search-deadline-control.ts
/**
* Per-call control channel between a memory-search deadline owner and a nested
* phase that runs on its own budget. The canonical example is managed
* local-service acquisition during query embedding: service readiness is owned
* and bounded by `models.providers.<id>.localService.readyTimeoutMs`, so the
* whole-search deadline must not consume its budget while the caller waits for
* a cold service to become ready.
*
* The channel is symbol-keyed so it never serializes into tool payloads or
* provider request bodies and stays invisible to model-facing surfaces.
*/
const MEMORY_SEARCH_DEADLINE_CONTROL = Symbol("openclaw.memory-search-deadline-control");
/** Create the balanced fan-out at the deadline owner boundary. */
function createMemorySearchDeadlineControl() {
	let depth = 0;
	const listeners = /* @__PURE__ */ new Set();
	return {
		report(action) {
			if (action === "pause") {
				depth += 1;
				if (depth === 1) for (const listener of listeners) listener("pause");
				return;
			}
			if (depth === 0) return;
			depth -= 1;
			if (depth === 0) for (const listener of listeners) listener("resume");
		},
		subscribe(listener) {
			listeners.add(listener);
			if (depth > 0) listener("pause");
			return () => {
				listeners.delete(listener);
			};
		}
	};
}
//#endregion
//#region src/plugins/openai-compatible-embedding-provider.ts
/** Provider id for OpenAI-compatible remote embedding servers. */
const OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID = "openai-compatible";
const OPENAI_COMPATIBLE_MODEL_APIS = /* @__PURE__ */ new Set(["openai-completions", "openai-responses"]);
const EMBEDDING_ERROR_BODY_MAX_BYTES = 8192;
const EMBEDDING_ERROR_BODY_MAX_CHARS = 1e3;
const EMBEDDING_ERROR_TRUNCATED_SUFFIX = "... [truncated]";
function normalizeBaseUrl(value) {
	const baseUrl = value?.trim();
	if (!baseUrl) throw new Error("openai-compatible embeddings: missing remote.baseUrl. Set it to your OpenAI-compatible embeddings server, for example http://127.0.0.1:11434/v1.");
	return baseUrl.replace(/\/+$/u, "");
}
function normalizeModel(value, providerId) {
	const model = value?.trim();
	if (!model) throw new Error("openai-compatible embeddings: missing model. Set it to the embedding model id your server expects.");
	const prefixes = new Set([
		providerId?.trim(),
		normalizeProviderId(providerId ?? ""),
		OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID
	].filter((prefix) => Boolean(prefix)).map((prefix) => `${prefix}/`));
	for (const prefix of prefixes) if (model.startsWith(prefix)) return model.slice(prefix.length);
	return model;
}
function normalizeDimensions(value) {
	if (value === void 0) return;
	if (!Number.isInteger(value) || value <= 0) throw new Error("openai-compatible embeddings: dimensions must be a positive integer.");
	return value;
}
function normalizeOptionalInputType(value) {
	const inputType = value?.trim();
	return inputType ? inputType : void 0;
}
function resolveRequestInputType(client, kind) {
	if (kind === "query") return client.queryInputType ?? client.inputType;
	if (kind === "document") return client.documentInputType ?? client.inputType;
	return client.inputType;
}
function normalizeHeaderName(name) {
	return name.trim().toLowerCase();
}
function buildHeaders(params) {
	const headers = {
		accept: "application/json",
		"content-type": "application/json"
	};
	for (const [path, extra] of [["models.providers.*.headers", params.provider], ["memory.search.remote.headers", params.remote]]) for (const [name, rawValue] of Object.entries(extra ?? {})) {
		const normalizedName = normalizeHeaderName(name);
		if (!normalizedName) continue;
		const value = resolveSecretString({
			value: rawValue,
			path: `${path}.${normalizedName}`
		});
		if (value) headers[normalizedName] = value;
	}
	if (params.apiKey && !headers.authorization) headers.authorization = `Bearer ${params.apiKey}`;
	return headers;
}
function isSensitiveHeaderName(name) {
	return name === "authorization" || name === "proxy-authorization" || name.includes("api-key") || name.includes("token") || name.includes("secret");
}
function sanitizeCacheHeaders(headers) {
	const safeHeaders = Object.fromEntries(Object.entries(headers).filter(([name]) => !isSensitiveHeaderName(name)));
	return Object.keys(safeHeaders).length > 0 ? safeHeaders : void 0;
}
function resolveSecretString(params) {
	return normalizeResolvedSecretInputString({
		value: params.value,
		path: params.path
	});
}
function resolveRemoteApiKey(value) {
	return resolveSecretString({
		value,
		path: "memory.search.remote.apiKey"
	});
}
async function resolveConfiguredProviderApiKey(params) {
	const apiKey = resolveSecretString({
		value: params.configuredProvider?.apiKey,
		path: `${appendConfigPathSegment("models.providers", params.providerId)}.apiKey`
	});
	if (!apiKey) return;
	const { resolveAgentDir, tryResolveAmbientOwnerAgentId } = await import("./agent-scope-config-YrCdQ9uN.mjs");
	const agentId = tryResolveAmbientOwnerAgentId(params.options.config);
	const agentDir = params.options.agentDir?.trim() || (agentId ? resolveAgentDir(params.options.config, agentId) : void 0);
	if (!agentDir) return apiKey;
	const { resolveScopedAuthProfileStore, resolveProviderEntryApiKeyAuth } = await import("./model-auth-provider-C2EdiyUu.mjs");
	const authParams = {
		provider: params.providerId,
		modelApi: params.configuredProvider?.api,
		cfg: params.options.config,
		agentDir
	};
	const store = resolveScopedAuthProfileStore(authParams);
	const auth = await resolveProviderEntryApiKeyAuth({
		...authParams,
		store
	});
	return auth ? auth.apiKey : apiKey;
}
function isOpenAICompatibleProviderConfig(id, provider) {
	return normalizeProviderId(id) === OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID || OPENAI_COMPATIBLE_MODEL_APIS.has(normalizeProviderId(provider.api ?? "")) || !provider.api && typeof provider.baseUrl === "string" && provider.baseUrl.trim().length > 0;
}
function resolveConfiguredProvider(options) {
	const providers = options.config.models?.providers;
	if (!providers) return;
	const providerId = options.provider?.trim() || OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID;
	const normalizedProviderId = normalizeProviderId(providerId);
	const direct = providers[providerId];
	if (direct && isOpenAICompatibleProviderConfig(providerId, direct)) return {
		providerId,
		config: direct
	};
	const normalizedEntry = Object.entries(providers).find(([candidateId]) => normalizeProviderId(candidateId) === normalizedProviderId);
	if (!normalizedEntry) return;
	const [configuredProviderId, config] = normalizedEntry;
	return isOpenAICompatibleProviderConfig(configuredProviderId, config) ? {
		providerId: configuredProviderId,
		config
	} : void 0;
}
function embeddingInputToText(input) {
	if (typeof input === "string") return input;
	if (!input.parts || input.parts.length === 0) return input.text;
	const textParts = [];
	for (const part of input.parts) {
		if (part.type !== "text") throw new Error("openai-compatible embeddings only support text embedding inputs.");
		textParts.push(part.text);
	}
	return textParts.join("");
}
function malformedEmbeddingResponse() {
	return /* @__PURE__ */ new Error("openai-compatible embeddings failed: malformed JSON response");
}
async function createEmbeddingHttpError(response, requestHeaders) {
	const prefix = response.body && !response.bodyUsed ? await readResponseTextPrefix(response, EMBEDDING_ERROR_BODY_MAX_BYTES).catch(() => void 0) : void 0;
	const safeBody = prefix?.text ? redactProviderResponseErrorText(prefix.text, requestHeaders, { sourceTruncated: prefix.truncated }) : void 0;
	const error = await createProviderHttpError$1(new Response(safeBody, {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers
	}), "openai-compatible embeddings failed", { requestHeaders });
	let snippet = safeBody;
	if (snippet && snippet.length > EMBEDDING_ERROR_BODY_MAX_CHARS) snippet = `${truncateUtf16Safe(snippet, EMBEDDING_ERROR_BODY_MAX_CHARS)}${EMBEDDING_ERROR_TRUNCATED_SUFFIX}`;
	else if (snippet && prefix?.truncated) snippet = `${snippet}${EMBEDDING_ERROR_TRUNCATED_SUFFIX}`;
	error.message = `openai-compatible embeddings failed: HTTP ${response.status}${snippet ? `: ${snippet}` : ""}`;
	return error;
}
async function postEmbeddingRequest(params) {
	const { client, input, deadlineControl } = params;
	const inputType = resolveRequestInputType(client, params.inputType);
	const body = {
		model: client.model,
		input,
		...typeof client.dimensions === "number" ? { dimensions: client.dimensions } : {},
		...inputType ? { input_type: inputType } : {}
	};
	const localServiceLease = client.localServiceTarget && client.acquireLocalService ? await client.acquireLocalService({
		...client.localServiceTarget,
		...deadlineControl ? { onReadinessWait: (waiting) => deadlineControl.report(waiting ? "pause" : "resume") } : {}
	}, params.signal) : void 0;
	try {
		return await withRemoteHttpResponse({
			url: client.endpointUrl,
			init: {
				method: "POST",
				headers: client.headers,
				body: JSON.stringify(body)
			},
			signal: params.signal,
			ssrfPolicy: client.ssrfPolicy,
			auditContext: "embedding-provider:openai-compatible",
			onResponse: async (response) => {
				if (!response.ok) throw await createEmbeddingHttpError(response, client.headers);
				return readEmbeddingVectors(await readProviderJsonArrayFieldResponse(response, "openai-compatible embeddings failed", "data"), input.length, "openai-compatible embeddings failed");
			}
		});
	} finally {
		localServiceLease?.release();
	}
}
/** Creates a normalized OpenAI-compatible embedding client from runtime config. */
async function createOpenAICompatibleEmbeddingClient(options) {
	const resolvedProvider = resolveConfiguredProvider(options);
	const configuredProvider = resolvedProvider?.config;
	const providerId = resolvedProvider?.providerId ?? options.provider?.trim() ?? OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID;
	const remoteBaseUrl = normalizeOptionalString(options.remote?.baseUrl);
	const providerBaseUrl = normalizeOptionalString(configuredProvider?.baseUrl);
	const baseUrl = normalizeBaseUrl(remoteBaseUrl ?? providerBaseUrl);
	const { embeddingProviderOwnsDestination, resolveEmbeddingEndpointUrl } = await import("./plugin-sdk/memory-core-host-engine-embeddings.js");
	const providerOwnsDestination = providerBaseUrl !== void 0 && embeddingProviderOwnsDestination({
		baseUrl,
		providerBaseUrl
	});
	const model = normalizeModel(options.model, options.provider);
	const inputType = normalizeOptionalInputType(options.inputType);
	const queryInputType = normalizeOptionalInputType(options.queryInputType);
	const documentInputType = normalizeOptionalInputType(options.documentInputType);
	const headers = buildHeaders({
		apiKey: resolveRemoteApiKey(options.remote?.apiKey),
		provider: providerOwnsDestination ? configuredProvider?.headers : void 0,
		remote: options.remote?.headers
	});
	if (providerOwnsDestination && !headers.authorization) {
		const providerApiKey = await resolveConfiguredProviderApiKey({
			providerId,
			options,
			configuredProvider
		});
		if (providerApiKey) headers.authorization = `Bearer ${providerApiKey}`;
	}
	const localServiceOptions = options;
	return {
		providerId,
		baseUrl,
		endpointUrl: resolveEmbeddingEndpointUrl(baseUrl, "embeddings"),
		headers,
		ssrfPolicy: ssrfPolicyFromHttpBaseUrlAllowedHostname(baseUrl),
		model,
		...configuredProvider?.localService && !remoteBaseUrl ? {
			localServiceTarget: {
				providerId,
				baseUrl,
				headers
			},
			acquireLocalService: localServiceOptions.acquireLocalService
		} : {},
		...options.dimensions !== void 0 ? { dimensions: normalizeDimensions(options.dimensions) } : {},
		...inputType ? { inputType } : {},
		...queryInputType ? { queryInputType } : {},
		...documentInputType ? { documentInputType } : {}
	};
}
/** Creates an OpenAI-compatible embedding provider and its backing client. */
async function createOpenAICompatibleEmbeddingProvider(options) {
	const client = await createOpenAICompatibleEmbeddingClient(options);
	const embedBatch = async (inputs, callOptions) => {
		if (inputs.length === 0) return [];
		return await postEmbeddingRequest({
			client,
			input: inputs.map(embeddingInputToText),
			signal: callOptions?.signal,
			inputType: callOptions?.inputType,
			deadlineControl: callOptions?.[MEMORY_SEARCH_DEADLINE_CONTROL]
		});
	};
	return {
		provider: {
			id: OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID,
			model: client.model,
			...typeof client.dimensions === "number" ? { dimensions: client.dimensions } : {},
			embed: async (input, callOptions) => {
				const [embedding] = await embedBatch([input], callOptions);
				if (!embedding) throw malformedEmbeddingResponse();
				return embedding;
			},
			embedBatch
		},
		client
	};
}
//#endregion
//#region src/plugins/core-embedding-providers.ts
const CORE_EMBEDDING_PROVIDERS = [{
	adapter: {
		id: OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID,
		transport: "remote",
		create: async (options) => {
			const { provider, client } = await createOpenAICompatibleEmbeddingProvider(options);
			const cacheHeaders = sanitizeCacheHeaders(client.headers);
			return {
				provider,
				runtime: {
					id: OPENAI_COMPATIBLE_EMBEDDING_PROVIDER_ID,
					inlineBatchTimeoutMs: 6e5,
					cacheKeyData: {
						provider: client.providerId,
						baseUrl: client.baseUrl,
						model: client.model,
						...typeof client.dimensions === "number" ? { dimensions: client.dimensions } : {},
						...client.inputType ? { inputType: client.inputType } : {},
						...client.queryInputType ? { queryInputType: client.queryInputType } : {},
						...client.documentInputType ? { documentInputType: client.documentInputType } : {},
						...cacheHeaders ? { headers: cacheHeaders } : {}
					}
				}
			};
		}
	},
	ownerPluginId: "core"
}];
function getCoreEmbeddingProvider(id) {
	return CORE_EMBEDDING_PROVIDERS.find((entry) => entry.adapter.id === id);
}
//#endregion
//#region src/plugins/embedding-providers.ts
function getEmbeddingProviders() {
	return requireActivePluginRegistry().embeddingProviders.map((entry) => ({
		adapter: entry.provider,
		ownerPluginId: entry.pluginId || void 0
	}));
}
/** Looks up the registered embedding provider entry, including owner metadata. */
function getRegisteredEmbeddingProvider(id) {
	return getCoreEmbeddingProvider(id) ?? getEmbeddingProviders().find((entry) => entry.adapter.id === id);
}
/** Lists registered embedding providers with core defaults merged first. */
function listRegisteredEmbeddingProviders() {
	const merged = new Map(CORE_EMBEDDING_PROVIDERS.map((entry) => [entry.adapter.id, entry]));
	for (const entry of getEmbeddingProviders()) if (!merged.has(entry.adapter.id)) merged.set(entry.adapter.id, entry);
	return Array.from(merged.values());
}
//#endregion
//#region src/plugins/gateway-startup-plugin-providers.ts
function collectConfiguredWebSearchProviderIds(config) {
	const search = config.tools?.web?.search;
	if (search?.enabled === false || typeof search?.provider !== "string") return /* @__PURE__ */ new Set();
	const providerId = normalizeOptionalLowercaseString(search.provider);
	return providerId ? /* @__PURE__ */ new Set([providerId]) : /* @__PURE__ */ new Set();
}
function listModelProviderRefParts(value) {
	return listModelRefsFromConfigValue(value).map(parseModelCatalogRef).filter((entry) => entry !== null).map(({ provider, modelId }) => ({
		providerId: provider,
		modelId
	}));
}
function collectModelProviderIds(value) {
	return new Set(listModelRefsFromConfigValue(value).map((ref) => {
		const slashIndex = ref.indexOf("/");
		return slashIndex > 0 ? normalizeProviderId(ref.slice(0, slashIndex)) : "";
	}).filter((providerId) => Boolean(providerId)));
}
function buildManifestModelProviderLookup(manifestRegistry, config, modelIdsByProvider) {
	const providerFilters = [...modelIdsByProvider.keys()];
	const mergeKeyFilter = new Set([...modelIdsByProvider].flatMap(([providerId, modelIds]) => [...modelIds].map((modelId) => buildModelCatalogMergeKey(providerId, modelId))));
	return {
		modelApis: new Map(planEffectiveModelCatalogRows({
			registry: manifestRegistry,
			config,
			providerFilters,
			mergeKeyFilter
		}).rows.flatMap((row) => row.api ? [[row.mergeKey, row.api]] : [])),
		cliBackendIds: new Set(manifestRegistry.plugins.flatMap((plugin) => plugin.cliBackends.map(normalizeProviderId))),
		providerIds: new Set(manifestRegistry.plugins.flatMap((plugin) => plugin.providers.map(normalizeProviderId)))
	};
}
function collectConfiguredAgentModelProviderIds(config, manifestRegistry) {
	const modelIdsByProvider = /* @__PURE__ */ new Map();
	const addModelProviderRefs = (value) => {
		for (const { providerId, modelId } of listModelProviderRefParts(value)) {
			const modelIds = modelIdsByProvider.get(providerId) ?? /* @__PURE__ */ new Set();
			modelIds.add(modelId);
			modelIdsByProvider.set(providerId, modelIds);
		}
	};
	const addModelMapProviderIds = (models) => {
		if (!isRecord(models)) return;
		for (const modelRef of Object.keys(models)) addModelProviderRefs(modelRef);
	};
	const defaults = config.agents?.defaults;
	addModelProviderRefs(defaults?.model);
	addModelProviderRefs(defaults?.utilityModel);
	addModelMapProviderIds(defaults?.models);
	for (const agent of listAgentEntries(config)) {
		if (!isRecord(agent)) continue;
		addModelProviderRefs(agent.model);
		addModelProviderRefs(agent.utilityModel);
		addModelMapProviderIds(agent.models);
	}
	if (modelIdsByProvider.size === 0) return /* @__PURE__ */ new Set();
	const manifestModelProviders = buildManifestModelProviderLookup(manifestRegistry, config, modelIdsByProvider);
	return new Set([...modelIdsByProvider.entries()].filter(([providerId, modelIds]) => {
		return [...modelIds].some((modelId) => configuredModelProviderNeedsRuntimePlugin({
			config,
			manifestModelProviders,
			providerId,
			modelId
		}));
	}).map(([providerId]) => providerId));
}
function configuredModelProviderNeedsRuntimePlugin(params) {
	if (params.manifestModelProviders.cliBackendIds.has(params.providerId)) return true;
	const providerConfig = params.config.models?.providers?.[params.providerId];
	const modelApi = (providerConfig?.models?.find((model) => model.id === params.modelId))?.api ?? providerConfig?.api ?? params.manifestModelProviders.modelApis.get(buildModelCatalogMergeKey(params.providerId, params.modelId));
	if (typeof modelApi === "string") return !CORE_BUILT_IN_MODEL_APIS.has(modelApi);
	return params.manifestModelProviders.providerIds.has(params.providerId);
}
function manifestOwnsConfiguredModelProvider(params) {
	if (params.configuredModelProviderIds.size === 0) return false;
	return [...params.manifest?.providers ?? [], ...params.manifest?.cliBackends ?? []].some((providerId) => {
		return params.configuredModelProviderIds.has(normalizeProviderId(providerId));
	});
}
function collectConfiguredGenerationProviderIds(config) {
	const defaults = config.agents?.defaults;
	return {
		imageGenerationProviders: collectModelProviderIds(defaults?.mediaModels?.image),
		videoGenerationProviders: collectModelProviderIds(defaults?.mediaModels?.video),
		musicGenerationProviders: collectModelProviderIds(defaults?.mediaModels?.music)
	};
}
function collectConfiguredVoiceProviderIds(config) {
	const providerIds = collectModelProviderIds(config.agents?.defaults?.voiceModel);
	const realtimeProviderIds = new Set(providerIds);
	const talkRealtimeProviderId = resolveConfiguredTalkRealtimeProviderId(config);
	if (talkRealtimeProviderId) realtimeProviderIds.add(talkRealtimeProviderId.toLowerCase());
	return {
		speechProviders: providerIds,
		realtimeTranscriptionProviders: providerIds,
		realtimeVoiceProviders: realtimeProviderIds
	};
}
const MEMORY_EMBEDDING_PROVIDER_STARTUP_SKIP_IDS = /* @__PURE__ */ new Set(["auto", "none"]);
function normalizeMemoryEmbeddingProviderIdValue(value) {
	if (typeof value !== "string") return;
	return normalizeOptionalLowercaseString(value) || void 0;
}
function normalizeExplicitMemoryEmbeddingProviderId(value) {
	const normalized = normalizeMemoryEmbeddingProviderIdValue(value);
	return normalized && !MEMORY_EMBEDDING_PROVIDER_STARTUP_SKIP_IDS.has(normalized) ? normalized : void 0;
}
function readMemorySearchEnabled(memorySearch) {
	const enabled = memorySearch?.enabled;
	return typeof enabled === "boolean" ? enabled : void 0;
}
function isMemorySlotExplicitlyDisabled(config) {
	return normalizeOptionalLowercaseString(config.plugins?.slots?.memory) === "none";
}
/**
* Resolve a configured memory embedding provider id to the adapter id(s) a
* plugin manifest contract or runtime registry can own. Mirrors runtime
* `getConfiguredMemoryEmbeddingProvider`: the raw id maps to a direct adapter,
* and a custom `models.providers.<id>` entry additionally maps to its `api`
* owner adapter (`provider: "ollama-5080"` with `api: "ollama"` -> "ollama").
* Both candidates are returned so matching covers the direct adapter and the
* API owner without the runtime adapter registry.
*/
function resolveMemoryEmbeddingProviderOwnerIds(providerId, config) {
	const ownerIds = [providerId];
	const genericOwnerId = normalizeOptionalLowercaseString(resolveConfiguredGenericEmbeddingProviderId(providerId, config));
	if (genericOwnerId && genericOwnerId !== providerId) ownerIds.push(genericOwnerId);
	const ownerApi = normalizeOptionalLowercaseString(findNormalizedProviderValue(config.models?.providers, providerId)?.api);
	if (ownerApi && ownerApi !== providerId) ownerIds.push(ownerApi);
	return ownerIds;
}
function resolveEffectiveMemoryEmbeddingProviderEntries(defaults, override) {
	if (!(readMemorySearchEnabled(override) ?? readMemorySearchEnabled(defaults) ?? true)) return [];
	const rawProvider = normalizeMemoryEmbeddingProviderIdValue(override?.provider ?? defaults?.provider);
	const effectiveProvider = rawProvider === "auto" || !rawProvider ? "openai" : rawProvider;
	if (effectiveProvider === "none") return [];
	const entries = [];
	const provider = rawProvider && !MEMORY_EMBEDDING_PROVIDER_STARTUP_SKIP_IDS.has(rawProvider) ? rawProvider : void 0;
	if (provider) entries.push({
		configuredId: provider,
		source: "provider"
	});
	const fallback = normalizeExplicitMemoryEmbeddingProviderId(override?.fallback ?? defaults?.fallback ?? "none");
	if (fallback && fallback !== effectiveProvider) entries.push({
		configuredId: fallback,
		source: "fallback"
	});
	return entries;
}
/**
* Collect explicit memory embedding provider owners required by startup. The
* resolver mirrors runtime memory-search inheritance for enablement, primary
* provider, and fallback provider, then maps custom `models.providers` ids to
* their API-owner adapter ids.
*/
function collectConfiguredMemoryEmbeddingStartupProviderOwners(config) {
	if (isMemorySlotExplicitlyDisabled(config)) return [];
	const byConfiguredIdAndSource = /* @__PURE__ */ new Map();
	const defaultsBlock = config.memory?.search;
	const defaults = isRecord(defaultsBlock) ? defaultsBlock : void 0;
	const addEffectiveProviders = (override, agentId) => {
		for (const { configuredId, source } of resolveEffectiveMemoryEmbeddingProviderEntries(defaults, override)) {
			const key = `${source}\0${configuredId}`;
			const existing = byConfiguredIdAndSource.get(key);
			if (existing) {
				if (agentId) existing.agentIds.add(agentId);
				continue;
			}
			byConfiguredIdAndSource.set(key, {
				configuredId,
				ownerIds: new Set(resolveMemoryEmbeddingProviderOwnerIds(configuredId, config)),
				agentIds: new Set(agentId ? [agentId] : []),
				source
			});
		}
	};
	const agentEntries = listAgentEntries(config);
	addEffectiveProviders(void 0, agentEntries.length === 0 ? listAgentIds(config)[0] : void 0);
	if (agentEntries.length === 0) return [...byConfiguredIdAndSource.values()];
	for (const agent of agentEntries) {
		const memory = isRecord(agent.memory) ? agent.memory : void 0;
		addEffectiveProviders(isRecord(memory?.search) ? memory.search : void 0, normalizeAgentId(agent.id));
	}
	return [...byConfiguredIdAndSource.values()];
}
/**
* Collect configured memory embedding provider ids that map to a plugin-owned
* memory embedding provider contract, including the resolved `api` owner for
* custom `models.providers` ids so the owning plugin loads at startup.
*/
function collectConfiguredMemoryEmbeddingProviderIds(config) {
	const providerIds = /* @__PURE__ */ new Set();
	for (const provider of collectConfiguredMemoryEmbeddingStartupProviderOwners(config)) for (const ownerId of provider.ownerIds) providerIds.add(ownerId);
	return providerIds;
}
/**
* Report configured memory embedding providers that no loaded plugin can serve.
* A provider is unregistered only when none of its resolved adapter ids (the
* configured id and its `models.providers.<id>.api` owner) was registered, so
* custom providers warn when their API-owner plugin is missing but stay quiet
* once that plugin loads.
*/
function collectUnregisteredConfiguredMemoryEmbeddingProviders(params) {
	const configured = collectConfiguredMemoryEmbeddingStartupProviderOwners(params.config);
	if (configured.length === 0) return [];
	const registered = new Set([...params.registeredProviderIds].map((id) => normalizeOptionalLowercaseString(id)).filter((id) => Boolean(id)));
	return configured.filter((provider) => ![...provider.ownerIds].some((ownerId) => registered.has(ownerId))).map((provider) => ({
		configuredId: provider.configuredId,
		source: provider.source
	})).toSorted((left, right) => left.configuredId.localeCompare(right.configuredId) || left.source.localeCompare(right.source));
}
function collectRegisteredEmbeddingProviderIds(registry) {
	return new Set([...registry.embeddingProviders ?? [], ...listRegisteredEmbeddingProviders().map((entry) => ({ provider: entry.adapter }))].map((entry) => entry.provider.id));
}
//#endregion
//#region src/plugins/gateway-startup-plugin-contracts.ts
function sortUniquePluginIds(values) {
	return [...new Set([...values].map((value) => value.trim()).filter(Boolean))].toSorted((left, right) => left.localeCompare(right));
}
//#endregion
//#region src/plugins/gateway-startup-plugin-config.ts
function readStartupBundledDiscoveryMode(config, env) {
	const stateMode = readBundledDiscoveryMode({ env });
	if (stateMode) return stateMode;
	const legacyMode = config.plugins?.bundledDiscovery;
	if (legacyMode === "compat" || legacyMode === "allowlist") return legacyMode;
}
function normalizePluginsConfigForInstalledIndex(config, lookup) {
	return normalizePluginsConfigWithResolverCore(config, lookup.normalizePluginId);
}
function isConfigActivationValueEnabled(value) {
	if (value === false) return false;
	if (isRecord(value) && value.enabled === false) return false;
	return true;
}
function listPotentialEnabledChannelIds(config, env, options = {}) {
	const disabled = new Set(listExplicitlyDisabledChannelIdsForConfig(config));
	const enabledSignals = [...listPotentialConfiguredChannelIds(config, env, {
		includePersistedAuthState: false,
		ambientEnvTriggers: options.ambientEnvTriggers
	}), ...listExplicitConfiguredChannelIdsForConfig(config)].map((id) => normalizeOptionalLowercaseString(id) ?? "").filter((id) => id && !disabled.has(id));
	if (options.includePersistedAuthState !== true) return sortUniquePluginIds(enabledSignals);
	const persistedSignals = listPotentialConfiguredChannelPresenceSignals(config, env, {
		includePersistedAuthState: true,
		ambientEnvTriggers: options.ambientEnvTriggers
	}).filter((signal) => signal.source === "persisted-auth").map((signal) => normalizeOptionalLowercaseString(signal.channelId) ?? "").filter(Boolean);
	return sortUniquePluginIds([...enabledSignals, ...persistedSignals]);
}
function isGatewayStartupMemoryPlugin(plugin) {
	return plugin.startup.memory;
}
function resolveGatewayStartupDreamingEngineId(config) {
	if (!resolveMemoryDreamingConfig({
		pluginConfig: resolveMemoryDreamingPluginConfig(config),
		cfg: config
	}).enabled) return;
	if (!resolveGatewayStartupDreamingSelectedPluginId(config)) return;
	return DEFAULT_MEMORY_DREAMING_PLUGIN_ID;
}
function resolveGatewayStartupDreamingSelectedPluginId(config) {
	const selectedPluginId = normalizeOptionalLowercaseString(resolveMemoryDreamingPluginId(config));
	return selectedPluginId && selectedPluginId !== "memory-core" ? selectedPluginId : void 0;
}
function blocksPluginStartup(params) {
	return params.pluginsConfig.deny.includes(params.pluginId) || params.activationSourcePlugins.deny.includes(params.pluginId) || params.pluginsConfig.entries[params.pluginId]?.enabled === false || params.activationSourcePlugins.entries[params.pluginId]?.enabled === false;
}
function resolveAuthorizedGatewayStartupDreamingPluginIds(params) {
	const engineId = resolveGatewayStartupDreamingEngineId(params.config);
	const dreamingSelectedPluginId = resolveGatewayStartupDreamingSelectedPluginId(params.config);
	if (!engineId || !params.pluginsConfig.enabled || !params.activationSourcePlugins.enabled) return /* @__PURE__ */ new Set();
	if (!params.selectedMemoryPluginId || params.selectedMemoryPluginId !== dreamingSelectedPluginId || params.selectedMemoryPluginId === engineId || blocksPluginStartup({
		pluginId: engineId,
		pluginsConfig: params.pluginsConfig,
		activationSourcePlugins: params.activationSourcePlugins
	})) return /* @__PURE__ */ new Set();
	const selectedPlugin = params.index.plugins.find((plugin) => plugin.pluginId === params.selectedMemoryPluginId);
	const sidecarPlugin = params.index.plugins.find((plugin) => plugin.pluginId === engineId);
	if (!selectedPlugin?.startup.memory || !sidecarPlugin?.startup.memory) return /* @__PURE__ */ new Set();
	return resolveEffectivePluginActivationState({
		id: selectedPlugin.pluginId,
		origin: selectedPlugin.origin,
		channelIds: selectedPlugin.contributions?.channels,
		config: params.pluginsConfig,
		rootConfig: params.config,
		enabledByDefault: isPluginEnabledByDefaultForPlatform(selectedPlugin, params.platform),
		activationSource: params.activationSource
	}).enabled ? /* @__PURE__ */ new Set([engineId]) : /* @__PURE__ */ new Set();
}
function resolveMemorySlotStartupPluginId(params) {
	const { activationSourceConfig, activationSourcePlugins, normalizePluginId } = params;
	const configuredSlot = activationSourceConfig.plugins?.slots?.memory?.trim();
	if (configuredSlot?.toLowerCase() === "none") return;
	if (!configuredSlot) {
		const defaultSlot = activationSourcePlugins.slots.memory;
		if (typeof defaultSlot !== "string") return;
		if (activationSourcePlugins.allow.length > 0 && !activationSourcePlugins.allow.includes(defaultSlot)) return;
		return defaultSlot;
	}
	return normalizePluginId(configuredSlot);
}
function resolveContextEngineSlotStartupPluginId(params) {
	const { activationSourceConfig, activationSourcePlugins, normalizePluginId } = params;
	const configuredSlot = activationSourceConfig.plugins?.slots?.contextEngine?.trim();
	if (!configuredSlot) return;
	return resolveSelectedContextEnginePluginIdFromConfig(activationSourcePlugins, normalizePluginId(configuredSlot));
}
function shouldConsiderForGatewayStartup(params) {
	if (params.manifest?.activation?.onStartup === true) return true;
	if (params.contextEngineSlotStartupPluginId === params.plugin.pluginId) return true;
	if (!isGatewayStartupMemoryPlugin(params.plugin)) return false;
	if (params.startupDreamingPluginIds.has(params.plugin.pluginId)) return true;
	return params.memorySlotStartupPluginId === params.plugin.pluginId;
}
function hasConfiguredActivationPath(params) {
	return hasConfiguredActivationPathPatterns({
		paths: params.manifest?.activation?.onConfigPaths,
		config: params.config
	});
}
function hasConfiguredActivationPathPatterns(params) {
	const paths = params.paths;
	if (!paths?.length) return false;
	return paths.some((pathPattern) => collectPluginConfigContractMatches({
		root: params.config,
		pathPattern
	}).some((match) => isConfigActivationValueEnabled(match.value)));
}
function addConfiguredActivationPathPluginIds(target, params) {
	for (const plugin of params.index.plugins) {
		if (plugin.origin !== "bundled") continue;
		if (hasConfiguredActivationPathPatterns({
			paths: plugin.startup.configPaths,
			config: params.activationSourceConfig
		})) target.add(plugin.pluginId);
	}
}
function addPluginConfigEntryIds(target, plugins) {
	for (const [pluginId, entry] of Object.entries(plugins.entries)) if (entry?.enabled !== false) target.add(pluginId);
}
function addConfiguredSlotPluginIds(target, params) {
	const memorySlot = resolveMemorySlotStartupPluginId({
		activationSourceConfig: params.activationSourceConfig,
		activationSourcePlugins: params.activationSourcePlugins,
		normalizePluginId: params.lookup.normalizePluginId
	});
	if (memorySlot) target.add(memorySlot);
	const contextEngineSlot = resolveContextEngineSlotStartupPluginId({
		activationSourceConfig: params.activationSourceConfig,
		activationSourcePlugins: params.activationSourcePlugins,
		normalizePluginId: params.lookup.normalizePluginId
	});
	if (contextEngineSlot) target.add(contextEngineSlot);
}
function collectConfiguredStartupChannelIds(params) {
	return sortUniquePluginIds(params.configs.flatMap((config) => listPotentialEnabledChannelIds(config, params.env, {
		ambientEnvTriggers: params.ambientEnvTriggers,
		includePersistedAuthState: params.includePersistedAuthState
	})));
}
function collectConfiguredProviderIds(config) {
	const configuredWebSearchProviderIds = collectConfiguredWebSearchProviderIds(config);
	const configuredGenerationProviderIds = collectConfiguredGenerationProviderIds(config);
	const configuredVoiceProviderIds = collectConfiguredVoiceProviderIds(config);
	return sortUniquePluginIds([
		...collectConfiguredSpeechProviderIds(config),
		...configuredWebSearchProviderIds,
		...configuredGenerationProviderIds.imageGenerationProviders,
		...configuredGenerationProviderIds.videoGenerationProviders,
		...configuredGenerationProviderIds.musicGenerationProviders,
		...configuredVoiceProviderIds.speechProviders,
		...configuredVoiceProviderIds.realtimeTranscriptionProviders,
		...configuredVoiceProviderIds.realtimeVoiceProviders,
		...collectConfiguredMemoryEmbeddingProviderIds(config)
	]);
}
function collectValidationConfiguredRefs(config) {
	const providerIds = [];
	const pushProviderId = (value) => {
		if (typeof value !== "string") return;
		const normalized = normalizeOptionalLowercaseString(value);
		if (normalized) providerIds.push(normalized);
	};
	const profiles = config.auth?.profiles;
	if (profiles && typeof profiles === "object") {
		for (const profile of Object.values(profiles)) if (isRecord(profile)) pushProviderId(profile.provider);
	}
	const providers = config.models?.providers;
	if (providers && typeof providers === "object") for (const providerId of Object.keys(providers)) pushProviderId(providerId);
	const shorthandModelRefs = [];
	for (const ref of collectConfiguredModelRefs(config)) {
		const slashIndex = ref.value.indexOf("/");
		if (slashIndex > 0) pushProviderId(ref.value.slice(0, slashIndex));
		else if (slashIndex < 0) shorthandModelRefs.push(ref.value);
	}
	pushProviderId(config.tools?.web?.search?.provider);
	pushProviderId(config.tools?.web?.fetch?.provider);
	return {
		providerIds: sortUniquePluginIds(providerIds),
		shorthandModelRefs
	};
}
function collectValidationConfiguredShorthandModelIds(modelRefs) {
	return sortUniquePluginIds(modelRefs.map((ref) => splitTrailingAuthProfile(ref).model.trim()).filter(Boolean));
}
//#endregion
export { createMemorySearchDeadlineControl as A, collectRegisteredEmbeddingProviderIds as C, listRegisteredEmbeddingProviders as D, getRegisteredEmbeddingProvider as E, sanitizeAndNormalizeEmbedding as F, withRemoteHttpResponse as M, createProviderHttpError as N, getCoreEmbeddingProvider as O, readEmbeddingVectors as P, collectConfiguredWebSearchProviderIds as S, manifestOwnsConfiguredModelProvider as T, collectConfiguredAgentModelProviderIds as _, collectConfiguredProviderIds as a, collectConfiguredMemoryEmbeddingStartupProviderOwners as b, collectValidationConfiguredShorthandModelIds as c, readStartupBundledDiscoveryMode as d, resolveAuthorizedGatewayStartupDreamingPluginIds as f, sortUniquePluginIds as g, shouldConsiderForGatewayStartup as h, blocksPluginStartup as i, buildRemoteBaseUrlPolicy as j, MEMORY_SEARCH_DEADLINE_CONTROL as k, hasConfiguredActivationPath as l, resolveMemorySlotStartupPluginId as m, addConfiguredSlotPluginIds as n, collectConfiguredStartupChannelIds as o, resolveContextEngineSlotStartupPluginId as p, addPluginConfigEntryIds as r, collectValidationConfiguredRefs as s, addConfiguredActivationPathPluginIds as t, normalizePluginsConfigForInstalledIndex as u, collectConfiguredGenerationProviderIds as v, collectUnregisteredConfiguredMemoryEmbeddingProviders as w, collectConfiguredVoiceProviderIds as x, collectConfiguredMemoryEmbeddingProviderIds as y };
