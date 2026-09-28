import { a as matchesNoProxy, o as resolveEnvHttpProxyAgentOptions } from "./proxy-env-BwCPCI9p.mjs";
import { n as resolveActiveManagedProxyTlsOptions } from "./managed-proxy-undici-B-MQJy6x.mjs";
import { createRequire } from "node:module";
//#region src/infra/net/node-proxy-agent.ts
const UNSUPPORTED_PROXY_PROTOCOL_MESSAGE = "Unsupported proxy protocol. SOCKS and PAC proxy URLs are not supported; use an HTTP or HTTPS proxy URL.";
const require = createRequire(import.meta.url);
function proxyUrlWithDefaultScheme(proxyUrl, protocol) {
	const withScheme = proxyUrl.includes("://") ? proxyUrl : `${protocol}://${proxyUrl}`;
	let parsed;
	try {
		parsed = new URL(withScheme);
	} catch {
		throw new Error("Invalid proxy URL. Use an HTTP or HTTPS proxy URL.");
	}
	if (parsed.protocol !== "http:" && parsed.protocol !== "https:") throw new Error(`${UNSUPPORTED_PROXY_PROTOCOL_MESSAGE} Got ${parsed.protocol}`);
	return parsed;
}
function fixedProxyEnv(proxyUrl) {
	const href = proxyUrl.href;
	return {
		HTTP_PROXY: href,
		HTTPS_PROXY: href,
		ALL_PROXY: void 0,
		NO_PROXY: void 0,
		http_proxy: void 0,
		https_proxy: void 0,
		all_proxy: void 0,
		no_proxy: void 0
	};
}
function loadCreateAmbientNodeProxyAgent() {
	return require("@openclaw/proxyline").createAmbientNodeProxyAgent;
}
function applyNodeAgentOptions(agent, options) {
	if (options === void 0) return;
	const agentWithOptions = agent;
	agentWithOptions.options = {
		...agentWithOptions.options,
		...options
	};
	if (typeof options.keepAlive === "boolean") agentWithOptions.keepAlive = options.keepAlive;
	if (typeof options.keepAliveMsecs === "number") agentWithOptions.keepAliveMsecs = options.keepAliveMsecs;
	if (typeof options.maxFreeSockets === "number") agentWithOptions.maxFreeSockets = options.maxFreeSockets;
	if (typeof options.maxSockets === "number") agentWithOptions.maxSockets = options.maxSockets;
	if (typeof options.maxTotalSockets === "number") agentWithOptions.maxTotalSockets = options.maxTotalSockets;
	if (options.scheduling === "fifo" || options.scheduling === "lifo") agentWithOptions.scheduling = options.scheduling;
	if (typeof options.timeout === "number") agentWithOptions.timeout = options.timeout;
}
/** Resolves the env proxy URL that should be used for a specific Node target. */
function resolveEnvNodeProxyUrlForTarget(targetUrl, env = process.env) {
	return resolveEnvNodeProxyTarget(targetUrl, env)?.proxyUrl;
}
function resolveEnvNodeProxyTarget(targetUrl, env = process.env) {
	let target;
	try {
		target = new URL(targetUrl instanceof URL ? targetUrl.href : targetUrl);
	} catch {
		return;
	}
	if (target.protocol === "ws:") target.protocol = "http:";
	else if (target.protocol === "wss:") target.protocol = "https:";
	let protocol;
	if (target.protocol === "http:") protocol = "http";
	else if (target.protocol === "https:") protocol = "https";
	else return;
	if (matchesNoProxy(target, env)) return;
	const proxyOptions = resolveEnvHttpProxyAgentOptions(env);
	const proxyUrl = protocol === "https" ? proxyOptions?.httpsProxy : proxyOptions?.httpProxy;
	return proxyUrl ? {
		proxyUrl: proxyUrlWithDefaultScheme(proxyUrl, protocol),
		protocol
	} : void 0;
}
function createFixedNodeProxyAgent(proxyUrl, options = {}) {
	const parsedProxyUrl = proxyUrl instanceof URL ? proxyUrl : proxyUrlWithDefaultScheme(proxyUrl, options.protocol ?? "https");
	const proxyConnect = options.proxyConnect;
	const agent = loadCreateAmbientNodeProxyAgent()({
		env: fixedProxyEnv(parsedProxyUrl),
		protocol: options.protocol ?? "https",
		...options.proxyTls !== void 0 ? { proxyTls: options.proxyTls } : {},
		...proxyConnect !== void 0 ? { resolveProxyConnectOptions: () => proxyConnect } : {}
	});
	if (agent === void 0) throw new Error(`${UNSUPPORTED_PROXY_PROTOCOL_MESSAGE} Got ${parsedProxyUrl.protocol}`);
	applyNodeAgentOptions(agent, options.agentOptions);
	return agent;
}
function createNodeProxyAgent(options) {
	if (options.mode === "explicit") return createFixedNodeProxyAgent(options.proxyUrl, {
		protocol: options.protocol,
		agentOptions: options.agentOptions,
		proxyConnect: options.proxyConnect
	});
	return createEnvNodeProxyAgentForTarget(options.targetUrl, {
		protocol: options.protocol,
		agentOptions: options.agentOptions,
		proxyConnect: options.proxyConnect
	});
}
function createEnvNodeProxyAgentForTarget(targetUrl, options = {}) {
	const target = resolveEnvNodeProxyTarget(targetUrl);
	if (target === void 0) return;
	return createFixedNodeProxyAgent(target.proxyUrl, {
		protocol: options.protocol ?? target.protocol,
		proxyTls: resolveActiveManagedProxyTlsOptions({ proxyUrl: target.proxyUrl.href }),
		agentOptions: options.agentOptions,
		proxyConnect: options.proxyConnect
	});
}
/** Builds paired HTTP and HTTPS agents for libraries that require both slots. */
function createFixedNodeProxyAgentPair(proxyUrl) {
	const parsedProxyUrl = proxyUrl instanceof URL ? proxyUrl : proxyUrlWithDefaultScheme(proxyUrl, "https");
	const proxyTls = resolveActiveManagedProxyTlsOptions({ proxyUrl: parsedProxyUrl.href });
	return {
		httpAgent: createFixedNodeProxyAgent(parsedProxyUrl, {
			protocol: "http",
			proxyTls
		}),
		httpsAgent: createFixedNodeProxyAgent(parsedProxyUrl, {
			protocol: "https",
			proxyTls
		})
	};
}
//#endregion
export { createNodeProxyAgent as n, resolveEnvNodeProxyUrlForTarget as r, createFixedNodeProxyAgentPair as t };
