import { t as LruCache } from "./lru-cache-C3Xgvc4Q.mjs";
import { n as parseGitUrl } from "./cloud-worker-project-profiles-BBHoT-EM.mjs";
import { i as runCommandWithTimeout } from "./exec-Bf6uhUA7.mjs";
import { s as prepareEmbeddedSessionActiveProjectKeys } from "./session-prompt-state-tij27tsD.mjs";
import { r as resolveSystemPromptRepoRoot } from "./system-prompt-params-CL2E6h7b.mjs";
import path from "node:path";
//#region src/agents/project-memory-scope.ts
const MAX_PROJECT_KEY_CACHE_ENTRIES = 128;
const GIT_CONFIG_TIMEOUT_MS = 4e3;
const projectKeyByRepoRoot = new LruCache(MAX_PROJECT_KEY_CACHE_ENTRIES);
function escapeProjectKeyForAnnotation(value) {
	return value.replaceAll("%", "%25").replaceAll(";", "%3b").replaceAll("<", "%3c").replaceAll(">", "%3e").replaceAll("\r", "%0d").replaceAll("\n", "%0a");
}
async function resolveUncachedProjectKey(repoRoot) {
	try {
		const result = await runCommandWithTimeout([
			"git",
			"-C",
			repoRoot,
			"config",
			"--get",
			"remote.origin.url"
		], {
			timeoutMs: GIT_CONFIG_TIMEOUT_MS,
			env: { GIT_NO_LAZY_FETCH: "1" }
		});
		if (result.code === 0) {
			const source = parseGitUrl(`git:${result.stdout.trim()}`);
			if (source) return escapeProjectKeyForAnnotation(`${source.host.toLowerCase()}/${source.path}`);
		}
	} catch {}
	return `path:${escapeProjectKeyForAnnotation(repoRoot)}`;
}
/** Resolve one stable repository identity without spawning Git again for the same root. */
function resolveProjectKey(repoRoot) {
	const canonicalRoot = path.resolve(repoRoot);
	const cached = projectKeyByRepoRoot.get(canonicalRoot);
	if (cached) return cached;
	const pending = resolveUncachedProjectKey(canonicalRoot);
	projectKeyByRepoRoot.set(canonicalRoot, pending);
	return pending;
}
//#endregion
//#region src/agents/prompt-projects.ts
async function prepareAgentPromptProjects(params) {
	const repoRoot = resolveSystemPromptRepoRoot(params) ?? null;
	const projectKey = repoRoot ? await resolveProjectKey(repoRoot) : null;
	return {
		repoRoot,
		projectKey,
		activeProjectKeys: prepareEmbeddedSessionActiveProjectKeys(params.sessionId, projectKey)
	};
}
//#endregion
export { prepareAgentPromptProjects as t };
