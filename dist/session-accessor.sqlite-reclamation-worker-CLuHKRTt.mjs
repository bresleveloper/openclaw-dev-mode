import { d as toStringifiedError } from "./error-coercion-C787aVxk.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as formatErrorMessageWithCode } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { o as sqliteReaderDatabasePathKey } from "./sqlite-reader-lifecycle-BmcnELSc.mjs";
import { t as SQLITE_IDLE_HANDLE_TTL_MS } from "./sqlite-handle-lifecycle-dWd9h3ii.mjs";
import { d as publishSqliteWalCheckpointObservation } from "./sqlite-wal-BzoPsBh0.mjs";
import { p as captureStateDatabaseCoordinatorRuntime } from "./sqlite-source-handle-C0wvRR5v.mjs";
import { t as redactIdentifier } from "./node-crypto-Df3MIs6V.mjs";
import { _ as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { t as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-Dn3_Z_Oi.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { a as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-o9110hVL.mjs";
import "./openclaw-agent-db-lifecycle-D7S9DdJC.mjs";
import { n as runOpenClawAgentWorkerWrite } from "./openclaw-agent-write-admission-b9fAKekK.mjs";
import { t as cleanupRetiredAgentDatabaseLease } from "./openclaw-agent-execution-cleanup-DuuxK9TG.mjs";
import { a as sqliteMutationWorkerThreadId, i as observeSqliteMutationWorkerEnd, n as withSqliteMutationWorkerCoordination, o as terminateSqliteMutationWorker } from "./session-accessor.sqlite-worker-coordination-wh6w_NYn.mjs";
import { r as runExclusiveSqliteTranscriptArchiveWorker, s as runSqliteMutationWorkerRequest, t as createSqliteTranscriptArchiveWorker } from "./session-accessor.sqlite-archive-DRWDbZcu.mjs";
import { n as revokeSqliteReclamationCommit } from "./session-accessor.sqlite-reclamation-commit-DdiLAbAH.mjs";
import { n as startCanonicalValidationTask, t as captureCanonicalValidationWorkerPool } from "./session-accessor.sqlite-canonical-worker-pool-rJROSs5H.mjs";
import { statSync } from "node:fs";
import { isDeepStrictEqual } from "node:util";
import { performance } from "node:perf_hooks";
import { channel } from "node:diagnostics_channel";
import { isMainThread, threadId } from "node:worker_threads";
//#region src/config/sessions/session-accessor.sqlite-reclamation-worker-diagnostics.ts
const log$1 = createSubsystemLogger("session-sqlite");
const SLOW_RECLAMATION_WORKER_MS = 1e3;
function logSqliteReclamationWorkerOutcome(params) {
	const elapsedMs = Math.round(performance.now() - params.startedAt);
	if (params.outcome !== "rejected" && elapsedMs < SLOW_RECLAMATION_WORKER_MS) return;
	const failureText = (value) => {
		const text = formatErrorMessageWithCode(value);
		return truncateUtf16Safe(params.sessionId ? text.replaceAll(params.sessionId, redactIdentifier(params.sessionId)) : text, 2048);
	};
	log$1.warn(elapsedMs >= SLOW_RECLAMATION_WORKER_MS ? "slow SQLite reclamation Worker operation" : "SQLite reclamation Worker failed", {
		pid: process.pid,
		threadId,
		isMainThread,
		reclamationKind: params.kind,
		workerThreadId: params.workerThreadId,
		elapsedMs,
		outcome: params.outcome,
		exitCode: params.exitCode,
		...params.outcome === "rejected" ? {
			...params.sessionId ? { sessionIdHash: redactIdentifier(params.sessionId) } : {},
			error: failureText(params.failure),
			errorFrame: failureText(toStringifiedError(params.failure).stack?.split("\n").find((line) => line.trimStart().startsWith("at "))?.trim() ?? "")
		} : {}
	});
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-reclamation-worker.ts
const log = createSubsystemLogger("session-sqlite");
const retained = resolveGlobalSingleton(Symbol.for("openclaw.sessionReclamationWorkers"), () => /* @__PURE__ */ new Map());
channel("openclaw.memory.critical").subscribe(() => {
	for (const worker of retained.values()) worker.retireIfIdle();
});
/** The global archive FIFO bounds ordinary reclamation's whole-buffer heaps. */
function withSqliteReclamationWorker(options, claim, run, assertRequestCurrent, signal) {
	return runExclusiveSqliteTranscriptArchiveWorker(() => {
		const key = sqliteReaderDatabasePathKey(options.path);
		return useReclamationWorker({
			worker: retained.get(key),
			retain: (worker) => retained.set(key, worker),
			retire: (worker) => {
				if (retained.get(key) === worker) retained.delete(key);
			}
		}, options, claim, run, assertRequestCurrent);
	}, signal);
}
/** Startup bounds these scopes; each keeps one worker through certification and native close. */
async function withSqliteCanonicalValidationWorker(run) {
	const slot = { execution: captureCanonicalValidationWorkerPool() };
	const queue = new KeyedAsyncQueue();
	let closed = false;
	try {
		return await run((options, claim, consume, assertCurrent) => queue.enqueue("canonical-validation", () => {
			if (closed) throw new Error("Canonical validation Worker scope is closed");
			return useReclamationWorker(slot, options, claim, consume, assertCurrent);
		}));
	} finally {
		closed = true;
		await queue.enqueue("canonical-validation", async () => {
			await slot.worker?.close();
		});
	}
}
async function useReclamationWorker(slot, options, claim, run, assertRequestCurrent) {
	assertRequestCurrent();
	claim.assertCurrent();
	if (slot.worker && !slot.worker.matches(options, claim)) {
		await slot.worker.close();
		slot.worker = void 0;
	}
	assertRequestCurrent();
	const worker = slot.worker ??= new SqliteReclamationWorker(options, claim.identity, slot.execution, slot.retire);
	slot.retain?.(worker);
	try {
		return await worker.use(() => run(worker));
	} catch (error) {
		try {
			await worker.close();
			if (slot.worker === worker) slot.worker = void 0;
		} catch (cleanupError) {
			throw new AggregateError([error, cleanupError], "SQLite reclamation and cleanup failed", { cause: cleanupError });
		}
		throw error;
	}
}
/** Retains only the admitted connection; each caller owns its plan, claim and commit gate. */
var SqliteReclamationWorker = class {
	constructor(options, identity, execution, onRetired) {
		this.options = options;
		this.identity = identity;
		this.execution = execution;
		this.onRetired = onRetired;
		this.nativeExitProven = false;
		this.taskCustodyReleased = false;
		this.closeRequested = false;
		this.healthyCloseAcknowledged = false;
		this.closed = createDeferredCore();
		this.revoked = false;
		this.retired = false;
		this.operationId = 0;
		this.beforeExit = () => {
			this.close().catch((error) => log.error(String(error)));
		};
		this.options = structuredClone(options);
		this.stateContext = captureOpenClawStateWorkerContext({ env: options.env });
		this.unregisterAgent = registerOpenClawAgentDatabaseAsyncResource({
			agentId: options.agentId,
			path: options.path,
			revoke: () => this.revoke(),
			close: () => this.close()
		});
		try {
			this.unregisterState = registerOpenClawStateDatabaseAsyncResource({ close: async (closingIdentity) => {
				if (!closingIdentity || closingIdentity.key === this.stateContext.admission.identity.key) await this.close();
			} });
		} catch (error) {
			this.unregisterAgent();
			throw error;
		}
		process.once("beforeExit", this.beforeExit);
	}
	matches(options, claim) {
		return !this.revoked && isDeepStrictEqual(this.options, options) && this.identity === claim.identity && resolveOpenClawStateSqlitePath(options.env) === this.stateContext.admission.databasePath && captureStateDatabaseCoordinatorRuntime().directory === this.stateContext.coordinatorRuntime.directory;
	}
	assertCurrent(options, claim) {
		claim.assertCurrent();
		this.stateContext.admission.assertCurrent();
		if (this.failure) throw this.failure;
		if (!this.matches(options, claim)) throw new Error("SQLite session reclamation database owner is no longer current");
		this.assertPathCurrent();
	}
	assertPathCurrent() {
		const file = statSync(this.options.path, { bigint: true });
		if (`${file.dev}:${file.ino}` !== this.identity) throw new Error("SQLite session reclamation database path was replaced");
	}
	async use(run) {
		clearTimeout(this.idle);
		this.transport?.channel.ref();
		const operation = Promise.resolve().then(run);
		this.active = operation;
		try {
			return await operation;
		} finally {
			this.active = void 0;
			if (!this.revoked) {
				this.transport?.channel.unref();
				this.idle = setTimeout(this.beforeExit, SQLITE_IDLE_HANDLE_TTL_MS);
				this.idle.unref();
			}
		}
	}
	retireIfIdle() {
		if (this.transport && this.idle && !this.active && !this.revoked) this.close().catch((error) => log.error(String(error)));
	}
	run(params) {
		return this.runRequest({
			...params,
			databaseOptions: params.plan.databaseOptions,
			kind: params.plan.kind,
			sessionId: params.plan.kind === "entry" ? params.plan.preparedTargetSnapshot[0]?.entry.sessionId : params.plan.kind === "historical-generation" || params.plan.kind === "history-eviction" ? params.plan.sessionId : void 0,
			request: (operationId, coordination) => ({
				type: "reclaim",
				operationId,
				commitGate: params.commitGate,
				plan: params.plan,
				coordination
			})
		});
	}
	runCanonicalValidation(params) {
		return this.runRequest({
			...params,
			kind: "canonical-validation",
			transferList: [],
			request: (operationId, coordination) => ({
				type: "canonical-validation",
				operationId,
				commitGate: params.commitGate,
				databaseOptions: params.databaseOptions,
				maxRows: params.maxRows,
				maxBytes: params.maxBytes,
				initializeCanonicalValidation: params.initializeCanonicalValidation,
				coordination
			})
		});
	}
	async runRequest(params) {
		const startedAt = performance.now();
		this.assertCurrent(params.databaseOptions, params.claim);
		const transport = this.transport ??= await this.start();
		this.assertCurrent(params.databaseOptions, params.claim);
		const worker = transport.channel;
		if (params.diagnostics) params.diagnostics.workerThreadId = this.workerThreadId;
		const operationId = ++this.operationId;
		this.commitGate = params.commitGate;
		let exitCode;
		const operation = withSqliteMutationWorkerCoordination(this.stateContext, transport, operationId, (coordination) => runSqliteMutationWorkerRequest({
			transport,
			operationId,
			completion: "result",
			getFailure: () => this.failure,
			onExit: (code) => {
				exitCode = code;
			},
			onCommitRequest: () => {
				const errors = params.onCommitRequest();
				if (errors.length) log.warn("SQLite session reclamation recovered commit settlement errors", {
					errors: errors.map(String),
					path: this.options.path
				});
			},
			withWriteAdmission: params.withWriteAdmission,
			validationOwner: params.validationOwner,
			dispatch: () => worker.postMessage(params.request(operationId, coordination), [...params.transferList, ...coordination.stateLifecycle ? [coordination.stateLifecycle] : []])
		}));
		const observeCompletion = (outcome, failure) => logSqliteReclamationWorkerOutcome({
			startedAt,
			outcome,
			failure,
			kind: params.diagnostics?.kind ?? params.kind,
			workerThreadId: this.workerThreadId,
			exitCode,
			sessionId: params.sessionId
		});
		operation.then(() => observeCompletion("resolved"), (error) => observeCompletion("rejected", error)).catch(() => {});
		return operation.finally(() => {
			this.commitGate = void 0;
		});
	}
	async start() {
		const transport = this.execution ? await startCanonicalValidationTask(this.execution, this.options) : {
			kind: "dedicated",
			channel: createSqliteTranscriptArchiveWorker({
				type: "sqlite-transcript-archive-v2",
				operation: "reclaim",
				databaseOptions: this.options
			})
		};
		const worker = transport.channel;
		this.workerThreadId = sqliteMutationWorkerThreadId(transport);
		if (transport.kind === "pooled") this.operationId = transport.initialOperationId;
		worker.on("message", (message) => {
			if (message.type === "checkpoint") this.observeCheckpoint(message);
			else if (message.type === "closed") {
				this.cleanup = message;
				this.healthyCloseAcknowledged = this.closeRequested && message.settled;
				this.closed.resolve();
			} else if (message.type === "lease") {
				if (message.receipt.agentId !== this.options.agentId || message.receipt.path !== this.options.path || message.receipt.ownerPid !== process.pid || message.receipt.sharedStateIdentity !== this.stateContext.admission.identity.key || this.lease && !isDeepStrictEqual(this.lease, message.receipt)) {
					this.failure = /* @__PURE__ */ new Error("SQLite reclamation Worker changed its lease receipt");
					this.requestTermination(transport);
				} else this.lease = message.receipt;
			}
		});
		worker.once("error", (error) => {
			this.failure ??= toStringifiedError(error);
		});
		worker.once("messageerror", (error) => {
			this.failure ??= toStringifiedError(error);
			this.requestTermination(transport);
		});
		this.ended = new Promise((resolve) => {
			observeSqliteMutationWorkerEnd(transport, (ending) => {
				this.taskCustodyReleased = ending.kind === "task-complete" || ending.kind === "task-failed" && ending.custodyReleased;
				this.nativeExitProven = ending.kind === "native-exit" || ending.kind === "task-failed" && ending.custodyReleased && !this.healthyCloseAcknowledged;
				if (ending.kind === "task-failed") this.failure ??= ending.error;
				else if (ending.kind === "native-exit" && ending.code !== 0 || !this.revoked || !this.cleanup || ending.kind === "task-complete" && !this.cleanup.settled) this.failure ??= /* @__PURE__ */ new Error("SQLite reclamation Worker ended without confirmed cleanup; operation outcome is uncertain");
				resolve();
			});
		});
		return transport;
	}
	observeCheckpoint(message) {
		if (this.retired || this.failure || !this.lease || message.operationId !== this.operationId || this.revoked && !this.closeRequested) return;
		try {
			this.stateContext.admission.assertCurrent();
			this.assertPathCurrent();
			publishSqliteWalCheckpointObservation(this.options.path, message.snapshot);
		} catch {}
	}
	requestTermination(transport) {
		terminateSqliteMutationWorker(transport).catch((error) => {
			this.failure = new AggregateError([this.failure, error].filter((failure) => failure !== void 0), "SQLite reclamation Worker termination failed", { cause: error });
		});
	}
	revoke() {
		this.revoked = true;
		if (this.commitGate) revokeSqliteReclamationCommit(this.commitGate);
		clearTimeout(this.idle);
	}
	async close() {
		this.revoke();
		if (this.retired) return;
		if (this.execution?.failure) {
			await this.execution.retryFailedRetirements();
			if (this.retired) return;
		}
		return this.closing ??= (async () => {
			await this.active?.catch(() => {});
			const transport = this.transport;
			if (transport) {
				const worker = transport.channel;
				worker.ref();
				await runOpenClawAgentWorkerWrite(this.options, async () => {
					const operationId = ++this.operationId;
					await withSqliteMutationWorkerCoordination({
						...this.stateContext,
						coordinatorRuntime: {
							...this.stateContext.coordinatorRuntime,
							keepAlive: false
						}
					}, transport, operationId, async (coordination) => {
						try {
							this.closeRequested = true;
							worker.postMessage({
								type: "close",
								operationId,
								coordination
							}, coordination.stateLifecycle ? [coordination.stateLifecycle] : []);
						} catch (error) {
							await terminateSqliteMutationWorker(transport);
							throw error;
						} finally {
							await (transport.kind === "pooled" ? Promise.race([this.closed.promise, this.ended]) : this.ended);
						}
					});
					if (transport.kind === "pooled") try {
						worker.postMessage({
							type: "release",
							operationId
						}, []);
					} catch (error) {
						await terminateSqliteMutationWorker(transport);
						throw error;
					} finally {
						await this.ended;
					}
				});
			}
			if (transport?.kind === "pooled" && transport.custodyReleased()) {
				this.taskCustodyReleased = true;
				this.nativeExitProven ||= !this.healthyCloseAcknowledged;
			}
			if (this.lease && this.nativeExitProven && !this.cleanup?.settled) {
				const lease = this.lease;
				await cleanupRetiredAgentDatabaseLease({
					context: this.stateContext,
					stopped: this.ended,
					lease,
					assertOwned: () => {
						if (!this.revoked || this.retired || !this.nativeExitProven || this.transport !== transport || this.lease !== lease) throw new Error("SQLite reclamation Worker no longer owns its retired lease");
					}
				});
			} else if (transport && (!this.cleanup?.settled || transport.kind === "pooled" && !this.taskCustodyReleased)) throw new Error("SQLite reclamation Worker cleanup is uncertain; restart OpenClaw before deleting the owning agent");
			if (this.cleanup?.cleanupWarnings.length) log.warn("SQLite session reclamation Worker recovered cleanup failures", {
				errors: this.cleanup.cleanupWarnings,
				path: this.options.path
			});
			this.retired = true;
			this.unregisterAgent();
			this.unregisterState();
			process.off("beforeExit", this.beforeExit);
			this.transport?.channel.removeAllListeners();
			if (this.transport?.kind === "pooled") this.transport.channel.close();
			this.onRetired?.(this);
		})().finally(() => {
			this.closing = void 0;
		});
	}
};
//#endregion
export { withSqliteCanonicalValidationWorker as n, withSqliteReclamationWorker as r, SqliteReclamationWorker as t };
