import { t as hasNodeErrorCode } from "./path-guards-CH7noY0Z.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-6Z4UiMS4.mjs";
import { g as workspacePathAncestors, h as isDerivedWorkspacePath } from "./workspace-manifest-BR0NHoW3.mjs";
import { a as createStagedInputPathMatcher, l as stagedInputDirectoriesFromEntries, s as isStagedInputPath } from "./staged-inputs-Hv7T90Jl.mjs";
import { i as isManagedSandboxSkillsPath } from "./sandbox-workspace-paths-8lp0pLw0.mjs";
import fs from "node:fs/promises";
import path from "node:path";
//#region src/gateway/worker-environments/workspace-reconcile-derived-paths.ts
function reconciliationEntries(entries, stagedInputDirectories = stagedInputDirectoriesFromEntries(entries)) {
	return entries.filter((entry) => !isDerivedWorkspacePath(entry.path, isStagedInputPath(entry.path, stagedInputDirectories)));
}
function reconciliationDirectories(directories, stagedInputDirectories) {
	return (directories ?? []).filter((directory) => !isDerivedWorkspacePath(directory, isStagedInputPath(directory, stagedInputDirectories)));
}
async function removeDerivedWorkspaceDescendants(root, relativeDirectory, isRetainedInput) {
	for (const entry of await root.list(relativeDirectory, { withFileTypes: true })) {
		const child = relativeDirectory ? `${relativeDirectory}/${entry.name}` : entry.name;
		if (isManagedSandboxSkillsPath(child)) continue;
		if (isDerivedWorkspacePath(child, await isRetainedInput(child))) {
			await removeDerivedWorkspaceEntry(root, child, entry.isDirectory);
			continue;
		}
		if (entry.isDirectory) {
			await removeDerivedWorkspaceDescendants(root, child, isRetainedInput);
			if ((await root.list(child)).length === 0) await root.remove(child);
		}
	}
}
async function removeDerivedWorkspaceEntry(root, relativePath, isDirectory) {
	if (isDirectory) {
		let entries;
		try {
			entries = await root.list(relativePath, { withFileTypes: true });
		} catch (error) {
			if (!(error instanceof FsSafeError) || !["not-found", "path-alias"].includes(error.code)) throw error;
			entries = void 0;
		}
		for (const entry of entries ?? []) await removeDerivedWorkspaceEntry(root, `${relativePath}/${entry.name}`, entry.isDirectory);
	}
	await root.remove(relativePath).catch((error) => {
		if (!(error instanceof FsSafeError) || error.code !== "not-found") throw error;
	});
}
async function hasWorkspaceSymlinkAncestor(root, relativePath) {
	for (const ancestor of workspacePathAncestors(relativePath)) if ((await fs.lstat(path.join(root, ancestor)).catch(() => void 0))?.isSymbolicLink()) return true;
	return false;
}
async function prepareNonDirectoryTargets(root$1, entries, retainedInput, assertCurrent) {
	const workspaceRoot = await root(root$1, { assertBeforeMutation: assertCurrent });
	const isRetainedInput = retainedInput ?? createStagedInputPathMatcher(workspaceRoot);
	for (const entry of entries) if ((await fs.lstat(path.join(root$1, entry.path)).catch(async (error) => {
		if (hasNodeErrorCode(error, "ENOENT") || hasNodeErrorCode(error, "ENOTDIR") || await hasWorkspaceSymlinkAncestor(root$1, entry.path)) return;
		throw error;
	}))?.isDirectory() && !await hasWorkspaceSymlinkAncestor(root$1, entry.path)) {
		await removeDerivedWorkspaceDescendants(workspaceRoot, entry.path, isRetainedInput);
		if ((await workspaceRoot.list(entry.path)).length === 0) await workspaceRoot.remove(entry.path);
	}
}
//#endregion
export { reconciliationDirectories as n, reconciliationEntries as r, prepareNonDirectoryTargets as t };
