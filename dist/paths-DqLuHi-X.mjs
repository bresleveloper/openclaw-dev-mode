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
/**
* Returns true if the value is NOT a package source (npm:, git:, etc.)
* or a URL protocol. Bare names and relative paths without ./ prefix
* are considered local.
*/
function isLocalPath(value) {
	const trimmed = value.trim();
	return !(trimmed.startsWith("npm:") || trimmed.startsWith("git:") || trimmed.startsWith("github:") || trimmed.startsWith("http:") || trimmed.startsWith("https:") || trimmed.startsWith("ssh:"));
}
function formatPathRelativeToCwdOrAbsolute(filePath, cwd) {
	const resolvedCwd = resolve(cwd);
	const resolvedPath = resolve(resolvedCwd, filePath);
	const relativePath = relative(resolvedCwd, resolvedPath);
	return (isPathRelativeEscape(relativePath) ? resolvedPath : relativePath || ".").split(sep).join("/");
}
//#endregion
export { formatPathRelativeToCwdOrAbsolute as n, isLocalPath as r, canonicalizePath as t };
