import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { isNativeError, isProxy } from "node:util/types";
//#region src/infra/sqlite-worker-contract.ts
const SQLITE_WORKER_PREPARE_COMMAND = Symbol.for("openclaw.sqliteWorkerPrepareCommand");
const SQLITE_WORKER_PREPARE_ADMITTED = Symbol.for("openclaw.sqliteWorkerPrepareAdmitted");
const SQLITE_WORKER_OPERATION_CLEANUP = Symbol.for("openclaw.sqliteWorkerOperationCleanup");
const SQLITE_WORKER_CLOSE_RECEIPT = Symbol.for("openclaw.sqliteWorkerCloseReceipt");
const SQLITE_WORKER_MAX_MESSAGE_BYTES = 33554432;
const SQLITE_WORKER_MAX_RESULT_BYTES = 67108864;
const retainedWorkerErrorCode = Symbol.for("openclaw.sqliteWorkerErrorCode");
const SqliteWorkerAdmissionTimeoutError = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerAdmissionTimeoutError"), () => class AdmissionTimeoutError extends Error {
	constructor() {
		super("SQLite host admission timed out; retry after transaction rollback");
		this.code = "admission-timeout";
		this.name = "SqliteWorkerAdmissionTimeoutError";
	}
});
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
/** Recognize canonical broker errors without admitting cleanup aggregates for retry. */
function isSqliteWorkerError(error, code) {
	if (!(error instanceof Error) || error instanceof AggregateError) return false;
	try {
		return Object.getOwnPropertyDescriptor(error, retainedWorkerErrorCode)?.value === code;
	} catch {
		return false;
	}
}
/** Unknown native outcomes remain terminal through canonical cause and cleanup envelopes. */
function hasSqliteWorkerOutcomeUnknown(error) {
	const pending = [error];
	const seen = /* @__PURE__ */ new Set();
	while (pending.length > 0) {
		const current = pending.pop();
		if (seen.has(current) || isProxy(current) || !isNativeError(current)) continue;
		seen.add(current);
		if (Object.getOwnPropertyDescriptor(current, retainedWorkerErrorCode)?.value === "outcome-unknown") return true;
		const cause = Object.getOwnPropertyDescriptor(current, "cause");
		if (cause && "value" in cause) pending.push(cause.value);
		let prototype = Object.getPrototypeOf(current);
		let aggregate = false;
		while (prototype && !isProxy(prototype)) {
			const constructor = Object.getOwnPropertyDescriptor(prototype, "constructor")?.value;
			if (prototype === AggregateError.prototype || typeof constructor === "function" && !isProxy(constructor) && Object.getOwnPropertyDescriptor(constructor, "name")?.value === "AggregateError" && Object.getOwnPropertyDescriptor(constructor, "prototype")?.value === prototype && Object.getOwnPropertyDescriptor(prototype, "name")?.value === "AggregateError") {
				aggregate = true;
				break;
			}
			prototype = Object.getPrototypeOf(prototype);
		}
		if (!aggregate) continue;
		const errors = Object.getOwnPropertyDescriptor(current, "errors")?.value;
		if (isProxy(errors) || !Array.isArray(errors)) continue;
		for (const key of Object.keys(errors)) {
			if (!/^(0|[1-9][0-9]*)$/.test(key)) continue;
			const item = Object.getOwnPropertyDescriptor(errors, key);
			if (item && "value" in item) pending.push(item.value);
		}
	}
	return false;
}
//#endregion
export { SQLITE_WORKER_PREPARE_ADMITTED as a, SqliteWorkerError as c, retainSqliteWorkerErrorCode as d, SQLITE_WORKER_OPERATION_CLEANUP as i, hasSqliteWorkerOutcomeUnknown as l, SQLITE_WORKER_MAX_MESSAGE_BYTES as n, SQLITE_WORKER_PREPARE_COMMAND as o, SQLITE_WORKER_MAX_RESULT_BYTES as r, SqliteWorkerAdmissionTimeoutError as s, SQLITE_WORKER_CLOSE_RECEIPT as t, isSqliteWorkerError as u };
