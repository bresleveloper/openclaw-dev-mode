import { n as normalizeSecretInput } from "./normalize-secret-input-Df_qhWv_.mjs";
//#region src/secrets/provider-credential-values.ts
/** Marker for a secret-ref-managed credential that is not stored as an env var. */
const NON_ENV_SECRETREF_MARKER = "secretref-managed";
/** Resolve the API-key placeholder for a non-env secret-ref source. */
function resolveNonEnvSecretRefApiKeyMarker(_source) {
	return NON_ENV_SECRETREF_MARKER;
}
function readProviderEnvValue(envVars) {
	for (const envVar of envVars) {
		const value = normalizeSecretInput(process.env[envVar]);
		if (value) return value;
	}
}
//#endregion
export { readProviderEnvValue as n, resolveNonEnvSecretRefApiKeyMarker as r, NON_ENV_SECRETREF_MARKER as t };
