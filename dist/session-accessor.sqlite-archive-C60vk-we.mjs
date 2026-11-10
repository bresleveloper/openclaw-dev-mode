import { d as toErrorObject, f as toStringifiedError } from "./error-coercion-BwMr25F8.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as runInDetachedAsyncContext } from "./detached-async-context-D04NzekX.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { i as resolveRuntimeWorkerUrl, r as resolveRuntimeWorkerThreadExecArgv } from "./runtime-worker-url-CvMrvFI1.mjs";
import { c as resolveOpenClawStateSqlitePath, l as resolveQuarantineStorePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { n as acquireStateDatabaseSchemaLease, r as assertStateDatabaseAccessAllowed } from "./gateway-state-owner-X3EqhtYx.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { n as createCpuTrackedWorker, o as markWorkerRetirement } from "./worker-cpu-c5lFIb1t.mjs";
import { r as recordWorkerMessage } from "./worker-message-metrics-CcNXClPZ.mjs";
import { V as trackSqliteDatabaseAdmissionWorker } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { o as registerOpenClawAgentDatabaseAsyncResource } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { r as captureOpenClawStateDatabaseReadAdmission, y as registerOpenClawStateDatabaseAsyncResource } from "./openclaw-state-db-cache-R1v7ogY0.mjs";
import { n as retainSqliteWriteAdmissionService } from "./sqlite-transaction-CpDyZPQ0.mjs";
import { r as createSqliteDatabaseAdmissionRelay } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { c as getOpenClawAgentDatabaseValidation, d as hasRevokedOpenClawAgentDatabaseValidation, l as getOpenClawAgentDatabaseValidationForTransfer, n as adoptOpenClawAgentDatabaseValidation, o as captureOpenClawAgentDatabaseValidationTransfer } from "./openclaw-agent-db-validation-cache-9WCf6XyJ.mjs";
import "./openclaw-agent-db-lifecycle-Dodvmz4L.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { o as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import { i as observeSqliteMutationWorkerEnd, n as withSqliteMutationWorkerCoordination, o as terminateSqliteMutationWorker } from "./session-accessor.sqlite-worker-coordination-VYaqe2BP.mjs";
import { r as sqliteSessionStateDeleteSnapshotsEqual } from "./session-accessor.sqlite-delete-snapshot-C7Nn_aNm.mjs";
import { r as revokeSqliteReclamationCommit } from "./session-accessor.sqlite-reclamation-commit-DnAU8RAC.mjs";
import path from "node:path";
import { isMainThread, threadId } from "node:worker_threads";
import { AsyncLocalStorage } from "node:async_hooks";
import { performance } from "node:perf_hooks";
//#region src/config/sessions/session-accessor.sqlite-archive-session.ts
const ARCHIVE_WORKER_IDLE_MS = 3e5;
function clearIdle(connection) {
	if (connection) {
		clearTimeout(connection.idleTimer);
		connection.idleTimer = void 0;
	}
}
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
		const result = await sessions.context.run(session, run);
		await session.release();
		return result;
	} catch (error) {
		await session.close();
		throw error;
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
		this.released = false;
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
		return !this.revoked && !this.released && this.options.agentId === normalizeAgentId(options.agentId) && this.options.path === resolveOpenClawAgentSqlitePath(options) && this.state.databasePath === path.resolve(options.database?.path ?? resolveOpenClawStateSqlitePath(options.env));
	}
	assertCurrent() {
		if (this.revoked || this.released) throw new Error("SQLite archive session was revoked");
		this.state.assertCurrent();
	}
	async run(request, createWorker) {
		this.assertCurrent();
		if (request.plans.some((plan) => normalizeAgentId(plan.agentId) !== this.options.agentId || path.resolve(plan.databasePath) !== this.options.path)) throw new Error("SQLite archive request changed its captured database owner");
		clearIdle(this.connection);
		const previous = sessions.warm;
		if (previous && previous !== this) {
			clearIdle(previous.connection);
			if (!previous.revoked && previous.options.env.OPENCLAW_STATE_DIR === this.options.env.OPENCLAW_STATE_DIR && !previous.connection?.retiring && !previous.connection?.failure && !previous.connection?.didExit) {
				this.connection = previous.connection;
				previous.connection = void 0;
				sessions.warm = this;
			} else await previous.retire();
			if (previous.released) await previous.close();
		}
		this.assertCurrent();
		await this.connection?.retiring;
		this.assertCurrent();
		const connection = this.connection ??= this.start(createWorker);
		sessions.warm = this;
		connection.worker.ref();
		const dispatched = new Promise((resolve, reject) => {
			const cleanup = () => {
				connection.worker.off("message", receive);
				connection.worker.off("exit", exit);
			};
			const receive = (response) => {
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
					type: "archive-operation"
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
			this.armIdle(connection);
		}
		if (result.type === "published" && result.results.some((entry) => entry.error !== void 0)) await this.retire();
		this.assertCurrent();
		return result;
	}
	armIdle(connection) {
		if (connection.idleTimer || this.connection !== connection || connection.retiring || connection.didExit || connection.failure) return;
		connection.idleTimer = runInDetachedAsyncContext(() => setTimeout(() => {
			connection.idleTimer = void 0;
			if (this.connection !== connection) return;
			markWorkerRetirement(connection.worker, "idle_timeout");
			(this.released ? this.close() : this.retire()).catch((error) => {
				process.emitWarning(`SQLite archive worker retirement failed: ${String(error)}`);
			});
		}, ARCHIVE_WORKER_IDLE_MS));
		connection.idleTimer.unref();
	}
	start(createWorker) {
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
				clearIdle(connection);
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
		clearIdle(connection);
		return connection.retiring ??= (async () => {
			await this.dispatched?.catch(() => {});
			connection.worker.ref();
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
	async release() {
		this.released = true;
		const connection = this.connection;
		if (connection && !this.revoked && !connection.retiring && !connection.didExit && !connection.failure) {
			connection.worker.unref();
			return;
		}
		await this.close();
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
	const validationPath = validationOwner ? "database" in validationOwner ? validationOwner.database.path : validationOwner.source.path : params.validationPath;
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
				params.onCommitRequest?.();
			} catch (failure) {
				workerError ??= toStringifiedError(failure);
			}
			else if (message.type === "admission-request") {
				const requested = {
					released: createDeferredCore(),
					diagnostics: { admissionId: ++admissionId }
				};
				admission = requested;
				const task = params.withWriteAdmission(async (refusal) => {
					if (completed) return;
					if (refusal) workerError ??= toStringifiedError(refusal.error);
					const allowed = refusal === void 0 && workerError === void 0;
					const authority = params.databaseAuthority;
					const assertCreationCurrent = () => {
						if (!allowed || completed || workerError || transportError || params.getFailure?.()) throw new Error("SQLite reclamation creation grant is no longer current");
						authority?.assertCurrent();
					};
					const metadata = allowed && authority ? createSqliteDatabaseAdmissionRelay(assertCreationCurrent) : void 0;
					const creationPaths = new Set(authority?.creationPaths.map(resolveIdentityPathViaExistingAncestorSync));
					if (metadata && authority) {
						let schemaLease;
						const assertAccess = () => {
							assertCreationCurrent();
							authority.maintenanceScope?.assertAdmission();
							assertStateDatabaseAccessAllowed(authority.databasePath, {
								maintenanceScope: authority.maintenanceScope,
								schemaLease
							});
						};
						metadata.bindDatabaseAuthority({
							databasePath: resolveIdentityPathViaExistingAncestorSync(authority.databasePath),
							assertRequest: assertCreationCurrent,
							assertAccess,
							assertCreate(location) {
								if (!creationPaths.has(resolveIdentityPathViaExistingAncestorSync(location))) throw new Error("SQLite reclamation creation target differs from its admitted databases");
							},
							acquireSchema() {
								assertAccess();
								const acquire = () => acquireStateDatabaseSchemaLease(authority.databasePath);
								const lease = authority.maintenanceScope ? authority.maintenanceScope.run(acquire) : acquire();
								schemaLease = lease;
								authority.maintenanceScope?.own(lease, "shared-resources", () => lease.release());
								return {
									assertCurrent() {
										assertAccess();
										lease.assertCurrent();
									},
									release: () => lease.release()
								};
							}
						});
					}
					const releaseService = metadata && authority ? retainSqliteWriteAdmissionService(authority.creationPaths, () => metadata.service()) : void 0;
					try {
						worker.postMessage({
							type: "admission",
							operationId,
							allowed,
							validation: allowed ? readValidation() : void 0,
							integrityRevoked: allowed && validationPath !== void 0 ? hasRevokedOpenClawAgentDatabaseValidation(validationPath) : false,
							...metadata ? { databaseAdmissionPort: metadata.port } : {}
						}, metadata ? [metadata.port] : []);
						if (transport.kind === "pooled") recordWorkerMessage("admission", "to_worker");
						await requested.released.promise;
						if (metadata?.failure) throw toErrorObject(metadata.failure, "SQLite worker admission failed");
						return completed && !workerError && !transportError && !params.getFailure?.() ? result : void 0;
					} finally {
						metadata?.finish();
						releaseService?.();
					}
				}, requested.diagnostics).catch(async (failure) => {
					workerError ??= toStringifiedError(failure);
					if (!completed) try {
						worker.postMessage({
							type: "admission",
							operationId,
							allowed: false
						}, []);
						if (transport.kind === "pooled") recordWorkerMessage("admission", "to_worker");
					} catch (dispatchError) {
						fail(new AggregateError([workerError, dispatchError], "SQLite reclamation admission failed and Worker cleanup is uncertain; restart OpenClaw before deleting the owning agent"));
					}
					await requested.released.promise;
				});
				admissionTasks.push(task);
			} else if (message.type === "admission-release") {
				if (admission) {
					admission.diagnostics.releaseCause = "worker-release";
					admission.released.resolve();
					admission = void 0;
				}
			} else if (message.type === "refused") {
				settledRefusal = true;
				workerError ??= /* @__PURE__ */ new Error("SQLite reclamation Worker request was refused");
				finish();
			} else if (message.type === "reclaimed") {
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
function createSqliteTranscriptArchiveWorker(workerData, nativeLocations = []) {
	const workerUrl = resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sessionTranscriptArchive);
	let active = true;
	const admission = createSqliteDatabaseAdmissionRelay(() => {
		if (!active) throw new Error("SQLite archive database admission is closed");
	});
	const releaseService = retainSqliteWriteAdmissionService(nativeLocations, () => admission.service());
	const finish = () => {
		active = false;
		admission.finish();
		releaseService();
	};
	let worker;
	try {
		worker = createCpuTrackedWorker(workerUrl, {
			resourceLimits: { maxOldGenerationSizeMb: 512 },
			workerData: {
				...workerData,
				databaseAdmissionPort: admission.port
			},
			transferList: [admission.port],
			execArgv: resolveRuntimeWorkerThreadExecArgv(workerUrl)
		});
	} catch (error) {
		finish();
		throw error;
	}
	trackSqliteDatabaseAdmissionWorker(worker);
	worker.once("exit", finish);
	return worker;
}
function spawnSqliteTranscriptArchiveWorkerOperation(input) {
	const params = input.expectedMessageType === "reclaimed" ? {
		...input,
		stateContext: captureOpenClawStateWorkerContext({ env: input.workerData.plan.databaseOptions.env })
	} : input;
	let worker;
	try {
		worker = createSqliteTranscriptArchiveWorker(params.workerData, params.expectedMessageType === "reclaimed" ? [params.workerData.plan.databaseOptions.path, params.stateContext.admission.databasePath] : []);
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
			databaseAuthority: {
				databasePath: params.stateContext.admission.databasePath,
				maintenanceScope: params.stateContext.maintenanceScope,
				creationPaths: [
					params.workerData.plan.databaseOptions.path,
					params.stateContext.admission.databasePath,
					resolveQuarantineStorePath(params.stateContext.environment)
				],
				assertCurrent() {
					params.stateContext.admission.assertCurrent();
					params.assertCurrent?.();
				}
			},
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
	const workerPlans = deduped.filter((plan) => plan.archiveTranscript && plan.snapshot.lastSeq !== null);
	const workerResults = workerPlans.length > 0 ? await runSqliteTranscriptArchiveWorker(workerPlans) : [];
	const resultBySessionId = new Map(workerResults.map((result) => [result.sessionId, result]));
	return deduped.map((plan) => {
		if (!plan.archiveTranscript || plan.snapshot.lastSeq === null) return Object.assign({}, plan, {
			archive: null,
			archivedTranscript: null
		});
		const result = resultBySessionId.get(plan.sessionId);
		if (!result) throw new Error(`SQLite transcript archive worker omitted ${plan.sessionId}`);
		return materializedSessionStateDeletePlan(plan, result);
	});
}
/** Plan and stage the selected history in the archive worker's existing read snapshot. */
async function materializeSessionHistoryEvictionPlan(input) {
	const [result] = await runSqliteTranscriptArchiveWorker([input]);
	if (!result || result.sessionId !== input.sessionId || result.preparedPlan === void 0) throw new Error(`SQLite transcript archive worker omitted history planning for ${input.sessionId}`);
	return result.preparedPlan ? materializedSessionStateDeletePlan(result.preparedPlan, result) : null;
}
function materializedSessionStateDeletePlan(plan, result) {
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
export { runExclusiveSqliteTranscriptArchiveWorker as a, runSqliteTranscriptArchiveReadWorker as c, runSqliteMutationWorkerRequest as d, withSqliteMutationWorkerLifetime as f, readPendingSqliteTranscriptArchivesInWorker as i, runSqliteTranscriptArchiveWorkerOperation as l, materializeSessionHistoryEvictionPlan as n, runSqliteTranscriptArchivePageWorker as o, withSqliteTranscriptArchiveSession as p, materializeSessionStateDeletePlans as r, runSqliteTranscriptArchivePublishWorker as s, createSqliteTranscriptArchiveWorker as t, SqliteMutationWorkerSettledRefusal as u };
