import { l as movePathToTrash } from "./fs-safe-BAPek8At.mjs";
import { d as resolveHomeDir, f as shortenHomeInString, p as shortenHomePath } from "./utils-aKqR_F_U.mjs";
import { r as isPathInside, t as hasNodeErrorCode } from "./path-guards-D5kuI0Tv.mjs";
import { r as isMissingPathError } from "./errno-CkbDOfLk.mjs";
import { O as listAgentIds, l as resolveAgentWorkspaceDir } from "./agent-scope-config-IQKOEtZ4.mjs";
import { n as resolveDefaultAgentWorkspaceDir } from "./workspace-default-hMJcajDi.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as acquireOpenClawStateDatabaseFileExclusion } from "./openclaw-state-db-cache-Ci98mtX8.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { n as GatewayLockError, r as acquireGatewayLock } from "./gateway-lock-CYjRlApN.mjs";
import { i as prepareWorkspaceStateDeletion, n as deleteWorkspaceState } from "./workspace-state-store-DTZ2RTNw.mjs";
import { d as removeLegacyWorkspaceStateForReset, u as prepareLegacyWorkspaceStateReset } from "./workspace-legacy-state-6xtqRcEJ.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region src/commands/cleanup-utils.ts
const STATE_CLEANUP_LOCK_TIMEOUT_MS = 250;
const STATE_CLEANUP_LOCK_POLL_INTERVAL_MS = 25;
function trashFailure(pathname, error, runtime) {
	runtime.log(`Failed to move to Trash (manual delete): ${shortenHomePath(pathname)}`);
	return { failed: {
		path: pathname,
		reason: formatErrorMessage(error)
	} };
}
async function moveToTrashResult(pathname, runtime, assertCurrent) {
	if (!pathname) return { failed: {
		path: pathname,
		reason: "path is empty"
	} };
	let isSymbolicLink;
	try {
		isSymbolicLink = (await fs.lstat(pathname)).isSymbolicLink();
	} catch (error) {
		return isMissingPathError(error) ? { removed: {
			path: pathname,
			method: "missing"
		} } : trashFailure(pathname, error, runtime);
	}
	try {
		const sourcePath = await resolveMoveToTrashSourcePath(path.resolve(pathname));
		const allowedRoots = trashAllowedRoots([sourcePath], isSymbolicLink ? await resolveSymlinkTargetPath(sourcePath) : void 0);
		assertCurrent?.();
		await movePathToTrash(sourcePath, { allowedRoots });
		runtime.log(`Moved to Trash: ${shortenHomePath(pathname)}`);
		return { removed: {
			path: pathname,
			method: "trash"
		} };
	} catch (error) {
		return trashFailure(pathname, error, runtime);
	}
}
/** Moves a path to Trash when it exists, logging a manual-delete fallback on failure. */
async function moveToTrash(pathname, runtime, assertCurrent) {
	return "removed" in await moveToTrashResult(pathname, runtime, assertCurrent);
}
/**
* Allowed Trash roots for OpenClaw-owned paths: each declared path's own parent, plus the
* resolved parent when the moved path is a symlink (fs-safe checks the link target, and
* moving a link never touches the directory behind it). fs-safe's default roots (home + tmp)
* alone refuse every path of a state dir on a volume such as `/data`.
*/
function trashAllowedRoots(declaredPaths, resolvedLinkPath) {
	const roots = declaredPaths.map((declaredPath) => path.dirname(declaredPath));
	if (resolvedLinkPath !== void 0) roots.push(path.dirname(resolvedLinkPath));
	return [...new Set(roots)];
}
async function resolveMoveToTrashSourcePath(targetPath) {
	return path.join(await fs.realpath(path.dirname(targetPath)), path.basename(targetPath));
}
async function resolveSymlinkTargetPath(linkPath) {
	try {
		return await fs.realpath(linkPath);
	} catch {
		return;
	}
}
function collectWorkspaceDirs(cfg) {
	const dirs = /* @__PURE__ */ new Set();
	if (!cfg) {
		dirs.add(resolveDefaultAgentWorkspaceDir());
		return [...dirs];
	}
	for (const agentId of listAgentIds(cfg)) dirs.add(resolveAgentWorkspaceDir(cfg, agentId));
	return [...dirs];
}
/** Determine which config, credential, and workspace paths cleanup should consider. */
function buildCleanupPlan(params) {
	return {
		configInsideState: isPathWithin(params.configPath, params.stateDir),
		oauthInsideState: isPathWithin(params.oauthDir, params.stateDir),
		workspaceDirs: collectWorkspaceDirs(params.cfg)
	};
}
/** Return true when `child` resolves inside `parent`. */
function isPathWithin(child, parent) {
	return isPathInside(parent, child);
}
function isUnsafeRemovalTarget(target) {
	if (!target.trim()) return true;
	const resolved = path.resolve(target);
	if (resolved === path.parse(resolved).root) return true;
	const home = resolveHomeDir();
	if (home && resolved === path.resolve(home)) return true;
	if (isPathWithin(path.resolve(process.cwd()), resolved)) return true;
	return false;
}
/** Remove one path after rejecting empty/root/home targets and honoring dry-run mode. */
async function removePath(target, runtime, opts) {
	if (!target?.trim()) return { ok: false };
	const resolved = path.resolve(target);
	const label = opts?.label ?? resolved;
	const displayLabel = shortenHomeInString(label);
	if (isUnsafeRemovalTarget(resolved)) {
		runtime.error(`Refusing to remove unsafe path: ${displayLabel}`);
		return { ok: false };
	}
	if (opts?.dryRun) {
		runtime.log(`[dry-run] remove ${displayLabel}`);
		return { ok: true };
	}
	try {
		await fs.rm(resolved, {
			recursive: true,
			force: true
		});
		runtime.log(`Removed ${displayLabel}`);
		return { ok: true };
	} catch (err) {
		runtime.error(`Failed to remove ${displayLabel}: ${String(err)}`);
		return { ok: false };
	}
}
async function pathExists(target) {
	try {
		await fs.lstat(target);
		return true;
	} catch (error) {
		if (hasNodeErrorCode(error, "ENOENT")) return false;
		throw error;
	}
}
async function existingPaths(paths) {
	const existing = [];
	for (const target of paths) {
		if (!target?.trim()) continue;
		const resolved = path.resolve(target);
		try {
			await fs.lstat(resolved);
			existing.push(resolved);
		} catch {}
	}
	return existing;
}
async function acquireStateCleanupOwnership(cleanup) {
	const env = {
		...process.env,
		OPENCLAW_CONFIG_PATH: cleanup.configPath,
		OPENCLAW_STATE_DIR: cleanup.stateDir
	};
	let lock;
	try {
		lock = await acquireGatewayLock({
			allowInTests: true,
			env,
			pollIntervalMs: STATE_CLEANUP_LOCK_POLL_INTERVAL_MS,
			role: "agent-embedded",
			timeoutMs: STATE_CLEANUP_LOCK_TIMEOUT_MS
		});
	} catch (error) {
		if (error instanceof GatewayLockError) throw new Error("Cannot remove OpenClaw state while the Gateway or another state maintenance command owns this state directory. Stop the Gateway and retry.", { cause: error });
		throw error;
	}
	if (!lock) throw new Error("Cannot remove OpenClaw state without exclusive state ownership.");
	return lock;
}
function shouldPreservePath(target, preservePaths) {
	return preservePaths.some((preservePath) => isPathWithin(target, preservePath));
}
function pathContainsPreservedPath(target, preservePaths) {
	return preservePaths.some((preservePath) => isPathWithin(preservePath, target));
}
async function removePathPreserving(target, preservePaths, runtime, opts) {
	if (!target?.trim()) return { ok: false };
	const resolved = path.resolve(target);
	const label = opts?.label ?? resolved;
	const displayLabel = shortenHomeInString(label);
	if (isUnsafeRemovalTarget(resolved)) {
		runtime.error(`Refusing to remove unsafe path: ${displayLabel}`);
		return { ok: false };
	}
	if (shouldPreservePath(resolved, preservePaths)) return { ok: true };
	if (!pathContainsPreservedPath(resolved, preservePaths)) return removePath(resolved, runtime, opts);
	if (opts?.dryRun) {
		const preserved = preservePaths.filter((preservePath) => isPathWithin(preservePath, resolved)).map((preservePath) => shortenHomeInString(preservePath)).join(", ");
		runtime.log(`[dry-run] remove ${displayLabel} preserving ${preserved}`);
		return { ok: true };
	}
	try {
		if (!(await fs.lstat(resolved)).isDirectory()) return removePath(resolved, runtime, opts);
		const entries = await fs.readdir(resolved);
		for (const entry of entries) {
			const result = await removePathPreserving(path.join(resolved, entry), preservePaths, runtime);
			if (!result.ok) return result;
		}
		runtime.log(`Removed contents of ${displayLabel}`);
		return { ok: true };
	} catch (err) {
		runtime.error(`Failed to remove ${displayLabel}: ${String(err)}`);
		return { ok: false };
	}
}
async function detachStateLockDirectory(lockDir, stateDir, runtime) {
	const tombstone = path.join(path.dirname(stateDir), `.${path.basename(stateDir)}-locks.cleanup-${randomUUID()}`);
	try {
		await fs.rename(lockDir, tombstone);
		return tombstone;
	} catch (error) {
		const message = `Failed to finalize OpenClaw state cleanup because the lock directory changed: ${String(error)}`;
		runtime.error(message);
		throw new Error(message, { cause: error });
	}
}
async function removeStateDirectoryAlias(requestedStateDir, stateDir) {
	if (requestedStateDir === stateDir) return;
	try {
		if ((await fs.lstat(requestedStateDir)).isSymbolicLink()) await fs.unlink(requestedStateDir);
	} catch (error) {
		if (!hasNodeErrorCode(error, "ENOENT")) throw error;
	}
}
async function removeEmptyStateAncestors(startDir, stateDir) {
	for (let current = startDir; isPathWithin(current, stateDir); current = path.dirname(current)) {
		try {
			await fs.rmdir(current);
		} catch (error) {
			if (hasNodeErrorCode(error, "ENOENT")) continue;
			if (hasNodeErrorCode(error, "ENOTEMPTY") || hasNodeErrorCode(error, "EEXIST")) return false;
			throw error;
		}
		if (current === stateDir) return true;
	}
	return false;
}
async function removeLinkedCleanupPaths(cleanup, runtime) {
	const externalPaths = [cleanup.configInsideState ? void 0 : cleanup.configPath, cleanup.oauthInsideState ? void 0 : cleanup.oauthDir].filter((target) => target !== void 0);
	for (const target of externalPaths) if (!(await removePath(target, runtime, { label: target })).ok) throw new Error(`Failed to remove linked cleanup path: ${shortenHomeInString(target)}`);
}
/** Remove state plus config/OAuth paths, preserving selected paths nested inside state. */
async function removeStateAndLinkedPaths(cleanup, runtime, opts) {
	const requestedStateDir = path.resolve(cleanup.stateDir);
	const requestedPreservePaths = opts?.dryRun ? (opts.preservePaths ?? []).map((target) => path.resolve(target)) : await existingPaths(opts?.preservePaths ?? []);
	if (opts?.dryRun) {
		const preservePaths = requestedPreservePaths.filter((target) => isPathWithin(target, requestedStateDir));
		const stateRemoval = preservePaths.length > 0 ? await removePathPreserving(requestedStateDir, preservePaths, runtime, {
			dryRun: true,
			label: cleanup.stateDir
		}) : await removePath(cleanup.stateDir, runtime, {
			dryRun: true,
			label: cleanup.stateDir
		});
		const configRemoval = cleanup.configInsideState ? { ok: true } : await removePath(cleanup.configPath, runtime, {
			dryRun: true,
			label: cleanup.configPath
		});
		const oauthRemoval = cleanup.oauthInsideState ? { ok: true } : await removePath(cleanup.oauthDir, runtime, {
			dryRun: true,
			label: cleanup.oauthDir
		});
		return stateRemoval.ok && configRemoval.ok && oauthRemoval.ok;
	}
	if (isUnsafeRemovalTarget(requestedStateDir)) {
		runtime.error(`Refusing to remove unsafe path: ${shortenHomeInString(cleanup.stateDir)}`);
		return false;
	}
	const lock = await acquireStateCleanupOwnership(cleanup);
	let lockHeld = true;
	let stateCoordinator;
	const releaseLock = async () => {
		if (!lockHeld) return;
		lockHeld = false;
		await lock.release();
	};
	const releaseStateCoordinator = () => {
		const held = stateCoordinator;
		stateCoordinator = void 0;
		held?.release();
	};
	try {
		const stateDir = lock.stateDir;
		if (isUnsafeRemovalTarget(stateDir)) throw new Error(`Refusing to remove unsafe path: ${shortenHomeInString(stateDir)}`);
		const lockDir = path.dirname(lock.stateLockPath);
		if (!isPathWithin(lockDir, stateDir)) throw new Error("Cannot remove OpenClaw state because its active lock is outside state.");
		const databasePath = resolveOpenClawStateSqlitePath({
			...process.env,
			OPENCLAW_STATE_DIR: stateDir
		});
		stateCoordinator = await acquireOpenClawStateDatabaseFileExclusion(databasePath);
		const preservePaths = requestedPreservePaths.map((target) => isPathWithin(target, requestedStateDir) ? path.join(stateDir, path.relative(requestedStateDir, target)) : target).filter((target) => isPathWithin(target, stateDir));
		const overlappingPreservePath = preservePaths.find((target) => isPathWithin(target, lockDir) || isPathWithin(lockDir, target));
		if (overlappingPreservePath) throw new Error(`Cannot remove OpenClaw state while preserving ${shortenHomeInString(overlappingPreservePath)} because it overlaps the active state lock. Move the workspace outside the lock directory and retry.`);
		if (!(await removePathPreserving(stateDir, [...preservePaths, lockDir], runtime, { label: cleanup.stateDir })).ok) throw new Error("Failed to remove non-preserved OpenClaw state while ownership was held.");
		await lock.releaseInTree();
		const lockTombstone = await detachStateLockDirectory(lockDir, stateDir, runtime);
		if (!(await removePath(lockTombstone, runtime, { label: "detached state locks" })).ok) throw new Error(`Failed to remove detached state locks at ${lockTombstone}.`);
		const stateDirRemoved = await removeEmptyStateAncestors(path.dirname(lockDir), stateDir);
		if (await pathExists(lockDir) || preservePaths.length === 0 && !stateDirRemoved) throw new Error("OpenClaw state cleanup was interrupted by a new state operation. Stop other OpenClaw commands and retry.");
		if (stateDirRemoved) await removeStateDirectoryAlias(requestedStateDir, stateDir);
		await removeLinkedCleanupPaths(cleanup, runtime);
		return true;
	} finally {
		try {
			releaseStateCoordinator();
		} finally {
			await releaseLock();
		}
	}
}
/** Remove all workspace directories selected by the cleanup plan. */
async function removeWorkspaceDirs(workspaceDirs, runtime, opts) {
	const failures = /* @__PURE__ */ new Set();
	const attempt = async (label, action) => {
		try {
			return await action();
		} catch (error) {
			failures.add(label);
			runtime.error?.(`Failed to clean up ${shortenHomeInString(label)}: ${String(error)}`);
			return;
		}
	};
	for (const workspace of workspaceDirs) {
		const legacyLabel = `${workspace} (retired workspace state)`;
		const stateLabel = `${workspace} (workspace state)`;
		const legacyPlan = await attempt(legacyLabel, () => prepareLegacyWorkspaceStateReset(workspace));
		const statePlan = opts?.removeStateRows ? await attempt(stateLabel, () => prepareWorkspaceStateDeletion(workspace)) : void 0;
		if (!(opts?.preserveWorkspace ? { ok: true } : opts?.removeWorkspace ? { ok: await attempt(workspace, () => opts.removeWorkspace(workspace)) === true } : await removePath(workspace, runtime, {
			dryRun: opts?.dryRun,
			label: workspace
		})).ok) {
			failures.add(workspace);
			continue;
		}
		if (legacyPlan) {
			const legacyCleanup = await attempt(legacyLabel, () => removeLegacyWorkspaceStateForReset(legacyPlan, opts?.dryRun ? { dryRun: true } : void 0));
			if (legacyCleanup) {
				if (opts?.dryRun) for (const removedPath of legacyCleanup.removedPaths) runtime.log(`[dry-run] remove ${shortenHomeInString(removedPath)}`);
				for (const warning of legacyCleanup.warnings) {
					(opts?.removeWorkspace ? runtime.log : runtime.error)(warning);
					failures.add(warning);
				}
			}
		}
		if (!opts?.dryRun && statePlan) await attempt(stateLabel, () => deleteWorkspaceState(statePlan));
	}
	return [...failures];
}
/** List per-agent session directories beneath a state directory. */
async function listAgentSessionDirs(stateDir) {
	const root = path.join(stateDir, "agents");
	try {
		return (await fs.readdir(root, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => path.join(root, entry.name, "sessions")).toSorted();
	} catch (error) {
		if (error.code === "ENOENT") return [];
		throw error;
	}
}
//#endregion
export { moveToTrashResult as a, removeWorkspaceDirs as c, moveToTrash as i, trashAllowedRoots as l, isPathWithin as n, removePath as o, listAgentSessionDirs as r, removeStateAndLinkedPaths as s, buildCleanupPlan as t };
