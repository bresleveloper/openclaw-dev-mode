import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { h as parseSecretRef } from "./types.secrets-Dgbd2kyP.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { T as selectApplicableRuntimeConfig, l as getRuntimeConfigSourceSnapshot, o as getRuntimeConfigSnapshot } from "./runtime-snapshot-BBYDJbw9.mjs";
import { a as resolveMergedModelProviderConfig } from "./model-provider-config-wdC9jpCz.mjs";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-DBJvdk-L.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { a as isAuthModeAllowedForModel } from "./model-runtime-policy-DSkspt0X.mjs";
import "./config-B3oiWDlr.mjs";
import { a as resolveAuthProfileOrder, f as listProfilesForProvider } from "./order-CElLtwMu.mjs";
import { l as isSecretRefHeaderValueMarker, s as isNonSecretApiKeyMarker } from "./model-auth-markers-Clx9vUna.mjs";
import { c as mintSecretSentinel } from "./sentinel-DZP_CK2t.mjs";
import { r as readCodexCliCredentialsCached } from "./cli-credentials-DmMCeh52.mjs";
import { o as getModelProviderRequestTransport, r as attachModelProviderRequestTransport } from "./provider-request-config-WdycwKIG.mjs";
import "./model-auth-env-CPdn6zH8.mjs";
import { a as hasUsableCustomProviderApiKey, b as resolveUsableCustomProviderApiKey, c as profileTypeToAuthMode, f as resolveConfigAwareEnvApiKey, h as resolveProviderAuthOverride, m as resolveInlineProviderApiKeyCooldownUntil, o as isConfigBackedInlineProviderApiKey, p as resolveConfiguredAwsSdkProfileAuth, u as providerConfigMatchesRuntimeSnapshot } from "./model-auth-provider-config-C_EL9CxV.mjs";
import { n as resolveApiKeyForProfile } from "./oauth-RJ_g0pTu.mjs";
import "./auth-profiles-DB76NhmT.mjs";
import { i as prepareSyntheticLocalProviderAuth } from "./model-auth-runtime-B0WXiQBY.mjs";
import { i as resolveScopedAuthProfileStoreAsync, r as resolveScopedAuthProfileStore, t as resolveApiKeyForProviderCore } from "./model-auth-provider-Dci0IxqM.mjs";
//#region src/agents/model-auth-model.ts
const log = createSubsystemLogger("model-auth");
/** @deprecated Use resolveModelAuthModeAsync. Supported through 2026-12-31. */
function resolveModelAuthMode(provider, cfg, store, options) {
	const resolved = provider?.trim();
	if (!resolved) return;
	if (resolveProviderAuthOverride(cfg, resolved) === "aws-sdk") return "aws-sdk";
	if (!store) warnPluginSdkDeprecation({
		family: "auth-profiles",
		method: "resolveModelAuthMode",
		replacement: "resolveModelAuthModeAsync"
	});
	return resolveModelAuthModeFromStore(resolved, cfg, store ?? resolveScopedAuthProfileStore({
		cfg,
		provider: resolved
	}), options);
}
async function resolveModelAuthModeAsync(provider, cfg, store, options) {
	const resolved = provider?.trim();
	if (!resolved) return;
	if (resolveProviderAuthOverride(cfg, resolved) === "aws-sdk") return "aws-sdk";
	return resolveModelAuthModeFromStore(resolved, cfg, store ?? await resolveScopedAuthProfileStoreAsync({
		cfg,
		provider: resolved
	}), options);
}
function resolveModelAuthModeFromStore(resolved, cfg, authStore, options) {
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
async function hasAvailableAuthForProvider(params) {
	const { provider, cfg, preferredProfile } = params;
	if (resolveProviderAuthOverride(cfg, provider) === "aws-sdk") return true;
	const store = params.store ?? await resolveScopedAuthProfileStoreAsync({
		agentDir: params.agentDir,
		cfg,
		provider,
		preferredProfile
	});
	const inlineUnusableUntil = resolveInlineProviderApiKeyCooldownUntil(store, provider);
	const inlineProviderApiKeyUsable = typeof inlineUnusableUntil !== "number" || inlineUnusableUntil <= Date.now();
	const isUsableSource = (source) => !isConfigBackedInlineProviderApiKey({
		cfg,
		provider,
		source,
		store
	}) || inlineProviderApiKeyUsable;
	const allowsAuth = (mode, authFlow) => isAuthModeAllowedForModel({
		provider,
		modelApi: params.modelApi,
		modelBaseUrl: params.modelBaseUrl,
		mode,
		authFlow
	});
	const envAuth = resolveConfigAwareEnvApiKey(cfg, provider, params.workspaceDir);
	if (envAuth && allowsAuth(envAuth.source.includes("OAUTH_TOKEN") ? "oauth" : "api-key") && isUsableSource(envAuth.source)) return true;
	if (resolveUsableCustomProviderApiKey({
		cfg,
		provider
	}) && inlineProviderApiKeyUsable) return true;
	const syntheticLocalAuth = await prepareSyntheticLocalProviderAuth({
		cfg,
		provider,
		workspaceDir: params.workspaceDir
	});
	if (syntheticLocalAuth && isUsableSource(syntheticLocalAuth.source)) return true;
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
		if (candidateType && !allowsAuth(profileTypeToAuthMode(candidateType), candidateCredential?.type === "oauth" ? candidateCredential.authFlow : void 0)) continue;
		const resolved = await resolveApiKeyForProfile({
			cfg,
			store,
			profileId: candidate,
			agentDir: params.agentDir
		});
		const credential = resolved?.credential ?? store.profiles[candidate];
		const mode = resolved?.profileType ?? credential?.type;
		if (resolved && allowsAuth(mode ? profileTypeToAuthMode(mode) : "api-key", credential?.type === "oauth" ? credential.authFlow : void 0)) return true;
	} catch (err) {
		log.debug?.(`auth profile "${candidate}" failed for provider "${provider}": ${String(err)}`);
	}
	return false;
}
async function getApiKeyForModelCore(params) {
	const { model, ...authParams } = params;
	return resolveApiKeyForProviderCore({
		...authParams,
		provider: model.provider,
		modelId: model.id,
		modelApi: model.api,
		modelBaseUrl: model.baseUrl
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
	const sentinelize = (value) => mintSecretSentinel(value, { label: `model-auth:${model.provider}` });
	const addReplacement = (name, value, replacement) => {
		replacements.set(name.trim().toLowerCase(), {
			value,
			replacement: replacement ?? sentinelize(value)
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
		protectedRequestHeaders[name] = sentinelize(value);
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
					token: sentinelize(token)
				}
			};
			addReplacement("Authorization", `Bearer ${token}`, `Bearer ${sentinelize(token)}`);
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
					value: sentinelize(value)
				}
			};
			addReplacement(headerName, `${prefix}${value}`, `${prefix}${sentinelize(value)}`);
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
export { hasAvailableAuthForProvider as a, getApiKeyForModelCore as i, applyLocalNoAuthHeaderOverride as n, resolveModelAuthMode as o, applySecretRefHeaderSentinels as r, resolveModelAuthModeAsync as s, applyAuthHeaderOverride as t };
