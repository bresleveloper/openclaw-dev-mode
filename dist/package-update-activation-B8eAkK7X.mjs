import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-DoBSDhBS.mjs";
import { n as isErrno, t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { a as getNodeSqliteKysely, d as sql, r as executeSqliteQuerySync } from "./kysely-sync-K7ftY-g4.mjs";
import { l as isSupportedOpenClawNodeVersion } from "./node-version-DdJ6cN09.mjs";
import { r as resolveExistingSqliteFileUri, t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { An as never, Et as _enum, Fn as object, Jn as string, Nt as array, lr as uuid, nr as tuple, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-Dgz2IR4T.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { a as runUtf8CommandWithTimeout } from "./exec-DJvyCA0D.mjs";
import { o as resolveExecutablePath } from "./executable-path-CP2HPhgU.mjs";
import { c as readRootJsonObjectSync } from "./json-files-C5mNTScg.mjs";
import { c as comparePackageDistContentInventory, o as PACKAGE_DIST_CONTENT_INVENTORY_RELATIVE_PATH, s as PACKAGE_DIST_INVENTORY_RELATIVE_PATH } from "./package-dist-inventory-CQca5HwG.mjs";
import { l as syncDirectory, p as syncDirectorySync, s as requireDirectorySync } from "./directory-durability-CqSvP1tc.mjs";
import "./runtime-guard-BoZCdLcu.mjs";
import { t as resolveUpdateInstallRoot } from "./update-install-root-DH-onosx.mjs";
import { a as createManagedHandoffLeaseDatabase, i as captureManagedUpdateLeaseDatabaseIdentity, n as assertManagedUpdateLeaseDatabaseIdentity } from "./update-managed-service-handoff-database-BzJlW6Xp.mjs";
import { n as withExistingSqliteRollbackDatabase } from "./sqlite-existing-database-DMt1YTXm.mjs";
import { t as retainMutationAuthority } from "./mutation-authority-E8BC9dNY.mjs";
import { t as retryAsync } from "./retry-DH6xHyXB.mjs";
import { o as captureUpdateCommandExecutorAuthority, t as withUpdateCommandExecutor } from "./update-command-executor-C94Zye_E.mjs";
import { t as UPDATE_CLEANUP_BUDGET_MS } from "./update-maintenance-BAtM5r2e.mjs";
import { a as resolveBunRuntimeInfo } from "./runtime-paths-D7k3lrcM.mjs";
import { n as isRemovalIoError, r as removePathWithinRoot } from "./fs-safe-remove-DuP7yp5L.mjs";
import { a as packageIntegrityDifferences, o as packageLauncherDifferences, r as createPackageIntegrityReader, s as packageStatUnchanged, t as PackageIntegrityMismatchError } from "./package-update-integrity-L4dZmnxP.mjs";
import { a as packageActivationIdentity, c as resolvePackageActivationAnchor, d as resolvePackageActivationJournalPath, i as isPackageActivationComplete, l as resolvePackageActivationControl, n as assertPackageActivationLayout, o as packageActivationRuntimeIdentity, s as privatePackageActivationIdentity, t as LEGACY_PACKAGE_RECOVERY_HELPER, u as resolvePackageActivationHelper } from "./package-update-activation-paths-D77TjCW-.mjs";
import { a as packageActivationIdentitySchema, i as intentSchema, n as PackageActivationPhaseSchema, r as basename$1, t as PackageActivationDescriptorSchema } from "./package-update-activation-schema-CxYgJXV-.mjs";
import { t as prepareSqliteRollbackRecovery } from "./sqlite-rollback-recovery-9HnWYoBh.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { isDeepStrictEqual } from "node:util";
import { createHash, randomUUID } from "node:crypto";
import { FsSafeError } from "@openclaw/fs-safe/errors";
import { root } from "@openclaw/fs-safe/root";
import { walkDirectory } from "@openclaw/fs-safe/walk";
import { movePathWithCopyFallback } from "@openclaw/fs-safe/atomic";
//#region src/infra/update-post-core-capability.ts
const POST_CORE_EXECUTOR_CAPABILITY = "stdin-pid-start-v1";
const POST_CORE_MUTATION_PROTOCOL = "original-cancellation-v1";
/** Compatibility only: authority still comes from the original live executor. */
async function supportsPostCoreExecutor(root, nodeRunner) {
	const check = await runUtf8CommandWithTimeout([
		nodeRunner,
		path.join(root, "dist", runtimeProcessEntrypoints.updateMigratedFinalize.distWorkerPath),
		"--check"
	], {
		cwd: root,
		baseEnv: {},
		timeoutMs: 3e4,
		killProcessTree: true,
		requireProcessTreeExtinction: true,
		killGraceMs: 500,
		maxOutputBytes: 65536
	});
	if (check.termination !== "exit" || check.code !== 0 || check.cleanup !== "normal") return false;
	const contract = safeParseJsonRecord(check.stdout);
	if (!contract || contract.postCoreExecutor !== "stdin-pid-start-v1") return false;
	if (contract.mutationProtocol !== "original-cancellation-v1") throw new Error("Target update worker does not support original cancellation.");
	return true;
}
//#endregion
//#region src/infra/package-update-filesystem.ts
const PACKAGE_MANAGER_SWAP_SOURCE_HARDLINKS = "allow";
const log$1 = createSubsystemLogger("update/package-launchers");
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
	const assertCurrent = retainMutationAuthority(assertCaller ?? (() => {}));
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
				warnings.push(`Windows package backup rename ${source} -> ${destination} failed: ${formatErrorMessage(err)}; retry ${attempt + 1}/${maxAttempts} in ${delayMs}ms.`);
			}
		});
	} catch (error) {
		if (error !== renameFailure) throw error;
		throw Object.assign(new Error(`Windows package backup rename failed after ${attempts} attempts: ${source} -> ${destination}: ${formatErrorMessage(error)}. Close processes holding this installation and check its permissions before retrying.`, { cause: error }), { code: isErrno(error) ? error.code : void 0 });
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
	const assertStaging = () => {
		assertParent();
		assertPackagePathIdentity(staging, stagingIdentity);
	};
	let failure;
	try {
		const stagedRoot = await root(staging, { assertBeforeMutation: assertStaging });
		assertStaging();
		const copyEntry = async (from, relativePath, identity, assertParents, nested) => {
			const assertEntry = () => {
				assertParents();
				assertPackagePathIdentity(from, identity);
			};
			assertEntry();
			const to = path.join(staging, relativePath);
			if (identity.isDirectory()) {
				await stagedRoot.mkdir(relativePath, { assertBeforeMutation: assertEntry });
				assertEntry();
				const directoryIdentity = fs.lstatSync(to, { bigint: true });
				const assertDirectory = () => {
					assertEntry();
					assertPackagePathIdentity(to, directoryIdentity);
				};
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
				const linkIdentity = fs.lstatSync(to, { bigint: true });
				const assertLink = () => {
					assertEntry();
					assertPackagePathIdentity(to, linkIdentity);
				};
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
							log$1.warn(`Could not preserve launcher symlink ownership from ${source}; using updater ownership`);
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
							log$1.warn(`Could not preserve launcher symlink ${field} from ${source}; continuing with the copied link`);
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
/** Publish partial backup state so the swap owner can recover after any failed copy. */
async function capturePackageLaunchers(snapshot, params, targetLayout, reader) {
	const native = params.stage.native;
	await fs$1.mkdir(targetLayout.globalRoot, { recursive: true });
	const shimNames = /* @__PURE__ */ new Set([params.packageName, "openclaw"]);
	const shimEntries = params.installTarget.directNodeModulesRoot === true ? [] : (await (native ? fs$1.readdir(params.stage.layout.binDir) : reader.entries(params.stage.layout.binDir)).catch((error) => {
		if (hasErrnoCode(error, "ENOENT")) return [];
		throw error;
	})).filter((entry) => shimNames.has(entry) || shimNames.has(path.parse(entry).name)).toSorted();
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
	if (params.candidatePresent) {
		assertCurrent();
		await fs$1.rename(params.liveRoot, params.displacedRoot);
	}
	try {
		assertCurrent();
		await fs$1.rename(params.backupRoot, params.liveRoot);
	} catch (error) {
		assertCurrent();
		if (params.candidatePresent) await fs$1.rename(params.displacedRoot, params.liveRoot);
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
//#region src/infra/package-update-activation-launcher.ts
const launcherSchema = tuple([
	_enum(["symlink", "file"]),
	string(),
	string(),
	string(),
	string()
]);
/** Keep the journal's version-1 launcher encoding while the live reader exposes metadata. */
function encodePackageActivationLauncher(value) {
	return JSON.stringify([
		value.type,
		value.mode,
		value.uid,
		value.gid,
		value.contents
	]);
}
function decodePackageActivationLauncher(encoded) {
	const [type, mode, uid, gid, contents] = launcherSchema.parse(JSON.parse(encoded));
	return {
		type,
		mode,
		uid,
		gid,
		contents
	};
}
function matchesPackageActivationLauncher(actual, encoded) {
	return actual === null || encoded === null ? actual === null && encoded === null : packageLauncherDifferences(decodePackageActivationLauncher(encoded), actual, { checkMode: true }).length === 0;
}
const entryIdentity = (file) => fs.lstatSync(file, { throwIfNoEntry: false }) ? packageActivationIdentity(file, "launcher") : null;
function assertPackageActivationSelectedLaunchers(record, selected) {
	const descriptor = record.descriptor;
	for (const entry of descriptor.launchers) {
		const expected = selected === "previous" && entry.previous === null ? null : record.phase === "aborted" || record.phase === "prepared" ? entry.previousIdentity : record.publications.find((published) => published.name === entry.name)?.identity;
		if (entryIdentity(path.join(descriptor.binDir, entry.name)) !== expected) throw new Error("Selected package launcher identity changed.");
	}
}
async function verifyPackageActivationSelectedLaunchers(record, selected) {
	const descriptor = record.descriptor;
	const reader = createPackageIntegrityReader();
	assertPackageActivationSelectedLaunchers(record, selected);
	for (const entry of descriptor.launchers) {
		const destination = path.join(descriptor.binDir, entry.name);
		if (!matchesPackageActivationLauncher(await reader.exists(destination) ? await reader.launcher(destination) : null, entry[selected])) throw new Error("Selected package launcher fingerprint changed.");
	}
	assertPackageActivationSelectedLaunchers(record, selected);
}
//#endregion
//#region src/infra/package-update-activation-status.ts
/** Released in-anchor journals remain inspection-only; their helper owns recovery. */
function readReleasedPackageActivationReceipt(installKey) {
	const anchor = resolvePackageActivationAnchor(installKey);
	const journal = path.join(anchor, "operation.sqlite");
	if (!fs.lstatSync(journal, { throwIfNoEntry: false })) return;
	const anchorIdentity = privatePackageActivationIdentity(anchor, true);
	const journalIdentity = privatePackageActivationIdentity(journal, false);
	const parentIdentity = packageActivationIdentity(path.dirname(anchor), true);
	const assertIdentity = () => {
		if (privatePackageActivationIdentity(anchor, true) !== anchorIdentity || privatePackageActivationIdentity(journal, false) !== journalIdentity || packageActivationIdentity(path.dirname(anchor), true) !== parentIdentity || fs.realpathSync(anchor) !== anchor) throw new Error("Released package activation journal identity changed.");
	};
	const query = (db) => getNodeSqliteKysely(db).selectFrom("package_activation");
	return withExistingSqliteRollbackDatabase(journal, {
		write: false,
		busyTimeoutMs: 0,
		assertIdentity,
		validate: (db) => {
			executeSqliteQuerySync(db, query(db).select([
				"slot",
				"phase",
				"descriptor_json"
			]).limit(0));
		}
	}, (db) => {
		const rows = executeSqliteQuerySync(db, query(db).select(["slot", "phase"]).select((eb) => eb.case().when(eb.fn("length", [eb.cast("descriptor_json", "blob")]), "<=", 1048576).then(eb.ref("descriptor_json")).else(null).end().as("descriptor_json")).limit(2)).rows;
		const row = rows[0];
		if (rows.length !== 1 || row?.slot !== 1 || row.descriptor_json === null) throw new Error("Released package activation journal must contain one bounded operation.");
		const descriptor = object({
			version: literal(1),
			layout: never().optional(),
			operationId: uuid(),
			authority: object({ installKey: string() }),
			anchorIdentity: literal(anchorIdentity),
			journalIdentity: literal(journalIdentity),
			parentIdentity: literal(parentIdentity)
		}).parse(JSON.parse(row.descriptor_json));
		if (descriptor.authority.installKey !== installKey) throw new Error("Released package activation journal does not match its installation.");
		return {
			phase: _enum([
				"prepared",
				"publishing",
				"publication-complete",
				"rollback-in-progress",
				"rolled-back",
				"aborted",
				"retiring",
				"retired"
			]).parse(row.phase),
			operationId: descriptor.operationId,
			installKey,
			recoveryCommand: `node ${quoteCliArg(path.join(anchor, "recovery.mjs"))} status`
		};
	});
}
function readPackageActivationRecordStatus(record) {
	return {
		phase: isPackageActivationComplete(resolvePackageActivationAnchor(record.descriptor.authority.installKey), record) ? "complete" : record.phase,
		operationId: record.descriptor.operationId,
		installKey: record.descriptor.authority.installKey
	};
}
const selectedPackageRetirementGeneration = (record) => record.intent?.kind === "remove" || record.intent?.kind === "retire" || record.intent?.kind === "remove-anchor" || record.intent?.kind === "unlink-helper" ? record.intent.selected : record.phase === "publication-complete" ? "candidate" : "previous";
function assertPackageActivationActionAllowed(record, action) {
	if (!(action === "repair" ? [
		"preparing",
		"prepared",
		"publishing",
		"publication-complete"
	] : [
		"publication-complete",
		"rolled-back",
		"aborted",
		"retiring",
		"anchor-retired"
	]).includes(record.phase)) throw new Error(`${action === "repair" ? "Forward publication is disarmed" : "Package evidence cannot be retired"} (${record.phase}).`);
}
//#endregion
//#region src/infra/package-update-activation-journal.ts
const PACKAGE_ACTIVATION_JOURNAL = "operation.sqlite";
const MAX_PACKAGE_ACTIVATION_DESCRIPTOR_BYTES = 1048576;
const queries = (db) => getNodeSqliteKysely(db);
function descriptorJson(descriptor) {
	const encoded = JSON.stringify(PackageActivationDescriptorSchema.parse(descriptor));
	if (Buffer.byteLength(encoded) > MAX_PACKAGE_ACTIVATION_DESCRIPTOR_BYTES) throw new Error("Package publication descriptor exceeds 1 MiB");
	return encoded;
}
/** An existing operation is never bootstrapped, migrated, or repaired on open. */
function openPackageActivationJournal(anchor) {
	assertPackageActivationLayout(anchor);
	const journalPath = resolvePackageActivationJournalPath(anchor);
	const parent = path.dirname(anchor);
	const parentIdentity = packageActivationIdentity(parent, true);
	const control = resolvePackageActivationControl(anchor);
	const journalParentIdentity = privatePackageActivationIdentity(control, true);
	const journalIdentity = privatePackageActivationIdentity(journalPath, false);
	const assertFiles = () => {
		if (packageActivationIdentity(parent, true) !== parentIdentity || privatePackageActivationIdentity(control, true) !== journalParentIdentity || privatePackageActivationIdentity(journalPath, false) !== journalIdentity || fs.realpathSync(control) !== control) throw new Error("Package publication journal identity changed");
	};
	const withDatabase = (write, operation) => withExistingSqliteRollbackDatabase(journalPath, {
		write,
		busyTimeoutMs: 0,
		assertIdentity: assertFiles,
		validate: (db) => {
			executeSqliteQuerySync(db, queries(db).selectFrom("package_activation").selectAll().limit(0));
		}
	}, (db, transact) => {
		if (write) db.exec("PRAGMA synchronous = EXTRA");
		return operation(db, transact);
	});
	const matchesInstallation = (descriptor) => descriptor.parentIdentity === parentIdentity && descriptor.journalParentIdentity === journalParentIdentity && descriptor.journalIdentity === journalIdentity;
	const decode = (row, completedInstallKey) => {
		if (!row || row.slot !== 1 || !Number.isSafeInteger(row.revision) || row.revision < 0 || Buffer.byteLength(row.descriptor_json) > MAX_PACKAGE_ACTIVATION_DESCRIPTOR_BYTES) throw new Error("Package publication journal is missing or invalid");
		const descriptor = PackageActivationDescriptorSchema.parse(JSON.parse(row.descriptor_json));
		if (resolvePackageActivationAnchor(descriptor.authority.installKey) !== anchor || packageActivationIdentity(parent, true) !== parentIdentity || completedInstallKey !== void 0 && descriptor.authority.installKey !== completedInstallKey || new Set(descriptor.launchers.map((entry) => entry.name)).size !== descriptor.launchers.length) throw new Error("Package publication journal does not match its installation");
		const expectedTransfers = /* @__PURE__ */ new Map([
			["anchor", descriptor.anchorIdentity],
			["helper", descriptor.helperIdentity],
			["candidate", descriptor.candidate.identity],
			["launchers", descriptor.launcherRootIdentity]
		]);
		if (descriptor.previousLauncherRootIdentity) expectedTransfers.set("previous-launchers", descriptor.previousLauncherRootIdentity);
		if (descriptor.preparation.length !== expectedTransfers.size || new Set(descriptor.preparation.map((entry) => entry.name)).size !== expectedTransfers.size || descriptor.preparation.some((entry) => expectedTransfers.get(entry.name) !== entry.identity) || descriptor.preparation.find((entry) => entry.name === "candidate")?.source !== descriptor.originalStageRoot) throw new Error("Preparation custody does not match the recorded objects.");
		const publications = array(strictObject({
			name: basename$1,
			identity: packageActivationIdentitySchema
		})).max(64).parse(JSON.parse(row.publications_json));
		const intent = intentSchema.parse(JSON.parse(row.intent_json));
		const names = new Set(descriptor.launchers.map((entry) => entry.name));
		if (new Set(publications.map((entry) => entry.name)).size !== publications.length || publications.some((entry) => !names.has(entry.name)) || intent?.kind === "launcher" && !names.has(intent.name)) throw new Error("Package publication intent names an unknown launcher.");
		const record = {
			revision: row.revision,
			phase: PackageActivationPhaseSchema.parse(row.phase),
			intent,
			descriptor,
			publications
		};
		if (!matchesInstallation(descriptor) && !isPackageActivationComplete(anchor, record)) throw new Error("Package publication journal does not match its installation");
		return record;
	};
	const readRow = (db) => {
		const sizes = executeSqliteQuerySync(db, queries(db).selectFrom("package_activation").select((eb) => [
			"slot",
			eb.fn("length", [eb.cast("descriptor_json", "blob")]).as("descriptor_bytes"),
			eb.fn("length", [eb.cast("intent_json", "blob")]).as("intent_bytes"),
			eb.fn("length", [eb.cast("publications_json", "blob")]).as("publications_bytes")
		]).limit(2)).rows;
		const size = sizes[0];
		if (sizes.length !== 1 || !size || size.slot !== 1 || [
			size.descriptor_bytes,
			size.intent_bytes,
			size.publications_bytes
		].some((bytes) => bytes > MAX_PACKAGE_ACTIVATION_DESCRIPTOR_BYTES)) throw new Error("Package publication journal must contain one bounded operation.");
		const rows = executeSqliteQuerySync(db, queries(db).selectFrom("package_activation").selectAll().limit(2)).rows;
		if (rows.length !== 1) throw new Error("Package publication journal must contain exactly one operation.");
		return rows[0];
	};
	const read = () => withDatabase(false, (db) => decode(readRow(db)));
	const assertRecord = (expected, actual) => {
		if (JSON.stringify(expected) !== JSON.stringify(actual)) throw new Error("Package publication intent is no longer current");
	};
	const transition = (expected, phase, intent, assertCurrent, publications = expected.publications, descriptor = expected.descriptor) => {
		const descriptorJsonValue = descriptorJson(descriptor);
		const intentJson = JSON.stringify(intentSchema.parse(intent));
		PackageActivationPhaseSchema.parse(phase);
		assertCurrent();
		return withDatabase(true, (db, transact) => transact(() => {
			assertFiles();
			assertCurrent();
			assertRecord(expected, decode(readRow(db)));
			executeSqliteQuerySync(db, queries(db).updateTable("package_activation").set({
				revision: expected.revision + 1,
				phase,
				descriptor_json: descriptorJsonValue,
				intent_json: intentJson,
				publications_json: JSON.stringify(publications)
			}).where("slot", "=", 1).where("revision", "=", expected.revision));
			return decode(readRow(db));
		}, { withCommit: (commit) => {
			assertFiles();
			assertCurrent();
			commit();
		} }));
	};
	return {
		read,
		archiveSettled(expected, assertCurrent) {
			const retained = `${anchor}.superseded-${expected.descriptor.operationId}`;
			const archive = path.join(retained, "control");
			const assertClosed = () => {
				assertCurrent();
				assertFiles();
				assertRecord(expected, read());
				if (!isPackageActivationComplete(anchor, expected)) throw new Error("Only completed package settlement evidence can be archived.");
			};
			assertClosed();
			const source = fs.lstatSync(anchor, { throwIfNoEntry: false });
			const destination = fs.lstatSync(retained, { throwIfNoEntry: false });
			if (source && destination) throw new Error("Package settlement evidence archive already exists.");
			let retainedIdentity;
			if (source) {
				retainedIdentity = packageActivationIdentity(anchor, true);
				assertClosed();
				try {
					fs.renameSync(anchor, retained);
				} catch (error) {
					if (fs.lstatSync(anchor, { throwIfNoEntry: false }) || !fs.lstatSync(retained, { throwIfNoEntry: false }) || packageActivationIdentity(retained, true) !== retainedIdentity) throw error;
				}
			} else {
				if (!destination) {
					assertClosed();
					fs.mkdirSync(retained, { mode: 448 });
				}
				retainedIdentity = packageActivationIdentity(retained, true);
			}
			const assertSettled = () => {
				assertClosed();
				if (packageActivationIdentity(retained, true) !== retainedIdentity || fs.realpathSync(retained) !== retained || fs.lstatSync(archive, { throwIfNoEntry: false })) throw new Error("Package settlement control archive changed or already exists.");
			};
			assertSettled();
			for (const directory of [
				control,
				parent,
				retained
			]) requireDirectorySync(syncDirectorySync(directory), "Package settlement control archive");
			assertSettled();
			try {
				fs.renameSync(control, archive);
			} catch (error) {
				if (fs.lstatSync(control, { throwIfNoEntry: false }) || !fs.lstatSync(archive, { throwIfNoEntry: false }) || privatePackageActivationIdentity(archive, true) !== journalParentIdentity) throw error;
			}
			for (const directory of [retained, parent]) {
				assertCurrent();
				if (packageActivationIdentity(parent, true) !== parentIdentity || fs.realpathSync(retained) !== retained || packageActivationIdentity(retained, true) !== retainedIdentity || privatePackageActivationIdentity(archive, true) !== journalParentIdentity || privatePackageActivationIdentity(path.join(archive, PACKAGE_ACTIVATION_JOURNAL), false) !== journalIdentity) throw new Error("Package settlement control archive identity changed.");
				requireDirectorySync(syncDirectorySync(directory), "Package settlement control archive");
			}
			assertCurrent();
		},
		readForAdmission(installKey) {
			return withDatabase(false, (db) => decode(readRow(db), installKey));
		},
		readForRecovery() {
			return prepareSqliteRollbackRecovery({
				path: journalPath,
				scratchRoot: control,
				assertIdentity: assertFiles,
				assertFileSafe(file) {
					privatePackageActivationIdentity(file, false);
				},
				read: (db) => decode(readRow(db))
			});
		},
		assertCurrent(expected) {
			assertRecord(expected, read());
		},
		transition
	};
}
function preparationSource(descriptor, name) {
	const source = descriptor.preparation.find((entry) => entry.name === name)?.source;
	if (!source) throw new Error("Package preparation bootstrap custody is missing.");
	return source;
}
/** Only the original admitted producer may create the one-operation database. */
function createPackageActivationJournal(anchor, descriptor, stagedControl, assertCurrent, onCustody) {
	const control = resolvePackageActivationControl(anchor);
	const journalPath = path.join(stagedControl, PACKAGE_ACTIVATION_JOURNAL);
	const helperPath = path.join(stagedControl, "recovery.mjs");
	const assertAnchor = () => {
		assertCurrent();
		assertPackageActivationLayout(anchor);
		if (privatePackageActivationIdentity(preparationSource(descriptor, "anchor"), true) !== descriptor.anchorIdentity || packageActivationIdentity(path.dirname(anchor), true) !== descriptor.parentIdentity || fs.realpathSync(path.dirname(anchor)) !== path.dirname(anchor) || privatePackageActivationIdentity(stagedControl, true) !== descriptor.journalParentIdentity || fs.realpathSync(stagedControl) !== stagedControl || descriptor.journalParentIdentity.split(":")[0] !== descriptor.parentIdentity.split(":")[0] || preparationSource(descriptor, "helper") !== resolvePackageActivationHelper(anchor) || descriptor.preparation.find((entry) => entry.name === "helper")?.sourceParentIdentity !== descriptor.journalParentIdentity || privatePackageActivationIdentity(helperPath, false) !== descriptor.helperIdentity || createHash("sha256").update(fs.readFileSync(helperPath)).digest("hex") !== descriptor.helperDigest || packageActivationIdentity(descriptor.authority.installKey, true) !== descriptor.previous.identity || packageActivationIdentity(descriptor.originalStageRoot, true) !== descriptor.candidate.identity || fs.lstatSync(anchor, { throwIfNoEntry: false }) || fs.lstatSync(control, { throwIfNoEntry: false })) throw new Error("Package publication journal identity changed");
	};
	assertAnchor();
	descriptorJson({
		...descriptor,
		journalIdentity: "0:0"
	});
	let journalIdentity;
	let initial;
	const assertCreated = () => {
		assertAnchor();
		if (privatePackageActivationIdentity(journalPath, false) !== journalIdentity) throw new Error("Package publication journal identity changed");
	};
	const fd = fs.openSync(journalPath, "wx", 384);
	try {
		const created = fs.fstatSync(fd, { bigint: true });
		journalIdentity = `${created.dev}:${created.ino}`;
		initial = {
			slot: 1,
			revision: 0,
			phase: "preparing",
			descriptor_json: descriptorJson({
				...descriptor,
				journalIdentity
			}),
			intent_json: JSON.stringify({
				kind: "prepare",
				completed: ["helper"],
				moving: null
			}),
			publications_json: "[]"
		};
		assertCreated();
		const db = openNodeSqliteDatabase(resolveExistingSqliteFileUri(journalPath));
		try {
			assertCreated();
			executeSqliteQuerySync(db, queries(db).schema.createTable("package_activation").addColumn("slot", "integer", (column) => column.primaryKey().notNull()).addColumn("revision", "integer", (column) => column.notNull()).addColumn("phase", "text", (column) => column.notNull()).addColumn("descriptor_json", "text", (column) => column.notNull()).addColumn("intent_json", "text", (column) => column.notNull()).addColumn("publications_json", "text", (column) => column.notNull()).modifyEnd(sql`STRICT`));
			assertCreated();
			executeSqliteQuerySync(db, queries(db).insertInto("package_activation").values(initial));
		} finally {
			if (db.isOpen) db.close();
		}
	} finally {
		fs.closeSync(fd);
	}
	const assertReady = () => {
		assertCreated();
		if (!isDeepStrictEqual(fs.readdirSync(stagedControl).toSorted(), [PACKAGE_ACTIVATION_JOURNAL, "recovery.mjs"])) throw new Error("Private package control contains unknown objects.");
	};
	const verifyPrivate = () => withExistingSqliteRollbackDatabase(journalPath, {
		write: false,
		busyTimeoutMs: 0,
		assertIdentity: assertReady,
		validate: () => {}
	}, (db) => {
		const rows = executeSqliteQuerySync(db, queries(db).selectFrom("package_activation").selectAll().limit(2)).rows;
		if (rows.length !== 1 || !isDeepStrictEqual({ ...rows[0] }, initial)) throw new Error("Private package publication journal is incomplete.");
	});
	verifyPrivate();
	requireDirectorySync(syncDirectorySync(stagedControl), "Private package control");
	onCustody?.(true);
	try {
		assertReady();
		fs.renameSync(stagedControl, control);
		for (const directory of /* @__PURE__ */ new Set([path.dirname(stagedControl), path.dirname(control)])) {
			assertCurrent();
			requireDirectorySync(syncDirectorySync(directory), "Package control publication");
		}
	} catch (error) {
		try {
			if (!fs.lstatSync(control, { throwIfNoEntry: false })) {
				verifyPrivate();
				onCustody?.(false);
			}
		} catch {}
		throw error;
	}
	const journal = openPackageActivationJournal(anchor);
	if (descriptorJson(journal.read().descriptor) !== initial.descriptor_json) throw new Error("Published package control identity changed.");
	assertCurrent();
	return journal;
}
//#endregion
//#region src/infra/package-update-activation-custody.ts
function packageActivationIdentityOrAbsent(file, directory) {
	try {
		return packageActivationIdentity(file, directory);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return null;
		throw error;
	}
}
function inspectPackageActivationCustody(anchor, record) {
	if (record.phase !== "preparing" || record.intent?.kind !== "prepare") throw new Error("Package preparation requires its recorded transfer intent.");
	const intent = record.intent;
	const descriptor = record.descriptor;
	if (new Set(intent.completed).size !== intent.completed.length || intent.completed.some((name) => !descriptor.preparation.some((entry) => entry.name === name)) || intent.moving !== null && intent.completed.includes(intent.moving)) throw new Error("Package preparation custody is invalid.");
	return descriptor.preparation.map((entry) => {
		const destination = entry.name === "anchor" ? anchor : entry.name === "helper" ? resolvePackageActivationHelper(anchor) : path.join(anchor, entry.name);
		if (entry.source === descriptor.authority.installKey || entry.source.startsWith(`${anchor}${path.sep}`) || fs.realpathSync(path.dirname(entry.source)) !== path.dirname(entry.source) || packageActivationIdentity(path.dirname(entry.source), true) !== entry.sourceParentIdentity) throw new Error("Package preparation source parent changed.");
		const source = packageActivationIdentityOrAbsent(entry.source, entry.name !== "helper");
		const target = packageActivationIdentityOrAbsent(destination, entry.name !== "helper");
		const resident = entry.name === "helper" && entry.source === destination;
		if (resident && (entry.sourceParentIdentity !== descriptor.journalParentIdentity || !intent.completed.includes("helper") || intent.moving === "helper" || source !== entry.identity)) throw new Error("Resident package helper custody is invalid.");
		const moved = resident || source === null && target === entry.identity;
		if (moved) {
			if (!intent.completed.includes(entry.name) && intent.moving !== entry.name) throw new Error("Package preparation transfer has no recorded intent.");
		} else if (source !== entry.identity || target !== null || intent.completed.includes(entry.name)) throw new Error("Package preparation object custody is ambiguous or replaced.");
		return {
			name: entry.name,
			source: entry.source,
			identity: entry.identity,
			sourceParentIdentity: entry.sourceParentIdentity,
			destination,
			moved
		};
	});
}
async function completePackageActivationCustody(anchor, journal, assertCurrent, onHelperReady) {
	let record = journal.read();
	if (record.phase !== "preparing") return;
	const entries = inspectPackageActivationCustody(anchor, record);
	const control = resolvePackageActivationControl(anchor);
	for (const directory of /* @__PURE__ */ new Set([
		control,
		path.dirname(control),
		...entries.map((entry) => path.dirname(entry.source))
	])) {
		assertCurrent();
		journal.assertCurrent(record);
		requireDirectorySync(await syncDirectory(directory), "Package preparation control");
	}
	assertCurrent();
	journal.assertCurrent(record);
	if (record.intent?.kind === "prepare" && record.intent.completed.includes("helper")) {
		assertCurrent();
		journal.assertCurrent(record);
		onHelperReady?.();
	}
	for (const entry of entries) {
		if (record.intent?.kind !== "prepare") throw new Error("Preparation intent changed.");
		if (record.intent.completed.includes(entry.name)) continue;
		if (!entry.moved) {
			record = journal.transition(record, "preparing", {
				kind: "prepare",
				completed: record.intent.completed,
				moving: entry.name
			}, assertCurrent);
			assertCurrent();
			journal.assertCurrent(record);
			const current = inspectPackageActivationCustody(anchor, record).find((item) => item.name === entry.name);
			if (!current || current.moved) throw new Error("Preparation preimage changed before rename.");
			await fs$1.rename(entry.source, entry.destination);
		}
		for (const directory of /* @__PURE__ */ new Set([path.dirname(entry.source), path.dirname(entry.destination)])) {
			assertCurrent();
			journal.assertCurrent(record);
			requireDirectorySync(await syncDirectory(directory), "Package preparation transfer");
		}
		assertCurrent();
		journal.assertCurrent(record);
		if (!inspectPackageActivationCustody(anchor, record).find((item) => item.name === entry.name)?.moved || record.intent?.kind !== "prepare") throw new Error("Preparation transfer was not observed.");
		record = journal.transition(record, "preparing", {
			kind: "prepare",
			completed: [...record.intent.completed, entry.name],
			moving: null
		}, assertCurrent);
		if (entry.name === "helper") onHelperReady?.();
	}
	journal.transition(record, "prepared", null, assertCurrent);
}
/** Recognized obsolete custody closes before best-effort evidence maintenance. */
function settlePackageActivationCustody(params) {
	const { anchor, journal, settlement, assertCurrent } = params;
	const record = journal.transition(params.record, "superseded", {
		...settlement,
		settled: true
	}, assertCurrent);
	params.onSettled?.();
	const warning = archivePackageActivationCustody(anchor, journal, record, assertCurrent);
	return {
		record,
		warning: `${settlement.detail ?? settlement.kind}. ${warning ?? `Preserved at ${anchor}.superseded-${record.descriptor.operationId}`}`,
		archiveWarning: warning
	};
}
/** Completed history is never a prerequisite for the next mutable update. */
function archivePackageActivationCustody(anchor, journal, record, assertCurrent) {
	const retained = `${anchor}.superseded-${record.descriptor.operationId}`;
	try {
		journal.archiveSettled(record, assertCurrent);
	} catch (error) {
		assertCurrent();
		if (fs.lstatSync(resolvePackageActivationJournalPath(anchor), { throwIfNoEntry: false })) journal.assertCurrent(record);
		return `Closed recovery evidence could not be fully archived at ${retained}: ${formatErrorMessage(error)}`;
	}
	assertCurrent();
}
//#endregion
//#region src/infra/package-update-activation-runtime-assets.ts
const packageActivationRuntimeEntrypoint = {
	currentModuleUrl: import.meta.url,
	sourceWorkerName: "package-update-activation-sealed",
	distWorkerPath: "package-update-activation-recovery.mjs"
};
//#endregion
//#region src/infra/package-update-activation-sqlite.ts
const SQLITE_LIBRARY_HEADER = "// openclaw-package-recovery-sqlite: ";
/** The existing helper digest binds this recovery hint without changing the v1 journal. */
function sealPackageActivationSqliteLibrary(helper, library) {
	return library ? Buffer.concat([Buffer.from(`${SQLITE_LIBRARY_HEADER}${JSON.stringify(library)}\n`), helper]) : helper;
}
function readPackageActivationSqliteLibrary(helper) {
	const end = helper.indexOf(10);
	const firstLine = helper.subarray(0, end < 0 ? helper.length : end).toString("utf8");
	if (!firstLine.startsWith(SQLITE_LIBRARY_HEADER)) return;
	const library = JSON.parse(firstLine.slice(37));
	if (typeof library !== "string" || !path.isAbsolute(library)) throw new Error("Package recovery SQLite library must be an absolute path.");
	return library;
}
function packageActivationSqliteEnvironment(library) {
	return `OPENCLAW_SQLITE_LIBRARY=${quoteCliArg(library)}`;
}
//#endregion
//#region src/infra/package-update-activation-prepare.ts
function readPackageActivationRuntime() {
	const source = resolveRuntimeWorkerUrl(packageActivationRuntimeEntrypoint);
	if (!source.pathname.endsWith(".mjs")) throw new Error("Package publication recovery requires its built sealed helper.");
	return fs.readFileSync(source);
}
var PackageActivationArchiveError = class extends Error {};
function packageActivationRecoveryCommand(node, anchor, operationId, helper = resolvePackageActivationHelper(anchor), sqliteLibrary) {
	return `${sqliteLibrary ? `${packageActivationSqliteEnvironment(sqliteLibrary)} ` : ""}${quoteCliArg(node)} ${quoteCliArg(helper)} --anchor ${quoteCliArg(anchor)} --operation ${quoteCliArg(operationId)}`;
}
function resolvePackageActivationRecoveryCommand(record) {
	const anchor = resolvePackageActivationAnchor(record.descriptor.authority.installKey);
	let helper = resolvePackageActivationHelper(anchor);
	if (record.phase === "preparing") {
		const custody = inspectPackageActivationCustody(anchor, record).find((entry) => entry.name === "helper");
		if (!custody) throw new Error("Package bootstrap helper custody is missing.");
		helper = custody.moved ? custody.destination : custody.source;
	}
	const node = record.descriptor.recoveryNodePath;
	const bytes = fs.readFileSync(helper);
	if (createHash("sha256").update(bytes).digest("hex") !== record.descriptor.helperDigest) throw new Error("Package recovery helper digest changed.");
	return packageActivationRecoveryCommand(node, anchor, record.descriptor.operationId, helper, readPackageActivationSqliteLibrary(bytes));
}
async function preparePackageActivationJournal(params, assertion = params.options.fence.assertCurrent.bind(params.options.fence)) {
	const assertCurrent = retainMutationAuthority(assertion);
	assertCurrent();
	const authority = captureUpdateCommandExecutorAuthority(params.options.fence);
	assertCurrent();
	const liveRoot = resolveUpdateInstallRoot(params.liveRoot);
	if (process.platform === "win32" || authority.installKey !== liveRoot) throw new Error("Package publication recovery requires its original POSIX npm directory.");
	const anchor = resolvePackageActivationAnchor(authority.installKey);
	const parent = path.dirname(anchor);
	if (fs.realpathSync(parent) !== parent) throw new Error("Package publication recovery requires canonical installation parents.");
	const stageRoot = resolveUpdateInstallRoot(params.stageRoot);
	const launcherRoot = resolveUpdateInstallRoot(params.launcherRoot);
	const binDir = resolveUpdateInstallRoot(params.binDir);
	const previousLauncherRoot = params.previousLauncherRoot ? resolveUpdateInstallRoot(params.previousLauncherRoot) : void 0;
	const runtime = params.options.runtime;
	const node = fs.realpathSync(runtime.path);
	const assertRuntime = () => {
		if (node !== runtime.path || packageActivationRuntimeIdentity(node) !== runtime.identity) throw new Error("The selected package recovery executable changed after runtime preflight.");
	};
	assertRuntime();
	for (const root of [
		liveRoot,
		stageRoot,
		anchor
	]) if (node === root || node.startsWith(`${root}${path.sep}`)) throw new Error("Recovery requires an external Node executable.");
	let sqliteLibrary;
	if (runtime.kind === "bun") {
		const info = await resolveBunRuntimeInfo(node, void 0, runtime.env ?? process.env);
		if (info.status !== "supported") throw new Error("Recovery requires a supported external Bun executable.", { cause: info.status === "probe-failed" ? info.error : void 0 });
		sqliteLibrary = info.sqliteLibraryPath;
	} else {
		const version = spawnSync(node, ["--version"], {
			env: {},
			encoding: "utf8",
			timeout: 5e3,
			stdio: [
				"ignore",
				"pipe",
				"pipe"
			]
		});
		if (version.status !== 0 || !isSupportedOpenClawNodeVersion(version.stdout.trim().replace(/^v/u, ""))) throw new Error("Recovery requires a supported external Node executable.");
	}
	assertCurrent();
	assertRuntime();
	const reader = createPackageIntegrityReader();
	const candidate = await reader.tree(stageRoot);
	const launchers = [];
	for (const entry of params.launchers) {
		const source = path.join(launcherRoot, entry.name);
		const destination = path.join(binDir, entry.name);
		launchers.push({
			...entry,
			candidate: encodePackageActivationLauncher(await reader.launcher(source)),
			candidateIdentity: packageActivationIdentity(source, "launcher"),
			previousIdentity: entry.previous === null ? null : packageActivationIdentity(destination, "launcher")
		});
	}
	const parentIdentity = packageActivationIdentity(parent, true);
	const binIdentity = packageActivationIdentity(binDir, true);
	if (candidate.identity.split(":")[0] !== parentIdentity.split(":")[0] || params.previous.identity.split(":")[0] !== parentIdentity.split(":")[0]) throw new Error("Package publication recovery requires same-filesystem directories.");
	assertPackageActivationLayout(anchor);
	const priorJournal = fs.lstatSync(resolvePackageActivationControl(anchor), { throwIfNoEntry: false }) ? openPackageActivationJournal(anchor) : void 0;
	const prior = priorJournal?.read();
	if (prior && !isPackageActivationComplete(anchor, prior)) throw new Error("An unresolved package operation already owns this installation. Run openclaw update repair before retrying.");
	if (priorJournal && prior) try {
		priorJournal.archiveSettled(prior, assertCurrent);
	} catch (error) {
		assertCurrent();
		if (fs.existsSync(resolvePackageActivationJournalPath(anchor))) priorJournal.assertCurrent(prior);
		throw new PackageActivationArchiveError(`Completed package recovery evidence retained; standalone publication repair is unavailable for this update: ${formatErrorMessage(error)}`, { cause: error });
	}
	const preparation = [
		{
			name: "candidate",
			source: stageRoot,
			identity: candidate.identity
		},
		{
			name: "launchers",
			source: launcherRoot,
			identity: packageActivationIdentity(launcherRoot, true)
		},
		...previousLauncherRoot ? [{
			name: "previous-launchers",
			source: previousLauncherRoot,
			identity: packageActivationIdentity(previousLauncherRoot, true)
		}] : []
	].map((entry) => ({
		name: entry.name,
		source: entry.source,
		identity: entry.identity,
		sourceParentIdentity: packageActivationIdentity(path.dirname(entry.source), true)
	}));
	const helperBytes = sealPackageActivationSqliteLibrary(readPackageActivationRuntime(), sqliteLibrary);
	assertCurrent();
	assertRuntime();
	const stagedAnchor = await fs$1.mkdtemp(path.join(path.dirname(stageRoot), ".activation-anchor-"));
	const anchorIdentity = packageActivationIdentity(stagedAnchor, true);
	const stagedControl = await fs$1.mkdtemp(path.join(path.dirname(stageRoot), ".activation-control-"));
	const stagedHelper = path.join(stagedControl, "recovery.mjs");
	assertCurrent();
	const helperFd = fs.openSync(stagedHelper, "wx", 384);
	try {
		fs.writeFileSync(helperFd, helperBytes);
		fs.fsyncSync(helperFd);
	} finally {
		fs.closeSync(helperFd);
	}
	for (const directory of /* @__PURE__ */ new Set([
		stagedAnchor,
		path.dirname(stagedHelper),
		path.dirname(stagedAnchor)
	])) {
		assertCurrent();
		requireDirectorySync(await syncDirectory(directory), "Package preparation staging");
	}
	assertCurrent();
	const helperIdentity = packageActivationIdentity(stagedHelper, false);
	const helperDigest = createHash("sha256").update(helperBytes).digest("hex");
	preparation.unshift({
		name: "anchor",
		source: stagedAnchor,
		identity: anchorIdentity,
		sourceParentIdentity: packageActivationIdentity(path.dirname(stagedAnchor), true)
	}, {
		name: "helper",
		source: resolvePackageActivationHelper(anchor),
		identity: helperIdentity,
		sourceParentIdentity: packageActivationIdentity(path.dirname(stagedHelper), true)
	});
	const descriptor = {
		version: 1,
		layout: "external-helper",
		operationId: randomUUID(),
		recoveryNodePath: node,
		authority,
		anchorIdentity,
		parentIdentity,
		journalParentIdentity: packageActivationIdentity(stagedControl, true),
		binDir,
		binIdentity,
		originalStageRoot: stageRoot,
		previous: params.previous,
		candidate,
		launcherRootIdentity: packageActivationIdentity(launcherRoot, true),
		previousLauncherRootIdentity: previousLauncherRoot ? packageActivationIdentity(previousLauncherRoot, true) : null,
		helperDigest,
		helperIdentity,
		preparation,
		launchers
	};
	const journal = createPackageActivationJournal(anchor, descriptor, stagedControl, assertCurrent, params.onCustody);
	const command = packageActivationRecoveryCommand(node, anchor, descriptor.operationId, void 0, sqliteLibrary);
	assertCurrent();
	await completePackageActivationCustody(anchor, journal, assertCurrent, () => params.options.onPrepared(`${command} status`));
	const initial = journal.read();
	initial.descriptor.previous = params.previous;
	initial.descriptor.candidate = candidate;
	return {
		anchor,
		journal,
		command,
		initial
	};
}
//#endregion
//#region src/infra/package-update-activation-settlement.ts
/** Verify the installed candidate without republishing it or trusting its old tree fingerprint. */
async function verifyPackagePublicationSettlement(record, assertCurrent) {
	const descriptor = record.descriptor;
	const live = descriptor.authority.installKey;
	assertCurrent();
	const observed = /* @__PURE__ */ new Map();
	for (const relative of [
		"",
		"dist",
		"package.json",
		PACKAGE_DIST_INVENTORY_RELATIVE_PATH,
		PACKAGE_DIST_CONTENT_INVENTORY_RELATIVE_PATH
	]) {
		const file = path.join(live, relative);
		observed.set(file, fs.lstatSync(file, { bigint: true }));
	}
	const { collectPackageDistContentInventory, readPackageDistContentInventoryIfPresent, readPackageDistInventoryIfPresent } = await import("./package-dist-inventory-BkyyN5iQ.mjs");
	const expected = await readPackageDistContentInventoryIfPresent(live);
	const inventory = await readPackageDistInventoryIfPresent(live);
	if (!expected?.length || !inventory) throw new Error("Package settlement requires the installed package's dist content inventory.");
	const inventoried = expected.map((entry) => entry.path);
	if (!isDeepStrictEqual(inventory.toSorted(), [...inventoried, "dist/postinstall-content-inventory.json"].toSorted())) throw new Error("Package settlement inventories disagree about the required dist paths.");
	for (const relative of inventoried) {
		let file = path.join(live, relative);
		while (file !== live) {
			if (!observed.has(file)) observed.set(file, fs.lstatSync(file, { bigint: true }));
			file = path.dirname(file);
		}
	}
	const actual = await collectPackageDistContentInventory(live, inventoried);
	const mismatches = expected.filter((entry, index) => comparePackageDistContentInventory([entry], [actual[index]]).length > 0).map((entry) => entry.path);
	if (mismatches.length) throw new Error(`Package settlement refused: inventoried dist files changed: ${mismatches.join(", ")}.`);
	const buildInfo = asOptionalRecord(JSON.parse(await fs$1.readFile(path.join(live, "dist/build-info.json"), "utf8")));
	if (!inventoried.includes("dist/build-info.json") || buildInfo?.version !== descriptor.candidate.version) throw new Error(`Package settlement requires build-info version ${descriptor.candidate.version}.`);
	const manifest = readRootJsonObjectSync({
		rootDir: live,
		relativePath: "package.json",
		boundaryLabel: "Package settlement",
		rejectHardlinks: false,
		maxBytes: 16777216
	});
	if (!manifest.ok || manifest.value.name !== "openclaw" || manifest.value.version !== descriptor.candidate.version || manifest.value.type !== "module") throw new Error(`Package settlement requires package.json with name openclaw, version ${descriptor.candidate.version}, and type module.`);
	const contentPaths = new Set(inventoried);
	const assertTarget = (field, target) => {
		const file = typeof target === "string" ? path.resolve(live, target) : live;
		const relative = path.relative(live, file).split(path.sep).join("/");
		if (typeof target !== "string" || !target || target.includes("\\") || field === "exports" && !target.startsWith("./") || relative === ".." || relative.startsWith("../") || path.isAbsolute(relative) || relative.startsWith("dist/") && !contentPaths.has(relative) || !fs.statSync(file, { throwIfNoEntry: false })?.isFile()) throw new Error(`Package settlement refused: package.json ${field} must resolve to a package file (inventoried within dist)${typeof target === "string" ? `: ${target}` : "."}`);
		const resolved = fs.realpathSync(file);
		if (!resolved.startsWith(`${live}${path.sep}`)) throw new Error(`Package settlement refused: package.json ${field} leaves the package: ${target}.`);
		for (const observedPath of [file, resolved]) if (!observed.has(observedPath)) observed.set(observedPath, fs.lstatSync(observedPath, { bigint: true }));
	};
	if (manifest.value.main !== void 0) assertTarget("main", manifest.value.main);
	if (manifest.value.bin !== void 0) {
		const bins = asOptionalRecord(manifest.value.bin);
		for (const target of bins ? Object.values(bins) : [manifest.value.bin]) assertTarget("bin", target);
	}
	const exportTargets = [manifest.value.exports];
	while (exportTargets.length) {
		const target = exportTargets.pop();
		if (target === void 0 || target === null) continue;
		const conditions = asOptionalRecord(target);
		if (Array.isArray(target)) exportTargets.push(...target);
		else if (conditions) exportTargets.push(...Object.values(conditions));
		else assertTarget("exports", target);
	}
	const reader = createPackageIntegrityReader();
	for (const entry of descriptor.launchers) {
		const launcher = path.join(descriptor.binDir, entry.name);
		observed.set(launcher, fs.lstatSync(launcher, { bigint: true }));
		if (packageLauncherDifferences(decodePackageActivationLauncher(entry.candidate), await reader.launcher(launcher), { checkMode: true }).length) throw new Error(`Package settlement launcher changed: ${entry.name}.`);
	}
	const assertUnchanged = () => {
		assertCurrent();
		if (packageActivationIdentity(live, true) !== descriptor.candidate.identity || packageActivationIdentity(descriptor.binDir, true) !== descriptor.binIdentity) throw new Error("Package settlement identity changed.");
		for (const [file, before] of observed) if (!packageStatUnchanged(before, fs.lstatSync(file, { bigint: true }))) throw new Error(`Package settlement observation changed: ${path.relative(live, file)}.`);
	};
	assertUnchanged();
	const extraInspection = await walkDirectory(path.join(live, "dist"), {
		symlinks: "include",
		descend: (entry) => {
			if (!observed.has(entry.path)) observed.set(entry.path, fs.lstatSync(entry.path, { bigint: true }));
			return true;
		}
	});
	const inventoryPaths = /* @__PURE__ */ new Set([...inventory, PACKAGE_DIST_INVENTORY_RELATIVE_PATH]);
	const extraManifests = extraInspection.entries.filter((entry) => entry.name.toLowerCase() === "package.json").map((entry) => `dist/${entry.relativePath.replace(/\\/gu, "/")}`).filter((file) => !contentPaths.has(file));
	if (extraManifests.length || extraInspection.failedDirs.length) throw new Error(`Package settlement refused: unverified package.json scopes: ${[...extraManifests, ...extraInspection.failedDirs.map((entry) => `dist/${entry.relativePath} (unreadable)`)].join(", ")}.`);
	const extras = extraInspection.entries.filter((entry) => entry.kind !== "directory").map((entry) => `dist/${entry.relativePath.replace(/\\/gu, "/")}`).filter((file) => !inventoryPaths.has(file)).toSorted();
	assertUnchanged();
	return {
		assertUnchanged,
		detail: `Root package.json was field-verified, not content-verified. Entry targets outside dist were checked for resolution, not content. Inventoried dist content mismatches: none. Extra dist paths: ${extras.length ? extras.join(", ") : "none"}. Original per-path metadata is not retained in the sealed tree digest.`
	};
}
//#endregion
//#region src/infra/package-update-publication-owner.ts
const log = createSubsystemLogger("update/package-integrity");
function createPublicationOwner(anchor, journal, assertOwner, initial = journal.read(), assertJournalCurrent = journal.assertCurrent.bind(journal)) {
	const assertion = retainMutationAuthority(assertOwner);
	let record = initial;
	const descriptor = record.descriptor;
	const legacy = descriptor.helperDigest === LEGACY_PACKAGE_RECOVERY_HELPER;
	const trees = {};
	let retirementSelected;
	const live = descriptor.authority.installKey;
	const matchesSelected = (selected, contents = true) => matches(live, descriptor[selected], selected === "previous" ? live : descriptor.originalStageRoot, contents);
	const root = (name) => path.join(anchor, name);
	const helperIdentity = descriptor.helperIdentity;
	const custodyPath = (name) => {
		if (record.phase !== "preparing") return name === "anchor" ? anchor : resolvePackageActivationHelper(anchor);
		const entry = inspectPackageActivationCustody(anchor, record).find((item) => item.name === name);
		if (!entry) throw new Error("Package bootstrap custody is missing.");
		return entry.moved ? entry.destination : entry.source;
	};
	const helper = () => custodyPath("helper");
	const artifactNames = [
		"previous",
		"candidate",
		"previous.candidate",
		"launchers",
		"previous-launchers"
	];
	const assertInventory = (allowed = artifactNames) => {
		let entries;
		try {
			entries = fs.readdirSync(custodyPath("anchor"));
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT") && (record.phase === "anchor-retired" || record.intent?.kind === "remove-anchor")) return;
			throw error;
		}
		if (entries.some((name) => !allowed.includes(name))) throw new Error("Unknown package recovery artifacts require operator inspection.");
	};
	const assertCurrent = () => {
		assertion();
		assertJournalCurrent(record);
		const currentAnchor = packageActivationIdentityOrAbsent(custodyPath("anchor"), true);
		if (currentAnchor !== descriptor.anchorIdentity && !(currentAnchor === null && (record.phase === "anchor-retired" || record.intent?.kind === "remove-anchor"))) throw new Error("Package recovery anchor identity changed.");
		if (packageActivationIdentity(descriptor.binDir, true) !== descriptor.binIdentity) throw new Error("Package launcher parent changed");
		if (retirementSelected) {
			if (packageActivationIdentity(live, true) !== descriptor[retirementSelected].identity) throw new Error("Selected package changed during retirement.");
			assertPackageActivationSelectedLaunchers(record, retirementSelected);
		}
	};
	const transition = (phase, intent = null, publications = record.publications) => {
		assertCurrent();
		record = journal.transition(record, phase, intent, assertion, publications);
	};
	const matches = async (file, expected, logical, contents = true) => {
		const id = packageActivationIdentityOrAbsent(file, true);
		if (id === null) return false;
		if (id !== expected.identity) throw new Error(`Package publication object changed: ${file}`);
		if (!contents) return true;
		if (legacy && expected === descriptor.previous) {
			const current = await createPackageIntegrityReader().directoryIdentity(file);
			if (current?.identity !== expected.identity || current.version !== expected.version) throw new Error(`Package publication object changed: ${file}`);
			if (!trees.legacyWarning) {
				trees.legacyWarning = "legacy package record settled by identity and version; content could not be re-verified";
				log.warn(trees.legacyWarning);
			}
			return true;
		}
		const observed = await createPackageIntegrityReader().tree(file, logical, expected, legacy);
		if (!isDeepStrictEqual(observed, expected)) throw new PackageIntegrityMismatchError(`Package publication object changed: ${file}`, packageIntegrityDifferences(expected, observed));
		return true;
	};
	const inspect = async (contents = "all") => {
		const reader = createPackageIntegrityReader();
		const liveIdentity = packageActivationIdentityOrAbsent(live, true);
		let selected = null;
		if (liveIdentity !== null) {
			selected = liveIdentity === descriptor.previous.identity ? "previous" : liveIdentity === descriptor.candidate.identity ? "candidate" : null;
			if (!selected) throw new Error("The installed package is not either recorded generation.");
			await matchesSelected(selected, contents === "all" || contents === "selected");
		}
		const previous = await matches(root("previous"), descriptor.previous, live, contents === "all");
		const candidate = await matches(root("candidate"), descriptor.candidate, descriptor.originalStageRoot, contents === "all" || contents === "staged");
		if (selected === "previous" === previous || selected === "candidate" === candidate) throw new Error("Package publication generation roles are ambiguous.");
		if (packageActivationIdentity(root("launchers"), true) !== descriptor.launcherRootIdentity) throw new Error("Candidate launcher assets changed.");
		const published = new Map(record.publications.map((entry) => [entry.name, entry.identity]));
		if (record.intent?.kind === "launcher") published.set(record.intent.name, record.intent.identity);
		const launcherStates = /* @__PURE__ */ new Map();
		for (const entry of descriptor.launchers) {
			const source = root(`launchers/${entry.name}`);
			if (packageActivationIdentity(source, "launcher") !== entry.candidateIdentity || !matchesPackageActivationLauncher(await reader.launcher(source), entry.candidate)) throw new Error("Candidate launcher assets changed.");
			const destination = path.join(descriptor.binDir, entry.name);
			const present = await reader.exists(destination);
			const id = present ? packageActivationIdentity(destination, "launcher") : null;
			const fingerprint = present ? await reader.launcher(destination) : null;
			if (id === entry.previousIdentity && matchesPackageActivationLauncher(fingerprint, entry.previous)) launcherStates.set(entry.name, "previous");
			else if (id === published.get(entry.name) && matchesPackageActivationLauncher(fingerprint, entry.candidate)) launcherStates.set(entry.name, "candidate");
			else throw new Error(`Package launcher changed outside its publication intent: ${entry.name}`);
		}
		return {
			selected,
			previous,
			candidate,
			launcherStates
		};
	};
	const verifyClosure = async () => {
		assertInventory();
		assertManagedUpdateLeaseDatabaseIdentity(descriptor.authority);
		if (packageActivationIdentity(helper(), false) !== helperIdentity) throw new Error("Sealed package recovery helper identity changed.");
		const bytes = await fs$1.readFile(helper());
		if (createHash("sha256").update(bytes).digest("hex") !== descriptor.helperDigest) throw new Error("Sealed package recovery helper changed.");
		assertCurrent();
	};
	const persistPackageSelection = async (selected) => {
		const rejected = selected === "previous" && packageActivationIdentityOrAbsent(root("previous.candidate"), true) !== null;
		const roles = [
			[live, selected === "displaced" ? null : descriptor[selected].identity],
			[root("previous"), selected === "previous" ? null : descriptor.previous.identity],
			[root("candidate"), selected === "displaced" || selected === "previous" && !rejected ? descriptor.candidate.identity : null],
			[root("previous.candidate"), rejected ? descriptor.candidate.identity : null]
		];
		const assertSelected = () => {
			assertCurrent();
			if (roles.some(([file, identity]) => packageActivationIdentityOrAbsent(file, true) !== identity)) throw new Error("Package selection changed during persistence.");
		};
		for (const directory of [anchor, path.dirname(live)]) {
			assertSelected();
			const outcome = await syncDirectory(directory);
			assertSelected();
			requireDirectorySync(outcome, "Package selection");
		}
	};
	const publish = async (resume, onDisplaced) => {
		await verifyClosure();
		assertPackageActivationActionAllowed(record, "repair");
		if (record.phase === "preparing") {
			await completePackageActivationCustody(anchor, journal, assertion);
			record = journal.read();
		}
		let observed = await inspect();
		assertCurrent();
		if (resume && observed.selected === "previous" && !observed.previous) {
			if ([...observed.launcherStates.values()].some((value) => value !== "previous")) throw new Error("Untouched package has changed launchers; recovery is ambiguous.");
			transition("aborted");
			return readPackageActivationRecordStatus(record);
		}
		if (observed.selected === "previous") {
			transition("publishing", { kind: "displace" });
			assertCurrent();
			if (packageActivationIdentityOrAbsent(live, true) !== descriptor.previous.identity || packageActivationIdentityOrAbsent(root("previous"), true) !== null) throw new Error("Package displacement preimage changed.");
			await fs$1.rename(live, root("previous"));
			await persistPackageSelection("displaced");
			await onDisplaced?.();
			assertCurrent();
		} else if (observed.selected === null) await persistPackageSelection("displaced");
		if (observed.selected !== "candidate") {
			await inspect("staged");
			assertCurrent();
			transition("publishing", { kind: "publish" });
			await activateStagedNpmPackageRoot(root("candidate"), live, () => {
				assertCurrent();
				if (packageActivationIdentityOrAbsent(root("candidate"), true) !== descriptor.candidate.identity || packageActivationIdentityOrAbsent(root("previous"), true) !== descriptor.previous.identity || packageActivationIdentityOrAbsent(live, true) !== null) throw new Error("Candidate publication preimage changed.");
			});
		}
		await persistPackageSelection("candidate");
		for (const entry of descriptor.launchers) {
			observed = await inspect("none");
			assertCurrent();
			if (observed.launcherStates.get(entry.name) === "candidate") {
				const destination = path.join(descriptor.binDir, entry.name);
				const id = packageActivationIdentity(destination, "launcher");
				requireDirectorySync(await syncDirectory(descriptor.binDir), "Recovered package launcher");
				assertCurrent();
				if (packageActivationIdentity(destination, "launcher") !== id) throw new Error("Recovered launcher changed during persistence.");
				if (!record.publications.some((item) => item.name === entry.name)) transition("publishing", null, [...record.publications, {
					name: entry.name,
					identity: id
				}]);
				continue;
			}
			await copyPackagePathEntry(root(`launchers/${entry.name}`), path.join(descriptor.binDir, entry.name), () => {
				assertCurrent();
				if (packageActivationIdentityOrAbsent(root(`launchers/${entry.name}`), "launcher") !== entry.candidateIdentity) throw new Error("Launcher publication preimage changed.");
			}, (staged) => {
				assertCurrent();
				if (packageActivationIdentityOrAbsent(path.join(descriptor.binDir, entry.name), "launcher") !== entry.previousIdentity) throw new Error("Launcher publication preimage changed.");
				transition("publishing", {
					kind: "launcher",
					name: entry.name,
					identity: packageActivationIdentity(staged, "launcher")
				});
			});
			const id = packageActivationIdentity(path.join(descriptor.binDir, entry.name), "launcher");
			transition("publishing", null, [...record.publications, {
				name: entry.name,
				identity: id
			}]);
		}
		observed = await inspect("selected");
		assertCurrent();
		if (observed.selected !== "candidate") throw new Error("Candidate publication is incomplete.");
		transition("publication-complete");
		return trees.legacyWarning ? retire() : readPackageActivationRecordStatus(record);
	};
	const assertSettlementSelection = (selected, cause) => {
		assertion();
		assertManagedUpdateLeaseDatabaseIdentity(descriptor.authority);
		if (packageActivationIdentity(live, true) !== descriptor[selected].identity) throw new Error("Selected package changed during retirement.", { cause });
		assertPackageActivationSelectedLaunchers(record, selected);
	};
	const settleSelected = (selected, detail, onSettled) => {
		const settled = settlePackageActivationCustody({
			anchor,
			journal,
			record,
			settlement: {
				kind: "publication-settled-external-change",
				replacementIdentity: descriptor[selected].identity,
				settled: true,
				detail
			},
			assertCurrent: () => assertSettlementSelection(selected),
			onSettled: () => onSettled?.(detail)
		});
		record = settled.record;
		return settled;
	};
	const retire = async (onSettled) => {
		await verifyClosure();
		assertPackageActivationActionAllowed(record, "retire");
		const selected = selectedPackageRetirementGeneration(record);
		if (!await matchesSelected(selected)) throw new Error("Selected package is missing.");
		await verifyPackageActivationSelectedLaunchers(record, selected);
		retirementSelected = selected;
		assertCurrent();
		if (trees.legacyWarning) {
			const { archiveWarning } = settleSelected(selected, trees.legacyWarning, onSettled);
			if (archiveWarning) log.warn(archiveWarning);
			return readPackageActivationRecordStatus(record);
		}
		if (!["retiring", "anchor-retired"].includes(record.phase)) {
			const publications = record.phase === "aborted" ? descriptor.launchers.flatMap((entry) => entry.previousIdentity ? [{
				name: entry.name,
				identity: entry.previousIdentity
			}] : []) : record.publications;
			transition("retiring", {
				kind: "retire",
				selected
			}, publications);
		}
		for (const name of artifactNames) {
			const target = root(name);
			if (!await packagePathEntryExists(target)) {
				assertCurrent();
				continue;
			}
			const id = packageActivationIdentity(target, true);
			if (id !== (name === "previous" ? descriptor.previous.identity : name === "candidate" || name === "previous.candidate" ? descriptor.candidate.identity : name === "launchers" ? descriptor.launcherRootIdentity : descriptor.previousLauncherRootIdentity)) throw new Error("Retirement target identity changed.");
			transition("retiring", {
				kind: "remove",
				name,
				identity: id,
				selected
			});
			await removePackagePath(target, () => {
				assertCurrent();
				const current = packageActivationIdentityOrAbsent(target, true);
				if (current !== null && current !== id) throw new Error("Retirement target changed before removal.");
			});
		}
		if (record.phase !== "anchor-retired") {
			if (record.intent?.kind !== "remove-anchor") transition("retiring", {
				kind: "remove-anchor",
				identity: descriptor.anchorIdentity,
				selected
			});
			assertCurrent();
			assertInventory([]);
			const current = packageActivationIdentityOrAbsent(anchor, true);
			if (current !== null) {
				if (current !== descriptor.anchorIdentity) throw new Error("Final anchor identity changed.");
				await fs$1.rmdir(anchor);
			}
			assertCurrent();
			requireDirectorySync(await syncDirectory(path.dirname(anchor)), "Package anchor retirement");
			assertCurrent();
			if (packageActivationIdentityOrAbsent(anchor, true) !== null) throw new Error("Package anchor was not retired.");
			transition("anchor-retired", {
				kind: "retire",
				selected
			});
		}
		assertCurrent();
		if (packageActivationIdentityOrAbsent(anchor, true) !== null || packageActivationIdentity(helper(), false) !== helperIdentity) throw new Error("Final package recovery cleanup identity changed.");
		transition("anchor-retired", {
			kind: "unlink-helper",
			identity: helperIdentity,
			selected
		});
		assertCurrent();
		if (packageActivationIdentity(helper(), false) !== helperIdentity) throw new Error("Final helper identity changed.");
		await fs$1.unlink(helper());
		assertCurrent();
		const outcome = await syncDirectory(path.dirname(helper()));
		assertCurrent();
		requireDirectorySync(outcome, "Package helper retirement");
		if (!isPackageActivationComplete(anchor, record)) throw new Error("Package recovery artifacts were not retired.");
		return readPackageActivationRecordStatus(record);
	};
	const retireVerified = async (onSettled) => {
		if (record.phase !== "prepared") assertPackageActivationActionAllowed(record, "retire");
		const selected = selectedPackageRetirementGeneration(record);
		try {
			await retire(onSettled);
			return trees.legacyWarning;
		} catch (error) {
			const assertSelected = () => assertSettlementSelection(selected, error);
			assertSelected();
			assertJournalCurrent(record);
			await matchesSelected(selected);
			await verifyPackageActivationSelectedLaunchers(record, selected);
			assertSelected();
			assertJournalCurrent(record);
			const detail = `Verified ${selected} package; recovery evidence retained after cleanup failed: ${formatErrorMessage(error)}`;
			return settleSelected(selected, detail, onSettled).warning;
		}
	};
	return {
		publish,
		retire,
		retireVerified,
		async disarmRollback() {
			assertCurrent();
			const observed = await inspect();
			assertCurrent();
			if (observed.selected === "previous" && !observed.previous && [...observed.launcherStates.values()].every((value) => value === "previous")) {
				transition("aborted");
				return false;
			}
			transition("rollback-in-progress", record.intent);
			return observed.previous;
		},
		recordRestoredLauncher(name, staged) {
			if (record.phase !== "rollback-in-progress") throw new Error("Launcher restoration requires durable rollback intent.");
			const identity = packageActivationIdentity(staged, "launcher");
			transition("rollback-in-progress", {
				kind: "launcher",
				name,
				identity
			}, [...record.publications.filter((entry) => entry.name !== name), {
				name,
				identity
			}]);
		},
		async restored() {
			assertCurrent();
			assertPackageActivationSelectedLaunchers(record, "previous");
			const outcome = await syncDirectory(descriptor.binDir);
			assertCurrent();
			assertPackageActivationSelectedLaunchers(record, "previous");
			requireDirectorySync(outcome, "Restored package launchers");
			await persistPackageSelection("previous");
			const publications = descriptor.launchers.flatMap((entry) => {
				const identity = entry.previous === null ? null : record.publications.find((published) => published.name === entry.name)?.identity ?? entry.previousIdentity;
				if (packageActivationIdentityOrAbsent(path.join(descriptor.binDir, entry.name), "launcher") !== identity) throw new Error("Restored launcher does not match its original owner.");
				return identity ? [{
					name: entry.name,
					identity
				}] : [];
			});
			transition("rolled-back", null, publications);
		},
		status: () => readPackageActivationRecordStatus(record),
		assertCurrent
	};
}
//#endregion
//#region src/infra/package-update-activation.ts
function inspectPackageActivationLease({ databasePath, databaseIdentity, parentIdentity }) {
	let current;
	try {
		current = captureManagedUpdateLeaseDatabaseIdentity(databasePath);
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT") || fs.lstatSync(databasePath, { throwIfNoEntry: false })) throw error;
	}
	return {
		current,
		changed: !isDeepStrictEqual(current, {
			databasePath,
			databaseIdentity,
			parentIdentity
		})
	};
}
/** Reconcile completed receipts; unfinished operations still require a live fence. */
function readPackageActivationContinuation(installKey, dryRun) {
	const anchor = resolvePackageActivationAnchor(installKey);
	const released = readReleasedPackageActivationReceipt(installKey);
	if (released) throw new Error(`Package publication recovery is pending. With the recorded external runtime, run ${released.recoveryCommand}, then use that original helper to repair or retire; keep other package managers stopped.`);
	assertPackageActivationLayout(anchor);
	const journalPath = resolvePackageActivationJournalPath(anchor);
	if (!fs.lstatSync(journalPath, { throwIfNoEntry: false })) {
		if (fs.lstatSync(anchor, { throwIfNoEntry: false }) || fs.lstatSync(resolvePackageActivationControl(anchor), { throwIfNoEntry: false })) throw new Error(`Incomplete or legacy recovery artifacts require their original owner: ${anchor}. The next mutable update is blocked.`);
		return;
	}
	const record = openPackageActivationJournal(anchor).readForAdmission(installKey);
	if (isPackageActivationComplete(anchor, record)) return;
	if (dryRun && [
		"prepared",
		"publishing",
		"publication-complete",
		"aborted",
		"superseded"
	].includes(record.phase) && [record.descriptor.previous.identity, record.descriptor.candidate.identity].includes(packageActivationIdentity(installKey, true)) && inspectPackageActivationLease(record.descriptor.authority).changed) return;
	assertManagedUpdateLeaseDatabaseIdentity(record.descriptor.authority);
	if (record.phase === "superseded") throw new Error("Package recovery settlement is incomplete; run openclaw update repair.");
	if (record.phase !== "publication-complete") throw new Error(`Package publication is incomplete; its original continuation cannot run. With the recorded external runtime, run ${resolvePackageActivationRecoveryCommand(record)} status, then repair or retire; keep other package managers stopped.`);
	return record;
}
function assertNoPendingPackageActivation(installKey, options) {
	const record = readPackageActivationContinuation(installKey, options?.dryRun);
	if (!record) return;
	if (options?.continuation && isDeepStrictEqual(record.descriptor.authority, captureUpdateCommandExecutorAuthority(options.continuation))) return;
	throw new Error(`Package publication recovery is pending. With the recorded external runtime, run ${resolvePackageActivationRecoveryCommand(record)} status, then repair or retire; keep other package managers stopped.`);
}
async function preparePackageActivation(params) {
	const fence = params.options.fence;
	const assertOriginal = retainMutationAuthority(fence.assertCurrent.bind(fence));
	const options = {
		...params.options,
		fence
	};
	if (process.platform === "win32" || params.installTarget.manager !== "npm" || params.installTarget.directNodeModulesRoot || !(await fs$1.lstat(params.stageRoot)).isDirectory()) return;
	const nodeRunner = resolveExecutablePath(options.runtime.path, { useCache: false });
	assertOriginal();
	if (!nodeRunner) {
		options.onUnavailable?.("Standalone package publication repair is unavailable: the selected runtime executable could not be resolved.");
		return;
	}
	const capable = await supportsPostCoreExecutor(params.stageRoot, nodeRunner);
	assertOriginal();
	if (!capable) {
		options.onUnavailable?.("Standalone package publication repair is unavailable for this target: its update worker does not support delegated post-core execution.");
		return;
	}
	let prepared;
	try {
		prepared = await preparePackageActivationJournal({
			...params,
			options
		}, assertOriginal);
	} catch (error) {
		if (!(error instanceof PackageActivationArchiveError)) throw error;
		options.onUnavailable?.(error.message);
		return;
	}
	const owner = createPublicationOwner(prepared.anchor, prepared.journal, assertOriginal, prepared.initial);
	return {
		...prepared,
		...owner
	};
}
function readPackageActivationReceipt(installKey) {
	const released = readReleasedPackageActivationReceipt(installKey);
	if (released) return released;
	const anchor = resolvePackageActivationAnchor(installKey);
	if (!fs.existsSync(resolvePackageActivationJournalPath(anchor))) {
		readPackageActivationContinuation(installKey);
		return;
	}
	const record = openPackageActivationJournal(anchor).read();
	const receipt = readPackageActivationRecordStatus(record);
	if (receipt.phase !== "complete") assertManagedUpdateLeaseDatabaseIdentity(record.descriptor.authority);
	return receipt.phase === "complete" || record.phase === "superseded" ? receipt : {
		...receipt,
		recoveryCommand: `${resolvePackageActivationRecoveryCommand(record)} status`
	};
}
/** Explicit repair settles untouched preparation or obsolete custody, never pending restoration. */
async function settlePendingPackageActivation(installKey, onSettled, expectedCompleted, options) {
	const anchor = resolvePackageActivationAnchor(installKey);
	if (!expectedCompleted && !fs.existsSync(resolvePackageActivationJournalPath(anchor))) {
		assertNoPendingPackageActivation(installKey);
		return;
	}
	const journal = openPackageActivationJournal(anchor);
	const admission = options?.dryRun ? void 0 : await journal.readForRecovery();
	const initial = admission?.record ?? journal.read();
	const complete = isPackageActivationComplete(anchor, initial);
	if (expectedCompleted && (!complete || !isDeepStrictEqual(initial, expectedCompleted))) throw new Error("Completed package receipt changed; inspect recovery status before retrying.");
	if (initial.phase === "rollback-in-progress") throw new Error("Package restoration is unfinished; its rollback owner must finish recovery.");
	const priorSettlement = initial.phase === "superseded" && initial.intent && "settled" in initial.intent ? initial.intent : void 0;
	const receipt = priorSettlement || complete ? {
		operationId: initial.descriptor.operationId,
		reason: priorSettlement?.kind ?? "publication-retired",
		retained: `${anchor}.superseded-${initial.descriptor.operationId}`,
		detail: priorSettlement?.detail
	} : void 0;
	if (options?.onlyStaleLease && complete) return options.dryRun ? receipt : void 0;
	const originalAuthority = initial.descriptor.authority;
	const replacementIdentity = packageActivationIdentity(installKey, true);
	if (options?.onlyStaleLease && ![initial.descriptor.previous.identity, initial.descriptor.candidate.identity].includes(replacementIdentity)) return;
	const lease = inspectPackageActivationLease(originalAuthority);
	const leaseWasMissing = !lease.current || initial.phase === "superseded" && initial.intent?.kind === "recovery-lease-missing";
	const leaseIdentityChanged = leaseWasMissing || lease.changed;
	if (options?.onlyStaleLease && !leaseIdentityChanged) return;
	const reason = leaseWasMissing ? "recovery-lease-missing" : leaseIdentityChanged ? "recovery-lease-identity-changed" : "superseded-by-manual-install";
	const externalPublication = replacementIdentity === initial.descriptor.candidate.identity && (initial.phase === "prepared" || initial.phase === "publishing" || initial.phase === "publication-complete" || initial.phase === "superseded" && initial.intent?.kind === "publication-settled-external-change");
	const unusedPreparation = replacementIdentity === initial.descriptor.previous.identity && (initial.phase === "prepared" && initial.intent === null && initial.publications.length === 0 || initial.phase === "aborted");
	const publicationNotStarted = !leaseIdentityChanged && unusedPreparation;
	if (!complete && !publicationNotStarted && !externalPublication && !(leaseIdentityChanged && (unusedPreparation || initial.phase === "publication-complete" && replacementIdentity === initial.descriptor.previous.identity || initial.phase === "superseded")) && [initial.descriptor.previous.identity, initial.descriptor.candidate.identity].includes(replacementIdentity)) {
		assertNoPendingPackageActivation(installKey);
		return;
	}
	if (options?.dryRun) {
		if (externalPublication) await verifyPackagePublicationSettlement(initial, () => journal.assertCurrent(initial));
		return {
			operationId: initial.descriptor.operationId,
			reason,
			retained: `${anchor}.superseded-${initial.descriptor.operationId}`,
			detail: void 0,
			warning: void 0
		};
	}
	const currentDatabase = lease.current ?? createManagedHandoffLeaseDatabase(originalAuthority.databasePath)(true, () => captureManagedUpdateLeaseDatabaseIdentity(originalAuthority.databasePath));
	return withUpdateCommandExecutor(randomUUID(), async (executor) => {
		const fence = await executor.enter(installKey);
		const assertCurrent = retainMutationAuthority(fence.assertCurrent);
		assertManagedUpdateLeaseDatabaseIdentity(currentDatabase);
		admission.admit(assertCurrent);
		journal.assertCurrent(initial);
		if (packageActivationIdentity(installKey, true) !== replacementIdentity) throw new Error("The installed package changed before recovery settlement.");
		const finish = (settled, archive = true) => {
			onSettled?.(settled);
			if (archive && settled.retained) settled.warning = archivePackageActivationCustody(anchor, journal, journal.read(), assertCurrent);
			return settled;
		};
		if (complete && receipt) return finish(receipt);
		if (publicationNotStarted) {
			const assertPrevious = () => {
				assertCurrent();
				if (packageActivationIdentity(installKey, true) !== initial.descriptor.previous.identity) throw new Error("The installed package changed before preparation retirement.");
			};
			const owner = createPublicationOwner(anchor, journal, assertPrevious, initial);
			if (initial.phase === "prepared") try {
				await owner.disarmRollback();
			} catch {}
			const settled = {
				operationId: initial.descriptor.operationId,
				reason: "publication-not-started",
				retained: void 0,
				detail: void 0
			};
			const warning = await owner.retireVerified((detail) => {
				settled.retained = `${anchor}.superseded-${initial.descriptor.operationId}`;
				settled.detail = detail;
				onSettled?.(settled);
			});
			return warning ? {
				...settled,
				warning
			} : finish(settled, false);
		}
		if (externalPublication) {
			const verified = await verifyPackagePublicationSettlement(initial, assertCurrent);
			const outcome = await syncDirectory(initial.descriptor.binDir);
			verified.assertUnchanged();
			journal.assertCurrent(initial);
			requireDirectorySync(outcome, "Package settlement launcher directory");
			const settled = {
				operationId: initial.descriptor.operationId,
				retained: `${anchor}.superseded-${initial.descriptor.operationId}`,
				reason: "publication-settled-external-change",
				detail: receipt?.detail ?? verified.detail
			};
			const result = settlePackageActivationCustody({
				anchor,
				journal,
				record: initial,
				settlement: {
					kind: "publication-settled-external-change",
					replacementIdentity,
					settled: true,
					detail: settled.detail
				},
				assertCurrent: verified.assertUnchanged,
				onSettled: () => onSettled?.(settled)
			});
			return {
				...settled,
				warning: result.archiveWarning
			};
		}
		const settlement = initial.phase === "superseded" && initial.intent && "settled" in initial.intent ? initial.intent : {
			kind: reason,
			replacementIdentity,
			settled: true,
			detail: receipt?.detail
		};
		const settled = {
			operationId: initial.descriptor.operationId,
			retained: `${anchor}.superseded-${initial.descriptor.operationId}`,
			reason: settlement.kind,
			detail: settlement.detail
		};
		const result = settlePackageActivationCustody({
			anchor,
			journal,
			record: initial,
			settlement,
			assertCurrent: () => {
				assertCurrent();
				if (packageActivationIdentity(installKey, true) !== replacementIdentity) throw new Error("The installed package changed during recovery settlement.");
			},
			onSettled: () => onSettled?.(settled)
		});
		return {
			...settled,
			warning: result.archiveWarning
		};
	}, { existingAuthority: {
		...originalAuthority,
		...currentDatabase
	} });
}
//#endregion
export { removePackageUpdatePath as _, encodePackageActivationLauncher as a, POST_CORE_MUTATION_PROTOCOL as b, assertPackagePathIdentity as c, copyPackagePathEntry as d, discardPackageLauncherBackup as f, removePackagePath as g, packagePathEntryExists as h, settlePendingPackageActivation as i, backupNpmPackageRoot as l, packagePathEntriesMatch as m, preparePackageActivation as n, PACKAGE_MANAGER_SWAP_SOURCE_HARDLINKS as o, discardPackageUpdateBackup as p, readPackageActivationReceipt as r, activateStagedNpmPackageRoot as s, assertNoPendingPackageActivation as t, capturePackageLaunchers as u, restoreNpmPackageRoot as v, supportsPostCoreExecutor as x, POST_CORE_EXECUTOR_CAPABILITY as y };
