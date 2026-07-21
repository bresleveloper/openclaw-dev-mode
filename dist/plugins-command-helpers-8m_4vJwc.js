import { a as normalizeLowercaseStringOrEmpty } from "./string-coerce-DW4mBlAt.js";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BgpbKGBP.js";
import { r as theme } from "./theme-vjDs9tao.js";
import { d as normalizeTrimmedStringList } from "./string-normalization-CRyoFBPt.js";
import { i as resolveSafeInstallDir, n as unscopedPackageName } from "./install-safe-path-EhqVsq3P.js";
import { m as resolveUserPath, t as CONFIG_DIR } from "./utils-CRO4LGEB.js";
import { r as defaultRuntime } from "./runtime-Bz6o617W.js";
import { n as MANIFEST_KEY } from "./legacy-names-NIXaj2oi.js";
import "./manifest-D7Lv7P8W.js";
import { i as detectBundleManifestFormat } from "./bundle-manifest-CGssMTvR.js";
import { t as applyExclusiveSlotSelection } from "./slots-kpL659LX.js";
import { i as loadPluginMetadataSnapshot } from "./plugin-metadata-snapshot-fqwcFyP9.js";
import { o as scanInstalledPackageDependencyTree, s as scanPackageInstallSource } from "./install-security-scan-1Vls-rdd.js";
import { t as parseFrontmatter } from "./frontmatter-DtAW4IcY.js";
import { a as buildPluginDiagnosticsReport } from "./status-Dhd0HLxk.js";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/hooks/install.ts
const loadHookInstallRuntime = createLazyRuntimeModule(() => import("./install.runtime-CGH0FFJ8.js"));
const HOOK_INSTALL_ERROR_CODE = {
	MISSING_OPENCLAW_HOOKS: "missing_openclaw_hooks",
	EMPTY_OPENCLAW_HOOKS: "empty_openclaw_hooks"
};
const defaultLogger = {};
function buildHookInstallForwardParams(params) {
	return {
		config: params.config,
		dangerouslyForceUnsafeInstall: params.dangerouslyForceUnsafeInstall,
		trustedSourceLinkedOfficialInstall: params.trustedSourceLinkedOfficialInstall,
		hooksDir: params.hooksDir,
		timeoutMs: params.timeoutMs,
		logger: params.logger,
		mode: params.mode,
		dryRun: params.dryRun,
		expectedHookPackId: params.expectedHookPackId,
		expectedPackageKind: params.expectedPackageKind,
		inspection: params.inspection,
		installPolicyRequest: params.installPolicyRequest
	};
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
			dangerouslyForceUnsafeInstall: params.forward.dangerouslyForceUnsafeInstall,
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
			dangerouslyForceUnsafeInstall: params.forward.dangerouslyForceUnsafeInstall,
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
	const result = resolveSafeInstallDir({
		baseDir: hooksDir ? resolveUserPath(hooksDir) : path.join(CONFIG_DIR, "hooks"),
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
	return parseFrontmatter(await fs.readFile(hookMdPath, "utf-8")).name || path.basename(hookDir);
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
async function installHookPackageFromDir(params) {
	const runtime = await loadHookInstallRuntime();
	const { logger, timeoutMs, mode, dryRun } = runtime.resolveTimedInstallModeOptions(params, defaultLogger);
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
	const resolvedHooks = [];
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
		resolvedHooks.push(hookName);
	}
	if (params.inspection === "package-kind") {
		const targetDirResult = resolveHookInstallTargetPath(hookPackId, params.hooksDir);
		if (!targetDirResult.ok) return targetDirResult;
		return {
			ok: true,
			hookPackId,
			hooks: resolvedHooks,
			packageKind,
			targetDir: targetDirResult.targetDir,
			version: typeof manifest.version === "string" ? manifest.version : void 0
		};
	}
	const preparedTarget = await resolvePreparedHookInstallTarget({
		id: hookPackId,
		hooksDir: params.hooksDir,
		requestedMode: mode,
		alreadyExistsError: (targetDir) => `hook pack already exists: ${targetDir} (delete it first)`
	});
	if (!preparedTarget.ok) return preparedTarget;
	const { targetDir, effectiveMode } = preparedTarget.target;
	const policyFailure = await runHookInstallPolicy({
		hookPackId,
		hookEntries,
		...pkgName ? { packageName: pkgName } : {},
		...typeof manifest.version === "string" ? { version: manifest.version } : {},
		packageDir: params.packageDir,
		forward: params,
		logger,
		mode: effectiveMode
	});
	if (policyFailure) return policyFailure;
	if (dryRun) return {
		ok: true,
		hookPackId,
		hooks: resolvedHooks,
		packageKind,
		targetDir,
		version: typeof manifest.version === "string" ? manifest.version : void 0
	};
	const installRes = await runtime.installPackageDirWithManifestDeps({
		sourceDir: params.packageDir,
		targetDir,
		mode: effectiveMode,
		timeoutMs,
		logger,
		copyErrorPrefix: "failed to copy hook pack",
		depsLogMessage: "Installing hook pack dependencies…",
		manifestDependencies: manifest.dependencies,
		afterInstall: async (installedDir) => {
			return await runHookInstalledDependencyPolicy({
				hookPackId,
				installedDir,
				forward: params,
				logger,
				mode: effectiveMode
			}) ?? { ok: true };
		}
	});
	if (!installRes.ok) return installRes;
	return {
		ok: true,
		hookPackId,
		hooks: resolvedHooks,
		packageKind,
		targetDir,
		version: typeof manifest.version === "string" ? manifest.version : void 0
	};
}
async function installHookFromDir(params) {
	const runtime = await loadHookInstallRuntime();
	const { logger, mode, dryRun } = runtime.resolveInstallModeOptions(params, defaultLogger);
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
	if (params.inspection === "package-kind") {
		const targetDirResult = resolveHookInstallTargetPath(hookName, params.hooksDir);
		if (!targetDirResult.ok) return targetDirResult;
		return {
			ok: true,
			hookPackId: hookName,
			hooks: [hookName],
			packageKind,
			targetDir: targetDirResult.targetDir
		};
	}
	const preparedTarget = await resolvePreparedHookInstallTarget({
		id: hookName,
		hooksDir: params.hooksDir,
		requestedMode: mode,
		alreadyExistsError: (targetDir) => `hook already exists: ${targetDir} (delete it first)`
	});
	if (!preparedTarget.ok) return preparedTarget;
	const { targetDir, effectiveMode } = preparedTarget.target;
	const policyFailure = await runHookInstallPolicy({
		hookPackId: hookName,
		hookEntries: [handlerEntry],
		packageDir: params.hookDir,
		forward: params,
		logger,
		mode: effectiveMode
	});
	if (policyFailure) return policyFailure;
	if (dryRun) return {
		ok: true,
		hookPackId: hookName,
		hooks: [hookName],
		packageKind,
		targetDir
	};
	const installRes = await runtime.installPackageDir({
		sourceDir: params.hookDir,
		targetDir,
		mode: effectiveMode,
		timeoutMs: 12e4,
		logger,
		copyErrorPrefix: "failed to copy hook",
		hasDeps: false,
		depsLogMessage: "Installing hook dependencies…",
		afterInstall: async (installedDir) => {
			return await runHookInstalledDependencyPolicy({
				hookPackId: hookName,
				installedDir,
				forward: params,
				logger,
				mode: effectiveMode
			}) ?? { ok: true };
		}
	});
	if (!installRes.ok) return installRes;
	return {
		ok: true,
		hookPackId: hookName,
		hooks: [hookName],
		packageKind,
		targetDir
	};
}
/** Install hooks from an archive after extracting and validating the archive root. */
async function installHooksFromArchive(params) {
	const runtime = await loadHookInstallRuntime();
	const logger = params.logger ?? defaultLogger;
	const timeoutMs = params.timeoutMs ?? 12e4;
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
		logger,
		onExtracted: async (rootDir) => await installFromResolvedHookDir(rootDir, buildHookInstallForwardParams({
			...params,
			timeoutMs,
			logger,
			installPolicyRequest
		}))
	});
}
/** Download, verify, and install an npm hook pack tarball. */
async function installHooksFromNpmSpec(params) {
	const runtime = await loadHookInstallRuntime();
	const { logger, timeoutMs, mode, dryRun } = runtime.resolveTimedInstallModeOptions(params, defaultLogger);
	const spec = params.spec;
	logger.info?.(`Downloading ${spec.trim()}…`);
	return await runtime.installFromValidatedNpmSpecArchive({
		tempDirPrefix: "openclaw-hook-pack-",
		spec,
		timeoutMs,
		expectedIntegrity: params.expectedIntegrity,
		onIntegrityDrift: params.onIntegrityDrift,
		warn: (message) => {
			logger.warn?.(message);
		},
		installFromArchive: installHooksFromArchive,
		archiveInstallParams: buildHookInstallForwardParams({
			...params,
			timeoutMs,
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
//#region src/cli/plugins-command-helpers.ts
function mergeRuntimeKinds(report, runtimeReport) {
	const runtimeKinds = new Map(runtimeReport.plugins.filter((plugin) => plugin.kind).map((plugin) => [plugin.id, plugin.kind]));
	return { plugins: report.plugins.map((plugin) => {
		if (plugin.kind) return plugin;
		const runtimeKind = runtimeKinds.get(plugin.id);
		return runtimeKind ? {
			...plugin,
			kind: runtimeKind
		} : plugin;
	}) };
}
function loadRuntimeKindReportForPlugins(config, pluginIds) {
	return buildPluginDiagnosticsReport({
		config,
		onlyPluginIds: [...pluginIds]
	});
}
function buildSlotSelectionRegistry(config, pluginId) {
	return { plugins: loadPluginMetadataSnapshot({
		config,
		env: process.env
	}).plugins.filter((plugin) => plugin.id === pluginId).map((plugin) => ({
		id: plugin.id,
		kind: plugin.kind
	})) };
}
function resolveFileNpmSpecToLocalPath(raw) {
	const trimmed = raw.trim();
	if (!normalizeLowercaseStringOrEmpty(trimmed).startsWith("file:")) return null;
	const rest = trimmed.slice(5);
	if (!rest) return {
		ok: false,
		error: "unsupported file: spec: missing path"
	};
	if (rest.startsWith("///")) return {
		ok: true,
		path: rest.slice(2)
	};
	if (rest.startsWith("//localhost/")) return {
		ok: true,
		path: rest.slice(11)
	};
	if (rest.startsWith("//")) return {
		ok: false,
		error: "unsupported file: URL host (expected \"file:<path>\" or \"file:///abs/path\")"
	};
	return {
		ok: true,
		path: rest
	};
}
function applySlotSelectionForPlugin(config, pluginId) {
	const report = buildSlotSelectionRegistry(config, pluginId);
	const plugin = report.plugins.find((entry) => entry.id === pluginId);
	if (!plugin) return {
		config,
		warnings: []
	};
	if (!plugin.kind) {
		const runtimeReport = loadRuntimeKindReportForPlugins(config, [plugin.id]);
		const runtimePlugin = runtimeReport.plugins.find((entry) => entry.id === plugin.id);
		if (runtimePlugin?.kind) {
			const result = applyExclusiveSlotSelection({
				config,
				selectedId: runtimePlugin.id,
				selectedKind: runtimePlugin.kind,
				registry: mergeRuntimeKinds(report, runtimeReport)
			});
			return {
				config: result.config,
				warnings: result.warnings
			};
		}
	}
	const result = applyExclusiveSlotSelection({
		config,
		selectedId: plugin.id,
		selectedKind: plugin.kind,
		registry: report
	});
	return {
		config: result.config,
		warnings: result.warnings
	};
}
function createPluginInstallLogger(runtime = defaultRuntime) {
	return {
		info: (msg) => runtime.log(msg),
		warn: (msg) => runtime.log(msg.includes("╭─") ? msg : theme.warn(msg))
	};
}
function createHookPackInstallLogger(runtime = defaultRuntime) {
	return {
		info: (msg) => runtime.log(msg),
		warn: (msg) => runtime.log(theme.warn(msg))
	};
}
function enableInternalHookEntries(config, hookNames) {
	const entries = { ...config.hooks?.internal?.entries };
	for (const hookName of hookNames) entries[hookName] = {
		...entries[hookName],
		enabled: true
	};
	return {
		...config,
		hooks: {
			...config.hooks,
			internal: {
				...config.hooks?.internal,
				enabled: true,
				entries
			}
		}
	};
}
function formatPluginInstallWithHookFallbackError(pluginError, hookFallback) {
	const formattedPluginError = formatPluginInstallAttemptError(pluginError);
	const formattedHookError = formatPluginInstallAttemptError(hookFallback.error);
	if (/plugin already exists: .+ \(delete it first\)/.test(pluginError)) return `${formattedPluginError}\nUse \`openclaw plugins update <id-or-npm-spec>\` to upgrade the tracked plugin, or rerun install with \`--force\` to replace it.`;
	if (pluginError.startsWith("Invalid extensions directory:") || pluginError === "Invalid path: must stay within extensions directory") return formattedPluginError;
	if (hookFallback.code === HOOK_INSTALL_ERROR_CODE.MISSING_OPENCLAW_HOOKS) return formattedPluginError;
	return `${formattedPluginError}\nAlso not a valid hook pack: ${formattedHookError}`;
}
const MISSING_GIT_FOR_NPM_DEPENDENCY_HINT = "Git is required because one of this plugin's npm dependencies is fetched from a git URL, but `git` was not found on PATH. Install Git and rerun the install. On Windows, use `winget install --id Git.Git -e` or add a portable Git `bin` directory to PATH.";
function formatPluginInstallAttemptError(error) {
	if (!isMissingGitForNpmDependencyError(error)) return error;
	if (error.includes(MISSING_GIT_FOR_NPM_DEPENDENCY_HINT)) return error;
	return `${error}\n\n${MISSING_GIT_FOR_NPM_DEPENDENCY_HINT}`;
}
function isMissingGitForNpmDependencyError(error) {
	const normalized = normalizeLowercaseStringOrEmpty(error);
	return /\bspawn\s+git\b/u.test(normalized) && /\benoent\b/u.test(normalized);
}
function logHookPackRestartHint(runtime = defaultRuntime) {
	runtime.log("Restart the gateway to load hooks.");
}
function logSlotWarnings(warnings, runtime = defaultRuntime) {
	if (warnings.length === 0) return;
	for (const warning of warnings) runtime.log(theme.warn(warning));
}
function parseNpmPrefixSpec(raw) {
	const trimmed = raw.trim();
	if (!normalizeLowercaseStringOrEmpty(trimmed).startsWith("npm:")) return null;
	return trimmed.slice(4).trim();
}
function parseNpmPackPrefixPath(raw) {
	const trimmed = raw.trim();
	if (!normalizeLowercaseStringOrEmpty(trimmed).startsWith("npm-pack:")) return null;
	return trimmed.slice(9).trim();
}
//#endregion
export { formatPluginInstallWithHookFallbackError as a, parseNpmPackPrefixPath as c, installHooksFromNpmSpec as d, installHooksFromPath as f, enableInternalHookEntries as i, parseNpmPrefixSpec as l, createHookPackInstallLogger as n, logHookPackRestartHint as o, resolveHookInstallDir as p, createPluginInstallLogger as r, logSlotWarnings as s, applySlotSelectionForPlugin as t, resolveFileNpmSpecToLocalPath as u };
