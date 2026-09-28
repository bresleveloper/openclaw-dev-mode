import { C as isLoopbackIpAddress, E as isUnspecifiedIpAddress, O as parseCanonicalIpAddress, S as isLinkLocalIpAddress, _ as isBlockedSpecialUseIpv6Address, a as createHttp1ProxyAgent, b as isIpv4Address, d as shouldUseEnvHttpProxyForUrl, g as isBlockedSpecialUseIpv4Address, h as extractEmbeddedIpv4FromIpv6, i as createHttp1EnvHttpProxyAgent, k as parseLooseIpAddress, m as logWarn, n as globalUndiciStreamTimeoutMs, o as loadUndiciRuntimeDeps, r as createHttp1Agent, s as resolveUndiciAutoSelectFamilyConnectOptions, u as getActiveManagedProxyLoopbackMode, v as isCanonicalDottedDecimalIPv4, x as isLegacyIpv4Literal, y as isCloudMetadataIpAddress } from "./undici-global-dispatcher-Dp-3hP64.mjs";
import { F as normalizeLowercaseStringOrEmpty } from "./utils-C25eiuh1.mjs";
import { d as resolveGlobalSingleton, it as redactSensitiveUrlLikeString, rt as truncateUtf16Safe, tt as expectDefined } from "./redact-0yyk4gHy.mjs";
import { t as cancelUnreadResponseBody } from "./http-body-CFTfWud1.mjs";
import { o as normalizeUniqueStringEntries } from "./string-normalization-CNyvKrgf.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { o as resolveSafeTimeoutDelayMs } from "./timeouts-DVvIntvk.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { t as createSubsystemLogger } from "./subsystem-DA9--fnw.mjs";
import { n as normalizeHeadersInitForFetch, r as normalizeRequestInitHeadersForFetch } from "./fetch-headers-DD03wtQj.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { lookup } from "node:dns";
import { lookup as lookup$1 } from "node:dns/promises";
//#region src/utils/fetch-timeout.ts
const log = createSubsystemLogger("fetch-timeout");
const LOG_URL_MAX_CHARS = 500;
const URL_SECRET_SUFFIX_PATTERN = /[?#]/;
function sanitizeTimeoutLogUrl(rawUrl) {
	const trimmed = rawUrl?.trim();
	if (!trimmed) return;
	try {
		const parsed = new URL(trimmed);
		parsed.username = "";
		parsed.password = "";
		parsed.search = "";
		parsed.hash = "";
		const value = redactSensitiveUrlLikeString(parsed.toString());
		return value.length > LOG_URL_MAX_CHARS ? `${truncateUtf16Safe(value, LOG_URL_MAX_CHARS)}...` : value;
	} catch {
		const withoutQueryOrHash = trimmed.split(URL_SECRET_SUFFIX_PATTERN, 1)[0] ?? "";
		const cleaned = redactSensitiveUrlLikeString(withoutQueryOrHash.replace(/[\r\n\u2028\u2029]+/g, " ").replace(/\p{Cc}+/gu, " ").replace(/\s+/g, " ").trim());
		if (!cleaned) return;
		return cleaned.length > LOG_URL_MAX_CHARS ? `${truncateUtf16Safe(cleaned, LOG_URL_MAX_CHARS)}...` : cleaned;
	}
}
function abortDueToTimeout(controller, timeoutMs, startedAtMs, operation, url, combinedSignal) {
	if (combinedSignal?.aborted ?? controller.signal.aborted) return;
	const sanitizedUrl = sanitizeTimeoutLogUrl(url);
	const elapsedMs = Math.max(0, Date.now() - startedAtMs);
	const delayMs = Math.max(0, elapsedMs - timeoutMs);
	const eventLoopDelayHint = delayMs >= Math.max(1e3, timeoutMs * .5) ? `timer delayed ${delayMs}ms, likely event-loop starvation` : null;
	const consoleMessage = [
		`fetch timeout after ${timeoutMs}ms`,
		`(elapsed ${elapsedMs}ms)`,
		eventLoopDelayHint,
		operation ? `operation=${operation}` : null,
		sanitizedUrl ? `url=${sanitizedUrl}` : null
	].filter((part) => Boolean(part)).join(" ");
	log.warn("fetch timeout reached; aborting operation", {
		timeoutMs,
		elapsedMs,
		...eventLoopDelayHint ? {
			timerDelayMs: delayMs,
			eventLoopDelayHint
		} : {},
		consoleMessage,
		...operation ? { operation } : {},
		...sanitizedUrl ? { url: sanitizedUrl } : {}
	});
	const error = /* @__PURE__ */ new Error("request timed out");
	error.name = "TimeoutError";
	controller.abort(error);
}
/**
* Builds an abort signal that combines an optional parent signal with a timeout.
* Callers must run `cleanup`; `refresh` restarts only the internal timeout timer.
*/
function buildTimeoutAbortSignal(params) {
	const { timeoutMs, signal: parentSignal } = params;
	if (!timeoutMs && !parentSignal) return {
		signal: void 0,
		cleanup: () => {},
		refresh: () => {}
	};
	if (!timeoutMs) return {
		signal: parentSignal,
		cleanup: () => {},
		refresh: () => {}
	};
	const controller = new AbortController();
	const signal = parentSignal ? AbortSignal.any([parentSignal, controller.signal]) : controller.signal;
	const normalizedTimeoutMs = resolveSafeTimeoutDelayMs(timeoutMs);
	let active = true;
	let timeoutId;
	const scheduleTimeout = () => {
		timeoutId = setTimeout(abortDueToTimeout, normalizedTimeoutMs, controller, normalizedTimeoutMs, Date.now(), params.operation, params.url, signal);
	};
	scheduleTimeout();
	return {
		signal,
		refresh: () => {
			if (!active || signal.aborted) return;
			if (timeoutId) clearTimeout(timeoutId);
			scheduleTimeout();
		},
		cleanup: () => {
			active = false;
			if (timeoutId) clearTimeout(timeoutId);
		}
	};
}
//#endregion
//#region src/infra/net/hostname.ts
/** Normalize a hostname for policy comparisons. */
function normalizeHostname(hostname) {
	const normalized = normalizeLowercaseStringOrEmpty(hostname).replace(/\.+$/, "");
	if (normalized.startsWith("[") && normalized.endsWith("]")) return normalized.slice(1, -1);
	return normalized;
}
//#endregion
//#region src/infra/net/ssrf.ts
const DISPATCHER_CLOSE_TIMEOUT_MS = 100;
var SsrFBlockedError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "SsrFBlockedError";
	}
};
function normalizePolicyHostnames(values) {
	return normalizeUniqueStringEntries(values?.map((value) => normalizeHostname(value)));
}
function normalizeSsrFPolicyOrigin(value) {
	const trimmed = value.trim();
	if (!trimmed) return;
	try {
		const parsed = new URL(trimmed);
		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return;
		parsed.hostname = parsed.hostname.replace(/\.+$/, "");
		return parsed.origin.toLowerCase();
	} catch {
		return;
	}
}
function normalizeSsrFPolicyOrigins(values) {
	if (!values || values.length === 0) return [];
	return Array.from(new Set(values.map((value) => normalizeSsrFPolicyOrigin(value)).filter((value) => Boolean(value)))).toSorted();
}
const BLOCKED_HOSTNAMES = /* @__PURE__ */ new Set([
	"localhost",
	"localhost.localdomain",
	"metadata.google.internal"
]);
function normalizeHostnameSet(values) {
	return new Set(normalizePolicyHostnames(values));
}
function normalizeHostnameAllowlist(values) {
	return normalizePolicyHostnames(values).filter((value) => value !== "*" && value !== "*.");
}
function isPrivateNetworkAllowedByPolicy(policy) {
	return policy?.dangerouslyAllowPrivateNetwork === true || policy?.allowPrivateNetwork === true;
}
function shouldSkipPrivateNetworkChecks(hostname, policy) {
	return isPrivateNetworkAllowedByPolicy(policy) || normalizeHostnameSet(policy?.allowedHostnames).has(hostname);
}
function resolveSsrFPolicyForUrl(url, policy) {
	if (!policy?.allowedOrigins?.length) return policy;
	const requestOrigin = normalizeSsrFPolicyOrigin(url.toString());
	if (!requestOrigin || !normalizeSsrFPolicyOrigins(policy.allowedOrigins).includes(requestOrigin)) return policy;
	return {
		...policy,
		allowedHostnames: Array.from(/* @__PURE__ */ new Set([...policy.allowedHostnames ?? [], normalizeHostname(url.hostname)]))
	};
}
function resolveIpv4SpecialUseBlockOptions(policy) {
	return { allowRfc2544BenchmarkRange: policy?.allowRfc2544BenchmarkRange === true };
}
function resolveIpv6SpecialUseBlockOptions(policy) {
	return { allowUniqueLocalRange: policy?.allowIpv6UniqueLocalRange === true };
}
function isHostnameAllowedByPattern(hostname, pattern) {
	if (pattern.startsWith("*.")) {
		const suffix = pattern.slice(2);
		if (!suffix || hostname === suffix) return false;
		return hostname.endsWith(`.${suffix}`);
	}
	return hostname === pattern;
}
function matchesHostnameAllowlist(hostname, allowlist) {
	if (allowlist.length === 0) return true;
	return allowlist.some((pattern) => isHostnameAllowedByPattern(hostname, pattern));
}
function looksLikeUnsupportedIpv4Literal(address) {
	const parts = address.split(".");
	if (parts.length === 0 || parts.length > 4) return false;
	if (parts.some((part) => part.length === 0)) return true;
	return parts.every((part) => /^[0-9]+$/.test(part) || /^0x/i.test(part));
}
function isPrivateIpAddress(address, policy) {
	const normalized = normalizeHostname(address);
	if (!normalized) return false;
	const blockOptions = resolveIpv4SpecialUseBlockOptions(policy);
	const ipv6BlockOptions = resolveIpv6SpecialUseBlockOptions(policy);
	const strictIp = parseCanonicalIpAddress(normalized);
	if (strictIp) {
		if (isIpv4Address(strictIp)) return isBlockedSpecialUseIpv4Address(strictIp, blockOptions);
		if (isBlockedSpecialUseIpv6Address(strictIp, ipv6BlockOptions)) return true;
		const embeddedIpv4 = extractEmbeddedIpv4FromIpv6(strictIp);
		return embeddedIpv4 ? isBlockedSpecialUseIpv4Address(embeddedIpv4, blockOptions) : false;
	}
	if (normalized.includes(":") && !parseLooseIpAddress(normalized)) return true;
	if (!isCanonicalDottedDecimalIPv4(normalized) && isLegacyIpv4Literal(normalized)) return true;
	if (looksLikeUnsupportedIpv4Literal(normalized)) return true;
	return false;
}
function isBlockedHostnameNormalized(normalized) {
	if (BLOCKED_HOSTNAMES.has(normalized)) return true;
	return normalized.endsWith(".localhost") || normalized.endsWith(".local") || normalized.endsWith(".internal");
}
function isBlockedHostnameOrIp(hostname, policy) {
	const normalized = normalizeHostname(hostname);
	if (!normalized) return false;
	return isBlockedHostnameNormalized(normalized) || isPrivateIpAddress(normalized, policy);
}
const BLOCKED_HOST_OR_IP_MESSAGE = "Blocked hostname or private/internal/special-use IP address";
const BLOCKED_RESOLVED_IP_MESSAGE = "Blocked: resolves to private/internal/special-use IP address";
function assertAllowedHostOrIpOrThrow(hostnameOrIp, policy) {
	if (isBlockedHostnameOrIp(hostnameOrIp, policy)) throw new SsrFBlockedError(BLOCKED_HOST_OR_IP_MESSAGE);
}
function resolveHostnamePolicyChecks(hostname, policy) {
	const normalized = normalizeHostname(hostname);
	if (!normalized) throw new Error("Invalid hostname");
	if (normalizeHostnameAllowlist(policy?.blockedHostnames).some((pattern) => isHostnameAllowedByPattern(normalized, pattern))) throw new SsrFBlockedError(`Domain policy: Blocked hostname (configured blocklist): ${hostname}. Try a URL on a different domain or ask the operator to review blockedHostnames.`);
	const hostnameAllowlist = normalizeHostnameAllowlist(policy?.hostnameAllowlist);
	if (!matchesHostnameAllowlist(normalized, hostnameAllowlist)) throw new SsrFBlockedError(`Domain policy: Blocked hostname (not in allowlist): ${hostname}. Permitted hostname patterns: ${hostnameAllowlist.join(", ")}. Try a URL on a permitted domain.`);
	const skipPrivateNetworkChecks = shouldSkipPrivateNetworkChecks(normalized, policy);
	if (!skipPrivateNetworkChecks) assertAllowedHostOrIpOrThrow(normalized, policy);
	return {
		normalized,
		skipPrivateNetworkChecks
	};
}
function assertAllowedResolvedAddressesOrThrow(results, policy) {
	for (const entry of results) if (isBlockedHostnameOrIp(entry.address, policy)) throw new SsrFBlockedError(BLOCKED_RESOLVED_IP_MESSAGE);
}
function isLoopbackIpAddressIncludingEmbeddedIpv4(address) {
	if (isLoopbackIpAddress(address)) return true;
	const parsed = parseCanonicalIpAddress(address);
	if (!parsed || isIpv4Address(parsed)) return false;
	return extractEmbeddedIpv4FromIpv6(parsed)?.range() === "loopback";
}
function isBlockedTrustedResolvedIpv6Address(address) {
	const parsed = parseCanonicalIpAddress(address);
	if (!parsed || isIpv4Address(parsed)) return false;
	const range = parsed.range();
	if (range !== "unicast" && range !== "rfc6052") return false;
	return isBlockedSpecialUseIpv6Address(parsed);
}
function isExplicitLoopbackHostname(hostname) {
	return hostname === "localhost" || hostname === "localhost.localdomain" || hostname.endsWith(".localhost") || isLoopbackIpAddressIncludingEmbeddedIpv4(hostname);
}
function assertAllowedTrustedHostnameResolvedAddressesOrThrow(results, hostname) {
	const isLoopbackAllowed = isExplicitLoopbackHostname(hostname);
	for (const entry of results) if (isUnspecifiedIpAddress(entry.address) || !isLoopbackAllowed && isLoopbackIpAddressIncludingEmbeddedIpv4(entry.address) || isBlockedTrustedResolvedIpv6Address(entry.address) || isLinkLocalIpAddress(entry.address) || isCloudMetadataIpAddress(entry.address)) throw new SsrFBlockedError(BLOCKED_RESOLVED_IP_MESSAGE);
}
function normalizeLookupResults(results) {
	if (Array.isArray(results)) return results;
	return [results];
}
function createPinnedLookup(params) {
	const normalizedHost = normalizeHostname(params.hostname);
	if (params.addresses.length === 0) throw new Error(`Pinned lookup requires at least one address for ${params.hostname}`);
	const fallback = params.fallback ?? lookup;
	const records = params.addresses.map((address) => ({
		address,
		family: address.includes(":") ? 6 : 4
	}));
	const ipv4Records = records.filter((entry) => entry.family === 4);
	const automaticRecords = ipv4Records.length > 0 ? ipv4Records : records;
	let index = 0;
	return ((host, options, callback) => {
		const cb = typeof options === "function" ? options : callback;
		if (!cb) return;
		const normalized = normalizeHostname(host);
		if (!normalized || normalized !== normalizedHost) {
			if (typeof options === "function" || options === void 0) return fallback(host, cb);
			if (typeof options === "number") return fallback(host, options, cb);
			return fallback(host, options, cb);
		}
		const opts = typeof options === "object" && options !== null ? options : {};
		const requestedFamily = typeof options === "number" ? options : typeof opts.family === "number" ? opts.family : 0;
		const candidates = requestedFamily === 4 || requestedFamily === 6 ? records.filter((entry) => entry.family === requestedFamily) : automaticRecords;
		const usable = candidates.length > 0 ? candidates : automaticRecords;
		if (opts.all) {
			process.nextTick(() => {
				cb(null, usable);
			});
			return;
		}
		const chosen = expectDefined(usable[index % usable.length], "usable entry at index % usable.length");
		index += 1;
		process.nextTick(() => {
			cb(null, chosen.address, chosen.family);
		});
	});
}
function dedupeAndPreferIpv4(results) {
	const seen = /* @__PURE__ */ new Set();
	const ipv4 = [];
	const otherFamilies = [];
	for (const entry of results) {
		if (seen.has(entry.address)) continue;
		seen.add(entry.address);
		if (entry.family === 4) {
			ipv4.push(entry.address);
			continue;
		}
		otherFamilies.push(entry.address);
	}
	return [...ipv4, ...otherFamilies];
}
async function resolvePinnedHostnameWithPolicy(hostname, params = {}) {
	params.signal?.throwIfAborted();
	const { normalized, skipPrivateNetworkChecks } = resolveHostnamePolicyChecks(hostname, params.policy);
	const lookupFn = params.lookupFn ?? lookup$1;
	const results = normalizeLookupResults(await runAbortablePreflight(() => lookupFn(normalized, { all: true }), params.signal));
	params.signal?.throwIfAborted();
	if (results.length === 0) throw new Error(`Unable to resolve hostname: ${hostname}`);
	if (!skipPrivateNetworkChecks) assertAllowedResolvedAddressesOrThrow(results, params.policy);
	else if (!isPrivateNetworkAllowedByPolicy(params.policy)) assertAllowedTrustedHostnameResolvedAddressesOrThrow(results, normalized);
	const addresses = dedupeAndPreferIpv4(results);
	if (addresses.length === 0) throw new Error(`Unable to resolve hostname: ${hostname}`);
	return {
		hostname: normalized,
		addresses,
		lookup: createPinnedLookup({
			hostname: normalized,
			addresses
		})
	};
}
async function runAbortablePreflight(run, signal) {
	if (!signal) return await run();
	signal.throwIfAborted();
	const aborted = createDeferredCore();
	const onAbort = () => aborted.reject(signal.reason);
	signal.addEventListener("abort", onAbort, { once: true });
	try {
		return await Promise.race([aborted.promise, run()]);
	} finally {
		signal.removeEventListener("abort", onAbort);
	}
}
function assertHostnameAllowedWithPolicy(hostname, policy) {
	return resolveHostnamePolicyChecks(hostname, policy).normalized;
}
function withPinnedLookup(lookup, connect) {
	return connect ? {
		...connect,
		lookup
	} : { lookup };
}
function resolvePinnedDispatcherLookup(pinned, override, policy) {
	if (!override) return pinned.lookup;
	const normalizedOverrideHost = normalizeHostname(override.hostname);
	if (!normalizedOverrideHost || normalizedOverrideHost !== pinned.hostname) throw new Error(`Pinned dispatcher override hostname mismatch: expected ${pinned.hostname}, got ${override.hostname}`);
	const records = override.addresses.map((address) => ({
		address,
		family: address.includes(":") ? 6 : 4
	}));
	if (!shouldSkipPrivateNetworkChecks(pinned.hostname, policy)) assertAllowedResolvedAddressesOrThrow(records, policy);
	else if (!isPrivateNetworkAllowedByPolicy(policy)) assertAllowedTrustedHostnameResolvedAddressesOrThrow(records, pinned.hostname);
	return createPinnedLookup({
		hostname: pinned.hostname,
		addresses: [...override.addresses],
		fallback: pinned.lookup
	});
}
function createPinnedDispatcher(pinned, policy, ssrfPolicy, timeoutMs) {
	const lookup = resolvePinnedDispatcherLookup(pinned, policy?.pinnedHostname, ssrfPolicy);
	if (!policy || policy.mode === "direct") return createHttp1Agent({ connect: withPinnedLookup(lookup, policy?.connect) }, timeoutMs);
	if (policy.mode === "env-proxy") return createHttp1EnvHttpProxyAgent({
		connect: withPinnedLookup(lookup, policy.connect),
		...policy.proxyTls ? { proxyTls: { ...policy.proxyTls } } : {}
	}, timeoutMs);
	const proxyUrl = policy.proxyUrl.trim();
	const requestTls = withPinnedLookup(lookup, policy.proxyTls);
	if (!requestTls) return createHttp1ProxyAgent({ uri: proxyUrl }, timeoutMs);
	return createHttp1ProxyAgent({
		uri: proxyUrl,
		requestTls
	}, timeoutMs);
}
function destroyDispatcher(candidate) {
	try {
		candidate.destroy?.();
	} catch {}
}
async function waitForDispatcherClose(candidate) {
	const close = candidate.close;
	if (typeof close !== "function") {
		destroyDispatcher(candidate);
		return;
	}
	let timeout;
	try {
		await Promise.race([Promise.resolve(close.call(candidate)), new Promise((resolve) => {
			timeout = setTimeout(() => {
				timeout = void 0;
				destroyDispatcher(candidate);
				resolve();
			}, DISPATCHER_CLOSE_TIMEOUT_MS);
			timeout.unref?.();
		})]);
	} catch (err) {
		destroyDispatcher(candidate);
		throw err;
	} finally {
		if (timeout) clearTimeout(timeout);
	}
}
async function closeDispatcher(dispatcher) {
	if (!dispatcher) return;
	const candidate = dispatcher;
	try {
		await waitForDispatcherClose(candidate);
	} catch {}
}
//#endregion
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
AsyncLocalStorage.snapshot();
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
//#region src/infra/net/form-data.ts
function isFormDataLike(value) {
	return typeof value === "object" && value !== null && typeof value.entries === "function" && value[Symbol.toStringTag] === "FormData";
}
//#endregion
//#region src/infra/net/runtime-fetch.ts
function normalizeRuntimeFormData(body, RuntimeFormData) {
	if (!isFormDataLike(body) || typeof RuntimeFormData !== "function") return body;
	if (body instanceof RuntimeFormData) return body;
	const next = new RuntimeFormData();
	for (const [key, value] of body.entries()) {
		const namedValue = value;
		const fileName = typeof namedValue.name === "string" && namedValue.name.trim() ? namedValue.name : void 0;
		if (fileName) next.append(key, value, fileName);
		else next.append(key, value);
	}
	return next;
}
function normalizeRuntimeRequestInit(init, RuntimeFormData) {
	if (!init) return init;
	const normalizedHeaders = normalizeHeadersInitForFetch(init.headers);
	const initWithNormalizedHeaders = normalizedHeaders === init.headers ? init : {
		...init,
		headers: normalizedHeaders
	};
	if (!init.body) return initWithNormalizedHeaders;
	const body = normalizeRuntimeFormData(init.body, RuntimeFormData);
	if (body === init.body) return initWithNormalizedHeaders;
	const headers = new Headers(normalizedHeaders);
	headers.delete("content-length");
	headers.delete("content-type");
	return {
		...initWithNormalizedHeaders,
		headers,
		body
	};
}
/** Returns true for Vitest-style mocked fetch functions that should stay injectable. */
function isMockedFetch(fetchImpl) {
	if (typeof fetchImpl !== "function") return false;
	return typeof fetchImpl.mock === "object";
}
/** Uses the undici runtime fetch so callers can pass dispatcher-aware options. */
async function fetchWithRuntimeDispatcher(input, init) {
	return await fetchWithPreparedRuntimeDispatcher(loadUndiciRuntimeDeps(), input, init);
}
/** Uses one prepared Undici snapshot so reusable fetch wrappers stay stable. */
function fetchWithPreparedRuntimeDispatcher(runtimeDeps, input, init) {
	const runtimeFetch = runtimeDeps.fetch;
	return runtimeFetch(input, normalizeRuntimeRequestInit(init, runtimeDeps.FormData));
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
async function prepareGuardedFetchCapture(params, fetchImpl) {
	if (params.capture === false || !isTruthyEnvValue(process.env[OPENCLAW_DEBUG_PROXY_ENABLED])) return { fetchImpl };
	const { prepareHttpCapture, resolveDebugProxyFetchTransport } = await import("./runtime-Bmi6Z5vo.mjs");
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
export { fetchWithSsrFGuard };
