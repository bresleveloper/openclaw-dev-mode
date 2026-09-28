import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { n as ENV_SECRET_REF_ID_RE } from "./ref-contract-BVi3ykLT.mjs";
import "./types.secrets-B5xWSzLp.mjs";
import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-CKxLTepq.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { n as normalizeSqliteNumber } from "./sqlite-number-DM1AypRG.mjs";
import { u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { t as normalizeExactAllowedHost } from "./exact-hostname-B5MIU7_E.mjs";
import { T as ensureSecretStoreSchema, c as runOpenClawStateWriteTransaction, r as openOpenClawStateDatabase } from "./openclaw-state-db-BFK9cMiV.mjs";
import { t as executeOpenClawStateWorker } from "./openclaw-state-worker-store-YAl4mP45.mjs";
import { n as isRedactedSecretValue } from "./redact-sentinel-f_PhnHTI.mjs";
import { l as sealSecretSentinel } from "./sentinel-C86v7W15.mjs";
import { d as isMissingSecretStoreTableError, i as classifyHiddenGitHubStoreName, n as GITHUB_SETUP_HANDOFF_MAX_AGE_MS } from "./secret-store-hidden-github-B2SEsxSq.mjs";
import { n as SecretStoreValidationError, t as SECRET_STORE_VALUE_MAX_BYTES } from "./secret-store-validation-error-Bzzf_1MN.mjs";
import { t as captureSecretStoreExpiryCutoffs } from "./secret-store-expiry.kernel-DNhBREic.mjs";
import { randomUUID } from "node:crypto";
//#region src/secrets/store/secret-store.ts
const log = createSubsystemLogger("secrets/store");
function normalizeScope(_scope) {
	return {
		scopeKind: "team",
		scopeId: ""
	};
}
function assertSecretStoreEnvName(name) {
	if (!ENV_SECRET_REF_ID_RE.test(name)) throw new SecretStoreValidationError("SECRET_STORE_INVALID_NAME", `Secret store name must match ${String(ENV_SECRET_REF_ID_RE)}.`);
}
function assertSecretStoreMutationName(name) {
	if (!ENV_SECRET_REF_ID_RE.test(name) && classifyHiddenGitHubStoreName(name) !== "setup") throw new SecretStoreValidationError("SECRET_STORE_INVALID_NAME", `Secret store name must match ${String(ENV_SECRET_REF_ID_RE)} or github-setup-<32 lowercase hex characters>.`);
}
function assertSecretStoreValue(value, kind, name) {
	if (isRedactedSecretValue(value)) throw new SecretStoreValidationError("SECRET_STORE_VALUE_REDACTED", `Secret store entry "${name}" contains a redaction placeholder. Supply a real value or leave the field unchanged. Run openclaw doctor --fix to repair a store-backed Gateway token.`);
	if (Buffer.byteLength(value, "utf8") > 65536) throw new SecretStoreValidationError("SECRET_STORE_VALUE_TOO_LARGE", `Secret store value exceeds ${SECRET_STORE_VALUE_MAX_BYTES} UTF-8 bytes.`);
	if (kind === "secret" && value.length === 0) throw new SecretStoreValidationError("SECRET_STORE_VALUE_EMPTY", "Secret store value is empty. Secret entries require a value; check the command that produced it.");
}
function normalizeSecretAllowedHost(raw) {
	try {
		return normalizeExactAllowedHost(raw);
	} catch (error) {
		throw new SecretStoreValidationError("SECRET_STORE_INVALID_ALLOWED_HOST", error instanceof Error ? error.message : `Allowed host "${raw}" is not a valid hostname.`);
	}
}
function normalizeSecretAllowedHosts(hosts) {
	if (hosts.length > 128) throw new SecretStoreValidationError("SECRET_STORE_INVALID_ALLOWED_HOST", `A secret can allow at most 128 hosts.`);
	return [...new Set(hosts.map(normalizeSecretAllowedHost))].toSorted();
}
function parseSecretAllowedHosts(raw) {
	if (!raw) return [];
	try {
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) && parsed.every((host) => typeof host === "string") ? normalizeSecretAllowedHosts(parsed) : [];
	} catch {
		return [];
	}
}
function toMetadata(row) {
	if (row.kind === "secret") registerSecretValueForRedaction(row.value);
	return {
		name: row.name,
		kind: row.kind,
		scopeKind: row.scope_kind,
		scopeId: row.scope_id,
		updatedAtMs: normalizeSqliteNumber(row.updated_at_ms) ?? 0,
		createdAtMs: normalizeSqliteNumber(row.created_at_ms) ?? 0,
		updatedBy: row.updated_by,
		...row.kind === "secret" ? { allowedHosts: parseSecretAllowedHosts(row.allowed_hosts) } : {},
		...row.kind === "env" ? { valuePreview: row.value } : {}
	};
}
function listSecretStoreEntries(params) {
	const { scopeKind, scopeId } = normalizeScope(params.scope);
	try {
		return withExistingOpenClawStateDatabaseReadOnly(({ db: sqlite }) => {
			let query = getNodeSqliteKysely(sqlite).selectFrom("secret_store_entries").selectAll().where("scope_kind", "=", scopeKind).where("scope_id", "=", scopeId).orderBy("name", "asc");
			if (!params.includeDeleted) query = query.where("deleted_at_ms", "is", null);
			return executeSqliteQuerySync(sqlite, query).rows.filter((row) => classifyHiddenGitHubStoreName(row.name) === void 0 && (!params.redactedOnly || isRedactedSecretValue(row.value))).map(toMetadata);
		}, params.database ?? {}) ?? [];
	} catch (error) {
		if (isMissingSecretStoreTableError(error)) return [];
		throw error;
	}
}
/** Atomically returns and hard-deletes one exact fresh, non-egress GitHub setup handoff. */
function consumeGitHubSetupHandoff(params) {
	if (classifyHiddenGitHubStoreName(params.name) !== "setup") return;
	const now = params.nowMs ?? Date.now();
	try {
		let value;
		runOpenClawStateWriteTransaction(({ db: sqlite }) => {
			const db = getNodeSqliteKysely(sqlite);
			const row = executeSqliteQueryTakeFirstSync(sqlite, db.selectFrom("secret_store_entries").select("value").where("scope_kind", "=", "team").where("scope_id", "=", "").where("name", "=", params.name).where("kind", "=", "secret").where("allowed_hosts", "is", null).where("created_at_ms", ">=", now - GITHUB_SETUP_HANDOFF_MAX_AGE_MS).where("created_at_ms", "<=", now).where("deleted_at_ms", "is", null));
			if (!row) return;
			executeSqliteQuerySync(sqlite, db.deleteFrom("secret_store_entries").where("scope_kind", "=", "team").where("scope_id", "=", "").where("name", "=", params.name));
			value = row.value;
		}, params.database, { operationLabel: "secrets.store.consume-github-setup-handoff" });
		if (value !== void 0) registerSecretValueForRedaction(value);
		return value;
	} catch (error) {
		if (isMissingSecretStoreTableError(error)) return;
		throw error;
	}
}
/** Captures one coherent team-store snapshot for an agent run's exec environment. */
function readSecretStoreExecEnvironment(params) {
	try {
		return withExistingOpenClawStateDatabaseReadOnly(({ db: sqlite }) => {
			const db = getNodeSqliteKysely(sqlite);
			const rows = executeSqliteQuerySync(sqlite, db.selectFrom("secret_store_entries").selectAll().where("scope_kind", "=", "team").where("scope_id", "=", "").where("deleted_at_ms", "is", null).orderBy("name", "asc")).rows;
			const env = {};
			const secretSentinels = {};
			const secretEgressBindings = [];
			const excludedNames = new Set(params.excludeNames ?? []);
			for (const row of rows) {
				if (classifyHiddenGitHubStoreName(row.name) !== void 0 || excludedNames.has(row.name)) continue;
				if (isRedactedSecretValue(row.value)) {
					log.warn(`Secret store entry "${row.name}" contains a redaction placeholder; excluded from the exec environment. Replace it with a real value, or run openclaw doctor --fix for a Gateway token.`);
					continue;
				}
				if (row.kind === "env") {
					env[row.name] = row.value;
					continue;
				}
				registerSecretValueForRedaction(row.value);
				if (params.includeSecretSentinels) {
					const sentinel = sealSecretSentinel(row.value, { label: `exec-store:${row.name}` });
					secretSentinels[row.name] = sentinel;
					secretEgressBindings.push({
						name: row.name,
						sentinel,
						allowedHosts: parseSecretAllowedHosts(row.allowed_hosts)
					});
				}
			}
			return {
				...Object.keys(env).length > 0 ? { env } : {},
				...Object.keys(secretSentinels).length > 0 ? { secretSentinels } : {},
				...secretEgressBindings.length > 0 ? { secretEgressBindings } : {}
			};
		}, params.database ?? {}) ?? {};
	} catch (error) {
		if (isMissingSecretStoreTableError(error)) return {};
		throw error;
	}
}
function readSecretStoreValue(params) {
	try {
		assertSecretStoreEnvName(params.name);
		const { scopeKind, scopeId } = normalizeScope(params.scope);
		const row = withExistingOpenClawStateDatabaseReadOnly(({ db: sqlite }) => {
			const db = getNodeSqliteKysely(sqlite);
			return executeSqliteQueryTakeFirstSync(sqlite, db.selectFrom("secret_store_entries").select(["value", "kind"]).where("scope_kind", "=", scopeKind).where("scope_id", "=", scopeId).where("name", "=", params.name).where("deleted_at_ms", "is", null));
		}, params.database ?? {});
		if (!row) return err({
			code: "SECRET_STORE_NOT_FOUND",
			message: `Secret store entry "${params.name}" was not found.`
		});
		if (row.kind === "secret") registerSecretValueForRedaction(row.value);
		return ok(row.value);
	} catch (error) {
		if (isMissingSecretStoreTableError(error)) return err({
			code: "SECRET_STORE_NOT_FOUND",
			message: `Secret store entry "${params.name}" was not found.`
		});
		if (error instanceof SecretStoreValidationError) return err({
			code: "SECRET_STORE_INVALID_NAME",
			message: error.message
		});
		return err({
			code: "SECRET_STORE_UNAVAILABLE",
			message: "Secret store database is unavailable.",
			cause: error
		});
	}
}
function writeSecretStoreEntryInternal(params, capturePrevious) {
	assertSecretStoreMutationName(params.name);
	assertSecretStoreValue(params.value, params.kind, params.name);
	if (params.kind === "env" && params.allowedHosts !== void 0) throw new SecretStoreValidationError("SECRET_STORE_INVALID_ALLOWED_HOST", "Allowed hosts apply only to secret entries.");
	const allowedHosts = params.kind === "secret" && params.allowedHosts !== void 0 ? normalizeSecretAllowedHosts(params.allowedHosts) : void 0;
	const allowedHostsJson = allowedHosts?.length ? JSON.stringify(allowedHosts) : null;
	const { scopeKind, scopeId } = normalizeScope(params.scope);
	const now = Date.now();
	return runOpenClawStateWriteTransaction(({ db: sqlite }) => {
		ensureSecretStoreSchema(sqlite);
		const db = getNodeSqliteKysely(sqlite);
		const previous = capturePrevious || params.expectedValue !== void 0 ? executeSqliteQueryTakeFirstSync(sqlite, db.selectFrom("secret_store_entries").select([
			"value",
			"kind",
			"allowed_hosts",
			"updated_by"
		]).where("scope_kind", "=", scopeKind).where("scope_id", "=", scopeId).where("name", "=", params.name).where("deleted_at_ms", "is", null)) : void 0;
		if (params.expectedValue !== void 0 && previous?.value !== params.expectedValue) throw new SecretStoreValidationError("SECRET_STORE_VALUE_CHANGED", `Secret store entry "${params.name}" changed before repair; its current value was preserved. Run openclaw doctor again.`);
		executeSqliteQuerySync(sqlite, db.insertInto("secret_store_entries").values({
			scope_kind: scopeKind,
			scope_id: scopeId,
			name: params.name,
			value: params.value,
			kind: params.kind,
			created_at_ms: now,
			updated_at_ms: now,
			updated_by: params.updatedBy,
			deleted_at_ms: null,
			allowed_hosts: allowedHostsJson
		}).onConflict((conflict) => conflict.columns([
			"scope_kind",
			"scope_id",
			"name"
		]).doUpdateSet({
			value: params.value,
			...params.expectedValue === void 0 ? { kind: params.kind } : {},
			updated_at_ms: now,
			updated_by: params.updatedBy,
			deleted_at_ms: null,
			...params.expectedValue === void 0 && (params.kind === "env" || allowedHosts !== void 0) ? { allowed_hosts: allowedHostsJson } : {}
		})));
		return previous ? {
			value: previous.value,
			kind: previous.kind,
			allowedHosts: previous.allowed_hosts,
			updatedBy: previous.updated_by
		} : void 0;
	}, params.database, { operationLabel: "secrets.store.write" });
}
function writeSecretStoreEntry(params) {
	writeSecretStoreEntryInternal(params, false);
}
function rollbackSecretStoreEntryWrite(params) {
	assertSecretStoreMutationName(params.name);
	const { scopeKind, scopeId } = normalizeScope(params.scope);
	const now = Date.now();
	try {
		return runOpenClawStateWriteTransaction(({ db: sqlite }) => {
			const db = getNodeSqliteKysely(sqlite);
			const query = params.previous === void 0 ? db.updateTable("secret_store_entries").set({
				deleted_at_ms: now,
				updated_at_ms: now
			}).where("scope_kind", "=", scopeKind).where("scope_id", "=", scopeId).where("name", "=", params.name).where("updated_by", "=", params.expectedUpdatedBy).where("deleted_at_ms", "is", null) : db.updateTable("secret_store_entries").set({
				value: params.previous.value,
				kind: params.previous.kind,
				allowed_hosts: params.previous.allowedHosts,
				updated_at_ms: now,
				updated_by: params.previous.updatedBy,
				deleted_at_ms: null
			}).where("scope_kind", "=", scopeKind).where("scope_id", "=", scopeId).where("name", "=", params.name).where("updated_by", "=", params.expectedUpdatedBy).where("deleted_at_ms", "is", null);
			const result = executeSqliteQuerySync(sqlite, query);
			return Number(result.numAffectedRows ?? 0n) === 1;
		}, params.database, { operationLabel: "secrets.store.rollback-write" });
	} catch (error) {
		if (isMissingSecretStoreTableError(error)) return false;
		throw error;
	}
}
/** Writes one entry and returns owner-checked compensation for that exact write. */
function writeSecretStoreEntryWithRollback(params) {
	const writer = `${params.updatedBy ?? "secret-store"}:${randomUUID()}`;
	const previous = writeSecretStoreEntryInternal({
		...params,
		updatedBy: writer
	}, true);
	let rollbackResult;
	return { rollback: () => {
		if (rollbackResult !== void 0) return rollbackResult;
		rollbackResult = rollbackSecretStoreEntryWrite({
			scope: params.scope,
			name: params.name,
			expectedUpdatedBy: writer,
			previous,
			...params.database !== void 0 ? { database: params.database } : {}
		});
		return rollbackResult;
	} };
}
function updateSecretStoreAllowedHosts(params) {
	assertSecretStoreEnvName(params.name);
	const allowedHosts = normalizeSecretAllowedHosts(params.allowedHosts);
	const { scopeKind, scopeId } = normalizeScope(params.scope);
	const now = Date.now();
	runOpenClawStateWriteTransaction(({ db: sqlite }) => {
		ensureSecretStoreSchema(sqlite);
		const db = getNodeSqliteKysely(sqlite);
		const updated = executeSqliteQuerySync(sqlite, db.updateTable("secret_store_entries").set({
			allowed_hosts: allowedHosts.length ? JSON.stringify(allowedHosts) : null,
			updated_at_ms: now,
			updated_by: params.updatedBy
		}).where("scope_kind", "=", scopeKind).where("scope_id", "=", scopeId).where("name", "=", params.name).where("kind", "=", "secret").where("deleted_at_ms", "is", null));
		if (Number(updated.numAffectedRows ?? 0n) !== 1) throw new SecretStoreValidationError("SECRET_STORE_INVALID_ALLOWED_HOST", `Secret store entry "${params.name}" is missing or is not a secret entry.`);
	}, params.database, { operationLabel: "secrets.store.allowed-hosts" });
}
function deleteSecretStoreEntry(params) {
	assertSecretStoreMutationName(params.name);
	const { scopeKind, scopeId } = normalizeScope(params.scope);
	const state = openOpenClawStateDatabase(params.database);
	const now = Date.now();
	try {
		runOpenClawStateWriteTransaction(({ db: sqlite }) => {
			const db = getNodeSqliteKysely(sqlite);
			const query = classifyHiddenGitHubStoreName(params.name) === "setup" ? db.deleteFrom("secret_store_entries").where("scope_kind", "=", scopeKind).where("scope_id", "=", scopeId).where("name", "=", params.name) : db.updateTable("secret_store_entries").set({
				deleted_at_ms: now,
				updated_at_ms: now
			}).where("scope_kind", "=", scopeKind).where("scope_id", "=", scopeId).where("name", "=", params.name).where("deleted_at_ms", "is", null);
			executeSqliteQuerySync(sqlite, query);
		}, {
			...params.database,
			database: state
		}, { operationLabel: "secrets.store.delete" });
	} catch (error) {
		if (!isMissingSecretStoreTableError(error)) throw error;
	}
}
async function purgeExpiredSecretStoreEntries(params = {}) {
	const input = captureSecretStoreExpiryCutoffs();
	const context = captureOpenClawStateWorkerContext(params.database);
	return await executeOpenClawStateWorker(context, {
		type: "secrets.purge",
		input
	});
}
//#endregion
export { normalizeSecretAllowedHosts as a, readSecretStoreValue as c, writeSecretStoreEntryWithRollback as d, listSecretStoreEntries as i, updateSecretStoreAllowedHosts as l, consumeGitHubSetupHandoff as n, purgeExpiredSecretStoreEntries as o, deleteSecretStoreEntry as r, readSecretStoreExecEnvironment as s, assertSecretStoreValue as t, writeSecretStoreEntry as u };
