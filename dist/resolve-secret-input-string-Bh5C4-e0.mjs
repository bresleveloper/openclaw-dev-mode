import { f as normalizeSecretInputString, h as parseSecretRef } from "./types.secrets-DsPRn9Dz.mjs";
//#region src/secrets/resolve-secret-input-string.ts
/**
* Resolves a config value that may be either an inline string or a SecretRef object.
*
* Gateway and storage callers can override normalization and convert SecretRef resolution errors
* into surface-specific failures without duplicating provider lookup behavior.
*/
async function materializeSecretInput(params) {
	const normalize = params.normalize ?? normalizeSecretInputString;
	const ref = parseSecretRef(params.value, params.defaults ?? params.config.secrets?.defaults);
	if (!ref) return normalize(params.value);
	let resolved;
	try {
		const { resolveSecretRefString } = await import("./resolve-DEBHb_eE.mjs");
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
