import { p as normalizeTrimmedStringList } from "./string-normalization-_gRhJUDw.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { t as CONFIG_DIR } from "./utils-aKqR_F_U.mjs";
import { r as readRegularFile } from "./regular-file-D4i0kJHS.mjs";
import { n as MANIFEST_KEY } from "./legacy-names-NIXaj2oi.mjs";
import "./manifest-DHkEL08H.mjs";
import { a as detectBundleManifestFormat } from "./bundle-manifest-n8JdxRJp.mjs";
import { o as unscopedPackageName, r as resolveSafeInstallDir } from "./install-safe-path-Nbwl6YSJ.mjs";
import { t as parseHookFrontmatter } from "./frontmatter-Cb3BnaSU.mjs";
import { n as hasPackageRuntimeDependencies, t as copyPackageDirInstallTransactionRequest } from "./install-package-dir-DZA6fMda.mjs";
import { o as scanInstalledPackageDependencyTree, s as scanPackageInstallSource } from "./install-security-scan-jk08Rpmf.mjs";
import path from "node:path";
//#region src/hooks/install.ts
const HOOK_MD_MAX_BYTES = 1048576;
const loadHookInstallRuntime = createLazyRuntimeModule(() => import("./install.runtime-OobIBvy_.mjs"));
const HOOK_INSTALL_ERROR_CODE = {
	MISSING_OPENCLAW_HOOKS: "missing_openclaw_hooks",
	EMPTY_OPENCLAW_HOOKS: "empty_openclaw_hooks"
};
const defaultLogger = {};
function buildHookInstallForwardParams(params) {
	return copyPackageDirInstallTransactionRequest(params, {
		config: params.config,
		onInstallPolicyWarning: params.onInstallPolicyWarning,
		trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
		hooksDir: params.hooksDir,
		timeoutMs: params.timeoutMs,
		workTimeoutMs: params.workTimeoutMs,
		logger: params.logger,
		mode: params.mode,
		dryRun: params.dryRun,
		expectedHookPackId: params.expectedHookPackId,
		expectedPackageKind: params.expectedPackageKind,
		inspection: params.inspection,
		beforePersistentApply: params.beforePersistentApply,
		installPolicyRequest: params.installPolicyRequest
	});
}
function localHookInstallPolicySource(kind) {
	return kind === "plugin-archive" ? {
		kind: "archive",
		authority: "user",
		mutable: true,
		network: false
	} : {
		kind: "local-path",
		authority: "user",
		mutable: true,
		network: false
	};
}
async function runHookInstallScan(params) {
	try {
		const result = await params.scan();
		if (!result?.blocked) return null;
		return {
			ok: false,
			error: result.blocked.reason,
			...result.blocked.code ? { code: result.blocked.code } : {}
		};
	} catch (error) {
		return {
			ok: false,
			error: `Hook pack "${params.hookPackId}" installation blocked: install policy failed (${String(error)})`,
			code: "security_scan_failed"
		};
	}
}
async function runHookInstallPolicy(params) {
	const request = params.forward.installPolicyRequest;
	if (!request) return null;
	return await runHookInstallScan({
		hookPackId: params.hookPackId,
		scan: async () => await scanPackageInstallSource({
			config: params.forward.config,
			onInstallPolicyWarning: params.forward.onInstallPolicyWarning,
			trustedSourceLinkedOfficialInstall: params.forward.trustedSourceLinkedOfficialInstall,
			packageDir: params.packageDir,
			pluginId: params.hookPackId,
			extensions: params.hookEntries,
			...params.packageName ? { packageName: params.packageName } : {},
			...params.version ? { version: params.version } : {},
			logger: params.logger,
			requestKind: request.kind,
			requestedSpecifier: request.requestedSpecifier,
			source: request.source,
			mode: params.mode
		})
	});
}
async function runHookInstalledDependencyPolicy(params) {
	const request = params.forward.installPolicyRequest;
	if (!request) return null;
	return await runHookInstallScan({
		hookPackId: params.hookPackId,
		scan: async () => await scanInstalledPackageDependencyTree({
			config: params.forward.config,
			onInstallPolicyWarning: params.forward.onInstallPolicyWarning,
			trustedSourceLinkedOfficialInstall: params.forward.trustedSourceLinkedOfficialInstall,
			packageDir: params.installedDir,
			pluginId: params.hookPackId,
			logger: params.logger,
			requestKind: request.kind,
			requestedSpecifier: request.requestedSpecifier,
			source: request.source,
			mode: params.mode
		})
	});
}
function validateHookId(hookId) {
	if (!hookId) return "invalid hook name: missing";
	if (hookId === "." || hookId === "..") return "invalid hook name: reserved path segment";
	if (hookId.includes("/") || hookId.includes("\\")) return "invalid hook name: path separators not allowed";
	return null;
}
/** Resolve the canonical local install directory for one hook pack id. */
function resolveHookInstallDir(hookId, hooksDir) {
	const hooksBase = hooksDir ? resolveUserPath(hooksDir) : path.join(CONFIG_DIR, "hooks");
	const hookIdError = validateHookId(hookId);
	if (hookIdError) throw new Error(hookIdError);
	const targetDirResult = resolveSafeInstallDir({
		baseDir: hooksBase,
		id: hookId,
		invalidNameMessage: "invalid hook name: path traversal detected"
	});
	if (!targetDirResult.ok) throw new Error(targetDirResult.error);
	return targetDirResult.path;
}
function resolveOpenClawHooks(manifest) {
	const hooks = manifest[MANIFEST_KEY]?.hooks;
	if (!Array.isArray(hooks)) return {
		ok: false,
		error: "package.json missing openclaw.hooks",
		code: HOOK_INSTALL_ERROR_CODE.MISSING_OPENCLAW_HOOKS
	};
	const list = normalizeTrimmedStringList(hooks);
	if (list.length === 0) return {
		ok: false,
		error: "package.json openclaw.hooks is empty",
		code: HOOK_INSTALL_ERROR_CODE.EMPTY_OPENCLAW_HOOKS
	};
	return {
		ok: true,
		entries: list
	};
}
function resolveHookPackageKind(manifest, packageKind) {
	if (packageKind) return packageKind;
	const extensions = manifest[MANIFEST_KEY]?.extensions;
	if (extensions === void 0) return "hook-only";
	return Array.isArray(extensions) && normalizeTrimmedStringList(extensions).length === 0 ? "hook-only" : "plugin-capable";
}
function resolveHookInstallTargetPath(id, hooksDir) {
	const baseHooksDir = hooksDir ? resolveUserPath(hooksDir) : path.join(CONFIG_DIR, "hooks");
	const result = resolveSafeInstallDir({
		baseDir: baseHooksDir,
		id,
		invalidNameMessage: "invalid hook name: path traversal detected"
	});
	return result.ok ? {
		ok: true,
		targetDir: result.path
	} : result;
}
async function resolveInstallTargetDir(id, hooksDir) {
	const runtime = await loadHookInstallRuntime();
	const baseHooksDir = hooksDir ? resolveUserPath(hooksDir) : path.join(CONFIG_DIR, "hooks");
	return await runtime.resolveCanonicalInstallTarget({
		baseDir: baseHooksDir,
		id,
		invalidNameMessage: "invalid hook name: path traversal detected",
		boundaryLabel: "hooks directory"
	});
}
async function resolvePreparedHookInstallTarget(params) {
	const runtime = await loadHookInstallRuntime();
	const targetDirResult = await resolveInstallTargetDir(params.id, params.hooksDir);
	if (!targetDirResult.ok) return targetDirResult;
	const targetDir = targetDirResult.targetDir;
	const effectiveMode = params.requestedMode === "update" && await runtime.fileExists(targetDir) ? "update" : "install";
	const availability = await runtime.ensureInstallTargetAvailable({
		mode: effectiveMode,
		targetDir,
		alreadyExistsError: params.alreadyExistsError(targetDir)
	});
	if (!availability.ok) return availability;
	return {
		ok: true,
		target: {
			targetDir,
			effectiveMode
		}
	};
}
async function installFromResolvedHookDir(resolvedDir, params) {
	const runtime = await loadHookInstallRuntime();
	const manifestPath = path.join(resolvedDir, "package.json");
	const packageKind = await runtime.fileExists(path.join(resolvedDir, "openclaw.plugin.json")) || detectBundleManifestFormat(resolvedDir) !== null ? "plugin-capable" : void 0;
	if (await runtime.fileExists(manifestPath)) return await installHookPackageFromDir({
		packageDir: resolvedDir,
		...packageKind ? { packageKind } : {},
		...buildHookInstallForwardParams(params)
	});
	return await installHookFromDir({
		hookDir: resolvedDir,
		...packageKind ? { packageKind } : {},
		...buildHookInstallForwardParams(params)
	});
}
async function resolveHookNameFromDir(hookDir) {
	const runtime = await loadHookInstallRuntime();
	const hookMdPath = path.join(hookDir, "HOOK.md");
	if (!await runtime.fileExists(hookMdPath)) throw new Error(`HOOK.md missing in ${hookDir}`);
	const { buffer } = await readRegularFile({
		filePath: hookMdPath,
		maxBytes: HOOK_MD_MAX_BYTES
	});
	return parseHookFrontmatter(buffer.toString("utf-8")).name || path.basename(hookDir);
}
async function validateHookDir(hookDir) {
	const runtime = await loadHookInstallRuntime();
	const hookMdPath = path.join(hookDir, "HOOK.md");
	if (!await runtime.fileExists(hookMdPath)) throw new Error(`HOOK.md missing in ${hookDir}`);
	const handlerCandidates = [
		"handler.ts",
		"handler.js",
		"index.ts",
		"index.js"
	];
	const handlerEntry = handlerCandidates[(await Promise.all(handlerCandidates.map(async (candidate) => runtime.fileExists(path.join(hookDir, candidate))))).findIndex(Boolean)];
	if (!handlerEntry) throw new Error(`handler.ts/handler.js/index.ts/index.js missing in ${hookDir}`);
	return { handlerEntry };
}
async function installValidatedHookDirectory(params, source) {
	const runtime = await loadHookInstallRuntime();
	const { logger, mode, dryRun, timeoutMs, workTimeoutMs } = source.options;
	const { hookPackId, version } = source.metadata;
	if (params.inspection === "package-kind") {
		const target = resolveHookInstallTargetPath(hookPackId, params.hooksDir);
		return target.ok ? {
			...target,
			...source.metadata
		} : target;
	}
	const preparedTarget = await resolvePreparedHookInstallTarget({
		id: hookPackId,
		hooksDir: params.hooksDir,
		requestedMode: mode,
		alreadyExistsError: (targetDir) => `${source.label} already exists: ${targetDir} (delete it first)`
	});
	if (!preparedTarget.ok) return preparedTarget;
	const { targetDir, effectiveMode } = preparedTarget.target;
	const policyFailure = await runHookInstallPolicy({
		hookPackId,
		hookEntries: source.hookEntries,
		packageName: source.packageName,
		version,
		packageDir: source.directory,
		forward: params,
		logger,
		mode: effectiveMode
	});
	if (policyFailure) return policyFailure;
	if (dryRun) return {
		ok: true,
		...source.metadata,
		targetDir
	};
	const hasDeps = source.manifest ? hasPackageRuntimeDependencies(source.manifest) : false;
	const installRes = await runtime.installPackageDir(copyPackageDirInstallTransactionRequest(params, {
		sourceDir: source.directory,
		targetDir,
		mode: effectiveMode,
		timeoutMs,
		workTimeoutMs,
		logger,
		copyErrorPrefix: `failed to copy ${source.label}`,
		depsLogMessage: `Installing ${source.label} dependencies…`,
		hasDeps,
		sourceHardlinks: hasDeps ? "package-manager" : "reject",
		beforePersistentApply: params.beforePersistentApply,
		afterInstall: async (installedDir) => {
			return await runHookInstalledDependencyPolicy({
				hookPackId,
				installedDir,
				forward: params,
				logger,
				mode: effectiveMode
			}) ?? { ok: true };
		}
	}));
	return installRes.ok ? {
		...installRes,
		...source.metadata,
		targetDir
	} : installRes;
}
async function installHookPackageFromDir(params) {
	const runtime = await loadHookInstallRuntime();
	const options = runtime.resolveTimedInstallModeOptions(params, defaultLogger);
	const manifestPath = path.join(params.packageDir, "package.json");
	if (!await runtime.fileExists(manifestPath)) return {
		ok: false,
		error: "package.json missing"
	};
	let manifest;
	try {
		manifest = await runtime.readJsonFile(manifestPath);
	} catch (err) {
		return {
			ok: false,
			error: `invalid package.json: ${String(err)}`
		};
	}
	const hookManifest = resolveOpenClawHooks(manifest);
	if (!hookManifest.ok) return hookManifest;
	const hookEntries = hookManifest.entries;
	const pkgName = typeof manifest.name === "string" ? manifest.name : "";
	const hookPackId = pkgName ? unscopedPackageName(pkgName) : path.basename(params.packageDir);
	const packageKind = resolveHookPackageKind(manifest, params.packageKind);
	if (params.expectedPackageKind && packageKind !== params.expectedPackageKind) return {
		ok: false,
		error: `hook package kind mismatch: expected ${params.expectedPackageKind}, got ${packageKind}`
	};
	const hookIdError = validateHookId(hookPackId);
	if (hookIdError) return {
		ok: false,
		error: hookIdError
	};
	if (params.expectedHookPackId && params.expectedHookPackId !== hookPackId) return {
		ok: false,
		error: `hook pack id mismatch: expected ${params.expectedHookPackId}, got ${hookPackId}`
	};
	const resolvedHooks = /* @__PURE__ */ new Set();
	for (const entry of hookEntries) {
		const hookDir = path.resolve(params.packageDir, entry);
		if (!runtime.isPathInside(params.packageDir, hookDir)) return {
			ok: false,
			error: `openclaw.hooks entry escapes package directory: ${entry}`
		};
		await validateHookDir(hookDir);
		if (!runtime.isPathInsideWithRealpath(params.packageDir, hookDir, { requireRealpath: true })) return {
			ok: false,
			error: `openclaw.hooks entry resolves outside package directory: ${entry}`
		};
		const hookName = await resolveHookNameFromDir(hookDir);
		if (resolvedHooks.has(hookName)) return {
			ok: false,
			error: `duplicate hook name "${hookName}" in hook package`
		};
		resolvedHooks.add(hookName);
	}
	const hookNames = [...resolvedHooks];
	return await installValidatedHookDirectory(params, {
		directory: params.packageDir,
		label: "hook pack",
		hookEntries,
		packageName: pkgName,
		manifest,
		options,
		metadata: {
			hookPackId,
			hooks: hookNames,
			packageKind,
			version: typeof manifest.version === "string" ? manifest.version : void 0
		}
	});
}
async function installHookFromDir(params) {
	const options = {
		...(await loadHookInstallRuntime()).resolveInstallModeOptions(params, defaultLogger),
		timeoutMs: 12e4
	};
	const { handlerEntry } = await validateHookDir(params.hookDir);
	const hookName = await resolveHookNameFromDir(params.hookDir);
	const packageKind = params.packageKind ?? "hook-only";
	if (params.expectedPackageKind && packageKind !== params.expectedPackageKind) return {
		ok: false,
		error: `hook package kind mismatch: expected ${params.expectedPackageKind}, got ${packageKind}`
	};
	const hookIdError = validateHookId(hookName);
	if (hookIdError) return {
		ok: false,
		error: hookIdError
	};
	if (params.expectedHookPackId && params.expectedHookPackId !== hookName) return {
		ok: false,
		error: `hook id mismatch: expected ${params.expectedHookPackId}, got ${hookName}`
	};
	return await installValidatedHookDirectory(params, {
		directory: params.hookDir,
		label: "hook",
		hookEntries: [handlerEntry],
		options,
		metadata: {
			hookPackId: hookName,
			hooks: [hookName],
			packageKind
		}
	});
}
/** Install hooks from an archive after extracting and validating the archive root. */
async function installHooksFromArchive(params) {
	const runtime = await loadHookInstallRuntime();
	const { logger, timeoutMs, workTimeoutMs } = runtime.resolveTimedInstallModeOptions(params, defaultLogger);
	const archivePathResult = await runtime.resolveArchiveSourcePath(params.archivePath);
	if (!archivePathResult.ok) return archivePathResult;
	const archivePath = archivePathResult.path;
	const installPolicyRequest = params.installPolicyRequest ?? {
		kind: "plugin-archive",
		requestedSpecifier: params.archivePath,
		source: localHookInstallPolicySource("plugin-archive")
	};
	return await runtime.withExtractedArchiveRoot({
		archivePath,
		tempDirPrefix: "openclaw-hook-",
		timeoutMs,
		workTimeoutMs,
		logger,
		onExtracted: async (rootDir) => await installFromResolvedHookDir(rootDir, buildHookInstallForwardParams({
			...params,
			timeoutMs,
			workTimeoutMs,
			logger,
			installPolicyRequest
		}))
	});
}
/** Download, verify, and install an npm hook pack tarball. */
async function installHooksFromNpmSpec(params) {
	const runtime = await loadHookInstallRuntime();
	const { logger, timeoutMs, workTimeoutMs, mode, dryRun } = runtime.resolveTimedInstallModeOptions(params, defaultLogger);
	const spec = params.spec;
	logger.info?.(`Downloading ${spec.trim()}…`);
	return await runtime.installFromValidatedNpmSpecArchive({
		tempDirPrefix: "openclaw-hook-pack-",
		spec,
		timeoutMs,
		workTimeoutMs,
		expectedIntegrity: params.expectedIntegrity,
		onIntegrityDrift: params.onIntegrityDrift,
		warn: (message) => {
			logger.warn?.(message);
		},
		installFromArchive: installHooksFromArchive,
		archiveInstallParams: buildHookInstallForwardParams({
			...params,
			timeoutMs,
			workTimeoutMs,
			logger,
			mode,
			dryRun,
			installPolicyRequest: {
				kind: "plugin-npm",
				requestedSpecifier: spec,
				source: {
					kind: "npm",
					authority: "third-party",
					mutable: false,
					network: true
				}
			}
		})
	});
}
/** Install a hook pack or single hook from a local directory/archive path. */
async function installHooksFromPath(params) {
	const runtime = await loadHookInstallRuntime();
	const pathResult = await runtime.resolveExistingInstallPath(params.path);
	if (!pathResult.ok) return pathResult;
	const { resolvedPath: resolved, stat } = pathResult;
	const installPolicyKind = stat.isDirectory() ? "plugin-dir" : "plugin-archive";
	const forwardParams = buildHookInstallForwardParams({
		...params,
		installPolicyRequest: {
			kind: installPolicyKind,
			requestedSpecifier: params.path,
			source: localHookInstallPolicySource(installPolicyKind)
		}
	});
	if (stat.isDirectory()) return await installFromResolvedHookDir(resolved, forwardParams);
	if (!runtime.resolveArchiveKind(resolved)) return {
		ok: false,
		error: `unsupported hook file: ${resolved}`
	};
	return await installHooksFromArchive({
		archivePath: resolved,
		...forwardParams
	});
}
//#endregion
export { resolveHookInstallDir as i, installHooksFromNpmSpec as n, installHooksFromPath as r, HOOK_INSTALL_ERROR_CODE as t };
