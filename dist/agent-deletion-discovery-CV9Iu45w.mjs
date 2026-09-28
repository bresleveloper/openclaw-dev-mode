import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import "./session-key-CBvmC8zz.mjs";
import { s as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-DYMh54HD.mjs";
import { i as resolveSqliteDatabaseFilePaths } from "./sqlite-files-eRv24eIu.mjs";
import { v as readAgentDatabaseDeletionSnapshot } from "./agent-deletion-journal-CZw0kGMX.mjs";
import { n as isPersistentOpenClawAgentDatabasePath, t as createOpenClawAgentDatabasePathMatcher } from "./openclaw-agent-db-registry-CCrn1pMl.mjs";
import fs from "node:fs";
//#region src/state/agent-deletion-discovery.ts
function hasSqliteFileFamily(pathname) {
	return resolveSqliteDatabaseFilePaths(pathname).some((file) => fs.lstatSync(file, { throwIfNoEntry: false }) !== void 0);
}
function hasSqliteArtifacts(directory) {
	try {
		return fs.readdirSync(directory).some((name) => /\.(?:sqlite3?|db)(?:-(?:wal|shm|journal))?$/iu.test(name));
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
		return fs.lstatSync(directory, { throwIfNoEntry: false }) !== void 0;
	}
}
/** Recorded surviving owners can share retained files; directory-name inference cannot. */
function createAgentDatabaseDeletionClassifier(params) {
	const entries = params.retainedDeletions;
	const samePath = createOpenClawAgentDatabasePathMatcher();
	const recorded = params.artifactDirectories ?? [...params.configuredAgentDatabaseTargets, ...params.registeredAgentDatabases];
	return (pathname, agentId) => {
		if (entries === "unavailable") return entries;
		const deletion = entries.find((entry) => entry.agentId === agentId || (params.artifactDirectories ? [entry.agentDir] : entry.databasePaths).some((file) => samePath(file, pathname)));
		if (!deletion) return;
		const surviving = recorded.some((target) => !entries.some((entry) => entry.agentId === normalizeAgentId(target.agentId)) && samePath(target.path, pathname) && (params.artifactDirectories !== void 0 || isPersistentOpenClawAgentDatabasePath(target.path, params.env) && (params.configuredAgentDatabaseTargets.includes(target) || isPathInside(fs.realpathSync.native(resolveStateDir(params.env)), fs.realpathSync.native(target.path)))));
		return agentId === deletion.agentId || !surviving ? deletion : void 0;
	};
}
function createRetainedAgentDatabaseMatcher(env, readConfiguredTargets, namespace = "database") {
	const snapshot = readAgentDatabaseDeletionSnapshot(env);
	const agentDirectories = namespace !== "database" && namespace.kind === "agent-directory";
	if (!snapshot && namespace !== "database") {
		const unavailable = [resolveOpenClawStateSqlitePath(env), ...namespace.readDatabasePaths()].some(hasSqliteFileFamily) || agentDirectories && readConfiguredTargets().some(({ path }) => hasSqliteArtifacts(path));
		return (pathname, _agentId) => unavailable || agentDirectories && hasSqliteArtifacts(pathname);
	}
	const retainedDeletions = snapshot?.retainedDeletions ?? "unavailable";
	if (retainedDeletions === "unavailable" || retainedDeletions.length === 0) return (_pathname, _agentId) => retainedDeletions === "unavailable";
	const configured = readConfiguredTargets();
	return createAgentDatabaseDeletionClassifier({
		env,
		retainedDeletions,
		configuredAgentDatabaseTargets: configured,
		artifactDirectories: agentDirectories ? configured : void 0,
		registeredAgentDatabases: snapshot?.registeredAgentDatabases ?? []
	});
}
//#endregion
export { createRetainedAgentDatabaseMatcher as n, createAgentDatabaseDeletionClassifier as t };
