import { a as coerceSecretRef, g as resolveSecretInputRef } from "./types.secrets-DsPRn9Dz.mjs";
//#region src/agents/auth-profiles/policy.ts
/** Throws when OAuth profiles contain unsupported SecretRef fields. */
function assertNoOAuthSecretRefPolicyViolations(params) {
	const defaults = params.cfg?.secrets?.defaults;
	const profileFilter = params.profileIds ? new Set(params.profileIds) : null;
	const violations = [];
	for (const [profileId, credential] of Object.entries(params.store.profiles)) {
		if (profileFilter && !profileFilter.has(profileId)) continue;
		if (credential.type === "oauth") {
			const record = credential;
			for (const field of [
				"access",
				"refresh",
				"token",
				"tokenRef",
				"key",
				"keyRef"
			]) if (coerceSecretRef(record[field], defaults) !== null) violations.push(`- profiles.${profileId}.${field}: SecretRef is not allowed for type="oauth" auth profiles (OAuth credentials are runtime-mutable).`);
			continue;
		}
		if (params.cfg?.auth?.profiles?.[profileId]?.mode !== "oauth" || credential.type !== "api_key" && credential.type !== "token") continue;
		const input = credential.type === "api_key" ? {
			field: "key",
			value: credential.key,
			refValue: credential.keyRef
		} : {
			field: "token",
			value: credential.token,
			refValue: credential.tokenRef
		};
		if (resolveSecretInputRef({
			...input,
			defaults
		}).ref !== null) violations.push(`- profiles.${profileId}.${input.field}: SecretRef is not allowed when auth.profiles.${profileId}.mode is "oauth" (OAuth credentials are runtime-mutable).`);
	}
	if (violations.length === 0) return;
	const lines = [`${params.context ?? "auth-profiles"} policy validation failed: OAuth + SecretRef is not supported.`, ...violations];
	throw new Error(lines.join("\n"));
}
//#endregion
export { assertNoOAuthSecretRefPolicyViolations as t };
