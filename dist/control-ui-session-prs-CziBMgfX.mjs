import { m as readNonBlankString } from "./string-coerce-1VuiLaaR.mjs";
import { s as asFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { o as racePromiseWithAbortSignal } from "./src-D1BHGNTj.mjs";
import "./abort-signal-QqAmLWTl.mjs";
import { t as runGitReadOperation } from "./git-read-cache-ULbuhQBO.mjs";
import { n as gitHubPublicApi } from "./github-public-api-COOMiXSo.mjs";
import { n as prepareSessionPullRequestGitHubRead, t as createGitHubReadGroup } from "./control-ui-session-pr-request-BTQOuS8L.mjs";
import { n as fetchSessionPullRequestCheckRollup, r as sessionPullRequestRepositoryApiUrl } from "./control-ui-session-prs-checks-Bb10Gvfh.mjs";
import { t as resolveGitHubForkParent } from "./github-repository-target-Dd_mrAkV.mjs";
//#region src/infra/retained-cache.ts
const UNWATCHED_CACHE_LIMIT = 100;
/** Signal-scoped watchers retain one canonical entry beyond the unobserved bound. */
function createRetainedCache() {
	const entries = /* @__PURE__ */ new Map();
	const retained = /* @__PURE__ */ new Map();
	const pins = /* @__PURE__ */ new WeakMap();
	const release = (signal) => {
		if (signal) pins.get(signal)?.release();
	};
	const retain = (key, entry, signal) => {
		if (!signal || signal.aborted || pins.get(signal)?.key === key) return;
		release(signal);
		const current = retained.get(key) ?? {
			entry,
			watchers: /* @__PURE__ */ new Set()
		};
		retained.set(key, current);
		current.watchers.add(signal);
		const unpin = () => {
			signal.removeEventListener("abort", unpin);
			pins.delete(signal);
			current.watchers.delete(signal);
			if (current.watchers.size === 0) retained.delete(key);
		};
		pins.set(signal, {
			key,
			release: unpin
		});
		signal.addEventListener("abort", unpin, { once: true });
	};
	return {
		get(key, signal) {
			if (signal && pins.get(signal)?.key !== key) release(signal);
			const entry = retained.get(key)?.entry ?? entries.get(key);
			if (entry !== void 0) retain(key, entry, signal);
			return entry;
		},
		set(key, entry, signal) {
			const current = retained.get(key);
			if (current) current.entry = entry;
			entries.delete(key);
			entries.set(key, entry);
			pruneMapToMaxSize(entries, UNWATCHED_CACHE_LIMIT);
			retain(key, entry, signal);
		},
		delete(key, expected) {
			if (entries.get(key) === expected) entries.delete(key);
			const current = retained.get(key);
			if (current && current.entry === expected) current.entry = void 0;
		},
		clear() {
			for (const current of retained.values()) for (const signal of current.watchers) release(signal);
			entries.clear();
		},
		release
	};
}
//#endregion
//#region src/gateway/control-ui-session-prs.ts
const SUCCESS_CACHE_MS = 9e4;
const RATE_LIMIT_CACHE_MS = 3e5;
const FAILURE_CACHE_MS = 3e4;
const MAX_PULL_REQUESTS = 3;
const branchCache = createRetainedCache();
function branchCreateUrl(context, branchName) {
	const owner = encodeURIComponent(context.owner);
	const repo = encodeURIComponent(context.repo);
	const branch = branchName.split("/").map(encodeURIComponent).join("/");
	return `https://${context.host ?? "github.com"}/${owner}/${repo}/pull/new/${branch}`;
}
async function resolveSessionBranch(context, mergedHeads, refresh) {
	if (!context.branch || context.branch === context.defaultBranch) return;
	const root = context.root;
	if (!root) return {
		owner: context.owner,
		repo: context.repo,
		branch: context.branch,
		createUrl: branchCreateUrl(context, context.branch)
	};
	const facts = await runGitReadOperation({
		type: "pull-request.branch-facts",
		input: {
			root,
			branch: context.branch,
			defaultBranch: context.defaultBranch,
			mergedHeads
		}
	}, { refresh });
	if (!facts) return;
	return {
		owner: context.owner,
		repo: context.repo,
		branch: context.branch,
		...facts.creatable ? { createUrl: branchCreateUrl(context, context.branch) } : {},
		...facts.stats ? {
			additions: facts.stats.additions,
			deletions: facts.stats.deletions,
			changedFiles: facts.stats.changedFiles
		} : {}
	};
}
function derivePullState(value) {
	if (readNonBlankString(value.merged_at)) return "merged";
	if (value.state !== "open") return "closed";
	return value.draft === true ? "draft" : "open";
}
function parsePullListItem(value) {
	if (!isRecord(value)) return null;
	const number = asFiniteNumber(value.number);
	const title = readNonBlankString(value.title);
	const url = readNonBlankString(value.html_url);
	const base = isRecord(value.base) ? value.base : {};
	const baseRepo = isRecord(base.repo) ? base.repo : {};
	const baseOwner = isRecord(baseRepo.owner) ? baseRepo.owner : {};
	const owner = readNonBlankString(baseOwner.login);
	const repo = readNonBlankString(baseRepo.name);
	const head = isRecord(value.head) ? value.head : {};
	if (!number || !Number.isSafeInteger(number) || number < 1 || !title || !url || !owner || !repo) return null;
	const user = isRecord(value.user) ? value.user : {};
	const authorLogin = readNonBlankString(user.login);
	return {
		number,
		title,
		url,
		owner,
		repo,
		state: derivePullState(value),
		...authorLogin ? { author: { login: authorLogin } } : {},
		branch: readNonBlankString(head.ref),
		headSha: readNonBlankString(head.sha),
		baseRef: readNonBlankString(base.ref),
		mergeCommitSha: readNonBlankString(value.merge_commit_sha)
	};
}
function parsePullList(value, host) {
	if (!Array.isArray(value)) return [];
	return value.map(parsePullListItem).filter((item) => {
		if (!item) return false;
		const url = URL.parse(item.url);
		if (url?.protocol !== "https:" || url.username || url.password || url.hostname !== host) throw new gitHubPublicApi.ControlUiGitHubError(502, "GitHub returned a pull request for another host");
		return true;
	});
}
function pullsByHeadUrl(owner, repo, head, apiBaseUrl) {
	const encHead = encodeURIComponent(head);
	return `${sessionPullRequestRepositoryApiUrl({
		owner,
		repo,
		apiBaseUrl
	})}/pulls?head=${encHead}&state=all&sort=updated&direction=desc&per_page=5`;
}
function rethrowRateLimit(error) {
	if (error instanceof gitHubPublicApi.ControlUiGitHubError && error.statusCode === 429) throw error;
}
/**
* The facts a chip carries without spending quota on per-PR detail calls. The
* rate-limited path renders exactly this, so both callers share one shape.
*/
function stateOnlyPullRequestChip(item, branch) {
	return {
		number: item.number,
		owner: item.owner,
		repo: item.repo,
		branch,
		title: item.title,
		url: item.url,
		state: item.state,
		...item.headSha && /^[0-9a-f]{40}$/i.test(item.headSha) ? { headSha: item.headSha.toLowerCase() } : {},
		...item.author ? { author: item.author } : {}
	};
}
async function finishPullRequest(item, branch, read) {
	const chip = stateOnlyPullRequestChip(item, branch);
	if (item.state !== "open" && item.state !== "draft") return chip;
	const detailUrl = `${sessionPullRequestRepositoryApiUrl({
		...item,
		apiBaseUrl: read.apiBaseUrl
	})}/pulls/${item.number}`;
	const [details, checks] = await Promise.all([read.request(detailUrl).catch(rethrowRateLimit), fetchSessionPullRequestCheckRollup({
		...item,
		apiBaseUrl: read.apiBaseUrl
	}, read.request).catch(rethrowRateLimit)]);
	return {
		...chip,
		...isRecord(details) ? {
			additions: asFiniteNumber(details.additions),
			deletions: asFiniteNumber(details.deletions),
			changedFiles: asFiniteNumber(details.changed_files)
		} : {},
		...checks ? {
			checks,
			checksUrl: `${item.url}/checks`
		} : {}
	};
}
function mergedHeadsOf(items) {
	const heads = [];
	for (const item of items) if (item.state === "merged" && item.headSha) heads.push({
		sha: item.headSha.toLowerCase(),
		...item.baseRef ? { baseRef: item.baseRef } : {},
		...item.mergeCommitSha ? { mergeCommitSha: item.mergeCommitSha.toLowerCase() } : {}
	});
	return heads;
}
async function fetchBranchPullRequests(context, read) {
	const head = `${context.owner}:${context.branch}`;
	let items = parsePullList(await read.request(pullsByHeadUrl(context.owner, context.repo, head, read.apiBaseUrl)), read.host);
	if (items.length === 0) {
		const parent = resolveGitHubForkParent(await read.request(sessionPullRequestRepositoryApiUrl({
			...context,
			apiBaseUrl: read.apiBaseUrl
		})));
		if (parent) items = parsePullList(await read.request(pullsByHeadUrl(parent.owner, parent.repo, head, read.apiBaseUrl)), read.host);
	}
	const mergedHeads = mergedHeadsOf(items);
	const isActive = (item) => item.state === "open" || item.state === "draft";
	const workingBranchHasLivePullRequest = items.some(isActive);
	const capped = items.toSorted((left, right) => Number(isActive(right)) - Number(isActive(left))).slice(0, MAX_PULL_REQUESTS);
	const branchOf = (item) => item.branch ?? context.branch ?? "";
	const publicationCandidates = items.map((item) => stateOnlyPullRequestChip(item, branchOf(item)));
	let pullRequests;
	let rateLimited = false;
	try {
		pullRequests = await Promise.all(capped.map((item) => finishPullRequest(item, branchOf(item), read)));
	} catch (error) {
		if (!(error instanceof gitHubPublicApi.ControlUiGitHubError && error.statusCode === 429)) throw error;
		pullRequests = capped.map((item) => stateOnlyPullRequestChip(item, branchOf(item)));
		rateLimited = true;
	}
	return {
		pullRequests,
		rateLimited,
		publicationCandidates,
		mergedHeads,
		workingBranchHasLivePullRequest
	};
}
async function refreshBranchPullRequests(context, read, entry) {
	const repository = {
		owner: context.owner,
		repo: context.repo
	};
	try {
		const result = {
			...await fetchBranchPullRequests(context, read),
			repository
		};
		if (result.rateLimited) {
			entry.expiresAt = Date.now() + RATE_LIMIT_CACHE_MS;
			if (entry.lastGood) {
				const identity = (item) => `${item.owner}/${item.repo}#${item.number}`.toLowerCase();
				const retained = new Map(entry.lastGood.pullRequests.map((item) => [identity(item), item]));
				result.pullRequests = [...result.pullRequests.map((item) => {
					const previous = retained.get(identity(item));
					retained.delete(identity(item));
					return previous && item.state === previous.state && item.headSha === previous.headSha && (item.state === "open" || item.state === "draft") ? {
						...previous,
						...item
					} : item;
				}), ...retained.values()].slice(0, MAX_PULL_REQUESTS);
			}
		}
		entry.lastGood = {
			pullRequests: result.pullRequests,
			publicationCandidates: result.publicationCandidates,
			mergedHeads: result.mergedHeads,
			workingBranchHasLivePullRequest: result.workingBranchHasLivePullRequest,
			repository
		};
		return result;
	} catch (error) {
		read.assertCurrent();
		const rateLimited = error instanceof gitHubPublicApi.ControlUiGitHubError && error.statusCode === 429;
		entry.expiresAt = Date.now() + (rateLimited ? RATE_LIMIT_CACHE_MS : FAILURE_CACHE_MS);
		if (rateLimited) return {
			pullRequests: [],
			publicationCandidates: [],
			mergedHeads: [],
			workingBranchHasLivePullRequest: false,
			...entry.lastGood,
			repository,
			rateLimited: true
		};
		if (entry.lastGood) return {
			...entry.lastGood,
			rateLimited: false,
			status: "unavailable"
		};
		throw error;
	}
}
async function loadControlUiSessionPullRequests(params, deps) {
	const { target, assertCurrent, projection } = deps.read;
	try {
		assertCurrent();
		const request = {
			...params,
			...target.params
		};
		let context;
		if (deps.resolveGitContext) context = await deps.resolveGitContext(request);
		else {
			const source = deps.resolveGitRoot ? await deps.resolveGitRoot(request) : target.source;
			context = typeof source === "string" ? await runGitReadOperation({
				type: "checkout.context",
				input: {
					root: source,
					githubHost: deps.read.target.githubHost
				}
			}, { refresh: request.refresh }) : source;
		}
		assertCurrent();
		if (!context) {
			branchCache.release(deps.cacheSignal);
			return {
				pullRequests: [],
				rateLimited: false
			};
		}
		if (!context.branch || context.branch === context.defaultBranch) {
			branchCache.release(deps.cacheSignal);
			return {
				pullRequests: [],
				repository: {
					owner: context.owner,
					repo: context.repo
				},
				rateLimited: false
			};
		}
		const result = await cachedBranchPullRequests(context, deps, request.refresh === true, JSON.stringify([target.identity, deps.read.sourceIdentity])).catch(() => null);
		assertCurrent();
		if (!result) return {
			pullRequests: [],
			repository: {
				owner: context.owner,
				repo: context.repo
			},
			rateLimited: false,
			status: "unavailable"
		};
		const { publicationCandidates, mergedHeads, workingBranchHasLivePullRequest, ...snapshot } = result;
		const branch = projection === "publication" || workingBranchHasLivePullRequest ? void 0 : await resolveSessionBranch(context, mergedHeads, request.refresh === true);
		assertCurrent();
		return {
			...snapshot,
			pullRequests: projection === "publication" ? publicationCandidates : snapshot.pullRequests,
			...branch ? { branch } : {}
		};
	} catch (error) {
		branchCache.release(deps.cacheSignal);
		throw error;
	}
}
function trackBranchRefresh(entry, mode, load) {
	entry.expiresAt = Date.now() + SUCCESS_CACHE_MS;
	entry.refreshMode = mode;
	const trackedPromise = load().finally(() => {
		if (entry.promise === trackedPromise) entry.refreshMode = null;
	});
	entry.promise = trackedPromise;
	return trackedPromise;
}
async function cachedBranchPullRequests(context, deps, refresh, sessionIdentity) {
	let read;
	try {
		read = prepareSessionPullRequestGitHubRead(context.host ?? "github.com", deps.fetchImpl ?? fetch, deps.read.assertCurrent);
	} catch (error) {
		branchCache.release(deps.cacheSignal);
		throw error;
	}
	const { cacheScope } = read;
	const key = JSON.stringify([
		read.host,
		read.apiBaseUrl,
		context.owner.toLowerCase(),
		context.repo.toLowerCase(),
		context.branch,
		sessionIdentity,
		cacheScope
	]);
	const entry = branchCache.get(key, deps.cacheSignal) ?? {
		access: createGitHubReadGroup(),
		expiresAt: 0,
		promise: Promise.resolve({
			pullRequests: [],
			publicationCandidates: [],
			rateLimited: false,
			mergedHeads: [],
			workingBranchHasLivePullRequest: false
		}),
		refreshMode: null
	};
	const reusable = entry.expiresAt > Date.now() && !entry.access.signal.aborted;
	if (entry.access.signal.aborted) entry.access = createGitHubReadGroup();
	const release = entry.access.add(read.assertCurrent, deps.cacheSignal);
	const transportRead = prepareSessionPullRequestGitHubRead(read.host, deps.fetchImpl ?? fetch, entry.access.assertCurrent, { signal: entry.access.signal });
	try {
		if (reusable) {
			branchCache.set(key, entry, deps.cacheSignal);
			if (!refresh || entry.refreshMode === "forced") return await racePromiseWithAbortSignal(entry.promise, deps.cacheSignal);
			const pendingSnapshot = entry.promise;
			const pendingRefreshMode = entry.refreshMode;
			const pendingExpiresAt = entry.expiresAt;
			return await racePromiseWithAbortSignal(trackBranchRefresh(entry, "forced", async () => {
				const snapshot = await pendingSnapshot;
				transportRead.assertCurrent();
				if (snapshot.rateLimited) {
					if (pendingRefreshMode === null) entry.expiresAt = pendingExpiresAt;
					return snapshot;
				}
				return refreshBranchPullRequests(context, transportRead, entry);
			}), deps.cacheSignal);
		}
		const promise = trackBranchRefresh(entry, refresh ? "forced" : "normal", () => refreshBranchPullRequests(context, transportRead, entry));
		branchCache.set(key, entry, deps.cacheSignal);
		return await racePromiseWithAbortSignal(promise, deps.cacheSignal);
	} finally {
		release();
		read.assertCurrent();
	}
}
//#endregion
export { parsePullListItem as n, createRetainedCache as r, loadControlUiSessionPullRequests as t };
