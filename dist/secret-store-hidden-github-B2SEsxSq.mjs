import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-CKxLTepq.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { n as normalizeSqliteNumber } from "./sqlite-number-DM1AypRG.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { T as ensureSecretStoreSchema, c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
import { n as SecretStoreValidationError, t as SECRET_STORE_VALUE_MAX_BYTES } from "./secret-store-validation-error-Bzzf_1MN.mjs";
//#region src/secrets/store/secret-store-sqlite.ts
function isMissingSecretStoreTableError(error) {
	return error instanceof Error && hasErrnoCode(error, "ERR_SQLITE_ERROR") && error.message === "no such table: secret_store_entries";
}
//#endregion
//#region src/secrets/store/secret-store-hidden-github.ts
const GITHUB_SETUP_HANDOFF_MAX_AGE_MS = 6e5;
const GITHUB_DEVICE_STORE_MAX_AGE_MS = 9e5;
const HIDDEN_GITHUB_STORE_NAME_PATTERN = /^github-(setup|device|oauth)-[a-f0-9]{32}$/u;
function classifyHiddenGitHubStoreName(name) {
	const kind = HIDDEN_GITHUB_STORE_NAME_PATTERN.exec(name)?.[1];
	return kind === "setup" || kind === "device" || kind === "oauth" ? kind : void 0;
}
function assertHiddenGitHubSecretRecordName(name) {
	const kind = classifyHiddenGitHubStoreName(name);
	if (kind !== "device" && kind !== "oauth") throw new SecretStoreValidationError("SECRET_STORE_INVALID_NAME", "Hidden GitHub secret record name must match github-device-<32 lowercase hex characters> or github-oauth-<32 lowercase hex characters>.");
	return kind;
}
function hiddenGitHubStoreKindFromPrefix(prefix) {
	if (prefix === "github-device") return "device";
	if (prefix === "github-oauth") return "oauth";
	throw new SecretStoreValidationError("SECRET_STORE_INVALID_NAME", "Hidden GitHub secret record prefix must be \"github-device\" or \"github-oauth\".");
}
function validateHiddenGitHubSecretValue(value) {
	if (Buffer.byteLength(value, "utf8") > 65536) throw new SecretStoreValidationError("SECRET_STORE_VALUE_TOO_LARGE", `Secret store value exceeds ${SECRET_STORE_VALUE_MAX_BYTES} UTF-8 bytes.`);
	if (value.length === 0) throw new SecretStoreValidationError("SECRET_STORE_VALUE_EMPTY", "Secret store value is empty. Secret entries require a value; check the command that produced it.");
}
var PersonalGitHubStateError = class extends Error {
	constructor() {
		super("Personal GitHub state is invalid; disconnect and reconnect My GitHub.");
	}
};
/** Private GitHub aggregate only; identity secrets have no generic reader or projection. */
function readPersonalGitHubSecret(db, profileId) {
	try {
		const row = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("secret_store_entries").select([
			"value",
			"kind",
			"allowed_hosts"
		]).where("scope_kind", "=", "identity").where("scope_id", "=", profileId).where("name", "=", "github-connection").where("deleted_at_ms", "is", null));
		if (row) {
			if (row.kind !== "secret" || row.allowed_hosts !== null) throw new PersonalGitHubStateError();
			try {
				validateHiddenGitHubSecretValue(row.value);
			} catch (error) {
				if (error instanceof SecretStoreValidationError) throw new PersonalGitHubStateError();
				throw error;
			}
			registerSecretValueForRedaction(row.value);
		}
		return row?.value;
	} catch (error) {
		if (isMissingSecretStoreTableError(error)) return;
		throw error;
	}
}
/** The caller owns the synchronous profile/connection transaction and its preconditions. */
function writePersonalGitHubSecret(db, profileId, value) {
	const query = getNodeSqliteKysely(db);
	if (value === null) {
		executeSqliteQuerySync(db, query.deleteFrom("secret_store_entries").where("scope_kind", "=", "identity").where("scope_id", "=", profileId).where("name", "=", "github-connection"));
		return;
	}
	validateHiddenGitHubSecretValue(value);
	ensureSecretStoreSchema(db);
	upsertHiddenGitHubSecret(db, {
		scope_kind: "identity",
		scope_id: profileId,
		name: "github-connection",
		value,
		updated_by: null
	}, Date.now());
	registerSecretValueForRedaction(value);
}
function upsertHiddenGitHubSecret(db, entry, now) {
	const values = {
		value: entry.value,
		updated_by: entry.updated_by,
		kind: "secret",
		allowed_hosts: null,
		deleted_at_ms: null,
		updated_at_ms: now
	};
	executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("secret_store_entries").values({
		...entry,
		...values,
		created_at_ms: now
	}).onConflict((conflict) => conflict.columns([
		"scope_kind",
		"scope_id",
		"name"
	]).doUpdateSet(values)));
}
function isLiveHiddenGitHubStoreRow(row, kind, now) {
	const createdAtMs = normalizeSqliteNumber(row.created_at_ms);
	const updatedAtMs = normalizeSqliteNumber(row.updated_at_ms);
	return createdAtMs !== void 0 && updatedAtMs !== void 0 && createdAtMs <= now && (kind !== "device" || createdAtMs > now - 9e5);
}
/** Writes one hidden GitHub authorization record without exposing a generic mutation path. */
function writeHiddenGitHubSecretRecord(params) {
	assertHiddenGitHubSecretRecordName(params.name);
	validateHiddenGitHubSecretValue(params.value);
	const now = Date.now();
	runOpenClawStateWriteTransaction(({ db: sqlite }) => {
		ensureSecretStoreSchema(sqlite);
		upsertHiddenGitHubSecret(sqlite, {
			scope_kind: "team",
			scope_id: "",
			name: params.name,
			value: params.value,
			updated_by: params.updatedBy ?? null
		}, now);
	}, params.database, { operationLabel: "secrets.store.write" });
	registerSecretValueForRedaction(params.value);
}
/** Reads one exact live hidden GitHub authorization record. */
function readHiddenGitHubSecretRecord(params) {
	const kind = assertHiddenGitHubSecretRecordName(params.name);
	try {
		const row = withExistingOpenClawStateDatabaseReadOnly(({ db: sqlite }) => {
			const db = getNodeSqliteKysely(sqlite);
			return executeSqliteQueryTakeFirstSync(sqlite, db.selectFrom("secret_store_entries").select([
				"name",
				"value",
				"created_at_ms",
				"updated_at_ms"
			]).where("scope_kind", "=", "team").where("scope_id", "=", "").where("name", "=", params.name).where("kind", "=", "secret").where("allowed_hosts", "is", null).where("deleted_at_ms", "is", null));
		}, params.database ?? {});
		if (!row || !isLiveHiddenGitHubStoreRow(row, kind, Date.now())) return;
		registerSecretValueForRedaction(row.value);
		return row.value;
	} catch (error) {
		if (isMissingSecretStoreTableError(error)) return;
		throw error;
	}
}
/** Lists live hidden GitHub authorization records of one exact class. */
function listHiddenGitHubSecretRecordNames(params) {
	try {
		const now = Date.now();
		const kind = hiddenGitHubStoreKindFromPrefix(params.prefix);
		return withExistingOpenClawStateDatabaseReadOnly(({ db: sqlite }) => {
			const db = getNodeSqliteKysely(sqlite);
			return executeSqliteQuerySync(sqlite, db.selectFrom("secret_store_entries").select([
				"name",
				"value",
				"created_at_ms",
				"updated_at_ms"
			]).where("scope_kind", "=", "team").where("scope_id", "=", "").where("name", ">=", `${params.prefix}-`).where("name", "<", `${params.prefix}.`).where("kind", "=", "secret").where("allowed_hosts", "is", null).where("deleted_at_ms", "is", null).orderBy("name", "asc")).rows.flatMap((row) => {
				if (classifyHiddenGitHubStoreName(row.name) !== kind || !isLiveHiddenGitHubStoreRow(row, kind, now)) return [];
				registerSecretValueForRedaction(row.value);
				return [row.name];
			});
		}, params.database ?? {}) ?? [];
	} catch (error) {
		if (isMissingSecretStoreTableError(error)) return [];
		throw error;
	}
}
/** Hard-deletes one exact hidden GitHub authorization record. */
function deleteHiddenGitHubSecretRecord(params) {
	assertHiddenGitHubSecretRecordName(params.name);
	try {
		runOpenClawStateWriteTransaction(({ db: sqlite }) => {
			const db = getNodeSqliteKysely(sqlite);
			executeSqliteQuerySync(sqlite, db.deleteFrom("secret_store_entries").where("scope_kind", "=", "team").where("scope_id", "=", "").where("name", "=", params.name));
		}, params.database, { operationLabel: "secrets.store.delete-hidden-github" });
	} catch (error) {
		if (!isMissingSecretStoreTableError(error)) throw error;
	}
}
//#endregion
export { deleteHiddenGitHubSecretRecord as a, readPersonalGitHubSecret as c, isMissingSecretStoreTableError as d, classifyHiddenGitHubStoreName as i, writeHiddenGitHubSecretRecord as l, GITHUB_SETUP_HANDOFF_MAX_AGE_MS as n, listHiddenGitHubSecretRecordNames as o, PersonalGitHubStateError as r, readHiddenGitHubSecretRecord as s, GITHUB_DEVICE_STORE_MAX_AGE_MS as t, writePersonalGitHubSecret as u };
