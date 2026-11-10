import { f as toStringifiedError } from "./error-coercion-BwMr25F8.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { i as createAbortError, o as racePromiseWithAbortSignal, r as computeBackoffSchedule } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-CvMrvFI1.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { r as recordWorkerMessage } from "./worker-message-metrics-CcNXClPZ.mjs";
import { a as executeSqliteQueryTakeFirstSync } from "./kysely-sync-9fPQaMlh.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { b as AgentDatabaseExecutionAdmissionClosedError, n as captureAgentDatabaseCloseFence } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { o as isGatewayExternallySupervised } from "./gateway-supervision-CO5zyEkR.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { u as deferOpenClawAgentPostCommitPublication } from "./openclaw-agent-db-lifecycle-Dodvmz4L.mjs";
import { c as runOpenClawAgentWriteTransaction, d as withOpenClawAgentDatabaseRuntime, i as getOpenClawAgentDatabaseIfOpen, t as borrowOpenClawAgentDatabase } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { i as toDatabaseOptions, t as getSessionKysely } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { a as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import { l as runExclusiveSqliteSessionWrite } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { a as publishUnchangedSessionTranscriptReceipts, i as publishUnchangedSessionTranscriptAuthority } from "./session-transcript-authority-Bd3kv5VJ.mjs";
import { r as captureOpenClawAgentDatabaseExecution, s as supportsOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { o as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { i as finalizePreparedSessionTranscriptProjectionInTransaction, n as claimPreparedSessionTranscriptProjectionInTransaction, r as deletePreparedSessionTranscriptProjectionChunkInTransaction, t as appendPreparedSessionTranscriptProjectionChunkInTransaction } from "./session-transcript-projection-rebuild-b6i9E7jy.mjs";
import { d as sessionTranscriptIndexNeedsReconcile, i as deleteOrphanedTranscriptIndexRowsInTransaction, o as listSessionsNeedingTranscriptIndexReconcile } from "./session-transcript-index-BTr4by8J.mjs";
import { n as openOpenClawAgentSqliteWorkerStore } from "./openclaw-agent-worker-store-CcajP8TM.mjs";
import { a as runSessionTranscriptReconcileOperation, i as isSessionTranscriptReconcileWorkerPoolClosing, n as finishSessionTranscriptReconcileTask } from "./session-transcript-reconcile-pool-Bj3f3Jd_.mjs";
import { randomInt, randomUUID } from "node:crypto";
import { setImmediate, setTimeout } from "node:timers/promises";
//#region src/config/sessions/session-transcript-reconcile-readiness.ts
function prepareReconcileParams(params) {
	const path = resolveOpenClawAgentSqlitePath(params);
	return {
		...params,
		path,
		env: { ...params.env ?? process.env }
	};
}
/** Observe readiness without rebuilding or sweeping projections. */
async function readSessionTranscriptProjectionStatus(databaseOptions, sessionId, abortSignal) {
	if (supportsOpenClawAgentDatabaseExecution(databaseOptions)) {
		const closing = captureAgentDatabaseCloseFence({
			agentId: databaseOptions.agentId,
			path: resolveOpenClawAgentSqlitePath(databaseOptions)
		});
		if (closing) {
			await racePromiseWithAbortSignal(closing, abortSignal);
			return false;
		}
		const execution = captureOpenClawAgentDatabaseExecution(databaseOptions);
		try {
			execution.assertCurrent();
			return await withSessionHistoryWorkerDatabase(databaseOptions, (owner) => owner.readProjectionStatus({
				env: databaseOptions.env,
				sessionId
			}, abortSignal));
		} finally {
			await execution.release();
		}
	}
	const pending = withOpenClawAgentDatabaseReadOnly(({ db }) => sessionTranscriptIndexNeedsReconcile(db, sessionId), databaseOptions);
	return pending.found && pending.value;
}
//#endregion
//#region src/config/sessions/session-transcript-index-maintenance.ts
/** Bound one pass even when foreign commits keep restarting admission. */
async function drainTranscriptIndexStatus(maintain, previousTraversal) {
	let traversal = previousTraversal;
	for (let batch = 0;; batch++) {
		const result = await maintain();
		const completedElsewhere = result.traversal && traversal && result.traversal.schemaVersion === traversal.schemaVersion && result.traversal.completedTraversals > traversal.completedTraversals;
		traversal = result.traversal;
		if (completedElsewhere) return {
			...result,
			traversalComplete: true
		};
		if (!result.hasMore || result.traversalComplete || batch === 31) return result;
		await setImmediate();
	}
}
//#endregion
//#region src/config/sessions/session-transcript-projection-writer.ts
const PROJECTION_WRITE_CHUNK_ROWS = 512;
/** Enumerate the admission backlog without waiting for a quiet revision. */
async function readTranscriptIndexBacklog(client, assertCurrent, signal) {
	let traversal;
	while (true) {
		assertCurrent();
		const status = await drainTranscriptIndexStatus(async () => {
			return (await client.executeExisting({
				type: "preflight",
				input: void 0
			}, assertCurrent, { signal }))?.value ?? {
				sessionIds: [],
				hasMore: false,
				traversalComplete: true
			};
		}, traversal);
		assertCurrent();
		traversal = status.traversal;
		if (!status.hasMore || status.traversalComplete) return status;
		await setImmediate();
	}
}
async function runProjectionWrite(databaseOptions, operationLabel, operation, signal) {
	return await runExclusiveSqliteSessionWrite(databaseOptions, async () => {
		const write = () => {
			databaseOptions.assertCurrent?.();
			return runOpenClawAgentWriteTransaction(operation, databaseOptions, { operationLabel });
		};
		return !getOpenClawAgentDatabaseIfOpen(databaseOptions) ? withOpenClawAgentDatabaseRuntime(databaseOptions, write, databaseOptions.assertCurrent) : write();
	}, operationLabel, void 0, "foreground", signal);
}
async function claimPreparedSessionTranscriptProjection(databaseOptions, plan, publication) {
	const claimId = -randomInt(1, 2 ** 47);
	if (!(publication ? await publication.execute({
		type: "claim",
		input: {
			plan,
			claimId
		}
	}) : await runProjectionWrite(databaseOptions, "sessions.transcript-index.claim", (database) => claimPreparedSessionTranscriptProjectionInTransaction(database.db, plan, claimId)))) return;
	let deleteResult = { hasMore: true };
	while (deleteResult.hasMore) {
		const input = {
			maxRowsPerTable: PROJECTION_WRITE_CHUNK_ROWS,
			sessionId: plan.sessionId
		};
		deleteResult = publication ? await publication.execute({
			type: "deleteChunk",
			input
		}) : await runProjectionWrite(databaseOptions, "sessions.transcript-index.delete-chunk", (database) => deletePreparedSessionTranscriptProjectionChunkInTransaction(database.db, input));
		await setImmediate();
	}
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
async function appendPreparedProjectionChunk(databaseOptions, active, rows, publication) {
	const input = {
		..."activeRows" in rows ? rows : { ftsRows: decodeFtsChunk(rows.ftsChunk) },
		sessionId: active.plan.sessionId
	};
	if (publication) await publication.execute({
		type: "appendChunk",
		input
	});
	else await runProjectionWrite(databaseOptions, "activeRows" in rows ? "sessions.transcript-index.active-chunk" : "sessions.transcript-index.fts-chunk", (database) => appendPreparedSessionTranscriptProjectionChunkInTransaction(database.db, input));
	await setImmediate();
}
async function finalizePreparedProjection(databaseOptions, active, publication) {
	if (publication) {
		const result = await publication.execute({
			type: "finalize",
			input: active
		});
		publishUnchangedSessionTranscriptReceipts(result.transcriptPublication);
		if (result.sessionKey !== void 0) sessionChanges.emit({
			storePath: databaseOptions.path,
			sessionKey: result.sessionKey,
			scope: "transcript",
			facts: { kind: "unchanged" }
		});
		return result.finalized;
	}
	return await runProjectionWrite(databaseOptions, "sessions.transcript-index.finalize", (database) => {
		const finalized = finalizePreparedSessionTranscriptProjectionInTransaction(database.db, active.plan, active.claimId);
		const session = finalized && executeSqliteQueryTakeFirstSync(database.db, getSessionKysely(database.db).selectFrom("session_windows").select("session_key").where("session_id", "=", active.plan.sessionId));
		if (session) {
			publishUnchangedSessionTranscriptAuthority(database, session.session_key);
			sessionChanges.emit({
				storePath: database.path,
				sessionKey: session.session_key,
				scope: "transcript",
				facts: { kind: "unchanged" }
			}, database.db);
		}
		return finalized;
	});
}
/** Global readiness is a fact maintained on the projection writer's connection. */
async function readSessionTranscriptIndexStatus(params, assertCurrent, signal) {
	signal?.throwIfAborted();
	assertCurrent?.();
	if (captureSessionActorStorageOwner({
		...params,
		storePath: params.path
	}, {
		assertCurrent() {},
		authorize() {}
	})) return false;
	const options = {
		...params,
		env: { ...params.env ?? process.env },
		path: resolveOpenClawAgentSqlitePath(params),
		assertCurrent
	};
	const execution = supportsOpenClawAgentDatabaseExecution(options) ? captureOpenClawAgentDatabaseExecution(options) : void 0;
	let client;
	try {
		if (execution) client = await openOpenClawAgentSqliteWorkerStore(options, { execution }, {
			moduleUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sessionTranscriptProjectionPublication),
			input: void 0
		});
		const status = client ? await drainTranscriptIndexStatus(async () => {
			return (await client.executeExisting({
				type: "preflight",
				input: void 0
			}, () => {
				assertCurrent?.();
				execution.assertCurrent();
			}, { signal }))?.value ?? {
				sessionIds: [],
				hasMore: false,
				traversalComplete: true
			};
		}) : await runProjectionWrite(options, "sessions.transcript-index.preflight", (database) => {
			deleteOrphanedTranscriptIndexRowsInTransaction(database.db);
			return {
				sessionIds: listSessionsNeedingTranscriptIndexReconcile(database.db),
				hasMore: false
			};
		}, signal);
		assertCurrent?.();
		return status.hasMore || status.sessionIds.length > 0;
	} finally {
		try {
			await client?.close();
		} finally {
			await execution?.release();
		}
	}
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
function scheduleTranscriptProjectionReconcile(database, sessionId, projectionNeedsRebuild, options) {
	if (!projectionNeedsRebuild || options.scheduleProjectionReconcile === false) return;
	deferOpenClawAgentPostCommitPublication(database, (databaseOptions) => startSessionTranscriptIndexReconcile({
		...databaseOptions,
		preferredSessionId: sessionId
	}));
}
/** Prepares full trees off-thread, then commits bounded chunks through the runtime writer owner. */
async function reconcileSessionTranscriptIndexes(params) {
	if (captureSessionActorStorageOwner({
		...params,
		storePath: params.path
	}, {
		assertCurrent() {},
		authorize() {}
	})) return { reconciledSessions: 0 };
	const prepared = prepareReconcileParams(params);
	const execution = supportsOpenClawAgentDatabaseExecution(prepared) ? captureOpenClawAgentDatabaseExecution(prepared) : void 0;
	try {
		const result = await runSessionTranscriptReconcileOperation((operation) => reconcilePreparedTranscriptIndexes(prepared, operation, execution), {
			agentId: prepared.agentId,
			path: resolveOpenClawAgentSqlitePath(prepared)
		}, prepared.signal);
		if (result.pending) try {
			prepared.signal?.throwIfAborted();
			prepared.assertCurrent?.();
			execution?.assertCurrent();
			startPreparedSessionTranscriptIndexReconcile(prepared);
		} catch {}
		return { reconciledSessions: result.reconciledSessions };
	} finally {
		await execution?.release();
	}
}
async function reconcilePreparedTranscriptIndexes(params, operation, execution) {
	let reconciledSessions = 0;
	while (true) {
		operation.signal.throwIfAborted();
		const result = await reconcilePreparedTranscriptIndexesPass(params, operation, execution);
		reconciledSessions += result.reconciledSessions;
		if (!result.yielded) return {
			reconciledSessions,
			pending: result.pending
		};
	}
}
async function reconcilePreparedTranscriptIndexesPass(params, operation, execution) {
	operation.signal.throwIfAborted();
	params.assertCurrent?.();
	const databasePath = resolveOpenClawAgentSqlitePath(params);
	const databaseOptions = {
		agentId: params.agentId,
		env: params.env,
		path: databasePath,
		assertCurrent: () => {
			operation.signal.throwIfAborted();
			params.assertCurrent?.();
		}
	};
	const assertCurrent = () => {
		databaseOptions.assertCurrent?.();
		execution?.assertCurrent();
	};
	let publicationClient;
	let publication;
	let releaseDatabase;
	let sessionIds;
	let pending = false;
	try {
		if (execution) {
			execution.assertCurrent();
			operation.signal.throwIfAborted();
			const client = await openOpenClawAgentSqliteWorkerStore(databaseOptions, { execution }, {
				moduleUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sessionTranscriptProjectionPublication),
				input: void 0
			});
			publicationClient = client;
			publication = { execute: (command) => client.execute(command, assertCurrent, { signal: operation.signal }) };
			const status = await readTranscriptIndexBacklog(client, assertCurrent, operation.signal);
			sessionIds = status.sessionIds;
			pending = status.hasMore;
			if (sessionIds.length === 0) return {
				reconciledSessions: 0,
				pending,
				yielded: false
			};
		} else {
			operation.signal.throwIfAborted();
			sessionIds = await runProjectionWrite(databaseOptions, "sessions.transcript-index.preflight", (database) => {
				deleteOrphanedTranscriptIndexRowsInTransaction(database.db);
				const candidates = listSessionsNeedingTranscriptIndexReconcile(database.db);
				if (candidates.length > 0) releaseDatabase = borrowOpenClawAgentDatabase(databaseOptions).release;
				return candidates;
			});
			if (sessionIds.length === 0) return {
				reconciledSessions: 0,
				pending,
				yielded: false
			};
		}
		const preferred = params.preferredSessionId;
		if (preferred && sessionIds.includes(preferred)) sessionIds = [preferred, ...sessionIds.filter((sessionId) => sessionId !== preferred)];
		const input = {
			mode: "disk",
			sessionIds,
			leaseId: randomUUID(),
			agentId: params.agentId,
			path: databasePath,
			stateDir: resolveStateDir(params.env),
			externallySupervised: isGatewayExternallySupervised(params.env)
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
							if (publicationClient) {
								if (!operation.signal.aborted) {
									const status = await drainTranscriptIndexStatus(() => publicationClient.execute({
										type: "sweep",
										input: void 0
									}, assertCurrent, { signal: operation.signal }));
									pending ||= status.hasMore || status.sessionIds.length > 0;
								}
							} else await runProjectionWrite(databaseOptions, "sessions.transcript-index.orphan-sweep", (database) => deleteOrphanedTranscriptIndexRowsInTransaction(database.db));
						} catch (error) {
							if (!operation.signal.aborted || error instanceof AggregateError || error !== operation.signal.reason && !(error instanceof AgentDatabaseExecutionAdmissionClosedError)) {
								settle(() => reject(toStringifiedError(error)));
								return;
							}
						}
						settle(() => resolve({
							reconciledSessions,
							pending,
							yielded: message.yielded
						}));
						return;
					}
					try {
						if (message.type === "plan-start") {
							if (active) throw new Error("session transcript reconcile worker started overlapping plans");
							active = await claimPreparedSessionTranscriptProjection(databaseOptions, message.plan, publication);
							worker.postMessage({
								accepted: active !== void 0,
								type: "continue"
							}, []);
							recordWorkerMessage("admission", "to_worker");
							return;
						}
						if (!active || active.plan.sessionId !== message.sessionId) throw new Error("session transcript reconcile worker sent a chunk for no active plan");
						if (message.type === "plan-finish") {
							const finalized = await finalizePreparedProjection(databaseOptions, active, publication);
							active = void 0;
							if (finalized) reconciledSessions += 1;
							worker.postMessage({
								accepted: finalized,
								type: "continue",
								...operation.shouldYield() ? { yield: true } : {}
							}, []);
							recordWorkerMessage("admission", "to_worker");
							return;
						}
						await appendPreparedProjectionChunk(databaseOptions, active, message.type === "active-chunk" ? { activeRows: message.rows } : { ftsChunk: message.chunk }, publication);
						worker.postMessage({
							accepted: true,
							type: "continue"
						}, []);
						recordWorkerMessage("admission", "to_worker");
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
		return await finishSessionTranscriptReconcileTask({
			operation,
			task,
			input,
			handlingMessage,
			terminalReceived,
			outcome
		});
	} finally {
		releaseDatabase?.();
		await publicationClient?.close();
	}
}
/** Starts one deferred reconcile. No transcript rows are read on the caller's stack. */
function startSessionTranscriptIndexReconcile(input) {
	if (captureSessionActorStorageOwner({
		...input,
		storePath: input.path
	}, {
		assertCurrent() {},
		authorize() {}
	})) return;
	startPreparedSessionTranscriptIndexReconcile(prepareReconcileParams(input));
}
function startPreparedSessionTranscriptIndexReconcile(params) {
	if (isSessionTranscriptReconcileWorkerPoolClosing()) return;
	const key = resolveOpenClawAgentSqlitePath(params);
	const running = runningReconciles.get(key);
	if (running) {
		running.pending = true;
		running.preferredSessionId ??= params.preferredSessionId;
		return;
	}
	const state = {
		pending: false,
		...params.preferredSessionId ? { preferredSessionId: params.preferredSessionId } : {}
	};
	state.assertCurrent = () => {
		params.signal?.throwIfAborted();
		params.assertCurrent?.();
	};
	state.promise = runSessionTranscriptReconcileOperation(async (operation) => {
		const execution = supportsOpenClawAgentDatabaseExecution(params) ? captureOpenClawAgentDatabaseExecution(params) : void 0;
		state.signal = operation.signal;
		try {
			await setImmediate();
			let reconciledSessions = 0;
			let retryCount = 0;
			do {
				operation.signal.throwIfAborted();
				state.assertCurrent?.();
				state.pending = false;
				const pass = {
					...params,
					preferredSessionId: state.preferredSessionId
				};
				delete state.preferredSessionId;
				const result = await reconcilePreparedTranscriptIndexes(pass, operation, execution);
				reconciledSessions += result.reconciledSessions;
				state.pending ||= result.pending;
				if (state.pending) await setTimeout(computeBackoffSchedule(RECONCILE_RETRY_BACKOFF_MS, ++retryCount));
			} while (state.pending);
			runningReconciles.delete(key);
			return { reconciledSessions };
		} finally {
			await execution?.release();
		}
	}, {
		agentId: params.agentId,
		path: key
	}, params.signal).catch((error) => {
		log.warn(`session transcript reconcile failed agent=${params.agentId} error=${error instanceof Error ? error.message : String(error)}`);
		return { reconciledSessions: 0 };
	}).finally(() => {
		if (runningReconciles.get(key) === state) runningReconciles.delete(key);
	});
	runningReconciles.set(key, state);
}
function isSessionTranscriptIndexReconcileRunning(params) {
	if (captureSessionActorStorageOwner({
		...params,
		storePath: params.path
	}, {
		assertCurrent() {},
		authorize() {}
	})) return false;
	return runningReconciles.has(resolveOpenClawAgentSqlitePath(params));
}
/** Test and maintenance wait hook for an already-scheduled reconcile. */
async function waitForSessionTranscriptIndexReconcile(params) {
	if (captureSessionActorStorageOwner({
		...params,
		storePath: params.path
	}, {
		assertCurrent() {},
		authorize() {}
	})) return;
	await runningReconciles.get(resolveOpenClawAgentSqlitePath(params))?.promise;
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
	if (captureSessionActorStorageOwner(scope, {
		assertCurrent() {},
		authorize() {}
	})) {
		abortSignal?.throwIfAborted();
		return;
	}
	const resolved = resolveSqliteTranscriptReadScope(scope);
	const databaseOptions = prepareReconcileParams(toDatabaseOptions(resolved));
	return waitForPreparedSessionTranscriptProjection(resolved.sessionId, databaseOptions, abortSignal);
}
async function waitForPreparedSessionTranscriptProjection(sessionId, databaseOptions, abortSignal) {
	const key = resolveOpenClawAgentSqlitePath(databaseOptions);
	let running = runningReconciles.get(key);
	if (!running) return;
	const needsReconcile = () => readSessionTranscriptProjectionStatus(databaseOptions, sessionId, abortSignal);
	try {
		while (running) {
			abortSignal?.throwIfAborted();
			if (!running.signal?.aborted) {
				running.assertCurrent?.();
				if (!await needsReconcile()) return;
			}
			await setTimeout(PROJECTION_READY_POLL_MS, void 0, abortSignal ? { signal: abortSignal } : void 0);
			running = runningReconciles.get(key);
		}
	} catch (error) {
		if (abortSignal?.aborted && error === abortSignal.reason) throw createAbortError("Operation aborted", { cause: error });
		throw error;
	}
}
//#endregion
export { waitForPreparedSessionTranscriptProjection as a, waitForSessionTranscriptProjection as c, startSessionTranscriptIndexReconcile as i, readSessionTranscriptIndexStatus as l, reconcileSessionTranscriptIndexes as n, waitForSessionTranscriptIndexReconcile as o, scheduleTranscriptProjectionReconcile as r, waitForSessionTranscriptIndexReconcilesInStateDir as s, isSessionTranscriptIndexReconcileRunning as t, prepareReconcileParams as u };
