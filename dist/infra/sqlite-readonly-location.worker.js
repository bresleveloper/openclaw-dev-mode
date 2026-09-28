import { createRequire } from "node:module";
import path, { posix } from "node:path";
import { setImmediate as setImmediate$1 } from "node:timers/promises";
import { deserialize, serialize } from "node:v8";
import fs, { chmodSync, existsSync, realpathSync, statSync, unlinkSync, writeFileSync, default as openClawRootFsSync } from "node:fs";
import { Logger } from "tslog";
import { createHash, hash, randomUUID } from "node:crypto";
import { AsyncLocalStorage, AsyncResource } from "node:async_hooks";
import os from "node:os";
import "@openclaw/fs-safe/config";
import fs$1 from "node:fs/promises";
import { appendRegularFile, appendRegularFileSync, canUseRootFileOpen, copyFileDescriptorSync, openRootFileSync, readFileWindowFullySync, readFileWindowFullySync as readFileWindowFullySync$1, resolvePathViaExistingAncestorSync, sameFileContentsSync, sameFileIdentity } from "@openclaw/fs-safe/advanced";
import "@openclaw/fs-safe/errors";
import "@openclaw/fs-safe/output";
import "@openclaw/fs-safe/root";
import { isPathInside, isPathInside as isPathInside$1, normalizeWindowsPathForComparison } from "@openclaw/fs-safe/path";
import "@openclaw/fs-safe/secret";
import "@openclaw/fs-safe/secure-file";
import "@openclaw/fs-safe/walk";
import { toUSVString } from "node:util";
import { channel } from "node:diagnostics_channel";
import { performance as performance$1 } from "node:perf_hooks";
import { getEnvironmentData, isMainThread, setEnvironmentData, threadId } from "node:worker_threads";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parse } from "semver";
import { Chalk } from "chalk";
import "@openclaw/fs-safe/copy";
import { spawn } from "node:child_process";
import { Socket } from "node:net";
import { readRootJsonObjectSync } from "@openclaw/fs-safe/json";
import { EventEmitter } from "node:events";
import "@openclaw/fs-safe/durability";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __esmMin = (fn, res, err) => () => {
	if (err) throw err[0];
	try {
		return fn && (res = fn(fn = 0)), res;
	} catch (e) {
		throw err = [e], e;
	}
};
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region packages/normalization-core/src/record-coerce.ts
/** Type guard for non-array object records at browser-safe boundaries. */
function isRecord(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
/** Returns a non-array record or null. */
function asNullableRecord(value) {
	return isRecord(value) ? value : null;
}
/** Returns any object-backed record, including arrays, or undefined. */
function asOptionalObjectRecord(value) {
	return value && typeof value === "object" ? value : void 0;
}
var init_record_coerce = __esmMin((() => {}));
//#endregion
//#region src/infra/runtime-process-entrypoints.ts
var currentModuleUrl, SQLITE_READONLY_CHILD_ARG, runtimeProcessEntrypoints;
var init_runtime_process_entrypoints = __esmMin((() => {
	currentModuleUrl = import.meta.url;
	SQLITE_READONLY_CHILD_ARG = "--openclaw-sqlite-readonly-child";
	runtimeProcessEntrypoints = {
		codeModeNode: {
			currentModuleUrl,
			sourceWorkerName: "../agents/code-mode-node.worker",
			distWorkerPath: "agents/code-mode-node.worker.js"
		},
		cronReadOnly: {
			currentModuleUrl,
			sourceWorkerName: "../cron/store/read-only.worker",
			distWorkerPath: "cron/store/read-only.worker.js"
		},
		stateRead: {
			currentModuleUrl,
			sourceWorkerName: "../state/openclaw-state-read.worker",
			distWorkerPath: "state/openclaw-state-read.worker.js"
		},
		spawnBroker: {
			currentModuleUrl,
			sourceWorkerName: "../process/spawn-broker/worker",
			distWorkerPath: "process/spawn-broker/worker.js"
		},
		cronStreamMatcher: {
			currentModuleUrl,
			sourceWorkerName: "../gateway/cron-stream-matcher.worker",
			distWorkerPath: "gateway/cron-stream-matcher.worker.js"
		},
		nativeHookRelayClient: {
			currentModuleUrl,
			sourceWorkerName: "../agents/harness/native-hook-relay-client.worker",
			distWorkerPath: "agents/harness/native-hook-relay-client.worker.js"
		},
		computerHost: {
			currentModuleUrl,
			sourceWorkerName: "../gateway/desktop/computer.worker",
			distWorkerPath: "gateway/desktop/computer.worker.js"
		},
		imageProcessor: {
			currentModuleUrl,
			sourceWorkerName: "../media/image-processor.worker",
			distWorkerPath: "media/image-processor.worker.js"
		},
		gitOperations: {
			currentModuleUrl,
			sourceWorkerName: "git-operation.worker",
			distWorkerPath: "infra/git-operation.worker.js"
		},
		fsSafeCopy: {
			currentModuleUrl,
			sourceWorkerName: "fs-safe-copy.worker",
			distWorkerPath: "infra/fs-safe-copy.worker.js"
		},
		sharedStateStore: {
			currentModuleUrl,
			sourceWorkerName: "../state/openclaw-state.worker",
			distWorkerPath: "state/openclaw-state.worker.js"
		},
		authProfileInlineUsage: {
			currentModuleUrl,
			sourceWorkerName: "../agents/auth-profiles/inline-usage.worker",
			distWorkerPath: "agents/auth-profiles/inline-usage.worker.js"
		},
		agentDatabaseExecution: {
			currentModuleUrl,
			sourceWorkerName: "../state/openclaw-agent-execution.worker",
			distWorkerPath: "state/openclaw-agent-execution.worker.js"
		},
		workspaceMemory: {
			currentModuleUrl,
			sourceWorkerName: "../worker/memory-worker-entry",
			distWorkerPath: "worker/memory-worker-entry.js"
		},
		workspaceSkills: {
			currentModuleUrl,
			sourceWorkerName: "../worker/skills-worker-entry",
			distWorkerPath: "worker/skills-worker-entry.js"
		},
		boardStore: {
			currentModuleUrl,
			sourceWorkerName: "../boards/sqlite-board-store.worker",
			distWorkerPath: "boards/sqlite-board-store.worker.js"
		},
		sessionSharingStore: {
			currentModuleUrl,
			sourceWorkerName: "../config/sessions/session-sharing-store.worker",
			distWorkerPath: "config/sessions/session-sharing-store.worker.js"
		},
		heartbeatOutcomeStore: {
			currentModuleUrl,
			sourceWorkerName: "heartbeat-outcome-store.worker",
			distWorkerPath: "infra/heartbeat-outcome-store.worker.js"
		},
		sqliteStore: {
			currentModuleUrl,
			sourceWorkerName: "sqlite-store.worker",
			distWorkerPath: "infra/sqlite-store.worker.js"
		},
		agentSchemaInspection: {
			currentModuleUrl,
			sourceWorkerName: "../state/openclaw-agent-schema-inspection.worker",
			distWorkerPath: "state/openclaw-agent-schema-inspection.worker.js"
		},
		stateMigrationSnapshot: {
			currentModuleUrl,
			sourceWorkerName: "state-migrations.snapshot.worker",
			distWorkerPath: "infra/state-migrations.snapshot.worker.js"
		},
		githubExec: {
			currentModuleUrl,
			sourceWorkerName: "../agents/github-exec-launcher",
			distWorkerPath: "agents/github-exec-launcher.js"
		},
		sqliteReadOnly: {
			currentModuleUrl,
			sourceWorkerName: "sqlite-readonly-location.worker",
			distWorkerPath: "infra/sqlite-readonly-location.worker.js"
		},
		sqliteIntegrity: {
			currentModuleUrl,
			sourceWorkerName: "sqlite-integrity.worker",
			distWorkerPath: "infra/sqlite-integrity.worker.js"
		},
		preparedModelCatalog: {
			currentModuleUrl,
			sourceWorkerName: "../agents/prepared-model-catalog.worker",
			distWorkerPath: "agents/prepared-model-catalog.worker.js"
		},
		updateRepair: {
			currentModuleUrl,
			sourceWorkerName: "update-repair.worker",
			distWorkerPath: "infra/update-repair.worker.js"
		},
		updateMigratedFinalize: {
			currentModuleUrl,
			sourceWorkerName: "update-migrated-finalize.worker",
			distWorkerPath: "infra/update-migrated-finalize.worker.js"
		},
		updateCandidateState: {
			currentModuleUrl,
			sourceWorkerName: "update-candidate-state.worker",
			distWorkerPath: "infra/update-candidate-state.worker.js"
		},
		doctorLint: {
			currentModuleUrl,
			sourceWorkerName: "../commands/doctor-lint.worker",
			distWorkerPath: "commands/doctor-lint.worker.js"
		},
		databaseVerify: {
			currentModuleUrl,
			sourceWorkerName: "../state/openclaw-database-verify.worker",
			distWorkerPath: "state/openclaw-database-verify.worker.js"
		},
		stateLeaseHeartbeat: {
			currentModuleUrl,
			sourceWorkerName: "../state/openclaw-state-lease-heartbeat.worker",
			distWorkerPath: "state/openclaw-state-lease-heartbeat.worker.js"
		},
		sessionTranscriptArchive: {
			currentModuleUrl,
			sourceWorkerName: "../config/sessions/session-accessor.sqlite-archive.worker",
			distWorkerPath: "config/sessions/session-accessor.sqlite-archive.worker.js"
		},
		sessionTranscript: {
			currentModuleUrl,
			sourceWorkerName: "../config/sessions/session-transcript.worker",
			distWorkerPath: "config/sessions/session-transcript.worker.js"
		},
		sessionManagerMetadata: {
			currentModuleUrl,
			sourceWorkerName: "../agents/sessions/session-manager-metadata.worker",
			distWorkerPath: "agents/sessions/session-manager-metadata.worker.js"
		},
		sessionTranscriptReconcile: {
			currentModuleUrl,
			sourceWorkerName: "../config/sessions/session-transcript-reconcile.worker",
			distWorkerPath: "config/sessions/session-transcript-reconcile.worker.js"
		},
		tailscaleRouteOwner: {
			currentModuleUrl,
			sourceWorkerName: "tailscale-route-owner.worker",
			distWorkerPath: "infra/tailscale-route-owner.worker.js"
		},
		serviceChildRelay: {
			currentModuleUrl,
			sourceWorkerName: "../process/supervisor/service-child-relay",
			distWorkerPath: "process/supervisor/service-child-relay.js"
		},
		terminalPty: {
			currentModuleUrl,
			sourceWorkerName: "../process/terminal-pty-worker",
			distWorkerPath: "process/terminal-pty-worker.js"
		},
		serviceChildGroupAnchor: {
			currentModuleUrl,
			sourceWorkerName: "../process/supervisor/service-child-group-anchor",
			distWorkerPath: "process/supervisor/service-child-group-anchor.js"
		},
		serviceChildWindowsJobAnchor: {
			currentModuleUrl,
			sourceWorkerName: "../process/supervisor/service-child-windows-job-anchor",
			distWorkerPath: "process/supervisor/service-child-windows-job-anchor.js"
		},
		bunSqliteLibrary: {
			currentModuleUrl,
			sourceWorkerName: "bun-sqlite-library",
			distWorkerPath: "infra/bun-sqlite-library.js"
		}
	};
}));
//#endregion
//#region packages/normalization-core/src/error-coercion.ts
function isErrorObject(value) {
	try {
		if (value instanceof Error) return true;
		return Object.prototype.toString.call(value) === "[object Error]";
	} catch {
		return false;
	}
}
function isAggregateErrorObject(error) {
	try {
		if (error instanceof AggregateError) return true;
		for (let proto = Object.getPrototypeOf(error); proto; proto = Object.getPrototypeOf(proto)) {
			const constructor = Object.getOwnPropertyDescriptor(proto, "constructor")?.value;
			if (typeof constructor === "function" && constructor.name === "AggregateError") return true;
		}
	} catch {}
	return false;
}
function readProperty(value, key) {
	try {
		return value[key];
	} catch {
		return;
	}
}
function readErrorText(value, key) {
	const field = readProperty(value, key);
	return typeof field === "string" ? field : void 0;
}
function formatStatusAndCode(value) {
	if ((typeof value !== "object" || value === null) && typeof value !== "function") return;
	try {
		if (Object.keys(value).some((key) => key !== "status" && key !== "code")) return;
	} catch {}
	const statusValue = readProperty(value, "status");
	const codeValue = readProperty(value, "code");
	if (statusValue === void 0 && codeValue === void 0) return;
	return `status=${typeof statusValue === "string" || typeof statusValue === "number" ? String(statusValue) : "unknown"} code=${typeof codeValue === "string" || typeof codeValue === "number" ? String(codeValue) : "unknown"}`;
}
function stringifyUnknown(value) {
	if (value === null) return "null";
	if (value === void 0) return "undefined";
	if (typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint" || typeof value === "symbol") return String(value);
	try {
		const json = JSON.stringify(value);
		if (json !== void 0) return json;
	} catch {}
	try {
		return Object.prototype.toString.call(value);
	} catch {
		return "Unknown error";
	}
}
function readErrorCauses(current) {
	if (!isErrorObject(current)) return [];
	const cause = readProperty(current, "cause");
	const errors = isAggregateErrorObject(current) ? readProperty(current, "errors") : void 0;
	const suppressed = readErrorText(current, "name") === "SuppressedError" ? [readProperty(current, "error"), readProperty(current, "suppressed")].map((failure) => failure == null ? String(failure) : failure) : [];
	return [
		cause || void 0,
		...Array.isArray(errors) ? errors : [],
		...suppressed
	];
}
/** Formats unknown errors with cause/aggregate details, structured codes, and secret redaction. */
function formatErrorMessage$1(value, options) {
	let formatted;
	if (isErrorObject(value)) {
		formatted = readErrorText(value, "message") || readErrorText(value, "name") || "Error";
		const seenMessages = /* @__PURE__ */ new Set([formatted]);
		const appendCauseMessage = (message) => {
			if (!message || seenMessages.has(message)) return;
			formatted += ` | ${message}`;
			seenMessages.add(message);
		};
		const appendCauseErrorMessage = (message) => {
			if (message && formatted.includes(message)) {
				seenMessages.add(message);
				return;
			}
			appendCauseMessage(message);
		};
		if (options.includeCode) {
			const code = readProperty(value, "code");
			if (typeof code === "string" || typeof code === "number") appendCauseMessage(String(code));
		}
		const causes = collectErrorGraphCandidates(value, readErrorCauses);
		for (const cause of causes.slice(1)) if (isErrorObject(cause)) {
			appendCauseErrorMessage(readErrorText(cause, "message"));
			const code = readProperty(cause, "code");
			if (typeof code === "string" || typeof code === "number") appendCauseMessage(String(code));
		} else if (typeof cause === "string") appendCauseMessage(cause);
		else appendCauseMessage(formatStatusAndCode(cause) ?? stringifyUnknown(cause));
	} else formatted = formatStatusAndCode(value) ?? stringifyUnknown(value);
	return options.redact(formatted);
}
/**
* Normalizes an unknown thrown value into an Error. Non-Error objects become
* the `cause` and have their enumerable fields copied so structured details
* (codes, statuses) survive the coercion.
*/
function toErrorObject(value, fallbackMessage) {
	if (value instanceof Error) return value;
	if (typeof value === "string") return new Error(value);
	const error = new Error(fallbackMessage, { cause: value });
	if (typeof value === "object" && value !== null || typeof value === "function") Object.assign(error, value);
	return error;
}
/** Reads Error messages unchanged and stringifies every other value. */
function coerceErrorMessage(value) {
	return value instanceof Error ? value.message : String(value);
}
function extractErrorCode(err) {
	if (!err || typeof err !== "object") return;
	const code = readProperty(err, "code");
	if (typeof code === "string") return code;
	if (typeof code === "number") return String(code);
}
function collectErrorGraphCandidates(err, resolveNested) {
	if (err == null) return [];
	const candidates = [err];
	const seen = (/* @__PURE__ */ new Set()).add(err);
	for (const current of candidates) {
		if (!current || typeof current !== "object" || !resolveNested) continue;
		for (const nested of resolveNested(current)) if (nested != null && !seen.has(nested)) {
			seen.add(nested);
			candidates.push(nested);
		}
	}
	return candidates;
}
var init_error_coercion = __esmMin((() => {}));
//#endregion
//#region src/shared/global-singleton.ts
function resolveGlobalSingletonResetRegistry() {
	const globalStore = globalThis;
	const existing = globalStore[GLOBAL_SINGLETON_RESETS_KEY];
	if (existing instanceof Map) return existing;
	const created = /* @__PURE__ */ new Map();
	globalStore[GLOBAL_SINGLETON_RESETS_KEY] = created;
	return created;
}
/** Resolves a process-local singleton for caches and registries that tolerate helper lookup. */
function resolveGlobalSingleton(key, create, reset, lifecycle = "close-and-restart") {
	const globalStore = globalThis;
	let value;
	if (Object.hasOwn(globalStore, key)) value = globalStore[key];
	else {
		value = create();
		globalStore[key] = value;
	}
	if (reset) resolveGlobalSingletonResetRegistry().set(key, {
		lifecycle,
		reset: () => reset(value)
	});
	return value;
}
/** Resolves a lifecycle-owned process-local Set singleton. */
function resolveGlobalSet(key, lifecycle) {
	return resolveGlobalSingleton(key, () => /* @__PURE__ */ new Set(), (value) => value.clear(), lifecycle);
}
var GLOBAL_SINGLETON_RESETS_KEY;
var init_global_singleton = __esmMin((() => {
	GLOBAL_SINGLETON_RESETS_KEY = Symbol.for("openclaw.globalSingletonLifecycleResets");
}));
//#endregion
//#region src/infra/sqlite-error-diagnostics.ts
function markSqliteNativeOpenFailure(error) {
	if (error !== null && typeof error === "object") nativeOpenFailures.add(error);
}
/** Record the native effect without changing its error or tagging surrounding authority checks. */
function withSqliteNativeOpen(open) {
	try {
		return open();
	} catch (error) {
		markSqliteNativeOpenFailure(error);
		throw error;
	}
}
function markSqliteInspectionOperation(error, operation) {
	if (error !== null && typeof error === "object" && !inspectionOperations.has(error)) inspectionOperations.set(error, operation);
	return error;
}
function withSqliteInspectionOperation(operation, run) {
	try {
		return run();
	} catch (error) {
		throw markSqliteInspectionOperation(error, operation);
	}
}
function formatSqliteReadOnlyInspectionFailure(error) {
	const message = coerceErrorMessage(error);
	const { suffix, operation } = readSqliteErrorDetails(error);
	const details = `${message}${suffix}`;
	return operation === void 0 ? details : `failed while ${SQLITE_INSPECTION_OPERATIONS[operation]}: ${details}`;
}
function formatSqliteErrorCodeSuffix(error) {
	return readSqliteErrorDetails(error).suffix;
}
function readSqliteErrorDetails(error) {
	const details = /* @__PURE__ */ new Set();
	let operation;
	for (let current = error, depth = 0; depth < 8 && isRecord(current); depth += 1) {
		operation = inspectionOperations.get(current) ?? operation;
		const code = extractErrorCode(current);
		if (code && /^[A-Z0-9_]{1,64}$/u.test(code)) details.add(`code=${code}`);
		const { errcode } = current;
		if (typeof errcode === "number" && Number.isInteger(errcode) && errcode >= 0 && errcode <= 2147483647) details.add(`errcode=${errcode}`);
		current = current.cause;
	}
	return {
		suffix: details.size > 0 ? ` (${[...details].join(", ")})` : "",
		operation
	};
}
function sqliteErrorCode(error) {
	const code = asOptionalObjectRecord(error)?.code;
	return typeof code === "string" ? code : void 0;
}
function sqliteExtendedResultCode(error) {
	const errcode = asOptionalObjectRecord(error)?.errcode;
	return typeof errcode === "number" && Number.isInteger(errcode) ? errcode : void 0;
}
function sqlitePrimaryResultCode(error) {
	const errcode = sqliteExtendedResultCode(error);
	return errcode === void 0 ? void 0 : errcode & SQLITE_PRIMARY_RESULT_CODE_MASK;
}
function isSqliteLockError(error) {
	const code = sqliteErrorCode(error);
	if (code !== void 0 && SQLITE_LOCK_ERROR_CODES.has(code)) return true;
	const primaryCode = sqlitePrimaryResultCode(error);
	return primaryCode === SQLITE_BUSY_RESULT_CODE || primaryCode === SQLITE_LOCKED_RESULT_CODE;
}
/** Report proven file damage (corrupt page or non-database header), not transient failure. */
function isSqliteCorruptionError(error) {
	const primaryCode = sqlitePrimaryResultCode(error);
	return primaryCode === SQLITE_CORRUPT_RESULT_CODE || primaryCode === SQLITE_NOTADB_RESULT_CODE;
}
var SQLITE_INSPECTION_OPERATIONS, inspectionOperations, nativeOpenFailures, SQLITE_LOCK_ERROR_CODES, SQLITE_BUSY_RESULT_CODE, SQLITE_LOCKED_RESULT_CODE, SQLITE_CORRUPT_RESULT_CODE, SQLITE_NOTADB_RESULT_CODE, SQLITE_PRIMARY_RESULT_CODE_MASK;
var init_sqlite_error_diagnostics = __esmMin((() => {
	init_error_coercion();
	init_record_coerce();
	init_global_singleton();
	SQLITE_INSPECTION_OPERATIONS = {
		coordinator: "acquiring its state-handles coordinator",
		source: "opening the source database",
		snapshot: "creating its private snapshot"
	};
	inspectionOperations = resolveGlobalSingleton(Symbol.for("openclaw.sqliteInspectionOperations"), () => /* @__PURE__ */ new WeakMap());
	nativeOpenFailures = resolveGlobalSingleton(Symbol.for("openclaw.sqliteNativeOpenFailures"), () => /* @__PURE__ */ new WeakSet());
	SQLITE_LOCK_ERROR_CODES = /* @__PURE__ */ new Set(["SQLITE_BUSY", "SQLITE_LOCKED"]);
	SQLITE_BUSY_RESULT_CODE = 5;
	SQLITE_LOCKED_RESULT_CODE = 6;
	SQLITE_CORRUPT_RESULT_CODE = 11;
	SQLITE_NOTADB_RESULT_CODE = 26;
	SQLITE_PRIMARY_RESULT_CODE_MASK = 255;
}));
//#endregion
//#region src/infra/sqlite-worker-transfer.ts
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
var SQLITE_WORKER_TRANSFER_FRAME_BYTES;
var init_sqlite_worker_transfer = __esmMin((() => {
	SQLITE_WORKER_TRANSFER_FRAME_BYTES = 8388608;
}));
//#endregion
//#region src/infra/sqlite-readonly-auth-transfer.ts
/** JSON IPC carries only one bounded byte frame; aggregate records retain the transfer contract. */
function encodeSqliteAuthTransferFrame(frame) {
	return frame.done ? frame : {
		...frame,
		bytes: Buffer.from(frame.bytes).toString("base64")
	};
}
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
var init_sqlite_readonly_auth_transfer = __esmMin((() => {
	init_record_coerce();
	init_sqlite_worker_transfer();
}));
//#endregion
//#region src/cli/signal-exit-barrier.ts
/** Temporary artifacts remain available until other shutdown owners have drained. */
function registerSignalExitFinalizer(finalizer) {
	activeFinalizers.add(finalizer);
}
var activeFinalizers;
var init_signal_exit_barrier = __esmMin((() => {
	init_global_singleton();
	resolveGlobalSet(Symbol.for("openclaw.signalExitBarriers"), "close-and-restart");
	resolveGlobalSet(Symbol.for("openclaw.signalExitGates"), "close-and-restart");
	activeFinalizers = resolveGlobalSet(Symbol.for("openclaw.signalExitFinalizers"), "close-and-restart");
}));
//#endregion
//#region packages/normalization-core/src/balanced-json.ts
var init_balanced_json = __esmMin((() => {}));
//#endregion
//#region packages/normalization-core/src/boolean-coercion.ts
var init_boolean_coercion = __esmMin((() => {})), WEIGHTED_CJK_RANGES;
var init_cjk_chars = __esmMin((() => {
	WEIGHTED_CJK_RANGES = [
		[
			[183, 183],
			[12288, 12703],
			[19968, 40869],
			[44032, 55215],
			[65281, 65376]
		],
		[
			[4352, 4607],
			[11904, 12287],
			[12704, 19967],
			[40870, 40959],
			[40960, 42239],
			[42752, 42759],
			[43360, 43391],
			[55216, 55295],
			[63744, 64255]
		],
		[
			[711, 711],
			[713, 715],
			[729, 729],
			[746, 747],
			[773, 773],
			[803, 803],
			[65040, 65103],
			[65377, 65500],
			[65504, 65510]
		],
		[[119648, 119665]],
		[
			[94176, 94207],
			[110576, 110591],
			[110592, 110959],
			[127488, 127743],
			[131072, 195103],
			[196608, 210047]
		]
	];
	new RegExp(`[${WEIGHTED_CJK_RANGES.flatMap((ranges) => ranges.map(([start, end]) => `\\u{${start.toString(16)}}-\\u{${end.toString(16)}}`)).join("")}]`, "u");
	(() => {
		const maxCodePoint = Math.max(...WEIGHTED_CJK_RANGES.flatMap((ranges) => ranges.map(([, end]) => end)));
		const categories = new Uint8Array(maxCodePoint + 1);
		for (const [bucket, ranges] of WEIGHTED_CJK_RANGES.entries()) for (const [start, end] of ranges) categories.fill(bucket + 1, start, end + 1);
		return categories;
	})();
}));
//#endregion
//#region packages/normalization-core/src/code-points.ts
var init_code_points = __esmMin((() => {}));
//#endregion
//#region packages/normalization-core/src/expect.ts
/** Returns the value or throws with the named context; use for genuine invariants only. */
function expectDefined(value, context) {
	if (value === null || value === void 0) throw new Error("expected " + context + " to be defined");
	return value;
}
var init_expect = __esmMin((() => {}));
//#endregion
//#region packages/normalization-core/src/format.ts
/** Formats a byte count with caller-explicit scale, labels, precision, and unit cap. */
function formatByteSize(bytes, options) {
	const { base, labels } = BYTE_SIZE_STYLES[options.style];
	const maxUnitIndex = BYTE_SIZE_UNITS.indexOf(options.maxUnit);
	let unitIndex = 0;
	let value = bytes;
	while (value >= base && unitIndex < maxUnitIndex) {
		value /= base;
		unitIndex += 1;
	}
	const unit = expectDefined(BYTE_SIZE_UNITS[unitIndex], "byte-size unit");
	const label = expectDefined(labels[unitIndex], "byte-size label");
	const fractionDigits = typeof options.fractionDigits === "function" ? options.fractionDigits(value, unit) : options.fractionDigits;
	if (fractionDigits === null) return `${value}${options.separator}${label}`;
	if (options.floorUnits?.includes(unit)) value = Math.floor(value * 10 ** fractionDigits) / 10 ** fractionDigits;
	return `${value.toFixed(fractionDigits)}${options.separator}${label}`;
}
var BYTE_SIZE_UNITS, BYTE_SIZE_STYLES;
var init_format = __esmMin((() => {
	init_expect();
	BYTE_SIZE_UNITS = [
		"byte",
		"kilo",
		"mega",
		"giga",
		"tera"
	];
	BYTE_SIZE_STYLES = {
		iec: {
			base: 1024,
			labels: [
				"B",
				"KiB",
				"MiB",
				"GiB",
				"TiB"
			]
		},
		"legacy-binary": {
			base: 1024,
			labels: [
				"B",
				"KB",
				"MB",
				"GB",
				"TB"
			]
		}
	};
}));
//#endregion
//#region packages/normalization-core/src/json-coercion.ts
var init_json_coercion = __esmMin((() => {}));
//#endregion
//#region packages/normalization-core/src/number-coercion.ts
/** Returns a number only when the input is already finite. */
function asFiniteNumber(value) {
	return Number.isFinite(value) ? value : void 0;
}
/** Resolves arbitrary timeout input with fallback and minimum timer bounds. */
function resolveTimerTimeoutMs(valueMs, fallbackMs, minMs = 1) {
	const value = asFiniteNumber(valueMs) ?? asFiniteNumber(fallbackMs);
	const min = Math.max(0, Math.floor(minMs));
	if (value === void 0) return min;
	return Math.min(Math.max(Math.floor(value), min), MAX_TIMER_TIMEOUT_MS$1);
}
var MAX_TIMER_TIMEOUT_MS$1;
var init_number_coercion = __esmMin((() => {
	MAX_TIMER_TIMEOUT_MS$1 = 2147e6;
	Math.floor(MAX_TIMER_TIMEOUT_MS$1 / 1e3);
}));
//#endregion
//#region packages/normalization-core/src/response-bytes.ts
var init_response_bytes = __esmMin((() => {}));
//#endregion
//#region packages/normalization-core/src/stable-stringify.ts
var init_stable_stringify = __esmMin((() => {}));
//#endregion
//#region packages/normalization-core/src/string-coerce.ts
/** Trims string input and returns null for non-strings or empty strings. */
function normalizeNullableString(value) {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	return trimmed ? trimmed : null;
}
/** Trims string input and returns undefined for non-strings or empty strings. */
function normalizeOptionalString(value) {
	return normalizeNullableString(value) ?? void 0;
}
/** Lowercases a normalized optional string. */
function normalizeOptionalLowercaseString(value) {
	return normalizeOptionalString(value)?.toLowerCase();
}
/** Lowercases a normalized string or returns an empty string when absent. */
function normalizeLowercaseStringOrEmpty(value) {
	return normalizeOptionalLowercaseString(value) ?? "";
}
var init_string_coerce = __esmMin((() => {}));
//#endregion
//#region packages/normalization-core/src/string-normalization.ts
var init_string_normalization = __esmMin((() => {}));
//#endregion
//#region packages/normalization-core/src/text-decoding.ts
var init_text_decoding = __esmMin((() => {}));
//#endregion
//#region packages/normalization-core/src/utf16-slice.ts
function isHighSurrogate(codeUnit) {
	return codeUnit >= 55296 && codeUnit <= 56319;
}
function isLowSurrogate(codeUnit) {
	return codeUnit >= 56320 && codeUnit <= 57343;
}
/** Slices a UTF-16 string without returning dangling surrogate halves at either edge. */
function sliceUtf16Safe(input, start, end) {
	const len = input.length;
	let from = start < 0 ? Math.max(len + start, 0) : Math.min(start, len);
	let to = end === void 0 ? len : end < 0 ? Math.max(len + end, 0) : Math.min(end, len);
	if (to <= from) return "";
	if (from > 0 && from < len) {
		if (isLowSurrogate(input.charCodeAt(from)) && isHighSurrogate(input.charCodeAt(from - 1))) from += 1;
	}
	if (to > 0 && to < len) {
		if (isHighSurrogate(input.charCodeAt(to - 1)) && isLowSurrogate(input.charCodeAt(to))) to -= 1;
	}
	return input.slice(from, to);
}
/** Truncates a UTF-16 string without cutting a surrogate pair in half. */
function truncateUtf16Safe(input, maxLen) {
	const limit = Math.max(0, Math.floor(maxLen));
	if (input.length <= limit) return input;
	return sliceUtf16Safe(input, 0, limit);
}
var init_utf16_slice = __esmMin((() => {}));
//#endregion
//#region packages/normalization-core/src/index.ts
var init_src$1 = __esmMin((() => {
	init_balanced_json();
	init_boolean_coercion();
	init_cjk_chars();
	init_code_points();
	init_error_coercion();
	init_expect();
	init_format();
	init_json_coercion();
	init_number_coercion();
	init_record_coerce();
	init_response_bytes();
	init_stable_stringify();
	init_string_coerce();
	init_string_normalization();
	init_text_decoding();
	init_utf16_slice();
}));
//#endregion
//#region src/infra/diagnostic-event-listener-presence.ts
function getDiagnosticEventListenerPresence() {
	const existing = globalThis[DIAGNOSTIC_EVENT_LISTENER_PRESENCE_KEY];
	if (existing && typeof existing === "object" && existing.marker === DIAGNOSTIC_EVENT_LISTENER_PRESENCE_KEY) {
		const state = existing;
		state.broadInterestCount ??= 0;
		state.eventInterestDeltas ??= /* @__PURE__ */ new Map();
		return state;
	}
	const state = {
		broadInterestCount: 0,
		eventInterestDeltas: /* @__PURE__ */ new Map(),
		marker: DIAGNOSTIC_EVENT_LISTENER_PRESENCE_KEY,
		internalCount: 0,
		trustedCount: 0
	};
	Object.defineProperty(globalThis, DIAGNOSTIC_EVENT_LISTENER_PRESENCE_KEY, {
		configurable: true,
		enumerable: false,
		value: state,
		writable: false
	});
	return state;
}
function isInternalDiagnosticEventInterested(interest, type, trusted) {
	return (!interest?.include || interest.include.includes(type)) && !interest?.exclude?.includes(type) && (!trusted || !interest?.includeTrusted || interest.includeTrusted.includes(type));
}
function hasInternalDiagnosticEventInterest(type) {
	const state = getDiagnosticEventListenerPresence();
	return state.broadInterestCount + (state.eventInterestDeltas.get(type) ?? 0) > 0;
}
var DIAGNOSTIC_EVENT_LISTENER_PRESENCE_KEY;
var init_diagnostic_event_listener_presence = __esmMin((() => {
	DIAGNOSTIC_EVENT_LISTENER_PRESENCE_KEY = Symbol.for("openclaw.diagnosticEventListenerPresence.v1");
}));
//#endregion
//#region src/infra/diagnostic-model-request-provenance.ts
var CORE_MODEL_REQUEST_LIFECYCLE_METADATA_KEY;
var init_diagnostic_model_request_provenance = __esmMin((() => {
	CORE_MODEL_REQUEST_LIFECYCLE_METADATA_KEY = "coreModelRequestLifecycle";
}));
//#endregion
//#region src/infra/diagnostic-otel-listener-provenance.ts
function isTrustedOtelDiagnosticListener(listener) {
	return trustedOtelDiagnosticListeners.has(listener);
}
var trustedOtelDiagnosticListeners;
var init_diagnostic_otel_listener_provenance = __esmMin((() => {
	trustedOtelDiagnosticListeners = /* @__PURE__ */ new WeakSet();
}));
//#endregion
//#region src/infra/diagnostic-semantic-run-progress-provenance.ts
var CORE_SEMANTIC_RUN_PROGRESS_METADATA_KEY;
var init_diagnostic_semantic_run_progress_provenance = __esmMin((() => {
	CORE_SEMANTIC_RUN_PROGRESS_METADATA_KEY = "coreSemanticRunProgress";
})), TOOL_EXECUTION_LIVENESS_METADATA_KEY;
var init_diagnostic_tool_execution_liveness = __esmMin((() => {
	init_global_singleton();
	TOOL_EXECUTION_LIVENESS_METADATA_KEY = "toolExecutionLiveness";
	resolveGlobalSingleton(Symbol.for("openclaw.diagnosticToolExecutionLiveness"), () => ({
		context: new AsyncLocalStorage(),
		events: /* @__PURE__ */ new WeakMap()
	}));
}));
//#endregion
//#region src/infra/diagnostic-trace-context.ts
function isNonZeroHex(value) {
	return !/^0+$/.test(value);
}
function createDiagnosticTraceScopeState() {
	return {
		marker: DIAGNOSTIC_TRACE_SCOPE_STATE_KEY,
		storage: new AsyncLocalStorage()
	};
}
function isDiagnosticTraceScopeState(value) {
	if (!value || typeof value !== "object") return false;
	const candidate = value;
	return candidate.marker === DIAGNOSTIC_TRACE_SCOPE_STATE_KEY && candidate.storage instanceof AsyncLocalStorage;
}
function getDiagnosticTraceScopeState() {
	const existing = globalThis[DIAGNOSTIC_TRACE_SCOPE_STATE_KEY];
	if (isDiagnosticTraceScopeState(existing)) return existing;
	const state = createDiagnosticTraceScopeState();
	Object.defineProperty(globalThis, DIAGNOSTIC_TRACE_SCOPE_STATE_KEY, {
		configurable: true,
		enumerable: false,
		value: state,
		writable: false
	});
	return state;
}
/** Returns whether a value is a non-zero W3C trace id. */
function isValidDiagnosticTraceId(value) {
	return typeof value === "string" && TRACE_ID_RE.test(value) && isNonZeroHex(value);
}
/** Returns whether a value is a non-zero W3C span id. */
function isValidDiagnosticSpanId(value) {
	return typeof value === "string" && SPAN_ID_RE.test(value) && isNonZeroHex(value);
}
/** Returns whether a value is a valid W3C trace-flags byte. */
function isValidDiagnosticTraceFlags(value) {
	return typeof value === "string" && TRACE_FLAGS_RE.test(value);
}
/** Returns the trace context bound to the current async scope. */
function getActiveDiagnosticTraceContext() {
	return getDiagnosticTraceScopeState().storage.getStore();
}
var TRACE_ID_RE, SPAN_ID_RE, TRACE_FLAGS_RE, DIAGNOSTIC_TRACE_SCOPE_STATE_KEY;
var init_diagnostic_trace_context = __esmMin((() => {
	init_src$1();
	TRACE_ID_RE = /^[0-9a-f]{32}$/;
	SPAN_ID_RE = /^[0-9a-f]{16}$/;
	TRACE_FLAGS_RE = /^[0-9a-f]{2}$/;
	DIAGNOSTIC_TRACE_SCOPE_STATE_KEY = Symbol.for("openclaw.diagnosticTraceScope.state.v1");
}));
//#endregion
//#region src/infra/diagnostic-trace-propagation.ts
function createDiagnosticTracePropagationState() {
	return {
		marker: DIAGNOSTIC_TRACE_PROPAGATION_STATE_KEY,
		bridges: /* @__PURE__ */ new Set()
	};
}
function isDiagnosticTracePropagationState(value) {
	if (!value || typeof value !== "object") return false;
	const candidate = value;
	return candidate.marker === DIAGNOSTIC_TRACE_PROPAGATION_STATE_KEY && candidate.bridges instanceof Set;
}
function getDiagnosticTracePropagationState() {
	const existing = globalThis[DIAGNOSTIC_TRACE_PROPAGATION_STATE_KEY];
	if (isDiagnosticTracePropagationState(existing)) return existing;
	const state = createDiagnosticTracePropagationState();
	Object.defineProperty(globalThis, DIAGNOSTIC_TRACE_PROPAGATION_STATE_KEY, {
		configurable: true,
		enumerable: false,
		value: state,
		writable: false
	});
	return state;
}
function activeDiagnosticTracePropagationBridge() {
	let active;
	for (const bridge of getDiagnosticTracePropagationState().bridges) active = bridge;
	return active;
}
function shouldPrepareDiagnosticTracePropagation(event) {
	const bridge = activeDiagnosticTracePropagationBridge();
	if (!bridge?.prepareEvent) return false;
	if (!bridge.shouldPrepareEvent) return true;
	try {
		return bridge.shouldPrepareEvent(event);
	} catch (error) {
		console.error(`[diagnostic-trace-propagation] prepare filter error: ${String(error)}`);
		return false;
	}
}
function prepareDiagnosticTracePropagation(event, metadata) {
	const bridge = activeDiagnosticTracePropagationBridge();
	if (!bridge?.prepareEvent) return;
	try {
		bridge.prepareEvent(event, metadata);
	} catch (error) {
		console.error(`[diagnostic-trace-propagation] prepare error type=${event.type} seq=${event.seq}: ${String(error)}`);
	}
}
var DIAGNOSTIC_TRACE_PROPAGATION_STATE_KEY;
var init_diagnostic_trace_propagation = __esmMin((() => {
	init_diagnostic_trace_context();
	DIAGNOSTIC_TRACE_PROPAGATION_STATE_KEY = Symbol.for("openclaw.diagnosticTracePropagation.state.v1");
}));
//#endregion
//#region src/infra/prototype-keys.ts
/** Return true when assigning `key` could mutate an object prototype. */
function isBlockedObjectKey(key) {
	return BLOCKED_OBJECT_KEYS.has(key);
}
var BLOCKED_OBJECT_KEYS;
var init_prototype_keys = __esmMin((() => {
	BLOCKED_OBJECT_KEYS = /* @__PURE__ */ new Set([
		"__proto__",
		"prototype",
		"constructor"
	]);
}));
//#endregion
//#region src/infra/diagnostic-events.ts
function createDiagnosticEventsState() {
	return {
		marker: DIAGNOSTIC_EVENTS_STATE_KEY,
		enabled: true,
		seq: 0,
		listeners: /* @__PURE__ */ new Map(),
		trustedListeners: /* @__PURE__ */ new Map(),
		toolExecutionListeners: /* @__PURE__ */ new Set(),
		toolExecutionSeq: 0,
		dispatchDepth: 0,
		asyncQueue: [],
		asyncDrainScheduled: false,
		asyncDroppedEvents: 0,
		asyncDroppedTrustedEvents: 0,
		asyncDroppedUntrustedEvents: 0,
		asyncDroppedPriorityEvents: 0
	};
}
function isDiagnosticEventsState(value) {
	if (!value || typeof value !== "object") return false;
	const candidate = value;
	return candidate.marker === DIAGNOSTIC_EVENTS_STATE_KEY && typeof candidate.enabled === "boolean" && typeof candidate.seq === "number" && candidate.listeners instanceof Map && candidate.trustedListeners instanceof Map && (candidate.toolExecutionListeners === void 0 || candidate.toolExecutionListeners instanceof Set) && typeof candidate.dispatchDepth === "number" && Array.isArray(candidate.asyncQueue) && typeof candidate.asyncDrainScheduled === "boolean";
}
function getDiagnosticEventsState() {
	const existing = globalThis[DIAGNOSTIC_EVENTS_STATE_KEY];
	if (isDiagnosticEventsState(existing)) {
		existing.asyncDroppedEvents ??= 0;
		existing.asyncDroppedTrustedEvents ??= 0;
		existing.asyncDroppedUntrustedEvents ??= 0;
		existing.asyncDroppedPriorityEvents ??= 0;
		existing.toolExecutionListeners ??= /* @__PURE__ */ new Set();
		existing.toolExecutionSeq ??= 0;
		return existing;
	}
	const state = createDiagnosticEventsState();
	Object.defineProperty(globalThis, DIAGNOSTIC_EVENTS_STATE_KEY, {
		configurable: true,
		enumerable: false,
		value: state,
		writable: false
	});
	return state;
}
/** Returns the current process-wide diagnostic dispatcher enable flag. */
function areDiagnosticsEnabledForProcess() {
	return getDiagnosticEventsState().enabled;
}
function dispatchDiagnosticEvent(state, enriched, metadata, privateData, options = {}) {
	if (state.dispatchDepth > 100) {
		console.error(`[diagnostic-events] recursion guard tripped at depth=${state.dispatchDepth}, dropping type=${enriched.type}`);
		return;
	}
	state.dispatchDepth += 1;
	try {
		if (!options.trustedListenersOnly) for (const [listener, interest] of state.listeners) {
			if (!isInternalDiagnosticEventInterested(interest, enriched.type, metadata.trusted)) continue;
			try {
				listener(cloneDiagnosticEventForListener(enriched), createDiagnosticMetadataForListener(metadata));
			} catch (err) {
				const errorMessage = err instanceof Error ? err.stack ?? err.message : typeof err === "string" ? err : String(err);
				console.error(`[diagnostic-events] listener error type=${enriched.type} seq=${enriched.seq}: ${errorMessage}`);
			}
		}
		for (const [listener, interest] of state.trustedListeners) {
			if (!isInternalDiagnosticEventInterested(interest, enriched.type, metadata.trusted)) continue;
			try {
				const eventForListener = cloneDiagnosticEventForListener(enriched);
				const metadataForListener = createDiagnosticMetadataForListener(metadata);
				if (interest?.includePrivateData === false) listener(eventForListener, metadataForListener, EMPTY_DIAGNOSTIC_PRIVATE_DATA);
				else if (isTrustedOtelDiagnosticListener(listener)) listener(eventForListener, metadataForListener, cloneDiagnosticPrivateDataForOtelListener(privateData, options.hostPluginId));
				else listener(eventForListener, metadataForListener, cloneDiagnosticPrivateDataForListener(privateData));
			} catch (err) {
				const errorMessage = err instanceof Error ? err.stack ?? err.message : typeof err === "string" ? err : String(err);
				console.error(`[diagnostic-events] trusted listener error type=${enriched.type} seq=${enriched.seq}: ${errorMessage}`);
			}
		}
	} finally {
		state.dispatchDepth -= 1;
	}
}
function createDiagnosticMetadataForListener(metadata) {
	return Object.freeze({ ...metadata });
}
function cloneDiagnosticEventForListener(event) {
	return deepFreezeDiagnosticValue(structuredClone(event));
}
function cloneDiagnosticPrivateDataForListener(privateData) {
	if (!privateData) return Object.freeze({});
	return deepFreezeDiagnosticValue(structuredClone(privateData));
}
function cloneDiagnosticPrivateDataForOtelListener(privateData, hostPluginId) {
	const cloned = structuredClone(privateData ?? {});
	delete cloned.hostPluginId;
	if (hostPluginId) cloned.hostPluginId = hostPluginId;
	return deepFreezeDiagnosticValue(cloned);
}
function isPriorityAsyncDiagnosticEvent(entry) {
	return entry.metadata.trusted && PRIORITY_ASYNC_DIAGNOSTIC_EVENT_TYPES.has(entry.event.type);
}
function noteAsyncDiagnosticDrop(state, entry) {
	state.asyncDroppedEvents += 1;
	if (entry.metadata.trusted) state.asyncDroppedTrustedEvents += 1;
	else state.asyncDroppedUntrustedEvents += 1;
	if (isPriorityAsyncDiagnosticEvent(entry)) state.asyncDroppedPriorityEvents += 1;
}
function makeRoomForPriorityAsyncDiagnosticEvent(state) {
	const nonPriorityIndex = state.asyncQueue.findIndex((entry) => !isPriorityAsyncDiagnosticEvent(entry));
	if (nonPriorityIndex >= 0) return state.asyncQueue.splice(nonPriorityIndex, 1)[0];
	return state.asyncQueue.shift();
}
function deepFreezeDiagnosticValue(value, seen = /* @__PURE__ */ new WeakSet()) {
	if (!value || typeof value !== "object") return value;
	if (seen.has(value)) return value;
	seen.add(value);
	if (Array.isArray(value)) {
		for (const item of value) deepFreezeDiagnosticValue(item, seen);
		return Object.freeze(value);
	}
	for (const nested of Object.values(value)) deepFreezeDiagnosticValue(nested, seen);
	return Object.freeze(value);
}
function scheduleAsyncDiagnosticDrain(state) {
	if (state.asyncDrainScheduled) return;
	state.asyncDrainScheduled = true;
	setImmediate(() => {
		state.asyncDrainScheduled = false;
		const batch = state.asyncQueue.splice(0, MAX_ASYNC_DIAGNOSTIC_EVENTS_PER_TURN);
		for (const entry of batch) dispatchDiagnosticEvent(state, entry.event, entry.metadata, entry.privateData, {
			hostPluginId: entry.hostPluginId,
			trustedListenersOnly: entry.trustedListenersOnly
		});
		if (state.asyncQueue.length > 0) {
			scheduleAsyncDiagnosticDrain(state);
			return;
		}
		dispatchAsyncDiagnosticDropSummary(state);
	});
}
function dispatchAsyncDiagnosticDropSummary(state) {
	if (state.asyncDroppedEvents <= 0) return;
	const droppedEvents = state.asyncDroppedEvents;
	const droppedTrustedEvents = state.asyncDroppedTrustedEvents;
	const droppedUntrustedEvents = state.asyncDroppedUntrustedEvents;
	const droppedPriorityEvents = state.asyncDroppedPriorityEvents;
	state.asyncDroppedEvents = 0;
	state.asyncDroppedTrustedEvents = 0;
	state.asyncDroppedUntrustedEvents = 0;
	state.asyncDroppedPriorityEvents = 0;
	dispatchDiagnosticEvent(state, enrichDiagnosticEvent(state, {
		type: "diagnostic.async_queue.dropped",
		droppedEvents,
		...droppedTrustedEvents > 0 ? { droppedTrustedEvents } : {},
		...droppedUntrustedEvents > 0 ? { droppedUntrustedEvents } : {},
		...droppedPriorityEvents > 0 ? { droppedPriorityEvents } : {},
		queueLength: state.asyncQueue.length,
		maxQueueLength: MAX_ASYNC_DIAGNOSTIC_EVENTS,
		drainBatchSize: MAX_ASYNC_DIAGNOSTIC_EVENTS_PER_TURN
	}), createInternalDiagnosticMetadata(false));
}
function enrichDiagnosticEvent(state, event) {
	const enriched = {};
	for (const [key, value] of Object.entries(event)) {
		if (isBlockedObjectKey(key)) continue;
		enriched[key] = value;
	}
	enriched.trace ??= getActiveDiagnosticTraceContext();
	state.seq += 1;
	enriched.seq = state.seq;
	enriched.ts = Date.now();
	return enriched;
}
function createInternalDiagnosticMetadata(trusted) {
	return {
		internal: true,
		trusted
	};
}
function emitDiagnosticEventWithTrust(event, trusted, options = {}) {
	const state = getDiagnosticEventsState();
	if (trusted && isToolExecutionEventInput(event)) dispatchTrustedToolExecutionEvent(state, event);
	if (!state.enabled) return;
	if (event.type === "security.event" && options.allowSecurityEvent !== true) return;
	const enriched = enrichDiagnosticEvent(state, event);
	const { hostPluginId, internal = false, privateData } = options;
	const trustedTraceContext = options.trustedTraceContext === true;
	const metadata = {
		...internal ? createInternalDiagnosticMetadata(trusted) : { trusted },
		...options.toolExecutionLiveness ? { [TOOL_EXECUTION_LIVENESS_METADATA_KEY]: options.toolExecutionLiveness } : {},
		...options.coreModelRequestLifecycle ? { [CORE_MODEL_REQUEST_LIFECYCLE_METADATA_KEY]: options.coreModelRequestLifecycle } : {},
		...options.coreSemanticRunProgress === true ? { [CORE_SEMANTIC_RUN_PROGRESS_METADATA_KEY]: true } : {},
		...trustedTraceContext ? { trustedTraceContext } : {}
	};
	const prepareTracePropagation = trusted && shouldPrepareDiagnosticTracePropagation(enriched);
	if (ASYNC_DIAGNOSTIC_EVENT_TYPES.has(enriched.type)) {
		if (state.asyncQueue.length >= MAX_ASYNC_DIAGNOSTIC_EVENTS) {
			if (!trusted || !PRIORITY_ASYNC_DIAGNOSTIC_EVENT_TYPES.has(enriched.type)) {
				noteAsyncDiagnosticDrop(state, {
					event: enriched,
					metadata,
					privateData,
					hostPluginId
				});
				return;
			}
			const droppedEntry = makeRoomForPriorityAsyncDiagnosticEvent(state);
			if (droppedEntry) noteAsyncDiagnosticDrop(state, droppedEntry);
		}
		state.asyncQueue.push({
			event: enriched,
			metadata,
			privateData,
			hostPluginId
		});
		if (prepareTracePropagation) prepareDiagnosticTracePropagation(cloneDiagnosticEventForListener(enriched), createDiagnosticMetadataForListener(metadata));
		scheduleAsyncDiagnosticDrain(state);
		return;
	}
	if (prepareTracePropagation) prepareDiagnosticTracePropagation(cloneDiagnosticEventForListener(enriched), createDiagnosticMetadataForListener(metadata));
	dispatchDiagnosticEvent(state, enriched, metadata, privateData, { hostPluginId });
}
function isToolExecutionEventInput(event) {
	return event.type === "tool.execution.started" || event.type === "tool.execution.completed" || event.type === "tool.execution.error" || event.type === "tool.execution.blocked";
}
function dispatchTrustedToolExecutionEvent(state, event) {
	state.toolExecutionSeq += 1;
	let enriched;
	try {
		enriched = deepFreezeDiagnosticValue(structuredClone({
			...event,
			seq: state.toolExecutionSeq,
			ts: Date.now()
		}));
	} catch (error) {
		console.error(`[diagnostic-events] tool execution clone error type=${event.type}: ${String(error)}`);
		return;
	}
	for (const listener of state.toolExecutionListeners) try {
		listener(enriched);
	} catch (error) {
		console.error(`[diagnostic-events] tool execution listener error type=${enriched.type} seq=${enriched.seq}: ${String(error)}`);
	}
}
/** Emits an untrusted diagnostic event from external/plugin-facing code. */
function emitDiagnosticEvent(event) {
	emitDiagnosticEventWithTrust(event, false);
}
/** Emits an untrusted event whose trace context came from OpenClaw-owned scope. */
function emitDiagnosticEventWithTrustedTraceContext(event) {
	emitDiagnosticEventWithTrust(event, false, { trustedTraceContext: true });
}
var EMPTY_DIAGNOSTIC_PRIVATE_DATA, MAX_ASYNC_DIAGNOSTIC_EVENTS, MAX_ASYNC_DIAGNOSTIC_EVENTS_PER_TURN, DIAGNOSTIC_EVENTS_STATE_KEY, ASYNC_DIAGNOSTIC_EVENT_TYPES, PRIORITY_ASYNC_DIAGNOSTIC_EVENT_TYPES;
var init_diagnostic_events = __esmMin((() => {
	init_diagnostic_event_listener_presence();
	init_diagnostic_model_request_provenance();
	init_diagnostic_otel_listener_provenance();
	init_diagnostic_semantic_run_progress_provenance();
	init_diagnostic_tool_execution_liveness();
	init_diagnostic_trace_context();
	init_diagnostic_trace_propagation();
	init_prototype_keys();
	EMPTY_DIAGNOSTIC_PRIVATE_DATA = Object.freeze({});
	MAX_ASYNC_DIAGNOSTIC_EVENTS = 1e4;
	MAX_ASYNC_DIAGNOSTIC_EVENTS_PER_TURN = 100;
	DIAGNOSTIC_EVENTS_STATE_KEY = Symbol.for("openclaw.diagnosticEvents.state.v1");
	ASYNC_DIAGNOSTIC_EVENT_TYPES = /* @__PURE__ */ new Set([
		"diagnostic.gc",
		"gateway.event_loop.sample",
		"gateway.rpc",
		"tool.execution.started",
		"tool.execution.completed",
		"tool.execution.error",
		"tool.execution.blocked",
		"skill.used",
		"exec.process.completed",
		"exec.approval.followup_suppressed",
		"message.delivery.started",
		"message.delivery.completed",
		"message.delivery.error",
		"talk.event",
		"model.call.started",
		"model.call.completed",
		"model.call.error",
		"run.progress",
		"run.execution_phase",
		"harness.run.completed",
		"harness.run.error",
		"context.assembled",
		"log.record"
	]);
	PRIORITY_ASYNC_DIAGNOSTIC_EVENT_TYPES = /* @__PURE__ */ new Set([
		"tool.execution.completed",
		"tool.execution.error",
		"tool.execution.blocked",
		"model.call.completed",
		"model.call.error",
		"harness.run.completed",
		"harness.run.error"
	]);
}));
//#endregion
//#region packages/normalization-core/src/home-dir.ts
function normalizeHomeDirValue(value) {
	const trimmed = value?.trim();
	return trimmed && trimmed !== "undefined" && trimmed !== "null" ? trimmed : void 0;
}
function normalizeSafe(homedir) {
	try {
		return normalizeHomeDirValue(homedir());
	} catch {
		return;
	}
}
function resolveTermuxHome(env) {
	const prefix = normalizeHomeDirValue(env.PREFIX);
	if (!prefix || !normalizeHomeDirValue(env.ANDROID_DATA)) return;
	if (!/(?:^|\/)com\.termux\/files\/usr\/?$/u.test(prefix.replace(/\\/gu, "/"))) return;
	return path.resolve(prefix, "..", "home");
}
function resolveRawOsHomeDir(env, homedir) {
	return normalizeHomeDirValue(env.HOME) ?? normalizeHomeDirValue(env.USERPROFILE) ?? resolveTermuxHome(env) ?? normalizeSafe(homedir);
}
function resolveOsHomeDir(env = process.env, homedir = os.homedir) {
	const raw = resolveRawOsHomeDir(env, homedir);
	return raw ? path.resolve(raw) : void 0;
}
function resolveEffectiveHomeDir(env = process.env, homedir = os.homedir, options) {
	const explicitHome = normalizeHomeDirValue(env.OPENCLAW_HOME);
	if (!explicitHome) return resolveOsHomeDir(env, homedir);
	if (explicitHome === "~" || explicitHome.startsWith("~/") || explicitHome.startsWith("~\\")) {
		const osHome = resolveRawOsHomeDir(env, homedir);
		if (!osHome) return options?.preserveUnresolvedTilde ? path.resolve(explicitHome) : void 0;
		return path.resolve(explicitHome.replace(/^~(?=$|[\\/])/, () => osHome));
	}
	return path.resolve(explicitHome);
}
var init_home_dir$1 = __esmMin((() => {}));
//#endregion
//#region src/infra/safe-cwd.ts
function tryProcessCwd() {
	try {
		return process.cwd();
	} catch {
		return;
	}
}
var init_safe_cwd = __esmMin((() => {}));
//#endregion
//#region src/infra/home-dir.ts
/** Resolves the effective home or falls back to cwd when no home source exists. */
function resolveRequiredHomeDir(env = process.env, homedir = os.homedir) {
	const resolved = resolveEffectiveHomeDir(env, homedir) ?? tryProcessCwd();
	if (resolved) return path.resolve(resolved);
	throw new Error("Unable to resolve an OpenClaw home: set OPENCLAW_HOME, HOME, or USERPROFILE, or run from an existing directory.");
}
/** Resolves the OS home or falls back to cwd when no OS home source exists. */
function resolveRequiredOsHomeDir(env = process.env, homedir = os.homedir) {
	const resolved = resolveOsHomeDir(env, homedir) ?? tryProcessCwd();
	if (resolved) return path.resolve(resolved);
	throw new Error("Unable to resolve an OS home: set HOME or USERPROFILE, or run from an existing directory.");
}
/** Expands leading `~`, `~/`, or `~\` with the effective home when one is known. */
function expandHomePrefix(input, opts) {
	if (!input.startsWith("~")) return input;
	const home = normalizeHomeDirValue(opts?.home) ?? resolveEffectiveHomeDir(opts?.env ?? process.env, opts?.homedir ?? os.homedir);
	if (!home) return input;
	return input.replace(/^~(?=$|[\\/])/, () => home);
}
/** Resolves a user-supplied path after trimming and expanding against the effective home. */
function resolveHomeRelativePath(input, opts) {
	const trimmed = input.trim();
	if (!trimmed) return trimmed;
	if (trimmed.startsWith("~")) {
		const expanded = expandHomePrefix(trimmed, {
			home: resolveRequiredHomeDir(opts?.env ?? process.env, opts?.homedir ?? os.homedir),
			env: opts?.env,
			homedir: opts?.homedir
		});
		return path.resolve(expanded);
	}
	return path.resolve(trimmed);
}
/** Resolves a user path against the effective home, preserving an empty input. */
function resolveUserPath$1(input, env = process.env, homedir = os.homedir) {
	if (!input) return "";
	return resolveHomeRelativePath(input, {
		env,
		homedir
	});
}
var init_home_dir = __esmMin((() => {
	init_home_dir$1();
	init_safe_cwd();
}));
//#endregion
//#region src/infra/sealed-runtime-registry.ts
function getSealedRuntimeJson5() {
	return runtime?.json5;
}
function getSealedRuntimeSecureTempRoot() {
	return runtime?.resolveSecureTempRoot;
}
var runtime;
var init_sealed_runtime_registry = __esmMin((() => {}));
//#endregion
//#region src/infra/tmp-openclaw-dir.ts
function loadResolveSecureTempRoot() {
	if (resolveSecureTempRootRuntime) return resolveSecureTempRootRuntime;
	const injected = getSealedRuntimeSecureTempRoot();
	if (injected) {
		resolveSecureTempRootRuntime = injected;
		return injected;
	}
	if (typeof SEALED_RUNTIME_BUILD === "boolean" && SEALED_RUNTIME_BUILD) throw new Error("sealed temp-root runtime was not registered before use");
	const getBuiltinModule = process.getBuiltinModule;
	if (typeof getBuiltinModule !== "function") throw new Error("Node module loading is unavailable for secure temp-root resolution");
	const moduleNamespace = getBuiltinModule("module");
	if (typeof moduleNamespace.createRequire !== "function") throw new Error("Node createRequire is unavailable for secure temp-root resolution");
	resolveSecureTempRootRuntime = moduleNamespace.createRequire(import.meta.url)("@openclaw/fs-safe/temp").resolveSecureTempRoot;
	return resolveSecureTempRootRuntime;
}
/** Resolves a safe OpenClaw temp root, falling back to user-scoped os.tmpdir paths when needed. */
function resolvePreferredOpenClawTmpDir(options = {}) {
	return loadResolveSecureTempRoot()({
		...options,
		preferredDir: options.preferredDir ?? "/tmp/openclaw",
		fallbackPrefix: "openclaw",
		warningPrefix: "[openclaw]",
		unsafeFallbackLabel: "OpenClaw temp dir",
		skipPreferredOnWindows: true
	});
}
var DEFAULT_POSIX_TMP_ROOT, resolveSecureTempRootRuntime;
var init_tmp_openclaw_dir = __esmMin((() => {
	init_sealed_runtime_registry();
	DEFAULT_POSIX_TMP_ROOT = "/tmp/openclaw";
}));
//#endregion
//#region src/shared/dot-path.ts
/** Appends one config path segment without confusing literal record keys with traversal. */
function appendConfigPathSegment(path, segment) {
	if (typeof segment === "number") return `${path}[${segment}]`;
	if (!/^[A-Za-z_$][A-Za-z0-9_$:-]*$/.test(segment)) return `${path}[${JSON.stringify(segment)}]`;
	return path ? `${path}.${segment}` : segment;
}
var init_dot_path = __esmMin((() => {}));
//#endregion
//#region src/infra/config-dir.ts
/** Resolves the OpenClaw config directory from state/config env overrides or home. */
function resolveConfigDir(env = process.env, homedir = os.homedir) {
	const override = env.OPENCLAW_STATE_DIR?.trim();
	if (override) return resolveUserPath$1(override, env, homedir);
	const configPath = env.OPENCLAW_CONFIG_PATH?.trim();
	if (configPath) return path.dirname(resolveUserPath$1(configPath, env, homedir));
	return path.join(resolveRequiredHomeDir(env, homedir), ".openclaw");
}
var init_config_dir = __esmMin((() => {
	init_home_dir();
}));
//#endregion
//#region src/infra/fs-safe-defaults.ts
var init_fs_safe_defaults = __esmMin((() => {}));
//#endregion
//#region src/infra/fs-safe-advanced.ts
var init_fs_safe_advanced = __esmMin((() => {
	init_fs_safe_defaults();
}));
//#endregion
//#region src/infra/fs-safe.ts
var init_fs_safe = __esmMin((() => {
	init_fs_safe_defaults();
	init_fs_safe_advanced();
}));
//#endregion
//#region src/infra/path-guards.ts
/**
* Normalize a Windows path for boundary math whose result is handed back to callers.
*
* Unlike `normalizeWindowsPathForComparison`, this preserves case: `path.win32.relative`
* already matches roots case-insensitively, so lowercasing only corrupts the returned
* relative path — and callers create files from it on a case-preserving filesystem.
* Extended-length prefix stripping stays, or `\\?\`-prefixed inputs read as boundary escapes.
*/
function normalizeWindowsPathPreservingCase(input) {
	const normalized = path.win32.normalize(input);
	if (!normalized.startsWith("\\\\?\\")) return normalized;
	const withoutPrefix = normalized.slice(4);
	return withoutPrefix.toUpperCase().startsWith("UNC\\") ? `\\\\${withoutPrefix.slice(4)}` : withoutPrefix;
}
var init_path_guards = __esmMin((() => {
	init_fs_safe_defaults();
}));
//#endregion
//#region src/infra/home-display.ts
var init_home_display = __esmMin((() => {
	init_path_guards();
}));
//#endregion
//#region src/infra/plain-object.ts
/**
* Config merge/patch accepts only `[object Object]` values, excluding Date/Map/Set/class instances.
* The stricter prototype contract prevents host objects from being merged as authored config.
*/
function isPlainObject(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value) && Object.prototype.toString.call(value) === "[object Object]";
}
var init_plain_object = __esmMin((() => {}));
//#endregion
//#region src/shared/regexp.ts
/** Escape text so it can be embedded literally inside a RegExp pattern. */
function escapeRegExp(value) {
	return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
var init_regexp = __esmMin((() => {}));
//#endregion
//#region packages/retry/src/index.ts
function clampNumber(value, fallback, min, max) {
	const next = Number.isFinite(value) ? value : void 0;
	if (next === void 0) return fallback;
	return Math.min(Math.max(next, min ?? Number.NEGATIVE_INFINITY), max ?? Number.POSITIVE_INFINITY);
}
function resolveAttemptCount(value, fallback) {
	return Math.max(1, Math.round(Number.isFinite(value) ? value : fallback));
}
function resolveRetryDelayMs(value) {
	const finite = value === Number.POSITIVE_INFINITY ? MAX_TIMER_TIMEOUT_MS : Number.isFinite(value) ? value : 0;
	return Math.min(Math.max(Math.round(finite), 0), MAX_TIMER_TIMEOUT_MS);
}
function resolveJitterConfig(value, fallback) {
	if (value === "full") return "full";
	const fraction = Number.isFinite(value) ? value : void 0;
	return fraction === void 0 ? fallback : Math.min(Math.max(fraction, 0), 1);
}
function resolveRetryConfig(defaults = DEFAULT_RETRY_CONFIG, overrides) {
	const attempts = resolveAttemptCount(overrides?.attempts, defaults.attempts);
	const minDelayMs = resolveRetryDelayMs(clampNumber(overrides?.minDelayMs, defaults.minDelayMs, 0));
	return {
		attempts,
		minDelayMs,
		maxDelayMs: Math.max(minDelayMs, resolveRetryDelayMs(clampNumber(overrides?.maxDelayMs, defaults.maxDelayMs, 0))),
		jitter: resolveJitterConfig(overrides?.jitter, defaults.jitter)
	};
}
function applyJitter(delayMs, jitter, mode, random) {
	if (jitter === "full") {
		if (mode === "symmetric") return Math.max(0, Math.round(delayMs * (.5 + random() * .5)));
		return Math.max(0, Math.ceil(delayMs * (1 + random())));
	}
	if (jitter <= 0) return mode === "positive" ? Math.ceil(delayMs) : delayMs;
	const fraction = random();
	const raw = delayMs * (1 + (mode === "positive" ? fraction * jitter : (fraction * 2 - 1) * jitter));
	return Math.max(0, mode === "positive" ? Math.ceil(raw) : Math.round(raw));
}
function toRetryError(value, fallbackMessage = "Non-Error thrown") {
	if (value instanceof Error) return value;
	if (typeof value === "string") return new Error(value);
	const error = new Error(fallbackMessage, { cause: value });
	if (typeof value === "object" && value !== null || typeof value === "function") Object.assign(error, value);
	return error;
}
function createRetryRunner(runtime = {}) {
	const runtimeSleep = runtime.sleep ?? defaultSleep;
	const runtimeRandom = runtime.random ?? Math.random;
	const createFailure = runtime.createFailure ?? ((errors) => toRetryError(errors.at(-1) ?? /* @__PURE__ */ new Error("Retry failed")));
	return async function retryAsync(fn, attemptsOrOptions = 3, initialDelayMs = 300) {
		const attemptErrors = [];
		if (typeof attemptsOrOptions === "number") {
			const attempts = resolveAttemptCount(attemptsOrOptions, DEFAULT_RETRY_CONFIG.attempts);
			for (let index = 0; index < attempts; index += 1) try {
				return await fn();
			} catch (err) {
				attemptErrors.push(err);
				if (index === attempts - 1) break;
				await runtimeSleep(resolveRetryDelayMs(initialDelayMs * 2 ** index));
			}
			throw createFailure(attemptErrors);
		}
		const options = attemptsOrOptions;
		const resolved = resolveRetryConfig(DEFAULT_RETRY_CONFIG, options);
		const maxAttempts = resolved.attempts;
		const minDelayMs = resolved.minDelayMs;
		const maxDelayMs = resolved.maxDelayMs > 0 ? resolved.maxDelayMs : Number.POSITIVE_INFINITY;
		const retryAfterMaxDelayMs = options.retryAfterMaxDelayMs === void 0 ? maxDelayMs : Math.max(minDelayMs, resolveRetryDelayMs(clampNumber(options.retryAfterMaxDelayMs, maxDelayMs, 0)));
		const random = options.random ?? runtimeRandom;
		const sleep = options.sleep ?? runtimeSleep;
		const shouldRetry = options.shouldRetry ?? (() => true);
		for (let attempt = 1; attempt <= maxAttempts; attempt += 1) try {
			return await fn();
		} catch (err) {
			attemptErrors.push(err);
			if (attempt >= maxAttempts || !shouldRetry(err, attempt)) break;
			const context = {
				attempt,
				maxAttempts,
				err,
				label: options.label
			};
			const retryAfterMs = options.retryAfterMs?.(err);
			const hasRetryAfter = typeof retryAfterMs === "number" && Number.isFinite(retryAfterMs);
			const configuredDelay = typeof options.delayMs === "function" ? options.delayMs(context) : options.delayMs;
			const resolvedConfiguredDelay = configuredDelay === void 0 ? void 0 : resolveRetryDelayMs(configuredDelay);
			const baseDelay = hasRetryAfter ? Math.max(retryAfterMs, minDelayMs) : resolvedConfiguredDelay === void 0 ? minDelayMs * 2 ** (attempt - 1) : Math.max(resolvedConfiguredDelay, minDelayMs);
			const delayCap = hasRetryAfter ? retryAfterMaxDelayMs : maxDelayMs;
			let delay = Math.min(baseDelay, delayCap);
			const canHonorRetryAfter = hasRetryAfter && (retryAfterMs ?? 0) <= delayCap;
			const wantsPositiveDraw = resolved.jitter === "full" ? !hasRetryAfter || canHonorRetryAfter : canHonorRetryAfter;
			delay = applyJitter(delay, resolved.jitter, wantsPositiveDraw ? "positive" : "symmetric", random);
			delay = Math.min(Math.max(delay, minDelayMs), delayCap);
			await options.onRetry?.({
				...context,
				delayMs: delay
			});
			if (delay > 0) await sleep(delay);
		}
		throw createFailure(attemptErrors);
	};
}
var MAX_TIMER_TIMEOUT_MS, DEFAULT_RETRY_CONFIG, defaultSleep;
var init_src = __esmMin((() => {
	MAX_TIMER_TIMEOUT_MS = 2147e6;
	DEFAULT_RETRY_CONFIG = {
		attempts: 3,
		minDelayMs: 300,
		maxDelayMs: 3e4,
		jitter: 0
	};
	defaultSleep = async (ms) => {
		let remainingMs = ms;
		do {
			const delayMs = Math.min(remainingMs, MAX_TIMER_TIMEOUT_MS);
			await new Promise((resolve) => {
				setTimeout(resolve, delayMs);
			});
			remainingMs -= delayMs;
		} while (remainingMs > 0);
	};
	createRetryRunner();
}));
//#endregion
//#region src/utils/sleep.ts
var init_sleep = __esmMin((() => {
	init_number_coercion();
	init_src();
}));
var init_utils = __esmMin((() => {
	init_config_dir();
	init_fs_safe();
	init_home_display();
	init_plain_object();
	init_sleep();
	resolveConfigDir();
}));
//#endregion
//#region src/secrets/ref-contract.ts
var DEFAULT_SECRET_PROVIDER_ALIAS;
var init_ref_contract = __esmMin((() => {
	DEFAULT_SECRET_PROVIDER_ALIAS = "default";
}));
//#endregion
//#region src/config/types.secrets.ts
/** Parse `$NAME` and `${NAME}` env-secret shorthand strings into env SecretRefs. */
function parseEnvTemplateSecretRef(value, provider = DEFAULT_SECRET_PROVIDER_ALIAS) {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	const match = ENV_SECRET_TEMPLATE_RE.exec(trimmed) ?? ENV_SECRET_SHORTHAND_RE.exec(trimmed);
	if (!match) return null;
	return {
		source: "env",
		provider: provider.trim() || "default",
		id: expectDefined(match[1], "types.secrets regex capture 1")
	};
}
var ENV_SECRET_TEMPLATE_RE, ENV_SECRET_SHORTHAND_RE;
var init_types_secrets = __esmMin((() => {
	init_src$1();
	init_ref_contract();
	ENV_SECRET_TEMPLATE_RE = /^\$\{([A-Z][A-Z0-9_]{0,127})\}$/;
	ENV_SECRET_SHORTHAND_RE = /^\$([A-Z][A-Z0-9_]{0,127})$/;
}));
//#endregion
//#region src/config/env-substitution.ts
function parseEnvTokenAt(value, index) {
	if (value[index] !== "$") return null;
	const next = value[index + 1];
	const afterNext = value[index + 2];
	if (next === "$" && afterNext === "{") {
		const start = index + 3;
		const end = value.indexOf("}", start);
		if (end !== -1) {
			const name = value.slice(start, end);
			if (ENV_VAR_NAME_PATTERN.test(name)) return {
				kind: "escaped",
				name,
				end
			};
		}
	}
	if (next === "{") {
		const start = index + 2;
		const end = value.indexOf("}", start);
		if (end !== -1) {
			const name = value.slice(start, end);
			if (ENV_VAR_NAME_PATTERN.test(name)) return {
				kind: "substitution",
				name,
				end
			};
		}
	}
	return null;
}
function substituteString(value, env, configPath, opts) {
	if (!value.includes("$")) return value;
	const authoredRef = parseEnvTemplateSecretRef(value);
	if (authoredRef && !containsEnvVarReference(value)) opts?.onPendingEnvSecretRef?.(authoredRef.id, configPath);
	const chunks = [];
	for (let i = 0; i < value.length; i += 1) {
		const char = value.charAt(i);
		if (char !== "$") {
			chunks.push(char);
			continue;
		}
		const token = parseEnvTokenAt(value, i);
		if (token?.kind === "escaped") {
			chunks.push(`\${${token.name}}`);
			i = token.end;
			continue;
		}
		if (token?.kind === "substitution") {
			const envValue = env[token.name];
			if (envValue === void 0 || envValue === "") {
				if (opts?.onMissing) {
					opts.onMissing({
						varName: token.name,
						configPath
					});
					if (authoredRef?.id === token.name) opts.onPendingEnvSecretRef?.(token.name, configPath);
					chunks.push(`\${${token.name}}`);
					i = token.end;
					continue;
				}
				throw new MissingEnvVarError(token.name, configPath);
			}
			if (authoredRef?.id === token.name) opts?.onResolvedEnvSecretRef?.(token.name, configPath);
			chunks.push(envValue);
			i = token.end;
			continue;
		}
		chunks.push(char);
	}
	return chunks.join("");
}
/** Detects unescaped `${VAR}` references without treating escaped `$${VAR}` as references. */
function containsEnvVarReference(value) {
	if (!value.includes("$")) return false;
	for (let i = 0; i < value.length; i += 1) {
		if (value[i] !== "$") continue;
		const token = parseEnvTokenAt(value, i);
		if (token?.kind === "escaped") {
			i = token.end;
			continue;
		}
		if (token?.kind === "substitution") return true;
	}
	return false;
}
function substituteAny(value, env, path, opts) {
	const pending = [];
	const visit = (current, currentPath) => {
		if (typeof current === "string") return substituteString(current, env, currentPath, opts);
		if (Array.isArray(current)) {
			const length = current.length;
			const result = [];
			result.length = length;
			let index = 0;
			pending.push(() => {
				while (index < length) {
					const key = index++;
					if (key in current) {
						result[key] = visit(current[key], `${currentPath}[${key}]`);
						return true;
					}
				}
				return false;
			});
			return result;
		}
		if (isPlainObject(current)) {
			const result = {};
			const entries = Object.entries(current)[Symbol.iterator]();
			pending.push(() => {
				const entry = entries.next();
				if (entry.done) return false;
				const [key, child] = entry.value;
				result[key] = visit(child, appendConfigPathSegment(currentPath, key));
				return true;
			});
			return result;
		}
		return current;
	};
	const result = visit(value, path);
	for (let next = pending.at(-1); next; next = pending.at(-1)) if (!next()) pending.pop();
	return result;
}
/**
* Resolves `${VAR_NAME}` environment variable references in config values.
*
* @param obj - The parsed config object (after JSON5 parse and $include resolution)
* @param env - Environment variables to use for substitution (defaults to process.env)
* @param opts - Options: `onMissing` callback to collect warnings instead of throwing.
* @returns The config object with env vars substituted
* @throws {MissingEnvVarError} If a referenced env var is not set or empty (unless `onMissing` is set)
*/
function resolveConfigEnvVars(obj, env = process.env, opts) {
	return substituteAny(obj, env, "", opts);
}
var ENV_VAR_NAME_PATTERN, MissingEnvVarError;
var init_env_substitution = __esmMin((() => {
	init_dot_path();
	init_utils();
	init_types_secrets();
	ENV_VAR_NAME_PATTERN = /^[A-Z_][A-Z0-9_]*$/;
	MissingEnvVarError = class extends Error {
		constructor(varName, configPath) {
			super(`Missing env var "${varName}" referenced at config path: ${configPath}`);
			this.varName = varName;
			this.configPath = configPath;
			this.name = "MissingEnvVarError";
		}
	};
}));
//#endregion
//#region src/infra/boundary-file-read.ts
var init_boundary_file_read = __esmMin((() => {
	init_fs_safe_defaults();
}));
//#endregion
//#region src/infra/boundary-path.ts
function resolvePathViaExistingAncestorSync$1(targetPath) {
	return runInBoundaryPathContext(resolvePathViaExistingAncestorSync, targetPath);
}
var runInBoundaryPathContext;
var init_boundary_path = __esmMin((() => {
	init_fs_safe_defaults();
	runInBoundaryPathContext = AsyncLocalStorage.snapshot();
}));
//#endregion
//#region src/infra/deep-merge.ts
function sanitizePlainObject(value) {
	const sanitized = {};
	for (const [key, entry] of Object.entries(value)) {
		if (isBlockedObjectKey(key)) continue;
		sanitized[key] = isPlainObject(entry) ? sanitizePlainObject(entry) : entry;
	}
	return sanitized;
}
/** Merge plain objects while preserving OpenClaw's null, undefined, and array policies. */
function mergeDeep(base, override, options = {}) {
	const arrays = options.arrays ?? "replace";
	const undefinedValues = options.undefinedValues ?? "skip";
	if (Array.isArray(base) && Array.isArray(override)) return arrays === "concat" ? [...base, ...override] : override;
	if (!isPlainObject(base) || !isPlainObject(override)) return override === void 0 && undefinedValues === "skip" ? base : override;
	const merged = sanitizePlainObject(base);
	for (const [key, value] of Object.entries(override)) {
		if (isBlockedObjectKey(key) || value === void 0 && undefinedValues === "skip") continue;
		const current = merged[key];
		if (isPlainObject(value)) merged[key] = isPlainObject(current) ? mergeDeep(current, value, options) : sanitizePlainObject(value);
		else if (arrays === "concat" && Array.isArray(current) && Array.isArray(value)) merged[key] = [...current, ...value];
		else merged[key] = value;
	}
	return merged;
}
var init_deep_merge = __esmMin((() => {
	init_plain_object();
	init_prototype_keys();
}));
//#endregion
//#region src/infra/errno.ts
/** Type guard for NodeJS.ErrnoException (any object with a `code` property). */
function isErrno(err) {
	return Boolean(err && typeof err === "object" && "code" in err);
}
/** Checks whether an errno-shaped value has the exact code. */
function hasErrnoCode(err, code) {
	return isErrno(err) && err.code === code;
}
/** Classifies missing filesystem paths across Node and fs-safe boundaries. */
function isMissingPathError(err) {
	return hasErrnoCode(err, "ENOENT") || hasErrnoCode(err, "ENOTDIR") || hasErrnoCode(err, "not-found");
}
var init_errno = __esmMin((() => {}));
//#endregion
//#region src/infra/path-safety.ts
var init_path_safety = __esmMin((() => {
	init_fs_safe_defaults();
}));
//#endregion
//#region src/security/scan-paths.ts
var init_scan_paths = __esmMin((() => {
	init_path_safety();
}));
//#endregion
//#region src/utils/parse-json-compat.ts
/**
* JSON parser compatibility helper for persisted config, manifests, and legacy stores.
* Strict JSON stays the fast path; JSON5 is only the authored/legacy fallback.
*/
function isJson5Parser(value) {
	return typeof value === "object" && value !== null && "parse" in value && typeof value.parse === "function";
}
function setJson5Runtime(runtime) {
	const parser = isJson5Parser(runtime) ? runtime : typeof runtime === "object" && runtime !== null && "default" in runtime ? runtime.default : void 0;
	if (!isJson5Parser(parser)) throw new Error("json5 parser unavailable");
	json5Runtime = parser;
	return parser;
}
function loadJson5Parser() {
	if (json5Runtime) return json5Runtime;
	const injected = getSealedRuntimeJson5();
	if (injected !== void 0) return setJson5Runtime(injected);
	if (typeof SEALED_RUNTIME_BUILD === "boolean" && SEALED_RUNTIME_BUILD) throw new Error("sealed JSON5 runtime was not registered before use");
	return setJson5Runtime(createRequire(import.meta.url)("json5"));
}
/** Parses strict JSON first, then accepts JSON5 syntax such as comments and trailing commas. */
function parseJsonWithJson5Fallback(raw, json5) {
	try {
		return JSON.parse(raw);
	} catch {
		return (json5 ?? loadJson5Parser()).parse(raw);
	}
}
var json5Runtime;
var init_parse_json_compat = __esmMin((() => {
	init_sealed_runtime_registry();
}));
//#endregion
//#region src/config/includes.ts
/** Deep merge: arrays concatenate, objects merge recursively, primitives: source wins */
function deepMerge(target, source) {
	return mergeDeep(target, source, {
		arrays: "concat",
		undefinedValues: "replace"
	});
}
function safeRealpath(target) {
	try {
		return fs.realpathSync(target);
	} catch {
		return target;
	}
}
/** Capture the lexical and canonical include roots once for a resolver traversal. */
function createConfigIncludeBoundary(configPath, allowedRoots = []) {
	const configRootDir = path.normalize(path.dirname(configPath));
	return {
		configRoot: {
			rootDir: configRootDir,
			rootRealDir: path.normalize(safeRealpath(configRootDir))
		},
		allowedRoots: allowedRoots.filter((entry) => typeof entry === "string" && entry.length > 0 && path.isAbsolute(entry)).map((entry) => {
			const rootDir = path.normalize(entry);
			return {
				rootDir,
				rootRealDir: path.normalize(safeRealpath(rootDir))
			};
		})
	};
}
function readConfigIncludeFileWithGuards(params) {
	const ioFs = params.ioFs ?? fs;
	const maxBytes = params.maxBytes ?? MAX_INCLUDE_FILE_BYTES;
	if (!canUseRootFileOpen(ioFs)) {
		const raw = ioFs.readFileSync(params.resolvedPath, "utf-8");
		try {
			params.onResolvedPath?.(path.normalize(ioFs.realpathSync(params.resolvedPath)));
		} catch {}
		return raw;
	}
	const opened = openRootFileSync({
		absolutePath: params.resolvedPath,
		rootPath: params.rootRealDir,
		rootRealPath: params.rootRealDir,
		boundaryLabel: "config directory",
		skipLexicalRootCheck: true,
		rejectSymlinks: false,
		maxBytes,
		ioFs
	});
	if (!opened.ok) {
		if (opened.reason === "validation") throw new ConfigIncludeError(`Include file failed security checks (regular file, max ${maxBytes} bytes, no hardlinks): ${params.includePath}`, params.includePath);
		throw new ConfigIncludeError(`Failed to read include file: ${params.includePath} (resolved: ${params.resolvedPath})`, params.includePath, opened.error instanceof Error ? opened.error : void 0);
	}
	try {
		const raw = ioFs.readFileSync(opened.fd, "utf-8");
		params.onResolvedPath?.(path.normalize(opened.path));
		return raw;
	} finally {
		ioFs.closeSync(opened.fd);
	}
}
function resolveConfigIncludesWithinBoundary(obj, configPath, resolver, boundary, rootProjectionKeys) {
	return new IncludeProcessor(configPath, resolver, boundary, rootProjectionKeys).process(obj);
}
/**
* Resolves all $include directives in a parsed config object.
*/
function resolveConfigIncludes(obj, configPath, resolver = defaultResolver, options = {}) {
	return resolveConfigIncludesWithinBoundary(obj, configPath, resolver, createConfigIncludeBoundary(configPath, options.allowedRoots ?? []));
}
/**
* Resolves one top-level config field through the canonical include graph while
* leaving unrelated top-level branches untouched. Early bootstrap readers use
* this when a malformed sibling must not hide an independently valid setting.
*/
function resolveConfigIncludesForTopLevelKey(obj, configPath, key, resolver = defaultResolver, options = {}) {
	return resolveConfigIncludesWithinBoundary(obj, configPath, resolver, createConfigIncludeBoundary(configPath, options.allowedRoots ?? []), /* @__PURE__ */ new Set([key]));
}
var INCLUDE_KEY, MAX_INCLUDE_FILE_BYTES, MAX_INCLUDE_PATH_LENGTH, ConfigIncludeError, CircularIncludeError, IncludeProcessor, defaultResolver;
var init_includes = __esmMin((() => {
	init_src$1();
	init_boundary_file_read();
	init_boundary_path();
	init_deep_merge();
	init_errno();
	init_scan_paths();
	init_utils();
	init_parse_json_compat();
	INCLUDE_KEY = "$include";
	MAX_INCLUDE_FILE_BYTES = 2097152;
	MAX_INCLUDE_PATH_LENGTH = 4096;
	ConfigIncludeError = class extends Error {
		constructor(message, includePath, cause) {
			super(message);
			this.includePath = includePath;
			this.cause = cause;
			this.name = "ConfigIncludeError";
		}
	};
	CircularIncludeError = class extends ConfigIncludeError {
		constructor(chain) {
			super(`Circular include detected: ${chain.join(" -> ")}`, expectDefined(chain[chain.length - 1], "chain entry at chain.length 1"));
			this.chain = chain;
			this.name = "CircularIncludeError";
		}
	};
	IncludeProcessor = class IncludeProcessor {
		constructor(basePath, resolver, boundary, rootProjectionKeys) {
			this.basePath = basePath;
			this.resolver = resolver;
			this.boundary = boundary;
			this.rootProjectionKeys = rootProjectionKeys;
			this.visited = /* @__PURE__ */ new Set();
			this.depth = 0;
			this.visited.add(path.normalize(basePath));
		}
		get rootDir() {
			return this.boundary.configRoot.rootDir;
		}
		process(obj, logicalPath = [], hasArrayAncestor = false) {
			if (Array.isArray(obj)) return obj.map((item, index) => this.process(item, [...logicalPath, String(index)], true));
			if (!isPlainObject(obj)) return obj;
			if (!("$include" in obj)) return this.processObject(obj, logicalPath, hasArrayAncestor);
			return this.processInclude(obj, logicalPath, hasArrayAncestor);
		}
		processObject(obj, logicalPath, hasArrayAncestor) {
			const result = {};
			for (const [key, value] of Object.entries(obj)) {
				if (logicalPath.length === 0 && this.rootProjectionKeys && !this.rootProjectionKeys.has(key)) continue;
				result[key] = this.process(value, [...logicalPath, key], hasArrayAncestor);
			}
			return result;
		}
		processInclude(obj, logicalPath, hasArrayAncestor) {
			const includeValue = obj[INCLUDE_KEY];
			const otherKeys = Object.keys(obj).filter((key) => key !== "$include" && (logicalPath.length > 0 || !this.rootProjectionKeys || this.rootProjectionKeys.has(key)));
			const resolved = this.resolveInclude(includeValue, logicalPath, hasArrayAncestor);
			const included = resolved.value;
			this.resolver.onIncludeResolved?.({
				path: [...logicalPath],
				value: included,
				kind: Array.isArray(includeValue) ? "multiple" : "single",
				hasSiblingOverrides: otherKeys.length > 0,
				hasArrayAncestor,
				...resolved.targetPath ? { targetPath: resolved.targetPath } : {},
				...resolved.targetPaths ? { targetPaths: resolved.targetPaths } : {}
			});
			if (otherKeys.length === 0) return included;
			if (!isPlainObject(included)) throw new ConfigIncludeError("Sibling keys require included content to be an object", typeof includeValue === "string" ? includeValue : INCLUDE_KEY);
			const rest = {};
			for (const key of otherKeys) rest[key] = this.process(obj[key], [...logicalPath, key], hasArrayAncestor);
			return deepMerge(included, rest);
		}
		resolveInclude(value, logicalPath, hasArrayAncestor) {
			if (typeof value === "string") return this.loadFile(value, logicalPath, hasArrayAncestor);
			if (Array.isArray(value)) {
				const resolvedEntries = value.map((item) => {
					if (typeof item !== "string") throw new ConfigIncludeError(`Invalid $include array item: expected string, got ${typeof item}`, String(item));
					return this.loadFile(item, logicalPath, hasArrayAncestor);
				});
				return {
					value: resolvedEntries.reduce((current, entry) => deepMerge(current, entry.value), {}),
					targetPaths: resolvedEntries.map((entry) => entry.targetPath)
				};
			}
			throw new ConfigIncludeError(`Invalid $include value: expected string or array of strings, got ${typeof value}`, String(value));
		}
		loadFile(includePath, logicalPath, hasArrayAncestor) {
			const { resolvedPath, root } = this.resolvePath(includePath);
			this.checkCircular(resolvedPath);
			this.checkDepth(includePath);
			const raw = this.readFile(includePath, resolvedPath, root);
			const parsed = this.parseFile(includePath, resolvedPath, raw);
			return {
				value: this.processNested(resolvedPath, parsed, logicalPath, hasArrayAncestor),
				targetPath: resolvedPath
			};
		}
		resolvePath(includePath) {
			if (includePath.includes("\0")) throw new ConfigIncludeError("Include path must not contain null bytes", includePath);
			if (includePath.length >= MAX_INCLUDE_PATH_LENGTH) throw new ConfigIncludeError(`Include path exceeds maximum length (${MAX_INCLUDE_PATH_LENGTH} characters)`, includePath);
			const configDir = path.dirname(this.basePath);
			const resolved = path.isAbsolute(includePath) ? includePath : path.resolve(configDir, includePath);
			const normalized = path.normalize(resolved);
			if (normalized.length >= MAX_INCLUDE_PATH_LENGTH) throw new ConfigIncludeError(`Resolved include path exceeds maximum length (${MAX_INCLUDE_PATH_LENGTH} characters)`, includePath);
			const lexicalMatch = this.findContainingRoot(normalized, "rootDir");
			if (!lexicalMatch) throw new ConfigIncludeError(`Include path escapes config directory: ${includePath} (root: ${this.rootDir})`, includePath);
			this.resolver.onLexicalPath?.(normalized);
			try {
				const real = fs.realpathSync(normalized);
				const realMatch = this.findContainingRoot(real, "rootRealDir");
				if (!realMatch) throw new ConfigIncludeError(`Include path resolves outside config directory (symlink): ${includePath} (root: ${this.rootDir})`, includePath);
				return {
					resolvedPath: normalized,
					root: realMatch
				};
			} catch (err) {
				if (err instanceof ConfigIncludeError) throw err;
				if (isMissingPathError(err)) return {
					resolvedPath: normalized,
					root: lexicalMatch
				};
				throw new ConfigIncludeError(`Failed to resolve include file realpath: ${includePath} (resolved: ${normalized})`, includePath, err instanceof Error ? err : void 0);
			}
		}
		findContainingRoot(candidate, field) {
			if (isPathInside(this.boundary.configRoot[field], candidate)) return this.boundary.configRoot;
			for (const root of this.boundary.allowedRoots) if (isPathInside(root[field], candidate)) return root;
			return null;
		}
		checkCircular(resolvedPath) {
			if (this.visited.has(resolvedPath)) throw new CircularIncludeError([...this.visited, resolvedPath]);
		}
		checkDepth(includePath) {
			if (this.depth >= 10) throw new ConfigIncludeError(`Maximum include depth (10) exceeded at: ${includePath}`, includePath);
		}
		readFile(includePath, resolvedPath, root) {
			try {
				if (this.resolver.readFileWithGuards) return this.resolver.readFileWithGuards({
					includePath,
					resolvedPath,
					rootRealDir: root.rootRealDir
				});
				return this.resolver.readFile(resolvedPath);
			} catch (err) {
				if (err instanceof ConfigIncludeError) throw err;
				throw new ConfigIncludeError(`Failed to read include file: ${includePath} (resolved: ${resolvedPath})`, includePath, err instanceof Error ? err : void 0);
			}
		}
		parseFile(includePath, resolvedPath, raw) {
			try {
				return this.resolver.parseJson(raw);
			} catch (err) {
				throw new ConfigIncludeError(`Failed to parse include file: ${includePath} (resolved: ${resolvedPath})`, includePath, err instanceof Error ? err : void 0);
			}
		}
		processNested(resolvedPath, parsed, logicalPath, hasArrayAncestor) {
			const nested = new IncludeProcessor(resolvedPath, this.resolver, this.boundary, this.rootProjectionKeys);
			nested.visited = /* @__PURE__ */ new Set([...this.visited, resolvedPath]);
			nested.depth = this.depth + 1;
			return nested.process(parsed, logicalPath, hasArrayAncestor);
		}
	};
	defaultResolver = {
		readFile: (p) => fs.readFileSync(p, "utf-8"),
		readFileWithGuards: ({ includePath, resolvedPath, rootRealDir }) => readConfigIncludeFileWithGuards({
			includePath,
			resolvedPath,
			rootRealDir
		}),
		parseJson: parseJsonWithJson5Fallback
	};
}));
//#endregion
//#region src/infra/tcp-port.ts
var init_tcp_port = __esmMin((() => {
	init_number_coercion();
}));
//#endregion
//#region src/infra/test-runtime-env.ts
/** Detects Vitest/test execution from the env shape used by local and worker processes. */
function isVitestRuntimeEnv(env = process.env) {
	const vitest = env.VITEST;
	return vitest === "true" || vitest === "1" || env.VITEST_POOL_ID !== void 0 || env.VITEST_WORKER_ID !== void 0 || env.NODE_ENV === "test";
}
/** Enables the shared fast-test shortcuts only inside a detected test runtime. */
function isFastTestRuntimeEnv(env = process.env) {
	return env.OPENCLAW_TEST_FAST === "1" && (isVitestRuntimeEnv(env) || env !== process.env && isVitestRuntimeEnv(process.env));
}
var init_test_runtime_env = __esmMin((() => {}));
//#endregion
//#region src/config/state-dir.ts
function resolveDefaultHomeDir() {
	return resolveRequiredHomeDir(process.env, os.homedir);
}
function resolveLegacyStateDirs(homedir = resolveDefaultHomeDir) {
	return LEGACY_STATE_DIRNAMES.map((dir) => path.join(homedir(), dir));
}
function resolveNewStateDir(homedir = resolveDefaultHomeDir) {
	return path.join(homedir(), NEW_STATE_DIRNAME);
}
/**
* State directory for mutable data (sessions, logs, caches).
* Can be overridden via OPENCLAW_STATE_DIR.
* Default: ~/.openclaw
*/
function resolveStateDir(env = process.env, homedir = () => resolveRequiredHomeDir(env, os.homedir)) {
	const effectiveHomedir = () => resolveRequiredHomeDir(env, homedir);
	const override = env.OPENCLAW_STATE_DIR?.trim();
	if (override) return resolveHomeRelativePath(override, {
		env,
		homedir: effectiveHomedir
	});
	return resolveStateDirFromHome(env, effectiveHomedir);
}
/** Select a default state directory from the caller's already resolved home. */
function resolveStateDirFromHome(env, effectiveHomedir) {
	const newDir = resolveNewStateDir(effectiveHomedir);
	if (isFastTestRuntimeEnv(env)) return newDir;
	if (fs.existsSync(newDir)) return newDir;
	const existingLegacy = resolveLegacyStateDirs(effectiveHomedir).find((dir) => {
		try {
			return fs.existsSync(dir);
		} catch {
			return false;
		}
	});
	if (existingLegacy) return existingLegacy;
	return newDir;
}
var LEGACY_STATE_DIRNAMES, NEW_STATE_DIRNAME;
var init_state_dir = __esmMin((() => {
	init_home_dir();
	init_test_runtime_env();
	LEGACY_STATE_DIRNAMES = [".clawdbot"];
	NEW_STATE_DIRNAME = ".openclaw";
}));
//#endregion
//#region src/config/paths.ts
/**
* Nix mode detection: When OPENCLAW_NIX_MODE=1, the gateway is running under Nix.
* In this mode:
* - No auto-install flows should be attempted
* - Missing dependencies should produce actionable Nix-specific error messages
* - Config is managed externally (read-only from Nix perspective)
*/
function resolveIsNixMode(env = process.env) {
	return env.OPENCLAW_NIX_MODE === "1";
}
/** Build a homedir thunk that respects OPENCLAW_HOME for the given env. */
function envHomedir(env) {
	return () => resolveRequiredHomeDir(env, os.homedir);
}
function resolveUserPath(input, env = process.env, homedir = envHomedir(env)) {
	return resolveHomeRelativePath(input, {
		env,
		homedir
	});
}
/**
* Optional allowlist of directories that `$include` directives may resolve
* outside the config directory. Set via `OPENCLAW_INCLUDE_ROOTS` as a
* platform-delimited path list (`:` on POSIX, `;` on Windows).
*
* Each entry is tilde-expanded and resolved to an absolute path. Entries that
* cannot be resolved or that are not absolute after expansion are dropped.
*
* Returns an empty array when the var is unset or contains no usable entries,
* preserving the historical behavior where `$include` is confined to the
* directory containing `openclaw.json`.
*/
function resolveIncludeRoots(env = process.env, homedir = envHomedir(env)) {
	const raw = env.OPENCLAW_INCLUDE_ROOTS?.trim();
	if (!raw) return [];
	const effectiveHomedir = () => resolveRequiredHomeDir(env, homedir);
	const seen = /* @__PURE__ */ new Set();
	const roots = [];
	for (const entry of raw.split(path.delimiter)) {
		const trimmed = entry.trim();
		if (!trimmed) continue;
		const resolved = path.resolve(resolveHomeRelativePath(trimmed, {
			env,
			homedir: effectiveHomedir
		}));
		if (!path.isAbsolute(resolved) || seen.has(resolved)) continue;
		seen.add(resolved);
		roots.push(resolved);
	}
	return roots;
}
/**
* Config file path (JSON or JSON5).
* Can be overridden via OPENCLAW_CONFIG_PATH.
* Default: ~/.openclaw/openclaw.json (or $OPENCLAW_STATE_DIR/openclaw.json)
*/
function resolveCanonicalConfigPath(env = process.env, stateDir) {
	const override = env.OPENCLAW_CONFIG_PATH?.trim();
	if (override) return resolveUserPath(override, env, envHomedir(env));
	return path.join(stateDir ?? resolveStateDir(env, envHomedir(env)), CONFIG_FILENAME);
}
/**
* Resolve the active config path by preferring existing config candidates
* before falling back to the canonical path.
*/
function resolveConfigPathCandidate(env = process.env, homedir = envHomedir(env)) {
	const override = env.OPENCLAW_CONFIG_PATH?.trim();
	if (override) return resolveUserPath(override, env, homedir);
	if (isFastTestRuntimeEnv(env)) return resolveCanonicalConfigPath(env, resolveStateDir(env, homedir));
	const existing = resolveDefaultConfigCandidates(env, homedir).find((candidate) => {
		try {
			return fs.existsSync(candidate);
		} catch {
			return false;
		}
	});
	if (existing) return existing;
	return resolveCanonicalConfigPath(env, resolveStateDir(env, homedir));
}
/**
* Active config path (prefers existing config files).
*/
function resolveConfigPath(env = process.env, stateDir, homedir = envHomedir(env)) {
	const override = env.OPENCLAW_CONFIG_PATH?.trim();
	if (override) return resolveUserPath(override, env, homedir);
	const selectedStateDir = stateDir ?? resolveStateDir(env, envHomedir(env));
	if (isFastTestRuntimeEnv(env)) return path.join(selectedStateDir, CONFIG_FILENAME);
	const stateOverride = env.OPENCLAW_STATE_DIR?.trim();
	const existing = [path.join(selectedStateDir, CONFIG_FILENAME), ...LEGACY_CONFIG_FILENAMES.map((name) => path.join(selectedStateDir, name))].find((candidate) => {
		try {
			return fs.existsSync(candidate);
		} catch {
			return false;
		}
	});
	if (existing) return existing;
	if (stateOverride) return path.join(selectedStateDir, CONFIG_FILENAME);
	const defaultStateDir = resolveStateDir(env, homedir);
	if (path.resolve(selectedStateDir) === path.resolve(defaultStateDir)) return resolveConfigPathCandidate(env, homedir);
	return path.join(selectedStateDir, CONFIG_FILENAME);
}
/**
* Resolve default config path candidates across default locations.
* Order: explicit config path → state-dir-derived paths → new default.
*/
function resolveDefaultConfigCandidates(env = process.env, homedir = envHomedir(env)) {
	const effectiveHomedir = () => resolveRequiredHomeDir(env, homedir);
	const explicit = env.OPENCLAW_CONFIG_PATH?.trim();
	if (explicit) return [resolveUserPath(explicit, env, effectiveHomedir)];
	const candidates = [];
	const openclawStateDir = env.OPENCLAW_STATE_DIR?.trim();
	if (openclawStateDir) {
		const resolved = resolveUserPath(openclawStateDir, env, effectiveHomedir);
		candidates.push(path.join(resolved, CONFIG_FILENAME));
		candidates.push(...LEGACY_CONFIG_FILENAMES.map((name) => path.join(resolved, name)));
	}
	const defaultDirs = [resolveNewStateDir(effectiveHomedir), ...resolveLegacyStateDirs(effectiveHomedir)];
	for (const dir of defaultDirs) {
		candidates.push(path.join(dir, CONFIG_FILENAME));
		candidates.push(...LEGACY_CONFIG_FILENAMES.map((name) => path.join(dir, name)));
	}
	return candidates;
}
var CONFIG_FILENAME, LEGACY_CONFIG_FILENAMES;
var init_paths = __esmMin((() => {
	init_home_dir();
	init_tcp_port();
	init_test_runtime_env();
	init_state_dir();
	resolveIsNixMode();
	CONFIG_FILENAME = "openclaw.json";
	LEGACY_CONFIG_FILENAMES = ["clawdbot.json"];
	resolveStateDir();
	resolveConfigPathCandidate();
}));
//#endregion
//#region src/logging/state.ts
function createUnownedAppliedLoggingConfig() {
	return APPLIED_LOGGING_CONFIG_UNOWNED;
}
function createLoggingState() {
	return {
		appliedConfig: createUnownedAppliedLoggingConfig(),
		cachedLogger: null,
		cachedSettings: null,
		cachedConsoleSettings: null,
		overrideSettings: null,
		invalidEnvLogLevelValue: null,
		consolePatched: false,
		forceConsoleToStderr: false,
		earlyConsoleRoutingRestore: null,
		consoleTimestampPrefix: false,
		consoleSubsystemFilter: null,
		streamErrorHandlersInstalled: false,
		rawConsole: null
	};
}
var LOGGING_STATE_KEY, APPLIED_LOGGING_CONFIG_UNOWNED, globalStore, loggingState;
var init_state = __esmMin((() => {
	LOGGING_STATE_KEY = Symbol.for("openclaw.loggingState");
	APPLIED_LOGGING_CONFIG_UNOWNED = "unowned";
	globalStore = globalThis;
	loggingState = globalStore[LOGGING_STATE_KEY] ?? createLoggingState();
	if (!Object.hasOwn(loggingState, "appliedConfig")) loggingState.appliedConfig = APPLIED_LOGGING_CONFIG_UNOWNED;
	globalStore[LOGGING_STATE_KEY] = loggingState;
}));
//#endregion
//#region src/logging/config.ts
function resolveLoggingConfigSelector() {
	const env = process.env;
	return [
		env.OPENCLAW_CONFIG_PATH,
		env.OPENCLAW_STATE_DIR,
		env.OPENCLAW_HOME,
		env.OPENCLAW_PROFILE,
		env.HOME,
		env.USERPROFILE,
		env.HOMEDRIVE,
		env.HOMEPATH,
		env.PREFIX,
		env.ANDROID_DATA,
		env.OPENCLAW_TEST_FAST,
		tryProcessCwd() ?? ""
	].map((value) => value ?? "").join("\0");
}
function resolvePartialDiagnosticLoggingConfig(logging) {
	if (!isRecord(logging)) return;
	const partial = {};
	if (typeof logging.consoleStyle === "string") try {
		const resolved = resolveConfigEnvVars({ consoleStyle: logging.consoleStyle });
		if (isRecord(resolved) && (resolved.consoleStyle === "pretty" || resolved.consoleStyle === "compact" || resolved.consoleStyle === "json")) partial.consoleStyle = resolved.consoleStyle;
	} catch {}
	if (Array.isArray(logging.redactPatterns)) try {
		const resolved = resolveConfigEnvVars({ redactPatterns: logging.redactPatterns });
		if (isRecord(resolved) && Array.isArray(resolved.redactPatterns) && resolved.redactPatterns.every((entry) => typeof entry === "string")) partial.redactPatterns = resolved.redactPatterns;
	} catch {}
	return Object.keys(partial).length > 0 ? partial : void 0;
}
/** Reads the logging block from config, caching by resolved config path. */
function readLoggingConfig() {
	try {
		if (loggingState.appliedConfig !== "unowned") return loggingState.appliedConfig;
		const selector = resolveLoggingConfigSelector();
		if (cachedLoggingConfig?.selector === selector) return cachedLoggingConfig.logging;
		const configPath = resolveConfigPath();
		if (!fs.existsSync(configPath)) {
			cachedLoggingConfig = {
				selector,
				logging: void 0
			};
			return;
		}
		const parsed = parseJsonWithJson5Fallback(fs.readFileSync(configPath, "utf8"));
		const allowedRoots = resolveIncludeRoots();
		let includedConfig;
		try {
			includedConfig = resolveConfigIncludesForTopLevelKey(parsed, configPath, "logging", void 0, { allowedRoots });
		} catch {
			const directLogging = isRecord(parsed) ? parsed.logging : void 0;
			if (directLogging === void 0) return;
			try {
				includedConfig = resolveConfigIncludes({ logging: directLogging }, configPath, void 0, { allowedRoots });
			} catch {
				return resolvePartialDiagnosticLoggingConfig(directLogging);
			}
		}
		let resolvedConfig;
		try {
			resolvedConfig = resolveConfigEnvVars(includedConfig);
		} catch {
			return resolvePartialDiagnosticLoggingConfig(isRecord(includedConfig) ? includedConfig.logging : void 0);
		}
		const logging = isRecord(resolvedConfig) ? resolvedConfig.logging : void 0;
		const resolvedLogging = isRecord(logging) ? logging : void 0;
		cachedLoggingConfig = {
			selector,
			logging: resolvedLogging
		};
		return resolvedLogging;
	} catch {
		return;
	}
}
var cachedLoggingConfig;
var init_config = __esmMin((() => {
	init_record_coerce();
	init_env_substitution();
	init_includes();
	init_paths();
	init_safe_cwd();
	init_parse_json_compat();
	init_state();
}));
//#endregion
//#region packages/net-policy/src/redact-sensitive-url.ts
function normalizeUrlQueryParamName(name) {
	let current = name.replace(URL_QUERY_NAME_SEPARATOR_RE, "");
	for (let depth = 0; depth <= MAX_NESTED_URL_REDACTION_DEPTH; depth += 1) {
		let decoded;
		try {
			decoded = decodeURIComponent(current).replace(URL_QUERY_NAME_SEPARATOR_RE, "");
		} catch {
			return {
				value: normalizeLowercaseStringOrEmpty(current).replaceAll("-", "_"),
				unresolvedEncoding: current.includes("%")
			};
		}
		if (decoded === current) return {
			value: normalizeLowercaseStringOrEmpty(current).replaceAll("-", "_"),
			unresolvedEncoding: false
		};
		current = decoded;
	}
	return {
		value: normalizeLowercaseStringOrEmpty(current).replaceAll("-", "_"),
		unresolvedEncoding: current.includes("%")
	};
}
/** True for auth-like URL query parameter names that should be redacted. */
function isSensitiveUrlQueryParamName(name) {
	const normalized = normalizeUrlQueryParamName(name);
	return normalized.unresolvedEncoding || SENSITIVE_URL_QUERY_PARAM_NAMES.has(normalized.value) || SUFFIXED_OR_SCOPED_TOKEN_QUERY_PARAM_RE.test(normalized.value);
}
var SENSITIVE_URL_QUERY_PARAM_NAMES, URL_QUERY_NAME_SEPARATOR_RE, SUFFIXED_OR_SCOPED_TOKEN_QUERY_PARAM_RE, MAX_NESTED_URL_REDACTION_DEPTH;
var init_redact_sensitive_url = __esmMin((() => {
	init_string_coerce();
	SENSITIVE_URL_QUERY_PARAM_NAMES = /* @__PURE__ */ new Set([
		"token",
		"key",
		"api_key",
		"apikey",
		"secret",
		"access_token",
		"auth_token",
		"password",
		"pass",
		"passwd",
		"auth",
		"jwt",
		"session",
		"id_token",
		"code",
		"client_secret",
		"app_secret",
		"hook_token",
		"refresh_token",
		"signature",
		"x_amz_signature",
		"x_amz_security_token",
		"private_key",
		"credential",
		"authorization",
		"sig",
		"x_api_key",
		"x_access_token",
		"x_auth_token"
	]);
	URL_QUERY_NAME_SEPARATOR_RE = /[\p{C}\p{Z}\u115F\u1160\u3164\uFFA0+]/gu;
	SUFFIXED_OR_SCOPED_TOKEN_QUERY_PARAM_RE = /(?:^|_)token(?:_[a-f0-9]{16,})?$/u;
	MAX_NESTED_URL_REDACTION_DEPTH = 8;
}));
//#endregion
//#region packages/acp-core/src/structured-auth-redaction.ts
function skipHorizontalWhitespace(value, start) {
	let cursor = start;
	while (value[cursor] === " " || value[cursor] === "	") cursor += 1;
	return cursor;
}
function readSerializedLineEnd(value, start) {
	let cursor = start;
	let slashCount = 0;
	while (slashCount < 64 && value[cursor] === "\\") {
		slashCount += 1;
		cursor += 1;
	}
	if (slashCount === 0) return null;
	if (value[cursor] === "n") return cursor + 1;
	if (value[cursor] !== "r") return null;
	cursor += 1;
	slashCount = 0;
	while (slashCount < 64 && value[cursor] === "\\") {
		slashCount += 1;
		cursor += 1;
	}
	return slashCount > 0 && value[cursor] === "n" ? cursor + 1 : null;
}
function readSerializedTabEnd(value, start) {
	let cursor = start;
	let slashCount = 0;
	while (slashCount < 64 && value[cursor] === "\\") {
		slashCount += 1;
		cursor += 1;
	}
	return slashCount > 0 && value[cursor] === "t" ? cursor + 1 : null;
}
function skipAuthWhitespace(value, start) {
	let cursor = start;
	for (;;) {
		cursor = skipHorizontalWhitespace(value, cursor);
		const tabEnd = readSerializedTabEnd(value, cursor);
		if (tabEnd !== null) {
			cursor = tabEnd;
			continue;
		}
		const lineEnd = value[cursor] === "\r" && value[cursor + 1] === "\n" ? cursor + 2 : value[cursor] === "\n" ? cursor + 1 : readSerializedLineEnd(value, cursor);
		if (lineEnd === null || value[lineEnd] !== " " && value[lineEnd] !== "	" && readSerializedTabEnd(value, lineEnd) === null) return cursor;
		cursor = lineEnd;
	}
}
function readAuthParamName(value, start) {
	const match = AUTH_PARAM_NAME_RE.exec(value.slice(start));
	return match ? {
		name: match[0].toLowerCase(),
		end: start + match[0].length
	} : null;
}
function isAuthHeaderStart(value, index) {
	const previous = value[index - 1];
	let serializedLineBoundary = false;
	if (previous === "n" || previous === "r") {
		let slashCursor = index - 2;
		let slashCount = 0;
		while (slashCount < 64 && value[slashCursor] === "\\") {
			slashCount += 1;
			slashCursor -= 1;
		}
		serializedLineBoundary = slashCount > 0;
	}
	if (!serializedLineBoundary && previous !== void 0 && /[A-Za-z0-9_-]/u.test(previous)) return false;
	const proxyName = "proxy-authorization";
	const directName = "authorization";
	const candidate = value.slice(index, index + 19).toLowerCase();
	const name = candidate === proxyName ? proxyName : candidate.startsWith(directName) ? directName : null;
	if (!name) return false;
	let cursor = index + name.length;
	let slashCount = 0;
	while (slashCount < 64 && value[cursor] === "\\") {
		slashCount += 1;
		cursor += 1;
	}
	if (value[cursor] === "\"" || value[cursor] === "'") cursor += 1;
	else if (slashCount > 0) return false;
	cursor = skipHorizontalWhitespace(value, cursor);
	return value[cursor] === ":" || value[cursor] === "=";
}
function findNextAuthParamStart(value, start) {
	let cursor = start;
	for (;;) {
		cursor = skipAuthWhitespace(value, cursor);
		if (cursor > start && isAuthHeaderStart(value, cursor)) return null;
		if (cursor >= value.length || value[cursor] === "\r" || value[cursor] === "\n" || value[cursor] === ";") return null;
		if (value[cursor] === ",") {
			cursor += 1;
			continue;
		}
		const param = readAuthParamName(value, cursor);
		if (param) {
			const equals = skipAuthWhitespace(value, param.end);
			if (value[equals] === "=" && value[equals + 1] !== "=") return cursor;
		}
		while (cursor < value.length) {
			const whitespaceEnd = skipAuthWhitespace(value, cursor);
			if (whitespaceEnd > cursor) {
				cursor = whitespaceEnd;
				continue;
			}
			if (cursor > start && isAuthHeaderStart(value, cursor)) return null;
			const char = value[cursor];
			if (char === "\r" || char === "\n" || char === ";") return null;
			cursor += 1;
			if (char === ",") break;
		}
	}
}
function usesAuthParams(scheme) {
	return scheme === "digest" || scheme === "hawk" || scheme.startsWith("aws4-");
}
function findAuthFieldEnd(value, start) {
	let cursor = start;
	while (cursor < value.length) {
		const whitespaceEnd = skipAuthWhitespace(value, cursor);
		if (whitespaceEnd > cursor) {
			cursor = whitespaceEnd;
			continue;
		}
		if (cursor > start && isAuthHeaderStart(value, cursor)) break;
		const char = value[cursor];
		if (char === "\r" || char === "\n" || char === ";" || char === "\\" || char === "\"" || char === "'" || char === "}" || char === "]") break;
		cursor += 1;
	}
	return cursor;
}
function readParamValue(value, start, options) {
	let escapedQuoteSlashCount = 0;
	while (value[start + escapedQuoteSlashCount] === "\\") escapedQuoteSlashCount += 1;
	const escapedQuotes = escapedQuoteSlashCount > 0 && value[start + escapedQuoteSlashCount] === "\"";
	const quote = value[start] === "\"" || value[start] === "'" ? value[start] : void 0;
	if (quote || escapedQuotes) {
		let cursor = start + (escapedQuotes ? escapedQuoteSlashCount + 1 : 1);
		while (cursor < value.length) {
			if (value[cursor] === "\r" || value[cursor] === "\n") {
				const whitespaceEnd = skipAuthWhitespace(value, cursor);
				if (whitespaceEnd === cursor) break;
				cursor = whitespaceEnd;
				continue;
			}
			if (escapedQuotes && value[cursor] === "\\") {
				let slashEnd = cursor + 1;
				while (value[slashEnd] === "\\") slashEnd += 1;
				if (value[slashEnd] === "\"") {
					if ((slashEnd - cursor) % (2 * (escapedQuoteSlashCount + 1)) === escapedQuoteSlashCount) return slashEnd + 1;
					cursor = slashEnd + 1;
					continue;
				}
				cursor = slashEnd;
				continue;
			}
			if (!escapedQuotes && value[cursor] === "\\" && cursor + 1 < value.length) {
				cursor += 2;
				continue;
			}
			if (!escapedQuotes && value[cursor] === quote) return cursor + 1;
			cursor += 1;
		}
		return cursor > start + 1 ? cursor : null;
	}
	if (options.signedHeaders) {
		const match = /^:?[A-Za-z0-9!#$%&'*+.^_`|~-]+(?:;:?[A-Za-z0-9!#$%&'*+.^_`|~-]+)*/u.exec(value.slice(start));
		if (!match) return null;
		const end = start + match[0].length;
		const next = value[end];
		return next === void 0 || next === "," || next === " " || next === "	" || next === "\r" || next === "\n" ? end : null;
	}
	const match = (options.awsScope ? AWS_SCOPE_VALUE_RE : AUTH_PARAM_TOKEN_RE).exec(value.slice(start));
	return match ? start + match[0].length : null;
}
function findStructuredAuthParamRanges(value) {
	const ranges = [];
	for (const header of value.matchAll(STRUCTURED_AUTH_HEADER_RE)) {
		const scheme = (header[2] ?? "").toLowerCase();
		let cursor = (header.index ?? 0) + header[0].length;
		const rangeStart = cursor;
		let rangeEnd = cursor;
		const directParam = readAuthParamName(value, cursor);
		const directEquals = directParam ? skipAuthWhitespace(value, directParam.end) : void 0;
		if (!directParam || directEquals === void 0 || value[directEquals] !== "=" || value[directEquals + 1] === "=") {
			if (value[skipAuthWhitespace(value, cursor)] !== "," && !usesAuthParams(scheme)) continue;
			const firstParamStart = findNextAuthParamStart(value, cursor);
			if (firstParamStart === null) continue;
			cursor = firstParamStart;
		}
		for (;;) {
			const param = readAuthParamName(value, cursor);
			if (!param) break;
			cursor = skipAuthWhitespace(value, param.end);
			if (value[cursor] !== "=") break;
			cursor = skipAuthWhitespace(value, cursor + 1);
			const valueEnd = readParamValue(value, cursor, {
				awsScope: scheme.startsWith("aws4-") && param.name === "credential",
				signedHeaders: param.name === "signedheaders"
			});
			if (valueEnd === null) {
				const nextParamStart = findNextAuthParamStart(value, cursor);
				if (nextParamStart !== null) {
					cursor = nextParamStart;
					continue;
				}
				rangeEnd = Math.max(rangeEnd, findAuthFieldEnd(value, cursor));
				break;
			}
			rangeEnd = valueEnd;
			const separator = skipAuthWhitespace(value, valueEnd);
			if (value[separator] !== ",") {
				if (value[separator] !== void 0 && value[separator] !== "\r" && value[separator] !== "\n" && value[separator] !== ";" && value[separator] !== "\\" && value[separator] !== "\"" && value[separator] !== "'" && value[separator] !== "}" && value[separator] !== "]") {
					const nextParamStart = findNextAuthParamStart(value, separator);
					if (nextParamStart !== null) {
						cursor = nextParamStart;
						continue;
					}
					rangeEnd = Math.max(rangeEnd, findAuthFieldEnd(value, separator));
				}
				break;
			}
			const nextParamStart = findNextAuthParamStart(value, separator + 1);
			if (nextParamStart === null) break;
			cursor = nextParamStart;
		}
		if (rangeEnd > rangeStart) ranges.push({
			start: rangeStart,
			end: rangeEnd
		});
	}
	return ranges;
}
function redactStructuredAuthHeaders(value, replacement) {
	const ranges = findStructuredAuthParamRanges(value);
	if (ranges.length === 0) return value;
	const merged = [];
	for (const range of ranges) {
		const previous = merged.at(-1);
		if (previous && range.start <= previous.end) previous.end = Math.max(previous.end, range.end);
		else merged.push({ ...range });
	}
	const parts = [];
	let cursor = 0;
	for (const range of merged) {
		parts.push(value.slice(cursor, range.start), replacement);
		cursor = range.end;
	}
	parts.push(value.slice(cursor));
	return parts.join("");
}
var HTTP_AUTH_SCHEME_PATTERN, HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN, HTTP_AUTH_SERIALIZED_TAB_PATTERN, HTTP_AUTH_SERIALIZED_INDENT_PATTERN, HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN, HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN, HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN, HTTP_AUTH_HEADER_BOUNDARY_PATTERN, HTTP_AUTH_SERIALIZED_QUOTE_PATTERN, STRUCTURED_AUTH_HEADER_RE, AUTH_PARAM_NAME_RE, AUTH_PARAM_TOKEN_RE, AWS_SCOPE_VALUE_RE;
var init_structured_auth_redaction = __esmMin((() => {
	HTTP_AUTH_SCHEME_PATTERN = "[A-Za-z0-9!#$%&'*+.^_`|~-]+";
	HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN = String.raw`(?:\[REDACTED\]|[^\s\\"',;&#?<>)}\]]+)`;
	HTTP_AUTH_SERIALIZED_TAB_PATTERN = String.raw`\\{1,64}t`;
	HTTP_AUTH_SERIALIZED_INDENT_PATTERN = String.raw`(?:[ \t]+|${HTTP_AUTH_SERIALIZED_TAB_PATTERN})`;
	HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN = String.raw`(?:[ \t]*\r?\n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}r\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*${HTTP_AUTH_SERIALIZED_TAB_PATTERN}[ \t]*|[ \t]*)`;
	HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN = String.raw`(?:[ \t]*\r?\n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}r\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*\\{1,64}n${HTTP_AUTH_SERIALIZED_INDENT_PATTERN}|[ \t]*${HTTP_AUTH_SERIALIZED_TAB_PATTERN}[ \t]*|[ \t]+)`;
	HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN = String.raw`(?:[ \t\r\n]*|[ \t]*\\{1,64}r\\{1,64}n(?:[ \t]*|${HTTP_AUTH_SERIALIZED_TAB_PATTERN})|[ \t]*\\{1,64}n(?:[ \t]*|${HTTP_AUTH_SERIALIZED_TAB_PATTERN})|[ \t]*${HTTP_AUTH_SERIALIZED_TAB_PATTERN}[ \t]*)`;
	HTTP_AUTH_HEADER_BOUNDARY_PATTERN = String.raw`(^|[^A-Za-z0-9_-]|\\{1,64}[rn])`;
	HTTP_AUTH_SERIALIZED_QUOTE_PATTERN = String.raw`(?:\\{1,64}["']|["']|)`;
	String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}(?:x-goog-api-key|api-key|apikey|x-api-token|x-access-token)${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}([^\s\\"',;]+)`;
	STRUCTURED_AUTH_HEADER_RE = new RegExp(String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}(?:Proxy-)?Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(${HTTP_AUTH_SCHEME_PATTERN})${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}`, "giu");
	AUTH_PARAM_NAME_RE = /^[A-Za-z0-9!#$%&'*+.^_`|~-]+/u;
	AUTH_PARAM_TOKEN_RE = /^[A-Za-z0-9!#$%&'*+.^_`|~-]+/u;
	AWS_SCOPE_VALUE_RE = /^[A-Za-z0-9!#$%&'*+.^_`|~:/-]+/u;
}));
//#endregion
//#region src/infra/map-size.ts
/** Prunes a Map in insertion order until it fits the requested maximum size. */
function pruneMapToMaxSize(map, maxSize) {
	if (Number.isNaN(maxSize) || maxSize === Number.POSITIVE_INFINITY) return;
	const limit = Math.max(0, Math.floor(maxSize));
	if (limit <= 0) {
		map.clear();
		return;
	}
	if (map.size <= limit) return;
	const keys = map.keys();
	while (map.size > limit) {
		const oldest = keys.next();
		if (oldest.done) break;
		map.delete(oldest.value);
	}
}
var init_map_size = __esmMin((() => {}));
//#endregion
//#region src/security/safe-regex.ts
function createParseFrame() {
	return {
		lastToken: null,
		containsRepetition: false,
		hasAlternation: false,
		branchMinLength: 0,
		branchMaxLength: 0,
		altMinLength: null,
		altMaxLength: null
	};
}
function addLength(left, right) {
	if (!Number.isFinite(left) || !Number.isFinite(right)) return Number.POSITIVE_INFINITY;
	return left + right;
}
function multiplyLength(length, factor) {
	if (!Number.isFinite(length)) return factor === 0 ? 0 : Number.POSITIVE_INFINITY;
	return length * factor;
}
function recordAlternative(frame) {
	if (frame.altMinLength === null || frame.altMaxLength === null) {
		frame.altMinLength = frame.branchMinLength;
		frame.altMaxLength = frame.branchMaxLength;
		return;
	}
	frame.altMinLength = Math.min(frame.altMinLength, frame.branchMinLength);
	frame.altMaxLength = Math.max(frame.altMaxLength, frame.branchMaxLength);
}
function readQuantifier(source, index) {
	const ch = source[index];
	const consumed = source[index + 1] === "?" ? 2 : 1;
	if (ch === "*") return {
		consumed,
		minRepeat: 0,
		maxRepeat: null
	};
	if (ch === "+") return {
		consumed,
		minRepeat: 1,
		maxRepeat: null
	};
	if (ch === "?") return {
		consumed,
		minRepeat: 0,
		maxRepeat: 1
	};
	if (ch !== "{") return null;
	let i = index + 1;
	while (i < source.length && /\d/.test(source.charAt(i))) i += 1;
	if (i === index + 1) return null;
	const minRepeat = Number.parseInt(source.slice(index + 1, i), 10);
	let maxRepeat = minRepeat;
	if (source[i] === ",") {
		i += 1;
		const maxStart = i;
		while (i < source.length && /\d/.test(source.charAt(i))) i += 1;
		maxRepeat = i === maxStart ? null : Number.parseInt(source.slice(maxStart, i), 10);
	}
	if (source[i] !== "}") return null;
	i += 1;
	if (source[i] === "?") i += 1;
	if (maxRepeat !== null && maxRepeat < minRepeat) return null;
	return {
		consumed: i - index,
		minRepeat,
		maxRepeat
	};
}
function tokenizePattern(source) {
	const tokens = [];
	let inCharClass = false;
	for (let i = 0; i < source.length; i += 1) {
		const ch = source[i];
		if (inCharClass) {
			if (ch === "\\") {
				i += 1;
				continue;
			}
			if (ch === "]") inCharClass = false;
			continue;
		}
		if (ch === "\\") {
			i += 1;
			tokens.push({ kind: "simple-token" });
			continue;
		}
		if (ch === "[") {
			inCharClass = true;
			tokens.push({ kind: "simple-token" });
			continue;
		}
		if (ch === "(") {
			tokens.push({ kind: "group-open" });
			continue;
		}
		if (ch === ")") {
			tokens.push({ kind: "group-close" });
			continue;
		}
		if (ch === "|") {
			tokens.push({ kind: "alternation" });
			continue;
		}
		const quantifier = readQuantifier(source, i);
		if (quantifier) {
			tokens.push({
				kind: "quantifier",
				quantifier
			});
			i += quantifier.consumed - 1;
			continue;
		}
		tokens.push({ kind: "simple-token" });
	}
	return tokens;
}
function analyzeTokensForNestedRepetition(tokens) {
	const frames = [createParseFrame()];
	const emitToken = (token) => {
		const frame = expectDefined(frames[frames.length - 1], "frames entry at frames.length 1");
		frame.lastToken = token;
		if (token.containsRepetition) frame.containsRepetition = true;
		frame.branchMinLength = addLength(frame.branchMinLength, token.minLength);
		frame.branchMaxLength = addLength(frame.branchMaxLength, token.maxLength);
	};
	const emitSimpleToken = () => {
		emitToken({
			containsRepetition: false,
			hasAmbiguousAlternation: false,
			minLength: 1,
			maxLength: 1
		});
	};
	for (const token of tokens) {
		if (token.kind === "simple-token") {
			emitSimpleToken();
			continue;
		}
		if (token.kind === "group-open") {
			frames.push(createParseFrame());
			continue;
		}
		if (token.kind === "group-close") {
			if (frames.length > 1) {
				const frame = frames.pop();
				if (frame.hasAlternation) recordAlternative(frame);
				const groupMinLength = frame.hasAlternation ? frame.altMinLength ?? 0 : frame.branchMinLength;
				const groupMaxLength = frame.hasAlternation ? frame.altMaxLength ?? 0 : frame.branchMaxLength;
				emitToken({
					containsRepetition: frame.containsRepetition,
					hasAmbiguousAlternation: frame.hasAlternation && frame.altMinLength !== null && frame.altMaxLength !== null && frame.altMinLength !== frame.altMaxLength,
					minLength: groupMinLength,
					maxLength: groupMaxLength
				});
			}
			continue;
		}
		if (token.kind === "alternation") {
			const frame = expectDefined(frames[frames.length - 1], "frames entry at frames.length 1");
			frame.hasAlternation = true;
			recordAlternative(frame);
			frame.branchMinLength = 0;
			frame.branchMaxLength = 0;
			frame.lastToken = null;
			continue;
		}
		const frame = expectDefined(frames[frames.length - 1], "frames entry at frames.length 1");
		const previousToken = frame.lastToken;
		if (!previousToken) continue;
		if (previousToken.containsRepetition) return true;
		if (previousToken.hasAmbiguousAlternation && token.quantifier.maxRepeat === null) return true;
		const previousMinLength = previousToken.minLength;
		const previousMaxLength = previousToken.maxLength;
		previousToken.minLength = multiplyLength(previousToken.minLength, token.quantifier.minRepeat);
		previousToken.maxLength = token.quantifier.maxRepeat === null ? Number.POSITIVE_INFINITY : multiplyLength(previousToken.maxLength, token.quantifier.maxRepeat);
		previousToken.containsRepetition = true;
		frame.containsRepetition = true;
		frame.branchMinLength = frame.branchMinLength - previousMinLength + previousToken.minLength;
		frame.branchMaxLength = addLength(Number.isFinite(frame.branchMaxLength) && Number.isFinite(previousMaxLength) ? frame.branchMaxLength - previousMaxLength : Number.POSITIVE_INFINITY, previousToken.maxLength);
	}
	return false;
}
function hasNestedRepetition(source) {
	return analyzeTokensForNestedRepetition(tokenizePattern(source));
}
function compileSafeRegexDetailed(source, flags = "") {
	const trimmed = source.trim();
	if (!trimmed) return {
		regex: null,
		source: trimmed,
		flags,
		reason: "empty"
	};
	const cacheKey = `${flags}::${trimmed}`;
	if (safeRegexCache.has(cacheKey)) return safeRegexCache.get(cacheKey) ?? {
		regex: null,
		source: trimmed,
		flags,
		reason: "invalid-regex"
	};
	let result;
	if (hasNestedRepetition(trimmed)) result = {
		regex: null,
		source: trimmed,
		flags,
		reason: "unsafe-nested-repetition"
	};
	else try {
		result = {
			regex: new RegExp(trimmed, flags),
			source: trimmed,
			flags,
			reason: null
		};
	} catch {
		result = {
			regex: null,
			source: trimmed,
			flags,
			reason: "invalid-regex"
		};
	}
	safeRegexCache.set(cacheKey, result);
	pruneMapToMaxSize(safeRegexCache, SAFE_REGEX_CACHE_MAX);
	return result;
}
var SAFE_REGEX_CACHE_MAX, safeRegexCache;
var init_safe_regex = __esmMin((() => {
	init_src$1();
	init_map_size();
	SAFE_REGEX_CACHE_MAX = 256;
	safeRegexCache = /* @__PURE__ */ new Map();
}));
//#endregion
//#region src/security/config-regex.ts
function normalizeRejectReason(result) {
	if (result.reason === null || result.reason === "empty") return null;
	return result.reason;
}
/**
* Compile a single user-configured regex with the shared safe-regex guardrails.
* Returns null for blank patterns so optional config entries can be skipped silently.
*/
function compileConfigRegex(pattern, flags = "") {
	const result = compileSafeRegexDetailed(pattern, flags);
	if (result.reason === "empty") return null;
	return {
		regex: result.regex,
		pattern: result.source,
		flags: result.flags,
		reason: normalizeRejectReason(result)
	};
}
var init_config_regex = __esmMin((() => {
	init_safe_regex();
}));
//#endregion
//#region src/logging/redact-bounded.ts
/** Applies a regex replacement in chunks once input crosses the redaction size threshold. */
function replacePatternBounded(text, pattern, replacer, options) {
	const chunkThreshold = options?.chunkThreshold ?? REDACT_REGEX_CHUNK_THRESHOLD;
	const chunkSize = options?.chunkSize ?? REDACT_REGEX_CHUNK_SIZE;
	if (chunkThreshold <= 0 || chunkSize <= 0 || text.length <= chunkThreshold) return text.replace(pattern, replacer);
	let output;
	for (let index = 0; index < text.length; index += chunkSize) {
		const chunk = text.slice(index, index + chunkSize);
		const replaced = chunk.replace(pattern, replacer);
		if (output !== void 0) output += replaced;
		else if (replaced !== chunk) output = text.slice(0, index) + replaced;
	}
	return output ?? text;
}
var REDACT_REGEX_CHUNK_THRESHOLD, REDACT_REGEX_CHUNK_SIZE;
var init_redact_bounded = __esmMin((() => {
	REDACT_REGEX_CHUNK_THRESHOLD = 32768;
	REDACT_REGEX_CHUNK_SIZE = 16384;
}));
//#endregion
//#region src/logging/redact-edit-composition.ts
/** Compose sorted, disjoint current-value edits while retaining original source spans. */
function composeRedactionEdits(length, previous, edits) {
	if (previous.length === 0) return edits;
	const pieces = [];
	let source = 0;
	for (const edit of previous) {
		if (source < edit.start) pieces.push({
			start: source,
			end: edit.start
		});
		pieces.push(edit);
		source = edit.end;
	}
	if (source < length) pieces.push({
		start: source,
		end: length
	});
	const output = [];
	let index = 0;
	let offset = 0;
	let position = 0;
	const consume = (end, keep) => {
		if (end === position) {
			const piece = pieces[index];
			if (!piece) return {
				start: length,
				end: length
			};
			const start = piece.replacement === void 0 ? piece.start + offset : piece.start;
			return {
				start,
				end: piece.replacement !== void 0 && offset > 0 ? piece.end : start
			};
		}
		let sourceStart;
		let sourceEnd = 0;
		while (position < end) {
			const piece = expectDefined(pieces[index], "current redaction piece");
			const size = piece.replacement?.length ?? piece.end - piece.start;
			const count = Math.min(size - offset, end - position);
			const start = piece.replacement === void 0 ? piece.start + offset : piece.start;
			const finish = piece.replacement === void 0 ? start + count : piece.end;
			sourceStart ??= start;
			sourceEnd = finish;
			if (keep && count > 0) output.push({
				start,
				end: finish,
				replacement: piece.replacement?.slice(offset, offset + count)
			});
			position += count;
			offset += count;
			if (offset === size) {
				index += 1;
				offset = 0;
			}
		}
		return {
			start: sourceStart ?? sourceEnd,
			end: sourceEnd
		};
	};
	for (const edit of edits) {
		consume(edit.start, true);
		output.push({
			...consume(edit.end, false),
			replacement: edit.replacement
		});
	}
	while (index < pieces.length) {
		const piece = expectDefined(pieces[index], "remaining redaction piece");
		consume(position + (piece.replacement?.length ?? piece.end - piece.start) - offset, true);
	}
	const composed = [];
	let fragments = [];
	let pending;
	const flush = () => {
		if (pending) {
			pending.replacement = fragments.join("");
			composed.push(pending);
			pending = void 0;
			fragments = [];
		}
	};
	for (const piece of output) {
		if (piece.replacement === void 0) {
			flush();
			continue;
		}
		const sameEmptySpan = pending && pending.start === piece.start && pending.end === piece.end && piece.start === piece.end;
		if (!pending || piece.start >= pending.end && !sameEmptySpan) {
			flush();
			pending = {
				start: piece.start,
				end: piece.end,
				replacement: ""
			};
		} else pending.end = Math.max(pending.end, piece.end);
		fragments.push(piece.replacement);
	}
	flush();
	return composed;
}
/** Project source-span replacements onto a value that already contains replacements. */
function rebaseRedactionEdits(previous, edits) {
	let shift = 0;
	const spans = previous.map((edit) => {
		const start = edit.start + shift;
		shift += edit.replacement.length - (edit.end - edit.start);
		return {
			...edit,
			currentStart: start,
			currentEnd: edit.end + shift
		};
	});
	const boundary = (position, end) => {
		let low = 0;
		let high = spans.length;
		while (low < high) {
			const middle = low + high >>> 1;
			const span = expectDefined(spans[middle], "source redaction span");
			if (span.end < position || span.end === position && span.start !== span.end) low = middle + 1;
			else high = middle;
		}
		const span = spans[low];
		if (span && (position > span.start || position === span.start && span.start === span.end)) return end ? span.currentEnd : span.currentStart;
		const before = spans[low - 1];
		return position + (before ? before.currentEnd - before.end : 0);
	};
	return edits.map((edit) => ({
		start: boundary(edit.start, false),
		end: boundary(edit.end, true),
		replacement: edit.replacement
	}));
}
function mergeRedactionEdits(edits) {
	edits.sort((left, right) => left.start - right.start || left.end - right.end);
	const merged = [];
	for (const edit of edits) {
		const previous = merged.at(-1);
		if (!previous || edit.start >= previous.end) merged.push({ ...edit });
		else if (edit.start !== previous.start || edit.end !== previous.end || edit.replacement !== previous.replacement) {
			previous.end = Math.max(previous.end, edit.end);
			previous.replacement = "***";
		}
	}
	return merged;
}
function applyRedactionEdits(value, edits) {
	const parts = [];
	let cursor = 0;
	for (const edit of mergeRedactionEdits(edits)) {
		parts.push(value.slice(cursor, edit.start), edit.replacement);
		cursor = edit.end;
	}
	return parts.join("") + value.slice(cursor);
}
var init_redact_edit_composition = __esmMin((() => {
	init_src$1();
}));
//#endregion
//#region src/logging/secret-redaction-registry.ts
function invalidateMatcher() {
	state$1.registryRevision += 1;
	state$1.registeredValueRedactor = void 0;
}
/** Replaces registered exact values while preserving the caller's mask convention. */
function redactRegisteredSecretValues(text, mask) {
	if (!text || state$1.registeredValues.size === 0) return text;
	state$1.registeredValueRedactor ??= createSecretValueRedactor([...state$1.registeredValues.keys()]);
	return state$1.registeredValueRedactor(text, mask);
}
function createSecretValueRedactor(values) {
	let compiledMatcher;
	let firstChars;
	return (text, mask) => {
		if (!text || values.length === 0) return text;
		let couldMatch = false;
		firstChars ??= new Set(values.map((value) => value.charAt(0)));
		for (const firstChar of firstChars) if (text.includes(firstChar)) {
			couldMatch = true;
			break;
		}
		if (!couldMatch) return text;
		if (!compiledMatcher) {
			const buckets = /* @__PURE__ */ new Map();
			for (const value of values.toSorted((left, right) => right.length - left.length)) {
				const prefix = value.slice(0, MIN_SECRET_VALUE_LENGTH);
				const bucket = buckets.get(prefix);
				if (bucket) bucket.push(value);
				else buckets.set(prefix, [value]);
			}
			compiledMatcher = {
				prefixes: new RegExp([...buckets.keys()].map(escapeRegExp).join("|"), "g"),
				buckets
			};
		}
		const { prefixes, buckets } = compiledMatcher;
		const matches = [];
		prefixes.lastIndex = 0;
		for (let match = prefixes.exec(text); match; match = prefixes.exec(text)) {
			const index = match.index;
			const value = buckets.get(match[0])?.find((candidate) => text.startsWith(candidate, index));
			if (value !== void 0) matches.push({
				index,
				value
			});
			prefixes.lastIndex = index + (value?.length ?? 1);
		}
		let result = "";
		let cursor = 0;
		for (const match of matches) {
			result += `${text.slice(cursor, match.index)}${mask(match.value, match.index)}`;
			cursor = match.index + match.value.length;
		}
		return result + text.slice(cursor);
	};
}
function resetSecretRedactionRegistryForTest() {
	state$1.registeredValues.clear();
	invalidateMatcher();
}
var MIN_SECRET_VALUE_LENGTH, state$1;
var init_secret_redaction_registry = __esmMin((() => {
	init_global_singleton();
	init_regexp();
	MIN_SECRET_VALUE_LENGTH = 6;
	state$1 = resolveGlobalSingleton(Symbol.for("openclaw.secretRedactionRegistry"), () => ({
		registeredValues: /* @__PURE__ */ new Map(),
		registryRevision: 0,
		registeredValueRedactor: void 0
	}));
	if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.secretRedactionRegistryTestApi")] = { resetSecretRedactionRegistryForTest };
}));
//#endregion
//#region src/logging/redact-internal-state.ts
var init_redact_internal_state = __esmMin((() => {
	init_secret_redaction_registry();
}));
//#endregion
//#region src/logging/redact-internal.ts
var init_redact_internal = __esmMin((() => {
	init_redact_internal_state();
}));
//#endregion
//#region src/logging/redact-json-tokens.ts
function readScalarTokens(text, origins) {
	const tokens = [];
	const containers = [];
	const root = {
		key: "",
		path: [],
		origins,
		origin: origins.value,
		objectPath: true
	};
	const valueContext = (parent) => !parent ? root : parent.array ? {
		...parent.context,
		origin: parent.context.origins?.value ?? parent.context.origin,
		origins: parent.context.origins?.children.get(String(parent.nextIndex++))
	} : expectDefined(parent.field, "JSON object field context");
	for (const match of text.matchAll(JSON_TOKEN_RE)) {
		const raw = match[0];
		const parent = containers.at(-1);
		if (raw === "{" || raw === "[") {
			const context = valueContext(parent);
			const array = raw === "[";
			containers.push({
				array,
				nextIndex: 0,
				context: array ? {
					...context,
					objectPath: false
				} : context,
				start: match.index,
				tokenStart: tokens.length
			});
			continue;
		}
		if (raw === "}" || raw === "]") {
			const container = expectDefined(containers.pop(), "JSON container");
			if (container.tokenStart === tokens.length) {
				const end = match.index + 1;
				const value = text.slice(container.start, end);
				tokens.push({
					...container.context,
					isKey: false,
					string: false,
					value,
					start: container.start,
					end,
					escaped: false,
					edits: [],
					projectedEdits: [],
					currentValue: value,
					currentStart: container.start,
					currentEnd: end
				});
			}
			continue;
		}
		const start = match.index;
		const end = start + raw.length;
		const string = raw.startsWith("\"");
		const value = string ? JSON.parse(raw) : raw;
		let next = end;
		while (text[next] === " " || text[next] === "	" || text[next] === "\r" || text[next] === "\n") next += 1;
		const isKey = string && text[next] === ":";
		let context;
		if (isKey) {
			const container = expectDefined(parent, "JSON property container");
			const inherited = container.context;
			context = {
				key: "",
				path: [],
				origin: inherited.origin,
				objectPath: false,
				rootKey: inherited.rootKey,
				rootValueStart: inherited.rootValueStart
			};
			let valueStart = next + 1;
			while (text[valueStart] === " " || text[valueStart] === "	" || text[valueStart] === "\r" || text[valueStart] === "\n") valueStart += 1;
			container.field = {
				key: value,
				path: [...inherited.path, value],
				origins: inherited.origins?.children.get(value),
				origin: inherited.origins?.value ?? inherited.origin,
				objectPath: inherited.objectPath,
				rootKey: containers.length === 1 ? value : inherited.rootKey,
				rootValueStart: containers.length === 1 ? valueStart : inherited.rootValueStart
			};
		} else context = valueContext(parent);
		const origin = isKey ? {
			structured: false,
			primitiveMask: false
		} : context.origins?.value ?? context.origin;
		tokens.push({
			...context,
			origin,
			start,
			end,
			isKey,
			string,
			value,
			escaped: string && raw.includes("\\"),
			edits: [],
			projectedEdits: [],
			currentValue: value,
			currentStart: start,
			currentEnd: end
		});
	}
	return tokens;
}
function readBatchTokens(input, origins, preserveLines = false) {
	const tokens = [];
	let offset = 0;
	for (const line of input.split("\n")) {
		let json = false;
		try {
			JSON.parse(line);
			json = true;
		} catch {}
		if (json) for (const token of readScalarTokens(line, origins)) {
			token.deferEncoding = !token.string;
			token.start += offset;
			token.end += offset;
			token.currentStart += offset;
			token.currentEnd += offset;
			tokens.push(token);
		}
		else {
			const previous = tokens.at(-1);
			if (!preserveLines && previous?.raw && previous.end + 1 === offset) {
				previous.value += `\n${line}`;
				previous.currentValue = previous.value;
				previous.end = previous.currentEnd = offset + line.length;
			} else tokens.push({
				raw: true,
				origin: origins.value,
				key: "",
				path: [],
				objectPath: false,
				isKey: false,
				string: false,
				value: line,
				escaped: false,
				start: offset,
				end: offset + line.length,
				currentStart: offset,
				currentEnd: offset + line.length,
				currentValue: line,
				edits: [],
				projectedEdits: []
			});
		}
		offset += line.length + 1;
	}
	return tokens;
}
var JSON_TOKEN_RE;
var init_redact_json_tokens = __esmMin((() => {
	init_src$1();
	JSON_TOKEN_RE = /"(?:[^"\\]|\\.)*"|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|true|false|null|[{}[\]]/g;
}));
//#endregion
//#region src/logging/redact-pattern-runtime.ts
function parseRedactPatternSource(raw) {
	const literal = raw.match(/^\/(.+)\/([gimsuy]*)$/);
	if (!literal) return [raw, "gi"];
	const source = literal[1] ?? "";
	const flags = literal[2] ?? "";
	return [source, flags.includes("g") ? flags : `${flags}g`];
}
function readRedactMatch(args) {
	const inputIndex = args.length > 0 && typeof args[args.length - 1] === "object" && args[args.length - 1] !== null ? args.length - 2 : args.length - 1;
	const offsetIndex = inputIndex - 1;
	const match = typeof args[0] === "string" ? args[0] : "";
	const groups = args.slice(1, offsetIndex).map((value) => typeof value === "string" ? value : "");
	const offset = typeof args[offsetIndex] === "number" ? args[offsetIndex] : -1;
	return {
		match,
		groups,
		input: typeof args[inputIndex] === "string" ? args[inputIndex] : "",
		offset
	};
}
function getIndexedCaptureStart(pattern, input, match, matchOffset, captureIndex) {
	if (!(pattern instanceof RegExp) || matchOffset < 0 || !input) return null;
	try {
		const flags = pattern.flags.includes("d") ? pattern.flags : `${pattern.flags}d`;
		const indexedPattern = new RegExp(pattern.source, flags);
		indexedPattern.lastIndex = matchOffset;
		const indexedMatch = indexedPattern.exec(input);
		const captureIndices = indexedMatch?.indices?.[captureIndex + 1];
		if (!indexedMatch || indexedMatch.index !== matchOffset || indexedMatch[0] !== match) return null;
		if (!captureIndices) return null;
		return captureIndices[0] - matchOffset;
	} catch {
		return null;
	}
}
function hasBackreferenceToGroup(pattern, groupNumber) {
	return new RegExp(String.raw`\\${groupNumber}(?!\d)`).test(pattern.source);
}
function selectSecretCapture(match, groups) {
	const selected = {
		index: -1,
		value: match,
		captureCount: 0
	};
	for (let index = 0; index < groups.length; index++) {
		const value = groups[index];
		if (typeof value === "string" && value.length > 0) {
			selected.index = index;
			selected.value = value;
			selected.captureCount++;
		}
	}
	return selected;
}
function getSecretCaptureStart(pattern, input, match, matchOffset, selected) {
	const indexedTokenStart = getIndexedCaptureStart(pattern, input, match, matchOffset, selected.index);
	if (indexedTokenStart !== null) return indexedTokenStart;
	return pattern instanceof RegExp && selected.captureCount === 1 && selected.index >= 0 && hasBackreferenceToGroup(pattern, selected.index + 1) ? match.indexOf(selected.value) : match.lastIndexOf(selected.value);
}
function* iterateRedactMatches(text, pattern) {
	if (!(pattern instanceof RegExp)) {
		yield* pattern.exec(text);
		return;
	}
	let regex = pattern;
	if (!pattern.global) {
		const cached = globalPatterns.get(pattern);
		regex = cached ?? new RegExp(pattern.source, `${pattern.flags}g`);
		if (!cached) globalPatterns.set(pattern, regex);
	}
	const unicode = regex.unicode || regex.flags.includes("v");
	let cursor = 0;
	while (cursor <= text.length) {
		const previousIndex = regex.lastIndex;
		let match;
		try {
			regex.lastIndex = cursor;
			match = regex.exec(text);
		} finally {
			regex.lastIndex = previousIndex;
		}
		if (!match) return;
		cursor = match.index + match[0].length;
		if (!match[0]) {
			const codePoint = text.codePointAt(cursor);
			cursor += unicode && codePoint !== void 0 && codePoint > 65535 ? 2 : 1;
		}
		yield {
			match: match[0],
			groups: match.slice(1).map((group) => group ?? ""),
			input: text,
			offset: match.index
		};
	}
}
function replaceRedactPattern(text, pattern, replace, replaceRegex) {
	if (pattern instanceof RegExp) return text.replace(pattern, replaceRegex ?? ((...args) => replace(readRedactMatch(args))));
	const parts = [];
	let end = 0;
	for (const match of iterateRedactMatches(text, pattern)) {
		parts.push(text.slice(end, match.offset), replace(match));
		end = match.offset + match.match.length;
	}
	return parts.length ? parts.join("") + text.slice(end) : text;
}
function redactPemBlock(block, marker) {
	const lines = block.split(/\r?\n/).filter(Boolean);
	if (lines.length < 2) return "***";
	return `${lines[0]}\n${marker}\n${lines[lines.length - 1]}`;
}
var globalPatterns;
var init_redact_pattern_runtime = __esmMin((() => {
	globalPatterns = /* @__PURE__ */ new WeakMap();
}));
//#endregion
//#region src/logging/redact-json.ts
function getPatternRedactionEdits(value, pattern, getCapture) {
	const edits = [];
	for (const match of iterateRedactMatches(value, pattern)) {
		const capture = getCapture(match, pattern);
		const edit = capture?.redact({
			start: capture.start,
			end: capture.end,
			value: value.slice(capture.start, capture.end)
		});
		if (edit && edit.end >= edit.start) edits.push(edit);
	}
	return edits;
}
function stringBoundaries(text, token) {
	const boundaries = /* @__PURE__ */ new Map();
	let decoded = 0;
	for (let offset = token.start + 1; offset < token.end - 1; decoded += 1) {
		boundaries.set(offset, decoded);
		offset += text[offset] === "\\" ? text[offset + 1] === "u" ? 6 : 2 : 1;
	}
	boundaries.set(token.end - 1, decoded);
	return boundaries;
}
function decodedBoundary(text, token, offset) {
	if (!token.escaped) return offset - token.start - 1;
	token.boundaries ??= stringBoundaries(text, token);
	return token.boundaries.get(offset);
}
function encodedBoundary(text, token, offset) {
	if (!token.escaped) return token.start + 1 + offset;
	if (!token.encodedBoundaries) {
		token.boundaries ??= stringBoundaries(text, token);
		token.encodedBoundaries = [];
		for (const [encoded, decoded] of token.boundaries) token.encodedBoundaries[decoded] = encoded;
	}
	return expectDefined(token.encodedBoundaries[offset], "decoded JSON edit boundary");
}
function projectMessageEdits(input, tokens, message, getEdits) {
	const parts = new Map(message.parts.map((part) => [part.key, part]));
	const projected = [];
	for (const token of tokens) {
		if (!token.isKey && token.path.length === 1 && token.key === "message") continue;
		const part = token.rootKey === void 0 ? void 0 : parts.get(token.rootKey);
		if (!part) continue;
		if (!part.json && (token.isKey || (part.messageField ? token.path.length !== 2 || token.key !== "message" : token.path.length !== 1))) continue;
		const edits = getEdits(token);
		for (const edit of edits) {
			let start;
			let end;
			let replacement = edit.replacement;
			if (part.json) {
				const base = part.start - expectDefined(token.rootValueStart, "displayed JSON argument");
				if (token.string) {
					start = base + encodedBoundary(input, token, edit.start);
					end = base + encodedBoundary(input, token, edit.end);
					replacement = JSON.stringify(replacement).slice(1, -1);
				} else {
					start = base + token.start;
					end = base + token.end;
					replacement = JSON.stringify(replacement);
				}
			} else {
				start = part.start + edit.start;
				end = part.start + (part.primitiveLength ?? edit.end);
			}
			if (start < message.contentLength) projected.push({
				start,
				end: Math.min(end, message.contentLength),
				replacement,
				scalar: part.json && !token.string
			});
		}
	}
	return projected.toSorted((left, right) => left.start - right.start || left.end - right.end);
}
function firstIntersectingToken(tokens, start) {
	let low = 0;
	let high = tokens.length;
	while (low < high) {
		const middle = low + high >>> 1;
		if (expectDefined(tokens[middle], "bounded JSON token search").currentEnd <= start) low = middle + 1;
		else high = middle;
	}
	return low;
}
function updateCurrentToken(input, token) {
	if (token.raw || token.deferEncoding) {
		token.currentRaw = token.currentValue;
		return;
	}
	const parts = [];
	const encodedEdits = [];
	let cursor = token.start + (token.string ? 1 : 0);
	let encodedLength = 0;
	let decodedShift = 0;
	for (const edit of token.edits) {
		const start = token.string ? encodedBoundary(input, token, edit.start) : token.start + edit.start;
		const end = token.string ? encodedBoundary(input, token, edit.end) : token.start + edit.end;
		const replacement = JSON.stringify(edit.replacement).slice(1, -1);
		const encodedStart = encodedLength + start - cursor;
		const encodedEnd = encodedStart + replacement.length;
		encodedEdits.push({
			start: encodedStart,
			end: encodedEnd,
			decodedStart: edit.start + decodedShift,
			decodedEnd: edit.start + decodedShift + edit.replacement.length,
			sourceEnd: end,
			sourceDecodedEnd: edit.end,
			replacement
		});
		parts.push(input.slice(cursor, start), replacement);
		encodedLength = encodedEnd;
		decodedShift += edit.replacement.length - (edit.end - edit.start);
		cursor = end;
	}
	parts.push(input.slice(cursor, token.end - (token.string ? 1 : 0)));
	token.currentRaw = `"${parts.join("")}"`;
	token.encodedEdits = encodedEdits;
}
function currentDecodedBoundary(input, token, position, replacements) {
	const offset = position - token.currentStart - 1;
	const edits = token.encodedEdits;
	if (!edits) return decodedBoundary(input, token, token.start + 1 + offset);
	let low = 0;
	let high = edits.length;
	while (low < high) {
		const middle = low + high >>> 1;
		if (expectDefined(edits[middle], "current encoded edit").end < offset) low = middle + 1;
		else high = middle;
	}
	const edit = edits[low];
	if (edit && offset >= edit.start) {
		const within = offset - edit.start;
		if (!edit.replacement.includes("\\")) return edit.decodedStart + within;
		let boundaries = replacements.get(edit.replacement);
		if (!boundaries) {
			boundaries = /* @__PURE__ */ new Map();
			let decoded = 0;
			for (let encoded = 0; encoded < edit.replacement.length; decoded += 1) {
				boundaries.set(encoded, decoded);
				encoded += edit.replacement[encoded] === "\\" ? edit.replacement[encoded + 1] === "u" ? 6 : 2 : 1;
			}
			boundaries.set(edit.replacement.length, decoded);
			replacements.set(edit.replacement, boundaries);
		}
		const decoded = boundaries.get(within);
		return decoded === void 0 ? void 0 : edit.decodedStart + decoded;
	}
	const previous = edits[low - 1];
	const decoded = decodedBoundary(input, token, offset + (previous ? previous.sourceEnd - previous.end : token.start + 1));
	return decoded === void 0 ? void 0 : decoded + (previous ? previous.decodedEnd - previous.sourceDecodedEnd : 0);
}
function commitPatternEdits(token) {
	const pending = token.pending;
	token.pending = void 0;
	if (!pending) return false;
	const edits = mergeRedactionEdits(pending);
	const value = applyRedactionEdits(token.currentValue, edits);
	if (value === token.currentValue) return false;
	token.edits = composeRedactionEdits(token.value.length, token.edits, edits);
	token.currentValue = value;
	return true;
}
function changedRedactionEdits(previous, current) {
	let index = 0;
	return current.filter((edit) => {
		while (previous[index] && expectDefined(previous[index], "previous configured edit").start < edit.start) index += 1;
		const before = previous[index];
		return !before || before.start !== edit.start || before.end !== edit.end || before.replacement !== edit.replacement;
	});
}
function commitOriginalEdits(token, edits) {
	if (edits.length === 0) return false;
	const combined = mergeRedactionEdits([...token.edits, ...edits]);
	const value = applyRedactionEdits(token.value, combined);
	if (value === token.currentValue) return false;
	token.edits = combined;
	token.currentValue = value;
	return true;
}
function updateCurrentRecord(input, current, tokens, changed) {
	const parts = [];
	let cursor = 0;
	let shift = 0;
	for (const token of tokens) {
		const start = token.currentStart;
		const end = token.currentEnd;
		if (changed.has(token)) {
			updateCurrentToken(input, token);
			const raw = expectDefined(token.currentRaw, "changed JSON token");
			parts.push(current.slice(cursor, start), raw);
			cursor = end;
			token.currentStart = start + shift;
			shift += raw.length - (end - start);
		} else token.currentStart = start + shift;
		token.currentEnd = end + shift;
	}
	parts.push(current.slice(cursor));
	return parts.join("");
}
function projectedStringEnd(input, tokens, message, token, start, end) {
	const jsonParts = new Set(message.parts.filter((part) => part.json).map((part) => part.key));
	const spans = projectMessageEdits(input, tokens, message, (source) => source.string && !source.isKey && source.rootKey !== void 0 && jsonParts.has(source.rootKey) ? [{
		start: 0,
		end: source.value.length,
		replacement: ""
	}] : []).filter((span) => span.end < message.contentLength);
	const containing = rebaseRedactionEdits(token.edits, spans).filter((span) => span.start <= start && start < span.end && end <= span.end);
	return containing.length === 1 ? expectDefined(containing[0], "displayed source string").end : token.currentValue.length;
}
function redactJsonRecord(input, origins, patternPhases, getCapture, legacyFieldEdits, fieldEdits, prepEdits, skipDecodedPatterns, message, batch) {
	let tokens = batch ? [] : readScalarTokens(input, origins);
	const messageToken = message ? tokens.find((token) => !token.isKey && token.path.length === 1 && token.key === "message") : void 0;
	const replacementBoundaries = /* @__PURE__ */ new Map();
	let projectedMessageEdits = [];
	let projectedMessageValue = messageToken?.value ?? "";
	let current = input;
	const prepared = /* @__PURE__ */ new Set();
	for (const token of tokens) if (commitOriginalEdits(token, prepEdits(token))) prepared.add(token);
	if (prepared.size > 0) current = updateCurrentRecord(input, current, tokens, prepared);
	const decodedTokens = tokens.filter((token) => !token.isKey && token.string && !skipDecodedPatterns(token, token.currentValue));
	const projectMessage = () => {
		if (!messageToken || !message) return false;
		const projected = projectMessageEdits(input, tokens, message, (token) => {
			const edits = changedRedactionEdits(token.projectedEdits, token.edits);
			token.projectedEdits = token.edits;
			return edits;
		});
		if (projected.length === 0) return false;
		const sourceEdits = rebaseRedactionEdits(projectedMessageEdits, projected);
		const messageEdits = rebaseRedactionEdits(messageToken.edits, projected);
		let generatedIndex = 0;
		for (let index = 0; index < messageEdits.length; index += 1) {
			const edit = expectDefined(messageEdits[index], "projected message edit");
			const sourceEdit = expectDefined(sourceEdits[index], "projected source edit");
			const projection = expectDefined(projected[index], "source projection");
			while (messageToken.edits[generatedIndex] && expectDefined(messageToken.edits[generatedIndex], "generated message span").start < projection.start) generatedIndex += 1;
			const generated = messageToken.edits[generatedIndex];
			const scalarPromotion = projection.scalar && generated?.start === projection.start && generated.end === projection.end && edit.replacement === JSON.stringify(generated.replacement);
			const before = messageToken.currentValue.slice(edit.start, edit.end);
			if (!scalarPromotion && before !== edit.replacement && before !== projectedMessageValue.slice(sourceEdit.start, sourceEdit.end)) edit.replacement = projection.scalar ? JSON.stringify("***") : "***";
		}
		messageToken.pending = messageEdits;
		projectedMessageValue = applyRedactionEdits(projectedMessageValue, sourceEdits);
		projectedMessageEdits = composeRedactionEdits(messageToken.value.length, projectedMessageEdits, sourceEdits);
		return commitPatternEdits(messageToken);
	};
	for (const [phase, groups] of patternPhases.entries()) {
		const changed = /* @__PURE__ */ new Set();
		const pending = /* @__PURE__ */ new Set();
		const add = (token, edit) => {
			(token.pending ??= []).push(edit);
			pending.add(token);
		};
		for (const group of groups) {
			if (group.couldMatch && !group.couldMatch(current)) continue;
			for (const pattern of group.patterns) {
				if (phase === 0) for (const token of decodedTokens) for (const edit of getPatternRedactionEdits(token.currentValue, pattern, getCapture)) add(token, edit);
				else for (const match of iterateRedactMatches(current, pattern)) {
					const capture = getCapture(match, pattern);
					if (!capture || capture.end < capture.start) continue;
					if (batch && tokens.length === 0) tokens = readBatchTokens(input, origins, batch.preserveLines);
					for (let index = firstIntersectingToken(tokens, capture.start); index < tokens.length; index += 1) {
						const token = expectDefined(tokens[index], "serialized capture token");
						if (token.currentStart >= capture.end) break;
						const unquoted = token.raw || token.deferEncoding;
						const padding = unquoted ? 0 : 1;
						const captureInsideToken = capture.start >= token.currentStart + padding && capture.end <= token.currentEnd - padding;
						if (batch && token.isKey && !captureInsideToken) continue;
						const value = token.currentValue;
						if (!token.raw && !token.string && token.edits.length === 0) {
							add(token, {
								start: 0,
								end: value.length,
								replacement: "***"
							});
							continue;
						}
						let startPosition = Math.max(capture.start, token.currentStart + padding);
						let start = unquoted ? startPosition - token.currentStart : currentDecodedBoundary(input, token, startPosition, replacementBoundaries);
						let endPosition = Math.min(capture.end, token.currentEnd - padding);
						let end = unquoted ? endPosition - token.currentStart : currentDecodedBoundary(input, token, endPosition, replacementBoundaries);
						if (start === void 0 || end === void 0) {
							while (start === void 0) start = currentDecodedBoundary(input, token, --startPosition, replacementBoundaries);
							while (end === void 0) end = currentDecodedBoundary(input, token, ++endPosition, replacementBoundaries);
							const maskEnd = token === messageToken && message ? projectedStringEnd(input, tokens, message, token, start, end) : value.length;
							add(token, {
								start,
								end: maskEnd,
								replacement: "***"
							});
							continue;
						}
						if (end < start || batch && end === start) continue;
						const { start: captureStart, end: captureEnd } = capture;
						const edit = capture.redact({
							start,
							end,
							value: current.slice(Math.max(captureStart, token.currentStart + padding), Math.min(captureEnd, token.currentEnd - padding))
						});
						if (!edit) continue;
						let replacement = "***";
						if (captureInsideToken) try {
							replacement = unquoted ? edit.replacement : JSON.parse(`"${edit.replacement}"`);
						} catch {}
						add(token, {
							...edit,
							replacement
						});
					}
				}
				if (pending.size === 0) continue;
				for (const token of pending) if (!commitPatternEdits(token)) pending.delete(token);
				else if (phase === 0) changed.add(token);
				if (phase !== 0 && pending.size > 0) current = updateCurrentRecord(input, current, tokens, pending);
				pending.clear();
			}
		}
		for (const token of tokens) if (phase === 0) {
			token.pending = legacyFieldEdits(token, token.currentValue);
			if (commitPatternEdits(token)) changed.add(token);
		} else if (commitOriginalEdits(token, fieldEdits(token))) changed.add(token);
		if ((phase !== 0 || prepared.size > 0 || changed.size > 0) && projectMessage() && messageToken) changed.add(messageToken);
		if (changed.size > 0) current = updateCurrentRecord(input, current, tokens, changed);
	}
	if (messageToken && message) {
		const finished = message.finish(messageToken.currentValue);
		if (finished !== messageToken.currentValue) return applyRedactionEdits(current, [{
			start: messageToken.currentStart,
			end: messageToken.currentEnd,
			replacement: JSON.stringify(finished)
		}]);
	}
	return applyRedactionEdits(current, tokens.flatMap((token) => token.deferEncoding && token.edits.length > 0 ? [{
		start: token.currentStart,
		end: token.currentEnd,
		replacement: JSON.stringify(token.currentValue)
	}] : []));
}
var init_redact_json = __esmMin((() => {
	init_src$1();
	init_redact_edit_composition();
	init_redact_json_tokens();
	init_redact_pattern_runtime();
}));
//#endregion
//#region src/logging/redact-pem.ts
function createState() {
	return {
		scanner: {
			offset: 0,
			phase: "search",
			dashes: 0,
			keyword: "BEGIN ",
			keywordOffset: 0,
			start: 0,
			suffix: ""
		},
		matchEnd: 0
	};
}
function resetScanner(scanner, char) {
	scanner.phase = "search";
	scanner.dashes = char === "-" ? 1 : 0;
	scanner.suffix = "";
}
function* readDelimiters(text, scanner) {
	for (let index = 0; index < text.length; index += 1) {
		if (scanner.phase === "search" && scanner.dashes === 0) {
			const nextDash = text.indexOf("-", index);
			if (nextDash === -1) {
				scanner.offset += text.length - index;
				return;
			}
			scanner.offset += nextDash - index;
			index = nextDash;
		}
		const code = text.charCodeAt(index);
		const char = code >= 97 && code <= 122 ? String.fromCharCode(code - 32) : text.charAt(index);
		const offset = scanner.offset++;
		switch (scanner.phase) {
			case "search":
				if (char === "-") scanner.dashes = Math.min(5, scanner.dashes + 1);
				else if (scanner.dashes === 5 && (char === "B" || char === "E")) {
					scanner.phase = "keyword";
					scanner.keyword = char === "B" ? "BEGIN " : "END ";
					scanner.keywordOffset = 1;
					scanner.start = offset - 5;
				} else scanner.dashes = 0;
				break;
			case "keyword":
				if (char !== scanner.keyword.charAt(scanner.keywordOffset)) resetScanner(scanner, char);
				else if (++scanner.keywordOffset === scanner.keyword.length) {
					scanner.phase = "label";
					scanner.suffix = "";
				}
				break;
			case "label":
				if (char >= "A" && char <= "Z" || char === " ") scanner.suffix = (scanner.suffix + char).slice(-11);
				else if (char === "-" && scanner.suffix === "PRIVATE KEY") {
					scanner.phase = "close";
					scanner.dashes = 1;
				} else resetScanner(scanner, char);
				break;
			case "close": if (char !== "-") resetScanner(scanner, char);
			else if (++scanner.dashes === 5) {
				scanner.phase = "search";
				scanner.suffix = "";
				yield {
					kind: scanner.keyword === "BEGIN " ? "begin" : "end",
					start: scanner.start,
					end: offset + 1
				};
			}
		}
	}
}
function consumeDelimiter(state, delimiter) {
	if (!state.open) {
		if (delimiter.kind === "begin" && delimiter.start >= state.matchEnd) state.open = {
			start: delimiter.start,
			end: delimiter.end
		};
		return;
	}
	if (delimiter.kind !== "end" || delimiter.start <= state.open.end) return;
	const block = {
		start: state.open.start,
		end: delimiter.end,
		bodyStart: state.open.end,
		bodyEnd: delimiter.start
	};
	state.open = void 0;
	state.matchEnd = delimiter.end;
	return block;
}
function* matchPem(text, context, incomplete) {
	const state = {
		...context,
		scanner: { ...context.scanner },
		open: context.open && { ...context.open }
	};
	const origin = state.scanner.offset;
	for (const delimiter of readDelimiters(text, state.scanner)) {
		const block = consumeDelimiter(state, delimiter);
		if (!block) continue;
		const start = Math.max(0, (incomplete ? block.bodyStart : block.start) - origin);
		const end = (incomplete ? block.bodyEnd : block.end) - origin;
		if (end <= start) continue;
		yield {
			match: text.slice(start, end),
			groups: [],
			input: text,
			offset: start,
			...incomplete ? { replacement: "…redacted…" } : {}
		};
	}
	if (incomplete && state.open) {
		const start = Math.max(0, state.open.end - origin);
		if (start < text.length) yield {
			match: text.slice(start),
			groups: [],
			input: text,
			offset: start,
			replacement: "…redacted…"
		};
	}
}
var PEM_REDACT_PATTERN_SOURCE, PEM_REDACT_MATCHER;
var init_redact_pem = __esmMin((() => {
	PEM_REDACT_PATTERN_SOURCE = String.raw`-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]+?-----END [A-Z ]*PRIVATE KEY-----`;
	PEM_REDACT_MATCHER = {
		source: PEM_REDACT_PATTERN_SOURCE,
		exec(text) {
			return matchPem(text, createState(), false);
		},
		createContext() {
			let whenClosed = false;
			let whenOpen = true;
			return {
				prepend() {
					const closed = createState();
					const open = createState();
					open.open = {
						start: -1,
						end: -1
					};
					return {
						consume(text) {
							for (const delimiter of readDelimiters(text, closed.scanner)) {
								consumeDelimiter(closed, delimiter);
								consumeDelimiter(open, delimiter);
							}
						},
						finish() {
							const nextClosed = closed.open ? whenOpen : whenClosed;
							const nextOpen = open.open ? whenOpen : whenClosed;
							whenClosed = nextClosed;
							whenOpen = nextOpen;
							return whenClosed === whenOpen;
						}
					};
				},
				pattern: {
					source: PEM_REDACT_PATTERN_SOURCE,
					exec(text) {
						const state = createState();
						if (whenClosed) state.open = {
							start: -1,
							end: -1
						};
						return matchPem(text, state, true);
					}
				}
			};
		}
	};
}));
//#endregion
//#region src/logging/redact-patterns.ts
function isAwsValueCharacter(char) {
	const code = char.charCodeAt(0);
	return code >= 65 && code <= 90 || code >= 97 && code <= 122 || code >= 48 && code <= 57 || char === "/" || char === "+" || char === "=";
}
function couldMatchAwsSecretAccessKey(text) {
	return text.length >= 40 && AWS_SECRET_ACCESS_KEY_RUN_RE.test(text) && AWS_SECRET_ACCESS_KEY_VALUE_RE.test(text);
}
function* matchAwsSecretAccessKeys(text) {
	if (!couldMatchAwsSecretAccessKey(text)) return;
	const closingDelimiters = {
		"\"": "\"",
		"'": "'",
		"`": "`",
		"<": ">",
		"(": ")",
		"[": "]",
		"{": "}"
	};
	let runStart = -1;
	let schemeStart = -1;
	let url;
	let backslashes = 0;
	const runs = [];
	for (let index = 0; index <= text.length; index++) {
		const char = text[index] ?? "";
		const whitespace = index === text.length || AWS_VALUE_WHITESPACE_RE.test(char);
		const escapeDepth = backslashes;
		backslashes = char === "\\" ? backslashes + 1 : 0;
		if (char && isAwsValueCharacter(char)) {
			if (runStart === -1) runStart = index;
		} else if (runStart !== -1) {
			if (index - runStart === 40) runs.push({
				start: runStart,
				end: index,
				origin: runStart,
				url
			});
			else if (index - runStart > 40 && char === "@" && text[index - 41] === "/") runs.push({
				start: index - 40,
				end: index,
				origin: runStart,
				url
			});
			runStart = -1;
		}
		if (whitespace) {
			if (url) url.end = Math.min(url.end, index);
			for (const run of runs) {
				const context = run.url;
				const publicUrl = context && !context.hasAt && context.portValid && (context.portStart === -1 || (context.authorityEnd === -1 ? context.end : context.authorityEnd) > context.portStart + 1);
				const before = text[run.start - 1] ?? "";
				const after = text[run.end] ?? "";
				const slashCredential = run.start !== run.origin;
				const portCredential = context && context.portStart !== -1 && run.origin === context.portStart + 1 && context.authorityEnd > run.origin && run.end > context.authorityEnd && after === "@";
				if (!slashCredential && (before === "_" || isAwsValueCharacter(before)) || after === "_" || text.slice(run.origin - 8, run.origin) === ";base64," || publicUrl && !portCredential && run.start >= context.start && run.end <= context.end) continue;
				const match = text.slice(run.start, run.end);
				if (AWS_SECRET_ACCESS_KEY_VALUE_RE.test(match)) yield {
					match,
					groups: [match],
					input: text,
					offset: run.start
				};
			}
			runs.length = 0;
			schemeStart = -1;
			url = void 0;
			continue;
		}
		if (url && index >= url.start) {
			if (char === url.closing && escapeDepth === url.closingEscapeDepth) {
				url.end = Math.min(url.end, index);
				url = void 0;
			} else {
				if ("?#\"'<>`|()[]{}".includes(char)) url.end = Math.min(url.end, index);
				url.queryOrFragment ||= char === "?" || char === "#";
				if (url.authorityEnd === -1) {
					url.hasAt ||= char === "@";
					if ("/?#".includes(char)) url.authorityEnd = index;
					else if (index < url.end) {
						if (char === ":") {
							url.portValid &&= url.portStart === -1;
							url.portStart = index;
						} else if (url.portStart !== -1 && (char < "0" || char > "9")) url.portValid = false;
					}
				}
			}
		}
		if (AWS_URL_SCHEME_CHARACTER_RE.test(char)) {
			if (schemeStart === -1) schemeStart = index;
		} else {
			if ((!url || index >= url.end && !url.queryOrFragment) && char === ":" && text.startsWith("//", index + 1) && schemeStart !== -1 && AWS_URL_SCHEME_START_RE.test(text[schemeStart])) {
				const opening = text[schemeStart - 1];
				let closingEscapeDepth = 0;
				for (let offset = schemeStart - 2; offset >= 0 && text[offset] === "\\"; offset--) closingEscapeDepth++;
				url = {
					start: index + 3,
					end: text.length,
					authorityEnd: -1,
					portStart: -1,
					portValid: true,
					hasAt: false,
					queryOrFragment: false,
					closing: opening ? closingDelimiters[opening] : void 0,
					closingEscapeDepth
				};
			}
			schemeStart = -1;
		}
	}
}
var PAYMENT_CREDENTIAL_ENV_KEYS, PAYMENT_CREDENTIAL_QUERY_KEYS, PAYMENT_CREDENTIAL_JSON_KEYS, AWS_SECRET_ACCESS_KEY_FIELD_KEYS, AUTH_QUERY_KEYS, FORM_BODY_FIRST_PAIR_KEYS, STANDALONE_ASSIGNMENT_SECRET_KEYS, CONFIG_ASSIGNMENT_SECRET_KEYS, CONFIG_DIRECT_ASSIGNMENT_SECRET_KEYS, CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_SECRET_KEYS, CLI_SECRET_FLAG_KEYS, BODY_SECRET_KEYS, FORM_BODY_KEY_INVISIBLE_CHARS, ENV_ASSIGNMENT_REDACT_PATTERN, ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN, STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN, STANDALONE_ASSIGNMENT_REDACT_PATTERN, CONFIG_QUOTED_ASSIGNMENT_SECRET_KEYS, CONFIG_QUOTED_ASSIGNMENT_REDACT_PATTERN, CONFIG_ASSIGNMENT_REDACT_PATTERN, CONFIG_DIRECT_ASSIGNMENT_REDACT_PATTERN, CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_REDACT_PATTERN, CONFIG_NAMESPACED_ASSIGNMENT_REDACT_PATTERN, STRUCTURED_JSON_SECRET_REDACT_PATTERN, STRUCTURED_JSON_PAYMENT_REDACT_PATTERN, AMBIGUOUS_QUOTED_SECRET_FIELD_REDACT_PATTERN, AMBIGUOUS_QUOTED_AUTH_FIELD_REDACT_PATTERN, BASE64_SAFE_TOKEN_BOUNDARY, IDENTIFIER_SAFE_TOKEN_BOUNDARY, AWS_SECRET_ACCESS_KEY_VALUE_RE, AWS_SECRET_ACCESS_KEY_RUN_RE, AWS_VALUE_WHITESPACE_RE, AWS_URL_SCHEME_CHARACTER_RE, AWS_URL_SCHEME_START_RE, AWS_SECRET_ACCESS_KEY_MATCHER, TELEGRAM_BOT_TOKEN_REDACT_PATTERN, TELEGRAM_TOKEN_REDACT_PATTERN, CREDENTIAL_STYLE_HEADER_KEYS, GATEWAY_SECURITY_HEADER_KEYS, CREDENTIAL_HEADER_FIELD_RE, LOG_HEADER_BOUNDARY_PATTERN, CREDENTIAL_STYLE_COLON_HEADER_REDACT_PATTERN, CREDENTIAL_STYLE_EQUALS_ASSIGNMENT_REDACT_PATTERN, GATEWAY_SECURITY_COLON_HEADER_REDACT_PATTERN, GATEWAY_SECURITY_EQUALS_ASSIGNMENT_REDACT_PATTERN, FORM_AWARE_EQUALS_ASSIGNMENT_PATTERN_SOURCES, HTTP_AUTH_HEADER_REDACT_PATTERNS, AUTHORIZATION_BEARER_REDACT_PATTERN, AUTHORIZATION_BASIC_REDACT_PATTERN, AUTHORIZATION_BOT_REDACT_PATTERN, STANDALONE_BEARER_REDACT_PATTERN, SHELL_REFERENCE_PRESERVING_PATTERN_SOURCES, CHUNK_UNSAFE_PATTERN_SOURCES, DEFAULT_REDACT_FIELD_PATTERNS, VENDOR_TOKEN_REDACT_PATTERNS, DEFAULT_REDACT_STRING_PATTERNS, DEFAULT_REDACT_PATTERNS, TOOL_PAYLOAD_AMBIGUOUS_ASSIGNMENT_PATTERNS, TOOL_PAYLOAD_REDACT_PATTERNS;
var init_redact_patterns = __esmMin((() => {
	init_structured_auth_redaction();
	init_redact_pem();
	PAYMENT_CREDENTIAL_ENV_KEYS = String.raw`CARD[_-]?NUMBER|CARD[_-]?CVC|CARD[_-]?CVV|CVC|CVV|SECURITY[_-]?CODE|PAYMENT[_-]?CREDENTIAL|SHARED[_-]?PAYMENT[_-]?TOKEN`;
	PAYMENT_CREDENTIAL_QUERY_KEYS = String.raw`card[-_]?number|card[-_]?cvc|card[-_]?cvv|cvc|cvv|security[-_]?code|payment[-_]?credential|shared[-_]?payment[-_]?token`;
	PAYMENT_CREDENTIAL_JSON_KEYS = String.raw`cardNumber|card_number|cardCvc|card_cvc|cardCvv|card_cvv|cvc|cvv|securityCode|security_code|paymentCredential|payment_credential|sharedPaymentToken|shared_payment_token`;
	AWS_SECRET_ACCESS_KEY_FIELD_KEYS = String.raw`aws[-_]?secret[-_]?access[-_]?key|awsSecretAccessKey|SecretAccessKey`;
	AUTH_QUERY_KEYS = String.raw`access[-_]?token|auth[-_]?token|hook[-_]?token|refresh[-_]?token|id[-_]?token|api[-_]?key|apikey|client[-_]?secret|app[-_]?secret|private[-_]?key|${AWS_SECRET_ACCESS_KEY_FIELD_KEYS}|credential|authorization|token|key|secret|password|pass|passwd|auth|jwt|session|code|signature|x[-_]?amz[-_]?(?:signature|security[-_]?token)`;
	FORM_BODY_FIRST_PAIR_KEYS = String.raw`${AUTH_QUERY_KEYS}|app[-_]?secret|credential|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
	STANDALONE_ASSIGNMENT_SECRET_KEYS = String.raw`access_token|refresh_token|id_token|auth[-_]?token|hook[-_]?token|api[-_]?key|client[-_]?secret|app[-_]?secret|private[-_]?key|authorization|jwt|token|secret|password|pass|passwd|credential|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
	CONFIG_ASSIGNMENT_SECRET_KEYS = String.raw`access[-_]?token|refresh[-_]?token|id[-_]?token|auth[-_]?token|hook[-_]?token|api[-_]?(?:key|secret)|client[-_]?secret|app[-_]?secret|private[-_]?key|secret[-_]?key|key[-_]?material|authorization|jwt|token|secret|password|passphrase|pass|passwd|credential|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
	CONFIG_DIRECT_ASSIGNMENT_SECRET_KEYS = String.raw`access-token|refresh-token|id-token|auth-token|hook-token|api[-_]?(?:key|secret)|secret[-_]?key|key[-_]?material|passphrase`;
	CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_SECRET_KEYS = String.raw`password|passphrase|pass|passwd`;
	CLI_SECRET_FLAG_KEYS = String.raw`${AWS_SECRET_ACCESS_KEY_FIELD_KEYS}|api[-_]?key|hook[-_]?token|access[-_]?token|refresh[-_]?token|id[-_]?token|token|secret|password|passwd|credential|private[-_]?key|client[-_]?secret|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
	BODY_SECRET_KEYS = /* @__PURE__ */ new Set([
		"access_token",
		"auth_token",
		"awssecretaccesskey",
		"aws_secret_access_key",
		"hook_token",
		"refresh_token",
		"id_token",
		"token",
		"api_key",
		"apikey",
		"client_secret",
		"app_secret",
		"password",
		"pass",
		"passwd",
		"auth",
		"jwt",
		"session",
		"code",
		"signature",
		"x_amz_signature",
		"x_amz_security_token",
		"secret",
		"secretaccesskey",
		"credential",
		"private_key",
		"authorization",
		"key",
		"card_number",
		"card_cvc",
		"card_cvv",
		"cvc",
		"cvv",
		"security_code",
		"payment_credential",
		"shared_payment_token"
	]);
	FORM_BODY_KEY_INVISIBLE_CHARS = String.raw`\p{C}\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000\u115F\u1160\u3164\uFFA0`;
	ENV_ASSIGNMENT_REDACT_PATTERN = String.raw`/\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|${PAYMENT_CREDENTIAL_ENV_KEYS})\b\s*[=:]\s*(["']?)([^\s"'\\]+)\1/g`;
	ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN = String.raw`/\b[A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD|${PAYMENT_CREDENTIAL_ENV_KEYS})\b\s*[=:]\s*\\+(["'])([^\s"'\\]+)\\+\1/g`;
	STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN = String.raw`(^|[\s,;({\["])(?:${STANDALONE_ASSIGNMENT_SECRET_KEYS})=(["'\x60])((?:(?!\2)[^\r\n])+)\2`;
	STANDALONE_ASSIGNMENT_REDACT_PATTERN = String.raw`(^|[\s,;({\["])(?:${STANDALONE_ASSIGNMENT_SECRET_KEYS})=(["'\x60]?[^\s&#"'\x60<>]+)`;
	CONFIG_QUOTED_ASSIGNMENT_SECRET_KEYS = String.raw`access[-_]?token|refresh[-_]?token|id[-_]?token|auth[-_]?token|hook[-_]?token|api[-_]?(?:key|secret)|secret[-_]?key|key[-_]?material|authorization|jwt|token|secret|password|passphrase|pass|passwd|${PAYMENT_CREDENTIAL_QUERY_KEYS}`;
	CONFIG_QUOTED_ASSIGNMENT_REDACT_PATTERN = String.raw`/(^|[\s,{])(?:(?:${CONFIG_QUOTED_ASSIGNMENT_SECRET_KEYS})(?:\s*:\s*|\s+=\s*|=\s*)|[a-z0-9][a-z0-9._-]{0,79}[-_](?:${CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_SECRET_KEYS})\s*[:=]\s*|[a-z0-9_.-]{1,80}\.(?:${CONFIG_ASSIGNMENT_SECRET_KEYS})\s*[:=]\s*)(["'\x60])((?:(?!\2)[^\r\n])+)\2/g`;
	CONFIG_ASSIGNMENT_REDACT_PATTERN = String.raw`/(^|[\s,{])(?:${CONFIG_ASSIGNMENT_SECRET_KEYS})(?:\s*:\s*|\s+=\s*|=\s+)([^\s#"'\x60<>]+)/g`;
	CONFIG_DIRECT_ASSIGNMENT_REDACT_PATTERN = String.raw`/(^|[\s,{])(?:${CONFIG_DIRECT_ASSIGNMENT_SECRET_KEYS})=([^\s#"'\x60<>]+)/g`;
	CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_REDACT_PATTERN = String.raw`/(^|[\s,{])[a-z0-9][a-z0-9._-]{0,79}[-_](?:${CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_SECRET_KEYS})\s*[:=]\s*([^\s#"'\x60<>]+)/g`;
	CONFIG_NAMESPACED_ASSIGNMENT_REDACT_PATTERN = String.raw`/(^|[\s,{])[a-z0-9_.-]{1,80}\.(?:${CONFIG_ASSIGNMENT_SECRET_KEYS})\s*[:=]\s*([^\s#"'\x60<>]+)/g`;
	STRUCTURED_JSON_SECRET_REDACT_PATTERN = String.raw`"(?:apiKey|api_key|apiToken|api_token|bearerToken|bearer_token|token|secret|password|passwd|${AWS_SECRET_ACCESS_KEY_FIELD_KEYS}|credential|authorization|proxy-authorization|cookie|set-cookie|x-api-key|x-auth-token|accessToken|access_token|refreshToken|refresh_token|idToken|id_token|authToken|auth_token|clientSecret|client_secret|privateKey|private_key|secret_value|raw_secret|secret_input|key_material)"\s*:\s*"([^"]+)"`;
	STRUCTURED_JSON_PAYMENT_REDACT_PATTERN = String.raw`"(?:${PAYMENT_CREDENTIAL_JSON_KEYS})"\s*:\s*"([^"]+)"`;
	AMBIGUOUS_QUOTED_SECRET_FIELD_REDACT_PATTERN = String.raw`(^|[\s,{])["']?(?:api[-_]key|access[-_]token|refresh[-_]token|id[-_]token|authToken|auth[-_]token|clientSecret|client[-_]secret|appSecret|app[-_]secret|private[-_]key|credential|authorization|secret[-_]value|raw[-_]secret|secret[-_]input|key[-_]material)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2`;
	AMBIGUOUS_QUOTED_AUTH_FIELD_REDACT_PATTERN = String.raw`(^|[\s,{])["']?(?:authorization|proxy-authorization|cookie|set-cookie|x-api-key|x-auth-token)["']?\s*[:=]\s*(["'])([^"'\r\n]+)\2`;
	BASE64_SAFE_TOKEN_BOUNDARY = String.raw`(^|[^A-Za-z0-9])(?<!;base64,[A-Za-z0-9+/=]*)`;
	IDENTIFIER_SAFE_TOKEN_BOUNDARY = String.raw`(^|[^A-Za-z0-9_])`;
	AWS_SECRET_ACCESS_KEY_VALUE_RE = /(?=[A-Za-z0-9/+=]{0,39}[A-Z])(?=[A-Za-z0-9/+=]{0,39}[a-z])(?=[A-Za-z0-9/+=]{0,39}[0-9/+=])(?=[A-Za-z0-9/+=]{0,39}[G-Zg-z/+=])[A-Za-z0-9/+=]{40}/u;
	AWS_SECRET_ACCESS_KEY_RUN_RE = /[A-Za-z0-9/+=]{40}/u;
	AWS_VALUE_WHITESPACE_RE = /\s/;
	AWS_URL_SCHEME_CHARACTER_RE = /[A-Za-z0-9+.-]/;
	AWS_URL_SCHEME_START_RE = /[A-Za-z]/;
	AWS_SECRET_ACCESS_KEY_MATCHER = Object.freeze({
		source: "aws-secret-access-key",
		exec: matchAwsSecretAccessKeys,
		couldMatch: couldMatchAwsSecretAccessKey
	});
	TELEGRAM_BOT_TOKEN_REDACT_PATTERN = String.raw`\bbot(\d{6,}:[A-Za-z0-9_-]{20,})\b`;
	TELEGRAM_TOKEN_REDACT_PATTERN = String.raw`\b(\d{6,}:[A-Za-z0-9_-]{20,})\b`;
	CREDENTIAL_STYLE_HEADER_KEYS = "x-goog-api-key|api-key|apikey|x-api-token|x-access-token";
	GATEWAY_SECURITY_HEADER_KEYS = "X-OpenClaw-Token|x-pomerium-jwt-assertion|X-Api-Key|X-Auth-Token";
	CREDENTIAL_HEADER_FIELD_RE = new RegExp(`^(?:${CREDENTIAL_STYLE_HEADER_KEYS}|${GATEWAY_SECURITY_HEADER_KEYS})$`, "i");
	LOG_HEADER_BOUNDARY_PATTERN = String.raw`(^|[^A-Za-z0-9_?&-]|\\{1,64}[rn])`;
	CREDENTIAL_STYLE_COLON_HEADER_REDACT_PATTERN = String.raw`${LOG_HEADER_BOUNDARY_PATTERN}(?:${CREDENTIAL_STYLE_HEADER_KEYS})${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*:${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}([^\s\\"',;]+)`;
	CREDENTIAL_STYLE_EQUALS_ASSIGNMENT_REDACT_PATTERN = String.raw`${LOG_HEADER_BOUNDARY_PATTERN}(?:${CREDENTIAL_STYLE_HEADER_KEYS})${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*=${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}([^\s\\"',;]+)`;
	GATEWAY_SECURITY_COLON_HEADER_REDACT_PATTERN = String.raw`${LOG_HEADER_BOUNDARY_PATTERN}(?:${GATEWAY_SECURITY_HEADER_KEYS})\s*:\s*([^\s"',;]+)`;
	GATEWAY_SECURITY_EQUALS_ASSIGNMENT_REDACT_PATTERN = String.raw`${LOG_HEADER_BOUNDARY_PATTERN}(?:${GATEWAY_SECURITY_HEADER_KEYS})\s*=\s*([^\s"',;]+)`;
	FORM_AWARE_EQUALS_ASSIGNMENT_PATTERN_SOURCES = /* @__PURE__ */ new Set([CREDENTIAL_STYLE_EQUALS_ASSIGNMENT_REDACT_PATTERN, GATEWAY_SECURITY_EQUALS_ASSIGNMENT_REDACT_PATTERN]);
	HTTP_AUTH_HEADER_REDACT_PATTERNS = [
		String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Proxy-Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`,
		String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Proxy-Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})[ \t]*(?=${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?:$|[,;)}\]]|\r?\n(?![ \t])))`,
		String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?!(?:Bearer|Basic|Bot)(?=${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}))${HTTP_AUTH_SCHEME_PATTERN}${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`,
		String.raw`${HTTP_AUTH_HEADER_BOUNDARY_PATTERN}Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_OPTIONAL_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?!(?:Bearer|Basic|Bot)(?=${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}))(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})[ \t]*(?=${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}(?:$|[,;)}\]]|\r?\n(?![ \t])))`,
		CREDENTIAL_STYLE_COLON_HEADER_REDACT_PATTERN,
		CREDENTIAL_STYLE_EQUALS_ASSIGNMENT_REDACT_PATTERN
	];
	AUTHORIZATION_BEARER_REDACT_PATTERN = String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Bearer${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`;
	AUTHORIZATION_BASIC_REDACT_PATTERN = String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Basic${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`;
	AUTHORIZATION_BOT_REDACT_PATTERN = String.raw`Authorization${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}[ \t]*[:=]${HTTP_AUTH_LEGACY_VALUE_WHITESPACE_PATTERN}${HTTP_AUTH_SERIALIZED_QUOTE_PATTERN}Bot${HTTP_AUTH_REQUIRED_VALUE_WHITESPACE_PATTERN}(${HTTP_AUTH_OPAQUE_CREDENTIAL_PATTERN})`;
	STANDALONE_BEARER_REDACT_PATTERN = String.raw`\bBearer\s+([-A-Za-z0-9._~+/=]{18,})(?![-A-Za-z0-9._~+/=])`;
	SHELL_REFERENCE_PRESERVING_PATTERN_SOURCES = /* @__PURE__ */ new Set([
		ENV_ASSIGNMENT_REDACT_PATTERN,
		ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN,
		STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN,
		STANDALONE_ASSIGNMENT_REDACT_PATTERN
	]);
	CHUNK_UNSAFE_PATTERN_SOURCES = /* @__PURE__ */ new Set([
		TELEGRAM_BOT_TOKEN_REDACT_PATTERN,
		TELEGRAM_TOKEN_REDACT_PATTERN,
		AUTHORIZATION_BEARER_REDACT_PATTERN,
		AUTHORIZATION_BASIC_REDACT_PATTERN,
		AUTHORIZATION_BOT_REDACT_PATTERN,
		STANDALONE_BEARER_REDACT_PATTERN,
		...HTTP_AUTH_HEADER_REDACT_PATTERNS
	]);
	DEFAULT_REDACT_FIELD_PATTERNS = [
		ENV_ASSIGNMENT_REDACT_PATTERN,
		ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN,
		STRUCTURED_JSON_SECRET_REDACT_PATTERN,
		STRUCTURED_JSON_PAYMENT_REDACT_PATTERN,
		AMBIGUOUS_QUOTED_SECRET_FIELD_REDACT_PATTERN,
		AMBIGUOUS_QUOTED_AUTH_FIELD_REDACT_PATTERN,
		String.raw`--(?:${CLI_SECRET_FLAG_KEYS})=([^\s"']+)`,
		String.raw`--(?:${CLI_SECRET_FLAG_KEYS})\s+(?!(?:or|and)\b(?=\s+--))(["']?)([^\s"']+)\1`,
		AUTHORIZATION_BEARER_REDACT_PATTERN,
		AUTHORIZATION_BASIC_REDACT_PATTERN,
		AUTHORIZATION_BOT_REDACT_PATTERN,
		...HTTP_AUTH_HEADER_REDACT_PATTERNS,
		GATEWAY_SECURITY_COLON_HEADER_REDACT_PATTERN,
		GATEWAY_SECURITY_EQUALS_ASSIGNMENT_REDACT_PATTERN,
		STANDALONE_BEARER_REDACT_PATTERN,
		String.raw`\b(?:https?|wss?|ftp):\/\/[^\/\s:@]*:([^\/\s@]+)@`,
		String.raw`\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|rediss?|amqps?):\/\/[^:\s/@]*:([^@\s]+)@`,
		String.raw`(^|[\s,;])(?:${FORM_BODY_FIRST_PAIR_KEYS})=([^&\s]+)(?=&[A-Za-z_][A-Za-z0-9_.-]*=)`,
		STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN,
		STANDALONE_ASSIGNMENT_REDACT_PATTERN,
		CONFIG_QUOTED_ASSIGNMENT_REDACT_PATTERN,
		CONFIG_ASSIGNMENT_REDACT_PATTERN,
		CONFIG_DIRECT_ASSIGNMENT_REDACT_PATTERN,
		CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_REDACT_PATTERN,
		CONFIG_NAMESPACED_ASSIGNMENT_REDACT_PATTERN,
		PEM_REDACT_PATTERN_SOURCE,
		String.raw`(^|[\s,{])["']?(?:${AWS_SECRET_ACCESS_KEY_FIELD_KEYS})["']?\s*[:=]\s*(["']?)([A-Za-z0-9/+=]{40})(?![A-Za-z0-9/+=])\2`
	];
	VENDOR_TOKEN_REDACT_PATTERNS = [
		String.raw`\b(sk-[A-Za-z0-9_-]{8,})\b`,
		String.raw`(ghp_[A-Za-z0-9]{10,})`,
		String.raw`(github_pat_[A-Za-z0-9_]{10,})`,
		String.raw`(gho_[A-Za-z0-9]{10,})`,
		String.raw`(ghu_[A-Za-z0-9]{10,})`,
		String.raw`(ghs_[A-Za-z0-9]{10,})`,
		String.raw`(ghr_[A-Za-z0-9]{10,})`,
		String.raw`(glpat-[A-Za-z0-9._=\-]{20,})`,
		String.raw`(gloas-(?:[A-Fa-f0-9]{65,}|[A-Za-z0-9_-]{64}|[A-Fa-f0-9]{32,}))`,
		String.raw`(gldt-[A-Za-z0-9_-]{20,})`,
		String.raw`(glcbt-[A-Za-z0-9]{1,5}_[A-Za-z0-9_-]{20,})`,
		String.raw`(glptt-[A-Za-z0-9_-]{40,})`,
		String.raw`(glft-(?:[A-Za-z0-9_-]{20,}|[a-h0-9]+-[0-9]+_))`,
		String.raw`(glimt-[A-Za-z0-9_-]{25,})`,
		String.raw`(glagent-[A-Za-z0-9_-]{50,})`,
		String.raw`(glwt-[A-Za-z0-9_-]{20,})`,
		String.raw`(glsoat-[A-Za-z0-9_-]{20,})`,
		String.raw`(glffct-[A-Za-z0-9_-]{20,})`,
		String.raw`(glrt-[A-Za-z0-9._-]{20,})`,
		String.raw`(glrtr?-[A-Za-z0-9_-]{27,300}\.[0-9a-z]{2}\.[0-9a-z]{9})`,
		String.raw`(GR1348941[A-Za-z0-9_-]{20,})`,
		String.raw`(_gitlab_session=[A-Za-z0-9%._-]{20,})`,
		String.raw`(xox[baprs]-[A-Za-z0-9-]{10,})`,
		String.raw`(xapp-[A-Za-z0-9-]{10,})`,
		String.raw`(https:\/\/hooks\.slack\.com\/(?:services\/T[A-Z0-9]+\/B[A-Z0-9]+|workflows\/T[A-Z0-9]+\/A[A-Z0-9]+\/[0-9]{17,19})\/[A-Za-z0-9]{20,})`,
		String.raw`(https:\/\/discord(?:app)?\.com\/api\/webhooks\/[0-9]{17,20}\/[A-Za-z0-9_-]{60,})`,
		String.raw`discord(?:.|\n|\r){0,40}?\b([A-Za-z0-9_-]{24}\.[A-Za-z0-9_-]{6}\.[A-Za-z0-9_-]{27})\b`,
		String.raw`(gsk_[A-Za-z0-9_-]{10,})`,
		String.raw`(AIza[0-9A-Za-z\-_]{20,})`,
		String.raw`(ya29\.[0-9A-Za-z_\-./+=]{10,})`,
		String.raw`(1//0[0-9A-Za-z_\-./+=]{10,})`,
		String.raw`(eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})`,
		String.raw`(pplx-[A-Za-z0-9_-]{10,})`,
		String.raw`(fal_[A-Za-z0-9_-]{10,})`,
		String.raw`${IDENTIFIER_SAFE_TOKEN_BOUNDARY}(fc-[A-Za-z0-9]{10,})`,
		String.raw`(bb_live_[A-Za-z0-9_-]{10,})`,
		String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(gAAAA[A-Za-z0-9_=-]{20,})`,
		String.raw`(sk_live_[A-Za-z0-9]{10,})`,
		String.raw`(sk_test_[A-Za-z0-9]{10,})`,
		String.raw`(rk_live_[A-Za-z0-9]{10,})`,
		String.raw`(SG\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,})`,
		String.raw`(npm_[A-Za-z0-9]{10,})`,
		String.raw`(pypi-[A-Za-z0-9_-]{10,})`,
		String.raw`(dop_v1_[A-Za-z0-9]{10,})`,
		String.raw`(doo_v1_[A-Za-z0-9]{10,})`,
		String.raw`(dor_v1_[A-Za-z0-9]{10,})`,
		String.raw`(dp\.(?:ct|pt|sa|scim|audit)\.[A-Za-z0-9]{40,44})`,
		String.raw`(dp\.st\.[A-Za-z0-9]{40,44})`,
		String.raw`(dp\.st\.[a-z0-9_-]{2,35}\.[A-Za-z0-9]{40,44})`,
		String.raw`(dckr_(?:pat|oat)_[A-Za-z0-9_-]{27,32})`,
		String.raw`(bkua_[a-z0-9]{40})`,
		String.raw`(CCIPAT_[A-Za-z0-9]{22}_[A-Fa-f0-9]{40})`,
		String.raw`(sbp_[a-z0-9]{40})`,
		String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(dapi[0-9a-f]{32}(?:-\d)?)`,
		String.raw`(dd[pw]_[A-Za-z0-9]{36})`,
		String.raw`(glsa_[A-Za-z0-9_]{41})`,
		String.raw`(glc_eyJ[A-Za-z0-9+/=]{60,160})`,
		String.raw`(nfp_[A-Za-z0-9_]{36})`,
		String.raw`(CFPAT-[A-Za-z0-9_\-]{40,})`,
		String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(ATCTT3xFfG[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8})`,
		String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(ATATT[A-Za-z0-9+/=_-]+=[A-Za-z0-9]{8})`,
		String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(ATBB[A-Za-z0-9_=.-]{16,})`,
		String.raw`(BBDC-[A-Za-z0-9+/@_-]{40,50})`,
		String.raw`(HRKU-AA[A-Za-z0-9_-]{20,})`,
		String.raw`(pat-(?:eu|na)1-[A-Za-z0-9]{8}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{4}\-[A-Za-z0-9]{12})`,
		String.raw`(apify_api_[A-Za-z0-9\-]{20,})`,
		String.raw`(FlyV1 fm\d+_[A-Za-z0-9+/=,_-]{100,})`,
		String.raw`(fio-u-[A-Za-z0-9_-]{40,})`,
		String.raw`(^|[^A-Za-z0-9_])(am_[A-Za-z0-9_-]{10,})`,
		String.raw`(^|[^A-Za-z0-9_])(sk_[A-Za-z0-9_]{10,})`,
		String.raw`(tvly-[A-Za-z0-9]{10,})`,
		String.raw`(exa_[A-Za-z0-9]{10,})`,
		String.raw`(syt_[A-Za-z0-9]{10,})`,
		String.raw`(retaindb_[A-Za-z0-9]{10,})`,
		String.raw`(hsk-[A-Za-z0-9]{10,})`,
		String.raw`(mem0_[A-Za-z0-9]{10,})`,
		String.raw`(brv_[A-Za-z0-9]{10,})`,
		String.raw`(xai-[A-Za-z0-9]{30,})`,
		String.raw`${IDENTIFIER_SAFE_TOKEN_BOUNDARY}(fw-[A-Za-z0-9]{30,})`,
		String.raw`${IDENTIFIER_SAFE_TOKEN_BOUNDARY}(fw_[A-Za-z0-9]{30,})`,
		String.raw`${IDENTIFIER_SAFE_TOKEN_BOUNDARY}(fpk_[A-Za-z0-9]{30,})`,
		String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(AKIA[A-Z0-9]{16})`,
		String.raw`${BASE64_SAFE_TOKEN_BOUNDARY}(ASIA[A-Z0-9]{16})`,
		String.raw`(AKID[A-Za-z0-9]{10,})`,
		String.raw`(LTAI[A-Za-z0-9]{10,})`,
		String.raw`(hf_[A-Za-z0-9]{10,})`,
		String.raw`(api_org_[A-Za-z0-9]{20,})`,
		String.raw`(r8_[A-Za-z0-9]{10,})`,
		TELEGRAM_BOT_TOKEN_REDACT_PATTERN,
		TELEGRAM_TOKEN_REDACT_PATTERN
	];
	DEFAULT_REDACT_STRING_PATTERNS = [...DEFAULT_REDACT_FIELD_PATTERNS, ...VENDOR_TOKEN_REDACT_PATTERNS];
	DEFAULT_REDACT_PATTERNS = [...DEFAULT_REDACT_STRING_PATTERNS, AWS_SECRET_ACCESS_KEY_MATCHER];
	TOOL_PAYLOAD_AMBIGUOUS_ASSIGNMENT_PATTERNS = /* @__PURE__ */ new Set([
		ENV_ASSIGNMENT_REDACT_PATTERN,
		ESCAPED_ENV_ASSIGNMENT_REDACT_PATTERN,
		STRUCTURED_JSON_SECRET_REDACT_PATTERN,
		AMBIGUOUS_QUOTED_SECRET_FIELD_REDACT_PATTERN,
		AMBIGUOUS_QUOTED_AUTH_FIELD_REDACT_PATTERN,
		STANDALONE_ASSIGNMENT_QUOTED_REDACT_PATTERN,
		STANDALONE_ASSIGNMENT_REDACT_PATTERN,
		CONFIG_QUOTED_ASSIGNMENT_REDACT_PATTERN,
		CONFIG_ASSIGNMENT_REDACT_PATTERN,
		CONFIG_DIRECT_ASSIGNMENT_REDACT_PATTERN,
		CONFIG_PREFIXED_PASSWORD_ASSIGNMENT_REDACT_PATTERN,
		CONFIG_NAMESPACED_ASSIGNMENT_REDACT_PATTERN
	]);
	TOOL_PAYLOAD_REDACT_PATTERNS = DEFAULT_REDACT_PATTERNS.filter((pattern) => typeof pattern !== "string" || !TOOL_PAYLOAD_AMBIGUOUS_ASSIGNMENT_PATTERNS.has(pattern));
}));
//#endregion
//#region src/logging/redact-performance.ts
/** The capture subscriber receives counts and synchronous CPU time, never text or patterns. */
function startRedactionMeasurement(operation) {
	if (!redactionPerformance.hasSubscribers) return;
	const startedAt = performance$1.now();
	const cpu = process.threadCpuUsage();
	return (outcome, inputChars, patternCount) => {
		const elapsedMs = performance$1.now() - startedAt;
		const used = process.threadCpuUsage(cpu);
		redactionPerformance.publish({
			operation,
			outcome,
			pid: process.pid,
			threadId,
			isMainThread,
			elapsedMs,
			threadCpuMs: (used.user + used.system) / 1e3,
			...inputChars === void 0 ? {} : { inputChars },
			...patternCount === void 0 ? {} : { patternCount }
		});
	};
}
var redactionPerformance;
var init_redact_performance = __esmMin((() => {
	redactionPerformance = channel("openclaw.redaction");
}));
//#endregion
//#region src/shared/assistant-error-format.ts
function isKnownTransportErrorCode(value) {
	return [
		REFUSED_TRANSPORT_CODE_RE,
		INTERRUPTED_TRANSPORT_CODE_RE,
		DNS_TRANSPORT_CODE_RE,
		UNREACHABLE_TRANSPORT_CODE_RE
	].some((pattern) => pattern.exec(value)?.[0] === value);
}
var HTTP_STATUS_DELIMITER_RE, REFUSED_TRANSPORT_CODE_RE, INTERRUPTED_TRANSPORT_CODE_RE, DNS_TRANSPORT_CODE_RE, UNREACHABLE_TRANSPORT_CODE_RE;
var init_assistant_error_format = __esmMin((() => {
	HTTP_STATUS_DELIMITER_RE = /(?:\s*:\s*|\s+)/;
	new RegExp(`^(?:http\\s*)?(\\d{3})${HTTP_STATUS_DELIMITER_RE.source}(.+)$`, "i");
	new RegExp(`^(?:http\\s*)?(\\d{3})(?:${HTTP_STATUS_DELIMITER_RE.source}([\\s\\S]+))?$`, "i");
	REFUSED_TRANSPORT_CODE_RE = /\beconnrefused\b/i;
	INTERRUPTED_TRANSPORT_CODE_RE = /\beconnreset\b|\beconnaborted\b|\benetreset\b|\bepipe\b/i;
	DNS_TRANSPORT_CODE_RE = /\benotfound\b|\beai_again\b/i;
	UNREACHABLE_TRANSPORT_CODE_RE = /\benetunreach\b|\behostunreach\b|\behostdown\b/i;
}));
//#endregion
//#region src/logging/structured-authorization-code.ts
function pathEndsWith(path, suffix) {
	if (path.length < suffix.length) return false;
	return suffix.every((part, index) => path[path.length - suffix.length + index] === part);
}
function shouldRedactStructuredAuthorizationCode(normalizedKey, path, transportCode) {
	if (normalizedKey !== "code") return false;
	const normalizedPath = path.map((part) => part.toLowerCase());
	if (normalizedPath.length === 1 || pathEndsWith(normalizedPath, ["error", "code"]) || pathEndsWith(normalizedPath, ["nodeerror", "code"]) || pathEndsWith(normalizedPath, ["status", "code"]) || pathEndsWith(normalizedPath, ["details", "code"]) || pathEndsWith(normalizedPath, ["warnings", "code"])) return false;
	return !(transportCode !== void 0 && normalizedPath.length > 1 && normalizedPath.slice(0, -1).every((part) => part === "cause") && isKnownTransportErrorCode(transportCode));
}
var init_structured_authorization_code = __esmMin((() => {
	init_assistant_error_format();
}));
//#endregion
//#region src/logging/redact.ts
function normalizeMode(value) {
	return value === "off" ? "off" : DEFAULT_REDACT_MODE;
}
function parsePattern(raw) {
	if (raw === PEM_REDACT_PATTERN_SOURCE) return PEM_REDACT_MATCHER;
	if (typeof raw !== "string" && !(raw instanceof RegExp)) return raw;
	let pattern = null;
	if (raw instanceof RegExp) {
		if (raw.flags.includes("g")) pattern = raw;
		else pattern = new RegExp(raw.source, `${raw.flags}g`);
	} else if (raw.trim()) pattern = compileConfigRegex(...parseRedactPatternSource(raw))?.regex ?? null;
	if (pattern && typeof raw === "string" && SHELL_REFERENCE_PRESERVING_PATTERN_SOURCES.has(raw)) shellReferencePreservingPatterns.add(pattern);
	if (pattern && typeof raw === "string" && TOOL_PAYLOAD_AMBIGUOUS_ASSIGNMENT_PATTERNS.has(raw)) sourceAssignmentPatterns.add(pattern);
	if (pattern && typeof raw === "string" && FORM_AWARE_EQUALS_ASSIGNMENT_PATTERN_SOURCES.has(raw)) formAwareEqualsAssignmentPatterns.add(pattern);
	if (pattern && typeof raw === "string" && (raw.startsWith(BASE64_SAFE_TOKEN_BOUNDARY) || raw.startsWith(IDENTIFIER_SAFE_TOKEN_BOUNDARY) || CHUNK_UNSAFE_PATTERN_SOURCES.has(raw))) chunkUnsafePatterns.add(pattern);
	return pattern;
}
function resolvePatterns(value) {
	if (value === TOOL_PAYLOAD_REDACT_PATTERNS) {
		toolPayloadResolvedPatterns ??= TOOL_PAYLOAD_REDACT_PATTERNS.map(parsePattern).filter((re) => Boolean(re));
		return toolPayloadResolvedPatterns;
	}
	if (!value?.length || value === DEFAULT_REDACT_PATTERNS) {
		defaultResolvedPatterns ??= DEFAULT_REDACT_PATTERNS.map(parsePattern).filter((re) => Boolean(re));
		return defaultResolvedPatterns;
	}
	return [.../* @__PURE__ */ new Set([...value.map(parsePattern).filter((re) => Boolean(re)), AWS_SECRET_ACCESS_KEY_MATCHER])];
}
function usesBuiltInRedactPatterns(value) {
	return !value?.length || value === DEFAULT_REDACT_PATTERNS || value === TOOL_PAYLOAD_REDACT_PATTERNS;
}
function maskToken(token) {
	if (token === "***") return token;
	if (token.length < DEFAULT_REDACT_MIN_LENGTH) return "***";
	return `${sliceUtf16Safe(token, 0, DEFAULT_REDACT_KEEP_START)}…${sliceUtf16Safe(token, -4)}`;
}
function splitSecretValueForMask(token) {
	const openingQuote = token[0] ?? "";
	if (SECRET_VALUE_QUOTE_CHARS.has(openingQuote)) {
		const closingQuoteIndex = token.lastIndexOf(openingQuote);
		if (closingQuoteIndex > 0) {
			const suffix = token.slice(closingQuoteIndex + 1);
			if (SECRET_VALUE_SUFFIX_RE.test(suffix)) return {
				maskable: token.slice(1, closingQuoteIndex),
				suffix,
				maskStart: 0,
				maskEnd: closingQuoteIndex + 1
			};
		}
		const tokenWithoutLeadingQuote = token.slice(1);
		const trailingDelimiter = tokenWithoutLeadingQuote.match(SECRET_VALUE_TRAILING_DELIMITER_RE)?.[1] ?? "";
		const maskable = trailingDelimiter && trailingDelimiter.length < tokenWithoutLeadingQuote.length ? tokenWithoutLeadingQuote.slice(0, -trailingDelimiter.length) : tokenWithoutLeadingQuote;
		return {
			maskable,
			suffix: trailingDelimiter && trailingDelimiter.length < tokenWithoutLeadingQuote.length ? trailingDelimiter : "",
			maskStart: 0,
			maskEnd: 1 + maskable.length
		};
	}
	const trailingDelimiter = token.match(SECRET_VALUE_TRAILING_DELIMITER_RE)?.[1] ?? "";
	const maskable = trailingDelimiter && trailingDelimiter.length < token.length ? token.slice(0, -trailingDelimiter.length) : token;
	return {
		maskable,
		suffix: maskable === token ? "" : trailingDelimiter,
		maskStart: 0,
		maskEnd: maskable.length
	};
}
function splitFormAwareCredentialValue(token) {
	const pairBoundary = token.search(/&[A-Za-z_][A-Za-z0-9_.-]*=/u);
	return pairBoundary < 0 ? {
		secret: token,
		suffix: ""
	} : {
		secret: token.slice(0, pairBoundary),
		suffix: token.slice(pairBoundary)
	};
}
function maskSecretValue(token, options) {
	const { maskable, suffix } = splitSecretValueForMask(token);
	return `${options?.hinted ? maskToken(maskable) : "***"}${suffix}`;
}
function normalizeSensitiveKeyName(value) {
	const stripped = value.replace(FORM_BODY_KEY_SEPARATOR_RE, "");
	try {
		return decodeURIComponent(stripped).replace(FORM_BODY_KEY_SEPARATOR_RE, "").toLowerCase().replaceAll("-", "_");
	} catch {
		return stripped.toLowerCase().replaceAll("-", "_");
	}
}
function isSensitiveBodyKey(key) {
	return isSensitiveUrlQueryParamName(key) || BODY_SECRET_KEYS.has(normalizeSensitiveKeyName(key));
}
function hasEncodedOrInvisibleFormKey(key) {
	return FORM_BODY_PERCENT_ESCAPE_RE.test(key) || key.replace(FORM_BODY_KEY_OBFUSCATION_RE, "") !== key;
}
function visitSensitiveAssignments(text, kind, visit) {
	if (!text || kind === "url" && !text.includes("?")) return;
	if (kind === "encoded" && !text.includes("%") && text.replace(FORM_BODY_KEY_OBFUSCATION_RE, "") === text) return;
	if (kind === "context" && !/[=:]/u.test(text)) return;
	const visitPair = (key, token, valueOffset) => {
		if (kind === "encoded" && !hasEncodedOrInvisibleFormKey(key)) return;
		if (!isSensitiveBodyKey(key)) return;
		const { maskable, maskStart, maskEnd } = splitSecretValueForMask(token);
		visit(valueOffset + maskStart, valueOffset + maskEnd, maskable);
	};
	if (kind === "form") {
		let cursor = 0;
		for (const pair of text.split("&")) {
			const equalsIndex = pair.indexOf("=");
			if (equalsIndex >= 0) visitPair(pair.slice(0, equalsIndex), pair.slice(equalsIndex + 1), cursor + equalsIndex + 1);
			cursor += pair.length + 1;
		}
		return;
	}
	const pattern = kind === "url" ? URL_QUERY_PAIR_RE : kind === "encoded" ? ENCODED_FORM_PAIR_RE : FORM_BODY_CONTEXT_SINGLE_PAIR_RE;
	const keyIndex = kind === "context" ? 3 : 2;
	pattern.lastIndex = 0;
	try {
		for (let match = pattern.exec(text); match; match = pattern.exec(text)) {
			const prefix = match[1] ?? "";
			const key = match[keyIndex] ?? "";
			visitPair(key, match[keyIndex + 1] ?? "", match.index + prefix.length + key.length + 1);
		}
	} finally {
		pattern.lastIndex = 0;
	}
}
function redactAssignmentValues(text, kind, onEdits) {
	const parts = [];
	const edits = [];
	let cursor = 0;
	visitSensitiveAssignments(text, kind, (start, end, maskable) => {
		const replacement = kind === "url" ? maskToken(maskable) : "***";
		parts.push(text.slice(cursor, start), replacement);
		if (onEdits) edits.push({
			start,
			end,
			replacement
		});
		cursor = end;
	});
	if (edits.length > 0) onEdits?.(edits);
	return parts.length > 0 ? parts.join("") + text.slice(cursor) : text;
}
function redactFormBodyLine(text, onEdits) {
	if (!text) return text;
	const contextRedacted = redactAssignmentValues(redactAssignmentValues(text, "encoded", onEdits), "context", onEdits);
	if (!contextRedacted.includes("&")) return contextRedacted;
	if (FORM_BODY_RE.test(contextRedacted)) return redactAssignmentValues(contextRedacted, "form", onEdits);
	const substringEdits = [];
	const redacted = contextRedacted.replace(FORM_BODY_SUBSTRING_RE, (match, prefix, body, offset) => {
		const redactedBody = redactAssignmentValues(body, "form", onEdits ? (edits) => {
			for (const edit of edits) substringEdits.push({
				...edit,
				start: offset + prefix.length + edit.start,
				end: offset + prefix.length + edit.end
			});
		} : void 0);
		return redactedBody === body ? match : `${prefix}${redactedBody}`;
	});
	if (substringEdits.length > 0) onEdits?.(substringEdits);
	return redactAssignmentValues(redactAssignmentValues(redacted, "encoded", onEdits), "context", onEdits);
}
function redactFormBody(text, onEdits) {
	if (!text.includes("=")) return text;
	if (FORM_BODY_LINE_BREAK_SPLIT_RE.test(text)) {
		let offset = 0;
		return text.split(FORM_BODY_LINE_BREAK_SPLIT_RE).map((segment) => {
			const result = FORM_BODY_LINE_BREAK_SEGMENT_RE.test(segment) ? segment : redactFormBodyLine(segment, onEdits ? (edits) => onEdits(edits.map((edit) => ({
				...edit,
				start: offset + edit.start,
				end: offset + edit.end
			}))) : void 0);
			offset += result.length;
			return result;
		}).join("");
	}
	return redactFormBodyLine(text, onEdits);
}
function isShellReferenceToKey(key, value) {
	if (!/^[A-Z_][A-Z0-9_]*$/.test(key)) return false;
	const bare = value.match(/^\$([A-Z_][A-Z0-9_]*)$/);
	if (bare) return bare[1] === key;
	return value.match(/^\$\{([A-Z_][A-Z0-9_]*)(?::[-=?+])?\}$/)?.[1] === key;
}
function maskSecretFieldValue(key, value) {
	const expansion = value.match(/^\$\{([A-Z_][A-Z0-9_]*):[-=?+][^{}]+\}(?![\s\S])/);
	if (expansion && expansion[1] === key) return `${value.slice(0, value.indexOf(":") + 2)}***}`;
	return "***";
}
function readEnvAssignmentKey(match) {
	return match.match(/\b([A-Z_][A-Z0-9_]*)\b\s*[=:]/)?.[1];
}
function shouldPreserveShellReferenceMatch(match, token) {
	const key = readEnvAssignmentKey(match);
	return key ? isShellReferenceToKey(key, token) : false;
}
function isEmptyShellParameterExpansionTail(token) {
	return /^[-=?+]\}$/.test(token);
}
function prepareRedactionCapture({ match, groups, input, offset, replacement: policyReplacement }, pattern, preserveSourceAssignment) {
	if (match.includes("PRIVATE KEY-----")) return {
		start: offset,
		end: offset + match.length,
		value: match,
		redact: (target) => ({
			start: target.start,
			end: target.end,
			value: target.value,
			replacement: policyReplacement ?? redactPemBlock(target.value, "…redacted…")
		})
	};
	const selected = selectSecretCapture(match, groups);
	if (selected.value === "***") return;
	const tokenIndex = selected.value === match ? 0 : getSecretCaptureStart(pattern, input, match, offset, selected);
	if (tokenIndex < 0) return;
	const start = offset + tokenIndex;
	return {
		start,
		end: start + selected.value.length,
		value: selected.value,
		redact: (target) => {
			const token = target.value;
			if (sourceAssignmentPatterns.has(pattern) && preserveSourceAssignment?.(input, offset + getSecretCaptureStart(pattern, input, match, offset, selected))) return;
			const formAwareValue = formAwareEqualsAssignmentPatterns.has(pattern) ? splitFormAwareCredentialValue(token) : {
				secret: token,
				suffix: ""
			};
			if (splitSecretValueForMask(formAwareValue.secret).maskable === "***") return;
			const isShellReferencePattern = shellReferencePreservingPatterns.has(pattern);
			if (isShellReferencePattern && (shouldPreserveShellReferenceMatch(match, token) || isEmptyShellParameterExpansionTail(token))) return;
			const masked = policyReplacement ?? (preserveSourceAssignment && sourceAssignmentPatterns.has(pattern) ? maskSecretValue(token) : isShellReferencePattern ? maskToken(token) : `${maskSecretValue(formAwareValue.secret, { hinted: true })}${formAwareValue.suffix}`);
			return {
				start: target.start,
				end: target.end,
				replacement: masked
			};
		}
	};
}
function redactMatch(match, pattern, preserveSourceAssignment) {
	const capture = prepareRedactionCapture(match, pattern, preserveSourceAssignment);
	const edit = capture?.redact(capture);
	return edit ? match.match.slice(0, edit.start - match.offset) + edit.replacement + match.match.slice(edit.end - match.offset) : match.match;
}
function redactText(text, patterns, options) {
	const finishMeasurement = startRedactionMeasurement("text");
	let outcome = "error";
	try {
		let next = redactFormBody(redactAssignmentValues(redactStructuredAuthHeaders(text, "***"), "url"));
		let pattern;
		const replace = (match) => redactMatch(match, pattern, options?.preserveSourceAssignment);
		const replaceRegex = (...args) => replace(readRedactMatch(args));
		for (pattern of patterns) next = pattern instanceof RegExp && !options?.fullContext && !chunkUnsafePatterns.has(pattern) ? replacePatternBounded(next, pattern, replaceRegex) : replaceRedactPattern(next, pattern, replace, replaceRegex);
		outcome = "ok";
		return next;
	} finally {
		finishMeasurement?.(outcome, text.length, patterns.length);
	}
}
function couldMatchDefaultRedactPatterns(text) {
	return DEFAULT_REDACT_PREFILTER_RE.test(text) || AWS_SECRET_ACCESS_KEY_MATCHER.couldMatch(text);
}
function couldMatchDefaultFullContextPatterns(text) {
	return couldMatchDefaultRedactPatterns(text) || FULL_CONTEXT_REDACT_EXTRA_TRIGGERS_RE.test(text);
}
function looksLikeAppSpecificPassword(candidate) {
	return candidate.split("-").every((part) => !BENIGN_APP_PASSWORD_WORDS.has(part.toLowerCase()));
}
function redactAppSpecificPasswords(text) {
	return replacePatternBounded(text, APP_SPECIFIC_PASSWORD_RE, (match, token) => looksLikeAppSpecificPassword(token) ? maskToken(token) : match);
}
function resolveConfigRedaction() {
	const cfg = readLoggingConfig();
	return {
		mode: DEFAULT_REDACT_MODE,
		patterns: cfg?.redactPatterns
	};
}
function resolveRedactOptions(options) {
	const resolved = options ?? resolveConfigRedaction();
	const mode = normalizeMode(resolved.mode);
	return {
		mode,
		patterns: mode === "off" ? [] : resolvePatterns(resolved.patterns)
	};
}
function redactSensitiveText(text, options) {
	if (!text) return text;
	return redactSensitiveTextWithOptions(redactRegisteredSecretValues(text, maskToken), options ?? resolveConfigRedaction());
}
function redactSensitiveTextWithOptions(exactRedacted, resolvedOptions) {
	if (normalizeMode(resolvedOptions.mode) === "off") return exactRedacted;
	if (usesBuiltInRedactPatterns(resolvedOptions.patterns) && !couldMatchDefaultRedactPatterns(exactRedacted)) return exactRedacted;
	return redactText(exactRedacted, resolveRedactOptions(resolvedOptions).patterns);
}
function resolveToolPayloadRedaction(loggingConfig = readLoggingConfig()) {
	const userPatterns = loggingConfig?.redactPatterns;
	return {
		mode: "tools",
		patterns: userPatterns && userPatterns.length > 0 ? [...userPatterns, ...DEFAULT_REDACT_PATTERNS] : void 0
	};
}
function isSensitiveFieldKey(key) {
	return STRUCTURED_SECRET_FIELD_RE.test(key) || STRUCTURED_SECRET_ENV_FIELD_RE.test(key);
}
function isPublicShareIdPath(path) {
	if (path.at(-1)?.toLowerCase() !== "id") return false;
	return path.at(-2)?.toLowerCase().replaceAll("-", "").replaceAll("_", "") === "publicshare";
}
function redactSensitiveFieldValueWithOptions(key, value, options, path = [key], objectPath = true) {
	const exactRedacted = redactRegisteredSecretValues(value, maskToken);
	if (isPublicShareIdPath(path)) return maskToken(exactRedacted);
	const fieldOptions = isSensitiveFieldKey(key) && options.sensitiveFieldPatterns ? {
		...options,
		patterns: options.sensitiveFieldPatterns
	} : options;
	const resolved = resolveRedactOptions(fieldOptions);
	if (resolved.mode === "off") return exactRedacted;
	const redacted = !usesBuiltInRedactPatterns(fieldOptions.patterns) || couldMatchDefaultRedactPatterns(exactRedacted) ? redactText(exactRedacted, resolved.patterns) : exactRedacted;
	if (redacted !== value || STRUCTURED_APP_PASSWORD_FIELD_RE.test(key)) {
		const appRedacted = redactAppSpecificPasswords(redacted);
		if (appRedacted !== value) return appRedacted;
	}
	if (redacted !== value) return redacted;
	return shouldRedactStructuredStringField(key, exactRedacted, path, objectPath) ? maskToken(exactRedacted) : exactRedacted;
}
function shouldRedactStructuredPrimitiveField(key, path) {
	const normalizedKey = key.toLowerCase();
	return isPublicShareIdPath(path) || shouldRedactStructuredAuthorizationCode(normalizedKey, path) || isSensitiveFieldKey(key);
}
function isPlainRedactableObject(value) {
	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
}
function redactStructuredSecretValue(key, value, seen, options, path = key ? [key] : [], objectPath = true) {
	if (typeof value === "string") return redactSensitiveFieldValueWithOptions(key, value, options, path, objectPath);
	if (value === null || value === void 0) return value;
	if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return shouldRedactStructuredPrimitiveField(key, path) ? "***" : value;
	if (Array.isArray(value)) {
		if (seen.has(value)) return "[Circular]";
		seen.add(value);
		const out = value.map((entry) => redactStructuredSecretValue(key, entry, seen, options, path, false));
		seen.delete(value);
		return out;
	}
	if (typeof value === "object") {
		if (seen.has(value)) return "[Circular]";
		if (!isPlainRedactableObject(value)) return value;
		seen.add(value);
		const entries = Object.entries(value);
		for (const entry of entries) {
			const [name, child] = entry;
			entry[1] = redactStructuredSecretValue(name, child, seen, options, [...path, name], objectPath);
		}
		seen.delete(value);
		return Object.fromEntries(entries);
	}
	return value;
}
function redactSecretsWithOptions(value, options) {
	if (typeof value === "string") return redactSensitiveText(value, options);
	if (value === null || value === void 0) return value;
	if (typeof value !== "object") return value;
	return redactStructuredSecretValue("", value, /* @__PURE__ */ new WeakSet(), options);
}
function redactSecrets(value) {
	return redactSecretsWithOptions(value, resolveToolPayloadRedaction());
}
function preservesStructuredReference(key, value) {
	return key.toLowerCase() === "session" && STRUCTURED_INTERNAL_SOURCE_PATH_VALUE_RE.test(value) || isShellReferenceToKey(key, value);
}
function shouldRedactStructuredStringField(key, value, path, objectPath) {
	return shouldRedactStructuredAuthorizationCode(key.toLowerCase(), path, objectPath ? value : void 0) || isSensitiveFieldKey(key) && !preservesStructuredReference(key, value);
}
function classifyLogFieldProtection(key, path, objectPath, value) {
	return (value === void 0 ? shouldRedactStructuredPrimitiveField(key, path) : isPublicShareIdPath(path) || shouldRedactStructuredStringField(key, value, path, objectPath)) ? "legacy" : CREDENTIAL_HEADER_FIELD_RE.test(key) ? "header" : void 0;
}
function getFieldRecordEdits(field, mode) {
	const { key, value, path, objectPath } = field;
	if (mode === "off" || !field.string && value === "null" || !classifyLogFieldProtection(key, path, objectPath, field.string ? value : void 0)) return [];
	return [{
		start: 0,
		end: value.length,
		replacement: maskSecretFieldValue(key, value)
	}];
}
function getTextRecordEdits(field, mode, fileFields) {
	const { value } = field;
	if (field.isKey || fileFields && !field.origin.structured) return [];
	if (fileFields && field.origin.primitiveMask) return [{
		start: 0,
		end: value.length,
		replacement: "***"
	}];
	if (!field.string) return [];
	const edits = [];
	const registered = redactRegisteredSecretValues(value, (secret, start) => {
		const replacement = maskToken(secret);
		edits.push({
			start,
			end: start + secret.length,
			replacement
		});
		return replacement;
	});
	if (fileFields && isPublicShareIdPath(field.path)) return [{
		start: 0,
		end: value.length,
		replacement: maskToken(registered)
	}];
	if (mode === "off") return edits;
	let combined = edits;
	const receive = (added) => {
		combined = composeRedactionEdits(value.length, combined, added);
	};
	const headers = findStructuredAuthParamRanges(registered).map(({ start, end }) => ({
		start,
		end,
		replacement: "***"
	}));
	receive(headers);
	redactFormBody(redactAssignmentValues(applyRedactionEdits(registered, headers), "url", receive), receive);
	return combined;
}
function getLegacyFieldRecordEdits(field, value, beforeConversion = false) {
	const { key, value: original, path, objectPath } = field;
	if (field.isKey || !field.origin.structured || !field.string) return [];
	if (isPublicShareIdPath(path)) return [];
	const edits = [];
	if (value !== original || STRUCTURED_APP_PASSWORD_FIELD_RE.test(key)) {
		for (const match of value.matchAll(APP_SPECIFIC_PASSWORD_RE)) if (looksLikeAppSpecificPassword(match[0])) edits.push({
			start: match.index,
			end: match.index + match[0].length,
			replacement: maskToken(match[0])
		});
	}
	if (edits.length > 0 || value !== original) return edits;
	const protection = classifyLogFieldProtection(key, path, objectPath, value);
	return protection === "legacy" || beforeConversion && protection === "header" ? [{
		start: 0,
		end: value.length,
		replacement: maskToken(value)
	}] : [];
}
function resolveFileLogRedactOptions() {
	return resolveRedactOptions(resolveToolPayloadRedaction());
}
function prepareFileToJsonReceivers(record, patterns) {
	const decoded = /* @__PURE__ */ new WeakSet();
	const active = /* @__PURE__ */ new WeakSet();
	const visit = (value, key, path, objectPath, decode) => {
		if (typeof value === "string" && decode) {
			const field = {
				key,
				path,
				objectPath,
				value,
				isKey: false,
				string: true,
				origin: {
					structured: true,
					primitiveMask: false
				}
			};
			let current = applyRedactionEdits(value, getTextRecordEdits(field, "tools", true));
			if (!isPublicShareIdPath(path)) for (const pattern of patterns) current = applyRedactionEdits(current, getPatternRedactionEdits(current, pattern, prepareRedactionCapture));
			return applyRedactionEdits(current, getLegacyFieldRecordEdits(field, current, true));
		}
		if (value === null || typeof value !== "object") return decode && [
			"number",
			"boolean",
			"bigint"
		].includes(typeof value) && classifyLogFieldProtection(key, path, objectPath, void 0) ? "***" : value;
		if (!Array.isArray(value) && !isPlainRedactableObject(value)) return value;
		if (active.has(value)) return "[Circular]";
		active.add(value);
		let clone;
		let decodeFields = decode;
		if (Array.isArray(value)) clone = value.map((entry) => visit(entry, key, path, false, decodeFields));
		else {
			const entries = Object.entries(value);
			decodeFields ||= entries.some(([name, entry]) => name === "toJSON" && typeof entry === "function");
			clone = Object.fromEntries(entries.map(([name, entry]) => [name, visit(entry, name, [...path, name], objectPath, decodeFields)]));
		}
		if (decodeFields) decoded.add(clone);
		active.delete(value);
		return clone;
	};
	return {
		record: visit(record, "", [], true, false),
		decoded
	};
}
/** Converts native values once and applies configured and structural protection before output. */
function redactLogRecord(record, options, finish) {
	const finishMeasurement = startRedactionMeasurement("log-record");
	let outcome = "error";
	let inputChars;
	try {
		const resolved = resolveRedactOptions();
		const prepared = options.format === "console" ? {
			record,
			decoded: /* @__PURE__ */ new WeakSet()
		} : prepareFileToJsonReceivers(record, options.decodedOptions?.patterns ?? resolved.patterns);
		const ordinary = {
			structured: true,
			primitiveMask: false
		};
		const origins = {
			value: ordinary,
			children: /* @__PURE__ */ new Map()
		};
		const ancestors = [];
		const json = JSON.stringify(prepared.record, function(key, value) {
			while (ancestors.length > 0 && ancestors.at(-1)?.value !== this) ancestors.pop();
			const parent = ancestors.at(-1);
			const array = Array.isArray(this);
			const fieldKey = array && parent ? parent.key : key;
			const path = array && parent ? parent.path : parent ? [...parent.path, key] : [];
			const source = !parent ? prepared.record : parent.structured && options.format !== "console" ? Reflect.get(this, key) : value;
			const structured = (parent?.structured ?? true) && (source === null || typeof source !== "object" || !prepared.decoded.has(source) && source === value && (Array.isArray(source) || isPlainRedactableObject(source)));
			const primitiveMask = structured && [
				"number",
				"boolean",
				"bigint"
			].includes(typeof source) && classifyLogFieldProtection(fieldKey, path, !array, void 0) === "legacy";
			const circular = value !== null && typeof value === "object" && ancestors.some((frame) => frame.value === value);
			const emitted = circular ? "[Circular]" : typeof value === "bigint" ? String(value) : value;
			const container = emitted !== null && typeof emitted === "object";
			let node = origins;
			if (parent && parent.structured && (container || !structured || primitiveMask || circular)) {
				node = {
					value: {
						structured: structured && !circular,
						primitiveMask
					},
					children: /* @__PURE__ */ new Map()
				};
				parent.origins.children.set(key, node);
			} else if (parent) node = parent.origins;
			else origins.value = {
				structured,
				primitiveMask
			};
			if (container) ancestors.push({
				value: emitted,
				path,
				key: fieldKey,
				origins: node,
				structured
			});
			return emitted;
		});
		inputChars = json.length;
		let materialized = JSON.parse(json);
		const message = options.deriveMessage?.(materialized);
		if (message) {
			origins.children.set("message", {
				value: ordinary,
				children: /* @__PURE__ */ new Map()
			});
			if (Object.hasOwn(materialized, "message")) materialized.message = message.text;
			else {
				const entries = Object.entries(materialized);
				entries.splice(entries.findIndex(([key]) => key === "hostname") + 1, 0, ["message", message.text]);
				materialized = Object.fromEntries(entries);
			}
		}
		const serialized = message ? JSON.stringify(materialized) : json;
		const decodedPatterns = options.decodedOptions?.patterns ?? resolved.patterns;
		const result = finish(redactJsonRecord(serialized, origins, [[{ patterns: decodedPatterns }], [{ patterns: preparationPatterns }, {
			patterns: resolved.patterns,
			...resolved.patterns === defaultResolvedPatterns ? { couldMatch: couldMatchDefaultFullContextPatterns } : {}
		}]], prepareRedactionCapture, options.format === "console" ? () => [] : getLegacyFieldRecordEdits, (field) => getFieldRecordEdits(field, resolved.mode), (field) => getTextRecordEdits(field, resolved.mode, options.format !== "console"), (field, currentValue) => (options.format === "console" ? field.path.length === 1 && CONSOLE_STRUCTURAL_FIELDS.has(field.key) : !field.origin.structured || field.origin.primitiveMask || isPublicShareIdPath(field.path)) || decodedPatterns === defaultResolvedPatterns && !couldMatchDefaultFullContextPatterns(currentValue), message), message ? serialized : void 0);
		outcome = "ok";
		return result;
	} finally {
		finishMeasurement?.(outcome, inputChars);
	}
}
function redactLogRecordForTransport(record, options = {}) {
	return redactLogRecord(record, options, (redacted) => JSON.parse(redacted));
}
function serializeRedactedFileLogRecord(record, options = {}) {
	return redactLogRecord(record, options, (redacted, canonical) => redacted === canonical ? redacted : JSON.stringify(JSON.parse(redacted)));
}
var DEFAULT_REDACT_MODE, DEFAULT_REDACT_MIN_LENGTH, DEFAULT_REDACT_KEEP_START, shellReferencePreservingPatterns, chunkUnsafePatterns, formAwareEqualsAssignmentPatterns, sourceAssignmentPatterns, defaultResolvedPatterns, toolPayloadResolvedPatterns, FORM_BODY_KEY_OBFUSCATION_RE, FORM_BODY_KEY_SEPARATOR_RE, FORM_BODY_PERCENT_ESCAPE_RE, FORM_BODY_KEY, FORM_BODY_VALUE, URL_QUERY_VALUE, FORM_BODY_PAIR, FORM_BODY_RE, FORM_BODY_SUBSTRING_RE, ENCODED_FORM_PAIR_RE, FORM_BODY_CONTEXT_SINGLE_PAIR_RE, URL_QUERY_PAIR_RE, SECRET_VALUE_TRAILING_DELIMITER_RE, SECRET_VALUE_SUFFIX_RE, SECRET_VALUE_QUOTE_CHARS, FORM_BODY_LINE_BREAK_SPLIT_RE, FORM_BODY_LINE_BREAK_SEGMENT_RE, STRUCTURED_SECRET_FIELD_RE, STRUCTURED_INTERNAL_SOURCE_PATH_VALUE_RE, STRUCTURED_APP_PASSWORD_FIELD_RE, APP_SPECIFIC_PASSWORD_RE, BENIGN_APP_PASSWORD_WORDS, STRUCTURED_SECRET_ENV_FIELD_RE, DEFAULT_REDACT_PREFILTER_SOURCES, DEFAULT_REDACT_PREFILTER_RE, FULL_CONTEXT_REDACT_EXTRA_TRIGGERS_RE, preparationPatterns, CONSOLE_STRUCTURAL_FIELDS;
var init_redact = __esmMin((() => {
	init_redact_sensitive_url();
	init_utf16_slice();
	init_structured_auth_redaction();
	init_config_regex();
	init_config();
	init_redact_bounded();
	init_redact_edit_composition();
	init_redact_internal_state();
	init_redact_internal();
	init_redact_json();
	init_redact_pattern_runtime();
	init_redact_patterns();
	init_redact_pem();
	init_redact_performance();
	init_secret_redaction_registry();
	init_structured_authorization_code();
	DEFAULT_REDACT_MODE = "tools";
	DEFAULT_REDACT_MIN_LENGTH = 18;
	DEFAULT_REDACT_KEEP_START = 6;
	shellReferencePreservingPatterns = /* @__PURE__ */ new WeakSet();
	chunkUnsafePatterns = /* @__PURE__ */ new WeakSet();
	formAwareEqualsAssignmentPatterns = /* @__PURE__ */ new WeakSet();
	sourceAssignmentPatterns = /* @__PURE__ */ new WeakSet();
	FORM_BODY_KEY_OBFUSCATION_RE = new RegExp(String.raw`[${FORM_BODY_KEY_INVISIBLE_CHARS}+]`, "gu");
	FORM_BODY_KEY_SEPARATOR_RE = /[\p{C}\p{Z}\u115F\u1160\u3164\uFFA0+]/gu;
	FORM_BODY_PERCENT_ESCAPE_RE = /%[0-9A-Fa-f]{2}/u;
	FORM_BODY_KEY = String.raw`[${FORM_BODY_KEY_INVISIBLE_CHARS}+]*(?:[A-Za-z_]|%[0-9A-Fa-f]{2})(?:[A-Za-z0-9_.-]|%[0-9A-Fa-f]{2}|[${FORM_BODY_KEY_INVISIBLE_CHARS}+])*`;
	FORM_BODY_VALUE = "[^&\\s<>]*";
	URL_QUERY_VALUE = "[^&#\\s<>]*";
	FORM_BODY_PAIR = String.raw`${FORM_BODY_KEY}=${FORM_BODY_VALUE}`;
	FORM_BODY_RE = new RegExp(String.raw`^${FORM_BODY_PAIR}(?:&${FORM_BODY_PAIR})+$`, "u");
	FORM_BODY_SUBSTRING_RE = new RegExp(String.raw`(^|[\s:({\[,="'` + "`" + String.raw`])(${FORM_BODY_PAIR}(?:&${FORM_BODY_PAIR})+)`, "gu");
	ENCODED_FORM_PAIR_RE = new RegExp(String.raw`(^|[\s:({\[,="'` + "`" + String.raw`&])(${FORM_BODY_KEY})=(${FORM_BODY_VALUE})`, "gu");
	FORM_BODY_CONTEXT_SINGLE_PAIR_RE = new RegExp(String.raw`(\b(?:body|form(?:[-_\s]?body)?)\s*[:=]\s*(["'\x60]?))(${FORM_BODY_KEY})=(${FORM_BODY_VALUE})(["'\x60]?)`, "giu");
	URL_QUERY_PAIR_RE = new RegExp(String.raw`([?&])(${FORM_BODY_KEY})=(${URL_QUERY_VALUE})`, "gu");
	SECRET_VALUE_TRAILING_DELIMITER_RE = /(["'`,;)}\]]+)$/u;
	SECRET_VALUE_SUFFIX_RE = /^["'`,;)}\]]*$/u;
	SECRET_VALUE_QUOTE_CHARS = /* @__PURE__ */ new Set([
		"\"",
		"'",
		"`"
	]);
	FORM_BODY_LINE_BREAK_SPLIT_RE = /(\r\n|\r|\n)/u;
	FORM_BODY_LINE_BREAK_SEGMENT_RE = /^(?:\r\n|\r|\n)$/u;
	STRUCTURED_SECRET_FIELD_RE = new RegExp(String.raw`^(?:api[-_]?key|apiKey|api[-_]?token|apiToken|bearer[-_]?token|bearerToken|token|secret|password|passwd|${AWS_SECRET_ACCESS_KEY_FIELD_KEYS}|credential|authorization|private[-_]?key|privateKey|access[-_]?token|accessToken|refresh[-_]?token|refreshToken|id[-_]?token|idToken|auth[-_]?token|authToken|client[-_]?secret|clientSecret|app[-_]?secret|appSecret|secret[-_]?value|secretValue|raw[-_]?secret|rawSecret|secret[-_]?input|secretInput|key|key[-_]?material|keyMaterial|jwt|session|signature|cookie|set[-_]?cookie|${PAYMENT_CREDENTIAL_QUERY_KEYS}|${PAYMENT_CREDENTIAL_JSON_KEYS})$`, "i");
	STRUCTURED_INTERNAL_SOURCE_PATH_VALUE_RE = /^\$WORKSPACE_DIR\/[A-Za-z0-9._/-]+\.jsonl$/u;
	STRUCTURED_APP_PASSWORD_FIELD_RE = /^(?:apple|icloud|app[-_]?specific[-_]?password|appSpecificPassword|application[-_]?password|text|content|message|error|errorMessage|detail|details|reason)$/i;
	APP_SPECIFIC_PASSWORD_RE = /\b([a-z]{4}-[a-z]{4}-[a-z]{4}-[a-z]{4})\b/g;
	BENIGN_APP_PASSWORD_WORDS = /* @__PURE__ */ new Set([
		"case",
		"claw",
		"demo",
		"file",
		"main",
		"name",
		"open",
		"path",
		"slug",
		"test"
	]);
	STRUCTURED_SECRET_ENV_FIELD_RE = new RegExp(String.raw`^(?:(?:[A-Z0-9]+[_-])+(?:KEY|TOKEN|SECRET|PASSWORD|PASSWD)|API[_-]?KEY|TOKEN|SECRET|PASSWORD|PASSWD|${PAYMENT_CREDENTIAL_ENV_KEYS})$`, "i");
	DEFAULT_REDACT_PREFILTER_SOURCES = [
		String.raw`KEY|TOKEN|SECRET|PASSWORD|PASSWD|AUTH|COOKIE|SIGNATURE|CREDENTIAL|CARD|CVC|CVV|PAYMENT|PRIVATE KEY`,
		String.raw`security[-_]?code|\bpass\s*[=:]|\bpassphrase\s*[=:]|_(?:password|pass|passphrase|passwd)\s*[=:]|jwt\s*[=:]|session=|code=|\bsig\s*=`,
		String.raw`\bBearer\s+`,
		String.raw`:\/\/[^\/\s:@]*:[^\s@]+@`,
		String.raw`sk-|gh[opsur]_|github_pat_|glpat-|gloas-|gldt-|glcbt-|glptt-|glft-|glimt-|glagent-|glwt-|glsoat-|glffct-|glrt-|glrtr-|GR1348941|_gitlab_session=|xox[baprs]-|xapp-|hooks\.slack\.com|discord|gsk_|AIza|ya29\.|1\/\/0|eyJ|pplx-|fal_|fc-|bb_live_|gAAAA|[sr]k_(?:live|test)_|SG\.|npm_|pypi-|do[opr]_v1_|dp\.(?:ct|pt|sa|st|scim|audit)\.|dckr_|bkua_|CCIPAT_|sbp_|dapi[0-9a-f]|dd[pw]_|glsa_|nfp_|CFPAT-|ATCTT3|ATATT|ATBB|BBDC-|HRKU-|pat-(?:eu|na)1-|apify_api_|FlyV1|fio-u-|tvly-|exa_|syt_|retaindb_|mem0_|brv_|xai-|fw-|fw_|fpk_`,
		String.raw`(?:^|[^A-Za-z0-9_])(?:am_|sk_)`,
		String.raw`A[KS]IA[A-Z0-9]|AKID|LTAI|hf_|api_org_|r8_`,
		String.raw`\bbot\d{6,}:|\b\d{6,}:[A-Za-z0-9_-]{20,}`,
		String.raw`%[0-9A-Fa-f]{2}[${FORM_BODY_KEY_INVISIBLE_CHARS}+A-Za-z0-9_%.-]*=`,
		String.raw`=(?<=(?:\+|[${FORM_BODY_KEY_INVISIBLE_CHARS}])(?:[${FORM_BODY_KEY_INVISIBLE_CHARS}+]*[A-Za-z0-9_%.-])+[${FORM_BODY_KEY_INVISIBLE_CHARS}+]*=)|=(?<=[A-Za-z0-9_%.-][${FORM_BODY_KEY_INVISIBLE_CHARS}+]+=)`
	];
	DEFAULT_REDACT_PREFILTER_RE = new RegExp(`(?:${DEFAULT_REDACT_PREFILTER_SOURCES.join("|")})`, "iu");
	FULL_CONTEXT_REDACT_EXTRA_TRIGGERS_RE = /JWT|Bearer\s+|am_|sk_|(?<!\d)\d{6,}:[A-Za-z0-9_-]{20,}/i;
	preparationPatterns = [
		{
			source: "registered secret values",
			*exec(input) {
				const matches = [];
				redactRegisteredSecretValues(input, (secret, offset) => {
					matches.push({
						match: secret,
						groups: [],
						input,
						offset,
						replacement: maskToken(secret)
					});
					return secret;
				});
				yield* matches;
			}
		},
		{
			source: "structured authorization parameters",
			*exec(input) {
				for (const { start, end } of findStructuredAuthParamRanges(input)) yield {
					match: input.slice(start, end),
					groups: [],
					input,
					offset: start,
					replacement: "***"
				};
			}
		},
		{
			source: "URL query assignments",
			*exec(input) {
				const edits = [];
				redactAssignmentValues(input, "url", (added) => edits.push(...added));
				for (const edit of edits) yield {
					match: input.slice(edit.start, edit.end),
					groups: [],
					input,
					offset: edit.start,
					replacement: edit.replacement
				};
			}
		},
		{
			source: "form bodies",
			*exec(input) {
				let edits = [];
				redactFormBody(input, (added) => {
					edits = composeRedactionEdits(input.length, edits, added);
				});
				for (const edit of edits) yield {
					match: input.slice(edit.start, edit.end),
					groups: [],
					input,
					offset: edit.start,
					replacement: edit.replacement
				};
			}
		}
	];
	CONSOLE_STRUCTURAL_FIELDS = /* @__PURE__ */ new Set(["time", "level"]);
}));
//#endregion
//#region src/logging/timestamps.ts
function isValidTimeZone(tz) {
	const cached = validTimeZoneCache.get(tz);
	if (cached !== void 0) return cached;
	let valid;
	try {
		new Intl.DateTimeFormat("en", { timeZone: tz }).format();
		valid = true;
	} catch {
		valid = false;
	}
	validTimeZoneCache.set(tz, valid);
	return valid;
}
function resolveEffectiveTimeZone(timeZone) {
	const explicit = timeZone ?? process.env.TZ;
	return explicit && isValidTimeZone(explicit) ? explicit : hostTimeZone ??= Intl.DateTimeFormat().resolvedOptions().timeZone;
}
function formatOffset(offsetRaw) {
	return offsetRaw === "GMT" ? "+00:00" : offsetRaw.slice(3);
}
function getTimestampParts(date, timeZone) {
	const effectiveTimeZone = resolveEffectiveTimeZone(timeZone);
	const second = Math.floor(date.getTime() / 1e3);
	if (lastTimestampParts?.second === second && lastTimestampParts.timeZone === effectiveTimeZone) return lastTimestampParts.parts;
	let fmt = timestampFormatterCache.get(effectiveTimeZone);
	if (!fmt) {
		fmt = new Intl.DateTimeFormat("en", {
			timeZone: effectiveTimeZone,
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: false,
			fractionalSecondDigits: 3,
			timeZoneName: "longOffset"
		});
		timestampFormatterCache.set(effectiveTimeZone, fmt);
	}
	const parts = {};
	for (const part of fmt.formatToParts(date)) parts[part.type] = part.value;
	lastTimestampParts = {
		second,
		timeZone: effectiveTimeZone,
		parts
	};
	return parts;
}
function formatTimestamp(date, options) {
	const style = options?.style ?? "medium";
	const parts = getTimestampParts(date, options?.timeZone);
	const offset = formatOffset(parts.timeZoneName ?? "GMT");
	const milliseconds = String(date.getUTCMilliseconds()).padStart(3, "0");
	switch (style) {
		case "short": return `${parts.hour}:${parts.minute}:${parts.second}${offset}`;
		case "medium": return `${parts.hour}:${parts.minute}:${parts.second}.${milliseconds}${offset}`;
		case "long": return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}.${milliseconds}${offset}`;
	}
	throw new Error("Unsupported timestamp style");
}
var validTimeZoneCache, timestampFormatterCache, hostTimeZone, lastTimestampParts;
var init_timestamps = __esmMin((() => {
	validTimeZoneCache = /* @__PURE__ */ new Map();
	timestampFormatterCache = /* @__PURE__ */ new Map();
}));
//#endregion
//#region src/logging/json-console-line.ts
function formatJsonConsoleLine(params) {
	const envelope = {
		...params.meta,
		time: formatTimestamp(/* @__PURE__ */ new Date(), { style: "long" }),
		level: params.level,
		...params.subsystem ? { subsystem: params.subsystem } : {},
		message: params.message
	};
	return JSON.stringify(redactLogRecordForTransport(envelope, { format: "console" }));
}
/** Formats diagnostics that must bypass console capture without bypassing JSON console style. */
function formatConsoleDiagnosticLine(params) {
	return (loggingState.overrideSettings?.consoleStyle ?? readLoggingConfig()?.consoleStyle) === "json" ? formatJsonConsoleLine(params) : params.message;
}
var init_json_console_line = __esmMin((() => {
	init_config();
	init_redact();
	init_state();
	init_timestamps();
}));
//#endregion
//#region src/logging/levels.ts
function tryParseLogLevel(level) {
	if (typeof level !== "string") return;
	const candidate = level.trim();
	return ALLOWED_LOG_LEVELS.includes(candidate) ? candidate : void 0;
}
function normalizeLogLevel(level, fallback = "info") {
	return tryParseLogLevel(level) ?? fallback;
}
function levelToMinLevel(level) {
	return MIN_LEVEL_BY_LOG_LEVEL[level];
}
var ALLOWED_LOG_LEVELS, MIN_LEVEL_BY_LOG_LEVEL;
var init_levels = __esmMin((() => {
	ALLOWED_LOG_LEVELS = [
		"silent",
		"fatal",
		"error",
		"warn",
		"info",
		"debug",
		"trace"
	];
	MIN_LEVEL_BY_LOG_LEVEL = {
		trace: 1,
		debug: 2,
		info: 3,
		warn: 4,
		error: 5,
		fatal: 6,
		silent: Number.POSITIVE_INFINITY
	};
}));
//#endregion
//#region src/logging/env-log-level.ts
/** Resolves OPENCLAW_LOG_LEVEL once per value, warning only when the invalid value changes. */
function resolveEnvLogLevelOverride() {
	const trimmed = normalizeOptionalString(process.env.OPENCLAW_LOG_LEVEL) ?? "";
	if (!trimmed) {
		loggingState.invalidEnvLogLevelValue = null;
		return;
	}
	const parsed = tryParseLogLevel(trimmed);
	if (parsed) {
		loggingState.invalidEnvLogLevelValue = null;
		return parsed;
	}
	if (loggingState.invalidEnvLogLevelValue !== trimmed) {
		loggingState.invalidEnvLogLevelValue = trimmed;
		const message = `[openclaw] Ignoring invalid OPENCLAW_LOG_LEVEL="${trimmed}" (allowed: ${ALLOWED_LOG_LEVELS.join("|")}).`;
		process.stderr.write(`${formatConsoleDiagnosticLine({
			level: "warn",
			message
		})}\n`);
	}
}
var init_env_log_level = __esmMin((() => {
	init_string_coerce();
	init_json_console_line();
	init_levels();
	init_state();
}));
//#endregion
//#region src/logging/log-file-shared.ts
function canUseNodeFs() {
	const getBuiltinModule = process.getBuiltinModule;
	if (typeof getBuiltinModule !== "function") return false;
	try {
		return getBuiltinModule("fs") !== void 0;
	} catch {
		return false;
	}
}
function formatLocalDate(date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
var LOG_PREFIX, LOG_SUFFIX;
var init_log_file_shared = __esmMin((() => {
	LOG_PREFIX = "openclaw";
	LOG_SUFFIX = ".log";
}));
//#endregion
//#region src/logging/log-file-path.ts
function encodeLogProfileSegment(profile) {
	let encoded = "";
	for (const char of profile) if (/^[a-z0-9]$/u.test(char)) encoded += char;
	else if (char === "-") encoded += "--";
	else if (char === "_") encoded += "-0";
	else if (/^[A-Z]$/u.test(char)) encoded += `-1${char.toLowerCase()}`;
	else encoded += `-2${char.codePointAt(0)?.toString(16) ?? "0"}-`;
	return encoded;
}
function resolveLogProfileSegment(env) {
	const profile = env.OPENCLAW_PROFILE?.trim();
	if (!profile || profile.toLowerCase() === "default") return null;
	const encoded = encodeLogProfileSegment(profile);
	if (encoded.length <= MAX_LOG_PROFILE_SEGMENT_LENGTH) return encoded;
	return `-3${createHash("sha256").update(profile).digest("hex")}`;
}
/** Resolves today's default rolling log path for the active CLI profile. */
function resolveDefaultRollingLogFile(options) {
	const date = options?.date ?? /* @__PURE__ */ new Date();
	const env = options?.env ?? process.env;
	const logDir = options?.logDir ?? (canUseNodeFs() ? resolvePreferredOpenClawTmpDir() : "/tmp/openclaw");
	const profileSegment = resolveLogProfileSegment(env);
	const profileSuffix = profileSegment ? `-${profileSegment}` : "";
	return path.join(logDir, `${LOG_PREFIX}${profileSuffix}-${formatLocalDate(date)}${LOG_SUFFIX}`);
}
/** Returns whether a configured path had the legacy default rolling filename shape. */
function isLegacyRollingLogFilePath(file) {
	const base = path.basename(file);
	return base === `openclaw-YYYY-MM-DD.log` || ROLLING_LOG_FILE_RE.exec(base)?.[1] === "openclaw";
}
/** Advances a rolling log path to the requested date while preserving its profile family. */
function resolveRollingLogFilePathForDate(file, date) {
	const match = ROLLING_LOG_FILE_RE.exec(path.basename(file));
	if (!match) return isLegacyRollingLogFilePath(file) ? path.join(path.dirname(file), `${LOG_PREFIX}-${formatLocalDate(date)}${LOG_SUFFIX}`) : file;
	return path.join(path.dirname(file), `${match[1]}-${formatLocalDate(date)}${LOG_SUFFIX}`);
}
var ROLLING_LOG_FILE_RE, MAX_LOG_PROFILE_SEGMENT_LENGTH;
var init_log_file_path = __esmMin((() => {
	init_tmp_openclaw_dir();
	init_log_file_shared();
	ROLLING_LOG_FILE_RE = /^(openclaw(?:-[a-z0-9-]+)?)-(\d{4}-\d{2}-\d{2})\.log$/u;
	MAX_LOG_PROFILE_SEGMENT_LENGTH = 220;
}));
//#endregion
//#region src/logging/logger-file-message.ts
function clampMessage(text) {
	return text.length > MAX_FILE_LOG_MESSAGE_CHARS ? `${truncateUtf16Safe(text, MAX_FILE_LOG_MESSAGE_CHARS)}...(truncated)` : text;
}
function stringifyFileLogMessagePart(value, json) {
	if (json) return JSON.stringify(value);
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") return String(value);
	if (isRecord(value) && typeof value.message === "string") return value.message;
}
function buildFileLogMessage(record, parts) {
	const text = [];
	const spans = [];
	let length = 0;
	for (const { key, json, primitiveText } of parts) {
		const value = record[key];
		const part = primitiveText ?? stringifyFileLogMessagePart(value, json);
		if (!part?.trim()) continue;
		if (text.length > 0) length += 1;
		spans.push({
			key,
			json,
			messageField: !json && isRecord(value),
			start: length,
			...primitiveText === void 0 ? {} : { primitiveLength: primitiveText.length }
		});
		text.push(part);
		length += part.length;
	}
	if (text.length === 0) return;
	const joined = text.join(" ");
	const prefix = truncateUtf16Safe(joined, MAX_FILE_LOG_MESSAGE_CHARS);
	const textValue = clampMessage(joined);
	return {
		text: textValue,
		contentLength: prefix.length,
		finish: (value) => value === textValue ? value : clampMessage(value),
		parts: spans
	};
}
var MAX_FILE_LOG_MESSAGE_CHARS;
var init_logger_file_message = __esmMin((() => {
	init_record_coerce();
	init_utf16_slice();
	MAX_FILE_LOG_MESSAGE_CHARS = 4096;
}));
//#endregion
//#region src/infra/regular-file.ts
var init_regular_file = __esmMin((() => {
	init_fs_safe_defaults();
}));
//#endregion
//#region src/logging/logger-file-transport.ts
function rotatedLogPath(file, index) {
	const ext = path.extname(file);
	return `${file.slice(0, file.length - ext.length)}.${index}${ext}`;
}
function rotateLogFile(file) {
	try {
		fs.mkdirSync(path.dirname(file), { recursive: true });
		fs.rmSync(rotatedLogPath(file, MAX_ROTATED_LOG_FILES), { force: true });
		for (let index = 4; index >= 1; index -= 1) {
			const from = rotatedLogPath(file, index);
			if (fs.existsSync(from)) fs.renameSync(from, rotatedLogPath(file, index + 1));
		}
		if (fs.existsSync(file)) fs.renameSync(file, rotatedLogPath(file, 1));
		return true;
	} catch {
		return false;
	}
}
async function getCurrentLogFileBytes(file) {
	try {
		return (await fs$1.stat(file)).size;
	} catch {
		return 0;
	}
}
function getCurrentLogFileBytesSync(file) {
	try {
		return fs.statSync(file).size;
	} catch {
		return 0;
	}
}
function buildDroppedMarker(target, count) {
	const date = /* @__PURE__ */ new Date();
	const message = `[openclaw] file log queue overflow; dropped ${count} oldest record${count === 1 ? "" : "s"}`;
	const record = {
		0: message,
		_meta: {
			date,
			hostname: target.hostname,
			logLevelName: "WARN",
			name: "openclaw"
		},
		time: formatTimestamp(date, { style: "long" }),
		hostname: target.hostname,
		message,
		dropped: count
	};
	return {
		...target,
		payload: `${serializeRedactedFileLogRecord(record)}\n`
	};
}
function writeFileTransportWarning(message, synchronous) {
	try {
		const line = `${formatConsoleDiagnosticLine({
			level: "warn",
			message: redactSensitiveText(message)
		})}\n`;
		if (synchronous) fs.writeSync(process.stderr.fd, line);
		else process.stderr.write(line);
		return true;
	} catch {
		return false;
	}
}
function warnAboutRotationFailure(entry, synchronous) {
	if (warnedRotationFiles.get(entry.file) === entry.maxFileBytes) return;
	warnedRotationFiles.set(entry.file, entry.maxFileBytes);
	writeFileTransportWarning(`[openclaw] log file rotation failed; continuing writes file=${entry.file} maxFileBytes=${entry.maxFileBytes}`, synchronous);
}
function warnAboutAppendFailure(entry, synchronous) {
	if (warnedAppendFiles.has(entry.file)) return;
	const saturated = warnedAppendFiles.size >= MAX_TRACKED_APPEND_FAILURE_FILES;
	if (saturated && appendFailureTrackingSaturated) return;
	if (!writeFileTransportWarning(saturated ? "[openclaw] log file append failure diagnostics saturated; suppressing new file targets" : `[openclaw] log file append failed; records dropped; check that the path is a writable regular file; file=${entry.file}`, synchronous)) return;
	if (saturated) appendFailureTrackingSaturated = true;
	else warnedAppendFiles.add(entry.file);
}
function clearAppendFailure(entry) {
	if (warnedAppendFiles.delete(entry.file)) appendFailureTrackingSaturated = false;
}
function claimQueuedEntries() {
	const entries = queueStart === 0 ? queue : [...queue.slice(queueStart), ...queue.slice(0, queueStart)];
	queue = [];
	queueStart = 0;
	if (droppedCount > 0 && droppedTarget) entries.unshift(buildDroppedMarker(droppedTarget, droppedCount));
	droppedCount = 0;
	droppedTarget = null;
	return entries;
}
function prepareWrite(entry, cursor, synchronous, entries, index) {
	let payloadBytes = Buffer.byteLength(entry.payload, "utf8");
	if (cursor.bytes > 0 && cursor.bytes + payloadBytes > entry.maxFileBytes) {
		if (rotateLogFile(entry.file)) {
			cursor.bytes = 0;
			warnedRotationFiles.delete(entry.file);
		} else warnAboutRotationFailure(entry, synchronous);
	}
	let nextIndex = index + 1;
	if (synchronous) return {
		payload: entry.payload,
		payloadBytes,
		nextIndex
	};
	const payloads = [entry.payload];
	for (; nextIndex < entries.length; nextIndex += 1) {
		const next = entries[nextIndex];
		if (!next || next.file !== entry.file || next.maxFileBytes !== entry.maxFileBytes) break;
		const nextBytes = Buffer.byteLength(next.payload, "utf8");
		if (payloadBytes + nextBytes > MAX_APPEND_BATCH_BYTES || cursor.bytes + payloadBytes + nextBytes > entry.maxFileBytes) break;
		payloads.push(next.payload);
		payloadBytes += nextBytes;
	}
	return {
		payload: payloads.join(""),
		payloadBytes,
		nextIndex
	};
}
async function writeEntries(entries, generation) {
	const cursors = /* @__PURE__ */ new Map();
	for (let index = 0; index < entries.length;) {
		if (generation !== drainGeneration || processExiting) return;
		const entry = entries[index];
		if (!entry) return;
		let cursor = cursors.get(entry.file);
		if (!cursor) {
			cursor = { bytes: await getCurrentLogFileBytes(entry.file) };
			if (generation !== drainGeneration || processExiting) return;
			cursors.set(entry.file, cursor);
		}
		const batch = prepareWrite(entry, cursor, false, entries, index);
		activeIndex = batch.nextIndex;
		try {
			await appendFile({
				filePath: entry.file,
				content: batch.payload
			});
			cursor.bytes += batch.payloadBytes;
			clearAppendFailure(entry);
		} catch {
			warnAboutAppendFailure(entry, false);
		} finally {
			for (const written of entries.slice(index, batch.nextIndex)) written.payload = "";
			index = batch.nextIndex;
		}
	}
}
function writeEntriesSync(entries) {
	const cursors = /* @__PURE__ */ new Map();
	for (let index = 0; index < entries.length;) {
		const entry = entries[index];
		if (!entry) return;
		let cursor = cursors.get(entry.file);
		if (!cursor) {
			cursor = { bytes: getCurrentLogFileBytesSync(entry.file) };
			cursors.set(entry.file, cursor);
		}
		const batch = prepareWrite(entry, cursor, true, entries, index);
		try {
			appendRegularFileSync({
				filePath: entry.file,
				content: batch.payload
			});
			cursor.bytes += batch.payloadBytes;
			clearAppendFailure(entry);
		} catch {
			warnAboutAppendFailure(entry, true);
		}
		entry.payload = "";
		index = batch.nextIndex;
	}
}
async function runFlushLoop() {
	const generation = drainGeneration;
	for (;;) {
		if (generation !== drainGeneration || processExiting) return;
		const entries = claimQueuedEntries();
		if (entries.length === 0) return;
		activeBatch = entries;
		activeIndex = 0;
		await writeEntries(entries, generation);
		if (generation !== drainGeneration) return;
		activeBatch = null;
		activeIndex = 0;
	}
}
function startFlush() {
	if (flushPromise || processExiting) return;
	const running = runFlushLoop().catch(() => void 0);
	flushPromise = running;
	running.then(() => {
		if (flushPromise === running) flushPromise = null;
		if (queue.length > 0 || droppedCount > 0) scheduleFlush();
	});
}
function scheduleFlush() {
	if (scheduledFlush || flushPromise || processExiting) return;
	scheduledFlush = setImmediate(() => {
		scheduledFlush = null;
		startFlush();
	});
}
function handleProcessBeforeExit() {
	flushFileLogQueue();
}
function handleProcessExit() {
	processExiting = true;
	drainFileLogQueueSync();
}
function installProcessHooks() {
	if (processHooksInstalled) return;
	processHooksInstalled = true;
	process.on("beforeExit", handleProcessBeforeExit);
	process.on("exit", handleProcessExit);
}
function removeProcessHooks() {
	if (!processHooksInstalled) return;
	process.removeListener("beforeExit", handleProcessBeforeExit);
	process.removeListener("exit", handleProcessExit);
	processHooksInstalled = false;
}
/** Enqueues one serialized record without waiting for filesystem I/O. */
function enqueueFileLog(entry) {
	if (processExiting) {
		writeEntriesSync([entry]);
		return;
	}
	installProcessHooks();
	if (queue.length >= maxQueuedRecords) {
		const dropped = queue[queueStart];
		if (dropped) {
			dropped.payload = "";
			droppedTarget ??= dropped;
			droppedCount += 1;
		}
		queue[queueStart] = entry;
		queueStart = (queueStart + 1) % queue.length;
	} else queue.push(entry);
	scheduleFlush();
}
/** Waits until every record currently queued for the async transport has settled. */
async function flushFileLogQueue() {
	for (;;) {
		if (scheduledFlush) {
			clearImmediate(scheduledFlush);
			scheduledFlush = null;
		}
		if (!flushPromise && (queue.length > 0 || droppedCount > 0)) startFlush();
		const running = flushPromise;
		if (!running) return;
		await running;
	}
}
/** Synchronously rescues pending records for process.exit() and crash-adjacent paths. */
function drainFileLogQueueSync() {
	if (scheduledFlush) {
		clearImmediate(scheduledFlush);
		scheduledFlush = null;
	}
	drainGeneration += 1;
	const entries = activeBatch ? activeBatch.slice(activeIndex) : [];
	activeBatch = null;
	activeIndex = 0;
	entries.push(...claimQueuedEntries());
	writeEntriesSync(entries);
}
function setFileLogQueueMaxRecordsForTests(value) {
	maxQueuedRecords = Math.max(1, value ?? DEFAULT_MAX_QUEUED_RECORDS);
}
function setFileLogAppenderForTests(value) {
	appendFile = value ?? appendRegularFile;
}
function resetFileLogTransportForTests() {
	drainFileLogQueueSync();
	removeProcessHooks();
	processExiting = false;
	appendFile = appendRegularFile;
	maxQueuedRecords = DEFAULT_MAX_QUEUED_RECORDS;
	warnedRotationFiles.clear();
	warnedAppendFiles.clear();
	appendFailureTrackingSaturated = false;
}
var DEFAULT_MAX_QUEUED_RECORDS, MAX_APPEND_BATCH_BYTES, MAX_ROTATED_LOG_FILES, MAX_TRACKED_APPEND_FAILURE_FILES, queue, queueStart, activeBatch, activeIndex, droppedCount, droppedTarget, maxQueuedRecords, scheduledFlush, flushPromise, drainGeneration, processExiting, processHooksInstalled, appendFile, warnedRotationFiles, warnedAppendFiles, appendFailureTrackingSaturated, fileLogTransport;
var init_logger_file_transport = __esmMin((() => {
	init_regular_file();
	init_json_console_line();
	init_redact();
	init_timestamps();
	DEFAULT_MAX_QUEUED_RECORDS = 4096;
	MAX_APPEND_BATCH_BYTES = 65536;
	MAX_ROTATED_LOG_FILES = 5;
	MAX_TRACKED_APPEND_FAILURE_FILES = 64;
	queue = [];
	queueStart = 0;
	activeBatch = null;
	activeIndex = 0;
	droppedCount = 0;
	droppedTarget = null;
	maxQueuedRecords = DEFAULT_MAX_QUEUED_RECORDS;
	scheduledFlush = null;
	flushPromise = null;
	drainGeneration = 0;
	processExiting = false;
	processHooksInstalled = false;
	appendFile = appendRegularFile;
	warnedRotationFiles = /* @__PURE__ */ new Map();
	warnedAppendFiles = /* @__PURE__ */ new Set();
	appendFailureTrackingSaturated = false;
	if (process.env.VITEST !== "true") installProcessHooks();
	fileLogTransport = {
		drainSync: drainFileLogQueueSync,
		enqueue: enqueueFileLog,
		flush: flushFileLogQueue,
		resetForTests: resetFileLogTransportForTests,
		setAppenderForTests: setFileLogAppenderForTests,
		setMaxQueuedRecordsForTests: setFileLogQueueMaxRecordsForTests
	};
}));
//#endregion
//#region src/logging/logger-hostname-state.ts
var defaultLoggerHostnameResolver, loggerHostnameState;
var init_logger_hostname_state = __esmMin((() => {
	defaultLoggerHostnameResolver = () => os.hostname();
	loggerHostnameState = {
		cached: null,
		resolver: defaultLoggerHostnameResolver
	};
}));
//#endregion
//#region src/logging/logger-settings-internal.ts
function setLoggerFileTargetResolver(resolver) {
	resolveLoggerFileTarget = resolver;
}
var resolveLoggerFileTarget;
var init_logger_settings_internal = __esmMin((() => {}));
//#endregion
//#region src/logging/logger.ts
function clampDiagnosticLogText(value, maxChars) {
	return value.length > maxChars ? `${truncateUtf16Safe(value, maxChars)}...(truncated)` : value;
}
function sanitizeDiagnosticLogText(value, maxChars) {
	return clampDiagnosticLogText(redactSensitiveText(clampDiagnosticLogText(value, maxChars)), maxChars);
}
function normalizeDiagnosticLogName(value) {
	if (!value || value.trim().startsWith("{")) return;
	const sanitized = sanitizeDiagnosticLogText(value.trim(), MAX_DIAGNOSTIC_LOG_NAME_CHARS);
	return DIAGNOSTIC_LOG_ATTRIBUTE_KEY_RE.test(sanitized) ? sanitized : void 0;
}
function assignDiagnosticLogAttribute(attributes, state, key, value) {
	if (state.count >= MAX_DIAGNOSTIC_LOG_ATTRIBUTE_COUNT) return;
	const normalizedKey = key.trim();
	if (isBlockedObjectKey(normalizedKey)) return;
	if (redactSensitiveText(normalizedKey) !== normalizedKey) return;
	if (!DIAGNOSTIC_LOG_ATTRIBUTE_KEY_RE.test(normalizedKey)) return;
	if (typeof value === "string") {
		attributes[normalizedKey] = sanitizeDiagnosticLogText(value, MAX_DIAGNOSTIC_LOG_ATTRIBUTE_VALUE_CHARS);
		state.count += 1;
		return;
	}
	if (typeof value === "number" && Number.isFinite(value)) {
		attributes[normalizedKey] = value;
		state.count += 1;
		return;
	}
	if (typeof value === "boolean") {
		attributes[normalizedKey] = value;
		state.count += 1;
	}
}
function addDiagnosticLogAttributesFrom(attributes, state, source) {
	if (!source) return;
	for (const key in source) {
		if (state.count >= MAX_DIAGNOSTIC_LOG_ATTRIBUTE_COUNT) break;
		if (!Object.hasOwn(source, key) || key === "trace") continue;
		assignDiagnosticLogAttribute(attributes, state, key, source[key]);
	}
}
function isPlainLogRecordObject(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
}
function normalizeTraceContext(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	const candidate = value;
	if (!isValidDiagnosticTraceId(candidate.traceId)) return;
	if (candidate.spanId !== void 0 && !isValidDiagnosticSpanId(candidate.spanId)) return;
	if (candidate.parentSpanId !== void 0 && !isValidDiagnosticSpanId(candidate.parentSpanId)) return;
	if (candidate.traceFlags !== void 0 && !isValidDiagnosticTraceFlags(candidate.traceFlags)) return;
	return {
		traceId: candidate.traceId,
		...candidate.spanId ? { spanId: candidate.spanId } : {},
		...candidate.parentSpanId ? { parentSpanId: candidate.parentSpanId } : {},
		...candidate.traceFlags ? { traceFlags: candidate.traceFlags } : {}
	};
}
function extractTraceContext(value) {
	const direct = normalizeTraceContext(value);
	if (direct) return direct;
	if (!value || typeof value !== "object" || Array.isArray(value)) return;
	return normalizeTraceContext(value.trace);
}
function getSortedNumericLogEntries(logObj) {
	return Object.entries(logObj).filter(([key]) => /^\d+$/.test(key)).toSorted((a, b) => Number(a[0]) - Number(b[0]));
}
function clampFileLogText(value, maxChars) {
	return value.length > maxChars ? `${truncateUtf16Safe(value, maxChars)}...(truncated)` : value;
}
function normalizeFileLogContextValue(value) {
	if (typeof value === "string") {
		const normalized = value.trim();
		return normalized ? clampFileLogText(normalized, MAX_FILE_LOG_CONTEXT_VALUE_CHARS) : void 0;
	}
	if (typeof value === "number" && Number.isFinite(value)) return String(value);
	if (typeof value === "boolean") return String(value);
}
function readFirstContextString(sources, keys) {
	for (const source of sources) {
		if (!source) continue;
		for (const key of keys) {
			const value = normalizeFileLogContextValue(source[key]);
			if (value) return value;
		}
	}
}
function resolveLogHostname() {
	if (loggerHostnameState.cached) return loggerHostnameState.cached;
	const hostname = loggerHostnameState.resolver().trim();
	if (!hostname) return "unknown";
	loggerHostnameState.cached = hostname;
	return hostname;
}
function withResolvedLogMetaHostname(meta, hostname) {
	if (!meta || typeof meta !== "object" || Array.isArray(meta)) return meta;
	return {
		...meta,
		hostname
	};
}
function extractLogBindingPrefix(numericArgs) {
	if (typeof numericArgs[0] === "string" && numericArgs[0].length <= MAX_DIAGNOSTIC_LOG_BINDINGS_JSON_CHARS && numericArgs[0].trim().startsWith("{")) try {
		const parsed = JSON.parse(numericArgs[0]);
		if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return {
			bindings: parsed,
			args: numericArgs.slice(1)
		};
	} catch {}
	return { args: numericArgs };
}
function findLogTraceContext(bindings, numericArgs) {
	const fromBindings = extractTraceContext(bindings);
	if (fromBindings) return fromBindings;
	for (const arg of numericArgs) {
		const fromArg = extractTraceContext(arg);
		if (fromArg) return fromArg;
	}
}
function resolveLogTraceContext(bindings, numericArgs) {
	const explicitTrace = findLogTraceContext(bindings, numericArgs);
	if (explicitTrace) return {
		trace: explicitTrace,
		trustedTraceContext: false
	};
	const activeTrace = getActiveDiagnosticTraceContext();
	return activeTrace ? {
		trace: activeTrace,
		trustedTraceContext: true
	} : { trustedTraceContext: false };
}
function prepareFileLogRecord(logObj) {
	const entries = getSortedNumericLogEntries(logObj);
	const { bindings, args } = extractLogBindingPrefix(entries.map(([, value]) => value));
	const { trace } = resolveLogTraceContext(bindings, args);
	const structuredArg = isPlainLogRecordObject(args[0]) ? args[0] : void 0;
	const sources = [
		structuredArg,
		bindings,
		logObj
	];
	const metadataCount = structuredArg && typeof structuredArg.message !== "string" ? 1 : 0;
	const messageParts = entries.slice(entries.length - args.length + metadataCount).map(([key, value]) => {
		const part = {
			key,
			json: value != null && ![
				"string",
				"number",
				"boolean",
				"bigint"
			].includes(typeof value) && !(value instanceof Error) && !(isPlainLogRecordObject(value) && typeof value.message === "string")
		};
		if (typeof value === "number" && !Number.isFinite(value)) part.primitiveText = String(value);
		return part;
	});
	const agentId = readFirstContextString(sources, ["agent_id", "agentId"]);
	const sessionId = readFirstContextString(sources, [
		"session_id",
		"sessionId",
		"sessionKey"
	]);
	const channel = readFirstContextString(sources, ["channel", "messageProvider"]);
	return {
		fields: {
			hostname: resolveLogHostname(),
			...agentId ? { agent_id: agentId } : {},
			...sessionId ? { session_id: sessionId } : {},
			...channel ? { channel } : {},
			...trace
		},
		messageParts
	};
}
function buildDiagnosticLogRecord(logObj) {
	const meta = logObj["_meta"];
	const { bindings, args: numericArgs } = extractLogBindingPrefix(getSortedNumericLogEntries(logObj).map(([, value]) => value));
	const { trace, trustedTraceContext } = resolveLogTraceContext(bindings, numericArgs);
	const structuredArg = numericArgs[0];
	const structuredBindings = isPlainLogRecordObject(structuredArg) ? structuredArg : void 0;
	if (structuredBindings) numericArgs.shift();
	let message = "";
	if (numericArgs.length > 0 && typeof numericArgs[numericArgs.length - 1] === "string") message = sanitizeDiagnosticLogText(String(numericArgs.pop()), MAX_DIAGNOSTIC_LOG_MESSAGE_CHARS);
	else if (numericArgs.length === 1 && (typeof numericArgs[0] === "number" || typeof numericArgs[0] === "boolean")) {
		message = String(numericArgs[0]);
		numericArgs.length = 0;
	}
	if (!message) message = "log";
	const attributes = Object.create(null);
	const attributeState = { count: 0 };
	addDiagnosticLogAttributesFrom(attributes, attributeState, bindings);
	addDiagnosticLogAttributesFrom(attributes, attributeState, structuredBindings);
	const code = {};
	if (meta?.path?.fileLine) {
		const line = Number(meta.path.fileLine);
		if (Number.isFinite(line)) code.line = line;
	}
	if (meta?.path?.method) code.functionName = sanitizeDiagnosticLogText(meta.path.method, MAX_DIAGNOSTIC_LOG_NAME_CHARS);
	const loggerName = normalizeDiagnosticLogName(meta?.name);
	const loggerParents = meta?.parentNames?.map(normalizeDiagnosticLogName).filter((name) => Boolean(name));
	return {
		event: {
			type: "log.record",
			level: meta?.logLevelName ?? "INFO",
			message,
			...loggerName ? { loggerName } : {},
			...loggerParents?.length ? { loggerParents } : {},
			...Object.keys(attributes).length > 0 ? { attributes } : {},
			...Object.keys(code).length > 0 ? { code } : {},
			...trace ? { trace } : {}
		},
		trustedTraceContext
	};
}
function attachDiagnosticEventTransport(logger) {
	logger.attachTransport({
		format: () => "",
		write: (logObj) => {
			if (!areDiagnosticsEnabledForProcess() || !hasInternalDiagnosticEventInterest("log.record")) return;
			try {
				const record = buildDiagnosticLogRecord(redactSecrets(logObj));
				(record.trustedTraceContext ? emitDiagnosticEventWithTrustedTraceContext : emitDiagnosticEvent)(record.event);
			} catch {}
		}
	});
}
function canUseSilentVitestFileLogFastPath(envLevel) {
	return process.env.VITEST === "true" && process.env.OPENCLAW_TEST_FILE_LOG !== "1" && !envLevel && !loggingState.overrideSettings;
}
function resolveDefaultActiveLogFile() {
	if (process.env.VITEST === "true" && process.env.OPENCLAW_TEST_FILE_LOG === "1") return path.join(process.cwd(), ".artifacts", "test-logs", `${LOG_PREFIX}-vitest-${process.pid}-${formatLocalDate(/* @__PURE__ */ new Date())}${LOG_SUFFIX}`);
	return resolveDefaultRollingLogFile();
}
function resolveSettings() {
	if (!canUseNodeFs()) return {
		level: "silent",
		file: DEFAULT_LOG_FILE,
		maxFileBytes: DEFAULT_MAX_LOG_FILE_BYTES,
		rolling: false
	};
	const envLevel = resolveEnvLogLevelOverride();
	if (canUseSilentVitestFileLogFastPath(envLevel)) return {
		level: "silent",
		file: resolveDefaultRollingLogFile(),
		maxFileBytes: DEFAULT_MAX_LOG_FILE_BYTES,
		rolling: true
	};
	const cfg = loggingState.overrideSettings ?? readLoggingConfig();
	const defaultLevel = process.env.VITEST === "true" && process.env.OPENCLAW_TEST_FILE_LOG !== "1" ? "silent" : "info";
	const fromConfig = normalizeLogLevel(cfg?.level, defaultLevel);
	const level = envLevel ?? fromConfig;
	const rolling = cfg?.file ? isLegacyRollingLogFilePath(cfg.file) : true;
	return {
		level,
		file: resolveActiveLogFileWithMode(cfg?.file ?? resolveDefaultActiveLogFile(), rolling),
		maxFileBytes: resolveMaxLogFileBytes(cfg?.maxFileBytes),
		rolling
	};
}
function getRuntimeSettings() {
	const settings = loggingState.cachedSettings ?? resolveSettings();
	loggingState.cachedSettings = settings;
	return settings;
}
function isFileLogLevelEnabled(level) {
	const settings = getRuntimeSettings();
	if (level === "silent") return false;
	if (settings.level === "silent") return false;
	return levelToMinLevel(level) >= levelToMinLevel(settings.level);
}
function inheritLogLevel(logger, getLevel) {
	let resolveLevel = getLevel;
	Object.defineProperty(logger.settings, "minLevel", {
		configurable: true,
		enumerable: true,
		get: () => resolveLevel(),
		set: (level) => {
			resolveLevel = () => level;
		}
	});
}
function buildLogger() {
	const logger = new RuntimeLogger({
		name: "openclaw",
		mask: { keys: [] },
		meta: { property: "_meta" },
		minLevel: levelToMinLevel("fatal"),
		type: "hidden"
	});
	inheritLogLevel(logger, () => levelToMinLevel(getRuntimeSettings().level));
	let activeFile;
	logger.attachTransport({
		format: () => "",
		write: (logObj) => {
			try {
				const settings = getRuntimeSettings();
				if (settings.level === "silent") return;
				const nextActiveFile = resolveActiveLogFileWithMode(settings.file, settings.rolling);
				if (nextActiveFile !== activeFile) {
					activeFile = nextActiveFile;
					fs.mkdirSync(path.dirname(activeFile), { recursive: true });
					if (settings.rolling) pruneOldRollingLogs(path.dirname(activeFile));
				}
				const time = formatTimestamp(logObj.date ?? /* @__PURE__ */ new Date(), { style: "long" });
				const { fields, messageParts } = prepareFileLogRecord(logObj);
				const line = serializeRedactedFileLogRecord({
					...logObj,
					_meta: withResolvedLogMetaHostname(logObj["_meta"], expectDefined(fields.hostname, "structured log hostname")),
					time,
					...fields
				}, {
					deriveMessage: (materialized) => buildFileLogMessage(materialized, messageParts),
					decodedOptions: resolveFileLogRedactOptions()
				});
				fileLogTransport.enqueue({
					file: activeFile,
					hostname: expectDefined(fields.hostname, "structured log hostname"),
					maxFileBytes: settings.maxFileBytes,
					payload: `${line}\n`
				});
			} catch {}
		}
	});
	attachDiagnosticEventTransport(logger);
	return logger;
}
function resolveMaxLogFileBytes(raw) {
	if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) return Math.floor(raw);
	return DEFAULT_MAX_LOG_FILE_BYTES;
}
function getLogger() {
	const cachedLogger = loggingState.cachedLogger;
	if (cachedLogger) return cachedLogger;
	getRuntimeSettings();
	const logger = buildLogger();
	loggingState.cachedLogger = logger;
	return logger;
}
function getChildLogger(bindings, opts) {
	const base = getLogger();
	const name = bindings ? JSON.stringify(bindings) : void 0;
	return base.getSubLogger({
		name,
		prefix: bindings ? [name ?? ""] : [],
		...opts?.level ? { minLevel: levelToMinLevel(opts.level) } : {}
	});
}
function resolveActiveLogFileWithMode(file, rolling) {
	const expandedFile = expandHomePrefix(file);
	return rolling ? resolveRollingLogFilePathForDate(expandedFile, /* @__PURE__ */ new Date()) : expandedFile;
}
function pruneOldRollingLogs(dir) {
	try {
		const entries = fs.readdirSync(dir, { withFileTypes: true });
		const cutoff = Date.now() - MAX_LOG_AGE_MS;
		for (const entry of entries) {
			if (!entry.isFile()) continue;
			if (!entry.name.startsWith(`openclaw-`) || !entry.name.endsWith(".log")) continue;
			const fullPath = path.join(dir, entry.name);
			try {
				if (fs.statSync(fullPath).mtimeMs < cutoff) fs.rmSync(fullPath, { force: true });
			} catch {}
		}
	} catch {}
}
var DEFAULT_LOG_FILE, MAX_LOG_AGE_MS, DEFAULT_MAX_LOG_FILE_BYTES, MAX_DIAGNOSTIC_LOG_BINDINGS_JSON_CHARS, MAX_DIAGNOSTIC_LOG_MESSAGE_CHARS, MAX_DIAGNOSTIC_LOG_ATTRIBUTE_COUNT, MAX_DIAGNOSTIC_LOG_ATTRIBUTE_VALUE_CHARS, MAX_DIAGNOSTIC_LOG_NAME_CHARS, MAX_FILE_LOG_CONTEXT_VALUE_CHARS, DIAGNOSTIC_LOG_ATTRIBUTE_KEY_RE, RuntimeLogger;
var init_logger = __esmMin((() => {
	init_src$1();
	init_utf16_slice();
	init_diagnostic_event_listener_presence();
	init_diagnostic_events();
	init_diagnostic_trace_context();
	init_home_dir();
	init_prototype_keys();
	init_tmp_openclaw_dir();
	init_config();
	init_env_log_level();
	init_levels();
	init_log_file_path();
	init_log_file_shared();
	init_logger_file_message();
	init_logger_file_transport();
	init_logger_hostname_state();
	init_logger_settings_internal();
	init_redact();
	init_state();
	init_timestamps();
	DEFAULT_LOG_FILE = `${DEFAULT_POSIX_TMP_ROOT}/openclaw.log`;
	MAX_LOG_AGE_MS = 864e5;
	DEFAULT_MAX_LOG_FILE_BYTES = 104857600;
	MAX_DIAGNOSTIC_LOG_BINDINGS_JSON_CHARS = 8192;
	MAX_DIAGNOSTIC_LOG_MESSAGE_CHARS = 4096;
	MAX_DIAGNOSTIC_LOG_ATTRIBUTE_COUNT = 32;
	MAX_DIAGNOSTIC_LOG_ATTRIBUTE_VALUE_CHARS = 2048;
	MAX_DIAGNOSTIC_LOG_NAME_CHARS = 120;
	MAX_FILE_LOG_CONTEXT_VALUE_CHARS = 512;
	DIAGNOSTIC_LOG_ATTRIBUTE_KEY_RE = /^[A-Za-z0-9_.:-]{1,64}$/u;
	setLoggerFileTargetResolver(() => {
		const { file, rolling } = resolveSettings();
		return {
			file,
			rolling
		};
	});
	RuntimeLogger = class extends Logger {
		getSubLogger(settings, logObj) {
			const minLevel = settings?.minLevel ?? this.settings.minLevel;
			const child = super.getSubLogger({
				...settings,
				minLevel: minLevel === Infinity ? levelToMinLevel("fatal") : minLevel
			}, logObj);
			if (settings?.minLevel == null) inheritLogLevel(child, () => this.settings.minLevel);
			else if (minLevel === Infinity) child.settings.minLevel = minLevel;
			return child;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/util/object-utils.js
function isUndefined(obj) {
	return typeof obj === "undefined" || obj === void 0;
}
function isString(obj) {
	return typeof obj === "string";
}
function isNumber(obj) {
	return typeof obj === "number";
}
function isBoolean(obj) {
	return typeof obj === "boolean";
}
function isNull(obj) {
	return obj === null;
}
function isDate(obj) {
	return obj instanceof Date;
}
function isBigInt(obj) {
	return typeof obj === "bigint";
}
function isFunction(obj) {
	return typeof obj === "function";
}
function isObject(obj) {
	return typeof obj === "object" && obj !== null;
}
function freeze(obj) {
	return Object.freeze(obj);
}
function asArray(arg) {
	if (isReadonlyArray(arg)) return arg;
	else return [arg];
}
function isReadonlyArray(arg) {
	return Array.isArray(arg);
}
function noop(obj) {
	return obj;
}
function getMessage(error) {
	return error instanceof Error ? error.message : String(error);
}
var init_object_utils = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/alter-table-node.js
var AlterTableNode;
var init_alter_table_node = __esmMin((() => {
	init_object_utils();
	AlterTableNode = freeze({
		is(node) {
			return node.kind === "AlterTableNode";
		},
		create(table) {
			return freeze({
				kind: "AlterTableNode",
				table
			});
		},
		cloneWithTableProps(node, props) {
			return freeze({
				...node,
				...props
			});
		},
		cloneWithColumnAlteration(node, columnAlteration) {
			return freeze({
				...node,
				columnAlterations: node.columnAlterations ? [...node.columnAlterations, columnAlteration] : [columnAlteration]
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/identifier-node.js
var IdentifierNode;
var init_identifier_node = __esmMin((() => {
	init_object_utils();
	IdentifierNode = freeze({
		is(node) {
			return node.kind === "IdentifierNode";
		},
		create(name) {
			return freeze({
				kind: "IdentifierNode",
				name
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/create-index-node.js
var CreateIndexNode;
var init_create_index_node = __esmMin((() => {
	init_object_utils();
	init_identifier_node();
	CreateIndexNode = freeze({
		is(node) {
			return node.kind === "CreateIndexNode";
		},
		create(name) {
			return freeze({
				kind: "CreateIndexNode",
				name: IdentifierNode.create(name)
			});
		},
		cloneWith(node, props) {
			return freeze({
				...node,
				...props
			});
		},
		cloneWithColumns(node, columns) {
			return freeze({
				...node,
				columns: [...node.columns || [], ...columns]
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/create-schema-node.js
var CreateSchemaNode;
var init_create_schema_node = __esmMin((() => {
	init_object_utils();
	init_identifier_node();
	CreateSchemaNode = freeze({
		is(node) {
			return node.kind === "CreateSchemaNode";
		},
		create(schema, params) {
			return freeze({
				kind: "CreateSchemaNode",
				schema: IdentifierNode.create(schema),
				...params
			});
		},
		cloneWith(createSchema, params) {
			return freeze({
				...createSchema,
				...params
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/create-table-node.js
var ON_COMMIT_ACTIONS, CreateTableNode;
var init_create_table_node = __esmMin((() => {
	init_object_utils();
	ON_COMMIT_ACTIONS = [
		"preserve rows",
		"delete rows",
		"drop"
	];
	CreateTableNode = freeze({
		is(node) {
			return node.kind === "CreateTableNode";
		},
		create(table) {
			return freeze({
				kind: "CreateTableNode",
				table,
				columns: freeze([])
			});
		},
		cloneWithColumn(node, column) {
			return freeze({
				...node,
				columns: freeze([...node.columns, column])
			});
		},
		cloneWithConstraint(node, constraint) {
			return freeze({
				...node,
				constraints: node.constraints ? freeze([...node.constraints, constraint]) : freeze([constraint])
			});
		},
		cloneWithIndex(node, index) {
			return freeze({
				...node,
				indexes: node.indexes ? freeze([...node.indexes, index]) : freeze([index])
			});
		},
		cloneWithFrontModifier(node, modifier) {
			return freeze({
				...node,
				frontModifiers: node.frontModifiers ? freeze([...node.frontModifiers, modifier]) : freeze([modifier])
			});
		},
		cloneWithEndModifier(node, modifier) {
			return freeze({
				...node,
				endModifiers: node.endModifiers ? freeze([...node.endModifiers, modifier]) : freeze([modifier])
			});
		},
		cloneWith(node, params) {
			return freeze({
				...node,
				...params
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/schemable-identifier-node.js
var SchemableIdentifierNode;
var init_schemable_identifier_node = __esmMin((() => {
	init_object_utils();
	init_identifier_node();
	SchemableIdentifierNode = freeze({
		is(node) {
			return node.kind === "SchemableIdentifierNode";
		},
		create(identifier) {
			return freeze({
				kind: "SchemableIdentifierNode",
				identifier: IdentifierNode.create(identifier)
			});
		},
		createWithSchema(schema, identifier) {
			return freeze({
				kind: "SchemableIdentifierNode",
				schema: IdentifierNode.create(schema),
				identifier: IdentifierNode.create(identifier)
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/drop-index-node.js
var DropIndexNode;
var init_drop_index_node = __esmMin((() => {
	init_object_utils();
	init_schemable_identifier_node();
	DropIndexNode = freeze({
		is(node) {
			return node.kind === "DropIndexNode";
		},
		create(name, params) {
			return freeze({
				kind: "DropIndexNode",
				name: SchemableIdentifierNode.create(name),
				...params
			});
		},
		cloneWith(dropIndex, props) {
			return freeze({
				...dropIndex,
				...props
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/drop-schema-node.js
var DropSchemaNode;
var init_drop_schema_node = __esmMin((() => {
	init_object_utils();
	init_identifier_node();
	DropSchemaNode = freeze({
		is(node) {
			return node.kind === "DropSchemaNode";
		},
		create(schema, params) {
			return freeze({
				kind: "DropSchemaNode",
				schema: IdentifierNode.create(schema),
				...params
			});
		},
		cloneWith(dropSchema, params) {
			return freeze({
				...dropSchema,
				...params
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/drop-table-node.js
var DropTableNode;
var init_drop_table_node = __esmMin((() => {
	init_object_utils();
	DropTableNode = freeze({
		is(node) {
			return node.kind === "DropTableNode";
		},
		create(table, params) {
			return freeze({
				kind: "DropTableNode",
				table,
				...params
			});
		},
		cloneWith(dropIndex, params) {
			return freeze({
				...dropIndex,
				...params
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/alias-node.js
var AliasNode;
var init_alias_node = __esmMin((() => {
	init_object_utils();
	AliasNode = freeze({
		is(node) {
			return node.kind === "AliasNode";
		},
		create(node, alias) {
			return freeze({
				kind: "AliasNode",
				node,
				alias
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/table-node.js
var TableNode;
var init_table_node = __esmMin((() => {
	init_object_utils();
	init_schemable_identifier_node();
	TableNode = freeze({
		is(node) {
			return node.kind === "TableNode";
		},
		create(table) {
			return freeze({
				kind: "TableNode",
				table: SchemableIdentifierNode.create(table)
			});
		},
		createWithSchema(schema, table) {
			return freeze({
				kind: "TableNode",
				table: SchemableIdentifierNode.createWithSchema(schema, table)
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/operation-node-source.js
function isOperationNodeSource(obj) {
	return isObject(obj) && isFunction(obj.toOperationNode);
}
var init_operation_node_source = __esmMin((() => {
	init_object_utils();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/expression/expression.js
function isExpression(obj) {
	return isObject(obj) && "expressionType" in obj && isOperationNodeSource(obj);
}
function isAliasedExpression(obj) {
	return isObject(obj) && "expression" in obj && isString(obj.alias) && isOperationNodeSource(obj);
}
var init_expression = __esmMin((() => {
	init_operation_node_source();
	init_object_utils();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/select-modifier-node.js
var SelectModifierNode;
var init_select_modifier_node = __esmMin((() => {
	init_object_utils();
	SelectModifierNode = freeze({
		is(node) {
			return node.kind === "SelectModifierNode";
		},
		create(modifier, of) {
			return freeze({
				kind: "SelectModifierNode",
				modifier,
				of
			});
		},
		createWithExpression(modifier) {
			return freeze({
				kind: "SelectModifierNode",
				rawModifier: modifier
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/and-node.js
var AndNode;
var init_and_node = __esmMin((() => {
	init_object_utils();
	AndNode = freeze({
		is(node) {
			return node.kind === "AndNode";
		},
		create(left, right) {
			return freeze({
				kind: "AndNode",
				left,
				right
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/or-node.js
var OrNode;
var init_or_node = __esmMin((() => {
	init_object_utils();
	OrNode = freeze({
		is(node) {
			return node.kind === "OrNode";
		},
		create(left, right) {
			return freeze({
				kind: "OrNode",
				left,
				right
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/on-node.js
var OnNode;
var init_on_node = __esmMin((() => {
	init_object_utils();
	init_and_node();
	init_or_node();
	OnNode = freeze({
		is(node) {
			return node.kind === "OnNode";
		},
		create(filter) {
			return freeze({
				kind: "OnNode",
				on: filter
			});
		},
		cloneWithOperation(onNode, operator, operation) {
			return freeze({
				...onNode,
				on: operator === "And" ? AndNode.create(onNode.on, operation) : OrNode.create(onNode.on, operation)
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/join-node.js
var JoinNode;
var init_join_node = __esmMin((() => {
	init_object_utils();
	init_on_node();
	JoinNode = freeze({
		is(node) {
			return node.kind === "JoinNode";
		},
		create(joinType, table) {
			return freeze({
				kind: "JoinNode",
				joinType,
				table,
				on: void 0
			});
		},
		createWithOn(joinType, table, on) {
			return freeze({
				kind: "JoinNode",
				joinType,
				table,
				on: OnNode.create(on)
			});
		},
		cloneWithOn(joinNode, operation) {
			return freeze({
				...joinNode,
				on: joinNode.on ? OnNode.cloneWithOperation(joinNode.on, "And", operation) : OnNode.create(operation)
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/binary-operation-node.js
var BinaryOperationNode;
var init_binary_operation_node = __esmMin((() => {
	init_object_utils();
	BinaryOperationNode = freeze({
		is(node) {
			return node.kind === "BinaryOperationNode";
		},
		create(leftOperand, operator, rightOperand) {
			return freeze({
				kind: "BinaryOperationNode",
				leftOperand,
				operator,
				rightOperand
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/operator-node.js
function isBinaryOperator(op) {
	return isString(op) && BINARY_OPERATORS_DICTIONARY[op];
}
function isJSONOperator(op) {
	return isString(op) && JSON_OPERATORS_DICTIONARY[op];
}
function isUnaryOperator(op) {
	return isString(op) && UNARY_OPERATORS_DICTIONARY[op];
}
var COMPARISON_OPERATORS_DICTIONARY, ARITHMETIC_OPERATORS_DICTIONARY, JSON_OPERATORS_DICTIONARY, JSON_OPERATORS, BINARY_OPERATORS_DICTIONARY, BINARY_OPERATORS, UNARY_FILTER_OPERATORS_DICTIONARY, UNARY_OPERATORS_DICTIONARY, UNARY_OPERATORS, OperatorNode;
var init_operator_node = __esmMin((() => {
	init_object_utils();
	COMPARISON_OPERATORS_DICTIONARY = freeze({
		"=": true,
		"==": true,
		"!=": true,
		"<>": true,
		">": true,
		">=": true,
		"<": true,
		"<=": true,
		in: true,
		"not in": true,
		is: true,
		"is not": true,
		like: true,
		"not like": true,
		match: true,
		ilike: true,
		"not ilike": true,
		"@>": true,
		"<@": true,
		"^@": true,
		"&&": true,
		"?": true,
		"?&": true,
		"?|": true,
		"!<": true,
		"!>": true,
		"<=>": true,
		"!~": true,
		"~": true,
		"~*": true,
		"!~*": true,
		"@@": true,
		"@@@": true,
		"!!": true,
		"<->": true,
		regexp: true,
		"is distinct from": true,
		"is not distinct from": true
	});
	Object.keys(COMPARISON_OPERATORS_DICTIONARY);
	ARITHMETIC_OPERATORS_DICTIONARY = freeze({
		"+": true,
		"-": true,
		"*": true,
		"/": true,
		"%": true,
		"^": true,
		"&": true,
		"|": true,
		"#": true,
		"<<": true,
		">>": true
	});
	Object.keys(ARITHMETIC_OPERATORS_DICTIONARY);
	JSON_OPERATORS_DICTIONARY = freeze({
		"->": true,
		"->>": true
	});
	JSON_OPERATORS = Object.keys(JSON_OPERATORS_DICTIONARY);
	BINARY_OPERATORS_DICTIONARY = freeze({
		...COMPARISON_OPERATORS_DICTIONARY,
		...ARITHMETIC_OPERATORS_DICTIONARY,
		"||": true
	});
	BINARY_OPERATORS = Object.keys(BINARY_OPERATORS_DICTIONARY);
	UNARY_FILTER_OPERATORS_DICTIONARY = freeze({
		exists: true,
		"not exists": true
	});
	Object.keys(UNARY_FILTER_OPERATORS_DICTIONARY);
	UNARY_OPERATORS_DICTIONARY = freeze({
		...UNARY_FILTER_OPERATORS_DICTIONARY,
		"-": true,
		not: true
	});
	UNARY_OPERATORS = Object.keys(UNARY_OPERATORS_DICTIONARY);
	[
		...BINARY_OPERATORS,
		...JSON_OPERATORS,
		...UNARY_OPERATORS
	];
	OperatorNode = freeze({
		is(node) {
			return node.kind === "OperatorNode";
		},
		create(operator) {
			return freeze({
				kind: "OperatorNode",
				operator
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/column-node.js
var ColumnNode;
var init_column_node = __esmMin((() => {
	init_object_utils();
	init_identifier_node();
	ColumnNode = freeze({
		is(node) {
			return node.kind === "ColumnNode";
		},
		create(column) {
			return freeze({
				kind: "ColumnNode",
				column: IdentifierNode.create(column)
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/select-all-node.js
var SelectAllNode;
var init_select_all_node = __esmMin((() => {
	init_object_utils();
	SelectAllNode = freeze({
		is(node) {
			return node.kind === "SelectAllNode";
		},
		create() {
			return freeze({ kind: "SelectAllNode" });
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/reference-node.js
var ReferenceNode;
var init_reference_node = __esmMin((() => {
	init_select_all_node();
	init_object_utils();
	ReferenceNode = freeze({
		is(node) {
			return node.kind === "ReferenceNode";
		},
		create(column, table) {
			return freeze({
				kind: "ReferenceNode",
				table,
				column
			});
		},
		createSelectAll(table) {
			return freeze({
				kind: "ReferenceNode",
				table,
				column: SelectAllNode.create()
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dynamic/dynamic-reference-builder.js
function isDynamicReferenceBuilder(obj) {
	return isObject(obj) && isOperationNodeSource(obj) && isString(obj.dynamicReference);
}
var DynamicReferenceBuilder;
var init_dynamic_reference_builder = __esmMin((() => {
	init_operation_node_source();
	init_reference_parser();
	init_object_utils();
	DynamicReferenceBuilder = class {
		#dynamicReference;
		get dynamicReference() {
			return this.#dynamicReference;
		}
		/**
		* @private
		*
		* This needs to be here just so that the typings work. Without this
		* the generated .d.ts file contains no reference to the type param R
		* which causes this type to be equal to DynamicReferenceBuilder with
		* any R.
		*/
		get refType() {}
		constructor(reference) {
			this.#dynamicReference = reference;
		}
		toOperationNode() {
			return parseSimpleReferenceExpression(this.#dynamicReference);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/order-by-item-node.js
var OrderByItemNode;
var init_order_by_item_node = __esmMin((() => {
	init_object_utils();
	OrderByItemNode = freeze({
		is(node) {
			return node.kind === "OrderByItemNode";
		},
		create(orderBy, direction) {
			return freeze({
				kind: "OrderByItemNode",
				orderBy,
				direction
			});
		},
		cloneWith(node, props) {
			return freeze({
				...node,
				...props
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/raw-node.js
var RawNode;
var init_raw_node = __esmMin((() => {
	init_object_utils();
	RawNode = freeze({
		is(node) {
			return node.kind === "RawNode";
		},
		create(sqlFragments, parameters) {
			return freeze({
				kind: "RawNode",
				sqlFragments: freeze(sqlFragments),
				parameters: freeze(parameters)
			});
		},
		createWithSql(sql) {
			return RawNode.create([sql], []);
		},
		createWithChild(child) {
			return RawNode.create(["", ""], [child]);
		},
		createWithChildren(children) {
			return RawNode.create(new Array(children.length + 1).fill(""), children);
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/collate-node.js
var CollateNode;
var init_collate_node = __esmMin((() => {
	init_object_utils();
	init_identifier_node();
	CollateNode = freeze({
		is(node) {
			return node.kind === "CollateNode";
		},
		create(collation) {
			return freeze({
				kind: "CollateNode",
				collation: IdentifierNode.create(collation)
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/query-builder/order-by-item-builder.js
var OrderByItemBuilder;
var init_order_by_item_builder = __esmMin((() => {
	init_collate_node();
	init_order_by_item_node();
	init_raw_node();
	init_object_utils();
	OrderByItemBuilder = class OrderByItemBuilder {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		/**
		* Adds `desc` to the `order by` item.
		*
		* See {@link asc} for the opposite.
		*/
		desc() {
			return new OrderByItemBuilder({ node: OrderByItemNode.cloneWith(this.#props.node, { direction: RawNode.createWithSql("desc") }) });
		}
		/**
		* Adds `asc` to the `order by` item.
		*
		* See {@link desc} for the opposite.
		*/
		asc() {
			return new OrderByItemBuilder({ node: OrderByItemNode.cloneWith(this.#props.node, { direction: RawNode.createWithSql("asc") }) });
		}
		/**
		* Adds `nulls last` to the `order by` item.
		*
		* This is only supported by some dialects like PostgreSQL and SQLite.
		*
		* See {@link nullsFirst} for the opposite.
		*/
		nullsLast() {
			return new OrderByItemBuilder({ node: OrderByItemNode.cloneWith(this.#props.node, { nulls: "last" }) });
		}
		/**
		* Adds `nulls first` to the `order by` item.
		*
		* This is only supported by some dialects like PostgreSQL and SQLite.
		*
		* See {@link nullsLast} for the opposite.
		*/
		nullsFirst() {
			return new OrderByItemBuilder({ node: OrderByItemNode.cloneWith(this.#props.node, { nulls: "first" }) });
		}
		/**
		* Adds `collate <collationName>` to the `order by` item.
		*/
		collate(collation) {
			return new OrderByItemBuilder({ node: OrderByItemNode.cloneWith(this.#props.node, { collation: CollateNode.create(collation) }) });
		}
		toOperationNode() {
			return this.#props.node;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/util/log-once.js
/**
* Use for system-level logging, such as deprecation messages.
* Logs a message and ensures it won't be logged again.
*/
function logOnce(message) {
	if (LOGGED_MESSAGES.has(message)) return;
	LOGGED_MESSAGES.add(message);
	console.log(message);
}
var LOGGED_MESSAGES;
var init_log_once = __esmMin((() => {
	LOGGED_MESSAGES = /* @__PURE__ */ new Set();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/parser/order-by-parser.js
function isOrderByDirection(thing) {
	return thing === "asc" || thing === "desc";
}
function parseOrderBy(args) {
	if (args.length === 2) return [parseOrderByItem(args[0], args[1])];
	if (args.length === 1) {
		const [orderBy] = args;
		if (Array.isArray(orderBy)) {
			logOnce("orderBy(array) is deprecated, use multiple orderBy calls instead.");
			return orderBy.map((item) => parseOrderByItem(item));
		}
		return [parseOrderByItem(orderBy)];
	}
	throw new Error(`Invalid number of arguments at order by! expected 1-2, received ${args.length}`);
}
function parseOrderByItem(expr, modifiers) {
	const parsedRef = parseOrderByExpression(expr);
	if (OrderByItemNode.is(parsedRef)) {
		if (modifiers) throw new Error("Cannot specify direction twice!");
		return parsedRef;
	}
	return parseOrderByWithModifiers(parsedRef, modifiers);
}
function parseOrderByExpression(expr) {
	if (isExpressionOrFactory(expr)) return parseExpression(expr);
	if (isDynamicReferenceBuilder(expr)) return expr.toOperationNode();
	const [ref, direction] = expr.split(" ");
	if (direction) {
		logOnce("`orderBy('column asc')` is deprecated. Use `orderBy('column', 'asc')` instead.");
		return parseOrderByWithModifiers(parseStringReference(ref), direction);
	}
	return parseStringReference(expr);
}
function parseOrderByWithModifiers(expr, modifiers) {
	if (typeof modifiers === "string") {
		if (!isOrderByDirection(modifiers)) throw new Error(`Invalid order by direction: ${modifiers}`);
		return OrderByItemNode.create(expr, RawNode.createWithSql(modifiers));
	}
	if (isExpression(modifiers)) {
		logOnce("`orderBy(..., expr)` is deprecated. Use `orderBy(..., 'asc')` or `orderBy(..., (ob) => ...)` instead.");
		return OrderByItemNode.create(expr, modifiers.toOperationNode());
	}
	const node = OrderByItemNode.create(expr);
	if (!modifiers) return node;
	return modifiers(new OrderByItemBuilder({ node })).toOperationNode();
}
var init_order_by_parser = __esmMin((() => {
	init_dynamic_reference_builder();
	init_expression();
	init_order_by_item_node();
	init_raw_node();
	init_order_by_item_builder();
	init_log_once();
	init_expression_parser();
	init_reference_parser();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/json-reference-node.js
var JSONReferenceNode;
var init_json_reference_node = __esmMin((() => {
	init_object_utils();
	JSONReferenceNode = freeze({
		is(node) {
			return node.kind === "JSONReferenceNode";
		},
		create(reference, traversal) {
			return freeze({
				kind: "JSONReferenceNode",
				reference,
				traversal
			});
		},
		cloneWithTraversal(node, traversal) {
			return freeze({
				...node,
				traversal
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/json-operator-chain-node.js
var JSONOperatorChainNode;
var init_json_operator_chain_node = __esmMin((() => {
	init_object_utils();
	JSONOperatorChainNode = freeze({
		is(node) {
			return node.kind === "JSONOperatorChainNode";
		},
		create(operator) {
			return freeze({
				kind: "JSONOperatorChainNode",
				operator,
				values: freeze([])
			});
		},
		cloneWithValue(node, value) {
			return freeze({
				...node,
				values: freeze([...node.values, value])
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/json-path-node.js
var JSONPathNode;
var init_json_path_node = __esmMin((() => {
	init_object_utils();
	JSONPathNode = freeze({
		is(node) {
			return node.kind === "JSONPathNode";
		},
		create(inOperator) {
			return freeze({
				kind: "JSONPathNode",
				inOperator,
				pathLegs: freeze([])
			});
		},
		cloneWithLeg(jsonPathNode, pathLeg) {
			return freeze({
				...jsonPathNode,
				pathLegs: freeze([...jsonPathNode.pathLegs, pathLeg])
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/parser/reference-parser.js
function parseSimpleReferenceExpression(exp) {
	if (isString(exp)) return parseStringReference(exp);
	return exp.toOperationNode();
}
function parseReferenceExpressionOrList(arg) {
	if (isReadonlyArray(arg)) return arg.map((it) => parseReferenceExpression(it));
	else return [parseReferenceExpression(arg)];
}
function parseReferenceExpression(exp) {
	if (isExpressionOrFactory(exp)) return parseExpression(exp);
	return parseSimpleReferenceExpression(exp);
}
function parseJSONReference(ref, op) {
	if (isJSONOperator(op)) return JSONReferenceNode.create(parseStringReference(ref), JSONOperatorChainNode.create(OperatorNode.create(op)));
	if (op === "->$" || op === "->>$") return JSONReferenceNode.create(parseStringReference(ref), JSONPathNode.create(OperatorNode.create(op.slice(0, -1))));
	throw new Error(`Invalid JSON operator: ${op}`);
}
function parseStringReference(ref) {
	const COLUMN_SEPARATOR = ".";
	if (!ref.includes(COLUMN_SEPARATOR)) return ReferenceNode.create(ColumnNode.create(ref));
	const parts = ref.split(COLUMN_SEPARATOR).map(trim$2);
	if (parts.length === 3) return parseStringReferenceWithTableAndSchema(parts);
	if (parts.length === 2) return parseStringReferenceWithTable(parts);
	throw new Error(`invalid column reference ${ref}`);
}
function parseAliasedStringReference(ref) {
	const ALIAS_SEPARATOR = " as ";
	if (ref.includes(ALIAS_SEPARATOR)) {
		const [columnRef, alias] = ref.split(ALIAS_SEPARATOR).map(trim$2);
		return AliasNode.create(parseStringReference(columnRef), IdentifierNode.create(alias));
	} else return parseStringReference(ref);
}
function parseColumnName(column) {
	return ColumnNode.create(column);
}
function parseOrderedColumnName(column) {
	const ORDER_SEPARATOR = " ";
	if (column.includes(ORDER_SEPARATOR)) {
		const [columnName, order] = column.split(ORDER_SEPARATOR).map(trim$2);
		if (!isOrderByDirection(order)) throw new Error(`invalid order direction "${order}" next to "${columnName}"`);
		return parseOrderBy([columnName, order])[0];
	} else return parseColumnName(column);
}
function parseStringReferenceWithTableAndSchema(parts) {
	const [schema, table, column] = parts;
	return ReferenceNode.create(ColumnNode.create(column), TableNode.createWithSchema(schema, table));
}
function parseStringReferenceWithTable(parts) {
	const [table, column] = parts;
	return ReferenceNode.create(ColumnNode.create(column), TableNode.create(table));
}
function trim$2(str) {
	return str.trim();
}
var init_reference_parser = __esmMin((() => {
	init_alias_node();
	init_column_node();
	init_reference_node();
	init_table_node();
	init_object_utils();
	init_expression_parser();
	init_identifier_node();
	init_order_by_parser();
	init_operator_node();
	init_json_reference_node();
	init_json_operator_chain_node();
	init_json_path_node();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/primitive-value-list-node.js
var PrimitiveValueListNode;
var init_primitive_value_list_node = __esmMin((() => {
	init_object_utils();
	PrimitiveValueListNode = freeze({
		is(node) {
			return node.kind === "PrimitiveValueListNode";
		},
		create(values) {
			return freeze({
				kind: "PrimitiveValueListNode",
				values: freeze([...values])
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/value-list-node.js
var ValueListNode;
var init_value_list_node = __esmMin((() => {
	init_object_utils();
	ValueListNode = freeze({
		is(node) {
			return node.kind === "ValueListNode";
		},
		create(values) {
			return freeze({
				kind: "ValueListNode",
				values: freeze(values)
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/value-node.js
var ValueNode;
var init_value_node = __esmMin((() => {
	init_object_utils();
	ValueNode = freeze({
		is(node) {
			return node.kind === "ValueNode";
		},
		create(value) {
			return freeze({
				kind: "ValueNode",
				value
			});
		},
		createImmediate(value) {
			return freeze({
				kind: "ValueNode",
				value,
				immediate: true
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/parser/value-parser.js
function parseValueExpressionOrList(arg) {
	if (isReadonlyArray(arg)) return parseValueExpressionList(arg);
	return parseValueExpression(arg);
}
function parseValueExpression(exp) {
	if (isExpressionOrFactory(exp)) return parseExpression(exp);
	return ValueNode.create(exp);
}
function isSafeImmediateValue(value) {
	return isNumber(value) || isBoolean(value) || isNull(value);
}
function parseSafeImmediateValue(value) {
	if (!isSafeImmediateValue(value)) throw new Error(`unsafe immediate value ${JSON.stringify(value)}`);
	return ValueNode.createImmediate(value);
}
function parseValueExpressionList(arg) {
	if (arg.some(isExpressionOrFactory)) return ValueListNode.create(arg.map((it) => parseValueExpression(it)));
	return PrimitiveValueListNode.create(arg);
}
var init_value_parser = __esmMin((() => {
	init_primitive_value_list_node();
	init_value_list_node();
	init_value_node();
	init_object_utils();
	init_expression_parser();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/parens-node.js
var ParensNode;
var init_parens_node = __esmMin((() => {
	init_object_utils();
	ParensNode = freeze({
		is(node) {
			return node.kind === "ParensNode";
		},
		create(node) {
			return freeze({
				kind: "ParensNode",
				node
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/parser/binary-operation-parser.js
function parseValueBinaryOperationOrExpression(args) {
	if (args.length === 3) return parseValueBinaryOperation(args[0], args[1], args[2]);
	else if (args.length === 1) return parseValueExpression(args[0]);
	throw new Error(`invalid arguments: ${JSON.stringify(args)}`);
}
function parseValueBinaryOperation(left, operator, right) {
	if (isIsOperator(operator) && needsIsOperator(right)) return BinaryOperationNode.create(parseReferenceExpression(left), parseBinaryOperator(operator), ValueNode.createImmediate(right));
	return BinaryOperationNode.create(parseReferenceExpression(left), parseBinaryOperator(operator), parseValueExpressionOrList(right));
}
function parseReferentialBinaryOperation(left, operator, right) {
	return BinaryOperationNode.create(parseReferenceExpression(left), parseBinaryOperator(operator), parseReferenceExpression(right));
}
function parseFilterObject(obj, combinator) {
	return parseFilterList(Object.entries(obj).filter(([, v]) => !isUndefined(v)).map(([k, v]) => parseValueBinaryOperation(k, needsIsOperator(v) ? "is" : "=", v)), combinator);
}
function parseFilterList(list, combinator, withParens = true) {
	const combine = combinator === "and" ? AndNode.create : OrNode.create;
	if (list.length === 0) return BinaryOperationNode.create(ValueNode.createImmediate(1), OperatorNode.create("="), ValueNode.createImmediate(combinator === "and" ? 1 : 0));
	let node = toOperationNode(list[0]);
	for (let i = 1; i < list.length; ++i) node = combine(node, toOperationNode(list[i]));
	if (list.length > 1 && withParens) return ParensNode.create(node);
	return node;
}
function isIsOperator(operator) {
	return operator === "is" || operator === "is not";
}
function needsIsOperator(value) {
	return isNull(value) || isBoolean(value);
}
function parseBinaryOperator(operator) {
	if (isBinaryOperator(operator)) return OperatorNode.create(operator);
	if (isOperationNodeSource(operator)) return operator.toOperationNode();
	throw new Error(`invalid operator ${JSON.stringify(operator)}`);
}
function toOperationNode(nodeOrSource) {
	return isOperationNodeSource(nodeOrSource) ? nodeOrSource.toOperationNode() : nodeOrSource;
}
var init_binary_operation_parser = __esmMin((() => {
	init_binary_operation_node();
	init_object_utils();
	init_operation_node_source();
	init_operator_node();
	init_reference_parser();
	init_value_parser();
	init_value_node();
	init_and_node();
	init_parens_node();
	init_or_node();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/order-by-node.js
var OrderByNode;
var init_order_by_node = __esmMin((() => {
	init_object_utils();
	OrderByNode = freeze({
		is(node) {
			return node.kind === "OrderByNode";
		},
		create(items) {
			return freeze({
				kind: "OrderByNode",
				items: freeze([...items])
			});
		},
		cloneWithItems(orderBy, items) {
			return freeze({
				...orderBy,
				items: freeze([...orderBy.items, ...items])
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/partition-by-node.js
var PartitionByNode;
var init_partition_by_node = __esmMin((() => {
	init_object_utils();
	PartitionByNode = freeze({
		is(node) {
			return node.kind === "PartitionByNode";
		},
		create(items) {
			return freeze({
				kind: "PartitionByNode",
				items: freeze(items)
			});
		},
		cloneWithItems(partitionBy, items) {
			return freeze({
				...partitionBy,
				items: freeze([...partitionBy.items, ...items])
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/over-node.js
var OverNode;
var init_over_node = __esmMin((() => {
	init_object_utils();
	init_order_by_node();
	init_partition_by_node();
	OverNode = freeze({
		is(node) {
			return node.kind === "OverNode";
		},
		create() {
			return freeze({ kind: "OverNode" });
		},
		cloneWithOrderByItems(overNode, items) {
			return freeze({
				...overNode,
				orderBy: overNode.orderBy ? OrderByNode.cloneWithItems(overNode.orderBy, items) : OrderByNode.create(items)
			});
		},
		cloneWithPartitionByItems(overNode, items) {
			return freeze({
				...overNode,
				partitionBy: overNode.partitionBy ? PartitionByNode.cloneWithItems(overNode.partitionBy, items) : PartitionByNode.create(items)
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/from-node.js
var FromNode;
var init_from_node = __esmMin((() => {
	init_object_utils();
	FromNode = freeze({
		is(node) {
			return node.kind === "FromNode";
		},
		create(froms) {
			return freeze({
				kind: "FromNode",
				froms: freeze(froms)
			});
		},
		cloneWithFroms(from, froms) {
			return freeze({
				...from,
				froms: freeze([...from.froms, ...froms])
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/group-by-node.js
var GroupByNode;
var init_group_by_node = __esmMin((() => {
	init_object_utils();
	GroupByNode = freeze({
		is(node) {
			return node.kind === "GroupByNode";
		},
		create(items) {
			return freeze({
				kind: "GroupByNode",
				items: freeze(items)
			});
		},
		cloneWithItems(groupBy, items) {
			return freeze({
				...groupBy,
				items: freeze([...groupBy.items, ...items])
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/having-node.js
var HavingNode;
var init_having_node = __esmMin((() => {
	init_object_utils();
	init_and_node();
	init_or_node();
	HavingNode = freeze({
		is(node) {
			return node.kind === "HavingNode";
		},
		create(filter) {
			return freeze({
				kind: "HavingNode",
				having: filter
			});
		},
		cloneWithOperation(havingNode, operator, operation) {
			return freeze({
				...havingNode,
				having: operator === "And" ? AndNode.create(havingNode.having, operation) : OrNode.create(havingNode.having, operation)
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/insert-query-node.js
var InsertQueryNode;
var init_insert_query_node = __esmMin((() => {
	init_object_utils();
	InsertQueryNode = freeze({
		is(node) {
			return node.kind === "InsertQueryNode";
		},
		create(into, withNode, replace) {
			return freeze({
				kind: "InsertQueryNode",
				into,
				...withNode && { with: withNode },
				replace
			});
		},
		createWithoutInto() {
			return freeze({ kind: "InsertQueryNode" });
		},
		cloneWith(insertQuery, props) {
			return freeze({
				...insertQuery,
				...props
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/list-node.js
var ListNode;
var init_list_node = __esmMin((() => {
	init_object_utils();
	ListNode = freeze({
		is(node) {
			return node.kind === "ListNode";
		},
		create(items) {
			return freeze({
				kind: "ListNode",
				items: freeze(items)
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/update-query-node.js
var UpdateQueryNode;
var init_update_query_node = __esmMin((() => {
	init_object_utils();
	init_from_node();
	init_list_node();
	UpdateQueryNode = freeze({
		is(node) {
			return node.kind === "UpdateQueryNode";
		},
		create(tables, withNode) {
			return freeze({
				kind: "UpdateQueryNode",
				table: tables.length === 1 ? tables[0] : ListNode.create(tables),
				...withNode && { with: withNode }
			});
		},
		createWithoutTable() {
			return freeze({ kind: "UpdateQueryNode" });
		},
		cloneWithFromItems(updateQuery, fromItems) {
			return freeze({
				...updateQuery,
				from: updateQuery.from ? FromNode.cloneWithFroms(updateQuery.from, fromItems) : FromNode.create(fromItems)
			});
		},
		cloneWithUpdates(updateQuery, updates) {
			return freeze({
				...updateQuery,
				updates: updateQuery.updates ? freeze([...updateQuery.updates, ...updates]) : updates
			});
		},
		cloneWithLimit(updateQuery, limit) {
			return freeze({
				...updateQuery,
				limit
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/using-node.js
var UsingNode;
var init_using_node = __esmMin((() => {
	init_object_utils();
	UsingNode = freeze({
		is(node) {
			return node.kind === "UsingNode";
		},
		create(tables) {
			return freeze({
				kind: "UsingNode",
				tables: freeze(tables)
			});
		},
		cloneWithTables(using, tables) {
			return freeze({
				...using,
				tables: freeze([...using.tables, ...tables])
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/delete-query-node.js
var DeleteQueryNode;
var init_delete_query_node = __esmMin((() => {
	init_object_utils();
	init_from_node();
	init_using_node();
	init_query_node();
	DeleteQueryNode = freeze({
		is(node) {
			return node.kind === "DeleteQueryNode";
		},
		create(fromItems, withNode) {
			return freeze({
				kind: "DeleteQueryNode",
				from: FromNode.create(fromItems),
				...withNode && { with: withNode }
			});
		},
		/**
		* @deprecated Use `QueryNode.cloneWithoutOrderBy` instead.
		*/
		cloneWithOrderByItems: (node, items) => QueryNode.cloneWithOrderByItems(node, items),
		/**
		* @deprecated Use `QueryNode.cloneWithoutOrderBy` instead.
		*/
		cloneWithoutOrderBy: (node) => QueryNode.cloneWithoutOrderBy(node),
		cloneWithLimit(deleteNode, limit) {
			return freeze({
				...deleteNode,
				limit
			});
		},
		cloneWithoutLimit(deleteNode) {
			return freeze({
				...deleteNode,
				limit: void 0
			});
		},
		cloneWithUsing(deleteNode, tables) {
			return freeze({
				...deleteNode,
				using: deleteNode.using !== void 0 ? UsingNode.cloneWithTables(deleteNode.using, tables) : UsingNode.create(tables)
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/where-node.js
var WhereNode;
var init_where_node = __esmMin((() => {
	init_object_utils();
	init_and_node();
	init_or_node();
	WhereNode = freeze({
		is(node) {
			return node.kind === "WhereNode";
		},
		create(filter) {
			return freeze({
				kind: "WhereNode",
				where: filter
			});
		},
		cloneWithOperation(whereNode, operator, operation) {
			return freeze({
				...whereNode,
				where: operator === "And" ? AndNode.create(whereNode.where, operation) : OrNode.create(whereNode.where, operation)
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/returning-node.js
var ReturningNode;
var init_returning_node = __esmMin((() => {
	init_object_utils();
	ReturningNode = freeze({
		is(node) {
			return node.kind === "ReturningNode";
		},
		create(selections) {
			return freeze({
				kind: "ReturningNode",
				selections: freeze(selections)
			});
		},
		cloneWithSelections(returning, selections) {
			return freeze({
				...returning,
				selections: returning.selections ? freeze([...returning.selections, ...selections]) : freeze(selections)
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/explain-node.js
var ExplainNode;
var init_explain_node = __esmMin((() => {
	init_object_utils();
	ExplainNode = freeze({
		is(node) {
			return node.kind === "ExplainNode";
		},
		create(format, options) {
			return freeze({
				kind: "ExplainNode",
				format,
				options
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/when-node.js
var WhenNode;
var init_when_node = __esmMin((() => {
	init_object_utils();
	WhenNode = freeze({
		is(node) {
			return node.kind === "WhenNode";
		},
		create(condition) {
			return freeze({
				kind: "WhenNode",
				condition
			});
		},
		cloneWithResult(whenNode, result) {
			return freeze({
				...whenNode,
				result
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/merge-query-node.js
var MergeQueryNode;
var init_merge_query_node = __esmMin((() => {
	init_object_utils();
	init_when_node();
	MergeQueryNode = freeze({
		is(node) {
			return node.kind === "MergeQueryNode";
		},
		create(into, withNode) {
			return freeze({
				kind: "MergeQueryNode",
				into,
				...withNode && { with: withNode }
			});
		},
		cloneWithUsing(mergeNode, using) {
			return freeze({
				...mergeNode,
				using
			});
		},
		cloneWithWhen(mergeNode, when) {
			return freeze({
				...mergeNode,
				whens: mergeNode.whens ? freeze([...mergeNode.whens, when]) : freeze([when])
			});
		},
		cloneWithThen(mergeNode, then) {
			return freeze({
				...mergeNode,
				whens: mergeNode.whens ? freeze([...mergeNode.whens.slice(0, -1), WhenNode.cloneWithResult(mergeNode.whens[mergeNode.whens.length - 1], then)]) : void 0
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/output-node.js
var OutputNode;
var init_output_node = __esmMin((() => {
	init_object_utils();
	OutputNode = freeze({
		is(node) {
			return node.kind === "OutputNode";
		},
		create(selections) {
			return freeze({
				kind: "OutputNode",
				selections: freeze(selections)
			});
		},
		cloneWithSelections(output, selections) {
			return freeze({
				...output,
				selections: output.selections ? freeze([...output.selections, ...selections]) : freeze(selections)
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/query-node.js
var QueryNode;
var init_query_node = __esmMin((() => {
	init_insert_query_node();
	init_select_query_node();
	init_update_query_node();
	init_delete_query_node();
	init_where_node();
	init_object_utils();
	init_returning_node();
	init_explain_node();
	init_merge_query_node();
	init_output_node();
	init_order_by_node();
	QueryNode = freeze({
		is(node) {
			return SelectQueryNode.is(node) || InsertQueryNode.is(node) || UpdateQueryNode.is(node) || DeleteQueryNode.is(node) || MergeQueryNode.is(node);
		},
		cloneWithEndModifier(node, modifier) {
			return freeze({
				...node,
				endModifiers: node.endModifiers ? freeze([...node.endModifiers, modifier]) : freeze([modifier])
			});
		},
		cloneWithWhere(node, operation) {
			return freeze({
				...node,
				where: node.where ? WhereNode.cloneWithOperation(node.where, "And", operation) : WhereNode.create(operation)
			});
		},
		cloneWithJoin(node, join) {
			return freeze({
				...node,
				joins: node.joins ? freeze([...node.joins, join]) : freeze([join])
			});
		},
		cloneWithReturning(node, selections) {
			return freeze({
				...node,
				returning: node.returning ? ReturningNode.cloneWithSelections(node.returning, selections) : ReturningNode.create(selections)
			});
		},
		cloneWithoutReturning(node) {
			return freeze({
				...node,
				returning: void 0
			});
		},
		cloneWithoutWhere(node) {
			return freeze({
				...node,
				where: void 0
			});
		},
		cloneWithExplain(node, format, options) {
			return freeze({
				...node,
				explain: ExplainNode.create(format, options?.toOperationNode())
			});
		},
		cloneWithTop(node, top) {
			return freeze({
				...node,
				top
			});
		},
		cloneWithOutput(node, selections) {
			return freeze({
				...node,
				output: node.output ? OutputNode.cloneWithSelections(node.output, selections) : OutputNode.create(selections)
			});
		},
		cloneWithOrderByItems(node, items) {
			return freeze({
				...node,
				orderBy: node.orderBy ? OrderByNode.cloneWithItems(node.orderBy, items) : OrderByNode.create(items)
			});
		},
		cloneWithoutOrderBy(node) {
			return freeze({
				...node,
				orderBy: void 0
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/select-query-node.js
var SelectQueryNode;
var init_select_query_node = __esmMin((() => {
	init_object_utils();
	init_from_node();
	init_group_by_node();
	init_having_node();
	init_query_node();
	SelectQueryNode = freeze({
		is(node) {
			return node.kind === "SelectQueryNode";
		},
		create(withNode) {
			return freeze({
				kind: "SelectQueryNode",
				...withNode && { with: withNode }
			});
		},
		createFrom(fromItems, withNode) {
			return freeze({
				kind: "SelectQueryNode",
				from: FromNode.create(fromItems),
				...withNode && { with: withNode }
			});
		},
		cloneWithSelections(select, selections) {
			return freeze({
				...select,
				selections: select.selections ? freeze([...select.selections, ...selections]) : freeze(selections)
			});
		},
		cloneWithDistinctOn(select, expressions) {
			return freeze({
				...select,
				distinctOn: select.distinctOn ? freeze([...select.distinctOn, ...expressions]) : freeze(expressions)
			});
		},
		cloneWithFrontModifier(select, modifier) {
			return freeze({
				...select,
				frontModifiers: select.frontModifiers ? freeze([...select.frontModifiers, modifier]) : freeze([modifier])
			});
		},
		/**
		* @deprecated Use `QueryNode.cloneWithoutOrderBy` instead.
		*/
		cloneWithOrderByItems: (node, items) => QueryNode.cloneWithOrderByItems(node, items),
		cloneWithGroupByItems(selectNode, items) {
			return freeze({
				...selectNode,
				groupBy: selectNode.groupBy ? GroupByNode.cloneWithItems(selectNode.groupBy, items) : GroupByNode.create(items)
			});
		},
		cloneWithLimit(selectNode, limit) {
			return freeze({
				...selectNode,
				limit
			});
		},
		cloneWithOffset(selectNode, offset) {
			return freeze({
				...selectNode,
				offset
			});
		},
		cloneWithFetch(selectNode, fetch) {
			return freeze({
				...selectNode,
				fetch
			});
		},
		cloneWithHaving(selectNode, operation) {
			return freeze({
				...selectNode,
				having: selectNode.having ? HavingNode.cloneWithOperation(selectNode.having, "And", operation) : HavingNode.create(operation)
			});
		},
		cloneWithSetOperations(selectNode, setOperations) {
			return freeze({
				...selectNode,
				setOperations: selectNode.setOperations ? freeze([...selectNode.setOperations, ...setOperations]) : freeze([...setOperations])
			});
		},
		cloneWithoutSelections(select) {
			return freeze({
				...select,
				selections: []
			});
		},
		cloneWithoutLimit(select) {
			return freeze({
				...select,
				limit: void 0
			});
		},
		cloneWithoutOffset(select) {
			return freeze({
				...select,
				offset: void 0
			});
		},
		/**
		* @deprecated Use `QueryNode.cloneWithoutOrderBy` instead.
		*/
		cloneWithoutOrderBy: (node) => QueryNode.cloneWithoutOrderBy(node),
		cloneWithoutGroupBy(select) {
			return freeze({
				...select,
				groupBy: void 0
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/query-builder/join-builder.js
var JoinBuilder;
var init_join_builder = __esmMin((() => {
	init_join_node();
	init_raw_node();
	init_binary_operation_parser();
	init_object_utils();
	JoinBuilder = class JoinBuilder {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		on(...args) {
			return new JoinBuilder({
				...this.#props,
				joinNode: JoinNode.cloneWithOn(this.#props.joinNode, parseValueBinaryOperationOrExpression(args))
			});
		}
		/**
		* Just like {@link WhereInterface.whereRef} but adds an item to the join's
		* `on` clause instead.
		*
		* See {@link WhereInterface.whereRef} for documentation and examples.
		*/
		onRef(lhs, op, rhs) {
			return new JoinBuilder({
				...this.#props,
				joinNode: JoinNode.cloneWithOn(this.#props.joinNode, parseReferentialBinaryOperation(lhs, op, rhs))
			});
		}
		/**
		* Adds `on true`.
		*/
		onTrue() {
			return new JoinBuilder({
				...this.#props,
				joinNode: JoinNode.cloneWithOn(this.#props.joinNode, RawNode.createWithSql("true"))
			});
		}
		/**
		* Simply calls the provided function passing `this` as the only argument. `$call` returns
		* what the provided function returns.
		*/
		$call(func) {
			return func(this);
		}
		toOperationNode() {
			return this.#props.joinNode;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/partition-by-item-node.js
var PartitionByItemNode;
var init_partition_by_item_node = __esmMin((() => {
	init_object_utils();
	PartitionByItemNode = freeze({
		is(node) {
			return node.kind === "PartitionByItemNode";
		},
		create(partitionBy) {
			return freeze({
				kind: "PartitionByItemNode",
				partitionBy
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/parser/partition-by-parser.js
function parsePartitionBy(partitionBy) {
	return parseReferenceExpressionOrList(partitionBy).map(PartitionByItemNode.create);
}
var init_partition_by_parser = __esmMin((() => {
	init_partition_by_item_node();
	init_reference_parser();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/query-builder/over-builder.js
var OverBuilder;
var init_over_builder = __esmMin((() => {
	init_over_node();
	init_query_node();
	init_order_by_parser();
	init_partition_by_parser();
	init_object_utils();
	OverBuilder = class OverBuilder {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		orderBy(...args) {
			return new OverBuilder({ overNode: OverNode.cloneWithOrderByItems(this.#props.overNode, parseOrderBy(args)) });
		}
		clearOrderBy() {
			return new OverBuilder({ overNode: QueryNode.cloneWithoutOrderBy(this.#props.overNode) });
		}
		partitionBy(partitionBy) {
			return new OverBuilder({ overNode: OverNode.cloneWithPartitionByItems(this.#props.overNode, parsePartitionBy(partitionBy)) });
		}
		/**
		* Simply calls the provided function passing `this` as the only argument. `$call` returns
		* what the provided function returns.
		*/
		$call(func) {
			return func(this);
		}
		toOperationNode() {
			return this.#props.overNode;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/selection-node.js
var SelectionNode;
var init_selection_node = __esmMin((() => {
	init_object_utils();
	init_reference_node();
	init_select_all_node();
	SelectionNode = freeze({
		is(node) {
			return node.kind === "SelectionNode";
		},
		create(selection) {
			return freeze({
				kind: "SelectionNode",
				selection
			});
		},
		createSelectAll() {
			return freeze({
				kind: "SelectionNode",
				selection: SelectAllNode.create()
			});
		},
		createSelectAllFromTable(table) {
			return freeze({
				kind: "SelectionNode",
				selection: ReferenceNode.createSelectAll(table)
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/parser/select-parser.js
function parseSelectArg(selection) {
	if (isFunction(selection)) return parseSelectArg(selection(expressionBuilder()));
	else if (isReadonlyArray(selection)) return selection.map((it) => parseSelectExpression(it));
	else return [parseSelectExpression(selection)];
}
function parseSelectExpression(selection) {
	if (isString(selection)) return SelectionNode.create(parseAliasedStringReference(selection));
	else if (isDynamicReferenceBuilder(selection)) return SelectionNode.create(selection.toOperationNode());
	else return SelectionNode.create(parseAliasedExpression(selection));
}
function parseSelectAll(table) {
	if (!table) return [SelectionNode.createSelectAll()];
	else if (Array.isArray(table)) return table.map(parseSelectAllArg);
	else return [parseSelectAllArg(table)];
}
function parseSelectAllArg(table) {
	if (isString(table)) return SelectionNode.createSelectAllFromTable(parseTable(table));
	throw new Error(`invalid value selectAll expression: ${JSON.stringify(table)}`);
}
var init_select_parser = __esmMin((() => {
	init_object_utils();
	init_selection_node();
	init_reference_parser();
	init_dynamic_reference_builder();
	init_expression_parser();
	init_table_parser();
	init_expression_builder();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/values-node.js
var ValuesNode;
var init_values_node = __esmMin((() => {
	init_object_utils();
	ValuesNode = freeze({
		is(node) {
			return node.kind === "ValuesNode";
		},
		create(values) {
			return freeze({
				kind: "ValuesNode",
				values: freeze(values)
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/default-insert-value-node.js
var DefaultInsertValueNode;
var init_default_insert_value_node = __esmMin((() => {
	init_object_utils();
	DefaultInsertValueNode = freeze({
		is(node) {
			return node.kind === "DefaultInsertValueNode";
		},
		create() {
			return freeze({ kind: "DefaultInsertValueNode" });
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/parser/insert-values-parser.js
function parseInsertExpression(arg) {
	const objectOrList = isFunction(arg) ? arg(expressionBuilder()) : arg;
	return parseInsertColumnsAndValues(isReadonlyArray(objectOrList) ? objectOrList : freeze([objectOrList]));
}
function parseInsertColumnsAndValues(rows) {
	const columns = parseColumnNamesAndIndexes(rows);
	return [freeze([...columns.keys()].map(ColumnNode.create)), ValuesNode.create(rows.map((row) => parseRowValues(row, columns)))];
}
function parseColumnNamesAndIndexes(rows) {
	const columns = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const cols = Object.keys(row);
		for (const col of cols) if (!columns.has(col) && row[col] !== void 0) columns.set(col, columns.size);
	}
	return columns;
}
function parseRowValues(row, columns) {
	const rowColumns = Object.keys(row);
	const rowValues = Array.from({ length: columns.size });
	let hasUndefinedOrComplexColumns = false;
	let indexedRowColumns = rowColumns.length;
	for (const col of rowColumns) {
		const columnIdx = columns.get(col);
		if (isUndefined(columnIdx)) {
			indexedRowColumns--;
			continue;
		}
		const value = row[col];
		if (isUndefined(value) || isExpressionOrFactory(value)) hasUndefinedOrComplexColumns = true;
		rowValues[columnIdx] = value;
	}
	if (indexedRowColumns < columns.size || hasUndefinedOrComplexColumns) {
		const defaultValue = DefaultInsertValueNode.create();
		return ValueListNode.create(rowValues.map((it) => isUndefined(it) ? defaultValue : parseValueExpression(it)));
	}
	return PrimitiveValueListNode.create(rowValues);
}
var init_insert_values_parser = __esmMin((() => {
	init_column_node();
	init_primitive_value_list_node();
	init_value_list_node();
	init_object_utils();
	init_value_parser();
	init_values_node();
	init_expression_parser();
	init_default_insert_value_node();
	init_expression_builder();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/column-update-node.js
var ColumnUpdateNode;
var init_column_update_node = __esmMin((() => {
	init_object_utils();
	ColumnUpdateNode = freeze({
		is(node) {
			return node.kind === "ColumnUpdateNode";
		},
		create(column, value) {
			return freeze({
				kind: "ColumnUpdateNode",
				column,
				value
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/parser/update-set-parser.js
function parseUpdate(...args) {
	if (args.length === 2) return [ColumnUpdateNode.create(parseReferenceExpression(args[0]), parseValueExpression(args[1]))];
	return parseUpdateObjectExpression(args[0]);
}
function parseUpdateObjectExpression(update) {
	const updateObj = isFunction(update) ? update(expressionBuilder()) : update;
	return Object.entries(updateObj).filter(([_, value]) => value !== void 0).map(([key, value]) => {
		return ColumnUpdateNode.create(ColumnNode.create(key), parseValueExpression(value));
	});
}
var init_update_set_parser = __esmMin((() => {
	init_column_node();
	init_column_update_node();
	init_expression_builder();
	init_object_utils();
	init_value_parser();
	init_reference_parser();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/on-duplicate-key-node.js
var OnDuplicateKeyNode;
var init_on_duplicate_key_node = __esmMin((() => {
	init_object_utils();
	OnDuplicateKeyNode = freeze({
		is(node) {
			return node.kind === "OnDuplicateKeyNode";
		},
		create(updates) {
			return freeze({
				kind: "OnDuplicateKeyNode",
				updates
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/query-builder/insert-result.js
var InsertResult;
var init_insert_result = __esmMin((() => {
	InsertResult = class {
		/**
		* The auto incrementing primary key of the inserted row.
		*
		* This property can be undefined when the query contains an `on conflict`
		* clause that makes the query succeed even when nothing gets inserted.
		*
		* This property is always undefined on dialects like PostgreSQL that
		* don't return the inserted id by default. On those dialects you need
		* to use the {@link ReturningInterface.returning | returning} method.
		*/
		insertId;
		/**
		* Affected rows count.
		*/
		numInsertedOrUpdatedRows;
		constructor(insertId, numInsertedOrUpdatedRows) {
			this.insertId = insertId;
			this.numInsertedOrUpdatedRows = numInsertedOrUpdatedRows;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/query-builder/no-result-error.js
function isNoResultErrorConstructor(fn) {
	return Object.prototype.hasOwnProperty.call(fn, "prototype");
}
var NoResultError;
var init_no_result_error = __esmMin((() => {
	NoResultError = class extends Error {
		/**
		* The operation node tree of the query that was executed.
		*/
		node;
		constructor(node) {
			super("no result");
			this.node = node;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/on-conflict-node.js
var OnConflictNode;
var init_on_conflict_node = __esmMin((() => {
	init_object_utils();
	init_where_node();
	OnConflictNode = freeze({
		is(node) {
			return node.kind === "OnConflictNode";
		},
		create() {
			return freeze({ kind: "OnConflictNode" });
		},
		cloneWith(node, props) {
			return freeze({
				...node,
				...props
			});
		},
		cloneWithIndexWhere(node, operation) {
			return freeze({
				...node,
				indexWhere: node.indexWhere ? WhereNode.cloneWithOperation(node.indexWhere, "And", operation) : WhereNode.create(operation)
			});
		},
		cloneWithIndexOrWhere(node, operation) {
			return freeze({
				...node,
				indexWhere: node.indexWhere ? WhereNode.cloneWithOperation(node.indexWhere, "Or", operation) : WhereNode.create(operation)
			});
		},
		cloneWithUpdateWhere(node, operation) {
			return freeze({
				...node,
				updateWhere: node.updateWhere ? WhereNode.cloneWithOperation(node.updateWhere, "And", operation) : WhereNode.create(operation)
			});
		},
		cloneWithUpdateOrWhere(node, operation) {
			return freeze({
				...node,
				updateWhere: node.updateWhere ? WhereNode.cloneWithOperation(node.updateWhere, "Or", operation) : WhereNode.create(operation)
			});
		},
		cloneWithoutIndexWhere(node) {
			return freeze({
				...node,
				indexWhere: void 0
			});
		},
		cloneWithoutUpdateWhere(node) {
			return freeze({
				...node,
				updateWhere: void 0
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/query-builder/on-conflict-builder.js
var OnConflictBuilder, OnConflictDoNothingBuilder, OnConflictUpdateBuilder;
var init_on_conflict_builder = __esmMin((() => {
	init_column_node();
	init_identifier_node();
	init_on_conflict_node();
	init_binary_operation_parser();
	init_update_set_parser();
	init_object_utils();
	OnConflictBuilder = class OnConflictBuilder {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		/**
		* Specify a single column as the conflict target.
		*
		* Also see the {@link columns}, {@link constraint} and {@link expression}
		* methods for alternative ways to specify the conflict target.
		*/
		column(column) {
			const columnNode = ColumnNode.create(column);
			return new OnConflictBuilder({
				...this.#props,
				onConflictNode: OnConflictNode.cloneWith(this.#props.onConflictNode, { columns: this.#props.onConflictNode.columns ? freeze([...this.#props.onConflictNode.columns, columnNode]) : freeze([columnNode]) })
			});
		}
		/**
		* Specify a list of columns as the conflict target.
		*
		* Also see the {@link column}, {@link constraint} and {@link expression}
		* methods for alternative ways to specify the conflict target.
		*/
		columns(columns) {
			const columnNodes = columns.map(ColumnNode.create);
			return new OnConflictBuilder({
				...this.#props,
				onConflictNode: OnConflictNode.cloneWith(this.#props.onConflictNode, { columns: this.#props.onConflictNode.columns ? freeze([...this.#props.onConflictNode.columns, ...columnNodes]) : freeze(columnNodes) })
			});
		}
		/**
		* Specify a specific constraint by name as the conflict target.
		*
		* Also see the {@link column}, {@link columns} and {@link expression}
		* methods for alternative ways to specify the conflict target.
		*/
		constraint(constraintName) {
			return new OnConflictBuilder({
				...this.#props,
				onConflictNode: OnConflictNode.cloneWith(this.#props.onConflictNode, { constraint: IdentifierNode.create(constraintName) })
			});
		}
		/**
		* Specify an expression as the conflict target.
		*
		* This can be used if the unique index is an expression index.
		*
		* Also see the {@link column}, {@link columns} and {@link constraint}
		* methods for alternative ways to specify the conflict target.
		*/
		expression(expression) {
			return new OnConflictBuilder({
				...this.#props,
				onConflictNode: OnConflictNode.cloneWith(this.#props.onConflictNode, { indexExpression: expression.toOperationNode() })
			});
		}
		where(...args) {
			return new OnConflictBuilder({
				...this.#props,
				onConflictNode: OnConflictNode.cloneWithIndexWhere(this.#props.onConflictNode, parseValueBinaryOperationOrExpression(args))
			});
		}
		whereRef(lhs, op, rhs) {
			return new OnConflictBuilder({
				...this.#props,
				onConflictNode: OnConflictNode.cloneWithIndexWhere(this.#props.onConflictNode, parseReferentialBinaryOperation(lhs, op, rhs))
			});
		}
		clearWhere() {
			return new OnConflictBuilder({
				...this.#props,
				onConflictNode: OnConflictNode.cloneWithoutIndexWhere(this.#props.onConflictNode)
			});
		}
		/**
		* Adds the "do nothing" conflict action.
		*
		* ### Examples
		*
		* ```ts
		* const id = 1
		* const first_name = 'John'
		*
		* await db
		*   .insertInto('person')
		*   .values({ first_name, id })
		*   .onConflict((oc) => oc
		*     .column('id')
		*     .doNothing()
		*   )
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* insert into "person" ("first_name", "id")
		* values ($1, $2)
		* on conflict ("id") do nothing
		* ```
		*/
		doNothing() {
			return new OnConflictDoNothingBuilder({
				...this.#props,
				onConflictNode: OnConflictNode.cloneWith(this.#props.onConflictNode, { doNothing: true })
			});
		}
		/**
		* Adds the "do update set" conflict action.
		*
		* ### Examples
		*
		* ```ts
		* const id = 1
		* const first_name = 'John'
		*
		* await db
		*   .insertInto('person')
		*   .values({ first_name, id })
		*   .onConflict((oc) => oc
		*     .column('id')
		*     .doUpdateSet({ first_name })
		*   )
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* insert into "person" ("first_name", "id")
		* values ($1, $2)
		* on conflict ("id")
		* do update set "first_name" = $3
		* ```
		*
		* In the next example we use the `ref` method to reference
		* columns of the virtual table `excluded` in a type-safe way
		* to create an upsert operation:
		*
		* ```ts
		* import type { NewPerson } from 'type-editor' // imaginary module
		*
		* async function upsertPerson(person: NewPerson): Promise<void> {
		*   await db.insertInto('person')
		*     .values(person)
		*     .onConflict((oc) => oc
		*       .column('id')
		*       .doUpdateSet((eb) => ({
		*         first_name: eb.ref('excluded.first_name'),
		*         last_name: eb.ref('excluded.last_name')
		*       })
		*     )
		*   )
		*   .execute()
		* }
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* insert into "person" ("first_name", "last_name")
		* values ($1, $2)
		* on conflict ("id")
		* do update set
		*  "first_name" = excluded."first_name",
		*  "last_name" = excluded."last_name"
		* ```
		*/
		doUpdateSet(update) {
			return new OnConflictUpdateBuilder({
				...this.#props,
				onConflictNode: OnConflictNode.cloneWith(this.#props.onConflictNode, { updates: parseUpdateObjectExpression(update) })
			});
		}
		/**
		* Simply calls the provided function passing `this` as the only argument. `$call` returns
		* what the provided function returns.
		*/
		$call(func) {
			return func(this);
		}
	};
	OnConflictDoNothingBuilder = class {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		toOperationNode() {
			return this.#props.onConflictNode;
		}
	};
	OnConflictUpdateBuilder = class OnConflictUpdateBuilder {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		where(...args) {
			return new OnConflictUpdateBuilder({
				...this.#props,
				onConflictNode: OnConflictNode.cloneWithUpdateWhere(this.#props.onConflictNode, parseValueBinaryOperationOrExpression(args))
			});
		}
		/**
		* Specify a where condition for the update operation.
		*
		* See {@link WhereInterface.whereRef} for more info.
		*/
		whereRef(lhs, op, rhs) {
			return new OnConflictUpdateBuilder({
				...this.#props,
				onConflictNode: OnConflictNode.cloneWithUpdateWhere(this.#props.onConflictNode, parseReferentialBinaryOperation(lhs, op, rhs))
			});
		}
		clearWhere() {
			return new OnConflictUpdateBuilder({
				...this.#props,
				onConflictNode: OnConflictNode.cloneWithoutUpdateWhere(this.#props.onConflictNode)
			});
		}
		/**
		* Simply calls the provided function passing `this` as the only argument. `$call` returns
		* what the provided function returns.
		*/
		$call(func) {
			return func(this);
		}
		toOperationNode() {
			return this.#props.onConflictNode;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/top-node.js
var TopNode;
var init_top_node = __esmMin((() => {
	init_object_utils();
	TopNode = freeze({
		is(node) {
			return node.kind === "TopNode";
		},
		create(expression, modifiers) {
			return freeze({
				kind: "TopNode",
				expression,
				modifiers
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/parser/top-parser.js
function parseTop(expression, modifiers) {
	if (!isNumber(expression) && !isBigInt(expression)) throw new Error(`Invalid top expression: ${expression}`);
	if (!isUndefined(modifiers) && !isTopModifiers(modifiers)) throw new Error(`Invalid top modifiers: ${modifiers}`);
	return TopNode.create(expression, modifiers);
}
function isTopModifiers(modifiers) {
	return modifiers === "percent" || modifiers === "with ties" || modifiers === "percent with ties";
}
var init_top_parser = __esmMin((() => {
	init_top_node();
	init_object_utils();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/or-action-node.js
var OrActionNode;
var init_or_action_node = __esmMin((() => {
	init_object_utils();
	OrActionNode = freeze({
		is(node) {
			return node.kind === "OrActionNode";
		},
		create(action) {
			return freeze({
				kind: "OrActionNode",
				action
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/query-builder/insert-query-builder.js
var InsertQueryBuilder;
var init_insert_query_builder = __esmMin((() => {
	init_select_parser();
	init_insert_values_parser();
	init_insert_query_node();
	init_query_node();
	init_update_set_parser();
	init_object_utils();
	init_on_duplicate_key_node();
	init_insert_result();
	init_no_result_error();
	init_expression_parser();
	init_column_node();
	init_on_conflict_builder();
	init_on_conflict_node();
	init_top_parser();
	init_or_action_node();
	InsertQueryBuilder = class InsertQueryBuilder {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		/**
		* Sets the values to insert for an {@link Kysely.insertInto | insert} query.
		*
		* This method takes an object whose keys are column names and values are
		* values to insert. In addition to the column's type, the values can be
		* raw {@link sql} snippets or select queries.
		*
		* You must provide all fields you haven't explicitly marked as nullable
		* or optional using {@link Generated} or {@link ColumnType}.
		*
		* The return value of an `insert` query is an instance of {@link InsertResult}. The
		* {@link InsertResult.insertId | insertId} field holds the auto incremented primary
		* key if the database returned one.
		*
		* On PostgreSQL and some other dialects, you need to call `returning` to get
		* something out of the query.
		*
		* Also see the {@link expression} method for inserting the result of a select
		* query or any other expression.
		*
		* ### Examples
		*
		* <!-- siteExample("insert", "Single row", 10) -->
		*
		* Insert a single row:
		*
		* ```ts
		* const result = await db
		*   .insertInto('person')
		*   .values({
		*     first_name: 'Jennifer',
		*     last_name: 'Aniston',
		*     age: 40
		*   })
		*   .executeTakeFirst()
		*
		* // `insertId` is only available on dialects that
		* // automatically return the id of the inserted row
		* // such as MySQL and SQLite. On PostgreSQL, for example,
		* // you need to add a `returning` clause to the query to
		* // get anything out. See the "returning data" example.
		* console.log(result.insertId)
		* ```
		*
		* The generated SQL (MySQL):
		*
		* ```sql
		* insert into `person` (`first_name`, `last_name`, `age`) values (?, ?, ?)
		* ```
		*
		* <!-- siteExample("insert", "Multiple rows", 20) -->
		*
		* On dialects that support it (for example PostgreSQL) you can insert multiple
		* rows by providing an array. Note that the return value is once again very
		* dialect-specific. Some databases may only return the id of the *last* inserted
		* row and some return nothing at all unless you call `returning`.
		*
		* ```ts
		* await db
		*   .insertInto('person')
		*   .values([{
		*     first_name: 'Jennifer',
		*     last_name: 'Aniston',
		*     age: 40,
		*   }, {
		*     first_name: 'Arnold',
		*     last_name: 'Schwarzenegger',
		*     age: 70,
		*   }])
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* insert into "person" ("first_name", "last_name", "age") values (($1, $2, $3), ($4, $5, $6))
		* ```
		*
		* <!-- siteExample("insert", "Returning data", 30) -->
		*
		* On supported dialects like PostgreSQL you need to chain `returning` to the query to get
		* the inserted row's columns (or any other expression) as the return value. `returning`
		* works just like `select`. Refer to `select` method's examples and documentation for
		* more info.
		*
		* ```ts
		* const result = await db
		*   .insertInto('person')
		*   .values({
		*     first_name: 'Jennifer',
		*     last_name: 'Aniston',
		*     age: 40,
		*   })
		*   .returning(['id', 'first_name as name'])
		*   .executeTakeFirstOrThrow()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* insert into "person" ("first_name", "last_name", "age") values ($1, $2, $3) returning "id", "first_name" as "name"
		* ```
		*
		* <!-- siteExample("insert", "Complex values", 40) -->
		*
		* In addition to primitives, the values can also be arbitrary expressions.
		* You can build the expressions by using a callback and calling the methods
		* on the expression builder passed to it:
		*
		* ```ts
		* import { sql } from 'kysely'
		*
		* const ani = "Ani"
		* const ston = "ston"
		*
		* const result = await db
		*   .insertInto('person')
		*   .values(({ ref, selectFrom, fn }) => ({
		*     first_name: 'Jennifer',
		*     last_name: sql<string>`concat(${ani}, ${ston})`,
		*     middle_name: ref('first_name'),
		*     age: selectFrom('person')
		*       .select(fn.avg<number>('age').as('avg_age')),
		*   }))
		*   .executeTakeFirst()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* insert into "person" (
		*   "first_name",
		*   "last_name",
		*   "middle_name",
		*   "age"
		* )
		* values (
		*   $1,
		*   concat($2, $3),
		*   "first_name",
		*   (select avg("age") as "avg_age" from "person")
		* )
		* ```
		*
		* You can also use the callback version of subqueries or raw expressions:
		*
		* ```ts
		* await db.with('jennifer', (db) => db
		*   .selectFrom('person')
		*   .where('first_name', '=', 'Jennifer')
		*   .select(['id', 'first_name', 'gender'])
		*   .limit(1)
		* ).insertInto('pet').values((eb) => ({
		*   owner_id: eb.selectFrom('jennifer').select('id'),
		*   name: eb.selectFrom('jennifer').select('first_name'),
		*   species: 'cat',
		* }))
		* .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* with "jennifer" as (
		*   select "id", "first_name", "gender"
		*   from "person"
		*   where "first_name" = $1
		*   limit $2
		* )
		* insert into "pet" ("owner_id", "name", "species")
		* values (
		*  (select "id" from "jennifer"),
		*  (select "first_name" from "jennifer"),
		*  $3
		* )
		* ```
		*/
		values(insert) {
			const [columns, values] = parseInsertExpression(insert);
			return new InsertQueryBuilder({
				...this.#props,
				queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, {
					columns,
					values
				})
			});
		}
		/**
		* Sets the columns to insert.
		*
		* The {@link values} method sets both the columns and the values and this method
		* is not needed. But if you are using the {@link expression} method, you can use
		* this method to set the columns to insert.
		*
		* ### Examples
		*
		* ```ts
		* await db.insertInto('person')
		*   .columns(['first_name'])
		*   .expression((eb) => eb.selectFrom('pet').select('pet.name'))
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* insert into "person" ("first_name")
		* select "pet"."name" from "pet"
		* ```
		*/
		columns(columns) {
			return new InsertQueryBuilder({
				...this.#props,
				queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, { columns: freeze(columns.map(ColumnNode.create)) })
			});
		}
		/**
		* Insert an arbitrary expression. For example the result of a select query.
		*
		* ### Examples
		*
		* <!-- siteExample("insert", "Insert subquery", 50) -->
		*
		* You can create an `INSERT INTO SELECT FROM` query using the `expression` method.
		* This API doesn't follow our WYSIWYG principles and might be a bit difficult to
		* remember. The reasons for this design stem from implementation difficulties.
		*
		* ```ts
		* const result = await db.insertInto('person')
		*   .columns(['first_name', 'last_name', 'age'])
		*   .expression((eb) => eb
		*     .selectFrom('pet')
		*     .select((eb) => [
		*       'pet.name',
		*       eb.val('Petson').as('last_name'),
		*       eb.lit(7).as('age'),
		*     ])
		*   )
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* insert into "person" ("first_name", "last_name", "age")
		* select "pet"."name", $1 as "last_name", 7 as "age from "pet"
		* ```
		*/
		expression(expression) {
			return new InsertQueryBuilder({
				...this.#props,
				queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, { values: parseExpression(expression) })
			});
		}
		/**
		* Creates an `insert into "person" default values` query.
		*
		* ### Examples
		*
		* ```ts
		* await db.insertInto('person')
		*   .defaultValues()
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* insert into "person" default values
		* ```
		*/
		defaultValues() {
			return new InsertQueryBuilder({
				...this.#props,
				queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, { defaultValues: true })
			});
		}
		/**
		* This can be used to add any additional SQL to the end of the query.
		*
		* ### Examples
		*
		* ```ts
		* import { sql } from 'kysely'
		*
		* await db.insertInto('person')
		*   .values({
		*     first_name: 'John',
		*     last_name: 'Doe',
		*     gender: 'male',
		*   })
		*   .modifyEnd(sql`-- This is a comment`)
		*   .execute()
		* ```
		*
		* The generated SQL (MySQL):
		*
		* ```sql
		* insert into `person` ("first_name", "last_name", "gender")
		* values (?, ?, ?) -- This is a comment
		* ```
		*/
		modifyEnd(modifier) {
			return new InsertQueryBuilder({
				...this.#props,
				queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, modifier.toOperationNode())
			});
		}
		/**
		* Changes an `insert into` query to an `insert ignore into` query.
		*
		* This is only supported by some dialects like MySQL.
		*
		* To avoid a footgun, when invoked with the SQLite dialect, this method will
		* be handled like {@link orIgnore}. See also, {@link orAbort}, {@link orFail},
		* {@link orReplace}, and {@link orRollback}.
		*
		* If you use the ignore modifier, ignorable errors that occur while executing the
		* insert statement are ignored. For example, without ignore, a row that duplicates
		* an existing unique index or primary key value in the table causes a duplicate-key
		* error and the statement is aborted. With ignore, the row is discarded and no error
		* occurs.
		*
		* ### Examples
		*
		* ```ts
		* await db.insertInto('person')
		*   .ignore()
		*   .values({
		*     first_name: 'John',
		*     last_name: 'Doe',
		*     gender: 'female',
		*   })
		*   .execute()
		* ```
		*
		* The generated SQL (MySQL):
		*
		* ```sql
		* insert ignore into `person` (`first_name`, `last_name`, `gender`) values (?, ?, ?)
		* ```
		*
		* The generated SQL (SQLite):
		*
		* ```sql
		* insert or ignore into "person" ("first_name", "last_name", "gender") values (?, ?, ?)
		* ```
		*/
		ignore() {
			return new InsertQueryBuilder({
				...this.#props,
				queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, { orAction: OrActionNode.create("ignore") })
			});
		}
		/**
		* Changes an `insert into` query to an `insert or ignore into` query.
		*
		* This is only supported by some dialects like SQLite.
		*
		* To avoid a footgun, when invoked with the MySQL dialect, this method will
		* be handled like {@link ignore}.
		*
		* See also, {@link orAbort}, {@link orFail}, {@link orReplace}, and {@link orRollback}.
		*
		* ### Examples
		*
		* ```ts
		* await db.insertInto('person')
		*   .orIgnore()
		*   .values({
		*     first_name: 'John',
		*     last_name: 'Doe',
		*     gender: 'female',
		*   })
		*   .execute()
		* ```
		*
		* The generated SQL (SQLite):
		*
		* ```sql
		* insert or ignore into "person" ("first_name", "last_name", "gender") values (?, ?, ?)
		* ```
		*
		* The generated SQL (MySQL):
		*
		* ```sql
		* insert ignore into `person` (`first_name`, `last_name`, `gender`) values (?, ?, ?)
		* ```
		*/
		orIgnore() {
			return new InsertQueryBuilder({
				...this.#props,
				queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, { orAction: OrActionNode.create("ignore") })
			});
		}
		/**
		* Changes an `insert into` query to an `insert or abort into` query.
		*
		* This is only supported by some dialects like SQLite.
		*
		* See also, {@link orIgnore}, {@link orFail}, {@link orReplace}, and {@link orRollback}.
		*
		* ### Examples
		*
		* ```ts
		* await db.insertInto('person')
		*   .orAbort()
		*   .values({
		*     first_name: 'John',
		*     last_name: 'Doe',
		*     gender: 'female',
		*   })
		*   .execute()
		* ```
		*
		* The generated SQL (SQLite):
		*
		* ```sql
		* insert or abort into "person" ("first_name", "last_name", "gender") values (?, ?, ?)
		* ```
		*/
		orAbort() {
			return new InsertQueryBuilder({
				...this.#props,
				queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, { orAction: OrActionNode.create("abort") })
			});
		}
		/**
		* Changes an `insert into` query to an `insert or fail into` query.
		*
		* This is only supported by some dialects like SQLite.
		*
		* See also, {@link orIgnore}, {@link orAbort}, {@link orReplace}, and {@link orRollback}.
		*
		* ### Examples
		*
		* ```ts
		* await db.insertInto('person')
		*   .orFail()
		*   .values({
		*     first_name: 'John',
		*     last_name: 'Doe',
		*     gender: 'female',
		*   })
		*   .execute()
		* ```
		*
		* The generated SQL (SQLite):
		*
		* ```sql
		* insert or fail into "person" ("first_name", "last_name", "gender") values (?, ?, ?)
		* ```
		*/
		orFail() {
			return new InsertQueryBuilder({
				...this.#props,
				queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, { orAction: OrActionNode.create("fail") })
			});
		}
		/**
		* Changes an `insert into` query to an `insert or replace into` query.
		*
		* This is only supported by some dialects like SQLite.
		*
		* You can also use {@link Kysely.replaceInto} to achieve the same result.
		*
		* See also, {@link orIgnore}, {@link orAbort}, {@link orFail}, and {@link orRollback}.
		*
		* ### Examples
		*
		* ```ts
		* await db.insertInto('person')
		*   .orReplace()
		*   .values({
		*     first_name: 'John',
		*     last_name: 'Doe',
		*     gender: 'female',
		*   })
		*   .execute()
		* ```
		*
		* The generated SQL (SQLite):
		*
		* ```sql
		* insert or replace into "person" ("first_name", "last_name", "gender") values (?, ?, ?)
		* ```
		*/
		orReplace() {
			return new InsertQueryBuilder({
				...this.#props,
				queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, { orAction: OrActionNode.create("replace") })
			});
		}
		/**
		* Changes an `insert into` query to an `insert or rollback into` query.
		*
		* This is only supported by some dialects like SQLite.
		*
		* See also, {@link orIgnore}, {@link orAbort}, {@link orFail}, and {@link orReplace}.
		*
		* ### Examples
		*
		* ```ts
		* await db.insertInto('person')
		*   .orRollback()
		*   .values({
		*     first_name: 'John',
		*     last_name: 'Doe',
		*     gender: 'female',
		*   })
		*   .execute()
		* ```
		*
		* The generated SQL (SQLite):
		*
		* ```sql
		* insert or rollback into "person" ("first_name", "last_name", "gender") values (?, ?, ?)
		* ```
		*/
		orRollback() {
			return new InsertQueryBuilder({
				...this.#props,
				queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, { orAction: OrActionNode.create("rollback") })
			});
		}
		/**
		* Changes an `insert into` query to an `insert top into` query.
		*
		* `top` clause is only supported by some dialects like MS SQL Server.
		*
		* ### Examples
		*
		* Insert the first 5 rows:
		*
		* ```ts
		* import { sql } from 'kysely'
		*
		* await db.insertInto('person')
		*   .top(5)
		*   .columns(['first_name', 'gender'])
		*   .expression(
		*     (eb) => eb.selectFrom('pet').select(['name', sql.lit('other').as('gender')])
		*   )
		*   .execute()
		* ```
		*
		* The generated SQL (MS SQL Server):
		*
		* ```sql
		* insert top(5) into "person" ("first_name", "gender") select "name", 'other' as "gender" from "pet"
		* ```
		*
		* Insert the first 50 percent of rows:
		*
		* ```ts
		* import { sql } from 'kysely'
		*
		* await db.insertInto('person')
		*   .top(50, 'percent')
		*   .columns(['first_name', 'gender'])
		*   .expression(
		*     (eb) => eb.selectFrom('pet').select(['name', sql.lit('other').as('gender')])
		*   )
		*   .execute()
		* ```
		*
		* The generated SQL (MS SQL Server):
		*
		* ```sql
		* insert top(50) percent into "person" ("first_name", "gender") select "name", 'other' as "gender" from "pet"
		* ```
		*/
		top(expression, modifiers) {
			return new InsertQueryBuilder({
				...this.#props,
				queryNode: QueryNode.cloneWithTop(this.#props.queryNode, parseTop(expression, modifiers))
			});
		}
		/**
		* Adds an `on conflict` clause to the query.
		*
		* `on conflict` is only supported by some dialects like PostgreSQL and SQLite. On MySQL
		* you can use {@link ignore} and {@link onDuplicateKeyUpdate} to achieve similar results.
		*
		* ### Examples
		*
		* ```ts
		* await db
		*   .insertInto('pet')
		*   .values({
		*     name: 'Catto',
		*     species: 'cat',
		*     owner_id: 3,
		*   })
		*   .onConflict((oc) => oc
		*     .column('name')
		*     .doUpdateSet({ species: 'hamster' })
		*   )
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* insert into "pet" ("name", "species", "owner_id")
		* values ($1, $2, $3)
		* on conflict ("name")
		* do update set "species" = $4
		* ```
		*
		* You can provide the name of the constraint instead of a column name:
		*
		* ```ts
		* await db
		*   .insertInto('pet')
		*   .values({
		*     name: 'Catto',
		*     species: 'cat',
		*     owner_id: 3,
		*   })
		*   .onConflict((oc) => oc
		*     .constraint('pet_name_key')
		*     .doUpdateSet({ species: 'hamster' })
		*   )
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* insert into "pet" ("name", "species", "owner_id")
		* values ($1, $2, $3)
		* on conflict on constraint "pet_name_key"
		* do update set "species" = $4
		* ```
		*
		* You can also specify an expression as the conflict target in case
		* the unique index is an expression index:
		*
		* ```ts
		* import { sql } from 'kysely'
		*
		* await db
		*   .insertInto('pet')
		*   .values({
		*     name: 'Catto',
		*     species: 'cat',
		*     owner_id: 3,
		*   })
		*   .onConflict((oc) => oc
		*     .expression(sql<string>`lower(name)`)
		*     .doUpdateSet({ species: 'hamster' })
		*   )
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* insert into "pet" ("name", "species", "owner_id")
		* values ($1, $2, $3)
		* on conflict (lower(name))
		* do update set "species" = $4
		* ```
		*
		* You can add a filter for the update statement like this:
		*
		* ```ts
		* await db
		*   .insertInto('pet')
		*   .values({
		*     name: 'Catto',
		*     species: 'cat',
		*     owner_id: 3,
		*   })
		*   .onConflict((oc) => oc
		*     .column('name')
		*     .doUpdateSet({ species: 'hamster' })
		*     .where('excluded.name', '!=', 'Catto')
		*   )
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* insert into "pet" ("name", "species", "owner_id")
		* values ($1, $2, $3)
		* on conflict ("name")
		* do update set "species" = $4
		* where "excluded"."name" != $5
		* ```
		*
		* You can create an `on conflict do nothing` clauses like this:
		*
		* ```ts
		* await db
		*   .insertInto('pet')
		*   .values({
		*     name: 'Catto',
		*     species: 'cat',
		*     owner_id: 3,
		*   })
		*   .onConflict((oc) => oc
		*     .column('name')
		*     .doNothing()
		*   )
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* insert into "pet" ("name", "species", "owner_id")
		* values ($1, $2, $3)
		* on conflict ("name") do nothing
		* ```
		*
		* You can refer to the columns of the virtual `excluded` table
		* in a type-safe way using a callback and the `ref` method of
		* `ExpressionBuilder`:
		*
		* ```ts
		* await db.insertInto('person')
		*   .values({
		*     id: 1,
		*     first_name: 'John',
		*     last_name: 'Doe',
		*     gender: 'male',
		*   })
		*   .onConflict(oc => oc
		*     .column('id')
		*     .doUpdateSet({
		*       first_name: (eb) => eb.ref('excluded.first_name'),
		*       last_name: (eb) => eb.ref('excluded.last_name')
		*     })
		*   )
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* insert into "person" ("id", "first_name", "last_name", "gender")
		* values ($1, $2, $3, $4)
		* on conflict ("id")
		* do update set
		*  "first_name" = "excluded"."first_name",
		*  "last_name" = "excluded"."last_name"
		* ```
		*/
		onConflict(callback) {
			return new InsertQueryBuilder({
				...this.#props,
				queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, { onConflict: callback(new OnConflictBuilder({ onConflictNode: OnConflictNode.create() })).toOperationNode() })
			});
		}
		/**
		* Adds `on duplicate key update` to the query.
		*
		* If you specify `on duplicate key update`, and a row is inserted that would cause
		* a duplicate value in a unique index or primary key, an update of the old row occurs.
		*
		* This is only implemented by some dialects like MySQL. On most dialects you should
		* use {@link onConflict} instead.
		*
		* ### Examples
		*
		* ```ts
		* await db
		*   .insertInto('person')
		*   .values({
		*     id: 1,
		*     first_name: 'John',
		*     last_name: 'Doe',
		*     gender: 'male',
		*   })
		*   .onDuplicateKeyUpdate({ updated_at: new Date().toISOString() })
		*   .execute()
		* ```
		*
		* The generated SQL (MySQL):
		*
		* ```sql
		* insert into `person` (`id`, `first_name`, `last_name`, `gender`)
		* values (?, ?, ?, ?)
		* on duplicate key update `updated_at` = ?
		* ```
		*/
		onDuplicateKeyUpdate(update) {
			return new InsertQueryBuilder({
				...this.#props,
				queryNode: InsertQueryNode.cloneWith(this.#props.queryNode, { onDuplicateKey: OnDuplicateKeyNode.create(parseUpdateObjectExpression(update)) })
			});
		}
		returning(selection) {
			return new InsertQueryBuilder({
				...this.#props,
				queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectArg(selection))
			});
		}
		returningAll() {
			return new InsertQueryBuilder({
				...this.#props,
				queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectAll())
			});
		}
		output(args) {
			return new InsertQueryBuilder({
				...this.#props,
				queryNode: QueryNode.cloneWithOutput(this.#props.queryNode, parseSelectArg(args))
			});
		}
		outputAll(table) {
			return new InsertQueryBuilder({
				...this.#props,
				queryNode: QueryNode.cloneWithOutput(this.#props.queryNode, parseSelectAll(table))
			});
		}
		/**
		* Clears all `returning` clauses from the query.
		*
		* ### Examples
		*
		* ```ts
		* await db.insertInto('person')
		*   .values({ first_name: 'James', last_name: 'Smith', gender: 'male' })
		*   .returning(['first_name'])
		*   .clearReturning()
		*   .execute()
		* ```
		*
		* The generated SQL(PostgreSQL):
		*
		* ```sql
		* insert into "person" ("first_name", "last_name", "gender") values ($1, $2, $3)
		* ```
		*/
		clearReturning() {
			return new InsertQueryBuilder({
				...this.#props,
				queryNode: QueryNode.cloneWithoutReturning(this.#props.queryNode)
			});
		}
		/**
		* Simply calls the provided function passing `this` as the only argument. `$call` returns
		* what the provided function returns.
		*
		* If you want to conditionally call a method on `this`, see
		* the {@link $if} method.
		*
		* ### Examples
		*
		* The next example uses a helper function `log` to log a query:
		*
		* ```ts
		* import type { Compilable } from 'kysely'
		*
		* function log<T extends Compilable>(qb: T): T {
		*   console.log(qb.compile())
		*   return qb
		* }
		*
		* await db.insertInto('person')
		*   .values({ first_name: 'John', last_name: 'Doe', gender: 'male' })
		*   .$call(log)
		*   .execute()
		* ```
		*/
		$call(func) {
			return func(this);
		}
		/**
		* Call `func(this)` if `condition` is true.
		*
		* This method is especially handy with optional selects. Any `returning` or `returningAll`
		* method calls add columns as optional fields to the output type when called inside
		* the `func` callback. This is because we can't know if those selections were actually
		* made before running the code.
		*
		* You can also call any other methods inside the callback.
		*
		* ### Examples
		*
		* ```ts
		* import type { NewPerson } from 'type-editor' // imaginary module
		*
		* async function insertPerson(values: NewPerson, returnLastName: boolean) {
		*   return await db
		*     .insertInto('person')
		*     .values(values)
		*     .returning(['id', 'first_name'])
		*     .$if(returnLastName, (qb) => qb.returning('last_name'))
		*     .executeTakeFirstOrThrow()
		* }
		* ```
		*
		* Any selections added inside the `if` callback will be added as optional fields to the
		* output type since we can't know if the selections were actually made before running
		* the code. In the example above the return type of the `insertPerson` function is:
		*
		* ```ts
		* Promise<{
		*   id: number
		*   first_name: string
		*   last_name?: string
		* }>
		* ```
		*/
		$if(condition, func) {
			if (condition) return func(this);
			return new InsertQueryBuilder({ ...this.#props });
		}
		/**
		* Change the output type of the query.
		*
		* This method call doesn't change the SQL in any way. This methods simply
		* returns a copy of this `InsertQueryBuilder` with a new output type.
		*/
		$castTo() {
			return new InsertQueryBuilder(this.#props);
		}
		/**
		* Narrows (parts of) the output type of the query.
		*
		* Kysely tries to be as type-safe as possible, but in some cases we have to make
		* compromises for better maintainability and compilation performance. At present,
		* Kysely doesn't narrow the output type of the query based on {@link values} input
		* when using {@link returning} or {@link returningAll}.
		*
		* This utility method is very useful for these situations, as it removes unncessary
		* runtime assertion/guard code. Its input type is limited to the output type
		* of the query, so you can't add a column that doesn't exist, or change a column's
		* type to something that doesn't exist in its union type.
		*
		* ### Examples
		*
		* Turn this code:
		*
		* ```ts
		* import type { Person } from 'type-editor' // imaginary module
		*
		* const person = await db.insertInto('person')
		*   .values({
		*     first_name: 'John',
		*     last_name: 'Doe',
		*     gender: 'male',
		*     nullable_column: 'hell yeah!'
		*   })
		*   .returningAll()
		*   .executeTakeFirstOrThrow()
		*
		* if (isWithNoNullValue(person)) {
		*   functionThatExpectsPersonWithNonNullValue(person)
		* }
		*
		* function isWithNoNullValue(person: Person): person is Person & { nullable_column: string } {
		*   return person.nullable_column != null
		* }
		* ```
		*
		* Into this:
		*
		* ```ts
		* import type { NotNull } from 'kysely'
		*
		* const person = await db.insertInto('person')
		*   .values({
		*     first_name: 'John',
		*     last_name: 'Doe',
		*     gender: 'male',
		*     nullable_column: 'hell yeah!'
		*   })
		*   .returningAll()
		*   .$narrowType<{ nullable_column: NotNull }>()
		*   .executeTakeFirstOrThrow()
		*
		* functionThatExpectsPersonWithNonNullValue(person)
		* ```
		*/
		$narrowType() {
			return new InsertQueryBuilder(this.#props);
		}
		/**
		* Asserts that query's output row type equals the given type `T`.
		*
		* This method can be used to simplify excessively complex types to make TypeScript happy
		* and much faster.
		*
		* Kysely uses complex type magic to achieve its type safety. This complexity is sometimes too much
		* for TypeScript and you get errors like this:
		*
		* ```
		* error TS2589: Type instantiation is excessively deep and possibly infinite.
		* ```
		*
		* In these case you can often use this method to help TypeScript a little bit. When you use this
		* method to assert the output type of a query, Kysely can drop the complex output type that
		* consists of multiple nested helper types and replace it with the simple asserted type.
		*
		* Using this method doesn't reduce type safety at all. You have to pass in a type that is
		* structurally equal to the current type.
		*
		* ### Examples
		*
		* ```ts
		* import type { NewPerson, NewPet, Species } from 'type-editor' // imaginary module
		*
		* async function insertPersonAndPet(person: NewPerson, pet: Omit<NewPet, 'owner_id'>) {
		*   return await db
		*     .with('new_person', (qb) => qb
		*       .insertInto('person')
		*       .values(person)
		*       .returning('id')
		*       .$assertType<{ id: number }>()
		*     )
		*     .with('new_pet', (qb) => qb
		*       .insertInto('pet')
		*       .values((eb) => ({
		*         owner_id: eb.selectFrom('new_person').select('id'),
		*         ...pet
		*       }))
		*       .returning(['name as pet_name', 'species'])
		*       .$assertType<{ pet_name: string, species: Species }>()
		*     )
		*     .selectFrom(['new_person', 'new_pet'])
		*     .selectAll()
		*     .executeTakeFirstOrThrow()
		* }
		* ```
		*/
		$assertType() {
			return new InsertQueryBuilder(this.#props);
		}
		/**
		* Returns a copy of this InsertQueryBuilder instance with the given plugin installed.
		*/
		withPlugin(plugin) {
			return new InsertQueryBuilder({
				...this.#props,
				executor: this.#props.executor.withPlugin(plugin)
			});
		}
		toOperationNode() {
			return this.#props.executor.transformQuery(this.#props.queryNode, this.#props.queryId);
		}
		compile() {
			return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
		}
		async execute(options) {
			const compiledQuery = this.compile();
			const result = await this.#props.executor.executeQuery(compiledQuery, options);
			const { adapter } = this.#props.executor;
			const query = compiledQuery.query;
			if (query.returning && adapter.supportsReturning || query.output && adapter.supportsOutput) return result.rows;
			return [new InsertResult(result.insertId, result.numAffectedRows ?? BigInt(0))];
		}
		async executeTakeFirst(options) {
			const [result] = await this.execute(options);
			return result;
		}
		async executeTakeFirstOrThrow(errorConstructorOrOptions) {
			if (typeof errorConstructorOrOptions === "function") errorConstructorOrOptions = { errorConstructor: errorConstructorOrOptions };
			const result = await this.executeTakeFirst(errorConstructorOrOptions);
			if (result === void 0) {
				const errorConstructor = errorConstructorOrOptions?.errorConstructor ?? NoResultError;
				throw isNoResultErrorConstructor(errorConstructor) ? new errorConstructor(this.toOperationNode()) : errorConstructor(this.toOperationNode());
			}
			return result;
		}
		async *stream(chunkSizeOrOptions) {
			if (typeof chunkSizeOrOptions !== "object") chunkSizeOrOptions = { chunkSize: chunkSizeOrOptions };
			const compiledQuery = this.compile();
			const stream = this.#props.executor.stream(compiledQuery, chunkSizeOrOptions.chunkSize ?? 100, chunkSizeOrOptions);
			for await (const item of stream) yield* item.rows;
		}
		async explain(format, options) {
			return await new InsertQueryBuilder({
				...this.#props,
				queryNode: QueryNode.cloneWithExplain(this.#props.queryNode, format, options)
			}).execute();
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/query-builder/delete-result.js
var DeleteResult;
var init_delete_result = __esmMin((() => {
	DeleteResult = class {
		numDeletedRows;
		constructor(numDeletedRows) {
			this.numDeletedRows = numDeletedRows;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/limit-node.js
var LimitNode;
var init_limit_node = __esmMin((() => {
	init_object_utils();
	LimitNode = freeze({
		is(node) {
			return node.kind === "LimitNode";
		},
		create(limit) {
			return freeze({
				kind: "LimitNode",
				limit
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/query-builder/delete-query-builder.js
var _a$3, DeleteQueryBuilder;
var init_delete_query_builder = __esmMin((() => {
	init_join_parser();
	init_table_parser();
	init_select_parser();
	init_query_node();
	init_object_utils();
	init_no_result_error();
	init_delete_result();
	init_delete_query_node();
	init_limit_node();
	init_order_by_parser();
	init_binary_operation_parser();
	init_value_parser();
	init_top_parser();
	DeleteQueryBuilder = class {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		where(...args) {
			return new _a$3({
				...this.#props,
				queryNode: QueryNode.cloneWithWhere(this.#props.queryNode, parseValueBinaryOperationOrExpression(args))
			});
		}
		whereRef(lhs, op, rhs) {
			return new _a$3({
				...this.#props,
				queryNode: QueryNode.cloneWithWhere(this.#props.queryNode, parseReferentialBinaryOperation(lhs, op, rhs))
			});
		}
		clearWhere() {
			return new _a$3({
				...this.#props,
				queryNode: QueryNode.cloneWithoutWhere(this.#props.queryNode)
			});
		}
		/**
		* Changes a `delete from` query into a `delete top from` query.
		*
		* `top` clause is only supported by some dialects like MS SQL Server.
		*
		* ### Examples
		*
		* Delete the first 5 rows:
		*
		* ```ts
		* await db
		*   .deleteFrom('person')
		*   .top(5)
		*   .where('age', '>', 18)
		*   .executeTakeFirstOrThrow()
		* ```
		*
		* The generated SQL (MS SQL Server):
		*
		* ```sql
		* delete top(5) from "person" where "age" > @1
		* ```
		*
		* Delete the first 50% of rows:
		*
		* ```ts
		* await db
		*   .deleteFrom('person')
		*   .top(50, 'percent')
		*   .where('age', '>', 18)
		*   .executeTakeFirstOrThrow()
		* ```
		*
		* The generated SQL (MS SQL Server):
		*
		* ```sql
		* delete top(50) percent from "person" where "age" > @1
		* ```
		*/
		top(expression, modifiers) {
			return new _a$3({
				...this.#props,
				queryNode: QueryNode.cloneWithTop(this.#props.queryNode, parseTop(expression, modifiers))
			});
		}
		using(tables) {
			return new _a$3({
				...this.#props,
				queryNode: DeleteQueryNode.cloneWithUsing(this.#props.queryNode, parseTableExpressionOrList(tables))
			});
		}
		innerJoin(...args) {
			return this.#join("InnerJoin", args);
		}
		leftJoin(...args) {
			return this.#join("LeftJoin", args);
		}
		rightJoin(...args) {
			return this.#join("RightJoin", args);
		}
		fullJoin(...args) {
			return this.#join("FullJoin", args);
		}
		#join(joinType, args) {
			return new _a$3({
				...this.#props,
				queryNode: QueryNode.cloneWithJoin(this.#props.queryNode, parseJoin(joinType, args))
			});
		}
		returning(selection) {
			return new _a$3({
				...this.#props,
				queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectArg(selection))
			});
		}
		returningAll(table) {
			return new _a$3({
				...this.#props,
				queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectAll(table))
			});
		}
		output(args) {
			return new _a$3({
				...this.#props,
				queryNode: QueryNode.cloneWithOutput(this.#props.queryNode, parseSelectArg(args))
			});
		}
		outputAll(table) {
			return new _a$3({
				...this.#props,
				queryNode: QueryNode.cloneWithOutput(this.#props.queryNode, parseSelectAll(table))
			});
		}
		/**
		* Clears all `returning` clauses from the query.
		*
		* ### Examples
		*
		* ```ts
		* await db.deleteFrom('pet')
		*   .returningAll()
		*   .where('name', '=', 'Max')
		*   .clearReturning()
		*   .execute()
		* ```
		*
		* The generated SQL(PostgreSQL):
		*
		* ```sql
		* delete from "pet" where "name" = "Max"
		* ```
		*/
		clearReturning() {
			return new _a$3({
				...this.#props,
				queryNode: QueryNode.cloneWithoutReturning(this.#props.queryNode)
			});
		}
		/**
		* Clears the `limit` clause from the query.
		*
		* ### Examples
		*
		* ```ts
		* await db.deleteFrom('pet')
		*   .returningAll()
		*   .where('name', '=', 'Max')
		*   .limit(5)
		*   .clearLimit()
		*   .execute()
		* ```
		*
		* The generated SQL(PostgreSQL):
		*
		* ```sql
		* delete from "pet" where "name" = "Max" returning *
		* ```
		*/
		clearLimit() {
			return new _a$3({
				...this.#props,
				queryNode: DeleteQueryNode.cloneWithoutLimit(this.#props.queryNode)
			});
		}
		orderBy(...args) {
			return new _a$3({
				...this.#props,
				queryNode: QueryNode.cloneWithOrderByItems(this.#props.queryNode, parseOrderBy(args))
			});
		}
		clearOrderBy() {
			return new _a$3({
				...this.#props,
				queryNode: QueryNode.cloneWithoutOrderBy(this.#props.queryNode)
			});
		}
		/**
		* Adds a limit clause to the query.
		*
		* A limit clause in a delete query is only supported by some dialects
		* like MySQL.
		*
		* ### Examples
		*
		* Delete 5 oldest items in a table:
		*
		* ```ts
		* await db
		*   .deleteFrom('pet')
		*   .orderBy('created_at')
		*   .limit(5)
		*   .execute()
		* ```
		*
		* The generated SQL (MySQL):
		*
		* ```sql
		* delete from `pet` order by `created_at` limit ?
		* ```
		*/
		limit(limit) {
			return new _a$3({
				...this.#props,
				queryNode: DeleteQueryNode.cloneWithLimit(this.#props.queryNode, LimitNode.create(parseValueExpression(limit)))
			});
		}
		/**
		* This can be used to add any additional SQL to the end of the query.
		*
		* ### Examples
		*
		* ```ts
		* import { sql } from 'kysely'
		*
		* await db.deleteFrom('person')
		*   .where('first_name', '=', 'John')
		*   .modifyEnd(sql`-- This is a comment`)
		*   .execute()
		* ```
		*
		* The generated SQL (MySQL):
		*
		* ```sql
		* delete from `person`
		* where `first_name` = "John" -- This is a comment
		* ```
		*/
		modifyEnd(modifier) {
			return new _a$3({
				...this.#props,
				queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, modifier.toOperationNode())
			});
		}
		/**
		* Simply calls the provided function passing `this` as the only argument. `$call` returns
		* what the provided function returns.
		*
		* If you want to conditionally call a method on `this`, see
		* the {@link $if} method.
		*
		* ### Examples
		*
		* The next example uses a helper function `log` to log a query:
		*
		* ```ts
		* import type { Compilable } from 'kysely'
		*
		* function log<T extends Compilable>(qb: T): T {
		*   console.log(qb.compile())
		*   return qb
		* }
		*
		* await db.deleteFrom('person')
		*   .$call(log)
		*   .execute()
		* ```
		*/
		$call(func) {
			return func(this);
		}
		/**
		* Call `func(this)` if `condition` is true.
		*
		* This method is especially handy with optional selects. Any `returning` or `returningAll`
		* method calls add columns as optional fields to the output type when called inside
		* the `func` callback. This is because we can't know if those selections were actually
		* made before running the code.
		*
		* You can also call any other methods inside the callback.
		*
		* ### Examples
		*
		* ```ts
		* async function deletePerson(id: number, returnLastName: boolean) {
		*   return await db
		*     .deleteFrom('person')
		*     .where('id', '=', id)
		*     .returning(['id', 'first_name'])
		*     .$if(returnLastName, (qb) => qb.returning('last_name'))
		*     .executeTakeFirstOrThrow()
		* }
		* ```
		*
		* Any selections added inside the `if` callback will be added as optional fields to the
		* output type since we can't know if the selections were actually made before running
		* the code. In the example above the return type of the `deletePerson` function is:
		*
		* ```ts
		* Promise<{
		*   id: number
		*   first_name: string
		*   last_name?: string
		* }>
		* ```
		*/
		$if(condition, func) {
			if (condition) return func(this);
			return new _a$3({ ...this.#props });
		}
		/**
		* Change the output type of the query.
		*
		* This method call doesn't change the SQL in any way. This methods simply
		* returns a copy of this `DeleteQueryBuilder` with a new output type.
		*/
		$castTo() {
			return new _a$3(this.#props);
		}
		/**
		* Narrows (parts of) the output type of the query.
		*
		* Kysely tries to be as type-safe as possible, but in some cases we have to make
		* compromises for better maintainability and compilation performance. At present,
		* Kysely doesn't narrow the output type of the query when using {@link where} and {@link returning} or {@link returningAll}.
		*
		* This utility method is very useful for these situations, as it removes unncessary
		* runtime assertion/guard code. Its input type is limited to the output type
		* of the query, so you can't add a column that doesn't exist, or change a column's
		* type to something that doesn't exist in its union type.
		*
		* ### Examples
		*
		* Turn this code:
		*
		* ```ts
		* import type { Person } from 'type-editor' // imaginary module
		*
		* const person = await db.deleteFrom('person')
		*   .where('id', '=', 3)
		*   .where('nullable_column', 'is not', null)
		*   .returningAll()
		*   .executeTakeFirstOrThrow()
		*
		* if (isWithNoNullValue(person)) {
		*   functionThatExpectsPersonWithNonNullValue(person)
		* }
		*
		* function isWithNoNullValue(person: Person): person is Person & { nullable_column: string } {
		*   return person.nullable_column != null
		* }
		* ```
		*
		* Into this:
		*
		* ```ts
		* import type { NotNull } from 'kysely'
		*
		* const person = await db.deleteFrom('person')
		*   .where('id', '=', 3)
		*   .where('nullable_column', 'is not', null)
		*   .returningAll()
		*   .$narrowType<{ nullable_column: NotNull }>()
		*   .executeTakeFirstOrThrow()
		*
		* functionThatExpectsPersonWithNonNullValue(person)
		* ```
		*/
		$narrowType() {
			return new _a$3(this.#props);
		}
		/**
		* Asserts that query's output row type equals the given type `T`.
		*
		* This method can be used to simplify excessively complex types to make TypeScript happy
		* and much faster.
		*
		* Kysely uses complex type magic to achieve its type safety. This complexity is sometimes too much
		* for TypeScript and you get errors like this:
		*
		* ```
		* error TS2589: Type instantiation is excessively deep and possibly infinite.
		* ```
		*
		* In these case you can often use this method to help TypeScript a little bit. When you use this
		* method to assert the output type of a query, Kysely can drop the complex output type that
		* consists of multiple nested helper types and replace it with the simple asserted type.
		*
		* Using this method doesn't reduce type safety at all. You have to pass in a type that is
		* structurally equal to the current type.
		*
		* ### Examples
		*
		* ```ts
		* import type { Species } from 'type-editor' // imaginary module
		*
		* async function deletePersonAndPets(personId: number) {
		*   return await db
		*     .with('deleted_person', (qb) => qb
		*        .deleteFrom('person')
		*        .where('id', '=', personId)
		*        .returning('first_name')
		*        .$assertType<{ first_name: string }>()
		*     )
		*     .with('deleted_pets', (qb) => qb
		*       .deleteFrom('pet')
		*       .where('owner_id', '=', personId)
		*       .returning(['name as pet_name', 'species'])
		*       .$assertType<{ pet_name: string, species: Species }>()
		*     )
		*     .selectFrom(['deleted_person', 'deleted_pets'])
		*     .selectAll()
		*     .execute()
		* }
		* ```
		*/
		$assertType() {
			return new _a$3(this.#props);
		}
		/**
		* Returns a copy of this DeleteQueryBuilder instance with the given plugin installed.
		*/
		withPlugin(plugin) {
			return new _a$3({
				...this.#props,
				executor: this.#props.executor.withPlugin(plugin)
			});
		}
		toOperationNode() {
			return this.#props.executor.transformQuery(this.#props.queryNode, this.#props.queryId);
		}
		compile() {
			return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
		}
		async execute(options) {
			const compiledQuery = this.compile();
			const result = await this.#props.executor.executeQuery(compiledQuery, options);
			const { adapter } = this.#props.executor;
			const query = compiledQuery.query;
			if (query.returning && adapter.supportsReturning || query.output && adapter.supportsOutput) return result.rows;
			return [new DeleteResult(result.numAffectedRows ?? BigInt(0))];
		}
		async executeTakeFirst(options) {
			const [result] = await this.execute(options);
			return result;
		}
		async executeTakeFirstOrThrow(errorConstructorOrOptions) {
			if (typeof errorConstructorOrOptions === "function") errorConstructorOrOptions = { errorConstructor: errorConstructorOrOptions };
			const result = await this.executeTakeFirst(errorConstructorOrOptions);
			if (result === void 0) {
				const errorConstructor = errorConstructorOrOptions?.errorConstructor ?? NoResultError;
				throw isNoResultErrorConstructor(errorConstructor) ? new errorConstructor(this.toOperationNode()) : errorConstructor(this.toOperationNode());
			}
			return result;
		}
		async *stream(chunkSizeOrOptions) {
			if (typeof chunkSizeOrOptions !== "object") chunkSizeOrOptions = { chunkSize: chunkSizeOrOptions };
			const compiledQuery = this.compile();
			const stream = this.#props.executor.stream(compiledQuery, chunkSizeOrOptions.chunkSize ?? 100, chunkSizeOrOptions);
			for await (const item of stream) yield* item.rows;
		}
		async explain(format, options) {
			return await new _a$3({
				...this.#props,
				queryNode: QueryNode.cloneWithExplain(this.#props.queryNode, format, options)
			}).execute();
		}
	};
	_a$3 = DeleteQueryBuilder;
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/query-builder/update-result.js
var UpdateResult;
var init_update_result = __esmMin((() => {
	UpdateResult = class {
		/**
		* The number of rows the update query updated (even if not changed).
		*/
		numUpdatedRows;
		/**
		* The number of rows the update query changed.
		*
		* This is **optional** and only supported in dialects such as MySQL.
		* You would probably use {@link numUpdatedRows} in most cases.
		*/
		numChangedRows;
		constructor(numUpdatedRows, numChangedRows) {
			this.numUpdatedRows = numUpdatedRows;
			this.numChangedRows = numChangedRows;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/query-builder/update-query-builder.js
var _a$2, UpdateQueryBuilder;
var init_update_query_builder = __esmMin((() => {
	init_join_parser();
	init_table_parser();
	init_select_parser();
	init_query_node();
	init_update_query_node();
	init_update_set_parser();
	init_object_utils();
	init_update_result();
	init_no_result_error();
	init_binary_operation_parser();
	init_value_parser();
	init_limit_node();
	init_top_parser();
	init_order_by_parser();
	UpdateQueryBuilder = class {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		where(...args) {
			return new _a$2({
				...this.#props,
				queryNode: QueryNode.cloneWithWhere(this.#props.queryNode, parseValueBinaryOperationOrExpression(args))
			});
		}
		whereRef(lhs, op, rhs) {
			return new _a$2({
				...this.#props,
				queryNode: QueryNode.cloneWithWhere(this.#props.queryNode, parseReferentialBinaryOperation(lhs, op, rhs))
			});
		}
		clearWhere() {
			return new _a$2({
				...this.#props,
				queryNode: QueryNode.cloneWithoutWhere(this.#props.queryNode)
			});
		}
		/**
		* Changes an `update` query into a `update top` query.
		*
		* `top` clause is only supported by some dialects like MS SQL Server.
		*
		* ### Examples
		*
		* Update the first row:
		*
		* ```ts
		* await db.updateTable('person')
		*   .top(1)
		*   .set({ first_name: 'Foo' })
		*   .where('age', '>', 18)
		*   .executeTakeFirstOrThrow()
		* ```
		*
		* The generated SQL (MS SQL Server):
		*
		* ```sql
		* update top(1) "person" set "first_name" = @1 where "age" > @2
		* ```
		*
		* Update the 50% first rows:
		*
		* ```ts
		* await db.updateTable('person')
		*   .top(50, 'percent')
		*   .set({ first_name: 'Foo' })
		*   .where('age', '>', 18)
		*   .executeTakeFirstOrThrow()
		* ```
		*
		* The generated SQL (MS SQL Server):
		*
		* ```sql
		* update top(50) percent "person" set "first_name" = @1 where "age" > @2
		* ```
		*/
		top(expression, modifiers) {
			return new _a$2({
				...this.#props,
				queryNode: QueryNode.cloneWithTop(this.#props.queryNode, parseTop(expression, modifiers))
			});
		}
		from(from) {
			return new _a$2({
				...this.#props,
				queryNode: UpdateQueryNode.cloneWithFromItems(this.#props.queryNode, parseTableExpressionOrList(from))
			});
		}
		innerJoin(...args) {
			return this.#join("InnerJoin", args);
		}
		leftJoin(...args) {
			return this.#join("LeftJoin", args);
		}
		rightJoin(...args) {
			return this.#join("RightJoin", args);
		}
		fullJoin(...args) {
			return this.#join("FullJoin", args);
		}
		#join(joinType, args) {
			return new _a$2({
				...this.#props,
				queryNode: QueryNode.cloneWithJoin(this.#props.queryNode, parseJoin(joinType, args))
			});
		}
		orderBy(...args) {
			return new _a$2({
				...this.#props,
				queryNode: QueryNode.cloneWithOrderByItems(this.#props.queryNode, parseOrderBy(args))
			});
		}
		clearOrderBy() {
			return new _a$2({
				...this.#props,
				queryNode: QueryNode.cloneWithoutOrderBy(this.#props.queryNode)
			});
		}
		/**
		* Adds a limit clause to the update query for supported databases, such as MySQL.
		*
		* ### Examples
		*
		* Update the first 2 rows in the 'person' table:
		*
		* ```ts
		* await db
		*   .updateTable('person')
		*   .set({ first_name: 'Foo' })
		*   .limit(2)
		*   .execute()
		* ```
		*
		* The generated SQL (MySQL):
		*
		* ```sql
		* update `person` set `first_name` = ? limit ?
		* ```
		*/
		limit(limit) {
			return new _a$2({
				...this.#props,
				queryNode: UpdateQueryNode.cloneWithLimit(this.#props.queryNode, LimitNode.create(parseValueExpression(limit)))
			});
		}
		set(...args) {
			return new _a$2({
				...this.#props,
				queryNode: UpdateQueryNode.cloneWithUpdates(this.#props.queryNode, parseUpdate(...args))
			});
		}
		returning(selection) {
			return new _a$2({
				...this.#props,
				queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectArg(selection))
			});
		}
		returningAll(table) {
			return new _a$2({
				...this.#props,
				queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectAll(table))
			});
		}
		output(args) {
			return new _a$2({
				...this.#props,
				queryNode: QueryNode.cloneWithOutput(this.#props.queryNode, parseSelectArg(args))
			});
		}
		outputAll(table) {
			return new _a$2({
				...this.#props,
				queryNode: QueryNode.cloneWithOutput(this.#props.queryNode, parseSelectAll(table))
			});
		}
		/**
		* This can be used to add any additional SQL to the end of the query.
		*
		* ### Examples
		*
		* ```ts
		* import { sql } from 'kysely'
		*
		* await db.updateTable('person')
		*   .set({ age: 39 })
		*   .where('first_name', '=', 'John')
		*   .modifyEnd(sql.raw('-- This is a comment'))
		*   .execute()
		* ```
		*
		* The generated SQL (MySQL):
		*
		* ```sql
		* update `person`
		* set `age` = 39
		* where `first_name` = "John" -- This is a comment
		* ```
		*/
		modifyEnd(modifier) {
			return new _a$2({
				...this.#props,
				queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, modifier.toOperationNode())
			});
		}
		/**
		* Clears all `returning` clauses from the query.
		*
		* ### Examples
		*
		* ```ts
		* db.updateTable('person')
		*   .returningAll()
		*   .set({ age: 39 })
		*   .where('first_name', '=', 'John')
		*   .clearReturning()
		* ```
		*
		* The generated SQL(PostgreSQL):
		*
		* ```sql
		* update "person" set "age" = 39 where "first_name" = "John"
		* ```
		*/
		clearReturning() {
			return new _a$2({
				...this.#props,
				queryNode: QueryNode.cloneWithoutReturning(this.#props.queryNode)
			});
		}
		/**
		* Simply calls the provided function passing `this` as the only argument. `$call` returns
		* what the provided function returns.
		*
		* If you want to conditionally call a method on `this`, see
		* the {@link $if} method.
		*
		* ### Examples
		*
		* The next example uses a helper function `log` to log a query:
		*
		* ```ts
		* import type { Compilable } from 'kysely'
		* import type { PersonUpdate } from 'type-editor' // imaginary module
		*
		* function log<T extends Compilable>(qb: T): T {
		*   console.log(qb.compile())
		*   return qb
		* }
		*
		* const values = {
		*   first_name: 'John',
		* } satisfies PersonUpdate
		*
		* db.updateTable('person')
		*   .set(values)
		*   .$call(log)
		*   .execute()
		* ```
		*/
		$call(func) {
			return func(this);
		}
		/**
		* Call `func(this)` if `condition` is true.
		*
		* This method is especially handy with optional selects. Any `returning` or `returningAll`
		* method calls add columns as optional fields to the output type when called inside
		* the `func` callback. This is because we can't know if those selections were actually
		* made before running the code.
		*
		* You can also call any other methods inside the callback.
		*
		* ### Examples
		*
		* ```ts
		* import type { PersonUpdate } from 'type-editor' // imaginary module
		*
		* async function updatePerson(id: number, updates: PersonUpdate, returnLastName: boolean) {
		*   return await db
		*     .updateTable('person')
		*     .set(updates)
		*     .where('id', '=', id)
		*     .returning(['id', 'first_name'])
		*     .$if(returnLastName, (qb) => qb.returning('last_name'))
		*     .executeTakeFirstOrThrow()
		* }
		* ```
		*
		* Any selections added inside the `if` callback will be added as optional fields to the
		* output type since we can't know if the selections were actually made before running
		* the code. In the example above the return type of the `updatePerson` function is:
		*
		* ```ts
		* Promise<{
		*   id: number
		*   first_name: string
		*   last_name?: string
		* }>
		* ```
		*/
		$if(condition, func) {
			if (condition) return func(this);
			return new _a$2({ ...this.#props });
		}
		/**
		* Change the output type of the query.
		*
		* This method call doesn't change the SQL in any way. This methods simply
		* returns a copy of this `UpdateQueryBuilder` with a new output type.
		*/
		$castTo() {
			return new _a$2(this.#props);
		}
		/**
		* Narrows (parts of) the output type of the query.
		*
		* Kysely tries to be as type-safe as possible, but in some cases we have to make
		* compromises for better maintainability and compilation performance. At present,
		* Kysely doesn't narrow the output type of the query based on {@link set} input
		* when using {@link where} and/or {@link returning} or {@link returningAll}.
		*
		* This utility method is very useful for these situations, as it removes unncessary
		* runtime assertion/guard code. Its input type is limited to the output type
		* of the query, so you can't add a column that doesn't exist, or change a column's
		* type to something that doesn't exist in its union type.
		*
		* ### Examples
		*
		* Turn this code:
		*
		* ```ts
		* import type { Person } from 'type-editor' // imaginary module
		*
		* const id = 1
		* const now = new Date().toISOString()
		*
		* const person = await db.updateTable('person')
		*   .set({ deleted_at: now })
		*   .where('id', '=', id)
		*   .where('nullable_column', 'is not', null)
		*   .returningAll()
		*   .executeTakeFirstOrThrow()
		*
		* if (isWithNoNullValue(person)) {
		*   functionThatExpectsPersonWithNonNullValue(person)
		* }
		*
		* function isWithNoNullValue(person: Person): person is Person & { nullable_column: string } {
		*   return person.nullable_column != null
		* }
		* ```
		*
		* Into this:
		*
		* ```ts
		* import type { NotNull } from 'kysely'
		*
		* const id = 1
		* const now = new Date().toISOString()
		*
		* const person = await db.updateTable('person')
		*   .set({ deleted_at: now })
		*   .where('id', '=', id)
		*   .where('nullable_column', 'is not', null)
		*   .returningAll()
		*   .$narrowType<{ deleted_at: Date; nullable_column: NotNull }>()
		*   .executeTakeFirstOrThrow()
		*
		* functionThatExpectsPersonWithNonNullValue(person)
		* ```
		*/
		$narrowType() {
			return new _a$2(this.#props);
		}
		/**
		* Asserts that query's output row type equals the given type `T`.
		*
		* This method can be used to simplify excessively complex types to make TypeScript happy
		* and much faster.
		*
		* Kysely uses complex type magic to achieve its type safety. This complexity is sometimes too much
		* for TypeScript and you get errors like this:
		*
		* ```
		* error TS2589: Type instantiation is excessively deep and possibly infinite.
		* ```
		*
		* In these case you can often use this method to help TypeScript a little bit. When you use this
		* method to assert the output type of a query, Kysely can drop the complex output type that
		* consists of multiple nested helper types and replace it with the simple asserted type.
		*
		* Using this method doesn't reduce type safety at all. You have to pass in a type that is
		* structurally equal to the current type.
		*
		* ### Examples
		*
		* ```ts
		* import type { PersonUpdate, PetUpdate, Species } from 'type-editor' // imaginary module
		*
		* const person = {
		*   id: 1,
		*   gender: 'other',
		* } satisfies PersonUpdate
		*
		* const pet = {
		*   name: 'Fluffy',
		* } satisfies PetUpdate
		*
		* const result = await db
		*   .with('updated_person', (qb) => qb
		*     .updateTable('person')
		*     .set(person)
		*     .where('id', '=', person.id)
		*     .returning('first_name')
		*     .$assertType<{ first_name: string }>()
		*   )
		*   .with('updated_pet', (qb) => qb
		*     .updateTable('pet')
		*     .set(pet)
		*     .where('owner_id', '=', person.id)
		*     .returning(['name as pet_name', 'species'])
		*     .$assertType<{ pet_name: string, species: Species }>()
		*   )
		*   .selectFrom(['updated_person', 'updated_pet'])
		*   .selectAll()
		*   .executeTakeFirstOrThrow()
		* ```
		*/
		$assertType() {
			return new _a$2(this.#props);
		}
		/**
		* Returns a copy of this UpdateQueryBuilder instance with the given plugin installed.
		*/
		withPlugin(plugin) {
			return new _a$2({
				...this.#props,
				executor: this.#props.executor.withPlugin(plugin)
			});
		}
		toOperationNode() {
			return this.#props.executor.transformQuery(this.#props.queryNode, this.#props.queryId);
		}
		compile() {
			return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
		}
		async execute(options) {
			const compiledQuery = this.compile();
			const result = await this.#props.executor.executeQuery(compiledQuery, options);
			const { adapter } = this.#props.executor;
			const query = compiledQuery.query;
			if (query.returning && adapter.supportsReturning || query.output && adapter.supportsOutput) return result.rows;
			return [new UpdateResult(result.numAffectedRows ?? BigInt(0), result.numChangedRows)];
		}
		async executeTakeFirst(options) {
			const [result] = await this.execute(options);
			return result;
		}
		async executeTakeFirstOrThrow(errorConstructorOrOptions) {
			if (typeof errorConstructorOrOptions === "function") errorConstructorOrOptions = { errorConstructor: errorConstructorOrOptions };
			const result = await this.executeTakeFirst(errorConstructorOrOptions);
			if (result === void 0) {
				const errorConstructor = errorConstructorOrOptions?.errorConstructor ?? NoResultError;
				throw isNoResultErrorConstructor(errorConstructor) ? new errorConstructor(this.toOperationNode()) : errorConstructor(this.toOperationNode());
			}
			return result;
		}
		async *stream(chunkSizeOrOptions) {
			if (typeof chunkSizeOrOptions !== "object") chunkSizeOrOptions = { chunkSize: chunkSizeOrOptions };
			const compiledQuery = this.compile();
			const stream = this.#props.executor.stream(compiledQuery, chunkSizeOrOptions.chunkSize ?? 100, chunkSizeOrOptions);
			for await (const item of stream) yield* item.rows;
		}
		async explain(format, options) {
			return await new _a$2({
				...this.#props,
				queryNode: QueryNode.cloneWithExplain(this.#props.queryNode, format, options)
			}).execute();
		}
	};
	_a$2 = UpdateQueryBuilder;
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/common-table-expression-name-node.js
var CommonTableExpressionNameNode;
var init_common_table_expression_name_node = __esmMin((() => {
	init_object_utils();
	init_column_node();
	init_table_node();
	CommonTableExpressionNameNode = freeze({
		is(node) {
			return node.kind === "CommonTableExpressionNameNode";
		},
		create(tableName, columnNames) {
			return freeze({
				kind: "CommonTableExpressionNameNode",
				table: TableNode.create(tableName),
				columns: columnNames ? freeze(columnNames.map(ColumnNode.create)) : void 0
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/common-table-expression-node.js
var CommonTableExpressionNode;
var init_common_table_expression_node = __esmMin((() => {
	init_object_utils();
	CommonTableExpressionNode = freeze({
		is(node) {
			return node.kind === "CommonTableExpressionNode";
		},
		create(name, expression) {
			return freeze({
				kind: "CommonTableExpressionNode",
				name,
				expression
			});
		},
		cloneWith(node, props) {
			return freeze({
				...node,
				...props
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/query-builder/cte-builder.js
var CTEBuilder;
var init_cte_builder = __esmMin((() => {
	init_common_table_expression_node();
	init_object_utils();
	CTEBuilder = class CTEBuilder {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		/**
		* Makes the common table expression materialized.
		*/
		materialized() {
			return new CTEBuilder({
				...this.#props,
				node: CommonTableExpressionNode.cloneWith(this.#props.node, { materialized: true })
			});
		}
		/**
		* Makes the common table expression not materialized.
		*/
		notMaterialized() {
			return new CTEBuilder({
				...this.#props,
				node: CommonTableExpressionNode.cloneWith(this.#props.node, { materialized: false })
			});
		}
		toOperationNode() {
			return this.#props.node;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/parser/with-parser.js
function parseCommonTableExpression(nameOrBuilderCallback, expression) {
	const expressionNode = isOperationNodeSource(expression) ? expression.toOperationNode() : expression(createQueryCreator()).toOperationNode();
	if (isFunction(nameOrBuilderCallback)) return nameOrBuilderCallback(cteBuilderFactory(expressionNode)).toOperationNode();
	return CommonTableExpressionNode.create(parseCommonTableExpressionName(nameOrBuilderCallback), expressionNode);
}
function cteBuilderFactory(expressionNode) {
	return (name) => {
		return new CTEBuilder({ node: CommonTableExpressionNode.create(parseCommonTableExpressionName(name), expressionNode) });
	};
}
function parseCommonTableExpressionName(name) {
	if (name.includes("(")) {
		const parts = name.split(/[\(\)]/);
		const table = parts[0];
		const columns = parts[1].split(",").map((it) => it.trim());
		return CommonTableExpressionNameNode.create(table, columns);
	} else return CommonTableExpressionNameNode.create(name);
}
var init_with_parser = __esmMin((() => {
	init_common_table_expression_name_node();
	init_parse_utils();
	init_object_utils();
	init_cte_builder();
	init_common_table_expression_node();
	init_operation_node_source();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/with-node.js
var WithNode;
var init_with_node = __esmMin((() => {
	init_object_utils();
	WithNode = freeze({
		is(node) {
			return node.kind === "WithNode";
		},
		create(expression, params) {
			return freeze({
				kind: "WithNode",
				expressions: freeze([expression]),
				...params
			});
		},
		cloneWithExpression(withNode, expression) {
			return freeze({
				...withNode,
				expressions: freeze([...withNode.expressions, expression])
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/util/random-string.js
function randomString(length) {
	let chars = "";
	for (let i = 0; i < length; ++i) chars += randomChar();
	return chars;
}
function randomChar() {
	return CHARS[~~(Math.random() * CHARS.length)];
}
var CHARS;
var init_random_string = __esmMin((() => {
	CHARS = [
		"A",
		"B",
		"C",
		"D",
		"E",
		"F",
		"G",
		"H",
		"I",
		"J",
		"K",
		"L",
		"M",
		"N",
		"O",
		"P",
		"Q",
		"R",
		"S",
		"T",
		"U",
		"V",
		"W",
		"X",
		"Y",
		"Z",
		"a",
		"b",
		"c",
		"d",
		"e",
		"f",
		"g",
		"h",
		"i",
		"j",
		"k",
		"l",
		"m",
		"n",
		"o",
		"p",
		"q",
		"r",
		"s",
		"t",
		"u",
		"v",
		"w",
		"x",
		"y",
		"z",
		"0",
		"1",
		"2",
		"3",
		"4",
		"5",
		"6",
		"7",
		"8",
		"9"
	];
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/util/query-id.js
function createQueryId() {
	return new LazyQueryId();
}
var LazyQueryId;
var init_query_id = __esmMin((() => {
	init_random_string();
	LazyQueryId = class {
		#queryId;
		get queryId() {
			if (this.#queryId === void 0) this.#queryId = randomString(8);
			return this.#queryId;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/operation-node-transformer.js
var OperationNodeTransformer;
var init_operation_node_transformer = __esmMin((() => {
	init_object_utils();
	OperationNodeTransformer = class {
		nodeStack = [];
		#transformers = freeze({
			AliasNode: this.transformAlias.bind(this),
			ColumnNode: this.transformColumn.bind(this),
			IdentifierNode: this.transformIdentifier.bind(this),
			SchemableIdentifierNode: this.transformSchemableIdentifier.bind(this),
			RawNode: this.transformRaw.bind(this),
			ReferenceNode: this.transformReference.bind(this),
			SelectQueryNode: this.transformSelectQuery.bind(this),
			SelectionNode: this.transformSelection.bind(this),
			TableNode: this.transformTable.bind(this),
			FromNode: this.transformFrom.bind(this),
			SelectAllNode: this.transformSelectAll.bind(this),
			AndNode: this.transformAnd.bind(this),
			OrNode: this.transformOr.bind(this),
			ValueNode: this.transformValue.bind(this),
			ValueListNode: this.transformValueList.bind(this),
			PrimitiveValueListNode: this.transformPrimitiveValueList.bind(this),
			ParensNode: this.transformParens.bind(this),
			JoinNode: this.transformJoin.bind(this),
			OperatorNode: this.transformOperator.bind(this),
			WhereNode: this.transformWhere.bind(this),
			InsertQueryNode: this.transformInsertQuery.bind(this),
			DeleteQueryNode: this.transformDeleteQuery.bind(this),
			ReturningNode: this.transformReturning.bind(this),
			CreateTableNode: this.transformCreateTable.bind(this),
			AddColumnNode: this.transformAddColumn.bind(this),
			ColumnDefinitionNode: this.transformColumnDefinition.bind(this),
			DropTableNode: this.transformDropTable.bind(this),
			DataTypeNode: this.transformDataType.bind(this),
			OrderByNode: this.transformOrderBy.bind(this),
			OrderByItemNode: this.transformOrderByItem.bind(this),
			GroupByNode: this.transformGroupBy.bind(this),
			GroupByItemNode: this.transformGroupByItem.bind(this),
			UpdateQueryNode: this.transformUpdateQuery.bind(this),
			ColumnUpdateNode: this.transformColumnUpdate.bind(this),
			LimitNode: this.transformLimit.bind(this),
			OffsetNode: this.transformOffset.bind(this),
			OnConflictNode: this.transformOnConflict.bind(this),
			OnDuplicateKeyNode: this.transformOnDuplicateKey.bind(this),
			CreateIndexNode: this.transformCreateIndex.bind(this),
			DropIndexNode: this.transformDropIndex.bind(this),
			ListNode: this.transformList.bind(this),
			PrimaryKeyConstraintNode: this.transformPrimaryKeyConstraint.bind(this),
			UniqueConstraintNode: this.transformUniqueConstraint.bind(this),
			ReferencesNode: this.transformReferences.bind(this),
			CheckConstraintNode: this.transformCheckConstraint.bind(this),
			WithNode: this.transformWith.bind(this),
			CommonTableExpressionNode: this.transformCommonTableExpression.bind(this),
			CommonTableExpressionNameNode: this.transformCommonTableExpressionName.bind(this),
			HavingNode: this.transformHaving.bind(this),
			CreateSchemaNode: this.transformCreateSchema.bind(this),
			DropSchemaNode: this.transformDropSchema.bind(this),
			AlterTableNode: this.transformAlterTable.bind(this),
			DropColumnNode: this.transformDropColumn.bind(this),
			RenameColumnNode: this.transformRenameColumn.bind(this),
			AlterColumnNode: this.transformAlterColumn.bind(this),
			ModifyColumnNode: this.transformModifyColumn.bind(this),
			AddConstraintNode: this.transformAddConstraint.bind(this),
			DropConstraintNode: this.transformDropConstraint.bind(this),
			RenameConstraintNode: this.transformRenameConstraint.bind(this),
			ForeignKeyConstraintNode: this.transformForeignKeyConstraint.bind(this),
			CreateViewNode: this.transformCreateView.bind(this),
			RefreshMaterializedViewNode: this.transformRefreshMaterializedView.bind(this),
			DropViewNode: this.transformDropView.bind(this),
			GeneratedNode: this.transformGenerated.bind(this),
			DefaultValueNode: this.transformDefaultValue.bind(this),
			OnNode: this.transformOn.bind(this),
			ValuesNode: this.transformValues.bind(this),
			SelectModifierNode: this.transformSelectModifier.bind(this),
			CreateTypeNode: this.transformCreateType.bind(this),
			DropTypeNode: this.transformDropType.bind(this),
			ExplainNode: this.transformExplain.bind(this),
			DefaultInsertValueNode: this.transformDefaultInsertValue.bind(this),
			AggregateFunctionNode: this.transformAggregateFunction.bind(this),
			OverNode: this.transformOver.bind(this),
			PartitionByNode: this.transformPartitionBy.bind(this),
			PartitionByItemNode: this.transformPartitionByItem.bind(this),
			SetOperationNode: this.transformSetOperation.bind(this),
			BinaryOperationNode: this.transformBinaryOperation.bind(this),
			UnaryOperationNode: this.transformUnaryOperation.bind(this),
			UsingNode: this.transformUsing.bind(this),
			FunctionNode: this.transformFunction.bind(this),
			CaseNode: this.transformCase.bind(this),
			WhenNode: this.transformWhen.bind(this),
			JSONReferenceNode: this.transformJSONReference.bind(this),
			JSONPathNode: this.transformJSONPath.bind(this),
			JSONPathLegNode: this.transformJSONPathLeg.bind(this),
			JSONOperatorChainNode: this.transformJSONOperatorChain.bind(this),
			TupleNode: this.transformTuple.bind(this),
			MergeQueryNode: this.transformMergeQuery.bind(this),
			MatchedNode: this.transformMatched.bind(this),
			AddIndexNode: this.transformAddIndex.bind(this),
			CastNode: this.transformCast.bind(this),
			FetchNode: this.transformFetch.bind(this),
			TopNode: this.transformTop.bind(this),
			OutputNode: this.transformOutput.bind(this),
			OrActionNode: this.transformOrAction.bind(this),
			CollateNode: this.transformCollate.bind(this),
			AlterTypeNode: this.transformAlterType.bind(this),
			AddValueNode: this.transformAddValue.bind(this),
			RenameValueNode: this.transformRenameValue.bind(this)
		});
		transformNode(node, queryId) {
			if (!node) return node;
			this.nodeStack.push(node);
			const out = this.transformNodeImpl(node, queryId);
			this.nodeStack.pop();
			return freeze(out);
		}
		transformNodeImpl(node, queryId) {
			return this.#transformers[node.kind](node, queryId);
		}
		transformNodeList(list, queryId) {
			if (!list) return list;
			return freeze(list.map((node) => this.transformNode(node, queryId)));
		}
		transformSelectQuery(node, queryId) {
			return {
				kind: "SelectQueryNode",
				from: this.transformNode(node.from, queryId),
				selections: this.transformNodeList(node.selections, queryId),
				distinctOn: this.transformNodeList(node.distinctOn, queryId),
				joins: this.transformNodeList(node.joins, queryId),
				groupBy: this.transformNode(node.groupBy, queryId),
				orderBy: this.transformNode(node.orderBy, queryId),
				where: this.transformNode(node.where, queryId),
				frontModifiers: this.transformNodeList(node.frontModifiers, queryId),
				endModifiers: this.transformNodeList(node.endModifiers, queryId),
				limit: this.transformNode(node.limit, queryId),
				offset: this.transformNode(node.offset, queryId),
				with: this.transformNode(node.with, queryId),
				having: this.transformNode(node.having, queryId),
				explain: this.transformNode(node.explain, queryId),
				setOperations: this.transformNodeList(node.setOperations, queryId),
				fetch: this.transformNode(node.fetch, queryId),
				top: this.transformNode(node.top, queryId)
			};
		}
		transformSelection(node, queryId) {
			return {
				kind: "SelectionNode",
				selection: this.transformNode(node.selection, queryId)
			};
		}
		transformColumn(node, queryId) {
			return {
				kind: "ColumnNode",
				column: this.transformNode(node.column, queryId)
			};
		}
		transformAlias(node, queryId) {
			return {
				kind: "AliasNode",
				node: this.transformNode(node.node, queryId),
				alias: this.transformNode(node.alias, queryId)
			};
		}
		transformTable(node, queryId) {
			return {
				kind: "TableNode",
				table: this.transformNode(node.table, queryId)
			};
		}
		transformFrom(node, queryId) {
			return {
				kind: "FromNode",
				froms: this.transformNodeList(node.froms, queryId)
			};
		}
		transformReference(node, queryId) {
			return {
				kind: "ReferenceNode",
				column: this.transformNode(node.column, queryId),
				table: this.transformNode(node.table, queryId)
			};
		}
		transformAnd(node, queryId) {
			return {
				kind: "AndNode",
				left: this.transformNode(node.left, queryId),
				right: this.transformNode(node.right, queryId)
			};
		}
		transformOr(node, queryId) {
			return {
				kind: "OrNode",
				left: this.transformNode(node.left, queryId),
				right: this.transformNode(node.right, queryId)
			};
		}
		transformValueList(node, queryId) {
			return {
				kind: "ValueListNode",
				values: this.transformNodeList(node.values, queryId)
			};
		}
		transformParens(node, queryId) {
			return {
				kind: "ParensNode",
				node: this.transformNode(node.node, queryId)
			};
		}
		transformJoin(node, queryId) {
			return {
				kind: "JoinNode",
				joinType: node.joinType,
				table: this.transformNode(node.table, queryId),
				on: this.transformNode(node.on, queryId)
			};
		}
		transformRaw(node, queryId) {
			return {
				kind: "RawNode",
				sqlFragments: freeze([...node.sqlFragments]),
				parameters: this.transformNodeList(node.parameters, queryId)
			};
		}
		transformWhere(node, queryId) {
			return {
				kind: "WhereNode",
				where: this.transformNode(node.where, queryId)
			};
		}
		transformInsertQuery(node, queryId) {
			return {
				kind: "InsertQueryNode",
				into: this.transformNode(node.into, queryId),
				columns: this.transformNodeList(node.columns, queryId),
				values: this.transformNode(node.values, queryId),
				returning: this.transformNode(node.returning, queryId),
				onConflict: this.transformNode(node.onConflict, queryId),
				onDuplicateKey: this.transformNode(node.onDuplicateKey, queryId),
				endModifiers: this.transformNodeList(node.endModifiers, queryId),
				with: this.transformNode(node.with, queryId),
				orAction: this.transformNode(node.orAction, queryId),
				replace: node.replace,
				explain: this.transformNode(node.explain, queryId),
				defaultValues: node.defaultValues,
				top: this.transformNode(node.top, queryId),
				output: this.transformNode(node.output, queryId)
			};
		}
		transformValues(node, queryId) {
			return {
				kind: "ValuesNode",
				values: this.transformNodeList(node.values, queryId)
			};
		}
		transformDeleteQuery(node, queryId) {
			return {
				kind: "DeleteQueryNode",
				from: this.transformNode(node.from, queryId),
				using: this.transformNode(node.using, queryId),
				joins: this.transformNodeList(node.joins, queryId),
				where: this.transformNode(node.where, queryId),
				returning: this.transformNode(node.returning, queryId),
				endModifiers: this.transformNodeList(node.endModifiers, queryId),
				with: this.transformNode(node.with, queryId),
				orderBy: this.transformNode(node.orderBy, queryId),
				limit: this.transformNode(node.limit, queryId),
				explain: this.transformNode(node.explain, queryId),
				top: this.transformNode(node.top, queryId),
				output: this.transformNode(node.output, queryId)
			};
		}
		transformReturning(node, queryId) {
			return {
				kind: "ReturningNode",
				selections: this.transformNodeList(node.selections, queryId)
			};
		}
		transformCreateTable(node, queryId) {
			return {
				kind: "CreateTableNode",
				table: this.transformNode(node.table, queryId),
				columns: this.transformNodeList(node.columns, queryId),
				constraints: this.transformNodeList(node.constraints, queryId),
				indexes: this.transformNodeList(node.indexes, queryId),
				temporary: node.temporary,
				ifNotExists: node.ifNotExists,
				onCommit: node.onCommit,
				frontModifiers: this.transformNodeList(node.frontModifiers, queryId),
				endModifiers: this.transformNodeList(node.endModifiers, queryId),
				selectQuery: this.transformNode(node.selectQuery, queryId)
			};
		}
		transformColumnDefinition(node, queryId) {
			return {
				kind: "ColumnDefinitionNode",
				column: this.transformNode(node.column, queryId),
				dataType: this.transformNode(node.dataType, queryId),
				references: this.transformNode(node.references, queryId),
				primaryKey: node.primaryKey,
				autoIncrement: node.autoIncrement,
				unique: node.unique,
				notNull: node.notNull,
				unsigned: node.unsigned,
				defaultTo: this.transformNode(node.defaultTo, queryId),
				check: this.transformNode(node.check, queryId),
				generated: this.transformNode(node.generated, queryId),
				frontModifiers: this.transformNodeList(node.frontModifiers, queryId),
				endModifiers: this.transformNodeList(node.endModifiers, queryId),
				nullsNotDistinct: node.nullsNotDistinct,
				identity: node.identity,
				ifNotExists: node.ifNotExists
			};
		}
		transformAddColumn(node, queryId) {
			return {
				kind: "AddColumnNode",
				column: this.transformNode(node.column, queryId)
			};
		}
		transformDropTable(node, queryId) {
			return {
				kind: "DropTableNode",
				table: this.transformNode(node.table, queryId),
				ifExists: node.ifExists,
				cascade: node.cascade,
				temporary: node.temporary
			};
		}
		transformOrderBy(node, queryId) {
			return {
				kind: "OrderByNode",
				items: this.transformNodeList(node.items, queryId)
			};
		}
		transformOrderByItem(node, queryId) {
			return {
				kind: "OrderByItemNode",
				orderBy: this.transformNode(node.orderBy, queryId),
				direction: this.transformNode(node.direction, queryId),
				collation: this.transformNode(node.collation, queryId),
				nulls: node.nulls
			};
		}
		transformGroupBy(node, queryId) {
			return {
				kind: "GroupByNode",
				items: this.transformNodeList(node.items, queryId)
			};
		}
		transformGroupByItem(node, queryId) {
			return {
				kind: "GroupByItemNode",
				groupBy: this.transformNode(node.groupBy, queryId)
			};
		}
		transformUpdateQuery(node, queryId) {
			return {
				kind: "UpdateQueryNode",
				table: this.transformNode(node.table, queryId),
				from: this.transformNode(node.from, queryId),
				joins: this.transformNodeList(node.joins, queryId),
				where: this.transformNode(node.where, queryId),
				updates: this.transformNodeList(node.updates, queryId),
				returning: this.transformNode(node.returning, queryId),
				endModifiers: this.transformNodeList(node.endModifiers, queryId),
				with: this.transformNode(node.with, queryId),
				explain: this.transformNode(node.explain, queryId),
				limit: this.transformNode(node.limit, queryId),
				top: this.transformNode(node.top, queryId),
				output: this.transformNode(node.output, queryId),
				orderBy: this.transformNode(node.orderBy, queryId)
			};
		}
		transformColumnUpdate(node, queryId) {
			return {
				kind: "ColumnUpdateNode",
				column: this.transformNode(node.column, queryId),
				value: this.transformNode(node.value, queryId)
			};
		}
		transformLimit(node, queryId) {
			return {
				kind: "LimitNode",
				limit: this.transformNode(node.limit, queryId)
			};
		}
		transformOffset(node, queryId) {
			return {
				kind: "OffsetNode",
				offset: this.transformNode(node.offset, queryId)
			};
		}
		transformOnConflict(node, queryId) {
			return {
				kind: "OnConflictNode",
				columns: this.transformNodeList(node.columns, queryId),
				constraint: this.transformNode(node.constraint, queryId),
				indexExpression: this.transformNode(node.indexExpression, queryId),
				indexWhere: this.transformNode(node.indexWhere, queryId),
				updates: this.transformNodeList(node.updates, queryId),
				updateWhere: this.transformNode(node.updateWhere, queryId),
				doNothing: node.doNothing
			};
		}
		transformOnDuplicateKey(node, queryId) {
			return {
				kind: "OnDuplicateKeyNode",
				updates: this.transformNodeList(node.updates, queryId)
			};
		}
		transformCreateIndex(node, queryId) {
			return {
				kind: "CreateIndexNode",
				name: this.transformNode(node.name, queryId),
				table: this.transformNode(node.table, queryId),
				columns: this.transformNodeList(node.columns, queryId),
				unique: node.unique,
				using: this.transformNode(node.using, queryId),
				ifNotExists: node.ifNotExists,
				where: this.transformNode(node.where, queryId),
				nullsNotDistinct: node.nullsNotDistinct
			};
		}
		transformList(node, queryId) {
			return {
				kind: "ListNode",
				items: this.transformNodeList(node.items, queryId)
			};
		}
		transformDropIndex(node, queryId) {
			return {
				kind: "DropIndexNode",
				name: this.transformNode(node.name, queryId),
				table: this.transformNode(node.table, queryId),
				ifExists: node.ifExists,
				cascade: node.cascade
			};
		}
		transformPrimaryKeyConstraint(node, queryId) {
			return {
				kind: "PrimaryKeyConstraintNode",
				columns: this.transformNodeList(node.columns, queryId),
				name: this.transformNode(node.name, queryId),
				deferrable: node.deferrable,
				initiallyDeferred: node.initiallyDeferred
			};
		}
		transformUniqueConstraint(node, queryId) {
			return {
				kind: "UniqueConstraintNode",
				columns: this.transformNodeList(node.columns, queryId),
				name: this.transformNode(node.name, queryId),
				nullsNotDistinct: node.nullsNotDistinct,
				deferrable: node.deferrable,
				initiallyDeferred: node.initiallyDeferred
			};
		}
		transformForeignKeyConstraint(node, queryId) {
			return {
				kind: "ForeignKeyConstraintNode",
				columns: this.transformNodeList(node.columns, queryId),
				references: this.transformNode(node.references, queryId),
				name: this.transformNode(node.name, queryId),
				onDelete: node.onDelete,
				onUpdate: node.onUpdate,
				deferrable: node.deferrable,
				initiallyDeferred: node.initiallyDeferred
			};
		}
		transformSetOperation(node, queryId) {
			return {
				kind: "SetOperationNode",
				operator: node.operator,
				expression: this.transformNode(node.expression, queryId),
				all: node.all
			};
		}
		transformReferences(node, queryId) {
			return {
				kind: "ReferencesNode",
				table: this.transformNode(node.table, queryId),
				columns: this.transformNodeList(node.columns, queryId),
				onDelete: node.onDelete,
				onUpdate: node.onUpdate
			};
		}
		transformCheckConstraint(node, queryId) {
			return {
				kind: "CheckConstraintNode",
				expression: this.transformNode(node.expression, queryId),
				name: this.transformNode(node.name, queryId)
			};
		}
		transformWith(node, queryId) {
			return {
				kind: "WithNode",
				expressions: this.transformNodeList(node.expressions, queryId),
				recursive: node.recursive
			};
		}
		transformCommonTableExpression(node, queryId) {
			return {
				kind: "CommonTableExpressionNode",
				name: this.transformNode(node.name, queryId),
				materialized: node.materialized,
				expression: this.transformNode(node.expression, queryId)
			};
		}
		transformCommonTableExpressionName(node, queryId) {
			return {
				kind: "CommonTableExpressionNameNode",
				table: this.transformNode(node.table, queryId),
				columns: this.transformNodeList(node.columns, queryId)
			};
		}
		transformHaving(node, queryId) {
			return {
				kind: "HavingNode",
				having: this.transformNode(node.having, queryId)
			};
		}
		transformCreateSchema(node, queryId) {
			return {
				kind: "CreateSchemaNode",
				schema: this.transformNode(node.schema, queryId),
				ifNotExists: node.ifNotExists
			};
		}
		transformDropSchema(node, queryId) {
			return {
				kind: "DropSchemaNode",
				schema: this.transformNode(node.schema, queryId),
				ifExists: node.ifExists,
				cascade: node.cascade
			};
		}
		transformAlterTable(node, queryId) {
			return {
				kind: "AlterTableNode",
				table: this.transformNode(node.table, queryId),
				renameTo: this.transformNode(node.renameTo, queryId),
				setSchema: this.transformNode(node.setSchema, queryId),
				columnAlterations: this.transformNodeList(node.columnAlterations, queryId),
				addConstraint: this.transformNode(node.addConstraint, queryId),
				dropConstraint: this.transformNode(node.dropConstraint, queryId),
				renameConstraint: this.transformNode(node.renameConstraint, queryId),
				addIndex: this.transformNode(node.addIndex, queryId),
				dropIndex: this.transformNode(node.dropIndex, queryId)
			};
		}
		transformDropColumn(node, queryId) {
			return {
				kind: "DropColumnNode",
				column: this.transformNode(node.column, queryId),
				ifExists: node.ifExists
			};
		}
		transformRenameColumn(node, queryId) {
			return {
				kind: "RenameColumnNode",
				column: this.transformNode(node.column, queryId),
				renameTo: this.transformNode(node.renameTo, queryId)
			};
		}
		transformAlterColumn(node, queryId) {
			return {
				kind: "AlterColumnNode",
				column: this.transformNode(node.column, queryId),
				dataType: this.transformNode(node.dataType, queryId),
				dataTypeExpression: this.transformNode(node.dataTypeExpression, queryId),
				setDefault: this.transformNode(node.setDefault, queryId),
				dropDefault: node.dropDefault,
				setNotNull: node.setNotNull,
				dropNotNull: node.dropNotNull
			};
		}
		transformModifyColumn(node, queryId) {
			return {
				kind: "ModifyColumnNode",
				column: this.transformNode(node.column, queryId)
			};
		}
		transformAddConstraint(node, queryId) {
			return {
				kind: "AddConstraintNode",
				constraint: this.transformNode(node.constraint, queryId)
			};
		}
		transformDropConstraint(node, queryId) {
			return {
				kind: "DropConstraintNode",
				constraintName: this.transformNode(node.constraintName, queryId),
				ifExists: node.ifExists,
				modifier: node.modifier
			};
		}
		transformRenameConstraint(node, queryId) {
			return {
				kind: "RenameConstraintNode",
				oldName: this.transformNode(node.oldName, queryId),
				newName: this.transformNode(node.newName, queryId)
			};
		}
		transformCreateView(node, queryId) {
			return {
				kind: "CreateViewNode",
				name: this.transformNode(node.name, queryId),
				temporary: node.temporary,
				orReplace: node.orReplace,
				ifNotExists: node.ifNotExists,
				materialized: node.materialized,
				columns: this.transformNodeList(node.columns, queryId),
				as: this.transformNode(node.as, queryId)
			};
		}
		transformRefreshMaterializedView(node, queryId) {
			return {
				kind: "RefreshMaterializedViewNode",
				name: this.transformNode(node.name, queryId),
				concurrently: node.concurrently,
				withNoData: node.withNoData
			};
		}
		transformDropView(node, queryId) {
			return {
				kind: "DropViewNode",
				name: this.transformNode(node.name, queryId),
				ifExists: node.ifExists,
				materialized: node.materialized,
				cascade: node.cascade
			};
		}
		transformGenerated(node, queryId) {
			return {
				kind: "GeneratedNode",
				byDefault: node.byDefault,
				always: node.always,
				identity: node.identity,
				stored: node.stored,
				expression: this.transformNode(node.expression, queryId)
			};
		}
		transformDefaultValue(node, queryId) {
			return {
				kind: "DefaultValueNode",
				defaultValue: this.transformNode(node.defaultValue, queryId)
			};
		}
		transformOn(node, queryId) {
			return {
				kind: "OnNode",
				on: this.transformNode(node.on, queryId)
			};
		}
		transformSelectModifier(node, queryId) {
			return {
				kind: "SelectModifierNode",
				modifier: node.modifier,
				rawModifier: this.transformNode(node.rawModifier, queryId),
				of: this.transformNodeList(node.of, queryId)
			};
		}
		transformCreateType(node, queryId) {
			return {
				kind: "CreateTypeNode",
				name: this.transformNode(node.name, queryId),
				enum: this.transformNode(node.enum, queryId)
			};
		}
		transformDropType(node, queryId) {
			return {
				kind: "DropTypeNode",
				name: this.transformNode(node.name, queryId),
				additionalNames: this.transformNodeList(node.additionalNames, queryId),
				cascade: node.cascade,
				ifExists: node.ifExists
			};
		}
		transformExplain(node, queryId) {
			return {
				kind: "ExplainNode",
				format: node.format,
				options: this.transformNode(node.options, queryId)
			};
		}
		transformSchemableIdentifier(node, queryId) {
			return {
				kind: "SchemableIdentifierNode",
				schema: this.transformNode(node.schema, queryId),
				identifier: this.transformNode(node.identifier, queryId)
			};
		}
		transformAggregateFunction(node, queryId) {
			return {
				kind: "AggregateFunctionNode",
				func: node.func,
				aggregated: this.transformNodeList(node.aggregated, queryId),
				distinct: node.distinct,
				orderBy: this.transformNode(node.orderBy, queryId),
				withinGroup: this.transformNode(node.withinGroup, queryId),
				filter: this.transformNode(node.filter, queryId),
				over: this.transformNode(node.over, queryId)
			};
		}
		transformOver(node, queryId) {
			return {
				kind: "OverNode",
				orderBy: this.transformNode(node.orderBy, queryId),
				partitionBy: this.transformNode(node.partitionBy, queryId)
			};
		}
		transformPartitionBy(node, queryId) {
			return {
				kind: "PartitionByNode",
				items: this.transformNodeList(node.items, queryId)
			};
		}
		transformPartitionByItem(node, queryId) {
			return {
				kind: "PartitionByItemNode",
				partitionBy: this.transformNode(node.partitionBy, queryId)
			};
		}
		transformBinaryOperation(node, queryId) {
			return {
				kind: "BinaryOperationNode",
				leftOperand: this.transformNode(node.leftOperand, queryId),
				operator: this.transformNode(node.operator, queryId),
				rightOperand: this.transformNode(node.rightOperand, queryId)
			};
		}
		transformUnaryOperation(node, queryId) {
			return {
				kind: "UnaryOperationNode",
				operator: this.transformNode(node.operator, queryId),
				operand: this.transformNode(node.operand, queryId)
			};
		}
		transformUsing(node, queryId) {
			return {
				kind: "UsingNode",
				tables: this.transformNodeList(node.tables, queryId)
			};
		}
		transformFunction(node, queryId) {
			return {
				kind: "FunctionNode",
				func: node.func,
				arguments: this.transformNodeList(node.arguments, queryId)
			};
		}
		transformCase(node, queryId) {
			return {
				kind: "CaseNode",
				value: this.transformNode(node.value, queryId),
				when: this.transformNodeList(node.when, queryId),
				else: this.transformNode(node.else, queryId),
				isStatement: node.isStatement
			};
		}
		transformWhen(node, queryId) {
			return {
				kind: "WhenNode",
				condition: this.transformNode(node.condition, queryId),
				result: this.transformNode(node.result, queryId)
			};
		}
		transformJSONReference(node, queryId) {
			return {
				kind: "JSONReferenceNode",
				reference: this.transformNode(node.reference, queryId),
				traversal: this.transformNode(node.traversal, queryId)
			};
		}
		transformJSONPath(node, queryId) {
			return {
				kind: "JSONPathNode",
				inOperator: this.transformNode(node.inOperator, queryId),
				pathLegs: this.transformNodeList(node.pathLegs, queryId)
			};
		}
		transformJSONPathLeg(node, _queryId) {
			return {
				kind: "JSONPathLegNode",
				type: node.type,
				value: node.value
			};
		}
		transformJSONOperatorChain(node, queryId) {
			return {
				kind: "JSONOperatorChainNode",
				operator: this.transformNode(node.operator, queryId),
				values: this.transformNodeList(node.values, queryId)
			};
		}
		transformTuple(node, queryId) {
			return {
				kind: "TupleNode",
				values: this.transformNodeList(node.values, queryId)
			};
		}
		transformMergeQuery(node, queryId) {
			return {
				kind: "MergeQueryNode",
				into: this.transformNode(node.into, queryId),
				using: this.transformNode(node.using, queryId),
				whens: this.transformNodeList(node.whens, queryId),
				with: this.transformNode(node.with, queryId),
				top: this.transformNode(node.top, queryId),
				endModifiers: this.transformNodeList(node.endModifiers, queryId),
				output: this.transformNode(node.output, queryId),
				returning: this.transformNode(node.returning, queryId)
			};
		}
		transformMatched(node, _queryId) {
			return {
				kind: "MatchedNode",
				not: node.not,
				bySource: node.bySource
			};
		}
		transformAddIndex(node, queryId) {
			return {
				kind: "AddIndexNode",
				name: this.transformNode(node.name, queryId),
				columns: this.transformNodeList(node.columns, queryId),
				unique: node.unique,
				using: this.transformNode(node.using, queryId),
				ifNotExists: node.ifNotExists
			};
		}
		transformCast(node, queryId) {
			return {
				kind: "CastNode",
				expression: this.transformNode(node.expression, queryId),
				dataType: this.transformNode(node.dataType, queryId)
			};
		}
		transformFetch(node, queryId) {
			return {
				kind: "FetchNode",
				rowCount: this.transformNode(node.rowCount, queryId),
				modifier: node.modifier
			};
		}
		transformTop(node, _queryId) {
			return {
				kind: "TopNode",
				expression: node.expression,
				modifiers: node.modifiers
			};
		}
		transformOutput(node, queryId) {
			return {
				kind: "OutputNode",
				selections: this.transformNodeList(node.selections, queryId)
			};
		}
		transformAlterType(node, queryId) {
			return {
				kind: "AlterTypeNode",
				name: this.transformNode(node.name, queryId),
				addValue: this.transformNode(node.addValue, queryId),
				renameTo: this.transformNode(node.renameTo, queryId),
				renameValue: this.transformNode(node.renameValue, queryId),
				setSchema: this.transformNode(node.setSchema, queryId)
			};
		}
		transformAddValue(node, queryId) {
			return {
				kind: "AddValueNode",
				value: this.transformNode(node.value, queryId),
				ifNotExists: node.ifNotExists,
				isBefore: node.isBefore,
				neighborValue: this.transformNode(node.neighborValue, queryId)
			};
		}
		transformRenameValue(node, queryId) {
			return {
				kind: "RenameValueNode",
				oldValue: this.transformNode(node.oldValue, queryId),
				newValue: this.transformNode(node.newValue, queryId)
			};
		}
		transformDataType(node, _queryId) {
			return node;
		}
		transformSelectAll(node, _queryId) {
			return node;
		}
		transformIdentifier(node, _queryId) {
			return node;
		}
		transformValue(node, _queryId) {
			return node;
		}
		transformPrimitiveValueList(node, _queryId) {
			return node;
		}
		transformOperator(node, _queryId) {
			return node;
		}
		transformDefaultInsertValue(node, _queryId) {
			return node;
		}
		transformOrAction(node, _queryId) {
			return node;
		}
		transformCollate(node, _queryId) {
			return node;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/operation-node.js
function isOperationNode(thing) {
	return isObject(thing) && isString(thing.kind);
}
var init_operation_node = __esmMin((() => {
	init_object_utils();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/root-operation-node.js
function isRootOperationNode(thing) {
	return isOperationNode(thing) && ROOT_OPERATION_NODE_KINDS[thing.kind] === true;
}
var ROOT_OPERATION_NODE_KINDS;
var init_root_operation_node = __esmMin((() => {
	init_operation_node();
	ROOT_OPERATION_NODE_KINDS = {
		AlterTableNode: true,
		AlterTypeNode: true,
		CreateIndexNode: true,
		CreateSchemaNode: true,
		CreateTableNode: true,
		CreateTypeNode: true,
		CreateViewNode: true,
		DeleteQueryNode: true,
		DropIndexNode: true,
		DropSchemaNode: true,
		DropTableNode: true,
		DropTypeNode: true,
		RefreshMaterializedViewNode: true,
		DropViewNode: true,
		InsertQueryNode: true,
		RawNode: true,
		SelectQueryNode: true,
		UpdateQueryNode: true,
		MergeQueryNode: true
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/plugin/with-schema/with-schema-transformer.js
var SCHEMALESS_FUNCTIONS, WithSchemaTransformer;
var init_with_schema_transformer = __esmMin((() => {
	init_alias_node();
	init_identifier_node();
	init_join_node();
	init_list_node();
	init_operation_node_transformer();
	init_root_operation_node();
	init_schemable_identifier_node();
	init_table_node();
	init_using_node();
	init_object_utils();
	SCHEMALESS_FUNCTIONS = freeze({
		json_agg: true,
		to_json: true
	});
	WithSchemaTransformer = class extends OperationNodeTransformer {
		#schema;
		#schemableIds = /* @__PURE__ */ new Set();
		#ctes = /* @__PURE__ */ new Set();
		constructor(schema) {
			super();
			this.#schema = schema;
		}
		transformNodeImpl(node, queryId) {
			if (!isRootOperationNode(node)) return super.transformNodeImpl(node, queryId);
			const ctes = this.#collectCTEs(node);
			for (const cte of ctes) this.#ctes.add(cte);
			const tables = this.#collectSchemableIds(node);
			for (const table of tables) this.#schemableIds.add(table);
			const transformed = super.transformNodeImpl(node, queryId);
			for (const table of tables) this.#schemableIds.delete(table);
			for (const cte of ctes) this.#ctes.delete(cte);
			return transformed;
		}
		transformSchemableIdentifier(node, queryId) {
			const transformed = super.transformSchemableIdentifier(node, queryId);
			if (transformed.schema || !this.#schemableIds.has(node.identifier.name)) return transformed;
			return {
				...transformed,
				schema: IdentifierNode.create(this.#schema)
			};
		}
		transformReferences(node, queryId) {
			const transformed = super.transformReferences(node, queryId);
			if (transformed.table.table.schema) return transformed;
			return {
				...transformed,
				table: TableNode.createWithSchema(this.#schema, transformed.table.table.identifier.name)
			};
		}
		transformAggregateFunction(node, queryId) {
			return {
				...super.transformAggregateFunction({
					...node,
					aggregated: []
				}, queryId),
				aggregated: this.#transformTableArgsWithoutSchemas(node, queryId, "aggregated")
			};
		}
		transformFunction(node, queryId) {
			return {
				...super.transformFunction({
					...node,
					arguments: []
				}, queryId),
				arguments: this.#transformTableArgsWithoutSchemas(node, queryId, "arguments")
			};
		}
		transformSelectModifier(node, queryId) {
			return {
				...super.transformSelectModifier({
					...node,
					of: void 0
				}, queryId),
				of: node.of?.map((item) => TableNode.is(item) && !item.table.schema ? {
					...item,
					table: this.transformIdentifier(item.table.identifier, queryId)
				} : this.transformNode(item, queryId))
			};
		}
		#transformTableArgsWithoutSchemas(node, queryId, argsKey) {
			return SCHEMALESS_FUNCTIONS[node.func] ? node[argsKey].map((arg) => !TableNode.is(arg) || arg.table.schema ? this.transformNode(arg, queryId) : {
				...arg,
				table: this.transformIdentifier(arg.table.identifier, queryId)
			}) : this.transformNodeList(node[argsKey], queryId);
		}
		#collectSchemableIds(node) {
			const schemableIds = /* @__PURE__ */ new Set();
			if ("name" in node && node.name && SchemableIdentifierNode.is(node.name)) this.#collectSchemableId(node.name, schemableIds);
			if ("from" in node && node.from) for (const from of node.from.froms) this.#collectSchemableIdsFromTableExpr(from, schemableIds);
			if ("into" in node && node.into) this.#collectSchemableIdsFromTableExpr(node.into, schemableIds);
			if ("table" in node && node.table) this.#collectSchemableIdsFromTableExpr(node.table, schemableIds);
			if ("joins" in node && node.joins) for (const join of node.joins) this.#collectSchemableIdsFromTableExpr(join.table, schemableIds);
			if ("using" in node && node.using) {
				if (JoinNode.is(node.using)) this.#collectSchemableIdsFromTableExpr(node.using.table, schemableIds);
				else this.#collectSchemableIdsFromTableExpr(node.using, schemableIds);
			}
			return schemableIds;
		}
		#collectCTEs(node) {
			const ctes = /* @__PURE__ */ new Set();
			if ("with" in node && node.with) this.#collectCTEIds(node.with, ctes);
			return ctes;
		}
		#collectSchemableIdsFromTableExpr(node, schemableIds) {
			if (TableNode.is(node)) return this.#collectSchemableId(node.table, schemableIds);
			if (AliasNode.is(node) && TableNode.is(node.node)) return this.#collectSchemableId(node.node.table, schemableIds);
			if (ListNode.is(node)) {
				for (const table of node.items) this.#collectSchemableIdsFromTableExpr(table, schemableIds);
				return;
			}
			if (UsingNode.is(node)) {
				for (const table of node.tables) this.#collectSchemableIdsFromTableExpr(table, schemableIds);
				return;
			}
		}
		#collectSchemableId(node, schemableIds) {
			const id = node.identifier.name;
			if (!this.#schemableIds.has(id) && !this.#ctes.has(id)) schemableIds.add(id);
		}
		#collectCTEIds(node, ctes) {
			for (const expr of node.expressions) {
				const cteId = expr.name.table.table.identifier.name;
				if (!this.#ctes.has(cteId)) ctes.add(cteId);
			}
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/plugin/with-schema/with-schema-plugin.js
var WithSchemaPlugin;
var init_with_schema_plugin = __esmMin((() => {
	init_with_schema_transformer();
	WithSchemaPlugin = class {
		#transformer;
		constructor(schema) {
			this.#transformer = new WithSchemaTransformer(schema);
		}
		transformQuery(args) {
			return this.#transformer.transformNode(args.node, args.queryId);
		}
		async transformResult(args) {
			return args.result;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/matched-node.js
var MatchedNode;
var init_matched_node = __esmMin((() => {
	init_object_utils();
	MatchedNode = freeze({
		is(node) {
			return node.kind === "MatchedNode";
		},
		create(not, bySource = false) {
			return freeze({
				kind: "MatchedNode",
				not,
				bySource
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/parser/merge-parser.js
function parseMergeWhen(type, args, refRight) {
	return WhenNode.create(parseFilterList([MatchedNode.create(!type.isMatched, type.bySource), ...args && args.length > 0 ? [args.length === 3 && refRight ? parseReferentialBinaryOperation(args[0], args[1], args[2]) : parseValueBinaryOperationOrExpression(args)] : []], "and", false));
}
function parseMergeThen(result) {
	if (isString(result)) return RawNode.create([result], []);
	if (isOperationNodeSource(result)) return result.toOperationNode();
	return result;
}
var init_merge_parser = __esmMin((() => {
	init_matched_node();
	init_operation_node_source();
	init_raw_node();
	init_when_node();
	init_object_utils();
	init_binary_operation_parser();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/util/deferred.js
var Deferred;
var init_deferred$1 = __esmMin((() => {
	Deferred = class {
		#promise;
		#resolve;
		#reject;
		constructor() {
			this.#promise = new Promise((resolve, reject) => {
				this.#reject = reject;
				this.#resolve = resolve;
			});
		}
		get promise() {
			return this.#promise;
		}
		resolve = (value) => {
			this.#resolve?.(value);
			this.#resolve = this.#reject = void 0;
		};
		reject = (reason) => {
			this.#reject?.(reason);
			this.#reject = this.#resolve = void 0;
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/util/provide-controlled-connection.js
async function provideControlledConnection(connectionProvider, options) {
	const connectionDefer = new Deferred();
	const connectionReleaseDefer = new Deferred();
	connectionProvider.provideConnection(async (connection) => {
		connectionDefer.resolve(connection);
		return await connectionReleaseDefer.promise;
	}, options).catch((ex) => connectionDefer.reject(ex));
	return freeze({
		connection: await connectionDefer.promise,
		release: connectionReleaseDefer.resolve
	});
}
var init_provide_controlled_connection = __esmMin((() => {
	init_deferred$1();
	init_object_utils();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/util/abort.js
function getInflightQueryAbortHandler(abortStrategy = "ignore query", connection, beforeThrow) {
	if (abortStrategy === "ignore query") return;
	if (abortStrategy === "cancel query") {
		const handler = connection.cancelQuery;
		if (!handler) {
			beforeThrow();
			throwUnsupportedInflightQueryAbortStrategyError(abortStrategy, connection.killSession ? "kill session" : void 0);
		}
		return handler.bind(connection);
	}
	if (abortStrategy === "kill session") {
		const handler = connection.killSession;
		if (!handler) {
			beforeThrow();
			throwUnsupportedInflightQueryAbortStrategyError(abortStrategy, connection.cancelQuery ? "cancel query" : void 0);
		}
		return handler.bind(connection);
	}
	beforeThrow();
	throw new Error(`Unexpected \`inflightQueryAbortStrategy\`: "${abortStrategy}"`);
}
function throwUnsupportedInflightQueryAbortStrategyError(abortStrategy, alt) {
	throw new Error(`This dialect doesn't support \`inflightQueryAbortStrategy\` "${abortStrategy}". Use "ignore query"${alt ? ` or "${alt}"` : ""} instead.`);
}
function assertNotAborted(signal, timing, beforeThrow) {
	if (signal?.aborted) {
		beforeThrow?.();
		throwReasonWithTiming(signal.reason, timing);
	}
}
function throwReasonWithTiming(reason, timing) {
	decorateWithTiming(reason, timing);
	throw reason;
}
async function waitOrAbort(promise, signal, name, onAbort) {
	if (!signal) return promise;
	assertNotAborted(signal, `before ${name}`, onAbort);
	const { promise: abortPromise, resolve } = new Deferred();
	const abortListener = () => resolve(ABORTED);
	signal.addEventListener("abort", abortListener);
	try {
		assertNotAborted(signal, `before ${name}`, onAbort);
		const result = await Promise.race([promise, abortPromise]);
		if (result !== ABORTED) return result;
		onAbort?.();
		throwReasonWithTiming(signal.reason, `during ${name}`);
	} finally {
		signal.removeEventListener("abort", abortListener);
		resolve(ABORTED);
	}
}
function printBackgroundFail(name) {
	return (reason) => console.error(`\`${name}\` failed in the background after abortion: ${getMessage(reason)}`);
}
function decorateWithTiming(reason, timing) {
	if (reason !== null && typeof reason === "object" && !Object.isFrozen(reason)) Object.defineProperty(reason, "__kysely_timing__", {
		configurable: true,
		enumerable: false,
		value: timing,
		writable: false
	});
}
var ABORTED;
var init_abort = __esmMin((() => {
	init_deferred$1();
	init_object_utils();
	ABORTED = {};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/query-executor/query-executor-base.js
var NO_PLUGINS, QueryExecutorBase;
var init_query_executor_base = __esmMin((() => {
	init_object_utils();
	init_provide_controlled_connection();
	init_abort();
	init_deferred$1();
	NO_PLUGINS = freeze([]);
	QueryExecutorBase = class {
		#plugins;
		constructor(plugins = NO_PLUGINS) {
			this.#plugins = plugins;
		}
		get plugins() {
			return this.#plugins;
		}
		transformQuery(node, queryId) {
			for (const plugin of this.#plugins) {
				const transformedNode = plugin.transformQuery({
					node,
					queryId
				});
				if (transformedNode.kind === node.kind) node = transformedNode;
				else throw new Error([
					`KyselyPlugin.transformQuery must return a node`,
					`of the same kind that was given to it.`,
					`The plugin was given a ${node.kind}`,
					`but it returned a ${transformedNode.kind}`
				].join(" "));
			}
			return node;
		}
		async executeQuery(compiledQuery, options) {
			const { inflightQueryAbortStrategy = "ignore query", signal } = options || {};
			if (!signal) {
				const result = await this.provideConnection(async (connection) => {
					return await connection.executeQuery(compiledQuery);
				}, options);
				return await this.#transformResult(result, compiledQuery.queryId);
			}
			assertNotAborted(signal, "before query execution");
			options = freeze({ signal });
			const { connection, release } = await provideControlledConnection(this, options);
			const controlConnectionProvider = this.provideConnection.bind(this);
			const { promise: abortPromise, resolve } = new Deferred();
			const abortListener = () => resolve(ABORTED);
			signal.addEventListener("abort", abortListener, { once: true });
			try {
				assertNotAborted(signal, "before query execution", release);
				const inflightQueryAbortHandler = getInflightQueryAbortHandler(inflightQueryAbortStrategy, connection, release);
				if (inflightQueryAbortHandler && connection.collectSessionInfo) {
					assertNotAborted(signal, "before query execution", release);
					const collectPromise = connection.collectSessionInfo();
					if (await Promise.race([abortPromise, collectPromise]).catch((error) => {
						release();
						throw error;
					}) === ABORTED) {
						collectPromise.catch(printBackgroundFail("collectSessionInfo")).finally(release);
						throwReasonWithTiming(signal.reason, "before query execution");
					}
				}
				const queryPromise = connection.executeQuery(compiledQuery, options);
				const result = await Promise.race([abortPromise, queryPromise]).catch((error) => {
					release();
					throw error;
				});
				if (result === ABORTED) {
					Promise.allSettled([queryPromise.catch(printBackgroundFail("query")), inflightQueryAbortHandler?.(controlConnectionProvider).catch(printBackgroundFail("inflightQueryAbortHandler"))]).finally(release);
					throwReasonWithTiming(signal.reason, "during query execution");
				} else release();
				const transformPromise = this.#transformResult(result, compiledQuery.queryId, options);
				const transformedResult = await Promise.race([abortPromise, transformPromise]);
				if (transformedResult === ABORTED) {
					transformPromise.catch(printBackgroundFail("plugins.transformResult"));
					throwReasonWithTiming(signal.reason, "during result transformation");
				}
				return transformedResult;
			} finally {
				resolve(ABORTED);
				signal.removeEventListener("abort", abortListener);
			}
		}
		async *stream(compiledQuery, chunkSize, options) {
			const { signal } = options || {};
			if (!signal) {
				const { connection, release } = await provideControlledConnection(this);
				try {
					for await (const result of connection.streamQuery(compiledQuery, chunkSize)) yield await this.#transformResult(result, compiledQuery.queryId, options);
				} finally {
					release();
				}
				return;
			}
			options = freeze({ signal });
			assertNotAborted(signal, "before connection acquisition");
			const { connection, release } = await provideControlledConnection(this, options);
			const { promise: abortPromise, resolve } = new Deferred();
			const abortListener = () => resolve(ABORTED);
			signal.addEventListener("abort", abortListener, { once: true });
			let asyncIterator;
			let releasePrerequisite;
			assertNotAborted(signal, "before query streaming", release);
			const { queryId } = compiledQuery;
			try {
				asyncIterator = connection.streamQuery(compiledQuery, chunkSize, options);
				while (true) {
					assertNotAborted(signal, "during query streaming");
					const nextPromise = asyncIterator.next();
					const result = await Promise.race([abortPromise, nextPromise]);
					if (result === ABORTED) {
						releasePrerequisite = nextPromise.catch(printBackgroundFail("iterator.next"));
						throwReasonWithTiming(signal.reason, "during query streaming");
					}
					if (result.done) break;
					const transformPromise = this.#transformResult(result.value, queryId, options);
					const transformedResult = await Promise.race([abortPromise, transformPromise]);
					if (transformedResult === ABORTED) {
						releasePrerequisite = transformPromise.catch(printBackgroundFail("plugins.transformResult"));
						throwReasonWithTiming(signal.reason, "during result transformation");
					}
					yield transformedResult;
				}
			} finally {
				resolve(ABORTED);
				signal.removeEventListener("abort", abortListener);
				const cleanup = (asyncIterator?.return?.() || Promise.resolve()).finally(() => releasePrerequisite).finally(release);
				if (!releasePrerequisite) await cleanup;
			}
		}
		async #transformResult(result, queryId, options) {
			const { signal } = options || {};
			for (const plugin of this.#plugins) result = await plugin.transformResult(freeze({
				queryId,
				result,
				signal
			}));
			return result;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/query-executor/noop-query-executor.js
var NoopQueryExecutor, NOOP_QUERY_EXECUTOR;
var init_noop_query_executor = __esmMin((() => {
	init_query_executor_base();
	NoopQueryExecutor = class NoopQueryExecutor extends QueryExecutorBase {
		get adapter() {
			throw new Error("this query cannot be compiled to SQL");
		}
		compileQuery() {
			throw new Error("this query cannot be compiled to SQL");
		}
		provideConnection() {
			throw new Error("this query cannot be executed");
		}
		withConnectionProvider() {
			throw new Error("this query cannot have a connection provider");
		}
		withPlugin(plugin) {
			return new NoopQueryExecutor([...this.plugins, plugin]);
		}
		withPlugins(plugins) {
			return new NoopQueryExecutor([...this.plugins, ...plugins]);
		}
		withPluginAtFront(plugin) {
			return new NoopQueryExecutor([plugin, ...this.plugins]);
		}
		withoutPlugins() {
			return new NoopQueryExecutor([]);
		}
	};
	NOOP_QUERY_EXECUTOR = new NoopQueryExecutor();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/query-builder/merge-result.js
var MergeResult;
var init_merge_result = __esmMin((() => {
	MergeResult = class {
		numChangedRows;
		constructor(numChangedRows) {
			this.numChangedRows = numChangedRows;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/query-builder/merge-query-builder.js
var MergeQueryBuilder, WheneableMergeQueryBuilder, MatchedThenableMergeQueryBuilder, NotMatchedThenableMergeQueryBuilder;
var init_merge_query_builder = __esmMin((() => {
	init_insert_query_node();
	init_merge_query_node();
	init_query_node();
	init_update_query_node();
	init_insert_values_parser();
	init_join_parser();
	init_merge_parser();
	init_select_parser();
	init_top_parser();
	init_noop_query_executor();
	init_object_utils();
	init_merge_result();
	init_no_result_error();
	init_update_query_builder();
	MergeQueryBuilder = class MergeQueryBuilder {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		/**
		* This can be used to add any additional SQL to the end of the query.
		*
		* ### Examples
		*
		* ```ts
		* import { sql } from 'kysely'
		*
		* await db
		*   .mergeInto('person')
		*   .using('pet', 'pet.owner_id', 'person.id')
		*   .whenMatched()
		*   .thenDelete()
		*   .modifyEnd(sql.raw('-- this is a comment'))
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* merge into "person" using "pet" on "pet"."owner_id" = "person"."id" when matched then delete -- this is a comment
		* ```
		*/
		modifyEnd(modifier) {
			return new MergeQueryBuilder({
				...this.#props,
				queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, modifier.toOperationNode())
			});
		}
		/**
		* Changes a `merge into` query to an `merge top into` query.
		*
		* `top` clause is only supported by some dialects like MS SQL Server.
		*
		* ### Examples
		*
		* Affect 5 matched rows at most:
		*
		* ```ts
		* await db.mergeInto('person')
		*   .top(5)
		*   .using('pet', 'person.id', 'pet.owner_id')
		*   .whenMatched()
		*   .thenDelete()
		*   .execute()
		* ```
		*
		* The generated SQL (MS SQL Server):
		*
		* ```sql
		* merge top(5) into "person"
		* using "pet" on "person"."id" = "pet"."owner_id"
		* when matched then
		*   delete
		* ```
		*
		* Affect 50% of matched rows:
		*
		* ```ts
		* await db.mergeInto('person')
		*   .top(50, 'percent')
		*   .using('pet', 'person.id', 'pet.owner_id')
		*   .whenMatched()
		*   .thenDelete()
		*   .execute()
		* ```
		*
		* The generated SQL (MS SQL Server):
		*
		* ```sql
		* merge top(50) percent into "person"
		* using "pet" on "person"."id" = "pet"."owner_id"
		* when matched then
		*   delete
		* ```
		*/
		top(expression, modifiers) {
			return new MergeQueryBuilder({
				...this.#props,
				queryNode: QueryNode.cloneWithTop(this.#props.queryNode, parseTop(expression, modifiers))
			});
		}
		using(...args) {
			return new WheneableMergeQueryBuilder({
				...this.#props,
				queryNode: MergeQueryNode.cloneWithUsing(this.#props.queryNode, parseJoin("Using", args))
			});
		}
		returning(args) {
			return new MergeQueryBuilder({
				...this.#props,
				queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectArg(args))
			});
		}
		returningAll(table) {
			return new MergeQueryBuilder({
				...this.#props,
				queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectAll(table))
			});
		}
		output(args) {
			return new MergeQueryBuilder({
				...this.#props,
				queryNode: QueryNode.cloneWithOutput(this.#props.queryNode, parseSelectArg(args))
			});
		}
		outputAll(table) {
			return new MergeQueryBuilder({
				...this.#props,
				queryNode: QueryNode.cloneWithOutput(this.#props.queryNode, parseSelectAll(table))
			});
		}
	};
	WheneableMergeQueryBuilder = class WheneableMergeQueryBuilder {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		/**
		* This can be used to add any additional SQL to the end of the query.
		*
		* ### Examples
		*
		* ```ts
		* import { sql } from 'kysely'
		*
		* await db
		*   .mergeInto('person')
		*   .using('pet', 'pet.owner_id', 'person.id')
		*   .whenMatched()
		*   .thenDelete()
		*   .modifyEnd(sql.raw('-- this is a comment'))
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* merge into "person" using "pet" on "pet"."owner_id" = "person"."id" when matched then delete -- this is a comment
		* ```
		*/
		modifyEnd(modifier) {
			return new WheneableMergeQueryBuilder({
				...this.#props,
				queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, modifier.toOperationNode())
			});
		}
		/**
		* See {@link MergeQueryBuilder.top}.
		*/
		top(expression, modifiers) {
			return new WheneableMergeQueryBuilder({
				...this.#props,
				queryNode: QueryNode.cloneWithTop(this.#props.queryNode, parseTop(expression, modifiers))
			});
		}
		/**
		* Adds a simple `when matched` clause to the query.
		*
		* For a `when matched` clause with an `and` condition, see {@link whenMatchedAnd}.
		*
		* For a simple `when not matched` clause, see {@link whenNotMatched}.
		*
		* For a `when not matched` clause with an `and` condition, see {@link whenNotMatchedAnd}.
		*
		* ### Examples
		*
		* ```ts
		* const result = await db.mergeInto('person')
		*   .using('pet', 'person.id', 'pet.owner_id')
		*   .whenMatched()
		*   .thenDelete()
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* merge into "person"
		* using "pet" on "person"."id" = "pet"."owner_id"
		* when matched then
		*   delete
		* ```
		*/
		whenMatched() {
			return this.#whenMatched([]);
		}
		whenMatchedAnd(...args) {
			return this.#whenMatched(args);
		}
		/**
		* Adds the `when matched` clause to the query with an `and` condition. But unlike
		* {@link whenMatchedAnd}, this method accepts a column reference as the 3rd argument.
		*
		* This method is similar to {@link SelectQueryBuilder.whereRef}, so see the documentation
		* for that method for more examples.
		*/
		whenMatchedAndRef(lhs, op, rhs) {
			return this.#whenMatched([
				lhs,
				op,
				rhs
			], true);
		}
		#whenMatched(args, refRight) {
			return new MatchedThenableMergeQueryBuilder({
				...this.#props,
				queryNode: MergeQueryNode.cloneWithWhen(this.#props.queryNode, parseMergeWhen({ isMatched: true }, args, refRight))
			});
		}
		/**
		* Adds a simple `when not matched` clause to the query.
		*
		* For a `when not matched` clause with an `and` condition, see {@link whenNotMatchedAnd}.
		*
		* For a simple `when matched` clause, see {@link whenMatched}.
		*
		* For a `when matched` clause with an `and` condition, see {@link whenMatchedAnd}.
		*
		* ### Examples
		*
		* ```ts
		* const result = await db.mergeInto('person')
		*   .using('pet', 'person.id', 'pet.owner_id')
		*   .whenNotMatched()
		*   .thenInsertValues({
		*     first_name: 'John',
		*     last_name: 'Doe',
		*   })
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* merge into "person"
		* using "pet" on "person"."id" = "pet"."owner_id"
		* when not matched then
		*   insert ("first_name", "last_name") values ($1, $2)
		* ```
		*/
		whenNotMatched() {
			return this.#whenNotMatched([]);
		}
		whenNotMatchedAnd(...args) {
			return this.#whenNotMatched(args);
		}
		/**
		* Adds the `when not matched` clause to the query with an `and` condition. But unlike
		* {@link whenNotMatchedAnd}, this method accepts a column reference as the 3rd argument.
		*
		* Unlike {@link whenMatchedAndRef}, you cannot reference columns from the target table.
		*
		* This method is similar to {@link SelectQueryBuilder.whereRef}, so see the documentation
		* for that method for more examples.
		*/
		whenNotMatchedAndRef(lhs, op, rhs) {
			return this.#whenNotMatched([
				lhs,
				op,
				rhs
			], true);
		}
		/**
		* Adds a simple `when not matched by source` clause to the query.
		*
		* Supported in MS SQL Server.
		*
		* Similar to {@link whenNotMatched}, but returns a {@link MatchedThenableMergeQueryBuilder}.
		*/
		whenNotMatchedBySource() {
			return this.#whenNotMatched([], false, true);
		}
		whenNotMatchedBySourceAnd(...args) {
			return this.#whenNotMatched(args, false, true);
		}
		/**
		* Adds the `when not matched by source` clause to the query with an `and` condition.
		*
		* Similar to {@link whenNotMatchedAndRef}, but you can reference columns from
		* the target table, and not from source table and returns a {@link MatchedThenableMergeQueryBuilder}.
		*/
		whenNotMatchedBySourceAndRef(lhs, op, rhs) {
			return this.#whenNotMatched([
				lhs,
				op,
				rhs
			], true, true);
		}
		returning(args) {
			return new WheneableMergeQueryBuilder({
				...this.#props,
				queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectArg(args))
			});
		}
		returningAll(table) {
			return new WheneableMergeQueryBuilder({
				...this.#props,
				queryNode: QueryNode.cloneWithReturning(this.#props.queryNode, parseSelectAll(table))
			});
		}
		output(args) {
			return new WheneableMergeQueryBuilder({
				...this.#props,
				queryNode: QueryNode.cloneWithOutput(this.#props.queryNode, parseSelectArg(args))
			});
		}
		outputAll(table) {
			return new WheneableMergeQueryBuilder({
				...this.#props,
				queryNode: QueryNode.cloneWithOutput(this.#props.queryNode, parseSelectAll(table))
			});
		}
		#whenNotMatched(args, refRight = false, bySource = false) {
			const props = {
				...this.#props,
				queryNode: MergeQueryNode.cloneWithWhen(this.#props.queryNode, parseMergeWhen({
					isMatched: false,
					bySource
				}, args, refRight))
			};
			return new (bySource ? MatchedThenableMergeQueryBuilder : NotMatchedThenableMergeQueryBuilder)(props);
		}
		/**
		* Simply calls the provided function passing `this` as the only argument. `$call` returns
		* what the provided function returns.
		*
		* If you want to conditionally call a method on `this`, see
		* the {@link $if} method.
		*
		* ### Examples
		*
		* The next example uses a helper function `log` to log a query:
		*
		* ```ts
		* import type { Compilable } from 'kysely'
		*
		* function log<T extends Compilable>(qb: T): T {
		*   console.log(qb.compile())
		*   return qb
		* }
		*
		* await db.updateTable('person')
		*   .set({ first_name: 'John' })
		*   .$call(log)
		*   .execute()
		* ```
		*/
		$call(func) {
			return func(this);
		}
		/**
		* Call `func(this)` if `condition` is true.
		*
		* This method is especially handy with optional selects. Any `returning` or `returningAll`
		* method calls add columns as optional fields to the output type when called inside
		* the `func` callback. This is because we can't know if those selections were actually
		* made before running the code.
		*
		* You can also call any other methods inside the callback.
		*
		* ### Examples
		*
		* ```ts
		* import type { PersonUpdate } from 'type-editor' // imaginary module
		*
		* async function updatePerson(id: number, updates: PersonUpdate, returnLastName: boolean) {
		*   return await db
		*     .updateTable('person')
		*     .set(updates)
		*     .where('id', '=', id)
		*     .returning(['id', 'first_name'])
		*     .$if(returnLastName, (qb) => qb.returning('last_name'))
		*     .executeTakeFirstOrThrow()
		* }
		* ```
		*
		* Any selections added inside the `if` callback will be added as optional fields to the
		* output type since we can't know if the selections were actually made before running
		* the code. In the example above the return type of the `updatePerson` function is:
		*
		* ```ts
		* Promise<{
		*   id: number
		*   first_name: string
		*   last_name?: string
		* }>
		* ```
		*/
		$if(condition, func) {
			if (condition) return func(this);
			return new WheneableMergeQueryBuilder({ ...this.#props });
		}
		toOperationNode() {
			return this.#props.executor.transformQuery(this.#props.queryNode, this.#props.queryId);
		}
		compile() {
			return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
		}
		async execute(options) {
			const compiledQuery = this.compile();
			const result = await this.#props.executor.executeQuery(compiledQuery, options);
			const { adapter } = this.#props.executor;
			const query = compiledQuery.query;
			if (query.returning && adapter.supportsReturning || query.output && adapter.supportsOutput) return result.rows;
			return [new MergeResult(result.numAffectedRows)];
		}
		async executeTakeFirst(options) {
			const [result] = await this.execute(options);
			return result;
		}
		async executeTakeFirstOrThrow(errorConstructorOrOptions) {
			if (typeof errorConstructorOrOptions === "function") errorConstructorOrOptions = { errorConstructor: errorConstructorOrOptions };
			const result = await this.executeTakeFirst(errorConstructorOrOptions);
			if (result === void 0) {
				const errorConstructor = errorConstructorOrOptions?.errorConstructor ?? NoResultError;
				throw isNoResultErrorConstructor(errorConstructor) ? new errorConstructor(this.toOperationNode()) : errorConstructor(this.toOperationNode());
			}
			return result;
		}
	};
	MatchedThenableMergeQueryBuilder = class {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		/**
		* Performs the `delete` action.
		*
		* To perform the `do nothing` action, see {@link thenDoNothing}.
		*
		* To perform the `update` action, see {@link thenUpdate} or {@link thenUpdateSet}.
		*
		* ### Examples
		*
		* ```ts
		* const result = await db.mergeInto('person')
		*   .using('pet', 'person.id', 'pet.owner_id')
		*   .whenMatched()
		*   .thenDelete()
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* merge into "person"
		* using "pet" on "person"."id" = "pet"."owner_id"
		* when matched then
		*   delete
		* ```
		*/
		thenDelete() {
			return new WheneableMergeQueryBuilder({
				...this.#props,
				queryNode: MergeQueryNode.cloneWithThen(this.#props.queryNode, parseMergeThen("delete"))
			});
		}
		/**
		* Performs the `do nothing` action.
		*
		* This is supported in PostgreSQL.
		*
		* To perform the `delete` action, see {@link thenDelete}.
		*
		* To perform the `update` action, see {@link thenUpdate} or {@link thenUpdateSet}.
		*
		* ### Examples
		*
		* ```ts
		* const result = await db.mergeInto('person')
		*   .using('pet', 'person.id', 'pet.owner_id')
		*   .whenMatched()
		*   .thenDoNothing()
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* merge into "person"
		* using "pet" on "person"."id" = "pet"."owner_id"
		* when matched then
		*   do nothing
		* ```
		*/
		thenDoNothing() {
			return new WheneableMergeQueryBuilder({
				...this.#props,
				queryNode: MergeQueryNode.cloneWithThen(this.#props.queryNode, parseMergeThen("do nothing"))
			});
		}
		/**
		* Perform an `update` operation with a full-fledged {@link UpdateQueryBuilder}.
		* This is handy when multiple `set` invocations are needed.
		*
		* For a shorthand version of this method, see {@link thenUpdateSet}.
		*
		* To perform the `delete` action, see {@link thenDelete}.
		*
		* To perform the `do nothing` action, see {@link thenDoNothing}.
		*
		* ### Examples
		*
		* ```ts
		* import { sql } from 'kysely'
		*
		* const result = await db.mergeInto('person')
		*   .using('pet', 'person.id', 'pet.owner_id')
		*   .whenMatched()
		*   .thenUpdate((ub) => ub
		*     .set(sql`metadata['has_pets']`, 'Y')
		*     .set({
		*       updated_at: new Date().toISOString(),
		*     })
		*   )
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* merge into "person"
		* using "pet" on "person"."id" = "pet"."owner_id"
		* when matched then
		*   update set metadata['has_pets'] = $1, "updated_at" = $2
		* ```
		*/
		thenUpdate(set) {
			return new WheneableMergeQueryBuilder({
				...this.#props,
				queryNode: MergeQueryNode.cloneWithThen(this.#props.queryNode, parseMergeThen(set(new UpdateQueryBuilder({
					queryId: this.#props.queryId,
					executor: NOOP_QUERY_EXECUTOR,
					queryNode: UpdateQueryNode.createWithoutTable()
				}))))
			});
		}
		thenUpdateSet(...args) {
			return this.thenUpdate((ub) => ub.set(...args));
		}
	};
	NotMatchedThenableMergeQueryBuilder = class {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		/**
		* Performs the `do nothing` action.
		*
		* This is supported in PostgreSQL.
		*
		* To perform the `insert` action, see {@link thenInsertValues}.
		*
		* ### Examples
		*
		* ```ts
		* const result = await db.mergeInto('person')
		*   .using('pet', 'person.id', 'pet.owner_id')
		*   .whenNotMatched()
		*   .thenDoNothing()
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* merge into "person"
		* using "pet" on "person"."id" = "pet"."owner_id"
		* when not matched then
		*   do nothing
		* ```
		*/
		thenDoNothing() {
			return new WheneableMergeQueryBuilder({
				...this.#props,
				queryNode: MergeQueryNode.cloneWithThen(this.#props.queryNode, parseMergeThen("do nothing"))
			});
		}
		thenInsertValues(insert) {
			const [columns, values] = parseInsertExpression(insert);
			return new WheneableMergeQueryBuilder({
				...this.#props,
				queryNode: MergeQueryNode.cloneWithThen(this.#props.queryNode, parseMergeThen(InsertQueryNode.cloneWith(InsertQueryNode.createWithoutInto(), {
					columns,
					values
				})))
			});
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/query-creator.js
var QueryCreator;
var init_query_creator = __esmMin((() => {
	init_select_query_builder();
	init_insert_query_builder();
	init_delete_query_builder();
	init_update_query_builder();
	init_delete_query_node();
	init_insert_query_node();
	init_select_query_node();
	init_update_query_node();
	init_table_parser();
	init_with_parser();
	init_with_node();
	init_query_id();
	init_with_schema_plugin();
	init_object_utils();
	init_select_parser();
	init_merge_query_builder();
	init_merge_query_node();
	QueryCreator = class QueryCreator {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		/**
		* Creates a `select` query builder for the given table or tables.
		*
		* The tables passed to this method are built as the query's `from` clause.
		*
		* ### Examples
		*
		* Create a select query for one table:
		*
		* ```ts
		* db.selectFrom('person').selectAll()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* select * from "person"
		* ```
		*
		* Create a select query for one table with an alias:
		*
		* ```ts
		* const persons = await db.selectFrom('person as p')
		*   .select(['p.id', 'first_name'])
		*   .execute()
		*
		* console.log(persons[0].id)
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* select "p"."id", "first_name" from "person" as "p"
		* ```
		*
		* Create a select query from a subquery:
		*
		* ```ts
		* const persons = await db.selectFrom(
		*     (eb) => eb.selectFrom('person').select('person.id as identifier').as('p')
		*   )
		*   .select('p.identifier')
		*   .execute()
		*
		* console.log(persons[0].identifier)
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* select "p"."identifier",
		* from (
		*   select "person"."id" as "identifier" from "person"
		* ) as p
		* ```
		*
		* Create a select query from raw sql:
		*
		* ```ts
		* import { sql } from 'kysely'
		*
		* const items = await db
		*   .selectFrom(sql<{ one: number }>`(select 1 as one)`.as('q'))
		*   .select('q.one')
		*   .execute()
		*
		* console.log(items[0].one)
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* select "q"."one",
		* from (
		*   select 1 as one
		* ) as q
		* ```
		*
		* When you use the `sql` tag you need to also provide the result type of the
		* raw snippet / query so that Kysely can figure out what columns are
		* available for the rest of the query.
		*
		* The `selectFrom` method also accepts an array for multiple tables. All
		* the above examples can also be used in an array.
		*
		* ```ts
		* import { sql } from 'kysely'
		*
		* const items = await db.selectFrom([
		*     'person as p',
		*     db.selectFrom('pet').select('pet.species').as('a'),
		*     sql<{ one: number }>`(select 1 as one)`.as('q')
		*   ])
		*   .select(['p.id', 'a.species', 'q.one'])
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* select "p".id, "a"."species", "q"."one"
		* from
		*   "person" as "p",
		*   (select "pet"."species" from "pet") as a,
		*   (select 1 as one) as "q"
		* ```
		*/
		selectFrom(from) {
			return createSelectQueryBuilder({
				queryId: createQueryId(),
				executor: this.#props.executor,
				queryNode: SelectQueryNode.createFrom(parseTableExpressionOrList(from), this.#props.withNode)
			});
		}
		selectNoFrom(selection) {
			return createSelectQueryBuilder({
				queryId: createQueryId(),
				executor: this.#props.executor,
				queryNode: SelectQueryNode.cloneWithSelections(SelectQueryNode.create(this.#props.withNode), parseSelectArg(selection))
			});
		}
		/**
		* Creates an insert query.
		*
		* The return value of this query is an instance of {@link InsertResult}. {@link InsertResult}
		* has the {@link InsertResult.insertId | insertId} field that holds the auto incremented id of
		* the inserted row if the db returned one.
		*
		* See the {@link InsertQueryBuilder.values | values} method for more info and examples. Also see
		* the {@link ReturningInterface.returning | returning} method for a way to return columns
		* on supported databases like PostgreSQL.
		*
		* ### Examples
		*
		* ```ts
		* const result = await db
		*   .insertInto('person')
		*   .values({
		*     first_name: 'Jennifer',
		*     last_name: 'Aniston'
		*   })
		*   .executeTakeFirst()
		*
		* console.log(result.insertId)
		* ```
		*
		* Some databases like PostgreSQL support the `returning` method:
		*
		* ```ts
		* const { id } = await db
		*   .insertInto('person')
		*   .values({
		*     first_name: 'Jennifer',
		*     last_name: 'Aniston'
		*   })
		*   .returning('id')
		*   .executeTakeFirstOrThrow()
		* ```
		*/
		insertInto(table) {
			return new InsertQueryBuilder({
				queryId: createQueryId(),
				executor: this.#props.executor,
				queryNode: InsertQueryNode.create(parseTable(table), this.#props.withNode)
			});
		}
		/**
		* Creates a "replace into" query.
		*
		* This is only supported by some dialects like MySQL or SQLite.
		*
		* Similar to MySQL's {@link InsertQueryBuilder.onDuplicateKeyUpdate} that deletes
		* and inserts values on collision instead of updating existing rows.
		*
		* An alias of SQLite's {@link InsertQueryBuilder.orReplace}.
		*
		* The return value of this query is an instance of {@link InsertResult}. {@link InsertResult}
		* has the {@link InsertResult.insertId | insertId} field that holds the auto incremented id of
		* the inserted row if the db returned one.
		*
		* See the {@link InsertQueryBuilder.values | values} method for more info and examples.
		*
		* ### Examples
		*
		* ```ts
		* const result = await db
		*   .replaceInto('person')
		*   .values({
		*     first_name: 'Jennifer',
		*     last_name: 'Aniston'
		*   })
		*   .executeTakeFirstOrThrow()
		*
		* console.log(result.insertId)
		* ```
		*
		* The generated SQL (MySQL):
		*
		* ```sql
		* replace into `person` (`first_name`, `last_name`) values (?, ?)
		* ```
		*/
		replaceInto(table) {
			return new InsertQueryBuilder({
				queryId: createQueryId(),
				executor: this.#props.executor,
				queryNode: InsertQueryNode.create(parseTable(table), this.#props.withNode, true)
			});
		}
		/**
		* Creates a delete query.
		*
		* See the {@link DeleteQueryBuilder.where} method for examples on how to specify
		* a where clause for the delete operation.
		*
		* The return value of the query is an instance of {@link DeleteResult}.
		*
		* ### Examples
		*
		* <!-- siteExample("delete", "Single row", 10) -->
		*
		* Delete a single row:
		*
		* ```ts
		* const result = await db
		*   .deleteFrom('person')
		*   .where('person.id', '=', 1)
		*   .executeTakeFirst()
		*
		* console.log(result.numDeletedRows)
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* delete from "person" where "person"."id" = $1
		* ```
		*
		* Some databases such as MySQL support deleting from multiple tables:
		*
		* ```ts
		* const result = await db
		*   .deleteFrom(['person', 'pet'])
		*   .using('person')
		*   .innerJoin('pet', 'pet.owner_id', 'person.id')
		*   .where('person.id', '=', 1)
		*   .executeTakeFirst()
		* ```
		*
		* The generated SQL (MySQL):
		*
		* ```sql
		* delete from `person`, `pet`
		* using `person`
		* inner join `pet` on `pet`.`owner_id` = `person`.`id`
		* where `person`.`id` = ?
		* ```
		*/
		deleteFrom(from) {
			return new DeleteQueryBuilder({
				queryId: createQueryId(),
				executor: this.#props.executor,
				queryNode: DeleteQueryNode.create(parseTableExpressionOrList(from), this.#props.withNode)
			});
		}
		/**
		* Creates an update query.
		*
		* See the {@link UpdateQueryBuilder.where} method for examples on how to specify
		* a where clause for the update operation.
		*
		* See the {@link UpdateQueryBuilder.set} method for examples on how to
		* specify the updates.
		*
		* The return value of the query is an {@link UpdateResult}.
		*
		* ### Examples
		*
		* ```ts
		* const result = await db
		*   .updateTable('person')
		*   .set({ first_name: 'Jennifer' })
		*   .where('person.id', '=', 1)
		*   .executeTakeFirst()
		*
		* console.log(result.numUpdatedRows)
		* ```
		*/
		updateTable(tables) {
			return new UpdateQueryBuilder({
				queryId: createQueryId(),
				executor: this.#props.executor,
				queryNode: UpdateQueryNode.create(parseTableExpressionOrList(tables), this.#props.withNode)
			});
		}
		/**
		* Creates a merge query.
		*
		* The return value of the query is a {@link MergeResult}.
		*
		* See the {@link MergeQueryBuilder.using} method for examples on how to specify
		* the other table.
		*
		* ### Examples
		*
		* <!-- siteExample("merge", "Source row existence", 10) -->
		*
		* Update a target column based on the existence of a source row:
		*
		* ```ts
		* const result = await db
		*   .mergeInto('person as target')
		*   .using('pet as source', 'source.owner_id', 'target.id')
		*   .whenMatchedAnd('target.has_pets', '!=', 'Y')
		*   .thenUpdateSet({ has_pets: 'Y' })
		*   .whenNotMatchedBySourceAnd('target.has_pets', '=', 'Y')
		*   .thenUpdateSet({ has_pets: 'N' })
		*   .executeTakeFirstOrThrow()
		*
		* console.log(result.numChangedRows)
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* merge into "person"
		* using "pet"
		* on "pet"."owner_id" = "person"."id"
		* when matched and "has_pets" != $1
		* then update set "has_pets" = $2
		* when not matched by source and "has_pets" = $3
		* then update set "has_pets" = $4
		* ```
		*
		* <!-- siteExample("merge", "Temporary changes table", 20) -->
		*
		* Merge new entries from a temporary changes table:
		*
		* ```ts
		* const result = await db
		*   .mergeInto('wine as target')
		*   .using(
		*     'wine_stock_change as source',
		*     'source.wine_name',
		*     'target.name',
		*   )
		*   .whenNotMatchedAnd('source.stock_delta', '>', 0)
		*   .thenInsertValues(({ ref }) => ({
		*     name: ref('source.wine_name'),
		*     stock: ref('source.stock_delta'),
		*   }))
		*   .whenMatchedAnd(
		*     (eb) => eb('target.stock', '+', eb.ref('source.stock_delta')),
		*     '>',
		*     0,
		*   )
		*   .thenUpdateSet('stock', (eb) =>
		*     eb('target.stock', '+', eb.ref('source.stock_delta')),
		*   )
		*   .whenMatched()
		*   .thenDelete()
		*   .executeTakeFirstOrThrow()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* merge into "wine" as "target"
		* using "wine_stock_change" as "source"
		* on "source"."wine_name" = "target"."name"
		* when not matched and "source"."stock_delta" > $1
		* then insert ("name", "stock") values ("source"."wine_name", "source"."stock_delta")
		* when matched and "target"."stock" + "source"."stock_delta" > $2
		* then update set "stock" = "target"."stock" + "source"."stock_delta"
		* when matched
		* then delete
		* ```
		*/
		mergeInto(targetTable) {
			return new MergeQueryBuilder({
				queryId: createQueryId(),
				executor: this.#props.executor,
				queryNode: MergeQueryNode.create(parseAliasedTable(targetTable), this.#props.withNode)
			});
		}
		/**
		* Creates a `with` query (Common Table Expression).
		*
		* ### Examples
		*
		* <!-- siteExample("cte", "Simple selects", 10) -->
		*
		* Common table expressions (CTE) are a great way to modularize complex queries.
		* Essentially they allow you to run multiple separate queries within a
		* single roundtrip to the DB.
		*
		* Since CTEs are a part of the main query, query optimizers inside DB
		* engines are able to optimize the overall query. For example, postgres
		* is able to inline the CTEs inside the using queries if it decides it's
		* faster.
		*
		* ```ts
		* const result = await db
		*   // Create a CTE called `jennifers` that selects all
		*   // persons named 'Jennifer'.
		*   .with(
		*     'jennifers',
		*     db
		*       .selectFrom('person')
		*       .where('first_name', '=', 'Jennifer')
		*       .select(['id', 'age']),
		*   )
		*   // Select all rows from the `jennifers` CTE and
		*   // further filter it.
		*   // To refer to a CTE in another CTE, use the callback variant of `with`.
		*   .with('adult_jennifers', (db) =>
		*     db.selectFrom('jennifers').where('age', '>', 18).select(['id', 'age']),
		*   )
		*   // Finally select all adult jennifers that are
		*   // also younger than 60.
		*   .selectFrom('adult_jennifers')
		*   .where('age', '<', 60)
		*   .selectAll()
		*   .execute()
		* ```
		*
		* <!-- siteExample("cte", "Inserts, updates and deletions", 20) -->
		*
		* Some databases like postgres also allow you to run other queries than selects
		* in CTEs. On these databases CTEs are extremely powerful:
		*
		* ```ts
		* const result = await db
		*   .with('new_person', (db) => db
		*     .insertInto('person')
		*     .values({
		*       first_name: 'Jennifer',
		*       age: 35,
		*     })
		*     .returning('id')
		*   )
		*   .with('new_pet', (db) => db
		*     .insertInto('pet')
		*     .values({
		*       name: 'Doggo',
		*       species: 'dog',
		*       is_favorite: true,
		*       // Use the id of the person we just inserted.
		*       owner_id: db
		*         .selectFrom('new_person')
		*         .select('id')
		*     })
		*     .returning('id')
		*   )
		*   .selectFrom(['new_person', 'new_pet'])
		*   .select([
		*     'new_person.id as person_id',
		*     'new_pet.id as pet_id'
		*   ])
		*   .execute()
		* ```
		*
		* The CTE name can optionally specify column names in addition to
		* a name. In that case Kysely requires the expression to retun
		* rows with the same columns.
		*
		* ```ts
		* await db
		*   .with('jennifers(id, age)', (db) => db
		*     .selectFrom('person')
		*     .where('first_name', '=', 'Jennifer')
		*     // This is ok since we return columns with the same
		*     // names as specified by `jennifers(id, age)`.
		*     .select(['id', 'age'])
		*   )
		*   .selectFrom('jennifers')
		*   .selectAll()
		*   .execute()
		* ```
		*
		* The first argument can also be a callback. The callback is passed
		* a `CTEBuilder` instance that can be used to configure the CTE:
		*
		* ```ts
		* await db
		*   .with(
		*     (cte) => cte('jennifers').materialized(),
		*     (db) => db
		*       .selectFrom('person')
		*       .where('first_name', '=', 'Jennifer')
		*       .select(['id', 'age'])
		*   )
		*   .selectFrom('jennifers')
		*   .selectAll()
		*   .execute()
		* ```
		*/
		with(nameOrBuilder, expression) {
			const cte = parseCommonTableExpression(nameOrBuilder, expression);
			return new QueryCreator({
				...this.#props,
				withNode: this.#props.withNode ? WithNode.cloneWithExpression(this.#props.withNode, cte) : WithNode.create(cte)
			});
		}
		/**
		* Creates a recursive `with` query (Common Table Expression).
		*
		* Note that recursiveness is a property of the whole `with` statement.
		* You cannot have recursive and non-recursive CTEs in a same `with` statement.
		* Therefore the recursiveness is determined by the **first** `with` or
		* `withRecusive` call you make.
		*
		* See the {@link with} method for examples and more documentation.
		*/
		withRecursive(nameOrBuilder, expression) {
			const cte = parseCommonTableExpression(nameOrBuilder, expression);
			return new QueryCreator({
				...this.#props,
				withNode: this.#props.withNode ? WithNode.cloneWithExpression(this.#props.withNode, cte) : WithNode.create(cte, { recursive: true })
			});
		}
		/**
		* Returns a copy of this query creator instance with the given plugin installed.
		*/
		withPlugin(plugin) {
			return new QueryCreator({
				...this.#props,
				executor: this.#props.executor.withPlugin(plugin)
			});
		}
		/**
		* Returns a copy of this query creator instance without any plugins.
		*/
		withoutPlugins() {
			return new QueryCreator({
				...this.#props,
				executor: this.#props.executor.withoutPlugins()
			});
		}
		/**
		* Sets the schema to be used for all table references that don't explicitly
		* specify a schema.
		*
		* This only affects the query created through the builder returned from
		* this method and doesn't modify the `db` instance.
		*
		* See [this recipe](https://github.com/kysely-org/kysely/blob/master/site/docs/recipes/0007-schemas.md)
		* for a more detailed explanation.
		*
		* ### Examples
		*
		* ```
		* await db
		*   .withSchema('mammals')
		*   .selectFrom('pet')
		*   .selectAll()
		*   .innerJoin('public.person', 'public.person.id', 'pet.owner_id')
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* select * from "mammals"."pet"
		* inner join "public"."person"
		* on "public"."person"."id" = "mammals"."pet"."owner_id"
		* ```
		*
		* `withSchema` is smart enough to not add schema for aliases,
		* common table expressions or other places where the schema
		* doesn't belong to:
		*
		* ```
		* await db
		*   .withSchema('mammals')
		*   .selectFrom('pet as p')
		*   .select('p.name')
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* select "p"."name" from "mammals"."pet" as "p"
		* ```
		*/
		withSchema(schema) {
			return new QueryCreator({
				...this.#props,
				executor: this.#props.executor.withPluginAtFront(new WithSchemaPlugin(schema))
			});
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/parser/parse-utils.js
function createQueryCreator() {
	return new QueryCreator({ executor: NOOP_QUERY_EXECUTOR });
}
function createJoinBuilder(joinType, table) {
	return new JoinBuilder({ joinNode: JoinNode.create(joinType, parseTableExpression(table)) });
}
function createOverBuilder() {
	return new OverBuilder({ overNode: OverNode.create() });
}
var init_parse_utils = __esmMin((() => {
	init_join_node();
	init_over_node();
	init_join_builder();
	init_over_builder();
	init_query_creator();
	init_noop_query_executor();
	init_table_parser();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/parser/join-parser.js
function parseJoin(joinType, args) {
	if (args.length === 3) return parseSingleOnJoin(joinType, args[0], args[1], args[2]);
	else if (args.length === 2) return parseCallbackJoin(joinType, args[0], args[1]);
	else if (args.length === 1) return parseOnlessJoin(joinType, args[0]);
	else throw new Error("not implemented");
}
function parseCallbackJoin(joinType, from, callback) {
	return callback(createJoinBuilder(joinType, from)).toOperationNode();
}
function parseSingleOnJoin(joinType, from, lhsColumn, rhsColumn) {
	return JoinNode.createWithOn(joinType, parseTableExpression(from), parseReferentialBinaryOperation(lhsColumn, "=", rhsColumn));
}
function parseOnlessJoin(joinType, from) {
	return JoinNode.create(joinType, parseTableExpression(from));
}
var init_join_parser = __esmMin((() => {
	init_join_node();
	init_binary_operation_parser();
	init_parse_utils();
	init_table_parser();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/offset-node.js
var OffsetNode;
var init_offset_node = __esmMin((() => {
	init_object_utils();
	OffsetNode = freeze({
		is(node) {
			return node.kind === "OffsetNode";
		},
		create(offset) {
			return freeze({
				kind: "OffsetNode",
				offset
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/group-by-item-node.js
var GroupByItemNode;
var init_group_by_item_node = __esmMin((() => {
	init_object_utils();
	GroupByItemNode = freeze({
		is(node) {
			return node.kind === "GroupByItemNode";
		},
		create(groupBy) {
			return freeze({
				kind: "GroupByItemNode",
				groupBy
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/parser/group-by-parser.js
function parseGroupBy(groupBy) {
	groupBy = isFunction(groupBy) ? groupBy(expressionBuilder()) : groupBy;
	return parseReferenceExpressionOrList(groupBy).map(GroupByItemNode.create);
}
var init_group_by_parser = __esmMin((() => {
	init_group_by_item_node();
	init_expression_builder();
	init_object_utils();
	init_reference_parser();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/set-operation-node.js
var SetOperationNode;
var init_set_operation_node = __esmMin((() => {
	init_object_utils();
	SetOperationNode = freeze({
		is(node) {
			return node.kind === "SetOperationNode";
		},
		create(operator, expression, all) {
			return freeze({
				kind: "SetOperationNode",
				operator,
				expression,
				all
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/parser/set-operation-parser.js
function parseSetOperations(operator, expression, all) {
	if (isFunction(expression)) expression = expression(createExpressionBuilder());
	if (!isReadonlyArray(expression)) expression = [expression];
	return expression.map((expr) => SetOperationNode.create(operator, parseExpression(expr), all));
}
var init_set_operation_parser = __esmMin((() => {
	init_expression_builder();
	init_set_operation_node();
	init_object_utils();
	init_expression_parser();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/expression/expression-wrapper.js
var ExpressionWrapper, AliasedExpressionWrapper, OrWrapper, AndWrapper;
var init_expression_wrapper = __esmMin((() => {
	init_alias_node();
	init_and_node();
	init_identifier_node();
	init_operation_node_source();
	init_or_node();
	init_parens_node();
	init_binary_operation_parser();
	ExpressionWrapper = class ExpressionWrapper {
		#node;
		constructor(node) {
			this.#node = node;
		}
		/** @private */
		get expressionType() {}
		as(alias) {
			return new AliasedExpressionWrapper(this, alias);
		}
		or(...args) {
			return new OrWrapper(OrNode.create(this.#node, parseValueBinaryOperationOrExpression(args)));
		}
		and(...args) {
			return new AndWrapper(AndNode.create(this.#node, parseValueBinaryOperationOrExpression(args)));
		}
		/**
		* Change the output type of the expression.
		*
		* This method call doesn't change the SQL in any way. This methods simply
		* returns a copy of this `ExpressionWrapper` with a new output type.
		*/
		$castTo() {
			return new ExpressionWrapper(this.#node);
		}
		/**
		* Omit null from the expression's type.
		*
		* This function can be useful in cases where you know an expression can't be
		* null, but Kysely is unable to infer it.
		*
		* This method call doesn't change the SQL in any way. This methods simply
		* returns a copy of `this` with a new output type.
		*/
		$notNull() {
			return new ExpressionWrapper(this.#node);
		}
		toOperationNode() {
			return this.#node;
		}
	};
	AliasedExpressionWrapper = class {
		#expr;
		#alias;
		constructor(expr, alias) {
			this.#expr = expr;
			this.#alias = alias;
		}
		/** @private */
		get expression() {
			return this.#expr;
		}
		/** @private */
		get alias() {
			return this.#alias;
		}
		toOperationNode() {
			return AliasNode.create(this.#expr.toOperationNode(), isOperationNodeSource(this.#alias) ? this.#alias.toOperationNode() : IdentifierNode.create(this.#alias));
		}
	};
	OrWrapper = class OrWrapper {
		#node;
		constructor(node) {
			this.#node = node;
		}
		/** @private */
		get expressionType() {}
		as(alias) {
			return new AliasedExpressionWrapper(this, alias);
		}
		or(...args) {
			return new OrWrapper(OrNode.create(this.#node, parseValueBinaryOperationOrExpression(args)));
		}
		/**
		* Change the output type of the expression.
		*
		* This method call doesn't change the SQL in any way. This methods simply
		* returns a copy of this `OrWrapper` with a new output type.
		*/
		$castTo() {
			return new OrWrapper(this.#node);
		}
		toOperationNode() {
			return ParensNode.create(this.#node);
		}
	};
	AndWrapper = class AndWrapper {
		#node;
		constructor(node) {
			this.#node = node;
		}
		/** @private */
		get expressionType() {}
		as(alias) {
			return new AliasedExpressionWrapper(this, alias);
		}
		and(...args) {
			return new AndWrapper(AndNode.create(this.#node, parseValueBinaryOperationOrExpression(args)));
		}
		/**
		* Change the output type of the expression.
		*
		* This method call doesn't change the SQL in any way. This methods simply
		* returns a copy of this `AndWrapper` with a new output type.
		*/
		$castTo() {
			return new AndWrapper(this.#node);
		}
		toOperationNode() {
			return ParensNode.create(this.#node);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/fetch-node.js
var FetchNode;
var init_fetch_node = __esmMin((() => {
	init_object_utils();
	init_value_node();
	FetchNode = freeze({
		is(node) {
			return node.kind === "FetchNode";
		},
		create(rowCount, modifier) {
			return {
				kind: "FetchNode",
				rowCount: ValueNode.create(rowCount),
				modifier
			};
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/parser/fetch-parser.js
function parseFetch(rowCount, modifier) {
	if (!isNumber(rowCount) && !isBigInt(rowCount)) throw new Error(`Invalid fetch row count: ${rowCount}`);
	if (!isFetchModifier(modifier)) throw new Error(`Invalid fetch modifier: ${modifier}`);
	return FetchNode.create(rowCount, modifier);
}
function isFetchModifier(value) {
	return value === "only" || value === "with ties";
}
var init_fetch_parser = __esmMin((() => {
	init_fetch_node();
	init_object_utils();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/query-builder/select-query-builder.js
function createSelectQueryBuilder(props) {
	return new SelectQueryBuilderImpl(props);
}
var _a$1, SelectQueryBuilderImpl, AliasedSelectQueryBuilderImpl;
var init_select_query_builder = __esmMin((() => {
	init_alias_node();
	init_select_modifier_node();
	init_join_parser();
	init_table_parser();
	init_select_parser();
	init_reference_parser();
	init_select_query_node();
	init_query_node();
	init_order_by_parser();
	init_limit_node();
	init_offset_node();
	init_object_utils();
	init_group_by_parser();
	init_no_result_error();
	init_identifier_node();
	init_set_operation_parser();
	init_binary_operation_parser();
	init_expression_wrapper();
	init_value_parser();
	init_fetch_parser();
	init_top_parser();
	SelectQueryBuilderImpl = class {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		get expressionType() {}
		get isSelectQueryBuilder() {
			return true;
		}
		where(...args) {
			return new _a$1({
				...this.#props,
				queryNode: QueryNode.cloneWithWhere(this.#props.queryNode, parseValueBinaryOperationOrExpression(args))
			});
		}
		whereRef(lhs, op, rhs) {
			return new _a$1({
				...this.#props,
				queryNode: QueryNode.cloneWithWhere(this.#props.queryNode, parseReferentialBinaryOperation(lhs, op, rhs))
			});
		}
		having(...args) {
			return new _a$1({
				...this.#props,
				queryNode: SelectQueryNode.cloneWithHaving(this.#props.queryNode, parseValueBinaryOperationOrExpression(args))
			});
		}
		havingRef(lhs, op, rhs) {
			return new _a$1({
				...this.#props,
				queryNode: SelectQueryNode.cloneWithHaving(this.#props.queryNode, parseReferentialBinaryOperation(lhs, op, rhs))
			});
		}
		select(selection) {
			return new _a$1({
				...this.#props,
				queryNode: SelectQueryNode.cloneWithSelections(this.#props.queryNode, parseSelectArg(selection))
			});
		}
		distinctOn(selection) {
			return new _a$1({
				...this.#props,
				queryNode: SelectQueryNode.cloneWithDistinctOn(this.#props.queryNode, parseReferenceExpressionOrList(selection))
			});
		}
		modifyFront(modifier) {
			return new _a$1({
				...this.#props,
				queryNode: SelectQueryNode.cloneWithFrontModifier(this.#props.queryNode, SelectModifierNode.createWithExpression(modifier.toOperationNode()))
			});
		}
		modifyEnd(modifier) {
			return new _a$1({
				...this.#props,
				queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, SelectModifierNode.createWithExpression(modifier.toOperationNode()))
			});
		}
		distinct() {
			return new _a$1({
				...this.#props,
				queryNode: SelectQueryNode.cloneWithFrontModifier(this.#props.queryNode, SelectModifierNode.create("Distinct"))
			});
		}
		forUpdate(of) {
			return new _a$1({
				...this.#props,
				queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, SelectModifierNode.create("ForUpdate", of ? asArray(of).map(parseTable) : void 0))
			});
		}
		forShare(of) {
			return new _a$1({
				...this.#props,
				queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, SelectModifierNode.create("ForShare", of ? asArray(of).map(parseTable) : void 0))
			});
		}
		forKeyShare(of) {
			return new _a$1({
				...this.#props,
				queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, SelectModifierNode.create("ForKeyShare", of ? asArray(of).map(parseTable) : void 0))
			});
		}
		forNoKeyUpdate(of) {
			return new _a$1({
				...this.#props,
				queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, SelectModifierNode.create("ForNoKeyUpdate", of ? asArray(of).map(parseTable) : void 0))
			});
		}
		skipLocked() {
			return new _a$1({
				...this.#props,
				queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, SelectModifierNode.create("SkipLocked"))
			});
		}
		noWait() {
			return new _a$1({
				...this.#props,
				queryNode: QueryNode.cloneWithEndModifier(this.#props.queryNode, SelectModifierNode.create("NoWait"))
			});
		}
		selectAll(table) {
			return new _a$1({
				...this.#props,
				queryNode: SelectQueryNode.cloneWithSelections(this.#props.queryNode, parseSelectAll(table))
			});
		}
		innerJoin(...args) {
			return this.#join("InnerJoin", args);
		}
		leftJoin(...args) {
			return this.#join("LeftJoin", args);
		}
		rightJoin(...args) {
			return this.#join("RightJoin", args);
		}
		fullJoin(...args) {
			return this.#join("FullJoin", args);
		}
		crossJoin(...args) {
			return this.#join("CrossJoin", args);
		}
		innerJoinLateral(...args) {
			return this.#join("LateralInnerJoin", args);
		}
		leftJoinLateral(...args) {
			return this.#join("LateralLeftJoin", args);
		}
		crossJoinLateral(...args) {
			return this.#join("LateralCrossJoin", args);
		}
		crossApply(...args) {
			return this.#join("CrossApply", args);
		}
		outerApply(...args) {
			return this.#join("OuterApply", args);
		}
		#join(joinType, args) {
			return new _a$1({
				...this.#props,
				queryNode: QueryNode.cloneWithJoin(this.#props.queryNode, parseJoin(joinType, args))
			});
		}
		orderBy(...args) {
			return new _a$1({
				...this.#props,
				queryNode: QueryNode.cloneWithOrderByItems(this.#props.queryNode, parseOrderBy(args))
			});
		}
		groupBy(groupBy) {
			return new _a$1({
				...this.#props,
				queryNode: SelectQueryNode.cloneWithGroupByItems(this.#props.queryNode, parseGroupBy(groupBy))
			});
		}
		limit(limit) {
			return new _a$1({
				...this.#props,
				queryNode: SelectQueryNode.cloneWithLimit(this.#props.queryNode, LimitNode.create(parseValueExpression(limit)))
			});
		}
		offset(offset) {
			return new _a$1({
				...this.#props,
				queryNode: SelectQueryNode.cloneWithOffset(this.#props.queryNode, OffsetNode.create(parseValueExpression(offset)))
			});
		}
		fetch(rowCount, modifier = "only") {
			return new _a$1({
				...this.#props,
				queryNode: SelectQueryNode.cloneWithFetch(this.#props.queryNode, parseFetch(rowCount, modifier))
			});
		}
		top(expression, modifiers) {
			return new _a$1({
				...this.#props,
				queryNode: QueryNode.cloneWithTop(this.#props.queryNode, parseTop(expression, modifiers))
			});
		}
		union(expression) {
			return new _a$1({
				...this.#props,
				queryNode: SelectQueryNode.cloneWithSetOperations(this.#props.queryNode, parseSetOperations("union", expression, false))
			});
		}
		unionAll(expression) {
			return new _a$1({
				...this.#props,
				queryNode: SelectQueryNode.cloneWithSetOperations(this.#props.queryNode, parseSetOperations("union", expression, true))
			});
		}
		intersect(expression) {
			return new _a$1({
				...this.#props,
				queryNode: SelectQueryNode.cloneWithSetOperations(this.#props.queryNode, parseSetOperations("intersect", expression, false))
			});
		}
		intersectAll(expression) {
			return new _a$1({
				...this.#props,
				queryNode: SelectQueryNode.cloneWithSetOperations(this.#props.queryNode, parseSetOperations("intersect", expression, true))
			});
		}
		except(expression) {
			return new _a$1({
				...this.#props,
				queryNode: SelectQueryNode.cloneWithSetOperations(this.#props.queryNode, parseSetOperations("except", expression, false))
			});
		}
		exceptAll(expression) {
			return new _a$1({
				...this.#props,
				queryNode: SelectQueryNode.cloneWithSetOperations(this.#props.queryNode, parseSetOperations("except", expression, true))
			});
		}
		as(alias) {
			return new AliasedSelectQueryBuilderImpl(this, alias);
		}
		clearSelect() {
			return new _a$1({
				...this.#props,
				queryNode: SelectQueryNode.cloneWithoutSelections(this.#props.queryNode)
			});
		}
		clearWhere() {
			return new _a$1({
				...this.#props,
				queryNode: QueryNode.cloneWithoutWhere(this.#props.queryNode)
			});
		}
		clearLimit() {
			return new _a$1({
				...this.#props,
				queryNode: SelectQueryNode.cloneWithoutLimit(this.#props.queryNode)
			});
		}
		clearOffset() {
			return new _a$1({
				...this.#props,
				queryNode: SelectQueryNode.cloneWithoutOffset(this.#props.queryNode)
			});
		}
		clearOrderBy() {
			return new _a$1({
				...this.#props,
				queryNode: QueryNode.cloneWithoutOrderBy(this.#props.queryNode)
			});
		}
		clearGroupBy() {
			return new _a$1({
				...this.#props,
				queryNode: SelectQueryNode.cloneWithoutGroupBy(this.#props.queryNode)
			});
		}
		$call(func) {
			return func(this);
		}
		$if(condition, func) {
			if (condition) return func(this);
			return new _a$1({ ...this.#props });
		}
		$castTo() {
			return new _a$1(this.#props);
		}
		$narrowType() {
			return new _a$1(this.#props);
		}
		$assertType() {
			return new _a$1(this.#props);
		}
		$asTuple() {
			return new ExpressionWrapper(this.toOperationNode());
		}
		$asScalar() {
			return new ExpressionWrapper(this.toOperationNode());
		}
		withPlugin(plugin) {
			return new _a$1({
				...this.#props,
				executor: this.#props.executor.withPlugin(plugin)
			});
		}
		toOperationNode() {
			return this.#props.executor.transformQuery(this.#props.queryNode, this.#props.queryId);
		}
		compile() {
			return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
		}
		async execute(options) {
			const compiledQuery = this.compile();
			return (await this.#props.executor.executeQuery(compiledQuery, options)).rows;
		}
		async executeTakeFirst(options) {
			const [result] = await this.execute(options);
			return result;
		}
		async executeTakeFirstOrThrow(errorConstructorOrOptions) {
			if (typeof errorConstructorOrOptions === "function") errorConstructorOrOptions = { errorConstructor: errorConstructorOrOptions };
			const result = await this.executeTakeFirst(errorConstructorOrOptions);
			if (result === void 0) {
				const errorConstructor = errorConstructorOrOptions?.errorConstructor ?? NoResultError;
				throw isNoResultErrorConstructor(errorConstructor) ? new errorConstructor(this.toOperationNode()) : errorConstructor(this.toOperationNode());
			}
			return result;
		}
		async *stream(chunkSizeOrOptions) {
			if (typeof chunkSizeOrOptions !== "object") chunkSizeOrOptions = { chunkSize: chunkSizeOrOptions };
			const compiledQuery = this.compile();
			const stream = this.#props.executor.stream(compiledQuery, chunkSizeOrOptions.chunkSize ?? 100, chunkSizeOrOptions);
			for await (const item of stream) yield* item.rows;
		}
		async explain(format, options) {
			return await new _a$1({
				...this.#props,
				queryNode: QueryNode.cloneWithExplain(this.#props.queryNode, format, options)
			}).execute();
		}
	};
	_a$1 = SelectQueryBuilderImpl;
	AliasedSelectQueryBuilderImpl = class {
		#queryBuilder;
		#alias;
		constructor(queryBuilder, alias) {
			this.#queryBuilder = queryBuilder;
			this.#alias = alias;
		}
		get expression() {
			return this.#queryBuilder;
		}
		get alias() {
			return this.#alias;
		}
		get isAliasedSelectQueryBuilder() {
			return true;
		}
		toOperationNode() {
			return AliasNode.create(this.#queryBuilder.toOperationNode(), IdentifierNode.create(this.#alias));
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/aggregate-function-node.js
var AggregateFunctionNode;
var init_aggregate_function_node = __esmMin((() => {
	init_object_utils();
	init_where_node();
	init_order_by_node();
	AggregateFunctionNode = freeze({
		is(node) {
			return node.kind === "AggregateFunctionNode";
		},
		create(aggregateFunction, aggregated = []) {
			return freeze({
				kind: "AggregateFunctionNode",
				func: aggregateFunction,
				aggregated
			});
		},
		cloneWithDistinct(aggregateFunctionNode) {
			return freeze({
				...aggregateFunctionNode,
				distinct: true
			});
		},
		cloneWithOrderBy(aggregateFunctionNode, orderItems, withinGroup = false) {
			const prop = withinGroup ? "withinGroup" : "orderBy";
			return freeze({
				...aggregateFunctionNode,
				[prop]: aggregateFunctionNode[prop] ? OrderByNode.cloneWithItems(aggregateFunctionNode[prop], orderItems) : OrderByNode.create(orderItems)
			});
		},
		cloneWithFilter(aggregateFunctionNode, filter) {
			return freeze({
				...aggregateFunctionNode,
				filter: aggregateFunctionNode.filter ? WhereNode.cloneWithOperation(aggregateFunctionNode.filter, "And", filter) : WhereNode.create(filter)
			});
		},
		cloneWithOrFilter(aggregateFunctionNode, filter) {
			return freeze({
				...aggregateFunctionNode,
				filter: aggregateFunctionNode.filter ? WhereNode.cloneWithOperation(aggregateFunctionNode.filter, "Or", filter) : WhereNode.create(filter)
			});
		},
		cloneWithOver(aggregateFunctionNode, over) {
			return freeze({
				...aggregateFunctionNode,
				over
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/function-node.js
var FunctionNode;
var init_function_node = __esmMin((() => {
	init_object_utils();
	FunctionNode = freeze({
		is(node) {
			return node.kind === "FunctionNode";
		},
		create(func, args) {
			return freeze({
				kind: "FunctionNode",
				func,
				arguments: args
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/query-builder/aggregate-function-builder.js
var AggregateFunctionBuilder, AliasedAggregateFunctionBuilder;
var init_aggregate_function_builder = __esmMin((() => {
	init_object_utils();
	init_aggregate_function_node();
	init_alias_node();
	init_identifier_node();
	init_parse_utils();
	init_binary_operation_parser();
	init_order_by_parser();
	init_query_node();
	AggregateFunctionBuilder = class AggregateFunctionBuilder {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		/** @private */
		get expressionType() {}
		/**
		* Returns an aliased version of the function.
		*
		* In addition to slapping `as "the_alias"` to the end of the SQL,
		* this method also provides strict typing:
		*
		* ```ts
		* const result = await db
		*   .selectFrom('person')
		*   .select(
		*     (eb) => eb.fn.count<number>('id').as('person_count')
		*   )
		*   .executeTakeFirstOrThrow()
		*
		* // `person_count: number` field exists in the result type.
		* console.log(result.person_count)
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* select count("id") as "person_count"
		* from "person"
		* ```
		*/
		as(alias) {
			return new AliasedAggregateFunctionBuilder(this, alias);
		}
		/**
		* Adds a `distinct` clause inside the function.
		*
		* ### Examples
		*
		* ```ts
		* const result = await db
		*   .selectFrom('person')
		*   .select((eb) =>
		*     eb.fn.count<number>('first_name').distinct().as('first_name_count')
		*   )
		*   .executeTakeFirstOrThrow()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* select count(distinct "first_name") as "first_name_count"
		* from "person"
		* ```
		*/
		distinct() {
			return new AggregateFunctionBuilder({
				...this.#props,
				aggregateFunctionNode: AggregateFunctionNode.cloneWithDistinct(this.#props.aggregateFunctionNode)
			});
		}
		orderBy(...args) {
			return new AggregateFunctionBuilder({
				...this.#props,
				aggregateFunctionNode: QueryNode.cloneWithOrderByItems(this.#props.aggregateFunctionNode, parseOrderBy(args))
			});
		}
		clearOrderBy() {
			return new AggregateFunctionBuilder({
				...this.#props,
				aggregateFunctionNode: QueryNode.cloneWithoutOrderBy(this.#props.aggregateFunctionNode)
			});
		}
		withinGroupOrderBy(...args) {
			return new AggregateFunctionBuilder({
				...this.#props,
				aggregateFunctionNode: AggregateFunctionNode.cloneWithOrderBy(this.#props.aggregateFunctionNode, parseOrderBy(args), true)
			});
		}
		filterWhere(...args) {
			return new AggregateFunctionBuilder({
				...this.#props,
				aggregateFunctionNode: AggregateFunctionNode.cloneWithFilter(this.#props.aggregateFunctionNode, parseValueBinaryOperationOrExpression(args))
			});
		}
		/**
		* Adds a `filter` clause with a nested `where` clause after the function, where
		* both sides of the operator are references to columns.
		*
		* Similar to {@link WhereInterface}'s `whereRef` method.
		*
		* ### Examples
		*
		* Count people with same first and last names versus general public:
		*
		* ```ts
		* const result = await db
		*   .selectFrom('person')
		*   .select((eb) => [
		*     eb.fn
		*       .count<number>('id')
		*       .filterWhereRef('first_name', '=', 'last_name')
		*       .as('repeat_name_count'),
		*     eb.fn.count<number>('id').as('total_count'),
		*   ])
		*   .executeTakeFirstOrThrow()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* select
		*   count("id") filter(where "first_name" = "last_name") as "repeat_name_count",
		*   count("id") as "total_count"
		* from "person"
		* ```
		*/
		filterWhereRef(lhs, op, rhs) {
			return new AggregateFunctionBuilder({
				...this.#props,
				aggregateFunctionNode: AggregateFunctionNode.cloneWithFilter(this.#props.aggregateFunctionNode, parseReferentialBinaryOperation(lhs, op, rhs))
			});
		}
		/**
		* Adds an `over` clause (window functions) after the function.
		*
		* ### Examples
		*
		* ```ts
		* const result = await db
		*   .selectFrom('person')
		*   .select(
		*     (eb) => eb.fn.avg<number>('age').over().as('average_age')
		*   )
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* select avg("age") over() as "average_age"
		* from "person"
		* ```
		*
		* Also supports passing a callback that returns an over builder,
		* allowing to add partition by and sort by clauses inside over.
		*
		* ```ts
		* const result = await db
		*   .selectFrom('person')
		*   .select(
		*     (eb) => eb.fn.avg<number>('age').over(
		*       ob => ob.partitionBy('last_name').orderBy('first_name', 'asc')
		*     ).as('average_age')
		*   )
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* select avg("age") over(partition by "last_name" order by "first_name" asc) as "average_age"
		* from "person"
		* ```
		*/
		over(over) {
			const builder = createOverBuilder();
			return new AggregateFunctionBuilder({
				...this.#props,
				aggregateFunctionNode: AggregateFunctionNode.cloneWithOver(this.#props.aggregateFunctionNode, (over ? over(builder) : builder).toOperationNode())
			});
		}
		/**
		* Simply calls the provided function passing `this` as the only argument. `$call` returns
		* what the provided function returns.
		*/
		$call(func) {
			return func(this);
		}
		/**
		* Casts the expression to the given type.
		*
		* This method call doesn't change the SQL in any way. This methods simply
		* returns a copy of this `AggregateFunctionBuilder` with a new output type.
		*/
		$castTo() {
			return new AggregateFunctionBuilder(this.#props);
		}
		/**
		* Omit null from the expression's type.
		*
		* This function can be useful in cases where you know an expression can't be
		* null, but Kysely is unable to infer it.
		*
		* This method call doesn't change the SQL in any way. This methods simply
		* returns a copy of `this` with a new output type.
		*/
		$notNull() {
			return new AggregateFunctionBuilder(this.#props);
		}
		toOperationNode() {
			return this.#props.aggregateFunctionNode;
		}
	};
	AliasedAggregateFunctionBuilder = class {
		#aggregateFunctionBuilder;
		#alias;
		constructor(aggregateFunctionBuilder, alias) {
			this.#aggregateFunctionBuilder = aggregateFunctionBuilder;
			this.#alias = alias;
		}
		/** @private */
		get expression() {
			return this.#aggregateFunctionBuilder;
		}
		/** @private */
		get alias() {
			return this.#alias;
		}
		toOperationNode() {
			return AliasNode.create(this.#aggregateFunctionBuilder.toOperationNode(), IdentifierNode.create(this.#alias));
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/query-builder/function-module.js
function createFunctionModule() {
	const fn = (name, args) => {
		return new ExpressionWrapper(FunctionNode.create(name, parseReferenceExpressionOrList(args ?? [])));
	};
	const agg = (name, args) => {
		return new AggregateFunctionBuilder({ aggregateFunctionNode: AggregateFunctionNode.create(name, args ? parseReferenceExpressionOrList(args) : void 0) });
	};
	return Object.assign(fn, {
		agg,
		avg(column) {
			return agg("avg", [column]);
		},
		coalesce(...values) {
			return fn("coalesce", values);
		},
		count(column) {
			return agg("count", [column]);
		},
		countAll(table) {
			return new AggregateFunctionBuilder({ aggregateFunctionNode: AggregateFunctionNode.create("count", parseSelectAll(table)) });
		},
		max(column) {
			return agg("max", [column]);
		},
		min(column) {
			return agg("min", [column]);
		},
		sum(column) {
			return agg("sum", [column]);
		},
		any(column) {
			return fn("any", [column]);
		},
		jsonAgg(table) {
			return new AggregateFunctionBuilder({ aggregateFunctionNode: AggregateFunctionNode.create("json_agg", [isString(table) ? parseTable(table) : table.toOperationNode()]) });
		},
		toJson(table) {
			return new ExpressionWrapper(FunctionNode.create("to_json", [isString(table) ? parseTable(table) : table.toOperationNode()]));
		}
	});
}
var init_function_module = __esmMin((() => {
	init_expression_wrapper();
	init_aggregate_function_node();
	init_function_node();
	init_reference_parser();
	init_select_parser();
	init_aggregate_function_builder();
	init_object_utils();
	init_table_parser();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/unary-operation-node.js
var UnaryOperationNode;
var init_unary_operation_node = __esmMin((() => {
	init_object_utils();
	UnaryOperationNode = freeze({
		is(node) {
			return node.kind === "UnaryOperationNode";
		},
		create(operator, operand) {
			return freeze({
				kind: "UnaryOperationNode",
				operator,
				operand
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/parser/unary-operation-parser.js
function parseUnaryOperation(operator, operand) {
	if (isUnaryOperator(operator)) return UnaryOperationNode.create(OperatorNode.create(operator), parseReferenceExpression(operand));
	throw new Error(`invalid unary operator ${JSON.stringify(operator)}`);
}
var init_unary_operation_parser = __esmMin((() => {
	init_operator_node();
	init_unary_operation_node();
	init_reference_parser();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/case-node.js
var CaseNode;
var init_case_node = __esmMin((() => {
	init_object_utils();
	init_when_node();
	CaseNode = freeze({
		is(node) {
			return node.kind === "CaseNode";
		},
		create(value) {
			return freeze({
				kind: "CaseNode",
				value
			});
		},
		cloneWithWhen(caseNode, when) {
			return freeze({
				...caseNode,
				when: freeze(caseNode.when ? [...caseNode.when, when] : [when])
			});
		},
		cloneWithThen(caseNode, then) {
			return freeze({
				...caseNode,
				when: caseNode.when ? freeze([...caseNode.when.slice(0, -1), WhenNode.cloneWithResult(caseNode.when[caseNode.when.length - 1], then)]) : void 0
			});
		},
		cloneWith(caseNode, props) {
			return freeze({
				...caseNode,
				...props
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/query-builder/case-builder.js
var CaseBuilder, CaseThenBuilder, CaseWhenBuilder, CaseEndBuilder;
var init_case_builder = __esmMin((() => {
	init_expression_wrapper();
	init_object_utils();
	init_reference_parser();
	init_case_node();
	init_when_node();
	init_binary_operation_parser();
	init_value_parser();
	CaseBuilder = class {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		when(...args) {
			return new CaseThenBuilder({
				...this.#props,
				node: CaseNode.cloneWithWhen(this.#props.node, WhenNode.create(parseValueBinaryOperationOrExpression(args)))
			});
		}
		whenRef(lhs, op, rhs) {
			return new CaseThenBuilder({
				...this.#props,
				node: CaseNode.cloneWithWhen(this.#props.node, WhenNode.create(parseReferentialBinaryOperation(lhs, op, rhs)))
			});
		}
	};
	CaseThenBuilder = class {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		then(valueExpression) {
			return new CaseWhenBuilder({
				...this.#props,
				node: CaseNode.cloneWithThen(this.#props.node, isSafeImmediateValue(valueExpression) ? parseSafeImmediateValue(valueExpression) : parseValueExpression(valueExpression))
			});
		}
		/**
		* Adds a `then` clause to the `case` statement where the value is a reference to a column.
		*
		* See {@link then} for value-first variant.
		*
		* A `thenRef` call can be followed by {@link Whenable.when}, {@link Whenable.whenRef},
		* {@link CaseWhenBuilder.else}, {@link CaseWhenBuilder.elseRef},
		* {@link CaseWhenBuilder.end} or {@link CaseWhenBuilder.endCase} call.
		*/
		thenRef(expression) {
			return new CaseWhenBuilder({
				...this.#props,
				node: CaseNode.cloneWithThen(this.#props.node, parseReferenceExpression(expression))
			});
		}
	};
	CaseWhenBuilder = class {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		when(...args) {
			return new CaseThenBuilder({
				...this.#props,
				node: CaseNode.cloneWithWhen(this.#props.node, WhenNode.create(parseValueBinaryOperationOrExpression(args)))
			});
		}
		whenRef(lhs, op, rhs) {
			return new CaseThenBuilder({
				...this.#props,
				node: CaseNode.cloneWithWhen(this.#props.node, WhenNode.create(parseReferentialBinaryOperation(lhs, op, rhs)))
			});
		}
		else(valueExpression) {
			return new CaseEndBuilder({
				...this.#props,
				node: CaseNode.cloneWith(this.#props.node, { else: isSafeImmediateValue(valueExpression) ? parseSafeImmediateValue(valueExpression) : parseValueExpression(valueExpression) })
			});
		}
		/**
		* Adds an `else` clause to the `case` statement where the value is a reference to a column.
		*
		* See {@link else} for value-first variant.
		*
		* An `elseRef` call must be followed by an {@link Endable.end} or {@link Endable.endCase} call.
		*/
		elseRef(expression) {
			return new CaseEndBuilder({
				...this.#props,
				node: CaseNode.cloneWith(this.#props.node, { else: parseReferenceExpression(expression) })
			});
		}
		end() {
			return new ExpressionWrapper(CaseNode.cloneWith(this.#props.node, { isStatement: false }));
		}
		endCase() {
			return new ExpressionWrapper(CaseNode.cloneWith(this.#props.node, { isStatement: true }));
		}
	};
	CaseEndBuilder = class {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		end() {
			return new ExpressionWrapper(CaseNode.cloneWith(this.#props.node, { isStatement: false }));
		}
		endCase() {
			return new ExpressionWrapper(CaseNode.cloneWith(this.#props.node, { isStatement: true }));
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/json-path-leg-node.js
var JSONPathLegNode;
var init_json_path_leg_node = __esmMin((() => {
	init_object_utils();
	JSONPathLegNode = freeze({
		is(node) {
			return node.kind === "JSONPathLegNode";
		},
		create(type, value) {
			return freeze({
				kind: "JSONPathLegNode",
				type,
				value
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/query-builder/json-path-builder.js
var HASH_NEGATIVE_INDEX_REGEX, JSONPathBuilder, TraversedJSONPathBuilder, AliasedJSONPathBuilder;
var init_json_path_builder = __esmMin((() => {
	init_alias_node();
	init_identifier_node();
	init_json_operator_chain_node();
	init_json_path_leg_node();
	init_json_path_node();
	init_json_reference_node();
	init_operation_node_source();
	init_value_node();
	HASH_NEGATIVE_INDEX_REGEX = /^#-\d+$/;
	JSONPathBuilder = class {
		#node;
		constructor(node) {
			this.#node = node;
		}
		/**
		* Access an element of a JSON array in a specific location.
		*
		* Since there's no guarantee an element exists in the given array location, the
		* resulting type is always nullable. If you're sure the element exists, you
		* should use {@link SelectQueryBuilder.$assertType} to narrow the type safely.
		*
		* See also {@link key} to access properties of JSON objects.
		*
		* ### Examples
		*
		* ```ts
		* await db.selectFrom('person')
		*   .select(eb =>
		*     eb.ref('nicknames', '->').at(0).as('primary_nickname')
		*   )
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* select "nicknames"->0 as "primary_nickname" from "person"
		*```
		*
		* Combined with {@link key}:
		*
		* ```ts
		* db.selectFrom('person').select(eb =>
		*   eb.ref('experience', '->').at(0).key('role').as('first_role')
		* )
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* select "experience"->0->'role' as "first_role" from "person"
		* ```
		*
		* You can use `'last'` to access the last element of the array in MySQL:
		*
		* ```ts
		* db.selectFrom('person').select(eb =>
		*   eb.ref('nicknames', '->$').at('last').as('last_nickname')
		* )
		* ```
		*
		* The generated SQL (MySQL):
		*
		* ```sql
		* select `nicknames`->'$[last]' as `last_nickname` from `person`
		* ```
		*
		* Or `'#-1'` in SQLite:
		*
		* ```ts
		* db.selectFrom('person').select(eb =>
		*   eb.ref('nicknames', '->>$').at('#-1').as('last_nickname')
		* )
		* ```
		*
		* The generated SQL (SQLite):
		*
		* ```sql
		* select "nicknames"->>'$[#-1]' as `last_nickname` from `person`
		* ```
		*/
		at(index) {
			if (typeof index !== "number" && typeof index !== "string" || typeof index === "number" && !Number.isInteger(index) || typeof index === "string" && index !== "last" && !HASH_NEGATIVE_INDEX_REGEX.test(index)) throw new Error(`Unexpected index value in .at(...): ${index}`);
			return this.#createBuilderWithPathLeg("ArrayLocation", index);
		}
		/**
		* Access a property of a JSON object.
		*
		* If a field is optional, the resulting type will be nullable.
		*
		* See also {@link at} to access elements of JSON arrays.
		*
		* ### Examples
		*
		* ```ts
		* db.selectFrom('person').select(eb =>
		*   eb.ref('address', '->').key('city').as('city')
		* )
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* select "address"->'city' as "city" from "person"
		* ```
		*
		* Going deeper:
		*
		* ```ts
		* db.selectFrom('person').select(eb =>
		*   eb.ref('profile', '->$').key('website').key('url').as('website_url')
		* )
		* ```
		*
		* The generated SQL (MySQL):
		*
		* ```sql
		* select `profile`->'$.website.url' as `website_url` from `person`
		* ```
		*
		* Combined with {@link at}:
		*
		* ```ts
		* db.selectFrom('person').select(eb =>
		*   eb.ref('profile', '->').key('addresses').at(0).key('city').as('city')
		* )
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* select "profile"->'addresses'->0->'city' as "city" from "person"
		* ```
		*/
		key(key) {
			return this.#createBuilderWithPathLeg("Member", key);
		}
		#createBuilderWithPathLeg(legType, value) {
			if (JSONReferenceNode.is(this.#node)) return new TraversedJSONPathBuilder(JSONReferenceNode.cloneWithTraversal(this.#node, JSONPathNode.is(this.#node.traversal) ? JSONPathNode.cloneWithLeg(this.#node.traversal, JSONPathLegNode.create(legType, value)) : JSONOperatorChainNode.cloneWithValue(this.#node.traversal, ValueNode.createImmediate(value))));
			return new TraversedJSONPathBuilder(JSONPathNode.cloneWithLeg(this.#node, JSONPathLegNode.create(legType, value)));
		}
	};
	TraversedJSONPathBuilder = class TraversedJSONPathBuilder extends JSONPathBuilder {
		#node;
		constructor(node) {
			super(node);
			this.#node = node;
		}
		/** @private */
		get expressionType() {}
		as(alias) {
			return new AliasedJSONPathBuilder(this, alias);
		}
		/**
		* Change the output type of the json path.
		*
		* This method call doesn't change the SQL in any way. This methods simply
		* returns a copy of this `JSONPathBuilder` with a new output type.
		*/
		$castTo() {
			return new TraversedJSONPathBuilder(this.#node);
		}
		$notNull() {
			return new TraversedJSONPathBuilder(this.#node);
		}
		toOperationNode() {
			return this.#node;
		}
	};
	AliasedJSONPathBuilder = class {
		#jsonPath;
		#alias;
		constructor(jsonPath, alias) {
			this.#jsonPath = jsonPath;
			this.#alias = alias;
		}
		/** @private */
		get expression() {
			return this.#jsonPath;
		}
		/** @private */
		get alias() {
			return this.#alias;
		}
		toOperationNode() {
			return AliasNode.create(this.#jsonPath.toOperationNode(), isOperationNodeSource(this.#alias) ? this.#alias.toOperationNode() : IdentifierNode.create(this.#alias));
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/tuple-node.js
var TupleNode;
var init_tuple_node = __esmMin((() => {
	init_object_utils();
	TupleNode = freeze({
		is(node) {
			return node.kind === "TupleNode";
		},
		create(values) {
			return freeze({
				kind: "TupleNode",
				values: freeze(values)
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/data-type-node.js
function isColumnDataType(dataType) {
	return SIMPLE_COLUMN_DATA_TYPES[dataType] || COLUMN_DATA_TYPE_REGEX.some((r) => r.test(dataType));
}
var SIMPLE_COLUMN_DATA_TYPES, COLUMN_DATA_TYPE_REGEX, DataTypeNode;
var init_data_type_node = __esmMin((() => {
	init_object_utils();
	SIMPLE_COLUMN_DATA_TYPES = freeze({
		bigint: true,
		bigserial: true,
		binary: true,
		blob: true,
		boolean: true,
		bytea: true,
		char: true,
		date: true,
		datemultirange: true,
		daterange: true,
		datetime: true,
		datetime2: true,
		decimal: true,
		"double precision": true,
		float4: true,
		float8: true,
		int2: true,
		int4: true,
		int4multirange: true,
		int4range: true,
		int8: true,
		int8multirange: true,
		int8range: true,
		integer: true,
		json: true,
		jsonb: true,
		numeric: true,
		nummultirange: true,
		numrange: true,
		real: true,
		serial: true,
		smallint: true,
		text: true,
		time: true,
		timestamp: true,
		timestamptz: true,
		timetz: true,
		tsmultirange: true,
		tsrange: true,
		tstzmultirange: true,
		tstzrange: true,
		uuid: true,
		varbinary: true,
		varchar: true
	});
	COLUMN_DATA_TYPE_REGEX = freeze([
		/^varchar\(\d+\)$/,
		/^char\(\d+\)$/,
		/^decimal\(\d+, \d+\)$/,
		/^numeric\(\d+, \d+\)$/,
		/^binary\(\d+\)$/,
		/^datetime\(\d+\)$/,
		/^time\(\d+\)$/,
		/^timetz\(\d+\)$/,
		/^timestamp\(\d+\)$/,
		/^timestamptz\(\d+\)$/,
		/^datetime2\(\d+\)$/,
		/^varbinary\(\d+\)$/
	]);
	DataTypeNode = freeze({
		is(node) {
			return node.kind === "DataTypeNode";
		},
		create(dataType) {
			return freeze({
				kind: "DataTypeNode",
				dataType
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/parser/data-type-parser.js
function parseDataTypeExpression(dataType) {
	if (isOperationNodeSource(dataType)) return dataType.toOperationNode();
	if (isColumnDataType(dataType)) return DataTypeNode.create(dataType);
	throw new Error(`invalid column data type ${JSON.stringify(dataType)}`);
}
var init_data_type_parser = __esmMin((() => {
	init_data_type_node();
	init_operation_node_source();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/cast-node.js
var CastNode;
var init_cast_node = __esmMin((() => {
	init_object_utils();
	CastNode = freeze({
		is(node) {
			return node.kind === "CastNode";
		},
		create(expression, dataType) {
			return freeze({
				kind: "CastNode",
				expression,
				dataType
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/expression/expression-builder.js
function createExpressionBuilder(executor = NOOP_QUERY_EXECUTOR) {
	function binary(lhs, op, rhs) {
		return new ExpressionWrapper(parseValueBinaryOperation(lhs, op, rhs));
	}
	function unary(op, expr) {
		return new ExpressionWrapper(parseUnaryOperation(op, expr));
	}
	const eb = Object.assign(binary, {
		fn: void 0,
		eb: void 0,
		selectFrom(table) {
			return createSelectQueryBuilder({
				queryId: createQueryId(),
				executor,
				queryNode: SelectQueryNode.createFrom(parseTableExpressionOrList(table))
			});
		},
		case(reference) {
			return new CaseBuilder({ node: CaseNode.create(isUndefined(reference) ? void 0 : parseReferenceExpression(reference)) });
		},
		ref(reference, op) {
			if (isUndefined(op)) return new ExpressionWrapper(parseStringReference(reference));
			return new JSONPathBuilder(parseJSONReference(reference, op));
		},
		jsonPath() {
			return new JSONPathBuilder(JSONPathNode.create());
		},
		table(table) {
			return new ExpressionWrapper(parseTable(table));
		},
		val(value) {
			return new ExpressionWrapper(parseValueExpression(value));
		},
		refTuple(...values) {
			return new ExpressionWrapper(TupleNode.create(values.map(parseReferenceExpression)));
		},
		tuple(...values) {
			return new ExpressionWrapper(TupleNode.create(values.map(parseValueExpression)));
		},
		lit(value) {
			return new ExpressionWrapper(parseSafeImmediateValue(value));
		},
		unary,
		not(expr) {
			return unary("not", expr);
		},
		exists(expr) {
			return unary("exists", expr);
		},
		neg(expr) {
			return unary("-", expr);
		},
		between(expr, start, end) {
			return new ExpressionWrapper(BinaryOperationNode.create(parseReferenceExpression(expr), OperatorNode.create("between"), AndNode.create(parseValueExpression(start), parseValueExpression(end))));
		},
		betweenSymmetric(expr, start, end) {
			return new ExpressionWrapper(BinaryOperationNode.create(parseReferenceExpression(expr), OperatorNode.create("between symmetric"), AndNode.create(parseValueExpression(start), parseValueExpression(end))));
		},
		and(exprs) {
			if (isReadonlyArray(exprs)) return new ExpressionWrapper(parseFilterList(exprs, "and"));
			return new ExpressionWrapper(parseFilterObject(exprs, "and"));
		},
		or(exprs) {
			if (isReadonlyArray(exprs)) return new ExpressionWrapper(parseFilterList(exprs, "or"));
			return new ExpressionWrapper(parseFilterObject(exprs, "or"));
		},
		parens(...args) {
			const node = parseValueBinaryOperationOrExpression(args);
			if (ParensNode.is(node)) return new ExpressionWrapper(node);
			else return new ExpressionWrapper(ParensNode.create(node));
		},
		cast(expr, dataType) {
			return new ExpressionWrapper(CastNode.create(parseReferenceExpression(expr), parseDataTypeExpression(dataType)));
		}
	});
	eb.fn = createFunctionModule();
	eb.eb = eb;
	return eb;
}
function expressionBuilder(_) {
	return createExpressionBuilder();
}
var init_expression_builder = __esmMin((() => {
	init_select_query_builder();
	init_select_query_node();
	init_table_parser();
	init_query_id();
	init_function_module();
	init_reference_parser();
	init_binary_operation_parser();
	init_parens_node();
	init_expression_wrapper();
	init_operator_node();
	init_unary_operation_parser();
	init_value_parser();
	init_noop_query_executor();
	init_case_builder();
	init_case_node();
	init_object_utils();
	init_json_path_builder();
	init_binary_operation_node();
	init_and_node();
	init_tuple_node();
	init_json_path_node();
	init_data_type_parser();
	init_cast_node();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/parser/expression-parser.js
function parseExpression(exp) {
	if (isOperationNodeSource(exp)) return exp.toOperationNode();
	else if (isFunction(exp)) return exp(expressionBuilder()).toOperationNode();
	throw new Error(`invalid expression: ${JSON.stringify(exp)}`);
}
function parseAliasedExpression(exp) {
	if (isOperationNodeSource(exp)) return exp.toOperationNode();
	else if (isFunction(exp)) return exp(expressionBuilder()).toOperationNode();
	throw new Error(`invalid aliased expression: ${JSON.stringify(exp)}`);
}
function isExpressionOrFactory(obj) {
	return isExpression(obj) || isAliasedExpression(obj) || isFunction(obj);
}
var init_expression_parser = __esmMin((() => {
	init_expression();
	init_operation_node_source();
	init_expression_builder();
	init_object_utils();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dynamic/dynamic-table-builder.js
function isAliasedDynamicTableBuilder(obj) {
	return isObject(obj) && isOperationNodeSource(obj) && isString(obj.table) && isString(obj.alias);
}
var DynamicTableBuilder, AliasedDynamicTableBuilder;
var init_dynamic_table_builder = __esmMin((() => {
	init_alias_node();
	init_identifier_node();
	init_operation_node_source();
	init_table_parser();
	init_object_utils();
	DynamicTableBuilder = class {
		#table;
		get table() {
			return this.#table;
		}
		constructor(table) {
			this.#table = table;
		}
		as(alias) {
			return new AliasedDynamicTableBuilder(this.#table, alias);
		}
	};
	AliasedDynamicTableBuilder = class {
		#table;
		#alias;
		get table() {
			return this.#table;
		}
		get alias() {
			return this.#alias;
		}
		constructor(table, alias) {
			this.#table = table;
			this.#alias = alias;
		}
		toOperationNode() {
			return AliasNode.create(parseTable(this.#table), IdentifierNode.create(this.#alias));
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/parser/table-parser.js
function parseTableExpressionOrList(table) {
	if (isReadonlyArray(table)) return table.map((it) => parseTableExpression(it));
	else return [parseTableExpression(table)];
}
function parseTableExpression(table) {
	if (isString(table)) return parseAliasedTable(table);
	else if (isAliasedDynamicTableBuilder(table)) return table.toOperationNode();
	else return parseAliasedExpression(table);
}
function parseAliasedTable(from) {
	const ALIAS_SEPARATOR = " as ";
	if (from.includes(ALIAS_SEPARATOR)) {
		const [table, alias] = from.split(ALIAS_SEPARATOR).map(trim$1);
		return AliasNode.create(parseTable(table), IdentifierNode.create(alias));
	} else return parseTable(from);
}
function parseTable(from) {
	const SCHEMA_SEPARATOR = ".";
	if (from.includes(SCHEMA_SEPARATOR)) {
		const [schema, table] = from.split(SCHEMA_SEPARATOR).map(trim$1);
		return TableNode.createWithSchema(schema, table);
	} else return TableNode.create(from);
}
function trim$1(str) {
	return str.trim();
}
var init_table_parser = __esmMin((() => {
	init_object_utils();
	init_alias_node();
	init_table_node();
	init_expression_parser();
	init_identifier_node();
	init_dynamic_table_builder();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/add-column-node.js
var AddColumnNode;
var init_add_column_node = __esmMin((() => {
	init_object_utils();
	AddColumnNode = freeze({
		is(node) {
			return node.kind === "AddColumnNode";
		},
		create(column) {
			return freeze({
				kind: "AddColumnNode",
				column
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/column-definition-node.js
var ColumnDefinitionNode;
var init_column_definition_node = __esmMin((() => {
	init_object_utils();
	init_column_node();
	ColumnDefinitionNode = freeze({
		is(node) {
			return node.kind === "ColumnDefinitionNode";
		},
		create(column, dataType) {
			return freeze({
				kind: "ColumnDefinitionNode",
				column: ColumnNode.create(column),
				dataType
			});
		},
		cloneWithFrontModifier(node, modifier) {
			return freeze({
				...node,
				frontModifiers: node.frontModifiers ? freeze([...node.frontModifiers, modifier]) : [modifier]
			});
		},
		cloneWithEndModifier(node, modifier) {
			return freeze({
				...node,
				endModifiers: node.endModifiers ? freeze([...node.endModifiers, modifier]) : [modifier]
			});
		},
		cloneWith(node, props) {
			return freeze({
				...node,
				...props
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/drop-column-node.js
var DropColumnNode;
var init_drop_column_node = __esmMin((() => {
	init_object_utils();
	init_column_node();
	DropColumnNode = freeze({
		is(node) {
			return node.kind === "DropColumnNode";
		},
		create(column) {
			return freeze({
				kind: "DropColumnNode",
				column: ColumnNode.create(column)
			});
		},
		cloneWith(node, props) {
			return freeze({
				...node,
				...props
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/rename-column-node.js
var RenameColumnNode;
var init_rename_column_node = __esmMin((() => {
	init_object_utils();
	init_column_node();
	RenameColumnNode = freeze({
		is(node) {
			return node.kind === "RenameColumnNode";
		},
		create(column, newColumn) {
			return freeze({
				kind: "RenameColumnNode",
				column: ColumnNode.create(column),
				renameTo: ColumnNode.create(newColumn)
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/check-constraint-node.js
var CheckConstraintNode;
var init_check_constraint_node = __esmMin((() => {
	init_object_utils();
	init_identifier_node();
	CheckConstraintNode = freeze({
		is(node) {
			return node.kind === "CheckConstraintNode";
		},
		create(expression, constraintName) {
			return freeze({
				kind: "CheckConstraintNode",
				expression,
				name: constraintName ? IdentifierNode.create(constraintName) : void 0
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/references-node.js
function isOnModifyForeignAction(thing) {
	return isString(thing) && ON_MODIFY_FOREIGN_ACTIONS_DICTIONARY[thing];
}
var ON_MODIFY_FOREIGN_ACTIONS_DICTIONARY, ReferencesNode;
var init_references_node = __esmMin((() => {
	init_object_utils();
	ON_MODIFY_FOREIGN_ACTIONS_DICTIONARY = freeze({
		cascade: true,
		"no action": true,
		restrict: true,
		"set default": true,
		"set null": true
	});
	Object.keys(ON_MODIFY_FOREIGN_ACTIONS_DICTIONARY);
	ReferencesNode = freeze({
		is(node) {
			return node.kind === "ReferencesNode";
		},
		create(table, columns) {
			return freeze({
				kind: "ReferencesNode",
				table,
				columns: freeze([...columns])
			});
		},
		cloneWithOnDelete(references, onDelete) {
			return freeze({
				...references,
				onDelete
			});
		},
		cloneWithOnUpdate(references, onUpdate) {
			return freeze({
				...references,
				onUpdate
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/parser/default-value-parser.js
function parseDefaultValueExpression(value) {
	return isOperationNodeSource(value) ? value.toOperationNode() : ValueNode.createImmediate(value);
}
var init_default_value_parser = __esmMin((() => {
	init_operation_node_source();
	init_value_node();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/generated-node.js
var GeneratedNode;
var init_generated_node = __esmMin((() => {
	init_object_utils();
	GeneratedNode = freeze({
		is(node) {
			return node.kind === "GeneratedNode";
		},
		create(params) {
			return freeze({
				kind: "GeneratedNode",
				...params
			});
		},
		createWithExpression(expression) {
			return freeze({
				kind: "GeneratedNode",
				always: true,
				expression
			});
		},
		cloneWith(node, params) {
			return freeze({
				...node,
				...params
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/default-value-node.js
var DefaultValueNode;
var init_default_value_node = __esmMin((() => {
	init_object_utils();
	DefaultValueNode = freeze({
		is(node) {
			return node.kind === "DefaultValueNode";
		},
		create(defaultValue) {
			return freeze({
				kind: "DefaultValueNode",
				defaultValue
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/parser/on-modify-action-parser.js
function parseOnModifyForeignAction(action) {
	if (isOnModifyForeignAction(action)) return action;
	throw new Error(`invalid OnModifyForeignAction ${action}`);
}
var init_on_modify_action_parser = __esmMin((() => {
	init_references_node();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/column-definition-builder.js
var ColumnDefinitionBuilder;
var init_column_definition_builder = __esmMin((() => {
	init_check_constraint_node();
	init_references_node();
	init_select_all_node();
	init_reference_parser();
	init_column_definition_node();
	init_default_value_parser();
	init_generated_node();
	init_default_value_node();
	init_on_modify_action_parser();
	ColumnDefinitionBuilder = class ColumnDefinitionBuilder {
		#node;
		constructor(node) {
			this.#node = node;
		}
		/**
		* Adds `auto_increment` or `autoincrement` to the column definition
		* depending on the dialect.
		*
		* Some dialects like PostgreSQL don't support this. On PostgreSQL
		* you can use the `serial` or `bigserial` data type instead.
		*
		* ### Examples
		*
		* ```ts
		* await db.schema
		*   .createTable('person')
		*   .addColumn('id', 'integer', col => col.autoIncrement().primaryKey())
		*   .execute()
		* ```
		*
		* The generated SQL (MySQL):
		*
		* ```sql
		* create table `person` (
		*   `id` integer primary key auto_increment
		* )
		* ```
		*/
		autoIncrement() {
			return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { autoIncrement: true }));
		}
		/**
		* Makes the column an identity column.
		*
		* This only works on some dialects like MS SQL Server (MSSQL).
		*
		* For PostgreSQL's `generated always as identity` use {@link generatedAlwaysAsIdentity}.
		*
		* ### Examples
		*
		* ```ts
		* await db.schema
		*   .createTable('person')
		*   .addColumn('id', 'integer', col => col.identity().primaryKey())
		*   .execute()
		* ```
		*
		* The generated SQL (MSSQL):
		*
		* ```sql
		* create table "person" (
		*   "id" integer identity primary key
		* )
		* ```
		*/
		identity() {
			return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { identity: true }));
		}
		/**
		* Makes the column the primary key.
		*
		* If you want to specify a composite primary key use the
		* {@link CreateTableBuilder.addPrimaryKeyConstraint} method.
		*
		* ### Examples
		*
		* ```ts
		* await db.schema
		*   .createTable('person')
		*   .addColumn('id', 'integer', col => col.primaryKey())
		*   .execute()
		* ```
		*
		* The generated SQL (MySQL):
		*
		* ```sql
		* create table `person` (
		*   `id` integer primary key
		* )
		*/
		primaryKey() {
			return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { primaryKey: true }));
		}
		/**
		* Adds a foreign key constraint for the column.
		*
		* If your database engine doesn't support foreign key constraints in the
		* column definition (like MySQL 5) you need to call the table level
		* {@link CreateTableBuilder.addForeignKeyConstraint} method instead.
		*
		* ### Examples
		*
		* ```ts
		* await db.schema
		*   .createTable('pet')
		*   .addColumn('owner_id', 'integer', (col) => col.references('person.id'))
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* create table "pet" (
		*   "owner_id" integer references "person" ("id")
		* )
		* ```
		*/
		references(ref) {
			const references = parseStringReference(ref);
			if (!references.table || SelectAllNode.is(references.column)) throw new Error(`invalid call references('${ref}'). The reference must have format table.column or schema.table.column`);
			return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { references: ReferencesNode.create(references.table, [references.column]) }));
		}
		/**
		* Adds an `on delete` constraint for the foreign key column.
		*
		* If your database engine doesn't support foreign key constraints in the
		* column definition (like MySQL 5) you need to call the table level
		* {@link CreateTableBuilder.addForeignKeyConstraint} method instead.
		*
		* ### Examples
		*
		* ```ts
		* await db.schema
		*   .createTable('pet')
		*   .addColumn(
		*     'owner_id',
		*     'integer',
		*     (col) => col.references('person.id').onDelete('cascade')
		*   )
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* create table "pet" (
		*   "owner_id" integer references "person" ("id") on delete cascade
		* )
		* ```
		*/
		onDelete(onDelete) {
			if (!this.#node.references) throw new Error("on delete constraint can only be added for foreign keys");
			return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { references: ReferencesNode.cloneWithOnDelete(this.#node.references, parseOnModifyForeignAction(onDelete)) }));
		}
		/**
		* Adds an `on update` constraint for the foreign key column.
		*
		* If your database engine doesn't support foreign key constraints in the
		* column definition (like MySQL 5) you need to call the table level
		* {@link CreateTableBuilder.addForeignKeyConstraint} method instead.
		*
		* ### Examples
		*
		* ```ts
		* await db.schema
		*   .createTable('pet')
		*   .addColumn(
		*     'owner_id',
		*     'integer',
		*     (col) => col.references('person.id').onUpdate('cascade')
		*   )
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* create table "pet" (
		*   "owner_id" integer references "person" ("id") on update cascade
		* )
		* ```
		*/
		onUpdate(onUpdate) {
			if (!this.#node.references) throw new Error("on update constraint can only be added for foreign keys");
			return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { references: ReferencesNode.cloneWithOnUpdate(this.#node.references, parseOnModifyForeignAction(onUpdate)) }));
		}
		/**
		* Adds a unique constraint for the column.
		*
		* ### Examples
		*
		* ```ts
		* await db.schema
		*   .createTable('person')
		*   .addColumn('email', 'varchar(255)', col => col.unique())
		*   .execute()
		* ```
		*
		* The generated SQL (MySQL):
		*
		* ```sql
		* create table `person` (
		*   `email` varchar(255) unique
		* )
		* ```
		*/
		unique() {
			return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { unique: true }));
		}
		/**
		* Adds a `not null` constraint for the column.
		*
		* ### Examples
		*
		* ```ts
		* await db.schema
		*   .createTable('person')
		*   .addColumn('first_name', 'varchar(255)', col => col.notNull())
		*   .execute()
		* ```
		*
		* The generated SQL (MySQL):
		*
		* ```sql
		* create table `person` (
		*   `first_name` varchar(255) not null
		* )
		* ```
		*/
		notNull() {
			return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { notNull: true }));
		}
		/**
		* Adds a `unsigned` modifier for the column.
		*
		* This only works on some dialects like MySQL.
		*
		* ### Examples
		*
		* ```ts
		* await db.schema
		*   .createTable('person')
		*   .addColumn('age', 'integer', col => col.unsigned())
		*   .execute()
		* ```
		*
		* The generated SQL (MySQL):
		*
		* ```sql
		* create table `person` (
		*   `age` integer unsigned
		* )
		* ```
		*/
		unsigned() {
			return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { unsigned: true }));
		}
		/**
		* Adds a default value constraint for the column.
		*
		* ### Examples
		*
		* ```ts
		* await db.schema
		*   .createTable('pet')
		*   .addColumn('number_of_legs', 'integer', (col) => col.defaultTo(4))
		*   .execute()
		* ```
		*
		* The generated SQL (MySQL):
		*
		* ```sql
		* create table `pet` (
		*   `number_of_legs` integer default 4
		* )
		* ```
		*
		* Values passed to `defaultTo` are interpreted as value literals by default. You can define
		* an arbitrary SQL expression using the {@link sql} template tag:
		*
		* ```ts
		* import { sql } from 'kysely'
		*
		* await db.schema
		*   .createTable('pet')
		*   .addColumn(
		*     'created_at',
		*     'timestamp',
		*     (col) => col.defaultTo(sql`CURRENT_TIMESTAMP`)
		*   )
		*   .execute()
		* ```
		*
		* The generated SQL (MySQL):
		*
		* ```sql
		* create table `pet` (
		*   `created_at` timestamp default CURRENT_TIMESTAMP
		* )
		* ```
		*/
		defaultTo(value) {
			return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { defaultTo: DefaultValueNode.create(parseDefaultValueExpression(value)) }));
		}
		/**
		* Adds a check constraint for the column.
		*
		* ### Examples
		*
		* ```ts
		* import { sql } from 'kysely'
		*
		* await db.schema
		*   .createTable('pet')
		*   .addColumn('number_of_legs', 'integer', (col) =>
		*     col.check(sql`number_of_legs < 5`)
		*   )
		*   .execute()
		* ```
		*
		* The generated SQL (MySQL):
		*
		* ```sql
		* create table `pet` (
		*   `number_of_legs` integer check (number_of_legs < 5)
		* )
		* ```
		*/
		check(expression) {
			return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { check: CheckConstraintNode.create(expression.toOperationNode()) }));
		}
		/**
		* Makes the column a generated column using a `generated always as` statement.
		*
		* ### Examples
		*
		* ```ts
		* import { sql } from 'kysely'
		*
		* await db.schema
		*   .createTable('person')
		*   .addColumn('full_name', 'varchar(255)',
		*     (col) => col.generatedAlwaysAs(sql`concat(first_name, ' ', last_name)`)
		*   )
		*   .execute()
		* ```
		*
		* The generated SQL (MySQL):
		*
		* ```sql
		* create table `person` (
		*   `full_name` varchar(255) generated always as (concat(first_name, ' ', last_name))
		* )
		* ```
		*/
		generatedAlwaysAs(expression) {
			return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { generated: GeneratedNode.createWithExpression(expression.toOperationNode()) }));
		}
		/**
		* Adds the `generated always as identity` specifier.
		*
		* This only works on some dialects like PostgreSQL.
		*
		* For MS SQL Server (MSSQL)'s identity column use {@link identity}.
		*
		* ### Examples
		*
		* ```ts
		* await db.schema
		*   .createTable('person')
		*   .addColumn('id', 'integer', col => col.generatedAlwaysAsIdentity().primaryKey())
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* create table "person" (
		*   "id" integer generated always as identity primary key
		* )
		* ```
		*/
		generatedAlwaysAsIdentity() {
			return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { generated: GeneratedNode.create({
				identity: true,
				always: true
			}) }));
		}
		/**
		* Adds the `generated by default as identity` specifier on supported dialects.
		*
		* This only works on some dialects like PostgreSQL.
		*
		* For MS SQL Server (MSSQL)'s identity column use {@link identity}.
		*
		* ### Examples
		*
		* ```ts
		* await db.schema
		*   .createTable('person')
		*   .addColumn('id', 'integer', col => col.generatedByDefaultAsIdentity().primaryKey())
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* create table "person" (
		*   "id" integer generated by default as identity primary key
		* )
		* ```
		*/
		generatedByDefaultAsIdentity() {
			return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { generated: GeneratedNode.create({
				identity: true,
				byDefault: true
			}) }));
		}
		/**
		* Makes a generated column stored instead of virtual. This method can only
		* be used with {@link generatedAlwaysAs}
		*
		* ### Examples
		*
		* ```ts
		* import { sql } from 'kysely'
		*
		* await db.schema
		*   .createTable('person')
		*   .addColumn('full_name', 'varchar(255)', (col) => col
		*     .generatedAlwaysAs(sql`concat(first_name, ' ', last_name)`)
		*     .stored()
		*   )
		*   .execute()
		* ```
		*
		* The generated SQL (MySQL):
		*
		* ```sql
		* create table `person` (
		*   `full_name` varchar(255) generated always as (concat(first_name, ' ', last_name)) stored
		* )
		* ```
		*/
		stored() {
			if (!this.#node.generated) throw new Error("stored() can only be called after generatedAlwaysAs");
			return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { generated: GeneratedNode.cloneWith(this.#node.generated, { stored: true }) }));
		}
		/**
		* This can be used to add any additional SQL right after the column's data type.
		*
		* ### Examples
		*
		* ```ts
		* import { sql } from 'kysely'
		*
		* await db.schema
		*   .createTable('person')
		*   .addColumn('id', 'integer', col => col.primaryKey())
		*   .addColumn(
		*     'first_name',
		*     'varchar(36)',
		*     (col) => col.modifyFront(sql`collate utf8mb4_general_ci`).notNull()
		*   )
		*   .execute()
		* ```
		*
		* The generated SQL (MySQL):
		*
		* ```sql
		* create table `person` (
		*   `id` integer primary key,
		*   `first_name` varchar(36) collate utf8mb4_general_ci not null
		* )
		* ```
		*/
		modifyFront(modifier) {
			return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWithFrontModifier(this.#node, modifier.toOperationNode()));
		}
		/**
		* Adds `nulls not distinct` specifier.
		* Should be used with `unique` constraint.
		*
		* This only works on some dialects like PostgreSQL.
		*
		* ### Examples
		*
		* ```ts
		* db.schema
		*   .createTable('person')
		*   .addColumn('id', 'integer', col => col.primaryKey())
		*   .addColumn('first_name', 'varchar(30)', col => col.unique().nullsNotDistinct())
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* create table "person" (
		*   "id" integer primary key,
		*   "first_name" varchar(30) unique nulls not distinct
		* )
		* ```
		*/
		nullsNotDistinct() {
			return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { nullsNotDistinct: true }));
		}
		/**
		* Adds `if not exists` specifier. This only works for PostgreSQL.
		*
		* ### Examples
		*
		* ```ts
		* await db.schema
		*   .alterTable('person')
		*   .addColumn('email', 'varchar(255)', col => col.unique().ifNotExists())
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* alter table "person" add column if not exists "email" varchar(255) unique
		* ```
		*/
		ifNotExists() {
			return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWith(this.#node, { ifNotExists: true }));
		}
		/**
		* This can be used to add any additional SQL to the end of the column definition.
		*
		* ### Examples
		*
		* ```ts
		* import { sql } from 'kysely'
		*
		* await db.schema
		*   .createTable('person')
		*   .addColumn('id', 'integer', col => col.primaryKey())
		*   .addColumn(
		*     'age',
		*     'integer',
		*     col => col.unsigned()
		*       .notNull()
		*       .modifyEnd(sql`comment ${sql.lit('it is not polite to ask a woman her age')}`)
		*   )
		*   .execute()
		* ```
		*
		* The generated SQL (MySQL):
		*
		* ```sql
		* create table `person` (
		*   `id` integer primary key,
		*   `age` integer unsigned not null comment 'it is not polite to ask a woman her age'
		* )
		* ```
		*/
		modifyEnd(modifier) {
			return new ColumnDefinitionBuilder(ColumnDefinitionNode.cloneWithEndModifier(this.#node, modifier.toOperationNode()));
		}
		/**
		* Simply calls the provided function passing `this` as the only argument. `$call` returns
		* what the provided function returns.
		*/
		$call(func) {
			return func(this);
		}
		toOperationNode() {
			return this.#node;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/modify-column-node.js
var ModifyColumnNode;
var init_modify_column_node = __esmMin((() => {
	init_object_utils();
	ModifyColumnNode = freeze({
		is(node) {
			return node.kind === "ModifyColumnNode";
		},
		create(column) {
			return freeze({
				kind: "ModifyColumnNode",
				column
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/foreign-key-constraint-node.js
var ForeignKeyConstraintNode;
var init_foreign_key_constraint_node = __esmMin((() => {
	init_object_utils();
	init_identifier_node();
	init_references_node();
	ForeignKeyConstraintNode = freeze({
		is(node) {
			return node.kind === "ForeignKeyConstraintNode";
		},
		create(sourceColumns, targetTable, targetColumns, constraintName) {
			return freeze({
				kind: "ForeignKeyConstraintNode",
				columns: sourceColumns,
				references: ReferencesNode.create(targetTable, targetColumns),
				name: constraintName ? IdentifierNode.create(constraintName) : void 0
			});
		},
		cloneWith(node, props) {
			return freeze({
				...node,
				...props
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/foreign-key-constraint-builder.js
var ForeignKeyConstraintBuilder;
var init_foreign_key_constraint_builder = __esmMin((() => {
	init_foreign_key_constraint_node();
	init_on_modify_action_parser();
	ForeignKeyConstraintBuilder = class ForeignKeyConstraintBuilder {
		#node;
		constructor(node) {
			this.#node = node;
		}
		onDelete(onDelete) {
			return new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(this.#node, { onDelete: parseOnModifyForeignAction(onDelete) }));
		}
		onUpdate(onUpdate) {
			return new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(this.#node, { onUpdate: parseOnModifyForeignAction(onUpdate) }));
		}
		deferrable() {
			return new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(this.#node, { deferrable: true }));
		}
		notDeferrable() {
			return new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(this.#node, { deferrable: false }));
		}
		initiallyDeferred() {
			return new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(this.#node, { initiallyDeferred: true }));
		}
		initiallyImmediate() {
			return new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.cloneWith(this.#node, { initiallyDeferred: false }));
		}
		/**
		* Simply calls the provided function passing `this` as the only argument. `$call` returns
		* what the provided function returns.
		*/
		$call(func) {
			return func(this);
		}
		toOperationNode() {
			return this.#node;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/add-constraint-node.js
var AddConstraintNode;
var init_add_constraint_node = __esmMin((() => {
	init_object_utils();
	AddConstraintNode = freeze({
		is(node) {
			return node.kind === "AddConstraintNode";
		},
		create(constraint) {
			return freeze({
				kind: "AddConstraintNode",
				constraint
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/unique-constraint-node.js
var UniqueConstraintNode;
var init_unique_constraint_node = __esmMin((() => {
	init_log_once();
	init_object_utils();
	init_column_node();
	init_identifier_node();
	UniqueConstraintNode = freeze({
		is(node) {
			return node.kind === "UniqueConstraintNode";
		},
		create(columns, constraintName, nullsNotDistinct) {
			if (isString(columns.at(0))) {
				logOnce("`UniqueConstraintNode.create(columns: string[], ...)` is deprecated - pass `ColumnNode[]` instead.");
				columns = columns.map(ColumnNode.create);
			}
			return freeze({
				kind: "UniqueConstraintNode",
				columns: freeze(columns),
				name: constraintName ? IdentifierNode.create(constraintName) : void 0,
				nullsNotDistinct
			});
		},
		cloneWith(node, props) {
			return freeze({
				...node,
				...props
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/drop-constraint-node.js
var DropConstraintNode;
var init_drop_constraint_node = __esmMin((() => {
	init_object_utils();
	init_identifier_node();
	DropConstraintNode = freeze({
		is(node) {
			return node.kind === "DropConstraintNode";
		},
		create(constraintName) {
			return freeze({
				kind: "DropConstraintNode",
				constraintName: IdentifierNode.create(constraintName)
			});
		},
		cloneWith(dropConstraint, props) {
			return freeze({
				...dropConstraint,
				...props
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/alter-column-node.js
var AlterColumnNode;
var init_alter_column_node = __esmMin((() => {
	init_object_utils();
	init_column_node();
	AlterColumnNode = freeze({
		is(node) {
			return node.kind === "AlterColumnNode";
		},
		create(column, prop, value) {
			return freeze({
				kind: "AlterColumnNode",
				column: ColumnNode.create(column),
				[prop]: value
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/alter-column-builder.js
var AlterColumnBuilder, AlteredColumnBuilder;
var init_alter_column_builder = __esmMin((() => {
	init_alter_column_node();
	init_data_type_parser();
	init_default_value_parser();
	AlterColumnBuilder = class {
		#column;
		constructor(column) {
			this.#column = column;
		}
		setDataType(dataType) {
			return new AlteredColumnBuilder(AlterColumnNode.create(this.#column, "dataType", parseDataTypeExpression(dataType)));
		}
		setDefault(value) {
			return new AlteredColumnBuilder(AlterColumnNode.create(this.#column, "setDefault", parseDefaultValueExpression(value)));
		}
		dropDefault() {
			return new AlteredColumnBuilder(AlterColumnNode.create(this.#column, "dropDefault", true));
		}
		setNotNull() {
			return new AlteredColumnBuilder(AlterColumnNode.create(this.#column, "setNotNull", true));
		}
		dropNotNull() {
			return new AlteredColumnBuilder(AlterColumnNode.create(this.#column, "dropNotNull", true));
		}
		/**
		* Simply calls the provided function passing `this` as the only argument. `$call` returns
		* what the provided function returns.
		*/
		$call(func) {
			return func(this);
		}
	};
	AlteredColumnBuilder = class {
		#alterColumnNode;
		constructor(alterColumnNode) {
			this.#alterColumnNode = alterColumnNode;
		}
		toOperationNode() {
			return this.#alterColumnNode;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/alter-table-executor.js
var AlterTableExecutor;
var init_alter_table_executor = __esmMin((() => {
	init_object_utils();
	AlterTableExecutor = class {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		toOperationNode() {
			return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
		}
		compile() {
			return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
		}
		async execute(options) {
			await this.#props.executor.executeQuery(this.compile(), options);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/alter-table-add-foreign-key-constraint-builder.js
var AlterTableAddForeignKeyConstraintBuilder;
var init_alter_table_add_foreign_key_constraint_builder = __esmMin((() => {
	init_add_constraint_node();
	init_alter_table_node();
	init_object_utils();
	AlterTableAddForeignKeyConstraintBuilder = class AlterTableAddForeignKeyConstraintBuilder {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		onDelete(onDelete) {
			return new AlterTableAddForeignKeyConstraintBuilder({
				...this.#props,
				constraintBuilder: this.#props.constraintBuilder.onDelete(onDelete)
			});
		}
		onUpdate(onUpdate) {
			return new AlterTableAddForeignKeyConstraintBuilder({
				...this.#props,
				constraintBuilder: this.#props.constraintBuilder.onUpdate(onUpdate)
			});
		}
		deferrable() {
			return new AlterTableAddForeignKeyConstraintBuilder({
				...this.#props,
				constraintBuilder: this.#props.constraintBuilder.deferrable()
			});
		}
		notDeferrable() {
			return new AlterTableAddForeignKeyConstraintBuilder({
				...this.#props,
				constraintBuilder: this.#props.constraintBuilder.notDeferrable()
			});
		}
		initiallyDeferred() {
			return new AlterTableAddForeignKeyConstraintBuilder({
				...this.#props,
				constraintBuilder: this.#props.constraintBuilder.initiallyDeferred()
			});
		}
		initiallyImmediate() {
			return new AlterTableAddForeignKeyConstraintBuilder({
				...this.#props,
				constraintBuilder: this.#props.constraintBuilder.initiallyImmediate()
			});
		}
		/**
		* Simply calls the provided function passing `this` as the only argument. `$call` returns
		* what the provided function returns.
		*/
		$call(func) {
			return func(this);
		}
		toOperationNode() {
			return this.#props.executor.transformQuery(AlterTableNode.cloneWithTableProps(this.#props.node, { addConstraint: AddConstraintNode.create(this.#props.constraintBuilder.toOperationNode()) }), this.#props.queryId);
		}
		compile() {
			return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
		}
		async execute(options) {
			await this.#props.executor.executeQuery(this.compile(), options);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/alter-table-drop-constraint-builder.js
var AlterTableDropConstraintBuilder;
var init_alter_table_drop_constraint_builder = __esmMin((() => {
	init_alter_table_node();
	init_drop_constraint_node();
	init_object_utils();
	AlterTableDropConstraintBuilder = class AlterTableDropConstraintBuilder {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		ifExists() {
			return new AlterTableDropConstraintBuilder({
				...this.#props,
				node: AlterTableNode.cloneWithTableProps(this.#props.node, { dropConstraint: DropConstraintNode.cloneWith(this.#props.node.dropConstraint, { ifExists: true }) })
			});
		}
		cascade() {
			return new AlterTableDropConstraintBuilder({
				...this.#props,
				node: AlterTableNode.cloneWithTableProps(this.#props.node, { dropConstraint: DropConstraintNode.cloneWith(this.#props.node.dropConstraint, { modifier: "cascade" }) })
			});
		}
		restrict() {
			return new AlterTableDropConstraintBuilder({
				...this.#props,
				node: AlterTableNode.cloneWithTableProps(this.#props.node, { dropConstraint: DropConstraintNode.cloneWith(this.#props.node.dropConstraint, { modifier: "restrict" }) })
			});
		}
		/**
		* Simply calls the provided function passing `this` as the only argument. `$call` returns
		* what the provided function returns.
		*/
		$call(func) {
			return func(this);
		}
		toOperationNode() {
			return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
		}
		compile() {
			return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
		}
		async execute(options) {
			await this.#props.executor.executeQuery(this.compile(), options);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/primary-key-constraint-node.js
var PrimaryKeyConstraintNode;
var init_primary_key_constraint_node = __esmMin((() => {
	init_object_utils();
	init_column_node();
	init_identifier_node();
	PrimaryKeyConstraintNode = freeze({
		is(node) {
			return node.kind === "PrimaryKeyConstraintNode";
		},
		create(columns, constraintName) {
			return freeze({
				kind: "PrimaryKeyConstraintNode",
				columns: freeze(columns.map(ColumnNode.create)),
				name: constraintName ? IdentifierNode.create(constraintName) : void 0
			});
		},
		cloneWith(node, props) {
			return freeze({
				...node,
				...props
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/add-index-node.js
var AddIndexNode;
var init_add_index_node = __esmMin((() => {
	init_object_utils();
	init_identifier_node();
	AddIndexNode = freeze({
		is(node) {
			return node.kind === "AddIndexNode";
		},
		create(name) {
			return freeze({
				kind: "AddIndexNode",
				name: IdentifierNode.create(name)
			});
		},
		cloneWith(node, props) {
			return freeze({
				...node,
				...props
			});
		},
		cloneWithColumns(node, columns) {
			return freeze({
				...node,
				columns: [...node.columns || [], ...columns]
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/alter-table-add-index-builder.js
var AlterTableAddIndexBuilder;
var init_alter_table_add_index_builder = __esmMin((() => {
	init_add_index_node();
	init_alter_table_node();
	init_raw_node();
	init_reference_parser();
	init_object_utils();
	AlterTableAddIndexBuilder = class AlterTableAddIndexBuilder {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		/**
		* Makes the index unique.
		*
		* ### Examples
		*
		* ```ts
		* await db.schema
		*   .alterTable('person')
		*   .addIndex('person_first_name_index')
		*   .unique()
		*   .column('email')
		*   .execute()
		* ```
		*
		* The generated SQL (MySQL):
		*
		* ```sql
		* alter table `person` add unique index `person_first_name_index` (`email`)
		* ```
		*/
		unique() {
			return new AlterTableAddIndexBuilder({
				...this.#props,
				node: AlterTableNode.cloneWithTableProps(this.#props.node, { addIndex: AddIndexNode.cloneWith(this.#props.node.addIndex, { unique: true }) })
			});
		}
		column(arg) {
			return new AlterTableAddIndexBuilder({
				...this.#props,
				node: AlterTableNode.cloneWithTableProps(this.#props.node, { addIndex: AddIndexNode.cloneWithColumns(this.#props.node.addIndex, [isString(arg) ? parseOrderedColumnName(arg) : arg.toOperationNode()]) })
			});
		}
		/**
		* Specifies a list of columns for the index.
		*
		* Also see {@link column} for adding a single column or {@link expression} for
		* specifying an arbitrary expression.
		*
		* ### Examples
		*
		* ```ts
		* import { sql } from 'kysely'
		*
		* await db.schema
		*   .alterTable('person')
		*   .addIndex('person_first_name_and_age_index')
		*   .columns(['first_name', sql`(left(lower(last_name), 1))`, 'age desc'])
		*   .execute()
		* ```
		*
		* The generated SQL (MySQL):
		*
		* ```sql
		* alter table `person`
		* add index `person_first_name_and_age_index` (
		*   `first_name`,
		*   (left(lower(last_name), 1)),
		*   `age` desc
		* )
		* ```
		*/
		columns(columns) {
			return new AlterTableAddIndexBuilder({
				...this.#props,
				node: AlterTableNode.cloneWithTableProps(this.#props.node, { addIndex: AddIndexNode.cloneWithColumns(this.#props.node.addIndex, columns.map((item) => isString(item) ? parseOrderedColumnName(item) : item.toOperationNode())) })
			});
		}
		/**
		* Specifies an arbitrary expression for the index.
		*
		* ### Examples
		*
		* ```ts
		* import { sql } from 'kysely'
		*
		* await db.schema
		*   .alterTable('person')
		*   .addIndex('person_first_name_index')
		*   .expression(sql<boolean>`(first_name < 'Sami')`)
		*   .execute()
		* ```
		*
		* The generated SQL (MySQL):
		*
		* ```sql
		* alter table `person` add index `person_first_name_index` ((first_name < 'Sami'))
		* ```
		*
		* @deprecated Use {@link column} or {@link columns} with an {@link Expression} instead.
		*/
		expression(expression) {
			return new AlterTableAddIndexBuilder({
				...this.#props,
				node: AlterTableNode.cloneWithTableProps(this.#props.node, { addIndex: AddIndexNode.cloneWithColumns(this.#props.node.addIndex, [expression.toOperationNode()]) })
			});
		}
		using(indexType) {
			return new AlterTableAddIndexBuilder({
				...this.#props,
				node: AlterTableNode.cloneWithTableProps(this.#props.node, { addIndex: AddIndexNode.cloneWith(this.#props.node.addIndex, { using: RawNode.createWithSql(indexType) }) })
			});
		}
		/**
		* Simply calls the provided function passing `this` as the only argument. `$call` returns
		* what the provided function returns.
		*/
		$call(func) {
			return func(this);
		}
		toOperationNode() {
			return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
		}
		compile() {
			return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
		}
		async execute(options) {
			await this.#props.executor.executeQuery(this.compile(), options);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/unique-constraint-builder.js
var UniqueConstraintNodeBuilder;
var init_unique_constraint_builder = __esmMin((() => {
	init_unique_constraint_node();
	UniqueConstraintNodeBuilder = class UniqueConstraintNodeBuilder {
		#node;
		constructor(node) {
			this.#node = node;
		}
		/**
		* Adds `nulls not distinct` to the unique constraint definition
		*
		* Supported by PostgreSQL dialect only
		*/
		nullsNotDistinct() {
			return new UniqueConstraintNodeBuilder(UniqueConstraintNode.cloneWith(this.#node, { nullsNotDistinct: true }));
		}
		deferrable() {
			return new UniqueConstraintNodeBuilder(UniqueConstraintNode.cloneWith(this.#node, { deferrable: true }));
		}
		notDeferrable() {
			return new UniqueConstraintNodeBuilder(UniqueConstraintNode.cloneWith(this.#node, { deferrable: false }));
		}
		initiallyDeferred() {
			return new UniqueConstraintNodeBuilder(UniqueConstraintNode.cloneWith(this.#node, { initiallyDeferred: true }));
		}
		initiallyImmediate() {
			return new UniqueConstraintNodeBuilder(UniqueConstraintNode.cloneWith(this.#node, { initiallyDeferred: false }));
		}
		/**
		* Simply calls the provided function passing `this` as the only argument. `$call` returns
		* what the provided function returns.
		*/
		$call(func) {
			return func(this);
		}
		toOperationNode() {
			return this.#node;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/primary-key-constraint-builder.js
var PrimaryKeyConstraintBuilder;
var init_primary_key_constraint_builder = __esmMin((() => {
	init_primary_key_constraint_node();
	PrimaryKeyConstraintBuilder = class PrimaryKeyConstraintBuilder {
		#node;
		constructor(node) {
			this.#node = node;
		}
		deferrable() {
			return new PrimaryKeyConstraintBuilder(PrimaryKeyConstraintNode.cloneWith(this.#node, { deferrable: true }));
		}
		notDeferrable() {
			return new PrimaryKeyConstraintBuilder(PrimaryKeyConstraintNode.cloneWith(this.#node, { deferrable: false }));
		}
		initiallyDeferred() {
			return new PrimaryKeyConstraintBuilder(PrimaryKeyConstraintNode.cloneWith(this.#node, { initiallyDeferred: true }));
		}
		initiallyImmediate() {
			return new PrimaryKeyConstraintBuilder(PrimaryKeyConstraintNode.cloneWith(this.#node, { initiallyDeferred: false }));
		}
		/**
		* Simply calls the provided function passing `this` as the only argument. `$call` returns
		* what the provided function returns.
		*/
		$call(func) {
			return func(this);
		}
		toOperationNode() {
			return this.#node;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/check-constraint-builder.js
var CheckConstraintBuilder;
var init_check_constraint_builder = __esmMin((() => {
	CheckConstraintBuilder = class {
		#node;
		constructor(node) {
			this.#node = node;
		}
		/**
		* Simply calls the provided function passing `this` as the only argument. `$call` returns
		* what the provided function returns.
		*/
		$call(func) {
			return func(this);
		}
		toOperationNode() {
			return this.#node;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/rename-constraint-node.js
var RenameConstraintNode;
var init_rename_constraint_node = __esmMin((() => {
	init_object_utils();
	init_identifier_node();
	RenameConstraintNode = freeze({
		is(node) {
			return node.kind === "RenameConstraintNode";
		},
		create(oldName, newName) {
			return freeze({
				kind: "RenameConstraintNode",
				oldName: IdentifierNode.create(oldName),
				newName: IdentifierNode.create(newName)
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/drop-column-builder.js
var DropColumnBuilder;
var init_drop_column_builder = __esmMin((() => {
	init_drop_column_node();
	init_object_utils();
	DropColumnBuilder = class DropColumnBuilder {
		#props;
		constructor(props) {
			this.#props = freeze({ ...props });
		}
		ifExists() {
			return new DropColumnBuilder({
				...this.#props,
				node: DropColumnNode.cloneWith(this.#props.node, { ifExists: true })
			});
		}
		toOperationNode() {
			return this.#props.node;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/alter-table-builder.js
var AlterTableBuilder, AlterTableColumnAlteringBuilder;
var init_alter_table_builder = __esmMin((() => {
	init_add_column_node();
	init_alter_table_node();
	init_column_definition_node();
	init_drop_column_node();
	init_identifier_node();
	init_rename_column_node();
	init_object_utils();
	init_column_definition_builder();
	init_modify_column_node();
	init_data_type_parser();
	init_foreign_key_constraint_builder();
	init_add_constraint_node();
	init_unique_constraint_node();
	init_check_constraint_node();
	init_foreign_key_constraint_node();
	init_column_node();
	init_table_parser();
	init_drop_constraint_node();
	init_alter_column_builder();
	init_alter_table_executor();
	init_alter_table_add_foreign_key_constraint_builder();
	init_alter_table_drop_constraint_builder();
	init_primary_key_constraint_node();
	init_drop_index_node();
	init_add_index_node();
	init_alter_table_add_index_builder();
	init_unique_constraint_builder();
	init_primary_key_constraint_builder();
	init_check_constraint_builder();
	init_rename_constraint_node();
	init_expression_parser();
	init_drop_column_builder();
	AlterTableBuilder = class {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		renameTo(newTableName) {
			return new AlterTableExecutor({
				...this.#props,
				node: AlterTableNode.cloneWithTableProps(this.#props.node, { renameTo: parseTable(newTableName) })
			});
		}
		setSchema(newSchema) {
			return new AlterTableExecutor({
				...this.#props,
				node: AlterTableNode.cloneWithTableProps(this.#props.node, { setSchema: IdentifierNode.create(newSchema) })
			});
		}
		alterColumn(column, alteration) {
			const builder = alteration(new AlterColumnBuilder(column));
			return new AlterTableColumnAlteringBuilder({
				...this.#props,
				node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, builder.toOperationNode())
			});
		}
		dropColumn(column, build = noop) {
			const builder = build(new DropColumnBuilder({ node: DropColumnNode.create(column) }));
			return new AlterTableColumnAlteringBuilder({
				...this.#props,
				node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, builder.toOperationNode())
			});
		}
		renameColumn(column, newColumn) {
			return new AlterTableColumnAlteringBuilder({
				...this.#props,
				node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, RenameColumnNode.create(column, newColumn))
			});
		}
		addColumn(columnName, dataType, build = noop) {
			const builder = build(new ColumnDefinitionBuilder(ColumnDefinitionNode.create(columnName, parseDataTypeExpression(dataType))));
			return new AlterTableColumnAlteringBuilder({
				...this.#props,
				node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, AddColumnNode.create(builder.toOperationNode()))
			});
		}
		modifyColumn(columnName, dataType, build = noop) {
			const builder = build(new ColumnDefinitionBuilder(ColumnDefinitionNode.create(columnName, parseDataTypeExpression(dataType))));
			return new AlterTableColumnAlteringBuilder({
				...this.#props,
				node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, ModifyColumnNode.create(builder.toOperationNode()))
			});
		}
		/**
		* See {@link CreateTableBuilder.addUniqueConstraint}
		*/
		addUniqueConstraint(constraintName, columns, build = noop) {
			const uniqueConstraintBuilder = build(new UniqueConstraintNodeBuilder(UniqueConstraintNode.create(columns.map((column) => isString(column) ? ColumnNode.create(column) : parseExpression(column)), constraintName)));
			return new AlterTableExecutor({
				...this.#props,
				node: AlterTableNode.cloneWithTableProps(this.#props.node, { addConstraint: AddConstraintNode.create(uniqueConstraintBuilder.toOperationNode()) })
			});
		}
		/**
		* See {@link CreateTableBuilder.addCheckConstraint}
		*/
		addCheckConstraint(constraintName, checkExpression, build = noop) {
			const constraintBuilder = build(new CheckConstraintBuilder(CheckConstraintNode.create(checkExpression.toOperationNode(), constraintName)));
			return new AlterTableExecutor({
				...this.#props,
				node: AlterTableNode.cloneWithTableProps(this.#props.node, { addConstraint: AddConstraintNode.create(constraintBuilder.toOperationNode()) })
			});
		}
		/**
		* See {@link CreateTableBuilder.addForeignKeyConstraint}
		*
		* Unlike {@link CreateTableBuilder.addForeignKeyConstraint} this method returns
		* the constraint builder and doesn't take a callback as the last argument. This
		* is because you can only add one column per `ALTER TABLE` query.
		*/
		addForeignKeyConstraint(constraintName, columns, targetTable, targetColumns, build = noop) {
			const constraintBuilder = build(new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.create(columns.map(ColumnNode.create), parseTable(targetTable), targetColumns.map(ColumnNode.create), constraintName)));
			return new AlterTableAddForeignKeyConstraintBuilder({
				...this.#props,
				constraintBuilder
			});
		}
		/**
		* See {@link CreateTableBuilder.addPrimaryKeyConstraint}
		*/
		addPrimaryKeyConstraint(constraintName, columns, build = noop) {
			const constraintBuilder = build(new PrimaryKeyConstraintBuilder(PrimaryKeyConstraintNode.create(columns, constraintName)));
			return new AlterTableExecutor({
				...this.#props,
				node: AlterTableNode.cloneWithTableProps(this.#props.node, { addConstraint: AddConstraintNode.create(constraintBuilder.toOperationNode()) })
			});
		}
		dropConstraint(constraintName) {
			return new AlterTableDropConstraintBuilder({
				...this.#props,
				node: AlterTableNode.cloneWithTableProps(this.#props.node, { dropConstraint: DropConstraintNode.create(constraintName) })
			});
		}
		renameConstraint(oldName, newName) {
			return new AlterTableDropConstraintBuilder({
				...this.#props,
				node: AlterTableNode.cloneWithTableProps(this.#props.node, { renameConstraint: RenameConstraintNode.create(oldName, newName) })
			});
		}
		/**
		* This can be used to add index to table.
		*
		*  ### Examples
		*
		* ```ts
		* db.schema.alterTable('person')
		*   .addIndex('person_email_index')
		*   .column('email')
		*   .unique()
		*   .execute()
		* ```
		*
		* The generated SQL (MySQL):
		*
		* ```sql
		* alter table `person` add unique index `person_email_index` (`email`)
		* ```
		*/
		addIndex(indexName) {
			return new AlterTableAddIndexBuilder({
				...this.#props,
				node: AlterTableNode.cloneWithTableProps(this.#props.node, { addIndex: AddIndexNode.create(indexName) })
			});
		}
		/**
		* This can be used to drop index from table.
		*
		* ### Examples
		*
		* ```ts
		* db.schema.alterTable('person')
		*   .dropIndex('person_email_index')
		*   .execute()
		* ```
		*
		* The generated SQL (MySQL):
		*
		* ```sql
		* alter table `person` drop index `test_first_name_index`
		* ```
		*/
		dropIndex(indexName) {
			return new AlterTableExecutor({
				...this.#props,
				node: AlterTableNode.cloneWithTableProps(this.#props.node, { dropIndex: DropIndexNode.create(indexName) })
			});
		}
		/**
		* Calls the given function passing `this` as the only argument.
		*
		* See {@link CreateTableBuilder.$call}
		*/
		$call(func) {
			return func(this);
		}
	};
	AlterTableColumnAlteringBuilder = class AlterTableColumnAlteringBuilder {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		alterColumn(column, alteration) {
			const builder = alteration(new AlterColumnBuilder(column));
			return new AlterTableColumnAlteringBuilder({
				...this.#props,
				node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, builder.toOperationNode())
			});
		}
		dropColumn(column, build = noop) {
			const builder = build(new DropColumnBuilder({ node: DropColumnNode.create(column) }));
			return new AlterTableColumnAlteringBuilder({
				...this.#props,
				node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, builder.toOperationNode())
			});
		}
		renameColumn(column, newColumn) {
			return new AlterTableColumnAlteringBuilder({
				...this.#props,
				node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, RenameColumnNode.create(column, newColumn))
			});
		}
		addColumn(columnName, dataType, build = noop) {
			const builder = build(new ColumnDefinitionBuilder(ColumnDefinitionNode.create(columnName, parseDataTypeExpression(dataType))));
			return new AlterTableColumnAlteringBuilder({
				...this.#props,
				node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, AddColumnNode.create(builder.toOperationNode()))
			});
		}
		modifyColumn(columnName, dataType, build = noop) {
			const builder = build(new ColumnDefinitionBuilder(ColumnDefinitionNode.create(columnName, parseDataTypeExpression(dataType))));
			return new AlterTableColumnAlteringBuilder({
				...this.#props,
				node: AlterTableNode.cloneWithColumnAlteration(this.#props.node, ModifyColumnNode.create(builder.toOperationNode()))
			});
		}
		toOperationNode() {
			return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
		}
		compile() {
			return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
		}
		async execute(options) {
			await this.#props.executor.executeQuery(this.compile(), options);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/plugin/immediate-value/immediate-value-transformer.js
var ImmediateValueTransformer;
var init_immediate_value_transformer = __esmMin((() => {
	init_operation_node_transformer();
	init_value_list_node();
	init_value_node();
	ImmediateValueTransformer = class extends OperationNodeTransformer {
		transformPrimitiveValueList(node) {
			return ValueListNode.create(node.values.map(ValueNode.createImmediate));
		}
		transformValue(node) {
			return ValueNode.createImmediate(node.value);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/create-index-builder.js
var CreateIndexBuilder;
var init_create_index_builder = __esmMin((() => {
	init_create_index_node();
	init_raw_node();
	init_reference_parser();
	init_table_parser();
	init_object_utils();
	init_binary_operation_parser();
	init_query_node();
	init_immediate_value_transformer();
	CreateIndexBuilder = class CreateIndexBuilder {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		/**
		* Adds the "if not exists" modifier.
		*
		* If the index already exists, no error is thrown if this method has been called.
		*/
		ifNotExists() {
			return new CreateIndexBuilder({
				...this.#props,
				node: CreateIndexNode.cloneWith(this.#props.node, { ifNotExists: true })
			});
		}
		/**
		* Makes the index unique.
		*/
		unique() {
			return new CreateIndexBuilder({
				...this.#props,
				node: CreateIndexNode.cloneWith(this.#props.node, { unique: true })
			});
		}
		/**
		* Adds `nulls not distinct` specifier to index.
		* This only works on some dialects like PostgreSQL.
		*
		* ### Examples
		*
		* ```ts
		* db.schema.createIndex('person_first_name_index')
		*  .on('person')
		*  .column('first_name')
		*  .nullsNotDistinct()
		*  .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* create index "person_first_name_index"
		* on "test" ("first_name")
		* nulls not distinct;
		* ```
		*/
		nullsNotDistinct() {
			return new CreateIndexBuilder({
				...this.#props,
				node: CreateIndexNode.cloneWith(this.#props.node, { nullsNotDistinct: true })
			});
		}
		/**
		* Specifies the table for the index.
		*/
		on(table) {
			return new CreateIndexBuilder({
				...this.#props,
				node: CreateIndexNode.cloneWith(this.#props.node, { table: parseTable(table) })
			});
		}
		column(arg) {
			return new CreateIndexBuilder({
				...this.#props,
				node: CreateIndexNode.cloneWithColumns(this.#props.node, [isString(arg) ? parseOrderedColumnName(arg) : arg.toOperationNode()])
			});
		}
		/**
		* Adds a list of columns to the index.
		*
		* Also see {@link column} for adding a single column.
		*
		* ### Examples
		*
		* ```ts
		* import { sql } from 'kysely'
		*
		* await db.schema
		*   .createIndex('person_first_name_and_age_index')
		*   .on('person')
		*   .columns(['first_name', sql`left(lower("last_name"), 1)`, 'age desc'])
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* create index "person_first_name_and_age_index"
		* on "person" ("first_name", left(lower("last_name"), 1), "age" desc)
		* ```
		*/
		columns(columns) {
			return new CreateIndexBuilder({
				...this.#props,
				node: CreateIndexNode.cloneWithColumns(this.#props.node, columns.map((item) => isString(item) ? parseOrderedColumnName(item) : item.toOperationNode()))
			});
		}
		/**
		* Adds an arbitrary expression as a column to the index.
		*
		* ### Examples
		*
		* ```ts
		* import { sql } from 'kysely'
		*
		* await db.schema
		*   .createIndex('person_first_name_index')
		*   .on('person')
		*   .expression(sql`first_name COLLATE "fi_FI"`)
		*   .column('gender')
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* create index "person_first_name_index"
		* on "person" (first_name COLLATE "fi_FI", "gender")
		* ```
		*
		* @deprecated Use {@link column} or {@link columns} with an {@link Expression} instead.
		*/
		expression(expression) {
			return new CreateIndexBuilder({
				...this.#props,
				node: CreateIndexNode.cloneWithColumns(this.#props.node, [expression.toOperationNode()])
			});
		}
		using(indexType) {
			return new CreateIndexBuilder({
				...this.#props,
				node: CreateIndexNode.cloneWith(this.#props.node, { using: RawNode.createWithSql(indexType) })
			});
		}
		where(...args) {
			const transformer = new ImmediateValueTransformer();
			return new CreateIndexBuilder({
				...this.#props,
				node: QueryNode.cloneWithWhere(this.#props.node, transformer.transformNode(parseValueBinaryOperationOrExpression(args), this.#props.queryId))
			});
		}
		/**
		* Simply calls the provided function passing `this` as the only argument. `$call` returns
		* what the provided function returns.
		*/
		$call(func) {
			return func(this);
		}
		toOperationNode() {
			return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
		}
		compile() {
			return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
		}
		async execute(options) {
			await this.#props.executor.executeQuery(this.compile(), options);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/create-schema-builder.js
var CreateSchemaBuilder;
var init_create_schema_builder = __esmMin((() => {
	init_create_schema_node();
	init_object_utils();
	CreateSchemaBuilder = class CreateSchemaBuilder {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		ifNotExists() {
			return new CreateSchemaBuilder({
				...this.#props,
				node: CreateSchemaNode.cloneWith(this.#props.node, { ifNotExists: true })
			});
		}
		/**
		* Simply calls the provided function passing `this` as the only argument. `$call` returns
		* what the provided function returns.
		*/
		$call(func) {
			return func(this);
		}
		toOperationNode() {
			return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
		}
		compile() {
			return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
		}
		async execute(options) {
			await this.#props.executor.executeQuery(this.compile(), options);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/parser/on-commit-action-parse.js
function parseOnCommitAction(action) {
	if (ON_COMMIT_ACTIONS.includes(action)) return action;
	throw new Error(`invalid OnCommitAction ${action}`);
}
var init_on_commit_action_parse = __esmMin((() => {
	init_create_table_node();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/create-table-add-index-builder.js
var CreateTableAddIndexBuilder;
var init_create_table_add_index_builder = __esmMin((() => {
	init_add_index_node();
	init_raw_node();
	CreateTableAddIndexBuilder = class CreateTableAddIndexBuilder {
		#node;
		constructor(node) {
			this.#node = node;
		}
		using(indexType) {
			return new CreateTableAddIndexBuilder(AddIndexNode.cloneWith(this.#node, { using: RawNode.createWithSql(indexType) }));
		}
		/**
		* Simply calls the provided function passing `this` as the only argument. `$call` returns
		* what the provided function returns.
		*/
		$call(func) {
			return func(this);
		}
		toOperationNode() {
			return this.#node;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/create-table-builder.js
var CreateTableBuilder;
var init_create_table_builder = __esmMin((() => {
	init_column_definition_node();
	init_create_table_node();
	init_column_definition_builder();
	init_object_utils();
	init_foreign_key_constraint_node();
	init_column_node();
	init_foreign_key_constraint_builder();
	init_data_type_parser();
	init_primary_key_constraint_node();
	init_unique_constraint_node();
	init_check_constraint_node();
	init_table_parser();
	init_on_commit_action_parse();
	init_unique_constraint_builder();
	init_expression_parser();
	init_primary_key_constraint_builder();
	init_check_constraint_builder();
	init_add_index_node();
	init_create_table_add_index_builder();
	CreateTableBuilder = class CreateTableBuilder {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		/**
		* Adds the "temporary" modifier.
		*
		* Use this to create a temporary table.
		*/
		temporary() {
			return new CreateTableBuilder({
				...this.#props,
				node: CreateTableNode.cloneWith(this.#props.node, { temporary: true })
			});
		}
		/**
		* Adds an "on commit" statement.
		*
		* This can be used in conjunction with temporary tables on supported databases
		* like PostgreSQL.
		*/
		onCommit(onCommit) {
			return new CreateTableBuilder({
				...this.#props,
				node: CreateTableNode.cloneWith(this.#props.node, { onCommit: parseOnCommitAction(onCommit) })
			});
		}
		/**
		* Adds the "if not exists" modifier.
		*
		* If the table already exists, no error is thrown if this method has been called.
		*/
		ifNotExists() {
			return new CreateTableBuilder({
				...this.#props,
				node: CreateTableNode.cloneWith(this.#props.node, { ifNotExists: true })
			});
		}
		/**
		* Adds a column to the table.
		*
		* ### Examples
		*
		* ```ts
		* import { sql } from 'kysely'
		*
		* await db.schema
		*   .createTable('person')
		*   .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
		*   .addColumn('first_name', 'varchar(50)', (col) => col.notNull())
		*   .addColumn('last_name', 'varchar(255)')
		*   .addColumn('bank_balance', 'numeric(8, 2)')
		*   // You can specify any data type using the `sql` tag if the types
		*   // don't include it.
		*   .addColumn('data', sql`any_type_here`)
		*   .addColumn('parent_id', 'integer', (col) =>
		*     col.references('person.id').onDelete('cascade')
		*   )
		* ```
		*
		* With this method, it's once again good to remember that Kysely just builds the
		* query and doesn't provide the same API for all databases. For example, some
		* databases like older MySQL don't support the `references` statement in the
		* column definition. Instead foreign key constraints need to be defined in the
		* `create table` query. See the next example:
		*
		* ```ts
		* await db.schema
		*   .createTable('person')
		*   .addColumn('id', 'integer', (col) => col.primaryKey())
		*   .addColumn('parent_id', 'integer')
		*   .addForeignKeyConstraint(
		*     'person_parent_id_fk',
		*     ['parent_id'],
		*     'person',
		*     ['id'],
		*     (cb) => cb.onDelete('cascade')
		*   )
		*   .execute()
		* ```
		*
		* Another good example is that PostgreSQL doesn't support the `auto_increment`
		* keyword and you need to define an autoincrementing column for example using
		* `serial`:
		*
		* ```ts
		* await db.schema
		*   .createTable('person')
		*   .addColumn('id', 'serial', (col) => col.primaryKey())
		*   .execute()
		* ```
		*/
		addColumn(columnName, dataType, build = noop) {
			const columnBuilder = build(new ColumnDefinitionBuilder(ColumnDefinitionNode.create(columnName, parseDataTypeExpression(dataType))));
			return new CreateTableBuilder({
				...this.#props,
				node: CreateTableNode.cloneWithColumn(this.#props.node, columnBuilder.toOperationNode())
			});
		}
		/**
		* Adds a primary key constraint for one or more columns.
		*
		* The constraint name can be anything you want, but it must be unique
		* across the whole database.
		*
		* ### Examples
		*
		* ```ts
		* await db.schema
		*   .createTable('person')
		*   .addColumn('first_name', 'varchar(64)')
		*   .addColumn('last_name', 'varchar(64)')
		*   .addPrimaryKeyConstraint('primary_key', ['first_name', 'last_name'])
		*   .execute()
		* ```
		*/
		addPrimaryKeyConstraint(constraintName, columns, build = noop) {
			const constraintBuilder = build(new PrimaryKeyConstraintBuilder(PrimaryKeyConstraintNode.create(columns, constraintName)));
			return new CreateTableBuilder({
				...this.#props,
				node: CreateTableNode.cloneWithConstraint(this.#props.node, constraintBuilder.toOperationNode())
			});
		}
		/**
		* Adds a unique constraint for one or more columns.
		*
		* The constraint name can be anything you want, but it must be unique
		* across the whole database.
		*
		* ### Examples
		*
		* ```ts
		* await db.schema
		*   .createTable('person')
		*   .addColumn('first_name', 'varchar(64)')
		*   .addColumn('last_name', 'varchar(64)')
		*   .addUniqueConstraint(
		*     'first_name_last_name_unique',
		*     ['first_name', 'last_name']
		*   )
		*   .execute()
		* ```
		*
		* In dialects such as PostgreSQL you can specify `nulls not distinct` as follows:
		*
		* ```ts
		* await db.schema
		*   .createTable('person')
		*   .addColumn('first_name', 'varchar(64)')
		*   .addColumn('last_name', 'varchar(64)')
		*   .addUniqueConstraint(
		*     'first_name_last_name_unique',
		*     ['first_name', 'last_name'],
		*     (cb) => cb.nullsNotDistinct()
		*   )
		*   .execute()
		* ```
		*
		* In dialects such as MySQL you create unique constraints on expressions as follows:
		*
		* ```ts
		*
		* import { sql } from 'kysely'
		*
		* await db.schema
		*   .createTable('person')
		*   .addColumn('first_name', 'varchar(64)')
		*   .addColumn('last_name', 'varchar(64)')
		*   .addUniqueConstraint(
		*     'first_name_last_name_unique',
		*     [sql`(lower('first_name'))`, 'last_name']
		*   )
		*   .execute()
		* ```
		*/
		addUniqueConstraint(constraintName, columns, build = noop) {
			const uniqueConstraintBuilder = build(new UniqueConstraintNodeBuilder(UniqueConstraintNode.create(columns.map((column) => isString(column) ? ColumnNode.create(column) : parseExpression(column)), constraintName)));
			return new CreateTableBuilder({
				...this.#props,
				node: CreateTableNode.cloneWithConstraint(this.#props.node, uniqueConstraintBuilder.toOperationNode())
			});
		}
		/**
		* Adds an index that includes one or more columns.
		*
		* This is only supported by some dialects like MySQL.
		*
		* ### Examples
		*
		* ```ts
		* await db.schema
		*   .createTable('person')
		*   .addColumn('first_name', 'varchar(64)')
		*   .addColumn('last_name', 'varchar(64)')
		*   .addIndex('last_name_key', ['last_name'])
		*   .execute()
		* ```
		*
		* The generated SQL (MySQL):
		*
		* ```sql
		* create table `person` (
		*   `id` integer primary key,
		*   `first_name` varchar(64) not null,
		*   `last_name` varchar(64) not null,
		*   index `last_name_key` (`last_name`)
		* )
		* ```
		*/
		addIndex(indexName, columns, build = noop) {
			const addIndexBuilder = build(new CreateTableAddIndexBuilder(AddIndexNode.cloneWithColumns(AddIndexNode.create(indexName), columns.map((column) => isString(column) ? ColumnNode.create(column) : parseExpression(column)))));
			return new CreateTableBuilder({
				...this.#props,
				node: CreateTableNode.cloneWithIndex(this.#props.node, addIndexBuilder.toOperationNode())
			});
		}
		/**
		* Adds a check constraint.
		*
		* The constraint name can be anything you want, but it must be unique
		* across the whole database.
		*
		* ### Examples
		*
		* ```ts
		* import { sql } from 'kysely'
		*
		* await db.schema
		*   .createTable('animal')
		*   .addColumn('number_of_legs', 'integer')
		*   .addCheckConstraint('check_legs', sql`number_of_legs < 5`)
		*   .execute()
		* ```
		*/
		addCheckConstraint(constraintName, checkExpression, build = noop) {
			const constraintBuilder = build(new CheckConstraintBuilder(CheckConstraintNode.create(checkExpression.toOperationNode(), constraintName)));
			return new CreateTableBuilder({
				...this.#props,
				node: CreateTableNode.cloneWithConstraint(this.#props.node, constraintBuilder.toOperationNode())
			});
		}
		/**
		* Adds a foreign key constraint.
		*
		* The constraint name can be anything you want, but it must be unique
		* across the whole database.
		*
		* ### Examples
		*
		* ```ts
		* await db.schema
		*   .createTable('pet')
		*   .addColumn('owner_id', 'integer')
		*   .addForeignKeyConstraint(
		*     'owner_id_foreign',
		*     ['owner_id'],
		*     'person',
		*     ['id'],
		*   )
		*   .execute()
		* ```
		*
		* Add constraint for multiple columns:
		*
		* ```ts
		* await db.schema
		*   .createTable('pet')
		*   .addColumn('owner_id1', 'integer')
		*   .addColumn('owner_id2', 'integer')
		*   .addForeignKeyConstraint(
		*     'owner_id_foreign',
		*     ['owner_id1', 'owner_id2'],
		*     'person',
		*     ['id1', 'id2'],
		*     (cb) => cb.onDelete('cascade')
		*   )
		*   .execute()
		* ```
		*/
		addForeignKeyConstraint(constraintName, columns, targetTable, targetColumns, build = noop) {
			const builder = build(new ForeignKeyConstraintBuilder(ForeignKeyConstraintNode.create(columns.map(ColumnNode.create), parseTable(targetTable), targetColumns.map(ColumnNode.create), constraintName)));
			return new CreateTableBuilder({
				...this.#props,
				node: CreateTableNode.cloneWithConstraint(this.#props.node, builder.toOperationNode())
			});
		}
		/**
		* This can be used to add any additional SQL to the front of the query __after__ the `create` keyword.
		*
		* Also see {@link temporary}.
		*
		* ### Examples
		*
		* ```ts
		* import { sql } from 'kysely'
		*
		* await db.schema
		*   .createTable('person')
		*   .modifyFront(sql`global temporary`)
		*   .addColumn('id', 'integer', col => col.primaryKey())
		*   .addColumn('first_name', 'varchar(64)', col => col.notNull())
		*   .addColumn('last_name', 'varchar(64)', col => col.notNull())
		*   .execute()
		* ```
		*
		* The generated SQL (Postgres):
		*
		* ```sql
		* create global temporary table "person" (
		*   "id" integer primary key,
		*   "first_name" varchar(64) not null,
		*   "last_name" varchar(64) not null
		* )
		* ```
		*/
		modifyFront(modifier) {
			return new CreateTableBuilder({
				...this.#props,
				node: CreateTableNode.cloneWithFrontModifier(this.#props.node, modifier.toOperationNode())
			});
		}
		/**
		* This can be used to add any additional SQL to the end of the query.
		*
		* Also see {@link onCommit}.
		*
		* ### Examples
		*
		* ```ts
		* import { sql } from 'kysely'
		*
		* await db.schema
		*   .createTable('person')
		*   .addColumn('id', 'integer', col => col.primaryKey())
		*   .addColumn('first_name', 'varchar(64)', col => col.notNull())
		*   .addColumn('last_name', 'varchar(64)', col => col.notNull())
		*   .modifyEnd(sql`collate utf8_unicode_ci`)
		*   .execute()
		* ```
		*
		* The generated SQL (MySQL):
		*
		* ```sql
		* create table `person` (
		*   `id` integer primary key,
		*   `first_name` varchar(64) not null,
		*   `last_name` varchar(64) not null
		* ) collate utf8_unicode_ci
		* ```
		*/
		modifyEnd(modifier) {
			return new CreateTableBuilder({
				...this.#props,
				node: CreateTableNode.cloneWithEndModifier(this.#props.node, modifier.toOperationNode())
			});
		}
		/**
		* Allows to create table from `select` query.
		*
		* ### Examples
		*
		* ```ts
		* await db.schema
		*   .createTable('copy')
		*   .temporary()
		*   .as(db.selectFrom('person').select(['first_name', 'last_name']))
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* create temporary table "copy" as
		* select "first_name", "last_name" from "person"
		* ```
		*/
		as(expression) {
			return new CreateTableBuilder({
				...this.#props,
				node: CreateTableNode.cloneWith(this.#props.node, { selectQuery: parseExpression(expression) })
			});
		}
		/**
		* Calls the given function passing `this` as the only argument.
		*
		* ### Examples
		*
		* ```ts
		* await db.schema
		*   .createTable('test')
		*   .$call((builder) => builder.addColumn('id', 'integer'))
		*   .execute()
		* ```
		*
		* This is useful for creating reusable functions that can be called with a builder.
		*
		* ```ts
		* import { type CreateTableBuilder, sql } from 'kysely'
		*
		* const addDefaultColumns = (ctb: CreateTableBuilder<any, any>) => {
		*   return ctb
		*     .addColumn('id', 'integer', (col) => col.notNull())
		*     .addColumn('created_at', 'date', (col) =>
		*       col.notNull().defaultTo(sql`now()`)
		*     )
		*     .addColumn('updated_at', 'date', (col) =>
		*       col.notNull().defaultTo(sql`now()`)
		*     )
		* }
		*
		* await db.schema
		*   .createTable('test')
		*   .$call(addDefaultColumns)
		*   .execute()
		* ```
		*/
		$call(func) {
			return func(this);
		}
		toOperationNode() {
			return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
		}
		compile() {
			return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
		}
		async execute(options) {
			await this.#props.executor.executeQuery(this.compile(), options);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/drop-index-builder.js
var DropIndexBuilder;
var init_drop_index_builder = __esmMin((() => {
	init_drop_index_node();
	init_table_parser();
	init_object_utils();
	DropIndexBuilder = class DropIndexBuilder {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		/**
		* Specifies the table the index was created for. This is not needed
		* in all dialects.
		*/
		on(table) {
			return new DropIndexBuilder({
				...this.#props,
				node: DropIndexNode.cloneWith(this.#props.node, { table: parseTable(table) })
			});
		}
		ifExists() {
			return new DropIndexBuilder({
				...this.#props,
				node: DropIndexNode.cloneWith(this.#props.node, { ifExists: true })
			});
		}
		cascade() {
			return new DropIndexBuilder({
				...this.#props,
				node: DropIndexNode.cloneWith(this.#props.node, { cascade: true })
			});
		}
		/**
		* Simply calls the provided function passing `this` as the only argument. `$call` returns
		* what the provided function returns.
		*/
		$call(func) {
			return func(this);
		}
		toOperationNode() {
			return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
		}
		compile() {
			return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
		}
		async execute(options) {
			await this.#props.executor.executeQuery(this.compile(), options);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/drop-schema-builder.js
var DropSchemaBuilder;
var init_drop_schema_builder = __esmMin((() => {
	init_drop_schema_node();
	init_object_utils();
	DropSchemaBuilder = class DropSchemaBuilder {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		ifExists() {
			return new DropSchemaBuilder({
				...this.#props,
				node: DropSchemaNode.cloneWith(this.#props.node, { ifExists: true })
			});
		}
		cascade() {
			return new DropSchemaBuilder({
				...this.#props,
				node: DropSchemaNode.cloneWith(this.#props.node, { cascade: true })
			});
		}
		/**
		* Simply calls the provided function passing `this` as the only argument. `$call` returns
		* what the provided function returns.
		*/
		$call(func) {
			return func(this);
		}
		toOperationNode() {
			return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
		}
		compile() {
			return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
		}
		async execute(options) {
			await this.#props.executor.executeQuery(this.compile(), options);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/drop-table-builder.js
var DropTableBuilder;
var init_drop_table_builder = __esmMin((() => {
	init_drop_table_node();
	init_object_utils();
	DropTableBuilder = class DropTableBuilder {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		/**
		* Adds the "temporary" modifier.
		*
		* This is only supported by some dialects like MySQL.
		*/
		temporary() {
			return new DropTableBuilder({
				...this.#props,
				node: DropTableNode.cloneWith(this.#props.node, { temporary: true })
			});
		}
		ifExists() {
			return new DropTableBuilder({
				...this.#props,
				node: DropTableNode.cloneWith(this.#props.node, { ifExists: true })
			});
		}
		cascade() {
			return new DropTableBuilder({
				...this.#props,
				node: DropTableNode.cloneWith(this.#props.node, { cascade: true })
			});
		}
		/**
		* Simply calls the provided function passing `this` as the only argument. `$call` returns
		* what the provided function returns.
		*/
		$call(func) {
			return func(this);
		}
		toOperationNode() {
			return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
		}
		compile() {
			return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
		}
		async execute(options) {
			await this.#props.executor.executeQuery(this.compile(), options);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/create-view-node.js
var CreateViewNode;
var init_create_view_node = __esmMin((() => {
	init_object_utils();
	init_schemable_identifier_node();
	CreateViewNode = freeze({
		is(node) {
			return node.kind === "CreateViewNode";
		},
		create(name) {
			return freeze({
				kind: "CreateViewNode",
				name: SchemableIdentifierNode.create(name)
			});
		},
		cloneWith(createView, params) {
			return freeze({
				...createView,
				...params
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/plugin/immediate-value/immediate-value-plugin.js
var ImmediateValuePlugin;
var init_immediate_value_plugin = __esmMin((() => {
	init_immediate_value_transformer();
	ImmediateValuePlugin = class {
		#transformer = new ImmediateValueTransformer();
		transformQuery(args) {
			return this.#transformer.transformNode(args.node, args.queryId);
		}
		transformResult(args) {
			return Promise.resolve(args.result);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/create-view-builder.js
var CreateViewBuilder;
var init_create_view_builder = __esmMin((() => {
	init_object_utils();
	init_create_view_node();
	init_reference_parser();
	init_immediate_value_plugin();
	CreateViewBuilder = class CreateViewBuilder {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		/**
		* Adds the "temporary" modifier.
		*
		* Use this to create a temporary view.
		*/
		temporary() {
			return new CreateViewBuilder({
				...this.#props,
				node: CreateViewNode.cloneWith(this.#props.node, { temporary: true })
			});
		}
		materialized() {
			return new CreateViewBuilder({
				...this.#props,
				node: CreateViewNode.cloneWith(this.#props.node, { materialized: true })
			});
		}
		/**
		* Only implemented on some dialects like SQLite. On most dialects, use {@link orReplace}.
		*/
		ifNotExists() {
			return new CreateViewBuilder({
				...this.#props,
				node: CreateViewNode.cloneWith(this.#props.node, { ifNotExists: true })
			});
		}
		orReplace() {
			return new CreateViewBuilder({
				...this.#props,
				node: CreateViewNode.cloneWith(this.#props.node, { orReplace: true })
			});
		}
		columns(columns) {
			return new CreateViewBuilder({
				...this.#props,
				node: CreateViewNode.cloneWith(this.#props.node, { columns: columns.map(parseColumnName) })
			});
		}
		/**
		* Sets the select query or a `values` statement that creates the view.
		*
		* WARNING!
		* Some dialects don't support parameterized queries in DDL statements and therefore
		* the query or raw {@link sql } expression passed here is interpolated into a single
		* string opening an SQL injection vulnerability. DO NOT pass unchecked user input
		* into the query or raw expression passed to this method!
		*/
		as(query) {
			const queryNode = query.withPlugin(new ImmediateValuePlugin()).toOperationNode();
			return new CreateViewBuilder({
				...this.#props,
				node: CreateViewNode.cloneWith(this.#props.node, { as: queryNode })
			});
		}
		/**
		* Simply calls the provided function passing `this` as the only argument. `$call` returns
		* what the provided function returns.
		*/
		$call(func) {
			return func(this);
		}
		toOperationNode() {
			return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
		}
		compile() {
			return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
		}
		async execute(options) {
			await this.#props.executor.executeQuery(this.compile(), options);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/drop-view-node.js
var DropViewNode;
var init_drop_view_node = __esmMin((() => {
	init_object_utils();
	init_schemable_identifier_node();
	DropViewNode = freeze({
		is(node) {
			return node.kind === "DropViewNode";
		},
		create(name) {
			return freeze({
				kind: "DropViewNode",
				name: SchemableIdentifierNode.create(name)
			});
		},
		cloneWith(dropView, params) {
			return freeze({
				...dropView,
				...params
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/drop-view-builder.js
var DropViewBuilder;
var init_drop_view_builder = __esmMin((() => {
	init_object_utils();
	init_drop_view_node();
	DropViewBuilder = class DropViewBuilder {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		materialized() {
			return new DropViewBuilder({
				...this.#props,
				node: DropViewNode.cloneWith(this.#props.node, { materialized: true })
			});
		}
		ifExists() {
			return new DropViewBuilder({
				...this.#props,
				node: DropViewNode.cloneWith(this.#props.node, { ifExists: true })
			});
		}
		cascade() {
			return new DropViewBuilder({
				...this.#props,
				node: DropViewNode.cloneWith(this.#props.node, { cascade: true })
			});
		}
		/**
		* Simply calls the provided function passing `this` as the only argument. `$call` returns
		* what the provided function returns.
		*/
		$call(func) {
			return func(this);
		}
		toOperationNode() {
			return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
		}
		compile() {
			return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
		}
		async execute(options) {
			await this.#props.executor.executeQuery(this.compile(), options);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/create-type-node.js
var CreateTypeNode;
var init_create_type_node = __esmMin((() => {
	init_object_utils();
	init_value_list_node();
	init_value_node();
	CreateTypeNode = freeze({
		is(node) {
			return node.kind === "CreateTypeNode";
		},
		create(name) {
			return freeze({
				kind: "CreateTypeNode",
				name
			});
		},
		cloneWithEnum(createType, values) {
			return freeze({
				...createType,
				enum: ValueListNode.create(values.map(ValueNode.createImmediate))
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/create-type-builder.js
var CreateTypeBuilder;
var init_create_type_builder = __esmMin((() => {
	init_object_utils();
	init_create_type_node();
	CreateTypeBuilder = class CreateTypeBuilder {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		toOperationNode() {
			return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
		}
		/**
		* Creates an enum type.
		*
		* ### Examples
		*
		* ```ts
		* db.schema.createType('species').asEnum(['cat', 'dog', 'frog'])
		* ```
		*/
		asEnum(values) {
			return new CreateTypeBuilder({
				...this.#props,
				node: CreateTypeNode.cloneWithEnum(this.#props.node, values)
			});
		}
		/**
		* Simply calls the provided function passing `this` as the only argument. `$call` returns
		* what the provided function returns.
		*/
		$call(func) {
			return func(this);
		}
		compile() {
			return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
		}
		async execute(options) {
			await this.#props.executor.executeQuery(this.compile(), options);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/drop-type-node.js
var DropTypeNode;
var init_drop_type_node = __esmMin((() => {
	init_object_utils();
	DropTypeNode = freeze({
		is(node) {
			return node.kind === "DropTypeNode";
		},
		create(names) {
			if (!Array.isArray(names)) names = [names];
			return freeze({
				kind: "DropTypeNode",
				name: names[0],
				additionalNames: names.slice(1)
			});
		},
		cloneWith(dropType, params) {
			return freeze({
				...dropType,
				...params
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/drop-type-builder.js
var DropTypeBuilder;
var init_drop_type_builder = __esmMin((() => {
	init_drop_type_node();
	init_object_utils();
	DropTypeBuilder = class DropTypeBuilder {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		/**
		* Adds `if exists` to the query.
		*/
		ifExists() {
			return new DropTypeBuilder({
				...this.#props,
				node: DropTypeNode.cloneWith(this.#props.node, { ifExists: true })
			});
		}
		/**
		* Adds `cascade` to the query.
		*/
		cascade() {
			return new DropTypeBuilder({
				...this.#props,
				node: DropTypeNode.cloneWith(this.#props.node, { cascade: true })
			});
		}
		/**
		* Simply calls the provided function passing `this` as the only argument. `$call` returns
		* what the provided function returns.
		*/
		$call(func) {
			return func(this);
		}
		toOperationNode() {
			return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
		}
		compile() {
			return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
		}
		async execute(options) {
			await this.#props.executor.executeQuery(this.compile(), options);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/parser/identifier-parser.js
function parseSchemableIdentifier(id) {
	const SCHEMA_SEPARATOR = ".";
	if (id.includes(SCHEMA_SEPARATOR)) {
		const parts = id.split(SCHEMA_SEPARATOR).map(trim);
		if (parts.length === 2) return SchemableIdentifierNode.createWithSchema(parts[0], parts[1]);
		else throw new Error(`invalid schemable identifier ${id}`);
	} else return SchemableIdentifierNode.create(id);
}
function parseSchemableIdentifierArray(id) {
	if (!Array.isArray(id)) id = [id];
	return id.map(parseSchemableIdentifier);
}
function trim(str) {
	return str.trim();
}
var init_identifier_parser = __esmMin((() => {
	init_schemable_identifier_node();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/refresh-materialized-view-node.js
var RefreshMaterializedViewNode;
var init_refresh_materialized_view_node = __esmMin((() => {
	init_object_utils();
	init_schemable_identifier_node();
	RefreshMaterializedViewNode = freeze({
		is(node) {
			return node.kind === "RefreshMaterializedViewNode";
		},
		create(name) {
			return freeze({
				kind: "RefreshMaterializedViewNode",
				name: SchemableIdentifierNode.create(name)
			});
		},
		cloneWith(createView, params) {
			return freeze({
				...createView,
				...params
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/refresh-materialized-view-builder.js
var RefreshMaterializedViewBuilder;
var init_refresh_materialized_view_builder = __esmMin((() => {
	init_object_utils();
	init_refresh_materialized_view_node();
	RefreshMaterializedViewBuilder = class RefreshMaterializedViewBuilder {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		/**
		* Adds the "concurrently" modifier.
		*
		* Use this to refresh the view without locking out concurrent selects on the materialized view.
		*
		* WARNING!
		* This cannot be used with the "with no data" modifier.
		*/
		concurrently() {
			return new RefreshMaterializedViewBuilder({
				...this.#props,
				node: RefreshMaterializedViewNode.cloneWith(this.#props.node, {
					concurrently: true,
					withNoData: false
				})
			});
		}
		/**
		* Adds the "with data" modifier.
		*
		* If specified (or defaults) the backing query is executed to provide the new data, and the materialized view is left in a scannable state
		*/
		withData() {
			return new RefreshMaterializedViewBuilder({
				...this.#props,
				node: RefreshMaterializedViewNode.cloneWith(this.#props.node, { withNoData: false })
			});
		}
		/**
		* Adds the "with no data" modifier.
		*
		* If specified, no new data is generated and the materialized view is left in an unscannable state.
		*
		* WARNING!
		* This cannot be used with the "concurrently" modifier.
		*/
		withNoData() {
			return new RefreshMaterializedViewBuilder({
				...this.#props,
				node: RefreshMaterializedViewNode.cloneWith(this.#props.node, {
					withNoData: true,
					concurrently: false
				})
			});
		}
		/**
		* Simply calls the provided function passing `this` as the only argument. `$call` returns
		* what the provided function returns.
		*/
		$call(func) {
			return func(this);
		}
		toOperationNode() {
			return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
		}
		compile() {
			return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
		}
		async execute(options) {
			await this.#props.executor.executeQuery(this.compile(), options);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/alter-type-node.js
var AlterTypeNode;
var init_alter_type_node = __esmMin((() => {
	init_object_utils();
	AlterTypeNode = freeze({
		is(node) {
			return node.kind === "AlterTypeNode";
		},
		create(name) {
			return freeze({
				kind: "AlterTypeNode",
				name
			});
		},
		cloneWith(node, props) {
			return freeze({
				...node,
				...props
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/add-value-node.js
var AddValueNode;
var init_add_value_node = __esmMin((() => {
	init_object_utils();
	AddValueNode = freeze({
		is(node) {
			return node.kind === "AddValueNode";
		},
		create(value) {
			return freeze({
				kind: "AddValueNode",
				value
			});
		},
		cloneWith(node, props) {
			return freeze({
				...node,
				...props
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/query-finalizer.js
var QueryFinalizer;
var init_query_finalizer = __esmMin((() => {
	init_object_utils();
	QueryFinalizer = class {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		toOperationNode() {
			return this.#props.executor.transformQuery(this.#props.node, this.#props.queryId);
		}
		/**
		* Compiles the query.
		*/
		compile() {
			return this.#props.executor.compileQuery(this.toOperationNode(), this.#props.queryId);
		}
		/**
		* Executes the query.
		*/
		async execute(options) {
			return await this.#props.executor.executeQuery(this.compile(), options);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/alter-type-add-value-builder.js
var _a, AlterTypeAddValueBuilder;
var init_alter_type_add_value_builder = __esmMin((() => {
	init_add_value_node();
	init_value_node();
	init_alter_type_node();
	init_query_finalizer();
	AlterTypeAddValueBuilder = class extends QueryFinalizer {
		#props;
		constructor(props) {
			super(props);
			this.#props = props;
		}
		/**
		* Adds an `if not exists` clause.
		*/
		ifNotExists() {
			return new _a({
				...this.#props,
				node: AlterTypeNode.cloneWith(this.#props.node, { addValue: AddValueNode.cloneWith(this.#props.node.addValue, { ifNotExists: true }) })
			});
		}
		/**
		* Sets a `before <value>` clause.
		*/
		before(neighborValue) {
			return this.#setNeighbor(neighborValue, true);
		}
		/**
		* Sets an `after <value>` clause.
		*/
		after(neighborValue) {
			return this.#setNeighbor(neighborValue, false);
		}
		#setNeighbor(neighborValue, isBefore) {
			return new _a({
				...this.#props,
				node: AlterTypeNode.cloneWith(this.#props.node, { addValue: AddValueNode.cloneWith(this.#props.node.addValue, {
					isBefore,
					neighborValue: ValueNode.createImmediate(neighborValue)
				}) })
			});
		}
	};
	_a = AlterTypeAddValueBuilder;
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/rename-value-node.js
var RenameValueNode;
var init_rename_value_node = __esmMin((() => {
	init_object_utils();
	RenameValueNode = freeze({
		is(node) {
			return node.kind === "RenameValueNode";
		},
		create(oldValue, newValue) {
			return freeze({
				kind: "RenameValueNode",
				oldValue,
				newValue
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/alter-type-builder.js
var AlterTypeBuilder;
var init_alter_type_builder = __esmMin((() => {
	init_object_utils();
	init_alter_type_node();
	init_identifier_node();
	init_alter_type_add_value_builder();
	init_add_value_node();
	init_value_node();
	init_query_finalizer();
	init_rename_value_node();
	AlterTypeBuilder = class {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		/**
		* Adds a new value to an enum type.
		*/
		addValue(value) {
			return new AlterTypeAddValueBuilder({
				...this.#props,
				node: AlterTypeNode.cloneWith(this.#props.node, { addValue: AddValueNode.create(ValueNode.createImmediate(value)) })
			});
		}
		/**
		* Rename the type.
		*/
		renameTo(newName) {
			return new QueryFinalizer({
				...this.#props,
				node: AlterTypeNode.cloneWith(this.#props.node, { renameTo: IdentifierNode.create(newName) })
			});
		}
		/**
		* Renames a value of an enum type.
		*/
		renameValue(oldValue, newValue) {
			return new QueryFinalizer({
				...this.#props,
				node: AlterTypeNode.cloneWith(this.#props.node, { renameValue: RenameValueNode.create(ValueNode.createImmediate(oldValue), ValueNode.createImmediate(newValue)) })
			});
		}
		/**
		* Changes the type's schema.
		*/
		setSchema(schema) {
			return new QueryFinalizer({
				...this.#props,
				node: AlterTypeNode.cloneWith(this.#props.node, { setSchema: IdentifierNode.create(schema) })
			});
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/schema/schema-module.js
var SchemaModule;
var init_schema_module = __esmMin((() => {
	init_alter_table_node();
	init_create_index_node();
	init_create_schema_node();
	init_create_table_node();
	init_drop_index_node();
	init_drop_schema_node();
	init_drop_table_node();
	init_table_parser();
	init_alter_table_builder();
	init_create_index_builder();
	init_create_schema_builder();
	init_create_table_builder();
	init_drop_index_builder();
	init_drop_schema_builder();
	init_drop_table_builder();
	init_query_id();
	init_with_schema_plugin();
	init_create_view_builder();
	init_create_view_node();
	init_drop_view_builder();
	init_drop_view_node();
	init_create_type_builder();
	init_drop_type_builder();
	init_create_type_node();
	init_drop_type_node();
	init_identifier_parser();
	init_refresh_materialized_view_builder();
	init_refresh_materialized_view_node();
	init_alter_type_builder();
	init_alter_type_node();
	SchemaModule = class SchemaModule {
		#executor;
		constructor(executor) {
			this.#executor = executor;
		}
		/**
		* Create a new table.
		*
		* ### Examples
		*
		* This example creates a new table with columns `id`, `first_name`,
		* `last_name` and `gender`:
		*
		* ```ts
		* await db.schema
		*   .createTable('person')
		*   .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
		*   .addColumn('first_name', 'varchar', col => col.notNull())
		*   .addColumn('last_name', 'varchar', col => col.notNull())
		*   .addColumn('gender', 'varchar')
		*   .execute()
		* ```
		*
		* This example creates a table with a foreign key. Not all database
		* engines support column-level foreign key constraint definitions.
		* For example if you are using MySQL 5.X see the next example after
		* this one.
		*
		* ```ts
		* await db.schema
		*   .createTable('pet')
		*   .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
		*   .addColumn('owner_id', 'integer', col => col
		*     .references('person.id')
		*     .onDelete('cascade')
		*   )
		*   .execute()
		* ```
		*
		* This example adds a foreign key constraint for a columns just
		* like the previous example, but using a table-level statement.
		* On MySQL 5.X you need to define foreign key constraints like
		* this:
		*
		* ```ts
		* await db.schema
		*   .createTable('pet')
		*   .addColumn('id', 'integer', col => col.primaryKey().autoIncrement())
		*   .addColumn('owner_id', 'integer')
		*   .addForeignKeyConstraint(
		*     'pet_owner_id_foreign', ['owner_id'], 'person', ['id'],
		*     (constraint) => constraint.onDelete('cascade')
		*   )
		*   .execute()
		* ```
		*/
		createTable(table) {
			return new CreateTableBuilder({
				queryId: createQueryId(),
				executor: this.#executor,
				node: CreateTableNode.create(parseTable(table))
			});
		}
		/**
		* Drop a table.
		*
		* ### Examples
		*
		* ```ts
		* await db.schema
		*   .dropTable('person')
		*   .execute()
		* ```
		*/
		dropTable(table) {
			return new DropTableBuilder({
				queryId: createQueryId(),
				executor: this.#executor,
				node: DropTableNode.create(parseTable(table))
			});
		}
		/**
		* Create a new index.
		*
		* ### Examples
		*
		* ```ts
		* await db.schema
		*   .createIndex('person_full_name_unique_index')
		*   .on('person')
		*   .columns(['first_name', 'last_name'])
		*   .execute()
		* ```
		*/
		createIndex(indexName) {
			return new CreateIndexBuilder({
				queryId: createQueryId(),
				executor: this.#executor,
				node: CreateIndexNode.create(indexName)
			});
		}
		/**
		* Drop an index.
		*
		* ### Examples
		*
		* ```ts
		* await db.schema
		*   .dropIndex('person_full_name_unique_index')
		*   .execute()
		* ```
		*/
		dropIndex(indexName) {
			return new DropIndexBuilder({
				queryId: createQueryId(),
				executor: this.#executor,
				node: DropIndexNode.create(indexName)
			});
		}
		/**
		* Create a new schema.
		*
		* ### Examples
		*
		* ```ts
		* await db.schema
		*   .createSchema('some_schema')
		*   .execute()
		* ```
		*/
		createSchema(schema) {
			return new CreateSchemaBuilder({
				queryId: createQueryId(),
				executor: this.#executor,
				node: CreateSchemaNode.create(schema)
			});
		}
		/**
		* Drop a schema.
		*
		* ### Examples
		*
		* ```ts
		* await db.schema
		*   .dropSchema('some_schema')
		*   .execute()
		* ```
		*/
		dropSchema(schema) {
			return new DropSchemaBuilder({
				queryId: createQueryId(),
				executor: this.#executor,
				node: DropSchemaNode.create(schema)
			});
		}
		/**
		* Alter a table.
		*
		* ### Examples
		*
		* ```ts
		* await db.schema
		*   .alterTable('person')
		*   .alterColumn('first_name', (ac) => ac.setDataType('text'))
		*   .execute()
		* ```
		*/
		alterTable(table) {
			return new AlterTableBuilder({
				queryId: createQueryId(),
				executor: this.#executor,
				node: AlterTableNode.create(parseTable(table))
			});
		}
		/**
		* Create a new view.
		*
		* ### Examples
		*
		* ```ts
		* await db.schema
		*   .createView('dogs')
		*   .orReplace()
		*   .as(db.selectFrom('pet').selectAll().where('species', '=', 'dog'))
		*   .execute()
		* ```
		*/
		createView(viewName) {
			return new CreateViewBuilder({
				queryId: createQueryId(),
				executor: this.#executor,
				node: CreateViewNode.create(viewName)
			});
		}
		/**
		* Refresh a materialized view.
		*
		* ### Examples
		*
		* ```ts
		* await db.schema
		*   .refreshMaterializedView('my_view')
		*   .concurrently()
		*   .execute()
		* ```
		*/
		refreshMaterializedView(viewName) {
			return new RefreshMaterializedViewBuilder({
				queryId: createQueryId(),
				executor: this.#executor,
				node: RefreshMaterializedViewNode.create(viewName)
			});
		}
		/**
		* Drop a view.
		*
		* ### Examples
		*
		* ```ts
		* await db.schema
		*   .dropView('dogs')
		*   .ifExists()
		*   .execute()
		* ```
		*/
		dropView(viewName) {
			return new DropViewBuilder({
				queryId: createQueryId(),
				executor: this.#executor,
				node: DropViewNode.create(viewName)
			});
		}
		/**
		* Create a new type.
		*
		* Only some dialects like PostgreSQL have user-defined types.
		*
		* ### Examples
		*
		* ```ts
		* await db.schema
		*   .createType('species')
		*   .asEnum(['dog', 'cat', 'frog'])
		*   .execute()
		* ```
		*/
		createType(typeName) {
			return new CreateTypeBuilder({
				queryId: createQueryId(),
				executor: this.#executor,
				node: CreateTypeNode.create(parseSchemableIdentifier(typeName))
			});
		}
		/**
		* Alter a type. Rename it, change schema or add/rename enum type values.
		*
		* Only some dialects like PostgreSQL have user-defined types.
		*
		* ```ts
		* await db.schema
		*   .alterType('species')
		*   .addValue('capybara')
		*   .execute()
		* ```
		*/
		alterType(name) {
			return new AlterTypeBuilder({
				executor: this.#executor,
				node: AlterTypeNode.create(parseSchemableIdentifier(name)),
				queryId: createQueryId()
			});
		}
		/**
		* Drop a type.
		*
		* Only some dialects like PostgreSQL have user-defined types.
		*
		* ### Examples
		*
		* ```ts
		* await db.schema
		*   .dropType('species')
		*   .ifExists()
		*   .execute()
		* ```
		*
		* You can also provide multiple type names:
		*
		* ```ts
		* await db.schema
		*   .dropType(['species', 'colors'])
		*   .ifExists()
		*   .cascade()
		*   .execute()
		* ```
		*/
		dropType(typeName) {
			return new DropTypeBuilder({
				queryId: createQueryId(),
				executor: this.#executor,
				node: DropTypeNode.create(parseSchemableIdentifierArray(typeName))
			});
		}
		/**
		* Returns a copy of this schema module with the given plugin installed.
		*/
		withPlugin(plugin) {
			return new SchemaModule(this.#executor.withPlugin(plugin));
		}
		/**
		* Returns a copy of this schema module  without any plugins.
		*/
		withoutPlugins() {
			return new SchemaModule(this.#executor.withoutPlugins());
		}
		/**
		* See {@link QueryCreator.withSchema}
		*/
		withSchema(schema) {
			return new SchemaModule(this.#executor.withPluginAtFront(new WithSchemaPlugin(schema)));
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dynamic/dynamic.js
var DynamicModule;
var init_dynamic = __esmMin((() => {
	init_dynamic_reference_builder();
	init_dynamic_table_builder();
	DynamicModule = class {
		/**
		* Creates a dynamic reference to a column that is not know at compile time.
		*
		* Kysely is built in a way that by default you can't refer to tables or columns
		* that are not actually visible in the current query and context. This is all
		* done by TypeScript at compile time, which means that you need to know the
		* columns and tables at compile time. This is not always the case of course.
		*
		* This method is meant to be used in those cases where the column names
		* come from the user input or are not otherwise known at compile time.
		*
		* WARNING! Unlike values, column names are not escaped by the database engine
		* or Kysely and if you pass in unchecked column names using this method, you
		* create an SQL injection vulnerability. Always __always__ validate the user
		* input before passing it to this method.
		*
		* There are couple of examples below for some use cases, but you can pass
		* `ref` to other methods as well. If the types allow you to pass a `ref`
		* value to some place, it should work.
		*
		* ### Examples
		*
		* Filter by a column not know at compile time:
		*
		* ```ts
		* async function someQuery(filterColumn: string, filterValue: string) {
		*   const { ref } = db.dynamic
		*
		*   return await db
		*     .selectFrom('person')
		*     .selectAll()
		*     .where(ref(filterColumn), '=', filterValue)
		*     .execute()
		* }
		*
		* someQuery('first_name', 'Arnold')
		* someQuery('person.last_name', 'Aniston')
		* ```
		*
		* Order by a column not know at compile time:
		*
		* ```ts
		* async function someQuery(orderBy: string) {
		*   const { ref } = db.dynamic
		*
		*   return await db
		*     .selectFrom('person')
		*     .select('person.first_name as fn')
		*     .orderBy(ref(orderBy))
		*     .execute()
		* }
		*
		* someQuery('fn')
		* ```
		*
		* In this example we add selections dynamically:
		*
		* ```ts
		* const { ref } = db.dynamic
		*
		* // Some column name provided by the user. Value not known at compile time.
		* const columnFromUserInput: PossibleColumns = 'birthdate';
		*
		* // A type that lists all possible values `columnFromUserInput` can have.
		* // You can use `keyof Person` if any column of an interface is allowed.
		* type PossibleColumns = 'last_name' | 'first_name' | 'birthdate'
		*
		* const [person] = await db.selectFrom('person')
		*   .select([
		*     ref<PossibleColumns>(columnFromUserInput),
		*     'id'
		*   ])
		*   .execute()
		*
		* // The resulting type contains all `PossibleColumns` as optional fields
		* // because we cannot know which field was actually selected before
		* // running the code.
		* const lastName: string | null | undefined = person?.last_name
		* const firstName: string | undefined = person?.first_name
		* const birthDate: Date | null | undefined = person?.birthdate
		*
		* // The result type also contains the compile time selection `id`.
		* person?.id
		* ```
		*/
		ref(reference) {
			return new DynamicReferenceBuilder(reference);
		}
		/**
		* Creates a table reference to a table that's not fully known at compile time.
		*
		* The type `T` is allowed to be a union of multiple tables.
		*
		* <!-- siteExample("select", "Generic find query", 130) -->
		*
		* A generic type-safe helper function for finding a row by a column value:
		*
		* ```ts
		* import { SelectType } from 'kysely'
		* import { Database } from 'type-editor'
		*
		* async function getRowByColumn<
		*   T extends keyof Database,
		*   C extends keyof Database[T] & string,
		*   V extends SelectType<Database[T][C]>,
		* >(t: T, c: C, v: V) {
		*   // We need to use the dynamic module since the table name
		*   // is not known at compile time.
		*   const { table, ref } = db.dynamic
		*
		*   return await db
		*     .selectFrom(table(t).as('t'))
		*     .selectAll()
		*     .where(ref(c), '=', v)
		*     .orderBy('t.id')
		*     .executeTakeFirstOrThrow()
		* }
		*
		* const person = await getRowByColumn('person', 'first_name', 'Arnold')
		* ```
		*/
		table(table) {
			return new DynamicTableBuilder(table);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/driver/default-connection-provider.js
var DefaultConnectionProvider;
var init_default_connection_provider = __esmMin((() => {
	DefaultConnectionProvider = class {
		#driver;
		constructor(driver) {
			this.#driver = driver;
		}
		async provideConnection(consumer, options) {
			const connection = await this.#driver.acquireConnection(options);
			try {
				return await consumer(connection);
			} finally {
				await this.#driver.releaseConnection(connection, options);
			}
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/query-executor/default-query-executor.js
var DefaultQueryExecutor;
var init_default_query_executor = __esmMin((() => {
	init_query_executor_base();
	DefaultQueryExecutor = class DefaultQueryExecutor extends QueryExecutorBase {
		#compiler;
		#adapter;
		#connectionProvider;
		constructor(compiler, adapter, connectionProvider, plugins = []) {
			super(plugins);
			this.#compiler = compiler;
			this.#adapter = adapter;
			this.#connectionProvider = connectionProvider;
		}
		get adapter() {
			return this.#adapter;
		}
		compileQuery(node, queryId) {
			return this.#compiler.compileQuery(node, queryId);
		}
		provideConnection(consumer, options) {
			return this.#connectionProvider.provideConnection(consumer, options);
		}
		withPlugins(plugins) {
			return new DefaultQueryExecutor(this.#compiler, this.#adapter, this.#connectionProvider, [...this.plugins, ...plugins]);
		}
		withPlugin(plugin) {
			return new DefaultQueryExecutor(this.#compiler, this.#adapter, this.#connectionProvider, [...this.plugins, plugin]);
		}
		withPluginAtFront(plugin) {
			return new DefaultQueryExecutor(this.#compiler, this.#adapter, this.#connectionProvider, [plugin, ...this.plugins]);
		}
		withConnectionProvider(connectionProvider) {
			return new DefaultQueryExecutor(this.#compiler, this.#adapter, connectionProvider, [...this.plugins]);
		}
		withoutPlugins() {
			return new DefaultQueryExecutor(this.#compiler, this.#adapter, this.#connectionProvider, []);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/util/performance-now.js
function performanceNow() {
	if (typeof performance !== "undefined" && isFunction(performance.now)) return performance.now();
	else return Date.now();
}
var init_performance_now = __esmMin((() => {
	init_object_utils();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/driver/connection-mutex.js
var ConnectionMutex;
var init_connection_mutex = __esmMin((() => {
	ConnectionMutex = class {
		#promise;
		#resolve;
		async obtainLock() {
			while (this.#promise) await this.#promise;
			this.#promise = new Promise((resolve) => {
				this.#resolve = resolve;
			});
		}
		releaseLock() {
			const resolve = this.#resolve;
			this.#promise = void 0;
			this.#resolve = void 0;
			resolve?.();
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/driver/runtime-driver.js
var RuntimeDriver;
var init_runtime_driver = __esmMin((() => {
	init_abort();
	init_performance_now();
	init_connection_mutex();
	RuntimeDriver = class {
		#driver;
		#log;
		#initPromise;
		#initDone;
		#destroyPromise;
		#connections = /* @__PURE__ */ new WeakSet();
		#connectionMutex;
		constructor(driver, adapter, log) {
			this.#driver = driver;
			this.#initDone = false;
			this.#log = log;
			if (adapter.supportsMultipleConnections === false) this.#connectionMutex = new ConnectionMutex();
		}
		async init(options) {
			if (this.#destroyPromise) throw new Error("driver has already been destroyed");
			this.#initPromise ??= this.#driver.init(options).then(() => {
				this.#initDone = true;
			}).catch((reason) => {
				this.#initPromise = void 0;
				throw reason;
			});
			await waitOrAbort(this.#initPromise, options?.signal, "init");
		}
		async acquireConnection(options) {
			if (this.#destroyPromise) throw new Error("driver has already been destroyed");
			if (!this.#initDone) await this.init(options);
			if (this.#connectionMutex) {
				const lockPromise = this.#connectionMutex.obtainLock();
				await waitOrAbort(lockPromise, options?.signal, "acquireConnection:mutex", () => lockPromise.then(() => this.#connectionMutex?.releaseLock()));
			}
			const connectionPromise = this.#driver.acquireConnection(options);
			const connection = await waitOrAbort(connectionPromise, options?.signal, "acquireConnection:acquire", () => connectionPromise?.then((connection) => this.releaseConnection(connection).catch(printBackgroundFail("driver.releaseConnection"))).catch(printBackgroundFail("driver.acquireConnection")));
			if (!this.#connections.has(connection)) {
				if (this.#needsLogging()) this.#addLogging(connection);
				this.#connections.add(connection);
			}
			return connection;
		}
		async releaseConnection(connection, options) {
			await this.#driver.releaseConnection(connection, options);
			this.#connectionMutex?.releaseLock();
		}
		async beginTransaction(connection, settings) {
			return await this.#driver.beginTransaction(connection, settings);
		}
		async commitTransaction(connection) {
			return await this.#driver.commitTransaction(connection);
		}
		async rollbackTransaction(connection) {
			return await this.#driver.rollbackTransaction(connection);
		}
		async savepoint(connection, savepointName, compileQuery) {
			if (this.#driver.savepoint) return await this.#driver.savepoint(connection, savepointName, compileQuery);
			throw new Error("The `savepoint` method is not supported by this driver");
		}
		async rollbackToSavepoint(connection, savepointName, compileQuery) {
			if (this.#driver.rollbackToSavepoint) return await this.#driver.rollbackToSavepoint(connection, savepointName, compileQuery);
			throw new Error("The `rollbackToSavepoint` method is not supported by this driver");
		}
		async releaseSavepoint(connection, savepointName, compileQuery) {
			if (this.#driver.releaseSavepoint) return await this.#driver.releaseSavepoint(connection, savepointName, compileQuery);
			throw new Error("The `releaseSavepoint` method is not supported by this driver");
		}
		async destroy(options) {
			if (!this.#initPromise) return;
			await waitOrAbort(this.#initPromise, options?.signal, "destroy:initPromise");
			this.#destroyPromise ??= this.#driver.destroy(options).catch((reason) => {
				this.#destroyPromise = void 0;
				throw reason;
			});
			await waitOrAbort(this.#destroyPromise, options?.signal, "destroy");
		}
		#needsLogging() {
			return this.#log.isLevelEnabled("query") || this.#log.isLevelEnabled("error");
		}
		#addLogging(connection) {
			const executeQuery = connection.executeQuery;
			const streamQuery = connection.streamQuery;
			const dis = this;
			connection.executeQuery = async (compiledQuery, options) => {
				let caughtError;
				const startTime = performanceNow();
				try {
					return await executeQuery.call(connection, compiledQuery, options);
				} catch (error) {
					caughtError = error;
					await dis.#logError(error, compiledQuery, startTime);
					throw error;
				} finally {
					if (!caughtError) await dis.#logQuery(compiledQuery, startTime);
				}
			};
			connection.streamQuery = async function* (compiledQuery, chunkSize, options) {
				let caughtError;
				const startTime = performanceNow();
				try {
					for await (const result of streamQuery.call(connection, compiledQuery, chunkSize, options)) yield result;
				} catch (error) {
					caughtError = error;
					await dis.#logError(error, compiledQuery, startTime);
					throw error;
				} finally {
					if (!caughtError) await dis.#logQuery(compiledQuery, startTime, true);
				}
			};
		}
		async #logError(error, compiledQuery, startTime) {
			await this.#log.error(() => ({
				level: "error",
				error,
				query: compiledQuery,
				queryDurationMillis: this.#calculateDurationMillis(startTime)
			}));
		}
		async #logQuery(compiledQuery, startTime, isStream = false) {
			await this.#log.query(() => ({
				level: "query",
				isStream,
				query: compiledQuery,
				queryDurationMillis: this.#calculateDurationMillis(startTime)
			}));
		}
		#calculateDurationMillis(startTime) {
			return performanceNow() - startTime;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/driver/single-connection-provider.js
var ignoreError, SingleConnectionProvider;
var init_single_connection_provider = __esmMin((() => {
	ignoreError = () => {};
	SingleConnectionProvider = class {
		#connection;
		#runningPromise;
		constructor(connection) {
			this.#connection = connection;
		}
		async provideConnection(consumer) {
			while (this.#runningPromise) await this.#runningPromise.catch(ignoreError);
			this.#runningPromise = this.#run(consumer).finally(() => {
				this.#runningPromise = void 0;
			});
			return this.#runningPromise;
		}
		async #run(runner) {
			return await runner(this.#connection);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/driver/driver.js
function validateTransactionSettings(settings) {
	if (settings.accessMode && !TRANSACTION_ACCESS_MODES.includes(settings.accessMode)) throw new Error(`invalid transaction access mode ${settings.accessMode}`);
	if (settings.isolationLevel && !TRANSACTION_ISOLATION_LEVELS.includes(settings.isolationLevel)) throw new Error(`invalid transaction isolation level ${settings.isolationLevel}`);
}
var TRANSACTION_ACCESS_MODES, TRANSACTION_ISOLATION_LEVELS;
var init_driver = __esmMin((() => {
	TRANSACTION_ACCESS_MODES = ["read only", "read write"];
	TRANSACTION_ISOLATION_LEVELS = [
		"read uncommitted",
		"read committed",
		"repeatable read",
		"serializable",
		"snapshot"
	];
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/util/log.js
function defaultLogger(event) {
	if (event.level === "query") {
		const prefix = `kysely:query:${event.isStream ? "stream:" : ""}`;
		console.log(`${prefix} ${event.query.sql}`);
		console.log(`${prefix} duration: ${event.queryDurationMillis.toFixed(1)}ms`);
	} else if (event.level === "error") {
		if (event.error instanceof Error) console.error(`kysely:error: ${event.error.stack ?? event.error.message}`);
		else console.error(`kysely:error: ${JSON.stringify({
			error: event.error,
			query: event.query.sql,
			queryDurationMillis: event.queryDurationMillis
		})}`);
	}
}
var logLevels, Log;
var init_log = __esmMin((() => {
	init_object_utils();
	logLevels = ["query", "error"];
	freeze(logLevels);
	Log = class {
		#levels;
		#logger;
		constructor(config) {
			if (isFunction(config)) {
				this.#logger = config;
				this.#levels = freeze({
					query: true,
					error: true
				});
			} else {
				this.#logger = defaultLogger;
				this.#levels = freeze({
					query: config.includes("query"),
					error: config.includes("error")
				});
			}
		}
		isLevelEnabled(level) {
			return this.#levels[level];
		}
		async query(getEvent) {
			if (this.#levels.query) await this.#logger(getEvent());
		}
		async error(getEvent) {
			if (this.#levels.error) await this.#logger(getEvent());
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/util/compilable.js
function isCompilable(value) {
	return isObject(value) && isFunction(value.compile);
}
var init_compilable = __esmMin((() => {
	init_object_utils();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/kysely.js
function isKyselyProps(obj) {
	return isObject(obj) && isObject(obj.config) && isObject(obj.driver) && isObject(obj.executor) && isObject(obj.dialect);
}
function assertNotCommittedOrRolledBack(state) {
	if (state.isCommitted) throw new Error("Transaction is already committed");
	if (state.isRolledBack) throw new Error("Transaction is already rolled back");
}
var Kysely, Transaction, ConnectionBuilder, TransactionBuilder, ControlledTransactionBuilder, ControlledTransaction, Command, NotCommittedOrRolledBackAssertingExecutor;
var init_kysely = __esmMin((() => {
	init_schema_module();
	init_dynamic();
	init_default_connection_provider();
	init_query_creator();
	init_default_query_executor();
	init_object_utils();
	init_runtime_driver();
	init_single_connection_provider();
	init_driver();
	init_function_module();
	init_log();
	init_query_id();
	init_compilable();
	init_case_builder();
	init_case_node();
	init_expression_parser();
	init_with_schema_plugin();
	init_provide_controlled_connection();
	Symbol.asyncDispose ??= Symbol("Symbol.asyncDispose");
	Kysely = class Kysely extends QueryCreator {
		#props;
		constructor(args) {
			let superProps;
			let props;
			if (isKyselyProps(args)) {
				superProps = { executor: args.executor };
				props = { ...args };
			} else {
				const dialect = args.dialect;
				const driver = dialect.createDriver();
				const compiler = dialect.createQueryCompiler();
				const adapter = dialect.createAdapter();
				const log = new Log(args.log ?? []);
				const runtimeDriver = new RuntimeDriver(driver, adapter, log);
				const connectionProvider = new DefaultConnectionProvider(runtimeDriver);
				const executor = new DefaultQueryExecutor(compiler, adapter, connectionProvider, args.plugins ?? []);
				superProps = { executor };
				props = {
					config: args,
					executor,
					dialect,
					driver: runtimeDriver
				};
			}
			super(superProps);
			this.#props = freeze(props);
		}
		/**
		* Returns the {@link SchemaModule} module for building database schema.
		*/
		get schema() {
			return new SchemaModule(this.#props.executor);
		}
		/**
		* Returns a the {@link DynamicModule} module.
		*
		* The {@link DynamicModule} module can be used to bypass strict typing and
		* passing in dynamic values for the queries.
		*/
		get dynamic() {
			return new DynamicModule();
		}
		/**
		* Returns a {@link DatabaseIntrospector | database introspector}.
		*/
		get introspection() {
			return this.#props.dialect.createIntrospector(this.withoutPlugins());
		}
		case(value) {
			return new CaseBuilder({ node: CaseNode.create(isUndefined(value) ? void 0 : parseExpression(value)) });
		}
		/**
		* Returns a {@link FunctionModule} that can be used to write somewhat type-safe function
		* calls.
		*
		* ```ts
		* const { count } = db.fn
		*
		* await db.selectFrom('person')
		*   .innerJoin('pet', 'pet.owner_id', 'person.id')
		*   .select([
		*     'id',
		*     count('pet.id').as('person_count'),
		*   ])
		*   .groupBy('person.id')
		*   .having(count('pet.id'), '>', 10)
		*   .execute()
		* ```
		*
		* The generated SQL (PostgreSQL):
		*
		* ```sql
		* select "person"."id", count("pet"."id") as "person_count"
		* from "person"
		* inner join "pet" on "pet"."owner_id" = "person"."id"
		* group by "person"."id"
		* having count("pet"."id") > $1
		* ```
		*
		* Why "somewhat" type-safe? Because the function calls are not bound to the
		* current query context. They allow you to reference columns and tables that
		* are not in the current query. E.g. remove the `innerJoin` from the previous
		* query and TypeScript won't even complain.
		*
		* If you want to make the function calls fully type-safe, you can use the
		* {@link ExpressionBuilder.fn} getter for a query context-aware, stricter {@link FunctionModule}.
		*
		* ```ts
		* await db.selectFrom('person')
		*   .innerJoin('pet', 'pet.owner_id', 'person.id')
		*   .select((eb) => [
		*     'person.id',
		*     eb.fn.count('pet.id').as('pet_count')
		*   ])
		*   .groupBy('person.id')
		*   .having((eb) => eb.fn.count('pet.id'), '>', 10)
		*   .execute()
		* ```
		*/
		get fn() {
			return createFunctionModule();
		}
		/**
		* Creates a {@link TransactionBuilder} that can be used to run queries inside a transaction.
		*
		* The returned {@link TransactionBuilder} can be used to configure the transaction. The
		* {@link TransactionBuilder.execute} method can then be called to run the transaction.
		* {@link TransactionBuilder.execute} takes a function that is run inside the
		* transaction. If the function throws an exception,
		* 1. the exception is caught,
		* 2. the transaction is rolled back, and
		* 3. the exception is thrown again.
		* Otherwise the transaction is committed.
		*
		* The callback function passed to the {@link TransactionBuilder.execute | execute}
		* method gets the transaction object as its only argument. The transaction is
		* of type {@link Transaction} which inherits {@link Kysely}. Any query
		* started through the transaction object is executed inside the transaction.
		*
		* To run a controlled transaction, allowing you to commit and rollback manually,
		* use {@link startTransaction} instead.
		*
		* ### Examples
		*
		* <!-- siteExample("transactions", "Simple transaction", 10) -->
		*
		* This example inserts two rows in a transaction. If an exception is thrown inside
		* the callback passed to the `execute` method,
		* 1. the exception is caught,
		* 2. the transaction is rolled back, and
		* 3. the exception is thrown again.
		* Otherwise the transaction is committed.
		*
		* ```ts
		* const catto = await db.transaction().execute(async (trx) => {
		*   const jennifer = await trx.insertInto('person')
		*     .values({
		*       first_name: 'Jennifer',
		*       last_name: 'Aniston',
		*       age: 40,
		*     })
		*     .returning('id')
		*     .executeTakeFirstOrThrow()
		*
		*   return await trx.insertInto('pet')
		*     .values({
		*       owner_id: jennifer.id,
		*       name: 'Catto',
		*       species: 'cat',
		*       is_favorite: false,
		*     })
		*     .returningAll()
		*     .executeTakeFirst()
		* })
		* ```
		*
		* Setting the isolation level:
		*
		* ```ts
		* import type { Kysely } from 'kysely'
		*
		* await db
		*   .transaction()
		*   .setIsolationLevel('serializable')
		*   .execute(async (trx) => {
		*     await doStuff(trx)
		*   })
		*
		* async function doStuff(kysely: typeof db) {
		*   // ...
		* }
		* ```
		*/
		transaction() {
			return new TransactionBuilder({ ...this.#props });
		}
		/**
		* Creates a {@link ControlledTransactionBuilder} that can be used to run queries inside a controlled transaction.
		*
		* The returned {@link ControlledTransactionBuilder} can be used to configure the transaction.
		* The {@link ControlledTransactionBuilder.execute} method can then be called
		* to start the transaction and return a {@link ControlledTransaction}.
		*
		* A {@link ControlledTransaction} allows you to commit and rollback manually,
		* execute savepoint commands. It extends {@link Transaction} which extends {@link Kysely},
		* so you can run queries inside the transaction. Once the transaction is committed,
		* or rolled back, it can't be used anymore - all queries will throw an error.
		* This is to prevent accidentally running queries outside the transaction - where
		* atomicity is not guaranteed anymore.
		*
		* ### Examples
		*
		* <!-- siteExample("transactions", "Controlled transaction", 11) -->
		*
		* A controlled transaction allows you to commit and rollback manually, execute
		* savepoint commands, and queries in general.
		*
		* In this example we start a transaction, use it to insert two rows and then commit
		* the transaction. If an error is thrown, we catch it and rollback the transaction.
		*
		* ```ts
		* const trx = await db.startTransaction().execute()
		*
		* try {
		*   const jennifer = await trx.insertInto('person')
		*     .values({
		*       first_name: 'Jennifer',
		*       last_name: 'Aniston',
		*       age: 40,
		*     })
		*     .returning('id')
		*     .executeTakeFirstOrThrow()
		*
		*   const catto = await trx.insertInto('pet')
		*     .values({
		*       owner_id: jennifer.id,
		*       name: 'Catto',
		*       species: 'cat',
		*       is_favorite: false,
		*     })
		*     .returningAll()
		*     .executeTakeFirstOrThrow()
		*
		*   await trx.commit().execute()
		*
		*   // ...
		* } catch (error) {
		*   await trx.rollback().execute()
		* }
		* ```
		*
		* <!-- siteExample("transactions", "Controlled transaction /w savepoints", 12) -->
		*
		* A controlled transaction allows you to commit and rollback manually, execute
		* savepoint commands, and queries in general.
		*
		* In this example we start a transaction, insert a person, create a savepoint,
		* try inserting a toy and a pet, and if an error is thrown, we rollback to the
		* savepoint. Eventually we release the savepoint, insert an audit record and
		* commit the transaction. If an error is thrown, we catch it and rollback the
		* transaction.
		*
		* ```ts
		* const trx = await db.startTransaction().execute()
		*
		* try {
		*   const jennifer = await trx
		*     .insertInto('person')
		*     .values({
		*       first_name: 'Jennifer',
		*       last_name: 'Aniston',
		*       age: 40,
		*     })
		*     .returning('id')
		*     .executeTakeFirstOrThrow()
		*
		*   const trxAfterJennifer = await trx.savepoint('after_jennifer').execute()
		*
		*   try {
		*     const catto = await trxAfterJennifer
		*       .insertInto('pet')
		*       .values({
		*         owner_id: jennifer.id,
		*         name: 'Catto',
		*         species: 'cat',
		*       })
		*       .returning('id')
		*       .executeTakeFirstOrThrow()
		*
		*     await trxAfterJennifer
		*       .insertInto('toy')
		*       .values({ name: 'Bone', price: 1.99, pet_id: catto.id })
		*       .execute()
		*   } catch (error) {
		*     await trxAfterJennifer.rollbackToSavepoint('after_jennifer').execute()
		*   }
		*
		*   await trxAfterJennifer.releaseSavepoint('after_jennifer').execute()
		*
		*   await trx.insertInto('audit').values({ action: 'added Jennifer' }).execute()
		*
		*   await trx.commit().execute()
		* } catch (error) {
		*   await trx.rollback().execute()
		* }
		* ```
		*/
		startTransaction() {
			return new ControlledTransactionBuilder({ ...this.#props });
		}
		/**
		* Provides a kysely instance bound to a single database connection.
		*
		* ### Examples
		*
		* ```ts
		* await db
		*   .connection()
		*   .execute(async (db) => {
		*     // `db` is an instance of `Kysely` that's bound to a single
		*     // database connection. All queries executed through `db` use
		*     // the same connection.
		*     await doStuff(db)
		*   })
		*
		* async function doStuff(kysely: typeof db) {
		*   // ...
		* }
		* ```
		*/
		connection() {
			return new ConnectionBuilder({ ...this.#props });
		}
		/**
		* Returns a copy of this Kysely instance with the given plugin installed.
		*/
		withPlugin(plugin) {
			return new Kysely({
				...this.#props,
				executor: this.#props.executor.withPlugin(plugin)
			});
		}
		/**
		* Returns a copy of this Kysely instance without any plugins.
		*/
		withoutPlugins() {
			return new Kysely({
				...this.#props,
				executor: this.#props.executor.withoutPlugins()
			});
		}
		/**
		* @override
		*/
		withSchema(schema) {
			return new Kysely({
				...this.#props,
				executor: this.#props.executor.withPluginAtFront(new WithSchemaPlugin(schema))
			});
		}
		/**
		* Returns a copy of this Kysely instance with tables added to its
		* database type.
		*
		* This method only modifies the types and doesn't affect any of the
		* executed queries in any way.
		*
		* ### Examples
		*
		* The following example adds and uses a temporary table:
		*
		* ```ts
		* await db.schema
		*   .createTable('temp_table')
		*   .temporary()
		*   .addColumn('some_column', 'integer')
		*   .execute()
		*
		* const tempDb = db.$extendTables<{
		*   temp_table: {
		*     some_column: number
		*   }
		* }>()
		*
		* await tempDb
		*   .insertInto('temp_table')
		*   .values({ some_column: 100 })
		*   .execute()
		* ```
		*/
		$extendTables() {
			return new Kysely({ ...this.#props });
		}
		/**
		* Returns a copy of this Kysely instance without the given tables (provided as
		* a union type of table names).
		*
		* This method only modifies the types and doesn't affect any of the executed
		* queries in any way.
		*
		* See also {@link $pickTables} and {@link $extendTables}.
		*
		* ### Examples
		*
		* The following example omits tables not used in the downstream query. This
		* can help with compile-time performance as downstream checks and calculations
		* work against a smaller scope of the database - less tables and columns.
		*
		* Don't optimize prematurely! Build your queries first, measure later. If you
		* realize the query has a noticeable impact on compilation - try the helper.
		*
		* ```ts
		* const results = await db
		*   .$omitTables<'toy'>()
		*   .selectFrom('person')
		*   .innerJoin('pet', 'pet.owner_id', 'person.id')
		*   .selectAll()
		*   .execute()
		* ```
		*
		* The query is arguably less readable now, and changing it is less obvious -
		* e.g. adding another table.
		*/
		$omitTables() {
			return new Kysely({ ...this.#props });
		}
		/**
		* Returns a copy of this Kysely instance with just the given tables (provided as
		* a union type of table names).
		*
		* This method only modifies the types and doesn't affect any of the executed
		* queries in any way.
		*
		* See also {@link $omitTables} and {@link $extendTables}.
		*
		* ### Examples
		*
		* The following example picks the tables used in the downstream query. This
		* can help with compile-time performance as downstream checks and calculations
		* work against a smaller scope of the database - less tables and columns.
		*
		* Don't optimize prematurely! Build your queries first, measure later. If you
		* realize the query has a noticeable impact on compilation - try the helper.
		*
		* ```ts
		* const results = await db
		*   .$pickTables<'person' | 'pet'>()
		*   .selectFrom('person')
		*   .innerJoin('pet', 'pet.owner_id', 'person.id')
		*   .selectAll()
		*   .execute()
		* ```
		*
		* The query is arguably less readable now, and changing it is less obvious -
		* e.g. adding another table.
		*/
		$pickTables() {
			return new Kysely({ ...this.#props });
		}
		/**
		* @deprecated use {@link $extendTables} instead.
		*/
		withTables() {
			return this.$extendTables();
		}
		/**
		* Releases all resources and disconnects from the database.
		*
		* You need to call this when you are done using the `Kysely` instance.
		*/
		async destroy() {
			await this.#props.driver.destroy();
		}
		/**
		* Returns true if this `Kysely` instance is a transaction.
		*
		* You can also use `db instanceof Transaction`.
		*/
		get isTransaction() {
			return false;
		}
		/**
		* @internal
		* @private
		*/
		getExecutor() {
			return this.#props.executor;
		}
		/**
		* Executes a given compiled query or query builder.
		*
		* See {@link https://github.com/kysely-org/kysely/blob/master/site/docs/recipes/0004-splitting-query-building-and-execution.md#execute-compiled-queries splitting build, compile and execute code recipe} for more information.
		*/
		async executeQuery(query, options) {
			const compiledQuery = isCompilable(query) ? query.compile() : query;
			return await this.#props.executor.executeQuery(compiledQuery, options);
		}
		async [Symbol.asyncDispose]() {
			await this.destroy();
		}
	};
	Transaction = class Transaction extends Kysely {
		#props;
		constructor(props) {
			super(props);
			this.#props = props;
		}
		get isTransaction() {
			return true;
		}
		/**
		* @deprecated calling the transaction method for a Transaction is not supported
		*/
		transaction() {
			throw new Error("calling the transaction method for a Transaction is not supported");
		}
		/**
		* @deprecated calling the controlled transaction method for a Transaction is not supported
		*/
		startTransaction() {
			throw new Error("calling the controlled transaction method for a Transaction is not supported");
		}
		/**
		* @deprecated calling the connection method for a Transaction is not supported
		*/
		connection() {
			throw new Error("calling the connection method for a Transaction is not supported");
		}
		/**
		* @deprecated calling the destroy method for a Transaction is not supported
		*/
		destroy() {
			throw new Error("calling the destroy method for a Transaction is not supported");
		}
		/**
		* Similar to {@link Kysely.withPlugin} but returns the transaction.
		*/
		withPlugin(plugin) {
			return new Transaction({
				...this.#props,
				executor: this.#props.executor.withPlugin(plugin)
			});
		}
		/**
		* Similar to {@link Kysely.withoutPlugins} but returns the transaction.
		*/
		withoutPlugins() {
			return new Transaction({
				...this.#props,
				executor: this.#props.executor.withoutPlugins()
			});
		}
		/**
		* Similar to {@link Kysely.withSchema} but returns the transaction.
		*/
		withSchema(schema) {
			return new Transaction({
				...this.#props,
				executor: this.#props.executor.withPluginAtFront(new WithSchemaPlugin(schema))
			});
		}
		/**
		* Similar to {@link Kysely.withTables} but returns the transaction.
		*
		* @deprecated use {@link $extendTables} instead.
		*/
		withTables() {
			return new Transaction({ ...this.#props });
		}
		/**
		* Similar to {@link Kysely.$extendTables} but returns the transaction.
		*/
		$extendTables() {
			return new Transaction({ ...this.#props });
		}
		/**
		* Similar to {@link Kysely.$omitTables} but returns the transaction.
		*/
		$omitTables() {
			return new Transaction({ ...this.#props });
		}
		/**
		* Similar to {@link Kysely.$pickTables} but returns the transaction.
		*/
		$pickTables() {
			return new Transaction({ ...this.#props });
		}
	};
	ConnectionBuilder = class {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		async execute(callback, options) {
			return this.#props.executor.provideConnection(async (connection) => {
				const executor = this.#props.executor.withConnectionProvider(new SingleConnectionProvider(connection));
				return await callback(new Kysely({
					...this.#props,
					executor
				}));
			}, freeze({ signal: options?.signal }));
		}
	};
	TransactionBuilder = class TransactionBuilder {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		setAccessMode(accessMode) {
			return new TransactionBuilder({
				...this.#props,
				accessMode
			});
		}
		setIsolationLevel(isolationLevel) {
			return new TransactionBuilder({
				...this.#props,
				isolationLevel
			});
		}
		async execute(callback) {
			const { isolationLevel, accessMode, ...kyselyProps } = this.#props;
			const settings = {
				isolationLevel,
				accessMode
			};
			validateTransactionSettings(settings);
			return this.#props.executor.provideConnection(async (connection) => {
				const state = {
					isCommitted: false,
					isRolledBack: false
				};
				const executor = new NotCommittedOrRolledBackAssertingExecutor(this.#props.executor.withConnectionProvider(new SingleConnectionProvider(connection)), state);
				const transaction = new Transaction({
					...kyselyProps,
					executor
				});
				let transactionBegun = false;
				try {
					await this.#props.driver.beginTransaction(connection, settings);
					transactionBegun = true;
					const result = await callback(transaction);
					await this.#props.driver.commitTransaction(connection);
					state.isCommitted = true;
					return result;
				} catch (error) {
					if (transactionBegun) {
						await this.#props.driver.rollbackTransaction(connection);
						state.isRolledBack = true;
					}
					throw error;
				}
			});
		}
	};
	ControlledTransactionBuilder = class ControlledTransactionBuilder {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		setAccessMode(accessMode) {
			return new ControlledTransactionBuilder({
				...this.#props,
				accessMode
			});
		}
		setIsolationLevel(isolationLevel) {
			return new ControlledTransactionBuilder({
				...this.#props,
				isolationLevel
			});
		}
		async execute() {
			const { isolationLevel, accessMode, ...props } = this.#props;
			const settings = {
				isolationLevel,
				accessMode
			};
			validateTransactionSettings(settings);
			const connection = await provideControlledConnection(this.#props.executor);
			await this.#props.driver.beginTransaction(connection.connection, settings);
			return new ControlledTransaction({
				...props,
				connection,
				executor: this.#props.executor.withConnectionProvider(new SingleConnectionProvider(connection.connection))
			});
		}
	};
	ControlledTransaction = class ControlledTransaction extends Transaction {
		#props;
		#compileQuery;
		#state;
		constructor(props) {
			const state = {
				isCommitted: false,
				isRolledBack: false
			};
			props = {
				...props,
				executor: new NotCommittedOrRolledBackAssertingExecutor(props.executor, state)
			};
			const { connection, ...transactionProps } = props;
			super(transactionProps);
			this.#props = freeze(props);
			this.#state = state;
			const queryId = createQueryId();
			this.#compileQuery = (node) => props.executor.compileQuery(node, queryId);
		}
		get isCommitted() {
			return this.#state.isCommitted;
		}
		get isRolledBack() {
			return this.#state.isRolledBack;
		}
		/**
		* Commits the transaction.
		*
		* See {@link rollback}.
		*
		* ### Examples
		*
		* ```ts
		* import type { Kysely } from 'kysely'
		* import type { Database } from 'type-editor' // imaginary module
		*
		* const trx = await db.startTransaction().execute()
		*
		* try {
		*   await doSomething(trx)
		*
		*   await trx.commit().execute()
		* } catch (error) {
		*   await trx.rollback().execute()
		* }
		*
		* async function doSomething(kysely: Kysely<Database>) {}
		* ```
		*/
		commit() {
			assertNotCommittedOrRolledBack(this.#state);
			return new Command(async () => {
				await this.#props.driver.commitTransaction(this.#props.connection.connection);
				this.#state.isCommitted = true;
				this.#props.connection.release();
			});
		}
		/**
		* Rolls back the transaction.
		*
		* See {@link commit} and {@link rollbackToSavepoint}.
		*
		* ### Examples
		*
		* ```ts
		* import type { Kysely } from 'kysely'
		* import type { Database } from 'type-editor' // imaginary module
		*
		* const trx = await db.startTransaction().execute()
		*
		* try {
		*   await doSomething(trx)
		*
		*   await trx.commit().execute()
		* } catch (error) {
		*   await trx.rollback().execute()
		* }
		*
		* async function doSomething(kysely: Kysely<Database>) {}
		* ```
		*/
		rollback() {
			assertNotCommittedOrRolledBack(this.#state);
			return new Command(async () => {
				await this.#props.driver.rollbackTransaction(this.#props.connection.connection);
				this.#state.isRolledBack = true;
				this.#props.connection.release();
			});
		}
		/**
		* Creates a savepoint with a given name.
		*
		* See {@link rollbackToSavepoint} and {@link releaseSavepoint}.
		*
		* For a type-safe experience, you should use the returned instance from now on.
		*
		* ### Examples
		*
		* ```ts
		* import type { Kysely } from 'kysely'
		* import type { Database } from 'type-editor' // imaginary module
		*
		* const trx = await db.startTransaction().execute()
		*
		* await insertJennifer(trx)
		*
		* const trxAfterJennifer = await trx.savepoint('after_jennifer').execute()
		*
		* try {
		*   await doSomething(trxAfterJennifer)
		* } catch (error) {
		*   await trxAfterJennifer.rollbackToSavepoint('after_jennifer').execute()
		* }
		*
		* async function insertJennifer(kysely: Kysely<Database>) {}
		* async function doSomething(kysely: Kysely<Database>) {}
		* ```
		*/
		savepoint(savepointName) {
			assertNotCommittedOrRolledBack(this.#state);
			return new Command(async () => {
				await this.#props.driver.savepoint?.(this.#props.connection.connection, savepointName, this.#compileQuery);
				return new ControlledTransaction({ ...this.#props });
			});
		}
		/**
		* Rolls back to a savepoint with a given name.
		*
		* See {@link savepoint} and {@link releaseSavepoint}.
		*
		* You must use the same instance returned by {@link savepoint}, or
		* escape the type-check by using `as any`.
		*
		* ### Examples
		*
		* ```ts
		* import type { Kysely } from 'kysely'
		* import type { Database } from 'type-editor' // imaginary module
		*
		* const trx = await db.startTransaction().execute()
		*
		* await insertJennifer(trx)
		*
		* const trxAfterJennifer = await trx.savepoint('after_jennifer').execute()
		*
		* try {
		*   await doSomething(trxAfterJennifer)
		* } catch (error) {
		*   await trxAfterJennifer.rollbackToSavepoint('after_jennifer').execute()
		* }
		*
		* async function insertJennifer(kysely: Kysely<Database>) {}
		* async function doSomething(kysely: Kysely<Database>) {}
		* ```
		*/
		rollbackToSavepoint(savepointName) {
			assertNotCommittedOrRolledBack(this.#state);
			return new Command(async () => {
				await this.#props.driver.rollbackToSavepoint?.(this.#props.connection.connection, savepointName, this.#compileQuery);
				return new ControlledTransaction({ ...this.#props });
			});
		}
		/**
		* Releases a savepoint with a given name.
		*
		* See {@link savepoint} and {@link rollbackToSavepoint}.
		*
		* You must use the same instance returned by {@link savepoint}, or
		* escape the type-check by using `as any`.
		*
		* ### Examples
		*
		* ```ts
		* import type { Kysely } from 'kysely'
		* import type { Database } from 'type-editor' // imaginary module
		*
		* const trx = await db.startTransaction().execute()
		*
		* await insertJennifer(trx)
		*
		* const trxAfterJennifer = await trx.savepoint('after_jennifer').execute()
		*
		* try {
		*   await doSomething(trxAfterJennifer)
		* } catch (error) {
		*   await trxAfterJennifer.rollbackToSavepoint('after_jennifer').execute()
		* }
		*
		* await trxAfterJennifer.releaseSavepoint('after_jennifer').execute()
		*
		* await doSomethingElse(trx)
		*
		* async function insertJennifer(kysely: Kysely<Database>) {}
		* async function doSomething(kysely: Kysely<Database>) {}
		* async function doSomethingElse(kysely: Kysely<Database>) {}
		* ```
		*/
		releaseSavepoint(savepointName) {
			assertNotCommittedOrRolledBack(this.#state);
			return new Command(async () => {
				await this.#props.driver.releaseSavepoint?.(this.#props.connection.connection, savepointName, this.#compileQuery);
				return new ControlledTransaction({ ...this.#props });
			});
		}
		withPlugin(plugin) {
			return new ControlledTransaction({
				...this.#props,
				executor: this.#props.executor.withPlugin(plugin)
			});
		}
		withoutPlugins() {
			return new ControlledTransaction({
				...this.#props,
				executor: this.#props.executor.withoutPlugins()
			});
		}
		withSchema(schema) {
			return new ControlledTransaction({
				...this.#props,
				executor: this.#props.executor.withPluginAtFront(new WithSchemaPlugin(schema))
			});
		}
		withTables() {
			return new ControlledTransaction({ ...this.#props });
		}
		$extendTables() {
			return new ControlledTransaction({ ...this.#props });
		}
		$omitTables() {
			return new ControlledTransaction({ ...this.#props });
		}
		$pickTables() {
			return new ControlledTransaction({ ...this.#props });
		}
	};
	Command = class {
		#cb;
		constructor(cb) {
			this.#cb = cb;
		}
		/**
		* Executes the command.
		*/
		async execute() {
			return await this.#cb();
		}
	};
	NotCommittedOrRolledBackAssertingExecutor = class NotCommittedOrRolledBackAssertingExecutor {
		#executor;
		#state;
		constructor(executor, state) {
			this.#executor = executor instanceof NotCommittedOrRolledBackAssertingExecutor ? executor.#executor : executor;
			this.#state = state;
		}
		get adapter() {
			return this.#executor.adapter;
		}
		get plugins() {
			return this.#executor.plugins;
		}
		transformQuery(node, queryId) {
			return this.#executor.transformQuery(node, queryId);
		}
		compileQuery(node, queryId) {
			return this.#executor.compileQuery(node, queryId);
		}
		provideConnection(consumer, options) {
			return this.#executor.provideConnection(consumer, options);
		}
		executeQuery(compiledQuery, options) {
			assertNotCommittedOrRolledBack(this.#state);
			return this.#executor.executeQuery(compiledQuery, options);
		}
		stream(compiledQuery, chunkSize, options) {
			assertNotCommittedOrRolledBack(this.#state);
			return this.#executor.stream(compiledQuery, chunkSize, options);
		}
		withConnectionProvider(connectionProvider) {
			return new NotCommittedOrRolledBackAssertingExecutor(this.#executor.withConnectionProvider(connectionProvider), this.#state);
		}
		withPlugin(plugin) {
			return new NotCommittedOrRolledBackAssertingExecutor(this.#executor.withPlugin(plugin), this.#state);
		}
		withPlugins(plugins) {
			return new NotCommittedOrRolledBackAssertingExecutor(this.#executor.withPlugins(plugins), this.#state);
		}
		withPluginAtFront(plugin) {
			return new NotCommittedOrRolledBackAssertingExecutor(this.#executor.withPluginAtFront(plugin), this.#state);
		}
		withoutPlugins() {
			return new NotCommittedOrRolledBackAssertingExecutor(this.#executor.withoutPlugins(), this.#state);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/raw-builder/raw-builder.js
function createRawBuilder(props) {
	return new RawBuilderImpl(props);
}
var RawBuilderImpl, AliasedRawBuilderImpl;
var init_raw_builder = __esmMin((() => {
	init_alias_node();
	init_object_utils();
	init_noop_query_executor();
	init_identifier_node();
	init_operation_node_source();
	RawBuilderImpl = class RawBuilderImpl {
		#props;
		constructor(props) {
			this.#props = freeze(props);
		}
		get expressionType() {}
		get isRawBuilder() {
			return true;
		}
		as(alias) {
			return new AliasedRawBuilderImpl(this, alias);
		}
		$castTo() {
			return new RawBuilderImpl({ ...this.#props });
		}
		$notNull() {
			return new RawBuilderImpl(this.#props);
		}
		withPlugin(plugin) {
			return new RawBuilderImpl({
				...this.#props,
				plugins: this.#props.plugins !== void 0 ? freeze([...this.#props.plugins, plugin]) : freeze([plugin])
			});
		}
		toOperationNode() {
			return this.#toOperationNode(this.#getExecutor());
		}
		compile(executorProvider) {
			return this.#compile(this.#getExecutor(executorProvider));
		}
		async execute(executorProvider, options) {
			const executor = this.#getExecutor(executorProvider);
			return executor.executeQuery(this.#compile(executor), options);
		}
		#getExecutor(executorProvider) {
			const executor = executorProvider !== void 0 ? executorProvider.getExecutor() : NOOP_QUERY_EXECUTOR;
			return this.#props.plugins !== void 0 ? executor.withPlugins(this.#props.plugins) : executor;
		}
		#toOperationNode(executor) {
			return executor.transformQuery(this.#props.rawNode, this.#props.queryId);
		}
		#compile(executor) {
			return executor.compileQuery(this.#toOperationNode(executor), this.#props.queryId);
		}
	};
	AliasedRawBuilderImpl = class {
		#rawBuilder;
		#alias;
		constructor(rawBuilder, alias) {
			this.#rawBuilder = rawBuilder;
			this.#alias = alias;
		}
		get expression() {
			return this.#rawBuilder;
		}
		get alias() {
			return this.#alias;
		}
		get rawBuilder() {
			return this.#rawBuilder;
		}
		toOperationNode() {
			return AliasNode.create(this.#rawBuilder.toOperationNode(), isOperationNodeSource(this.#alias) ? this.#alias.toOperationNode() : IdentifierNode.create(this.#alias));
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/raw-builder/sql.js
function parseParameter(param) {
	if (isOperationNodeSource(param)) return param.toOperationNode();
	return parseValueExpression(param);
}
var sql;
var init_sql = __esmMin((() => {
	init_identifier_node();
	init_operation_node_source();
	init_raw_node();
	init_value_node();
	init_reference_parser();
	init_table_parser();
	init_value_parser();
	init_query_id();
	init_raw_builder();
	sql = Object.assign((sqlFragments, ...parameters) => {
		return createRawBuilder({
			queryId: createQueryId(),
			rawNode: RawNode.create(sqlFragments, parameters?.map(parseParameter) ?? [])
		});
	}, {
		ref(columnReference) {
			return createRawBuilder({
				queryId: createQueryId(),
				rawNode: RawNode.createWithChild(parseStringReference(columnReference))
			});
		},
		val(value) {
			return createRawBuilder({
				queryId: createQueryId(),
				rawNode: RawNode.createWithChild(parseValueExpression(value))
			});
		},
		table(tableReference) {
			return createRawBuilder({
				queryId: createQueryId(),
				rawNode: RawNode.createWithChild(parseTable(tableReference))
			});
		},
		id(...ids) {
			const fragments = new Array(ids.length + 1).fill(".");
			fragments[0] = "";
			fragments[fragments.length - 1] = "";
			return createRawBuilder({
				queryId: createQueryId(),
				rawNode: RawNode.create(fragments, ids.map(IdentifierNode.create))
			});
		},
		lit(value) {
			return createRawBuilder({
				queryId: createQueryId(),
				rawNode: RawNode.createWithChild(ValueNode.createImmediate(value))
			});
		},
		raw(sql) {
			return createRawBuilder({
				queryId: createQueryId(),
				rawNode: RawNode.createWithSql(sql)
			});
		},
		join(array, separator = sql`, `) {
			const nodes = new Array(Math.max(2 * array.length - 1, 0));
			const sep = separator.toOperationNode();
			for (let i = 0; i < array.length; ++i) {
				nodes[2 * i] = parseParameter(array[i]);
				if (i !== array.length - 1) nodes[2 * i + 1] = sep;
			}
			return createRawBuilder({
				queryId: createQueryId(),
				rawNode: RawNode.createWithChildren(nodes)
			});
		}
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/operation-node-visitor.js
var OperationNodeVisitor;
var init_operation_node_visitor = __esmMin((() => {
	init_object_utils();
	OperationNodeVisitor = class {
		nodeStack = [];
		get parentNode() {
			return this.nodeStack[this.nodeStack.length - 2];
		}
		#visitors = freeze({
			AliasNode: this.visitAlias.bind(this),
			ColumnNode: this.visitColumn.bind(this),
			IdentifierNode: this.visitIdentifier.bind(this),
			SchemableIdentifierNode: this.visitSchemableIdentifier.bind(this),
			RawNode: this.visitRaw.bind(this),
			ReferenceNode: this.visitReference.bind(this),
			SelectQueryNode: this.visitSelectQuery.bind(this),
			SelectionNode: this.visitSelection.bind(this),
			TableNode: this.visitTable.bind(this),
			FromNode: this.visitFrom.bind(this),
			SelectAllNode: this.visitSelectAll.bind(this),
			AndNode: this.visitAnd.bind(this),
			OrNode: this.visitOr.bind(this),
			ValueNode: this.visitValue.bind(this),
			ValueListNode: this.visitValueList.bind(this),
			PrimitiveValueListNode: this.visitPrimitiveValueList.bind(this),
			ParensNode: this.visitParens.bind(this),
			JoinNode: this.visitJoin.bind(this),
			OperatorNode: this.visitOperator.bind(this),
			WhereNode: this.visitWhere.bind(this),
			InsertQueryNode: this.visitInsertQuery.bind(this),
			DeleteQueryNode: this.visitDeleteQuery.bind(this),
			ReturningNode: this.visitReturning.bind(this),
			CreateTableNode: this.visitCreateTable.bind(this),
			AddColumnNode: this.visitAddColumn.bind(this),
			ColumnDefinitionNode: this.visitColumnDefinition.bind(this),
			DropTableNode: this.visitDropTable.bind(this),
			DataTypeNode: this.visitDataType.bind(this),
			OrderByNode: this.visitOrderBy.bind(this),
			OrderByItemNode: this.visitOrderByItem.bind(this),
			GroupByNode: this.visitGroupBy.bind(this),
			GroupByItemNode: this.visitGroupByItem.bind(this),
			UpdateQueryNode: this.visitUpdateQuery.bind(this),
			ColumnUpdateNode: this.visitColumnUpdate.bind(this),
			LimitNode: this.visitLimit.bind(this),
			OffsetNode: this.visitOffset.bind(this),
			OnConflictNode: this.visitOnConflict.bind(this),
			OnDuplicateKeyNode: this.visitOnDuplicateKey.bind(this),
			CreateIndexNode: this.visitCreateIndex.bind(this),
			DropIndexNode: this.visitDropIndex.bind(this),
			ListNode: this.visitList.bind(this),
			PrimaryKeyConstraintNode: this.visitPrimaryKeyConstraint.bind(this),
			UniqueConstraintNode: this.visitUniqueConstraint.bind(this),
			ReferencesNode: this.visitReferences.bind(this),
			CheckConstraintNode: this.visitCheckConstraint.bind(this),
			WithNode: this.visitWith.bind(this),
			CommonTableExpressionNode: this.visitCommonTableExpression.bind(this),
			CommonTableExpressionNameNode: this.visitCommonTableExpressionName.bind(this),
			HavingNode: this.visitHaving.bind(this),
			CreateSchemaNode: this.visitCreateSchema.bind(this),
			DropSchemaNode: this.visitDropSchema.bind(this),
			AlterTableNode: this.visitAlterTable.bind(this),
			DropColumnNode: this.visitDropColumn.bind(this),
			RenameColumnNode: this.visitRenameColumn.bind(this),
			AlterColumnNode: this.visitAlterColumn.bind(this),
			ModifyColumnNode: this.visitModifyColumn.bind(this),
			AddConstraintNode: this.visitAddConstraint.bind(this),
			DropConstraintNode: this.visitDropConstraint.bind(this),
			RenameConstraintNode: this.visitRenameConstraint.bind(this),
			ForeignKeyConstraintNode: this.visitForeignKeyConstraint.bind(this),
			CreateViewNode: this.visitCreateView.bind(this),
			RefreshMaterializedViewNode: this.visitRefreshMaterializedView.bind(this),
			DropViewNode: this.visitDropView.bind(this),
			GeneratedNode: this.visitGenerated.bind(this),
			DefaultValueNode: this.visitDefaultValue.bind(this),
			OnNode: this.visitOn.bind(this),
			ValuesNode: this.visitValues.bind(this),
			SelectModifierNode: this.visitSelectModifier.bind(this),
			CreateTypeNode: this.visitCreateType.bind(this),
			DropTypeNode: this.visitDropType.bind(this),
			ExplainNode: this.visitExplain.bind(this),
			DefaultInsertValueNode: this.visitDefaultInsertValue.bind(this),
			AggregateFunctionNode: this.visitAggregateFunction.bind(this),
			OverNode: this.visitOver.bind(this),
			PartitionByNode: this.visitPartitionBy.bind(this),
			PartitionByItemNode: this.visitPartitionByItem.bind(this),
			SetOperationNode: this.visitSetOperation.bind(this),
			BinaryOperationNode: this.visitBinaryOperation.bind(this),
			UnaryOperationNode: this.visitUnaryOperation.bind(this),
			UsingNode: this.visitUsing.bind(this),
			FunctionNode: this.visitFunction.bind(this),
			CaseNode: this.visitCase.bind(this),
			WhenNode: this.visitWhen.bind(this),
			JSONReferenceNode: this.visitJSONReference.bind(this),
			JSONPathNode: this.visitJSONPath.bind(this),
			JSONPathLegNode: this.visitJSONPathLeg.bind(this),
			JSONOperatorChainNode: this.visitJSONOperatorChain.bind(this),
			TupleNode: this.visitTuple.bind(this),
			MergeQueryNode: this.visitMergeQuery.bind(this),
			MatchedNode: this.visitMatched.bind(this),
			AddIndexNode: this.visitAddIndex.bind(this),
			CastNode: this.visitCast.bind(this),
			FetchNode: this.visitFetch.bind(this),
			TopNode: this.visitTop.bind(this),
			OutputNode: this.visitOutput.bind(this),
			OrActionNode: this.visitOrAction.bind(this),
			CollateNode: this.visitCollate.bind(this),
			AlterTypeNode: this.visitAlterType.bind(this),
			AddValueNode: this.visitAddValue.bind(this),
			RenameValueNode: this.visitRenameValue.bind(this)
		});
		visitNode = (node) => {
			this.nodeStack.push(node);
			this.#visitors[node.kind](node);
			this.nodeStack.pop();
		};
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/query-compiler/default-query-compiler.js
var LIT_WRAP_REGEX, JSON_PATH_MEMBER_WRAP_REGEX, DefaultQueryCompiler, SELECT_MODIFIER_SQL, SELECT_MODIFIER_PRIORITY, JOIN_TYPE_SQL;
var init_default_query_compiler = __esmMin((() => {
	init_create_table_node();
	init_insert_query_node();
	init_operation_node_visitor();
	init_operator_node();
	init_parens_node();
	init_raw_node();
	init_object_utils();
	init_create_view_node();
	init_set_operation_node();
	init_when_node();
	LIT_WRAP_REGEX = /'/g;
	JSON_PATH_MEMBER_WRAP_REGEX = /['"]/g;
	DefaultQueryCompiler = class extends OperationNodeVisitor {
		#sql = "";
		#parameters = [];
		get numParameters() {
			return this.#parameters.length;
		}
		compileQuery(node, queryId) {
			this.#sql = "";
			this.#parameters = [];
			this.nodeStack.splice(0, this.nodeStack.length);
			this.visitNode(node);
			return freeze({
				query: node,
				queryId,
				sql: this.getSql(),
				parameters: [...this.#parameters]
			});
		}
		getSql() {
			return this.#sql;
		}
		visitSelectQuery(node) {
			const wrapInParens = this.parentNode !== void 0 && !ParensNode.is(this.parentNode) && !InsertQueryNode.is(this.parentNode) && !CreateTableNode.is(this.parentNode) && !CreateViewNode.is(this.parentNode) && !SetOperationNode.is(this.parentNode);
			if (this.parentNode === void 0 && node.explain) {
				this.visitNode(node.explain);
				this.append(" ");
			}
			if (wrapInParens) this.append("(");
			if (node.with) {
				this.visitNode(node.with);
				this.append(" ");
			}
			this.append("select");
			if (node.distinctOn) {
				this.append(" ");
				this.compileDistinctOn(node.distinctOn);
			}
			if (node.frontModifiers?.length) {
				this.append(" ");
				this.compileList(node.frontModifiers, " ");
			}
			if (node.top) {
				this.append(" ");
				this.visitNode(node.top);
			}
			if (node.selections) {
				this.append(" ");
				this.compileList(node.selections);
			}
			if (node.from) {
				this.append(" ");
				this.visitNode(node.from);
			}
			if (node.joins) {
				this.append(" ");
				this.compileList(node.joins, " ");
			}
			if (node.where) {
				this.append(" ");
				this.visitNode(node.where);
			}
			if (node.groupBy) {
				this.append(" ");
				this.visitNode(node.groupBy);
			}
			if (node.having) {
				this.append(" ");
				this.visitNode(node.having);
			}
			if (node.setOperations) {
				this.append(" ");
				this.compileList(node.setOperations, " ");
			}
			if (node.orderBy) {
				this.append(" ");
				this.visitNode(node.orderBy);
			}
			if (node.limit) {
				this.append(" ");
				this.visitNode(node.limit);
			}
			if (node.offset) {
				this.append(" ");
				this.visitNode(node.offset);
			}
			if (node.fetch) {
				this.append(" ");
				this.visitNode(node.fetch);
			}
			if (node.endModifiers?.length) {
				this.append(" ");
				this.compileList(this.sortSelectModifiers(node.endModifiers), " ");
			}
			if (wrapInParens) this.append(")");
		}
		visitFrom(node) {
			this.append("from ");
			this.compileList(node.froms);
		}
		visitSelection(node) {
			this.visitNode(node.selection);
		}
		visitColumn(node) {
			this.visitNode(node.column);
		}
		compileDistinctOn(expressions) {
			this.append("distinct on (");
			this.compileList(expressions);
			this.append(")");
		}
		compileList(nodes, separator = ", ") {
			const lastIndex = nodes.length - 1;
			for (let i = 0; i <= lastIndex; i++) {
				this.visitNode(nodes[i]);
				if (i < lastIndex) this.append(separator);
			}
		}
		visitWhere(node) {
			this.append("where ");
			this.visitNode(node.where);
		}
		visitHaving(node) {
			this.append("having ");
			this.visitNode(node.having);
		}
		visitInsertQuery(node) {
			const wrapInParens = this.parentNode !== void 0 && !ParensNode.is(this.parentNode) && !RawNode.is(this.parentNode) && !WhenNode.is(this.parentNode);
			if (this.parentNode === void 0 && node.explain) {
				this.visitNode(node.explain);
				this.append(" ");
			}
			if (wrapInParens) this.append("(");
			if (node.with) {
				this.visitNode(node.with);
				this.append(" ");
			}
			this.append(node.replace ? "replace" : "insert");
			if (node.orAction) {
				this.append(" ");
				this.visitNode(node.orAction);
			}
			if (node.top) {
				this.append(" ");
				this.visitNode(node.top);
			}
			if (node.into) {
				this.append(" into ");
				this.visitNode(node.into);
			}
			if (node.columns) {
				this.append(" (");
				this.compileList(node.columns);
				this.append(")");
			}
			if (node.output) {
				this.append(" ");
				this.visitNode(node.output);
			}
			if (node.values) {
				this.append(" ");
				this.visitNode(node.values);
			}
			if (node.defaultValues) {
				this.append(" ");
				this.append("default values");
			}
			if (node.onConflict) {
				this.append(" ");
				this.visitNode(node.onConflict);
			}
			if (node.onDuplicateKey) {
				this.append(" ");
				this.visitNode(node.onDuplicateKey);
			}
			if (node.returning) {
				this.append(" ");
				this.visitNode(node.returning);
			}
			if (wrapInParens) this.append(")");
			if (node.endModifiers?.length) {
				this.append(" ");
				this.compileList(node.endModifiers, " ");
			}
		}
		visitValues(node) {
			this.append("values ");
			this.compileList(node.values);
		}
		visitDeleteQuery(node) {
			const wrapInParens = this.parentNode !== void 0 && !ParensNode.is(this.parentNode) && !RawNode.is(this.parentNode);
			if (this.parentNode === void 0 && node.explain) {
				this.visitNode(node.explain);
				this.append(" ");
			}
			if (wrapInParens) this.append("(");
			if (node.with) {
				this.visitNode(node.with);
				this.append(" ");
			}
			this.append("delete ");
			if (node.top) {
				this.visitNode(node.top);
				this.append(" ");
			}
			this.visitNode(node.from);
			if (node.output) {
				this.append(" ");
				this.visitNode(node.output);
			}
			if (node.using) {
				this.append(" ");
				this.visitNode(node.using);
			}
			if (node.joins) {
				this.append(" ");
				this.compileList(node.joins, " ");
			}
			if (node.where) {
				this.append(" ");
				this.visitNode(node.where);
			}
			if (node.returning) {
				this.append(" ");
				this.visitNode(node.returning);
			}
			if (node.orderBy) {
				this.append(" ");
				this.visitNode(node.orderBy);
			}
			if (node.limit) {
				this.append(" ");
				this.visitNode(node.limit);
			}
			if (wrapInParens) this.append(")");
			if (node.endModifiers?.length) {
				this.append(" ");
				this.compileList(node.endModifiers, " ");
			}
		}
		visitReturning(node) {
			this.append("returning ");
			this.compileList(node.selections);
		}
		visitAlias(node) {
			this.visitNode(node.node);
			this.append(" as ");
			this.visitNode(node.alias);
		}
		visitReference(node) {
			if (node.table) {
				this.visitNode(node.table);
				this.append(".");
			}
			this.visitNode(node.column);
		}
		visitSelectAll(_) {
			this.append("*");
		}
		visitIdentifier(node) {
			this.append(this.getLeftIdentifierWrapper());
			this.compileUnwrappedIdentifier(node);
			this.append(this.getRightIdentifierWrapper());
		}
		compileUnwrappedIdentifier(node) {
			if (!isString(node.name)) throw new Error("a non-string identifier was passed to compileUnwrappedIdentifier.");
			this.append(this.sanitizeIdentifier(node.name));
		}
		visitAnd(node) {
			this.visitNode(node.left);
			this.append(" and ");
			this.visitNode(node.right);
		}
		visitOr(node) {
			this.visitNode(node.left);
			this.append(" or ");
			this.visitNode(node.right);
		}
		visitValue(node) {
			if (node.immediate) this.appendImmediateValue(node.value);
			else this.appendValue(node.value);
		}
		visitValueList(node) {
			this.append("(");
			this.compileList(node.values);
			this.append(")");
		}
		visitTuple(node) {
			this.append("(");
			this.compileList(node.values);
			this.append(")");
		}
		visitPrimitiveValueList(node) {
			this.append("(");
			const { values } = node;
			for (let i = 0; i < values.length; ++i) {
				this.appendValue(values[i]);
				if (i !== values.length - 1) this.append(", ");
			}
			this.append(")");
		}
		visitParens(node) {
			this.append("(");
			this.visitNode(node.node);
			this.append(")");
		}
		visitJoin(node) {
			this.append(JOIN_TYPE_SQL[node.joinType]);
			this.append(" ");
			this.visitNode(node.table);
			if (node.on) {
				this.append(" ");
				this.visitNode(node.on);
			}
		}
		visitOn(node) {
			this.append("on ");
			this.visitNode(node.on);
		}
		visitRaw(node) {
			const { sqlFragments, parameters: params } = node;
			for (let i = 0; i < sqlFragments.length; ++i) {
				this.append(sqlFragments[i]);
				if (params.length > i) this.visitNode(params[i]);
			}
		}
		visitOperator(node) {
			this.append(node.operator);
		}
		visitTable(node) {
			this.visitNode(node.table);
		}
		visitSchemableIdentifier(node) {
			if (node.schema) {
				this.visitNode(node.schema);
				this.append(".");
			}
			this.visitNode(node.identifier);
		}
		visitCreateTable(node) {
			this.append("create ");
			if (node.frontModifiers?.length) {
				this.compileList(node.frontModifiers, " ");
				this.append(" ");
			}
			if (node.temporary) this.append("temporary ");
			this.append("table ");
			if (node.ifNotExists) this.append("if not exists ");
			this.visitNode(node.table);
			if (!node.selectQuery) {
				this.append(" (");
				this.compileList([
					...node.columns,
					...node.constraints ?? [],
					...node.indexes ?? []
				]);
				this.append(")");
			}
			if (node.onCommit) {
				this.append(" on commit ");
				this.append(node.onCommit);
			}
			if (node.endModifiers?.length) {
				this.append(" ");
				this.compileList(node.endModifiers, " ");
			}
			if (node.selectQuery) {
				this.append(" as ");
				this.visitNode(node.selectQuery);
			}
		}
		visitColumnDefinition(node) {
			if (node.ifNotExists) this.append("if not exists ");
			this.visitNode(node.column);
			this.append(" ");
			this.visitNode(node.dataType);
			if (node.unsigned) this.append(" unsigned");
			if (node.frontModifiers && node.frontModifiers.length > 0) {
				this.append(" ");
				this.compileList(node.frontModifiers, " ");
			}
			if (node.generated) {
				this.append(" ");
				this.visitNode(node.generated);
			}
			if (node.identity) this.append(" identity");
			if (node.defaultTo) {
				this.append(" ");
				this.visitNode(node.defaultTo);
			}
			if (node.notNull) this.append(" not null");
			if (node.unique) this.append(" unique");
			if (node.nullsNotDistinct) this.append(" nulls not distinct");
			if (node.primaryKey) this.append(" primary key");
			if (node.autoIncrement) {
				this.append(" ");
				this.append(this.getAutoIncrement());
			}
			if (node.references) {
				this.append(" ");
				this.visitNode(node.references);
			}
			if (node.check) {
				this.append(" ");
				this.visitNode(node.check);
			}
			if (node.endModifiers && node.endModifiers.length > 0) {
				this.append(" ");
				this.compileList(node.endModifiers, " ");
			}
		}
		getAutoIncrement() {
			return "auto_increment";
		}
		visitReferences(node) {
			this.append("references ");
			this.visitNode(node.table);
			this.append(" (");
			this.compileList(node.columns);
			this.append(")");
			if (node.onDelete) {
				this.append(" on delete ");
				this.append(node.onDelete);
			}
			if (node.onUpdate) {
				this.append(" on update ");
				this.append(node.onUpdate);
			}
		}
		visitDropTable(node) {
			this.append("drop ");
			if (node.temporary) this.append("temporary ");
			this.append("table ");
			if (node.ifExists) this.append("if exists ");
			this.visitNode(node.table);
			if (node.cascade) this.append(" cascade");
		}
		visitDataType(node) {
			this.append(node.dataType);
		}
		visitOrderBy(node) {
			this.append("order by ");
			this.compileList(node.items);
		}
		visitOrderByItem(node) {
			this.visitNode(node.orderBy);
			if (node.collation) {
				this.append(" ");
				this.visitNode(node.collation);
			}
			if (node.direction) {
				this.append(" ");
				this.visitNode(node.direction);
			}
			if (node.nulls) {
				this.append(" nulls ");
				this.append(node.nulls);
			}
		}
		visitGroupBy(node) {
			this.append("group by ");
			this.compileList(node.items);
		}
		visitGroupByItem(node) {
			this.visitNode(node.groupBy);
		}
		visitUpdateQuery(node) {
			const wrapInParens = this.parentNode !== void 0 && !ParensNode.is(this.parentNode) && !RawNode.is(this.parentNode) && !WhenNode.is(this.parentNode);
			if (this.parentNode === void 0 && node.explain) {
				this.visitNode(node.explain);
				this.append(" ");
			}
			if (wrapInParens) this.append("(");
			if (node.with) {
				this.visitNode(node.with);
				this.append(" ");
			}
			this.append("update ");
			if (node.top) {
				this.visitNode(node.top);
				this.append(" ");
			}
			if (node.table) {
				this.visitNode(node.table);
				this.append(" ");
			}
			this.append("set ");
			if (node.updates) this.compileList(node.updates);
			if (node.output) {
				this.append(" ");
				this.visitNode(node.output);
			}
			if (node.from) {
				this.append(" ");
				this.visitNode(node.from);
			}
			if (node.joins) {
				if (!node.from) throw new Error("Joins in an update query are only supported as a part of a PostgreSQL 'update set from join' query. If you want to create a MySQL 'update join set' query, see https://kysely.dev/docs/examples/update/my-sql-joins");
				this.append(" ");
				this.compileList(node.joins, " ");
			}
			if (node.where) {
				this.append(" ");
				this.visitNode(node.where);
			}
			if (node.returning) {
				this.append(" ");
				this.visitNode(node.returning);
			}
			if (node.orderBy) {
				this.append(" ");
				this.visitNode(node.orderBy);
			}
			if (node.limit) {
				this.append(" ");
				this.visitNode(node.limit);
			}
			if (wrapInParens) this.append(")");
			if (node.endModifiers?.length) {
				this.append(" ");
				this.compileList(node.endModifiers, " ");
			}
		}
		visitColumnUpdate(node) {
			this.visitNode(node.column);
			this.append(" = ");
			this.visitNode(node.value);
		}
		visitLimit(node) {
			this.append("limit ");
			this.visitNode(node.limit);
		}
		visitOffset(node) {
			this.append("offset ");
			this.visitNode(node.offset);
		}
		visitOnConflict(node) {
			this.append("on conflict");
			if (node.columns) {
				this.append(" (");
				this.compileList(node.columns);
				this.append(")");
			} else if (node.constraint) {
				this.append(" on constraint ");
				this.visitNode(node.constraint);
			} else if (node.indexExpression) {
				this.append(" (");
				this.visitNode(node.indexExpression);
				this.append(")");
			}
			if (node.indexWhere) {
				this.append(" ");
				this.visitNode(node.indexWhere);
			}
			if (node.doNothing === true) this.append(" do nothing");
			else if (node.updates) {
				this.append(" do update set ");
				this.compileList(node.updates);
				if (node.updateWhere) {
					this.append(" ");
					this.visitNode(node.updateWhere);
				}
			}
		}
		visitOnDuplicateKey(node) {
			this.append("on duplicate key update ");
			this.compileList(node.updates);
		}
		visitCreateIndex(node) {
			this.append("create ");
			if (node.unique) this.append("unique ");
			this.append("index ");
			if (node.ifNotExists) this.append("if not exists ");
			this.visitNode(node.name);
			if (node.table) {
				this.append(" on ");
				this.visitNode(node.table);
			}
			if (node.using) {
				this.append(" using ");
				this.visitNode(node.using);
			}
			if (node.columns) {
				this.append(" (");
				this.compileList(node.columns);
				this.append(")");
			}
			if (node.nullsNotDistinct) this.append(" nulls not distinct");
			if (node.where) {
				this.append(" ");
				this.visitNode(node.where);
			}
		}
		visitDropIndex(node) {
			this.append("drop index ");
			if (node.ifExists) this.append("if exists ");
			this.visitNode(node.name);
			if (node.table) {
				this.append(" on ");
				this.visitNode(node.table);
			}
			if (node.cascade) this.append(" cascade");
		}
		visitCreateSchema(node) {
			this.append("create schema ");
			if (node.ifNotExists) this.append("if not exists ");
			this.visitNode(node.schema);
		}
		visitDropSchema(node) {
			this.append("drop schema ");
			if (node.ifExists) this.append("if exists ");
			this.visitNode(node.schema);
			if (node.cascade) this.append(" cascade");
		}
		visitPrimaryKeyConstraint(node) {
			if (node.name) {
				this.append("constraint ");
				this.visitNode(node.name);
				this.append(" ");
			}
			this.append("primary key (");
			this.compileList(node.columns);
			this.append(")");
			this.buildDeferrable(node);
		}
		buildDeferrable(node) {
			if (node.deferrable !== void 0) {
				if (node.deferrable) this.append(" deferrable");
				else this.append(" not deferrable");
			}
			if (node.initiallyDeferred !== void 0) {
				if (node.initiallyDeferred) this.append(" initially deferred");
				else this.append(" initially immediate");
			}
		}
		visitUniqueConstraint(node) {
			if (node.name) {
				this.append("constraint ");
				this.visitNode(node.name);
				this.append(" ");
			}
			this.append("unique");
			if (node.nullsNotDistinct) this.append(" nulls not distinct");
			this.append(" (");
			this.compileList(node.columns);
			this.append(")");
			this.buildDeferrable(node);
		}
		visitCheckConstraint(node) {
			if (node.name) {
				this.append("constraint ");
				this.visitNode(node.name);
				this.append(" ");
			}
			this.append("check (");
			this.visitNode(node.expression);
			this.append(")");
		}
		visitForeignKeyConstraint(node) {
			if (node.name) {
				this.append("constraint ");
				this.visitNode(node.name);
				this.append(" ");
			}
			this.append("foreign key (");
			this.compileList(node.columns);
			this.append(") ");
			this.visitNode(node.references);
			if (node.onDelete) {
				this.append(" on delete ");
				this.append(node.onDelete);
			}
			if (node.onUpdate) {
				this.append(" on update ");
				this.append(node.onUpdate);
			}
			this.buildDeferrable(node);
		}
		visitList(node) {
			this.compileList(node.items);
		}
		visitWith(node) {
			this.append("with ");
			if (node.recursive) this.append("recursive ");
			this.compileList(node.expressions);
		}
		visitCommonTableExpression(node) {
			this.visitNode(node.name);
			this.append(" as ");
			if (isBoolean(node.materialized)) {
				if (!node.materialized) this.append("not ");
				this.append("materialized ");
			}
			this.visitNode(node.expression);
		}
		visitCommonTableExpressionName(node) {
			this.visitNode(node.table);
			if (node.columns) {
				this.append("(");
				this.compileList(node.columns);
				this.append(")");
			}
		}
		visitAlterTable(node) {
			this.append("alter table ");
			this.visitNode(node.table);
			this.append(" ");
			if (node.renameTo) {
				this.append("rename to ");
				this.visitNode(node.renameTo);
			}
			if (node.setSchema) {
				this.append("set schema ");
				this.visitNode(node.setSchema);
			}
			if (node.addConstraint) this.visitNode(node.addConstraint);
			if (node.dropConstraint) this.visitNode(node.dropConstraint);
			if (node.renameConstraint) this.visitNode(node.renameConstraint);
			if (node.columnAlterations) this.compileColumnAlterations(node.columnAlterations);
			if (node.addIndex) this.visitNode(node.addIndex);
			if (node.dropIndex) this.visitNode(node.dropIndex);
		}
		visitAddColumn(node) {
			this.append("add column ");
			this.visitNode(node.column);
		}
		visitRenameColumn(node) {
			this.append("rename column ");
			this.visitNode(node.column);
			this.append(" to ");
			this.visitNode(node.renameTo);
		}
		visitDropColumn(node) {
			this.append("drop column ");
			if (node.ifExists) this.append("if exists ");
			this.visitNode(node.column);
		}
		visitAlterColumn(node) {
			this.append("alter column ");
			this.visitNode(node.column);
			this.append(" ");
			if (node.dataType) {
				if (this.announcesNewColumnDataType()) this.append("type ");
				this.visitNode(node.dataType);
				if (node.dataTypeExpression) {
					this.append("using ");
					this.visitNode(node.dataTypeExpression);
				}
			}
			if (node.setDefault) {
				this.append("set default ");
				this.visitNode(node.setDefault);
			}
			if (node.dropDefault) this.append("drop default");
			if (node.setNotNull) this.append("set not null");
			if (node.dropNotNull) this.append("drop not null");
		}
		visitModifyColumn(node) {
			this.append("modify column ");
			this.visitNode(node.column);
		}
		visitAddConstraint(node) {
			this.append("add ");
			this.visitNode(node.constraint);
		}
		visitDropConstraint(node) {
			this.append("drop constraint ");
			if (node.ifExists) this.append("if exists ");
			this.visitNode(node.constraintName);
			if (node.modifier === "cascade") this.append(" cascade");
			else if (node.modifier === "restrict") this.append(" restrict");
		}
		visitRenameConstraint(node) {
			this.append("rename constraint ");
			this.visitNode(node.oldName);
			this.append(" to ");
			this.visitNode(node.newName);
		}
		visitSetOperation(node) {
			this.append(node.operator);
			this.append(" ");
			if (node.all) this.append("all ");
			this.visitNode(node.expression);
		}
		visitCreateView(node) {
			this.append("create ");
			if (node.orReplace) this.append("or replace ");
			if (node.materialized) this.append("materialized ");
			if (node.temporary) this.append("temporary ");
			this.append("view ");
			if (node.ifNotExists) this.append("if not exists ");
			this.visitNode(node.name);
			this.append(" ");
			if (node.columns) {
				this.append("(");
				this.compileList(node.columns);
				this.append(") ");
			}
			if (node.as) {
				this.append("as ");
				this.visitNode(node.as);
			}
		}
		visitRefreshMaterializedView(node) {
			this.append("refresh materialized view ");
			if (node.concurrently) this.append("concurrently ");
			this.visitNode(node.name);
			if (node.withNoData) this.append(" with no data");
			else this.append(" with data");
		}
		visitDropView(node) {
			this.append("drop ");
			if (node.materialized) this.append("materialized ");
			this.append("view ");
			if (node.ifExists) this.append("if exists ");
			this.visitNode(node.name);
			if (node.cascade) this.append(" cascade");
		}
		visitGenerated(node) {
			this.append("generated ");
			if (node.always) this.append("always ");
			if (node.byDefault) this.append("by default ");
			this.append("as ");
			if (node.identity) this.append("identity");
			if (node.expression) {
				this.append("(");
				this.visitNode(node.expression);
				this.append(")");
			}
			if (node.stored) this.append(" stored");
		}
		visitDefaultValue(node) {
			this.append("default ");
			this.visitNode(node.defaultValue);
		}
		visitSelectModifier(node) {
			if (node.rawModifier) this.visitNode(node.rawModifier);
			else this.append(SELECT_MODIFIER_SQL[node.modifier]);
			if (node.of) {
				this.append(" of ");
				this.compileList(node.of, ", ");
			}
		}
		visitCreateType(node) {
			this.append("create type ");
			this.visitNode(node.name);
			if (node.enum) {
				this.append(" as enum ");
				this.visitNode(node.enum);
			}
		}
		visitDropType(node) {
			this.append("drop type ");
			if (node.ifExists) this.append("if exists ");
			this.visitNode(node.name);
			if (node.additionalNames?.length) {
				this.append(", ");
				this.compileList(node.additionalNames);
			}
			if (node.cascade) this.append(" cascade");
		}
		visitAlterType(node) {
			this.append("alter type ");
			this.visitNode(node.name);
			this.append(" ");
			if (node.addValue) this.visitNode(node.addValue);
			else if (node.renameTo) {
				this.append("rename to ");
				this.visitNode(node.renameTo);
			} else if (node.renameValue) this.visitNode(node.renameValue);
			else if (node.setSchema) {
				this.append("set schema ");
				this.visitNode(node.setSchema);
			}
		}
		visitAddValue(node) {
			this.append("add value ");
			if (node.ifNotExists) this.append("if not exists ");
			this.visitNode(node.value);
			if (node.neighborValue) {
				this.append(node.isBefore ? " before " : " after ");
				this.visitNode(node.neighborValue);
			}
		}
		visitRenameValue(node) {
			this.append("rename value ");
			this.visitNode(node.oldValue);
			this.append(" to ");
			this.visitNode(node.newValue);
		}
		visitExplain(node) {
			this.append("explain");
			if (node.options || node.format) {
				this.append(" ");
				this.append(this.getLeftExplainOptionsWrapper());
				if (node.options) {
					this.visitNode(node.options);
					if (node.format) this.append(this.getExplainOptionsDelimiter());
				}
				if (node.format) {
					this.append("format");
					this.append(this.getExplainOptionAssignment());
					this.append(node.format);
				}
				this.append(this.getRightExplainOptionsWrapper());
			}
		}
		visitDefaultInsertValue(_) {
			this.append("default");
		}
		visitAggregateFunction(node) {
			this.append(node.func);
			this.append("(");
			if (node.distinct) this.append("distinct ");
			this.compileList(node.aggregated);
			if (node.orderBy) {
				this.append(" ");
				this.visitNode(node.orderBy);
			}
			this.append(")");
			if (node.withinGroup) {
				this.append(" within group (");
				this.visitNode(node.withinGroup);
				this.append(")");
			}
			if (node.filter) {
				this.append(" filter(");
				this.visitNode(node.filter);
				this.append(")");
			}
			if (node.over) {
				this.append(" ");
				this.visitNode(node.over);
			}
		}
		visitOver(node) {
			this.append("over(");
			if (node.partitionBy) {
				this.visitNode(node.partitionBy);
				if (node.orderBy) this.append(" ");
			}
			if (node.orderBy) this.visitNode(node.orderBy);
			this.append(")");
		}
		visitPartitionBy(node) {
			this.append("partition by ");
			this.compileList(node.items);
		}
		visitPartitionByItem(node) {
			this.visitNode(node.partitionBy);
		}
		visitBinaryOperation(node) {
			this.visitNode(node.leftOperand);
			this.append(" ");
			this.visitNode(node.operator);
			this.append(" ");
			this.visitNode(node.rightOperand);
		}
		visitUnaryOperation(node) {
			this.visitNode(node.operator);
			if (!this.isMinusOperator(node.operator)) this.append(" ");
			this.visitNode(node.operand);
		}
		isMinusOperator(node) {
			return OperatorNode.is(node) && node.operator === "-";
		}
		visitUsing(node) {
			this.append("using ");
			this.compileList(node.tables);
		}
		visitFunction(node) {
			this.append(node.func);
			this.append("(");
			this.compileList(node.arguments);
			this.append(")");
		}
		visitCase(node) {
			this.append("case");
			if (node.value) {
				this.append(" ");
				this.visitNode(node.value);
			}
			if (node.when) {
				this.append(" ");
				this.compileList(node.when, " ");
			}
			if (node.else) {
				this.append(" else ");
				this.visitNode(node.else);
			}
			this.append(" end");
			if (node.isStatement) this.append(" case");
		}
		visitWhen(node) {
			this.append("when ");
			this.visitNode(node.condition);
			if (node.result) {
				this.append(" then ");
				this.visitNode(node.result);
			}
		}
		visitJSONReference(node) {
			this.visitNode(node.reference);
			this.visitNode(node.traversal);
		}
		visitJSONPath(node) {
			if (node.inOperator) this.visitNode(node.inOperator);
			this.append("'$");
			for (const pathLeg of node.pathLegs) this.visitNode(pathLeg);
			this.append("'");
		}
		visitJSONPathLeg(node) {
			const isArrayLocation = node.type === "ArrayLocation";
			const value = String(node.value);
			if (isArrayLocation) {
				this.append("[");
				this.append(this.sanitizeStringLiteral(value));
				this.append("]");
			} else {
				this.append(".\"");
				this.append(this.sanitizeJSONPathMemberValue(value));
				this.append("\"");
			}
		}
		visitJSONOperatorChain(node) {
			for (let i = 0, len = node.values.length; i < len; i++) {
				if (i === len - 1) this.visitNode(node.operator);
				else this.append("->");
				this.visitNode(node.values[i]);
			}
		}
		visitMergeQuery(node) {
			if (node.with) {
				this.visitNode(node.with);
				this.append(" ");
			}
			this.append("merge ");
			if (node.top) {
				this.visitNode(node.top);
				this.append(" ");
			}
			this.append("into ");
			this.visitNode(node.into);
			if (node.using) {
				this.append(" ");
				this.visitNode(node.using);
			}
			if (node.whens) {
				this.append(" ");
				this.compileList(node.whens, " ");
			}
			if (node.returning) {
				this.append(" ");
				this.visitNode(node.returning);
			}
			if (node.output) {
				this.append(" ");
				this.visitNode(node.output);
			}
			if (node.endModifiers?.length) {
				this.append(" ");
				this.compileList(node.endModifiers, " ");
			}
		}
		visitMatched(node) {
			if (node.not) this.append("not ");
			this.append("matched");
			if (node.bySource) this.append(" by source");
		}
		visitAddIndex(node) {
			if (!this.parentNode || !CreateTableNode.is(this.parentNode)) this.append("add ");
			if (node.unique) this.append("unique ");
			this.append("index ");
			this.visitNode(node.name);
			if (node.columns) {
				this.append(" (");
				this.compileList(node.columns);
				this.append(")");
			}
			if (node.using) {
				this.append(" using ");
				this.visitNode(node.using);
			}
		}
		visitCast(node) {
			this.append("cast(");
			this.visitNode(node.expression);
			this.append(" as ");
			this.visitNode(node.dataType);
			this.append(")");
		}
		visitFetch(node) {
			this.append("fetch next ");
			this.visitNode(node.rowCount);
			this.append(` rows ${node.modifier}`);
		}
		visitOutput(node) {
			this.append("output ");
			this.compileList(node.selections);
		}
		visitTop(node) {
			this.append(`top(${node.expression})`);
			if (node.modifiers) this.append(` ${node.modifiers}`);
		}
		visitOrAction(node) {
			this.append(node.action);
		}
		visitCollate(node) {
			this.append("collate ");
			this.visitNode(node.collation);
		}
		append(str) {
			this.#sql += str;
		}
		appendValue(parameter) {
			this.addParameter(parameter);
			this.append(this.getCurrentParameterPlaceholder());
		}
		getLeftIdentifierWrapper() {
			return "\"";
		}
		getRightIdentifierWrapper() {
			return "\"";
		}
		getCurrentParameterPlaceholder() {
			return "$" + this.numParameters;
		}
		getLeftExplainOptionsWrapper() {
			return "(";
		}
		getExplainOptionAssignment() {
			return " ";
		}
		getExplainOptionsDelimiter() {
			return ", ";
		}
		getRightExplainOptionsWrapper() {
			return ")";
		}
		sanitizeIdentifier(identifier) {
			const leftWrap = this.getLeftIdentifierWrapper();
			const rightWrap = this.getRightIdentifierWrapper();
			let sanitized = "";
			for (const c of identifier) {
				sanitized += c;
				if (c === leftWrap) sanitized += leftWrap;
				else if (c === rightWrap) sanitized += rightWrap;
			}
			return sanitized;
		}
		sanitizeStringLiteral(value) {
			return value.replace(LIT_WRAP_REGEX, "''");
		}
		sanitizeJSONPathMemberValue(value) {
			return value.replace(JSON_PATH_MEMBER_WRAP_REGEX, (char) => char === "'" ? "''" : "\\\"");
		}
		addParameter(parameter) {
			this.#parameters.push(parameter);
		}
		appendImmediateValue(value) {
			if (isString(value)) this.appendStringLiteral(value);
			else if (isNumber(value) || isBoolean(value) || isBigInt(value)) this.append(value.toString());
			else if (isNull(value)) this.append("null");
			else if (isDate(value)) this.appendImmediateValue(value.toISOString());
			else throw new Error(`invalid immediate value ${value}`);
		}
		appendStringLiteral(value) {
			this.append("'");
			this.append(this.sanitizeStringLiteral(value));
			this.append("'");
		}
		sortSelectModifiers(arr) {
			return freeze(arr.toSorted((left, right) => left.modifier && right.modifier ? SELECT_MODIFIER_PRIORITY[left.modifier] - SELECT_MODIFIER_PRIORITY[right.modifier] : 1));
		}
		compileColumnAlterations(columnAlterations) {
			this.compileList(columnAlterations);
		}
		/**
		* controls whether the dialect adds a "type" keyword before a column's new data
		* type in an ALTER TABLE statement.
		*/
		announcesNewColumnDataType() {
			return true;
		}
	};
	SELECT_MODIFIER_SQL = freeze({
		ForKeyShare: "for key share",
		ForNoKeyUpdate: "for no key update",
		ForUpdate: "for update",
		ForShare: "for share",
		NoWait: "nowait",
		SkipLocked: "skip locked",
		Distinct: "distinct"
	});
	SELECT_MODIFIER_PRIORITY = freeze({
		ForKeyShare: 1,
		ForNoKeyUpdate: 1,
		ForUpdate: 1,
		ForShare: 1,
		NoWait: 2,
		SkipLocked: 2,
		Distinct: 0
	});
	JOIN_TYPE_SQL = freeze({
		InnerJoin: "inner join",
		LeftJoin: "left join",
		RightJoin: "right join",
		FullJoin: "full join",
		CrossJoin: "cross join",
		LateralInnerJoin: "inner join lateral",
		LateralLeftJoin: "left join lateral",
		LateralCrossJoin: "cross join lateral",
		OuterApply: "outer apply",
		CrossApply: "cross apply",
		Using: "using"
	});
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/query-compiler/compiled-query.js
var CompiledQuery;
var init_compiled_query = __esmMin((() => {
	init_raw_node();
	init_object_utils();
	init_query_id();
	CompiledQuery = freeze({ raw(sql, parameters = []) {
		return freeze({
			sql,
			query: RawNode.createWithSql(sql),
			parameters: freeze(parameters),
			queryId: createQueryId()
		});
	} });
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/driver/dummy-driver.js
var init_dummy_driver = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dialect/dialect-adapter-base.js
var DialectAdapterBase;
var init_dialect_adapter_base = __esmMin((() => {
	DialectAdapterBase = class {
		get supportsCreateIfNotExists() {
			return true;
		}
		get supportsMultipleConnections() {
			return true;
		}
		get supportsTransactionalDdl() {
			return false;
		}
		get supportsReturning() {
			return false;
		}
		get supportsOutput() {
			return false;
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/parser/savepoint-parser.js
function parseSavepointCommand(command, savepointName) {
	return RawNode.createWithChildren([RawNode.createWithSql(`${command} `), IdentifierNode.create(savepointName)]);
}
var init_savepoint_parser = __esmMin((() => {
	init_identifier_node();
	init_raw_node();
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dialect/sqlite/sqlite-driver.js
var SqliteDriver, SqliteConnection;
var init_sqlite_driver = __esmMin((() => {
	init_select_query_node();
	init_savepoint_parser();
	init_compiled_query();
	init_object_utils();
	init_query_id();
	SqliteDriver = class {
		#config;
		#db;
		#connection;
		constructor(config) {
			this.#config = freeze({ ...config });
		}
		async init(options) {
			this.#db = isFunction(this.#config.database) ? await this.#config.database(options) : this.#config.database;
			this.#connection = new SqliteConnection(this.#db);
			if (this.#config.onCreateConnection) await this.#config.onCreateConnection(this.#connection, options);
		}
		async acquireConnection() {
			return this.#connection;
		}
		async beginTransaction(connection) {
			await connection.executeQuery(CompiledQuery.raw("begin"));
		}
		async commitTransaction(connection) {
			await connection.executeQuery(CompiledQuery.raw("commit"));
		}
		async rollbackTransaction(connection) {
			await connection.executeQuery(CompiledQuery.raw("rollback"));
		}
		async savepoint(connection, savepointName, compileQuery) {
			await connection.executeQuery(compileQuery(parseSavepointCommand("savepoint", savepointName), createQueryId()));
		}
		async rollbackToSavepoint(connection, savepointName, compileQuery) {
			await connection.executeQuery(compileQuery(parseSavepointCommand("rollback to", savepointName), createQueryId()));
		}
		async releaseSavepoint(connection, savepointName, compileQuery) {
			await connection.executeQuery(compileQuery(parseSavepointCommand("release", savepointName), createQueryId()));
		}
		async releaseConnection() {}
		async destroy() {
			this.#db?.close();
		}
	};
	SqliteConnection = class {
		#db;
		constructor(db) {
			this.#db = db;
		}
		async executeQuery(compiledQuery) {
			const { sql, parameters } = compiledQuery;
			const stmt = this.#db.prepare(sql);
			if (stmt.reader) return { rows: stmt.all(parameters) };
			const { changes, lastInsertRowid } = stmt.run(parameters);
			return {
				insertId: lastInsertRowid != null ? BigInt(lastInsertRowid) : void 0,
				numAffectedRows: changes != null ? BigInt(changes) : void 0,
				rows: []
			};
		}
		async *streamQuery(compiledQuery, _chunkSize) {
			const { sql, parameters, query } = compiledQuery;
			const stmt = this.#db.prepare(sql);
			if (!SelectQueryNode.is(query)) throw new Error("Sqlite driver only supports streaming of select queries");
			const iter = stmt.iterate(parameters);
			for (const row of iter) yield { rows: [row] };
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dialect/sqlite/sqlite-query-compiler.js
var ID_WRAP_REGEX, JSON_PATH_MEMBER_ESCAPE_REGEX, SqliteQueryCompiler;
var init_sqlite_query_compiler = __esmMin((() => {
	init_default_query_compiler();
	ID_WRAP_REGEX = /"/g;
	JSON_PATH_MEMBER_ESCAPE_REGEX = /[\\'"]/g;
	SqliteQueryCompiler = class extends DefaultQueryCompiler {
		visitOrAction(node) {
			this.append("or ");
			this.append(node.action);
		}
		getCurrentParameterPlaceholder() {
			return "?";
		}
		getLeftExplainOptionsWrapper() {
			return "";
		}
		getRightExplainOptionsWrapper() {
			return "";
		}
		getLeftIdentifierWrapper() {
			return "\"";
		}
		getRightIdentifierWrapper() {
			return "\"";
		}
		getAutoIncrement() {
			return "autoincrement";
		}
		sanitizeIdentifier(identifier) {
			return identifier.replace(ID_WRAP_REGEX, "\"\"");
		}
		sanitizeJSONPathMemberValue(value) {
			return value.replace(JSON_PATH_MEMBER_ESCAPE_REGEX, (char) => char === "\\" ? "\\\\" : char === "'" ? "''" : "\\\"");
		}
		visitDefaultInsertValue(_) {
			this.append("null");
		}
	};
})), DEFAULT_MIGRATION_TABLE, DEFAULT_MIGRATION_LOCK_TABLE;
var init_migrator = __esmMin((() => {
	init_object_utils();
	DEFAULT_MIGRATION_TABLE = "kysely_migration";
	DEFAULT_MIGRATION_LOCK_TABLE = "kysely_migration_lock";
	freeze({ __noMigrations__: true });
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dialect/sqlite/sqlite-introspector.js
var SqliteIntrospector;
var init_sqlite_introspector = __esmMin((() => {
	init_migrator();
	init_sql();
	SqliteIntrospector = class {
		#db;
		constructor(db) {
			this.#db = db;
		}
		async getSchemas() {
			return [];
		}
		async getTables(options = { withInternalKyselyTables: false }) {
			return await this.#getTableMetadata(options);
		}
		#tablesQuery(qb, options) {
			let tablesQuery = qb.selectFrom("sqlite_master").where("type", "in", ["table", "view"]).where("name", "not like", "sqlite_%").select([
				"name",
				"sql",
				"type"
			]).orderBy("name");
			if (!options.withInternalKyselyTables) tablesQuery = tablesQuery.where("name", "!=", DEFAULT_MIGRATION_TABLE).where("name", "!=", DEFAULT_MIGRATION_LOCK_TABLE);
			return tablesQuery;
		}
		async #getTableMetadata(options) {
			const tablesResult = await this.#tablesQuery(this.#db, options).execute();
			const tableMetadata = await this.#db.with("table_list", (qb) => this.#tablesQuery(qb, options)).selectFrom(["table_list as tl", sql`pragma_table_info(tl.name)`.as("p")]).select([
				"tl.name as table",
				"p.cid",
				"p.name",
				"p.type",
				"p.notnull",
				"p.dflt_value",
				"p.pk"
			]).orderBy("tl.name").orderBy("p.cid").execute();
			const columnsByTable = {};
			for (const row of tableMetadata) {
				columnsByTable[row.table] ??= [];
				columnsByTable[row.table].push(row);
			}
			return tablesResult.map(({ name, sql, type }) => {
				let autoIncrementCol = sql?.split(/[\(\),]/)?.find((it) => it.toLowerCase().includes("autoincrement"))?.trimStart()?.split(/\s+/)?.[0]?.replace(/["`]/g, "");
				const columns = columnsByTable[name] ?? [];
				if (!autoIncrementCol) {
					const pkCols = columns.filter((r) => r.pk > 0);
					if (pkCols.length === 1 && pkCols[0].type.toLowerCase() === "integer") autoIncrementCol = pkCols[0].name;
				}
				return {
					name,
					isView: type === "view",
					isForeign: false,
					columns: columns.map((col) => ({
						name: col.name,
						dataType: col.type,
						isNullable: !col.notnull,
						isAutoIncrementing: col.name === autoIncrementCol,
						hasDefaultValue: col.dflt_value != null,
						comment: void 0
					}))
				};
			});
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dialect/sqlite/sqlite-adapter.js
var SqliteAdapter;
var init_sqlite_adapter = __esmMin((() => {
	init_dialect_adapter_base();
	SqliteAdapter = class extends DialectAdapterBase {
		get supportsMultipleConnections() {
			return false;
		}
		get supportsTransactionalDdl() {
			return false;
		}
		get supportsReturning() {
			return true;
		}
		async acquireMigrationLock(_db, _opt) {}
		async releaseMigrationLock(_db, _opt) {}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dialect/sqlite/sqlite-dialect.js
var SqliteDialect;
var init_sqlite_dialect = __esmMin((() => {
	init_sqlite_driver();
	init_sqlite_query_compiler();
	init_sqlite_introspector();
	init_sqlite_adapter();
	init_object_utils();
	SqliteDialect = class {
		#config;
		constructor(config) {
			this.#config = freeze({ ...config });
		}
		createDriver() {
			return new SqliteDriver(this.#config);
		}
		createQueryCompiler() {
			return new SqliteQueryCompiler();
		}
		createAdapter() {
			return new SqliteAdapter();
		}
		createIntrospector(db) {
			return new SqliteIntrospector(db);
		}
	};
}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dialect/mysql/mysql-driver.js
var init_mysql_driver = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dialect/mysql/mysql-query-compiler.js
var init_mysql_query_compiler = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dialect/mysql/mysql-introspector.js
var init_mysql_introspector = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dialect/mysql/mysql-adapter.js
var init_mysql_adapter = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dialect/mysql/mysql-dialect.js
var init_mysql_dialect = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dialect/postgres/postgres-driver.js
var init_postgres_driver = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dialect/postgres/postgres-introspector.js
var init_postgres_introspector = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dialect/postgres/postgres-query-compiler.js
var init_postgres_query_compiler = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dialect/postgres/postgres-adapter.js
var init_postgres_adapter = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dialect/postgres/postgres-dialect.js
var init_postgres_dialect = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dialect/mssql/mssql-adapter.js
var init_mssql_adapter = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dialect/mssql/mssql-driver.js
var init_mssql_driver = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dialect/mssql/mssql-introspector.js
var init_mssql_introspector = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dialect/mssql/mssql-query-compiler.js
var init_mssql_query_compiler = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dialect/mssql/mssql-dialect.js
var init_mssql_dialect = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dialect/pglite/pglite-adapter.js
var init_pglite_adapter = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dialect/pglite/pglite-driver.js
var init_pglite_driver = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/dialect/pglite/pglite-dialect.js
var init_pglite_dialect = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/plugin/camel-case/camel-case-plugin.js
var init_camel_case_plugin = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/plugin/deduplicate-joins/deduplicate-joins-plugin.js
var init_deduplicate_joins_plugin = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/plugin/parse-json-results/parse-json-results-plugin.js
var init_parse_json_results_plugin = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/plugin/handle-empty-in-lists/handle-empty-in-lists-plugin.js
var init_handle_empty_in_lists_plugin = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/plugin/handle-empty-in-lists/handle-empty-in-lists.js
var init_handle_empty_in_lists = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/plugin/safe-null-comparison/safe-null-comparison-plugin.js
var init_safe_null_comparison_plugin = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/constraint-node.js
var init_constraint_node = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/operation-node/simple-reference-expression-node.js
var init_simple_reference_expression_node = __esmMin((() => {}));
//#endregion
//#region node_modules/.pnpm/kysely@0.29.5/node_modules/kysely/dist/index.js
var init_dist = __esmMin((() => {
	init_kysely();
	init_query_creator();
	init_query_finalizer();
	init_expression();
	init_expression_builder();
	init_expression_wrapper();
	init_select_query_builder();
	init_insert_query_builder();
	init_update_query_builder();
	init_delete_query_builder();
	init_no_result_error();
	init_join_builder();
	init_function_module();
	init_insert_result();
	init_delete_result();
	init_update_result();
	init_on_conflict_builder();
	init_aggregate_function_builder();
	init_case_builder();
	init_json_path_builder();
	init_merge_query_builder();
	init_merge_result();
	init_order_by_item_builder();
	init_raw_builder();
	init_sql();
	init_default_query_executor();
	init_noop_query_executor();
	init_default_query_compiler();
	init_compiled_query();
	init_schema_module();
	init_create_table_builder();
	init_create_type_builder();
	init_drop_table_builder();
	init_drop_type_builder();
	init_create_index_builder();
	init_drop_index_builder();
	init_create_schema_builder();
	init_drop_schema_builder();
	init_column_definition_builder();
	init_foreign_key_constraint_builder();
	init_alter_table_builder();
	init_create_view_builder();
	init_refresh_materialized_view_builder();
	init_drop_view_builder();
	init_alter_column_builder();
	init_drop_column_builder();
	init_dynamic();
	init_dynamic_reference_builder();
	init_dynamic_table_builder();
	init_driver();
	init_default_connection_provider();
	init_single_connection_provider();
	init_dummy_driver();
	init_dialect_adapter_base();
	init_sqlite_dialect();
	init_sqlite_driver();
	init_sqlite_query_compiler();
	init_sqlite_introspector();
	init_sqlite_adapter();
	init_mysql_dialect();
	init_mysql_driver();
	init_mysql_query_compiler();
	init_mysql_introspector();
	init_mysql_adapter();
	init_postgres_driver();
	init_postgres_dialect();
	init_postgres_query_compiler();
	init_postgres_introspector();
	init_postgres_adapter();
	init_mssql_adapter();
	init_mssql_dialect();
	init_mssql_driver();
	init_mssql_introspector();
	init_mssql_query_compiler();
	init_pglite_adapter();
	init_pglite_driver();
	init_pglite_dialect();
	init_default_query_compiler();
	init_camel_case_plugin();
	init_deduplicate_joins_plugin();
	init_with_schema_plugin();
	init_parse_json_results_plugin();
	init_handle_empty_in_lists_plugin();
	init_handle_empty_in_lists();
	init_safe_null_comparison_plugin();
	init_add_column_node();
	init_add_constraint_node();
	init_add_index_node();
	init_aggregate_function_node();
	init_alias_node();
	init_alter_column_node();
	init_alter_table_node();
	init_and_node();
	init_binary_operation_node();
	init_case_node();
	init_cast_node();
	init_check_constraint_node();
	init_collate_node();
	init_column_definition_node();
	init_column_node();
	init_column_update_node();
	init_common_table_expression_name_node();
	init_common_table_expression_node();
	init_constraint_node();
	init_create_index_node();
	init_create_schema_node();
	init_create_table_node();
	init_create_type_node();
	init_create_view_node();
	init_refresh_materialized_view_node();
	init_data_type_node();
	init_default_insert_value_node();
	init_default_value_node();
	init_delete_query_node();
	init_drop_column_node();
	init_drop_constraint_node();
	init_drop_index_node();
	init_drop_schema_node();
	init_drop_table_node();
	init_drop_type_node();
	init_drop_view_node();
	init_explain_node();
	init_fetch_node();
	init_foreign_key_constraint_node();
	init_from_node();
	init_function_node();
	init_generated_node();
	init_group_by_item_node();
	init_group_by_node();
	init_having_node();
	init_identifier_node();
	init_insert_query_node();
	init_join_node();
	init_json_operator_chain_node();
	init_json_path_leg_node();
	init_json_path_node();
	init_json_reference_node();
	init_limit_node();
	init_list_node();
	init_matched_node();
	init_merge_query_node();
	init_modify_column_node();
	init_offset_node();
	init_on_conflict_node();
	init_on_duplicate_key_node();
	init_on_node();
	init_operation_node_source();
	init_operation_node_transformer();
	init_operation_node_visitor();
	init_operator_node();
	init_or_action_node();
	init_or_node();
	init_order_by_item_node();
	init_order_by_node();
	init_output_node();
	init_over_node();
	init_parens_node();
	init_partition_by_item_node();
	init_partition_by_node();
	init_primary_key_constraint_node();
	init_primitive_value_list_node();
	init_query_node();
	init_raw_node();
	init_reference_node();
	init_references_node();
	init_rename_column_node();
	init_rename_constraint_node();
	init_returning_node();
	init_schemable_identifier_node();
	init_select_all_node();
	init_select_modifier_node();
	init_select_query_node();
	init_selection_node();
	init_set_operation_node();
	init_simple_reference_expression_node();
	init_table_node();
	init_top_node();
	init_tuple_node();
	init_unary_operation_node();
	init_unique_constraint_node();
	init_update_query_node();
	init_using_node();
	init_value_list_node();
	init_value_node();
	init_values_node();
	init_when_node();
	init_where_node();
	init_with_node();
	init_alter_type_node();
	init_add_value_node();
	init_rename_value_node();
	init_compilable();
	init_log();
	init_log_once();
	init_query_id();
}));
//#endregion
//#region node-version.mjs
/** Parses an anchored release SemVer, allowing a leading v and valid build metadata. */
function parseNodeReleaseVersion(value) {
	if (typeof value !== "string") return null;
	const match = NODE_RELEASE_VERSION_RE.exec(value.trim());
	if (!match) return null;
	const version = {
		major: Number(match[1]),
		minor: Number(match[2]),
		patch: Number(match[3])
	};
	return Object.values(version).every(Number.isSafeInteger) ? version : null;
}
function isNodeVersionAtLeast(version, minimum) {
	if (!version) return false;
	if (version.major !== minimum.major) return version.major > minimum.major;
	if (version.minor !== minimum.minor) return version.minor > minimum.minor;
	return version.patch >= minimum.patch;
}
function renderProcessNodeVersionCheck() {
	return `((value) => {
  if (typeof value !== "string") return false;
  const match = new RegExp(${JSON.stringify(NODE_RELEASE_VERSION_RE.source)}, "u").exec(value.trim());
  if (!match) return false;
  const version = { major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3]) };
  if (!Object.values(version).every(Number.isSafeInteger)) return false;
  const floors = ${JSON.stringify(NODE_RELEASE_FLOORS)};
  const minimum = floors.find((floor) => floor.major === version.major);
  const atLeast = (floor) =>
    version.major > floor.major ||
    (version.major === floor.major &&
      (version.minor > floor.minor ||
        (version.minor === floor.minor && version.patch >= floor.patch)));
  return minimum ? atLeast(minimum) : version.major > floors[floors.length - 1].major;
})(process.versions.node)`;
}
var NODE_RELEASE_VERSION_RE, NODE_RELEASE_FLOORS, SUPPORTED_NODE_VERSION_RANGE;
var init_node_version = __esmMin((() => {
	NODE_RELEASE_VERSION_RE = /^v?((?:0|[1-9]\d*))\.((?:0|[1-9]\d*))\.((?:0|[1-9]\d*))(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/u;
	NODE_RELEASE_FLOORS = [{
		major: 24,
		minor: 16,
		patch: 0
	}, {
		major: 26,
		minor: 1,
		patch: 0
	}];
	NODE_RELEASE_FLOORS[NODE_RELEASE_FLOORS.length - 1];
	SUPPORTED_NODE_VERSION_RANGE = NODE_RELEASE_FLOORS.map(({ major, minor, patch }, index) => `>=${major}.${minor}.${patch}${index < NODE_RELEASE_FLOORS.length - 1 ? ` <${major + 1}` : ""}`).join(" || ");
	`${SUPPORTED_NODE_VERSION_RANGE.replaceAll(" || ", ", ").replace(/, ([^,]+)$/, ", or $1")}`;
	renderProcessNodeVersionCheck();
}));
//#endregion
//#region src/infra/kysely-sync-cache-state.ts
function disposeNodeSqliteDependents(owner, reason = "close") {
	for (const callback of owner[disposeCallbacksSymbol] ?? []) callback(reason);
}
/** Drop cached Kysely state for a DatabaseSync. */
function clearNodeSqliteKyselyCacheForDatabase(db) {
	delete db[statementCacheSymbol];
	kyselyByDatabase.delete(db);
	queryErrorHandlerByDatabase.delete(db);
}
function installStatementInvalidation(owner) {
	if (owner[statementInvalidationSymbol]) return;
	if (typeof owner.setAuthorizer === "function") {
		const setAuthorizer = owner.setAuthorizer.bind(owner);
		Object.defineProperty(owner, "setAuthorizer", {
			configurable: true,
			writable: true,
			value(callback) {
				setAuthorizer(callback);
				this[authorizerActiveSymbol] = callback !== null;
				delete this[statementCacheSymbol];
			}
		});
	}
	if (typeof owner.deserialize === "function") {
		const deserialize = owner.deserialize.bind(owner);
		Object.defineProperty(owner, "deserialize", {
			configurable: true,
			writable: true,
			value(...args) {
				disposeNodeSqliteDependents(this, "replace");
				try {
					deserialize(...args);
				} finally {
					delete this[statementCacheSymbol];
				}
			}
		});
	}
	if (typeof owner.close === "function") {
		const close = owner.close.bind(owner);
		Object.defineProperty(owner, "close", {
			configurable: true,
			writable: true,
			value() {
				disposeNodeSqliteDependents(this);
				clearNodeSqliteKyselyCacheForDatabase(this);
				return close();
			}
		});
	}
	if (typeof owner[Symbol.dispose] === "function") {
		const dispose = owner[Symbol.dispose].bind(owner);
		Object.defineProperty(owner, Symbol.dispose, {
			configurable: true,
			writable: true,
			value() {
				disposeNodeSqliteDependents(this);
				clearNodeSqliteKyselyCacheForDatabase(this);
				return dispose();
			}
		});
	}
	Object.defineProperty(owner, statementInvalidationSymbol, {
		configurable: true,
		value: true
	});
}
/**
* Enable bounded statement caching for a lifecycle-owned database that has not
* installed an authorizer before this call.
*/
function enableNodeSqliteKyselyStatementCache(db) {
	const owner = db;
	installStatementInvalidation(owner);
	owner[statementCacheEnabledSymbol] = true;
}
function queryFitsStatementCache(sql, parameters) {
	let bytes = Buffer.byteLength(sql);
	if (bytes > statementCacheEntryBytes) return false;
	for (const parameter of parameters) {
		if (typeof parameter === "string") {
			if (parameter.length > statementCacheEntryBytes - bytes) return false;
			bytes += Buffer.byteLength(parameter);
		} else if (ArrayBuffer.isView(parameter)) bytes += parameter.byteLength;
		if (bytes > statementCacheEntryBytes) return false;
	}
	return true;
}
function executeWithCachedStatement(db, sql, parameters, execute) {
	const owner = db;
	if (!owner[statementCacheEnabledSymbol] || owner[authorizerActiveSymbol] || !queryFitsStatementCache(sql, parameters)) return execute(db.prepare(sql));
	let cache = owner[statementCacheSymbol];
	if (!cache) {
		cache = {
			statements: /* @__PURE__ */ new Map(),
			candidates: /* @__PURE__ */ new Set(),
			active: /* @__PURE__ */ new WeakSet()
		};
		Object.defineProperty(owner, statementCacheSymbol, {
			configurable: true,
			value: cache
		});
	}
	const cached = cache.statements.get(sql);
	let statement;
	if (cached && !cache.active.has(cached)) {
		cache.statements.delete(sql);
		cache.statements.set(sql, cached);
		statement = cached;
	} else {
		statement = db.prepare(sql);
		if (!cached && cache.candidates.delete(sql)) {
			cache.statements.set(sql, statement);
			pruneMapToMaxSize(cache.statements, statementCacheCapacity);
		} else if (!cached) {
			cache.candidates.add(sql);
			if (cache.candidates.size > statementCacheCapacity) {
				const oldestCandidate = cache.candidates.values().next().value;
				if (oldestCandidate !== void 0) cache.candidates.delete(oldestCandidate);
			}
		}
	}
	cache.active.add(statement);
	try {
		return execute(statement);
	} finally {
		cache.active.delete(statement);
	}
}
var kyselyByDatabase, queryErrorHandlerByDatabase, statementCacheSymbol, statementInvalidationSymbol, statementCacheEnabledSymbol, authorizerActiveSymbol, disposeCallbacksSymbol, statementCacheCapacity, statementCacheEntryBytes;
var init_kysely_sync_cache_state = __esmMin((() => {
	init_global_singleton();
	init_map_size();
	({kyselyByDatabase, queryErrorHandlerByDatabase} = resolveGlobalSingleton(Symbol.for("openclaw.sqliteKyselyCacheState"), () => ({
		kyselyByDatabase: /* @__PURE__ */ new WeakMap(),
		queryErrorHandlerByDatabase: /* @__PURE__ */ new WeakMap()
	})));
	statementCacheSymbol = Symbol.for("openclaw.kyselySyncStatementCache");
	statementInvalidationSymbol = Symbol.for("openclaw.kyselySyncStatementInvalidation");
	statementCacheEnabledSymbol = Symbol.for("openclaw.kyselySyncStatementCacheEnabled");
	authorizerActiveSymbol = Symbol.for("openclaw.kyselySyncAuthorizerActive");
	disposeCallbacksSymbol = Symbol.for("openclaw.sqliteDisposeCallbacks");
	statementCacheCapacity = 64;
	statementCacheEntryBytes = 65536;
}));
//#endregion
//#region src/infra/sqlite-reader-lifecycle.ts
/** The same Windows file can arrive with a namespaced or differently cased path. */
function sqliteReaderDatabasePathKey(databasePath) {
	const resolved = path.resolve(databasePath);
	return process.platform === "win32" ? normalizeWindowsPathForComparison(resolved) : resolved;
}
function boundedOperation(operation) {
	return (operation.trim() || "sqlite reader").slice(0, 120);
}
function currentOwner(fallbackOperation, capturedOwner) {
	const inherited = capturedOwner ?? readerOwners.getStore();
	return {
		operation: boundedOperation(inherited?.operation ?? fallbackOperation),
		ownerKind: inherited?.ownerKind ?? (isMainThread ? "main" : "worker"),
		...inherited?.actorId !== void 0 ? { actorId: inherited.actorId } : {}
	};
}
function connectionFor(database) {
	let connection = connections.byDatabase.get(database);
	if (!connection) {
		const now = Date.now();
		const location = database.location();
		connection = {
			id: ++connections.nextId,
			path: location ? sqliteReaderDatabasePathKey(location) : void 0,
			database: new WeakRef(database),
			owner: currentOwner("sqlite connection"),
			openedAtMs: now
		};
		connections.byDatabase.set(database, connection);
		if (connection.path) {
			const entries = connections.byPath.get(connection.path) ?? /* @__PURE__ */ new Map();
			entries.set(connection.id, connection);
			connections.byPath.set(connection.path, entries);
		}
		connections.finalizer.register(database, connection, connection);
	}
	return connection;
}
/** Forget observations only; explicit reader custody belongs to its caller. */
function forgetConnection(connection) {
	if (connection.path) {
		const entries = connections.byPath.get(connection.path);
		entries?.delete(connection.id);
		if (entries?.size === 0) connections.byPath.delete(connection.path);
	}
	const database = connection.database.deref();
	if (database && connections.byDatabase.get(database) === connection) connections.byDatabase.delete(database);
	connections.finalizer.unregister(connection);
}
/** Register weak metadata without replacing native methods or acquiring lifecycle custody. */
function registerSqliteReaderConnection(database) {
	if (database.isOpen) connectionFor(database);
}
function retainSqliteReader(database, fallbackOperation, capturedOwner) {
	const connection = connectionFor(database);
	const now = Date.now();
	const reader = {
		...currentOwner(fallbackOperation, capturedOwner),
		kind: "iterator",
		connectionId: connection.id,
		threadId,
		startedAtMs: now,
		lastProgressAtMs: now
	};
	const token = Symbol(reader.operation);
	const databaseReaders = activeReaders.byDatabase.get(database) ?? /* @__PURE__ */ new Map();
	databaseReaders.set(token, reader);
	activeReaders.byDatabase.set(database, databaseReaders);
	const databasePath = connection.path;
	const pathReaders = databasePath ? activeReaders.byPath.get(databasePath) ?? /* @__PURE__ */ new Map() : void 0;
	pathReaders?.set(token, reader);
	if (databasePath && pathReaders) activeReaders.byPath.set(databasePath, pathReaders);
	let released = false;
	return {
		progress() {
			if (!released) reader.lastProgressAtMs = Date.now();
		},
		release() {
			if (released) return;
			released = true;
			databaseReaders.delete(token);
			if (databaseReaders.size === 0) {
				if (activeReaders.byDatabase.get(database) === databaseReaders) activeReaders.byDatabase.delete(database);
			}
			pathReaders?.delete(token);
			if (databasePath && pathReaders?.size === 0 && activeReaders.byPath.get(databasePath) === pathReaders) activeReaders.byPath.delete(databasePath);
		}
	};
}
var readerOwners, activeReaders, connections;
var init_sqlite_reader_lifecycle = __esmMin((() => {
	init_global_singleton();
	readerOwners = resolveGlobalSingleton(Symbol.for("openclaw.sqliteReaderOwners"), () => new AsyncLocalStorage());
	activeReaders = resolveGlobalSingleton(Symbol.for("openclaw.sqliteActiveReaders"), () => ({
		byDatabase: /* @__PURE__ */ new WeakMap(),
		byPath: /* @__PURE__ */ new Map()
	}));
	connections = resolveGlobalSingleton(Symbol.for("openclaw.sqliteReaderConnections"), () => ({
		nextId: 0,
		byDatabase: /* @__PURE__ */ new WeakMap(),
		byPath: /* @__PURE__ */ new Map(),
		finalizer: new FinalizationRegistry((connection) => forgetConnection(connection))
	}));
}));
//#endregion
//#region src/infra/kysely-sync.ts
function getNodeSqliteKysely(db) {
	const existing = kyselyByDatabase.get(db);
	if (existing) return existing;
	const kysely = new Kysely({ dialect: compileOnlySqliteDialect });
	kyselyByDatabase.set(db, kysely);
	return kysely;
}
function reportNodeSqliteKyselyQueryError(db, error) {
	try {
		queryErrorHandlerByDatabase.get(db)?.(error);
	} catch {}
}
/** Execute a compiled Kysely query synchronously against node:sqlite. */
function executeCompiledSqliteQuerySync(db, compiledQuery, firstRowOnly = false, parameters = compiledQuery.parameters) {
	try {
		const sql = compiledQuery.sql;
		installStatementInvalidation(db);
		return executeWithCachedStatement(db, sql, parameters, (statement) => {
			if (firstRowOnly && SelectQueryNode.is(compiledQuery.query)) {
				const row = statement.get(...parameters);
				return { rows: row === void 0 ? [] : [row] };
			}
			if (SelectQueryNode.is(compiledQuery.query) || statement.columns().length > 0) {
				if (supportsRepreparedAll) return { rows: statement.all(...parameters) };
				const iterator = statement.iterate(...parameters);
				const reader = retainSqliteReader(db, "kysely eager query");
				let cleanupError;
				let failed = false;
				let failure;
				const rows = [];
				try {
					for (const row of iterator) {
						reader.progress();
						rows.push(row);
					}
				} catch (error) {
					failed = true;
					failure = error;
				}
				try {
					iterator.return?.();
				} catch (error) {
					cleanupError = error;
				}
				reader.release();
				if (failed) throw toErrorObject(failure, "SQLite query failed");
				if (cleanupError !== void 0) throw toErrorObject(cleanupError, "SQLite query cleanup failed");
				return { rows };
			}
			statement.setReadBigInts(true);
			let outcome;
			try {
				outcome = statement.run(...parameters);
			} finally {
				statement.setReadBigInts(false);
			}
			const { changes, lastInsertRowid } = outcome;
			const result = {
				numAffectedRows: BigInt(changes),
				rows: []
			};
			if (InsertQueryNode.is(compiledQuery.query) && changes > 0) return {
				...result,
				insertId: BigInt(lastInsertRowid)
			};
			return result;
		});
	} catch (error) {
		reportNodeSqliteKyselyQueryError(db, error);
		throw error;
	}
}
/** Compile and execute a Kysely query synchronously. */
function executeSqliteQuerySync(db, query) {
	return executeCompiledSqliteQuerySync(db, query.compile());
}
/** Execute a Kysely query synchronously and return its first row. */
function executeSqliteQueryTakeFirstSync(db, query) {
	return executeCompiledSqliteQuerySync(db, query.compile(), true).rows[0];
}
var nodeVersion, supportsRepreparedAll, compileOnlySqliteDialect;
var init_kysely_sync = __esmMin((() => {
	init_error_coercion();
	init_dist();
	init_node_version();
	init_kysely_sync_cache_state();
	init_sqlite_reader_lifecycle();
	nodeVersion = parseNodeReleaseVersion(process.versions.node);
	supportsRepreparedAll = !process.versions.bun && (nodeVersion?.major === 24 && isNodeVersionAtLeast(nodeVersion, {
		major: 24,
		minor: 20,
		patch: 0
	}) || isNodeVersionAtLeast(nodeVersion, {
		major: 26,
		minor: 6,
		patch: 0
	}));
	compileOnlySqliteDialect = new SqliteDialect({ database: async () => {
		throw new Error("getNodeSqliteKysely() returns a compile-only Kysely facade; use executeSqliteQuerySync() to execute node:sqlite queries.");
	} });
}));
//#endregion
//#region node-sqlite.mjs
function probeSqlite(DatabaseSync) {
	const result = {
		available: false,
		version: null,
		text: false,
		blob: false,
		json: false
	};
	let database;
	try {
		database = new DatabaseSync(":memory:");
		result.available = true;
		const version = database.prepare("SELECT sqlite_version() AS version").get()?.version;
		result.version = typeof version === "string" ? version : null;
		const text = "a\0b\0";
		const bytes = Buffer.from(text, "utf8");
		const json = JSON.stringify({ value: text });
		database.exec("CREATE TABLE probe (text_value TEXT, blob_value BLOB, json_value TEXT)");
		database.prepare("INSERT INTO probe VALUES (?, ?, ?)").run(text, bytes, json);
		const row = database.prepare("SELECT text_value, blob_value, json_value FROM probe").get();
		result.text = typeof row?.text_value === "string" && row.text_value.length === 4 && Buffer.from(row.text_value, "utf8").equals(bytes);
		result.blob = row?.blob_value instanceof Uint8Array && Buffer.from(row.blob_value).equals(bytes);
		result.json = row?.json_value === json && JSON.parse(row.json_value).value === text;
	} catch (error) {
		result.error = error instanceof Error ? error.message : String(error);
	} finally {
		database?.close();
	}
	return result;
}
function isSqliteWalResetSafeVersion(value) {
	const match = /^(\d+)\.(\d+)\.(\d+)$/u.exec(value.trim());
	if (!match) return false;
	const [major, minor, patch] = match.slice(1).map(Number);
	if (![
		major,
		minor,
		patch
	].every(Number.isSafeInteger)) return false;
	return major > 3 || major === 3 && (minor > 51 || minor === 51 && patch >= 3 || minor === 50 && patch >= 7 || minor === 44 && patch >= 6);
}
var init_node_sqlite$1 = __esmMin((() => {
	init_node_version();
	`${probeSqlite.toString()}`;
}));
//#endregion
//#region src/infra/sqlite-runtime-version.ts
var init_sqlite_runtime_version = __esmMin((() => {
	init_node_sqlite$1();
}));
//#endregion
//#region src/infra/bun-sqlite-library.ts
function probeLibrary(path) {
	const { dlopen, FFIType } = createRequire(import.meta.url)("bun:ffi");
	const library = dlopen(path, {
		sqlite3_libversion: {
			args: [],
			returns: FFIType.cstring
		},
		sqlite3_compileoption_used: {
			args: [FFIType.cstring],
			returns: FFIType.i32
		}
	});
	try {
		return {
			version: String(library.symbols.sqlite3_libversion()),
			extensionLoadingSupported: library.symbols.sqlite3_compileoption_used(Buffer.from("OMIT_LOAD_EXTENSION\0")) === 0
		};
	} finally {
		library.close();
	}
}
function selectLibrary(path) {
	const { Database } = createRequire(import.meta.url)("bun:sqlite");
	Database.setCustomSQLite(path);
}
function createSelector(deps) {
	let selection;
	let failure;
	return (options = {}) => {
		if (failure) throw failure;
		if (selection) return selection;
		const override = options.explicitPath ?? (deps.env.OPENCLAW_SQLITE_LIBRARY?.trim() || void 0);
		if (!deps.isBun || deps.platform !== "darwin") {
			selection = override ? {
				source: "runtime",
				ignoredOverride: "OPENCLAW_SQLITE_LIBRARY requires Bun on macOS"
			} : { source: "runtime" };
			return selection;
		}
		const prefix = deps.env.HOMEBREW_PREFIX?.trim();
		const candidates = override !== void 0 ? [override] : [.../* @__PURE__ */ new Set([
			...prefix ? [posix.join(prefix, "opt/sqlite/lib/libsqlite3.dylib")] : [],
			"/opt/homebrew/opt/sqlite/lib/libsqlite3.dylib",
			"/usr/local/opt/sqlite/lib/libsqlite3.dylib",
			"/opt/local/lib/libsqlite3.dylib"
		])];
		for (const path of candidates) {
			let probe;
			try {
				try {
					probe = deps.probe(path);
				} catch (error) {
					throw deps.exists(path) ? error : new Error("missing file", { cause: error });
				}
				if (!isSqliteWalResetSafeVersion(probe.version)) throw new Error(`SQLite version ${probe.version} below the WAL safety floor`);
				if (!probe.extensionLoadingSupported) throw new Error("built with SQLITE_OMIT_LOAD_EXTENSION");
			} catch (error) {
				if (override === void 0) continue;
				failure = selectionError(path, error);
				throw failure;
			}
			try {
				deps.select(path);
			} catch (error) {
				failure = selectionError(path, error);
				throw failure;
			}
			selection = {
				source: override === void 0 ? "discovered" : "env",
				path,
				version: probe.version,
				extensionLoadingSupported: true
			};
			return selection;
		}
		selection = { source: "runtime" };
		return selection;
	};
}
function selectionError(path, error) {
	return new Error(`Cannot use SQLite library ${path}: ${error instanceof Error ? error.message : String(error)}. Fix or unset OPENCLAW_SQLITE_LIBRARY; install a supported library with brew install sqlite.`, { cause: error });
}
function inheritedSelection() {
	const value = getEnvironmentData(WORKER_SELECTION_KEY);
	if (value === void 0) return;
	if (value !== null && typeof value === "object" && !Array.isArray(value)) {
		const source = "source" in value ? value.source : void 0;
		if (source === "runtime") return { source: "runtime" };
		const path = "path" in value ? value.path : void 0;
		const version = "version" in value ? value.version : void 0;
		const extensionLoadingSupported = "extensionLoadingSupported" in value ? value.extensionLoadingSupported : void 0;
		if ((source === "env" || source === "discovered") && typeof path === "string" && typeof version === "string" && extensionLoadingSupported === true) return {
			source,
			path,
			version,
			extensionLoadingSupported: true
		};
	}
	throw new Error("Invalid inherited SQLite library selection");
}
function createRuntimeSelector() {
	const isBun = Boolean(process.versions.bun);
	const sharedLibrary = isBun && process.platform === "darwin";
	const inherited = sharedLibrary && !isMainThread ? inheritedSelection() : void 0;
	if (inherited) return () => inherited;
	const select = createSelector({
		isBun,
		platform: process.platform,
		env: process.env,
		exists: existsSync,
		probe: probeLibrary,
		select: selectLibrary
	});
	let published = false;
	return (options) => {
		const selection = select(options);
		if (sharedLibrary && isMainThread && !published) {
			setEnvironmentData(WORKER_SELECTION_KEY, Object.freeze({ ...selection }));
			published = true;
		}
		return selection;
	};
}
/** Select once, before any SQLite open; shared across CLI and bundled SDK module graphs. */
function ensureSqliteLibrarySelected(options) {
	const dependencies = options?.internals;
	return (dependencies ? dependencies.selector ??= createSelector(dependencies) : resolveGlobalSingleton(Symbol.for("openclaw.bunSqliteLibrarySelection"), createRuntimeSelector))(options);
}
var WORKER_SELECTION_KEY;
var init_bun_sqlite_library = __esmMin((() => {
	init_global_singleton();
	init_sqlite_runtime_version();
	WORKER_SELECTION_KEY = "openclaw.bunSqliteLibrarySelection";
}));
//#endregion
//#region src/infra/errors.ts
function formatErrorMessage(err) {
	return formatErrorMessage$1(err, { redact: redactSensitiveText });
}
var init_errors = __esmMin((() => {
	init_error_coercion();
	init_redact();
	init_errno();
}));
//#endregion
//#region src/infra/semver.ts
function compareValidSemver(left, right) {
	const parsedLeft = parse(left);
	const parsedRight = parse(right);
	return parsedLeft && parsedRight ? parsedLeft.compare(parsedRight) : null;
}
var init_semver = __esmMin((() => {}));
//#endregion
//#region src/infra/warning-filter.ts
/** Returns whether a process warning matches a known noisy runtime/dependency warning. */
function shouldIgnoreWarning(warning) {
	if (warning.code === "DEP0040" && warning.message?.includes("punycode")) return true;
	if (warning.code === "DEP0060" && warning.message?.includes("util._extend")) return true;
	if (warning.name === "ExperimentalWarning" && warning.message?.includes("SQLite is an experimental feature")) return true;
	return false;
}
function normalizeWarningArgs(args) {
	const warningArg = args[0];
	const secondArg = args[1];
	const thirdArg = args[2];
	let name;
	let code;
	let message;
	if (warningArg instanceof Error) {
		name = warningArg.name;
		message = warningArg.message;
		code = warningArg.code;
	} else if (typeof warningArg === "string") message = warningArg;
	if (secondArg && typeof secondArg === "object" && !Array.isArray(secondArg)) {
		const options = secondArg;
		if (typeof options.type === "string") name = options.type;
		if (typeof options.code === "string") code = options.code;
	} else {
		if (typeof secondArg === "string") name = secondArg;
		if (typeof thirdArg === "string") code = thirdArg;
	}
	return {
		name,
		code,
		message
	};
}
/** Installs the global process warning filter once for the current JS realm. */
function installProcessWarningFilter() {
	const state = resolveGlobalSingleton(warningFilterKey, () => ({ installed: false }));
	if (state.installed) return;
	const originalEmitWarning = process.emitWarning.bind(process);
	const wrappedEmitWarning = ((...args) => {
		if (shouldIgnoreWarning(normalizeWarningArgs(args))) return;
		if (args[0] instanceof Error && args[1] && typeof args[1] === "object" && !Array.isArray(args[1])) {
			const warning = args[0];
			const emitted = Object.assign(new Error(warning.message), {
				name: warning.name,
				code: warning.code
			});
			process.emit("warning", emitted);
			return;
		}
		Reflect.apply(originalEmitWarning, process, args);
	});
	process.emitWarning = wrappedEmitWarning;
	state.installed = true;
}
var warningFilterKey;
var init_warning_filter = __esmMin((() => {
	init_global_singleton();
	warningFilterKey = Symbol.for("openclaw.warning-filter");
}));
//#endregion
//#region src/infra/node-sqlite.ts
function resolveSqliteFilesystemPath(pathname) {
	if (process.platform !== "win32") return pathname;
	return path.toNamespacedPath(path.resolve(pathname));
}
function resolveNodeSqliteLocation(location) {
	if (location === "" || location === ":memory:" || location.startsWith("file:")) return location;
	return resolveSqliteFilesystemPath(location);
}
/** Preserve native Windows path prefixes before adding SQLite URI parameters. */
function resolveSqliteFileUriPath(pathname, platform) {
	if (platform === "win32") {
		const namespacedPath = path.win32.toNamespacedPath(path.win32.resolve(pathname));
		return `file:${encodeURIComponent(namespacedPath)}`;
	}
	return pathToFileURL(path.resolve(pathname)).href;
}
/** Open an existing writable database without SQLite's create-if-missing flag. */
function resolveExistingSqliteFileUri(pathname, platform = process.platform) {
	return `${resolveSqliteFileUriPath(pathname, platform)}?mode=rw`;
}
function assertSqliteWalResetSafeVersion(version, nodeVersion) {
	if (isSqliteWalResetSafeVersion(version)) return;
	const variables = process.config?.variables;
	const isShared = variables?.node_shared_sqlite === true || variables?.node_shared_sqlite === "true";
	throw new Error(`OpenClaw requires SQLite 3.51.3+, 3.50.7+ within 3.50.x, or 3.44.6+ within 3.44.x for WAL safety; Node ${nodeVersion} ${isShared ? "uses shared system" : "embeds"} SQLite ${version}, which is affected by the upstream WAL-reset database corruption bug. ${isShared ? "Upgrade the system SQLite library to one of those safe versions, or use a Node build embedding a safe version." : "Upgrade to Node 24.16.0+ or 26.1.0+ before retrying."}`);
}
function assertSafeSqliteRuntime(sqlite) {
	if (validatedSqliteModule === sqlite) return;
	const database = new sqlite.DatabaseSync(":memory:");
	try {
		const row = database.prepare("SELECT sqlite_version() AS version").get();
		const version = typeof row?.version === "string" ? row.version : "unknown";
		assertSqliteWalResetSafeVersion(version, process.versions.node);
		jsonbSupported = (compareValidSemver(version, "3.45.0") ?? -1) >= 0;
		extensionLoadingSupported = database.prepare("SELECT sqlite_compileoption_used('OMIT_LOAD_EXTENSION') AS omitted").get()?.omitted === 0;
		validatedSqliteModule = sqlite;
	} finally {
		database.close();
	}
}
/** Load node:sqlite after installing the process warning filter. */
function requireNodeSqlite() {
	installProcessWarningFilter();
	try {
		ensureSqliteLibrarySelected();
		const sqlite = require$1("node:sqlite");
		assertSafeSqliteRuntime(sqlite);
		return sqlite;
	} catch (err) {
		const message = formatErrorMessage(err);
		throw new Error(`SQLite support is unavailable or unsafe in this Node runtime. ${message}`, { cause: err });
	}
}
/** Open node:sqlite through OpenClaw's runtime and filesystem-location boundary. */
function openNodeSqliteDatabase(location, options) {
	const sqlite = requireNodeSqlite();
	const resolvedLocation = resolveNodeSqliteLocation(location);
	const database = options === void 0 ? new sqlite.DatabaseSync(resolvedLocation) : new sqlite.DatabaseSync(resolvedLocation, options);
	registerSqliteReaderConnection(database);
	return database;
}
/** Compare versions only across reads on the same connection. */
function readSqliteDataVersion(database) {
	const row = database.prepare("PRAGMA data_version").get();
	if (typeof row.data_version !== "number") throw new Error("SQLite did not return a numeric PRAGMA data_version");
	return row.data_version;
}
var require$1, validatedSqliteModule, extensionLoadingSupported, jsonbSupported;
var init_node_sqlite = __esmMin((() => {
	init_bun_sqlite_library();
	init_errors();
	init_semver();
	init_sqlite_reader_lifecycle();
	init_sqlite_runtime_version();
	init_warning_filter();
	require$1 = createRequire(import.meta.url);
}));
//#endregion
//#region src/infra/sqlite-staging-token.ts
/** Native transactions fence private staging admission and committed retirement. */
function acquireSqliteStagingToken(directory, mode, options = {}) {
	const location = path.join(directory, SQLITE_STAGING_TOKEN_FILES[0]);
	const readIdentity = (pathname, kind) => {
		const stat = fs.lstatSync(pathname, { bigint: true });
		if (!(kind === "directory" ? stat.isDirectory() : stat.isFile()) || process.platform === "win32" && (stat.dev === 0n || stat.ino === 0n)) throw new Error("SQLite staging ownership is unknown");
		return stat;
	};
	const directoryIdentity = readIdentity(directory, "directory");
	const family = SQLITE_STAGING_TOKEN_FILES.map((file) => fs.lstatSync(path.join(directory, file), { throwIfNoEntry: false }));
	const existing = family[0];
	if (family.some((file) => file && (!file.isFile() || process.getuid && file.uid !== process.getuid())) || !existing && mode !== "create" && !options.allowMissing) throw new Error("SQLite snapshot token ownership is unknown");
	const existingIdentity = existing ? readIdentity(location, "file") : void 0;
	const db = withSqliteNativeOpen(() => openNodeSqliteDatabase(existing ? resolveExistingSqliteFileUri(location) : location));
	let tokenIdentity;
	const kysely = getNodeSqliteKysely(db);
	const execute = (statement) => executeSqliteQueryTakeFirstSync(db, { compile: () => statement.compile(kysely) });
	let exclusive = mode === "reclaim";
	let retired = false;
	const assertIdentity = () => {
		const currentDirectory = readIdentity(directory, "directory");
		const currentToken = readIdentity(location, "file");
		if (directoryIdentity.dev !== currentDirectory.dev || directoryIdentity.ino !== currentDirectory.ino || tokenIdentity.dev !== currentToken.dev || tokenIdentity.ino !== currentToken.ino) throw new Error("SQLite staging ownership changed before retirement");
	};
	const readVersion = () => {
		const row = execute(sql`PRAGMA user_version`);
		return isRecord(row) ? row.user_version : void 0;
	};
	const beginRetirement = () => {
		assertIdentity();
		if (!db.isOpen) return acquireSqliteStagingToken(directory, "reclaim");
		if (!db.isTransaction || !exclusive) {
			if (db.isTransaction) execute(sql`ROLLBACK`);
			execute(sql`BEGIN EXCLUSIVE`);
			exclusive = true;
		}
		assertIdentity();
		const version = readVersion();
		if (version !== (retired ? 1 : 0)) {
			retired = version === 1;
			throw new SqliteStagingRetiredError();
		}
		return token;
	};
	const release = (retiring = false) => {
		if (!db.isOpen) return;
		if (retiring) {
			beginRetirement();
			if (!retired) execute(sql`PRAGMA user_version=1`);
			execute(sql`COMMIT`);
			retired = true;
		} else if (db.isTransaction) execute(sql`ROLLBACK`);
		db.close();
	};
	const token = Object.assign(release, { beginRetirement });
	try {
		tokenIdentity = existingIdentity ?? readIdentity(location, "file");
		execute(sql`PRAGMA busy_timeout=0`);
		if (mode === "create") execute(sql`BEGIN IMMEDIATE`);
		else if (mode === "reclaim") execute(sql`BEGIN EXCLUSIVE`);
		else {
			execute(sql`BEGIN`);
			execute(sql`SELECT rootpage FROM sqlite_schema LIMIT 1`);
		}
		const journalMode = execute(sql`PRAGMA journal_mode`);
		if (!isRecord(journalMode) || journalMode.journal_mode !== "delete") throw new Error("SQLite snapshot token journal mode is unknown");
		const version = readVersion();
		if (version !== 0 && (mode !== "reclaim" || version !== 1)) throw new SqliteStagingRetiredError();
		retired = version === 1;
		assertIdentity();
		return token;
	} catch (error) {
		release();
		throw error;
	}
}
var SQLITE_STAGING_TOKEN_FILES, SqliteStagingRetiredError;
var init_sqlite_staging_token = __esmMin((() => {
	init_record_coerce();
	init_dist();
	init_kysely_sync();
	init_node_sqlite();
	init_sqlite_error_diagnostics();
	SQLITE_STAGING_TOKEN_FILES = [
		"owner.sqlite",
		"owner.sqlite-journal",
		"owner.sqlite-wal",
		"owner.sqlite-shm"
	];
	SqliteStagingRetiredError = class extends Error {
		constructor() {
			super("SQLite snapshot parent retired; aborting snapshot allocation");
		}
	};
}));
//#endregion
//#region src/infra/sqlite-snapshot-retirement.ts
function releaseTokens(directory, tokens) {
	const pending = pendingTokenReleases.get(directory) ?? /* @__PURE__ */ new Set();
	const failures = [];
	for (const token of tokens) try {
		token();
		pending.delete(token);
	} catch (error) {
		pending.add(token);
		failures.push(error);
	}
	if (pending.size) pendingTokenReleases.set(directory, pending);
	else pendingTokenReleases.delete(directory);
	if (failures.length) throw new AggregateError(failures, "SQLite snapshot retirement token release failed");
}
/** A failed native close retains its actual handle until retry, even after commit or unlink. */
function drainPendingSqliteSnapshotTokens(directory) {
	releaseTokens(directory, pendingTokenReleases.get(directory) ?? []);
}
function drainPendingSqliteSnapshotRootTokens(root, onFailure) {
	for (const directory of pendingTokenReleases.keys()) if (path.dirname(directory) === root) try {
		drainPendingSqliteSnapshotTokens(directory);
	} catch (error) {
		onFailure(error);
	}
}
function acquireSqliteSnapshotToken(directory, mode) {
	return acquireSqliteStagingToken(directory, mode, { allowMissing: SQLITE_SNAPSHOT_LEGACY_MARKER.test(path.basename(directory)) });
}
/** Hold every nested lifetime before selecting payload; a parent lock alone cannot fence children. */
function beginSqliteSnapshotRetirement(directory, options = {}) {
	drainPendingSqliteSnapshotTokens(directory);
	const tokens = [];
	const payload = [];
	const release = () => releaseTokens(directory, tokens.filter((token) => token !== options.token));
	if (!fs.existsSync(directory)) {
		options.token?.();
		return {
			bytes: 0,
			payload,
			release,
			retire: () => {}
		};
	}
	function inspect(current, inheritedCutoff, layout = "", lock = true, parentFenced = false) {
		const stat = fs.lstatSync(current);
		if (!stat.isDirectory() || process.getuid && stat.uid !== process.getuid()) throw new Error("Snapshot directory ownership is unknown");
		const legacy = !layout && SQLITE_SNAPSHOT_LEGACY_MARKER.test(path.basename(current));
		const cutoff = options.cutoff !== void 0 && legacy ? Math.min(inheritedCutoff, Date.now() - SQLITE_SNAPSHOT_LEGACY_AGE_MS) : inheritedCutoff;
		if (legacy && lock && options.cutoff !== void 0) inspect(current, cutoff, layout, false);
		if (!layout && lock) {
			const unfinishedAllocation = parentFenced && tokenMarker.test(path.basename(current)) && fs.readdirSync(current).length === 0;
			tokens.push(current === directory && options.token ? options.token.beginRetirement() : unfinishedAllocation ? acquireSqliteStagingToken(current, "reclaim", { allowMissing: true }) : acquireSqliteSnapshotToken(current, "reclaim"));
		}
		let bytes = 0;
		let newest = stat.mtimeMs;
		for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
			const location = path.join(current, entry.name);
			const item = fs.lstatSync(location);
			if (process.getuid && item.uid !== process.getuid()) throw new Error("Snapshot file ownership is unknown");
			if ((!layout || options.cutoff === void 0) && item.isFile() && SQLITE_STAGING_TOKEN_FILES.some((file) => file === entry.name)) continue;
			newest = Math.max(newest, item.mtimeMs);
			if (item.isDirectory()) {
				const nested = isSqliteSnapshotStagingName(entry.name);
				const childLayout = nested ? "" : [layout, entry.name].filter(Boolean).join("/");
				if (options.cutoff !== void 0 && (!nested && ![
					"openclaw",
					"openclaw-state",
					"openclaw-state/state"
				].includes(childLayout) || nested && layout !== "" && layout !== "openclaw")) throw new Error("Unrecognized snapshot directory");
				const allocationParent = layout === "openclaw" ? path.dirname(current) : current;
				const child = inspect(location, cutoff, childLayout, lock, nested && (layout === "" || layout === "openclaw") && isSqliteSnapshotStagingName(path.basename(allocationParent)));
				bytes += child.bytes;
				newest = Math.max(newest, child.newest);
			} else if (options.cutoff === void 0 || item.isFile() && (layout === "openclaw-state/state" ? /^openclaw\.sqlite(?:-wal|-shm|-journal)?$/u.test(entry.name) : !layout && /^(?:first|database\.sqlite(?:\.partial)?(?:-wal|-shm|-journal)?)$/u.test(entry.name))) {
				bytes += item.size;
				if (lock) payload.push(location);
			} else throw new Error("Unrecognized snapshot artifact");
		}
		if (newest >= cutoff) throw new Error(legacy ? "Legacy snapshot contains activity newer than 24 hours" : "Snapshot contains activity within the reclamation grace period");
		return {
			bytes,
			newest
		};
	}
	try {
		const { bytes } = inspect(directory, options.cutoff ?? Number.POSITIVE_INFINITY);
		return {
			bytes,
			payload,
			release,
			retire: () => {
				for (const token of tokens) token(true);
			}
		};
	} catch (error) {
		release();
		throw error;
	}
}
var SQLITE_SNAPSHOT_PREFIX, suffix, SQLITE_SNAPSHOT_LEGACY_MARKER, tokenMarker, SQLITE_SNAPSHOT_LEGACY_AGE_MS, pendingTokenReleases, isSqliteSnapshotStagingName;
var init_sqlite_snapshot_retirement = __esmMin((() => {
	init_sqlite_staging_token();
	SQLITE_SNAPSHOT_PREFIX = "openclaw-sqlite-readonly-v2-";
	suffix = "(?:[A-Za-z0-9]{6}|[\\da-f]{8}-[\\da-f]{4}-[\\da-f]{4}-[\\da-f]{4}-[\\da-f]{12})$";
	SQLITE_SNAPSHOT_LEGACY_MARKER = new RegExp(`^openclaw-sqlite-readonly-[1-9]\\d*-${suffix}`, "u");
	tokenMarker = new RegExp(`^${SQLITE_SNAPSHOT_PREFIX}${suffix}`, "u");
	SQLITE_SNAPSHOT_LEGACY_AGE_MS = 864e5;
	pendingTokenReleases = /* @__PURE__ */ new Map();
	isSqliteSnapshotStagingName = (name) => SQLITE_SNAPSHOT_LEGACY_MARKER.test(name) || tokenMarker.test(name);
}));
//#endregion
//#region src/infra/sqlite-readonly-location-cleanup.ts
function snapshotDirectory(directory) {
	let owner = pendingTempDirectoryCleanup.get(directory);
	if (!owner) {
		owner = { readers: /* @__PURE__ */ new Set() };
		pendingTempDirectoryCleanup.set(directory, owner);
	}
	return owner;
}
function cleanupSnapshotOperations() {
	pendingSignalCleanup ??= (async () => {
		const directories = pendingTempDirectoryCleanup.keys();
		while (true) {
			while (activeSnapshotWork.size > 0) {
				for (const stop of activeSnapshotWork.values()) stop();
				await Promise.allSettled(activeSnapshotWork.keys());
			}
			const next = directories.next();
			if (next.done) break;
			const directory = next.value;
			await removeTempDirectoryAsync(directory, (error) => emitSnapshotCleanupFailure({
				cleanupRoot: directory,
				operation: "rm",
				code: extractErrorCode(error)
			}));
		}
	})().finally(() => {
		pendingSignalCleanup = void 0;
	});
	return pendingSignalCleanup;
}
/** Join native backup work or a terminated child before removing its private bytes. */
function retainSnapshotWork(work, stop = () => {}) {
	registerSignalExitFinalizer(cleanupSnapshotOperations);
	activeSnapshotWork.set(work, stop);
	const release = () => activeSnapshotWork.delete(work);
	work.then(release, release);
	return work;
}
function registerSnapshotTempDirectory(directory, release) {
	const owner = snapshotDirectory(directory);
	owner.release = release ?? owner.release;
	if (!cleanupExitHandlerInstalled) {
		cleanupExitHandlerInstalled = true;
		process.once("exit", () => {
			for (const stop of activeSnapshotWork.values()) stop();
			if (activeSnapshotWork.size === 0) for (const pendingDir of pendingTempDirectoryCleanup.keys()) removeTempDirectory(pendingDir);
		});
	}
	registerSignalExitFinalizer(cleanupSnapshotOperations);
}
/** Async readers keep token custody on their staging worker until removal. */
function registerAsyncSnapshotTempDirectory(directory, release) {
	registerSnapshotTempDirectory(directory);
	snapshotDirectory(directory).releaseAsync = release;
}
/** A successful child hands its files to the caller's enclosing staging owner. */
function releaseSnapshotTempDirectory(directory) {
	const owner = pendingTempDirectoryCleanup.get(directory);
	assertSnapshotReadersRetired(owner);
	if (owner?.releaseAsync) throw new SqliteSnapshotCleanupError("SQLite snapshot requires asynchronous cleanup");
	owner?.release?.(false);
	pendingTempDirectoryCleanup.delete(directory);
}
function emitSnapshotCleanupFailure(report, onCleanupFailure) {
	if (onCleanupFailure) try {
		onCleanupFailure(report);
		return;
	} catch {}
	try {
		getChildLogger({ subsystem: "infra/sqlite-snapshot" }).warn({
			path: report.cleanupRoot,
			operation: report.operation,
			errorCode: report.code
		}, "SQLite read-only snapshot cleanup failed. Check directory permissions and available storage before retrying.");
	} catch {}
}
function assertSnapshotReadersRetired(owner) {
	if (owner?.readers.size) throw new SqliteSnapshotCleanupError("SQLite snapshot still belongs to an active reader");
}
function prepareSnapshotRetirement(directory) {
	drainPendingSqliteSnapshotTokens(directory);
	const owner = pendingTempDirectoryCleanup.get(directory);
	assertSnapshotReadersRetired(owner);
	if (owner?.releaseAsync) throw new SqliteSnapshotCleanupError("SQLite snapshot requires asynchronous cleanup");
	if (owner?.retired || !owner?.release && !fs.existsSync(path.join(directory, SQLITE_STAGING_TOKEN_FILES[0]))) return;
	if (owner) owner.retirementStarted = true;
	return beginSqliteSnapshotRetirement(directory, { token: owner?.release });
}
/** Delete in the token process: owner death must stop unlinking when its locks disappear. */
function retireSqliteSnapshotPayload(retirement) {
	for (const file of retirement.payload) fs.rmSync(file, tempDirectoryRemovalOptions);
	retirement.retire();
}
function removeTempDirectory(tempDir, onFailure) {
	try {
		const retirement = prepareSnapshotRetirement(tempDir);
		try {
			if (retirement) {
				retireSqliteSnapshotPayload(retirement);
				const owner = snapshotDirectory(tempDir);
				owner.release = void 0;
				owner.retired = true;
			}
			fs.rmSync(tempDir, tempDirectoryRemovalOptions);
		} finally {
			retirement?.release();
		}
		pendingTempDirectoryCleanup.delete(tempDir);
		return true;
	} catch (error) {
		onFailure?.(error);
		registerSnapshotTempDirectory(tempDir);
		return false;
	}
}
async function removeTempDirectoryAsync(tempDir, onFailure) {
	try {
		const owner = pendingTempDirectoryCleanup.get(tempDir);
		assertSnapshotReadersRetired(owner);
		if (owner?.releaseAsync) {
			owner.retirementStarted = true;
			await (owner.retiring ??= owner.releaseAsync().then(() => {
				owner.releaseAsync = void 0;
				owner.retired = true;
			}).finally(() => {
				owner.retiring = void 0;
			}));
		}
		const retirement = prepareSnapshotRetirement(tempDir);
		try {
			for (const file of retirement?.payload ?? []) await retainSnapshotWork(fs.promises.rm(file, tempDirectoryRemovalOptions));
			if (retirement) {
				retirement.retire();
				const current = snapshotDirectory(tempDir);
				current.release = void 0;
				current.retired = true;
			}
			await retainSnapshotWork(fs.promises.rm(tempDir, tempDirectoryRemovalOptions));
		} finally {
			retirement?.release();
		}
		pendingTempDirectoryCleanup.delete(tempDir);
		return true;
	} catch (error) {
		onFailure?.(error);
		registerSnapshotTempDirectory(tempDir);
		return false;
	}
}
function adoptPreparedLocation(location, ownedRoot, requireCleanup = false, onCleanupFailure) {
	const tempDir = ownedRoot ?? path.dirname(location);
	registerSnapshotTempDirectory(tempDir);
	let active = true;
	let pending;
	let reported = false;
	const reportFailure = (error) => {
		if (!requireCleanup && !reported) {
			reported = true;
			emitSnapshotCleanupFailure({
				cleanupRoot: tempDir,
				operation: "rm",
				code: extractErrorCode(error)
			}, onCleanupFailure);
		}
	};
	const complete = (removed) => {
		if (removed) active = false;
		else if (requireCleanup) throw new Error(`SQLite read-only worker snapshot cleanup failed: ${tempDir}`);
		return removed;
	};
	return {
		location,
		cleanupRoot: tempDir,
		cleanup: () => {
			if (pending) return requireCleanup ? complete(false) : false;
			if (!active) return true;
			return complete(removeTempDirectory(tempDir, reportFailure));
		},
		cleanupAsync: () => {
			if (pending) return pending;
			if (!active) return Promise.resolve(true);
			pending = Promise.resolve().then(() => removeTempDirectoryAsync(tempDir, reportFailure)).then(complete).finally(() => {
				pending = void 0;
			});
			return pending;
		}
	};
}
var SqliteSnapshotCleanupError, pendingTempDirectoryCleanup, cleanupExitHandlerInstalled, activeSnapshotWork, pendingSignalCleanup, tempDirectoryRemovalOptions;
var init_sqlite_readonly_location_cleanup = __esmMin((() => {
	init_error_coercion();
	init_signal_exit_barrier();
	init_logger();
	init_sqlite_snapshot_retirement();
	init_sqlite_staging_token();
	SqliteSnapshotCleanupError = class extends Error {};
	pendingTempDirectoryCleanup = /* @__PURE__ */ new Map();
	cleanupExitHandlerInstalled = false;
	activeSnapshotWork = /* @__PURE__ */ new Map();
	tempDirectoryRemovalOptions = {
		force: true,
		maxRetries: 3,
		recursive: true,
		retryDelay: 20
	};
}));
//#endregion
//#region src/infra/sqlite-backup.ts
init_sqlite_readonly_auth_transfer();
init_sqlite_readonly_location_cleanup();
init_node_sqlite();
async function backupNodeSqliteDatabase(source, targetPath) {
	const checkpoint = setInterval(() => {}, 100);
	try {
		return await requireNodeSqlite().backup(source, resolveSqliteFilesystemPath(targetPath));
	} finally {
		clearInterval(checkpoint);
	}
}
//#endregion
//#region src/infra/sqlite-busy-timeout.ts
function normalizeSqliteNonNegativeInteger(value, label) {
	if (!Number.isInteger(value) || value < 0) throw new Error(`${label} must be a non-negative integer`);
	return value;
}
function setSqliteBusyTimeout(database, busyTimeoutMs) {
	const normalizedTimeoutMs = normalizeSqliteNonNegativeInteger(busyTimeoutMs, "busyTimeoutMs");
	database.exec(`PRAGMA busy_timeout = ${normalizedTimeoutMs}`);
}
var init_sqlite_busy_timeout = __esmMin((() => {}));
//#endregion
//#region src/infra/private-mode.ts
function hasRestrictivePermissions(target) {
	try {
		return (statSync(target).mode & 63) === 0;
	} catch {
		return false;
	}
}
function filesystemRejectsChmod(target) {
	let probePath;
	try {
		const probeDir = statSync(target).isDirectory() ? target : path.dirname(target);
		probePath = path.join(probeDir, `.openclaw-chmod-probe-${randomUUID()}`);
		writeFileSync(probePath, "", {
			flag: "wx",
			mode: PRIVATE_PROBE_FILE_MODE
		});
	} catch {
		return false;
	}
	try {
		chmodSync(probePath, PRIVATE_PROBE_FILE_MODE);
		return false;
	} catch (err) {
		return err.code === "EPERM";
	} finally {
		try {
			unlinkSync(probePath);
		} catch {}
	}
}
function canIgnorePrivateChmodError(target, code) {
	if (code && CHMOD_UNSUPPORTED_CODES.has(code)) return true;
	if (code === "EROFS") return hasRestrictivePermissions(target);
	if (code !== "EPERM") return false;
	return hasRestrictivePermissions(target) || filesystemRejectsChmod(target);
}
/**
* Applies a private POSIX mode, reporting unsupported filesystems without
* weakening real permission failures.
*/
function applyPrivateModeSync(target, mode) {
	try {
		chmodSync(target, mode);
		return { applied: true };
	} catch (err) {
		if (!canIgnorePrivateChmodError(target, err.code)) throw err;
		return {
			applied: false,
			error: err
		};
	}
}
var CHMOD_UNSUPPORTED_CODES, PRIVATE_PROBE_FILE_MODE;
var init_private_mode = __esmMin((() => {
	CHMOD_UNSUPPORTED_CODES = /* @__PURE__ */ new Set([
		"ENOTSUP",
		"EOPNOTSUPP",
		"EINVAL"
	]);
	PRIVATE_PROBE_FILE_MODE = 384;
}));
//#endregion
//#region src/infra/sqlite-handle-lifecycle.ts
var SQLITE_IDLE_HANDLE_TTL_MS;
var init_sqlite_handle_lifecycle = __esmMin((() => {
	SQLITE_IDLE_HANDLE_TTL_MS = 18e5;
}));
//#endregion
//#region packages/terminal-core/src/progress-line.ts
/** Clear the active progress line when it is attached to a TTY stream. */
function clearActiveProgressLine() {
	if (!activeStream?.isTTY) return;
	activeStream.write("\r\x1B[2K");
}
var activeStream;
var init_progress_line = __esmMin((() => {
	activeStream = null;
}));
//#endregion
//#region src/global-state.ts
function isVerbose() {
	return globalVerbose;
}
var globalVerbose;
var init_global_state = __esmMin((() => {
	globalVerbose = false;
}));
var init_restore = __esmMin((() => {
	init_progress_line();
}));
//#endregion
//#region src/runtime.ts
function shouldEmitRuntimeLog(env = process.env) {
	if (env.VITEST !== "true") return true;
	if (env.OPENCLAW_TEST_RUNTIME_LOG === "1") return true;
	return typeof console.log.mock === "object";
}
function shouldEmitRuntimeStdout(env = process.env) {
	if (env.VITEST !== "true") return true;
	if (env.OPENCLAW_TEST_RUNTIME_LOG === "1") return true;
	return typeof process.stdout.write.mock === "object";
}
function isPipeClosedError(err) {
	const code = err?.code;
	return code === "EPIPE" || code === "EIO";
}
function writeStdout(value) {
	if (!shouldEmitRuntimeStdout()) return;
	clearActiveProgressLine();
	const line = value.endsWith("\n") ? value : `${value}\n`;
	try {
		process.stdout.write(line);
	} catch (err) {
		if (isPipeClosedError(err)) return;
		throw err;
	}
}
function createRuntimeIo() {
	return {
		log: (...args) => {
			if (!shouldEmitRuntimeLog()) return;
			clearActiveProgressLine();
			console.log(...args);
		},
		error: (...args) => {
			clearActiveProgressLine();
			console.error(...args);
		},
		writeStdout,
		writeJson: (value, space = 2) => {
			writeStdout(JSON.stringify(value, void 0, space > 0 ? space : void 0));
		}
	};
}
var init_runtime = __esmMin((() => {
	init_progress_line();
	init_restore();
	init_state();
	({ ...createRuntimeIo() });
})), ANSI_OSC_INTRODUCER_PATTERN, ANSI_STRING_TERMINATOR_PATTERN, ANSI_OSC_PATTERN, ANSI_COMPAT_CONTROL_SEQUENCE_PATTERN;
var init_ansi_sequences = __esmMin((() => {
	ANSI_OSC_INTRODUCER_PATTERN = "(?:\\x1b\\]|\\x9d)";
	ANSI_STRING_TERMINATOR_PATTERN = "(?:\\x1b\\\\|\\x07|\\x9c)";
	ANSI_OSC_PATTERN = `${ANSI_OSC_INTRODUCER_PATTERN}[^\\x07\\x1b\\x9c]*${ANSI_STRING_TERMINATOR_PATTERN}`;
	ANSI_COMPAT_CONTROL_SEQUENCE_PATTERN = "[\\u001B\\u009B][[\\]()#;?]*(?:\\d{1,4}(?:[;:]\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]";
	new RegExp(ANSI_OSC_PATTERN, "y");
})), ANSI_OSC_SEQUENCE_PATTERN;
var init_ansi = __esmMin((() => {
	init_ansi_sequences();
	ANSI_OSC_SEQUENCE_PATTERN = `${ANSI_OSC_INTRODUCER_PATTERN}[\\s\\S]*?${ANSI_STRING_TERMINATOR_PATTERN}`;
	new RegExp(`${ANSI_OSC_SEQUENCE_PATTERN}|${ANSI_COMPAT_CONTROL_SEQUENCE_PATTERN}`, "y");
	new Intl.Segmenter(void 0, { granularity: "grapheme" });
	new RegExp(`[${String.fromCharCode(0)}-${String.fromCharCode(31)}${String.fromCharCode(127)}-${String.fromCharCode(159)}]`, "g");
}));
//#endregion
//#region src/logging/console.ts
function normalizeConsoleLevel(level) {
	if (isVerbose()) return "debug";
	if (!level && process.env.VITEST === "true" && process.env.OPENCLAW_TEST_CONSOLE !== "1") return "silent";
	return normalizeLogLevel(level, "info");
}
function normalizeConsoleStyle(style) {
	if (style === "compact" || style === "json" || style === "pretty") return style;
	if (!process.stdout.isTTY) return "compact";
	return "pretty";
}
function resolveConsoleSettings() {
	const envLevel = resolveEnvLogLevelOverride();
	if (process.env.VITEST === "true" && process.env.OPENCLAW_TEST_CONSOLE !== "1" && !isVerbose() && !envLevel && !loggingState.overrideSettings) return {
		level: "silent",
		style: normalizeConsoleStyle(void 0)
	};
	const cfg = loggingState.overrideSettings ?? readLoggingConfig();
	return {
		level: envLevel ?? normalizeConsoleLevel(cfg?.consoleLevel),
		style: normalizeConsoleStyle(cfg?.consoleStyle)
	};
}
function getConsoleSettings() {
	const cached = loggingState.cachedConsoleSettings;
	if (cached) return cached;
	const settings = resolveConsoleSettings();
	loggingState.cachedConsoleSettings = settings;
	return loggingState.cachedConsoleSettings;
}
function normalizeConsoleSubsystem(subsystem) {
	if (typeof subsystem !== "string") return null;
	const normalized = subsystem.trim();
	return normalized.length > 0 ? normalized : null;
}
function shouldLogSubsystemToConsole(subsystem) {
	const filter = loggingState.consoleSubsystemFilter;
	if (!filter || filter.length === 0) return true;
	const normalizedSubsystem = normalizeConsoleSubsystem(subsystem);
	if (!normalizedSubsystem) return false;
	return filter.some((prefix) => normalizedSubsystem === prefix || normalizedSubsystem.startsWith(`${prefix}/`));
}
function formatConsoleTimestamp(style) {
	const now = /* @__PURE__ */ new Date();
	if (style === "pretty") return formatTimestamp(now, { style: "short" }).replace(/[+-]\d{2}:\d{2}$/, "");
	return formatTimestamp(now, { style: "long" });
}
var init_console = __esmMin((() => {
	init_ansi();
	init_global_state();
	init_config();
	init_env_log_level();
	init_json_console_line();
	init_levels();
	init_logger();
	init_redact();
	init_state();
	init_timestamps();
	`${process.release.name}${process.pid}`;
}));
//#endregion
//#region src/logging/subsystem.ts
function normalizeSubsystemLabel(subsystem) {
	if (typeof subsystem !== "string") return "unknown";
	const normalized = subsystem.trim();
	return normalized.length > 0 ? normalized : "unknown";
}
function shouldLogToConsole(level, settings) {
	if (level === "silent") return false;
	if (settings.level === "silent") return false;
	return levelToMinLevel(level) >= levelToMinLevel(settings.level);
}
function isRichConsoleEnv() {
	const term = normalizeLowercaseStringOrEmpty(process.env.TERM);
	if (process.env.COLORTERM || process.env.TERM_PROGRAM) return true;
	return term.length > 0 && term !== "dumb";
}
function getColorForConsole() {
	const level = typeof process.env.FORCE_COLOR === "string" && process.env.FORCE_COLOR.trim().length > 0 && process.env.FORCE_COLOR.trim() !== "0" || !process.env.NO_COLOR && (process.stdout.isTTY || process.stderr.isTTY || isRichConsoleEnv()) ? 1 : 0;
	return consoleColors[level] ??= new Chalk({ level });
}
function isChannelSubsystemPrefix(value) {
	const normalized = normalizeLowercaseStringOrEmpty(value);
	if (!normalized) return false;
	return CHANNEL_SUBSYSTEM_PREFIXES.has(normalized);
}
function pickSubsystemColor(subsystem) {
	const override = SUBSYSTEM_COLOR_OVERRIDES.get(subsystem);
	if (override) return override;
	let hash = 0;
	for (let i = 0; i < subsystem.length; i += 1) hash = hash * 31 + subsystem.charCodeAt(i) | 0;
	const idx = Math.abs(hash) % SUBSYSTEM_COLORS.length;
	return expectDefined(SUBSYSTEM_COLORS[idx], "subsystem colors entry at idx");
}
function formatSubsystemForConsole(subsystem) {
	const parts = subsystem.split("/").filter(Boolean);
	const original = parts.join("/") || subsystem;
	while (parts.length > 0) {
		const first = parts.at(0);
		if (first === void 0 || !SUBSYSTEM_PREFIXES_TO_DROP.includes(first)) break;
		parts.shift();
	}
	const first = parts.at(0);
	if (first === void 0) return original;
	if (isChannelSubsystemPrefix(first)) return first;
	if (parts.length > SUBSYSTEM_MAX_SEGMENTS) return parts.slice(-2).join("/");
	return parts.join("/");
}
function stripRedundantSubsystemPrefixForConsole(message, displaySubsystem) {
	if (!displaySubsystem) return message;
	if (message.startsWith("[")) {
		const closeIdx = message.indexOf("]");
		if (closeIdx > 1) {
			if (normalizeLowercaseStringOrEmpty(message.slice(1, closeIdx)) === normalizeLowercaseStringOrEmpty(displaySubsystem)) {
				let i = closeIdx + 1;
				while (message[i] === " ") i += 1;
				return message.slice(i);
			}
		}
	}
	if (normalizeLowercaseStringOrEmpty(message.slice(0, displaySubsystem.length)) !== normalizeLowercaseStringOrEmpty(displaySubsystem)) return message;
	const next = message.slice(displaySubsystem.length, displaySubsystem.length + 1);
	if (next !== ":" && next !== " ") return message;
	let i = displaySubsystem.length;
	while (message[i] === " ") i += 1;
	if (message[i] === ":") i += 1;
	while (message[i] === " ") i += 1;
	return message.slice(i);
}
function createConsoleLineFormatter(subsystem) {
	const displaySubsystem = formatSubsystemForConsole(subsystem);
	const prefix = `[${displaySubsystem}]`;
	const prefixColor = pickSubsystemColor(displaySubsystem);
	return (level, message, style) => {
		const color = getColorForConsole();
		const levelColor = level === "error" || level === "fatal" ? color.red : level === "warn" ? color.yellow : level === "debug" || level === "trace" ? color.gray : color.cyan;
		const displayMessage = stripRedundantSubsystemPrefixForConsole(redactSensitiveText(message), displaySubsystem);
		const time = style === "pretty" || loggingState.consoleTimestampPrefix ? color.gray(formatConsoleTimestamp(style)) : "";
		const prefixToken = color[prefixColor](prefix);
		return `${time ? `${time} ${prefixToken}` : prefixToken} ${levelColor(displayMessage)}`;
	};
}
function writeConsoleLine(level, line, opts = {}) {
	clearActiveProgressLine();
	const sanitized = process.platform === "win32" && process.env.GITHUB_ACTIONS === "true" ? line.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "?").replace(/[\uD800-\uDFFF]/g, "?") : line;
	const redacted = opts.redacted ? sanitized : redactSensitiveText(sanitized);
	const sink = loggingState.rawConsole ?? console;
	if (loggingState.forceConsoleToStderr || level === "error" || level === "fatal") (sink.error ?? console.error)(redacted);
	else if (level === "warn") (sink.warn ?? console.warn)(redacted);
	else (sink.log ?? console.log)(redacted);
}
function shouldSuppressProbeConsoleLine(params) {
	if (isVerbose()) return false;
	if (params.level === "error" || params.level === "fatal") return false;
	const message = typeof params.message === "string" ? params.message : "";
	if (!params.suppressProbeMessages) return false;
	if ((typeof params.meta?.runId === "string" ? params.meta.runId : typeof params.meta?.sessionId === "string" ? params.meta.sessionId : void 0)?.startsWith("probe-")) return true;
	return /(sessionId|runId)=probe-/.test(message);
}
function formatConsoleMetaValue(value) {
	if (value === void 0) return;
	if (typeof value === "string") return /\s|=/.test(value) || value.length === 0 ? JSON.stringify(value) : value;
	if (value === null || typeof value === "number" || typeof value === "boolean") return String(value);
	return JSON.stringify(value);
}
/** Keeps an Error's message, which a JSON round-trip would otherwise reduce to `{}`. */
function prepareConsoleMetaRecord(meta) {
	let prepared;
	for (const [key, value] of Object.entries(meta)) if (value instanceof Error) {
		prepared ??= { ...meta };
		prepared[key] = value.message;
	}
	return prepared ?? meta;
}
/**
* Renders structured fields as one compact `key=value` tail so warn/error/fatal
* records keep their diagnostics in plain-text sinks such as journald, which only
* see the console line. The JSON console style and the file sink carry the same
* fields natively, so only plain styles call this.
*
* Fields pass through the shared console transport redactor before flattening, so
* key-aware protection such as `apiToken` survives the loss of structure and the
* length cap can only clip text that is already masked. That redactor also owns
* circular references, bigints, and values with no JSON form, and returns parsed
* data, so rendering a value here cannot re-enter a stateful `toJSON`.
*/
function formatConsoleMeta(meta) {
	let redacted;
	try {
		redacted = redactLogRecordForTransport(prepareConsoleMetaRecord(meta), { format: "console" });
	} catch {
		return "";
	}
	const parts = [];
	for (const [key, value] of Object.entries(redacted)) {
		const rendered = formatConsoleMetaValue(value);
		if (rendered !== void 0) parts.push(`${key}=${rendered}`);
	}
	const joined = parts.join(" ");
	return joined.length > CONSOLE_META_MAX_CHARS ? `${joined.slice(0, CONSOLE_META_MAX_CHARS)}...(truncated)` : joined;
}
function logToFile(fileLogger, level, message, meta) {
	if (level === "silent") return;
	if (meta && Object.keys(meta).length > 0) fileLogger[level](meta, message);
	else fileLogger[level](message);
}
function createSubsystemLogger(subsystem) {
	const resolvedSubsystem = normalizeSubsystemLabel(subsystem);
	const suppressProbeMessages = resolvedSubsystem === "agent/embedded" || resolvedSubsystem.startsWith("agent/embedded/") || resolvedSubsystem === "model-fallback" || resolvedSubsystem.startsWith("model-fallback/");
	let fileChild;
	let fileChildWithoutStack;
	let formatConsoleLine;
	const getFileLogger = (level) => {
		fileChild ??= getChildLogger({ subsystem: resolvedSubsystem });
		if (level === "error" || level === "fatal" || areDiagnosticsEnabledForProcess() && hasInternalDiagnosticEventInterest("log.record")) return fileChild;
		if (!fileChildWithoutStack) {
			fileChildWithoutStack = fileChild.getSubLogger({ stack: { capture: "off" } });
			fileChildWithoutStack.settings.parentNames = fileChild.settings.parentNames;
		}
		return fileChildWithoutStack;
	};
	const emitLog = (level, message, meta) => {
		const consoleSettings = getConsoleSettings();
		const consoleEnabled = shouldLogToConsole(level, { level: consoleSettings.level }) && shouldLogSubsystemToConsole(resolvedSubsystem);
		const fileEnabled = isFileLogLevelEnabled(level);
		if (!consoleEnabled && !fileEnabled) return;
		let consoleMessageOverride;
		let fileMeta = meta;
		if (meta && Object.keys(meta).length > 0) {
			const { consoleMessage, ...rest } = meta;
			if (typeof consoleMessage === "string") consoleMessageOverride = consoleMessage;
			fileMeta = Object.keys(rest).length > 0 ? rest : void 0;
		}
		if (fileEnabled) logToFile(getFileLogger(level), level, message, fileMeta);
		if (!consoleEnabled) return;
		const consoleMeta = consoleSettings.style !== "json" && consoleMessageOverride === void 0 && fileMeta && CONSOLE_META_LEVELS.has(level) ? formatConsoleMeta(fileMeta) : "";
		const consoleMessage = consoleMessageOverride ?? (consoleMeta ? `${message} ${consoleMeta}` : message);
		if (shouldSuppressProbeConsoleLine({
			level,
			suppressProbeMessages,
			message: consoleMessage,
			meta: fileMeta
		})) return;
		writeConsoleLine(level, consoleSettings.style === "json" ? formatJsonConsoleLine({
			level,
			subsystem: resolvedSubsystem,
			message,
			meta: fileMeta
		}) : (formatConsoleLine ??= createConsoleLineFormatter(resolvedSubsystem))(level, consoleMessage, consoleSettings.style), { redacted: true });
	};
	return {
		subsystem: resolvedSubsystem,
		isEnabled(level, target = "any") {
			const isConsoleEnabled = shouldLogToConsole(level, { level: getConsoleSettings().level }) && shouldLogSubsystemToConsole(resolvedSubsystem);
			const isFileEnabled = isFileLogLevelEnabled(level);
			if (target === "console") return isConsoleEnabled;
			if (target === "file") return isFileEnabled;
			return isConsoleEnabled || isFileEnabled;
		},
		trace(message, meta) {
			emitLog("trace", message, meta);
		},
		debug(message, meta) {
			emitLog("debug", message, meta);
		},
		info(message, meta) {
			emitLog("info", message, meta);
		},
		warn(message, meta) {
			emitLog("warn", message, meta);
		},
		error(message, meta) {
			emitLog("error", message, meta);
		},
		fatal(message, meta) {
			emitLog("fatal", message, meta);
		},
		raw(message) {
			if (isFileLogLevelEnabled("info")) logToFile(getFileLogger("info"), "info", message, { raw: true });
			const consoleSettings = getConsoleSettings();
			if (shouldLogToConsole("info", { level: consoleSettings.level }) && shouldLogSubsystemToConsole(resolvedSubsystem)) {
				if (shouldSuppressProbeConsoleLine({
					level: "info",
					suppressProbeMessages,
					message
				})) return;
				writeConsoleLine("info", consoleSettings.style === "json" ? formatJsonConsoleLine({
					level: "info",
					subsystem: resolvedSubsystem,
					message
				}) : message, { redacted: consoleSettings.style === "json" });
			}
		},
		child(name) {
			return createSubsystemLogger(`${resolvedSubsystem}/${name}`);
		}
	};
}
var consoleColors, SUBSYSTEM_COLORS, SUBSYSTEM_COLOR_OVERRIDES, SUBSYSTEM_PREFIXES_TO_DROP, SUBSYSTEM_MAX_SEGMENTS, CHANNEL_SUBSYSTEM_PREFIXES, CONSOLE_META_LEVELS, CONSOLE_META_MAX_CHARS;
var init_subsystem = __esmMin((() => {
	init_src$1();
	init_string_coerce();
	init_progress_line();
	init_global_state();
	init_diagnostic_event_listener_presence();
	init_diagnostic_events();
	init_runtime();
	init_console();
	init_levels();
	init_logger();
	init_redact();
	init_state();
	(() => {
		const getBuiltinModule = process.getBuiltinModule;
		if (typeof getBuiltinModule !== "function") return null;
		try {
			const utilNamespace = getBuiltinModule("util");
			return typeof utilNamespace.inspect === "function" ? utilNamespace.inspect : null;
		} catch {
			return null;
		}
	})();
	consoleColors = [];
	SUBSYSTEM_COLORS = [
		"cyan",
		"green",
		"yellow",
		"blue",
		"magenta",
		"red"
	];
	SUBSYSTEM_COLOR_OVERRIDES = /* @__PURE__ */ new Map([["gmail-watcher", "blue"]]);
	SUBSYSTEM_PREFIXES_TO_DROP = [
		"gateway",
		"channels",
		"providers"
	];
	SUBSYSTEM_MAX_SEGMENTS = 2;
	CHANNEL_SUBSYSTEM_PREFIXES = /* @__PURE__ */ new Set([
		"clickclack",
		"discord",
		"feishu",
		"googlechat",
		"imessage",
		"irc",
		"line",
		"matrix",
		"mattermost",
		"msteams",
		"nextcloud-talk",
		"nostr",
		"openclaw-weixin",
		"qqbot",
		"signal",
		"slack",
		"synology-chat",
		"telegram",
		"tlon",
		"twitch",
		"webchat",
		"wecom",
		"whatsapp",
		"yuanbao",
		"zalo",
		"zalouser"
	]);
	CONSOLE_META_LEVELS = /* @__PURE__ */ new Set([
		"warn",
		"error",
		"fatal"
	]);
	CONSOLE_META_MAX_CHARS = 2048;
}));
var init_sqlite_post_commit = __esmMin((() => {
	init_global_singleton();
	resolveGlobalSingleton(Symbol.for("openclaw.sqlitePostCommitPublications"), () => /* @__PURE__ */ new WeakMap());
	resolveGlobalSingleton(Symbol.for("openclaw.sqliteTransactionState"), () => /* @__PURE__ */ new WeakMap());
}));
//#endregion
//#region src/infra/sqlite-transaction.ts
function normalizeWriteAdmissionLocation(location) {
	const normalized = process.platform === "win32" ? normalizeWindowsPathPreservingCase(location) : location;
	return process.platform === "win32" && !path.win32.isAbsolute(normalized) ? location : normalized;
}
/** Native coordinator waits must keep the same worker's current-authority grants serviceable. */
function sqliteWriteAdmissionServicesForLocation(location) {
	return writeAdmissionServices.get(normalizeWriteAdmissionLocation(location));
}
var writeAdmissionServices;
var init_sqlite_transaction = __esmMin((() => {
	init_subsystem();
	init_global_singleton();
	init_kysely_sync_cache_state();
	init_path_guards();
	init_sqlite_error_diagnostics();
	init_sqlite_post_commit();
	createSubsystemLogger("sqlite/transaction");
	writeAdmissionServices = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWriteAdmissionServices"), () => /* @__PURE__ */ new Map());
}));
//#endregion
//#region src/infra/sqlite-coordinator.ts
function createSqliteLifecycleAggregateError(errors, message, cause) {
	return new AggregateError(errors, message, { cause });
}
/** Keep the first failure as the cause while retaining independent cleanup errors. */
function throwSqliteLifecycleErrors(errors, message) {
	if (errors.length === 1) throw errors[0];
	if (errors.length > 1) throw createSqliteLifecycleAggregateError(errors, message, errors[0]);
}
function runWithSqliteCoordinator(coordinator, operationLabel, operation) {
	let result;
	try {
		result = operation();
		if (result && typeof result.then === "function") throw new SqliteCoordinatorError(`${operationLabel} must remain synchronous`);
	} catch (operationError) {
		let releaseFailed = false;
		let releaseError;
		try {
			coordinator.release();
		} catch (error) {
			releaseFailed = true;
			releaseError = error;
		}
		if (releaseFailed) throw createSqliteLifecycleAggregateError([operationError, releaseError], `${operationLabel} and coordinator release both failed`, operationError);
		throw operationError;
	}
	try {
		coordinator.release();
	} catch (releaseError) {
		throw new SqliteCoordinatorError(`${operationLabel} completed, but releasing its coordinator failed`, releaseError);
	}
	return result;
}
function ensurePrivateSqliteCoordinatorDirectory(directoryPath, coordinatorLabel) {
	try {
		fs.mkdirSync(directoryPath, {
			mode: 448,
			recursive: true
		});
	} catch (error) {
		if (error.code !== "EEXIST") throw error;
	}
	const stats = fs.lstatSync(directoryPath);
	if (stats.isSymbolicLink() || !stats.isDirectory()) throw new SqliteCoordinatorError(`${coordinatorLabel} directory must be a real directory`);
	const uid = typeof process.getuid === "function" ? process.getuid() : void 0;
	if (uid !== void 0 && stats.uid !== uid) throw new SqliteCoordinatorError(`${coordinatorLabel} directory belongs to another user`);
	if (process.platform !== "win32") {
		if ((stats.mode & 4095) !== 448) applyPrivateModeSync(directoryPath, 448);
		const secured = fs.lstatSync(directoryPath);
		if (secured.isSymbolicLink() || !secured.isDirectory() || (secured.mode & 63) !== 0) throw new SqliteCoordinatorError(`${coordinatorLabel} directory permissions are not private`);
	}
}
function updateCoordinatorExitClose() {
	const needed = idleCoordinators.size > 0 || failedIdleCloses.size > 0;
	if (needed && !coordinatorPool.exitCloseRegistered) process.once("exit", coordinatorPool.closeOnExit);
	else if (!needed && coordinatorPool.exitCloseRegistered) process.removeListener("exit", coordinatorPool.closeOnExit);
	coordinatorPool.exitCloseRegistered = needed;
}
function takeIdleCoordinator(location) {
	const idle = idleCoordinators.get(location);
	if (idle) {
		idleCoordinators.delete(location);
		clearTimeout(idle.timer);
		updateCoordinatorExitClose();
	}
	return idle;
}
function closeIdleCoordinatorDatabase(database, location) {
	try {
		if (database.isOpen) database.close();
	} finally {
		if (database.isOpen) failedIdleCloses.set(database, location);
		else failedIdleCloses.delete(database);
		updateCoordinatorExitClose();
	}
}
function closeIdleCoordinatorsOnExit() {
	const databases = new Map(failedIdleCloses);
	for (const [location] of idleCoordinators) {
		const idle = takeIdleCoordinator(location);
		if (idle) databases.set(idle.database, location);
	}
	for (const [database, location] of databases) try {
		closeIdleCoordinatorDatabase(database, location);
	} catch {}
}
function closeIdleCoordinatorPool(include = () => true) {
	const databases = new Map([...failedIdleCloses].filter(([, location]) => include(location)));
	for (const [location] of idleCoordinators) {
		if (!include(location)) continue;
		const idle = takeIdleCoordinator(location);
		if (idle) databases.set(idle.database, location);
	}
	const errors = [];
	for (const [database, location] of databases) try {
		closeIdleCoordinatorDatabase(database, location);
	} catch (error) {
		errors.push(error);
	}
	throwSqliteLifecycleErrors(errors, "Idle SQLite coordinator cleanup failed");
}
function readCoordinatorIdentity(location) {
	try {
		const identity = fs.lstatSync(location, { bigint: true });
		return identity.isFile() && identity.dev !== 0n && identity.ino !== 0n ? identity : void 0;
	} catch {
		return;
	}
}
function matchesCoordinatorIdentity(left, right) {
	return right !== void 0 && sameFileIdentity(left, right) && left.birthtimeNs === right.birthtimeNs && left.mode === right.mode && left.uid === right.uid && left.gid === right.gid;
}
function retainIdleCoordinator(location, database, identity) {
	const previous = takeIdleCoordinator(location);
	if (previous) closeIdleCoordinatorDatabase(previous.database, location);
	const timer = runInCoordinatorPoolContext(() => setTimeout(() => {
		if (idleCoordinators.get(location)?.timer !== timer) return;
		const idle = takeIdleCoordinator(location);
		if (!idle) return;
		try {
			closeIdleCoordinatorDatabase(idle.database, location);
		} catch (error) {
			process.emitWarning(new SqliteCoordinatorError("Idle SQLite coordinator close failed", error));
		}
	}, SQLITE_IDLE_HANDLE_TTL_MS));
	timer.unref();
	idleCoordinators.set(location, {
		database,
		identity,
		timer
	});
	updateCoordinatorExitClose();
	return true;
}
function tryAcquireSqliteCoordinator(location, mode, options) {
	const busyTimeoutMs = Math.max(0, Math.trunc(options.busyTimeoutMs ?? 0));
	const reusableLocation = location !== "" && location !== ":memory:" && !location.startsWith("file:") ? path.resolve(location) : void 0;
	const poolLocation = reusableLocation && (options.keepAlive || idleCoordinators.has(reusableLocation)) ? reusableLocation : void 0;
	const before = poolLocation ? readCoordinatorIdentity(poolLocation) : void 0;
	const idle = poolLocation ? takeIdleCoordinator(poolLocation) : void 0;
	const reused = idle && matchesCoordinatorIdentity(idle.identity, before) ? idle : void 0;
	if (poolLocation && idle && !reused) closeIdleCoordinatorDatabase(idle.database, poolLocation);
	const database = reused?.database ?? withSqliteNativeOpen(() => openNodeSqliteDatabase(location));
	let identity;
	try {
		const services = mode === "exclusive" ? sqliteWriteAdmissionServicesForLocation(location) : void 0;
		const deadline = performance.now() + busyTimeoutMs;
		for (;;) {
			const attemptTimeout = services ? Math.min(25, Math.max(0, Math.ceil(deadline - performance.now()))) : busyTimeoutMs;
			try {
				database.exec(`PRAGMA busy_timeout = ${attemptTimeout}; PRAGMA journal_mode = MEMORY; ${mode === "exclusive" ? "BEGIN EXCLUSIVE;" : "BEGIN; SELECT rootpage FROM sqlite_schema LIMIT 1;"}`);
				break;
			} catch (error) {
				if (!services || !isSqliteLockError(error) || performance.now() >= deadline) throw error;
				for (const service of services) service();
			}
		}
		if (poolLocation && before) {
			if (matchesCoordinatorIdentity(before, readCoordinatorIdentity(poolLocation))) identity = before;
			else if (reused) throw new SqliteCoordinatorError("SQLite coordinator changed during acquisition");
		}
	} catch (error) {
		if (poolLocation) closeIdleCoordinatorDatabase(database, poolLocation);
		else database.close();
		if (isSqliteLockError(error)) return null;
		throw error;
	}
	let released = false;
	return {
		get closed() {
			return released || !database.isOpen;
		},
		release: (releaseOptions) => {
			if (released || !database.isOpen) return;
			const errors = [];
			if (database.isTransaction) try {
				database.exec("ROLLBACK");
				if (poolLocation && database.isTransaction) throw new SqliteCoordinatorError("SQLite coordinator rollback left its transaction open");
			} catch (error) {
				errors.push(error);
			}
			let retained = false;
			if (errors.length === 0 && options.keepAlive && releaseOptions?.keepAlive !== false && poolLocation && identity && !failedIdleCloses.has(database)) try {
				retained = retainIdleCoordinator(poolLocation, database, identity);
			} catch (error) {
				errors.push(error);
			}
			if (!retained && database.isOpen) try {
				if (poolLocation) closeIdleCoordinatorDatabase(database, poolLocation);
				else database.close();
			} catch (error) {
				errors.push(error);
			}
			released = retained || !database.isOpen;
			if (errors.length === 1) throw errors[0];
			if (errors.length > 1) throw new AggregateError(errors, "SQLite coordinator rollback and close both failed");
		}
	};
}
/** Retain a read lock for a live handle; no rows or journal files are written. */
function tryAcquireSharedSqliteCoordinator(location, options = {}) {
	return tryAcquireSqliteCoordinator(location, "shared", options);
}
var SqliteCoordinatorError, coordinatorPool, runInCoordinatorPoolContext, idleCoordinators, failedIdleCloses;
var init_sqlite_coordinator = __esmMin((() => {
	init_global_singleton();
	init_fs_safe_advanced();
	init_node_sqlite();
	init_path_guards();
	init_private_mode();
	init_sqlite_error_diagnostics();
	init_sqlite_handle_lifecycle();
	init_sqlite_transaction();
	SqliteCoordinatorError = resolveGlobalSingleton(Symbol.for("openclaw.sqliteCoordinatorError"), () => class CoordinatorError extends Error {
		constructor(message, cause) {
			super(message);
			this.cause = cause;
			this.name = "SqliteCoordinatorError";
		}
	});
	coordinatorPool = resolveGlobalSingleton(Symbol.for("openclaw.sqliteCoordinatorPool"), () => ({
		runInCoordinatorPoolContext: AsyncLocalStorage.snapshot(),
		idleCoordinators: /* @__PURE__ */ new Map(),
		failedIdleCloses: /* @__PURE__ */ new Map(),
		exitCloseRegistered: false,
		closeOnExit: closeIdleCoordinatorsOnExit
	}), () => closeIdleCoordinatorPool(), "close-only");
	({runInCoordinatorPoolContext, idleCoordinators, failedIdleCloses} = coordinatorPool);
}));
//#endregion
//#region src/infra/windows-private-directory.ts
init_sqlite_coordinator();
const require = createRequire(import.meta.url);
let creators;
function loadPrivatePathCreators() {
	const koffi = require("koffi");
	const kernel32 = koffi.load("kernel32.dll");
	const advapi32 = koffi.load("advapi32.dll");
	const attributes = koffi.struct({
		length: "uint32_t",
		descriptor: "void *",
		inheritHandle: "int32_t"
	});
	const getLastError = kernel32.func("uint32_t __stdcall GetLastError()");
	const getCurrentProcess = kernel32.func("void * __stdcall GetCurrentProcess()");
	const closeHandle = kernel32.func("int32_t __stdcall CloseHandle(void *handle)");
	const localFree = kernel32.func("void * __stdcall LocalFree(void *memory)");
	const openToken = advapi32.func("int32_t __stdcall OpenProcessToken(void *process, uint32_t access, _Out_ void **token)");
	const getTokenInformation = advapi32.func("int32_t __stdcall GetTokenInformation(void *token, int32_t informationClass, _Out_ void *information, uint32_t length, _Out_ uint32_t *required)");
	const convertSid = advapi32.func("int32_t __stdcall ConvertSidToStringSidW(void *sid, _Out_ void **text)");
	const convertDescriptor = advapi32.func("int32_t __stdcall ConvertStringSecurityDescriptorToSecurityDescriptorW(str16 text, uint32_t revision, _Out_ void **descriptor, void *size)");
	const createDirectory = kernel32.func("__stdcall", "CreateDirectoryW", "int32_t", ["str16", koffi.pointer(attributes)]);
	const createFile = kernel32.func("__stdcall", "CreateFileW", "void *", [
		"str16",
		"uint32_t",
		"uint32_t",
		koffi.pointer(attributes),
		"uint32_t",
		"uint32_t",
		"void *"
	]);
	const failure = (operation) => {
		const errorCode = getLastError();
		return Object.assign(/* @__PURE__ */ new Error(`${operation} failed (Win32 error ${errorCode})`), {
			code: errorCode === 80 || errorCode === 183 ? "EEXIST" : "EIO",
			errno: errorCode
		});
	};
	const withPrivateAttributes = (inherit, operation) => {
		const token = [null];
		const sidText = [null];
		const descriptor = [null];
		if (!openToken(getCurrentProcess(), 8, token)) throw failure("OpenProcessToken");
		try {
			const required = [0];
			getTokenInformation(token[0], 1, null, 0, required);
			if (getLastError() !== 122 || required[0] === 0) throw failure("GetTokenInformation(size)");
			const user = Buffer.alloc(required[0]);
			if (!getTokenInformation(token[0], 1, user, user.length, required)) throw failure("GetTokenInformation");
			if (!convertSid(koffi.decode(user, "void *"), sidText)) throw failure("ConvertSidToStringSidW");
			const sid = koffi.decode(sidText[0], "char16_t", -1);
			const flags = inherit ? "OICI" : "";
			const sddl = `O:${sid}D:P(A;${flags};FA;;;${sid})(A;${flags};FA;;;SY)(A;${flags};FA;;;BA)`;
			if (!convertDescriptor(sddl, 1, descriptor, null)) throw failure("ConvertStringSecurityDescriptorToSecurityDescriptorW");
			return operation({
				length: koffi.sizeof(attributes),
				descriptor: descriptor[0],
				inheritHandle: 0
			});
		} finally {
			if (descriptor[0] !== null) localFree(descriptor[0]);
			if (sidText[0] !== null) localFree(sidText[0]);
			closeHandle(token[0]);
		}
	};
	return {
		directory: (directoryPath) => withPrivateAttributes(true, (security) => {
			if (!createDirectory(path.toNamespacedPath(path.resolve(directoryPath)), security)) throw failure(`CreateDirectoryW(${directoryPath})`);
		}),
		file: (filePath) => withPrivateAttributes(false, (security) => {
			const resolved = path.toNamespacedPath(path.resolve(filePath));
			const handle = createFile(resolved, 3221225472, 3, security, 1, 128, null);
			if (handle === null || BigInt.asIntN(64, koffi.address(handle)) === -1n) throw failure(`CreateFileW(${filePath})`);
			try {
				return fs.openSync(resolved, fs.constants.O_RDWR | (fs.constants.O_NOFOLLOW ?? 0));
			} finally {
				closeHandle(handle);
			}
		})
	};
}
function createPrivateWindowsDirectory(directoryPath) {
	creators ??= loadPrivatePathCreators();
	creators.directory(directoryPath);
}
//#endregion
//#region src/infra/sqlite-private-directory.ts
init_home_dir();
init_tmp_openclaw_dir();
function resolvePrivateSqliteSnapshotStagingRoot(env = process.env) {
	const appData = process.platform === "win32" ? env.LOCALAPPDATA?.trim() : void 0;
	const defaultRoot = process.platform === "win32" ? "AppData/Local" : ".cache";
	const platformRoot = process.platform === "darwin" ? "Library/Caches" : defaultRoot;
	const cacheRoot = [env.XDG_CACHE_HOME?.trim(), appData].find((root) => root && path.isAbsolute(root)) ?? path.join(resolveRequiredOsHomeDir(env), platformRoot);
	return resolvePreferredOpenClawTmpDir({
		preferredDir: path.join(cacheRoot, "openclaw"),
		tmpdir: () => cacheRoot
	});
}
function createPrivateSqliteTempDirectorySync(rootPath, prefix) {
	if (process.platform !== "win32") return fs.mkdtempSync(path.join(rootPath, prefix));
	const directoryPath = path.join(rootPath, `${prefix}${randomUUID()}`);
	createPrivateWindowsDirectory(directoryPath);
	return directoryPath;
}
//#endregion
//#region src/state/openclaw-state-db-schema-helpers.ts
init_kysely_sync_cache_state();
//#endregion
//#region src/state/openclaw-state-db-contract.ts
var FIRST_USE_STATE_TABLES, FIRST_USE_STATE_INDEXES, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS;
var init_openclaw_state_db_contract = __esmMin((() => {
	FIRST_USE_STATE_TABLES = [
		"local_workspace_projections",
		"update_runs",
		"session_repository_workspaces",
		"github_repository_publication_requests",
		"github_publication_session_lifecycles",
		"skill_library_entries",
		"skill_library_revisions",
		"skill_library_events",
		"skill_library_uploads",
		"github_personal_publication_requests",
		"cron_job_runtime_authorities",
		"cron_run_trigger_state_retirements",
		"execution_identity_contexts",
		"mcp_oauth_pending_authorizations",
		"node_worker_launch_containers",
		"node_worker_launch_cleanup",
		"node_worker_launches",
		"node_worker_prepared_workspaces",
		"node_worker_turns",
		"operator_approval_execution_identities",
		"operator_approval_standing_grants",
		"operator_approval_standing_grant_generations",
		"web_push_approval_deliveries",
		"execution_decision_facts",
		"execution_owner_lifecycle_bindings",
		"outbound_message_execution_bindings",
		"outbound_message_progress"
	];
	FIRST_USE_STATE_INDEXES = [
		"idx_update_runs_created",
		"idx_update_runs_active",
		"idx_github_repository_publication_shared_request",
		"idx_github_repository_publication_personal_request",
		"idx_github_personal_publication_owner_session",
		"idx_github_personal_publication_pending",
		"idx_node_worker_launches_terminal_completed",
		"idx_node_worker_turns_terminal_completed",
		"idx_node_worker_turns_active_owner",
		"idx_operator_approval_standing_grants_binding",
		"idx_web_push_approval_deliveries_subscription",
		"execution_identity_contexts_run_created_idx",
		"execution_decision_facts_context_occurred_idx",
		"execution_decision_facts_run_occurred_idx",
		"outbound_message_execution_bindings_execution_event_idx",
		"outbound_message_progress_occurred_idx",
		"outbound_message_progress_run_occurred_idx"
	];
	[...FIRST_USE_STATE_TABLES];
	[...FIRST_USE_STATE_INDEXES];
	OPENCLAW_SQLITE_BUSY_TIMEOUT_MS = 5e3;
}));
//#endregion
//#region src/infra/file-read.ts
var init_file_read = __esmMin((() => {}));
//#endregion
//#region src/infra/git-root.ts
function walkUpFrom(startDir, opts, resolveAtDir) {
	let current = path.resolve(startDir);
	for (let i = 0; opts.maxDepth === void 0 || i < opts.maxDepth; i += 1) {
		const resolved = resolveAtDir(current);
		if (resolved !== null && resolved !== void 0) return resolved;
		const parent = path.dirname(current);
		if (parent === current) break;
		current = parent;
	}
	return null;
}
function resolveGitDirFromMarker(repoRoot) {
	const gitPath = path.join(repoRoot, ".git");
	try {
		const stat = fs.statSync(gitPath);
		if (stat.isDirectory()) return gitPath;
		if (!stat.isFile()) return null;
		const match = fs.readFileSync(gitPath, "utf-8").match(/gitdir:\s*(.+)/i);
		if (!match?.[1]) return null;
		return path.resolve(repoRoot, match[1].trim());
	} catch {
		return null;
	}
}
function resolveGitHeadPath(startDir, opts = {}) {
	return walkUpFrom(startDir, opts, (repoRoot) => {
		const gitDir = resolveGitDirFromMarker(repoRoot);
		return gitDir ? path.join(gitDir, "HEAD") : null;
	});
}
/** Read at most `limit` bytes from Git or build metadata. */
function readGitMetadataPrefix(filePath, limit = 256) {
	const fd = fs.openSync(filePath, "r");
	try {
		const buf = Buffer.alloc(limit);
		const bytesRead = readFileWindowFullySync$1(fd, buf, 0);
		return buf.subarray(0, bytesRead).toString("utf-8");
	} finally {
		fs.closeSync(fd);
	}
}
function readGitHead(startDir, opts = {}) {
	const headPath = resolveGitHeadPath(startDir, opts);
	if (!headPath) return;
	const head = fs.readFileSync(headPath, "utf-8").trim();
	if (!head.startsWith("ref:")) return {
		headPath,
		ref: null,
		value: head || null
	};
	const ref = head.replace(/^ref:\s*/i, "").trim();
	const refsBase = resolveGitRefsBase(headPath);
	return {
		headPath,
		ref,
		value: readGitRefs(refsBase, [ref]).get(ref) ?? null,
		refsBase
	};
}
function resolveGitRefsBase(headPath) {
	const gitDir = path.dirname(headPath);
	try {
		const commonDir = readGitMetadataPrefix(path.join(gitDir, "commondir")).trim();
		if (commonDir) return path.resolve(gitDir, commonDir);
	} catch (error) {
		if (!isMissingPathError(error)) throw error;
	}
	return gitDir;
}
/** Raw ref contents, sharing one packed inventory across the requested names. */
function readGitRefs(refsBase, refs) {
	const values = new Map(refs.map((ref) => [ref, null]));
	const missing = /* @__PURE__ */ new Set();
	for (const ref of refs) {
		const refPath = resolveRefPath(refsBase, ref);
		if (!refPath) continue;
		try {
			values.set(ref, readGitMetadataPrefix(refPath).trim());
		} catch (error) {
			if (!isMissingPathError(error)) throw error;
			missing.add(ref);
		}
	}
	if (missing.size === 0) return values;
	try {
		const packedRefs = fs.readFileSync(path.join(refsBase, "packed-refs"), "utf-8");
		for (const line of packedRefs.split("\n")) {
			if (!line || line.startsWith("#") || line.startsWith("^")) continue;
			const [value, packedRef] = line.trim().split(/\s+/, 2);
			if (packedRef && missing.delete(packedRef)) values.set(packedRef, value ?? null);
		}
	} catch (error) {
		if (!isMissingPathError(error)) throw error;
	}
	return values;
}
/** Safely resolve a Git ref path, rejecting traversal from a crafted HEAD file. */
function resolveRefPath(refsBase, ref) {
	if (!ref.startsWith("refs/")) return null;
	if (path.isAbsolute(ref)) return null;
	if (ref.split(/[/]/).includes("..")) return null;
	const resolved = path.resolve(refsBase, ref);
	const rel = path.relative(refsBase, resolved);
	if (!rel || rel.startsWith("..") || path.isAbsolute(rel)) return null;
	return resolved;
}
var init_git_root = __esmMin((() => {
	init_errors();
	init_file_read();
}));
//#endregion
//#region src/shared/deferred.ts
function createDeferredCore() {
	return promiseWithResolvers.withResolvers();
}
var promiseWithResolvers;
var init_deferred = __esmMin((() => {
	promiseWithResolvers = Promise;
}));
//#endregion
//#region src/shared/async-work-scope.ts
/** Outside a managed scope, the returned promise remains the caller's responsibility. */
async function trackAsyncWork(run) {
	const scope = currentWorkScope.getStore();
	return await (scope ? scope.track(run) : run());
}
var currentWorkScope, currentWorkScopeAncestry, AsyncWorkScope;
var init_async_work_scope = __esmMin((() => {
	init_deferred();
	init_global_singleton();
	currentWorkScope = resolveGlobalSingleton(Symbol.for("openclaw.asyncWorkScope"), () => new AsyncLocalStorage());
	currentWorkScopeAncestry = resolveGlobalSingleton(Symbol.for("openclaw.asyncWorkScopeAncestry"), () => new AsyncLocalStorage());
	resolveGlobalSingleton(Symbol.for("openclaw.detachedAsyncContext"), () => new AsyncResource("openclaw.detached-async-context"));
	AsyncWorkScope = class AsyncWorkScope {
		constructor(failures) {
			this.failures = failures;
			this.pending = /* @__PURE__ */ new Set();
			this.controller = new AbortController();
			this.phase = "open";
		}
		get signal() {
			return this.controller.signal;
		}
		get hasPendingWork() {
			return this.pending.size > 0;
		}
		get isClosing() {
			return this.phase !== "open";
		}
		enter(run) {
			const owner = currentWorkScope.getStore();
			const ancestry = currentWorkScopeAncestry.getStore();
			const parent = owner ? ancestry?.scope === owner ? ancestry : { scope: owner } : void 0;
			return currentWorkScopeAncestry.run({
				scope: this,
				parent
			}, () => currentWorkScope.run(this, run));
		}
		/** Enters synchronous work without inspecting or assimilating its return value. */
		run(run) {
			if (this.phase === "closed") throw new Error("Async work scope is closed");
			const operation = createDeferredCore();
			this.pending.add(operation.promise);
			try {
				return this.enter(run);
			} finally {
				operation.resolve();
				this.pending.delete(operation.promise);
			}
		}
		track(run) {
			if (this.phase === "closed") return Promise.reject(/* @__PURE__ */ new Error("Async work scope is closed"));
			const operation = this.registerWork();
			try {
				operation.resolve(this.enter(run));
			} catch (error) {
				operation.reject(error);
			}
			return operation.promise;
		}
		registerWork() {
			const operation = createDeferredCore();
			this.pending.add(operation.promise);
			operation.promise.then(() => this.pending.delete(operation.promise), (error) => {
				this.pending.delete(operation.promise);
				this.failures?.add(error);
			});
			return operation;
		}
		beginClose(reason) {
			if (this.phase !== "open") return;
			this.phase = "closing";
			this.controller.abort(reason);
		}
		/** Starts the next phase in the same continuation that observes settled pending work. */
		runWhenIdle(run) {
			return AsyncWorkScope.runWhenAllIdle(() => [this], () => this.track(run));
		}
		/** Reselects owners so work admitted into a later phase is not mistaken for earlier work. */
		static async runWhenAllIdle(selectScopes, run) {
			let scopes = selectScopes();
			while (scopes.some((scope) => scope.pending.size > 0)) {
				await Promise.allSettled(scopes.flatMap((scope) => Array.from(scope.pending)));
				scopes = selectScopes();
			}
			return run();
		}
		async drain() {
			this.beginClose();
			while (this.pending.size > 0) await Promise.allSettled(this.pending);
			this.phase = "closed";
		}
	};
}));
//#endregion
//#region src/plugins/host-hook-cleanup-result.ts
/** Merge raw instance outcomes without duplicating their existing host or instance report. */
function appendPluginInstanceCleanupFailures(failures, pluginId, result) {
	for (const error of result.errors) {
		if (failures.some((failure) => failure.pluginId === pluginId && failure.error === error && (failure.hookId === "instance" || result.hostCleanupErrors?.includes(error)))) continue;
		failures.push({
			pluginId,
			hookId: "instance",
			error
		});
	}
}
var init_host_hook_cleanup_result = __esmMin((() => {}));
//#endregion
//#region src/plugins/plugin-cache-artifacts.ts
function createPluginCacheArtifacts() {
	return {
		moduleLoaders: /* @__PURE__ */ new Map(),
		sources: /* @__PURE__ */ new Map(),
		sourceAliases: /* @__PURE__ */ new Map(),
		runtimeRecordRoots: /* @__PURE__ */ new WeakMap()
	};
}
var init_plugin_cache_artifacts = __esmMin((() => {}));
//#endregion
//#region src/plugins/plugin-cache-sdk.ts
/** Derived SDK facts share the plugin cache lifetime; none owns a separate expiry. */
function createPluginCacheSdk() {
	return {
		hosts: /* @__PURE__ */ new Map(),
		contexts: /* @__PURE__ */ new Map(),
		packageNames: /* @__PURE__ */ new Map(),
		packageSearches: /* @__PURE__ */ new Map(),
		argvDirectories: /* @__PURE__ */ new Map(),
		devSourceRoots: /* @__PURE__ */ new Map(),
		runtimeModules: /* @__PURE__ */ new Map(),
		usableDistArtifacts: /* @__PURE__ */ new Map(),
		normalizedJitiAliases: /* @__PURE__ */ new Map(),
		aliasFacts: /* @__PURE__ */ new WeakMap(),
		native: {
			sdkProviders: /* @__PURE__ */ new Map(),
			nextSdkProviderOrder: 0,
			aliases: /* @__PURE__ */ new Map(),
			registeredHosts: /* @__PURE__ */ new Set(),
			hostRoots: /* @__PURE__ */ new Map(),
			nearestPackageRoots: /* @__PURE__ */ new Map(),
			loaderPackageRoots: /* @__PURE__ */ new Map(),
			allowedParentRoots: /* @__PURE__ */ new Map()
		}
	};
}
var init_plugin_cache_sdk = __esmMin((() => {}));
//#endregion
//#region src/plugins/plugin-instance-invocation.ts
/** Copy core scopes through the current owner so runtime-only fields survive. */
function createPluginExecutionFrame(scopes, current) {
	return current ? current.withScopes(scopes) : new InvocationFrame(scopes);
}
var InvocationFrame, pluginExecutionContext, getPluginExecutionFrame;
var init_plugin_instance_invocation = __esmMin((() => {
	init_global_singleton();
	InvocationFrame = class InvocationFrame {
		constructor(scopes) {
			this.invocation = scopes.invocation;
			this.metadataScope = scopes.metadataScope;
			this.cacheScope = scopes.cacheScope;
		}
		withScopes(scopes) {
			return new InvocationFrame(scopes);
		}
	};
	pluginExecutionContext = resolveGlobalSingleton(Symbol.for("openclaw.pluginInstanceInvocation"), () => {
		const frames = new AsyncLocalStorage();
		return {
			invocation: {
				getStore() {
					return frames.getStore()?.invocation;
				},
				run(invocation, run) {
					const current = frames.getStore();
					return frames.run(current?.invocation === invocation ? current : createPluginExecutionFrame({
						...current,
						invocation
					}, current), run);
				},
				exit(run) {
					const current = frames.getStore();
					return current?.invocation ? frames.run(current.withScopes({
						...current,
						invocation: void 0
					}), run) : run();
				}
			},
			getFrame() {
				return frames.getStore();
			},
			runFrame(frame, run) {
				return frames.run(frame, run);
			}
		};
	});
	pluginExecutionContext.invocation;
	getPluginExecutionFrame = pluginExecutionContext.getFrame;
	pluginExecutionContext.runFrame;
}));
//#endregion
//#region src/plugins/plugin-cache.ts
/** Cached diagnostics must not retain the caller through V8's lazy stack frames. */
function materializePluginCacheError(failure) {
	let error = failure;
	const seen = /* @__PURE__ */ new Set();
	while (error instanceof Error && !seen.has(error)) {
		seen.add(error);
		try {
			error.stack = String(error.stack);
		} catch {
			error.stack = "Stack trace unavailable: custom formatter failed";
		}
		error = error.cause;
	}
}
/** A retiring inventory releases its own custody; terminal disposal releases every birth cache. */
function releasePluginCacheInstance(instance, cache) {
	const owners = instanceCacheOwners.get(instance);
	if (cache) {
		cache.instances.delete(instance);
		owners?.delete(cache);
	} else {
		for (const owner of owners ?? []) owner.instances.delete(instance);
		owners?.clear();
	}
	if (owners?.size === 0) instanceCacheOwners.delete(instance);
}
function getPluginCacheRetainers(cache) {
	let retained = cacheRetainers.get(cache);
	if (!retained) {
		retained = {
			references: /* @__PURE__ */ new Set(),
			controller: new AbortController(),
			settled: createDeferredCore()
		};
		cacheRetainers.set(cache, retained);
	}
	return retained;
}
function createPluginMetadataCache() {
	return {
		current: {
			snapshot: void 0,
			owner: "operation",
			configFingerprint: void 0,
			agentWorkspaceFingerprint: void 0,
			envFingerprint: void 0,
			defaultDiscoveryCompatible: false,
			compatiblePolicyHashes: void 0,
			compatibleConfigFingerprints: void 0,
			revision: Symbol("plugin-metadata-snapshot"),
			configIdentities: /* @__PURE__ */ new WeakSet()
		},
		snapshots: /* @__PURE__ */ new Map(),
		discovery: /* @__PURE__ */ new Map(),
		sharedDiscovery: /* @__PURE__ */ new Map(),
		projections: /* @__PURE__ */ new WeakMap(),
		projectionSources: /* @__PURE__ */ new WeakMap(),
		completions: /* @__PURE__ */ new WeakMap(),
		indexFacts: /* @__PURE__ */ new WeakMap(),
		providerPolicyOwners: /* @__PURE__ */ new WeakMap(),
		channelAdapters: /* @__PURE__ */ new WeakMap(),
		bundledChannelCatalogs: /* @__PURE__ */ new Map(),
		bundledProviderPolicySurfaces: /* @__PURE__ */ new Map(),
		staticCatalogStates: /* @__PURE__ */ new WeakMap(),
		modelSuppressionResolvers: /* @__PURE__ */ new WeakMap()
	};
}
/** Each inventory owns its acquired facts and reusable load results; publication owns activation. */
function createPluginCache(options = {}) {
	return {
		async [Symbol.asyncDispose]() {
			await retirePluginCache(this);
		},
		kind: options.kind ?? "operation",
		roots: /* @__PURE__ */ new Map(),
		rootAliases: /* @__PURE__ */ new Map(),
		sdk: createPluginCacheSdk(),
		setupModules: /* @__PURE__ */ new Map(),
		instances: /* @__PURE__ */ new Set(),
		metadata: createPluginMetadataCache(),
		installRecords: /* @__PURE__ */ new Map(),
		persistedInstalledIndex: /* @__PURE__ */ new Map(),
		preparedBundledDiscoveryModes: /* @__PURE__ */ new Map(),
		dependencyStatus: /* @__PURE__ */ new WeakMap(),
		...createPluginCacheArtifacts()
	};
}
function getProcessPluginCache() {
	return state.current ??= createPluginCache({ kind: "process" });
}
function getScopedPluginCache() {
	return getPluginExecutionFrame()?.cacheScope?.cache;
}
function getPluginCache() {
	return getScopedPluginCache() ?? getProcessPluginCache();
}
/** Stop new setup calls immediately; the owner awaits in-flight calls and graph cleanup. */
function retirePluginCache(cache, beforeRetire) {
	const retained = getPluginCacheRetainers(cache);
	if (retained.retirement) return retained.retirement;
	const completion = createDeferredCore();
	retained.retirement = completion.promise;
	const trackRetirement = async (run) => {
		const work = new AsyncWorkScope();
		try {
			return await work.track(run);
		} finally {
			await work.run(() => work.drain());
		}
	};
	retained.beginRetirement = (track = trackAsyncWork) => {
		let admitted = false;
		track(() => {
			admitted = true;
			retained.beginRetirement = void 0;
			return beginPluginCacheRetirement(cache, beforeRetire);
		}).then(completion.resolve, (error) => {
			if (admitted) completion.reject(error);
			else retained.beginRetirement?.(trackRetirement);
		});
	};
	retained.controller.abort();
	materializePluginCacheError(retained.controller.signal.reason);
	if (retained.references.size === 0) retained.beginRetirement?.();
	else retained.settled.promise.then(() => {
		retained.beginRetirement?.(trackRetirement);
	});
	return completion.promise;
}
function beginPluginCacheRetirement(cache, beforeRetire) {
	if (cache.retirement) return cache.retirement;
	const retirement = createDeferredCore();
	cache.retirement = retirement.promise;
	const cleanup = async () => {
		beforeRetire?.();
		const registries = cache.retireRegistryLoads?.();
		const resources = /* @__PURE__ */ new Set([...cache.setupModules.values(), ...cache.instances]);
		for (const resource of resources) resource.quiesce();
		const [registry] = await Promise.allSettled([registries]);
		const outcomes = await Promise.allSettled([...resources].map(async (resource) => ({
			resource,
			result: await resource.dispose()
		})));
		cache.setupModules.clear();
		for (const instance of cache.instances) releasePluginCacheInstance(instance, cache);
		const unexpected = [...registry.status === "rejected" ? [registry.reason] : [], ...outcomes.flatMap((result) => result.status === "rejected" ? [result.reason] : [])];
		if (unexpected.length) throw new AggregateError(unexpected, "Plugin cache resources failed to retire");
		const host = registry.status === "fulfilled" ? registry.value : void 0;
		const failures = [...host?.failures ?? []];
		for (const outcome of outcomes) {
			if (outcome.status !== "fulfilled") continue;
			const { resource, result } = outcome.value;
			appendPluginInstanceCleanupFailures(failures, resource.pluginId, result);
		}
		return {
			cleanupCount: host?.cleanupCount ?? 0,
			failures
		};
	};
	cleanup().then(retirement.resolve, retirement.reject);
	return retirement.promise;
}
var state, cacheRetainers, instanceCacheOwners;
var init_plugin_cache = __esmMin((() => {
	init_async_work_scope();
	init_deferred();
	init_global_singleton();
	init_host_hook_cleanup_result();
	init_plugin_cache_artifacts();
	init_plugin_cache_sdk();
	init_plugin_instance_invocation();
	state = resolveGlobalSingleton(Symbol.for("openclaw.pluginCache"), () => ({
		snapshotOwners: /* @__PURE__ */ new WeakMap(),
		retirements: []
	}));
	cacheRetainers = resolveGlobalSingleton(Symbol.for("openclaw.pluginCacheRetainers"), () => /* @__PURE__ */ new WeakMap());
	instanceCacheOwners = resolveGlobalSingleton(Symbol.for("openclaw.pluginInstanceCacheOwners"), () => /* @__PURE__ */ new WeakMap());
}));
//#endregion
//#region src/infra/openclaw-root.fs.runtime.ts
var init_openclaw_root_fs_runtime = __esmMin((() => {}));
//#endregion
//#region src/infra/openclaw-root.ts
function parsePackageName(raw) {
	const parsed = JSON.parse(raw);
	return typeof parsed.name === "string" ? parsed.name : null;
}
function readPackageNameSync(dir) {
	const packageNameCache = getPluginCache().sdk.packageNames;
	const packageJsonPath = path.join(path.resolve(dir), "package.json");
	if (packageNameCache.has(packageJsonPath)) return packageNameCache.get(packageJsonPath) ?? null;
	try {
		const name = parsePackageName(openClawRootFsSync.readFileSync(packageJsonPath, "utf-8"));
		packageNameCache.set(packageJsonPath, name);
		return name;
	} catch {
		packageNameCache.set(packageJsonPath, null);
		return null;
	}
}
function findPackageRootSync(startDir, maxDepth = 12) {
	for (const current of iterAncestorDirs(startDir, maxDepth)) {
		const name = readPackageNameSync(current);
		if (name && CORE_PACKAGE_NAMES.has(name)) return current;
	}
	return null;
}
function* iterAncestorDirs(startDir, maxDepth) {
	let current = path.resolve(startDir);
	for (let i = 0; i < maxDepth; i += 1) {
		yield current;
		if (path.basename(current) === "node_modules") break;
		const parent = path.dirname(current);
		if (parent === current) break;
		current = parent;
	}
}
function candidateDirsFromArgv1(argv1) {
	const argv1CandidateCache = getPluginCache().sdk.argvDirectories;
	const cacheKey = path.resolve(argv1);
	const cached = argv1CandidateCache.get(cacheKey);
	if (cached) return [...cached];
	const normalized = path.resolve(argv1);
	const candidates = [];
	try {
		const resolved = openClawRootFsSync.realpathSync(normalized);
		if (resolved !== normalized) candidates.push(path.dirname(resolved));
	} catch {}
	candidates.push(path.dirname(normalized));
	const parts = normalized.split(path.sep);
	const binIndex = parts.lastIndexOf(".bin");
	if (binIndex > 0 && parts[binIndex - 1] === "node_modules") {
		const binName = path.basename(normalized);
		const nodeModulesDir = parts.slice(0, binIndex).join(path.sep);
		candidates.push(path.join(nodeModulesDir, binName));
	}
	const deduped = dedupeCandidates(candidates);
	argv1CandidateCache.set(cacheKey, deduped);
	return [...deduped];
}
function resolveOpenClawPackageRootSync(opts) {
	const candidates = buildCandidates(opts);
	const cacheKey = createPackageRootCacheKey(candidates);
	const searches = getPluginCache().sdk.packageSearches;
	const cached = searches.get(cacheKey);
	if (cached?.all) return cached.all[0] ?? null;
	if (cached?.first !== void 0) return cached.first;
	for (const candidate of candidates) {
		const found = findPackageRootSync(candidate);
		if (found) {
			searches.set(cacheKey, { first: found });
			return found;
		}
	}
	searches.set(cacheKey, { first: null });
	return null;
}
function buildCandidates(opts) {
	const candidates = [];
	if (opts.moduleUrl) try {
		candidates.push(path.dirname(fileURLToPath(opts.moduleUrl)));
	} catch {}
	if (opts.argv1) candidates.push(...candidateDirsFromArgv1(opts.argv1));
	if (opts.cwd) candidates.push(opts.cwd);
	return dedupeCandidates(candidates);
}
function dedupeCandidates(candidates) {
	const seen = /* @__PURE__ */ new Set();
	const deduped = [];
	for (const candidate of candidates) {
		const resolved = path.resolve(candidate);
		if (seen.has(resolved)) continue;
		seen.add(resolved);
		deduped.push(resolved);
	}
	return deduped;
}
function createPackageRootCacheKey(candidates) {
	return candidates.join("\0");
}
var CORE_PACKAGE_NAMES;
var init_openclaw_root = __esmMin((() => {
	init_plugin_cache();
	init_openclaw_root_fs_runtime();
	CORE_PACKAGE_NAMES = /* @__PURE__ */ new Set(["openclaw"]);
}));
//#endregion
//#region src/infra/git-commit.ts
/** Resolve the commit that produced the loaded artifact, not the checkout's current revision. */
function resolveLoadedCommitHash(options = {}) {
	const moduleUrl = options.moduleUrl ?? import.meta.url;
	const loaded = readLoadedCommit(moduleUrl);
	return loaded === void 0 ? resolveCommitHash({
		moduleUrl,
		...options.env ? { env: options.env } : {}
	}) : loaded;
}
var formatCommit, cachedGitCommitBySearchDir, GIT_COMMIT_CACHE_LIMIT, resolveCommitSearchDir, cacheGitCommit, resolveGitLookupDepth, readCommitFromGit, readCommitFromPackageJson, readCommitProbe, readCommitFromBuildInfo, readLoadedCommit, resolveCommitHash;
var init_git_commit = __esmMin((() => {
	init_record_coerce();
	init_string_coerce();
	init_errors();
	init_git_root();
	init_map_size();
	init_openclaw_root();
	formatCommit = (value) => {
		if (!value) return null;
		const trimmed = value.trim();
		if (!trimmed) return null;
		const match = trimmed.match(/[0-9a-fA-F]{7,40}/);
		if (!match) return null;
		return normalizeLowercaseStringOrEmpty(match[0].slice(0, 7));
	};
	cachedGitCommitBySearchDir = /* @__PURE__ */ new Map();
	GIT_COMMIT_CACHE_LIMIT = 256;
	resolveCommitSearchDir = (options) => {
		if (options.cwd) return path.resolve(options.cwd);
		if (options.moduleUrl) try {
			return path.dirname(fileURLToPath(options.moduleUrl));
		} catch {}
		return process.cwd();
	};
	cacheGitCommit = (searchDir, commit) => {
		cachedGitCommitBySearchDir.set(searchDir, commit);
		pruneMapToMaxSize(cachedGitCommitBySearchDir, GIT_COMMIT_CACHE_LIMIT);
		return commit;
	};
	resolveGitLookupDepth = (searchDir, packageRoot) => {
		if (!packageRoot) return;
		const relative = path.relative(packageRoot, searchDir);
		if (relative.startsWith("..") || path.isAbsolute(relative)) return;
		return (relative ? relative.split(path.sep).filter(Boolean).length : 0) + 1;
	};
	readCommitFromGit = (searchDir, packageRoot) => {
		const head = readGitHead(searchDir, { maxDepth: resolveGitLookupDepth(searchDir, packageRoot) });
		return head === void 0 ? void 0 : formatCommit(head.value);
	};
	readCommitFromPackageJson = () => {
		try {
			const pkg = createRequire(import.meta.url)("../../package.json");
			return formatCommit(pkg.gitHead ?? pkg.githead ?? null);
		} catch {
			return null;
		}
	};
	readCommitProbe = (moduleUrl, candidates, field) => {
		try {
			for (const candidate of candidates) {
				const filePath = fileURLToPath(new URL(candidate, moduleUrl));
				let raw;
				try {
					raw = readGitMetadataPrefix(filePath, 1024);
				} catch (error) {
					if (isMissingPathError(error)) continue;
					return null;
				}
				try {
					const value = asNullableRecord(JSON.parse(raw))?.[field];
					return typeof value === "string" ? formatCommit(value) : null;
				} catch {
					return null;
				}
			}
		} catch {}
	};
	readCommitFromBuildInfo = (moduleUrl = import.meta.url) => {
		return readCommitProbe(moduleUrl, ["../build-info.json", "./build-info.json"], "commit") ?? null;
	};
	readLoadedCommit = (moduleUrl) => {
		const buildStamp = readCommitProbe(moduleUrl, ["../.buildstamp", "./.buildstamp"], "head");
		const runtimeStamp = readCommitProbe(moduleUrl, ["../.runtime-postbuildstamp", "./.runtime-postbuildstamp"], "head");
		if (buildStamp !== void 0 || runtimeStamp !== void 0) {
			if (buildStamp || runtimeStamp) return buildStamp && buildStamp === runtimeStamp ? buildStamp : null;
			return readCommitFromBuildInfo(moduleUrl);
		}
		return readCommitProbe(moduleUrl, ["../build-info.json", "./build-info.json"], "commit");
	};
	resolveCommitHash = (options = {}) => {
		const env = options.env ?? process.env;
		const readers = options.readers ?? {};
		const readGitCommit = readers.readGitCommit ?? readCommitFromGit;
		const envCommit = env.GIT_COMMIT?.trim() || env.GIT_SHA?.trim();
		const normalized = formatCommit(envCommit);
		if (normalized) return normalized;
		const searchDir = resolveCommitSearchDir(options);
		if (cachedGitCommitBySearchDir.has(searchDir)) {
			const cached = cachedGitCommitBySearchDir.get(searchDir) ?? null;
			cachedGitCommitBySearchDir.delete(searchDir);
			cachedGitCommitBySearchDir.set(searchDir, cached);
			return cached;
		}
		const packageRoot = resolveOpenClawPackageRootSync({
			cwd: options.cwd,
			moduleUrl: options.moduleUrl
		});
		try {
			const gitCommit = readGitCommit(searchDir, packageRoot);
			if (gitCommit !== void 0) return cacheGitCommit(searchDir, gitCommit);
		} catch {}
		const buildInfoCommit = readers.readBuildInfoCommit?.() ?? readCommitFromBuildInfo();
		if (buildInfoCommit) return cacheGitCommit(searchDir, buildInfoCommit);
		const pkgCommit = readers.readPackageJsonCommit?.() ?? readCommitFromPackageJson();
		if (pkgCommit) return cacheGitCommit(searchDir, pkgCommit);
		try {
			return cacheGitCommit(searchDir, readGitCommit(searchDir, packageRoot) ?? null);
		} catch {
			return cacheGitCommit(searchDir, null);
		}
	};
}));
//#endregion
//#region src/version.ts
function readVersionFromJsonCandidates(moduleUrl, candidates, opts = {}) {
	try {
		const require = createRequire(moduleUrl);
		for (const candidate of candidates) try {
			const parsed = require(candidate);
			const version = normalizeOptionalString(parsed.version);
			if (!version) continue;
			if (opts.requirePackageName && parsed.name !== CORE_PACKAGE_NAME) continue;
			return version;
		} catch {}
		return null;
	} catch {
		return null;
	}
}
function readBuildIdFromJsonCandidates(moduleUrl) {
	try {
		const require = createRequire(moduleUrl);
		for (const candidate of BUILD_INFO_CANDIDATES) try {
			const buildId = normalizeOptionalString(require(candidate).buildId);
			if (buildId && buildId.length <= 96) return buildId;
		} catch {}
		return null;
	} catch {
		return null;
	}
}
function firstNonEmpty(...values) {
	for (const value of values) {
		const trimmed = normalizeOptionalString(value);
		if (trimmed && trimmed.toLowerCase() !== "undefined" && trimmed.toLowerCase() !== "null") return trimmed;
	}
}
function readVersionFromPackageJsonForModuleUrl(moduleUrl) {
	return readVersionFromJsonCandidates(moduleUrl, PACKAGE_JSON_CANDIDATES, { requirePackageName: true });
}
function readVersionFromBuildInfoForModuleUrl(moduleUrl) {
	return readVersionFromJsonCandidates(moduleUrl, BUILD_INFO_CANDIDATES);
}
function readBuildIdFromBuildInfoForModuleUrl(moduleUrl) {
	return readBuildIdFromJsonCandidates(moduleUrl);
}
function resolveVersionFromModuleUrl(moduleUrl) {
	return readVersionFromBuildInfoForModuleUrl(moduleUrl) || readVersionFromPackageJsonForModuleUrl(moduleUrl);
}
function resolveBinaryVersion(params) {
	return resolveVersionFromModuleUrl(params.moduleUrl) || firstNonEmpty(params.bundledVersion) || params.fallback || "0.0.0";
}
var CORE_PACKAGE_NAME, PACKAGE_JSON_CANDIDATES, BUILD_INFO_CANDIDATES;
var init_version = __esmMin((() => {
	init_string_coerce();
	init_git_commit();
	CORE_PACKAGE_NAME = "openclaw";
	PACKAGE_JSON_CANDIDATES = [
		"../package.json",
		"../../package.json",
		"../../../package.json",
		"./package.json"
	];
	BUILD_INFO_CANDIDATES = [
		"../build-info.json",
		"../../build-info.json",
		"./build-info.json"
	];
	readBuildIdFromBuildInfoForModuleUrl(import.meta.url);
	resolveLoadedCommitHash({ moduleUrl: import.meta.url });
	resolveBinaryVersion({
		moduleUrl: import.meta.url,
		bundledVersion: process.env.OPENCLAW_BUNDLED_VERSION
	});
}));
//#endregion
//#region src/infra/sqlite-user-version.ts
function readSqliteUserVersion(db) {
	const row = db.prepare("PRAGMA user_version").get();
	return Number(row?.user_version ?? 0);
}
var init_sqlite_user_version = __esmMin((() => {
	init_openclaw_state_db_contract();
	init_version();
	init_openclaw_root();
}));
var init_sqlite_number = __esmMin((() => {
	BigInt(Number.MAX_SAFE_INTEGER);
}));
var init_sqlite_wal_checkpoint = __esmMin((() => {
	init_global_singleton();
	init_errors();
	init_sqlite_number();
	init_sqlite_reader_lifecycle();
	resolveGlobalSingleton(Symbol.for("openclaw.sqliteWalCheckpointListeners"), () => /* @__PURE__ */ new Set());
}));
//#endregion
//#region src/infra/sqlite-wal-reclamation.ts
var init_sqlite_wal_reclamation = __esmMin((() => {
	init_sqlite_error_diagnostics();
	init_sqlite_transaction();
}));
var init_sqlite_wal_write_admission = __esmMin((() => {
	init_global_singleton();
	init_sqlite_transaction();
	resolveGlobalSingleton(Symbol.for("openclaw.sqliteWalWriteAdmissions"), () => /* @__PURE__ */ new WeakMap());
}));
//#endregion
//#region src/infra/sqlite-wal.ts
function detachEmptySqliteExitGroup(group) {
	if (group.pending.size > 0) return;
	if (lastSqliteExitGroup === group) lastSqliteExitGroup = void 0;
	process.removeListener("exit", group.dispatch);
}
/**
* Register a best-effort exit-time close for a SQLite handle cache. Returns an
* unregister callback the cache's orderly close path must invoke, so tests and
* runtime shutdowns do not accumulate listeners on shared worker processes.
*/
function registerSqliteCacheExitClose(closeAll) {
	const registration = {
		close: closeAll,
		fired: false
	};
	let group = lastSqliteExitGroup;
	if (!group || process.listeners("exit").at(-1) !== group.dispatch) {
		const pending = /* @__PURE__ */ new Set([registration]);
		const created = {
			pending,
			dispatch: () => {
				const snapshot = [...pending];
				for (const entry of snapshot) {
					if (entry.fired) continue;
					entry.fired = true;
					pending.delete(entry);
					detachEmptySqliteExitGroup(created);
					try {
						entry.close();
					} catch {}
				}
			}
		};
		process.on("exit", created.dispatch);
		lastSqliteExitGroup = group = created;
	} else group.pending.add(registration);
	const owner = group;
	return () => {
		owner.pending.delete(registration);
		detachEmptySqliteExitGroup(owner);
	};
}
var runInSqliteMaintenanceContext, lastSqliteExitGroup;
var init_sqlite_wal = __esmMin((() => {
	init_number_coercion();
	init_subsystem();
	init_sqlite_error_diagnostics();
	init_sqlite_wal_checkpoint();
	init_sqlite_wal_reclamation();
	init_sqlite_wal_write_admission();
	new Int32Array(new SharedArrayBuffer(4));
	createSubsystemLogger("infra/sqlite-wal");
	runInSqliteMaintenanceContext = AsyncLocalStorage.snapshot();
}));
//#endregion
//#region src/infra/sqlite-schema-header.ts
init_openclaw_state_db_contract();
init_kysely_sync();
init_node_sqlite();
init_sqlite_coordinator();
init_sqlite_transaction();
init_sqlite_user_version();
init_sqlite_wal();
//#endregion
//#region src/infra/sqlite-snapshot-policy.ts
init_logger();
init_errno();
const SNAPSHOT_RETRY_BASE_MS = 10;
const SNAPSHOT_RETRY_MAX_MS = 80;
function sourceFileSize(pathname) {
	try {
		const stat = fs.statSync(pathname);
		return stat.isFile() ? stat.size : 0;
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return 0;
		throw error;
	}
}
function abortReason(signal) {
	return signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("SQLite snapshot aborted");
}
async function sleepForSnapshot(ms, signal) {
	signal?.throwIfAborted();
	await new Promise((resolve, reject) => {
		const timer = setTimeout(finish, ms);
		const abort = () => finish(signal ? abortReason(signal) : void 0);
		function finish(error) {
			clearTimeout(timer);
			signal?.removeEventListener("abort", abort);
			if (error) reject(error);
			else resolve();
		}
		signal?.addEventListener("abort", abort, { once: true });
		if (signal?.aborted) abort();
	});
}
function snapshotRetryDelayMs(attempt) {
	if (attempt + 1 >= 10) return 0;
	return Math.min(SNAPSHOT_RETRY_MAX_MS, SNAPSHOT_RETRY_BASE_MS * 2 ** attempt);
}
function waitForSnapshotRetrySync(attempt) {
	const delayMs = snapshotRetryDelayMs(attempt);
	if (delayMs > 0) Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, delayMs);
}
async function waitForSnapshotRetry(attempt, signal) {
	signal?.throwIfAborted();
	const delayMs = snapshotRetryDelayMs(attempt);
	if (delayMs > 0) await sleepForSnapshot(delayMs, signal);
}
function createSnapshotAttemptReporter(pathname, attempt, started) {
	return (operation, outcome, prepared, error) => {
		try {
			getChildLogger({ subsystem: "infra/sqlite-snapshot" }).debug({
				attempt: attempt + 1,
				copiedBytes: prepared ? fs.statSync(prepared.location).size : 0,
				durationMs: Math.max(0, performance.now() - started),
				operation,
				outcome,
				sourceMainBytes: sourceFileSize(pathname),
				sourceWalBytes: sourceFileSize(`${pathname}-wal`),
				owner: "path-reader",
				errorCode: error && typeof error === "object" && "code" in error ? String(error.code) : void 0
			}, "SQLite snapshot operation completed.");
		} catch {}
	};
}
//#endregion
//#region src/daemon/runtime-binary.ts
function normalizeRuntimeBasename(execPath) {
	const trimmed = execPath.trim().replace(/^["']|["']$/g, "");
	const lastSlash = Math.max(trimmed.lastIndexOf("/"), trimmed.lastIndexOf("\\"));
	return (lastSlash === -1 ? trimmed : trimmed.slice(lastSlash + 1)).trim().toLowerCase();
}
/** Returns whether an executable path names a Bun runtime binary. */
function isBunRuntime(execPath) {
	const base = normalizeRuntimeBasename(execPath);
	return base === "bun" || base === "bun.exe";
}
var init_runtime_binary = __esmMin((() => {}));
//#endregion
//#region src/infra/runtime-worker-url.ts
/** Resolve an explicit installed root, source sibling, or stable packaged worker path. */
function resolveRuntimeWorkerUrl(params) {
	if (params.root !== void 0) return pathToFileURL(path.join(params.root, "dist", params.distWorkerPath));
	const currentPath = fileURLToPath(params.currentModuleUrl);
	const distIndex = currentPath.replaceAll(path.sep, "/").lastIndexOf("/dist/");
	if (distIndex >= 0) {
		const distRoot = currentPath.slice(0, distIndex + 6);
		let workerPath = params.distWorkerPath;
		if (params.package) {
			const packageRoot = path.resolve(distRoot, "..");
			const manifest = readRootJsonObjectSync({
				rootDir: packageRoot,
				relativePath: "package.json",
				boundaryLabel: "runtime worker package",
				rejectHardlinks: false
			});
			if (!manifest.ok) throw new Error(`Cannot resolve runtime worker package: ${packageRoot}/package.json`);
			if (manifest.value.name === params.package.name) workerPath = params.package.distWorkerPath;
		}
		return pathToFileURL(path.join(distRoot, workerPath));
	}
	const extension = path.extname(currentPath) || ".js";
	return new URL(`./${params.sourceWorkerName}${extension}`, params.currentModuleUrl);
}
function resolveRuntimeWorkerArgv(url, execPath = process.execPath) {
	const entry = fileURLToPath(url);
	return /\.[cm]?ts$/.test(entry) && !isBunRuntime(execPath) ? [
		"--import",
		import.meta.resolve("tsx"),
		entry
	] : [entry];
}
var init_runtime_worker_url = __esmMin((() => {
	init_runtime_binary();
}));
//#endregion
//#region src/process/spawn-broker/protocol.ts
function serializeBrokerError(error) {
	return {
		message: error.message,
		code: error.code,
		errno: error.errno,
		syscall: error.syscall,
		path: error.path
	};
}
var SpawnBrokerError;
var init_protocol = __esmMin((() => {
	SpawnBrokerError = class extends Error {
		constructor(message, options) {
			super(message, options);
			this.code = "ERR_SPAWN_BROKER_UNAVAILABLE";
			this.name = "SpawnBrokerError";
		}
	};
}));
//#endregion
//#region src/process/spawn-broker/pipe.ts
/** Publish stream data and EOF after the caller's readiness continuation. */
function releasePipe(socket) {
	const held = restoreReader(socket);
	if (!held) return;
	process.nextTick(() => {
		if (socket.destroyed) return;
		socket.emit("readable");
		if (held.resumed) socket.resume();
	});
}
function restoreReader(socket) {
	const held = readers.get(socket);
	if (!held) return;
	socket.read = held.read;
	readers.delete(socket);
	socket.removeListener("resume", held.onResume);
	socket.removeListener("readable", holdReadable);
	return held;
}
var readers, holdReadable;
var init_pipe = __esmMin((() => {
	readers = /* @__PURE__ */ new WeakMap();
	holdReadable = () => {};
}));
//#endregion
//#region src/process/spawn-broker/child.ts
var BrokerChild;
var init_child = __esmMin((() => {
	init_error_coercion();
	init_deferred();
	init_pipe();
	init_protocol();
	BrokerChild = class extends EventEmitter {
		constructor(requestId, argv, transmit) {
			super();
			this.requestId = requestId;
			this.transmit = transmit;
			this.callbackContext = new AsyncResource("OpenClawSpawnBrokerChild");
			this.stdin = null;
			this.stdout = null;
			this.stderr = null;
			this.connected = false;
			this.killed = false;
			this.exitCode = null;
			this.signalCode = null;
			this.stdio = [
				null,
				null,
				null,
				null,
				null
			];
			this.opened = createDeferredCore();
			this.completion = createDeferredCore();
			this.pipes = /* @__PURE__ */ new Set();
			this.sends = /* @__PURE__ */ new Map();
			this.sendSequence = 0;
			this.spawnReceived = false;
			this.eventsReleased = false;
			this.pendingEventOverflow = false;
			this.pendingEvents = [];
			this.exited = false;
			this.closed = false;
			this.processNotStarted = false;
			this.spawnfile = argv[0];
			this.spawnargs = [...argv];
			this.opened.promise.catch(() => {});
			this.on("error", () => {});
		}
		/** Only the admission owner can establish that no native process was started. */
		markNotStarted() {
			this.processNotStarted = true;
		}
		get notStarted() {
			return this.processNotStarted;
		}
		ready() {
			return this.opened.promise;
		}
		emit(event, ...args) {
			return this.callbackContext.runInAsyncScope(() => super.emit(event, ...args));
		}
		/** Transport bookkeeping survives disposal of the caller's event listeners. */
		waitForClose() {
			return this.completion.promise;
		}
		attachPipe(fd, socket) {
			socket.emit = this.callbackContext.bind(socket.emit.bind(socket));
			this.stdio[fd] = socket;
			if (fd === 0) this.stdin = socket;
			if (fd === 1) this.stdout = socket;
			if (fd === 2) this.stderr = socket;
			this.pipes.add(socket);
			let acknowledged = false;
			const acknowledge = (error) => {
				if (acknowledged) return;
				acknowledged = true;
				this.transmit({
					type: "output-drained",
					id: this.requestId,
					fd,
					error: error ? serializeBrokerError(error) : void 0
				}).catch(() => {});
			};
			socket.once(fd === 0 ? "finish" : "end", () => acknowledge());
			socket.on("error", acknowledge);
			socket.once("close", () => {
				acknowledge();
				this.pipes.delete(socket);
				this.finishClose();
			});
		}
		receive(message) {
			if (message.type === "spawned") {
				if (this.spawnReceived || this.closed) return;
				this.spawnReceived = true;
				this.pid = message.pid;
				this.spawnfile = message.spawnfile;
				this.spawnargs = message.spawnargs;
				this.connected = message.connected;
				this.stdio.splice(message.stdioLength);
				while (this.stdio.length < message.stdioLength) this.stdio.push(null);
				if (this.connected) this.channel = Object.assign(new EventEmitter(), {
					ref() {},
					unref() {}
				});
				this.opened.resolve();
				setImmediate(() => {
					if (this.closed) return;
					this.emit("spawn");
					setImmediate(() => {
						for (const [fd, pipe] of this.stdio.entries()) if (fd > 0 && pipe instanceof Socket && !pipe.destroyed) releasePipe(pipe);
						this.eventsReleased = true;
						for (const event of this.pendingEvents.splice(0)) event();
					});
				});
				return;
			}
			if (!this.eventsReleased && (this.spawnReceived || message.type !== "error")) {
				this.deferEvent(() => this.emitMessage(message));
				return;
			}
			this.emitMessage(message);
		}
		deferEvent(event) {
			if (this.pendingEventOverflow) return;
			if (this.pendingEvents.length >= 64) {
				this.pendingEventOverflow = true;
				this.pendingEvents.splice(0);
				this.pendingEvents.push(() => {
					this.kill("SIGKILL");
					this.failNow(new SpawnBrokerError("Spawn broker startup event capacity exceeded"));
				});
				return;
			}
			this.pendingEvents.push(event);
		}
		emitMessage(message) {
			switch (message.type) {
				case "error": {
					const error = Object.assign(new Error(message.error.message), message.error);
					this.opened.reject(error);
					this.emit("error", error);
					if (!this.pid) {
						this.exited = true;
						this.finishClose();
					}
					break;
				}
				case "exit":
					this.exited = true;
					this.exitCode = message.code;
					this.signalCode = message.signal;
					this.stdin?.destroy();
					this.emit("exit", message.code, message.signal);
					process.nextTick(() => {
						for (const pipe of this.pipes) if (pipe.readable) pipe.resume();
					});
					this.finishClose();
					break;
				case "ipc-sent":
					this.finishSend(message.sequence, message.error ? Object.assign(new Error(message.error.message), message.error) : null);
					break;
				case "disconnect":
					this.failSends(/* @__PURE__ */ new Error("Child process IPC channel is closed"));
					this.connected = false;
					this.channel = void 0;
					this.emit("disconnect");
					break;
				case "ipc":
					this.emit("message", message.message);
					break;
				case "closed": this.finishClose();
			}
		}
		fail(error) {
			if (this.spawnReceived && !this.eventsReleased) {
				this.deferEvent(() => this.failNow(error));
				return;
			}
			this.failNow(error);
		}
		failNow(error) {
			if (this.closed) return;
			this.opened.reject(error);
			this.failSends(error);
			const wasConnected = this.connected;
			this.connected = false;
			this.channel = void 0;
			if (wasConnected) this.emit("disconnect");
			if (!this.exited) this.emit("error", error);
			for (const pipe of this.pipes) pipe.destroy(error);
			this.exited = true;
			this.finishClose();
		}
		finishClose() {
			if (!this.exited || this.pipes.size > 0 || this.closed) return;
			this.closed = true;
			this.completion.resolve();
			this.emit("close", this.exitCode, this.signalCode);
		}
		kill(signal = "SIGTERM") {
			if (this.exited) return false;
			this.killed = true;
			this.transmit({
				type: "kill",
				id: this.requestId,
				signal
			}).catch((error) => this.fail(toErrorObject(error, "Spawn broker signal delivery failed")));
			return true;
		}
		send(message, handleOrCallback, optionsOrCallback, callback) {
			const done = typeof handleOrCallback === "function" ? handleOrCallback : typeof optionsOrCallback === "function" ? optionsOrCallback : callback;
			if (!this.connected) {
				const error = /* @__PURE__ */ new Error("Child process IPC channel is closed");
				queueMicrotask(() => done ? done(error) : this.emit("error", error));
				return false;
			}
			if (this.sends.size >= 1024) {
				const error = /* @__PURE__ */ new Error("Child process IPC capacity exceeded");
				queueMicrotask(() => done ? done(error) : this.emit("error", error));
				return false;
			}
			const sequence = ++this.sendSequence;
			this.sends.set(sequence, AsyncResource.bind((error) => {
				if (done) done(error);
				else if (error) this.emit("error", error);
			}));
			const handle = typeof handleOrCallback === "function" ? void 0 : handleOrCallback;
			this.transmit({
				type: "ipc",
				id: this.requestId,
				sequence,
				message
			}, handle).catch((error) => this.finishSend(sequence, toErrorObject(error, "Spawn broker IPC delivery failed")));
			return true;
		}
		finishSend(sequence, error) {
			const callback = this.sends.get(sequence);
			this.sends.delete(sequence);
			callback?.(error);
		}
		failSends(error) {
			for (const sequence of this.sends.keys()) this.finishSend(sequence, error);
		}
		disconnect() {
			if (!this.connected) return;
			this.connected = false;
			this.transmit({
				type: "disconnect",
				id: this.requestId
			}).catch((error) => this.fail(toErrorObject(error, "Spawn broker disconnect failed")));
		}
		ref() {}
		unref() {}
		[Symbol.dispose]() {
			this.kill("SIGTERM");
		}
	};
}));
//#endregion
//#region src/process/spawn-broker/context.ts
function getSpawnBroker() {
	return gatewayStartupDisabled ? void 0 : context.getStore();
}
var context, gatewayStartupDisabled;
var init_context = __esmMin((() => {
	context = new AsyncLocalStorage();
	gatewayStartupDisabled = false;
}));
//#endregion
//#region src/infra/node-compile-cache-env.ts
function compileCacheOwner() {
	return resolveGlobalSingleton(COMPILE_CACHE_BASE_KEY, () => ({}));
}
function resolveNodeCompileCacheEnv(env = process.env) {
	if (env.NODE_COMPILE_CACHE !== void 0 || env.NODE_DISABLE_COMPILE_CACHE !== void 0) return env;
	const directory = compileCacheOwner().baseDirectory;
	return directory ? {
		...env,
		NODE_COMPILE_CACHE: directory
	} : env;
}
var COMPILE_CACHE_BASE_KEY;
var init_node_compile_cache_env = __esmMin((() => {
	init_global_singleton();
	COMPILE_CACHE_BASE_KEY = Symbol.for("openclaw.nodeCompileCacheBase");
}));
//#endregion
//#region src/infra/sqlite-readonly-worker-protocol.ts
function isSqliteSnapshotStagingMode(mode) {
	return mode === "staging-create" || mode === "staging-create-legacy" || mode === "staging-reconcile" || mode === "staging-retire";
}
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
var SqliteReadOnlyInspectionContentionError, SQLITE_INSPECTION_CONTENTION_PREFIX, SQLITE_READONLY_STDERR_TAIL_CHARS;
var init_sqlite_readonly_worker_protocol = __esmMin((() => {
	init_utf16_slice();
	SqliteReadOnlyInspectionContentionError = class extends Error {};
	SQLITE_INSPECTION_CONTENTION_PREFIX = "Retryable SQLite inspection contention: ";
	SQLITE_READONLY_STDERR_TAIL_CHARS = 4e3;
}));
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
		if (isStderr) stderr = sliceUtf16Safe(stderr + data.toString("utf8"), -SQLITE_READONLY_STDERR_TAIL_CHARS);
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
var init_sqlite_readonly_worker_session = __esmMin((() => {
	init_utf16_slice();
	init_child();
	init_sqlite_readonly_worker_protocol();
}));
//#endregion
//#region src/infra/sqlite-readonly-worker.ts
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
/** A retained startup inspection is cancelled by its Gateway, not by its foreground wait. */
function isSqliteInspectionDeadlineOwnedByCaller() {
	return readOnlyWorkerScope.getStore()?.deadlineOwnedByCaller === true;
}
function sqliteReadOnlyWorkerRequestArgs(pathname, options) {
	return [
		options.mode,
		path.resolve(pathname),
		...options.stagingRoot ? [options.stagingRoot] : []
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
var SQLITE_INSPECTION_TIMEOUT_MS, SQLITE_INSPECTION_BYTES_PER_SECOND, log, readOnlyWorkerScope;
var init_sqlite_readonly_worker = __esmMin((() => {
	init_src$1();
	init_number_coercion();
	init_subsystem();
	init_context();
	init_errno();
	init_node_compile_cache_env();
	init_runtime_process_entrypoints();
	init_runtime_worker_url();
	init_sqlite_readonly_location_cleanup();
	init_sqlite_readonly_worker_session();
	SQLITE_INSPECTION_TIMEOUT_MS = 3e5;
	SQLITE_INSPECTION_BYTES_PER_SECOND = 33554432;
	log = createSubsystemLogger("state/sqlite");
	readOnlyWorkerScope = new AsyncLocalStorage();
}));
//#endregion
//#region src/infra/sqlite-snapshot-staging-owner.ts
var sqlite_snapshot_staging_owner_exports = /* @__PURE__ */ __exportAll({ allocateWorkerOwnedSqliteSnapshotDirectory: () => allocateWorkerOwnedSqliteSnapshotDirectory });
/** Private token connections share one process, never a copy/read worker permit. */
function createStagingOwner() {
	let worker;
	let directories = 0;
	let activeLaunch;
	let closing;
	let pending = Promise.resolve();
	function run(operation) {
		const result = pending.then(operation);
		pending = result.then(() => void 0, () => void 0);
		return result;
	}
	async function closeSession(current) {
		closing = current;
		await current.close();
		if (worker === current) worker = void 0;
		if (directories === 0) activeLaunch = void 0;
		closing = void 0;
	}
	async function session(launch) {
		if (closing) await closeSession(closing);
		if (activeLaunch && !isSameSqliteReadOnlyWorkerLaunch(activeLaunch, launch)) throw new Error("SQLite snapshot staging owner launch context changed; retire its snapshots before retrying");
		if (worker?.isRetired()) await closeSession(worker);
		worker ??= createScopedSqliteReadOnlyWorker({
			...launch,
			retainLifetime: false,
			retainOnOperationError: true
		});
		if (!worker.compatible(launch)) throw new Error("SQLite snapshot staging owner launch context changed; retire its snapshots before retrying");
		return worker;
	}
	async function retireToken(current, directory, launch) {
		let failure;
		if (!current.isRetired()) try {
			await current.run(directory, { mode: "staging-retire" });
			return current;
		} catch (error) {
			if (!current.isRetired()) throw error;
			failure = error;
		}
		try {
			await closeSession(current);
			const replacement = await session(launch);
			await replacement.run(directory, { mode: "staging-reconcile" });
			return replacement;
		} catch (error) {
			if (failure !== void 0) throw createSqliteLifecycleAggregateError([failure, error], "SQLite snapshot retirement and reconciliation failed", failure);
			throw error;
		}
	}
	return { async allocate(root, allowLegacyWorker, signal) {
		signal?.throwIfAborted();
		const launch = captureSqliteReadOnlyWorkerLaunch();
		return run(async () => {
			signal?.throwIfAborted();
			const current = await session(launch);
			let directory;
			try {
				signal?.throwIfAborted();
				const result = await current.run(root, { mode: allowLegacyWorker ? "staging-create-legacy" : "staging-create" });
				if (typeof result !== "string") throw new Error("SQLite snapshot staging owner returned an invalid directory");
				directory = result;
				activeLaunch ??= launch;
				directories++;
			} catch (error) {
				if (directories === 0) try {
					await closeSession(current);
				} catch (cleanupError) {
					throw createSqliteLifecycleAggregateError([error, cleanupError], "SQLite snapshot allocation and owner cleanup failed", error);
				}
				throw error;
			}
			let tokenRetired = false;
			let lastDirectory = false;
			let complete = false;
			let retirementSession = current;
			return {
				directory,
				retire: () => run(async () => {
					if (complete) return;
					if (!tokenRetired) {
						retirementSession = await retireToken(current, directory, launch);
						tokenRetired = true;
						lastDirectory = --directories === 0;
					}
					if (lastDirectory) await closeSession(retirementSession);
					complete = true;
				})
			};
		});
	} };
}
function allocateWorkerOwnedSqliteSnapshotDirectory(root, allowLegacyWorker, signal) {
	return resolveGlobalSingleton(Symbol.for("openclaw.sqliteSnapshotStagingOwner"), createStagingOwner).allocate(root, allowLegacyWorker, signal);
}
var init_sqlite_snapshot_staging_owner = __esmMin((() => {
	init_global_singleton();
	init_sqlite_coordinator();
	init_sqlite_readonly_worker_session();
	init_sqlite_readonly_worker();
}));
//#endregion
//#region src/infra/sqlite-snapshot-staging.ts
init_error_coercion();
init_logger();
init_errors();
init_sqlite_error_diagnostics();
init_sqlite_readonly_location_cleanup();
init_sqlite_snapshot_retirement();
const currentAgeMs = 9e5;
const reclamationByteBudget = 536870912;
function stagingParent(root) {
	const parent = path.basename(root) === "openclaw" ? path.dirname(root) : root;
	return isSqliteSnapshotStagingName(path.basename(parent)) ? parent : void 0;
}
function warn(message, error) {
	try {
		getChildLogger({ subsystem: "infra/sqlite-snapshot" }).warn({ errorCode: extractErrorCode(error) }, message);
	} catch {}
}
/** Reconcile only after the token process closed; active readers still fence reclamation. */
function reconcileSqliteSnapshotRetirement(directory) {
	drainPendingSqliteSnapshotTokens(directory);
	if (!fs.lstatSync(directory, { throwIfNoEntry: false })) return;
	const retirement = beginSqliteSnapshotRetirement(directory, { cutoff: Number.POSITIVE_INFINITY });
	try {
		retireSqliteSnapshotPayload(retirement);
	} finally {
		retirement.release();
	}
}
function* reclaimAbandonedSqliteSnapshots(root, report = warn) {
	if (stagingParent(root)) return;
	try {
		drainPendingSqliteSnapshotRootTokens(root, (error) => report("SQLite snapshot token close failed; retaining native cleanup custody.", error));
		let admittedBytes = 0;
		for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
			if (admittedBytes >= reclamationByteBudget) {
				report("Stopped SQLite snapshot reclamation: byte budget exhausted for this pass.");
				break;
			}
			const legacy = SQLITE_SNAPSHOT_LEGACY_MARKER.test(entry.name);
			if (!entry.isDirectory() || !isSqliteSnapshotStagingName(entry.name)) continue;
			const directory = path.join(root, entry.name);
			let retirement;
			try {
				retirement = beginSqliteSnapshotRetirement(directory, { cutoff: Date.now() - (legacy ? SQLITE_SNAPSHOT_LEGACY_AGE_MS : currentAgeMs) });
				const { bytes } = retirement;
				if (admittedBytes > 0 && bytes > reclamationByteBudget - admittedBytes) throw new Error("Snapshot reclamation byte budget exhausted for this pass");
				admittedBytes += bytes;
				retireSqliteSnapshotPayload(retirement);
				const claimed = path.join(root, `${legacy ? `openclaw-sqlite-readonly-${process.pid}-` : SQLITE_SNAPSHOT_PREFIX}${randomUUID()}`);
				fs.renameSync(directory, claimed);
				if (!removeTempDirectory(claimed)) throw new Error("Snapshot removal failed; check private cache permissions");
				report(`Reclaimed ${bytes} bytes of interrupted SQLite snapshot data.`);
			} catch (error) {
				report(`Skipped SQLite snapshot reclamation: ${formatErrorMessage(error)}`, error);
			} finally {
				try {
					retirement?.release();
				} catch (error) {
					report("SQLite snapshot token close failed; retaining native cleanup custody.", error);
				}
			}
			yield;
		}
	} catch (error) {
		report("SQLite snapshot reclamation failed; check private cache permissions.", error);
	}
}
function sqliteSnapshotStagingError(tempDir, cause, allocation = false) {
	markSqliteInspectionOperation(cause, "snapshot");
	for (let depth = 0, error = cause; depth < 8 && error instanceof Error; depth += 1) {
		const { code, errcode, path: errorPath } = error;
		if (allocation || ["ENOSPC", "EDQUOT"].includes(code ?? "") || typeof errcode === "number" && [
			13,
			778,
			1034,
			1290
		].includes(errcode) || `${errorPath ?? ""}${path.sep}`.startsWith(`${tempDir}${path.sep}`)) {
			const message = `${cause instanceof Error ? cause.message : String(cause)}${typeof errcode === "number" ? ` (SQLite errcode=${errcode})` : ""}; snapshot staging root ${allocation ? tempDir : path.dirname(tempDir)}: free disk space/quota or set XDG_CACHE_HOME to a writable filesystem`;
			return new Error(message, { cause });
		}
		error = error.cause;
	}
	return cause;
}
async function createSqliteSnapshotStagingDirectory(stagingRoot = resolvePrivateSqliteSnapshotStagingRoot(), allowLegacyWorker = false, signal, asynchronousCleanup = false) {
	signal?.throwIfAborted();
	try {
		return await allocateSqliteSnapshotStagingDirectory(stagingRoot, allowLegacyWorker, signal, asynchronousCleanup);
	} catch (error) {
		if (error instanceof SqliteSnapshotCleanupError || asynchronousCleanup && error instanceof AggregateError) throw error;
		signal?.throwIfAborted();
		throw sqliteSnapshotStagingError(stagingRoot, error, true);
	}
}
async function allocateSqliteSnapshotStagingDirectory(root = resolvePrivateSqliteSnapshotStagingRoot(), allowLegacyWorker = false, signal, asynchronousCleanup = false) {
	signal?.throwIfAborted();
	if (asynchronousCleanup) {
		const controller = new AbortController();
		return retainSnapshotWork((async () => {
			const { allocateWorkerOwnedSqliteSnapshotDirectory } = await Promise.resolve().then(() => (init_sqlite_snapshot_staging_owner(), sqlite_snapshot_staging_owner_exports));
			signal?.throwIfAborted();
			controller.signal.throwIfAborted();
			const owned = await allocateWorkerOwnedSqliteSnapshotDirectory(root, allowLegacyWorker, signal ? AbortSignal.any([signal, controller.signal]) : controller.signal);
			registerAsyncSnapshotTempDirectory(owned.directory, owned.retire);
			if (signal?.aborted || controller.signal.aborted) {
				if (!await removeTempDirectoryAsync(owned.directory)) throw new SqliteSnapshotCleanupError(`SQLite snapshot cleanup failed: ${owned.directory}`);
				signal?.throwIfAborted();
				controller.signal.throwIfAborted();
			}
			return owned.directory;
		})(), () => controller.abort(/* @__PURE__ */ new Error("SQLite snapshot allocation stopped")));
	}
	return createSqliteSnapshotStagingDirectorySync(root, allowLegacyWorker);
}
function createSqliteSnapshotStagingDirectorySync(root = resolvePrivateSqliteSnapshotStagingRoot(), allowLegacyWorker = false) {
	const owned = createSqliteSnapshotStagingTokenSync(root, allowLegacyWorker);
	registerSnapshotTempDirectory(owned.directory, owned.release);
	return owned.directory;
}
/** Token workers remove disposable payload under their own native retirement fences. */
function createSqliteSnapshotStagingTokenSync(root = resolvePrivateSqliteSnapshotStagingRoot(), allowLegacyWorker = false) {
	const parentDirectory = stagingParent(root);
	const parent = parentDirectory ? acquireSqliteSnapshotToken(parentDirectory, "read") : void 0;
	let directory;
	try {
		directory = createPrivateSqliteTempDirectorySync(root, allowLegacyWorker ? `openclaw-sqlite-readonly-${process.pid}-` : SQLITE_SNAPSHOT_PREFIX);
		return {
			directory,
			release: acquireSqliteSnapshotToken(directory, "create")
		};
	} catch (error) {
		if (directory) removeTempDirectory(directory);
		throw error;
	} finally {
		parent?.();
	}
}
//#endregion
//#region src/infra/sqlite-snapshot-wal-prefix.ts
const WAL_HEADER_BYTES = 32;
const COPY_BUFFER_BYTES = 1048576;
function readWalGeneration(descriptor) {
	const header = Buffer.alloc(WAL_HEADER_BYTES);
	if (readFileWindowFullySync(descriptor, header, 0) !== header.length) return;
	const magic = header.readUInt32BE(0);
	return magic === 931071618 || magic === 931071619 ? header : void 0;
}
function matchesCapturedWalPrefix(source, destination, bytes) {
	const copy = fs.openSync(destination, "r");
	try {
		const stat = fs.fstatSync(copy);
		if (!stat.isFile() || stat.size !== bytes) return false;
		const sourceBuffer = Buffer.allocUnsafe(Math.min(COPY_BUFFER_BYTES, bytes));
		const copyBuffer = Buffer.allocUnsafe(sourceBuffer.length);
		for (let position = 0; position < bytes; position += sourceBuffer.length) {
			const length = Math.min(sourceBuffer.length, bytes - position);
			const sourceWindow = sourceBuffer.subarray(0, length);
			const copyWindow = copyBuffer.subarray(0, length);
			if (readFileWindowFullySync(source, sourceWindow, position) !== length || readFileWindowFullySync(copy, copyWindow, position) !== length || !sourceWindow.equals(copyWindow)) return false;
		}
		return true;
	} finally {
		fs.closeSync(copy);
	}
}
/** Preserve source coordination bytes while SQLite interprets a bounded private WAL. */
function copySqliteWalPrefixSync(source, destination, copyMain, verifyMainCopy) {
	const generation = readWalGeneration(source);
	if (!generation) return;
	copyMain();
	const walBytes = fs.fstatSync(source).size;
	if (!Number.isSafeInteger(walBytes) || walBytes < generation.length) return false;
	const target = fs.openSync(destination, "wx", 384);
	try {
		const buffer = Buffer.allocUnsafe(Math.min(COPY_BUFFER_BYTES, walBytes));
		for (let position = 0; position < walBytes;) {
			const window = buffer.subarray(0, Math.min(buffer.length, walBytes - position));
			if (readFileWindowFullySync(source, window, position) !== window.length) return false;
			if (position === 0 && !window.subarray(0, generation.length).equals(generation)) return false;
			for (let offset = 0; offset < window.length;) {
				const written = fs.writeSync(target, window, offset, window.length - offset, position + offset);
				if (written <= 0) throw new Error("SQLite WAL snapshot write made no progress");
				offset += written;
			}
			position += window.length;
		}
		fs.fsyncSync(target);
	} finally {
		fs.closeSync(target);
	}
	return verifyMainCopy() && matchesCapturedWalPrefix(source, destination, walBytes) && readWalGeneration(source)?.equals(generation) === true;
}
//#endregion
//#region src/infra/state-database-coordinator-delegate.ts
init_global_singleton();
init_sqlite_coordinator();
resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseLifecycleDelegateScopes"), () => new AsyncLocalStorage());
//#endregion
//#region src/infra/state-database-coordinator-errors.ts
init_global_singleton();
init_sqlite_coordinator();
const StateDatabaseCoordinatorContentionError = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseCoordinatorContentionError"), () => class CoordinatorContentionError extends SqliteCoordinatorError {
	constructor(family) {
		super(`another OpenClaw process owns ${family}`);
		this.family = family;
		this.name = "StateDatabaseCoordinatorContentionError";
	}
});
resolveGlobalSingleton(Symbol.for("openclaw.stateSchemaMutationConflictError"), () => class SchemaMutationConflictError extends SqliteCoordinatorError {
	constructor(databasePath, cause) {
		super(`OpenClaw refused shared state schema mutation at ${databasePath} because another Gateway owns that state directory. Stop that Gateway or perform the update through its managed restart path, then retry.`, cause);
		this.name = "StateSchemaMutationConflictError";
	}
});
//#endregion
//#region packages/normalization-core/src/node-crypto.ts
function sha256Hex(input) {
	return hash("sha256", input, "hex");
}
function sha256HexPrefixCore(input, length) {
	return sha256Hex(input).slice(0, length);
}
//#endregion
//#region src/infra/state-database-coordinator-paths.ts
init_boundary_path();
function resolveCoordinatorIdentityPath(pathname) {
	const normalized = path.resolve(pathname);
	try {
		const resolved = path.resolve(realpathSync.native(normalized));
		if (process.platform !== "win32" || resolved === normalized) return resolved;
	} catch {}
	return resolvePathViaExistingAncestorSync$1(normalized);
}
function resolveLifecycleCoordinatorBase(params) {
	const canonicalDatabasePath = resolveCoordinatorIdentityPath(params.databasePath);
	const canonicalRuntimeDirectory = resolveCoordinatorIdentityPath(params.runtimeDirectory);
	const suffix = params.uid === void 0 ? "openclaw-state-locks" : `openclaw-state-locks-${params.uid}`;
	return {
		directory: path.join(canonicalRuntimeDirectory, suffix),
		databaseHash: sha256HexPrefixCore(canonicalDatabasePath, 8)
	};
}
function buildLifecycleCoordinatorPath(family, base) {
	return path.join(base.directory, `${family}.${base.databaseHash}.lock.sqlite`);
}
function resolveLifecycleCoordinatorPath(family, params) {
	return buildLifecycleCoordinatorPath(family, resolveLifecycleCoordinatorBase(params));
}
//#endregion
//#region src/infra/state-database-coordinator.ts
init_global_singleton();
init_sqlite_coordinator();
init_sqlite_error_diagnostics();
const { heldCoordinators, sourceReadScopes, canonicalWriteScopes, coordinatorRuntimeDirectories, gatewaySchemaScopes } = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseCoordinator"), () => ({
	heldCoordinators: /* @__PURE__ */ new Map(),
	sourceReadScopes: new AsyncLocalStorage(),
	canonicalWriteScopes: new AsyncLocalStorage(),
	coordinatorRuntimeDirectories: new AsyncLocalStorage(),
	gatewaySchemaScopes: new AsyncLocalStorage()
}));
function resolveStateLifecycleRuntimeDirectory() {
	const captured = coordinatorRuntimeDirectories.getStore();
	if (captured !== void 0) return captured.directory;
	return process.platform === "win32" ? path.join(os.homedir(), "AppData", "Local", "OpenClaw", "locks") : "/tmp";
}
function withStateDatabaseCoordinatorRuntimeDirectory(runtime, operation) {
	const captured = typeof runtime === "string" ? {
		directory: runtime,
		keepAlive: false
	} : { ...runtime };
	return coordinatorRuntimeDirectories.run(captured, operation);
}
const shouldKeepStateCoordinatorAlive = (params) => params.keepAlive !== false && params.coordinatorPath === void 0 && params.runtimeDirectory === void 0 && (coordinatorRuntimeDirectories.getStore()?.keepAlive ?? true);
function resolveStateDatabaseHandleReadContext(params) {
	const pathname = params.coordinatorPath ?? resolveLifecycleCoordinatorPath("state-handles", {
		databasePath: params.databasePath,
		runtimeDirectory: params.runtimeDirectory ?? resolveStateLifecycleRuntimeDirectory(),
		uid: params.uid ?? (typeof process.getuid === "function" ? process.getuid() : void 0)
	});
	const writeScope = canonicalWriteScopes.getStore()?.get(pathname);
	if (writeScope) {
		if (!writeScope.active) throw new SqliteCoordinatorError("SQLite binding write scope is no longer current");
		writeScope.assertCurrent();
		return {
			pathname,
			scope: writeScope
		};
	}
	const sourceScope = sourceReadScopes.getStore()?.get(pathname);
	if (sourceScope?.active) {
		sourceScope.assertCurrent();
		return {
			pathname,
			scope: sourceScope
		};
	}
	if (heldCoordinators.has(pathname)) throw new StateDatabaseCoordinatorContentionError("state-handles");
	return {
		pathname,
		scope: void 0
	};
}
/** A live cached connection excludes file publication, not other cached connections. */
function acquireStateDatabaseHandleLease(params) {
	const { pathname, scope } = resolveStateDatabaseHandleReadContext(params);
	if (scope) return scope.pin();
	return withSqliteInspectionOperation("coordinator", () => {
		ensurePrivateSqliteCoordinatorDirectory(path.dirname(pathname), "state-handles coordinator");
		const coordinator = tryAcquireSharedSqliteCoordinator(pathname, {
			busyTimeoutMs: params.busyTimeoutMs,
			keepAlive: shouldKeepStateCoordinatorAlive(params)
		});
		if (!coordinator) throw new StateDatabaseCoordinatorContentionError("state-handles");
		return coordinator;
	});
}
//#endregion
//#region src/infra/sqlite-source-handle.ts
init_node_sqlite();
init_sqlite_coordinator();
init_sqlite_error_diagnostics();
function withSqliteSourceHandle(pathname, operation) {
	return runWithSqliteCoordinator(acquireStateDatabaseHandleLease({
		databasePath: pathname,
		busyTimeoutMs: 0
	}), "SQLite source read", operation);
}
/** The executing source-copy child holds its own lease, including after parent loss. */
async function withSqliteSourceHandleAsync(pathname, operation) {
	const lease = acquireStateDatabaseHandleLease({
		databasePath: pathname,
		busyTimeoutMs: 0
	});
	let result;
	try {
		result = await operation();
	} catch (error) {
		try {
			lease.release();
		} catch (releaseError) {
			throw createSqliteLifecycleAggregateError([error, releaseError], "SQLite source read and handle release both failed", error);
		}
		throw error;
	}
	lease.release();
	return result;
}
//#endregion
//#region src/infra/sqlite-readonly-location.ts
init_fs_safe_advanced();
init_node_sqlite();
init_sqlite_coordinator();
init_sqlite_error_diagnostics();
init_sqlite_readonly_location_cleanup();
const SQLITE_HEADER_BYTES = 20;
const SQLITE_SOURCE_READ_BUSY_TIMEOUT_MS = 3e4;
const SQLITE_READONLY_RESULT_CODE = 8;
const SQLITE_RESULT_CODE_MASK = 255;
const SQLITE_JOURNAL_MAGIC = Buffer.from([
	217,
	213,
	5,
	249,
	32,
	161,
	99,
	215
]);
var SqliteSourceChangedError = class extends Error {};
function statIfPresent(pathname) {
	try {
		return fs.statSync(pathname, { bigint: true });
	} catch (error) {
		if (error.code === "ENOENT") return;
		throw error;
	}
}
function readSourceSidecars(pathname) {
	return {
		journal: Boolean(statIfPresent(`${pathname}-journal`)),
		shm: Boolean(statIfPresent(`${pathname}-shm`)),
		wal: Boolean(statIfPresent(`${pathname}-wal`))
	};
}
function sameSidecars(left, right) {
	return left.journal === right.journal && left.shm === right.shm && left.wal === right.wal;
}
function openPinnedFile(pathname) {
	let descriptor;
	try {
		descriptor = fs.openSync(pathname, "r");
	} catch (error) {
		if (error.code === "ENOENT") throw new SqliteSourceChangedError(`SQLite source disappeared: ${pathname}`);
		throw error;
	}
	try {
		const identity = fs.fstatSync(descriptor, { bigint: true });
		const current = statIfPresent(pathname);
		if (!identity.isFile() || !current?.isFile() || !sameFileIdentity(identity, current)) throw new SqliteSourceChangedError(`SQLite source changed while opening: ${pathname}`);
		return {
			descriptor,
			identity,
			pathname
		};
	} catch (error) {
		fs.closeSync(descriptor);
		throw error;
	}
}
function readSourceJournalMode(pathname) {
	const source = openPinnedFile(pathname);
	try {
		const header = Buffer.alloc(SQLITE_HEADER_BYTES);
		const bytesRead = fs.readSync(source.descriptor, header, 0, header.length, 0);
		const confirmedHeader = Buffer.alloc(SQLITE_HEADER_BYTES);
		const confirmedBytesRead = fs.readSync(source.descriptor, confirmedHeader, 0, confirmedHeader.length, 0);
		assertPinnedIdentityUnchanged(source);
		if (bytesRead === 0 && confirmedBytesRead === 0) return "empty";
		if (bytesRead !== header.length || confirmedBytesRead !== confirmedHeader.length || !header.equals(confirmedHeader) || header.subarray(0, 16).toString("utf8") !== "SQLite format 3\0") return "unknown";
		return header[18] === 2 || header[19] === 2 ? "wal" : "rollback";
	} finally {
		fs.closeSync(source.descriptor);
	}
}
function assertPinnedIdentityUnchanged(file) {
	const opened = fs.fstatSync(file.descriptor, { bigint: true });
	const current = statIfPresent(file.pathname);
	if (!opened.isFile() || !current?.isFile() || !sameFileIdentity(file.identity, opened) || !sameFileIdentity(file.identity, current)) throw new SqliteSourceChangedError(`SQLite source changed while copying: ${file.pathname}`);
}
function copyPinnedFile(source, targetPath) {
	let target;
	try {
		target = fs.openSync(targetPath, "wx", 384);
		copyFileDescriptorSync(source.descriptor, target);
		fs.fsyncSync(target);
		assertPinnedIdentityUnchanged(source);
	} finally {
		if (target !== void 0) fs.closeSync(target);
	}
}
function copySourceFile(sourcePath, targetPath) {
	const source = openPinnedFile(sourcePath);
	try {
		copyPinnedFile(source, targetPath);
	} finally {
		fs.closeSync(source.descriptor);
	}
}
function sourceMatchesCopy(sourcePath, copyPath) {
	const source = openPinnedFile(sourcePath);
	let copy;
	try {
		copy = fs.openSync(copyPath, "r");
		if (!fs.fstatSync(copy).isFile()) return false;
		const equal = sameFileContentsSync(source.descriptor, copy);
		assertPinnedIdentityUnchanged(source);
		return equal;
	} finally {
		try {
			if (copy !== void 0) fs.closeSync(copy);
		} finally {
			fs.closeSync(source.descriptor);
		}
	}
}
function assertExpectedSidecars(pathname, expected) {
	if (!sameSidecars(readSourceSidecars(pathname), expected)) throw new SqliteSourceChangedError(`SQLite journal state changed while copying: ${pathname}`);
}
function replaceFile(sourcePath, targetPath) {
	fs.rmSync(targetPath, { force: true });
	fs.renameSync(sourcePath, targetPath);
}
function isSqliteReadOnlyError(error) {
	let current = error;
	for (let depth = 0; depth < 8 && current && typeof current === "object"; depth += 1) {
		const details = current;
		if (typeof details.errcode === "number" && (details.errcode & SQLITE_RESULT_CODE_MASK) === SQLITE_READONLY_RESULT_CODE) return true;
		current = details.cause;
	}
	return false;
}
function rollbackJournalReferencesSuperJournal(journalPath) {
	const descriptor = fs.openSync(journalPath, "r");
	try {
		const size = fs.fstatSync(descriptor).size;
		if (size < 16) return false;
		const trailer = Buffer.allocUnsafe(16);
		if (fs.readSync(descriptor, trailer, 0, trailer.length, size - trailer.length) !== trailer.length) return false;
		const nameBytes = trailer.readUInt32BE(0);
		return nameBytes > 0 && nameBytes <= size - 20 && trailer.subarray(8).equals(SQLITE_JOURNAL_MAGIC);
	} finally {
		fs.closeSync(descriptor);
	}
}
function recoverPrivateJournalCopy(snapshotPath) {
	if (rollbackJournalReferencesSuperJournal(`${snapshotPath}-journal`)) throw new Error(`SQLite hot rollback journal references a super-journal and cannot be recovered privately: ${snapshotPath}`);
	const snapshot = openNodeSqliteDatabase(snapshotPath);
	try {
		snapshot.exec("PRAGMA busy_timeout = 30000; PRAGMA trusted_schema = OFF;");
		snapshot.prepare("PRAGMA schema_version;").get();
	} finally {
		snapshot.close();
	}
	fs.rmSync(`${snapshotPath}-journal`, { force: true });
	const descriptor = fs.openSync(snapshotPath, "r+");
	try {
		fs.fsyncSync(descriptor);
	} finally {
		fs.closeSync(descriptor);
	}
}
function publishPreparedCopy(directory) {
	const location = path.join(directory, "database.sqlite");
	for (const suffix of [
		"-wal",
		"-shm",
		"-journal",
		""
	]) {
		const staged = `${location}.partial${suffix}`;
		if (fs.existsSync(staged)) fs.renameSync(staged, `${location}${suffix}`);
	}
	return adoptPreparedLocation(location, directory);
}
function createStableReadOnlyCopyInTempDirectory(pathname, journalMode, existingTempDir, stagingRoot = existingTempDir ? path.dirname(existingTempDir) : resolvePrivateSqliteSnapshotStagingRoot()) {
	let tempDir = existingTempDir;
	try {
		tempDir ??= createSqliteSnapshotStagingDirectorySync(stagingRoot);
		const snapshotPath = path.join(tempDir, "database.sqlite.partial");
		const firstPath = path.join(tempDir, "first");
		if (process.platform !== "win32") fs.chmodSync(tempDir, 448);
		if (readSourceJournalMode(pathname) !== journalMode) throw new SqliteSourceChangedError(`SQLite journal mode changed before copying: ${pathname}`);
		const sidecars = readSourceSidecars(pathname);
		let copiedWalPrefix = false;
		if (journalMode === "wal" && sidecars.wal && !sidecars.journal) {
			const wal = openPinnedFile(`${pathname}-wal`);
			try {
				const copied = copySqliteWalPrefixSync(wal.descriptor, `${snapshotPath}-wal`, () => copySourceFile(pathname, snapshotPath), () => sourceMatchesCopy(pathname, snapshotPath));
				assertPinnedIdentityUnchanged(wal);
				if (copied === false) throw new SqliteSourceChangedError(`SQLite WAL generation changed while copying: ${pathname}`);
				copiedWalPrefix = copied === true;
			} finally {
				fs.closeSync(wal.descriptor);
			}
		}
		const sidecarSuffixes = [...sidecars.journal ? ["-journal"] : [], ...sidecars.wal ? ["-wal"] : []];
		if (copiedWalPrefix) assertExpectedSidecars(pathname, sidecars);
		else if (sidecarSuffixes.length > 0) {
			for (const suffix of sidecarSuffixes) copySourceFile(`${pathname}${suffix}`, `${snapshotPath}${suffix}`);
			copySourceFile(pathname, snapshotPath);
			for (const suffix of sidecarSuffixes) if (!sourceMatchesCopy(`${pathname}${suffix}`, `${snapshotPath}${suffix}`)) throw new SqliteSourceChangedError(`SQLite ${suffix === "-wal" ? "WAL" : "rollback journal"} changed while copying: ${pathname}`);
			assertExpectedSidecars(pathname, sidecars);
		} else {
			copySourceFile(pathname, firstPath);
			assertExpectedSidecars(pathname, sidecars);
			const mainUnchanged = sourceMatchesCopy(pathname, firstPath);
			assertExpectedSidecars(pathname, sidecars);
			if (!mainUnchanged) throw new SqliteSourceChangedError(`SQLite main database changed while copying: ${pathname}`);
			replaceFile(firstPath, snapshotPath);
		}
		if (readSourceJournalMode(pathname) !== journalMode) throw new SqliteSourceChangedError(`SQLite journal mode changed while copying: ${pathname}`);
		if (sidecars.journal) recoverPrivateJournalCopy(snapshotPath);
		return publishPreparedCopy(tempDir);
	} catch (error) {
		if (tempDir && existingTempDir === void 0) removeTempDirectory(tempDir);
		throw sqliteSnapshotStagingError(tempDir ?? stagingRoot, error, !tempDir);
	}
}
async function createStableReadOnlyCopy(pathname, journalMode, stagingRoot, signal) {
	const tempDir = await createSqliteSnapshotStagingDirectory(stagingRoot, false, signal);
	try {
		return createStableReadOnlyCopyInTempDirectory(pathname, journalMode, tempDir);
	} catch (error) {
		await removeTempDirectoryAsync(tempDir);
		throw error;
	}
}
/** Native reads may create WAL-index files; callers need an isolated child or a private source. */
async function createOnlineReadOnlyBackup(pathname, stagingRoot, signal) {
	const tempDir = await createSqliteSnapshotStagingDirectory(stagingRoot, false, signal);
	const snapshotPath = path.join(tempDir, "database.sqlite.partial");
	try {
		if (process.platform !== "win32") fs.chmodSync(tempDir, 448);
		const source = withSqliteInspectionOperation("source", () => openNodeSqliteDatabase(pathname, { readOnly: true }));
		try {
			source.exec(`PRAGMA busy_timeout = ${SQLITE_SOURCE_READ_BUSY_TIMEOUT_MS}; PRAGMA trusted_schema = OFF; BEGIN;`);
			source.prepare("PRAGMA schema_version;").get();
			await retainSnapshotWork(backupNodeSqliteDatabase(source, snapshotPath));
			source.exec("ROLLBACK;");
		} finally {
			if (source.isOpen) source.close();
		}
		const snapshot = openNodeSqliteDatabase(snapshotPath);
		try {
			snapshot.exec("PRAGMA journal_mode = DELETE;");
		} finally {
			snapshot.close();
		}
		const descriptor = fs.openSync(snapshotPath, "r+");
		try {
			fs.fsyncSync(descriptor);
		} finally {
			fs.closeSync(descriptor);
		}
		return publishPreparedCopy(tempDir);
	} catch (error) {
		await removeTempDirectoryAsync(tempDir);
		throw sqliteSnapshotStagingError(tempDir, error);
	}
}
/**
* Active rollback and WAL state use SQLite's locking and backup protocol.
* Crash residue that cannot be opened read-only is copied and recovered
* privately so inspection never mutates coordination files beside the source.
* In-process reads require drained source handles or a separate child: source
* close() must not release another live SQLite owner's POSIX locks.
*/
async function prepareReadOnlySourceInProcess(pathname, stagingRoot, signal) {
	signal?.throwIfAborted();
	const canonicalPath = fs.realpathSync.native(pathname);
	let lastChange;
	for (let attempt = 0; attempt < 10; attempt += 1) {
		const started = performance.now();
		const report = createSnapshotAttemptReporter(canonicalPath, attempt, started);
		let journalMode;
		try {
			journalMode = readSourceJournalMode(canonicalPath);
		} catch (error) {
			if (!(error instanceof SqliteSourceChangedError)) throw error;
			lastChange = error;
			report("raw-copy", "changed", void 0, error);
			await waitForSnapshotRetry(attempt, signal);
			continue;
		}
		if (journalMode === "empty") try {
			const prepared = await createStableReadOnlyCopy(canonicalPath, journalMode, stagingRoot, signal);
			report("raw-copy", "success", prepared);
			return prepared;
		} catch (error) {
			if (!(error instanceof SqliteSourceChangedError)) {
				report("raw-copy", "error", void 0, error);
				throw error;
			}
			lastChange = error;
			report("raw-copy", "changed", void 0, error);
			await waitForSnapshotRetry(attempt, signal);
			continue;
		}
		const sidecars = readSourceSidecars(canonicalPath);
		if (journalMode !== "wal" || sidecars.wal && sidecars.shm) try {
			const prepared = await createOnlineReadOnlyBackup(canonicalPath, stagingRoot, signal);
			report("online-backup", "success", prepared);
			return prepared;
		} catch (error) {
			signal?.throwIfAborted();
			let currentMode;
			try {
				currentMode = readSourceJournalMode(canonicalPath);
			} catch (inspectionError) {
				if (!(inspectionError instanceof SqliteSourceChangedError)) throw inspectionError;
				lastChange = inspectionError;
				continue;
			}
			const currentSidecars = readSourceSidecars(canonicalPath);
			if (currentMode === "rollback" && currentSidecars.journal) {
				if (!isSqliteReadOnlyError(error)) throw error;
				try {
					const prepared = await createStableReadOnlyCopy(canonicalPath, "rollback", stagingRoot, signal);
					report("raw-copy", "success", prepared);
					return prepared;
				} catch (copyError) {
					if (!(copyError instanceof SqliteSourceChangedError)) throw copyError;
					lastChange = copyError;
					await waitForSnapshotRetry(attempt, signal);
					continue;
				}
			}
			if (currentMode !== "wal" || currentSidecars.wal && currentSidecars.shm) throw error;
			lastChange = error instanceof Error ? error : new Error(String(error));
			await waitForSnapshotRetry(attempt, signal);
			continue;
		}
		try {
			const prepared = await createStableReadOnlyCopy(canonicalPath, "wal", stagingRoot, signal);
			report("raw-copy", "success", prepared);
			return prepared;
		} catch (error) {
			if (!(error instanceof SqliteSourceChangedError)) throw error;
			lastChange = error;
			report("raw-copy", "changed", void 0, error);
			await waitForSnapshotRetry(attempt, signal);
		}
	}
	throw new SqliteSourceChangedError(`SQLite source did not stabilize after 10 read-only inspection attempts (the database may be under concurrent write activity): ${canonicalPath}. Wait a moment for write activity to settle, then retry the inspection`, { cause: lastChange });
}
function prepareReadOnlySourceSyncInProcess(pathname, stagingRoot) {
	const canonicalPath = fs.realpathSync.native(pathname);
	let lastChange;
	for (let attempt = 0; attempt < 10; attempt += 1) try {
		return createStableReadOnlyCopyInTempDirectory(canonicalPath, readSourceJournalMode(canonicalPath), void 0, stagingRoot);
	} catch (error) {
		if (!(error instanceof SqliteSourceChangedError)) throw error;
		lastChange = error;
		waitForSnapshotRetrySync(attempt);
	}
	throw new SqliteSourceChangedError(`SQLite source did not stabilize after 10 read-only inspection attempts (the database may be under concurrent write activity): ${canonicalPath}. Wait a moment for write activity to settle, then retry the inspection`, { cause: lastChange });
}
function prepareSqliteReadOnlyLocationInProcess(pathname, stagingRoot, signal) {
	signal?.throwIfAborted();
	return withSqliteSourceHandleAsync(pathname, () => prepareReadOnlySourceInProcess(pathname, stagingRoot, signal));
}
function prepareSqliteReadOnlyLocationSyncInProcess(pathname, stagingRoot) {
	return withSqliteSourceHandle(pathname, () => prepareReadOnlySourceSyncInProcess(pathname, stagingRoot));
}
//#endregion
//#region src/infra/sqlite-worker-identity.ts
function assertExistingDatabaseIdentity(databasePath, expected) {
	const file = statSync(databasePath, { bigint: true });
	if (!file.isFile() || `file:${file.dev}:${file.ino}` !== expected) throw new Error("SQLite database file identity changed before existing-only open");
}
//#endregion
//#region src/infra/sqlite-read-cache.ts
function readCacheToken(database, databasePath) {
	if (database.isTransaction) return;
	const dataVersion = readSqliteDataVersion(database);
	const wal = fs.statSync(`${databasePath}-wal`, {
		bigint: true,
		throwIfNoEntry: false
	});
	if (!wal || wal.size === 0n) return `${dataVersion}:empty`;
	const version = database.prepare("SELECT sqlite_version() AS version").get()?.version;
	if (typeof version !== "string" || (compareValidSemver(version, "3.53.0") ?? -1) < 0) return;
	const checkpoint = database.prepare("PRAGMA main.wal_checkpoint(NOOP)").get();
	const pageSize = database.prepare("PRAGMA main.page_size").get()?.page_size;
	const frames = checkpoint?.log;
	if (checkpoint?.busy !== 0 || typeof frames !== "number" || !Number.isSafeInteger(frames) || frames < 0 || typeof pageSize !== "number" || !Number.isSafeInteger(pageSize) || pageSize <= 0 || wal.size !== 32n + BigInt(frames) * (24n + BigInt(pageSize))) return;
	return `${dataVersion}:${frames}:${pageSize}`;
}
/** Bracket rows on their existing connection; no extra source descriptors or writes. */
function prepareSqliteReadCache(database, databasePath) {
	let before;
	try {
		const location = database.location();
		if (location && resolveSqliteFilesystemPath(path.resolve(location)) === resolveSqliteFilesystemPath(path.resolve(databasePath))) before = readCacheToken(database, databasePath);
	} catch (error) {
		if (isSqliteCorruptionError(error)) throw error;
	}
	return () => {
		if (before === void 0) return false;
		try {
			return readCacheToken(database, databasePath) === before;
		} catch (error) {
			if (isSqliteCorruptionError(error)) throw error;
			return false;
		}
	};
}
var init_sqlite_read_cache = __esmMin((() => {
	init_node_sqlite();
	init_semver();
	init_sqlite_error_diagnostics();
}));
//#endregion
//#region src/state/openclaw-agent-db-contract.ts
var init_openclaw_agent_db_contract = __esmMin((() => {}));
//#endregion
//#region src/agents/auth-profiles/sqlite-read-pool.ts
function closeAuthProfileReadDatabase(databasePath) {
	const pathname = path.resolve(databasePath);
	const entry = authProfileReadDatabases.get(pathname);
	if (!entry) return;
	clearNodeSqliteKyselyCacheForDatabase(entry.db);
	if (entry.db.isOpen) entry.db.close();
	clearTimeout(entry.idleTimer);
	entry.idleTimer = void 0;
	authProfileReadDatabases.delete(pathname);
	if (authProfileReadDatabases.size === 0) {
		unregisterReadHandleExitClose?.();
		unregisterReadHandleExitClose = null;
	}
}
/** Internal lifecycle close for scoped or all process-local pooled auth-profile readers. */
function closeAuthProfileReadPool(scope) {
	if (scope?.kind === "database") {
		closeAuthProfileReadDatabase(scope.databasePath);
		return;
	}
	if (scope?.kind === "root") {
		for (const pathname of authProfileReadDatabases.keys()) if (isPathInside$1(scope.rootPath, pathname)) closeAuthProfileReadDatabase(pathname);
		return;
	}
	for (const pathname of authProfileReadDatabases.keys()) closeAuthProfileReadDatabase(pathname);
}
function armReadHandleIdleClose(pathname, entry) {
	if (entry.idleTimer) {
		entry.idleTimer.refresh();
		return;
	}
	const timer = runInSqliteMaintenanceContext(() => setTimeout(() => {
		if (authProfileReadDatabases.get(pathname) !== entry || entry.idleTimer !== timer) return;
		try {
			closeAuthProfileReadDatabase(pathname);
		} catch (error) {
			timer.refresh();
			process.emitWarning(`Failed to close idle auth profile reader: ${String(error)}`, { type: "AuthProfileReadPoolError" });
		}
	}, AUTH_PROFILE_READ_IDLE_MS));
	timer.unref();
	entry.idleTimer = timer;
}
function isMissingDatabasePath(pathname) {
	try {
		fs.statSync(pathname);
		return false;
	} catch (error) {
		return hasErrnoCode(error, "ENOENT");
	}
}
function acquireAuthProfileReadDatabase(pathname) {
	const resolvedPath = path.resolve(pathname);
	const cached = authProfileReadDatabases.get(resolvedPath);
	if (cached?.ready && cached.db.isOpen) {
		authProfileReadDatabases.delete(resolvedPath);
		authProfileReadDatabases.set(resolvedPath, cached);
		armReadHandleIdleClose(resolvedPath, cached);
		return {
			status: "readable",
			db: cached.db
		};
	}
	if (cached) closeAuthProfileReadDatabase(resolvedPath);
	for (const [pendingPath, entry] of authProfileReadDatabases) if (!entry.ready) closeAuthProfileReadDatabase(pendingPath);
	let db;
	try {
		db = openNodeSqliteDatabase(resolvedPath, { readOnly: true });
	} catch {
		return isMissingDatabasePath(resolvedPath) ? { status: "missing" } : { status: "unreadable" };
	}
	const candidate = {
		db,
		ready: false
	};
	authProfileReadDatabases.set(resolvedPath, candidate);
	unregisterReadHandleExitClose ??= registerSqliteCacheExitClose(closeAuthProfileReadPool);
	armReadHandleIdleClose(resolvedPath, candidate);
	let readable = false;
	try {
		enableNodeSqliteKyselyStatementCache(db);
		setSqliteBusyTimeout(db, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS);
		readable = readSqliteUserVersion(db) <= 23;
	} catch {}
	if (!readable) {
		closeAuthProfileReadDatabase(resolvedPath);
		return { status: "unreadable" };
	}
	try {
		while (authProfileReadDatabases.size > AUTH_PROFILE_READ_HANDLE_CAP) {
			const oldestPath = authProfileReadDatabases.keys().next().value;
			if (oldestPath === void 0) break;
			closeAuthProfileReadDatabase(oldestPath);
		}
	} catch (error) {
		try {
			closeAuthProfileReadDatabase(resolvedPath);
		} catch (closeError) {
			throw new AggregateError([error, closeError], "Unable to close auth profile readers", { cause: closeError });
		}
		throw error;
	}
	candidate.ready = true;
	return {
		status: "readable",
		db
	};
}
var AUTH_PROFILE_READ_HANDLE_CAP, AUTH_PROFILE_READ_IDLE_MS, authProfileReadDatabases, unregisterReadHandleExitClose;
var init_sqlite_read_pool = __esmMin((() => {
	init_errno();
	init_kysely_sync();
	init_node_sqlite();
	init_path_guards();
	init_sqlite_busy_timeout();
	init_sqlite_user_version();
	init_sqlite_wal();
	init_openclaw_agent_db_contract();
	init_openclaw_state_db_contract();
	AUTH_PROFILE_READ_HANDLE_CAP = 64;
	AUTH_PROFILE_READ_IDLE_MS = 18e5;
	authProfileReadDatabases = /* @__PURE__ */ new Map();
	unregisterReadHandleExitClose = null;
}));
//#endregion
//#region src/agents/auth-profiles/sqlite-json.ts
var sqlite_json_exports = /* @__PURE__ */ __exportAll({
	PRIMARY_ROW_KEY: () => PRIMARY_ROW_KEY,
	SHARED_AUTH_STORE_STATE_KEY: () => SHARED_AUTH_STORE_STATE_KEY,
	SHARED_STATE_STATE_KEY: () => SHARED_STATE_STATE_KEY,
	SHARED_STORE_STATE_KEY: () => SHARED_STORE_STATE_KEY,
	deleteAuthProfileJsonCell: () => deleteAuthProfileJsonCell,
	getAgentAuthProfileKysely: () => getAgentAuthProfileKysely,
	inspectAgentAuthProfileJsonCellReadOnly: () => inspectAgentAuthProfileJsonCellReadOnly,
	inspectAuthProfileJsonCell: () => inspectAuthProfileJsonCell,
	readAuthProfileRows: () => readAuthProfileRows,
	readAuthProfileRowsReadOnly: () => readAuthProfileRowsReadOnly,
	readSharedAuthKvCell: () => readSharedAuthKvCell,
	writeAuthProfileJsonCell: () => writeAuthProfileJsonCell
});
function readSharedAuthKvCell(db, stateKey) {
	return executeSqliteQueryTakeFirstSync(db, getSharedAuthProfileKysely(db).selectFrom("config_machine_state").select("value_json").where("state_key", "=", stateKey))?.value_json;
}
function getAgentAuthProfileKysely(db) {
	return getNodeSqliteKysely(db);
}
function getSharedAuthProfileKysely(db) {
	return getNodeSqliteKysely(db);
}
function inspectAuthProfileTable(db, target, databaseKind) {
	const tableName = databaseKind === "shared-state" ? "config_machine_state" : target === "store" ? "auth_profile_store" : "auth_profile_state";
	const schemaObject = executeWithCachedStatement(db, "SELECT type FROM sqlite_master WHERE name = ?", [tableName], (statement) => statement.get(tableName));
	if (!schemaObject) return {
		status: "missing",
		reason: "table"
	};
	return schemaObject.type === "table" ? null : { status: "unreadable" };
}
function inspectAuthProfileJsonCell(db, target, databaseKind) {
	const tableInspection = inspectAuthProfileTable(db, target, databaseKind);
	if (tableInspection) return tableInspection;
	let raw;
	if (databaseKind === "shared-state") {
		const cell = readSharedAuthKvCell(db, target === "store" ? SHARED_STORE_STATE_KEY : SHARED_STATE_STATE_KEY);
		if (cell === void 0) return {
			status: "missing",
			reason: "row"
		};
		raw = cell;
	} else if (target === "store") {
		const row = executeSqliteQueryTakeFirstSync(db, getAgentAuthProfileKysely(db).selectFrom("auth_profile_store").select("store_json").where("store_key", "=", PRIMARY_ROW_KEY));
		if (!row) return {
			status: "missing",
			reason: "row"
		};
		raw = row.store_json;
	} else {
		const row = executeSqliteQueryTakeFirstSync(db, getAgentAuthProfileKysely(db).selectFrom("auth_profile_state").select("state_json").where("state_key", "=", PRIMARY_ROW_KEY));
		if (!row) return {
			status: "missing",
			reason: "row"
		};
		raw = row.state_json;
	}
	try {
		return {
			status: "readable",
			raw: JSON.parse(raw)
		};
	} catch {
		return { status: "unreadable" };
	}
}
function inspectAgentAuthProfileJsonCellReadOnly(databasePath, target) {
	const acquired = acquireAuthProfileReadDatabase(databasePath);
	if (acquired.status === "missing") return {
		status: "missing",
		reason: "database"
	};
	if (acquired.status === "unreadable") return { status: "unreadable" };
	try {
		return inspectAuthProfileJsonCell(acquired.db, target, "agent");
	} catch {
		closeAuthProfileReadDatabase(databasePath);
		return { status: "unreadable" };
	}
}
/** The isolated reader closes its native pool before transferring credential rows. */
function readAuthProfileRowsReadOnly(databasePath) {
	try {
		const acquired = acquireAuthProfileReadDatabase(databasePath);
		if (acquired.status !== "readable") {
			const inspection = acquired.status === "missing" ? {
				status: "missing",
				reason: "database"
			} : { status: "unreadable" };
			return {
				store: inspection,
				state: inspection,
				cacheable: false
			};
		}
		try {
			return readAuthProfileRows(acquired.db, databasePath, "agent");
		} catch {
			return {
				store: { status: "unreadable" },
				state: { status: "unreadable" },
				cacheable: false
			};
		}
	} finally {
		closeAuthProfileReadPool({
			kind: "database",
			databasePath
		});
	}
}
/** Shared and agent rows use one connection for their committed-generation proof. */
function readAuthProfileRows(database, databasePath, databaseKind) {
	const canCache = prepareSqliteReadCache(database, databasePath);
	const store = inspectAuthProfileJsonCell(database, "store", databaseKind);
	const state = inspectAuthProfileJsonCell(database, "state", databaseKind);
	return {
		store,
		state,
		cacheable: store.status !== "unreadable" && state.status !== "unreadable" && canCache()
	};
}
/** Write one canonical auth cell on the caller's admitted transaction connection. */
function writeAuthProfileJsonCell(database, target, kind, payload) {
	const value = JSON.stringify(payload);
	const now = Date.now();
	if (kind === "shared-state") executeSqliteQuerySync(database, getSharedAuthProfileKysely(database).insertInto("config_machine_state").values({
		state_key: target === "store" ? SHARED_STORE_STATE_KEY : SHARED_STATE_STATE_KEY,
		value_json: value,
		updated_at_ms: now
	}).onConflict((conflict) => conflict.column("state_key").doUpdateSet({
		value_json: value,
		updated_at_ms: now
	})));
	else if (target === "store") executeSqliteQuerySync(database, getAgentAuthProfileKysely(database).insertInto("auth_profile_store").values({
		store_key: PRIMARY_ROW_KEY,
		store_json: value,
		updated_at: now
	}).onConflict((conflict) => conflict.column("store_key").doUpdateSet({
		store_json: value,
		updated_at: now
	})));
	else executeSqliteQuerySync(database, getAgentAuthProfileKysely(database).insertInto("auth_profile_state").values({
		state_key: PRIMARY_ROW_KEY,
		state_json: value,
		updated_at: now
	}).onConflict((conflict) => conflict.column("state_key").doUpdateSet({
		state_json: value,
		updated_at: now
	})));
}
function deleteAuthProfileJsonCell(database, target, kind) {
	if (kind === "shared-state") executeSqliteQuerySync(database, getSharedAuthProfileKysely(database).deleteFrom("config_machine_state").where("state_key", "=", target === "store" ? SHARED_STORE_STATE_KEY : SHARED_STATE_STATE_KEY));
	else if (target === "store") executeSqliteQuerySync(database, getAgentAuthProfileKysely(database).deleteFrom("auth_profile_store").where("store_key", "=", PRIMARY_ROW_KEY));
	else executeSqliteQuerySync(database, getAgentAuthProfileKysely(database).deleteFrom("auth_profile_state").where("state_key", "=", PRIMARY_ROW_KEY));
}
var PRIMARY_ROW_KEY, SHARED_STORE_STATE_KEY, SHARED_STATE_STATE_KEY, SHARED_AUTH_STORE_STATE_KEY;
var init_sqlite_json = __esmMin((() => {
	init_kysely_sync_cache_state();
	init_kysely_sync();
	init_sqlite_read_cache();
	init_sqlite_read_pool();
	PRIMARY_ROW_KEY = "primary";
	SHARED_STORE_STATE_KEY = "authProfiles.store";
	SHARED_STATE_STATE_KEY = "authProfiles.state";
	SHARED_AUTH_STORE_STATE_KEY = "auth.sharedStore";
}));
//#endregion
//#region src/infra/sqlite-readonly-location.worker.ts
init_record_coerce();
init_runtime_process_entrypoints();
init_sqlite_error_diagnostics();
init_sqlite_readonly_auth_transfer();
init_sqlite_readonly_location_cleanup();
init_sqlite_readonly_worker_protocol();
init_sqlite_snapshot_retirement();
init_sqlite_worker_transfer();
const stagingTokens = /* @__PURE__ */ new Map();
async function inspect(args) {
	const mode = args[0];
	const pathname = args[1];
	const stagingRoot = args[2];
	if (mode !== "sync" && mode !== "async" && mode !== "consolidated" && mode !== "reclaim" && !isSqliteSnapshotStagingMode(mode) || !pathname) return {
		ok: false,
		message: "SQLite read-only worker requires a mode and a database path"
	};
	try {
		if (mode === "staging-reconcile") {
			reconcileSqliteSnapshotRetirement(pathname);
			return {
				ok: true,
				location: pathname
			};
		}
		if (mode === "staging-create" || mode === "staging-create-legacy") {
			const owned = createSqliteSnapshotStagingTokenSync(pathname, mode === "staging-create-legacy");
			stagingTokens.set(owned.directory, owned.release);
			return {
				ok: true,
				location: owned.directory
			};
		}
		if (mode === "staging-retire") {
			const token = stagingTokens.get(pathname);
			if (!token) throw new Error("SQLite snapshot token is not owned by this worker");
			const retirement = beginSqliteSnapshotRetirement(pathname, { token });
			try {
				retireSqliteSnapshotPayload(retirement);
				stagingTokens.delete(pathname);
			} finally {
				retirement.release();
			}
			return {
				ok: true,
				location: pathname
			};
		}
		if (mode === "reclaim") {
			const warnings = [];
			const directories = reclaimAbandonedSqliteSnapshots(pathname, (message, error) => {
				warnings.push(`${message}${formatSqliteErrorCodeSuffix(error)}`);
			});
			let stopped = false;
			const stop = () => {
				stopped = true;
			};
			process.stdin.once("end", stop);
			process.stdin.once("error", stop);
			process.stdin.resume();
			try {
				while (true) {
					await setImmediate$1();
					if (stopped) {
						warnings.push("Stopped SQLite snapshot reclamation at a directory boundary.");
						break;
					}
					if (directories.next().done) break;
				}
			} finally {
				directories.return(void 0);
				process.stdin.off("end", stop);
				process.stdin.off("error", stop);
				process.stdin.destroy();
			}
			return {
				ok: true,
				warnings
			};
		}
		if (mode === "consolidated") {
			if (!stagingRoot || path.dirname(path.resolve(pathname)) !== path.resolve(stagingRoot)) throw new Error("SQLite consolidation requires its caller-owned private snapshot directory");
			const prepared = await createOnlineReadOnlyBackup(pathname, stagingRoot);
			releaseSnapshotTempDirectory(prepared.cleanupRoot ?? path.dirname(prepared.location));
			return {
				ok: true,
				location: prepared.location
			};
		}
		const prepared = mode === "sync" ? prepareSqliteReadOnlyLocationSyncInProcess(pathname, stagingRoot) : await prepareSqliteReadOnlyLocationInProcess(pathname, stagingRoot);
		releaseSnapshotTempDirectory(prepared.cleanupRoot ?? path.dirname(prepared.location));
		return {
			ok: true,
			location: prepared.location
		};
	} catch (error) {
		return {
			ok: false,
			message: `${error instanceof SqliteSourceChangedError || isSqliteLockError(error) ? SQLITE_INSPECTION_CONTENTION_PREFIX : ""}${formatSqliteReadOnlyInspectionFailure(error)}`
		};
	}
}
function runSession() {
	let busy = false;
	let closeRequested = false;
	const transfers = createSqliteWorkerTransferOwner();
	const sourceLeases = /* @__PURE__ */ new Set();
	let activeTransfer;
	const send = (id, result, failed = false) => {
		process.send?.({
			id,
			result
		}, (error) => {
			if (error || failed) {
				transfers.close();
				process.exit(1);
			}
		});
	};
	const fail = (id, error) => {
		transfers.close();
		send(id, {
			ok: false,
			message: formatSqliteReadOnlyInspectionFailure(error)
		}, true);
	};
	process.once("disconnect", () => {
		if (busy) {
			transfers.close();
			process.exit(1);
		}
	});
	process.on("message", (message) => {
		if (message === "close") {
			if (busy) closeRequested = true;
			else {
				transfers.close();
				process.disconnect?.();
			}
			return;
		}
		if (isRecord(message) && activeTransfer && message.id === activeTransfer.requestId && isRecord(message.transfer)) {
			const { requestId, transferId } = activeTransfer;
			try {
				if (message.transfer.transferId !== transferId) throw new Error("Auth profile transfer identity changed");
				if (message.transfer.type === "next") send(requestId, {
					type: "frame",
					frame: encodeSqliteAuthTransferFrame(transfers.next(transferId))
				});
				else if (message.transfer.type === "end") {
					transfers.end(transferId);
					activeTransfer = void 0;
					busy = false;
					send(requestId, { type: "complete" });
				} else throw new Error("Invalid auth profile transfer command");
			} catch (error) {
				fail(requestId, error);
			}
			return;
		}
		if (!busy && isRecord(message) && typeof message.id === "number" && Number.isSafeInteger(message.id) && Array.isArray(message.args) && message.args.length === 2 && message.args[0] === "auth-profile-rows" && typeof message.args[1] === "string") {
			const id = message.id;
			const pathname = message.args[1];
			const auth = message.auth;
			busy = true;
			(async () => {
				if (!isRecord(auth) || typeof auth.expectedIdentity !== "string" || !auth.expectedIdentity.startsWith("file:") || !isRecord(auth.coordinatorRuntime) || typeof auth.coordinatorRuntime.directory !== "string" || typeof auth.coordinatorRuntime.keepAlive !== "boolean") throw new Error("Auth profile read requires captured physical ownership");
				const { expectedIdentity } = auth;
				const runtime = {
					directory: auth.coordinatorRuntime.directory,
					keepAlive: auth.coordinatorRuntime.keepAlive
				};
				const { readAuthProfileRowsReadOnly } = await Promise.resolve().then(() => (init_sqlite_json(), sqlite_json_exports));
				const rows = withStateDatabaseCoordinatorRuntimeDirectory(runtime, () => {
					const lease = acquireStateDatabaseHandleLease({
						databasePath: pathname,
						busyTimeoutMs: 0
					});
					sourceLeases.add(lease);
					assertExistingDatabaseIdentity(pathname, expectedIdentity);
					const result = readAuthProfileRowsReadOnly(pathname);
					assertExistingDatabaseIdentity(pathname, expectedIdentity);
					lease.release();
					sourceLeases.delete(lease);
					return result;
				});
				const handle = transfers.start([{
					kind: "store",
					value: rows.store
				}, {
					kind: "state",
					value: rows.state
				}].values(), { kinds: ["store", "state"] });
				activeTransfer = {
					requestId: id,
					transferId: handle.id
				};
				send(id, {
					type: "start",
					handle: {
						...handle,
						cacheable: rows.cacheable
					}
				});
			})().catch((error) => fail(id, error));
			return;
		}
		if (busy || !message || typeof message !== "object" || Object.keys(message).length !== 2 || !("id" in message) || typeof message.id !== "number" || !Number.isSafeInteger(message.id) || !("args" in message) || !Array.isArray(message.args) || message.args[0] !== "sync" && !isSqliteSnapshotStagingMode(message.args[0]) || !message.args.every((arg) => typeof arg === "string")) process.exit(1);
		busy = true;
		const id = message.id;
		const staging = isSqliteSnapshotStagingMode(message.args[0]);
		inspect(message.args).then((inspected) => {
			const result = Buffer.byteLength(JSON.stringify(inspected)) > 1048576 ? {
				ok: false,
				message: "exceeded its output buffer"
			} : inspected;
			process.send?.({
				id,
				result
			}, (error) => {
				if (error || !result.ok && !staging) {
					process.exit(1);
					return;
				}
				busy = false;
				if (closeRequested) process.disconnect?.();
			});
		});
	});
}
if (process.argv[2] === "--openclaw-sqlite-readonly-child") {
	if (process.argv[3] === "session" && process.send) runSession();
	else inspect(process.argv.slice(3)).then((result) => {
		if (!result.ok) process.exitCode = 1;
		process.stdout.write(JSON.stringify(result));
	});
}
//#endregion
export {};
