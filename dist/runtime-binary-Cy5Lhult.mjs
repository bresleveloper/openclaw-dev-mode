//#region src/daemon/runtime-binary.ts
/** Classifies runtime executable paths for daemon command rendering. */
const NODE_VERSIONED_PATTERN = /^node(?:-\d+|\d+)(?:\.\d+)*(?:\.exe)?$/;
function normalizeRuntimeBasename(execPath) {
	const trimmed = execPath.trim().replace(/^["']|["']$/g, "");
	const lastSlash = Math.max(trimmed.lastIndexOf("/"), trimmed.lastIndexOf("\\"));
	return (lastSlash === -1 ? trimmed : trimmed.slice(lastSlash + 1)).trim().toLowerCase();
}
/** Returns whether an executable path names a Node runtime binary. */
function isNodeRuntime(execPath) {
	const base = normalizeRuntimeBasename(execPath);
	return base === "node" || base === "node.exe" || base === "nodejs" || base === "nodejs.exe" || NODE_VERSIONED_PATTERN.test(base);
}
/** Returns whether an executable path names a Bun runtime binary. */
function isBunRuntime(execPath) {
	const base = normalizeRuntimeBasename(execPath);
	return base === "bun" || base === "bun.exe";
}
//#endregion
export { isNodeRuntime as n, isBunRuntime as t };
