import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-Cur9Uhkp.mjs";
import { c as resolvePreferredNodePath, l as resolveSystemNodeInfo, o as resolvePinnedDaemonRuntimePath, r as renderSystemNodeWarning, s as resolvePreferredBunPath } from "./runtime-paths-DifTYoyV.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/commands/daemon-install-runtime-warning.ts
/** Warn when daemon install will use a system Node path that may be unsuitable. */
async function emitNodeRuntimeWarning(params) {
	if (params.runtime !== "node") return;
	const systemNode = await resolveSystemNodeInfo({ env: params.env });
	const warning = renderSystemNodeWarning(systemNode, params.nodeProgram);
	if (warning) params.warn?.(warning, params.title);
}
//#endregion
//#region src/commands/daemon-install-plan.shared.ts
/** Detect source-checkout dev mode from the current CLI entrypoint. */
function resolveGatewayDevMode(argv = process.argv) {
	const normalizedEntry = argv[1]?.replaceAll("\\", "/");
	return normalizedEntry !== void 0 && normalizedEntry.includes("/src/") && normalizedEntry.endsWith(".ts");
}
/** Resolve dev-mode and executable inputs for daemon service install planning. */
async function resolveDaemonInstallRuntimeInputs(params) {
	const devMode = params.devMode ?? resolveGatewayDevMode();
	if (params.wrapperPath?.trim()) return {
		devMode,
		runtimePath: params.runtimePath
	};
	return {
		devMode,
		runtimePath: (params.pinnedRuntimePath === void 0 ? void 0 : await resolvePinnedDaemonRuntimePath(params.pinnedRuntimePath, params.runtime, params.env)) ?? params.runtimePath ?? (params.runtime === "bun" ? await resolvePreferredBunPath({
			env: params.env,
			runtime: params.runtime
		}) : await resolvePreferredNodePath({
			env: params.env,
			runtime: params.runtime
		}))
	};
}
/** Emit runtime warnings for daemon install command arguments. */
async function emitDaemonInstallRuntimeWarning(params) {
	await emitNodeRuntimeWarning({
		env: params.env,
		runtime: params.runtime,
		nodeProgram: params.programArguments[0],
		warn: params.warn,
		title: params.title
	});
}
/** Return the runtime binary directory that should be added to daemon PATH. */
function resolveDaemonRuntimeBinDir(runtimePath) {
	const trimmed = runtimePath?.trim();
	if (!trimmed || !path.isAbsolute(trimmed)) return;
	return [path.dirname(trimmed)];
}
function isOpenClawCommandBasename(basename, platform) {
	if (basename === "openclaw") return true;
	if (platform === "win32") return basename === "openclaw.cmd" || basename === "openclaw.ps1" || basename === "openclaw.exe";
	return false;
}
function safeRealpathSync(inputPath, realpathSync) {
	if (!inputPath) return;
	try {
		return realpathSync(inputPath);
	} catch {
		return;
	}
}
function addUniquePathDir(dirs, dir) {
	if (!dir || !path.isAbsolute(dir) || dirs.includes(dir)) return;
	dirs.push(dir);
}
/** Resolve the OpenClaw CLI binary directory from argv/PATH for daemon PATH. */
function resolveDaemonOpenClawBinDir(params = {}) {
	const platform = params.platform ?? process.platform;
	const argv = params.argv ?? process.argv;
	const env = params.env ?? process.env;
	const existsSync = params.existsSync ?? fs.existsSync;
	const realpathSync = params.realpathSync ?? fs.realpathSync.native;
	const argv1 = argv[1]?.trim();
	const dirs = [];
	if (argv1 && path.isAbsolute(argv1) && isOpenClawCommandBasename(path.basename(argv1), platform)) addUniquePathDir(dirs, path.dirname(argv1));
	const argvRealpath = path.isAbsolute(argv1 ?? "") ? safeRealpathSync(argv1, realpathSync) : void 0;
	for (const rawSegment of (env.PATH ?? "").split(path.delimiter)) {
		const segment = rawSegment.trim();
		if (!path.isAbsolute(segment)) continue;
		const candidate = path.join(segment, platform === "win32" ? "openclaw.cmd" : "openclaw");
		if (!existsSync(candidate)) continue;
		const candidateRealpath = safeRealpathSync(candidate, realpathSync);
		if (argvRealpath && candidateRealpath && candidateRealpath !== argvRealpath) {
			const activeRoot = resolveOpenClawPackageRootSync({ argv1: argvRealpath });
			if (!activeRoot || resolveOpenClawPackageRootSync({ argv1: candidateRealpath }) !== activeRoot) continue;
		}
		addUniquePathDir(dirs, segment);
	}
	return dirs.length > 0 ? dirs : void 0;
}
/** Merge runtime and OpenClaw binary directories for the daemon service PATH. */
function resolveDaemonServicePathDirs(params) {
	const dirs = [];
	for (const dir of resolveDaemonRuntimeBinDir(params.runtimePath) ?? []) addUniquePathDir(dirs, dir);
	for (const dir of resolveDaemonOpenClawBinDir(params) ?? []) addUniquePathDir(dirs, dir);
	return dirs.length > 0 ? dirs : void 0;
}
//#endregion
export { resolveDaemonServicePathDirs as i, resolveDaemonInstallRuntimeInputs as n, resolveDaemonRuntimeBinDir as r, emitDaemonInstallRuntimeWarning as t };
