import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { h as parseSecretRef } from "./types.secrets-DsPRn9Dz.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { a as resolveMergedModelProviderConfig } from "./model-provider-config-C5LPYz3z.mjs";
import { l as getRuntimeConfigSourceSnapshot, o as getRuntimeConfigSnapshot, w as selectApplicableRuntimeConfig } from "./runtime-snapshot-DYptB0Cf.mjs";
import { a as isAuthModeAllowedForModel } from "./model-runtime-policy-Bz7NzEHI.mjs";
import "./config-CzeZu5J_.mjs";
import { n as resolveApiKeyForProfile } from "./oauth-DPCtruSK.mjs";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-DBJvdk-L.mjs";
import { n as readCodexCliCredentialsCached } from "./cli-credentials-iMPJTQjZ.mjs";
import { o as getModelProviderRequestTransport, r as attachModelProviderRequestTransport } from "./provider-request-config-By9R9pyt.mjs";
import { a as resolveAuthProfileOrder, f as listProfilesForProvider } from "./order-B7W96aON.mjs";
import { l as isSecretRefHeaderValueMarker, s as isNonSecretApiKeyMarker } from "./model-auth-markers-Cuz_bq6T.mjs";
import "./model-auth-env-CI3qSPg4.mjs";
import { c as mintSecretSentinel } from "./sentinel-D8TyDpFw.mjs";
import { d as providerConfigMatchesRuntimeSnapshot, g as resolveProviderAuthOverride, h as resolveInlineProviderApiKeyCooldownUntil, l as profileTypeToAuthMode, m as resolveConfiguredAwsSdkProfileAuth, o as hasUsableCustomProviderApiKey, p as resolveConfigAwareEnvApiKey, s as isConfigBackedInlineProviderApiKey, x as resolveUsableCustomProviderApiKey } from "./model-auth-provider-config-U8dA4bob.mjs";
import "./auth-profiles-DqHEfJ-y.mjs";
import { r as resolveScopedAuthProfileStore, s as prepareSyntheticLocalProviderAuth, t as resolveApiKeyForProviderCore } from "./model-auth-provider-BJK6Yjjx.mjs";
//#region src/agents/model-auth-model.ts
/**
* Model-level auth diagnostics and request-header preparation.
*/
const log = createSubsystemLogger("model-auth");
/** Reports the strongest configured auth mode for provider-list UI and diagnostics. */
function resolveModelAuthMode(provider, cfg, store, options) {
	const resolved = provider?.trim();
	if (!resolved) return;
	if (resolveProviderAuthOverride(cfg, resolved) === "aws-sdk") return "aws-sdk";
	const authStore = store ?? resolveScopedAuthProfileStore({
		cfg,
		provider: resolved
	});
	const profiles = listProfilesForProvider(authStore, resolved);
	const modes = new Set(profiles.map((id) => authStore.profiles[id]?.type).filter((mode) => mode === "oauth" || mode === "token" || mode === "api_key"));
	if (modes.size >= 2) return "mixed";
	const [mode] = modes;
	if (mode) return profileTypeToAuthMode(mode);
	const envKey = resolveConfigAwareEnvApiKey(cfg, resolved, options?.workspaceDir);
	if (envKey?.apiKey) return envKey.source.includes("OAUTH_TOKEN") ? "oauth" : "api-key";
	if (normalizeProviderId(resolved) === "codex" && readCodexCliCredentialsCached({
		ttlMs: 5e3,
		allowKeychainPrompt: false
	})) return "oauth";
	if (hasUsableCustomProviderApiKey(cfg, resolved)) return "api-key";
	return "unknown";
}
/** Checks provider auth availability, including profile fallback order. */
async function hasAvailableAuthForProvider(params) {
	const { provider, cfg, preferredProfile } = params;
	if (resolveProviderAuthOverride(cfg, provider) === "aws-sdk") return true;
	const store = params.store ?? resolveScopedAuthProfileStore({
		agentDir: params.agentDir,
		cfg,
		provider,
		preferredProfile
	});
	const inlineUnusableUntil = resolveInlineProviderApiKeyCooldownUntil(store, provider);
	const inlineProviderApiKeyUsable = typeof inlineUnusableUntil !== "number" || inlineUnusableUntil <= Date.now();
	const envAuth = resolveConfigAwareEnvApiKey(cfg, provider, params.workspaceDir);
	if (envAuth && isAuthModeAllowedForModel({
		provider,
		modelApi: params.modelApi,
		modelBaseUrl: params.modelBaseUrl,
		mode: envAuth.source.includes("OAUTH_TOKEN") ? "oauth" : "api-key"
	}) && (!isConfigBackedInlineProviderApiKey({
		cfg,
		provider,
		source: envAuth.source,
		store
	}) || inlineProviderApiKeyUsable)) return true;
	if (resolveUsableCustomProviderApiKey({
		cfg,
		provider
	}) && inlineProviderApiKeyUsable) return true;
	const syntheticLocalAuth = await prepareSyntheticLocalProviderAuth({
		cfg,
		provider,
		workspaceDir: params.workspaceDir
	});
	if (syntheticLocalAuth && (!isConfigBackedInlineProviderApiKey({
		cfg,
		provider,
		source: syntheticLocalAuth.source,
		store
	}) || inlineProviderApiKeyUsable)) return true;
	const order = resolveAuthProfileOrder({
		cfg,
		store,
		provider,
		preferredProfile,
		forModel: params.modelId,
		includePendingOAuthRefresh: true
	});
	for (const candidate of order) try {
		if (resolveConfiguredAwsSdkProfileAuth({
			cfg,
			provider,
			profileId: candidate
		})) return true;
		const candidateCredential = store.profiles[candidate];
		const candidateType = candidateCredential?.type;
		if (candidateType && !isAuthModeAllowedForModel({
			provider,
			modelApi: params.modelApi,
			modelBaseUrl: params.modelBaseUrl,
			mode: profileTypeToAuthMode(candidateType),
			authFlow: candidateCredential?.type === "oauth" ? candidateCredential.authFlow : void 0
		})) continue;
		const resolved = await resolveApiKeyForProfile({
			cfg,
			store,
			profileId: candidate,
			agentDir: params.agentDir
		});
		const credential = resolved?.credential ?? store.profiles[candidate];
		const mode = resolved?.profileType ?? credential?.type;
		if (resolved && isAuthModeAllowedForModel({
			provider,
			modelApi: params.modelApi,
			modelBaseUrl: params.modelBaseUrl,
			mode: mode ? profileTypeToAuthMode(mode) : "api-key",
			authFlow: credential?.type === "oauth" ? credential.authFlow : void 0
		})) return true;
	} catch (err) {
		log.debug?.(`auth profile "${candidate}" failed for provider "${provider}": ${String(err)}`);
	}
	return false;
}
/** Resolves request credentials from the provider attached to a model descriptor. */
async function getApiKeyForModelCore(params) {
	return resolveApiKeyForProviderCore({
		provider: params.model.provider,
		cfg: params.cfg,
		profileId: params.profileId,
		preferredProfile: params.preferredProfile,
		store: params.store,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		lockedProfile: params.lockedProfile,
		credentialPrecedence: params.credentialPrecedence,
		allowAuthProfileFallback: params.allowAuthProfileFallback,
		skipSetupProviderFallback: params.skipSetupProviderFallback,
		modelId: params.model.id,
		modelApi: params.model.api,
		modelBaseUrl: params.model.baseUrl,
		secretSentinels: params.secretSentinels
	});
}
/** Clears auth for local OpenAI-compatible servers that explicitly use no auth. */
function applyLocalNoAuthHeaderOverride(model, auth) {
	if (auth?.apiKey !== "custom-local" || model.api !== "openai-completions") return model;
	const headers = {
		...model.headers,
		Authorization: null
	};
	return {
		...model,
		headers
	};
}
function applySecretRefHeaderSentinels(model, cfg) {
	if (!model.headers) return model;
	const runtimeConfig = getRuntimeConfigSnapshot();
	const runtimeSourceConfig = getRuntimeConfigSourceSnapshot();
	const usesRuntimeProvider = selectApplicableRuntimeConfig({
		inputConfig: cfg,
		runtimeConfig,
		runtimeSourceConfig
	}) === runtimeConfig || providerConfigMatchesRuntimeSnapshot({
		inputConfig: cfg,
		runtimeConfig,
		provider: model.provider
	});
	if (!runtimeConfig || !runtimeSourceConfig || !usesRuntimeProvider) return model;
	const sourceProvider = resolveMergedModelProviderConfig(runtimeSourceConfig, model.provider);
	const runtimeProvider = resolveMergedModelProviderConfig(runtimeConfig, model.provider);
	const replacements = /* @__PURE__ */ new Map();
	const isManagedSecret = (value) => parseSecretRef(value) !== null || typeof value === "string" && isSecretRefHeaderValueMarker(value);
	const addReplacement = (name, value, replacement) => {
		replacements.set(name.trim().toLowerCase(), {
			value,
			replacement: replacement ?? mintSecretSentinel(value, { label: `model-auth:${model.provider}` })
		});
	};
	for (const [sourceHeaders, runtimeHeaders] of [[sourceProvider?.headers, runtimeProvider?.headers], [sourceProvider?.request?.headers, runtimeProvider?.request?.headers]]) for (const [name, sourceValue] of Object.entries(sourceHeaders ?? {})) {
		if (!isManagedSecret(sourceValue)) continue;
		const value = normalizeOptionalSecretInput(runtimeHeaders?.[name]);
		if (value) addReplacement(name, value);
	}
	const sourceAuth = sourceProvider?.request?.auth;
	const runtimeAuth = runtimeProvider?.request?.auth;
	const attachedRequest = getModelProviderRequestTransport(model);
	let protectedRequest = attachedRequest;
	let protectedRequestHeaders;
	for (const [name, sourceValue] of Object.entries(sourceProvider?.request?.headers ?? {})) {
		if (!isManagedSecret(sourceValue)) continue;
		const value = normalizeOptionalSecretInput(runtimeProvider?.request?.headers?.[name]);
		if (!value || attachedRequest?.headers?.[name] !== value) continue;
		protectedRequestHeaders ??= { ...attachedRequest.headers };
		protectedRequestHeaders[name] = mintSecretSentinel(value, { label: `model-auth:${model.provider}` });
	}
	if (protectedRequestHeaders && attachedRequest) protectedRequest = {
		...attachedRequest,
		headers: protectedRequestHeaders
	};
	if (sourceAuth?.mode === "authorization-bearer" && runtimeAuth?.mode === "authorization-bearer" && isManagedSecret(sourceAuth.token)) {
		const token = normalizeOptionalSecretInput(runtimeAuth.token)?.trim();
		if (token) {
			if (attachedRequest?.auth?.mode === "authorization-bearer") protectedRequest = {
				...protectedRequest,
				auth: {
					...attachedRequest.auth,
					token: mintSecretSentinel(token, { label: `model-auth:${model.provider}` })
				}
			};
			addReplacement("Authorization", `Bearer ${token}`, `Bearer ${mintSecretSentinel(token, { label: `model-auth:${model.provider}` })}`);
		}
	} else if (sourceAuth?.mode === "header" && runtimeAuth?.mode === "header" && isManagedSecret(sourceAuth.value)) {
		const value = normalizeOptionalSecretInput(runtimeAuth.value)?.trim();
		const headerName = runtimeAuth.headerName.trim();
		const prefix = runtimeAuth.prefix?.trim() ?? "";
		if (headerName && value) {
			if (attachedRequest?.auth?.mode === "header") protectedRequest = {
				...protectedRequest,
				auth: {
					...attachedRequest.auth,
					value: mintSecretSentinel(value, { label: `model-auth:${model.provider}` })
				}
			};
			addReplacement(headerName, `${prefix}${value}`, `${prefix}${mintSecretSentinel(value, { label: `model-auth:${model.provider}` })}`);
		}
	}
	let headers;
	for (const [name, value] of Object.entries(model.headers)) {
		const replacement = replacements.get(name.trim().toLowerCase());
		if (replacement?.value !== value) continue;
		headers ??= { ...model.headers };
		headers[name] = replacement.replacement;
	}
	const protectedModel = headers ? {
		...model,
		headers
	} : model;
	return protectedRequest && protectedRequest !== attachedRequest ? attachModelProviderRequestTransport(protectedModel, protectedRequest) : protectedModel;
}
/** Uses the configured standard bearer header for SDKs with vendor-specific auth defaults. */
function applyAuthHeaderOverride(model, auth, cfg) {
	const sentinelModel = applySecretRefHeaderSentinels(model, cfg);
	if (!auth?.apiKey || isNonSecretApiKeyMarker(auth.apiKey)) return sentinelModel;
	if (!resolveMergedModelProviderConfig(cfg, sentinelModel.provider)?.authHeader) return sentinelModel;
	const headers = {};
	if (sentinelModel.headers) {
		for (const [key, value] of Object.entries(sentinelModel.headers)) if (normalizeOptionalLowercaseString(key) !== "authorization") headers[key] = value;
	}
	headers.Authorization = `Bearer ${auth.apiKey}`;
	return {
		...sentinelModel,
		headers
	};
}
//#endregion
export { hasAvailableAuthForProvider as a, getApiKeyForModelCore as i, applyLocalNoAuthHeaderOverride as n, resolveModelAuthMode as o, applySecretRefHeaderSentinels as r, applyAuthHeaderOverride as t };
