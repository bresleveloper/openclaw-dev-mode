import { r as createRetainedCache } from "./git-read-cache-D-dVASTK.mjs";
import { n as gitHubPublicApi } from "./github-public-api-GYcLjPMx.mjs";
import { i as sessionPullRequestRepositoryApiUrl, n as parsePullListItem, r as fetchSessionPullRequestCheckDetails } from "./control-ui-session-prs-DeTsUoNk.mjs";
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
	const credential = gitHubPublicApi.resolveGitHubApiCredentialScope();
	const assertCurrent = () => {
		deps.assertCurrent();
		if (gitHubPublicApi.resolveGitHubApiCredentialScope().cacheScope !== credential.cacheScope) throw new gitHubPublicApi.ControlUiGitHubError(409, "GitHub identity changed; reopen CI details");
	};
	const { loadPullRequests } = deps;
	const snapshot = await loadPullRequests({
		sessionKey: params.sessionKey,
		agentId: params.agentId
	}, { fetchImpl: deps.fetchImpl });
	assertCurrent();
	const pull = snapshot.pullRequests.find((candidate) => candidate.owner.toLowerCase() === owner.toLowerCase() && candidate.repo.toLowerCase() === repo.toLowerCase() && candidate.number === number && candidate.headSha === headSha);
	if (!pull || pull.state !== "open" && pull.state !== "draft") return unavailable("The session pull request or head changed; reopen CI details");
	const key = JSON.stringify([
		deps.sessionScope,
		owner.toLowerCase(),
		repo.toLowerCase(),
		number,
		headSha,
		credential.cacheScope
	]);
	let entry = checkDetailsCache.get(key);
	if (!entry || entry.expiresAt <= Date.now()) {
		if (activeCheckDetails >= MAX_CHECK_DETAIL_REQUESTS) return {
			...unavailable("CI details are busy; retry shortly"),
			retryAfterMs: 5e3
		};
		const previous = entry?.lastGood;
		const pending = {
			expiresAt: Infinity,
			promise: Promise.resolve(unavailable("CI details are loading")),
			lastGood: previous
		};
		activeCheckDetails += 1;
		const fetchImpl = deps.fetchImpl ?? fetch;
		const load = async () => {
			const deadline = Date.now() + 25e3;
			const signal = AbortSignal.timeout(25e3);
			let requests = 0;
			const request = async (url, maxBytes) => {
				if (gitHubPublicApi.resolveGitHubApiCredentialScope().cacheScope !== credential.cacheScope) throw new gitHubPublicApi.ControlUiGitHubError(409, "GitHub identity changed; reopen CI details");
				if (++requests > 64 || Date.now() > deadline) throw new gitHubPublicApi.ControlUiGitHubError(502, "CI details exceeded the request budget; open the job on GitHub");
				return gitHubPublicApi.withOptionalGitHubAuth(credential.token, async (token) => gitHubPublicApi.readGitHubJsonResponse(await gitHubPublicApi.fetchGitHubApi(url, fetchImpl, token, async () => {
					throw new gitHubPublicApi.ControlUiGitHubError(409, "GitHub repository changed; reopen CI details");
				}, void 0, void 0, signal), maxBytes));
			};
			const assertHead = async () => {
				const value = parsePullListItem(await request(`${sessionPullRequestRepositoryApiUrl(target)}/pulls/${number}`));
				if (!value || value.owner.toLowerCase() !== owner.toLowerCase() || value.repo.toLowerCase() !== repo.toLowerCase() || value.number !== number || value.headSha?.toLowerCase() !== headSha || value.state !== "open" && value.state !== "draft") throw new gitHubPublicApi.ControlUiGitHubError(409, "The pull request head changed; reopen CI details");
			};
			try {
				await assertHead();
				const details = await fetchSessionPullRequestCheckDetails(target, request);
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
	const result = await entry.promise;
	assertCurrent();
	const current = await loadPullRequests({
		sessionKey: params.sessionKey,
		agentId: params.agentId
	}, { fetchImpl: deps.fetchImpl });
	assertCurrent();
	if (!current.pullRequests.some((candidate) => candidate.owner.toLowerCase() === owner.toLowerCase() && candidate.repo.toLowerCase() === repo.toLowerCase() && candidate.number === number && candidate.headSha === headSha && (candidate.state === "open" || candidate.state === "draft"))) return unavailable("The session pull request or head changed; reopen CI details");
	return structuredClone({
		...result,
		...result.retryAfterMs === void 0 ? {} : { retryAfterMs: Math.max(0, entry.expiresAt - Date.now()) }
	});
}
//#endregion
export { loadControlUiSessionPullRequestChecks };
