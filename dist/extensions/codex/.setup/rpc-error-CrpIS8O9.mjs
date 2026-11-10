import { r as isJsonObject } from "./protocol-CaPAVwe9.mjs";
import { coerceErrorMessage, formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
//#region extensions/codex/src/app-server/rpc-error.ts
const CODEX_APP_SERVER_OVERLOADED_ERROR_CODE = -32001;
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
//#endregion
export { codexPrewriteRejectionCause as a, isCodexThreadReadMissingError as c, CodexAppServerScopedRequestRejectedError as i, isMissingCodexParentThreadError as l, CodexAppServerLocalRequestCancellationError as n, isCodexAppServerOverloadError as o, CodexAppServerRpcError as r, isCodexThreadClosingError as s, CODEX_APP_SERVER_OVERLOADED_ERROR_CODE as t };
