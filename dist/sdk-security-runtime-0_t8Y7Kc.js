import { f as clampTimerTimeoutMs } from "./number-coercion-CJQ8TR--.js";
import { O as findExistingAncestor, u as pathScope } from "./fs-safe-aqmM_n6V.js";
import "./logging-core-C_80QbiA.js";
import "./number-runtime-DBLVDypr.js";
import "./runtime-env-oOti2yy7.js";
import "./security-runtime-ZGC3cmUc.js";
import "./plugin-runtime-DVoeKmsH.js";
import "./gateway-runtime-ArQFAZ7T.js";
import "./cli-runtime-Comrp7kq.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/browser/src/sdk-node-runtime.ts
function normalizeTimeoutMs(timeoutMs) {
	return clampTimerTimeoutMs(timeoutMs);
}
function createTimeoutAbortSignal(timeoutMs, label) {
	const controller = new AbortController();
	const error = /* @__PURE__ */ new Error(`${label ?? "request"} timed out`);
	const timer = setTimeout(() => controller.abort(error), timeoutMs);
	timer.unref?.();
	return {
		controller,
		error,
		timer
	};
}
function waitForAbort(signal, fallback) {
	if (signal.aborted) return {
		promise: Promise.reject(toLintErrorObject(signal.reason ?? fallback, "Non-Error rejection")),
		cleanup: () => void 0
	};
	let listener;
	return {
		cleanup: () => {
			if (listener) signal.removeEventListener("abort", listener);
		},
		promise: new Promise((_, reject) => {
			listener = () => reject(toLintErrorObject(signal.reason ?? fallback, "Non-Error rejection"));
			signal.addEventListener("abort", listener, { once: true });
		})
	};
}
/** Runs async work with an optional aborting timeout signal. */
async function withTimeout(work, timeoutMs, label) {
	const resolved = normalizeTimeoutMs(timeoutMs);
	if (!resolved) return await work(void 0);
	const timeout = createTimeoutAbortSignal(resolved, label);
	const abort = waitForAbort(timeout.controller.signal, timeout.error);
	try {
		return await Promise.race([work(timeout.controller.signal), abort.promise]);
	} finally {
		clearTimeout(timeout.timer);
		abort.cleanup();
	}
}
function toLintErrorObject(value, fallbackMessage) {
	if (value instanceof Error) return value;
	if (typeof value === "string") return new Error(value);
	const error = new Error(fallbackMessage, { cause: value });
	if (typeof value === "object" && value !== null || typeof value === "function") Object.assign(error, value);
	return error;
}
//#endregion
//#region extensions/browser/src/sdk-security-runtime.ts
/**
* Browser-local SDK security bridge plus directory creation helper.
*/
/** Ensures an absolute directory exists without escaping its nearest existing ancestor. */
async function ensureAbsoluteDirectory(dirPath, options) {
	const absolutePath = path.resolve(dirPath);
	const scopeLabel = options?.scopeLabel ?? "directory";
	const existingAncestor = await findExistingAncestor(absolutePath);
	if (!existingAncestor) return {
		ok: false,
		error: /* @__PURE__ */ new Error(`Invalid path: must stay within ${scopeLabel}`)
	};
	if (existingAncestor === absolutePath) {
		try {
			const stat = await fs.lstat(absolutePath);
			if (!stat.isSymbolicLink() && stat.isDirectory()) return {
				ok: true,
				path: absolutePath
			};
		} catch {}
		return {
			ok: false,
			error: /* @__PURE__ */ new Error(`Invalid path: must stay within ${scopeLabel}`)
		};
	}
	const result = await pathScope(existingAncestor, { label: options?.scopeLabel ?? "directory" }).ensureDir(path.relative(existingAncestor, absolutePath), { mode: options?.mode });
	if (result.ok) return result;
	return {
		ok: false,
		error: new Error(result.error)
	};
}
//#endregion
export { withTimeout as n, ensureAbsoluteDirectory as t };
