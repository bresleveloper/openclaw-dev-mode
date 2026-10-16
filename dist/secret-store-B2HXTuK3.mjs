import { s as registerSecretValueForRedaction } from "./secret-redaction-registry-DorVHn0l.mjs";
import { a as getNodeSqliteKysely, i as executeSqliteQueryTakeFirstSync, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { n as normalizeSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { n as SecretStoreValidationError } from "./secret-store-validation-error-Bu8SnJkb.mjs";
import { n as isRedactedSecretValue } from "./redact-sentinel-f_PhnHTI.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { n as captureOpenClawStateReadWorkerContext, r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { g as ensureSecretStoreSchema } from "./openclaw-state-db-schema-additive-CzAgdzE5.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-CsIRv3py.mjs";
import { a as runOpenClawStateWorkerOperation, n as executeOpenClawStateWorker } from "./openclaw-state-worker-store-DCVYVtaO.mjs";
import { u as sealSecretSentinel } from "./sentinel-D8TyDpFw.mjs";
import { d as isMissingSecretStoreTableError, i as classifyHiddenGitHubStoreName, n as GITHUB_SETUP_HANDOFF_MAX_AGE_MS } from "./secret-store-hidden-github-D9HzXdxU.mjs";
import { a as normalizeScope, c as captureSecretStoreExpiryCutoffs, o as normalizeSecretAllowedHosts, r as assertSecretStoreValue, s as parseSecretAllowedHosts, t as assertSecretStoreEnvName } from "./secret-store-validation-4kXS6fgx.mjs";
import { randomUUID } from "node:crypto";
//#region src/secrets/store/secret-store-mutations.ts
function admission(context, assertCallerCurrent) {
	const assertCurrent = () => {
		context.admission.assertCurrent();
		assertCallerCurrent?.();
	};
	return {
		assertCurrent,
		createAdmission: createSqliteWorkerWriteAdmission(assertCurrent, [context.admission.databasePath])
	};
}
function write(params, capturePrevious) {
	const context = captureOpenClawStateWorkerContext(params.database);
	const { database: _database, assertCurrent, ...input } = params;
	const captured = structuredClone(input);
	const now = Date.now();
	for (const entry of captured.entries) {
		registerSecretValueForRedaction(entry.value);
		if (entry.expectedValue !== void 0) registerSecretValueForRedaction(entry.expectedValue);
	}
	return {
		context,
		result: runOpenClawStateWorkerOperation(context, async (scope) => {
			const results = await scope.execute({
				type: "secrets.write",
				input: {
					...captured,
					capturePrevious,
					now
				}
			});
			for (const written of results) if (written.previous) registerSecretValueForRedaction(written.previous.value);
			return results;
		}, admission(context, assertCurrent))
	};
}
async function writeSecretStoreEntries(params) {
	return (await write(params, false).result).map((result) => result.kind);
}
async function writeSecretStoreEntry(params) {
	const { scope, database, updatedBy, inheritExistingKind, assertCurrent, ...entry } = params;
	const [kind] = await writeSecretStoreEntries({
		scope,
		database,
		updatedBy,
		inheritExistingKind,
		assertCurrent,
		entries: [entry]
	});
	if (!kind) throw new Error("Secret store write returned no entry result.");
	return kind;
}
async function deleteSecretStoreEntry(params) {
	const context = captureOpenClawStateWorkerContext(params.database);
	const input = {
		scope: { ...params.scope },
		name: params.name,
		now: Date.now()
	};
	await runOpenClawStateWorkerOperation(context, (owner) => owner.execute({
		type: "secrets.delete",
		input
	}), admission(context, params.assertCurrent));
}
/** Compensation stays bound to the original physical store and exact writer. */
async function writeSecretStoreEntryWithRollback(params) {
	const { scope, database, updatedBy, inheritExistingKind, assertCurrent, ...entry } = params;
	const capturedScope = { ...scope };
	const writer = `${updatedBy ?? "secret-store"}:${randomUUID()}`;
	const pending = write({
		scope: capturedScope,
		database,
		updatedBy: writer,
		inheritExistingKind,
		assertCurrent,
		entries: [entry]
	}, true);
	const [result] = await pending.result;
	if (!result) throw new Error("Secret store write returned no entry result.");
	const previous = result.previous;
	let rollback;
	return { rollback: () => {
		const now = Date.now();
		return rollback ??= runOpenClawStateWorkerOperation(pending.context, (owner) => owner.execute({
			type: "secrets.rollback",
			input: {
				scope: capturedScope,
				name: entry.name,
				expectedUpdatedBy: writer,
				previous,
				now
			}
		}), admission(pending.context));
	} };
}
//#endregion
//#region src/secrets/store/secret-store.ts
const log = createSubsystemLogger("secrets/store");
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
async function listSecretStoreEntries(params) {
	const context = captureOpenClawStateReadWorkerContext(params.database);
	params.assertCurrent?.();
	const reply = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "secrets.metadata",
		input: {
			scope: { ...params.scope },
			includeDeleted: params.includeDeleted,
			redactedOnly: params.redactedOnly
		}
	}, {
		context,
		current: true
	});
	if (reply && (!reply.ok || reply.type !== "secrets.metadata")) throw new Error("Unexpected secret store metadata result.");
	const entries = (reply?.rows ?? []).map(toMetadata);
	context.admission.assertCurrent();
	params.assertCurrent?.();
	return entries;
}
/** Atomically returns and hard-deletes one exact fresh, non-egress GitHub setup handoff. */
function consumeGitHubSetupHandoff(params) {
	if (classifyHiddenGitHubStoreName(params.name) !== "setup") return;
	const now = params.nowMs ?? Date.now();
	try {
		const value = runOpenClawStateWriteTransaction(({ db: sqlite }) => {
			const db = getNodeSqliteKysely(sqlite);
			const row = executeSqliteQueryTakeFirstSync(sqlite, db.selectFrom("secret_store_entries").select("value").where("scope_kind", "=", "team").where("scope_id", "=", "").where("name", "=", params.name).where("kind", "=", "secret").where("allowed_hosts", "is", null).where("created_at_ms", ">=", now - GITHUB_SETUP_HANDOFF_MAX_AGE_MS).where("created_at_ms", "<=", now).where("deleted_at_ms", "is", null));
			if (!row) return;
			executeSqliteQuerySync(sqlite, db.deleteFrom("secret_store_entries").where("scope_kind", "=", "team").where("scope_id", "=", "").where("name", "=", params.name));
			return row.value;
		}, params.database, { operationLabel: "secrets.store.consume-github-setup-handoff" });
		if (value !== void 0) registerSecretValueForRedaction(value);
		return value;
	} catch (error) {
		if (isMissingSecretStoreTableError(error)) return;
		throw error;
	}
}
/** Captures one coherent team-store snapshot for an agent run's exec environment. */
async function readSecretStoreExecEnvironment(params) {
	const context = params.context ?? captureOpenClawStateReadWorkerContext(params.database);
	const includeSecretSentinels = params.includeSecretSentinels;
	const reply = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "secrets.execEnvironment",
		input: { excludeNames: params.excludeNames ?? [] }
	}, {
		context,
		preferIndependentWarmRead: true
	});
	if (reply && (!reply.ok || reply.type !== "secrets.execEnvironment")) throw new Error("Unexpected secret store exec environment result.");
	const rows = reply?.rows ?? [];
	for (const row of rows) if (row.kind === "secret" && !isRedactedSecretValue(row.value)) registerSecretValueForRedaction(row.value);
	context.admission.assertCurrent();
	const env = {};
	const secretSentinels = {};
	const secretEgressBindings = [];
	for (const row of rows) {
		if (isRedactedSecretValue(row.value)) {
			log.warn(`Secret store entry "${row.name}" contains a redaction placeholder; excluded from the exec environment. Replace it with a real value, or run openclaw doctor --fix for a Gateway token.`);
			continue;
		}
		if (row.kind === "env") {
			env[row.name] = row.value;
			continue;
		}
		if (includeSecretSentinels) {
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
}
async function readSecretStoreValue(params) {
	try {
		const name = params.name;
		assertSecretStoreEnvName(name);
		const context = params.context ?? captureOpenClawStateReadWorkerContext(params.database);
		params.assertCurrent?.();
		const reply = await executeExistingOpenClawStateRead({
			path: context.admission.databasePath,
			env: context.environment
		}, {
			type: "secrets.value",
			input: { name }
		}, {
			context,
			preferIndependentWarmRead: true
		});
		if (reply && (!reply.ok || reply.type !== "secrets.value")) throw new Error("Unexpected secret store value result.");
		const row = reply?.row;
		if (row?.kind === "secret") registerSecretValueForRedaction(row.value);
		context.admission.assertCurrent();
		params.assertCurrent?.();
		if (!row) return err({
			code: "SECRET_STORE_NOT_FOUND",
			message: `Secret store entry "${name}" was not found.`
		});
		return ok(row.value);
	} catch (error) {
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
/**
* Saves a secret for one config key in a fresh team-store entry through the
* state worker and returns the entry name. `assertCurrent` is the requester's
* live authority; the worker checks it again at transaction and commit
* admission, so a revoked request writes nothing.
*/
async function writeSecretStoreEntryForConfigRef(params) {
	registerSecretValueForRedaction(params.value);
	assertSecretStoreValue(params.value, "secret", params.baseName);
	const context = captureOpenClawStateWorkerContext(params.database);
	const assertCurrent = () => {
		context.admission.assertCurrent();
		params.assertCurrent?.();
	};
	const { name } = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "secrets.writeForConfigRef",
		input: {
			baseName: params.baseName,
			value: params.value,
			writer: params.updatedBy,
			now: Date.now()
		}
	}), {
		assertCurrent,
		createAdmission: createSqliteWorkerWriteAdmission(assertCurrent, [context.admission.databasePath])
	});
	return name;
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
async function purgeExpiredSecretStoreEntries(params = {}) {
	const input = captureSecretStoreExpiryCutoffs();
	const context = captureOpenClawStateWorkerContext(params.database);
	return await executeOpenClawStateWorker(context, {
		type: "secrets.purge",
		input
	});
}
//#endregion
export { readSecretStoreValue as a, deleteSecretStoreEntry as c, writeSecretStoreEntryWithRollback as d, readSecretStoreExecEnvironment as i, writeSecretStoreEntries as l, listSecretStoreEntries as n, updateSecretStoreAllowedHosts as o, purgeExpiredSecretStoreEntries as r, writeSecretStoreEntryForConfigRef as s, consumeGitHubSetupHandoff as t, writeSecretStoreEntry as u };
