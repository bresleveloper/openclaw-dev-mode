import { realpathSync } from "node:fs";
import { isAbsolute, relative, resolve, sep } from "node:path";
//#region src/agents/utils/paths.ts
/**
* Agent path formatting helpers.
*
* Canonicalizes local paths and formats paths relative to a workspace when possible.
*/
/**
* Resolve a path to its canonical (real) form, following symlinks.
* Falls back to the raw path if resolution fails (e.g. the target does
* not exist yet), so that callers never crash on missing filesystem
* entries.
*/
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
	if (trimmed.startsWith("npm:") || trimmed.startsWith("git:") || trimmed.startsWith("github:") || trimmed.startsWith("http:") || trimmed.startsWith("https:") || trimmed.startsWith("ssh:")) return false;
	return true;
}
function resolveAgainstCwd(filePath, cwd) {
	return isAbsolute(filePath) ? resolve(filePath) : resolve(cwd, filePath);
}
function getCwdRelativePath(filePath, cwd) {
	const resolvedCwd = resolve(cwd);
	const resolvedPath = resolveAgainstCwd(filePath, resolvedCwd);
	const relativePath = relative(resolvedCwd, resolvedPath);
	return relativePath === "" || relativePath !== ".." && !relativePath.startsWith(`..${sep}`) && !isAbsolute(relativePath) ? relativePath || "." : void 0;
}
function formatPathRelativeToCwdOrAbsolute(filePath, cwd) {
	const absolutePath = resolveAgainstCwd(filePath, cwd);
	return (getCwdRelativePath(absolutePath, cwd) ?? absolutePath).split(sep).join("/");
}
//#endregion
export { formatPathRelativeToCwdOrAbsolute as n, isLocalPath as r, canonicalizePath as t };
