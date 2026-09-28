import { l as getPluginCacheRoot } from "./plugin-cache-A1nT2dqa.mjs";
import { r as isMissingPathError } from "./errno-CkbDOfLk.mjs";
import { d as readPluginCacheDirectory, l as pluginCacheRealpathSync, s as pluginCacheExistsSync } from "./package-manifest-C8sTeZKW.mjs";
import { h as resolvePreferredBundledRootArtifact, m as resolvePluginRuntimeExecutionArtifact } from "./bundled-dir-BGJkK8G5.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";
//#region src/plugins/root-artifact-path.ts
/** Resolves artifact paths in the caller's layout and filename preference order. */
function resolvePluginRootArtifactPath(rootDir, artifactPaths) {
	let checkedDirectory;
	let skipDirectory = false;
	for (const artifactPath of artifactPaths) {
		const candidate = path.join(rootDir, artifactPath);
		if (path.dirname(artifactPath) !== ".") {
			const directory = path.dirname(candidate);
			if (directory !== checkedDirectory) {
				try {
					skipDirectory = readPluginCacheDirectory(directory).length === 0;
				} catch (error) {
					skipDirectory = isMissingPathError(error);
				}
				checkedDirectory = directory;
			}
			if (skipDirectory) continue;
		}
		if (pluginCacheExistsSync(candidate)) return candidate;
	}
	return null;
}
//#endregion
//#region src/plugins/doctor-contract-artifact.ts
/** Resolves the Doctor artifact shared by loading, index hashing, and freshness. */
const CONTRACT_API_EXTENSIONS = [
	".js",
	".mjs",
	".cjs",
	".ts",
	".mts",
	".cts"
];
const CURRENT_MODULE_PATH = fileURLToPath(import.meta.url);
const RUNNING_FROM_BUILT_ARTIFACT = CURRENT_MODULE_PATH.includes(`${path.sep}dist${path.sep}`) || CURRENT_MODULE_PATH.includes(`${path.sep}dist-runtime${path.sep}`);
const ORDERED_EXTENSIONS = RUNNING_FROM_BUILT_ARTIFACT ? CONTRACT_API_EXTENSIONS : [...CONTRACT_API_EXTENSIONS.slice(3), ...CONTRACT_API_EXTENSIONS.slice(0, 3)];
const ARTIFACT_CANDIDATES = ["doctor-contract-api", "contract-api"].map((basename) => {
	const rootPaths = ORDERED_EXTENSIONS.map((extension) => `${basename}${extension}`);
	return {
		rootPaths,
		paths: rootPaths.flatMap((filename) => [filename, path.join("dist", filename)])
	};
});
function resolvePluginDoctorContractArtifact(params) {
	const artifacts = getPluginCacheRoot(params.rootDir).artifacts;
	const key = JSON.stringify([
		"doctor-contract",
		RUNNING_FROM_BUILT_ARTIFACT,
		params.origin,
		params.sourcePreferred === true,
		params.packageManifest?.build?.bundledDist
	]);
	const cached = artifacts.get(key);
	if (cached !== void 0) return cached;
	for (const { rootPaths, paths } of ARTIFACT_CANDIDATES) {
		const modulePath = resolvePluginRootArtifactPath(params.rootDir, paths);
		if (!modulePath) continue;
		let artifact = {
			modulePath,
			boundaryRoot: params.rootDir
		};
		if (RUNNING_FROM_BUILT_ARTIFACT && params.origin === "bundled" && !params.sourcePreferred) {
			const source = params.packageManifest?.build?.bundledDist === false ? resolvePluginRootArtifactPath(params.rootDir, rootPaths) : rootPaths.includes(path.relative(params.rootDir, modulePath)) ? modulePath : null;
			if (source) {
				const selected = resolvePluginRuntimeExecutionArtifact(resolvePreferredBundledRootArtifact({
					rootDir: params.rootDir,
					source,
					packageManifest: params.packageManifest
				}));
				artifact = {
					modulePath: selected.source,
					boundaryRoot: selected.rootDir
				};
			}
		}
		const resolved = {
			modulePath: pluginCacheRealpathSync(artifact.modulePath) ?? artifact.modulePath,
			boundaryRoot: pluginCacheRealpathSync(artifact.boundaryRoot) ?? artifact.boundaryRoot
		};
		artifacts.set(key, resolved);
		return resolved;
	}
	artifacts.set(key, null);
	return null;
}
//#endregion
export { resolvePluginRootArtifactPath as n, resolvePluginDoctorContractArtifact as t };
