import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-CPodxfi3.mjs";
import { c as resolveRuntimeServiceCommit, t as VERSION } from "./version-jg_14gWz.mjs";
import { o as OPENCLAW_DATABASE_SCHEMA_DOCS_URL } from "./openclaw-state-db-contract-QlwTsE6j.mjs";
import { i as executeWithCachedStatement } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { n as StartupMaintenanceRequiredError } from "./startup-maintenance-required-D0mOtveg.mjs";
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
	const row = executeWithCachedStatement(db, "PRAGMA user_version", [], (statement) => statement.get());
	return Number(row?.user_version ?? 0);
}
function writeSqliteUserVersion(db, version) {
	if (!Number.isInteger(version) || version < 0 || version > 2147483647) throw new RangeError("SQLite user_version must be an integer from 0 through 2147483647.");
	db.exec(`PRAGMA user_version = ${version}`);
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
export { readSqliteUserVersion as a, isSqliteSchemaVersionError as i, createNewerSqliteSchemaVersionError as n, writeSqliteUserVersion as o, describeRunningOpenClawBuild as r, SqliteSchemaVersionError as t };
