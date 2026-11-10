import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import "./utils-gjJ-tD2q.mjs";
import { t as CronSessionLifecycleClaimError } from "./run-authority-Cj0McdfG.mjs";
import fs from "node:fs/promises";
import path from "node:path";
import { isPathInside } from "@openclaw/fs-safe/path";
//#region src/cron/run-workspace.ts
/** Retain the persisted conversation's managed checkout through scheduled execution. */
async function prepareCronSessionWorktree(params) {
	const binding = params.entry?.worktree;
	if (!binding) return {
		workspaceDir: params.workspaceDir,
		cwd: params.cwd
	};
	const { captureOpenClawStateWorkerContext } = await import("./openclaw-state-worker-context-1oVBW64_.mjs");
	const { readRegistryWorktree } = await import("./registry-read-GwHy_c-N.mjs");
	const { acquireWorktreeRunLease } = await import("./run-lease-CEiNGXc2.mjs");
	params.assertCurrent();
	const workspaceDir = await fs.realpath(resolveUserPath(params.workspaceDir));
	const cwd = params.cwd ? await fs.realpath(resolveUserPath(params.cwd)) : void 0;
	params.assertCurrent();
	const state = captureOpenClawStateWorkerContext();
	const validateWorktree = async () => {
		const record = await readRegistryWorktree(state, binding.id);
		params.assertCurrent();
		if (!record || record.id !== binding.id || record.ownerKind !== "session" || record.ownerId !== params.sessionKey || record.removedAt !== void 0 || record.branch !== binding.branch || path.resolve(record.repoRoot) !== path.resolve(binding.repoRoot)) throw new CronSessionLifecycleClaimError(params.sessionKey, "Bound automation worktree is missing, retired, or mismatched.");
		const root = await fs.realpath(record.path);
		params.assertCurrent();
		if (!isPathInside(root, workspaceDir) || !isPathInside(root, cwd ?? workspaceDir)) throw new CronSessionLifecycleClaimError(params.sessionKey, "Bound automation workspace does not match its managed worktree.");
	};
	await validateWorktree();
	const lease = await acquireWorktreeRunLease(binding.id);
	try {
		await validateWorktree();
		return {
			workspaceDir,
			cwd,
			lease
		};
	} catch (error) {
		await lease.release();
		throw error;
	}
}
//#endregion
export { prepareCronSessionWorktree };
