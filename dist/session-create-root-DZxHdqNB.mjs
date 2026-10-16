import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as ok } from "./result-BQGgYouL.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { c as invalidSessionRequest } from "./session-request-agent-Bxi11ET4.mjs";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-Dk4uhhe-.mjs";
import { t as resolveSessionWorkspaceRoots } from "./session-workspace-roots-BvtSgErM.mjs";
import fs from "node:fs";
//#region src/gateway/server-methods/session-create-root.ts
function prepareSessionCreateFilesystemRoot(params) {
	if (params.requestedExecNode) return ok({ sessionCwd: params.sessionCwd });
	try {
		const workspaceDir = resolveAgentWorkspaceDir(params.cfg, params.targetAgentId);
		const rootCandidate = params.sessionCwd ?? workspaceDir;
		if (!params.sessionCwd) fs.mkdirSync(rootCandidate, { recursive: true });
		const sessionRoot = fs.realpathSync(rootCandidate);
		if (!fs.statSync(sessionRoot).isDirectory()) return invalidSessionRequest("sessions.create cwd is not a directory");
		if (params.sessionCwd && params.enforceSandboxContainment) {
			const targetRuntime = resolveSandboxRuntimeStatus({
				cfg: params.cfg,
				agentId: params.targetAgentId,
				sessionKey: params.sessionKey ?? `agent:${params.targetAgentId}:dashboard:pending`
			});
			if ((params.sandboxRequired || targetRuntime.sandboxed) && !isPathInside(fs.realpathSync(workspaceDir), sessionRoot)) return invalidSessionRequest(params.requestedProjectId ? "sessions.create project is outside the sandboxed agent workspace" : "sessions.create cwd is outside the sandboxed agent workspace");
		}
		return ok({
			sessionRoot,
			sessionCwd: params.sessionCwd ? sessionRoot : void 0
		});
	} catch (error) {
		return invalidSessionRequest(`sessions.create cwd is unavailable: ${formatErrorMessage(error)}`);
	}
}
/** Keep an implicit Gateway default distinct from a caller-selected fork destination. */
function resolveSessionCreateRootParameters(params, root) {
	if (params.worktree === true) return {};
	const inheritsParent = params.fork === true && !normalizeOptionalString(params.cwd) && !normalizeOptionalString(params.projectId);
	return {
		spawnedCwd: root?.sessionCwd,
		sessionRoot: inheritsParent ? void 0 : root?.sessionRoot,
		defaultSessionRoot: root?.sessionRoot
	};
}
/** Reuse local workspace selections without inheriting managed or remote ownership. */
function prepareSessionForkFilesystemRoot(params) {
	const parent = params.parent;
	if (parent.worktree || parent.repositoryWorkspaceId || parent.execHost === "node" || parent.execNode || parent.pendingWorktree || parent.pendingProjectGitUrl || !parent.spawnedCwd && !parent.spawnedWorkspaceDir) return ok({});
	const roots = resolveSessionWorkspaceRoots(params.cfg, params.targetAgentId, parent);
	const cwd = prepareSessionCreateFilesystemRoot({
		...params,
		enforceSandboxContainment: true,
		requestedProjectId: parent.projectId,
		sessionCwd: roots.diffCwd
	});
	if (!cwd.ok) return cwd;
	const root = roots.root === roots.diffCwd ? cwd : prepareSessionCreateFilesystemRoot({
		...params,
		enforceSandboxContainment: true,
		requestedProjectId: parent.projectId,
		sessionCwd: roots.root
	});
	if (!root.ok) return root;
	return ok({
		...parent.projectId ? { projectId: parent.projectId } : {},
		spawnedCwd: cwd.value.sessionCwd,
		...parent.spawnedWorkspaceDir ? { spawnedWorkspaceDir: root.value.sessionRoot } : {},
		sessionRoot: root.value.sessionRoot
	});
}
//#endregion
export { prepareSessionForkFilesystemRoot as n, resolveSessionCreateRootParameters as r, prepareSessionCreateFilesystemRoot as t };
