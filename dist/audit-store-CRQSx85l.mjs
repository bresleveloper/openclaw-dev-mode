import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { c as readSecretStoreValue, i as listSecretStoreEntries } from "./secret-store-BjhT4Kcc.mjs";
//#region src/secrets/audit-store.ts
function findSecretStoreRedactedValueFindings(params) {
	return listSecretStoreEntries({
		scope: { kind: "team" },
		redactedOnly: true,
		database: params.database
	}).flatMap((entry) => {
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
function findSecretStorePlaintextResidueFindings(params) {
	const entries = listSecretStoreEntries({
		scope: { kind: "team" },
		database: params.database
	});
	if (entries.length === 0 || params.assignments.length === 0) return [];
	const namesByValue = /* @__PURE__ */ new Map();
	for (const entry of entries) {
		const result = readSecretStoreValue({
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
export { findSecretStoreRedactedValueFindings as n, findSecretStorePlaintextResidueFindings as t };
