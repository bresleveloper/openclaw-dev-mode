import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { i as normalizeMainKey } from "./session-key-CUi_tcgF.mjs";
import "./session-key-CBvmC8zz.mjs";
import { i as getNodeSqliteKysely, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { n as StartupMaintenanceRequiredError } from "./startup-maintenance-required-OfhrhQoQ.mjs";
import { a as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-C2YxM4Tj.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import "./openclaw-agent-db-contract-DzsRD6Fl.mjs";
import { d as readAgentDatabaseAdmissionRefusal } from "./agent-database-admission-BFwcs62N.mjs";
import { o as readAgentDeletionJournal, v as readAgentDatabaseDeletionSnapshot } from "./agent-deletion-journal-CZw0kGMX.mjs";
import { o as closeOpenClawAgentDatabaseByPathAsync } from "./openclaw-agent-db-lifecycle-D7S9DdJC.mjs";
import { c as isOpenClawAgentDatabaseOpen, m as withOpenClawAgentDatabaseAsync } from "./openclaw-agent-db-CaQAStOA.mjs";
import { i as listOpenClawRegisteredAgentDatabases } from "./openclaw-agent-db-registry-listing-CHFiKgU_.mjs";
import "./openclaw-agent-db-registry-CCrn1pMl.mjs";
import { n as withOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-IBx2zWDG.mjs";
import { n as formatDoctorStateRepairFailure } from "./state-repair-message-B5Bu99oR.mjs";
import { s as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Dcog4O-M.mjs";
import { g as toDatabaseOptions, l as resolveSqliteReadScope } from "./session-accessor.sqlite-scope-DHC66DLY.mjs";
import { p as setCanonicalSqliteSessionMainKey } from "./session-canonical-key-BBylVEaq.mjs";
import { a as resolveAllAgentSessionStoreTargetsSync, l as resolveSessionStoreTargets, s as resolveConfiguredAgentDatabaseTargets } from "./targets-Dmb8-YXN.mjs";
import { t as createAgentDatabaseDeletionClassifier } from "./agent-deletion-discovery-CV9Iu45w.mjs";
import "./openclaw-database-preflight-agent-scheduler-DTKyg25c.mjs";
import { t as migrateLegacyMainSessionKeys } from "./legacy-main-session-migration-C7F4XLva.mjs";
import { c as isLegacySessionRecordOwnedByTarget, f as shouldFilterLegacySessionRecordsByTarget, l as listLegacySessionTranscriptFiles, u as readLegacySessionStoreEntries } from "./doctor-session-sqlite-verification-DCoyJ1F8.mjs";
import { s as readDeferredPluginSessionImport } from "./deferred-plugin-session-sources-BLTN7DHz.mjs";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
//#region src/config/sessions/migration-required.ts
/** Legacy history requires an explicit Doctor import, never automatic failure triage. */
var SessionStoreMigrationRequiredError = class extends StartupMaintenanceRequiredError {
	constructor(message) {
		super("legacy-session-store", message);
		this.name = "SessionStoreMigrationRequiredError";
	}
};
//#endregion
//#region src/config/sessions/session-canonical-key-read.ts
/** Checks the startup contract without joining the writable database lifecycle. */
function isCanonicalSqliteSessionMainKeyCurrent(options, mainKey) {
	const canonicalMainKey = normalizeMainKey(mainKey);
	const result = withOpenClawAgentDatabaseReadOnly((database) => {
		const db = getNodeSqliteKysely(database.db);
		if (executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("schema_meta").select("schema_version").where("meta_key", "=", "primary"))?.schema_version !== 23) return false;
		return executeSqliteQueryTakeFirstSync(database.db, db.selectFrom("session_key_contract").select("main_key").where("id", "=", 1))?.main_key === canonicalMainKey;
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
	const legacyRootStore = path.join(resolveStateDir(env), "sessions", "sessions.json");
	const legacyTargets = fs.existsSync(legacyRootStore) ? resolveSessionStoreTargets(params.cfg, { allAgents: true }, readOptions).map((target) => ({
		agentId: target.agentId,
		sqlitePath: resolveSqliteTargetFromSessionStorePath(target.storePath, {
			agentId: target.agentId,
			...readOptions
		}).path,
		storePath: legacyRootStore
	})) : [];
	const sources = [...legacyTargets.length > 0 ? legacyTargets : [{ storePath: legacyRootStore }], ...targets];
	const sourcesByPath = /* @__PURE__ */ new Map();
	for (const target of sources) {
		const sourcePath = path.resolve(target.storePath);
		sourcesByPath.set(sourcePath, [...sourcesByPath.get(sourcePath) ?? [], target]);
	}
	const legacySources = [...sourcesByPath].filter(([storePath]) => !storePath.endsWith(".sqlite") && fs.existsSync(storePath));
	if (legacySources.length === 0) return;
	const deletionSnapshot = readAgentDatabaseDeletionSnapshot(env);
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
			const destination = target.sqlitePath ?? resolveSqliteTargetFromSessionStorePath(target.storePath, {
				agentId: target.agentId,
				...readOptions
			}).path;
			const deletion = classifyDeletion?.(storePath, target.agentId) ?? classifyDeletion?.(destination, target.agentId);
			owners.set(`${target.agentId}\0${destination}`, {
				target: {
					...target,
					agentId: target.agentId
				},
				destination,
				retained: deletion !== void 0 && deletion !== "unavailable"
			});
		}
		if ([...owners.values()].every(({ target, retained }) => retained && !shouldFilterLegacySessionRecordsByTarget(target))) return false;
		const issues = [];
		const source = readLegacySessionStoreEntries({ storePath }, issues);
		if (issues.some((issue) => issue.code !== "entry_invalid") || !source.bytes) return true;
		const sourceSha256 = createHash("sha256").update(source.bytes).digest("hex");
		const required = new Set(source.entries.length === 0 ? owners.values() : []);
		for (const sessionKey of [...source.entries.map((entry) => entry.sessionKey), ...issues.flatMap((issue) => issue.sessionKey ? [issue.sessionKey] : [])]) {
			const matches = [...owners.values()].filter(({ target }) => !shouldFilterLegacySessionRecordsByTarget(target) || isLegacySessionRecordOwnedByTarget(params.cfg, target, sessionKey));
			if (matches.length !== 1) return true;
			required.add(matches[0]);
		}
		let hasUnindexedHistory;
		return [...required].some(({ target, destination, retained }) => {
			if (retained && (source.entries.length > 0 || !shouldFilterLegacySessionRecordsByTarget(target))) return false;
			const receipt = readDeferredPluginSessionImport({
				cfg: params.cfg,
				target,
				sqlitePath: destination,
				env,
				purpose: "readiness"
			});
			if (!receipt && source.entries.length === 0 && !fs.existsSync(destination)) {
				hasUnindexedHistory ??= listLegacySessionTranscriptFiles(path.dirname(storePath)).length > 0;
				if (!hasUnindexedHistory) return false;
			}
			return !receipt || receipt.sources.find((entry) => path.resolve(entry.path) === storePath)?.identity.sha256 !== sourceSha256;
		});
	})?.[0];
	if (legacyStore) throw new SessionStoreMigrationRequiredError(params.operation === "doctor" ? formatDoctorStateRepairFailure(`Legacy session store requires migration at ${legacyStore}`, "Repair the retained source using the migration report's named file and validation error, preserving the original history.") : `Legacy session store requires migration: ${legacyStore}. Run "${formatCliCommand("openclaw doctor --fix", env)}" against the same state/config before starting OpenClaw.`);
}
/** Maintains existing stores, optionally handing each live database to its runtime owner. */
async function runSessionStartupMigration(params) {
	params.assertCurrent?.();
	const env = params.env ?? process.env;
	const resolveTargets = params.deps?.resolveAllAgentSessionStoreTargetsSync ?? resolveAllAgentSessionStoreTargetsSync;
	const admittedTargets = () => resolveTargets(params.cfg, { env }).filter((target) => (!params.agentIds || params.agentIds.has(target.agentId)) && !readAgentDatabaseAdmissionRefusal(target.agentId, { env }));
	const targets = admittedTargets();
	assertSessionStoreMigrationComplete({
		cfg: params.cfg,
		env,
		targets
	});
	const result = await (params.deps?.migrateLegacyMainSessionKeys ?? migrateLegacyMainSessionKeys)({
		cfg: params.cfg,
		env,
		mode: "detect"
	});
	params.assertCurrent?.();
	if (result.warnings.length > 0) params.log.warn(`session: retired main-agent session migration warnings:\n${result.warnings.map((warning) => `- ${warning}`).join("\n")}`);
	const databases = /* @__PURE__ */ new Set();
	const registeredDatabases = new Set(listOpenClawRegisteredAgentDatabases({ env }).map((entry) => `${entry.agentId}\0${entry.path}`));
	const tasks = targets.map((target) => async () => {
		params.assertCurrent?.();
		const options = toDatabaseOptions(resolveSqliteReadScope({
			...target,
			env
		}));
		const databasePath = resolveOpenClawAgentSqlitePath(options);
		if (databases.has(databasePath) || !fs.existsSync(databasePath)) return;
		databases.add(databasePath);
		const deletion = readAgentDeletionJournal(options.agentId, { env });
		if (deletion) {
			params.log.info(`session: skipping deleted agent database for ${options.agentId} (${deletion.cleanupCompleted ? "cleanup complete" : "cleanup pending; retry agent deletion"})`);
			return;
		}
		const alreadyOpen = isOpenClawAgentDatabaseOpen(databasePath);
		let handedOff = false;
		try {
			try {
				const mainKey = params.cfg.session?.mainKey;
				if (!registeredDatabases.has(`${options.agentId}\0${databasePath}`) || !isCanonicalSqliteSessionMainKeyCurrent(options, mainKey)) await withOpenClawAgentDatabaseAsync(options, (database) => setCanonicalSqliteSessionMainKey(database, mainKey), params.assertCurrent);
			} catch (error) {
				params.assertCurrent?.();
				params.log.warn(`session: SQLite startup maintenance failed for ${target.agentId}; continuing: ${String(error)}`);
			}
			const { certifySessionCanonicalValidationPending } = await import("./session-canonical-validation-readiness-DvYAlpmU.mjs");
			const { withSqliteCanonicalValidationWorker } = await import("./session-accessor.sqlite-reclamation-worker-CNySfkyn.mjs");
			params.assertCurrent?.();
			await withSqliteCanonicalValidationWorker((withWorker) => certifySessionCanonicalValidationPending(options, withWorker, params.assertCurrent));
			params.assertCurrent?.();
			if (params.handoffDatabase) {
				params.assertCurrent?.();
				await params.handoffDatabase(options);
				params.assertCurrent?.();
				handedOff = true;
			}
		} finally {
			if (!alreadyOpen && !handedOff) await closeOpenClawAgentDatabaseByPathAsync(databasePath);
		}
	});
	const { withSqliteCanonicalValidationWorkerPool } = await import("./session-accessor.sqlite-canonical-worker-pool-CSsXMOFQ.mjs");
	await withSqliteCanonicalValidationWorkerPool(env, async () => {
		const { hasError, firstError } = await runTasksWithConcurrency({
			tasks,
			limit: 2,
			errorMode: "stop"
		});
		if (hasError) throw firstError;
	});
	params.assertCurrent?.();
}
//#endregion
export { runSessionStartupMigration as n, assertSessionStoreMigrationComplete as t };
