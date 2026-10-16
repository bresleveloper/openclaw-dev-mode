import { l as movePathToTrash } from "./fs-safe-BUXBSN-4.mjs";
import { t as resolveIdentityPathViaExistingAncestorSync } from "./boundary-path-CAv_plX7.mjs";
import { r as isMissingPathError } from "./errno-FR4CRyya.mjs";
import { d as resolveHomeDir, f as shortenHomeInString, p as shortenHomePath } from "./utils-DgZn2dLu.mjs";
import { v as resolveGatewayLockDir } from "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { p as prepareOpenClawStateDatabaseRemoval } from "./openclaw-state-db-cache-BKCnj4of.mjs";
import { d as resolveAgentWorkspaceDir } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { t as resolveDefaultAgentWorkspaceDir } from "./workspace-default-path-Cwkw6Ed6.mjs";
import "./workspace-default-BKv26wgx.mjs";
import { n as GatewayLockError, r as acquireGatewayLock } from "./gateway-lock-B6mKYs2x.mjs";
import { l as prepareLegacyWorkspaceStateReset, u as removeLegacyWorkspaceStateForReset } from "./workspace-legacy-state-CfAX5lfc.mjs";
import { i as prepareWorkspaceStateDeletion, n as deleteWorkspaceState } from "./workspace-state-store-DCCJC3M9.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { hasNodeErrorCode, isPathInside } from "@openclaw/fs-safe/path";
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
		const allowedRoots = trashAllowedRoots([sourcePath], isSymbolicLink ? await fs.realpath(sourcePath).catch(() => void 0) : void 0);
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
		configInsideState: isPathInside(params.stateDir, params.configPath),
		oauthInsideState: isPathInside(params.stateDir, params.oauthDir),
		workspaceDirs: collectWorkspaceDirs(params.cfg)
	};
}
function isUnsafeRemovalTarget(target) {
	if (!target.trim()) return true;
	const resolved = path.resolve(target);
	if (resolved === path.parse(resolved).root) return true;
	const home = resolveHomeDir();
	if (home && resolved === path.resolve(home)) return true;
	if (isPathInside(resolved, path.resolve(process.cwd()))) return true;
	return false;
}
/** Remove one path after rejecting empty/root/home targets and honoring dry-run mode. */
async function removePath(target, runtime, opts) {
	return removePathPreserving(target, [], runtime, opts);
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
			role: "sqlite-maintenance",
			timeoutMs: STATE_CLEANUP_LOCK_TIMEOUT_MS
		});
	} catch (error) {
		if (error instanceof GatewayLockError) throw new Error("Cannot remove OpenClaw state while the Gateway or another state maintenance command owns this state directory. Stop the Gateway and retry.", { cause: error });
		throw error;
	}
	if (!lock) throw new Error("Cannot remove OpenClaw state without exclusive state ownership.");
	return lock;
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
	if (preservePaths.some((preservePath) => isPathInside(preservePath, resolved))) return { ok: true };
	const nestedPreservedPaths = preservePaths.filter((preservePath) => isPathInside(resolved, preservePath));
	if (opts?.dryRun) {
		const suffix = nestedPreservedPaths.length ? ` preserving ${nestedPreservedPaths.map((preservePath) => shortenHomeInString(preservePath)).join(", ")}` : "";
		runtime.log(`[dry-run] remove ${displayLabel}${suffix}`);
		return { ok: true };
	}
	try {
		if (nestedPreservedPaths.length > 0 && (await fs.lstat(resolved)).isDirectory()) {
			for (const entry of await fs.readdir(resolved)) {
				const result = await removePathPreserving(path.join(resolved, entry), preservePaths, runtime);
				if (!result.ok) return result;
			}
			runtime.log(`Removed contents of ${displayLabel}`);
		} else {
			await fs.rm(resolved, {
				recursive: true,
				force: true
			});
			runtime.log(`Removed ${displayLabel}`);
		}
		return { ok: true };
	} catch (err) {
		runtime.error(`Failed to remove ${displayLabel}: ${String(err)}`);
		return { ok: false };
	}
}
async function removeStateDirectoryAlias(requestedStateDir, stateDir, assertCurrent) {
	if (requestedStateDir === stateDir) return;
	try {
		if ((await fs.lstat(requestedStateDir)).isSymbolicLink()) {
			assertCurrent();
			await fs.unlink(requestedStateDir);
		}
	} catch (error) {
		if (!hasNodeErrorCode(error, "ENOENT")) throw error;
	}
}
function stateCleanupInterrupted() {
	return /* @__PURE__ */ new Error("OpenClaw state cleanup was interrupted by a new state operation. Stop other OpenClaw commands and retry.");
}
async function captureStateCleanupAncestors(lockDirs, stateDir) {
	const directories = /* @__PURE__ */ new Map();
	for (const lockDir of lockDirs) for (let current = lockDir; isPathInside(stateDir, current); current = path.dirname(current)) {
		if (!directories.has(current)) {
			const observed = await fs.lstat(current, { bigint: true });
			if (!observed.isDirectory()) throw new Error(`Cannot remove OpenClaw state because its active lock directory is redirected or not a real directory: ${shortenHomeInString(current)}. Restore a real lock directory and retry.`);
			directories.set(current, {
				path: current,
				dev: observed.dev,
				ino: observed.ino
			});
		}
		if (current === stateDir) break;
	}
	return [...directories.values()].toSorted((left, right) => right.path.length - left.path.length);
}
async function removeEmptyStateAncestors(directories) {
	for (const expected of directories) try {
		const observed = await fs.lstat(expected.path, { bigint: true });
		if (!observed.isDirectory() || observed.dev !== expected.dev || observed.ino !== expected.ino) throw stateCleanupInterrupted();
		await fs.rmdir(expected.path);
	} catch (error) {
		if (hasNodeErrorCode(error, "ENOENT")) continue;
		if (hasNodeErrorCode(error, "ENOTEMPTY") || hasNodeErrorCode(error, "EEXIST")) continue;
		throw error;
	}
}
function linkedCleanupPaths(cleanup) {
	return [cleanup.configInsideState ? void 0 : cleanup.configPath, cleanup.oauthInsideState ? void 0 : cleanup.oauthDir].filter((target) => target !== void 0);
}
async function resolveLinkedCleanupPath(target, lockPaths) {
	if (!await pathExists(target)) return;
	const entry = await resolveMoveToTrashSourcePath(path.resolve(target));
	if (lockPaths.some((lockPath) => isPathInside(entry, lockPath))) throw new Error(`Cannot remove linked cleanup path ${shortenHomeInString(target)} because it contains an active state lock. Move the linked path outside the lock directory and retry.`);
	return entry;
}
async function removeLinkedCleanupPaths(cleanup, runtime, lockPaths, assertCurrent) {
	for (const target of linkedCleanupPaths(cleanup)) {
		const entry = await resolveLinkedCleanupPath(target, lockPaths);
		assertCurrent();
		if (entry && !(await removePath(entry, runtime, { label: target })).ok) throw new Error(`Failed to remove linked cleanup path: ${shortenHomeInString(target)}`);
	}
}
/** Remove state plus config/OAuth paths, preserving selected paths nested inside state. */
async function removeStateAndLinkedPaths(cleanup, runtime, opts) {
	const requestedStateDir = path.resolve(cleanup.stateDir);
	const requestedPreservePaths = opts?.dryRun ? (opts.preservePaths ?? []).map((target) => path.resolve(target)) : await existingPaths(opts?.preservePaths ?? []);
	if (opts?.dryRun) {
		const preservePaths = requestedPreservePaths.filter((target) => isPathInside(requestedStateDir, target));
		const stateRemoval = await removePathPreserving(preservePaths.length > 0 ? requestedStateDir : cleanup.stateDir, preservePaths, runtime, {
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
	let removalAdmission;
	const releaseLock = async () => {
		if (!lockHeld) return;
		lockHeld = false;
		await lock.release();
	};
	const releaseRemovalAdmission = () => {
		const held = removalAdmission;
		removalAdmission = void 0;
		held?.release();
	};
	try {
		const stateDir = lock.stateDir;
		if (isUnsafeRemovalTarget(stateDir)) throw new Error(`Refusing to remove unsafe path: ${shortenHomeInString(stateDir)}`);
		const lockPaths = await Promise.all([.../* @__PURE__ */ new Set([lock.lockPath, lock.stateLockPath])].map(resolveMoveToTrashSourcePath));
		const lockDirs = [...new Set(lockPaths.map((lockPath) => path.dirname(lockPath)))];
		for (const target of linkedCleanupPaths(cleanup)) await resolveLinkedCleanupPath(target, lockPaths);
		lock.assertCurrent();
		const databasePath = resolveOpenClawStateSqlitePath({
			...process.env,
			OPENCLAW_STATE_DIR: stateDir
		});
		if (resolveIdentityPathViaExistingAncestorSync(databasePath) !== databasePath) throw new Error("Cannot remove OpenClaw state because its active database path is redirected. Select the actual state directory before retrying cleanup.");
		const directories = await captureStateCleanupAncestors([
			...lockDirs,
			path.dirname(lock.stateLockPath),
			...process.platform === "win32" ? [] : [resolveGatewayLockDir(stateDir)]
		], stateDir);
		lock.assertCurrent();
		removalAdmission = await lock.run(() => prepareOpenClawStateDatabaseRemoval(databasePath, lock.assertCurrent));
		const preservePaths = requestedPreservePaths.map((target) => isPathInside(requestedStateDir, target) ? path.join(stateDir, path.relative(requestedStateDir, target)) : target).filter((target) => isPathInside(stateDir, target));
		const overlappingPreservePath = preservePaths.find((target) => lockDirs.some((lockDir) => isPathInside(lockDir, target) || isPathInside(target, lockDir)));
		if (overlappingPreservePath) throw new Error(`Cannot remove OpenClaw state while preserving ${shortenHomeInString(overlappingPreservePath)} because it overlaps the active state lock. Move the workspace outside the lock directory and retry.`);
		removalAdmission.assertCurrent();
		if (!(await removePathPreserving(stateDir, [...preservePaths, ...lockPaths], runtime, { label: cleanup.stateDir })).ok) throw new Error("Failed to remove non-preserved OpenClaw state while ownership was held.");
		removalAdmission.assertCurrent();
		await removeLinkedCleanupPaths(cleanup, runtime, lockPaths, lock.assertCurrent);
		if (preservePaths.length === 0) {
			removalAdmission.assertCurrent();
			await removeStateDirectoryAlias(requestedStateDir, stateDir, lock.assertCurrent);
		}
		removalAdmission.assertCurrent();
		await releaseLock();
		await removeEmptyStateAncestors(directories);
		if ((await Promise.all([...lockPaths, ...lockDirs.filter((lockDir) => isPathInside(stateDir, lockDir))].map(pathExists))).some(Boolean) || preservePaths.length === 0 && await pathExists(stateDir)) throw stateCleanupInterrupted();
		return true;
	} finally {
		try {
			releaseRemovalAdmission();
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
/** Reset canonical session history while preserving each database's unrelated state. */
async function removeAgentSessions(cleanup, runtime, opts) {
	const { previewSessionStoreReset, resetSessionStore } = await import("./session-accessor.sqlite-reset-CqzxZAab.mjs");
	const { resolveAllAgentSessionStoreTargetsSync } = await import("./targets-Be8sKF4o.mjs");
	const lock = opts?.dryRun ? void 0 : await acquireStateCleanupOwnership(cleanup);
	const resetStores = async () => {
		const failures = [];
		for (const target of resolveAllAgentSessionStoreTargetsSync(cleanup.cfg)) try {
			const preview = previewSessionStoreReset(target);
			const label = shortenHomePath(preview.databasePath);
			if (opts?.dryRun) {
				runtime.log(`[dry-run] remove session history from ${label}: ${preview.sessionKeys.length} sessions, ${preview.transcriptCount} transcripts, ${preview.archiveCount} retained archives`);
				for (const sessionKey of preview.sessionKeys) runtime.log(`[dry-run] remove session ${sessionKey}`);
				for (const artifact of preview.artifactPaths) runtime.log(`[dry-run] remove ${shortenHomePath(artifact)}`);
			} else {
				await resetSessionStore(target);
				runtime.log(`Removed session history from ${label}`);
			}
		} catch (error) {
			failures.push(`${shortenHomePath(target.storePath)}: ${String(error)}`);
		}
		if (failures.length > 0) throw new Error(failures.join("\n"));
	};
	try {
		await (lock ? lock.run(resetStores) : resetStores());
	} finally {
		await lock?.release();
	}
}
//#endregion
export { removePath as a, trashAllowedRoots as c, removeAgentSessions as i, moveToTrash as n, removeStateAndLinkedPaths as o, moveToTrashResult as r, removeWorkspaceDirs as s, buildCleanupPlan as t };
