import { c as isRecord } from "../record-coerce-DItp3I4t.mjs";
import { t as drainProcessOutput } from "../output-drain-DMosb1D5.mjs";
import { a as routeLogsToStderr } from "../console-DwqfhE-H.mjs";
import { s as withSqliteReaderOwner } from "../sqlite-reader-lifecycle-BmcnELSc.mjs";
import { C as withStateDatabaseCoordinatorRuntimeDirectory, d as attachGatewaySchemaFenceDelegate, f as attachStateLifecycleDelegate } from "../sqlite-source-handle-C0wvRR5v.mjs";
import { t as assertExistingDatabaseIdentity } from "../sqlite-worker-identity-CR_ZuhW6.mjs";
import { h as createSqliteWorkerTransferReceiver, m as createSqliteWorkerTransferOwner } from "../sqlite-readonly-worker-CmkAsqCm.mjs";
import { t as encodeOpenClawStateWorkerError } from "../openclaw-state-worker-error-DLFiBmPG.mjs";
import { r as SQLITE_WORKER_PREPARE_COMMAND } from "../sqlite-worker-contract-DgNznZvn.mjs";
import { a as settleSqliteWorkerOperationContext, i as requestSqliteWorkerOperationAdmission, s as withSqliteWorkerOperationAdmission, t as SqliteWorkerOpenRefusedError } from "../sqlite-worker-operation-admission-CG5jL3tH.mjs";
import { t as acquireSqliteWorkerLifecycle } from "../sqlite-worker-lifecycle-preparation-BndbpDqU.mjs";
import { n as scheduleWorkerIdleGc, t as cancelWorkerIdleGc } from "../worker-idle-gc-CYLBZfNA.mjs";
import { t as ownedWorkerBytes } from "../worker-transfer-bytes-D_DP0IHa.mjs";
import { n as runWithSqliteWorkerStateContext } from "../sqlite-worker-state-context-C9ABaq_h.mjs";
import { isPromise } from "node:util/types";
import { parentPort } from "node:worker_threads";
import { deserialize, serialize } from "node:v8";
//#region src/infra/sqlite-store.worker.ts
const port = parentPort;
if (!port) throw new Error("SQLite store worker requires its host port");
routeLogsToStderr();
const actors = /* @__PURE__ */ new Map();
const transfers = createSqliteWorkerTransferOwner();
let pendingResult;
let pendingInput;
const actorPaths = /* @__PURE__ */ new Map();
const stateContexts = /* @__PURE__ */ new Map();
const gatewayFences = /* @__PURE__ */ new Map();
let sourceLoaderRegistered = false;
let preparedGatewayActor;
let lifecycleReply;
let nativeCleanupFailure;
let lifecyclePreparation;
let operationAdmission;
let lifecycle;
let maintenanceFence;
function runWithActorFacts(actor, operation) {
	const context = stateContexts.get(actor);
	return context ? withStateDatabaseCoordinatorRuntimeDirectory(context.coordinatorRuntime, () => runWithSqliteWorkerStateContext(context, operation)) : operation();
}
function runInActorContext(actor, operation) {
	const runAdmitted = () => operationAdmission?.actor === actor ? withSqliteWorkerOperationAdmission(operationAdmission.context, operation) : operation();
	const context = stateContexts.get(actor);
	if (!context) return runAdmitted();
	return withStateDatabaseCoordinatorRuntimeDirectory(context.coordinatorRuntime, () => runWithSqliteWorkerStateContext(context, () => {
		const delegate = maintenanceFence?.actor === actor ? maintenanceFence.delegate : gatewayFences.get(actor);
		const run = () => delegate ? delegate.run(runAdmitted) : runAdmitted();
		return lifecycle?.actor === actor ? lifecycle.delegate.run(run) : run();
	}));
}
async function receive(request) {
	let reply;
	let executed = pendingResult !== void 0;
	let retire = false;
	let completeResult = false;
	let inputNext = false;
	let openNotEntered = false;
	try {
		let value;
		if (request.type !== "result-next" && request.type !== "execute-frame") {
			if (request.lifecyclePreparation) {
				const databasePath = request.stateDatabasePath ?? actorPaths.get(request.actor);
				if (lifecyclePreparation || !request.workerStateLifecycle || !databasePath) throw new Error("SQLite lifecycle preparation differs from its job");
				lifecyclePreparation = {
					actor: request.actor,
					port: request.lifecyclePreparation,
					deadlineNs: request.workerStateLifecycle.deadlineNs,
					databasePath
				};
			}
			if (request.operationAdmission) {
				if (operationAdmission) throw new Error("SQLite operation admission still belongs to the preceding operation");
				operationAdmission = {
					actor: request.actor,
					context: { port: request.operationAdmission }
				};
			}
			if (request.stateContext) stateContexts.set(request.actor, request.stateContext);
			if (request.stateLifecycle) {
				retire = true;
				const context = stateContexts.get(request.actor);
				const databasePath = request.stateDatabasePath ?? (request.type === "open" ? request.databasePath : actorPaths.get(request.actor));
				if (lifecycle || !context || !databasePath) throw new Error("State lifecycle delegate requires its admitting operation");
				lifecycle = {
					actor: request.actor,
					delegate: await attachStateLifecycleDelegate(request.stateLifecycle, {
						databasePath,
						runtimeDirectory: context.coordinatorRuntime.directory,
						actorId: `${request.actor}:${request.id}`
					})
				};
				retire = false;
			}
			if (request.gatewaySchemaFence) {
				retire = true;
				if (gatewayFences.has(request.actor) || !request.stateContext) throw new Error("Gateway schema delegate does not match an admitting shared-state actor");
				const databasePath = request.stateDatabasePath ?? (request.type === "open" ? request.databasePath : actorPaths.get(request.actor));
				if (!databasePath) throw new Error("Gateway schema delegate requires its open actor");
				gatewayFences.set(request.actor, await attachGatewaySchemaFenceDelegate(request.gatewaySchemaFence, {
					databasePath,
					runtimeDirectory: request.stateContext.coordinatorRuntime.directory,
					actorId: String(request.actor)
				}));
				if (request.workerStateLifecycle) preparedGatewayActor = request.actor;
				retire = false;
			}
			if (request.maintenanceSchemaFence) {
				retire = true;
				const context = stateContexts.get(request.actor);
				const databasePath = request.stateDatabasePath ?? (request.type === "open" ? request.databasePath : actorPaths.get(request.actor));
				if (maintenanceFence || !context || !databasePath) throw new Error("Maintenance schema delegate requires its admitting operation");
				maintenanceFence = {
					actor: request.actor,
					delegate: await attachGatewaySchemaFenceDelegate(request.maintenanceSchemaFence, {
						databasePath,
						runtimeDirectory: context.coordinatorRuntime.directory,
						actorId: `${request.actor}:${request.id}`
					})
				};
				retire = false;
			}
		}
		const executeCommand = async (command) => {
			let coordinator;
			if (lifecyclePreparation) {
				const context = stateContexts.get(request.actor);
				if (lifecyclePreparation.actor !== request.actor || !context) throw new Error("SQLite lifecycle preparation lost its captured actor");
				const preparation = lifecyclePreparation;
				lifecyclePreparation = void 0;
				lifecycleReply = {
					actor: request.actor,
					port: preparation.port
				};
				const prepared = await acquireSqliteWorkerLifecycle({
					port: preparation.port,
					databasePath: preparation.databasePath,
					deadlineNs: preparation.deadlineNs,
					runtime: context.coordinatorRuntime,
					onUnsettled: () => {
						retire = true;
					}
				});
				coordinator = prepared.coordinator;
				if (prepared.admission) operationAdmission = {
					actor: request.actor,
					context: { port: prepared.admission }
				};
			}
			const backend = actors.get(request.actor);
			if (!backend) throw new Error("SQLite worker actor is closed");
			preparedGatewayActor = void 0;
			const assertSettled = (failure) => {
				try {
					const settlement = runInActorContext(request.actor, () => backend.assertSettled?.());
					if (isPromise(settlement) || isRecord(settlement) && typeof settlement.then === "function") {
						if (isPromise(settlement)) settlement.catch(() => {});
						throw new Error("SQLite worker settlement checks must remain synchronous");
					}
					return backend.assertSettled !== void 0;
				} catch (error) {
					if (operationAdmission) settleSqliteWorkerOperationContext(operationAdmission.context, "unknown");
					retire = true;
					if (failure && failure.error !== error) throw new AggregateError([failure.error, error], `${String(failure.error)}; SQLite worker settlement failed: ${String(error)}`, { cause: error });
					throw error;
				}
			};
			try {
				const typedCommand = command;
				const loading = backend[SQLITE_WORKER_PREPARE_COMMAND]?.(typedCommand.type);
				if (loading) await loading;
				try {
					const preparation = runWithActorFacts(request.actor, () => backend.prepare?.(typedCommand));
					if (preparation !== void 0) await preparation;
					value = runInActorContext(request.actor, () => withSqliteReaderOwner({
						operation: typedCommand.type,
						ownerKind: "worker",
						actorId: request.actor
					}, () => ({ result: backend.execute(typedCommand) }))).result;
				} catch (error) {
					const verified = assertSettled({ error });
					if (operationAdmission) settleSqliteWorkerOperationContext(operationAdmission.context, verified ? "completed" : "unknown");
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
				const verified = assertSettled();
				if (operationAdmission) settleSqliteWorkerOperationContext(operationAdmission.context, verified ? "completed" : "unknown");
			} finally {
				if (coordinator && !retire) try {
					coordinator.release();
				} catch (error) {
					const failure = error instanceof Error ? error : new Error(String(error));
					nativeCleanupFailure = encodeOpenClawStateWorkerError(failure, { includeOrdinary: true });
				}
			}
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
					...request.preparation ? { preparation: deserialize(request.preparation) } : {},
					...request.existingIdentity ? { existingIdentity: request.existingIdentity } : {}
				});
			});
			if (!isRecord(backend) || typeof backend.execute !== "function" || typeof backend.close !== "function" || SQLITE_WORKER_PREPARE_COMMAND in backend && backend[SQLITE_WORKER_PREPARE_COMMAND] !== void 0 && typeof backend[SQLITE_WORKER_PREPARE_COMMAND] !== "function" || backend.assertSettled !== void 0 && typeof backend.assertSettled !== "function" || backend.prepare !== void 0 && typeof backend.prepare !== "function") throw new Error("SQLite worker module returned an invalid backend");
			actors.set(request.actor, backend);
			actorPaths.set(request.actor, request.databasePath);
		} else if (request.type === "close") {
			const backend = actors.get(request.actor);
			if (!backend) throw new Error("SQLite worker actor is closed");
			await runInActorContext(request.actor, () => backend.close());
			actors.delete(request.actor);
			actorPaths.delete(request.actor);
			stateContexts.delete(request.actor);
			gatewayFences.get(request.actor)?.close();
			gatewayFences.delete(request.actor);
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
			...request.type === "result-next" ? { transfer: "frame" } : {},
			...inputNext ? { input: "next" } : {}
		};
	} catch (error) {
		if (openNotEntered && request.type === "open") {
			gatewayFences.get(request.actor)?.close();
			gatewayFences.delete(request.actor);
			stateContexts.delete(request.actor);
		}
		if (preparedGatewayActor !== void 0) {
			gatewayFences.get(preparedGatewayActor)?.close();
			gatewayFences.delete(preparedGatewayActor);
			preparedGatewayActor = void 0;
		}
		transfers.cancel();
		pendingResult = void 0;
		pendingInput = void 0;
		const refusedOpen = request.type === "open" && error instanceof SqliteWorkerOpenRefusedError;
		const originalError = refusedOpen ? error.originalError : error;
		const failure = originalError instanceof Error ? originalError : new Error(String(originalError));
		const code = executed ? "outcome-unknown" : "code" in failure ? failure.code : void 0;
		const sharedState = (request.stateContext ?? (request.type === "execute-frame" ? stateContexts.get(request.actor) : void 0)) && !executed ? encodeOpenClawStateWorkerError(failure) : void 0;
		reply = {
			id: request.id,
			ok: false,
			...retire || nativeCleanupFailure && executed ? { retire: true } : {},
			...refusedOpen ? { openOutcome: "refused-before-agent-open" } : {},
			...openNotEntered ? { openNotEntered: true } : {},
			error: {
				name: executed ? "SqliteWorkerError" : failure.name,
				message: failure.message,
				...typeof code === "string" || typeof code === "number" ? { code } : {},
				...sharedState ? { sharedState } : {}
			}
		};
	}
	if (!reply.ok || !pendingInput && !pendingResult) {
		maintenanceFence?.delegate.close();
		maintenanceFence = void 0;
		lifecycle?.delegate.close();
		lifecycle = void 0;
		lifecyclePreparation?.port.close();
		lifecyclePreparation = void 0;
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
	const resultPort = lifecycleReply?.actor === request.actor ? lifecycleReply.port : void 0;
	if (reply.ok) {
		const bytes = ownedWorkerBytes(reply.value);
		const outgoing = {
			...reply,
			value: bytes
		};
		if (resultPort) resultPort.postMessage({
			type: "result",
			reply: outgoing
		}, [bytes.buffer]);
		else port.postMessage(outgoing, [bytes.buffer]);
	} else if (resultPort) resultPort.postMessage({
		type: "result",
		reply
	}, []);
	else port.postMessage(reply, []);
	if (complete) {
		resultPort?.close();
		lifecycleReply = void 0;
		scheduleWorkerIdleGc();
	}
}
port.on("message", (request) => {
	cancelWorkerIdleGc();
	receive(request);
});
//#endregion
export {};
