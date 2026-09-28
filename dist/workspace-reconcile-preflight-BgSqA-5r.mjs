import { w as root } from "./fs-safe-BAPek8At.mjs";
import { t as hasNodeErrorCode } from "./path-guards-D5kuI0Tv.mjs";
import { i as createStagedInputPathMatcher } from "./staged-inputs-De-HBXyz.mjs";
import "./workspace-inventory-limits-DfDQlGHa.mjs";
import { r as isManagedSandboxSkillsPath } from "./sandbox-workspace-paths-UF9Y-Qu5.mjs";
import { h as isDerivedWorkspacePath } from "./workspace-manifest-453LPGpv.mjs";
import { a as sameEntry, n as hasPathAncestor, r as manifestNodes } from "./workspace-manifest-comparison-D9ne85OI.mjs";
import { a as localPath, n as directoryContainsOnlyDerivedWorkspaceEntries, o as localWorkspaceNode } from "./workspace-reconcile-fs-0dRq_ghi.mjs";
import fs from "node:fs/promises";
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
		for await (const entry of await fs.opendir(localPath(root, directory))) {
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
			const stats = await fs.lstat(localPath(root, childPath));
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
		const stats = await fs.lstat(localPath(params.root, entryPath)).catch(() => void 0);
		if (stats?.isDirectory() && !stats.isSymbolicLink()) localStructuralRoots.push(entryPath);
	}
	const localStructuralPaths = await localWorkspaceDescendantPaths(params.root, localStructuralRoots, isRetainedInput, new Set(structuralRoots.filter((entryPath) => currentNodes.has(entryPath))));
	const paths = [.../* @__PURE__ */ new Set([...changed, ...localStructuralPaths])].toSorted();
	const applyPaths = /* @__PURE__ */ new Set();
	const conflicts = /* @__PURE__ */ new Set();
	const blockingConflicts = /* @__PURE__ */ new Set();
	const localNodes = /* @__PURE__ */ new Map();
	const localNode = (entryPath) => {
		const existing = localNodes.get(entryPath);
		if (existing) return existing;
		const node = localWorkspaceNode(params.root, entryPath);
		localNodes.set(entryPath, node);
		return node;
	};
	for (const entryPath of paths) {
		if (hasPathAncestor(blockingConflicts, entryPath)) continue;
		if (currentNodes.get(entryPath) === void 0 && !await fs.lstat(localPath(params.root, entryPath)).catch((error) => {
			if (hasNodeErrorCode(error, "ENOENT") || hasNodeErrorCode(error, "ENOTDIR")) return;
			throw error;
		})) continue;
		const segments = entryPath.split("/");
		let localAncestorConflict = false;
		for (let index = 1; index < segments.length; index += 1) {
			const ancestor = segments.slice(0, index).join("/");
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
			const localStructurallyMatchesBase = localAncestor?.type === "directory" && baseAncestor?.type === "directory" ? true : sameEntry(localAncestor, baseAncestor);
			const localStructurallyMatchesCurrent = localAncestor?.type === "directory" && currentAncestor?.type === "directory" ? true : sameEntry(localAncestor, currentAncestor);
			if (!localStructurallyMatchesBase && !localStructurallyMatchesCurrent) {
				conflicts.add(ancestor);
				blockingConflicts.add(ancestor);
				localAncestorConflict = true;
				break;
			}
		}
		if (localAncestorConflict) continue;
		let local;
		let replacedBaseAncestor = false;
		for (let index = 1; index < segments.length; index += 1) {
			const ancestor = segments.slice(0, index).join("/");
			const baseAncestor = baseNodes.get(ancestor);
			if (baseAncestor && baseAncestor.type !== "directory" && !sameEntry(baseAncestor, currentNodes.get(ancestor)) && sameEntry(await localNode(ancestor), baseAncestor)) {
				replacedBaseAncestor = true;
				break;
			}
		}
		if (replacedBaseAncestor) local = void 0;
		else {
			local = await localNode(entryPath);
			if (local?.type === "directory" && (!baseNodes.has(entryPath) || !currentNodes.has(entryPath)) && currentNodes.get(entryPath)?.type !== "directory" && await directoryContainsOnlyDerivedWorkspaceEntries(params.root, entryPath, isRetainedInput)) local = void 0;
		}
		if (sameEntry(local, baseNodes.get(entryPath))) {
			if (changed.has(entryPath)) applyPaths.add(entryPath);
		} else if (!sameEntry(local, currentNodes.get(entryPath))) {
			conflicts.add(entryPath);
			const current = currentNodes.get(entryPath);
			if (current?.type === "directory" && local !== void 0 && local.type !== "directory" || current !== void 0 && current.type !== "directory" && local?.type === "directory") blockingConflicts.add(entryPath);
		}
	}
	const initialConflictPaths = Array.from(conflicts);
	for (const conflictPath of initialConflictPaths) {
		const segments = conflictPath.split("/");
		for (let index = 1; index < segments.length; index += 1) {
			const ancestor = segments.slice(0, index).join("/");
			const workerNode = currentNodes.get(ancestor);
			if (changed.has(ancestor) && workerNode && workerNode.type !== "directory") {
				conflicts.add(ancestor);
				blockingConflicts.add(ancestor);
				break;
			}
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
