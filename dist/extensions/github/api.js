import { s as asFiniteNumber } from "../../number-coercion-CLj0HTDM.mjs";
import { c as isRecord } from "../../record-coerce-DItp3I4t.mjs";
import { m as readNonBlankString } from "../../string-coerce-CIXf7egm.mjs";
import { r as truncateUtf16Safe } from "../../utf16-slice-D_ngcYKd.mjs";
import { t as pruneMapToMaxSize } from "../../map-size-CNcWiFKu.mjs";
import "../../string-coerce-runtime-C_MKhRVt.mjs";
import { i as parseGitHubItemTarget, o as parseGitHubTarget, r as githubTargetUrl } from "../../targets-B79WC-j3.mjs";
import { _ as requiredString, a as GITHUB_REQUEST_TIMEOUT_MS, c as fetchGitHubApi, d as githubApiCredentialCacheScope, f as optionalNumber, g as readOptionalGitHubString, h as readGitHubJsonResponse, i as GITHUB_API_ORIGIN, l as fetchGitHubJson, m as readGitHubGraphQLResponse, n as githubPreviewView, o as GitHubGraphQLUnavailableError, p as readBoundedResponse, r as ControlUiGitHubError, s as discardResponse, t as githubChangeMetadata, u as formatControlUiGitHubPreviewError, v as withOptionalGitHubAuth } from "../../view-model-CqdoXJT9.mjs";
//#region extensions/github/src/preview.ts
const GITHUB_AVATAR_HOST = "avatars.githubusercontent.com";
const GITHUB_AVATAR_MAX_BYTES = 262144;
const GITHUB_COMMITS_PAGE_SIZE = 100;
const GITHUB_COMMITS_MAX_BYTES = 1048576;
const CO_AUTHOR_FACE_LIMIT = 3;
const CO_AUTHOR_TRAILER = /^co-authored-by:[^<\r\n\u2028\u2029]*<(?<id>\d{1,12})\+(?<login>[a-z\d](?:[a-z\d-]{0,38}))@users\.noreply\.github\.com>[^\S\r\n\u2028\u2029]*$/gimu;
const AUTHENTICATED_SUCCESS_CACHE_MS = 3e5;
const ANONYMOUS_SUCCESS_CACHE_MS = 36e5;
const FAILURE_CACHE_MS = 3e4;
const CACHE_LIMIT$1 = 200;
const previewCache = /* @__PURE__ */ new Map();
const parseControlUiGitHubPreviewTarget = parseGitHubItemTarget;
function isPublicGitHubRepository(value) {
	return isRecord(value) && value.private === false && value.visibility === "public";
}
async function assertPublicGitHubRepository(repositoryUrl, fetchImpl, token, identity) {
	if (!isPublicGitHubRepository(await readGitHubJsonResponse(await fetchGitHubApi(repositoryUrl, fetchImpl, token, void 0, identity)))) throw new ControlUiGitHubError(404, "GitHub repository is not public");
}
function redirectedRepositoryApiUrl(target, url) {
	const segments = url.pathname.split("/").filter(Boolean);
	const collection = target.kind === "pull" ? "pulls" : "issues";
	const itemSegments = segments.at(-1) === "commits" ? segments.slice(0, -1) : segments;
	if (itemSegments.length === 5 && itemSegments[0] === "repos" && itemSegments[1] && itemSegments[2] && itemSegments[3] === collection && /^\d+$/u.test(itemSegments[4] ?? "")) return `${GITHUB_API_ORIGIN}/repos/${itemSegments[1]}/${itemSegments[2]}`;
	if (itemSegments.length === 4 && itemSegments[0] === "repositories" && /^\d+$/u.test(itemSegments[1] ?? "") && itemSegments[2] === collection && /^\d+$/u.test(itemSegments[3] ?? "")) return `${GITHUB_API_ORIGIN}/repositories/${itemSegments[1]}`;
	return null;
}
function previewRepositoryApiUrl(target, value) {
	if (target.kind === "issue") return requiredString(value, "repository_url");
	const base = isRecord(value.base) ? value.base : {};
	const repository = isRecord(base.repo) ? base.repo : {};
	return requiredString(repository, "url");
}
function parseControlUiGitHubPreviewResponse(target, value) {
	const user = isRecord(value.user) ? value.user : {};
	return {
		preview: {
			...target,
			additions: asFiniteNumber(value.additions),
			changedFiles: asFiniteNumber(value.changed_files),
			closedAt: readNonBlankString(value.closed_at),
			comments: asFiniteNumber(value.comments),
			createdAt: requiredString(value, "created_at"),
			deletions: asFiniteNumber(value.deletions),
			draft: typeof value.draft === "boolean" ? value.draft : void 0,
			login: readNonBlankString(user.login) ?? "ghost",
			mergedAt: readNonBlankString(value.merged_at),
			state: requiredString(value, "state"),
			stateReason: readNonBlankString(value.state_reason),
			title: requiredString(value, "title"),
			updatedAt: requiredString(value, "updated_at")
		},
		avatarUrl: readNonBlankString(user.avatar_url)
	};
}
function safeAvatarUrl(raw) {
	if (!raw) return null;
	try {
		const url = new URL(raw);
		const rawPathEnd = raw.search(/[?#]/u);
		const rawPath = rawPathEnd === -1 ? raw : raw.slice(0, rawPathEnd);
		if (url.protocol !== "https:" || url.hostname !== GITHUB_AVATAR_HOST || url.hash || url.username || url.password || url.port || rawPath.includes("..") || rawPath.includes("\\") || url.pathname.includes("..") || url.pathname.includes("\\")) return null;
		url.search = "";
		url.searchParams.set("s", "64");
		return url;
	} catch {
		return null;
	}
}
async function fetchCoAuthors(authorLogin, loadCommits, fetchImpl) {
	const empty = {
		coAuthors: [],
		coAuthorCount: 0
	};
	let commits;
	try {
		commits = await loadCommits();
	} catch {
		return empty;
	}
	if (!Array.isArray(commits)) return empty;
	const byLogin = /* @__PURE__ */ new Map();
	for (const entry of commits) {
		const commit = isRecord(entry) && isRecord(entry.commit) ? entry.commit : void 0;
		const message = readNonBlankString(commit?.message);
		if (!message) continue;
		for (const match of message.matchAll(CO_AUTHOR_TRAILER)) {
			const login = match.groups?.login;
			const accountId = match.groups?.id;
			if (!login || !accountId || login.toLowerCase() === authorLogin.toLowerCase()) continue;
			const key = login.toLowerCase();
			if (!byLogin.has(key)) byLogin.set(key, {
				login,
				accountId
			});
		}
	}
	const faces = [...byLogin.values()].slice(0, CO_AUTHOR_FACE_LIMIT);
	return {
		coAuthors: await Promise.all(faces.map(async (face) => {
			const avatarDataUrl = await fetchAvatarDataUrl(`https://${GITHUB_AVATAR_HOST}/u/${face.accountId}`, fetchImpl);
			return avatarDataUrl ? {
				login: face.login,
				avatarDataUrl
			} : { login: face.login };
		})),
		coAuthorCount: byLogin.size
	};
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
async function fetchPreview(target, fetchImpl, token, identity) {
	const request = (url, beforeRedirect) => fetchGitHubApi(url, fetchImpl, token, beforeRedirect, identity);
	const assertPublicRepository = (url) => assertPublicGitHubRepository(url, fetchImpl, token, identity);
	const repositoryUrl = `${GITHUB_API_ORIGIN}/repos/${encodeURIComponent(target.owner)}/${encodeURIComponent(target.repo)}`;
	const itemUrl = `${repositoryUrl}/${target.kind === "pull" ? "pulls" : "issues"}/${target.number}`;
	if (token) await assertPublicRepository(repositoryUrl);
	const beforeRedirect = token ? async (url) => {
		const redirectedRepositoryUrl = redirectedRepositoryApiUrl(target, url);
		if (!redirectedRepositoryUrl) throw new ControlUiGitHubError(502, "GitHub item returned an unsafe redirect");
		await assertPublicRepository(redirectedRepositoryUrl);
	} : void 0;
	const readItem = async (url, maxBytes) => readGitHubJsonResponse(await request(url, beforeRedirect), maxBytes);
	const parsed = await readItem(itemUrl);
	if (!isRecord(parsed)) throw new ControlUiGitHubError(502, "GitHub response was not an object");
	if (token) await assertPublicRepository(previewRepositoryApiUrl(target, parsed));
	const { preview, avatarUrl } = parseControlUiGitHubPreviewResponse(target, parsed);
	const [avatarDataUrl, coAuthorFacts] = await Promise.all([fetchAvatarDataUrl(avatarUrl, fetchImpl), target.kind === "pull" ? fetchCoAuthors(preview.login, () => readItem(`${itemUrl}/commits?per_page=${GITHUB_COMMITS_PAGE_SIZE}`, GITHUB_COMMITS_MAX_BYTES), fetchImpl) : Promise.resolve({
		coAuthors: [],
		coAuthorCount: 0
	})]);
	return {
		...preview,
		...avatarDataUrl ? { avatarDataUrl } : {},
		...coAuthorFacts.coAuthorCount > 0 ? {
			coAuthors: coAuthorFacts.coAuthors,
			coAuthorCount: coAuthorFacts.coAuthorCount
		} : {}
	};
}
function cacheKey(target, credentialScope) {
	return `${target.kind}:${target.owner.toLowerCase()}/${target.repo.toLowerCase()}#${target.number}\0${credentialScope}`;
}
function cachePreview(key, entry) {
	previewCache.set(key, entry);
	pruneMapToMaxSize(previewCache, CACHE_LIMIT$1);
}
async function loadControlUiGitHubPreview(target, identity, fetchImpl = fetch, refresh = false) {
	await identity?.revalidate();
	identity?.assertSelected();
	const { token, cacheScope } = identity ?? {
		token: void 0,
		cacheScope: "anonymous"
	};
	const key = cacheKey(target, cacheScope);
	const now = Date.now();
	let entry = previewCache.get(key);
	if (entry && (refresh || entry.expiresAt <= now)) {
		previewCache.delete(key);
		entry = void 0;
	}
	if (entry) {
		previewCache.delete(key);
		previewCache.set(key, entry);
	} else {
		const successCacheMs = token ? AUTHENTICATED_SUCCESS_CACHE_MS : ANONYMOUS_SUCCESS_CACHE_MS;
		const request = identity && !identity.optionalAuth ? fetchPreview(target, fetchImpl, token, identity) : withOptionalGitHubAuth(token, (requestToken) => fetchPreview(target, fetchImpl, requestToken, identity));
		const pending = {
			expiresAt: now + successCacheMs,
			promise: request.then((preview) => {
				if (identity && !previewCache.has(key)) cachePreview(key, pending);
				return preview;
			}, (error) => {
				if (previewCache.get(key) === (identity ? void 0 : pending)) {
					if (error instanceof ControlUiGitHubError) {
						pending.expiresAt = Date.now() + FAILURE_CACHE_MS;
						cachePreview(key, pending);
					} else previewCache.delete(key);
				}
				throw error;
			})
		};
		entry = pending;
		if (!identity) cachePreview(key, entry);
	}
	const preview = await entry.promise;
	await identity?.revalidate();
	identity?.assertSelected();
	return preview;
}
//#endregion
//#region extensions/github/src/detail-checks.ts
const CHECK_LIMIT = 100;
const LABEL_MAX_CHARS = 256;
const STATE_ORDER = {
	failure: 0,
	pending: 1,
	success: 2,
	neutral: 3
};
function count(value) {
	if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) throw new ControlUiGitHubError(502, "GitHub checks returned an invalid count");
	return value;
}
function checkUrl(value) {
	if (typeof value !== "string" || value.length > 4096) return;
	try {
		const url = new URL(value);
		return url.protocol === "https:" && !url.username && !url.password ? url.href : void 0;
	} catch {
		return;
	}
}
function runState(run) {
	switch (run.status) {
		case "queued": return {
			state: "pending",
			detail: "Queued"
		};
		case "in_progress": return {
			state: "pending",
			detail: "In progress"
		};
		case "waiting":
		case "requested":
		case "pending": return {
			state: "pending",
			detail: "Waiting"
		};
		case "completed": switch (run.conclusion) {
			case "success": return {
				state: "success",
				detail: "Passed"
			};
			case "neutral": return {
				state: "neutral",
				detail: "Neutral"
			};
			case "skipped": return {
				state: "neutral",
				detail: "Skipped"
			};
			case "failure": return {
				state: "failure",
				detail: "Failed"
			};
			case "cancelled": return {
				state: "failure",
				detail: "Canceled"
			};
			case "timed_out": return {
				state: "failure",
				detail: "Timed out"
			};
			case "action_required": return {
				state: "failure",
				detail: "Action required"
			};
			case "stale": return {
				state: "failure",
				detail: "Stale"
			};
			case "startup_failure": return {
				state: "failure",
				detail: "Could not start"
			};
		}
	}
	throw new ControlUiGitHubError(502, "GitHub check returned an unknown state");
}
function statusState(status) {
	switch (status.state) {
		case "success": return {
			state: "success",
			detail: "Passed"
		};
		case "pending": return {
			state: "pending",
			detail: "Pending"
		};
		case "failure": return {
			state: "failure",
			detail: "Failed"
		};
		case "error": return {
			state: "failure",
			detail: "Error"
		};
	}
	throw new ControlUiGitHubError(502, "GitHub commit status returned an unknown state");
}
function parsePage(page, commit, kind) {
	if (!isRecord(page.value)) throw new ControlUiGitHubError(502, "GitHub checks were not an object");
	const value = page.value;
	const entries = kind === "runs" ? value.check_runs : value.statuses;
	if (!Array.isArray(entries) || kind === "statuses" && value.sha !== commit) throw new ControlUiGitHubError(502, "GitHub checks returned a different revision or invalid list");
	const reportedTotal = count(value.total_count);
	const latest = /* @__PURE__ */ new Map();
	for (const entry of entries.slice(0, CHECK_LIMIT)) {
		if (!isRecord(entry) || kind === "runs" && entry.head_sha !== commit) throw new ControlUiGitHubError(502, "GitHub check returned a different revision or invalid item");
		const id = count(entry.id);
		const name = requiredString(entry, kind === "runs" ? "name" : "context");
		const key = kind === "runs" ? String(id) : name.toLowerCase();
		if ((latest.get(key)?.id ?? -1) >= id) continue;
		const state = kind === "runs" ? runState(entry) : statusState(entry);
		latest.set(key, {
			id,
			item: {
				name: name.slice(0, LABEL_MAX_CHARS),
				...state,
				url: checkUrl(kind === "runs" ? entry.html_url : entry.target_url)
			}
		});
	}
	const missing = Math.max(0, reportedTotal - Math.min(entries.length, CHECK_LIMIT));
	return {
		items: Array.from(latest.values(), ({ item }) => item),
		total: latest.size + missing,
		truncated: page.hasNextPage || missing > 0 || entries.length > CHECK_LIMIT
	};
}
async function fetchPullChecks(repositoryUrl, headSha, url, fetchPage) {
	if (typeof headSha !== "string" || !/^[a-f0-9]{40}$/u.test(headSha)) return {
		state: "unavailable",
		summary: "Checks unavailable",
		total: 0,
		items: [],
		truncated: true,
		url
	};
	const commitUrl = repositoryUrl + "/commits/" + headSha;
	const items = [];
	let total = 0;
	let truncated = false;
	for (const kind of ["runs", "statuses"]) try {
		const page = parsePage(await fetchPage(commitUrl + (kind === "runs" ? "/check-runs?filter=latest&per_page=" : "/status?per_page=") + CHECK_LIMIT), headSha, kind);
		items.push(...page.items);
		total += page.total;
		truncated ||= page.truncated;
	} catch {
		truncated = true;
	}
	items.sort((a, b) => STATE_ORDER[a.state] - STATE_ORDER[b.state] || a.name.localeCompare(b.name));
	truncated ||= items.length > CHECK_LIMIT;
	const counts = {
		success: 0,
		failure: 0,
		pending: 0,
		neutral: 0
	};
	for (const item of items) counts[item.state] += 1;
	return {
		state: counts.failure ? "failure" : counts.pending ? "pending" : truncated ? "unavailable" : counts.success ? "success" : "neutral",
		summary: [
			truncated ? items.length ? "Checks incomplete" : "Checks unavailable" : void 0,
			counts.failure ? counts.failure + " failed" : void 0,
			counts.pending ? counts.pending + " pending" : void 0,
			counts.success ? counts.success + " passed" : void 0,
			counts.neutral ? counts.neutral + " skipped or neutral" : void 0
		].filter(Boolean).join(" · ") || "No checks reported",
		total,
		items: items.slice(0, CHECK_LIMIT),
		truncated,
		url,
		commit: headSha
	};
}
//#endregion
//#region extensions/github/src/detail.ts
const DETAIL_JSON_MAX_BYTES = 1048576;
const BODY_MAX_CHARS = 32768;
const COMMENT_LIMIT = 20;
const COMMENT_MAX_CHARS = 4096;
const FILE_LIMIT = 30;
const PATCH_MAX_CHARS = 16384;
const PATCH_TOTAL_MAX_CHARS = 98304;
const SUCCESS_CACHE_MS = 3e5;
const PARTIAL_CACHE_MS = 3e4;
const CACHE_LIMIT = 32;
const detailCache = /* @__PURE__ */ new Map();
var GitHubDetailAccessError = class extends ControlUiGitHubError {
	constructor() {
		super(404, "GitHub repository is not public or has changed");
	}
};
function redirectedRepositoryUrl(url, suffix) {
	const match = /^(\/repos\/[^/]+\/[^/]+|\/repositories\/\d+)(\/.*)?$/u.exec(url.pathname);
	if (!match || (match[2] ?? "") !== suffix) throw new GitHubDetailAccessError();
	return GITHUB_API_ORIGIN + match[1];
}
async function readPublicRepository(url, fetchImpl, identity, expectedId) {
	const repository = await readGitHubJsonResponse(await fetchGitHubApi(url, fetchImpl, identity.token, async (redirect) => {
		redirectedRepositoryUrl(redirect, "");
	}, identity));
	const id = isRecord(repository) ? optionalNumber(repository, "id") : void 0;
	if (!isPublicGitHubRepository(repository) || id === void 0 || !Number.isSafeInteger(id) || id <= 0 || expectedId !== void 0 && id !== expectedId) throw new GitHubDetailAccessError();
	return id;
}
function markdownBody(value, maxChars) {
	const body = typeof value === "string" ? value : "";
	return {
		body: truncateUtf16Safe(body, maxChars),
		bodyTruncated: body.length > maxChars
	};
}
function requiredCount(value, key) {
	const count = optionalNumber(value, key);
	if (count === void 0 || !Number.isSafeInteger(count) || count < 0) throw new ControlUiGitHubError(502, `GitHub response omitted ${key}`);
	return count;
}
function commentPosition(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value > 0 ? value : void 0;
}
function commentUrl(comment) {
	const url = new URL(requiredString(comment, "html_url"));
	if (url.origin !== "https://github.com" || url.username || url.password) throw new ControlUiGitHubError(502, "GitHub comment returned an unsafe permalink");
	return url.href;
}
function parseComments(value, kind) {
	if (!Array.isArray(value)) throw new ControlUiGitHubError(502, "GitHub comments were not an array");
	return value.slice(0, COMMENT_LIMIT).map((comment) => {
		if (!isRecord(comment)) throw new ControlUiGitHubError(502, "GitHub comment was not an object");
		const user = isRecord(comment.user) ? comment.user : {};
		const { body, bodyTruncated } = markdownBody(comment.body, COMMENT_MAX_CHARS);
		const diffHunk = kind === "review" ? markdownBody(comment.diff_hunk, COMMENT_MAX_CHARS) : void 0;
		const id = requiredCount(comment, "id");
		const url = commentUrl(comment);
		const path = kind !== "discussion" ? readOptionalGitHubString(comment, "path") : void 0;
		const line = commentPosition(comment.line) ?? commentPosition(comment.original_line);
		const start = commentPosition(comment.start_line) ?? commentPosition(comment.original_start_line);
		const lineLabel = line === void 0 ? void 0 : (start !== void 0 && start !== line ? start + "–" : "") + line;
		const replyId = kind === "review" ? commentPosition(comment.in_reply_to_id) : void 0;
		const locationLabels = [comment.side === "LEFT" ? "Before change" : comment.side === "RIGHT" ? "After change" : void 0, comment.line == null && commentPosition(comment.original_line) ? "Outdated" : void 0].filter(Boolean);
		return {
			id: new URL(url).hash.slice(1) || (kind === "review" ? "discussion_r" : kind === "commit" ? "commitcomment-" : "issuecomment-") + id,
			url,
			author: readOptionalGitHubString(user, "login") ?? "ghost",
			createdAt: requiredString(comment, "created_at"),
			body,
			bodyTruncated,
			label: kind === "review" ? "Review comment" : void 0,
			context: kind !== "discussion" ? {
				path,
				lineLabel,
				label: locationLabels.join(" · ") || void 0,
				diff: diffHunk?.body,
				diffTruncated: kind === "review" ? typeof comment.diff_hunk !== "string" || diffHunk?.bodyTruncated : void 0,
				replyUrl: replyId === void 0 ? void 0 : new URL("#discussion_r" + replyId, url).href,
				replyLabel: replyId === void 0 ? void 0 : "In reply to #" + replyId
			} : void 0
		};
	});
}
async function fetchComments(url, kind, total, readPage) {
	if (total === 0) return {
		comments: [],
		commentsTotal: 0,
		commentsTruncated: false
	};
	try {
		const sort = kind === "review" ? "&sort=created&direction=asc" : "";
		const page = await readPage(url + "?per_page=20" + sort);
		const comments = parseComments(page.value, kind);
		return {
			comments,
			commentsTotal: total,
			commentsTruncated: page.hasNextPage || total > comments.length || Array.isArray(page.value) && page.value.length > COMMENT_LIMIT
		};
	} catch (error) {
		if (error instanceof GitHubDetailAccessError) throw error;
		return {
			comments: [],
			commentsTotal: total,
			commentsTruncated: true
		};
	}
}
function parseFiles(value) {
	if (!Array.isArray(value)) throw new ControlUiGitHubError(502, "GitHub files were not an array");
	let remainingPatchChars = PATCH_TOTAL_MAX_CHARS;
	return value.slice(0, FILE_LIMIT).map((file) => {
		if (!isRecord(file)) throw new ControlUiGitHubError(502, "GitHub file was not an object");
		const rawPatch = typeof file.patch === "string" ? file.patch : void 0;
		const patch = rawPatch === void 0 ? void 0 : truncateUtf16Safe(rawPatch, Math.min(PATCH_MAX_CHARS, remainingPatchChars));
		remainingPatchChars -= patch?.length ?? 0;
		return {
			path: requiredString(file, "filename"),
			previousPath: readOptionalGitHubString(file, "previous_filename"),
			status: requiredString(file, "status"),
			additions: requiredCount(file, "additions"),
			deletions: requiredCount(file, "deletions"),
			patch,
			patchTruncated: rawPatch === void 0 || patch?.length !== rawPatch.length
		};
	});
}
async function fetchDetail(target, readPage) {
	const repoPath = `/repos/${encodeURIComponent(target.owner)}/${encodeURIComponent(target.repo)}`;
	const repositoryUrl = GITHUB_API_ORIGIN + repoPath;
	const itemUrl = `${repositoryUrl}/${target.kind === "commit" ? "commits" : target.kind === "pull" ? "pulls" : "issues"}/${target.kind === "commit" ? target.sha : target.number}`;
	const itemPage = await readPage(target.kind === "commit" ? `${itemUrl}?per_page=${FILE_LIMIT}` : itemUrl);
	if (!isRecord(itemPage.value)) throw new ControlUiGitHubError(502, "GitHub response was not an object");
	const value = itemPage.value;
	const url = githubTargetUrl(target);
	if (target.kind === "commit") {
		const commit = isRecord(value.commit) ? value.commit : {};
		const author = isRecord(value.author) ? value.author : {};
		const commitAuthor = isRecord(commit.author) ? commit.author : {};
		const stats = isRecord(value.stats) ? value.stats : {};
		const content = markdownBody(commit.message, BODY_MAX_CHARS);
		const discussion = await fetchComments(itemUrl + "/comments", "commit", requiredCount(commit, "comment_count"), readPage);
		const files = value.files === void 0 ? [] : parseFiles(value.files);
		const filesTruncated = value.files === void 0 || itemPage.hasNextPage || Array.isArray(value.files) && value.files.length > FILE_LIMIT;
		return {
			url,
			subtitle: target.owner + "/" + target.repo + " · " + requiredString(value, "sha").slice(0, 12),
			badge: {
				label: "Commit",
				tone: "neutral"
			},
			title: content.body.split("\n", 1)[0] ?? "",
			author: readOptionalGitHubString(author, "login") ?? readOptionalGitHubString(commitAuthor, "name") ?? "ghost",
			createdAt: readOptionalGitHubString(commitAuthor, "date"),
			metadata: githubChangeMetadata(optionalNumber(stats, "additions"), optionalNumber(stats, "deletions")),
			...content,
			...discussion,
			files,
			filesTruncated,
			partial: content.bodyTruncated || discussion.commentsTruncated || filesTruncated || discussion.comments.some((comment) => comment.bodyTruncated) || files.some((file) => file.patchTruncated)
		};
	}
	const { preview } = parseControlUiGitHubPreviewResponse(target, value);
	const content = markdownBody(value.body, BODY_MAX_CHARS);
	const discussion = await fetchComments(repositoryUrl + "/issues/" + target.number + "/comments", "discussion", requiredCount(value, "comments"), readPage);
	const review = target.kind === "pull" ? await fetchComments(itemUrl + "/comments", "review", requiredCount(value, "review_comments"), readPage) : void 0;
	const comments = discussion.comments.concat(review?.comments ?? []).toSorted((left, right) => (left.createdAt ?? "").localeCompare(right.createdAt ?? "") || left.id.localeCompare(right.id, "en", { numeric: true }));
	const commentsTotal = discussion.commentsTotal + (review?.commentsTotal ?? 0);
	const commentsTruncated = discussion.commentsTruncated || review?.commentsTruncated === true;
	let files = [];
	let filesTruncated = false;
	const filesTotal = target.kind === "pull" ? requiredCount(value, "changed_files") : 0;
	if (filesTotal > 0) try {
		const page = await readPage(`${itemUrl}/files?per_page=${FILE_LIMIT}`);
		files = parseFiles(page.value);
		filesTruncated = page.hasNextPage || filesTotal > files.length;
	} catch (error) {
		if (error instanceof GitHubDetailAccessError) throw error;
		filesTruncated = true;
	}
	const head = isRecord(value.head) ? value.head : {};
	const base = isRecord(value.base) ? value.base : {};
	const checks = target.kind === "pull" ? await fetchPullChecks(repositoryUrl, head.sha, url + "/checks", readPage) : void 0;
	const view = githubPreviewView(preview);
	const metadata = githubChangeMetadata(preview.additions, preview.deletions, preview.changedFiles, preview.comments);
	const headRef = readOptionalGitHubString(head, "ref")?.slice(0, 256);
	const baseRef = readOptionalGitHubString(base, "ref")?.slice(0, 256);
	return {
		...view,
		metadata: target.kind === "pull" && headRef && baseRef ? [...metadata, {
			label: "Branch",
			value: headRef + " → " + baseRef
		}] : metadata,
		url,
		...content,
		...checks ? { checks } : {},
		comments,
		commentsTotal,
		commentsTruncated,
		files,
		filesTotal,
		filesTruncated,
		partial: content.bodyTruncated || commentsTruncated || filesTruncated || checks?.truncated === true || checks?.state === "unavailable" || comments.some((comment) => comment.bodyTruncated || comment.context?.diffTruncated) || files.some((file) => file.patchTruncated)
	};
}
async function loadGitHubDetailWithIdentity(target, identity, fetchImpl = fetch, refresh = false) {
	const parsed = parseGitHubTarget(target);
	if (!parsed) throw new ControlUiGitHubError(400, "Invalid GitHub detail target");
	await identity?.revalidate();
	identity?.assertSelected();
	const id = parsed.kind === "commit" ? parsed.sha : parsed.number;
	const key = `${parsed.kind}:${parsed.owner.toLowerCase()}/${parsed.repo.toLowerCase()}#${id}\0${identity?.cacheScope ?? "anonymous"}\0${githubApiCredentialCacheScope(identity?.token)}`;
	const assertDelivery = async (result) => {
		if (identity?.token) for (const url of result.repositoryUrls) await readPublicRepository(url, fetchImpl, identity, result.repositoryId);
		await identity?.revalidate();
		identity?.assertSelected();
	};
	const cached = detailCache.get(key);
	if (!refresh && cached && cached.expiresAt > Date.now() && (!identity || cached.settled)) {
		detailCache.delete(key);
		detailCache.set(key, cached);
		const result = await cached.promise;
		await assertDelivery(result);
		return result.document;
	}
	detailCache.delete(key);
	const load = async () => {
		const repositoryUrl = `${GITHUB_API_ORIGIN}/repos/${encodeURIComponent(parsed.owner)}/${encodeURIComponent(parsed.repo)}`;
		const repositoryUrls = /* @__PURE__ */ new Set([repositoryUrl]);
		const repositoryId = identity?.token ? await readPublicRepository(repositoryUrl, fetchImpl, identity) : void 0;
		if (!identity?.token) await assertPublicGitHubRepository(repositoryUrl, fetchImpl, void 0, identity);
		const readPage = async (url) => {
			const suffix = new URL(url).pathname.slice(new URL(repositoryUrl).pathname.length);
			const response = await fetchGitHubApi(url, fetchImpl, identity?.token, identity?.token ? async (redirect) => {
				const redirected = redirectedRepositoryUrl(redirect, suffix);
				await readPublicRepository(redirected, fetchImpl, identity, repositoryId);
				repositoryUrls.add(redirected);
			} : void 0, identity);
			return {
				hasNextPage: /;\s*rel="next"/u.test(response.headers.get("link") ?? ""),
				value: await readGitHubJsonResponse(response, DETAIL_JSON_MAX_BYTES)
			};
		};
		const result = {
			document: await fetchDetail(parsed, readPage),
			repositoryId,
			repositoryUrls: [...repositoryUrls]
		};
		await assertDelivery(result);
		return result;
	};
	const entry = {
		expiresAt: Date.now() + SUCCESS_CACHE_MS,
		settled: false,
		promise: load().then((result) => {
			entry.settled = true;
			if (parsed.kind === "pull" || result.document.partial) entry.expiresAt = Date.now() + PARTIAL_CACHE_MS;
			return result;
		}).catch((error) => {
			if (error instanceof ControlUiGitHubError && error.statusCode !== 409) {
				entry.settled = true;
				entry.expiresAt = Date.now() + PARTIAL_CACHE_MS;
			} else if (detailCache.get(key) === entry) detailCache.delete(key);
			throw error;
		})
	};
	detailCache.set(key, entry);
	pruneMapToMaxSize(detailCache, CACHE_LIMIT);
	const result = await entry.promise;
	identity?.assertSelected();
	return result.document;
}
function loadGitHubDetail(target, identity, fetchImpl = fetch, refresh = false) {
	return identity?.optionalAuth ? withOptionalGitHubAuth(identity.token, (token) => loadGitHubDetailWithIdentity(target, {
		...identity,
		token
	}, fetchImpl, refresh)) : loadGitHubDetailWithIdentity(target, identity, fetchImpl, refresh);
}
//#endregion
export { ControlUiGitHubError, GITHUB_API_ORIGIN, GITHUB_REQUEST_TIMEOUT_MS, GitHubGraphQLUnavailableError, discardResponse, fetchGitHubApi, fetchGitHubJson, formatControlUiGitHubPreviewError, githubApiCredentialCacheScope, isRecord, loadControlUiGitHubPreview, loadGitHubDetail, optionalNumber, parseControlUiGitHubPreviewTarget, parseGitHubTarget, readBoundedResponse, readGitHubGraphQLResponse, readGitHubJsonResponse, readOptionalGitHubString, requiredString, withOptionalGitHubAuth };
