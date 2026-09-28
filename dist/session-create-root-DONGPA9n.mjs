import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { t as ErrorCodes } from "./gateway-error-details-D85F07e9.mjs";
import { f as errorShape } from "./error-codes-DvB36bCj.mjs";
import { n as resolveSandboxRuntimeStatus } from "./runtime-status-GvZUbuy9.mjs";
import { t as resolveSessionWorkspaceRoots } from "./session-workspace-roots-CdOvbmSU.mjs";
import fs from "node:fs";
//#region src/gateway/server-methods/session-create-root.ts
function prepareSessionCreateFilesystemRoot(params) {
	if (params.requestedExecNode) return ok({ sessionCwd: params.sessionCwd });
	try {
		const workspaceDir = resolveAgentWorkspaceDir(params.cfg, params.targetAgentId);
		const rootCandidate = params.sessionCwd ?? workspaceDir;
		if (!params.sessionCwd) fs.mkdirSync(rootCandidate, { recursive: true });
		const sessionRoot = fs.realpathSync(rootCandidate);
		if (!fs.statSync(sessionRoot).isDirectory()) return err(errorShape(ErrorCodes.INVALID_REQUEST, "sessions.create cwd is not a directory"));
		if (params.sessionCwd && params.enforceSandboxContainment) {
			const targetRuntime = resolveSandboxRuntimeStatus({
				cfg: params.cfg,
				agentId: params.targetAgentId,
				sessionKey: params.sessionKey ?? `agent:${params.targetAgentId}:dashboard:pending`
			});
			if ((params.sandboxRequired || targetRuntime.sandboxed) && !isPathInside(fs.realpathSync(workspaceDir), sessionRoot)) return err(errorShape(ErrorCodes.INVALID_REQUEST, params.requestedProjectId ? "sessions.create project is outside the sandboxed agent workspace" : "sessions.create cwd is outside the sandboxed agent workspace"));
		}
		return ok({
			sessionRoot,
			sessionCwd: params.sessionCwd ? sessionRoot : void 0
		});
	} catch (error) {
		return err(errorShape(ErrorCodes.INVALID_REQUEST, `sessions.create cwd is unavailable: ${formatErrorMessage(error)}`));
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
