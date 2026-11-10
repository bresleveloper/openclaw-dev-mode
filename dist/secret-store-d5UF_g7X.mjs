import { a as registerSecretValueForRedaction } from "./secret-redaction-registry-C0-kg1Rg.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { b as registerOpenClawStateDatabaseLifecycleListener, y as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { n as normalizeSqliteNumber } from "./sqlite-number-DZt1m75H.mjs";
import { l as SecretStoreValidationError } from "./openclaw-state-worker-error-B93Lf_P2.mjs";
import { n as captureOpenClawStateReadWorkerContext, r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { n as createSqliteWorkerWriteAdmission } from "./sqlite-worker-store-Bzw_c0pA.mjs";
import { i as runOpenClawStateWorkerOperation, n as executeOpenClawStateWorker } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { n as isRedactedSecretValue } from "./redact-sentinel-f_PhnHTI.mjs";
import { u as sealSecretSentinel } from "./sentinel-DZP_CK2t.mjs";
import { a as observeSecretStoreMutation, o as publishSecretStoreChange, s as subscribeSecretStoreChanges } from "./secret-store-hidden-github-BnB_SZXU.mjs";
import { o as parseSecretAllowedHosts, r as assertSecretStoreValue, s as captureSecretStoreExpiryCutoffs, t as assertSecretStoreEnvName } from "./secret-store-validation-DdnAIClg.mjs";
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
		result: observeSecretStoreMutation(runOpenClawStateWorkerOperation(context, async (scope) => {
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
		}, admission(context, assertCurrent)), context.admission.databasePath, captured.entries.map((entry) => entry.name))
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
	await observeSecretStoreMutation(runOpenClawStateWorkerOperation(context, (owner) => owner.execute({
		type: "secrets.delete",
		input
	}), admission(context, params.assertCurrent)), context.admission.databasePath, [params.name]);
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
		return rollback ??= observeSecretStoreMutation(runOpenClawStateWorkerOperation(pending.context, (owner) => owner.execute({
			type: "secrets.rollback",
			input: {
				scope: capturedScope,
				name: entry.name,
				expectedUpdatedBy: writer,
				previous,
				now
			}
		}), admission(pending.context)), pending.context.admission.databasePath, [entry.name]);
	} };
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
	const { name } = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "secrets.writeForConfigRef",
		input: {
			baseName: params.baseName,
			value: params.value,
			writer: params.updatedBy,
			now: Date.now()
		}
	}), admission(context, () => params.assertCurrent?.()));
	return name;
}
async function updateSecretStoreAllowedHosts(params) {
	const context = captureOpenClawStateWorkerContext(params.database);
	const { database: _database, assertCurrent, ...input } = params;
	await runOpenClawStateWorkerOperation(context, (owner) => owner.execute({
		type: "secrets.allowedHosts",
		input: {
			...structuredClone(input),
			now: Date.now()
		}
	}), admission(context, assertCurrent));
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
async function consumeGitHubSetupHandoff(params) {
	const context = captureOpenClawStateWorkerContext(params.database);
	const value = await executeOpenClawStateWorker(context, {
		type: "githubSetup.consume",
		input: {
			name: params.name,
			now: params.nowMs ?? Date.now()
		}
	});
	if (value !== void 0) registerSecretValueForRedaction(value);
	return value;
}
/** Loads only named protected secrets and their policy from one read-worker snapshot. */
async function readSelectedSecretStoreEntries(params) {
	const names = [...new Set(params.names)];
	for (const name of names) assertSecretStoreEnvName(name);
	const context = captureOpenClawStateReadWorkerContext(params.database);
	const reply = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "secrets.selected",
		input: { names }
	}, {
		context,
		preferIndependentWarmRead: true
	});
	if (reply && (!reply.ok || reply.type !== "secrets.selected")) throw new Error("Unexpected selected secret store result.");
	context.admission.assertCurrent();
	params.assertCurrent?.();
	return (reply?.rows ?? []).map((row) => {
		if (isRedactedSecretValue(row.value)) throw new Error(`Secret store entry "${row.name}" contains a redaction placeholder. Replace it with a real value.`);
		registerSecretValueForRedaction(row.value);
		return {
			name: row.name,
			value: row.value,
			allowedHosts: parseSecretAllowedHosts(row.allowed_hosts)
		};
	});
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
const expiryObservations = /* @__PURE__ */ new Map();
subscribeSecretStoreChanges(({ databasePath }) => {
	const observation = expiryObservations.get(databasePath);
	if (observation) observation.dirty = true;
});
registerOpenClawStateDatabaseAsyncResource({ async close() {
	const paths = [...expiryObservations.keys()];
	expiryObservations.clear();
	for (const path of paths) publishSecretStoreChange(path);
} });
registerOpenClawStateDatabaseLifecycleListener((event) => {
	if (event.kind !== "opened") {
		const observation = expiryObservations.get(event.path);
		if (observation) {
			observation.dirty = true;
			expiryObservations.delete(event.path);
		}
	}
});
/** Undefined means discovery is needed; null means the owner has no expiry work. */
function getSecretStoreExpiryDeadline() {
	const observation = expiryObservations.get(resolveOpenClawStateSqlitePath());
	return observation?.dirty ? void 0 : observation?.result?.nextExpiryAtMs;
}
async function purgeExpiredSecretStoreEntries(params = {}) {
	const context = captureOpenClawStateWorkerContext(params.database);
	const path = context.admission.databasePath;
	const cached = expiryObservations.get(path);
	if (cached && !cached.dirty && cached.result && (cached.result.nextExpiryAtMs === null || Date.now() < cached.result.nextExpiryAtMs)) return 0;
	const observation = { dirty: false };
	expiryObservations.set(path, observation);
	try {
		const result = await executeOpenClawStateWorker(context, {
			type: "secrets.purge",
			input: captureSecretStoreExpiryCutoffs()
		});
		if (result.removed > 0) publishSecretStoreChange(path);
		observation.result = result;
		return result.removed;
	} catch (error) {
		observation.dirty = true;
		throw error;
	}
}
//#endregion
export { readSecretStoreExecEnvironment as a, deleteSecretStoreEntry as c, writeSecretStoreEntry as d, writeSecretStoreEntryForConfigRef as f, purgeExpiredSecretStoreEntries as i, updateSecretStoreAllowedHosts as l, getSecretStoreExpiryDeadline as n, readSecretStoreValue as o, writeSecretStoreEntryWithRollback as p, listSecretStoreEntries as r, readSelectedSecretStoreEntries as s, consumeGitHubSetupHandoff as t, writeSecretStoreEntries as u };
