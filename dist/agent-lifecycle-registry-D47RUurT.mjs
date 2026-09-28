import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
import { t as withOpenClawStateLease } from "./openclaw-state-lease-B2mQXTqH.mjs";
import { d as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-BFwcs62N.mjs";
import { S as createAgentDeletionDatabaseCleanup, c as removeAgentDeletionJournal, f as readAgentProvenance, i as completeAgentDeletionJournalInDatabase, l as updateAgentDeletionJournalCleanupPaths, n as beginAgentDeletionJournal, o as readAgentDeletionJournal, r as claimCompletedAgentDeletionJournal, s as readAgentDeletionJournalInDatabase, u as updateAgentDeletionJournalDatabasePaths } from "./agent-deletion-journal-CZw0kGMX.mjs";
import { a as assertNoOpenClawAgentDatabaseLeases } from "./openclaw-agent-db-lease-DexIwF6s.mjs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
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
					return beginAgentDeletionJournal({
						...entry,
						agentId: id,
						operationId,
						deleteFiles: entry.deleteFiles !== false
					}, stateOptions);
				}, stateOptions);
				const assertJournal = (currentStatePath, entries, database) => {
					if (closed || path.resolve(currentStatePath) !== statePath || !entries.some((current) => current.agentId === id && current.operationId === operationId && !current.cleanupCompleted)) throw new Error(`Agent ${id} deletion no longer owns database cleanup.`);
					if (database) lease.assertOwnedInTransaction(database.db);
					else lease.assertOwned();
					return id;
				};
				const assertCurrent = (database) => {
					const current = closed ? void 0 : database ? readAgentDeletionJournalInDatabase(database, id) : readAgentDeletionJournal(id, stateOptions);
					assertJournal(database?.path ?? statePath, current ? [current] : [], database);
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
function isAgentDeletionBlocked(agentId, options = {}) {
	return Boolean(readAgentDeletionJournal(normalizeAgentId(agentId), options));
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
export { isAgentDeletionBlocked as a, claimCompletedAgentDeletion as i, AgentDeletionCommitUncertainError as n, matchesAgentLifecycleBinding as o, captureAgentLifecycleBinding as r, withAgentDeletion as s, AgentDeletionAuthorityRollbackError as t };
