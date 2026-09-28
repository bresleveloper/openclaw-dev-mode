import { i as loadBundledPluginPublicSurfaceModuleSyncCore, n as createLazyFacadeObjectValue } from "./facade-loader-BWw5NpKt.mjs";
import { s as getRuntimeConfigSnapshot } from "./runtime-snapshot-DbgWcCyV.mjs";
import { d as isTrustedSecretSurfaceUnavailableError, n as SecretSurfaceUnavailableError, r as assertSecretOwnerAvailable } from "./runtime-degraded-state-DVMYGogL.mjs";
//#region src/gateway/github-public-api.ts
const CONTROL_UI_GITHUB_CREDENTIAL_UNAVAILABLE_MESSAGE = "The configured Control UI GitHub credential is unavailable. Resolve gateway.controlUi.github.token and retry.";
/** Host credential selection uses canonical config and degradation state. */
function githubApiToken(env = process.env, config = getRuntimeConfigSnapshot()) {
	const configured = config?.gateway?.controlUi?.github?.token;
	if (configured !== void 0) {
		assertSecretOwnerAvailable("capability", "control-ui-github");
		const token = typeof configured === "string" ? configured.trim() : "";
		if (!token) throw new SecretSurfaceUnavailableError({
			ownerKind: "capability",
			ownerId: "control-ui-github",
			state: "unavailable",
			paths: ["gateway.controlUi.github.token"],
			refKeys: [],
			reason: "secret reference was not materialized by the active runtime"
		});
		return token;
	}
	return env.GH_TOKEN?.trim() || env.GITHUB_TOKEN?.trim() || void 0;
}
function hasConfiguredGitHubApiCredential(env, config) {
	return config.gateway?.controlUi?.github?.token !== void 0 || Boolean(env.GH_TOKEN?.trim() || env.GITHUB_TOKEN?.trim());
}
const gitHubPublicApi = createLazyFacadeObjectValue(() => {
	const library = loadBundledPluginPublicSurfaceModuleSyncCore({
		dirName: "github",
		artifactBasename: "api.js"
	});
	const resolveScope = (env = process.env) => {
		const token = githubApiToken(env);
		return {
			token,
			cacheScope: library.githubApiCredentialCacheScope(token)
		};
	};
	const resolveReadIdentity = (identity) => {
		if (identity) return identity;
		const selected = resolveScope();
		const assertSelected = () => {
			if (resolveScope().cacheScope !== selected.cacheScope) throw new library.ControlUiGitHubError(409, "GitHub credential changed; retry the request");
		};
		return {
			...selected,
			optionalAuth: true,
			assertSelected,
			revalidate: async () => assertSelected()
		};
	};
	return {
		...library,
		resolveGitHubApiCredentialScope: resolveScope,
		formatControlUiGitHubPreviewError(error) {
			return isTrustedSecretSurfaceUnavailableError(error) ? {
				message: CONTROL_UI_GITHUB_CREDENTIAL_UNAVAILABLE_MESSAGE,
				retryable: false
			} : library.formatControlUiGitHubPreviewError(error);
		},
		loadControlUiGitHubPreview(target, identity, fetchImpl, refresh) {
			return library.loadControlUiGitHubPreview(target, resolveReadIdentity(identity), fetchImpl, refresh);
		},
		loadGitHubDetail(target, identity, fetchImpl, refresh) {
			return library.loadGitHubDetail(target, resolveReadIdentity(identity), fetchImpl, refresh);
		}
	};
});
//#endregion
export { hasConfiguredGitHubApiCredential as i, gitHubPublicApi as n, githubApiToken as r, CONTROL_UI_GITHUB_CREDENTIAL_UNAVAILABLE_MESSAGE as t };
