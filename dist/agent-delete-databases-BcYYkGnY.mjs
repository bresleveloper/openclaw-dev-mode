import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { a as resolveSqliteDatabaseFilePaths } from "./sqlite-files-BEC3zbaw.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { A as registerResolvedAgentDir, M as unregisterResolvedAgentDir, O as isPathOwnedByAnotherRegisteredAgent, a as resolveAgentDir, j as resolveRegisteredAgentIdForDir, k as normalizeAgentDirRegistryPath } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { i as listAgentIds } from "./agent-roster-BXD1uMJD.mjs";
import { c as resolveOpenClawAgentSqlitePath, s as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import "./agent-scope-CG17uXFn.mjs";
import { n as resolveSessionStoreCompatibilityAgentId } from "./legacy.default-agent-owner-CiZjlN5C.mjs";
import { r as closeAuthProfileReadPool } from "./sqlite-read-pool-B3hiJ5bv.mjs";
import { a as assertNoOpenClawAgentDatabaseLeases } from "./openclaw-agent-db-lease-D8zYIRzn.mjs";
import { a as invalidateRegisteredAgentDatabasesMemo, s as listOpenClawRegisteredAgentDatabases } from "./openclaw-agent-db-registry-listing-BmvvQ59E.mjs";
import { n as unregisterOpenClawAgentDatabase } from "./openclaw-agent-db-registry-BJf044De.mjs";
import { a as closeOpenClawAgentDatabaseByPathAsync, d as inspectOpenClawAgentDatabaseOwner } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import "./openclaw-agent-db-DBug3LUA.mjs";
import { o as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { t as findOverlappingWorkspaceAgentIds } from "./agent-delete-safety-DmMgHiSV.mjs";
import path from "node:path";
//#region src/agents/agent-delete-databases.ts
async function retireAgentDeleteRuntime(cfg, deletion, agentDirs) {
	const agentId = deletion.entry.agentId;
	const { retirePreparedModelRuntimeAgent } = await import("./prepared-model-runtime-D44W8DOl.mjs");
	await deletion.assertCurrentAsync();
	await retirePreparedModelRuntimeAgent({
		agentId,
		agentDirs
	});
	const { closeActiveMemorySearchManagerCore } = await import("./memory-runtime-BNDrcERN.mjs");
	await deletion.assertCurrentAsync();
	await closeActiveMemorySearchManagerCore({
		cfg,
		agentId
	});
	await deletion.assertCurrentAsync();
}
async function finishAgentDeleteDatabases(params) {
	const { deletion, databasePlan, agentDir, deleteFiles, complete } = params;
	await deletion.assertCurrentAsync();
	if (!complete) return;
	const agentId = deletion.entry.agentId;
	unregisterResolvedAgentDir({
		agentId,
		agentDir
	});
	if (deleteFiles) for (const databasePath of databasePlan?.registrationPaths ?? []) unregisterOpenClawAgentDatabase({
		agentId,
		path: databasePath
	});
	deletion.finish();
}
/** Destructive planning includes every registered owner, regardless of runtime schema readiness. */
function readAgentDeleteDatabaseRegistry(options = {}) {
	invalidateRegisteredAgentDatabasesMemo(options);
	return listOpenClawRegisteredAgentDatabases({
		...options,
		includeIncompatibleSchemaVersions: true
	});
}
var AgentSharedStoreOwnerError = class extends Error {};
function prepareJournaledAgentDirOwnership(cfg, agentId, agentDir) {
	for (const configuredAgentId of listAgentIds(cfg)) resolveAgentDir(cfg, configuredAgentId);
	if (resolveRegisteredAgentIdForDir(agentDir) !== void 0) return;
	registerResolvedAgentDir({
		agentId,
		agentDir
	});
}
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
	for (const databasePath of databasePaths) closeAuthProfileReadPool({
		kind: "database",
		databasePath
	});
	assertNoOpenClawAgentDatabaseLeases(agentId, options);
	const fileGroups = databasePaths.map(resolveSqliteDatabaseFilePaths);
	const relocatedFileGroups = fileGroups.filter((fileGroup) => {
		const relative = path.relative(agentDir, fileGroup[0] ?? agentDir);
		return relative.startsWith("..") || path.isAbsolute(relative);
	});
	return {
		agentDirs: [agentDir, ...Array.from(registeredDatabasePaths, (databasePath) => path.dirname(databasePath))],
		registrationPaths: [...registeredDatabasePaths],
		readerPaths: databasePaths,
		fileGroups,
		relocatedFileGroups
	};
}
//#endregion
export { prepareAgentDeleteDatabases as a, resolveSurvivingDatabaseFilePaths as c, isPathOwnedBySurvivingAgent as i, retireAgentDeleteRuntime as l, assertAgentSessionStoreDeletionSafe as n, prepareJournaledAgentDirOwnership as o, finishAgentDeleteDatabases as r, readAgentDeleteDatabaseRegistry as s, AgentSharedStoreOwnerError as t };
