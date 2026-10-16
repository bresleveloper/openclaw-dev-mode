import { a as loadUndiciRuntimeDeps } from "./undici-runtime-DnsVgrv0.mjs";
import { g as ssrfPolicyFromHttpBaseUrlAllowedOrigin } from "./ssrf-v45DW-yR.mjs";
import { d as wrapGuardedBodyStream, i as fetchWithSsrFGuard } from "./fetch-guard-DI6biu8d.mjs";
import fs from "node:fs";
//#region src/agents/mcp-http-fetch.ts
/**
* MCP HTTP fetch wrappers.
* Adds SSRF protection, scoped TLS/client-cert dispatchers, response cleanup,
* and same-origin header handling around the MCP SDK fetch contract.
*/
/** Default MCP HTTP fetch backed by lazy-loaded undici runtime deps. */
const fetchWithUndici = async (url, init) => await loadUndiciRuntimeDeps().fetch(url, init);
const fetchWithUndiciGuard = async (input, init) => await fetchWithUndici(input instanceof Request ? input.url : input, init);
const MCP_HTTP_MAX_REDIRECTS = 20;
function resolveFetchRequest(input, init) {
	if (input instanceof Request) {
		const request = new Request(input, init);
		const body = request.body ?? void 0;
		return {
			url: request.url,
			signal: request.signal,
			init: {
				method: request.method,
				headers: request.headers,
				body,
				redirect: request.redirect,
				...body ? { duplex: "half" } : {}
			}
		};
	}
	const { signal, ...requestInit } = init ?? {};
	return {
		url: input instanceof URL ? input.toString() : input,
		signal: signal ?? void 0,
		init: init ? requestInit : void 0
	};
}
async function buildManagedMcpResponse(response, release, refreshTimeout) {
	if (!response.body) release();
	return new Response(response.body ? wrapGuardedBodyStream({
		body: response.body,
		cleanup: release,
		refreshTimeout
	}) : null, {
		status: response.status,
		statusText: response.statusText,
		headers: response.headers
	});
}
function buildMcpHttpFetchWithRedirectPolicy(params, redirectPolicy) {
	const needsCustomDispatcher = params.sslVerify === false || Boolean(params.clientCert || params.clientKey);
	const scopedOrigin = params.resourceUrl ? new URL(params.resourceUrl).origin : void 0;
	const policy = params.resourceUrl ? ssrfPolicyFromHttpBaseUrlAllowedOrigin(params.resourceUrl) : void 0;
	let customConnect;
	const resolveCustomDispatcherPolicy = (url) => {
		if (!needsCustomDispatcher || !scopedOrigin || url.origin !== scopedOrigin) return;
		customConnect ??= {
			...params.sslVerify === false ? { rejectUnauthorized: false } : {},
			...params.clientCert ? { cert: fs.readFileSync(params.clientCert, "utf-8") } : {},
			...params.clientKey ? { key: fs.readFileSync(params.clientKey, "utf-8") } : {}
		};
		return {
			mode: "direct",
			connect: customConnect
		};
	};
	return async (url, init) => {
		const request = resolveFetchRequest(url, init);
		const guardedFetchOptions = {
			url: request.url,
			init: request.init,
			fetchImpl: fetchWithUndiciGuard,
			maxRedirects: MCP_HTTP_MAX_REDIRECTS,
			...redirectPolicy === "reject" ? { rejectCrossOriginUnsafeRedirectReplay: true } : { allowCrossOriginUnsafeRedirectReplay: true },
			auditContext: "mcp-http",
			useEnvProxyForEligibleUrls: true,
			beforeRequest: params.beforeRequest,
			...request.signal ? { signal: request.signal } : {},
			...params.timeoutMs !== void 0 ? { timeoutMs: params.timeoutMs } : {},
			...policy ? { policy } : {},
			...needsCustomDispatcher ? { resolveDispatcherPolicy: resolveCustomDispatcherPolicy } : {}
		};
		const guarded = await fetchWithSsrFGuard(guardedFetchOptions);
		return await buildManagedMcpResponse(guarded.response, guarded.release, guarded.refreshTimeout);
	};
}
/** Builds an MCP resource fetch with optional TLS/client-cert dispatcher support. */
function buildMcpHttpFetch(params) {
	return buildMcpHttpFetchWithRedirectPolicy(params, "replay");
}
/** Builds an OAuth fetch with scoped resource headers and fail-closed redirect replay. */
function buildMcpOAuthHttpFetch(params) {
	const { headers, ...fetchParams } = params;
	return withSameOriginMcpHttpHeaders({
		fetchFn: buildMcpHttpFetchWithRedirectPolicy(fetchParams, "reject"),
		headers: withoutMcpAuthorizationHeader(headers),
		resourceUrl: params.resourceUrl
	});
}
/** Removes Authorization from MCP headers before forwarding to non-authorized paths. */
function withoutMcpAuthorizationHeader(headers) {
	if (!headers) return;
	const entries = Object.entries(headers).filter(([key]) => key.toLowerCase() !== "authorization");
	return entries.length > 0 ? Object.fromEntries(entries) : void 0;
}
/** Wraps MCP fetch so configured headers are applied only to the resource origin. */
function withSameOriginMcpHttpHeaders(params) {
	if (!params.headers || Object.keys(params.headers).length === 0) return params.fetchFn;
	const resourceOrigin = new URL(params.resourceUrl).origin;
	return (url, init) => {
		if (new URL(url).origin !== resourceOrigin) return params.fetchFn(url, init);
		const headers = new Headers(params.headers);
		for (const [key, value] of new Headers(init?.headers)) headers.set(key, value);
		return params.fetchFn(url, {
			...init,
			headers
		});
	};
}
/** OAuth discovery and token responses are short-lived, so the deadline covers their bodies. */
function buildMcpOAuthAuthorizationFetch(config, beforeRequest) {
	return buildMcpOAuthHttpFetch({
		sslVerify: config.sslVerify,
		clientCert: config.clientCert,
		clientKey: config.clientKey,
		resourceUrl: config.url,
		timeoutMs: config.requestTimeoutMs,
		beforeRequest,
		headers: config.headers
	});
}
//#endregion
export { withoutMcpAuthorizationHeader as a, withSameOriginMcpHttpHeaders as i, buildMcpOAuthAuthorizationFetch as n, buildMcpOAuthHttpFetch as r, buildMcpHttpFetch as t };
