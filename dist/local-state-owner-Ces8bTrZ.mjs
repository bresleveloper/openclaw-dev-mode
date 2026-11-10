import { a as captureGatewayStateOwner } from "./gateway-state-owner-X3EqhtYx.mjs";
import { Ng as errorShape } from "./src-pLJQA6J5.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { u as resolveGatewayLockPaths } from "./gateway-lock-OT1e72lx.mjs";
import { i as withChannelReadAuthority } from "./channel-read-authority-DeXfvJjt.mjs";
import { statSync } from "node:fs";
import path from "node:path";
//#region src/gateway/server-methods/local-state-owner.ts
/** Optional for old clients; new local callers must bind to the physically held owner. */
function captureLocalStateMutationGuard(expectedOwnerId, options, target) {
	const { stateDir } = resolveGatewayLockPaths(process.env);
	const owner = captureGatewayStateOwner(path.join(stateDir, "state", "openclaw.sqlite"));
	const cfg = options.context.getRuntimeConfig();
	const assertCurrent = () => {
		options.signal?.throwIfAborted();
		options.sessionMutationCommitGuard?.();
		if (!owner || owner.role !== "gateway" || owner.ownerId !== expectedOwnerId || options.hasCurrentClientAuthority?.() === false || options.context.getRuntimeConfig() !== cfg) throw new Error("Gateway state owner or requester changed; rerun against the current owner.");
		owner.assertCurrent();
		if (target) {
			const current = statSync(target.path, { bigint: true });
			if (`${current.dev}:${current.ino}` !== target.identity) throw new Error("Source repository changed; rerun worktrees create.");
		}
	};
	assertCurrent();
	return assertCurrent;
}
function localStateOwnerChangedError(error) {
	return errorShape(ErrorCodes.UNAVAILABLE, String(error), {
		details: {
			reason: "STATE_OWNER_CHANGED",
			mutationAccepted: false
		},
		retryable: false
	});
}
/** Preserve the selected owner through plugin transport effects and response disclosure. */
function runWithLocalStateMutationOwner(expectedOwnerId, options, run) {
	const assertCurrent = captureLocalStateMutationGuard(expectedOwnerId, options);
	return withChannelReadAuthority(assertCurrent, () => run(assertCurrent), options.signal);
}
//#endregion
export { localStateOwnerChangedError as n, runWithLocalStateMutationOwner as r, captureLocalStateMutationGuard as t };
