import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as isWSL2Sync } from "./wsl-BqZ6SFne.mjs";
import { t as logDebug } from "./logger-BHMMVs5C.mjs";
import { a as matchesNoProxy } from "./proxy-env-BwCPCI9p.mjs";
import { t as addActiveManagedProxyTlsOptions } from "./managed-proxy-undici-B-MQJy6x.mjs";
import { createRequire } from "node:module";
import * as net$1 from "node:net";
import net from "node:net";
import { EventEmitter } from "node:events";
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
/**
* Temporarily applies an undici family decision around synchronous setup code.
* Restore is best-effort because older Node runtimes may not expose the setters.
*/
function withTemporaryUndiciAutoSelectFamily(autoSelectFamily, run) {
	if (autoSelectFamily === void 0 || typeof net$1.getDefaultAutoSelectFamily !== "function" || typeof net$1.setDefaultAutoSelectFamily !== "function") return run();
	let previous;
	try {
		previous = net$1.getDefaultAutoSelectFamily();
		net$1.setDefaultAutoSelectFamily(autoSelectFamily);
	} catch {
		return run();
	}
	try {
		return run();
	} finally {
		try {
			net$1.setDefaultAutoSelectFamily(previous);
		} catch {}
	}
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
	if (Array.isArray(value) || value instanceof Set) {
		for (const entry of value) observeDispatcherValue(entry);
		return;
	}
	if (value instanceof Map) for (const entry of value.values()) observeDispatcherValue(entry);
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
const HTTP1_ONLY_DISPATCHER_OPTIONS = Object.freeze({ allowH2: false });
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
		...HTTP1_ONLY_DISPATCHER_OPTIONS
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
		...HTTP1_ONLY_DISPATCHER_OPTIONS,
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
//#endregion
export { loadUndiciRuntimeDeps as a, resolveUndiciAutoSelectFamilyConnectOptions as c, loadUndiciGlobalDispatcherDeps as i, withTemporaryUndiciAutoSelectFamily as l, createHttp1EnvHttpProxyAgent as n, createUndiciAutoSelectFamilyConnectOptions as o, createHttp1ProxyAgent as r, resolveUndiciAutoSelectFamily as s, createHttp1Agent as t };
