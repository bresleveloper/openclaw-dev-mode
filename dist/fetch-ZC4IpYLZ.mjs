import { c as normalizeOptionalLowercaseString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { C as parseStrictNonNegativeInteger, D as resolveExpiresAtMsFromDurationMs, g as isFutureDateTimestampMs } from "./number-coercion-CkhMiRw8.mjs";
import { a as extractErrorCode, d as toErrorObject, l as readErrorName, r as collectErrorGraphCandidates } from "./error-coercion-BwMr25F8.mjs";
import { n as isTruthyEnvValue } from "./env-DbG527wb.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { t as captureEffectAuthority } from "./effect-authority-Cik3sxlk.mjs";
import { a as resolveEnvHttpProxyAgentOptions, i as matchesNoProxy, t as hasEnvHttpProxyAgentConfigured } from "./proxy-env-5Nd20RhP.mjs";
import { n as createHttp1EnvHttpProxyAgent, r as createHttp1ProxyAgent } from "./undici-runtime-CSZThyLT.mjs";
import { n as isWSL2Sync } from "./wsl-DAucJ7y0.mjs";
import { a as createPinnedLookup } from "./ssrf-K50Tjeok.mjs";
import { o as resolveEffectiveDebugProxyUrl } from "./env-ZuG6CRvK.mjs";
import { n as captureHttpExchangeAsync } from "./runtime-BZkWDI2h.mjs";
import { r as PlatformMessageNotDispatchedError } from "./deliver-types-ChQJdCfP.mjs";
import "./error-runtime-ikopZs5O.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { n as makeProxyFetch, t as getProxyUrlFromFetch } from "./proxy-fetch-jG_wX5MX.mjs";
import { t as resolveFetch } from "./fetch-CH4pc6bp.mjs";
import "./fetch-runtime-Dg4wMDiG.mjs";
import "./runtime-env-BMLaJD4Z.mjs";
import { t as expectDefined } from "./expect-runtime-CJBt0Gq2.mjs";
import "./number-runtime-D3v2w3D4.mjs";
import "./proxy-capture-DSHKg1g9.mjs";
import { t as resolveRequestUrl } from "./request-url-e2tWzrHi.mjs";
import { t as classifyTransientNetworkErrorCode } from "./retry-runtime-CUY_Gz8_.mjs";
import process$1 from "node:process";
import { randomUUID } from "node:crypto";
import * as dns$1 from "node:dns";
import { Agent, fetch } from "undici/index.js";
//#region extensions/telegram/src/api-root.ts
const DEFAULT_TELEGRAM_API_ROOT = "https://api.telegram.org";
const TELEGRAM_BOT_ENDPOINT_SEGMENT_RE = /^bot\d+:[^/]+$/u;
function isTelegramBotEndpointSegment(segment) {
	try {
		return TELEGRAM_BOT_ENDPOINT_SEGMENT_RE.test(decodeURIComponent(segment));
	} catch {
		return TELEGRAM_BOT_ENDPOINT_SEGMENT_RE.test(segment);
	}
}
function normalizeTelegramApiRoot(apiRoot) {
	const trimmed = apiRoot?.trim();
	if (!trimmed) return DEFAULT_TELEGRAM_API_ROOT;
	if (hasTelegramBotEndpointApiRoot(trimmed)) throw new Error("Telegram apiRoot must be the Bot API root without /bot<TOKEN>. Run openclaw doctor --fix to repair stored config.");
	return trimmed.replace(/\/+$/u, "");
}
function hasTelegramBotEndpointApiRoot(apiRoot) {
	if (typeof apiRoot !== "string" || !apiRoot.trim()) return false;
	const last = (URL.parse(apiRoot.trim())?.pathname.split("/").filter(Boolean))?.at(-1);
	return Boolean(last && isTelegramBotEndpointSegment(last));
}
function extractTelegramApiMethod(input) {
	const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input instanceof Request ? input.url : null;
	return (URL.parse(url ?? "")?.pathname.split("/").filter(Boolean))?.at(-1)?.toLowerCase() ?? null;
}
//#endregion
//#region extensions/telegram/src/network-config.ts
const TELEGRAM_DISABLE_AUTO_SELECT_FAMILY_ENV = "OPENCLAW_TELEGRAM_DISABLE_AUTO_SELECT_FAMILY";
const TELEGRAM_ENABLE_AUTO_SELECT_FAMILY_ENV = "OPENCLAW_TELEGRAM_ENABLE_AUTO_SELECT_FAMILY";
const TELEGRAM_DNS_RESULT_ORDER_ENV = "OPENCLAW_TELEGRAM_DNS_RESULT_ORDER";
let wsl2SyncCache;
function resolveTelegramAutoSelectFamilyDecision(params) {
	const env = params?.env ?? process$1.env;
	if (isTruthyEnvValue(env[TELEGRAM_ENABLE_AUTO_SELECT_FAMILY_ENV])) return {
		value: true,
		source: `env:${TELEGRAM_ENABLE_AUTO_SELECT_FAMILY_ENV}`
	};
	if (isTruthyEnvValue(env[TELEGRAM_DISABLE_AUTO_SELECT_FAMILY_ENV])) return {
		value: false,
		source: `env:${TELEGRAM_DISABLE_AUTO_SELECT_FAMILY_ENV}`
	};
	if (typeof params?.network?.autoSelectFamily === "boolean") return {
		value: params.network.autoSelectFamily,
		source: "config"
	};
	if (wsl2SyncCache ??= isWSL2Sync()) return {
		value: false,
		source: "default-wsl2"
	};
	return {
		value: resolveTelegramDnsResultOrderDecision(params).value !== "ipv4first",
		source: "default-dns-order"
	};
}
function resolveTelegramDnsResultOrderDecision(params) {
	for (const [source, read] of [
		[`env:${TELEGRAM_DNS_RESULT_ORDER_ENV}`, () => process$1.env[TELEGRAM_DNS_RESULT_ORDER_ENV]],
		["config", () => params?.network?.dnsResultOrder],
		["process-default", () => dns$1.getDefaultResultOrder()]
	]) {
		const value = normalizeOptionalLowercaseString(read());
		if (value === "ipv4first" || value === "verbatim" || source === "process-default" && value === "ipv6first") return {
			value,
			source
		};
	}
	return {
		value: "ipv4first",
		source: "default-node22"
	};
}
//#endregion
//#region extensions/telegram/src/network-errors.ts
const TELEGRAM_SUPERGROUP_MIGRATION_DESCRIPTION = "Bad Request: group chat was upgraded to a supergroup chat";
var TelegramRequestNotStartedError = class extends Error {
	constructor(message = "Telegram request did not start", options) {
		super(message, options);
		this.name = "TelegramRequestNotStartedError";
	}
};
function isTelegramRequestNotStartedError(err) {
	return err instanceof TelegramRequestNotStartedError || readErrorName(err) === "HttpError" && err.error instanceof TelegramRequestNotStartedError;
}
function rethrowTelegramSendError(err) {
	if (isTelegramRequestNotStartedError(err)) throw new PlatformMessageNotDispatchedError("Telegram request not started", { cause: err });
	const migrationRejection = describeTelegramSupergroupMigration(err);
	if (migrationRejection === void 0) throw err;
	throw new PlatformMessageNotDispatchedError(migrationRejection, {
		cause: err,
		retryable: false
	});
}
const TELEGRAM_ADDITIONAL_TRANSIENT_ERROR_CODES = /* @__PURE__ */ new Set([
	"ENETDOWN",
	"ESOCKETTIMEDOUT",
	"EHOSTUNREACH",
	"UND_ERR_ABORTED",
	"ECONNABORTED",
	"ERR_NETWORK"
]);
const TELEGRAM_ADDITIONAL_PRE_CONNECT_ERROR_CODES = /* @__PURE__ */ new Set(["ENETDOWN", "EHOSTUNREACH"]);
const RECOVERABLE_ERROR_NAMES = /* @__PURE__ */ new Set([
	"AbortError",
	"TimeoutError",
	"ConnectTimeoutError",
	"HeadersTimeoutError",
	"BodyTimeoutError"
]);
const ALWAYS_RECOVERABLE_MESSAGES = /* @__PURE__ */ new Set(["fetch failed", "typeerror: fetch failed"]);
const GRAMMY_NETWORK_REQUEST_FAILED_AFTER_RE = /^network request(?:\s+for\s+["']?[^"']+["']?)?\s+failed\s+after\b.*[!.]?$/i;
const RECOVERABLE_MESSAGE_SNIPPETS = [
	"undici",
	"network error",
	"network request",
	"client network socket disconnected",
	"socket hang up",
	"getaddrinfo",
	"timeout",
	"timed out"
];
function collectTelegramErrorCandidates(err) {
	return collectErrorGraphCandidates(err, (current) => {
		const nested = [current.cause, current.reason];
		if (Array.isArray(current.errors)) nested.push(...current.errors);
		if (readErrorName(current) === "HttpError") nested.push(current.error);
		return nested;
	});
}
function normalizedErrorCode(err) {
	let code = extractErrorCode(err);
	if (!code && err && typeof err === "object") {
		const errno = err.errno;
		if (typeof errno === "string" || typeof errno === "number") code = String(errno);
	}
	return code?.trim().toUpperCase() ?? "";
}
function classifyTelegramTransientNetworkError(err) {
	const code = normalizedErrorCode(err);
	return classifyTransientNetworkErrorCode(code) ?? (TELEGRAM_ADDITIONAL_PRE_CONNECT_ERROR_CODES.has(code) ? "pre-connect" : TELEGRAM_ADDITIONAL_TRANSIENT_ERROR_CODES.has(code) ? "ambiguous" : void 0);
}
function hasTelegramNetworkErrorCode(err) {
	return collectTelegramErrorCandidates(err).some((candidate) => classifyTelegramTransientNetworkError(candidate) !== void 0);
}
function getNumericHttpStatus(err) {
	if (!err || typeof err !== "object") return;
	const candidate = err;
	for (const value of [
		candidate.error_code,
		candidate.status,
		candidate.statusCode
	]) {
		if (typeof value === "number" && Number.isFinite(value)) return value;
		if (typeof value === "string") {
			const trimmed = value.trim();
			if (/^\d+$/.test(trimmed)) return parseStrictNonNegativeInteger(trimmed);
		}
	}
}
function describeTelegramSupergroupMigration(err) {
	for (const candidate of collectTelegramErrorCandidates(err)) {
		if (!isRecord(candidate) || candidate.error_code !== 400 || candidate.description !== TELEGRAM_SUPERGROUP_MIGRATION_DESCRIPTION) continue;
		const migratedChatId = isRecord(candidate.parameters) ? candidate.parameters.migrate_to_chat_id : void 0;
		return typeof migratedChatId === "number" && Number.isSafeInteger(migratedChatId) ? `Telegram rejected send: group migrated to supergroup ${migratedChatId}` : "Telegram rejected send: group migrated to a supergroup";
	}
}
function isTelegramMisdirectedRequestError(err) {
	for (const candidate of collectTelegramErrorCandidates(err)) {
		if (normalizedErrorCode(candidate) === "421" || getNumericHttpStatus(candidate) === 421) return true;
		const message = normalizeLowercaseStringOrEmpty(formatErrorMessage(candidate));
		if (/\b421\b/.test(message) && message.includes("misdirected request")) return true;
	}
	return false;
}
/** True only for channel-owned no-send proof or proven pre-connect failures. */
function isSafeToRetrySendError(err) {
	if (!err) return false;
	if (err instanceof PlatformMessageNotDispatchedError) return err.retryable;
	if (isTelegramRequestNotStartedError(err)) return true;
	return collectTelegramErrorCandidates(err).some((candidate) => classifyTelegramTransientNetworkError(candidate) === "pre-connect");
}
function hasTelegramErrorCode(err, matches) {
	return collectTelegramErrorCandidates(err).some((candidate) => {
		if (!candidate || typeof candidate !== "object" || !("error_code" in candidate)) return false;
		const code = candidate.error_code;
		return typeof code === "number" && matches(code);
	});
}
function isTelegramAuthenticationError(err) {
	return hasTelegramErrorCode(err, (code) => code === 401 || code === 404);
}
/** Reads Telegram's flood-control retry_after hint (in ms) from any error nesting shape. */
function readTelegramRetryAfterMs(err) {
	for (const candidate of collectTelegramErrorCandidates(err)) {
		if (!candidate || typeof candidate !== "object") continue;
		const retryAfter = "parameters" in candidate && candidate.parameters && typeof candidate.parameters === "object" ? candidate.parameters.retry_after : "response" in candidate && candidate.response && typeof candidate.response === "object" && "parameters" in candidate.response ? candidate.response.parameters?.retry_after : "error" in candidate && candidate.error && typeof candidate.error === "object" && "parameters" in candidate.error ? candidate.error.parameters?.retry_after : void 0;
		if (typeof retryAfter === "number" && Number.isFinite(retryAfter)) return retryAfter * 1e3;
	}
}
/** Returns true for HTTP 5xx server errors (error may have been processed). */
function isTelegramServerError(err) {
	return hasTelegramErrorCode(err, (code) => code >= 500);
}
function isTelegramRateLimitError(err) {
	return hasTelegramErrorCode(err, (code) => code === 429) || readTelegramRetryAfterMs(err) !== void 0 && /(?:^|\b)429\b|too many requests/i.test(formatErrorMessage(err));
}
const MESSAGE_NOT_MODIFIED_RE = /400:\s*Bad Request:\s*message is not modified|MESSAGE_NOT_MODIFIED/i;
const MESSAGE_HAS_NO_TEXT_RE = /400:\s*Bad Request:\s*there is no text in the message to edit/i;
const EDIT_TARGET_MISSING_RE = /400:\s*Bad Request:\s*message to edit not found|400:\s*Bad Request:\s*message can't be edited|MESSAGE_ID_INVALID/i;
/** True when Telegram rejected an edit because the content is unchanged; the message already shows the requested text. */
function isTelegramMessageNotModifiedError(err) {
	return MESSAGE_NOT_MODIFIED_RE.test(formatErrorMessage(err));
}
/** True when the edit target has no text body (e.g. media message needing a caption edit). */
function isTelegramMessageHasNoTextError(err) {
	return MESSAGE_HAS_NO_TEXT_RE.test(formatErrorMessage(err));
}
/** True when the edit target is gone or locked (deleted message, invalid id); retrying the same edit cannot succeed. */
function isTelegramEditTargetMissingError(err) {
	return EDIT_TARGET_MISSING_RE.test(formatErrorMessage(err));
}
/** Returns true for HTTP 4xx client errors (Telegram explicitly rejected, not applied). */
function isTelegramClientRejection(err) {
	return hasTelegramErrorCode(err, (code) => code >= 400 && code < 500);
}
function isTelegramBadRequestError(err) {
	return hasTelegramErrorCode(err, (code) => code === 400);
}
function isRecoverableTelegramNetworkError(err, options = {}) {
	if (!err) return false;
	if (isTelegramRequestNotStartedError(err)) return true;
	const allowMessageMatch = typeof options.allowMessageMatch === "boolean" ? options.allowMessageMatch : options.context !== "send";
	for (const candidate of collectTelegramErrorCandidates(err)) {
		if (classifyTelegramTransientNetworkError(candidate)) return true;
		const name = readErrorName(candidate);
		if (name && RECOVERABLE_ERROR_NAMES.has(name)) return true;
		const message = normalizeLowercaseStringOrEmpty(formatErrorMessage(candidate));
		if (message && (ALWAYS_RECOVERABLE_MESSAGES.has(message) || GRAMMY_NETWORK_REQUEST_FAILED_AFTER_RE.test(message) || allowMessageMatch && RECOVERABLE_MESSAGE_SNIPPETS.some((snippet) => message.includes(snippet)))) return true;
	}
	return false;
}
function isRetryableTelegramApiError(err, options = {}) {
	return isRecoverableTelegramNetworkError(err, options) || isTelegramServerError(err) || isTelegramRateLimitError(err);
}
//#endregion
//#region extensions/telegram/src/request-authority.ts
const requestAuthority = Symbol("telegram.requestAuthority");
/** Distinguish a local rejection from a network error wrapped by grammY. */
var TelegramRequestAuthorityError = class extends Error {
	constructor(originalError) {
		super("Telegram request authority rejected");
		this.originalError = originalError;
	}
};
function findTelegramRequestAuthorityError(error) {
	return collectErrorGraphCandidates(error, (current) => [current.cause, current.error]).find((candidate) => candidate instanceof TelegramRequestAuthorityError);
}
function assertTelegramRequestAuthority(assertCurrent) {
	try {
		assertCurrent?.();
	} catch (error) {
		throw new TelegramRequestAuthorityError(error);
	}
}
/** Keep the selected transport and guard every request, including Undici's HTTP 421 retry. */
function bindTelegramTransportAuthority(fetchImpl, assertCurrent) {
	const effect = captureEffectAuthority();
	return (input, init, defaultDispatcher) => {
		const callerDispatcher = init?.dispatcher;
		let requestInit = withoutTelegramRequestAuthority(init);
		if (!callerDispatcher && defaultDispatcher) requestInit = {
			...requestInit,
			dispatcher: defaultDispatcher
		};
		if (!assertCurrent && !effect.active) return fetchImpl(input, requestInit);
		assertTelegramRequestAuthority(assertCurrent);
		const dispatcher = callerDispatcher ?? defaultDispatcher;
		if (dispatcher) {
			const controller = new AbortController();
			const callerSignal = init?.signal === void 0 && input instanceof Request ? input.signal : init?.signal;
			const signal = callerSignal ? AbortSignal.any([callerSignal, controller.signal]) : controller.signal;
			requestInit = {
				...requestInit,
				signal,
				dispatcher: dispatcher.compose((dispatch) => (options, handler) => {
					let initiated = false;
					effect.initiate(() => {
						signal.throwIfAborted();
						assertTelegramRequestAuthority(assertCurrent);
						initiated = true;
						return dispatch(options, handler);
					}).catch((error) => {
						const refusal = initiated ? toErrorObject(error, "Telegram dispatch failed") : findTelegramRequestAuthorityError(error) ?? new TelegramRequestAuthorityError(error);
						controller.abort(refusal);
					});
					return true;
				})
			};
		}
		const request = () => {
			assertTelegramRequestAuthority(assertCurrent);
			return fetchImpl(input, requestInit);
		};
		return (dispatcher ? effect.run(request) : effect.initiate(request)).catch((error) => {
			throw findTelegramRequestAuthorityError(error) ?? error;
		});
	};
}
/** Keep operation authority off the shared client's cached fetch options. */
function bindTelegramRequestAuthority(fetchImpl, assertCurrent) {
	const effect = captureEffectAuthority();
	const guardedFetch = (input, init) => {
		const guardedInit = {
			...init,
			[requestAuthority]: assertCurrent
		};
		return effect.run(() => fetchImpl(input, guardedInit));
	};
	return Object.assign(guardedFetch, fetchImpl);
}
function getTelegramRequestAuthority(init) {
	return init?.[requestAuthority];
}
/** The private callback travels between our retry layers, never to the HTTP client. */
function withoutTelegramRequestAuthority(init) {
	if (!init || !(requestAuthority in init)) return init;
	const requestInit = { ...init };
	delete requestInit[requestAuthority];
	return requestInit;
}
//#endregion
//#region extensions/telegram/src/fetch.ts
const log = createSubsystemLogger("telegram/network");
const TELEGRAM_AUTO_SELECT_FAMILY_ATTEMPT_TIMEOUT_MS = 300;
const TELEGRAM_API_HOSTNAME = "api.telegram.org";
const TELEGRAM_FALLBACK_IPS = ["149.154.167.220"];
const TELEGRAM_DISPATCHER_KEEP_ALIVE_TIMEOUT_MS = 3e4;
const TELEGRAM_DISPATCHER_KEEP_ALIVE_MAX_TIMEOUT_MS = 6e5;
const TELEGRAM_DISPATCHER_CONNECTIONS_PER_ORIGIN = 10;
const TELEGRAM_DISPATCHER_PIPELINING = 1;
const TELEGRAM_STICKY_FALLBACK_PRIMARY_PROBE_SUCCESS_THRESHOLD = 5;
const TELEGRAM_TRANSPORT_ATTEMPT_FAILURE_THRESHOLD = 5;
const TELEGRAM_TRANSPORT_ATTEMPT_INITIAL_COOLDOWN_MS = 1e4;
const TELEGRAM_TRANSPORT_ATTEMPT_MAX_COOLDOWN_MS = 6e4;
function telegramAgentPoolOptions(pipelining) {
	return {
		allowH2: false,
		keepAliveTimeout: TELEGRAM_DISPATCHER_KEEP_ALIVE_TIMEOUT_MS,
		keepAliveMaxTimeout: TELEGRAM_DISPATCHER_KEEP_ALIVE_MAX_TIMEOUT_MS,
		connections: TELEGRAM_DISPATCHER_CONNECTIONS_PER_ORIGIN,
		pipelining
	};
}
const FALLBACK_RETRY_ERROR_CODES = [
	"ETIMEDOUT",
	"ENETDOWN",
	"ENETUNREACH",
	"EHOSTUNREACH",
	"UND_ERR_CONNECT_TIMEOUT",
	"UND_ERR_SOCKET"
];
function createDnsResultOrderLookup(order) {
	const lookup = dns$1.lookup;
	return (hostname, options, callback) => {
		const baseOptions = typeof options === "number" ? { family: options } : { ...options };
		lookup(hostname, {
			...baseOptions,
			order,
			verbatim: order === "verbatim"
		}, callback);
	};
}
const TELEGRAM_KEEPALIVE_INITIAL_DELAY_MS = 3e4;
function buildTelegramConnectOptions(params) {
	return {
		keepAlive: true,
		keepAliveInitialDelay: TELEGRAM_KEEPALIVE_INITIAL_DELAY_MS,
		...params.forceIpv4 ? {
			family: 4,
			autoSelectFamily: false
		} : {
			autoSelectFamily: params.autoSelectFamily,
			autoSelectFamilyAttemptTimeout: TELEGRAM_AUTO_SELECT_FAMILY_ATTEMPT_TIMEOUT_MS
		},
		lookup: createDnsResultOrderLookup(params.dnsResultOrder)
	};
}
function resolveTelegramDispatcherPolicy(params) {
	const connect = buildTelegramConnectOptions(params);
	const explicitProxyUrl = params.proxyUrl?.trim();
	if (explicitProxyUrl) return {
		mode: "explicit-proxy",
		proxyUrl: explicitProxyUrl,
		allowPrivateProxy: true,
		proxyTls: { ...connect }
	};
	return {
		mode: params.useEnvProxy ? "env-proxy" : "direct",
		connect: { ...connect }
	};
}
function withPinnedLookup(options, pinnedHostname) {
	if (!pinnedHostname) return options ? { ...options } : void 0;
	const lookup = createPinnedLookup({
		hostname: pinnedHostname.hostname,
		addresses: [...pinnedHostname.addresses],
		fallback: dns$1.lookup
	});
	return {
		...options,
		lookup
	};
}
function createTelegramDispatcher(policy, pipelining = TELEGRAM_DISPATCHER_PIPELINING) {
	const poolOptions = telegramAgentPoolOptions(pipelining);
	let dispatcher;
	if (policy.mode === "explicit-proxy") {
		const requestTlsOptions = withPinnedLookup(policy.proxyTls, policy.pinnedHostname);
		const proxyOptions = {
			uri: policy.proxyUrl,
			...poolOptions,
			...requestTlsOptions ? { requestTls: requestTlsOptions } : {}
		};
		try {
			dispatcher = createHttp1ProxyAgent(proxyOptions);
		} catch (err) {
			const reason = formatErrorMessage(err);
			throw new Error(`explicit proxy dispatcher init failed: ${reason}`, { cause: err });
		}
	} else {
		const connectOptions = withPinnedLookup(policy.connect, policy.pinnedHostname);
		const directOptions = {
			...poolOptions,
			...connectOptions ? { connect: connectOptions } : {}
		};
		if (policy.mode === "direct") {
			dispatcher = new Agent(directOptions);
			return {
				dispatcher,
				mode: policy.mode,
				effectivePolicy: policy
			};
		}
		const proxyTlsOptions = withPinnedLookup(policy.proxyTls, policy.pinnedHostname);
		const proxyOptions = {
			...directOptions,
			...resolveEnvHttpProxyAgentOptions(),
			...proxyTlsOptions ? { proxyTls: proxyTlsOptions } : {}
		};
		try {
			dispatcher = createHttp1EnvHttpProxyAgent(proxyOptions);
		} catch (err) {
			log.warn(`env proxy dispatcher init failed; falling back to direct dispatcher: ${formatErrorMessage(err)}`);
			return createTelegramDispatcher({
				mode: "direct",
				...connectOptions ? { connect: connectOptions } : {}
			}, pipelining);
		}
	}
	return {
		dispatcher,
		mode: policy.mode,
		effectivePolicy: policy
	};
}
function resolveWrappedFetch(fetchImpl) {
	return resolveFetch(fetchImpl) ?? fetchImpl;
}
function collectErrorCodes(err) {
	const codes = /* @__PURE__ */ new Set();
	for (const current of collectErrorGraphCandidates(err, (candidate) => [candidate.cause, ...Array.isArray(candidate.errors) ? candidate.errors : []])) if (current && typeof current === "object") {
		const code = current.code;
		if (typeof code === "string" && code.trim()) codes.add(code.trim().toUpperCase());
	}
	return codes;
}
function formatErrorCodes(err) {
	const codes = [...collectErrorCodes(err)];
	return codes.length > 0 ? codes.join(",") : "none";
}
function shouldRetryTelegramTransportFallback(err) {
	if (findTelegramRequestAuthorityError(err)) return false;
	const message = err && typeof err === "object" && "message" in err ? normalizeLowercaseStringOrEmpty(String(err.message)) : "";
	const codes = collectErrorCodes(err);
	return FALLBACK_RETRY_ERROR_CODES.some((code) => codes.has(code)) || message.includes("fetch failed") && codes.size === 0;
}
const UNDICI_PROXY_TUNNEL_REJECTED_RE = /^Proxy response \((\d{3})\) !== 200 when HTTP Tunneling$/;
const UNDICI_PROXY_CONNECTION_ERROR_CODE = "UND_ERR_PRX_CONN";
function describeProxyTunnelFailure(mode, err) {
	if (mode !== "explicit-proxy" && mode !== "env-proxy") return;
	for (const candidate of collectErrorGraphCandidates(err, (current) => [current.cause, ...Array.isArray(current.errors) ? current.errors : []])) {
		const code = extractErrorCode(candidate);
		if (code === UNDICI_PROXY_CONNECTION_ERROR_CODE) return "proxy connection failed while opening the tunnel";
		if (code !== "UND_ERR_ABORTED" || !candidate || typeof candidate !== "object") continue;
		const message = "message" in candidate ? candidate.message : void 0;
		const rejected = typeof message === "string" ? UNDICI_PROXY_TUNNEL_REJECTED_RE.exec(message) : null;
		if (rejected) return `proxy answered CONNECT with ${rejected[1]}`;
	}
}
function createTelegramTransportAttempts(params) {
	const createAttempt = (policy, initial) => {
		const dispatchers = /* @__PURE__ */ new Map();
		if (initial) {
			dispatchers.set(false, initial);
			params.ownedDispatchers.add(initial);
		}
		return {
			exportAttempt: { dispatcherPolicy: policy },
			createDispatcher: (freshConnection = false) => {
				let dispatcher = dispatchers.get(freshConnection);
				if (!dispatcher) {
					dispatcher = createTelegramDispatcher(policy, freshConnection ? 0 : 1).dispatcher;
					dispatchers.set(freshConnection, dispatcher);
					params.ownedDispatchers.add(dispatcher);
				}
				return dispatcher;
			}
		};
	};
	const attempts = [createAttempt(params.defaultDispatcher.effectivePolicy, params.defaultDispatcher.dispatcher)];
	if (!params.fallbackPolicy) return attempts;
	attempts.push({
		...createAttempt(params.fallbackPolicy),
		logLevel: "debug",
		logMessage: "fetch fallback: enabling sticky IPv4-only dispatcher"
	});
	attempts.push({
		...createAttempt({
			...params.fallbackPolicy,
			pinnedHostname: {
				hostname: TELEGRAM_API_HOSTNAME,
				addresses: [...TELEGRAM_FALLBACK_IPS]
			}
		}),
		logLevel: "warn",
		logMessage: "fetch fallback: primary connection path failed; trying alternative Telegram API IP"
	});
	return attempts;
}
function resolveTelegramTransport(proxyFetch, options) {
	const autoSelectDecision = resolveTelegramAutoSelectFamilyDecision({ network: options?.network });
	const dnsDecision = resolveTelegramDnsResultOrderDecision({ network: options?.network });
	for (const [name, decision] of [["autoSelectFamily", autoSelectDecision], ["dnsResultOrder", dnsDecision]]) log.debug(`${name}=${decision.value} (${decision.source})`);
	const effectiveProxyFetch = proxyFetch ?? (() => {
		const debugProxyUrl = resolveEffectiveDebugProxyUrl(void 0);
		return debugProxyUrl ? makeProxyFetch(debugProxyUrl) : void 0;
	})();
	const explicitProxyUrl = effectiveProxyFetch ? getProxyUrlFromFetch(effectiveProxyFetch) : void 0;
	const hasEnvProxy = !explicitProxyUrl && hasEnvHttpProxyAgentConfigured();
	const managedProxyUrl = !effectiveProxyFetch && !hasEnvProxy ? process.env.OPENCLAW_PROXY_URL?.trim() || void 0 : void 0;
	const resolvedExplicitProxyUrl = explicitProxyUrl ?? managedProxyUrl;
	const undiciSourceFetch = resolveWrappedFetch(fetch);
	const sourceFetch = !resolvedExplicitProxyUrl && effectiveProxyFetch ? resolveWrappedFetch(effectiveProxyFetch) : undiciSourceFetch;
	if (effectiveProxyFetch && !explicitProxyUrl) return {
		fetch: sourceFetch,
		sourceFetch,
		close: async () => {}
	};
	const useEnvProxy = !resolvedExplicitProxyUrl && hasEnvProxy;
	const defaultDispatcher = createTelegramDispatcher(resolveTelegramDispatcherPolicy({
		autoSelectFamily: autoSelectDecision.value,
		dnsResultOrder: dnsDecision.value,
		useEnvProxy,
		forceIpv4: false,
		proxyUrl: resolvedExplicitProxyUrl
	}));
	const shouldBypassEnvProxy = matchesNoProxy(`https://${TELEGRAM_API_HOSTNAME}`);
	const fallbackDispatcherPolicy = !((dnsDecision.source === "config" || dnsDecision.source === `env:OPENCLAW_TELEGRAM_DNS_RESULT_ORDER`) && dnsDecision.value !== "ipv4first") && (defaultDispatcher.mode === "direct" || defaultDispatcher.mode === "env-proxy" && shouldBypassEnvProxy) ? resolveTelegramDispatcherPolicy({
		autoSelectFamily: false,
		dnsResultOrder: "ipv4first",
		useEnvProxy: defaultDispatcher.mode === "env-proxy",
		forceIpv4: true,
		proxyUrl: resolvedExplicitProxyUrl
	}) : void 0;
	const ownedDispatchers = /* @__PURE__ */ new Set();
	const transportAttempts = createTelegramTransportAttempts({
		defaultDispatcher,
		fallbackPolicy: fallbackDispatcherPolicy,
		ownedDispatchers
	});
	let stickyAttemptIndex = 0;
	let stickySuccessCount = 0;
	let primaryProbeDue = false;
	const attemptHealth = transportAttempts.map(() => ({
		consecutiveFailures: 0,
		cooldownMs: TELEGRAM_TRANSPORT_ATTEMPT_INITIAL_COOLDOWN_MS,
		unhealthyUntilMs: 0
	}));
	const resetStickyRecoveryProbe = () => {
		stickySuccessCount = 0;
		primaryProbeDue = false;
	};
	const getAttemptCooldownError = (attemptIndex) => {
		const health = expectDefined(attemptHealth[attemptIndex], "transport attempt health index");
		if (!isFutureDateTimestampMs(health.unhealthyUntilMs)) return null;
		return new TelegramRequestNotStartedError(`Telegram transport attempts are cooling down; retry after ${Math.max(0, health.unhealthyUntilMs - Date.now())}ms`);
	};
	const recordAttemptFailure = (attemptIndex, err) => {
		if (!shouldRetryTelegramTransportFallback(err)) return;
		const health = expectDefined(attemptHealth[attemptIndex], "transport attempt health index");
		health.consecutiveFailures += 1;
		if (health.consecutiveFailures < TELEGRAM_TRANSPORT_ATTEMPT_FAILURE_THRESHOLD) return;
		const cooldownMs = Math.min(TELEGRAM_TRANSPORT_ATTEMPT_MAX_COOLDOWN_MS, Math.max(TELEGRAM_TRANSPORT_ATTEMPT_INITIAL_COOLDOWN_MS, health.cooldownMs));
		health.consecutiveFailures = 0;
		health.cooldownMs = Math.min(TELEGRAM_TRANSPORT_ATTEMPT_MAX_COOLDOWN_MS, cooldownMs * 2);
		const unhealthyUntilMs = resolveExpiresAtMsFromDurationMs(cooldownMs);
		if (unhealthyUntilMs === void 0) {
			health.unhealthyUntilMs = 0;
			return;
		}
		health.unhealthyUntilMs = unhealthyUntilMs;
		log.warn(`telegram transport attempt marked temporarily unhealthy for ${cooldownMs}ms (codes=${formatErrorCodes(err)})`);
	};
	const promoteStickyAttempt = (nextIndex, err, reason) => {
		if (nextIndex <= stickyAttemptIndex || nextIndex >= transportAttempts.length) return false;
		const nextAttempt = expectDefined(transportAttempts[nextIndex], "validated fallback attempt index");
		if (nextAttempt.logMessage) {
			const reasonText = reason ? `, reason=${reason}` : "";
			const logLine = `${nextAttempt.logMessage} (codes=${formatErrorCodes(err)}${reasonText})`;
			log[nextAttempt.logLevel ?? "warn"](logLine);
		}
		stickyAttemptIndex = nextIndex;
		resetStickyRecoveryProbe();
		return true;
	};
	const recordSuccessfulAttempt = (attemptIndex) => {
		const health = expectDefined(attemptHealth[attemptIndex], "transport attempt health index");
		health.consecutiveFailures = 0;
		health.cooldownMs = TELEGRAM_TRANSPORT_ATTEMPT_INITIAL_COOLDOWN_MS;
		health.unhealthyUntilMs = 0;
		if (stickyAttemptIndex === 0) {
			resetStickyRecoveryProbe();
			return;
		}
		if (attemptIndex < stickyAttemptIndex) {
			log.debug(`fetch fallback: recovered from attempt ${stickyAttemptIndex} to attempt ${attemptIndex}`);
			stickyAttemptIndex = attemptIndex;
			resetStickyRecoveryProbe();
			return;
		}
		if (attemptIndex !== stickyAttemptIndex) return;
		stickySuccessCount += 1;
		if (stickySuccessCount >= TELEGRAM_STICKY_FALLBACK_PRIMARY_PROBE_SUCCESS_THRESHOLD) {
			stickySuccessCount = 0;
			primaryProbeDue = true;
			log.debug("fetch fallback: scheduling primary dispatcher recovery check");
		}
	};
	let closed = false;
	const resolvedFetch = (async (input, init) => {
		if (closed) throw new TelegramRequestNotStartedError("Telegram transport is closed");
		const method = extractTelegramApiMethod(input);
		const freshConnection = method === "sendmessage" || method === "sendrichmessage";
		const shouldRetryRequest = (error) => !closed && shouldRetryTelegramTransportFallback(error) && (!freshConnection || isSafeToRetrySendError(error));
		const requestFetch = bindTelegramTransportAuthority(sourceFetch, getTelegramRequestAuthority(init));
		const signal = init?.signal ?? (input instanceof Request ? input.signal : void 0);
		const callerProvidedDispatcher = Boolean(init?.dispatcher);
		const stickyStartIndex = Math.min(stickyAttemptIndex, transportAttempts.length - 1);
		const stickyCooldownError = callerProvidedDispatcher ? null : getAttemptCooldownError(stickyStartIndex);
		const primaryProbe = !callerProvidedDispatcher && stickyStartIndex > 0 && (primaryProbeDue || stickyCooldownError !== null);
		const startIndex = primaryProbe ? 0 : stickyStartIndex;
		if (primaryProbe) {
			primaryProbeDue = false;
			log.debug(stickyCooldownError ? "fetch fallback: rechecking primary dispatcher while sticky fallback is cooling down" : "fetch fallback: rechecking primary dispatcher after sticky fallback successes");
		}
		let err;
		const captureResponse = (response, fallbackAttempt) => {
			captureHttpExchangeAsync({
				url: resolveRequestUrl(input),
				method: init?.method ?? "GET",
				requestHeaders: init?.headers,
				requestBody: init?.body ?? null,
				response,
				flowId: randomUUID(),
				meta: {
					subsystem: "telegram-fetch",
					...fallbackAttempt === void 0 ? {} : { fallbackAttempt }
				}
			}).catch(() => {});
		};
		if (callerProvidedDispatcher) try {
			const response = await requestFetch(input, init);
			signal?.throwIfAborted();
			captureResponse(response);
			return response;
		} catch (caught) {
			signal?.throwIfAborted();
			if (!shouldRetryRequest(caught)) throw caught;
			const response = await requestFetch(input, init ?? {});
			signal?.throwIfAborted();
			return response;
		}
		for (let attemptIndex = startIndex; attemptIndex < transportAttempts.length; attemptIndex += 1) {
			const attempt = expectDefined(transportAttempts[attemptIndex], "transport attempt loop index");
			if (attemptIndex > startIndex) promoteStickyAttempt(attemptIndex, err);
			const cooldownError = getAttemptCooldownError(attemptIndex);
			if (cooldownError) {
				err = cooldownError;
				continue;
			}
			try {
				const response = await requestFetch(input, init, attempt.createDispatcher(freshConnection));
				signal?.throwIfAborted();
				captureResponse(response, attemptIndex === startIndex ? void 0 : attemptIndex);
				recordSuccessfulAttempt(attemptIndex);
				return response;
			} catch (caught) {
				signal?.throwIfAborted();
				const tunnelFailure = describeProxyTunnelFailure(attempt.exportAttempt.dispatcherPolicy?.mode, caught);
				if (tunnelFailure) throw new TelegramRequestNotStartedError(`Telegram proxy tunnel did not open: ${tunnelFailure}`, { cause: caught });
				err = caught;
				recordAttemptFailure(attemptIndex, err);
				if (!shouldRetryRequest(err)) throw err;
			}
		}
		throw err;
	});
	return {
		fetch: resolvedFetch,
		sourceFetch,
		dispatcherAttempts: transportAttempts.map((attempt) => attempt.exportAttempt),
		forceFallback: (reason, err) => promoteStickyAttempt(stickyAttemptIndex + 1, err ?? /* @__PURE__ */ new Error("forced fallback"), reason),
		close: async () => {
			if (closed) return;
			closed = true;
			const toDestroy = [...ownedDispatchers];
			ownedDispatchers.clear();
			await Promise.allSettled(toDestroy.map(async (dispatcher) => dispatcher.destroy()));
		}
	};
}
function resolveTelegramFetch(proxyFetch, options) {
	return resolveTelegramTransport(proxyFetch, options).fetch;
}
//#endregion
export { readTelegramRetryAfterMs as C, normalizeTelegramApiRoot as D, hasTelegramBotEndpointApiRoot as E, isTelegramServerError as S, extractTelegramApiMethod as T, isTelegramEditTargetMissingError as _, bindTelegramRequestAuthority as a, isTelegramMisdirectedRequestError as b, withoutTelegramRequestAuthority as c, isRecoverableTelegramNetworkError as d, isRetryableTelegramApiError as f, isTelegramClientRejection as g, isTelegramBadRequestError as h, assertTelegramRequestAuthority as i, TelegramRequestNotStartedError as l, isTelegramAuthenticationError as m, resolveTelegramTransport as n, findTelegramRequestAuthorityError as o, isSafeToRetrySendError as p, shouldRetryTelegramTransportFallback as r, getTelegramRequestAuthority as s, resolveTelegramFetch as t, hasTelegramNetworkErrorCode as u, isTelegramMessageHasNoTextError as v, rethrowTelegramSendError as w, isTelegramRateLimitError as x, isTelegramMessageNotModifiedError as y };
