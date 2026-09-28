import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
//#region src/agents/workspace-state-identity.ts
const MAX_WORKSPACE_IDENTITY_SYMLINKS = 40;
function normalizeWorkspaceIdentityPath(value) {
	const normalized = path.normalize(value).normalize("NFC");
	return process.platform === "win32" ? normalized.toLowerCase() : normalized;
}
function canonicalizeWorkspacePath(workspaceDir, normalizePath) {
	let candidate = path.resolve(resolveUserPath(workspaceDir));
	const fallback = normalizePath(candidate);
	const followedSymlinks = /* @__PURE__ */ new Set();
	for (let redirectCount = 0; redirectCount < MAX_WORKSPACE_IDENTITY_SYMLINKS; redirectCount += 1) {
		const missingSegments = [];
		let current = candidate;
		while (true) {
			try {
				return normalizePath(path.join(fs.realpathSync.native(current), ...missingSegments.toReversed()));
			} catch {}
			try {
				if (fs.lstatSync(current).isSymbolicLink()) {
					const normalizedLink = path.normalize(current);
					if (followedSymlinks.has(normalizedLink)) return fallback;
					followedSymlinks.add(normalizedLink);
					candidate = path.resolve(path.dirname(current), fs.readlinkSync(current), ...missingSegments.toReversed());
					break;
				}
			} catch {}
			const parent = path.dirname(current);
			if (parent === current) return fallback;
			missingSegments.push(path.basename(current));
			current = parent;
		}
	}
	return fallback;
}
function resolveCanonicalWorkspacePath(workspaceDir) {
	return canonicalizeWorkspacePath(workspaceDir, path.normalize);
}
function createWorkspaceStateIdentity(workspacePath) {
	return {
		workspacePath,
		workspaceKey: createHash("sha256").update(workspacePath).digest("hex")
	};
}
function resolveWorkspaceStateAliases(workspaceDir) {
	const lexicalPath = normalizeWorkspaceIdentityPath(path.resolve(resolveUserPath(workspaceDir)));
	const canonicalPath = canonicalizeWorkspacePath(workspaceDir, normalizeWorkspaceIdentityPath);
	return [.../* @__PURE__ */ new Set([lexicalPath, canonicalPath])].map(createWorkspaceStateIdentity);
}
function resolveWorkspaceStateIdentity(workspaceDir) {
	return createWorkspaceStateIdentity(canonicalizeWorkspacePath(workspaceDir, normalizeWorkspaceIdentityPath));
}
const WORKSPACE_ALIAS_REPOINTED_ERROR_CODE = "WORKSPACE_ALIAS_REPOINTED";
var WorkspaceAliasRepointedError = class extends Error {
	constructor(params) {
		super(`workspace path alias points to a different current target: ${params.aliasPath} now resolves to ${params.currentWorkspacePath}, but its stored workspace state belongs to ${params.storedWorkspacePath}. Run \`openclaw doctor --fix\` and confirm the move, or use \`openclaw doctor --fix --force\`.`);
		this.code = WORKSPACE_ALIAS_REPOINTED_ERROR_CODE;
		this.name = "WorkspaceAliasRepointedError";
		this.aliasPath = params.aliasPath;
		this.storedWorkspacePath = params.storedWorkspacePath;
		this.currentWorkspacePath = params.currentWorkspacePath;
	}
};
const WORKSPACE_VANISHED_ERROR_CODE = "WORKSPACE_VANISHED";
var WorkspaceVanishedError = class extends Error {
	constructor(params) {
		super(`OpenClaw workspace appears to have disappeared after a recent initialization: ${params.workspaceDir}. Refusing to reseed BOOTSTRAP.md over a recently attested workspace. Restore the workspace or run a full OpenClaw reset if this reset was intentional.`);
		this.code = WORKSPACE_VANISHED_ERROR_CODE;
		this.name = "WorkspaceVanishedError";
		this.workspaceDir = params.workspaceDir;
	}
};
//#endregion
export { normalizeWorkspaceIdentityPath as a, resolveWorkspaceStateIdentity as c, createWorkspaceStateIdentity as i, WorkspaceAliasRepointedError as n, resolveCanonicalWorkspacePath as o, WorkspaceVanishedError as r, resolveWorkspaceStateAliases as s, WORKSPACE_VANISHED_ERROR_CODE as t };
