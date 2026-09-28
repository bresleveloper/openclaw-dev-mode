import { O as walkDirectorySync } from "./fs-safe-BAPek8At.mjs";
import { r as isPathInside, t as hasNodeErrorCode } from "./path-guards-D5kuI0Tv.mjs";
import { t as createJiti } from "./jiti-factory-B7ZlEz2u.mjs";
import { r as visitPluginSourceReferences, t as capturePluginGenerationArtifact } from "./plugin-generation-artifact-VyjUi6ei.mjs";
import { createRequire, isBuiltin } from "node:module";
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { moduleResolve } from "import-meta-resolve";
//#region src/plugins/plugin-generation-source-inspection.ts
/** Acquire the same literal module inputs as execution, without evaluating plugin code. */
function inspectPluginSourceDependencies(entries) {
	const files = /* @__PURE__ */ new Set();
	const packageRoots = /* @__PURE__ */ new Set();
	const unresolved = [];
	const references = [];
	const checks = [];
	const seenEntries = /* @__PURE__ */ new Set();
	for (const entry of entries) {
		const source = fs.realpathSync(entry.entryFile);
		if (seenEntries.has(source)) continue;
		seenEntries.add(source);
		const root = fs.realpathSync(entry.rootDir);
		const artifact = capturePluginGenerationArtifact(root, source, (run) => run());
		try {
			const pending = [artifact.resolve(source)];
			const visited = /* @__PURE__ */ new Set();
			for (const captured of pending) {
				if (visited.has(captured)) continue;
				visited.add(captured);
				const original = artifact.sourceForCaptured(captured);
				if (!original || !/\.[cm]?[jt]sx?$/.test(original)) continue;
				artifact.prepareModule(captured);
				const resolver = createJiti(original, {
					fsCache: false,
					moduleCache: false,
					tryNative: false
				});
				visitPluginSourceReferences(original, fs.readFileSync(captured, "utf8"), resolver, (specifier, kind) => {
					if (kind === "asset" || isBuiltin(specifier)) return;
					const local = specifier.startsWith(".") || path.isAbsolute(specifier) || specifier.startsWith("file:");
					try {
						const conditions = ["node", kind];
						const result = artifact.captureModule(captured, specifier, conditions);
						const target = result && "target" in result ? result.target : result && "retryNative" in result ? kind === "require" ? pathToFileURL(createRequire(captured).resolve(specifier)) : moduleResolve(specifier, pathToFileURL(captured), new Set(conditions)) : void 0;
						if (target?.protocol === "file:") {
							const selected = artifact.captureResolvedModule(fileURLToPath(target));
							const originalTarget = selected && artifact.sourceForCaptured(selected);
							if (selected && originalTarget) {
								references.push({
									source: original,
									specifier,
									target: originalTarget
								});
								pending.push(selected);
							}
						} else if (local && !result) unresolved.push({
							source: original,
							specifier
						});
					} catch (error) {
						if ([
							"ENOENT",
							"MODULE_NOT_FOUND",
							"ERR_MODULE_NOT_FOUND",
							"ERR_PACKAGE_PATH_NOT_EXPORTED",
							"ERR_PACKAGE_IMPORT_NOT_DEFINED",
							"ERR_UNSUPPORTED_DIR_IMPORT"
						].some((code) => hasNodeErrorCode(error, code))) {
							unresolved.push({
								source: original,
								specifier
							});
							return;
						}
						throw error;
					}
				});
			}
			const scan = walkDirectorySync(artifact.boundaryRoot, { symlinks: "skip" });
			const [failure] = scan.failedDirs;
			if (failure) throw failure.error;
			for (const captured of scan.entries) {
				const original = artifact.sourceForCaptured(captured.path);
				if (!original) continue;
				if (captured.kind === "file") files.add(original);
				else if (captured.kind === "directory") packageRoots.add(original);
			}
			artifact.assertSourceCurrent();
			checks.push(artifact.assertSourceCurrent);
		} finally {
			artifact.dispose();
		}
	}
	return {
		files: [...files],
		packageRoots: [...packageRoots].filter((root) => ![...packageRoots].some((other) => other !== root && isPathInside(other, root))),
		unresolved,
		references,
		assertSourceCurrent: () => {
			for (const check of checks) check();
		}
	};
}
/** Inspect the same source graph the module owner will capture, without evaluating it. */
function inspectPluginGenerationSources(entries) {
	const bySource = /* @__PURE__ */ new Map();
	const digests = /* @__PURE__ */ new Map();
	const checks = [];
	for (const entry of entries) {
		if (digests.has(entry.pluginId)) continue;
		const key = `${entry.rootDir}\0${entry.entryFile ?? ""}`;
		let digest = bySource.get(key);
		if (digest === void 0) {
			const artifact = capturePluginGenerationArtifact(entry.rootDir, entry.entryFile);
			try {
				digest = artifact.sourceDigest;
				bySource.set(key, digest);
				checks.push(artifact.assertSourceCurrent);
			} finally {
				artifact.dispose();
			}
		}
		digests.set(entry.pluginId, digest);
	}
	return {
		sourceDigests: Object.fromEntries(digests),
		assertSourceCurrent: () => {
			for (const check of checks) check();
		}
	};
}
//#endregion
export { inspectPluginSourceDependencies as n, inspectPluginGenerationSources as t };
