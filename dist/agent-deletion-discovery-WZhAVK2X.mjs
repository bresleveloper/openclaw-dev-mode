import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { c as resolveOpenClawAgentSqlitePath, i as isPersistentOpenClawAgentDatabasePath, n as createOpenClawAgentDatabasePathMatcher } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { a as resolveSqliteDatabaseFilePaths } from "./sqlite-files-N5UzY_DG.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import "./session-key-CSDERtm3.mjs";
import { r as readAgentDatabaseDeletionSnapshot } from "./agent-deletion-journal.read-BzRzPvBo.mjs";
import { a as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./session-sqlite-target-paths-DufdR-Na.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/state/agent-deletion-discovery.ts
/** Read completed retained identities through the shared-state worker. */
async function listRetainedDeletedAgentIdsForCleanup(env) {
	const retained = (await executeExistingOpenClawStateRead({ env }, {
		type: "agentDatabaseDeletion.snapshot",
		purpose: "runtime"
	}))?.snapshot.retainedDeletions;
	return new Set(retained?.status === "present" ? retained.entries.map((entry) => entry.agentId) : []);
}
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
	const artifactDirectories = params.artifactDirectories;
	const journal = params.retainedDeletions;
	const known = journal.status === "present" ? journal : journal.status === "unavailable" ? journal.known : void 0;
	const entries = known?.entries ?? [];
	const unknown = journal.status === "unavailable" ? "unavailable" : void 0;
	const samePath = createOpenClawAgentDatabasePathMatcher();
	const recorded = artifactDirectories ?? [...params.configuredAgentDatabaseTargets, ...params.registeredAgentDatabases];
	const heldPaths = !known ? [] : artifactDirectories ? known.held.flatMap((entry) => {
		const defaultDirectory = path.dirname(resolveOpenClawAgentSqlitePath({
			agentId: entry.agentId,
			env: params.env
		}));
		const recordedDirectory = path.dirname(entry.path);
		const canonicalAgentFile = path.basename(entry.path) === "openclaw-agent.sqlite";
		const directories = [{
			agentId: entry.agentId,
			path: defaultDirectory
		}, ...artifactDirectories.filter((directory) => normalizeAgentId(directory.agentId) === entry.agentId || canonicalAgentFile && samePath(directory.path, recordedDirectory))];
		if (canonicalAgentFile && [params.env.OPENCLAW_AGENT_DIR, params.env.PI_CODING_AGENT_DIR].some((directory) => directory?.trim() && samePath(resolveUserPath(directory, params.env), recordedDirectory)) || canonicalAgentFile && path.basename(recordedDirectory) === "agent" && samePath(path.dirname(path.dirname(recordedDirectory)), path.dirname(path.dirname(defaultDirectory)))) directories.push({
			agentId: entry.agentId,
			path: recordedDirectory
		});
		return directories;
	}) : known.held;
	return (pathname, agentId) => {
		let logicalTargets = [];
		if (!artifactDirectories && agentId !== void 0) {
			const ownerId = normalizeAgentId(agentId);
			logicalTargets = params.configuredAgentDatabaseTargets.filter((target) => normalizeAgentId(target.agentId) === ownerId);
			if (logicalTargets.length === 0) logicalTargets = [...params.registeredAgentDatabases.filter((target) => normalizeAgentId(target.agentId) === ownerId), {
				agentId: ownerId,
				path: resolveUnsuffixedSqliteTargetFromSessionStorePath(pathname).path
			}];
		}
		if (heldPaths.some((entry) => artifactDirectories && entry.agentId === agentId || samePath(entry.path, pathname) || logicalTargets.some((target) => samePath(target.path, entry.path)))) return "held";
		const deletion = entries.find((entry) => entry.agentId === agentId || (artifactDirectories ? [entry.agentDir] : entry.databasePaths).some((file) => samePath(file, pathname)));
		if (!deletion) return unknown;
		const surviving = recorded.some((target) => !entries.some((entry) => entry.agentId === normalizeAgentId(target.agentId)) && samePath(target.path, pathname) && (artifactDirectories !== void 0 || isPersistentOpenClawAgentDatabasePath(target.path, params.env) && (params.configuredAgentDatabaseTargets.includes(target) || isPathInside(fs.realpathSync.native(resolveStateDir(params.env)), fs.realpathSync.native(target.path)))));
		return agentId === deletion.agentId || !surviving ? deletion : unknown;
	};
}
function createRetainedAgentDatabaseMatcher(env, readConfiguredTargets, namespace = "database", purpose = "maintenance") {
	return createRetainedAgentDatabaseMatcherFromSnapshot(env, readConfiguredTargets, readAgentDatabaseDeletionSnapshot(env, purpose), namespace, purpose);
}
function createRetainedAgentDatabaseMatcherFromSnapshot(env, readConfiguredTargets, snapshot, namespace = "database", purpose = "maintenance") {
	const agentDirectories = namespace !== "database" && namespace.kind === "agent-directory";
	if (!snapshot && namespace !== "database" && purpose === "maintenance") {
		const unavailable = [resolveOpenClawStateSqlitePath(env), ...namespace.readDatabasePaths()].some(hasSqliteFileFamily) || agentDirectories && readConfiguredTargets().some((target) => hasSqliteArtifacts(target.path));
		return (pathname, _agentId) => unavailable || agentDirectories && hasSqliteArtifacts(pathname) ? "unavailable" : void 0;
	}
	const retainedDeletions = snapshot?.retainedDeletions;
	if (!retainedDeletions || retainedDeletions.status !== "present" && !(retainedDeletions.status === "unavailable" && retainedDeletions.known)) return (_pathname, _agentId) => purpose === "maintenance" && (!retainedDeletions || retainedDeletions.status === "unavailable") ? "unavailable" : void 0;
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
export { listRetainedDeletedAgentIdsForCleanup as a, hasSqliteFileFamily as i, createRetainedAgentDatabaseMatcher as n, createRetainedAgentDatabaseMatcherFromSnapshot as r, createAgentDatabaseDeletionClassifier as t };
