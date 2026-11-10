import { a as asOptionalRecord } from "../../record-coerce-TIsquoVR.mjs";
import { _ as resolveSecretInputString } from "../../types.secrets-Dgbd2kyP.mjs";
import { r as createRuntimeConfigReader } from "../../runtime-snapshot-BBYDJbw9.mjs";
import "../../string-coerce-runtime-BbIJhy7G.mjs";
import "../../secret-input-CHX7JVid.mjs";
import "../../runtime-config-snapshot-kTPhBdOK.mjs";
import { i as resolveXAccount, n as listXRuntimeAccountIds } from "../../accounts-n2C-ky3w.mjs";
import { i as openXAllowlist } from "../../allowlist-Bk-oAvxJ.mjs";
import { a as XBudgetExceededError, l as fetchXService, t as getXApi } from "../../client-D9-Q5PGR.mjs";
import { r as syncXGitHub, t as emptyXGitHubSnapshot } from "../../verified-github-BdaHOdSe.mjs";
//#region extensions/x/src/github.ts
var XGitHubError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "XGitHubError";
	}
};
const PERMISSION_RANK = {
	push: 1,
	maintain: 2,
	admin: 3
};
const LOGIN_PATTERN = /^[a-z\d][a-z\d_-]*$/i;
function xHandle(value) {
	if (typeof value !== "string") return;
	let handle = value.trim();
	if (/^https?:\/\//i.test(handle)) try {
		const url = new URL(handle);
		if (![
			"x.com",
			"twitter.com",
			"www.x.com",
			"www.twitter.com"
		].includes(url.hostname) || url.username || url.password || url.port || url.search || url.hash) return;
		handle = url.pathname.replace(/^\//, "").replace(/\/$/, "");
	} catch {
		return;
	}
	handle = handle.replace(/^@/, "");
	return /^[a-z\d_]{1,15}$/i.test(handle) ? handle.toLowerCase() : void 0;
}
function invalidResponse() {
	throw new XGitHubError("GitHub returned an invalid response; the last verified set is unchanged.");
}
function retryDeadline(response) {
	const now = Date.now();
	const retry = response.headers.get("retry-after");
	const seconds = retry === null ? NaN : Number(retry);
	const deadlines = [retry === null ? NaN : Number.isFinite(seconds) ? now + seconds * 1e3 : Date.parse(retry), Number(response.headers.get("x-ratelimit-reset")) * 1e3].filter((value) => Number.isFinite(value) && value > now);
	return deadlines.length ? Math.max(...deadlines) : void 0;
}
function createXGitHubReader(options) {
	const profiles = /* @__PURE__ */ new Map();
	let retryAt = 0;
	function rateLimited() {
		throw new XGitHubError(`GitHub rate limit reached; retry after ${new Date(retryAt).toISOString()}.`);
	}
	async function request(path, parse, signal, cached) {
		if (Date.now() < retryAt) rateLimited();
		if (!options.token.trim()) throw new XGitHubError("Configure verifiedFromGitHub.token with a GitHub credential that can list repository collaborators.");
		const requestSignal = signal ? AbortSignal.any([signal, AbortSignal.timeout(3e4)]) : AbortSignal.timeout(3e4);
		const headers = {
			Accept: "application/vnd.github+json",
			Authorization: `Bearer ${options.token}`,
			"X-GitHub-Api-Version": "2022-11-28"
		};
		if (cached?.etag) headers["If-None-Match"] = cached.etag;
		const init = {
			method: "GET",
			headers,
			signal: requestSignal,
			redirect: "error"
		};
		let response;
		try {
			requestSignal.throwIfAborted();
			response = await fetchXService("api.github.com", path, init, options.fetch);
		} catch {
			throw new XGitHubError("GitHub request failed or was cancelled; the last verified set is unchanged.");
		}
		const exhausted = response.headers.get("x-ratelimit-remaining") === "0";
		if (exhausted) retryAt = retryDeadline(response) ?? Date.now() + 6e4;
		if (response.status === 304) {
			await response.body?.cancel();
			return cached ?? invalidResponse();
		}
		let body;
		try {
			const { readResponseWithLimit } = await import("../../plugin-sdk/response-limit-runtime.js");
			const bytes = await readResponseWithLimit(response, 2e6, {
				signal: requestSignal,
				timeoutMs: 3e4
			});
			body = JSON.parse(bytes.toString());
		} catch {
			if (response.ok) invalidResponse();
		}
		if (!response.ok) {
			const message = asOptionalRecord(body)?.message;
			if (response.status === 429 || response.status === 403 && (exhausted || response.headers.has("retry-after") || typeof message === "string" && /secondary rate limit|abuse detection/i.test(message))) {
				retryAt = retryDeadline(response) ?? Date.now() + 6e4;
				rateLimited();
			}
			if ([
				401,
				403,
				404
			].includes(response.status) && path.startsWith("/repos/")) throw new XGitHubError(`GitHub cannot list repository collaborators (HTTP ${response.status}); check the repository and verifiedFromGitHub.token access and permissions.`);
			throw new XGitHubError(`GitHub request failed (HTTP ${response.status}); check verifiedFromGitHub.token and retry.`);
		}
		return {
			etag: response.headers.get("etag") ?? void 0,
			value: parse(body)
		};
	}
	return { async readCollaborators(repo, minPermission, signal) {
		const [owner, repository, extra] = repo.split("/");
		if (!owner || !LOGIN_PATTERN.test(owner) || !repository || !/^[a-z\d_.-]{1,100}$/i.test(repository) || [".", ".."].includes(repository) || extra !== void 0) throw new XGitHubError("verifiedFromGitHub.repo must be owner/name.");
		const collaborators = /* @__PURE__ */ new Map();
		for (let page = 1;; page++) {
			const { value: rows } = await request(`/repos/${repo}/collaborators?affiliation=all&per_page=100&page=${page}`, (body) => {
				if (!Array.isArray(body) || body.length > 100) invalidResponse();
				return body.map((value) => {
					const row = asOptionalRecord(value);
					const permissions = asOptionalRecord(row?.permissions);
					if (typeof row?.login !== "string" || !LOGIN_PATTERN.test(row.login) || typeof row.id !== "number" || !Number.isSafeInteger(row.id) || row.id <= 0 || !permissions || typeof permissions.push !== "boolean" || [permissions.maintain, permissions.admin].some((flag) => flag !== void 0 && typeof flag !== "boolean")) invalidResponse();
					const permission = permissions.admin ? "admin" : permissions.maintain ? "maintain" : permissions.push ? "push" : void 0;
					return {
						githubLogin: row.login,
						githubId: row.id,
						permission
					};
				});
			}, signal);
			for (const row of rows) if (row.permission && PERMISSION_RANK[row.permission] >= PERMISSION_RANK[minPermission]) collaborators.set(row.githubLogin.toLowerCase(), {
				githubLogin: row.githubLogin,
				githubId: row.githubId,
				permission: row.permission
			});
			if (rows.length < 100) break;
		}
		for (const login of profiles.keys()) if (!collaborators.has(login)) profiles.delete(login);
		const result = [];
		for (const [login, collaborator] of collaborators) {
			const previous = profiles.get(login);
			const cache = previous?.githubId === collaborator.githubId ? previous : { githubId: collaborator.githubId };
			profiles.set(login, cache);
			cache.profile = await request(`/users/${encodeURIComponent(login)}`, (body) => {
				const row = asOptionalRecord(body);
				if (typeof row?.login !== "string" || row.login.toLowerCase() !== login || row.id !== collaborator.githubId || row.twitter_username !== null && row.twitter_username !== void 0 && typeof row.twitter_username !== "string") invalidResponse();
				const handle = xHandle(row.twitter_username);
				return handle ? [handle] : [];
			}, signal, cache.profile);
			cache.social = await request(`/users/${encodeURIComponent(login)}/social_accounts`, (body) => {
				if (!Array.isArray(body)) invalidResponse();
				return body.flatMap((value) => {
					const row = asOptionalRecord(value);
					if (!row || typeof row.provider !== "string" || typeof row.url !== "string") invalidResponse();
					const handle = row.provider.toLowerCase() === "twitter" || /^https?:\/\/(?:www\.)?(?:x|twitter)\.com\//i.test(row.url) ? xHandle(row.url) : void 0;
					return handle ? [handle] : [];
				});
			}, signal, cache.social);
			result.push({
				githubLogin: collaborator.githubLogin,
				permission: collaborator.permission,
				xHandles: [.../* @__PURE__ */ new Set([...cache.profile.value, ...cache.social.value])]
			});
		}
		return result;
	} };
}
//#endregion
//#region extensions/x/src/verified-github-service.ts
function createXGitHubService(api) {
	let activeAccounts = [];
	return {
		id: "x-verified-github",
		apiVersion: 2,
		reload: { configPrefixes: ["channels.x"] },
		start(context) {
			const readConfig = createRuntimeConfigReader(context.config);
			const cfg = readConfig();
			const allowlist = openXAllowlist(api.runtime);
			activeAccounts = listXRuntimeAccountIds(cfg);
			for (const accountId of activeAccounts) {
				allowlist.invalidate(accountId);
				const account = resolveXAccount(cfg, accountId);
				const settings = account.config.verifiedFromGitHub;
				if (!account.enabled || !account.configured || !settings?.repo) continue;
				const capturedConfig = JSON.stringify(account.config);
				const assertCurrent = () => {
					context.scheduler.signal.throwIfAborted();
					if (JSON.stringify(resolveXAccount(readConfig(), accountId).config) !== capturedConfig) throw new Error("X GitHub verification configuration changed");
				};
				let github;
				let failed = false;
				context.scheduler.schedule({
					id: accountId,
					delayMs: 0,
					everyMs: (settings.refreshMinutes ?? 60) * 6e4,
					run: async () => {
						try {
							assertCurrent();
							const token = resolveSecretInputString({
								value: settings.token,
								defaults: cfg.secrets?.defaults,
								path: `channels.x.accounts.${accountId}.verifiedFromGitHub.token`,
								mode: "strict"
							}).value;
							if (!token) throw new XGitHubError("Configure verifiedFromGitHub.token with a GitHub credential that can list repository collaborators.");
							github ??= createXGitHubReader({ token });
							await syncXGitHub({
								runtime: api.runtime,
								account,
								github,
								getApi: () => getXApi(accountId, readConfig()),
								signal: context.scheduler.signal,
								assertCurrent
							});
							failed = false;
						} catch (error) {
							if (context.scheduler.signal.aborted) return;
							assertCurrent();
							const message = error instanceof XGitHubError || error instanceof XBudgetExceededError ? error.message : "GitHub verification failed; check the configured credentials and Gateway logs. If X token refresh failed, reauthorize the X account. The last verified set is unchanged.";
							if (!failed) {
								context.logger.warn(`X GitHub verification (${accountId}): ${message}`);
								failed = true;
							}
							const previous = await allowlist.readGitHub(accountId, settings);
							await allowlist.replaceGitHub(accountId, {
								...previous ?? emptyXGitHubSnapshot(account),
								stale: true,
								message
							}, assertCurrent);
						}
					}
				});
			}
		},
		stop() {
			const allowlist = openXAllowlist(api.runtime);
			for (const accountId of activeAccounts) allowlist.invalidate(accountId);
			activeAccounts = [];
		}
	};
}
//#endregion
export { createXGitHubService };
