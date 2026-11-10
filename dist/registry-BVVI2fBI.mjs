import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { d as sqliteStringSet, i as executeSqliteQuerySync, o as getNodeSqliteKysely } from "./kysely-sync-9fPQaMlh.mjs";
import { a as tableExists, o as tableHasColumn } from "./openclaw-state-db-schema-helpers-C7eId980.mjs";
import { i as WorktreeRemovalContentionError } from "./errors-WYf-uyBk.mjs";
import { u as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-DhDutMia.mjs";
import { s as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly, u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { n as withStateDatabaseSchemaMaintenance } from "./state-database-maintenance-DQhfapFw.mjs";
import { i as openOpenClawStateDatabase, u as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BtDOU_3j.mjs";
import { i as worktreeRegistryPublication } from "./registry-publication-BJype9QG.mjs";
import { i as captureWorktreeRunEndContext, r as captureWorktreeRegistryMutation } from "./run-end-lifecycle-DPl2TsZ4.mjs";
import { a as runWorktreeRunEndCommand } from "./registry-run-end-C_3vIy6v.mjs";
import "./registry-read-Do2Ks9un.mjs";
import { l as rowToRecord } from "./registry-read.kernel-D89C5gDY.mjs";
import { _ as worktreeRunLeaseScope, h as collectLiveRunLeases } from "./registry-run-end.worker-DYWsmg23.mjs";
import { n as releaseWorktreeRunLeaseInDatabase } from "./run-lease-store.kernel-VlY5KQA0.mjs";
import { randomUUID } from "node:crypto";
//#region src/agents/worktrees/provisioned-snapshot-store.ts
/** One captured database generation owns every chunk and cleanup in a snapshot. */
function createProvisionedSnapshotWriter(env, worktreeId, authority = {}) {
	const context = captureWorktreeRunEndContext(env);
	const predicates = structuredClone(authority.predicates);
	const leaseSet = authority.leaseSet;
	const assertCurrent = authority.assertCurrent;
	let uncertain;
	return async (effect, signal = authority.signal) => {
		if (uncertain) throw uncertain.error;
		try {
			await runWorktreeRunEndCommand(context, {
				type: "worktrees.writeProvisionedSnapshot",
				input: {
					value: effect.type === "worktree.snapshot-provisioned-reset" ? {
						worktreeId,
						kind: "reset"
					} : {
						worktreeId,
						kind: "chunk",
						...effect.input
					},
					receipt: randomUUID()
				}
			}, {
				leaseSet,
				predicates,
				signal,
				assertCurrent: () => {
					assertCurrent?.();
					signal?.throwIfAborted();
				}
			});
		} catch (error) {
			if (hasSqliteWorkerOutcomeUnknown(error)) uncertain = { error };
			throw error;
		}
	};
}
async function clearRegistryWorktreeProvisionedChunks(env, worktreeId, authority) {
	await createProvisionedSnapshotWriter(env, worktreeId, authority)({
		type: "worktree.snapshot-provisioned-reset",
		input: {}
	});
}
//#endregion
//#region src/agents/worktrees/registry.ts
function dbFor(env) {
	return openOpenClawStateDatabase({ env }).db;
}
function kyselyFor(db) {
	return getNodeSqliteKysely(db);
}
function listRegistryWorktreesForMigration(env, behavior = {}) {
	return readRegistry(env, behavior, (db) => {
		const query = kyselyFor(db).selectFrom("worktrees").selectAll().orderBy("created_at", "desc").orderBy("id", "asc");
		return executeSqliteQuerySync(db, query).rows.map(rowToRecord);
	}) ?? [];
}
function listLegacyRegistryWorktreesForMigration(env, behavior = {}) {
	return readRegistry(env, behavior, (db) => {
		let query = kyselyFor(db).selectFrom("worktrees").selectAll().orderBy("id", "asc");
		if (tableHasColumn(db, "worktrees", "provisioned_paths_json")) query = query.where("provisioned_paths_json", "is", null);
		return executeSqliteQuerySync(db, query).rows.map(rowToRecord);
	}) ?? [];
}
function readRegistry(env, behavior, read) {
	const operation = ({ db }) => tableExists(db, "worktrees") ? read(db) : void 0;
	return behavior.artifactPreservingReadOnly ? withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(operation, { env }) : withExistingOpenClawStateDatabaseReadOnly(operation, { env });
}
function runRegistryMigration(write, { env }) {
	return withStateDatabaseSchemaMaintenance({ databasePath: resolveOpenClawStateSqlitePath(env) }, () => runOpenClawStateWriteTransaction(({ db }) => write(db), { env }));
}
function discardLegacyRegistryWorktrees(env, worktreeIds) {
	if (worktreeIds.length === 0) return 0;
	return runRegistryMigration((db) => {
		const removed = executeSqliteQuerySync(db, kyselyFor(db).deleteFrom("worktrees").where("provisioned_paths_json", "is", null).where("id", "in", [...worktreeIds]).returningAll()).rows;
		worktreeRegistryPublication.deleted(db, removed);
		return removed.length;
	}, { env });
}
function rewriteRegistryWorktreePathsForMigration(env, rewrites) {
	if (rewrites.length === 0) return 0;
	return runRegistryMigration((db) => rewrites.reduce((count, rewrite) => {
		const changed = executeSqliteQuerySync(db, kyselyFor(db).updateTable("worktrees").set({ path: rewrite.toPath }).where("id", "=", rewrite.id).where("path", "=", rewrite.fromPath).returningAll()).rows;
		worktreeRegistryPublication.rows(db, changed);
		return count + changed.length;
	}, 0), { env });
}
function insertRegistryWorktree(env, record, options = {}) {
	return runWorktreeRunEndCommand(captureWorktreeRunEndContext(env), {
		type: "worktrees.insert",
		input: {
			value: {
				record,
				provisionedPaths: options.provisionedPaths,
				pendingId: options.pendingId
			},
			receipt: randomUUID()
		}
	}, options.workerAuthority);
}
function updateRegistryWorktree(env, id, patch, options = {}) {
	const { assertCurrent, workerAuthority, ...conditions } = options;
	return runWorktreeRunEndCommand(captureWorktreeRunEndContext(env), {
		type: "worktrees.update",
		input: {
			value: {
				id,
				patch,
				...conditions
			},
			receipt: randomUUID()
		}
	}, workerAuthority ?? { assertCurrent });
}
function deleteRegistryWorktree(env, id, options = {}) {
	return runWorktreeRunEndCommand(captureWorktreeRunEndContext(env), {
		type: "worktrees.delete",
		input: {
			value: {
				id,
				removalToken: options.removalToken,
				expectedRetired: options.expectedRetired
			},
			receipt: randomUUID()
		}
	}, options.workerAuthority ?? { assertCurrent: options.assertCurrent });
}
/** Batch lock-primitive read: one JSON binding avoids per-claim SQL and SQLite bind limits. */
function createWorktreeRemovalClaimsGuard(env, worktreeIds, token) {
	const ids = [...new Set(worktreeIds)];
	const count = ids.length;
	const scopes = sqliteStringSet(ids.map(worktreeRunLeaseScope));
	return () => {
		if (count === 0) return;
		const db = dbFor(env);
		if (executeSqliteQuerySync(db, kyselyFor(db).selectFrom("state_leases").select((eb) => eb.fn.countAll().as("held")).where("state_leases.scope", "in", scopes).where("state_leases.lease_key", "=", "__removing__").where("state_leases.owner", "=", token)).rows[0]?.held !== count) throw new WorktreeRemovalContentionError("busy", "Worktree removal claim changed; checkout preserved");
	};
}
function releaseWorktreeRunLeaseRow(env, worktreeId, token) {
	const mutation = captureWorktreeRegistryMutation(captureWorktreeRunEndContext(env), [{
		id: worktreeId,
		fields: ["leases"]
	}], { settlement: true });
	mutation.observeTransaction();
	try {
		runOpenClawStateWriteTransaction(({ db }) => releaseWorktreeRunLeaseInDatabase(db, worktreeId, token), { env }, { operationLabel: "worktrees.releaseRunLease" });
	} finally {
		mutation.settle(false);
	}
}
/** Check removal custody before a session mutation waits for checkout allocation. */
function assertWorktreeRemovalAvailable(env, worktreeId, ownToken) {
	const db = dbFor(env);
	const token = collectLiveRunLeases(db, kyselyFor(db), worktreeRunLeaseScope(worktreeId), false).removingToken;
	if (token !== void 0 && token !== ownToken) throw new WorktreeRemovalContentionError("busy", "Worktree removal is in progress; retry after cleanup settles");
}
//#endregion
export { insertRegistryWorktree as a, releaseWorktreeRunLeaseRow as c, clearRegistryWorktreeProvisionedChunks as d, createProvisionedSnapshotWriter as f, discardLegacyRegistryWorktrees as i, rewriteRegistryWorktreePathsForMigration as l, createWorktreeRemovalClaimsGuard as n, listLegacyRegistryWorktreesForMigration as o, deleteRegistryWorktree as r, listRegistryWorktreesForMigration as s, assertWorktreeRemovalAvailable as t, updateRegistryWorktree as u };
