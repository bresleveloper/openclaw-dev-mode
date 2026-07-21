import { u as readResponseWithLimit } from "./http-body-CHWaxK2e.js";
import "./src-CToKmqGn.js";
import { Gn as errorShape, Wn as ErrorCodes } from "./schema-BuOFpc7K.js";
//#region src/gateway/control-ui-github-preview.ts
const GITHUB_API_ORIGIN = "https://api.github.com";
const GITHUB_AVATAR_HOST = "avatars.githubusercontent.com";
const GITHUB_API_VERSION = "2022-11-28";
const GITHUB_JSON_MAX_BYTES = 256 * 1024;
const GITHUB_AVATAR_MAX_BYTES = 256 * 1024;
const GITHUB_REQUEST_TIMEOUT_MS = 8e3;
const GITHUB_API_MAX_REDIRECTS = 3;
const AUTHENTICATED_SUCCESS_CACHE_MS = 5 * 6e4;
const ANONYMOUS_SUCCESS_CACHE_MS = 60 * 6e4;
const FAILURE_CACHE_MS = 3e4;
const CACHE_LIMIT = 200;
const previewCache = /* @__PURE__ */ new Map();
var ControlUiGitHubPreviewError = class extends Error {
	constructor(statusCode, message) {
		super(message);
		this.name = "ControlUiGitHubPreviewError";
		this.statusCode = statusCode;
	}
};
function isRecord(value) {
	return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
function requiredString(record, key) {
	const value = record[key];
	if (typeof value !== "string" || !value.trim()) throw new ControlUiGitHubPreviewError(502, `GitHub response omitted ${key}`);
	return value;
}
function optionalString(record, key) {
	const value = record[key];
	return typeof value === "string" && value.trim() ? value : void 0;
}
function optionalNumber(record, key) {
	const value = record[key];
	return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function isValidOwner(value) {
	return /^(?=.{1,39}$)[a-z\d](?:[a-z\d-]*[a-z\d])?$/iu.test(value);
}
function isValidRepo(value) {
	return value !== "." && value !== ".." && /^[a-z\d_.-]{1,100}$/iu.test(value);
}
function parseControlUiGitHubPreviewTarget(value) {
	if (!isRecord(value)) return null;
	const kind = value.kind;
	const owner = typeof value.owner === "string" ? value.owner.trim() : "";
	const repo = typeof value.repo === "string" ? value.repo.trim() : "";
	const number = value.number;
	if (kind !== "issue" && kind !== "pull" || !isValidOwner(owner) || !isValidRepo(repo) || typeof number !== "number" || !Number.isSafeInteger(number) || number < 1 || number > 9999999999) return null;
	return {
		kind,
		number,
		owner,
		repo
	};
}
function previewApiUrl(target) {
	const collection = target.kind === "pull" ? "pulls" : "issues";
	const owner = encodeURIComponent(target.owner);
	const repo = encodeURIComponent(target.repo);
	return `${GITHUB_API_ORIGIN}/repos/${owner}/${repo}/${collection}/${target.number}`;
}
function repositoryApiUrl(target) {
	const owner = encodeURIComponent(target.owner);
	const repo = encodeURIComponent(target.repo);
	return `${GITHUB_API_ORIGIN}/repos/${owner}/${repo}`;
}
function githubApiToken() {
	return process.env.GH_TOKEN?.trim() || process.env.GITHUB_TOKEN?.trim() || void 0;
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
function safeGitHubApiUrl(raw, base) {
	try {
		const url = new URL(raw, base);
		if (url.origin !== GITHUB_API_ORIGIN || url.username || url.password || url.port) return null;
		return url;
	} catch {
		return null;
	}
}
async function fetchGitHubApi(rawUrl, fetchImpl, token, beforeRedirect) {
	const initialUrl = safeGitHubApiUrl(rawUrl);
	if (!initialUrl) throw new ControlUiGitHubPreviewError(502, "Invalid GitHub API URL");
	let url = initialUrl;
	const signal = AbortSignal.timeout(GITHUB_REQUEST_TIMEOUT_MS);
	for (let redirects = 0;; redirects += 1) {
		const response = await fetchImpl(url.href, {
			headers: githubApiHeaders(token),
			redirect: "manual",
			signal
		});
		if (!isGitHubApiRedirect(response.status)) return response;
		const location = response.headers.get("location");
		const nextUrl = location ? safeGitHubApiUrl(location, url) : null;
		if (!nextUrl || redirects >= GITHUB_API_MAX_REDIRECTS) {
			await discardResponse(response);
			throw new ControlUiGitHubPreviewError(502, "GitHub API returned an unsafe redirect");
		}
		await discardResponse(response);
		await beforeRedirect?.(nextUrl);
		url = nextUrl;
	}
}
async function discardResponse(response) {
	await response.body?.cancel().catch(() => {});
}
async function readBoundedResponse(response, maxBytes) {
	try {
		return await readResponseWithLimit(response, maxBytes);
	} finally {
		await discardResponse(response);
	}
}
function upstreamErrorStatus(status) {
	if (status === 404) return 404;
	if (status === 403 || status === 429) return 429;
	return 502;
}
async function assertPublicRepositoryUrl(repositoryUrl, fetchImpl, token) {
	const response = await fetchGitHubApi(repositoryUrl, fetchImpl, token);
	if (!response.ok) {
		await discardResponse(response);
		throw new ControlUiGitHubPreviewError(upstreamErrorStatus(response.status), `GitHub repository request failed (${response.status})`);
	}
	const body = await readBoundedResponse(response, GITHUB_JSON_MAX_BYTES);
	let parsed;
	try {
		parsed = JSON.parse(body.toString("utf8"));
	} catch {
		throw new ControlUiGitHubPreviewError(502, "GitHub repository response was not valid JSON");
	}
	if (!isRecord(parsed) || parsed.private !== false) throw new ControlUiGitHubPreviewError(404, "GitHub repository is not public");
}
function redirectedRepositoryApiUrl(target, url) {
	const segments = url.pathname.split("/").filter(Boolean);
	const collection = target.kind === "pull" ? "pulls" : "issues";
	if (segments.length === 5 && segments[0] === "repos" && segments[1] && segments[2] && segments[3] === collection && /^\d+$/u.test(segments[4] ?? "")) return `${GITHUB_API_ORIGIN}/repos/${segments[1]}/${segments[2]}`;
	if (segments.length === 4 && segments[0] === "repositories" && /^\d+$/u.test(segments[1] ?? "") && segments[2] === collection && /^\d+$/u.test(segments[3] ?? "")) return `${GITHUB_API_ORIGIN}/repositories/${segments[1]}`;
	return null;
}
function previewRepositoryApiUrl(target, value) {
	if (target.kind === "issue") return requiredString(value, "repository_url");
	const base = isRecord(value.base) ? value.base : {};
	return requiredString(isRecord(base.repo) ? base.repo : {}, "url");
}
function parseGitHubResponse(target, value) {
	if (!isRecord(value)) throw new ControlUiGitHubPreviewError(502, "GitHub response was not an object");
	const user = isRecord(value.user) ? value.user : {};
	return {
		preview: {
			...target,
			additions: optionalNumber(value, "additions"),
			changedFiles: optionalNumber(value, "changed_files"),
			closedAt: optionalString(value, "closed_at"),
			comments: optionalNumber(value, "comments"),
			createdAt: requiredString(value, "created_at"),
			deletions: optionalNumber(value, "deletions"),
			draft: typeof value.draft === "boolean" ? value.draft : void 0,
			login: optionalString(user, "login") ?? "ghost",
			mergedAt: optionalString(value, "merged_at"),
			state: requiredString(value, "state"),
			stateReason: optionalString(value, "state_reason"),
			title: requiredString(value, "title"),
			updatedAt: requiredString(value, "updated_at")
		},
		avatarUrl: optionalString(user, "avatar_url")
	};
}
function safeAvatarUrl(raw) {
	if (!raw) return null;
	try {
		const url = new URL(raw);
		if (url.protocol !== "https:" || url.hostname !== GITHUB_AVATAR_HOST || url.username || url.password || url.port) return null;
		url.searchParams.set("s", "64");
		return url;
	} catch {
		return null;
	}
}
async function fetchAvatarDataUrl(rawUrl, fetchImpl) {
	const url = safeAvatarUrl(rawUrl);
	if (!url) return;
	try {
		const response = await fetchImpl(url, {
			headers: { Accept: "image/webp,image/png,image/jpeg,image/gif" },
			redirect: "error",
			signal: AbortSignal.timeout(GITHUB_REQUEST_TIMEOUT_MS)
		});
		const contentType = response.headers.get("content-type")?.split(";", 1)[0]?.trim();
		if (!response.ok || !contentType || ![
			"image/gif",
			"image/jpeg",
			"image/png",
			"image/webp"
		].includes(contentType)) {
			await discardResponse(response);
			return;
		}
		return `data:${contentType};base64,${(await readBoundedResponse(response, GITHUB_AVATAR_MAX_BYTES)).toString("base64")}`;
	} catch {
		return;
	}
}
async function fetchPreview(target, fetchImpl, token) {
	if (token) await assertPublicRepositoryUrl(repositoryApiUrl(target), fetchImpl, token);
	const response = await fetchGitHubApi(previewApiUrl(target), fetchImpl, token, token ? async (url) => {
		const repositoryUrl = redirectedRepositoryApiUrl(target, url);
		if (!repositoryUrl) throw new ControlUiGitHubPreviewError(502, "GitHub item returned an unsafe redirect");
		await assertPublicRepositoryUrl(repositoryUrl, fetchImpl, token);
	} : void 0);
	if (!response.ok) {
		await discardResponse(response);
		throw new ControlUiGitHubPreviewError(upstreamErrorStatus(response.status), `GitHub request failed (${response.status})`);
	}
	const body = await readBoundedResponse(response, GITHUB_JSON_MAX_BYTES);
	let parsed;
	try {
		parsed = JSON.parse(body.toString("utf8"));
	} catch {
		throw new ControlUiGitHubPreviewError(502, "GitHub response was not valid JSON");
	}
	if (!isRecord(parsed)) throw new ControlUiGitHubPreviewError(502, "GitHub response was not an object");
	if (token) await assertPublicRepositoryUrl(previewRepositoryApiUrl(target, parsed), fetchImpl, token);
	const { preview, avatarUrl } = parseGitHubResponse(target, parsed);
	const avatarDataUrl = await fetchAvatarDataUrl(avatarUrl, fetchImpl);
	return avatarDataUrl ? {
		...preview,
		avatarDataUrl
	} : preview;
}
function cacheKey(target) {
	return `${target.kind}:${target.owner.toLowerCase()}/${target.repo.toLowerCase()}#${target.number}`;
}
function loadControlUiGitHubPreview(target, fetchImpl = fetch) {
	const key = cacheKey(target);
	const now = Date.now();
	const cached = previewCache.get(key);
	if (cached && cached.expiresAt > now) {
		previewCache.delete(key);
		previewCache.set(key, cached);
		return cached.promise;
	}
	if (cached) previewCache.delete(key);
	const token = githubApiToken();
	const entry = {
		expiresAt: now + (token ? AUTHENTICATED_SUCCESS_CACHE_MS : ANONYMOUS_SUCCESS_CACHE_MS),
		promise: fetchPreview(target, fetchImpl, token).catch((error) => {
			entry.expiresAt = Date.now() + FAILURE_CACHE_MS;
			throw error;
		})
	};
	previewCache.set(key, entry);
	while (previewCache.size > CACHE_LIMIT) {
		const oldestKey = previewCache.keys().next().value;
		if (!oldestKey) break;
		previewCache.delete(oldestKey);
	}
	return entry.promise;
}
//#endregion
//#region src/gateway/server-methods/control-ui.ts
function createControlUiHandlers(loadGitHubPreview = loadControlUiGitHubPreview) {
	return { "controlUi.githubPreview": async ({ params, respond }) => {
		const target = parseControlUiGitHubPreviewTarget(params);
		if (!target) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "invalid controlUi.githubPreview params"));
			return;
		}
		try {
			respond(true, await loadGitHubPreview(target), void 0);
		} catch (error) {
			const statusCode = error instanceof ControlUiGitHubPreviewError ? error.statusCode : void 0;
			respond(false, void 0, errorShape(ErrorCodes.UNAVAILABLE, "GitHub preview unavailable", { retryable: statusCode === 429 || statusCode === 502 }));
		}
	} };
}
const controlUiHandlers = createControlUiHandlers();
//#endregion
export { controlUiHandlers, createControlUiHandlers };
