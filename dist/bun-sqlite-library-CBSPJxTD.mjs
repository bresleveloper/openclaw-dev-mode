import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { t as parseDiagnosticEnvFlags } from "./diagnostic-flags-env-7ynNTunv.mjs";
import { r as isSqliteWalResetSafeVersion } from "./node-sqlite-DWn4GVXM.mjs";
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { posix } from "node:path";
import { getEnvironmentData, isMainThread, setEnvironmentData } from "node:worker_threads";
//#region src/infra/bun-sqlite-library.ts
const WORKER_SELECTION_KEY = "openclaw.bunSqliteLibrarySelection";
const WORKER_CAPABILITIES_KEY = "openclaw.sqliteRuntimeCapabilities";
function createCapabilities(deps) {
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
			deps.publish(decision);
			if (decision.explicitSqliteCloseReleasesNativeResources && earlyTopologyOwners > 0) deps.warn(`SQLite close became capable after ${earlyTopologyOwners} topology owners were created; those owners remain conservative`);
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
		if (!deps.isBun) return decide({
			explicitSqliteCloseReleasesNativeResources: true,
			decided: true,
			reason: "Node runtime"
		});
		if (deps.platform === "win32") return decide(conservative("Bun Windows native-close conformance is not qualified"));
		if (!deps.isMainThread) return decide({
			...pending,
			reason: "Parent did not complete SQLite close admission",
			...deps.inherited
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
				deps.select();
				const ready = settled();
				if (ready) return ready;
				try {
					if (deps.forceConservative) return decide(conservative("SQLite close optimization disabled by internal diagnostic flag"));
					return decide({
						...await deps.probe(),
						decided: true
					});
				} catch (error) {
					return decide(conservative(`SQLite close probe failed: ${String(error)}`));
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
function createSelector(deps) {
	let selection;
	let failure;
	return (options = {}) => {
		if (failure) throw failure;
		if (selection) return selection;
		const override = options.explicitPath ?? (deps.env.OPENCLAW_SQLITE_LIBRARY?.trim() || void 0);
		if (!deps.isBun || deps.platform !== "darwin") {
			selection = override ? {
				source: "runtime",
				ignoredOverride: "OPENCLAW_SQLITE_LIBRARY requires Bun on macOS"
			} : { source: "runtime" };
			return selection;
		}
		const prefix = deps.env.HOMEBREW_PREFIX?.trim();
		const candidates = override !== void 0 ? [override] : [.../* @__PURE__ */ new Set([
			...prefix ? [posix.join(prefix, "opt/sqlite/lib/libsqlite3.dylib")] : [],
			"/opt/homebrew/opt/sqlite/lib/libsqlite3.dylib",
			"/usr/local/opt/sqlite/lib/libsqlite3.dylib",
			"/opt/local/lib/libsqlite3.dylib"
		])];
		for (const path of candidates) {
			let probe;
			try {
				try {
					probe = deps.probe(path);
				} catch (error) {
					throw deps.exists(path) ? error : new Error("missing file", { cause: error });
				}
				if (!isSqliteWalResetSafeVersion(probe.version)) throw new Error(`SQLite version ${probe.version} below the WAL safety floor`);
				if (!probe.extensionLoadingSupported) throw new Error("built with SQLITE_OMIT_LOAD_EXTENSION");
			} catch (error) {
				if (override === void 0) continue;
				failure = selectionError(path, error);
				throw failure;
			}
			try {
				deps.select(path);
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
		selection = { source: "runtime" };
		return selection;
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
	const isBun = Boolean(process.versions.bun);
	const sharedLibrary = isBun && process.platform === "darwin";
	const inherited = sharedLibrary && !isMainThread ? inheritedSelection() : void 0;
	const select = createSelector({
		isBun,
		platform: process.platform,
		env: process.env,
		exists: existsSync,
		probe: probeLibrary,
		select: selectLibrary
	});
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
function capabilities(options) {
	const deps = options?.internals;
	if (deps) return deps.owner ??= createCapabilities(deps);
	const select = runtimeSelector();
	return select.capabilities ??= createCapabilities({
		isBun: Boolean(process.versions.bun),
		platform: process.platform,
		isMainThread,
		get inherited() {
			return getEnvironmentData(WORKER_CAPABILITIES_KEY);
		},
		select,
		probe: async () => (await import("./bun-sqlite-close-probe-D9rhwTZL.mjs")).probeSqliteNativeClose(),
		publish: (value) => setEnvironmentData(WORKER_CAPABILITIES_KEY, value),
		warn: (message) => process.emitWarning(message, { code: "SQLITE_EARLY_TOPOLOGY" }),
		get forceConservative() {
			return parseDiagnosticEnvFlags(process.env.OPENCLAW_DIAGNOSTICS).flags.some((flag) => flag.toLowerCase() === "sqlite.close.conservative");
		}
	});
}
function getSqliteRuntimeCapabilities(options) {
	return capabilities(options).get();
}
/** A topology owner keeps this snapshot for placement and paired native retirement. */
function captureSqliteWorkerClosePolicy(options) {
	return capabilities(options).capture();
}
/** Retained supervisors forward the caller's current facts when creating each descendant. */
function captureSqliteWorkerEnvironmentData() {
	return [[WORKER_SELECTION_KEY, ensureSqliteLibrarySelected()], [WORKER_CAPABILITIES_KEY, getSqliteRuntimeCapabilities()]];
}
/** Await at runtime admission, before any consumer chooses a worker topology. */
function initializeSqliteRuntimeCapabilities(options) {
	return capabilities(options).initialize();
}
/** Select once, before any SQLite open; shared across CLI and bundled SDK module graphs. */
function ensureSqliteLibrarySelected(options) {
	const dependencies = options?.internals;
	return (dependencies ? dependencies.selector ??= createSelector(dependencies) : runtimeSelector())(options);
}
//#endregion
export { initializeSqliteRuntimeCapabilities as a, getSqliteRuntimeCapabilities as i, captureSqliteWorkerEnvironmentData as n, ensureSqliteLibrarySelected as r, captureSqliteWorkerClosePolicy as t };
