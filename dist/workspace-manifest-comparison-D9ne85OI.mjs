import { c as stagedInputDirectoriesFromEntries, o as isStagedInputPath } from "./staged-inputs-De-HBXyz.mjs";
import { h as isDerivedWorkspacePath, t as MAX_RECONCILIATION_ENTRIES } from "./workspace-manifest-453LPGpv.mjs";
//#region src/gateway/worker-environments/workspace-manifest-comparison.ts
function sameEntry(left, right) {
	if (left === right) return true;
	if (!left || !right || left.path !== right.path || left.type !== right.type) return false;
	switch (left.type) {
		case "file": return right.type === "file" && left.mode === right.mode && left.size === right.size && left.sha256 === right.sha256;
		case "symlink": return right.type === "symlink" && left.mode === right.mode && left.target === right.target;
		default: return true;
	}
}
function manifestNodes(manifest) {
	const staged = stagedInputDirectoriesFromEntries(manifest.entries);
	const nodes = /* @__PURE__ */ new Map();
	for (const directory of manifest.directories ?? []) if (!isDerivedWorkspacePath(directory, isStagedInputPath(directory, staged))) nodes.set(directory, {
		path: directory,
		type: "directory"
	});
	for (const entry of manifest.entries) if (!isDerivedWorkspacePath(entry.path, isStagedInputPath(entry.path, staged))) nodes.set(entry.path, entry);
	return nodes;
}
function hasPathAncestor(paths, entryPath) {
	const segments = entryPath.split("/");
	for (let index = 1; index < segments.length; index += 1) if (paths.has(segments.slice(0, index).join("/"))) return true;
	return false;
}
function changedPaths(base, current, signal) {
	signal?.throwIfAborted();
	const baseNodes = manifestNodes(base);
	const currentNodes = manifestNodes(current);
	const changed = /* @__PURE__ */ new Set();
	for (const [entryPath, entry] of baseNodes) if (!sameEntry(entry, currentNodes.get(entryPath))) changed.add(entryPath);
	for (const entryPath of currentNodes.keys()) if (!baseNodes.has(entryPath)) changed.add(entryPath);
	return changed;
}
function parseChangedWorkspaceResult(base, current, enforceRecordLimit = true) {
	const remainingBase = manifestNodes(base);
	const staged = stagedInputDirectoriesFromEntries(current.entries);
	let recordCount = 0;
	for (const directory of current.directories ?? []) {
		if (isDerivedWorkspacePath(directory, isStagedInputPath(directory, staged))) continue;
		const previous = remainingBase.get(directory);
		if (previous?.type !== "directory") recordCount += previous ? 2 : 1;
		remainingBase.delete(directory);
	}
	const entries = [];
	for (const entry of current.entries) {
		if (isDerivedWorkspacePath(entry.path, isStagedInputPath(entry.path, staged))) continue;
		const previous = remainingBase.get(entry.path);
		if (!sameEntry(previous, entry)) {
			recordCount += previous ? 2 : 1;
			entries.push(entry);
		}
		remainingBase.delete(entry.path);
	}
	recordCount += remainingBase.size;
	if (enforceRecordLimit && recordCount > MAX_RECONCILIATION_ENTRIES) throw new Error(`Cloud workspace reconciliation exceeds the ${MAX_RECONCILIATION_ENTRIES} entry limit`);
	let totalBytes = 0;
	for (const entry of entries) {
		if (entry.type === "file" && entry.size > 67108864) throw new Error(`Cloud workspace result is too large: ${entry.path}`);
		totalBytes += entry.type === "file" ? entry.size : Buffer.byteLength(entry.target);
		if (totalBytes > 805306368) throw new Error("Cloud workspace staged result exceeds its byte limit");
	}
	return {
		changed: recordCount > 0,
		entries
	};
}
//#endregion
export { sameEntry as a, parseChangedWorkspaceResult as i, hasPathAncestor as n, manifestNodes as r, changedPaths as t };
