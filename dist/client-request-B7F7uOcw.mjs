import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { F as resolveTimerTimeoutMs } from "./number-coercion-CuVhdCBs.mjs";
import { i as extractErrorCode, u as toErrorObject } from "./error-coercion-CvJK4lmH.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { i as readResponseWithLimit } from "./http-response-body-umfRGZ-E.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import { i as fetchWithSsrFGuard } from "./fetch-guard-DI6biu8d.mjs";
import { s as isLoopbackHost } from "./net-C6WEu3pd.mjs";
import "./error-runtime-BmospGvZ.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./response-limit-runtime-CpfmMF5T.mjs";
import "./number-runtime-CgyXj1A5.mjs";
import "./setup-tools-D6A0I-Kz.mjs";
import "./runtime-config-snapshot-DlrhEsA8.mjs";
import "./ssrf-runtime-BzkFo_VJ.mjs";
import { t as parseBrowserHttpUrl } from "./browser-cdp-DgJ98Oxl.mjs";
import { i as resolveBrowserConfig, s as resolveProfile } from "./config-DQZ6ubGi.mjs";
import { m as parseBrowserErrorPayload, t as BROWSER_ACT_ERROR_CODES } from "./errors-BqlAThZX.mjs";
import { m as resolveBrowserRateLimitMessage } from "./cdp.helpers-r6708sL2.mjs";
import { n as getBridgeAuthForPort } from "./bridge-auth-registry-CmTPNtit.mjs";
import { n as resolveBrowserControlAuth } from "./control-auth-DFBKuIY4.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region extensions/browser/src/browser/request-scope.ts
const requestScope = new AsyncLocalStorage();
/** Carry a dashboard's authority through the existing local Browser client transport. */
function withBrowserRequestScope(scope, run) {
	return requestScope.run(scope, run);
}
function getBrowserRequestScope() {
	return requestScope.getStore();
}
//#endregion
//#region extensions/browser/src/browser/client-fetch.ts
/**
* Browser control client transport.
*
* Sends requests to either an absolute HTTP browser-control URL or the local
* in-process dispatcher, adding loopback auth and operator-facing diagnostics.
*/
var BrowserServiceError = class extends Error {
	constructor(message, metadata, status) {
		super(message);
		this.name = "BrowserServiceError";
		this.status = status;
		this.code = metadata?.code;
		this.unrecognizedCode = metadata?.unrecognizedCode;
		this.reason = metadata && "reason" in metadata ? metadata.reason : void 0;
		this.details = metadata && "details" in metadata ? metadata.details : void 0;
	}
};
function browserServiceErrorFromPayload(value, fallback, status) {
	const parsed = parseBrowserErrorPayload(value);
	const message = parsed?.error ?? fallback;
	const modelHint = parsed?.code === BROWSER_ACT_ERROR_CODES.operationFailed && status !== 401 ? void 0 : resolveBrowserServiceModelHint(message, status);
	return new BrowserServiceError(modelHint ? appendBrowserToolModelHint(message, modelHint) : message, parsed ?? void 0, status);
}
function isAbsoluteHttp(url) {
	return /^https?:\/\//i.test(url.trim());
}
function isLoopbackHttpUrl(url) {
	return isLoopbackHost(URL.parse(url)?.hostname ?? "");
}
function withLoopbackBrowserAuth(url, init) {
	const headers = new Headers(init?.headers ?? {});
	if (headers.has("authorization") || headers.has("x-openclaw-password")) return {
		...init,
		headers
	};
	if (!isLoopbackHttpUrl(url)) return {
		...init,
		headers
	};
	try {
		const { port } = parseBrowserHttpUrl(url, "browser control URL");
		const bridgeAuth = getBridgeAuthForPort(port);
		if (bridgeAuth?.token) {
			headers.set("Authorization", `Bearer ${bridgeAuth.token}`);
			return {
				...init,
				headers
			};
		}
		if (bridgeAuth?.password) {
			headers.set("x-openclaw-password", bridgeAuth.password);
			return {
				...init,
				headers
			};
		}
	} catch {}
	try {
		const cfg = getRuntimeConfig();
		const auth = resolveBrowserControlAuth(cfg);
		if (auth.token) headers.set("Authorization", `Bearer ${auth.token}`);
		else if (auth.password) headers.set("x-openclaw-password", auth.password);
	} catch {}
	return {
		...init,
		headers
	};
}
const BROWSER_TOOL_PERSISTENT_MODEL_HINT = "Do NOT retry the browser tool — it will keep failing. Use an alternative approach or inform the user that the browser is currently unavailable.";
const BROWSER_TOOL_TRANSIENT_MODEL_HINT = "This may be a transient browser error. Retry the browser tool once. If the same error persists, use an alternative approach or inform the user that the browser is currently unavailable.";
const BROWSER_TRANSIENT_NETWORK_ERROR_RE = /\b(?:ECONNRESET|ECONNABORTED|ENETRESET|ETIMEDOUT|EPIPE|EHOSTUNREACH|ENETUNREACH|EAI_AGAIN|UND_ERR_(?:CONNECT_TIMEOUT|HEADERS_TIMEOUT|BODY_TIMEOUT|SOCKET))\b|fetch failed|network error|other side closed|socket (?:hang up|terminated)|connection (?:reset|aborted|timed out)/i;
const BROWSER_PERSISTENT_FAILURE_RE = /\bECONNREFUSED\b|connection refused|browser control (?:is )?(?:disabled|not enabled)|invalid (?:auth|authentication|credentials|password|token)|authentication (?:failed|required)|unauthorized/i;
const BROWSER_ERROR_BODY_LIMIT_BYTES = 16384;
const BROWSER_SUCCESS_BODY_LIMIT_BYTES = 33554432;
function decodeBrowserControlResponseUtf8(body, status) {
	try {
		return new TextDecoder("utf-8", { fatal: true }).decode(body);
	} catch {
		throw browserServiceErrorFromPayload(void 0, `Browser control response was not valid UTF-8 (HTTP ${status})`, status);
	}
}
function resolveDispatcherBrowserControlOwnership(url) {
	if (isAbsoluteHttp(url)) return "unknown";
	try {
		const cfg = getRuntimeConfig();
		const resolved = resolveBrowserConfig(cfg?.browser, cfg);
		const requestedProfile = new URL(url, "http://localhost").searchParams.get("profile")?.trim();
		const profile = resolveProfile(resolved, requestedProfile || resolved.defaultProfile);
		if (!profile) return "unknown";
		return profile.driver === "openclaw" && profile.cdpIsLoopback && !profile.attachOnly ? "local-managed" : "external-browser";
	} catch {
		return "unknown";
	}
}
function resolveBrowserFetchOperatorHint(url, opts) {
	if (opts?.ownership === "external-browser") return "The browser profile is external to OpenClaw; make sure its browser/CDP endpoint is running and reachable. Restarting the OpenClaw gateway will not launch it.";
	return !isAbsoluteHttp(url) ? `Run \`${formatCliCommand("openclaw browser doctor")}\` and check the Gateway logs.` : "If this is a sandboxed session, ensure the sandbox browser is running.";
}
function normalizeErrorMessage(err) {
	const message = err instanceof Error ? normalizeOptionalString(err.message) : void 0;
	if (message) return message;
	return String(err);
}
function appendBrowserToolModelHint(message, hint) {
	return `${message.replaceAll(BROWSER_TOOL_PERSISTENT_MODEL_HINT, "").replaceAll(BROWSER_TOOL_TRANSIENT_MODEL_HINT, "").trim()} ${hint}`;
}
function classifyBrowserFetchFailure(err) {
	const directCode = extractErrorCode(err);
	const formatted = formatErrorMessage(err);
	const detail = directCode ? `${formatted} | ${directCode}` : formatted;
	const detailLower = normalizeLowercaseStringOrEmpty(detail);
	const nameLower = err instanceof Error ? normalizeLowercaseStringOrEmpty(err.name) : "";
	if (nameLower === "aborterror") return "aborted";
	if (BROWSER_PERSISTENT_FAILURE_RE.test(detail)) return "persistent";
	if (nameLower.includes("timeout") || detailLower.includes("timed out") || detailLower.includes("timeout")) return "timeout";
	if (BROWSER_TRANSIENT_NETWORK_ERROR_RE.test(detail)) return "transient-network";
	return detailLower.includes("aborterror") || detailLower.includes("aborted") || detailLower.includes("abort") || detailLower.includes("cancelled") || detailLower.includes("canceled") ? "aborted" : "persistent";
}
function isPersistentBrowserServiceFailure(message, status) {
	return status === 401 || BROWSER_PERSISTENT_FAILURE_RE.test(message);
}
function resolveBrowserServiceModelHint(message, status) {
	if (message.includes(BROWSER_TOOL_PERSISTENT_MODEL_HINT)) return BROWSER_TOOL_PERSISTENT_MODEL_HINT;
	if (message.includes(BROWSER_TOOL_TRANSIENT_MODEL_HINT)) return BROWSER_TOOL_TRANSIENT_MODEL_HINT;
	if (isPersistentBrowserServiceFailure(message, status)) return BROWSER_TOOL_PERSISTENT_MODEL_HINT;
	if (status === 408 || status === 504) return BROWSER_TOOL_TRANSIENT_MODEL_HINT;
	if (status === void 0 || status < 500 || status > 599) return;
	const kind = classifyBrowserFetchFailure(new Error(message));
	return kind === "timeout" || kind === "transient-network" ? BROWSER_TOOL_TRANSIENT_MODEL_HINT : void 0;
}
function resolveBrowserToolModelHint(kind) {
	if (kind === "timeout" || kind === "transient-network") return BROWSER_TOOL_TRANSIENT_MODEL_HINT;
	return kind === "persistent" ? BROWSER_TOOL_PERSISTENT_MODEL_HINT : void 0;
}
function discardResponseBody(res) {
	res.body?.cancel().catch(() => void 0);
}
function enhanceDispatcherPathError(url, err) {
	const msg = normalizeErrorMessage(err);
	const kind = classifyBrowserFetchFailure(err);
	const operatorHint = resolveBrowserFetchOperatorHint(url, { ownership: resolveDispatcherBrowserControlOwnership(url) });
	const modelHint = resolveBrowserToolModelHint(kind);
	const suffix = modelHint ? `${operatorHint} ${modelHint}` : operatorHint;
	const normalized = msg.endsWith(".") ? msg : `${msg}.`;
	return new Error(`${normalized} ${suffix}`, err instanceof Error ? { cause: err } : void 0);
}
function enhanceBrowserFetchError(url, err, timeoutMs) {
	const operatorHint = resolveBrowserFetchOperatorHint(url);
	const msg = normalizeErrorMessage(err);
	const kind = classifyBrowserFetchFailure(err);
	let message;
	if (kind === "timeout") message = `Can't reach the OpenClaw browser control service (timed out after ${timeoutMs}ms). ${operatorHint} ${BROWSER_TOOL_TRANSIENT_MODEL_HINT}`;
	else if (kind === "aborted") message = `Browser control request was cancelled. ${operatorHint}`;
	else if (kind === "transient-network") message = `Can't reach the OpenClaw browser control service. ${operatorHint} (${msg}) ${BROWSER_TOOL_TRANSIENT_MODEL_HINT}`;
	else message = appendBrowserToolModelHint(`Can't reach the OpenClaw browser control service. ${operatorHint} (${msg})`, BROWSER_TOOL_PERSISTENT_MODEL_HINT);
	return new Error(message, err instanceof Error ? { cause: err } : void 0);
}
function createBrowserRequestAbort(timeoutMs, upstreamSignal) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(/* @__PURE__ */ new Error("timed out")), timeoutMs);
	return {
		signal: upstreamSignal ? AbortSignal.any([upstreamSignal, controller.signal]) : controller.signal,
		dispose: () => clearTimeout(timer)
	};
}
async function fetchHttpJson(url, init) {
	const timeoutMs = resolveTimerTimeoutMs(init.timeoutMs, 5e3);
	const abort = createBrowserRequestAbort(timeoutMs, init.signal);
	const { signal } = abort;
	let release;
	try {
		const guarded = await fetchWithSsrFGuard({
			url,
			init,
			timeoutMs,
			signal,
			policy: { allowPrivateNetwork: true },
			auditContext: "browser-control-client"
		});
		release = guarded.release;
		const res = guarded.response;
		if (!res.ok) {
			if (res.status === 429) {
				discardResponseBody(res);
				throw new BrowserServiceError(`${resolveBrowserRateLimitMessage(url)} ${BROWSER_TOOL_PERSISTENT_MODEL_HINT}`);
			}
			const body = await readResponseWithLimit(res, BROWSER_ERROR_BODY_LIMIT_BYTES).catch(() => void 0);
			const text = body ? decodeBrowserControlResponseUtf8(body, res.status) : "";
			let parsed;
			if (text) try {
				parsed = JSON.parse(text);
			} catch {}
			throw browserServiceErrorFromPayload(parsed, text || `HTTP ${res.status}`, res.status);
		}
		const body = await readResponseWithLimit(res, BROWSER_SUCCESS_BODY_LIMIT_BYTES, { onOverflow: ({ maxBytes }) => new BrowserServiceError(`Browser control response exceeded ${maxBytes} bytes`) });
		return JSON.parse(decodeBrowserControlResponseUtf8(body, res.status));
	} finally {
		abort.dispose();
		await release?.();
	}
}
/** Fetch JSON from browser control over HTTP or local dispatcher transport. */
async function fetchBrowserJson(url, init) {
	const timeoutMs = resolveTimerTimeoutMs(init?.timeoutMs, 5e3);
	const scope = getBrowserRequestScope();
	let isDispatcherPath = false;
	try {
		if (isAbsoluteHttp(url)) {
			if (scope) throw new Error("Dashboard browser requests must stay on the local managed browser");
			return await fetchHttpJson(url, {
				...withLoopbackBrowserAuth(url, init),
				timeoutMs
			});
		}
		isDispatcherPath = true;
		const { dispatchBrowserControlRequest } = await import("./local-dispatch.runtime.js");
		const parsed = new URL(url, "http://localhost");
		const query = {};
		for (const [key, value] of parsed.searchParams.entries()) query[key] = value;
		if (scope) query.managedOnly = true;
		let body = init?.body;
		if (typeof body === "string") try {
			body = JSON.parse(body);
		} catch {}
		const abort = createBrowserRequestAbort(timeoutMs, init?.signal);
		const { signal } = abort;
		let abortListener;
		const abortPromise = signal.aborted ? Promise.reject(toErrorObject(signal.reason ?? /* @__PURE__ */ new Error("aborted"), "Non-Error rejection")) : new Promise((_, reject) => {
			abortListener = () => reject(toErrorObject(signal.reason ?? /* @__PURE__ */ new Error("aborted"), "Non-Error rejection"));
			signal.addEventListener("abort", abortListener, { once: true });
		});
		const dispatchPromise = dispatchBrowserControlRequest({
			method: init?.method?.toUpperCase() === "DELETE" ? "DELETE" : init?.method?.toUpperCase() === "POST" ? "POST" : "GET",
			path: parsed.pathname,
			query,
			body,
			signal,
			...scope ? { assertCurrent: scope.assertCurrent } : {}
		});
		const result = await Promise.race([dispatchPromise, abortPromise]).finally(() => {
			abort.dispose();
			if (abortListener) signal.removeEventListener("abort", abortListener);
		});
		if (result.status >= 400) {
			if (result.status === 429) throw new BrowserServiceError(`${resolveBrowserRateLimitMessage(url)} ${BROWSER_TOOL_PERSISTENT_MODEL_HINT}`);
			throw browserServiceErrorFromPayload(result.body, `HTTP ${result.status}`, result.status);
		}
		return result.body;
	} catch (err) {
		if (err instanceof BrowserServiceError) throw err;
		if (isDispatcherPath) throw enhanceDispatcherPathError(url, err);
		throw enhanceBrowserFetchError(url, err, timeoutMs);
	}
}
//#endregion
//#region extensions/browser/src/browser/client-request.ts
function browserClientTimeout(target, requested, localDefault) {
	return typeof target === "function" ? requested : resolveTimerTimeoutMs(requested, localDefault);
}
/** Send the same explicitly projected request through the selected transport. */
async function requestBrowserJson(target, path, opts = {}) {
	if (typeof target === "function") return await target({
		...opts,
		method: opts.method ?? "GET",
		path
	});
	const query = new URLSearchParams();
	for (const [key, value] of Object.entries(opts.query ?? {})) if (value !== void 0) query.set(key, String(value));
	const suffix = query.size ? `${path.includes("?") ? "&" : "?"}${query}` : "";
	const profile = opts.profile ? `${suffix || path.includes("?") ? "&" : "?"}profile=${encodeURIComponent(opts.profile)}` : "";
	return await fetchBrowserJson(`${target?.trim().replace(/\/$/, "") ?? ""}${path}${suffix}${profile}`, {
		method: opts.method,
		...opts.body === void 0 ? {} : {
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(opts.body)
		},
		timeoutMs: opts.timeoutMs,
		signal: opts.signal
	});
}
function postBrowserJson(target, path, body, timeoutMs, opts) {
	return requestBrowserJson(target, path, {
		method: "POST",
		body,
		timeoutMs,
		profile: opts?.profile,
		signal: opts?.signal
	});
}
//#endregion
export { fetchBrowserJson as a, BrowserServiceError as i, postBrowserJson as n, withBrowserRequestScope as o, requestBrowserJson as r, browserClientTimeout as t };
