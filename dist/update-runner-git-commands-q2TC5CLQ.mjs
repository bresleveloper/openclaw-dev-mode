import { i as stripAnsi } from "./ansi-BeFJ0Uu7.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { a as runStep } from "./update-runner-command-rYXXMsH4.mjs";
import { r as isFailedUpdateStep } from "./update-run-step-BDxgGAu8.mjs";
import { a as resolvePnpmCandidateEnv } from "./update-package-manager-D5vpWEG2.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { parseDocument } from "yaml";
//#region src/infra/update-runner-git-commands.ts
const BUILD_MAX_OLD_SPACE_MB = 8192;
const DEV_PREFLIGHT_LINT_ENV = {
	OPENCLAW_LOCAL_CHECK: "1",
	OPENCLAW_LOCAL_CHECK_MODE: "throttled"
};
const DEV_PREFLIGHT_LINT_OPT_IN_ENV = "OPENCLAW_UPDATE_PREFLIGHT_LINT";
const PREFLIGHT_TEMP_PREFIX = process.platform === "win32" ? "ocu-pf-" : ".openclaw-update-preflight-";
const WINDOWS_PREFLIGHT_BASE_DIR = "ocu";
function resolveTagFetchRef(candidate) {
	const ref = candidate.endsWith("^{}") ? candidate.slice(0, -3) : candidate;
	return ref.startsWith("refs/tags/") ? ref : null;
}
function buildDevTargetRefResolutionCandidates(devTargetRef) {
	const trimmed = devTargetRef.trim();
	if (/^[0-9a-f]{40}$/i.test(trimmed) || trimmed.startsWith("refs/remotes/")) return [trimmed];
	if (trimmed.startsWith("refs/heads/")) return [`refs/remotes/origin/${trimmed.slice(11)}`];
	if (trimmed.startsWith("origin/")) return [`refs/remotes/${trimmed}`];
	if (trimmed.startsWith("refs/tags/")) return [`${trimmed}^{}`, trimmed];
	return [
		`refs/remotes/origin/${trimmed}`,
		`refs/tags/${trimmed}^{}`,
		`refs/tags/${trimmed}`
	];
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
function classifyPreflightFailure(step) {
	const output = stripAnsi(`${step.stdoutTail ?? ""}\n${step.stderrTail ?? ""}`);
	const nodeNoSpace = /^\s*(?:\[(?:ERR_PNPM_)?ENOSPC\][^\r\n]*|(?:Error:\s*)?)ENOSPC: no space left on device(?:,|$)/m.test(output);
	const gitNoSpace = /^(?:fatal|error): (?:cannot|could not|unable to) [^\r\n]+: No space left on device$/m.test(output);
	return nodeNoSpace || gitNoSpace ? "insufficient-space" : "failed";
}
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
	const hasExplicitPreferOffline = effectiveEnv.pnpm_config_prefer_offline !== void 0 || effectiveEnv.PNPM_CONFIG_PREFER_OFFLINE !== void 0 || await hasExplicitPnpmPreferOfflineConfig({
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
	if (!hasExplicitPreferOffline) {
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
export { prepareCandidateCommandEnv as a, resolveDevPreflightLintEnv as c, shouldRunDevPreflightLint as d, gitCleanCheckArgs as i, resolveTagFetchRef as l, classifyPreflightFailure as n, resetPreflightCandidateWorktree as o, createPreflightRoot as r, resolveBuildEnv as s, buildDevTargetRefResolutionCandidates as t, shouldInstallWithoutScriptsOnWindows as u };
