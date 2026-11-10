import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { s as throwSqliteLifecycleErrors } from "./sqlite-lifecycle-errors-Ca_9goHE.mjs";
import { i as getAdmittedSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { a as normalizeMainKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { n as prepareAgentDatabaseDeletionSnapshotRead, o as readAgentDeletionJournalStatusInWorker, r as readAgentDatabaseDeletionSnapshot } from "./agent-deletion-journal.read-BzRzPvBo.mjs";
import "./openclaw-agent-db-contract-BcoeqAm4.mjs";
import { s as listOpenClawRegisteredAgentDatabases } from "./openclaw-agent-db-registry-listing-DCh0nEqi.mjs";
import { a as closeOpenClawAgentDatabaseByPathAsync } from "./openclaw-agent-db-lifecycle-Dodvmz4L.mjs";
import { _ as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-CeDA0ojh.mjs";
import { a as isOpenClawAgentDatabaseOpen, u as withOpenClawAgentDatabaseAsync } from "./openclaw-agent-db-_fC-kf1x.mjs";
import "./openclaw-agent-db-registry-DuEPPF6m.mjs";
import { o as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-DJQA0Ssz.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { t as SessionStoreMigrationRequiredError } from "./migration-required-yTbtjJC4.mjs";
import { m as setCanonicalSqliteSessionMainKey, u as readStoredCanonicalSessionMainKey } from "./session-canonical-key-B7chVWi3.mjs";
import { n as resolveSqliteReadScope } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
import "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { a as resolveAllAgentSessionStoreTargetsSync, o as resolveConfiguredAgentDatabaseCandidatePaths, s as resolveConfiguredAgentDatabaseTargets, t as isConfiguredAgentDatabaseTarget } from "./targets-DJGC6v85.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { r as createRetainedAgentDatabaseMatcherFromSnapshot, t as createAgentDatabaseDeletionClassifier } from "./agent-deletion-discovery-WZhAVK2X.mjs";
import { r as formatDoctorStateRepairFailure } from "./state-repair-message-BvQp5mZ3.mjs";
import { t as settleCurrentReadPreparations } from "./current-read-authority-CySCga_Z.mjs";
import { s as recordStartupMigrationWarnings } from "./state-migrations.messages-CB0bXmSE.mjs";
import { c as listLegacySessionTranscriptFiles, d as shouldFilterLegacySessionRecordsByTarget, l as readLegacySessionStoreEntries, s as isLegacySessionRecordOwnedByTarget } from "./session-sqlite-transcript-verification-typ0QegX.mjs";
import { c as readStaleDeferredPluginSessionImport, o as readDeferredPluginSessionImport } from "./deferred-plugin-session-sources-Bck_1DwX.mjs";
import { t as isExistingLegacySessionStore } from "./legacy-store-source-CIkybz71.mjs";
import fs from "node:fs";
import path from "node:path";
//#region src/config/sessions/session-canonical-key-read.ts
/** Checks the startup contract without joining the writable database lifecycle. */
function isCanonicalSqliteSessionMainKeyCurrent(options, mainKey) {
	const canonicalMainKey = normalizeMainKey(mainKey);
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		if (getAdmittedSqliteSchemaFacts(database.db)?.userVersion !== 27) return false;
		return readStoredCanonicalSessionMainKey(database) === canonicalMainKey;
	}, options);
	return result.found && result.value;
}
//#endregion
//#region src/config/sessions/startup-migration.ts
function assertSessionStoreMigrationComplete(params) {
	const env = params.env ?? process.env;
	const readOptions = {
		env,
		registeredDatabases: params.registeredDatabases
	};
	const targets = (params.targets ?? resolveAllAgentSessionStoreTargetsSync(params.cfg, readOptions)).filter((target) => !target.agentId || !readAgentDatabaseAdmissionRefusal(target.agentId, { env }));
	const sourcesByPath = /* @__PURE__ */ new Map();
	for (const target of targets) {
		const sourcePath = path.resolve(target.storePath);
		sourcesByPath.set(sourcePath, [...sourcesByPath.get(sourcePath) ?? [], target]);
	}
	const legacySources = [...sourcesByPath].filter(([storePath]) => isExistingLegacySessionStore(storePath));
	if (legacySources.length === 0) return;
	const deletionSnapshot = readAgentDatabaseDeletionSnapshot(env, params.operation === "doctor" ? "maintenance" : "runtime");
	const classifyDeletion = deletionSnapshot && createAgentDatabaseDeletionClassifier({
		env,
		retainedDeletions: deletionSnapshot.retainedDeletions,
		registeredAgentDatabases: deletionSnapshot.registeredAgentDatabases,
		configuredAgentDatabaseTargets: resolveConfiguredAgentDatabaseTargets(params.cfg, readOptions)
	});
	const legacyStore = legacySources.find(([storePath, candidates]) => {
		const owners = /* @__PURE__ */ new Map();
		for (const target of candidates) {
			if (!target.agentId) return true;
			const destination = resolveSqliteTargetFromSessionStorePath(target.storePath, {
				agentId: target.agentId,
				...readOptions
			}).path;
			const deletion = classifyDeletion?.(storePath, target.agentId) ?? classifyDeletion?.(destination, target.agentId);
			const staleImport = readStaleDeferredPluginSessionImport({
				target: {
					...target,
					agentId: target.agentId
				},
				sqlitePath: destination,
				env
			});
			if (staleImport) recordStartupMigrationWarnings([`Session import receipt belongs to another database; serving live SQLite at ${destination}. Run openclaw doctor --fix to recover retained history.`]);
			const retained = deletion !== void 0 && deletion !== "unavailable" || Boolean(staleImport);
			owners.set(`${target.agentId}\0${destination}`, {
				target: {
					...target,
					agentId: target.agentId
				},
				destination,
				retained,
				imported: !retained && readDeferredPluginSessionImport({
					cfg: params.cfg,
					target: {
						...target,
						agentId: target.agentId
					},
					sqlitePath: destination,
					env,
					purpose: "readiness"
				}) !== void 0
			});
		}
		if ([...owners.values()].every(({ target, retained, imported }) => (imported || retained) && !shouldFilterLegacySessionRecordsByTarget(target))) return false;
		const issues = [];
		const source = readLegacySessionStoreEntries({ storePath }, issues);
		if (issues.some((issue) => issue.code !== "entry_invalid") || !source.bytes) return [...owners.values()].some(({ imported, retained }) => !imported && !retained);
		const required = new Set(source.entries.length === 0 ? owners.values() : []);
		for (const sessionKey of [...source.entries.map((entry) => entry.sessionKey), ...issues.flatMap((issue) => issue.sessionKey ? [issue.sessionKey] : [])]) {
			const matches = [...owners.values()].filter(({ target }) => !shouldFilterLegacySessionRecordsByTarget(target) || isLegacySessionRecordOwnedByTarget(params.cfg, target, sessionKey));
			if (matches.length !== 1) return true;
			required.add(matches[0]);
		}
		let hasUnindexedHistory;
		return [...required].some(({ target, destination, retained, imported }) => {
			if (imported || retained && (source.entries.length > 0 || !shouldFilterLegacySessionRecordsByTarget(target))) return false;
			if (source.entries.length === 0 && !fs.existsSync(destination)) {
				hasUnindexedHistory ??= listLegacySessionTranscriptFiles(path.dirname(storePath)).length > 0;
				if (!hasUnindexedHistory) return false;
			}
			return true;
		});
	})?.[0];
	if (legacyStore) throw new SessionStoreMigrationRequiredError(params.operation === "doctor" ? formatDoctorStateRepairFailure(`Legacy session store requires migration at ${legacyStore}`, "Repair the retained source using the migration report's named file and validation error, preserving the original history.") : `Legacy session store requires migration: ${legacyStore}. Run "${formatCliCommand("openclaw doctor --fix", env)}" against the same state/config before starting OpenClaw.`);
}
/** Maintains existing stores, optionally handing each live database to its runtime owner. */
async function runSessionStartupMigration(params) {
	params.assertCurrent?.();
	const env = cloneEnvWithPlatformSemantics(params.env ?? process.env);
	const deletionRead = prepareAgentDatabaseDeletionSnapshotRead({ env }, "runtime");
	const resolveTargets = params.deps?.resolveAllAgentSessionStoreTargetsSync ?? resolveAllAgentSessionStoreTargetsSync;
	const admittedTargets = () => resolveTargets(params.cfg, {
		env,
		agentIds: params.agentIds
	}).filter((target) => (!params.agentIds || params.agentIds.has(target.agentId)) && !readAgentDatabaseAdmissionRefusal(target.agentId, { env }));
	const targets = admittedTargets();
	assertSessionStoreMigrationComplete({
		cfg: params.cfg,
		env,
		targets
	});
	const { assertAcpSessionKeysMigratedForStartup, assertEmbeddedAcpMetadataMigratedForStartup } = await import("./session-meta-startup-VjsCYLf0.mjs");
	const migrateLegacyMain = params.deps?.migrateLegacyMainSessionKeys ?? (await import("./legacy-main-session-migration-DmVfV7wa.mjs")).migrateLegacyMainSessionKeys;
	const [, result] = await settleCurrentReadPreparations([params.agentIds ? void 0 : assertAcpSessionKeysMigratedForStartup(params.cfg, env, targets.map((target) => target.agentId), void 0, params.assertCurrent), migrateLegacyMain({
		cfg: params.cfg,
		env,
		mode: "detect"
	})]);
	params.assertCurrent?.();
	if (result.warnings.length > 0) params.log.warn(`session: retired main-agent session migration warnings:\n${result.warnings.map((warning) => `- ${warning}`).join("\n")}`);
	const databases = /* @__PURE__ */ new Set();
	const coldCloses = /* @__PURE__ */ new Set();
	let interruptedSessions = 0;
	const registeredDatabases = new Set(listOpenClawRegisteredAgentDatabases({ env }).map((entry) => `${entry.agentId}\0${entry.path}`));
	const configuredTargets = resolveConfiguredAgentDatabaseCandidatePaths(params.cfg, { env }).map((pathname) => ({ path: pathname }));
	const tasks = targets.map((target) => async () => {
		params.assertCurrent?.();
		const options = toDatabaseOptions(resolveSqliteReadScope({
			...target,
			env
		}));
		const databasePath = resolveOpenClawAgentSqlitePath(options);
		if (databases.has(databasePath) || !fs.existsSync(databasePath)) return;
		databases.add(databasePath);
		const runUnlessDeleted = (operation) => deletionRead.withCurrentSnapshot((snapshot) => {
			params.assertCurrent?.();
			if (typeof createRetainedAgentDatabaseMatcherFromSnapshot(env, () => resolveConfiguredAgentDatabaseTargets(params.cfg, {
				env,
				registeredDatabases: (snapshot?.registeredAgentDatabases ?? []).filter((entry) => entry.schemaVersion === 27)
			}), snapshot, "database", "runtime")(databasePath, options.agentId) === "object") {
				params.log.info(`session: skipping deleted agent database for ${options.agentId} at ${databasePath} (cleanup complete); run "${formatCliCommand("openclaw doctor --fix", env)}" for explicit restoration guidance`);
				return false;
			}
			if (registeredDatabases.has(`${options.agentId}\0${databasePath}`) && !isConfiguredAgentDatabaseTarget(configuredTargets, options.agentId, databasePath)) return false;
			return operation().then(() => true);
		});
		const deletion = await readAgentDeletionJournalStatusInWorker(options.agentId, { env });
		params.assertCurrent?.();
		if (deletion !== "absent") {
			params.log.info(`session: skipping deleted agent database for ${options.agentId} (${deletion === "complete" ? "cleanup complete" : "cleanup pending; retry agent deletion"})`);
			return;
		}
		let alreadyOpen;
		let handedOff = false;
		try {
			const { repairLegacySessionRunOutcomes } = await import("./session-entry-rewrite-bA9OmoZ5.mjs");
			if (!await runUnlessDeleted(async () => {
				alreadyOpen = isOpenClawAgentDatabaseOpen(databasePath);
				const mainKey = params.cfg.session?.mainKey;
				try {
					if (!registeredDatabases.has(`${options.agentId}\0${databasePath}`) || !isCanonicalSqliteSessionMainKeyCurrent(options, mainKey)) await withOpenClawAgentDatabaseAsync(options, (database) => setCanonicalSqliteSessionMainKey(database, mainKey), params.assertCurrent);
				} catch (error) {
					params.assertCurrent?.();
					params.log.warn(`session: SQLite startup maintenance failed for ${target.agentId}; continuing: ${String(error)}`);
				}
				interruptedSessions += await repairLegacySessionRunOutcomes({
					agentId: options.agentId,
					env,
					storePath: databasePath
				}, () => params.assertCurrent?.());
			})) return;
			const { certifySessionCanonicalValidationPending } = await import("./session-canonical-validation-readiness-C9N7xd0g.mjs");
			const { withSqliteCanonicalValidationWorker } = await import("./session-accessor.sqlite-reclamation-worker-CSLcD2qD.mjs");
			params.assertCurrent?.();
			if (!await runUnlessDeleted(() => withSqliteCanonicalValidationWorker((withWorker) => certifySessionCanonicalValidationPending(options, withWorker, params.assertCurrent)))) return;
			params.assertCurrent?.();
			await runUnlessDeleted(async () => {
				params.assertCurrent?.();
				if (params.agentIds) await assertAcpSessionKeysMigratedForStartup(params.cfg, env, targets.map((admittedTarget) => admittedTarget.agentId), options, params.assertCurrent);
				assertEmbeddedAcpMetadataMigratedForStartup(options);
			});
			const handoffDatabase = params.handoffDatabase;
			if (handoffDatabase) await runUnlessDeleted(async () => {
				await handoffDatabase(options);
				params.assertCurrent?.();
				handedOff = true;
			});
		} finally {
			if (alreadyOpen === false && !handedOff) coldCloses.add(databasePath);
		}
	});
	const { withSqliteCanonicalValidationWorkerPool } = await import("./session-accessor.sqlite-canonical-worker-pool-AcTowZFu.mjs");
	const errors = /* @__PURE__ */ new Set();
	try {
		await withSqliteCanonicalValidationWorkerPool(env, async () => {
			const { hasError, firstError } = await runTasksWithConcurrency({
				tasks,
				limit: 2,
				errorMode: "stop"
			});
			if (hasError) {
				errors.add(firstError);
				throw firstError;
			}
		});
	} catch (error) {
		errors.add(error);
	}
	for (const databasePath of coldCloses) try {
		await closeOpenClawAgentDatabaseByPathAsync(databasePath);
	} catch (error) {
		errors.add(error);
	}
	throwSqliteLifecycleErrors([...errors], "Session startup migration and cleanup failed");
	if (interruptedSessions > 0) params.log.info(`session: normalized ${interruptedSessions} legacy run(s) to interrupted`);
	params.assertCurrent?.();
}
//#endregion
export { runSessionStartupMigration as n, assertSessionStoreMigrationComplete as t };
