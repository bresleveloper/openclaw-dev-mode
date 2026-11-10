import { a as registerSecretValueForRedaction } from "./secret-redaction-registry-C0-kg1Rg.mjs";
import { a as executeSqliteQueryTakeFirstSync, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { n as normalizeSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { l as SecretStoreValidationError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { _ as ensureSecretStoreSchema } from "./openclaw-state-db-schema-additive-Dk7csa7u.mjs";
import { a as classifyHiddenGitHubStoreName, i as assertHiddenGitHubSecretRecordName, o as hiddenGitHubStoreKindFromPrefix, t as assertSecretStoreValueLength } from "./secret-store-value-B2wKejcx.mjs";
import { t as withMissingSecretStoreFallback } from "./secret-store-sqlite-Bm3BSwuM.mjs";
//#region src/secrets/store/secret-store-hidden-github.kernel.ts
var PersonalGitHubStateError = class extends Error {
	constructor() {
		super("Personal GitHub state is invalid; disconnect and reconnect My GitHub.");
	}
};
/** Private GitHub aggregate only; identity secrets have no generic reader or projection. */
function readPersonalGitHubSecret(db, profileId) {
	return withMissingSecretStoreFallback(() => {
		const row = executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("secret_store_entries").select([
			"value",
			"kind",
			"allowed_hosts"
		]).where("scope_kind", "=", "identity").where("scope_id", "=", profileId).where("name", "=", "github-connection").where("deleted_at_ms", "is", null));
		if (row) {
			if (row.kind !== "secret" || row.allowed_hosts !== null) throw new PersonalGitHubStateError();
			try {
				assertSecretStoreValueLength(row.value, "secret");
			} catch (error) {
				if (error instanceof SecretStoreValidationError) throw new PersonalGitHubStateError();
				throw error;
			}
			registerSecretValueForRedaction(row.value);
		}
		return row?.value;
	}, void 0);
}
/** The caller owns the synchronous profile/connection transaction and its preconditions. */
function writePersonalGitHubSecret(db, profileId, value) {
	const query = getNodeSqliteKysely(db);
	if (value === null) {
		executeSqliteQuerySync(db, query.deleteFrom("secret_store_entries").where("scope_kind", "=", "identity").where("scope_id", "=", profileId).where("name", "=", "github-connection"));
		return;
	}
	assertSecretStoreValueLength(value, "secret");
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
function selectHiddenGitHubSecretRecords(sqlite) {
	return getNodeSqliteKysely(sqlite).selectFrom("secret_store_entries").select([
		"name",
		"value",
		"created_at_ms",
		"updated_at_ms"
	]).where("scope_kind", "=", "team").where("scope_id", "=", "").where("kind", "=", "secret").where("allowed_hosts", "is", null).where("deleted_at_ms", "is", null);
}
function writeHiddenGitHubSecretInDatabase(sqlite, params) {
	assertHiddenGitHubSecretRecordName(params.name);
	assertSecretStoreValueLength(params.value, "secret");
	ensureSecretStoreSchema(sqlite);
	upsertHiddenGitHubSecret(sqlite, {
		scope_kind: "team",
		scope_id: "",
		name: params.name,
		value: params.value,
		updated_by: params.updatedBy ?? null
	}, params.now);
}
function readHiddenGitHubSecretInDatabase(sqlite, name, now) {
	const kind = assertHiddenGitHubSecretRecordName(name);
	return withMissingSecretStoreFallback(() => {
		const row = executeSqliteQueryTakeFirstSync(sqlite, selectHiddenGitHubSecretRecords(sqlite).where("name", "=", name));
		return row && isLiveHiddenGitHubStoreRow(row, kind, now) ? row.value : void 0;
	}, void 0);
}
function listHiddenGitHubSecretsInDatabase(sqlite, prefix, now) {
	const kind = hiddenGitHubStoreKindFromPrefix(prefix);
	return withMissingSecretStoreFallback(() => executeSqliteQuerySync(sqlite, selectHiddenGitHubSecretRecords(sqlite).where("name", ">=", `${prefix}-`).where("name", "<", `${prefix}.`).orderBy("name", "asc")).rows.flatMap((row) => classifyHiddenGitHubStoreName(row.name) === kind && isLiveHiddenGitHubStoreRow(row, kind, now) ? [{
		name: row.name,
		value: row.value
	}] : []), []);
}
function deleteHiddenGitHubSecretInDatabase(sqlite, name) {
	assertHiddenGitHubSecretRecordName(name);
	withMissingSecretStoreFallback(() => executeSqliteQuerySync(sqlite, getNodeSqliteKysely(sqlite).deleteFrom("secret_store_entries").where("scope_kind", "=", "team").where("scope_id", "=", "").where("name", "=", name)), void 0);
}
//#endregion
export { readPersonalGitHubSecret as a, readHiddenGitHubSecretInDatabase as i, deleteHiddenGitHubSecretInDatabase as n, writeHiddenGitHubSecretInDatabase as o, listHiddenGitHubSecretsInDatabase as r, writePersonalGitHubSecret as s, PersonalGitHubStateError as t };
