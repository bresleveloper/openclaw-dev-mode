import { t as appendConfigPathSegment } from "./dot-path-CVD5Jolm.mjs";
import { h as parseSecretRef } from "./types.secrets-Dgbd2kyP.mjs";
import { r as normalizeProviderId } from "./provider-id-D1VImdKk.mjs";
import { j as hashRuntimeConfigValue, l as getRuntimeConfigSourceSnapshot, o as getRuntimeConfigSnapshot } from "./runtime-snapshot-BBYDJbw9.mjs";
import { f as resolveConfigSecretRef, l as getResolvedConfigEnvSecretRef, u as hasUnresolvedConfigPath } from "./resolution-facts-D_pto3MV.mjs";
import { a as resolveMergedModelProviderConfig, o as resolveMergedModelProviderEntry } from "./model-provider-config-wdC9jpCz.mjs";
import { k as readInlineProviderApiKeyUsage } from "./user-model-account-authority-DFFjC5J5.mjs";
import { n as normalizeSecretInput, t as normalizeOptionalSecretInput } from "./normalize-secret-input-DBJvdk-L.mjs";
import { n as SecretSurfaceUnavailableError } from "./runtime-degraded-state-SptB0g_t.mjs";
import { n as getShellEnvAppliedKeys } from "./shell-env-DzVIOYTd.mjs";
import { n as isStoredCredentialCompatibleWithAuthProvider, t as isConfiguredAwsSdkAuthProfileForProvider } from "./order-CElLtwMu.mjs";
import { t as NON_ENV_SECRETREF_MARKER } from "./provider-credential-values-Cf7LMsFg.mjs";
import { a as SECRETREF_ENV_HEADER_MARKER_PREFIX, n as CUSTOM_LOCAL_AUTH_MARKER, o as isKnownEnvApiKeyMarker, s as isNonSecretApiKeyMarker } from "./model-auth-markers-Clx9vUna.mjs";
import { c as mintSecretSentinel } from "./sentinel-DZP_CK2t.mjs";
import { t as canResolveEnvSecretRefInReadOnlyPath } from "./secret-ref-readonly.internal-BueGE3VV.mjs";
import { t as resolveEnvApiKey } from "./model-auth-env-CPdn6zH8.mjs";
import { t as isLocalProviderBaseUrl } from "./model-provider-local-BR8C9R-6.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/model-auth-runtime-shared.ts
/**
* Shared provider-auth runtime types and errors. Provider calls use these
* helpers to fail with actionable auth provenance while keeping secret
* normalization local.
*/
const AWS_BEARER_ENV = "AWS_BEARER_TOKEN_BEDROCK";
const AWS_ACCESS_KEY_ENV = "AWS_ACCESS_KEY_ID";
const AWS_SECRET_KEY_ENV = "AWS_SECRET_ACCESS_KEY";
const AWS_PROFILE_ENV = "AWS_PROFILE";
function resolveDirectProviderCredentialMode(params) {
	const configuredMode = resolveMergedModelProviderEntry(params.cfg, params.provider)?.providerConfig.auth;
	return configuredMode === "oauth" || configuredMode === "token" ? configuredMode : params.inferredMode;
}
var ProviderAuthError = class extends Error {
	constructor(code, provider, message, options) {
		super(message);
		this.name = "ProviderAuthError";
		this.code = code;
		this.provider = provider;
		this.providerGuidance = options?.providerGuidance === true;
	}
};
/** Native login is availability evidence, never an HTTP credential. */
function assertProviderAuthSupportsHttp(auth, provider) {
	if (auth.nativeAuth) throw new ProviderAuthError("missing-provider-auth", provider, `Native authentication for provider "${provider}" belongs to the "${auth.nativeAuth.runtime}" runtime and cannot authorize an HTTP request. Select that runtime or configure an API key.`);
}
var MissingProviderAuthError = class extends ProviderAuthError {
	constructor(provider, auth) {
		super("missing-api-key", provider, formatMissingAuthError(auth, provider));
		this.name = "MissingProviderAuthError";
		this.mode = auth.mode;
		this.source = auth.source;
	}
};
function isProviderAuthError(err, code) {
	return err instanceof ProviderAuthError && (!code || err.code === code);
}
function isMissingProviderAuthError(err) {
	return err instanceof MissingProviderAuthError;
}
function resolveAwsSdkEnvVarName(env = process.env) {
	if (env[AWS_BEARER_ENV]?.trim()) return AWS_BEARER_ENV;
	if (env[AWS_ACCESS_KEY_ENV]?.trim() && env[AWS_SECRET_KEY_ENV]?.trim()) return AWS_ACCESS_KEY_ENV;
	if (env[AWS_PROFILE_ENV]?.trim()) return AWS_PROFILE_ENV;
}
function formatMissingAuthError(auth, provider) {
	return `No API key resolved for provider "${provider}" (auth mode: ${auth.mode}, checked: ${auth.source}).`;
}
function requireApiKey(auth, provider) {
	assertProviderAuthSupportsHttp(auth, provider);
	const key = normalizeSecretInput(auth.apiKey);
	if (key) return key;
	throw new MissingProviderAuthError(provider, auth);
}
//#endregion
//#region src/agents/model-auth-provider-config.ts
/**
* Provider-entry configuration and stored-profile binding for model auth.
*/
const MODEL_AUTH_LOCAL_HOST_ALIASES = /* @__PURE__ */ new Set([
	"docker.orb.internal",
	"host.docker.internal",
	"host.orb.internal"
]);
function projectResolvedProfileAuth(params) {
	const credential = params.store.profiles[params.profileId];
	return {
		apiKey: (credential?.type === "api_key" ? parseSecretRef(credential.keyRef) : credential?.type === "token" ? parseSecretRef(credential.tokenRef) : null) && params.enabled ? mintSecretSentinel(params.apiKey, { label: `model-auth:${params.provider}` }) : params.apiKey,
		profileId: params.profileId,
		source: `profile:${params.profileId}`,
		mode: params.mode,
		...params.authFlow ? { authFlow: params.authFlow } : {}
	};
}
function resolveConfigAwareEnvApiKey(cfg, provider, workspaceDir, skipSetupProviderFallback) {
	return resolveEnvApiKey(provider, process.env, {
		config: cfg,
		workspaceDir,
		...skipSetupProviderFallback ? { skipSetupProviderFallback: true } : {}
	});
}
function resolveProviderSourceConfig(cfg, provider) {
	const source = getRuntimeConfigSourceSnapshot();
	if (cfg === source) return cfg;
	return providerConfigMatchesRuntimeSnapshot({
		inputConfig: cfg,
		runtimeConfig: getRuntimeConfigSnapshot(),
		provider
	}) ? source ?? cfg : cfg;
}
/** Keeps authored references distinct from opaque bytes in a matching runtime provider. */
function resolveProviderConfigSecretInput(cfg, provider, sourceConfig = resolveProviderSourceConfig(cfg, provider)) {
	const entry = resolveMergedModelProviderEntry(sourceConfig, provider);
	const path = entry ? `${appendConfigPathSegment("models.providers", entry.providerKey)}.apiKey` : "";
	const resolvedEnvRef = entry ? getResolvedConfigEnvSecretRef(sourceConfig, path) : null;
	return {
		path,
		providerConfig: resolveMergedModelProviderConfig(cfg, provider),
		resolvedEnvRef,
		ref: entry ? resolvedEnvRef ?? resolveConfigSecretRef({
			config: sourceConfig,
			path,
			value: entry.providerConfig.apiKey,
			defaults: sourceConfig?.secrets?.defaults
		}) : null
	};
}
/** Reads a literal or env-secret marker for a custom provider entry. */
function getCustomProviderApiKey(cfg, provider) {
	const { providerConfig, ref } = resolveProviderConfigSecretInput(cfg, provider);
	if (!ref) return normalizeOptionalSecretInput(providerConfig?.apiKey);
	return ref.source === "env" && ref.id.trim() || "secretref-managed";
}
/** Resolves custom provider API keys that are usable without mutating secret stores. */
function resolveUsableCustomProviderApiKey(params) {
	const input = resolveProviderConfigSecretInput(params.cfg, params.provider);
	const { providerConfig: customProviderConfig, ref: apiKeyRef } = input;
	if (apiKeyRef) {
		const envVarName = apiKeyRef.source === "env" ? apiKeyRef.id.trim() : "";
		if (!envVarName) return null;
		if (!(input.resolvedEnvRef || canResolveEnvSecretRefInReadOnlyPath({
			cfg: params.cfg,
			provider: apiKeyRef.provider,
			id: envVarName
		}))) return null;
		const envValue = normalizeOptionalSecretInput(input.resolvedEnvRef ? customProviderConfig?.apiKey : (params.env ?? process.env)[envVarName]);
		if (!envValue) return null;
		const source = input.resolvedEnvRef ? "models.json" : resolveEnvSourceLabel([envVarName], `${envVarName} (models.json secretref)`);
		return {
			apiKey: params.secretSentinels ? mintSecretSentinel(envValue, { label: `model-auth:${params.provider}` }) : envValue,
			source
		};
	}
	const customKey = normalizeOptionalSecretInput(customProviderConfig?.apiKey);
	if (!customKey) return null;
	if (!isNonSecretApiKeyMarker(customKey)) return {
		apiKey: customKey,
		source: "models.json"
	};
	if (isKnownEnvApiKeyMarker(customKey)) {
		const envValue = normalizeOptionalSecretInput((params.env ?? process.env)[customKey]);
		if (!envValue) return null;
		return {
			apiKey: envValue,
			source: resolveEnvSourceLabel([customKey], `${customKey} (models.json marker)`)
		};
	}
	if (customProviderConfig && (customProviderConfig.api === "openai-completions" || customProviderConfig.api === "ollama") && customProviderConfig.baseUrl && isLocalAuthProviderBaseUrl(customProviderConfig.baseUrl)) return {
		apiKey: customProviderConfig.api === "ollama" ? customKey : CUSTOM_LOCAL_AUTH_MARKER,
		source: "models.json (local marker)"
	};
	return null;
}
/** True when a custom provider has a literal/env/local key available now. */
const hasUsableCustomProviderApiKey = (cfg, provider, env) => Boolean(resolveUsableCustomProviderApiKey({
	cfg,
	provider,
	env
}));
/** True when explicit provider config should outrank profile/environment auth. */
function shouldPreferExplicitConfigApiKeyAuth(cfg, provider) {
	const providerConfig = resolveMergedModelProviderConfig(cfg, provider);
	return resolveProviderAuthOverride(cfg, provider) === "api-key" && providerConfig !== void 0 && hasExplicitProviderApiKeyConfig(providerConfig);
}
/** True when configured or prepared route facts prove a local no-auth provider. */
function hasSyntheticLocalProviderAuthConfig(params) {
	const providerConfig = resolveMergedModelProviderConfig(params.cfg, params.provider);
	const authOverride = resolveProviderAuthOverride(params.cfg, params.provider);
	if (authOverride && authOverride !== "api-key") return false;
	if (!params.route && (!providerConfig || !isCustomLocalProviderConfig(providerConfig)) || providerConfig !== void 0 && hasExplicitProviderApiKeyConfig(providerConfig)) return false;
	const route = params.route ?? providerConfig;
	return typeof route?.api === "string" && route.api.trim().length > 0 && typeof route.baseUrl === "string" && isLocalAuthProviderBaseUrl(route.baseUrl);
}
function resolveProviderAuthOverride(cfg, provider) {
	const auth = resolveMergedModelProviderConfig(cfg, provider)?.auth;
	if (auth === "api-key" || auth === "aws-sdk" || auth === "oauth" || auth === "token") return auth;
}
function shouldUseImplicitAwsSdkAuth(params) {
	if (params.modelApi !== "bedrock-converse-stream") return false;
	if (normalizeProviderId(params.provider) !== "amazon-bedrock") return false;
	const providerConfig = resolveMergedModelProviderConfig(params.cfg, params.provider);
	return resolveProviderAuthOverride(params.cfg, params.provider) === void 0 && (providerConfig === void 0 || !hasExplicitProviderApiKeyConfig(providerConfig));
}
function profileTypeToAuthMode(type) {
	return type === "oauth" ? "oauth" : type === "token" ? "token" : "api-key";
}
function normalizeProviderEntryBaseUrlForBinding(baseUrl) {
	const trimmed = baseUrl?.trim();
	if (!trimmed) return;
	const parsed = URL.parse(trimmed);
	if (!parsed) return trimmed.toLowerCase().replace(/\/+$/, "");
	parsed.hash = "";
	parsed.search = "";
	parsed.pathname = parsed.pathname.replace(/\/+$/, "");
	return parsed.toString().replace(/\/+$/, "");
}
function providerEntriesShareBaseUrl(params) {
	const providerBaseUrl = normalizeProviderEntryBaseUrlForBinding(resolveMergedModelProviderConfig(params.cfg, params.provider)?.baseUrl);
	const credentialProviderBaseUrl = normalizeProviderEntryBaseUrlForBinding(resolveMergedModelProviderConfig(params.cfg, params.credentialProvider)?.baseUrl);
	return Boolean(providerBaseUrl && credentialProviderBaseUrl && providerBaseUrl === credentialProviderBaseUrl);
}
function isBearerProfileCredential(credential) {
	return credential.type === "api_key" || credential.type === "token";
}
/** True when a bearer auth profile can safely satisfy a provider-entry apiKey reference. */
function canUseProfileAsProviderEntryApiKey(params) {
	if (!isBearerProfileCredential(params.credential)) return false;
	if (isStoredCredentialCompatibleWithAuthProvider(params)) return true;
	return providerEntriesShareBaseUrl({
		cfg: params.cfg,
		provider: params.provider,
		credentialProvider: params.credential.provider
	});
}
/** Classifies a provider entry apiKey as literal/profile/marker before resolving secrets. */
function resolveProviderEntryApiKeyProfileReference(params) {
	const { providerConfig, ref } = resolveProviderConfigSecretInput(params.cfg, params.provider, params.sourceConfig);
	if (ref) return { kind: "none" };
	const perEntryRawKey = normalizeOptionalSecretInput(providerConfig?.apiKey);
	if (!perEntryRawKey) return { kind: "none" };
	if (isNonSecretApiKeyMarker(perEntryRawKey)) return {
		kind: "marker",
		evidence: isKnownEnvApiKeyMarker(perEntryRawKey) ? "environment" : "synthetic"
	};
	const credential = params.store.profiles[perEntryRawKey];
	if (!credential) return {
		kind: "literal",
		apiKey: perEntryRawKey,
		source: "models.json"
	};
	const reason = !isBearerProfileCredential(credential) ? "credential-class" : !canUseProfileAsProviderEntryApiKey({
		cfg: params.cfg,
		authAliasLookupParams: params.authAliasLookupParams,
		provider: params.provider,
		credential
	}) ? "provider-binding" : void 0;
	if (reason) return {
		kind: "profile-incompatible",
		profileId: perEntryRawKey,
		credentialProvider: credential.provider,
		credentialType: credential.type,
		reason
	};
	return {
		kind: "profile",
		profileId: perEntryRawKey,
		credential,
		mode: profileTypeToAuthMode(credential.type)
	};
}
/** Resolves a provider-entry apiKey profile reference into runtime auth when possible. */
async function resolveProviderEntryApiKeyBinding(params) {
	params.signal?.throwIfAborted();
	const reference = resolveProviderEntryApiKeyProfileReference(params);
	if (reference.kind === "none" || reference.kind === "marker") return { kind: "none" };
	if (reference.kind === "literal" || reference.kind === "profile-incompatible") return reference;
	try {
		const { resolveApiKeyForProfile } = await import("./oauth-DalQEbRJ.mjs");
		const resolved = await resolveApiKeyForProfile({
			cfg: params.cfg,
			store: params.store,
			profileId: reference.profileId,
			agentDir: params.agentDir,
			signal: params.signal
		});
		params.signal?.throwIfAborted();
		if (!resolved) return {
			kind: "profile-unresolved",
			profileId: reference.profileId
		};
		const resolvedProfileId = resolved.profileId ?? reference.profileId;
		const credential = resolved.credential ?? reference.credential;
		return {
			kind: "profile-resolved",
			auth: projectResolvedProfileAuth({
				apiKey: resolved.apiKey,
				enabled: params.secretSentinels,
				profileId: resolvedProfileId,
				provider: params.provider,
				store: params.store,
				mode: resolved.profileType ? profileTypeToAuthMode(resolved.profileType) : reference.mode,
				authFlow: credential.type === "oauth" ? credential.authFlow : void 0
			})
		};
	} catch (err) {
		params.signal?.throwIfAborted();
		if (err instanceof SecretSurfaceUnavailableError) throw err;
		return {
			kind: "profile-unresolved",
			profileId: reference.profileId,
			error: err
		};
	}
}
function resolveConfiguredAwsSdkProfileAuth(params) {
	if (!isConfiguredAwsSdkAuthProfileForProvider(params)) return null;
	return {
		...resolveAwsSdkAuthInfo(),
		profileId: params.profileId,
		source: `profile:${params.profileId}`
	};
}
function isLocalAuthProviderBaseUrl(baseUrl) {
	return isLocalProviderBaseUrl(baseUrl, MODEL_AUTH_LOCAL_HOST_ALIASES);
}
function hasExplicitProviderApiKeyConfig(providerConfig) {
	return normalizeOptionalSecretInput(providerConfig.apiKey) !== void 0 || parseSecretRef(providerConfig.apiKey) !== null;
}
function isInlineProviderApiKeySource(source) {
	return source === "models.json" || source.endsWith(" (models.json secretref)") || source.endsWith(" (models.json marker)");
}
/** True when a resolved credential came from an inline `models.providers.<id>.apiKey`. */
function isConfigBackedInlineProviderApiKey(params) {
	if (isInlineProviderApiKeySource(params.source)) return true;
	const { providerConfig, ref } = resolveProviderConfigSecretInput(params.cfg, params.provider);
	if (!providerConfig || !hasExplicitProviderApiKeyConfig(providerConfig)) return false;
	if (ref) return true;
	const perEntryRawKey = normalizeOptionalSecretInput(providerConfig.apiKey);
	return Boolean(perEntryRawKey && !params.store?.profiles[perEntryRawKey]);
}
function resolveInlineProviderApiKeyCooldownUntil(store, provider) {
	return readInlineProviderApiKeyUsage(store, provider).unusableUntil;
}
/** Fails closed while an inline provider API key is inside its billing/auth cooldown. */
function assertInlineProviderApiKeyUsable(params) {
	const unusableUntil = resolveInlineProviderApiKeyCooldownUntil(params.store, params.provider);
	if (typeof unusableUntil !== "number" || unusableUntil <= Date.now()) return;
	const waitMs = Math.max(0, unusableUntil - Date.now());
	const waitMinutes = Math.max(1, Math.ceil(waitMs / 6e4));
	throw new Error(`Inline API key for provider "${params.provider}" is temporarily disabled after a provider auth/billing failure. Retry after about ${waitMinutes} minute${waitMinutes === 1 ? "" : "s"}, or switch to a different auth profile/API key.`);
}
function isCustomLocalProviderConfig(providerConfig) {
	return typeof providerConfig.baseUrl === "string" && providerConfig.baseUrl.trim().length > 0 && typeof providerConfig.api === "string" && providerConfig.api.trim().length > 0 && Array.isArray(providerConfig.models) && providerConfig.models.length > 0;
}
function isManagedSecretRefApiKeyMarker(apiKey) {
	return apiKey?.trim() === NON_ENV_SECRETREF_MARKER;
}
function hasSecretRefProviderApiKey(cfg, provider) {
	const { providerConfig, ref } = resolveProviderConfigSecretInput(cfg, provider);
	const apiKey = providerConfig?.apiKey;
	if (ref) return true;
	return typeof apiKey === "string" && (isManagedSecretRefApiKeyMarker(apiKey) || apiKey.trim().startsWith("secretref-env:"));
}
function providerConfigMatchesRuntimeSnapshot(params) {
	const inputProvider = resolveMergedModelProviderConfig(params.inputConfig, params.provider);
	const runtimeProvider = resolveMergedModelProviderConfig(params.runtimeConfig ?? void 0, params.provider);
	const toComparableConfig = (providerConfig) => ({ models: { providers: { [params.provider]: providerConfig } } });
	return inputProvider && runtimeProvider ? params.inputConfig === params.runtimeConfig || inputProvider === runtimeProvider || isDeepStrictEqual(inputProvider, runtimeProvider) || hashRuntimeConfigValue(toComparableConfig(inputProvider)) === hashRuntimeConfigValue(toComparableConfig(runtimeProvider)) : false;
}
function sentinelizeConfigSecretRefEnvApiKey(params) {
	if (!params.enabled) return params.apiKey;
	const sourceConfig = resolveProviderSourceConfig(params.cfg, params.provider);
	const configured = resolveMergedModelProviderConfig(sourceConfig, params.provider)?.apiKey;
	const ref = parseSecretRef(configured);
	const envId = ref?.source === "env" ? ref.id : typeof configured === "string" && configured.trim().startsWith("secretref-env:") ? configured.trim().slice(SECRETREF_ENV_HEADER_MARKER_PREFIX.length) : void 0;
	return envId && params.source.includes(envId) ? mintSecretSentinel(params.apiKey, { label: `model-auth:${params.provider}` }) : params.apiKey;
}
function resolveRuntimeProviderConfigApiKeyAuth(params) {
	const input = resolveProviderConfigSecretInput(params.cfg, params.provider);
	if (hasUnresolvedConfigPath(params.cfg, input.path)) return;
	const { providerConfig, ref } = input;
	const sourceRef = resolveProviderConfigSecretInput(params.sourceConfig, params.provider).ref;
	const apiKey = sourceRef ? providerConfig?.apiKey : ref ? void 0 : normalizeOptionalSecretInput(providerConfig?.apiKey);
	if (typeof apiKey !== "string" || !apiKey.trim() || !sourceRef && isNonSecretApiKeyMarker(apiKey)) return;
	return {
		apiKey,
		source: `models.providers.${params.provider}`,
		mode: resolveDirectProviderCredentialMode({
			cfg: params.cfg,
			provider: params.provider,
			inferredMode: "api-key"
		})
	};
}
function resolveEnvSourceLabel(envVars, label = envVars.join(" + ")) {
	const applied = new Set(getShellEnvAppliedKeys());
	return `${envVars.some((envVar) => applied.has(envVar)) ? "shell env: " : "env: "}${label}`;
}
function resolveAwsSdkAuthInfo() {
	const envVar = resolveAwsSdkEnvVarName();
	return {
		mode: "aws-sdk",
		source: envVar ? resolveEnvSourceLabel(envVar === "AWS_ACCESS_KEY_ID" ? [envVar, "AWS_SECRET_ACCESS_KEY"] : envVar ? [envVar] : []) : "aws-sdk default chain"
	};
}
//#endregion
export { requireApiKey as A, shouldUseImplicitAwsSdkAuth as C, formatMissingAuthError as D, assertProviderAuthSupportsHttp as E, resolveDirectProviderCredentialMode as M, isMissingProviderAuthError as O, shouldPreferExplicitConfigApiKeyAuth as S, ProviderAuthError as T, resolveProviderEntryApiKeyBinding as _, hasUsableCustomProviderApiKey as a, resolveUsableCustomProviderApiKey as b, profileTypeToAuthMode as c, resolveAwsSdkAuthInfo as d, resolveConfigAwareEnvApiKey as f, resolveProviderConfigSecretInput as g, resolveProviderAuthOverride as h, hasSyntheticLocalProviderAuthConfig as i, resolveAwsSdkEnvVarName as j, isProviderAuthError as k, projectResolvedProfileAuth as l, resolveInlineProviderApiKeyCooldownUntil as m, getCustomProviderApiKey as n, isConfigBackedInlineProviderApiKey as o, resolveConfiguredAwsSdkProfileAuth as p, hasSecretRefProviderApiKey as r, isManagedSecretRefApiKeyMarker as s, assertInlineProviderApiKeyUsable as t, providerConfigMatchesRuntimeSnapshot as u, resolveProviderEntryApiKeyProfileReference as v, MissingProviderAuthError as w, sentinelizeConfigSecretRefEnvApiKey as x, resolveRuntimeProviderConfigApiKeyAuth as y };
