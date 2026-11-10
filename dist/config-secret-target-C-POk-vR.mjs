import { a as coerceSecretRef } from "./types.secrets-Dgbd2kyP.mjs";
import { f as resolveConfigSecretRef } from "./resolution-facts-D_pto3MV.mjs";
import { m as hasConfiguredPlaintextSecretValue } from "./runtime-shared-DqMZ_k3n.mjs";
import { s as isNonSecretApiKeyMarker } from "./model-auth-markers-Clx9vUna.mjs";
import { t as isLikelySensitiveModelProviderHeaderName } from "./model-provider-header-policy-Bf6iJgjr.mjs";
//#region src/secrets/config-secret-target.ts
/** Classifies authored config credentials for Doctor and secrets audit. */
function classifyConfigSecretTarget(config, target) {
	if (!target.entry.includeInAudit) return {
		ref: null,
		plaintext: false
	};
	const defaults = config.secrets?.defaults;
	const inlineRef = resolveConfigSecretRef({
		config,
		path: target.path,
		value: target.value,
		defaults,
		includeResolved: true
	});
	return {
		ref: coerceSecretRef(target.refValue, defaults) ?? inlineRef,
		plaintext: inlineRef === null && hasConfiguredPlaintextSecretValue(target.value, target.entry.expectedResolvedValue) && !(target.entry.id === "models.providers.*.headers.*" && !isLikelySensitiveModelProviderHeaderName(target.pathSegments.at(-1) ?? "")) && !(target.entry.id === "models.providers.*.apiKey" && typeof target.value === "string" && isNonSecretApiKeyMarker(target.value))
	};
}
//#endregion
export { classifyConfigSecretTarget as t };
