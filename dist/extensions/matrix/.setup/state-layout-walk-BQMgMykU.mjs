import { c as resolveMatrixStateLayoutChildDepth } from "./storage-paths-B51JM-pC.mjs";
import path from "node:path";
import { hasNodeErrorCode } from "@openclaw/fs-safe/path";
import { walkDirectory } from "@openclaw/fs-safe/walk";
//#region extensions/matrix/src/matrix/state-layout-walk.ts
/** Traverse only shipped Matrix layouts; archives and unrelated descendants stay unopened. */
async function walkMatrixStateFiles(stateDir, includeFile, stateRootDepths = []) {
	const matrixRoot = path.resolve(stateDir, "matrix");
	const depths = /* @__PURE__ */ new Map([[matrixRoot, 0]]);
	const result = await walkDirectory(matrixRoot, {
		symlinks: "skip",
		include: (entry) => entry.kind === "file" && includeFile(entry.name, depths.get(path.dirname(entry.path))),
		descend: (entry) => {
			const parentDepth = depths.get(path.dirname(entry.path));
			const depth = entry.name === "state" && stateRootDepths.includes(parentDepth) ? 5 : resolveMatrixStateLayoutChildDepth(parentDepth, entry.name);
			if (depth === null) return false;
			depths.set(entry.path, depth);
			return true;
		}
	});
	return {
		entries: result.entries,
		failedDirs: result.failedDirs.filter((failure) => failure.path !== matrixRoot || !hasNodeErrorCode(failure.error, "ENOENT"))
	};
}
//#endregion
export { walkMatrixStateFiles as t };
