import { d as sameFileIdentity } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { w as root } from "./fs-safe-BAPek8At.mjs";
import { r as isMissingPathError, t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { r as getChildLogger } from "./logger--ALOusOG.mjs";
import { a as isSqliteLockError, o as isSqliteNativeOpenFailure } from "./sqlite-error-diagnostics-C8UyxYRx.mjs";
import { g as acquireSqliteStagingToken, h as SqliteStagingRetiredError, m as SQLITE_STAGING_TOKEN_FILES } from "./sqlite-readonly-location-cleanup-uwwsHidB.mjs";
import { c as createPrivateSqliteTempDirectory } from "./sqlite-snapshot-staging-BNvNaOwn.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import os from "node:os";
//#region src/infra/backup-scratch.ts
const scratchName = /^openclaw-backup-(?:owned-|retired-)?(?:[A-Za-z0-9]{6}|[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12})$/u;
const ownedPrefix = "openclaw-backup-owned-";
const retiredPrefix = "openclaw-backup-retired-";
async function createBackupScratchDirectory(root$1) {
	for (let attempt = 0;; attempt += 1) {
		const directory = await createPrivateSqliteTempDirectory(root$1, ownedPrefix);
		let boundary;
		try {
			boundary = await root(directory);
			const observed = await fs$1.lstat(directory);
			if (!observed.isDirectory() || !sameFileIdentity(observed, await boundary.stat("."))) throw new Error("Backup scratch directory identity changed");
			return {
				directory,
				boundary,
				release: acquireSqliteStagingToken(directory, "create")
			};
		} catch (error) {
			if (isSqliteLockError(error) || error instanceof SqliteStagingRetiredError || isMissingPathError(error) || isSqliteNativeOpenFailure(error) && await wasScratchReclaimed(directory)) {
				if (attempt < 2) continue;
				throw error;
			}
			await cleanupBackupScratchDirectory(directory, boundary);
			throw error;
		}
	}
}
function reportScratchMessage(message, log, level = "warn") {
	try {
		if (log) {
			log(message);
			return;
		}
	} catch {}
	try {
		getChildLogger({ subsystem: "infra/backup" })[level](message);
	} catch {}
}
async function wasScratchReclaimed(directory) {
	try {
		await fs$1.lstat(directory);
		return false;
	} catch (inspectionError) {
		return isMissingPathError(inspectionError);
	}
}
async function inspectScratchPayload(directory, layout = "root") {
	for (const name of await fs$1.readdir(directory)) {
		const location = path.join(directory, name);
		const item = await fs$1.lstat(location);
		if (process.getuid && item.uid !== process.getuid()) throw new Error(`Scratch file ownership is unknown: ${location}`);
		if (item.isDirectory()) {
			const nested = layout === "root" && /^state-snapshot-(?:no-legacy|attempt-[1-3])$/u.test(name) ? "snapshot" : layout === "snapshot" && name === "legacy-verification" ? "verification" : layout !== "sqlite" && /^\.sqlite-(?:snapshot-|publish-[\da-f-]{36}-)(?:[A-Za-z0-9]{6}|[\da-f-]{36})$/u.test(name) ? "sqlite" : void 0;
			if (nested) {
				await inspectScratchPayload(location, nested);
				continue;
			}
		} else if (item.isFile() && (layout === "root" && (SQLITE_STAGING_TOKEN_FILES.some((control) => control === name) || /^config-\d+$/u.test(name)) || (layout === "sqlite" ? /^database\.sqlite(?:-wal|-shm|-journal)?$/u.test(name) : /^(?:openclaw-state-db-\d+\.sqlite(?:-wal|-shm|-journal)?|legacy-audit-raw-\d+\.jsonl)$/u.test(name)))) continue;
		throw new Error(`Unrecognized backup scratch content: ${location}`);
	}
}
async function removeBackupScratchPayload(boundary) {
	for await (const entry of boundary.entries(".")) if (!SQLITE_STAGING_TOKEN_FILES.some((control) => control === entry.name)) await boundary.remove(entry.name, {
		recursive: true,
		force: true,
		mutationSymlinks: "reject",
		maxEntries: Infinity,
		maxDepth: Infinity
	});
}
async function cleanupBackupScratchDirectory(initialDirectory, initialBoundary, log) {
	let directory = initialDirectory;
	let boundary = initialBoundary;
	try {
		if (boundary && !path.basename(directory).startsWith(retiredPrefix)) {
			const expected = await boundary.stat(".");
			const parent = await root(path.dirname(directory));
			const retiredPath = await createPrivateSqliteTempDirectory(parent.rootReal, retiredPrefix);
			const retiredName = path.basename(retiredPath);
			const reservation = await fs$1.lstat(retiredPath);
			await parent.move(path.basename(directory), retiredName, {
				overwrite: true,
				mutationSymlinks: "reject",
				assertBeforeMutation: () => {
					const current = fs.lstatSync(directory);
					const destination = fs.lstatSync(retiredPath);
					if (!current.isDirectory() || !sameFileIdentity(expected, current) || !destination.isDirectory() || !sameFileIdentity(reservation, destination)) throw new Error("Backup scratch directory identity changed");
				}
			});
			directory = path.join(parent.rootReal, retiredName);
			boundary = await root(directory);
			if (!sameFileIdentity(expected, await boundary.stat("."))) throw new Error("Retired backup scratch directory identity changed");
		}
		if (boundary) {
			for (const control of SQLITE_STAGING_TOKEN_FILES) await boundary.remove(control, {
				force: true,
				mutationSymlinks: "reject"
			});
			await boundary.stat(".");
		}
		await fs$1.rmdir(directory);
		return { status: "reclaimed" };
	} catch (error) {
		if (await wasScratchReclaimed(directory)) return {
			status: "already-reclaimed",
			directory
		};
		const warning = `Backup scratch cleanup failed at ${directory}: ${formatErrorMessage(error)}. Run \`openclaw doctor --fix\` to retry cleanup.`;
		reportScratchMessage(warning, log);
		return {
			status: "failed",
			warning
		};
	}
}
async function finishBackupScratch(scratch, log) {
	let retirementFailure;
	try {
		scratch.release = scratch.release.beginRetirement();
		await removeBackupScratchPayload(scratch.boundary);
		scratch.release(true);
	} catch (error) {
		retirementFailure = error;
	}
	try {
		scratch.release();
	} catch (error) {
		retirementFailure ??= error;
	}
	if (retirementFailure) {
		const warning = `Backup scratch retirement failed at ${scratch.directory}: ${formatErrorMessage(retirementFailure)}. Scratch was preserved.`;
		reportScratchMessage(warning, log);
		return warning;
	}
	const cleanup = await cleanupBackupScratchDirectory(scratch.directory, scratch.boundary, log);
	if (cleanup.status === "already-reclaimed") reportScratchMessage(`Backup scratch already reclaimed: ${cleanup.directory}`, log, "info");
	return cleanup.status === "failed" ? cleanup.warning : void 0;
}
/** The transaction, not age or a successful archive record, fences live scratch. */
async function maintainBackupScratch(params) {
	const report = {
		reclaimed: [],
		alreadyReclaimed: [],
		active: [],
		unchecked: [],
		warnings: []
	};
	const roots = /* @__PURE__ */ new Set();
	for (const root of params.roots ?? [os.tmpdir()]) try {
		roots.add(await fs$1.realpath(root));
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) report.warnings.push(`Cannot inspect backup scratch in ${root}: ${formatErrorMessage(error)}`);
	}
	for (const root$2 of roots) try {
		for (const entry of await fs$1.readdir(root$2, { withFileTypes: true })) {
			if (!scratchName.test(entry.name)) continue;
			const directory = path.join(root$2, entry.name);
			if (!entry.isDirectory()) {
				report.warnings.push(`Backup scratch entry preserved at ${directory}: not a directory. Inspect it before manual cleanup.`);
				continue;
			}
			let release;
			try {
				const before = await fs$1.lstat(directory);
				if (!before.isDirectory() || process.getuid && before.uid !== process.getuid()) continue;
				const token = await fs$1.lstat(path.join(directory, SQLITE_STAGING_TOKEN_FILES[0])).catch((error) => {
					if (hasErrnoCode(error, "ENOENT")) return;
					throw error;
				});
				const owned = entry.name.startsWith(ownedPrefix);
				if (!params.repair || !token && !owned) await inspectScratchPayload(directory);
				if (!token && !owned && !entry.name.startsWith(retiredPrefix)) {
					report.warnings.push(`Legacy backup scratch at ${directory} has no lifetime token. Confirm older backup processes have stopped before removing it.`);
					continue;
				}
				if (!params.repair) {
					report.unchecked.push(directory);
					continue;
				}
				if (token || owned) release = acquireSqliteStagingToken(directory, "reclaim", { allowMissing: owned });
				const boundary = await root(directory);
				const current = await fs$1.lstat(directory);
				if (!current.isDirectory() || !sameFileIdentity(before, current) || !sameFileIdentity(before, await boundary.stat("."))) throw new Error("Scratch directory identity changed");
				await inspectScratchPayload(directory);
				await removeBackupScratchPayload(boundary);
				release?.(true);
				const cleanup = await cleanupBackupScratchDirectory(directory, boundary, () => {});
				if (cleanup.status === "failed") report.warnings.push(cleanup.warning);
				else if (cleanup.status === "already-reclaimed") report.alreadyReclaimed.push(cleanup.directory);
				else report.reclaimed.push(directory);
			} catch (error) {
				if (isSqliteLockError(error)) report.active.push(directory);
				else if (await wasScratchReclaimed(directory)) report.alreadyReclaimed.push(directory);
				else report.warnings.push(`Backup scratch preserved at ${directory}: ${formatErrorMessage(error)}`);
			} finally {
				try {
					release?.();
				} catch (error) {
					report.warnings.push(`Backup scratch token release failed at ${directory}: ${formatErrorMessage(error)}`);
				}
			}
		}
	} catch (error) {
		report.warnings.push(`Cannot inspect backup scratch in ${root$2}: ${formatErrorMessage(error)}`);
	}
	for (const warning of report.warnings) reportScratchMessage(warning, params.log);
	for (const directory of report.alreadyReclaimed) reportScratchMessage(`Backup scratch already reclaimed: ${directory}`, params.log, "info");
	return report;
}
//#endregion
export { finishBackupScratch as n, maintainBackupScratch as r, createBackupScratchDirectory as t };
