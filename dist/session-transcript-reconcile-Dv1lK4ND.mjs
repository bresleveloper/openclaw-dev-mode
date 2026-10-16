import { d as toStringifiedError } from "./error-coercion-CvJK4lmH.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-DoBSDhBS.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { i as createAbortError, o as racePromiseWithAbortSignal, r as computeBackoffSchedule } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { d as sql, i as executeSqliteQueryTakeFirstSync } from "./kysely-sync-K7ftY-g4.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { r as runSqliteDeferredTransactionSync } from "./sqlite-transaction-DsZ3X6nD.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-Dgz2IR4T.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-CUdBruRD.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { t as captureAgentDatabaseCloseFence } from "./openclaw-agent-db-resources-x2MmUEok.mjs";
import { c as resolveOpenClawAgentSqlitePath, i as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { n as sessionChanges } from "./session-row-changes-BcJIdta8.mjs";
import { p as isIncognitoOpenClawAgentDatabase } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { a as getOpenClawAgentDatabaseIfOpen, f as withOpenClawAgentDatabaseAsync, t as borrowOpenClawAgentDatabase, u as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-DBug3LUA.mjs";
import { s as transcriptEventJsonSql } from "./transcript-payload-Yc_w8Yx5.mjs";
import { n as supportsOpenClawAgentDatabaseExecution, t as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-CaPKglUL.mjs";
import { t as openOpenClawAgentSqliteWorkerStore } from "./openclaw-agent-worker-store-DpPONdtx.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { p as runExclusiveSqliteSessionWrite, u as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { _ as finalizePreparedSessionTranscriptProjectionInTransaction, c as listSessionsNeedingTranscriptIndexReconcile, f as sessionTranscriptIndexNeedsReconcile, g as deletePreparedSessionTranscriptProjectionChunkInTransaction, h as claimPreparedSessionTranscriptProjectionInTransaction, i as deleteOrphanedTranscriptIndexRowsInTransaction, m as appendPreparedSessionTranscriptProjectionChunkInTransaction, o as hasOrphanedTranscriptIndexRows, s as hasSessionsNeedingTranscriptIndexReconcile } from "./session-transcript-index-FbEuN6S5.mjs";
import { a as runSessionTranscriptReconcileOperation, i as isSessionTranscriptReconcileGenerationCurrent, t as captureSessionTranscriptReconcileGeneration } from "./session-transcript-reconcile-pool-8tPpYHPN.mjs";
import { s as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-EUbUbAQu.mjs";
import { randomInt, randomUUID } from "node:crypto";
import { setImmediate, setTimeout } from "node:timers/promises";
//#region src/config/sessions/session-incognito-projection.ts
/** Retain compute custody while individual frames and publications take their own FIFO turn. */
function withIncognitoProjection(binding, database, operation) {
	const { actor, authority } = binding;
	const target = structuredClone(binding.target);
	if (actor.path !== resolveOpenClawAgentSqlitePath(database) || actor.agentId !== database.agentId) throw new Error("Incognito reconciliation belongs to another actor");
	return actor.sessions.withCompute(authority, target, async (compute) => {
		const sourceId = randomUUID();
		await compute.execute({
			type: "session.compute.source.open",
			input: {
				...target,
				sourceId
			}
		});
		const publishers = {
			claim: (request) => compute.execute({
				type: "session.compute.projection.claim",
				input: {
					...target,
					sourceId,
					request
				}
			}),
			deleteChunk: (request) => compute.execute({
				type: "session.compute.projection.deleteChunk",
				input: {
					...target,
					sourceId,
					request
				}
			}),
			appendChunk: (request) => compute.execute({
				type: "session.compute.projection.appendChunk",
				input: {
					...target,
					sourceId,
					request
				}
			}),
			finalize: (request) => compute.execute({
				type: "session.compute.projection.finalize",
				input: {
					...target,
					sourceId,
					request
				}
			}),
			preflight: () => {
				throw new Error("Incognito projection does not admit store-wide operations");
			},
			sweep: () => {
				throw new Error("Incognito projection does not admit store-wide operations");
			}
		};
		return operation({
			sessionId: target.sessionId,
			publication: { execute: ({ type, input }) => publishers[type](input) },
			read: () => compute.execute({
				type: "session.compute.source.read",
				input: {
					...target,
					sourceId
				}
			})
		});
	});
}
//#endregion
//#region src/config/sessions/session-transcript-projection-writer.ts
const PROJECTION_WRITE_CHUNK_ROWS = 512;
async function runProjectionWrite(databaseOptions, operationLabel, operation, memorySource) {
	return await runExclusiveSqliteSessionWrite(databaseOptions, async () => {
		const write = () => {
			memorySource?.assertCurrentOwner();
			return runOpenClawAgentWriteTransaction(operation, databaseOptions, { operationLabel });
		};
		return !isIncognitoOpenClawAgentSqlitePath(databaseOptions.path, databaseOptions) && !getOpenClawAgentDatabaseIfOpen(databaseOptions) ? withOpenClawAgentDatabaseAsync(databaseOptions, write) : write();
	}, operationLabel);
}
async function claimPreparedSessionTranscriptProjection(databaseOptions, plan, memorySource, publication) {
	const claimId = -randomInt(1, 2 ** 47);
	if (!(publication ? await publication.execute({
		type: "claim",
		input: {
			plan,
			claimId
		}
	}) : await runProjectionWrite(databaseOptions, "sessions.transcript-index.claim", (database) => (!memorySource || memorySource.isCurrentPlan(plan)) && claimPreparedSessionTranscriptProjectionInTransaction(database.db, plan, claimId), memorySource))) return;
	let deleteResult = {
		hasMore: true,
		owned: true
	};
	while (deleteResult.hasMore && deleteResult.owned) {
		const input = {
			maxRowsPerTable: PROJECTION_WRITE_CHUNK_ROWS,
			sessionId: plan.sessionId,
			claimId
		};
		deleteResult = publication ? await publication.execute({
			type: "deleteChunk",
			input
		}) : await runProjectionWrite(databaseOptions, "sessions.transcript-index.delete-chunk", (database) => deletePreparedSessionTranscriptProjectionChunkInTransaction(database.db, input), memorySource);
		await setImmediate();
	}
	if (!deleteResult.owned) return;
	return {
		claimId,
		plan
	};
}
async function appendPreparedProjectionChunk(databaseOptions, active, rows, memorySource, publication) {
	const input = {
		...rows,
		claimId: active.claimId,
		sessionId: active.plan.sessionId
	};
	const owned = publication ? await publication.execute({
		type: "appendChunk",
		input
	}) : await runProjectionWrite(databaseOptions, "activeRows" in rows ? "sessions.transcript-index.active-chunk" : "sessions.transcript-index.fts-chunk", (database) => appendPreparedSessionTranscriptProjectionChunkInTransaction(database.db, input), memorySource);
	await setImmediate();
	return owned;
}
async function finalizePreparedProjection(databaseOptions, active, memorySource, publication) {
	if (publication) {
		const result = await publication.execute({
			type: "finalize",
			input: active
		});
		if (result.sessionKey !== void 0) sessionChanges.emit({
			storePath: databaseOptions.path,
			sessionKey: result.sessionKey,
			facts: { kind: "unchanged" }
		});
		return result.finalized;
	}
	return await runProjectionWrite(databaseOptions, "sessions.transcript-index.finalize", (database) => {
		const finalized = (!memorySource || memorySource.isCurrentPlan(active.plan)) && finalizePreparedSessionTranscriptProjectionInTransaction(database.db, active.plan, active.claimId);
		const session = finalized && executeSqliteQueryTakeFirstSync(database.db, getSessionKysely(database.db).selectFrom("session_windows").select("session_key").where("session_id", "=", active.plan.sessionId));
		if (session) sessionChanges.emit({
			storePath: database.path,
			sessionKey: session.session_key,
			facts: { kind: "unchanged" }
		}, database.db);
		return finalized;
	}, memorySource);
}
//#endregion
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
function decodeFtsChunk(chunk) {
	const decoder = new TextDecoder();
	return chunk.rows.map((row) => ({
		messageId: row.messageId,
		role: row.role,
		text: decoder.decode(chunk.textBytes.subarray(row.textByteOffset, row.textByteOffset + row.textByteLength)),
		timestamp: row.timestamp
	}));
}
/** Prepares full trees off-thread, then commits bounded chunks through the runtime writer owner. */
async function reconcileSessionTranscriptIndexes(params, incognito) {
	const prepared = prepareReconcileParams(params);
	const run = (source) => runSessionTranscriptReconcileOperation(prepared.generation, (operation) => reconcilePreparedTranscriptIndexes(prepared, operation, void 0, source), incognito || isIncognitoOpenClawAgentSqlitePath(reconcileKey(prepared), prepared) ? void 0 : {
		agentId: prepared.agentId,
		path: reconcileKey(prepared)
	});
	return incognito ? withIncognitoProjection(incognito, prepared, run) : run();
}
async function reconcilePreparedTranscriptIndexes(params, operation, heldExecution, actorSource) {
	operation.signal.throwIfAborted();
	const databasePath = resolveOpenClawAgentSqlitePath(params);
	const databaseOptions = {
		agentId: params.agentId,
		env: params.env,
		path: databasePath
	};
	const execution = heldExecution ?? (supportsOpenClawAgentDatabaseExecution(databaseOptions) ? captureOpenClawAgentDatabaseExecution(databaseOptions) : void 0);
	let publicationClient;
	let publication;
	let releaseDatabase;
	const memorySource = actorSource ? void 0 : captureMemorySource(databaseOptions);
	let memorySessionIds = [];
	try {
		if (actorSource) {
			publication = actorSource.publication;
			memorySessionIds = [actorSource.sessionId];
		} else if (execution) {
			execution.assertCurrent();
			const pending = await runExclusiveSqliteSessionWrite(databaseOptions, async () => {
				execution.assertCurrent();
				return await withSessionHistoryWorkerDatabase(databaseOptions, (owner) => owner.readProjectionStatus({ env: params.env }, operation.signal)).catch(() => true);
			}, "sessions.transcript-index.preflight");
			execution.assertCurrent();
			if (!pending) return { reconciledSessions: 0 };
			operation.signal.throwIfAborted();
			const client = await openOpenClawAgentSqliteWorkerStore(databaseOptions, { execution }, {
				moduleUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sessionTranscriptProjectionPublication),
				input: void 0
			});
			publicationClient = client;
			publication = { execute: (command) => client.execute(command, () => {
				operation.signal.throwIfAborted();
				execution.assertCurrent();
			}) };
			if (!await publication.execute({
				type: "preflight",
				input: void 0
			})) return { reconciledSessions: 0 };
		} else {
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
		}
		const input = memorySource || actorSource ? {
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
		const task = await operation.startTask(input);
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
							if (publication) {
								if (!operation.signal.aborted && !actorSource) await publication.execute({
									type: "sweep",
									input: void 0
								});
							} else await runProjectionWrite(databaseOptions, "sessions.transcript-index.orphan-sweep", (database) => deleteOrphanedTranscriptIndexRowsInTransaction(database.db), memorySource);
						} catch (error) {
							settle(() => reject(toStringifiedError(error)));
							return;
						}
						settle(() => resolve({ reconciledSessions }));
						return;
					}
					try {
						if (message.type === "source-read") {
							const source = actorSource ?? memorySource;
							if (!source || !memorySessionIds.includes(message.sessionId)) throw new Error("session transcript worker requested an unavailable memory source");
							const frame = await source.read(message.sessionId);
							await setImmediate();
							worker.postMessage(frame, frame.type === "source-frame" ? [frame.bytes.buffer] : []);
							return;
						}
						if (message.type === "plan-start") {
							if (active) throw new Error("session transcript reconcile worker started overlapping plans");
							active = await claimPreparedSessionTranscriptProjection(databaseOptions, message.plan, memorySource, publication);
							worker.postMessage({
								accepted: active !== void 0,
								type: "continue"
							}, []);
							return;
						}
						if (!active || active.plan.sessionId !== message.sessionId) throw new Error("session transcript reconcile worker sent a chunk for no active plan");
						if (message.type === "plan-finish") {
							const finalized = await finalizePreparedProjection(databaseOptions, active, memorySource, publication);
							active = void 0;
							if (finalized) reconciledSessions += 1;
							worker.postMessage({
								accepted: finalized,
								type: "continue"
							}, []);
							return;
						}
						const owned = await appendPreparedProjectionChunk(databaseOptions, active, message.type === "active-chunk" ? { activeRows: message.rows } : { ftsRows: decodeFtsChunk(message.chunk) }, memorySource, publication);
						if (!owned) active = void 0;
						worker.postMessage({
							accepted: owned,
							type: "continue"
						}, []);
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
					const releaseTask = await operation.startTask({
						mode: "release",
						leaseId: input.leaseId,
						path: input.path,
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
				path: input.path,
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
		try {
			await publicationClient?.close();
		} finally {
			if (!heldExecution) await execution?.release();
		}
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
	let runningCurrent = true;
	try {
		running?.assertCurrent?.();
	} catch {
		runningCurrent = false;
	}
	if (running?.generation === params.generation && (running.signal?.aborted || runningCurrent)) {
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
	const execution = supportsOpenClawAgentDatabaseExecution(params) ? captureOpenClawAgentDatabaseExecution(params) : void 0;
	state.assertCurrent = execution ? () => execution.assertCurrent() : void 0;
	let entered = false;
	let executionCurrent = true;
	state.promise = runSessionTranscriptReconcileOperation(params.generation, async (operation) => {
		entered = true;
		state.signal = operation.signal;
		try {
			await setImmediate();
			let reconciledSessions = 0;
			let retryCount = 0;
			while (true) {
				operation.signal.throwIfAborted();
				memorySource?.assertCurrentOwner();
				execution?.assertCurrent();
				state.pending = false;
				const preferredSessionId = state.preferredSessionId;
				delete state.preferredSessionId;
				const result = await reconcilePreparedTranscriptIndexes({
					...params,
					...preferredSessionId ? { preferredSessionId } : {}
				}, operation, execution);
				reconciledSessions += result.reconciledSessions;
				if (state.pending) {
					retryCount += 1;
					await setTimeout(computeBackoffSchedule(RECONCILE_RETRY_BACKOFF_MS, retryCount));
					continue;
				}
				if (runningReconciles.get(key) === state) runningReconciles.delete(key);
				return { reconciledSessions };
			}
		} catch (error) {
			try {
				execution?.assertCurrent();
			} catch {
				executionCurrent = false;
			}
			throw error;
		} finally {
			await execution?.release();
		}
	}, isIncognitoOpenClawAgentSqlitePath(key, params) ? void 0 : {
		agentId: params.agentId,
		path: key
	}).catch(async (error) => {
		if (!entered) await execution?.release();
		log.warn(`session transcript reconcile failed agent=${params.agentId} error=${error instanceof Error ? error.message : String(error)}`);
		const shouldHandoff = state.pending;
		const preferredSessionId = state.preferredSessionId;
		if (runningReconciles.get(key) === state) runningReconciles.delete(key);
		if (shouldHandoff && executionCurrent && state.signal && !state.signal.aborted && (!memorySource || captureMemorySource(params))) {
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
	let running = runningReconciles.get(key);
	if (!running) return;
	let needsReconcile;
	if (supportsOpenClawAgentDatabaseExecution(databaseOptions)) needsReconcile = async () => {
		const closing = captureAgentDatabaseCloseFence({
			agentId: databaseOptions.agentId,
			path: key
		});
		if (closing) {
			await racePromiseWithAbortSignal(closing, abortSignal);
			if (!isSessionTranscriptReconcileGenerationCurrent(databaseOptions.generation)) return false;
		}
		const execution = captureOpenClawAgentDatabaseExecution(databaseOptions);
		try {
			execution.assertCurrent();
			return await withSessionHistoryWorkerDatabase(databaseOptions, (owner) => owner.readProjectionStatus({
				env: databaseOptions.env,
				sessionId: resolved.sessionId
			}, abortSignal));
		} finally {
			await execution.release();
		}
	};
	else needsReconcile = async () => {
		const pending = withOpenClawAgentDatabaseReadOnly(({ db }) => sessionTranscriptIndexNeedsReconcile(db, resolved.sessionId), databaseOptions);
		return pending.found && pending.value;
	};
	try {
		while (running) {
			abortSignal?.throwIfAborted();
			if (!running.signal?.aborted) {
				running.assertCurrent?.();
				if (!await needsReconcile()) return;
			}
			await setTimeout(PROJECTION_READY_POLL_MS, void 0, abortSignal ? { signal: abortSignal } : void 0);
			if (!runningReconciles.has(key) && running.signal?.aborted && isSessionTranscriptReconcileGenerationCurrent(running.generation) && await needsReconcile()) startPreparedSessionTranscriptIndexReconcile({
				...databaseOptions,
				generation: running.generation,
				preferredSessionId: resolved.sessionId
			});
			running = runningReconciles.get(key);
		}
	} catch (error) {
		if (abortSignal?.aborted && error === abortSignal.reason) throw createAbortError("Operation aborted", { cause: error });
		throw error;
	}
}
//#endregion
export { waitForSessionTranscriptIndexReconcilesInStateDir as a, waitForSessionTranscriptIndexReconcile as i, reconcileSessionTranscriptIndexes as n, waitForSessionTranscriptProjection as o, startSessionTranscriptIndexReconcile as r, createMemoryTranscriptProjectionSource as s, isSessionTranscriptIndexReconcileRunning as t };
