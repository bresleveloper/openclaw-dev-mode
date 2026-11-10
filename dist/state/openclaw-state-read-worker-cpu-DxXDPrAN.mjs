import { d as extractErrorCode, s as resolveGlobalSingleton } from "./openclaw-state-read-listeners-C6ALBiqg.mjs";
import { At as normalizeDatabasePath, It as SQLITE_DATABASE_ADMISSIONS_KEY } from "./openclaw-state-read-sqlite-database-admission-BXby_hL9.mjs";
import "./openclaw-state-read-sqlite-reader-lifecycle-CGTFS3iz.mjs";
import { a as isRecord } from "./openclaw-state-read-record-coerce-DWp7lFsP.mjs";
import { I as normalizeWindowsPathPreservingCase, W as resolveIdentityPathViaExistingAncestorSync, u as normalizeDiagnosticWorkerScript, w as resolveStateDir } from "./openclaw-state-read-subsystem-S9LTuPwa.mjs";
import { a as isPathInside, n as hasNodeErrorCode } from "./openclaw-state-read-path-DKRN8JwZ.mjs";
import "./openclaw-state-read-runtime-process-manifest-DvMn2cl1.mjs";
import { n as isLockOwnerDefinitelyStale } from "./openclaw-state-read-stale-lock-file-BZJVXTuc.mjs";
import { i as isPidAlive, t as getFileLockProcessStartTime } from "./openclaw-state-read-pid-alive-BppTQRNj.mjs";
import { c as literal, d as number, f as object, g as string, h as strictObject, i as array, n as _enum, s as discriminatedUnion, v as union } from "./openclaw-state-read-schemas-D2seJkFD.mjs";
import { a as runtimeProcessEntrypoints } from "./openclaw-state-read-runtime-binary-LcE5xcaN.mjs";
import { r as resolveRuntimeWorkerUrl } from "./openclaw-state-read-runtime-worker-url-slDwpD7p.mjs";
import { createRequire } from "node:module";
import fs, { existsSync, statSync } from "node:fs";
import path, { basename, posix } from "node:path";
import { MessagePort, Worker, getEnvironmentData, isMainThread, setEnvironmentData } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import { types } from "node:util";
import { randomUUID } from "node:crypto";
import { AsyncLocalStorage } from "node:async_hooks";
import os from "node:os";
import { spawnSync } from "node:child_process";
import "node:perf_hooks";
import "node:util/types";
import { setFlagsFromString } from "node:v8";
//#region src/infra/diagnostic-flags-env.ts
function parseDiagnosticEnvFlags(raw) {
	const trimmed = raw?.trim() ?? "";
	const lowered = trimmed.toLowerCase();
	if (!lowered) return {
		flags: [],
		disablesAll: false
	};
	if ([
		"0",
		"false",
		"off",
		"none"
	].includes(lowered)) return {
		flags: [],
		disablesAll: true
	};
	if ([
		"1",
		"true",
		"all",
		"*"
	].includes(lowered)) return {
		flags: ["*"],
		disablesAll: false
	};
	return {
		flags: trimmed.split(/[,\s]+/),
		disablesAll: false
	};
}
//#endregion
//#region node-sqlite.mjs
function probeSqlite(DatabaseSync) {
	const result = {
		available: false,
		version: null,
		text: false,
		blob: false,
		json: false
	};
	let database;
	try {
		database = new DatabaseSync(":memory:");
		result.available = true;
		const version = database.prepare("SELECT sqlite_version() AS version").get()?.version;
		result.version = typeof version === "string" ? version : null;
		const text = "a\0b\0";
		const bytes = Buffer.from(text, "utf8");
		const json = JSON.stringify({ value: text });
		database.exec("CREATE TABLE probe (text_value TEXT, blob_value BLOB, json_value TEXT)");
		database.prepare("INSERT INTO probe VALUES (?, ?, ?)").run(text, bytes, json);
		const row = database.prepare("SELECT text_value, blob_value, json_value FROM probe").get();
		result.text = typeof row?.text_value === "string" && row.text_value.length === 4 && Buffer.from(row.text_value, "utf8").equals(bytes);
		result.blob = row?.blob_value instanceof Uint8Array && Buffer.from(row.blob_value).equals(bytes);
		result.json = row?.json_value === json && JSON.parse(row.json_value).value === text;
	} catch (error) {
		result.error = error instanceof Error ? error.message : String(error);
	} finally {
		database?.close();
	}
	return result;
}
function isSqliteWalResetSafeVersion(value) {
	const match = /^(\d+)\.(\d+)\.(\d+)$/u.exec(value.trim());
	if (!match) return false;
	const [major, minor, patch] = match.slice(1).map(Number);
	if (![
		major,
		minor,
		patch
	].every(Number.isSafeInteger)) return false;
	return major > 3 || major === 3 && (minor > 51 || minor === 51 && patch >= 3 || minor === 50 && patch >= 7 || minor === 44 && patch >= 6);
}
`${probeSqlite.toString()}`;
//#endregion
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
					const { probeSqliteNativeClose } = await import("./openclaw-state-read-bun-sqlite-close-probe-BB0jbYfr.mjs");
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
/** Select once, before any SQLite open; shared across CLI and bundled SDK module graphs. */
function ensureSqliteLibrarySelected(options) {
	return runtimeSelector()(options);
}
//#endregion
//#region src/state/openclaw-state-db.paths.ts
function resolveDatabasePath(options = {}) {
	return options.path === void 0 ? resolveOpenClawStateSqlitePath(options.env ?? process.env) : normalizeDatabasePath(path.resolve(options.path));
}
function existingPathOrUndefined(pathname) {
	try {
		statSync(pathname);
		return pathname;
	} catch (error) {
		if (hasNodeErrorCode(error, "ENOENT")) return;
		throw error;
	}
}
/** Resolve the directory that contains the shared state SQLite file. */
function resolveOpenClawStateSqliteDir(env = process.env) {
	return path.dirname(resolveOpenClawStateSqlitePath(env));
}
/** Resolve the shared state SQLite file path. */
function resolveOpenClawStateSqlitePath(env = process.env) {
	return normalizeDatabasePath(path.join(resolveStateDir(env), "state", "openclaw.sqlite"));
}
/** Resolve the state owner directory for a canonical or explicit shared database path. */
function resolveOpenClawStateDirForDatabasePath(databasePath) {
	const databaseDir = path.dirname(path.resolve(databasePath));
	return path.basename(databaseDir) === "state" ? path.dirname(databaseDir) : databaseDir;
}
/** Resolve the integrity/quarantine store that survives loss of the primary state database. */
function resolveQuarantineStorePath(env) {
	return path.join(resolveOpenClawStateSqliteDir(env), "openclaw-quarantine.sqlite");
}
/** Resolve the durable registry form for one agent database path. */
function resolveOpenClawAgentDatabaseStoredPath(registryDatabasePath, agentDatabasePath) {
	const windows = process.platform === "win32";
	const rawStateDir = resolveOpenClawStateDirForDatabasePath(registryDatabasePath);
	let stateDir = windows ? normalizeWindowsPathPreservingCase(rawStateDir) : rawStateDir;
	const absolutePath = windows && path.isAbsolute(agentDatabasePath) ? agentDatabasePath : path.resolve(agentDatabasePath);
	const comparisonPath = windows ? normalizeWindowsPathPreservingCase(absolutePath) : absolutePath;
	if (!path.isAbsolute(stateDir) || !path.isAbsolute(comparisonPath)) return absolutePath;
	let relativePath = path.relative(stateDir, comparisonPath);
	const useCanonicalRoot = relativePath.startsWith("..") || path.isAbsolute(relativePath) || windows && !isPathInside(rawStateDir, absolutePath);
	if (useCanonicalRoot) {
		const canonicalRoot = resolveIdentityPathViaExistingAncestorSync(stateDir);
		if (windows && !isPathInside(canonicalRoot, absolutePath)) return absolutePath;
		stateDir = windows ? normalizeWindowsPathPreservingCase(canonicalRoot) : canonicalRoot;
		if (!path.isAbsolute(stateDir)) return absolutePath;
		relativePath = path.relative(stateDir, comparisonPath);
	}
	if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) return absolutePath;
	if (useCanonicalRoot && !windows) return relativePath;
	const rawPrefix = [stateDir, path.toNamespacedPath(stateDir)].map((root) => `${root}${root.endsWith(path.sep) ? "" : path.sep}`).find((prefix) => agentDatabasePath.startsWith(prefix));
	return path.isAbsolute(agentDatabasePath) && rawPrefix !== void 0 ? agentDatabasePath.slice(rawPrefix.length) : relativePath;
}
/** Resolve one stored agent database registry path for runtime consumers. */
function resolveOpenClawRegisteredAgentDatabasePath(registryDatabasePath, storedPath) {
	return path.isAbsolute(storedPath) ? storedPath : `${resolveOpenClawStateDirForDatabasePath(registryDatabasePath)}${path.sep}${storedPath}`;
}
function describeAgentPathMigration(summary) {
	const { relativized, reanchored, deleted } = summary;
	if (relativized === 0 && reanchored.length === 0 && deleted.length === 0) return [];
	const decisions = reanchored.length + deleted.length;
	const counts = [
		`${relativized} relativized`,
		reanchored.length > 0 && `${reanchored.length} re-anchored`,
		deleted.length > 0 && `${deleted.length} removed`
	].filter(Boolean);
	return [
		`Migrated agent database registry paths to state-relative storage${decisions > 0 ? ` (${counts.join(", ")})` : ""}`,
		...reanchored.map((registeredPath) => `Re-anchored agent database registry path ${registeredPath} to the current state directory`),
		...deleted.map((registeredPath) => `Removed duplicate agent database registry path ${registeredPath}`)
	];
}
function warnAgentPathMigration(log, summary, databasePath) {
	if (summary.reanchored.length === 0 && summary.deleted.length === 0) return;
	log.warn("agent database registry rows re-anchored or removed during v9 migration", {
		reanchored: summary.reanchored,
		deleted: summary.deleted,
		path: databasePath
	});
}
//#endregion
//#region src/utils/zod-parse.ts
/**
* Null-returning Zod parse helpers for plugin and runtime boundaries.
*
* Callers use these where invalid external payloads should be ignored or
* recovered from without constructing and catching validation errors.
*/
/** Safely validates an unknown value with a Zod schema, returning null on validation failure. */
function safeParseWithSchema(schema, value) {
	const parsed = schema.safeParse(value);
	return parsed.success ? parsed.data : null;
}
/** Parses JSON, then safely validates it with a Zod schema, returning null for parse or schema failures. */
function safeParseJsonWithSchema(schema, raw) {
	try {
		return safeParseWithSchema(schema, JSON.parse(raw));
	} catch {
		return null;
	}
}
//#endregion
//#region src/infra/update-managed-service-handoff-schema.ts
const text = string().min(1).max(4096);
const nativeProcessIdentityShape = {
	pid: number().int().positive(),
	startIdentity: text.max(128)
};
const processIdentitySchema = strictObject({
	...nativeProcessIdentityShape,
	startIdentitySource: literal("argv-sha256").nullable().optional()
}).refine(({ startIdentity, startIdentitySource }) => startIdentitySource === "argv-sha256" ? /^win32-argv-sha256:[a-f0-9]{64}$/.test(startIdentity) : !startIdentity.startsWith("win32-argv-sha256:"));
const managedHandoffBootSchema = union([
	strictObject({
		platform: _enum(["linux", "darwin"]),
		identity: string().regex(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i)
	}),
	strictObject({
		platform: literal("win32"),
		identity: string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{7}Z$/)
	}),
	strictObject({
		platform: literal("freebsd"),
		identity: string().regex(/^[a-f0-9]{32}$/)
	})
]);
const nativeLifetimeSchema = strictObject({
	kind: literal("native"),
	unit: text,
	scope: text,
	placement: discriminatedUnion("kind", [strictObject({ kind: literal("pending") }), strictObject({
		kind: literal("attached"),
		invocation: string().regex(/^[a-f0-9]{32}$/i)
	})])
});
const cancellationProtocol = literal("original-cancellation-v1");
const updateAction = strictObject({
	kind: literal("update"),
	mutationProtocol: cancellationProtocol
}).extend({
	mutationProtocol: cancellationProtocol.optional(),
	custody: _enum(["reserved", "bound"]).optional()
});
const actionSchema = discriminatedUnion("kind", [updateAction, strictObject({
	kind: literal("triage"),
	phase: _enum([
		"reserved",
		"running",
		"closing",
		"closed",
		"uncertain"
	]),
	lifetime: discriminatedUnion("kind", [strictObject({
		kind: literal("foreground"),
		boot: managedHandoffBootSchema
	}), nativeLifetimeSchema])
}).refine((action) => action.phase !== "running" || action.lifetime.kind !== "native" || action.lifetime.placement.kind === "attached")]);
const sourcePath = text.refine(path.isAbsolute, "Native source path must be absolute");
const digest = string().regex(/^[a-f0-9]{64}$/);
const nativeBorrowerSourceSchema = strictObject({
	runId: text,
	transactionId: text,
	claimId: text,
	revision: number().int().nonnegative(),
	recordSha256: digest,
	serviceKey: sourcePath,
	configPaths: array(sourcePath).min(1).max(512),
	lifetimeId: text
});
const nativeBorrowerSchema = strictObject({
	id: string().uuid(),
	phase: _enum(["reserved", "admitted"]),
	source: nativeBorrowerSourceSchema
});
const commonPayload = {
	executor: processIdentitySchema,
	helper: processIdentitySchema,
	action: actionSchema
};
const originalUpdateSchema = strictObject({
	version: literal(2),
	executor: processIdentitySchema,
	helper: processIdentitySchema,
	action: updateAction
});
const originalGenerationSchema = strictObject({
	key: text,
	owner: text,
	payload: string().min(1),
	updatedAt: number().int().nonnegative()
});
const cancellingPayloadSchema = strictObject({
	version: literal(4),
	executor: processIdentitySchema,
	helper: processIdentitySchema,
	action: updateAction,
	cancellation: originalGenerationSchema
}).refine((value) => {
	const original = safeParseJsonWithSchema(originalUpdateSchema, value.cancellation.payload);
	return original !== null && JSON.stringify(original.helper) === JSON.stringify(value.helper) && JSON.stringify(original.executor) === JSON.stringify(value.executor) && JSON.stringify(original.action) === JSON.stringify(value.action) && (JSON.stringify(value.helper) === JSON.stringify(value.executor) || original.action.mutationProtocol === "original-cancellation-v1");
});
const currentPayloadSchema = strictObject({
	version: literal(2),
	...commonPayload,
	mutationOriginal: originalGenerationSchema.optional()
}).refine((value) => {
	if (!value.mutationOriginal) return true;
	const original = safeParseJsonWithSchema(originalUpdateSchema, value.mutationOriginal.payload);
	return original !== null && !value.mutationOriginal.key.includes("/.openclaw-update-child-") && original.action.mutationProtocol === "original-cancellation-v1";
});
discriminatedUnion("version", [
	cancellingPayloadSchema,
	currentPayloadSchema,
	strictObject({
		version: literal(3),
		...commonPayload,
		action: strictObject({ kind: literal("update") }),
		nativeBorrower: nativeBorrowerSchema
	})
]);
strictObject({
	version: literal(1),
	...nativeProcessIdentityShape
});
//#endregion
//#region src/infra/update-managed-service-handoff-boot.ts
/** Bind the lease environment without caching boot identity or selecting an OS early. */
function createManagedHandoffBootIdentityReader(serviceManagerEnv) {
	return function bootIdentity() {
		let value;
		if (process.platform === "linux") value = fs.readFileSync("/proc/sys/kernel/random/boot_id", "utf8").trim();
		else if ([
			"freebsd",
			"darwin",
			"win32"
		].includes(process.platform)) {
			const freebsd = process.platform === "freebsd";
			const windows = process.platform === "win32";
			const result = spawnSync(windows ? "powershell.exe" : freebsd ? "/sbin/sysctl" : "/usr/sbin/sysctl", windows ? [
				"-NoProfile",
				"-NonInteractive",
				"-Command",
				"(Get-CimInstance -ClassName Win32_OperatingSystem).LastBootUpTime.ToUniversalTime().ToString('o')"
			] : freebsd ? ["-b", "kern.boot_id"] : ["-n", "kern.bootsessionuuid"], {
				env: serviceManagerEnv,
				...freebsd ? { maxBuffer: 16 } : {
					encoding: "utf8",
					windowsHide: true
				},
				timeout: windows ? 5e3 : 1e3,
				killSignal: "SIGKILL",
				stdio: [
					"ignore",
					"pipe",
					"ignore"
				]
			});
			if (!result.error && result.status === 0) value = freebsd ? Buffer.isBuffer(result.stdout) && result.stdout.length === 16 ? result.stdout.toString("hex") : void 0 : result.stdout.toString().trim();
		}
		const boot = {
			platform: process.platform,
			identity: process.platform === "win32" ? value : value?.toLowerCase()
		};
		const parsed = managedHandoffBootSchema.safeParse(boot);
		if (!parsed.success) throw new Error("OS boot identity unavailable; run openclaw triage manually");
		return parsed.data;
	};
}
//#endregion
//#region src/infra/gateway-lock-payload.ts
const GATEWAY_OWNER_HEARTBEAT_MS = 15e3;
const GATEWAY_OWNER_HEARTBEAT_STALE_MS = 9e4;
const [uuidBoot, windowsBoot, freebsdBoot] = managedHandoffBootSchema.options;
const host = string().min(1);
const GatewayProcessNamespaceSchema = discriminatedUnion("platform", [
	uuidBoot.extend({
		host,
		platform: literal("linux"),
		pidNsInode: string().min(1)
	}),
	uuidBoot.extend({
		host,
		platform: literal("darwin")
	}),
	windowsBoot.extend({ host }),
	freebsdBoot.extend({ host })
]);
let processNamespace;
/** Cache OS subprocess failures too; only Linux's cheap /proc probes remain retryable. */
function readGatewayLockProcessNamespace() {
	if (processNamespace?.platform === process.platform && (processNamespace.value !== null || process.platform !== "linux")) return processNamespace.value;
	try {
		const boot = createManagedHandoffBootIdentityReader(process.env)();
		const value = GatewayProcessNamespaceSchema.parse({
			host: os.hostname(),
			...boot,
			...boot.platform === "linux" ? { pidNsInode: fs.statSync("/proc/self/ns/pid", { bigint: true }).ino.toString() } : {}
		});
		processNamespace = {
			platform: value.platform,
			value
		};
		return value;
	} catch {
		processNamespace = {
			platform: process.platform,
			value: null
		};
		return null;
	}
}
/** Diagnostic facts never grant ownership; callers still classify the recorded holder. */
function describeGatewayLockHolder(holder, lockPath, localState) {
	const namespace = GatewayProcessNamespaceSchema.safeParse(holder.processNamespace).data;
	let heartbeatAt = holder.heartbeatAt;
	if (lockPath) try {
		heartbeatAt = fs.statSync(lockPath).mtimeMs;
	} catch {}
	const ageMs = heartbeatAt === void 0 ? void 0 : Date.now() - heartbeatAt;
	const location = `${namespace?.host ?? holder.host ?? "unknown host"}${namespace?.platform === "linux" ? `/pid-ns ${namespace.pidNsInode}` : ""}`;
	const action = localState === "live" ? `The holder ${holder.pid} is alive on this host, stop it first` : localState === "unknown" ? "Stop the holder before retrying" : `wait ${Math.max(1, Math.floor((GATEWAY_OWNER_HEARTBEAT_STALE_MS - (ageMs ?? 0)) / 1e3) + 1)} s and retry`;
	return `holder ${holder.pid ?? "unknown"} at ${location}, last renewed ${ageMs === void 0 ? "at an unknown time" : `${Math.max(0, Math.floor(ageMs / 1e3))} s ago`}. ${action}.`;
}
var GatewayLockNamespaceError = class extends Error {
	constructor(holder, lockPath) {
		super(`cannot verify Gateway ownership from this process (different PID namespace); the owner heartbeat is fresh — run this command inside the Gateway container or with a shared PID namespace. If the previous Gateway stopped, wait up to 90 seconds after its last heartbeat. ${describeGatewayLockHolder(holder, lockPath)}`);
		this.name = "GatewayLockNamespaceError";
	}
};
/** Qualify PID evidence before any local process probe or same-PID authority shortcut. */
function classifyGatewayLockProcessNamespace(value, lockPath) {
	return classifyGatewayOwnerProcessNamespace(value, { readHeartbeatAt: () => lockPath ? fs.statSync(lockPath).mtimeMs : void 0 });
}
/** File locks and SQLite leases share one boot/namespace and heartbeat policy. */
function classifyGatewayOwnerProcessNamespace(value, options = {}) {
	const owner = GatewayProcessNamespaceSchema.safeParse(value).data;
	const ownerHost = owner?.host ?? options.ownerHost;
	const foreignHost = ownerHost !== void 0 && ownerHost !== os.hostname();
	if (!foreignHost && process.platform === "win32" && owner?.platform === "win32") return "same";
	if (value === void 0 && !foreignHost) return "same";
	const current = readGatewayLockProcessNamespace();
	if (owner && current) {
		if (owner.platform === current.platform && owner.host === current.host && owner.identity !== current.identity) return "dead";
		if (owner.platform === current.platform && owner.identity === current.identity && (owner.platform !== "linux" || current.platform === "linux" && owner.pidNsInode === current.pidNsInode)) return "same";
	} else if (process.platform !== "linux" && !foreignHost) return "same";
	try {
		const heartbeatAt = options.readHeartbeatAt?.();
		return heartbeatAt !== void 0 && Date.now() - heartbeatAt > 9e4 ? "dead" : "unknown";
	} catch {
		return "unknown";
	}
}
const LockPayloadSchema = object({
	pid: number(),
	ownerId: string().min(1).optional(),
	/** A cold opener may wait for this transient owner, never enter while it is held. */
	stateOwnerKind: literal("schema").optional(),
	/** Present when Gateway cron writes use the dynamic-default ownership projection. */
	cronOwnerProjection: literal("dynamic-default-v1").optional(),
	createdAt: string(),
	startupPhase: literal("starting").optional(),
	configPath: string(),
	port: number().int().min(1).max(65535).optional(),
	role: _enum([
		"gateway",
		"agent-embedded",
		"skill-workshop-apply",
		"sqlite-maintenance"
	]).optional(),
	stateDir: string().optional(),
	startTime: number().optional(),
	processNamespace: GatewayProcessNamespaceSchema.nullable().optional()
});
function parseGatewayLockPayload(raw) {
	return safeParseJsonWithSchema(LockPayloadSchema, raw);
}
//#endregion
//#region src/infra/gateway-state-owner-record.ts
/** Admission and reclamation use the same namespace-qualified PID evidence. */
function isGatewayStateOwnerDefinitelyStale(value, lockPath) {
	const payload = isRecord(value) ? value : null;
	const namespace = classifyGatewayLockProcessNamespace(payload?.processNamespace, lockPath);
	if (namespace === "unknown") throw new GatewayLockNamespaceError(payload ?? {}, lockPath);
	return namespace === "dead" || isLockOwnerDefinitelyStale({ payload: payload ? {
		pid: payload.pid,
		starttime: payload.startTime
	} : null });
}
var StateDatabaseAccessError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "StateDatabaseAccessError";
	}
};
const GatewayStateOwnerContentionError = resolveGlobalSingleton(Symbol.for("openclaw.gatewayStateOwnerContentionError"), () => class StateOwnerContentionError extends Error {
	constructor(databasePath, cause, holderDetail, holder) {
		super(`OpenClaw state database is busy at ${databasePath}. ${holderDetail ? `${holderDetail} ` : ""}Wait for the other OpenClaw process to finish, then retry. If it persists, run \`openclaw gateway status\` and check for other OpenClaw processes using the same state directory. A running Gateway can hold this ownership until it stops; stop it through its service manager or original terminal before retrying.`);
		this.databasePath = databasePath;
		this.cause = cause;
		this.holderDetail = holderDetail;
		this.holder = holder;
		this.name = "GatewayStateOwnerContentionError";
	}
});
/** A local holder exists, but the caller has no live lexical maintenance authority. */
const StateDatabaseMaintenanceScopeError = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseMaintenanceScopeError"), () => class extends StateDatabaseAccessError {
	constructor(databasePath) {
		super(`Internal state ownership error at ${databasePath}: this process holds maintenance ownership without an active schema lease or maintenance scope. Retry the command; if it persists, report this error.`);
		this.databasePath = databasePath;
		this.name = "StateDatabaseMaintenanceScopeError";
	}
});
const StateDatabaseAdmissionPendingError = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseAdmissionPendingError"), () => class extends StateDatabaseAccessError {
	constructor(databasePath, message) {
		super(message);
		this.databasePath = databasePath;
	}
});
/** A live foreign process holds offline-maintenance custody of this database. */
const StateDatabaseOfflineMaintenanceError = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseOfflineMaintenanceError"), () => class extends StateDatabaseAccessError {
	constructor(databasePath, message) {
		super(message);
		this.databasePath = databasePath;
	}
});
/** Persisted ownership can identify a holder but cannot lend this process maintenance authority. */
function assertPersistedStateDatabaseAccessAllowed(params) {
	const { databasePath, ownerPath, assertMaintenance } = params;
	const unavailable = `OpenClaw state ownership at ${databasePath} could not be verified from ${ownerPath}; restart the Gateway.`;
	let raw;
	try {
		raw = fs.readFileSync(ownerPath, "utf8");
	} catch (error) {
		if (extractErrorCode(error) === "ENOENT") return;
		throw new StateDatabaseAccessError(unavailable, { cause: error });
	}
	const owner = parseGatewayLockPayload(raw);
	if (!owner) throw new StateDatabaseAdmissionPendingError(databasePath, unavailable);
	if (!Number.isSafeInteger(owner.pid) || owner.pid <= 0) throw new StateDatabaseAccessError(unavailable);
	if (isGatewayStateOwnerDefinitelyStale(owner, ownerPath)) return;
	if (owner.pid === process.pid && !isMainThread) return;
	if (!isPidAlive(owner.pid)) throw new StateDatabaseAccessError(unavailable);
	const role = owner.role ?? "gateway";
	if (role === "gateway" || role === "agent-embedded") return;
	if (owner.pid === process.pid) {
		assertMaintenance();
		return;
	}
	const maintenancePending = `OpenClaw state at ${databasePath} is undergoing offline maintenance; retry when it finishes. For update progress, run \`openclaw update status --json\`.`;
	if (owner.stateOwnerKind === "schema" && owner.role === "sqlite-maintenance") throw new StateDatabaseAdmissionPendingError(databasePath, maintenancePending);
	throw new StateDatabaseOfflineMaintenanceError(databasePath, maintenancePending);
}
function defaultPayload(databasePath) {
	const stateDir = resolveOpenClawStateDirForDatabasePath(databasePath);
	const startTime = getFileLockProcessStartTime(process.pid);
	return {
		pid: process.pid,
		ownerId: randomUUID(),
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		stateDir,
		configPath: path.join(stateDir, "openclaw.json"),
		role: "sqlite-maintenance",
		processNamespace: readGatewayLockProcessNamespace(),
		...startTime === null ? {} : { startTime }
	};
}
//#endregion
//#region src/infra/sqlite-worker-contract.ts
const processMonotonicClock = process.hrtime;
/** Monotonic nanoseconds for deadlines measured within the calling thread. */
function readSqliteWorkerMonotonicNs() {
	return processMonotonicClock.bigint();
}
const SQLITE_WORKER_MAX_MESSAGE_BYTES = 33554432;
const retainedWorkerErrorCode = Symbol.for("openclaw.sqliteWorkerErrorCode");
/** Only the factory's admission before agent open may certify this refusal. */
const SqliteWorkerOpenRefusedError = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerOpenRefusedError"), () => class OpenRefusedError extends Error {
	constructor(originalError) {
		super("SQLite worker admission was refused before agent open", { cause: originalError });
		this.originalError = originalError;
		this.name = "SqliteWorkerOpenRefusedError";
	}
});
const SqliteWorkerAdmissionTimeoutError = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerAdmissionTimeoutError"), () => class AdmissionTimeoutError extends Error {
	constructor() {
		super("SQLite host admission timed out; retry after transaction rollback");
		this.code = "admission-timeout";
		this.name = "SqliteWorkerAdmissionTimeoutError";
	}
});
var SqliteWorkerError = class extends Error {
	constructor(message, code) {
		super(message);
		this.code = code;
		this.name = "SqliteWorkerError";
		Object.defineProperty(this, retainedWorkerErrorCode, { value: code });
	}
};
/** Carry only canonical worker classification through a local cleanup aggregate. */
function retainSqliteWorkerErrorCode(error, source) {
	let code;
	try {
		code = Object.getOwnPropertyDescriptor(source, retainedWorkerErrorCode)?.value;
	} catch {
		return error;
	}
	if (code === "closed" || code === "overloaded" || code === "unavailable" || code === "outcome-unknown") {
		Object.defineProperty(error, retainedWorkerErrorCode, { value: code });
		Object.assign(error, { code });
	}
	return error;
}
//#endregion
//#region src/infra/runtime-process-url.ts
const sealedEntrypoints = /* @__PURE__ */ new Map();
function resolveRuntimeProcessEntrypointUrl(name) {
	return sealedEntrypoints.get(name) ?? resolveRuntimeWorkerUrl(runtimeProcessEntrypoints[name]);
}
//#endregion
//#region src/infra/runtime-worker-generation.ts
const scope = resolveGlobalSingleton(Symbol.for("openclaw.runtimeWorkerGeneration"), () => new AsyncLocalStorage());
/** Capture before queues or detached pool contexts discard the caller's scope. */
function captureRuntimeWorkerSource(url) {
	const generation = scope.getStore()?.generation;
	const bound = generation?.resolve(url);
	return bound && bound.href !== url.href ? {
		moduleUrl: bound,
		runtimeGeneration: generation
	} : { moduleUrl: url };
}
//#endregion
//#region worker-heap-flag.mjs
const startupFlags = `${process.execArgv.join(" ")} ${process.env.NODE_OPTIONS ?? ""}`;
const heapFlag = /--max[-_](?:old[-_]space[-_]size(?:[-_]percentage)?|heap[-_]size)(?:=|\s)/u;
const immutableFlags = /--(?:freeze[-_]flags[-_]after[-_]init|(?:abort|exit)[-_]on[-_]contradictory[-_]flags)(?:=(?:true|1))?(?:\s|$)/u;
if (isMainThread && !process.versions.bun && heapFlag.test(startupFlags)) {
	if (immutableFlags.test(startupFlags)) process.emitWarning("V8 startup flags prevent enforcing per-worker heap limits.");
	else setFlagsFromString("--max-old-space-size=0 --max-heap-size=0");
}
//#endregion
//#region src/infra/main-thread-stall.ts
const taskState = resolveGlobalSingleton(Symbol.for("openclaw.mainThreadTask"), () => ({}));
function runWithMainThreadTask(name, run) {
	const observer = taskState.observer;
	if (!observer) return run();
	const exit = observer.enter(name);
	try {
		return run();
	} finally {
		exit();
	}
}
//#endregion
//#region src/infra/worker-message-metrics.ts
const counters = resolveGlobalSingleton(Symbol.for("openclaw.workerMessageMetrics"), () => /* @__PURE__ */ new Map());
/** The main endpoint counts each crossing once, using byte lengths already known by its owner. */
function recordWorkerMessage(kind, direction, payloadBytes) {
	if (!isMainThread) return;
	let directions = counters.get(kind);
	if (!directions) {
		directions = {};
		counters.set(kind, directions);
	}
	const counter = directions[direction] ??= {
		kind,
		direction,
		messages: 0,
		payloadBytes: 0,
		unmeasuredMessages: 0
	};
	counter.messages++;
	if (payloadBytes === void 0) counter.unmeasuredMessages++;
	else counter.payloadBytes += payloadBytes;
}
function messageData(message) {
	return isRecord(message) && !types.isProxy(message) ? message : void 0;
}
function dataProperty(message, key) {
	return Object.getOwnPropertyDescriptor(message, key)?.value;
}
function messageBody(message) {
	const data = messageData(message);
	const type = data && dataProperty(data, "type");
	return data && (type === "post" || type === "message") ? dataProperty(data, "value") : message;
}
/** Known payload bytes only: no serialization, graph traversal, or envelope estimate. */
function workerMessagePayloadBytes(message) {
	if (!isMainThread) return;
	const body = messageBody(message);
	const data = messageData(body);
	const payload = data && (Object.getOwnPropertyDescriptor(data, "value") ?? Object.getOwnPropertyDescriptor(data, "input"));
	if (payload && !("value" in payload)) return;
	const value = payload ? payload.value : body;
	if (types.isProxy(value)) return;
	if (ArrayBuffer.isView(value) || value instanceof ArrayBuffer) {
		const preparation = data && dataProperty(data, "type") === "open" ? dataProperty(data, "preparation") : void 0;
		return value.byteLength + (ArrayBuffer.isView(preparation) ? preparation.byteLength : 0);
	}
	if (typeof value === "string") return value.length * 2;
	if (value === null || value === void 0) return 0;
}
function messageKind(message, fallback) {
	const body = messageData(messageBody(message));
	if (!body) return fallback;
	switch (dataProperty(body, "status")) {
		case "ok":
		case "failed": return "task_reply";
		case "request": return "task_request";
		case "notification": return "task_notification";
		case "consumed": return "task_consumed";
		case "memory": return "memory";
		case "ready": return "lifecycle";
	}
	if (typeof dataProperty(body, "taskId") === "number") return "task_input";
	if (typeof dataProperty(body, "actor") === "number") return "sqlite_request";
	if (typeof dataProperty(body, "id") === "number" && typeof dataProperty(body, "ok") === "boolean") return "sqlite_reply";
	if (typeof dataProperty(body, "operationId") === "number") switch (dataProperty(body, "type")) {
		case "prepare":
		case "reclaim":
		case "canonical-validation": return "sqlite_request";
		case "reclaimed":
		case "refused":
		case "checkpoint": return "sqlite_reply";
		case "admission":
		case "admission-request":
		case "admission-release": return "admission";
		case "commit-request": return "authority";
	}
	switch (dataProperty(body, "type")) {
		case "resource-owner":
		case "resource-message":
		case "resource-closed": return "resource";
		case "cpu":
		case "heap": return "memory";
		case "create":
		case "created":
		case "stop":
		case "stopped":
		case "close":
		case "closed":
		case "release":
		case "ref":
		case "execution-exit":
		case "error":
		case "messageerror":
		case "create-error":
		case "stop-error":
		case "request-error": return "lifecycle";
	}
	return dataProperty(body, "closeResource") === true ? "resource" : fallback;
}
/** Observe each native boundary once; null preserves a prepared unknown byte count. */
function observeWorkerMessage(message, direction, fallbackKind = "other", payloadBytes) {
	if (isMainThread) recordWorkerMessage(messageKind(message, fallbackKind), direction, payloadBytes === void 0 ? workerMessagePayloadBytes(message) : payloadBytes ?? void 0);
}
//#endregion
//#region src/infra/worker-cpu.ts
function workerScriptName(filename, evalSource = false) {
	if (evalSource || filename instanceof URL && filename.protocol !== "file:") return "other";
	const name = basename(filename instanceof URL ? fileURLToPath(filename) : filename).replace(/\.[cm]?[jt]s$/u, ".js");
	return normalizeDiagnosticWorkerScript(name);
}
const trackedWorkers = resolveGlobalSingleton(Symbol.for("openclaw.workerCpuSources"), () => {
	process.on("worker", trackWorker);
	return {
		gcObserver: void 0,
		revision: 0,
		nextPoolId: 0,
		poolIds: /* @__PURE__ */ new WeakMap(),
		workers: /* @__PURE__ */ new Map(),
		lifecycle: /* @__PURE__ */ new Map()
	};
});
function createCpuTrackedWorker(...args) {
	const worker = runWithMainThreadTask(`worker:${workerScriptName(args[0], args[1]?.eval)}`, () => new Worker(...args));
	trackNativeWorkerForCpu(worker, args[0], args[1]?.eval);
	trackedWorkers.workers.get(worker).internalMessages = true;
	return worker;
}
/** Register a physical child only after its native lifetime owner confirms construction. */
function trackNativeWorkerForCpu(worker, filename, evalSource = false) {
	trackWorker(worker);
	const source = trackedWorkers.workers.get(worker);
	source.script = workerScriptName(filename, evalSource);
	if (source.script === "code-mode-node.worker.js" && source.workerSlot === void 0) {
		const occupied = new Set([...trackedWorkers.workers.values()].map((entry) => entry.workerSlot));
		for (let slot = 1; slot <= 64; slot++) if (!occupied.has(slot)) {
			source.workerSlot = slot;
			break;
		}
	}
	source.lifecycleMessages = source.script === "openclaw-state-lease-heartbeat.worker.js" || source.script === "gateway-state-owner-heartbeat.worker.js";
}
/** Pool identity follows its live Workers without retaining the pool itself. */
function attributeWorkerToPool(worker, pool) {
	const source = trackedWorkers.workers.get(worker);
	if (!source) return;
	let poolId = trackedWorkers.poolIds.get(pool);
	if (poolId === void 0) {
		poolId = ++trackedWorkers.nextPoolId;
		trackedWorkers.poolIds.set(pool, poolId);
	}
	source.poolId = poolId;
}
function forgetWorker(worker) {
	const source = trackedWorkers.workers.get(worker);
	if (!source) return;
	const counts = countWorkerStart(source);
	const reason = source.retirementReason ?? "exit";
	counts.retired.set(reason, (counts.retired.get(reason) ?? 0) + 1);
	source.memoryPort?.close();
	trackedWorkers.workers.delete(worker);
	trackedWorkers.revision++;
}
function countWorkerStart(source) {
	let counts = trackedWorkers.lifecycle.get(source.script);
	if (!counts) {
		counts = {
			started: 0,
			retired: /* @__PURE__ */ new Map()
		};
		trackedWorkers.lifecycle.set(source.script, counts);
	}
	if (!source.started) {
		source.started = true;
		counts.started++;
	}
	return counts;
}
/** Record the owner's reason now; only confirmed native exit increments retirement. */
function markWorkerRetirement(worker, reason) {
	const source = trackedWorkers.workers.get(worker);
	if (source) source.retirementReason ??= reason;
}
function canObserveWorkerMessages(worker) {
	if (!Object.isExtensible(worker)) return false;
	for (const method of ["postMessage", "emit"]) {
		let owner = worker;
		while (owner) {
			const descriptor = Object.getOwnPropertyDescriptor(owner, method);
			if (descriptor) {
				if (!descriptor.writable || typeof descriptor.value !== "function") return false;
				break;
			}
			owner = Reflect.getPrototypeOf(owner);
		}
		if (!owner) return false;
	}
	return true;
}
function trackWorker(worker) {
	if (trackedWorkers.workers.has(worker)) return;
	if (isMainThread && worker instanceof Worker) recordWorkerMessage("lifecycle", "to_worker");
	if (isMainThread && worker instanceof Worker && canObserveWorkerMessages(worker)) {
		const nativePrototype = Object.getPrototypeOf(worker) === Worker.prototype;
		const postMessage = !nativePrototype || Object.hasOwn(worker, "postMessage") ? worker.postMessage : void 0;
		worker.postMessage = function(value, transferList) {
			const bytes = source.internalMessages ? workerMessagePayloadBytes(value) : void 0;
			(postMessage ?? Worker.prototype.postMessage).call(this, value, transferList);
			if (source.lifecycleMessages) recordWorkerMessage("lifecycle", "to_worker", bytes);
			else if (source.internalMessages) observeWorkerMessage(value, "to_worker", "other", bytes ?? null);
			else recordWorkerMessage("other", "to_worker");
		};
		const emit = !nativePrototype || Object.hasOwn(worker, "emit") ? worker.emit : void 0;
		worker.emit = function(event, ...args) {
			if (event === "message") {
				if (source.lifecycleMessages) recordWorkerMessage("lifecycle", "from_worker", workerMessagePayloadBytes(args[0]));
				else if (source.internalMessages) observeWorkerMessage(args[0], "from_worker");
				else recordWorkerMessage("other", "from_worker");
			}
			return (emit ?? Worker.prototype.emit).call(this, event, ...args);
		};
	}
	let pending = false;
	const source = {
		script: "other",
		async cpuUsage() {
			if (pending) return;
			pending = true;
			try {
				return await worker.cpuUsage();
			} catch {
				return;
			} finally {
				pending = false;
			}
		}
	};
	trackedWorkers.workers.set(worker, source);
	queueMicrotask(() => countWorkerStart(source));
	trackedWorkers.revision++;
	worker.once("exit", () => forgetWorker(worker));
}
/** The existing registry owns this channel until native exit, never the submitting task. */
function receiveWorkerMemoryPort(worker, message) {
	if (!isRecord(message) || message.status !== "memory" || !(message.port instanceof MessagePort)) return false;
	const port = message.port;
	const source = trackedWorkers.workers.get(worker);
	if (!source || source.memoryPort || worker.threadId === -1) {
		port.close();
		return true;
	}
	source.memoryPort = port;
	source.memoryPending = true;
	const close = () => {
		source.memoryPort = void 0;
		source.memoryPending = false;
		source.memoryUnavailable = true;
		port.close();
	};
	port.on("message", (record) => {
		recordWorkerMessage("memory", "from_worker", ("heapUsed" in record ? 32 + (record.heapSizeLimitBytes === void 0 ? 0 : 8) : 0) + (record.gc?.length ?? 0) * 8);
		if (record.gc) trackedWorkers.gcObserver?.(record.gc, source.script, source.workerSlot);
		if (!("heapUsed" in record)) return;
		delete record.gc;
		source.heap = {
			value: record,
			sampledAt: performance.now()
		};
		source.memoryPending = false;
		source.memoryUnavailable = false;
	});
	port.once("close", close);
	port.once("messageerror", close);
	port.unref();
	if (trackedWorkers.gcObserver) {
		port.postMessage({ gc: true });
		recordWorkerMessage("memory", "to_worker", 1);
	}
	return true;
}
//#endregion
export { describeAgentPathMigration as A, SQLITE_EXPECTED_SCHEMA_CONTRACTS_KEY as B, defaultPayload as C, classifyGatewayOwnerProcessNamespace as D, GatewayProcessNamespaceSchema as E, resolveOpenClawStateDirForDatabasePath as F, getSqliteRuntimeCapabilities as G, captureSqliteWorkerClosePolicy as H, resolveOpenClawStateSqliteDir as I, isSqliteWalResetSafeVersion as K, resolveOpenClawStateSqlitePath as L, resolveDatabasePath as M, resolveOpenClawAgentDatabaseStoredPath as N, describeGatewayLockHolder as O, resolveOpenClawRegisteredAgentDatabasePath as P, resolveQuarantineStorePath as R, assertPersistedStateDatabaseAccessAllowed as S, GATEWAY_OWNER_HEARTBEAT_MS as T, captureSqliteWorkerEnvironmentData as U, SQLITE_NATIVE_RUNTIME_ADMISSION_KEY as V, ensureSqliteLibrarySelected as W, retainSqliteWorkerErrorCode as _, trackNativeWorkerForCpu as a, StateDatabaseMaintenanceScopeError as b, workerMessagePayloadBytes as c, resolveRuntimeProcessEntrypointUrl as d, SQLITE_WORKER_MAX_MESSAGE_BYTES as f, readSqliteWorkerMonotonicNs as g, SqliteWorkerOpenRefusedError as h, receiveWorkerMemoryPort as i, existingPathOrUndefined as j, parseGatewayLockPayload as k, runWithMainThreadTask as l, SqliteWorkerError as m, createCpuTrackedWorker as n, observeWorkerMessage as o, SqliteWorkerAdmissionTimeoutError as p, parseDiagnosticEnvFlags as q, markWorkerRetirement as r, recordWorkerMessage as s, attributeWorkerToPool as t, captureRuntimeWorkerSource as u, GatewayStateOwnerContentionError as v, isGatewayStateOwnerDefinitelyStale as w, StateDatabaseOfflineMaintenanceError as x, StateDatabaseAdmissionPendingError as y, warnAgentPathMigration as z };
