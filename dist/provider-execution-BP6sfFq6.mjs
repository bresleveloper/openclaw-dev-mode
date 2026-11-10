import { s as normalizeNullableString } from "./string-coerce-1VuiLaaR.mjs";
import { n as findNormalizedProviderValue } from "./provider-id-D1VImdKk.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { o as resolveExecutablePath } from "./executable-path-hXcbMo0b.mjs";
import { r as assertSecretOwnerAvailable } from "./runtime-degraded-state-SptB0g_t.mjs";
import { n as CUSTOM_LOCAL_AUTH_MARKER } from "./model-auth-markers-Clx9vUna.mjs";
import { c as mergeModelProviderRequestOverrides, m as sanitizeConfiguredProviderRequest, p as sanitizeConfiguredModelProviderRequest } from "./provider-request-config-WdycwKIG.mjs";
import { i as assertRuntimeMediaRequestSecretOwnerAvailable } from "./entry-capabilities-uCzDotfm.mjs";
import { n as normalizeMediaProviderId } from "./provider-id-BZvihdyi.mjs";
import { t as resolveCliModelEntry } from "./resolve-t14Gdp_w.mjs";
import { o as resolveTransientProviderRetryOptions, r as providerOperationRetryConfig } from "./operation-retry-B2m6H7IT.mjs";
import { n as executeWithApiKeyRotation, t as collectProviderApiKeysForExecution } from "./api-key-rotation-Dw4l5GMT.mjs";
import { n as resolveOpenAiAudioAuthModelApi } from "./openai-audio-api-CZK5TvIV.mjs";
import { n as getMediaUnderstandingProvider } from "./provider-registry-BXxQV3kt.mjs";
//#region src/media-understanding/provider-execution.ts
function resolveProviderRequestContext(params) {
	const providerConfig = findNormalizedProviderValue(params.cfg.models?.providers, params.providerId);
	const baseUrl = params.entry.baseUrl ?? params.config?.baseUrl ?? providerConfig?.baseUrl;
	const mergedHeaders = {};
	for (const headers of [
		providerConfig?.headers,
		params.config?.headers,
		params.entry.headers
	]) for (const [key, value] of Object.entries(headers ?? {})) if (typeof value === "string") mergedHeaders[key] = value;
	return {
		baseUrl,
		headers: Object.keys(mergedHeaders).length > 0 ? mergedHeaders : void 0,
		request: mergeModelProviderRequestOverrides(sanitizeConfiguredModelProviderRequest(providerConfig?.request), sanitizeConfiguredProviderRequest(params.config?.request), sanitizeConfiguredProviderRequest(params.entry.request))
	};
}
const loadModelAuth = createLazyRuntimeModule(async () => {
	const { hasAvailableAuthForProvider, isProviderAuthError, requireApiKey, resolveApiKeyForProviderCore } = await import("./model-auth-BajGa6yN.mjs");
	return {
		hasAvailableAuthForProvider,
		isProviderAuthError,
		requireApiKey,
		resolveApiKeyForProviderCore
	};
});
async function hasProviderAuthAvailable(params) {
	if (normalizeNullableString(findNormalizedProviderValue(params.cfg?.models?.providers, params.provider)?.apiKey)) return true;
	const { hasAvailableAuthForProvider } = await loadModelAuth();
	return await hasAvailableAuthForProvider({
		...params,
		modelApi: resolveOpenAiAudioAuthModelApi({
			capability: params.capability,
			providerId: params.provider
		})
	});
}
function assertMediaExecutionCurrent(execution) {
	execution?.signal.throwIfAborted();
	execution?.assertCurrent();
}
function executeProviderRequest(provider, auth, execute, execution) {
	const invoke = (requestAuth) => {
		assertMediaExecutionCurrent(execution);
		return execute(requestAuth);
	};
	const retry = resolveTransientProviderRetryOptions(providerOperationRetryConfig("read"));
	return auth.kind === "api-key" ? executeWithApiKeyRotation({
		provider,
		apiKeys: auth.apiKeys,
		transientRetry: retry && {
			...retry,
			signal: execution?.signal
		},
		execute: (apiKey) => invoke({
			apiKey,
			auth: {
				kind: "api-key",
				apiKey,
				source: auth.source
			}
		})
	}) : invoke({
		apiKey: CUSTOM_LOCAL_AUTH_MARKER,
		auth: {
			kind: "none",
			source: auth.source ?? `provider:${provider}`
		}
	});
}
/** Availability uses the same hooks, secrets, and credential owner as execution. */
async function isAudioModelEntryAvailable(params) {
	const { entry } = params;
	if ((entry.type ?? (entry.command ? "cli" : "provider")) === "cli") {
		const cli = resolveCliModelEntry(entry);
		return cli.ok && Boolean(resolveExecutablePath(cli.value.command));
	}
	const providerId = normalizeMediaProviderId(entry.provider ?? "");
	const provider = getMediaUnderstandingProvider(providerId, params.providerRegistry);
	if (!provider?.transcribeAudio && !provider?.transcribeAudioWithContext) return false;
	try {
		assertRuntimeMediaRequestSecretOwnerAvailable({
			capability: "audio",
			entry
		});
		if (params.secretOwnerId) assertSecretOwnerAvailable("capability", params.secretOwnerId);
		if (provider.isAudioConfigured) return await provider.isAudioConfigured({
			cfg: params.cfg,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			profile: entry.profile,
			preferredProfile: entry.preferredProfile,
			model: entry.model,
			...resolveProviderRequestContext({
				...params,
				providerId,
				config: params.cfg.tools?.media?.audio
			})
		});
		if (!provider.transcribeAudioWithContext) await resolveProviderExecutionAuth({
			...params,
			capability: "audio",
			providerId,
			provider
		});
		return true;
	} catch {
		return false;
	}
}
async function resolveProviderExecutionAuth(params) {
	const apiKeyAuth = (apiKey, source) => ({
		kind: "api-key",
		apiKeys: collectProviderApiKeysForExecution({
			provider: params.providerId,
			primaryApiKey: apiKey
		}),
		source
	});
	const providerConfig = findNormalizedProviderValue(params.cfg.models?.providers, params.providerId);
	const literalApiKey = normalizeNullableString(params.cfg.models?.providers?.[params.providerId]?.apiKey);
	if (literalApiKey) return apiKeyAuth(literalApiKey, `models.providers.${params.providerId}.apiKey`);
	const { isProviderAuthError, requireApiKey, resolveApiKeyForProviderCore } = await loadModelAuth();
	try {
		const auth = await resolveApiKeyForProviderCore({
			provider: params.providerId,
			cfg: params.cfg,
			profileId: params.entry.profile,
			preferredProfile: params.entry.preferredProfile,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			modelApi: resolveOpenAiAudioAuthModelApi({
				capability: params.capability,
				providerId: params.providerId
			})
		});
		return apiKeyAuth(requireApiKey(auth, params.providerId), auth.source);
	} catch (err) {
		if (!isProviderAuthError(err, "missing-provider-auth") && !isProviderAuthError(err, "missing-api-key")) throw err;
		const context = {
			config: params.cfg,
			provider: params.providerId,
			providerConfig
		};
		const providerAuth = params.provider?.resolveAuth?.(context);
		if (providerAuth?.kind === "none") return providerAuth;
		const keyAuth = providerAuth ?? params.provider?.resolveSyntheticAuth?.(context);
		const apiKey = keyAuth?.apiKey.trim();
		if (apiKey) return apiKeyAuth(apiKey, keyAuth?.source);
		throw err;
	}
}
//#endregion
export { resolveProviderExecutionAuth as a, isAudioModelEntryAvailable as i, executeProviderRequest as n, resolveProviderRequestContext as o, hasProviderAuthAvailable as r, assertMediaExecutionCurrent as t };
