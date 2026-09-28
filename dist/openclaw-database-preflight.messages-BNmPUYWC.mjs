import { a as OPENCLAW_DATABASE_SCHEMA_DOCS_URL } from "./openclaw-state-db-contract-dESpOAuZ.mjs";
import { r as describeRunningOpenClawBuild, t as SqliteSchemaVersionError } from "./sqlite-user-version-B1TtVu8E.mjs";
//#region src/state/openclaw-database-preflight.messages.ts
/** Fatal refusal when persisted schemas were written by a newer build. */
var OpenClawDatabaseSchemaPreflightError = class extends SqliteSchemaVersionError {
	constructor(incompatibleDatabases, options = {}) {
		const operation = options.operation ?? "gateway-startup";
		super(formatIncompatibleDatabaseSchemas(incompatibleDatabases, operation));
		this.incompatibleDatabases = incompatibleDatabases;
		this.name = "OpenClawDatabaseSchemaPreflightError";
	}
};
function formatIncompatibleDatabase(database) {
	const agent = database.agentId ? ` for agent ${database.agentId}` : "";
	return `${database.kind} database${agent} ${database.path} uses schema ${database.foundVersion}; this build supports ${database.supportedVersion}; writer build ${database.writerAppVersion ?? "unknown"}.`;
}
function formatIncompatibleDatabaseSchemas(incompatibleDatabases, operation) {
	return `${operation === "doctor" ? "Doctor refused to continue" : operation === "gateway-restart" ? "Gateway refused restart" : "Gateway refused startup"} because ${incompatibleDatabases.length} OpenClaw database schema(s) are newer than this build. ${incompatibleDatabases.map(formatIncompatibleDatabase).join(" ")} Refused by ${describeRunningOpenClawBuild()}. Run a build at least as new as the writer that supports these schemas, or stop the service and restore your pre-upgrade backup created with openclaw backup create. See ${OPENCLAW_DATABASE_SCHEMA_DOCS_URL}.`;
}
function formatIndeterminateDatabaseReadiness(indeterminate, operation) {
	const shown = indeterminate.toSorted((left, right) => left.path.localeCompare(right.path)).map((database) => `${database.kind}${database.agentId ? ` ${database.agentId}` : ""} ${database.path}: ${database.reason}`);
	return `${operation === "doctor" ? "Doctor could not complete repair" : operation === "gateway-startup" ? "Gateway refused startup" : "Gateway refused restart"} because persisted database readiness could not be verified:\n${shown.join("\n")}\n${operation === "doctor" ? "Stop OpenClaw processes, then restore the affected database from a verified backup." : "Stop the Gateway and other OpenClaw processes, run openclaw doctor --fix, then retry."}`;
}
function describeDeferredStateSchemaPublication(blocker, databasePath, foundVersion, contentVersion) {
	return {
		kind: "state",
		path: databasePath,
		foundVersion,
		contentVersion,
		...blocker ? {
			runId: blocker.runId,
			publishAfterMs: blocker.publishAfterMs
		} : {},
		message: blocker ? `Schema content applied; version publication deferred until update run ${blocker.runId} finishes and its five-minute grace expires (or the running driver is abandoned for 30 minutes).` : "Schema content applied; version publication will complete on the next writable database open."
	};
}
//#endregion
export { describeDeferredStateSchemaPublication as n, formatIndeterminateDatabaseReadiness as r, OpenClawDatabaseSchemaPreflightError as t };
