import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { d as formatSlackBotTokenIdentityWarning } from "./accounts-BBHvg0pY.mjs";
import { a as parseSlackTarget } from "./target-parsing-DEsPjngB.mjs";
import { isRecord, normalizeOptionalLowercaseString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { sleepWithAbort } from "openclaw/plugin-sdk/runtime-env";
import { runChannelProbe } from "openclaw/plugin-sdk/text-utility-runtime";
import { compileAllowlist, resolveCompiledAllowlistMatch } from "openclaw/plugin-sdk/allow-from";
import { normalizeHyphenSlug, normalizeStringEntries as normalizeStringEntries$1, normalizeStringEntriesLower } from "openclaw/plugin-sdk/string-normalization-runtime";
import { hash } from "node:crypto";
import { WebAPIRateLimitedError, WebClient } from "@slack/web-api";
import { captureChannelReadAuthority, createHttp1EnvHttpProxyAgent, resolveEnvHttpProxyAgentOptions, resolveFetch } from "openclaw/plugin-sdk/fetch-runtime";
import { isDebugProxyGlobalFetchPatchInstalled } from "openclaw/plugin-sdk/proxy-capture";
import { parseRetryAfterHeaderSeconds, retryAsync } from "openclaw/plugin-sdk/retry-runtime";
import { fetchWithRuntimeDispatcher } from "openclaw/plugin-sdk/runtime-fetch";
import { redactSensitiveText } from "openclaw/plugin-sdk/logging-core";
import { defineStableChannelIngressIdentity } from "openclaw/plugin-sdk/channel-ingress-runtime";
//#region extensions/slack/src/monitor/allow-list.ts
const SLACK_SLUG_CACHE_MAX = 512;
const SLACK_STABLE_USER_ID_RE = /^[ubw][a-z0-9]+$/;
const slackSlugCache = /* @__PURE__ */ new Map();
function normalizeSlackSlug(raw) {
	const key = raw ?? "";
	const cached = slackSlugCache.get(key);
	if (cached !== void 0) return cached;
	const normalized = normalizeHyphenSlug(raw);
	slackSlugCache.set(key, normalized);
	if (slackSlugCache.size > SLACK_SLUG_CACHE_MAX) {
		const oldest = slackSlugCache.keys().next();
		if (!oldest.done) slackSlugCache.delete(oldest.value);
	}
	return normalized;
}
function normalizeAllowList(list) {
	return normalizeStringEntries$1(list);
}
function normalizeAllowListLower(list) {
	return normalizeStringEntriesLower(list);
}
function normalizeSlackAllowOwnerEntry(entry) {
	const trimmed = normalizeOptionalLowercaseString(entry);
	if (!trimmed || trimmed === "*") return;
	try {
		const target = parseSlackTarget(trimmed);
		if (target?.kind === "user" && target.teamId) return target.id.toLowerCase();
	} catch {
		return;
	}
	const withoutPrefix = trimmed.replace(/^(slack:|user:)/, "");
	return SLACK_STABLE_USER_ID_RE.test(withoutPrefix) ? withoutPrefix : void 0;
}
function resolveSlackAllowListMatch(params) {
	const compiledAllowList = compileAllowlist(params.allowList);
	const teamId = normalizeOptionalLowercaseString(params.teamId);
	const id = normalizeOptionalLowercaseString(params.id);
	const name = normalizeOptionalLowercaseString(params.name);
	const slug = normalizeSlackSlug(name);
	const scopedCandidates = [{
		value: teamId && id ? `team:${teamId}:user:${id}` : void 0,
		source: "workspace-id"
	}];
	const unscopedCandidates = [
		{
			value: id,
			source: "id"
		},
		{
			value: id ? `slack:${id}` : void 0,
			source: "prefixed-id"
		},
		{
			value: id ? `user:${id}` : void 0,
			source: "prefixed-user"
		},
		...params.allowNameMatching === true ? [
			{
				value: name,
				source: "name"
			},
			{
				value: name ? `slack:${name}` : void 0,
				source: "prefixed-name"
			},
			{
				value: slug,
				source: "slug"
			}
		] : []
	];
	return resolveCompiledAllowlistMatch({
		compiledAllowlist: compiledAllowList,
		candidates: [...scopedCandidates, ...unscopedCandidates]
	});
}
function allowListMatches(params) {
	return resolveSlackAllowListMatch(params).allowed;
}
function resolveSlackUserAllowed(params) {
	const allowList = normalizeAllowListLower(params.allowList);
	if (allowList.length === 0) return true;
	return allowListMatches({
		allowList,
		teamId: params.teamId,
		id: params.userId,
		name: params.userName,
		allowNameMatching: params.allowNameMatching
	});
}
function resolveSlackUserAllowListForTeam(params) {
	const allowList = normalizeAllowListLower(params.allowList);
	const teamId = normalizeOptionalLowercaseString(params.teamId);
	return allowList.flatMap((entry) => {
		if (entry === "*") return [entry];
		if (!entry.startsWith("team:")) return [entry];
		try {
			const target = parseSlackTarget(entry);
			if (target?.kind === "user" && target.teamId?.toLowerCase() === teamId) return [entry];
			return params.preserveUnmatchedScopedEntries ? [entry] : [];
		} catch {
			return params.preserveUnmatchedScopedEntries ? [entry] : [];
		}
	});
}
//#endregion
//#region extensions/slack/src/client-options.ts
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
/** Build the dispatcher shared by Slack Web API fetches and Socket Mode. */
function resolveSlackProxyDispatcher() {
	const options = resolveEnvHttpProxyAgentOptions();
	if (!options) return;
	try {
		return createHttp1EnvHttpProxyAgent(options, void 0, process.env);
	} catch {
		return;
	}
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
function fenceSlackReadFetch(slackFetch) {
	const assertReadAuthority = captureChannelReadAuthority();
	return (input, init) => {
		assertReadAuthority?.();
		captureChannelReadAuthority()?.();
		return slackFetch(input, init);
	};
}
function resolveSlackApiUrlFromEnv() {
	return process.env.SLACK_API_URL?.trim() || void 0;
}
function applySlackApiUrlAndProxyOptions(options, dispatcher) {
	const slackApiUrl = options.slackApiUrl ?? resolveSlackApiUrlFromEnv();
	const fetch = options.fetch ?? buildSlackFetch(dispatcher);
	if (fetch) options.fetch = fenceSlackReadFetch(fetch);
	if (slackApiUrl !== void 0) options.slackApiUrl = slackApiUrl;
	else delete options.slackApiUrl;
}
function applySlackRequestAuthority(options, dispatcher, assertDirectAdapterHandoff) {
	if (!assertDirectAdapterHandoff) return;
	const slackFetch = options.fetch ?? buildSlackFetch(dispatcher);
	if (!slackFetch) throw new Error("Slack request fetch is unavailable for live authority.");
	options.fetch = (input, init) => {
		assertDirectAdapterHandoff();
		return slackFetch(input, init);
	};
}
function resolveSlackWebClientOptions(options = {}, dispatcher = resolveSlackProxyDispatcher(), assertDirectAdapterHandoff) {
	const resolved = Object.assign({}, options);
	applySlackApiUrlAndProxyOptions(resolved, dispatcher);
	resolved.fetch ??= buildSlackFetch(dispatcher);
	applySlackRequestAuthority(resolved, dispatcher, assertDirectAdapterHandoff);
	resolved.retryConfig ??= SLACK_DEFAULT_RETRY_OPTIONS;
	return resolved;
}
function resolveSlackReadClientOptions(options = {}, dispatcher = resolveSlackProxyDispatcher(), assertDirectAdapterHandoff) {
	const resolved = resolveSlackWebClientOptions(options, dispatcher, assertDirectAdapterHandoff);
	resolved.timeout ??= SLACK_READ_TIMEOUT_MS;
	return resolved;
}
function resolveSlackWriteClientOptions(options = {}, dispatcher = resolveSlackProxyDispatcher(), assertDirectAdapterHandoff) {
	const resolved = Object.assign({}, options);
	applySlackApiUrlAndProxyOptions(resolved, dispatcher);
	applySlackRequestAuthority(resolved, dispatcher, assertDirectAdapterHandoff);
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
	const resolved = Object.assign({}, options);
	applySlackApiUrlAndProxyOptions(resolved, dispatcher);
	applySlackRequestAuthority(resolved, dispatcher, assertDirectAdapterHandoff);
	resolved.rejectRateLimitedCalls = true;
	resolved.retryConfig = SLACK_LOOKUP_RETRY_OPTIONS;
	resolved.timeout ??= SLACK_READ_TIMEOUT_MS;
	return resolved;
}
//#endregion
//#region extensions/slack/src/client.ts
const SLACK_WRITE_CLIENT_CACHE_MAX = 32;
const SLACK_STARTUP_AUTH_TIMEOUT_MS = 1e4;
const SLACK_STARTUP_AUTH_RETRY_BUDGET_MS = 35e3;
const slackWriteClientCache = /* @__PURE__ */ new Map();
const slackListenerWriteClientCache = /* @__PURE__ */ new WeakMap();
function createSlackWebClient(token, options = {}, assertDirectAdapterHandoff) {
	return new WebClient(token, resolveSlackWebClientOptions(options, void 0, assertDirectAdapterHandoff));
}
function createSlackReadClient(token, options = {}, dispatcher, assertDirectAdapterHandoff) {
	return new WebClient(token, resolveSlackReadClientOptions(options, dispatcher, assertDirectAdapterHandoff));
}
function createSlackStartupAuthFetch(baseFetch) {
	const deadline = Date.now() + SLACK_STARTUP_AUTH_RETRY_BUDGET_MS;
	return async (input, init) => {
		const response = await baseFetch(input, init);
		if (response.status !== 429) return response;
		const retryAfter = Number.parseInt(response.headers.get("retry-after") ?? "", 10);
		const remainingMs = Math.max(0, deadline - Date.now());
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
function createSlackLookupClient(token, options = {}, assertDirectAdapterHandoff) {
	return new WebClient(token, resolveSlackLookupClientOptions(options, void 0, assertDirectAdapterHandoff));
}
function createSlackWriteClient(token, options = {}, assertDirectAdapterHandoff) {
	return new WebClient(token, resolveSlackWriteClientOptions(options, void 0, assertDirectAdapterHandoff));
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
	const cached = slackWriteClientCache.get(tokenKey);
	if (cached) {
		slackWriteClientCache.delete(tokenKey);
		slackWriteClientCache.set(tokenKey, cached);
		return cached;
	}
	const client = new WebClient(token, resolvedOptions);
	if (slackWriteClientCache.size >= SLACK_WRITE_CLIENT_CACHE_MAX) {
		const oldestTokenKey = slackWriteClientCache.keys().next().value;
		if (oldestTokenKey) slackWriteClientCache.delete(oldestTokenKey);
	}
	slackWriteClientCache.set(tokenKey, client);
	return client;
}
function getSlackListenerWriteClient(params) {
	const token = params.listenerClient.token?.trim();
	const teamId = params.teamId?.trim().toUpperCase();
	if (!token) return;
	const cached = slackListenerWriteClientCache.get(params.listenerClient);
	if (cached) return cached.teamId === teamId ? cached.client : void 0;
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
//#endregion
//#region extensions/slack/src/cursor-pages.ts
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
//#endregion
//#region extensions/slack/src/errors.ts
const NO_ERROR_DETAIL = "no error detail";
const MAX_ERROR_CAUSE_DEPTH = 32;
function redact(value) {
	return redactSensitiveText(value);
}
function addStringDetail(details, label, value) {
	if (typeof value !== "string") return;
	const trimmed = redact(value.trim());
	if (trimmed) details.push(label ? `${label}: ${trimmed}` : trimmed);
}
function addScalarDetail(details, label, value) {
	if (typeof value === "string") {
		addStringDetail(details, label, value);
		return;
	}
	if (typeof value === "number" || typeof value === "boolean") details.push(`${label}: ${String(value)}`);
}
function addStringListDetail(details, label, value) {
	if (!Array.isArray(value)) return;
	const entries = value.flatMap((entry) => {
		if (typeof entry !== "string") return [];
		const trimmed = redact(entry.trim());
		return trimmed ? [trimmed] : [];
	});
	if (entries.length) details.push(`${label}: ${entries.join(", ")}`);
}
function safeStringify(value) {
	const seen = /* @__PURE__ */ new WeakSet();
	try {
		const result = JSON.stringify(value, (_key, nested) => {
			if (typeof nested !== "object" || nested === null) return nested;
			if (seen.has(nested)) return "[Circular]";
			seen.add(nested);
			return nested;
		});
		return result ? redact(result) : void 0;
	} catch {
		return;
	}
}
function addSlackResponseMetadata(details, value) {
	if (!isRecord(value)) return;
	addStringListDetail(details, "scopes", value.scopes);
	addStringListDetail(details, "accepted", value.acceptedScopes);
	const messages = value.messages;
	if (Array.isArray(messages)) for (const message of messages) addStringDetail(details, "slack message", message);
	const warnings = value.warnings;
	if (Array.isArray(warnings)) for (const warning of warnings) addStringDetail(details, "slack warning", warning);
}
function addSlackDataDetails(details, value) {
	if (!isRecord(value)) return;
	addScalarDetail(details, "slack error", value.error);
	addScalarDetail(details, "needed", value.needed);
	addScalarDetail(details, "provided", value.provided);
	addSlackResponseMetadata(details, value.response_metadata);
}
function addRecordDetails(details, value) {
	addScalarDetail(details, "code", value.code);
	addScalarDetail(details, "status", value.status);
	addScalarDetail(details, "statusCode", value.statusCode);
	addScalarDetail(details, "statusMessage", value.statusMessage);
	addScalarDetail(details, "retryAfter", value.retryAfter);
	addScalarDetail(details, "errno", value.errno);
	addScalarDetail(details, "syscall", value.syscall);
	addScalarDetail(details, "hostname", value.hostname);
	addScalarDetail(details, "type", value.type);
	addStringDetail(details, "statusText", value.statusText);
	addStringDetail(details, "body", value.body);
	addSlackDataDetails(details, value.data);
	if (isRecord(value.response)) {
		addScalarDetail(details, "response status", value.response.status);
		addStringDetail(details, "response statusText", value.response.statusText);
		addSlackDataDetails(details, value.response.data);
	}
}
function collectSlackErrorDetails(error, seen) {
	const details = [];
	if (error === void 0 || error === null) return details;
	if (typeof error === "string") {
		addStringDetail(details, "", error);
		return details;
	}
	if (error instanceof Error) {
		addStringDetail(details, "", error.message || error.name);
		if (error.cause !== void 0) {
			const cause = formatSlackErrorWithCauses(error.cause, "", seen);
			if (cause) details.push(`cause: ${cause}`);
		}
	}
	if (isRecord(error)) {
		addRecordDetails(details, error);
		const fallback = safeStringify(error);
		if (details.length === 0 && fallback && fallback !== "{}") details.push(fallback);
	}
	return details;
}
function formatSlackErrorWithCauses(error, fallback, seen) {
	if (error instanceof Error) {
		if (seen.has(error)) return "[Circular]";
		if (seen.size >= MAX_ERROR_CAUSE_DEPTH) return "[Cause chain truncated]";
		seen.add(error);
	}
	const details = collectSlackErrorDetails(error, seen);
	if (details.length > 0) return details.join("; ");
	if (error === void 0 || error === null) return fallback;
	if (typeof error === "string" && !error.trim()) return fallback;
	return safeStringify(error) ?? fallback;
}
function formatSlackError(error, fallback = NO_ERROR_DETAIL) {
	return formatSlackErrorWithCauses(error, fallback, /* @__PURE__ */ new Set());
}
//#endregion
//#region extensions/slack/src/monitor/ingress-identity.ts
const SLACK_USER_NAME_KIND = "plugin:slack-user-name";
const SLACK_WORKSPACE_USER_ID_KIND = "plugin:slack-workspace-user-id";
function normalizeSlackUserId(raw) {
	const value = (raw ?? "").trim().toLowerCase();
	if (!value) return "";
	const mention = value.match(/^<@([a-z0-9_]+)>$/i);
	if (mention?.[1]) return mention[1];
	return value.replace(/^(slack:|user:)/, "");
}
function isSlackStableUserId(value) {
	return /^[ubw][a-z0-9_]+$/i.test(value);
}
function normalizeSlackWorkspaceUserEntry(entry) {
	const normalized = entry.trim().toLowerCase();
	if (!normalized) return null;
	try {
		const target = parseSlackTarget(normalized);
		if (target?.kind === "user" && target.teamId) return target.normalized;
	} catch {
		return null;
	}
	return null;
}
function normalizeSlackBareUserEntry(entry) {
	const normalized = entry.trim().toLowerCase();
	if (!normalized || normalizeSlackWorkspaceUserEntry(normalized)) return null;
	const userId = normalizeSlackUserId(normalized);
	return isSlackStableUserId(userId) ? userId : null;
}
function normalizeSlackStableEntry(entry) {
	return normalizeSlackBareUserEntry(entry) ?? normalizeSlackWorkspaceUserEntry(entry);
}
function normalizeSlackNameEntry(entry) {
	const normalized = entry.trim().toLowerCase();
	if (!normalized || normalizeSlackStableEntry(normalized)) return null;
	return normalized.replace(/^slack:/, "") || null;
}
function normalizeSlackNameSubject(value) {
	return value.trim().toLowerCase() || null;
}
function normalizeSlackNameSlugEntry(entry) {
	const name = normalizeSlackNameEntry(entry);
	if (!name) return null;
	return normalizeSlackSlug(name) || null;
}
const slackIngressIdentity = defineStableChannelIngressIdentity({
	resolveParticipant: (subject) => {
		const qualified = subject.aliases?.workspaceSenderId;
		if (typeof qualified !== "string") return;
		const normalized = normalizeSlackWorkspaceUserEntry(qualified);
		const target = normalized ? parseSlackTarget(normalized) : void 0;
		return target?.teamId ? {
			domain: target.teamId,
			idKind: target.id.startsWith("b") ? "bot-id" : "user-id",
			id: target.id
		} : void 0;
	},
	key: "senderId",
	kind: "stable-id",
	authentication: "asserted",
	normalizeEntry: normalizeSlackBareUserEntry,
	normalizeSubject: normalizeSlackUserId,
	sensitivity: "pii",
	aliases: [{
		key: "workspaceSenderId",
		kind: SLACK_WORKSPACE_USER_ID_KIND,
		authentication: "asserted",
		normalizeEntry: normalizeSlackWorkspaceUserEntry,
		normalizeSubject: normalizeSlackWorkspaceUserEntry,
		sensitivity: "pii"
	}, ...[["senderName", normalizeSlackNameEntry], ["senderNameSlug", normalizeSlackNameSlugEntry]].map(([key, normalizeEntry]) => ({
		key,
		kind: SLACK_USER_NAME_KIND,
		normalizeEntry,
		normalizeSubject: normalizeSlackNameSubject,
		authentication: "mutable",
		sensitivity: "pii"
	}))]
});
function createSlackIngressSubject(params) {
	const senderId = normalizeSlackUserId(params.senderId);
	const teamId = normalizeOptionalLowercaseString(params.teamId);
	const senderName = params.senderName?.trim().toLowerCase();
	const senderNameSlug = senderName ? normalizeSlackSlug(senderName) : void 0;
	return {
		stableId: senderId,
		aliases: {
			workspaceSenderId: teamId && senderId ? `team:${teamId}:user:${senderId}` : void 0,
			senderName,
			senderNameSlug
		}
	};
}
//#endregion
//#region extensions/slack/src/probe.ts
var probe_exports = /* @__PURE__ */ __exportAll({ probeSlack: () => probeSlack });
async function probeSlack(token, timeoutMs = 2500, opts) {
	const dispatcher = createSlackProbeDispatcher(timeoutMs);
	const client = createSlackReadClient(token, {
		rejectRateLimitedCalls: true,
		retryConfig: { retries: 0 },
		timeout: timeoutMs
	}, dispatcher);
	const probeResult = runChannelProbe(timeoutMs, async () => {
		const result = await client.auth.test();
		if (!result.ok) return {
			ok: false,
			status: 200,
			error: result.error ?? "unknown"
		};
		if (opts?.identity === "user") {
			if (result.bot_id?.trim()) return {
				ok: false,
				status: 200,
				error: "Slack auth.test identified a bot token; user identity requires a user OAuth token"
			};
			const userId = result.user_id?.trim();
			if (!userId) return {
				ok: false,
				status: 200,
				error: "Slack auth.test returned no human user_id for user identity"
			};
			return {
				ok: true,
				status: 200,
				user: {
					id: userId,
					name: result.user
				},
				team: {
					id: result.team_id,
					name: result.team
				}
			};
		}
		const warning = formatSlackBotTokenIdentityWarning({
			auth: result,
			accountId: opts?.accountId
		});
		return {
			ok: true,
			status: 200,
			bot: {
				id: result.user_id,
				name: result.user
			},
			team: {
				id: result.team_id,
				name: result.team
			},
			...warning ? { warning } : {}
		};
	}, (error) => ({
		ok: false,
		status: typeof error.statusCode === "number" ? error.statusCode : null,
		error: formatSlackError(error)
	}));
	try {
		return await probeResult;
	} finally {
		await dispatcher.destroy().catch(() => void 0);
	}
}
//#endregion
export { resolveSlackUserAllowed as A, allowListMatches as C, normalizeSlackSlug as D, normalizeSlackAllowOwnerEntry as E, resolveSlackAllowListMatch as O, resolveSlackWriteClientOptions as S, normalizeAllowListLower as T, SLACK_DEFAULT_RETRY_OPTIONS as _, slackIngressIdentity as a, resolveSlackProxyDispatcher as b, fetchSlackChannelListPage as c, createSlackStartupAuthClient as d, createSlackTokenCacheKey as f, getSlackWriteClient as g, getSlackListenerWriteClient as h, createSlackIngressSubject as i, resolveSlackUserAllowListForTeam as k, createSlackLookupClient as l, createSlackWriteClient as m, probe_exports as n, formatSlackError as o, createSlackWebClient as p, SLACK_USER_NAME_KIND as r, collectSlackCursorPages as s, probeSlack as t, createSlackReadClient as u, SLACK_WRITE_RETRY_OPTIONS as v, normalizeAllowList as w, resolveSlackWebClientOptions as x, resolveSlackLookupClientOptions as y };
