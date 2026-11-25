import { r as isJsonObject } from "./protocol-NX-eGZn-.mjs";
import { coerceErrorMessage, formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { resolveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import { raceWithTimeout } from "openclaw/plugin-sdk/time-runtime";
// extensions/codex/src/app-server/rpc-error.ts
const CODEX_APP_SERVER_OVERLOADED_ERROR_CODE = -32001;
var CodexCatalogResponseTooLargeError = class CodexCatalogResponseTooLargeError extends Error {
	constructor() {
		super("Codex catalog response exceeds 8 MiB; reduce oversized thread previews and retry.");
		this.name = "CodexCatalogResponseTooLargeError";
	}
	/** Transport and background reconciliation preserve the local rejection as a cause. */
	static fromError(error) {
		let current = error;
		for (let depth = 0; current instanceof Error && depth < 8; depth++, current = current.cause) if (current instanceof CodexCatalogResponseTooLargeError) return current;
	}
};
/** A scoped guard rejected the request before a physical write. */
var CodexAppServerScopedRequestRejectedError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.name = "CodexAppServerScopedRequestRejectedError";
	}
};
/** Only definite pre-write rejection permits recovering the original startup cause. */
function codexPrewriteRejectionCause(error) {
	return error instanceof CodexAppServerScopedRequestRejectedError && error.cause !== void 0 ? error.cause : error;
}
/** RPC error wrapper that preserves app-server error code and data. */
var CodexAppServerRpcError = class extends Error {
	constructor(error, method) {
		const message = error.message || `${method} failed`;
		const detail = readCodexAppServerRpcReloginDetail(error.data);
		super(detail && !message.includes(detail) ? `${message}: ${detail}` : message);
		this.name = "CodexAppServerRpcError";
		this.code = error.code;
		this.data = error.data;
		this.method = method;
	}
};
function isCodexThreadReadMissingError(error, threadId) {
	return error instanceof CodexAppServerRpcError && error.method === "thread/read" && error.code === -32600 && error.message === `thread not loaded: ${threadId}`;
}
function isCodexThreadClosingError(error, threadId) {
	return error instanceof CodexAppServerRpcError && error.method === "thread/resume" && error.code === -32600 && error.message === `thread ${threadId} is closing; retry thread/resume after the thread is closed`;
}
function readCodexAppServerRpcReloginDetail(data) {
	const record = isJsonObject(data) ? data : void 0;
	const nested = isJsonObject(record?.error) ? record.error : record;
	if (!nested) return;
	const isRelogin = nested.action === "relogin" || nested.reason === "cloudRequirements" && nested.errorCode === "Auth";
	const detail = typeof nested.detail === "string" ? nested.detail.trim() : "";
	return isRelogin && detail ? detail : void 0;
}
var CodexAppServerLocalRequestCancellationError = class extends Error {
	constructor(method, reason, mayHaveWritten, cause) {
		const detail = cause instanceof Error || typeof cause === "string" ? coerceErrorMessage(cause) : void 0;
		super(`${method} ${reason}${detail ? `: ${detail}` : ""}`, { cause });
		this.reason = reason;
		this.mayHaveWritten = mayHaveWritten;
		this.code = "CODEX_APP_SERVER_LOCAL_REQUEST_CANCELLED";
		this.name = "CodexAppServerLocalRequestCancellationError";
	}
};
/** Codex rejects this exact code before enqueueing, including mutating requests. */
function isCodexAppServerOverloadError(error) {
	return error instanceof CodexAppServerRpcError && error.code === -32001;
}
function isMissingCodexParentThreadError(error) {
	const message = formatErrorMessage(error);
	return message.includes("no rollout found for thread id") || message.includes("includeTurns is unavailable before first user message");
}
// extensions/codex/src/app-server/attempt-timeouts.ts
const CODEX_APP_SERVER_STARTUP_TIMEOUT_FLOOR_MS = 100;
const CODEX_APP_SERVER_STARTUP_REQUEST_TIMEOUT_MULTIPLE = 10;
const TURN_TERMINAL_SETTLEMENT_TIMEOUT_MS = 12e4;
const TURN_FINALIZE_DRAIN_ABORT_GRACE_MS = 5e3;
const CODEX_APP_SERVER_INITIALIZE_TIMEOUT_MESSAGE = "codex app-server initialize timed out";
var CodexAppServerStartupError = class extends Error {
	constructor(reason, message = reason === "timed_out" ? "codex app-server startup timed out" : "codex app-server startup aborted") {
		super(message);
		this.reason = reason;
		this.code = "CODEX_APP_SERVER_STARTUP_CANCELLED";
		this.name = "CodexAppServerStartupError";
	}
};
function buildCodexAppServerInitializeTimeoutError(client) {
	const stderr = client?.getStderrDiagnostic();
	return new CodexAppServerStartupError("timed_out", stderr ? `${CODEX_APP_SERVER_INITIALIZE_TIMEOUT_MESSAGE}; stderr=${JSON.stringify(stderr)}` : CODEX_APP_SERVER_INITIALIZE_TIMEOUT_MESSAGE);
}
function isCodexAppServerStartupError(error, reason) {
	const cause = codexPrewriteRejectionCause(error);
	return cause instanceof Error && "code" in cause && cause.code === "CODEX_APP_SERVER_STARTUP_CANCELLED" && "reason" in cause && (cause.reason === "aborted" || cause.reason === "timed_out") && (reason === void 0 || cause.reason === reason);
}
async function withCodexStartupTimeout(params) {
	if (params.signal.aborted) throw new CodexAppServerStartupError("aborted");
	let timeoutError;
	let timeoutCleanup;
	try {
		return await raceWithTimeout(params.operation, params.timeoutMs, () => {
			timeoutError = new CodexAppServerStartupError("timed_out");
			timeoutCleanup = Promise.resolve(params.onTimeout?.()).then(() => void 0, () => void 0);
			throw timeoutError;
		}, {
			signal: params.signal,
			onAbort: () => {
				throw new CodexAppServerStartupError("aborted");
			}
		});
	} catch (error) {
		if (timeoutError) {
			await timeoutCleanup;
			throw timeoutError;
		}
		throw error;
	}
}
/**
* Bounds physical startup by a multiple of the configured request timeout.
* Turn startup additionally respects its own remaining budget.
*/
function resolveCodexStartupTimeoutMs(params) {
	const timeoutFloorMs = resolveTimerTimeoutMs(params.timeoutFloorMs, CODEX_APP_SERVER_STARTUP_TIMEOUT_FLOOR_MS);
	const turnTimeoutMs = resolveTimerTimeoutMs(params.timeoutMs, timeoutFloorMs);
	const requestBudgetMs = params.requestTimeoutMs === void 0 ? turnTimeoutMs : resolveTimerTimeoutMs(params.requestTimeoutMs * CODEX_APP_SERVER_STARTUP_REQUEST_TIMEOUT_MULTIPLE, turnTimeoutMs);
	return Math.max(timeoutFloorMs, params.timeoutMs === void 0 ? requestBudgetMs : Math.min(turnTimeoutMs, requestBudgetMs));
}
export { isCodexThreadReadMissingError as _, buildCodexAppServerInitializeTimeoutError as a, withCodexStartupTimeout as c, CodexAppServerRpcError as d, CodexAppServerScopedRequestRejectedError as f, isCodexThreadClosingError as g, isCodexAppServerOverloadError as h, TURN_TERMINAL_SETTLEMENT_TIMEOUT_MS as i, CODEX_APP_SERVER_OVERLOADED_ERROR_CODE as l, codexPrewriteRejectionCause as m, CodexAppServerStartupError as n, isCodexAppServerStartupError as o, CodexCatalogResponseTooLargeError as p, TURN_FINALIZE_DRAIN_ABORT_GRACE_MS as r, resolveCodexStartupTimeoutMs as s, CODEX_APP_SERVER_INITIALIZE_TIMEOUT_MESSAGE as t, CodexAppServerLocalRequestCancellationError as u, isMissingCodexParentThreadError as v };
