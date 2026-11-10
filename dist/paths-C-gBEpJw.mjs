import { realpathSync } from "node:fs";
import { relative, resolve, sep } from "node:path";
import { isPathRelativeEscape } from "@openclaw/fs-safe/path";
//#region src/agents/utils/paths.ts
/** Preserve the supplied spelling when the path cannot be resolved. */
function canonicalizePath(path) {
	try {
		return realpathSync(path);
	} catch {
		return path;
	}
}
function formatPathRelativeToCwdOrAbsolute(filePath, cwd) {
	const resolvedCwd = resolve(cwd);
	const resolvedPath = resolve(resolvedCwd, filePath);
	const relativePath = relative(resolvedCwd, resolvedPath);
	return (isPathRelativeEscape(relativePath) ? resolvedPath : relativePath || ".").split(sep).join("/");
}
//#endregion
export { formatPathRelativeToCwdOrAbsolute as n, canonicalizePath as t };
