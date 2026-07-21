import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { _ as uniqueStrings } from "./string-normalization-CRyoFBPt.js";
import { i as isPathInside } from "./path-DILYn_gk.js";
import { m as resolveUserPath } from "./utils-CRO4LGEB.js";
import "./path-guards-CBe_wA_B.js";
import fs from "node:fs";
import path from "node:path";
//#region src/skills/loading/symlink-targets.ts
function resolveAllowedSkillSymlinkTargetRealPaths(config) {
	return uniqueStrings((config?.skills?.load?.allowSymlinkTargets ?? []).map((dir) => normalizeOptionalString(dir) ?? "").filter(Boolean).map((dir) => tryRealpath(resolveUserPath(dir))).filter((dir) => Boolean(dir)));
}
function findContainingAllowedSkillSymlinkTarget(rootRealPaths, candidateRealPath) {
	const resolvedCandidate = path.resolve(candidateRealPath);
	for (const rootRealPath of rootRealPaths) {
		const resolvedRoot = path.resolve(rootRealPath);
		if (isPathInside(resolvedRoot, resolvedCandidate)) return resolvedRoot;
	}
	return null;
}
function tryRealpath(filePath) {
	try {
		return fs.realpathSync(filePath);
	} catch {
		return null;
	}
}
//#endregion
export { resolveAllowedSkillSymlinkTargetRealPaths as n, tryRealpath as r, findContainingAllowedSkillSymlinkTarget as t };
