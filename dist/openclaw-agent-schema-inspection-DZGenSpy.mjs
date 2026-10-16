import { d as toStringifiedError } from "./error-coercion-CvJK4lmH.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import "./kysely-sync-K7ftY-g4.mjs";
import { t as clearNodeSqliteKyselyCacheForDatabase } from "./kysely-sync-cache-state-eUau8Jaa.mjs";
import { i as resolveImmutableSqliteFileUri, t as openNodeSqliteDatabase } from "./node-sqlite-XIcwmOrl.mjs";
import { d as readSqliteWriterAppVersion, u as readSqliteSchemaHeader } from "./sqlite-readonly-location-OdGkIPCl.mjs";
import { i as setSqliteBusyTimeout } from "./sqlite-busy-timeout-DYrW2wFu.mjs";
import { t as readExistingAgentSchemaMeta } from "./openclaw-agent-db-metadata-r_rNkHrE.mjs";
import { s as OPENCLAW_SQLITE_BUSY_TIMEOUT_MS } from "./openclaw-state-db-contract-Cm9fKF2T.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-ZJ4dPMsi.mjs";
import { r as configureSqliteReadOnlyPragmas } from "./sqlite-wal-DUSYRhyv.mjs";
import { n as assertSqliteIntegrity } from "./sqlite-integrity-GtqcmwG3.mjs";
import "./openclaw-agent-db-contract-ClUH-Vmp.mjs";
import { t as isValidAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { t as canReuseOpenClawAgentIntegrityVerification } from "./openclaw-quarantine-store-BMO9c1KL.mjs";
import "./session-key-C09ow4h0.mjs";
import { t as assertCanonicalAgentPersistenceVersion } from "./openclaw-agent-db-schema-read-8tLHX1g8.mjs";
import { n as assertOpenClawAgentCurrentRuntimeSchema, s as hasPendingCurrentVersionAgentDatabaseMigration } from "./openclaw-agent-db-schema-helpers-BxlojGn2.mjs";
import { t as assertOpenClawAgentDatabaseForMaintenance } from "./openclaw-agent-db-maintenance-CYe8pVkd.mjs";
import { existsSync, realpathSync, statSync } from "node:fs";
import path from "node:path";
//#region src/state/openclaw-agent-schema-inspection.ts
/** All facts belong to the caller's single read transaction or private snapshot. */
function inspectAgentDatabaseSchema(database, input) {
	if (!input.verifyCurrentSchemaShape && !input.requireStartupMigrationReadiness) try {
		const { userVersion, ...header } = readSqliteSchemaHeader(database, input.inspectOwnership ? input.supportedVersion : void 0);
		return {
			version: userVersion,
			...header
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
			if (!canReuseOpenClawAgentIntegrityVerification(input.pathname, input.startupIntegrityVerification, version !== input.supportedVersion || hasPendingCurrentVersionAgentDatabaseMigration(database))) {
				assertSqliteIntegrity(database, input.pathname);
				inspection.integrityGateOutcome = "healthy";
			} else inspection.integrityGateOutcome = "cached";
			assertCanonicalAgentPersistenceVersion(database, input.pathname, version);
		}
		const agentId = input.agentId ?? (input.requireStartupMigrationReadiness ? readExistingAgentSchemaMeta(database)?.agentId : void 0);
		if (input.verifyCurrentSchemaShape && agentId != null && (!input.requireStartupMigrationReadiness || version > 0)) {
			checkingShape = true;
			assertOpenClawAgentDatabaseForMaintenance(database, {
				agentId,
				pathname: input.pathname,
				allowStartupIndexRepair: input.requireStartupMigrationReadiness
			});
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
		targetVersion: 24,
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
