import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import "./openclaw-state-db-contract-QlwTsE6j.mjs";
import { K as OPENCLAW_STATE_SCHEMA_SQL, S as readSqliteDatabaseCleanClose } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { r as assertSqliteIntegrity } from "./sqlite-integrity-06TCB-az.mjs";
import { d as readSqliteWriterAppVersion } from "./sqlite-readonly-location-Cz5jsVbC.mjs";
import { t as SqliteSchemaMismatchError } from "./sqlite-schema-issues-BnRd2KGO.mjs";
import { a as readSqliteUserVersion } from "./sqlite-user-version-Q7gNRxhK.mjs";
import { r as normalizeOpenClawStateSchemaReadError } from "./openclaw-state-db-schema-migration-required-DmM7omMC.mjs";
import { i as readStateSchemaContentVersion, o as getStateRuntimeSchemaAdmission } from "./openclaw-state-db-schema-version-CcCTuttF.mjs";
import { n as readStateSchemaPublicationBlocker } from "./openclaw-state-schema-publication-C2fzjU88.mjs";
import { i as captureSqliteSchemaContracts, o as collectSqliteSchemaIssues, s as createSqliteTableContractReader } from "./sqlite-schema-contract-C7_zBR7q.mjs";
import { C as assertOpenClawStateDatabaseForMaintenance, I as isOpenClawStateFirstUseSchemaIssue, L as isOpenClawStateStartupRepairableSchemaIssue, N as OPENCLAW_STATE_MAINTENANCE_SCHEMA_COMPATIBILITY, O as openClawStateMigrationAssertions, P as STATE_RUNTIME_SCHEMA_COMPATIBILITY, s as assertCanonicalStateSchemaShape, w as assertOpenClawStateDatabaseOwner } from "./openclaw-state-db-fast-path-D43QiPc4.mjs";
import { a as inspectOpenClawStateOwnershipFromDatabase } from "./openclaw-state-ownership-SRnMuR_a.mjs";
import { c as readRetainedAgentDeletionsFromDatabase } from "./agent-deletion-journal.read-BzRzPvBo.mjs";
import { h as readAgentDatabasePreflightTargets } from "./openclaw-agent-db-registry-listing-DCh0nEqi.mjs";
import { n as describeDeferredStateSchemaPublication } from "./openclaw-database-preflight.messages-CM7IJdZy.mjs";
//#region src/state/openclaw-state-schema-inspection.ts
function deduplicateSchemaIssues(issues) {
	return [...new Map(issues.map((issue) => [`${issue.code}\0${issue.objectName}`, issue])).values()];
}
function inspectCurrentStateStartupSchema(database, databasePath, foundVersion) {
	const metadata = assertOpenClawStateDatabaseOwner(database, { pathname: databasePath });
	if (metadata?.schema_version !== foundVersion) throw new SqliteSchemaMismatchError(`OpenClaw state database ${databasePath} metadata schema version ${typeof metadata?.schema_version === "number" ? metadata.schema_version : "invalid"} does not match ${foundVersion}.`);
	const readTable = createSqliteTableContractReader(database);
	const issues = deduplicateSchemaIssues([...collectSqliteSchemaIssues(database, OPENCLAW_STATE_SCHEMA_SQL, OPENCLAW_STATE_MAINTENANCE_SCHEMA_COMPATIBILITY, readTable), ...collectSqliteSchemaIssues(database, OPENCLAW_STATE_SCHEMA_SQL, STATE_RUNTIME_SCHEMA_COMPATIBILITY, readTable)]);
	return {
		blockingIssues: issues.filter((issue) => !isOpenClawStateStartupRepairableSchemaIssue(issue) && !isOpenClawStateFirstUseSchemaIssue(issue)),
		startupRepairableIssues: issues.filter(isOpenClawStateStartupRepairableSchemaIssue)
	};
}
//#endregion
//#region src/state/openclaw-state-schema-preflight.ts
const canonicalStateInspectionSchemas = [OPENCLAW_STATE_SCHEMA_SQL];
/** Only trusted canonical definitions enter the expected-contract cache, never observed schemas. */
function captureStateSchemaInspectionContracts() {
	return captureSqliteSchemaContracts(canonicalStateInspectionSchemas);
}
/** Boot/Doctor and restart readers inspect the same captured bytes under their existing owner. */
function inspectStateDatabaseSchema(database, input) {
	const { pathname, supportedVersion } = input;
	const schemas = {
		incompatible: [],
		indeterminate: []
	};
	const inspection = {
		schemas,
		inspectionErrors: []
	};
	const cleanClose = input.purpose === "runtime" && readSqliteDatabaseCleanClose(pathname) && getStateRuntimeSchemaAdmission(database)?.startupReady === true;
	try {
		const stateVersion = readSqliteUserVersion(database);
		const contentVersion = stateVersion > supportedVersion ? stateVersion : readStateSchemaContentVersion(database, stateVersion);
		if (contentVersion > supportedVersion) {
			const writerAppVersion = readSqliteWriterAppVersion(database);
			schemas.incompatible.push({
				kind: "state",
				path: pathname,
				foundVersion: contentVersion,
				supportedVersion,
				...writerAppVersion ? { writerAppVersion } : {}
			});
			if (contentVersion > 22) return inspection;
		}
		const migrationVersion = stateVersion > supportedVersion ? readStateSchemaContentVersion(database, stateVersion) : contentVersion;
		if (migrationVersion < supportedVersion) schemas.pendingMigrations = [{
			kind: "state",
			path: pathname,
			foundVersion: stateVersion,
			supportedVersion
		}];
		if (stateVersion < contentVersion && migrationVersion === contentVersion) schemas.deferredSchemaPublications = [describeDeferredStateSchemaPublication(readStateSchemaPublicationBlocker(database), pathname, stateVersion, contentVersion)];
		if (!cleanClose && input.requireStartupMigrationReadiness && contentVersion <= 22) {
			assertSqliteIntegrity(database, pathname);
			assertCanonicalStateSchemaShape(database, pathname);
			inspectOpenClawStateOwnershipFromDatabase(database, pathname);
			if (migrationVersion === 22) {
				const { blockingIssues } = inspectCurrentStateStartupSchema(database, pathname, stateVersion);
				if (blockingIssues.length > 0) throw new SqliteSchemaMismatchError(`OpenClaw state database ${pathname} requires repair: ${blockingIssues.map((issue) => issue.message).join("; ")}; run openclaw doctor --fix.`);
			} else openClawStateMigrationAssertions.get(migrationVersion)?.(database, { pathname });
		} else if (!cleanClose && input.verifyCurrentSchemaShape && migrationVersion === 22) try {
			assertOpenClawStateDatabaseForMaintenance(database, {
				pathname,
				schemaVersions: {
					userVersion: stateVersion,
					contentVersion: migrationVersion
				}
			});
		} catch (error) {
			inspection.inspectionErrors.push(error);
			schemas.indeterminate.push({
				kind: "state",
				path: pathname,
				reason: formatErrorMessage(error)
			});
		}
		if (input.scope === "state") return inspection;
		try {
			inspection.registeredDatabases = readAgentDatabasePreflightTargets(database, pathname);
			inspection.deletionJournal = readRetainedAgentDeletionsFromDatabase(database, pathname, input.purpose);
		} catch (error) {
			inspection.inspectionErrors.push(error);
			schemas.indeterminate.push({
				kind: "state",
				path: pathname,
				reason: `agent database registry query failed: ${formatErrorMessage(error)}`
			});
		}
		return inspection;
	} catch (error) {
		if (input.requireStartupMigrationReadiness) throw error;
		const failure = normalizeOpenClawStateSchemaReadError(error, pathname);
		inspection.inspectionErrors.push(failure);
		schemas.indeterminate.push({
			kind: "state",
			path: pathname,
			reason: formatErrorMessage(failure)
		});
		return inspection;
	}
}
//#endregion
export { inspectStateDatabaseSchema as n, inspectCurrentStateStartupSchema as r, captureStateSchemaInspectionContracts as t };
