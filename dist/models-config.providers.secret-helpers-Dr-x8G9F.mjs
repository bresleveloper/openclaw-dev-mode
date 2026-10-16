import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as appendConfigPathSegment } from "./dot-path-CVD5Jolm.mjs";
import { h as parseSecretRef } from "./types.secrets-DsPRn9Dz.mjs";
import { f as resolveConfigSecretRef } from "./resolution-facts-HH1cnmIY.mjs";
import { f as listProfilesForProvider } from "./order-B7W96aON.mjs";
import { r as resolveNonEnvSecretRefApiKeyMarker } from "./provider-credential-values-Cf7LMsFg.mjs";
import { s as isNonSecretApiKeyMarker, u as resolveEnvSecretRefHeaderValueMarker } from "./model-auth-markers-Cuz_bq6T.mjs";
import { t as resolveEnvApiKey } from "./model-auth-env-CI3qSPg4.mjs";
import { j as resolveAwsSdkEnvVarName } from "./model-auth-provider-config-U8dA4bob.mjs";
//#region src/agents/models-config.providers.secret-helpers.ts
/**
* Resolves configured provider secrets from env, profiles, and SecretRefs.
*/
const ENV_VAR_NAME_RE = /^[A-Z_][A-Z0-9_]*$/;
/** Normalizes `${ENV_VAR}` config syntax to the raw environment variable name. */
function normalizeApiKeyConfig(value) {
	const trimmed = value.trim();
	return /^\$\{([A-Z0-9_]+)\}$/.exec(trimmed)?.[1] ?? trimmed;
}
/** Returns a concrete key for discovery, omitting placeholder markers and blanks. */
function toDiscoveryApiKey(value) {
	const trimmed = normalizeOptionalString(value);
	if (!trimmed || isNonSecretApiKeyMarker(trimmed)) return;
	return trimmed;
}
/** Resolves which environment variable supplies a provider API key. */
function resolveEnvApiKeyVarName(provider, env = process.env, options = {}) {
	const resolved = resolveEnvApiKey(provider, env, options);
	if (!resolved) return;
	const match = /^(?:env: |shell env: )([A-Z0-9_]+)$/.exec(resolved.source);
	return match ? match[1] : void 0;
}
function resolveEnvAuthEvidenceApiKeyMarker(provider, env) {
	const apiKey = resolveEnvApiKey(provider, env)?.apiKey?.trim();
	if (!apiKey || !isNonSecretApiKeyMarker(apiKey, { includeEnvVarName: false })) return;
	return apiKey;
}
/** Rewrites secret-backed provider headers to stable marker values. */
function normalizeHeaderValues(params) {
	const { headers } = params;
	if (!headers) return {
		headers,
		mutated: false
	};
	const source = params.source;
	const sourceHeaders = source ? source.config.models?.providers?.[source.providerKey]?.headers : void 0;
	let mutated = false;
	const nextHeaders = {};
	for (const [headerName, headerValue] of Object.entries(headers)) {
		const sourceValue = sourceHeaders?.[headerName];
		const input = source && sourceValue !== void 0 ? {
			config: source.config,
			path: appendConfigPathSegment(`${appendConfigPathSegment("models.providers", source.providerKey)}.headers`, headerName),
			value: sourceValue,
			defaults: source.config.secrets?.defaults
		} : void 0;
		const resolvedRef = input ? resolveConfigSecretRef(input) : parseSecretRef(headerValue, params.secretDefaults);
		if (!resolvedRef || !resolvedRef.id.trim()) {
			nextHeaders[headerName] = headerValue;
			continue;
		}
		mutated = true;
		nextHeaders[headerName] = resolvedRef.source === "env" ? resolveEnvSecretRefHeaderValueMarker(resolvedRef.id) : resolveNonEnvSecretRefApiKeyMarker(resolvedRef.source);
	}
	if (!mutated) return {
		headers,
		mutated: false
	};
	return {
		headers: nextHeaders,
		mutated: true
	};
}
/** Resolves an auth profile credential into provider apiKey/discovery values. */
function resolveApiKeyFromCredential(cred, env = process.env) {
	if (!cred || cred.type !== "api_key" && cred.type !== "token") return;
	const ref = parseSecretRef(cred.type === "api_key" ? cred.keyRef : cred.tokenRef);
	if (ref && ref.id.trim()) {
		if (ref.source === "env") {
			const envVar = ref.id.trim();
			return {
				apiKey: envVar,
				source: "env-ref",
				discoveryApiKey: toDiscoveryApiKey(env[envVar])
			};
		}
		return {
			apiKey: resolveNonEnvSecretRefApiKeyMarker(ref.source),
			source: "non-env-ref"
		};
	}
	const value = cred.type === "api_key" ? cred.key : cred.token;
	return value?.trim() ? {
		apiKey: value,
		source: "plaintext",
		discoveryApiKey: toDiscoveryApiKey(value)
	} : void 0;
}
/** Resolves the first usable API key from matching auth profiles. */
function resolveApiKeyFromProfiles(params) {
	const ids = params.profileIds ?? listProfilesForProvider(params.store, params.provider);
	for (const id of ids) {
		const credential = params.store.profiles[id];
		if (!credential) continue;
		const resolved = resolveApiKeyFromCredential(credential, params.env);
		if (resolved) return {
			...resolved,
			profileId: id,
			mode: credential.type
		};
	}
}
/** Normalizes configured provider apiKey values and records providers backed by secret refs. */
function normalizeConfiguredProviderApiKey(params) {
	const configuredApiKey = params.sourceInput?.value ?? params.provider.apiKey;
	const configuredApiKeyRef = params.sourceInput ? resolveConfigSecretRef(params.sourceInput) : parseSecretRef(configuredApiKey, params.secretDefaults);
	if (configuredApiKeyRef && configuredApiKeyRef.id.trim()) {
		const marker = configuredApiKeyRef.source === "env" ? configuredApiKeyRef.id.trim() : resolveNonEnvSecretRefApiKeyMarker(configuredApiKeyRef.source);
		params.secretRefManagedProviders?.add(params.providerKey);
		if (params.provider.apiKey === marker) return params.provider;
		return {
			...params.provider,
			apiKey: marker
		};
	}
	if (typeof configuredApiKey !== "string") return params.provider;
	const normalizedConfiguredApiKey = configuredApiKey.trim();
	if (isNonSecretApiKeyMarker(normalizedConfiguredApiKey)) params.secretRefManagedProviders?.add(params.providerKey);
	if (normalizedConfiguredApiKey === params.provider.apiKey) return params.provider;
	return {
		...params.provider,
		apiKey: normalizedConfiguredApiKey
	};
}
/** Rewrites literal env-derived keys back to env variable names when provenance is clear. */
function normalizeResolvedEnvApiKey(params) {
	const currentApiKey = params.provider.apiKey;
	if (typeof currentApiKey !== "string" || !currentApiKey.trim() || ENV_VAR_NAME_RE.test(currentApiKey.trim())) return params.provider;
	const envVarName = resolveEnvApiKeyVarName(params.providerKey, params.env);
	if (!envVarName || params.env[envVarName] !== currentApiKey) return params.provider;
	params.secretRefManagedProviders?.add(params.providerKey);
	return {
		...params.provider,
		apiKey: envVarName
	};
}
/** Fills missing provider apiKey values from env, auth profiles, or AWS SDK auth. */
function resolveMissingProviderApiKey(params) {
	if (!(Array.isArray(params.provider.models) && params.provider.models.length > 0) || params.provider.apiKey) return params.provider;
	const authMode = params.provider.auth;
	if (params.providerApiKeyResolver && (!authMode || authMode === "aws-sdk")) {
		const resolvedApiKey = params.providerApiKeyResolver(params.env);
		if (resolvedApiKey) return {
			...params.provider,
			apiKey: resolvedApiKey
		};
	}
	if (authMode === "aws-sdk") {
		const awsEnvVar = resolveAwsSdkEnvVarName(params.env);
		if (!awsEnvVar) return params.provider;
		return {
			...params.provider,
			apiKey: awsEnvVar
		};
	}
	const fromEnv = resolveEnvApiKeyVarName(params.providerKey, params.env);
	const fromAuthEvidence = fromEnv ? void 0 : resolveEnvAuthEvidenceApiKeyMarker(params.providerKey, params.env);
	const apiKey = fromEnv ?? fromAuthEvidence ?? params.profileApiKey?.apiKey;
	if (!apiKey?.trim()) return params.provider;
	if (fromAuthEvidence || params.profileApiKey && params.profileApiKey.source !== "plaintext") params.secretRefManagedProviders?.add(params.providerKey);
	return {
		...params.provider,
		apiKey
	};
}
//#endregion
export { resolveApiKeyFromCredential as a, resolveMissingProviderApiKey as c, normalizeResolvedEnvApiKey as i, toDiscoveryApiKey as l, normalizeConfiguredProviderApiKey as n, resolveApiKeyFromProfiles as o, normalizeHeaderValues as r, resolveEnvApiKeyVarName as s, normalizeApiKeyConfig as t };
