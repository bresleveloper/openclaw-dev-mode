import { t as isBunRuntime } from "./runtime-binary-BAwmhhZ0.mjs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { readRootJsonObjectSync } from "@openclaw/fs-safe/json";
//#region src/infra/runtime-worker-url.ts
/** Resolve an explicit installed root, source sibling, or stable packaged worker path. */
function resolveRuntimeWorkerUrl(params) {
	if (params.root !== void 0) return pathToFileURL(path.join(params.root, "dist", params.distWorkerPath));
	const currentPath = fileURLToPath(params.currentModuleUrl);
	const distIndex = currentPath.replaceAll(path.sep, "/").lastIndexOf("/dist/");
	if (distIndex >= 0) {
		const distRoot = currentPath.slice(0, distIndex + 6);
		let workerPath = params.distWorkerPath;
		if (params.package) {
			const packageRoot = path.resolve(distRoot, "..");
			const manifest = readRootJsonObjectSync({
				rootDir: packageRoot,
				relativePath: "package.json",
				boundaryLabel: "runtime worker package",
				rejectHardlinks: false
			});
			if (!manifest.ok) throw new Error(`Cannot resolve runtime worker package: ${packageRoot}/package.json`);
			if (manifest.value.name === params.package.name) workerPath = params.package.distWorkerPath;
		}
		return pathToFileURL(path.join(distRoot, workerPath));
	}
	const extension = path.extname(currentPath) || ".js";
	return new URL(`./${params.sourceWorkerName}${extension}`, params.currentModuleUrl);
}
function isBunTargetRuntime(execPath) {
	return execPath === process.execPath ? Boolean(process.versions.bun) : isBunRuntime(execPath);
}
/** Disable implicit package installation in OpenClaw-owned Bun processes. */
function resolveRuntimeArgs(execPath = process.execPath) {
	return isBunTargetRuntime(execPath) ? ["--no-install"] : [];
}
/** Whether a source TypeScript module needs Node's tsx loader; Bun runs TypeScript natively. */
function runtimeNeedsTypeScriptLoader(modulePath, execPath = process.execPath) {
	return /\.[cm]?ts$/.test(modulePath) && !isBunTargetRuntime(execPath);
}
function resolveRuntimeWorkerArgv(url, execPath = process.execPath) {
	const entry = fileURLToPath(url);
	return runtimeNeedsTypeScriptLoader(entry, execPath) ? [
		"--import",
		import.meta.resolve("tsx"),
		entry
	] : [...resolveRuntimeArgs(execPath), entry];
}
/** Select the source Worker preload without feeding Node's TypeScript loader to Bun. */
function resolveRuntimeWorkerThreadExecArgv(url, execPath = process.execPath) {
	return url.protocol === "file:" && runtimeNeedsTypeScriptLoader(fileURLToPath(url), execPath) ? ["--import", import.meta.resolve("tsx/esm")] : [];
}
//#endregion
export { runtimeNeedsTypeScriptLoader as a, resolveRuntimeWorkerUrl as i, resolveRuntimeWorkerArgv as n, resolveRuntimeWorkerThreadExecArgv as r, resolveRuntimeArgs as t };
