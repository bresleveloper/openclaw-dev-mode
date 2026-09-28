import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { l as resolveAgentIdFromSessionKey } from "./session-key-CBvmC8zz.mjs";
import { t as DEFAULT_AGENT_WORKSPACE_DIR } from "./workspace-default-hMJcajDi.mjs";
import { T as SANDBOX_STATE_DIR } from "./constants-D1dHTp_E.mjs";
import { t as hashTextSha256 } from "./hash-DZK-8tRm.mjs";
import { n as resolveMaterializedSandboxSkillsWorkspaceDir } from "./workspace-mounts-COSMZIQN.mjs";
import path from "node:path";
//#region src/agents/sandbox/shared.ts
/**
* Shared sandbox naming and scope helpers.
*
* Produces stable session slugs, workspace directories, and registry scope keys.
*/
const WORKSPACE_SCOPE_SUFFIX_RE = /:workspace:[a-f0-9]{32}$/i;
const WORKSPACE_RUNTIME_SLUG_RE = /^workspace-[a-f0-9]{32}$/i;
/** Converts an arbitrary session key into a bounded filesystem/container-safe slug. */
function slugifySessionKey(value) {
	const trimmed = value.trim() || "session";
	if (WORKSPACE_SCOPE_SUFFIX_RE.test(trimmed)) return `workspace-${hashTextSha256(trimmed).slice(0, 32)}`;
	const hash = hashTextSha256(trimmed).slice(0, 8);
	return `${normalizeLowercaseStringOrEmpty(trimmed).replace(/[^a-z0-9._-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 32) || "session"}-${hash}`;
}
/** Builds a bounded Docker name without truncating the scope-identity slug. */
function buildSandboxContainerName(prefix, slug) {
	const maxLength = 63;
	const fullName = `${prefix}${slug}`;
	if (fullName.length <= maxLength) return fullName;
	if (WORKSPACE_RUNTIME_SLUG_RE.test(slug)) {
		const identitySuffix = `-${slug}-${hashTextSha256(fullName).slice(0, 12)}`;
		const prefixBudget = maxLength - identitySuffix.length;
		return `${prefix.slice(0, prefixBudget)}${identitySuffix}`;
	}
	const identitySuffix = `-${hashTextSha256(fullName).slice(0, 12)}`;
	return `${fullName.slice(0, maxLength - identitySuffix.length)}${identitySuffix}`;
}
/** Resolves the per-session sandbox workspace directory under the configured sandbox root. */
function resolveSandboxWorkspaceDir(root, sessionKey) {
	const resolvedRoot = resolveUserPath(root);
	const slug = slugifySessionKey(sessionKey);
	return path.join(resolvedRoot, slug);
}
/** Resolves workspace-qualified registry identity for non-shared sandbox lifetimes. */
function resolveSandboxScopeKey(scope, sessionKey, workspaceDir, agentId, isolationSubject) {
	const trimmed = sessionKey.trim() || "main";
	if (scope === "shared" && !isolationSubject) return "shared";
	const workspaceSuffix = `:workspace:${hashTextSha256(resolveUserPath(workspaceDir)).slice(0, 32)}`;
	if (isolationSubject) return `agent:${agentId ? normalizeAgentId(agentId) : resolveAgentIdFromSessionKey(trimmed)}:${isolationSubject.kind === "profile" ? `principal:${hashTextSha256(isolationSubject.profileId).slice(0, 32)}` : `required-session:${hashTextSha256(isolationSubject.sessionKey).slice(0, 32)}`}${workspaceSuffix}`;
	if (scope === "session") return `${trimmed}${workspaceSuffix}`;
	return `agent:${agentId ? normalizeAgentId(agentId) : resolveAgentIdFromSessionKey(trimmed)}${workspaceSuffix}`;
}
/** Extracts the agent id represented by a sandbox scope key, when one exists. */
function resolveSandboxAgentId(scopeKey) {
	const trimmed = scopeKey.trim();
	if (!trimmed || trimmed === "shared") return;
	const parts = trimmed.split(":").filter(Boolean);
	if (parts[0] === "agent" && parts[1]) return normalizeAgentId(parts[1]);
	return resolveAgentIdFromSessionKey(trimmed);
}
/** Resolves the host-side workspace paths shared by diagnostics and runtime setup. */
function resolveSandboxWorkspaceLayoutPaths(params) {
	const agentWorkspaceDir = resolveUserPath(params.workspaceDir?.trim() || DEFAULT_AGENT_WORKSPACE_DIR);
	const workspaceRoot = resolveUserPath(params.cfg.workspaceRoot);
	const scopeKey = resolveSandboxScopeKey(params.cfg.scope, params.rawSessionKey, agentWorkspaceDir, params.agentId, params.isolationSubject);
	const sandboxWorkspaceDir = params.cfg.scope === "shared" && !params.isolationSubject ? workspaceRoot : resolveSandboxWorkspaceDir(workspaceRoot, scopeKey);
	const workspaceDir = params.cfg.workspaceAccess === "rw" ? agentWorkspaceDir : sandboxWorkspaceDir;
	const materializedSkillsRoot = resolveSandboxWorkspaceDir(path.join(SANDBOX_STATE_DIR, "skills-workspaces"), scopeKey);
	return {
		agentWorkspaceDir,
		scopeKey,
		sandboxWorkspaceDir,
		skillsWorkspaceDir: params.cfg.workspaceAccess === "rw" ? resolveMaterializedSandboxSkillsWorkspaceDir(materializedSkillsRoot) : sandboxWorkspaceDir,
		workspaceDir,
		workspaceSource: params.cfg.workspaceAccess === "rw" ? "agent" : "sandbox"
	};
}
//#endregion
export { slugifySessionKey as i, resolveSandboxAgentId as n, resolveSandboxWorkspaceLayoutPaths as r, buildSandboxContainerName as t };
