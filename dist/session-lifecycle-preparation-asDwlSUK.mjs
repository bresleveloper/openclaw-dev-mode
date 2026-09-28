//#region src/gateway/session-lifecycle-preparation.ts
/** Bind prepared workspace facts and consume setup intent only after successful preparation. */
function projectPreparedSessionWorkspace(existingEntry, params) {
	const { projectId, pendingProjectGitUrl, pendingWorktree, spawnedCwd, preparedLifecycle } = params;
	const createdNewEntry = existingEntry === void 0;
	const recovered = preparedLifecycle?.worktree && (existingEntry?.pendingWorktree || existingEntry?.pendingProjectGitUrl);
	return {
		...createdNewEntry && projectId ? { projectId } : {},
		...createdNewEntry && pendingProjectGitUrl ? { pendingProjectGitUrl } : {},
		...createdNewEntry && pendingWorktree ? { pendingWorktree } : {},
		...spawnedCwd ? { spawnedCwd } : {},
		...preparedLifecycle?.worktree ? { worktree: preparedLifecycle.worktree } : {},
		...preparedLifecycle?.repositoryWorkspaceId ? { repositoryWorkspaceId: preparedLifecycle.repositoryWorkspaceId } : {},
		...recovered ? {
			projectId,
			pendingWorktree: void 0,
			pendingProjectGitUrl: void 0
		} : {}
	};
}
/** Join recorded commit actions even when the enclosing source scope fails during cleanup. */
async function settleGatewaySessionLifecycleCommit(commit, afterCommit) {
	const result = await commit.then((value) => ({
		ok: true,
		value
	}), (error) => ({
		ok: false,
		error
	}));
	const failures = result.ok ? [] : [result.error];
	for (const action of afterCommit) try {
		await action();
	} catch (error) {
		failures.push(error);
	}
	if (failures.length > 1) throw new AggregateError(failures, "Session reset commit and post-commit actions failed", { cause: failures.at(-1) });
	if (!result.ok) throw result.error;
	if (failures.length === 1) throw failures[0];
	return result.value;
}
async function rollbackGatewaySessionPreparation(params) {
	try {
		await params.prepared?.rollback?.();
	} catch (error) {
		params.onError?.(error);
	}
}
//#endregion
export { rollbackGatewaySessionPreparation as n, settleGatewaySessionLifecycleCommit as r, projectPreparedSessionWorkspace as t };
