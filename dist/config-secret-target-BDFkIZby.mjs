import { a as coerceSecretRef } from "./types.secrets-DsPRn9Dz.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { f as resolveConfigSecretRef } from "./resolution-facts-HH1cnmIY.mjs";
import { p as hasConfiguredPlaintextSecretValue } from "./runtime-shared-7qI1DEx4.mjs";
import { t as isLikelySensitiveModelProviderHeaderName } from "./model-provider-header-policy-BJFhktBT.mjs";
import { s as isNonSecretApiKeyMarker } from "./model-auth-markers-Cuz_bq6T.mjs";
import { a as readSecretStoreValue, n as listSecretStoreEntries } from "./secret-store-B2HXTuK3.mjs";
//#region src/secrets/audit-store.ts
async function findSecretStoreRedactedValueFindings(params) {
	return (await listSecretStoreEntries({
		scope: { kind: "team" },
		redactedOnly: true,
		database: params.database
	})).flatMap((entry) => {
		if (params.excludeNames?.has(entry.name)) return [];
		return [{
			name: entry.name,
			code: "PLACEHOLDER_VALUE",
			severity: "error",
			file: params.database.path ?? resolveOpenClawStateSqlitePath(params.database.env),
			jsonPath: `secret_store_entries.${entry.name}`,
			message: `Secret store entry "${entry.name}" contains a redaction placeholder and is unavailable. Run openclaw doctor --fix to repair a store-backed Gateway token; replace other entries with real credentials.`
		}];
	});
}
async function findSecretStorePlaintextResidueFindings(params) {
	const entries = await listSecretStoreEntries({
		scope: { kind: "team" },
		database: params.database
	});
	if (entries.length === 0 || params.assignments.length === 0) return [];
	const namesByValue = /* @__PURE__ */ new Map();
	for (const entry of entries) {
		const result = await readSecretStoreValue({
			scope: { kind: "team" },
			name: entry.name,
			database: params.database
		});
		if (!result.ok) {
			if (result.error.code === "SECRET_STORE_NOT_FOUND") continue;
			if (result.error.code === "SECRET_STORE_INVALID_NAME") throw new Error(result.error.message);
			throw new Error(result.error.message, { cause: result.error.cause });
		}
		const names = namesByValue.get(result.value);
		if (names) names.push(entry.name);
		else namesByValue.set(result.value, [entry.name]);
	}
	return params.assignments.flatMap((assignment) => (namesByValue.get(assignment.value) ?? []).map((name) => ({
		code: "STORE_PLAINTEXT_RESIDUE",
		severity: "warn",
		file: assignment.file,
		jsonPath: assignment.path,
		message: `${assignment.path} duplicates team secret store entry "${name}"; replace the plaintext with a store SecretRef.`
	})));
}
//#endregion
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
export { findSecretStorePlaintextResidueFindings as n, findSecretStoreRedactedValueFindings as r, classifyConfigSecretTarget as t };
