import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as appendConfigPathSegment } from "./dot-path-BSC76DAI.mjs";
import { a as coerceSecretRef } from "./types.secrets-B5xWSzLp.mjs";
import { f as resolveConfigSecretRef } from "./resolution-facts-CSuKIPux.mjs";
import { t as normalizeOptionalSecretInput } from "./normalize-secret-input-Df_qhWv_.mjs";
import { H as resolveAwsSdkEnvVarName } from "./loader-runtime-load-XbrcYJWd.mjs";
import { p as listProfilesForProvider } from "./order-BQhYF772.mjs";
import { r as resolveNonEnvSecretRefApiKeyMarker } from "./provider-credential-values-DSE2VVU-.mjs";
import { d as resolveNonEnvSecretRefHeaderValueMarker, s as isNonSecretApiKeyMarker, u as resolveEnvSecretRefHeaderValueMarker } from "./model-auth-markers-BfYDKFYI.mjs";
import { t as resolveEnvApiKey } from "./model-auth-env-CmdBc7TL.mjs";
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
/** Resolves the AWS SDK API key env var used by Bedrock-style auth. */
function resolveAwsSdkApiKeyVarName(env = process.env) {
	return resolveAwsSdkEnvVarName(env);
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
		const resolvedRef = input ? resolveConfigSecretRef(input) : coerceSecretRef(headerValue, params.secretDefaults);
		if (!resolvedRef || !resolvedRef.id.trim()) {
			nextHeaders[headerName] = headerValue;
			continue;
		}
		mutated = true;
		nextHeaders[headerName] = resolvedRef.source === "env" ? resolveEnvSecretRefHeaderValueMarker(resolvedRef.id) : resolveNonEnvSecretRefHeaderValueMarker(resolvedRef.source);
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
	if (!cred) return;
	if (cred.type === "api_key") {
		const keyRef = coerceSecretRef(cred.keyRef);
		if (keyRef && keyRef.id.trim()) {
			if (keyRef.source === "env") {
				const envVar = keyRef.id.trim();
				return {
					apiKey: envVar,
					source: "env-ref",
					discoveryApiKey: toDiscoveryApiKey(env[envVar])
				};
			}
			return {
				apiKey: resolveNonEnvSecretRefApiKeyMarker(keyRef.source),
				source: "non-env-ref"
			};
		}
		if (cred.key?.trim()) return {
			apiKey: cred.key,
			source: "plaintext",
			discoveryApiKey: toDiscoveryApiKey(cred.key)
		};
		return;
	}
	if (cred.type === "token") {
		const tokenRef = coerceSecretRef(cred.tokenRef);
		if (tokenRef && tokenRef.id.trim()) {
			if (tokenRef.source === "env") {
				const envVar = tokenRef.id.trim();
				return {
					apiKey: envVar,
					source: "env-ref",
					discoveryApiKey: toDiscoveryApiKey(env[envVar])
				};
			}
			return {
				apiKey: resolveNonEnvSecretRefApiKeyMarker(tokenRef.source),
				source: "non-env-ref"
			};
		}
		if (cred.token?.trim()) return {
			apiKey: cred.token,
			source: "plaintext",
			discoveryApiKey: toDiscoveryApiKey(cred.token)
		};
	}
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
	const configuredApiKeyRef = params.sourceInput ? resolveConfigSecretRef(params.sourceInput) : coerceSecretRef(configuredApiKey, params.secretDefaults);
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
	if (params.profileApiKey && params.profileApiKey.source !== "plaintext" && normalizedConfiguredApiKey === params.profileApiKey.apiKey) params.secretRefManagedProviders?.add(params.providerKey);
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
	const hasModels = Array.isArray(params.provider.models) && params.provider.models.length > 0;
	const normalizedApiKey = normalizeOptionalSecretInput(params.provider.apiKey);
	const hasConfiguredApiKey = Boolean(normalizedApiKey || params.provider.apiKey);
	if (!hasModels || hasConfiguredApiKey) return params.provider;
	const authMode = params.provider.auth;
	if (params.providerApiKeyResolver && (!authMode || authMode === "aws-sdk")) {
		const resolvedApiKey = params.providerApiKeyResolver(params.env);
		if (resolvedApiKey) return {
			...params.provider,
			apiKey: resolvedApiKey
		};
	}
	if (authMode === "aws-sdk") {
		const awsEnvVar = resolveAwsSdkApiKeyVarName(params.env);
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
