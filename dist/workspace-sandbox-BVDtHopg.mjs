import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { y as resolveSessionAgentIds } from "./agent-scope-CTuYDtny.mjs";
import { f as resolveAdmittedRunActiveAssertion } from "./admitted-run-context-BNasoszr.mjs";
import { n as resolveEffectiveToolFsWorkspaceOnly } from "./tool-fs-policy-DkN5in9o.mjs";
import { n as resolveSandboxContext } from "./context-CiLAV5T3.mjs";
import "./sandbox-BnX1IPPh.mjs";
import fs from "node:fs/promises";
//#region src/agents/workspace-sandbox.ts
function assertSandboxCwd(requestedCwd, workspaceDir) {
	if (requestedCwd && requestedCwd !== workspaceDir) throw new Error("cwd override is not supported for sandboxed embedded agent runs; omit cwd or use the agent workspace as cwd");
}
/** Preserve prepared local projection roots without overriding a remote placement owner. */
function resolveHarnessWorkspace(workspaceDir, params, prepared, sandbox) {
	const projected = prepared?.sandbox?.workspaceSource === "managed-worktree" && prepared.sandbox === sandbox;
	if (projected) assertSandboxCwd(params.cwd ? resolveUserPath(params.cwd) : void 0, prepared.resolvedWorkspace);
	return {
		workspaceDir: projected ? prepared.effectiveWorkspace : workspaceDir,
		cwd: projected ? prepared.effectiveCwd : params.cwd,
		sessionRoot: projected ? prepared.sessionPermissionRoot : params.sessionRoot
	};
}
/** Resolves the shared workspace and sandbox policy used by native and plugin harnesses. */
async function resolveAttemptWorkspaceSandbox(params) {
	const assertCurrent = params.admittedRunContext ? resolveAdmittedRunActiveAssertion(params.admittedRunContext) : void 0;
	if (params.admittedRunContext && !assertCurrent) throw new Error("Sandbox preparation requires an active admitted run");
	assertCurrent?.();
	const { sessionAgentId } = resolveSessionAgentIds({
		sessionKey: params.sessionKey,
		config: params.config,
		agentId: params.agentId
	});
	const resolvedWorkspace = resolveUserPath(params.workspaceDir);
	await fs.mkdir(resolvedWorkspace, { recursive: true });
	const sessionKey = params.sessionKey?.trim() || params.sessionId;
	const sandboxSessionKey = params.sandboxSessionKey?.trim() || sessionKey;
	const sandbox = params.placementSandbox ? null : await resolveSandboxContext({
		config: params.config,
		agentId: params.sandboxAgentId ?? (sandboxSessionKey === sessionKey ? sessionAgentId : void 0),
		execOverrides: params.execOverrides,
		sessionKey: sandboxSessionKey,
		skillsSnapshot: params.skillsSnapshot,
		workspaceDir: resolvedWorkspace,
		assertCurrent
	});
	assertCurrent?.();
	const projectedWorkspace = sandbox?.enabled && sandbox.workspaceSource === "managed-worktree";
	const effectiveWorkspace = sandbox?.enabled && (sandbox.workspaceAccess !== "rw" || projectedWorkspace) ? sandbox.workspaceCwd ?? sandbox.workspaceDir : resolvedWorkspace;
	const executionSandbox = params.placementSandbox ?? sandbox;
	if (params.requireWritableSandbox && executionSandbox?.enabled && executionSandbox.workspaceAccess !== "rw") throw new Error("sandbox workspace is not read-write; collection review skipped");
	const requestedCwd = params.cwd ? resolveUserPath(params.cwd) : void 0;
	const sessionPermissionRoot = projectedWorkspace ? sandbox.workspaceDir : params.sessionRoot ?? await fs.realpath(resolvedWorkspace);
	const sessionPermissionPolicy = params.permissionMode ? {
		root: sessionPermissionRoot,
		mode: params.permissionMode
	} : void 0;
	if (sandbox?.enabled) assertSandboxCwd(requestedCwd, resolvedWorkspace);
	await fs.mkdir(effectiveWorkspace, { recursive: true });
	return {
		effectiveCwd: sandbox?.enabled ? effectiveWorkspace : requestedCwd ?? effectiveWorkspace,
		effectiveFsWorkspaceOnly: params.requireWorkspaceOnly === true || resolveEffectiveToolFsWorkspaceOnly({
			cfg: params.config,
			agentId: sessionAgentId
		}),
		effectiveWorkspace,
		resolvedWorkspace,
		sessionPermissionRoot,
		sessionPermissionPolicy,
		sandbox,
		sandboxSessionKey,
		sessionAgentId
	};
}
//#endregion
export { resolveHarnessWorkspace as n, resolveAttemptWorkspaceSandbox as t };
