import { i as isJsonObject } from "./protocol-CANUwXJ3.mjs";
import { withTimeout } from "openclaw/plugin-sdk/time-runtime";
//#region extensions/codex/src/app-server/rpc-error.ts
const CODEX_APP_SERVER_OVERLOADED_ERROR_CODE = -32001;
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
//#endregion
//#region extensions/codex/src/app-server/timeout.ts
/**
* Thin Codex app-server timeout adapter around OpenClaw's shared timeout helper.
*/
function resolveAbortError(signal) {
	return signal.reason instanceof Error ? signal.reason : new Error("Codex app-server operation aborted", { cause: signal.reason });
}
/** Awaits a promise with a Codex-specific timeout error message. */
async function withTimeout$1(promise, timeoutMs, timeoutMessage, createError) {
	return await withTimeout(promise, timeoutMs, {
		message: timeoutMessage,
		...createError ? { createError } : {}
	});
}
/** Bounds an operation by both its owner lifecycle and one total wall-clock budget. */
async function withAbortableTimeout(params) {
	const signal = params.signal;
	if (signal?.aborted) throw resolveAbortError(signal);
	let removeAbortListener;
	const operation = signal ? Promise.race([params.promise, new Promise((_, reject) => {
		const onAbort = () => reject(resolveAbortError(signal));
		signal.addEventListener("abort", onAbort, { once: true });
		removeAbortListener = () => signal.removeEventListener("abort", onAbort);
	})]) : params.promise;
	try {
		return await withTimeout$1(operation, params.timeoutMs, params.timeoutMessage, params.createTimeoutError);
	} finally {
		removeAbortListener?.();
	}
}
async function waitForPromiseOrAbort(promise, signal) {
	if (signal.aborted) return false;
	let removeAbort;
	try {
		return await Promise.race([promise.then(() => true), new Promise((resolve) => {
			const onAbort = () => resolve(false);
			signal.addEventListener("abort", onAbort, { once: true });
			removeAbort = () => signal.removeEventListener("abort", onAbort);
			if (signal.aborted) onAbort();
		})]);
	} finally {
		removeAbort?.();
	}
}
function abortReason(signal) {
	return signal.reason instanceof Error ? signal.reason : new Error(String(signal.reason ?? "codex app-server thread route aborted"));
}
//#endregion
export { CODEX_APP_SERVER_OVERLOADED_ERROR_CODE as a, withTimeout$1 as i, waitForPromiseOrAbort as n, CodexAppServerRpcError as o, withAbortableTimeout as r, isCodexThreadReadMissingError as s, abortReason as t };
