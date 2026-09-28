//#region src/agents/rooted-run-params.ts
async function prepareRootedExecutionCapability(params) {
	const { resolveAttemptWorkspaceSandbox } = await import("./workspace-sandbox-bX64OFQu.mjs");
	const workspace = await resolveAttemptWorkspaceSandbox({
		...params,
		workspaceDir: params.rootedExecution.root,
		cwd: params.rootedExecution.root,
		sessionRoot: params.rootedExecution.root,
		requireWritableSandbox: true,
		requireWorkspaceOnly: true
	});
	return Object.freeze({
		root: workspace.resolvedWorkspace,
		workspaceDir: workspace.effectiveWorkspace,
		cwd: workspace.effectiveCwd,
		requireWorkspaceOnly: true,
		sandbox: workspace.sandbox,
		sessionPermissionPolicy: workspace.sessionPermissionPolicy
	});
}
/** Root file tools at the task directory without widening the operator's shell policy. */
function rootedAgentRunParams(workspaceDir, executionRoot) {
	return {
		workspaceDir: executionRoot ?? workspaceDir,
		bootstrapWorkspaceDir: workspaceDir,
		cwd: executionRoot,
		sessionRoot: executionRoot,
		requireWritableSandbox: executionRoot ? true : void 0,
		requireWorkspaceOnly: executionRoot ? true : void 0
	};
}
//#endregion
export { rootedAgentRunParams as n, prepareRootedExecutionCapability as t };
