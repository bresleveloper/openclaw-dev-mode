import { n as truncateUtf8Suffix } from "./utf8-truncate-_hf7tp13.mjs";
import { t as logDebug } from "./logger-DHVmYOKs.mjs";
import { n as resolveMcpTransportConfig } from "./mcp-transport-config-_nMiaWKV.mjs";
import { i as OpenClawStreamableHTTPClientTransport, r as OpenClawSSEClientTransport, t as OpenClawStdioClientTransport } from "./mcp-stdio-transport-DLsQzsXq.mjs";
import { a as withoutMcpAuthorizationHeader, i as withSameOriginMcpHttpHeaders, r as buildMcpOAuthHttpFetch, t as buildMcpHttpFetch } from "./mcp-http-fetch-DP8syqxH.mjs";
import { i as withMcpAuthProfileBearer, n as resolveMcpAuthProfileId } from "./mcp-auth-profile-PE2J10CY.mjs";
import { n as operatorMcpOAuthIdentity, r as requesterMcpOAuthIdentity } from "./mcp-oauth-identity-0fgjEqV6.mjs";
import { StringDecoder } from "node:string_decoder";
import { extractWWWAuthenticateParams } from "@modelcontextprotocol/sdk/client/auth.js";
//#region src/agents/mcp-oauth-fetch.ts
function withBearerHeader(init, accessToken) {
	const headers = new Headers(init.headers);
	headers.set("authorization", `Bearer ${accessToken}`);
	return {
		...init,
		headers
	};
}
async function toFetchInit(request) {
	const body = request.body ? await request.arrayBuffer() : void 0;
	return {
		method: request.method,
		headers: request.headers,
		body,
		cache: request.cache,
		credentials: request.credentials,
		integrity: request.integrity,
		keepalive: request.keepalive,
		mode: request.mode,
		redirect: request.redirect,
		referrer: request.referrer,
		referrerPolicy: request.referrerPolicy,
		signal: request.signal
	};
}
/**
* Own native OAuth retries above the MCP SDK transport. The SDK otherwise runs
* refresh outside OpenClaw's cross-process OAuth lease on every 401/403.
*/
function withMcpOAuthBearer(params) {
	const resourceOrigin = new URL(params.identity.serverUrl).origin;
	return async (input, init) => {
		const source = input instanceof Request ? input.clone() : input;
		const request = new Request(source, init);
		const requestUrl = request.url;
		if (new URL(requestUrl).origin !== resourceOrigin) return await params.fetchFn(requestUrl, await toFetchInit(request));
		const { recordMcpOAuthAuthorizationRequired, resolveMcpOAuthAccessToken } = await import("./mcp-oauth-CXL2rQxA.mjs");
		const accessToken = await resolveMcpOAuthAccessToken({
			identity: params.identity,
			config: params.config,
			fetchFn: params.authFetchFn,
			acceptUnknownExpiry: true,
			allowMissingToken: true,
			signal: request.signal
		});
		const fetchInit = await toFetchInit(request);
		const firstInit = accessToken ? withBearerHeader(fetchInit, accessToken) : fetchInit;
		const response = await params.fetchFn(requestUrl, firstInit);
		const challenge = extractWWWAuthenticateParams(response);
		const insufficientScope = response.status === 403 && challenge.error === "insufficient_scope";
		if (!(response.status === 401 || insufficientScope)) return response;
		await response.body?.cancel().catch(() => void 0);
		const nextAccessToken = await resolveMcpOAuthAccessToken({
			identity: params.identity,
			config: params.config,
			fetchFn: params.authFetchFn,
			acceptUnknownExpiry: true,
			authorizationChallenge: true,
			interactiveAuthorizationRequired: insufficientScope,
			rejectedAccessToken: accessToken,
			resourceMetadataUrl: challenge.resourceMetadataUrl,
			signal: request.signal,
			scope: challenge.scope
		});
		const retryInit = withBearerHeader(fetchInit, nextAccessToken);
		const retryResponse = await params.fetchFn(requestUrl, retryInit);
		const retryChallenge = extractWWWAuthenticateParams(retryResponse);
		const retryInsufficientScope = retryResponse.status === 403 && retryChallenge.error === "insufficient_scope";
		if (retryResponse.status === 401 || retryInsufficientScope) {
			const rejectedAccessToken = nextAccessToken;
			await recordMcpOAuthAuthorizationRequired({
				identity: params.identity,
				rejectedAccessToken,
				resourceMetadataUrl: retryChallenge.resourceMetadataUrl ?? challenge.resourceMetadataUrl,
				scope: retryChallenge.scope ?? challenge.scope,
				signal: request.signal
			});
		}
		return retryResponse;
	};
}
//#endregion
//#region src/agents/mcp-transport.ts
/**
* MCP client transport factory.
*
* This module turns normalized MCP server config into stdio, SSE, or
* streamable-HTTP SDK transports with OpenClaw auth, redirect, and logging rules.
*/
const MAX_MCP_STDERR_LINE_BYTES = 8192;
function attachStderrLogging(serverName, transport) {
	const stderr = transport.stderr;
	if (!stderr) return;
	const decoder = new StringDecoder("utf8");
	let pending = "";
	let truncated = false;
	let progressTimer;
	const emit = (text) => {
		const tail = truncateUtf8Suffix(text, MAX_MCP_STDERR_LINE_BYTES);
		const message = `${truncated || tail !== text ? "[stderr line truncated] " : ""}${tail}`.trim();
		truncated = false;
		if (message) logDebug(`bundle-mcp:${serverName}: ${message}`);
	};
	const flushProgress = () => {
		progressTimer = void 0;
		const text = pending;
		pending = "";
		emit(text);
	};
	const onData = (chunk) => {
		const decoded = decoder.write(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
		const lines = (pending + decoded).split(/[\r\n]/);
		pending = lines.pop() ?? "";
		for (const line of lines) emit(line);
		const tail = truncateUtf8Suffix(pending, MAX_MCP_STDERR_LINE_BYTES);
		truncated ||= tail !== pending;
		pending = tail;
		if (pending && !progressTimer) {
			progressTimer = setTimeout(flushProgress, 250);
			progressTimer.unref();
		} else if (!pending) {
			clearTimeout(progressTimer);
			progressTimer = void 0;
		}
	};
	const finalize = () => {
		stderr.off("data", onData);
		stderr.off("end", finalize);
		stderr.off("close", finalize);
		clearTimeout(progressTimer);
		pending += decoder.end();
		flushProgress();
	};
	stderr.on("data", onData);
	stderr.on("end", finalize);
	stderr.on("close", finalize);
	return finalize;
}
function buildSseEventSourceFetch(headers, baseFetch) {
	return (url, init) => {
		const mergedHeaders = {};
		for (const [key, value] of new Headers(init?.headers)) mergedHeaders[key.toLowerCase()] = value;
		for (const [key, value] of Object.entries(headers)) mergedHeaders[key.toLowerCase()] = value;
		return baseFetch(url, {
			...init,
			headers: mergedHeaders
		});
	};
}
/** Resolves a configured MCP server into a live SDK transport instance. */
function resolveMcpTransport(serverName, rawServer, options) {
	const resolved = resolveMcpTransportConfig(serverName, rawServer);
	if (!resolved) return null;
	const metadata = {
		description: resolved.description,
		transportType: resolved.transportType,
		connectionTimeoutMs: resolved.connectionTimeoutMs,
		requestTimeoutMs: resolved.requestTimeoutMs,
		supportsParallelToolCalls: resolved.supportsParallelToolCalls
	};
	if (resolved.kind === "stdio") {
		const transport = new OpenClawStdioClientTransport({
			command: resolved.command,
			args: resolved.args,
			env: resolved.env,
			cwd: resolved.cwd,
			prepareDataDir: options?.prepareDataDir,
			stderr: "pipe"
		});
		return {
			transport,
			...metadata,
			detachStderr: attachStderrLogging(serverName, transport)
		};
	}
	const authProfileId = resolveMcpAuthProfileId(rawServer);
	const requesterScope = options?.requesterScope;
	let oauthIdentity;
	if (resolved.oauth?.identity === "per-requester") {
		if (!requesterScope) return null;
		oauthIdentity = requesterMcpOAuthIdentity(serverName, resolved.url, requesterScope);
	} else oauthIdentity = operatorMcpOAuthIdentity(serverName, resolved.url);
	const baseFetch = buildMcpHttpFetch({
		sslVerify: resolved.sslVerify,
		clientCert: resolved.clientCert,
		clientKey: resolved.clientKey,
		resourceUrl: resolved.url,
		requestTimeoutMs: resolved.requestTimeoutMs,
		beforeRequest: options?.beforeRequest
	});
	const headers = resolved.auth === "oauth" || authProfileId ? withoutMcpAuthorizationHeader(resolved.headers) : resolved.headers;
	const resourceFetch = withSameOriginMcpHttpHeaders({
		fetchFn: baseFetch,
		headers,
		resourceUrl: resolved.url
	});
	const httpFetch = authProfileId ? withMcpAuthProfileBearer({
		fetchFn: baseFetch,
		serverName,
		resourceUrl: resolved.url,
		headers,
		authProfileId,
		cfg: options?.cfg,
		agentDir: options?.agentDir
	}) : resolved.auth === "oauth" ? withMcpOAuthBearer({
		fetchFn: resourceFetch,
		authFetchFn: buildMcpOAuthHttpFetch({
			sslVerify: resolved.sslVerify,
			clientCert: resolved.clientCert,
			clientKey: resolved.clientKey,
			resourceUrl: resolved.url,
			timeoutMs: resolved.requestTimeoutMs,
			beforeRequest: options?.beforeRequest,
			headers
		}),
		identity: oauthIdentity,
		config: resolved.oauth
	}) : baseFetch;
	if (resolved.transportType === "streamable-http") {
		let requestInit = resolved.auth === "oauth" || !headers ? void 0 : { headers };
		if (options?.requestHeaders) {
			const requestHeaders = new Headers(requestInit?.headers);
			for (const [name, value] of Object.entries(options.requestHeaders)) requestHeaders.set(name, value);
			requestInit = { headers: requestHeaders };
		}
		return {
			transport: new OpenClawStreamableHTTPClientTransport(new URL(resolved.url), {
				requestInit,
				fetch: httpFetch
			}),
			...metadata
		};
	}
	const sseHeaders = { ...headers };
	const hasHeaders = Object.keys(sseHeaders).length > 0;
	return {
		transport: new OpenClawSSEClientTransport(new URL(resolved.url), {
			requestInit: resolved.auth === "oauth" || !hasHeaders ? void 0 : { headers: sseHeaders },
			fetch: httpFetch,
			eventSourceInit: { fetch: buildSseEventSourceFetch(resolved.auth === "oauth" ? {} : sseHeaders, httpFetch) }
		}),
		...metadata
	};
}
//#endregion
export { resolveMcpTransport as t };
