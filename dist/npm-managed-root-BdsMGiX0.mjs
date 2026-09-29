import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-Cur9Uhkp.mjs";
import { c as isRecord, s as filterStringRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import "./utils-aKqR_F_U.mjs";
import { n as isNotFoundPathError } from "./path-guards-D5kuI0Tv.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { i as resolvePackageExtensionEntries } from "./package-manifest-C8sTeZKW.mjs";
import "./errors-DnjwnOju.mjs";
import { c as emitTrustedSecurityEvent } from "./diagnostic-events-CVabF32H.mjs";
import "./manifest-DHkEL08H.mjs";
import { r as replaceFileAtomicSync } from "./replace-file-DJtj9VLX.mjs";
import { c as readJsonIfExists, h as writeJson, i as readJson, t as JsonFileReadError } from "./json-files-C0HSMh2Z.mjs";
import { l as validateRegistryNpmSpec, o as parseRegistryNpmSpec } from "./npm-registry-spec-CjcsDXUg.mjs";
import { a as resolveDefaultPluginExtensionsDir, f as resolvePluginNpmProjectDir, l as resolvePluginNpmGenerationProjectDir, u as resolvePluginNpmGenerationProjectDirPrefix } from "./install-paths-DnOgVB7K.mjs";
import { n as satisfiesPluginApiRange, t as resolvePackagePluginApiRange } from "./package-compat-CurpuyOg.mjs";
import { l as listNpmPackageDirs } from "./plugin-peer-link-C9fwm_tB.mjs";
import { r as hasRetainedManagedNpmInstallMarker } from "./managed-npm-retention-dDTeoxiW.mjs";
import { t as PLUGIN_INSTALL_ERROR_CODE } from "./install-types-auyGAGw8.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import "./npm-install-env-D6spEEnI.mjs";
import { u as resolveInstallWorkTimeoutMs } from "./install-source-utils-CeCvRCDR.mjs";
import { a as resolvePackageDirInstallTransaction, i as requestDeferredPackageDirInstall, o as createSafeNpmInstallArgs, s as createSafeNpmInstallEnv } from "./install-package-dir-DZA6fMda.mjs";
import { constants } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import os from "node:os";
import { randomUUID } from "node:crypto";
import { parse as parse$1 } from "yaml";
//#region src/plugins/install-transaction.ts
const PLUGIN_INSTALL_TRANSACTION = Symbol.for("openclaw.pluginInstallTransaction");
const PLUGIN_INSTALL_TRANSACTION_REQUEST = Symbol.for("openclaw.pluginInstallTransactionRequest");
const PLUGIN_INSTALL_OWNER_MIGRATIONS = Symbol.for("openclaw.pluginInstallOwnerMigrations");
const settlements = /* @__PURE__ */ new WeakMap();
function attachPluginInstallTransaction(result, transaction) {
	Object.defineProperty(result, PLUGIN_INSTALL_TRANSACTION, {
		configurable: true,
		enumerable: true,
		value: transaction
	});
	return result;
}
function resolvePluginInstallTransaction(result) {
	return result[PLUGIN_INSTALL_TRANSACTION];
}
function takePluginInstallTransaction(result) {
	const transaction = resolvePluginInstallTransaction(result);
	Reflect.deleteProperty(result, PLUGIN_INSTALL_TRANSACTION);
	return transaction;
}
function requestDeferredPluginInstall(params, transactionSink, assertOwned) {
	Object.defineProperty(params, PLUGIN_INSTALL_TRANSACTION_REQUEST, {
		configurable: false,
		enumerable: true,
		value: {
			deferCommit: true,
			...transactionSink ? { transactionSink } : {},
			...assertOwned ? { assertOwned } : {}
		}
	});
	return params;
}
function copyPluginInstallTransactionRequest(source, target) {
	const request = resolvePluginInstallTransactionRequest(source);
	return request ? requestDeferredPluginInstall(target, request.transactionSink, request.assertOwned) : target;
}
function resolvePluginInstallTransactionRequest(params) {
	return params[PLUGIN_INSTALL_TRANSACTION_REQUEST];
}
/** Keep direct and deferred installs bound to the owner that admitted them. */
async function withPluginInstallTransactions(params, assertOwned, run) {
	const request = resolvePluginInstallTransactionRequest(params);
	const initiatingAssert = request?.assertOwned;
	const callerBeforePersistentEffect = params.beforePersistentEffect;
	const transactions = [];
	let refusal;
	const assertCurrent = () => {
		if (refusal) throw refusal.error;
		try {
			initiatingAssert?.();
			assertOwned();
		} catch (error) {
			refusal = { error };
			throw error;
		}
	};
	assertCurrent();
	const beforePersistentEffect = () => {
		try {
			assertCurrent();
			return (callerBeforePersistentEffect?.())?.then(assertCurrent, (error) => {
				refusal ??= { error };
				throw refusal.error;
			});
		} catch (error) {
			refusal ??= { error };
			throw refusal.error;
		}
	};
	const owned = requestDeferredPluginInstall({
		...params,
		beforePersistentEffect
	}, request ? request.transactionSink : transactions, assertCurrent);
	let result;
	try {
		result = await run(owned, assertCurrent);
		assertCurrent();
	} catch (error) {
		if (!request && !refusal) try {
			await settlePluginInstallTransactions(transactions, "rollback");
		} catch (rollbackError) {
			if (!refusal) throw new AggregateError([error, rollbackError], "Plugin install recovery failed", { cause: rollbackError });
		}
		throw refusal ? refusal.error : error;
	}
	if (!request) try {
		await settlePluginInstallTransactions(transactions, "commit");
	} catch (error) {
		throw refusal ? refusal.error : error;
	}
	return result;
}
function retainPluginInstallTransaction(params, result) {
	const transaction = resolvePluginInstallTransaction(result);
	if (transaction) resolvePluginInstallTransactionRequest(params)?.transactionSink?.push(transaction);
}
function attachPluginInstallOwnerMigrations(result, migrations) {
	Object.defineProperty(result, PLUGIN_INSTALL_OWNER_MIGRATIONS, {
		configurable: false,
		enumerable: true,
		value: migrations
	});
	return result;
}
function resolvePluginInstallOwnerMigrations(result) {
	return result[PLUGIN_INSTALL_OWNER_MIGRATIONS];
}
async function settlePluginInstallTransactions(transactions, action, primaryFailure) {
	const ordered = action === "rollback" ? transactions.toReversed() : transactions;
	const errors = [];
	for (const transaction of new Set(ordered)) try {
		let settlement = settlements.get(transaction);
		if (!settlement) {
			settlement = Promise.resolve().then(() => transaction[action]()).catch((error) => {
				settlements.delete(transaction);
				throw error;
			});
			settlements.set(transaction, settlement);
		}
		await settlement;
	} catch (error) {
		errors.push(error);
	}
	if (errors.length > 0) {
		const message = `Plugin install transaction ${action} failed`;
		throw primaryFailure ? new AggregateError([primaryFailure.error, ...errors], `${String(primaryFailure.error)}; ${message}`, { cause: primaryFailure.error }) : new AggregateError(errors, message);
	}
}
//#endregion
//#region src/plugins/security-events.ts
function pluginLifecycleAction(mode) {
	return mode === "update" ? "plugin.updated" : "plugin.installed";
}
function pluginAuditOutcomeForReason(reason) {
	return reason === "security_scan_failed" ? "error" : "denied";
}
function emitPluginInstallSecurityEvent(params) {
	emitTrustedSecurityEvent({
		category: "plugin",
		action: pluginLifecycleAction(params.mode),
		outcome: "success",
		severity: "medium",
		actor: { kind: "operator" },
		target: {
			kind: "plugin",
			name: params.pluginId
		},
		policy: {
			id: "plugin.install",
			decision: "allow"
		},
		control: {
			id: "plugin.install",
			family: "supply_chain"
		},
		attributes: {
			source_family: params.sourceFamily,
			mode: params.mode,
			extension_count: params.extensionCount ?? 0,
			has_version: params.hasVersion ?? false,
			trusted_official_source: params.trustedSourceLinkedOfficialInstall === true
		}
	});
}
function emitPluginAuditSecurityEvent(params) {
	emitTrustedSecurityEvent({
		category: "plugin",
		action: "plugin.audit.failed",
		outcome: params.outcome,
		severity: params.outcome === "error" ? "high" : "medium",
		actor: { kind: "operator" },
		target: {
			kind: "plugin",
			...params.pluginId ? { name: params.pluginId } : {}
		},
		policy: {
			id: "plugin.install",
			decision: "deny",
			reason: params.reason
		},
		control: {
			id: "plugin.install.audit",
			family: "supply_chain"
		},
		reason: params.reason,
		attributes: {
			...params.sourceFamily ? { source_family: params.sourceFamily } : {},
			...params.mode ? { mode: params.mode } : {}
		}
	});
}
//#endregion
//#region src/plugins/install-shared.ts
const pluginInstallRuntimeLoader = createLazyImportLoader(() => import("./install.runtime.js"));
async function loadPluginInstallRuntime() {
	return await pluginInstallRuntimeLoader.load();
}
const defaultLogger = {};
function formatUnresolvedOpenClawPeerLinkError(packageName) {
	return `Installed plugin ${packageName} declares an openclaw dependency, but OpenClaw could not create a plugin-local node_modules/openclaw link. Run from a packaged OpenClaw install or reinstall OpenClaw, then retry.`;
}
const MISSING_EXTENSIONS_ERROR = "package.json missing openclaw.extensions; update the plugin package to include openclaw.extensions (for example [\"./dist/index.js\"]). See https://docs.openclaw.ai/help/troubleshooting#plugin-install-fails-with-missing-openclaw-extensions";
function validateOpenClawPackageCompatibility(params) {
	const pluginApiRangeCheck = resolvePackagePluginApiRange(params.packageMetadata);
	if (!pluginApiRangeCheck.ok) return {
		ok: false,
		error: `invalid package.json openclaw.compat.pluginApi: ${pluginApiRangeCheck.error}`,
		code: PLUGIN_INSTALL_ERROR_CODE.INVALID_PLUGIN_API
	};
	const pluginApiRange = pluginApiRangeCheck.range;
	if (pluginApiRange && !satisfiesPluginApiRange(params.currentHostVersion, pluginApiRange)) return {
		ok: false,
		error: `plugin "${params.pluginId}" requires plugin API ${pluginApiRange}, but this OpenClaw runtime exposes ${params.currentHostVersion}. Upgrade OpenClaw or install a compatible plugin version and retry.`,
		code: PLUGIN_INSTALL_ERROR_CODE.INCOMPATIBLE_PLUGIN_API
	};
	return null;
}
function validateOpenClawPackageInstallCompatibility(params) {
	const currentHostVersion = params.runtime.resolveCompatibilityHostVersion();
	const minHostVersionCheck = params.runtime.checkMinHostVersion({
		currentVersion: currentHostVersion,
		minHostVersion: params.packageMetadata?.install?.minHostVersion
	});
	if (!minHostVersionCheck.ok) {
		if (minHostVersionCheck.kind === "invalid") return {
			ok: false,
			error: `invalid package.json openclaw.install.minHostVersion: ${minHostVersionCheck.error}`,
			code: PLUGIN_INSTALL_ERROR_CODE.INVALID_MIN_HOST_VERSION
		};
		if (minHostVersionCheck.kind === "unknown_host_version") return {
			ok: false,
			error: `plugin "${params.pluginId}" requires OpenClaw >=${minHostVersionCheck.requirement.minimumLabel}, but this host version could not be determined. Re-run from a released build or set OPENCLAW_VERSION and retry.`,
			code: PLUGIN_INSTALL_ERROR_CODE.UNKNOWN_HOST_VERSION
		};
		return {
			ok: false,
			error: `plugin "${params.pluginId}" requires OpenClaw >=${minHostVersionCheck.requirement.minimumLabel}, but this host is ${minHostVersionCheck.currentVersion}. Upgrade OpenClaw and retry.`,
			code: PLUGIN_INSTALL_ERROR_CODE.INCOMPATIBLE_HOST_VERSION
		};
	}
	return validateOpenClawPackageCompatibility({
		pluginId: params.pluginId,
		currentHostVersion,
		packageMetadata: params.packageMetadata
	});
}
async function readOptionalPackageManifest(params) {
	const manifestPath = path.join(params.packageDir, "package.json");
	if (!await params.runtime.fileExists(manifestPath)) return { ok: true };
	try {
		return {
			ok: true,
			manifest: await params.runtime.readJsonFile(manifestPath)
		};
	} catch (err) {
		return {
			ok: false,
			error: `invalid package.json: ${String(err)}`
		};
	}
}
function ensureOpenClawExtensions(params) {
	const resolved = resolvePackageExtensionEntries(params.manifest);
	if (resolved.status === "missing") return {
		ok: false,
		error: MISSING_EXTENSIONS_ERROR,
		code: PLUGIN_INSTALL_ERROR_CODE.MISSING_OPENCLAW_EXTENSIONS
	};
	if (resolved.status === "empty") return {
		ok: false,
		error: "package.json openclaw.extensions is empty",
		code: PLUGIN_INSTALL_ERROR_CODE.EMPTY_OPENCLAW_EXTENSIONS
	};
	if (resolved.status === "invalid") return {
		ok: false,
		error: resolved.error,
		code: PLUGIN_INSTALL_ERROR_CODE.INVALID_OPENCLAW_EXTENSIONS
	};
	return {
		ok: true,
		entries: resolved.entries
	};
}
function buildDirectoryInstallResult(params) {
	return {
		ok: true,
		pluginId: params.pluginId,
		targetDir: params.targetDir,
		manifestName: params.manifestName,
		version: params.version,
		extensions: params.extensions,
		...params.setup ? { setup: params.setup } : {}
	};
}
function emitSuccessfulPluginInstallSecurityEvent(result, params) {
	if (params.dryRun || !result.ok) return;
	emitPluginInstallSecurityEvent({
		pluginId: result.pluginId,
		mode: params.mode,
		sourceFamily: params.sourceFamily,
		extensionCount: result.extensions.length,
		hasVersion: Boolean(result.version),
		trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall
	});
}
function buildBlockedInstallResult(params) {
	return {
		ok: false,
		error: params.blocked.reason,
		...params.blocked.installPolicyWarning ? { installPolicyWarning: params.blocked.installPolicyWarning } : {},
		...params.blocked.code === "security_scan_failed" ? { code: PLUGIN_INSTALL_ERROR_CODE.SECURITY_SCAN_FAILED } : params.blocked.code === "security_scan_blocked" ? { code: PLUGIN_INSTALL_ERROR_CODE.SECURITY_SCAN_BLOCKED } : {}
	};
}
function sourceFamilyForInstallPolicyKind(kind, fallback) {
	switch (kind) {
		case "plugin-archive": return "archive";
		case "plugin-dir": return "directory";
		case "plugin-git": return "git";
		case "plugin-npm": return "npm";
		case void 0: return fallback;
	}
	return fallback;
}
function sourceFamilyForInstallPolicySource(source, fallback) {
	switch (source?.kind) {
		case "archive": return "archive";
		case "file": return "file";
		case "git": return "git";
		case "npm": return "npm";
		case "bundled":
		case "clawhub":
		case "local-path":
		case "managed":
		case "upload":
		case "workspace":
		case void 0: return fallback;
	}
	return fallback;
}
async function ensureInstallTargetAvailableForMode(params) {
	return await params.runtime.ensureInstallTargetAvailable({
		mode: params.mode,
		targetDir: params.targetPath,
		alreadyExistsError: `plugin already exists: ${params.targetPath} (delete it first)`
	});
}
async function resolvePreparedDirectoryInstallTarget(params) {
	const targetDirResult = await resolvePluginInstallTarget({
		runtime: params.runtime,
		pluginId: params.pluginId,
		extensionsDir: params.extensionsDir,
		nameEncoder: params.nameEncoder
	});
	if (!targetDirResult.ok) return targetDirResult;
	return {
		ok: true,
		target: {
			targetPath: targetDirResult.targetDir,
			effectiveMode: await resolveEffectiveInstallMode({
				runtime: params.runtime,
				requestedMode: params.requestedMode,
				targetPath: targetDirResult.targetDir
			})
		}
	};
}
async function runInstallSourceScan(params) {
	try {
		const scanResult = await params.scan();
		if (scanResult?.blocked) {
			const reason = scanResult.blocked.code === "security_scan_failed" ? "security_scan_failed" : "security_scan_blocked";
			emitPluginAuditSecurityEvent({
				outcome: pluginAuditOutcomeForReason(reason),
				reason,
				pluginId: params.pluginId,
				mode: params.mode,
				sourceFamily: params.sourceFamily
			});
			return buildBlockedInstallResult({ blocked: scanResult.blocked });
		}
		return null;
	} catch (err) {
		emitPluginAuditSecurityEvent({
			outcome: "error",
			reason: "security_scan_failed",
			pluginId: params.pluginId,
			mode: params.mode,
			sourceFamily: params.sourceFamily
		});
		return {
			ok: false,
			error: `${params.subject} installation blocked: code safety scan failed (${String(err)}). Run "openclaw security audit --deep" for details.`,
			code: PLUGIN_INSTALL_ERROR_CODE.SECURITY_SCAN_FAILED
		};
	}
}
async function installPluginDirectoryIntoExtensions(params) {
	const runtime = await loadPluginInstallRuntime();
	let targetDir = params.targetDir;
	if (!targetDir) {
		const targetDirResult = await resolvePluginInstallTarget({
			runtime,
			pluginId: params.pluginId,
			extensionsDir: params.extensionsDir,
			nameEncoder: params.nameEncoder
		});
		if (!targetDirResult.ok) return {
			ok: false,
			error: targetDirResult.error
		};
		targetDir = targetDirResult.targetDir;
	}
	const availability = await ensureInstallTargetAvailableForMode({
		runtime,
		targetPath: targetDir,
		mode: params.mode
	});
	if (!availability.ok) return availability;
	if (params.dryRun) return buildDirectoryInstallResult({
		pluginId: params.pluginId,
		targetDir,
		manifestName: params.manifestName,
		version: params.version,
		extensions: params.extensions,
		setup: params.setup
	});
	let artifactConsentFailure;
	const packageInstallParams = {
		sourceDir: params.sourceDir,
		targetDir,
		mode: params.mode,
		timeoutMs: params.timeoutMs,
		workTimeoutMs: params.workTimeoutMs,
		logger: params.logger,
		copyErrorPrefix: params.copyErrorPrefix,
		hasDeps: params.hasDeps,
		omitOpenClawHostDependency: true,
		sourceHardlinks: params.sourceHardlinks ?? "reject",
		depsLogMessage: params.depsLogMessage,
		afterCopy: params.afterCopy,
		beforePersistentApply: params.beforePersistentApply,
		afterInstall: async (installedDir) => {
			const postInstallResult = await params.afterInstall?.(installedDir);
			if (postInstallResult) return postInstallResult;
			try {
				await params.onBeforePluginArtifactCommit?.({
					pluginId: params.pluginId,
					...params.mode === "update" ? { currentArtifactDir: targetDir } : {},
					stagedArtifactDir: installedDir,
					mode: params.mode
				});
			} catch (error) {
				artifactConsentFailure = { error };
				throw error;
			}
			return { ok: true };
		}
	};
	const transactionRequest = resolvePluginInstallTransactionRequest(params);
	const installRes = await runtime.installPackageDir(transactionRequest ? requestDeferredPackageDirInstall(packageInstallParams, transactionRequest.assertOwned) : packageInstallParams);
	if (!installRes.ok) {
		if (artifactConsentFailure) throw artifactConsentFailure.error;
		return installRes;
	}
	const result = { ...buildDirectoryInstallResult({
		pluginId: params.pluginId,
		targetDir,
		manifestName: params.manifestName,
		version: params.version,
		extensions: params.extensions,
		setup: params.setup
	}) };
	const transaction = resolvePackageDirInstallTransaction(installRes);
	return transaction ? attachPluginInstallTransaction(result, transaction) : result;
}
async function resolvePluginInstallTarget(params) {
	const extensionsDir = params.extensionsDir ? resolveUserPath(params.extensionsDir) : resolveDefaultPluginExtensionsDir();
	return await params.runtime.resolveCanonicalInstallTarget({
		baseDir: extensionsDir,
		id: params.pluginId,
		invalidNameMessage: "invalid plugin name: path traversal detected",
		boundaryLabel: "extensions directory",
		nameEncoder: params.nameEncoder
	});
}
async function resolveEffectiveInstallMode(params) {
	if (params.requestedMode !== "update") return "install";
	return await params.runtime.fileExists(params.targetPath) ? "update" : "install";
}
//#endregion
//#region src/plugins/install-managed-npm-state.ts
const MANAGED_NPM_PROJECT_QUARANTINE_DIR = "_openclaw-quarantined-npm-projects";
const MANAGED_NPM_PROJECT_REBUILD_ARTIFACTS = [
	"node_modules",
	"package-lock.json",
	"npm-shrinkwrap.json"
];
/** Preserve npm project policy and relative archive inputs without copying its installed tree. */
async function copyManagedNpmProjectInputs(params) {
	for (const name of [
		"package.json",
		"package-lock.json",
		"npm-shrinkwrap.json",
		".npmrc",
		"_openclaw-pack-archives"
	]) try {
		await fs$1.cp(path.join(params.npmRoot, name), path.join(params.stageDir, name), {
			recursive: true,
			dereference: true
		});
	} catch (error) {
		if (error.code !== "ENOENT") throw error;
	}
}
function isNpmAliasOverrideCompatibilityError(result) {
	return `${result.stderr}\n${result.stdout}`.includes("Invalid comparator: npm:");
}
async function resolveManagedNpmRootDependencySpecForInstall(params) {
	if (params.prepareDependencySpec) try {
		return await params.prepareDependencySpec({ npmRoot: params.npmRoot });
	} catch (error) {
		return {
			ok: false,
			error: `Failed to prepare managed npm dependency for ${params.packageName}: ${String(error)}`
		};
	}
	if (params.dependencySpec === void 0) return {
		ok: false,
		error: `missing managed npm dependency spec for ${params.packageName}`
	};
	return {
		ok: true,
		dependencySpec: params.dependencySpec
	};
}
function isManagedNpmProjectCorruptionInstallFailure(result) {
	const output = `${result.stderr}\n${result.stdout}`;
	return output.includes("ERR_INVALID_ARG_TYPE") && output.includes("\"from\" argument") && output.includes("Received undefined");
}
function formatManagedNpmProjectQuarantineArtifacts(artifactNames) {
	return artifactNames.length > 0 ? artifactNames.join(", ") : "no rebuild artifacts";
}
async function quarantineManagedNpmProjectRebuildArtifacts(params) {
	await fs$1.mkdir(params.npmRoot, { recursive: true });
	const quarantineParent = path.join(path.dirname(params.npmRoot), MANAGED_NPM_PROJECT_QUARANTINE_DIR);
	await fs$1.mkdir(quarantineParent, { recursive: true });
	const quarantineDir = await fs$1.mkdtemp(path.join(quarantineParent, "corrupt-"));
	const movedArtifactNames = [];
	for (const artifactName of MANAGED_NPM_PROJECT_REBUILD_ARTIFACTS) {
		const source = path.join(params.npmRoot, artifactName);
		try {
			await fs$1.rename(source, path.join(quarantineDir, artifactName));
			movedArtifactNames.push(artifactName);
		} catch (error) {
			if (error.code !== "ENOENT") throw error;
		}
	}
	return {
		quarantineDir,
		movedArtifactNames
	};
}
async function listManagedNpmRootPackageNames(npmRoot) {
	const packageDirs = await listNpmPackageDirs(npmRoot, {
		sortEntries: true,
		includeEntry: (entry, scoped) => (scoped || entry.name !== ".bin" && entry.name !== "openclaw") && (!scoped && entry.name.startsWith("@") || entry.isDirectory() || entry.isSymbolicLink())
	});
	return new Set(packageDirs.map((dir) => path.relative(path.join(npmRoot, "node_modules"), dir).split(path.sep).join("/")));
}
function resolveManagedNpmRootPackageDir(npmRoot, packageName) {
	return path.join(npmRoot, "node_modules", ...packageName.split("/"));
}
function resolveManagedNpmRootGenerationKey(params) {
	return [
		params.npmResolution.name ?? params.packageName,
		params.npmResolution.version ?? "",
		params.npmResolution.resolvedSpec ?? "",
		params.npmResolution.integrity ?? "",
		params.npmResolution.shasum ?? ""
	].join("\n");
}
function resolveManagedNpmRootForInstall(params) {
	if (!params.useGeneration) return resolvePluginNpmProjectDir({
		npmDir: params.npmBaseDir,
		packageName: params.packageName
	});
	return resolvePluginNpmGenerationProjectDir({
		npmDir: params.npmBaseDir,
		packageName: params.packageName,
		generationKey: resolveManagedNpmRootGenerationKey({
			packageName: params.packageName,
			npmResolution: params.npmResolution
		})
	});
}
function resolveManagedNpmInstallRoot(params) {
	const generationKey = resolveManagedNpmRootGenerationKey({
		packageName: params.packageName,
		npmResolution: params.npmResolution
	});
	const npmRoot = resolveManagedNpmRootForInstall(params);
	const installRoot = resolveManagedNpmRootPackageDir(npmRoot, params.packageName);
	if (!hasRetainedManagedNpmInstallMarker(installRoot)) return npmRoot;
	return resolvePluginNpmGenerationProjectDir({
		npmDir: params.npmBaseDir,
		packageName: params.packageName,
		generationKey: `${generationKey}\nactivation\n${randomUUID()}`
	});
}
async function listManagedNpmPackageDirsForPackage(params) {
	const packageDirs = [];
	const legacyProjectRoot = resolvePluginNpmProjectDir({
		npmDir: params.npmBaseDir,
		packageName: params.packageName
	});
	const legacyPackageDir = resolveManagedNpmRootPackageDir(legacyProjectRoot, params.packageName);
	if (await params.runtime.fileExists(legacyPackageDir)) packageDirs.push(legacyPackageDir);
	const projectsDir = path.dirname(legacyProjectRoot);
	const generationPrefix = resolvePluginNpmGenerationProjectDirPrefix(params.packageName);
	let entries;
	try {
		entries = await fs$1.readdir(projectsDir, { withFileTypes: true });
	} catch (error) {
		if (isNotFoundPathError(error)) return packageDirs;
		throw error;
	}
	for (const entry of entries) {
		if (!entry.isDirectory() || !entry.name.startsWith(generationPrefix)) continue;
		const packageDir = resolveManagedNpmRootPackageDir(path.join(projectsDir, entry.name), params.packageName);
		if (await params.runtime.fileExists(packageDir)) packageDirs.push(packageDir);
	}
	return packageDirs;
}
async function resolveManagedNpmGenerationUseForInstall(params) {
	const packageDirs = await listManagedNpmPackageDirsForPackage({
		runtime: params.runtime,
		npmBaseDir: params.npmBaseDir,
		packageName: params.packageName
	});
	const hasNonRetainedPackageDir = packageDirs.some((packageDir) => !hasRetainedManagedNpmInstallMarker(packageDir));
	if (packageDirs.length > 0 && !hasNonRetainedPackageDir) return "retained-install";
	const generationUse = params.requestedMode === "update" && hasNonRetainedPackageDir ? "update" : "none";
	if (params.npmResolution) {
		const candidatePackageDir = resolveManagedNpmRootPackageDir(resolveManagedNpmRootForInstall({
			npmBaseDir: params.npmBaseDir,
			packageName: params.packageName,
			npmResolution: params.npmResolution,
			useGeneration: generationUse !== "none"
		}), params.packageName);
		if (hasRetainedManagedNpmInstallMarker(candidatePackageDir)) return "retained-install";
	}
	return generationUse;
}
async function resolveManagedNpmInstallPlan(params) {
	const generationUse = await resolveManagedNpmGenerationUseForInstall(params);
	const npmRoot = resolveManagedNpmInstallRoot({
		...params,
		useGeneration: generationUse !== "none"
	});
	const installRoot = resolveManagedNpmRootPackageDir(npmRoot, params.packageName);
	const targetMode = generationUse === "retained-install" && hasRetainedManagedNpmInstallMarker(installRoot) ? "update" : await resolveEffectiveInstallMode({
		runtime: params.runtime,
		requestedMode: params.requestedMode,
		targetPath: installRoot
	});
	return {
		npmRoot,
		installRoot,
		targetMode,
		policyMode: generationUse === "update" ? "update" : generationUse === "retained-install" ? "install" : targetMode
	};
}
function resolveRequiredPlatformPackageNames(packageMetadata) {
	const raw = packageMetadata?.install?.requiredPlatformPackages;
	if (raw === void 0) return {
		ok: true,
		packageNames: []
	};
	if (!Array.isArray(raw)) return {
		ok: false,
		error: "package.json openclaw.install.requiredPlatformPackages must be an array"
	};
	const packageNames = /* @__PURE__ */ new Set();
	for (const value of raw) {
		if (typeof value !== "string") return {
			ok: false,
			error: "package.json openclaw.install.requiredPlatformPackages must contain only npm package names"
		};
		const specError = validateRegistryNpmSpec(value);
		const parsed = parseRegistryNpmSpec(value);
		if (specError || !parsed || parsed.selectorKind !== "none") return {
			ok: false,
			error: `package.json openclaw.install.requiredPlatformPackages contains invalid package name: ${value}`
		};
		packageNames.add(parsed.name);
	}
	return {
		ok: true,
		packageNames: [...packageNames]
	};
}
//#endregion
//#region src/infra/npm-managed-peer-plan.ts
function createManagedNpmPeerPlanArgs(params) {
	return [
		"npm",
		"install",
		"--package-lock-only",
		...params?.force ? ["--force"] : [],
		...createSafeNpmInstallArgs({
			omitDev: true,
			omitPeer: true,
			legacyPeerDeps: params?.legacyPeerDeps,
			loglevel: "error",
			ignoreWorkspaces: true,
			noAudit: true,
			noFund: true
		}).slice(1)
	];
}
//#endregion
//#region src/infra/npm-managed-root.ts
function readDependencyRecord(value) {
	return filterStringRecord(value) ?? {};
}
function isSafePackageName(name) {
	if (name.startsWith("@")) {
		const parts = name.split("/");
		return parts.length === 2 && parts.every((part) => part.length > 0 && part !== "." && part !== "..");
	}
	return name.length > 0 && !name.includes("/") && !name.includes("\\") && name !== "." && name !== "..";
}
function isManagedNpmRootHostPeerPackageName(name) {
	return name === "openclaw";
}
function readOverrideRecord(value) {
	if (!isRecord(value)) return {};
	const overrides = {};
	for (const [key, raw] of Object.entries(value)) if (key.trim()) overrides[key] = raw;
	return overrides;
}
function readManagedOverrideKeys(value) {
	if (!isRecord(value) || !Array.isArray(value.managedOverrides)) return [];
	return value.managedOverrides.filter((key) => typeof key === "string");
}
function readManagedPeerDependencyKeys(value) {
	if (!isRecord(value) || !Array.isArray(value.managedPeerDependencies)) return [];
	return value.managedPeerDependencies.filter((key) => typeof key === "string");
}
function buildManagedOpenClawMetadata(params) {
	const metadata = isRecord(params.current) ? { ...params.current } : {};
	if (params.managedOverrideKeys.length > 0) metadata.managedOverrides = params.managedOverrideKeys;
	else delete metadata.managedOverrides;
	const managedPeerDependencyKeys = params.managedPeerDependencyKeys;
	if (managedPeerDependencyKeys && managedPeerDependencyKeys.length > 0) metadata.managedPeerDependencies = managedPeerDependencyKeys;
	else if (managedPeerDependencyKeys) delete metadata.managedPeerDependencies;
	return Object.keys(metadata).length > 0 ? metadata : void 0;
}
async function readManagedNpmRootManifest(filePath) {
	const parsed = await readJsonIfExists(filePath);
	return isRecord(parsed) ? { ...parsed } : {};
}
async function readHostWorkspaceOverrides(packageRoot) {
	const workspace = parse$1(await fs$1.readFile(path.join(packageRoot, "pnpm-workspace.yaml"), "utf8"));
	return isRecord(workspace) ? readOverrideRecord(workspace.overrides) : {};
}
function readHostDependencySpec(manifest, packageName) {
	return manifest.dependencies?.[packageName] ?? manifest.optionalDependencies?.[packageName] ?? manifest.peerDependencies?.[packageName] ?? manifest.devDependencies?.[packageName];
}
function resolveHostOverrideReferences(value, manifest) {
	if (typeof value === "string" && value.startsWith("$")) return readHostDependencySpec(manifest, value.slice(1)) ?? value;
	if (!isRecord(value)) return value;
	const resolved = {};
	for (const [key, nested] of Object.entries(value)) resolved[key] = resolveHostOverrideReferences(nested, manifest);
	return resolved;
}
function isUnsupportedManagedNpmOverride(value) {
	return typeof value === "string" && value.trim().startsWith("npm:");
}
function isPnpmParentChildOverrideSelector(key) {
	return /[^ |@]>/u.test(key);
}
function filterUnsupportedManagedNpmRootOverrides(value, omitNpmAliases = false) {
	const overrides = readOverrideRecord(value);
	const filtered = {};
	for (const [key, raw] of Object.entries(overrides)) {
		if (isPnpmParentChildOverrideSelector(key) || omitNpmAliases && isUnsupportedManagedNpmOverride(raw)) continue;
		if (isRecord(raw)) {
			const nested = filterUnsupportedManagedNpmRootOverrides(raw, omitNpmAliases);
			if (Object.keys(nested).length > 0) filtered[key] = nested;
			continue;
		}
		filtered[key] = raw;
	}
	return filtered;
}
function readRootOverrideSpec(value) {
	if (typeof value === "string") return value;
	if (isRecord(value) && typeof value["."] === "string") return value["."];
}
/**
* npm rejects manifests where an override changes the effective spec of a root direct
* dependency (Arborist EOVERRIDE), which bricks every later install in the managed root.
* Managed peer pins follow the override; for owned root deps the managed override yields.
*/
function reconcileManagedNpmRootOverrideConflicts(params) {
	for (const [packageName, overrideValue] of Object.entries(params.overrides)) {
		const dependencySpec = params.dependencies[packageName];
		if (dependencySpec === void 0) continue;
		const overrideSpec = readRootOverrideSpec(overrideValue);
		if (overrideSpec === void 0 || overrideSpec === "*" || overrideSpec.startsWith("$") || overrideSpec === dependencySpec) continue;
		if (params.managedDependencyNames.has(packageName)) {
			params.dependencies[packageName] = overrideSpec;
			continue;
		}
		if (!params.managedOverrideNames.has(packageName)) continue;
		if (isRecord(overrideValue)) {
			const trimmed = { ...overrideValue };
			delete trimmed["."];
			if (Object.keys(trimmed).length > 0) {
				params.overrides[packageName] = trimmed;
				continue;
			}
		}
		delete params.overrides[packageName];
	}
}
/** Merge managed overrides into a managed root manifest's override record and keep the
* EOVERRIDE invariant plus metadata (keys actually written) consistent in one place. */
function applyManagedNpmRootOverrides(params) {
	const overrides = readOverrideRecord(params.manifest.overrides);
	for (const key of readManagedOverrideKeys(params.manifest.openclaw)) delete overrides[key];
	Object.assign(overrides, params.managedOverrides);
	reconcileManagedNpmRootOverrideConflicts({
		dependencies: params.dependencies,
		overrides,
		managedDependencyNames: params.managedDependencyNames,
		managedOverrideNames: new Set(Object.keys(params.managedOverrides))
	});
	return {
		overrides,
		managedOverrideKeys: Object.keys(params.managedOverrides).filter((key) => Object.hasOwn(overrides, key)).toSorted()
	};
}
/** Read host OpenClaw pnpm overrides for reuse inside a managed npm root. */
async function readOpenClawManagedNpmRootOverrides(params) {
	const packageRoot = params?.packageRoot ?? resolveOpenClawPackageRootSync({
		argv1: params?.argv1 ?? process.argv[1],
		moduleUrl: params?.moduleUrl ?? import.meta.url,
		cwd: params?.cwd ?? process.cwd()
	});
	if (!packageRoot) return {};
	try {
		const manifest = JSON.parse(await fs$1.readFile(path.join(packageRoot, "package.json"), "utf8"));
		if (!isRecord(manifest)) return {};
		const hostManifest = manifest;
		const overrides = filterUnsupportedManagedNpmRootOverrides(await readHostWorkspaceOverrides(packageRoot));
		return Object.fromEntries(Object.entries(overrides).map(([key, value]) => [key, resolveHostOverrideReferences(value, hostManifest)]));
	} catch {
		return {};
	}
}
/** Resolve the dependency spec to write for a parsed registry package. */
function resolveManagedNpmRootDependencySpec(params) {
	return params.resolution.version ?? params.parsedSpec.selector ?? "latest";
}
/** Insert or update a dependency and managed override metadata in package.json. */
async function upsertManagedNpmRootDependency(params) {
	await fs$1.mkdir(params.npmRoot, { recursive: true });
	const manifestPath = path.join(params.npmRoot, "package.json");
	const manifest = await readManagedNpmRootManifest(manifestPath);
	const dependencies = readDependencyRecord(manifest.dependencies);
	const managedOverrides = filterUnsupportedManagedNpmRootOverrides(params.managedOverrides, params.omitNpmAliasOverrides);
	const nextDependencies = {
		...dependencies,
		[params.packageName]: params.dependencySpec
	};
	const managedDependencyNames = new Set(readManagedPeerDependencyKeys(manifest.openclaw));
	managedDependencyNames.delete(params.packageName);
	const { overrides, managedOverrideKeys } = applyManagedNpmRootOverrides({
		manifest,
		managedOverrides,
		dependencies: nextDependencies,
		managedDependencyNames
	});
	const openclawMetadata = buildManagedOpenClawMetadata({
		current: manifest.openclaw,
		managedOverrideKeys,
		managedPeerDependencyKeys: [...managedDependencyNames].toSorted()
	});
	const next = {
		...manifest,
		private: true,
		dependencies: nextDependencies
	};
	if (Object.keys(overrides).length > 0) next.overrides = overrides;
	else delete next.overrides;
	if (openclawMetadata) next.openclaw = openclawMetadata;
	else delete next.openclaw;
	await writeJson(manifestPath, next, { trailingNewline: true });
}
function isOptionalPeerDependency(manifest, peerName) {
	if (!isRecord(manifest.peerDependenciesMeta)) return false;
	const peerMetadata = manifest.peerDependenciesMeta[peerName];
	return isRecord(peerMetadata) && peerMetadata.optional === true;
}
function isDevOnlyLockPackage(value) {
	return isRecord(value) && value.dev === true;
}
function readStringList(value) {
	if (typeof value === "string") return [value];
	if (!Array.isArray(value)) return;
	const values = value.filter((entry) => typeof entry === "string");
	return values.length > 0 ? values : void 0;
}
function matchesNpmPlatformList(value, list) {
	if (!list) return true;
	if (list.length === 1 && list[0] === "any") return true;
	if (!value) return false;
	let negated = 0;
	let matched = false;
	for (const entry of list) {
		const negate = entry.startsWith("!");
		const test = negate ? entry.slice(1) : entry;
		if (negate) {
			negated += 1;
			if (value === test) return false;
		} else matched = matched || value === test;
	}
	return matched || negated === list.length;
}
function resolveCurrentLibc() {
	if (process.platform !== "linux") return;
	const report = process.report?.getReport();
	const header = isRecord(report) ? report.header : void 0;
	if (isRecord(header) && header.glibcVersionRuntime) return "glibc";
	const sharedObjects = isRecord(report) ? report.sharedObjects : void 0;
	if (Array.isArray(sharedObjects) && sharedObjects.some((file) => typeof file === "string" && file.includes("musl"))) return "musl";
}
function isUnsupportedOptionalLockPackage(value) {
	if (!isRecord(value) || value.optional !== true) return false;
	return !matchesNpmPlatformList(process.platform, readStringList(value.os)) || !matchesNpmPlatformList(process.arch, readStringList(value.cpu)) || !matchesNpmPlatformList(resolveCurrentLibc(), readStringList(value.libc));
}
function hasNpmPlatformConstraint(value) {
	return value.os !== void 0 || value.cpu !== void 0 || value.libc !== void 0;
}
function readLockPackageLocationName(location) {
	const parts = location.split("/");
	for (let index = parts.length - 1; index >= 0; index -= 1) {
		if (parts[index] !== "node_modules") continue;
		const first = parts[index + 1];
		if (!first) return;
		if (!first.startsWith("@")) return first;
		const second = parts[index + 2];
		return second ? `${first}/${second}` : void 0;
	}
}
function readLockPackageName(location, value) {
	if (isRecord(value)) {
		const packageName = normalizeOptionalString(value.name);
		if (packageName) return packageName;
	}
	return readLockPackageLocationName(location);
}
function resolveManagedNpmLockPackagePath(params) {
	const npmRoot = path.resolve(params.npmRoot);
	const packagePath = path.resolve(npmRoot, ...params.location.split("/"));
	const relativePath = path.relative(npmRoot, packagePath);
	if (!relativePath || relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath)) return;
	return packagePath;
}
function isTopLevelLockPackageLocation(location) {
	return location.split("/").filter((part) => part === "node_modules").length === 1;
}
async function isRequiredPlatformPackageComplete(params) {
	let manifest;
	try {
		manifest = await readJsonIfExists(path.join(params.packagePath, "package.json"));
	} catch (error) {
		if (error instanceof JsonFileReadError && error.reason === "parse") return false;
		throw error;
	}
	if (!isRecord(manifest)) return false;
	const packageName = normalizeOptionalString(manifest.name);
	if (!packageName || !isSafePackageName(packageName)) return false;
	if (!Array.isArray(manifest.files) || !manifest.files.includes("vendor")) return true;
	const executableName = packageName.split("/").at(-1);
	const ownsNativeExecutable = Object.entries(params.lockPackages).some(([location, entry]) => readLockPackageLocationName(location) === packageName && isRecord(entry) && (typeof entry.bin === "string" || isRecord(entry.bin) && typeof entry.bin[executableName ?? ""] === "string"));
	if (!executableName || !ownsNativeExecutable) return true;
	let vendorEntries;
	try {
		vendorEntries = await fs$1.readdir(path.join(params.packagePath, "vendor"), { withFileTypes: true });
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return false;
		throw error;
	}
	const executableFilename = process.platform === "win32" ? `${executableName}.exe` : executableName;
	for (const target of vendorEntries) {
		if (!target.isDirectory()) continue;
		try {
			await fs$1.access(path.join(params.packagePath, "vendor", target.name, "bin", executableFilename), constants.X_OK);
			return true;
		} catch (error) {
			if (!hasErrnoCode(error, "ENOENT") && !hasErrnoCode(error, "EACCES")) throw error;
		}
	}
	return false;
}
/** Lists explicitly required current-platform packages that npm left missing or incomplete. */
async function listMissingRequiredPlatformPackages(params) {
	const requiredPackageNames = new Set(params.requiredPackageNames);
	if (requiredPackageNames.size === 0) return [];
	const lockPath = path.join(params.npmRoot, "package-lock.json");
	const parsed = await readJson(lockPath);
	if (!isRecord(parsed) || !isRecord(parsed.packages)) return [];
	const missing = [];
	for (const [location, value] of Object.entries(parsed.packages)) {
		if (!isRecord(value) || value.optional !== true || !hasNpmPlatformConstraint(value) || isUnsupportedOptionalLockPackage(value)) continue;
		const name = readLockPackageLocationName(location);
		const packagePath = resolveManagedNpmLockPackagePath({
			npmRoot: params.npmRoot,
			location
		});
		if (!name || !requiredPackageNames.has(name) || !isSafePackageName(name) || !packagePath) continue;
		if (!await isRequiredPlatformPackageComplete({
			packagePath,
			lockPackages: parsed.packages
		})) missing.push({
			name,
			packagePath
		});
	}
	return missing.toSorted((left, right) => left.packagePath.localeCompare(right.packagePath));
}
function findLockPackageVersion(params) {
	if (!isRecord(params.lockfile.packages)) return;
	const preferredLocation = `node_modules/${params.packageName}`;
	const preferredPackage = params.lockfile.packages[preferredLocation];
	if (isRecord(preferredPackage) && !isDevOnlyLockPackage(preferredPackage) && !isUnsupportedOptionalLockPackage(preferredPackage)) {
		const preferredVersion = normalizeOptionalString(preferredPackage.version);
		if (preferredVersion) return preferredVersion;
	}
}
function collectNpmLockPeerDependencyPins(params) {
	const pins = /* @__PURE__ */ new Map();
	const packages = isRecord(params.lockfile.packages) ? params.lockfile.packages : {};
	for (const [location, value] of Object.entries(packages).toSorted(([left], [right]) => left.localeCompare(right))) {
		if (location === "" || !isRecord(value) || isDevOnlyLockPackage(value) || isUnsupportedOptionalLockPackage(value)) continue;
		const packageName = readLockPackageName(location, value);
		if (packageName && isManagedNpmRootHostPeerPackageName(packageName)) continue;
		const peerDependencies = readDependencyRecord(value.peerDependencies);
		for (const [peerName, peerRange] of Object.entries(peerDependencies)) {
			if (isManagedNpmRootHostPeerPackageName(peerName) || pins.has(peerName) || !isSafePackageName(peerName)) continue;
			const version = findLockPackageVersion({
				lockfile: params.lockfile,
				packageName: peerName
			});
			if (!version && isOptionalPeerDependency(value, peerName)) continue;
			if (!version && !isTopLevelLockPackageLocation(location)) continue;
			pins.set(peerName, version ?? peerRange);
		}
	}
	return Object.fromEntries([...pins.entries()].toSorted(([left], [right]) => left.localeCompare(right)));
}
async function copyPathIfExists(source, destination) {
	try {
		await fs$1.cp(source, destination, { recursive: true });
	} catch (err) {
		if (err.code === "ENOENT") return;
		throw err;
	}
}
function scrubHostPeerFromLockPackage(value) {
	if (!isRecord(value)) return false;
	let changed = false;
	if (isRecord(value.peerDependencies) && "openclaw" in value.peerDependencies) {
		const peerDependencies = { ...value.peerDependencies };
		delete peerDependencies.openclaw;
		if (Object.keys(peerDependencies).length > 0) value.peerDependencies = peerDependencies;
		else delete value.peerDependencies;
		changed = true;
	}
	if (isRecord(value.peerDependenciesMeta) && "openclaw" in value.peerDependenciesMeta) {
		const peerDependenciesMeta = { ...value.peerDependenciesMeta };
		delete peerDependenciesMeta.openclaw;
		if (Object.keys(peerDependenciesMeta).length > 0) value.peerDependenciesMeta = peerDependenciesMeta;
		else delete value.peerDependenciesMeta;
		changed = true;
	}
	return changed;
}
async function scrubHostPeerFromTempPackageLock(lockPath) {
	const parsed = await readJsonIfExists(lockPath);
	if (!isRecord(parsed)) return;
	let changed = false;
	if (isRecord(parsed.packages)) for (const value of Object.values(parsed.packages)) changed = scrubHostPeerFromLockPackage(value) || changed;
	if (isRecord(parsed.dependencies)) for (const value of Object.values(parsed.dependencies)) changed = scrubHostPeerFromLockPackage(value) || changed;
	if (changed) await writeJson(lockPath, parsed, { trailingNewline: true });
}
function collectExistingManagedPeerDependencyPins(dependencies, previousManagedPeerDependencies) {
	const pins = {};
	for (const packageName of previousManagedPeerDependencies) {
		const dependencySpec = dependencies[packageName];
		if (dependencySpec) pins[packageName] = dependencySpec;
	}
	return pins;
}
function isHostPeerResolutionFailure(result) {
	const output = `${result.stdout}\n${result.stderr}`;
	return /(^|[^@\w.-])openclaw(?=$|[@\s:,"'])/i.test(output);
}
async function collectNpmResolvedManagedNpmRootPeerDependencyPins(params) {
	const manifest = params.manifest;
	const dependencies = readDependencyRecord(manifest.dependencies);
	const previousManagedPeerDependencies = readManagedPeerDependencyKeys(manifest.openclaw);
	const fallbackPeerPins = collectExistingManagedPeerDependencyPins(dependencies, previousManagedPeerDependencies);
	for (const packageName of previousManagedPeerDependencies) delete dependencies[packageName];
	const tempRoot = await fs$1.mkdtemp(path.join(os.tmpdir(), "openclaw-managed-peer-plan-"));
	try {
		delete dependencies.openclaw;
		await writeJson(path.join(tempRoot, "package.json"), {
			...manifest,
			private: true,
			dependencies
		}, { trailingNewline: true });
		await copyPathIfExists(path.join(params.npmRoot, "package-lock.json"), path.join(tempRoot, "package-lock.json"));
		const tempLockPath = path.join(tempRoot, "package-lock.json");
		await scrubHostPeerFromTempPackageLock(tempLockPath);
		await copyPathIfExists(path.join(params.npmRoot, ".npmrc"), path.join(tempRoot, ".npmrc"));
		await copyPathIfExists(path.join(params.npmRoot, "_openclaw-pack-archives"), path.join(tempRoot, "_openclaw-pack-archives"));
		const command = params.runCommand ?? runCommandWithTimeout;
		const npmPeerPlanArgs = createManagedNpmPeerPlanArgs({ force: true });
		const npmPlanOptions = {
			cwd: tempRoot,
			timeoutMs: resolveInstallWorkTimeoutMs(params.workTimeoutMs, params.timeoutMs ?? 3e5),
			signal: params.signal,
			killProcessTree: true,
			env: createSafeNpmInstallEnv(process.env, {
				legacyPeerDeps: false,
				npmConfigCwd: tempRoot,
				packageLock: true,
				quiet: true
			})
		};
		const result = await command(npmPeerPlanArgs, npmPlanOptions);
		if (result.code !== 0) {
			if (isHostPeerResolutionFailure(result)) {
				if ((await command(createManagedNpmPeerPlanArgs({
					force: true,
					legacyPeerDeps: true
				}), {
					...npmPlanOptions,
					env: createSafeNpmInstallEnv(process.env, {
						legacyPeerDeps: true,
						npmConfigCwd: tempRoot,
						packageLock: true,
						quiet: true
					})
				})).code === 0) return collectNpmLockPeerDependencyPins({ lockfile: await readManagedNpmRootManifest(tempLockPath) });
			}
			return fallbackPeerPins;
		}
		return collectNpmLockPeerDependencyPins({ lockfile: await readManagedNpmRootManifest(tempLockPath) });
	} finally {
		await fs$1.rm(tempRoot, {
			recursive: true,
			force: true
		});
	}
}
/** Sync package.json with peer dependency pins resolved from npm's lock plan. */
async function syncManagedNpmRootPeerDependencies(params) {
	const manifestPath = path.join(params.npmRoot, "package.json");
	const manifest = await readManagedNpmRootManifest(manifestPath);
	const dependencies = readDependencyRecord(manifest.dependencies);
	const previousManagedPeerDependencies = readManagedPeerDependencyKeys(manifest.openclaw);
	const previousManagedPeerDependencySet = new Set(previousManagedPeerDependencies);
	const managedOverrides = filterUnsupportedManagedNpmRootOverrides(params.managedOverrides, params.omitNpmAliasOverrides);
	const plannedOverrides = applyManagedNpmRootOverrides({
		manifest,
		managedOverrides,
		dependencies: { ...dependencies },
		managedDependencyNames: previousManagedPeerDependencySet
	}).overrides;
	const peerPins = await collectNpmResolvedManagedNpmRootPeerDependencyPins({
		npmRoot: params.npmRoot,
		manifest: {
			...manifest,
			overrides: plannedOverrides
		},
		runCommand: params.runCommand,
		timeoutMs: params.timeoutMs,
		workTimeoutMs: params.workTimeoutMs,
		signal: params.signal
	});
	const managedPeerDependencyNames = new Set(Object.keys(peerPins).filter((packageName) => previousManagedPeerDependencySet.has(packageName) || !Object.hasOwn(dependencies, packageName)));
	const nextDependencies = { ...dependencies };
	for (const packageName of previousManagedPeerDependencies) if (!Object.hasOwn(peerPins, packageName)) delete nextDependencies[packageName];
	for (const [packageName, dependencySpec] of Object.entries(peerPins)) if (managedPeerDependencyNames.has(packageName)) nextDependencies[packageName] = dependencySpec;
	const { overrides, managedOverrideKeys } = applyManagedNpmRootOverrides({
		manifest,
		managedOverrides,
		dependencies: nextDependencies,
		managedDependencyNames: managedPeerDependencyNames
	});
	const managedPeerDependencyKeys = [...managedPeerDependencyNames].toSorted();
	const openclawMetadata = buildManagedOpenClawMetadata({
		current: manifest.openclaw,
		managedOverrideKeys,
		managedPeerDependencyKeys
	});
	const next = {
		...manifest,
		private: true,
		dependencies: nextDependencies
	};
	if (Object.keys(overrides).length > 0) next.overrides = overrides;
	else delete next.overrides;
	if (openclawMetadata) next.openclaw = openclawMetadata;
	else delete next.openclaw;
	const changed = JSON.stringify(next) !== JSON.stringify(manifest);
	if (changed) {
		params.beforePersistentApply?.();
		replaceFileAtomicSync({
			filePath: manifestPath,
			content: `${JSON.stringify(next, null, 2)}\n`,
			mode: 384,
			dirMode: 511 & ~process.umask(),
			copyFallbackOnPermissionError: true,
			syncTempFile: true,
			syncParentDir: true
		});
	}
	return changed;
}
/** Remove stale managed-root openclaw peer installs while preserving active host links. */
async function repairManagedNpmRootOpenClawPeer(params) {
	await fs$1.mkdir(params.npmRoot, { recursive: true });
	const activeHostState = await readManagedNpmRootOpenClawHostState({
		npmRoot: params.npmRoot,
		packageRoot: params.packageRoot
	});
	if (activeHostState === "managed-active-host") return false;
	const hasManifestDependency = "openclaw" in readDependencyRecord((await readManagedNpmRootManifest(path.join(params.npmRoot, "package.json"))).dependencies);
	const hasLockDependency = await managedNpmRootLockfileHasOpenClawPeer(params.npmRoot);
	const hasPackageDir = await pathExists(path.join(params.npmRoot, "node_modules", "openclaw"));
	const preserveActiveHostLink = activeHostState === "linked-active-host";
	if (!hasManifestDependency && !hasLockDependency && (!hasPackageDir || preserveActiveHostLink)) return false;
	if (preserveActiveHostLink) {
		await scrubManagedNpmRootOpenClawPeer({
			npmRoot: params.npmRoot,
			preservePackageDir: true
		});
		return true;
	}
	const command = params.runCommand ?? runCommandWithTimeout;
	const npmArgs = hasManifestDependency ? [
		"npm",
		"uninstall",
		"--loglevel=error",
		"--legacy-peer-deps",
		"--ignore-scripts",
		"--no-audit",
		"--no-fund",
		"openclaw"
	] : [
		"npm",
		"prune",
		"--loglevel=error",
		"--legacy-peer-deps",
		"--ignore-scripts",
		"--no-audit",
		"--no-fund"
	];
	try {
		const result = await command(npmArgs, {
			cwd: params.npmRoot,
			timeoutMs: resolveInstallWorkTimeoutMs(params.workTimeoutMs, Math.max(params.timeoutMs ?? 3e5, 3e5)),
			signal: params.signal,
			killProcessTree: true,
			env: createSafeNpmInstallEnv(process.env, {
				legacyPeerDeps: true,
				npmConfigCwd: params.npmRoot,
				packageLock: true,
				quiet: true
			})
		});
		if (result.code !== 0) params.logger?.warn?.(`npm ${hasManifestDependency ? "uninstall openclaw" : "prune"} failed while repairing managed npm root; falling back to direct cleanup: ${result.stderr.trim() || result.stdout.trim()}`);
	} catch (error) {
		params.logger?.warn?.(`npm ${hasManifestDependency ? "uninstall openclaw" : "prune"} failed while repairing managed npm root; falling back to direct cleanup: ${String(error)}`);
	}
	await scrubManagedNpmRootOpenClawPeer({ npmRoot: params.npmRoot });
	return true;
}
async function readManagedNpmRootOpenClawHostState(params) {
	const packageRoot = params.packageRoot === void 0 ? resolveOpenClawPackageRootSync({
		argv1: process.argv[1],
		moduleUrl: import.meta.url,
		cwd: process.cwd()
	}) : params.packageRoot;
	if (!packageRoot) return "none";
	const managedOpenClawPackageDir = path.join(params.npmRoot, "node_modules", "openclaw");
	const [hostPackageRoot, managedPackageRoot, managedPackageStat] = await Promise.all([
		realpathIfExists(packageRoot),
		realpathIfExists(managedOpenClawPackageDir),
		lstatIfExists(managedOpenClawPackageDir)
	]);
	if (hostPackageRoot === null || hostPackageRoot !== managedPackageRoot) return "none";
	return managedPackageStat?.isSymbolicLink() ? "linked-active-host" : "managed-active-host";
}
async function managedNpmRootLockfileHasOpenClawPeer(npmRoot) {
	const lockPath = path.join(npmRoot, "package-lock.json");
	try {
		const parsed = JSON.parse(await fs$1.readFile(lockPath, "utf8"));
		if (isRecord(parsed.packages)) {
			const rootPackage = parsed.packages[""];
			if (isRecord(rootPackage) && isRecord(rootPackage.dependencies) && "openclaw" in rootPackage.dependencies) return true;
			if ("node_modules/openclaw" in parsed.packages) return true;
		}
		return isRecord(parsed.dependencies) && "openclaw" in parsed.dependencies;
	} catch (err) {
		if (err.code === "ENOENT") return false;
		throw err;
	}
}
async function realpathIfExists(filePath) {
	try {
		return await fs$1.realpath(filePath);
	} catch (err) {
		if (err.code === "ENOENT") return null;
		throw err;
	}
}
async function lstatIfExists(filePath) {
	try {
		return await fs$1.lstat(filePath);
	} catch (err) {
		if (err.code === "ENOENT") return null;
		throw err;
	}
}
async function pathExists(filePath) {
	return await fs$1.lstat(filePath).then(() => true).catch((err) => {
		if (hasErrnoCode(err, "ENOENT")) return false;
		throw err;
	});
}
async function scrubManagedNpmRootOpenClawPeer(params) {
	const manifestPath = path.join(params.npmRoot, "package.json");
	const manifest = await readManagedNpmRootManifest(manifestPath);
	const dependencies = readDependencyRecord(manifest.dependencies);
	if ("openclaw" in dependencies) {
		const { openclaw: _removed, ...nextDependencies } = dependencies;
		await fs$1.writeFile(manifestPath, `${JSON.stringify({
			...manifest,
			private: true,
			dependencies: nextDependencies
		}, null, 2)}\n`, "utf8");
	}
	const lockPath = path.join(params.npmRoot, "package-lock.json");
	try {
		const parsed = JSON.parse(await fs$1.readFile(lockPath, "utf8"));
		let lockChanged = false;
		if (isRecord(parsed.packages)) {
			const rootPackage = parsed.packages[""];
			if (isRecord(rootPackage) && isRecord(rootPackage.dependencies)) {
				const dependenciesValue = { ...rootPackage.dependencies };
				if ("openclaw" in dependenciesValue) {
					delete dependenciesValue.openclaw;
					parsed.packages[""] = {
						...rootPackage,
						dependencies: dependenciesValue
					};
					lockChanged = true;
				}
			}
			if ("node_modules/openclaw" in parsed.packages) {
				delete parsed.packages["node_modules/openclaw"];
				lockChanged = true;
			}
		}
		if (isRecord(parsed.dependencies) && "openclaw" in parsed.dependencies) {
			const dependenciesLocal = { ...parsed.dependencies };
			delete dependenciesLocal.openclaw;
			parsed.dependencies = dependenciesLocal;
			lockChanged = true;
		}
		if (lockChanged) await fs$1.writeFile(lockPath, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");
	} catch (err) {
		if (err.code !== "ENOENT") throw err;
	}
	const openclawPackageDir = path.join(params.npmRoot, "node_modules", "openclaw");
	if (!params.preservePackageDir && await pathExists(openclawPackageDir)) await fs$1.rm(openclawPackageDir, {
		recursive: true,
		force: true
	});
	const binDir = path.join(params.npmRoot, "node_modules", ".bin");
	await Promise.all([
		"openclaw",
		"openclaw.cmd",
		"openclaw.ps1"
	].map((binName) => fs$1.rm(path.join(binDir, binName), { force: true })));
	await fs$1.rm(path.join(params.npmRoot, "node_modules", ".package-lock.json"), { force: true });
}
/** Read lockfile metadata for an installed dependency in the managed root. */
async function readManagedNpmRootInstalledDependency(params) {
	const lockPath = path.join(params.npmRoot, "package-lock.json");
	const parsed = await readJson(lockPath);
	if (!isRecord(parsed) || !isRecord(parsed.packages)) return null;
	const entry = parsed.packages[`node_modules/${params.packageName}`];
	if (!isRecord(entry)) return null;
	return {
		version: normalizeOptionalString(entry.version),
		integrity: normalizeOptionalString(entry.integrity),
		resolved: normalizeOptionalString(entry.resolved)
	};
}
//#endregion
export { sourceFamilyForInstallPolicySource as A, resolvePluginInstallTransaction as B, formatUnresolvedOpenClawPeerLinkError as C, resolvePreparedDirectoryInstallTarget as D, readOptionalPackageManifest as E, attachPluginInstallOwnerMigrations as F, withPluginInstallTransactions as G, retainPluginInstallTransaction as H, attachPluginInstallTransaction as I, copyPluginInstallTransactionRequest as L, emitPluginAuditSecurityEvent as M, emitPluginInstallSecurityEvent as N, runInstallSourceScan as O, pluginAuditOutcomeForReason as P, requestDeferredPluginInstall as R, ensureOpenClawExtensions as S, loadPluginInstallRuntime as T, settlePluginInstallTransactions as U, resolvePluginInstallTransactionRequest as V, takePluginInstallTransaction as W, resolveRequiredPlatformPackageNames as _, resolveManagedNpmRootDependencySpec as a, emitSuccessfulPluginInstallSecurityEvent as b, copyManagedNpmProjectInputs as c, isNpmAliasOverrideCompatibilityError as d, listManagedNpmRootPackageNames as f, resolveManagedNpmRootPackageDir as g, resolveManagedNpmRootDependencySpecForInstall as h, repairManagedNpmRootOpenClawPeer as i, validateOpenClawPackageInstallCompatibility as j, sourceFamilyForInstallPolicyKind as k, formatManagedNpmProjectQuarantineArtifacts as l, resolveManagedNpmInstallPlan as m, readManagedNpmRootInstalledDependency as n, syncManagedNpmRootPeerDependencies as o, quarantineManagedNpmProjectRebuildArtifacts as p, readOpenClawManagedNpmRootOverrides as r, upsertManagedNpmRootDependency as s, listMissingRequiredPlatformPackages as t, isManagedNpmProjectCorruptionInstallFailure as u, buildDirectoryInstallResult as v, installPluginDirectoryIntoExtensions as w, ensureInstallTargetAvailableForMode as x, defaultLogger as y, resolvePluginInstallOwnerMigrations as z };
