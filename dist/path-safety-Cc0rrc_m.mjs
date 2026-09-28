import { t as FsSafeError } from "./fs-safe-BAPek8At.mjs";
import { o as openRootFileSync } from "./boundary-file-read-D-Aa04On.mjs";
import { n as isPathInside$1 } from "./path-safety-0BfxAYBQ.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/plugins/path-safety.ts
/** Plugin-local re-export of shared path safety helpers for plugin install/runtime code. */
/** Resolves matching physical spellings when Windows presents one tree through different aliases. */
function resolvePhysicalPathInsideRootSync(rootPath, targetPath) {
	if (process.platform !== "win32") return;
	try {
		const root = fs.statSync(rootPath, { bigint: true });
		if (!root.isDirectory() || root.ino === 0n) return;
		let current = path.resolve(targetPath);
		while (true) {
			const candidate = fs.statSync(current, { bigint: true });
			if (candidate.dev === root.dev && candidate.ino === root.ino) {
				const physicalRoot = fs.lstatSync(current).isSymbolicLink() ? path.resolve(rootPath) : current;
				return {
					rootPath: physicalRoot,
					targetPath: path.resolve(physicalRoot, path.relative(current, targetPath)),
					rootIdentity: Object.freeze({
						dev: root.dev,
						ino: root.ino
					})
				};
			}
			const parent = path.dirname(current);
			if (parent === current) return;
			current = parent;
		}
	} catch {
		return;
	}
}
function isPathInside(rootPath, targetPath) {
	return isPathInside$1(rootPath, targetPath) || resolvePhysicalPathInsideRootSync(rootPath, targetPath) !== void 0;
}
/** Returns a target's relative path after proving a Windows alias names the same root. */
function relativePluginPathInsideRootSync(rootPath, targetPath) {
	if (isPathInside$1(rootPath, targetPath)) return path.relative(path.resolve(rootPath), path.resolve(targetPath));
	const physical = resolvePhysicalPathInsideRootSync(rootPath, targetPath);
	return physical ? path.relative(physical.rootPath, physical.targetPath) : void 0;
}
function createIdentityBoundRootFileFs(rootPath, expected) {
	const lstatSync = ((...args) => {
		const stat = Reflect.apply(fs.lstatSync, fs, args);
		if (args[0] === rootPath) {
			const dev = typeof stat.dev === "bigint" ? stat.dev : BigInt(stat.dev);
			const ino = typeof stat.ino === "bigint" ? stat.ino : BigInt(stat.ino);
			if (!stat.isDirectory() || dev !== expected.dev || ino !== expected.ino) throw new FsSafeError("path-mismatch", "plugin root identity changed during alias reconciliation");
		}
		return stat;
	});
	return {
		closeSync: fs.closeSync,
		constants: fs.constants,
		fstatSync: fs.fstatSync,
		lstatSync,
		openSync: fs.openSync,
		readFileSync: fs.readFileSync,
		realpathSync: fs.realpathSync
	};
}
/** Opens a plugin artifact after reconciling Windows root aliases. */
function openPluginRootFileSync(params) {
	const admittedRoot = params.rootRealPath ?? params.rootPath;
	const physical = isPathInside$1(admittedRoot, params.filePath) ? void 0 : resolvePhysicalPathInsideRootSync(admittedRoot, params.filePath);
	return openRootFileSync({
		absolutePath: physical?.targetPath ?? params.filePath,
		rootPath: physical?.rootPath ?? params.rootPath,
		rootRealPath: physical?.rootPath ?? params.rootRealPath,
		boundaryLabel: params.boundaryLabel ?? "plugin root",
		rejectHardlinks: params.rejectHardlinks,
		maxBytes: params.maxBytes,
		skipLexicalRootCheck: physical ? true : void 0,
		ioFs: physical ? createIdentityBoundRootFileFs(physical.rootPath, physical.rootIdentity) : void 0
	});
}
//#endregion
export { openPluginRootFileSync as n, relativePluginPathInsideRootSync as r, isPathInside as t };
