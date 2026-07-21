import { l as normalizeStringEntries } from "./string-normalization-CRyoFBPt.js";
import { t as findGitRoot } from "./git-root-B5CYl5JZ.js";
import { a as resolveUserTimezone, i as resolveUserTimeFormat, n as formatUserTime } from "./date-time-CcWivhrg.js";
import fs from "node:fs";
import path from "node:path";
//#region src/agents/system-prompt-params.ts
/**
* System prompt runtime parameter resolver.
*
* Collects repository, time, timezone, channel, shell, and active-process facts for prompt rendering.
*/
function buildSystemPromptParams(params) {
	const repoRoot = resolveRepoRoot({
		config: params.config,
		workspaceDir: params.workspaceDir,
		cwd: params.cwd
	});
	const userTimezone = resolveUserTimezone(params.config?.agents?.defaults?.userTimezone);
	const userTimeFormat = resolveUserTimeFormat(params.config?.agents?.defaults?.timeFormat);
	const userTime = formatUserTime(/* @__PURE__ */ new Date(), userTimezone, userTimeFormat);
	return {
		runtimeInfo: {
			agentId: params.agentId,
			...params.runtime,
			repoRoot
		},
		userTimezone,
		userTime,
		userTimeFormat
	};
}
function resolveRepoRoot(params) {
	const configured = params.config?.agents?.defaults?.repoRoot?.trim();
	if (configured) try {
		const resolved = path.resolve(configured);
		if (fs.statSync(resolved).isDirectory()) return resolved;
	} catch {}
	const candidates = normalizeStringEntries([params.workspaceDir ?? "", params.cwd ?? ""]);
	const seen = /* @__PURE__ */ new Set();
	for (const candidate of candidates) {
		const resolved = path.resolve(candidate);
		if (seen.has(resolved)) continue;
		seen.add(resolved);
		const root = findGitRoot(resolved);
		if (root) return root;
	}
}
//#endregion
export { buildSystemPromptParams as t };
