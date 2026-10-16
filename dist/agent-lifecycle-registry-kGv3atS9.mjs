import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { i as stageSqliteTransactionState } from "./sqlite-post-commit-CQ_AyDCk.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { y as requireOpenClawStateDatabaseIdentity } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { n as captureOpenClawStateReadWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { l as runOpenClawStateWriteTransaction } from "./openclaw-state-db-D1jWDzK3.mjs";
import { a as handoffAgentDeletionJournalInDatabase, c as readAgentDeletionJournal, d as updateAgentDeletionJournalCleanupPaths, f as updateAgentDeletionJournalDatabasePaths, i as completeAgentDeletionJournalInDatabase, l as readAgentDeletionJournalInDatabase, n as beginAgentDeletionJournal, r as claimCompletedAgentDeletionJournal, u as removeAgentDeletionJournal, y as createAgentDeletionDatabaseCleanup } from "./agent-deletion-journal-CDljXcnp.mjs";
import { g as readAgentDatabaseAdmissionRefusal, x as isReservedSystemAgentId } from "./agent-database-admission-dWNS6Rcs.mjs";
import { i as readAgentDeletionJournalAuthorityInWorker } from "./agent-deletion-journal.read-Bkjt0nDs.mjs";
import { r as readAgentProvenance } from "./agent-provenance-H6O0H8k6.mjs";
import { a as assertNoOpenClawAgentDatabaseLeases } from "./openclaw-agent-db-lease-D8zYIRzn.mjs";
import { t as withOpenClawStateLease } from "./openclaw-state-lease-CdKflcqg.mjs";
import { i as captureActiveCronJobAgentDeletion } from "./active-jobs-BS2UT6i2.mjs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import crypto from "node:crypto";
//#region src/agents/agent-lifecycle-registry.ts
var AgentDeletionAuthorityRollbackError = class extends AggregateError {};
var AgentDeletionCommitUncertainError = class extends Error {
	constructor(cause) {
		super(cause instanceof Error ? cause.message : String(cause), { cause });
	}
};
const log = createSubsystemLogger("agents/lifecycle");
/** Acquire before the config lock and retain ownership through cleanup and recovery. */
function withAgentDeletion(agentId, run, options = {}) {
	const id = normalizeAgentId(agentId);
	if (isReservedSystemAgentId(id)) throw new Error(`System agent ${id} cannot be deleted; run openclaw doctor --fix to quarantine invalid deletion history.`);
	const statePath = path.resolve(options.path ?? resolveOpenClawStateSqlitePath(options.env ?? process.env));
	const stateOptions = {
		...options,
		path: statePath,
		env: { ...options.env ?? process.env }
	};
	return withOpenClawStateLease({
		scope: "core:agent-deletion",
		key: id,
		database: {
			scope: "shared",
			options: stateOptions
		},
		leaseMs: 6e4,
		waitMs: 5e3,
		heartbeat: "worker",
		leaseLabel: "agent deletion",
		operationLabel: "agent.deletion.lease"
	}, async (lease) => {
		let begun = false;
		let closed = false;
		try {
			return await run((entry) => {
				if (closed || begun || normalizeAgentId(entry.agentId) !== id) throw new Error(`Agent ${id} deletion already began or has a different target.`);
				begun = true;
				const operationId = crypto.randomUUID();
				const journal = runOpenClawStateWriteTransaction((database) => {
					lease.assertOwnedInTransaction(database.db);
					const cancelCronRuns = captureActiveCronJobAgentDeletion(id, requireOpenClawStateDatabaseIdentity(database).key);
					const entryJournal = beginAgentDeletionJournal({
						...entry,
						agentId: id,
						operationId,
						deleteFiles: entry.deleteFiles !== false
					}, stateOptions);
					if (!stageSqliteTransactionState(database.db, {
						stage() {},
						rollback() {},
						commit: cancelCronRuns
					})) throw new Error("Agent deletion requires a managed transaction");
					return entryJournal;
				}, stateOptions);
				const readContext = captureOpenClawStateReadWorkerContext(stateOptions);
				const assertJournalIdentity = (currentStatePath, entries) => {
					if (closed || path.resolve(currentStatePath) !== statePath || !entries.some((current) => current.agentId === id && current.operationId === operationId && !current.cleanupCompleted)) throw new Error(`Agent ${id} deletion no longer owns database cleanup.`);
					return id;
				};
				const assertJournal = (currentStatePath, entries, database) => {
					assertJournalIdentity(currentStatePath, entries);
					if (database) lease.assertOwnedInTransaction(database.db);
					else lease.assertOwned();
					return id;
				};
				const assertCurrent = (database) => {
					const current = closed ? void 0 : database ? readAgentDeletionJournalInDatabase(database, id) : readAgentDeletionJournal(id, stateOptions);
					assertJournal(database?.path ?? statePath, current ? [current] : [], database);
				};
				const assertAsyncScopeCurrent = () => {
					if (closed) throw new Error(`Agent ${id} deletion no longer owns database cleanup.`);
					lease.signal.throwIfAborted();
					readContext.maintenanceScope?.assertAdmission();
					readContext.admission.assertCurrent();
				};
				const assertCurrentAsync = async () => {
					assertAsyncScopeCurrent();
					const verifyLease = lease.assertOwnedAsync;
					if (!verifyLease) throw new Error("Agent deletion requires asynchronous worker-heartbeat verification.");
					const current = await readAgentDeletionJournalAuthorityInWorker(id, readContext, lease.signal);
					assertAsyncScopeCurrent();
					assertJournalIdentity(readContext.admission.databasePath, current ? [current] : []);
					await verifyLease();
					assertAsyncScopeCurrent();
				};
				const mutateJournal = (mutate) => runOpenClawStateWriteTransaction((database) => {
					assertCurrent(database);
					return mutate();
				}, stateOptions);
				const completeInTransaction = (database) => {
					assertCurrent(database);
					if (!completeAgentDeletionJournalInDatabase(database, id, operationId)) throw new Error(`Failed to complete deletion journal for agent ${id}.`);
					closed = true;
				};
				return {
					entry: journal,
					assertCurrent,
					assertCurrentAsync,
					handoffToRetry: (database) => {
						assertCurrent(database);
						if (!handoffAgentDeletionJournalInDatabase(database, id, operationId, crypto.randomUUID())) throw new Error(`Failed to hand off deletion journal for agent ${id}.`);
					},
					runDatabaseCleanup: createAgentDeletionDatabaseCleanup({
						statePath,
						assertAdmission: () => assertNoOpenClawAgentDatabaseLeases(id, stateOptions),
						assertCurrent,
						assertJournal,
						withCommit: (commit) => {
							let committed = false;
							try {
								mutateJournal(() => {
									commit();
									committed = true;
								});
							} catch (error) {
								if (!committed) throw error;
								try {
									log.warn("Agent deletion committed, but releasing its state guard failed", {
										agentId: id,
										error
									});
								} catch {}
							}
						}
					}),
					fenceDatabasePaths: (paths) => mutateJournal(() => {
						if (!updateAgentDeletionJournalDatabasePaths(id, operationId, paths, stateOptions)) throw new Error(`Failed to fence database cleanup paths for agent ${id}.`);
						journal.databasePaths = [...new Set(paths.map((entryPath) => path.resolve(entryPath)))];
					}),
					fenceCleanupPaths: (paths) => mutateJournal(() => {
						if (!updateAgentDeletionJournalCleanupPaths(id, operationId, paths, stateOptions)) throw new Error(`Failed to fence cleanup paths for agent ${id}.`);
						journal.cleanupPaths = [...paths];
					}),
					completeInTransaction,
					finish: () => runOpenClawStateWriteTransaction(completeInTransaction, stateOptions),
					rollback: () => mutateJournal(() => {
						if (!removeAgentDeletionJournal(id, operationId, stateOptions)) throw new Error(`Failed to roll back deletion journal for agent ${id}.`);
						closed = true;
					})
				};
			});
		} finally {
			closed = true;
		}
	});
}
/** Atomically claim a completed deletion tombstone for a newly created identity. */
function claimCompletedAgentDeletion(agentId, operationId, options = {}) {
	return claimCompletedAgentDeletionJournal(normalizeAgentId(agentId), operationId, options);
}
/** Return whether this process must refuse new authority for an agent id. */
function isAgentDeletionBlocked(agentId, options = {}, database) {
	return Boolean(database ? readAgentDeletionJournalInDatabase({ db: database }, agentId, "runtime") : readAgentDeletionJournal(agentId, options, "runtime"));
}
/** Keep persisted identity stable until the winning deletion completes or rolls back. */
function assertAgentDeletionAllowsMutation(database, agentId, deletion) {
	const id = normalizeAgentId(agentId);
	const journal = readAgentDeletionJournalInDatabase(database, id);
	if (deletion) {
		if (deletion.entry.agentId !== id || !journal || journal.operationId !== deletion.entry.operationId || journal.cleanupCompleted) throw new Error(`Agent ${id} mutation does not belong to the current deletion.`);
		deletion.assertCurrent(database);
		return;
	}
	if (journal && !journal.cleanupCompleted) throw new Error(`Agent ${id} has pending deletion; retry after removal completes.`);
}
/** Captures the exact durable incarnation of an existing, deletion-safe agent. */
function captureAgentLifecycleBinding(config, agentId, options = {}) {
	const id = normalizeAgentId(agentId);
	if (!resolveAgentConfig(config, id) || readAgentDatabaseAdmissionRefusal(id, options) || isAgentDeletionBlocked(id, options)) return;
	return Object.freeze({
		agentId: id,
		provenance: readAgentProvenance(id, options) ?? null
	});
}
/** Revalidates an agent binding against both the roster and lifecycle owner. */
function matchesAgentLifecycleBinding(config, binding, options = {}) {
	const id = normalizeAgentId(binding.agentId);
	return id === binding.agentId && Boolean(resolveAgentConfig(config, id)) && !readAgentDatabaseAdmissionRefusal(id, options) && !isAgentDeletionBlocked(id, options) && isDeepStrictEqual(readAgentProvenance(id, options) ?? null, binding.provenance);
}
//#endregion
export { claimCompletedAgentDeletion as a, withAgentDeletion as c, captureAgentLifecycleBinding as i, AgentDeletionCommitUncertainError as n, isAgentDeletionBlocked as o, assertAgentDeletionAllowsMutation as r, matchesAgentLifecycleBinding as s, AgentDeletionAuthorityRollbackError as t };
