import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import "./src-CZ2wJvNB.mjs";
import { n as formatByteSize } from "./format-C1IjPxxo.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as resolveNodeCompileCacheEnv } from "./node-compile-cache-env-DxpWFM0X.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { u as retainSnapshotWork } from "./sqlite-readonly-location-cleanup-uwwsHidB.mjs";
import { n as runtimeProcessEntrypoints, t as SQLITE_READONLY_CHILD_ARG } from "./runtime-process-entrypoints-DazJcPEG.mjs";
import { t as getSpawnBroker } from "./context-5XyHo0If.mjs";
import { r as resolveRuntimeWorkerUrl, t as resolveRuntimeWorkerArgv } from "./runtime-worker-url-B4o9tqvO.mjs";
import { t as BrokerChild } from "./child-C7738Y0I.mjs";
import fs from "node:fs";
import { toUSVString } from "node:util";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { execFile, spawn, spawnSync } from "node:child_process";
import { deserialize, serialize } from "node:v8";
//#region src/infra/sqlite-readonly-worker-protocol.ts
const SQLITE_READONLY_WORKER_MAX_BUFFER = 1048576;
function isSqliteSnapshotStagingMode(mode) {
	return mode === "staging-create" || mode === "staging-create-legacy" || mode === "staging-reconcile" || mode === "staging-retire";
}
var SqliteReadOnlyInspectionContentionError = class extends Error {};
function isSqliteReadOnlyWorkerResult(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	if (Object.keys(value).length !== 2 || !("ok" in value)) return false;
	return value.ok === true && "location" in value && typeof value.location === "string" || value.ok === true && "warnings" in value && Array.isArray(value.warnings) && value.warnings.every((warning) => typeof warning === "string") || value.ok === false && "message" in value && typeof value.message === "string";
}
function createSqliteReadOnlyWorkerError(message, stderr) {
	const stderrTail = toUSVString(sliceUtf16Safe(stderr.trim(), -4e3));
	return /* @__PURE__ */ new Error(`SQLite read-only worker ${message}${stderrTail ? `\nstderr (tail): ${stderrTail}` : ""}`);
}
function parseSqliteReadOnlyWorkerResult(stdout, stderr) {
	if (!stdout.trim()) throw createSqliteReadOnlyWorkerError("returned no JSON result", stderr);
	let message;
	try {
		message = JSON.parse(stdout);
	} catch {
		throw createSqliteReadOnlyWorkerError("returned invalid JSON", stderr);
	}
	if (!isSqliteReadOnlyWorkerResult(message)) throw createSqliteReadOnlyWorkerError("returned an invalid result", stderr);
	return message;
}
function readSqliteReadOnlyWorkerValue(params, mode) {
	let result;
	try {
		result = parseSqliteReadOnlyWorkerResult(params.stdout, params.stderr);
	} catch (error) {
		if (params.failure) throw createSqliteReadOnlyWorkerError(params.failure, params.stderr);
		throw error;
	}
	if (params.failure || !result.ok) {
		const contention = !result.ok && result.message.startsWith("Retryable SQLite inspection contention: ");
		const error = createSqliteReadOnlyWorkerError(!result.ok ? contention ? result.message.slice(40) : result.message : params.failure ?? "failed", params.stderr);
		if (contention) throw new SqliteReadOnlyInspectionContentionError(error.message);
		throw error;
	}
	if ((mode === "sync" || mode === "async" || mode === "consolidated" || isSqliteSnapshotStagingMode(mode)) && "location" in result) return result.location;
	if (mode === "reclaim" && "warnings" in result) return result.warnings;
	throw createSqliteReadOnlyWorkerError("returned a result for a different operation", params.stderr);
}
//#endregion
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
//#endregion
//#region src/infra/sqlite-readonly-auth-transfer.ts
function decodeFrame(value) {
	if (!isRecord(value) || typeof value.id !== "number" || !Number.isSafeInteger(value.id) || typeof value.sequence !== "number" || !Number.isSafeInteger(value.sequence)) throw new Error("Invalid auth profile transfer frame");
	const { id, sequence } = value;
	if (value.done === true && Array.isArray(value.counts)) {
		const counts = [];
		for (const entry of value.counts) {
			if (!Array.isArray(entry) || entry.length !== 2 || typeof entry[0] !== "string" || typeof entry[1] !== "number" || !Number.isSafeInteger(entry[1]) || entry[1] < 0) throw new Error("Invalid auth profile transfer counts");
			counts.push([entry[0], entry[1]]);
		}
		return {
			id,
			sequence,
			done: true,
			counts
		};
	}
	if (value.done !== false || typeof value.kind !== "string" || typeof value.recordBytes !== "number" || typeof value.offset !== "number" || typeof value.recordDone !== "boolean" || typeof value.bytes !== "string" || value.bytes.length > 4 * Math.ceil(8388608 / 3)) throw new Error("Invalid auth profile transfer bytes");
	const bytes = Buffer.from(value.bytes, "base64");
	if (bytes.toString("base64") !== value.bytes) throw new Error("Invalid auth profile transfer encoding");
	return {
		id,
		sequence,
		done: false,
		kind: value.kind,
		recordBytes: value.recordBytes,
		offset: value.offset,
		recordDone: value.recordDone,
		bytes
	};
}
function createSqliteAuthTransferReceiver() {
	let receiver;
	let transferId;
	let cacheable = false;
	let ending = false;
	let completed = false;
	const records = /* @__PURE__ */ new Map();
	return { accept(value) {
		if (!isRecord(value) || completed) throw new Error("Invalid auth profile transfer response");
		if (value.type === "start" && !receiver) {
			const handle = value.handle;
			if (!isRecord(handle) || typeof handle.id !== "number" || !Number.isSafeInteger(handle.id) || handle.id < 1 || typeof handle.cacheable !== "boolean" || !Array.isArray(handle.kinds) || handle.kinds.length !== 2 || handle.kinds[0] !== "store" || handle.kinds[1] !== "state") throw new Error("Invalid auth profile transfer handle");
			transferId = handle.id;
			cacheable = handle.cacheable;
			receiver = createSqliteWorkerTransferReceiver({
				id: transferId,
				kinds: ["store", "state"]
			}, ({ kind, value: record }) => {
				if (records.has(kind)) throw new Error("Duplicate auth profile transfer record");
				records.set(kind, record);
			});
			return { request: {
				type: "next",
				transferId
			} };
		}
		if (!receiver || transferId === void 0) throw new Error("Auth profile transfer has not started");
		if (value.type === "frame" && !ending) {
			if (receiver.accept(decodeFrame(value.frame))) {
				if (!records.has("store") || !records.has("state") || records.size !== 2) throw new Error("Incomplete auth profile transfer result");
				ending = true;
			}
			return { request: {
				type: ending ? "end" : "next",
				transferId
			} };
		}
		if (value.type === "complete" && ending) {
			completed = true;
			const rows = {
				store: records.get("store"),
				state: records.get("state"),
				cacheable
			};
			records.clear();
			return { rows };
		}
		throw new Error("Auth profile transfer response is out of order");
	} };
}
//#endregion
//#region src/infra/sqlite-readonly-worker-session.ts
function isSameSqliteReadOnlyWorkerLaunch(captured, requested) {
	const keys = Object.keys(requested.env);
	return captured.transport.kind === requested.transport.kind && (captured.transport.kind === "native" || requested.transport.kind === "broker" && captured.transport.owner === requested.transport.owner) && requested.cwd === captured.cwd && keys.length === Object.keys(captured.env).length && keys.every((key) => requested.env[key] === captured.env[key]);
}
function createSqliteReadOnlyWorkerSession(host) {
	const env = { ...host.env };
	const cwd = host.cwd;
	const transport = host.transport.kind === "broker" ? {
		kind: "broker",
		owner: host.transport.owner
	} : { kind: "native" };
	const capturedLaunch = {
		env,
		cwd,
		transport
	};
	const argv = [...host.argv];
	const spawnOptions = {
		env,
		cwd,
		stdio: [
			"ignore",
			"pipe",
			"pipe",
			"ipc"
		]
	};
	const child = transport.kind === "broker" ? transport.owner.spawn(process.execPath, argv, spawnOptions) : spawn(process.execPath, argv, spawnOptions);
	let retired = false;
	let sequence = 0;
	let stderr = "";
	let outputBytes = 0;
	let pending;
	let resolveClosed;
	const closed = new Promise((resolve) => {
		resolveClosed = resolve;
	}).then(() => {
		if (transport.kind === "broker" && child instanceof BrokerChild && !child.notStarted && child.exitCode === null && child.signalCode === null) return transport.owner.waitForCleanup();
	});
	const retire = (error) => {
		retired = true;
		if (pending && error !== void 0) pending.failure ??= error;
		child.kill("SIGKILL");
	};
	if (host.retainLifetime !== false) retainSnapshotWork(closed, () => retire(/* @__PURE__ */ new Error("SQLite snapshot owner stopped")));
	child.on("error", (error) => retire(error));
	child.once("close", (code, signal) => {
		retired = true;
		if (pending) {
			const request = pending;
			pending = void 0;
			request.cleanup();
			request.reject(request.failure ?? createSqliteReadOnlyWorkerError(`exited with ${signal ? `signal ${signal}` : `code ${code}`}`, stderr));
		}
		resolveClosed();
	});
	const captureOutput = (data, isStderr) => {
		outputBytes += data.length;
		if (isStderr) stderr = sliceUtf16Safe(stderr + data.toString("utf8"), -4e3);
		if (outputBytes > 1048576) retire(createSqliteReadOnlyWorkerError("exceeded its output buffer", stderr));
	};
	const attachOutput = () => {
		child.stdout?.on("data", (data) => captureOutput(data, false));
		child.stderr?.on("data", (data) => captureOutput(data, true));
	};
	const ready = child instanceof BrokerChild ? child.ready().then(attachOutput).catch(retire) : void 0;
	if (!ready) attachOutput();
	child.on("message", (message) => {
		if (retired) return;
		if (!pending || !message || typeof message !== "object" || Object.keys(message).length !== 2 || !("id" in message) || message.id !== pending.id || !("result" in message)) {
			retire(createSqliteReadOnlyWorkerError("returned an unexpected response", stderr));
			return;
		}
		try {
			let value;
			if (pending.auth && !(typeof message.result === "object" && message.result !== null && "ok" in message.result && message.result.ok === false)) {
				const reply = pending.auth.accept(message.result);
				if ("request" in reply) {
					child.send({
						id: pending.id,
						transfer: reply.request
					}, (error) => {
						if (error) retire(error);
					});
					return;
				}
				value = reply.rows;
			} else value = readSqliteReadOnlyWorkerValue({
				stdout: JSON.stringify(message.result),
				stderr
			}, pending.mode);
			const request = pending;
			pending = void 0;
			request.cleanup();
			request.resolve(value);
		} catch (error) {
			if (pending && host.retainOnOperationError && isSqliteSnapshotStagingMode(pending.mode) && isSqliteReadOnlyWorkerResult(message.result) && !message.result.ok) {
				const request = pending;
				pending = void 0;
				request.cleanup();
				request.reject(error);
				return;
			}
			retire(error);
		}
	});
	return {
		isRetired() {
			return retired;
		},
		get notStarted() {
			return child instanceof BrokerChild && child.notStarted;
		},
		createNativeReplacement() {
			return createSqliteReadOnlyWorkerSession({
				...host,
				env,
				cwd,
				argv,
				transport: { kind: "native" }
			});
		},
		compatible(launch) {
			return !retired && isSameSqliteReadOnlyWorkerLaunch(capturedLaunch, launch);
		},
		run(pathname, options) {
			if (retired) return Promise.reject(/* @__PURE__ */ new Error("SQLite read-only worker is closed"));
			return new Promise((resolve, reject) => {
				const { timeoutMs, size } = host.readBudget(pathname);
				stderr = "";
				outputBytes = 0;
				const abort = () => retire(options.signal?.reason);
				const timer = host.deadlineOwnedByCaller() ? void 0 : setTimeout(() => retire(host.timeoutError(pathname, timeoutMs, size)), timeoutMs);
				const id = ++sequence;
				pending = {
					id,
					mode: options.mode,
					...options.mode === "auth-profile-rows" ? { auth: createSqliteAuthTransferReceiver() } : {},
					resolve,
					reject,
					cleanup: () => {
						clearTimeout(timer);
						options.signal?.removeEventListener("abort", abort);
					}
				};
				options.signal?.addEventListener("abort", abort, { once: true });
				if (options.signal?.aborted) {
					abort();
					return;
				}
				const send = () => {
					if (retired) return;
					try {
						child.send({
							id,
							args: host.requestArgs(pathname, options),
							...options.mode === "auth-profile-rows" ? { auth: {
								expectedIdentity: options.expectedIdentity,
								coordinatorRuntime: options.coordinatorRuntime
							} } : {}
						}, (error) => {
							if (error) retire(error);
						});
					} catch (error) {
						retire(error);
					}
				};
				if (ready) ready.then(send);
				else send();
			});
		},
		async close() {
			if (retired) {
				await closed;
				return;
			}
			retired = true;
			const timer = setTimeout(() => retire(), host.closeTimeoutMs);
			try {
				child.send("close", (error) => {
					if (error) retire(error);
				});
			} catch (error) {
				retire(error);
			}
			try {
				await closed;
			} finally {
				clearTimeout(timer);
			}
		}
	};
}
//#endregion
//#region src/infra/sqlite-readonly-worker.ts
const SQLITE_INSPECTION_TIMEOUT_MS = 3e5;
const SQLITE_INSPECTION_BYTES_PER_SECOND = 33554432;
const log = createSubsystemLogger("state/sqlite");
function resolveSqliteInspectionBudget(operation, pathname, sizeBytes) {
	const timeoutMs = resolveTimerTimeoutMs(SQLITE_INSPECTION_TIMEOUT_MS + Math.ceil(40 * Number(sizeBytes ?? 0) / SQLITE_INSPECTION_BYTES_PER_SECOND) * 1e3, SQLITE_INSPECTION_TIMEOUT_MS);
	const size = sizeBytes === void 0 ? "unknown size" : formatByteSize(Number(sizeBytes), {
		style: "iec",
		maxUnit: "giga",
		separator: " ",
		fractionDigits: sizeBytes < 1024n ? 0 : 1
	});
	if (timeoutMs > SQLITE_INSPECTION_TIMEOUT_MS) log.debug(`SQLite ${operation} for ${pathname}: ${size}, budget ${timeoutMs / 1e3} seconds`);
	return {
		timeoutMs,
		size
	};
}
/** Sum serial SQLite inspection budgets without overflowing Node timers. */
function resolveAggregateSqliteInspectionTimeoutMs(operation, databases) {
	let timeoutMs = 0;
	for (const database of databases) timeoutMs += resolveSqliteInspectionBudget(operation, database.path, database.sizeBytes).timeoutMs;
	return resolveTimerTimeoutMs(timeoutMs, SQLITE_INSPECTION_TIMEOUT_MS, SQLITE_INSPECTION_TIMEOUT_MS);
}
function readSqliteInspectionBudget(operation, pathname, mainSizeBytes) {
	let sizeBytes = mainSizeBytes;
	try {
		sizeBytes ??= fs.statSync(pathname, { bigint: true }).size;
		for (const suffix of [
			"-wal",
			"-shm",
			"-journal"
		]) try {
			sizeBytes += fs.statSync(pathname + suffix, { bigint: true }).size;
		} catch (error) {
			if (!hasErrnoCode(error, "ENOENT")) throw error;
		}
	} catch {}
	return resolveSqliteInspectionBudget(operation, pathname, sizeBytes);
}
function sqliteInspectionTimeoutError(operation, pathname, timeoutMs, size) {
	return /* @__PURE__ */ new Error(`SQLite ${operation} timed out after ${timeoutMs / 1e3} seconds (budget for ${size}) for ${pathname}. Stop the Gateway service and other OpenClaw processes using this database, then retry; if already stopped, check storage performance.`);
}
const readOnlyWorkerScope = new AsyncLocalStorage();
/** Reuse child imports until the lifecycle owner closes; reads reacquire source admission. */
function createSqliteReadOnlyWorkerScope(options) {
	const scope = {
		active: true,
		busy: false,
		controller: new AbortController(),
		pending: /* @__PURE__ */ new Set(),
		deadlineOwnedByCaller: options?.deadlineOwnedByCaller ?? false,
		authTail: Promise.resolve()
	};
	const abort = () => scope.controller.abort(options?.signal.reason);
	options?.signal.addEventListener("abort", abort, { once: true });
	if (options?.signal.aborted) abort();
	let closing;
	return {
		run(operation) {
			return readOnlyWorkerScope.run(scope, operation);
		},
		close() {
			closing ??= (async () => {
				options?.signal.removeEventListener("abort", abort);
				scope.active = false;
				scope.controller.abort(/* @__PURE__ */ new Error("SQLite read-only worker scope closed"));
				await Promise.allSettled(scope.pending);
				const failures = (await Promise.allSettled([scope.worker?.close(), scope.authWorker?.session.close()])).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
				if (failures.length > 0) throw new AggregateError(failures, "SQLite read-only worker scope cleanup failed");
			})();
			return closing;
		}
	};
}
async function withSqliteReadOnlyWorkerScope(operation, options) {
	if (!options && readOnlyWorkerScope.getStore()?.active) return operation();
	const scope = createSqliteReadOnlyWorkerScope(options);
	try {
		return await scope.run(operation);
	} finally {
		await scope.close();
	}
}
/** A retained startup inspection is cancelled by its Gateway, not by its foreground wait. */
function isSqliteInspectionDeadlineOwnedByCaller() {
	return readOnlyWorkerScope.getStore()?.deadlineOwnedByCaller === true;
}
function resolveSqliteInspectionSignal(signal) {
	const scope = readOnlyWorkerScope.getStore();
	return scope ? signal ? AbortSignal.any([signal, scope.controller.signal]) : scope.controller.signal : signal;
}
function sqliteReadOnlyWorkerRequestArgs(pathname, options) {
	return [
		options.mode,
		path.resolve(pathname),
		...options.stagingRoot ? [options.stagingRoot] : []
	];
}
function sqliteReadOnlyWorkerArgv(pathname, options) {
	const workerUrl = resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sqliteReadOnly);
	return [
		...resolveRuntimeWorkerArgv(workerUrl),
		SQLITE_READONLY_CHILD_ARG,
		...sqliteReadOnlyWorkerRequestArgs(pathname, options)
	];
}
/** Capture launch facts before awaiting another session's retirement. */
function captureSqliteReadOnlyWorkerLaunch(env, source) {
	const broker = source === "canonical" ? getSpawnBroker() : void 0;
	return {
		env: { ...resolveNodeCompileCacheEnv(env) },
		cwd: process.cwd(),
		transport: broker ? {
			kind: "broker",
			owner: broker
		} : { kind: "native" }
	};
}
function createScopedSqliteReadOnlyWorker(launch) {
	const workerUrl = resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sqliteReadOnly);
	return createSqliteReadOnlyWorkerSession({
		...launch,
		argv: [
			...resolveRuntimeWorkerArgv(workerUrl),
			SQLITE_READONLY_CHILD_ARG,
			"session"
		],
		requestArgs: sqliteReadOnlyWorkerRequestArgs,
		readBudget: (pathname) => readSqliteInspectionBudget("read-only snapshot", pathname),
		deadlineOwnedByCaller: launch.retainLifetime === false ? () => false : isSqliteInspectionDeadlineOwnedByCaller,
		timeoutError: (pathname, timeoutMs, size) => sqliteInspectionTimeoutError("read-only snapshot", pathname, timeoutMs, size),
		closeTimeoutMs: SQLITE_INSPECTION_TIMEOUT_MS
	});
}
function runSqliteReadOnlyWorker(pathname, options) {
	if (options.mode === "reclaim") return readOnlyWorkerScope.exit(() => runSqliteReadOnlyWorkerOnce(pathname, options));
	const scope = readOnlyWorkerScope.getStore();
	if (!scope) return runSqliteReadOnlyWorkerOnce(pathname, options);
	if (!scope.active) return Promise.reject(/* @__PURE__ */ new Error("SQLite read-only worker scope closed"));
	const scopedOptions = {
		...options,
		signal: options.signal ? AbortSignal.any([options.signal, scope.controller.signal]) : scope.controller.signal
	};
	const useScopedWorker = options.mode === "sync" && !scope.busy;
	if (useScopedWorker) scope.busy = true;
	const authRequest = scopedOptions.mode === "auth-profile-rows" ? {
		options: scopedOptions,
		launch: captureSqliteReadOnlyWorkerLaunch(scopedOptions.env, scopedOptions.source)
	} : void 0;
	const operation = authRequest ? scope.authTail.then(() => runSqliteAuthProfileWorker(pathname, authRequest.options, authRequest.launch, scope)) : (async () => {
		if (!useScopedWorker) return runSqliteReadOnlyWorkerOnce(pathname, scopedOptions);
		try {
			const launch = captureSqliteReadOnlyWorkerLaunch();
			if (!scope.worker?.compatible(launch)) {
				await scope.worker?.close();
				scopedOptions.signal.throwIfAborted();
				scope.worker = createScopedSqliteReadOnlyWorker(launch);
			}
			return await scope.worker.run(pathname, scopedOptions);
		} finally {
			scope.busy = false;
		}
	})();
	if (scopedOptions.mode === "auth-profile-rows") scope.authTail = operation.then(() => {}, () => {});
	scope.pending.add(operation);
	operation.then(() => scope.pending.delete(operation), () => scope.pending.delete(operation));
	return operation;
}
async function runSqliteAuthProfileWorker(pathname, options, launch, scope) {
	options.signal?.throwIfAborted();
	if (scope?.authWorker && (scope.authWorker.source !== options.source || !isSameSqliteReadOnlyWorkerLaunch(scope.authWorker.launch, launch) || scope.authWorker.session.isRetired())) {
		await scope.authWorker.session.close();
		scope.authWorker = void 0;
		options.signal?.throwIfAborted();
	}
	let worker = scope?.authWorker?.session ?? createScopedSqliteReadOnlyWorker(launch);
	while (true) {
		if (scope) scope.authWorker = {
			source: options.source,
			launch,
			session: worker
		};
		let outcome;
		try {
			const value = await worker.run(pathname, options);
			options.signal?.throwIfAborted();
			outcome = { value };
		} catch (error) {
			outcome = { error };
		}
		let cleanupFailure;
		if (!scope || "error" in outcome) try {
			await worker.close();
			if (scope) scope.authWorker = void 0;
		} catch (error) {
			cleanupFailure = { error };
		}
		if (cleanupFailure) {
			if ("error" in outcome) throw new AggregateError([outcome.error, cleanupFailure.error], "Auth read and child cleanup failed", { cause: outcome.error });
			throw cleanupFailure.error;
		}
		if ("error" in outcome) {
			if (worker.notStarted && hasErrnoCode(outcome.error, "ERR_SPAWN_BROKER_UNAVAILABLE")) {
				options.signal?.throwIfAborted();
				worker = worker.createNativeReplacement();
				continue;
			}
			throw outcome.error;
		}
		options.signal?.throwIfAborted();
		return outcome.value;
	}
}
function runSqliteReadOnlyWorkerOnce(pathname, options) {
	if (options.mode === "auth-profile-rows") return runSqliteAuthProfileWorker(pathname, options, captureSqliteReadOnlyWorkerLaunch(options.env, options.source));
	return new Promise((resolve, reject) => {
		const { timeoutMs, size } = readSqliteInspectionBudget("read-only snapshot", pathname);
		let output = {
			stderr: "",
			stdout: ""
		};
		let stopped = false;
		let reclamationDeadline = false;
		const reclaim = options.mode === "reclaim";
		const child = execFile(process.execPath, sqliteReadOnlyWorkerArgv(pathname, options), {
			encoding: "utf8",
			env: resolveNodeCompileCacheEnv(),
			maxBuffer: SQLITE_READONLY_WORKER_MAX_BUFFER,
			timeout: reclaim || isSqliteInspectionDeadlineOwnedByCaller() ? void 0 : timeoutMs,
			killSignal: "SIGKILL"
		}, (error, stdout, stderr) => {
			output = {
				failure: error ? stopped ? "snapshot owner stopped" : error.killed && error.signal === "SIGKILL" && error.code == null ? sqliteInspectionTimeoutError("read-only snapshot", pathname, timeoutMs, size).message : `exited unsuccessfully: ${error.message}` : void 0,
				stderr,
				stdout
			};
		});
		const abort = () => {
			if (stopped) return;
			stopped = true;
			if (reclaim) child.stdin?.end();
			else child.kill("SIGKILL");
		};
		const timer = reclaim ? setTimeout(() => {
			reclamationDeadline = true;
			abort();
		}, timeoutMs) : void 0;
		retainSnapshotWork(new Promise((resolveClosed) => {
			child.once("close", () => resolveClosed());
		}), abort);
		options.signal?.addEventListener("abort", abort, { once: true });
		if (options.signal?.aborted) abort();
		child.once("close", () => {
			clearTimeout(timer);
			options.signal?.removeEventListener("abort", abort);
			try {
				if (options.mode === "reclaim") {
					const warnings = readSqliteReadOnlyWorkerValue(output, "reclaim");
					if (reclamationDeadline) warnings.push(sqliteInspectionTimeoutError("reclamation", pathname, timeoutMs, size).message);
					resolve(warnings);
					return;
				}
				options.signal?.throwIfAborted();
				resolve(readSqliteReadOnlyWorkerValue(output, options.mode));
			} catch (workerError) {
				reject(workerError instanceof Error ? workerError : new Error(String(workerError)));
			}
		});
	});
}
function runSqliteReadOnlyWorkerSync(pathname, stagingRoot) {
	const { timeoutMs, size } = readSqliteInspectionBudget("read-only snapshot", pathname);
	const result = spawnSync(process.execPath, sqliteReadOnlyWorkerArgv(pathname, {
		mode: "sync",
		stagingRoot
	}), {
		encoding: "utf8",
		env: resolveNodeCompileCacheEnv(),
		maxBuffer: SQLITE_READONLY_WORKER_MAX_BUFFER,
		timeout: timeoutMs,
		killSignal: "SIGKILL"
	});
	return readSqliteReadOnlyWorkerValue({
		failure: result.error ? hasErrnoCode(result.error, "ETIMEDOUT") ? sqliteInspectionTimeoutError("read-only snapshot", pathname, timeoutMs, size).message : `failed to start: ${result.error.message}` : result.status === 0 ? void 0 : `exited with ${result.signal ? `signal ${result.signal}` : `code ${result.status}`}`,
		stderr: result.stderr,
		stdout: result.stdout
	}, "sync");
}
//#endregion
export { readSqliteInspectionBudget as a, resolveSqliteInspectionSignal as c, sqliteInspectionTimeoutError as d, withSqliteReadOnlyWorkerScope as f, SqliteReadOnlyInspectionContentionError as g, createSqliteWorkerTransferReceiver as h, isSqliteInspectionDeadlineOwnedByCaller as i, runSqliteReadOnlyWorker as l, createSqliteWorkerTransferOwner as m, createScopedSqliteReadOnlyWorker as n, resolveAggregateSqliteInspectionTimeoutMs as o, isSameSqliteReadOnlyWorkerLaunch as p, createSqliteReadOnlyWorkerScope as r, resolveSqliteInspectionBudget as s, captureSqliteReadOnlyWorkerLaunch as t, runSqliteReadOnlyWorkerSync as u };
