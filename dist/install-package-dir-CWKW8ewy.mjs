import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { d as writeJson, l as tryReadJson } from "./json-files-DYmSFHoN.mjs";
import { d as pathExists$1, t as FsSafeError } from "./fs-safe-6Z4UiMS4.mjs";
import { t as assertCanonicalPathWithinBase } from "./install-safe-path-CvmSx2MJ.mjs";
import { i as runCommandWithTimeout } from "./exec-Bf6uhUA7.mjs";
import { n as resolveInstallWorkTimeoutMs } from "./install-mode-options-C9VDc932.mjs";
import { a as findExplicitNpmConfigKeys, i as createNpmProjectInstallEnv, s as resolveNpmCommand } from "./npm-install-env-B76s0YXJ.mjs";
import { n as formatNpmCommandFailureOutput } from "./install-source-utils-DCME3COX.mjs";
import { t as retainMutationAuthority } from "./mutation-authority-E8BC9dNY.mjs";
import { n as isRemovalIoError, r as removePathWithinRoot } from "./fs-safe-remove-DYWyr3qX.mjs";
import fs from "node:fs";
import { randomUUID } from "node:crypto";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { assertDirectoryIdentitySync, readDirectoryIdentity } from "@openclaw/fs-safe/advanced";
import { movePathWithCopyFallback } from "@openclaw/fs-safe/atomic";
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
	const sourcePolicies = findExplicitNpmConfigKeys(nextEnv, ["allow-git", "allow-remote"], options);
	if (!sourcePolicies.has("allow-git")) nextEnv.npm_config_allow_git = "all";
	if (!sourcePolicies.has("allow-remote")) nextEnv.npm_config_allow_remote = "all";
	return nextEnv;
}
function createSafeNpmInstallArgs(options = {}) {
	return [
		"install",
		"--omit=dev",
		...options.omitPeer ? ["--omit=peer"] : [],
		...options.legacyPeerDeps ? ["--legacy-peer-deps"] : [],
		"--loglevel=error",
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
function isRelativePathInsideBase(relativePath) {
	return Boolean(relativePath) && relativePath !== ".." && !relativePath.startsWith(`..${path.sep}`);
}
function isInstallBaseChangedError(error) {
	return error instanceof Error && error.message === INSTALL_BASE_CHANGED_ERROR_MESSAGE;
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
	const assertOwned = retainMutationAuthority(transactionRequest?.assertOwned ?? (() => {}));
	const assertSettlementOwned = retainMutationAuthority((assertCurrent) => {
		assertOwned();
		assertCurrent?.();
	});
	params.logger?.info?.(`Installing to ${params.targetDir}…`);
	const installBaseDir = path.dirname(params.targetDir);
	let initialInstallBaseRealPath;
	try {
		await fs$1.mkdir(installBaseDir, { recursive: true });
		initialInstallBaseRealPath = await fs$1.realpath(installBaseDir);
		await assertCanonicalPathWithinBase({
			baseDir: installBaseDir,
			candidatePath: params.targetDir,
			boundaryLabel: "install directory"
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
	const assertRollbackOwned = (assertCurrent = assertOwned) => {
		assertCurrent();
		assertDirectoryIdentity(installBaseRealPath, baseIdentity);
	};
	const assertPersistentApply = retainMutationAuthority(() => {
		assertRollbackOwned();
		return params.beforePersistentApply?.();
	});
	const removeInstallTree = async (removal) => {
		const assertCurrent = retainMutationAuthority(() => {
			removal.assertOwner();
			assertDirectoryIdentity(installBaseRealPath, baseIdentity);
			if (fs.lstatSync(removal.directory, { throwIfNoEntry: false })) assertDirectoryIdentity(removal.directory, removal.identity);
		});
		try {
			await removePathWithinRoot({
				rootDir: installBaseRealPath,
				relativePath: path.relative(installBaseRealPath, removal.directory),
				recursive: removal.recursive !== false,
				force: true,
				symlinks: "unlink",
				assertBeforeMutation: assertCurrent
			});
		} catch (error) {
			assertCurrent();
			if (!removal.bestEffort || !isRemovalIoError(error)) throw error;
		}
	};
	let stageDir = null;
	const published = {
		backup: null,
		install: null,
		restore: null
	};
	const sourceHardlinks = (params.sourceHardlinks ?? DEFAULT_INSTALL_SOURCE_HARDLINKS) === "package-manager" ? "allow" : "reject";
	let quarantine;
	const rollback = async (assertCurrent = assertOwned) => {
		const installedIdentity = published.install;
		if (installedIdentity) {
			assertRollbackOwned(assertCurrent);
			if (published.backup && !published.restore) assertDirectoryIdentity(published.backup.path, published.backup);
			if (!quarantine) {
				const directory = await fs$1.mkdtemp(path.join(installBaseRealPath, ".openclaw-install-rollback-"));
				const identity = await readDirectoryIdentity(directory);
				try {
					assertDirectoryIdentity(directory, identity);
					assertDirectoryIdentity(canonicalTargetDir, installedIdentity);
					assertRollbackOwned(assertCurrent);
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
			const detached = quarantine;
			await removeInstallTree({
				directory: path.join(detached.directory, "package"),
				identity: installedIdentity,
				assertOwner: () => assertDirectoryIdentity(detached.directory, detached.identity)
			});
		}
		await restoreBackup(assertCurrent);
		if (quarantine) await removeInstallTree({
			directory: quarantine.directory,
			identity: quarantine.identity,
			assertOwner: () => {},
			recursive: false
		});
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
		const recovery = [
			restoreError && `could not restore existing install: ${restoreError}`,
			published.install && `install was published at ${published.install.path}; recovery incomplete`,
			published.backup && `backup recovery path: ${published.backup.path}`
		].filter(Boolean);
		const recoveryIncomplete = Boolean(restoreError || published.install || published.backup);
		return {
			ok: false,
			error: [error, ...recovery].join("; "),
			...recoveryIncomplete ? { recoveryIncomplete: true } : {}
		};
	};
	const restoreBackup = async (assertCurrent = assertOwned) => {
		if (!published.backup) return;
		const restoring = published.backup;
		try {
			if (published.restore) {
				const restored = published.restore;
				await removeInstallTree({
					directory: restoring.path,
					identity: restoring,
					assertOwner: () => {
						assertDirectoryIdentity(canonicalTargetDir, restored);
						assertRollbackOwned(assertCurrent);
					}
				});
			} else await movePathWithCopyFallback({
				assertBeforeRename: () => {
					assertDirectoryIdentity(restoring.path, restoring);
					if (fs.lstatSync(canonicalTargetDir, { throwIfNoEntry: false })) throw new Error(`install target changed during rollback: ${canonicalTargetDir}`);
				},
				assertBeforeMutation: () => {
					assertDirectoryIdentity(restoring.path, restoring);
					assertRollbackOwned(assertCurrent);
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
		await assertCanonicalPathWithinBase({
			baseDir: installBaseRealPath,
			candidatePath: canonicalTargetDir,
			boundaryLabel: "install directory"
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
						return await runCommandWithTimeout(resolveNpmCommand(createSafeNpmInstallArgs({ ignoreWorkspaces: true })), {
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
				...failed
			};
		}
	} catch (err) {
		return await fail(`post-install validation failed: ${String(err)}`, err);
	}
	const hasUpdateTarget = params.mode === "update" && await pathExists$1(canonicalTargetDir);
	if (params.requireExistingTarget && !hasUpdateTarget) return await fail(`${params.copyErrorPrefix}: required update target disappeared`);
	if (hasUpdateTarget) {
		const backupRoot = path.join(installBaseRealPath, ".openclaw-install-backups");
		const backupPath = path.join(backupRoot, `${path.basename(canonicalTargetDir)}-${randomUUID()}`);
		try {
			await fs$1.mkdir(backupRoot, { recursive: true });
			await assertCanonicalPathWithinBase({
				baseDir: installBaseRealPath,
				candidatePath: backupPath,
				boundaryLabel: "install directory"
			});
			await assertInstallBaseStable({
				installBaseDir,
				expectedRealPath: installBaseRealPath
			});
			if (params.authorizeMutation) await params.authorizeMutation();
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
				...failed
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
		if (params.authorizeMutation) await params.authorizeMutation();
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
		if (deferCommit) return await fail(`${params.copyErrorPrefix}: ${String(err)}`, err);
		published.backup = null;
	}
	if (published.backup && !deferCommit) await removeInstallTree({
		directory: published.backup.path,
		identity: published.backup,
		assertOwner: assertPersistentApply,
		bestEffort: true
	});
	if (!deferCommit) return { ok: true };
	let settlement;
	const settle = (apply, settlementAssertCurrent) => {
		settlement ??= Promise.resolve().then(() => {
			const assertCurrent = () => assertSettlementOwned(settlementAssertCurrent);
			assertCurrent();
			return apply(assertCurrent);
		}).catch((error) => {
			settlement = void 0;
			throw error;
		});
		return settlement;
	};
	return attachPackageDirInstallTransaction({ ok: true }, {
		commit: (assertCurrent) => settle(async (assertOwner) => {
			if (quarantine) throw new Error("cannot commit an install after rollback has started");
			assertOwner();
			if (published.backup) await removeInstallTree({
				directory: published.backup.path,
				identity: published.backup,
				assertOwner: () => assertRollbackOwned(assertOwner),
				bestEffort: true
			});
		}, assertCurrent),
		rollback: (assertCurrent) => settle(rollback, assertCurrent)
	});
}
//#endregion
export { resolvePackageDirInstallTransaction as a, withInstallActivity as c, requestDeferredPackageDirInstall as i, hasPackageRuntimeDependencies as n, createSafeNpmInstallArgs as o, installPackageDir as r, createSafeNpmInstallEnv as s, copyPackageDirInstallTransactionRequest as t };
