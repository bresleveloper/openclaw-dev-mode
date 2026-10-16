import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-CC57AD_q.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
//#region src/agents/worktrees/registry-read.ts
async function readRegistryWorktree(context, id) {
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-RW5P1VzC.mjs");
	return await executeOpenClawStateWorker(context, {
		type: "worktrees.get",
		input: { id }
	});
}
async function readRegistryWorktrees(env, options = {}) {
	const context = captureOpenClawStateWorkerContext({ env });
	const input = { liveOnly: options.liveOnly };
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-RW5P1VzC.mjs");
	return await executeOpenClawStateWorker(context, {
		type: "worktrees.list",
		input
	});
}
async function readLiveRegistryWorktreeIds(env) {
	const context = captureOpenClawStateWorkerContext({ env });
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-RW5P1VzC.mjs");
	return await executeOpenClawStateWorker(context, {
		type: "worktrees.liveIds",
		input: void 0
	});
}
async function getRegistryWorktreeProvisionedPaths(env, id) {
	const context = captureOpenClawStateWorkerContext({ env });
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-RW5P1VzC.mjs");
	return await executeOpenClawStateWorker(context, {
		type: "worktrees.provisionedPaths",
		input: { id }
	});
}
async function getRegistryWorktreeProvisionedState(env, id) {
	const context = captureOpenClawStateWorkerContext({ env });
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-RW5P1VzC.mjs");
	return await executeOpenClawStateWorker(context, {
		type: "worktrees.provisionedState",
		input: { id }
	});
}
async function getRegistryWorktreeProvisionedChunk(env, params) {
	const context = captureOpenClawStateWorkerContext({ env });
	const input = { ...params };
	const { executeOpenClawStateWorker } = await import("./openclaw-state-worker-store-RW5P1VzC.mjs");
	return await executeOpenClawStateWorker(context, {
		type: "worktrees.provisionedChunk",
		input
	});
}
async function readWorktreeCleanupState(env) {
	const reply = await executeExistingOpenClawStateRead({ env }, { type: "worktrees.cleanupState" }, { current: true });
	if (!reply) return {
		records: [],
		leases: {
			liveScopes: [],
			staleScopes: []
		}
	};
	if (!reply.ok || reply.type !== "worktrees.cleanupState") throw new Error("Worktree cleanup state read failed");
	return reply;
}
//#endregion
export { readRegistryWorktree as a, readLiveRegistryWorktreeIds as i, getRegistryWorktreeProvisionedPaths as n, readRegistryWorktrees as o, getRegistryWorktreeProvisionedState as r, readWorktreeCleanupState as s, getRegistryWorktreeProvisionedChunk as t };
