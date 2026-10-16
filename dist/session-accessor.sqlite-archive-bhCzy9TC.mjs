import { d as toStringifiedError } from "./error-coercion-CvJK4lmH.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as resolveRuntimeWorkerUrl, r as resolveRuntimeWorkerThreadExecArgv } from "./runtime-worker-url-DoBSDhBS.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-Dgz2IR4T.mjs";
import { n as createCpuTrackedWorker } from "./worker-cpu-DU6Cf6Aq.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { _ as registerOpenClawStateDatabaseAsyncResource, n as captureOpenClawStateDatabaseReadAdmission } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { a as getOpenClawAgentDatabaseValidationForTransfer, i as getOpenClawAgentDatabaseValidation, n as captureOpenClawAgentDatabaseValidationTransfer, t as adoptOpenClawAgentDatabaseValidation } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { a as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-x2MmUEok.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { a as observeSqliteMutationWorkerEnd, r as withSqliteMutationWorkerCoordination, s as terminateSqliteMutationWorker } from "./session-accessor.sqlite-worker-coordination-CnWXpMvZ.mjs";
import { s as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-EUbUbAQu.mjs";
import { n as sqliteSessionStateDeleteSnapshotsEqual } from "./session-accessor.sqlite-delete-snapshot-BD2fHbEP.mjs";
import { r as revokeSqliteReclamationCommit } from "./session-accessor.sqlite-reclamation-commit-CC945S9j.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { isMainThread, threadId } from "node:worker_threads";
import { performance } from "node:perf_hooks";
//#region src/config/sessions/session-accessor.sqlite-archive-session.ts
const sessions = resolveGlobalSingleton(Symbol.for("openclaw.sqliteArchiveSessions"), () => ({ context: new AsyncLocalStorage() }));
/** Reuse only execution; each archive request still closes its read-only and file handles. */
async function withSqliteTranscriptArchiveSession(options, run) {
	const current = sessions.context.getStore();
	if (current?.matches(options)) {
		current.assertCurrent();
		return run();
	}
	const session = new ArchiveSession(options);
	try {
		return await sessions.context.run(session, run);
	} finally {
		await session.close();
	}
}
/** Queue selection stays with the existing archive owner, including unscoped/cold requests. */
function runScopedSqliteArchiveOperation(request, createWorker, enqueue) {
	const session = sessions.context.getStore();
	return session ? enqueue(() => session.run(request, createWorker)) : void 0;
}
var ArchiveSession = class {
	constructor(options) {
		this.revoked = false;
		this.operationId = 0;
		const env = { ...options.env ?? process.env };
		env.OPENCLAW_STATE_DIR = resolveStateDir(env);
		this.options = {
			agentId: normalizeAgentId(options.agentId),
			env: { OPENCLAW_STATE_DIR: env.OPENCLAW_STATE_DIR },
			path: resolveOpenClawAgentSqlitePath({
				...options,
				env
			})
		};
		this.state = captureOpenClawStateDatabaseReadAdmission(options.database?.path ?? resolveOpenClawStateSqlitePath(env));
		this.unregisterAgent = registerOpenClawAgentDatabaseAsyncResource({
			agentId: this.options.agentId,
			path: this.options.path,
			revoke: () => {
				this.revoked = true;
			},
			close: () => this.close()
		});
		try {
			this.unregisterState = registerOpenClawStateDatabaseAsyncResource({ close: async (identity) => {
				if (!identity || identity.key === this.state.identity.key) await this.close();
			} });
		} catch (error) {
			this.unregisterAgent();
			throw error;
		}
	}
	matches(options) {
		return !this.revoked && this.options.agentId === normalizeAgentId(options.agentId) && this.options.path === resolveOpenClawAgentSqlitePath(options) && this.state.databasePath === path.resolve(options.database?.path ?? resolveOpenClawStateSqlitePath(options.env));
	}
	assertCurrent() {
		if (this.revoked) throw new Error("SQLite archive session was revoked");
		this.state.assertCurrent();
	}
	async run(request, createWorker) {
		this.assertCurrent();
		if (request.plans.some((plan) => normalizeAgentId(plan.agentId) !== this.options.agentId || path.resolve(plan.databasePath) !== this.options.path)) throw new Error("SQLite archive request changed its captured database owner");
		if (sessions.warm && sessions.warm !== this) await sessions.warm.retire();
		this.assertCurrent();
		await this.connection?.retiring;
		this.assertCurrent();
		const connection = this.connection ??= this.start(createWorker);
		sessions.warm = this;
		const operationId = ++this.operationId;
		const dispatched = new Promise((resolve, reject) => {
			const cleanup = () => {
				connection.worker.off("message", receive);
				connection.worker.off("exit", exit);
			};
			const receive = (response) => {
				const expectedType = request.operation === "materialize" ? "done" : request.operation === "publish" ? "published" : request.operation === "read-page" ? "page-read" : "final-read";
				if (!isRecord(response) || response.type !== expectedType || response.operationId !== operationId || response.settled !== true || !Array.isArray(response.results)) {
					connection.failure = /* @__PURE__ */ new Error("SQLite archive Worker returned an invalid operation result");
					connection.worker.terminate();
					return;
				}
				cleanup();
				resolve(response);
			};
			const exit = () => {
				cleanup();
				reject(connection.failure ?? /* @__PURE__ */ new Error("SQLite archive Worker exited before operation settlement"));
			};
			connection.worker.on("message", receive);
			connection.worker.once("exit", exit);
			try {
				this.assertCurrent();
				if (connection.failure || connection.didExit) throw connection.failure ?? /* @__PURE__ */ new Error("SQLite archive Worker has exited");
				connection.worker.postMessage({
					...request,
					type: "archive-operation",
					operationId
				}, []);
			} catch (error) {
				cleanup();
				reject(toStringifiedError(error));
			}
		});
		this.dispatched = dispatched;
		let result;
		try {
			result = await dispatched;
		} catch (error) {
			await this.retire();
			throw error;
		} finally {
			if (this.dispatched === dispatched) this.dispatched = void 0;
		}
		if (result.type === "published" && result.results.some((entry) => entry.error !== void 0)) await this.retire();
		this.assertCurrent();
		return result;
	}
	start(createWorker) {
		this.operationId = 0;
		const worker = createWorker({
			type: "sqlite-transcript-archive-v2",
			operation: "archive-session",
			env: this.options.env
		});
		const connection = {
			worker,
			didExit: false,
			exited: Promise.resolve()
		};
		worker.on("error", (error) => {
			connection.failure ??= toStringifiedError(error);
		});
		worker.on("messageerror", (error) => {
			connection.failure ??= toStringifiedError(error);
			worker.terminate();
		});
		connection.exited = new Promise((resolve) => {
			worker.once("exit", (code) => {
				connection.didExit = true;
				if (code !== 0) connection.failure ??= /* @__PURE__ */ new Error(`SQLite archive Worker exited with code ${code}`);
				resolve();
			});
		});
		return connection;
	}
	retire() {
		const connection = this.connection;
		if (!connection) return Promise.resolve();
		return connection.retiring ??= (async () => {
			await this.dispatched?.catch(() => {});
			if (!connection.didExit) try {
				connection.worker.postMessage({ type: "close" }, []);
			} catch {
				await connection.worker.terminate();
			}
			await connection.exited;
			connection.worker.removeAllListeners();
			if (this.connection === connection) this.connection = void 0;
			if (sessions.warm === this) sessions.warm = void 0;
		})();
	}
	async close() {
		this.revoked = true;
		await this.retire();
		this.unregisterAgent();
		this.unregisterState();
	}
};
//#endregion
//#region src/config/sessions/session-accessor.sqlite-worker-request.ts
/** Register before the first await and drain through the parent's retained claim release. */
function withSqliteMutationWorkerLifetime(options, run, callerSignal) {
	callerSignal?.throwIfAborted();
	const completion = createDeferredCore();
	const state = captureOpenClawStateDatabaseReadAdmission(resolveOpenClawStateSqlitePath(options.env));
	const commitGate = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
	const controller = new AbortController();
	const revoke = () => {
		revokeSqliteReclamationCommit(commitGate);
		controller.abort(callerSignal?.aborted ? callerSignal.reason : /* @__PURE__ */ new Error("SQLite mutation Worker request was revoked"));
	};
	const assertCurrent = () => {
		controller.signal.throwIfAborted();
		state.assertCurrent();
	};
	const unregisterAgent = registerOpenClawAgentDatabaseAsyncResource({
		agentId: options.agentId,
		path: options.path,
		revoke,
		close: () => completion.promise
	});
	let unregisterState;
	try {
		unregisterState = registerOpenClawStateDatabaseAsyncResource({ close: async (identity) => {
			if (!identity || identity.key === state.identity.key) {
				revoke();
				await completion.promise;
			}
		} });
	} catch (error) {
		unregisterAgent();
		throw error;
	}
	callerSignal?.addEventListener("abort", revoke, { once: true });
	if (callerSignal?.aborted) revoke();
	return Promise.resolve().then(() => {
		assertCurrent();
		return run({
			assertCurrent,
			commitGate,
			signal: controller.signal
		});
	}).finally(() => {
		callerSignal?.removeEventListener("abort", revoke);
		revoke();
		completion.resolve();
		unregisterAgent();
		unregisterState();
	});
}
/** Transport settlement is separate from the caller's refused authority. */
var SqliteMutationWorkerSettledRefusal = class extends Error {
	constructor(cause) {
		super(cause.message, { cause });
	}
};
/** Share request authority, not connection lifetime: cold mutations join exit; sweeps join each result. */
function runSqliteMutationWorkerRequest(params) {
	const { transport, operationId } = params;
	const validationOwner = params.validationOwner;
	if (validationOwner && "source" in validationOwner) validationOwner.claim.assertCurrent();
	const receiveValidation = validationOwner && "source" in validationOwner ? captureOpenClawAgentDatabaseValidationTransfer(validationOwner.source) : void 0;
	const readValidation = () => {
		if (!validationOwner) return params.readOpeningValidation?.();
		if ("database" in validationOwner) return validationOwner.isCurrent() ? getOpenClawAgentDatabaseValidation(validationOwner.database) : void 0;
		validationOwner.claim.assertCurrent();
		const validation = getOpenClawAgentDatabaseValidationForTransfer(validationOwner.source);
		return validation?.identity === validationOwner.claim.identity ? validation : void 0;
	};
	const adoptValidation = (validation) => {
		if (!validationOwner) return;
		if ("database" in validationOwner) {
			if (validationOwner.isCurrent()) adoptOpenClawAgentDatabaseValidation(validationOwner.database, validation);
			return;
		}
		try {
			validationOwner.claim.assertCurrent();
		} catch {
			return;
		}
		receiveValidation?.(validationOwner.claim.identity, validation);
	};
	const worker = transport.channel;
	return new Promise((resolve, reject) => {
		const runInOperationContext = AsyncLocalStorage.snapshot();
		let result;
		let validation;
		let workerError;
		let transportError;
		let admission;
		let admissionId = 0;
		let completed = false;
		let settledRefusal = false;
		const admissionTasks = [];
		const terminate = () => {
			terminateSqliteMutationWorker(transport).catch((failure) => {
				workerError = new AggregateError([workerError ?? transportError, failure].filter((error) => error !== void 0), "SQLite mutation Worker termination failed", { cause: failure });
			});
		};
		const fail = (error) => {
			workerError ??= toStringifiedError(error);
			terminate();
		};
		const error = (failure) => runInOperationContext(() => {
			transportError ??= toStringifiedError(failure);
		});
		const messageError = (failure) => runInOperationContext(() => {
			error(failure);
			terminate();
		});
		const finish = (code) => {
			if (completed) return;
			completed = true;
			if (admission) {
				admission.diagnostics.releaseCause = code === void 0 ? "worker-release" : "worker-exit";
				admission.released.resolve();
			}
			worker.off("message", receive);
			stopObservingEnd();
			worker.off("error", error);
			worker.off("messageerror", messageError);
			Promise.all(admissionTasks).then(() => {
				const failure = workerError ?? transportError ?? params.getFailure?.();
				if (failure) reject(settledRefusal ? new SqliteMutationWorkerSettledRefusal(failure) : failure);
				else if (code !== void 0 && code !== 0) reject(/* @__PURE__ */ new Error(`SQLite transcript archive worker exited with code ${code}`));
				else if (result === void 0) reject(/* @__PURE__ */ new Error("SQLite session reclamation Worker exited without results"));
				else {
					if (validation) adoptValidation(validation);
					resolve(result);
				}
			}).catch(reject);
		};
		const ended = (ending) => runInOperationContext(() => {
			if (ending.kind === "native-exit") {
				params.onExit?.(ending.code);
				finish(ending.code);
			} else {
				if (ending.kind === "task-failed") transportError ??= ending.error;
				finish();
			}
		});
		const receiveInOperationContext = (message) => {
			if (message.operationId !== operationId) return;
			if (message.type === "commit-request") try {
				params.onCommitRequest();
			} catch (failure) {
				workerError ??= toStringifiedError(failure);
			}
			else if (message.type === "admission-request") {
				if (admission || message.admissionId !== admissionId + 1) {
					fail(/* @__PURE__ */ new Error("SQLite reclamation Worker requested invalid write admission; cleanup is uncertain, restart OpenClaw before deleting the owning agent"));
					return;
				}
				const requested = {
					id: ++admissionId,
					released: createDeferredCore(),
					diagnostics: { admissionId }
				};
				admission = requested;
				const task = params.withWriteAdmission(async (refusal) => {
					if (completed) return;
					if (refusal) workerError ??= toStringifiedError(refusal.error);
					const allowed = refusal === void 0 && workerError === void 0;
					worker.postMessage({
						type: "admission",
						operationId,
						admissionId: requested.id,
						allowed,
						validation: allowed ? readValidation() : void 0
					}, []);
					await requested.released.promise;
					return completed && !workerError && !transportError && !params.getFailure?.() ? result : void 0;
				}, requested.diagnostics).catch(async (failure) => {
					workerError ??= toStringifiedError(failure);
					if (!completed && admission === requested) try {
						worker.postMessage({
							type: "admission",
							operationId,
							admissionId: requested.id,
							allowed: false
						}, []);
					} catch (dispatchError) {
						fail(new AggregateError([workerError, dispatchError], "SQLite reclamation admission failed and Worker cleanup is uncertain; restart OpenClaw before deleting the owning agent"));
					}
					await requested.released.promise;
				});
				admissionTasks.push(task);
			} else if (message.type === "admission-release") {
				if (!admission || message.admissionId !== admission.id) {
					fail(/* @__PURE__ */ new Error("SQLite reclamation Worker released invalid write admission; cleanup is uncertain, restart OpenClaw before deleting the owning agent"));
					return;
				}
				const released = admission;
				admission = void 0;
				released.diagnostics.releaseCause = "worker-release";
				released.released.resolve();
			} else if (message.type === "refused") {
				if (!message.settled || params.completion !== "result") {
					fail(/* @__PURE__ */ new Error("SQLite reclamation Worker omitted refusal settlement"));
					return;
				}
				settledRefusal = true;
				workerError ??= /* @__PURE__ */ new Error("SQLite reclamation Worker request was refused");
				finish();
			} else if (message.type === "reclaimed") {
				if (!message.settled) {
					fail(/* @__PURE__ */ new Error("SQLite reclamation Worker omitted operation settlement"));
					return;
				}
				result = message.result;
				validation = message.validation;
				if (params.completion === "result") finish();
			}
		};
		const receive = (message) => runInOperationContext(receiveInOperationContext, message);
		worker.on("message", receive);
		const stopObservingEnd = observeSqliteMutationWorkerEnd(transport, ended);
		worker.once("error", error);
		worker.once("messageerror", messageError);
		try {
			params.dispatch?.();
		} catch (failure) {
			fail(failure);
		}
	});
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-archive.ts
function createSqliteTranscriptArchiveWorker(workerData) {
	const workerUrl = resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sessionTranscriptArchive);
	return createCpuTrackedWorker(workerUrl, {
		resourceLimits: { maxOldGenerationSizeMb: 512 },
		workerData,
		execArgv: resolveRuntimeWorkerThreadExecArgv(workerUrl)
	});
}
function spawnSqliteTranscriptArchiveWorkerOperation(input) {
	const params = input.expectedMessageType === "reclaimed" ? {
		...input,
		stateContext: captureOpenClawStateWorkerContext({ env: input.workerData.plan.databaseOptions.env })
	} : input;
	let worker;
	try {
		worker = createSqliteTranscriptArchiveWorker(params.workerData);
	} catch (error) {
		return Promise.reject(toStringifiedError(error));
	}
	if (params.expectedMessageType === "reclaimed") {
		const startedAt = performance.now();
		const workerThreadId = worker.threadId;
		let exitCode;
		if (params.diagnostics) params.diagnostics.workerThreadId = workerThreadId;
		const operation = withSqliteMutationWorkerCoordination(params.stateContext, {
			kind: "dedicated",
			channel: worker
		}, 0, (coordination) => runSqliteMutationWorkerRequest({
			transport: {
				kind: "dedicated",
				channel: worker
			},
			operationId: 0,
			completion: "exit",
			onCommitRequest: params.onCommitRequest,
			withWriteAdmission: params.withWriteAdmission,
			validationOwner: params.validationOwner,
			onExit: (code) => {
				exitCode = code;
			},
			dispatch: () => worker.postMessage({
				type: "mutate",
				coordination
			}, [])
		})).then((result) => [result]);
		const observe = (outcome) => {
			const elapsedMs = Math.round(performance.now() - startedAt);
			if (elapsedMs >= 1e3) createSubsystemLogger("session-sqlite").warn("slow SQLite reclamation Worker operation", {
				pid: process.pid,
				threadId,
				isMainThread,
				workerThreadId,
				reclamationKind: params.diagnostics?.kind ?? params.workerData.plan.kind,
				elapsedMs,
				outcome,
				exitCode
			});
		};
		operation.then(() => observe("resolved"), () => observe("rejected")).catch(() => {});
		return operation;
	}
	return new Promise((resolve, reject) => {
		let results;
		let workerError;
		worker.on("message", (message) => {
			if (message.type === params.expectedMessageType) (results ??= []).push(...message.results);
		});
		worker.once("error", (error) => {
			workerError ??= toStringifiedError(error);
		});
		worker.once("exit", (code) => {
			worker.removeAllListeners();
			if (workerError) {
				reject(workerError);
				return;
			}
			if (code !== 0) {
				reject(/* @__PURE__ */ new Error(`SQLite transcript archive worker exited with code ${code}`));
				return;
			}
			if (!results) {
				reject(/* @__PURE__ */ new Error("SQLite transcript archive worker exited without results"));
				return;
			}
			resolve(results);
		});
	});
}
const sqliteTranscriptArchiveWorkerQueue = resolveGlobalSingleton(Symbol.for("openclaw.sqliteTranscriptArchiveWorkerQueue"), () => new KeyedAsyncQueue());
const SQLITE_TRANSCRIPT_ARCHIVE_WORKER_QUEUE_KEY = "lifecycle-archive";
function runExclusiveSqliteTranscriptArchiveWorker(run, signal) {
	if (!signal) return sqliteTranscriptArchiveWorkerQueue.enqueue(SQLITE_TRANSCRIPT_ARCHIVE_WORKER_QUEUE_KEY, run);
	return new Promise((resolve, reject) => {
		let pending = run;
		const cancel = () => {
			pending = void 0;
			reject(toStringifiedError(signal.reason));
		};
		if (signal.aborted) {
			cancel();
			return;
		}
		signal.addEventListener("abort", cancel, { once: true });
		sqliteTranscriptArchiveWorkerQueue.enqueue(SQLITE_TRANSCRIPT_ARCHIVE_WORKER_QUEUE_KEY, () => {
			signal.removeEventListener("abort", cancel);
			const admitted = pending;
			pending = void 0;
			if (!admitted) throw toStringifiedError(signal.reason);
			return admitted();
		}).then(resolve, reject);
	});
}
function runSqliteTranscriptArchiveWorkerOperation(params) {
	return runExclusiveSqliteTranscriptArchiveWorker(() => {
		params.assertCurrent?.();
		return spawnSqliteTranscriptArchiveWorkerOperation(params);
	}, params.signal);
}
function runSqliteTranscriptArchiveWorker(plans) {
	const scoped = runScopedSqliteArchiveOperation({
		operation: "materialize",
		plans
	}, createSqliteTranscriptArchiveWorker, runExclusiveSqliteTranscriptArchiveWorker);
	if (scoped) return scoped.then((result) => {
		if (result.type !== "done") throw new Error("SQLite archive Worker returned another operation's result");
		return result.results;
	});
	return runSqliteTranscriptArchiveWorkerOperation({
		expectedMessageType: "done",
		workerData: {
			operation: "materialize",
			type: "sqlite-transcript-archive-v2",
			plans
		}
	});
}
function runSqliteTranscriptArchivePublishWorker(plans, signal) {
	const scoped = runScopedSqliteArchiveOperation({
		operation: "publish",
		plans
	}, createSqliteTranscriptArchiveWorker, (run) => runExclusiveSqliteTranscriptArchiveWorker(run, signal));
	if (scoped) return scoped.then((result) => {
		if (result.type !== "published") throw new Error("SQLite archive Worker returned another operation's result");
		return result.results;
	});
	return runSqliteTranscriptArchiveWorkerOperation({
		signal,
		expectedMessageType: "published",
		workerData: {
			operation: "publish",
			type: "sqlite-transcript-archive-v2",
			plans
		}
	});
}
/** Probe pending publication without creating a writable database or archive schema. */
async function readPendingSqliteTranscriptArchivesInWorker(plan, signal) {
	signal.throwIfAborted();
	return withSessionHistoryWorkerDatabase({
		agentId: plan.agentId,
		path: plan.databasePath,
		env: plan.env
	}, (reader) => reader.readPendingArchives({ env: plan.env }, signal));
}
async function runSqliteTranscriptArchiveReadWorker(plans) {
	const scoped = runScopedSqliteArchiveOperation({
		operation: "read-final",
		plans
	}, createSqliteTranscriptArchiveWorker, runExclusiveSqliteTranscriptArchiveWorker);
	if (!scoped) throw new Error("SQLite archive reads require their captured database scope");
	const result = await scoped;
	if (result.type !== "final-read") throw new Error("SQLite archive Worker returned another operation's result");
	return result.results;
}
async function runSqliteTranscriptArchivePageWorker(plans) {
	const scoped = runScopedSqliteArchiveOperation({
		operation: "read-page",
		plans
	}, createSqliteTranscriptArchiveWorker, runExclusiveSqliteTranscriptArchiveWorker);
	if (!scoped) throw new Error("SQLite archive reads require their captured database scope");
	const result = await scoped;
	if (result.type !== "page-read") throw new Error("SQLite archive Worker returned another operation's result");
	return result.results;
}
async function materializeSessionStateDeletePlans(plans) {
	const deduped = dedupeSqliteSessionStateDeletePlans(plans);
	const workerPlans = deduped.filter((plan) => plan.archiveTranscript);
	const workerResults = workerPlans.length > 0 ? await runSqliteTranscriptArchiveWorker(workerPlans) : [];
	const resultBySessionId = new Map(workerResults.map((result) => [result.sessionId, result]));
	return deduped.map((plan) => {
		if (!plan.archiveTranscript) return Object.assign({}, plan, {
			archive: null,
			archivedTranscript: null
		});
		const result = resultBySessionId.get(plan.sessionId);
		if (!result) throw new Error(`SQLite transcript archive worker omitted ${plan.sessionId}`);
		const generation = plan.snapshot.generation;
		if (result.archive && !generation) throw new Error(`Cannot archive SQLite transcript without a generation for ${plan.sessionId}`);
		const archivedTranscript = result.archive && generation ? {
			generation,
			sessionId: plan.sessionId,
			archivedPath: path.join(plan.archiveDirectory, result.archive.archiveName),
			sourcePath: path.join(plan.archiveDirectory, `${plan.sessionId}.jsonl`)
		} : null;
		return Object.assign({}, plan, {
			archive: result.archive,
			archivedTranscript
		});
	});
}
function dedupeSqliteSessionStateDeletePlans(plans) {
	const deduped = /* @__PURE__ */ new Map();
	for (const plan of plans) {
		const existing = deduped.get(plan.sessionId);
		if (!existing) {
			deduped.set(plan.sessionId, plan);
			continue;
		}
		if (existing.agentId !== plan.agentId || existing.archiveDirectory !== plan.archiveDirectory || existing.databasePath !== plan.databasePath || existing.reason !== plan.reason || !sqliteSessionStateDeleteSnapshotsEqual(existing.snapshot, plan.snapshot)) throw new Error(`Conflicting SQLite transcript archive plans for ${plan.sessionId}`);
		if (!existing.archiveTranscript && plan.archiveTranscript) deduped.set(plan.sessionId, {
			...existing,
			archiveTranscript: true
		});
	}
	return [...deduped.values()];
}
//#endregion
export { runSqliteTranscriptArchivePageWorker as a, runSqliteTranscriptArchiveWorkerOperation as c, withSqliteMutationWorkerLifetime as d, withSqliteTranscriptArchiveSession as f, runExclusiveSqliteTranscriptArchiveWorker as i, SqliteMutationWorkerSettledRefusal as l, materializeSessionStateDeletePlans as n, runSqliteTranscriptArchivePublishWorker as o, readPendingSqliteTranscriptArchivesInWorker as r, runSqliteTranscriptArchiveReadWorker as s, createSqliteTranscriptArchiveWorker as t, runSqliteMutationWorkerRequest as u };
