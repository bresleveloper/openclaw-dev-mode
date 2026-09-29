import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { n as compareValidSemver } from "./semver-aYpwYdrQ.mjs";
import { r as sha256HexPrefixCore } from "./node-crypto-Df3MIs6V.mjs";
import "./crypto-digest-D9Nqq3c7.mjs";
import { a as isPrereleaseSemverVersion, i as isPrereleaseResolutionAllowed, l as validateRegistryNpmSpec, n as formatPrereleaseResolutionError, o as parseRegistryNpmSpec, t as compareOpenClawReleaseVersions } from "./npm-registry-spec-CjcsDXUg.mjs";
import { n as packageNameMatchesId } from "./install-safe-path-Nbwl6YSJ.mjs";
import { h as validatePluginId, i as matchesExpectedPluginId, m as safePluginInstallFileName, s as resolveDefaultPluginNpmDir, t as encodePluginInstallDirName } from "./install-paths-DnOgVB7K.mjs";
import { i as validatePackageExtensionEntriesForInstall } from "./package-entry-resolution-D32N9wpN.mjs";
import { a as linkOpenClawPeerDependencies, c as resolveOpenClawHostDependency, s as relinkOpenClawPeerDependenciesInManagedNpmRoot, t as auditDeclaredOpenClawHostDependency } from "./plugin-peer-link-C9fwm_tB.mjs";
import { i as normalizePluginDependencySpecs, r as findMissingRequiredPluginDependencies } from "./status-dependencies-core-CNMnZyKQ.mjs";
import { t as PLUGIN_INSTALL_ERROR_CODE } from "./install-types-auyGAGw8.mjs";
import { n as isOfficialCatalogLookupPluginIdReplacement } from "./official-external-install-records-CwKXyAFm.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { n as formatNpmCommandFailureOutput, o as resolveNpmPackArchiveMetadata, r as loadNpmPackageVersions, s as resolveNpmSpecMetadata, t as buildNpmResolutionFields, u as resolveInstallWorkTimeoutMs } from "./install-source-utils-CeCvRCDR.mjs";
import { a as resolvePackageDirInstallTransaction, c as withInstallActivity, i as requestDeferredPackageDirInstall, n as hasPackageRuntimeDependencies, o as createSafeNpmInstallArgs, r as installPackageDir, s as createSafeNpmInstallEnv } from "./install-package-dir-DZA6fMda.mjs";
import { A as sourceFamilyForInstallPolicySource, C as formatUnresolvedOpenClawPeerLinkError, D as resolvePreparedDirectoryInstallTarget, E as readOptionalPackageManifest, I as attachPluginInstallTransaction, L as copyPluginInstallTransactionRequest, O as runInstallSourceScan, S as ensureOpenClawExtensions, T as loadPluginInstallRuntime, V as resolvePluginInstallTransactionRequest, _ as resolveRequiredPlatformPackageNames, a as resolveManagedNpmRootDependencySpec, b as emitSuccessfulPluginInstallSecurityEvent, c as copyManagedNpmProjectInputs, d as isNpmAliasOverrideCompatibilityError, f as listManagedNpmRootPackageNames, g as resolveManagedNpmRootPackageDir, h as resolveManagedNpmRootDependencySpecForInstall, i as repairManagedNpmRootOpenClawPeer, j as validateOpenClawPackageInstallCompatibility, k as sourceFamilyForInstallPolicyKind, l as formatManagedNpmProjectQuarantineArtifacts, m as resolveManagedNpmInstallPlan, n as readManagedNpmRootInstalledDependency, o as syncManagedNpmRootPeerDependencies, p as quarantineManagedNpmProjectRebuildArtifacts, r as readOpenClawManagedNpmRootOverrides, s as upsertManagedNpmRootDependency, t as listMissingRequiredPlatformPackages, u as isManagedNpmProjectCorruptionInstallFailure, v as buildDirectoryInstallResult, w as installPluginDirectoryIntoExtensions, x as ensureInstallTargetAvailableForMode, y as defaultLogger } from "./npm-managed-root-BdsMGiX0.mjs";
import { t as resolveNpmIntegrityDriftWithDefaultMessage } from "./npm-integrity-xhKlGdxZ.mjs";
import { r as preflightPluginNpmInstallPolicy } from "./install-security-scan-jk08Rpmf.mjs";
import { n as inspectBundlePluginArtifact, r as inspectNativePluginArtifact } from "./install-artifact-inspection-X2JhMF_r.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
//#region src/plugins/install-installed-package.ts
async function validatePackagePluginInstallSource(params) {
	const manifestResult = params.manifest ? {
		ok: true,
		manifest: params.manifest
	} : await readOptionalPackageManifest({
		runtime: params.runtime,
		packageDir: params.packageDir
	});
	if (!manifestResult.ok) return manifestResult;
	const manifest = manifestResult.manifest;
	if (!manifest) return {
		ok: false,
		error: "extracted package missing package.json"
	};
	const pkgName = normalizeOptionalString(manifest.name) ?? "";
	const npmPluginId = pkgName || "plugin";
	const ocManifestResult = params.runtime.loadPluginManifest(params.packageDir);
	if (!ocManifestResult.ok && params.requirePluginManifest) return {
		ok: false,
		error: `package missing valid openclaw.plugin.json: ${ocManifestResult.error}`,
		code: PLUGIN_INSTALL_ERROR_CODE.MISSING_PLUGIN_MANIFEST
	};
	const manifestPluginId = ocManifestResult.ok && ocManifestResult.manifest.id ? ocManifestResult.manifest.id.trim() : void 0;
	const pluginId = manifestPluginId ?? npmPluginId;
	const pluginIdError = validatePluginId(pluginId);
	if (pluginIdError) return {
		ok: false,
		error: pluginIdError
	};
	if (!matchesExpectedPluginId({
		expectedPluginId: params.expectedPluginId,
		pluginId,
		manifestPluginId,
		npmPluginId
	})) return {
		ok: false,
		error: `plugin id mismatch: expected ${params.expectedPluginId}, got ${pluginId}`,
		code: PLUGIN_INSTALL_ERROR_CODE.PLUGIN_ID_MISMATCH
	};
	if (manifestPluginId && !packageNameMatchesId(npmPluginId, manifestPluginId)) params.logger.info?.(`Plugin manifest id "${manifestPluginId}" differs from npm package name "${npmPluginId}"; using manifest id as the config key.`);
	const packageMetadata = params.runtime.getPackageManifestMetadata(manifest);
	const compatibilityError = validateOpenClawPackageInstallCompatibility({
		runtime: params.runtime,
		pluginId,
		packageMetadata
	});
	if (compatibilityError) return compatibilityError;
	const extensionsResult = ensureOpenClawExtensions({ manifest });
	if (!extensionsResult.ok) return {
		ok: false,
		error: extensionsResult.error,
		code: extensionsResult.code
	};
	const extensions = extensionsResult.entries;
	const extensionValidation = await validatePackageExtensionEntriesForInstall({
		packageDir: params.packageDir,
		extensions,
		manifest,
		allowSourceTypeScriptEntries: params.allowSourceTypeScriptEntries
	});
	if (!extensionValidation.ok) return {
		ok: false,
		error: extensionValidation.error,
		code: PLUGIN_INSTALL_ERROR_CODE.INVALID_OPENCLAW_EXTENSIONS
	};
	const scanMode = params.resolveEffectiveMode ? await params.resolveEffectiveMode(pluginId) : params.mode;
	const scanResult = await runInstallSourceScan({
		subject: `Plugin "${pluginId}"`,
		pluginId,
		mode: scanMode,
		sourceFamily: sourceFamilyForInstallPolicySource(params.installPolicyRequest?.source, sourceFamilyForInstallPolicyKind(params.installPolicyRequest?.kind, "installed-package")),
		scan: async () => await params.runtime.scanPackageInstallSource({
			onInstallPolicyWarning: params.onInstallPolicyWarning,
			trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
			packageDir: params.packageDir,
			config: params.config,
			pluginId,
			logger: params.logger,
			extensions,
			requestKind: params.installPolicyRequest?.kind,
			requestedSpecifier: params.installPolicyRequest?.requestedSpecifier,
			source: params.installPolicyRequest?.source,
			mode: scanMode,
			packageName: pkgName || void 0,
			manifestId: manifestPluginId,
			version: typeof manifest.version === "string" ? manifest.version : void 0
		})
	});
	if (scanResult) return scanResult;
	const hostDependency = resolveOpenClawHostDependency(manifest);
	return {
		ok: true,
		plugin: {
			manifest,
			pluginId,
			manifestName: pkgName || void 0,
			version: typeof manifest.version === "string" ? manifest.version : void 0,
			extensions,
			...ocManifestResult.ok && ocManifestResult.manifest.setup ? { setup: ocManifestResult.manifest.setup } : {},
			hasRuntimeDependencies: hasPackageRuntimeDependencies(manifest),
			peerDependencies: hostDependency ? { openclaw: hostDependency.spec } : {}
		}
	};
}
async function scanAndLinkInstalledPackage(params) {
	const scanResult = await runInstallSourceScan({
		subject: `Plugin "${params.pluginId}"`,
		pluginId: params.pluginId,
		mode: params.mode,
		sourceFamily: sourceFamilyForInstallPolicySource(params.source, sourceFamilyForInstallPolicyKind(params.requestKind, "installed-package")),
		scan: async () => await params.runtime.scanInstalledPackageDependencyTree({
			...params.additionalDependencyPackageDirs ? { additionalPackageDirs: params.additionalDependencyPackageDirs } : {},
			allowManagedNpmRootPackagePeerSymlinks: params.dependencyScanRootDir !== void 0 && path.resolve(params.dependencyScanRootDir) !== path.resolve(params.installedDir),
			onInstallPolicyWarning: params.onInstallPolicyWarning,
			dependencyScanRootDir: params.dependencyScanRootDir,
			logger: params.logger,
			mode: params.mode,
			packageDir: params.installedDir,
			pluginId: params.pluginId,
			config: params.config,
			...params.requestKind ? { requestKind: params.requestKind } : {},
			requestedSpecifier: params.requestedSpecifier,
			source: params.source,
			trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall
		})
	});
	if (scanResult) return scanResult;
	if ((await linkOpenClawPeerDependencies({
		installedDir: params.installedDir,
		peerDependencies: params.peerDependencies,
		logger: params.logger
	})).skipped > 0) return {
		ok: false,
		error: formatUnresolvedOpenClawPeerLinkError(params.pluginId)
	};
	return null;
}
async function installPluginFromInstalledPackageDir(params) {
	return await installPluginFromInstalledPackageDirInternal(params);
}
async function installPluginFromInstalledPackageDirInternal(params) {
	const runtime = await loadPluginInstallRuntime();
	const { logger } = runtime.resolveTimedInstallModeOptions(params, defaultLogger);
	const validated = await validatePackagePluginInstallSource({
		runtime,
		packageDir: params.packageDir,
		expectedPluginId: params.expectedPluginId,
		requirePluginManifest: params.requirePluginManifest,
		allowSourceTypeScriptEntries: params.allowSourceTypeScriptEntries,
		onInstallPolicyWarning: params.onInstallPolicyWarning,
		trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
		config: params.config,
		installPolicyRequest: params.installPolicyRequest,
		logger,
		mode: params.mode ?? "install"
	});
	if (!validated.ok) return validated;
	const postInstallError = await scanAndLinkInstalledPackage({
		runtime,
		installedDir: params.packageDir,
		...params.additionalDependencyPackageDirs ? { additionalDependencyPackageDirs: params.additionalDependencyPackageDirs } : {},
		dependencyScanRootDir: params.dependencyScanRootDir,
		pluginId: validated.plugin.pluginId,
		peerDependencies: validated.plugin.peerDependencies,
		onInstallPolicyWarning: params.onInstallPolicyWarning,
		trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
		config: params.config,
		mode: params.mode ?? "install",
		...params.installPolicyRequest?.kind ? { requestKind: params.installPolicyRequest.kind } : {},
		requestedSpecifier: params.installPolicyRequest?.requestedSpecifier,
		source: params.installPolicyRequest?.source,
		logger
	});
	if (postInstallError) return postInstallError;
	const result = buildDirectoryInstallResult({
		pluginId: validated.plugin.pluginId,
		targetDir: params.packageDir,
		manifestName: validated.plugin.manifestName,
		version: validated.plugin.version,
		extensions: validated.plugin.extensions,
		setup: validated.plugin.setup
	});
	if (params.emitSuccessSecurityEvent !== false) emitSuccessfulPluginInstallSecurityEvent(result, {
		dryRun: params.dryRun,
		mode: params.mode ?? "install",
		sourceFamily: sourceFamilyForInstallPolicyKind(params.installPolicyRequest?.kind, "installed-package"),
		trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall
	});
	return result;
}
//#endregion
//#region src/plugins/install-npm-resolution.ts
function verifyInstalledNpmResolution(params) {
	if (!params.installed) return {
		kind: "incomplete",
		error: `npm install did not record package-lock metadata for ${params.packageName}`
	};
	if (params.expected.version && params.installed.version) {
		if (params.installed.version !== params.expected.version) return {
			kind: "conflict",
			error: `npm install resolved ${params.packageName} to version ${params.installed.version}, expected ${params.expected.version}`
		};
	}
	if (params.expected.integrity && params.installed.integrity) {
		if (params.installed.integrity !== params.expected.integrity) return {
			kind: "conflict",
			error: `npm install resolved ${params.packageName} with integrity ${params.installed.integrity}, expected ${params.expected.integrity}`
		};
	}
	if (params.expected.version && !params.installed.version || params.expected.integrity && !params.installed.integrity) return {
		kind: "incomplete",
		error: `npm install recorded incomplete package-lock metadata for ${params.packageName}: ${params.expected.version && !params.installed.version ? "version" : "integrity"} missing`
	};
	return { kind: "ok" };
}
//#endregion
//#region src/plugins/install-managed-npm.ts
async function installPluginFromManagedNpmRoot(params) {
	const runtime = await loadPluginInstallRuntime();
	const { logger, timeoutMs, workTimeoutMs, mode, dryRun } = runtime.resolveTimedInstallModeOptions(params, defaultLogger);
	const expectedPluginId = params.expectedPluginId;
	const npmBaseDir = params.npmDir ? resolveUserPath(params.npmDir) : resolveDefaultPluginNpmDir();
	const { npmRoot: targetNpmRoot, installRoot: targetPackageDir, targetMode, policyMode } = await resolveManagedNpmInstallPlan({
		runtime,
		npmBaseDir,
		packageName: params.packageName,
		requestedMode: mode,
		npmResolution: params.npmResolution
	});
	const availability = await ensureInstallTargetAvailableForMode({
		runtime,
		targetPath: targetPackageDir,
		mode: targetMode
	});
	if (!availability.ok) return availability;
	if (!params.skipPolicyPreflight) {
		const preflightPolicyResult = await runInstallSourceScan({
			subject: `Plugin "${expectedPluginId ?? params.packageName}"`,
			pluginId: expectedPluginId ?? params.packageName,
			mode: policyMode,
			sourceFamily: sourceFamilyForInstallPolicySource(params.installPolicyRequest.source, "npm"),
			scan: async () => await preflightPluginNpmInstallPolicy({
				config: params.config,
				onInstallPolicyWarning: params.onInstallPolicyWarning,
				logger,
				mode: policyMode,
				packageName: params.packageName,
				...expectedPluginId ? { pluginId: expectedPluginId } : {},
				requestedSpecifier: params.installPolicyRequest.requestedSpecifier ?? params.displaySpec,
				source: params.installPolicyRequest.source,
				sourcePath: params.policyPreflightSourcePath ?? targetNpmRoot,
				sourcePathKind: params.policyPreflightSourcePathKind ?? "directory"
			})
		});
		if (preflightPolicyResult) return preflightPolicyResult;
	}
	if (dryRun) return {
		ok: true,
		pluginId: expectedPluginId ?? params.packageName,
		targetDir: targetPackageDir,
		extensions: [],
		npmResolution: params.npmResolution,
		...params.integrityDrift ? { integrityDrift: params.integrityDrift } : {}
	};
	params.signal?.throwIfAborted();
	let recovery;
	const runManagedNpmInstall = async (npmRoot) => {
		const installRoot = resolveManagedNpmRootPackageDir(npmRoot, params.packageName);
		const prepared = await resolveManagedNpmRootDependencySpecForInstall({
			npmRoot,
			packageName: params.packageName,
			dependencySpec: params.dependencySpec,
			prepareDependencySpec: params.prepareDependencySpec
		});
		if (!prepared.ok) return prepared;
		logger.info?.(`Installing ${params.displaySpec} into ${npmRoot}…`);
		if (params.packageName !== "openclaw") {
			if (await repairManagedNpmRootOpenClawPeer({
				npmRoot,
				timeoutMs,
				workTimeoutMs,
				signal: params.signal,
				logger
			})) logger.info?.(`Repaired stale openclaw peer dependency in ${npmRoot}`);
		}
		const managedOverrides = await readOpenClawManagedNpmRootOverrides();
		const quarantineForRecovery = async (cause) => {
			try {
				recovery = {
					cause,
					quarantine: await quarantineManagedNpmProjectRebuildArtifacts({ npmRoot })
				};
			} catch (error) {
				return {
					ok: false,
					error: `${cause.error}, but OpenClaw could not quarantine ${npmRoot} for rebuild: ${String(error)}`
				};
			}
			logger.warn?.(`${cause.error}; quarantined ${formatManagedNpmProjectQuarantineArtifacts(recovery.quarantine.movedArtifactNames)} at ${recovery.quarantine.quarantineDir} and rebuilding once before retrying.`);
			return null;
		};
		let omitNpmAliasOverrides = false;
		const syncManagedPeerDependenciesForInstall = async () => {
			try {
				return {
					ok: true,
					changed: await syncManagedNpmRootPeerDependencies({
						npmRoot,
						managedOverrides,
						omitNpmAliasOverrides,
						timeoutMs,
						workTimeoutMs,
						signal: params.signal
					})
				};
			} catch (error) {
				return {
					ok: false,
					error: `npm peer dependency planning failed: ${error instanceof Error ? error.message : String(error)}`
				};
			}
		};
		await upsertManagedNpmRootDependency({
			npmRoot,
			packageName: params.packageName,
			dependencySpec: prepared.dependencySpec,
			managedOverrides,
			omitNpmAliasOverrides
		});
		const initialPeerSync = await syncManagedPeerDependenciesForInstall();
		if (!initialPeerSync.ok) return {
			ok: false,
			error: initialPeerSync.error
		};
		const npmInstallArgs = ["npm", ...createSafeNpmInstallArgs({
			omitDev: true,
			omitPeer: true,
			loglevel: "error",
			legacyPeerDeps: true,
			noAudit: true,
			noFund: true
		})];
		const npmInstallOptions = {
			cwd: npmRoot,
			timeoutMs: resolveInstallWorkTimeoutMs(workTimeoutMs, Math.max(timeoutMs, 3e5)),
			signal: params.signal,
			killProcessTree: true,
			env: createSafeNpmInstallEnv(process.env, {
				legacyPeerDeps: true,
				npmConfigCwd: npmRoot,
				packageLock: true,
				quiet: true
			})
		};
		let install = await runCommandWithTimeout(npmInstallArgs, npmInstallOptions);
		if (install.code !== 0 && isNpmAliasOverrideCompatibilityError(install)) {
			logger.warn?.("npm rejected managed npm overrides; retrying plugin install without npm-incompatible overrides for this npm version.");
			omitNpmAliasOverrides = true;
			await upsertManagedNpmRootDependency({
				npmRoot,
				packageName: params.packageName,
				dependencySpec: prepared.dependencySpec,
				managedOverrides,
				omitNpmAliasOverrides
			});
			const aliasRetryPeerSync = await syncManagedPeerDependenciesForInstall();
			if (!aliasRetryPeerSync.ok) return {
				ok: false,
				error: aliasRetryPeerSync.error
			};
			install = await runCommandWithTimeout(npmInstallArgs, npmInstallOptions);
		}
		if (!recovery && install.code !== 0 && isManagedNpmProjectCorruptionInstallFailure(install)) {
			const recoveryFailure = await quarantineForRecovery({
				kind: "npm-corruption",
				error: `npm install failed with a managed npm project corruption signature. Original npm error: ${formatNpmCommandFailureOutput(install)}`
			});
			if (recoveryFailure) return recoveryFailure;
			return await runManagedNpmInstall(npmRoot);
		}
		if (install.code !== 0) return {
			ok: false,
			error: recovery ? `npm install failed after managed npm project recovery (quarantine: ${recovery.quarantine.quarantineDir}): ${formatNpmCommandFailureOutput(install)}. Original ${recovery.cause.kind === "npm-corruption" ? "npm" : "verification"} error: ${recovery.cause.error}` : `npm install failed: ${formatNpmCommandFailureOutput(install)}`
		};
		let settledManagedPeerDependencies = false;
		for (let peerSyncPass = 0; peerSyncPass < 10; peerSyncPass += 1) {
			const peerSync = await syncManagedPeerDependenciesForInstall();
			if (!peerSync.ok) return {
				ok: false,
				error: peerSync.error
			};
			if (!peerSync.changed) {
				settledManagedPeerDependencies = true;
				break;
			}
			install = await runCommandWithTimeout(npmInstallArgs, npmInstallOptions);
			if (install.code !== 0) return {
				ok: false,
				error: `npm install failed after syncing managed peer dependencies: ${formatNpmCommandFailureOutput(install)}`
			};
		}
		if (!settledManagedPeerDependencies) {
			const peerSync = await syncManagedPeerDependenciesForInstall();
			if (!peerSync.ok) return {
				ok: false,
				error: peerSync.error
			};
			settledManagedPeerDependencies = !peerSync.changed;
		}
		if (!settledManagedPeerDependencies) return {
			ok: false,
			error: "npm install could not settle managed peer dependencies after 10 sync passes; refusing to leave a partially reconciled plugin dependency tree."
		};
		const packageManifestResult = await readOptionalPackageManifest({
			runtime,
			packageDir: installRoot
		});
		if (!packageManifestResult.ok) return packageManifestResult;
		const requiredPlatformPackageNames = resolveRequiredPlatformPackageNames(packageManifestResult.manifest ? runtime.getPackageManifestMetadata(packageManifestResult.manifest) : void 0);
		if (!requiredPlatformPackageNames.ok) return {
			ok: false,
			error: requiredPlatformPackageNames.error
		};
		let incompletePlatformPackages;
		try {
			incompletePlatformPackages = await listMissingRequiredPlatformPackages({
				npmRoot,
				requiredPackageNames: requiredPlatformPackageNames.packageNames
			});
		} catch (error) {
			return {
				ok: false,
				error: `Failed to verify platform-specific npm dependencies for ${params.packageName}: ${String(error)}`
			};
		}
		if (incompletePlatformPackages.length > 0) {
			const incompletePlatformPackageNames = incompletePlatformPackages.map((entry) => entry.name);
			logger.warn?.(`npm left current-platform package(s) ${incompletePlatformPackageNames.join(", ")} missing or incomplete; retrying once with a fresh cache.`);
			let freshCacheDir;
			try {
				await Promise.all(incompletePlatformPackages.map(({ packagePath }) => fs.rm(packagePath, {
					recursive: true,
					force: true
				})));
				freshCacheDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-npm-cache-"));
				install = await runCommandWithTimeout(npmInstallArgs, {
					...npmInstallOptions,
					env: {
						...npmInstallOptions.env,
						NPM_CONFIG_CACHE: freshCacheDir,
						npm_config_cache: freshCacheDir
					}
				});
			} catch (error) {
				return {
					ok: false,
					error: `Failed to repair missing or incomplete current-platform package(s) ${incompletePlatformPackageNames.join(", ")}: ${String(error)}`
				};
			} finally {
				if (freshCacheDir) try {
					await fs.rm(freshCacheDir, {
						recursive: true,
						force: true
					});
				} catch (error) {
					logger.warn?.(`Failed to remove temporary npm cache ${freshCacheDir}: ${String(error)}`);
				}
			}
			if (install.code !== 0) return {
				ok: false,
				error: `npm install failed while repairing missing or incomplete current-platform package(s) ${incompletePlatformPackageNames.join(", ")}: ${formatNpmCommandFailureOutput(install)}`
			};
			let stillIncompletePlatformPackages;
			try {
				stillIncompletePlatformPackages = await listMissingRequiredPlatformPackages({
					npmRoot,
					requiredPackageNames: requiredPlatformPackageNames.packageNames
				});
			} catch (error) {
				return {
					ok: false,
					error: `Failed to verify repaired platform-specific npm dependencies for ${params.packageName}: ${String(error)}`
				};
			}
			if (stillIncompletePlatformPackages.length > 0) return {
				ok: false,
				error: `npm install reported success but left required current-platform package(s) missing or incomplete: ${stillIncompletePlatformPackages.map((entry) => entry.name).join(", ")}`
			};
		}
		if (params.packageName !== "openclaw") {
			if (await repairManagedNpmRootOpenClawPeer({
				npmRoot,
				timeoutMs,
				workTimeoutMs,
				signal: params.signal,
				logger
			})) logger.info?.(`Repaired stale openclaw peer dependency in ${npmRoot} after npm install`);
		}
		try {
			await relinkOpenClawPeerDependenciesInManagedNpmRoot({
				npmRoot,
				logger
			});
		} catch (error) {
			return {
				ok: false,
				error: `Failed to repair openclaw peer links after npm install: ${String(error)}`
			};
		}
		if (await auditDeclaredOpenClawHostDependency({ packageDir: installRoot })) return {
			ok: false,
			error: formatUnresolvedOpenClawPeerLinkError(params.packageName)
		};
		let installedDependency;
		try {
			installedDependency = await readManagedNpmRootInstalledDependency({
				npmRoot,
				packageName: params.packageName
			});
		} catch (error) {
			return {
				ok: false,
				error: `Failed to verify npm install metadata for ${params.packageName}: ${String(error)}`
			};
		}
		const resolutionVerification = verifyInstalledNpmResolution({
			packageName: params.packageName,
			expected: params.npmResolution,
			installed: installedDependency
		});
		if (resolutionVerification.kind === "conflict") return {
			ok: false,
			error: resolutionVerification.error
		};
		if (resolutionVerification.kind === "incomplete") {
			if (!recovery) {
				const recoveryFailure = await quarantineForRecovery({
					kind: "incomplete-metadata",
					error: resolutionVerification.error
				});
				if (recoveryFailure) return recoveryFailure;
				return await runManagedNpmInstall(npmRoot);
			}
			return {
				ok: false,
				error: `npm install metadata remained incomplete after managed npm project recovery (quarantine: ${recovery.quarantine.quarantineDir}): ${resolutionVerification.error}`
			};
		}
		const missingRequired = await findMissingRequiredPluginDependencies({
			rootDir: installRoot,
			dependencyRootDir: npmRoot,
			...normalizePluginDependencySpecs(packageManifestResult.manifest ?? {})
		});
		if (missingRequired.length > 0) return {
			ok: false,
			error: `npm install reported success but left required dependencies missing for ${params.packageName}: ${missingRequired.join(", ")}`
		};
		const newRootPackageDirs = [...await listManagedNpmRootPackageNames(npmRoot)].map((packageName) => resolveManagedNpmRootPackageDir(npmRoot, packageName)).toSorted((left, right) => left.localeCompare(right));
		let installedExpectedPluginId = expectedPluginId;
		if (mode === "update" && params.trustedSourceLinkedOfficialInstall === true && expectedPluginId && params.expectedReplacementPluginId) {
			const manifestResult = runtime.loadPluginManifest(installRoot);
			if (manifestResult.ok && manifestResult.manifest.id === params.expectedReplacementPluginId && (manifestResult.manifest.legacyPluginIds?.includes(expectedPluginId) || isOfficialCatalogLookupPluginIdReplacement({
				expectedPluginId,
				expectedReplacementPluginId: params.expectedReplacementPluginId
			}))) installedExpectedPluginId = params.expectedReplacementPluginId;
		}
		const result = await installPluginFromInstalledPackageDir({
			onInstallPolicyWarning: params.onInstallPolicyWarning,
			config: params.config,
			additionalDependencyPackageDirs: newRootPackageDirs,
			packageDir: installRoot,
			dependencyScanRootDir: npmRoot,
			logger,
			expectedPluginId: installedExpectedPluginId,
			requirePluginManifest: params.trustedSourceLinkedOfficialInstall,
			trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
			mode: policyMode,
			installPolicyRequest: params.installPolicyRequest,
			emitSuccessSecurityEvent: false
		});
		if (!result.ok) return result;
		await params.onBeforePluginArtifactCommit?.({
			pluginId: result.pluginId,
			...targetMode === "update" ? { currentArtifactDir: targetPackageDir } : {},
			stagedArtifactDir: installRoot,
			mode: policyMode,
			...params.installPolicyRequest.source?.kind === "npm" ? { sourceRecord: {
				source: "npm",
				spec: params.displaySpec,
				...buildNpmResolutionFields(params.npmResolution)
			} } : {}
		});
		return {
			...result,
			npmResolution: params.npmResolution,
			...params.integrityDrift ? { integrityDrift: params.integrityDrift } : {}
		};
	};
	const staged = {};
	const transactionRequest = resolvePluginInstallTransactionRequest(params);
	const published = await installPackageDir(requestDeferredPackageDirInstall({
		targetDir: targetNpmRoot,
		mode: "update",
		timeoutMs,
		logger,
		copyErrorPrefix: "Failed to publish managed npm project",
		beforePersistentApply: () => {
			params.signal?.throwIfAborted();
			params.beforePersistentApply?.();
		},
		hasDeps: false,
		sourceHardlinks: "package-manager",
		depsLogMessage: "",
		afterCopy: (stageDir) => copyManagedNpmProjectInputs({
			npmRoot: targetNpmRoot,
			stageDir
		}),
		afterInstall: async (stageDir) => {
			try {
				staged.result = await withInstallActivity(logger, "dependencies", () => runManagedNpmInstall(stageDir));
				return staged.result;
			} catch (error) {
				staged.failure = { cause: error };
				return {
					ok: false,
					error: String(error)
				};
			}
		}
	}, transactionRequest?.assertOwned));
	if (staged.failure) throw staged.failure.cause;
	if (!published.ok) return published;
	if (!staged.result?.ok) throw new Error("Managed npm project published without a validated plugin");
	const transaction = resolvePackageDirInstallTransaction(published);
	const result = {
		...staged.result,
		targetDir: targetPackageDir
	};
	if (transactionRequest) return attachPluginInstallTransaction(result, transaction);
	await transaction.commit();
	return result;
}
//#endregion
//#region src/plugins/install-npm-pack.ts
const MANAGED_NPM_PACK_ARCHIVE_DIR = "_openclaw-pack-archives";
function resolveTrustedNpmPackPackageName(packageName) {
	if (!packageName) return {
		ok: false,
		error: "npm pack metadata missing package name",
		code: PLUGIN_INSTALL_ERROR_CODE.INVALID_NPM_SPEC
	};
	const specError = validateRegistryNpmSpec(packageName);
	const parsedSpec = parseRegistryNpmSpec(packageName);
	if (specError || !parsedSpec || parsedSpec.selectorKind !== "none") return {
		ok: false,
		error: `unsupported npm pack package name: ${packageName}`,
		code: PLUGIN_INSTALL_ERROR_CODE.INVALID_NPM_SPEC
	};
	return {
		ok: true,
		packageName: parsedSpec.name
	};
}
async function stageNpmPackArchiveInManagedRoot(params) {
	const archiveStoreDir = path.join(params.npmRoot, MANAGED_NPM_PACK_ARCHIVE_DIR);
	const identity = params.integrity ?? params.shasum ?? params.tarballName;
	const identitySlug = sha256HexPrefixCore(identity, 16);
	const archiveFileName = `${safePluginInstallFileName(params.packageName) || "plugin"}-${safePluginInstallFileName(params.version ?? "pack") || "pack"}-${identitySlug}.tgz`;
	await fs.mkdir(archiveStoreDir, { recursive: true });
	await fs.copyFile(params.archivePath, path.join(archiveStoreDir, archiveFileName));
	return { dependencySpec: `file:./${path.posix.join(MANAGED_NPM_PACK_ARCHIVE_DIR, archiveFileName)}` };
}
async function installPluginFromNpmPackArchive(params) {
	const runtime = await loadPluginInstallRuntime();
	const { logger, timeoutMs, workTimeoutMs, mode, dryRun } = runtime.resolveTimedInstallModeOptions(params, defaultLogger);
	const metadataResult = await resolveNpmPackArchiveMetadata({
		archivePath: params.archivePath,
		timeoutMs,
		signal: params.signal
	});
	if (!metadataResult.ok) return metadataResult;
	const npmResolution = {
		...metadataResult.metadata,
		resolvedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	const driftResult = await resolveNpmIntegrityDriftWithDefaultMessage({
		spec: metadataResult.archivePath,
		expectedIntegrity: params.expectedIntegrity,
		resolution: npmResolution,
		onIntegrityDrift: params.onIntegrityDrift,
		warn: (message) => logger.warn?.(message)
	});
	if (driftResult.error) return {
		ok: false,
		error: driftResult.error
	};
	const packageNameResult = resolveTrustedNpmPackPackageName(metadataResult.metadata.name);
	if (!packageNameResult.ok) return packageNameResult;
	const packageName = packageNameResult.packageName;
	const npmBaseDir = params.npmDir ? resolveUserPath(params.npmDir) : resolveDefaultPluginNpmDir();
	const { policyMode } = await resolveManagedNpmInstallPlan({
		runtime,
		npmBaseDir,
		packageName,
		requestedMode: mode,
		npmResolution
	});
	const result = await installPluginFromManagedNpmRoot(copyPluginInstallTransactionRequest(params, {
		onInstallPolicyWarning: params.onInstallPolicyWarning,
		trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
		config: params.config,
		packageName,
		prepareDependencySpec: async ({ npmRoot }) => {
			try {
				return {
					ok: true,
					...await stageNpmPackArchiveInManagedRoot({
						archivePath: metadataResult.archivePath,
						npmRoot,
						packageName,
						version: metadataResult.metadata.version,
						integrity: metadataResult.metadata.integrity,
						shasum: metadataResult.metadata.shasum,
						tarballName: metadataResult.tarballName
					})
				};
			} catch (error) {
				return {
					ok: false,
					error: `Failed to stage npm pack archive in managed npm root: ${String(error)}`
				};
			}
		},
		displaySpec: metadataResult.archivePath,
		installPolicyRequest: {
			kind: "plugin-npm",
			requestedSpecifier: `npm-pack:${metadataResult.archivePath}`,
			source: {
				kind: "archive",
				authority: "user",
				mutable: true,
				network: false
			}
		},
		policyPreflightSourcePath: metadataResult.archivePath,
		policyPreflightSourcePathKind: "file",
		extensionsDir: params.extensionsDir,
		npmDir: npmBaseDir,
		timeoutMs,
		workTimeoutMs,
		signal: params.signal,
		logger,
		mode,
		dryRun,
		expectedPluginId: params.expectedPluginId,
		onBeforePluginArtifactCommit: params.onBeforePluginArtifactCommit,
		beforePersistentApply: params.beforePersistentApply,
		npmResolution,
		...driftResult.integrityDrift ? { integrityDrift: driftResult.integrityDrift } : {}
	}));
	emitSuccessfulPluginInstallSecurityEvent(result, {
		dryRun,
		mode: policyMode,
		sourceFamily: "archive",
		trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall
	});
	return {
		...result,
		...result.ok ? { npmTarballName: metadataResult.tarballName } : {}
	};
}
//#endregion
//#region src/plugins/install-npm-metadata.ts
function isNpmPackageNotFoundMessage(error) {
	const normalized = error.trim();
	if (normalized.startsWith("Package not found on npm:")) return true;
	return /E404|404 not found|not in this registry/i.test(normalized);
}
function compareNpmSemver(a, b) {
	const releaseCmp = compareOpenClawReleaseVersions(a, b);
	if (releaseCmp !== null) return releaseCmp;
	return compareValidSemver(a, b) ?? 0;
}
async function resolveTrustedOfficialPrereleaseResolution(params) {
	if (!params.spec.name.startsWith("@openclaw/")) return null;
	const semverVersions = await loadNpmPackageVersions({
		packageName: params.spec.name,
		timeoutMs: params.timeoutMs,
		signal: params.signal,
		killProcessTree: true
	});
	if (!semverVersions) return null;
	const stableVersion = semverVersions.filter((value) => !isPrereleaseSemverVersion(value)).toSorted(compareNpmSemver).at(-1);
	if (!stableVersion) {
		const prereleaseVersion = semverVersions.filter(isPrereleaseSemverVersion).toSorted(compareNpmSemver).at(-1);
		if (prereleaseVersion && semverVersions.every(isPrereleaseSemverVersion)) {
			if (prereleaseVersion !== params.resolvedPrereleaseVersion) {
				const prereleaseSpec = `${params.spec.name}@${prereleaseVersion}`;
				const metadataResult = await resolveNpmSpecMetadata({
					spec: prereleaseSpec,
					timeoutMs: params.timeoutMs,
					signal: params.signal
				});
				if (!metadataResult.ok) return null;
				params.logger.warn?.(`Resolved ${params.spec.raw} to prerelease version ${params.resolvedPrereleaseVersion}; using newest prerelease ${prereleaseSpec} because this trusted official OpenClaw package has no stable npm versions yet.`);
				return {
					kind: "prerelease-only",
					resolution: metadataResult.metadata
				};
			}
			params.logger.warn?.(`Resolved ${params.spec.raw} to prerelease version ${params.resolvedPrereleaseVersion}; allowing it because this trusted official OpenClaw package has no stable npm versions yet.`);
			return { kind: "allow-prerelease-only" };
		}
		return null;
	}
	const stableSpec = `${params.spec.name}@${stableVersion}`;
	const metadataResult = await resolveNpmSpecMetadata({
		spec: stableSpec,
		timeoutMs: params.timeoutMs,
		signal: params.signal
	});
	if (!metadataResult.ok) return null;
	params.logger.warn?.(`Resolved ${params.spec.raw} to prerelease version ${params.resolvedPrereleaseVersion}; falling back to stable ${stableSpec} for this trusted official OpenClaw install.`);
	return {
		kind: "stable",
		resolution: metadataResult.metadata
	};
}
function shouldResolveLatestCompatibleNpmVersion(spec) {
	return spec.selectorKind === "none" || spec.selectorKind === "tag" && (spec.selector ?? "").toLowerCase() === "latest";
}
function shouldResolveCompatiblePrereleaseNpmVersion(params) {
	if (!isPrereleaseSemverVersion(params.currentVersion)) return false;
	if (params.spec.selectorKind === "none") return true;
	return params.spec.selectorKind === "tag" && (params.spec.selector ?? "").toLowerCase() !== "latest";
}
function resolvePrereleaseChannel(version) {
	if (!isPrereleaseSemverVersion(version)) return null;
	return /^\s*v?\d+\.\d+\.\d+-([0-9A-Za-z]+)(?:[.-]|$)/.exec(version)?.[1]?.toLowerCase() ?? null;
}
function canResolveAroundCompatibilityError(error) {
	return error.code === PLUGIN_INSTALL_ERROR_CODE.INCOMPATIBLE_HOST_VERSION || error.code === PLUGIN_INSTALL_ERROR_CODE.INCOMPATIBLE_PLUGIN_API;
}
function validateNpmResolutionCompatibility(params) {
	return validateOpenClawPackageInstallCompatibility({
		runtime: params.runtime,
		pluginId: params.expectedPluginId ?? params.resolution.name ?? params.parsedSpec.name,
		packageMetadata: params.resolution.packageOpenClaw
	});
}
async function resolveLatestCompatibleNpmResolution(params) {
	if (!params.currentResolution.version) return null;
	const currentVersion = params.currentResolution.version;
	const allowPrereleaseCandidates = shouldResolveCompatiblePrereleaseNpmVersion({
		spec: params.parsedSpec,
		currentVersion
	});
	const prereleaseChannel = allowPrereleaseCandidates ? resolvePrereleaseChannel(currentVersion) : null;
	if (!shouldResolveLatestCompatibleNpmVersion(params.parsedSpec) && !allowPrereleaseCandidates) return null;
	const versions = await loadNpmPackageVersions({
		packageName: params.parsedSpec.name,
		timeoutMs: params.timeoutMs,
		signal: params.signal,
		killProcessTree: true
	});
	if (!versions) return null;
	const candidates = versions.filter((version) => allowPrereleaseCandidates ? resolvePrereleaseChannel(version) === prereleaseChannel : !isPrereleaseSemverVersion(version)).filter((version) => compareNpmSemver(version, currentVersion) < 0).toSorted(compareNpmSemver).toReversed();
	for (const version of candidates) {
		const spec = `${params.parsedSpec.name}@${version}`;
		const metadataResult = await resolveNpmSpecMetadata({
			spec,
			timeoutMs: params.timeoutMs,
			signal: params.signal
		});
		if (!metadataResult.ok) {
			params.logger.warn?.(`Could not inspect ${spec} while looking for a compatible plugin version: ${metadataResult.error}`);
			continue;
		}
		if (!validateNpmResolutionCompatibility({
			runtime: params.runtime,
			parsedSpec: params.parsedSpec,
			expectedPluginId: params.expectedPluginId,
			resolution: metadataResult.metadata
		})) {
			params.logger.warn?.(`Resolved ${params.parsedSpec.raw} to ${params.currentResolution.resolvedSpec ?? currentVersion}, but that version is incompatible with this OpenClaw runtime; using newest compatible ${metadataResult.metadata.resolvedSpec ?? spec}.`);
			return metadataResult.metadata;
		}
	}
	return null;
}
//#endregion
//#region src/plugins/install-npm.ts
async function installPluginFromNpmSpec(params) {
	const runtime = await loadPluginInstallRuntime();
	const { logger, timeoutMs, workTimeoutMs, mode, dryRun } = runtime.resolveTimedInstallModeOptions(params, defaultLogger);
	const expectedPluginId = params.expectedPluginId;
	const spec = params.spec.trim();
	const specError = runtime.validateRegistryNpmSpec(spec);
	if (specError) return {
		ok: false,
		error: specError,
		code: PLUGIN_INSTALL_ERROR_CODE.INVALID_NPM_SPEC
	};
	const parsedSpec = parseRegistryNpmSpec(spec);
	if (!parsedSpec) return {
		ok: false,
		error: "unsupported npm spec",
		code: PLUGIN_INSTALL_ERROR_CODE.INVALID_NPM_SPEC
	};
	const metadataResult = await withInstallActivity(logger, "resolve", () => resolveNpmSpecMetadata({
		spec,
		timeoutMs,
		signal: params.signal
	}));
	if (!metadataResult.ok) return {
		ok: false,
		error: metadataResult.error,
		...isNpmPackageNotFoundMessage(metadataResult.error) ? { code: PLUGIN_INSTALL_ERROR_CODE.NPM_PACKAGE_NOT_FOUND } : metadataResult.category === "metadata-env" ? { code: PLUGIN_INSTALL_ERROR_CODE.NPM_METADATA_FAILURE } : {}
	};
	const npmResolution = {
		...metadataResult.metadata,
		resolvedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
	if (npmResolution.version && !isPrereleaseResolutionAllowed({
		spec: parsedSpec,
		resolvedVersion: npmResolution.version
	})) {
		const trustedResolution = params.trustedSourceLinkedOfficialInstall ? await resolveTrustedOfficialPrereleaseResolution({
			spec: parsedSpec,
			resolvedPrereleaseVersion: npmResolution.version,
			timeoutMs,
			signal: params.signal,
			logger
		}) : null;
		if (trustedResolution?.kind === "stable" || trustedResolution?.kind === "prerelease-only") Object.assign(npmResolution, trustedResolution.resolution, { resolvedAt: npmResolution.resolvedAt });
		else if (trustedResolution?.kind === "allow-prerelease-only") {} else return {
			ok: false,
			error: formatPrereleaseResolutionError({
				spec: parsedSpec,
				resolvedVersion: npmResolution.version
			})
		};
	}
	let compatibilityError = validateNpmResolutionCompatibility({
		runtime,
		parsedSpec,
		expectedPluginId,
		resolution: npmResolution
	});
	if (compatibilityError && canResolveAroundCompatibilityError(compatibilityError)) {
		const compatibleResolution = await resolveLatestCompatibleNpmResolution({
			runtime,
			parsedSpec,
			expectedPluginId,
			currentResolution: npmResolution,
			timeoutMs,
			signal: params.signal,
			logger
		});
		if (compatibleResolution) {
			Object.assign(npmResolution, compatibleResolution, { resolvedAt: npmResolution.resolvedAt });
			compatibilityError = validateNpmResolutionCompatibility({
				runtime,
				parsedSpec,
				expectedPluginId,
				resolution: npmResolution
			});
		}
	}
	if (compatibilityError) return compatibilityError;
	const npmInstallPolicySource = {
		kind: "npm",
		authority: params.trustedSourceLinkedOfficialInstall ? "official" : "third-party",
		mutable: false,
		network: true
	};
	const driftResult = await resolveNpmIntegrityDriftWithDefaultMessage({
		spec,
		expectedIntegrity: params.expectedIntegrity,
		resolution: npmResolution,
		onIntegrityDrift: params.onIntegrityDrift,
		warn: (message) => logger.warn?.(message)
	});
	if (driftResult.error) return {
		ok: false,
		error: driftResult.error
	};
	const npmBaseDir = params.npmDir ? resolveUserPath(params.npmDir) : resolveDefaultPluginNpmDir();
	const { policyMode } = await resolveManagedNpmInstallPlan({
		runtime,
		npmBaseDir,
		packageName: parsedSpec.name,
		requestedMode: mode,
		npmResolution
	});
	const policyTempDir = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-npm-policy-"));
	try {
		const policyMetadataPath = path.join(policyTempDir, "npm-package-metadata.json");
		await fs.writeFile(policyMetadataPath, `${JSON.stringify({
			packageName: parsedSpec.name,
			requestedSpecifier: spec,
			resolution: npmResolution
		}, null, 2)}\n`, "utf8");
		const preflightPolicyResult = await runInstallSourceScan({
			subject: `Plugin "${expectedPluginId ?? parsedSpec.name}"`,
			pluginId: expectedPluginId ?? parsedSpec.name,
			mode: policyMode,
			sourceFamily: "npm",
			scan: async () => await preflightPluginNpmInstallPolicy({
				config: params.config,
				onInstallPolicyWarning: params.onInstallPolicyWarning,
				logger,
				mode: policyMode,
				packageName: parsedSpec.name,
				...expectedPluginId ? { pluginId: expectedPluginId } : {},
				requestedSpecifier: spec,
				source: npmInstallPolicySource,
				sourcePath: policyMetadataPath,
				sourcePathKind: "file"
			})
		});
		if (preflightPolicyResult) return preflightPolicyResult;
	} finally {
		await fs.rm(policyTempDir, {
			recursive: true,
			force: true
		});
	}
	const result = await installPluginFromManagedNpmRoot(copyPluginInstallTransactionRequest(params, {
		onInstallPolicyWarning: params.onInstallPolicyWarning,
		trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
		config: params.config,
		packageName: parsedSpec.name,
		dependencySpec: resolveManagedNpmRootDependencySpec({
			parsedSpec,
			resolution: npmResolution
		}),
		displaySpec: spec,
		installPolicyRequest: {
			kind: "plugin-npm",
			requestedSpecifier: spec,
			source: npmInstallPolicySource
		},
		extensionsDir: params.extensionsDir,
		npmDir: params.npmDir,
		timeoutMs,
		workTimeoutMs,
		signal: params.signal,
		logger,
		mode,
		dryRun,
		skipPolicyPreflight: true,
		expectedPluginId,
		expectedReplacementPluginId: params.expectedReplacementPluginId,
		onBeforePluginArtifactCommit: params.onBeforePluginArtifactCommit,
		beforePersistentApply: params.beforePersistentApply,
		npmResolution,
		...driftResult.integrityDrift ? { integrityDrift: driftResult.integrityDrift } : {}
	}));
	emitSuccessfulPluginInstallSecurityEvent(result, {
		dryRun,
		mode: policyMode,
		sourceFamily: "npm",
		trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall
	});
	return result;
}
//#endregion
//#region src/plugins/install-package.ts
const PLUGIN_ARCHIVE_ROOT_MARKERS = [
	"package.json",
	"openclaw.plugin.json",
	".codex-plugin/plugin.json",
	".claude-plugin/plugin.json",
	".cursor-plugin/plugin.json",
	"plugin.json"
];
function pickPackageInstallCommonParams(params) {
	return copyPluginInstallTransactionRequest(params, {
		config: params.config,
		onInstallPolicyWarning: params.onInstallPolicyWarning,
		trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
		extensionsDir: params.extensionsDir,
		npmDir: params.npmDir,
		timeoutMs: params.timeoutMs,
		workTimeoutMs: params.workTimeoutMs,
		logger: params.logger,
		mode: params.mode,
		dryRun: params.dryRun,
		expectedPluginId: params.expectedPluginId,
		requirePluginManifest: params.requirePluginManifest,
		allowSourceTypeScriptEntries: params.allowSourceTypeScriptEntries,
		installPolicyRequest: params.installPolicyRequest,
		onBeforePluginArtifactCommit: params.onBeforePluginArtifactCommit,
		beforePersistentApply: params.beforePersistentApply,
		onEffectiveMode: params.onEffectiveMode
	});
}
function installPolicyRequestForPath(params, kind) {
	const requestKind = params.installPolicyRequest?.kind === "plugin-git" && kind === "plugin-dir" ? "plugin-git" : kind;
	return {
		kind: requestKind,
		requestedSpecifier: params.installPolicyRequest?.requestedSpecifier ?? params.path,
		source: params.installPolicyRequest?.source ?? localPluginInstallPolicySource(requestKind)
	};
}
function localPluginInstallPolicySource(kind) {
	if (kind === "plugin-archive") return {
		kind: "archive",
		authority: "user",
		mutable: true,
		network: false
	};
	if (kind === "plugin-git") return {
		kind: "git",
		authority: "third-party",
		mutable: true,
		network: true
	};
	return {
		kind: "local-path",
		authority: "user",
		mutable: true,
		network: false
	};
}
async function installBundleFromSourceDir(params) {
	const runtime = await loadPluginInstallRuntime();
	const bundleFormat = runtime.detectBundleManifestFormat(params.sourceDir);
	if (!bundleFormat) return null;
	const { logger, timeoutMs, workTimeoutMs, mode, dryRun } = runtime.resolveTimedInstallModeOptions(params, defaultLogger);
	const manifestRes = runtime.loadBundleManifest({
		rootDir: params.sourceDir,
		bundleFormat,
		rejectHardlinks: true
	});
	if (!manifestRes.ok) return {
		ok: false,
		error: manifestRes.error
	};
	const pluginId = manifestRes.manifest.id;
	const pluginIdError = validatePluginId(pluginId);
	if (pluginIdError) return {
		ok: false,
		error: pluginIdError
	};
	if (params.expectedPluginId && params.expectedPluginId !== pluginId) return {
		ok: false,
		error: `plugin id mismatch: expected ${params.expectedPluginId}, got ${pluginId}`,
		code: PLUGIN_INSTALL_ERROR_CODE.PLUGIN_ID_MISMATCH
	};
	const packageManifestResult = await readOptionalPackageManifest({
		runtime,
		packageDir: params.sourceDir
	});
	if (!packageManifestResult.ok) return packageManifestResult;
	const packageMetadata = packageManifestResult.manifest ? runtime.getPackageManifestMetadata(packageManifestResult.manifest) : void 0;
	const compatibilityError = validateOpenClawPackageInstallCompatibility({
		runtime,
		pluginId,
		packageMetadata
	});
	if (compatibilityError) return compatibilityError;
	const targetResult = await resolvePreparedDirectoryInstallTarget({
		runtime,
		pluginId,
		extensionsDir: params.extensionsDir,
		requestedMode: mode
	});
	if (!targetResult.ok) return {
		ok: false,
		error: targetResult.error
	};
	params.onEffectiveMode?.(targetResult.target.effectiveMode);
	const scanResult = await runInstallSourceScan({
		subject: `Bundle "${pluginId}"`,
		pluginId,
		mode: targetResult.target.effectiveMode,
		sourceFamily: sourceFamilyForInstallPolicyKind(params.installPolicyRequest?.kind, "archive"),
		scan: async () => await runtime.scanBundleInstallSource({
			onInstallPolicyWarning: params.onInstallPolicyWarning,
			config: params.config,
			sourceDir: params.sourceDir,
			pluginId,
			logger,
			requestKind: params.installPolicyRequest?.kind,
			requestedSpecifier: params.installPolicyRequest?.requestedSpecifier,
			source: params.installPolicyRequest?.source,
			mode: targetResult.target.effectiveMode,
			version: manifestRes.manifest.version
		})
	});
	if (scanResult) return scanResult;
	const installed = await installPluginDirectoryIntoExtensions(copyPluginInstallTransactionRequest(params, {
		sourceDir: params.sourceDir,
		pluginId,
		manifestName: manifestRes.manifest.name,
		version: manifestRes.manifest.version,
		extensions: [],
		targetDir: targetResult.target.targetPath,
		extensionsDir: params.extensionsDir,
		logger,
		timeoutMs,
		workTimeoutMs,
		mode: targetResult.target.effectiveMode,
		dryRun,
		copyErrorPrefix: "failed to copy plugin bundle",
		hasDeps: false,
		depsLogMessage: "",
		onBeforePluginArtifactCommit: params.onBeforePluginArtifactCommit,
		beforePersistentApply: params.beforePersistentApply
	}));
	return installed.ok ? {
		...installed,
		artifactInspection: inspectBundlePluginArtifact({
			format: manifestRes.manifest.bundleFormat,
			capabilities: manifestRes.manifest.capabilities
		})
	} : installed;
}
function withArtifactInspection(result, artifactInspection) {
	return result.ok ? {
		...result,
		artifactInspection
	} : result;
}
async function installPluginFromSourceDir(params) {
	const nativePackageManifest = await detectNativePackageInstallSource(params.sourceDir);
	if (nativePackageManifest) return withArtifactInspection(await installPluginFromPackageDir({
		packageDir: params.sourceDir,
		packageManifest: nativePackageManifest,
		...pickPackageInstallCommonParams(params)
	}), inspectNativePluginArtifact());
	const bundleResult = await installBundleFromSourceDir({
		sourceDir: params.sourceDir,
		...pickPackageInstallCommonParams(params)
	});
	if (bundleResult) return bundleResult;
	return withArtifactInspection(await installPluginFromPackageDir({
		packageDir: params.sourceDir,
		...pickPackageInstallCommonParams(params)
	}), inspectNativePluginArtifact());
}
async function detectNativePackageInstallSource(packageDir) {
	const runtime = await loadPluginInstallRuntime();
	const result = await readOptionalPackageManifest({
		runtime,
		packageDir
	});
	const manifest = result.ok ? result.manifest : void 0;
	return manifest && ensureOpenClawExtensions({ manifest }).ok ? manifest : void 0;
}
async function installPluginFromPackageDir(params) {
	const runtime = await loadPluginInstallRuntime();
	const { logger, timeoutMs, workTimeoutMs, mode, dryRun } = runtime.resolveTimedInstallModeOptions(params, defaultLogger);
	let preparedTarget;
	const resolvePreparedTargetForPluginId = async (pluginId) => {
		if (!preparedTarget) {
			const targetResult = await resolvePreparedDirectoryInstallTarget({
				runtime,
				pluginId,
				extensionsDir: params.extensionsDir,
				requestedMode: mode,
				nameEncoder: encodePluginInstallDirName
			});
			if (!targetResult.ok) throw new Error(targetResult.error);
			preparedTarget = targetResult.target;
		}
		return preparedTarget;
	};
	const validated = await validatePackagePluginInstallSource({
		runtime,
		packageDir: params.packageDir,
		manifest: params.packageManifest,
		expectedPluginId: params.expectedPluginId,
		requirePluginManifest: params.requirePluginManifest,
		allowSourceTypeScriptEntries: params.allowSourceTypeScriptEntries,
		onInstallPolicyWarning: params.onInstallPolicyWarning,
		trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
		config: params.config,
		installPolicyRequest: params.installPolicyRequest,
		logger,
		mode,
		resolveEffectiveMode: async (pluginId) => (await resolvePreparedTargetForPluginId(pluginId)).effectiveMode
	});
	if (!validated.ok) return validated;
	const { plugin } = validated;
	preparedTarget = await resolvePreparedTargetForPluginId(plugin.pluginId);
	const effectiveMode = preparedTarget.effectiveMode;
	params.onEffectiveMode?.(effectiveMode);
	const shouldInstallRuntimeDeps = plugin.hasRuntimeDependencies && params.installPolicyRequest?.kind === "plugin-archive";
	return await installPluginDirectoryIntoExtensions(copyPluginInstallTransactionRequest(params, {
		sourceDir: params.packageDir,
		pluginId: plugin.pluginId,
		manifestName: plugin.manifestName,
		version: plugin.version,
		extensions: plugin.extensions,
		setup: plugin.setup,
		targetDir: preparedTarget.targetPath,
		extensionsDir: params.extensionsDir,
		logger,
		timeoutMs,
		workTimeoutMs,
		mode: effectiveMode,
		dryRun,
		copyErrorPrefix: "failed to copy plugin",
		hasDeps: shouldInstallRuntimeDeps,
		sourceHardlinks: shouldInstallRuntimeDeps ? "package-manager" : "reject",
		depsLogMessage: "Installing plugin dependencies…",
		nameEncoder: encodePluginInstallDirName,
		onBeforePluginArtifactCommit: params.onBeforePluginArtifactCommit,
		beforePersistentApply: params.beforePersistentApply,
		afterInstall: async (installedDir) => {
			return await scanAndLinkInstalledPackage({
				runtime,
				installedDir,
				pluginId: plugin.pluginId,
				peerDependencies: plugin.peerDependencies,
				onInstallPolicyWarning: params.onInstallPolicyWarning,
				trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
				config: params.config,
				mode: effectiveMode,
				...params.installPolicyRequest?.kind ? { requestKind: params.installPolicyRequest.kind } : {},
				requestedSpecifier: params.installPolicyRequest?.requestedSpecifier,
				source: params.installPolicyRequest?.source,
				logger
			});
		}
	}));
}
async function installPluginFromArchive(params) {
	const runtime = await loadPluginInstallRuntime();
	const { logger, timeoutMs, workTimeoutMs, mode } = runtime.resolveTimedInstallModeOptions(params, defaultLogger);
	const installPolicyRequest = params.installPolicyRequest ?? {
		kind: "plugin-archive",
		requestedSpecifier: params.archivePath,
		source: localPluginInstallPolicySource("plugin-archive")
	};
	const archivePathResult = await runtime.resolveArchiveSourcePath(params.archivePath);
	if (!archivePathResult.ok) return archivePathResult;
	const archivePath = archivePathResult.path;
	let effectiveMode = mode;
	const result = await runtime.withExtractedArchiveRoot({
		archivePath,
		tempDirPrefix: "openclaw-plugin-",
		timeoutMs,
		workTimeoutMs,
		logger,
		rootMarkers: PLUGIN_ARCHIVE_ROOT_MARKERS,
		onExtracted: async (sourceDir) => await installPluginFromSourceDir({
			sourceDir,
			...pickPackageInstallCommonParams(copyPluginInstallTransactionRequest(params, {
				onInstallPolicyWarning: params.onInstallPolicyWarning,
				extensionsDir: params.extensionsDir,
				timeoutMs,
				workTimeoutMs,
				logger,
				mode,
				dryRun: params.dryRun,
				config: params.config,
				expectedPluginId: params.expectedPluginId,
				trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
				requirePluginManifest: true,
				installPolicyRequest,
				onBeforePluginArtifactCommit: params.onBeforePluginArtifactCommit,
				beforePersistentApply: params.beforePersistentApply,
				onEffectiveMode: (resolvedMode) => {
					effectiveMode = resolvedMode;
				}
			}))
		})
	});
	emitSuccessfulPluginInstallSecurityEvent(result, {
		dryRun: params.dryRun,
		mode: effectiveMode,
		sourceFamily: "archive",
		trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall
	});
	return result;
}
async function installPluginFromDir(params) {
	const runtime = await loadPluginInstallRuntime();
	const dirPath = resolveUserPath(params.dirPath);
	const installPolicyRequest = params.installPolicyRequest ?? {
		kind: "plugin-dir",
		requestedSpecifier: params.dirPath,
		source: localPluginInstallPolicySource("plugin-dir")
	};
	if (!await runtime.fileExists(dirPath)) return {
		ok: false,
		error: `directory not found: ${dirPath}`
	};
	if (!(await fs.stat(dirPath)).isDirectory()) return {
		ok: false,
		error: `not a directory: ${dirPath}`
	};
	let effectiveMode = params.mode ?? "install";
	const result = await installPluginFromSourceDir({
		sourceDir: dirPath,
		...pickPackageInstallCommonParams({
			...params,
			installPolicyRequest,
			onEffectiveMode: (resolvedMode) => {
				effectiveMode = resolvedMode;
			}
		})
	});
	emitSuccessfulPluginInstallSecurityEvent(result, {
		dryRun: params.dryRun,
		mode: effectiveMode,
		sourceFamily: sourceFamilyForInstallPolicyKind(installPolicyRequest.kind, "directory"),
		trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall
	});
	return result;
}
async function installPluginFromPath(params) {
	const runtime = await loadPluginInstallRuntime();
	const pathResult = await runtime.resolveExistingInstallPath(params.path);
	if (!pathResult.ok) return pathResult;
	const { resolvedPath: resolved, stat } = pathResult;
	const packageInstallOptions = pickPackageInstallCommonParams(params);
	if (stat.isDirectory()) return await installPluginFromDir({
		dirPath: resolved,
		...packageInstallOptions,
		installPolicyRequest: installPolicyRequestForPath(params, "plugin-dir")
	});
	if (runtime.resolveArchiveKind(resolved)) return await installPluginFromArchive({
		archivePath: resolved,
		...packageInstallOptions,
		installPolicyRequest: installPolicyRequestForPath(params, "plugin-archive")
	});
	return {
		ok: false,
		code: PLUGIN_INSTALL_ERROR_CODE.UNSUPPORTED_PLAIN_FILE_PLUGIN,
		error: "Plain file plugin installs are not supported. Install a plugin directory or archive that contains openclaw.plugin.json, or list standalone plugin files in plugins.load.paths."
	};
}
//#endregion
export { installPluginFromInstalledPackageDir as a, installPluginFromNpmPackArchive as i, installPluginFromPath as n, installPluginFromNpmSpec as r, installPluginFromArchive as t };
