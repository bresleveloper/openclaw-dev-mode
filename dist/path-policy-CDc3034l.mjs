import { f as pathExistsSync } from "./fs-safe-BUXBSN-4.mjs";
import { o as normalizeWindowsPathPreservingCase } from "./path-guards-CH7noY0Z.mjs";
import { u as resolveSandboxInputPath } from "./sandbox-paths-Br7HP2l8.mjs";
import path from "node:path";
//#region src/agents/path-policy.ts
/**
* Shared workspace and sandbox path boundary helpers.
*
* Converts validated absolute or relative inputs into root-relative paths without allowing boundary escapes.
*/
/** Compare resolved runtime paths using the declared root's syntax, never the host OS. */
function relativePathInsideSandboxRoot(root, target) {
	const windows = !root.startsWith("/") && path.win32.isAbsolute(root);
	const syntax = windows ? path.win32 : path.posix;
	const normalize = windows ? normalizeWindowsPathPreservingCase : path.posix.normalize;
	const normalizedRoot = normalize(root);
	const normalizedTarget = normalize(target);
	if (!syntax.isAbsolute(normalizedRoot) || !syntax.isAbsolute(normalizedTarget) || windows && (path.win32.parse(normalizedRoot).root === "\\" || path.win32.parse(normalizedTarget).root === "\\")) return null;
	const relative = syntax.relative(normalizedRoot, normalizedTarget);
	return relative === ".." || relative.startsWith(`..${syntax.sep}`) || syntax.isAbsolute(relative) ? null : relative;
}
/** Select the deepest admitted mapping without replacing a supplied miss with a host fallback. */
function resolveSandboxPathMapping(mappings, target) {
	let selected;
	for (const mapping of mappings) {
		const relative = relativePathInsideSandboxRoot(mapping.containerRoot, target);
		if (relative === null || selected && relative.length >= selected.relative.length) continue;
		const separator = mapping.containerRoot.startsWith("/") ? "/" : "\\";
		selected = {
			mapping,
			relative,
			hostPath: path.resolve(mapping.hostRoot, ...relative.split(separator))
		};
	}
	return selected ? {
		mapping: selected.mapping,
		hostPath: selected.hostPath
	} : null;
}
function toRelativePathUnderRoot(root, candidate, options = {}, sandbox = false) {
	const resolvedInput = resolveSandboxInputPath(candidate, options.cwd ?? root);
	const windows = process.platform === "win32";
	const syntax = windows ? path.win32 : path;
	const rootResolved = syntax.resolve(root);
	const resolvedCandidate = syntax.resolve(resolvedInput);
	const relative = syntax.relative(windows ? normalizeWindowsPathPreservingCase(rootResolved) : rootResolved, windows ? normalizeWindowsPathPreservingCase(resolvedCandidate) : resolvedCandidate);
	const targetsRoot = relative === "" || relative === ".";
	if (targetsRoot && options.allowRoot) return "";
	if (targetsRoot || relative === ".." || relative.startsWith("../") || relative.startsWith("..\\") || syntax.isAbsolute(relative)) {
		const boundary = sandbox ? `sandbox root (${rootResolved})` : "workspace root";
		throw new Error(`Path escapes ${boundary}: ${candidate}`);
	}
	return relative;
}
/** Return a workspace-relative path after rejecting boundary escapes. */
function toRelativeWorkspacePath(root, candidate, options) {
	return toRelativePathUnderRoot(root, candidate, options);
}
/** Return a sandbox-relative path, including the sandbox root in boundary errors. */
function toRelativeSandboxPath(root, candidate, options) {
	return toRelativePathUnderRoot(root, candidate, options, true);
}
/** Resolve a user-supplied path against `cwd` using the sandbox input rules. */
function resolvePathFromInput(filePath, cwd) {
	return path.normalize(resolveSandboxInputPath(filePath, cwd));
}
function preserveAtPrefixedRelativePath(filePath, cwd, bridge, signal) {
	if (!filePath.startsWith("@")) return filePath;
	const stripped = filePath.slice(1);
	if (!stripped || stripped === "~" || stripped.startsWith("~/") || stripped.startsWith("~\\") || /^file:\/\//i.test(stripped) || path.posix.isAbsolute(stripped) || path.win32.isAbsolute(stripped)) return filePath;
	const literalPath = `./${filePath}`;
	let literalAncestor = filePath;
	while (true) {
		const parent = path.dirname(literalAncestor);
		if (parent === "." || parent === literalAncestor) break;
		literalAncestor = parent;
	}
	const ancestorPath = literalAncestor === filePath ? void 0 : `./${literalAncestor}`;
	const mountedHostPath = bridge?.resolvePath({
		filePath: literalPath,
		cwd
	}).hostPath;
	if (!bridge || mountedHostPath) {
		const hostPath = mountedHostPath ?? path.resolve(cwd, literalPath);
		const ancestorHostPath = ancestorPath ? bridge ? bridge.resolvePath({
			filePath: ancestorPath,
			cwd
		}).hostPath : path.resolve(cwd, ancestorPath) : void 0;
		return pathExistsSync(hostPath) || ancestorHostPath && pathExistsSync(ancestorHostPath) ? literalPath : filePath;
	}
	signal?.throwIfAborted();
	return bridge.stat({
		filePath: literalPath,
		cwd,
		signal
	}).then(async (stat) => stat || ancestorPath && await bridge.stat({
		filePath: ancestorPath,
		cwd,
		signal
	}) ? literalPath : filePath);
}
//#endregion
export { toRelativeSandboxPath as a, resolveSandboxPathMapping as i, relativePathInsideSandboxRoot as n, toRelativeWorkspacePath as o, resolvePathFromInput as r, preserveAtPrefixedRelativePath as t };
