import { t as UpdateRequesterRevokedError } from "./update-requester-authority-CbCLnyCx.mjs";
import { p as UpdateCommandRecoveryPendingError } from "./update-command-executor-C94Zye_E.mjs";
//#region src/cli/update-cli/update-command-authority.ts
/** Bind requester and executor identity across discovery and delegated child admission. */
function createUpdateCommandAuthority(params, label = "Update") {
	const run = params.opts?.run;
	const runExecutorFence = run?.executorFence;
	const executorFence = runExecutorFence ?? params.executorFence;
	const runId = run?.runId;
	const requester = run?.requesterAuthority;
	let authorityFailure;
	const refuseAuthority = (error) => {
		authorityFailure ??= { error };
		params.onAuthorityRefused?.();
		throw authorityFailure.error;
	};
	const checkAuthority = (check) => {
		if (authorityFailure) throw authorityFailure.error;
		try {
			check();
		} catch (error) {
			refuseAuthority(error);
		}
	};
	const assertRequesterCurrent = () => checkAuthority(() => {
		if (params.opts?.run !== run || run?.executorFence !== runExecutorFence || run?.runId !== runId || run?.requesterAuthority !== requester || run && (!runExecutorFence || !runId?.trim())) throw new UpdateCommandRecoveryPendingError(`${label} lost its original update executor.`);
		if (requester?.isCurrent() === false) throw new UpdateRequesterRevokedError();
	});
	const assertCurrent = () => checkAuthority(() => {
		assertRequesterCurrent();
		params.assertCurrent?.();
		executorFence?.assertCurrent();
	});
	return {
		run,
		executorFence,
		runId,
		requester,
		assertCurrent,
		assertRequesterCurrent,
		refuseAuthority
	};
}
//#endregion
export { createUpdateCommandAuthority as t };
