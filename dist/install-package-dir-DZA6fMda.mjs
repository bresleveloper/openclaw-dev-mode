import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { d as pathExists, t as FsSafeError } from "./fs-safe-BAPek8At.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { t as movePathWithCopyFallback } from "./replace-file-DJtj9VLX.mjs";
import { h as writeJson, p as tryReadJson } from "./json-files-C0HSMh2Z.mjs";
import { t as assertCanonicalPathWithinBase } from "./install-safe-path-Nbwl6YSJ.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { i as createNpmProjectInstallEnv } from "./npm-install-env-D6spEEnI.mjs";
import { n as formatNpmCommandFailureOutput, u as resolveInstallWorkTimeoutMs } from "./install-source-utils-CeCvRCDR.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { assertDirectoryIdentitySync, readDirectoryIdentity } from "@openclaw/fs-safe/advanced";
import { randomUUID } from "node:crypto";
//#region src/infra/install-progress.ts
/** Only this operation's settlement completes its activity; later work cannot imply success. */
async function withInstallActivity(observer, stage, run, succeeded = (result) => !(result && typeof result === "object" && "ok" in result && result.ok === false)) {
	if (!observer?.activity) return await run();
	const activityId = randomUUID();
	const emit = (status) => {
		try {
			observer.activity?.({
				activityId,
				stage,
				status
			});
		} catch {}
	};
	emit("started");
	try {
		const result = await run();
		emit(succeeded(result) ? "completed" : "failed");
		return result;
	} catch (error) {
		emit("failed");
		throw error;
	}
}
//#endregion
//#region src/infra/safe-package-install.ts
/**
* Creates a project-local npm install environment for untrusted package dirs.
* It disables lifecycle scripts, global/workspace leakage, prompts, and noisy
* npm features while preserving caller-supplied process env values.
*/
function createSafeNpmInstallEnv(env, options = {}) {
	const nextEnv = {
		...createNpmProjectInstallEnv(env, options),
		COREPACK_ENABLE_DOWNLOAD_PROMPT: "0",
		NPM_CONFIG_IGNORE_SCRIPTS: "true",
		npm_config_audit: "false",
		npm_config_fund: "false",
		npm_config_ignore_scripts: "true",
		npm_config_legacy_peer_deps: options.legacyPeerDeps ? "true" : "false",
		npm_config_package_lock: options.packageLock === true ? "true" : "false",
		npm_config_strict_peer_deps: "false",
		...options.packageLock === true ? { npm_config_save: "true" } : {},
		...options.ignoreWorkspaces ? { npm_config_workspaces: "false" } : {}
	};
	if (options.quiet) Object.assign(nextEnv, {
		npm_config_loglevel: "error",
		npm_config_progress: "false",
		npm_config_yes: "true"
	});
	return nextEnv;
}
/**
* Builds npm install argv that mirrors the safe environment defaults.
* Callers opt into dependency omission, legacy peer resolution, and quiet flags.
*/
function createSafeNpmInstallArgs(options = {}) {
	return [
		"install",
		...options.omitDev ? ["--omit=dev"] : [],
		...options.omitPeer ? ["--omit=peer"] : [],
		...options.legacyPeerDeps ? ["--legacy-peer-deps"] : [],
		...options.loglevel ? [`--loglevel=${options.loglevel}`] : [],
		"--ignore-scripts",
		...options.ignoreWorkspaces ? ["--workspaces=false"] : [],
		...options.noAudit ? ["--no-audit"] : [],
		...options.noFund ? ["--no-fund"] : []
	];
}
//#endregion
//#region src/infra/install-package-dir.ts
const DEFAULT_INSTALL_SOURCE_HARDLINKS = "reject";
const INSTALL_BASE_CHANGED_ERROR_MESSAGE = "install base directory changed during install";
const INSTALL_BASE_CHANGED_ABORT_WARNING = "Install base directory changed during install; aborting staged publish.";
const INSTALL_BASE_CHANGED_BACKUP_WARNING = "Install base directory changed before backup cleanup; leaving backup in place.";
const STAGED_NPM_PROJECT_CONFIG_NAME = ".npmrc";
const STAGED_NPM_PROJECT_CONFIG_PREFIX = ".openclaw-install-hidden-npmrc-";
function hasPackageRuntimeDependencies(manifest) {
	return Object.keys(manifest.dependencies ?? {}).length > 0 || Object.keys(manifest.optionalDependencies ?? {}).length > 0;
}
async function sanitizeManifestForNpmInstall(targetDir, omitOpenClawHostDependency) {
	const manifestPath = path.join(targetDir, "package.json");
	const parsed = await tryReadJson(manifestPath);
	if (!isRecord(parsed)) return () => Promise.resolve();
	const manifest = parsed;
	const originalManifest = await fs$1.readFile(manifestPath);
	let changed = false;
	if (Object.hasOwn(manifest, "devDependencies")) {
		delete manifest.devDependencies;
		changed = true;
	}
	if (omitOpenClawHostDependency) for (const key of [
		"dependencies",
		"optionalDependencies",
		"peerDependencies",
		"peerDependenciesMeta"
	]) {
		const dependencies = manifest[key];
		if (!isRecord(dependencies) || !Object.hasOwn(dependencies, "openclaw")) continue;
		delete dependencies.openclaw;
		if (Object.keys(dependencies).length === 0) delete manifest[key];
		changed = true;
	}
	if (changed) {
		await writeJson(manifestPath, manifest, { trailingNewline: true });
		return async () => {
			await fs$1.writeFile(manifestPath, originalManifest);
		};
	}
	return () => Promise.resolve();
}
async function hideProjectNpmConfigForInstall(targetDir) {
	const originalPath = path.join(targetDir, STAGED_NPM_PROJECT_CONFIG_NAME);
	let hiddenDir = "";
	try {
		hiddenDir = await fs$1.mkdtemp(path.join(targetDir, STAGED_NPM_PROJECT_CONFIG_PREFIX));
		const hiddenPath = path.join(hiddenDir, STAGED_NPM_PROJECT_CONFIG_NAME);
		await fs$1.rename(originalPath, hiddenPath);
		return {
			hiddenDir,
			originalPath,
			hiddenPath
		};
	} catch (error) {
		if (hiddenDir) await fs$1.rm(hiddenDir, {
			recursive: true,
			force: true
		}).catch(() => void 0);
		if (hasErrnoCode(error, "ENOENT")) return null;
		throw error;
	}
}
async function restoreProjectNpmConfigAfterInstall(hiddenConfig) {
	if (!hiddenConfig) return;
	await fs$1.rename(hiddenConfig.hiddenPath, hiddenConfig.originalPath);
	await fs$1.rm(hiddenConfig.hiddenDir, {
		recursive: true,
		force: true
	});
}
async function assertInstallBoundaryPaths(params) {
	for (const candidatePath of params.candidatePaths) await assertCanonicalPathWithinBase({
		baseDir: params.installBaseDir,
		candidatePath,
		boundaryLabel: "install directory"
	});
}
function isRelativePathInsideBase(relativePath) {
	return Boolean(relativePath) && relativePath !== ".." && !relativePath.startsWith(`..${path.sep}`);
}
function isInstallBaseChangedError(error) {
	return error instanceof Error && error.message === INSTALL_BASE_CHANGED_ERROR_MESSAGE;
}
function resolveMoveSourceHardlinks(policy) {
	return policy === "package-manager" ? "allow" : "reject";
}
async function assertInstallBaseStable(params) {
	if (!(await fs$1.stat(params.installBaseDir)).isDirectory()) throw new Error(INSTALL_BASE_CHANGED_ERROR_MESSAGE);
	if (await fs$1.realpath(params.installBaseDir) !== params.expectedRealPath) throw new Error(INSTALL_BASE_CHANGED_ERROR_MESSAGE);
}
async function cleanupInstallTempDir(dirPath) {
	if (!dirPath) return;
	await fs$1.rm(dirPath, {
		recursive: true,
		force: true
	}).catch(() => void 0);
}
async function resolveInstallPublishTarget(params) {
	const installBaseResolved = path.resolve(params.installBaseDir);
	const targetResolved = path.resolve(params.targetDir);
	const targetRelativePath = path.relative(installBaseResolved, targetResolved);
	if (!isRelativePathInsideBase(targetRelativePath)) throw new Error("invalid install target path");
	const installBaseRealPath = await fs$1.realpath(params.installBaseDir);
	return {
		installBaseRealPath,
		canonicalTargetDir: path.join(installBaseRealPath, targetRelativePath)
	};
}
const PACKAGE_DIR_INSTALL_TRANSACTION = Symbol.for("openclaw.packageDirInstallTransaction");
const PACKAGE_DIR_INSTALL_TRANSACTION_REQUEST = Symbol.for("openclaw.packageDirInstallTransactionRequest");
function requestDeferredPackageDirInstall(params, assertOwned) {
	Object.defineProperty(params, PACKAGE_DIR_INSTALL_TRANSACTION_REQUEST, {
		configurable: false,
		enumerable: true,
		value: { assertOwned }
	});
	return params;
}
function copyPackageDirInstallTransactionRequest(source, target) {
	const request = resolvePackageDirInstallTransactionRequest(source);
	return request ? requestDeferredPackageDirInstall(target, request.assertOwned) : target;
}
function resolvePackageDirInstallTransactionRequest(params) {
	return params[PACKAGE_DIR_INSTALL_TRANSACTION_REQUEST];
}
function attachPackageDirInstallTransaction(result, transaction) {
	Object.defineProperty(result, PACKAGE_DIR_INSTALL_TRANSACTION, {
		configurable: false,
		enumerable: true,
		value: transaction
	});
	return result;
}
function resolvePackageDirInstallTransaction(result) {
	return result[PACKAGE_DIR_INSTALL_TRANSACTION];
}
/**
* Publishes a copied package or a privately prepared package directory into its install target.
* Update mode backs up the existing target, runs optional validation hooks,
* and rolls back when copy, dependency install, or validation fails.
*/
async function installPackageDir(params) {
	const transactionRequest = resolvePackageDirInstallTransactionRequest(params);
	const deferCommit = transactionRequest !== void 0;
	const assertOwned = transactionRequest?.assertOwned;
	params.logger?.info?.(`Installing to ${params.targetDir}…`);
	const installBaseDir = path.dirname(params.targetDir);
	let initialInstallBaseRealPath;
	try {
		await fs$1.mkdir(installBaseDir, { recursive: true });
		initialInstallBaseRealPath = await fs$1.realpath(installBaseDir);
		await assertInstallBoundaryPaths({
			installBaseDir,
			candidatePaths: [params.targetDir]
		});
	} catch (err) {
		return {
			ok: false,
			error: `${params.copyErrorPrefix}: ${String(err)}`
		};
	}
	let installBaseRealPath;
	let canonicalTargetDir;
	try {
		({installBaseRealPath, canonicalTargetDir} = await resolveInstallPublishTarget({
			installBaseDir,
			targetDir: params.targetDir
		}));
		if (installBaseRealPath !== initialInstallBaseRealPath) throw new Error(INSTALL_BASE_CHANGED_ERROR_MESSAGE);
	} catch (err) {
		if (isInstallBaseChangedError(err)) params.logger?.warn?.(INSTALL_BASE_CHANGED_ABORT_WARNING);
		return {
			ok: false,
			error: `${params.copyErrorPrefix}: ${String(err)}`
		};
	}
	const baseIdentity = await readDirectoryIdentity(installBaseRealPath);
	const assertDirectoryIdentity = (directory, identity) => {
		try {
			assertDirectoryIdentitySync(directory, {
				dev: identity.dev,
				ino: identity.ino
			});
		} catch (error) {
			if (error instanceof FsSafeError && error.category === "policy") throw new Error(`install directory changed: ${directory}`, { cause: error });
			throw error;
		}
	};
	const assertRollbackOwned = () => {
		assertDirectoryIdentity(installBaseRealPath, baseIdentity);
		assertOwned?.();
	};
	const assertPersistentApply = () => {
		params.beforePersistentApply?.();
		assertRollbackOwned();
	};
	let stageDir = null;
	const published = {
		backup: null,
		install: null,
		restore: null
	};
	const sourceHardlinks = resolveMoveSourceHardlinks(params.sourceHardlinks ?? DEFAULT_INSTALL_SOURCE_HARDLINKS);
	let quarantine;
	const rollback = async () => {
		const installedIdentity = published.install;
		if (installedIdentity) {
			assertRollbackOwned();
			if (published.backup && !published.restore) assertDirectoryIdentity(published.backup.path, published.backup);
			if (!quarantine) {
				const directory = await fs$1.mkdtemp(path.join(installBaseRealPath, ".openclaw-install-rollback-"));
				const identity = await readDirectoryIdentity(directory);
				try {
					assertDirectoryIdentity(directory, identity);
					assertDirectoryIdentity(canonicalTargetDir, installedIdentity);
					assertRollbackOwned();
					fs.renameSync(canonicalTargetDir, path.join(directory, "package"));
					quarantine = {
						directory,
						identity
					};
				} catch (error) {
					await fs$1.rmdir(directory).catch(() => void 0);
					throw error;
				}
			}
			assertDirectoryIdentity(quarantine.directory, quarantine.identity);
			const discardedPackage = path.join(quarantine.directory, "package");
			if (fs.lstatSync(discardedPackage, {
				bigint: true,
				throwIfNoEntry: false
			})) assertDirectoryIdentity(discardedPackage, installedIdentity);
			await fs$1.rm(discardedPackage, {
				recursive: true,
				force: true
			});
		}
		await restoreBackup();
		if (quarantine) await fs$1.rmdir(quarantine.directory);
		published.install = null;
	};
	const fail = async (error, cause) => {
		const installBaseChanged = isInstallBaseChangedError(cause);
		let restoreError;
		if (installBaseChanged) params.logger?.warn?.(INSTALL_BASE_CHANGED_ABORT_WARNING);
		else {
			try {
				await rollback();
			} catch (restoreFailure) {
				restoreError = String(restoreFailure);
			}
			if (stageDir) {
				await cleanupInstallTempDir(stageDir);
				stageDir = null;
			}
		}
		return {
			ok: false,
			error: [error, ...[
				restoreError && `could not restore existing install: ${restoreError}`,
				published.install && `install was published at ${published.install.path}; recovery incomplete`,
				published.backup && `backup recovery path: ${published.backup.path}`
			].filter(Boolean)].join("; ")
		};
	};
	const restoreBackup = async () => {
		if (!published.backup) return;
		const restoring = published.backup;
		try {
			if (published.restore) {
				assertDirectoryIdentity(canonicalTargetDir, published.restore);
				assertRollbackOwned();
				try {
					assertDirectoryIdentity(restoring.path, restoring);
					await fs$1.rm(restoring.path, {
						recursive: true,
						force: true
					});
				} catch (error) {
					if (!hasErrnoCode(error, "ENOENT")) throw error;
				}
			} else await movePathWithCopyFallback({
				assertBeforeRename: () => {
					assertDirectoryIdentity(restoring.path, restoring);
					if (fs.lstatSync(canonicalTargetDir, { throwIfNoEntry: false })) throw new Error(`install target changed during rollback: ${canonicalTargetDir}`);
				},
				assertBeforeMutation: () => {
					assertDirectoryIdentity(restoring.path, restoring);
					assertRollbackOwned();
				},
				onDestinationPublished: (receipt) => {
					published.restore = receipt;
				},
				from: restoring.path,
				sourceHardlinks,
				to: canonicalTargetDir
			});
			published.backup = null;
		} catch (error) {
			const recovery = published.restore ? `original install published at ${published.restore.path}; cleanup incomplete at ${restoring.path}` : `backup retained at ${restoring.path}`;
			throw new Error(`${String(error)}; ${recovery}`, { cause: error });
		}
	};
	try {
		await assertInstallBoundaryPaths({
			installBaseDir: installBaseRealPath,
			candidatePaths: [canonicalTargetDir]
		});
		stageDir = await fs$1.mkdtemp(path.join(installBaseRealPath, ".openclaw-install-stage-"));
		if (params.sourceDir !== void 0) await withInstallActivity(params.logger, "files", () => fs$1.cp(params.sourceDir, stageDir, {
			recursive: true,
			verbatimSymlinks: true
		}));
	} catch (err) {
		return await fail(`${params.copyErrorPrefix}: ${String(err)}`, err);
	}
	try {
		await params.afterCopy?.(stageDir);
	} catch (err) {
		return await fail(`post-copy validation failed: ${String(err)}`, err);
	}
	if (params.hasDeps) {
		const dependencyDir = stageDir;
		try {
			const restoreManifest = await sanitizeManifestForNpmInstall(stageDir, params.omitOpenClawHostDependency === true);
			let npmFailure;
			try {
				const hiddenProjectNpmConfig = await hideProjectNpmConfigForInstall(stageDir);
				params.logger?.info?.(params.depsLogMessage);
				const npmRes = await withInstallActivity(params.logger, "dependencies", async () => {
					try {
						return await runCommandWithTimeout(["npm", ...createSafeNpmInstallArgs({
							omitDev: true,
							loglevel: "error",
							ignoreWorkspaces: true
						})], {
							timeoutMs: resolveInstallWorkTimeoutMs(params.workTimeoutMs, Math.max(params.timeoutMs, 3e5)),
							cwd: dependencyDir,
							env: createSafeNpmInstallEnv(process.env, {
								npmConfigCwd: dependencyDir,
								ignoreWorkspaces: true
							})
						});
					} finally {
						await restoreProjectNpmConfigAfterInstall(hiddenProjectNpmConfig);
					}
				}, (result) => result.code === 0);
				if (npmRes.code !== 0) npmFailure = `npm install failed: ${formatNpmCommandFailureOutput(npmRes)}`;
			} finally {
				await restoreManifest();
			}
			if (npmFailure) return await fail(npmFailure);
		} catch (error) {
			return await fail(`npm install failed: ${String(error)}`, error);
		}
	}
	if (params.afterInstall) try {
		const postInstallResult = await params.afterInstall(stageDir);
		if (!postInstallResult.ok) {
			const failed = await fail(postInstallResult.error);
			return {
				...postInstallResult,
				error: failed.error
			};
		}
	} catch (err) {
		return await fail(`post-install validation failed: ${String(err)}`, err);
	}
	if (params.mode === "update" && await pathExists(canonicalTargetDir)) {
		const backupRoot = path.join(installBaseRealPath, ".openclaw-install-backups");
		const backupPath = path.join(backupRoot, `${path.basename(canonicalTargetDir)}-${randomUUID()}`);
		try {
			await fs$1.mkdir(backupRoot, { recursive: true });
			await assertInstallBoundaryPaths({
				installBaseDir: installBaseRealPath,
				candidatePaths: [backupPath]
			});
			await assertInstallBaseStable({
				installBaseDir,
				expectedRealPath: installBaseRealPath
			});
			await movePathWithCopyFallback({
				assertBeforeMutation: assertPersistentApply,
				onDestinationPublished: (receipt) => {
					published.backup = receipt;
				},
				from: canonicalTargetDir,
				sourceHardlinks,
				to: backupPath
			});
		} catch (err) {
			return await fail(`${params.copyErrorPrefix}: ${String(err)}`, err);
		}
	}
	if (published.backup && params.afterBackup) try {
		const backupResult = await params.afterBackup(published.backup.path);
		if (!backupResult.ok) {
			const failed = await fail(backupResult.error);
			return {
				...backupResult,
				error: failed.error
			};
		}
	} catch (err) {
		return await fail(`backup validation failed: ${String(err)}`, err);
	}
	try {
		await assertInstallBaseStable({
			installBaseDir,
			expectedRealPath: installBaseRealPath
		});
		await movePathWithCopyFallback({
			assertBeforeMutation: assertPersistentApply,
			onDestinationPublished: (receipt) => {
				published.install = receipt;
			},
			from: stageDir,
			sourceHardlinks,
			to: canonicalTargetDir
		});
		stageDir = null;
	} catch (err) {
		return await fail(`${params.copyErrorPrefix}: ${String(err)}`, err);
	}
	if (published.backup) try {
		await assertInstallBaseStable({
			installBaseDir,
			expectedRealPath: installBaseRealPath
		});
	} catch (err) {
		if (isInstallBaseChangedError(err)) params.logger?.warn?.(INSTALL_BASE_CHANGED_BACKUP_WARNING);
		published.backup = null;
	}
	if (published.backup && !deferCommit) {
		assertDirectoryIdentity(published.backup.path, published.backup);
		await fs$1.rm(published.backup.path, {
			recursive: true,
			force: true
		}).catch(() => void 0);
	}
	if (stageDir) await cleanupInstallTempDir(stageDir);
	if (!deferCommit) return { ok: true };
	let settlement;
	const settle = (apply) => {
		settlement ??= Promise.resolve().then(apply).catch((error) => {
			settlement = void 0;
			throw error;
		});
		return settlement;
	};
	return attachPackageDirInstallTransaction({ ok: true }, {
		commit: () => settle(async () => {
			if (quarantine) throw new Error("cannot commit an install after rollback has started");
			assertOwned?.();
			if (published.backup) {
				assertDirectoryIdentity(published.backup.path, published.backup);
				await fs$1.rm(published.backup.path, {
					recursive: true,
					force: true
				}).catch(() => void 0);
			}
		}),
		rollback: () => settle(rollback)
	});
}
//#endregion
export { resolvePackageDirInstallTransaction as a, withInstallActivity as c, requestDeferredPackageDirInstall as i, hasPackageRuntimeDependencies as n, createSafeNpmInstallArgs as o, installPackageDir as r, createSafeNpmInstallEnv as s, copyPackageDirInstallTransactionRequest as t };
