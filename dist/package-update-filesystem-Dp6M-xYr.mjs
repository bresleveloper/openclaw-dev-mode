import { n as isErrno, t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { l as syncDirectory, s as requireDirectorySync } from "./directory-durability-B2RKADOj.mjs";
import { t as retryAsync } from "./retry-DwDRpCWu.mjs";
import { t as retainMutationAuthority } from "./mutation-authority-E8BC9dNY.mjs";
import { t as UPDATE_CLEANUP_BUDGET_MS } from "./update-maintenance-H05X8e5F.mjs";
import { n as isRemovalIoError, r as removePathWithinRoot } from "./fs-safe-remove-DYWyr3qX.mjs";
import { o as packageLauncherDifferences } from "./package-update-integrity-K9gUqAS0.mjs";
import fs from "node:fs";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { FsSafeError } from "@openclaw/fs-safe/errors";
import { movePathWithCopyFallback } from "@openclaw/fs-safe/atomic";
import { root } from "@openclaw/fs-safe/root";
//#region src/infra/package-update-filesystem.ts
const PACKAGE_MANAGER_SWAP_SOURCE_HARDLINKS = "allow";
const log = createSubsystemLogger("update/package-launchers");
function assertPackagePathIdentity(filePath, expected) {
	let current;
	try {
		current = fs.lstatSync(filePath, {
			bigint: true,
			throwIfNoEntry: false
		});
	} catch (cause) {
		throw new FsSafeError("path-mismatch", `package path could not be verified: ${filePath}`, { cause: cause instanceof Error ? cause : void 0 });
	}
	if (expected ? !current || current.dev !== expected.dev || current.ino !== expected.ino || current.isDirectory() !== expected.isDirectory() || current.isSymbolicLink() !== expected.isSymbolicLink() || process.platform === "win32" && (current.dev === 0n || current.ino === 0n || expected.dev === 0n || expected.ino === 0n) : current !== void 0) throw new FsSafeError("path-mismatch", `package path changed: ${filePath}`);
}
function createPackagePathAssertion(filePath, expected, assertParents) {
	return () => {
		assertParents();
		assertPackagePathIdentity(filePath, expected);
	};
}
async function packagePathEntryExists(targetPath) {
	try {
		await fs$1.lstat(targetPath);
		return true;
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return false;
		throw error;
	}
}
async function packagePathEntriesMatch(left, right) {
	const [leftStat, rightStat] = await Promise.all([fs$1.lstat(left).catch(() => null), fs$1.lstat(right).catch(() => null)]);
	if (!leftStat || !rightStat) return false;
	if (leftStat.isSymbolicLink() || rightStat.isSymbolicLink()) return leftStat.isSymbolicLink() && rightStat.isSymbolicLink() && await fs$1.readlink(left) === await fs$1.readlink(right);
	if (!leftStat.isFile() || !rightStat.isFile()) return false;
	if ((leftStat.mode & 511) !== (rightStat.mode & 511) || leftStat.size !== rightStat.size) return false;
	const [leftContents, rightContents] = await Promise.all([fs$1.readFile(left), fs$1.readFile(right)]);
	return leftContents.equals(rightContents);
}
async function activateStagedNpmPackageRoot(source, destination, assertCurrent) {
	if (assertCurrent) {
		retainMutationAuthority(assertCurrent)();
		await fs$1.rename(source, destination);
		return;
	}
	if (!(await fs$1.lstat(source)).isSymbolicLink()) {
		await movePathWithCopyFallback({
			from: source,
			sourceHardlinks: PACKAGE_MANAGER_SWAP_SOURCE_HARDLINKS,
			to: destination
		});
		return;
	}
	const canonicalSource = await fs$1.realpath(source);
	await fs$1.symlink(canonicalSource, destination, process.platform === "win32" ? "junction" : void 0);
}
async function backupNpmPackageRoot(source, destination, assertCaller, warnings, platform = process.platform) {
	if (platform !== "win32") {
		await fs$1.rename(source, destination);
		return;
	}
	await renamePackageRootWithWindowsRetries(source, destination, retainMutationAuthority(assertCaller ?? (() => {})), {
		operation: "backup",
		warn: (message) => warnings.push(message)
	});
}
/**
* Shared bounded Windows retries for guarded package-root renames: transient
* AV/indexer denials are retried with authority and path-identity checks while
* permanent failures stay failures. Package backup and rollback publication/
* compensation renames share this one implementation; callers keep their own
* operation-specific diagnostics through `operation` and `warn`.
*/
async function renamePackageRootWithWindowsRetries(source, destination, assertCurrent, options) {
	const sourceIdentity = fs.lstatSync(source, { bigint: true });
	const parent = path.dirname(source);
	const parentIdentity = fs.lstatSync(parent, { bigint: true });
	let renameFailure;
	let attempts = 0;
	try {
		await retryAsync(async () => {
			renameFailure = void 0;
			assertCurrent();
			assertPackagePathIdentity(parent, parentIdentity);
			assertPackagePathIdentity(source, sourceIdentity);
			assertPackagePathIdentity(destination, void 0);
			attempts++;
			try {
				await fs$1.rename(source, destination);
			} catch (error) {
				renameFailure = error;
				throw error;
			}
		}, {
			attempts: 16,
			minDelayMs: 250,
			maxDelayMs: 5e3,
			shouldRetry: (error) => error === renameFailure && [
				"EPERM",
				"EBUSY",
				"EACCES"
			].some((code) => hasErrnoCode(error, code)),
			onRetry: ({ err, attempt, maxAttempts, delayMs }) => {
				if (options.warn) options.warn(`Windows package ${options.operation} rename ${source} -> ${destination} failed: ${formatErrorMessage(err)}; retry ${attempt + 1}/${maxAttempts} in ${delayMs}ms.`);
			}
		});
	} catch (error) {
		if (error !== renameFailure) throw error;
		throw Object.assign(new Error(`Windows package ${options.operation} rename failed after ${attempts} attempts: ${source} -> ${destination}: ${formatErrorMessage(error)}. Close processes holding this installation and check its permissions before retrying.`, { cause: error }), { code: isErrno(error) ? error.code : void 0 });
	}
}
function removePackagePath(target, assertCurrent = () => {}, signal) {
	const assertOwner = retainMutationAuthority(assertCurrent);
	assertOwner();
	if (!fs.lstatSync(target, { throwIfNoEntry: false })) return Promise.resolve();
	return removePathWithinRoot({
		rootDir: path.dirname(target),
		relativePath: path.basename(target),
		recursive: true,
		force: true,
		symlinks: "unlink",
		assertBeforeMutation: assertOwner,
		signal
	});
}
async function copyPackagePathEntry(source, destination, assertCaller = () => {}, beforePublish) {
	const assertCurrent = retainMutationAuthority(assertCaller);
	assertCurrent();
	const sourceIdentity = fs.lstatSync(source, { bigint: true });
	if (sourceIdentity.isDirectory() && beforePublish) throw new Error("Journal-owned launcher publication requires a file or symlink.");
	const destinationParent = await fs$1.realpath(path.dirname(destination));
	assertCurrent();
	const parentIdentity = fs.lstatSync(destinationParent, { bigint: true });
	if (!parentIdentity.isDirectory() || parentIdentity.isSymbolicLink()) throw new FsSafeError("path-mismatch", "package destination parent changed");
	const target = path.join(destinationParent, path.basename(destination));
	let destinationIdentity = fs.lstatSync(target, {
		bigint: true,
		throwIfNoEntry: false
	});
	const assertParent = retainMutationAuthority(() => {
		assertCurrent();
		assertPackagePathIdentity(destinationParent, parentIdentity);
	});
	assertParent();
	const staging = await fs$1.mkdtemp(path.join(destinationParent, ".openclaw-shim-stage-"));
	const stagingIdentity = fs.lstatSync(staging, { bigint: true });
	const staged = path.join(staging, "entry");
	const assertStaging = createPackagePathAssertion(staging, stagingIdentity, assertParent);
	let failure;
	try {
		const stagedRoot = await root(staging, { assertBeforeMutation: assertStaging });
		assertStaging();
		const copyEntry = async (from, relativePath, identity, assertParents, nested) => {
			const assertEntry = createPackagePathAssertion(from, identity, assertParents);
			assertEntry();
			const to = path.join(staging, relativePath);
			if (identity.isDirectory()) {
				await stagedRoot.mkdir(relativePath, { assertBeforeMutation: assertEntry });
				assertEntry();
				const assertDirectory = createPackagePathAssertion(to, fs.lstatSync(to, { bigint: true }), assertEntry);
				const names = (await fs$1.readdir(from)).toSorted();
				assertDirectory();
				const children = names.map((name) => ({
					name,
					identity: fs.lstatSync(path.join(from, name), { bigint: true })
				}));
				for (const child of children) await copyEntry(path.join(from, child.name), path.join(relativePath, child.name), child.identity, assertDirectory, true);
				assertDirectory();
				await fs$1.chmod(to, Number(identity.mode));
			} else if (identity.isSymbolicLink()) {
				let linkTarget = await fs$1.readlink(from);
				assertEntry();
				if (nested && !path.isAbsolute(linkTarget)) linkTarget = path.resolve(path.dirname(from), linkTarget);
				await fs$1.symlink(linkTarget, to);
				assertEntry();
				const assertLink = createPackagePathAssertion(to, fs.lstatSync(to, { bigint: true }), assertEntry);
				if (nested) {
					if (process.platform === "darwin") {
						assertLink();
						await fs$1.lchmod(to, Number(identity.mode));
						assertLink();
					}
				} else {
					const ownership = destinationIdentity?.isSymbolicLink() ? destinationIdentity : identity;
					const preserveOwnership = async () => {
						try {
							await fs$1.lchown(to, Number(ownership.uid), Number(ownership.gid));
						} catch (error) {
							if (!hasErrnoCode(error, "EPERM") && !hasErrnoCode(error, "EACCES") || !process.geteuid || !process.getegid) throw error;
							assertLink();
							await fs$1.lchown(to, process.geteuid(), process.getegid());
							log.warn(`Could not preserve launcher symlink ownership from ${source}; using updater ownership`);
						}
					};
					for (const [field, preserve] of [["ownership", preserveOwnership], ...process.platform === "darwin" ? [["mode", () => fs$1.lchmod(to, Number(identity.mode))]] : []]) {
						assertLink();
						try {
							await preserve();
						} catch (error) {
							assertLink();
							if (![
								"EPERM",
								"EACCES",
								"ENOSYS",
								"ENOTSUP",
								"EOPNOTSUPP"
							].some((code) => hasErrnoCode(error, code))) throw error;
							log.warn(`Could not preserve launcher symlink ${field} from ${source}; continuing with the copied link`);
						}
						assertLink();
					}
				}
			} else if (identity.isFile()) await stagedRoot.copyIn(relativePath, from, {
				assertBeforeMutation: assertEntry,
				sourceHardlinks: PACKAGE_MANAGER_SWAP_SOURCE_HARDLINKS,
				preserveSourceMode: true,
				mkdir: false,
				durable: !beforePublish
			});
			else throw new Error(`Unsupported package entry: ${from}`);
			assertEntry();
		};
		await copyEntry(source, "entry", sourceIdentity, assertStaging, false);
		assertStaging();
		const stagedIdentity = fs.lstatSync(staged, { bigint: true });
		if (beforePublish && sourceIdentity.isFile()) {
			const opened = await stagedRoot.open("entry");
			try {
				assertStaging();
				assertPackagePathIdentity(staged, stagedIdentity);
				const openedIdentity = fs.fstatSync(opened.handle.fd, { bigint: true });
				if (openedIdentity.dev !== stagedIdentity.dev || openedIdentity.ino !== stagedIdentity.ino) throw new FsSafeError("path-mismatch", "staged package launcher changed before sync");
				await opened.handle.sync();
				assertStaging();
				assertPackagePathIdentity(staged, stagedIdentity);
			} finally {
				await opened.handle.close();
			}
		}
		assertPackagePathIdentity(target, destinationIdentity);
		if (sourceIdentity.isDirectory()) {
			await removePackagePath(target, retainMutationAuthority(() => {
				assertStaging();
				if (fs.lstatSync(target, { throwIfNoEntry: false })) assertPackagePathIdentity(target, destinationIdentity);
			}));
			destinationIdentity = void 0;
		}
		assertStaging();
		assertPackagePathIdentity(staged, stagedIdentity);
		assertPackagePathIdentity(target, destinationIdentity);
		if (beforePublish) {
			requireDirectorySync(await syncDirectory(staging), "Staged package launcher");
			assertStaging();
			assertPackagePathIdentity(staged, stagedIdentity);
			assertPackagePathIdentity(target, destinationIdentity);
		}
		beforePublish?.(staged);
		assertStaging();
		assertPackagePathIdentity(staged, stagedIdentity);
		assertPackagePathIdentity(target, destinationIdentity);
		await fs$1.rename(staged, target);
		assertParent();
		if (beforePublish) for (const directory of [staging, destinationParent]) {
			assertStaging();
			assertPackagePathIdentity(target, stagedIdentity);
			requireDirectorySync(await syncDirectory(directory), "Package launcher publication");
			assertStaging();
			assertPackagePathIdentity(target, stagedIdentity);
		}
	} catch (error) {
		failure = { error };
	} finally {
		try {
			await removePackagePath(staging, () => {
				assertPackagePathIdentity(destinationParent, parentIdentity);
				if (fs.lstatSync(staging, { throwIfNoEntry: false })) assertPackagePathIdentity(staging, stagingIdentity);
			});
		} catch (error) {
			failure ??= { error };
		}
	}
	if (failure) throw failure.error;
}
function resolvePackageUpdateLauncherNames(packageName, entries) {
	const names = /* @__PURE__ */ new Set([packageName, "openclaw"]);
	return (entries?.filter((entry) => names.has(entry) || names.has(path.parse(entry).name)) ?? [...names]).toSorted();
}
/** Publish partial backup state so the swap owner can recover after any failed copy. */
async function capturePackageLaunchers(snapshot, params, targetLayout, reader) {
	const native = params.stage.native;
	await fs$1.mkdir(targetLayout.globalRoot, { recursive: true });
	const shimEntries = params.installTarget.directNodeModulesRoot === true ? [] : resolvePackageUpdateLauncherNames(params.packageName, await (native ? fs$1.readdir(params.stage.layout.binDir) : reader.entries(params.stage.layout.binDir)).catch((error) => {
		if (hasErrnoCode(error, "ENOENT")) return [];
		throw error;
	}));
	if (shimEntries.length > 0) {
		snapshot.backupDir = await fs$1.mkdtemp(path.join(targetLayout.globalRoot, ".openclaw.shim-backup-"));
		await fs$1.mkdir(targetLayout.binDir, { recursive: true });
		for (const entry of shimEntries) {
			const destination = path.join(targetLayout.binDir, entry);
			const backup = await (native ? packagePathEntryExists(destination) : reader.exists(destination)) ? path.join(snapshot.backupDir, entry) : null;
			const fingerprint = backup && !native ? await reader.launcher(destination) : void 0;
			if (backup) {
				await copyPackagePathEntry(destination, backup);
				if (fingerprint) {
					snapshot.failedCopy = backup;
					const actual = await reader.launcher(backup);
					const differences = packageLauncherDifferences(fingerprint, actual);
					if (differences.length > 0) throw new Error(`Package rollback launcher backup changed: ${destination}; differing fields: ${differences.join(", ")}`);
					snapshot.failedCopy = void 0;
				}
			}
			snapshot.entries.push({
				source: path.join(params.stage.layout.binDir, entry),
				destination,
				backup,
				fingerprint
			});
		}
	}
}
/** The caller verifies recovery material before this exact-object publication. */
async function restoreNpmPackageRoot(params) {
	const assertCurrent = retainMutationAuthority(params.assertCurrent ?? (() => {}));
	const restoreRename = (params.platform ?? process.platform) === "win32" ? (from, to) => renamePackageRootWithWindowsRetries(from, to, assertCurrent, { operation: "restore" }) : (from, to) => fs$1.rename(from, to);
	if (params.candidatePresent) {
		assertCurrent();
		await restoreRename(params.liveRoot, params.displacedRoot);
	}
	try {
		assertCurrent();
		await restoreRename(params.backupRoot, params.liveRoot);
	} catch (error) {
		assertCurrent();
		if (params.candidatePresent) try {
			await restoreRename(params.displacedRoot, params.liveRoot);
		} catch (compensationError) {
			assertCurrent();
			if (await packagePathEntryExists(params.liveRoot)) throw compensationError;
			throw new Error(`${formatErrorMessage(compensationError)}; ${params.liveRoot} is missing. Restore a bootable installation by moving ${params.backupRoot} (the previous package) or ${params.displacedRoot} (the rejected update) to ${params.liveRoot} after closing processes that hold them.`, { cause: compensationError });
		}
		else if (!await packagePathEntryExists(params.liveRoot)) {
			assertCurrent();
			throw new Error(`${formatErrorMessage(error)}; ${params.liveRoot} is missing. Restore the previous package by moving ${params.backupRoot} to ${params.liveRoot} after closing processes that hold it.`, { cause: error });
		}
		throw error;
	}
}
/** Retire only obsolete backups after restoration or verified activation. */
async function discardPackageUpdateBackup(backupPath, label, globalRoot, assertCaller = () => {}, cleanupDeadlineAtMs = performance.now() + UPDATE_CLEANUP_BUDGET_MS) {
	const assertCurrent = retainMutationAuthority(assertCaller);
	assertCurrent();
	const backupIdentity = fs.lstatSync(backupPath, {
		bigint: true,
		throwIfNoEntry: false
	});
	if (!backupIdentity) return null;
	const backupParent = fs.realpathSync(path.dirname(backupPath));
	const retiredParent = fs.realpathSync(globalRoot);
	const parents = [backupParent, retiredParent].map((directory) => ({
		directory,
		identity: fs.lstatSync(directory, { bigint: true })
	}));
	const backup = path.join(backupParent, path.basename(backupPath));
	const assertParents = retainMutationAuthority(() => {
		assertCurrent();
		for (const { directory, identity } of parents) assertPackagePathIdentity(directory, identity);
	});
	const assertBackup = retainMutationAuthority(() => {
		assertParents();
		if (fs.lstatSync(backup, { throwIfNoEntry: false })) assertPackagePathIdentity(backup, backupIdentity);
	});
	const cleanupExpired = /* @__PURE__ */ new Error("Obsolete backup cleanup budget expired");
	const cleanup = new AbortController();
	try {
		await removePackagePath(backup, () => {
			assertBackup();
			if (performance.now() >= cleanupDeadlineAtMs) cleanup.abort(cleanupExpired);
		}, cleanup.signal);
		return null;
	} catch (error) {
		assertBackup();
		if (error !== cleanupExpired && !isRemovalIoError(error)) throw error;
		const expiredMessage = `cleanup budget expired after ${UPDATE_CLEANUP_BUDGET_MS}ms; preserved ${label} at ${backupPath} for delayed cleanup${error === cleanupExpired ? "" : `; ${formatErrorMessage(error)}`}`;
		if (error === cleanupExpired || performance.now() >= cleanupDeadlineAtMs) return fs.lstatSync(backup, { throwIfNoEntry: false }) ? expiredMessage : null;
		const retiredPath = path.join(retiredParent, path.basename(backupPath).replace(/^\.openclaw\./, ".openclaw-"));
		try {
			assertBackup();
			assertPackagePathIdentity(backup, backupIdentity);
			assertPackagePathIdentity(retiredPath, void 0);
			if (performance.now() >= cleanupDeadlineAtMs) return expiredMessage;
			await fs$1.rename(backup, retiredPath);
			assertParents();
			assertPackagePathIdentity(retiredPath, backupIdentity);
			return `preserved ${label} at ${retiredPath} for delayed cleanup`;
		} catch (retirementError) {
			assertBackup();
			assertPackagePathIdentity(backup, backupIdentity);
			if (!isRemovalIoError(retirementError)) throw retirementError;
			return `preserved ${label} at ${backupPath}; remove it manually after verifying the installation`;
		}
	}
}
async function discardPackageLauncherBackup(snapshot, globalRoot, assertCurrent, cleanupDeadlineAtMs) {
	if (snapshot.failedCopy) return `failed copy retained at ${snapshot.failedCopy}; inspect it before retrying`;
	return snapshot.backupDir ? await discardPackageUpdateBackup(snapshot.backupDir, "shim backup", globalRoot, assertCurrent, cleanupDeadlineAtMs) : null;
}
async function removePackageUpdatePath(targetPath) {
	try {
		await removePackagePath(targetPath);
		return true;
	} catch {
		return false;
	}
}
//#endregion
export { capturePackageLaunchers as a, discardPackageLauncherBackup as c, packagePathEntryExists as d, removePackagePath as f, restoreNpmPackageRoot as h, backupNpmPackageRoot as i, discardPackageUpdateBackup as l, resolvePackageUpdateLauncherNames as m, activateStagedNpmPackageRoot as n, copyPackagePathEntry as o, removePackageUpdatePath as p, assertPackagePathIdentity as r, createPackagePathAssertion as s, PACKAGE_MANAGER_SWAP_SOURCE_HARDLINKS as t, packagePathEntriesMatch as u };
