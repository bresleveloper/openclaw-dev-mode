import { a as getChildLogger, t as createSubsystemLogger } from "./subsystem-CxjajkOx.js";
import { c as isRecord } from "./string-coerce-Dyy0qgLy.js";
import { g as resolveGlobalSingleton } from "./runtime-doctor-migrations-8XPPImoy.js";
import "./redact-V5IywZh1.js";
import { i as toErrorObject } from "./errors-Dp0Hj51M.js";
import { d as resolveNodeCompileCacheEnv, i as retainOpenClawStateWorkerErrorPayload, n as resolveRuntimeProcessEntrypointUrl, r as hydrateOpenClawStateWorkerError, t as createCpuTrackedWorker } from "./worker-cpu-ew85k7DL.js";
import "./session-key-BEdxOeE4.js";
import "./utils-CROxhhxU.js";
import { n as createDeferredCore } from "./promise-like-ByIJ_1fR.js";
import { Ft as SqliteCoordinatorError, G as readDatabasePathIdentity, It as createSqliteLifecycleAggregateError, Nt as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS, Ot as runInDetachedAsyncContext, Vt as retainSqliteWriteAdmissionService, Yt as SQLITE_IDLE_HANDLE_TTL_MS, _t as withStateDatabaseCoordinatorRuntimeDirectory, an as ensureSqliteLibrarySelected, gt as tryCreateStateLifecycleDelegate, ht as tryCreateGatewaySchemaFenceDelegate, i as publishOpenClawStateDatabaseWorkerAdmission, l as getExistingOpenClawStateSchemaPath, n as getOpenClawStateDatabaseTerminalFailureAsync, o as registerOpenClawStateDatabaseAsyncResource, pt as resolveStateDatabaseCoordinatorPath, s as registerOpenClawStateDatabaseLifecycleListener, u as isExistingOpenClawStateSchema } from "./openclaw-state-db-cache-DbUvW0cs.js";
import { realpath, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { AsyncLocalStorage } from "node:async_hooks";
import "node:fs";
import { availableParallelism } from "node:os";
import { createHash } from "node:crypto";
import { channel } from "node:diagnostics_channel";
import { performance as performance$1 } from "node:perf_hooks";
import { MessageChannel, isMainThread, receiveMessageOnPort } from "node:worker_threads";
import { deserialize, serialize } from "node:v8";
import { isPromise } from "node:util/types";
//#region src/infra/sqlite-worker-transfer.ts
const SQLITE_WORKER_TRANSFER_FRAME_BYTES = 8388608;
/** One owned result cursor; callers supply records and any associated cleanup. */
function createSqliteWorkerTransferOwner() {
	let nextId = 0;
	let current;
	const cleanup = (transfer) => {
		const errors = [];
		if (!transfer.iteratorClosed) try {
			transfer.iterator.return?.();
			transfer.iteratorClosed = true;
		} catch (error) {
			errors.push(error);
		}
		if (!transfer.cleaned) try {
			transfer.cleanup?.();
			transfer.cleaned = true;
		} catch (error) {
			errors.push(error);
		}
		if (errors.length === 1) throw errors[0];
		if (errors.length) throw new AggregateError(errors, "SQLite read transfer cleanup failed", { cause: errors[0] });
	};
	const cancel = () => {
		if (current) {
			cleanup(current);
			current = void 0;
		}
	};
	const requireTransfer = (id) => {
		if (!current || current.id !== id) throw new Error("SQLite read transfer is no longer active");
		return current;
	};
	return {
		start(iterator, options) {
			if (current) throw new Error("The preceding SQLite read transfer was not released");
			current = {
				id: ++nextId,
				iterator,
				cleanup: options.cleanup,
				iteratorClosed: false,
				cleaned: false,
				counts: new Map(options.kinds.map((kind) => [kind, 0])),
				sequence: 0,
				finished: false
			};
			return {
				id: current.id,
				kinds: [...current.counts.keys()]
			};
		},
		next(id) {
			const transfer = requireTransfer(id);
			if (transfer.finished) throw new Error("SQLite read transfer has already reached its end");
			if (transfer.record && transfer.record.offset === transfer.record.bytes.byteLength) transfer.record = void 0;
			if (!transfer.record) {
				const next = transfer.iterator.next();
				if (next.done) {
					cleanup(transfer);
					transfer.finished = true;
					return {
						id,
						sequence: transfer.sequence++,
						done: true,
						counts: [...transfer.counts]
					};
				}
				const { kind } = next.value;
				const count = transfer.counts.get(kind);
				if (count === void 0) throw new Error("SQLite read transfer returned an unexpected record kind");
				transfer.record = {
					kind,
					bytes: "serialized" in next.value ? next.value.serialized : serialize(next.value.value),
					offset: 0
				};
				transfer.counts.set(kind, count + 1);
			}
			const record = transfer.record;
			const offset = record.offset;
			const end = Math.min(record.bytes.byteLength, offset + SQLITE_WORKER_TRANSFER_FRAME_BYTES);
			record.offset = end;
			return {
				id,
				sequence: transfer.sequence++,
				done: false,
				kind: record.kind,
				recordBytes: record.bytes.byteLength,
				offset,
				recordDone: end === record.bytes.byteLength,
				bytes: new Uint8Array(record.bytes.subarray(offset, end))
			};
		},
		end(id) {
			if (!requireTransfer(id).finished) throw new Error("SQLite read transfer ended before its complete result");
			cancel();
		},
		cancel,
		close: cancel
	};
}
/** Reassembles one transfer; its caller owns transport completion and cancellation. */
function createSqliteWorkerTransferReceiver(handle, consume) {
	const counts = new Map(handle.kinds.map((kind) => [kind, 0]));
	let sequence = 0;
	let finished = false;
	let record;
	return { accept(frame) {
		try {
			if (finished || frame.id !== handle.id || frame.sequence !== sequence++) throw new Error("SQLite read transfer frame is out of order");
			if (frame.done) {
				if (record || frame.counts.length !== counts.size || frame.counts.some(([kind, count]) => counts.get(kind) !== count) || new Set(frame.counts.map(([kind]) => kind)).size !== counts.size) throw new Error("SQLite read transfer ended with an incomplete result");
				finished = true;
				return frame.counts;
			}
			const count = counts.get(frame.kind);
			if (count === void 0 || !Number.isSafeInteger(frame.recordBytes) || frame.recordBytes < 1 || !Number.isSafeInteger(frame.offset) || frame.offset < 0 || frame.bytes.byteLength < 1 || frame.bytes.byteLength > 8388608) throw new Error("SQLite read transfer returned an invalid frame");
			if (!record) {
				if (frame.offset !== 0) throw new Error("SQLite read transfer omitted the start of a record");
				record = {
					kind: frame.kind,
					bytes: new Uint8Array(frame.recordBytes),
					offset: 0
				};
			}
			const end = frame.offset + frame.bytes.byteLength;
			if (record.kind !== frame.kind || record.bytes.byteLength !== frame.recordBytes || record.offset !== frame.offset || end > frame.recordBytes || frame.recordDone !== (end === frame.recordBytes)) throw new Error("SQLite read transfer returned a discontinuous record");
			record.bytes.set(frame.bytes, frame.offset);
			record.offset = end;
			if (frame.recordDone) {
				const value = deserialize(record.bytes);
				const kind = record.kind;
				record = void 0;
				consume({
					kind,
					value
				});
				counts.set(kind, count + 1);
			}
			return;
		} catch (error) {
			record = void 0;
			finished = true;
			throw error;
		}
	} };
}
(/* @__PURE__ */ new Map()).keys();
//#endregion
//#region src/infra/sqlite-worker-contract.ts
const SQLITE_WORKER_MAX_MESSAGE_BYTES = 33554432;
const retainedWorkerErrorCode = Symbol.for("openclaw.sqliteWorkerErrorCode");
var SqliteWorkerError = class extends Error {
	constructor(message, code) {
		super(message);
		this.code = code;
		this.name = "SqliteWorkerError";
		Object.defineProperty(this, retainedWorkerErrorCode, { value: code });
	}
};
/** Carry only canonical worker classification through a local cleanup aggregate. */
function retainSqliteWorkerErrorCode(error, source) {
	let code;
	try {
		code = Object.getOwnPropertyDescriptor(source, retainedWorkerErrorCode)?.value;
	} catch {
		return error;
	}
	if (code === "closed" || code === "overloaded" || code === "unavailable" || code === "outcome-unknown") {
		Object.defineProperty(error, retainedWorkerErrorCode, { value: code });
		Object.assign(error, { code });
	}
	return error;
}
//#endregion
//#region src/infra/sqlite-worker-operation-admission.ts
const REQUESTED = 0;
const GRANTED = 1;
const REFUSED = 2;
resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerOpenRefusedError"), () => class OpenRefusedError extends Error {
	constructor(originalError) {
		super("SQLite worker admission was refused before agent open", { cause: originalError });
		this.originalError = originalError;
		this.name = "SqliteWorkerOpenRefusedError";
	}
});
/** The caller retains real source custody before invoking the synchronous grant. */
function createSqliteWorkerOperationAdmission(admit, attachment) {
	const { port1, port2 } = new MessageChannel();
	if (attachment !== void 0) try {
		port1.postMessage({
			kind: "sqlite-operation-attachment",
			value: attachment
		}, []);
	} catch (error) {
		port1.close();
		port2.close();
		throw error;
	}
	const inOwnerContext = AsyncLocalStorage.snapshot();
	const decisions = /* @__PURE__ */ new Set();
	const cleanupFailures = [];
	let closed = false;
	let failure;
	let committed;
	let settlement;
	const waiting = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
	const refuse = (decision, error) => {
		if (Atomics.compareExchange(decision, 0, REQUESTED, REFUSED) === REQUESTED) {
			failure ??= error;
			Atomics.notify(decision, 0);
		} else if (Atomics.load(decision, 0) === GRANTED) cleanupFailures.push(error);
	};
	const receive = (message) => {
		if (isRecord(message) && message.kind === "native-commit") {
			if (!isRecord(message.committed) || settlement) {
				failure ??= new SqliteWorkerError("SQLite worker commit receipt is invalid", "outcome-unknown");
				return;
			}
			committed = { facts: message.committed.facts };
			return;
		}
		if (isRecord(message) && message.kind === "native-settlement") {
			const value = message.settlement;
			if (!isRecord(value) || value.kind !== "completed" && value.kind !== "unknown" || value.committed !== void 0 && !isRecord(value.committed) || settlement) {
				failure ??= new SqliteWorkerError("SQLite worker native settlement is invalid", "outcome-unknown");
				return;
			}
			if (isRecord(value.committed)) committed = { facts: value.committed.facts };
			settlement = {
				kind: value.kind,
				...committed ? { committed } : {}
			};
			return;
		}
		if (!isRecord(message) || !(message.decision instanceof SharedArrayBuffer) || message.decision.byteLength !== Int32Array.BYTES_PER_ELEMENT || message.stage !== "open" && message.stage !== "prepare" && message.stage !== "transaction" && message.stage !== "commit") {
			failure ??= new SqliteWorkerError("SQLite worker admission request is invalid", "unavailable");
			return;
		}
		const decision = new Int32Array(message.decision);
		decisions.add(decision);
		if (closed) {
			refuse(decision, new SqliteWorkerError("SQLite worker admission is closed", "closed"));
			return;
		}
		const request = {
			stage: message.stage,
			facts: message.facts
		};
		const grant = () => {
			if (closed) return false;
			const granted = Atomics.compareExchange(decision, 0, REQUESTED, GRANTED) === REQUESTED;
			if (granted) Atomics.notify(decision, 0);
			return granted;
		};
		try {
			inOwnerContext(admit, request, grant);
		} catch (error) {
			refuse(decision, error);
			return;
		} finally {
			decisions.delete(decision);
		}
		if (Atomics.load(decision, 0) === REQUESTED) refuse(decision, new SqliteWorkerError("SQLite worker admission was not granted", "closed"));
	};
	port1.on("message", receive);
	port1.unref();
	const service = () => {
		for (let queued = receiveMessageOnPort(port1); queued; queued = receiveMessageOnPort(port1)) receive(queued.message);
	};
	return {
		port: port2,
		get failure() {
			return failure;
		},
		get cleanupFailures() {
			return cleanupFailures;
		},
		get committed() {
			service();
			return committed;
		},
		get settlement() {
			return settlement;
		},
		waitForSettlement(deadlineMs) {
			while (true) {
				service();
				if (failure !== void 0) throw toErrorObject(failure, "SQLite worker admission failed");
				if (settlement?.kind === "completed") return settlement;
				const remaining = deadlineMs - performance.now();
				if (settlement?.kind === "unknown" || closed || remaining <= 0) throw new SqliteWorkerError("SQLite worker native settlement is unknown", "outcome-unknown");
				Atomics.wait(waiting, 0, 0, Math.min(5, remaining));
			}
		},
		service,
		finish() {
			closed = true;
			service();
			for (const decision of decisions) if (Atomics.load(decision, 0) === REQUESTED) refuse(decision, new SqliteWorkerError("SQLite worker admission is closed", "closed"));
			port1.close();
			port2.close();
		}
	};
}
resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerOperationAdmission"), () => new AsyncLocalStorage());
//#endregion
//#region src/infra/sqlite-worker-broker-admission.ts
function validateSqliteWorkerDatabaseLocator(databasePath) {
	const basename = path.basename(databasePath);
	if (!databasePath || databasePath.startsWith("file:") || basename === ":memory:" || basename === "incognito-openclaw-agent.sqlite") throw new Error("SQLite worker stores require a file-backed filesystem path; in-memory and incognito databases are not supported");
}
function captureSqliteWorkerOpen(options, stateContext, assertCurrent, custody = {}) {
	const { createAdmission, preparation, ...native } = custody;
	const inCaller = createAdmission ? AsyncLocalStorage.snapshot() : void 0;
	const ownedAdmission = options.admission;
	const assertOpening = ownedAdmission ? () => {
		assertCurrent?.();
		ownedAdmission.assertCurrent();
	} : assertCurrent;
	const databasePath = path.resolve(options.databasePath);
	if (options.admission && (!options.existingOnly || !options.admission.identity.startsWith("file:"))) throw new Error("Owned SQLite Worker admission requires an existing physical identity");
	assertOpening?.();
	const carrier = resolveRuntimeProcessEntrypointUrl("sqliteStore");
	const carrierUrl = options.runtimeGeneration?.resolve(carrier) ?? carrier;
	return {
		...native,
		...preparation !== void 0 ? { preparation: serialize(preparation) } : {},
		runtimeGeneration: options.runtimeGeneration,
		carrierUrl,
		createAdmission: createAdmission && inCaller ? (operation) => inCaller(createAdmission, operation) : void 0,
		assertCurrent: assertOpening,
		...options.admission ? {
			expectedIdentity: options.admission.identity,
			createOpenAdmission: () => {
				let granted = false;
				return {
					nativeLocations: [databasePath],
					admission: createSqliteWorkerOperationAdmission((request, grant) => {
						if (granted || request.stage !== "open") throw new Error("SQLite Worker open admission requested out of order");
						assertOpening();
						if (!grant()) throw new Error("SQLite Worker open admission expired");
						granted = true;
					})
				};
			}
		} : {},
		moduleUrl: new URL(options.moduleUrl),
		databasePath,
		input: serialize(options.input),
		existingOnly: options.existingOnly === true,
		...stateContext ? { stateContext: {
			environment: { ...stateContext.environment },
			coordinatorRuntime: { ...stateContext.coordinatorRuntime },
			existingSchemaPath: stateContext.existingSchemaPath
		} } : {}
	};
}
function validateSqliteWorkerModuleUrl(moduleUrl) {
	if (moduleUrl.protocol !== "file:" || moduleUrl.search || moduleUrl.hash) throw new Error("SQLite worker backend must be a static local module URL");
}
async function prepareSqliteWorkerDatabaseAdmission(options) {
	validateSqliteWorkerModuleUrl(options.moduleUrl);
	const databasePath = path.resolve(options.databasePath);
	const inputHash = createHash("sha256").update(options.input).digest("hex");
	const identity = await readDatabasePathIdentity(databasePath);
	options.assertCurrent?.();
	if (options.expectedIdentity && identity.key !== options.expectedIdentity) throw new Error("SQLite Worker path no longer matches its borrowed native owner");
	return {
		databasePath,
		inputHash,
		identity
	};
}
function captureSqliteWorkerAdmissionPaths(databasePath, identity, actors) {
	const admittedPaths = /* @__PURE__ */ new Set([databasePath, identity.canonicalPath]);
	if ([...actors].some((entry) => entry.key !== identity.key && [...admittedPaths].some((pathname) => entry.pathReferences.has(pathname)))) throw new Error("SQLite database pathname changed while its worker owner is active; close the existing store first");
	return admittedPaths;
}
function retainSqliteWorkerAdmissionCleanup(actor, retain, close) {
	retain?.({
		get pending() {
			return actor.references === 0 && actor.cleanupState === "pending";
		},
		close: () => actor.references === 0 ? close() : Promise.resolve()
	});
}
function retainSqliteWorkerAdmissionPathReferences(actor, paths) {
	for (const pathname of paths) actor.pathReferences.set(pathname, (actor.pathReferences.get(pathname) ?? 0) + 1);
	return () => {
		for (const pathname of paths) {
			const references = actor.pathReferences.get(pathname) ?? 0;
			if (references > 1) actor.pathReferences.set(pathname, references - 1);
			else actor.pathReferences.delete(pathname);
		}
	};
}
async function resolveOpenedSqliteWorkerIdentity(databasePath, previous, isOwnedElsewhere) {
	const openedIdentity = await readDatabasePathIdentity(databasePath);
	const physical = openedIdentity.key;
	if (openedIdentity.canonicalPath !== previous.canonicalPath) throw new Error("SQLite database canonical pathname changed during open");
	if (!physical.startsWith("file:")) throw new Error("SQLite worker backend did not establish its database file");
	if (isOwnedElsewhere(physical)) throw new Error("SQLite database identity collided with an existing worker owner during open");
	if (previous.key.startsWith("file:") && physical !== previous.key) throw new Error("SQLite database file identity changed during open");
	return physical;
}
function findUnclaimedSharedStateActors(actors, databasePath) {
	const pathname = path.resolve(databasePath);
	return [...actors].filter((actor) => actor.stateContext !== void 0 && actor.references === 0 && actor.cleanupState === "pending" && actor.databasePath === pathname);
}
async function closeUnclaimedSharedStateActors(actors, databasePath, close) {
	const errors = (await Promise.allSettled(findUnclaimedSharedStateActors(actors, databasePath).map(close))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (errors.length) throw new AggregateError(errors, "SQLite worker unclaimed cleanup failed", { cause: errors[0] });
}
async function resolveSqliteWorkerModuleUrl(sourceUrl) {
	const modulePath = await realpath(fileURLToPath(sourceUrl));
	const moduleUrl = pathToFileURL(modulePath).href;
	if (!/\.[cm]?[jt]s$/.test(modulePath) || !(await stat(modulePath)).isFile()) throw new Error("SQLite worker backend must identify a JavaScript or TypeScript file");
	return {
		modulePath,
		moduleUrl
	};
}
function assertSqliteWorkerActorReusable(actor, moduleUrl, inputHash, stateContext) {
	if (actor.slot.failed) throw actor.slot.failed;
	if (actor.moduleUrl !== moduleUrl || actor.inputHash !== inputHash) throw new Error("SQLite database already belongs to another worker backend");
	if (actor.stateContext?.existingSchemaPath !== stateContext?.existingSchemaPath) throw new Error("Shared-state worker schema policy changed; close its actor first");
}
function prepareSqliteWorkerActorContext(actor, job) {
	const { request } = job;
	const stateContext = request.stateContext ?? actor?.stateContext;
	if (actor && stateContext) {
		request.stateDatabasePath = actor.stateDatabasePath ?? actor.databasePath;
		if (actor.stateContext?.coordinatorRuntime.directory !== stateContext.coordinatorRuntime.directory) throw new Error("Shared-state worker coordinator scope changed; close its actor first");
		if (actor.stateContext?.existingSchemaPath !== stateContext.existingSchemaPath) throw new Error("Shared-state worker schema policy changed; close its actor first");
		request.stateContext = stateContext;
		if (!actor.cleanupState && !actor.gatewaySchemaFence) {
			const delegate = tryCreateGatewaySchemaFenceDelegate({
				databasePath: request.stateDatabasePath,
				runtimeDirectory: stateContext.coordinatorRuntime.directory,
				actorId: String(actor.id)
			});
			if (delegate) {
				actor.gatewaySchemaFence = delegate;
				job.gatewaySchemaFence = {
					actor,
					delegate
				};
				try {
					request.gatewaySchemaFence = delegate.port;
				} catch (error) {
					actor.cleanupState = "pending";
					throw error;
				}
			}
		}
	}
}
function prepareSqliteWorkerLifecycle(job, actor, assertDispatchable) {
	const context = job.request.stateContext ?? actor?.stateContext;
	if (!actor || !context) {
		if (job.requireStateLifecycle) throw new Error("SQLite worker lifecycle custody requires its captured state owner");
		return;
	}
	const runtime = job.request.type === "close" ? {
		...context.coordinatorRuntime,
		keepAlive: false
	} : context.coordinatorRuntime;
	return withStateDatabaseCoordinatorRuntimeDirectory(runtime, () => {
		const prepare = () => {
			assertDispatchable();
			prepareSqliteWorkerActorContext(actor, job);
			const schemaFence = actor.gatewaySchemaFence ? void 0 : job.maintenanceScope?.createSchemaFenceDelegate({
				databasePath: job.request.stateDatabasePath ?? actor.databasePath,
				runtimeDirectory: context.coordinatorRuntime.directory,
				actorId: `${actor.id}:${job.request.id}`
			});
			if (schemaFence) {
				job.maintenanceSchemaFence = {
					actor,
					delegate: schemaFence
				};
				job.request.maintenanceSchemaFence = schemaFence.port;
			}
			const delegate = tryCreateStateLifecycleDelegate({
				databasePath: job.request.stateDatabasePath ?? actor.databasePath,
				actorId: `${actor.id}:${job.request.id}`
			});
			if (!delegate && job.requireStateLifecycle) job.request.workerStateLifecycle = { deadlineNs: process.hrtime.bigint() + BigInt(OPENCLAW_SQLITE_BUSY_TIMEOUT_MS) * 1000000n };
			if (delegate) {
				job.stateLifecycle = {
					actor,
					delegate
				};
				job.request.stateLifecycle = delegate.port;
			}
		};
		prepare();
	});
}
function releaseSqliteWorkerLifecycle(job) {
	const errors = [];
	const unpostedGatewayFence = job.nativeDispatched ? void 0 : job.gatewaySchemaFence;
	for (const held of [
		job.stateLifecycle,
		job.maintenanceSchemaFence,
		unpostedGatewayFence
	]) {
		if (!held) continue;
		const { actor, delegate } = held;
		try {
			delegate.release();
		} catch (error) {
			if (!delegate.closed) actor.cleanupState = "pending";
			if (!delegate.closed && held !== unpostedGatewayFence) {
				actor.pendingStateLifecycles.add(delegate);
				job.maintenanceScope?.own(delegate, "shared-resources", () => {
					try {
						delegate.release();
					} finally {
						if (delegate.closed) actor.pendingStateLifecycles.delete(delegate);
					}
				});
			}
			errors.push(error);
		} finally {
			if (held === unpostedGatewayFence && delegate.closed) actor.gatewaySchemaFence = void 0;
		}
	}
	job.gatewaySchemaFence = void 0;
	job.stateLifecycle = void 0;
	job.maintenanceSchemaFence = void 0;
	if (errors.length === 1) throw errors[0];
	if (errors.length > 1) throw new AggregateError(errors, "SQLite worker coordinator cleanup failed");
}
function releaseSqliteWorkerActorCoordinators(actor) {
	for (const delegate of actor.pendingStateLifecycles) try {
		delegate.release();
	} finally {
		if (delegate.closed) actor.pendingStateLifecycles.delete(delegate);
	}
	const delegation = actor.gatewaySchemaFence;
	if (!delegation) return;
	try {
		delegation.release();
	} finally {
		if (delegation.closed) actor.gatewaySchemaFence = void 0;
	}
}
//#endregion
//#region src/infra/sqlite-worker-lifecycle-preparation.ts
/** Service only this job's preparation while a legacy native caller owns the host turn. */
function createSqliteWorkerLifecyclePreparation(params) {
	const { port1, port2 } = new MessageChannel();
	const prepared = createDeferredCore();
	let failure;
	let finished = false;
	let admitted = false;
	const refuse = (error) => {
		failure ??= error;
		port1.postMessage({ type: "cancel" });
	};
	const receive = (request, pumping = false) => {
		if (finished) return;
		if (isRecord(request) && request.type === "result") {
			params.receiveResult(request.reply, pumping);
			return;
		}
		if (!isRecord(request) || request.type !== "check" && request.type !== "acquired") {
			refuse(new SqliteCoordinatorError("SQLite lifecycle preparation request is invalid"));
			return;
		}
		try {
			params.signal.throwIfAborted();
			params.assertCurrent();
			if (admitted) throw new SqliteCoordinatorError("SQLite lifecycle preparation already admitted its job");
			if (request.type === "check") {
				port1.postMessage({ type: "accepted" });
				return;
			}
			const admission = params.admit();
			params.signal.throwIfAborted();
			params.assertCurrent();
			params.dispatch();
			admitted = true;
			port1.postMessage({
				type: "accepted",
				admission
			}, admission ? [admission] : []);
			prepared.resolve();
		} catch (error) {
			refuse(error);
		}
	};
	const abort = () => refuse(params.signal.reason);
	port1.on("message", receive);
	port1.once("close", () => prepared.resolve());
	port1.unref();
	params.signal.addEventListener("abort", abort, { once: true });
	return {
		port: port2,
		prepared: prepared.promise,
		get failure() {
			return failure;
		},
		service() {
			for (let queued = receiveMessageOnPort(port1); queued; queued = receiveMessageOnPort(port1)) receive(queued.message, true);
		},
		finish() {
			finished = true;
			params.signal.removeEventListener("abort", abort);
			prepared.resolve();
			port1.close();
			port2.close();
		}
	};
}
//#endregion
//#region src/infra/sqlite-worker-broker-reply.ts
function dispatchSqliteWorkerJob(slot, job, onRejected) {
	const reject = (error, preparedNotEntered = false) => {
		let failure = error;
		let retire = job.preparation ? job.nativeDispatched === true || job.requestPosted === true && !preparedNotEntered : Boolean(job.request.gatewaySchemaFence || job.request.maintenanceSchemaFence || job.request.stateLifecycle || job.request.operationAdmission);
		if (job.preparation && !job.nativeDispatched && (!job.requestPosted || preparedNotEntered) && slot.current === job) try {
			releaseSqliteWorkerLifecycle(job);
		} catch (cleanupError) {
			failure = withSqliteWorkerCleanupFailure(toErrorObject(error, "SQLite worker preparation failed"), cleanupError);
			retire = true;
		}
		onRejected(failure, retire);
	};
	job.rejectPreparation = (error) => reject(error, true);
	if (job.requireStateLifecycle) job.cancelPreparation = new AbortController();
	const assertDispatchable = () => {
		job.assertCurrent?.();
		job.cancelPreparation?.signal.throwIfAborted();
		if (slot.failed || slot.current !== job) throw slot.failed ?? new SqliteWorkerError("SQLite worker job is no longer current", "closed");
	};
	try {
		assertDispatchable();
		const actor = [...slot.actors].find((candidate) => candidate.id === job.request.actor);
		const dispatch = () => {
			try {
				assertDispatchable();
				postSqliteWorkerJob(slot, job, assertDispatchable, actor);
			} catch (error) {
				reject(error);
			}
		};
		prepareSqliteWorkerLifecycle(job, actor, assertDispatchable);
		if (job.requireStateLifecycle && !job.request.workerStateLifecycle) {
			job.preparation = Promise.resolve();
			job.preparation.then(dispatch, reject);
		} else dispatch();
	} catch (error) {
		reject(error);
	}
}
function postSqliteWorkerJob(slot, job, assertDispatchable, actor) {
	const dispatched = () => {
		job.nativeDispatched = true;
		job.detach();
		if (job.dispatchState) job.dispatchState.dispatched = true;
	};
	if (job.request.workerStateLifecycle) {
		const context = job.request.stateContext;
		if (!actor || !context || !job.cancelPreparation) throw new Error("Worker lifecycle preparation requires its captured owner");
		const preparation = createSqliteWorkerLifecyclePreparation({
			assertCurrent: assertDispatchable,
			signal: job.cancelPreparation.signal,
			admit: () => prepareSqliteWorkerOperationAdmission(job, actor),
			dispatch: dispatched,
			receiveResult(reply, pumping) {
				if (!isRecord(reply) || typeof reply.id !== "number" || typeof reply.ok !== "boolean") throw new Error("SQLite lifecycle reply is invalid");
				slot.receiveReply(reply, pumping);
			}
		});
		const releaseService = retainSqliteWriteAdmissionService([resolveStateDatabaseCoordinatorPath({
			databasePath: job.request.stateDatabasePath ?? actor.databasePath,
			runtimeDirectory: context.coordinatorRuntime.directory,
			uid: typeof process.getuid === "function" ? process.getuid() : void 0
		})], () => {
			preparation.service();
			job.operationAdmission?.admission.service();
		});
		job.lifecyclePreparation = {
			get failure() {
				return preparation.failure;
			},
			finish() {
				releaseService();
				preparation.finish();
			}
		};
		job.preparation = preparation.prepared;
		job.request.lifecyclePreparation = preparation.port;
	} else job.request.operationAdmission = prepareSqliteWorkerOperationAdmission(job, actor);
	const request = prepareSqliteWorkerRequest(job);
	assertDispatchable();
	if (!job.request.workerStateLifecycle) dispatched();
	job.requestPosted = true;
	slot.worker.postMessage(request, [
		request.gatewaySchemaFence,
		request.maintenanceSchemaFence,
		request.stateLifecycle,
		request.operationAdmission,
		request.lifecyclePreparation
	].filter((port) => port !== void 0));
}
function prepareSqliteWorkerOperationAdmission(job, actor) {
	if (job.createAdmission) {
		const settlement = createDeferredCore();
		job.settleNative = settlement.resolve;
		const retained = job.createAdmission({ settled: settlement.promise });
		job.operationAdmission = {
			admission: retained.admission,
			releaseService: retainSqliteWriteAdmissionService([...retained.nativeLocations, ...actor?.pathReferences.keys() ?? []], () => retained.admission.service())
		};
		return retained.admission.port;
	}
}
function prepareSqliteWorkerRequest(job) {
	if (job.request.type !== "execute" || job.request.input.byteLength <= 33554432) return job.request;
	const { input, ...request } = job.request;
	const producer = createSqliteWorkerTransferOwner();
	const transfer = producer.start([{
		kind: "command",
		serialized: input
	}].values(), { kinds: ["command"] });
	job.inputTransfer = {
		id: transfer.id,
		producer
	};
	job.request.input = /* @__PURE__ */ new Uint8Array();
	return {
		...request,
		type: "execute-start",
		transfer
	};
}
function decodeSqliteWorkerReplyValue(job, reply) {
	if (reply.input === "next") {
		const transfer = job.inputTransfer;
		if (!transfer || reply.transfer) throw new Error("SQLite worker requested unexpected command input");
		const frame = transfer.producer.next(transfer.id);
		const input = serialize(frame);
		if (input.byteLength > 33554432) throw new Error("SQLite worker input frame exceeds the transport byte limit");
		if (frame.done) {
			transfer.producer.end(transfer.id);
			job.inputTransfer = void 0;
		}
		return {
			type: "continue",
			request: {
				type: "execute-frame",
				id: job.request.id,
				actor: job.request.actor,
				input
			}
		};
	}
	if (job.inputTransfer) throw new Error("SQLite worker completed before receiving its command input");
	let value;
	if (reply.transfer === "start") {
		const handle = deserialize(reply.value);
		if (job.request.type !== "execute" || job.transfer || handle.kinds.length !== 1 || handle.kinds[0] !== "result") throw new Error("SQLite worker returned an unexpected result transfer");
		const transfer = {
			id: handle.id,
			value: void 0,
			receiver: createSqliteWorkerTransferReceiver(handle, (record) => {
				transfer.value = record.value;
			})
		};
		job.transfer = transfer;
	} else if (reply.transfer === "frame") {
		const transfer = job.transfer;
		if (!transfer) throw new Error("SQLite worker returned an unexpected result frame");
		const frame = deserialize(reply.value);
		const counts = transfer.receiver.accept(frame);
		if (counts) {
			if (counts.length !== 1 || counts[0]?.[1] !== 1) throw new Error("SQLite worker returned an incomplete result transfer");
			value = transfer.value;
			job.transfer = void 0;
		}
	} else {
		if (job.transfer) throw new Error("SQLite worker ended its result transfer without completion");
		value = deserialize(reply.value);
	}
	return job.transfer ? {
		type: "continue",
		request: {
			type: "result-next",
			id: job.request.id,
			actor: job.request.actor,
			transferId: job.transfer.id
		}
	} : {
		type: "complete",
		value
	};
}
function decodeSqliteWorkerReplyError(job, error) {
	const failure = Object.assign(new Error(error.message), {
		name: error.name,
		...error.code === void 0 ? {} : { code: error.code }
	});
	if (job.request.stateContext && error.code !== "outcome-unknown" && error.sharedState) retainOpenClawStateWorkerErrorPayload(failure, error.sharedState);
	return failure;
}
function decodeSqliteWorkerCleanupError(job, payload) {
	return hydrateOpenClawStateWorkerError(decodeSqliteWorkerReplyError(job, {
		name: "SqliteCoordinatorError",
		message: "SQLite coordinator cleanup failed",
		sharedState: payload
	}));
}
function receiveSqliteWorkerReply(slot, reply, owner, pumping = false) {
	const job = slot.current;
	if (!job || reply.id !== job.request.id) {
		owner.fail(/* @__PURE__ */ new Error("SQLite worker returned an unexpected response"));
		return;
	}
	const settle = (operation) => {
		if (pumping) queueMicrotask(() => {
			if (slot.current === job && !slot.failed) operation();
		});
		else operation();
	};
	if (!reply.ok) {
		if (reply.cleanupFailure && job.nativeDispatched && !reply.retire) {
			const original = job.operationAdmission?.admission.failure ?? decodeSqliteWorkerReplyError(job, reply.error);
			owner.fail(decodeSqliteWorkerCleanupError(job, reply.cleanupFailure), void 0, { error: original });
			return;
		}
		if (reply.openNotEntered && job.request.type === "open" && job.dispatchState) job.dispatchState.openNotEntered = true;
		const error = decodeSqliteWorkerReplyError(job, reply.error);
		if (job.request.type === "open" && reply.openNotEntered && !reply.retire) {
			settle(() => {
				slot.current = void 0;
				const refusal = job.operationAdmission?.admission.failure ?? error;
				owner.finish(job, refusal, void 0, {
					kind: "not-entered",
					error: refusal
				});
				owner.dispatch();
			});
			return;
		}
		if (job.request.type !== "execute" || reply.retire) {
			const refusedOpen = job.request.type === "open" && reply.openOutcome === "refused-before-agent-open";
			const failure = refusedOpen ? toErrorObject(job.operationAdmission?.admission.failure ?? error, error.message) : error;
			owner.fail(failure, job.request.type !== "execute" ? failure : void 0, void 0, refusedOpen ? "refused-before-agent-open" : void 0);
			return;
		}
		if (job.lifecyclePreparation && !job.nativeDispatched) {
			settle(() => {
				job.lifecyclePreparation?.finish();
				job.rejectPreparation?.(job.lifecyclePreparation?.failure ?? error);
			});
			return;
		}
		settle(() => {
			slot.current = void 0;
			owner.finish(job, job.lifecyclePreparation?.failure ?? job.operationAdmission?.admission.failure ?? error);
			owner.dispatch();
		});
		return;
	}
	let value;
	try {
		const result = decodeSqliteWorkerReplyValue(job, reply);
		if (result.type === "continue") {
			slot.worker.postMessage(result.request, []);
			return;
		}
		value = result.value;
	} catch (error) {
		owner.fail(error);
		return;
	}
	if (reply.cleanupFailure) {
		owner.fail(decodeSqliteWorkerCleanupError(job, reply.cleanupFailure), void 0, { value });
		return;
	}
	settle(() => {
		slot.current = void 0;
		owner.finish(job, void 0, value);
		owner.dispatch();
	});
}
/** Keep the original failure and outcome classification when retirement also fails. */
function withSqliteWorkerCleanupFailure(failure, cleanupError) {
	if (cleanupError === void 0) return failure;
	return retainSqliteWorkerErrorCode(new AggregateError([failure, cleanupError], "SQLite worker failure and cleanup failed", { cause: failure }), failure);
}
function settleFailedSqliteWorkerJobs({ queuedError, current, queued, error, currentError, completed, openOutcome, retire, finish }) {
	current?.cancelPreparation?.abort(error);
	const retirement = current?.lifecyclePreparation ? retire().finally(() => current.lifecyclePreparation?.finish()) : current?.preparation ? current.preparation.catch(() => void 0).then(retire) : retire();
	const finishFailed = (retired, cleanupError) => {
		if (current && completed) {
			process.emitWarning(new SqliteCoordinatorError("SQLite worker operation completed before coordinator cleanup failed", withSqliteWorkerCleanupFailure(error, cleanupError)));
			finish(current, "error" in completed ? completed.error : void 0, "value" in completed ? completed.value : void 0, { kind: "completed" });
		} else if (current) {
			const failure = currentError ?? new SqliteWorkerError(`SQLite worker stopped before its result was received: ${error.message}`, current.request.type === "execute" && current.nativeDispatched ? "outcome-unknown" : "unavailable");
			if (!currentError) failure.cause = error;
			finish(current, withSqliteWorkerCleanupFailure(failure, cleanupError), void 0, current.nativeDispatched ? retired && openOutcome === "refused-before-agent-open" ? { kind: "completed" } : {
				kind: "unknown",
				error: currentError ?? error
			} : {
				kind: "not-entered",
				error
			});
		}
		for (const job of queued) finish(job, withSqliteWorkerCleanupFailure(queuedError, cleanupError));
	};
	retirement.then(() => {
		let cleanupComplete = true;
		try {
			if (current && openOutcome === "refused-before-agent-open") {
				releaseSqliteWorkerLifecycle(current);
				cleanupComplete = !current.operationAdmission?.admission.cleanupFailures.length;
			}
		} catch (cleanupError) {
			finishFailed(false, cleanupError);
			return;
		}
		finishFailed(cleanupComplete);
	}, (cleanupError) => finishFailed(false, cleanupError));
}
function settleSqliteWorkerJob(job, error, value, settlement) {
	job.settleNative?.(settlement ?? (job.nativeDispatched ? { kind: "completed" } : {
		kind: "not-entered",
		error
	}));
	job.operationAdmission?.admission.finish();
	job.operationAdmission?.releaseService();
	job.lifecyclePreparation?.finish();
	let failure = error;
	const admissionCleanupFailures = job.operationAdmission?.admission.cleanupFailures ?? [];
	if (admissionCleanupFailures.length > 0) {
		const cleanupError = new AggregateError(admissionCleanupFailures, "SQLite worker admission cleanup failed");
		if (error === void 0 && job.request.type === "execute") process.emitWarning(cleanupError);
		else failure = error === void 0 ? cleanupError : withSqliteWorkerCleanupFailure(toErrorObject(error, "SQLite worker failed"), cleanupError);
	}
	try {
		releaseSqliteWorkerLifecycle(job);
	} catch (cleanupError) {
		if (error === void 0 && job.request.type === "execute") process.emitWarning(new SqliteCoordinatorError("SQLite worker result received before coordinator cleanup failed", cleanupError));
		else failure = failure === void 0 ? cleanupError : withSqliteWorkerCleanupFailure(toErrorObject(failure, "SQLite worker failed"), cleanupError);
	}
	job.inputTransfer?.producer.cancel();
	job.inputTransfer = void 0;
	job.transfer = void 0;
	job.detach();
	if (failure !== void 0) job.reject(failure);
	else job.resolve(value);
}
//#endregion
//#region src/infra/sqlite-worker-broker-lifecycle.ts
const runOutsideCaller = AsyncLocalStorage.snapshot();
/** The broker retains these maps; this owner drains clients before native close custody. */
function createSqliteWorkerLifecycle({ actors, slots, stores, enqueueClose, fail }) {
	function createSlot(options, borrowedGenerationSlot, createReplyOwner) {
		if (process.versions.bun && process.platform === "darwin") ensureSqliteLibrarySelected();
		options.assertCurrent?.();
		const worker = runOutsideCaller(() => createCpuTrackedWorker(options.carrierUrl, {
			resourceLimits: { maxOldGenerationSizeMb: 512 },
			env: resolveNodeCompileCacheEnv(),
			execArgv: options.carrierUrl.pathname.endsWith(".ts") ? ["--import", import.meta.resolve("tsx/esm")] : []
		}));
		const exited = createDeferredCore();
		const slot = {
			runtimeGeneration: options.runtimeGeneration,
			...borrowedGenerationSlot ? { borrowedGenerationSlot: true } : {},
			worker,
			receiveReply: (reply, pumping) => receiveSqliteWorkerReply(slot, reply, replyOwner, pumping),
			actors: /* @__PURE__ */ new Set(),
			queue: [],
			exit: exited.promise,
			exited: false,
			pendingOpens: 1
		};
		const replyOwner = createReplyOwner(slot);
		slots.add(slot);
		worker.on("message", (reply) => slot.receiveReply(reply));
		worker.on("error", (error) => fail(slot, error));
		worker.on("messageerror", (error) => fail(slot, error));
		worker.once("exit", (code) => {
			slot.exited = true;
			for (const actor of slot.actors) {
				actor.backendClosed = true;
				actor.markNativeStopped();
			}
			fail(slot, /* @__PURE__ */ new Error(`SQLite worker exited with code ${code}`));
			slots.delete(slot);
			exited.resolve();
		});
		worker.unref();
		return slot;
	}
	async function closeGeneration(generation) {
		const errors = (await Promise.allSettled([...actors.values()].filter((actor) => actor.runtimeGeneration === generation).map((actor) => retireActor(actor)))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		if (errors.length) throw new AggregateError(errors, "Retained SQLite worker cleanup failed");
		await Promise.all([...slots].filter((slot) => slot.runtimeGeneration === generation).map((slot) => retireEmpty(slot)));
	}
	function releaseActorReference(actor) {
		actor.references -= 1;
		if (!actor.references) actor.onReferencesDrained?.();
	}
	async function rejectSlotAdmission(slot, error) {
		slot.pendingOpens -= 1;
		try {
			await retireEmpty(slot);
		} catch (cleanupError) {
			throw createSqliteLifecycleAggregateError([error, cleanupError], "SQLite slot admission and cleanup failed", error);
		}
		throw error;
	}
	function retireActor(identity) {
		const actor = [...actors.values()].find((entry) => entry === identity);
		if (!actor) return Promise.resolve();
		if (actor.retirement) return actor.retirement;
		actor.retirementRequested = true;
		const drained = createDeferredCore();
		actor.onReferencesDrained = drained.resolve;
		if (!actor.references) drained.resolve();
		const clients = [...stores.values()].filter((client) => client.actor === actor);
		actor.retirement = (async () => {
			const results = await Promise.allSettled(clients.map((client) => client.close()));
			await drained.promise;
			const errors = results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
			if (!errors.length) try {
				await closeActor(actor);
			} catch (error) {
				errors.push(error);
			}
			if (errors.length) throw new AggregateError(errors, "SQLite actor retirement failed", { cause: errors[0] });
		})().finally(() => {
			actor.retirement = void 0;
			actor.onReferencesDrained = void 0;
		});
		return actor.retirement;
	}
	function closeActor(actor, maintenanceScope) {
		if (actor.cleanupState === "complete") return Promise.resolve();
		if (actor.closing) return actor.closing;
		const firstAttempt = actor.cleanupState === void 0;
		actor.cleanupState = "pending";
		actor.closing = (async () => {
			const errors = [];
			if (!actor.backendClosed) try {
				await enqueueClose(actor, maintenanceScope);
				actor.backendClosed = true;
				if (!process.versions.bun) actor.markNativeStopped();
			} catch (error) {
				errors.push(error);
				fail(actor.slot, error instanceof Error ? error : new Error(String(error)));
				await actor.slot.exit;
			}
			else if (firstAttempt && actor.slot.failed && !actor.slot.retiredAfterCompletion) errors.push(actor.slot.failed);
			try {
				if (process.versions.bun || actor.slot.failed || !actor.slot.pendingOpens && [...actor.slot.actors].every((entry) => entry.backendClosed)) await retire(actor.slot);
				else releaseSqliteWorkerActorCoordinators(actor);
			} catch (error) {
				errors.push(error);
			} finally {
				forget(actor);
			}
			if (errors.length === 1) throw errors[0];
			if (errors.length > 1) throw new AggregateError(errors, "SQLite worker actor cleanup failed", { cause: errors[0] });
		})().finally(() => {
			actor.closing = void 0;
		});
		return actor.closing;
	}
	function forget(actor) {
		if (actor.gatewaySchemaFence || actor.pendingStateLifecycles.size) {
			actor.cleanupState = "pending";
			return;
		}
		if (actors.get(actor.key) === actor) actors.delete(actor.key);
		actor.slot.actors.delete(actor);
		actor.cleanupState = "complete";
	}
	async function retireEmpty(slot) {
		if (!slot.actors.size && !slot.pendingOpens) await retire(slot);
	}
	function retire(slot) {
		slot.retiring ??= (async () => {
			const errors = [];
			if (!slot.exited) try {
				await slot.worker.terminate();
			} catch (error) {
				errors.push(error);
			}
			await slot.exit;
			for (const actor of slot.actors) try {
				releaseSqliteWorkerActorCoordinators(actor);
			} catch (error) {
				errors.push(error);
			}
			if (errors.length === 1) throw errors[0];
			if (errors.length > 1) throw new AggregateError(errors, "SQLite worker retirement cleanup failed", { cause: errors[0] });
		})().finally(() => {
			slot.retiring = void 0;
		});
		return slot.retiring;
	}
	return {
		createSlot,
		closeGeneration,
		releaseActorReference,
		rejectSlotAdmission,
		retireActor,
		closeActor,
		forget,
		retireEmpty,
		retire
	};
}
//#endregion
//#region src/infra/sqlite-worker-client.ts
function runSqliteWorkerClientOperation(client, operation, stateContext, track, assertCurrent, createAdmission, requireStateLifecycle = false) {
	if (!client || client.sealed) return Promise.reject(new SqliteWorkerError("SQLite worker store is closed", "closed"));
	const scope = {
		requireStateLifecycle,
		createAdmission,
		assertCurrent,
		active: true,
		pending: /* @__PURE__ */ new Set(),
		...stateContext ? { stateContext: {
			environment: { ...stateContext.environment },
			coordinatorRuntime: { ...stateContext.coordinatorRuntime },
			existingSchemaPath: stateContext.existingSchemaPath
		} } : {}
	};
	const released = createDeferredCore();
	client.scopes.add(released.promise);
	const untrack = track(released.promise);
	return (async () => {
		try {
			const result = operation({ execute: (command, options = {}) => client.execute(command, options, scope) });
			return isPromise(result) ? await result : result;
		} finally {
			scope.active = false;
			await Promise.allSettled(scope.pending);
			client.scopes.delete(released.promise);
			untrack();
			released.resolve();
		}
	})();
}
function createSqliteWorkerClient(owner) {
	let closed;
	const pending = /* @__PURE__ */ new Set();
	const client = {
		actor: owner.actor,
		close: () => store.close(),
		sealed: owner.isDraining(),
		isAvailable: owner.isAvailable,
		scopes: /* @__PURE__ */ new Set(),
		execute: (command, options, scope) => {
			if (scope ? !scope.active : closed || client.sealed || owner.isDraining()) return Promise.reject(new SqliteWorkerError("SQLite worker store is closed", "closed"));
			if (options.signal?.aborted) return Promise.reject(toErrorObject(options.signal.reason, "SQLite worker operation canceled"));
			let payload;
			let assertCurrent;
			const admission = scope?.assertCurrent;
			const createAdmission = scope?.createAdmission;
			const inCaller = admission || createAdmission ? AsyncLocalStorage.snapshot() : void 0;
			try {
				const commandType = command.type;
				assertCurrent = admission && inCaller ? () => inCaller(admission, commandType) : void 0;
				assertCurrent?.();
				payload = serialize({
					type: commandType,
					input: command.input
				});
			} catch (error) {
				return Promise.reject(toErrorObject(error, "SQLite worker command could not be serialized"));
			}
			const operation = owner.dispatch(payload, options.signal, scope, assertCurrent, createAdmission && inCaller ? (admissionOperation) => inCaller(createAdmission, admissionOperation) : void 0);
			pending.add(operation);
			scope?.pending.add(operation);
			operation.then(() => {
				pending.delete(operation);
				scope?.pending.delete(operation);
			}, () => {
				pending.delete(operation);
				scope?.pending.delete(operation);
			});
			return operation;
		}
	};
	const store = {
		execute: (command, options = {}) => client.execute(command, options),
		close: () => {
			if (!closed) {
				client.sealed = true;
				closed = (async () => {
					await Promise.allSettled(client.scopes);
					await Promise.allSettled(pending);
					await owner.release();
				})().catch((error) => {
					closed = void 0;
					throw error;
				});
			}
			return closed;
		}
	};
	return {
		store,
		client
	};
}
//#endregion
//#region src/infra/sqlite-worker-input-admission.ts
/** Retained inputs share the broker budget before they become queued jobs. */
var SqliteWorkerInputAdmission = class {
	constructor(owner) {
		this.owner = owner;
		this.bytes = 0;
		this.inputPreparationGeneration = {};
		this.inputPreparations = /* @__PURE__ */ new Set();
		this.openTail = Promise.resolve();
	}
	get retainedBytes() {
		return this.bytes;
	}
	retain(bytes) {
		this.bytes += bytes;
		let released = false;
		return () => {
			if (!released) {
				released = true;
				this.bytes -= bytes;
			}
		};
	}
	open(bytes, dispatch) {
		if (bytes > this.owner.maxMessageBytes || this.owner.queuedBytes() + this.bytes + bytes > this.owner.maxQueuedBytes) return Promise.reject(new SqliteWorkerError("SQLite worker open input capacity reached", "overloaded"));
		const previous = this.openTail;
		const settled = createDeferredCore();
		this.openTail = settled.promise;
		const release = this.retain(bytes);
		return previous.then(dispatch).finally(() => {
			release();
			settled.resolve();
		});
	}
	joinOpens() {
		return this.openTail;
	}
	invalidatePreparations() {
		this.inputPreparationGeneration = {};
	}
	async joinPreparations() {
		await Promise.allSettled(this.inputPreparations);
	}
	reserveInputPreparation(inputBytes) {
		if (!Number.isSafeInteger(inputBytes) || inputBytes < 0) throw new RangeError("SQLite worker input bytes must be a non-negative safe integer");
		if (this.owner.isClosing()) throw new SqliteWorkerError("SQLite worker host is closing", "closed");
		const bytes = inputBytes > this.owner.maxQueuedBytes ? this.owner.maxMessageBytes : inputBytes;
		if (this.owner.queuedBytes() + this.bytes + bytes > this.owner.maxQueuedBytes) throw new SqliteWorkerError("SQLite worker input preparation capacity reached", "overloaded");
		const generation = this.inputPreparationGeneration;
		this.bytes += bytes;
		const settled = createDeferredCore();
		this.inputPreparations.add(settled.promise);
		let released = false;
		let handedOff = false;
		const release = () => {
			if (!released) {
				released = true;
				this.bytes -= bytes;
				this.inputPreparations.delete(settled.promise);
				settled.resolve();
			}
		};
		const assertCurrent = () => {
			if (!handedOff && (released || this.owner.isClosing() || generation !== this.inputPreparationGeneration)) throw new SqliteWorkerError("SQLite worker input preparation is closed", "closed");
		};
		return {
			assertCurrent,
			handoff: (dispatch) => {
				try {
					if (released) throw new SqliteWorkerError("SQLite worker input preparation is closed", "closed");
					assertCurrent();
				} catch (error) {
					release();
					throw error;
				}
				handedOff = true;
				release();
				return dispatch();
			},
			release
		};
	}
};
//#endregion
//#region src/infra/sqlite-worker-broker.ts
const ADMISSION_TIMEOUT_MS = 1e4;
const MAX_STORES = 64;
const SQLITE_WORKER_MAX_QUEUED_BYTES = 67108864;
var SqliteWorkerBroker = class {
	constructor() {
		this.maxWorkers = Math.min(8, Math.max(2, Math.floor(availableParallelism() / 8)));
		this.waiters = /* @__PURE__ */ new Map();
		this.resuming = false;
		this.nextAdmissionWarning = 0;
		this.actors = /* @__PURE__ */ new Map();
		this.slots = /* @__PURE__ */ new Set();
		this.clients = /* @__PURE__ */ new Set();
		this.stores = /* @__PURE__ */ new Map();
		this.operations = /* @__PURE__ */ new Set();
		this.lifecycle = createSqliteWorkerLifecycle({
			actors: this.actors,
			slots: this.slots,
			stores: this.stores,
			enqueueClose: (actor, maintenanceScope) => this.enqueue(actor.slot, {
				type: "close",
				actor: actor.id
			}, 0, { maintenanceScope }),
			fail: (slot, error) => this.fail(slot, error)
		});
		this.nextActor = 0;
		this.nextRequest = 0;
		this.requests = 0;
		this.bytes = 0;
		this.inputAdmission = new SqliteWorkerInputAdmission({
			queuedBytes: () => this.bytes,
			isClosing: () => this.draining !== void 0,
			maxQueuedBytes: SQLITE_WORKER_MAX_QUEUED_BYTES,
			maxMessageBytes: SQLITE_WORKER_MAX_MESSAGE_BYTES
		});
	}
	reserveInputPreparation(inputBytes) {
		return this.inputAdmission.reserveInputPreparation(inputBytes);
	}
	open(options, stateContext, assertCurrent, custody = {}) {
		try {
			validateSqliteWorkerDatabaseLocator(options.databasePath);
		} catch (error) {
			return Promise.reject(toErrorObject(error, "SQLite worker database locator is invalid"));
		}
		if (this.draining) return Promise.reject(new SqliteWorkerError("SQLite worker host is closing", "closed"));
		if (this.clients.size >= MAX_STORES) return Promise.reject(new SqliteWorkerError("SQLite worker store capacity reached", "overloaded"));
		const client = {};
		this.clients.add(client);
		let snapshot;
		try {
			snapshot = captureSqliteWorkerOpen(options, stateContext, assertCurrent, custody);
			const generation = options.runtimeGeneration;
			generation?.retain(this, async () => {
				await this.inputAdmission.joinOpens();
				await this.lifecycle.closeGeneration(generation);
			});
		} catch (error) {
			this.clients.delete(client);
			return Promise.reject(toErrorObject(error, "SQLite worker input could not be serialized"));
		}
		return this.inputAdmission.open(snapshot.input.byteLength + (snapshot.preparation?.byteLength ?? 0), () => this.openAdmitted(snapshot, client)).catch((error) => {
			this.clients.delete(client);
			throw error;
		});
	}
	async openAdmitted(options, client) {
		options.assertCurrent?.();
		const { databasePath, inputHash, identity } = await prepareSqliteWorkerDatabaseAdmission(options);
		options.assertCurrent?.();
		const input = options.input;
		const { key } = identity;
		const admittedPaths = captureSqliteWorkerAdmissionPaths(databasePath, identity, this.actors.values());
		if (options.existingOnly && !key.startsWith("file:")) {
			this.clients.delete(client);
			return;
		}
		const { modulePath, moduleUrl } = await resolveSqliteWorkerModuleUrl(options.moduleUrl);
		options.assertCurrent?.();
		let actor = this.actors.get(key);
		if (actor?.retirementRequested) {
			if (actor.retirement) {
				await actor.retirement;
				return this.openAdmitted(options, client);
			}
			throw new SqliteWorkerError("SQLite actor retirement must finish before reopening", "closed");
		}
		if (actor?.cleanupState === "pending") {
			if (actor.closing) {
				await actor.closing;
				return this.openAdmitted(options, client);
			}
			throw new SqliteWorkerError("SQLite worker cleanup is pending; retry close before reopening", "closed");
		}
		if (actor) {
			assertSqliteWorkerActorReusable(actor, moduleUrl, inputHash, options.stateContext);
			actor.references += 1;
		} else {
			const slot = await this.acquireSlot(options);
			try {
				options.assertCurrent?.();
			} catch (error) {
				return this.lifecycle.rejectSlotAdmission(slot, error);
			}
			const nativeStopped = createDeferredCore();
			actor = {
				runtimeGeneration: options.runtimeGeneration,
				nativeStopped: nativeStopped.promise,
				markNativeStopped: nativeStopped.resolve,
				pendingStateLifecycles: /* @__PURE__ */ new Set(),
				id: ++this.nextActor,
				key,
				pathReferences: new Map([...admittedPaths].map((pathname) => [pathname, 1])),
				moduleUrl,
				inputHash,
				slot,
				references: 1,
				opened: Promise.resolve(),
				openDispatch: { dispatched: false },
				initialized: false,
				backendClosed: false,
				databasePath,
				stateContext: options.stateContext,
				stateDatabasePath: options.stateDatabasePath
			};
			this.actors.set(key, actor);
			slot.actors.add(actor);
			slot.pendingOpens -= 1;
			const opening = actor;
			opening.opened = this.enqueue(slot, {
				type: "open",
				actor: actor.id,
				moduleUrl,
				databasePath,
				...options.createAdmission ? { openAdmission: "input" } : options.createOpenAdmission ? { openAdmission: "identity" } : {},
				...options.existingOnly ? { existingIdentity: key } : {},
				input,
				...options.preparation ? { preparation: options.preparation } : {},
				.../\.[cm]?ts$/.test(modulePath) ? { sourceLoaderUrl: import.meta.resolve("tsx/esm/api") } : {}
			}, input.byteLength + (options.preparation?.byteLength ?? 0), {
				dispatchState: opening.openDispatch,
				assertCurrent: options.assertCurrent,
				maintenanceScope: options.maintenanceScope,
				createAdmission: options.createAdmission ?? options.createOpenAdmission
			}).then(async () => {
				opening.initialized = true;
				const physical = await resolveOpenedSqliteWorkerIdentity(databasePath, identity, (id) => {
					const existing = this.actors.get(id);
					return existing !== void 0 && existing !== opening;
				});
				if (physical !== key) {
					this.actors.delete(key);
					opening.key = physical;
					this.actors.set(physical, opening);
				}
			});
		}
		const admittedActor = actor;
		try {
			retainSqliteWorkerAdmissionCleanup(admittedActor, options.retainCleanup, () => this.lifecycle.closeActor(admittedActor, options.maintenanceScope));
			options.onNativeStopped?.(actor.nativeStopped);
			await actor.opened;
			options.assertCurrent?.();
			if (actor.retirementRequested) throw new SqliteWorkerError("SQLite actor retired during client admission", "closed");
			if (actor.slot.failed) throw actor.slot.failed;
		} catch (error) {
			this.lifecycle.releaseActorReference(actor);
			if (!actor.references) {
				const errors = [error];
				try {
					if (actor.initialized) await this.lifecycle.closeActor(actor, options.maintenanceScope);
					else {
						if ((!actor.openDispatch.dispatched || actor.openDispatch.openNotEntered) && !actor.slot.failed) {
							actor.backendClosed = true;
							actor.markNativeStopped();
							actor.cleanupState = "pending";
							releaseSqliteWorkerActorCoordinators(actor);
						}
						if (actor.openDispatch.dispatched && !actor.openDispatch.openNotEntered) {
							this.fail(actor.slot, error);
							await actor.slot.exit;
						}
						this.lifecycle.forget(actor);
						await this.lifecycle.retireEmpty(actor.slot);
					}
				} catch (cleanupError) {
					errors.push(cleanupError);
				}
				if (errors.length > 1) throw new AggregateError(errors, "SQLite worker admission and cleanup failed", { cause: error });
			}
			throw error;
		}
		const owned = actor;
		const releasePaths = retainSqliteWorkerAdmissionPathReferences(owned, admittedPaths);
		let referenceReleased = false;
		const { store, client: storeClient } = createSqliteWorkerClient({
			actor: owned,
			isDraining: () => this.draining !== void 0,
			isAvailable: () => !owned.slot.failed && !owned.cleanupState && !owned.retirementRequested,
			dispatch: (payload, signal, scope, assertCurrent, createAdmission) => this.enqueue(owned.slot, {
				type: "execute",
				actor: owned.id,
				input: payload,
				...scope?.stateContext ? { stateContext: scope.stateContext } : {}
			}, payload.byteLength, {
				signal,
				scope,
				assertCurrent,
				createAdmission,
				maintenanceScope: options.maintenanceScope
			}),
			release: async () => {
				if (!referenceReleased) {
					referenceReleased = true;
					this.lifecycle.releaseActorReference(owned);
					this.stores.delete(store);
					this.clients.delete(client);
					releasePaths();
				}
				if (this.draining) await this.draining;
				else if (owned.slot.failed) await owned.slot.exit;
				if (!owned.references) await this.lifecycle.closeActor(owned, options.maintenanceScope);
			}
		});
		this.stores.set(store, storeClient);
		return store;
	}
	runOperation(store, operation, stateContext, assertCurrent, createAdmission, requireStateLifecycle = false) {
		return runSqliteWorkerClientOperation(this.draining ? void 0 : this.stores.get(store), operation, stateContext, (pending) => {
			this.operations.add(pending);
			return () => this.operations.delete(pending);
		}, assertCurrent, createAdmission, requireStateLifecycle);
	}
	isAvailable(store) {
		return this.stores.get(store)?.isAvailable() ?? false;
	}
	retireActor(identity) {
		return this.lifecycle.retireActor(identity);
	}
	getActorIdentity(store) {
		const client = this.stores.get(store);
		if (!client || client.sealed || !client.actor.stateContext || !client.isAvailable()) throw new SqliteWorkerError("SQLite shared actor binding is unavailable", "closed");
		return client.actor;
	}
	hasUnclaimedSharedStateCleanup(databasePath) {
		return findUnclaimedSharedStateActors(this.actors.values(), databasePath).length > 0;
	}
	async closeUnclaimedSharedState(databasePath) {
		await this.inputAdmission.joinOpens();
		await closeUnclaimedSharedStateActors(this.actors.values(), databasePath, (actor) => this.lifecycle.closeActor(actor));
	}
	async acquireSlot(options) {
		options.assertCurrent?.();
		const available = [...this.slots].filter((slot) => !slot.failed && !slot.retiring && slot.runtimeGeneration === options.runtimeGeneration);
		const borrowedGenerationSlot = !process.versions.bun && options.runtimeGeneration !== void 0 && available.length === 0 && this.slots.size >= this.maxWorkers && ![...this.slots].some((slot) => slot.borrowedGenerationSlot);
		if (!borrowedGenerationSlot && this.slots.size >= (process.versions.bun ? MAX_STORES : this.maxWorkers)) {
			if (!available.length || process.versions.bun) {
				const retiring = [...this.slots].filter((slot) => Boolean(slot.failed || slot.retiring));
				if (retiring.length > 0) {
					await Promise.race(retiring.map(({ exit }) => exit));
					return this.acquireSlot(options);
				}
				if (process.versions.bun) throw new SqliteWorkerError("SQLite worker store capacity reached", "overloaded");
				if (!available.length) throw new SqliteWorkerError("SQLite worker runtime capacity reached", "overloaded");
			}
			const selected = available.reduce((left, right) => left.actors.size <= right.actors.size ? left : right);
			selected.pendingOpens += 1;
			return selected;
		}
		return this.lifecycle.createSlot(options, borrowedGenerationSlot, (slot) => ({
			fail: (reason, currentError, completed, openOutcome) => this.fail(slot, reason, currentError, completed, openOutcome),
			finish: (job, error, value, settlement) => this.finish(job, error, value, settlement),
			dispatch: () => this.dispatch(slot)
		}));
	}
	enqueue(slot, body, bytes, options = {}) {
		const { signal, dispatchState, scope, assertCurrent, createAdmission, maintenanceScope } = options;
		if (this.draining && body.type !== "close" && !scope?.active) return Promise.reject(new SqliteWorkerError("SQLite worker host is closing", "closed"));
		if (slot.failed) return Promise.reject(slot.failed);
		const activeInput = body.type === "execute" && bytes > 67108864;
		const reservedBytes = activeInput ? SQLITE_WORKER_MAX_MESSAGE_BYTES : bytes;
		if (body.type !== "close" && (body.type !== "execute" && bytes > 33554432 || activeInput && (slot.current || slot.queue.length > 0 || slot.pendingOpens > 0) || this.bytes + this.inputAdmission.retainedBytes + reservedBytes > 67108864)) return Promise.reject(new SqliteWorkerError("SQLite worker queue capacity reached", "overloaded"));
		if (body.type !== "close" && this.requests >= 128) {
			if (activeInput || this.draining) return Promise.reject(new SqliteWorkerError("SQLite worker queue capacity reached", "overloaded"));
			return this.waitForCapacity(slot, body, bytes, options);
		}
		const result = createDeferredCore();
		const job = {
			requireStateLifecycle: scope?.requireStateLifecycle,
			maintenanceScope,
			createAdmission,
			assertCurrent,
			dispatchState,
			request: {
				...body,
				id: ++this.nextRequest
			},
			bytes: reservedBytes,
			resolve: result.resolve,
			reject: result.reject,
			detach: () => signal?.removeEventListener("abort", abort)
		};
		const abort = () => {
			const index = slot.queue.indexOf(job);
			if (index >= 0) {
				slot.queue.splice(index, 1);
				this.finish(job, signal?.reason ?? /* @__PURE__ */ new Error("SQLite worker operation canceled"));
			}
			if (slot.current === job && !job.nativeDispatched) job.cancelPreparation?.abort(signal?.reason);
		};
		this.requests += 1;
		this.bytes += reservedBytes;
		if (activeInput) {
			signal?.addEventListener("abort", abort, { once: true });
			if (signal?.aborted) this.finish(job, signal.reason ?? /* @__PURE__ */ new Error("SQLite worker operation canceled"));
			else this.dispatchJob(slot, job);
			return result.promise;
		}
		slot.queue.push(job);
		signal?.addEventListener("abort", abort, { once: true });
		if (signal?.aborted) abort();
		this.dispatch(slot);
		return result.promise;
	}
	waitForCapacity(slot, body, bytes, options) {
		return new Promise((resolve, reject) => {
			const started = Date.now();
			const signal = options.signal;
			const resume = (error) => {
				if (!this.waiters.delete(resume)) return;
				clearTimeout(timer);
				signal?.removeEventListener("abort", abort);
				releaseInput();
				let failure = error;
				if (failure === void 0 && Date.now() - started >= ADMISSION_TIMEOUT_MS) {
					this.warnAdmission(Date.now() - started);
					failure = new SqliteWorkerError("SQLite worker queue capacity reached", "overloaded");
				}
				if (failure !== void 0) reject(toErrorObject(failure, "SQLite worker admission failed"));
				else resolve(this.enqueue(slot, body, bytes, options));
			};
			const abort = () => resume(signal?.reason ?? /* @__PURE__ */ new Error("SQLite worker operation canceled"));
			const timer = setTimeout(() => {
				this.warnAdmission(Date.now() - started);
				resume(new SqliteWorkerError("SQLite worker queue capacity reached", "overloaded"));
			}, ADMISSION_TIMEOUT_MS);
			const releaseInput = this.inputAdmission.retain(bytes);
			this.waiters.set(resume, slot);
			signal?.addEventListener("abort", abort, { once: true });
			if (signal?.aborted) abort();
			else if (this.waiters.size >= 128) this.warnAdmission(0);
		});
	}
	warnAdmission(waitMs) {
		const now = Date.now();
		if (now >= this.nextAdmissionWarning) {
			this.nextAdmissionWarning = now + ADMISSION_TIMEOUT_MS;
			getChildLogger({ subsystem: "infra/sqlite-worker" }).warn("SQLite worker admission delayed", {
				queueDepth: this.waiters.size,
				waitMs
			});
		}
	}
	dispatch(slot) {
		if (slot.current || slot.failed) return;
		const job = slot.queue.shift();
		if (!job) {
			slot.worker.unref();
			return;
		}
		this.dispatchJob(slot, job);
	}
	dispatchJob(slot, job) {
		slot.current = job;
		slot.worker.ref();
		dispatchSqliteWorkerJob(slot, job, (error, retire) => {
			if (slot.current !== job) return;
			if (retire) this.fail(slot, error, toErrorObject(error, "SQLite worker transfer failed"));
			else {
				slot.current = void 0;
				this.finish(job, error);
				this.dispatch(slot);
			}
		});
	}
	finish(job, error, value, settlement) {
		this.requests -= 1;
		this.bytes -= job.bytes;
		settleSqliteWorkerJob(job, error, value, settlement);
		if (!this.resuming) {
			this.resuming = true;
			while (this.requests < 128 && this.waiters.size) this.waiters.keys().next().value?.();
			this.resuming = false;
		}
	}
	fail(slot, reason, currentError, completed, openOutcome) {
		if (slot.failed) return;
		const error = toErrorObject(reason, "SQLite worker failed");
		slot.failed = new SqliteWorkerError(error.message, "unavailable");
		for (const [resume, waitingSlot] of this.waiters) if (waitingSlot === slot) resume(slot.failed);
		if (completed) slot.retiredAfterCompletion = true;
		const current = slot.current;
		slot.current = void 0;
		if (current) {
			current.inputTransfer?.producer.cancel();
			current.inputTransfer = void 0;
			current.transfer = void 0;
		}
		const queued = slot.queue.splice(0);
		settleFailedSqliteWorkerJobs({
			queuedError: slot.failed,
			current,
			queued,
			error,
			currentError,
			completed,
			openOutcome,
			retire: () => this.lifecycle.retire(slot),
			finish: (job, failure, value, settlement) => this.finish(job, failure, value, settlement)
		});
	}
	close() {
		this.draining ??= (async () => {
			this.inputAdmission.invalidatePreparations();
			for (const resume of this.waiters.keys()) resume(new SqliteWorkerError("SQLite worker host is closing", "overloaded"));
			for (const client of this.stores.values()) client.sealed = true;
			await this.inputAdmission.joinOpens();
			await Promise.allSettled(this.operations);
			const errors = (await Promise.allSettled([...this.actors.values()].map((actor) => this.lifecycle.closeActor(actor)))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
			await this.inputAdmission.joinPreparations();
			if (errors.length) throw new AggregateError(errors, "SQLite worker host cleanup failed");
		})().finally(() => {
			this.clients.clear();
			this.stores.clear();
			this.draining = void 0;
		});
		return this.draining;
	}
};
//#endregion
//#region src/infra/sqlite-worker-store.ts
function withCallerErrors(result) {
	return result.catch((error) => {
		if (error instanceof Error) throw hydrateOpenClawStateWorkerError(error);
		throw error;
	});
}
function bindCallerExecute(scope) {
	return { execute: (command, options) => {
		const result = withCallerErrors(scope.execute(command, options));
		result.catch(() => void 0);
		return result;
	} };
}
/** Retain one actor through local reconciliation; the callback must not await its own close. */
function runSqliteWorkerStoreOperation(store, operation, stateContext, assertCurrent, createAdmission, requireStateLifecycle = false) {
	return withCallerErrors(resolveSqliteWorkerBroker().runOperation(store, (scope) => operation(bindCallerExecute(scope)), stateContext, assertCurrent, createAdmission, requireStateLifecycle));
}
function resolveSqliteWorkerBroker() {
	return resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerBroker"), () => new SqliteWorkerBroker(), (broker) => withCallerErrors(broker.close()));
}
/** Read the broker's recorded lifecycle state without probing native storage. */
function isSqliteWorkerStoreAvailable(store) {
	return resolveSqliteWorkerBroker().isAvailable(store);
}
/** Internal identity for the existing canonical actor, never a transferable authority. */
function getSqliteWorkerActorIdentity(store) {
	return resolveSqliteWorkerBroker().getActorIdentity(store);
}
function retireSqliteWorkerActor(identity) {
	return withCallerErrors(resolveSqliteWorkerBroker().retireActor(identity));
}
/** Recorded orphan custody at its original shared-state opening path. */
function hasUnclaimedSharedStateSqliteCleanup(databasePath) {
	return resolveSqliteWorkerBroker().hasUnclaimedSharedStateCleanup(databasePath);
}
/** Explicit cleanup only; referenced actors and other opening scopes are untouched. */
function closeUnclaimedSharedStateSqliteWorkers(databasePath) {
	return withCallerErrors(resolveSqliteWorkerBroker().closeUnclaimedSharedState(databasePath));
}
/** Host-internal admission for the canonical shared-state actor. */
function openSharedStateSqliteWorkerStore(options, stateContext, assertCurrent, lifecycle) {
	if (!isMainThread) return Promise.reject(new SqliteWorkerError("Shared-state admission requires the host broker", "unavailable"));
	return withCallerErrors(resolveSqliteWorkerBroker().open({
		...options,
		input: void 0
	}, stateContext, assertCurrent, lifecycle)).then((store) => {
		if (store) {
			const execute = store.execute.bind(store);
			const close = store.close.bind(store);
			store.execute = bindCallerExecute({ execute }).execute;
			store.close = () => withCallerErrors(close());
		}
		return store;
	});
}
//#endregion
//#region src/infra/runtime-worker-generation.ts
const scope = resolveGlobalSingleton(Symbol.for("openclaw.runtimeWorkerGeneration"), () => new AsyncLocalStorage());
/** Capture before queues or detached pool contexts discard the caller's scope. */
function captureRuntimeWorkerSource(url) {
	const generation = scope.getStore()?.generation;
	const bound = generation?.resolve(url);
	return bound && bound.href !== url.href ? {
		moduleUrl: bound,
		runtimeGeneration: generation
	} : { moduleUrl: url };
}
//#endregion
//#region src/state/openclaw-state-worker-operation.ts
function runWithCapturedWorkerContext(context, operation) {
	const maintenance = context.maintenanceScope;
	const run = () => maintenance ? maintenance.run(() => maintenance.track(operation())) : operation();
	return context.runInCapturedSchemaScope ? context.runInCapturedSchemaScope(run) : run();
}
function runWithOpenClawStateWorkerStore(store, context, operation, assertCurrent, createAdmission, requireStateLifecycle = false) {
	const { admission } = context;
	return runSqliteWorkerStoreOperation(store, operation, context, (commandType) => {
		admission.assertCurrent();
		assertCurrent?.(commandType);
	}, createAdmission, requireStateLifecycle);
}
//#endregion
//#region src/state/openclaw-state-worker-store.ts
const log = createSubsystemLogger("state/worker");
const SHARED_STATE_WORKER_IDLE_INSPECT_MS = 6e4;
function createSharedStateWorkerOwner() {
	const moduleUrl = resolveRuntimeProcessEntrypointUrl("sharedStateStore");
	const stores = /* @__PURE__ */ new Set();
	const activeEntries = /* @__PURE__ */ new Set();
	const retiring = /* @__PURE__ */ new Map();
	const retiringActors = /* @__PURE__ */ new Map();
	const matches = (entry, identity) => identity === void 0 || entry.context.admission.identity.key === identity.key;
	const hasActiveActorOperations = (entry) => [...activeEntries].some((active) => entry.actor ? active.actor === entry.actor : active === entry);
	const clearIdleRetirement = (entry) => {
		if (entry.idleTimer) {
			clearTimeout(entry.idleTimer);
			entry.idleTimer = void 0;
		}
	};
	const hasPendingCleanup = (entry) => entry.cleanup?.pending ?? (!entry.context.maintenanceScope && hasUnclaimedSharedStateSqliteCleanup(entry.context.admission.databasePath));
	const retire = (entry) => {
		clearIdleRetirement(entry);
		stores.delete(entry);
		let attempt = retiring.get(entry);
		if (!attempt) {
			attempt = {};
			retiring.set(entry, attempt);
		}
		if (attempt.pending) return attempt.pending;
		if (entry.actor && retiringActors.has(entry.actor)) return retireActor(entry.actor, entry.context.admission.identity);
		const pending = (entry.store ? entry.store.close() : entry.opening.then((store) => store?.close(), () => entry.cleanup ? entry.cleanup.close() : entry.context.maintenanceScope ? void 0 : closeUnclaimedSharedStateSqliteWorkers(entry.context.admission.databasePath))).catch(async (error) => {
			if (!attempt.actorSettlement) throw error;
			await attempt.actorSettlement;
		});
		attempt.pending = pending;
		const settled = () => {
			attempt.pending = void 0;
			if (!hasPendingCleanup(entry)) retiring.delete(entry);
		};
		pending.then(settled, settled);
		return pending;
	};
	const scheduleIdleRetirement = (entry) => {
		if (entry.activeOperations !== 0 || entry.idleTimer || entry.context.maintenanceScope || !entry.store || !stores.has(entry)) return;
		const store = entry.store;
		const generation = entry.operationGeneration;
		const deadline = performance$1.now() + SQLITE_IDLE_HANDLE_TTL_MS;
		const arm = (delay, inspect) => {
			const isCurrentIdle = () => entry.idleTimer === timer && entry.operationGeneration === generation && entry.activeOperations === 0 && stores.has(entry);
			const settle = async () => {
				if (!isCurrentIdle()) return;
				let healthy = false;
				if (inspect) try {
					healthy = await runWithCapturedWorkerContext(entry.context, () => runSqliteWorkerStoreOperation(store, (scope) => scope.execute({
						type: "database.inspectIdle",
						input: void 0
					}), entry.context, () => {
						entry.context.admission.assertCurrent();
						if (!isCurrentIdle()) throw new Error("Shared-state worker resumed before idle inspection");
					}, void 0, true)) === "healthy" && isSqliteWorkerStoreAvailable(store);
					entry.context.admission.assertCurrent();
				} catch {
					healthy = false;
				}
				if (!isCurrentIdle()) return;
				entry.idleTimer = void 0;
				const remaining = deadline - performance$1.now();
				if (healthy && remaining > 0) arm(remaining, false);
				else await retire(entry);
			};
			const timer = runInDetachedAsyncContext(() => setTimeout(() => {
				settle().catch((error) => {
					log.warn("Idle shared-state worker retirement failed", {
						path: entry.context.admission.databasePath,
						error
					});
				});
			}, delay));
			entry.idleTimer = timer;
			timer.unref?.();
		};
		arm(SHARED_STATE_WORKER_IDLE_INSPECT_MS, true);
	};
	const retainOperation = (store) => {
		const entry = [...stores].find((candidate) => candidate.store === store);
		if (!entry) throw new Error("Shared-state worker operation lost its actor owner");
		clearIdleRetirement(entry);
		entry.operationGeneration += 1;
		entry.activeOperations += 1;
		activeEntries.add(entry);
		let released = false;
		return () => {
			if (released) return;
			released = true;
			entry.activeOperations -= 1;
			if (entry.activeOperations === 0) activeEntries.delete(entry);
			if (stores.has(entry) && !isSqliteWorkerStoreAvailable(store) && !hasActiveActorOperations(entry)) {
				(entry.actor ? retireActor(entry.actor, entry.context.admission.identity) : retire(entry)).catch((error) => {
					log.warn("Shared-state worker retirement failed", {
						path: entry.context.admission.databasePath,
						error
					});
				});
				return;
			}
			scheduleIdleRetirement(entry);
		};
	};
	const retainActorSettlement = (attempt, pending) => {
		for (const entry of attempt.entries) {
			const closing = retiring.get(entry);
			if (closing) closing.actorSettlement = pending;
		}
		return pending;
	};
	const retireActor = (actor, identity) => {
		let attempt = retiringActors.get(actor);
		if (!attempt) {
			attempt = {
				identity,
				entries: /* @__PURE__ */ new Set()
			};
			retiringActors.set(actor, attempt);
		}
		for (const entry of [...stores, ...retiring.keys()]) if (entry.actor === actor) {
			attempt.entries.add(entry);
			clearIdleRetirement(entry);
			stores.delete(entry);
		}
		if (attempt.pending) return retainActorSettlement(attempt, attempt.pending);
		const current = attempt;
		const complete = () => {
			for (const entry of current.entries) {
				clearIdleRetirement(entry);
				stores.delete(entry);
				retiring.delete(entry);
			}
			retiringActors.delete(actor);
		};
		const pending = retireSqliteWorkerActor(actor).then(complete, (error) => {
			current.pending = void 0;
			if (current.entries.size > 0 && [...current.entries].every((entry) => entry.cleanup?.pending === false)) {
				complete();
				return;
			}
			throw error;
		});
		current.pending = pending;
		return retainActorSettlement(current, pending);
	};
	const joinActorRetirement = async (attempt) => {
		if (!attempt.pending) throw new Error("Shared-state actor cleanup is pending; close the database before reopening");
		await attempt.pending;
	};
	async function close(identity) {
		for (const entry of stores.values()) if (matches(entry, identity)) retire(entry);
		const errors = (await Promise.allSettled([...[...retiring.keys()].filter((entry) => matches(entry, identity)).map(retire), ...[...retiringActors].filter(([, attempt]) => !identity || attempt.identity.key === identity.key).map(([actor, attempt]) => retireActor(actor, attempt.identity))])).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
		if (errors.length) throw new AggregateError(errors, "Failed to close shared-state SQLite workers");
	}
	registerOpenClawStateDatabaseAsyncResource({ close });
	registerOpenClawStateDatabaseLifecycleListener((event) => {
		if (event.kind !== "opened") {
			if (!event.identity) return;
			close(event.identity).catch((error) => {
				log.warn("Shared-state worker retirement failed", {
					path: event.path,
					error
				});
			});
		}
	});
	channel("openclaw.memory.critical").subscribe(() => {
		for (const entry of stores) if (entry.idleTimer && entry.store && !entry.context.maintenanceScope && !hasActiveActorOperations(entry)) runInDetachedAsyncContext(() => retire(entry)).catch((error) => {
			log.warn("Idle shared-state worker retirement failed", {
				path: entry.context.admission.databasePath,
				error
			});
		});
	});
	return {
		close,
		retainOperation,
		openCleanup(databasePath, context, assertOwned) {
			return openSharedStateSqliteWorkerStore({
				...captureRuntimeWorkerSource(moduleUrl),
				databasePath,
				existingOnly: true
			}, context, assertOwned);
		},
		async open(context, options = {}) {
			const { existingOnly = false, assertCurrent, preparation } = options;
			const { admission } = context;
			const source = captureRuntimeWorkerSource(moduleUrl);
			const assertAdmission = () => {
				admission.assertCurrent();
				assertCurrent?.();
			};
			assertAdmission();
			isExistingOpenClawStateSchema(admission.databasePath);
			if (getExistingOpenClawStateSchemaPath() !== context.existingSchemaPath) throw new Error("Shared-state worker schema context does not match its caller");
			let entry;
			for (;;) {
				for (const candidate of stores) if (matches(candidate, admission.identity) && (candidate.context.existingSchemaPath !== context.existingSchemaPath || candidate.source.moduleUrl.href !== source.moduleUrl.href)) {
					await retire(candidate);
					assertAdmission();
				}
				for (const attempt of retiringActors.values()) if (attempt.identity.key === admission.identity.key) {
					await joinActorRetirement(attempt);
					assertAdmission();
				}
				for (const [retiringEntry, attempt] of retiring) if (matches(retiringEntry, admission.identity) && retiringEntry.context.maintenanceScope === context.maintenanceScope) {
					if (!attempt.pending) {
						if (!hasPendingCleanup(retiringEntry)) {
							retiring.delete(retiringEntry);
							continue;
						}
						throw new Error("Shared-state SQLite cleanup is pending; close the database before reopening");
					}
					try {
						await attempt.pending;
					} catch (error) {
						if (retiring.get(retiringEntry) === attempt) throw error;
					}
					assertAdmission();
				}
				assertAdmission();
				entry = [...stores].find((candidate) => matches(candidate, admission.identity) && candidate.context.maintenanceScope === context.maintenanceScope && candidate.context.existingSchemaPath === context.existingSchemaPath);
				if (!entry || entry.store || entry.openingAdmission.assertCurrent === assertCurrent) break;
				let rejected;
				try {
					if (!await entry.opening) stores.delete(entry);
				} catch (error) {
					rejected = { error };
				}
				assertAdmission();
				if (rejected && (!entry.openingAdmission.refusal || !Object.is(rejected.error, entry.openingAdmission.refusal.error))) throw rejected.error;
			}
			if (!entry) {
				const openingAdmission = { assertCurrent };
				const assertOpeningAdmission = () => {
					admission.assertCurrent();
					try {
						assertCurrent?.();
					} catch (error) {
						openingAdmission.refusal = { error };
						throw error;
					}
				};
				const admitted = {
					source,
					context,
					openingAdmission,
					existingOnly,
					activeOperations: 0,
					operationGeneration: 0,
					opening: runInDetachedAsyncContext(() => openSharedStateSqliteWorkerStore({
						...source,
						databasePath: admission.databasePath,
						existingOnly
					}, context, assertOpeningAdmission, {
						maintenanceScope: context.maintenanceScope,
						preparation,
						retainCleanup: (cleanup) => {
							admitted.cleanup = cleanup;
						}
					}))
				};
				entry = admitted;
				admitted.opening = admitted.opening.then((store) => {
					if (store) {
						admitted.store = store;
						admitted.actor = getSqliteWorkerActorIdentity(store);
					}
					return store;
				});
				stores.add(entry);
				context.maintenanceScope?.own(entry, "shared-resources", () => retire(admitted));
				entry.opening.catch(() => {
					stores.delete(admitted);
					if (hasPendingCleanup(admitted) && !retiring.has(admitted)) retiring.set(admitted, {});
				});
			}
			const store = await entry.opening;
			try {
				admission.assertCurrent();
			} catch (error) {
				try {
					await retire(entry);
				} catch (cleanupError) {
					throw new AggregateError([error, cleanupError], "Shared-state worker admission and cleanup failed", { cause: cleanupError });
				}
				throw error;
			}
			assertCurrent?.();
			if (!store) {
				stores.delete(entry);
				return !existingOnly && entry.existingOnly ? this.open(context, {
					...options,
					existingOnly: false
				}) : void 0;
			}
			if (!stores.has(entry)) return this.open(context, options);
			clearIdleRetirement(entry);
			const actorRetirement = entry.actor ? retiringActors.get(entry.actor) : void 0;
			if (entry.actor && actorRetirement) {
				actorRetirement.entries.add(entry);
				stores.delete(entry);
				await joinActorRetirement(actorRetirement);
				return this.open(context, options);
			}
			if (!isSqliteWorkerStoreAvailable(store) && !hasActiveActorOperations(entry)) {
				await (entry.actor ? retireActor(entry.actor, admission.identity) : retire(entry));
				return this.open(context, options);
			}
			try {
				if (!entry.bound) {
					publishOpenClawStateDatabaseWorkerAdmission(entry.context.admission);
					entry.bound = true;
				}
			} catch (error) {
				try {
					await retire(entry);
				} catch (cleanupError) {
					throw new AggregateError([error, cleanupError], "Shared-state worker binding and cleanup failed", { cause: cleanupError });
				}
				throw error;
			}
			stores.delete(entry);
			stores.add(entry);
			return store;
		}
	};
}
function owner() {
	return resolveGlobalSingleton(Symbol.for("openclaw.sharedStateWorkerOwner"), createSharedStateWorkerOwner, (sharedOwner) => sharedOwner.close());
}
/** Retired cleanup uses the retained owner's backend without renewing read admission. */
function openOpenClawStateWorkerCleanupStore(databasePath, context, assertOwned) {
	return owner().openCleanup(databasePath, context, assertOwned);
}
async function executeOpenClawStateWorker(context, command) {
	const result = await runOpenClawStateWorkerOperation(context, (scope) => scope.execute(command));
	context.admission.assertCurrent();
	return result;
}
async function runOpenClawStateWorkerOperation(context, operation, options) {
	return runWithCapturedWorkerContext(context, () => runAdmittedOpenClawStateWorkerOperation(context, operation, options));
}
async function runAdmittedOpenClawStateWorkerOperation(context, operation, options) {
	try {
		context.admission.assertCurrent();
		options?.assertCurrent?.();
		const failure = await getOpenClawStateDatabaseTerminalFailureAsync(context);
		if (failure) throw failure;
		context.admission.assertCurrent();
		options?.assertCurrent?.();
		const store = await owner().open(context, options);
		context.admission.assertCurrent();
		if (!store) {
			if (options?.existingOnly) return;
			throw new Error("Canonical shared-state worker did not open its database");
		}
		const releaseOperation = owner().retainOperation(store);
		try {
			context.admission.assertCurrent();
			options?.assertCurrent?.();
			return await runWithOpenClawStateWorkerStore(store, context, operation, options?.assertCurrent, options?.createAdmission, options?.requireStateLifecycle === true || options?.createAdmission !== void 0);
		} finally {
			releaseOperation();
		}
	} catch (error) {
		if (error instanceof Error) throw hydrateOpenClawStateWorkerError(error);
		throw error;
	}
}
/** Inspect the existing file without recursively admitting a domain operation. */
async function inspectOpenClawStateDatabase(context, command) {
	return runWithCapturedWorkerContext(context, () => inspectAdmittedOpenClawStateDatabase(context, command));
}
async function inspectAdmittedOpenClawStateDatabase(context, command) {
	try {
		const store = await owner().open(context, { existingOnly: true });
		context.admission.assertCurrent();
		if (!store) return;
		const releaseOperation = owner().retainOperation(store);
		try {
			context.admission.assertCurrent();
			return await runWithOpenClawStateWorkerStore(store, context, (scope) => scope.execute(command));
		} finally {
			releaseOperation();
		}
	} catch (error) {
		if (error instanceof Error) throw hydrateOpenClawStateWorkerError(error);
		throw error;
	}
}
//#endregion
export { executeOpenClawStateWorker, inspectOpenClawStateDatabase, openOpenClawStateWorkerCleanupStore, runOpenClawStateWorkerOperation };
