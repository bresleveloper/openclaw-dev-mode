import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-Cur9Uhkp.mjs";
import { c as resolveRuntimeServiceCommit, t as VERSION } from "./version-BkM1aB4w.mjs";
import { a as OPENCLAW_DATABASE_SCHEMA_DOCS_URL } from "./openclaw-state-db-contract-dESpOAuZ.mjs";
import { n as StartupMaintenanceRequiredError } from "./startup-maintenance-required-OfhrhQoQ.mjs";
//#region src/infra/sqlite-user-version.ts
const SQLITE_SCHEMA_VERSION_ERROR_NAME = "SqliteSchemaVersionError";
var SqliteSchemaVersionError = class extends StartupMaintenanceRequiredError {
	constructor(message) {
		super("newer-schema", message);
		this.name = SQLITE_SCHEMA_VERSION_ERROR_NAME;
	}
};
function isSqliteSchemaVersionError(error) {
	return error instanceof SqliteSchemaVersionError || error instanceof Error && error.name === SQLITE_SCHEMA_VERSION_ERROR_NAME;
}
function readSqliteUserVersion(db) {
	const row = db.prepare("PRAGMA user_version").get();
	return Number(row?.user_version ?? 0);
}
/**
* Name the refusing build from immutable loaded metadata, plus its install root.
* The path remains actionable when multiple installs share a version or build.
*/
function describeRunningOpenClawBuild() {
	const commit = resolveRuntimeServiceCommit();
	const root = resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url });
	const identity = commit ? `OpenClaw ${VERSION} (${commit})` : `OpenClaw ${VERSION}`;
	return root ? `${identity} installed at ${root}` : identity;
}
function createNewerSqliteSchemaVersionError(databaseLabel, pathname, schemaVersion, supportedVersion) {
	return new SqliteSchemaVersionError(`This OpenClaw build cannot open your existing data.
${databaseLabel} ${pathname} uses newer schema version ${schemaVersion}; this build supports ${supportedVersion}.\nRefused by ${describeRunningOpenClawBuild()}.\nUse a build that supports schema ${schemaVersion} or newer with this state directory. To use an older build, restore your pre-update backup created with openclaw backup create.\nSee ${OPENCLAW_DATABASE_SCHEMA_DOCS_URL}.`);
}
//#endregion
export { readSqliteUserVersion as a, isSqliteSchemaVersionError as i, createNewerSqliteSchemaVersionError as n, describeRunningOpenClawBuild as r, SqliteSchemaVersionError as t };
