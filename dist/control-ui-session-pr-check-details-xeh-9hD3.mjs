import { n as gitHubPublicApi } from "./github-public-api-COOMiXSo.mjs";
import { n as parsePullListItem, r as createRetainedCache } from "./control-ui-session-prs-CziBMgfX.mjs";
import { n as prepareSessionPullRequestGitHubRead, t as createGitHubReadGroup } from "./control-ui-session-pr-request-BTQOuS8L.mjs";
import { r as sessionPullRequestRepositoryApiUrl, t as fetchSessionPullRequestCheckDetails } from "./control-ui-session-prs-checks-Bb10Gvfh.mjs";
//#region src/gateway/control-ui-session-pr-check-details.ts
const checkDetailsCache = createRetainedCache();
let activeCheckDetails = 0;
const CHECK_DETAILS_CACHE_MS = 3e4;
const MAX_CHECK_DETAIL_REQUESTS = 4;
/** The only details admission path: clients select a PR already resolved for this session. */
async function loadControlUiSessionPullRequestChecks(params, deps) {
	const { owner, repo, number, headSha } = params;
	const target = {
		owner,
		repo,
		number,
		headSha
	};
	const unavailable = (error) => ({
		...target,
		checks: [],
		status: "unavailable",
		rateLimited: false,
		error
	});
	deps.assertCurrent();
	const matchesTarget = (candidate) => candidate.owner.toLowerCase() === owner.toLowerCase() && candidate.repo.toLowerCase() === repo.toLowerCase() && candidate.number === number && candidate.headSha === headSha;
	const { loadPullRequests } = deps;
	const snapshot = await loadPullRequests({
		sessionKey: params.sessionKey,
		agentId: params.agentId
	}, { fetchImpl: deps.fetchImpl });
	deps.assertCurrent();
	const pull = snapshot.pullRequests.find(matchesTarget);
	if (!pull || pull.state !== "open" && pull.state !== "draft") return unavailable("The session pull request or head changed; reopen CI details");
	const host = new URL(pull.url).hostname;
	const read = prepareSessionPullRequestGitHubRead(host, deps.fetchImpl ?? fetch, deps.assertCurrent);
	const assertCurrent = read.assertCurrent;
	const checkTarget = {
		...target,
		host,
		apiBaseUrl: read.apiBaseUrl
	};
	const key = JSON.stringify([
		deps.sessionScope,
		host,
		read.apiBaseUrl,
		owner.toLowerCase(),
		repo.toLowerCase(),
		number,
		headSha,
		read.cacheScope
	]);
	let entry = checkDetailsCache.get(key);
	let releaseReader;
	if (!entry || entry.expiresAt <= Date.now() || entry.access.signal.aborted) {
		if (activeCheckDetails >= MAX_CHECK_DETAIL_REQUESTS) return {
			...unavailable("CI details are busy; retry shortly"),
			retryAfterMs: 5e3
		};
		const previous = entry?.lastGood;
		const pending = {
			expiresAt: Infinity,
			promise: Promise.resolve(unavailable("CI details are loading")),
			lastGood: previous,
			access: createGitHubReadGroup()
		};
		releaseReader = pending.access.add(deps.assertCurrent);
		const transportRead = prepareSessionPullRequestGitHubRead(host, deps.fetchImpl ?? fetch, pending.access.assertCurrent, { signal: pending.access.signal });
		activeCheckDetails += 1;
		const load = async () => {
			const deadline = Date.now() + 25e3;
			const signal = AbortSignal.timeout(25e3);
			let requests = 0;
			const request = async (url, maxBytes) => {
				transportRead.assertCurrent();
				if (++requests > 64 || Date.now() > deadline) throw new gitHubPublicApi.ControlUiGitHubError(502, "CI details exceeded the request budget; open the job on GitHub");
				return transportRead.request(url, maxBytes, signal, async () => {
					throw new gitHubPublicApi.ControlUiGitHubError(409, "GitHub repository changed; reopen CI details");
				});
			};
			const assertHead = async () => {
				const value = parsePullListItem(await request(`${sessionPullRequestRepositoryApiUrl(checkTarget)}/pulls/${number}`));
				if (!value || value.owner.toLowerCase() !== owner.toLowerCase() || value.repo.toLowerCase() !== repo.toLowerCase() || new URL(value.url).hostname !== host || value.number !== number || value.headSha?.toLowerCase() !== headSha || value.state !== "open" && value.state !== "draft") throw new gitHubPublicApi.ControlUiGitHubError(409, "The pull request head changed; reopen CI details");
			};
			try {
				await assertHead();
				const details = await fetchSessionPullRequestCheckDetails(checkTarget, request);
				if (!(details.error instanceof gitHubPublicApi.ControlUiGitHubError && details.error.statusCode === 429)) await assertHead();
				const result = {
					...target,
					checks: details.checks,
					status: details.error ? "stale" : "ready",
					rateLimited: false
				};
				if (Buffer.byteLength(JSON.stringify(result), "utf8") > 524288) throw new gitHubPublicApi.ControlUiGitHubError(502, "CI details exceeded the response limit; open the job on GitHub");
				if (details.error) {
					const formatted = gitHubPublicApi.formatControlUiGitHubPreviewError(details.error);
					result.error = formatted.message;
					result.rateLimited = details.error instanceof gitHubPublicApi.ControlUiGitHubError && details.error.statusCode === 429;
					result.retryAfterMs = formatted.retryAfterMs;
				}
				pending.lastGood = result;
				return result;
			} catch (error) {
				const formatted = gitHubPublicApi.formatControlUiGitHubPreviewError(error);
				const changed = error instanceof gitHubPublicApi.ControlUiGitHubError && error.statusCode === 409;
				const rateLimited = error instanceof gitHubPublicApi.ControlUiGitHubError && error.statusCode === 429;
				const retain = !changed && previous && error instanceof gitHubPublicApi.ControlUiGitHubError && (error.retryable || error.statusCode === 502);
				if (!retain) pending.lastGood = void 0;
				return {
					...target,
					checks: retain ? previous.checks : [],
					status: retain ? "stale" : "unavailable",
					rateLimited,
					error: changed ? error.message : formatted.message,
					retryAfterMs: formatted.retryAfterMs
				};
			}
		};
		pending.promise = load().then((result) => {
			pending.expiresAt = Date.now() + Math.max(CHECK_DETAILS_CACHE_MS, result.retryAfterMs ?? 0);
			return result;
		}).finally(() => {
			activeCheckDetails -= 1;
		});
		checkDetailsCache.set(key, pending);
		entry = pending;
	}
	const release = releaseReader ?? entry.access.add(deps.assertCurrent);
	try {
		const result = await entry.promise;
		assertCurrent();
		const current = await loadPullRequests({
			sessionKey: params.sessionKey,
			agentId: params.agentId
		}, { fetchImpl: deps.fetchImpl });
		assertCurrent();
		if (!current.pullRequests.some((candidate) => matchesTarget(candidate) && new URL(candidate.url).hostname === host && (candidate.state === "open" || candidate.state === "draft"))) return unavailable("The session pull request or head changed; reopen CI details");
		return structuredClone({
			...result,
			...result.retryAfterMs === void 0 ? {} : { retryAfterMs: Math.max(0, entry.expiresAt - Date.now()) }
		});
	} finally {
		release();
	}
}
//#endregion
export { loadControlUiSessionPullRequestChecks };
