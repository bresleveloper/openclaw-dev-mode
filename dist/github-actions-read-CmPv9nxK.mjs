import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { Fn as object, Jn as string, Nt as array, Pn as number } from "./schemas-BOYIvvln.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { r as BoardValidationError } from "./board-layout-6DyK3jbx.mjs";
import { a as resolveGitHubActionsRequest } from "./github-actions-capability-GqhkMZRM.mjs";
import { o as getActiveSecretsRuntimeConfigSnapshot } from "./runtime-state-CtZtwiOt.mjs";
import { r as BoardGatewayUnavailableError } from "./board-view-ticket-Be8nmToj.mjs";
import { N as GitHubIdentityError, c as prepareGitHubReadIdentity } from "./github-tool-identity-BOF32-1s.mjs";
import { r as requestCurrentGitHubOAuthRefresh } from "./github-oauth-lifecycle-B8jl-6oa.mjs";
import { n as gitHubPublicApi } from "./github-public-api-GYcLjPMx.mjs";
//#region src/gateway/github-actions-read.ts
const CACHE_TTL_MS = 3e4;
const CACHE_LIMIT = 32;
const MAX_CONCURRENT_READS = 32;
const ACTIONS_MAX_RESPONSE_BYTES = 1048576;
const integer = number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
const shortText = string().max(256);
const timestamp = string().max(40).datetime({ offset: true });
const runsSchema = object({
	total_count: integer,
	workflow_runs: array(object({
		id: integer,
		name: shortText.nullable(),
		display_title: string().max(1024),
		head_branch: shortText.nullable(),
		status: shortText.nullable(),
		conclusion: shortText.nullable(),
		html_url: string().max(2048).url(),
		run_started_at: timestamp.nullable(),
		created_at: timestamp,
		updated_at: timestamp,
		event: shortText,
		workflow_id: integer,
		run_attempt: integer
	})).max(30)
});
const gatewayCaches = /* @__PURE__ */ new WeakMap();
function actionsFailure(error) {
	if (error instanceof BoardValidationError || error instanceof BoardGatewayUnavailableError || error instanceof GitHubIdentityError) return error;
	if (error instanceof gitHubPublicApi.ControlUiGitHubError) {
		if (error.statusCode === 429) return /* @__PURE__ */ new Error("GitHub Actions is rate limited; wait and retry.");
		if (error.statusCode === 401) return /* @__PURE__ */ new Error("GitHub Actions authentication expired; reconnect the agent's GitHub identity in Settings.");
		if (error.statusCode === 403 || error.statusCode === 404) return /* @__PURE__ */ new Error("GitHub Actions access denied or repository unavailable; check the repository and the selected agent identity's Actions read permission.");
	}
	return /* @__PURE__ */ new Error("GitHub Actions request failed or exceeded its response limit; retry with a smaller perPage or check GitHub availability.");
}
/** Pinning and reads share the same source-config scrub, refresh, and current credential check. */
async function prepareBoardGitHubIdentity(context, authority) {
	try {
		const config = context.getRuntimeConfig();
		return await prepareGitHubReadIdentity({
			config,
			sourceConfig: getActiveSecretsRuntimeConfigSnapshot()?.sourceConfig ?? config,
			agentId: authority.boardSession.agentId,
			getCurrentConfig: () => context.getRuntimeConfig(),
			assertActive: authority.assertActive,
			startActive: authority.useCurrent,
			refresh: () => requestCurrentGitHubOAuthRefresh(authority.boardSession.agentId)
		});
	} catch (error) {
		if (error instanceof GitHubIdentityError || error instanceof BoardValidationError || error instanceof BoardGatewayUnavailableError) throw error;
		throw new GitHubIdentityError("unverified");
	}
}
async function readBoardGitHubActions(params, context, authority, publish) {
	const request = resolveGitHubActionsRequest(params);
	const cache = await authority.useCurrent(() => {
		const admitted = gatewayCaches.get(context) ?? {
			active: 0,
			values: /* @__PURE__ */ new Map(),
			pending: /* @__PURE__ */ new Map()
		};
		gatewayCaches.set(context, admitted);
		if (admitted.active >= MAX_CONCURRENT_READS) throw new Error("GitHub Actions reads are busy; retry shortly.");
		admitted.active += 1;
		return admitted;
	});
	try {
		const identity = await prepareBoardGitHubIdentity(context, authority);
		const key = JSON.stringify([
			authority.boardSession,
			identity.cacheScope,
			request.url
		]);
		const result = await identity.start(() => {
			const cached = cache.values.get(key);
			if (cached && cached.expiresAt > Date.now()) return structuredClone(cached.value);
			cache.values.delete(key);
			return getOrCreatePromise(cache.pending, key, async () => {
				const response = await gitHubPublicApi.fetchGitHubApi(request.url, fetch, identity.token, async () => {
					throw new BoardValidationError("invalid_operation", "GitHub Actions redirected the request; verify the repository/workflow, update the widget grant if needed, and retry.");
				});
				const raw = await gitHubPublicApi.readGitHubJsonResponse(response, ACTIONS_MAX_RESPONSE_BYTES);
				const parsed = runsSchema.safeParse(raw);
				if (!parsed.success || parsed.data.workflow_runs.length > request.perPage || JSON.stringify(parsed.data).includes(identity.token)) throw new Error("Invalid Actions response");
				for (const run of parsed.data.workflow_runs) {
					const url = new URL(run.html_url);
					if (url.origin !== "https://github.com" || url.username || url.password || url.search || url.hash || url.pathname.toLowerCase() !== `/${request.repository}/actions/runs/${run.id}`) throw new Error("Invalid Actions run URL");
				}
				cache.values.set(key, {
					value: parsed.data,
					expiresAt: Date.now() + CACHE_TTL_MS
				});
				pruneMapToMaxSize(cache.values, CACHE_LIMIT);
				return parsed.data;
			}, { evictOnSettled: true });
		});
		await identity.start(() => publish(true, structuredClone(result)));
	} catch (error) {
		throw actionsFailure(error);
	} finally {
		cache.active -= 1;
	}
}
//#endregion
export { prepareBoardGitHubIdentity, readBoardGitHubActions };
