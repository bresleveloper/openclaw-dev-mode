import { y as uniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { o as sqliteReaderDatabasePathKey } from "./sqlite-reader-lifecycle-CYQdd96B.mjs";
import { u as readDatabasePathIdentitySync } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { r as getChildLogger } from "./logger-Mnn26Jj7.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-DuOygjcn.mjs";
import { h as onSqliteWalCheckpoint } from "./sqlite-wal-DUSYRhyv.mjs";
import { _ as isOpenClawAgentDatabasePathCurrent, n as captureOpenClawAgentDatabaseValidationTransfer, v as readOpenClawAgentDatabaseIdentity } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { c as resolveOpenClawAgentSqlitePath, i as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { r as runQueuedStoreWrite } from "./store-writer-queue-Cq6rziq_.mjs";
import { c as deferOpenClawAgentPostCommitPublication } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { a as getOpenClawAgentDatabaseIfOpen, s as openOpenClawAgentDatabase } from "./openclaw-agent-db-DBug3LUA.mjs";
import { n as emitSessionTranscriptUpdate } from "./transcript-events-DUHAZLVw.mjs";
import { n as supportsOpenClawAgentDatabaseExecution, t as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-CaPKglUL.mjs";
import { n as withOpenClawAgentDatabaseReadOnly, t as retainOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { d as resolveSqliteTranscriptScope, h as withSqliteSessionDatabase, l as resolveSqliteTranscriptArchiveDirectory, p as runExclusiveSqliteSessionWrite, s as resolveSqliteScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { l as maintenanceLane, s as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-CTwaPfeT.mjs";
import { p as publishSessionEntryWorkerInvalidations } from "./session-accessor.sqlite-entry-cache-nS4OEr3G.mjs";
import { s as normalizeResolvedMaintenanceConfigInput } from "./store-maintenance-CGOlSbiV.mjs";
import { t as ownedWorkerBytes } from "./worker-transfer-bytes-D_DP0IHa.mjs";
import { D as withSqliteSessionDeletions, S as hasPreparedNativeSessionDeletion, b as captureNativeSessionWorkerDeletion } from "./session-accessor.sqlite-entry-store-Ca60AZ39.mjs";
import { g as runExclusiveSessionLifecycleMutation, o as collectActiveSessionWorkAdmissions } from "./session-lifecycle-admission-GoxISURZ.mjs";
import { i as isRecentHistoricalSessionId, r as collectSessionStateIdsForEntry } from "./session-accessor.sqlite-references-DaTkiOgv.mjs";
import { c as runSqliteTranscriptArchiveWorkerOperation, d as withSqliteMutationWorkerLifetime, f as withSqliteTranscriptArchiveSession, n as materializeSessionStateDeletePlans, o as runSqliteTranscriptArchivePublishWorker, r as readPendingSqliteTranscriptArchivesInWorker } from "./session-accessor.sqlite-archive-B_Nn5x_K.mjs";
import { a as withSqliteReclamationAuthorization } from "./session-accessor.sqlite-reclamation-commit-CC945S9j.mjs";
import { c as uniqueTranscriptArchives, s as transcriptArchiveIdentityKey } from "./session-accessor.sqlite-archive-store-kernel-GFHc9mfV.mjs";
import { a as createSessionMaintenanceFinalizationOperation, d as resolveSessionReclamationDatabaseOptions, f as runExclusiveSqliteSessionReclamation, h as prepareSessionDeletionInDatabase, n as createHistoryEvictionReclamationPlan, s as createSessionMaintenanceStatisticsOperation, u as reclaimSqliteSessionInTransaction } from "./session-accessor.sqlite-reclamation-CiWnC9OH.mjs";
import { c as planSessionStateDeleteIfUnreferenced } from "./session-accessor.sqlite-lifecycle-state-BBji5bes.mjs";
import { n as readDiskEvictableArchivedSessionBatchInDatabase, r as readHistoricalSessionIdsInDatabase, t as collectSessionAdmissionReferences } from "./session-history-eviction-candidates-BDyikVxl.mjs";
import { i as readSessionTranscriptJsonlBytesInDatabase, n as emptySessionEntryMaintenancePlan, t as applySessionEntryMaintenanceInDatabase } from "./session-accessor.sqlite-maintenance-store-B6AUFdD6.mjs";
import { i as withSqliteSessionPageReclamation, n as pruneAllSessionTranscriptArchivesToHighWater, r as reclaimSqliteFreePages, t as hasCanonicalSessionTranscriptArchives } from "./session-history-archive-pruning-BiyaLkTQ.mjs";
import { t as assertSessionSubagentRunsCurrent } from "./session-accessor.sqlite-descendant-basis-7u7iMDiO.mjs";
import { n as prepareReclamationPublication, t as collectReclamationChangedSessionKeys } from "./session-accessor.sqlite-reclamation-publication-C6o22lQK.mjs";
import { n as withSqliteReclamationWorker } from "./session-accessor.sqlite-reclamation-worker-C2YCwGPg.mjs";
import { a as withSessionEntryWorker } from "./session-accessor.sqlite-replacement-worker-9fiwLkM3.mjs";
import { n as resolveMaintenanceConfig, r as captureSessionMaintenancePreservation } from "./store-maintenance-runtime-CBCUEU3e.mjs";
import { c as measureSessionPhysicalDiskUsage, n as hasRetainedSessionTranscriptArchives } from "./disk-budget-7sFA2NUn.mjs";
import fs from "node:fs";
import path from "node:path";
import { isMainThread } from "node:worker_threads";
//#region src/config/sessions/session-accessor.sqlite-events.ts
function emitArchivedTranscriptUpdates(archivedTranscripts) {
	for (const archived of archivedTranscripts) emitSessionTranscriptUpdate({ sessionFile: archived.archivedPath });
}
async function publishTranscriptUpdate(scope, update = {}) {
	const resolved = resolveSqliteTranscriptScope(scope);
	emitSessionTranscriptUpdate({
		...update,
		agentId: resolved.agentId,
		sessionKey: resolved.sessionKey,
		sessionId: resolved.sessionId,
		target: {
			agentId: resolved.agentId,
			sessionId: resolved.sessionId,
			sessionKey: resolved.sessionKey,
			storePath: resolved.path
		}
	});
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-reclamation-run.ts
async function runSessionDeletionPlanning(resolved, params, planning, assertCurrent, diagnostics) {
	const databaseOptions = toDatabaseOptions(resolved);
	if (params.expectedDatabaseIdentity !== void 0 || !isMainThread || !supportsOpenClawAgentDatabaseExecution(databaseOptions)) return await runExclusiveSqliteSessionWrite(resolved, async () => withSqliteSessionDatabase(databaseOptions, (database) => prepareSessionDeletionInDatabase(database, planning, params.expectedDatabaseIdentity), assertCurrent), planning.operation === "entry" ? "session.lifecycle.delete-prepare" : planning.operation === "history" ? "session.lifecycle.archive-plan" : "session.lifecycle.reclamation-plan", diagnostics);
	const result = await runSqliteSessionReclamation({
		diagnostics,
		assertCommitAllowed: assertCurrent,
		forceInProcess: hasPreparedNativeSessionDeletion(),
		plan: {
			kind: "deletion-plan",
			databaseOptions: resolveSessionReclamationDatabaseOptions(databaseOptions),
			materializedPlans: [],
			planning
		}
	});
	if (result.kind !== "deletion-plan") throw new Error(`SQLite session deletion planning returned ${result.kind}`);
	return result.value;
}
async function runSqliteSessionReclamation(params) {
	if (params.diagnostics) params.diagnostics.kind = params.plan.kind;
	if (params.plan.kind === "entry" && supportsOpenClawAgentDatabaseExecution(params.plan.databaseOptions)) {
		const participants = captureNativeSessionWorkerDeletion(params.plan.preparedTargetSnapshot);
		if (participants) {
			const { deleteSessionWithNativeBindingsInWorker } = await import("./session-native-binding-cZjffabq.mjs");
			return deleteSessionWithNativeBindingsInWorker(params.plan, participants, () => params.assertCommitAllowed?.(), params.onWorkerResult);
		}
	}
	if (params.forceInProcess || (params.plan.kind === "maintenance-plan" || params.plan.kind === "maintenance-statistics" || params.plan.kind === "maintenance-age") && !supportsOpenClawAgentDatabaseExecution(params.plan.databaseOptions) || isIncognitoOpenClawAgentSqlitePath(params.plan.databaseOptions.path, {
		agentId: params.plan.databaseOptions.agentId,
		env: params.plan.databaseOptions.env
	})) return await runExclusiveSqliteSessionWrite(params.plan.databaseOptions, async () => {
		if (params.plan.kind === "maintenance-plan") Object.assign(params.plan.input, params.refreshMaintenanceProtection?.());
		params.assertCommitAllowed?.();
		return await withSqliteSessionDatabase(params.plan.databaseOptions, () => {
			params.assertCommitAllowed?.();
			return reclaimSqliteSessionInTransaction(params.plan, {
				beforeMutation: params.assertCommitAllowed,
				onCommit: (database, result) => {
					assertSessionSubagentRunsCurrent(params.plan, params.plan.databaseOptions.env);
					const publish = prepareReclamationPublication(params.plan, readOpenClawAgentDatabaseIdentity(database).identity, result);
					if (publish) deferOpenClawAgentPostCommitPublication(database, publish);
					params.onInProcessCommit?.(database);
				}
			});
		}, params.assertCommitAllowed);
	}, "session.reclamation.in-process", params.diagnostics);
	return await withSqliteMutationWorkerLifetime(params.plan.databaseOptions, async ({ assertCurrent, commitGate, signal }) => {
		const assertRequestCurrent = () => {
			assertCurrent();
			params.assertCommitAllowed?.();
		};
		const runWorker = async (claim, nativeLocation, validationOwner) => {
			const plan = {
				...params.plan,
				databaseOptions: {
					...params.plan.databaseOptions,
					path: nativeLocation
				}
			};
			if (plan.kind === "maintenance-plan" || plan.kind === "maintenance-statistics" || plan.kind === "maintenance-age") {
				const { runSessionMaintenanceMetadataInWorker } = await import("./session-accessor.sqlite-maintenance-worker-C3xhk6TC.mjs");
				return await runSessionMaintenanceMetadataInWorker({
					plan,
					claim,
					refreshMaintenanceProtection: params.refreshMaintenanceProtection,
					assertCurrent: () => {
						assertRequestCurrent();
						claim.assertCurrent();
					},
					signal,
					diagnostics: params.diagnostics,
					onWorkerResult: params.onWorkerResult
				});
			}
			return withSqliteReclamationWorker(plan.databaseOptions, claim, async (worker) => runPreparedSqliteSessionReclamation({
				...params,
				plan
			}, {
				nativeLocation,
				validationOwner,
				claim,
				worker,
				assertRequestCurrent,
				commitGate,
				signal
			}), assertRequestCurrent, signal, params.plan.databaseOptions.path);
		};
		const retained = await runExclusiveSqliteSessionWrite(params.plan.databaseOptions, async () => {
			assertRequestCurrent();
			const database = getOpenClawAgentDatabaseIfOpen(params.plan.databaseOptions);
			return database && !database.db.isTransaction ? retainOpenClawAgentDatabaseReadOnly(params.plan.databaseOptions) : void 0;
		}, "session.reclamation.retain", void 0, "foreground", signal);
		if (retained?.found) {
			const { database, claim } = retained;
			try {
				return await runWorker(claim, readOpenClawAgentDatabaseIdentity(database).filename, {
					database,
					isCurrent: claim.isCurrent
				});
			} finally {
				claim.release();
			}
		}
		const plan = params.plan;
		const execution = captureOpenClawAgentDatabaseExecution(plan.databaseOptions);
		try {
			if (plan.kind === "maintenance-plan" || plan.kind === "maintenance-statistics" || plan.kind === "maintenance-age") {
				const admitted = await withSessionEntryWorker(plan.databaseOptions, void 0, assertRequestCurrent, (owner, source) => owner.runExisting(source, async () => true), void 0, execution, signal);
				const identity = execution.fileIdentity;
				if (!admitted || !identity) throw new Error("SQLite session reclamation lost its prepared database");
				const claim = execution.captureGenerationClaim();
				return await runWorker(claim, identity.nativeLocation, {
					source: {
						agentId: execution.agentId,
						path: identity.nativeLocation
					},
					claim
				});
			}
			const original = execution.fileIdentity;
			const observed = readDatabasePathIdentitySync(plan.databaseOptions.path);
			const expectedSource = Object.freeze(original ? {
				key: `file:${original.physicalIdentity}`,
				canonicalPath: original.nativeLocation,
				...original.birthtime === void 0 ? {} : { birthtime: original.birthtime }
			} : {
				key: observed.key,
				canonicalPath: observed.canonicalPath
			});
			const databaseOptions = {
				...plan.databaseOptions,
				path: expectedSource.canonicalPath
			};
			const assertOpeningCurrent = () => {
				assertRequestCurrent();
				execution.assertCurrent();
			};
			return await withSqliteReclamationWorker(databaseOptions, expectedSource, async (worker) => {
				const validationSource = {
					agentId: execution.agentId,
					path: databaseOptions.path
				};
				const receiveValidation = captureOpenClawAgentDatabaseValidationTransfer(validationSource);
				const prepared = await worker.prepare({
					plan,
					diagnostics: params.diagnostics,
					expectedSource,
					assertCurrent: assertOpeningCurrent,
					commitGate,
					onCommitRequest: () => {
						throw new Error("SQLite source preparation cannot request a mutation commit");
					},
					withWriteAdmission: (run, diagnostics) => runExclusiveSqliteSessionWrite(databaseOptions, async () => {
						let refusal;
						try {
							assertOpeningCurrent();
						} catch (error) {
							refusal = { error };
						}
						await run(refusal);
					}, "session.reclamation.prepare", {
						...params.diagnostics,
						reclamationAdmission: diagnostics
					}, "worker", signal)
				});
				assertOpeningCurrent();
				prepared.claim.assertCurrent();
				receiveValidation(prepared.claim.identity, prepared.validation);
				return runPreparedSqliteSessionReclamation({
					...params,
					plan: {
						...plan,
						databaseOptions
					}
				}, {
					nativeLocation: prepared.source.filename,
					claim: prepared.claim,
					validationOwner: {
						source: validationSource,
						claim: prepared.claim
					},
					worker,
					assertRequestCurrent: assertOpeningCurrent,
					commitGate,
					signal
				});
			}, assertOpeningCurrent, signal, params.plan.databaseOptions.path);
		} finally {
			await execution.release();
		}
	});
}
function prepareReclamationWorkerTransferList(plan) {
	const buffers = /* @__PURE__ */ new Set();
	for (const materializedPlan of plan.materializedPlans) {
		const archive = materializedPlan.archive;
		if (!archive) continue;
		const bytes = ownedWorkerBytes(archive.bytes);
		materializedPlan.archive = {
			...archive,
			bytes
		};
		buffers.add(bytes.buffer);
	}
	return [...buffers];
}
async function runPreparedSqliteSessionReclamation(params, owner) {
	const { claim, worker, assertRequestCurrent, commitGate } = owner;
	const identity = claim.identity;
	if (typeof identity !== "string") throw new Error("SQLite reclamation Worker requires an admitted file generation");
	const { plan } = params;
	const assertCommitAllowed = () => {
		worker.assertCurrent(plan.databaseOptions, claim);
		assertRequestCurrent();
	};
	assertCommitAllowed();
	let publishCommitted;
	return await withSqliteReclamationAuthorization(commitGate, owner.nativeLocation, () => {
		assertCommitAllowed();
		publishCommitted = prepareReclamationPublication(plan, identity);
	}, (authorize) => worker.run({
		claim,
		validationOwner: owner.validationOwner,
		commitGate,
		plan,
		diagnostics: params.diagnostics,
		onCommitRequest: authorize,
		withWriteAdmission: async (run, reclamationAdmission) => await runExclusiveSqliteSessionWrite(plan.databaseOptions, async () => {
			let refusal;
			try {
				assertCommitAllowed();
			} catch (error) {
				refusal = { error };
			}
			const completed = await run(refusal);
			if (completed) {
				const publishRemoval = plan.kind === "maintenance-finalize" || plan.kind === "lifecycle-projection-commit" ? prepareReclamationPublication(plan, identity, completed) : publishCommitted;
				const removedSessionKeys = completed.kind === "lifecycle-projection-commit" ? completed.value.removedSessionKeys : completed.kind === "maintenance-finalize" ? completed.value.committedEntries.map(({ sessionKey }) => sessionKey) : completed.kind === "entry" && plan.kind === "entry" && completed.value.deleted ? plan.preparedTargetSnapshot.map(({ sessionKey }) => sessionKey) : [];
				publishSessionEntryWorkerInvalidations({
					agentId: plan.databaseOptions.agentId,
					storePath: owner.nativeLocation,
					databaseIdentity: identity,
					removedSessionKeys: new Set(removedSessionKeys)
				}, collectReclamationChangedSessionKeys(plan, completed), () => {
					params.onWorkerResult?.(completed, identity);
					publishRemoval?.();
				});
			}
		}, "session.reclamation.worker-commit", {
			...params.diagnostics,
			reclamationAdmission
		}, "worker", owner.signal).catch((error) => {
			if (owner.signal.aborted) assertCommitAllowed();
			throw error;
		}),
		transferList: prepareReclamationWorkerTransferList(plan)
	}));
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-archive-store.ts
/** Publishes derived archive files after their canonical rows and deletions commit. */
async function publishSessionStateArchives(scope, requested, storage) {
	if (storage) return publishPreparedSessionStateArchives(requested, storage);
	const databaseOptions = resolveSessionReclamationDatabaseOptions(toDatabaseOptions(scope));
	const forceInProcess = hasPreparedNativeSessionDeletion() || !supportsOpenClawAgentDatabaseExecution(databaseOptions);
	return withSqliteMutationWorkerLifetime(databaseOptions, ({ assertCurrent, signal }) => withSqliteTranscriptArchiveSession(databaseOptions, async () => {
		if (!forceInProcess && requested.length === 0) try {
			const pending = await readPendingSqliteTranscriptArchivesInWorker({
				agentId: databaseOptions.agentId,
				databasePath: databaseOptions.path,
				env: databaseOptions.env
			}, signal);
			assertCurrent();
			if (!pending) return [...requested];
		} catch {
			assertCurrent();
		}
		const { database, claim } = await runExclusiveSqliteSessionWrite(scope, async () => {
			assertCurrent();
			openOpenClawAgentDatabase(databaseOptions);
			const source = retainOpenClawAgentDatabaseReadOnly(databaseOptions);
			if (!source.found) throw new Error("SQLite archive publication lost its prepared database");
			return source;
		}, "session.archive.publish-prepare", void 0, "foreground", signal);
		const assertOwnerCurrent = () => {
			assertCurrent();
			claim.assertCurrent();
			if (!isOpenClawAgentDatabasePathCurrent(database)) throw new Error("SQLite archive publication database was replaced");
		};
		let result;
		try {
			const retainedIdentity = readOpenClawAgentDatabaseIdentity(database);
			const preparedDatabasePath = path.resolve(forceInProcess ? database.path : retainedIdentity.filename);
			result = await publishPreparedSessionStateArchives(requested, {
				async prepare(requestedForPass) {
					assertOwnerCurrent();
					const prepared = await runSqliteSessionReclamation({
						assertCommitAllowed: assertOwnerCurrent,
						forceInProcess,
						plan: {
							kind: "archive-publish-prepare",
							databaseOptions,
							materializedPlans: [],
							archiveDirectory: resolveSqliteTranscriptArchiveDirectory(scope),
							requested: requestedForPass
						}
					});
					if (prepared.kind !== "archive-publish-prepare") throw new Error("SQLite archive preparation returned another operation's result");
					assertOwnerCurrent();
					for (const plan of prepared.value) {
						if (plan.agentId !== database.agentId || path.resolve(plan.databasePath) !== preparedDatabasePath) throw new Error("SQLite archive preparation changed its retained database owner");
						plan.databasePath = databaseOptions.path;
						plan.databaseIdentity = typeof retainedIdentity.identity === "string" ? retainedIdentity.identity : void 0;
					}
					return prepared.value;
				},
				async record(results) {
					assertOwnerCurrent();
					if ((await runSqliteSessionReclamation({
						assertCommitAllowed: assertOwnerCurrent,
						forceInProcess,
						plan: {
							kind: "archive-publish-record",
							databaseOptions,
							materializedPlans: [],
							results,
							nowMs: Date.now()
						}
					})).kind !== "archive-publish-record") throw new Error("SQLite archive recording returned another operation's result");
				}
			}, signal);
		} catch (operationError) {
			try {
				claim.release();
			} catch (releaseError) {
				throw createSqliteLifecycleAggregateError([operationError, releaseError], "SQLite archive publication and retained claim release both failed", operationError);
			}
			throw operationError;
		}
		claim.release();
		return result;
	}));
}
async function publishPreparedSessionStateArchives(requested, storage, signal) {
	const requestedArchives = uniqueTranscriptArchives(requested);
	const requestedIdentitySet = new Set(requestedArchives.map((archive) => transcriptArchiveIdentityKey(archive.sessionId, archive.generation)));
	let includeRequested = true;
	while (true) {
		const requestedForPass = includeRequested ? requestedArchives : [];
		const plans = await storage.prepare(requestedForPass);
		includeRequested = false;
		if (plans.length === 0) break;
		const results = await runSqliteTranscriptArchivePublishWorker(plans, signal);
		await storage.record(results);
		const planByIdentity = new Map(plans.map((plan) => [transcriptArchiveIdentityKey(plan.sessionId, plan.generation), plan]));
		emitArchivedTranscriptUpdates(results.flatMap((result) => {
			const identity = transcriptArchiveIdentityKey(result.sessionId, result.generation);
			if (!result.archivedPath || requestedIdentitySet.has(identity)) return [];
			const plan = planByIdentity.get(identity);
			return plan ? [{
				archivedPath: result.archivedPath,
				generation: result.generation,
				sessionId: result.sessionId,
				sourcePath: path.join(plan.archiveDirectory, `${result.sessionId}.jsonl`)
			}] : [];
		}));
		const failedIds = results.flatMap((result) => result.archivedPath ? [] : [result.sessionId]);
		if (failedIds.length > 0) throw new Error(`Session deletion committed, but ${failedIds.length} transcript archive file export(s) remain pending in SQLite; retry the operation to publish them.`);
	}
	return [...requested];
}
/** Removes canonical rows only after retention has removed their derived files. */
async function prunePublishedSessionArchivesByRetention(params) {
	const rules = new Map(params.rules.filter((rule) => Number.isFinite(rule.olderThanMs) && rule.olderThanMs >= 0).map((rule) => [rule.reason, rule.olderThanMs]));
	if (rules.size === 0) return 0;
	return withSqliteSessionPageReclamation(toDatabaseOptions(params.scope), async (_reclaim, assertCurrent, _options, archives) => {
		const candidates = await archives.withWriter(archives.readRetentionCandidates);
		assertCurrent();
		const now = params.nowMs ?? Date.now();
		const archiveDirectory = resolveSqliteTranscriptArchiveDirectory(params.scope);
		const removable = candidates.filter((row) => {
			const olderThanMs = rules.get(row.reason);
			if (olderThanMs === void 0 || now - row.created_at <= olderThanMs) return false;
			const archivePath = path.resolve(archiveDirectory, row.archive_name);
			return path.dirname(archivePath) === path.resolve(archiveDirectory) && path.basename(archivePath) === row.archive_name && !fs.existsSync(archivePath);
		});
		if (removable.length === 0) return 0;
		return archives.withWriter(() => {
			assertCurrent();
			return archives.pruneRetention({
				candidates: removable,
				archiveDirectory
			});
		});
	});
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-maintenance.ts
const MAX_SESSION_MAINTENANCE_BATCH_ENTRIES = 64;
const MAX_SESSION_MAINTENANCE_BATCH_ARCHIVE_BYTES = 67108864;
const SESSION_TRANSCRIPT_BYTE_QUERY_BATCH = MAX_SESSION_MAINTENANCE_BATCH_ENTRIES;
const SESSION_PLANNER_ANALYSIS_MIN_DELETED_ENTRIES = MAX_SESSION_MAINTENANCE_BATCH_ENTRIES;
const plannerMaintenanceByStore = /* @__PURE__ */ new Map();
/** Coalesce bounded planner-statistics refreshes behind the per-store writer lane. */
async function refreshSqliteSessionPlannerStatisticsBestEffort(scope, deletedEntries, options = {}) {
	const isCurrent = options.isCurrent ?? (() => true);
	if (deletedEntries < SESSION_PLANNER_ANALYSIS_MIN_DELETED_ENTRIES || !isCurrent()) return;
	const storePath = resolveOpenClawAgentSqlitePath(toDatabaseOptions(scope));
	const active = plannerMaintenanceByStore.get(storePath);
	if (active) {
		await active;
		return;
	}
	const completion = runSqliteSessionReclamation({
		diagnostics: { kind: "maintenance-statistics" },
		assertCommitAllowed: () => {
			if (!isCurrent()) throw new Error("SQLite maintenance planner owner retired");
		},
		forceInProcess: false,
		plan: createSessionMaintenanceStatisticsOperation(toDatabaseOptions(scope))
	}).then(() => void 0).catch((error) => {
		getChildLogger({ subsystem: "session-sqlite" }).warn("SQLite session planner-statistics refresh failed", {
			agentId: scope.agentId,
			error,
			path: storePath
		});
	}).finally(() => {
		plannerMaintenanceByStore.delete(storePath);
	});
	plannerMaintenanceByStore.set(storePath, completion);
	await completion;
}
function buildSessionMaintenanceBatches(params) {
	const parent = params.entryRemovals.map((_, index) => index);
	const find = (index) => {
		let root = index;
		while (parent[root] !== root) root = parent[root] ?? root;
		let current = index;
		while (parent[current] !== current) {
			const next = parent[current] ?? root;
			parent[current] = root;
			current = next;
		}
		return root;
	};
	const union = (left, right) => {
		const leftRoot = find(left);
		const rightRoot = find(right);
		if (leftRoot !== rightRoot) parent[rightRoot] = leftRoot;
	};
	const removalIndexBySessionId = /* @__PURE__ */ new Map();
	const removalIndexBySessionKey = /* @__PURE__ */ new Map();
	const addRemovalIndex = (sessionId, index) => {
		const firstIndex = removalIndexBySessionId.get(sessionId);
		if (firstIndex === void 0) removalIndexBySessionId.set(sessionId, index);
		else union(firstIndex, index);
	};
	for (const [index, removal] of params.entryRemovals.entries()) {
		if (!removal.expectedEntry) continue;
		removalIndexBySessionKey.set(removal.sessionKey, index);
		for (const sessionId of collectSessionStateIdsForEntry(removal.expectedEntry)) addRemovalIndex(sessionId, index);
	}
	for (const plan of params.stateDeletePlans) {
		const ownerIndex = plan.snapshot.sessionKey ? removalIndexBySessionKey.get(plan.snapshot.sessionKey) : void 0;
		if (ownerIndex !== void 0) addRemovalIndex(plan.sessionId, ownerIndex);
	}
	const groupsByRoot = /* @__PURE__ */ new Map();
	for (const [index, removal] of params.entryRemovals.entries()) {
		const root = find(index);
		const group = groupsByRoot.get(root) ?? {
			archiveBytes: 0,
			entryRemovals: [],
			order: index,
			stateDeletePlans: [],
			workItems: 0
		};
		group.entryRemovals.push(removal);
		group.order = Math.min(group.order, index);
		groupsByRoot.set(root, group);
	}
	const plansBySessionId = /* @__PURE__ */ new Map();
	for (const plan of params.stateDeletePlans) {
		const plans = plansBySessionId.get(plan.sessionId) ?? [];
		plans.push(plan);
		plansBySessionId.set(plan.sessionId, plans);
	}
	const standaloneGroups = [];
	let standaloneOrder = params.entryRemovals.length;
	for (const [sessionId, plans] of plansBySessionId) {
		const removalIndex = removalIndexBySessionId.get(sessionId);
		const removalGroup = removalIndex === void 0 ? void 0 : groupsByRoot.get(find(removalIndex));
		const group = removalGroup ?? {
			archiveBytes: 0,
			entryRemovals: [],
			order: standaloneOrder++,
			stateDeletePlans: [],
			workItems: 0
		};
		group.stateDeletePlans.push(...plans);
		if (plans.some((plan) => plan.archiveTranscript)) group.archiveBytes += params.archiveBytesBySessionId.get(sessionId) ?? 0;
		if (!removalGroup) standaloneGroups.push(group);
	}
	const groups = [...groupsByRoot.values(), ...standaloneGroups].map((group) => {
		group.workItems = Math.max(group.entryRemovals.length, new Set(group.stateDeletePlans.map((plan) => plan.sessionId)).size);
		return group;
	}).toSorted((left, right) => left.order - right.order);
	const batches = [];
	let batch = {
		archiveBytes: 0,
		entryRemovals: [],
		stateDeletePlans: [],
		workItems: 0
	};
	const flush = () => {
		if (batch.workItems === 0) return;
		batches.push(batch);
		batch = {
			archiveBytes: 0,
			entryRemovals: [],
			stateDeletePlans: [],
			workItems: 0
		};
	};
	for (const group of groups) {
		const exceedsEntryLimit = batch.workItems > 0 && batch.workItems + group.workItems > MAX_SESSION_MAINTENANCE_BATCH_ENTRIES;
		const exceedsByteLimit = batch.workItems > 0 && batch.archiveBytes + group.archiveBytes > MAX_SESSION_MAINTENANCE_BATCH_ARCHIVE_BYTES;
		if (exceedsEntryLimit || exceedsByteLimit) flush();
		batch.archiveBytes += group.archiveBytes;
		batch.entryRemovals.push(...group.entryRemovals);
		batch.stateDeletePlans.push(...group.stateDeletePlans);
		batch.workItems += group.workItems;
	}
	flush();
	return batches;
}
async function readSessionTranscriptJsonlBytes(scope, sessionIds, isCurrent) {
	const bytesBySessionId = /* @__PURE__ */ new Map();
	const options = resolveSessionReclamationDatabaseOptions(toDatabaseOptions(scope));
	for (let offset = 0; offset < sessionIds.length; offset += SESSION_TRANSCRIPT_BYTE_QUERY_BATCH) {
		const batch = sessionIds.slice(offset, offset + SESSION_TRANSCRIPT_BYTE_QUERY_BATCH);
		await new Promise((resolve) => {
			setImmediate(resolve);
		});
		if (!isCurrent()) return bytesBySessionId;
		let sized;
		if (isIncognitoOpenClawAgentSqlitePath(options.path, options)) {
			const opened = withOpenClawAgentDatabaseReadOnly((database) => readSessionTranscriptJsonlBytesInDatabase(database, batch), options);
			if (!opened.found) throw new Error(`Cannot size SQLite session transcripts: ${opened.reason.replaceAll("-", " ")}`);
			sized = opened.value;
		} else {
			const results = await withSqliteMutationWorkerLifetime(options, async ({ assertCurrent, signal }) => await runSqliteTranscriptArchiveWorkerOperation({
				assertCurrent,
				signal,
				expectedMessageType: "sized",
				workerData: {
					type: "sqlite-transcript-archive-v2",
					operation: "maintenance-size",
					input: {
						...options,
						sessionIds: batch
					}
				}
			}));
			if (!results[0]) throw new Error("SQLite maintenance sizing worker omitted its result");
			sized = results[0];
		}
		if (!isCurrent()) return bytesBySessionId;
		for (const [sessionId, bytes] of sized) bytesBySessionId.set(sessionId, bytes);
	}
	return bytesBySessionId;
}
function applySessionEntryMaintenance(database, params) {
	if (params.skipMaintenance) return emptySessionEntryMaintenancePlan();
	const maintenance = params.maintenanceConfig ? normalizeResolvedMaintenanceConfigInput(params.maintenanceConfig) : resolveMaintenanceConfig();
	if (maintenance.mode === "warn") return emptySessionEntryMaintenancePlan();
	return applySessionEntryMaintenanceInDatabase(database, {
		...params,
		maintenance
	}, () => captureSessionMaintenancePreservation(params.storePath));
}
/** Finalizes maintenance after its caller releases the per-store writer lane. */
async function finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort(scope, plans, options = {}) {
	const isCurrent = options.isCurrent ?? (() => true);
	const committedCounts = {
		archived: plans.reduce((count, plan) => count + plan.archived, 0),
		capArchived: plans.reduce((count, plan) => count + plan.capArchived, 0),
		modelRunPruned: 0,
		pruned: 0,
		capped: plans.reduce((count, plan) => count + plan.capped - plan.entryRemovals.filter((removal) => removal.maintenanceReason === "capped").length, 0)
	};
	const emptyResult = () => ({
		archivedTranscripts: [],
		...committedCounts
	});
	if (!isCurrent()) return emptyResult();
	const archivedWorktrees = plans.flatMap((plan) => plan.archivedWorktrees ?? []);
	if (archivedWorktrees.length) {
		const { cleanUpAutomaticallyArchivedWorktrees } = await import("./session-worktree-lifecycle-C93WMbG5.mjs");
		if (!isCurrent()) return emptyResult();
		await cleanUpAutomaticallyArchivedWorktrees(scope, archivedWorktrees);
	}
	const entryRemovals = plans.flatMap((plan) => plan.entryRemovals);
	const stateDeletePlans = plans.flatMap((plan) => plan.stateDeletePlans);
	const warn = (message, error, warnedStateDeletePlans) => {
		getChildLogger({ subsystem: "session-sqlite" }).warn(message, {
			agentId: scope.agentId,
			error,
			path: scope.path,
			sessionIds: uniqueStrings(warnedStateDeletePlans.map((plan) => plan.sessionId))
		});
	};
	if (!isCurrent()) return emptyResult();
	if (entryRemovals.length === 0 && stateDeletePlans.length === 0) {
		await refreshSqliteSessionPlannerStatisticsBestEffort(scope, options.deletedEntriesBeforeMaintenance ?? 0, { isCurrent });
		return emptyResult();
	}
	let archiveBytesBySessionId;
	try {
		archiveBytesBySessionId = await readSessionTranscriptJsonlBytes(scope, stateDeletePlans.filter((plan) => plan.archiveTranscript).map((plan) => plan.sessionId), isCurrent);
	} catch (error) {
		warn("SQLite session maintenance archive sizing failed", error, stateDeletePlans);
		await refreshSqliteSessionPlannerStatisticsBestEffort(scope, options.deletedEntriesBeforeMaintenance ?? 0, { isCurrent });
		return emptyResult();
	}
	if (!isCurrent()) return emptyResult();
	const publishedTranscripts = [];
	let deletedEntries = options.deletedEntriesBeforeMaintenance ?? 0;
	for (const batch of buildSessionMaintenanceBatches({
		archiveBytesBySessionId,
		entryRemovals,
		stateDeletePlans
	})) {
		if (!isCurrent()) break;
		let archivedTranscripts;
		let changedEntryRemovals;
		let committedEntryRemovals;
		try {
			const materializedPlans = await materializeSessionStateDeletePlans(batch.stateDeletePlans);
			if (!isCurrent()) break;
			const result = await withSqliteSessionDeletions(scope, batch.entryRemovals.flatMap(({ expectedEntry: entry, sessionKey }) => entry ? [{
				entry,
				sessionKey
			}] : []), async (assertCurrent) => await runSqliteSessionReclamation({
				diagnostics: { kind: "maintenance-finalize" },
				assertCommitAllowed: () => {
					assertCurrent();
					if (!isCurrent()) throw new Error("SQLite automatic maintenance owner retired");
				},
				forceInProcess: hasPreparedNativeSessionDeletion(),
				plan: createSessionMaintenanceFinalizationOperation({
					agentId: scope.agentId,
					databaseOptions: toDatabaseOptions(scope),
					entries: batch.entryRemovals,
					materializedPlans
				})
			}));
			if (result.kind !== "maintenance-finalize") throw new Error("SQLite maintenance returned another operation's result");
			archivedTranscripts = result.value.archivedTranscripts;
			changedEntryRemovals = result.value.changedEntries;
			committedEntryRemovals = result.value.committedEntries;
		} catch (error) {
			warn("SQLite session maintenance cleanup failed", error, batch.stateDeletePlans);
			break;
		}
		if (!isCurrent()) break;
		if (changedEntryRemovals.length > 0) getChildLogger({ subsystem: "session-sqlite" }).warn("SQLite session maintenance skipped changed entries", {
			agentId: scope.agentId,
			path: scope.path,
			sessionKeys: changedEntryRemovals.map((removal) => removal.sessionKey)
		});
		deletedEntries += batch.workItems - (batch.entryRemovals.length - committedEntryRemovals.length);
		for (const removal of committedEntryRemovals) if (removal.maintenanceReason === "model-run-pruned") committedCounts.modelRunPruned += 1;
		else if (removal.maintenanceReason === "pruned") committedCounts.pruned += 1;
		else if (removal.maintenanceReason === "capped") committedCounts.capped += 1;
		try {
			publishedTranscripts.push(...await publishSessionStateArchives(scope, archivedTranscripts));
		} catch (error) {
			warn("SQLite session maintenance archive publication failed", error, batch.stateDeletePlans);
		}
	}
	if (isCurrent()) await refreshSqliteSessionPlannerStatisticsBestEffort(scope, deletedEntries, { isCurrent });
	return {
		archivedTranscripts: publishedTranscripts,
		...committedCounts
	};
}
//#endregion
//#region src/config/sessions/session-history-budget-state.ts
const log$1 = createSubsystemLogger("sessions/history-eviction");
function createPhysicalBudgetResult(params) {
	const totalBytesAfter = params.totalBytesAfter ?? params.totalBytesBefore;
	return {
		totalBytesBefore: params.totalBytesBefore,
		totalBytesAfter,
		removedFiles: params.removedFiles ?? 0,
		removedEntries: params.removedEntries ?? 0,
		freedBytes: Math.max(0, params.totalBytesBefore - totalBytesAfter),
		maxBytes: params.maxBytes,
		highWaterBytes: params.highWaterBytes,
		overBudget: params.totalBytesBefore > params.maxBytes,
		...params.deferred ? {
			deferredReason: "checkpoint-incomplete",
			...params.deferred
		} : {}
	};
}
const PHYSICAL_BUDGET_CHECK_INTERVAL_MS = 18e5;
const FORCED_PHYSICAL_BUDGET_CHECK_INTERVAL_MS = 6e4;
const budgetKickStateByStore = /* @__PURE__ */ new Map();
onSqliteWalCheckpoint(({ databasePath, health, observedAtNs, lastCompletedAtNs }) => {
	const completedAtNs = health.state === "complete" ? observedAtNs : lastCompletedAtNs ?? 0n;
	for (const state of budgetKickStateByStore.values()) {
		const gate = state.checkpointGate;
		if (!gate || gate.databasePath !== databasePath || completedAtNs <= gate.completedAtNs) continue;
		gate.completedAtNs = completedAtNs;
		if (state.checkpointBlocked && completedAtNs >= gate.afterNs) {
			state.checkpointBlocked = void 0;
			state.blockedUntil = void 0;
			state.lastCheckAt = -Infinity;
			state.lastForcedCheckAt = -Infinity;
		}
	}
});
function deferPhysicalBudgetForCheckpoint(params, databasePath, checkpoint) {
	const state = getBudgetKickState(params.storePath, params.maintenance);
	state.checkpointGate ??= {
		databasePath: sqliteReaderDatabasePathKey(databasePath),
		afterNs: checkpoint?.observedAtNs ?? process.hrtime.bigint(),
		completedAtNs: 0n
	};
	state.checkpointBlocked = { checkpoint };
}
function getBudgetKickState(storePath, budget) {
	let state = budgetKickStateByStore.get(storePath);
	if (!state) {
		state = {
			budget,
			lastCheckAt: -Infinity,
			lastForcedCheckAt: -Infinity,
			running: false
		};
		budgetKickStateByStore.set(storePath, state);
	} else if (state.budget.maxDiskBytes !== budget.maxDiskBytes || state.budget.highWaterBytes !== budget.highWaterBytes || state.budget.preserveRecentMs !== budget.preserveRecentMs) {
		state.budget = budget;
		state.lastCheckAt = -Infinity;
		state.lastForcedCheckAt = -Infinity;
		state.blockedUntil = void 0;
	}
	return state;
}
function recordPhysicalBudgetOutcome(params, result) {
	if (params.mode !== "enforce" || !result) return;
	const state = getBudgetKickState(params.storePath, params.maintenance);
	if (result.deferredReason) {
		if (state.checkpointBlocked?.warned) return;
		if (state.checkpointBlocked) state.checkpointBlocked.warned = true;
		log$1.warn("session history disk budget deferred until a completed WAL checkpoint is observed", {
			storePath: params.storePath,
			reason: result.deferredReason,
			totalBytesBefore: result.totalBytesBefore,
			totalBytesAfter: result.totalBytesAfter,
			walBytesBefore: result.walBytesBefore,
			walBytesAfter: result.walBytesAfter,
			checkpoint: result.checkpoint
		});
		return;
	}
	state.checkpointGate = void 0;
	if (result.totalBytesAfter <= result.maxBytes) {
		state.blockedUntil = void 0;
		if (result.overBudget) log$1.info("session history disk budget cleanup completed", {
			storePath: params.storePath,
			totalBytesBefore: result.totalBytesBefore,
			totalBytesAfter: result.totalBytesAfter,
			removedEntries: result.removedEntries,
			removedFiles: result.removedFiles,
			maxBytes: result.maxBytes
		});
		return;
	}
	const alreadyBlocked = state.blockedUntil !== void 0;
	state.blockedUntil = Date.now() + PHYSICAL_BUDGET_CHECK_INTERVAL_MS;
	if (!alreadyBlocked) log$1.warn("session history disk budget remains exceeded after cleanup; retained data is protected or could not be reclaimed. Raise session.maintenance.maxDiskBytes or export and delete unneeded sessions; automatic checks resume on activity after 30 minutes", {
		storePath: params.storePath,
		totalBytes: result.totalBytesAfter,
		maxBytes: result.maxBytes,
		highWaterBytes: result.highWaterBytes,
		nextCheckAt: state.blockedUntil
	});
}
//#endregion
//#region src/config/sessions/session-history-eviction.ts
/** Reports the same physical total enforce mode compares, without projecting logical row bytes. */
async function inspectSqliteSessionHistoryDiskBudget(input) {
	const params = {
		...input,
		env: { ...input.env ?? process.env }
	};
	params.env.OPENCLAW_STATE_DIR = resolveStateDir(params.env);
	const { highWaterBytes, maxDiskBytes } = params.maintenance;
	if (maxDiskBytes == null || highWaterBytes == null) return {
		diskBudget: null,
		wouldMutate: false
	};
	const usage = await measureSessionPhysicalDiskUsage(params.storePath);
	const diskBudget = createPhysicalBudgetResult({
		totalBytesBefore: usage.totalBytes,
		maxBytes: maxDiskBytes,
		highWaterBytes
	});
	if (!diskBudget.overBudget || params.mode !== "enforce") return {
		diskBudget,
		wouldMutate: false
	};
	const blocked = budgetKickStateByStore.get(params.storePath)?.checkpointBlocked;
	if (blocked) return {
		diskBudget: {
			...diskBudget,
			deferredReason: "checkpoint-incomplete",
			checkpoint: blocked.checkpoint?.health,
			walBytesBefore: usage.databaseWalBytes,
			walBytesAfter: usage.databaseWalBytes
		},
		wouldMutate: false
	};
	const resolved = resolveSqliteScope({
		...params.agentId ? { agentId: params.agentId } : {},
		env: params.env,
		sessionKey: "",
		storePath: params.storePath
	});
	const databaseOptions = toDatabaseOptions(resolved);
	if (await hasCanonicalSessionTranscriptArchives(databaseOptions) || await hasRetainedSessionTranscriptArchives(params.storePath)) return {
		diskBudget,
		wouldMutate: true
	};
	const candidates = await readHistoricalSessionIds({
		databaseOptions,
		preserveRecentMs: params.maintenance.preserveRecentMs,
		reclamationMode: params.reclamationMode,
		storePath: params.storePath
	});
	const archivedCandidates = await readDiskEvictableArchivedSessionBatch({
		databaseOptions,
		limit: 1,
		preserveRecentMs: params.maintenance.preserveRecentMs
	});
	return {
		diskBudget,
		wouldMutate: candidates.length > 0 || archivedCandidates.candidates.length > 0
	};
}
function collectCandidateAdditionalProtection(params) {
	const protectedSessionIds = collectAdmissionProtectedSessionIds(params);
	if (isRecentHistoricalSessionId(params)) protectedSessionIds.add(params.sessionId);
	return protectedSessionIds;
}
/** Session ids owned by in-flight work admissions, without live-reference protection. */
function collectAdmissionProtectedSessionIds(params) {
	return collectSessionAdmissionReferences({
		database: params.database,
		admissionIdentities: [...collectActiveSessionWorkAdmissions().get(params.storePath) ?? []]
	});
}
async function readHistoricalSessionIds(params) {
	const input = {
		admissionIdentities: [...collectActiveSessionWorkAdmissions().get(params.storePath) ?? []],
		preserveRecentMs: params.preserveRecentMs
	};
	if (params.reclamationMode === "in-process" || isIncognitoOpenClawAgentSqlitePath(resolveOpenClawAgentSqlitePath(params.databaseOptions), params.databaseOptions)) return readHistoricalSessionIdsInDatabase({
		...input,
		database: openOpenClawAgentDatabase(params.databaseOptions)
	});
	return withSessionHistoryWorkerDatabase(params.databaseOptions, (owner) => owner.readHistoricalEvictionCandidates({
		...input,
		env: params.databaseOptions.env ?? process.env
	}), maintenanceLane);
}
async function readDiskEvictableArchivedSessionBatch({ databaseOptions, ...archived }) {
	if (isIncognitoOpenClawAgentSqlitePath(resolveOpenClawAgentSqlitePath(databaseOptions), databaseOptions)) {
		const result = withOpenClawAgentDatabaseReadOnly((database) => readDiskEvictableArchivedSessionBatchInDatabase(database, archived), databaseOptions);
		return result.found ? result.value : {
			candidates: [],
			exhausted: true
		};
	}
	const options = {
		...databaseOptions,
		path: resolveOpenClawAgentSqlitePath(databaseOptions)
	};
	return withSqliteMutationWorkerLifetime(options, async ({ assertCurrent }) => {
		assertCurrent();
		const batch = await withSessionHistoryWorkerDatabase(options, (owner) => owner.readArchivedEvictionCandidates({
			archived,
			env: options.env ?? process.env
		}), maintenanceLane);
		assertCurrent();
		return batch;
	});
}
const log = createSubsystemLogger("sessions/history-eviction");
/** Fire-and-forget budget pass from the ordinary entry-write maintenance seam. */
function kickSessionHistoryDiskBudgetMaintenance(input) {
	if (input.agentId && isIncognitoOpenClawAgentSqlitePath(input.storePath, {
		agentId: input.agentId,
		env: input.env
	})) return;
	const maintenance = input.maintenanceConfig ?? resolveMaintenanceConfig();
	if (maintenance.mode !== "enforce" || maintenance.maxDiskBytes == null || maintenance.highWaterBytes == null) return;
	const now = input.now ?? Date.now();
	const state = getBudgetKickState(input.storePath, maintenance);
	if (state.checkpointBlocked) return;
	if (state.running) {
		if (input.force) {
			const env = { ...input.env ?? process.env };
			env.OPENCLAW_STATE_DIR = resolveStateDir(env);
			state.pendingForce = {
				...input,
				env,
				maintenanceConfig: maintenance,
				now: void 0
			};
		}
		return;
	}
	const interval = input.force ? FORCED_PHYSICAL_BUDGET_CHECK_INTERVAL_MS : PHYSICAL_BUDGET_CHECK_INTERVAL_MS;
	const lastCheckAt = input.force ? state.lastForcedCheckAt : state.lastCheckAt;
	if (now < (state.blockedUntil ?? -Infinity) || now - lastCheckAt < interval) return;
	const params = {
		...input,
		env: { ...input.env ?? process.env }
	};
	params.env.OPENCLAW_STATE_DIR = resolveStateDir(params.env);
	state.lastCheckAt = now;
	if (input.force) state.lastForcedCheckAt = now;
	state.running = true;
	budgetKickStateByStore.set(params.storePath, state);
	enforceSqliteSessionHistoryDiskBudget({
		...params.agentId ? { agentId: params.agentId } : {},
		env: params.env,
		storePath: params.storePath,
		mode: maintenance.mode,
		maintenance
	}).catch((error) => {
		log.warn("session history disk-budget sweep failed; retrying on next kick", {
			error,
			storePath: params.storePath
		});
	}).finally(() => {
		state.running = false;
		if (state.pendingForce) {
			const pending = state.pendingForce;
			state.pendingForce = void 0;
			kickSessionHistoryDiskBudgetMaintenance(pending);
		}
	});
}
const SESSION_HISTORY_MAINTENANCE_QUEUES = /* @__PURE__ */ new Map();
/** Extracts historical sessions durably before reclaiming their SQLite rows. */
async function enforceSqliteSessionHistoryDiskBudget(input) {
	const params = {
		...input,
		env: { ...input.env ?? process.env }
	};
	params.env.OPENCLAW_STATE_DIR = resolveStateDir(params.env);
	return await runQueuedStoreWrite({
		queues: SESSION_HISTORY_MAINTENANCE_QUEUES,
		storePath: params.storePath,
		label: "enforceSqliteSessionHistoryDiskBudget",
		fn: async () => {
			try {
				const result = await enforceSessionHistoryMaintenanceSerialized(params);
				recordPhysicalBudgetOutcome(params, result);
				return result;
			} catch (error) {
				const state = getBudgetKickState(params.storePath, params.maintenance);
				if (!state.checkpointBlocked) state.checkpointGate = void 0;
				throw error;
			}
		}
	});
}
async function enforceSessionHistoryMaintenanceSerialized(params) {
	const { highWaterBytes, maxDiskBytes } = params.maintenance;
	if (maxDiskBytes == null || highWaterBytes == null) return null;
	const initialUsage = await measureSessionPhysicalDiskUsage(params.storePath);
	const blocked = getBudgetKickState(params.storePath, params.maintenance).checkpointBlocked;
	if (blocked && params.mode === "enforce") return createPhysicalBudgetResult({
		totalBytesBefore: initialUsage.totalBytes,
		maxBytes: maxDiskBytes,
		highWaterBytes,
		deferred: {
			checkpoint: blocked.checkpoint?.health,
			walBytesBefore: initialUsage.databaseWalBytes,
			walBytesAfter: initialUsage.databaseWalBytes
		}
	});
	if (initialUsage.totalBytes <= maxDiskBytes || params.mode === "warn") return createPhysicalBudgetResult({
		totalBytesBefore: initialUsage.totalBytes,
		maxBytes: maxDiskBytes,
		highWaterBytes
	});
	const resolved = resolveSqliteScope({
		...params.agentId ? { agentId: params.agentId } : {},
		env: params.env,
		sessionKey: "",
		storePath: params.storePath
	});
	return await withSqliteTranscriptArchiveSession(toDatabaseOptions(resolved), () => enforceSessionHistoryMaintenanceForDatabase(params, initialUsage, resolved, highWaterBytes, maxDiskBytes));
}
async function enforceSessionHistoryMaintenanceForDatabase(params, initialUsage, resolved, highWaterBytes, maxDiskBytes) {
	const databaseOptions = toDatabaseOptions(resolved);
	const databasePath = resolveOpenClawAgentSqlitePath(databaseOptions);
	const budgetState = getBudgetKickState(params.storePath, params.maintenance);
	const checkpointGate = budgetState.checkpointGate ??= {
		databasePath: sqliteReaderDatabasePathKey(databasePath),
		afterNs: process.hrtime.bigint(),
		completedAtNs: 0n
	};
	const archiveDirectory = resolveSqliteTranscriptArchiveDirectory(resolved);
	const pruneArchives = (trigger) => {
		if (trigger === "after-eviction") checkpointGate.afterNs = process.hrtime.bigint();
		return pruneAllSessionTranscriptArchivesToHighWater({
			archiveDirectory,
			databaseOptions,
			diagnostics: { trigger },
			checkpointGate,
			highWaterBytes,
			storePath: params.storePath,
			onCheckpointIncomplete: (checkpoint) => deferPhysicalBudgetForCheckpoint(params, databasePath, checkpoint)
		});
	};
	let pruning = await pruneArchives("initial");
	let { usage, removedFiles } = pruning;
	let removedEntries = 0;
	const finish = () => createPhysicalBudgetResult({
		totalBytesBefore: initialUsage.totalBytes,
		totalBytesAfter: usage.totalBytes,
		removedEntries,
		removedFiles,
		maxBytes: maxDiskBytes,
		highWaterBytes,
		...pruning.checkpointIncomplete ? { deferred: {
			checkpoint: pruning.checkpoint,
			walBytesBefore: initialUsage.databaseWalBytes,
			walBytesAfter: usage.databaseWalBytes
		} } : {}
	});
	if (pruning.checkpointIncomplete) return finish();
	const candidates = usage.totalBytes > highWaterBytes ? await readHistoricalSessionIds({
		databaseOptions,
		preserveRecentMs: params.maintenance.preserveRecentMs,
		reclamationMode: params.reclamationMode,
		storePath: params.storePath
	}) : [];
	for (const sessionId of candidates) {
		if (usage.totalBytes <= highWaterBytes) break;
		const eviction = await runExclusiveSessionLifecycleMutation("history-evict", {
			scope: params.storePath,
			identities: [sessionId],
			run: async () => {
				const plan = await runExclusiveSqliteSessionWrite(resolved, async () => withSqliteSessionDatabase(databaseOptions, (database) => {
					const protectedBeforeArchive = collectCandidateAdditionalProtection({
						database,
						preserveRecentMs: params.maintenance.preserveRecentMs,
						sessionId,
						storePath: params.storePath
					});
					return planSessionStateDeleteIfUnreferenced({
						archiveDirectory,
						archiveTranscript: true,
						database,
						reason: "deleted",
						referencedSessionIds: protectedBeforeArchive,
						sessionId
					});
				}), "session.history.eviction-prepare");
				if (!plan) return null;
				return await runExclusiveSqliteSessionReclamation(async () => {
					const materialized = await materializeSessionStateDeletePlans([plan]);
					const diagnostics = {};
					const reclamationPlan = await runExclusiveSqliteSessionWrite(resolved, async () => withSqliteSessionDatabase(databaseOptions, (database) => {
						const protectedSessionIds = collectCandidateAdditionalProtection({
							database,
							preserveRecentMs: params.maintenance.preserveRecentMs,
							sessionId,
							storePath: params.storePath
						});
						if (protectedSessionIds.has(sessionId)) return null;
						return createHistoryEvictionReclamationPlan({
							databaseOptions,
							diskBudget: { preserveRecentMs: params.maintenance.preserveRecentMs },
							materializedPlans: materialized,
							protectedSessionIds,
							sessionId
						});
					}), "session.history.reclamation-plan", diagnostics);
					if (!reclamationPlan) return null;
					const reclaimed = await runSqliteSessionReclamation({
						diagnostics,
						forceInProcess: params.reclamationMode === "in-process",
						plan: reclamationPlan
					});
					if (reclaimed.kind !== reclamationPlan.kind) throw new Error(`SQLite session reclamation returned ${reclaimed.kind} for ${reclamationPlan.kind}`);
					if (!reclaimed.value.deleted) return null;
					return { archivedTranscripts: reclaimed.value.archivedTranscripts };
				});
			}
		});
		if (!eviction) {
			usage = await measureSessionPhysicalDiskUsage(params.storePath);
			continue;
		}
		const publishedArchives = await publishSessionStateArchives(resolved, eviction.archivedTranscripts);
		removedEntries += 1;
		emitArchivedTranscriptUpdates(publishedArchives);
		usage = await measureSessionPhysicalDiskUsage(params.storePath);
		if (usage.totalBytes > highWaterBytes) {
			const repruned = await pruneArchives("after-eviction");
			pruning = repruned;
			removedFiles += repruned.removedFiles;
			usage = repruned.usage;
			if (repruned.checkpointIncomplete) return finish();
		}
	}
	if (usage.totalBytes > highWaterBytes) {
		const finalPrune = await pruneArchives("final");
		pruning = finalPrune;
		removedFiles += finalPrune.removedFiles;
		usage = finalPrune.usage;
		if (finalPrune.checkpointIncomplete) return finish();
	}
	if (usage.totalBytes > highWaterBytes) {
		let after;
		while (usage.totalBytes > highWaterBytes) {
			const batch = await readDiskEvictableArchivedSessionBatch({
				...after ? { after } : {},
				databaseOptions,
				preserveRecentMs: params.maintenance.preserveRecentMs
			});
			if (batch.candidates.length === 0) break;
			after = batch.cursor;
			for (const candidate of batch.candidates) {
				if (usage.totalBytes <= highWaterBytes) break;
				if (!(await runExclusiveSessionLifecycleMutation("archived-delete", {
					scope: params.storePath,
					identities: [candidate.sessionKey, candidate.entry.sessionId],
					run: async () => {
						const { deleteDiskBudgetSessionEntryLifecycle } = await import("./session-accessor.sqlite-lifecycle-CT0FTE2v.mjs");
						return await deleteDiskBudgetSessionEntryLifecycle({
							...params.agentId ? { agentId: params.agentId } : {},
							archiveTranscript: false,
							deleteDeliveryArtifacts: true,
							deleteTranscriptWithoutArchive: true,
							expectedEntry: candidate.entry,
							expectedSessionId: candidate.entry.sessionId,
							storePath: params.storePath,
							target: {
								canonicalKey: candidate.sessionKey,
								storeKeys: [candidate.sessionKey]
							}
						}, resolved);
					}
				})).deleted) {
					usage = await measureSessionPhysicalDiskUsage(params.storePath);
					continue;
				}
				removedEntries += 1;
				const pageDiagnostics = { trigger: "after-eviction" };
				checkpointGate.afterNs = process.hrtime.bigint();
				const checkpointCompleted = await withSqliteSessionPageReclamation(databaseOptions, async (reclaimPages, assertCurrent, preparedOptions) => {
					try {
						return await reclaimSqliteFreePages(preparedOptions, pageDiagnostics, {
							reclaimPages,
							checkpointGate,
							assertCurrent,
							onCheckpointIncomplete: (checkpoint) => deferPhysicalBudgetForCheckpoint(params, databasePath, checkpoint)
						});
					} catch {
						assertCurrent();
						return true;
					}
				});
				usage = await measureSessionPhysicalDiskUsage(params.storePath);
				if (!checkpointCompleted) {
					pruning = {
						usage,
						removedFiles: 0,
						completed: false,
						checkpointIncomplete: pageDiagnostics.checkpointIncomplete ?? 1,
						checkpoint: pageDiagnostics.checkpoint
					};
					return finish();
				}
			}
			if (batch.exhausted) break;
		}
	}
	if (removedEntries > 0) {
		await refreshSqliteSessionPlannerStatisticsBestEffort(resolved, removedEntries);
		usage = await measureSessionPhysicalDiskUsage(params.storePath);
	}
	return finish();
}
//#endregion
export { applySessionEntryMaintenance as a, prunePublishedSessionArchivesByRetention as c, runSqliteSessionReclamation as d, emitArchivedTranscriptUpdates as f, kickSessionHistoryDiskBudgetMaintenance as i, publishSessionStateArchives as l, enforceSqliteSessionHistoryDiskBudget as n, finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort as o, publishTranscriptUpdate as p, inspectSqliteSessionHistoryDiskBudget as r, refreshSqliteSessionPlannerStatisticsBestEffort as s, collectAdmissionProtectedSessionIds as t, runSessionDeletionPlanning as u };
