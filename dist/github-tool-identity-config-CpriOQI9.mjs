import { o as resolveExecutablePath, t as clearExecutablePathCache } from "./executable-path-CP2HPhgU.mjs";
import { v as resolveMutableAgentEntry } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as unsetConfigValueAtPath } from "./config-paths-Bb7WEbv8.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { n as mutateConfigFileWithRetry } from "./mutate-BkuP-9_H.mjs";
import "./config-9720xhC5.mjs";
import { s as matchesAgentLifecycleBinding } from "./agent-lifecycle-registry-kGv3atS9.mjs";
import { t as applyAgentConfig } from "./agents.config-CEaxMlw1.mjs";
import { isDeepStrictEqual } from "node:util";
//#region src/gateway/github-cli-preflight.ts
const GITHUB_CLI_REQUIRED_MESSAGE = "GitHub CLI (`gh`) is required on the Gateway host. Install it and retry.";
var GitHubCliUnavailableError = class extends Error {
	constructor() {
		super(GITHUB_CLI_REQUIRED_MESSAGE);
		this.name = "GitHubCliUnavailableError";
	}
};
function assertGitHubCliAvailable(env = process.env) {
	clearExecutablePathCache();
	if (!resolveExecutablePath("gh", { env })) throw new GitHubCliUnavailableError();
}
//#endregion
//#region src/gateway/github-tool-identity-config.ts
async function updateGitHubToolIdentityConfig(params) {
	return (await mutateConfigFileWithRetry({
		afterWrite: { mode: "auto" },
		mutate: (draft) => {
			if (params.scope === "system") {
				if (params.expectedIdentity !== void 0 && !isDeepStrictEqual(draft.tools?.github ?? null, params.expectedIdentity)) throw new Error("GitHub identity changed while setup was in progress.");
				draft.tools ??= {};
				if (params.identity) draft.tools.github = params.identity;
				else unsetConfigValueAtPath(draft, ["tools", "github"]);
				return;
			}
			if (params.agentLifecycleBinding && !matchesAgentLifecycleBinding(draft, params.agentLifecycleBinding)) throw new Error("Agent changed while GitHub setup was in progress.");
			let entry = resolveMutableAgentEntry(draft, params.agentId);
			if (params.agentLifecycleBinding && !entry) throw new Error("Agent changed while GitHub setup was in progress.");
			if (params.expectedIdentity !== void 0 && !isDeepStrictEqual(entry?.tools?.github ?? null, params.expectedIdentity)) throw new Error("GitHub identity changed while setup was in progress.");
			if (!entry && params.identity && !params.agentLifecycleBinding) {
				Object.assign(draft, applyAgentConfig(draft, { agentId: params.agentId }));
				entry = resolveMutableAgentEntry(draft, params.agentId);
			}
			if (!entry) return;
			entry.tools ??= {};
			if (params.identity) entry.tools.github = entry.tools.github?.allowInSandbox === void 0 ? params.identity : {
				...params.identity,
				allowInSandbox: entry.tools.github.allowInSandbox
			};
			else unsetConfigValueAtPath(entry, ["tools", "github"]);
		}
	})).nextConfig;
}
//#endregion
export { GitHubCliUnavailableError as n, assertGitHubCliAvailable as r, updateGitHubToolIdentityConfig as t };
