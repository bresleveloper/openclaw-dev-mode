import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { y as uniqueStrings } from "./string-normalization-D6DKCpwE.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { r as getChildLogger } from "./logger-DR3u4tgD.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { f as readDatabasePathIdentitySync, n as assertDatabasePathIdentity, r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { a as createSqliteLifecycleAggregateError } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { d as isOpenClawDatabaseMaintenanceWorkerAccess, l as getOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-CtHZ7B35.mjs";
import { s as sqliteReaderDatabasePathKey } from "./sqlite-reader-lifecycle-Cw11HwJP.mjs";
import { c as resolveOpenClawAgentSqlitePath, o as resolveExplicitIncognitoAgentSqliteTarget } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { r as onSqliteWalCheckpoint } from "./sqlite-wal-checkpoint-CgnAfdqs.mjs";
import { i as runQueuedStoreWrite } from "./store-writer-queue-AKR6NnXM.mjs";
import { D as resolveProjectedAgentRunProgressState, L as iterateProjectedAgentRunSessionKeys, t as buildProjectedAgentRunIndex } from "./agent-run-registry-gmaPgO-n.mjs";
import { a as readOpenClawAgentDatabaseIdentity, i as isOpenClawAgentDatabasePathCurrent } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { a as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./session-sqlite-target-paths-DufdR-Na.mjs";
import { t as ownedWorkerBytes } from "./worker-transfer-bytes-D_DP0IHa.mjs";
import { l as hasAgentDatabaseMaintenanceAuthority } from "./openclaw-agent-db-lease-Brvd0WI4.mjs";
import { o as captureOpenClawAgentDatabaseValidationTransfer } from "./openclaw-agent-db-validation-cache-9WCf6XyJ.mjs";
import { u as deferOpenClawAgentPostCommitPublication } from "./openclaw-agent-db-lifecycle-Dodvmz4L.mjs";
import { i as getOpenClawAgentDatabaseIfOpen, o as openOpenClawAgentDatabase } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { n as captureSessionStoreCandidateIdentities, t as assertSessionStoreReadCandidate } from "./session-store-read-candidates-CmVF2223.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-CUxN9KZj.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { a as normalizeResolvedMaintenanceConfigInput } from "./store-maintenance-BqMt1Twc.mjs";
import { c as collectSessionStateIdsForEntry } from "./transcript-event-media-C4aKs47S.mjs";
import { n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { r as resolveSqliteScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import { d as withSqliteSessionDatabase, l as runExclusiveSqliteSessionWrite, n as captureLifecycleDatabaseScope, o as resolveSqliteTranscriptArchiveDirectory } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { r as captureOpenClawAgentDatabaseExecution, s as supportsOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { c as maintenanceLane } from "./session-transcript-worker-resources-D1956Oac.mjs";
import { o as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { t as retainOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { t as captureSessionStoreReadCandidates } from "./session-store-target-inventory-BkD5HoDI.mjs";
import { t as publishSessionEntryWorkerInvalidations } from "./session-accessor.sqlite-entry-worker-publication-myyyu_fk.mjs";
import { f as withSqliteMutationWorkerLifetime, i as readPendingSqliteTranscriptArchivesInWorker, l as runSqliteTranscriptArchiveWorkerOperation, n as materializeSessionHistoryEvictionPlan, p as withSqliteTranscriptArchiveSession, r as materializeSessionStateDeletePlans, s as runSqliteTranscriptArchivePublishWorker } from "./session-accessor.sqlite-archive-C60vk-we.mjs";
import { T as withSqliteSessionDeletions, y as captureNativeSessionWorkerDeletion } from "./session-accessor.sqlite-entry-store-B3Lv6xes.mjs";
import { S as runExclusiveSessionLifecycleMutation, l as collectActiveSessionWorkAdmissions } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { a as withSessionEntryWorker, i as runSessionEntryWorkerMutation } from "./session-accessor.sqlite-replacement-worker-BpIicMPG.mjs";
import { t as readSessionActorStorageResult } from "./session-actor-storage-result-BfP7PrnB.mjs";
import { c as uniqueTranscriptArchives, s as transcriptArchiveIdentityKey } from "./session-accessor.sqlite-archive-store-kernel-D7Zd_1OC.mjs";
import "./session-accessor.sqlite-lifecycle-state-BqeRZytv.mjs";
import { c as resolveSessionReclamationDatabaseOptions, l as runExclusiveSqliteSessionReclamation, n as createSessionMaintenanceFinalizationOperation, r as createSessionMaintenanceStatisticsOperation, s as reclaimSqliteSessionInTransaction, u as prepareSessionDeletionInDatabase } from "./session-accessor.sqlite-reclamation-CdzHU4X_.mjs";
import { r as readHistoricalSessionIdsInDatabase, t as collectSessionAdmissionReferences } from "./session-history-eviction-candidates-CgN7hDVZ.mjs";
import { n as emptySessionEntryMaintenancePlan, t as applySessionEntryMaintenanceInDatabase } from "./session-accessor.sqlite-maintenance-store-CKTkTTKa.mjs";
import { i as withSqliteSessionPageReclamation, n as reclaimSqliteFreePages, r as readSqliteSessionArchivePruning, t as pruneAllSessionTranscriptArchivesToHighWater } from "./session-history-archive-pruning-CaAaXzvE.mjs";
import { n as collectReclamationDeletionEntries, r as prepareReclamationPublication, t as collectReclamationChangedSessionKeys } from "./session-accessor.sqlite-reclamation-publication-Cd995rIj.mjs";
import { n as withSqliteReclamationWorker } from "./session-accessor.sqlite-reclamation-worker-CpDhxTpI.mjs";
import { n as runSessionNativeBindingWorkerOperation, r as publishSessionLifecycleWorkerEffects } from "./session-native-binding-CM20NNGU.mjs";
import { t as emitArchivedTranscriptUpdates } from "./session-accessor.sqlite-events-B20eyHIG.mjs";
import { n as runSessionEntryWorkerOperation } from "./session-entry-patch-CSunl6ZV.mjs";
import { n as resolveMaintenanceConfig } from "./store-maintenance-runtime-Z7En5Q4b.mjs";
import { c as measureSessionPhysicalDiskUsage, n as hasRetainedSessionTranscriptArchives } from "./disk-budget-3DpjwM_1.mjs";
import fs from "node:fs";
import path from "node:path";
import { isMainThread } from "node:worker_threads";
import { setImmediate as setImmediate$1 } from "node:timers/promises";
//#region src/config/sessions/session-accessor.sqlite-reclamation-run.ts
function hasNativeReclamationOwner() {
	return !isMainThread || !isOpenClawDatabaseMaintenanceWorkerAccess() && (getOpenClawDatabaseMaintenanceScope()?.ownsSchemaMaintenance === true || hasAgentDatabaseMaintenanceAuthority());
}
async function runSessionDeletionPlanning(resolved, params, planning, assertCurrent, diagnostics) {
	const databaseOptions = toDatabaseOptions(resolved);
	if (params.expectedDatabaseIdentity !== void 0 || hasNativeReclamationOwner()) return await runExclusiveSqliteSessionWrite(resolved, async () => withSqliteSessionDatabase(databaseOptions, (database) => prepareSessionDeletionInDatabase(database, planning, params.expectedDatabaseIdentity), assertCurrent), planning.operation === "entry" ? "session.lifecycle.delete-prepare" : planning.operation === "history" ? "session.lifecycle.archive-plan" : "session.lifecycle.reclamation-plan", diagnostics);
	return await withSessionEntryWorker({
		...databaseOptions,
		path: resolved.path ?? resolveOpenClawAgentSqlitePath(databaseOptions)
	}, void 0, assertCurrent, async (execution, source) => {
		await execution.prepare(source);
		const result = await execution.runExisting(source, (worker) => worker.execute({
			type: "session.lifecycle.deletePlan",
			input: planning
		}));
		assertCurrent();
		if (!result) throw new Error("SQLite session deletion planning lost its database");
		return result;
	});
}
async function runSqliteSessionReclamation(params) {
	if (params.diagnostics) params.diagnostics.kind = params.plan.kind;
	const native = hasNativeReclamationOwner();
	if (!native && (params.plan.kind === "entry" || params.plan.kind === "lifecycle-artifacts" || params.plan.kind === "maintenance-finalize" || params.plan.kind === "lifecycle-projection-commit")) {
		const participants = captureNativeSessionWorkerDeletion(collectReclamationDeletionEntries(params.plan));
		if (participants) {
			const { deleteSessionWithNativeBindingsInWorker } = await import("./session-native-binding-XGLLrdMc.mjs");
			return deleteSessionWithNativeBindingsInWorker(params.plan, participants, () => params.assertCommitAllowed?.(), params.onWorkerResult);
		}
	}
	if (native) return await runExclusiveSqliteSessionWrite(params.plan.databaseOptions, async () => {
		if (params.plan.kind === "maintenance-plan") Object.assign(params.plan.input, params.refreshMaintenanceProtection?.());
		params.assertCommitAllowed?.();
		return await withSqliteSessionDatabase(params.plan.databaseOptions, () => {
			params.assertCommitAllowed?.();
			return reclaimSqliteSessionInTransaction(params.plan, {
				beforeMutation() {
					params.assertCommitAllowed?.();
					if (params.plan.kind === "maintenance-plan") params.assertMaintenanceCommitAllowed?.();
				},
				onCommit: (database, result) => {
					const publish = prepareReclamationPublication(params.plan, readOpenClawAgentDatabaseIdentity(database).identity, result);
					if (publish) deferOpenClawAgentPostCommitPublication(database, publish);
					params.onInProcessCommit?.(database);
				}
			});
		}, params.assertCommitAllowed);
	}, "session.reclamation.in-process", params.diagnostics);
	const maintenanceIdentity = params.plan.kind === "maintenance-plan" ? readDatabasePathIdentitySync(params.plan.databaseOptions.path) : void 0;
	return await withSqliteMutationWorkerLifetime(params.plan.databaseOptions, async ({ assertCurrent, signal }) => {
		const assertRequestCurrent = () => {
			assertCurrent();
			params.assertCommitAllowed?.();
			if (maintenanceIdentity) assertExistingDatabaseIdentity(params.plan.databaseOptions.path, maintenanceIdentity.key, maintenanceIdentity.birthtime);
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
				const { runSessionMaintenanceMetadataInWorker } = await import("./session-accessor.sqlite-maintenance-worker-BgFeonFV.mjs");
				return await runSessionMaintenanceMetadataInWorker({
					plan,
					claim,
					refreshMaintenanceProtection: params.refreshMaintenanceProtection,
					assertMaintenanceCommitAllowed: params.assertMaintenanceCommitAllowed,
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
				signal
			}), assertRequestCurrent, signal, params.plan.databaseOptions.path);
		};
		const retained = params.plan.kind === "maintenance-plan" || params.plan.kind === "maintenance-statistics" || params.plan.kind === "maintenance-age" ? void 0 : await runExclusiveSqliteSessionWrite(params.plan.databaseOptions, async () => {
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
		const execution = captureOpenClawAgentDatabaseExecution(plan.databaseOptions, maintenanceIdentity?.key.startsWith("file:") ? { expectedIdentity: {
			kind: "file",
			physicalIdentity: maintenanceIdentity.key.slice(5),
			birthtime: maintenanceIdentity.birthtime,
			nativeLocation: maintenanceIdentity.canonicalPath
		} } : void 0);
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
	const { claim, worker, assertRequestCurrent } = owner;
	const identity = claim.identity;
	const { plan } = params;
	const assertCommitAllowed = () => {
		worker.assertCurrent(plan.databaseOptions, claim);
		assertRequestCurrent();
	};
	assertCommitAllowed();
	return await worker.run({
		claim,
		validationOwner: owner.validationOwner,
		plan,
		diagnostics: params.diagnostics,
		withWriteAdmission: async (run, reclamationAdmission) => await runExclusiveSqliteSessionWrite(plan.databaseOptions, async () => {
			let refusal;
			let publishCommitted;
			try {
				assertCommitAllowed();
				publishCommitted = prepareReclamationPublication(plan, identity);
			} catch (error) {
				refusal = { error };
			}
			const completed = await run(refusal);
			if (completed) {
				const publishRemoval = plan.kind === "maintenance-finalize" || plan.kind === "lifecycle-projection-commit" ? prepareReclamationPublication(plan, identity, completed) : publishCommitted;
				const removedSessionKeys = completed.kind === "lifecycle-projection-commit" ? completed.value.removedSessionKeys : completed.kind === "maintenance-finalize" ? collectReclamationChangedSessionKeys(plan, completed) : completed.kind === "entry" && plan.kind === "entry" && completed.value.deleted ? plan.preparedTargetSnapshot.map(({ sessionKey }) => sessionKey) : [];
				publishSessionEntryWorkerInvalidations({
					agentId: plan.databaseOptions.agentId,
					storePath: owner.nativeLocation,
					databaseIdentity: identity,
					removedSessionKeys: new Set(removedSessionKeys)
				}, collectReclamationChangedSessionKeys(plan, completed), () => {
					params.onWorkerResult?.(completed, identity);
					publishSessionLifecycleWorkerEffects(plan, completed);
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
	});
}
//#endregion
//#region src/config/sessions/session-archive-publication.ts
/** Publish committed archives through the caller's canonical physical owner and live authority. */
function publishSessionStateArchivesInWorker(params) {
	const database = {
		...toDatabaseOptions(params.scope),
		path: params.scope.path
	};
	const source = readDatabasePathIdentitySync(database.path);
	const databaseIdentity = params.databaseIdentity ?? params.retainedExecution?.fileIdentity?.physicalIdentity ?? (source.key.startsWith("file:") ? source.key.slice(5) : void 0);
	if (!databaseIdentity || source.key !== `file:${databaseIdentity}`) throw new Error("Session archive publication lost its captured database identity");
	const assertCurrent = () => {
		params.assertCurrent();
		params.retainedExecution?.assertCurrent();
		assertExistingDatabaseIdentity(database.path, source.key, source.birthtime);
	};
	let nativeLocation;
	const run = (execute) => withSessionEntryWorker(database, databaseIdentity, assertCurrent, async (execution, owner) => {
		const result = await execution.runExisting(owner, async (worker) => ({ value: await execute(worker) }));
		if (!result) throw new Error("Session database disappeared before archive publication");
		const native = execution.fileIdentity;
		if (!native || native.physicalIdentity !== databaseIdentity) throw new Error("Session archive publication changed its captured native owner");
		nativeLocation = native.nativeLocation;
		assertCurrent();
		return result.value;
	}, void 0, params.retainedExecution, params.signal);
	return publishPreparedSessionStateArchives(params.requested, {
		assertCurrent,
		async prepare(requested) {
			const plans = await run((worker) => worker.execute({
				type: "session.archives.preparePublication",
				input: {
					archiveDirectory: resolveSqliteTranscriptArchiveDirectory(params.scope),
					requested
				}
			}));
			assertCurrent();
			for (const plan of plans) {
				if (plan.agentId !== database.agentId || nativeLocation === void 0 || path.resolve(plan.databasePath) !== path.resolve(nativeLocation)) throw new Error("Session archive publication changed its captured database owner");
				plan.databasePath = database.path;
				plan.databaseIdentity = databaseIdentity;
			}
			return plans;
		},
		record: (results) => run((worker) => worker.execute({
			type: "session.archives.recordPublication",
			input: {
				results,
				nowMs: Date.now()
			}
		}))
	}, params.signal);
}
async function publishPreparedSessionStateArchives(requested, storage, signal) {
	const requestedArchives = uniqueTranscriptArchives(requested);
	const requestedIdentitySet = new Set(requestedArchives.map((archive) => transcriptArchiveIdentityKey(archive.sessionId, archive.generation)));
	let includeRequested = true;
	while (true) {
		storage.assertCurrent?.();
		const requestedForPass = includeRequested ? requestedArchives : [];
		const plans = await storage.prepare(requestedForPass);
		storage.assertCurrent?.();
		includeRequested = false;
		if (plans.length === 0) break;
		const results = await runSqliteTranscriptArchivePublishWorker(plans, signal);
		storage.assertCurrent?.();
		await storage.record(results);
		storage.assertCurrent?.();
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
//#endregion
//#region src/config/sessions/session-accessor.sqlite-archive-store.ts
/** Publishes derived archive files after their canonical rows and deletions commit. */
async function publishSessionStateArchives(scope, requested, assertSourceCurrent) {
	assertSourceCurrent?.();
	const databaseOptions = resolveSessionReclamationDatabaseOptions(toDatabaseOptions(scope));
	const forceInProcess = !supportsOpenClawAgentDatabaseExecution(databaseOptions);
	return withSqliteMutationWorkerLifetime(databaseOptions, (lifetime) => {
		const { signal } = lifetime;
		const assertCurrent = () => {
			lifetime.assertCurrent();
			assertSourceCurrent?.();
		};
		return withSqliteTranscriptArchiveSession(databaseOptions, async () => {
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
			if (!forceInProcess) return publishSessionStateArchivesInWorker({
				scope: {
					...scope,
					path: databaseOptions.path
				},
				requested,
				assertCurrent,
				signal
			});
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
		});
	});
}
/** Removes canonical rows only after retention has removed their derived files. */
async function prunePublishedSessionArchivesByRetention(params) {
	const rules = new Map(params.rules.filter((rule) => Number.isFinite(rule.olderThanMs) && rule.olderThanMs >= 0).map((rule) => [rule.reason, rule.olderThanMs]));
	if (rules.size === 0) return 0;
	return withSqliteSessionPageReclamation(toDatabaseOptions(params.scope), async (_reclaim, assertCurrent, _options, archives) => {
		const now = params.nowMs ?? Date.now();
		const archiveDirectory = resolveSqliteTranscriptArchiveDirectory(params.scope);
		let removed = 0;
		let offset = 0;
		while (true) {
			const candidates = await archives.readRetentionCandidates(offset);
			assertCurrent();
			if (candidates.length === 0) break;
			const removable = candidates.filter((row) => {
				const olderThanMs = rules.get(row.reason);
				if (olderThanMs === void 0 || now - row.created_at <= olderThanMs) return false;
				const archivePath = path.resolve(archiveDirectory, row.archive_name);
				return path.dirname(archivePath) === path.resolve(archiveDirectory) && path.basename(archivePath) === row.archive_name && !fs.existsSync(archivePath);
			});
			let removedFromPage = 0;
			for (let batch = 0; batch < removable.length; batch += 16) {
				if (batch > 0) await setImmediate$1();
				removedFromPage += await archives.withWriter(() => {
					assertCurrent();
					return archives.pruneRetention({
						candidates: removable.slice(batch, batch + 16),
						archiveDirectory
					});
				});
			}
			removed += removedFromPage;
			offset += candidates.length - removedFromPage;
			if (candidates.length < 256) break;
		}
		return removed;
	});
}
//#endregion
//#region src/config/sessions/session-maintenance-finalization.ts
function readSessionMaintenanceArchiveSizesInWorker(database, sessionIds, execution, assertCurrent) {
	return withSessionEntryWorker(database, void 0, assertCurrent, async (owner, source) => {
		const result = await owner.runExisting(source, (worker) => worker.execute({
			type: "session.maintenance.size",
			input: { sessionIds }
		}));
		if (!result) throw new Error("Session database disappeared before maintenance sizing");
		return result;
	}, void 0, execution);
}
async function refreshSessionMaintenanceStatisticsInWorker(database, execution, assertCurrent) {
	execution.assertCurrent();
	const identity = execution.fileIdentity;
	if (!identity) throw new Error("Session maintenance lost its admitted database");
	await runSessionEntryWorkerMutation(database, identity.physicalIdentity, assertCurrent, (worker) => worker.execute({
		type: "session.maintenance.metadata",
		input: { kind: "maintenance-statistics" }
	}), { identityAgentId: database.agentId }, { retainedExecution: execution });
}
/** Keep cleanup admission and participant settlement on the caller's original executor. */
function finalizeSessionMaintenanceInWorker(plan, execution, assertCurrent) {
	const entries = collectReclamationDeletionEntries(plan);
	const captured = captureNativeSessionWorkerDeletion(entries);
	const operation = {
		database: plan.databaseOptions,
		agentId: plan.agentId,
		retainedExecution: execution,
		assertCurrent,
		candidateKind: "session-maintenance-finalize",
		onCommitted(candidate, _published, identity) {
			prepareReclamationPublication(plan, identity, candidate.result)?.();
			return candidate.result;
		}
	};
	return captured ? runSessionNativeBindingWorkerOperation({
		...operation,
		captured,
		entries,
		execute: (worker, nativeBindings) => worker.execute({
			type: "session.maintenance.finalize",
			input: {
				plan,
				nativeBindings
			}
		})
	}) : runSessionEntryWorkerOperation({
		...operation,
		run: (worker, commit) => commit(() => worker.execute({
			type: "session.maintenance.finalize",
			input: { plan }
		}))
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
	if (captureSessionActorStorageOwner({
		...scope,
		storePath: scope.path
	}, {
		assertCurrent() {},
		authorize() {}
	})) return;
	const storePath = resolveOpenClawAgentSqlitePath(toDatabaseOptions(scope));
	const active = plannerMaintenanceByStore.get(storePath);
	if (active) {
		await active;
		return;
	}
	const assertCurrent = () => {
		options.retainedExecution?.assertCurrent();
		if (!isCurrent()) throw new Error("SQLite maintenance planner owner retired");
	};
	const completion = (options.retainedExecution ? refreshSessionMaintenanceStatisticsInWorker(resolveSessionReclamationDatabaseOptions(toDatabaseOptions(scope)), options.retainedExecution, assertCurrent) : runSqliteSessionReclamation({
		diagnostics: { kind: "maintenance-statistics" },
		assertCommitAllowed: assertCurrent,
		plan: createSessionMaintenanceStatisticsOperation(toDatabaseOptions(scope))
	})).then(() => void 0).catch((error) => {
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
async function readSessionTranscriptJsonlBytes(scope, sessionIds, isCurrent, retainedExecution) {
	const bytesBySessionId = /* @__PURE__ */ new Map();
	const options = resolveSessionReclamationDatabaseOptions(toDatabaseOptions(scope));
	for (let offset = 0; offset < sessionIds.length; offset += SESSION_TRANSCRIPT_BYTE_QUERY_BATCH) {
		const batch = sessionIds.slice(offset, offset + SESSION_TRANSCRIPT_BYTE_QUERY_BATCH);
		await new Promise((resolve) => {
			setImmediate(resolve);
		});
		if (!isCurrent()) return bytesBySessionId;
		let sized;
		if (retainedExecution) sized = await readSessionMaintenanceArchiveSizesInWorker(options, batch, retainedExecution, () => {
			retainedExecution.assertCurrent();
			if (!isCurrent()) throw new Error("SQLite automatic maintenance owner retired");
		});
		else {
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
	if (!params.preservation) return emptySessionEntryMaintenancePlan();
	const maintenance = params.maintenanceConfig ? normalizeResolvedMaintenanceConfigInput(params.maintenanceConfig) : resolveMaintenanceConfig();
	if (maintenance.mode === "warn") return emptySessionEntryMaintenancePlan();
	return applySessionEntryMaintenanceInDatabase(database, {
		...params,
		maintenance
	}, params.preservation, void 0, params.refreshCandidates);
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
	const authority = {
		assertCurrent() {
			if (!isCurrent()) throw new Error("Session maintenance owner retired");
		},
		authorize() {}
	};
	const memory = captureSessionActorStorageOwner({
		...scope,
		storePath: scope.path
	}, authority);
	if (memory) {
		const owner = memory.owner;
		if (!owner || entryRemovals.length === 0) return emptyResult();
		try {
			if (stateDeletePlans.some((plan) => plan.archiveTranscript)) throw new Error("Incognito session maintenance cannot archive transcripts");
			const first = owner.listSessionEntries(memory.authority, "list")[0];
			if (!first) return emptyResult();
			const actor = await owner.acquireExisting(first.sessionKey, {
				assertCurrent: () => authority.assertCurrent(),
				assertReadable: () => authority.assertCurrent()
			});
			if (!actor) return emptyResult();
			try {
				const entries = entryRemovals.flatMap(({ expectedEntry, sessionKey }) => expectedEntry ? [{
					sessionKey,
					entry: expectedEntry
				}] : []);
				const removed = await withSqliteSessionDeletions({
					...scope,
					agentId: memory.agentId,
					path: memory.path
				}, entries, async (assertDeletionCurrent, capture) => {
					let settlement;
					const outcome = await actor.storage.mutate({
						type: "session.lifecycle.reclaim",
						input: { entries: entries.map(({ sessionKey, entry }) => ({
							sessionKey,
							expected: entry
						})) }
					}, {
						...memory.authority,
						assertCurrent() {
							memory.authority.assertCurrent();
							assertDeletionCurrent();
						}
					}, { beforeCommit(receipt) {
						const removedKeys = new Set(receipt.value.removedSessionKeys);
						settlement = capture(entries.filter(({ sessionKey }) => removedKeys.has(sessionKey)));
						settlement.beforeCommit();
					} });
					settlement?.settle(outcome.kind);
					const result = readSessionActorStorageResult(outcome);
					return new Set(result.removedSessionKeys);
				}, { memory: owner });
				for (const removal of entryRemovals) {
					if (!removed.has(removal.sessionKey)) continue;
					if (removal.maintenanceReason === "model-run-pruned") committedCounts.modelRunPruned += 1;
					else if (removal.maintenanceReason === "pruned") committedCounts.pruned += 1;
					else if (removal.maintenanceReason === "capped") committedCounts.capped += 1;
				}
			} finally {
				await actor.release();
			}
		} catch (error) {
			warn("Memory session maintenance cleanup failed", error, stateDeletePlans);
		}
		return emptyResult();
	}
	if (entryRemovals.length === 0 && stateDeletePlans.length === 0) {
		await refreshSqliteSessionPlannerStatisticsBestEffort(scope, options.deletedEntriesBeforeMaintenance ?? 0, {
			isCurrent,
			retainedExecution: options.retainedExecution
		});
		return emptyResult();
	}
	let archiveBytesBySessionId;
	try {
		archiveBytesBySessionId = await readSessionTranscriptJsonlBytes(scope, stateDeletePlans.filter((plan) => plan.archiveTranscript).map((plan) => plan.sessionId), isCurrent, options.retainedExecution);
	} catch (error) {
		warn("SQLite session maintenance archive sizing failed", error, stateDeletePlans);
		await refreshSqliteSessionPlannerStatisticsBestEffort(scope, options.deletedEntriesBeforeMaintenance ?? 0, {
			isCurrent,
			retainedExecution: options.retainedExecution
		});
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
		let removalOutcomes = [];
		let changedEntryRemovals;
		let committedEntryRemovals;
		try {
			const materializedPlans = await materializeSessionStateDeletePlans(batch.stateDeletePlans);
			if (!isCurrent()) break;
			const result = await withSqliteSessionDeletions(scope, batch.entryRemovals.flatMap(({ expectedEntry: entry, sessionKey }) => entry ? [{
				entry,
				sessionKey
			}] : []), async (assertCurrent) => {
				const assertCommitAllowed = () => {
					options.retainedExecution?.assertCurrent();
					assertCurrent();
					if (!isCurrent()) throw new Error("SQLite automatic maintenance owner retired");
				};
				removalOutcomes = batch.entryRemovals.map(({ sessionKey, maintenanceReason }) => ({
					sessionKey,
					maintenanceReason
				}));
				const plan = createSessionMaintenanceFinalizationOperation({
					agentId: scope.agentId,
					databaseOptions: toDatabaseOptions(scope),
					entries: batch.entryRemovals,
					materializedPlans
				});
				return options.retainedExecution ? finalizeSessionMaintenanceInWorker(plan, options.retainedExecution, assertCommitAllowed) : runSqliteSessionReclamation({
					diagnostics: { kind: "maintenance-finalize" },
					assertCommitAllowed,
					plan
				});
			});
			if (result.kind !== "maintenance-finalize") throw new Error("SQLite maintenance returned another operation's result");
			archivedTranscripts = result.value.archivedTranscripts;
			const committedIndices = new Set(result.value.committedEntryIndices);
			changedEntryRemovals = removalOutcomes.filter((_, index) => !committedIndices.has(index));
			committedEntryRemovals = result.value.committedEntryIndices.map((index) => expectDefined(removalOutcomes[index], "Missing committed maintenance entry"));
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
			publishedTranscripts.push(...await (options.publishArchives ? options.publishArchives(archivedTranscripts) : publishSessionStateArchives(scope, archivedTranscripts)));
		} catch (error) {
			warn("SQLite session maintenance archive publication failed", error, batch.stateDeletePlans);
		}
	}
	if (isCurrent()) await refreshSqliteSessionPlannerStatisticsBestEffort(scope, deletedEntries, {
		isCurrent,
		retainedExecution: options.retainedExecution
	});
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
		...params.walBytesAfter !== void 0 ? { walBytesAfter: params.walBytesAfter } : {},
		...params.deferred ? {
			deferredReason: "checkpoint-incomplete",
			...params.deferred
		} : {}
	};
}
const PHYSICAL_BUDGET_CHECK_INTERVAL_MS = 18e5;
const FORCED_PHYSICAL_BUDGET_CHECK_INTERVAL_MS = 6e4;
const budgetKickStateByStore = /* @__PURE__ */ new Map();
/** Per-agent legacy and SQLite locators share one lane; custom stores can aggregate partitions. */
function sessionHistoryBudgetStoreKey(storePath) {
	const target = resolveUnsuffixedSqliteTargetFromSessionStorePath(storePath);
	return sqliteReaderDatabasePathKey(target.agentId ? target.path : storePath);
}
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
	state.protected = void 0;
	state.checkpointGate ??= {
		databasePath: sqliteReaderDatabasePathKey(databasePath),
		afterNs: checkpoint?.observedAtNs ?? process.hrtime.bigint(),
		completedAtNs: 0n
	};
	state.checkpointBlocked = {
		checkpoint,
		warned: state.checkpointBlocked?.warned
	};
}
function getBudgetKickState(storePath, budget) {
	const key = sessionHistoryBudgetStoreKey(storePath);
	let state = budgetKickStateByStore.get(key);
	if (!state) {
		state = {
			budget,
			lastCheckAt: -Infinity,
			lastForcedCheckAt: -Infinity,
			running: false
		};
		budgetKickStateByStore.set(key, state);
	} else if (state.budget.maxDiskBytes !== budget.maxDiskBytes || state.budget.highWaterBytes !== budget.highWaterBytes || state.budget.preserveRecentMs !== budget.preserveRecentMs) {
		state.budget = budget;
		state.lastCheckAt = -Infinity;
		state.lastForcedCheckAt = -Infinity;
		state.blockedUntil = void 0;
		state.protected = void 0;
	}
	return state;
}
function recordPhysicalBudgetOutcome(params, result) {
	if (params.mode !== "enforce" || !result) return;
	const state = getBudgetKickState(params.storePath, params.maintenance);
	if (result.deferredReason) {
		state.protected = void 0;
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
	state.checkpointBlocked = void 0;
	if (result.totalBytesAfter <= result.maxBytes) {
		state.blockedUntil = void 0;
		state.protected = void 0;
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
	state.protected = result.removedEntries === 0 && result.removedFiles === 0 && result.freedBytes === 0;
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
	return inspectSessionHistoryDiskBudget(input, false);
}
async function inspectSessionHistoryDiskBudget(input, physicalReclamation) {
	if (resolveExplicitIncognitoAgentSqliteTarget(input.storePath, { agentId: input.agentId })) return {
		diskBudget: null,
		wouldMutate: false
	};
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
		highWaterBytes,
		walBytesAfter: usage.databaseWalBytes
	});
	if (!diskBudget.overBudget || params.mode !== "enforce") return {
		diskBudget,
		wouldMutate: false
	};
	const blocked = getBudgetKickState(params.storePath, params.maintenance).checkpointBlocked;
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
	const pruning = await readSqliteSessionArchivePruning(databaseOptions);
	if ((pruning?.archives.length ?? 0) > 0 || physicalReclamation && ((pruning?.freePages ?? 0) > 0 || usage.databaseWalBytes > 0) || await hasRetainedSessionTranscriptArchives(params.storePath)) return {
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
/** Session ids owned by live runs or work admissions, without durable-reference protection. */
function collectAdmissionProtectedSessionIds(params) {
	return collectSessionAdmissionReferences({
		database: params.database,
		admissionIdentities: [...collectActiveSessionWorkAdmissions().get(params.storePath) ?? [], ...iterateProjectedAgentRunSessionKeys(buildProjectedAgentRunIndex())]
	});
}
async function readHistoricalSessionIds(params) {
	const input = {
		admissionIdentities: [...collectActiveSessionWorkAdmissions().get(params.storePath) ?? [], ...iterateProjectedAgentRunSessionKeys(buildProjectedAgentRunIndex())],
		preserveRecentMs: params.preserveRecentMs
	};
	if (params.reclamationMode === "in-process") return readHistoricalSessionIdsInDatabase({
		...input,
		database: openOpenClawAgentDatabase(params.databaseOptions)
	});
	return withSessionHistoryWorkerDatabase(params.databaseOptions, (owner) => owner.readHistoricalEvictionCandidates({
		...input,
		env: params.databaseOptions.env ?? process.env
	}), maintenanceLane);
}
async function readDiskEvictableArchivedSessionBatch({ databaseOptions, ...query }) {
	const archived = {
		...query,
		liveSessionKeys: [...iterateProjectedAgentRunSessionKeys(buildProjectedAgentRunIndex())]
	};
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
function assertSessionHistoryIdle(sessionKey) {
	if (sessionKey && resolveProjectedAgentRunProgressState({ sessionKeys: [sessionKey] })) throw new Error("Session became active; history eviction was canceled");
}
function isSessionHistoryAdmitted(storePath, sessionId, sessionKey) {
	const ownerKey = sessionKey === null ? null : normalizeStoreSessionKey(sessionKey);
	return [...collectActiveSessionWorkAdmissions().get(storePath) ?? [], ...iterateProjectedAgentRunSessionKeys(buildProjectedAgentRunIndex())].some((identity) => identity === sessionId || ownerKey !== null && normalizeStoreSessionKey(identity) === ownerKey);
}
/** Fire-and-forget budget pass from the ordinary entry-write maintenance seam. */
function kickSessionHistoryDiskBudgetMaintenance(input) {
	if (resolveExplicitIncognitoAgentSqliteTarget(input.storePath, { agentId: input.agentId })) return;
	const maintenance = input.maintenanceConfig ?? resolveMaintenanceConfig();
	if (maintenance.mode !== "enforce" || maintenance.maxDiskBytes == null || maintenance.highWaterBytes == null) return;
	const now = input.now ?? Date.now();
	const state = getBudgetKickState(input.storePath, maintenance);
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
	runSessionHistoryDiskBudgetMaintenance({
		...params.agentId ? { agentId: params.agentId } : {},
		env: params.env,
		storePath: params.storePath,
		mode: maintenance.mode,
		maintenance
	}, true).catch((error) => {
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
	return runSessionHistoryDiskBudgetMaintenance(input, false);
}
async function runSessionHistoryDiskBudgetMaintenance(input, automatic) {
	if (resolveExplicitIncognitoAgentSqliteTarget(input.storePath, { agentId: input.agentId })) return null;
	const params = {
		...input,
		env: { ...input.env ?? process.env }
	};
	params.env.OPENCLAW_STATE_DIR = resolveStateDir(params.env);
	const candidates = params.mode === "enforce" && params.maintenance.maxDiskBytes != null && params.maintenance.highWaterBytes != null ? captureSessionStoreReadCandidates(params.storePath) : [];
	const identities = captureSessionStoreCandidateIdentities(candidates);
	return await runQueuedStoreWrite({
		queues: SESSION_HISTORY_MAINTENANCE_QUEUES,
		storePath: sessionHistoryBudgetStoreKey(params.storePath),
		label: "enforceSqliteSessionHistoryDiskBudget",
		fn: async () => {
			try {
				if (automatic && getBudgetKickState(params.storePath, params.maintenance).protected) {
					const preview = await inspectSessionHistoryDiskBudget(params, true);
					if (!preview.wouldMutate) {
						recordPhysicalBudgetOutcome(params, preview.diskBudget);
						return preview.diskBudget;
					}
				}
				const result = await enforceSessionHistoryMaintenanceSerialized(params, {
					candidates,
					identities
				});
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
async function enforceSessionHistoryMaintenanceSerialized(params, source) {
	const { highWaterBytes, maxDiskBytes } = params.maintenance;
	if (maxDiskBytes == null || highWaterBytes == null) return null;
	const initialUsage = await measureSessionPhysicalDiskUsage(params.storePath);
	if (initialUsage.totalBytes <= maxDiskBytes || params.mode === "warn") return createPhysicalBudgetResult({
		totalBytesBefore: initialUsage.totalBytes,
		maxBytes: maxDiskBytes,
		highWaterBytes,
		walBytesAfter: initialUsage.databaseWalBytes
	});
	const resolved = captureLifecycleDatabaseScope(resolveSqliteScope({
		...params.agentId ? { agentId: params.agentId } : {},
		env: params.env,
		sessionKey: "",
		storePath: params.storePath
	}));
	const physicalPath = assertSessionStoreReadCandidate(resolved.path, source.candidates);
	const expectedIdentity = source.identities.get(physicalPath);
	if (!expectedIdentity) throw new Error("SQLite history cleanup target was not captured before measurement");
	assertDatabasePathIdentity(resolved.path, expectedIdentity);
	return await withSqliteTranscriptArchiveSession(toDatabaseOptions(resolved), () => enforceSessionHistoryMaintenanceForDatabase(params, initialUsage, resolved, highWaterBytes, maxDiskBytes, expectedIdentity));
}
async function enforceSessionHistoryMaintenanceForDatabase(params, initialUsage, resolved, highWaterBytes, maxDiskBytes, expectedIdentity) {
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
		assertDatabasePathIdentity(databasePath, expectedIdentity);
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
	let deletedSessionEntries = 0;
	const finish = () => createPhysicalBudgetResult({
		totalBytesBefore: initialUsage.totalBytes,
		totalBytesAfter: usage.totalBytes,
		removedEntries,
		removedFiles,
		maxBytes: maxDiskBytes,
		highWaterBytes,
		walBytesAfter: usage.databaseWalBytes,
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
				await runExclusiveSqliteSessionWrite(resolved, async () => assertDatabasePathIdentity(databasePath, expectedIdentity), "session.history.eviction-prepare");
				return await runExclusiveSqliteSessionReclamation(async () => {
					assertDatabasePathIdentity(databasePath, expectedIdentity);
					const plan = await materializeSessionHistoryEvictionPlan({
						agentId: databaseOptions.agentId,
						archiveDirectory,
						archiveTranscript: true,
						databasePath,
						reason: "deleted",
						sessionId,
						historyEviction: {
							expectedIdentity,
							preserveRecentMs: params.maintenance.preserveRecentMs
						}
					});
					assertDatabasePathIdentity(databasePath, expectedIdentity);
					if (!plan || isSessionHistoryAdmitted(params.storePath, sessionId, plan.snapshot.sessionKey)) return null;
					const diagnostics = {};
					const reclamationPlan = {
						databaseOptions: resolveSessionReclamationDatabaseOptions(databaseOptions),
						diskBudget: { preserveRecentMs: params.maintenance.preserveRecentMs },
						kind: "history-eviction",
						materializedPlans: [plan],
						protectedSessionIds: [],
						sessionId
					};
					const reclaimed = await runSqliteSessionReclamation({
						diagnostics,
						assertCommitAllowed: () => {
							assertDatabasePathIdentity(databasePath, expectedIdentity);
							if (isSessionHistoryAdmitted(params.storePath, sessionId, plan.snapshot.sessionKey)) throw new Error("Session became active; history eviction was canceled");
						},
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
		assertDatabasePathIdentity(databasePath, expectedIdentity);
		const publishedArchives = await publishSessionStateArchives(resolved, eviction.archivedTranscripts, () => assertDatabasePathIdentity(databasePath, expectedIdentity));
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
						const { deleteDiskBudgetSessionEntryLifecycle } = await import("./session-accessor.sqlite-lifecycle-I5S5QLRh.mjs");
						return await deleteDiskBudgetSessionEntryLifecycle({
							...params.agentId ? { agentId: params.agentId } : {},
							archiveTranscript: false,
							deleteDeliveryArtifacts: true,
							deleteTranscriptWithoutArchive: true,
							commitGuard: () => assertSessionHistoryIdle(candidate.sessionKey),
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
				deletedSessionEntries += 1;
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
		await refreshSqliteSessionPlannerStatisticsBestEffort(resolved, deletedSessionEntries);
		usage = await measureSessionPhysicalDiskUsage(params.storePath);
	}
	return finish();
}
//#endregion
export { applySessionEntryMaintenance as a, prunePublishedSessionArchivesByRetention as c, runSessionDeletionPlanning as d, runSqliteSessionReclamation as f, kickSessionHistoryDiskBudgetMaintenance as i, publishSessionStateArchives as l, enforceSqliteSessionHistoryDiskBudget as n, finalizeSessionEntryMaintenancePlansAfterWriterReleaseBestEffort as o, inspectSqliteSessionHistoryDiskBudget as r, refreshSqliteSessionPlannerStatisticsBestEffort as s, collectAdmissionProtectedSessionIds as t, publishSessionStateArchivesInWorker as u };
