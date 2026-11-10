import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as parseDiagnosticEnvFlags } from "./diagnostic-flags-env-7ynNTunv.mjs";
import { t as SQLITE_DATABASE_ADMISSIONS_KEY } from "./sqlite-database-admission-key-CHKIncOy.mjs";
import { r as isSqliteWalResetSafeVersion } from "./node-sqlite-BvDyEHkZ.mjs";
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { posix } from "node:path";
import { getEnvironmentData, isMainThread, setEnvironmentData } from "node:worker_threads";
//#region src/infra/bun-sqlite-library.ts
const WORKER_SELECTION_KEY = "openclaw.bunSqliteLibrarySelection";
const WORKER_CAPABILITIES_KEY = "openclaw.sqliteRuntimeCapabilities";
const SQLITE_NATIVE_RUNTIME_ADMISSION_KEY = "openclaw.sqliteNativeRuntimeAdmission";
const SQLITE_EXPECTED_SCHEMA_CONTRACTS_KEY = "openclaw.sqliteExpectedSchemaContracts.v1";
function createCapabilities(select) {
	let decision;
	let initialization;
	let earlyTopologyOwners = 0;
	const pending = Object.freeze({
		explicitSqliteCloseReleasesNativeResources: false,
		decided: false,
		reason: "SQLite close capability has not been decided"
	});
	function decide(value) {
		if (!decision) {
			decision = Object.freeze(value);
			setEnvironmentData(WORKER_CAPABILITIES_KEY, decision);
			if (decision.explicitSqliteCloseReleasesNativeResources && earlyTopologyOwners > 0) process.emitWarning(`SQLite close became capable after ${earlyTopologyOwners} topology owners were created; those owners remain conservative`, { code: "SQLITE_EARLY_TOPOLOGY" });
		}
		return decision;
	}
	function conservative(reason) {
		return {
			explicitSqliteCloseReleasesNativeResources: false,
			decided: true,
			reason
		};
	}
	function settled() {
		if (decision) return decision;
		if (!process.versions.bun) return decide({
			explicitSqliteCloseReleasesNativeResources: true,
			decided: true,
			reason: "Node runtime"
		});
		if (process.platform === "win32") return decide(conservative("Bun Windows native-close conformance is not qualified"));
		if (!isMainThread) return decide({
			...pending,
			reason: "Parent did not complete SQLite close admission",
			...getEnvironmentData(WORKER_CAPABILITIES_KEY)
		});
	}
	return {
		get() {
			return settled() ?? pending;
		},
		capture() {
			const fact = settled() ?? pending;
			if (!fact.decided) earlyTopologyOwners += 1;
			return fact.explicitSqliteCloseReleasesNativeResources;
		},
		initialize() {
			initialization ??= (async () => {
				select();
				const ready = settled();
				if (ready) return ready;
				try {
					if (parseDiagnosticEnvFlags(process.env.OPENCLAW_DIAGNOSTICS).flags.some((flag) => flag.toLowerCase() === "sqlite.close.conservative")) return decide(conservative("SQLite close optimization disabled by internal diagnostic flag"));
					const { probeSqliteNativeClose } = await import("./bun-sqlite-close-probe-8Nl2Ff2x.mjs");
					return decide({
						...await probeSqliteNativeClose(),
						decided: true
					});
				} catch (error) {
					return decide(conservative(`SQLite close check failed: ${String(error)}`));
				}
			})();
			return initialization;
		}
	};
}
function probeLibrary(path) {
	const { dlopen, FFIType } = createRequire(import.meta.url)("bun:ffi");
	const library = dlopen(path, {
		sqlite3_libversion: {
			args: [],
			returns: FFIType.cstring
		},
		sqlite3_compileoption_used: {
			args: [FFIType.cstring],
			returns: FFIType.i32
		}
	});
	try {
		return {
			version: String(library.symbols.sqlite3_libversion()),
			extensionLoadingSupported: library.symbols.sqlite3_compileoption_used(Buffer.from("OMIT_LOAD_EXTENSION\0")) === 0
		};
	} finally {
		library.close();
	}
}
function selectLibrary(path) {
	const { Database } = createRequire(import.meta.url)("bun:sqlite");
	Database.setCustomSQLite(path);
}
function createSelector() {
	let selection;
	let failure;
	return (options = {}) => {
		if (failure) throw failure;
		if (selection) return selection;
		const override = options.explicitPath ?? (process.env.OPENCLAW_SQLITE_LIBRARY?.trim() || void 0);
		if (!process.versions.bun || process.platform !== "darwin") {
			selection = override ? {
				source: "runtime",
				ignoredOverride: "OPENCLAW_SQLITE_LIBRARY requires Bun on macOS"
			} : { source: "runtime" };
			return selection;
		}
		const prefix = process.env.HOMEBREW_PREFIX?.trim();
		const candidates = override !== void 0 ? [override] : [.../* @__PURE__ */ new Set([
			...prefix ? [posix.join(prefix, "opt/sqlite/lib/libsqlite3.dylib")] : [],
			"/opt/homebrew/opt/sqlite/lib/libsqlite3.dylib",
			"/usr/local/opt/sqlite/lib/libsqlite3.dylib",
			"/opt/local/lib/libsqlite3.dylib"
		])];
		const unusable = [];
		for (const path of candidates) {
			let probe;
			let present = true;
			try {
				try {
					probe = probeLibrary(path);
				} catch (error) {
					present = existsSync(path);
					throw present ? error : new Error("missing file", { cause: error });
				}
				if (!isSqliteWalResetSafeVersion(probe.version)) throw new Error(`SQLite version ${probe.version} below the WAL safety floor`);
				if (!probe.extensionLoadingSupported) throw new Error("built with SQLITE_OMIT_LOAD_EXTENSION");
			} catch (error) {
				if (override === void 0) {
					if (present) unusable.push(`${path} (${error instanceof Error ? error.message : String(error)})`);
					continue;
				}
				failure = selectionError(path, error);
				throw failure;
			}
			try {
				selectLibrary(path);
			} catch (error) {
				failure = selectionError(path, error);
				throw failure;
			}
			selection = {
				source: override === void 0 ? "discovered" : "env",
				path,
				version: probe.version,
				extensionLoadingSupported: true
			};
			return selection;
		}
		failure = /* @__PURE__ */ new Error(`No supported SQLite library for Bun on macOS (${process.arch})` + (unusable.length > 0 ? `; unusable: ${unusable.join(", ")}` : "") + `. Apple's system SQLite fails OpenClaw's read-only database connections. Install one with brew install sqlite, or set OPENCLAW_SQLITE_LIBRARY to a libsqlite3.dylib built for ${process.arch}.`);
		throw failure;
	};
}
function selectionError(path, error) {
	return new Error(`Cannot use SQLite library ${path}: ${error instanceof Error ? error.message : String(error)}. Fix or unset OPENCLAW_SQLITE_LIBRARY; install a supported library with brew install sqlite.`, { cause: error });
}
function inheritedSelection() {
	const value = getEnvironmentData(WORKER_SELECTION_KEY);
	if (value === void 0) return;
	if (value !== null && typeof value === "object" && !Array.isArray(value)) {
		const source = "source" in value ? value.source : void 0;
		if (source === "runtime") return { source: "runtime" };
		const path = "path" in value ? value.path : void 0;
		const version = "version" in value ? value.version : void 0;
		const extensionLoadingSupported = "extensionLoadingSupported" in value ? value.extensionLoadingSupported : void 0;
		if ((source === "env" || source === "discovered") && typeof path === "string" && typeof version === "string" && extensionLoadingSupported === true) return {
			source,
			path,
			version,
			extensionLoadingSupported: true
		};
	}
	throw new Error("Invalid inherited SQLite library selection");
}
function createRuntimeSelector() {
	const sharedLibrary = Boolean(process.versions.bun) && process.platform === "darwin";
	const inherited = sharedLibrary && !isMainThread ? inheritedSelection() : void 0;
	const select = createSelector();
	let published = false;
	return (options) => {
		const selection = inherited ?? select(options);
		if (sharedLibrary && isMainThread && !published) {
			setEnvironmentData(WORKER_SELECTION_KEY, Object.freeze({ ...selection }));
			published = true;
		}
		return selection;
	};
}
function runtimeSelector() {
	return resolveGlobalSingleton(Symbol.for("openclaw.bunSqliteLibrarySelection"), createRuntimeSelector);
}
function capabilities() {
	const select = runtimeSelector();
	return select.capabilities ??= createCapabilities(select);
}
function getSqliteRuntimeCapabilities() {
	return capabilities().get();
}
/** A topology owner keeps this snapshot for placement and paired native retirement. */
function captureSqliteWorkerClosePolicy() {
	return capabilities().capture();
}
/** Retained supervisors forward the caller's current facts when creating each descendant. */
function captureSqliteWorkerEnvironmentData() {
	return [
		[WORKER_SELECTION_KEY, ensureSqliteLibrarySelected()],
		[WORKER_CAPABILITIES_KEY, getSqliteRuntimeCapabilities()],
		[SQLITE_NATIVE_RUNTIME_ADMISSION_KEY, getEnvironmentData(SQLITE_NATIVE_RUNTIME_ADMISSION_KEY)],
		[SQLITE_EXPECTED_SCHEMA_CONTRACTS_KEY, getEnvironmentData(SQLITE_EXPECTED_SCHEMA_CONTRACTS_KEY)],
		[SQLITE_DATABASE_ADMISSIONS_KEY, getEnvironmentData(SQLITE_DATABASE_ADMISSIONS_KEY)]
	];
}
/** Await at runtime admission, before any consumer chooses a worker topology. */
function initializeSqliteRuntimeCapabilities() {
	return capabilities().initialize();
}
/** Select once, before any SQLite open; shared across CLI and bundled SDK module graphs. */
function ensureSqliteLibrarySelected(options) {
	return runtimeSelector()(options);
}
//#endregion
export { ensureSqliteLibrarySelected as a, captureSqliteWorkerEnvironmentData as i, SQLITE_NATIVE_RUNTIME_ADMISSION_KEY as n, getSqliteRuntimeCapabilities as o, captureSqliteWorkerClosePolicy as r, initializeSqliteRuntimeCapabilities as s, SQLITE_EXPECTED_SCHEMA_CONTRACTS_KEY as t };
