import { d as toStringifiedError } from "./error-coercion-C787aVxk.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { r as computeBackoffSchedule } from "./src-D4OikzaT.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { r as executeSqliteQueryTakeFirstSync, u as sql } from "./kysely-sync-Bn6Qrpbz.mjs";
import { i as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DKSXLQhb.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-dG8swyHC.mjs";
import { a as resolveOpenClawAgentSqlitePath, r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { t as sessionChanges } from "./session-row-changes-xuu0eHng.mjs";
import { d as isIncognitoOpenClawAgentDatabase } from "./openclaw-agent-db-lifecycle-D7S9DdJC.mjs";
import { f as runOpenClawAgentWriteTransaction, m as withOpenClawAgentDatabaseAsync, s as getOpenClawAgentDatabaseIfOpen, t as borrowOpenClawAgentDatabase } from "./openclaw-agent-db-CaQAStOA.mjs";
import { s as transcriptEventJsonSql } from "./transcript-payload-qsg5dB6v.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-IBx2zWDG.mjs";
import { a as getSessionKysely, g as toDatabaseOptions, h as runExclusiveSqliteSessionWrite, p as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { _ as finalizePreparedSessionTranscriptProjectionInTransaction, c as listSessionsNeedingTranscriptIndexReconcile, f as sessionTranscriptIndexNeedsReconcile, g as deletePreparedSessionTranscriptProjectionChunkInTransaction, h as claimPreparedSessionTranscriptProjectionInTransaction, i as deleteOrphanedTranscriptIndexRowsInTransaction, m as appendPreparedSessionTranscriptProjectionChunkInTransaction, o as hasOrphanedTranscriptIndexRows, s as hasSessionsNeedingTranscriptIndexReconcile } from "./session-transcript-index-UaRlRUAw.mjs";
import { a as runSessionTranscriptReconcileOperation, i as isSessionTranscriptReconcileGenerationCurrent, t as captureSessionTranscriptReconcileGeneration } from "./session-transcript-reconcile-pool-BPd_ppEE.mjs";
import { setImmediate, setTimeout } from "node:timers/promises";
import { randomInt, randomUUID } from "node:crypto";
//#region src/config/sessions/session-transcript-reconcile-memory.ts
const SOURCE_FRAME_BYTES = 262144;
function readSnapshot(database, sessionId) {
	const db = getSessionKysely(database.db);
	const row = executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_windows as window").leftJoin("transcript_rewrite_watermarks as rewrite", "rewrite.session_id", "window.session_id").select((eb) => [
		"window.transcript_updated_at",
		"rewrite.generation",
		eb.selectFrom("transcript_events").select("seq").where("session_id", "=", sessionId).orderBy("seq", "desc").limit(1).as("max_seq")
	]).where("window.session_id", "=", sessionId));
	return row && row.max_seq !== null ? {
		sessionId,
		transcriptUpdatedAt: row.transcript_updated_at,
		maxSeq: row.max_seq,
		generation: row.generation
	} : void 0;
}
/** The parent alone owns memory state; a worker receives bytes, never its sentinel path. */
function createMemoryTranscriptProjectionSource(database, options, range) {
	const startAfterSeq = range?.afterSeq ?? -1;
	const throughSeq = range?.throughSeq;
	let snapshot;
	let afterSeq = startAfterSeq;
	let offset = 0;
	let row;
	const assertCurrentOwner = () => {
		if (!database.db.isOpen || getOpenClawAgentDatabaseIfOpen(options) !== database) throw new Error("Incognito transcript database was disposed during reconciliation");
	};
	const snapshotMatches = (allowAppend = false) => {
		if (!snapshot) return false;
		const current = readSnapshot(database, snapshot.sessionId);
		if (!current || current.generation !== snapshot.generation) return false;
		if (allowAppend) return current.maxSeq >= snapshot.maxSeq;
		return current.maxSeq === snapshot.maxSeq && current.transcriptUpdatedAt === snapshot.transcriptUpdatedAt;
	};
	return {
		assertCurrentOwner,
		clear() {
			snapshot = void 0;
			row = void 0;
		},
		isCurrentPlan(plan) {
			return snapshot?.sessionId === plan.sessionId && snapshot.generation === plan.sourceTranscriptGeneration && snapshot.maxSeq === plan.sourceIndexedSeq && snapshot.transcriptUpdatedAt === plan.sourceTranscriptUpdatedAt && snapshotMatches();
		},
		read(sessionId) {
			assertCurrentOwner();
			return runSqliteDeferredTransactionSync(database.db, () => {
				if (snapshot?.sessionId !== sessionId) {
					snapshot = readSnapshot(database, sessionId);
					if (snapshot && throughSeq !== void 0) snapshot.maxSeq = throughSeq;
					row = void 0;
					afterSeq = startAfterSeq;
					offset = 0;
				}
				if (!snapshotMatches(throughSeq !== void 0)) {
					row = void 0;
					snapshot = void 0;
					return { type: "source-unavailable" };
				}
				if (!row) {
					let query = getSessionKysely(database.db).selectFrom("transcript_events").select([
						"seq",
						"created_at",
						sql`CAST(${transcriptEventJsonSql(database.db)} AS BLOB)`.as("bytes")
					]).where("session_id", "=", sessionId).where("seq", ">", afterSeq);
					if (throughSeq !== void 0) query = query.where("seq", "<=", throughSeq);
					row = executeSqliteQueryTakeFirstSync(database.db, query.orderBy("seq", "asc").limit(1));
					offset = 0;
				}
				if (!row) return {
					type: "source-end",
					snapshot
				};
				const bytes = Uint8Array.from(row.bytes.subarray(offset, offset + SOURCE_FRAME_BYTES));
				offset += bytes.byteLength;
				const frame = {
					type: "source-frame",
					seq: row.seq,
					createdAt: row.created_at,
					bytes,
					final: offset === row.bytes.byteLength
				};
				if (frame.final) {
					afterSeq = row.seq;
					row = void 0;
				}
				return frame;
			}, {
				databaseLabel: database.path,
				operationLabel: "sessions.transcript-index.memory-source"
			});
		}
	};
}
//#endregion
//#region src/config/sessions/session-transcript-reconcile.ts
const log = createSubsystemLogger("sessions/transcript-index");
const PROJECTION_WRITE_CHUNK_ROWS = 512;
const PROJECTION_READY_POLL_MS = 10;
const RECONCILE_RETRY_BACKOFF_MS = [
	0,
	50,
	200,
	500,
	1e3
];
const runningReconciles = /* @__PURE__ */ new Map();
function prepareReconcileParams(params) {
	return {
		...params,
		env: { ...params.env ?? process.env },
		generation: captureSessionTranscriptReconcileGeneration()
	};
}
function reconcileKey(params) {
	return resolveOpenClawAgentSqlitePath(params);
}
function captureMemorySource(params) {
	const database = getOpenClawAgentDatabaseIfOpen(params);
	return database && isIncognitoOpenClawAgentDatabase(database) ? createMemoryTranscriptProjectionSource(database, {
		...params,
		path: database.path
	}) : void 0;
}
function nextProjectionClaimId() {
	return -randomInt(1, 2 ** 47);
}
function continueProjectionWorker(worker, accepted) {
	worker.postMessage({
		accepted,
		type: "continue"
	}, []);
}
async function runProjectionWrite(databaseOptions, operationLabel, operation, memorySource) {
	return await runExclusiveSqliteSessionWrite(databaseOptions, async () => {
		const write = () => {
			memorySource?.assertCurrentOwner();
			return runOpenClawAgentWriteTransaction(operation, databaseOptions, { operationLabel });
		};
		return !isIncognitoOpenClawAgentSqlitePath(databaseOptions.path, databaseOptions) && !getOpenClawAgentDatabaseIfOpen(databaseOptions) ? withOpenClawAgentDatabaseAsync(databaseOptions, write) : write();
	}, operationLabel);
}
async function claimPreparedSessionTranscriptProjection(databaseOptions, plan, memorySource) {
	const claimId = nextProjectionClaimId();
	if (!await runProjectionWrite(databaseOptions, "sessions.transcript-index.claim", (database) => (!memorySource || memorySource.isCurrentPlan(plan)) && claimPreparedSessionTranscriptProjectionInTransaction(database.db, plan, claimId), memorySource)) return;
	let deleteResult = {
		hasMore: true,
		owned: true
	};
	while (deleteResult.hasMore && deleteResult.owned) {
		deleteResult = await runProjectionWrite(databaseOptions, "sessions.transcript-index.delete-chunk", (database) => deletePreparedSessionTranscriptProjectionChunkInTransaction(database.db, {
			maxRowsPerTable: PROJECTION_WRITE_CHUNK_ROWS,
			sessionId: plan.sessionId,
			claimId
		}), memorySource);
		await setImmediate();
	}
	if (!deleteResult.owned) return;
	return {
		claimId,
		plan
	};
}
function decodeFtsChunk(chunk) {
	const decoder = new TextDecoder();
	return chunk.rows.map((row) => ({
		messageId: row.messageId,
		role: row.role,
		text: decoder.decode(chunk.textBytes.subarray(row.textByteOffset, row.textByteOffset + row.textByteLength)),
		timestamp: row.timestamp
	}));
}
async function appendPreparedProjectionChunk(databaseOptions, active, rows, memorySource) {
	const owned = await runProjectionWrite(databaseOptions, "activeRows" in rows ? "sessions.transcript-index.active-chunk" : "sessions.transcript-index.fts-chunk", (database) => appendPreparedSessionTranscriptProjectionChunkInTransaction(database.db, {
		...rows,
		claimId: active.claimId,
		sessionId: active.plan.sessionId
	}), memorySource);
	await setImmediate();
	return owned;
}
async function finalizePreparedProjection(databaseOptions, active, memorySource) {
	return await runProjectionWrite(databaseOptions, "sessions.transcript-index.finalize", (database) => {
		const finalized = (!memorySource || memorySource.isCurrentPlan(active.plan)) && finalizePreparedSessionTranscriptProjectionInTransaction(database.db, active.plan, active.claimId);
		const session = finalized && executeSqliteQueryTakeFirstSync(database.db, getSessionKysely(database.db).selectFrom("session_windows").select("session_key").where("session_id", "=", active.plan.sessionId));
		if (session) sessionChanges.emit({
			storePath: database.path,
			sessionKey: session.session_key
		}, database.db);
		return finalized;
	}, memorySource);
}
/** Prepares full trees off-thread, then commits bounded chunks through the runtime writer owner. */
async function reconcileSessionTranscriptIndexes(params) {
	const prepared = prepareReconcileParams(params);
	return runSessionTranscriptReconcileOperation(prepared.generation, (operation) => reconcilePreparedTranscriptIndexes(prepared, operation), isIncognitoOpenClawAgentSqlitePath(reconcileKey(prepared), prepared) ? void 0 : {
		agentId: prepared.agentId,
		path: reconcileKey(prepared)
	});
}
async function reconcilePreparedTranscriptIndexes(params, operation) {
	operation.signal.throwIfAborted();
	const databasePath = resolveOpenClawAgentSqlitePath(params);
	const databaseOptions = {
		agentId: params.agentId,
		env: params.env,
		path: databasePath
	};
	let releaseDatabase;
	const memorySource = captureMemorySource(databaseOptions);
	let memorySessionIds = [];
	try {
		if (!memorySource) {
			if (await runExclusiveSqliteSessionWrite(databaseOptions, async () => {
				try {
					const pending = withOpenClawAgentDatabaseReadOnly(({ db }) => runSqliteDeferredTransactionSync(db, () => hasSessionsNeedingTranscriptIndexReconcile(db) || hasOrphanedTranscriptIndexRows(db)), databaseOptions);
					return pending.found && !pending.value;
				} catch {
					return false;
				}
			}, "sessions.transcript-index.preflight")) return { reconciledSessions: 0 };
		}
		operation.signal.throwIfAborted();
		await runProjectionWrite(databaseOptions, "sessions.transcript-index.preflight", (database) => {
			deleteOrphanedTranscriptIndexRowsInTransaction(database.db);
			const sessionIds = listSessionsNeedingTranscriptIndexReconcile(database.db);
			if (sessionIds.length > 0) {
				releaseDatabase = borrowOpenClawAgentDatabase(databaseOptions).release;
				if (memorySource) {
					const preferred = params.preferredSessionId;
					memorySessionIds = preferred && sessionIds.includes(preferred) ? [preferred, ...sessionIds.filter((sessionId) => sessionId !== preferred)] : sessionIds;
				}
			}
		}, memorySource);
		if (!releaseDatabase) return { reconciledSessions: 0 };
		const input = memorySource ? {
			mode: "memory",
			sessionIds: memorySessionIds
		} : {
			mode: "disk",
			leaseId: randomUUID(),
			agentId: params.agentId,
			path: databasePath,
			stateDir: resolveStateDir(params.env),
			externallySupervised: isGatewayExternallySupervised(params.env),
			...params.preferredSessionId ? { preferredSessionId: params.preferredSessionId } : {}
		};
		const task = operation.startTask(input);
		const worker = task.port;
		let handlingMessage;
		let terminalReceived = false;
		let outcome;
		try {
			const value = await new Promise((resolve, reject) => {
				let active;
				let reconciledSessions = 0;
				let settled = false;
				const settle = (finish) => {
					if (settled) return;
					settled = true;
					finish();
				};
				const handleMessage = async (message) => {
					if (message.type === "failed") {
						terminalReceived = true;
						settle(() => reject(new Error(message.error)));
						return;
					}
					if (message.type === "done") {
						terminalReceived = true;
						if (active) {
							settle(() => reject(/* @__PURE__ */ new Error("session transcript reconcile worker ended mid-plan")));
							return;
						}
						try {
							await runProjectionWrite(databaseOptions, "sessions.transcript-index.orphan-sweep", (database) => deleteOrphanedTranscriptIndexRowsInTransaction(database.db), memorySource);
						} catch (error) {
							settle(() => reject(toStringifiedError(error)));
							return;
						}
						settle(() => resolve({ reconciledSessions }));
						return;
					}
					try {
						if (message.type === "source-read") {
							if (!memorySource || !memorySessionIds.includes(message.sessionId)) throw new Error("session transcript worker requested an unavailable memory source");
							const frame = memorySource.read(message.sessionId);
							await setImmediate();
							worker.postMessage(frame, frame.type === "source-frame" ? [frame.bytes.buffer] : []);
							return;
						}
						if (message.type === "plan-start") {
							if (active) throw new Error("session transcript reconcile worker started overlapping plans");
							active = await claimPreparedSessionTranscriptProjection(databaseOptions, message.plan, memorySource);
							continueProjectionWorker(worker, active !== void 0);
							return;
						}
						if (!active || active.plan.sessionId !== message.sessionId) throw new Error("session transcript reconcile worker sent a chunk for no active plan");
						if (message.type === "plan-finish") {
							const finalized = await finalizePreparedProjection(databaseOptions, active, memorySource);
							active = void 0;
							if (finalized) reconciledSessions += 1;
							continueProjectionWorker(worker, finalized);
							return;
						}
						const owned = await appendPreparedProjectionChunk(databaseOptions, active, message.type === "active-chunk" ? { activeRows: message.rows } : { ftsRows: decodeFtsChunk(message.chunk) }, memorySource);
						if (!owned) active = void 0;
						continueProjectionWorker(worker, owned);
					} catch (error) {
						settle(() => reject(toStringifiedError(error)));
					}
				};
				worker.on("message", (message) => {
					if (settled || message.type === "lease-released" || message.type === "lease-release-failed") return;
					handlingMessage = handleMessage(message);
				});
				worker.once("messageerror", (error) => {
					settle(() => reject(toStringifiedError(error)));
				});
				task.completion.then(async () => {
					await task.closed;
					if (!terminalReceived) settle(() => reject(/* @__PURE__ */ new Error("session transcript worker task ended without a result")));
				}, (error) => settle(() => reject(toStringifiedError(error))));
			});
			outcome = ok(value);
		} catch (error) {
			outcome = err(error);
		}
		let plannerFailure;
		try {
			if (!terminalReceived) task.controller.abort();
			await handlingMessage;
			if (input.mode === "disk" && terminalReceived) worker.postMessage({ type: "release" }, []);
			const plannerRelease = await task.leaseRelease;
			if (input.mode === "disk") {
				let cleanup = plannerRelease;
				if (!cleanup.released && !cleanup.releaseFailed) {
					const releaseTask = operation.startTask({
						mode: "release",
						leaseId: input.leaseId,
						stateDir: input.stateDir,
						externallySupervised: input.externallySupervised
					});
					try {
						cleanup = await releaseTask.leaseRelease;
					} finally {
						releaseTask.port.close();
						releaseTask.port.removeAllListeners();
					}
				}
				if (cleanup.failure) throw cleanup.failure;
				if (outcome.ok && plannerRelease.failure) plannerFailure = plannerRelease.failure;
			}
		} catch (error) {
			const failure = new Error(`Transcript lease cleanup incomplete; restart OpenClaw before deleting this agent: ${toStringifiedError(error).message}`, { cause: error });
			if (input.mode === "disk") operation.retainLeaseForCleanup({
				mode: "release",
				leaseId: input.leaseId,
				stateDir: input.stateDir,
				externallySupervised: input.externallySupervised
			});
			throw outcome.ok ? failure : new AggregateError([outcome.error, failure], failure.message, { cause: failure });
		} finally {
			worker.close();
			worker.removeAllListeners();
		}
		if (!outcome.ok) throw outcome.error;
		if (plannerFailure) throw plannerFailure;
		return outcome.value;
	} finally {
		memorySource?.clear();
		releaseDatabase?.();
	}
}
/** Starts one deferred reconcile. No transcript rows are read on the caller's stack. */
function startSessionTranscriptIndexReconcile(input) {
	startPreparedSessionTranscriptIndexReconcile(prepareReconcileParams(input));
}
function startPreparedSessionTranscriptIndexReconcile(params) {
	if (!isSessionTranscriptReconcileGenerationCurrent(params.generation)) return;
	const key = reconcileKey(params);
	const running = runningReconciles.get(key);
	if (running?.generation === params.generation) {
		running.pending = true;
		running.preferredSessionId ??= params.preferredSessionId;
		return;
	}
	const state = {
		generation: params.generation,
		pending: false,
		...params.preferredSessionId ? { preferredSessionId: params.preferredSessionId } : {}
	};
	const memorySource = captureMemorySource(params);
	state.promise = runSessionTranscriptReconcileOperation(params.generation, (operation) => {
		state.signal = operation.signal;
		return setImmediate().then(async () => {
			let reconciledSessions = 0;
			let retryCount = 0;
			while (true) {
				operation.signal.throwIfAborted();
				memorySource?.assertCurrentOwner();
				state.pending = false;
				const preferredSessionId = state.preferredSessionId;
				delete state.preferredSessionId;
				const result = await reconcilePreparedTranscriptIndexes({
					...params,
					...preferredSessionId ? { preferredSessionId } : {}
				}, operation);
				reconciledSessions += result.reconciledSessions;
				if (state.pending) {
					retryCount += 1;
					await setTimeout(computeBackoffSchedule(RECONCILE_RETRY_BACKOFF_MS, retryCount));
					continue;
				}
				if (runningReconciles.get(key) === state) runningReconciles.delete(key);
				return { reconciledSessions };
			}
		});
	}, isIncognitoOpenClawAgentSqlitePath(key, params) ? void 0 : {
		agentId: params.agentId,
		path: key
	}).catch(async (error) => {
		log.warn(`session transcript reconcile failed agent=${params.agentId} error=${error instanceof Error ? error.message : String(error)}`);
		const shouldHandoff = state.pending;
		const preferredSessionId = state.preferredSessionId;
		if (runningReconciles.get(key) === state) runningReconciles.delete(key);
		if (shouldHandoff && state.signal && !state.signal.aborted && (!memorySource || captureMemorySource(params))) {
			startPreparedSessionTranscriptIndexReconcile({
				...params,
				...preferredSessionId ? { preferredSessionId } : {}
			});
			await waitForSessionTranscriptIndexReconcile(params);
		}
		return { reconciledSessions: 0 };
	});
	runningReconciles.set(key, state);
}
function isSessionTranscriptIndexReconcileRunning(params) {
	return runningReconciles.has(reconcileKey(params));
}
/** Test and maintenance wait hook for an already-scheduled reconcile. */
async function waitForSessionTranscriptIndexReconcile(params) {
	await runningReconciles.get(reconcileKey(params))?.promise;
}
/** Test and maintenance drain for scheduled reconciles owned by one state directory. */
async function waitForSessionTranscriptIndexReconcilesInStateDir(stateDir) {
	while (true) {
		const owners = [...runningReconciles].filter(([databasePath]) => isPathInside(stateDir, databasePath)).flatMap(([, owner]) => owner.promise ? [owner.promise] : []);
		if (owners.length === 0) return;
		await Promise.all(owners);
	}
}
/** Waits only until the requested session's scheduled projection rebuild settles. */
async function waitForSessionTranscriptProjection(scope, abortSignal) {
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const databaseOptions = prepareReconcileParams(toDatabaseOptions(resolved));
	const key = reconcileKey(databaseOptions);
	const needsReconcile = () => {
		const pending = withOpenClawAgentDatabaseReadOnly(({ db }) => sessionTranscriptIndexNeedsReconcile(db, resolved.sessionId), databaseOptions);
		return pending.found && pending.value;
	};
	let running = runningReconciles.get(key);
	while (running) {
		if (!running.signal?.aborted && !needsReconcile()) return;
		await setTimeout(PROJECTION_READY_POLL_MS, void 0, abortSignal ? { signal: abortSignal } : void 0);
		if (!runningReconciles.has(key) && running.signal?.aborted && isSessionTranscriptReconcileGenerationCurrent(running.generation) && needsReconcile()) startPreparedSessionTranscriptIndexReconcile({
			...databaseOptions,
			generation: running.generation,
			preferredSessionId: resolved.sessionId
		});
		running = runningReconciles.get(key);
	}
}
//#endregion
export { waitForSessionTranscriptIndexReconcilesInStateDir as a, waitForSessionTranscriptIndexReconcile as i, reconcileSessionTranscriptIndexes as n, waitForSessionTranscriptProjection as o, startSessionTranscriptIndexReconcile as r, createMemoryTranscriptProjectionSource as s, isSessionTranscriptIndexReconcileRunning as t };
