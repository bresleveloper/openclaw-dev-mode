import { o as getRuntimeConfigSnapshot } from "./runtime-snapshot-DYptB0Cf.mjs";
import { i as loadBundledPluginPublicSurfaceModuleSyncCore, n as createLazyFacadeObjectValue } from "./facade-loader-B-X-HqBc.mjs";
import { d as isTrustedSecretSurfaceUnavailableError, n as SecretSurfaceUnavailableError, r as assertSecretOwnerAvailable } from "./runtime-degraded-state-oevwKU3u.mjs";
import { i as resolveConfiguredGitHubHost, r as resolveConfiguredGitHubApiBaseUrl } from "./github-host-CaivEi-a.mjs";
//#region src/gateway/github-public-api.ts
const CONTROL_UI_GITHUB_CREDENTIAL_UNAVAILABLE_MESSAGE = "The configured Control UI GitHub credential is unavailable. Check gateway.controlUi.github.token and its host binding, then retry.";
/** Host credential selection uses canonical config and degradation state. */
function githubApiToken(env = process.env, config = getRuntimeConfigSnapshot(), host) {
	const selectedHost = host ?? resolveConfiguredGitHubHost(config);
	const configured = config?.gateway?.controlUi?.github?.token;
	const credentialHost = config?.gateway?.controlUi?.github?.host?.trim().toLowerCase() || "github.com";
	if (configured !== void 0 && (host === void 0 || credentialHost === selectedHost)) {
		if (credentialHost !== selectedHost) throw new SecretSurfaceUnavailableError({
			ownerKind: "capability",
			ownerId: "control-ui-github",
			state: "unavailable",
			paths: ["gateway.controlUi.github.host"],
			refKeys: [],
			reason: "service credential host does not match gateway.github.host"
		});
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
	return selectedHost === "github.com" ? env.GH_TOKEN?.trim() || env.GITHUB_TOKEN?.trim() || void 0 : void 0;
}
function hasConfiguredGitHubApiCredential(env, config) {
	return config.gateway?.controlUi?.github?.token !== void 0 && (config.gateway.controlUi.github.host?.trim().toLowerCase() || "github.com") === resolveConfiguredGitHubHost(config) || resolveConfiguredGitHubHost(config) === "github.com" && Boolean(env.GH_TOKEN?.trim() || env.GITHUB_TOKEN?.trim());
}
const gitHubPublicApi = createLazyFacadeObjectValue(() => {
	const library = loadBundledPluginPublicSurfaceModuleSyncCore({
		dirName: "github",
		artifactBasename: "api.js"
	});
	const resolveScope = (env = process.env, host) => {
		const config = getRuntimeConfigSnapshot();
		const configuredHost = resolveConfiguredGitHubHost(config);
		const selectedHost = host ?? configuredHost;
		if (selectedHost !== configuredHost && selectedHost !== "github.com") throw new library.ControlUiGitHubError(409, "Repository GitHub host changed; restore its configuration and retry");
		const apiBaseUrl = selectedHost === configuredHost ? resolveConfiguredGitHubApiBaseUrl(config) : "https://api.github.com";
		const token = selectedHost === configuredHost ? githubApiToken(env, config) : void 0;
		return {
			token,
			apiBaseUrl,
			cacheScope: `${selectedHost}:${apiBaseUrl}:${library.githubApiCredentialCacheScope(token)}`
		};
	};
	const resolvePublicScope = () => resolveConfiguredGitHubHost(getRuntimeConfigSnapshot()) === "github.com" ? resolveScope() : {
		token: void 0,
		cacheScope: "public:anonymous"
	};
	const resolveReadIdentity = (identity) => {
		if (identity) return resolveConfiguredGitHubHost(getRuntimeConfigSnapshot()) === "github.com" ? identity : {
			...identity,
			token: void 0,
			cacheScope: "public:anonymous"
		};
		const selected = resolvePublicScope();
		const assertSelected = () => {
			if (resolvePublicScope().cacheScope !== selected.cacheScope) throw new library.ControlUiGitHubError(409, "GitHub credential changed; retry the request");
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
		get GITHUB_API_BASE_URL() {
			return resolveConfiguredGitHubApiBaseUrl(getRuntimeConfigSnapshot());
		},
		get GITHUB_GRAPHQL_URL() {
			return library.resolveGitHubApiUrls(getRuntimeConfigSnapshot()?.gateway?.github?.apiBaseUrl).graphqlUrl;
		},
		fetchGitHubApi(...args) {
			args[8] ??= resolveConfiguredGitHubApiBaseUrl(getRuntimeConfigSnapshot());
			return library.fetchGitHubApi(...args);
		},
		fetchGitHubJson(...args) {
			args[4] ??= resolveConfiguredGitHubApiBaseUrl(getRuntimeConfigSnapshot());
			return library.fetchGitHubJson(...args);
		},
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
