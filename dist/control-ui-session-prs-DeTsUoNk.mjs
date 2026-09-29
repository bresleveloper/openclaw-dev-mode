import { s as asFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { a as asOptionalRecord, c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { m as readNonBlankString } from "./string-coerce-CIXf7egm.mjs";
import { r as readAssistantDisplayContent } from "./assistant-display-content-DotKkoz0.mjs";
import { i as loadGatewaySessionEntryReadOnly } from "./session-utils-store-DDuAGjCc.mjs";
import "./session-utils-CJ7A982R.mjs";
import { n as readSessionMessageByIdAsync } from "./session-transcript-readers-Bmg2Zjrq.mjs";
import { n as runGitReadOperation, r as createRetainedCache, t as releaseGitReadCache } from "./git-read-cache-D-dVASTK.mjs";
import { n as gitHubPublicApi } from "./github-public-api-GYcLjPMx.mjs";
import { n as searchSessionTranscripts, t as readSessionTranscriptSearchVersion } from "./session-transcript-search-DqoDj2wt.mjs";
import { t as resolveGitHubForkParent } from "./github-repository-target-Dzw_8VNK.mjs";
//#region src/gateway/control-ui-session-prs-checks.ts
const FAILING_CHECK_CONCLUSIONS = /* @__PURE__ */ new Set([
	"failure",
	"timed_out",
	"cancelled",
	"action_required",
	"startup_failure"
]);
const PAGE_SIZE = 100;
const MAX_PAGES = 10;
const PAGE_BYTES = 1048576;
const MAX_ACTIONS_SUITES = 20;
const MAX_STEPS = 200;
function sessionPullRequestCheckState(status, conclusion) {
	if (typeof conclusion === "string" && FAILING_CHECK_CONCLUSIONS.has(conclusion)) return "failed";
	if (status !== "completed" || conclusion === "stale") return "running";
	return conclusion === "skipped" ? "skipped" : "passed";
}
function sessionPullRequestRepositoryApiUrl(target) {
	return `${gitHubPublicApi.GITHUB_API_ORIGIN}/repos/${encodeURIComponent(target.owner)}/${encodeURIComponent(target.repo)}`;
}
function incomplete() {
	return new gitHubPublicApi.ControlUiGitHubError(502, "GitHub CI details were incomplete or changed while loading");
}
/** One bounded pagination owner serves both the compact rollup and on-demand detail. */
async function fetchSessionPullRequestCheckRuns(target, request) {
	return fetchPages(`${sessionPullRequestRepositoryApiUrl(target)}/commits/${target.headSha}/check-runs?filter=latest`, "check_runs", request);
}
async function fetchPages(url, field, request) {
	const rows = [];
	let expected;
	for (let page = 1; page <= MAX_PAGES; page += 1) {
		const value = await request(`${url}&per_page=${PAGE_SIZE}&page=${page}`, PAGE_BYTES);
		if (!isRecord(value)) throw incomplete();
		const items = value[field];
		const total = value.total_count;
		if (!Array.isArray(items) || items.length > PAGE_SIZE || typeof total !== "number" || !Number.isSafeInteger(total) || total < 0 || total > 1e3 || expected !== void 0 && expected !== total) throw incomplete();
		expected = total;
		for (const item of items) {
			if (!isRecord(item)) throw incomplete();
			rows.push(item);
		}
		if (rows.length === total) return rows;
		if (rows.length > total || items.length < PAGE_SIZE) throw incomplete();
	}
	throw incomplete();
}
async function fetchSessionPullRequestCheckRollup(item, fetchImpl, token) {
	if (!item.headSha || !/^[0-9a-f]{40}$/i.test(item.headSha)) return;
	const runs = await fetchSessionPullRequestCheckRuns({
		...item,
		headSha: item.headSha
	}, (url, maxBytes) => gitHubPublicApi.fetchGitHubJson(url, fetchImpl, token, maxBytes));
	if (runs.length === 0) return;
	const counts = {
		passed: 0,
		failed: 0,
		skipped: 0,
		running: 0
	};
	for (const run of runs) counts[sessionPullRequestCheckState(run.status, run.conclusion)] += 1;
	return {
		state: counts.failed > 0 ? "failing" : counts.running > 0 ? "pending" : "passing",
		...counts
	};
}
function positiveId(value) {
	if (typeof value !== "number" || !Number.isSafeInteger(value) || value <= 0) throw incomplete();
	return value;
}
function text(value, max = 512) {
	const result = readNonBlankString(value);
	if (!result || result.length > max) throw incomplete();
	return result;
}
function timing(value) {
	const timestamp = (raw) => {
		if (raw === null || raw === void 0) return;
		const date = text(raw, 40);
		if (!Number.isFinite(Date.parse(date))) throw incomplete();
		return date;
	};
	return {
		startedAt: timestamp(value.started_at),
		completedAt: timestamp(value.completed_at)
	};
}
function readConclusion(value) {
	return value === null || value === void 0 ? void 0 : text(value, 64);
}
function safeCheckLink(value) {
	if (typeof value !== "string" || value.length > 2048) return;
	try {
		const url = new URL(value);
		return url.protocol === "https:" && !url.username && !url.password ? url.href : void 0;
	} catch {
		return;
	}
}
function parseChecks(rows, target) {
	const ids = /* @__PURE__ */ new Set();
	return rows.map((row) => {
		const id = positiveId(row.id);
		if (ids.has(id) || row.head_sha !== target.headSha) throw incomplete();
		ids.add(id);
		const source = isRecord(row.app) && row.app.slug === "github-actions" ? "actions" : "check";
		const status = text(row.status, 64);
		const result = readConclusion(row.conclusion);
		return {
			check: {
				id,
				name: text(row.name),
				status,
				conclusion: result,
				state: sessionPullRequestCheckState(status, result),
				source,
				detailsUrl: safeCheckLink(row.details_url ?? row.html_url),
				...timing(row)
			},
			...source === "actions" && isRecord(row.check_suite) ? { suiteId: positiveId(row.check_suite.id) } : {}
		};
	});
}
function parseSteps(value) {
	if (!Array.isArray(value) || value.length > MAX_STEPS) throw incomplete();
	const numbers = /* @__PURE__ */ new Set();
	return value.map((step) => {
		if (!isRecord(step)) throw incomplete();
		const number = positiveId(step.number);
		if (numbers.has(number)) throw incomplete();
		numbers.add(number);
		return {
			number,
			name: text(step.name),
			status: text(step.status, 64),
			conclusion: readConclusion(step.conclusion),
			...timing(step)
		};
	}).toSorted((left, right) => left.number - right.number);
}
async function loadSuiteJobs(target, suiteId, checks, request) {
	const base = sessionPullRequestRepositoryApiUrl(target);
	const runs = await fetchPages(`${base}/actions/runs?head_sha=${target.headSha}&check_suite_id=${suiteId}`, "workflow_runs", request);
	if (runs.length !== 1 || runs[0]?.check_suite_id !== suiteId || runs[0]?.head_sha !== target.headSha) throw incomplete();
	const runId = positiveId(runs[0].id);
	const attempt = runs[0].run_attempt === void 0 ? void 0 : positiveId(runs[0].run_attempt);
	const jobs = await fetchPages(`${base}/actions/runs/${runId}/jobs?filter=all`, "jobs", request);
	const wanted = new Map(checks.filter((row) => row.suiteId === suiteId).map(({ check }) => [`${base}/check-runs/${check.id}`.toLowerCase(), check]));
	const result = /* @__PURE__ */ new Map();
	for (const job of jobs) {
		if (job.run_id !== runId || job.head_sha !== target.headSha || job.run_attempt !== void 0 && attempt !== void 0 && positiveId(job.run_attempt) > attempt) throw incomplete();
		const check = typeof job.check_run_url === "string" ? wanted.get(job.check_run_url.toLowerCase()) : void 0;
		if (!check) continue;
		if (result.has(check.id)) throw incomplete();
		const jobId = positiveId(job.id);
		const status = text(job.status, 64);
		const verdict = readConclusion(job.conclusion);
		result.set(check.id, {
			...check,
			status,
			conclusion: verdict,
			state: sessionPullRequestCheckState(status, verdict),
			...timing(job),
			detailsUrl: `https://github.com/${encodeURIComponent(target.owner)}/${encodeURIComponent(target.repo)}/actions/runs/${runId}/job/${jobId}`,
			steps: parseSteps(job.steps ?? [])
		});
	}
	if ([...wanted.values()].some((check) => check.state !== "skipped" && !result.has(check.id))) throw incomplete();
	return result;
}
/** Checks remain useful when Actions permissions, history, or the bounded detail budget fail. */
async function fetchSessionPullRequestCheckDetails(target, request) {
	const rows = parseChecks(await fetchSessionPullRequestCheckRuns(target, request), target);
	const priority = {
		failed: 0,
		running: 1,
		passed: 2,
		skipped: 3
	};
	const orderedRows = rows.toSorted((a, b) => priority[a.check.state] - priority[b.check.state] || a.check.name.localeCompare(b.check.name) || a.check.id - b.check.id);
	const suites = [...new Set(orderedRows.filter(({ check }) => check.source === "actions" && check.state !== "skipped").map(({ suiteId }) => suiteId))];
	let error;
	const details = /* @__PURE__ */ new Map();
	for (const suite of suites.slice(0, MAX_ACTIONS_SUITES)) try {
		if (suite === void 0) throw incomplete();
		const jobs = await loadSuiteJobs(target, suite, rows, request);
		for (const [id, check] of jobs) details.set(id, check);
	} catch (failure) {
		error = failure;
		if (failure instanceof gitHubPublicApi.ControlUiGitHubError && failure.statusCode === 429) break;
	}
	if (suites.length > MAX_ACTIONS_SUITES && !error) error = new gitHubPublicApi.ControlUiGitHubError(502, "Some Actions steps exceeded the CI detail limit; open the job on GitHub");
	if (suites.length > 0 && !error) {
		const latest = parseChecks(await fetchSessionPullRequestCheckRuns(target, request), target);
		const identity = (values) => values.map(({ check, suiteId }) => `${check.id}:${suiteId ?? ""}`).toSorted().join(",");
		if (identity(latest) !== identity(rows)) throw new gitHubPublicApi.ControlUiGitHubError(409, "CI jobs were rerun while loading; reopen CI details");
	}
	return {
		checks: orderedRows.map(({ check }) => details.get(check.id) ?? check).toSorted((a, b) => priority[a.state] - priority[b.state] || a.name.localeCompare(b.name) || a.id - b.id),
		error
	};
}
//#endregion
//#region src/gateway/control-ui-session-pr-references.ts
const GITHUB_URL_CANDIDATE = /https:\/\/github\.com\/[^\s<>()\]}'"`]+/giu;
const MAX_REFERENCES = 3;
const referenceCache = createRetainedCache();
function loadReferenceSession(params) {
	return loadGatewaySessionEntryReadOnly(params.sessionKey, {
		agentId: params.agentId,
		clone: false,
		projection: "list"
	});
}
function referenceSourceKey(loaded) {
	const { entry, agentId, canonicalKey, storePath } = loaded;
	return JSON.stringify([
		agentId,
		canonicalKey,
		storePath,
		entry?.sessionId,
		entry?.lifecycleRevision,
		entry?.repositoryWorkspaceId,
		entry?.worktree?.id,
		entry?.worktree?.branch,
		entry?.spawnedCwd,
		entry?.spawnedWorkspaceDir
	]);
}
function releaseSessionPullRequestReferenceCache(signal) {
	referenceCache.release(signal);
}
function referencedPullRequestNumber(href, repository) {
	try {
		const url = new URL(href.replace(/[.,;:!?]+$/u, ""));
		if (url.protocol !== "https:" || url.hostname !== "github.com" || url.username || url.password || url.port) return;
		const [, owner, repo, kind, number] = url.pathname.split("/");
		if (!owner || !repo || kind !== "pull" || !number || !/^[1-9]\d{0,9}$/u.test(number) || decodeURIComponent(owner).toLowerCase() !== repository.owner.toLowerCase() || decodeURIComponent(repo).toLowerCase() !== repository.repo.toLowerCase()) return;
		return Number(number);
	} catch {
		return;
	}
}
/** References describe this conversation's work; they never grant publication authority. */
async function loadSessionPullRequestReferences(params, repository, cacheSignal) {
	const loaded = loadReferenceSession(params);
	const { entry, agentId, canonicalKey, storePath } = loaded;
	if (!entry?.sessionId || !storePath) {
		referenceCache.release(cacheSignal);
		return [];
	}
	const scope = {
		agentId,
		sessionId: entry.sessionId,
		sessionKey: canonicalKey,
		storePath,
		sessionEntry: { sessionId: entry.sessionId }
	};
	const sourceKey = referenceSourceKey(loaded);
	const key = JSON.stringify([
		sourceKey,
		repository.owner.toLowerCase(),
		repository.repo.toLowerCase()
	]);
	const version = readSessionTranscriptSearchVersion(scope);
	let cached = referenceCache.get(key, cacheSignal);
	if (!cached || cached.version !== version || version === null) {
		const pending = {
			version,
			promise: Promise.resolve().then(async () => {
				const result = await readReferences(scope, repository);
				if (result.indexing) referenceCache.delete(key, pending);
				return result.references;
			}).catch((error) => {
				referenceCache.delete(key, pending);
				throw error;
			})
		};
		if (version !== null) referenceCache.set(key, pending, cacheSignal);
		else referenceCache.release(cacheSignal);
		cached = pending;
	}
	const references = await cached.promise;
	if (referenceSourceKey(loadReferenceSession(params)) !== sourceKey || readSessionTranscriptSearchVersion(scope) !== version) {
		referenceCache.delete(key, cached);
		return [];
	}
	return [...references];
}
async function readReferences(scope, repository) {
	const candidates = await searchSessionTranscripts({
		...scope,
		sessionKeys: [scope.sessionKey],
		role: "assistant",
		query: `https://github.com/${repository.owner}/${repository.repo}/pull`,
		order: "recent",
		limit: 25
	});
	if (candidates.indexing && candidates.hits.length === 0) throw new Error("Session pull request references are waiting for transcript indexing");
	const references = /* @__PURE__ */ new Set();
	let remainingBytes = 131072;
	for (const candidate of candidates.hits) {
		if (remainingBytes <= 0 || references.size === MAX_REFERENCES) break;
		const result = await readSessionMessageByIdAsync(scope, candidate.messageId, {
			currentOnly: true,
			maxBytes: remainingBytes
		});
		remainingBytes -= result.serializedBytes ?? 0;
		const record = asOptionalRecord(result.message);
		if (record?.role !== "assistant") continue;
		const blocks = readAssistantDisplayContent(record);
		const texts = !Array.isArray(record.openclawDisplayContent) && typeof record.content === "string" ? [record.content] : blocks.flatMap((block) => block.type === "text" && typeof block.text === "string" ? [block.text] : []);
		for (const text of texts.toReversed()) for (const match of Array.from(text.matchAll(GITHUB_URL_CANDIDATE)).toReversed()) {
			const number = referencedPullRequestNumber(match[0], repository);
			if (number !== void 0 && references.size < MAX_REFERENCES) references.add(number);
		}
	}
	return {
		references: [...references],
		indexing: candidates.indexing
	};
}
//#endregion
//#region src/gateway/control-ui-session-prs.ts
const SUCCESS_CACHE_MS = 9e4;
const RATE_LIMIT_CACHE_MS = 3e5;
const FAILURE_CACHE_MS = 3e4;
const MAX_PULL_REQUESTS = 3;
const branchCache = createRetainedCache();
function releaseSessionPullRequestLocalGitCache(signal) {
	releaseGitReadCache("checkout.context", signal);
	releaseGitReadCache("pull-request.branch-facts", signal);
}
/**
* Resolves the GitHub repo + branch, caching detached/default/non-GitHub
* outcomes too so repeated sidebar requests do not respawn the same probes.
*/
async function resolveSessionPullRequestGitContext(params, deps, capturedSource) {
	const source = deps.resolveGitRoot ? await deps.resolveGitRoot(params) : capturedSource;
	if (typeof source !== "string") {
		releaseSessionPullRequestLocalGitCache(deps.cacheSignal);
		return source;
	}
	return runGitReadOperation({
		type: "checkout.context",
		input: { root: source }
	}, {
		refresh: params.refresh === true,
		cacheSignal: deps.cacheSignal
	});
}
function branchCreateUrl(context, branchName) {
	return `https://github.com/${encodeURIComponent(context.owner)}/${encodeURIComponent(context.repo)}/pull/new/${branchName.split("/").map(encodeURIComponent).join("/")}`;
}
async function resolveSessionBranch(context, mergedHeads, deps, refresh) {
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
	}, {
		refresh,
		cacheSignal: deps.cacheSignal
	});
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
function parsePullList(value) {
	if (!Array.isArray(value)) return [];
	return value.map(parsePullListItem).filter((item) => item !== null);
}
function pullsByHeadUrl(owner, repo, head) {
	const encOwner = encodeURIComponent(owner);
	const encRepo = encodeURIComponent(repo);
	const encHead = encodeURIComponent(head);
	return `${gitHubPublicApi.GITHUB_API_ORIGIN}/repos/${encOwner}/${encRepo}/pulls?head=${encHead}&state=all&sort=updated&direction=desc&per_page=5`;
}
async function fetchParentRepo(owner, repo, fetchImpl, token) {
	const url = `${gitHubPublicApi.GITHUB_API_ORIGIN}/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
	const value = await gitHubPublicApi.fetchGitHubJson(url, fetchImpl, token);
	return resolveGitHubForkParent(value) ?? null;
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
async function finishPullRequest(item, branch, fetchImpl, token, knownDetails) {
	const chip = stateOnlyPullRequestChip(item, branch);
	if (item.state !== "open" && item.state !== "draft") return chip;
	const detailUrl = `${gitHubPublicApi.GITHUB_API_ORIGIN}/repos/${encodeURIComponent(item.owner)}/${encodeURIComponent(item.repo)}/pulls/${item.number}`;
	const [details, checks] = await Promise.all([knownDetails ?? gitHubPublicApi.fetchGitHubJson(detailUrl, fetchImpl, token).catch(rethrowRateLimit), fetchSessionPullRequestCheckRollup(item, fetchImpl, token).catch(rethrowRateLimit)]);
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
async function fetchBranchPullRequests(context, fetchImpl, token, references) {
	const head = `${context.owner}:${context.branch}`;
	const hasWorkingBranch = Boolean(context.branch && context.branch !== context.defaultBranch);
	let items = hasWorkingBranch ? parsePullList(await gitHubPublicApi.fetchGitHubJson(pullsByHeadUrl(context.owner, context.repo, head), fetchImpl, token)) : [];
	if (hasWorkingBranch && items.length === 0) {
		const parent = await fetchParentRepo(context.owner, context.repo, fetchImpl, token);
		if (parent) items = parsePullList(await gitHubPublicApi.fetchGitHubJson(pullsByHeadUrl(parent.owner, parent.repo, head), fetchImpl, token));
	}
	const mergedHeads = mergedHeadsOf(items);
	const workingBranchHasLivePullRequest = items.some((item) => item.state === "open" || item.state === "draft");
	const knownDetails = /* @__PURE__ */ new Map();
	const referenced = [];
	let rateLimited = false;
	let referencesIncomplete = false;
	for (const number of references) {
		const existing = items.find((item) => item.number === number && item.owner.toLowerCase() === context.owner.toLowerCase() && item.repo.toLowerCase() === context.repo.toLowerCase());
		if (existing) {
			referenced.push(existing);
			continue;
		}
		const url = `${gitHubPublicApi.GITHUB_API_ORIGIN}/repos/${encodeURIComponent(context.owner)}/${encodeURIComponent(context.repo)}/pulls/${number}`;
		let details;
		try {
			details = await gitHubPublicApi.fetchGitHubJson(url, fetchImpl, token);
		} catch (error) {
			if (error instanceof gitHubPublicApi.ControlUiGitHubError && error.statusCode === 404) continue;
			if (error instanceof gitHubPublicApi.ControlUiGitHubError && error.statusCode === 429) {
				rateLimited = true;
				break;
			}
			if (items.length > 0 || referenced.length > 0) {
				referencesIncomplete = true;
				break;
			}
			throw error;
		}
		const item = parsePullListItem(details);
		if (item?.branch && isRecord(details)) {
			referenced.push(item);
			knownDetails.set(item, details);
		}
	}
	const isActive = (item) => item.state === "open" || item.state === "draft";
	const capped = [.../* @__PURE__ */ new Set([
		...items.filter(isActive),
		...referenced,
		...items
	])].toSorted((left, right) => Number(isActive(right)) - Number(isActive(left))).slice(0, MAX_PULL_REQUESTS);
	const branchOf = (item) => item.branch ?? context.branch ?? "";
	const stateOnlySnapshot = () => ({
		pullRequests: capped.map((item) => stateOnlyPullRequestChip(item, branchOf(item))),
		rateLimited: true,
		mergedHeads,
		workingBranchHasLivePullRequest
	});
	if (rateLimited) return stateOnlySnapshot();
	try {
		return {
			pullRequests: await Promise.all(capped.map((item) => finishPullRequest(item, branchOf(item), fetchImpl, token, knownDetails.get(item)))),
			rateLimited: false,
			mergedHeads,
			workingBranchHasLivePullRequest,
			referencesIncomplete
		};
	} catch (error) {
		if (!(error instanceof gitHubPublicApi.ControlUiGitHubError && error.statusCode === 429)) throw error;
		return stateOnlySnapshot();
	}
}
async function refreshBranchPullRequests(context, fetchImpl, entry, token, references) {
	const repository = {
		owner: context.owner,
		repo: context.repo
	};
	try {
		const result = {
			...await fetchBranchPullRequests(context, fetchImpl, token, references),
			repository
		};
		if (result.rateLimited || result.referencesIncomplete) {
			entry.expiresAt = Date.now() + (result.rateLimited ? RATE_LIMIT_CACHE_MS : FAILURE_CACHE_MS);
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
			mergedHeads: result.mergedHeads,
			workingBranchHasLivePullRequest: result.workingBranchHasLivePullRequest,
			repository
		};
		return result;
	} catch (error) {
		const rateLimited = error instanceof gitHubPublicApi.ControlUiGitHubError && error.statusCode === 429;
		entry.expiresAt = Date.now() + (rateLimited ? RATE_LIMIT_CACHE_MS : FAILURE_CACHE_MS);
		if (rateLimited) return {
			pullRequests: [],
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
	const { target, assertCurrent } = deps.read;
	try {
		assertCurrent();
		const request = {
			...params,
			...target.params
		};
		const context = deps.resolveGitContext ? await deps.resolveGitContext(request) : await resolveSessionPullRequestGitContext(request, deps, target.source);
		assertCurrent();
		if (!context) {
			releaseGitReadCache("pull-request.branch-facts", deps.cacheSignal);
			branchCache.release(deps.cacheSignal);
			releaseSessionPullRequestReferenceCache(deps.cacheSignal);
			return {
				pullRequests: [],
				rateLimited: false
			};
		}
		let referencesUnavailable = false;
		const references = await loadSessionPullRequestReferences(request, context, deps.cacheSignal).catch(() => {
			referencesUnavailable = true;
		});
		assertCurrent();
		if ((!context.branch || context.branch === context.defaultBranch) && references?.length === 0) {
			releaseGitReadCache("pull-request.branch-facts", deps.cacheSignal);
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
		const result = await cachedBranchPullRequests(context, deps, request.refresh === true, references, JSON.stringify([target.identity, deps.read.sourceIdentity])).catch(() => {
			releaseGitReadCache("pull-request.branch-facts", deps.cacheSignal);
			return null;
		});
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
		const { mergedHeads, workingBranchHasLivePullRequest, referencesIncomplete, ...snapshot } = result;
		const branch = workingBranchHasLivePullRequest ? void 0 : await resolveSessionBranch(context, mergedHeads, deps, request.refresh === true);
		assertCurrent();
		return {
			...snapshot,
			...branch ? { branch } : {},
			...referencesIncomplete || referencesUnavailable && (!context.branch || context.branch === context.defaultBranch) && snapshot.pullRequests.length === 0 ? { status: "unavailable" } : {}
		};
	} catch (error) {
		releaseSessionPullRequestLocalGitCache(deps.cacheSignal);
		branchCache.release(deps.cacheSignal);
		releaseSessionPullRequestReferenceCache(deps.cacheSignal);
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
async function cachedBranchPullRequests(context, deps, refresh, requestedReferences, sessionIdentity) {
	let identity;
	try {
		identity = gitHubPublicApi.resolveGitHubApiCredentialScope();
	} catch (error) {
		branchCache.release(deps.cacheSignal);
		throw error;
	}
	const { token, cacheScope } = identity;
	const key = JSON.stringify([
		context.owner.toLowerCase(),
		context.repo.toLowerCase(),
		context.branch,
		sessionIdentity,
		cacheScope
	]);
	const cached = branchCache.get(key, deps.cacheSignal);
	const references = requestedReferences ?? cached?.references ?? [];
	const referenceSignature = references.join(",");
	const referencesChanged = cached !== void 0 && cached.referenceSignature !== referenceSignature;
	const forceRefresh = refresh || referencesChanged;
	if (cached && cached.expiresAt > Date.now()) {
		branchCache.set(key, cached, deps.cacheSignal);
		if (!forceRefresh || cached.refreshMode === "forced" && !referencesChanged) return cached.promise;
		const pendingSnapshot = cached.promise;
		const pendingRefreshMode = cached.refreshMode;
		const pendingExpiresAt = cached.expiresAt;
		cached.references = references;
		cached.referenceSignature = referenceSignature;
		return trackBranchRefresh(cached, "forced", async () => {
			const snapshot = await pendingSnapshot;
			if (snapshot.rateLimited) {
				if (pendingRefreshMode === null) cached.expiresAt = pendingExpiresAt;
				return snapshot;
			}
			return refreshBranchPullRequests(context, deps.fetchImpl ?? fetch, cached, token, references);
		});
	}
	const entry = cached ?? {
		expiresAt: 0,
		promise: Promise.resolve({
			pullRequests: [],
			rateLimited: false,
			mergedHeads: [],
			workingBranchHasLivePullRequest: false
		}),
		refreshMode: null,
		references,
		referenceSignature
	};
	entry.references = references;
	entry.referenceSignature = referenceSignature;
	const promise = trackBranchRefresh(entry, forceRefresh ? "forced" : "normal", () => refreshBranchPullRequests(context, deps.fetchImpl ?? fetch, entry, token, references));
	branchCache.set(key, entry, deps.cacheSignal);
	return promise;
}
//#endregion
export { sessionPullRequestRepositoryApiUrl as i, parsePullListItem as n, fetchSessionPullRequestCheckDetails as r, loadControlUiSessionPullRequests as t };
