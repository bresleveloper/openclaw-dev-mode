import { p as resolveSecretInputRef, u as normalizeSecretInputString } from "./types.secrets-B5xWSzLp.mjs";
import { t as resolveSecretRefString } from "./resolve-C3ItmvEK.mjs";
//#region src/secrets/resolve-secret-input-string.ts
/**
* Resolves a config value that may be either an inline string or a SecretRef object.
*
* Plugin and gateway callers can override normalization and convert SecretRef resolution errors
* into surface-specific failures without duplicating provider lookup behavior.
*/
async function materializeSecretInput(params) {
	const normalize = params.normalize ?? normalizeSecretInputString;
	const { ref } = resolveSecretInputRef({
		value: params.value,
		defaults: params.defaults ?? params.config.secrets?.defaults
	});
	if (!ref) return normalize(params.value);
	let resolved;
	try {
		resolved = await resolveSecretRefString(ref, {
			config: params.config,
			env: params.env
		});
	} catch (error) {
		if (params.onResolveRefError) return params.onResolveRefError(error, ref);
		throw error;
	}
	return normalize(resolved);
}
//#endregion
export { materializeSecretInput as t };
