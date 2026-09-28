import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { O as listAgentIds } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { n as normalizeAgentDirRegistryPath, t as isPathOwnedByAnotherRegisteredAgent } from "./agent-dir-registry-QuKJka9m.mjs";
import { n as resolveSessionStoreCompatibilityAgentId } from "./legacy.default-agent-owner-B5Sofm47.mjs";
import { i as resolveSqliteDatabaseFilePaths } from "./sqlite-files-eRv24eIu.mjs";
import { a as resolveOpenClawAgentSqlitePath, i as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import "./agent-scope-CTuYDtny.mjs";
import { a as assertNoOpenClawAgentDatabaseLeases } from "./openclaw-agent-db-lease-DexIwF6s.mjs";
import { o as closeOpenClawAgentDatabaseByPathAsync, u as inspectOpenClawAgentDatabaseOwner } from "./openclaw-agent-db-lifecycle-D7S9DdJC.mjs";
import "./openclaw-agent-db-CaQAStOA.mjs";
import { i as listOpenClawRegisteredAgentDatabases, r as invalidateRegisteredAgentDatabasesMemo } from "./openclaw-agent-db-registry-listing-CHFiKgU_.mjs";
import { s as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Dcog4O-M.mjs";
import { t as findOverlappingWorkspaceAgentIds } from "./agent-delete-safety-Ci4iwiZS.mjs";
import path from "node:path";
//#region src/agents/agent-delete-databases.ts
/** Destructive planning includes every registered owner, regardless of runtime schema readiness. */
function readAgentDeleteDatabaseRegistry(options = {}) {
	invalidateRegisteredAgentDatabasesMemo(options);
	return listOpenClawRegisteredAgentDatabases({
		...options,
		includeIncompatibleSchemaVersions: true
	});
}
var AgentSharedStoreOwnerError = class extends Error {};
/** Check before journaling: retaining the file alone would still fence its shared owner. */
function assertAgentSessionStoreDeletionSafe(cfg, agentId, options = {}) {
	if (!cfg.session?.store?.trim()) return;
	const id = normalizeAgentId(agentId);
	const defaultAgentId = resolveSessionStoreCompatibilityAgentId(cfg);
	const registeredDatabases = readAgentDeleteDatabaseRegistry(options);
	for (const survivorId of listAgentIds(cfg)) {
		if (normalizeAgentId(survivorId) === id) continue;
		const storePath = resolveSessionStorePathCore(cfg.session.store, {
			agentId: survivorId,
			env: options.env
		});
		const target = resolveSqliteTargetFromSessionStorePath(storePath, {
			agentId: survivorId,
			defaultAgentId,
			env: options.env,
			registeredDatabases
		});
		const owner = inspectOpenClawAgentDatabaseOwner(target.path);
		if (owner.status === "owned" && owner.agentId === id) throw new AgentSharedStoreOwnerError(`Agent "${id}" owns the session database still used by agent "${survivorId}" and cannot be deleted. Keep this owner configured until shared history can be moved with a supported migration; no such migration is currently available.`);
	}
}
function resolveSurvivingDatabaseFilePaths(registeredDatabases, agentId, env) {
	return [...new Set(registeredDatabases.filter((entry) => normalizeAgentId(entry.agentId) !== agentId).flatMap((entry) => resolveSqliteDatabaseFilePaths(entry.path)).map((pathname) => normalizeAgentDirRegistryPath(pathname, env)))];
}
function isPathOwnedBySurvivingAgent(cfg, agentId, pathname, survivingDatabaseFilePaths = [], env) {
	const canonicalPath = normalizeAgentDirRegistryPath(pathname, env);
	return isPathOwnedByAnotherRegisteredAgent({
		agentId,
		pathname,
		env
	}) || findOverlappingWorkspaceAgentIds(cfg, agentId, pathname, env).length > 0 || survivingDatabaseFilePaths.some((databasePath) => databasePath === canonicalPath || isPathInside(databasePath, canonicalPath) || isPathInside(canonicalPath, databasePath));
}
async function prepareAgentDeleteDatabases(cfg, agentId, agentDir, options = {}) {
	const registeredDatabases = readAgentDeleteDatabaseRegistry(options);
	const survivingDatabaseFilePaths = resolveSurvivingDatabaseFilePaths(registeredDatabases, agentId, options.env);
	const registeredDatabasePaths = /* @__PURE__ */ new Set([resolveOpenClawAgentSqlitePath({
		agentId,
		env: options.env,
		path: path.join(agentDir, "openclaw-agent.sqlite")
	}), ...registeredDatabases.filter((entry) => normalizeAgentId(entry.agentId) === agentId).map((entry) => entry.path)]);
	for (const databasePath of registeredDatabasePaths) await closeOpenClawAgentDatabaseByPathAsync(databasePath, agentId);
	await closeOpenClawAgentDatabaseByPathAsync(resolveIncognitoOpenClawAgentSqlitePath({
		agentId,
		env: options.env
	}), agentId);
	const databasePaths = [...registeredDatabasePaths].filter((pathname) => resolveSqliteDatabaseFilePaths(pathname).every((filePath) => !isPathOwnedBySurvivingAgent(cfg, agentId, filePath, survivingDatabaseFilePaths, options.env)));
	assertNoOpenClawAgentDatabaseLeases(agentId, options);
	const fileGroups = databasePaths.map(resolveSqliteDatabaseFilePaths);
	const relocatedFileGroups = fileGroups.filter((fileGroup) => {
		const relative = path.relative(agentDir, fileGroup[0] ?? agentDir);
		return relative.startsWith("..") || path.isAbsolute(relative);
	});
	return {
		registrationPaths: [...registeredDatabasePaths],
		fileGroups,
		relocatedFileGroups
	};
}
//#endregion
export { readAgentDeleteDatabaseRegistry as a, prepareAgentDeleteDatabases as i, assertAgentSessionStoreDeletionSafe as n, resolveSurvivingDatabaseFilePaths as o, isPathOwnedBySurvivingAgent as r, AgentSharedStoreOwnerError as t };
