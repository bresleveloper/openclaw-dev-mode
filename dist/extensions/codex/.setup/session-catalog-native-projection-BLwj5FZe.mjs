import { N as detachCodexCatalogString, O as truncateCodexCatalogPreview, c as MAX_CWD_LENGTH, d as boundedCatalogString } from "./session-catalog-parsing-BS06j5dj.mjs";
import { r as isJsonObject } from "./protocol-NX-eGZn-.mjs";
import { n as defineCodexBuildState } from "./build-state-heW11Zft.mjs";
import { d as CodexAppServerRpcError, u as CodexAppServerLocalRequestCancellationError } from "./attempt-timeouts-m7WOwoeF.mjs";
import { t as __exportAll } from "./session-binding-sidecars-DPQAWL9D.mjs";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/string-coerce-runtime";
// extensions/codex/src/app-server/request-attempt.ts
function remainingCodexRequestTime(method, signal, deadline) {
	if (signal?.aborted) throw new CodexAppServerLocalRequestCancellationError(method, "aborted", false, signal.reason);
	const remainingMs = deadline === void 0 ? void 0 : deadline - performance.now();
	if (remainingMs !== void 0 && remainingMs <= 0) throw new CodexAppServerLocalRequestCancellationError(method, "timed out", false);
	return remainingMs;
}
/** One caller per wire attempt; local waiter expiry need not imply a native response. */
function createCodexRequestAttempt(params) {
	let pending = true;
	let mayHaveWritten = false;
	let waiter;
	const diagnostics = params.diagnosticIdentity ? {
		...params.diagnosticIdentity,
		attemptCreatedAtMs: performance.now(),
		firstPossibleWriteAtMs: null,
		wireOutcomeAtWaiterSettlement: "retained-pending",
		wireObservedAtMs: null
	} : void 0;
	const finish = (outcome) => {
		if (!pending) return false;
		pending = false;
		if (diagnostics) {
			diagnostics.wireOutcomeAtWaiterSettlement = outcome;
			diagnostics.wireObservedAtMs = performance.now();
		}
		params.onSettled();
		return true;
	};
	return {
		method: params.method,
		get pending() {
			return pending;
		},
		wait(options) {
			const { timeoutMs, signal, overloadAttemptOrdinal } = options;
			let observe = options.attemptWaiterFinished;
			return new Promise((resolve, reject) => {
				if (!pending) {
					reject(/* @__PURE__ */ new Error("Codex request attempt is already settled"));
					return;
				}
				let timer;
				let removeAbort;
				const waiterAttachedAtMs = diagnostics && observe ? performance.now() : 0;
				const detach = (waiterOutcome) => {
					if (!waiter) return false;
					waiter = void 0;
					clearTimeout(timer);
					timer = void 0;
					removeAbort?.();
					removeAbort = void 0;
					finish(mayHaveWritten ? "correlation-closed" : "not-written");
					const callback = observe;
					observe = void 0;
					if (diagnostics && callback) try {
						callback({
							...diagnostics,
							waiterOrdinal: 1,
							disposition: "new",
							overloadAttemptOrdinal,
							waiterAttachedAtMs,
							waiterSettledAtMs: performance.now(),
							waiterOutcome
						});
					} catch {}
					return true;
				};
				const localWaiter = {
					resolve: (value) => {
						if (!detach("resolved")) return;
						resolve(value);
					},
					reject: (error, outcome) => {
						if (detach(outcome)) reject(error);
					}
				};
				waiter = localWaiter;
				if (timeoutMs && Number.isFinite(timeoutMs) && timeoutMs > 0) {
					timer = setTimeout(() => localWaiter.reject(params.cancellationError("timed out", mayHaveWritten), "timed-out"), Math.max(100, timeoutMs));
					timer.unref?.();
				}
				if (signal) {
					const abort = () => localWaiter.reject(params.cancellationError("aborted", mayHaveWritten, signal.reason), "aborted");
					signal.addEventListener("abort", abort, { once: true });
					removeAbort = () => signal.removeEventListener("abort", abort);
					if (signal.aborted) abort();
				}
			});
		},
		resolve(value) {
			if (!finish("native-ok")) return;
			waiter?.resolve(value);
		},
		reject(error, definitelyNotEnqueued = false) {
			if (finish(definitelyNotEnqueued ? "ingress-rejected" : "native-error")) {
				if (definitelyNotEnqueued) {
					mayHaveWritten = false;
					params.onIngressRejected?.();
				}
				waiter?.reject(error instanceof CodexAppServerRpcError ? error : params.localError(error, mayHaveWritten), "native-error");
			}
		},
		close(error) {
			if (finish("correlation-closed")) waiter?.reject(params.localError(error, mayHaveWritten), "client-closed");
		},
		failLocal(error) {
			if (!pending) return;
			finish(mayHaveWritten ? "correlation-closed" : "not-written");
			waiter?.reject(params.localError(error, mayHaveWritten), "local-failed");
		},
		markWritten() {
			mayHaveWritten = true;
			if (diagnostics && diagnostics.firstPossibleWriteAtMs === null) diagnostics.firstPossibleWriteAtMs = performance.now();
		}
	};
}
// extensions/codex/src/session-catalog-source.ts
const getSources = defineCodexBuildState("openclaw.codexCatalogSources", () => ({
	clients: /* @__PURE__ */ new WeakMap(),
	values: /* @__PURE__ */ new WeakMap()
}));
const getEphemeralObservers = defineCodexBuildState("openclaw.codexCatalogEphemeralObservers", () => /* @__PURE__ */ new WeakMap());
/** A passive lifetime fact; the token never retains its client or a lease. */
function codexCatalogSourceForClient(client) {
	const { clients } = getSources();
	let source = clients.get(client);
	if (!source) {
		source = { closed: false };
		clients.set(client, source);
	}
	return source;
}
function closeCodexCatalogClientSource(client) {
	const { clients } = getSources();
	const source = clients.get(client);
	if (source) {
		source.closed = true;
		getEphemeralObservers().delete(source);
	} else clients.set(client, { closed: true });
}
/** The catalog observer is bound once per physical source and released on closure. */
function observeCodexCatalogEphemeralThreads(source, observer) {
	getEphemeralObservers().set(source, observer);
}
function getCodexCatalogSource(value) {
	return getSources().values.get(value);
}
function setCodexCatalogSource(value, source) {
	if (source) getSources().values.set(value, source);
	return value;
}
/** Source attribution survives projection without becoming serialized row data. */
function copyCodexCatalogSource(from, to) {
	return setCodexCatalogSource(to, getCodexCatalogSource(from));
}
/** Stamp the final decoded objects, including any bounded catalog DTO replacement. */
function recordCodexCatalogResponseSource(method, result, source) {
	if (result === null || typeof result !== "object") return;
	if (method === "thread/list" && "data" in result && Array.isArray(result.data)) {
		setCodexCatalogSource(result, source);
		for (const thread of result.data) if (thread !== null && typeof thread === "object") setCodexCatalogSource(thread, source);
	} else if ((method === "thread/read" || method === "thread/start" || method === "thread/fork" || method === "thread/resume") && "thread" in result && result.thread !== null && typeof result.thread === "object") {
		setCodexCatalogSource(result, source);
		setCodexCatalogSource(result.thread, source);
		if ("ephemeral" in result.thread && result.thread.ephemeral === true && "id" in result.thread && typeof result.thread.id === "string") getEphemeralObservers().get(source)?.(result.thread.id);
	}
}
// extensions/codex/src/session-catalog-native-projection.ts
var session_catalog_native_projection_exports = /* @__PURE__ */ __exportAll({
	CODEX_CATALOG_NATIVE_PAGE_LIMIT: () => 64,
	projectCodexCatalogNativeResponse: () => projectCodexCatalogNativeResponse,
	projectCodexCatalogNativeThread: () => projectCodexCatalogNativeThread,
	reuseCodexCatalogPreview: () => reuseCodexCatalogPreview
});
const STRING_FIELDS = [
	[
		"name",
		500,
		"truncate"
	],
	[
		"cwd",
		MAX_CWD_LENGTH,
		"omit"
	],
	[
		"modelProvider",
		500,
		"truncate"
	],
	[
		"cliVersion",
		500,
		"truncate"
	]
];
/** Drop unused native fields before catalog-owned asynchronous work can retain them. */
function projectCodexCatalogNativeThread(thread, sanitize, cachedPreview) {
	if (!isJsonObject(thread)) throw new Error("Codex catalog response contains an invalid thread");
	const id = boundedCatalogString(thread.id, 256);
	if (!id) throw new Error("Codex catalog response contains an invalid thread id");
	const row = {
		id,
		projectId: boundedCatalogString(thread.projectId, 256, "omit") ?? null
	};
	const sessionId = boundedCatalogString(thread.sessionId, 256, "omit");
	if (sessionId) row.sessionId = sessionId;
	if (thread.ephemeral === true) return copyCodexCatalogSource(thread, {
		...row,
		ephemeral: true
	});
	for (const [field, limit, overflow] of STRING_FIELDS) {
		const value = thread[field];
		const bounded = boundedCatalogString(value, limit, overflow);
		if (value === null || bounded !== void 0) row[field] = bounded ?? null;
	}
	if (typeof thread.path === "string") {
		if (thread.path.length > 4096) throw new Error("Codex catalog rollout path exceeds its length limit");
		row.path = detachCodexCatalogString(thread.path);
	} else if (thread.path === null) row.path = null;
	if (typeof thread.originator === "string") row.originator = detachCodexCatalogString(truncateUtf16Safe(thread.originator, 500));
	for (const field of [
		"createdAt",
		"updatedAt",
		"recencyAt"
	]) {
		const value = thread[field];
		if (value === null || typeof value === "number" && Number.isFinite(value)) row[field] = value;
	}
	const rawPreview = thread.preview;
	const preview = reuseCodexCatalogPreview(row, typeof rawPreview === "string" ? Boolean(rawPreview) : void 0, cachedPreview);
	if (preview !== void 0) row.preview = preview;
	else if (typeof rawPreview === "string") row.preview = rawPreview ? truncateCodexCatalogPreview(rawPreview, sanitize) : "";
	else if (rawPreview === null) row.preview = null;
	const source = thread.source;
	if (source === "cli" || source === "vscode" || source === "exec" || source === "appServer" || source === "unknown") row.source = source;
	else if (isJsonObject(thread.source) && typeof thread.source.custom === "string" && thread.source.custom.length <= 500) row.source = { custom: detachCodexCatalogString(thread.source.custom) };
	if (isJsonObject(thread.gitInfo)) {
		const branch = boundedCatalogString(thread.gitInfo.branch, 500, "truncate");
		if (branch !== void 0) row.gitInfo = { branch };
	}
	if (isJsonObject(thread.status)) {
		const type = boundedCatalogString(thread.status.type, 64);
		if (type === "active" || type === "idle" || type === "notLoaded" || type === "systemError") {
			const activeFlags = type === "active" && Array.isArray(thread.status.activeFlags) ? thread.status.activeFlags.slice(0, 16).flatMap((flag) => {
				const bounded = boundedCatalogString(flag, 128, "omit");
				return bounded ? [bounded] : [];
			}) : void 0;
			row.status = type === "active" ? {
				type,
				...activeFlags ? { activeFlags } : {}
			} : { type };
		}
	}
	return copyCodexCatalogSource(thread, row);
}
/** Keep only the admitted prefix before an RPC promise retains its response. */
function projectCodexCatalogNativeResponse(response, sanitize, cachedPreview, remainingRows = 64) {
	if (!Array.isArray(response.data) || response.data.length > 64) throw new Error("Codex catalog response exceeds its native page limit");
	const limit = Number.isFinite(remainingRows) ? Math.max(0, Math.min(64, Math.floor(remainingRows))) : 0;
	const data = [];
	for (let index = 0; index < Math.min(limit, response.data.length); index++) data.push(projectCodexCatalogNativeThread(response.data[index], sanitize, cachedPreview));
	const page = { data };
	for (const field of ["nextCursor", "backwardsCursor"]) {
		const value = response[field];
		if (value === null) page[field] = null;
		else if (value !== void 0) {
			if (typeof value !== "string" || value.length > 4096) throw new Error("Codex catalog response contains an invalid cursor");
			page[field] = detachCodexCatalogString(value);
		}
	}
	return page;
}
/** Reuse resident text without transferring a cache or an unbounded native preview. */
function reuseCodexCatalogPreview(thread, rawPreviewNonempty, cachedPreview) {
	const preview = cachedPreview?.({
		id: thread.id,
		path: thread.path ?? null,
		updatedAt: thread.updatedAt ?? null,
		recencyAt: thread.recencyAt ?? null
	});
	return preview !== void 0 && preview.length <= 500 && (rawPreviewNonempty === void 0 || rawPreviewNonempty === Boolean(preview)) ? preview : void 0;
}
export { closeCodexCatalogClientSource as a, getCodexCatalogSource as c, setCodexCatalogSource as d, createCodexRequestAttempt as f, session_catalog_native_projection_exports as i, observeCodexCatalogEphemeralThreads as l, projectCodexCatalogNativeThread as n, codexCatalogSourceForClient as o, remainingCodexRequestTime as p, reuseCodexCatalogPreview as r, copyCodexCatalogSource as s, projectCodexCatalogNativeResponse as t, recordCodexCatalogResponseSource as u };
