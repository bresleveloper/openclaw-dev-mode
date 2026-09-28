import { t as isBunRuntime } from "./runtime-binary-Cy5Lhult.mjs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
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
function resolveRuntimeWorkerArgv(url, execPath = process.execPath) {
	const entry = fileURLToPath(url);
	return /\.[cm]?ts$/.test(entry) && !isBunRuntime(execPath) ? [
		"--import",
		import.meta.resolve("tsx"),
		entry
	] : [entry];
}
/** Select the source Worker preload without feeding Node's TypeScript loader to Bun. */
function resolveRuntimeWorkerThreadExecArgv(url, execPath = process.execPath) {
	if (url.protocol !== "file:") return [];
	return /\.[cm]?ts$/.test(fileURLToPath(url)) && !isBunRuntime(execPath) ? ["--import", import.meta.resolve("tsx/esm")] : [];
}
//#endregion
export { resolveRuntimeWorkerThreadExecArgv as n, resolveRuntimeWorkerUrl as r, resolveRuntimeWorkerArgv as t };
