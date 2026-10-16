import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-CBoxhfke.mjs";
import { a as resolveBunRuntimeInfo, c as resolvePreferredBunPath, d as resolveSystemNodeInfo, i as renderSystemNodeWarning, l as resolvePreferredNodePath, s as resolvePinnedDaemonRuntimePath } from "./runtime-paths-D7k3lrcM.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/commands/daemon-install-plan.shared.ts
function resolveGatewayDevMode(argv = process.argv) {
	const normalizedEntry = argv[1]?.replaceAll("\\", "/");
	return normalizedEntry !== void 0 && normalizedEntry.includes("/src/") && normalizedEntry.endsWith(".ts");
}
/** Use the running Bun only when implicit Node discovery found no supported runtime. */
async function resolveRunningBunFallback(params) {
	if (!process.versions.bun) return;
	if ((params.nodePath === void 0 ? await resolvePreferredNodePath({
		env: params.env,
		runtime: "node"
	}) : params.nodePath) || (await resolveBunRuntimeInfo(process.execPath, void 0, params.env)).status !== "supported") return;
	return process.execPath;
}
async function resolveDaemonInstallRuntimeInputs(params) {
	const devMode = params.devMode ?? resolveGatewayDevMode();
	if (params.wrapperPath?.trim()) return {
		devMode,
		runtime: params.runtime,
		runtimePath: params.runtimePath
	};
	const runtimePath = (params.pinnedRuntimePath === void 0 ? void 0 : await resolvePinnedDaemonRuntimePath(params.pinnedRuntimePath, params.runtime, params.env)) ?? params.runtimePath ?? (params.runtime === "bun" ? await resolvePreferredBunPath({
		env: params.env,
		runtime: params.runtime
	}) : await resolvePreferredNodePath({
		env: params.env,
		runtime: params.runtime
	}));
	if (params.runtime === "node" && !params.runtimeExplicit && params.pinnedRuntimePath === void 0 && params.runtimePath === void 0 && runtimePath === void 0) {
		const bunPath = await resolveRunningBunFallback({
			env: params.env,
			nodePath: null
		});
		if (bunPath) {
			params.warn?.("No supported Node runtime was found; using the running Bun for the service.");
			return {
				devMode,
				runtime: "bun",
				runtimePath: bunPath
			};
		}
	}
	return {
		devMode,
		runtime: params.runtime,
		runtimePath
	};
}
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
function safeRealpathSync(inputPath) {
	try {
		return fs.realpathSync.native(inputPath);
	} catch {
		return;
	}
}
function addUniquePathDir(dirs, dir) {
	if (!dir || !path.isAbsolute(dir) || dirs.includes(dir)) return;
	dirs.push(dir);
}
/** Merge runtime and active OpenClaw binary directories for the daemon service PATH. */
function resolveDaemonServicePathDirs(params) {
	const platform = params.platform ?? process.platform;
	const argv = params.argv ?? process.argv;
	const env = params.env ?? process.env;
	const argv1 = argv[1]?.trim();
	const dirs = resolveDaemonRuntimeBinDir(params.runtimePath) ?? [];
	if (argv1 && path.isAbsolute(argv1) && isOpenClawCommandBasename(path.basename(argv1), platform)) addUniquePathDir(dirs, path.dirname(argv1));
	const argvRealpath = argv1 && path.isAbsolute(argv1) ? safeRealpathSync(argv1) : void 0;
	for (const rawSegment of (env.PATH ?? "").split(path.delimiter)) {
		const segment = rawSegment.trim();
		if (!path.isAbsolute(segment)) continue;
		const candidate = path.join(segment, platform === "win32" ? "openclaw.cmd" : "openclaw");
		if (!fs.existsSync(candidate)) continue;
		const candidateRealpath = safeRealpathSync(candidate);
		if (argvRealpath && candidateRealpath && candidateRealpath !== argvRealpath) {
			const activeRoot = resolveOpenClawPackageRootSync({ argv1: argvRealpath });
			if (!activeRoot || resolveOpenClawPackageRootSync({ argv1: candidateRealpath }) !== activeRoot) continue;
		}
		addUniquePathDir(dirs, segment);
	}
	return dirs.length > 0 ? dirs : void 0;
}
//#endregion
//#region src/commands/daemon-install-runtime-warning.ts
/** Warn when daemon install will use a system Node path that may be unsuitable. */
async function emitNodeRuntimeWarning(params) {
	if (params.runtime !== "node") return;
	const systemNode = await resolveSystemNodeInfo({ env: params.env });
	const warning = renderSystemNodeWarning(systemNode, params.nodeProgram);
	if (warning) params.warn?.(warning, params.title);
}
//#endregion
export { resolveRunningBunFallback as a, resolveDaemonServicePathDirs as i, resolveDaemonInstallRuntimeInputs as n, resolveDaemonRuntimeBinDir as r, emitNodeRuntimeWarning as t };
