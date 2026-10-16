import { d as normalizeStringEntries } from "./string-normalization-CECOqf64.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { i as findGitRoot } from "./git-commit-eT_9FBYG.mjs";
import { T as parseCronRunScopeSuffix } from "./session-key-C09ow4h0.mjs";
import { n as resolveAgentIdentity } from "./identity-uzCeiPuC.mjs";
import { i as resolveControlUiSessionUrl } from "./control-ui-link-base-Dz9JPCN-.mjs";
import { o as resolveUserTimezone, r as formatDateStamp } from "./date-time-DNFKWNdt.mjs";
import { i as getCurrentActiveNodeContext, n as formatActiveNodeContextLabel, r as getActiveNodeIdentityScope } from "./active-node-context-DpQMef3G.mjs";
import { n as sanitizeForPromptLiteral } from "./sanitize-for-prompt-bzCyHFCH.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/agents/system-prompt-params.ts
/**
* System prompt runtime parameter resolver.
*
* Collects repository, time, timezone, channel, and shell facts for prompt rendering.
*/
const MAX_RUNTIME_AGENT_NAME_CHARS = 128;
const MAX_RUNTIME_SESSION_URL_CHARS = 512;
function buildSystemPromptParams(params) {
	const repoRoot = Object.hasOwn(params, "preparedRepoRoot") ? params.preparedRepoRoot ?? void 0 : resolveSystemPromptRepoRoot(params);
	const userTimezone = resolveUserTimezone(params.config?.agents?.defaults?.userTimezone);
	const userDate = formatDateStamp(Date.now(), userTimezone);
	const { runId } = parseCronRunScopeSuffix(params.runtime.sessionKey);
	const sessionUrl = runId === void 0 ? resolveControlUiSessionUrl(params.config, {
		sessionKey: params.runtime.sessionKey,
		fallbackAgentId: params.agentId,
		exactKey: true
	}) : void 0;
	return {
		runtimeInfo: {
			agentId: params.agentId,
			agentName: params.config && params.agentId ? resolveRuntimeAgentName(params.config, params.agentId) : void 0,
			...params.runtime,
			gitCoauthorPrompt: params.preparedGitCoauthorPrompt ?? void 0,
			sessionUrl: sessionUrl?.startsWith("https://") && sessionUrl.length <= MAX_RUNTIME_SESSION_URL_CHARS ? sessionUrl : void 0,
			activeNode: formatActiveNodeContextLabel(getCurrentActiveNodeContext(params.requesterProfileId)),
			activeNodeIdentity: getActiveNodeIdentityScope(params.requesterProfileId),
			repoRoot
		},
		userTimezone,
		userDate
	};
}
function resolveRuntimeAgentName(config, agentId) {
	const name = sanitizeForPromptLiteral(resolveAgentIdentity(config, agentId)?.name ?? "").trim();
	const bounded = truncateUtf16Safe(name, MAX_RUNTIME_AGENT_NAME_CHARS).trimEnd();
	return bounded && bounded !== agentId ? bounded : void 0;
}
function resolveSystemPromptRepoRoot(params) {
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
export { resolveRuntimeAgentName as n, resolveSystemPromptRepoRoot as r, buildSystemPromptParams as t };
