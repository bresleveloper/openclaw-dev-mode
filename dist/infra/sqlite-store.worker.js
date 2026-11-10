import { a as scheduleOpenClawCompileCacheFlush } from "../node-compile-cache-D2yvJTzP.mjs";
import { a as resolveGlobalSingleton } from "../global-singleton-DrXvEBww.mjs";
import { c as isRecord } from "../record-coerce-TIsquoVR.mjs";
import { n as flushLogger } from "../logger-DR3u4tgD.mjs";
import { i as routeLogsToStderr } from "../console-CML7QnOp.mjs";
import { n as assertDatabasePathIdentity, r as assertExistingDatabaseIdentity } from "../sqlite-worker-identity-DLqVBf5J.mjs";
import { t as isPromiseLike } from "../promise-like-D7-l5Fsp.mjs";
import { r as runWithSqliteBusyTimeout } from "../sqlite-busy-timeout-COlIRjFZ.mjs";
import { H as withSqliteDatabaseAdmissionExchange, m as installSqliteDatabaseAdmissions } from "../sqlite-database-admission-CqdNF9iE.mjs";
import { c as withSqlitePostCommitPublications } from "../sqlite-post-commit-22SfWsLt.mjs";
import { c as withSqliteReaderOwner, r as currentSqliteOperationTiming } from "../sqlite-reader-lifecycle-Cw11HwJP.mjs";
import { t as captureSqliteNativeRuntimeAdmission } from "../node-sqlite-CYaq-2Hb.mjs";
import { a as isSqliteLockError } from "../sqlite-error-diagnostics-BBfTUJBR.mjs";
import { i as createSqliteWorkerTransferReceiver, r as createSqliteWorkerTransferOwner } from "../sqlite-worker-transfer-BHUd6Qxu.mjs";
import { s as runSqliteReservedTransactionSync, t as assertTransactionUsable } from "../sqlite-transaction-CpDyZPQ0.mjs";
import { t as encodeOpenClawStateWorkerError } from "../openclaw-state-worker-error-B93Lf_P2.mjs";
import { t as SQLITE_WORKER_SOURCE_FENCE } from "../sqlite-source-fence-contract-B6Eyonhd.mjs";
import { a as SQLITE_WORKER_PREPARE_ADMITTED, c as SqliteWorkerError, i as SQLITE_WORKER_OPERATION_CLEANUP, l as SqliteWorkerOpenRefusedError, o as SQLITE_WORKER_PREPARE_COMMAND, t as SQLITE_WORKER_CLOSE_RECEIPT } from "../sqlite-worker-contract-DhDutMia.mjs";
import { r as exchangeSqliteDatabaseAdmissions } from "../sqlite-worker-database-admission-relay-CPqKkejS.mjs";
import { d as withSqliteWorkerOperationAdmissionAsync, f as requestSqliteWorkerOperationAdmission, l as takeSqliteWorkerOperationAdmissionAttachment, m as settleSqliteWorkerOperationContext, p as currentSqliteWorkerOperationAdmission, t as assertSqliteWorkerCommitReceiptPending, u as withSqliteWorkerOperationAdmission } from "../sqlite-worker-operation-admission-puNZKEvP.mjs";
import { o as runWithSqliteWorkerStateContext } from "../sqlite-worker-state-context-QuvwmAax.mjs";
import { t as ownedWorkerBytes } from "../worker-transfer-bytes-D_DP0IHa.mjs";
import { n as scheduleWorkerIdleGc, t as cancelWorkerIdleGc } from "../worker-idle-gc-DrnCHdyX.mjs";
import { t as drainProcessOutput } from "../output-drain-DMosb1D5.mjs";
import { isMainThread, parentPort } from "node:worker_threads";
import { setTimeout } from "node:timers/promises";
import { isPromise } from "node:util/types";
import { deserialize, serialize } from "node:v8";
//#region src/infra/sqlite-source-fence.ts
const bindings = resolveGlobalSingleton(Symbol.for("openclaw.sqliteSourceFenceBindings"), () => /* @__PURE__ */ new WeakMap());
/** Bind once after native admission; later uses carry the captured physical facts. */
function bindSqliteSourceFenceDatabase({ database, identity }) {
	const previous = bindings.get(database);
	if (previous) {
		if (!sameIdentity(identity, previous)) throw new SqliteWorkerError("SQLite source fence handle changed incarnation", "closed");
		return;
	}
	const location = database.location();
	if (isMainThread || !location || !identity.physical.key.startsWith("file:") || !identity.incarnation) throw new Error("SQLite source fences require admitted durable worker handles");
	assertDatabasePathIdentity(location, identity.physical);
	bindings.set(database, structuredClone(identity));
}
function sameIdentity(left, right) {
	return right !== void 0 && left.incarnation === right.incarnation && left.physical.key === right.physical.key && left.physical.birthtime === right.physical.birthtime && left.physical.canonicalPath === right.physical.canonicalPath;
}
function readGrant() {
	const value = takeSqliteWorkerOperationAdmissionAttachment();
	if (!isRecord(value) || value.kind !== "sqlite-source-fence" || value.version !== 1 || !(value.decision instanceof SharedArrayBuffer) || value.decision.byteLength !== 4 || !isRecord(value.destination) || !Array.isArray(value.sources) || typeof value.deadlineNs !== "bigint") throw new SqliteWorkerError("SQLite source fence grant is unavailable", "closed");
	return value;
}
function rollbackReservations(reservations) {
	const failures = [];
	for (const { database } of reservations.toReversed()) try {
		if (database.isOpen && database.isTransaction) database.exec("ROLLBACK");
	} catch (error) {
		failures.push(error);
		try {
			database.close();
		} catch (closeError) {
			failures.push(closeError);
		}
	}
	if (failures.length) throw new AggregateError(failures, "SQLite source reservation cleanup failed");
}
/** A native waiter may block MAIN; this interval must complete without host messages. */
function withSqliteWorkerSourceReservations(operation) {
	const scope = currentSqliteWorkerOperationAdmission.getStore();
	if (!scope?.active || scope.owner.sourceReservations) throw new SqliteWorkerError("SQLite source fence requires exclusive operation custody", "closed");
	scope.owner.sourceReservations = true;
	try {
		return operation();
	} finally {
		delete scope.owner.sourceReservations;
	}
}
/**
* Only empty acquisition attempts retry. All reservations live in this worker;
* source rollback follows the destination's definitive COMMIT or rollback.
*/
async function runSqliteSourceFence(fence, inOperation, execute) {
	const grant = inOperation(readGrant);
	if (isMainThread || fence.sources.length === 0 || !sameIdentity(fence.destination.identity, grant.destination) || fence.sources.length !== grant.sources.length || fence.sources.some((source, index) => !sameIdentity(source.identity, grant.sources[index]))) throw new SqliteWorkerError("SQLite source fence differs from its retained owners", "closed");
	const physical = /* @__PURE__ */ new Map();
	for (const source of [fence.destination, ...fence.sources]) {
		bindSqliteSourceFenceDatabase(source);
		const previous = physical.get(source.identity.physical.key);
		if (previous && previous.identity.physical.birthtime !== source.identity.physical.birthtime) throw new SqliteWorkerError("SQLite source fence aliases changed incarnation", "closed");
		physical.set(source.identity.physical.key, previous ?? source);
	}
	const ordered = [...physical.values()].toSorted((a, b) => a.identity.physical.key < b.identity.physical.key ? -1 : 1);
	const captured = /* @__PURE__ */ new Set([fence.destination, ...fence.sources]);
	const resolve = (source) => {
		if (!captured.has(source)) throw new SqliteWorkerError("SQLite source is outside this fence", "closed");
		return physical.get(source.identity.physical.key).database;
	};
	const decision = new Int32Array(grant.decision);
	const assertReady = () => {
		if (Atomics.load(decision, 0) !== 1 || process.hrtime.bigint() >= grant.deadlineNs) throw new SqliteWorkerError("SQLite source fence authority expired", "closed");
		for (const { database } of captured) {
			assertTransactionUsable(database);
			if (!database.isOpen) throw new SqliteWorkerError("SQLite source fence owner is closed", "closed");
		}
	};
	inOperation(() => requestSqliteWorkerOperationAdmission({
		stage: "prepare",
		facts: "sqlite-source-fence"
	}));
	for (;;) {
		let entered = false;
		try {
			return inOperation(() => {
				let cleanupFailure;
				let committedResult;
				try {
					committedResult = withSqlitePostCommitPublications(fence.destination.database, () => withSqliteWorkerSourceReservations(() => {
						assertReady();
						if ([...captured].some(({ database }) => database.isTransaction)) throw new SqliteWorkerError("SQLite source fence cannot join an outer transaction", "closed");
						const reservations = [];
						try {
							for (const source of ordered) runWithSqliteBusyTimeout(source.database, 0, () => {
								source.database.exec("BEGIN IMMEDIATE");
								const timing = currentSqliteOperationTiming();
								if (timing) timing.transactions.count += 1;
								reservations.push(source);
							});
							entered = true;
							return runSqliteReservedTransactionSync(fence.destination.database, () => {
								assertReady();
								const validation = fence.validate(resolve);
								if (isPromiseLike(validation)) throw new Error("SQLite source predicates must remain synchronous");
								assertReady();
								const result = execute();
								assertSqliteWorkerCommitReceiptPending(fence.destination.database);
								return result;
							}, { withCommit(commit) {
								assertReady();
								if (reservations.some(({ database }) => !database.isTransaction)) throw new SqliteWorkerError("SQLite source reservation was lost", "closed");
								if (Atomics.compareExchange(decision, 0, 1, 2) !== 1) throw new SqliteWorkerError("SQLite source fence commit was revoked", "closed");
								commit();
							} });
						} finally {
							try {
								rollbackReservations(reservations);
							} catch (error) {
								cleanupFailure = { error };
							}
						}
					}));
				} catch (error) {
					if (cleanupFailure) throw new AggregateError([error, cleanupFailure.error], "SQLite fence execution and cleanup failed", { cause: error });
					throw error;
				}
				if (cleanupFailure) throw cleanupFailure.error;
				return committedResult;
			});
		} catch (error) {
			if (entered || !isSqliteLockError(error)) throw error;
			assertReady();
			const remainingMs = Number(grant.deadlineNs - process.hrtime.bigint()) / 1e6;
			await setTimeout(Math.min(25, Math.max(0, remainingMs)));
		}
	}
}
//#endregion
//#region src/infra/sqlite-store.worker.ts
if (!parentPort) throw new Error("SQLite store worker requires its host port");
const port = parentPort;
routeLogsToStderr();
const actors = /* @__PURE__ */ new Map();
const transfers = createSqliteWorkerTransferOwner();
let pendingResult;
let pendingInput;
const stateContexts = /* @__PURE__ */ new Map();
let sourceLoaderRegistered = false;
let nativeCleanupFailure;
let operationAdmission;
let nativeRuntimeAdmissionSent = false;
async function loadBackendModule(moduleUrl, sourceLoaderUrl) {
	if (!sourceLoaderRegistered && sourceLoaderUrl) {
		const loader = await import(sourceLoaderUrl);
		if (!isRecord(loader) || typeof loader.register !== "function") throw new Error("SQLite source worker loader is unavailable");
		loader.register();
		sourceLoaderRegistered = true;
	}
	return import(moduleUrl);
}
function runWithActorFacts(actor, operation) {
	const context = stateContexts.get(actor);
	return context ? runWithSqliteWorkerStateContext(context, operation) : operation();
}
function runInActorContext(actor, operation) {
	return runWithActorFacts(actor, () => operationAdmission?.actor === actor ? withSqliteWorkerOperationAdmission(operationAdmission.context, operation) : operation());
}
async function runInActorContextAsync(actor, operation) {
	return runWithActorFacts(actor, () => operationAdmission?.actor === actor ? withSqliteWorkerOperationAdmissionAsync(operationAdmission.context, operation) : operation());
}
async function closeInActorContext(actor, close) {
	const admission = operationAdmission?.actor === actor ? operationAdmission.context : void 0;
	let active = true;
	try {
		await runInActorContext(actor, () => admission ? withSqliteDatabaseAdmissionExchange((facts, location, create) => {
			if (!active) throw new SqliteWorkerError("SQLite close facts outlived native cleanup", "closed");
			return exchangeSqliteDatabaseAdmissions(admission.port, facts, location, create);
		}, close) : close());
	} finally {
		active = false;
	}
}
function assertSynchronousResult(value, phase, beforeReject) {
	if (isPromise(value) || isRecord(value) && typeof value.then === "function") {
		beforeReject?.();
		if (isPromise(value)) value.catch(() => {});
		throw new Error(`SQLite worker ${phase} must remain synchronous`);
	}
}
async function receive(request) {
	const continuation = request.type === "execute-frame" ? pendingInput : request.type === "result-next" && pendingResult?.transferId === request.transferId ? pendingResult : void 0;
	const timing = request.timing ?? (continuation?.requestId === request.id && continuation.actor === request.actor ? continuation.timing : void 0);
	if (timing) timing.received ??= performance.now();
	const transactions = currentSqliteOperationTiming()?.transactions;
	let loadedModules = false;
	let reply;
	let executed = pendingResult !== void 0;
	let retire = false;
	let completeResult = false;
	let inputNext = false;
	let openNotEntered = false;
	let commandAdmissionRefused = false;
	try {
		if (request.databaseAdmissions) installSqliteDatabaseAdmissions(request.databaseAdmissions);
		let value;
		let closeReceipt;
		if (request.type !== "result-next" && request.type !== "execute-frame") {
			if (request.operationAdmission) {
				if (operationAdmission) throw new Error("SQLite operation admission still belongs to the preceding operation");
				operationAdmission = {
					actor: request.actor,
					context: {
						port: request.operationAdmission,
						attachment: request.operationAttachment,
						requestCustody: request.requestCustody,
						executionAuthority: request.executionAuthority
					}
				};
			}
			if (request.stateContext) stateContexts.set(request.actor, request.stateContext);
		}
		const executeCommand = async (command) => {
			if (timing) timing.inputReady = performance.now();
			const backend = actors.get(request.actor);
			if (!backend) throw new Error("SQLite worker actor is closed");
			const typedCommand = command;
			return withSqliteReaderOwner({
				operation: typedCommand.type,
				ownerKind: "worker",
				actorId: request.actor
			}, async () => {
				const assertSettled = () => {
					const settlement = runInActorContext(request.actor, () => ({ settlement: backend.assertSettled?.() })).settlement;
					assertSynchronousResult(settlement, "settlement checks");
					return backend.assertSettled !== void 0;
				};
				const settleCommand = (failure) => {
					let verified;
					try {
						verified = assertSettled();
					} catch (error) {
						if (operationAdmission) settleSqliteWorkerOperationContext(operationAdmission.context, "unknown");
						retire = true;
						if (failure && failure.error !== error) throw new AggregateError([failure.error, error], `${String(failure.error)}; SQLite worker settlement failed: ${String(error)}`, { cause: error });
						throw error;
					}
					try {
						if (verified && backend[SQLITE_WORKER_OPERATION_CLEANUP]) {
							const cleanup = runInActorContext(request.actor, () => ({ cleanup: backend[SQLITE_WORKER_OPERATION_CLEANUP]?.(typedCommand) })).cleanup;
							assertSynchronousResult(cleanup, "operation cleanup");
							assertSettled();
						}
					} catch (error) {
						const cleanupError = error instanceof Error ? error : new Error(String(error));
						nativeCleanupFailure = encodeOpenClawStateWorkerError(cleanupError, { includeOrdinary: true }) ?? encodeOpenClawStateWorkerError(/* @__PURE__ */ new Error("SQLite worker operation cleanup failed"), { includeOrdinary: true });
					} finally {
						if (operationAdmission) settleSqliteWorkerOperationContext(operationAdmission.context, verified ? "completed" : "unknown");
					}
				};
				const loading = backend[SQLITE_WORKER_PREPARE_COMMAND]?.(typedCommand.type);
				if (loading) {
					await loading;
					loadedModules = true;
				}
				try {
					const preparation = runWithActorFacts(request.actor, () => backend.prepare?.(typedCommand));
					if (preparation !== void 0) await preparation;
					if (backend[SQLITE_WORKER_PREPARE_ADMITTED]) {
						const admitted = runInActorContext(request.actor, () => ({ preparation: backend[SQLITE_WORKER_PREPARE_ADMITTED]?.(typedCommand) })).preparation;
						if (admitted !== void 0) await admitted;
					}
					const execute = () => {
						if (timing) timing.executeStarted = performance.now();
						const result = runInActorContext(request.actor, () => ({ result: backend.execute(typedCommand) })).result;
						if (timing) timing.executeFinished = performance.now();
						return result;
					};
					const fence = runInActorContext(request.actor, () => backend[SQLITE_WORKER_SOURCE_FENCE]?.(typedCommand));
					value = fence ? await runSqliteSourceFence(fence, (operation) => runInActorContext(request.actor, operation), execute) : execute();
				} catch (error) {
					const admissionRefused = operationAdmission?.actor === request.actor && operationAdmission.context.refusal !== void 0 && operationAdmission.context.refusal === error;
					settleCommand({ error });
					commandAdmissionRefused = admissionRefused;
					throw error;
				}
				executed = true;
				completeResult = true;
				assertSynchronousResult(value, "operations", () => {
					retire = true;
					if (operationAdmission) settleSqliteWorkerOperationContext(operationAdmission.context, "unknown");
				});
				settleCommand();
			});
		};
		if (request.type === "result-next") {
			if (pendingResult?.requestId !== request.id || pendingResult.actor !== request.actor || pendingResult.transferId !== request.transferId) throw new Error("SQLite worker result transfer is no longer current");
			executed = true;
			const frame = transfers.next(request.transferId);
			if (frame.done) {
				transfers.end(request.transferId);
				pendingResult = void 0;
			}
			value = frame;
		} else if (pendingResult) throw new Error("SQLite worker result transfer has not finished");
		else if (request.type === "execute-start") {
			retire = true;
			if (pendingInput || !actors.has(request.actor) || request.transfer.kinds.length !== 1 || request.transfer.kinds[0] !== "command") throw new Error("SQLite worker received unexpected command staging");
			const input = {
				requestId: request.id,
				actor: request.actor,
				timing,
				command: void 0,
				receiver: createSqliteWorkerTransferReceiver(request.transfer, (record) => {
					input.command = record.value;
				})
			};
			pendingInput = input;
			inputNext = true;
			retire = false;
		} else if (request.type === "execute-frame") {
			retire = true;
			const input = pendingInput;
			if (!input || input.requestId !== request.id || input.actor !== request.actor) throw new Error("SQLite worker command staging is no longer current");
			const frame = deserialize(request.input);
			const counts = input.receiver.accept(frame);
			if (counts) {
				if (counts.length !== 1 || counts[0]?.[1] !== 1) throw new Error("SQLite worker received an incomplete command");
				pendingInput = void 0;
				retire = false;
				await executeCommand(input.command);
			} else {
				inputNext = true;
				retire = false;
			}
		} else if (pendingInput) {
			retire = true;
			throw new Error("SQLite worker command staging has not finished");
		} else if (request.type === "open") {
			if (actors.has(request.actor)) throw new Error("SQLite worker actor is already open");
			if (request.existingIdentity) assertExistingDatabaseIdentity(request.databasePath, request.existingIdentity);
			const module = await loadBackendModule(request.moduleUrl, request.sourceLoaderUrl);
			loadedModules = true;
			const factoryName = request.existingIdentity ? "openExistingSqliteWorkerBackend" : "createSqliteWorkerBackend";
			if (!isRecord(module) || typeof module[factoryName] !== "function") throw new Error(`SQLite worker module must export ${factoryName}`);
			const factory = module[factoryName];
			if (request.existingIdentity) assertExistingDatabaseIdentity(request.databasePath, request.existingIdentity);
			const backend = await runInActorContextAsync(request.actor, () => {
				const input = deserialize(request.input);
				if (request.openAdmission) try {
					requestSqliteWorkerOperationAdmission({
						stage: "open",
						facts: request.openAdmission === "input" ? input : void 0
					});
				} catch (error) {
					openNotEntered = true;
					throw error;
				}
				return factory(input, {
					databasePath: request.databasePath,
					...request.preparation ? { preparation: deserialize(request.preparation) } : {},
					...request.existingIdentity ? { existingIdentity: request.existingIdentity } : {}
				});
			});
			if (!isRecord(backend) || typeof backend.execute !== "function" || typeof backend.close !== "function" || SQLITE_WORKER_PREPARE_COMMAND in backend && backend[SQLITE_WORKER_PREPARE_COMMAND] !== void 0 && typeof backend[SQLITE_WORKER_PREPARE_COMMAND] !== "function" || SQLITE_WORKER_PREPARE_ADMITTED in backend && backend[SQLITE_WORKER_PREPARE_ADMITTED] !== void 0 && (typeof backend[SQLITE_WORKER_PREPARE_ADMITTED] !== "function" || typeof backend.assertSettled !== "function") || SQLITE_WORKER_OPERATION_CLEANUP in backend && backend[SQLITE_WORKER_OPERATION_CLEANUP] !== void 0 && (typeof backend[SQLITE_WORKER_OPERATION_CLEANUP] !== "function" || typeof backend.assertSettled !== "function") || SQLITE_WORKER_SOURCE_FENCE in backend && backend[SQLITE_WORKER_SOURCE_FENCE] !== void 0 && (typeof backend[SQLITE_WORKER_SOURCE_FENCE] !== "function" || typeof backend.assertSettled !== "function") || SQLITE_WORKER_CLOSE_RECEIPT in backend && backend[SQLITE_WORKER_CLOSE_RECEIPT] !== void 0 && typeof backend[SQLITE_WORKER_CLOSE_RECEIPT] !== "function" || backend.assertSettled !== void 0 && typeof backend.assertSettled !== "function" || backend.prepare !== void 0 && typeof backend.prepare !== "function") throw new Error("SQLite worker module returned an invalid backend");
			actors.set(request.actor, backend);
		} else if (request.type === "close") {
			const backend = actors.get(request.actor);
			if (!backend) throw new Error("SQLite worker actor is closed");
			try {
				await closeInActorContext(request.actor, () => backend.close());
				closeReceipt = runInActorContext(request.actor, () => backend[SQLITE_WORKER_CLOSE_RECEIPT]?.());
			} catch (error) {
				retire = true;
				throw error;
			}
			actors.delete(request.actor);
			stateContexts.delete(request.actor);
		} else await executeCommand(deserialize(request.input));
		const serialized = serialize(value);
		if (timing && !inputNext && request.type !== "result-next") timing.serialized = performance.now();
		if (serialized.byteLength > 67108864) {
			if (!completeResult) throw new Error("SQLite worker frame exceeds the transport byte limit");
			const handle = transfers.start([{
				kind: "result",
				serialized
			}].values(), { kinds: ["result"] });
			pendingResult = {
				requestId: request.id,
				actor: request.actor,
				transferId: handle.id,
				timing
			};
			reply = {
				id: request.id,
				ok: true,
				value: serialize(handle),
				transfer: "start"
			};
		} else reply = {
			id: request.id,
			ok: true,
			value: serialized,
			...closeReceipt ? { closeReceipt } : {},
			...request.type === "result-next" ? { transfer: "frame" } : {},
			...inputNext ? { input: "next" } : {}
		};
	} catch (error) {
		const refusedBeforeAgentOpen = error instanceof SqliteWorkerOpenRefusedError;
		if (openNotEntered || request.type === "open" && refusedBeforeAgentOpen) stateContexts.delete(request.actor);
		transfers.cancel();
		pendingResult = void 0;
		pendingInput = void 0;
		const originalError = refusedBeforeAgentOpen ? error.originalError : error;
		const admissionRefused = commandAdmissionRefused || request.type === "open" && operationAdmission?.actor === request.actor && operationAdmission.context.refusal !== void 0 && operationAdmission.context.refusal === originalError;
		const failure = originalError instanceof Error ? originalError : new Error(String(originalError));
		const code = executed ? "outcome-unknown" : "code" in failure ? failure.code : void 0;
		const errorContext = request.stateContext ?? (request.type === "execute-frame" ? stateContexts.get(request.actor) : void 0);
		const sharedState = !executed ? encodeOpenClawStateWorkerError(failure, { includeOrdinary: Boolean(errorContext) }) : void 0;
		reply = {
			id: request.id,
			ok: false,
			...retire || nativeCleanupFailure && executed ? { retire: true } : {},
			...refusedBeforeAgentOpen ? { openOutcome: "refused-before-agent-open" } : {},
			...openNotEntered ? { openNotEntered: true } : {},
			...admissionRefused ? { admissionRefused: true } : {},
			error: {
				name: executed ? "SqliteWorkerError" : failure.name,
				message: failure.message,
				...typeof code === "string" || typeof code === "number" ? { code } : {},
				...sharedState ? { sharedState } : {}
			}
		};
	}
	if (!reply.ok || !pendingInput && !pendingResult) {
		operationAdmission?.context.port.close();
		operationAdmission = void 0;
	}
	if (request.type === "close" && reply.ok && actors.size === 0) {
		await flushLogger();
		await new Promise((resolve) => {
			drainProcessOutput(resolve);
		});
	}
	const complete = !reply.ok || !pendingInput && !pendingResult;
	if (complete && nativeCleanupFailure) {
		reply.cleanupFailure = nativeCleanupFailure;
		nativeCleanupFailure = void 0;
	}
	if (timing) {
		timing.replied = performance.now();
		reply.timing = timing;
	}
	reply.transactionCount = transactions?.count ?? 0;
	if (reply.ok) {
		if (complete && !reply.cleanupFailure && !nativeRuntimeAdmissionSent) {
			const admission = captureSqliteNativeRuntimeAdmission();
			if (admission) {
				reply.nativeRuntimeAdmission = admission;
				nativeRuntimeAdmissionSent = true;
			}
		}
		const bytes = ownedWorkerBytes(reply.value);
		port.postMessage({
			...reply,
			value: bytes
		}, [bytes.buffer]);
	} else port.postMessage(reply, []);
	if (loadedModules) scheduleOpenClawCompileCacheFlush();
	if (complete) scheduleWorkerIdleGc();
}
port.on("message", (request) => {
	cancelWorkerIdleGc();
	withSqliteReaderOwner({
		operation: request.type,
		ownerKind: "worker",
		actorId: request.actor
	}, () => receive(request));
});
//#endregion
export {};
