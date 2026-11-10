import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as redactRegisteredSecretValues, n as hasRegisteredSecretValuesForRedaction } from "./secret-redaction-registry-C0-kg1Rg.mjs";
import { t as warnPluginSdkDeprecation } from "./sdk-deprecation-DjTmOhOX.mjs";
import { r as withResponseBodyTimeout } from "./http-response-body-timeout-eMZmV6xc.mjs";
import { r as normalizeRequestInitHeadersForFetch, t as isHeadersLike } from "./fetch-headers-DD03wtQj.mjs";
import { s as resolveEnabledDebugProxySettings } from "./env-ZuG6CRvK.mjs";
import { E as redactedCaptureHeaders, S as safeJsonString, T as REDACTED_CAPTURE_HEADER_VALUE, _ as uninstallDebugProxyGlobalFetchPatch, c as registerDebugProxyFetchPatch, d as resolveCaptureOwnerForTransport, f as resolveDebugProxyFetchTransport, g as sequenceCaptureWrite, h as runCaptureOperation, i as hasDebugProxyFetchPatch, l as reportCapturePersistenceFailure, m as resolveSessionCaptureOwner, o as observeCaptureWrite, p as resolveRuntimeDeps, r as getAsyncCaptureStore, s as recordCaptureEventAsync, u as resolveCaptureOwner } from "./runtime-owner-DCTetk64.mjs";
import { t as isDebugProxyCaptureDeferred } from "./runtime-deferral-Bdhp4T3g.mjs";
import { URL as URL$1 } from "node:url";
import { randomUUID } from "node:crypto";
import { isUtf8 } from "node:buffer";
//#region src/proxy-capture/runtime-fetch-patch.ts
function resolveUrlString(input) {
	if (input instanceof URL) return input.toString();
	if (typeof input === "string") return input;
	if (typeof Request !== "undefined" && input instanceof Request) return input.url;
	return null;
}
function installDebugProxyGlobalFetchPatch(owner, capture, deps = {}) {
	const runtime = resolveRuntimeDeps(deps);
	const sessionAdmission = owner.session.admission;
	const fetchTarget = runtime.fetchTarget;
	if (typeof fetchTarget.fetch !== "function") return;
	if (hasDebugProxyFetchPatch(fetchTarget, sessionAdmission)) return;
	uninstallDebugProxyGlobalFetchPatch(deps);
	const fetchImpl = fetchTarget.fetch;
	const originalFetch = resolveDebugProxyFetchTransport(fetchImpl).bind(fetchTarget);
	const patchedFetch = async (input, init) => {
		const url = resolveUrlString(input);
		const normalizedInit = normalizeRequestInitHeadersForFetch(init);
		const admission = resolveSessionCaptureOwner(sessionAdmission)?.admission;
		const admitted = Boolean(admission?.current);
		const request = typeof Request !== "undefined" && input instanceof Request ? input : void 0;
		const method = normalizedInit?.method ?? request?.method ?? "GET";
		const headers = normalizedInit?.headers ?? request?.headers;
		const body = normalizedInit?.body ?? request?.body ?? null;
		const requestHeaders = admitted && headers ? new Headers(headers) : void 0;
		const requestBody = admitted && Buffer.isBuffer(body) ? Buffer.from(body) : body;
		let response;
		try {
			response = await originalFetch(input, normalizedInit);
		} catch (error) {
			const current = admission?.current;
			if (admitted && current && url && /^https?:/i.test(url)) capture(current, {
				url,
				method,
				error,
				meta: { captureOrigin: "global-fetch" }
			});
			throw error;
		}
		const current = admission?.current;
		if (admitted && current && url && /^https?:/i.test(url)) capture(current, {
			url,
			method,
			requestHeaders,
			requestBody,
			response,
			transport: "http",
			meta: {
				captureOrigin: "global-fetch",
				source: current.settings.sourceProcess
			}
		});
		return response;
	};
	registerDebugProxyFetchPatch(fetchTarget, originalFetch, patchedFetch, sessionAdmission);
}
//#endregion
//#region src/proxy-capture/runtime-response-body.ts
const MAX_CAPTURED_RESPONSE_BODY_BYTES = 16777216;
const CAPTURED_RESPONSE_BODY_IDLE_TIMEOUT_MS = 1e4;
/** Distinguishes the capture deadline from a genuine response-stream failure. */
var CaptureReadIdleTimeoutError = class extends Error {};
function readCapturedResponseBodyBounded(response, owner, record, signal, asynchronous = false) {
	const recordMetadata = (status) => {
		try {
			record({ status });
		} catch (error) {
			reportCapturePersistenceFailure(owner, error);
		}
	};
	if (typeof response.clone !== "function") {
		recordMetadata("unavailable");
		return;
	}
	const declaredLength = parseDeclaredCaptureContentLength(typeof response.headers?.get === "function" ? response.headers.get("content-length") : void 0);
	if (declaredLength !== void 0 && declaredLength > BigInt(MAX_CAPTURED_RESPONSE_BODY_BYTES)) {
		recordMetadata("too-large");
		return;
	}
	let reader;
	let chunks = [];
	let total = 0;
	let finished = false;
	let canceled = false;
	let detachAbort = () => {};
	const cancel = (reason) => {
		if (!reader || canceled) return;
		canceled = true;
		try {
			reader.cancel(reason).catch(() => void 0);
		} catch (error) {
			owner.errors.push(error);
		}
	};
	const release = () => {
		try {
			reader?.releaseLock();
		} catch {}
	};
	const finish = (result) => {
		if (finished) return;
		finished = true;
		detachAbort();
		owner.pending.delete(finalize);
		try {
			if (!asynchronous && owner.store.isClosed) throw new Error("Capture store closed before its response could be finalized.");
			record(result);
		} catch (error) {
			reportCapturePersistenceFailure(owner, error);
		} finally {
			chunks = [];
			cancel();
			release();
		}
	};
	const finalize = () => finish({
		status: "finalized",
		buffer: Buffer.concat(chunks, total)
	});
	owner.pending.add(finalize);
	if (signal) {
		const onAbort = () => {
			setTimeout(() => {
				if (finished) return;
				finish({
					status: "failed",
					buffer: Buffer.concat(chunks, total),
					error: signal.reason instanceof Error ? signal.reason : new Error("Response capture aborted", { cause: signal.reason })
				});
			}, 0);
		};
		if (signal.aborted) onAbort();
		else {
			signal.addEventListener("abort", onAbort, { once: true });
			detachAbort = () => signal.removeEventListener("abort", onAbort);
		}
	}
	if (finished) return;
	(async () => {
		try {
			const clone = response.clone();
			const body = clone.body;
			if (!body || typeof body.getReader !== "function") {
				finish(clone instanceof Response && clone.body === null ? {
					status: "captured",
					buffer: Buffer.alloc(0)
				} : { status: "unavailable" });
				return;
			}
			reader = body.getReader();
			for (;;) {
				if (finished || !owner.active) return;
				const { done, value } = await withResponseBodyTimeout({
					timeoutMs: CAPTURED_RESPONSE_BODY_IDLE_TIMEOUT_MS,
					onTimeout: ({ timeoutMs }) => new CaptureReadIdleTimeoutError(`capture read stalled: no data for ${timeoutMs}ms`),
					cancel: async (error) => cancel(error),
					read: () => reader.read()
				});
				if (finished || !owner.active) return;
				if (done) {
					finish({
						status: "captured",
						buffer: Buffer.concat(chunks, total)
					});
					return;
				}
				if (!value?.length) continue;
				if (total + value.length > MAX_CAPTURED_RESPONSE_BODY_BYTES) {
					finish({ status: "too-large" });
					return;
				}
				chunks.push(Buffer.from(value));
				total += value.length;
			}
		} catch (error) {
			if (!finished && owner.active) finish(error instanceof CaptureReadIdleTimeoutError ? {
				status: "stalled",
				buffer: Buffer.concat(chunks, total)
			} : {
				status: "failed",
				buffer: Buffer.concat(chunks, total),
				error
			});
		} finally {
			release();
		}
	})();
}
function parseDeclaredCaptureContentLength(raw) {
	if (raw === null || raw === void 0) return;
	const trimmed = raw.trim();
	if (!/^\d+$/.test(trimmed)) return;
	return BigInt(trimmed);
}
//#endregion
//#region src/proxy-capture/runtime.ts
const REDACTED_CAPTURE_BINARY_PAYLOAD = Buffer.from("[REDACTED BINARY PAYLOAD]", "utf8");
function protocolFromUrl(url) {
	switch (url.protocol) {
		case "https:": return "https";
		case "wss:": return "wss";
		case "ws:": return "ws";
		default: return "http";
	}
}
function redactCaptureUrl(rawUrl) {
	let url;
	try {
		url = new URL$1(rawUrl);
	} catch {
		return "https://redacted.invalid/%5BREDACTED%5D";
	}
	const decodeComponent = (value) => {
		try {
			return decodeURIComponent(value);
		} catch {
			return value;
		}
	};
	if (redactCaptureText(url.hostname) !== url.hostname) url.hostname = "redacted.invalid";
	for (const key of ["username", "password"]) {
		const decoded = decodeComponent(url[key]);
		const redacted = redactCaptureText(decoded);
		if (redacted !== decoded) url[key] = redacted;
	}
	url.pathname = url.pathname.split("/").map((segment) => {
		try {
			const decoded = decodeURIComponent(segment);
			const redacted = redactCaptureText(decoded);
			return redacted === decoded ? segment : encodeURIComponent(redacted);
		} catch {
			return segment;
		}
	}).join("/");
	const searchParams = new URLSearchParams();
	let searchChanged = false;
	for (const [name, value] of url.searchParams.entries()) {
		const redactedName = redactCaptureText(name);
		const redactedValue = redactCaptureText(value);
		searchParams.append(redactedName, redactedValue);
		if (redactedName !== name || redactedValue !== value) searchChanged = true;
	}
	if (searchChanged) url.search = searchParams.toString();
	const decodedHash = decodeComponent(url.hash.slice(1));
	const redactedHash = redactCaptureText(decodedHash);
	if (redactedHash !== decodedHash) url.hash = redactedHash;
	const serialized = url.toString();
	return redactCaptureText(serialized) === serialized ? serialized : `${url.protocol}//redacted.invalid/%5BREDACTED%5D`;
}
function redactCaptureText(value) {
	return redactRegisteredSecretValues(value, () => REDACTED_CAPTURE_HEADER_VALUE);
}
function redactCapturePayload(value) {
	if (typeof value === "string") return redactCaptureText(value);
	if (!Buffer.isBuffer(value)) return value ?? null;
	if (!isUtf8(value)) return hasRegisteredSecretValuesForRedaction() ? REDACTED_CAPTURE_BINARY_PAYLOAD : value;
	const text = value.toString("utf8");
	const redacted = redactCaptureText(text);
	return redacted === text ? value : Buffer.from(redacted, "utf8");
}
function redactedCaptureJson(value, stringify = safeJsonString) {
	const serialized = stringify(value);
	return serialized === void 0 ? void 0 : redactCaptureText(serialized);
}
function createHttpCaptureEventBase(params) {
	return {
		sessionId: params.settings.sessionId,
		ts: Date.now(),
		sourceScope: "openclaw",
		sourceProcess: params.settings.sourceProcess,
		protocol: params.transport ?? protocolFromUrl(params.url),
		direction: params.direction,
		kind: params.kind,
		flowId: params.flowId,
		method: params.method,
		host: params.url.host,
		path: `${params.url.pathname}${params.url.search}`
	};
}
/** @deprecated Use initializeDebugProxyCaptureAsync for worker-backed capture. Final compatibility day: 2026-12-31. */
function initializeDebugProxyCapture(mode, resolved, deps = {}) {
	warnPluginSdkDeprecation({
		family: "proxy-capture-runtime",
		method: "initializeDebugProxyCapture",
		replacement: "await initializeDebugProxyCaptureAsync()"
	});
	const settings = resolveEnabledDebugProxySettings(resolved);
	if (!settings) return;
	const owner = resolveCaptureOwner(settings, resolveRuntimeDeps(deps), {
		initialize: true,
		explicit: resolved !== void 0
	});
	if (!owner) return;
	owner.store.upsertSession({
		id: settings.sessionId,
		startedAt: Date.now(),
		mode,
		sourceScope: "openclaw",
		sourceProcess: settings.sourceProcess,
		proxyUrl: settings.proxyUrl
	});
	installDebugProxyGlobalFetchPatch(owner, captureInstalledFetch, deps);
}
/** @deprecated Use captureHttpExchangeAsync and await capture finalization at shutdown. Final compatibility day: 2026-12-31. */
function captureHttpExchange(params, resolved, deps = {}) {
	warnPluginSdkDeprecation({
		family: "proxy-capture-runtime",
		method: "captureHttpExchange",
		replacement: "await captureHttpExchangeAsync() and await finalizeDebugProxyCaptureAsync() at shutdown"
	});
	const settings = resolveEnabledDebugProxySettings(resolved);
	if (!settings) return;
	const owner = resolveCaptureOwner(settings, resolveRuntimeDeps(deps), { explicit: resolved !== void 0 });
	if (owner) captureInstalledFetch(owner, params);
}
function captureInstalledFetch(owner, params) {
	return runOwnedCapture(owner, owner.asynchronous, (execution) => "response" in params ? captureOwnedHttpExchange(params, owner, execution) : captureOwnedHttpError(params, owner, execution));
}
function runOwnedCapture(owner, asynchronous, capture) {
	if (isDebugProxyCaptureDeferred()) return;
	if (!asynchronous) {
		try {
			owner.maintenanceScope?.assertAdmission();
		} catch (error) {
			reportCapturePersistenceFailure(owner, error);
			return;
		}
		return capture({ asynchronous: false });
	}
	try {
		owner.maintenanceScope?.assertAdmission();
		return observeCaptureWrite(owner, runCaptureOperation(owner, async (store) => {
			await capture({
				asynchronous: true,
				store
			});
		}));
	} catch (error) {
		const failed = createDeferredCore();
		failed.reject(error);
		return observeCaptureWrite(owner, failed.promise);
	}
}
function writeCaptureEvent(owner, event, payload, execution) {
	if (execution.asynchronous) return recordCaptureEventAsync(owner, event, payload, execution.store);
	const store = owner.store;
	const fields = payload === void 0 ? {} : owner.runtime.persistEventPayload(store, payload);
	store.recordEvent({
		...event,
		...fields
	});
}
function captureOwnedHttpError(params, owner, execution = { asynchronous: false }) {
	const asynchronous = execution.asynchronous;
	try {
		const captureUrl = redactCaptureUrl(params.url);
		return writeCaptureEvent(owner, {
			...createHttpCaptureEventBase({
				settings: owner.settings,
				url: new URL$1(captureUrl),
				transport: params.transport,
				direction: "local",
				kind: "error",
				flowId: params.flowId ?? randomUUID(),
				method: params.method
			}),
			errorText: redactCaptureText(params.error instanceof Error ? params.error.message : String(params.error)),
			metaJson: redactedCaptureJson(params.meta, owner.runtime.safeJsonString)
		}, void 0, execution);
	} catch (error) {
		if (asynchronous) throw error;
		reportCapturePersistenceFailure(owner, error);
	}
}
function captureOwnedHttpExchange(params, owner, execution = { asynchronous: false }) {
	const asynchronous = execution.asynchronous;
	const { settings, runtime } = owner;
	const flowId = params.flowId ?? randomUUID();
	const captureUrl = redactCaptureUrl(params.url);
	const url = new URL$1(captureUrl);
	const method = params.method;
	const transport = params.transport;
	const responseStatus = params.response.status;
	const requestBody = typeof params.requestBody === "string" || Buffer.isBuffer(params.requestBody) ? params.requestBody : null;
	const rawRequestContentType = params.requestHeaders ? isHeadersLike(params.requestHeaders) ? params.requestHeaders.get("content-type") ?? void 0 : params.requestHeaders["content-type"] : void 0;
	const requestContentType = rawRequestContentType === void 0 ? void 0 : redactCaptureText(rawRequestContentType);
	const rawResponseContentType = typeof params.response.headers?.get === "function" ? params.response.headers.get("content-type") ?? void 0 : void 0;
	const responseContentType = rawResponseContentType === void 0 ? void 0 : redactCaptureText(rawResponseContentType);
	let responseHeadersJson;
	let metaJson;
	let meta;
	let requestWrite;
	try {
		responseHeadersJson = params.response.headers && typeof params.response.headers.entries === "function" ? runtime.safeJsonString(redactedCaptureHeaders(params.response.headers)) : void 0;
		metaJson = redactedCaptureJson(params.meta, runtime.safeJsonString);
		meta = metaJson === void 0 ? void 0 : JSON.parse(metaJson);
		requestWrite = writeCaptureEvent(owner, {
			...createHttpCaptureEventBase({
				settings,
				url,
				transport,
				direction: "outbound",
				kind: "request",
				flowId,
				method
			}),
			contentType: requestContentType,
			headersJson: runtime.safeJsonString(redactedCaptureHeaders(params.requestHeaders, Array.isArray(params.meta?.sensitiveRequestHeaderNames) ? params.meta.sensitiveRequestHeaderNames.filter((name) => typeof name === "string") : void 0)),
			metaJson
		}, {
			data: redactCapturePayload(requestBody),
			contentType: requestContentType
		}, execution);
	} catch (error) {
		if (asynchronous) throw error;
		reportCapturePersistenceFailure(owner, error);
		return;
	}
	const completion = asynchronous ? createDeferredCore() : void 0;
	const requestSettled = asynchronous ? Promise.resolve(requestWrite) : void 0;
	if (completion && requestSettled) requestSettled.catch(completion.reject);
	const recordTerminal = (result) => {
		try {
			const failed = result.status === "failed";
			const event = {
				...createHttpCaptureEventBase({
					settings,
					url,
					transport,
					direction: failed ? "local" : "inbound",
					kind: failed ? "error" : "response",
					flowId,
					method
				}),
				status: responseStatus,
				contentType: responseContentType,
				headersJson: responseHeadersJson,
				errorText: failed ? redactCaptureText(result.error instanceof Error ? result.error.message : String(result.error)) : void 0,
				metaJson: result.status === "captured" ? metaJson : redactedCaptureJson(Object.assign({}, meta, {
					bodyCapture: result.status,
					...failed ? { stage: "response-body" } : {}
				}), runtime.safeJsonString)
			};
			const payload = "buffer" in result ? {
				data: redactCapturePayload(result.buffer),
				contentType: responseContentType
			} : void 0;
			if (completion && requestSettled) requestSettled.then(() => writeCaptureEvent(owner, event, payload, execution)).then(completion.resolve, completion.reject);
			else writeCaptureEvent(owner, event, payload, execution);
		} catch (error) {
			if (completion) completion.reject(error);
			else throw error;
		}
	};
	readCapturedResponseBodyBounded(params.response, owner, recordTerminal, params.signal, asynchronous);
	return completion?.promise;
}
function captureOwnedWsEvent(params, owner, execution) {
	const { settings, runtime } = owner;
	const captureUrl = redactCaptureUrl(params.url);
	const url = new URL$1(captureUrl);
	return writeCaptureEvent(owner, {
		sessionId: settings.sessionId,
		ts: Date.now(),
		sourceScope: "openclaw",
		sourceProcess: settings.sourceProcess,
		protocol: protocolFromUrl(url),
		direction: params.direction,
		kind: params.kind,
		flowId: params.flowId,
		host: url.host,
		path: `${url.pathname}${url.search}`,
		closeCode: params.closeCode,
		errorText: params.errorText === void 0 ? void 0 : redactCaptureText(params.errorText),
		metaJson: redactedCaptureJson(params.meta, runtime.safeJsonString)
	}, {
		data: redactCapturePayload(params.payload),
		contentType: "application/json"
	}, execution);
}
/** @deprecated Use captureWsEventAsync and await capture finalization at shutdown. Final compatibility day: 2026-12-31. */
function captureWsEvent(params, resolved, deps = {}) {
	warnPluginSdkDeprecation({
		family: "proxy-capture-runtime",
		method: "captureWsEvent",
		replacement: "await captureWsEventAsync() and await finalizeDebugProxyCaptureAsync() at shutdown"
	});
	const settings = resolveEnabledDebugProxySettings(resolved);
	if (!settings) return;
	const owner = resolveCaptureOwner(settings, resolveRuntimeDeps(deps), { explicit: resolved !== void 0 });
	if (owner) captureOwnedWsEvent(params, owner, { asynchronous: false });
}
function runAsyncCapture(resolved, deps, capture) {
	try {
		const settings = resolveEnabledDebugProxySettings(resolved);
		if (!settings) return Promise.resolve();
		const owner = resolveCaptureOwner(settings, resolveRuntimeDeps(deps), {
			explicit: resolved !== void 0,
			asynchronous: true
		});
		return owner ? Promise.resolve(runOwnedCapture(owner, true, (execution) => capture(owner, execution))) : Promise.resolve();
	} catch (error) {
		const failure = createDeferredCore();
		failure.reject(error);
		failure.promise.catch(() => void 0);
		return failure.promise;
	}
}
function captureWsEventAsync(params, resolved, deps = {}) {
	return runAsyncCapture(resolved, deps, (owner, execution) => captureOwnedWsEvent(params, owner, execution));
}
function captureHttpExchangeAsync(params, resolved, deps = {}) {
	return runAsyncCapture(resolved, deps, (owner, execution) => captureOwnedHttpExchange(params, owner, execution));
}
async function initializeDebugProxyCaptureAsync(mode, resolved, deps = {}) {
	const settings = resolveEnabledDebugProxySettings(resolved);
	if (!settings) return;
	const owner = resolveCaptureOwner(settings, resolveRuntimeDeps(deps), {
		initialize: true,
		explicit: resolved !== void 0,
		asynchronous: true
	});
	if (!owner) return;
	owner.maintenanceScope?.assertAdmission();
	const session = {
		id: settings.sessionId,
		startedAt: Date.now(),
		mode,
		sourceScope: "openclaw",
		sourceProcess: settings.sourceProcess,
		proxyUrl: settings.proxyUrl
	};
	await observeCaptureWrite(owner, runCaptureOperation(owner, (store) => sequenceCaptureWrite(owner, store, () => store.upsertSession(session))));
	if (owner.active) installDebugProxyGlobalFetchPatch(owner, captureInstalledFetch, deps);
}
function prepareHttpCaptureForTransport() {
	const owner = resolveCaptureOwnerForTransport(void 0, {}, { asynchronous: true });
	if (!owner) return;
	const admission = owner.admission;
	const ready = observeCaptureWrite(owner, getAsyncCaptureStore(owner).then(() => void 0));
	const reserved = owner.asyncLease !== void 0;
	return (params) => {
		const current = admission.current;
		if (!current) return Promise.resolve();
		if (!reserved) return ready;
		return Promise.resolve(captureInstalledFetch(current, params));
	};
}
//#endregion
export { initializeDebugProxyCapture as a, captureWsEventAsync as i, captureHttpExchangeAsync as n, initializeDebugProxyCaptureAsync as o, captureWsEvent as r, prepareHttpCaptureForTransport as s, captureHttpExchange as t };
