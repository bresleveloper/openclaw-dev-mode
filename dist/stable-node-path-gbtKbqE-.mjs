import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import path from "node:path";
//#region packages/normalization-core/src/stable-node-path.ts
/**
* Returns stable Homebrew paths for a versioned Cellar Node executable.
* Availability remains caller-owned so packages can reuse the path contract
* without importing another package's filesystem/runtime layer.
*/
function stableHomebrewNodePathCandidates(nodePath) {
	const cellarMatch = nodePath.match(/^(.+?)[\\/]Cellar[\\/]([^\\/]+)[\\/][^\\/]+[\\/]bin[\\/]node$/);
	if (!cellarMatch) return [];
	const prefix = expectDefined(cellarMatch[1], "cellar match capture group 1");
	const formula = expectDefined(cellarMatch[2], "cellar match capture group 2");
	const pathModule = nodePath.includes("\\") ? path.win32 : path.posix;
	const candidates = [pathModule.join(prefix, "opt", formula, "bin", "node")];
	if (formula === "node") candidates.push(pathModule.join(prefix, "bin", "node"));
	return candidates;
}
//#endregion
export { stableHomebrewNodePathCandidates as t };
