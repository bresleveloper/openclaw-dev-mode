import { o as resolveUserPath } from "./home-dir-Dc6nN6HB.mjs";
import "./utils-DgZn2dLu.mjs";
import { v as resolveSessionAgentIds } from "./agent-scope-CG17uXFn.mjs";
import { h as resolveAdmittedRunActiveAssertion } from "./admitted-run-context-QJnFIxUZ.mjs";
import { n as resolveEffectiveToolFsWorkspaceOnly } from "./tool-fs-policy-DAGJ2iyt.mjs";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-Dk4uhhe-.mjs";
import { n as resolveSandboxContext } from "./context-B3LPWiJ8.mjs";
import "./sandbox-DXRpw1Ja.mjs";
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
	const assertRunCurrent = params.admittedRunContext ? resolveAdmittedRunActiveAssertion(params.admittedRunContext, params.abortSignal) : void 0;
	if (params.admittedRunContext && !assertRunCurrent) throw new Error("Sandbox preparation requires an active admitted run");
	const assertCurrent = () => {
		params.abortSignal?.throwIfAborted();
		assertRunCurrent?.();
	};
	assertCurrent();
	const { sessionAgentId } = resolveSessionAgentIds({
		sessionKey: params.sessionKey,
		config: params.config,
		agentId: params.agentId
	});
	const resolvedWorkspace = resolveUserPath(params.workspaceDir);
	await fs.mkdir(resolvedWorkspace, { recursive: true });
	assertCurrent();
	const sessionKey = params.sessionKey?.trim() || params.sessionId;
	const sandboxSessionKey = params.sandboxSessionKey?.trim() || sessionKey;
	const sandboxRuntimeStatus = params.placementSandbox ? void 0 : resolveSandboxRuntimeStatus({
		cfg: params.config,
		agentId: params.sandboxAgentId ?? (sandboxSessionKey === sessionKey ? sessionAgentId : void 0),
		sessionKey: sandboxSessionKey
	});
	const sandbox = sandboxRuntimeStatus ? await resolveSandboxContext({
		config: params.config,
		agentId: sandboxRuntimeStatus.agentId,
		execOverrides: params.execOverrides,
		sessionKey: sandboxSessionKey,
		skillsSnapshot: params.skillsSnapshot,
		workspaceDir: resolvedWorkspace,
		assertCurrent,
		admittedRunContext: params.admittedRunContext,
		preparedRuntimeStatus: sandboxRuntimeStatus
	}) : null;
	assertCurrent();
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
	assertCurrent();
	if (effectiveWorkspace !== resolvedWorkspace) await fs.mkdir(effectiveWorkspace, { recursive: true });
	assertCurrent();
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
		sandboxReport: sandboxRuntimeStatus ? {
			mode: sandboxRuntimeStatus.mode,
			sandboxed: sandboxRuntimeStatus.sandboxed
		} : void 0,
		sandboxSessionKey,
		sessionAgentId
	};
}
//#endregion
export { resolveHarnessWorkspace as n, resolveAttemptWorkspaceSandbox as t };
