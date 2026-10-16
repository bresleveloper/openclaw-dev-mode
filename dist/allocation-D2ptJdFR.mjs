import { i as extractErrorCode, r as collectNestedErrorCandidates } from "./error-coercion-CvJK4lmH.mjs";
import { n as OpenClawStateLeaseError } from "./openclaw-state-lease-error-Ds9BTWol.mjs";
import { t as withOpenClawStateLease } from "./openclaw-state-lease-CdKflcqg.mjs";
//#region src/agents/worktrees/allocation.ts
const WORKTREE_CREATE_LEASE_SCOPE = "core:managed-worktrees:create";
const WORKTREE_CREATE_LEASE_MS = 6e4;
const WORKTREE_CREATE_LEASE_WAIT_MS = 6e5;
/** Serialize managed worktree allocations across repositories and processes. */
async function withWorktreeAllocationLease(params, run) {
	const acquisition = new AbortController();
	const abortAcquisition = () => acquisition.abort(params.signal?.reason);
	params.signal?.addEventListener("abort", abortAcquisition, { once: true });
	if (params.signal?.aborted) abortAcquisition();
	try {
		params.commitGuard?.();
		return await withOpenClawStateLease({
			scope: WORKTREE_CREATE_LEASE_SCOPE,
			key: "capacity",
			database: {
				scope: "shared",
				options: { env: params.env }
			},
			leaseMs: WORKTREE_CREATE_LEASE_MS,
			waitMs: WORKTREE_CREATE_LEASE_WAIT_MS,
			heartbeat: "worker",
			leaseLabel: "managed worktree allocation lease",
			operationLabel: "agents.worktrees.allocation",
			signal: acquisition.signal
		}, async (lease) => {
			params.signal?.removeEventListener("abort", abortAcquisition);
			const signal = params.signal ? AbortSignal.any([params.signal, lease.signal]) : lease.signal;
			try {
				const result = await run({
					signal,
					commitGuard: () => {
						lease.assertOwned();
						signal.throwIfAborted();
						params.commitGuard?.();
					},
					rollbackGuard: () => lease.assertOwned()
				});
				signal.throwIfAborted();
				return result;
			} catch (error) {
				if (collectNestedErrorCandidates(error).some((cause) => extractErrorCode(cause) === "outcome-unknown")) throw error;
				if (params.signal?.aborted) {
					lease.assertOwned();
					throw new OpenClawStateLeaseError("managed worktree allocation lease operation was aborted", {
						code: "OPENCLAW_STATE_LEASE_ABORTED",
						cause: params.signal.reason
					});
				}
				throw error;
			}
		});
	} finally {
		params.signal?.removeEventListener("abort", abortAcquisition);
	}
}
//#endregion
export { withWorktreeAllocationLease as t };
