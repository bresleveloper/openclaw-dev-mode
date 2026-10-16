import { n as formatDiskSpaceBytes, r as tryReadDiskSpace } from "./disk-space-CtKhSv74.mjs";
import { t as runGitWorkerOperation } from "./git-worker-pOqNR_b6.mjs";
import { statSync } from "node:fs";
//#region src/agents/worktrees/capacity.ts
const GiB = 1024 ** 3;
const WORKTREE_SETUP_HEADROOM_BYTES = 4 * GiB;
/** Admission estimates allocations, not a quota on arbitrary repository scripts or other writers. */
function requireWorktreeDiskSpace(demands, purpose, snapshot = false) {
	const volumes = /* @__PURE__ */ new Map();
	for (const demand of demands) {
		const space = tryReadDiskSpace(demand.path);
		if (!space || space.totalBytes === null) throw new Error(`Cannot determine disk space near ${demand.path}; check the volume and retry ${purpose}.`);
		const device = statSync(space.checkedPath).dev;
		const existing = volumes.get(device);
		if (existing) {
			existing.available = Math.min(existing.available, space.availableBytes);
			existing.bytes += demand.bytes;
		} else volumes.set(device, {
			path: space.checkedPath,
			available: space.availableBytes,
			bytes: demand.bytes
		});
	}
	for (const volume of volumes.values()) {
		const required = (snapshot ? 128 * 1024 ** 2 : 4 * GiB) + volume.bytes;
		if (!Number.isSafeInteger(Math.ceil(required)) || volume.available < required) throw new Error(`Insufficient disk space near ${volume.path} for ${purpose}: ${formatDiskSpaceBytes(volume.available)} available; approximately ${formatDiskSpaceBytes(required)} required including safety reserve. Free caches or archive/remove unused worktrees, then retry.`);
	}
}
async function estimateWorktreeGitBytes(repoRoot, ref, options = {}) {
	return await runGitWorkerOperation({
		type: "worktree.git-size",
		input: {
			repoRoot,
			ref,
			replacementRefBase: process.env.GIT_REPLACE_REF_BASE ?? "refs/replace/"
		}
	}, options);
}
/** Budget a full snapshot checkout or the destination blobs written over a source clone. */
async function estimateWorktreeCheckoutTransitionBytes(repoRoot, baseRef, targetRef, options = {}) {
	return await runGitWorkerOperation({
		type: "worktree.checkout-transition-size",
		input: {
			repoRoot,
			baseRef,
			targetRef,
			replacementRefBase: process.env.GIT_REPLACE_REF_BASE ?? "refs/replace/"
		}
	}, options);
}
/** Each call measures current files; allocation cannot use a settled directory-size cache. */
async function directorySizeBytes(root, excludeGit = false, options = {}) {
	return await runGitWorkerOperation({
		type: "worktree.directory-size",
		input: {
			root,
			excludeGit
		}
	}, options);
}
//#endregion
export { requireWorktreeDiskSpace as a, estimateWorktreeGitBytes as i, directorySizeBytes as n, estimateWorktreeCheckoutTransitionBytes as r, WORKTREE_SETUP_HEADROOM_BYTES as t };
