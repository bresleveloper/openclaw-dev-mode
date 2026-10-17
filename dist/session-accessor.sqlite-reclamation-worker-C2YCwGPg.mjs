import { d as toStringifiedError } from "./error-coercion-CvJK4lmH.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { o as sqliteReaderDatabasePathKey } from "./sqlite-reader-lifecycle-CYQdd96B.mjs";
import { n as assertExistingDatabaseIdentity } from "./sqlite-worker-identity-KSR14F6C.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { g as publishSqliteWalCheckpointObservation } from "./sqlite-wal-DUSYRhyv.mjs";
import { m as runOutsideOpenClawDatabaseMaintenanceScope } from "./openclaw-state-db-async-lifecycle-DLKxSPCk.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { _ as registerOpenClawStateDatabaseAsyncResource, m as publishOpenClawStateDatabaseWorkerAdmission } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { a as getOpenClawAgentDatabaseValidationForTransfer } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { a as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-x2MmUEok.mjs";
import { t as SQLITE_IDLE_HANDLE_TTL_MS } from "./sqlite-handle-lifecycle-dWd9h3ii.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { n as runOpenClawAgentWorkerWrite } from "./openclaw-agent-write-admission-CKOCIcah.mjs";
import { s as getGatewayRestartDrainSignal } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { t as cleanupRetiredAgentDatabaseLease } from "./openclaw-agent-execution-cleanup-BCHe5J1Y.mjs";
import { a as observeSqliteMutationWorkerEnd, o as sqliteMutationWorkerThreadId, r as withSqliteMutationWorkerCoordination, s as terminateSqliteMutationWorker } from "./session-accessor.sqlite-worker-coordination-CnWXpMvZ.mjs";
import { i as runExclusiveSqliteTranscriptArchiveWorker, l as SqliteMutationWorkerSettledRefusal, t as createSqliteTranscriptArchiveWorker, u as runSqliteMutationWorkerRequest } from "./session-accessor.sqlite-archive-B_Nn5x_K.mjs";
import { r as revokeSqliteReclamationCommit } from "./session-accessor.sqlite-reclamation-commit-CC945S9j.mjs";
import { n as logSqliteReclamationWorkerOutcome, r as logSqliteReclamationWorkerRetirement } from "./session-accessor.sqlite-reclamation-worker-diagnostics-hJYsjFvr.mjs";
import { n as startCanonicalValidationTask, t as captureCanonicalValidationWorkerPool } from "./session-accessor.sqlite-canonical-worker-pool-LbJYIsRQ.mjs";
import { statSync } from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
import { channel } from "node:diagnostics_channel";
import { performance } from "node:perf_hooks";
import { addAbortListener } from "node:events";
//#region src/config/sessions/session-accessor.sqlite-reclamation-worker-lifetime.ts
const log = createSubsystemLogger("session-sqlite");
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
		this.createdAt = performance.now();
		this.opsServed = 0;
		this.kind = "unused";
		this.beforeExit = () => {
			this.close().catch((error) => log.error(String(error)));
		};
		this.onIdle = () => {
			this.close("idle-ttl").catch((error) => log.error(String(error)));
		};
		this.onMemoryPressure = () => this.retireIfIdle();
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
	matches(options, expectedIdentity) {
		return !this.revoked && !this.failure && isDeepStrictEqual(this.options, options) && this.identity === expectedIdentity && resolveOpenClawStateSqlitePath(options.env) === this.stateContext.admission.databasePath;
	}
	assertCurrent(options, claim) {
		claim.assertCurrent();
		this.assertSourceCurrent(options, claim.identity);
	}
	assertSourceCurrent(options, expectedIdentity) {
		this.stateContext.admission.assertCurrent();
		if (this.failure) throw this.failure;
		if (!this.matches(options, expectedIdentity)) throw new Error("SQLite session reclamation database owner is no longer current");
		this.assertPathCurrent();
	}
	assertPathCurrent() {
		const file = statSync(this.options.path, { bigint: true });
		if (`${file.dev}:${file.ino}` !== this.identity) throw new Error("SQLite session reclamation database path was replaced");
	}
	async use(run) {
		this.clearIdleTimer();
		this.transport?.channel.ref();
		const operation = Promise.resolve().then(run);
		this.active = operation;
		try {
			return await operation;
		} finally {
			this.active = void 0;
			if (!this.revoked) {
				this.transport?.channel.unref();
				this.idle = setTimeout(this.onIdle, SQLITE_IDLE_HANDLE_TTL_MS);
				this.idle.unref();
				if (this.onRetired) {
					const drainSignal = getGatewayRestartDrainSignal();
					if (drainSignal.aborted) this.retireIfIdle("revoked");
					else this.idleDrainListener = addAbortListener(drainSignal, () => this.retireIfIdle("revoked"));
				}
			}
		}
	}
	clearIdleTimer() {
		this.idleDrainListener?.[Symbol.dispose]();
		this.idleDrainListener = void 0;
		clearTimeout(this.idle);
	}
	retireIfIdle(reason = "pressure") {
		if (this.transport && this.idle && !this.active && !this.revoked) this.close(reason).catch((error) => log.error(String(error)));
	}
	async prepare(params) {
		const assertCurrent = () => {
			params.assertCurrent();
			this.assertSourceCurrent(this.options, params.expectedSource.key.slice(5));
			assertExistingDatabaseIdentity(this.options.path, params.expectedSource.key, params.expectedSource.birthtime);
		};
		const { source, validation } = await this.runRequest({
			...params,
			assertCurrent,
			databaseOptions: this.options,
			kind: params.plan.kind,
			sessionId: reclamationSessionId(params.plan),
			readOpeningValidation: () => {
				assertCurrent();
				const openingValidation = getOpenClawAgentDatabaseValidationForTransfer(this.options);
				return openingValidation?.identity === params.expectedSource.key.slice(5) ? openingValidation : void 0;
			},
			transferList: [],
			request: (operationId, coordination) => ({
				type: "prepare",
				operationId,
				coordination,
				databaseOptions: this.options,
				expectedSource: params.expectedSource
			})
		});
		assertCurrent();
		try {
			if (!this.lease || `file:${source.identity}` !== params.expectedSource.key || !source.incarnation || params.expectedSource.birthtime !== void 0 && source.birthtime !== params.expectedSource.birthtime || this.preparedSource && !isDeepStrictEqual(this.preparedSource, source)) throw new Error("SQLite reclamation opening did not confirm its original native source and lease");
			assertExistingDatabaseIdentity(source.filename, params.expectedSource.key, params.expectedSource.birthtime);
			this.preparedSource = source;
			return {
				source,
				validation,
				claim: {
					identity: source.identity,
					incarnation: source.incarnation,
					assertCurrent: () => {
						assertCurrent();
						if (this.preparedSource !== source) throw new Error("SQLite reclamation native source changed");
					}
				}
			};
		} catch (error) {
			this.failure ??= toStringifiedError(error);
			throw error;
		}
	}
	run(params) {
		return this.runRequest({
			...params,
			databaseOptions: params.plan.databaseOptions,
			assertCurrent: () => this.assertCurrent(params.plan.databaseOptions, params.claim),
			kind: params.plan.kind,
			sessionId: reclamationSessionId(params.plan),
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
			assertCurrent: () => this.assertCurrent(params.databaseOptions, params.claim),
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
		this.kind = params.kind;
		params.assertCurrent();
		const transport = this.transport ??= await this.start();
		params.assertCurrent();
		const worker = transport.channel;
		if (params.diagnostics) params.diagnostics.workerThreadId = this.workerThreadId;
		const operationId = ++this.operationId;
		this.opsServed += 1;
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
			onCommitRequest: params.onCommitRequest,
			withWriteAdmission: params.withWriteAdmission,
			validationOwner: params.validationOwner,
			readOpeningValidation: params.readOpeningValidation,
			dispatch: () => worker.postMessage(params.request(operationId, coordination), [...params.transferList])
		}).then((value) => ({ value }), (error) => {
			if (error instanceof SqliteMutationWorkerSettledRefusal) return { error: error.cause };
			throw error;
		})).catch((error) => {
			this.failure ??= toStringifiedError(error);
			throw error;
		}).then((outcome) => {
			if ("error" in outcome) throw outcome.error;
			return outcome.value;
		});
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
				try {
					publishOpenClawStateDatabaseWorkerAdmission(this.stateContext.admission);
				} catch (error) {
					this.failure ??= toStringifiedError(error);
				}
				try {
					if (message.receipt.agentId !== this.options.agentId || message.receipt.path !== this.options.path || message.receipt.ownerPid !== process.pid || message.receipt.sharedStateIdentity !== this.stateContext.admission.identity.key || this.lease && !isDeepStrictEqual(this.lease, message.receipt)) throw new Error("SQLite reclamation Worker changed its lease receipt");
					this.lease = message.receipt;
				} catch (error) {
					this.failure ??= toStringifiedError(error);
				}
				if (this.failure) this.requestTermination(transport);
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
		if (this.onRetired) channel("openclaw.memory.critical").subscribe(this.onMemoryPressure);
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
		this.retirementReason ??= "revoked";
		this.revoked = true;
		if (this.commitGate) revokeSqliteReclamationCommit(this.commitGate);
		this.clearIdleTimer();
	}
	async close(reason = "revoked") {
		this.retirementReason ??= reason;
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
					await withSqliteMutationWorkerCoordination(this.stateContext, transport, operationId, async (coordination) => {
						try {
							this.closeRequested = true;
							worker.postMessage({
								type: "close",
								operationId,
								coordination
							}, []);
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
			channel("openclaw.memory.critical").unsubscribe(this.onMemoryPressure);
			this.unregisterAgent();
			this.unregisterState();
			process.off("beforeExit", this.beforeExit);
			this.transport?.channel.removeAllListeners();
			if (this.transport?.kind === "pooled") this.transport.channel.close();
			this.onRetired?.(this);
			logSqliteReclamationWorkerRetirement({
				reason: this.retirementReason ?? reason,
				kind: this.kind,
				startedAt: this.createdAt,
				opsServed: this.opsServed,
				workerThreadId: this.workerThreadId
			});
		})().finally(() => {
			this.closing = void 0;
		});
	}
};
function reclamationSessionId(plan) {
	return plan.kind === "entry" ? plan.preparedTargetSnapshot[0]?.entry.sessionId : plan.kind === "historical-generation" || plan.kind === "history-eviction" ? plan.sessionId : void 0;
}
//#endregion
//#region src/config/sessions/session-accessor.sqlite-reclamation-worker.ts
const retained = resolveGlobalSingleton(Symbol.for("openclaw.sessionReclamationWorkers"), () => /* @__PURE__ */ new Map());
const retainedAliases = resolveGlobalSingleton(Symbol.for("openclaw.sessionReclamationWorkerAliases"), () => /* @__PURE__ */ new WeakMap());
function retainWorkerAlias(worker, options, requestedPath) {
	const alias = path.resolve(requestedPath);
	const aliases = retainedAliases.get(worker) ?? /* @__PURE__ */ new Map();
	if (alias === options.path || aliases.has(alias)) return;
	try {
		const unregister = runOutsideOpenClawDatabaseMaintenanceScope(() => registerOpenClawAgentDatabaseAsyncResource({
			agentId: options.agentId,
			path: alias,
			revoke: () => worker.revoke(),
			close: () => worker.close()
		}));
		aliases.set(alias, unregister);
		retainedAliases.set(worker, aliases);
	} catch (error) {
		worker.revoke();
		throw error;
	}
}
function releaseWorkerAliases(worker) {
	for (const unregister of retainedAliases.get(worker)?.values() ?? []) unregister();
	retainedAliases.delete(worker);
}
/**
* The global archive FIFO bounds ordinary reclamation's whole-buffer heaps.
* `requestedPath` is the caller's locator before it pinned `options.path` to the physical file.
*/
function withSqliteReclamationWorker(options, source, run, assertRequestCurrent, signal, requestedPath) {
	if ("key" in source && (!source.key.startsWith("file:") || options.path !== source.canonicalPath)) return Promise.reject(/* @__PURE__ */ new Error("SQLite reclamation requires its captured existing source"));
	const expectedIdentity = "key" in source ? source.key.slice(5) : source.identity;
	const assertSourceCurrent = () => {
		if ("key" in source) assertExistingDatabaseIdentity(options.path, source.key, source.birthtime);
		else source.assertCurrent();
	};
	return runExclusiveSqliteTranscriptArchiveWorker(() => {
		const key = sqliteReaderDatabasePathKey(options.path);
		return useReclamationWorker({
			worker: retained.get(key),
			retain: (worker) => retained.set(key, worker),
			retire: (worker) => {
				if (retained.get(key) === worker) retained.delete(key);
				releaseWorkerAliases(worker);
			},
			alias: requestedPath
		}, options, expectedIdentity, run, assertRequestCurrent, assertSourceCurrent);
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
			return useReclamationWorker(slot, options, claim.identity, consume, assertCurrent, () => claim.assertCurrent());
		}));
	} finally {
		closed = true;
		await queue.enqueue("canonical-validation", async () => {
			await slot.worker?.close("exclusive-handoff");
		});
	}
}
async function useReclamationWorker(slot, options, expectedIdentity, run, assertRequestCurrent, assertSourceCurrent) {
	assertRequestCurrent();
	assertSourceCurrent();
	if (slot.worker && !slot.worker.matches(options, expectedIdentity)) {
		await slot.worker.close("matches-mismatch");
		slot.worker = void 0;
	}
	assertRequestCurrent();
	const worker = slot.worker ??= new SqliteReclamationWorker(options, expectedIdentity, slot.execution, slot.retire);
	slot.retain?.(worker);
	try {
		if (slot.alias !== void 0) retainWorkerAlias(worker, options, slot.alias);
		return await worker.use(() => run(worker));
	} catch (error) {
		let reusable = false;
		try {
			assertSourceCurrent();
			worker.assertSourceCurrent(options, expectedIdentity);
			reusable = true;
		} catch {}
		if (reusable) throw error;
		try {
			await worker.close("failure");
			if (slot.worker === worker) slot.worker = void 0;
		} catch (cleanupError) {
			throw new AggregateError([error, cleanupError], "SQLite reclamation and cleanup failed", { cause: cleanupError });
		}
		throw error;
	}
}
//#endregion
export { withSqliteReclamationWorker as n, withSqliteCanonicalValidationWorker as t };
