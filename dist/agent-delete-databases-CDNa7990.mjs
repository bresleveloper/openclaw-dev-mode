import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { _ as withSqliteReadOnlyWorkerScope, f as runSqliteReadOnlyOperation } from "./sqlite-readonly-worker-C2DDLw_y.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { c as resolveOpenClawAgentSqlitePath, s as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { a as resolveSqliteDatabaseFilePaths } from "./sqlite-files-N5UzY_DG.mjs";
import { n as captureOpenClawStateReadWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import "./session-key-CSDERtm3.mjs";
import { A as normalizeAgentDirRegistryPath, M as resolveRegisteredAgentIdForDir, N as unregisterResolvedAgentDir, a as resolveAgentDir, j as registerResolvedAgentDir, k as isPathOwnedByAnotherRegisteredAgent } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { r as assertNoAgentDatabaseLeasesAsync } from "./agent-deletion-journal-DpYVtbBb.mjs";
import { u as prepareOpenClawAgentDatabaseRegistrySnapshotRead } from "./openclaw-agent-db-registry-listing-DCh0nEqi.mjs";
import { a as closeOpenClawAgentDatabaseByPathAsync } from "./openclaw-agent-db-lifecycle-Dodvmz4L.mjs";
import "./openclaw-agent-db-_fC-kf1x.mjs";
import { r as closeAuthProfileReadPool } from "./sqlite-read-pool-DiFi5Ms3.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { t as memorySessionActorOwners } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { t as findOverlappingWorkspaceAgentIds } from "./agent-delete-safety-C-K2bAs7.mjs";
import { n as assertAgentSessionStoreDeletionBlocker } from "./agent-delete-session-store-safety-ChjTvLx2.mjs";
import { n as prepareAgentSessionStoreDeletionSafety, t as assertAgentSessionStoreDeletionTargetsCurrent } from "./agent-delete-session-store-safety.targets-CZCCiYwJ.mjs";
import path from "node:path";
//#region src/agents/agent-delete-databases.ts
function resolveAgentDeleteDatabasePaths(agentId, agentDir, registeredPaths, env) {
	return /* @__PURE__ */ new Set([
		resolveOpenClawAgentSqlitePath({
			agentId,
			env
		}),
		resolveOpenClawAgentSqlitePath({
			agentId,
			env,
			path: path.join(agentDir, "openclaw-agent.sqlite")
		}),
		...registeredPaths
	]);
}
/** Settle admitted usage cleanup before the journal retires native execution owners. */
async function drainAgentDeleteDatabaseWork(deletion, options = {}) {
	const { retireSessionHistoryWorkerDatabases } = await import("./session-transcript-worker-resources-z3zoJvTq.mjs");
	const { agentId, agentDir, databasePaths } = deletion.entry;
	await deletion.assertCurrentAsync();
	await retireSessionHistoryWorkerDatabases({
		agentId,
		paths: [...resolveAgentDeleteDatabasePaths(agentId, agentDir, databasePaths, options.env), resolveIncognitoOpenClawAgentSqlitePath({
			agentId,
			env: options.env
		})]
	});
	await deletion.assertCurrentAsync();
}
async function retireAgentDeleteRuntime(deletion, agentDirs) {
	const agentId = deletion.entry.agentId;
	const { retirePreparedModelRuntimeAgent } = await import("./prepared-model-runtime-Dd6wQg9H.mjs");
	await deletion.assertCurrentAsync();
	await retirePreparedModelRuntimeAgent({
		agentId,
		agentDirs
	});
	await deletion.assertCurrentAsync();
}
async function finishAgentDeleteDatabases(params) {
	const { deletion, agentDir, deleteFiles, complete } = params;
	await deletion.assertCurrentAsync();
	if (!complete) return;
	const agentId = deletion.entry.agentId;
	unregisterResolvedAgentDir({
		agentId,
		agentDir
	});
	await deletion.finish({ unregisterDatabases: deleteFiles });
}
/** Destructive planning includes every registered owner, regardless of runtime schema readiness. */
async function readAgentDeleteDatabaseRegistry(options = {}) {
	const read = await prepareOpenClawAgentDatabaseRegistrySnapshotRead({
		...options,
		includeIncompatibleSchemaVersions: true,
		fresh: true
	}).read();
	read.assertCurrent();
	if (read.result.status !== "available") throw new Error("OpenClaw agent database registry is unavailable during deletion.");
	return read.result.entries;
}
function prepareJournaledAgentDirOwnership(cfg, agentId, agentDir) {
	for (const configuredAgentId of listAgentIds(cfg)) resolveAgentDir(cfg, configuredAgentId);
	if (resolveRegisteredAgentIdForDir(agentDir) !== void 0) return;
	registerResolvedAgentDir({
		agentId,
		agentDir
	});
}
/** Check before journaling: retaining the file alone would still fence its shared owner. */
async function assertAgentSessionStoreDeletionSafe(cfg, agentId, options = {}) {
	if (!cfg.session?.store?.trim()) return;
	const input = prepareAgentSessionStoreDeletionSafety(cfg, agentId, options.env ?? process.env);
	const context = captureOpenClawStateReadWorkerContext({
		path: options.database?.path ?? options.path,
		env: input.env
	});
	const reply = await executeExistingOpenClawStateRead({
		path: context.admission.databasePath,
		env: context.environment
	}, {
		type: "agentDeletion.sessionStoreBlocker",
		input: {
			...input,
			databasePath: context.admission.databasePath,
			env: context.environment
		}
	}, {
		context,
		current: true
	});
	context.admission.assertCurrent();
	assertAgentSessionStoreDeletionTargetsCurrent(input.targets);
	if (reply && (!reply.ok || reply.type !== "agentDeletion.sessionStoreBlocker")) throw new Error("Unexpected agent session-store deletion safety result");
	let blocker = reply?.blocker;
	if (!reply) {
		const anchor = input.targets.candidates.find(({ identity }) => identity.key.startsWith("file:"));
		if (anchor) {
			const result = await withSqliteReadOnlyWorkerScope(() => runSqliteReadOnlyOperation(anchor.identity.canonicalPath, {
				type: "agentRetirement.sessionStoreBlocker",
				input
			}, {
				source: "canonical",
				expectedIdentity: anchor.identity.key,
				env: input.env
			}));
			context.admission.assertCurrent();
			assertAgentSessionStoreDeletionTargetsCurrent(input.targets);
			blocker = result.blocker;
		}
	}
	assertAgentSessionStoreDeletionBlocker(input.agentId, blocker);
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
async function prepareAgentDeleteDatabases(cfg, agentId, agentDir, options = {}, deletion) {
	const registeredDatabases = await readAgentDeleteDatabaseRegistry(options);
	const survivingDatabaseFilePaths = resolveSurvivingDatabaseFilePaths(registeredDatabases, agentId, options.env);
	const registeredDatabasePaths = resolveAgentDeleteDatabasePaths(agentId, agentDir, registeredDatabases.filter((entry) => normalizeAgentId(entry.agentId) === agentId).map((entry) => entry.path), options.env);
	for (const databasePath of registeredDatabasePaths) {
		if (deletion) await deletion.assertCurrentAsync();
		await closeOpenClawAgentDatabaseByPathAsync(databasePath, agentId);
	}
	if (deletion) await deletion.assertCurrentAsync();
	memorySessionActorOwners.closeDatabase({
		agentId,
		path: resolveIncognitoOpenClawAgentSqlitePath({
			agentId,
			env: options.env
		})
	});
	const databasePaths = [...registeredDatabasePaths].filter((pathname) => resolveSqliteDatabaseFilePaths(pathname).every((filePath) => !isPathOwnedBySurvivingAgent(cfg, agentId, filePath, survivingDatabaseFilePaths, options.env)));
	if (deletion) await deletion.assertCurrentAsync();
	for (const databasePath of databasePaths) closeAuthProfileReadPool({
		kind: "database",
		databasePath
	});
	if (deletion) await deletion.runWithWorker((scope, guard) => scope.execute({
		type: "agentDeletion.assertNoDatabaseLeases",
		input: { guard }
	}));
	else await assertNoAgentDatabaseLeasesAsync(agentId, options);
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
export { prepareAgentDeleteDatabases as a, resolveSurvivingDatabaseFilePaths as c, isPathOwnedBySurvivingAgent as i, retireAgentDeleteRuntime as l, drainAgentDeleteDatabaseWork as n, prepareJournaledAgentDirOwnership as o, finishAgentDeleteDatabases as r, readAgentDeleteDatabaseRegistry as s, assertAgentSessionStoreDeletionSafe as t };
