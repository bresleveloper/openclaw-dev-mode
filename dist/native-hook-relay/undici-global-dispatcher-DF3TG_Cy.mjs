import { s as toErrorObject } from "./error-coercion-DKQY4wyF.mjs";
import { D as isRecord, g as normalizeLowercaseStringOrEmpty, y as normalizeOptionalString } from "./number-coercion-CmpLVzZ6.mjs";
import { st as expectDefined } from "./redact-TLu2QTmL.mjs";
import { t as formatErrorMessage } from "./errors-BwnhmTMH.mjs";
import { t as logDebug } from "./logger-CzdVvCtS.mjs";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import "node:fs/promises";
import * as net$1 from "node:net";
import net from "node:net";
import { EventEmitter } from "node:events";
import { isProxylineDispatcher } from "@openclaw/proxyline/dispatcher-brand";
//#region src/infra/net/proxy-env.ts
function readProxyEnvValue(key, env) {
	const lower = env[key];
	const value = typeof lower === "string" ? lower : env[key.toUpperCase()];
	if (typeof value !== "string") return;
	return value.trim() || void 0;
}
/**
* Match undici EnvHttpProxyAgent semantics for env-based HTTP/S proxy selection:
* - lower-case vars take precedence over upper-case
* - HTTPS requests prefer https_proxy/HTTPS_PROXY, then fall back to http_proxy/HTTP_PROXY
* - ALL_PROXY is ignored by EnvHttpProxyAgent
*/
function resolveEnvHttpProxyUrl(protocol, env = process.env) {
	const httpProxy = readProxyEnvValue("http_proxy", env);
	const httpsProxy = readProxyEnvValue("https_proxy", env);
	return protocol === "https" ? httpsProxy ?? httpProxy : httpProxy;
}
/** Return whether EnvHttpProxyAgent-style HTTP/S proxy resolution finds a proxy URL. */
function hasEnvHttpProxyConfigured(protocol = "https", env = process.env) {
	return resolveEnvHttpProxyUrl(protocol, env) !== void 0;
}
/**
* Build explicit options for undici's EnvHttpProxyAgent.
*
* EnvHttpProxyAgent does not read ALL_PROXY itself, but it accepts explicit
* HTTP/HTTPS proxy overrides. Keep this helper separate from the
* HTTP(S)-only URL helpers so SSRF trusted-env proxy gates do not widen.
*/
function resolveEnvHttpProxyAgentOptions(env = process.env) {
	const allProxy = readProxyEnvValue("all_proxy", env);
	const httpProxy = resolveEnvHttpProxyUrl("http", env) ?? allProxy;
	const httpsProxy = resolveEnvHttpProxyUrl("https", env) ?? httpProxy;
	const options = {
		...httpProxy ? { httpProxy } : {},
		...httpsProxy ? { httpsProxy } : {}
	};
	return options.httpProxy || options.httpsProxy ? options : void 0;
}
/** Return whether a target URL should use configured HTTP/S env proxy variables. */
function shouldUseEnvHttpProxyForUrl(targetUrl, env = process.env) {
	let parsed;
	let protocol;
	try {
		parsed = new URL(targetUrl);
		if (parsed.protocol === "http:") protocol = "http";
		else if (parsed.protocol === "https:") protocol = "https";
		else return false;
	} catch {
		return false;
	}
	return hasEnvHttpProxyConfigured(protocol, env) && !matchesNoProxy(parsed, env);
}
/**
* Check whether a target URL should bypass the HTTP proxy per NO_PROXY env var.
*
* Mirrors undici EnvHttpProxyAgent semantics
* (`undici/lib/dispatcher/env-http-proxy-agent.js`):
* - Entries separated by commas OR whitespace (undici splits on `/[,\s]/`)
* - Case-insensitive
* - A single trailing DNS dot is ignored in both hosts and entries
* - Lower-case `no_proxy` shadows upper-case `NO_PROXY`, including blank values
* - Empty or missing → no bypass
* - Bare `*` value → bypass everything
* - Exact hostname match
* - Leading-dot match (`.example.com` matches `foo.example.com`)
* - Leading `*.` wildcard match (`*.example.com` matches `foo.example.com`);
*   undici normalizes via `.replace(/^\*?\./, '')`, so the bare domain also
*   matches (kept in sync with that behavior)
* - Subdomain suffix match (`openai.com` matches `api.openai.com`)
* - Optional `:port` suffix; when present, must match target port
* - IPv6 literals in bracketed (`[::1]`) or bare (`::1`) form
* - OpenClaw extension: IPv4 CIDR and octet-wildcard entries
*   (`100.64.0.0/10`, `100.64.*`) bypass the trusted env proxy mode before
*   undici's EnvHttpProxyAgent is selected.
*
* Undici does not export its matcher, so this is a targeted reimplementation
* kept in sync with the upstream file above. Paired with
* `hasEnvHttpProxyConfigured` this gates the trusted-env-proxy auto-upgrade
* in provider HTTP helpers; see openclaw#64974 review thread on NO_PROXY
* SSRF bypass.
*/
function matchesNoProxy(targetUrl, env = process.env) {
	const raw = env.no_proxy ?? env.NO_PROXY ?? "";
	if (!raw) return false;
	let parsed;
	try {
		parsed = targetUrl instanceof URL ? targetUrl : new URL(targetUrl);
	} catch {
		return false;
	}
	const targetHost = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, "").replace(/^(.+)\.$/, "$1");
	if (!targetHost) return false;
	if (raw === "*") return true;
	const targetIpv4 = parseIpv4Address(targetHost);
	const targetPort = parsed.port !== "" ? parsed.port : parsed.protocol === "https:" ? "443" : parsed.protocol === "http:" ? "80" : "";
	for (const rawEntry of raw.split(/[,\s]/)) {
		const entry = rawEntry.trim().toLowerCase();
		if (!entry) continue;
		let entryHost;
		let entryPort;
		if (entry.startsWith("[")) {
			const m = entry.match(/^\[([^\]]+)\](?::(\d+))?$/);
			if (!m) continue;
			entryHost = expectDefined(m[1], "m capture group 1");
			entryPort = m[2];
		} else {
			const firstColonIdx = entry.indexOf(":");
			const lastColonIdx = entry.lastIndexOf(":");
			if (firstColonIdx > -1 && firstColonIdx === lastColonIdx && /^\d+$/.test(entry.slice(lastColonIdx + 1))) {
				entryHost = entry.slice(0, lastColonIdx);
				entryPort = entry.slice(lastColonIdx + 1);
			} else entryHost = entry;
		}
		if (entryPort && entryPort !== targetPort) continue;
		const normalizedEntry = entryHost.replace(/^\*?\./, "").replace(/^(.+)\.$/, "$1");
		if (!normalizedEntry || normalizedEntry === "*") continue;
		if (matchesIpv4NoProxyPattern(targetIpv4, normalizedEntry)) return true;
		if (targetHost === normalizedEntry) return true;
		if (targetHost.endsWith("." + normalizedEntry)) return true;
	}
	return false;
}
function parseIpv4Address(host) {
	const parts = host.split(".");
	if (parts.length !== 4) return;
	let value = 0;
	for (const part of parts) {
		if (!/^\d{1,3}$/.test(part)) return;
		const octet = Number(part);
		if (!Number.isInteger(octet) || octet < 0 || octet > 255) return;
		value = value << 8 | octet;
	}
	return value >>> 0;
}
function matchesIpv4NoProxyPattern(target, entryHost) {
	if (target === void 0) return false;
	const cidrMatch = entryHost.match(/^(\d{1,3}(?:\.\d{1,3}){3})\/(\d{1,2})$/);
	if (cidrMatch) {
		const network = parseIpv4Address(expectDefined(cidrMatch[1], "cidr match capture group 1"));
		const prefixLength = Number(cidrMatch[2]);
		if (network === void 0 || prefixLength < 0 || prefixLength > 32) return false;
		const mask = prefixLength === 0 ? 0 : 4294967295 << 32 - prefixLength >>> 0;
		return (target & mask) === (network & mask);
	}
	if (!entryHost.includes("*")) return false;
	const patternParts = entryHost.split(".");
	if (patternParts.length > 4) return false;
	for (const [index, part] of patternParts.entries()) {
		if (part === "*") {
			if (index === patternParts.length - 1) return true;
			continue;
		}
		if (!/^\d{1,3}$/.test(part) || Number(part) !== (target >>> (3 - index) * 8 & 255)) return false;
	}
	return patternParts.length === 4;
}
function parseActiveManagedProxyLoopbackMode(value) {
	if (value === "gateway-only" || value === "proxy" || value === "block") return value;
}
function readInheritedActiveManagedProxyLoopbackMode() {
	if (process.env["OPENCLAW_PROXY_ACTIVE"] !== "1") return;
	return parseActiveManagedProxyLoopbackMode(process.env["OPENCLAW_PROXY_LOOPBACK_MODE"]) ?? "gateway-only";
}
/** Returns local loopback policy from in-process state or inherited proxy env. */
function getActiveManagedProxyLoopbackMode() {
	return readInheritedActiveManagedProxyLoopbackMode();
}
//#endregion
//#region src/infra/net/proxy/proxy-tls.ts
/** Returns a CA file only for HTTPS proxy URLs; HTTP proxies do not need TLS trust. */
function resolveManagedProxyCaFileForUrl(params) {
	if (!params.proxyUrl || URL.parse(params.proxyUrl)?.protocol !== "https:") return;
	return normalizeOptionalString(params.caFileOverride) ?? normalizeOptionalString(params.config?.tls?.caFile);
}
/** Loads managed proxy TLS options synchronously for inherited child-process routing. */
function loadManagedProxyTlsOptionsSync(caFile) {
	if (!caFile) return;
	try {
		return { ca: readFileSync(caFile, "utf8") };
	} catch (err) {
		throw new Error(`proxy CA file could not be read (${caFile}): ${formatErrorMessage(err)}`, { cause: err });
	}
}
//#endregion
//#region src/infra/net/proxy/active-managed-proxy-tls.ts
function normalizeProxyUrl(value) {
	return value ? URL.parse(value)?.href : void 0;
}
function resolveManagedProxyUrl(env = process.env) {
	if (env.OPENCLAW_PROXY_ACTIVE !== "1") return;
	return normalizeProxyUrl(resolveEnvHttpProxyUrl("https", env));
}
/** Resolves managed proxy TLS trust only when the target proxy is OpenClaw's active proxy. */
function resolveActiveManagedProxyTlsOptions(params) {
	const env = params?.env ?? process.env;
	const managedProxyUrl = resolveManagedProxyUrl(env);
	const targetProxyUrl = normalizeProxyUrl(params?.proxyUrl ?? resolveEnvHttpProxyUrl("https", env));
	if (!managedProxyUrl || targetProxyUrl !== managedProxyUrl) return;
	const proxyCaFile = resolveManagedProxyCaFileForUrl({
		proxyUrl: managedProxyUrl,
		caFileOverride: env.OPENCLAW_PROXY_CA_FILE
	});
	try {
		return loadManagedProxyTlsOptionsSync(proxyCaFile);
	} catch {
		return;
	}
}
//#endregion
//#region src/infra/net/proxy/managed-proxy-undici.ts
function readProxyTlsRecord(options) {
	if (!options || !("proxyTls" in options)) return;
	return isRecord(options.proxyTls) ? options.proxyTls : void 0;
}
function readProxyUrlFromOptions(options) {
	if (!options) return;
	if ("uri" in options) {
		const uri = options.uri;
		return uri instanceof URL ? uri.href : typeof uri === "string" ? uri : void 0;
	}
	if ("httpsProxy" in options || "httpProxy" in options) {
		const httpsProxy = Reflect.get(options, "httpsProxy");
		const httpProxy = Reflect.get(options, "httpProxy");
		return typeof httpsProxy === "string" ? httpsProxy : typeof httpProxy === "string" ? httpProxy : void 0;
	}
}
function addActiveManagedProxyTlsOptions(options, params) {
	const proxyTls = resolveActiveManagedProxyTlsOptions({
		proxyUrl: readProxyUrlFromOptions(options),
		env: params?.env
	});
	if (!proxyTls) return options;
	const existingProxyTls = readProxyTlsRecord(options);
	return {
		...options,
		proxyTls: {
			...proxyTls,
			...existingProxyTls
		}
	};
}
//#endregion
//#region src/infra/wsl.ts
/** Detects WSL2 from kernel-version markers, which also establish WSL itself. */
function isWSL2Sync() {
	if (process.platform !== "linux") return false;
	try {
		const version = normalizeLowercaseStringOrEmpty(readFileSync("/proc/version", "utf8"));
		return version.includes("wsl2") || version.includes("microsoft-standard");
	} catch {
		return false;
	}
}
//#endregion
//#region src/infra/net/undici-family-policy.ts
const AUTO_SELECT_FAMILY_ATTEMPT_TIMEOUT_MS = 300;
/** Resolves the process default autoSelectFamily policy, with WSL2 forced to IPv4. */
function resolveUndiciAutoSelectFamily() {
	if (typeof net$1.getDefaultAutoSelectFamily !== "function") return;
	try {
		const systemDefault = net$1.getDefaultAutoSelectFamily();
		if (systemDefault && isWSL2Sync()) return false;
		return systemDefault;
	} catch {
		return;
	}
}
/** Converts an autoSelectFamily decision into the undici connect option shape. */
function createUndiciAutoSelectFamilyConnectOptions(autoSelectFamily) {
	if (autoSelectFamily === void 0) return;
	return {
		autoSelectFamily,
		autoSelectFamilyAttemptTimeout: AUTO_SELECT_FAMILY_ATTEMPT_TIMEOUT_MS
	};
}
/** Returns shared undici connect options for dispatchers that do not override them. */
function resolveUndiciAutoSelectFamilyConnectOptions() {
	return createUndiciAutoSelectFamilyConnectOptions(resolveUndiciAutoSelectFamily());
}
//#endregion
//#region src/infra/net/undici-error-diagnostics.ts
const observedDispatcherValues = /* @__PURE__ */ new WeakSet();
function logUndiciDispatcherError(error) {
	logDebug(`undici: internal dispatcher error: ${formatErrorMessage(error)}`);
}
function observeDispatcherValue(value) {
	if (typeof value !== "object" && typeof value !== "function" || value === null) return;
	if (observedDispatcherValues.has(value)) return;
	observedDispatcherValues.add(value);
	if (value instanceof EventEmitter) {
		EventEmitter.prototype.on.call(value, "error", logUndiciDispatcherError);
		EventEmitter.prototype.on.call(value, "connect", (_origin, targets) => {
			observeDispatcherValue(targets);
		});
		for (const key of Reflect.ownKeys(value)) {
			const descriptor = Object.getOwnPropertyDescriptor(value, key);
			if (descriptor && "value" in descriptor) observeDispatcherValue(descriptor.value);
		}
		return;
	}
	if (Array.isArray(value) || value instanceof Set || value instanceof Map) for (const entry of value instanceof Map ? value.values() : value) observeDispatcherValue(entry);
}
function withUndiciErrorDiagnostics(dispatcher) {
	observeDispatcherValue(dispatcher);
	return dispatcher;
}
//#endregion
//#region src/infra/net/undici-dispatcher-options.ts
const TEST_UNDICI_RUNTIME_DEPS_KEY = "__OPENCLAW_TEST_UNDICI_RUNTIME_DEPS__";
const requireUndici = createRequire(import.meta.url);
let undiciModule;
const HTTP1_ONLY_DISPATCHER_OPTIONS$1 = Object.freeze({ allowH2: false });
function loadUndiciModule(requiredExports) {
	const override = globalThis[TEST_UNDICI_RUNTIME_DEPS_KEY];
	if (isRecord(override) && requiredExports.every((key) => typeof override[key] === "function")) return override;
	return undiciModule ??= requireUndici("undici/index.js");
}
function createHttp1ProxyClient(origin, poolOptions) {
	const connect = isRecord(poolOptions) ? poolOptions.connect : void 0;
	return createUndiciPool(origin, {
		...poolOptions,
		...typeof connect === "function" ? { connect: (params, callback) => {
			const { servername, ...withoutServername } = params;
			return connect(servername && net.isIP(servername.replace(/^\[|\]$/g, "")) ? withoutServername : params, callback);
		} } : {}
	});
}
/** Prepare proxy transport without transferring direct-origin TLS or DNS policy. */
function buildProxyConnectOptions(options, timeoutMs) {
	const connect = {
		...resolveUndiciAutoSelectFamilyConnectOptions(),
		...typeof options.connect === "object" ? options.connect : {}
	};
	const timeout = normalizedTimeout(timeoutMs);
	return {
		autoSelectFamily: connect.autoSelectFamily,
		autoSelectFamilyAttemptTimeout: connect.autoSelectFamilyAttemptTimeout,
		family: "family" in connect ? connect.family : void 0,
		keepAlive: connect.keepAlive,
		keepAliveInitialDelay: connect.keepAliveInitialDelay,
		timeout: options.connectTimeout,
		...options.proxyTls,
		...timeout !== void 0 ? { timeout } : {},
		...HTTP1_ONLY_DISPATCHER_OPTIONS$1
	};
}
function createUndiciClient(origin, options) {
	const { Client } = loadUndiciModule(["Client"]);
	return withUndiciErrorDiagnostics(new Client(origin, options));
}
function createUndiciPool(origin, options) {
	const { Pool } = loadUndiciModule(["Pool"]);
	return withUndiciErrorDiagnostics(new Pool(origin, {
		...options,
		factory: createUndiciClient
	}));
}
function createUndiciOriginDispatcher(origin, options) {
	return options.connections === 1 ? createUndiciClient(origin, options) : createUndiciPool(origin, options);
}
function normalizedTimeout(timeoutMs) {
	return timeoutMs !== void 0 && Number.isFinite(timeoutMs) && timeoutMs > 0 ? Math.floor(timeoutMs) : void 0;
}
function buildHttp1AgentOptions(options = {}, timeoutMs) {
	const timeout = normalizedTimeout(timeoutMs);
	return {
		factory: createUndiciOriginDispatcher,
		...options,
		...HTTP1_ONLY_DISPATCHER_OPTIONS$1,
		connect: typeof options.connect === "function" ? options.connect : {
			...resolveUndiciAutoSelectFamilyConnectOptions(),
			...options.connect,
			...timeout !== void 0 ? { timeout } : {}
		},
		...timeout !== void 0 ? {
			bodyTimeout: timeout,
			headersTimeout: timeout
		} : {}
	};
}
function buildHttp1ProxyAgentOptions(options, timeoutMs, managedTlsEnv) {
	const normalized = typeof options === "string" || options instanceof URL ? { uri: options.toString() } : options;
	const { clientFactory = createHttp1ProxyClient } = normalized;
	const managed = addActiveManagedProxyTlsOptions(normalized, { env: managedTlsEnv });
	return {
		proxyTunnel: true,
		...managed,
		...buildHttp1AgentOptions(managed, timeoutMs),
		clientFactory
	};
}
//#endregion
//#region src/infra/net/undici-runtime.ts
/** Loads undici lazily, allowing tests to inject constructors without global side effects. */
function loadUndiciRuntimeDeps() {
	return loadUndiciModule([
		"Agent",
		"EnvHttpProxyAgent",
		"ProxyAgent",
		"fetch"
	]);
}
/** Loads only the undici global-dispatcher API used by startup proxy setup. */
function loadUndiciGlobalDispatcherDeps() {
	return loadUndiciModule(["getGlobalDispatcher", "setGlobalDispatcher"]);
}
/** Creates a direct undici Agent with OpenClaw's HTTP/1-only dispatcher policy. */
function createHttp1Agent(options, timeoutMs) {
	const { Agent } = loadUndiciRuntimeDeps();
	return withUndiciErrorDiagnostics(new Agent(buildHttp1AgentOptions(options, timeoutMs)));
}
function isSocksProxy(uri) {
	return uri !== void 0 && ["socks:", "socks5:"].includes(URL.parse(uri)?.protocol ?? "");
}
function createSocksProxyAgent(options, timeoutMs) {
	const { Agent, Socks5ProxyAgent, buildConnector, errors } = loadUndiciModule([
		"Agent",
		"Socks5ProxyAgent",
		"buildConnector"
	]);
	if (typeof options.clientFactory !== "function") throw new errors.InvalidArgumentError("Proxy opts.clientFactory must be a function.");
	if (options.auth && options.token) throw new errors.InvalidArgumentError("opts.auth cannot be used in combination with opts.token");
	const connect = buildConnector(buildProxyConnectOptions(options, timeoutMs));
	class SocksProxyAgent extends Agent {}
	const agent = withUndiciErrorDiagnostics(new SocksProxyAgent({
		...options,
		factory: () => withUndiciErrorDiagnostics(new Socks5ProxyAgent(options.uri, {
			...options,
			connect
		}))
	}));
	const defaults = {
		connections: options.connections,
		pipelining: options.pipelining,
		bodyTimeout: options.bodyTimeout,
		headersTimeout: options.headersTimeout
	};
	return agent.compose((dispatch) => (request, handler) => {
		const headers = request.headers;
		const names = Array.isArray(headers) ? headers.filter((_, index) => index % 2 === 0) : [];
		if (!Array.isArray(headers)) for (const name in headers) names.push(name);
		if (names.some((name) => typeof name === "string" && name.toLowerCase() === "proxy-authorization")) throw new errors.InvalidArgumentError("Proxy-Authorization should be sent in ProxyAgent constructor");
		return dispatch({
			...defaults,
			...request
		}, handler);
	});
}
function completeProxyLifecycle(start, callback) {
	if (callback !== void 0 && typeof callback !== "function") {
		const { errors } = loadUndiciModule([]);
		throw new errors.InvalidArgumentError("invalid callback");
	}
	const completion = start().then(() => void 0);
	if (callback) completion.then(() => callback(null, null), (error) => callback(toErrorObject(error, "Proxy shutdown failed"), null));
	else return completion;
}
/** Creates an env dispatcher with per-hop connectors and the existing dynamic bypass policy. */
function createHttp1EnvHttpProxyAgent(options, timeoutMs, managedTlsEnv) {
	const { EnvHttpProxyAgent } = loadUndiciRuntimeDeps();
	const httpProxy = options?.httpProxy ?? process.env.http_proxy ?? process.env.HTTP_PROXY;
	const httpsProxy = (options?.httpsProxy ?? process.env.https_proxy ?? process.env.HTTPS_PROXY) || httpProxy;
	const proxies = /* @__PURE__ */ new Map();
	for (const uri of [httpProxy, httpsProxy]) if (uri && !proxies.has(uri)) proxies.set(uri, createHttp1ProxyAgent({
		...options,
		uri
	}, timeoutMs, managedTlsEnv));
	const dispatcher = withUndiciErrorDiagnostics(new EnvHttpProxyAgent({
		...buildHttp1AgentOptions(options, timeoutMs),
		httpProxy: "",
		httpsProxy: "",
		noProxy: "*"
	}));
	if (proxies.size === 0) return dispatcher;
	const owned = [dispatcher, ...proxies.values()];
	const isDestroyed = () => owned.every((agent) => Reflect.get(agent, "destroyed") === true);
	let closing;
	return new Proxy(dispatcher, { get(target, property, receiver) {
		if (property === "destroyed") return isDestroyed();
		if (property === "dispatch") return (request, handler) => {
			const origin = request?.origin ? URL.parse(String(request.origin)) : null;
			const uri = origin?.protocol === "https:" ? httpsProxy : httpProxy;
			const proxy = uri && proxies.get(uri);
			const bypassEnv = options?.noProxy === void 0 ? process.env : { no_proxy: options.noProxy };
			return proxy && origin && !matchesNoProxy(origin, bypassEnv) ? proxy.dispatch(request, handler) : target.dispatch(request, handler);
		};
		if (property === "close") return (callback) => completeProxyLifecycle(() => isDestroyed() ? target.close() : closing ??= Promise.all(owned.map((agent) => agent.close())).finally(() => {
			closing = void 0;
		}), callback);
		if (property === "destroy") return (error, callback) => completeProxyLifecycle(() => Promise.all(owned.map((agent) => agent.destroy(typeof error === "function" ? null : error ?? null))), typeof error === "function" ? error : callback);
		return Reflect.get(target, property, receiver);
	} });
}
/** Creates a fixed proxy dispatcher without using TLS options for plain TCP policy. */
function createHttp1ProxyAgent(options, timeoutMs, managedTlsEnv) {
	const prepared = buildHttp1ProxyAgentOptions(options, timeoutMs, managedTlsEnv);
	if (isSocksProxy(prepared.uri)) return createSocksProxyAgent(prepared, timeoutMs);
	const { ProxyAgent } = loadUndiciRuntimeDeps();
	return withUndiciErrorDiagnostics(new ProxyAgent({
		...prepared,
		proxyTls: buildProxyConnectOptions(prepared, timeoutMs)
	}));
}
Object.freeze({ allowH2: false });
/** Shares the global timeout with guarded fetch without reading Undici's private options. */
let globalUndiciStreamTimeoutMs;
let lastAppliedProxyBootstrapKey = null;
const timedProxylineManagedDispatchers = /* @__PURE__ */ new WeakMap();
function isTimedProxylineManagedDispatcher(dispatcher) {
	return typeof dispatcher === "object" && dispatcher !== null ? timedProxylineManagedDispatchers.has(dispatcher) : false;
}
function resolveDispatcherKind(dispatcher) {
	const ctorName = dispatcher?.constructor?.name;
	if (typeof ctorName !== "string" || ctorName.length === 0) return "unsupported";
	if (ctorName.includes("EnvHttpProxyAgent")) return "env-proxy";
	if (isTimedProxylineManagedDispatcher(dispatcher) || isProxylineDispatcher(dispatcher)) return "proxyline-managed";
	if (ctorName.includes("ProxyAgent")) return "unsupported";
	if (ctorName.includes("Agent")) return "agent";
	return "unsupported";
}
function resolveEnvProxyBootstrapKey(options) {
	const proxyTls = [.../* @__PURE__ */ new Set([options.httpProxy, options.httpsProxy])].map((proxyUrl) => proxyUrl ? resolveActiveManagedProxyTlsOptions({ proxyUrl }) : void 0);
	return JSON.stringify([
		options.httpProxy,
		options.httpsProxy,
		proxyTls
	]);
}
function resolveCurrentDispatcherInfo(runtime) {
	let dispatcher;
	try {
		dispatcher = runtime.getGlobalDispatcher();
	} catch {
		return null;
	}
	const currentKind = resolveDispatcherKind(dispatcher);
	if (currentKind === "unsupported") return null;
	return {
		kind: currentKind,
		dispatcher
	};
}
/**
* Re-evaluate proxy env changes for root undici imports. Installs
* EnvHttpProxyAgent when proxy env is present, and restores a direct Agent
* after proxy env is cleared.
*/
function forceResetGlobalDispatcher(opts) {
	const proxyOptions = resolveEnvHttpProxyAgentOptions();
	if (!proxyOptions) {
		if (lastAppliedProxyBootstrapKey === null) return;
		lastAppliedProxyBootstrapKey = null;
		try {
			const { setGlobalDispatcher } = loadUndiciGlobalDispatcherDeps();
			setGlobalDispatcher(createHttp1Agent());
		} catch {}
		return;
	}
	try {
		const runtime = loadUndiciGlobalDispatcherDeps();
		const { setGlobalDispatcher } = runtime;
		if (opts?.preserveProxylineManaged) {
			if (resolveCurrentDispatcherInfo(runtime)?.kind === "proxyline-managed") {
				lastAppliedProxyBootstrapKey = resolveEnvProxyBootstrapKey(proxyOptions);
				return;
			}
		}
		setGlobalDispatcher(createHttp1EnvHttpProxyAgent(proxyOptions));
		lastAppliedProxyBootstrapKey = resolveEnvProxyBootstrapKey(proxyOptions);
	} catch {}
}
//#endregion
export { createHttp1ProxyAgent as a, loadManagedProxyTlsOptionsSync as c, shouldUseEnvHttpProxyForUrl as d, createHttp1EnvHttpProxyAgent as i, resolveManagedProxyCaFileForUrl as l, globalUndiciStreamTimeoutMs as n, loadUndiciRuntimeDeps as o, createHttp1Agent as r, resolveUndiciAutoSelectFamilyConnectOptions as s, forceResetGlobalDispatcher as t, getActiveManagedProxyLoopbackMode as u };
