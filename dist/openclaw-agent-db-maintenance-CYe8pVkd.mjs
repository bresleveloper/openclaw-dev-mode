import "./kysely-sync-K7ftY-g4.mjs";
import { r as enableNodeSqliteKyselyStatementCache, t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-eUau8Jaa.mjs";
import { t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { t as SqliteSchemaMismatchError } from "./sqlite-schema-issues-Cd5MmsG2.mjs";
import { t as readExistingAgentSchemaMeta } from "./openclaw-agent-db-metadata-r_rNkHrE.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-Cm9fKF2T.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-ZJ4dPMsi.mjs";
import { c as resolveSqliteInspectionSignal } from "./sqlite-readonly-worker-TSy0m8v6.mjs";
import { t as OPENCLAW_AGENT_SCHEMA_SQL } from "./openclaw-agent-schema-BcJs-SM4.mjs";
import "./openclaw-agent-db-contract-ClUH-Vmp.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import "./session-key-C09ow4h0.mjs";
import { m as repairDoctorSqliteIndexCorruption } from "./openclaw-state-db-D1jWDzK3.mjs";
import { t as configureSqliteMaintenanceCache } from "./sqlite-maintenance-cache-AYpxl8JZ.mjs";
import { n as assertExistingAgentSchemaOwner, r as assertSupportedAgentSchemaVersion } from "./openclaw-agent-db-schema-read-8tLHX1g8.mjs";
import { r as assertOpenClawAgentSchemaContains } from "./openclaw-agent-db-schema-helpers-BxlojGn2.mjs";
import { i as ensureOpenClawAgentDatabaseSchemaSteps, s as assertSqliteIntegrityInWorker } from "./openclaw-agent-db-schema-kFBuwbLx.mjs";
import { r as assertAgentDatabaseMaintenanceAuthority, u as invalidateOpenClawAgentDatabaseIntegrityBeforeMutation } from "./openclaw-agent-db-lease-D8zYIRzn.mjs";
//#region src/infra/sqlite-integrity-operation.ts
/** Keep the caller's connection and authority until every native reader closes. */
async function runSqliteIntegrityOperationInWorker(operation, options) {
	const signal = resolveSqliteInspectionSignal(options.signal) ?? options.signal;
	const beforeResume = () => {
		signal.throwIfAborted();
		options.beforeResume();
	};
	try {
		beforeResume();
		let step = operation.next();
		while (!step.done) {
			let failure;
			try {
				await assertSqliteIntegrityInWorker(step.value.databaseLabel, options.busyTimeoutMs, signal, void 0, step.value.timing, step.value.tables);
			} catch (error) {
				failure = { error };
			}
			beforeResume();
			step = failure && !options.repairIntegrityError?.() ? operation.throw(failure.error) : operation.next();
		}
	} finally {
		operation.return();
	}
}
//#endregion
//#region src/state/openclaw-agent-db-maintenance.ts
const agentDbLog = createSubsystemLogger("state/agent-db");
/** Require exact agent ownership without requiring the latest schema. */
function assertOpenClawAgentDatabaseOwner(database, options) {
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
	if (userVersion !== 24) throw new SqliteSchemaMismatchError(`OpenClaw agent database ${options.pathname} uses schema version ${userVersion}; run openclaw doctor --fix before compacting it.`);
	if (metadata.schemaVersion !== 24) throw new SqliteSchemaMismatchError(`OpenClaw agent database ${options.pathname} metadata schema version ${metadata.schemaVersion ?? "invalid"} does not match 24; run openclaw doctor --fix before compacting it.`);
	assertOpenClawAgentSchemaContains(database, options.pathname, OPENCLAW_AGENT_SCHEMA_SQL, "current", options.allowStartupIndexRepair);
}
/** Upgrade or repair a supported owned schema before strict offline maintenance. */
async function migrateOpenClawAgentDatabaseForMaintenance(options, maintenance) {
	const agentId = normalizeAgentId(options.agentId);
	const pathname = options.pathname;
	const env = { ...process.env };
	const assertOwned = () => {
		maintenance.signal.throwIfAborted();
		assertAgentDatabaseMaintenanceAuthority(maintenance);
	};
	assertOwned();
	invalidateOpenClawAgentDatabaseIntegrityBeforeMutation(pathname, env);
	const database = openNodeSqliteDatabase(pathname);
	try {
		configureSqliteMaintenanceCache(database);
		enableNodeSqliteKyselyStatementCache(database);
		database.exec(`PRAGMA busy_timeout = ${OPENCLAW_SQLITE_BUSY_TIMEOUT_MS};`);
		const metadata = readExistingAgentSchemaMeta(database);
		if (!metadata) return;
		assertExistingAgentSchemaOwner(metadata, agentId, pathname);
		assertSupportedAgentSchemaVersion(database, pathname);
		const userVersion = readSqliteUserVersion(database);
		const metadataVersion = metadata.schemaVersion;
		if (!(userVersion === 24 && metadataVersion === 24) && !(userVersion >= 1 && userVersion < 24 && metadataVersion === userVersion)) return;
		const repairIndexes = () => {
			const changes = repairDoctorSqliteIndexCorruption(database, pathname, {
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
		await runSqliteIntegrityOperationInWorker(ensureOpenClawAgentDatabaseSchemaSteps(database, {
			agentId,
			path: pathname,
			env
		}), {
			busyTimeoutMs: OPENCLAW_SQLITE_BUSY_TIMEOUT_MS,
			signal: maintenance.signal,
			beforeResume: () => {
				assertOwned();
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
//#endregion
export { runSqliteIntegrityOperationInWorker as i, assertOpenClawAgentDatabaseOwner as n, migrateOpenClawAgentDatabaseForMaintenance as r, assertOpenClawAgentDatabaseForMaintenance as t };
