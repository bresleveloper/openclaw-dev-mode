import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { i as isStateDatabaseReadAdmissionInvalidatedError } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { m as createAgentDeletionDatabaseCleanup } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { m as openClawStateDatabaseCache } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { i as createSqliteWorkerOperationAdmission, o as observeSqliteWorkerCommittedFacts } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { i as runQueuedStoreWrite } from "./store-writer-queue-AKR6NnXM.mjs";
import { n as captureOpenClawStateReadWorkerContext, r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { a as withCurrentOpenClawStateReadScope, t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import "./session-key-CSDERtm3.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import { l as getOrLoadAgentDeletionJournalStatus } from "./agent-deletion-journal.read-BzRzPvBo.mjs";
import { a as agentProvenancePublication } from "./agent-provenance-Bj5CtKpW.mjs";
import { C as withAgentDeletionJournalPublication, S as observeAgentDeletionJournal, h as readAgentDeletionJournalInDatabase, m as readAgentDeletionJournalAsync, p as readAgentDeletionJournal, x as agentDeletionJournalPublication } from "./agent-deletion-journal-DpYVtbBb.mjs";
import { r as isReservedSystemAgentId } from "./agent-id-BxGhTBRK.mjs";
import { l as prepareOpenClawAgentDatabaseRegistryRemoval } from "./openclaw-agent-db-registry-listing-DCh0nEqi.mjs";
import { h as invalidateOpenClawAgentDatabaseValidationsForAgent } from "./openclaw-agent-db-validation-cache-9WCf6XyJ.mjs";
import { _ as readAgentDatabaseAdmissionRefusal, a as captureAgentDatabasePreparationDeletionForIdentity } from "./agent-database-admission-CeDA0ojh.mjs";
import { i as runOpenClawStateWorkerOperation } from "./openclaw-state-worker-store-C1iV_8xe.mjs";
import { i as captureActiveCronJobAgentDeletion } from "./active-jobs-CqHAjCGh.mjs";
import { s as publishAgentDeletionWorkAdmission } from "./session-agent-work-admission-D63nonbM.mjs";
import { i as withOpenClawStateLeasesWorkerAdmission, n as withOpenClawStateLeaseRemoteAdmission, r as withOpenClawStateLeaseWorkerAdmission } from "./openclaw-state-lease-worker-owner-kokQJCiD.mjs";
import { n as withOpenClawStateLeaseAsync } from "./openclaw-state-lease-B69mLcu_.mjs";
import crypto from "node:crypto";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/agents/agent-deletion-errors.ts
var AgentDeletionAuthorityRollbackError = class extends AggregateError {};
var AgentDeletionCommitUncertainError = class extends Error {
	constructor(cause) {
		super(cause instanceof Error ? cause.message : String(cause), { cause });
	}
};
//#endregion
//#region src/agents/agent-deletion-journal-mutations.ts
/** The serving Cron owner mutates history; the original deletion lease retains the remote outcome. */
async function beginRemoteAgentDeletionJournal(owner, entry, operationId) {
	owner.assertCurrent();
	const previousEntry = await readAgentDeletionJournalAsync(entry.agentId, {
		path: owner.context.admission.databasePath,
		env: owner.context.environment
	});
	owner.assertCurrent();
	const journal = await withOpenClawStateLeaseRemoteAdmission(owner.lease, owner.context.admission.databasePath, (authority) => owner.transport({
		kind: "begin",
		entry,
		operationId,
		expectedJournal: previousEntry ?? null
	}, authority));
	if (!journal || journal.agentId !== entry.agentId || journal.operationId !== operationId || journal.cleanupCompleted) throw new AgentDeletionCommitUncertainError("Gateway returned a different deletion journal");
	owner.assertCurrent();
	return {
		entry: journal,
		previousEntry
	};
}
async function rollbackRemoteAgentDeletionJournal(owner, agentId, operationId) {
	owner.assertCurrent();
	const journal = await readAgentDeletionJournalAsync(agentId, {
		path: owner.context.admission.databasePath,
		env: owner.context.environment
	});
	owner.assertCurrent();
	if (!journal || journal.operationId !== operationId || journal.cleanupCompleted) throw new Error(`Agent ${agentId} deletion lost its journal before rollback.`);
	if (await withOpenClawStateLeaseRemoteAdmission(owner.lease, owner.context.admission.databasePath, (authority) => owner.transport({
		kind: "rollback",
		journal
	}, authority)) !== null) throw new AgentDeletionCommitUncertainError("Gateway rollback returned a journal");
	owner.assertCurrent();
}
/** Publish the committed path fence before observers can consume the updated journal. */
function fenceAgentDeletionJournalPaths(owner, journal, paths) {
	return owner.runWithWorker((scope, guard) => scope.execute({
		type: "agentDeletion.fencePaths",
		input: {
			guard,
			paths
		}
	}), { onCommitted: () => {
		if (paths.kind === "database") journal.databasePaths = paths.paths;
		else journal.cleanupPaths = paths.paths;
	} });
}
//#endregion
//#region src/agents/agent-deletion-claim.ts
/** Atomically claim a completed deletion tombstone for a newly created identity. */
function claimCompletedAgentDeletion(agentId, operationId, options = {}) {
	const context = captureOpenClawStateWorkerContext({
		...options,
		path: options.database?.path ?? options.path
	});
	return runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "agentDeletion.claimCompleted",
		input: {
			agentId: normalizeAgentId(agentId),
			operationId
		}
	}), {
		assertCurrent: context.admission.assertCurrent,
		createAdmission: (retained) => {
			const admission = createSqliteWorkerOperationAdmission((request, grant) => {
				if (request.stage !== "transaction" && request.stage !== "commit") throw new Error("Agent creation claim requires transaction admission");
				context.admission.assertCurrent();
				grant();
			});
			const owner = withAgentDeletionJournalPublication(() => ({
				admission,
				nativeLocations: [context.admission.databasePath]
			}), context)(retained);
			observeSqliteWorkerCommittedFacts(admission, ({ facts }) => {
				if (!isRecord(facts) || facts.kind !== "agent-deletion-claimed" || facts.agentId !== normalizeAgentId(agentId) || facts.operationId !== operationId || typeof facts.claimed !== "boolean") throw new Error("Agent creation claim lost its committed journal facts");
				if (facts.claimed) {
					try {
						(context.assertPublicationCurrent ?? context.admission.assertCurrent)();
					} catch {
						return;
					}
					sessionChanges.emit({
						all: true,
						scope: "stores"
					});
				}
			});
			return owner;
		}
	});
}
//#endregion
//#region src/agents/agent-lifecycle-binding.ts
const lifecycleStores = resolveGlobalSingleton(Symbol.for("openclaw.agentLifecycleStores"), () => {
	const stores = /* @__PURE__ */ new Map();
	agentProvenancePublication.subscribeFacts((change) => {
		for (const store of stores.values()) if (change.kind === "committed") {
			if (change.receipt.source.identity !== store.context.admission.identity.key) continue;
			for (const [agentId, fact] of change.receipt.facts) if (fact.kind !== "unchanged") store.agents.set(agentId, {
				...store.agents.get(agentId),
				provenance: fact.kind === "postimage" ? fact.value : fact.kind === "absent" ? null : void 0
			});
		} else if (change.kind === "unknown" && change.identity === store.context.admission.identity.key) for (const [agentId, facts] of store.agents) store.agents.set(agentId, {
			...facts,
			provenance: void 0
		});
	});
	agentDeletionJournalPublication.subscribeFacts((change) => {
		for (const store of stores.values()) if (change.kind === "committed") {
			if (change.receipt.source.identity !== store.context.admission.identity.key) continue;
			for (const [agentId, fact] of change.receipt.facts) if (fact.kind !== "unchanged") store.agents.set(agentId, {
				...store.agents.get(agentId),
				deletionBlocked: fact.kind === "postimage" ? true : fact.kind === "absent" ? false : void 0
			});
		} else if (change.kind === "unknown" && change.identity === store.context.admission.identity.key) for (const [agentId, facts] of store.agents) store.agents.set(agentId, {
			...facts,
			deletionBlocked: void 0
		});
	});
	return stores;
}, (stores) => stores.clear());
function knownLifecycleFacts(facts) {
	return facts?.deletionBlocked !== void 0 && facts.provenance !== void 0;
}
async function readLifecycleFactsInWorker(agentId, options) {
	const context = captureOpenClawStateReadWorkerContext({
		path: options.database?.path ?? options.path,
		env: options.env
	});
	let store = lifecycleStores.get(context.admission.databasePath);
	if (!store || store.context.admission.identity.key !== context.admission.identity.key) {
		store = {
			context,
			agents: /* @__PURE__ */ new Map()
		};
		lifecycleStores.set(context.admission.databasePath, store);
	} else store.context = context;
	const prepared = store.agents.get(agentId);
	if (knownLifecycleFacts(prepared)) return prepared;
	const pending = prepared ?? {};
	store.agents.set(agentId, pending);
	const reply = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "agentLifecycle.read",
		input: agentId
	}, {
		context,
		current: true
	});
	context.admission.assertCurrent();
	const observed = store.agents.get(agentId);
	if (observed === pending) {
		const facts = reply?.facts ?? {
			deletionBlocked: false,
			provenance: null
		};
		store.agents.set(agentId, facts);
		return facts;
	}
	return knownLifecycleFacts(observed) ? observed : {
		deletionBlocked: true,
		provenance: null
	};
}
function admitsLifecycleBinding(config, agentId, options) {
	return Boolean(resolveAgentConfig(config, agentId)) && !readAgentDatabaseAdmissionRefusal(agentId, options);
}
/** Prepare an incarnation comparison; final consumers still recheck current authority. */
async function captureAgentLifecycleBinding(getConfig, agentId, options = {}) {
	const capturedOptions = {
		path: options.database?.path ?? options.path,
		env: { ...options.env ?? process.env }
	};
	const id = normalizeAgentId(agentId);
	if (!admitsLifecycleBinding(getConfig(), id, capturedOptions)) return;
	const facts = await readLifecycleFactsInWorker(id, capturedOptions);
	if (facts.deletionBlocked || !admitsLifecycleBinding(getConfig(), id, capturedOptions)) return;
	return Object.freeze({
		agentId: id,
		provenance: structuredClone(facts.provenance)
	});
}
/** Preparatory checks may yield; the final effect guard below remains synchronous. */
async function matchesAgentLifecycleBindingAsync(getConfig, binding, options = {}) {
	const capturedBinding = structuredClone(binding);
	const capturedOptions = {
		path: options.database?.path ?? options.path,
		env: { ...options.env ?? process.env }
	};
	const id = normalizeAgentId(capturedBinding.agentId);
	if (id !== capturedBinding.agentId || !admitsLifecycleBinding(getConfig(), id, capturedOptions)) return false;
	const facts = await readLifecycleFactsInWorker(id, capturedOptions);
	return !facts.deletionBlocked && admitsLifecycleBinding(getConfig(), id, capturedOptions) && isDeepStrictEqual(facts.provenance, capturedBinding.provenance);
}
/** The final effect check consumes prepared owner facts and never queries SQLite. */
function matchesAgentLifecycleBinding(config, binding, options = {}) {
	const id = normalizeAgentId(binding.agentId);
	if (id !== binding.agentId || !admitsLifecycleBinding(config, id, options)) return false;
	const pathname = path.resolve(options.database?.path ?? options.path ?? resolveOpenClawStateSqlitePath(options.env ?? process.env));
	const store = lifecycleStores.get(pathname);
	try {
		store?.context.admission.assertCurrent();
	} catch {
		return false;
	}
	const facts = store?.agents.get(id);
	return knownLifecycleFacts(facts) && !facts.deletionBlocked && isDeepStrictEqual(facts.provenance, binding.provenance);
}
//#endregion
//#region src/agents/agent-lifecycle-registry.ts
const deletionQueues = resolveGlobalSingleton(Symbol.for("openclaw.agentDeletionQueues"), () => /* @__PURE__ */ new Map());
/** Acquire before the config lock and retain ownership through cleanup and recovery. */
function withAgentDeletion(agentId, run, options = {}) {
	const id = normalizeAgentId(agentId);
	if (isReservedSystemAgentId(id)) throw new Error(`System agent ${id} cannot be deleted; run openclaw doctor --fix to quarantine invalid deletion history.`);
	const statePath = path.resolve(options.database?.path ?? options.path ?? resolveOpenClawStateSqlitePath(options.env ?? process.env));
	const context = captureOpenClawStateWorkerContext({
		...options,
		path: statePath,
		env: { ...options.env ?? process.env }
	});
	return runQueuedStoreWrite({
		queues: deletionQueues,
		storePath: context.admission.identity.key,
		keys: [id],
		label: "agent deletion",
		fn: () => runAgentDeletionWithLease(id, run, options.journalTransport, statePath, context)
	});
}
function runAgentDeletionWithLease(id, run, journalTransport, statePath, context) {
	return withOpenClawStateLeaseAsync({
		scope: "core:agent-deletion",
		key: id,
		leaseMs: 6e4,
		waitMs: 5e3,
		heartbeat: "worker",
		leaseLabel: "agent deletion",
		operationLabel: "agent.deletion.lease"
	}, context, async (lease) => withOpenClawStateLeaseWorkerAdmission(lease, statePath, async (lifetime) => {
		const currentJournal = observeAgentDeletionJournal(id, context);
		let publishRegistryRemoval;
		let begun = false;
		let closed = false;
		let currentOperationId;
		const assertCurrentHost = () => {
			if (closed) throw new Error(`Agent ${id} deletion no longer owns database cleanup.`);
			lifetime.assertCurrent();
		};
		const execute = async (apply, publication) => {
			assertCurrentHost();
			const invoke = (admission, identities) => {
				const identity = identities[0];
				if (!identity) throw new Error("Agent deletion requires a retained lease");
				return runOpenClawStateWorkerOperation(context, (scope) => apply(scope, identity, identities.slice(1)), {
					assertCurrent: admission.assertCurrent,
					createAdmission: (retained) => {
						const created = withAgentDeletionJournalPublication(admission.createAdmission, context)(retained);
						if (publication?.onAdmission) created.admission.observeRequests((request) => publication.onAdmission?.(request, context.admission.identity.key));
						const onCommitted = (facts) => {
							if (!isRecord(facts) || facts.kind !== "agent-deletion-mutated" && facts.kind !== "agent-deletion-began") {
								publication?.onCommitted?.(facts);
								return;
							}
							if (facts.agentId !== id || facts.operationId !== currentOperationId) throw new Error("Agent deletion commit receipt does not match its owner");
							publication?.onCommitted?.(facts);
							try {
								(context.assertPublicationCurrent ?? context.admission.assertCurrent)();
							} catch (error) {
								if (isStateDatabaseReadAdmissionInvalidatedError(error)) return;
								throw error;
							}
							if (facts.unregisterDatabases === true) invalidateOpenClawAgentDatabaseValidationsForAgent(id, []);
							publishRegistryRemoval();
						};
						observeSqliteWorkerCommittedFacts(created.admission, ({ facts }) => onCommitted(facts));
						return created;
					}
				});
			};
			const authority = { assertCurrent: () => {
				assertCurrentHost();
				publication?.assertCurrent?.();
			} };
			return publication?.additionalLeases?.length ? withOpenClawStateLeasesWorkerAdmission([lease, ...publication.additionalLeases], context, (admission) => invoke(admission, admission.identities), authority) : withOpenClawStateLeaseWorkerAdmission(lease, statePath, (admission) => invoke(admission, [admission.identity]), authority);
		};
		try {
			return await run(async (entry, beginOptions = {}) => {
				assertCurrentHost();
				if (begun || normalizeAgentId(entry.agentId) !== id) throw new Error(`Agent ${id} deletion already began or has a different target.`);
				begun = true;
				const capturedEntry = structuredClone(entry);
				publishRegistryRemoval = await prepareOpenClawAgentDatabaseRegistryRemoval(id, {
					path: statePath,
					env: context.environment
				});
				assertCurrentHost();
				const preserveDeleteFiles = beginOptions.preserveDeleteFiles;
				const operationId = crypto.randomUUID();
				currentOperationId = operationId;
				const publishIngress = (pending) => {
					(context.assertPublicationCurrent ?? context.admission.assertCurrent)();
					publishAgentDeletionWorkAdmission({
						agentId: id,
						statePath,
						env: context.environment
					}, operationId, pending);
				};
				const completeOperation = () => {
					closed = true;
					publishIngress(false);
				};
				const predicate = {
					agentId: id,
					operationId,
					expectedClawInstall: structuredClone(beginOptions.expectedClawInstall)
				};
				const cancelCronRuns = captureActiveCronJobAgentDeletion(id, context.admission.identity.key);
				const invalidatePreparation = captureAgentDatabasePreparationDeletionForIdentity(id, {
					databasePath: statePath,
					identityKey: context.admission.identity.key
				});
				const remoteOwner = journalTransport ? {
					lease,
					context,
					transport: journalTransport,
					assertCurrent: assertCurrentHost
				} : void 0;
				const { entry: journal, previousEntry } = remoteOwner ? await beginRemoteAgentDeletionJournal(remoteOwner, {
					...capturedEntry,
					agentId: id
				}, operationId) : await execute((scope, identity) => scope.execute({
					type: "agentDeletion.begin",
					input: {
						entry: {
							...capturedEntry,
							agentId: id,
							operationId,
							deleteFiles: capturedEntry.deleteFiles !== false
						},
						lease: identity,
						expectedClawInstall: predicate.expectedClawInstall,
						preserveDeleteFiles,
						recoveryOperationId: beginOptions.recoveryOperationId
					}
				}), { onCommitted: () => {
					publishIngress(true);
					invalidatePreparation();
					cancelCronRuns();
				} });
				currentJournal.seed(journal);
				if (remoteOwner) {
					publishIngress(true);
					invalidatePreparation();
					cancelCronRuns();
					publishRegistryRemoval();
				}
				assertCurrentHost();
				const authority = {
					assertCurrentHost,
					withStateLease: (leaseOptions, apply) => withOpenClawStateLeaseAsync(leaseOptions, context, (additionalLease) => withOpenClawStateLeaseWorkerAdmission(additionalLease, statePath, (admission) => {
						const assertLeaseCurrentHost = () => {
							assertCurrentHost();
							admission.assertCurrent();
						};
						return apply(additionalLease, assertLeaseCurrentHost, assertLeaseCurrentHost);
					}, { assertCurrent: assertCurrentHost })),
					runWithLeaseAdmission: (operation) => withOpenClawStateLeaseWorkerAdmission(lease, statePath, (scope) => operation(scope, {
						lease: scope.identity,
						predicate
					}), { assertCurrent: assertCurrentHost }),
					runWithWorker: (operation, publication) => execute((scope, identity, additionalIdentities) => operation(scope, {
						lease: identity,
						predicate
					}, additionalIdentities), publication)
				};
				const assertCurrentAsync = async () => {
					await authority.runWithWorker((scope, guard) => scope.execute({
						type: "agentDeletion.assertCurrent",
						input: { guard }
					}));
					assertCurrentHost();
				};
				const assertCurrentFinal = () => {
					assertCurrentHost();
					currentJournal.assertCurrent(operationId);
				};
				return {
					...authority,
					entry: journal,
					previousEntry,
					assertCurrentAsync,
					assertCurrentFinal,
					retire: () => authority.runWithWorker((scope, guard) => scope.execute({
						type: "agentDeletion.retire",
						input: { guard }
					}), { onCommitted: () => {
						journal.phase = "retiring";
					} }),
					runDatabaseCleanup: createAgentDeletionDatabaseCleanup({
						agentId: id,
						statePath,
						workerAuthority: authority,
						assertCurrent: assertCurrentFinal,
						assertCurrentAsync,
						assertAdmission: () => authority.runWithWorker((scope, guard) => scope.execute({
							type: "agentDeletion.assertNoDatabaseLeases",
							input: { guard }
						})),
						assertJournal: (currentStatePath, entries) => {
							assertCurrentHost();
							if (path.resolve(currentStatePath) !== statePath || !entries.some((current) => current.agentId === id && current.operationId === operationId && !current.cleanupCompleted)) throw new Error(`Agent ${id} deletion no longer owns database cleanup.`);
							return id;
						},
						withCommit: (commit) => {
							assertCurrentFinal();
							commit();
						}
					}),
					fenceDatabasePaths: (paths) => fenceAgentDeletionJournalPaths(authority, journal, {
						kind: "database",
						paths: [...new Set(paths.map((pathname) => path.resolve(pathname)))]
					}),
					fenceCleanupPaths: (paths) => fenceAgentDeletionJournalPaths(authority, journal, {
						kind: "cleanup",
						paths: structuredClone([...paths])
					}),
					finish: (finishOptions) => authority.runWithWorker((scope, guard) => scope.execute({
						type: "agentDeletion.finish",
						input: {
							guard,
							...finishOptions
						}
					}), { onCommitted: completeOperation }),
					releaseClawRows: async (input) => {
						const completed = await authority.runWithWorker((scope, guard) => scope.execute({
							type: "agentDeletion.releaseClawRows",
							input: {
								guard,
								...input
							}
						}), { onCommitted: () => {
							if (input.complete) completeOperation();
						} });
						if (completed) closed = true;
						return completed;
					},
					handoffClawRetry: async () => {
						if (closed || !predicate.expectedClawInstall) return;
						if (await authority.runWithWorker((scope, guard) => scope.execute({
							type: "agentDeletion.handoffClawRetry",
							input: {
								guard,
								retryOperationId: crypto.randomUUID(),
								nowMs: Date.now()
							}
						}), { onCommitted: () => {
							closed = true;
						} })) closed = true;
					},
					rollback: async () => {
						if (remoteOwner) {
							await rollbackRemoteAgentDeletionJournal(remoteOwner, id, operationId);
							completeOperation();
							publishRegistryRemoval();
							return;
						}
						await execute((scope, identity) => scope.execute({
							type: "agentDeletion.rollback",
							input: { guard: {
								lease: identity,
								predicate
							} }
						}), { onCommitted: completeOperation });
					}
				};
			});
		} finally {
			closed = true;
			currentJournal.release();
		}
	}));
}
/** Return whether this process must refuse new authority for an agent id. */
function isAgentDeletionBlocked(agentId, options = {}, database) {
	if (database) return Boolean(readAgentDeletionJournalInDatabase({ db: database }, agentId, "runtime"));
	return withCurrentOpenClawStateReadScope(options, (statePath) => {
		if (openClawStateDatabaseCache.getCachedOpenClawStateDatabase(statePath, { readOnly: true })?.db.isTransaction) return Boolean(readAgentDeletionJournal(agentId, options, "runtime"));
		return getOrLoadAgentDeletionJournalStatus(statePath, agentId, () => {
			const journal = readAgentDeletionJournal(agentId, options, "runtime");
			return journal ? journal.cleanupCompleted ? "complete" : "pending" : "absent";
		}) !== "absent";
	});
}
/** Keep persisted identity stable until the winning deletion completes or rolls back. */
function assertAgentDeletionAllowsMutation(database, agentId) {
	const id = normalizeAgentId(agentId);
	const journal = readAgentDeletionJournalInDatabase(database, id);
	if (journal && !journal.cleanupCompleted) throw new Error(`Agent ${id} has pending deletion; retry after removal completes.`);
}
//#endregion
export { matchesAgentLifecycleBinding as a, AgentDeletionAuthorityRollbackError as c, captureAgentLifecycleBinding as i, AgentDeletionCommitUncertainError as l, isAgentDeletionBlocked as n, matchesAgentLifecycleBindingAsync as o, withAgentDeletion as r, claimCompletedAgentDeletion as s, assertAgentDeletionAllowsMutation as t };
