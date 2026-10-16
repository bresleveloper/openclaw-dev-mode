import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { s as asFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { a as extractErrorCodeOrErrno, c as readErrorName, i as extractErrorCode, r as collectNestedErrorCandidates } from "./error-coercion-CvJK4lmH.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as restoreRuntimeTerminalState } from "./runtime-DlO3PTAd.mjs";
import { t as isAbortError } from "./abort-signal-QqAmLWTl.mjs";
import { i as readErrorCause, r as formatUncaughtError } from "./errors-O33D01XW.mjs";
import { n as registerListener } from "./listeners-BogSNJ-R.mjs";
import { n as isTransientNetworkError } from "./retryable-network-errors-D2gJmBqw.mjs";
import { n as runFatalErrorHooks } from "./fatal-error-hooks-nKFZkyas.mjs";
import process from "node:process";
//#region src/infra/unhandled-rejections.ts
const HANDLERS_GLOBAL_KEY = Symbol.for("openclaw.unhandledRejection.handlers");
const EXCEPTION_HANDLERS_GLOBAL_KEY = Symbol.for("openclaw.uncaughtException.handlers");
function createErrorHandlerRegistry(globalKey, failureMessage) {
	const handlers = resolveGlobalSingleton(globalKey, () => /* @__PURE__ */ new Set());
	return {
		register(handler) {
			return registerListener(handlers, handler);
		},
		isHandled(error) {
			for (const handler of handlers) try {
				if (handler(error)) return true;
			} catch (err) {
				console.error(failureMessage, err instanceof Error ? err.stack ?? err.message : err);
			}
			return false;
		}
	};
}
const rejectionRegistry = createErrorHandlerRegistry(HANDLERS_GLOBAL_KEY, "[openclaw] Unhandled rejection handler failed:");
const exceptionRegistry = createErrorHandlerRegistry(EXCEPTION_HANDLERS_GLOBAL_KEY, "[openclaw] Uncaught exception handler failed:");
const FATAL_ERROR_CODES = /* @__PURE__ */ new Set([
	"ERR_OUT_OF_MEMORY",
	"ERR_SCRIPT_EXECUTION_TIMEOUT",
	"ERR_WORKER_OUT_OF_MEMORY",
	"ERR_WORKER_UNCAUGHT_EXCEPTION",
	"ERR_WORKER_INITIALIZATION_FAILED"
]);
const INVALID_CONFIG_ERROR_CODE = "INVALID_CONFIG";
const CONFIG_ERROR_CODES = /* @__PURE__ */ new Set([
	INVALID_CONFIG_ERROR_CODE,
	"MISSING_API_KEY",
	"MISSING_CREDENTIALS"
]);
const EXIT_CONFIG_ERROR = 78;
const TRANSIENT_SQLITE_CODES = /* @__PURE__ */ new Set([
	"SQLITE_BUSY",
	"SQLITE_CANTOPEN",
	"SQLITE_IOERR",
	"SQLITE_LOCKED"
]);
const TRANSIENT_SQLITE_ERRCODES = /* @__PURE__ */ new Set([
	5,
	6,
	10,
	14
]);
const BENIGN_UNCAUGHT_EXCEPTION_CODES = /* @__PURE__ */ new Set(["EPIPE", "EIO"]);
const BENIGN_UNCAUGHT_EXCEPTION_NETWORK_CODES = /* @__PURE__ */ new Set([
	"ECONNREFUSED",
	"ENETDOWN",
	"EHOSTUNREACH",
	"ENETUNREACH",
	"EADDRNOTAVAIL",
	"EAI_AGAIN",
	"ENOTFOUND",
	"ETIMEDOUT",
	"UND_ERR_CONNECT_TIMEOUT",
	"UND_ERR_DNS_RESOLVE_FAILED",
	"UND_ERR_CONNECT",
	"ERR_HTTP2_INVALID_SESSION"
]);
const BENIGN_UNCAUGHT_EXCEPTION_NETWORK_MESSAGE_CODE_RE = /\b(ECONNREFUSED|ENETDOWN|EHOSTUNREACH|ENETUNREACH|EADDRNOTAVAIL|EAI_AGAIN|ENOTFOUND|ETIMEDOUT|UND_ERR_CONNECT_TIMEOUT|UND_ERR_DNS_RESOLVE_FAILED|UND_ERR_CONNECT|ERR_HTTP2_INVALID_SESSION)\b/i;
const WS_PRE_HANDSHAKE_CLOSE_MESSAGE = "websocket was closed before the connection was established";
const UNDICI_TERMINATED_TYPE_ERROR_MESSAGE = "terminated";
const TRANSIENT_SQLITE_MESSAGE_CODE_RE = /\b(SQLITE_BUSY|SQLITE_CANTOPEN|SQLITE_IOERR|SQLITE_LOCKED)\b/i;
const TRANSIENT_SQLITE_MESSAGE_SNIPPETS = [
	"unable to open database file",
	"database is locked",
	"database table is locked",
	"disk i/o error"
];
function hasSqliteSignal(err) {
	const record = asOptionalObjectRecord(err);
	if (!record) return false;
	const code = extractErrorCode(err)?.trim().toUpperCase();
	return code === "ERR_SQLITE_ERROR" || code?.startsWith("SQLITE_") === true || normalizeLowercaseStringOrEmpty(readErrorName(err)).includes("sqlite") || normalizeLowercaseStringOrEmpty(record.message).includes("sqlite");
}
function extractErrorCodeWithCause(err) {
	return extractErrorCode(err) || extractErrorCode(readErrorCause(err));
}
function isTransientSqliteError(err) {
	if (!err) return false;
	for (const candidate of collectNestedErrorCandidates(err)) {
		const code = extractErrorCodeOrErrno(candidate);
		if (code && TRANSIENT_SQLITE_CODES.has(code)) return true;
		if (!hasSqliteSignal(candidate)) continue;
		const value = candidate.errcode;
		const sqliteErrcode = asFiniteNumber(typeof value === "string" && value.trim() ? Number(value) : value);
		if (sqliteErrcode !== void 0 && TRANSIENT_SQLITE_ERRCODES.has(sqliteErrcode)) return true;
		const messageParts = [candidate.message, candidate.errstr];
		for (const rawMessage of messageParts) {
			const message = normalizeLowercaseStringOrEmpty(rawMessage);
			if (TRANSIENT_SQLITE_MESSAGE_CODE_RE.test(message)) return true;
			if (TRANSIENT_SQLITE_MESSAGE_SNIPPETS.some((snippet) => message.includes(snippet))) return true;
		}
	}
	return false;
}
/** Requires watcher evidence so ordinary ENOSPC storage failures remain fatal. */
function isTransientFileWatchError(err) {
	if (!err) return false;
	const hasFileWatchSignal = (message) => message.includes("inotify") || message.includes("watcher") || message.includes("watch limit") || message.includes("max watches");
	const hasFileWatchExhaustionSignal = (message) => message.includes("inotify watches") || message.includes("inotify watch") || message.includes("system limit for number of file watchers") || message.includes("watch limit") || message.includes("max watches");
	for (const candidate of collectNestedErrorCandidates(err)) {
		const record = asOptionalObjectRecord(candidate);
		if (!record) continue;
		const code = extractErrorCodeOrErrno(candidate);
		const message = normalizeLowercaseStringOrEmpty(record.message);
		if (code === "ENOSPC") {
			if (hasFileWatchSignal(message)) return true;
			continue;
		}
		if (message.includes("no space left on device") && hasFileWatchSignal(message) || hasFileWatchExhaustionSignal(message)) return true;
	}
	return false;
}
function isTransientUnhandledRejectionError(err) {
	return isTransientNetworkError(err) || isTransientSqliteError(err) || isTransientFileWatchError(err);
}
function isBenignUncaughtExceptionError(err) {
	for (const candidate of collectNestedErrorCandidates(err)) {
		if (candidate instanceof TypeError && normalizeLowercaseStringOrEmpty(candidate.message) === UNDICI_TERMINATED_TYPE_ERROR_MESSAGE) return true;
		const code = extractErrorCodeOrErrno(candidate);
		if (code && (BENIGN_UNCAUGHT_EXCEPTION_NETWORK_CODES.has(code) || BENIGN_UNCAUGHT_EXCEPTION_CODES.has(code))) return true;
		const message = normalizeLowercaseStringOrEmpty(asOptionalObjectRecord(candidate)?.message);
		if (BENIGN_UNCAUGHT_EXCEPTION_NETWORK_MESSAGE_CODE_RE.test(message) || message === WS_PRE_HANDSHAKE_CLOSE_MESSAGE) return true;
	}
	return false;
}
function registerUnhandledRejectionHandler(handler) {
	return rejectionRegistry.register(handler);
}
function registerUncaughtExceptionHandler(handler) {
	return exceptionRegistry.register(handler);
}
function isUncaughtExceptionHandled(error) {
	return exceptionRegistry.isHandled(error);
}
function installUnhandledRejectionHandler() {
	const exitWithTerminalRestore = (reason, error, hookReason = reason, exitCode = 1) => {
		for (const message of runFatalErrorHooks({
			reason: hookReason,
			error
		})) console.error("[openclaw]", message);
		restoreRuntimeTerminalState(reason, { resumeStdinIfPaused: false });
		process.exit(exitCode);
	};
	process.on("unhandledRejection", (reason, _promise) => {
		if (rejectionRegistry.isHandled(reason)) return;
		if (isAbortError(reason)) {
			console.warn("[openclaw] Suppressed AbortError:", formatUncaughtError(reason));
			return;
		}
		const code = extractErrorCodeWithCause(reason);
		if (code !== void 0 && FATAL_ERROR_CODES.has(code)) {
			console.error("[openclaw] FATAL unhandled rejection:", formatUncaughtError(reason));
			exitWithTerminalRestore("fatal unhandled rejection", reason, "fatal_unhandled_rejection");
			return;
		}
		if (code !== void 0 && CONFIG_ERROR_CODES.has(code)) {
			console.error("[openclaw] CONFIGURATION ERROR - requires fix:", formatUncaughtError(reason));
			exitWithTerminalRestore("configuration error", reason, "configuration_error", code === INVALID_CONFIG_ERROR_CODE ? EXIT_CONFIG_ERROR : 1);
			return;
		}
		if (isTransientUnhandledRejectionError(reason)) {
			console.warn("[openclaw] Non-fatal unhandled rejection (continuing):", formatUncaughtError(reason));
			return;
		}
		console.error("[openclaw] Unhandled promise rejection:", formatUncaughtError(reason));
		exitWithTerminalRestore("unhandled rejection", reason, "unhandled_rejection");
	});
}
//#endregion
export { isUncaughtExceptionHandled as a, isTransientUnhandledRejectionError as i, isBenignUncaughtExceptionError as n, registerUncaughtExceptionHandler as o, isTransientSqliteError as r, registerUnhandledRejectionHandler as s, installUnhandledRejectionHandler as t };
