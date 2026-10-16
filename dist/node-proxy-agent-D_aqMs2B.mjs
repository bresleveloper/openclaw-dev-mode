import { a as resolveEnvHttpProxyAgentOptions, i as matchesNoProxy } from "./proxy-env-DlRjxK5F.mjs";
import { n as resolveActiveManagedProxyTlsOptions } from "./managed-proxy-undici-Dp2zTdjV.mjs";
import { t as loadProxyline } from "./proxyline-runtime-Df2Nb5Zp.mjs";
import { isIPv6 } from "node:net";
//#region src/infra/net/node-proxy-agent.ts
const UNSUPPORTED_PROXY_PROTOCOL_MESSAGE = "Unsupported proxy protocol. SOCKS and PAC proxy URLs are not supported; use an HTTP or HTTPS proxy URL.";
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
	const proxyHref = proxyUrlWithDefaultScheme(proxyUrl instanceof URL ? proxyUrl.href : proxyUrl, options.protocol ?? "https").href;
	const proxyConnect = options.proxyConnect;
	const { ProxylineNodeProxyAgent } = loadProxyline();
	return new ProxylineNodeProxyAgent({
		...options.agentOptions,
		defaultProtocol: options.protocol ?? "https",
		getProxyForUrl: () => proxyHref,
		proxyTls: options.proxyTls,
		resolveProxyConnectOptions: proxyConnect !== void 0 ? () => proxyConnect : void 0
	});
}
function createPerRequestEnvProxyAgent(options) {
	const env = { ...process.env };
	const proxies = resolveEnvHttpProxyAgentOptions(env);
	if (!proxies) return;
	const routes = /* @__PURE__ */ new Map();
	const agents = [];
	for (const protocol of ["http", "https"]) {
		const value = protocol === "http" ? proxies.httpProxy : proxies.httpsProxy;
		if (!value) continue;
		try {
			const proxyUrl = proxyUrlWithDefaultScheme(value, protocol);
			const agent = createFixedNodeProxyAgent(proxyUrl, {
				protocol: options.protocol,
				proxyTls: resolveActiveManagedProxyTlsOptions({
					proxyUrl: proxyUrl.href,
					env
				}),
				agentOptions: options.agentOptions,
				proxyConnect: options.proxyConnect
			});
			routes.set(protocol, agent.addRequest.bind(agent));
			agents.push(agent);
		} catch (error) {
			routes.set(protocol, () => {
				throw error;
			});
		}
	}
	const { ProxylineNodeProxyAgent } = loadProxyline();
	const router = new ProxylineNodeProxyAgent({
		...options.agentOptions,
		defaultProtocol: options.protocol ?? "https",
		getProxyForUrl: () => ""
	});
	const directRequest = router.addRequest.bind(router);
	router.addRequest = (request, requestOptions) => {
		const protocol = request.protocol === "https:" ? "https" : "http";
		const host = isIPv6(request.host) ? `[${request.host}]` : request.host;
		const target = new URL(`${request.protocol}//${host}`);
		if (requestOptions.port) target.port = String(requestOptions.port);
		const route = matchesNoProxy(target, env) ? void 0 : routes.get(protocol);
		if (route) route(request, requestOptions);
		else directRequest(request, requestOptions);
	};
	const destroyRouter = router.destroy.bind(router);
	router.destroy = () => {
		for (const agent of agents) agent.destroy();
		destroyRouter();
	};
	return router;
}
function createNodeProxyAgent(options) {
	if (options.mode === "explicit") return createFixedNodeProxyAgent(options.proxyUrl, {
		protocol: options.protocol,
		agentOptions: options.agentOptions,
		proxyConnect: options.proxyConnect
	});
	if (options.targetUrl === void 0) return createPerRequestEnvProxyAgent(options);
	const target = resolveEnvNodeProxyTarget(options.targetUrl);
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
