import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import path from "node:path";
//#region src/agents/workspace-dir.ts
/**
* Workspace directory normalization helpers. They expand user paths, reject
* filesystem roots, and provide cwd fallback for runtime callers.
*/
/** Normalizes a workspace directory and rejects filesystem roots. */
function normalizeWorkspaceDir(workspaceDir) {
	const trimmed = workspaceDir?.trim();
	if (!trimmed) return null;
	const expanded = trimmed.startsWith("~") ? resolveUserPath(trimmed) : trimmed;
	const resolved = path.resolve(expanded);
	if (resolved === path.parse(resolved).root) return null;
	return resolved;
}
/** Resolves the effective workspace root, falling back to cwd. */
function resolveWorkspaceRoot(workspaceDir) {
	return normalizeWorkspaceDir(workspaceDir) ?? process.cwd();
}
//#endregion
export { resolveWorkspaceRoot as n, normalizeWorkspaceDir as t };
