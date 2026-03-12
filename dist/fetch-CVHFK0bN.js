import { t as createSubsystemLogger } from "./subsystem-NSiOA8hi.js";
import { t as isTruthyEnvValue } from "./env-ChlBW8C4.js";
import { t as hasEnvHttpProxyConfigured } from "./proxy-env-BuRaUv3b.js";
import { t as getProxyUrlFromFetch } from "./proxy-fetch-DHPfZjfB.js";
import { t as resolveFetch } from "./fetch-C28BvV1J.js";
import { n as isWSL2Sync } from "./wsl-Db7oUtGO.js";
import process$1 from "node:process";
import * as dns from "node:dns";
import { Agent, EnvHttpProxyAgent, ProxyAgent, fetch } from "undici";
//#region src/telegram/network-config.ts
const TELEGRAM_DISABLE_AUTO_SELECT_FAMILY_ENV = "OPENCLAW_TELEGRAM_DISABLE_AUTO_SELECT_FAMILY";
const TELEGRAM_ENABLE_AUTO_SELECT_FAMILY_ENV = "OPENCLAW_TELEGRAM_ENABLE_AUTO_SELECT_FAMILY";
const TELEGRAM_DNS_RESULT_ORDER_ENV = "OPENCLAW_TELEGRAM_DNS_RESULT_ORDER";
let wsl2SyncCache;
function isWSL2SyncCached() {
	if (typeof wsl2SyncCache === "boolean") return wsl2SyncCache;
	wsl2SyncCache = isWSL2Sync();
	return wsl2SyncCache;
}
function resolveTelegramAutoSelectFamilyDecision(params) {
	const env = params?.env ?? process$1.env;
	const nodeMajor = typeof params?.nodeMajor === "number" ? params.nodeMajor : Number(process$1.versions.node.split(".")[0]);
	if (isTruthyEnvValue(env["OPENCLAW_TELEGRAM_ENABLE_AUTO_SELECT_FAMILY"])) return {
		value: true,
		source: `env:${TELEGRAM_ENABLE_AUTO_SELECT_FAMILY_ENV}`
	};
	if (isTruthyEnvValue(env["OPENCLAW_TELEGRAM_DISABLE_AUTO_SELECT_FAMILY"])) return {
		value: false,
		source: `env:${TELEGRAM_DISABLE_AUTO_SELECT_FAMILY_ENV}`
	};
	if (typeof params?.network?.autoSelectFamily === "boolean") return {
		value: params.network.autoSelectFamily,
		source: "config"
	};
	if (isWSL2SyncCached()) return {
		value: false,
		source: "default-wsl2"
	};
	if (Number.isFinite(nodeMajor) && nodeMajor >= 22) return {
		value: true,
		source: "default-node22"
	};
	return { value: null };
}
/**
* Resolve DNS result order setting for Telegram network requests.
* Some networks/ISPs have issues with IPv6 causing fetch failures.
* Setting "ipv4first" prioritizes IPv4 addresses in DNS resolution.
*
* Priority:
* 1. Environment variable OPENCLAW_TELEGRAM_DNS_RESULT_ORDER
* 2. Config: channels.telegram.network.dnsResultOrder
* 3. Default: "ipv4first" on Node 22+ (to work around common IPv6 issues)
*/
function resolveTelegramDnsResultOrderDecision(params) {
	const env = params?.env ?? process$1.env;
	const nodeMajor = typeof params?.nodeMajor === "number" ? params.nodeMajor : Number(process$1.versions.node.split(".")[0]);
	const envValue = env[TELEGRAM_DNS_RESULT_ORDER_ENV]?.trim().toLowerCase();
	if (envValue === "ipv4first" || envValue === "verbatim") return {
		value: envValue,
		source: `env:${TELEGRAM_DNS_RESULT_ORDER_ENV}`
	};
	const configValue = (params?.network)?.dnsResultOrder?.trim().toLowerCase();
	if (configValue === "ipv4first" || configValue === "verbatim") return {
		value: configValue,
		source: "config"
	};
	if (Number.isFinite(nodeMajor) && nodeMajor >= 22) return {
		value: "ipv4first",
		source: "default-node22"
	};
	return { value: null };
}
//#endregion
//#region src/telegram/fetch.ts
const log = createSubsystemLogger("telegram/network");
const TELEGRAM_AUTO_SELECT_FAMILY_ATTEMPT_TIMEOUT_MS = 300;
const TELEGRAM_API_HOSTNAME = "api.telegram.org";
const FALLBACK_RETRY_ERROR_CODES = [
	"ETIMEDOUT",
	"ENETUNREACH",
	"EHOSTUNREACH",
	"UND_ERR_CONNECT_TIMEOUT",
	"UND_ERR_SOCKET"
];
const IPV4_FALLBACK_RULES = [{
	name: "fetch-failed-envelope",
	matches: ({ message }) => message.includes("fetch failed")
}, {
	name: "known-network-code",
	matches: ({ codes }) => FALLBACK_RETRY_ERROR_CODES.some((code) => codes.has(code))
}];
function normalizeDnsResultOrder(value) {
	if (value === "ipv4first" || value === "verbatim") return value;
	return null;
}
function createDnsResultOrderLookup(order) {
	if (!order) return;
	const lookup = dns.lookup;
	return (hostname, options, callback) => {
		lookup(hostname, {
			...typeof options === "number" ? { family: options } : options ? { ...options } : {},
			order,
			verbatim: order === "verbatim"
		}, callback);
	};
}
function buildTelegramConnectOptions(params) {
	const connect = {};
	if (params.forceIpv4) {
		connect.family = 4;
		connect.autoSelectFamily = false;
	} else if (typeof params.autoSelectFamily === "boolean") {
		connect.autoSelectFamily = params.autoSelectFamily;
		connect.autoSelectFamilyAttemptTimeout = TELEGRAM_AUTO_SELECT_FAMILY_ATTEMPT_TIMEOUT_MS;
	}
	const lookup = createDnsResultOrderLookup(params.dnsResultOrder);
	if (lookup) connect.lookup = lookup;
	return Object.keys(connect).length > 0 ? connect : null;
}
function shouldBypassEnvProxyForTelegramApi(env = process.env) {
	const noProxyValue = env.no_proxy ?? env.NO_PROXY ?? "";
	if (!noProxyValue) return false;
	if (noProxyValue === "*") return true;
	const targetHostname = TELEGRAM_API_HOSTNAME.toLowerCase();
	const targetPort = 443;
	const noProxyEntries = noProxyValue.split(/[,\s]/);
	for (let i = 0; i < noProxyEntries.length; i++) {
		const entry = noProxyEntries[i];
		if (!entry) continue;
		const parsed = entry.match(/^(.+):(\d+)$/);
		const entryHostname = (parsed ? parsed[1] : entry).replace(/^\*?\./, "").toLowerCase();
		const entryPort = parsed ? Number.parseInt(parsed[2], 10) : 0;
		if (entryPort && entryPort !== targetPort) continue;
		if (targetHostname === entryHostname || targetHostname.slice(-(entryHostname.length + 1)) === `.${entryHostname}`) return true;
	}
	return false;
}
function hasEnvHttpProxyForTelegramApi(env = process.env) {
	return hasEnvHttpProxyConfigured("https", env);
}
function createTelegramDispatcher(params) {
	const connect = buildTelegramConnectOptions({
		autoSelectFamily: params.autoSelectFamily,
		dnsResultOrder: params.dnsResultOrder,
		forceIpv4: params.forceIpv4
	});
	const explicitProxyUrl = params.proxyUrl?.trim();
	if (explicitProxyUrl) {
		const proxyOptions = connect ? {
			uri: explicitProxyUrl,
			proxyTls: connect
		} : explicitProxyUrl;
		try {
			return {
				dispatcher: new ProxyAgent(proxyOptions),
				mode: "explicit-proxy"
			};
		} catch (err) {
			const reason = err instanceof Error ? err.message : String(err);
			throw new Error(`explicit proxy dispatcher init failed: ${reason}`, { cause: err });
		}
	}
	if (params.useEnvProxy) {
		const proxyOptions = connect ? {
			connect,
			proxyTls: connect
		} : void 0;
		try {
			return {
				dispatcher: new EnvHttpProxyAgent(proxyOptions),
				mode: "env-proxy"
			};
		} catch (err) {
			log.warn(`env proxy dispatcher init failed; falling back to direct dispatcher: ${err instanceof Error ? err.message : String(err)}`);
		}
	}
	return {
		dispatcher: new Agent(connect ? { connect } : void 0),
		mode: "direct"
	};
}
function withDispatcherIfMissing(init, dispatcher) {
	if (init?.dispatcher) return init ?? {};
	return init ? {
		...init,
		dispatcher
	} : { dispatcher };
}
function resolveWrappedFetch(fetchImpl) {
	return resolveFetch(fetchImpl) ?? fetchImpl;
}
function logResolverNetworkDecisions(params) {
	if (params.autoSelectDecision.value !== null) {
		const sourceLabel = params.autoSelectDecision.source ? ` (${params.autoSelectDecision.source})` : "";
		log.info(`autoSelectFamily=${params.autoSelectDecision.value}${sourceLabel}`);
	}
	if (params.dnsDecision.value !== null) {
		const sourceLabel = params.dnsDecision.source ? ` (${params.dnsDecision.source})` : "";
		log.info(`dnsResultOrder=${params.dnsDecision.value}${sourceLabel}`);
	}
}
function collectErrorCodes(err) {
	const codes = /* @__PURE__ */ new Set();
	const queue = [err];
	const seen = /* @__PURE__ */ new Set();
	while (queue.length > 0) {
		const current = queue.shift();
		if (!current || seen.has(current)) continue;
		seen.add(current);
		if (typeof current === "object") {
			const code = current.code;
			if (typeof code === "string" && code.trim()) codes.add(code.trim().toUpperCase());
			const cause = current.cause;
			if (cause && !seen.has(cause)) queue.push(cause);
			const errors = current.errors;
			if (Array.isArray(errors)) {
				for (const nested of errors) if (nested && !seen.has(nested)) queue.push(nested);
			}
		}
	}
	return codes;
}
function formatErrorCodes(err) {
	const codes = [...collectErrorCodes(err)];
	return codes.length > 0 ? codes.join(",") : "none";
}
function shouldRetryWithIpv4Fallback(err) {
	const ctx = {
		message: err && typeof err === "object" && "message" in err ? String(err.message).toLowerCase() : "",
		codes: collectErrorCodes(err)
	};
	for (const rule of IPV4_FALLBACK_RULES) if (!rule.matches(ctx)) return false;
	return true;
}
function resolveTelegramFetch(proxyFetch, options) {
	const autoSelectDecision = resolveTelegramAutoSelectFamilyDecision({ network: options?.network });
	const dnsDecision = resolveTelegramDnsResultOrderDecision({ network: options?.network });
	logResolverNetworkDecisions({
		autoSelectDecision,
		dnsDecision
	});
	const explicitProxyUrl = proxyFetch ? getProxyUrlFromFetch(proxyFetch) : void 0;
	const undiciSourceFetch = resolveWrappedFetch(fetch);
	const sourceFetch = explicitProxyUrl ? undiciSourceFetch : proxyFetch ? resolveWrappedFetch(proxyFetch) : undiciSourceFetch;
	if (proxyFetch && !explicitProxyUrl) return sourceFetch;
	const dnsResultOrder = normalizeDnsResultOrder(dnsDecision.value);
	const useEnvProxy = !explicitProxyUrl && hasEnvHttpProxyForTelegramApi();
	const defaultDispatcherResolution = createTelegramDispatcher({
		autoSelectFamily: autoSelectDecision.value,
		dnsResultOrder,
		useEnvProxy,
		forceIpv4: false,
		proxyUrl: explicitProxyUrl
	});
	const defaultDispatcher = defaultDispatcherResolution.dispatcher;
	const shouldBypassEnvProxy = shouldBypassEnvProxyForTelegramApi();
	const allowStickyIpv4Fallback = defaultDispatcherResolution.mode === "direct" || defaultDispatcherResolution.mode === "env-proxy" && shouldBypassEnvProxy;
	const stickyShouldUseEnvProxy = defaultDispatcherResolution.mode === "env-proxy";
	let stickyIpv4FallbackEnabled = false;
	let stickyIpv4Dispatcher = null;
	const resolveStickyIpv4Dispatcher = () => {
		if (!stickyIpv4Dispatcher) stickyIpv4Dispatcher = createTelegramDispatcher({
			autoSelectFamily: false,
			dnsResultOrder: "ipv4first",
			useEnvProxy: stickyShouldUseEnvProxy,
			forceIpv4: true,
			proxyUrl: explicitProxyUrl
		}).dispatcher;
		return stickyIpv4Dispatcher;
	};
	return (async (input, init) => {
		const callerProvidedDispatcher = Boolean(init?.dispatcher);
		const initialInit = withDispatcherIfMissing(init, stickyIpv4FallbackEnabled ? resolveStickyIpv4Dispatcher() : defaultDispatcher);
		try {
			return await sourceFetch(input, initialInit);
		} catch (err) {
			if (shouldRetryWithIpv4Fallback(err)) {
				if (callerProvidedDispatcher) return sourceFetch(input, init ?? {});
				if (!allowStickyIpv4Fallback) throw err;
				if (!stickyIpv4FallbackEnabled) {
					stickyIpv4FallbackEnabled = true;
					log.warn(`fetch fallback: enabling sticky IPv4-only dispatcher (codes=${formatErrorCodes(err)})`);
				}
				return sourceFetch(input, withDispatcherIfMissing(init, resolveStickyIpv4Dispatcher()));
			}
			throw err;
		}
	});
}
//#endregion
export { resolveTelegramFetch as t };
