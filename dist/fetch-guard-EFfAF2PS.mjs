import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { f as isLoopbackIpAddress } from "./ip-CDH5BTTD.mjs";
import { i as logWarn } from "./logger-BHMMVs5C.mjs";
import { c as shouldUseEnvHttpProxyForUrl } from "./proxy-env-BwCPCI9p.mjs";
import { t as getActiveManagedProxyLoopbackMode } from "./active-proxy-state-e8AvA0BH.mjs";
import { c as resolveUndiciAutoSelectFamilyConnectOptions, n as createHttp1EnvHttpProxyAgent, r as createHttp1ProxyAgent, t as createHttp1Agent } from "./undici-runtime-Ba076JJD.mjs";
import { o as globalUndiciStreamTimeoutMs } from "./undici-global-dispatcher-CKERJRZ6.mjs";
import { t as cancelUnreadResponseBody } from "./http-response-body-DXfezLdR.mjs";
import "./http-body-Bl_jph25.mjs";
import { n as buildTimeoutAbortSignal } from "./fetch-timeout-BOG6Do5a.mjs";
import { n as normalizeHeadersInitForFetch, r as normalizeRequestInitHeadersForFetch } from "./fetch-headers-DD03wtQj.mjs";
import { _ as resolvePinnedHostnameWithPolicy, a as createPinnedDispatcher, i as closeDispatcher, n as assertHostnameAllowedWithPolicy, p as matchesHostnameAllowlist, t as SsrFBlockedError, v as resolveSsrFPolicyForUrl } from "./ssrf-BQRtcdBp.mjs";
import "./pinned-dispatcher-pool-DxmgGQxN.mjs";
import { i as isMockedFetch, n as fetchWithRuntimeDispatcher } from "./runtime-fetch-BrykW3rc.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/infra/net/configured-local-origin-bypass.ts
function resolveHttpOrigin(value) {
	try {
		const parsed = new URL(value.trim());
		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return;
		parsed.hostname = parsed.hostname.replace(/\.+$/, "");
		return parsed.origin.toLowerCase();
	} catch {
		return;
	}
}
function isLoopbackManagedProxyBypassHost(hostname) {
	const normalized = hostname.trim().toLowerCase().replace(/\.+$/, "").replace(/^\[(.*)\]$/, "$1");
	return normalized === "localhost" || isLoopbackIpAddress(normalized);
}
function isExactConfiguredLocalOriginBypass(params) {
	if (params.managedProxyBypass?.kind !== "configured-local-origin") return false;
	const baseOrigin = resolveHttpOrigin(params.managedProxyBypass.baseUrl);
	if (!baseOrigin) return false;
	let baseHostname;
	try {
		baseHostname = new URL(params.managedProxyBypass.baseUrl.trim()).hostname;
	} catch {
		return false;
	}
	if (!isLoopbackManagedProxyBypassHost(baseHostname)) return false;
	return resolveHttpOrigin(params.url.toString()) === baseOrigin;
}
function isPinnedLoopbackTarget(addresses) {
	return addresses.length > 0 && addresses.every((address) => isLoopbackIpAddress(address));
}
/** Return whether proving a configured local-origin bypass requires target DNS. */
function shouldResolveConfiguredLocalOriginManagedProxyBypass(params) {
	return isExactConfiguredLocalOriginBypass(params);
}
/** Return whether a configured local provider origin may bypass the managed proxy. */
function shouldUseConfiguredLocalOriginManagedProxyBypass(params) {
	if (!isExactConfiguredLocalOriginBypass(params)) return false;
	const loopbackMode = getActiveManagedProxyLoopbackMode();
	if (loopbackMode === "proxy") return false;
	if (loopbackMode === "block" && isLoopbackManagedProxyBypassHost(params.url.hostname)) throw new SsrFBlockedError("proxy: configured local provider loopback connections are blocked by proxy.loopbackMode");
	return isPinnedLoopbackTarget(params.resolvedAddresses);
}
//#endregion
//#region src/infra/net/fetch-request-authority.ts
const requestAuthority = resolveGlobalSingleton(Symbol.for("openclaw.guardedFetchRequestAuthority"), () => new AsyncLocalStorage());
/** Capture before transport preparation so redirects retain the original caller. */
function captureGuardedFetchRequestAuthority() {
	return requestAuthority.getStore();
}
/** Carry a host-owned assertion through provider preparation without granting new authority. */
async function withGuardedFetchRequestAuthority(assertCurrent, run) {
	const inherited = requestAuthority.getStore();
	if (!assertCurrent && !inherited) return await run(void 0);
	let active = true;
	const assertAuthority = () => {
		inherited?.();
		if (!active) throw new Error("Guarded request authority is no longer active.");
		const result = assertCurrent?.();
		if (isPromiseLike(result)) {
			Promise.resolve(result).catch(() => void 0);
			throw new TypeError("Guarded request authority must be synchronous.");
		}
	};
	try {
		assertAuthority();
		return await requestAuthority.run(assertAuthority, () => run(assertAuthority));
	} finally {
		active = false;
	}
}
//#endregion
//#region src/infra/net/guarded-body-stream.ts
/**
* Shared body-stream cleanup for guarded fetch consumers (`fetchWithSsrFGuard`
* callers that re-wrap streaming responses).
*/
const guardedBodyCleanupRegistry = new FinalizationRegistry((held) => {
	held.finalize().catch(() => void 0);
});
const guardedBodyAbortOwners = /* @__PURE__ */ new WeakMap();
function wrapBodyStream(params, errorSource) {
	let reader;
	let finalized = false;
	let abortAttached = false;
	let detachAbort = () => {};
	const cleanupRegistrationToken = {};
	const finalize = async (cancelReader = async () => {
		await reader?.cancel().catch(() => void 0);
	}) => {
		if (finalized) return;
		finalized = true;
		detachAbort();
		guardedBodyCleanupRegistry.unregister(cleanupRegistrationToken);
		const [cancellation, readerRelease, cleanup] = await Promise.allSettled([
			cancelReader(),
			(async () => reader?.releaseLock())(),
			(async () => await params.cleanup())()
		]);
		if (cleanup.status === "rejected" && errorSource === "release") throw cleanup.reason;
		if (readerRelease.status === "rejected") throw readerRelease.reason;
		if (cancellation.status === "rejected" && errorSource === "cancellation") throw cancellation.reason;
	};
	const wrappedBody = new ReadableStream({
		start() {
			reader = params.body.getReader();
		},
		async pull(controller) {
			const signal = params.signal;
			if (signal && !abortAttached) {
				abortAttached = true;
				const owner = { abort: () => {
					if (finalized) return;
					const reason = signal.reason ?? new DOMException("This operation was aborted", "AbortError");
					const cleanup = finalize(async () => await reader?.cancel(reason));
					controller.error(reason);
					cleanup.catch(() => void 0);
				} };
				guardedBodyAbortOwners.set(wrappedBody, owner);
				const ownerRef = new WeakRef(owner);
				const abort = () => ownerRef.deref()?.abort();
				if (signal.aborted) abort();
				else {
					signal.addEventListener("abort", abort, { once: true });
					detachAbort = () => signal.removeEventListener("abort", abort);
				}
			}
			if (finalized) return;
			try {
				const chunk = await reader?.read();
				if (!chunk || chunk.done) {
					controller.close();
					await finalize();
					return;
				}
				params.refreshTimeout?.();
				controller.enqueue(chunk.value);
			} catch (error) {
				if (finalized) return;
				if (errorSource === "release") await finalize();
				controller.error(error);
				await finalize();
			}
		},
		async cancel(reason) {
			await finalize(async () => await reader?.cancel(reason));
		}
	}, params.signal ? { highWaterMark: 0 } : void 0);
	guardedBodyCleanupRegistry.register(wrappedBody, { finalize }, cleanupRegistrationToken);
	return wrappedBody;
}
/** Wraps a guarded body with best-effort cleanup and explicit cancellation errors. */
function wrapGuardedBodyStream(params) {
	return wrapBodyStream(params, "cancellation");
}
/** Preserves post-header request cancellation around runtime fetch body streams. */
function responseWithAbortSignal(response, signal) {
	if (!response.body || !signal) return response;
	const wrapped = new Response(wrapBodyStream({
		body: response.body,
		cleanup: () => {},
		signal
	}, "cancellation"), {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers
	});
	const applyMetadata = (target) => {
		Object.defineProperties(target, {
			headers: { value: response.headers },
			url: { value: response.url },
			redirected: { value: response.redirected },
			type: { value: response.type },
			clone: {
				configurable: true,
				value: () => applyMetadata(Response.prototype.clone.call(target)),
				writable: true
			}
		});
		return target;
	};
	return applyMetadata(wrapped);
}
const NULL_BODY_STATUSES = /* @__PURE__ */ new Set([
	101,
	103,
	204,
	205,
	304
]);
/** Keeps request ownership through body completion, failure, or cancellation. */
function responseWithRelease(response, release) {
	if (!response.body || NULL_BODY_STATUSES.has(response.status)) {
		(async () => await release())();
		return response;
	}
	return new Response(wrapBodyStream({
		body: response.body,
		cleanup: release
	}, "release"), {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers
	});
}
//#endregion
//#region src/infra/net/redirect-headers.ts
const CROSS_ORIGIN_REDIRECT_SAFE_HEADERS = /* @__PURE__ */ new Set([
	"accept",
	"accept-encoding",
	"accept-language",
	"cache-control",
	"content-language",
	"content-type",
	"if-match",
	"if-modified-since",
	"if-none-match",
	"if-unmodified-since",
	"pragma",
	"range",
	"user-agent"
]);
/**
* Keeps only headers that are safe to replay after a redirect crosses origins.
* Authorization/cookie-like metadata must be dropped before the follow-up fetch.
*/
function retainSafeHeadersForCrossOriginRedirect$1(headers) {
	if (!headers) return headers;
	const incoming = new Headers(normalizeHeadersInitForFetch(headers));
	const safeHeaders = {};
	for (const [key, value] of incoming.entries()) if (CROSS_ORIGIN_REDIRECT_SAFE_HEADERS.has(normalizeLowercaseStringOrEmpty(key))) safeHeaders[key] = value;
	return safeHeaders;
}
//#endregion
//#region src/infra/net/fetch-guard.ts
function resolveDispatcherTimeoutMs(fromParams) {
	return fromParams !== void 0 ? fromParams : globalUndiciStreamTimeoutMs;
}
const GUARDED_FETCH_MODE = {
	STRICT: "strict",
	TRUSTED_ENV_PROXY: "trusted_env_proxy",
	TRUSTED_EXPLICIT_PROXY: "trusted_explicit_proxy"
};
var GuardedFetchRedirectError = class extends Error {
	constructor(params) {
		super(`Too many redirects (limit: ${params.maxRedirects})`);
		this.name = "GuardedFetchRedirectError";
		this.status = params.status;
		this.maxRedirects = params.maxRedirects;
	}
};
const DEFAULT_MAX_REDIRECTS = 3;
const OPENCLAW_DEBUG_PROXY_ENABLED = "OPENCLAW_DEBUG_PROXY_ENABLED";
function getRedirectVisitKey(url, init) {
	return `${init?.method?.toUpperCase() ?? "GET"} ${url}`;
}
function isTruthyEnvValue(value) {
	return value === "1" || value === "true" || value === "yes" || value === "on";
}
function withStrictGuardedFetchMode(params) {
	return {
		...params,
		mode: GUARDED_FETCH_MODE.STRICT
	};
}
function withTrustedEnvProxyGuardedFetchMode(params) {
	return {
		...params,
		mode: GUARDED_FETCH_MODE.TRUSTED_ENV_PROXY
	};
}
function withTrustedExplicitProxyGuardedFetchMode(params) {
	return {
		...params,
		mode: GUARDED_FETCH_MODE.TRUSTED_EXPLICIT_PROXY
	};
}
function resolveGuardedFetchMode(params) {
	if (params.mode) return params.mode;
	if (params.proxy === "env" && params.dangerouslyAllowEnvProxyWithoutPinnedDns === true) return GUARDED_FETCH_MODE.TRUSTED_ENV_PROXY;
	return GUARDED_FETCH_MODE.STRICT;
}
function isManagedProxyActive() {
	return process.env["OPENCLAW_PROXY_ACTIVE"] === "1";
}
function assertExplicitProxySupportsPinnedDns(url, dispatcherPolicy, pinDns) {
	if (pinDns !== false && dispatcherPolicy?.mode === "explicit-proxy" && url.protocol !== "https:") throw new Error("Explicit proxy SSRF pinning requires HTTPS targets; plain HTTP targets are not supported");
}
function createPolicyDispatcherWithoutPinnedDns(dispatcherPolicy, timeoutMs) {
	if (!dispatcherPolicy) return null;
	if (dispatcherPolicy.mode === "direct") return createHttp1Agent(dispatcherPolicy.connect ? { connect: { ...dispatcherPolicy.connect } } : void 0, timeoutMs);
	if (dispatcherPolicy.mode === "env-proxy") return createHttp1EnvHttpProxyAgent({
		...dispatcherPolicy.connect ? { connect: { ...dispatcherPolicy.connect } } : {},
		...dispatcherPolicy.proxyTls ? { proxyTls: { ...dispatcherPolicy.proxyTls } } : {}
	}, timeoutMs);
	const proxyUrl = dispatcherPolicy.proxyUrl.trim();
	const requestTls = dispatcherPolicy.proxyTls;
	return createHttp1ProxyAgent({
		uri: proxyUrl,
		...requestTls ? { requestTls: { ...requestTls } } : {}
	}, timeoutMs);
}
async function assertExplicitProxyAllowed(dispatcherPolicy, lookupFn, policy, signal, trustedProxy) {
	if (!dispatcherPolicy || dispatcherPolicy.mode !== "explicit-proxy") return;
	let parsedProxyUrl;
	try {
		parsedProxyUrl = new URL(dispatcherPolicy.proxyUrl);
	} catch {
		throw new Error("Invalid explicit proxy URL");
	}
	const trustedSocks = trustedProxy && ["socks:", "socks5:"].includes(parsedProxyUrl.protocol);
	if (!["http:", "https:"].includes(parsedProxyUrl.protocol) && !trustedSocks) throw new Error("Explicit proxy URL must use http or https");
	const proxyPolicy = policy || dispatcherPolicy.allowPrivateProxy === true ? {
		...policy,
		hostnameAllowlist: void 0,
		...dispatcherPolicy.allowPrivateProxy === true ? { allowPrivateNetwork: true } : {}
	} : void 0;
	await resolvePinnedHostnameWithPolicy(parsedProxyUrl.hostname, {
		lookupFn,
		policy: proxyPolicy,
		signal
	});
}
function isRedirectStatus(status) {
	return status === 301 || status === 302 || status === 303 || status === 307 || status === 308;
}
function isAmbientGlobalFetch(params) {
	return typeof params.fetchImpl === "function" && typeof params.globalFetch === "function" && params.fetchImpl === params.globalFetch;
}
function retainSafeHeadersForCrossOriginRedirectHeaders(headers) {
	return retainSafeHeadersForCrossOriginRedirect$1(headers);
}
async function prepareGuardedFetchCapture(params, fetchImpl) {
	if (params.capture === false || !isTruthyEnvValue(process.env[OPENCLAW_DEBUG_PROXY_ENABLED])) return { fetchImpl };
	const { prepareHttpCapture, resolveDebugProxyFetchTransport } = await import("./runtime-DyhdZuIn.mjs");
	return {
		fetchImpl: resolveDebugProxyFetchTransport(fetchImpl),
		capture: prepareHttpCapture()
	};
}
function retainSafeHeadersForCrossOriginRedirect(init) {
	if (!init?.headers) return init;
	return {
		...init,
		headers: retainSafeHeadersForCrossOriginRedirect$1(init.headers)
	};
}
function resolveRetainedAuthorizationForRedirect(params) {
	const init = params.init;
	if (!init?.headers || !params.hostnameAllowlist?.length) return;
	if (params.nextUrl.protocol !== "https:") return;
	if (!params.hostnameAllowlist.includes("*") && !matchesHostnameAllowlist(params.nextUrl.hostname, params.hostnameAllowlist)) return;
	const normalizedInit = normalizeRequestInitHeadersForFetch(init);
	if (!normalizedInit?.headers) return;
	return new Headers(normalizedInit.headers).get("authorization") ?? void 0;
}
function restoreRedirectAuthorization(params) {
	if (!params.authorization) return params.init;
	const headers = new Headers(params.init?.headers);
	headers.set("Authorization", params.authorization);
	return {
		...params.init,
		headers
	};
}
function dropBodyHeaders(headers) {
	if (!headers) return headers;
	const nextHeaders = new Headers(normalizeHeadersInitForFetch(headers));
	nextHeaders.delete("content-encoding");
	nextHeaders.delete("content-language");
	nextHeaders.delete("content-length");
	nextHeaders.delete("content-location");
	nextHeaders.delete("content-type");
	nextHeaders.delete("transfer-encoding");
	return nextHeaders;
}
function rewriteRedirectInitForMethod(params) {
	const { init, status } = params;
	if (!init) return init;
	const currentMethod = init.method?.toUpperCase() ?? "GET";
	if (!(status === 303 ? currentMethod !== "GET" && currentMethod !== "HEAD" : (status === 301 || status === 302) && currentMethod === "POST")) return init;
	return {
		...init,
		method: "GET",
		body: void 0,
		headers: dropBodyHeaders(init.headers)
	};
}
function rewriteRedirectInitForCrossOrigin(params) {
	const { init, allowUnsafeReplay } = params;
	if (!init || allowUnsafeReplay) return init;
	const currentMethod = init.method?.toUpperCase() ?? "GET";
	if (currentMethod === "GET" || currentMethod === "HEAD") return init;
	return {
		...init,
		body: void 0,
		headers: dropBodyHeaders(init.headers)
	};
}
async function fetchWithSsrFGuard(params) {
	const { managedProxyBypass: _ignoredManagedProxyBypass, ...publicParams } = params;
	return await fetchWithSsrFGuardInternal(publicParams);
}
async function fetchConfiguredLocalOriginWithSsrFGuard({ configuredLocalOriginBaseUrl, ...params }) {
	return await fetchWithSsrFGuardInternal({
		...params,
		managedProxyBypass: {
			kind: "configured-local-origin",
			baseUrl: configuredLocalOriginBaseUrl
		}
	});
}
async function fetchWithSsrFGuardInternal(params) {
	const assertCurrent = captureGuardedFetchRequestAuthority();
	const globalFetch = globalThis.fetch;
	const defaultFetch = params.fetchImpl ?? globalFetch;
	if (!defaultFetch) throw new Error("fetch is not available");
	const isUsingMockedFetch = isMockedFetch(defaultFetch);
	const supportsDispatcherInit = params.fetchImpl !== void 0 && !isAmbientGlobalFetch({
		fetchImpl: params.fetchImpl,
		globalFetch
	}) || isUsingMockedFetch;
	const captureAdmission = await prepareGuardedFetchCapture(params, defaultFetch);
	const maxRedirects = typeof params.maxRedirects === "number" && Number.isFinite(params.maxRedirects) ? Math.max(0, Math.floor(params.maxRedirects)) : DEFAULT_MAX_REDIRECTS;
	const mode = resolveGuardedFetchMode(params);
	const { signal, cleanup, refresh } = buildTimeoutAbortSignal({
		timeoutMs: params.timeoutMs,
		signal: params.signal ?? params.init?.signal ?? void 0,
		operation: "fetchWithSsrFGuard",
		url: params.url
	});
	let finished = false;
	const finishRequest = async (releaseDispatcher) => {
		if (finished) return;
		finished = true;
		cleanup();
		await releaseDispatcher?.();
	};
	let currentUrl = params.url;
	let currentInit = normalizeRequestInitHeadersForFetch(params.init ? { ...params.init } : void 0);
	const visited = /* @__PURE__ */ new Set([getRedirectVisitKey(currentUrl, currentInit)]);
	let redirectCount = 0;
	while (true) {
		let parsedUrl;
		try {
			parsedUrl = new URL(currentUrl);
		} catch {
			await finishRequest();
			throw new Error("Invalid URL: must be http or https");
		}
		if (!["http:", "https:"].includes(parsedUrl.protocol)) {
			await finishRequest();
			throw new Error("Invalid URL: must be http or https");
		}
		if (params.requireHttps === true && parsedUrl.protocol !== "https:") {
			await finishRequest();
			throw new Error("URL must use https");
		}
		let dispatcher = null;
		let dispatcherLease;
		let response;
		const requestController = new AbortController();
		const releaseDispatcher = async () => {
			requestController.abort();
			await cancelUnreadResponseBody(response);
			await (dispatcherLease ? dispatcherLease.release() : closeDispatcher(dispatcher));
		};
		const policyForUrl = resolveSsrFPolicyForUrl(parsedUrl, params.policy);
		const dispatcherPolicy = params.resolveDispatcherPolicy?.(parsedUrl) ?? params.dispatcherPolicy;
		const resolvePinnedHostname = async () => await resolvePinnedHostnameWithPolicy(parsedUrl.hostname, {
			lookupFn: params.lookupFn,
			policy: policyForUrl,
			signal
		});
		try {
			const usesTrustedExplicitProxyMode = mode === GUARDED_FETCH_MODE.TRUSTED_EXPLICIT_PROXY && dispatcherPolicy?.mode === "explicit-proxy";
			assertExplicitProxySupportsPinnedDns(parsedUrl, dispatcherPolicy, usesTrustedExplicitProxyMode ? false : params.pinDns);
			await assertExplicitProxyAllowed(dispatcherPolicy, params.lookupFn, params.policy, signal, usesTrustedExplicitProxyMode);
			const isStrictManagedProxyActive = mode === GUARDED_FETCH_MODE.STRICT && isManagedProxyActive();
			const shouldCheckManagedProxyBypass = isStrictManagedProxyActive && shouldResolveConfiguredLocalOriginManagedProxyBypass({
				url: parsedUrl,
				managedProxyBypass: params.managedProxyBypass
			});
			const canUseManagedProxy = isStrictManagedProxyActive && (shouldUseEnvHttpProxyForUrl(parsedUrl.toString()) || shouldCheckManagedProxyBypass);
			const canUseTrustedEnvProxy = (mode === GUARDED_FETCH_MODE.TRUSTED_ENV_PROXY || params.useEnvProxyForEligibleUrls === true && !canUseManagedProxy) && !dispatcherPolicy && shouldUseEnvHttpProxyForUrl(parsedUrl.toString());
			const canUseMockedFetchWithoutDns = isUsingMockedFetch && params.lookupFn === void 0 && !canUseTrustedEnvProxy && !canUseManagedProxy && !usesTrustedExplicitProxyMode && params.pinDns !== false;
			const timeoutMs = resolveDispatcherTimeoutMs(params.timeoutMs);
			if (canUseTrustedEnvProxy || canUseManagedProxy || params.pinDns === false) assertHostnameAllowedWithPolicy(parsedUrl.hostname, policyForUrl);
			if (canUseTrustedEnvProxy) dispatcher = createHttp1EnvHttpProxyAgent(void 0, timeoutMs);
			else if (canUseManagedProxy) {
				if (shouldCheckManagedProxyBypass) {
					const pinned = await resolvePinnedHostname();
					dispatcher = shouldUseConfiguredLocalOriginManagedProxyBypass({
						url: parsedUrl,
						managedProxyBypass: params.managedProxyBypass,
						resolvedAddresses: pinned.addresses
					}) ? createPinnedDispatcher(pinned, dispatcherPolicy, policyForUrl, timeoutMs) : createHttp1EnvHttpProxyAgent({
						noProxy: "",
						...dispatcherPolicy?.mode === "direct" && dispatcherPolicy.connect ? { requestTls: { ...dispatcherPolicy.connect } } : {}
					}, timeoutMs);
				} else dispatcher = createHttp1EnvHttpProxyAgent(void 0, timeoutMs);
			} else if (usesTrustedExplicitProxyMode) {
				assertHostnameAllowedWithPolicy(parsedUrl.hostname, policyForUrl);
				dispatcher = createPolicyDispatcherWithoutPinnedDns(dispatcherPolicy, timeoutMs);
			} else if (canUseMockedFetchWithoutDns) assertHostnameAllowedWithPolicy(parsedUrl.hostname, policyForUrl);
			else if (params.pinDns === false) {
				await resolvePinnedHostname();
				dispatcher = createPolicyDispatcherWithoutPinnedDns(dispatcherPolicy, timeoutMs);
			} else {
				const pinned = await resolvePinnedHostname();
				if (params.dispatcherPool && mode === GUARDED_FETCH_MODE.STRICT && dispatcherPolicy === void 0) {
					const familyConnect = resolveUndiciAutoSelectFamilyConnectOptions();
					const key = JSON.stringify({
						origin: parsedUrl.origin,
						addresses: [...pinned.addresses].toSorted(),
						timeoutMs: timeoutMs ?? null,
						familyConnect: familyConnect ?? null,
						policy: policyForUrl ?? null
					});
					dispatcherLease = params.dispatcherPool.acquire({
						key,
						groupKey: parsedUrl.origin,
						createDispatcher: () => createPinnedDispatcher(pinned, familyConnect ? {
							mode: "direct",
							connect: familyConnect
						} : void 0, policyForUrl, timeoutMs)
					});
					dispatcher = dispatcherLease ? dispatcherLease.dispatcher : createPinnedDispatcher(pinned, void 0, policyForUrl, timeoutMs);
				} else dispatcher = createPinnedDispatcher(pinned, dispatcherPolicy, policyForUrl, timeoutMs);
			}
			const init = {
				...currentInit ? { ...currentInit } : {},
				redirect: "manual",
				...dispatcher ? { dispatcher } : {},
				signal: signal ? AbortSignal.any([signal, requestController.signal]) : requestController.signal
			};
			const shouldUseRuntimeFetch = Boolean(dispatcher) && !supportsDispatcherInit;
			const beforeRequestResult = params.beforeRequest?.();
			if (isPromiseLike(beforeRequestResult)) {
				Promise.resolve(beforeRequestResult).catch(() => void 0);
				throw new TypeError("beforeRequest must be synchronous.");
			}
			assertCurrent?.();
			const captureParams = {
				url: parsedUrl.toString(),
				method: currentInit?.method ?? "GET",
				signal: process.versions.bun ? init.signal ?? void 0 : void 0,
				requestHeaders: currentInit?.headers,
				requestBody: currentInit?.body ?? null,
				transport: "http",
				flowId: params.capture === false ? void 0 : params.capture?.flowId,
				meta: {
					captureOrigin: "guarded-fetch",
					...params.auditContext ? { auditContext: params.auditContext } : {},
					...params.capture === false ? {} : params.capture?.meta,
					...params.capture && params.capture.sensitiveRequestHeaderNames ? { sensitiveRequestHeaderNames: params.capture.sensitiveRequestHeaderNames } : {}
				}
			};
			try {
				response = shouldUseRuntimeFetch ? await fetchWithRuntimeDispatcher(parsedUrl.toString(), init) : await captureAdmission.fetchImpl(parsedUrl.toString(), init);
			} catch (error) {
				captureAdmission.capture?.({
					...captureParams,
					error
				});
				throw error;
			}
			captureAdmission.capture?.({
				...captureParams,
				response
			});
			if (isRedirectStatus(response.status)) {
				redirectCount += 1;
				if (redirectCount > maxRedirects) throw new GuardedFetchRedirectError({
					status: response.status,
					maxRedirects
				});
				const location = response.headers.get("location");
				if (!location) throw new Error(`Redirect missing location header (${response.status})`);
				const nextParsedUrl = new URL(location, parsedUrl);
				const nextUrl = nextParsedUrl.toString();
				const retainedAuthorization = resolveRetainedAuthorizationForRedirect({
					init: currentInit,
					nextUrl: nextParsedUrl,
					hostnameAllowlist: params.retainAuthorizationRedirectHostnameAllowlist
				});
				currentInit = rewriteRedirectInitForMethod({
					init: currentInit,
					status: response.status
				});
				if (nextParsedUrl.origin !== parsedUrl.origin) {
					currentInit = rewriteRedirectInitForCrossOrigin({
						init: currentInit,
						allowUnsafeReplay: params.allowCrossOriginUnsafeRedirectReplay === true
					});
					currentInit = retainSafeHeadersForCrossOriginRedirect(currentInit);
					currentInit = restoreRedirectAuthorization({
						init: currentInit,
						authorization: retainedAuthorization
					});
				}
				const nextVisitKey = getRedirectVisitKey(nextUrl, currentInit);
				if (visited.has(nextVisitKey)) throw new Error("Redirect loop detected");
				visited.add(nextVisitKey);
				await releaseDispatcher();
				currentUrl = nextUrl;
				continue;
			}
			return {
				response: process.versions.bun && !(response instanceof Response) ? responseWithAbortSignal(response, init.signal ?? void 0) : response,
				finalUrl: currentUrl,
				release: async () => finishRequest(releaseDispatcher),
				refreshTimeout: refresh,
				dispatcherReused: dispatcherLease?.reused
			};
		} catch (err) {
			if (err instanceof SsrFBlockedError) {
				const context = params.auditContext ?? "url-fetch";
				logWarn(`security: blocked URL fetch (${context}) targetOrigin=${parsedUrl.origin} reason=${err.message}`);
			}
			await finishRequest(releaseDispatcher);
			throw err;
		}
	}
}
//#endregion
export { isManagedProxyActive as a, withTrustedEnvProxyGuardedFetchMode as c, responseWithRelease as d, wrapGuardedBodyStream as f, fetchWithSsrFGuard as i, withTrustedExplicitProxyGuardedFetchMode as l, GuardedFetchRedirectError as n, retainSafeHeadersForCrossOriginRedirectHeaders as o, withGuardedFetchRequestAuthority as p, fetchConfiguredLocalOriginWithSsrFGuard as r, withStrictGuardedFetchMode as s, GUARDED_FETCH_MODE as t, retainSafeHeadersForCrossOriginRedirect$1 as u };
