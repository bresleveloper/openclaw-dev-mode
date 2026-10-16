import { n as gitHubPublicApi } from "./github-public-api-COOMiXSo.mjs";
//#region src/gateway/control-ui-session-pr-request.ts
/** Shared I/O survives one reader's retirement while each reader owns its delivery. */
function createGitHubReadGroup() {
	const readers = /* @__PURE__ */ new Set();
	const abort = new AbortController();
	const assertCurrent = () => {
		abort.signal.throwIfAborted();
		let failure = new gitHubPublicApi.ControlUiGitHubError(409, "GitHub read has no active reader");
		for (const assertReader of readers) try {
			assertReader();
			return;
		} catch (error) {
			failure = error;
		}
		abort.abort(failure);
		throw failure;
	};
	return {
		signal: abort.signal,
		assertCurrent,
		add(assertReader, signal) {
			const reader = () => {
				signal?.throwIfAborted();
				assertReader();
			};
			reader();
			readers.add(reader);
			const release = () => {
				readers.delete(reader);
				signal?.removeEventListener("abort", onAbort);
			};
			const onAbort = () => {
				release();
				try {
					assertCurrent();
				} catch {}
			};
			signal?.addEventListener("abort", onAbort, { once: true });
			return release;
		}
	};
}
/** Session reads pin the admitted host, endpoint and credential across every auxiliary request. */
function prepareSessionPullRequestGitHubRead(host, fetchImpl, assertAccess, options = {}) {
	const optionalAuth = options.optionalAuth !== false;
	const selected = gitHubPublicApi.resolveGitHubApiCredentialScope(void 0, host);
	const assertCurrent = () => {
		assertAccess();
		if (gitHubPublicApi.resolveGitHubApiCredentialScope(void 0, host).cacheScope !== selected.cacheScope) throw new gitHubPublicApi.ControlUiGitHubError(409, "GitHub identity changed; reopen the session pull request");
	};
	const identity = {
		assertSelected: assertCurrent,
		revalidate: async () => assertCurrent()
	};
	return {
		...selected,
		host,
		assertCurrent,
		async request(url, maxBytes, signal, beforeRedirect) {
			assertCurrent();
			const sourceSignals = [signal, options.signal].filter((value) => Boolean(value));
			const requestSignal = sourceSignals.length > 1 ? AbortSignal.any(sourceSignals) : sourceSignals[0];
			const readJson = async (token) => gitHubPublicApi.readGitHubJsonResponse(await gitHubPublicApi.fetchGitHubApi(url, fetchImpl, token, beforeRedirect, identity, void 0, requestSignal, void 0, selected.apiBaseUrl), maxBytes);
			const value = optionalAuth ? await gitHubPublicApi.withOptionalGitHubAuth(selected.token, readJson) : await readJson(selected.token);
			assertCurrent();
			return value;
		}
	};
}
//#endregion
export { prepareSessionPullRequestGitHubRead as n, createGitHubReadGroup as t };
