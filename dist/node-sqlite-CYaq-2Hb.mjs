import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as installProcessWarningFilter } from "./warning-filter-DEomBGoF.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { n as compareValidSemver } from "./semver-aYpwYdrQ.mjs";
import { c as registerNodeSqliteDisposeCallback } from "./kysely-sync-cache-state-Dc7tna9E.mjs";
import { r as isSqliteWalResetSafeVersion } from "./node-sqlite-BvDyEHkZ.mjs";
import { a as ensureSqliteLibrarySelected, n as SQLITE_NATIVE_RUNTIME_ADMISSION_KEY, o as getSqliteRuntimeCapabilities } from "./bun-sqlite-library-CYR1RYZS.mjs";
import { n as bindSqliteDatabaseAdmission, v as prepareSqliteDatabaseAdmission } from "./sqlite-database-admission-CqdNF9iE.mjs";
import { b as probeSqliteIteratorBehavior, m as trackSqliteSchema } from "./sqlite-schema-facts-C8u_9Af1.mjs";
import { a as registerSqliteReaderConnection } from "./sqlite-reader-lifecycle-Cw11HwJP.mjs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { getEnvironmentData, isMainThread, setEnvironmentData } from "node:worker_threads";
import { isDeepStrictEqual } from "node:util";
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
	throw new Error(`OpenClaw requires SQLite 3.51.3+, 3.50.7+ within 3.50.x, or 3.44.6+ within 3.44.x for WAL safety; Node ${nodeVersion} ${isShared ? "uses shared system" : "embeds"} SQLite ${version}, which is affected by the upstream WAL-reset database corruption bug. ${isShared ? "Upgrade the system SQLite library to one of those safe versions, or use a Node build embedding a safe version." : "Upgrade to Node 24.22.1+ or 26.12.1+ before retrying."}`);
}
function sqliteNativeRuntimeIdentity() {
	return {
		pid: process.pid,
		executable: process.execPath,
		nodeVersion: process.versions.node,
		bunVersion: process.versions.bun,
		library: ensureSqliteLibrarySelected()
	};
}
function parseSqliteNativeRuntimeAdmission(value) {
	if (!isRecord(value) || value.format !== 1 || typeof value.version !== "string" || typeof value.extensionLoadingSupported !== "boolean" || !isRecord(value.iteratorBehavior) || typeof value.iteratorBehavior.nextAfterDoneIsTerminal !== "boolean" || typeof value.iteratorBehavior.returnAfterDoneIsInert !== "boolean") return;
	const runtime = sqliteNativeRuntimeIdentity();
	if (!isDeepStrictEqual(value.runtime, runtime)) return;
	return {
		format: 1,
		runtime,
		version: value.version,
		extensionLoadingSupported: value.extensionLoadingSupported,
		iteratorBehavior: {
			nextAfterDoneIsTerminal: value.iteratorBehavior.nextAfterDoneIsTerminal,
			returnAfterDoneIsInert: value.iteratorBehavior.returnAfterDoneIsInert
		}
	};
}
function safeSqliteNativeRuntimeAdmission(value) {
	try {
		const admission = parseSqliteNativeRuntimeAdmission(value);
		return admission && isSqliteWalResetSafeVersion(admission.version) ? admission : void 0;
	} catch {
		return;
	}
}
/** Reuse a validated isolate fact without opening SQLite or probing the native library. */
function captureSqliteNativeRuntimeAdmission() {
	return safeSqliteNativeRuntimeAdmission(getEnvironmentData(SQLITE_NATIVE_RUNTIME_ADMISSION_KEY));
}
/** Publish to later sibling workers; database authority remains with its existing owners. */
function installSqliteNativeRuntimeAdmission(value) {
	const admission = safeSqliteNativeRuntimeAdmission(value);
	if (admission) setEnvironmentData(SQLITE_NATIVE_RUNTIME_ADMISSION_KEY, admission);
}
function assertSafeSqliteRuntime(sqlite) {
	if (validatedSqliteModule?.sqlite === sqlite) return validatedSqliteModule.iteratorBehavior;
	const inherited = isMainThread ? void 0 : parseSqliteNativeRuntimeAdmission(getEnvironmentData(SQLITE_NATIVE_RUNTIME_ADMISSION_KEY));
	if (inherited) {
		assertSqliteWalResetSafeVersion(inherited.version, process.versions.node);
		jsonbSupported = (compareValidSemver(inherited.version, "3.45.0") ?? -1) >= 0;
		extensionLoadingSupported = inherited.extensionLoadingSupported;
		validatedSqliteModule = {
			sqlite,
			iteratorBehavior: inherited.iteratorBehavior
		};
		return inherited.iteratorBehavior;
	}
	const database = new sqlite.DatabaseSync(":memory:");
	let version;
	let extensions;
	let iteratorBehavior;
	try {
		const statement = database.prepare("SELECT sqlite_version() AS version, sqlite_compileoption_used('OMIT_LOAD_EXTENSION') AS omitted");
		const row = statement.get();
		version = typeof row?.version === "string" ? row.version : "unknown";
		assertSqliteWalResetSafeVersion(version, process.versions.node);
		extensions = row?.omitted === 0;
		iteratorBehavior = probeSqliteIteratorBehavior(statement);
	} finally {
		database.close();
	}
	jsonbSupported = (compareValidSemver(version, "3.45.0") ?? -1) >= 0;
	extensionLoadingSupported = extensions;
	validatedSqliteModule = {
		sqlite,
		iteratorBehavior
	};
	setEnvironmentData(SQLITE_NATIVE_RUNTIME_ADMISSION_KEY, {
		format: 1,
		runtime: sqliteNativeRuntimeIdentity(),
		version,
		extensionLoadingSupported: extensions,
		iteratorBehavior
	});
	return iteratorBehavior;
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
	const identity = options?.open === false ? void 0 : prepareSqliteDatabaseAdmission(resolvedLocation, { create: options?.readOnly !== true });
	const database = new sqlite.DatabaseSync(resolvedLocation, options ?? {});
	if (database.isOpen) try {
		bindSqliteDatabaseAdmission(database, identity);
	} catch (error) {
		database.close();
		throw error;
	}
	database.open = () => {
		const reopenedIdentity = prepareSqliteDatabaseAdmission(resolvedLocation, { create: options?.readOnly !== true });
		sqlite.DatabaseSync.prototype.open.call(database);
		try {
			bindSqliteDatabaseAdmission(database, reopenedIdentity);
		} catch (error) {
			database.close();
			throw error;
		}
	};
	trackSqliteSchema(database, {
		DatabaseSync: sqlite.DatabaseSync,
		StatementSync: sqlite.StatementSync,
		iteratorBehavior: assertSafeSqliteRuntime(sqlite)
	}, options?.readOnly !== true);
	if (!getSqliteRuntimeCapabilities().explicitSqliteCloseReleasesNativeResources) registerNodeSqliteDisposeCallback(database, () => {});
	registerSqliteReaderConnection(database);
	return database;
}
//#endregion
export { resolveExistingSqliteFileUri as a, resolveSqliteFilesystemPath as c, requireNodeSqlite as i, supportsNodeSqliteExtensionLoading as l, installSqliteNativeRuntimeAdmission as n, resolveImmutableSqliteFileUri as o, openNodeSqliteDatabase as r, resolveNodeSqliteLocation as s, captureSqliteNativeRuntimeAdmission as t, supportsNodeSqliteJsonb as u };
