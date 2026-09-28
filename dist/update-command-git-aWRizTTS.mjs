import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { s as normalizeNullableString } from "./string-coerce-CIXf7egm.mjs";
import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as mergeProcessEnv } from "./process-env-DlZFJzq6.mjs";
import { d as sameFileIdentity } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { g as readRegularFile, u as openLocalFileSafely } from "./fs-safe-BAPek8At.mjs";
import { n as resolvePathViaExistingAncestorSync } from "./boundary-path-BzetEUdq.mjs";
import { r as isPathInside, t as hasNodeErrorCode } from "./path-guards-D5kuI0Tv.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as stripAnsi } from "./ansi-CWsy0bu4.mjs";
import { i as UPDATE_RUNNER_TIMEOUT_MS } from "./update-run-timeouts-Byb-PlTk.mjs";
import { l as resolveDevUpstreamRefs, n as DEV_BRANCH, o as isBetaTag, s as isStableTag } from "./update-channels-BDINqyML.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as createUpdateErrorFact } from "./update-failure-facts-DiyYJNo1.mjs";
import { t as _usingCtx } from "./usingCtx-CoYZqMqE.mjs";
import { r as splitShellArgs } from "./shell-argv-DE1kujuY.mjs";
import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-C4wNdxxi.mjs";
import { n as readPackageName, r as readPackageVersion } from "./package-json-skO3uhlG.mjs";
import { w as trimLogTail } from "./restart-sentinel-KM6PPxhT.mjs";
import { i as getUpdateDoctorConfigFailureReason } from "./update-doctor-config-BrLAVDg0.mjs";
import { n as isFailedUpdateStep } from "./update-run-step-ijjXM1mH.mjs";
import { n as quotePowerShellArg, t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { t as UpdateRequesterRevokedError } from "./update-requester-authority-DM9cJimf.mjs";
import { n as parsePackageOpenClawSchemaVersions } from "./openclaw-schema-versions-PVhojTxP.mjs";
import { a as resolveDevUpdateTargetRevision } from "./update-dev-target-DfXIcNWC.mjs";
import { A as createFreeBsdPkgOwnershipInspection, C as verifyPackageUpdateRecovery, i as runStep, l as createGlobalInstallEnv, n as buildUpdateCommandRunner, r as normalizeFallbackFailureReason, t as MAX_LOG_CHARS, v as resolveGlobalInstallTarget, y as resolveNpmLifecyclePolicyGate } from "./update-runner-command-DZBJTDir.mjs";
import { o as resolveControlUiAssetHealth } from "./control-ui-assets-C3-n9r4b.mjs";
import { i as verifyGitUpdateRecovery, n as readBuiltGatewayBuildId } from "./update-git-runtime-CAxWdF8c.mjs";
import { n as recordGitRollbackOutcome, t as readCurrentGitUpdateRecovery } from "./update-runner-git-recovery-BbC1zqVE.mjs";
import { c as normalizeGitPathForFilesystem, s as gitNullConfigPath } from "./git-exec-B6ZpVpQV.mjs";
import { n as compareSemverStrings } from "./update-check-CtYi2ZDp.mjs";
import { d as resolveGitInstallDir, f as resolveGlobalManager, h as runUpdateStep, i as ensureGitCheckout } from "./shared-OuJSSGTT.mjs";
import { r as tryReadDiskSpace } from "./disk-space-CtKhSv74.mjs";
import { a as managerScriptArgs, i as managerInstallIgnoreScriptsArgs, o as resolvePnpmCandidateEnv, r as managerInstallArgs, s as resolveUpdateBuildManager } from "./package-update-steps-9SvtSeZj.mjs";
import { o as relocateRuntimeTree, t as readRuntimeModulesManifest } from "./update-runtime-relocation-YSSIn7u2.mjs";
import "./progress-Duz1sEcD.mjs";
import { a as runPackageUpdateDoctor, r as readPackageUpdateIdentity, t as prepareGitPackageExposure } from "./update-command-package-DTrSEnDD.mjs";
import { a as gatewayServiceCommandUsesRoot } from "./update-command-service-plan-LoWdIMX_.mjs";
import { t as assessInitialUpdateSnapshotCapacity } from "./update-candidate-snapshot-CDDtmKEr.mjs";
import { t as checkGitCandidateNodeRuntime } from "./update-runner-git-node-preflight-DJrN9_Ns.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
import { randomUUID } from "node:crypto";
import { parseDocument } from "yaml";
//#region src/infra/update-maintenance.ts
function formatUpdateCleanupCommand(directory) {
	return process.platform === "win32" ? `Remove-Item -LiteralPath ${quotePowerShellArg(directory)} -Recurse -Force` : `rm -rf -- ${quoteCliArg(directory)}`;
}
/** Only disposable directories owned by this update, never recovery originals. */
async function cleanupUpdateTemporaryDirectory(params) {
	const started = Date.now();
	try {
		await fs.rm(params.directory, {
			recursive: true,
			force: true
		});
	} catch (error) {
		const command = formatUpdateCleanupCommand(params.directory);
		params.onWarning({
			name: params.name,
			command,
			cwd: params.root,
			durationMs: Date.now() - started,
			exitCode: 1,
			stderrTail: formatErrorMessage(error),
			advisory: {
				kind: "recoverable-maintenance",
				message: `Skipped ${params.name}. Remove the retained temporary copy with: ${command}. Reason: ${formatErrorMessage(error)}`
			}
		});
	}
}
//#endregion
//#region src/infra/update-runner-git-cleanup.ts
const PREFLIGHT_CLEANUP_TIMEOUT_MS = 6e4;
async function removePathRecursive(target) {
	await fs.rm(target, {
		recursive: true,
		force: true,
		maxRetries: 3,
		retryDelay: 200
	}).catch(() => {});
}
async function repairPreflightCleanup(worktreeDir, preflightRoot) {
	try {
		await fs.rm(worktreeDir, {
			recursive: true,
			force: true,
			maxRetries: 3,
			retryDelay: 200
		});
		await fs.rm(preflightRoot, {
			recursive: true,
			force: true,
			maxRetries: 3,
			retryDelay: 200
		});
		return true;
	} catch {
		return false;
	}
}
async function cleanupGitPreflight(options, worktreeDir, preflightRoot) {
	const cleanupSignal = new AbortController().signal;
	const cleanupTimeoutMs = Math.min(options.timeoutMs ?? PREFLIGHT_CLEANUP_TIMEOUT_MS, PREFLIGHT_CLEANUP_TIMEOUT_MS);
	const runCleanupCommand = (argv, commandOptions) => options.runCommand(argv, {
		...commandOptions,
		signal: cleanupSignal,
		timeoutMs: cleanupTimeoutMs
	});
	const removeStep = await runStep({
		...options,
		progress: {
			...options.progress,
			onStepComplete: void 0
		},
		runCommand: runCleanupCommand,
		timeoutMs: cleanupTimeoutMs
	});
	if (removeStep.exitCode !== 0 && await repairPreflightCleanup(worktreeDir, preflightRoot)) {
		removeStep.exitCode = 0;
		const message = process.platform === "win32" ? "windows fallback cleanup removed preflight tree" : "fallback cleanup removed preflight tree";
		removeStep.stderrTail = trimLogTail([removeStep.stderrTail, message].filter(Boolean).join("\n"), MAX_LOG_CHARS);
	}
	if (removeStep.exitCode !== 0) removeStep.advisory = {
		kind: "recoverable-maintenance",
		message: `Skipped preflight cleanup. Remove the retained temporary copy with: ${formatUpdateCleanupCommand(preflightRoot)}. Reason: ${removeStep.stderrTail || "temporary worktree removal failed"}`
	};
	await runCleanupCommand([
		"git",
		"-C",
		options.cwd,
		"worktree",
		"prune"
	], { cwd: options.cwd }).catch(() => null);
	await removePathRecursive(preflightRoot);
	options.progress?.onStepComplete?.({
		...removeStep,
		index: options.stepIndex,
		total: options.totalSteps
	});
}
//#endregion
//#region src/infra/update-runner-git-commands.ts
const BUILD_MAX_OLD_SPACE_MB = 8192;
const DEV_PREFLIGHT_LINT_ENV = {
	OPENCLAW_LOCAL_CHECK: "1",
	OPENCLAW_LOCAL_CHECK_MODE: "throttled"
};
const DEV_PREFLIGHT_LINT_OPT_IN_ENV = "OPENCLAW_UPDATE_PREFLIGHT_LINT";
function shouldInstallWithoutScriptsOnWindows(manager) {
	return process.platform === "win32" && manager === "pnpm";
}
function resolveBuildNodeOptions(baseOptions) {
	const current = baseOptions?.trim() ?? "";
	const desired = `--max-old-space-size=${BUILD_MAX_OLD_SPACE_MB}`;
	const existingMatch = /(?:^|\s)--max-old-space-size=(\d+)(?=\s|$)/.exec(current);
	if (!existingMatch) return current ? `${current} ${desired}` : desired;
	const existingValue = Number(existingMatch[1]);
	if (Number.isFinite(existingValue) && existingValue >= BUILD_MAX_OLD_SPACE_MB) return current;
	return current.replace(/(?:^|\s)--max-old-space-size=\d+(?=\s|$)/, ` ${desired}`).trim();
}
function resolveBuildEnv(env = process.env, buildCacheRoot) {
	return {
		...env,
		OPENCLAW_UPDATE_IN_PROGRESS: "1",
		NODE_OPTIONS: resolveBuildNodeOptions(env.NODE_OPTIONS ?? process.env.NODE_OPTIONS),
		...buildCacheRoot ? { BUILD_ALL_CACHE_ROOT: buildCacheRoot } : {}
	};
}
function gitCleanCheckArgs(gitRoot, sourceTreeStagingPaths = []) {
	return [
		"git",
		"-C",
		gitRoot,
		"status",
		"--porcelain",
		"--",
		":!dist/control-ui/",
		...sourceTreeStagingPaths.map((relative) => `:(top,exclude,literal)${relative}`)
	];
}
async function hasExplicitPnpmPreferOfflineConfig(params) {
	try {
		const result = await params.runCommand([
			"pnpm",
			"config",
			"get",
			"prefer-offline"
		], {
			cwd: params.cwd,
			timeoutMs: params.timeoutMs,
			env: params.env
		});
		if (result.code !== 0) return true;
		const value = result.stdout.trim();
		return value !== "" && value !== "undefined" && value !== "null";
	} catch {
		return true;
	}
}
async function prepareCandidateCommandEnv(manager, env, cwd, runCommand, timeoutMs) {
	const effectiveEnv = {
		...env ?? process.env,
		OPENCLAW_DEV_SOURCE_ROOT: cwd
	};
	if (manager !== "pnpm") return { env: effectiveEnv };
	const hasExplicitPreferOffline = effectiveEnv.pnpm_config_prefer_offline !== void 0 || effectiveEnv.PNPM_CONFIG_PREFER_OFFLINE !== void 0;
	const hasConfigPreferOffline = hasExplicitPreferOffline ? false : await hasExplicitPnpmPreferOfflineConfig({
		runCommand,
		cwd,
		timeoutMs,
		env: effectiveEnv
	});
	const candidateEnv = {
		...resolvePnpmCandidateEnv(effectiveEnv, "node_modules/.pnpm"),
		PNPM_CONFIG_RESOLUTION_MODE: env?.PNPM_CONFIG_RESOLUTION_MODE ?? "highest",
		npm_config_resolution_mode: env?.npm_config_resolution_mode ?? "highest",
		pnpm_config_resolution_mode: env?.pnpm_config_resolution_mode ?? "highest"
	};
	if (!hasExplicitPreferOffline && !hasConfigPreferOffline) {
		candidateEnv.PNPM_CONFIG_PREFER_OFFLINE = "true";
		candidateEnv.pnpm_config_prefer_offline = "true";
	}
	const workspaceFile = path.join(cwd, "pnpm-workspace.yaml");
	const original = await fs.readFile(workspaceFile, "utf8").catch((error) => {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	});
	if (original === void 0) return { env: candidateEnv };
	const workspace = parseDocument(original);
	workspace.set("virtualStoreDir", "node_modules/.pnpm");
	const isolated = workspace.toString();
	const backupDirectory = await fs.mkdtemp(path.join(path.dirname(cwd), "workspace-original-"));
	const backupFile = path.join(backupDirectory, "pnpm-workspace.yaml");
	await fs.rename(workspaceFile, backupFile);
	await fs.writeFile(workspaceFile, isolated);
	return {
		env: candidateEnv,
		restoreWorkspace: async () => {
			if ((await fs.lstat(workspaceFile)).isFile() && await fs.readFile(workspaceFile, "utf8") === isolated) await fs.rename(backupFile, workspaceFile);
			await fs.rm(backupDirectory, {
				recursive: true,
				force: true
			});
		}
	};
}
function shouldRunDevPreflightLint(env = process.env) {
	const value = env[DEV_PREFLIGHT_LINT_OPT_IN_ENV]?.trim().toLowerCase();
	return value === "1" || value === "true";
}
function resolveDevPreflightLintEnv(env) {
	return {
		...env,
		...DEV_PREFLIGHT_LINT_ENV
	};
}
//#endregion
//#region src/infra/update-runner-git-preflight.ts
const PREFLIGHT_MAX_COMMITS = 10;
const PREFLIGHT_TEMP_PREFIX = process.platform === "win32" ? "ocu-pf-" : ".openclaw-update-preflight-";
const PREFLIGHT_WORKTREE_DIRNAME = process.platform === "win32" ? "wt" : "worktree";
const WINDOWS_PREFLIGHT_BASE_DIR = "ocu";
function normalizeDevTargetRef(value) {
	const trimmed = value?.trim();
	return trimmed ? trimmed : null;
}
function looksLikeFullCommitSha(value) {
	return /^[0-9a-f]{40}$/i.test(value.trim());
}
function resolveTagFetchRef(candidate) {
	const ref = candidate.endsWith("^{}") ? candidate.slice(0, -3) : candidate;
	return ref.startsWith("refs/tags/") ? ref : null;
}
function buildDevTargetRefResolutionCandidates(devTargetRef) {
	const trimmed = devTargetRef.trim();
	const candidates = [];
	const addCandidate = (candidate) => {
		if (candidate && !candidates.includes(candidate)) candidates.push(candidate);
	};
	if (looksLikeFullCommitSha(trimmed) || trimmed.startsWith("refs/remotes/")) {
		addCandidate(trimmed);
		return candidates;
	}
	if (trimmed.startsWith("refs/heads/")) {
		addCandidate(`refs/remotes/origin/${trimmed.slice(11)}`);
		return candidates;
	}
	if (trimmed.startsWith("origin/")) {
		addCandidate(`refs/remotes/${trimmed}`);
		return candidates;
	}
	if (trimmed.startsWith("refs/tags/")) {
		addCandidate(`${trimmed}^{}`);
		addCandidate(trimmed);
		return candidates;
	}
	addCandidate(`refs/remotes/origin/${trimmed}`);
	addCandidate(`refs/tags/${trimmed}^{}`);
	addCandidate(`refs/tags/${trimmed}`);
	return candidates;
}
function resolvePreflightWorktreeDir(preflightRoot) {
	return path.join(preflightRoot, PREFLIGHT_WORKTREE_DIRNAME);
}
async function createPreflightRoot(artifactRoot) {
	const baseDir = process.platform === "win32" && path.sep === "\\" ? path.win32.join(process.env.SystemDrive ?? "C:", WINDOWS_PREFLIGHT_BASE_DIR) : path.join(await fs.realpath(artifactRoot), ".artifacts");
	await fs.mkdir(baseDir, { recursive: true });
	return fs.mkdtemp(path.join(baseDir, PREFLIGHT_TEMP_PREFIX));
}
async function resetPreflightCandidateWorktree(worktreeDir, step) {
	const resetStep = await runStep(step("preflight-reset", [
		"git",
		"-C",
		worktreeDir,
		"reset",
		"--hard"
	], worktreeDir));
	if (isFailedUpdateStep(resetStep)) return false;
	const cleanStep = await runStep(step("preflight-clean", [
		"git",
		"-C",
		worktreeDir,
		"clean",
		"-fdx"
	], worktreeDir));
	return !isFailedUpdateStep(cleanStep);
}
async function resolveExplicitTarget(params) {
	const warnings = [];
	for (const candidate of buildDevTargetRefResolutionCandidates(params.devTargetRef)) {
		if (candidate.startsWith("refs/remotes/") && !params.refreshedRemotes.some((remote) => candidate.startsWith(`refs/remotes/${remote}/`))) continue;
		const tagFetchRef = resolveTagFetchRef(candidate);
		if (tagFetchRef) {
			const remoteStep = await runStep(params.step("git-remote", [
				"git",
				"-C",
				params.gitRoot,
				"remote"
			], params.gitRoot));
			if (isFailedUpdateStep(remoteStep)) return null;
			const remotes = normalizeStringEntries((remoteStep.stdoutTail ?? "").split("\n"));
			let fetchedTag = false;
			for (const remote of remotes) {
				const options = params.workStep("git-fetch-target-tag", [
					"git",
					"-C",
					params.gitRoot,
					"fetch",
					remote,
					`+${tagFetchRef}:${tagFetchRef}`
				], params.gitRoot);
				const fetchStep = await runStep({
					...options,
					progress: {
						...options.progress,
						onStepComplete: void 0
					}
				});
				const interrupted = fetchStep.termination === "signal" || fetchStep.exitCode === 130 || fetchStep.exitCode === 143;
				const fetchedSuccessfully = fetchStep.exitCode === 0 && !isFailedUpdateStep(fetchStep);
				if (!fetchedSuccessfully && !interrupted) {
					fetchStep.advisory = {
						kind: "recoverable-maintenance",
						message: `Could not fetch the requested tag from ${remote}; trying another remote. ${fetchStep.stderrTail ?? ""}`
					};
					warnings.push(fetchStep.advisory.message);
				}
				if (warnings.length > 0) fetchStep.warnings = [...warnings];
				options.progress?.onStepComplete?.({
					...fetchStep,
					index: options.stepIndex,
					total: options.totalSteps
				});
				if (interrupted) return null;
				if (fetchedSuccessfully) {
					fetchedTag = true;
					break;
				}
			}
			if (remotes.length > 0 && !fetchedTag) continue;
		}
		const shaStep = await runStep(params.step("git-resolve-target", [
			"git",
			"-C",
			params.gitRoot,
			"rev-parse",
			candidate
		], params.gitRoot));
		const sha = shaStep.stdoutTail?.trim();
		if (!isFailedUpdateStep(shaStep) && sha) return sha;
	}
	return null;
}
async function resolveUpstreamCandidates(params) {
	let localDevBranchExists = null;
	let remoteBranchRefs = [];
	if (params.needsCheckoutMain) localDevBranchExists = (await runStep(params.step("git-show-branch", [
		"git",
		"-C",
		params.gitRoot,
		"show-ref",
		"--verify",
		`refs/heads/${DEV_BRANCH}`
	], params.gitRoot))).exitCode === 0;
	if (params.needsCheckoutMain && localDevBranchExists === false) remoteBranchRefs = params.refreshedRemotes.map((remote) => `refs/remotes/${remote}/${DEV_BRANCH}`);
	const upstreamRefs = resolveDevUpstreamRefs(params.needsCheckoutMain, remoteBranchRefs);
	let upstreamSha = null;
	let selectedDevUpstream = null;
	let sawResolvableUpstreamRef = false;
	for (const upstreamRef of upstreamRefs) {
		let resolvedUpstreamRef = upstreamRef;
		if (upstreamRef.endsWith("@{upstream}")) {
			const upstreamStep = await runStep(params.step("upstream-check", [
				"git",
				"-C",
				params.gitRoot,
				"rev-parse",
				"--symbolic-full-name",
				upstreamRef
			], params.gitRoot));
			if (isFailedUpdateStep(upstreamStep)) continue;
			sawResolvableUpstreamRef = true;
			resolvedUpstreamRef = upstreamStep.stdoutTail?.trim() ?? upstreamRef;
		}
		const shaStep = await runStep(params.step("git-resolve-upstream", [
			"git",
			"-C",
			params.gitRoot,
			"rev-parse",
			upstreamRef
		], params.gitRoot));
		const sha = shaStep.stdoutTail?.trim();
		if (!isFailedUpdateStep(shaStep) && sha) {
			upstreamSha = sha;
			selectedDevUpstream = /^refs\/remotes\/(.+)$/u.exec(resolvedUpstreamRef)?.[1] ?? null;
			break;
		}
		if (!isFailedUpdateStep(shaStep)) sawResolvableUpstreamRef = true;
	}
	if (!upstreamSha) return sawResolvableUpstreamRef ? {
		status: "error",
		reason: "no-upstream-sha"
	} : {
		status: "skipped",
		reason: "no-upstream"
	};
	const revListStep = await runStep(params.step("git-rev-list", [
		"git",
		"-C",
		params.gitRoot,
		"rev-list",
		`--max-count=${PREFLIGHT_MAX_COMMITS}`,
		upstreamSha
	], params.gitRoot));
	if (isFailedUpdateStep(revListStep)) return {
		status: "error",
		reason: "preflight-revlist-failed"
	};
	const candidates = normalizeStringEntries((revListStep.stdoutTail ?? "").split("\n"));
	if (candidates.length === 0) return {
		status: "error",
		reason: "preflight-no-candidates"
	};
	return {
		status: "ok",
		sha: upstreamSha,
		candidates,
		selectedDevUpstream,
		localDevBranchExists
	};
}
function classifyPreflightFailure(step) {
	const output = stripAnsi(`${step.stdoutTail ?? ""}\n${step.stderrTail ?? ""}`);
	const nodeNoSpace = /^\s*(?:\[(?:ERR_PNPM_)?ENOSPC\][^\r\n]*|(?:Error:\s*)?)ENOSPC: no space left on device(?:,|$)/m.test(output);
	const gitNoSpace = /^(?:fatal|error): (?:cannot|could not|unable to) [^\r\n]+: No space left on device$/m.test(output);
	return nodeNoSpace || gitNoSpace ? "insufficient-space" : "failed";
}
async function testPreflightCandidate(params) {
	if (!await resetPreflightCandidateWorktree(params.worktreeDir, params.workStep)) return { status: "failed" };
	const runCandidateCheck = async (name, argv, env, factory = params.workStep) => {
		const check = factory(`preflight-${name}`, argv, params.worktreeDir, env);
		const result = await runStep(check);
		return isFailedUpdateStep(result) ? result : null;
	};
	const checkout = await runCandidateCheck("checkout", [
		"git",
		"-C",
		params.worktreeDir,
		"checkout",
		"--detach",
		params.sha
	]);
	if (checkout) return { status: classifyPreflightFailure(checkout) };
	if (params.rebaseFrom) {
		const rebase = await runCandidateCheck("local-checkout", [
			"git",
			"-C",
			params.worktreeDir,
			"checkout",
			"--detach",
			params.rebaseFrom
		]) ?? await runCandidateCheck("rebase", [
			"git",
			"-C",
			params.worktreeDir,
			"rebase",
			params.sha
		]);
		if (rebase) {
			await runCandidateCheck("rebase-abort", [
				"git",
				"-C",
				params.worktreeDir,
				"rebase",
				"--abort"
			], void 0, params.step);
			return { status: classifyPreflightFailure(rebase) };
		}
	}
	const candidateHead = await params.runCommand([
		"git",
		"-C",
		params.worktreeDir,
		"rev-parse",
		"HEAD"
	], {
		cwd: params.worktreeDir,
		timeoutMs: params.timeoutMs
	});
	if (candidateHead.code !== 0 || !candidateHead.stdout.trim()) return { status: "failed" };
	const candidateSha = candidateHead.stdout.trim();
	await params.beforeCandidate(candidateSha);
	const nodeRuntimeStep = await checkGitCandidateNodeRuntime(params.worktreeDir);
	if (nodeRuntimeStep) {
		params.steps.push(nodeRuntimeStep);
		return { status: "node-runtime-incompatible" };
	}
	const manager = await resolveUpdateBuildManager(params.runCommand, params.worktreeDir, params.timeoutMs, params.defaultCommandEnv, { timeoutMs: params.workTimeoutMs });
	if (manager.kind === "missing-required") {
		params.steps.push({
			name: "preflight-package-manager",
			command: `resolve ${manager.preferred} package manager`,
			cwd: params.worktreeDir,
			durationMs: 0,
			exitCode: 1,
			stderrTail: manager.reason
		});
		return {
			status: "manager-unavailable",
			reason: manager.reason
		};
	}
	try {
		const preferIgnoreScripts = shouldInstallWithoutScriptsOnWindows(manager.manager);
		const installArgv = preferIgnoreScripts ? managerInstallIgnoreScriptsArgs(manager.manager) : managerInstallArgs(manager.manager, { compatFallback: manager.fallback && manager.manager === "npm" });
		const installName = preferIgnoreScripts ? "deps-install-ignore-scripts" : "deps-install";
		const candidateCommand = await prepareCandidateCommandEnv(manager.manager, manager.env ?? params.defaultCommandEnv, params.worktreeDir, params.runCommand, params.timeoutMs);
		const buildArgs = managerScriptArgs(manager.manager, "build");
		const buildEnv = resolveBuildEnv(candidateCommand.env, path.join(params.artifactRoot, ".artifacts", "build-all-cache"));
		const lintArgs = managerScriptArgs(manager.manager, "lint");
		let failure = await runCandidateCheck(installName, installArgv, candidateCommand.env) ?? await runCandidateCheck("build", buildArgs, buildEnv);
		if (!failure && (await resolveControlUiAssetHealth({ root: params.worktreeDir })).kind !== "ready") failure = await runCandidateCheck("ui-build", managerScriptArgs(manager.manager, "ui:build"), candidateCommand.env);
		if (!failure && (await resolveControlUiAssetHealth({ root: params.worktreeDir })).kind !== "ready") {
			params.steps.push({
				name: "preflight-ui-assets-verify",
				command: "verify startup assets",
				cwd: params.worktreeDir,
				durationMs: 0,
				exitCode: 1,
				stderrTail: "Update Control UI startup assets are missing or incomplete"
			});
			return { status: "failed" };
		}
		if (!failure && params.runLint) failure = await runCandidateCheck("lint", lintArgs, resolveDevPreflightLintEnv(candidateCommand.env));
		if (failure) return { status: classifyPreflightFailure(failure) };
		await params.prepareGitExposure?.(params.worktreeDir, candidateSha, candidateCommand.env);
		await candidateCommand.restoreWorkspace?.();
		await params.validateCandidate(params.worktreeDir);
		const cleanCheck = await runCandidateCheck("update-clean-check", gitCleanCheckArgs(params.worktreeDir), void 0, params.step);
		const status = params.steps.at(-1);
		if (cleanCheck || status?.stdoutTail?.trim()) {
			if (status) status.exitCode = 1;
			return { status: "failed" };
		}
		const sourceCheck = await runCandidateCheck("update-source-check", [
			"git",
			"-C",
			params.worktreeDir,
			"diff",
			"--quiet",
			candidateSha,
			"--"
		], void 0, params.step);
		if (sourceCheck) {
			sourceCheck.stderrTail = "Update source differs from the selected commit. Repair the source revision before retrying the update.";
			return { status: "failed" };
		}
		await params.prepareCandidate?.(params.worktreeDir, params.preflightRoot);
		return {
			status: "ok",
			candidateSha
		};
	} finally {
		await manager.cleanup?.();
	}
}
async function runGitCandidatePreflight(params) {
	const devTargetRef = params.devTarget ? normalizeDevTargetRef(resolveDevUpdateTargetRevision(params.devTarget)) : null;
	let preflightBaseSha;
	let candidates;
	let selectedDevUpstream = null;
	let localDevBranchExists = null;
	if (params.targetRevision) {
		const result = await params.runCommand([
			"git",
			"-C",
			params.gitRoot,
			"rev-parse",
			`${params.targetRevision}^{commit}`
		], {
			cwd: params.gitRoot,
			timeoutMs: params.timeoutMs
		});
		if (result.code !== 0 || !result.stdout.trim()) return {
			status: "error",
			reason: "no-target-sha"
		};
		preflightBaseSha = result.stdout.trim();
		candidates = [preflightBaseSha];
	} else if (devTargetRef) {
		const targetSha = await resolveExplicitTarget({
			...params,
			devTargetRef
		});
		if (!targetSha) return {
			status: "error",
			reason: "no-target-sha"
		};
		preflightBaseSha = targetSha;
		candidates = [targetSha];
		if (params.devTarget?.mode === "tracked") {
			const ancestryStep = await runStep(params.step("tracked-target-ancestry", [
				"git",
				"-C",
				params.gitRoot,
				"merge-base",
				"--is-ancestor",
				targetSha,
				`${params.devTarget.upstreamRef}^{commit}`
			], params.gitRoot));
			if (isFailedUpdateStep(ancestryStep)) return {
				status: "error",
				reason: "tracked-upstream-invalid"
			};
		}
	} else {
		const upstream = await resolveUpstreamCandidates(params);
		if (upstream.status !== "ok") return upstream;
		preflightBaseSha = upstream.sha;
		candidates = upstream.candidates;
		selectedDevUpstream = upstream.selectedDevUpstream;
		localDevBranchExists = upstream.localDevBranchExists;
	}
	if (!params.prepareGitExposure && preflightBaseSha === params.beforeSha) return {
		status: "skipped",
		reason: "already-current"
	};
	if (params.beforeGitStaging) {
		const admission = await params.beforeGitStaging();
		params.steps.push(admission.step);
		if (isFailedUpdateStep(admission.step)) return {
			status: "error",
			reason: admission.failureReason
		};
	}
	const rebaseFrom = !params.targetRevision && !params.devTarget && localDevBranchExists !== false ? params.needsCheckoutMain ? DEV_BRANCH : params.beforeSha ?? void 0 : void 0;
	await params.beforeCandidate(preflightBaseSha);
	let preflightRoot;
	try {
		preflightRoot = await createPreflightRoot(params.artifactRoot);
	} catch (error) {
		return {
			status: "error",
			reason: hasErrnoCode(error, "ENOSPC") ? "preflight-insufficient-space" : "preflight-worktree-failed"
		};
	}
	const worktreeDir = resolvePreflightWorktreeDir(preflightRoot);
	let tested;
	try {
		const worktreeStep = await runStep(params.workStep("preflight-worktree", [
			"git",
			"-C",
			params.gitRoot,
			"worktree",
			"add",
			"--detach",
			worktreeDir,
			preflightBaseSha
		], params.gitRoot));
		if (isFailedUpdateStep(worktreeStep)) return {
			status: "error",
			reason: classifyPreflightFailure(worktreeStep) === "insufficient-space" ? "preflight-insufficient-space" : "preflight-worktree-failed"
		};
		for (const sha of candidates) {
			if (!params.prepareGitExposure && sha === params.beforeSha) return {
				status: "skipped",
				reason: "already-current"
			};
			if (sha !== preflightBaseSha) await params.beforeCandidate(sha);
			const candidate = await testPreflightCandidate({
				...params,
				worktreeDir,
				preflightRoot,
				sha,
				rebaseFrom,
				runLint: !params.targetRevision && shouldRunDevPreflightLint()
			});
			if (candidate.status === "ok" || candidate.status === "insufficient-space") {
				tested = candidate;
				break;
			}
			const runtimeMismatch = candidate.status === "node-runtime-incompatible";
			if (tested?.status !== "failed" && (!runtimeMismatch || !tested)) tested = candidate;
		}
	} finally {
		await cleanupGitPreflight({
			...params.step("preflight-cleanup", [
				"git",
				"-C",
				params.gitRoot,
				"worktree",
				"remove",
				"--force",
				"--force",
				worktreeDir
			], params.gitRoot),
			runCommand: params.runCommand
		}, worktreeDir, preflightRoot);
	}
	if (tested?.status !== "ok") return {
		status: "error",
		reason: tested?.status === "insufficient-space" ? "preflight-insufficient-space" : tested?.status === "manager-unavailable" ? tested.reason : tested?.status === "node-runtime-incompatible" ? "preflight-node-runtime-incompatible" : "preflight-no-good-commit"
	};
	return {
		status: "ok",
		candidateSha: tested.candidateSha,
		selectedDevUpstream,
		localDevBranchExists
	};
}
//#endregion
//#region src/infra/update-runner-git-target.ts
const UNVERIFIED_GIT_CORRUPTION = /(?:in the commit graph file but not in the object database|probably due to repo corruption)/iu;
const VERIFIED_GIT_CORRUPTION = /(?:broken link from|dangling (?:commit|tree|blob)|hash mismatch|invalid sha1 pointer|missing (?:blob|commit|tree)|object corrupt)/iu;
/** Replace Git's unverified corruption guess when promised objects may be intentionally absent. */
async function classifyPartialCloneGitFailure(params) {
	if (params.result.code === 0 || !UNVERIFIED_GIT_CORRUPTION.test(params.result.stderr)) return params.result;
	const promisorConfig = await params.runCommand([
		"git",
		"-C",
		params.root,
		"config",
		"--includes",
		"--get-regexp",
		"^remote\\..*\\.promisor$"
	], {
		cwd: params.root,
		timeoutMs: params.timeoutMs
	}).catch(() => void 0);
	if (promisorConfig?.code === 0 && promisorConfig.stdout.split("\n").some((line) => /\s(?:true|yes|on|1)$/iu.test(line.trim()))) return {
		...params.result,
		stderr: "Git could not resolve one or more promised objects in this partial clone. This does not by itself indicate repository corruption. Bulk-fetch the missing object IDs from the configured promisor remote, then retry the update (for example: git rev-list --objects --missing=print --all | sed -n 's/^?//p' | git fetch \"<promisor-remote>\" --stdin)."
	};
	const fsck = await params.runCommand([
		"git",
		"--no-lazy-fetch",
		"-C",
		params.root,
		"fsck",
		"--connectivity-only",
		"--no-dangling"
	], {
		cwd: params.root,
		timeoutMs: params.timeoutMs
	}).catch(() => void 0);
	const fsckOutput = `${fsck?.stdout ?? ""}\n${fsck?.stderr ?? ""}`.trim();
	if (fsck?.code !== 0 && VERIFIED_GIT_CORRUPTION.test(fsckOutput)) return {
		...params.result,
		stderr: `Git verified repository corruption with git fsck: ${fsckOutput}`
	};
	return {
		...params.result,
		stderr: "Git reported an object-database inconsistency, but OpenClaw did not verify repository corruption with git fsck. Retry the update; if it recurs, inspect the repository with git fsck before attempting repair."
	};
}
function quoteGitConfig(value) {
	return `"${value.replace(/\\/gu, "\\\\").replace(/"/gu, "\\\"").replace(/\n/gu, "\\n").replace(/\t/gu, "\\t").replaceAll("\b", "\\b")}"`;
}
function gitConfigEntry(key, value) {
	const match = /^([a-z][a-z0-9-]*)\.(?:(.*)\.)?([a-z][a-z0-9-]*)$/iu.exec(key);
	if (!match || /[\r\n]/u.test(match[2] ?? "")) throw new Error("Could not preserve Git target inspection configuration");
	return `[${match[1]}${match[2] === void 0 ? "" : ` ${quoteGitConfig(match[2])}`}]\n\t${match[3]} = ${quoteGitConfig(value)}\n`;
}
/** Fetch and candidate selection must not update the installed repository before admission. */
async function withGitTargetInspectionRoot(params, inspect) {
	const temporaryRoot = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-git-admission-"));
	const inspectionRoot = path.join(temporaryRoot, "repository.git");
	const command = async (root, args, allowMissing = false, options = { timeoutMs: params.timeoutMs }) => {
		const result = await params.runCommand([
			"git",
			"-C",
			root,
			...args
		], {
			cwd: root,
			terminateOnOutputLimit: true,
			...options
		});
		if (result.killed || result.signal || result.termination && result.termination !== "exit" || result.code !== 0 && !(allowMissing && result.code === 1)) throw new Error(`Git target inspection ${args[0]} failed (exit ${result.code})`);
		return result.stdout;
	};
	try {
		const head = (await command(params.root, ["rev-parse", "HEAD"])).trim();
		const headRef = (await command(params.root, [
			"symbolic-ref",
			"-q",
			"HEAD"
		], true)).trim();
		const objects = normalizeGitPathForFilesystem((await command(params.root, [
			"rev-parse",
			"--git-path",
			"objects"
		])).trim());
		const shallow = normalizeGitPathForFilesystem((await command(params.root, [
			"rev-parse",
			"--git-path",
			"shallow"
		])).trim());
		const refs = await command(params.root, ["for-each-ref", "--format=update %(refname) %(objectname)"]);
		await command(params.root, [
			"init",
			"--bare",
			"--template=",
			inspectionRoot
		], false, {
			...params.work ?? { timeoutMs: params.timeoutMs },
			env: { GIT_DEFAULT_HASH: head.length === 64 ? "sha256" : "sha1" }
		});
		await fs.writeFile(path.join(inspectionRoot, "objects", "info", "alternates"), `${quoteGitConfig(path.resolve(params.root, objects))}\n`);
		await fs.copyFile(path.resolve(params.root, shallow), path.join(inspectionRoot, "shallow")).catch((error) => {
			if (!hasErrnoCode(error, "ENOENT")) throw error;
		});
		await command(inspectionRoot, ["update-ref", "--stdin"], false, {
			timeoutMs: params.timeoutMs,
			input: refs
		});
		await command(inspectionRoot, headRef ? [
			"symbolic-ref",
			"HEAD",
			headRef
		] : [
			"update-ref",
			"--no-deref",
			"HEAD",
			head
		]);
		const config = await command(params.root, [
			"config",
			"--includes",
			"--null",
			"--get-regexp",
			"^((remote|branch|url|http|credential|protocol|filter|fetch|transfer|ssh|user|author|committer|gpg)\\.|commit\\.gpgsign$|core\\.(sshcommand|gitproxy|askpass)$)"
		], true);
		const entries = [];
		for (const entry of config.split("\0").filter(Boolean)) {
			const separator = entry.indexOf("\n");
			const key = separator === -1 ? entry : entry.slice(0, separator);
			const value = separator === -1 ? "true" : entry.slice(separator + 1);
			entries.push(gitConfigEntry(key, value));
		}
		await fs.appendFile(path.join(inspectionRoot, "config"), entries.join(""), { mode: 384 });
		const runInspectionCommand = (argv, options) => params.runCommand(argv[0] === "git" && argv[1] === "-C" && argv[2] === inspectionRoot ? [
			"git",
			"-C",
			argv[3] === "worktree" && (argv[4] === "remove" || argv[4] === "prune") ? inspectionRoot : params.root,
			`--git-dir=${inspectionRoot}`,
			...argv.slice(3)
		] : argv, argv[0] === "git" ? {
			...options,
			env: {
				...options.env,
				GIT_CONFIG_NOSYSTEM: "1",
				GIT_CONFIG_GLOBAL: gitNullConfigPath(),
				GIT_CONFIG_COUNT: "0"
			}
		} : options);
		return await inspect(inspectionRoot, runInspectionCommand);
	} finally {
		await cleanupUpdateTemporaryDirectory({
			directory: temporaryRoot,
			root: params.root,
			name: "git-target-inspection-cleanup",
			onWarning: params.onWarning
		});
	}
}
async function readGitTargetSchemaVersions(params) {
	let result;
	try {
		result = await params.runCommand([
			"git",
			"-C",
			params.root,
			"show",
			`${params.revision}:package.json`
		], {
			cwd: params.root,
			timeoutMs: params.timeoutMs
		});
	} catch (error) {
		return {
			status: "unreadable",
			reason: String(error)
		};
	}
	if (result.code !== 0) return {
		status: "unreadable",
		reason: `git show ${params.revision}:package.json exited ${result.code}`
	};
	try {
		const manifest = JSON.parse(result.stdout);
		const schemaVersions = parsePackageOpenClawSchemaVersions(manifest);
		const version = normalizeNullableString(asNullableRecord(manifest)?.version);
		return {
			status: "ok",
			...version ? { version } : {},
			...schemaVersions ? { schemaVersions } : {}
		};
	} catch (error) {
		return {
			status: "unreadable",
			reason: `target package.json unparseable: ${String(error)}`
		};
	}
}
async function prepareGitMutation(params) {
	const target = await readGitTargetSchemaVersions(params);
	const sha = /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/iu.test(params.revision) ? params.revision.toLowerCase() : void 0;
	await params.beforeGitMutation({
		...sha ? { sha } : {},
		...target.status === "ok" ? {
			...target.version ? { version: target.version } : {},
			...target.schemaVersions ? { schemaVersions: target.schemaVersions } : {}
		} : { metadataUnreadable: target.reason }
	});
}
async function selectGitInspectionTarget(params) {
	const tag = params.channel === "dev" ? void 0 : await resolveChannelTag(params.runCommand, params.gitRoot, params.timeoutMs, params.channel);
	if (params.channel !== "dev" && !tag) return {
		status: "error",
		reason: "no-release-tag"
	};
	return runGitCandidatePreflight({
		...params,
		targetRevision: tag ?? void 0
	});
}
async function readBranchName(runCommand, root, timeoutMs) {
	const result = await runCommand([
		"git",
		"-C",
		root,
		"rev-parse",
		"--abbrev-ref",
		"HEAD"
	], { timeoutMs }).catch(() => null);
	return (result?.code === 0 ? result.stdout.trim() : "") || null;
}
async function listGitTags(runCommand, root, timeoutMs) {
	const result = await runCommand([
		"git",
		"-C",
		root,
		"tag",
		"--list",
		"v*",
		"--sort=-v:refname"
	], { timeoutMs }).catch(() => null);
	return result?.code === 0 ? normalizeStringEntries(result.stdout.split("\n")) : [];
}
/**
* Picks the single remote release tags are force-fetched from. The checkout's
* retained tracking remote (`branch.<main>.remote`) wins when it is still
* declared, because a detached release checkout keeps that config and a fork
* `origin` can be tag-less; otherwise the clone's canonical `origin`, then the
* only declared remote. Multiple non-origin remotes need explicit tracking.
*/
function resolveReleaseTagRemote(remotes, trackedUpdateRemote) {
	if (trackedUpdateRemote && remotes.includes(trackedUpdateRemote)) return trackedUpdateRemote;
	return remotes.includes("origin") ? "origin" : remotes.length === 1 ? remotes[0] : void 0;
}
async function fetchGitUpdateTarget(params) {
	const { root, channel, devTarget, name, step: targetStep, workStep, steps } = params;
	const refreshedRemotes = [];
	const result = (ok) => ({
		ok,
		refreshedRemotes
	});
	const remote = await runStep(targetStep("git-remote", [
		"git",
		"-C",
		root,
		"remote"
	], root));
	if (remote.exitCode !== 0) return result(false);
	const remotes = normalizeStringEntries((remote.stdoutTail ?? "").split("\n"));
	const tracked = await runStep(targetStep("git-config-update-upstream", [
		"git",
		"-C",
		root,
		"config",
		"--get",
		`branch.${DEV_BRANCH}.remote`
	], root));
	if (tracked.exitCode !== 0 && tracked.exitCode !== 1) return result(false);
	const trackedRemote = (tracked.stdoutTail ?? "").trim();
	const targetRef = devTarget?.mode === "tracked" ? devTarget.upstreamRef : devTarget?.ref;
	const remoteRef = devTarget?.mode === "tracked" || targetRef?.startsWith("refs/remotes/") || targetRef?.startsWith("origin/") ? targetRef?.replace(/^refs\/remotes\//u, "") : void 0;
	const targetRemote = remoteRef ? remotes.toSorted((left, right) => right.length - left.length).find((candidate) => remoteRef.startsWith(`${candidate}/`)) : void 0;
	const tagRemote = resolveReleaseTagRemote(remotes, trackedRemote);
	const authority = channel !== "dev" ? tagRemote : devTarget ? targetRemote ?? (targetRef?.startsWith("refs/heads/") ? "origin" : void 0) : trackedRemote || void 0;
	if (channel === "dev" && !devTarget && !authority) {
		if ((await runStep(targetStep("git-show-branch", [
			"git",
			"-C",
			root,
			"show-ref",
			"--verify",
			`refs/heads/main`
		], root))).exitCode === 0) return result(true);
	}
	const fetchRemotes = authority ? [authority] : channel !== "dev" || remoteRef || targetRef?.startsWith("refs/tags/") ? [] : targetRef && !/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/iu.test(targetRef) ? remotes.filter((candidate) => candidate === "origin") : remotes;
	for (const fetchRemote of fetchRemotes) {
		if (fetchRemote === ".") continue;
		const options = workStep(authority ? name : `${name}:${fetchRemote}`, [
			"git",
			"-C",
			root,
			"fetch",
			fetchRemote,
			"--prune",
			"--no-tags",
			"--no-prune-tags"
		], root);
		const fetch = await runStep({
			...options,
			progress: {
				...options.progress,
				onStepComplete: void 0
			}
		});
		const interrupted = fetch.termination === "signal" || fetch.exitCode === 130 || fetch.exitCode === 143;
		const fetchedSuccessfully = fetch.exitCode === 0 && !isFailedUpdateStep(fetch);
		if (fetchedSuccessfully && !interrupted) {
			refreshedRemotes.push(fetchRemote);
			if (authority && remotes.some((candidate) => candidate !== authority)) fetch.warnings = [`Fetched only the update remote ${authority}; unrelated remotes were left untouched.`];
		} else if (!authority && !interrupted) fetch.advisory = {
			kind: "recoverable-maintenance",
			message: `Could not refresh optional target remote ${fetchRemote}; continuing target resolution. ${fetch.stderrTail ?? ""}`
		};
		options.progress?.onStepComplete?.({
			...fetch,
			index: options.stepIndex,
			total: options.totalSteps
		});
		if (interrupted || !fetchedSuccessfully && authority) return result(false);
	}
	if (channel === "dev") return result(true);
	if (!tagRemote) {
		steps.push({
			name: "git-release-remote",
			command: "git remote",
			cwd: root,
			durationMs: 0,
			exitCode: 1,
			stderrTail: "Cannot determine the release remote. Set branch.main.remote to the remote that publishes releases."
		});
		return result(false);
	}
	const tags = await runStep(workStep("git-fetch-tags", [
		"git",
		"-C",
		root,
		"fetch",
		"--no-tags",
		"--no-prune",
		"--no-prune-tags",
		tagRemote,
		"+refs/tags/*:refs/tags/*"
	], root));
	return result(tags.exitCode === 0 && !isFailedUpdateStep(tags));
}
async function resolveChannelTag(runCommand, root, timeoutMs, channel) {
	return selectChannelTag(await listGitTags(runCommand, root, timeoutMs), channel);
}
function selectChannelTag(tags, channel) {
	const orderedTags = normalizeStringEntries(tags).toSorted((left, right) => {
		const comparison = compareSemverStrings(left, right);
		return comparison == null ? right.localeCompare(left) : -comparison;
	});
	if (channel === "beta") {
		const betaTag = orderedTags.find((tag) => isBetaTag(tag)) ?? null;
		const stableTag = orderedTags.find((tag) => isStableTag(tag)) ?? null;
		if (!betaTag) return stableTag;
		if (!stableTag) return betaTag;
		const comparison = compareSemverStrings(betaTag, stableTag);
		return comparison != null && comparison < 0 ? stableTag : betaTag;
	}
	return orderedTags.find((tag) => isStableTag(tag)) ?? null;
}
//#endregion
//#region src/infra/update-runner-git-runtime.ts
async function collectRuntimeDirectories(root, runCommand, timeoutMs) {
	const result = await runCommand([
		"git",
		"-C",
		root,
		"ls-files",
		"--others",
		"--ignored",
		"--exclude-standard",
		"--directory",
		"-z",
		"--",
		"dist",
		"dist-runtime",
		"node_modules",
		"**/dist",
		"**/dist-runtime",
		"**/node_modules",
		":(exclude).artifacts/**",
		":(exclude).worktrees/**",
		":(exclude).claude/**"
	], {
		cwd: root,
		timeoutMs
	});
	if (result.code !== 0) throw new Error("Cannot enumerate update runtime outputs");
	return result.stdout.split("\0").filter(Boolean).map((entry) => entry.replace(/\/$/u, "")).filter((entry) => [
		"dist",
		"dist-runtime",
		"node_modules"
	].includes(path.basename(entry)) && !entry.split("/").some((part) => part.startsWith(".")));
}
async function collectDisposableRuntimeCaches(modulesDirs, runtimeRoots, storeRoots) {
	const caches = /* @__PURE__ */ new Set();
	const overlaps = (left, right) => isPathInside(left, right) || isPathInside(right, left);
	for (const modulesDir of modulesDirs) for (const relative of [
		".cache/jiti",
		".vite",
		".vite-temp"
	]) {
		const cache = path.join(modulesDir, relative);
		try {
			if ((await fs.lstat(cache)).isDirectory() && await fs.realpath(cache) === cache && !storeRoots.some((store) => overlaps(cache, store))) caches.add(cache);
		} catch {}
	}
	const pending = [...runtimeRoots];
	const visited = /* @__PURE__ */ new Set();
	while (caches.size > 0 && pending.length > 0) {
		const entry = pending.pop();
		if (visited.has(entry) || caches.has(entry)) continue;
		visited.add(entry);
		const stat = await fs.lstat(entry);
		if (stat.isSymbolicLink()) {
			const targets = [path.resolve(path.dirname(entry), await fs.readlink(entry))];
			try {
				targets.push(await fs.realpath(entry));
			} catch {
				caches.clear();
				break;
			}
			for (const cache of caches) if (targets.some((dependency) => overlaps(cache, dependency))) {
				caches.delete(cache);
				pending.push(cache);
			}
		} else if (stat.isDirectory()) {
			for (const child of await fs.readdir(entry, { withFileTypes: true })) if (child.isDirectory() || child.isSymbolicLink()) pending.push(path.join(entry, child.name));
		}
	}
	return caches;
}
/** Stage on the destination filesystem; activation only renames the already validated runtime. */
async function prepareGitRuntimePromotion(root, candidateRoot, runCommand, timeoutMs, cleanupRoot) {
	const relocation = {
		sourceRoot: await fs.realpath(candidateRoot),
		destinationRoot: await fs.realpath(root),
		sourceAliases: [candidateRoot]
	};
	const directories = await collectRuntimeDirectories(relocation.sourceRoot, runCommand, timeoutMs);
	const copiedRoots = /* @__PURE__ */ new Map();
	for (const relative of directories) {
		const sourceRoot = path.join(relocation.sourceRoot, relative);
		copiedRoots.set(sourceRoot, {
			sourceRoot,
			destinationRoot: path.join(relocation.destinationRoot, relative)
		});
	}
	const stores = /* @__PURE__ */ new Map();
	const ownedRoot = await fs.realpath(cleanupRoot);
	for (const relative of directories) {
		if (path.basename(relative) !== "node_modules") continue;
		const modulesDir = path.join(relocation.sourceRoot, relative);
		const virtualStoreDir = (await readRuntimeModulesManifest(path.join(modulesDir, ".modules.yaml")))?.manifest.virtualStoreDir;
		if (typeof virtualStoreDir !== "string") continue;
		const store = path.resolve(modulesDir, virtualStoreDir);
		const sourceRoot = path.join(await fs.realpath(path.dirname(store)), path.basename(store));
		const owned = isPathInside(ownedRoot, sourceRoot);
		const storeRelocation = {
			sourceRoot,
			destinationRoot: owned ? path.resolve(relocation.destinationRoot, path.relative(relocation.sourceRoot, sourceRoot)) : sourceRoot,
			sourceAliases: [store]
		};
		const destinationEntry = path.join(resolvePathViaExistingAncestorSync(path.dirname(storeRelocation.destinationRoot)), path.basename(storeRelocation.destinationRoot));
		if (isPathInside(sourceRoot, relocation.sourceRoot) || owned && isPathInside(destinationEntry, relocation.destinationRoot)) throw new Error("Update pnpm virtual store overlaps the source or live checkout; use a dedicated store directory before updating.");
		stores.set(sourceRoot, storeRelocation);
		if (owned) copiedRoots.set(sourceRoot, storeRelocation);
	}
	const relocations = [...stores.values(), relocation];
	const roots = [...copiedRoots.values()].filter((entry) => ![...copiedRoots.keys()].some((other) => other !== entry.sourceRoot && isPathInside(other, entry.sourceRoot)));
	const destinations = roots.map(({ destinationRoot }) => path.join(resolvePathViaExistingAncestorSync(path.dirname(destinationRoot)), path.basename(destinationRoot)));
	const storeRoots = [...stores.keys()];
	for (const store of stores.keys()) {
		const payload = await fs.realpath(store);
		storeRoots.push(payload, ...stores.get(store)?.sourceAliases ?? []);
		if (!copiedRoots.has(store) && destinations.some((dest) => isPathInside(dest, store)) || !roots.some(({ sourceRoot }) => isPathInside(sourceRoot, payload)) && destinations.some((dest) => isPathInside(dest, payload))) throw new Error("Update pnpm virtual store overlaps a runtime directory being replaced.");
	}
	const disposableCaches = await collectDisposableRuntimeCaches(directories.filter((relative) => path.basename(relative) === "node_modules").map((relative) => path.join(relocation.sourceRoot, relative)), roots.map(({ sourceRoot }) => sourceRoot), storeRoots);
	const staged = [];
	const promoted = [];
	let restoreStarted = false;
	const cleanup = async () => {
		await Promise.all(staged.filter((entry) => !restoreStarted || !promoted.includes(entry)).map((entry) => fs.rm(entry.temporary, {
			recursive: true,
			force: true
		})));
	};
	try {
		for (const { sourceRoot, destinationRoot: destination } of roots) {
			const temporary = `${destination}.openclaw-update-${randomUUID()}.tmp`;
			const entry = {
				destination,
				temporary,
				previous: false
			};
			staged.push(entry);
			await fs.mkdir(temporary, { recursive: true });
			const candidate = path.join(temporary, "candidate");
			await fs.cp(sourceRoot, candidate, {
				recursive: true,
				preserveTimestamps: true,
				verbatimSymlinks: true,
				filter: (source) => !disposableCaches.has(source)
			});
			await relocateRuntimeTree(candidate, sourceRoot, destination, relocations);
		}
	} catch (error) {
		await cleanup();
		throw error;
	}
	return {
		sourceTreeStagingPaths: staged.flatMap(({ temporary }) => {
			const relative = path.relative(relocation.destinationRoot, temporary);
			return relative && relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative) ? [relative.split(path.sep).join("/")] : [];
		}),
		async activate() {
			for (const entry of staged) {
				try {
					await fs.rename(entry.destination, path.join(entry.temporary, "previous"));
					entry.previous = true;
				} catch (error) {
					if (!hasErrnoCode(error, "ENOENT")) throw error;
				}
				promoted.push(entry);
				await fs.rename(path.join(entry.temporary, "candidate"), entry.destination);
			}
		},
		async restore() {
			restoreStarted = true;
			for (const entry of promoted.toReversed()) {
				await fs.rm(entry.destination, {
					recursive: true,
					force: true
				});
				if (entry.previous) await fs.rename(path.join(entry.temporary, "previous"), entry.destination);
				promoted.pop();
			}
		},
		cleanup
	};
}
//#endregion
//#region src/infra/update-runner-git-step-policy.ts
/** Work and probes share progress ordering, including commands in the private inspection clone. */
function createGitUpdateSteps(params) {
	let stepIndex = 0;
	const forRunner = (runCommand) => {
		const withDeadline = (timeoutMs) => (name, argv, cwd, env) => ({
			runCommand,
			name,
			argv,
			cwd,
			timeoutMs,
			env,
			progress: params.opts.progress,
			stepIndex: stepIndex++,
			totalSteps: params.totalSteps,
			results: params.results
		});
		return {
			step: withDeadline(params.probeTimeoutMs),
			workStep: withDeadline(params.opts.timeoutMs)
		};
	};
	const recoveryStep = (name, argv, cwd) => ({
		runCommand: params.runCommand,
		name,
		argv,
		cwd,
		timeoutMs: params.probeTimeoutMs,
		stepIndex: 0,
		totalSteps: 1,
		results: params.results
	});
	return {
		...forRunner(params.runCommand),
		forRunner,
		recoveryStep
	};
}
//#endregion
//#region src/infra/update-runner-git-steps.ts
async function runGitCleanCheckStep(options) {
	const result = await runStep({
		...options,
		progress: {
			...options.progress,
			onStepComplete: void 0
		}
	});
	const dirty = !isFailedUpdateStep(result) && Boolean(result.stdoutTail?.trim());
	if (dirty) {
		result.exitCode = 1;
		result.stderrTail = "This checkout has local changes. Installation has not started.";
	}
	options.progress?.onStepComplete?.({
		...result,
		index: options.stepIndex,
		total: options.totalSteps
	});
	return {
		result,
		dirty
	};
}
async function runGitUpstreamStep(options) {
	const upstreamStep = await runStep({
		...options,
		progress: {
			...options.progress,
			onStepComplete: void 0
		}
	});
	if (typeof upstreamStep.exitCode === "number" && upstreamStep.exitCode !== 0 && !upstreamStep.signal && !upstreamStep.killed && !upstreamStep.outputLimitExceeded && (!upstreamStep.termination || upstreamStep.termination === "exit") && upstreamStep.exitCode !== 130 && upstreamStep.exitCode !== 143) {
		const quote = process.platform === "win32" ? quotePowerShellArg : quoteCliArg;
		upstreamStep.advisory = {
			kind: "recoverable-maintenance",
			message: `Skipped Git upstream tracking setup. Complete it with: git ${options.argv.slice(1).map(quote).join(" ")}. Reason: ${upstreamStep.stderrTail || "git branch failed"}`
		};
	}
	options.progress?.onStepComplete?.({
		...upstreamStep,
		index: options.stepIndex,
		total: options.totalSteps
	});
	return upstreamStep;
}
//#endregion
//#region src/infra/update-runner-git-transfer.ts
const LARGE_CANDIDATE_PACK_WARNING_BYTES = 268435456;
function recordStagingFailure(step, name, command, message, durationMs = 0) {
	const failure = {
		name,
		command,
		cwd: step.cwd,
		durationMs,
		exitCode: 1,
		stderrTail: message
	};
	step.results?.push(failure);
	step.progress?.onStepComplete?.({
		...failure,
		index: step.stepIndex,
		total: step.totalSteps
	});
}
/** Prepare a self-contained pack before admission can stop the serving gateway. */
async function prepareGitCandidateTransfer(params) {
	try {
		var _usingCtx$2 = _usingCtx();
		const { candidateSha, beforeSha, installedRoot, installedRunCommand, upstreamRef, step } = params;
		const runGit = async (name, args, input, root = step.cwd, budget = { timeoutMs: params.probeTimeoutMs }) => {
			let stdout = "";
			const result = await runStep({
				...step,
				timeoutMs: budget.timeoutMs,
				name,
				cwd: root,
				argv: [
					"git",
					"-C",
					root,
					...args
				],
				runCommand: async (argv, options) => {
					const commandResult = await classifyPartialCloneGitFailure({
						result: await step.runCommand(argv, {
							...options,
							input,
							terminateOnOutputLimit: true
						}),
						root: installedRoot,
						runCommand: installedRunCommand,
						timeoutMs: params.probeTimeoutMs
					});
					stdout = commandResult.stdout;
					return args.includes("rev-list") || args.includes("cat-file") ? {
						...commandResult,
						stdout: ""
					} : commandResult;
				}
			});
			return !isFailedUpdateStep(result) && !result.signal ? stdout.trim() : void 0;
		};
		const upstreamSha = upstreamRef ? await runGit("git-pin-update-upstream", ["rev-parse", upstreamRef]) : void 0;
		if (upstreamRef && !upstreamSha) return;
		const objects = await runGit("git-update-history", [
			"rev-list",
			"--objects",
			"--no-object-names",
			"--missing=allow-any",
			candidateSha,
			...upstreamSha ? [upstreamSha] : [],
			...beforeSha ? [`^${beforeSha}`] : []
		]);
		const tree = await runGit("git-update-tree", [
			"rev-list",
			"--objects",
			"--no-object-names",
			`${candidateSha}^{tree}`
		]);
		if (objects === void 0 || tree === void 0) return;
		const retained = /* @__PURE__ */ new Set();
		const probe = beforeSha ? await step.runCommand([
			"git",
			"--no-lazy-fetch",
			"version"
		], {
			cwd: installedRoot,
			timeoutMs: params.probeTimeoutMs
		}) : void 0;
		if (probe?.code === 0 && probe.stdout.startsWith("git version ") && !probe.killed && !probe.signal && (!probe.termination || probe.termination === "exit")) {
			const beforeTree = await runGit("git-retained-tree", [
				"rev-list",
				"--objects",
				"--no-object-names",
				`${beforeSha}^{tree}`
			]);
			if (beforeTree === void 0) return;
			const local = await runGit("git-retained-object-availability", [
				"--no-lazy-fetch",
				"cat-file",
				"--batch-check=%(objectname) %(objecttype)"
			], `${beforeTree}\n`, installedRoot);
			if (local === void 0) return;
			const pending = new Set(beforeTree.split("\n"));
			for (const line of local.split("\n")) {
				const [oid, type, ...extra] = line.split(" ");
				if (!oid || !type || extra.length || !pending.delete(oid) || ![
					"blob",
					"tree",
					"missing"
				].includes(type)) return recordStagingFailure({
					...step,
					cwd: installedRoot
				}, "git-retained-object-inventory", "verify retained Git object availability", "Incomplete retained Git object availability inventory");
				if (type !== "missing") retained.add(oid);
			}
			if (pending.size) return recordStagingFailure({
				...step,
				cwd: installedRoot
			}, "git-retained-object-inventory", "verify retained Git object availability", "Incomplete retained Git object availability inventory");
		}
		const input = [...new Set(`${objects}\n${tree}`.split("\n").filter(Boolean))].filter((oid) => !retained.has(oid)).map((oid) => `${oid}\n`).join("");
		const prefix = path.join(step.cwd, "update-candidate");
		const hash = await runGit("git-pack-update", [
			"-c",
			"pack.packSizeLimit=0",
			"pack-objects",
			"--max-pack-size=0",
			prefix
		], input, step.cwd, { timeoutMs: step.timeoutMs });
		if (!hash) return;
		const stagedPack = _usingCtx$2.a(new AsyncDisposableStack());
		let pack;
		const packPath = `${prefix}-${hash}.pack`;
		const readStarted = Date.now();
		let requiredBytes;
		try {
			pack = stagedPack.use(await openLocalFileSafely({ filePath: packPath }));
			requiredBytes = pack.stat.size + (await fs.stat(`${prefix}-${hash}.idx`)).size;
		} catch (error) {
			return recordStagingFailure(step, "git-update-pack-read", `read update pack ${packPath}`, `Cannot stage the Git update pack: ${String(error)}`, Date.now() - readStarted);
		}
		const objectDirectory = await runGit("git update object directory", [
			"rev-parse",
			"--path-format=absolute",
			"--git-path",
			"objects"
		], void 0, installedRoot);
		if (!objectDirectory) return;
		const capacity = tryReadDiskSpace(objectDirectory);
		if (capacity && capacity.availableBytes < requiredBytes) {
			const reason = "snapshot-capacity-insufficient";
			recordStagingFailure(step, "git update pack capacity", "measure Git update pack capacity", `${reason}: Git update pack and index need ${requiredBytes} bytes in ${objectDirectory}; ${capacity.availableBytes} bytes available. Free space on this volume and retry; the installed checkout is unchanged.`, Date.now() - readStarted);
			return {
				status: "error",
				reason
			};
		}
		const warnings = [];
		if (pack.stat.size > LARGE_CANDIDATE_PACK_WARNING_BYTES) warnings.push(`Large Git update pack: ${pack.stat.size} bytes; importing from disk without buffering it in memory.`);
		if (!capacity) warnings.push("Git object-volume free space could not be measured; continuing the update.");
		const measured = {
			name: "git update pack capacity",
			command: "measure Git update pack capacity",
			cwd: installedRoot,
			durationMs: Date.now() - readStarted,
			exitCode: 0,
			stdoutTail: `Git update pack and index: ${requiredBytes} bytes; ${capacity ? `${capacity.availableBytes} bytes available` : "free space unknown"} in ${objectDirectory}.`,
			...warnings.length ? { warnings } : {}
		};
		step.results?.push(measured);
		step.progress?.onStepComplete?.({
			...measured,
			index: step.stepIndex,
			total: step.totalSteps
		});
		const keepMessage = `openclaw-update-${randomUUID()}`;
		const retainedPack = stagedPack.move();
		return {
			status: "ok",
			[Symbol.asyncDispose]: () => retainedPack[Symbol.asyncDispose](),
			async importInto(target) {
				const imported = await runStep({
					...target,
					argv: [
						"git",
						"-C",
						target.cwd,
						"index-pack",
						"--stdin",
						`--keep=${keepMessage}`
					],
					runCommand: (argv, options) => target.runCommand(argv, {
						...options,
						stdinFileDescriptor: pack.handle.fd
					})
				});
				if (isFailedUpdateStep(imported)) return false;
				if (!upstreamRef || !upstreamSha) return true;
				const tracked = await runStep({
					...target,
					name: "git-import-admitted-upstream",
					argv: [
						"git",
						"-C",
						target.cwd,
						"update-ref",
						upstreamRef,
						upstreamSha
					]
				});
				return !isFailedUpdateStep(tracked);
			},
			async cleanup(target) {
				try {
					const location = await target.runCommand([
						"git",
						"-C",
						target.cwd,
						"rev-parse",
						"--path-format=absolute",
						"--git-path",
						`objects/pack/pack-${hash}.keep`
					], {
						cwd: target.cwd,
						timeoutMs: params.probeTimeoutMs
					});
					if (location.code !== 0) throw new Error("Cannot locate the retained Git update pack");
					const keepPath = location.stdout.trim();
					if (await fs.readFile(keepPath, "utf8").catch((error) => {
						if (hasErrnoCode(error, "ENOENT")) return;
						throw error;
					}) === `${keepMessage}\n`) await fs.unlink(keepPath);
				} catch (error) {
					const warning = {
						name: "git-update-pack-cleanup",
						command: "release retained Git update pack",
						cwd: target.cwd,
						durationMs: 0,
						exitCode: 1,
						stderrTail: String(error),
						advisory: {
							kind: "recoverable-maintenance",
							message: `Git update pack could not be removed: ${String(error)}`
						}
					};
					target.results?.push(warning);
					target.progress?.onStepComplete?.({
						...warning,
						index: 0,
						total: 0
					});
				}
			}
		};
	} catch (_) {
		_usingCtx$2.e = _;
	} finally {
		await _usingCtx$2.d();
	}
}
//#endregion
//#region src/infra/update-runner-git.ts
async function updateGitCheckout(params) {
	const { opts, defaultCommandEnv, timeoutMs, startedAt } = params;
	let gitRoot = params.gitRoot;
	const runCommand = (argv, options) => params.runCommand(argv, {
		...options,
		...argv[0] === "git" ? { env: {
			...options.env,
			GIT_OPTIONAL_LOCKS: "0"
		} } : {}
	});
	const channel = opts.channel ?? "dev";
	if (channel === "extended-stable") return {
		status: "error",
		mode: "git",
		root: gitRoot,
		reason: "unsupported_git_channel",
		recovery: await readCurrentGitUpdateRecovery(gitRoot, timeoutMs),
		steps: [],
		durationMs: Date.now() - startedAt
	};
	const beforeSha = (await runCommand([
		"git",
		"-C",
		gitRoot,
		"rev-parse",
		"HEAD"
	], {
		cwd: gitRoot,
		timeoutMs
	})).stdout.trim() || null;
	const [beforeVersion, beforeBuildId] = await Promise.all([readPackageVersion(gitRoot), readBuiltGatewayBuildId(gitRoot)]);
	const before = {
		sha: beforeSha,
		version: beforeVersion,
		...beforeBuildId ? { buildId: beforeBuildId } : {}
	};
	const branch = await readBranchName(runCommand, gitRoot, timeoutMs);
	const devTarget = channel === "dev" ? opts.devTarget : void 0;
	const hasDevTarget = devTarget !== void 0;
	const needsCheckoutMain = channel === "dev" && !hasDevTarget && branch !== "main";
	const totalSteps = channel === "dev" ? needsCheckoutMain ? 12 : 11 : 9;
	const steps = [];
	const { step, workStep, forRunner, recoveryStep } = createGitUpdateSteps({
		runCommand,
		opts,
		probeTimeoutMs: timeoutMs,
		totalSteps,
		results: steps
	});
	let createdDevBranchDuringUpdate = false;
	let mutationPrepared = false;
	let sourceMutationStarted = false;
	let runtimePromotion;
	let candidateTransfer;
	let stateMigrationStarted = false;
	let cleanupUncertain = false;
	let recovery = await verifyGitUpdateRecovery({
		root: gitRoot,
		sha: beforeSha
	});
	let rollbackOutcome = {
		status: "not-needed",
		reason: "Installed checkout was not changed"
	};
	const prepareMutation = async (revision, root = gitRoot, runner = runCommand) => {
		if (mutationPrepared) {
			await prepareGitMutation({
				runCommand: runner,
				root,
				revision,
				timeoutMs,
				beforeGitMutation: opts.inspectGitTarget
			});
			return;
		}
		await prepareGitMutation({
			runCommand: runner,
			root,
			revision,
			timeoutMs,
			beforeGitMutation: opts.beforeGitMutation
		});
		mutationPrepared = true;
		recovery = {
			serviceRestartSafe: false,
			reason: "runtime-verification-failed"
		};
	};
	const buildError = (reason, status = "error") => ({
		status,
		mode: "git",
		root: gitRoot,
		reason,
		before,
		recovery,
		rollbackOutcome,
		steps,
		durationMs: Date.now() - startedAt
	});
	const appendRecoveryStep = async (name, argv) => {
		const result = await runStep(recoveryStep(name, argv, gitRoot));
		return !isFailedUpdateStep(result);
	};
	const verifyRollbackHead = async () => {
		if (!beforeSha) return false;
		const result = await runStep({
			runCommand,
			name: "git-rollback-verify-head",
			argv: [
				"git",
				"-C",
				gitRoot,
				"rev-parse",
				"HEAD"
			],
			cwd: gitRoot,
			timeoutMs,
			stepIndex: 0,
			totalSteps: 1,
			results: steps
		});
		const verified = !isFailedUpdateStep(result) && result.stdoutTail?.trim() === beforeSha;
		result.exitCode = verified ? 0 : 1;
		if (!verified) result.stderrTail = `expected ${beforeSha}, found ${result.stdoutTail?.trim() || "unreadable HEAD"}`;
		return verified;
	};
	const rollback = async () => {
		if (!beforeSha) return false;
		let restored = await appendRecoveryStep("git-rollback-clean", [
			"git",
			"-C",
			gitRoot,
			"reset",
			"--hard"
		]);
		restored = await appendRecoveryStep("git-rollback-clean-untracked", [
			"git",
			"-C",
			gitRoot,
			"clean",
			"-fd",
			"-e",
			"dist/control-ui/",
			...runtimePromotion?.sourceTreeStagingPaths.flatMap((relative) => ["-e", `/${relative}/`]) ?? []
		]) && restored;
		if (branch && branch !== "HEAD") {
			const checkedOut = await appendRecoveryStep("git-rollback-checkout", [
				"git",
				"-C",
				gitRoot,
				"checkout",
				"--force",
				branch
			]);
			if (checkedOut) {
				restored = await appendRecoveryStep("git-rollback-reset", [
					"git",
					"-C",
					gitRoot,
					"reset",
					"--hard",
					beforeSha
				]) && restored;
				if (createdDevBranchDuringUpdate) await appendRecoveryStep("git-rollback-delete-branch", [
					"git",
					"-C",
					gitRoot,
					"branch",
					"-D",
					DEV_BRANCH
				]);
			}
			const verified = await verifyRollbackHead();
			return restored && checkedOut && verified;
		}
		restored = await appendRecoveryStep("git-rollback-checkout", [
			"git",
			"-C",
			gitRoot,
			"checkout",
			"--detach",
			beforeSha
		]) && restored;
		if (createdDevBranchDuringUpdate) await appendRecoveryStep("git-rollback-delete-branch", [
			"git",
			"-C",
			gitRoot,
			"branch",
			"-D",
			DEV_BRANCH
		]);
		const verified = await verifyRollbackHead();
		return restored && verified;
	};
	const rollbackError = async (reason) => {
		try {
			if (!sourceMutationStarted) {
				if (!await checkSourceUnchanged()) recovery = await verifyGitUpdateRecovery({
					root: gitRoot,
					sha: beforeSha
				});
				return buildError(reason);
			}
			if (stateMigrationStarted) {
				rollbackOutcome = {
					status: "not-attempted",
					reason: "State migration started; restoring code alone cannot restore operator state"
				};
				return buildError(reason);
			}
			const sourceRestored = await rollback();
			let runtimeRestored = true;
			try {
				await runtimePromotion?.restore();
			} catch (error) {
				runtimeRestored = false;
				steps.push({
					name: "git-runtime-rollback",
					command: "restore previous runtime",
					cwd: gitRoot,
					durationMs: 0,
					exitCode: 1,
					stderrTail: String(error)
				});
			}
			recovery = !sourceRestored ? {
				serviceRestartSafe: false,
				reason: "source-rollback-failed"
			} : !runtimeRestored ? {
				serviceRestartSafe: false,
				reason: "runtime-verification-failed"
			} : await verifyGitUpdateRecovery({
				root: gitRoot,
				sha: beforeSha
			});
			const restored = sourceRestored && runtimeRestored && recovery.serviceRestartSafe;
			rollbackOutcome = {
				status: restored ? "succeeded" : "failed",
				reason: restored ? "Previous checkout and runtime restored and verified" : "Previous checkout or runtime restoration could not be verified"
			};
			return buildError(reason);
		} catch (error) {
			if (sourceMutationStarted && !stateMigrationStarted) rollbackOutcome = {
				status: "failed",
				reason: "Rollback threw before restoration could be verified"
			};
			throw error;
		} finally {
			recordGitRollbackOutcome({
				outcome: rollbackOutcome,
				progress: opts.progress,
				root: gitRoot,
				steps
			});
		}
	};
	const runRequiredStep = async (name, argv, reason) => {
		const result = await runStep(workStep(name, argv, gitRoot));
		if (!isFailedUpdateStep(result)) return null;
		return mutationPrepared ? rollbackError(reason) : buildError(reason);
	};
	const { result: statusCheck, dirty } = await runGitCleanCheckStep(step("clean-check", gitCleanCheckArgs(gitRoot), gitRoot));
	if (isFailedUpdateStep(statusCheck)) return buildError(dirty ? "dirty" : "clean-check-failed");
	const checkSourceUnchanged = async () => {
		const currentHead = await runCommand([
			"git",
			"-C",
			gitRoot,
			"rev-parse",
			"HEAD"
		], {
			cwd: gitRoot,
			timeoutMs
		});
		const currentStatus = await runCommand(gitCleanCheckArgs(gitRoot, runtimePromotion?.sourceTreeStagingPaths), {
			cwd: gitRoot,
			timeoutMs
		});
		if (currentHead.code !== 0 || currentStatus.code !== 0) return {
			status: "error",
			reason: "clean-check-failed"
		};
		const currentBranch = await readBranchName(runCommand, gitRoot, timeoutMs);
		if (currentHead.stdout.trim() !== beforeSha || currentBranch !== branch || currentStatus.stdout.trim()) return {
			status: "error",
			reason: "dirty"
		};
	};
	try {
		const inspectAndPrepare = async (inspectionRoot, runInspectionCommand) => {
			let publishedCandidate = false;
			const { step: inspectionStep, workStep: inspectionWorkStep } = forRunner(runInspectionCommand);
			const importCandidate = async (candidateSha, upstreamRef) => {
				try {
					var _usingCtx$1 = _usingCtx();
					const transfer = await prepareGitCandidateTransfer({
						candidateSha,
						beforeSha,
						installedRoot: gitRoot,
						installedRunCommand: runCommand,
						upstreamRef,
						step: inspectionWorkStep("git-pack-update", [], inspectionRoot),
						probeTimeoutMs: timeoutMs
					});
					if (!transfer || transfer.status === "error") return {
						status: "error",
						reason: transfer?.reason ?? "fetch-failed"
					};
					const admittedTransfer = _usingCtx$1.a(transfer);
					const sourceChanged = await checkSourceUnchanged();
					if (sourceChanged) return sourceChanged;
					await prepareMutation(candidateSha, inspectionRoot, runInspectionCommand);
					candidateTransfer = transfer;
					if (!await admittedTransfer.importInto(workStep("git-import-admitted-target", [], gitRoot))) return {
						status: "error",
						reason: "fetch-failed"
					};
					return { status: "ok" };
				} catch (_) {
					_usingCtx$1.e = _;
				} finally {
					await _usingCtx$1.d();
				}
			};
			const fetched = await fetchGitUpdateTarget({
				root: inspectionRoot,
				step: inspectionStep,
				workStep: inspectionWorkStep,
				name: "git-target-inspection-fetch",
				channel,
				devTarget,
				steps
			});
			if (!fetched.ok) return {
				status: "error",
				reason: "fetch-failed"
			};
			const inspectTarget = async (revision, root = inspectionRoot) => {
				await prepareGitMutation({
					runCommand: runInspectionCommand,
					root,
					revision,
					timeoutMs,
					beforeGitMutation: opts.inspectGitTarget
				});
			};
			const selected = await selectGitInspectionTarget({
				gitRoot: inspectionRoot,
				artifactRoot: opts.publishGitCheckout ? inspectionRoot : gitRoot,
				runCommand: runInspectionCommand,
				step: inspectionStep,
				workStep: inspectionWorkStep,
				workTimeoutMs: opts.timeoutMs,
				channel,
				devTarget,
				refreshedRemotes: fetched.refreshedRemotes,
				beforeSha,
				beforeGitStaging: opts.beforeGitStaging,
				needsCheckoutMain,
				timeoutMs,
				defaultCommandEnv,
				steps,
				beforeCandidate: inspectTarget,
				validateCandidate: opts.validateCandidate,
				prepareGitExposure: opts.prepareGitExposure,
				prepareCandidate: async (root, cleanupRoot) => {
					const candidate = await runInspectionCommand([
						"git",
						"-C",
						root,
						"rev-parse",
						"HEAD"
					], {
						cwd: root,
						timeoutMs
					});
					if (candidate.code !== 0 || !candidate.stdout.trim()) throw new Error("Cannot inspect the validated Git update");
					await inspectTarget(candidate.stdout.trim(), root);
					if (opts.publishGitCheckout) {
						if ((await importCandidate(candidate.stdout.trim())).status !== "ok") throw new Error("Cannot import the admitted Git update");
						gitRoot = await opts.publishGitCheckout();
						publishedCandidate = true;
					}
					runtimePromotion = await prepareGitRuntimePromotion(gitRoot, root, runInspectionCommand, timeoutMs, cleanupRoot);
				}
			});
			if (selected.status !== "ok") return selected;
			if (!publishedCandidate) {
				const upstreamRef = selected.selectedDevUpstream ? `refs/remotes/${selected.selectedDevUpstream}` : void 0;
				const imported = await importCandidate(selected.candidateSha, upstreamRef);
				if (imported.status !== "ok") return imported;
			}
			return selected;
		};
		const preflight = await withGitTargetInspectionRoot({
			root: gitRoot,
			runCommand,
			timeoutMs,
			work: { timeoutMs: opts.timeoutMs },
			onWarning: (warning) => {
				steps.push(warning);
				opts.progress?.onStepComplete?.({
					...warning,
					index: 0,
					total: 0
				});
			}
		}, inspectAndPrepare);
		if (preflight.status !== "ok") return mutationPrepared ? await rollbackError(preflight.reason) : buildError(preflight.reason, preflight.status);
		const sourceChanged = await checkSourceUnchanged();
		if (sourceChanged) return buildError(sourceChanged.reason, sourceChanged.status);
		await prepareMutation(preflight.candidateSha);
		const activateBranch = channel === "dev" && !hasDevTarget;
		sourceMutationStarted = true;
		const failure = await runRequiredStep("git-checkout", activateBranch ? [
			"git",
			"-C",
			gitRoot,
			"checkout",
			"-B",
			DEV_BRANCH,
			preflight.candidateSha
		] : [
			"git",
			"-C",
			gitRoot,
			"checkout",
			"--detach",
			preflight.candidateSha
		], "checkout-failed");
		if (failure) return failure;
		createdDevBranchDuringUpdate = activateBranch && preflight.localDevBranchExists === false;
		if (createdDevBranchDuringUpdate && preflight.selectedDevUpstream) {
			const upstreamStep = await runGitUpstreamStep(workStep("git-set-upstream", [
				"git",
				"-C",
				gitRoot,
				"branch",
				"--set-upstream-to",
				preflight.selectedDevUpstream,
				DEV_BRANCH
			], gitRoot));
			if (isFailedUpdateStep(upstreamStep)) return await rollbackError("checkout-failed");
		}
		if (!runtimePromotion) return await rollbackError("runtime-verification-failed");
		try {
			await runtimePromotion.activate();
		} catch (error) {
			steps.push({
				name: "git-runtime-activation",
				command: "activate validated runtime",
				cwd: gitRoot,
				durationMs: 0,
				exitCode: 1,
				stderrTail: String(error)
			});
			return await rollbackError("runtime-verification-failed");
		}
		if (!opts.prepareGitExposure) {
			stateMigrationStarted = true;
			recovery = {
				serviceRestartSafe: false,
				reason: "state-migration-started"
			};
			const doctorSteps = [];
			let doctorStep;
			try {
				doctorStep = await opts.runGitDoctor(gitRoot, doctorSteps);
			} catch (error) {
				steps.push(...doctorSteps);
				throw error;
			}
			steps.push(doctorStep ?? {
				name: "openclaw doctor",
				command: "run activation doctor",
				cwd: gitRoot,
				durationMs: 0,
				exitCode: 1,
				stderrTail: "Required activation Doctor did not produce a result."
			});
			if (!doctorStep) {
				stateMigrationStarted = false;
				return await rollbackError("doctor-entry-missing");
			}
			if (isFailedUpdateStep(doctorStep)) return await rollbackError(getUpdateDoctorConfigFailureReason(doctorStep.configWriteRefusal) ?? "doctor-failed");
		}
		if ((await resolveControlUiAssetHealth({ root: gitRoot })).kind !== "ready") {
			steps.push({
				name: "ui-assets-verify",
				command: "verify startup assets",
				cwd: gitRoot,
				durationMs: 0,
				exitCode: 1,
				stderrTail: "Control UI startup assets are missing or incomplete after Doctor"
			});
			return await rollbackError("ui-assets-missing");
		}
		const afterBuildId = await readBuiltGatewayBuildId(gitRoot);
		const afterShaStep = await runStep(step("git-verify-head", [
			"git",
			"-C",
			gitRoot,
			"rev-parse",
			"HEAD"
		], gitRoot));
		if (isFailedUpdateStep(afterShaStep)) return await rollbackError("head-verification-failed");
		if (afterShaStep.stdoutTail?.trim() !== preflight.candidateSha) return await rollbackError("target-sha-mismatch");
		return {
			status: "ok",
			mode: "git",
			root: gitRoot,
			before,
			after: {
				sha: afterShaStep.stdoutTail?.trim() ?? null,
				version: await readPackageVersion(gitRoot),
				...afterBuildId ? { buildId: afterBuildId } : {},
				...devTarget?.mode === "tracked" ? { upstreamRef: devTarget.upstreamRef } : {}
			},
			steps,
			durationMs: Date.now() - startedAt
		};
	} catch (error) {
		cleanupUncertain = hasCommandProcessCleanupError(error);
		if (!mutationPrepared || cleanupUncertain) throw error;
		const fact = createUpdateErrorFact("git update", error, defaultCommandEnv);
		steps.push({
			name: "git-update",
			command: "update checkout",
			cwd: gitRoot,
			durationMs: 0,
			exitCode: 1,
			stderrTail: fact.message,
			failureFacts: [fact]
		});
		return await rollbackError(error instanceof UpdateRequesterRevokedError ? error.code : "unexpected-error").catch((rollbackFailure) => {
			cleanupUncertain = hasCommandProcessCleanupError(rollbackFailure);
			throw rollbackFailure;
		});
	} finally {
		if (!cleanupUncertain) {
			await candidateTransfer?.cleanup(step("git-update-pack-cleanup", [], gitRoot));
			await runtimePromotion?.cleanup();
		}
	}
}
//#endregion
//#region src/cli/update-cli/update-command-git.ts
const DEFAULT_UPDATE_STEP_TIMEOUT_MS = 18e5;
async function retireStandaloneGitWrapper(params) {
	const platform = params.platform ?? process.platform;
	const wrapperName = platform === "win32" ? "openclaw.cmd" : "openclaw";
	const searchDirs = params.searchDirs ?? (process.env.PATH ?? "").split(path.delimiter);
	const expectedEntry = platform === "win32" ? path.win32.join(params.previousRoot, "dist", "entry.js") : path.join(params.previousRoot, "dist", "entry.js");
	const seen = /* @__PURE__ */ new Set();
	for (const directory of searchDirs) {
		if (!directory) continue;
		const wrapperPath = path.resolve(directory, wrapperName);
		if (seen.has(wrapperPath)) continue;
		seen.add(wrapperPath);
		let stat;
		try {
			stat = await fs.lstat(wrapperPath);
		} catch (error) {
			if (hasNodeErrorCode(error, "ENOENT")) continue;
			return { error: `Could not inspect ${wrapperPath}: ${String(error)}` };
		}
		if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 4096 || platform !== "win32" && (stat.mode & 73) === 0) continue;
		let contents;
		try {
			contents = await fs.readFile(wrapperPath, "utf8");
		} catch (error) {
			return { error: `Could not inspect ${wrapperPath}: ${String(error)}` };
		}
		const lines = contents.trimEnd().split(/\r?\n/u);
		const matchesWindows = platform === "win32" && lines.length === 2 && lines[0] === "@echo off" && lines[1] === `node "${expectedEntry}" %*`;
		const execArgs = platform === "win32" || lines.length !== 3 ? null : splitShellArgs(lines[2] ?? "");
		const matchesPosix = platform !== "win32" && lines[0] === "#!/usr/bin/env bash" && lines[1] === "set -euo pipefail" && execArgs?.length === 4 && execArgs[0] === "exec" && execArgs[2] === expectedEntry && execArgs[3] === "$@";
		if (!matchesWindows && !matchesPosix) continue;
		try {
			if (process.platform === "freebsd") await createFreeBsdPkgOwnershipInspection(UPDATE_RUNNER_TIMEOUT_MS).assertEntryUnowned(wrapperPath);
			const currentFile = await readRegularFile({
				filePath: wrapperPath,
				maxBytes: 4096
			});
			const current = await fs.lstat(wrapperPath);
			if (!current.isFile() || !sameFileIdentity(stat, currentFile.stat) || !sameFileIdentity(currentFile.stat, current) || currentFile.buffer.toString("utf8") !== contents) throw new Error("The installer wrapper changed before retirement.");
			params.assertCurrent?.();
			await fs.unlink(wrapperPath);
		} catch (error) {
			return { error: `Could not retire ${wrapperPath}: ${String(error)}` };
		}
	}
	return {};
}
async function runReadOnlyGitCommand(params) {
	return params.runCommand([
		"git",
		"-C",
		params.root,
		...params.args
	], {
		cwd: params.root,
		timeoutMs: params.timeoutMs
	}).catch(() => null);
}
async function listGitRemotes(params) {
	const result = await runReadOnlyGitCommand({
		...params,
		args: ["remote"]
	});
	if (result?.code !== 0) return { metadataUnreadable: "could not inspect configured Git remotes" };
	return { remotes: result.stdout.split("\n").map((value) => value.trim()).filter(Boolean) };
}
async function resolveCurrentRemoteBranchRevision(params) {
	const tracking = await runReadOnlyGitCommand({
		...params,
		args: [
			"rev-parse",
			"--abbrev-ref",
			"--symbolic-full-name",
			params.candidate
		]
	});
	const trackingRef = tracking?.code === 0 ? tracking.stdout.trim() : "";
	if (!trackingRef) return { status: "missing" };
	const remoteList = await listGitRemotes(params);
	if (remoteList.metadataUnreadable) return {
		status: "unreadable",
		reason: remoteList.metadataUnreadable
	};
	const remote = (remoteList.remotes ?? []).toSorted((left, right) => right.length - left.length).find((value) => trackingRef.startsWith(`${value}/`));
	if (!remote) return {
		status: "unreadable",
		reason: `could not resolve remote ownership for ${params.candidate}`
	};
	const branch = trackingRef.slice(remote.length + 1);
	const remoteRef = `refs/heads/${branch}`;
	const remoteResult = await runReadOnlyGitCommand({
		...params,
		args: [
			"ls-remote",
			"--exit-code",
			remote,
			remoteRef
		]
	});
	const remoteRevision = remoteResult?.code === 0 ? readExactRemoteRevision(remoteResult.stdout, remoteRef) : null;
	if (!remoteRevision) return {
		status: "unreadable",
		reason: `could not inspect current remote target ${remote}/${branch}`
	};
	const local = await runReadOnlyGitCommand({
		...params,
		args: ["rev-parse", params.candidate]
	});
	return (local?.code === 0 ? local.stdout.trim() : "") === remoteRevision ? {
		status: "ok",
		revision: remoteRevision
	} : {
		status: "unreadable",
		reason: `current remote target ${remote}/${branch} is not available in the local checkout`
	};
}
function readExactRemoteRevision(stdout, ref) {
	const matches = stdout.split("\n").map((line) => line.trim().split(/\s+/u)).filter((parts) => parts.length === 2 && parts[1] === ref).map((parts) => parts[0] ?? "").filter((sha) => /^[0-9a-f]{40,64}$/iu.test(sha));
	return matches.length === 1 ? matches[0] ?? null : null;
}
function readRemoteTagRevisions(stdout) {
	const direct = /* @__PURE__ */ new Map();
	const peeled = /* @__PURE__ */ new Map();
	for (const line of stdout.split("\n")) {
		const [sha = "", ref = "", extra] = line.trim().split(/\s+/u);
		if (extra || !/^[0-9a-f]{40,64}$/iu.test(sha)) {
			if (line.trim()) return null;
			continue;
		}
		const match = /^refs\/tags\/(v.+?)(\^\{\})?$/u.exec(ref);
		if (!match) {
			if (line.trim()) return null;
			continue;
		}
		const tag = match[1];
		if (!tag) return null;
		(match[2] ? peeled : direct).set(tag, sha);
	}
	return new Map([.../* @__PURE__ */ new Set([...direct.keys(), ...peeled.keys()])].map((tag) => [tag, peeled.get(tag) ?? direct.get(tag)]));
}
async function resolveCurrentRemoteTagRevision(params) {
	const remoteList = await listGitRemotes(params);
	if (remoteList.metadataUnreadable) return { metadataUnreadable: remoteList.metadataUnreadable };
	const remotes = remoteList.remotes ?? [];
	if (remotes.length === 0) return { metadataUnreadable: "could not resolve a remote for the selected Git release" };
	const tagRevisions = /* @__PURE__ */ new Map();
	for (const remote of remotes) {
		const result = await runReadOnlyGitCommand({
			...params,
			args: [
				"ls-remote",
				"--tags",
				remote,
				"refs/tags/v*"
			]
		});
		const remoteTags = result?.code === 0 ? readRemoteTagRevisions(result.stdout) : null;
		if (!remoteTags) return { metadataUnreadable: `could not inspect current release tags from ${remote}` };
		for (const [tag, revision] of remoteTags) {
			const existing = tagRevisions.get(tag);
			if (existing && existing !== revision) return { metadataUnreadable: `release tag ${tag} resolves differently across remotes` };
			tagRevisions.set(tag, revision);
		}
	}
	const tag = selectChannelTag([...tagRevisions.keys()], params.channel);
	return tag ? { revision: tagRevisions.get(tag) } : { metadataUnreadable: "could not resolve the selected Git release tag" };
}
async function inspectGitDryRunTargetSchemaVersions(params) {
	const runCommand = (argv, options) => runCommandWithTimeout(argv, {
		...options,
		env: {
			...options.env,
			GIT_OPTIONAL_LOCKS: "0",
			GIT_NO_LAZY_FETCH: "1"
		}
	});
	const runTargetCommand = (argv, options) => runCommand(argv, {
		...options,
		timeoutMs: options.timeoutMs ?? params.timeoutMs
	});
	let revision = null;
	if (params.channel === "extended-stable") return { metadataUnreadable: "extended-stable is unavailable for Git updates" };
	if (params.channel !== "dev") {
		const resolved = await resolveCurrentRemoteTagRevision({
			runCommand,
			root: params.root,
			timeoutMs: params.timeoutMs,
			channel: params.channel
		});
		if (resolved.metadataUnreadable) return { metadataUnreadable: resolved.metadataUnreadable };
		revision = resolved.revision ?? null;
	} else if (params.devTarget) {
		const selected = resolveDevUpdateTargetRevision(params.devTarget);
		if (!/^[0-9a-f]{40,64}$/iu.test(selected)) return { metadataUnreadable: "the explicit symbolic Git target requires a fetch to verify" };
		revision = selected;
	} else {
		const needsCheckoutMain = await readBranchName(runTargetCommand, params.root, params.timeoutMs) !== DEV_BRANCH;
		let remoteBranchRefs = [];
		if (needsCheckoutMain) {
			const remoteResult = await runCommand([
				"git",
				"-C",
				params.root,
				"remote"
			], {
				cwd: params.root,
				timeoutMs: params.timeoutMs
			}).catch(() => null);
			if (remoteResult?.code === 0) remoteBranchRefs = remoteResult.stdout.split("\n").map((remote) => remote.trim()).filter(Boolean).map((remote) => `refs/remotes/${remote}/${DEV_BRANCH}`);
		}
		for (const candidate of resolveDevUpstreamRefs(needsCheckoutMain, remoteBranchRefs)) {
			const resolved = await resolveCurrentRemoteBranchRevision({
				runCommand,
				root: params.root,
				timeoutMs: params.timeoutMs,
				candidate
			});
			if (resolved.status === "ok") {
				revision = resolved.revision;
				break;
			}
			if (resolved.status === "unreadable") return { metadataUnreadable: resolved.reason };
		}
	}
	if (!revision) return { metadataUnreadable: "could not resolve the selected Git target" };
	const target = await readGitTargetSchemaVersions({
		runCommand: runTargetCommand,
		root: params.root,
		revision,
		timeoutMs: params.timeoutMs
	});
	return target.status === "ok" ? target.schemaVersions ? { schemaVersions: target.schemaVersions } : {} : { metadataUnreadable: target.reason };
}
async function updateGitInstall(params) {
	let updateRoot = params.switchToGit ? resolveGitInstallDir() : params.root;
	const effectiveTimeout = params.timeoutMs ?? DEFAULT_UPDATE_STEP_TIMEOUT_MS;
	const pkgOwnership = createFreeBsdPkgOwnershipInspection(effectiveTimeout);
	await pkgOwnership.assertUnowned(updateRoot);
	const installEnv = await createGlobalInstallEnv();
	const installTarget = params.switchToGit ? await resolveGlobalInstallTarget({
		manager: await resolveGlobalManager({
			root: params.root,
			installKind: params.installKind,
			timeoutMs: effectiveTimeout,
			pkgOwnership
		}),
		runCommand: runCommandWithTimeout,
		timeoutMs: effectiveTimeout,
		pkgRoot: params.root,
		pkgOwnership
	}) : null;
	const npmLifecycleGate = installTarget ? resolveNpmLifecyclePolicyGate(installTarget) : {
		policy: null,
		error: null
	};
	if (npmLifecycleGate.error) {
		defaultRuntime.error(npmLifecycleGate.error);
		return {
			status: "error",
			mode: "git",
			root: params.root,
			reason: "npm lifecycle policy preflight",
			recovery: await (params.installKind === "git" ? readCurrentGitUpdateRecovery(params.root, effectiveTimeout) : verifyPackageUpdateRecovery(params.root)),
			steps: [],
			durationMs: Date.now() - params.startedAt
		};
	}
	const checkSnapshot = async () => {
		params.progress.onStepStart?.({
			name: "snapshot-space-preflight",
			command: "snapshot-space-preflight",
			index: 0,
			total: 0
		});
		const { config, env } = await params.getSnapshotSource();
		const snapshot = await assessInitialUpdateSnapshotCapacity({
			config,
			stateDir: resolveStateDir(env),
			env
		});
		params.progress.onStepComplete?.({
			...snapshot,
			index: 0,
			total: 0
		});
		if (snapshot.exitCode !== 0) defaultRuntime.error(snapshot.stderrTail ?? "snapshot-capacity-insufficient");
		else for (const warning of snapshot.warnings ?? []) if (params.jsonMode) defaultRuntime.error(`Warning: ${warning}`);
		else defaultRuntime.log(theme.warn(warning));
		return snapshot;
	};
	const snapshotBeforeClone = params.switchToGit ? await checkSnapshot() : void 0;
	if (snapshotBeforeClone && snapshotBeforeClone.exitCode !== 0) return {
		status: "error",
		mode: "git",
		root: params.root,
		reason: "snapshot-capacity-insufficient",
		steps: [snapshotBeforeClone],
		recovery: await verifyPackageUpdateRecovery(params.root),
		durationMs: Date.now() - params.startedAt
	};
	const previousPackage = installTarget ? await readPackageUpdateIdentity(installTarget.packageRoot ?? params.root) : void 0;
	let exposure;
	const runUpdate = async (gitRoot, publishGitCheckout) => updateGitCheckout({
		...await buildUpdateCommandRunner(),
		gitRoot,
		timeoutMs: params.timeoutMs ?? 12e5,
		startedAt: params.startedAt,
		opts: {
			timeoutMs: params.timeoutMs,
			progress: params.progress,
			channel: params.channel,
			devTarget: params.devTarget,
			beforeGitMutation: process.platform === "freebsd" ? async (target) => {
				await params.beforeGitMutation(target);
				await createFreeBsdPkgOwnershipInspection(effectiveTimeout).assertUnowned(updateRoot);
				params.assertCurrent?.();
			} : params.beforeGitMutation,
			inspectGitTarget: params.inspectGitTarget,
			beforeGitStaging: params.switchToGit ? void 0 : async () => ({
				step: await checkSnapshot(),
				failureReason: "snapshot-capacity-insufficient"
			}),
			publishGitCheckout,
			validateCandidate: params.validateCandidate,
			...installTarget ? { prepareGitExposure: async (candidateRoot, candidateSha, candidateEnv) => {
				const packageName = await readPackageName(installTarget.packageRoot ?? params.root) ?? "openclaw";
				exposure = await prepareGitPackageExposure({
					installTarget,
					installSpec: candidateRoot,
					packageName,
					packageRoot: installTarget.packageRoot,
					runCommand: runCommandWithTimeout,
					runStep: (stepParams) => runUpdateStep({
						...stepParams,
						progress: params.progress
					}),
					timeoutMs: effectiveTimeout,
					env: mergeProcessEnv([installEnv, candidateEnv]),
					installCwd: candidateRoot,
					expectedGitCheckout: {
						root: candidateRoot,
						sha: candidateSha
					},
					activateGitRoot: updateRoot,
					onTransaction: params.onTransaction,
					assertCurrent: params.assertCurrent,
					postVerifyStep: (root, results) => runPackageUpdateDoctor({
						...params,
						results,
						managedServiceEnv: params.getManagedServiceEnv(),
						root,
						timeoutMs: effectiveTimeout
					})
				});
			} } : { runGitDoctor: (root, results) => runPackageUpdateDoctor({
				...params,
				results,
				managedServiceEnv: params.getManagedServiceEnv(),
				root,
				timeoutMs: effectiveTimeout
			}) }
		}
	});
	let stagedUpdateResult;
	try {
		const checkout = params.switchToGit ? await ensureGitCheckout({
			dir: updateRoot,
			env: installEnv,
			timeoutMs: effectiveTimeout,
			progress: params.progress,
			useStagedCheckout: async (stagingRoot, publish, targetRoot) => {
				updateRoot = targetRoot;
				await createFreeBsdPkgOwnershipInspection(effectiveTimeout).assertUnowned(updateRoot);
				stagedUpdateResult = await runUpdate(stagingRoot, publish);
				if (stagedUpdateResult.root === stagingRoot) stagedUpdateResult = {
					...stagedUpdateResult,
					root: params.root,
					recovery: await verifyPackageUpdateRecovery(params.root)
				};
			}
		}) : null;
		const cloneStep = checkout?.step ?? null;
		updateRoot = checkout?.checkoutDir ?? updateRoot;
		if (cloneStep && cloneStep.exitCode !== 0) return {
			status: "error",
			mode: "git",
			root: params.root,
			reason: cloneStep.name,
			recovery: await (params.installKind === "git" ? readCurrentGitUpdateRecovery(params.root, effectiveTimeout) : verifyPackageUpdateRecovery(params.root)),
			steps: [...snapshotBeforeClone ? [snapshotBeforeClone] : [], cloneStep],
			durationMs: Date.now() - params.startedAt
		};
		const updateResult = stagedUpdateResult ?? await runUpdate(updateRoot);
		const before = previousPackage ?? updateResult.before;
		const steps = [
			...snapshotBeforeClone ? [snapshotBeforeClone] : [],
			...cloneStep ? [cloneStep] : [],
			...updateResult.steps
		];
		if (exposure && updateResult.status === "ok") {
			const packageUpdate = await exposure.activate();
			return {
				...updateResult,
				before,
				status: packageUpdate.failedStep ? "error" : "ok",
				reason: packageUpdate.reason ?? (packageUpdate.failedStep?.configWriteRefusal ? packageUpdate.failedStep.configWriteRefusal.reason === "requester-revoked" ? "requester-revoked" : "repair-requires-config-change" : packageUpdate.failedStep ? normalizeFallbackFailureReason(packageUpdate.failedStep.name) : void 0),
				recovery: packageUpdate.recovery,
				failedStep: packageUpdate.failedStep ?? void 0,
				steps: [...steps, ...packageUpdate.steps],
				durationMs: Date.now() - params.startedAt
			};
		}
		if (exposure) {
			const cancelled = await exposure.cancel();
			exposure = void 0;
			const packageRoot = installTarget?.packageRoot ?? params.root;
			const [packageOwner, gitOwner, serviceUsesPackage] = await Promise.all([
				fs.realpath(packageRoot).catch(() => null),
				fs.realpath(updateRoot).catch(() => null),
				gatewayServiceCommandUsesRoot({
					root: packageRoot,
					env: params.getManagedServiceEnv()
				})
			]);
			if (packageOwner && gitOwner && packageOwner !== gitOwner && serviceUsesPackage === true) updateResult.recovery = cancelled.recovery;
			steps.push(...cancelled.steps);
		}
		return {
			...updateResult,
			before,
			steps,
			durationMs: Date.now() - params.startedAt
		};
	} finally {
		await exposure?.cancel();
	}
}
//#endregion
export { cleanupUpdateTemporaryDirectory as i, retireStandaloneGitWrapper as n, updateGitInstall as r, inspectGitDryRunTargetSchemaVersions as t };
