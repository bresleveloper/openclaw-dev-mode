import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { r as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { s as sqliteReaderDatabasePathKey } from "./sqlite-reader-lifecycle-Cw11HwJP.mjs";
import { c as closeOpenClawStateDatabaseByPath } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { r as onSqliteWalCheckpoint } from "./sqlite-wal-checkpoint-CgnAfdqs.mjs";
import { d as withSqliteWorkerOperationAdmissionAsync } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { a as readOpenClawAgentDatabaseIdentity, n as createOpenClawAgentDatabaseClaim } from "./openclaw-agent-db-identity-CnM2kzVa.mjs";
import { s as assertOpenClawAgentDatabaseLease } from "./openclaw-agent-db-lease-Brvd0WI4.mjs";
import { S as recordOpenClawAgentCanonicalValidation, c as getOpenClawAgentDatabaseValidation, g as markOpenClawAgentCanonicalValidation } from "./openclaw-agent-db-validation-cache-9WCf6XyJ.mjs";
import { b as settleOpenClawAgentDatabaseWorkerClose, p as readOpenClawAgentDatabaseWorkerLeaseReceipt } from "./openclaw-agent-db-lifecycle-Dodvmz4L.mjs";
import { a as withFreshOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-open-DcexysGa.mjs";
import { c as runOpenClawAgentWriteTransaction, l as withOpenClawAgentDatabaseAdmission, t as borrowOpenClawAgentDatabase } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { t as runWithSqliteMutationWorkerCoordination } from "./session-accessor.sqlite-worker-coordination-VYaqe2BP.mjs";
import { i as waitForSqliteReclamationCommit, n as markSqliteReclamationSettled, t as SqliteReclamationRequestRefusedError } from "./session-accessor.sqlite-reclamation-commit-DnAU8RAC.mjs";
import { n as scheduleWorkerIdleGc, t as cancelWorkerIdleGc } from "./worker-idle-gc-DrnCHdyX.mjs";
import { n as prepareSessionColdSourceGuard, t as SessionColdSourceRefusedError } from "./session-cold-storage-source-guard.worker-CKWg0m5n.mjs";
import { MessagePort } from "node:worker_threads";
import { on, once } from "node:events";
//#region src/config/sessions/session-accessor.sqlite-worker-admission.runtime.ts
function withWorkerWriteAdmission(port, operationId, databaseOptions, operation, assertSourceCurrent) {
	let finalAdmission = false;
	const withAdmission = async (run) => {
		const admission = await new Promise((resolve, reject) => {
			const receive = (admissionMessage) => {
				cleanup();
				resolve(admissionMessage);
			};
			const closed = () => {
				cleanup();
				reject(/* @__PURE__ */ new Error("SQLite reclamation parent closed during database admission"));
			};
			const cleanup = () => {
				port.off("message", receive);
				port.off("close", closed);
			};
			port.on("message", receive);
			port.once("close", closed);
			port.postMessage({
				type: "admission-request",
				operationId
			});
		});
		const invoke = () => run(() => {
			if (!admission.allowed) throw new SqliteReclamationRequestRefusedError("SQLite reclamation database admission was revoked");
			assertSourceCurrent?.();
		}, admission.validation, admission.integrityRevoked);
		const metadata = admission.databaseAdmissionPort;
		const value = await (async () => {
			try {
				return metadata instanceof MessagePort ? await withSqliteWorkerOperationAdmissionAsync({ port: metadata }, invoke) : await invoke();
			} finally {
				metadata?.close();
			}
		})();
		if (!finalAdmission) port.postMessage({
			type: "admission-release",
			operationId
		});
		return value;
	};
	return withOpenClawAgentDatabaseAdmission(databaseOptions, withAdmission, (database) => {
		finalAdmission = true;
		return operation(database);
	});
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-mutation-worker.runtime.ts
function settleReclamationDatabase(pathname) {
	const outcome = settleOpenClawAgentDatabaseWorkerClose(pathname);
	return {
		cleanupWarnings: outcome.errors.map((error) => error.message),
		settled: outcome.settled
	};
}
function throwReclamationFailure(error, cleanup, commitGate) {
	if (!cleanup.settled) throw new AggregateError([error, ...cleanup.cleanupWarnings.map((warning) => new Error(warning))], "SQLite session reclamation failed and Worker cleanup is incomplete; restart OpenClaw before deleting the owning agent", { cause: error });
	markSqliteReclamationSettled(commitGate);
	throw error;
}
async function runColdMutationWorkerPort(port, data) {
	const [request] = await once(port, "message");
	if (request.type !== "mutate") throw new Error("SQLite cold mutation Worker received invalid admission");
	const response = await runWithSqliteMutationWorkerCoordination(request.coordination, data.plan.databaseOptions, (databaseOptions) => runColdMutationWorker(port, {
		...data,
		plan: {
			...data.plan,
			databaseOptions
		}
	}));
	port.postMessage(response);
	port.close();
}
async function runColdMutationWorker(port, data) {
	try {
		var _usingCtx$1 = _usingCtx();
		const { mutateSessionColdTranscriptInWorker, prepareSessionColdRestoreInWorker } = await import("./session-cold-storage-worker-BfyDy4H0.mjs");
		const coldRecords = data.plan.kind === "cold-restore" ? await prepareSessionColdRestoreInWorker(data.plan) : void 0;
		const sourceGuard = _usingCtx$1.u(prepareSessionColdSourceGuard(data.plan.databaseOptions, data.plan.kind === "cold-restore" ? data.plan.guard?.sources : void 0, data.sourceMatches));
		const commitGate = data.commitGate;
		let result;
		let validation;
		try {
			result = await withWorkerWriteAdmission(port, 0, data.plan.databaseOptions, async (openedDatabase) => {
				let transactionDatabase;
				try {
					return mutateSessionColdTranscriptInWorker(data.plan, coldRecords, (database, sourceValidation) => {
						transactionDatabase = database.db;
						for (const { index, matches } of data.sourceMatches ?? []) {
							const match = sourceValidation?.conversationMatches.find((value) => value.index === index);
							if (!match) throw new Error("Cold restoration omitted its source alternatives");
							for (const alternative of match.alternatives) Atomics.store(matches, alternative + 1, 1);
							Atomics.store(matches, 0, 1);
						}
						waitForSqliteReclamationCommit(commitGate, () => port.postMessage({
							type: "commit-request",
							operationId: 0
						}));
					}, sourceGuard);
				} catch (error) {
					if (error instanceof SessionColdSourceRefusedError) return {
						archivedTranscripts: 0,
						externalizedTranscripts: 0,
						restored: false,
						refusedSource: error.refusal
					};
					throw error;
				} finally {
					validation = getOpenClawAgentDatabaseValidation(openedDatabase);
					if (transactionDatabase && (!transactionDatabase.isOpen || !transactionDatabase.isTransaction)) markSqliteReclamationSettled(commitGate);
				}
			});
		} catch (error) {
			throwReclamationFailure(error, settleReclamationDatabase(data.plan.databaseOptions.path), commitGate);
		}
		const cleanup = settleReclamationDatabase(data.plan.databaseOptions.path);
		return {
			type: "reclaimed",
			operationId: 0,
			result: {
				result,
				...cleanup.cleanupWarnings.length > 0 ? { cleanupWarnings: cleanup.cleanupWarnings } : {},
				...!cleanup.settled ? { cleanupIncomplete: true } : {}
			},
			settled: true,
			validation: cleanup.settled ? validation : void 0
		};
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
}
async function runReclamationWorkerPort(port, databaseOptions, pooledTask) {
	let reclaimSqliteSessionInTransaction;
	let claim;
	let retainedDatabase;
	let lease;
	let operationId = pooledTask?.operationId ?? 0;
	let failureCleanup;
	let checkpointResultOwnedByRequest = false;
	const checkpointPath = sqliteReaderDatabasePathKey(databaseOptions.path);
	const stopCheckpointRelay = onSqliteWalCheckpoint(({ databasePath, ...snapshot }) => {
		if (!checkpointResultOwnedByRequest && databasePath === checkpointPath && claim?.isCurrent()) port.postMessage({
			type: "checkpoint",
			operationId,
			snapshot
		});
	});
	const closeDatabase = () => {
		checkpointResultOwnedByRequest = false;
		const cleanup = settleReclamationDatabase(databaseOptions.path);
		claim?.release();
		claim = void 0;
		return cleanup;
	};
	try {
		for await (const [message] of on(port, "message")) {
			const request = message;
			if (request.type === "admission") continue;
			cancelWorkerIdleGc();
			operationId = request.operationId;
			if (pooledTask) pooledTask.operationId = operationId;
			failureCleanup = void 0;
			const response = await runWithSqliteMutationWorkerCoordination(request.coordination, databaseOptions, async (options) => {
				if (request.type === "close") {
					const cleanup = closeDatabase();
					if (pooledTask) {
						if (!cleanup.settled) throw new Error("Canonical validation task could not close its agent database");
						closeOpenClawStateDatabaseByPath(request.coordination.databasePath);
					}
					return {
						type: "closed",
						...cleanup
					};
				}
				try {
					claim?.assertCurrent();
					if (request.type === "reclaim") ({reclaimSqliteSessionInTransaction} = await import("./session-accessor.sqlite-reclamation-BLCYX_Sp.mjs"));
					const canonical = request.type === "canonical-validation" ? await import("./session-canonical-validation-BPatnJHc.mjs") : void 0;
					let prepared;
					if (canonical && request.type === "canonical-validation" && !request.initializeCanonicalValidation) {
						const prepare = (database) => {
							const batch = canonical.readPendingCanonicalSessionValidationBatch(database, request);
							return canonical.validateCanonicalSessionValidationBatch(batch);
						};
						if (retainedDatabase) prepared = prepare({
							agentId: options.agentId,
							db: retainedDatabase
						});
						else {
							const opened = withFreshOpenClawAgentDatabaseReadOnly(prepare, options);
							if (!opened.found) throw new Error(`Cannot validate canonical sessions: ${opened.reason}`);
							prepared = opened.value;
						}
					}
					const assertExpectedSource = request.type === "prepare" ? () => assertExistingDatabaseIdentity(options.path, request.expectedSource.key, request.expectedSource.birthtime) : void 0;
					let validation;
					const result = await withWorkerWriteAdmission(port, operationId, options, (database) => {
						const nativeIdentity = readOpenClawAgentDatabaseIdentity(database);
						const openedForRequest = !claim;
						if (!claim) {
							const borrowed = borrowOpenClawAgentDatabase(options);
							claim = createOpenClawAgentDatabaseClaim(database, borrowed.release);
							retainedDatabase = database.db;
							lease = readOpenClawAgentDatabaseWorkerLeaseReceipt(options.path);
							port.postMessage({
								type: "lease",
								receipt: lease
							});
						}
						claim.assertCurrent();
						const currentClaim = claim;
						if (retainedDatabase !== database.db || !lease) throw new Error("SQLite session reclamation database owner is no longer current");
						assertOpenClawAgentDatabaseLease(lease.leaseId, options);
						if (request.type === "prepare" && (typeof nativeIdentity.identity !== "string" || `file:${nativeIdentity.identity}` !== request.expectedSource.key || request.expectedSource.birthtime !== void 0 && nativeIdentity.birthtime !== request.expectedSource.birthtime)) throw new Error("SQLite reclamation native source differs from its opening expectation");
						try {
							if (request.type === "prepare") {
								if (typeof nativeIdentity.identity !== "string") throw new Error("SQLite reclamation requires an admitted file source");
								return {
									source: {
										...nativeIdentity,
										identity: nativeIdentity.identity
									},
									validation: getOpenClawAgentDatabaseValidation(database)
								};
							}
							checkpointResultOwnedByRequest = request.type === "reclaim" && request.plan.kind === "maintenance-pages";
							const reclaimed = request.type === "canonical-validation" ? runOpenClawAgentWriteTransaction((transactionDatabase) => {
								currentClaim.assertCurrent();
								if (!canonical) throw new Error("Canonical validation lost its prepared batch");
								const counts = {
									validatedRows: 0,
									certifiedRows: 0,
									oversizedRows: 0
								};
								if (request.initializeCanonicalValidation) canonical.seedCanonicalSessionValidation(transactionDatabase);
								else {
									if (!prepared) throw new Error("Canonical validation lost its prepared batch");
									counts.certifiedRows = canonical.compareAndCertifyCanonicalSessionValidationBatch(transactionDatabase, prepared);
									counts.validatedRows = prepared.rows.length;
									counts.oversizedRows = prepared.oversizedRows;
								}
								const hasMore = canonical.hasPendingCanonicalSessionValidation(transactionDatabase);
								if (!hasMore) {
									recordOpenClawAgentCanonicalValidation(transactionDatabase);
									if (!markOpenClawAgentCanonicalValidation(transactionDatabase)) throw new Error("Canonical validation lost its admitted owner");
								}
								return {
									validatedRows: counts.validatedRows,
									certifiedRows: counts.certifiedRows,
									hasMore,
									oversizedRows: counts.oversizedRows
								};
							}, options, { operationLabel: "session.canonical-validation.certify" }) : reclaimSqliteSessionInTransaction({
								...request.plan,
								databaseOptions: options
							}, { beforeMutation: currentClaim.assertCurrent });
							if (openedForRequest) validation = getOpenClawAgentDatabaseValidation(database);
							return reclaimed;
						} finally {
							checkpointResultOwnedByRequest = false;
							clearNodeSqliteKyselyCacheForDatabase(database.db);
						}
					}, assertExpectedSource);
					return {
						type: "reclaimed",
						operationId,
						result,
						settled: true,
						validation
					};
				} catch (error) {
					if ((request.type === "reclaim" || request.type === "prepare") && !pooledTask && error instanceof SqliteReclamationRequestRefusedError && (!claim && !retainedDatabase || claim?.isCurrent() && retainedDatabase?.isOpen && !retainedDatabase.isTransaction)) return {
						type: "refused",
						operationId,
						settled: true
					};
					failureCleanup = closeDatabase();
					return throwReclamationFailure(error, failureCleanup, void 0);
				}
			});
			if (response.type === "closed") {
				port.postMessage(response);
				if (pooledTask) {
					const [release] = await once(port, "message");
					if (!isRecord(release) || release.type !== "release" || release.operationId !== operationId) throw new Error("Canonical validation task received an invalid close release");
				}
				port.close();
				return response;
			}
			if (request.type === "reclaim") request.plan.materializedPlans.length = 0;
			port.postMessage(response);
			scheduleWorkerIdleGc();
		}
		throw new Error("SQLite session reclamation parent closed without retiring its worker");
	} catch (error) {
		if (failureCleanup) port.postMessage({
			type: "closed",
			...failureCleanup
		});
		throw error;
	} finally {
		stopCheckpointRelay();
		claim?.release();
	}
}
//#endregion
export { runColdMutationWorkerPort, runReclamationWorkerPort };
