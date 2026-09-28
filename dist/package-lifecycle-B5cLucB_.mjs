import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as PACKAGE_LIFECYCLE_MARKER_CONTRACT_RELATIVE_PATH, r as PACKAGE_LIFECYCLE_PENDING_RELATIVE_PATH, t as LEGACY_PACKAGE_INSTALL_GUARD_RELATIVE_PATH } from "./package-lifecycle-marker-DhfhzqrA.mjs";
import { r as isPidAlive, t as getFileLockProcessStartTime } from "./pid-alive-CXdZEzr_.mjs";
import { n as asFsSafeFileLockRoot, r as createFileLockManager } from "./file-lock-manager-xRAOv56w.mjs";
import { w as root } from "./fs-safe-BAPek8At.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { spawnSync } from "node:child_process";
//#region src/infra/package-lifecycle.ts
const PACKAGE_LIFECYCLE_LOCK_RELATIVE_PATH = ".openclaw-lifecycle-lock";
const DEFAULT_PACKAGE_LIFECYCLE_SCRIPT_TIMEOUT_MS = 12e5;
const PACKAGE_LIFECYCLE_LOCK_POLL_MS = 100;
const PACKAGE_LIFECYCLE_LOCK_WAIT_GRACE_MS = 12e5;
const lifecycleLocks = createFileLockManager("openclaw.package-lifecycle");
/** Ownership is uncertain: callers must preserve the package until its writers settle. */
var PackageLifecycleOwnershipError = class extends Error {
	constructor(packageRoot, reason, cause) {
		const lockPath = path.join(packageRoot, PACKAGE_LIFECYCLE_LOCK_RELATIVE_PATH);
		super(`OpenClaw package lifecycle ownership is uncertain (${reason}). Preserved package: ${packageRoot}. Wait for its lifecycle writers to settle before retrying or recovering ${lockPath}; lock age or a dead parent alone does not establish settlement.`, { cause });
		this.name = "PackageLifecycleOwnershipError";
		this.packageRoot = packageRoot;
		this.lockPath = lockPath;
	}
};
function parseLifecycleLockOwner(raw) {
	try {
		const owner = asNullableRecord(JSON.parse(raw));
		return owner?.kind === "openclaw-package-lifecycle" && owner.version === 1 && typeof owner.pid === "number" && Number.isSafeInteger(owner.pid) && owner.pid > 0 && typeof owner.starttime === "number" && Number.isFinite(owner.starttime) && owner.starttime >= 0 ? {
			pid: owner.pid,
			starttime: owner.starttime
		} : null;
	} catch {
		return null;
	}
}
const PACKAGE_LIFECYCLE_SCRIPTS = [{
	name: "preinstall",
	relativePath: path.join("scripts", "preinstall-package-manager-warning.mjs")
}, {
	name: "postinstall",
	relativePath: path.join("scripts", "postinstall-bundled-plugins.mjs")
}];
function resolveLifecycleBudgetMs(scriptTimeoutMs) {
	return scriptTimeoutMs * PACKAGE_LIFECYCLE_SCRIPTS.length;
}
function hasErrorCode(error, code) {
	return error instanceof Error && "code" in error && error.code === code;
}
async function pathExists(filePath) {
	try {
		await fs.access(filePath);
		return true;
	} catch (error) {
		if (hasErrorCode(error, "ENOENT")) return false;
		throw error;
	}
}
function resolveLifecyclePaths(packageRoot) {
	return {
		packageRoot,
		pending: path.join(packageRoot, PACKAGE_LIFECYCLE_PENDING_RELATIVE_PATH),
		legacyGuard: path.join(packageRoot, LEGACY_PACKAGE_INSTALL_GUARD_RELATIVE_PATH),
		lock: path.join(packageRoot, PACKAGE_LIFECYCLE_LOCK_RELATIVE_PATH)
	};
}
async function bindLifecycleRoot(packageRoot) {
	try {
		return asFsSafeFileLockRoot(await root(packageRoot));
	} catch (error) {
		if (hasErrorCode(error, "not-found")) return;
		throw new PackageLifecycleOwnershipError(packageRoot, "package root cannot be bound", error);
	}
}
async function assertLifecycleRoot(packageRoot, packageDirectory) {
	try {
		await packageDirectory.resolve(".");
	} catch (error) {
		throw new PackageLifecycleOwnershipError(packageRoot, "package root cannot be verified", error);
	}
}
async function isPackageLifecyclePending(paths, packageDirectory) {
	await assertLifecycleRoot(paths.packageRoot, packageDirectory);
	const pending = await pathExists(paths.pending) || await pathExists(paths.legacyGuard);
	await assertLifecycleRoot(paths.packageRoot, packageDirectory);
	return pending;
}
async function assertLifecycleAuthority(paths, packageDirectory, lock) {
	await assertLifecycleRoot(paths.packageRoot, packageDirectory);
	await assertLifecycleLockOwnership(paths.packageRoot, lock);
}
async function ensurePendingMarker(paths, packageDirectory, lock) {
	await assertLifecycleAuthority(paths, packageDirectory, lock);
	try {
		await fs.writeFile(paths.pending, "pending\n", {
			flag: "wx",
			mode: 420
		});
	} catch (error) {
		if (!hasErrorCode(error, "EEXIST")) throw error;
	}
}
async function acquireLifecycleLock(paths, scriptTimeoutMs, waitForOwner = true, lockRoot) {
	const waitBudgetMs = resolveLifecycleBudgetMs(scriptTimeoutMs) + PACKAGE_LIFECYCLE_LOCK_WAIT_GRACE_MS;
	if (!Number.isFinite(scriptTimeoutMs) || scriptTimeoutMs < 0 || !Number.isFinite(waitBudgetMs)) throw new RangeError("Package lifecycle script timeout must be finite and non-negative");
	const waitDeadline = performance.now() + waitBudgetMs;
	while (true) {
		if (performance.now() >= waitDeadline) throw new PackageLifecycleOwnershipError(paths.packageRoot, "admission wait expired");
		const observation = { owner: null };
		try {
			return await lifecycleLocks.acquire(paths.lock, {
				lockPath: paths.lock,
				...lockRoot ? { lockRoot } : {},
				staleMs: 0,
				retry: { retries: 0 },
				staleRecovery: "fail-closed",
				shouldReclaim: () => false,
				retainOnExit: true,
				payload: () => ({
					kind: "openclaw-package-lifecycle",
					version: 1,
					pid: process.pid,
					starttime: getFileLockProcessStartTime(process.pid)
				}),
				parsePayload: (raw) => {
					observation.owner = parseLifecycleLockOwner(raw);
					return observation.owner;
				}
			});
		} catch (error) {
			if (!hasErrorCode(error, "file_lock_timeout")) {
				if (lockRoot) await assertLifecycleRoot(paths.packageRoot, lockRoot);
				try {
					await fs.lstat(paths.lock);
				} catch (inspectionError) {
					if (hasErrorCode(inspectionError, "ENOENT")) throw error;
				}
				throw new PackageLifecycleOwnershipError(paths.packageRoot, "lock cannot be inspected", error);
			}
			if (!waitForOwner) throw new PackageLifecycleOwnershipError(paths.packageRoot, "lifecycle admission prevents stage disposal", error);
			const owner = observation.owner;
			if (!owner || !isPidAlive(owner.pid) || getFileLockProcessStartTime(owner.pid) !== owner.starttime) {
				try {
					await fs.lstat(paths.lock);
				} catch (inspectionError) {
					if (hasErrorCode(inspectionError, "ENOENT")) continue;
				}
				throw new PackageLifecycleOwnershipError(paths.packageRoot, "owner cannot be verified", error);
			}
			const remainingMs = waitDeadline - performance.now();
			if (remainingMs <= 0) throw new PackageLifecycleOwnershipError(paths.packageRoot, "admission wait expired", error);
			await new Promise((resolve) => {
				setTimeout(resolve, Math.min(PACKAGE_LIFECYCLE_LOCK_POLL_MS, remainingMs));
			});
		}
	}
}
function runPackageLifecycleScript(packageRoot, script, timeoutMs) {
	const scriptPath = path.join(packageRoot, script.relativePath);
	const result = spawnSync(process.execPath, [scriptPath], {
		cwd: packageRoot,
		env: process.env,
		stdio: "inherit",
		timeout: timeoutMs
	});
	if (result.error) throw result.error;
	if (result.status !== 0) throw new Error(`OpenClaw package ${script.name} failed${result.signal ? ` with ${result.signal}` : ` with exit code ${result.status ?? "unknown"}`}`);
}
async function assertLifecycleLockOwnership(packageRoot, lock) {
	try {
		if (await lock.verifyStillHeld()) return;
	} catch (error) {
		throw new PackageLifecycleOwnershipError(packageRoot, "ownership check failed", error);
	}
	throw new PackageLifecycleOwnershipError(packageRoot, "lock generation changed");
}
/** Retire discarded private candidates without dispatching their pending scripts. */
async function discardPendingPackageLifecycle(params) {
	const owned = [];
	let failure;
	try {
		for (const packageRoot of params.packageRoots) {
			const paths = resolveLifecyclePaths(path.resolve(packageRoot));
			const packageDirectory = await bindLifecycleRoot(paths.packageRoot);
			if (!packageDirectory) continue;
			const lock = await acquireLifecycleLock(paths, DEFAULT_PACKAGE_LIFECYCLE_SCRIPT_TIMEOUT_MS, false);
			owned.push({
				paths,
				packageDirectory,
				lock,
				retiredWork: false
			});
		}
		for (const entry of owned) for (const marker of [entry.paths.pending, entry.paths.legacyGuard]) {
			await assertLifecycleAuthority(entry.paths, entry.packageDirectory, entry.lock);
			if (await pathExists(marker)) {
				await assertLifecycleAuthority(entry.paths, entry.packageDirectory, entry.lock);
				await fs.rm(marker, { force: true });
				entry.retiredWork = true;
			}
		}
		for (const { paths, packageDirectory, lock } of owned) await assertLifecycleAuthority(paths, packageDirectory, lock);
		await params.discard();
	} catch (error) {
		failure = { error };
		for (const entry of owned) try {
			await assertLifecycleAuthority(entry.paths, entry.packageDirectory, entry.lock);
			if (entry.retiredWork) await ensurePendingMarker(entry.paths, entry.packageDirectory, entry.lock);
		} catch (recoveryError) {
			failure = { error: recoveryError instanceof PackageLifecycleOwnershipError ? recoveryError : new PackageLifecycleOwnershipError(entry.paths.packageRoot, "discarded work cannot be recovered", recoveryError) };
		}
	}
	for (const { paths, lock } of owned.toReversed()) try {
		await lock.release();
	} catch (error) {
		failure = { error: new PackageLifecycleOwnershipError(paths.packageRoot, "lock release failed", error) };
	}
	if (failure) throw failure.error;
}
async function completePendingPackageLifecycle(params) {
	const packageRoot = path.resolve(params.packageRoot);
	const scriptTimeoutMs = params.timeoutMs ?? DEFAULT_PACKAGE_LIFECYCLE_SCRIPT_TIMEOUT_MS;
	const paths = resolveLifecyclePaths(packageRoot);
	const packageDirectory = await bindLifecycleRoot(packageRoot);
	if (!packageDirectory) return false;
	if (!await isPackageLifecyclePending(paths, packageDirectory)) try {
		await fs.lstat(paths.lock);
	} catch (error) {
		if (hasErrorCode(error, "ENOENT")) {
			await assertLifecycleRoot(packageRoot, packageDirectory);
			return false;
		}
		throw new PackageLifecycleOwnershipError(packageRoot, "lock cannot be inspected", error);
	}
	const lock = await acquireLifecycleLock(paths, scriptTimeoutMs, true, packageDirectory);
	const assertOwnership = () => assertLifecycleAuthority(paths, packageDirectory, lock);
	let observedPendingWork = false;
	const completeWhileHeld = async () => {
		observedPendingWork = await isPackageLifecyclePending(paths, packageDirectory);
		if (!observedPendingWork) {
			await assertOwnership();
			return false;
		}
		const finalizeLegacyMarker = !await pathExists(path.join(packageRoot, PACKAGE_LIFECYCLE_MARKER_CONTRACT_RELATIVE_PATH));
		await assertOwnership();
		await ensurePendingMarker(paths, packageDirectory, lock);
		const runScript = params.runScript ?? ((script) => runPackageLifecycleScript(packageRoot, script, scriptTimeoutMs));
		for (const script of PACKAGE_LIFECYCLE_SCRIPTS) {
			await assertOwnership();
			await runScript(script);
		}
		await assertOwnership();
		if (finalizeLegacyMarker) await fs.rm(paths.pending, { force: true });
		if (await isPackageLifecyclePending(paths, packageDirectory)) throw new Error("OpenClaw package postinstall did not complete its lifecycle marker");
		return true;
	};
	let outcome;
	try {
		outcome = { completed: await completeWhileHeld() };
	} catch (error) {
		outcome = { error };
	}
	try {
		await assertOwnership();
	} catch (error) {
		outcome = { error };
	}
	if ("error" in outcome && observedPendingWork) try {
		await ensurePendingMarker(paths, packageDirectory, lock);
	} catch (error) {
		if (error instanceof PackageLifecycleOwnershipError) outcome = { error };
		else try {
			await assertOwnership();
		} catch (ownershipError) {
			outcome = { error: ownershipError };
		}
	}
	try {
		await lock.release();
	} catch (error) {
		if (observedPendingWork) await ensurePendingMarker(paths, packageDirectory, lock).catch(() => void 0);
		throw new PackageLifecycleOwnershipError(packageRoot, "lock release failed", error);
	}
	if ("error" in outcome) throw outcome.error;
	return outcome.completed;
}
//#endregion
export { completePendingPackageLifecycle as n, discardPendingPackageLifecycle as r, PackageLifecycleOwnershipError as t };
