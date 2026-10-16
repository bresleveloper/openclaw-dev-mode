import { i as isJsonObject } from "./protocol-CANUwXJ3.mjs";
import { coerceErrorMessage } from "openclaw/plugin-sdk/error-runtime";
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
		super(formatCodexAppServerRpcErrorMessage(error, method));
		this.name = "CodexAppServerRpcError";
		this.code = error.code;
		this.data = error.data;
		this.method = method;
	}
};
function isCodexThreadReadMissingError(error, threadId) {
	return error instanceof CodexAppServerRpcError && error.method === "thread/read" && error.code === -32600 && error.message === `thread not loaded: ${threadId}`;
}
function formatCodexAppServerRpcErrorMessage(error, method) {
	const message = error.message || `${method} failed`;
	const detail = readCodexAppServerRpcReloginDetail(error.data);
	return detail && !message.includes(detail) ? `${message}: ${detail}` : message;
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
//#endregion
export { codexPrewriteRejectionCause as a, CodexAppServerScopedRequestRejectedError as i, CodexAppServerLocalRequestCancellationError as n, isCodexAppServerOverloadError as o, CodexAppServerRpcError as r, isCodexThreadReadMissingError as s, CODEX_APP_SERVER_OVERLOADED_ERROR_CODE as t };
