import { t as installProcessWarningFilter } from "./warning-filter-BGYPTRmo.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as compareValidSemver } from "./semver-aYpwYdrQ.mjs";
import { i as registerSqliteReaderConnection } from "./sqlite-reader-lifecycle-BmcnELSc.mjs";
import { r as isSqliteWalResetSafeVersion } from "./node-sqlite-DWn4GVXM.mjs";
import { t as ensureSqliteLibrarySelected } from "./bun-sqlite-library-GOquVAYK.mjs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";
//#region src/infra/node-sqlite.ts
const require = createRequire(import.meta.url);
let validatedSqliteModule;
let extensionLoadingSupported = false;
let jsonbSupported = false;
function resolveSqliteFilesystemPath(pathname) {
	if (process.platform !== "win32") return pathname;
	return path.toNamespacedPath(path.resolve(pathname));
}
function resolveNodeSqliteLocation(location) {
	if (location === "" || location === ":memory:" || location.startsWith("file:")) return location;
	return resolveSqliteFilesystemPath(location);
}
/** Preserve native Windows path prefixes before adding SQLite URI parameters. */
function resolveSqliteFileUriPath(pathname, platform) {
	if (platform === "win32") {
		const namespacedPath = path.win32.toNamespacedPath(path.win32.resolve(pathname));
		return `file:${encodeURIComponent(namespacedPath)}`;
	}
	return pathToFileURL(path.resolve(pathname)).href;
}
/** Open an existing writable database without SQLite's create-if-missing flag. */
function resolveExistingSqliteFileUri(pathname, platform = process.platform) {
	return `${resolveSqliteFileUriPath(pathname, platform)}?mode=rw`;
}
/** Build an immutable SQLite URI without losing the Windows long-path namespace. */
function resolveImmutableSqliteFileUri(pathname, platform = process.platform) {
	return `${resolveSqliteFileUriPath(pathname, platform)}?mode=ro&immutable=1`;
}
function assertSqliteWalResetSafeVersion(version, nodeVersion) {
	if (isSqliteWalResetSafeVersion(version)) return;
	const variables = process.config?.variables;
	const isShared = variables?.node_shared_sqlite === true || variables?.node_shared_sqlite === "true";
	throw new Error(`OpenClaw requires SQLite 3.51.3+, 3.50.7+ within 3.50.x, or 3.44.6+ within 3.44.x for WAL safety; Node ${nodeVersion} ${isShared ? "uses shared system" : "embeds"} SQLite ${version}, which is affected by the upstream WAL-reset database corruption bug. ${isShared ? "Upgrade the system SQLite library to one of those safe versions, or use a Node build embedding a safe version." : "Upgrade to Node 24.16.0+ or 26.1.0+ before retrying."}`);
}
function assertSafeSqliteRuntime(sqlite) {
	if (validatedSqliteModule === sqlite) return;
	const database = new sqlite.DatabaseSync(":memory:");
	try {
		const row = database.prepare("SELECT sqlite_version() AS version").get();
		const version = typeof row?.version === "string" ? row.version : "unknown";
		assertSqliteWalResetSafeVersion(version, process.versions.node);
		jsonbSupported = (compareValidSemver(version, "3.45.0") ?? -1) >= 0;
		extensionLoadingSupported = database.prepare("SELECT sqlite_compileoption_used('OMIT_LOAD_EXTENSION') AS omitted").get()?.omitted === 0;
		validatedSqliteModule = sqlite;
	} finally {
		database.close();
	}
}
/** Load node:sqlite after installing the process warning filter. */
function requireNodeSqlite() {
	installProcessWarningFilter();
	try {
		ensureSqliteLibrarySelected();
		const sqlite = require("node:sqlite");
		assertSafeSqliteRuntime(sqlite);
		return sqlite;
	} catch (err) {
		const message = formatErrorMessage(err);
		throw new Error(`SQLite support is unavailable or unsafe in this Node runtime. ${message}`, { cause: err });
	}
}
/** Whether the loaded SQLite library supports native extensions. */
function supportsNodeSqliteExtensionLoading() {
	requireNodeSqlite();
	return extensionLoadingSupported;
}
/** JSONB is absent from the supported SQLite 3.44 maintenance line. */
function supportsNodeSqliteJsonb() {
	requireNodeSqlite();
	return jsonbSupported;
}
/** Open node:sqlite through OpenClaw's runtime and filesystem-location boundary. */
function openNodeSqliteDatabase(location, options) {
	const sqlite = requireNodeSqlite();
	const resolvedLocation = resolveNodeSqliteLocation(location);
	const database = options === void 0 ? new sqlite.DatabaseSync(resolvedLocation) : new sqlite.DatabaseSync(resolvedLocation, options);
	registerSqliteReaderConnection(database);
	return database;
}
/** Compare versions only across reads on the same connection. */
function readSqliteDataVersion(database) {
	const row = database.prepare("PRAGMA data_version").get();
	if (typeof row.data_version !== "number") throw new Error("SQLite did not return a numeric PRAGMA data_version");
	return row.data_version;
}
//#endregion
export { resolveImmutableSqliteFileUri as a, supportsNodeSqliteExtensionLoading as c, resolveExistingSqliteFileUri as i, supportsNodeSqliteJsonb as l, readSqliteDataVersion as n, resolveNodeSqliteLocation as o, requireNodeSqlite as r, resolveSqliteFilesystemPath as s, openNodeSqliteDatabase as t };
