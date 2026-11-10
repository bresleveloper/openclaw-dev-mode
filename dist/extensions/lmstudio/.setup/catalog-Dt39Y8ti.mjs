import { a as mapLmstudioWireModels, c as LMSTUDIO_DEFAULT_API_KEY_ENV_VAR, n as resolveLmstudioProviderAuthMode, o as resolveLmstudioInferenceBase, r as resolvePersistedLmstudioApiKey, s as resolveLmstudioServerBase, t as hasLmstudioAuthorizationHeader, u as LMSTUDIO_PROVIDER_ID } from "./provider-auth-DfEcaIpJ.mjs";
import { isKnownEnvApiKeyMarker, isNonSecretApiKeyMarker, normalizeApiKeyConfig, normalizeOptionalSecretInput } from "openclaw/plugin-sdk/provider-auth";
import { isRecord, normalizeOptionalString, normalizeUniqueTrimmedStringList } from "openclaw/plugin-sdk/string-coerce-runtime";
import { LiveModelCatalogHttpError, runLiveProviderCatalog } from "openclaw/plugin-sdk/provider-catalog-live-runtime";
import { createSubsystemLogger } from "openclaw/plugin-sdk/logging-core";
import { resolveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import { readProviderJsonArrayFieldResponse } from "openclaw/plugin-sdk/provider-http";
import "openclaw/plugin-sdk/response-limit-runtime";
import { fetchWithSsrFGuard } from "openclaw/plugin-sdk/ssrf-runtime";
import "openclaw/plugin-sdk/provider-auth-runtime";
import { resolveConfiguredSecretInputString } from "openclaw/plugin-sdk/secret-input-runtime";
import "openclaw/plugin-sdk/setup-tools";
//#region extensions/lmstudio/src/runtime.ts
var LmstudioConfigResolutionError = class extends Error {};
function buildLmstudioAuthHeaders(params) {
	const headers = { ...params.headers };
	const apiKey = params.apiKey?.trim();
	if (apiKey && !(apiKey === "lmstudio-local") && !isNonSecretApiKeyMarker(apiKey)) {
		for (const headerName of Object.keys(headers)) if (headerName.toLowerCase() === "authorization") delete headers[headerName];
		headers.Authorization = `Bearer ${apiKey}`;
	}
	if (params.json) headers["Content-Type"] = "application/json";
	return Object.keys(headers).length > 0 ? headers : void 0;
}
function sanitizeLmstudioStringHeaders(headers) {
	if (!headers || typeof headers !== "object" || Array.isArray(headers)) return;
	const next = {};
	for (const [headerName, headerValue] of Object.entries(headers)) {
		const normalized = normalizeOptionalString(headerValue);
		if (normalized) next[headerName] = normalized;
	}
	return Object.keys(next).length > 0 ? next : void 0;
}
async function resolveLmstudioConfiguredApiKeyForProvider(params) {
	const config = params.config;
	const apiKeyInput = (config?.models?.providers?.[params.providerId])?.apiKey;
	if (apiKeyInput === void 0 || apiKeyInput === null || !config) return;
	const path = params.path ?? `models.providers[${JSON.stringify(params.providerId)}].apiKey`;
	const env = params.env ?? process.env;
	const directApiKey = normalizeOptionalSecretInput(apiKeyInput);
	const resolved = await resolveConfiguredSecretInputString({
		config,
		env,
		value: directApiKey ?? apiKeyInput,
		path,
		unresolvedReasonStyle: "detailed"
	});
	if (resolved.unresolvedRefReason) {
		if (params.allowUnresolved) return;
		throw new LmstudioConfigResolutionError(`${path}: ${resolved.unresolvedRefReason}`);
	}
	const resolvedValue = normalizeOptionalSecretInput(resolved.value);
	const trimmed = resolvedValue ? normalizeApiKeyConfig(resolvedValue).trim() : "";
	if (!trimmed) return;
	if (directApiKey !== void 0 && isKnownEnvApiKeyMarker(trimmed)) return normalizeOptionalSecretInput(env[trimmed]);
	return isNonSecretApiKeyMarker(trimmed) ? void 0 : trimmed;
}
async function resolveLmstudioConfiguredApiKey(params) {
	return await resolveLmstudioConfiguredApiKeyForProvider({
		...params,
		providerId: LMSTUDIO_PROVIDER_ID
	});
}
async function resolveLmstudioProviderHeaders(params) {
	const headerInputs = params.headers;
	if (!headerInputs || typeof headerInputs !== "object" || Array.isArray(headerInputs)) return;
	if (!params.config) return sanitizeLmstudioStringHeaders(headerInputs);
	const pathPrefix = params.path ?? "models.providers.lmstudio.headers";
	const resolved = {};
	for (const [headerName, headerValue] of Object.entries(headerInputs)) {
		const resolvedHeader = await resolveConfiguredSecretInputString({
			config: params.config,
			env: params.env ?? process.env,
			value: headerValue,
			path: `${pathPrefix}[${JSON.stringify(headerName)}]`,
			unresolvedReasonStyle: "detailed"
		});
		if (resolvedHeader.unresolvedRefReason) throw new LmstudioConfigResolutionError(`${pathPrefix}.${headerName}: ${resolvedHeader.unresolvedRefReason}`);
		const resolvedValue = resolvedHeader.value;
		if (!resolvedValue) continue;
		resolved[headerName] = resolvedValue;
	}
	return Object.keys(resolved).length > 0 ? resolved : void 0;
}
//#endregion
//#region extensions/lmstudio/src/models.fetch.ts
const log = createSubsystemLogger("extensions/lmstudio/models");
async function fetchLmstudioEndpoint(params) {
	params.signal?.throwIfAborted();
	const timeoutMs = resolveTimerTimeoutMs(params.timeoutMs, 1);
	let response;
	let release;
	if (params.ssrfPolicy) {
		const guarded = await fetchWithSsrFGuard({
			url: params.url,
			init: params.init,
			timeoutMs,
			signal: params.signal,
			fetchImpl: params.fetchImpl,
			policy: params.ssrfPolicy,
			auditContext: params.auditContext
		});
		response = guarded.response;
		release = guarded.release;
	} else {
		response = await (params.fetchImpl ?? fetch)(params.url, {
			...params.init,
			signal: params.signal ? AbortSignal.any([params.signal, AbortSignal.timeout(timeoutMs)]) : AbortSignal.timeout(timeoutMs)
		});
		release = async () => void 0;
	}
	return {
		response,
		release: async () => {
			if (!response.bodyUsed) response.body?.cancel().catch(() => void 0);
			await release();
		}
	};
}
/** Fetches /api/v1/models and reports transport reachability separately from HTTP status. */
async function fetchLmstudioModels(params) {
	const baseUrl = resolveLmstudioServerBase(params.baseUrl);
	const timeoutMs = params.timeoutMs ?? 5e3;
	try {
		const { response, release } = await fetchLmstudioEndpoint({
			url: `${baseUrl}/api/v1/models`,
			init: { headers: buildLmstudioAuthHeaders({
				apiKey: params.apiKey,
				headers: params.headers
			}) },
			timeoutMs,
			signal: params.signal,
			fetchImpl: params.fetchImpl,
			ssrfPolicy: params.ssrfPolicy,
			auditContext: "lmstudio-model-discovery"
		});
		try {
			if (!response.ok) return {
				reachable: true,
				status: response.status,
				models: []
			};
			const models = await readProviderJsonArrayFieldResponse(response, "LM Studio model list", "models");
			const validModels = models.filter(isRecord);
			if (models.length > 0 && validModels.length === 0) throw new Error("LM Studio model list: malformed JSON response");
			return {
				reachable: true,
				status: response.status,
				models: validModels
			};
		} finally {
			await release();
		}
	} catch (error) {
		return {
			reachable: false,
			models: [],
			error
		};
	}
}
async function discoverLmstudioModels(params) {
	const fetched = await fetchLmstudioModels({
		baseUrl: params.baseUrl,
		apiKey: params.apiKey,
		headers: params.headers,
		fetchImpl: params.fetchImpl
	});
	const quiet = params.quiet;
	if (!fetched.reachable || fetched.status !== void 0 && fetched.status >= 400) {
		const error = fetched.status === void 0 ? fetched.error : new LiveModelCatalogHttpError("lmstudio", fetched.status);
		if (params.discoveryMode === "strict") throw error;
		if (!quiet) log.debug(`Failed to discover LM Studio models: ${String(error)}`);
		return [];
	}
	params.onListedModels?.(fetched.models);
	return mapLmstudioWireModels(fetched.models, "runtime");
}
//#endregion
//#region extensions/lmstudio/src/catalog.ts
async function discoverLmstudioProvider(ctx, options) {
	if (ctx.providerIds && !ctx.providerIds.includes("lmstudio")) return null;
	const explicit = ctx.config.models?.providers?.[LMSTUDIO_PROVIDER_ID];
	const { headers: _headers, auth: explicitAuth, apiKey: _apiKey, ...explicitWithoutHeaders } = explicit ?? {};
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
	const catalogProfileId = !hasAuthorizationHeader && discoveryApiKey && !isNonSecretApiKeyMarker(discoveryApiKey) ? profileId : void 0;
	const run = async () => {
		let modelIdCatalog;
		const models = !options && explicit?.models?.length ? explicit.models : await discoverLmstudioModels({
			onListedModels: (rows) => {
				modelIdCatalog = {
					baseUrl,
					modelIds: normalizeUniqueTrimmedStringList(rows.flatMap((row) => [row.key, ...row.loaded_instances?.map((instance) => instance?.id) ?? []])),
					aliases: normalizeUniqueTrimmedStringList(rows.flatMap((row) => row.key?.trim() ? [row.selected_variant, ...normalizeUniqueTrimmedStringList(row.variants)] : []))
				};
			},
			baseUrl,
			apiKey: resolvedDiscoveryApiKey ?? "",
			headers: resolvedHeaders,
			quiet,
			...!quiet && options ? options : {}
		});
		const outcomes = modelIdCatalog ? [{
			provider: LMSTUDIO_PROVIDER_ID,
			profileId: catalogProfileId,
			status: "ready",
			modelIdCatalog
		}] : void 0;
		if (models.length === 0 && (options ? quiet : !apiKey && !explicit?.apiKey)) return options && outcomes ? {
			providers: {},
			outcomes
		} : null;
		const persistedApiKey = resolvePersistedLmstudioApiKey({
			currentApiKey: resolvedApiKey,
			explicitAuth,
			fallbackApiKey: LMSTUDIO_DEFAULT_API_KEY_ENV_VAR,
			hasModels: models.length > 0,
			hasAuthorizationHeader
		});
		const persistedAuth = resolveLmstudioProviderAuthMode(persistedApiKey);
		return {
			...outcomes ? { outcomes } : {},
			provider: {
				...explicitWithoutHeaders,
				baseUrl,
				api: explicit?.api ?? "openai-completions",
				...resolvedHeaders ? { headers: resolvedHeaders } : {},
				...persistedApiKey ? { apiKey: persistedApiKey } : {},
				...persistedAuth ? { auth: persistedAuth } : {},
				models
			}
		};
	};
	return options ? await runLiveProviderCatalog({
		providerId: LMSTUDIO_PROVIDER_ID,
		profileId: catalogProfileId,
		run
	}) : await run();
}
//#endregion
export { discoverLmstudioProvider };
