import { o as captureGatewayStateOwner } from "./gateway-state-owner-DmHycK5o.mjs";
import { u as resolveGatewayLockPaths } from "./gateway-lock-B6mKYs2x.mjs";
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
//#endregion
export { captureLocalStateMutationGuard as t };
