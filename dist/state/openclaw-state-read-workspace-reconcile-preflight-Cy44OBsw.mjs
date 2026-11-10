import { n as hasNodeErrorCode } from "./openclaw-state-read-path-DKRN8JwZ.mjs";
import { t as root } from "./openclaw-state-read-fs-safe-Dwk-JnuH.mjs";
import { r as getOrCreatePromise } from "./openclaw-state-read-lazy-promise-DLFIcwoO.mjs";
import { b as createStagedInputPathMatcher, d as isDerivedWorkspacePath, f as isManagedSandboxSkillsPath, p as workspacePathAncestors } from "./openclaw-state-read-workspace-manifest-Bt7MNi5H.mjs";
import { C as localWorkspaceNode, D as manifestNodes, E as hasPathAncestor, S as localPath, k as sameEntry, x as directoryContainsOnlyWorkspaceEntries } from "./openclaw-state-read-openclaw-state-read-handlers-BUnsgff9.mjs";
import { lstatSync } from "node:fs";
import fs$1 from "node:fs/promises";
//#region src/gateway/worker-environments/workspace-reconcile-preflight.ts
const MAX_RECONCILIATION_PATH_BYTES = 67108864;
async function localWorkspaceDescendantPaths(root, entryPaths, isRetainedInput, nonDirectoryReplacements) {
	const paths = [];
	const pending = [...entryPaths];
	let pathBytes = 0;
	let enumeratedEntries = 0;
	while (pending.length > 0) {
		const directory = pending.pop();
		const names = [];
		for await (const entry of await fs$1.opendir(localPath(root, directory))) {
			names.push(entry.name);
			enumeratedEntries += 1;
			if (enumeratedEntries > 25e4) throw new Error("Gateway workspace manifest has too many entries");
		}
		for (const name of names.toSorted()) {
			const childPath = `${directory}/${name}`;
			pathBytes += Buffer.byteLength(childPath);
			if (pathBytes > MAX_RECONCILIATION_PATH_BYTES) throw new Error("Gateway workspace manifest paths exceed their byte limit");
			if (isManagedSandboxSkillsPath(childPath)) {
				if (hasPathAncestor(nonDirectoryReplacements, childPath)) paths.push(childPath);
				continue;
			}
			if (isDerivedWorkspacePath(childPath, await isRetainedInput(childPath))) continue;
			paths.push(childPath);
			const stats = await fs$1.lstat(localPath(root, childPath));
			if (stats.isDirectory() && !stats.isSymbolicLink()) pending.push(childPath);
		}
	}
	return paths;
}
async function preflightWorkspaceApplyImpl(params) {
	const isRetainedInput = createStagedInputPathMatcher(await root(params.root));
	const baseNodes = manifestNodes(params.base);
	const currentNodes = manifestNodes(params.current);
	const manifestPaths = [.../* @__PURE__ */ new Set([...baseNodes.keys(), ...currentNodes.keys()])];
	const changed = new Set(manifestPaths.filter((entryPath) => !sameEntry(baseNodes.get(entryPath), currentNodes.get(entryPath))));
	const structurallyReplacedDirectories = new Set([...changed].filter((entryPath) => baseNodes.get(entryPath)?.type === "directory" && currentNodes.get(entryPath)?.type !== "directory"));
	const structuralRoots = [...structurallyReplacedDirectories].filter((entryPath) => !hasPathAncestor(structurallyReplacedDirectories, entryPath));
	const localStructuralRoots = [];
	for (const entryPath of structuralRoots) {
		const stats = await fs$1.lstat(localPath(params.root, entryPath)).catch(() => void 0);
		if (stats?.isDirectory() && !stats.isSymbolicLink()) localStructuralRoots.push(entryPath);
	}
	const localStructuralPaths = await localWorkspaceDescendantPaths(params.root, localStructuralRoots, isRetainedInput, new Set(structuralRoots.filter((entryPath) => currentNodes.has(entryPath))));
	const paths = [.../* @__PURE__ */ new Set([...changed, ...localStructuralPaths])].toSorted();
	const applyPaths = /* @__PURE__ */ new Set();
	const conflicts = /* @__PURE__ */ new Set();
	const blockingConflicts = /* @__PURE__ */ new Set();
	const localNodes = /* @__PURE__ */ new Map();
	const localNode = (entryPath) => getOrCreatePromise(localNodes, entryPath, () => localWorkspaceNode(params.root, entryPath));
	for (const entryPath of paths) {
		if (hasPathAncestor(blockingConflicts, entryPath)) continue;
		if (currentNodes.get(entryPath) === void 0) try {
			if (!lstatSync(localPath(params.root, entryPath), { throwIfNoEntry: false })) continue;
		} catch (error) {
			if (hasNodeErrorCode(error, "ENOENT") || hasNodeErrorCode(error, "ENOTDIR")) continue;
			throw error;
		}
		let localAncestorConflict = false;
		let replacedBaseAncestor = false;
		for (const ancestor of workspacePathAncestors(entryPath)) {
			const baseAncestor = baseNodes.get(ancestor);
			const currentAncestor = currentNodes.get(ancestor);
			if (!baseAncestor && !currentAncestor) {
				const localAncestor = await localNode(ancestor);
				if (localAncestor && localAncestor.type !== "directory") {
					conflicts.add(ancestor);
					blockingConflicts.add(ancestor);
					localAncestorConflict = true;
					break;
				}
				continue;
			}
			const localAncestor = await localNode(ancestor);
			if (!sameEntry(localAncestor, baseAncestor) && !sameEntry(localAncestor, currentAncestor)) {
				conflicts.add(ancestor);
				blockingConflicts.add(ancestor);
				localAncestorConflict = true;
				break;
			}
			if (baseAncestor && baseAncestor.type !== "directory" && !sameEntry(baseAncestor, currentAncestor) && sameEntry(localAncestor, baseAncestor)) replacedBaseAncestor = true;
		}
		if (localAncestorConflict) continue;
		let local;
		if (replacedBaseAncestor) local = void 0;
		else {
			local = await localNode(entryPath);
			if (local?.type === "directory" && (!baseNodes.has(entryPath) || !currentNodes.has(entryPath)) && currentNodes.get(entryPath)?.type !== "directory" && await directoryContainsOnlyWorkspaceEntries(params.root, entryPath, isRetainedInput)) local = void 0;
		}
		if (sameEntry(local, baseNodes.get(entryPath))) {
			if (changed.has(entryPath)) applyPaths.add(entryPath);
		} else if (!sameEntry(local, currentNodes.get(entryPath))) {
			conflicts.add(entryPath);
			const current = currentNodes.get(entryPath);
			if (current?.type === "directory" && local !== void 0 && local.type !== "directory" || current !== void 0 && current.type !== "directory" && local?.type === "directory") blockingConflicts.add(entryPath);
		}
	}
	const conflictsBeforeLifting = [...conflicts];
	for (const conflictPath of conflictsBeforeLifting) for (const ancestor of workspacePathAncestors(conflictPath)) {
		const workerNode = currentNodes.get(ancestor);
		if (changed.has(ancestor) && workerNode && workerNode.type !== "directory") {
			conflicts.add(ancestor);
			blockingConflicts.add(ancestor);
			break;
		}
	}
	const conflictPaths = [...conflicts].filter((entryPath) => !hasPathAncestor(blockingConflicts, entryPath)).toSorted();
	const blockingConflictPaths = [...blockingConflicts].filter((entryPath) => !hasPathAncestor(blockingConflicts, entryPath)).toSorted();
	const conflictPathSet = new Set(conflictPaths);
	const blockingConflictPathSet = new Set(blockingConflictPaths);
	for (const entryPath of applyPaths) if (conflictPathSet.has(entryPath) || hasPathAncestor(blockingConflictPathSet, entryPath)) applyPaths.delete(entryPath);
	return {
		applyPaths,
		conflictPaths,
		blockingConflictPaths
	};
}
//#endregion
export { preflightWorkspaceApplyImpl };
