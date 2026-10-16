import "./package-lifecycle-marker-DhfhzqrA.mjs";
import { r as resolveEnvironmentValue } from "./process-env-DlZFJzq6.mjs";
import { c as isPathInside, t as FsSafeError, w as root } from "./fs-safe-BUXBSN-4.mjs";
import { t as resolveRuntimeArgs } from "./runtime-worker-url-DoBSDhBS.mjs";
import { n as completePendingPackageLifecycle, r as discardPendingPackageLifecycle, t as PackageLifecycleOwnershipError } from "./package-lifecycle-DhrzJYrq.mjs";
import { n as isErrno, r as isMissingPathError, t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import "./update-run-timeouts-Byb-PlTk.mjs";
import { t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { i as readPackageVersion } from "./package-json-DuhFvY5l.mjs";
import { n as resolveBunGlobalInstallOwner } from "./detect-package-manager-DsIv0glm.mjs";
import { a as readPackageDistInventoryIfPresent, i as readPackageDistContentInventoryIfPresent, n as collectPackageDistContentInventoryErrors, o as PACKAGE_DIST_CONTENT_INVENTORY_RELATIVE_PATH, r as collectPackageDistInventory } from "./package-dist-inventory-CQca5HwG.mjs";
import { n as readBuiltGatewayBuildId } from "./update-git-runtime-Cg4widap.mjs";
import { _ as FreeBsdPkgOwnershipError, g as verifyPackageUpdateRecovery, h as resolvePnpmIsolatedInstallOwner, l as listActivePnpmIsolatedGlobalPackages, n as cleanupGlobalRenameDirs, p as resolveNpmLifecyclePolicyGate, r as collectInstalledGlobalPackageErrors, s as globalInstallArgs, u as resolveExpectedInstalledVersionFromSpec, v as PKG_INSPECTION_TIMEOUT_MS, y as createFreeBsdPkgOwnershipInspection } from "./update-global-rkW-mKvG.mjs";
import { r as mergePathPrepend } from "./path-prepend-Cv1ulMUG.mjs";
import { n as resolvePnpmGlobalDirFromGlobalRoot, t as resolveNativePackageProjectRoot } from "./update-native-package-owner-Djnm33vV.mjs";
import { a as resolveNpmGlobalPrefixLayoutFromPrefix, i as resolveNpmGlobalPrefixLayoutFromGlobalRoot, r as readPackageManagerProbeValue } from "./update-npm-prefix-bBxyXd_e.mjs";
import { r as parseNpmErrorCode, t as npmFailurePackageName } from "./npm-error-DcU9_CMV.mjs";
import { w as trimLogTail } from "./restart-sentinel-CWHFSDjo.mjs";
import { a as UPDATE_GLOBAL_PERMISSION_REASON } from "./update-outcome-BHX5xsqd.mjs";
import { i as normalizeUpdateFailureFacts, n as createUpdateErrorFact, r as createUpdateFailureFact } from "./update-failure-facts-CetdnXr-.mjs";
import { r as isFailedUpdateStep } from "./update-run-step-BDxgGAu8.mjs";
import { m as normalizeUpdatePostInstallDoctorWarnings, n as PACKAGE_POST_INSTALL_DOCTOR_ADVISORY } from "./update-doctor-result-yVslo54h.mjs";
import { n as resolveInstallWorkTimeoutMs } from "./install-mode-options-HTpLEgtT.mjs";
import { t as retainMutationAuthority } from "./mutation-authority-E8BC9dNY.mjs";
import { _ as removePackageUpdatePath, a as encodePackageActivationLauncher, c as assertPackagePathIdentity, d as copyPackagePathEntry, f as discardPackageLauncherBackup, g as removePackagePath, h as packagePathEntryExists, l as backupNpmPackageRoot, m as packagePathEntriesMatch, n as preparePackageActivation, o as PACKAGE_MANAGER_SWAP_SOURCE_HARDLINKS, p as discardPackageUpdateBackup, s as activateStagedNpmPackageRoot, u as capturePackageLaunchers, v as restoreNpmPackageRoot } from "./package-update-activation-B8eAkK7X.mjs";
import { t as UPDATE_CLEANUP_BUDGET_MS } from "./update-maintenance-BAtM5r2e.mjs";
import { t as readCurrentGitUpdateRecovery } from "./update-runner-git-recovery-D_EpkWBj.mjs";
import { a as packageIntegrityDifferences, c as readPackageVersionIfPresent, i as isPackageIntegrityResourceError, o as packageLauncherDifferences, r as createPackageIntegrityReader, t as PackageIntegrityMismatchError } from "./package-update-integrity-L4dZmnxP.mjs";
import { a as resolvePnpmCandidateEnv } from "./update-package-manager-D5vpWEG2.mjs";
import { c as relocateRuntimeSymlink, l as relocateRuntimeTree, o as relocateRuntimeLauncher, s as relocateRuntimePath, t as isLegacyPackageBackupName, u as verifyRuntimeLauncher } from "./package-update-backup-paths-DyfDj6A4.mjs";
import { t as isRegistrySourceInstallSpec } from "./install-spec-Cx8rRy1c.mjs";
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import fs$1 from "node:fs/promises";
import os from "node:os";
import { execFile } from "node:child_process";
import { isDeepStrictEqual } from "node:util";
import { createHash, randomUUID } from "node:crypto";
import { assertDirectoryIdentitySync, readDirectoryIdentity } from "@openclaw/fs-safe/advanced";
import { movePathWithCopyFallback } from "@openclaw/fs-safe/atomic";
//#region src/infra/package-update-manager-preflight.ts
async function resolveCanonicalPath(filePath) {
	return path.resolve(await fs$1.realpath(filePath).catch(() => filePath));
}
async function runPnpmPreflightProbe(params) {
	const startedAt = Date.now();
	const argv = [params.installTarget.command, ...params.args];
	const probeCwd = params.cwd ?? params.installTarget.globalRoot ?? void 0;
	const result = await params.runCommand(argv, {
		timeoutMs: params.timeoutMs,
		env: params.env,
		...probeCwd ? { cwd: probeCwd } : {}
	}).catch((error) => ({
		stdout: "",
		stderr: formatErrorMessage(error),
		code: 1
	}));
	return result.code === 0 ? {
		result,
		failedStep: null
	} : {
		result: null,
		failedStep: {
			name: params.name ?? "pnpm-isolated-install-preflight",
			command: argv.join(" "),
			cwd: probeCwd ?? process.cwd(),
			durationMs: Date.now() - startedAt,
			exitCode: result.code ?? 1,
			stdoutTail: result.stdout || null,
			stderrTail: result.stderr || `Unable to run ${argv.join(" ")}.`
		}
	};
}
async function validatePnpmIsolatedUpdate(params) {
	const owner = params.installTarget.pnpmIsolated;
	if (!owner) return {
		globalBinDir: null,
		failedStep: null
	};
	const failedStep = (stderrTail, command = `inspect ${params.installTarget.globalRoot ?? "pnpm install"}`, cwd = params.installTarget.globalRoot ?? process.cwd(), stdoutTail = null) => ({
		name: "pnpm-isolated-install-preflight",
		command,
		cwd,
		durationMs: 0,
		exitCode: 1,
		stdoutTail,
		stderrTail
	});
	const activePackages = await listActivePnpmIsolatedGlobalPackages({
		globalRoot: params.installTarget.globalRoot,
		packageName: params.packageName
	});
	const activePackageRoots = activePackages.map((entry) => entry.packageRoot);
	const siblingPackages = [...new Set(activePackages.flatMap((entry) => entry.packageNames.filter((name) => name !== params.packageName)))].toSorted((a, b) => a.localeCompare(b));
	if (siblingPackages.length > 0) return {
		globalBinDir: null,
		failedStep: failedStep(`OpenClaw shares a pnpm ${owner.layoutVersion} global install group with ${siblingPackages.join(", ")}. Automatic update stopped before mutation; update the group manually to preserve its sibling packages.`)
	};
	const invokingPackageRoot = params.installTarget.packageRoot;
	const invokingInstallOwner = await resolvePnpmIsolatedInstallOwner(invokingPackageRoot);
	const activeInstallOwners = await Promise.all(activePackageRoots.map((packageRoot) => resolvePnpmIsolatedInstallOwner(packageRoot)));
	const ownerMatchCount = invokingInstallOwner ? activeInstallOwners.filter((installOwner) => installOwner === invokingInstallOwner).length : 0;
	if (!invokingPackageRoot || activePackageRoots.length !== 1 || ownerMatchCount !== 1) return {
		globalBinDir: null,
		failedStep: failedStep(`Expected exactly one active pnpm ${owner.layoutVersion} OpenClaw install owned by the invoking project; found ${activePackageRoots.length} active installs and ${ownerMatchCount} owner matches. Automatic update stopped before mutation.`)
	};
	const rootProbe = await runPnpmPreflightProbe({
		...params,
		args: ["root", "-g"]
	});
	if (rootProbe.failedStep || !rootProbe.result) return {
		globalBinDir: null,
		failedStep: rootProbe.failedStep
	};
	const reportedGlobalRoot = readPackageManagerProbeValue(rootProbe.result.stdout);
	const expectedGlobalRoot = params.installTarget.globalRoot;
	if (!reportedGlobalRoot || !expectedGlobalRoot || await resolveCanonicalPath(reportedGlobalRoot) !== await resolveCanonicalPath(expectedGlobalRoot)) return {
		globalBinDir: null,
		failedStep: failedStep(`The active pnpm command owns ${reportedGlobalRoot || "an unknown global root"}, not the invoking OpenClaw install at ${expectedGlobalRoot ?? "an unknown root"}. Automatic update stopped before mutation.`, `${params.installTarget.command} root -g`, expectedGlobalRoot ?? process.cwd(), rootProbe.result.stdout || null)
	};
	const binProbe = await runPnpmPreflightProbe({
		...params,
		args: ["bin", "-g"]
	});
	const globalBinDir = binProbe.result ? readPackageManagerProbeValue(binProbe.result.stdout) || null : null;
	if (binProbe.failedStep || !globalBinDir) return {
		globalBinDir: null,
		failedStep: binProbe.failedStep ?? failedStep("The owning pnpm command did not report its global bin directory.", `${params.installTarget.command} bin -g`, expectedGlobalRoot)
	};
	return {
		globalBinDir,
		failedStep: null
	};
}
async function existingDirectory(target) {
	let directory = path.resolve(target);
	while (true) {
		try {
			if ((await fs$1.stat(directory)).isDirectory()) return directory;
		} catch (error) {
			if (!hasErrnoCode(error, "ENOENT") && !hasErrnoCode(error, "ENOTDIR")) return directory;
		}
		const parent = path.dirname(directory);
		if (parent === directory) return directory;
		directory = parent;
	}
}
async function permissionFailure(step, directory, code, env) {
	const stat = await fs$1.stat(directory).catch(() => null);
	const message = `Package update cannot write ${directory} (${code}; ${process.platform === "win32" || !stat ? "owner unavailable" : `owner UID ${stat.uid}${stat.uid === 0 ? " (root)" : ""}, GID ${stat.gid}`}). ${process.platform !== "win32" && stat && stat.uid === process.getuid?.() ? `Run \`chmod u+rwx ${quoteCliArg(directory)}\`, then rerun \`openclaw update\`.` : "Run the package update as the directory's owning account, keeping the Gateway's existing state/configuration; or ask that account to grant you write access, then rerun `openclaw update`."}`;
	return {
		...step,
		stderrTail: message,
		failureFacts: [createUpdateFailureFact({
			check: "package-install",
			code: UPDATE_GLOBAL_PERMISSION_REASON,
			message
		}, env), ...(step.failureFacts ?? []).slice(0, 4)]
	};
}
/** Inspect the directories npm staging and launcher publication must write, without creating a probe. */
async function checkGlobalPackageUpdatePermissions(target, env) {
	if (target.manager !== "npm" || !target.globalRoot) return null;
	const layout = resolveNpmGlobalPrefixLayoutFromGlobalRoot(target.globalRoot, { allowDirectNodeModulesRoot: target.directNodeModulesRoot === true });
	for (const candidate of /* @__PURE__ */ new Set([target.globalRoot, ...layout ? [layout.binDir] : []])) {
		const directory = await existingDirectory(candidate);
		try {
			await fs$1.access(directory, fs$1.constants.W_OK | fs$1.constants.X_OK);
		} catch (error) {
			if (hasErrnoCode(error, "EACCES") || hasErrnoCode(error, "EPERM")) return await permissionFailure({
				name: "package-permissions",
				command: "inspect npm global directories",
				cwd: directory,
				durationMs: 0,
				exitCode: 1
			}, directory, hasErrnoCode(error, "EACCES") ? "EACCES" : "EPERM", env);
		}
	}
	return null;
}
/** Keep real install/staging errors actionable even when permissions change after admission. */
async function classifyPackageUpdatePermissionFailure(step, target, env, error) {
	const text = step.stderrTail ?? "";
	const code = isErrno(error) ? error.code : step.failureFacts?.find((fact) => fact.check === "npm")?.code ?? parseNpmErrorCode(text);
	if (step.exitCode === 0 || code !== "EACCES" && code !== "EPERM") return step;
	const reportedPath = (isErrno(error) ? error.path : void 0) ?? text.match(/(?:^|\n)npm (?:ERR!|error) path (.+)/u)?.[1] ?? text.match(/(?:mkdir|mkdtemp|rename|unlink|open|scandir) '([^']+)'/u)?.[1];
	const targetPath = reportedPath && path.isAbsolute(reportedPath) ? reportedPath : target.globalRoot;
	if (!targetPath) return step;
	return await permissionFailure(step, await existingDirectory(reportedPath && /\b(rename|unlink)\b/u.test(text) ? path.dirname(targetPath) : targetPath), code, env);
}
//#endregion
//#region src/infra/update-native-package-stage.ts
var NativePackageRollbackError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.reason = "rollback-project-changed";
	}
};
async function nativeProjectFingerprint(root, excludePackage) {
	const fingerprint = /* @__PURE__ */ new Map();
	const record = (file, value) => {
		fingerprint.set(path.relative(root, file), sha256Hex(value));
	};
	const manifests = /* @__PURE__ */ new Set([
		"package.json",
		"pnpm-lock.yaml",
		"pnpm-workspace.yaml",
		"bun.lock",
		"bun.lockb",
		".npmrc",
		".pnpmfile.cjs",
		"bunfig.toml"
	]);
	async function visit(directory, depth) {
		const entries = await fs$1.readdir(directory, { withFileTypes: true });
		for (const entry of entries.toSorted((a, b) => a.name.localeCompare(b.name))) {
			const file = path.join(directory, entry.name);
			if (entry.name === "node_modules") {
				if (excludePackage) await packages(file);
			} else if (entry.isSymbolicLink()) record(file, await fs$1.readlink(file));
			else if (entry.isFile() && manifests.has(entry.name)) record(file, await fs$1.readFile(file, "base64"));
			else if (entry.isDirectory() && (depth === 1 || depth === 0 && /^v?\d+$/u.test(entry.name))) await visit(file, depth + 1);
		}
	}
	async function packages(directory, scope = "") {
		for (const entry of await fs$1.readdir(directory, { withFileTypes: true })) {
			const name = `${scope}${entry.name}`;
			if (entry.name.startsWith(".") || name === excludePackage) continue;
			const file = path.join(directory, entry.name);
			if (!scope && entry.name.startsWith("@") && entry.isDirectory()) await packages(file, `${entry.name}/`);
			else if (entry.isSymbolicLink()) record(file, await fs$1.readlink(file));
			else {
				const manifest = await fs$1.readFile(path.join(file, "package.json"), "base64").catch((error) => {
					if (hasErrnoCode(error, "ENOENT") || hasErrnoCode(error, "ENOTDIR")) return "";
					throw error;
				});
				record(file, manifest);
			}
		}
	}
	await visit(root, 0);
	return fingerprint;
}
function resolveNativeInstallSpecFromCwd(spec, packageName, sourceCwd, manager) {
	const trimmed = spec.trim();
	const aliasPrefix = `${packageName.trim()}@`;
	const hasAlias = trimmed.toLowerCase().startsWith(aliasPrefix.toLowerCase());
	const targetSpec = hasAlias ? trimmed.slice(aliasPrefix.length).trim() : trimmed;
	const windowsPath = /^[a-z]:[\\/]/iu.test(sourceCwd) || sourceCwd.startsWith("\\\\");
	const paths = windowsPath ? path.win32 : path;
	const localProtocol = /^(file:|git\+file:|link:)(.*)$/iu.exec(targetSpec);
	if (localProtocol) {
		const protocol = localProtocol[1] ?? "";
		if (manager === "bun" && protocol.toLowerCase() === "link:") return spec;
		const target = localProtocol[2]?.trim() ?? "";
		const fragmentIndex = protocol.toLowerCase() === "git+file:" ? target.indexOf("#") : -1;
		const targetPath = fragmentIndex >= 0 ? target.slice(0, fragmentIndex) : target;
		const fragment = fragmentIndex >= 0 ? target.slice(fragmentIndex) : "";
		const resolvedTarget = targetPath && !/^~[\\/]/u.test(targetPath) && !path.isAbsolute(targetPath) && !path.win32.isAbsolute(targetPath) ? paths.resolve(sourceCwd, targetPath) : targetPath;
		if (protocol.toLowerCase() === "git+file:") return resolvedTarget === targetPath ? spec : `${hasAlias ? aliasPrefix : ""}git+${pathToFileURL(resolvedTarget, { windows: windowsPath }).href}${fragment}`;
		return `${aliasPrefix}${protocol}${resolvedTarget}`;
	}
	const isPath = /^(?:\.{1,2}|~)(?:[\\/]|$)/u.test(targetSpec) || path.isAbsolute(targetSpec) || path.win32.isAbsolute(targetSpec);
	if (!isPath && (hasAlias || /[:@]/u.test(targetSpec) || !/\.(?:tgz|tar\.gz)$/iu.test(targetSpec))) return spec;
	const target = isPath && !/^\.{1,2}(?:[\\/]|$)/u.test(targetSpec) ? targetSpec : paths.resolve(sourceCwd, targetSpec);
	return `${aliasPrefix}${manager === "bun" || /\.(?:tgz|tar\.gz|tar)$/iu.test(target) ? "file" : "link"}:${target}`;
}
/** Stage a native global project without changing its live package, metadata, or launchers. */
async function prepareNativePackageStage(params) {
	const { installTarget } = params;
	if (installTarget.manager === "npm" || !installTarget.globalRoot) return null;
	if (installTarget.manager === "bun" && process.platform === "win32") throw new Error(`Bun Windows binary launchers cannot be relocated by the staged updater. Run \`bun add -g --trust ${params.installSpec}\` manually, then \`openclaw gateway restart\`; verify with \`openclaw update status\`.`);
	const env = installTarget.manager === "pnpm" ? resolvePnpmCandidateEnv(params.env ?? process.env, ".pnpm") : { ...params.env ?? process.env };
	const bunOwner = installTarget.manager === "bun" ? resolveBunGlobalInstallOwner(installTarget.packageRoot, env) : null;
	const ownerRoot = resolveNativePackageProjectRoot(installTarget, env);
	const liveBinDir = params.globalBinDir?.trim();
	if (!ownerRoot || !liveBinDir) throw new Error(`Unable to resolve the native ${installTarget.manager} project and bin directories before staging.`);
	const liveProjectRoot = await fs$1.realpath(ownerRoot);
	const fingerprint = await nativeProjectFingerprint(liveProjectRoot);
	const projectRoot = await fs$1.mkdtemp(path.join(path.dirname(liveProjectRoot), `.${path.basename(params.packageName)}-update-native-`));
	let binDir;
	try {
		binDir = await fs$1.mkdtemp(`${projectRoot}.bin-`);
		await fs$1.cp(liveProjectRoot, projectRoot, {
			recursive: true,
			verbatimSymlinks: true
		});
		await fs$1.chmod(projectRoot, (await fs$1.stat(liveProjectRoot)).mode);
		const relocations = [{
			sourceRoot: liveProjectRoot,
			destinationRoot: projectRoot,
			sourceAliases: [ownerRoot]
		}];
		if (installTarget.manager === "pnpm" && path.basename(installTarget.globalRoot) === "node_modules") {
			const privateStore = path.join(projectRoot, path.relative(ownerRoot, path.dirname(installTarget.globalRoot)), ".pnpm");
			if ((await fs$1.lstat(privateStore).catch((error) => {
				if (hasErrnoCode(error, "ENOENT")) return;
				throw error;
			}))?.isSymbolicLink()) {
				const sourceRoot = await fs$1.realpath(privateStore);
				await fs$1.unlink(privateStore);
				await fs$1.cp(sourceRoot, privateStore, {
					recursive: true,
					verbatimSymlinks: true
				});
				relocations.unshift({
					sourceRoot,
					destinationRoot: privateStore
				});
			}
		}
		await relocateRuntimeTree(projectRoot, liveProjectRoot, projectRoot, relocations);
		const configArgs = installTarget.manager === "pnpm" ? [`--config.global-dir=${projectRoot}`, `--config.global-bin-dir=${binDir}`] : [];
		if (installTarget.manager === "pnpm") {
			env.pnpm_config_global_bin_dir = binDir;
			env.PNPM_CONFIG_GLOBAL_BIN_DIR = binDir;
		}
		if (installTarget.manager === "bun") {
			env.BUN_INSTALL_GLOBAL_DIR = projectRoot;
			env.BUN_INSTALL_BIN = binDir;
			if (bunOwner?.bunInstall) env.BUN_INSTALL = bunOwner.bunInstall;
		}
		const pathKey = Object.keys(env).find((key) => key.toUpperCase() === "PATH") ?? "PATH";
		env[pathKey] = mergePathPrepend(env[pathKey], [binDir]);
		return {
			projectRoot,
			liveProjectRoot,
			binDir,
			liveBinDir: path.resolve(liveBinDir),
			globalRoot: path.join(projectRoot, path.relative(ownerRoot, installTarget.globalRoot)),
			env,
			configArgs,
			assertUnchanged: async () => {
				if (!isDeepStrictEqual(await nativeProjectFingerprint(liveProjectRoot), fingerprint)) throw new Error("The native global installation changed before activation; retry the update.");
			}
		};
	} catch (error) {
		await fs$1.rm(projectRoot, {
			recursive: true,
			force: true
		});
		if (binDir) await fs$1.rm(binDir, {
			recursive: true,
			force: true
		});
		throw error;
	}
}
/** Prepare copied paths for the live location after candidate validation, before service stop. */
async function finalizeNativePackageStage(stage, packageName) {
	await stage.assertUnchanged();
	const relocations = [{
		sourceRoot: stage.projectRoot,
		destinationRoot: stage.liveProjectRoot
	}];
	await relocateRuntimeTree(stage.projectRoot, stage.projectRoot, stage.liveProjectRoot, relocations);
	for (const entry of await fs$1.readdir(stage.binDir, { withFileTypes: true })) {
		const file = path.join(stage.binDir, entry.name);
		const destinationFile = path.join(stage.liveBinDir, entry.name);
		if (entry.isSymbolicLink()) await relocateRuntimeSymlink(file, file, destinationFile, relocations);
		else if (entry.isFile()) await relocateRuntimeLauncher(file, file, destinationFile, relocations);
	}
	const fingerprint = await nativeProjectFingerprint(stage.projectRoot, packageName);
	return async () => {
		const current = await nativeProjectFingerprint(stage.liveProjectRoot, packageName);
		const changed = [.../* @__PURE__ */ new Set([...fingerprint.keys(), ...current.keys()])].filter((name) => fingerprint.get(name) !== current.get(name));
		if (changed.length) {
			const names = [...new Set(changed.map((name) => path.basename(name)))].toSorted();
			throw new NativePackageRollbackError(`Global project changed since staging: ${names.slice(0, 20).map((name) => name.slice(0, 80)).join(", ")}${names.length > 20 ? ", …" : ""}`);
		}
	};
}
//#endregion
//#region src/infra/package-update-lifecycle.ts
async function resolveNpmUpdateLifecyclePolicy(params) {
	const gate = resolveNpmLifecyclePolicyGate(params.installTarget);
	if (!gate.error) return {
		policy: gate.policy,
		failedStep: null
	};
	const argv = [params.installTarget.command, "--version"];
	const version = params.installTarget.npmOwner?.version ?? "";
	return {
		policy: null,
		failedStep: {
			name: "npm-lifecycle-policy-preflight",
			command: argv.join(" "),
			cwd: process.cwd(),
			durationMs: 0,
			exitCode: 1,
			stdoutTail: version || null,
			stderrTail: gate.error
		}
	};
}
/** Adapt lifecycle ownership refusal without flattening it into removable stage failure. */
async function runPackageUpdateLifecycle(params) {
	const env = params.nodeRunner && path.isAbsolute(params.nodeRunner) ? {
		...params.env,
		PATH: mergePathPrepend(resolveEnvironmentValue(params.env ?? process.env, "PATH"), [path.dirname(params.nodeRunner)])
	} : params.env;
	let failedScript = null;
	try {
		await completePendingPackageLifecycle({
			packageRoot: params.packageRoot,
			timeoutMs: params.timeoutMs,
			runScript: async (script) => {
				const step = await params.runStep({
					name: `${params.manager}-package-${script.name}`,
					argv: [params.nodeRunner ?? process.execPath, path.join(params.packageRoot, script.relativePath)],
					cwd: params.packageRoot,
					env,
					timeoutMs: resolveInstallWorkTimeoutMs(params.workTimeoutMs, params.timeoutMs)
				});
				params.steps.push(step);
				if (isFailedUpdateStep(step)) {
					failedScript = step;
					throw new Error(step.stderrTail ?? `${step.name} failed`);
				}
			}
		});
		await params.verifyCompleted();
		return { status: "complete" };
	} catch (error) {
		const preserveStage = error instanceof PackageLifecycleOwnershipError && error.packageRoot === path.resolve(params.packageRoot);
		if (failedScript && !preserveStage) return {
			status: "failed",
			step: failedScript,
			preserveStage: false
		};
		const step = {
			name: `${params.manager}-package-lifecycle`,
			command: `complete ${params.packageRoot}`,
			cwd: params.packageRoot,
			durationMs: 0,
			exitCode: 1,
			stderrTail: formatErrorMessage(error)
		};
		params.steps.push(step);
		return {
			status: "failed",
			step,
			preserveStage
		};
	}
}
async function prepareStagedPackageInstall(installTarget, packageName, nativeOptions) {
	const startedAt = Date.now();
	try {
		if (nativeOptions) {
			const native = await prepareNativePackageStage({
				installTarget,
				packageName,
				...nativeOptions
			});
			if (!native) throw new Error("Cannot resolve the native package manager's staging owner.");
			const packageRoot = path.join(native.globalRoot, packageName);
			return {
				stagedInstall: {
					prefix: native.projectRoot,
					layout: {
						prefix: native.projectRoot,
						globalRoot: native.globalRoot,
						binDir: native.binDir
					},
					packageRoot,
					installTarget: {
						...installTarget,
						globalRoot: native.globalRoot,
						packageRoot
					},
					native
				},
				failedStep: null
			};
		}
		return {
			stagedInstall: await createStagedPackageInstall(installTarget, packageName),
			failedStep: null
		};
	} catch (err) {
		const targetLayout = installTarget.manager === "npm" ? resolveNpmGlobalPrefixLayoutFromGlobalRoot(installTarget.globalRoot, { allowDirectNodeModulesRoot: installTarget.directNodeModulesRoot === true }) : null;
		return {
			stagedInstall: null,
			failedStep: await classifyPackageUpdatePermissionFailure({
				name: "package-stage",
				command: `prepare staged ${installTarget.manager} install`,
				cwd: targetLayout?.prefix ?? installTarget.globalRoot ?? process.cwd(),
				durationMs: Date.now() - startedAt,
				exitCode: 1,
				stdoutTail: null,
				stderrTail: formatErrorMessage(err)
			}, installTarget, nativeOptions?.env, err)
		};
	}
}
async function createStagedPackageInstall(installTarget, packageName) {
	const targetLayout = resolveNpmGlobalPrefixLayoutFromGlobalRoot(installTarget.globalRoot, { allowDirectNodeModulesRoot: installTarget.directNodeModulesRoot === true });
	if (!targetLayout) throw new Error(`The ${installTarget.manager} global install layout cannot prepare the update. Reinstall with ${installTarget.manager} into its default global layout, then retry the update.`);
	await fs$1.mkdir(targetLayout.globalRoot, { recursive: true });
	const prefix = await fs$1.mkdtemp(path.join(targetLayout.globalRoot, ".openclaw.update-stage-"));
	const layout = resolveNpmGlobalPrefixLayoutFromPrefix(prefix);
	return {
		prefix,
		layout,
		packageRoot: path.join(layout.globalRoot, packageName),
		installTarget: {
			manager: "npm",
			command: installTarget.command,
			globalRoot: layout.globalRoot,
			packageRoot: path.join(layout.globalRoot, packageName)
		}
	};
}
var PackageStageRemovalError = class extends Error {};
async function cleanupStagedPackageInstall(stage) {
	const discard = async () => {
		if (!await removePackageUpdatePath(stage.prefix)) throw new PackageStageRemovalError(`Unable to remove discarded package stage ${stage.prefix}`);
		if (stage.native) await removePackageUpdatePath(stage.native.binDir);
	};
	const prefix = await fs$1.realpath(stage.prefix).catch((error) => {
		if (hasErrnoCode(error, "ENOENT")) return null;
		throw error;
	});
	const candidates = [stage.packageRoot];
	if (prefix && stage.native && stage.installTarget.pnpmIsolated) {
		const entries = await fs$1.readdir(stage.native.globalRoot, { withFileTypes: true }).catch((error) => {
			if (hasErrnoCode(error, "ENOENT")) return [];
			throw error;
		});
		for (const entry of entries) if (entry.isDirectory() || entry.isSymbolicLink()) candidates.push(path.join(stage.native.globalRoot, entry.name, "node_modules", path.basename(stage.packageRoot)));
	}
	const packageRoots = /* @__PURE__ */ new Set();
	if (prefix) for (const candidate of candidates) {
		const packageRoot = await fs$1.realpath(candidate).catch((error) => {
			if (hasErrnoCode(error, "ENOENT") || hasErrnoCode(error, "ENOTDIR")) return null;
			throw error;
		});
		if (packageRoot && isPathInside(prefix, packageRoot) && (await fs$1.stat(packageRoot)).isDirectory()) packageRoots.add(packageRoot);
	}
	await discardPendingPackageLifecycle({
		packageRoots: [...packageRoots],
		discard
	});
}
/** Dispose only after pending work is retired under its lifecycle generation. */
async function discardPackageUpdateStage(params) {
	try {
		await cleanupStagedPackageInstall(params.stage);
		return { status: "complete" };
	} catch (error) {
		if (params.committed && error instanceof PackageStageRemovalError) {
			const message = `${error.message}. Installation verification succeeded; inspect the retained stage before removing it manually.`;
			return {
				status: "advisory",
				step: {
					name: "package-stage-cleanup",
					command: `discard ${params.stage.prefix}`,
					cwd: params.stage.prefix,
					durationMs: 0,
					exitCode: 1,
					stderrTail: message,
					advisory: {
						kind: "recoverable-maintenance",
						message
					}
				}
			};
		}
		return {
			status: "failed",
			preserveStage: true,
			step: {
				name: `${params.manager}-package-lifecycle`,
				command: `discard ${params.stage.packageRoot}`,
				cwd: params.stage.packageRoot,
				durationMs: 0,
				exitCode: 1,
				stderrTail: formatErrorMessage(error)
			}
		};
	}
}
/** A retained or discarded stage cannot establish the prior runtime's safety. */
async function verifyUnchangedPackageUpdateRecovery(packageRoot, initialRecovery) {
	if (!initialRecovery.serviceRestartSafe) return initialRecovery;
	const recovery = await verifyPackageUpdateRecovery(packageRoot);
	return recovery.serviceRestartSafe && recovery.version === initialRecovery.version ? recovery : {
		serviceRestartSafe: false,
		reason: "runtime-verification-failed"
	};
}
//#endregion
//#region src/infra/package-update-npm-pack.ts
const NPM_PACK_QUIET_FLAGS = ["--json", "--loglevel=error"];
function stripPackageAlias(spec, packageName) {
	const trimmed = spec.trim();
	const prefix = `${packageName.trim()}@`;
	return trimmed.toLowerCase().startsWith(prefix.toLowerCase()) ? trimmed.slice(prefix.length).trim() : trimmed;
}
function isHttpGitUrlSpec(spec) {
	try {
		const url = new URL(spec);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const pathname = url.pathname.replace(/\/+$/u, "");
		if (pathname.endsWith(".git")) return true;
		const parts = pathname.split("/").filter(Boolean);
		return url.hostname.toLowerCase() === "github.com" && parts.length === 2;
	} catch {
		return false;
	}
}
function isGitHubShorthandSpec(spec) {
	const [repo] = spec.split("#", 1);
	if (!repo || repo.startsWith(".") || repo.startsWith("/") || repo.startsWith("@")) return false;
	const parts = repo.split("/");
	return parts.length === 2 && parts.every((part) => /^[^\s/:@]+$/u.test(part));
}
function isNpmGitSourceInstallSpec(spec, packageName) {
	const target = stripPackageAlias(spec, packageName);
	return /^github:/i.test(target) || /^git\+(?:ssh|https|http|file):/i.test(target) || /^git:/i.test(target) || /^ssh:\/\//i.test(target) || /^[^@\s]+@[^:\s]+:[^#\s]+(?:#.*)?$/u.test(target) || isHttpGitUrlSpec(target) || isGitHubShorthandSpec(target);
}
async function findPackedTarball(packDir) {
	const tarballs = (await fs$1.readdir(packDir).catch(() => [])).filter((entry) => entry.endsWith(".tgz"));
	if (tarballs.length !== 1) return null;
	return path.join(packDir, tarballs[0] ?? "");
}
async function prepareNpmGitSourceInstallSpec(params) {
	const result = {
		installSpec: params.installSpec,
		installCwd: params.installCwd ?? null,
		packDir: null,
		steps: [],
		failedStep: null
	};
	if (params.installTarget.manager !== "npm" || !isNpmGitSourceInstallSpec(params.installSpec, params.packageName)) return result;
	const packDir = await fs$1.mkdtemp(path.join(os.tmpdir(), "openclaw-update-pack-"));
	result.packDir = packDir;
	const packStep = await params.runStep({
		name: "package-pack",
		argv: [
			params.installTarget.command,
			"pack",
			params.installSpec,
			"--pack-destination",
			packDir,
			...NPM_PACK_QUIET_FLAGS
		],
		cwd: params.installCwd,
		env: params.env,
		timeoutMs: params.timeoutMs
	});
	result.steps.push(packStep);
	if (isFailedUpdateStep(packStep)) {
		result.failedStep = packStep;
		return result;
	}
	const tarball = await findPackedTarball(packDir);
	if (!tarball) {
		const failedStep = {
			name: "package-pack-verify",
			command: `find packed tarball in ${packDir}`,
			cwd: packDir,
			durationMs: 0,
			exitCode: 1,
			stdoutTail: null,
			stderrTail: `expected exactly one .tgz from npm pack ${params.installSpec}`
		};
		result.steps.push(failedStep);
		result.failedStep = failedStep;
		return result;
	}
	result.installSpec = tarball;
	result.installCwd = packDir;
	return result;
}
//#endregion
//#region src/infra/package-update-swap-contract.ts
var PackageUpdateActivationError = class extends Error {
	constructor(cause) {
		super("Package activation preparation failed", { cause });
	}
};
//#endregion
//#region src/infra/package-local-overrides-shared.ts
function emptyResult(status) {
	return {
		status,
		added: 0,
		modified: 0,
		deleted: 0,
		applied: 0,
		conflicts: [],
		warnings: []
	};
}
async function packageRootExists(packageRoot) {
	try {
		await fs$1.lstat(packageRoot);
		return true;
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return false;
		throw error;
	}
}
async function probeLocalOverrideTarget(targetPath) {
	try {
		const stats = await fs$1.lstat(targetPath, { bigint: true });
		return {
			status: "present",
			hardlinked: stats.nlink > 1n,
			mode: Number(stats.mode & 511n),
			safeFile: stats.isFile() && !stats.isSymbolicLink()
		};
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return { status: "missing" };
		if (hasErrnoCode(error, "ENOTDIR")) return { status: "blocked" };
		return { status: "error" };
	}
}
async function resolveLocalOverrideTopologyPath(packageRoot, realPackageRoot, relativePath) {
	const segments = normalizeDistPath(relativePath).split("/");
	for (let existingSegmentCount = segments.length; existingSegmentCount >= 0; existingSegmentCount--) {
		const existingPath = path.join(packageRoot, ...segments.slice(0, existingSegmentCount));
		try {
			const realExistingPath = await fs$1.realpath(existingPath);
			const resolvedTopologyPath = path.resolve(realExistingPath, ...segments.slice(existingSegmentCount));
			if (resolvedTopologyPath === realPackageRoot || resolvedTopologyPath.startsWith(`${realPackageRoot}${path.sep}`)) return resolvedTopologyPath;
			throw new Error(`local override topology escapes package root: ${relativePath}`);
		} catch (error) {
			if (!isMissingPathError(error)) throw error;
		}
	}
	throw new Error(`could not resolve local override topology for ${relativePath}`);
}
async function resolvePathTopology(targetPath) {
	const missingSegments = [];
	let currentPath = path.resolve(targetPath);
	while (true) try {
		return path.resolve(await fs$1.realpath(currentPath), ...missingSegments);
	} catch (error) {
		if (!isMissingPathError(error)) throw error;
		const parentPath = path.dirname(currentPath);
		if (parentPath === currentPath) throw error;
		missingSegments.unshift(path.basename(currentPath));
		currentPath = parentPath;
	}
}
async function assertRecoveryRootOutsidePackageRoot(packageRoot, recoveryRoot) {
	const [resolvedPackageRoot, resolvedRecoveryRoot] = await Promise.all([resolvePathTopology(packageRoot), resolvePathTopology(recoveryRoot)]);
	if (resolvedRecoveryRoot === resolvedPackageRoot || resolvedRecoveryRoot.startsWith(`${resolvedPackageRoot}${path.sep}`)) throw new Error(`local override recovery root must be outside package root: ${recoveryRoot}`);
}
function countChanges(changes) {
	return {
		added: changes.filter((change) => change.kind === "added").length,
		modified: changes.filter((change) => change.kind === "modified").length,
		deleted: changes.filter((change) => change.kind === "deleted").length
	};
}
function normalizeLocalOverridePathSeparators(relativePath) {
	return relativePath.replace(/\\/g, "/");
}
function normalizeDistPath(relativePath) {
	return normalizeLocalOverridePathSeparators(path.posix.normalize(relativePath));
}
function resolveSafePackagePath(packageRoot, relativePath) {
	const normalized = normalizeDistPath(relativePath);
	if (!normalized.startsWith("dist/") || normalized.includes("\0")) throw new Error(`unsafe local override path: ${relativePath}`);
	const resolved = path.resolve(packageRoot, normalized);
	const root = path.resolve(packageRoot);
	if (resolved !== root && resolved.startsWith(`${root}${path.sep}`)) return resolved;
	throw new Error(`local override path escapes package root: ${relativePath}`);
}
async function assertLocalOverrideMutationTopology(params) {
	if (await resolveLocalOverrideTopologyPath(params.packageRoot, params.realPackageRoot, params.relativePath) !== path.resolve(params.realPackageRoot, normalizeDistPath(params.relativePath))) throw new Error(`local override topology changed: ${params.relativePath}`);
}
async function inspectLocalOverrideTarget(params) {
	const target = await params.packageFs.read(params.relativePath, {
		hardlinks: "reject",
		maxBytes: params.expectedSize,
		symlinks: "reject"
	});
	return {
		mode: normalizeFileMode(target.stat.mode),
		sha256: createHash("sha256").update(target.buffer).digest("hex")
	};
}
async function buildLocalOverrideInventoryEntry(params) {
	const content = await fs$1.readFile(params.sourcePath);
	const stats = await fs$1.stat(params.sourcePath);
	return {
		path: params.relativePath,
		sha256: createHash("sha256").update(content).digest("hex"),
		mode: params.mode ?? normalizeFileMode(stats.mode),
		size: content.length
	};
}
function normalizeFileMode(mode) {
	return mode & 511;
}
function fileModesHaveSameExecutableSemantics(left, right) {
	return process.platform === "win32" || Boolean(normalizeFileMode(left) & 73) === Boolean(normalizeFileMode(right) & 73);
}
function mergeLocalOverrideFileMode(targetMode, overrideMode) {
	return normalizeFileMode(targetMode) & -74 | normalizeFileMode(overrideMode) & 73;
}
async function writeFileWithMode(content, destination, mode) {
	await fs$1.mkdir(path.dirname(destination), { recursive: true });
	await fs$1.writeFile(destination, content);
	if (mode !== void 0 && process.platform !== "win32") await fs$1.chmod(destination, mode);
}
//#endregion
//#region src/infra/package-local-overrides-preflight.ts
async function preflightLocalOverrides(params) {
	const nextInventory = new Map((await readPackageDistContentInventoryIfPresent(params.packageRoot) ?? []).map((entry) => [entry.path, entry]));
	const packageFs = await root(params.packageRoot, {
		hardlinks: "reject",
		symlinks: "reject"
	});
	const conflicts = [];
	for (const change of params.plan.changes) {
		const targetPath = resolveSafePackagePath(params.packageRoot, change.path);
		const nextEntry = nextInventory.get(change.path);
		const targetProbe = await probeLocalOverrideTarget(targetPath);
		if (targetProbe.status === "error") {
			conflicts.push({
				path: change.path,
				reason: "target-inspection-failed"
			});
			continue;
		}
		if (change.kind === "added") {
			if (nextEntry || targetProbe.status !== "missing") conflicts.push({
				path: change.path,
				reason: "target-exists"
			});
			continue;
		}
		if (!change.baseline) {
			conflicts.push({
				path: change.path,
				reason: "target-missing"
			});
			continue;
		}
		if (targetProbe.status === "blocked") {
			conflicts.push({
				path: change.path,
				reason: "target-changed"
			});
			continue;
		}
		if (!nextEntry || targetProbe.status === "missing") {
			if (change.kind === "deleted" && targetProbe.status === "missing") continue;
			conflicts.push({
				path: change.path,
				reason: nextEntry && targetProbe.status === "missing" ? "target-missing" : "target-changed"
			});
			continue;
		}
		if (!targetProbe.safeFile) {
			conflicts.push({
				path: change.path,
				reason: "target-changed"
			});
			continue;
		}
		if (targetProbe.hardlinked) {
			conflicts.push({
				path: change.path,
				reason: "target-hardlinked"
			});
			continue;
		}
		let targetInspection;
		try {
			targetInspection = await inspectLocalOverrideTarget({
				packageFs,
				relativePath: change.path,
				expectedSize: nextEntry.size
			});
		} catch (error) {
			conflicts.push({
				path: change.path,
				reason: error instanceof FsSafeError && error.code === "too-large" ? "target-changed" : "target-inspection-failed"
			});
			continue;
		}
		if (nextEntry.sha256 !== change.baseline.sha256 || targetInspection.sha256 !== nextEntry.sha256 || !fileModesHaveSameExecutableSemantics(nextEntry.mode, change.baseline.mode) || !fileModesHaveSameExecutableSemantics(targetInspection.mode, nextEntry.mode)) conflicts.push({
			path: change.path,
			reason: "target-changed"
		});
	}
	const conflictingPaths = new Set(conflicts.map((conflict) => conflict.path));
	if (conflictingPaths.size > 0) {
		for (const change of params.plan.changes) {
			if (conflictingPaths.has(change.path)) continue;
			conflicts.push({
				path: change.path,
				reason: "target-changed"
			});
			conflictingPaths.add(change.path);
		}
		return conflicts;
	}
	let topologyResolutionFailed = false;
	for (const change of params.plan.changes) try {
		await resolveLocalOverrideTopologyPath(params.packageRoot, params.realPackageRoot, change.path);
	} catch {
		topologyResolutionFailed = true;
	}
	if (topologyResolutionFailed) for (const change of params.plan.changes) conflicts.push({
		path: change.path,
		reason: "target-inspection-failed"
	});
	return conflicts;
}
function localOverrideInspectionConflict(plan) {
	return {
		...plan.result,
		status: "conflict",
		applied: 0,
		conflicts: plan.changes.map((change) => ({
			path: change.path,
			reason: "target-inspection-failed"
		})),
		warnings: ["Local OpenClaw changes were preserved but not reapplied because the updated package could not be safely inspected."]
	};
}
//#endregion
//#region src/infra/package-local-overrides-capture.ts
async function copyOverridePayload(params) {
	const source = await params.packageFs.read(params.relativePath, {
		hardlinks: "allow",
		maxBytes: Number.POSITIVE_INFINITY,
		symlinks: "reject"
	});
	const mode = normalizeFileMode(source.stat.mode);
	const savedPath = path.join(params.recoveryDir, "files", normalizeLocalOverridePathSeparators(params.relativePath));
	await writeFileWithMode(source.buffer, savedPath, mode);
	return {
		savedPath,
		mode
	};
}
const BEST_EFFORT_LOCAL_PATH_LITERAL_PATTERN = /["'`]([^"'`\r\n]+)["'`]/gu;
const CONTENT_HASHED_DIST_ARTIFACT_PATTERN = /-([A-Za-z0-9_]{8,})\.(?:cjs|css|js|mjs)(?:\.map)?$/u;
function isLikelyContentHashedDistArtifact(relativePath) {
	const filename = path.posix.basename(normalizeDistPath(relativePath));
	return CONTENT_HASHED_DIST_ARTIFACT_PATTERN.test(filename);
}
function resolveReferencedDistPath(params) {
	const specifierPath = params.specifier.split(/[?#]/u, 1)[0] ?? "";
	if (!specifierPath.startsWith(".")) return null;
	const basePath = normalizeDistPath(path.posix.join(path.posix.dirname(params.fromPath), specifierPath));
	return [
		basePath,
		`${basePath}.js`,
		`${basePath}.mjs`,
		`${basePath}.cjs`,
		`${basePath}.json`,
		path.posix.join(basePath, "index.js")
	].find((candidate) => params.actualSet.has(candidate)) ?? null;
}
async function collectReferencedAddedOverridePaths(params) {
	const addedPaths = /* @__PURE__ */ new Set();
	const dependenciesByChangePath = /* @__PURE__ */ new Map();
	const scannedPathsByRoot = /* @__PURE__ */ new Set();
	const modifiedChangesByPath = new Map(params.changes.filter((change) => change.kind === "modified" && change.savedPath).map((change) => [change.path, change]));
	const queue = [...params.changes.flatMap((change) => change.kind === "modified" && change.savedPath ? [{
		path: change.path,
		rootPath: change.path,
		sourcePath: change.savedPath
	}] : []), ...params.standaloneAddedPaths.map((relativePath) => ({
		path: relativePath,
		rootPath: relativePath,
		packageRelativePath: relativePath
	}))];
	for (const current of queue) {
		const scanKey = `${current.rootPath}\0${current.path}`;
		if (scannedPathsByRoot.has(scanKey)) continue;
		scannedPathsByRoot.add(scanKey);
		const source = "packageRelativePath" in current ? await params.packageFs.readText(current.packageRelativePath, {
			hardlinks: "allow",
			maxBytes: Number.POSITIVE_INFINITY,
			symlinks: "reject"
		}).catch(() => "") : await fs$1.readFile(current.sourcePath, "utf8").catch(() => "");
		for (const match of source.matchAll(BEST_EFFORT_LOCAL_PATH_LITERAL_PATTERN)) {
			const specifier = match[1] ?? "";
			const referencedPath = resolveReferencedDistPath({
				fromPath: current.path,
				specifier,
				actualSet: params.actualSet
			});
			if (!referencedPath) continue;
			const referencedModifiedChange = modifiedChangesByPath.get(referencedPath);
			if (params.baselineSet.has(referencedPath) && !referencedModifiedChange) continue;
			const dependencies = dependenciesByChangePath.get(current.rootPath) ?? /* @__PURE__ */ new Set();
			dependencies.add(referencedPath);
			dependenciesByChangePath.set(current.rootPath, dependencies);
			if (!params.baselineSet.has(referencedPath)) addedPaths.add(referencedPath);
			const referencedScanKey = `${current.rootPath}\0${referencedPath}`;
			if (!scannedPathsByRoot.has(referencedScanKey)) queue.push(referencedModifiedChange?.savedPath ? {
				path: referencedPath,
				rootPath: current.rootPath,
				sourcePath: referencedModifiedChange.savedPath
			} : {
				path: referencedPath,
				rootPath: current.rootPath,
				packageRelativePath: referencedPath
			});
		}
	}
	return {
		addedPaths: [...addedPaths].toSorted((left, right) => left.localeCompare(right)),
		dependenciesByChangePath: new Map([...dependenciesByChangePath].map(([changePath, dependencies]) => [changePath, [...dependencies].toSorted((left, right) => left.localeCompare(right))]))
	};
}
async function captureLocalPackageOverrides(params) {
	if (!await packageRootExists(params.packageRoot)) return null;
	const baseline = await readPackageDistContentInventoryIfPresent(params.packageRoot);
	const packageFs = await root(params.packageRoot, {
		hardlinks: "reject",
		symlinks: "reject"
	});
	const actualFiles = (await collectPackageDistInventory(params.packageRoot, { includePackageExcludedFiles: true })).filter((file) => file !== PACKAGE_DIST_CONTENT_INVENTORY_RELATIVE_PATH);
	const actualSet = new Set(actualFiles);
	const actualCaseFoldedSet = new Set(actualFiles.map((relativePath) => relativePath.toLocaleLowerCase("en-US")));
	const changes = [];
	let recoveryDir = null;
	const ensureRecoveryDir = async () => {
		if (!recoveryDir) {
			const recoveryRoot = path.join(resolveStateDir(params.env), "update-recovery");
			await assertRecoveryRootOutsidePackageRoot(params.packageRoot, recoveryRoot);
			if (params.recordedPackageRoot && params.recordedPackageRoot !== params.packageRoot) await assertRecoveryRootOutsidePackageRoot(params.recordedPackageRoot, recoveryRoot);
			await fs$1.mkdir(recoveryRoot, {
				recursive: true,
				mode: 448
			});
			recoveryDir = await fs$1.mkdtemp(path.join(recoveryRoot, "openclaw-local-overrides-"));
		}
		return recoveryDir;
	};
	try {
		if (baseline === null) {
			const snapshotDir = await ensureRecoveryDir();
			for (const relativePath of actualFiles) await copyOverridePayload({
				packageFs,
				recoveryDir: snapshotDir,
				relativePath
			});
			const packageRoot = params.recordedPackageRoot ?? params.packageRoot;
			await fs$1.writeFile(path.join(snapshotDir, "manifest.json"), JSON.stringify({
				packageRoot,
				changes
			}, null, 2) + "\n");
			return {
				packageRoot,
				recoveryDir: snapshotDir,
				changes,
				result: {
					...emptyResult("preserved"),
					recoveryDir: snapshotDir,
					warnings: ["The previous package has no content inventory. Its dist files were preserved in the recovery bundle; local changes cannot be classified or automatically replayed. Inspect and restore trusted files manually."]
				}
			};
		}
		const baselineSet = new Set(baseline.map((entry) => entry.path));
		for (const entry of baseline) {
			resolveSafePackagePath(params.packageRoot, entry.path);
			let current;
			try {
				current = await packageFs.read(entry.path, {
					hardlinks: "allow",
					maxBytes: Number.POSITIVE_INFINITY,
					symlinks: "reject"
				});
			} catch (error) {
				if (!actualSet.has(entry.path) && isMissingPathError(error)) {
					await ensureRecoveryDir();
					changes.push({
						kind: "deleted",
						path: entry.path,
						baseline: entry
					});
					continue;
				}
				throw error;
			}
			if (!actualSet.has(entry.path)) {
				if (!actualCaseFoldedSet.has(entry.path.toLocaleLowerCase("en-US"))) throw new Error(`package dist inventory changed during override capture: ${entry.path}`);
				await ensureRecoveryDir();
				changes.push({
					kind: "deleted",
					path: entry.path,
					baseline: entry
				});
				continue;
			}
			const currentMode = normalizeFileMode(current.stat.mode);
			if (createHash("sha256").update(current.buffer).digest("hex") === entry.sha256 && fileModesHaveSameExecutableSemantics(currentMode, entry.mode)) continue;
			const payload = await copyOverridePayload({
				packageFs,
				recoveryDir: await ensureRecoveryDir(),
				relativePath: entry.path
			});
			changes.push({
				kind: "modified",
				path: entry.path,
				baseline: entry,
				savedPath: payload.savedPath,
				mode: payload.mode
			});
		}
		const standaloneAddedPaths = actualFiles.filter((relativePath) => !baselineSet.has(relativePath) && !isLikelyContentHashedDistArtifact(relativePath));
		const referencedAdded = await collectReferencedAddedOverridePaths({
			packageFs,
			changes,
			actualSet,
			baselineSet,
			standaloneAddedPaths
		});
		for (const change of changes) if (change.kind === "modified") change.dependencies = referencedAdded.dependenciesByChangePath.get(change.path) ?? [];
		const replayableAddedPaths = /* @__PURE__ */ new Set([...standaloneAddedPaths, ...referencedAdded.addedPaths]);
		const allAddedPaths = actualFiles.filter((relativePath) => !baselineSet.has(relativePath));
		for (const relativePath of allAddedPaths.toSorted((left, right) => left.localeCompare(right))) {
			const payload = await copyOverridePayload({
				packageFs,
				recoveryDir: await ensureRecoveryDir(),
				relativePath
			});
			changes.push({
				kind: "added",
				path: relativePath,
				dependencies: referencedAdded.dependenciesByChangePath.get(relativePath) ?? [],
				...replayableAddedPaths.has(relativePath) ? {} : { reapply: false },
				savedPath: payload.savedPath,
				mode: payload.mode
			});
		}
		if (changes.length === 0) return null;
		const finalRecoveryDir = await ensureRecoveryDir();
		const result = {
			...emptyResult("none"),
			...countChanges(changes),
			recoveryDir: finalRecoveryDir
		};
		await fs$1.writeFile(path.join(finalRecoveryDir, "manifest.json"), JSON.stringify({
			packageRoot: params.recordedPackageRoot ?? params.packageRoot,
			changes
		}, null, 2) + "\n", "utf8");
		return {
			packageRoot: params.recordedPackageRoot ?? params.packageRoot,
			recoveryDir: finalRecoveryDir,
			changes,
			result
		};
	} catch (error) {
		if (recoveryDir) await fs$1.rm(recoveryDir, {
			recursive: true,
			force: true
		}).catch(() => void 0);
		throw error;
	}
}
//#endregion
//#region src/infra/package-local-overrides.ts
function resolveLocalOverrideRuntimeUrls() {
	return [
		import.meta.resolve("@openclaw/fs-safe/config"),
		import.meta.resolve("@openclaw/fs-safe/root"),
		import.meta.resolve("@openclaw/fs-safe/durability"),
		import.meta.resolve("@openclaw/fs-safe/errors")
	];
}
/** Resolve while the installed updater still exists; keep its complete dependency scope. */
async function prepareLocalOverrideRuntime(params) {
	const sourceRoot = await fs$1.realpath(params.sourceRoot);
	const destinationRoot = path.join(await fs$1.realpath(path.dirname(params.destinationRoot)), path.basename(params.destinationRoot));
	return await Promise.all(resolveLocalOverrideRuntimeUrls().map(async (url) => {
		const modulePath = await fs$1.realpath(fileURLToPath(url));
		return pathToFileURL(relocateRuntimePath(modulePath, [{
			sourceRoot,
			destinationRoot
		}])).href;
	}));
}
const REQUIRED_FS_SAFE_OPERATION_SCRIPT = `
const [configUrl, rootUrl, durabilityUrl, errorsUrl, rootDir, sourcePath, relativePath] = process.argv.slice(1);
const { configureFsSafeNative } = await import(configUrl);
configureFsSafeNative({ mode: "require" });
const { root } = await import(rootUrl);
const { publishFileExclusive } = await import(durabilityUrl);
const { FsSafeError } = await import(errorsUrl);
const packageFs = await root(rootDir, { hardlinks: "reject", symlinks: "reject" });
const source = await packageFs.open(sourcePath);
try {
  await publishFileExclusive({
    sourcePath: source.realPath,
    targetPath: await packageFs.resolve(relativePath),
    expectedSourceIdentity: source.stat,
    strategy: "rename-noreplace",
  });
  process.stdout.write("moved");
} catch (error) {
  // A post-rename verification/sync failure must still enter caller rollback.
  if (error instanceof FsSafeError && error.details?.targetCreated === true) {
    process.stdout.write("moved");
  }
  throw error;
} finally {
  await source.handle.close();
}
`;
async function runRequiredFsSafeMove(params) {
	const { error, stdout } = await new Promise((resolve) => {
		execFile(process.execPath, [
			...resolveRuntimeArgs(),
			"--input-type=module",
			"--eval",
			REQUIRED_FS_SAFE_OPERATION_SCRIPT,
			...params.runtimeUrls,
			params.packageFs.rootReal,
			params.sourcePath,
			params.relativePath
		], {
			timeout: 3e4,
			windowsHide: true
		}, (failure, output) => resolve({
			error: failure,
			stdout: output
		}));
	});
	if (stdout === "moved") params.onMoved?.();
	if (error) throw new Error("Native local override publication failed", { cause: error });
	if (stdout !== "moved") throw new Error("Local override move completed without a publication receipt");
}
var LocalOverrideRollbackError = class extends Error {
	constructor(relativePath, action, rollbackError) {
		super(`local override rollback failed for ${relativePath}: ${formatErrorMessage(rollbackError)}`);
		this.relativePath = relativePath;
		this.action = action;
		this.rollbackError = rollbackError;
		this.name = "LocalOverrideRollbackError";
	}
};
function createLocalOverrideMutationPath(relativePath, label) {
	const normalized = normalizeDistPath(relativePath);
	return path.posix.join(path.posix.dirname(normalized), `.openclaw-override-${label}-${randomUUID()}.tmp`);
}
async function publishLocalOverrideTarget(params) {
	await assertLocalOverrideMutationTopology({
		packageRoot: params.packageFs.rootDir,
		realPackageRoot: params.packageFs.rootReal,
		relativePath: params.sourcePath
	});
	await assertLocalOverrideMutationTopology({
		packageRoot: params.packageFs.rootDir,
		realPackageRoot: params.packageFs.rootReal,
		relativePath: params.relativePath
	});
	await runRequiredFsSafeMove({
		...params,
		onMoved: params.onPublished
	});
	await assertLocalOverrideMutationTopology({
		packageRoot: params.packageFs.rootDir,
		realPackageRoot: params.packageFs.rootReal,
		relativePath: params.relativePath
	});
}
async function throwAfterRestoringMovedLocalOverrideTarget(params) {
	try {
		await publishLocalOverrideTarget({
			packageFs: params.packageFs,
			runtimeUrls: params.runtimeUrls,
			sourcePath: params.movedPath,
			relativePath: params.relativePath
		});
	} catch (rollbackError) {
		if (params.removeMovedAfterFailedRestore) await params.packageFs.remove(params.movedPath).catch(() => void 0);
		throw new LocalOverrideRollbackError(params.relativePath, "restore current target", rollbackError);
	}
	throw params.originalError;
}
async function removeLocalOverrideCleanupPath(packageFs, relativePath) {
	try {
		await packageFs.remove(relativePath);
	} catch (error) {
		if (!isMissingPathError(error)) throw error;
	}
}
async function moveExpectedLocalOverrideTarget(params) {
	const movedPath = createLocalOverrideMutationPath(params.relativePath, "previous");
	let targetMoved = false;
	try {
		await runRequiredFsSafeMove({
			packageFs: params.packageFs,
			runtimeUrls: params.runtimeUrls,
			sourcePath: params.relativePath,
			relativePath: movedPath,
			onMoved: () => {
				targetMoved = true;
			}
		});
		const moved = await params.packageFs.read(movedPath, {
			hardlinks: "reject",
			maxBytes: Number.POSITIVE_INFINITY,
			symlinks: "reject"
		});
		const mode = normalizeFileMode(moved.stat.mode);
		if (createHash("sha256").update(moved.buffer).digest("hex") !== params.expected.sha256 || !fileModesHaveSameExecutableSemantics(mode, params.expected.mode)) throw new Error(`local override target changed during mutation: ${params.relativePath}`);
		return {
			movedPath,
			content: moved.buffer,
			mode
		};
	} catch (error) {
		if (targetMoved) await throwAfterRestoringMovedLocalOverrideTarget({
			packageFs: params.packageFs,
			runtimeUrls: params.runtimeUrls,
			movedPath,
			relativePath: params.relativePath,
			originalError: error,
			removeMovedAfterFailedRestore: false
		});
		throw error;
	}
}
async function replaceLocalOverrideTarget(params) {
	const temporaryPath = createLocalOverrideMutationPath(params.relativePath, "next");
	let backupMode;
	let backupWritten = false;
	let committed = false;
	let movedPath;
	let replacementMode = params.mode;
	try {
		await params.packageFs.copyIn(temporaryPath, params.sourcePath, {
			maxBytes: Number.POSITIVE_INFINITY,
			mkdir: true,
			mode: params.mode,
			sourceHardlinks: "reject"
		});
		if (params.expected) {
			if (!params.backupPath) throw new Error(`missing local override rollback path: ${params.relativePath}`);
			const moved = await moveExpectedLocalOverrideTarget({
				packageFs: params.packageFs,
				runtimeUrls: params.runtimeUrls,
				relativePath: params.relativePath,
				expected: params.expected
			});
			movedPath = moved.movedPath;
			backupMode = moved.mode;
			if (replacementMode !== void 0) replacementMode = mergeLocalOverrideFileMode(moved.mode, replacementMode);
			await writeFileWithMode(moved.content, params.backupPath, moved.mode);
			backupWritten = true;
		}
		if (replacementMode !== void 0 && process.platform !== "win32") {
			const temporary = await params.packageFs.open(temporaryPath, {
				hardlinks: "reject",
				symlinks: "reject"
			});
			try {
				await temporary.handle.chmod(replacementMode);
			} finally {
				await temporary.handle.close();
			}
		}
		const cleanupPaths = [temporaryPath, ...movedPath ? [movedPath] : []];
		await publishLocalOverrideTarget({
			packageFs: params.packageFs,
			runtimeUrls: params.runtimeUrls,
			sourcePath: temporaryPath,
			relativePath: params.relativePath,
			onPublished: () => {
				committed = true;
				params.onCommitted?.(cleanupPaths, backupMode);
			}
		});
		return cleanupPaths;
	} catch (error) {
		if (movedPath && !committed) await throwAfterRestoringMovedLocalOverrideTarget({
			packageFs: params.packageFs,
			runtimeUrls: params.runtimeUrls,
			movedPath,
			relativePath: params.relativePath,
			originalError: error,
			removeMovedAfterFailedRestore: backupWritten
		});
		throw error;
	} finally {
		if (!committed) await removeLocalOverrideCleanupPath(params.packageFs, temporaryPath).catch(() => void 0);
	}
}
async function deleteLocalOverrideTarget(params) {
	const moved = await moveExpectedLocalOverrideTarget({
		packageFs: params.packageFs,
		runtimeUrls: params.runtimeUrls,
		relativePath: params.relativePath,
		expected: params.expected
	});
	let backupWritten = false;
	try {
		await writeFileWithMode(moved.content, params.backupPath, moved.mode);
		backupWritten = true;
		await params.packageFs.remove(moved.movedPath);
		await assertLocalOverrideMutationTopology({
			packageRoot: params.packageFs.rootDir,
			realPackageRoot: params.packageFs.rootReal,
			relativePath: params.relativePath
		});
		if ((await probeLocalOverrideTarget(resolveSafePackagePath(params.packageFs.rootReal, params.relativePath))).status !== "missing") throw new Error(`local override deletion target recreated: ${params.relativePath}`);
		return moved.mode;
	} catch (error) {
		return await throwAfterRestoringMovedLocalOverrideTarget({
			packageFs: params.packageFs,
			runtimeUrls: params.runtimeUrls,
			movedPath: moved.movedPath,
			relativePath: params.relativePath,
			originalError: error,
			removeMovedAfterFailedRestore: backupWritten
		});
	}
}
function appliedLocalOverridesResult(plan, conflicts, applied) {
	return {
		...plan.result,
		status: conflicts.length > 0 ? "conflict" : "applied",
		applied,
		conflicts,
		warnings: conflicts.length > 0 ? ["Local OpenClaw changes were preserved but not reapplied because the update changed the same file(s)."] : []
	};
}
async function applyLocalPackageOverrides(params) {
	if (!params.plan) return emptyResult("none");
	if (params.plan.changes.length === 0) return params.plan.result;
	if (!params.reapply) return {
		...params.plan.result,
		status: "preserved",
		applied: 0,
		warnings: ["Local OpenClaw changes were preserved in the recovery bundle and were not reapplied. Inspect the bundle and copy back trusted files manually, or run the update with --reapply-local-overrides when you want trusted edits replayed during that update."]
	};
	const recoveryOnlyChanges = params.plan.changes.filter((change) => change.reapply === false);
	if (recoveryOnlyChanges.length > 0) return {
		...params.plan.result,
		status: "preserved",
		applied: 0,
		warnings: [`${recoveryOnlyChanges.length} local content-hashed file(s) were preserved in the recovery bundle but were not automatically reapplied. To avoid a partial override set, no local changes were reapplied; inspect the bundle and restore trusted files manually if needed.`]
	};
	const packageRootIdentity = await fs$1.realpath(params.packageRoot).then(readDirectoryIdentity).catch(() => null);
	if (!packageRootIdentity) return localOverrideInspectionConflict(params.plan);
	const conflicts = await preflightLocalOverrides({
		packageRoot: params.packageRoot,
		realPackageRoot: packageRootIdentity.realPath,
		plan: params.plan
	}).catch(() => null);
	if (!conflicts) return localOverrideInspectionConflict(params.plan);
	const conflictPaths = new Set(conflicts.map((conflict) => conflict.path));
	const changesToApply = [];
	for (const change of params.plan.changes) {
		if (conflictPaths.has(change.path)) continue;
		if (change.kind === "deleted" && (await probeLocalOverrideTarget(resolveSafePackagePath(params.packageRoot, change.path))).status === "missing") continue;
		changesToApply.push(change);
	}
	if (changesToApply.length === 0) return appliedLocalOverridesResult(params.plan, conflicts, 0);
	let rollbackDir = null;
	const rollbackEntries = [];
	let applied = 0;
	let preserveRollbackDir = false;
	let packageFs;
	let runtimeUrls = [];
	try {
		runtimeUrls = params.runtimeUrls ?? resolveLocalOverrideRuntimeUrls();
		packageFs = await root(params.packageRoot, {
			hardlinks: "reject",
			mkdir: true,
			symlinks: "reject"
		});
		try {
			assertDirectoryIdentitySync(packageFs.rootReal, packageRootIdentity);
		} catch {
			return localOverrideInspectionConflict(params.plan);
		}
		rollbackDir = await fs$1.mkdtemp(path.join(params.plan.recoveryDir, "rollback-"));
		for (const change of changesToApply) {
			const backupPath = path.join(rollbackDir, change.path);
			if (change.kind === "deleted") {
				if (!change.baseline) throw new Error(`missing local override baseline for ${change.path}`);
				const backupMode = await deleteLocalOverrideTarget({
					packageFs,
					runtimeUrls,
					relativePath: change.path,
					expected: change.baseline,
					backupPath
				});
				rollbackEntries.push({
					path: change.path,
					backupPath,
					backupMode
				});
			} else {
				if (!change.savedPath) throw new Error(`missing saved override payload for ${change.path}`);
				const appliedEntry = await buildLocalOverrideInventoryEntry({
					relativePath: change.path,
					sourcePath: change.savedPath,
					mode: change.mode
				});
				const cleanupPaths = await replaceLocalOverrideTarget({
					packageFs,
					runtimeUrls,
					relativePath: change.path,
					sourcePath: change.savedPath,
					mode: change.mode,
					expected: change.kind === "modified" ? change.baseline : void 0,
					backupPath: change.kind === "modified" ? backupPath : void 0,
					onCommitted: (committedCleanupPaths, backupMode) => {
						rollbackEntries.push({
							path: change.path,
							applied: appliedEntry,
							cleanupPaths: committedCleanupPaths,
							...change.kind === "modified" ? {
								backupPath,
								backupMode
							} : {}
						});
					}
				});
				while (cleanupPaths.length > 0) {
					const cleanupPath = cleanupPaths[0];
					if (cleanupPath === void 0) break;
					await removeLocalOverrideCleanupPath(packageFs, cleanupPath);
					cleanupPaths.shift();
				}
			}
			applied += 1;
		}
	} catch (applyError) {
		const rollbackFailures = /* @__PURE__ */ new Map();
		const recordRollbackFailure = (relativePath, action, error) => {
			const messages = rollbackFailures.get(relativePath) ?? [];
			messages.push(`${action}: ${formatErrorMessage(error)}`);
			rollbackFailures.set(relativePath, messages);
		};
		if (applyError instanceof LocalOverrideRollbackError) recordRollbackFailure(applyError.relativePath, applyError.action, applyError.rollbackError);
		for (const entry of rollbackEntries.toReversed()) {
			if (entry.cleanupPaths && packageFs) for (const cleanupPath of entry.cleanupPaths) try {
				await removeLocalOverrideCleanupPath(packageFs, cleanupPath);
			} catch (error) {
				recordRollbackFailure(entry.path, "remove mutation backup", error);
			}
			let removeError;
			if (entry.applied && packageFs && rollbackDir) try {
				await deleteLocalOverrideTarget({
					packageFs,
					runtimeUrls,
					relativePath: entry.path,
					expected: entry.applied,
					backupPath: path.join(rollbackDir, "applied", entry.path)
				});
			} catch (error) {
				removeError = error;
			}
			if (removeError) recordRollbackFailure(entry.path, "remove partial target", removeError);
			if (entry.backupPath && packageFs) try {
				const cleanupPaths = await replaceLocalOverrideTarget({
					packageFs,
					runtimeUrls,
					relativePath: entry.path,
					sourcePath: entry.backupPath,
					mode: entry.backupMode
				});
				for (const cleanupPath of cleanupPaths) await removeLocalOverrideCleanupPath(packageFs, cleanupPath);
			} catch (error) {
				recordRollbackFailure(entry.path, "restore original target", error);
			}
		}
		preserveRollbackDir = rollbackFailures.size > 0;
		const failureReasonByPath = new Map(changesToApply.map((change) => [change.path, "apply-failed"]));
		for (const relativePath of rollbackFailures.keys()) failureReasonByPath.set(relativePath, "rollback-failed");
		const rollbackWarnings = [...rollbackFailures].map(([relativePath, messages]) => `Rollback failed for ${relativePath}: ${messages.join("; ")}`);
		return {
			...params.plan.result,
			status: "error",
			applied: 0,
			conflicts: [...failureReasonByPath].map(([relativePath, reason]) => ({
				path: relativePath,
				reason
			})),
			warnings: ["Local OpenClaw changes were preserved but could not be reapplied.", ...rollbackFailures.size > 0 ? [`Rollback could not fully restore ${rollbackFailures.size} installed file(s); the package may be partially modified. Inspect the preserved rollback data before retrying.`, ...rollbackWarnings] : []]
		};
	} finally {
		if (rollbackDir && !preserveRollbackDir) await fs$1.rm(rollbackDir, {
			recursive: true,
			force: true
		}).catch(() => void 0);
	}
	return appliedLocalOverridesResult(params.plan, conflicts, applied);
}
//#endregion
//#region src/infra/package-update-local-overrides.ts
/** Prepare before drain; invoke only after retaining the old tree and registering rollback. */
async function preparePackageSwapLocalOverrides(params) {
	const packageRoot = params.installTarget.packageRoot;
	const options = params.localOverrides;
	if (!params.hadPackage || params.rootLinked || !options || !packageRoot) return;
	await readPackageDistContentInventoryIfPresent(packageRoot);
	await collectPackageDistInventory(packageRoot, { includePackageExcludedFiles: true });
	const runtimeUrls = options.reapply ? await prepareLocalOverrideRuntime({
		sourceRoot: params.targetSwapRoot,
		destinationRoot: params.backupRoot
	}) : void 0;
	const retiredPackageRoot = path.join(params.backupRoot, path.relative(params.targetSwapRoot, packageRoot));
	return async (roots) => {
		const plan = await captureLocalPackageOverrides({
			packageRoot: roots ? path.join(roots.backupRoot, path.relative(params.targetSwapRoot, packageRoot)) : retiredPackageRoot,
			recordedPackageRoot: packageRoot,
			env: options.env
		});
		if (plan) params.onLocalOverrides?.({
			...plan.result,
			status: "preserved"
		});
		const result = await applyLocalPackageOverrides({
			packageRoot: roots?.packageRoot ?? params.stage.packageRoot,
			plan,
			reapply: options.reapply,
			runtimeUrls
		});
		params.onLocalOverrides?.(result);
		if (result.status === "error") throw new Error(`Local overrides could not be safely replayed. Recovery bundle: ${result.recoveryDir}`);
	};
}
//#endregion
//#region src/infra/package-update-npm-root.ts
/** The retained package link owns this baseline; its checkout remains operator-owned. */
async function captureNpmLinkedGitRecovery(packageRoot, link, timeoutMs) {
	const target = path.resolve(path.dirname(packageRoot), link.target);
	const recovery = await readCurrentGitUpdateRecovery(target, timeoutMs);
	if (!recovery.serviceRestartSafe || !recovery.buildId) return;
	const root = await fs$1.realpath(target);
	const identity = await fs$1.stat(root, { bigint: true });
	if (identity.ino === 0n || process.platform === "win32" && identity.dev === 0n) return;
	return async () => {
		const currentIdentity = await fs$1.stat(root, { bigint: true });
		const current = await readCurrentGitUpdateRecovery(root, timeoutMs);
		const verifiedIdentity = await fs$1.stat(root, { bigint: true });
		if (await fs$1.realpath(target) !== root || currentIdentity.dev !== identity.dev || currentIdentity.ino !== identity.ino || verifiedIdentity.dev !== identity.dev || verifiedIdentity.ino !== identity.ino || !current.serviceRestartSafe || current.buildId !== recovery.buildId || current.version !== recovery.version) throw new Error("Previous Git runtime changed; automatic rollback was refused.");
	};
}
async function createNpmPackageRootLinkLifecycle(params) {
	const verifyRuntime = await captureNpmLinkedGitRecovery(params.liveRoot, params.fingerprint, params.timeoutMs);
	const assertUnchanged = async (root) => {
		const actual = await createPackageIntegrityReader(params.timeoutMs).rootEntry(root, params.liveRoot, "link");
		if (!isDeepStrictEqual(actual, params.fingerprint)) throw new Error("Npm package link changed before activation or retirement");
	};
	return {
		verifyRuntime,
		async assertLiveUnchanged() {
			await assertUnchanged(params.liveRoot);
			await verifyRuntime?.();
		},
		async acquire() {
			await fs$1.rename(params.liveRoot, params.backupRoot);
			try {
				await assertUnchanged(params.backupRoot);
				return { acquired: true };
			} catch (error) {
				return {
					acquired: false,
					error: `Npm package link backup refused: ${formatErrorMessage(error)}; moved entry retained at ${params.backupRoot}; inspect it before manual recovery`
				};
			}
		},
		async retire(assertCurrent = () => {}) {
			try {
				assertCurrent();
				await assertUnchanged(params.backupRoot);
				assertCurrent();
				await fs$1.unlink(params.backupRoot);
				return null;
			} catch (error) {
				assertCurrent();
				return `Could not retire retained npm package link: ${formatErrorMessage(error)}; backup retained at ${params.backupRoot}`;
			}
		}
	};
}
/** Verify the same retained/restored npm root and launcher baseline without inference. */
async function verifyNpmRootRecovery(params, timeoutMs, verifyGitRuntime) {
	const { root, fromBackup, hadPackage, previousRoot, targetSwapRoot, shims } = params;
	const reader = createPackageIntegrityReader(timeoutMs);
	return await reader.observe(fromBackup ? "retained" : "restored", async () => {
		const actual = hadPackage && previousRoot ? await reader.rootEntry(root, targetSwapRoot, previousRoot.kind) : void 0;
		if (hadPackage ? previousRoot ? !isDeepStrictEqual(actual, previousRoot) : !params.previousIdentity || !isDeepStrictEqual(await reader.directoryIdentity(root), params.previousIdentity) : !fromBackup && await reader.exists(root)) throw new PackageIntegrityMismatchError(`Package rollback verification failed: ${fromBackup ? "retained" : "restored"} package ${previousRoot?.kind === "link" ? "link" : "tree"} changed at ${root}. Inspect this ${fromBackup ? "backup" : "installation"} and resolve the changes before retrying recovery.`, previousRoot?.kind === "directory" && actual?.kind === "directory" ? packageIntegrityDifferences(previousRoot.tree, actual.tree) : []);
		for (const shim of shims) {
			const target = fromBackup ? shim.backup : shim.destination;
			if (shim.backup ? !target || !shim.fingerprint || packageLauncherDifferences(shim.fingerprint, await reader.launcher(target)).length > 0 : !fromBackup && await reader.exists(shim.destination)) throw new Error(`Package rollback verification failed: launcher ${shim.destination} changed`);
		}
		await verifyGitRuntime?.();
		return hadPackage && (previousRoot?.kind === "directory" || verifyGitRuntime !== void 0 || !previousRoot && params.previousIdentity !== void 0);
	});
}
//#endregion
//#region src/infra/package-update-swap-results.ts
/** Result reporting shares warnings with the swap owner but never performs recovery effects. */
function createPackageSwapResults(params, targetLayout, targetPackageRoot, startedAt) {
	const warnings = [];
	const integrityFailures = [];
	const step = (exitCode, stdoutTail, stderrTail, code = "swap-failed", failureError) => ({
		name: "package-swap",
		command: `swap ${params.stage.packageRoot} -> ${targetPackageRoot ?? "unknown root"}`,
		cwd: targetLayout?.globalRoot ?? params.stage.prefix,
		durationMs: Date.now() - startedAt,
		exitCode,
		stdoutTail,
		stderrTail,
		...warnings.length > 0 ? { warnings: [...warnings] } : {},
		...exitCode !== 0 ? { failureFacts: integrityFailures.length ? [...integrityFailures] : [failureError ? {
			...createUpdateErrorFact("package-swap", failureError),
			code
		} : createUpdateFailureFact({
			check: "package-swap",
			code,
			message: stderrTail ?? void 0
		})] } : {},
		...exitCode === 0 && warnings.length > 0 ? { advisory: {
			kind: "recoverable-maintenance",
			message: warnings.join("\n")
		} } : {}
	});
	return {
		warnings,
		step,
		async verifyLaunchers(launchers) {
			if (!params.stage.native) return;
			for (const { destination } of launchers) try {
				await verifyRuntimeLauncher(destination, "openclaw.mjs");
			} catch (error) {
				warnings.push(`Published launcher ${destination} could not be verified: ${formatErrorMessage(error)}. Reinstall the current ${params.packageName} version with ${params.installTarget.manager} to recreate the launcher.`);
			}
		},
		activationWarning: (message) => {
			if (message === void 0) return;
			if (!warnings.includes(message)) warnings.push(message);
		},
		rollbackError(error) {
			if (error instanceof PackageIntegrityMismatchError && error.differences.length > 0) integrityFailures.splice(0, integrityFailures.length, ...error.differences.map((message) => createUpdateFailureFact({
				check: "package-swap",
				code: "package-integrity-changed",
				message
			})));
			return formatErrorMessage(error);
		},
		invalidLayout(activePackageRoot) {
			return {
				status: "failed",
				activePackageRoot,
				step: step(1, null, "cannot resolve npm global prefix layout"),
				postVerifyStep: null,
				packageRollbackVerified: false
			};
		},
		verificationFailed(activePackageRoot, packageRollbackVerified, rollbackMessages, postVerifyStep) {
			return {
				status: "failed",
				activePackageRoot,
				step: packageRollbackVerified ? step(0, [
					`restored previous ${params.packageName} package and affected launchers after verification failed`,
					"Update Doctor may have changed persistent state; managed Gateway remains stopped",
					...rollbackMessages
				].filter(Boolean).join("; "), null) : step(1, null, rollbackMessages.join("\n")),
				postVerifyStep,
				packageRollbackVerified
			};
		},
		committed(activePackageRoot, hadPackage, cleanup, postVerifyStep) {
			return {
				status: "committed",
				activePackageRoot,
				step: step(0, [hadPackage ? `replaced ${params.packageName}` : `installed ${params.packageName}`, ...cleanup].filter(Boolean).join("; "), null),
				postVerifyStep
			};
		},
		failed(activePackageRoot, error, errors, packageRollbackVerified, baselineError) {
			return {
				status: "failed",
				activePackageRoot,
				step: step(1, null, errors.join("\n"), baselineError ? "baseline-scan-failed" : isErrno(error) && typeof error.code === "string" ? error.code : error instanceof Error ? error.name : "swap-failed", baselineError),
				postVerifyStep: null,
				packageRollbackVerified
			};
		}
	};
}
//#endregion
//#region src/infra/package-update-swap-retirement.ts
/** Later verified activation may retire only the historical objects observed before this swap. */
async function captureLegacyPackageBackupRetirement(globalRoot, assertCaller = () => {}) {
	const assertCurrent = retainMutationAuthority(assertCaller);
	const warnings = [];
	let captured;
	try {
		assertCurrent();
		const root = fs.realpathSync(globalRoot);
		const parent = fs.lstatSync(root, { bigint: true });
		const names = await fs$1.readdir(root);
		assertCurrent();
		assertPackagePathIdentity(root, parent);
		captured = {
			root,
			parent,
			entries: names.filter(isLegacyPackageBackupName).flatMap((name) => {
				const entry = path.join(root, name);
				const identity = fs.lstatSync(entry, {
					bigint: true,
					throwIfNoEntry: false
				});
				return identity && (identity.isDirectory() || identity.isSymbolicLink()) ? [{
					path: entry,
					identity
				}] : [];
			})
		};
	} catch (error) {
		assertCurrent();
		warnings.push(`Historical package backups were not inspected in ${globalRoot}; retained for later cleanup: ${formatErrorMessage(error)}`);
	}
	return async (assertRetirementOwner, cleanupDeadlineAtMs) => {
		const assertOwner = retainMutationAuthority(assertRetirementOwner);
		assertOwner();
		const messages = [...warnings];
		if (!captured) return messages;
		const { root, parent, entries } = captured;
		const inspectionDeadlineAtMs = Math.min(cleanupDeadlineAtMs, performance.now() + PKG_INSPECTION_TIMEOUT_MS);
		for (const entry of entries) try {
			assertOwner();
			if (process.platform === "freebsd") {
				const remainingMs = Math.floor(inspectionDeadlineAtMs - performance.now());
				if (remainingMs <= 0) {
					messages.push(`Historical package backups retained in ${root}: FreeBSD pkg inspection budget expired`);
					break;
				}
				const inspection = createFreeBsdPkgOwnershipInspection(remainingMs);
				if (entry.identity.isSymbolicLink()) await inspection.assertEntryUnowned(entry.path);
				else await inspection.assertUnowned(entry.path);
			}
			const message = await discardPackageUpdateBackup(entry.path, "historical package backup", root, () => {
				assertOwner();
				if (fs.realpathSync(globalRoot) !== root) throw new Error("Global package directory changed before historical backup cleanup");
				assertPackagePathIdentity(root, parent);
				if (fs.lstatSync(entry.path, { throwIfNoEntry: false })) assertPackagePathIdentity(entry.path, entry.identity);
			}, cleanupDeadlineAtMs);
			if (message) messages.push(message);
		} catch (error) {
			assertOwner();
			messages.push(`Historical package backup retained at ${entry.path}: ${formatErrorMessage(error)}`);
			if (error instanceof FreeBsdPkgOwnershipError && error.reason === "pkg-ownership-unavailable") break;
		}
		assertOwner();
		return messages;
	};
}
/** Refusal occurred before transaction handoff or any live package mutation. */
async function retireRefusedPackageSwap(activation, refusal, onWarning) {
	try {
		await activation.disarmRollback();
		onWarning(await activation.retireVerified());
	} catch (retirementError) {
		throw new PackageUpdateActivationError(new AggregateError([refusal, retirementError], "Package activation was refused and its prepared publication could not be retired.", { cause: refusal }));
	}
}
/** Called only by the verified, cached transaction completion path. */
async function retireVerifiedPackageSwap(params) {
	const { activation, rootLink, hadPackage, previousRoot, backupRoot, launchers, packageBackedUp, assertCurrent, step } = params;
	const messages = [];
	const assertRetirementCurrent = retainMutationAuthority(assertCurrent);
	const cleanupStartedAt = performance.now();
	const cleanupDeadlineAtMs = cleanupStartedAt + UPDATE_CLEANUP_BUDGET_MS;
	if (activation) {
		const retained = await activation.retireVerified();
		if (retained) messages.push(retained);
		assertRetirementCurrent();
	} else {
		const linkRetention = rootLink && packageBackedUp ? await rootLink.retire(assertRetirementCurrent) : null;
		assertRetirementCurrent();
		if (linkRetention) return {
			...step(1, null, linkRetention),
			name: "package-backup-retention"
		};
		if (hadPackage && previousRoot?.kind !== "link") {
			const message = await discardPackageUpdateBackup(backupRoot, "old package", params.globalRoot, assertRetirementCurrent, cleanupDeadlineAtMs);
			if (message) messages.push(message);
		}
		const launcherCleanup = await discardPackageLauncherBackup(launchers, params.globalRoot, assertRetirementCurrent, cleanupDeadlineAtMs);
		if (launcherCleanup) messages.push(launcherCleanup);
	}
	if (params.databaseBackupRoot) {
		const message = await discardPackageUpdateBackup(`${params.databaseBackupRoot}.databases`, "pre-migration database snapshots", params.globalRoot, assertRetirementCurrent, cleanupDeadlineAtMs);
		if (message) messages.push(message);
	}
	if (params.retireLegacyBackups) messages.push(...await params.retireLegacyBackups(assertRetirementCurrent, cleanupDeadlineAtMs));
	assertRetirementCurrent();
	if (messages.length) return {
		...step(1, null, messages.join("\n")),
		name: "package-backup-retention",
		durationMs: Math.round(performance.now() - cleanupStartedAt),
		advisory: {
			kind: "recoverable-maintenance",
			message: `Installation verification succeeded; backup cleanup remains pending. ${messages.join("\n")}. Inspect retained paths before removing obsolete backups manually.`
		}
	};
}
//#endregion
//#region src/infra/package-update-swap-target.ts
async function assertSwapTargetUnowned(root, launchers, timeoutMs) {
	const inspection = createFreeBsdPkgOwnershipInspection(timeoutMs ?? 12e5);
	await inspection.assertUnowned(root);
	for (const launcher of launchers) await inspection.assertEntryUnowned(launcher.destination);
}
function resolveStagedPackageSwapTarget(params) {
	const native = params.stage.native;
	const targetLayout = native ? {
		prefix: native.liveProjectRoot,
		globalRoot: path.dirname(native.liveProjectRoot),
		binDir: native.liveBinDir
	} : resolveNpmGlobalPrefixLayoutFromGlobalRoot(params.installTarget.globalRoot, { allowDirectNodeModulesRoot: params.installTarget.directNodeModulesRoot === true });
	const targetPackageRoot = native ? path.join(native.liveProjectRoot, path.relative(native.projectRoot, params.stage.packageRoot)) : params.installTarget.packageRoot;
	return {
		targetLayout,
		targetPackageRoot,
		targetSwapRoot: native?.liveProjectRoot ?? targetPackageRoot,
		stagedSwapRoot: native?.projectRoot ?? params.stage.packageRoot
	};
}
//#endregion
//#region src/infra/package-update-verification-step.ts
function createPackageVerificationFailureStep(root, errors, env) {
	return {
		name: "package-verify",
		command: `verify ${root}`,
		cwd: root,
		durationMs: 0,
		exitCode: 1,
		stderrTail: errors.join("\n"),
		stdoutTail: null,
		failureFacts: errors.map((message) => createUpdateFailureFact({
			check: "package-verify",
			code: "global-install-failed",
			message
		}, env))
	};
}
function isNormalProcessExit(step) {
	return step.termination !== "timeout" && step.termination !== "no-output-timeout" && step.termination !== "signal" && step.killed !== true && step.outputLimitExceeded !== true && (step.signal === void 0 || step.signal === null);
}
function markPackagePostInstallDoctorAdvisory(step, result) {
	if (result?.status === "error" || result?.failureFacts?.length) {
		const failureFacts = result.failureFacts?.length ? result.failureFacts : [createUpdateFailureFact({
			check: "openclaw doctor",
			code: "doctor-failed",
			message: "Post-install Doctor reported an error without diagnostic details."
		})];
		return {
			...step,
			advisory: void 0,
			failureFacts: normalizeUpdateFailureFacts([...failureFacts, ...step.failureFacts ?? []])
		};
	}
	if (!result || !isNormalProcessExit(step) || !(step.exitCode === 86 && result.status === "advisory" || step.exitCode === 0 && result.warnings?.length)) return step;
	const repairGuidance = "Run openclaw doctor --fix to finish deferred repairs.";
	const deferredWarnings = result.status === "advisory" ? normalizeUpdatePostInstallDoctorWarnings(result.advisory.details).map((detail) => `${detail}\n${repairGuidance}`) : [];
	const advisoryTail = [
		step.stderrTail,
		...result.status === "advisory" ? result.advisory.details : [],
		...result.warnings ?? [],
		PACKAGE_POST_INSTALL_DOCTOR_ADVISORY.message
	].filter((line) => Boolean(line?.trim())).join("\n");
	return {
		...step,
		warnings: [.../* @__PURE__ */ new Set([...normalizeUpdatePostInstallDoctorWarnings(result.warnings ?? []), ...deferredWarnings])].slice(0, 32),
		advisory: {
			...PACKAGE_POST_INSTALL_DOCTOR_ADVISORY,
			message: [
				...result.warnings ?? [],
				...result.status === "advisory" ? result.advisory.details : [],
				PACKAGE_POST_INSTALL_DOCTOR_ADVISORY.message,
				repairGuidance
			].join("\n")
		},
		stderrTail: trimLogTail(advisoryTail) ?? step.stderrTail
	};
}
function failedVerification(root, code, message) {
	return {
		name: "post-install-verify",
		command: "verify installed package",
		cwd: root,
		durationMs: 0,
		exitCode: 1,
		stderrTail: message,
		failureFacts: [createUpdateFailureFact({
			check: "package-runtime",
			code,
			message
		})]
	};
}
function missingPackageVerificationStep(root) {
	return failedVerification(root, "verification-result-missing", "Required post-install verification did not produce a result; Gateway activation is unsafe.");
}
function failedPackageVerificationStep(root, error, recorded) {
	if (hasCommandProcessCleanupError(error)) throw error;
	if (!recorded) return failedVerification(root, "runtime-verification-failed", formatErrorMessage(error));
	const errorFact = createUpdateErrorFact(recorded.name, error);
	const failedStep = {
		...recorded,
		stderrTail: trimLogTail(errorFact.message && !recorded.stderrTail?.includes(errorFact.message) ? [recorded.stderrTail, errorFact.message].filter(Boolean).join("\n") : recorded.stderrTail),
		failureFacts: normalizeUpdateFailureFacts([errorFact, ...(recorded.failureFacts ?? []).filter((fact) => !isDeepStrictEqual(fact, errorFact))])
	};
	delete failedStep.advisory;
	return failedStep;
}
/** The swap must retain a failed verification result while it restores the original package. */
async function runPackagePostInstallVerification(root, verify) {
	const results = [];
	try {
		return await verify(root, results) ?? missingPackageVerificationStep(root);
	} catch (error) {
		return failedPackageVerificationStep(root, error, results.at(-1));
	}
}
//#endregion
//#region src/infra/package-update-swap.ts
async function swapStagedPackageInstall(params) {
	const startedAt = Date.now();
	let activePackageRoot = params.installTarget.packageRoot;
	const native = params.stage.native;
	const { targetLayout, targetPackageRoot, targetSwapRoot, stagedSwapRoot } = resolveStagedPackageSwapTarget(params);
	let baselineError;
	const results = createPackageSwapResults(params, targetLayout, targetPackageRoot, startedAt);
	const { warnings, step } = results;
	if (!targetLayout || !targetPackageRoot || !targetSwapRoot) return results.invalidLayout(activePackageRoot);
	if (!native) {
		params.assertCurrent?.();
		params.reserveInstallSlot?.(targetSwapRoot);
	}
	let backupRoot = path.join(targetLayout.globalRoot, `.openclaw.package-backup-${process.pid}-${Date.now()}`);
	const databaseBackupRoot = backupRoot;
	let hadPackage = false;
	let replayLocalOverrides;
	let previousVersion = null;
	let previousDistFiles;
	let previousRoot;
	let previousIdentity;
	let rootLink;
	let packageBackedUp = false;
	let displacedCandidateRoot;
	const baseline = createPackageIntegrityReader(params.timeoutMs);
	const launchers = { entries: [] };
	const shims = launchers.entries;
	const rollback = [];
	let packageRollbackVerified = false;
	let retained = false;
	let liveMutationStarted = false;
	let projectActivated = false;
	let activationCompleted = false;
	let activationRetirementStarted = false;
	let preparationCustody = false;
	let activation;
	const verifyNpmRecovery = (root, fromBackup) => verifyNpmRootRecovery({
		root,
		fromBackup,
		hadPackage,
		previousRoot,
		previousIdentity,
		targetSwapRoot,
		shims
	}, params.timeoutMs, rootLink?.verifyRuntime);
	const restoreSwap = async (executorAssertion = () => {}) => {
		const assertCurrent = () => {
			executorAssertion();
			activation?.assertCurrent();
		};
		assertCurrent();
		if (preparationCustody && !activation) return ["Preparation custody is retained by the package recovery journal; run its repair command."];
		const messages = [];
		try {
			if (activation) packageBackedUp = await activation.disarmRollback();
			if (!native && (packageBackedUp || !hadPackage && rollback.length > 0)) await verifyNpmRecovery(backupRoot, true);
		} catch (error) {
			assertCurrent();
			packageRollbackVerified = false;
			return [`${results.rollbackError(error)}; current package unchanged; recovery evidence retained in ${targetLayout.globalRoot}`];
		}
		if (process.platform === "freebsd" && (packageBackedUp || rollback.length > 0)) try {
			await assertSwapTargetUnowned(targetSwapRoot, shims, params.timeoutMs);
			assertCurrent();
		} catch (error) {
			assertCurrent();
			packageRollbackVerified = false;
			return [`${formatErrorMessage(error)}; installation and backups retained for manual recovery`];
		}
		for (const restore of activation && !packageBackedUp ? [] : native ? rollback.toReversed() : rollback) try {
			assertCurrent();
			await restore(assertCurrent);
			assertCurrent();
		} catch (restoreError) {
			assertCurrent();
			packageRollbackVerified = false;
			messages.push(`rollback failed: ${formatErrorMessage(restoreError)}`);
			if (!native && restore === rollback[0] && activationCompleted) break;
		}
		if (native && rollback.length === 0 && hadPackage && previousVersion) {
			const original = await verifyPackageUpdateRecovery(params.installTarget.packageRoot);
			packageRollbackVerified = original.serviceRestartSafe && original.version === previousVersion && previousDistFiles !== void 0 && isDeepStrictEqual(await collectPackageDistInventory(params.installTarget.packageRoot).catch(() => null), previousDistFiles);
			if (packageRollbackVerified) activePackageRoot = params.installTarget.packageRoot;
		}
		if (!native) try {
			packageRollbackVerified = await verifyNpmRecovery(targetSwapRoot, false) && messages.length === 0;
			if (packageRollbackVerified && !previousRoot) warnings.push("Package fingerprint verification unavailable; rollback verified by the retained package copy's directory identity and version.");
			if (previousRoot?.kind === "link" && !rootLink?.verifyRuntime && messages.length === 0) messages.push(`${rollback.length > 0 ? "Restored" : "Verified"} the npm package link and affected launchers; external checkout runtime integrity is unverified.`);
		} catch (error) {
			assertCurrent();
			packageRollbackVerified = false;
			messages.push(results.rollbackError(error));
		}
		if (native) {
			const restoredVersion = await readPackageVersionIfPresent(params.installTarget.packageRoot);
			if (!hadPackage || !previousVersion || restoredVersion !== previousVersion) {
				packageRollbackVerified = false;
				messages.push(`rollback verification failed: expected package version ${previousVersion ?? "<none>"}, found ${restoredVersion ?? "<none>"}`);
			}
		}
		for (const shim of native ? shims : []) try {
			if (!(shim.backup ? await packagePathEntriesMatch(shim.backup, shim.destination) : !await packagePathEntryExists(shim.destination))) {
				packageRollbackVerified = false;
				messages.push(`rollback verification failed: launcher ${shim.destination} was not restored`);
			}
		} catch (verificationError) {
			assertCurrent();
			packageRollbackVerified = false;
			messages.push(`rollback verification failed for launcher ${shim.destination}: ${formatErrorMessage(verificationError)}`);
		}
		if (!packageRollbackVerified) messages.push(`Installation recovery is unverified; inspect the installation and backups in ${targetLayout.globalRoot} before restarting.`);
		else if (activation && activation.status().phase !== "aborted") await activation.restored();
		else for (const [root, label] of [[launchers.backupDir, "shim backup"], [displacedCandidateRoot, "rejected update"]]) if (root) {
			const cleanup = await discardPackageUpdateBackup(root, label, targetLayout.globalRoot, assertCurrent);
			if (cleanup) messages.push(cleanup);
		}
		assertCurrent();
		return messages;
	};
	const readBaseline = async () => {
		hadPackage = await (native ? packagePathEntryExists(targetSwapRoot) : baseline.exists(targetSwapRoot));
		previousVersion = hadPackage && native ? await readPackageVersionIfPresent(params.installTarget.packageRoot) : null;
		if (hadPackage && !native) {
			try {
				previousRoot = await baseline.rootEntry(targetSwapRoot);
			} catch (error) {
				baselineError = new Error("Baseline package scan failed", { cause: error });
				if (!isPackageIntegrityResourceError(error)) throw error;
				previousIdentity = await createPackageIntegrityReader(params.timeoutMs).directoryIdentity(targetSwapRoot) ?? void 0;
				if (!previousIdentity) throw error;
				warnings.push(`baseline package fingerprint incomplete (${error.message}); rollback requires the retained directory identity, package version and launchers; full package contents are unverified`);
			}
			baselineError = void 0;
			previousVersion = previousRoot?.kind === "directory" ? previousRoot.tree.version : previousIdentity?.version ?? null;
			if (previousRoot?.kind === "link") rootLink = await createNpmPackageRootLinkLifecycle({
				liveRoot: targetSwapRoot,
				backupRoot,
				fingerprint: previousRoot,
				timeoutMs: params.timeoutMs
			});
		}
		if (hadPackage && previousVersion && native) previousDistFiles = await readPackageDistInventoryIfPresent(params.installTarget.packageRoot) ?? await collectPackageDistInventory(params.installTarget.packageRoot);
		replayLocalOverrides = await preparePackageSwapLocalOverrides({
			...params,
			hadPackage,
			rootLinked: Boolean(rootLink),
			targetSwapRoot,
			backupRoot
		});
		packageRollbackVerified = hadPackage && previousVersion !== null;
	};
	try {
		await (native ? readBaseline() : baseline.observe("baseline", readBaseline));
		const launcherReader = createPackageIntegrityReader(params.timeoutMs);
		await launcherReader.observe("baseline", () => capturePackageLaunchers(launchers, params, targetLayout, launcherReader));
		const retireLegacyBackups = params.onTransaction ? await captureLegacyPackageBackupRetirement(targetLayout.globalRoot, params.assertCurrent ?? params.activation?.fence.assertCurrent) : void 0;
		if (params.activation && process.platform !== "freebsd" && !native && !rootLink && previousRoot?.kind === "directory") {
			if (params.localOverrides?.reapply) {
				const message = "Standalone package publication repair is unavailable while replaying local overrides; the existing package backup and rollback path remains in use.";
				warnings.push(message);
				params.activation.onUnavailable?.(message);
			} else {
				activation = await preparePackageActivation({
					installTarget: params.installTarget,
					options: {
						...params.activation,
						onUnavailable: (message) => {
							warnings.push(message);
							params.activation?.onUnavailable?.(message);
						}
					},
					liveRoot: targetSwapRoot,
					stageRoot: stagedSwapRoot,
					launcherRoot: params.stage.layout.binDir,
					binDir: targetLayout.binDir,
					previous: previousRoot.tree,
					previousLauncherRoot: launchers.backupDir,
					onCustody: (custodyRetained) => {
						preparationCustody = custodyRetained;
						params.stage.activationCustody = custodyRetained;
					},
					launchers: shims.map((shim) => ({
						name: path.basename(shim.destination),
						previous: shim.fingerprint ? encodePackageActivationLauncher(shim.fingerprint) : null
					}))
				});
				if (activation) {
					params.stage.activationCustody = false;
					backupRoot = path.join(activation.anchor, "previous");
					launchers.backupDir = launchers.backupDir && path.join(activation.anchor, "previous-launchers");
					for (const shim of shims) {
						shim.source = path.join(activation.anchor, "launchers", path.basename(shim.destination));
						if (shim.backup) shim.backup = path.join(launchers.backupDir, path.basename(shim.destination));
					}
				}
			}
		}
		const assertProjectUnchanged = native ? await finalizeNativePackageStage(native, params.packageName) : void 0;
		if (process.platform === "freebsd") await assertSwapTargetUnowned(targetSwapRoot, shims, params.timeoutMs);
		try {
			await params.beforeActivate?.();
		} catch (error) {
			throw new PackageUpdateActivationError(error);
		}
		if (native) await native.assertUnchanged();
		if (process.platform === "freebsd") {
			await assertSwapTargetUnowned(targetSwapRoot, shims, params.timeoutMs);
			params.assertCurrent?.();
		}
		if (params.onTransaction) {
			retained = true;
			let retirement;
			let rollbackRefused = false;
			let rollbackResult;
			let retainedAssertion = params.activation?.fence.assertCurrent;
			const retainAuthority = (assertCurrent) => {
				retainedAssertion ??= assertCurrent;
				retainedAssertion();
				return retainedAssertion;
			};
			const assertRollbackSafe = assertProjectUnchanged ? async () => {
				if (!projectActivated) return;
				try {
					await assertProjectUnchanged();
				} catch (error) {
					rollbackRefused = true;
					throw error;
				}
			} : rootLink?.verifyRuntime;
			await params.onTransaction({
				backupRoot,
				...activation ? { databaseBackupRoot } : {},
				...assertRollbackSafe ? { assertRollbackSafe } : {},
				rollback: (assertion) => {
					const assertCurrent = retainAuthority(assertion);
					if (retirement) return Promise.resolve({
						...step(1, null, "Package transaction retirement has started; automatic rollback is no longer available."),
						name: "package-rollback",
						activePackageRoot
					});
					rollbackResult ??= (async () => {
						const rollbackStartedAt = Date.now();
						try {
							await assertRollbackSafe?.();
						} catch (error) {
							assertCurrent();
							return {
								...step(1, null, formatErrorMessage(error)),
								name: "package-rollback",
								activePackageRoot,
								...error instanceof NativePackageRollbackError ? { reason: error.reason } : {}
							};
						}
						const messages = await restoreSwap(assertCurrent);
						return {
							...step(packageRollbackVerified ? 0 : 1, packageRollbackVerified ? `restored previous ${params.packageName} package and affected launchers` : null, messages.join("\n") || null),
							name: "package-rollback",
							activePackageRoot,
							command: `restore ${backupRoot} -> ${targetSwapRoot}`,
							durationMs: Date.now() - rollbackStartedAt
						};
					})();
					return rollbackResult;
				},
				complete: async ({ activationVerified }, assertion) => {
					const assertCurrent = retainAuthority(assertion);
					if (retirement) return await retirement;
					const outcomeVerified = rollbackResult ? (await rollbackResult).exitCode === 0 && packageRollbackVerified : (native ? projectActivated : activationCompleted) && activationVerified;
					assertCurrent();
					if (rollbackRefused || !outcomeVerified) return {
						...step(1, null, `Installation recovery is unverified; inspect the installation and backups in ${targetLayout.globalRoot} before restarting.`),
						name: "package-backup-retention"
					};
					retirement ??= retireVerifiedPackageSwap({
						activation,
						rootLink,
						hadPackage,
						previousRoot,
						backupRoot,
						databaseBackupRoot: rollbackResult ? void 0 : databaseBackupRoot,
						retireLegacyBackups: rollbackResult ? void 0 : retireLegacyBackups,
						launchers,
						packageBackedUp,
						globalRoot: targetLayout.globalRoot,
						assertCurrent,
						step
					});
					return await retirement;
				}
			});
		}
		const restorePackage = async (assertCurrent) => {
			if (!native && hadPackage) {
				const candidatePresent = await packagePathEntryExists(targetSwapRoot);
				const displaced = `${backupRoot}.candidate`;
				activePackageRoot = null;
				try {
					await restoreNpmPackageRoot({
						liveRoot: targetSwapRoot,
						backupRoot,
						displacedRoot: displaced,
						candidatePresent,
						assertCurrent
					});
					displacedCandidateRoot = candidatePresent ? displaced : void 0;
					packageBackedUp = false;
					activePackageRoot = params.installTarget.packageRoot;
				} catch (error) {
					assertCurrent();
					if (candidatePresent) {
						displacedCandidateRoot = await packagePathEntryExists(displaced) ? displaced : void 0;
						activePackageRoot = await packagePathEntryExists(targetSwapRoot) ? targetPackageRoot : null;
						if (displacedCandidateRoot) throw new Error(`${formatErrorMessage(error)}; update retained at ${displacedCandidateRoot}`, { cause: error });
					}
					throw error;
				}
				return;
			}
			activePackageRoot = null;
			await removePackagePath(targetSwapRoot, assertCurrent);
			if (hadPackage) {
				await movePathWithCopyFallback({
					from: backupRoot,
					sourceHardlinks: PACKAGE_MANAGER_SWAP_SOURCE_HARDLINKS,
					to: targetSwapRoot,
					assertBeforeRename: assertCurrent,
					assertBeforeMutation: assertCurrent,
					onDestinationPublished: assertCurrent
				});
				activePackageRoot = params.installTarget.packageRoot;
			}
		};
		const restoreShim = (shim) => async (assertCurrent) => {
			if (shim.backup) await copyPackagePathEntry(shim.backup, shim.destination, assertCurrent, activation?.recordRestoredLauncher.bind(activation, path.basename(shim.destination)));
			else await removePackagePath(shim.destination, assertCurrent);
		};
		if (activation) {
			rollback.push(restorePackage, ...shims.map(restoreShim));
			params.onLiveMutation?.();
			liveMutationStarted = true;
			packageRollbackVerified = false;
			await activation.publish(false, async () => {
				packageBackedUp = true;
				activePackageRoot = null;
				activation.assertCurrent();
				await replayLocalOverrides?.({
					backupRoot,
					packageRoot: path.join(activation.anchor, "candidate")
				});
				activation.assertCurrent();
			});
			activePackageRoot = targetPackageRoot;
			projectActivated = true;
			activationCompleted = true;
		} else {
			await rootLink?.assertLiveUnchanged();
			if (process.platform === "freebsd") params.assertCurrent?.();
			params.onLiveMutation?.();
			liveMutationStarted = true;
			packageRollbackVerified = false;
			if (native || !hadPackage) activePackageRoot = null;
			if (hadPackage) {
				if (native) await movePathWithCopyFallback({
					from: targetSwapRoot,
					sourceHardlinks: PACKAGE_MANAGER_SWAP_SOURCE_HARDLINKS,
					to: backupRoot
				});
				else if (rootLink) {
					const acquisition = await rootLink.acquire();
					if (!acquisition.acquired) {
						activePackageRoot = null;
						throw new Error(acquisition.error);
					}
				} else await backupNpmPackageRoot(targetSwapRoot, backupRoot, params.assertCurrent, warnings);
				activePackageRoot = null;
				packageBackedUp = true;
				packageRollbackVerified = native !== void 0 || previousRoot?.kind === "directory" || previousIdentity !== void 0;
			}
			rollback.push(restorePackage);
			await replayLocalOverrides?.();
			await activateStagedNpmPackageRoot(stagedSwapRoot, targetSwapRoot);
			activePackageRoot = targetPackageRoot;
			projectActivated = true;
			for (const shim of shims) {
				rollback.push(restoreShim(shim));
				await copyPackagePathEntry(shim.source, shim.destination);
			}
			activationCompleted = true;
		}
		await results.verifyLaunchers(shims);
		const postVerifyStep = params.postVerifyStep ? await runPackagePostInstallVerification(targetPackageRoot, params.postVerifyStep) : null;
		if (postVerifyStep && isFailedUpdateStep(postVerifyStep) && !retained) {
			const rollbackMessages = await restoreSwap();
			return results.verificationFailed(activePackageRoot, packageRollbackVerified, rollbackMessages, postVerifyStep);
		}
		if (activation && !retained) {
			activationRetirementStarted = true;
			results.activationWarning(await activation.retireVerified());
		}
		const cleanup = activation ? [] : [hadPackage && !retained ? rootLink ? await rootLink.retire() : await discardPackageUpdateBackup(backupRoot, "old package", targetLayout.globalRoot) : null, !retained ? await discardPackageLauncherBackup(launchers, targetLayout.globalRoot) : null];
		return results.committed(activePackageRoot, hadPackage, cleanup, postVerifyStep);
	} catch (error) {
		if (hasCommandProcessCleanupError(error)) throw error;
		if (error instanceof PackageUpdateActivationError || error instanceof FreeBsdPkgOwnershipError) {
			if (activation && !retained && !liveMutationStarted) {
				const refusal = error instanceof PackageUpdateActivationError ? error.cause : error;
				await retireRefusedPackageSwap(activation, refusal, results.activationWarning);
			} else if (!activation && !preparationCustody) await discardPackageLauncherBackup(launchers, targetLayout.globalRoot);
			throw error instanceof PackageUpdateActivationError ? error : new PackageUpdateActivationError(error);
		}
		const errors = [results.rollbackError(baselineError ?? error)];
		if (!retained && !liveMutationStarted && !activation && !preparationCustody) {
			packageRollbackVerified = false;
			const cleanup = await discardPackageLauncherBackup(launchers, targetLayout.globalRoot);
			if (cleanup) errors.push(cleanup);
		} else if (activationRetirementStarted) errors.push("Package retirement remains pending; use the retained package recovery command.");
		else if (!retained) errors.push(...await restoreSwap());
		return results.failed(activePackageRoot, error, errors, retained ? false : packageRollbackVerified, baselineError);
	}
}
//#endregion
//#region src/infra/package-update-steps.ts
/**
* Stages and verifies a global package update before the swap owner publishes it.
*/
async function runGlobalPackageUpdateSteps(params) {
	const workTimeoutMs = resolveInstallWorkTimeoutMs(params.workTimeoutMs, params.timeoutMs);
	let localOverrides;
	let stagedInstall = null;
	let uncertainLifecycleStage = null;
	let packedInstallDir = null;
	const originalPackageRoot = params.installTarget.packageRoot ?? params.packageRoot ?? null;
	let activePackageRoot = originalPackageRoot;
	let afterVersion = null;
	const initialRecovery = await verifyPackageUpdateRecovery(originalPackageRoot);
	let liveTreeMutated = false;
	let committed = false;
	let cleanupUncertain = false;
	let packageRollbackVerified;
	const steps = [];
	const cleanupStage = async () => {
		if (!stagedInstall || stagedInstall === uncertainLifecycleStage || stagedInstall.activationCustody) return null;
		const cleanup = await discardPackageUpdateStage({
			stage: stagedInstall,
			manager: params.installTarget.manager,
			committed
		});
		if (cleanup.status === "failed") {
			uncertainLifecycleStage = stagedInstall;
			return cleanup.step;
		}
		if (cleanup.status === "advisory") steps.push(cleanup.step);
		stagedInstall = null;
		return null;
	};
	const packageUpdateFailure = async (failedStep, failedSteps = [failedStep]) => {
		const cleanupFailure = await cleanupStage();
		const finalFailedStep = cleanupFailure ?? failedStep;
		const finalFailedSteps = cleanupFailure ? [...failedSteps, cleanupFailure] : failedSteps;
		finalFailedStep.failureFacts ??= [createUpdateFailureFact({
			check: finalFailedStep.name,
			code: "global-install-failed",
			message: finalFailedStep.stderrTail ?? void 0
		}, params.env)];
		const recovery = liveTreeMutated ? {
			serviceRestartSafe: false,
			reason: "runtime-verification-failed",
			...packageRollbackVerified === void 0 ? {} : { packageRollbackVerified }
		} : await verifyUnchangedPackageUpdateRecovery(originalPackageRoot, initialRecovery);
		return {
			localOverrides,
			...finalFailedStep.failureFacts?.some((fact) => fact.code === "global-install-permission-denied") ? { reason: UPDATE_GLOBAL_PERMISSION_REASON } : {},
			steps: finalFailedSteps,
			activePackageRoot,
			afterVersion,
			failedStep: finalFailedStep,
			recovery
		};
	};
	try {
		const permissions = await checkGlobalPackageUpdatePermissions(params.installTarget, params.env);
		if (permissions) return await packageUpdateFailure(permissions);
		if (process.platform === "freebsd") {
			if (!params.installTarget.packageRoot) throw new FreeBsdPkgOwnershipError("pkg-ownership-unavailable", "paths");
			const inspection = createFreeBsdPkgOwnershipInspection(params.timeoutMs);
			await inspection.assertUnowned(params.packageRoot);
			await inspection.assertUnowned(params.installTarget.packageRoot);
		}
		const npmPreflight = await resolveNpmUpdateLifecyclePolicy({ installTarget: params.installTarget });
		if (npmPreflight.failedStep) return await packageUpdateFailure(npmPreflight.failedStep);
		const pnpmPreflight = await validatePnpmIsolatedUpdate({
			installTarget: params.installTarget,
			packageName: params.packageName,
			runCommand: params.runCommand,
			timeoutMs: params.timeoutMs,
			env: params.env
		});
		if (pnpmPreflight.failedStep) return await packageUpdateFailure(pnpmPreflight.failedStep);
		const packageRoot = params.packageRoot ?? params.installTarget.packageRoot;
		if (packageRoot && !params.beforeVerifyCandidate) await cleanupGlobalRenameDirs({
			globalRoot: path.dirname(packageRoot),
			packageName: params.packageName
		});
		const bunOwner = params.installTarget.manager === "bun" ? resolveBunGlobalInstallOwner(params.installTarget.packageRoot ?? params.packageRoot, params.env ?? process.env) : null;
		let effectiveInstallEnv = params.installTarget.manager === "bun" && params.installTarget.globalRoot ? {
			...params.env ?? process.env,
			BUN_INSTALL_GLOBAL_DIR: path.dirname(params.installTarget.globalRoot),
			...bunOwner?.bunInstall ? { BUN_INSTALL: bunOwner.bunInstall } : {}
		} : params.env;
		if (params.installTarget.manager === "pnpm" && params.installTarget.globalRoot) {
			const globalDir = resolvePnpmGlobalDirFromGlobalRoot(params.installTarget.globalRoot);
			effectiveInstallEnv = {
				...params.env ?? process.env,
				...globalDir ? {
					pnpm_config_global_dir: globalDir,
					PNPM_CONFIG_GLOBAL_DIR: globalDir,
					npm_config_global_dir: globalDir,
					NPM_CONFIG_GLOBAL_DIR: globalDir
				} : {},
				...pnpmPreflight.globalBinDir ? {
					pnpm_config_global_bin_dir: pnpmPreflight.globalBinDir,
					PNPM_CONFIG_GLOBAL_BIN_DIR: pnpmPreflight.globalBinDir,
					npm_config_global_bin_dir: pnpmPreflight.globalBinDir,
					NPM_CONFIG_GLOBAL_BIN_DIR: pnpmPreflight.globalBinDir
				} : {}
			};
		}
		const stageNative = params.installTarget.manager !== "npm";
		let globalBinDir = pnpmPreflight.globalBinDir ?? void 0;
		if (stageNative && !globalBinDir) {
			const bin = await runPnpmPreflightProbe({
				installTarget: params.installTarget,
				runCommand: params.runCommand,
				timeoutMs: params.timeoutMs,
				env: effectiveInstallEnv,
				args: params.installTarget.manager === "bun" ? [
					"pm",
					"bin",
					"-g"
				] : ["bin", "-g"],
				name: `${params.installTarget.manager}-staging-preflight`
			});
			if (bin.failedStep) return await packageUpdateFailure(bin.failedStep);
			globalBinDir = bin.result ? readPackageManagerProbeValue(bin.result.stdout) || void 0 : void 0;
		}
		const nativeOptions = stageNative ? {
			env: effectiveInstallEnv ?? process.env,
			globalBinDir,
			installSpec: params.installSpec
		} : void 0;
		const preparedInstall = await prepareStagedPackageInstall(params.installTarget, params.packageName, nativeOptions);
		if (preparedInstall.failedStep) return await packageUpdateFailure(preparedInstall.failedStep);
		stagedInstall = preparedInstall.stagedInstall;
		const commandEnv = stagedInstall.native?.env ?? effectiveInstallEnv;
		const installEnv = commandEnv === void 0 ? {} : { env: commandEnv };
		if (params.installTarget.manager === "pnpm" && stagedInstall.native) {
			const stage = stagedInstall.native;
			for (const [probeName, expectedPath] of [["root", stage.globalRoot], ["bin", stage.binDir]]) {
				const args = [
					probeName,
					"-g",
					...stage.configArgs
				];
				const probe = await runPnpmPreflightProbe({
					installTarget: params.installTarget,
					runCommand: params.runCommand,
					timeoutMs: params.timeoutMs,
					args,
					cwd: stage.projectRoot,
					env: stage.env,
					name: "pnpm-staging-preflight"
				});
				const reportedPath = probe.result && readPackageManagerProbeValue(probe.result.stdout);
				if (!reportedPath || await resolveCanonicalPath(reportedPath) !== await resolveCanonicalPath(expectedPath)) {
					const failedStep = probe.failedStep ?? {
						name: "pnpm-staging-preflight",
						command: [params.installTarget.command, ...args].join(" "),
						cwd: stage.projectRoot,
						durationMs: 0,
						exitCode: 1,
						stderrTail: `pnpm ${probeName} selected ${reportedPath || "an unknown path"}, expected staged destination ${expectedPath}. The live installation was left unchanged.`
					};
					return await packageUpdateFailure(failedStep, [...steps, failedStep]);
				}
			}
		}
		const installCommandTarget = stagedInstall.installTarget;
		const preparedSpec = await prepareNpmGitSourceInstallSpec({
			installTarget: installCommandTarget,
			installSpec: params.installSpec,
			packageName: params.packageName,
			runStep: params.runStep,
			timeoutMs: workTimeoutMs,
			env: params.env,
			installCwd: params.installCwd
		});
		packedInstallDir = preparedSpec.packDir;
		steps.push(...preparedSpec.steps);
		if (preparedSpec.failedStep) return await packageUpdateFailure(preparedSpec.failedStep, steps);
		const updateCwd = stagedInstall.native?.projectRoot ?? preparedSpec.installCwd;
		const updateInstallSpec = installCommandTarget.manager !== "npm" ? resolveNativeInstallSpecFromCwd(preparedSpec.installSpec, params.packageName, preparedSpec.installCwd ?? process.cwd(), installCommandTarget.manager) : preparedSpec.installSpec;
		const updateStep = await classifyPackageUpdatePermissionFailure(await params.runStep({
			name: "package-install",
			argv: [...globalInstallArgs(installCommandTarget, updateInstallSpec, void 0, stagedInstall.prefix, preparedSpec.installCwd, npmPreflight.policy ?? void 0), ...stagedInstall.native?.configArgs ?? []],
			...updateCwd ? { cwd: updateCwd } : {},
			...installEnv,
			timeoutMs: workTimeoutMs,
			...installCommandTarget.manager === "pnpm" ? { input: "" } : {}
		}), params.installTarget, params.env);
		steps.push(updateStep);
		let finalInstallStep = updateStep;
		if (updateStep.exitCode !== 0) {
			if (updateStep.failureFacts?.some((fact) => fact.code === "global-install-permission-denied")) return await packageUpdateFailure(updateStep, steps);
			const cleanupFailure = await cleanupStage();
			if (cleanupFailure) return await packageUpdateFailure(cleanupFailure, [...steps, cleanupFailure]);
			const npm = updateStep.failureFacts?.find((fact) => fact.npmErrorCode);
			const resolutionFailure = npm && [
				"ETARGET",
				"E404",
				"EINTEGRITY"
			].includes(npm.npmErrorCode ?? "");
			const failedPackage = npm?.packageSpec && npmFailurePackageName(npm.packageSpec);
			const dependency = failedPackage && failedPackage !== params.packageName;
			if (installCommandTarget.manager === "pnpm" || resolutionFailure && !dependency || installCommandTarget.manager === "bun" && !resolutionFailure) return await packageUpdateFailure(updateStep, steps);
			const preferOnline = Boolean(resolutionFailure && dependency);
			const preparedFallbackInstall = await prepareStagedPackageInstall(params.installTarget, params.packageName, nativeOptions);
			if (preparedFallbackInstall.failedStep) {
				steps.push(preparedFallbackInstall.failedStep);
				return await packageUpdateFailure(preparedFallbackInstall.failedStep, steps);
			}
			stagedInstall = preparedFallbackInstall.stagedInstall;
			const fallbackStep = await classifyPackageUpdatePermissionFailure(await params.runStep({
				name: preferOnline ? "package-install-prefer-online" : "package-install-omit-optional",
				argv: [
					...globalInstallArgs(stagedInstall.installTarget, updateInstallSpec, void 0, stagedInstall.prefix, preparedSpec.installCwd, npmPreflight.policy ?? void 0),
					...stagedInstall.native?.configArgs ?? [],
					...preferOnline ? installCommandTarget.manager === "bun" ? ["--no-cache"] : [
						"--prefer-online",
						"--prefer-offline=false",
						"--offline=false"
					] : ["--omit=optional"]
				],
				cwd: stagedInstall.native?.projectRoot ?? preparedSpec.installCwd ?? void 0,
				env: stagedInstall.native?.env ?? commandEnv,
				timeoutMs: workTimeoutMs
			}), params.installTarget, params.env);
			if (preferOnline && !isFailedUpdateStep(fallbackStep)) updateStep.advisory = {
				kind: "recoverable-maintenance",
				message: `Repaired stale package cache for ${npm?.packageSpec}: install succeeded after refreshing registry metadata.`
			};
			steps.push(fallbackStep);
			finalInstallStep = fallbackStep;
		}
		if (isFailedUpdateStep(finalInstallStep)) return await packageUpdateFailure(finalInstallStep, steps);
		if (stagedInstall.native && params.installTarget.pnpmIsolated) {
			const activePackages = await listActivePnpmIsolatedGlobalPackages({
				globalRoot: stagedInstall.native.globalRoot,
				packageName: params.packageName
			});
			const candidate = activePackages.length === 1 ? activePackages[0] : void 0;
			if (!candidate) {
				const failedStep = {
					name: "package-verify",
					command: "resolve staged pnpm replacement",
					cwd: stagedInstall.native.projectRoot,
					durationMs: 0,
					exitCode: 1,
					stderrTail: "could not identify a unique active staged pnpm replacement package"
				};
				return await packageUpdateFailure(failedStep, [...steps, failedStep]);
			}
			stagedInstall.packageRoot = candidate.packageRoot;
		}
		const verificationPackageRoot = stagedInstall.packageRoot;
		await params.beforeVerifyCandidate?.(verificationPackageRoot);
		if (packageRoot && params.beforeVerifyCandidate) await cleanupGlobalRenameDirs({
			globalRoot: path.dirname(packageRoot),
			packageName: params.packageName
		});
		const candidateVersion = await readPackageVersion(verificationPackageRoot);
		const expectedVersion = resolveExpectedInstalledVersionFromSpec(params.packageName, params.installSpec);
		let verificationErrors = await collectInstalledGlobalPackageErrors({
			packageRoot: verificationPackageRoot,
			expectedVersion,
			expectedGitCheckout: params.expectedGitCheckout
		});
		const registryTarget = isRegistrySourceInstallSpec(params.installSpec);
		let sameArtifact = false;
		if (!registryTarget && originalPackageRoot) {
			const [candidateBuild, installedBuild] = await Promise.all([readBuiltGatewayBuildId(verificationPackageRoot), readBuiltGatewayBuildId(originalPackageRoot)]);
			sameArtifact = Boolean(candidateBuild && candidateBuild === installedBuild);
		}
		if (verificationErrors.length === 0 && !params.expectedGitCheckout && !params.requirePackageReplacement && (registryTarget || sameArtifact) && candidateVersion && candidateVersion === await readPackageVersionIfPresent(originalPackageRoot)) {
			const cleanupFailure = await cleanupStage();
			if (cleanupFailure) return await packageUpdateFailure(cleanupFailure, [...steps, cleanupFailure]);
			return {
				reason: "already-current",
				steps,
				activePackageRoot: originalPackageRoot,
				afterVersion: candidateVersion,
				failedStep: null,
				recovery: await verifyPackageUpdateRecovery(originalPackageRoot)
			};
		}
		if (verificationErrors.filter((error) => params.installSpec !== "openclaw@2026.8.1" || error !== `unexpected packaged dist file dist/openclaw-install-guard`).length === 0) {
			const lifecycle = await runPackageUpdateLifecycle({
				packageRoot: verificationPackageRoot,
				nodeRunner: params.resolveLifecycleNodeRunner?.(),
				manager: params.installTarget.manager,
				timeoutMs: params.timeoutMs,
				workTimeoutMs: params.workTimeoutMs,
				env: commandEnv,
				runStep: params.runStep,
				steps,
				verifyCompleted: async () => {
					verificationErrors = await collectInstalledGlobalPackageErrors({
						packageRoot: verificationPackageRoot,
						expectedVersion,
						expectedGitCheckout: params.expectedGitCheckout
					});
				}
			});
			if (lifecycle.status === "failed") {
				if (lifecycle.preserveStage) uncertainLifecycleStage = stagedInstall;
				return await packageUpdateFailure(lifecycle.step, steps);
			}
		}
		if (!params.expectedGitCheckout && verificationErrors.length === 0) verificationErrors.push(...await collectPackageDistContentInventoryErrors(verificationPackageRoot));
		if (verificationErrors.length > 0) steps.push(createPackageVerificationFailureStep(verificationPackageRoot, verificationErrors, params.env));
		let failedVerification = verificationErrors.length > 0;
		if (verificationErrors.length === 0) {
			const validation = await params.validateCandidate?.(verificationPackageRoot) ?? [];
			steps.push(...validation);
			const rejectedCandidate = validation.find(isFailedUpdateStep);
			if (rejectedCandidate) return await packageUpdateFailure(rejectedCandidate, steps);
			if (params.activateGitRoot) {
				if (stagedInstall.native || !params.expectedGitCheckout || !(await fs$1.lstat(stagedInstall.packageRoot)).isSymbolicLink()) throw new Error("Prepared source checkout exposure requires an npm package symlink; the current installation has not been changed.");
				await fs$1.unlink(stagedInstall.packageRoot);
				await fs$1.symlink(path.resolve(params.activateGitRoot), stagedInstall.packageRoot, process.platform === "win32" ? "junction" : void 0);
			}
			const swap = await swapStagedPackageInstall({
				timeoutMs: params.timeoutMs,
				stage: stagedInstall,
				installTarget: params.installTarget,
				packageName: params.packageName,
				postVerifyStep: params.postVerifyStep,
				beforeActivate: params.beforeActivate,
				assertCurrent: params.assertCurrent,
				reserveInstallSlot: params.reserveInstallSlot,
				onLiveMutation: () => {
					liveTreeMutated = true;
				},
				onTransaction: params.onTransaction,
				activation: params.getActivation?.(),
				localOverrides: params.expectedGitCheckout ? void 0 : params.localOverrides,
				onLocalOverrides: (result) => {
					localOverrides = result;
					if (result.status === "none") return;
					const message = `Local package overrides: ${result.status}; ${result.applied} replayed. Recovery bundle: ${result.recoveryDir}. ${result.warnings.join(" ")}`;
					const report = {
						name: "local-package-overrides",
						command: "preserve packaged dist edits",
						cwd: originalPackageRoot ?? process.cwd(),
						durationMs: 0,
						exitCode: result.status === "error" ? 1 : 0,
						stdoutTail: message,
						...result.status === "error" ? { stderrTail: message } : { advisory: {
							kind: "recoverable-maintenance",
							message
						} }
					};
					const previous = steps.findIndex((step) => step.name === report.name);
					if (previous === -1) steps.push(report);
					else steps[previous] = report;
				}
			});
			steps.push(swap.step);
			if (swap.postVerifyStep) steps.push(swap.postVerifyStep);
			failedVerification = swap.status === "failed";
			activePackageRoot = swap.activePackageRoot;
			if (swap.status === "committed") {
				committed = true;
				afterVersion = candidateVersion;
			} else packageRollbackVerified = swap.packageRollbackVerified;
		}
		if (failedVerification) afterVersion = await readPackageVersionIfPresent(activePackageRoot);
		const failedStep = steps.find((step) => step !== updateStep && isFailedUpdateStep(step)) ?? null;
		if (failedStep) return await packageUpdateFailure(failedStep, steps);
		const cleanupFailure = await cleanupStage();
		if (cleanupFailure) return await packageUpdateFailure(cleanupFailure, [...steps, cleanupFailure]);
		return {
			localOverrides,
			steps,
			activePackageRoot,
			afterVersion,
			failedStep,
			recovery: afterVersion ? {
				serviceRestartSafe: true,
				version: afterVersion
			} : {
				serviceRestartSafe: false,
				reason: "runtime-verification-failed"
			}
		};
	} catch (error) {
		cleanupUncertain = hasCommandProcessCleanupError(error);
		if (cleanupUncertain) throw error;
		if (error instanceof PackageUpdateActivationError) throw error.cause;
		if (error instanceof FreeBsdPkgOwnershipError) throw error;
		const failedStep = await classifyPackageUpdatePermissionFailure({
			name: "package-update",
			command: "update installed package",
			cwd: activePackageRoot ?? params.installCwd ?? process.cwd(),
			durationMs: 0,
			exitCode: 1,
			stderrTail: formatErrorMessage(error)
		}, params.installTarget, params.env, error);
		return await packageUpdateFailure(failedStep, [...steps, failedStep]);
	} finally {
		if (!cleanupUncertain) {
			await cleanupStage();
			if (packedInstallDir) await removePackageUpdatePath(packedInstallDir);
		}
	}
}
//#endregion
export { NativePackageRollbackError as a, PackageUpdateActivationError as i, failedPackageVerificationStep as n, checkGlobalPackageUpdatePermissions as o, markPackagePostInstallDoctorAdvisory as r, resolveCanonicalPath as s, runGlobalPackageUpdateSteps as t };
