import { createRequire } from "node:module";
import { sleepWithAbort } from "openclaw/plugin-sdk/runtime-env";
import { pruneMapToMaxSize } from "openclaw/plugin-sdk/collection-runtime";
import { hash } from "node:crypto";
import { WebAPIRateLimitedError, WebClient } from "@slack/web-api";
import { addActiveManagedProxyTlsOptions, captureChannelReadAuthority, createHttp1EnvHttpProxyAgent, resolveEnvHttpProxyAgentOptions, resolveFetch } from "openclaw/plugin-sdk/fetch-runtime";
import { isDebugProxyGlobalFetchPatchInstalled } from "openclaw/plugin-sdk/proxy-capture";
import { parseRetryAfterHeaderSeconds, retryAsync } from "openclaw/plugin-sdk/retry-runtime";
import { fetchWithRuntimeDispatcher } from "openclaw/plugin-sdk/runtime-fetch";
// extensions/slack/src/client-options.ts
const SLACK_DEFAULT_RETRY_OPTIONS = {
	retries: 2,
	factor: 2,
	minTimeout: 500,
	maxTimeout: 3e3,
	randomize: true
};
const SLACK_WRITE_RETRY_OPTIONS = { retries: 0 };
const SLACK_READ_TIMEOUT_MS = 3e4;
const SLACK_LOOKUP_RETRY_OPTIONS = { retries: 0 };
function normalizeSlackFetchInit(init) {
	if (init?.body !== "") return init;
	const { body: _body, ...rest } = init;
	return rest;
}
function resolveSlackProxyDispatcher() {
	const options = resolveEnvHttpProxyAgentOptions();
	if (!options) return;
	try {
		return createHttp1EnvHttpProxyAgent(options, void 0, process.env);
	} catch {
		return;
	}
}
let slackSocketModeUndici;
/**
* Load the undici copy that @slack/socket-mode opens its WebSocket with.
*
* Socket Mode 3 calls `new undici.WebSocket(url, { dispatcher })` with its own
* undici. A dispatcher from another undici copy fails the handshake, so we must
* identify whether Socket Mode can share the runtime dispatcher. The explicit
* `undici/index.js` subpath keeps Bun's bare-`undici` placeholder out of the
* dispatcher (the same reason the runtime loads undici this way); under Bun,
* Socket Mode's bare import gets Bun's WebSocket, which does not consult a
* dispatcher at all.
*/
function loadSlackSocketModeUndici() {
	if (slackSocketModeUndici) return slackSocketModeUndici;
	const requireFromPlugin = createRequire(import.meta.url);
	const requireFromBolt = createRequire(requireFromPlugin.resolve("@slack/bolt/package.json"));
	slackSocketModeUndici = createRequire(requireFromBolt.resolve("@slack/socket-mode/package.json"))("undici/index.js");
	return slackSocketModeUndici;
}
/**
* Build the env-proxy dispatcher for Socket Mode's WebSocket.
*
* Reuse the Web API dispatcher when both transports load the same undici copy;
* its custom proxy routing supports Socket Mode's CONNECT handshake. Otherwise
* build one from Socket Mode's copy. Without a proxy env, preserve the default
* direct connection.
*/
function resolveSlackSocketModeDispatcher(webApi) {
	const options = resolveEnvHttpProxyAgentOptions();
	if (!options) return;
	const { EnvHttpProxyAgent } = loadSlackSocketModeUndici();
	if (webApi instanceof EnvHttpProxyAgent) return webApi;
	const agentOptions = addActiveManagedProxyTlsOptions(options);
	try {
		return new EnvHttpProxyAgent(agentOptions);
	} catch {
		return;
	}
}
/** Pair each Slack monitor transport with the dispatcher from the undici copy it uses. */
function resolveSlackMonitorDispatchers(mode) {
	const webApi = resolveSlackProxyDispatcher();
	const socketMode = mode === "socket" ? resolveSlackSocketModeDispatcher(webApi) : void 0;
	return {
		webApi,
		socketMode,
		close: async () => {
			await webApi?.close();
			if (socketMode !== webApi) await socketMode?.close();
		}
	};
}
const DIRECT_SLACK_DISPATCHER_OPTIONS = {
	httpProxy: "",
	httpsProxy: "",
	noProxy: "*"
};
/** Create a probe-owned dispatcher so timeout cleanup can retire every socket. */
function createSlackProbeDispatcher(timeoutMs) {
	const options = resolveEnvHttpProxyAgentOptions() ?? DIRECT_SLACK_DISPATCHER_OPTIONS;
	try {
		return createHttp1EnvHttpProxyAgent(options, timeoutMs, process.env);
	} catch {
		return createHttp1EnvHttpProxyAgent(DIRECT_SLACK_DISPATCHER_OPTIONS, timeoutMs, {});
	}
}
function buildSlackFetch(dispatcher) {
	if (!dispatcher || isDebugProxyGlobalFetchPatchInstalled()) {
		const slackFetch = resolveFetch();
		if (!slackFetch) return;
		return ((input, init) => slackFetch(input, normalizeSlackFetchInit(init)));
	}
	return ((input, init) => {
		return fetchWithRuntimeDispatcher(input, {
			...normalizeSlackFetchInit(init),
			dispatcher
		});
	});
}
function fenceSlackReadFetch(slackFetch, assertDirectAdapterHandoff) {
	const assertReadAuthority = captureChannelReadAuthority();
	return async (input, init) => {
		assertReadAuthority?.();
		captureChannelReadAuthority()?.();
		assertDirectAdapterHandoff?.();
		return slackFetch(input, init);
	};
}
function resolveSlackClientOptions(input, dispatcher, assertDirectAdapterHandoff) {
	const options = Object.assign({}, input);
	const slackApiUrl = options.slackApiUrl ?? (process.env.SLACK_API_URL?.trim() || void 0);
	const fetch = options.fetch ?? buildSlackFetch(dispatcher);
	if (slackApiUrl !== void 0) options.slackApiUrl = slackApiUrl;
	else delete options.slackApiUrl;
	if (!fetch) {
		if (assertDirectAdapterHandoff) throw new Error("Slack request fetch is unavailable for live authority.");
	} else options.fetch = fenceSlackReadFetch(fetch, assertDirectAdapterHandoff);
	return options;
}
function resolveSlackWebClientOptions(options = {}, dispatcher = resolveSlackProxyDispatcher(), assertDirectAdapterHandoff) {
	const resolved = resolveSlackClientOptions(options, dispatcher, assertDirectAdapterHandoff);
	resolved.retryConfig ??= SLACK_DEFAULT_RETRY_OPTIONS;
	return resolved;
}
function resolveSlackReadClientOptions(options = {}, dispatcher = resolveSlackProxyDispatcher(), assertDirectAdapterHandoff) {
	const resolved = resolveSlackWebClientOptions(options, dispatcher, assertDirectAdapterHandoff);
	resolved.timeout ??= SLACK_READ_TIMEOUT_MS;
	return resolved;
}
function resolveSlackWriteClientOptions(options = {}, dispatcher = resolveSlackProxyDispatcher(), assertDirectAdapterHandoff) {
	const resolved = resolveSlackClientOptions(options, dispatcher, assertDirectAdapterHandoff);
	resolved.retryConfig ??= SLACK_WRITE_RETRY_OPTIONS;
	if (resolved.rejectRateLimitedCalls !== true && resolved.retryConfig.retries === 0) {
		const slackFetch = resolved.fetch ?? buildSlackFetch(dispatcher);
		if (slackFetch) resolved.fetch = (input, init) => retryAsync(async () => {
			init?.signal?.throwIfAborted();
			const response = await slackFetch(input, init);
			if (response.status !== 429) return response;
			const retryAfter = parseRetryAfterHeaderSeconds(response.headers.get("retry-after"));
			response.body?.cancel().catch(() => void 0);
			init?.signal?.throwIfAborted();
			if (retryAfter === void 0 || retryAfter * 1e3 > 2147e6) return response;
			throw new WebAPIRateLimitedError(retryAfter);
		}, {
			attempts: 3,
			minDelayMs: 0,
			maxDelayMs: 0,
			shouldRetry: (error) => error instanceof WebAPIRateLimitedError,
			retryAfterMs: (error) => error instanceof WebAPIRateLimitedError ? error.retryAfter * 1e3 : void 0,
			sleep: (delayMs) => sleepWithAbort(delayMs, init?.signal)
		});
		resolved.rejectRateLimitedCalls = true;
	}
	return resolved;
}
function resolveSlackLookupClientOptions(options = {}, dispatcher = resolveSlackProxyDispatcher(), assertDirectAdapterHandoff) {
	const resolved = resolveSlackClientOptions(options, dispatcher, assertDirectAdapterHandoff);
	resolved.rejectRateLimitedCalls = true;
	resolved.retryConfig = SLACK_LOOKUP_RETRY_OPTIONS;
	resolved.timeout ??= SLACK_READ_TIMEOUT_MS;
	return resolved;
}
// extensions/slack/src/monitor/lru-map-cache.ts
function getOrCreateWeakOwnerMap(owners, owner) {
	let values = owners.get(owner);
	if (!values) {
		values = /* @__PURE__ */ new Map();
		owners.set(owner, values);
	}
	return values;
}
/** LRU-touch read: move hit to newest so pruneMapToMaxSize keeps active keys. */
function readLruMapEntry(cache, cacheKey) {
	const cached = cache.get(cacheKey);
	if (cached) {
		cache.delete(cacheKey);
		cache.set(cacheKey, cached);
	}
	return cached;
}
function writeLruMapEntry(cache, cacheKey, entry, maxEntries) {
	cache.delete(cacheKey);
	cache.set(cacheKey, entry);
	pruneMapToMaxSize(cache, maxEntries);
}
function pruneExpiredMapEntries(cache, now) {
	for (const [key, entry] of cache) if (entry.expiresAt <= now) cache.delete(key);
}
// extensions/slack/src/client.ts
const SLACK_WRITE_CLIENT_CACHE_MAX = 32;
const SLACK_STARTUP_AUTH_TIMEOUT_MS = 1e4;
const SLACK_STARTUP_AUTH_RETRY_BUDGET_MS = 35e3;
const slackWriteClientCache = /* @__PURE__ */ new Map();
const slackListenerWriteClientCache = /* @__PURE__ */ new WeakMap();
function createSlackClientFactory(resolveOptions) {
	return (token, options, assertDirectAdapterHandoff) => new WebClient(token, resolveOptions(options, void 0, assertDirectAdapterHandoff));
}
const createSlackWebClient = createSlackClientFactory(resolveSlackWebClientOptions);
const createSlackLookupClient = createSlackClientFactory(resolveSlackLookupClientOptions);
const createSlackWriteClient = createSlackClientFactory(resolveSlackWriteClientOptions);
function createSlackReadClient(token, options = {}, dispatcher, assertDirectAdapterHandoff) {
	return new WebClient(token, resolveSlackReadClientOptions(options, dispatcher, assertDirectAdapterHandoff));
}
function createSlackStartupAuthFetch(baseFetch) {
	const deadline = performance.now() + SLACK_STARTUP_AUTH_RETRY_BUDGET_MS;
	return async (input, init) => {
		const response = await baseFetch(input, init);
		if (response.status !== 429) return response;
		const retryAfter = Number.parseInt(response.headers.get("retry-after") ?? "", 10);
		const remainingMs = Math.max(0, deadline - performance.now());
		if (!Number.isFinite(retryAfter) || retryAfter * 1e3 <= remainingMs) return response;
		await new Promise((resolve) => {
			setTimeout(resolve, remainingMs);
		});
		throw new Error("Slack startup auth retry budget exhausted after rate limit");
	};
}
function createSlackStartupAuthClient(token, options = {}) {
	const resolvedOptions = resolveSlackWebClientOptions(options);
	const baseFetch = resolvedOptions.fetch;
	if (!baseFetch) throw new Error("Slack startup auth fetch is unavailable");
	return new WebClient(token, {
		...resolvedOptions,
		fetch: createSlackStartupAuthFetch(baseFetch),
		retryConfig: {
			...SLACK_DEFAULT_RETRY_OPTIONS,
			maxRetryTime: SLACK_STARTUP_AUTH_RETRY_BUDGET_MS
		},
		timeout: SLACK_STARTUP_AUTH_TIMEOUT_MS
	});
}
function createSlackTokenCacheKey(token) {
	return `sha256:${hash("sha256", token, "base64url")}`;
}
function slackWriteClientCacheKey(token, options) {
	return `${createSlackTokenCacheKey(token)}${options.slackApiUrl ? `:api:${options.slackApiUrl}` : ""}${options.teamId ? `:team:${options.teamId.trim().toLowerCase()}` : ""}`;
}
function getSlackWriteClient(token, options = {}) {
	const resolvedOptions = resolveSlackWriteClientOptions(options);
	const tokenKey = slackWriteClientCacheKey(token, resolvedOptions);
	const cached = readLruMapEntry(slackWriteClientCache, tokenKey);
	if (cached) return cached;
	const client = new WebClient(token, resolvedOptions);
	slackWriteClientCache.set(tokenKey, client);
	pruneMapToMaxSize(slackWriteClientCache, SLACK_WRITE_CLIENT_CACHE_MAX);
	return client;
}
function getSlackListenerWriteClient(params) {
	const token = params.listenerClient.token?.trim();
	const teamId = params.teamId?.trim().toUpperCase();
	if (!token) return;
	const cached = slackListenerWriteClientCache.get(params.listenerClient);
	if (cached) {
		if (cached.teamId !== teamId) return;
		return cached.client;
	}
	const headers = Object.fromEntries(Object.entries(params.clientOptions?.headers ?? {}).filter(([name]) => name.toLowerCase() !== "authorization"));
	const client = new WebClient(token, resolveSlackWriteClientOptions({
		...params.clientOptions,
		headers,
		slackApiUrl: params.listenerClient.slackApiUrl,
		teamId,
		retryConfig: SLACK_WRITE_RETRY_OPTIONS,
		timeout: 0
	}));
	slackListenerWriteClientCache.set(params.listenerClient, {
		teamId,
		client
	});
	return client;
}
// extensions/slack/src/cursor-pages.ts
const SLACK_CURSOR_PAGE_LIMIT = 1e4;
const fetchSlackChannelListPage = (client, cursor) => client.conversations.list({
	types: "public_channel,private_channel",
	exclude_archived: false,
	limit: 1e3,
	cursor
});
async function collectSlackCursorPages(params) {
	const items = [];
	let cursor;
	const seenCursors = /* @__PURE__ */ new Set();
	for (let pageCount = 1; pageCount <= SLACK_CURSOR_PAGE_LIMIT; pageCount += 1) {
		const response = await params.fetchPage(cursor);
		items.push(...params.collectPageItems(response));
		const nextCursor = response.response_metadata?.next_cursor?.trim() || void 0;
		if (!nextCursor) return items;
		if (seenCursors.has(nextCursor)) throw new Error(`Slack cursor pagination repeated a cursor after ${pageCount} pages`);
		seenCursors.add(nextCursor);
		cursor = nextCursor;
	}
	throw new Error(`Slack cursor pagination exceeded ${SLACK_CURSOR_PAGE_LIMIT} pages`);
}
export { createSlackProbeDispatcher as _, createSlackStartupAuthClient as a, resolveSlackWebClientOptions as b, createSlackWriteClient as c, getOrCreateWeakOwnerMap as d, pruneExpiredMapEntries as f, SLACK_WRITE_RETRY_OPTIONS as g, SLACK_DEFAULT_RETRY_OPTIONS as h, createSlackReadClient as i, getSlackListenerWriteClient as l, writeLruMapEntry as m, fetchSlackChannelListPage as n, createSlackTokenCacheKey as o, readLruMapEntry as p, createSlackLookupClient as r, createSlackWebClient as s, collectSlackCursorPages as t, getSlackWriteClient as u, resolveSlackLookupClientOptions as v, resolveSlackWriteClientOptions as x, resolveSlackMonitorDispatchers as y };
