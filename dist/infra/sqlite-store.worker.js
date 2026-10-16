import { c as isRecord } from "../record-coerce-TIsquoVR.mjs";
import { t as drainProcessOutput } from "../output-drain-DMosb1D5.mjs";
import { s as withSqliteReaderOwner } from "../sqlite-reader-lifecycle-CYQdd96B.mjs";
import { n as assertExistingDatabaseIdentity } from "../sqlite-worker-identity-KSR14F6C.mjs";
import { i as routeLogsToStderr } from "../console-BnFs8ZzT.mjs";
import { n as createSqliteWorkerTransferOwner, r as createSqliteWorkerTransferReceiver } from "../sqlite-worker-transfer-e5ST79iV.mjs";
import { t as encodeOpenClawStateWorkerError } from "../openclaw-state-worker-error-Cmtk9G4_.mjs";
import { a as SQLITE_WORKER_PREPARE_ADMITTED, i as SQLITE_WORKER_OPERATION_CLEANUP, o as SQLITE_WORKER_PREPARE_COMMAND, t as SQLITE_WORKER_CLOSE_RECEIPT } from "../sqlite-worker-contract-C51cJHzg.mjs";
import { c as withSqliteWorkerOperationAdmission, i as requestSqliteWorkerOperationAdmission, o as settleSqliteWorkerOperationContext, t as SqliteWorkerOpenRefusedError } from "../sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { a as runWithSqliteWorkerStateContext } from "../sqlite-worker-state-context-BeVaUlhr.mjs";
import { n as scheduleWorkerIdleGc, t as cancelWorkerIdleGc } from "../worker-idle-gc-DjILq491.mjs";
import { t as ownedWorkerBytes } from "../worker-transfer-bytes-D_DP0IHa.mjs";
import { deserialize, serialize } from "node:v8";
import { parentPort } from "node:worker_threads";
import { isPromise } from "node:util/types";
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
function runWithActorFacts(actor, operation) {
	const context = stateContexts.get(actor);
	return context ? runWithSqliteWorkerStateContext(context, operation) : operation();
}
function runInActorContext(actor, operation) {
	return runWithActorFacts(actor, () => operationAdmission?.actor === actor ? withSqliteWorkerOperationAdmission(operationAdmission.context, operation) : operation());
}
async function receive(request) {
	let reply;
	let executed = pendingResult !== void 0;
	let retire = false;
	let completeResult = false;
	let inputNext = false;
	let openNotEntered = false;
	let commandAdmissionRefused = false;
	try {
		let value;
		let closeReceipt;
		if (request.type !== "result-next" && request.type !== "execute-frame") {
			if (request.operationAdmission) {
				if (operationAdmission) throw new Error("SQLite operation admission still belongs to the preceding operation");
				operationAdmission = {
					actor: request.actor,
					context: { port: request.operationAdmission }
				};
			}
			if (request.stateContext) stateContexts.set(request.actor, request.stateContext);
		}
		const executeCommand = async (command) => {
			const backend = actors.get(request.actor);
			if (!backend) throw new Error("SQLite worker actor is closed");
			const typedCommand = command;
			const assertSettled = () => {
				const settlement = runInActorContext(request.actor, () => ({ settlement: backend.assertSettled?.() })).settlement;
				if (isPromise(settlement) || isRecord(settlement) && typeof settlement.then === "function") {
					if (isPromise(settlement)) settlement.catch(() => {});
					throw new Error("SQLite worker settlement checks must remain synchronous");
				}
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
						if (isPromise(cleanup) || isRecord(cleanup) && typeof cleanup.then === "function") {
							if (isPromise(cleanup)) cleanup.catch(() => {});
							throw new Error("SQLite worker operation cleanup must remain synchronous");
						}
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
			if (loading) await loading;
			try {
				const preparation = runWithActorFacts(request.actor, () => backend.prepare?.(typedCommand));
				if (preparation !== void 0) await preparation;
				if (backend[SQLITE_WORKER_PREPARE_ADMITTED]) {
					const admitted = runInActorContext(request.actor, () => ({ preparation: backend[SQLITE_WORKER_PREPARE_ADMITTED]?.(typedCommand) })).preparation;
					if (admitted !== void 0) await admitted;
				}
				value = runInActorContext(request.actor, () => withSqliteReaderOwner({
					operation: typedCommand.type,
					ownerKind: "worker",
					actorId: request.actor
				}, () => ({ result: backend.execute(typedCommand) }))).result;
			} catch (error) {
				const admissionRefused = operationAdmission?.actor === request.actor && operationAdmission.context.refusal !== void 0 && operationAdmission.context.refusal === error;
				settleCommand({ error });
				commandAdmissionRefused = admissionRefused;
				throw error;
			}
			executed = true;
			completeResult = true;
			if (isPromise(value) || isRecord(value) && typeof value.then === "function") {
				retire = true;
				if (operationAdmission) settleSqliteWorkerOperationContext(operationAdmission.context, "unknown");
				if (isPromise(value)) value.catch(() => {});
				throw new Error("SQLite worker operations must remain synchronous");
			}
			settleCommand();
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
			if (!sourceLoaderRegistered && request.sourceLoaderUrl) {
				const loader = await import(request.sourceLoaderUrl);
				if (!isRecord(loader) || typeof loader.register !== "function") throw new Error("SQLite source worker loader is unavailable");
				loader.register();
				sourceLoaderRegistered = true;
			}
			const module = await import(request.moduleUrl);
			const factoryName = request.existingIdentity ? "openExistingSqliteWorkerBackend" : "createSqliteWorkerBackend";
			if (!isRecord(module) || typeof module[factoryName] !== "function") throw new Error(`SQLite worker module must export ${factoryName}`);
			const factory = module[factoryName];
			if (request.existingIdentity) assertExistingDatabaseIdentity(request.databasePath, request.existingIdentity);
			const backend = await runInActorContext(request.actor, () => {
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
					...request.target ? { target: request.target } : {},
					...request.preparation ? { preparation: deserialize(request.preparation) } : {},
					...request.existingIdentity ? { existingIdentity: request.existingIdentity } : {}
				});
			});
			if (!isRecord(backend) || typeof backend.execute !== "function" || typeof backend.close !== "function" || SQLITE_WORKER_PREPARE_COMMAND in backend && backend[SQLITE_WORKER_PREPARE_COMMAND] !== void 0 && typeof backend[SQLITE_WORKER_PREPARE_COMMAND] !== "function" || SQLITE_WORKER_PREPARE_ADMITTED in backend && backend[SQLITE_WORKER_PREPARE_ADMITTED] !== void 0 && (typeof backend[SQLITE_WORKER_PREPARE_ADMITTED] !== "function" || typeof backend.assertSettled !== "function") || SQLITE_WORKER_OPERATION_CLEANUP in backend && backend[SQLITE_WORKER_OPERATION_CLEANUP] !== void 0 && (typeof backend[SQLITE_WORKER_OPERATION_CLEANUP] !== "function" || typeof backend.assertSettled !== "function") || SQLITE_WORKER_CLOSE_RECEIPT in backend && backend[SQLITE_WORKER_CLOSE_RECEIPT] !== void 0 && typeof backend[SQLITE_WORKER_CLOSE_RECEIPT] !== "function" || backend.assertSettled !== void 0 && typeof backend.assertSettled !== "function" || backend.prepare !== void 0 && typeof backend.prepare !== "function") throw new Error("SQLite worker module returned an invalid backend");
			actors.set(request.actor, backend);
		} else if (request.type === "close") {
			const backend = actors.get(request.actor);
			if (!backend) throw new Error("SQLite worker actor is closed");
			try {
				await runInActorContext(request.actor, () => backend.close());
				closeReceipt = runInActorContext(request.actor, () => backend[SQLITE_WORKER_CLOSE_RECEIPT]?.());
			} catch (error) {
				retire = true;
				throw error;
			}
			actors.delete(request.actor);
			stateContexts.delete(request.actor);
		} else await executeCommand(deserialize(request.input));
		const serialized = serialize(value);
		if (serialized.byteLength > 67108864) {
			if (!completeResult) throw new Error("SQLite worker frame exceeds the transport byte limit");
			const handle = transfers.start([{
				kind: "result",
				serialized
			}].values(), { kinds: ["result"] });
			pendingResult = {
				requestId: request.id,
				actor: request.actor,
				transferId: handle.id
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
		if (openNotEntered && request.type === "open") stateContexts.delete(request.actor);
		transfers.cancel();
		pendingResult = void 0;
		pendingInput = void 0;
		const refusedOpen = request.type === "open" && error instanceof SqliteWorkerOpenRefusedError;
		const originalError = refusedOpen ? error.originalError : error;
		const admissionRefused = commandAdmissionRefused || request.type === "open" && operationAdmission?.actor === request.actor && operationAdmission.context.refusal !== void 0 && operationAdmission.context.refusal === originalError;
		const failure = originalError instanceof Error ? originalError : new Error(String(originalError));
		const code = executed ? "outcome-unknown" : "code" in failure ? failure.code : void 0;
		const sharedState = (request.stateContext ?? (request.type === "execute-frame" ? stateContexts.get(request.actor) : void 0)) && !executed ? encodeOpenClawStateWorkerError(failure) : void 0;
		reply = {
			id: request.id,
			ok: false,
			...retire || nativeCleanupFailure && executed ? { retire: true } : {},
			...refusedOpen ? { openOutcome: "refused-before-agent-open" } : {},
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
	if (request.type === "close" && reply.ok && actors.size === 0) await new Promise((resolve) => {
		drainProcessOutput(resolve);
	});
	const complete = !reply.ok || !pendingInput && !pendingResult;
	if (complete && nativeCleanupFailure) {
		reply.cleanupFailure = nativeCleanupFailure;
		nativeCleanupFailure = void 0;
	}
	if (reply.ok) {
		const bytes = ownedWorkerBytes(reply.value);
		port.postMessage({
			...reply,
			value: bytes
		}, [bytes.buffer]);
	} else port.postMessage(reply, []);
	if (complete) scheduleWorkerIdleGc();
}
port.on("message", (request) => {
	cancelWorkerIdleGc();
	receive(request);
});
//#endregion
export {};
