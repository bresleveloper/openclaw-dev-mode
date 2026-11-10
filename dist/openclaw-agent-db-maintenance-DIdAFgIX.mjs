import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-QlwTsE6j.mjs";
import { r as enableNodeSqliteKyselyStatementCache, t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { t as OPENCLAW_AGENT_SCHEMA_SQL } from "./openclaw-agent-schema-BKBD8edk.mjs";
import { l as invalidateSqliteSchemaFacts } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import "./kysely-sync-9fPQaMlh.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { h as getAgentDeletionDatabaseCleanup } from "./openclaw-agent-db-resources-DIwq7LM6.mjs";
import { t as SqliteSchemaMismatchError } from "./sqlite-schema-issues-BnRd2KGO.mjs";
import { r as readExistingAgentSchemaMeta } from "./openclaw-agent-db-metadata-90thy9YD.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-Q7gNRxhK.mjs";
import "./session-key-CSDERtm3.mjs";
import { g as repairDoctorSqliteIndexCorruption } from "./openclaw-state-db-BtDOU_3j.mjs";
import { t as configureSqliteMaintenanceCache } from "./sqlite-maintenance-cache-AYpxl8JZ.mjs";
import "./openclaw-agent-db-contract-BcoeqAm4.mjs";
import { r as assertAgentDatabaseMaintenanceAuthority, u as invalidateOpenClawAgentDatabaseIntegrityBeforeMutation } from "./openclaw-agent-db-lease-Brvd0WI4.mjs";
import { r as assertOpenClawAgentSchemaContains } from "./openclaw-agent-db-schema-helpers-DZw0ltGv.mjs";
import { i as assertSupportedAgentSchemaVersion, r as assertExistingAgentSchemaOwner } from "./openclaw-agent-db-schema-read-CX4aGKRI.mjs";
import { i as ensureOpenClawAgentDatabaseSchemaSteps } from "./openclaw-agent-db-schema-BUhCxlqc.mjs";
import { t as AGENT_FTS_SCHEMAS } from "./openclaw-agent-fts-schema-BEP0rp_S.mjs";
import { t as runSqliteIntegrityOperationInWorker } from "./sqlite-integrity-operation-B18PJAFa.mjs";
//#region src/state/openclaw-agent-db-maintenance.ts
const agentDbLog = createSubsystemLogger("state/agent-db");
/** Require exact agent ownership without requiring the latest schema. */
function assertOpenClawAgentDatabaseOwner(database, options) {
	invalidateSqliteSchemaFacts(database);
	const agentId = normalizeAgentId(options.agentId);
	const metadata = readExistingAgentSchemaMeta(database);
	if (!metadata) throw new SqliteSchemaMismatchError(`OpenClaw agent database ${options.pathname} has no schema ownership metadata. Run openclaw doctor --fix to inspect and repair its ownership.`);
	assertExistingAgentSchemaOwner(metadata, agentId, options.pathname);
	if (metadata.agentId !== agentId) throw new SqliteSchemaMismatchError(`OpenClaw agent database ${options.pathname} belongs to agent ${metadata.agentId}; requested agent ${agentId}.`);
	return metadata;
}
/** Require the exact agent owner and schema before offline file maintenance. */
function assertOpenClawAgentDatabaseForMaintenance(database, options) {
	const metadata = assertOpenClawAgentDatabaseOwner(database, options);
	const userVersion = assertSupportedAgentSchemaVersion(database, options.pathname);
	if (userVersion !== 27) throw new SqliteSchemaMismatchError(`OpenClaw agent database ${options.pathname} uses schema version ${userVersion}; run openclaw doctor --fix before compacting it.`);
	if (metadata.schemaVersion !== 27) throw new SqliteSchemaMismatchError(`OpenClaw agent database ${options.pathname} metadata schema version ${metadata.schemaVersion ?? "invalid"} does not match 27; run openclaw doctor --fix before compacting it.`);
	return assertOpenClawAgentSchemaContains(database, options.pathname, OPENCLAW_AGENT_SCHEMA_SQL, "current", options.allowStartupIndexRepair);
}
/** Upgrade or repair a supported owned schema before strict offline maintenance. */
async function migrateOpenClawAgentDatabaseForMaintenance(options, maintenance) {
	const agentId = normalizeAgentId(options.agentId);
	const pathname = options.pathname;
	const env = { ...options.env ?? process.env };
	const cleanup = getAgentDeletionDatabaseCleanup({
		agentId,
		path: pathname,
		env
	});
	const assertOwned = () => {
		maintenance.signal.throwIfAborted();
		assertAgentDatabaseMaintenanceAuthority(maintenance);
		cleanup?.assertCurrent();
	};
	assertOwned();
	invalidateOpenClawAgentDatabaseIntegrityBeforeMutation(pathname);
	const database = openNodeSqliteDatabase(pathname);
	try {
		invalidateSqliteSchemaFacts(database);
		configureSqliteMaintenanceCache(database);
		enableNodeSqliteKyselyStatementCache(database);
		database.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
		const metadata = readExistingAgentSchemaMeta(database);
		if (!metadata) {
			if (options.register) assertOpenClawAgentDatabaseForMaintenance(database, {
				agentId,
				pathname
			});
			return;
		}
		assertExistingAgentSchemaOwner(metadata, agentId, pathname);
		assertSupportedAgentSchemaVersion(database, pathname);
		const userVersion = readSqliteUserVersion(database);
		const metadataVersion = metadata.schemaVersion;
		if (!(userVersion === 27 && metadataVersion === 27) && !(userVersion >= 1 && userVersion < 27 && metadataVersion === userVersion)) {
			if (options.register) assertOpenClawAgentDatabaseForMaintenance(database, {
				agentId,
				pathname
			});
			return;
		}
		const repairIndexes = () => {
			const changes = repairDoctorSqliteIndexCorruption(database, pathname, {
				ftsSchemas: AGENT_FTS_SCHEMAS,
				label: `agent ${agentId}`,
				assertCurrent: () => {
					assertOwned();
					assertOpenClawAgentDatabaseOwner(database, {
						agentId,
						pathname
					});
					assertSupportedAgentSchemaVersion(database, pathname);
				}
			});
			for (const change of changes) agentDbLog.warn(change);
			return changes.length > 0;
		};
		if (userVersion === 17) repairIndexes();
		const operation = ensureOpenClawAgentDatabaseSchemaSteps(database, {
			agentId,
			path: pathname,
			env,
			register: options.register
		});
		await runSqliteIntegrityOperationInWorker(operation, {
			busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
			signal: maintenance.signal,
			beforeResume: () => {
				assertOwned();
				invalidateSqliteSchemaFacts(database);
				assertExistingAgentSchemaOwner(readExistingAgentSchemaMeta(database), agentId, pathname);
				assertSupportedAgentSchemaVersion(database, pathname);
			},
			repairIntegrityError: repairIndexes
		});
		assertOwned();
		assertOpenClawAgentDatabaseForMaintenance(database, {
			agentId,
			pathname
		});
	} finally {
		clearNodeSqliteKyselyCacheForDatabase(database);
		database.close();
	}
}
/** Doctor prepares pending stores through their deletion owner without completing cleanup. */
async function preparePendingAgentDeletionDatabasesForMaintenance(options, maintenance) {
	const [{ withAgentDeletion }, { listPendingAgentDeletionJournalsAsync }] = await Promise.all([import("./agent-lifecycle-registry-BmrTjpx8.mjs"), import("./agent-deletion-journal-hMj5AtN7.mjs")]);
	const { env } = options;
	const pending = await listPendingAgentDeletionJournalsAsync({ env });
	const pendingByAgent = /* @__PURE__ */ new Map();
	for (const target of options.targets) {
		const paths = pendingByAgent.get(target.agentId) ?? [];
		paths.push(target.path);
		pendingByAgent.set(target.agentId, paths);
	}
	const changes = [];
	for (const [agentId, paths] of pendingByAgent) {
		maintenance.assertOwned();
		const journal = pending.entries.find((entry) => entry.agentId === agentId);
		if (!journal) throw new Error(`Agent ${agentId} deletion changed before schema preparation.`);
		await withAgentDeletion(agentId, async (begin) => {
			const deletion = await begin(journal, { recoveryOperationId: journal.operationId });
			for (const pathname of paths) {
				await deletion.runDatabaseCleanup({
					agentId,
					path: pathname
				}, () => migrateOpenClawAgentDatabaseForMaintenance({
					agentId,
					pathname,
					env,
					register: true
				}, maintenance));
				changes.push(`Prepared agent database schema in ${pathname} for pending deletion recovery.`);
			}
		}, { env });
	}
	return changes;
}
//#endregion
export { preparePendingAgentDeletionDatabasesForMaintenance as i, assertOpenClawAgentDatabaseOwner as n, migrateOpenClawAgentDatabaseForMaintenance as r, assertOpenClawAgentDatabaseForMaintenance as t };
