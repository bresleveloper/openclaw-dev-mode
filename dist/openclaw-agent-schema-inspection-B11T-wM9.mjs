import { f as toStringifiedError } from "./error-coercion-BwMr25F8.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-QlwTsE6j.mjs";
import { t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { i as setSqliteBusyTimeout } from "./sqlite-busy-timeout-COlIRjFZ.mjs";
import { o as resolveImmutableSqliteFileUri, r as openNodeSqliteDatabase } from "./node-sqlite-CYaq-2Hb.mjs";
import "./kysely-sync-9fPQaMlh.mjs";
import { t as isValidAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as assertSqliteIntegrity } from "./sqlite-integrity-06TCB-az.mjs";
import { r as configureSqliteReadOnlyPragmas } from "./sqlite-wal-D2XTertL.mjs";
import { d as readSqliteWriterAppVersion, u as readSqliteSchemaHeader } from "./sqlite-readonly-location-Cz5jsVbC.mjs";
import { r as readExistingAgentSchemaMeta } from "./openclaw-agent-db-metadata-90thy9YD.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-Q7gNRxhK.mjs";
import "./session-key-CSDERtm3.mjs";
import { a as readMainTableList } from "./sqlite-strict-CTENSqnV.mjs";
import "./openclaw-agent-db-contract-BcoeqAm4.mjs";
import { c as hasPendingCurrentVersionAgentDatabaseMigration, n as assertOpenClawAgentCurrentRuntimeSchema, r as assertOpenClawAgentSchemaContains, s as getOpenClawAgentMigrationSchema } from "./openclaw-agent-db-schema-helpers-DZw0ltGv.mjs";
import { t as assertCanonicalAgentPersistenceVersion } from "./openclaw-agent-db-schema-read-CX4aGKRI.mjs";
import { t as assertOpenClawAgentDatabaseForMaintenance } from "./openclaw-agent-db-maintenance-DIdAFgIX.mjs";
import { existsSync, realpathSync, statSync } from "node:fs";
import path from "node:path";
//#region src/state/openclaw-agent-schema-inspection.ts
/** Only schema/default index metadata may survive a turn-less first run. */
function isEmptyAgentStore(database, input, version, metadata) {
	if (!input.agentId || metadata?.role !== "agent" || metadata.agentId !== input.agentId || metadata.schemaVersion == null || metadata.schemaVersion !== version || metadata.schemaVersion < 24 || metadata.schemaVersion > 27) return false;
	assertSqliteIntegrity(database, input.pathname);
	assertOpenClawAgentSchemaContains(database, input.pathname, getOpenClawAgentMigrationSchema(metadata.schemaVersion));
	for (const table of readMainTableList(database, { includeInternal: true })) {
		if (table.type === "shadow" || table.name === "sqlite_schema") continue;
		const name = table.name;
		if (name.startsWith("sqlite_stat")) continue;
		const allowed = name === "schema_meta" ? "meta_key = 'primary'" : name === "session_key_contract" ? "id = 1 AND updated_at = 0" : name === "memory_index_meta" ? "key = 'memory_index_meta_v1' OR (key = 'memory_vector_rebuild_v1' AND value = 'clean')" : name === "memory_index_state" ? "id = 1 AND revision = 0" : name === "sqlite_sequence" ? "seq = 0" : "0";
		if (database.prepare(`SELECT 1 FROM "${name.replaceAll("\"", "\"\"")}" WHERE (${allowed}) IS NOT TRUE LIMIT 1`).get()) return false;
	}
	return true;
}
/** All facts belong to the caller's single read transaction or private snapshot. */
function inspectAgentDatabaseSchema(database, input) {
	if (!input.verifyCurrentSchemaShape && !input.requireStartupMigrationReadiness) try {
		const { userVersion, ...header } = readSqliteSchemaHeader(database, input.inspectOwnership ? input.supportedVersion : void 0);
		return {
			version: userVersion,
			...header,
			...input.inspectEmptyStore ? { emptyStore: userVersion <= input.supportedVersion && isEmptyAgentStore(database, input, userVersion, header.agentSchemaMeta) } : {}
		};
	} finally {
		clearNodeSqliteKyselyCacheForDatabase(database);
	}
	const version = readSqliteUserVersion(database);
	const inspection = { version };
	let checkingShape = false;
	try {
		if (version > input.supportedVersion) {
			const writerAppVersion = readSqliteWriterAppVersion(database);
			return {
				version,
				...writerAppVersion ? { writerAppVersion } : {}
			};
		}
		if (input.inspectOwnership) inspection.agentSchemaMeta = readExistingAgentSchemaMeta(database);
		if (input.requireStartupMigrationReadiness) {
			const migrationPending = version !== input.supportedVersion || hasPendingCurrentVersionAgentDatabaseMigration(database);
			if (input.startupIntegrityVerification !== void 0 && !migrationPending) inspection.integrityGateOutcome = "cached";
			else if (input.deferRuntimeIntegrity && !migrationPending) inspection.preparationPending = true;
			else {
				assertSqliteIntegrity(database, input.pathname);
				inspection.integrityGateOutcome = "healthy";
			}
			if (migrationPending && version === input.supportedVersion) inspection.preparationPending = true;
			assertCanonicalAgentPersistenceVersion(database, input.pathname, version);
		}
		const agentId = input.agentId ?? (input.requireStartupMigrationReadiness ? readExistingAgentSchemaMeta(database)?.agentId : void 0);
		if (input.verifyCurrentSchemaShape && agentId != null && (!input.requireStartupMigrationReadiness || version > 0)) {
			checkingShape = true;
			if (assertOpenClawAgentDatabaseForMaintenance(database, {
				agentId,
				pathname: input.pathname,
				allowStartupIndexRepair: input.requireStartupMigrationReadiness
			})) inspection.preparationPending = true;
		}
		return inspection;
	} catch (error) {
		if (input.requireStartupMigrationReadiness) return {
			...inspection,
			failure: toStringifiedError(error),
			...checkingShape ? { reason: formatErrorMessage(error) } : {}
		};
		return {
			...inspection,
			reason: formatErrorMessage(error)
		};
	} finally {
		clearNodeSqliteKyselyCacheForDatabase(database);
	}
}
/** Validate one consolidated agent copy using this release's exact maintenance reader.
* This never discovers, registers, migrates, or opens an ordinary runtime store.
*/
async function preflightOpenClawAgentDatabasePath(databasePath, agentId) {
	const resolvedPath = path.resolve(databasePath);
	const base = {
		schema: "openclaw.agent-schema-preflight.v1",
		databasePath: resolvedPath,
		agentId,
		targetVersion: 27,
		requiresWrite: false,
		issues: []
	};
	let database;
	let foundVersion = null;
	let status = "indeterminate";
	try {
		if (!isValidAgentId(agentId) || agentId !== agentId.trim().toLowerCase()) throw new Error("Agent preflight requires an explicit canonical agent ID.");
		const inspectionPath = realpathSync.native(resolvedPath);
		if (inspectionPath !== resolvedPath || !statSync(inspectionPath).isFile()) throw new Error("Agent preflight requires a canonical regular copied database path.");
		if ([
			"-wal",
			"-shm",
			"-journal"
		].some((suffix) => existsSync(inspectionPath + suffix))) throw new Error("Agent preflight requires a consolidated snapshot with no SQLite sidecars.");
		database = openNodeSqliteDatabase(resolveImmutableSqliteFileUri(inspectionPath), { readOnly: true });
		setSqliteBusyTimeout(database, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS);
		configureSqliteReadOnlyPragmas(database);
		assertSqliteIntegrity(database, resolvedPath);
		foundVersion = readSqliteUserVersion(database);
		status = "incompatible";
		assertOpenClawAgentDatabaseForMaintenance(database, {
			agentId,
			pathname: resolvedPath
		});
		assertOpenClawAgentCurrentRuntimeSchema(database, {
			agentId,
			pathname: resolvedPath
		});
		return {
			...base,
			foundVersion,
			status: "exact"
		};
	} catch (error) {
		return {
			...base,
			foundVersion,
			status,
			reason: formatErrorMessage(error)
		};
	} finally {
		if (database) clearNodeSqliteKyselyCacheForDatabase(database);
		database?.close();
	}
}
//#endregion
export { preflightOpenClawAgentDatabasePath as n, inspectAgentDatabaseSchema as t };
