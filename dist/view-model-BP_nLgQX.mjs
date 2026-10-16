import { m as readNonBlankString } from "./string-coerce-1VuiLaaR.mjs";
import { C as parseStrictNonNegativeInteger, s as asFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { i as readResponseWithLimit } from "./http-response-body-umfRGZ-E.mjs";
import { t as parseRetryAfterHeaderSeconds } from "./retry-after-D_Ri68m5.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./response-limit-runtime-CpfmMF5T.mjs";
import "./retry-runtime-CZf8_bHp.mjs";
import { r as githubTargetUrl } from "./targets-RjAEePy1.mjs";
import { createHash } from "node:crypto";
//#region extensions/github/src/github-api.ts
const DEFAULT_GITHUB_API_BASE_URL = "https://api.github.com";
const GITHUB_API_ORIGIN = DEFAULT_GITHUB_API_BASE_URL;
function resolveGitHubApiBaseUrl(value) {
	const raw = value?.trim() || DEFAULT_GITHUB_API_BASE_URL;
	const parsed = new URL(raw);
	if (parsed.protocol !== "https:" || parsed.username || parsed.password || parsed.search || parsed.hash || ![
		"/",
		"",
		"/api/v3",
		"/api/v3/"
	].includes(parsed.pathname)) throw new Error("gateway.github.apiBaseUrl must be an HTTPS GitHub API base URL");
	return parsed.origin + (parsed.pathname.startsWith("/api/v3") ? "/api/v3" : "");
}
const GITHUB_API_BASE_URL = DEFAULT_GITHUB_API_BASE_URL;
function githubGraphqlUrl(baseUrl) {
	return baseUrl.endsWith("/api/v3") ? `${baseUrl.slice(0, -3)}/graphql` : `${baseUrl}/graphql`;
}
const GITHUB_GRAPHQL_URL = githubGraphqlUrl(GITHUB_API_BASE_URL);
function resolveGitHubApiUrls(apiBaseUrl) {
	const baseUrl = resolveGitHubApiBaseUrl(apiBaseUrl);
	return {
		baseUrl,
		graphqlUrl: githubGraphqlUrl(baseUrl)
	};
}
function githubRestApiPath(url, apiBaseUrl = GITHUB_API_BASE_URL) {
	const basePath = new URL(apiBaseUrl).pathname;
	return url.pathname.slice(basePath === "/" ? 0 : basePath.length);
}
const GITHUB_JSON_MAX_BYTES = 262144;
const GITHUB_REQUEST_TIMEOUT_MS = 8e3;
const GITHUB_API_VERSION = "2022-11-28";
const GITHUB_API_MAX_REDIRECTS = 3;
const GITHUB_QUOTA_CACHE_LIMIT = 200;
const GITHUB_QUOTA_RETRY_MS = 6e4;
const transportCooldowns = /* @__PURE__ */ new WeakMap();
const responseCredentialScopes = /* @__PURE__ */ new WeakMap();
var ControlUiGitHubError = class extends Error {
	constructor(statusCode, message, options = {}) {
		super(message);
		this.statusCode = statusCode;
		this.name = "ControlUiGitHubError";
		this.upstreamStatus = options.upstreamStatus ?? statusCode;
		this.retryAtMs = options.retryAtMs;
		this.retryable = options.retryable ?? (statusCode === 429 || options.upstreamStatus !== void 0 && options.upstreamStatus >= 500);
	}
	get retryAfterMs() {
		return this.retryAtMs === void 0 ? void 0 : Math.max(0, this.retryAtMs - Date.now());
	}
};
var ControlUiGitHubTransportError = class extends ControlUiGitHubError {
	constructor(message) {
		super(502, message, { retryable: true });
	}
};
var GitHubGraphQLUnavailableError = class extends ControlUiGitHubError {
	constructor(upstreamStatus) {
		super(403, "GitHub GraphQL access is unavailable for the selected credential", {
			upstreamStatus,
			retryable: false
		});
	}
};
function formatControlUiGitHubPreviewError(error) {
	if (error instanceof ControlUiGitHubTransportError) return {
		message: `${error.message}. Retry or check GitHub availability.`,
		retryable: true
	};
	if (error instanceof ControlUiGitHubError) {
		const status = `HTTP ${error.upstreamStatus}`;
		switch (error.statusCode) {
			case 401: return {
				message: `GitHub authentication failed (${status}). Reconnect the GitHub identity in Settings.`,
				retryable: false
			};
			case 403: return {
				message: `GitHub access denied (${status}). Check the configured GitHub identity's repository access.`,
				retryable: false
			};
			case 404: return {
				message: "GitHub item is unavailable or not public (HTTP 404). Open the link on GitHub to check access.",
				retryable: false
			};
			case 429: {
				const retryAfterMs = error.retryAfterMs;
				return {
					message: `GitHub API rate limit exceeded (${status}). ${retryAfterMs === void 0 ? "Wait" : `Wait ${Math.ceil(retryAfterMs / 1e3)} seconds`} and retry.`,
					retryable: true,
					...retryAfterMs === void 0 ? {} : { retryAfterMs }
				};
			}
			case 502: return {
				message: `${error.message.slice(0, 256)}. Retry or check GitHub availability.`,
				retryable: true
			};
		}
	}
	if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) return {
		message: "GitHub request timed out. Retry shortly.",
		retryable: true
	};
	return {
		message: "GitHub preview could not be loaded. Retry or check the server logs.",
		retryable: false
	};
}
function githubApiCredentialCacheScope(token) {
	return token ? createHash("sha256").update(token).digest("hex") : "anonymous";
}
function requiredString(record, key) {
	const value = readNonBlankString(record[key]);
	if (value === void 0) throw new ControlUiGitHubError(502, `GitHub response omitted ${key}`);
	return value;
}
function readOptionalGitHubString(record, key) {
	return readNonBlankString(record[key]);
}
function optionalNumber(record, key) {
	return asFiniteNumber(record[key]);
}
function githubApiResource(url, apiBaseUrl, graphqlUrl) {
	const path = githubRestApiPath(url, apiBaseUrl);
	return url.href === graphqlUrl ? "graphql" : path === "/search/code" ? "code_search" : path.startsWith("/search/") ? "search" : "core";
}
function retainGitHubCooldown(fetchImpl, credentialScope, resource, response, error) {
	const cooldowns = transportCooldowns.get(fetchImpl) ?? /* @__PURE__ */ new Map();
	transportCooldowns.set(fetchImpl, cooldowns);
	const key = `${credentialScope}:${response.headers.get("x-ratelimit-remaining") === "0" ? response.headers.get("x-ratelimit-resource") ?? resource : "*"}`;
	const previous = activeGitHubCooldown(cooldowns, key);
	const retained = previous && (previous.retryAfterMs ?? 0) > (error.retryAfterMs ?? 0) ? previous : error;
	cooldowns.set(key, retained);
	pruneMapToMaxSize(cooldowns, GITHUB_QUOTA_CACHE_LIMIT);
	return retained;
}
function activeGitHubCooldown(cooldowns, key) {
	const error = cooldowns.get(key);
	if (error && (error.retryAfterMs ?? 0) <= 0) {
		cooldowns.delete(key);
		return;
	}
	return error;
}
function githubApiHeaders(token) {
	const headers = {
		Accept: "application/vnd.github+json",
		"User-Agent": "OpenClaw-Control-UI",
		"X-GitHub-Api-Version": GITHUB_API_VERSION
	};
	if (token) headers.Authorization = `Bearer ${token}`;
	return headers;
}
function isGitHubApiRedirect(status) {
	return status === 301 || status === 302 || status === 303 || status === 307 || status === 308;
}
function safeGitHubApiUrl(raw, apiBase, graphqlUrl, base) {
	const url = URL.parse(raw, base);
	if (!url || url.origin !== apiBase.origin || url.username || url.password || url.href !== graphqlUrl && !url.pathname.startsWith(`${apiBase.pathname === "/" ? "" : apiBase.pathname}/`)) return null;
	return url;
}
async function fetchGitHubApi(rawUrl, fetchImpl, token, beforeRedirect, identity, etag, callerSignal, graphql, apiBaseUrl = GITHUB_API_BASE_URL) {
	callerSignal?.throwIfAborted();
	const baseUrl = resolveGitHubApiBaseUrl(apiBaseUrl);
	const apiBase = new URL(baseUrl);
	const graphqlUrl = githubGraphqlUrl(baseUrl);
	const initialUrl = safeGitHubApiUrl(rawUrl, apiBase, graphqlUrl);
	if (!initialUrl) throw new ControlUiGitHubError(502, "Invalid GitHub API URL");
	if (graphql && (initialUrl.href !== graphqlUrl || !token || etag)) throw new ControlUiGitHubError(502, "Invalid authenticated GitHub GraphQL request");
	let url = initialUrl;
	const credentialScope = `${baseUrl}:${githubApiCredentialCacheScope(token)}`;
	const cooldowns = transportCooldowns.get(fetchImpl) ?? /* @__PURE__ */ new Map();
	transportCooldowns.set(fetchImpl, cooldowns);
	const timeout = AbortSignal.timeout(GITHUB_REQUEST_TIMEOUT_MS);
	const signal = callerSignal ? AbortSignal.any([timeout, callerSignal]) : timeout;
	for (let redirects = 0;; redirects += 1) {
		if (identity) {
			await identity.revalidate();
			identity.assertSelected();
		}
		callerSignal?.throwIfAborted();
		const resource = githubApiResource(url, baseUrl, graphqlUrl);
		const sharedCooldown = activeGitHubCooldown(cooldowns, `${credentialScope}:*`);
		const resourceCooldown = activeGitHubCooldown(cooldowns, `${credentialScope}:${resource}`);
		const cooldown = (sharedCooldown?.retryAfterMs ?? 0) > (resourceCooldown?.retryAfterMs ?? 0) ? sharedCooldown : resourceCooldown;
		if (cooldown) throw cooldown;
		let response;
		try {
			response = await fetchImpl(url.href, {
				headers: {
					...githubApiHeaders(token),
					...etag ? { "If-None-Match": etag } : {},
					...graphql ? { "Content-Type": "application/json" } : {}
				},
				...graphql ? {
					method: "POST",
					body: JSON.stringify(graphql)
				} : {},
				redirect: "manual",
				signal
			});
		} catch (error) {
			throw new ControlUiGitHubTransportError(signal.aborted || error instanceof Error && error.name === "TimeoutError" ? "GitHub request timed out" : "Could not reach GitHub");
		}
		if (isGitHubRateLimitResponse(response)) {
			const retained = retainGitHubCooldown(fetchImpl, credentialScope, resource, response, githubResponseError(response));
			await discardResponse(response);
			throw retained;
		}
		if (!isGitHubApiRedirect(response.status)) {
			responseCredentialScopes.set(response, credentialScope);
			return response;
		}
		const location = response.headers.get("location");
		const nextUrl = location ? safeGitHubApiUrl(location, apiBase, graphqlUrl, url) : null;
		if (!nextUrl || redirects >= GITHUB_API_MAX_REDIRECTS) {
			await discardResponse(response);
			throw new ControlUiGitHubError(502, "GitHub API returned an unsafe redirect");
		}
		await discardResponse(response);
		await beforeRedirect?.(nextUrl);
		if (graphql) throw new ControlUiGitHubError(502, "GitHub GraphQL returned an unexpected redirect");
		url = nextUrl;
	}
}
async function discardResponse(response) {
	await response.body?.cancel().catch(() => {});
}
async function readBoundedResponse(response, maxBytes) {
	try {
		return await readResponseWithLimit(response, maxBytes, { onOverflow: () => new ControlUiGitHubError(502, "GitHub response exceeded the size limit") });
	} finally {
		await discardResponse(response);
	}
}
function isGitHubRateLimitResponse(response) {
	if (response.status === 429) return true;
	return response.status === 403 && (response.headers.get("x-ratelimit-remaining") === "0" || response.headers.has("retry-after"));
}
function githubResponseErrorStatus(response) {
	if (isGitHubRateLimitResponse(response)) return 429;
	if (response.status === 401 || response.status === 403 || response.status === 404) return response.status;
	return 502;
}
function githubResponseError(response, graphqlRateLimited = false) {
	const status = graphqlRateLimited ? 429 : githubResponseErrorStatus(response);
	let retryAtMs;
	if (status === 429) {
		const now = Date.now();
		const retrySeconds = parseRetryAfterHeaderSeconds(response.headers.get("retry-after"));
		const reset = response.headers.get("x-ratelimit-remaining") === "0" ? parseStrictNonNegativeInteger(response.headers.get("x-ratelimit-reset")) : void 0;
		const proposed = retrySeconds !== void 0 ? now + retrySeconds * 1e3 : reset !== void 0 && reset <= Number.MAX_SAFE_INTEGER / 1e3 ? reset * 1e3 : void 0;
		retryAtMs = proposed !== void 0 && Number.isSafeInteger(proposed) && proposed > now ? proposed : now + GITHUB_QUOTA_RETRY_MS;
	}
	return new ControlUiGitHubError(status, `GitHub request failed (HTTP ${response.status})`, {
		upstreamStatus: response.status,
		retryAtMs
	});
}
/** GraphQL can report failed queries and exhausted quota in an HTTP 200 response. */
async function readGitHubGraphQLResponse(response, fetchImpl, token, maxBytes) {
	const credentialScope = responseCredentialScopes.get(response) ?? `${DEFAULT_GITHUB_API_BASE_URL}:${githubApiCredentialCacheScope(token)}`;
	const value = response.status === 403 && !isGitHubRateLimitResponse(response) ? await readGitHubJsonBody(response, maxBytes) : await readGitHubJsonResponse(response, maxBytes);
	const noData = isRecord(value) && (value.data === void 0 || value.data === null || isRecord(value.data) && Object.values(value.data).every((field) => field === null));
	if (isRecord(value) && value.errors !== void 0) {
		if (Array.isArray(value.errors) && value.errors.some((error) => isRecord(error) && error.type === "RATE_LIMITED")) throw retainGitHubCooldown(fetchImpl, credentialScope, "graphql", response, githubResponseError(response, true));
		if (Array.isArray(value.errors) && value.errors.length > 0 && value.errors.every((error) => isRecord(error) && (error.type === "FORBIDDEN" || error.type === "INSUFFICIENT_SCOPES")) && noData) throw new GitHubGraphQLUnavailableError(response.status);
		if (!Array.isArray(value.errors) || value.errors.length > 0) throw new ControlUiGitHubError(502, "GitHub GraphQL request failed; check repository access", { retryable: false });
	}
	if (!response.ok) {
		if (response.status === 403 && noData && isRecord(value) && value.errors === void 0 && (value.message === "Resource not accessible by integration" || value.message === "Resource not accessible by personal access token")) throw new GitHubGraphQLUnavailableError(response.status);
		throw githubResponseError(response);
	}
	return value;
}
async function withOptionalGitHubAuth(token, request) {
	try {
		return await request(token);
	} catch (error) {
		const status = error instanceof ControlUiGitHubError ? error.statusCode : 0;
		if (token && [
			401,
			403,
			429
		].includes(status)) try {
			return await request(void 0);
		} catch (anonymousError) {
			if (error instanceof ControlUiGitHubError && error.statusCode === 429 && anonymousError instanceof ControlUiGitHubError && anonymousError.statusCode === 429 && (error.retryAfterMs ?? Infinity) < (anonymousError.retryAfterMs ?? Infinity)) throw error;
			throw anonymousError;
		}
		throw error;
	}
}
async function readGitHubJsonResponse(response, maxBytes = GITHUB_JSON_MAX_BYTES) {
	if (!response.ok) {
		await discardResponse(response);
		throw githubResponseError(response);
	}
	return readGitHubJsonBody(response, maxBytes);
}
async function readGitHubJsonBody(response, maxBytes = GITHUB_JSON_MAX_BYTES) {
	let body;
	try {
		body = await readBoundedResponse(response, maxBytes);
	} catch (error) {
		if (error instanceof ControlUiGitHubError) throw error;
		throw new ControlUiGitHubError(502, "GitHub response could not be read");
	}
	try {
		return JSON.parse(body.toString("utf8"));
	} catch {
		throw new ControlUiGitHubError(502, "GitHub response was not valid JSON");
	}
}
/** Fetch a GitHub API JSON document with bounded size and normalized errors. */
function fetchGitHubJson(rawUrl, fetchImpl, token, maxBytes, apiBaseUrl = GITHUB_API_BASE_URL) {
	return withOptionalGitHubAuth(token, async (requestToken) => readGitHubJsonResponse(await fetchGitHubApi(rawUrl, fetchImpl, requestToken, void 0, void 0, void 0, void 0, void 0, apiBaseUrl), maxBytes));
}
//#endregion
//#region extensions/github/src/view-model.ts
function githubChangeMetadata(additions, deletions, files, comments) {
	const metadata = [];
	if (additions !== void 0) metadata.push({
		label: "Additions",
		value: "+" + additions,
		tone: "positive"
	});
	if (deletions !== void 0) metadata.push({
		label: "Deletions",
		value: "−" + deletions,
		tone: "negative"
	});
	if (files !== void 0) metadata.push({
		label: "Files",
		value: String(files)
	});
	if (comments !== void 0) metadata.push({
		label: "Comments",
		value: String(comments)
	});
	return metadata;
}
function githubPreviewView(preview) {
	const badge = preview.mergedAt ? {
		label: "Merged",
		tone: "accent"
	} : preview.draft && preview.state === "open" ? {
		label: "Draft",
		tone: "neutral"
	} : preview.state === "open" ? {
		label: "Open",
		tone: "positive"
	} : preview.kind === "issue" && preview.stateReason !== "not_planned" ? {
		label: "Closed",
		tone: "accent"
	} : {
		label: "Closed",
		tone: "negative"
	};
	return {
		url: githubTargetUrl(preview),
		title: preview.title,
		subtitle: preview.owner + "/" + preview.repo + " #" + preview.number,
		badge: {
			...badge,
			timestamp: preview.mergedAt ?? (preview.state === "closed" ? preview.closedAt : void 0)
		},
		author: preview.login,
		authorUrl: "https://github.com/" + encodeURIComponent(preview.login),
		coAuthors: preview.coAuthors?.map(({ login, avatarDataUrl }) => ({
			name: login,
			imageUrl: avatarDataUrl
		})),
		coAuthorCount: preview.coAuthorCount,
		createdAt: preview.createdAt,
		updatedAt: preview.updatedAt,
		imageUrl: preview.avatarDataUrl,
		metadata: preview.kind === "pull" ? githubChangeMetadata(preview.additions, preview.deletions).map(({ value, tone }) => ({
			label: "",
			value,
			tone
		})) : preview.comments === void 0 ? [] : [{
			label: "Comments",
			value: String(preview.comments)
		}]
	};
}
//#endregion
export { withOptionalGitHubAuth as S, readGitHubGraphQLResponse as _, GITHUB_API_ORIGIN as a, requiredString as b, GitHubGraphQLUnavailableError as c, fetchGitHubJson as d, formatControlUiGitHubPreviewError as f, readBoundedResponse as g, optionalNumber as h, GITHUB_API_BASE_URL as i, discardResponse as l, githubRestApiPath as m, githubPreviewView as n, GITHUB_GRAPHQL_URL as o, githubApiCredentialCacheScope as p, ControlUiGitHubError as r, GITHUB_REQUEST_TIMEOUT_MS as s, githubChangeMetadata as t, fetchGitHubApi as u, readGitHubJsonResponse as v, resolveGitHubApiUrls as x, readOptionalGitHubString as y };
