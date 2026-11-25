import { readResponseWithLimit } from "openclaw/plugin-sdk/response-limit-runtime";
import { fetchWithSsrFGuard, isBlockedHostnameOrIp, isLoopbackHost } from "openclaw/plugin-sdk/ssrf-runtime";
// extensions/discord/src/endpoint-runtime.ts
const DISCORD_ENDPOINT_RESPONSE_MAX_BYTES = 8388608;
const DISCORD_API_URL_ENV = "DISCORD_API_URL";
function parseHttpAnchor(value, label) {
	let url;
	try {
		url = new URL(value);
	} catch {
		throw new Error(`${label} must be a valid URL`);
	}
	if (url.protocol !== "https:" && !(url.protocol === "http:" && isLoopbackHost(url.hostname))) throw new Error(`${label} must use HTTPS or loopback HTTP`);
	if (url.username || url.password || url.hash) throw new Error(`${label} must not contain credentials or a fragment`);
	return url;
}
function normalizeRestApiBaseUrl(value) {
	const url = parseHttpAnchor(value, "Discord endpoint REST API base URL");
	if (url.search) throw new Error("Discord endpoint REST API base URL must not contain a query");
	url.pathname = url.pathname.replace(/\/+$/u, "") || "/";
	return url;
}
function resolveDescriptor(apiUrl) {
	const restApiBaseUrl = normalizeRestApiBaseUrl(apiUrl);
	const gatewayBotUrl = new URL(`${restApiBaseUrl.pathname.replace(/\/+$/u, "")}/gateway/bot`, restApiBaseUrl.origin);
	const gatewayOriginUrl = new URL(restApiBaseUrl.origin);
	gatewayOriginUrl.protocol = gatewayOriginUrl.protocol === "https:" ? "wss:" : "ws:";
	if (gatewayOriginUrl.protocol === "wss:" && isBlockedHostnameOrIp(gatewayOriginUrl.hostname)) throw new Error("Discord endpoint Gateway origin must not target a private/internal/special-use hostname or IP address");
	return Object.freeze({
		restApiBaseUrl: restApiBaseUrl.toString().replace(/\/$/u, ""),
		gatewayBotUrl: gatewayBotUrl.toString(),
		gatewayOrigin: gatewayOriginUrl.origin
	});
}
function isWithinRestApiBase(target, restApiBaseUrl) {
	if (target.origin !== restApiBaseUrl.origin) return false;
	const basePath = restApiBaseUrl.pathname.replace(/\/+$/u, "");
	return basePath === "" || target.pathname === basePath || target.pathname.startsWith(`${basePath}/`);
}
function assertEndpointHttpTarget(target, descriptor) {
	const restApiBaseUrl = new URL(descriptor.restApiBaseUrl);
	const gatewayBotUrl = new URL(descriptor.gatewayBotUrl);
	if (!isWithinRestApiBase(target, restApiBaseUrl) && target.toString() !== gatewayBotUrl.toString()) throw new Error("Discord endpoint request is outside the configured boundaries");
}
function requestInitFromRequest(request, signal) {
	return {
		method: request.method,
		headers: request.headers,
		...request.body ? {
			body: request.body,
			duplex: "half"
		} : {},
		signal,
		cache: request.cache,
		credentials: request.credentials,
		integrity: request.integrity,
		keepalive: request.keepalive,
		mode: request.mode,
		referrer: request.referrer,
		referrerPolicy: request.referrerPolicy
	};
}
function createEndpointFetch(descriptor) {
	const allowedOrigins = Array.from(/* @__PURE__ */ new Set([new URL(descriptor.restApiBaseUrl).origin, new URL(descriptor.gatewayBotUrl).origin]));
	return async (input, init, beforeRequest) => {
		const request = new Request(input, init);
		const target = new URL(request.url);
		assertEndpointHttpTarget(target, descriptor);
		const guarded = await fetchWithSsrFGuard({
			url: target.toString(),
			init: requestInitFromRequest(request, request.signal),
			signal: request.signal,
			requireHttps: target.protocol === "https:",
			policy: { allowedOrigins },
			maxRedirects: 0,
			capture: false,
			auditContext: "discord.endpoint-runtime",
			beforeRequest
		});
		try {
			const body = await readResponseWithLimit(guarded.response, DISCORD_ENDPOINT_RESPONSE_MAX_BYTES, { onOverflow: ({ size, maxBytes }) => /* @__PURE__ */ new Error(`Discord endpoint response too large: ${size} bytes (limit: ${maxBytes} bytes)`) });
			return new Response(body.byteLength > 0 ? new Uint8Array(body) : null, {
				status: guarded.response.status,
				statusText: guarded.response.statusText,
				headers: guarded.response.headers
			});
		} finally {
			await guarded.release();
		}
	};
}
/** Resolve the process-wide Discord API override using the same env convention as sibling channels. */
function getDiscordEndpointRuntime() {
	const apiUrl = process.env[DISCORD_API_URL_ENV]?.trim();
	if (!apiUrl) return;
	const descriptor = resolveDescriptor(apiUrl);
	return Object.freeze({
		descriptor,
		fetch: createEndpointFetch(descriptor)
	});
}
function resolveDiscordEndpointMediaGuard(url, retainedRuntime) {
	const guard = resolveEndpointResourceGuard(url, "media", retainedRuntime);
	return guard ? {
		maxRedirects: guard.maxRedirects,
		ssrfPolicy: guard.policy
	} : void 0;
}
function resolveDiscordEndpointAttachmentGuard(url, retainedRuntime) {
	return resolveEndpointResourceGuard(url, "attachment upload", retainedRuntime);
}
function resolveEndpointResourceGuard(url, kind, retainedRuntime) {
	if (retainedRuntime === null) return;
	const runtime = retainedRuntime ?? getDiscordEndpointRuntime();
	if (!runtime) return;
	const target = parseHttpAnchor(url, `Discord endpoint ${kind} URL`);
	const restOrigin = new URL(runtime.descriptor.restApiBaseUrl).origin;
	if (target.origin !== restOrigin) throw new Error(`Discord endpoint ${kind} URL is outside the configured REST origin`);
	return {
		maxRedirects: 0,
		policy: {
			allowedOrigins: [restOrigin],
			hostnameAllowlist: [target.hostname]
		},
		requireHttps: target.protocol === "https:"
	};
}
function assertDiscordEndpointGatewayUrl(url, gatewayOrigin) {
	if (!gatewayOrigin) return;
	let parsed;
	try {
		parsed = new URL(url);
	} catch {
		throw new Error("Discord endpoint returned an invalid Gateway WebSocket URL");
	}
	if (parsed.origin !== gatewayOrigin || parsed.username || parsed.password || parsed.hash) throw new Error("Discord endpoint Gateway URL is outside the configured WebSocket origin");
}
export { resolveDiscordEndpointMediaGuard as i, getDiscordEndpointRuntime as n, resolveDiscordEndpointAttachmentGuard as r, assertDiscordEndpointGatewayUrl as t };
