import { o as ENV_SECRET_REF_ID_RE } from "./openclaw-state-read-types.secrets-Wz8lmfvB.mjs";
import { n as hasNodeErrorCode } from "./openclaw-state-read-path-DKRN8JwZ.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, o as iterateSqliteQuerySync, r as executeSqliteQuerySync } from "./openclaw-state-read-kysely-sync-DrKJlREt.mjs";
import { n as SecretStoreValidationError, t as SECRET_STORE_VALUE_MAX_BYTES } from "./openclaw-state-read-secret-store-validation-error-Bzzf_1MN.mjs";
const REDACTED_SECRET_VALUES = /* @__PURE__ */ new Set([
	"__OPENCLAW_REDACTED__",
	"REDACTED",
	"xoxb-REDACTED",
	"xapp-REDACTED",
	"***",
	"[redacted]",
	"[REDACTED]",
	"<redacted>",
	"[REDACTED_PRIVATE_KEY]",
	"[REDACTED CREDENTIAL]"
]);
function isRedactedSecretValue(value) {
	return typeof value === "string" && REDACTED_SECRET_VALUES.has(value.trim());
}
//#endregion
//#region src/secrets/store/secret-store-github-names.ts
const HIDDEN_GITHUB_STORE_NAME_PATTERN = /^github-(setup|device|oauth)-[a-f0-9]{32}$/u;
function classifyHiddenGitHubStoreName(name) {
	const kind = HIDDEN_GITHUB_STORE_NAME_PATTERN.exec(name)?.[1];
	return kind === "setup" || kind === "device" || kind === "oauth" ? kind : void 0;
}
//#endregion
//#region src/secrets/store/secret-store-sqlite.ts
function withMissingSecretStoreFallback(operation, missing) {
	try {
		return operation();
	} catch (error) {
		if (error instanceof Error && hasNodeErrorCode(error, "ERR_SQLITE_ERROR") && error.message === "no such table: secret_store_entries") return missing;
		throw error;
	}
}
//#endregion
//#region src/secrets/store/secret-store-validation.ts
function assertSecretStoreEnvName(name) {
	if (!ENV_SECRET_REF_ID_RE.test(name)) throw new SecretStoreValidationError("SECRET_STORE_INVALID_NAME", `Secret store name must match ${String(ENV_SECRET_REF_ID_RE)}.`);
}
//#endregion
//#region src/secrets/store/secret-store-metadata.kernel.ts
const EXEC_ENVIRONMENT_MAX_BYTES = 512 * SECRET_STORE_VALUE_MAX_BYTES;
function readExecEnvironmentRows(sqlite, input) {
	const rows = [];
	const excluded = new Set(input.excludeNames);
	let bytes = 0;
	return withMissingSecretStoreFallback(() => {
		const query = getNodeSqliteKysely(sqlite).selectFrom("secret_store_entries").select([
			"name",
			"value",
			"kind",
			"allowed_hosts"
		]).where("scope_kind", "=", "team").where("scope_id", "=", "").where("deleted_at_ms", "is", null).orderBy("name", "asc");
		for (const row of iterateSqliteQuerySync(sqlite, query)) {
			if (classifyHiddenGitHubStoreName(row.name) !== void 0 || excluded.has(row.name)) continue;
			bytes += 32 + Buffer.byteLength(row.name) + Buffer.byteLength(row.value) + Buffer.byteLength(row.kind) + Buffer.byteLength(row.allowed_hosts ?? "");
			if (bytes > EXEC_ENVIRONMENT_MAX_BYTES) throw new Error("Secret store exec environment exceeds its 32 MiB read limit. Reduce the stored exec environment before retrying.");
			rows.push(row);
		}
		return rows;
	}, []);
}
function readValueRow(sqlite, name) {
	assertSecretStoreEnvName(name);
	return withMissingSecretStoreFallback(() => {
		const row = executeSqliteQueryTakeFirstSync(sqlite, getNodeSqliteKysely(sqlite).selectFrom("secret_store_entries").select(["value", "kind"]).where("scope_kind", "=", "team").where("scope_id", "=", "").where("name", "=", name).where("deleted_at_ms", "is", null));
		if (row && Buffer.byteLength(row.value) > 65536) throw new Error("Secret store value exceeds its 64 KiB read limit.");
		return row;
	}, void 0);
}
function readSelectedSecretRows(sqlite, names) {
	for (const name of names) assertSecretStoreEnvName(name);
	if (names.length === 0) return [];
	return withMissingSecretStoreFallback(() => {
		const query = getNodeSqliteKysely(sqlite).selectFrom("secret_store_entries").select([
			"name",
			"value",
			"allowed_hosts"
		]).where("scope_kind", "=", "team").where("scope_id", "=", "").where("kind", "=", "secret").where("deleted_at_ms", "is", null).where("name", "in", [...new Set(names)]).orderBy("name", "asc");
		const rows = [];
		let bytes = 0;
		for (const row of iterateSqliteQuerySync(sqlite, query)) {
			if (Buffer.byteLength(row.value) > 65536) throw new Error("Secret store value exceeds its 64 KiB read limit.");
			bytes += 32 + Buffer.byteLength(row.name) + Buffer.byteLength(row.value) + Buffer.byteLength(row.allowed_hosts ?? "");
			if (bytes > EXEC_ENVIRONMENT_MAX_BYTES) throw new Error("Selected secret store entries exceed their 32 MiB read limit.");
			rows.push(row);
		}
		return rows;
	}, []);
}
function listSecretStoreRows(sqlite, params) {
	return withMissingSecretStoreFallback(() => {
		let query = getNodeSqliteKysely(sqlite).selectFrom("secret_store_entries").selectAll().where("scope_kind", "=", "team").where("scope_id", "=", "").orderBy("name", "asc");
		if (!params.includeDeleted) query = query.where("deleted_at_ms", "is", null);
		return executeSqliteQuerySync(sqlite, query).rows.filter((row) => classifyHiddenGitHubStoreName(row.name) === void 0 && (!params.redactedOnly || isRedactedSecretValue(row.value)));
	}, []);
}
const secretStoreReadOperations = {
	"secrets.selected": (input, db) => ({
		type: "secrets.selected",
		rows: readSelectedSecretRows(db, input.names)
	}),
	"secrets.execEnvironment": (input, db) => ({
		type: "secrets.execEnvironment",
		rows: readExecEnvironmentRows(db, input)
	}),
	"secrets.value": (input, db) => ({
		type: "secrets.value",
		row: readValueRow(db, input.name)
	}),
	"secrets.metadata": (input, db) => ({
		type: "secrets.metadata",
		rows: listSecretStoreRows(db, input)
	})
};
//#endregion
export { secretStoreReadOperations };
