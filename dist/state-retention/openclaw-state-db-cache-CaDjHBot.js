import { C as isRecord, _ as resolveGlobalSingleton, a as normalizeWindowsPathPreservingCase, b as asNullableRecord, c as resolveGatewayLockDirForCanonicalStateDir, d as resolveTimerTimeoutMs, h as readGlobalSingleton, i as normalizeWindowsPathForComparison$1, m as tryProcessCwd, n as isAbortError, p as resolveRequiredOsHomeDir, r as isPathInside$1, s as resolveGatewayLockDir, t as shortenHomePath, u as resolveStateDir, v as hasErrnoCode, x as asOptionalObjectRecord, y as isMissingPathError } from "./utils-B-DHHhI2.js";
import { C as normalizeLowercaseStringOrEmpty, S as pruneMapToMaxSize, a as resolveIdentityPathViaExistingAncestorSync, c as emitTrustedDiagnosticEvent, d as registerListener, f as getPluginExecutionFrame, g as extractErrorCode, h as coerceErrorMessage, l as normalizeDiagnosticWorkerScript, m as expectDefined, n as getChildLogger, o as registerSignalExitFinalizer, p as hasInternalDiagnosticEventInterest, r as resolvePreferredOpenClawTmpDir, s as areDiagnosticsEnabledForProcess, t as createSubsystemLogger, u as notifyListeners, v as toErrorObject, w as normalizeOptionalString, x as escapeRegExp, y as sliceUtf16Safe } from "./subsystem-CP45WUTs.js";
import "./fs-safe-CzwmM6_G.js";
import { t as racePromiseWithAbortSignal } from "./src-BKPJ0Inm.js";
import { a as runtimeProcessEntrypoints, i as SQLITE_READONLY_CHILD_ARG } from "./runtime-binary-CdkouFWt.js";
import { n as resolveRuntimeWorkerThreadExecArgv, r as resolveRuntimeWorkerUrl, t as resolveRuntimeWorkerArgv } from "./runtime-worker-url-DNkRHXuZ.js";
import { a as mergeProcessEnv, i as isPidDefinitelyDead, n as getFileLockProcessStartTime, r as isPidAlive } from "./crypto-digest-eF9tKo3c.js";
import { t as formatErrorMessage } from "./errors-D6bSEK7E.js";
import { createRequire } from "node:module";
import path, { basename, posix } from "node:path";
import fs, { realpath, stat } from "node:fs/promises";
import { isPathInside, normalizeWindowsPathForComparison } from "@openclaw/fs-safe/path";
import { isDeepStrictEqual, toUSVString, types } from "node:util";
import fs$1, { chmodSync, existsSync, fstatSync, readdirSync, realpathSync, statSync, unlinkSync, writeFileSync, default as openClawRootFsSync } from "node:fs";
import { createDirectorySync, readFileDescriptorBoundedSync, readFileWindowFullySync, sameFileIdentity } from "@openclaw/fs-safe/advanced";
import "@openclaw/fs-safe/durability";
import { FsSafeError } from "@openclaw/fs-safe/errors";
import { createHash, hash, randomUUID } from "node:crypto";
import os, { availableParallelism, tmpdir } from "node:os";
import { AsyncLocalStorage, AsyncResource } from "node:async_hooks";
import { channel } from "node:diagnostics_channel";
import { setImmediate as setImmediate$1 } from "node:timers/promises";
import { MessageChannel, MessagePort, Worker, getEnvironmentData, isMainThread, receiveMessageOnPort, setEnvironmentData, threadId, workerData } from "node:worker_threads";
import { fileURLToPath, pathToFileURL } from "node:url";
import { performance as performance$1 } from "node:perf_hooks";
import { execFile, spawn, spawnSync } from "node:child_process";
import { isUtf8 } from "node:buffer";
import { InsertQueryNode, Kysely, PostgresDialect, PostgresQueryCompiler, SelectQueryNode, SqliteDialect, sql } from "kysely";
import { parse } from "semver";
import { Socket } from "node:net";
import { deserialize, serialize, setFlagsFromString } from "node:v8";
import { EventEmitter } from "node:events";
import { acquireFileLockSync } from "@openclaw/fs-safe/file-lock";
import "@openclaw/fs-safe/copy";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region packages/normalization-core/src/string-normalization.ts
/** Coerces entries to strings, trims them, and drops empty results. */
function normalizeStringEntries(list) {
	return (list ?? []).map((entry) => String(entry).trim()).filter(Boolean);
}
/** Normalizes string entries and lowercases each retained value. */
function normalizeStringEntriesLower(list) {
	return normalizeStringEntries(list).map((entry) => entry.toLowerCase());
}
/** Returns first-seen unique values while preserving insertion order. */
function uniqueValues(values) {
	return [...new Set(values)];
}
/** Returns first-seen unique strings while preserving insertion order. */
function uniqueStrings(values) {
	return uniqueValues(values);
}
/** Lowercases normalized entries, removes empties/duplicates, and preserves first-seen order. */
function normalizeUniqueStringEntriesLower(values) {
	return uniqueStrings(normalizeStringEntriesLower(values ? [...values] : void 0));
}
//#endregion
//#region packages/normalization-core/src/result.ts
/** Create a successful {@link Result}. */
function ok(value) {
	return {
		ok: true,
		value
	};
}
/** Create a failed {@link Result}. */
function err(error) {
	return {
		ok: false,
		error
	};
}
//#endregion
//#region packages/normalization-core/src/agent-id.ts
const DEFAULT_AGENT_ID = "main";
const VALID_ID_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/i;
const INVALID_CHARS_RE = /[^a-z0-9_-]+/g;
const LEADING_DASH_RE = /^-+/;
const TRAILING_DASH_RE = /-+$/;
/** Normalizes an OpenClaw agent id to its filesystem-safe canonical form. */
function normalizeAgentId(value) {
	const result = normalizeAgentIdStrict(value);
	return result.ok ? result.value : DEFAULT_AGENT_ID;
}
/** Normalizes an explicitly supplied agent id without falling back to the default agent. */
function normalizeAgentIdStrict(value) {
	const trimmed = (value ?? "").trim();
	const normalized = trimmed.toLowerCase();
	if (VALID_ID_RE.test(trimmed)) return ok(normalized);
	const agentId = normalized.replace(INVALID_CHARS_RE, "-").replace(LEADING_DASH_RE, "").replace(TRAILING_DASH_RE, "").slice(0, 64);
	return agentId ? ok(agentId) : err("unrepresentable");
}
//#endregion
//#region \0@oxc-project+runtime@0.152.0/helpers/esm/usingCtx.js
function _usingCtx() {
	var r = "function" == typeof SuppressedError ? SuppressedError : function(r, e) {
		var n = Error();
		return n.name = "SuppressedError", n.error = r, n.suppressed = e, n;
	}, e = {}, n = [];
	function using(r, e) {
		if (null != e) {
			if (Object(e) !== e) throw new TypeError("using declarations can only be used with objects, functions, null, or undefined.");
			if (r) var o = e[Symbol.asyncDispose || Symbol["for"]("Symbol.asyncDispose")];
			if (void 0 === o && (o = e[Symbol.dispose || Symbol["for"]("Symbol.dispose")], r)) var t = o;
			if ("function" != typeof o) throw new TypeError("Object is not disposable.");
			t && (o = function o() {
				try {
					t.call(e);
				} catch (r) {
					return Promise.reject(r);
				}
			}), n.push({
				v: e,
				d: o,
				a: r
			});
		} else r && n.push({
			d: e,
			a: r
		});
		return e;
	}
	return {
		e,
		u: using.bind(null, !1),
		a: using.bind(null, !0),
		d: function d() {
			var o, t = this.e, s = 0;
			function next() {
				for (; o = n.pop();) try {
					if (!o.a && 1 === s) return s = 0, n.push(o), Promise.resolve().then(next);
					if (o.d) {
						var r = o.d.call(o.v);
						if (o.a) return s |= 2, Promise.resolve(r).then(next, err);
					} else s |= 1;
				} catch (r) {
					return err(r);
				}
				if (1 === s) return t !== e ? Promise.reject(t) : Promise.resolve();
				if (t !== e) throw t;
			}
			function err(n) {
				return t = t !== e ? new r(n, t) : n, next();
			}
			return next();
		}
	};
}
//#endregion
//#region src/daemon/constants.ts
const NODE_LAUNCH_AGENT_LABEL = "ai.openclaw.node";
const NODE_SYSTEMD_SERVICE_NAME = "openclaw-node";
const NODE_WINDOWS_TASK_NAME = "OpenClaw Node";
const NODE_SERVICE_MARKER = "openclaw";
const NODE_SERVICE_KIND = "node";
const NODE_WINDOWS_TASK_SCRIPT_NAME = "node.cmd";
function resolveNodeLaunchAgentLabel() {
	return NODE_LAUNCH_AGENT_LABEL;
}
function resolveNodeSystemdServiceName() {
	return NODE_SYSTEMD_SERVICE_NAME;
}
function resolveNodeWindowsTaskName() {
	return NODE_WINDOWS_TASK_NAME;
}
function resolveNodeServiceIdentityEnvironment() {
	return {
		OPENCLAW_LAUNCHD_LABEL: resolveNodeLaunchAgentLabel(),
		OPENCLAW_SYSTEMD_UNIT: resolveNodeSystemdServiceName(),
		OPENCLAW_WINDOWS_TASK_NAME: resolveNodeWindowsTaskName(),
		OPENCLAW_WINDOWS_TASK_HIDDEN_LAUNCHER: "1",
		OPENCLAW_TASK_SCRIPT_NAME: NODE_WINDOWS_TASK_SCRIPT_NAME,
		OPENCLAW_LOG_PREFIX: "node",
		OPENCLAW_SERVICE_MARKER: NODE_SERVICE_MARKER,
		OPENCLAW_SERVICE_KIND: NODE_SERVICE_KIND
	};
}
//#endregion
//#region packages/normalization-core/src/format.ts
const BYTE_SIZE_UNITS = [
	"byte",
	"kilo",
	"mega",
	"giga",
	"tera"
];
const BYTE_SIZE_STYLES = {
	iec: {
		base: 1024,
		labels: [
			"B",
			"KiB",
			"MiB",
			"GiB",
			"TiB"
		]
	},
	"legacy-binary": {
		base: 1024,
		labels: [
			"B",
			"KB",
			"MB",
			"GB",
			"TB"
		]
	}
};
/** Formats a byte count with caller-explicit scale, labels, precision, and unit cap. */
function formatByteSize(bytes, options) {
	const { base, labels } = BYTE_SIZE_STYLES[options.style];
	const maxUnitIndex = BYTE_SIZE_UNITS.indexOf(options.maxUnit);
	let unitIndex = 0;
	let value = bytes;
	while (value >= base && unitIndex < maxUnitIndex) {
		value /= base;
		unitIndex += 1;
	}
	const unit = expectDefined(BYTE_SIZE_UNITS[unitIndex], "byte-size unit");
	const label = expectDefined(labels[unitIndex], "byte-size label");
	const fractionDigits = typeof options.fractionDigits === "function" ? options.fractionDigits(value, unit) : options.fractionDigits;
	if (fractionDigits === null) return `${value}${options.separator}${label}`;
	if (options.floorUnits?.includes(unit)) value = Math.floor(value * 10 ** fractionDigits) / 10 ** fractionDigits;
	return `${value.toFixed(fractionDigits)}${options.separator}${label}`;
}
//#endregion
//#region packages/normalization-core/src/node-crypto.ts
function sha256Hex(input) {
	return hash("sha256", input, "hex");
}
function sha256HexPrefixCore(input, length) {
	return sha256Hex(input).slice(0, length);
}
//#endregion
//#region packages/worker-runtime/src/retained-operation.ts
/** One producer settlement serves awaited callers and its named synchronous consumer. */
function createRetainedOperation(service, options = {}) {
	const completion = Promise.withResolvers();
	let outcome = Object.freeze({ status: "pending" });
	if (options.observeRejection !== false) completion.promise.catch(() => void 0);
	return {
		operation: {
			result: completion.promise,
			read: () => outcome,
			service
		},
		resolve(value) {
			if (outcome.status !== "pending") return;
			outcome = Object.freeze({
				status: "fulfilled",
				value
			});
			completion.resolve(value);
		},
		reject(error) {
			if (outcome.status !== "pending") return;
			outcome = Object.freeze({
				status: "rejected",
				error
			});
			completion.reject(error);
		}
	};
}
function driveRetainedOperation(source, advance, onError) {
	const inContext = AsyncLocalStorage.snapshot();
	let servicing = false;
	const serviceInContext = () => inContext(service);
	const completion = createRetainedOperation(serviceInContext);
	function service() {
		if (servicing || completion.operation.read().status !== "pending") return;
		servicing = true;
		try {
			advance(completion, serviceInContext);
		} catch (error) {
			try {
				completion.reject(onError ? onError(error) : error);
			} catch (combined) {
				completion.reject(combined);
			}
		} finally {
			servicing = false;
		}
	}
	source.result.then(serviceInContext, serviceInContext);
	completion.operation.service();
	return completion.operation;
}
/** Transform settled facts without making Promise reactions part of their progress. */
function mapRetainedOperation(source, receive) {
	return driveRetainedOperation(source, (completion) => {
		source.service();
		const outcome = source.read();
		if (outcome.status === "fulfilled") completion.resolve(receive(outcome.value));
		else if (outcome.status === "rejected") completion.reject(outcome.error);
	});
}
//#endregion
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
//#region src/infra/sqlite-database-admission-key.ts
const SQLITE_DATABASE_ADMISSIONS_KEY = "openclaw.sqliteDatabaseAdmissions.v1";
//#endregion
//#region node-version.mjs
const NODE_RELEASE_VERSION_RE = /^v?((?:0|[1-9]\d*))\.((?:0|[1-9]\d*))\.((?:0|[1-9]\d*))(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/u;
const NODE_RELEASE_FLOORS = [{
	major: 24,
	minor: 16,
	patch: 0
}, {
	major: 26,
	minor: 1,
	patch: 0
}];
NODE_RELEASE_FLOORS[NODE_RELEASE_FLOORS.length - 1];
`${NODE_RELEASE_FLOORS.map(({ major, minor, patch }, index) => `>=${major}.${minor}.${patch}${index < NODE_RELEASE_FLOORS.length - 1 ? ` <${major + 1}` : ""}`).join(" || ").replaceAll(" || ", ", ").replace(/, ([^,]+)$/, ", or $1")}`;
/** Parses an anchored release SemVer, allowing a leading v and valid build metadata. */
function parseNodeReleaseVersion(value) {
	if (typeof value !== "string") return null;
	const match = NODE_RELEASE_VERSION_RE.exec(value.trim());
	if (!match) return null;
	const version = {
		major: Number(match[1]),
		minor: Number(match[2]),
		patch: Number(match[3])
	};
	return Object.values(version).every(Number.isSafeInteger) ? version : null;
}
function isNodeVersionAtLeast(version, minimum) {
	if (!version) return false;
	if (version.major !== minimum.major) return version.major > minimum.major;
	if (version.minor !== minimum.minor) return version.minor > minimum.minor;
	return version.patch >= minimum.patch;
}
function renderProcessNodeVersionCheck() {
	return `((value) => {
  if (typeof value !== "string") return false;
  const match = new RegExp(${JSON.stringify(NODE_RELEASE_VERSION_RE.source)}, "u").exec(value.trim());
  if (!match) return false;
  const version = { major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3]) };
  if (!Object.values(version).every(Number.isSafeInteger)) return false;
  const floors = ${JSON.stringify(NODE_RELEASE_FLOORS)};
  const minimum = floors.find((floor) => floor.major === version.major);
  const atLeast = (floor) =>
    version.major > floor.major ||
    (version.major === floor.major &&
      (version.minor > floor.minor ||
        (version.minor === floor.minor && version.patch >= floor.patch)));
  return minimum ? atLeast(minimum) : version.major > floors[floors.length - 1].major;
})(process.versions.node)`;
}
renderProcessNodeVersionCheck();
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
					const { probeSqliteNativeClose } = await import("./bun-sqlite-close-probe-BHmSoDxQ.js");
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
/** Select once, before any SQLite open; shared across CLI and bundled SDK module graphs. */
function ensureSqliteLibrarySelected(options) {
	return runtimeSelector()(options);
}
//#endregion
//#region packages/normalization-core/src/promise-like.ts
/** Canonical thenable guard; use instead of local isPromiseLike copies. */
function isPromiseLike(value) {
	if (value === null || typeof value !== "object" && typeof value !== "function") return false;
	try {
		return typeof value.then === "function";
	} catch {
		return false;
	}
}
//#endregion
//#region src/infra/sql-connection.ts
const postgresConnectionBrand = Symbol.for("openclaw.postgres-sync-connection");
function isPostgresSqlConnection(db) {
	return postgresConnectionBrand in db && db[postgresConnectionBrand] === true;
}
/** Publications and receipts must key on the store anchor for every engine. */
function sqlPublicationAnchor(db) {
	return isPostgresSqlConnection(db) ? db.anchor : db;
}
//#endregion
//#region src/infra/sqlite-worker-identity.ts
const useDatabaseBirthtime = process.platform !== "linux" && process.platform !== "android";
function databaseFileIdentityKey(file) {
	return `${file.dev}:${file.ino}`;
}
function readDatabaseIdentityBirthtime(file) {
	return useDatabaseBirthtime ? file.birthtimeNs.toString() : "0";
}
/** Native SQLite namespaces are filesystem locators, not distinct database owners. */
function normalizeDatabasePath(location) {
	const normalized = process.platform === "win32" ? normalizeWindowsPathPreservingCase(location) : location;
	return process.platform === "win32" && !/^(?:[a-z]:[\\/]|[\\/]{2})/iu.test(normalized) ? location : normalized;
}
function readDatabaseFileIdentity(value) {
	if (!value || typeof value !== "object" || Array.isArray(value) || !("key" in value) || typeof value.key !== "string" || !/^file:(?:0|[1-9]\d{0,19}):(?:0|[1-9]\d{0,19})$/.test(value.key) || "birthtime" in value && value.birthtime !== void 0 && (typeof value.birthtime !== "string" || !/^-?(?:0|[1-9]\d{0,29})$/.test(value.birthtime))) throw new Error("SQLite snapshot requires a captured physical file identity");
	return {
		key: value.key,
		..."birthtime" in value && typeof value.birthtime === "string" ? { birthtime: value.birthtime } : {}
	};
}
function assertDatabaseFileIdentity(file, expected) {
	if (!file.isFile() || `file:${databaseFileIdentityKey(file)}` !== expected.key || expected.birthtime !== void 0 && readDatabaseIdentityBirthtime(file) !== expected.birthtime) throw new Error("SQLite database file identity changed before existing-only open");
}
function existingIdentity(file, canonicalFile, canonicalPath) {
	if (!file.isFile()) throw new Error("SQLite worker database path must identify a regular file");
	if (file.dev !== canonicalFile.dev || file.ino !== canonicalFile.ino || readDatabaseIdentityBirthtime(file) !== readDatabaseIdentityBirthtime(canonicalFile)) throw new Error("SQLite database pathname changed during admission");
	return {
		key: `file:${databaseFileIdentityKey(file)}`,
		canonicalPath: normalizeDatabasePath(canonicalPath),
		birthtime: readDatabaseIdentityBirthtime(file)
	};
}
function missingAncestorParent(ancestor, missing, error) {
	if (!hasErrnoCode(error, "ENOENT")) throw error;
	missing.unshift(path.basename(ancestor));
	const parent = path.dirname(ancestor);
	if (parent === ancestor) throw error;
	return parent;
}
/** In-process owner key only; never rewrite a configured or persisted database locator. */
function resolveDatabasePathKey(databasePath) {
	let ancestor = path.resolve(databasePath);
	const missing = [];
	while (true) try {
		return normalizeDatabasePath(path.join(realpathSync.native(ancestor), ...missing));
	} catch (error) {
		ancestor = missingAncestorParent(ancestor, missing, error);
	}
}
/** Inspect a native-owner path without replacing its diagnostic for a non-file target. */
function inspectDatabasePathIdentitySync(databasePath) {
	const resolvedPath = path.resolve(databasePath);
	let file;
	try {
		file = statSync(resolvedPath, { bigint: true });
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
	}
	if (file) {
		if (!file.isFile()) return;
		const canonicalPath = resolveDatabasePathKey(resolvedPath);
		return existingIdentity(file, statSync(canonicalPath, { bigint: true }), canonicalPath);
	}
	const canonicalPath = resolveDatabasePathKey(resolvedPath);
	return {
		key: `path:${canonicalPath}`,
		canonicalPath
	};
}
/** Capture identity before yielding; worker admission requires a regular file or absent path. */
function readDatabasePathIdentitySync(databasePath) {
	const identity = inspectDatabasePathIdentitySync(databasePath);
	if (!identity) throw new Error("SQLite worker database path must identify a regular file");
	return identity;
}
/** Inspect retained aliases only while binding a newly observed database path. */
function findChangedDatabasePaths(paths, observed) {
	return [...paths].filter((pathname) => inspectDatabasePathIdentitySync(pathname)?.key !== observed.key);
}
async function readDatabasePathIdentity(databasePath) {
	const file = await stat(databasePath, { bigint: true }).catch((error) => {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	});
	if (file) try {
		const canonicalPath = await realpath(databasePath);
		return existingIdentity(file, await stat(canonicalPath, { bigint: true }), canonicalPath);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) throw new Error("SQLite database pathname changed during admission", { cause: error });
		throw error;
	}
	const missing = [];
	let ancestor = databasePath;
	while (true) try {
		const canonicalPath = normalizeDatabasePath(path.join(await realpath(ancestor), ...missing));
		return {
			key: `path:${canonicalPath}`,
			canonicalPath
		};
	} catch (error) {
		ancestor = missingAncestorParent(ancestor, missing, error);
	}
}
function assertExistingDatabaseIdentity(databasePath, expected, expectedBirthtime) {
	assertDatabaseFileIdentity(statSync(databasePath, { bigint: true }), {
		key: expected,
		birthtime: expectedBirthtime
	});
}
function isSoleDatabaseFileDescriptor(descriptor, file) {
	if (process.platform !== "linux") return false;
	try {
		for (const name of readdirSync("/proc/self/fd")) {
			if (!/^\d+$/u.test(name) || Number(name) === descriptor) continue;
			try {
				const other = fstatSync(Number(name), { bigint: true });
				if (other.dev === file.dev && other.ino === file.ino) return false;
			} catch (error) {
				if (!hasErrnoCode(error, "EBADF")) return false;
			}
		}
		return true;
	} catch {
		return false;
	}
}
//#endregion
//#region src/infra/sqlite-database-admission-record.ts
function readSqliteDatabaseAdmissionIdentity(file) {
	return `${file.dev}:${file.ino}:${readDatabaseIdentityBirthtime(file)}`;
}
const SqliteDatabaseGenerationSlot = {
	schemaRevision: 0,
	factRevision: 1,
	publicationRevision: 2,
	retired: 3,
	writeRevision: 4,
	hostRevision: 5,
	unscopedWriteRevision: 6,
	writeScopeRevision: 7,
	sealPresent: 8
};
const SQLITE_DATABASE_GENERATION_LENGTH = Object.keys(SqliteDatabaseGenerationSlot).length;
function readSqliteDatabaseAdmissions(value) {
	return Array.isArray(value) ? value : void 0;
}
function isSqliteDatabaseAdmissionRetired(record) {
	return readSqliteDatabaseGeneration(record, "retired") !== 0;
}
function isSqliteDatabaseAdmissionFactCurrent(record, fact) {
	return !isSqliteDatabaseAdmissionRetired(record) && Atomics.load(new Int32Array(fact.current), 0) === 1 && fact.revision === readSqliteDatabaseFactRevision(record, fact.schemaDependent);
}
function hasSqliteDatabaseSchemaAdmission(record) {
	const fact = record?.facts.get("sqlite-schema");
	return Boolean(record && fact && isSqliteDatabaseAdmissionFactCurrent(record, fact));
}
function readSqliteDatabaseFactRevision(record, schemaDependent) {
	return readSqliteDatabaseGeneration(record, schemaDependent ? "schemaRevision" : "factRevision");
}
function readSqliteDatabaseGeneration(record, slot) {
	return Atomics.load(new Int32Array(record.generation), SqliteDatabaseGenerationSlot[slot]);
}
function advanceSqliteDatabaseGeneration(record, slot) {
	return Atomics.add(new Int32Array(record.generation), SqliteDatabaseGenerationSlot[slot], 1);
}
function publishSqliteDatabaseFact(record, key, value, revision, publication) {
	if (revision !== readSqliteDatabaseFactRevision(record, key.schemaDependent)) return false;
	if (key.writer === "host") advanceSqliteDatabaseGeneration(record, "hostRevision");
	const previous = record.facts.get(key.name);
	if (previous) Atomics.store(new Int32Array(previous.current), 0, 0);
	const current = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
	Atomics.store(new Int32Array(current), 0, 1);
	record.facts.set(key.name, {
		value,
		revision,
		schemaDependent: key.schemaDependent === true,
		publication,
		current
	});
	advanceSqliteDatabaseGeneration(record, "publicationRevision");
	return true;
}
function createSqliteDatabaseAdmissionCursor() {
	return {
		revision: -1,
		records: /* @__PURE__ */ new WeakMap()
	};
}
function changedAdmissionEntries(current, previous) {
	const changed = /* @__PURE__ */ new Map();
	for (const [key, value] of current) if (previous.get(key) !== value) changed.set(key, value);
	return changed;
}
var SqliteDatabaseAdmissionRegistry = class {
	constructor() {
		this.records = /* @__PURE__ */ new Map();
		this.locations = /* @__PURE__ */ new Map();
		this.published = /* @__PURE__ */ new Map();
		this.descriptors = /* @__PURE__ */ new Map();
		this.revision = 0;
	}
	changeReferences(record, change) {
		let references = record.references.get(threadId);
		if (!references) {
			references = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
			record.references.set(threadId, references);
		}
		if (Atomics.add(new Int32Array(references), 0, change) + change !== (change === 1 ? 1 : 0)) return false;
		if (change === -1) this.retireUnreferenced(record);
		this.publish(record);
		return true;
	}
	retireUnreferenced(record) {
		if (threadId !== 0 || [...record.references.values()].some((references) => Atomics.load(new Int32Array(references), 0) > 0)) return;
		Atomics.compareExchange(new Int32Array(record.generation), SqliteDatabaseGenerationSlot.retired, 0, 2);
		record.facts.clear();
		record.writeScopes.clear();
	}
	releaseWorker(owner) {
		for (const record of this.records.values()) {
			const references = owner > 0 ? record.references.get(owner) : void 0;
			if (!references) continue;
			const priorReferences = Atomics.exchange(new Int32Array(references), 0, -1);
			this.retireUnreferenced(record);
			if (priorReferences <= 0) continue;
			advanceSqliteDatabaseGeneration(record, "writeRevision");
			advanceSqliteDatabaseGeneration(record, "unscopedWriteRevision");
		}
		this.publish();
	}
	observeLocation(location, identity) {
		this.locations.set(normalizeDatabasePath(path.resolve(location)), identity);
	}
	forLocation(location) {
		const identity = this.locations.get(normalizeDatabasePath(path.resolve(location)));
		const record = identity === void 0 ? void 0 : this.records.get(identity);
		return record && !isSqliteDatabaseAdmissionRetired(record) ? record : void 0;
	}
	hasSchemaAdmissionForIdentity(physicalIdentity) {
		if (!physicalIdentity.key.startsWith("file:") || physicalIdentity.birthtime === void 0) return false;
		const key = `${physicalIdentity.key.slice(5)}:${physicalIdentity.birthtime}`;
		return hasSqliteDatabaseSchemaAdmission(this.records.get(key));
	}
	forget(identity) {
		this.records.delete(identity);
		this.published.delete(identity);
		for (const [location, observed] of this.locations) if (observed === identity) this.locations.delete(location);
	}
	retainDescriptor(location, descriptor, opened) {
		const record = {
			identity: readSqliteDatabaseAdmissionIdentity(opened),
			physicalIdentity: {
				key: `file:${opened.dev}:${opened.ino}`,
				birthtime: readDatabaseIdentityBirthtime(opened)
			},
			location,
			descriptor,
			descriptorOwner: 0,
			generationId: randomUUID(),
			generation: new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * SQLITE_DATABASE_GENERATION_LENGTH),
			writeScopes: /* @__PURE__ */ new Map(),
			writeScopeRevision: 0,
			references: /* @__PURE__ */ new Map(),
			facts: /* @__PURE__ */ new Map()
		};
		this.records.set(record.identity, record);
		this.descriptors.set(record.identity, descriptor);
		this.observeLocation(location, record.identity);
		this.publish(record);
		return record;
	}
	/** Only the joined lifecycle owner may release a retained descriptor. */
	retireDescriptor(identity, options) {
		const record = this.records.get(identity);
		const descriptor = this.descriptors.get(identity) ?? record?.descriptor;
		if (descriptor === void 0) return false;
		const file = fs$1.fstatSync(descriptor, { bigint: true });
		if (file.nlink > 1n || options.requireSoleDescriptor && !isSoleDatabaseFileDescriptor(descriptor, file)) return false;
		if (record) Atomics.store(new Int32Array(record.generation), SqliteDatabaseGenerationSlot.retired, 1);
		fs$1.closeSync(descriptor);
		this.descriptors.delete(identity);
		this.forget(identity);
		this.publish();
		return true;
	}
	publish(record) {
		if (record && this.records.get(record.identity) !== record) return;
		for (const current of this.records.values()) {
			if (isSqliteDatabaseAdmissionRetired(current)) {
				if (readSqliteDatabaseGeneration(current, "retired") === 1) this.descriptors.delete(current.identity);
				this.forget(current.identity);
				continue;
			}
			if (record && current !== record) continue;
			let changed = current === record;
			for (const [owner, references] of current.references) if (Atomics.load(new Int32Array(references), 0) < 0) {
				current.references.delete(owner);
				changed = true;
			}
			for (const [key, revision] of current.writeScopes) if (Atomics.load(revision.state, 1) !== 0) {
				current.writeScopes.delete(key);
				changed = true;
			}
			if (!changed) continue;
			if (threadId === 0) current.writeScopeRevision = readSqliteDatabaseGeneration(current, "writeScopeRevision");
			this.published.set(current.identity, {
				...current,
				facts: new Map(current.facts),
				writeScopes: new Map(current.writeScopes),
				references: new Map(current.references),
				hostRevision: threadId === 0 ? readSqliteDatabaseGeneration(current, "hostRevision") : current.hostRevision
			});
		}
		this.revision++;
		setEnvironmentData(SQLITE_DATABASE_ADMISSIONS_KEY, [...this.published.values()]);
	}
	capture(cursor, identities) {
		if (!identities && !cursor) this.publish();
		if (!identities && cursor?.revision === this.revision) return [];
		const records = identities ? [...identities].flatMap((identity) => {
			const record = this.published.get(identity);
			return record && !isSqliteDatabaseAdmissionRetired(record) ? [record] : [];
		}) : [...this.published.values()];
		if (!cursor) return records;
		if (!identities) cursor.revision = this.revision;
		return records.flatMap((record) => {
			const previous = cursor.records.get(record.generation);
			if (previous === record) return [];
			cursor.records.set(record.generation, record);
			return [previous ? {
				...record,
				facts: changedAdmissionEntries(record.facts, previous.facts),
				writeScopes: changedAdmissionEntries(record.writeScopes, previous.writeScopes),
				references: changedAdmissionEntries(record.references, previous.references)
			} : record];
		});
	}
	install(admissions) {
		for (const incoming of admissions) {
			let record = this.records.get(incoming.identity);
			if (incoming.descriptorOwner !== 0 || isSqliteDatabaseAdmissionRetired(incoming)) {
				if (record && isSqliteDatabaseAdmissionRetired(record)) this.publish(record);
				continue;
			}
			let changed = false;
			if (record && isSqliteDatabaseAdmissionRetired(record)) record = void 0;
			if (!record) {
				record = {
					...incoming,
					hostRevision: void 0
				};
				this.records.set(incoming.identity, record);
				this.observeLocation(incoming.location, incoming.identity);
				changed = true;
			} else if (record.generationId !== incoming.generationId) continue;
			for (const [key, fact] of incoming.facts) if (isSqliteDatabaseAdmissionFactCurrent(incoming, fact) && record.facts.get(key)?.publication !== fact.publication) {
				record.facts.set(key, fact);
				changed = true;
			}
			for (const [key, revision] of incoming.writeScopes) {
				if (Atomics.load(revision.state, 1) !== 0) continue;
				const previous = record.writeScopes.get(key);
				if (previous?.identity === revision.identity || threadId === 0 && previous && Atomics.load(previous.state, 1) === 0) continue;
				if (threadId === 0) advanceSqliteDatabaseGeneration(record, "writeScopeRevision");
				record.writeScopes.set(key, revision);
				changed = true;
			}
			const writeScopeRevision = readSqliteDatabaseGeneration(record, "writeScopeRevision");
			if (threadId === 0 || incoming.writeScopeRevision === writeScopeRevision) {
				changed ||= record.writeScopeRevision !== writeScopeRevision;
				record.writeScopeRevision = writeScopeRevision;
			}
			for (const [owner, references] of incoming.references) if (!record.references.has(owner) && Atomics.load(new Int32Array(references), 0) >= 0) {
				record.references.set(owner, references);
				changed = true;
			}
			if (threadId !== 0 && incoming.hostRevision !== void 0 && incoming.hostRevision !== record.hostRevision && incoming.hostRevision === readSqliteDatabaseGeneration(record, "hostRevision")) {
				record.hostRevision = incoming.hostRevision;
				changed = true;
			}
			this.retireUnreferenced(record);
			if (changed || isSqliteDatabaseAdmissionRetired(record)) this.publish(record);
		}
	}
};
//#endregion
//#region src/infra/sqlite-native-admission.ts
const state$3 = resolveGlobalSingleton(Symbol.for("openclaw.sqliteNativeAdmissions"), () => ({ operations: /* @__PURE__ */ new WeakMap() }));
function getSqliteNativeAdmissionFacts(database) {
	return state$3.operations.get(database)?.facts;
}
/** Callback-local facts may describe an implicit statement transaction that can still abort. */
function beginSqliteDatabaseAdmissionOperation(database) {
	const current = state$3.operations.get(database) ?? {
		depth: 0,
		facts: /* @__PURE__ */ new Map()
	};
	current.depth += 1;
	state$3.operations.set(database, current);
	return () => {
		current.depth -= 1;
		if (current.depth === 0) state$3.operations.delete(database);
	};
}
//#endregion
//#region src/infra/sqlite-database-admission-read.ts
/** Admission lookups consume the owning registry and transaction-local state. */
function createSqliteDatabaseAdmissionReader(owner) {
	const { state, admission, pathAdmission, exchange, publishFact } = owner;
	function getSqliteDatabaseAdmission(database, key, options = {}) {
		const anchor = sqlPublicationAnchor(database);
		if (!anchor.isOpen || state.suspended.has(anchor)) return;
		const record = admission(anchor, options.existingOnly !== true && !database.isTransaction);
		if (!record) return;
		const local = (isPostgresSqlConnection(database) ? void 0 : getSqliteNativeAdmissionFacts(database))?.get(key.name) ?? state.local.get(anchor)?.get(key.name);
		if (local && local.revision === readSqliteDatabaseFactRevision(record, local.schemaDependent) && (!local.schemaDependent || local.ddlRevision === (state.ddlRevisions.get(anchor) ?? 0))) return key.read(local.value);
		if (key.schemaDependent && state.schemaDirty.has(anchor)) return;
		if (state.rolledBack.has(anchor)) {
			if (database.isTransaction) return;
			state.rolledBack.delete(anchor);
		}
		let fact = record.facts.get(key.name);
		if (!fact || !isSqliteDatabaseAdmissionFactCurrent(record, fact)) {
			if (key.writer === "host") {
				if (database.isTransaction || threadId === 0 || record.hostRevision === readSqliteDatabaseGeneration(record, "hostRevision")) return;
				exchange(record);
				fact = record.facts.get(key.name);
				return fact && isSqliteDatabaseAdmissionFactCurrent(record, fact) ? key.read(fact.value) : void 0;
			}
			const revision = readSqliteDatabaseGeneration(record, "publicationRevision");
			const misses = state.misses.get(record) ?? /* @__PURE__ */ new Map();
			state.misses.set(record, misses);
			if (!database.isTransaction && misses.get(key.name) !== revision) {
				exchange(record);
				fact = record.facts.get(key.name);
				misses.set(key.name, readSqliteDatabaseGeneration(record, "publicationRevision"));
			}
		}
		return fact && isSqliteDatabaseAdmissionFactCurrent(record, fact) ? key.read(fact.value) : void 0;
	}
	function getOrLoadSqliteDatabaseAdmissionForPath(location, key, load) {
		const record = pathAdmission(location);
		const fact = record?.facts.get(key.name);
		const cached = record && fact && isSqliteDatabaseAdmissionFactCurrent(record, fact) ? key.read(fact.value) : void 0;
		if (cached !== void 0) return cached;
		const generation = record ? readSqliteDatabaseFactRevision(record, key.schemaDependent) : void 0;
		const value = load();
		if (record && generation !== void 0 && value !== void 0) publishFact(record, key, value, generation);
		return value;
	}
	return {
		getSqliteDatabaseAdmission,
		getOrLoadSqliteDatabaseAdmissionForPath
	};
}
//#endregion
//#region src/infra/sqlite-schema-sql.ts
const TABLE_CONSTRAINT_KEYWORDS = /* @__PURE__ */ new Set([
	"CHECK",
	"FOREIGN",
	"PRIMARY",
	"UNIQUE"
]);
function readTableConstraintKeyword(sql, first) {
	let token = first;
	if (token.keyword === "CONSTRAINT") {
		const name = readSqlToken(sql, token.end);
		token = name ? readSqlToken(sql, name.end) : null;
	}
	return token?.keyword && TABLE_CONSTRAINT_KEYWORDS.has(token.keyword) ? token.keyword : null;
}
function readSqlToken(sql, start) {
	let index = start;
	while (index < sql.length && /\s/u.test(sql[index] ?? "")) index += 1;
	const char = sql[index];
	if (!char) return null;
	if (char === "\"" || char === "`" || char === "[") {
		const end = skipSqlQuoted(sql, index, char);
		return {
			end,
			keyword: null,
			raw: sql.slice(index, end)
		};
	}
	let end = index;
	while (end < sql.length && !/[\s(,]/u.test(sql[end] ?? "")) end += 1;
	const raw = sql.slice(index, end);
	return {
		end,
		keyword: raw.toUpperCase(),
		raw
	};
}
function normalizeSqlIdentifier(identifier) {
	if (identifier.startsWith("\"") && identifier.endsWith("\"")) return identifier.slice(1, -1).replaceAll("\"\"", "\"").toLowerCase();
	if (identifier.startsWith("`") && identifier.endsWith("`")) return identifier.slice(1, -1).replaceAll("``", "`").toLowerCase();
	if (identifier.startsWith("[") && identifier.endsWith("]")) return identifier.slice(1, -1).toLowerCase();
	return identifier.toLowerCase();
}
function normalizeSchemaSql(sql) {
	if (sql === null) return null;
	return normalizeSqlWhitespace(sql).replace(/;\s*$/u, "").trim().replace(/^(CREATE (?:TABLE|VIRTUAL TABLE|UNIQUE INDEX|INDEX|TRIGGER)) IF NOT EXISTS /iu, "$1 ");
}
function splitSqlList(sql) {
	const items = [];
	let depth = 0;
	let start = 0;
	for (const index of unquotedSqlIndexes(sql, 0)) {
		const char = sql[index];
		if (char === "(") depth += 1;
		else if (char === ")") depth -= 1;
		else if (char === "," && depth === 0) {
			items.push(sql.slice(start, index));
			start = index + 1;
		}
	}
	items.push(sql.slice(start));
	return items;
}
function findSqlCharacter(sql, character) {
	for (const index of unquotedSqlIndexes(sql, 0)) if (sql[index] === character) return index;
	return -1;
}
/** Match SQL keywords without treating quoted payloads, identifiers or comments as code. */
function hasUnquotedSqlKeyword(sql, keywords) {
	const starts = /* @__PURE__ */ new Set();
	for (const match of sql.matchAll(keywords)) starts.add(match.index);
	if (starts.size === 0) return false;
	for (const index of unquotedSqlIndexes(sql, 0)) if (starts.has(index)) return true;
	return false;
}
function findSqlClosingParenthesis(sql, open) {
	let depth = 0;
	for (const index of unquotedSqlIndexes(sql, open)) {
		const char = sql[index];
		if (char === "(") depth += 1;
		else if (char === ")") {
			depth -= 1;
			if (depth === 0) return index;
		}
	}
	throw new Error("SQLite schema contains an unterminated table definition.");
}
function normalizeSqlWhitespace(sql) {
	let normalized = "";
	let pendingSpace = false;
	const segments = /[^\s'"`[/-]+|\s+|./gsu;
	let segment;
	while (segment = segments.exec(sql)) {
		const index = segment.index;
		const char = segment[0][0] ?? "";
		const quoted = skipSqlQuoted(sql, index, char);
		let text = segment[0];
		if (quoted !== index) {
			text = sql.slice(index, quoted);
			segments.lastIndex = quoted;
		} else {
			const comment = skipSqlComment(sql, index);
			if (comment !== index) {
				pendingSpace = true;
				segments.lastIndex = comment;
				continue;
			}
			if (/\s/u.test(char)) {
				pendingSpace = true;
				continue;
			}
		}
		if (pendingSpace && normalized.length > 0) normalized += " ";
		normalized += text;
		pendingSpace = false;
	}
	return normalized.trim();
}
function quoteSqliteIdentifier(identifier) {
	return `"${identifier.replaceAll("\"", "\"\"")}"`;
}
function* unquotedSqlIndexes(sql, start) {
	let index = start;
	while (index < sql.length) {
		const quoted = skipSqlQuoted(sql, index, sql[index] ?? "");
		const next = quoted !== index ? quoted : skipSqlComment(sql, index);
		if (next !== index) index = next;
		else {
			yield index;
			index += 1;
		}
	}
}
function skipSqlQuoted(sql, index, quote) {
	if (quote !== "'" && quote !== "\"" && quote !== "`" && quote !== "[") return index;
	const closingQuote = quote === "[" ? "]" : quote;
	let cursor = index + 1;
	while (cursor < sql.length) {
		if (sql[cursor] !== closingQuote) {
			cursor += 1;
			continue;
		}
		if (quote !== "[" && sql[cursor + 1] === closingQuote) {
			cursor += 2;
			continue;
		}
		return cursor + 1;
	}
	return sql.length;
}
function skipSqlComment(sql, index) {
	if (sql.startsWith("--", index)) {
		const newline = sql.indexOf("\n", index + 2);
		return newline === -1 ? sql.length : newline + 1;
	}
	if (sql.startsWith("/*", index)) {
		const close = sql.indexOf("*/", index + 2);
		return close === -1 ? sql.length : close + 2;
	}
	return index;
}
//#endregion
//#region src/infra/sqlite-schema-contract-assembly.ts
function parseSqliteTableDefinition(sql, tableName) {
	if (sql === null) throw new Error(`Could not inspect SQLite table definition for ${tableName}.`);
	const open = findSqlCharacter(sql, "(");
	if (open === -1) throw new Error(`SQLite table ${tableName} has no column definition.`);
	const close = findSqlClosingParenthesis(sql, open);
	const columns = /* @__PURE__ */ new Map();
	const constraints = [];
	for (const rawDefinition of splitSqlList(sql.slice(open + 1, close))) {
		const definition = normalizeSqlWhitespace(rawDefinition);
		if (!definition) continue;
		const token = readSqlToken(definition, 0);
		if (!token) throw new Error(`SQLite table ${tableName} contains an unreadable definition.`);
		if (readTableConstraintKeyword(definition, token)) {
			constraints.push(definition);
			continue;
		}
		const columnName = normalizeSqlIdentifier(token.raw);
		if (columns.has(columnName)) throw new Error(`SQLite table ${tableName} contains duplicate column ${columnName}.`);
		columns.set(columnName, definition);
	}
	return {
		columns: new Map([...columns].toSorted(([left], [right]) => left.localeCompare(right))),
		constraints: constraints.toSorted()
	};
}
const STARTUP_ADDITIVE_AGENT_COLUMN_DEFINITIONS = [
	{
		tableName: "session_pending_inputs",
		columnName: "consumed_event_id",
		dataType: "TEXT"
	},
	{
		tableName: "session_transcript_active_events",
		columnName: "context_eligible",
		dataType: "INTEGER"
	},
	{
		tableName: "session_nodes",
		columnName: "project_id",
		dataType: "TEXT"
	},
	{
		tableName: "session_windows",
		columnName: "row_transcript_json",
		dataType: "TEXT"
	},
	{
		tableName: "session_windows",
		columnName: "row_transcript_updated_at",
		dataType: "INTEGER"
	},
	{
		tableName: "session_conversations",
		columnName: "route_context_json",
		dataType: "TEXT"
	}
];
/** Missing feature-local tables stay absent; existing tables must satisfy this build's readers. */
function hasPendingAgentStartupColumns(tableSql) {
	const columns = /* @__PURE__ */ new Map();
	return STARTUP_ADDITIVE_AGENT_COLUMN_DEFINITIONS.some(({ tableName, columnName }) => {
		if (!tableSql.has(tableName)) return false;
		const sql = tableSql.get(tableName);
		if (!sql) return true;
		let parsed = columns.get(tableName);
		if (!parsed) {
			parsed = parseSqliteTableDefinition(sql, tableName).columns;
			columns.set(tableName, parsed);
		}
		return !parsed.has(columnName);
	});
}
//#endregion
//#region src/infra/git-root.ts
function walkUpFrom(startDir, opts, resolveAtDir) {
	let current = path.resolve(startDir);
	for (let i = 0; opts.maxDepth === void 0 || i < opts.maxDepth; i += 1) {
		const resolved = resolveAtDir(current);
		if (resolved !== null && resolved !== void 0) return resolved;
		const parent = path.dirname(current);
		if (parent === current) break;
		current = parent;
	}
	return null;
}
function readGitMetadataFile(filePath, limit = 1048576) {
	const fd = fs$1.openSync(filePath, fs$1.constants.O_RDONLY | (fs$1.constants.O_NONBLOCK ?? 0));
	try {
		const stat = fs$1.fstatSync(fd);
		if (!stat.isFile() || stat.size > limit) throw new Error("Git metadata is not a bounded regular file");
		const bytes = readFileDescriptorBoundedSync(fd, Math.min(stat.size, limit));
		if (bytes.length !== stat.size) throw new Error("Git metadata changed during its read");
		return bytes;
	} finally {
		fs$1.closeSync(fd);
	}
}
function readGitDirectoryPointerTarget(filePath, prefix = "") {
	const bytes = readGitMetadataFile(filePath);
	const raw = bytes.toString("utf8").replace(/[\r\n]+$/u, "");
	if (!isUtf8(bytes) || !raw.startsWith(prefix) || raw.length === prefix.length || raw.includes("\0")) throw new Error("Git directory pointer is incomplete or malformed");
	const target = raw.slice(prefix.length);
	return path.isAbsolute(target) ? target : `${path.dirname(filePath)}${path.sep}${target}`;
}
function readGitDirectoryPointer(filePath, prefix = "") {
	return fs$1.realpathSync.native(readGitDirectoryPointerTarget(filePath, prefix));
}
function resolveGitDirFromMarker(repoRoot) {
	const gitPath = path.join(repoRoot, ".git");
	try {
		const stat = fs$1.statSync(gitPath);
		if (stat.isDirectory()) return gitPath;
		if (!stat.isFile()) return null;
		return readGitDirectoryPointer(gitPath, "gitdir: ");
	} catch {
		return null;
	}
}
function resolveGitHeadPath(startDir, opts = {}) {
	return walkUpFrom(startDir, opts, (repoRoot) => {
		const gitDir = resolveGitDirFromMarker(repoRoot);
		return gitDir ? path.join(gitDir, "HEAD") : null;
	});
}
/** Read at most `limit` bytes from Git or build metadata. */
function readGitMetadataPrefix(filePath, limit = 256) {
	const fd = fs$1.openSync(filePath, fs$1.constants.O_RDONLY | (fs$1.constants.O_NONBLOCK ?? 0));
	try {
		if (!fs$1.fstatSync(fd).isFile()) throw new Error("Git metadata is not a regular file");
		const buf = Buffer.alloc(limit);
		const bytesRead = readFileWindowFullySync(fd, buf, 0);
		return buf.subarray(0, bytesRead).toString("utf-8");
	} finally {
		fs$1.closeSync(fd);
	}
}
function readGitHead(startDir, opts = {}) {
	const headPath = resolveGitHeadPath(startDir, opts);
	if (!headPath) return;
	const head = readGitMetadataFile(headPath).toString("utf8").trim();
	if (!head.startsWith("ref:")) return {
		headPath,
		ref: null,
		value: head || null
	};
	const ref = head.replace(/^ref:\s*/i, "").trim();
	const refsBase = resolveGitRefsBase(headPath);
	return {
		headPath,
		ref,
		value: readGitRefs(refsBase, [ref]).get(ref) ?? null,
		refsBase
	};
}
function resolveGitRefsBase(headPath) {
	const gitDir = path.dirname(headPath);
	const marker = path.join(gitDir, "commondir");
	try {
		return readGitDirectoryPointer(marker);
	} catch (error) {
		if (!isMissingPathError(error) || fs$1.lstatSync(marker, { throwIfNoEntry: false })) throw error;
	}
	return gitDir;
}
/** Raw ref contents, sharing one packed inventory across the requested names. */
function readGitRefs(refsBase, refs) {
	const values = new Map(refs.map((ref) => [ref, null]));
	const missing = /* @__PURE__ */ new Set();
	for (const ref of refs) {
		const refPath = resolveRefPath(refsBase, ref);
		if (!refPath) continue;
		try {
			values.set(ref, readGitMetadataPrefix(refPath).trim());
		} catch (error) {
			if (!isMissingPathError(error)) throw error;
			missing.add(ref);
		}
	}
	if (missing.size === 0) return values;
	try {
		const packedRefs = readGitMetadataFile(path.join(refsBase, "packed-refs"), Number.MAX_SAFE_INTEGER).toString("utf8");
		const records = new RegExp(`^(?![#^])[^\\S\\r\\n]*(\\S+)[^\\S\\r\\n]+(${[...missing].map(escapeRegExp).join("|")})(?=\\s|$)`, "gm");
		for (const [, value, packedRef] of packedRefs.matchAll(records)) if (missing.delete(packedRef)) values.set(packedRef, value);
	} catch (error) {
		if (!isMissingPathError(error)) throw error;
	}
	return values;
}
/** Safely resolve a Git ref path, rejecting traversal from a crafted HEAD file. */
function resolveRefPath(refsBase, ref) {
	if (!ref.startsWith("refs/")) return null;
	if (ref.split(/[/]/).includes("..")) return null;
	const resolved = path.resolve(refsBase, ref);
	const rel = path.relative(refsBase, resolved);
	if (!rel || rel.startsWith("..") || path.isAbsolute(rel)) return null;
	return resolved;
}
//#endregion
//#region src/infra/lru-cache.ts
/** Process-local LRU storage; callers own freshness and lifecycle. */
var LruCache = class {
	#maxEntries;
	#maxBytes;
	#sizeOf;
	#entries = /* @__PURE__ */ new Map();
	#bytes = 0;
	constructor(maxEntries, options) {
		this.#maxEntries = Number.isFinite(maxEntries) && maxEntries > 0 ? Math.max(1, Math.floor(maxEntries)) : 1;
		this.#maxBytes = options?.maxBytes ?? Number.POSITIVE_INFINITY;
		this.#sizeOf = options?.sizeOf;
	}
	get size() {
		return this.#entries.size;
	}
	clear() {
		this.#entries.clear();
		this.#bytes = 0;
	}
	keys() {
		return this.#entries.keys();
	}
	delete(cacheKey) {
		if (!this.#entries.has(cacheKey)) return false;
		this.#bytes -= this.#sizeOf?.(this.#entries.get(cacheKey)) ?? 0;
		return this.#entries.delete(cacheKey);
	}
	deleteValue(value) {
		for (const [key, entry] of this.#entries) if (entry === value) this.delete(key);
	}
	/** Reads without promoting a value whose revalidation is still pending. */
	peek(cacheKey) {
		return this.#entries.get(cacheKey);
	}
	/** Returns a cached value and refreshes its recency when present. */
	get(cacheKey) {
		if (!this.#entries.has(cacheKey)) return;
		const cached = this.#entries.get(cacheKey);
		this.#entries.delete(cacheKey);
		this.#entries.set(cacheKey, cached);
		return cached;
	}
	/** Stores a value as the newest entry and evicts oldest entries past capacity. */
	set(cacheKey, value) {
		this.delete(cacheKey);
		this.#entries.set(cacheKey, value);
		this.#bytes += this.#sizeOf?.(value) ?? 0;
		for (const key of this.#entries.keys()) {
			if (this.#entries.size <= this.#maxEntries && this.#bytes <= this.#maxBytes) break;
			this.delete(key);
		}
	}
};
//#endregion
//#region src/infra/error-graph-internal.ts
/** Retained errors must not keep callers alive through V8's lazy stack frames. */
function materializeErrorStack(failure) {
	let error = failure;
	const seen = /* @__PURE__ */ new Set();
	while (error instanceof Error && !seen.has(error)) {
		seen.add(error);
		try {
			error.stack = String(error.stack);
		} catch {
			error.stack = "Stack trace unavailable: custom formatter failed";
		}
		error = error.cause;
	}
}
//#endregion
//#region src/shared/detached-async-context.ts
const asyncHooks = typeof process === "undefined" ? void 0 : process.getBuiltinModule("node:async_hooks");
const detachedAsyncContext = asyncHooks ? resolveGlobalSingleton(Symbol.for("openclaw.detachedAsyncContext"), () => new asyncHooks.AsyncResource("openclaw.detached-async-context")) : void 0;
/** Runs under the context-free async root initialized before managed work can begin. */
function runInDetachedAsyncContext(run) {
	return detachedAsyncContext ? detachedAsyncContext.runInAsyncScope(run) : run();
}
//#endregion
//#region src/shared/deferred.ts
const promiseWithResolvers = Promise;
function createDeferredCore() {
	return promiseWithResolvers.withResolvers();
}
//#endregion
//#region src/shared/async-work-scope.ts
const currentWorkScope = resolveGlobalSingleton(Symbol.for("openclaw.asyncWorkScope"), () => new AsyncLocalStorage());
const currentWorkScopeAncestry = resolveGlobalSingleton(Symbol.for("openclaw.asyncWorkScopeAncestry"), () => new AsyncLocalStorage());
/** Joins cooperating descendants even when their caller returns a cached value first. */
var AsyncWorkScope = class AsyncWorkScope {
	constructor(failures) {
		this.failures = failures;
		this.pending = /* @__PURE__ */ new Set();
		this.controller = new AbortController();
		this.phase = "open";
	}
	get signal() {
		return this.controller.signal;
	}
	get hasPendingWork() {
		return this.pending.size > 0;
	}
	get isClosing() {
		return this.phase !== "open";
	}
	enter(run) {
		const owner = currentWorkScope.getStore();
		const ancestry = currentWorkScopeAncestry.getStore();
		const parent = owner ? ancestry?.scope === owner ? ancestry : { scope: owner } : void 0;
		return new AsyncResource("OpenClawAsyncWorkScope").runInAsyncScope(() => {
			currentWorkScope.enterWith(this);
			currentWorkScopeAncestry.enterWith({
				scope: this,
				parent
			});
			return run();
		});
	}
	/** Enters synchronous work without inspecting or assimilating its return value. */
	run(run) {
		if (this.phase === "closed") throw new Error("Async work scope is closed");
		const operation = createDeferredCore();
		this.pending.add(operation.promise);
		try {
			return this.enter(run);
		} finally {
			operation.resolve();
			this.pending.delete(operation.promise);
		}
	}
	track(run) {
		if (this.phase === "closed") return Promise.reject(/* @__PURE__ */ new Error("Async work scope is closed"));
		const operation = createDeferredCore();
		this.pending.add(operation.promise);
		operation.promise.then(() => this.pending.delete(operation.promise), (error) => {
			this.pending.delete(operation.promise);
			this.failures?.add(error);
		});
		try {
			operation.resolve(this.enter(run));
		} catch (error) {
			operation.reject(error);
		}
		return operation.promise;
	}
	beginClose(reason) {
		if (this.phase !== "open") return;
		this.phase = "closing";
		this.controller.abort(reason);
	}
	/** Starts the next phase in the same continuation that observes settled pending work. */
	runWhenIdle(run) {
		return AsyncWorkScope.runWhenAllIdle(() => [this], () => this.track(run));
	}
	/** Reselects owners so work admitted into a later phase is not mistaken for earlier work. */
	static async runWhenAllIdle(selectScopes, run) {
		let scopes = selectScopes();
		while (scopes.some((scope) => scope.pending.size > 0)) {
			await Promise.allSettled(scopes.flatMap((scope) => Array.from(scope.pending)));
			scopes = selectScopes();
		}
		return run();
	}
	async drain() {
		this.beginClose();
		while (this.pending.size > 0) await Promise.allSettled(this.pending);
		this.phase = "closed";
	}
};
/** Starts work its caller does not own, so the caller's scope neither waits for it nor closes under it. */
function runOutsideAsyncWorkScope(run) {
	return currentWorkScope.exit(() => currentWorkScopeAncestry.exit(run));
}
//#endregion
//#region src/plugins/host-hook-cleanup-result.ts
/** Merge raw instance outcomes without duplicating their existing host or instance report. */
function appendPluginInstanceCleanupFailures(failures, pluginId, result) {
	for (const error of result.errors) {
		if (failures.some((failure) => failure.pluginId === pluginId && failure.error === error && (failure.hookId === "instance" || result.hostCleanupErrors?.includes(error)))) continue;
		failures.push({
			pluginId,
			hookId: "instance",
			error
		});
	}
}
//#endregion
//#region src/plugins/plugin-cache-sdk.ts
/** Derived SDK facts share the plugin cache lifetime; none owns a separate expiry. */
function createPluginCacheSdk() {
	return {
		hosts: /* @__PURE__ */ new Map(),
		contexts: /* @__PURE__ */ new Map(),
		packageNames: /* @__PURE__ */ new Map(),
		packageSearches: /* @__PURE__ */ new Map(),
		argvDirectories: /* @__PURE__ */ new Map(),
		devSourceRoots: /* @__PURE__ */ new Map(),
		runtimeModules: /* @__PURE__ */ new Map(),
		usableDistArtifacts: /* @__PURE__ */ new Map(),
		normalizedJitiAliases: /* @__PURE__ */ new Map(),
		aliasFacts: /* @__PURE__ */ new WeakMap(),
		native: {
			sdkProviders: /* @__PURE__ */ new Map(),
			nextSdkProviderOrder: 0,
			parents: /* @__PURE__ */ new Map(),
			aliases: /* @__PURE__ */ new Map(),
			registeredHosts: /* @__PURE__ */ new Set(),
			hostRoots: /* @__PURE__ */ new Map(),
			nearestPackageRoots: /* @__PURE__ */ new Map(),
			loaderPackageRoots: /* @__PURE__ */ new Map(),
			allowedParentRoots: /* @__PURE__ */ new Map()
		}
	};
}
resolveGlobalSingleton(Symbol.for("openclaw.pluginSourceRecoveryUnavailableError"), () => class SourceRecoveryUnavailableError extends Error {
	constructor(cause) {
		super("Captured plugin source is missing; its previous code cannot be recovered.", { cause });
		this.name = "PluginSourceRecoveryUnavailableError";
	}
});
const PluginInstanceDrainTimeoutError = resolveGlobalSingleton(Symbol.for("openclaw.pluginInstanceDrainTimeoutError"), () => class DrainTimeoutError extends Error {
	constructor(message, settled, options, forcedRetirement) {
		super(message, options);
		this.settled = settled;
		this.forcedRetirement = forcedRetirement;
		this.name = "PluginInstanceDrainTimeoutError";
	}
});
//#endregion
//#region src/plugins/plugin-cache.ts
const state$2 = resolveGlobalSingleton(Symbol.for("openclaw.pluginCache"), () => ({
	snapshotOwners: /* @__PURE__ */ new WeakMap(),
	retirements: []
}));
const cacheRetainers = resolveGlobalSingleton(Symbol.for("openclaw.pluginCacheRetainers"), () => /* @__PURE__ */ new WeakMap());
const instanceCacheOwners = resolveGlobalSingleton(Symbol.for("openclaw.pluginInstanceCacheOwners"), () => /* @__PURE__ */ new WeakMap());
/** A retiring inventory releases its own custody; terminal disposal releases every birth cache. */
function releasePluginCacheInstance(instance, cache) {
	const owners = instanceCacheOwners.get(instance);
	if (cache) {
		cache.instances.delete(instance);
		owners?.delete(cache);
	} else {
		for (const owner of owners ?? []) owner.instances.delete(instance);
		owners?.clear();
	}
	if (owners?.size === 0) instanceCacheOwners.delete(instance);
}
function getPluginCacheRetainers(cache) {
	let retained = cacheRetainers.get(cache);
	if (!retained) {
		retained = {
			references: /* @__PURE__ */ new Set(),
			controller: new AbortController(),
			settled: createDeferredCore()
		};
		cacheRetainers.set(cache, retained);
	}
	return retained;
}
function createPluginMetadataCache() {
	return {
		current: {
			snapshot: void 0,
			owner: "operation",
			configFingerprint: void 0,
			agentWorkspaceFingerprint: void 0,
			envFingerprint: void 0,
			defaultDiscoveryCompatible: false,
			compatiblePolicyHashes: void 0,
			compatibleConfigFingerprints: void 0,
			revision: Symbol("plugin-metadata-snapshot"),
			configIdentities: /* @__PURE__ */ new WeakSet()
		},
		snapshots: /* @__PURE__ */ new Map(),
		discovery: /* @__PURE__ */ new Map(),
		sharedDiscovery: /* @__PURE__ */ new Map(),
		projections: /* @__PURE__ */ new WeakMap(),
		projectionSources: /* @__PURE__ */ new WeakMap(),
		completions: /* @__PURE__ */ new WeakMap(),
		indexFacts: /* @__PURE__ */ new WeakMap(),
		providerPolicyOwners: /* @__PURE__ */ new WeakMap(),
		channelAdapters: /* @__PURE__ */ new WeakMap(),
		bundledChannelCatalogs: /* @__PURE__ */ new Map(),
		bundledProviderPolicySurfaces: /* @__PURE__ */ new WeakMap(),
		staticCatalogStates: /* @__PURE__ */ new WeakMap(),
		modelSuppressionResolvers: /* @__PURE__ */ new WeakMap(),
		mcpAuthDeclarations: /* @__PURE__ */ new WeakMap()
	};
}
/** Each inventory owns its acquired facts and reusable load results; publication owns activation. */
function createPluginCache(options = {}) {
	return {
		async [Symbol.asyncDispose]() {
			await retirePluginCache(this);
		},
		kind: options.kind ?? "operation",
		roots: /* @__PURE__ */ new Map(),
		rootAliases: /* @__PURE__ */ new Map(),
		sdk: createPluginCacheSdk(),
		setupModules: /* @__PURE__ */ new Map(),
		instances: /* @__PURE__ */ new Set(),
		metadata: createPluginMetadataCache(),
		installRecords: /* @__PURE__ */ new Map(),
		persistedInstalledIndex: /* @__PURE__ */ new Map(),
		preparedBundledDiscoveryModes: /* @__PURE__ */ new Map(),
		dependencyStatus: /* @__PURE__ */ new WeakMap(),
		moduleLoaders: /* @__PURE__ */ new Map(),
		sources: /* @__PURE__ */ new Map(),
		sourceAliases: /* @__PURE__ */ new Map(),
		runtimeRecordRoots: /* @__PURE__ */ new WeakMap()
	};
}
function getProcessPluginCache() {
	return state$2.current ??= createPluginCache({ kind: "process" });
}
function getScopedPluginCache() {
	return getPluginExecutionFrame()?.cacheScope?.cache;
}
function getPluginCache() {
	return getScopedPluginCache() ?? getProcessPluginCache();
}
/** Stop new setup calls immediately; the owner awaits in-flight calls and graph cleanup. */
function retirePluginCache(cache, beforeRetire, options) {
	const retained = getPluginCacheRetainers(cache);
	if (retained.retirement) return retained.retirement;
	const completion = createDeferredCore();
	retained.retirement = completion.promise;
	const retire = async () => {
		if (retained.references.size) await retained.settled.promise;
		const work = new AsyncWorkScope();
		try {
			return await work.track(() => beginPluginCacheRetirement(cache, beforeRetire, options));
		} finally {
			await work.drain();
		}
	};
	retained.controller.abort();
	materializeErrorStack(retained.controller.signal.reason);
	runOutsideAsyncWorkScope(retire).then(completion.resolve, completion.reject);
	return completion.promise;
}
function beginPluginCacheRetirement(cache, beforeRetire, options) {
	if (cache.retirement) return cache.retirement;
	const retirement = createDeferredCore();
	cache.retirement = retirement.promise;
	const cleanup = async () => {
		beforeRetire?.();
		const registries = cache.retireRegistryLoads?.();
		const resources = /* @__PURE__ */ new Set([...cache.setupModules.values(), ...cache.instances]);
		for (const resource of resources) resource.quiesce();
		const [registry] = await Promise.allSettled([registries]);
		const outcomes = await Promise.allSettled([...resources].map(async (resource) => ({
			resource,
			result: await resource.dispose(void 0, options)
		})));
		const nativeAdmissions = cache.sourceAdmissions;
		if (nativeAdmissions) {
			const pending = outcomes.flatMap((outcome) => outcome.status === "fulfilled" ? outcome.value.result.errors.flatMap((error) => error instanceof PluginInstanceDrainTimeoutError ? [error.settled] : []) : []);
			if (pending.length > 0) Promise.allSettled(pending).then(() => nativeAdmissions.dispose()).catch((error) => process.emitWarning(`Plugin native capture cleanup failed: ${String(error)}`));
			else await nativeAdmissions.dispose();
		}
		cache.setupModules.clear();
		for (const instance of cache.instances) releasePluginCacheInstance(instance, cache);
		const unexpected = [...registry.status === "rejected" ? [registry.reason] : [], ...outcomes.flatMap((result) => result.status === "rejected" ? [result.reason] : [])];
		if (unexpected.length) throw new AggregateError(unexpected, "Plugin cache resources failed to retire");
		const host = registry.status === "fulfilled" ? registry.value : void 0;
		const failures = [...host?.failures ?? []];
		for (const outcome of outcomes) {
			if (outcome.status !== "fulfilled") continue;
			const { resource, result } = outcome.value;
			appendPluginInstanceCleanupFailures(failures, resource.pluginId, result);
		}
		return {
			cleanupCount: host?.cleanupCount ?? 0,
			failures
		};
	};
	cleanup().then(retirement.resolve, retirement.reject);
	return retirement.promise;
}
//#endregion
//#region src/infra/openclaw-root.ts
function parsePackageName(raw) {
	const parsed = JSON.parse(raw);
	return typeof parsed.name === "string" ? parsed.name : null;
}
function readPackageNameSync(dir) {
	const packageNameCache = getPluginCache().sdk.packageNames;
	const packageJsonPath = path.join(path.resolve(dir), "package.json");
	if (packageNameCache.has(packageJsonPath)) return packageNameCache.get(packageJsonPath) ?? null;
	try {
		const name = parsePackageName(openClawRootFsSync.readFileSync(packageJsonPath, "utf-8"));
		packageNameCache.set(packageJsonPath, name);
		return name;
	} catch {
		packageNameCache.set(packageJsonPath, null);
		return null;
	}
}
function findPackageRootSync(startDir, maxDepth = 12) {
	for (const current of iterAncestorDirs(startDir, maxDepth)) if (readPackageNameSync(current) === "openclaw") return current;
	return null;
}
function* iterAncestorDirs(startDir, maxDepth) {
	let current = path.resolve(startDir);
	for (let i = 0; i < maxDepth; i += 1) {
		yield current;
		if (path.basename(current) === "node_modules") break;
		const parent = path.dirname(current);
		if (parent === current) break;
		current = parent;
	}
}
function candidateDirsFromArgv1(argv1) {
	const argv1CandidateCache = getPluginCache().sdk.argvDirectories;
	const cacheKey = path.resolve(argv1);
	const cached = argv1CandidateCache.get(cacheKey);
	if (cached) return [...cached];
	const normalized = cacheKey;
	const candidates = [];
	try {
		const resolved = openClawRootFsSync.realpathSync(normalized);
		if (resolved !== normalized) candidates.push(path.dirname(resolved));
	} catch {}
	candidates.push(path.dirname(normalized));
	const parts = normalized.split(path.sep);
	const binIndex = parts.lastIndexOf(".bin");
	if (binIndex > 0 && parts[binIndex - 1] === "node_modules") {
		const binName = path.basename(normalized);
		const nodeModulesDir = parts.slice(0, binIndex).join(path.sep);
		candidates.push(path.join(nodeModulesDir, binName));
	}
	const deduped = dedupeCandidates(candidates);
	argv1CandidateCache.set(cacheKey, deduped);
	return [...deduped];
}
function preparePackageRootSearch(opts, preserveInventory) {
	const candidates = buildCandidates(opts);
	const cacheKey = candidates.join("\0");
	const searches = getPluginCache().sdk.packageSearches;
	const cached = searches.get(cacheKey);
	return {
		candidates,
		first: cached?.all ? cached.all[0] ?? null : cached?.first,
		complete(first) {
			searches.set(cacheKey, preserveInventory ? {
				...searches.get(cacheKey),
				first
			} : { first });
			return first;
		}
	};
}
function resolveOpenClawPackageRootSync(opts) {
	const search = preparePackageRootSearch(opts, false);
	if (search.first !== void 0) return search.first;
	for (const candidate of search.candidates) {
		const found = findPackageRootSync(candidate);
		if (found) return search.complete(found);
	}
	return search.complete(null);
}
function buildCandidates(opts) {
	const candidates = [];
	if (opts.moduleUrl) try {
		candidates.push(path.dirname(fileURLToPath(opts.moduleUrl)));
	} catch {}
	if (opts.argv1) candidates.push(...candidateDirsFromArgv1(opts.argv1));
	if (opts.cwd) candidates.push(opts.cwd);
	return dedupeCandidates(candidates);
}
function dedupeCandidates(candidates) {
	return [...new Set(candidates.map((candidate) => path.resolve(candidate)))];
}
//#endregion
//#region src/infra/git-commit.ts
const formatCommit = (value) => {
	const match = value?.match(/[0-9a-fA-F]{7,40}/);
	return match ? normalizeLowercaseStringOrEmpty(match[0].slice(0, 7)) : null;
};
const cachedGitCommitBySearchDir = new LruCache(256);
const resolveCommitSearchDir = (options) => {
	if (options.cwd) return path.resolve(options.cwd);
	if (options.moduleUrl) try {
		return path.dirname(fileURLToPath(options.moduleUrl));
	} catch {}
	return process.cwd();
};
const cacheGitCommit = (searchDir, commit) => {
	cachedGitCommitBySearchDir.set(searchDir, commit);
	return commit;
};
const resolveGitLookupDepth = (searchDir, packageRoot) => {
	if (!packageRoot) return;
	const relative = path.relative(packageRoot, searchDir);
	if (relative.startsWith("..") || path.isAbsolute(relative)) return;
	return (relative ? relative.split(path.sep).filter(Boolean).length : 0) + 1;
};
const readCommitFromGit = (searchDir, packageRoot) => {
	const head = readGitHead(searchDir, { maxDepth: resolveGitLookupDepth(searchDir, packageRoot) });
	return head === void 0 ? void 0 : formatCommit(head.value);
};
const readCommitFromPackageJson = () => {
	try {
		const pkg = createRequire(import.meta.url)("../../package.json");
		return formatCommit(pkg.gitHead ?? pkg.githead ?? null);
	} catch {
		return null;
	}
};
const readCommitProbe = (moduleUrl, candidates, field) => {
	try {
		for (const candidate of candidates) {
			const filePath = fileURLToPath(new URL(candidate, moduleUrl));
			let raw;
			try {
				raw = readGitMetadataPrefix(filePath, 1024);
			} catch (error) {
				if (isMissingPathError(error)) continue;
				return null;
			}
			try {
				const value = asNullableRecord(JSON.parse(raw))?.[field];
				return typeof value === "string" ? formatCommit(value) : null;
			} catch {
				return null;
			}
		}
	} catch {}
};
const readCommitFromBuildInfo = (moduleUrl = import.meta.url) => {
	return readCommitProbe(moduleUrl, ["../build-info.json", "./build-info.json"], "commit") ?? null;
};
const readLoadedCommit = (moduleUrl) => {
	const buildStamp = readCommitProbe(moduleUrl, ["../.buildstamp", "./.buildstamp"], "head");
	const runtimeStamp = readCommitProbe(moduleUrl, ["../.runtime-postbuildstamp", "./.runtime-postbuildstamp"], "head");
	if (buildStamp !== void 0 || runtimeStamp !== void 0) {
		if (buildStamp || runtimeStamp) return buildStamp && buildStamp === runtimeStamp ? buildStamp : null;
		return readCommitFromBuildInfo(moduleUrl);
	}
	return readCommitProbe(moduleUrl, ["../build-info.json", "./build-info.json"], "commit");
};
const resolveCommitHash = (options = {}) => {
	const env = options.env ?? process.env;
	const readers = options.readers ?? {};
	const readGitCommit = readers.readGitCommit ?? readCommitFromGit;
	const envCommit = env.GIT_COMMIT?.trim() || env.GIT_SHA?.trim();
	const normalized = formatCommit(envCommit);
	if (normalized) return normalized;
	const searchDir = resolveCommitSearchDir(options);
	const cached = cachedGitCommitBySearchDir.get(searchDir);
	if (cached !== void 0) return cached;
	const packageRoot = resolveOpenClawPackageRootSync({
		cwd: options.cwd,
		moduleUrl: options.moduleUrl
	});
	try {
		const gitCommit = readGitCommit(searchDir, packageRoot);
		if (gitCommit !== void 0) return cacheGitCommit(searchDir, gitCommit);
	} catch {}
	const buildInfoCommit = readers.readBuildInfoCommit?.() ?? readCommitFromBuildInfo();
	if (buildInfoCommit) return cacheGitCommit(searchDir, buildInfoCommit);
	const pkgCommit = readers.readPackageJsonCommit?.() ?? readCommitFromPackageJson();
	if (pkgCommit) return cacheGitCommit(searchDir, pkgCommit);
	try {
		return cacheGitCommit(searchDir, readGitCommit(searchDir, packageRoot) ?? null);
	} catch {
		return cacheGitCommit(searchDir, null);
	}
};
/** Resolve the commit that produced the loaded artifact, not the checkout's current revision. */
function resolveLoadedCommitHash(options = {}) {
	const moduleUrl = options.moduleUrl ?? import.meta.url;
	const loaded = readLoadedCommit(moduleUrl);
	return loaded === void 0 ? resolveCommitHash({
		moduleUrl,
		...options.env ? { env: options.env } : {}
	}) : loaded;
}
//#endregion
//#region src/version.ts
const CORE_PACKAGE_NAME = "openclaw";
const PACKAGE_JSON_CANDIDATES = [
	"../package.json",
	"../../package.json",
	"../../../package.json",
	"./package.json"
];
const BUILD_INFO_CANDIDATES = [
	"../build-info.json",
	"../../build-info.json",
	"./build-info.json"
];
function readVersionFromJsonCandidates(moduleUrl, candidates, opts = {}) {
	try {
		const require = createRequire(moduleUrl);
		for (const candidate of candidates) try {
			const parsed = require(candidate);
			const version = normalizeOptionalString(parsed.version);
			if (!version) continue;
			if (opts.requirePackageName && parsed.name !== CORE_PACKAGE_NAME) continue;
			return version;
		} catch {}
		return null;
	} catch {
		return null;
	}
}
function readBuildIdFromJsonCandidates(moduleUrl) {
	try {
		const require = createRequire(moduleUrl);
		for (const candidate of BUILD_INFO_CANDIDATES) try {
			const parsed = require(candidate);
			const buildId = normalizeOptionalString(parsed.buildId);
			if (buildId && buildId.length <= 96) return buildId;
		} catch {}
		return null;
	} catch {
		return null;
	}
}
function firstNonEmpty(...values) {
	for (const value of values) {
		const trimmed = normalizeOptionalString(value);
		if (trimmed && trimmed.toLowerCase() !== "undefined" && trimmed.toLowerCase() !== "null") return trimmed;
	}
}
function readVersionFromPackageJsonForModuleUrl(moduleUrl) {
	return readVersionFromJsonCandidates(moduleUrl, PACKAGE_JSON_CANDIDATES, { requirePackageName: true });
}
function readVersionFromBuildInfoForModuleUrl(moduleUrl) {
	return readVersionFromJsonCandidates(moduleUrl, BUILD_INFO_CANDIDATES);
}
function readBuildIdFromBuildInfoForModuleUrl(moduleUrl) {
	return readBuildIdFromJsonCandidates(moduleUrl);
}
function resolveVersionFromModuleUrl(moduleUrl) {
	return readVersionFromBuildInfoForModuleUrl(moduleUrl) || readVersionFromPackageJsonForModuleUrl(moduleUrl);
}
function resolveBinaryVersion(params) {
	return resolveVersionFromModuleUrl(params.moduleUrl) || firstNonEmpty(params.bundledVersion) || params.fallback || "0.0.0";
}
readBuildIdFromBuildInfoForModuleUrl(import.meta.url);
const RUNTIME_SERVICE_COMMIT = resolveLoadedCommitHash({ moduleUrl: import.meta.url });
function resolveRuntimeServiceCommit() {
	return RUNTIME_SERVICE_COMMIT;
}
const VERSION = resolveBinaryVersion({
	moduleUrl: import.meta.url,
	bundledVersion: process.env.OPENCLAW_BUNDLED_VERSION
});
//#endregion
//#region src/state/openclaw-agent-schema.ts
const OPENCLAW_AGENT_SCHEMA_SQL = process.getBuiltinModule("node:fs").readFileSync(fileURLToPath(new URL("./openclaw-agent-schema.sql", import.meta.url)), "utf8");
//#endregion
//#region src/state/openclaw-state-schema.ts
const OPENCLAW_STATE_SCHEMA_SQL = process.getBuiltinModule("node:fs").readFileSync(fileURLToPath(new URL("./openclaw-state-schema.sql", import.meta.url)), "utf8");
//#endregion
//#region src/state/openclaw-database-seal-schema.ts
function sqliteDatabaseSealSchemaFor(version = VERSION) {
	return createHash("sha256").update(JSON.stringify([2, version])).update(OPENCLAW_AGENT_SCHEMA_SQL).update(OPENCLAW_STATE_SCHEMA_SQL).digest("hex");
}
//#endregion
//#region src/infra/sqlite-clean-close-seal.ts
const fullVerificationIntervalMs = 6048e5;
function fileFields(file) {
	return {
		dev: file.dev.toString(),
		ino: file.ino.toString(),
		birthtime: readDatabaseIdentityBirthtime(file),
		size: file.size.toString(),
		mtimeNs: file.mtimeNs.toString()
	};
}
function checksum(payload) {
	return createHash("sha256").update(payload).digest("hex").slice(0, 16);
}
function hasNoJournal(pathname) {
	return ["-wal", "-journal"].every((suffix) => {
		try {
			const file = fs$1.statSync(`${pathname}${suffix}`, { bigint: true });
			return file.isFile() && file.size === 0n;
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT")) return true;
			throw error;
		}
	});
}
/** The caller supplies fstat from its retained descriptor; closing a new one can release SQLite locks. */
function readSqliteCleanCloseSeal(pathname, schemaIdentity, file) {
	try {
		const sealPath = `${pathname}.seal`;
		if (!fs$1.lstatSync(sealPath).isFile()) return;
		const envelope = JSON.parse(fs$1.readFileSync(sealPath, "utf8"));
		if (!isRecord(envelope) || typeof envelope.payload !== "string" || envelope.checksum !== checksum(envelope.payload)) return;
		const payload = JSON.parse(envelope.payload);
		if (!isRecord(payload) || payload.version !== 1 || payload.schemaIdentity !== schemaIdentity || typeof payload.verifiedAt !== "number" || !Number.isSafeInteger(payload.verifiedAt) || !("facts" in payload) || !file.isFile()) return;
		const age = Date.now() - payload.verifiedAt;
		if (age < 0 || age > fullVerificationIntervalMs || !Object.entries(fileFields(file)).every(([key, value]) => payload[key] === value) || !hasNoJournal(pathname)) return;
		return {
			verifiedAt: payload.verifiedAt,
			facts: payload.facts
		};
	} catch {
		return;
	}
}
function invalidateSqliteCleanCloseSeal(pathname) {
	try {
		fs$1.unlinkSync(`${pathname}.seal`);
	} catch (error) {
		if (!hasErrnoCode(error, "ENOENT")) throw error;
	}
}
function writeSqliteCleanCloseSeal(pathname, schemaIdentity, file, proof) {
	try {
		const sealPath = `${pathname}.seal`;
		const existing = fs$1.lstatSync(sealPath, { throwIfNoEntry: false });
		if (!file.isFile() || existing && !existing.isFile() || !hasNoJournal(pathname)) {
			invalidateSqliteCleanCloseSeal(pathname);
			return false;
		}
		const payload = JSON.stringify({
			version: 1,
			schemaIdentity,
			...fileFields(file),
			verifiedAt: proof.verifiedAt,
			facts: proof.facts
		});
		fs$1.writeFileSync(sealPath, JSON.stringify({
			payload,
			checksum: checksum(payload)
		}));
		return true;
	} catch {
		try {
			invalidateSqliteCleanCloseSeal(pathname);
		} catch {}
		return false;
	}
}
//#endregion
//#region src/infra/sqlite-database-admission-seal.ts
const SQLITE_DATABASE_SEAL_SCHEMA = sqliteDatabaseSealSchemaFor();
const integrityVerificationKey = {
	name: "sqlite.full-verification",
	read: (value) => typeof value === "number" && Number.isSafeInteger(value) ? value : void 0
};
const sealedKeys = /* @__PURE__ */ new Set([
	"sqlite-schema",
	"sqlite.full-verification",
	"state.schema-version",
	"state.runtime-schema",
	"state.integrity",
	"agent.completed-validation",
	"agent.canonical-validation-receipt",
	"agent.schema-metadata"
]);
function isSealedKey(name) {
	return sealedKeys.has(name) || name.startsWith("memory.index-schema:");
}
function encodeSealValue(_key, value) {
	if (value instanceof Map) return {
		sealType: "map",
		entries: [...value]
	};
	if (value instanceof Set) return {
		sealType: "set",
		entries: [...value]
	};
	if (value instanceof SharedArrayBuffer) return {
		sealType: "shared",
		entries: [...new Int32Array(value)]
	};
	return value;
}
function decodeSealValue(_key, value) {
	if (!isRecord(value) || !Array.isArray(value.entries)) return value;
	if (value.sealType === "map") return new Map(value.entries);
	if (value.sealType === "set") return new Set(value.entries);
	if (value.sealType === "shared") {
		const shared = new SharedArrayBuffer(value.entries.length * Int32Array.BYTES_PER_ELEMENT);
		new Int32Array(shared).set(value.entries);
		return shared;
	}
	return value;
}
var SqliteDatabaseCleanCloseSeals = class {
	constructor(publishFact, references) {
		this.publishFact = publishFact;
		this.references = references;
		this.loaded = /* @__PURE__ */ new WeakSet();
	}
	markCreated(record) {
		this.loaded.add(record);
	}
	load(record) {
		if (threadId !== 0) return;
		if (this.loaded.has(record)) return;
		this.loaded.add(record);
		const seal = readSqliteCleanCloseSeal(record.location, SQLITE_DATABASE_SEAL_SCHEMA, fs$1.fstatSync(record.descriptor, { bigint: true }));
		if (!seal || typeof seal.facts !== "string") return;
		try {
			const facts = JSON.parse(seal.facts, decodeSealValue);
			if (!Array.isArray(facts) || !facts.every((entry) => Array.isArray(entry) && entry.length === 3 && typeof entry[0] === "string" && isSealedKey(entry[0]) && typeof entry[1] === "boolean") || !facts.some(([name, , value]) => name === integrityVerificationKey.name && value === seal.verifiedAt) || !facts.some(([name, , value]) => name === "sqlite-schema" && isRecord(value))) return;
			const schema = facts.find(([name]) => name === "sqlite-schema")?.[2];
			if (!(schema.tableSql instanceof Map) || hasPendingAgentStartupColumns(schema.tableSql)) return;
			for (const [name, schemaDependent, value] of facts) this.publishFact(record, {
				name,
				schemaDependent
			}, value, readSqliteDatabaseFactRevision(record, schemaDependent));
			Atomics.store(new Int32Array(record.generation), SqliteDatabaseGenerationSlot.sealPresent, 1);
		} catch {}
	}
	invalidate(location, record) {
		invalidateSqliteCleanCloseSeal(record?.location ?? location);
		if (record) Atomics.store(new Int32Array(record.generation), SqliteDatabaseGenerationSlot.sealPresent, 0);
	}
	prepare(database, record, verifiedAt) {
		const publish = this.preparePublication(database, record, verifiedAt);
		if (record) this.references.retain(record);
		let retained = record;
		return {
			publish: () => retained !== void 0 && publish(),
			[Symbol.dispose]: () => {
				const released = retained;
				retained = void 0;
				if (released) this.references.release(released);
			}
		};
	}
	preparePublication(database, record, verifiedAt) {
		if (!record || database.isTransaction) return () => false;
		if (verifiedAt === void 0) return () => false;
		const facts = [...record.facts].filter(([name, fact]) => isSealedKey(name) && isSqliteDatabaseAdmissionFactCurrent(record, fact));
		if (!facts.some(([name]) => name === "sqlite-schema")) return () => false;
		const serialized = JSON.stringify(facts.map(([name, fact]) => [
			name,
			fact.schemaDependent,
			fact.value
		]), encodeSealValue);
		return () => {
			if (database.isOpen || readSqliteDatabaseGeneration(record, "retired") !== 0 || facts.some(([, fact]) => Atomics.load(new Int32Array(fact.current), 0) !== 1 || fact.revision !== readSqliteDatabaseFactRevision(record, fact.schemaDependent))) return false;
			try {
				const file = fs$1.fstatSync(record.descriptor, { bigint: true });
				if (readSqliteDatabaseAdmissionIdentity(fs$1.statSync(record.location, { bigint: true })) !== record.identity) return false;
				const written = writeSqliteCleanCloseSeal(record.location, SQLITE_DATABASE_SEAL_SCHEMA, file, {
					verifiedAt,
					facts: serialized
				});
				Atomics.store(new Int32Array(record.generation), SqliteDatabaseGenerationSlot.sealPresent, written ? 1 : 0);
				return written;
			} catch {
				return false;
			}
		};
	}
};
//#endregion
//#region src/infra/sqlite-lifecycle-errors.ts
var OpenClawStateOwnershipError = class extends Error {};
var OpenClawStateOwnershipMetadataError = class extends OpenClawStateOwnershipError {
	constructor(databasePath, message) {
		super(`OpenClaw shared state ownership metadata is invalid at ${databasePath}: ${message}. Repair it with OPENCLAW_SUPERVISOR_MODE=external openclaw database ownership claim --manager <manager-id>.`);
		this.databasePath = databasePath;
		this.name = "OpenClawStateOwnershipMetadataError";
	}
};
var OpenClawStateExternalOwnershipError = class extends OpenClawStateOwnershipError {
	constructor(databasePath, managerId) {
		super(`OpenClaw shared state database ${databasePath} is externally supervised by ${managerId}. Use that external supervisor with OPENCLAW_SUPERVISOR_MODE=external for writable operations.`);
		this.databasePath = databasePath;
		this.managerId = managerId;
		this.name = "OpenClawStateExternalOwnershipError";
	}
};
const SqliteCoordinatorError = resolveGlobalSingleton(Symbol.for("openclaw.sqliteCoordinatorError"), () => class CoordinatorError extends Error {
	constructor(message, cause) {
		super(message);
		this.cause = cause;
		this.name = "SqliteCoordinatorError";
	}
});
function createSqliteLifecycleAggregateError(errors, message, cause) {
	return new AggregateError(errors, message, { cause });
}
/** Keep the first failure as the cause while retaining independent cleanup errors. */
function throwSqliteLifecycleErrors(errors, message) {
	if (errors.length === 1) throw errors[0];
	if (errors.length > 1) throw createSqliteLifecycleAggregateError(errors, message, errors[0]);
}
/** Settle a synchronous SQLite operation and preserve both operation and cleanup failures. */
function runWithSqliteCleanup(resource, operationLabel, operation) {
	let result;
	try {
		result = operation();
		if (isPromiseLike(result)) throw new SqliteCoordinatorError(`${operationLabel} must remain synchronous`);
	} catch (operationError) {
		try {
			resource.release();
		} catch (releaseError) {
			throw createSqliteLifecycleAggregateError([operationError, releaseError], `${operationLabel} and resource release both failed`, operationError);
		}
		throw operationError;
	}
	try {
		resource.release();
	} catch (releaseError) {
		throw new SqliteCoordinatorError(`${operationLabel} completed, but releasing its resource failed`, releaseError);
	}
	return result;
}
createSubsystemLogger("sqlite/publication");
const pendingPublications = resolveGlobalSingleton(Symbol.for("openclaw.sqlitePostCommitPublications"), () => /* @__PURE__ */ new WeakMap());
const pendingTransactionState = resolveGlobalSingleton(Symbol.for("openclaw.sqliteTransactionState"), () => /* @__PURE__ */ new WeakMap());
/** Snapshots read within this managed transaction can still roll back. */
function hasSqlitePostCommitScope(db) {
	return pendingPublications.has(sqlPublicationAnchor(db));
}
/**
* Stage private transaction-local state that publishes before fallible observers.
* Observer preparation follows every committed state update. All callbacks must not throw.
*/
function stageSqliteTransactionState(db, state) {
	const pending = pendingTransactionState.get(sqlPublicationAnchor(db));
	if (!pending) return false;
	state.stage();
	pending.push({
		prepareCommit: state.prepareCommit,
		commit: state.commit,
		prepareObservers: state.prepareObservers,
		invalidate: state.invalidate,
		rollback: state.rollback
	});
	return true;
}
//#endregion
//#region src/infra/sqlite-database-write-receipts.ts
const state$1 = resolveGlobalSingleton(Symbol.for("openclaw.sqliteDatabaseWriteScopes"), () => ({
	writeScopes: /* @__PURE__ */ new WeakMap(),
	pendingWriteScopes: /* @__PURE__ */ new WeakMap(),
	localScopeRevisions: /* @__PURE__ */ new WeakMap(),
	localUnscopedRevisions: /* @__PURE__ */ new WeakMap()
}));
/** Scoped revisions borrow physical admission and publication from their existing owner. */
function createSqliteDatabaseWriteReceipts(owner) {
	/** A typed owner certifies all session keys affected by this synchronous kernel. */
	function withSqliteDatabaseWriteScope(database, scope, run) {
		const record = owner.admission(database);
		if (!(record ? readSqliteDatabaseGeneration(record, "writeScopeRevision") > 0 : state$1.localScopeRevisions.has(database))) {
			const value = run();
			if (value instanceof Promise) throw new Error("SQLite write scopes cannot await work");
			return value;
		}
		const keys = normalizedWriteScopes(scope);
		const previous = state$1.writeScopes.get(database);
		state$1.writeScopes.set(database, keys);
		try {
			const value = run();
			if (value instanceof Promise) throw new Error("SQLite write scopes cannot await work");
			return value;
		} finally {
			if (previous) state$1.writeScopes.set(database, previous);
			else state$1.writeScopes.delete(database);
		}
	}
	/** Authority and user callbacks cannot borrow their caller's certified mutation scope. */
	function withoutSqliteDatabaseWriteScope(database, run) {
		const previous = state$1.writeScopes.get(database);
		state$1.writeScopes.delete(database);
		try {
			return run();
		} finally {
			if (previous) state$1.writeScopes.set(database, previous);
		}
	}
	function ensureWriteScopes(record, keys) {
		let changed = false;
		for (const key of keys) {
			const previous = record.writeScopes.get(key);
			if (!previous || Atomics.load(previous.state, 1) !== 0) {
				record.writeScopes.set(key, createScopeRevision());
				if (threadId === 0) advanceSqliteDatabaseGeneration(record, "writeScopeRevision");
				changed = true;
			}
		}
		if (changed) {
			advanceSqliteDatabaseGeneration(record, "publicationRevision");
			owner.publish(record);
		}
	}
	function createScopeRevision() {
		return {
			identity: randomUUID(),
			state: new Int32Array(new SharedArrayBuffer(2 * Int32Array.BYTES_PER_ELEMENT))
		};
	}
	/** Deletion owners retire only scopes whose stored identity has actually been removed. */
	function retireSqliteDatabaseWriteScopes(database, scope) {
		const keys = normalizedWriteScopes(scope);
		const record = owner.admission(database);
		const retire = () => {
			if (!record) {
				const local = state$1.localScopeRevisions.get(database);
				for (const key of keys) local?.delete(key);
				return;
			}
			if (isSqliteDatabaseAdmissionRetired(record)) return;
			let changed = false;
			for (const key of keys) {
				const revision = record.writeScopes.get(key);
				if (revision && Atomics.exchange(revision.state, 1, 1) === 0) changed = true;
			}
			if (changed) {
				advanceSqliteDatabaseGeneration(record, "writeScopeRevision");
				advanceSqliteDatabaseGeneration(record, "publicationRevision");
				owner.publish(record);
			}
		};
		if (!stageSqliteTransactionState(database, {
			stage() {},
			commit: retire,
			rollback() {}
		}) && !database.isTransaction) retire();
	}
	function scopedWriteToken(record, keys, pending) {
		return JSON.stringify([
			record.identity,
			record.generationId,
			readSqliteDatabaseGeneration(record, "schemaRevision"),
			readSqliteDatabaseGeneration(record, "unscopedWriteRevision") + (pending === null ? 1 : 0) | 0,
			keys.map((key) => [
				key,
				record.writeScopes.get(key).identity,
				Atomics.load(record.writeScopes.get(key).state, 0) + (pending?.has(key) ? 1 : 0) | 0
			])
		]);
	}
	function localScopedWriteToken(database, keys, pending) {
		return JSON.stringify([
			"memory",
			(state$1.localUnscopedRevisions.get(database) ?? 0) + (pending === null ? 1 : 0),
			keys.map((key) => [
				key,
				state$1.localScopeRevisions.get(database).get(key).identity,
				Atomics.load(state$1.localScopeRevisions.get(database).get(key).state, 0) + (pending?.has(key) ? 1 : 0) | 0
			])
		]);
	}
	function normalizedWriteScopes(scope) {
		return [...new Set((typeof scope === "string" ? [scope] : scope).map((key) => typeof key === "string" ? JSON.stringify(["key", toUSVString(key)]) : JSON.stringify(["session-id", toUSVString(key.sessionId)])))].toSorted();
	}
	function ensureLocalWriteScopes(database, keys) {
		const revisions = state$1.localScopeRevisions.get(database) ?? /* @__PURE__ */ new Map();
		for (const key of keys) if (!revisions.has(key)) revisions.set(key, createScopeRevision());
		state$1.localScopeRevisions.set(database, revisions);
	}
	function readScopedWriteToken(database, scope, includePending = false) {
		const keys = normalizedWriteScopes(scope);
		const record = owner.admission(database);
		if (record) ensureWriteScopes(record, keys);
		else ensureLocalWriteScopes(database, keys);
		if (owner.readRevision(database) === void 0) return;
		const pending = includePending ? state$1.pendingWriteScopes.get(database) : void 0;
		return record ? scopedWriteToken(record, keys, pending) : localScopedWriteToken(database, keys, pending);
	}
	/** Per-key receipts survive unrelated committed writes. */
	function readSqliteDatabaseScopedWriteToken(database, scope) {
		return readScopedWriteToken(database, scope);
	}
	function readSqliteDatabaseScopedWriteTokenForPath(location, scope) {
		const keys = normalizedWriteScopes(scope);
		const record = owner.pathAdmission(location);
		if (!record || isSqliteDatabaseAdmissionRetired(record)) return;
		ensureWriteScopes(record, keys);
		return scopedWriteToken(record, keys);
	}
	/** A cohort discovers all dependency scopes in one admission publication. */
	function readSqliteDatabaseScopedWriteTokensForPath(location, scopes) {
		const record = owner.pathAdmission(location);
		if (!record || isSqliteDatabaseAdmissionRetired(record)) return;
		const groups = scopes.map(normalizedWriteScopes);
		ensureWriteScopes(record, groups.flat());
		return groups.map((keys) => scopedWriteToken(record, keys));
	}
	/** Capture the exact post-commit token before any fallible publication executes. */
	function readSqliteDatabasePendingScopedWriteToken(database, scope) {
		return readScopedWriteToken(database, scope, true);
	}
	/** Host row caches retain a physical identity and receipt without opening SQLite. */
	function readSqliteDatabaseWriteTokenForPath(location) {
		const record = owner.pathAdmission(location);
		if (!record || isSqliteDatabaseAdmissionRetired(record)) return;
		return `${record.identity}:${record.generationId}:${readSqliteDatabaseGeneration(record, "writeRevision")}`;
	}
	/** Predict the token published when the current native mutation settles. */
	function readSqliteDatabasePendingWriteToken(database) {
		if (!database.isOpen || !database.isTransaction || !hasSqlitePostCommitScope(database) || owner.suspended(database)) return;
		const record = owner.writer(database);
		if (!record || isSqliteDatabaseAdmissionRetired(record)) return;
		return `${record.identity}:${record.generationId}:${readSqliteDatabaseGeneration(record, "writeRevision") + 1 | 0}`;
	}
	return {
		begin(database, unscoped) {
			const scope = unscoped ? void 0 : state$1.writeScopes.get(database);
			const pending = state$1.pendingWriteScopes.get(database);
			if (!scope || pending === null) state$1.pendingWriteScopes.set(database, null);
			else {
				const keys = pending ?? /* @__PURE__ */ new Set();
				for (const key of scope) keys.add(key);
				state$1.pendingWriteScopes.set(database, keys);
			}
		},
		finish(database, record) {
			const keys = state$1.pendingWriteScopes.get(database);
			state$1.pendingWriteScopes.delete(database);
			let unscoped = !keys;
			if (keys) {
				const local = state$1.localScopeRevisions.get(database);
				for (const key of keys) {
					const localRevision = local?.get(key);
					if (localRevision) Atomics.add(localRevision.state, 0, 1);
					const revision = record?.writeScopes.get(key);
					if (revision && Atomics.load(revision.state, 1) === 0) Atomics.add(revision.state, 0, 1);
					else if (record && (revision || record.writeScopeRevision !== readSqliteDatabaseGeneration(record, "writeScopeRevision"))) unscoped = true;
				}
			}
			if (unscoped) {
				state$1.localUnscopedRevisions.set(database, (state$1.localUnscopedRevisions.get(database) ?? 0) + 1);
				if (record) advanceSqliteDatabaseGeneration(record, "unscopedWriteRevision");
			}
		},
		retireSqliteDatabaseWriteScopes,
		withSqliteDatabaseWriteScope,
		withoutSqliteDatabaseWriteScope,
		readSqliteDatabaseScopedWriteToken,
		readSqliteDatabaseScopedWriteTokenForPath,
		readSqliteDatabaseScopedWriteTokensForPath,
		readSqliteDatabasePendingScopedWriteToken,
		readSqliteDatabaseWriteTokenForPath,
		readSqliteDatabasePendingWriteToken
	};
}
//#endregion
//#region src/infra/sqlite-database-admission.ts
const state = resolveGlobalSingleton(Symbol.for("openclaw.sqliteDatabaseAdmissions"), () => ({
	registry: new SqliteDatabaseAdmissionRegistry(),
	connections: /* @__PURE__ */ new WeakMap(),
	openedIdentities: /* @__PURE__ */ new WeakMap(),
	unproven: /* @__PURE__ */ new WeakSet(),
	suspended: /* @__PURE__ */ new WeakSet(),
	local: /* @__PURE__ */ new WeakMap(),
	rolledBack: /* @__PURE__ */ new WeakSet(),
	dataWriters: /* @__PURE__ */ new WeakMap(),
	localWriteRevisions: /* @__PURE__ */ new WeakMap(),
	writeListeners: /* @__PURE__ */ new WeakMap(),
	ddlRevisions: /* @__PURE__ */ new WeakMap(),
	schemaDirty: /* @__PURE__ */ new WeakSet(),
	localSchemaRevisions: /* @__PURE__ */ new Map(),
	misses: /* @__PURE__ */ new WeakMap(),
	exchange: new AsyncLocalStorage(),
	exchanging: false,
	publication: 0,
	seals: new SqliteDatabaseCleanCloseSeals(publishFact, {
		retain: (record) => state.registry.changeReferences(record, 1),
		release: releaseReference
	})
}));
/** Capture admitted facts before close; publish only after successful TRUNCATE and native close. */
function prepareSqliteDatabaseCleanClose(database) {
	return state.seals.prepare(database, admission(database), getSqliteDatabaseAdmission(database, integrityVerificationKey));
}
const scopedWrites = createSqliteDatabaseWriteReceipts({
	admission,
	pathAdmission,
	readRevision: readSqliteDatabaseWriteRevision,
	writer: (database) => state.dataWriters.get(database),
	suspended: (database) => state.suspended.has(database),
	publish(record) {
		state.registry.publish(record);
		exchange(record);
	}
});
const { retireSqliteDatabaseWriteScopes, withSqliteDatabaseWriteScope, withoutSqliteDatabaseWriteScope, readSqliteDatabaseScopedWriteToken, readSqliteDatabaseScopedWriteTokenForPath, readSqliteDatabaseScopedWriteTokensForPath, readSqliteDatabasePendingScopedWriteToken, readSqliteDatabaseWriteTokenForPath, readSqliteDatabasePendingWriteToken } = scopedWrites;
function exchange(target, create) {
	const current = state.exchange.getStore();
	if (!current || state.exchanging) return;
	state.exchanging = true;
	try {
		const scope = typeof target === "string" ? { location: target } : { admissions: [target] };
		const retired = typeof target !== "string" && isSqliteDatabaseAdmissionRetired(target);
		installSqliteDatabaseAdmissions(current(retired ? [target] : captureSqliteDatabaseAdmissions(void 0, scope), retired ? void 0 : typeof target === "string" ? target : target.location, create));
	} finally {
		state.exchanging = false;
	}
}
/** Identity descriptors stay open for the process: closing one can release SQLite's POSIX locks. */
function retainSqliteDatabaseAdmissionLocation(location) {
	const observed = fs$1.statSync(location, { bigint: true });
	if (!observed.isFile()) return;
	const key = readSqliteDatabaseAdmissionIdentity(observed);
	const previous = state.registry.records.get(key);
	if (previous && !isSqliteDatabaseAdmissionRetired(previous)) {
		state.registry.observeLocation(location, key);
		state.seals.load(previous);
		return;
	}
	if (threadId !== 0) return;
	const descriptor = state.registry.descriptors.get(key) ?? fs$1.openSync(location, "r");
	const opened = fs$1.fstatSync(descriptor, { bigint: true });
	if (!opened.isFile() || readSqliteDatabaseAdmissionIdentity(opened) !== key) throw new Error("SQLite database changed while retaining its admission identity");
	const record = state.registry.retainDescriptor(fs$1.realpathSync.native(location), descriptor, opened);
	state.registry.observeLocation(location, record.identity);
	state.seals.load(record);
}
function pathAdmission(location) {
	let retained = state.registry.forLocation(location);
	if (!retained) {
		exchange(location);
		retained = state.registry.forLocation(location);
	}
	if (retained) {
		state.seals.load(retained);
		return retained;
	}
	try {
		retainSqliteDatabaseAdmissionLocation(location);
		return state.registry.forLocation(location);
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return;
		throw error;
	}
}
/** Resolve SQLite's absolute URLs and encoded filename form at filesystem boundaries. */
function resolveSqliteDatabaseFilePath(location) {
	if (!location.startsWith("file:")) return location;
	const [uriFilename = ""] = location.slice(5).split(/[?#]/u, 1);
	return uriFilename.startsWith("/") ? fileURLToPath(location) : decodeURIComponent(uriFilename);
}
/** Bracket native open so a pathname swap cannot lend the replacement file's admission. */
function prepareSqliteDatabaseAdmission(location, options = {}) {
	let filename = location;
	let create = options.create;
	if (!filename || filename === ":memory:") return;
	if (filename.startsWith("file:")) {
		const url = new URL(filename);
		if (url.searchParams.get("mode") === "memory") return;
		if (["ro", "rw"].includes(url.searchParams.get("mode") ?? "")) create = false;
		filename = resolveSqliteDatabaseFilePath(filename);
		if (!filename || filename === ":memory:") return;
	}
	try {
		const file = fs$1.statSync(filename, { bigint: true });
		if (!file.isFile()) return;
		const observed = readSqliteDatabaseAdmissionIdentity(file);
		state.registry.observeLocation(filename, observed);
		return observed;
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) {
			if (!create) return;
			if (threadId !== 0) {
				const managed = state.exchange.getStore() !== void 0;
				exchange(filename, true);
				const opened = prepareSqliteDatabaseAdmission(filename);
				if (managed && opened === void 0) throw new Error(`SQLite worker file creation requires host authority: ${filename}`, { cause: error });
				return opened;
			}
			let descriptor;
			try {
				descriptor = fs$1.openSync(filename, "wx", 420);
			} catch (creationError) {
				if (hasErrnoCode(creationError, "EEXIST")) return prepareSqliteDatabaseAdmission(filename);
				throw creationError;
			}
			const opened = fs$1.fstatSync(descriptor, { bigint: true });
			const record = state.registry.retainDescriptor(fs$1.realpathSync.native(filename), descriptor, opened);
			state.seals.markCreated(record);
			if (prepareSqliteDatabaseAdmission(filename) !== record.identity) throw new Error("SQLite database changed identity during file creation", { cause: error });
			return record.identity;
		}
		throw error;
	}
}
function bindSqliteDatabaseAdmission(database, expected) {
	state.connections.delete(database);
	state.openedIdentities.delete(database);
	state.unproven.delete(database);
	const location = database.location();
	if (!location || location === ":memory:") return;
	const observed = prepareSqliteDatabaseAdmission(location);
	if (expected !== void 0 && observed !== expected) throw new Error("SQLite database changed identity during native open");
	if (!observed) return;
	state.openedIdentities.set(database, observed);
	if (expected === void 0) {
		state.unproven.add(database);
		return;
	}
	const record = state.registry.records.get(observed);
	if (record && !isSqliteDatabaseAdmissionRetired(record)) retainConnection(database, record);
}
function admission(database, create = true) {
	const expected = state.openedIdentities.get(database);
	if (!database.isOpen || expected === void 0 || state.unproven.has(database)) return;
	const retained = state.connections.get(database);
	if (retained) return isSqliteDatabaseAdmissionRetired(retained) ? void 0 : retained;
	const location = database.location();
	if (!location || location === ":memory:") return;
	const record = create && !database.isTransaction ? pathAdmission(location) : state.registry.records.get(expected);
	if (record && record.identity !== expected) throw new Error("SQLite database changed identity before admission");
	return record && !isSqliteDatabaseAdmissionRetired(record) ? retainConnection(database, record) : void 0;
}
function retainConnection(database, record) {
	const expected = record.identity;
	let current = record;
	try {
		for (;;) {
			if (current.identity !== expected) throw new Error("SQLite database changed identity during native open");
			const publish = state.registry.changeReferences(current, 1);
			let retained = false;
			try {
				if (publish) exchange(current);
				const retirement = readSqliteDatabaseGeneration(current, "retired");
				if (retirement === 0) {
					state.connections.set(database, current);
					retained = true;
					return current;
				}
				if (retirement !== 2) throw new Error("SQLite database admission retired during native open");
			} finally {
				if (!retained) state.registry.changeReferences(current, -1);
			}
			const location = database.location();
			const replacement = database.isTransaction ? state.registry.records.get(expected) : location ? pathAdmission(location) : void 0;
			if (!replacement || isSqliteDatabaseAdmissionRetired(replacement)) throw new Error("SQLite database admission unavailable during native open");
			current = replacement;
		}
	} catch (error) {
		state.openedIdentities.delete(database);
		throw error;
	}
}
/** Native close has settled; keep only descriptor custody, never the closed database's payloads. */
function releaseSqliteDatabaseAdmission(database) {
	const record = state.connections.get(database);
	if (state.openedIdentities.delete(database) && record) {
		state.local.delete(database);
		releaseReference(record);
	}
}
function releaseReference(record) {
	if (state.registry.changeReferences(record, -1)) {
		state.localSchemaRevisions.delete(record.identity);
		exchange(record);
	}
}
const { getSqliteDatabaseAdmission, getOrLoadSqliteDatabaseAdmissionForPath } = createSqliteDatabaseAdmissionReader({
	state,
	admission,
	pathAdmission,
	exchange,
	publishFact
});
function publishFact(record, key, value, revision) {
	if (key.writer === "host" && threadId !== 0) throw new Error("SQLite host-owned admission facts require the host publisher");
	if (!publishSqliteDatabaseFact(record, key, value, revision, `${threadId}:${++state.publication}`)) return;
	state.registry.publish(record);
	exchange(record);
}
/** Publish one row-cache revision when a local native write settles. */
function beginSqliteDatabaseWrite(database, unscoped = false) {
	const record = admission(database);
	if (record && Atomics.load(new Int32Array(record.generation), SqliteDatabaseGenerationSlot.sealPresent) === 1) state.seals.invalidate(record.location, record);
	scopedWrites.begin(database, unscoped);
	if (state.dataWriters.has(database)) return;
	state.dataWriters.set(database, admission(database));
}
/** Native settlement invalidates row caches, including failed or rolled-back writes. */
function finishSqliteDatabaseWrite(database) {
	if (!state.dataWriters.has(database)) return;
	const record = state.dataWriters.get(database);
	state.dataWriters.delete(database);
	state.localWriteRevisions.set(database, (state.localWriteRevisions.get(database) ?? 0) + 1);
	scopedWrites.finish(database, record);
	if (record) {
		advanceSqliteDatabaseGeneration(record, "writeRevision");
		const listeners = state.writeListeners.get(record);
		if (listeners) notifyListeners(listeners, void 0);
	}
}
/** Ordinary reads consume the last committed writer revision without a writer census. */
function readSqliteDatabaseWriteRevision(connection) {
	const database = sqlPublicationAnchor(connection);
	if (!database.isOpen || state.suspended.has(database)) return;
	const record = admission(database);
	if (!record) {
		const location = database.location();
		return !location || location === ":memory:" ? state.localWriteRevisions.get(database) ?? 0 : void 0;
	}
	return readSqliteDatabaseGeneration(record, "writeRevision");
}
/** A stopped worker may have committed before delivering its row-cache receipt. */
function trackSqliteDatabaseAdmissionWorker(worker) {
	const owner = worker.threadId;
	worker.once("exit", () => state.registry.releaseWorker(owner));
}
function publishSqliteDatabaseAdmission(database, key, value, options = {}) {
	const anchor = sqlPublicationAnchor(database);
	const record = admission(anchor, !database.isTransaction);
	if (!record || isSqliteDatabaseAdmissionRetired(record) || state.suspended.has(anchor)) return;
	if (key.writer === "host" && threadId !== 0) throw new Error("SQLite host-owned admission facts require the host publisher");
	const revision = (key.schemaDependent ? options.schemaRevision : void 0) ?? readSqliteDatabaseFactRevision(record, key.schemaDependent);
	const native = isPostgresSqlConnection(database) ? void 0 : getSqliteNativeAdmissionFacts(database);
	if (!native && !database.isTransaction) {
		publishFact(record, key, value, revision);
		return;
	}
	const staged = {
		value,
		revision,
		schemaDependent: key.schemaDependent === true,
		ddlRevision: state.ddlRevisions.get(anchor) ?? 0
	};
	if (native) {
		native.set(key.name, staged);
		return;
	}
	const local = state.local.get(anchor) ?? /* @__PURE__ */ new Map();
	state.local.set(anchor, local);
	const previous = local.get(key.name);
	const restore = () => {
		if (state.local.get(anchor) !== local) return;
		if (previous === void 0) local.delete(key.name);
		else local.set(key.name, previous);
	};
	stageSqliteTransactionState(anchor, {
		stage: () => local.set(key.name, staged),
		rollback: restore,
		commit: () => {
			if (state.local.get(anchor) === local && local.get(key.name) === staged) {
				local.delete(key.name);
				if (staged.revision === readSqliteDatabaseFactRevision(record, staged.schemaDependent) && (!staged.schemaDependent || staged.ddlRevision === (state.ddlRevisions.get(anchor) ?? 0))) publishFact(record, key, value, staged.revision);
			}
		}
	});
}
/** Track uncommitted DDL separately so it cannot revive a receipt validated before a later change. */
function invalidateLocalSqliteSchemaAdmissions(database) {
	const anchor = sqlPublicationAnchor(database);
	const revision = state.ddlRevisions.get(anchor) ?? 0;
	const dirty = state.schemaDirty.has(anchor);
	const stage = () => {
		state.ddlRevisions.set(anchor, revision + 1);
		state.schemaDirty.add(anchor);
	};
	if (!stageSqliteTransactionState(anchor, {
		stage,
		commit: () => {},
		rollback: () => {
			state.ddlRevisions.set(anchor, revision);
			if (!dirty) state.schemaDirty.delete(anchor);
		}
	})) stage();
}
/** Raw rollback cannot restore staging boundaries; require new facts in any remaining transaction. */
function discardSqliteDatabaseTransactionAdmissions(database) {
	const anchor = sqlPublicationAnchor(database);
	const record = admission(anchor, false);
	for (const pending of [isPostgresSqlConnection(database) ? void 0 : getSqliteNativeAdmissionFacts(database), state.local.get(anchor)]) {
		for (const key of pending?.keys() ?? []) {
			const previous = record?.facts.get(key);
			if (previous) Atomics.store(new Int32Array(previous.current), 0, 0);
		}
		pending?.clear();
	}
	state.local.delete(anchor);
	state.rolledBack.add(anchor);
	if (!database.isTransaction) state.schemaDirty.delete(anchor);
}
/** The DDL owner advances committed format and acknowledges only its final validated receipts. */
function publishSqliteDatabaseSchemaChange(database) {
	const anchor = sqlPublicationAnchor(database);
	const record = admission(anchor, false);
	if (record) {
		const previous = advanceSqliteDatabaseGeneration(record, "schemaRevision");
		const ddlRevision = state.ddlRevisions.get(anchor) ?? 0;
		for (const fact of state.local.get(anchor)?.values() ?? []) if (fact.schemaDependent && fact.revision === previous && fact.ddlRevision === ddlRevision) fact.revision = previous + 1;
	} else {
		const fileIdentity = state.openedIdentities.get(anchor);
		if (fileIdentity) state.localSchemaRevisions.set(fileIdentity, (state.localSchemaRevisions.get(fileIdentity) ?? 0) + 1);
	}
	if (!database.isTransaction) state.schemaDirty.delete(anchor);
}
function revoke(record, location = record?.location) {
	if (location) state.seals.invalidate(location, record);
	if (record) {
		advanceSqliteDatabaseGeneration(record, "schemaRevision");
		advanceSqliteDatabaseGeneration(record, "factRevision");
	}
}
function revokeSqliteDatabaseAdmissions(database) {
	revoke(state.connections.get(database) ?? admission(database));
	state.local.delete(database);
}
function revokeSqliteDatabaseAdmissionsForPath(location) {
	revoke(pathAdmission(location), location);
}
/** Explicit removal or maintenance calls this only after its owner has joined native consumers. */
function retireSqliteDatabaseAdmissionForPath(location, options = {}) {
	const observed = prepareSqliteDatabaseAdmission(location);
	if (!observed) return;
	state.localSchemaRevisions.delete(observed);
	const record = threadId === 0 ? state.registry.records.get(observed) : pathAdmission(location);
	if (state.registry.retireDescriptor(observed, options) && record) exchange(record);
}
function getSqliteDatabaseSchemaRevision(connection) {
	const database = sqlPublicationAnchor(connection);
	const record = admission(database);
	if (record) return readSqliteDatabaseGeneration(record, "schemaRevision");
	const fileIdentity = state.openedIdentities.get(database);
	return fileIdentity ? state.localSchemaRevisions.get(fileIdentity) ?? 0 : void 0;
}
function suspendSqliteDatabaseAdmission(database, suspended) {
	if (suspended) state.suspended.add(database);
	else state.suspended.delete(database);
}
function hasSqliteDatabaseSchemaAdmissionForPath(location) {
	return hasSqliteDatabaseSchemaAdmission(pathAdmission(location));
}
/** Admission owns the descriptor's immutable identity; callers do not re-stat its pathname. */
function getSqliteDatabaseAdmissionIdentityForPath(location) {
	return state.registry.forLocation(location)?.physicalIdentity;
}
function captureSqliteDatabaseAdmissions(cursor, scope) {
	if (!scope) return state.registry.capture(cursor);
	const identities = new Set(scope.admissions?.map((record) => record.identity));
	if (scope.location !== void 0) {
		const observed = state.registry.forLocation(scope.location)?.identity;
		if (observed) identities.add(observed);
	}
	return state.registry.capture(cursor, identities);
}
function installSqliteDatabaseAdmissions(admissions) {
	state.registry.install(admissions);
}
/** Unsupported worker hosts retain native validation instead of waiting for unpublished facts. */
function canShareSqliteDatabaseAdmissions() {
	return threadId === 0 || state.exchange.getStore() !== void 0;
}
const inherited = readSqliteDatabaseAdmissions(getEnvironmentData(SQLITE_DATABASE_ADMISSIONS_KEY));
if (inherited) installSqliteDatabaseAdmissions(inherited);
//#endregion
//#region src/infra/kysely-sync-cache-state.ts
const { kyselyByDatabase, queryErrorHandlerByDatabase } = resolveGlobalSingleton(Symbol.for("openclaw.sqliteKyselyCacheState"), () => ({
	kyselyByDatabase: /* @__PURE__ */ new WeakMap(),
	queryErrorHandlerByDatabase: /* @__PURE__ */ new WeakMap()
}));
const statementCacheSymbol = Symbol.for("openclaw.kyselySyncStatementCache");
const statementInvalidationSymbol = Symbol.for("openclaw.kyselySyncStatementInvalidation");
const statementCacheEnabledSymbol = Symbol.for("openclaw.kyselySyncStatementCacheEnabled");
const authorizerActiveSymbol = Symbol.for("openclaw.kyselySyncAuthorizerActive");
const disposeCallbacksSymbol = Symbol.for("openclaw.sqliteDisposeCallbacks");
const statementCacheCapacity = 64;
const statementCacheEntryBytes = 65536;
/** Retire dependent native resources before this connection closes or is replaced. */
function registerNodeSqliteDisposeCallback(db, callback) {
	const owner = db;
	installStatementInvalidation(owner);
	return registerListener(owner[disposeCallbacksSymbol] ??= /* @__PURE__ */ new Set(), callback);
}
function disposeNodeSqliteDependents(owner, reason = "close") {
	for (const callback of owner[disposeCallbacksSymbol] ?? []) callback(reason);
}
/** Register the lifecycle owner's handler for synchronous Kysely query failures. */
function registerNodeSqliteKyselyQueryErrorHandler(db, handler) {
	queryErrorHandlerByDatabase.set(db, handler);
}
/** Drop cached Kysely state for a DatabaseSync. */
function clearNodeSqliteKyselyCacheForDatabase(db) {
	delete db[statementCacheSymbol];
	kyselyByDatabase.delete(db);
	queryErrorHandlerByDatabase.delete(db);
}
function installStatementInvalidation(owner) {
	if (owner[statementInvalidationSymbol]) return;
	if (typeof owner.setAuthorizer === "function") {
		const setAuthorizer = owner.setAuthorizer.bind(owner);
		Object.defineProperty(owner, "setAuthorizer", {
			configurable: true,
			writable: true,
			value(callback) {
				setAuthorizer(callback);
				this[authorizerActiveSymbol] = callback !== null;
				delete this[statementCacheSymbol];
			}
		});
	}
	if (typeof owner.deserialize === "function") {
		const deserialize = owner.deserialize.bind(owner);
		Object.defineProperty(owner, "deserialize", {
			configurable: true,
			writable: true,
			value(...args) {
				disposeNodeSqliteDependents(this, "replace");
				try {
					deserialize(...args);
				} finally {
					delete this[statementCacheSymbol];
				}
			}
		});
	}
	for (const method of ["close", Symbol.dispose]) if (typeof owner[method] === "function") {
		const dispose = owner[method].bind(owner);
		Object.defineProperty(owner, method, {
			configurable: true,
			writable: true,
			value() {
				disposeNodeSqliteDependents(this);
				clearNodeSqliteKyselyCacheForDatabase(this);
				return dispose();
			}
		});
	}
	Object.defineProperty(owner, statementInvalidationSymbol, {
		configurable: true,
		value: true
	});
}
function queryFitsStatementCache(sql, parameters) {
	let bytes = Buffer.byteLength(sql);
	if (bytes > statementCacheEntryBytes) return false;
	for (const parameter of parameters) {
		if (typeof parameter === "string") {
			if (parameter.length > statementCacheEntryBytes - bytes) return false;
			bytes += Buffer.byteLength(parameter);
		} else if (ArrayBuffer.isView(parameter)) bytes += parameter.byteLength;
		if (bytes > statementCacheEntryBytes) return false;
	}
	return true;
}
function executeWithCachedStatement(db, sql, parameters, execute) {
	if (isPostgresSqlConnection(db)) return execute(db.prepare(sql));
	const owner = db;
	if (!owner[statementCacheEnabledSymbol] || owner[authorizerActiveSymbol] || !queryFitsStatementCache(sql, parameters)) return execute(db.prepare(sql));
	let cache = owner[statementCacheSymbol];
	if (!cache) {
		cache = {
			statements: /* @__PURE__ */ new Map(),
			candidates: /* @__PURE__ */ new Set(),
			active: /* @__PURE__ */ new WeakSet()
		};
		Object.defineProperty(owner, statementCacheSymbol, {
			configurable: true,
			value: cache
		});
	}
	const cached = cache.statements.get(sql);
	let statement;
	if (cached && !cache.active.has(cached)) {
		cache.statements.delete(sql);
		cache.statements.set(sql, cached);
		statement = cached;
	} else {
		statement = db.prepare(sql);
		if (!cached && cache.candidates.delete(sql)) {
			cache.statements.set(sql, statement);
			pruneMapToMaxSize(cache.statements, statementCacheCapacity);
		} else if (!cached) {
			cache.candidates.add(sql);
			if (cache.candidates.size > statementCacheCapacity) {
				const oldestCandidate = cache.candidates.values().next().value;
				if (oldestCandidate !== void 0) cache.candidates.delete(oldestCandidate);
			}
		}
	}
	cache.active.add(statement);
	try {
		return execute(statement);
	} finally {
		cache.active.delete(statement);
	}
}
//#endregion
//#region src/infra/sql-query-compiler.ts
const templateFragments = (fragments, _value) => fragments;
const sqliteStringSetFragments = templateFragments`(SELECT value FROM json_each(${0}))`;
const sqliteStringSetEntriesFragments = templateFragments`json_each(${0})`;
/** Lower only the shared string-set primitive; arbitrary raw SQL stays caller-owned. */
var OpenClawPostgresQueryCompiler = class extends PostgresQueryCompiler {
	visitRaw(node) {
		const values = node.sqlFragments === sqliteStringSetFragments;
		if (!values && node.sqlFragments !== sqliteStringSetEntriesFragments) {
			super.visitRaw(node);
			return;
		}
		this.append(values ? "(SELECT value FROM json_array_elements_text(" : "(SELECT ordinality - 1 AS key, value FROM json_array_elements_text(");
		this.compileList(node.parameters);
		this.append(values ? "::json) AS value)" : "::json) WITH ORDINALITY AS entries(value, ordinality))");
	}
};
var OpenClawPostgresDialect = class extends PostgresDialect {
	createQueryCompiler() {
		return new OpenClawPostgresQueryCompiler();
	}
};
//#endregion
//#region src/infra/sqlite-reader-lifecycle.ts
const readerOwners = resolveGlobalSingleton(Symbol.for("openclaw.sqliteReaderOwners"), () => new AsyncLocalStorage());
const activeReaders = resolveGlobalSingleton(Symbol.for("openclaw.sqliteActiveReaders"), () => ({
	byDatabase: /* @__PURE__ */ new WeakMap(),
	byPath: /* @__PURE__ */ new Map()
}));
const connections = resolveGlobalSingleton(Symbol.for("openclaw.sqliteReaderConnections"), () => ({
	nextId: 0,
	byDatabase: /* @__PURE__ */ new WeakMap(),
	byPath: /* @__PURE__ */ new Map(),
	finalizer: new FinalizationRegistry((connection) => forgetConnection(connection))
}));
/** The same Windows file can arrive with a namespaced or differently cased path. */
function sqliteReaderDatabasePathKey(databasePath) {
	const resolved = path.resolve(databasePath);
	return process.platform === "win32" ? normalizeWindowsPathForComparison(resolved) : resolved;
}
function boundedOperation(operation) {
	return (operation.trim() || "sqlite reader").slice(0, 120);
}
/** Mutable diagnostic counters only; never source or write authority. */
function currentSqliteOperationTiming() {
	return readerOwners.getStore()?.timing;
}
function currentOwner(fallbackOperation, capturedOwner) {
	const inherited = capturedOwner ?? readerOwners.getStore();
	return {
		operation: boundedOperation(inherited?.operation ?? fallbackOperation),
		ownerKind: inherited?.ownerKind ?? (isMainThread ? "main" : "worker"),
		...inherited?.actorId !== void 0 ? { actorId: inherited.actorId } : {}
	};
}
function connectionFor(database) {
	let connection = connections.byDatabase.get(database);
	if (!connection) {
		const now = Date.now();
		const location = database.location();
		connection = {
			id: ++connections.nextId,
			path: location ? sqliteReaderDatabasePathKey(location) : void 0,
			database: new WeakRef(database),
			owner: currentOwner("sqlite connection"),
			openedAtMs: now
		};
		connections.byDatabase.set(database, connection);
		if (connection.path) {
			const entries = connections.byPath.get(connection.path) ?? /* @__PURE__ */ new Map();
			entries.set(connection.id, connection);
			connections.byPath.set(connection.path, entries);
		}
		connections.finalizer.register(database, connection, connection);
	}
	return connection;
}
/** Forget observations only; explicit reader custody belongs to its caller. */
function forgetConnection(connection) {
	if (connection.path) {
		const entries = connections.byPath.get(connection.path);
		entries?.delete(connection.id);
		if (entries?.size === 0) connections.byPath.delete(connection.path);
	}
	const database = connection.database.deref();
	if (database && connections.byDatabase.get(database) === connection) connections.byDatabase.delete(database);
	connections.finalizer.unregister(connection);
}
/** Register weak metadata without replacing native methods or acquiring lifecycle custody. */
function registerSqliteReaderConnection(database) {
	if (database.isOpen) connectionFor(database);
}
function retainSqliteReader(database, fallbackOperation, capturedOwner) {
	const connection = connectionFor(database);
	const now = Date.now();
	const reader = {
		...currentOwner(fallbackOperation, capturedOwner),
		kind: "iterator",
		connectionId: connection.id,
		threadId,
		startedAtMs: now,
		lastProgressAtMs: now
	};
	const token = Symbol(reader.operation);
	const databaseReaders = activeReaders.byDatabase.get(database) ?? /* @__PURE__ */ new Map();
	databaseReaders.set(token, reader);
	activeReaders.byDatabase.set(database, databaseReaders);
	const databasePath = connection.path;
	const pathReaders = databasePath ? activeReaders.byPath.get(databasePath) ?? /* @__PURE__ */ new Map() : void 0;
	pathReaders?.set(token, reader);
	if (databasePath && pathReaders) activeReaders.byPath.set(databasePath, pathReaders);
	return {
		progress() {
			if (databaseReaders.has(token)) reader.lastProgressAtMs = Date.now();
		},
		release() {
			if (!databaseReaders.delete(token)) return;
			if (databaseReaders.size === 0 && activeReaders.byDatabase.get(database) === databaseReaders) activeReaders.byDatabase.delete(database);
			pathReaders?.delete(token);
			if (databasePath && pathReaders?.size === 0 && activeReaders.byPath.get(databasePath) === pathReaders) activeReaders.byPath.delete(databasePath);
		}
	};
}
//#endregion
//#region src/infra/kysely-sync.ts
const nodeVersion = parseNodeReleaseVersion(process.versions.node);
const supportsRepreparedAll = !process.versions.bun && (nodeVersion?.major === 24 && isNodeVersionAtLeast(nodeVersion, {
	major: 24,
	minor: 20,
	patch: 0
}) || isNodeVersionAtLeast(nodeVersion, {
	major: 26,
	minor: 6,
	patch: 0
}));
const compileOnlySqliteDialect = new SqliteDialect({ database: async () => {
	throw new Error("getNodeSqliteKysely() returns a compile-only Kysely facade; use executeSqliteQuerySync() to execute node:sqlite queries.");
} });
const postgresKyselyByDatabase = /* @__PURE__ */ new WeakMap();
const compileOnlyPostgresDialect = new OpenClawPostgresDialect({ pool: async () => {
	throw new Error("getNodeSqliteKysely() returns a compile-only Kysely facade.");
} });
function getNodeSqliteKysely(db) {
	if (isPostgresSqlConnection(db)) {
		let kysely = postgresKyselyByDatabase.get(db);
		if (!kysely) {
			kysely = new Kysely({ dialect: compileOnlyPostgresDialect });
			postgresKyselyByDatabase.set(db, kysely);
		}
		return kysely;
	}
	const existing = kyselyByDatabase.get(db);
	if (existing) return existing;
	const kysely = new Kysely({ dialect: compileOnlySqliteDialect });
	kyselyByDatabase.set(db, kysely);
	return kysely;
}
function reportNodeSqliteKyselyQueryError(db, error) {
	try {
		queryErrorHandlerByDatabase.get(db)?.(error);
	} catch {}
}
function releaseSqliteIterator(iterator, reader, failed, cleanupErrorMessage) {
	let cleanupError;
	try {
		iterator.return?.();
	} catch (error) {
		cleanupError = error;
	}
	reader.release();
	if (!failed && cleanupError !== void 0) throw toErrorObject(cleanupError, cleanupErrorMessage);
}
/** Execute a compiled Kysely query synchronously against node:sqlite. */
function executeCompiledSqliteQuerySync(db, compiledQuery, firstRowOnly = false, parameters = compiledQuery.parameters) {
	if (isPostgresSqlConnection(db)) {
		const result = db.query(compiledQuery.sql, parameters);
		const rows = firstRowOnly ? result.rows.slice(0, 1) : result.rows;
		return result.columns.length > 0 ? { rows } : {
			rows: [],
			numAffectedRows: BigInt(result.rowCount)
		};
	}
	try {
		const sql = compiledQuery.sql;
		installStatementInvalidation(db);
		return executeWithCachedStatement(db, sql, parameters, (statement) => {
			if (firstRowOnly && SelectQueryNode.is(compiledQuery.query)) {
				const row = statement.get(...parameters);
				return { rows: row === void 0 ? [] : [row] };
			}
			if (SelectQueryNode.is(compiledQuery.query) || statement.columns().length > 0) {
				if (supportsRepreparedAll) return { rows: statement.all(...parameters) };
				const iterator = statement.iterate(...parameters);
				const reader = retainSqliteReader(db, "kysely eager query");
				let failed = false;
				let failure;
				const rows = [];
				try {
					for (const row of iterator) {
						reader.progress();
						rows.push(row);
					}
				} catch (error) {
					failed = true;
					failure = error;
				}
				releaseSqliteIterator(iterator, reader, failed, "SQLite query cleanup failed");
				if (failed) throw toErrorObject(failure, "SQLite query failed");
				return { rows };
			}
			statement.setReadBigInts(true);
			let outcome;
			try {
				outcome = statement.run(...parameters);
			} finally {
				statement.setReadBigInts(false);
			}
			const { changes, lastInsertRowid } = outcome;
			const result = {
				numAffectedRows: BigInt(changes),
				rows: []
			};
			if (InsertQueryNode.is(compiledQuery.query) && changes > 0) return {
				...result,
				insertId: BigInt(lastInsertRowid)
			};
			return result;
		});
	} catch (error) {
		reportNodeSqliteKyselyQueryError(db, error);
		throw error;
	}
}
/** Cache compiled query functions or bundles by native connection. */
function createSqliteQueryCache(create) {
	const queriesByDatabase = /* @__PURE__ */ new WeakMap();
	return (database) => {
		let queries = queriesByDatabase.get(database);
		if (queries === void 0) {
			queries = create(database);
			queriesByDatabase.set(database, queries);
		}
		return queries;
	};
}
/** Compile fixed SQL and fresh bindings without taking ownership of a native statement. */
function compileSqliteQueryBindings(build) {
	const bindings = /* @__PURE__ */ new Map();
	const compiled = build((read) => {
		const marker = Symbol("sqlite-query-parameter");
		bindings.set(marker, read);
		return sql`${marker}`;
	}).compile();
	const readers = compiled.parameters.map((value) => bindings.get(value) ?? (() => value));
	return {
		compiled,
		bind: (params) => readers.map((read) => read(params))
	};
}
/** Compile a fixed query once; bind fresh values through the normal sync executor on each call. */
function prepareSqliteQuerySync(db, build) {
	const { compiled, bind } = compileSqliteQueryBindings(build);
	return (params) => executeCompiledSqliteQuerySync(db, compiled, false, bind(params));
}
/** Execute a Kysely query synchronously and return its first row. */
function executeSqliteQueryTakeFirstSync(db, query) {
	return executeCompiledSqliteQuerySync(db, query.compile(), true).rows[0];
}
//#endregion
//#region src/infra/semver.ts
function compareValidSemver(left, right) {
	const parsedLeft = parse(left);
	const parsedRight = parse(right);
	return parsedLeft && parsedRight ? parsedLeft.compare(parsedRight) : null;
}
//#endregion
//#region src/infra/sqlite-schema-mutation.ts
function schemaStatement(sql) {
	if (/^(?:CREATE|ALTER|DROP|REINDEX|VACUUM)\b/iu.test(sql)) return true;
	const catalogWrite = /^(?:INSERT(?: OR \w+)? INTO|UPDATE(?: OR \w+)?|DELETE FROM|REPLACE INTO)\s+/iu.exec(sql);
	if (catalogWrite) {
		const target = readSqlToken(sql, catalogWrite[0].length)?.raw ?? "";
		const name = target.slice(findSqlCharacter(target, ".") + 1);
		return ["sqlite_schema", "sqlite_master"].includes(normalizeSqlIdentifier(name));
	}
	if (!/^PRAGMA\b/iu.test(sql)) return false;
	const argumentsAt = [findSqlCharacter(sql, "="), findSqlCharacter(sql, "(")].filter((position) => position >= 0);
	if (argumentsAt.length === 0) return false;
	const qualified = sql.slice(6, Math.min(...argumentsAt)).trim();
	const name = qualified.slice(findSqlCharacter(qualified, ".") + 1).trim();
	const pragma = name.startsWith("'") && name.endsWith("'") ? name.slice(1, -1).toLowerCase() : normalizeSqlIdentifier(name);
	return ["user_version", "schema_version"].includes(pragma);
}
function changesSchema(sql) {
	if (!/\b(?:CREATE|ALTER|DROP|REINDEX|VACUUM|PRAGMA|INSERT|UPDATE|DELETE|REPLACE)\b/iu.test(sql)) return false;
	let remaining = normalizeSqlWhitespace(sql);
	while (remaining) {
		remaining = remaining.replace(/^[\s;]+/u, "");
		const end = findSqlCharacter(remaining, ";");
		if (schemaStatement(end < 0 ? remaining : remaining.slice(0, end))) return true;
		remaining = end < 0 ? "" : remaining.slice(end + 1);
	}
	return false;
}
function createsOnlyTemporaryObject(sql) {
	let remaining = normalizeSqlWhitespace(sql);
	const kind = /^\s*CREATE\s+(?:TEMP|TEMPORARY)\s+(TABLE|TRIGGER)\b/iu.exec(remaining)?.[1]?.toUpperCase();
	if (!kind) return false;
	let end = findSqlCharacter(remaining, ";");
	if (kind === "TABLE") return end < 0 || remaining.slice(end + 1).trim() === "";
	while (end >= 0) {
		remaining = remaining.slice(end + 1).trim();
		end = findSqlCharacter(remaining, ";");
		const step = (end < 0 ? remaining : remaining.slice(0, end)).trim();
		if (/^END$/iu.test(step)) return end < 0 || remaining.slice(end + 1).trim() === "";
	}
	return false;
}
function changesOnlyTemporaryTable(sql) {
	const normalized = normalizeSqlWhitespace(sql);
	const end = findSqlCharacter(normalized, ";");
	if (end >= 0 && normalized.slice(end + 1).trim() !== "") return false;
	return /^CREATE\s+(?:TEMP|TEMPORARY)\s+TABLE\b/iu.test(normalized) || /^DROP\s+TABLE\s+(?:IF\s+EXISTS\s+)?(?:temp|"temp"|`temp`|\[temp\])\s*\./iu.test(normalized);
}
function changesData(sql) {
	return hasUnquotedSqlKeyword(sql, /\b(?:INSERT|UPDATE|DELETE|REPLACE)\b/giu);
}
function temporaryWriteTables(sql) {
	const tables = [];
	let remaining = normalizeSqlWhitespace(sql);
	while (remaining) {
		remaining = remaining.replace(/^[\s;]+/u, "");
		const end = findSqlCharacter(remaining, ";");
		const statement = end < 0 ? remaining : remaining.slice(0, end);
		if (changesData(statement)) {
			const table = /^(?:INSERT(?: OR \w+)? INTO|REPLACE INTO|UPDATE(?: OR \w+)?|DELETE FROM)\s+(?:temp|"temp"|`temp`|\[temp\])\s*\.\s*("(?:[^"]|"")+"|`(?:[^`]|``)+`|\[[^\]]+\]|[a-z_]\w*)(?=\s|\(|$)/iu.exec(statement)?.[1];
			if (table === void 0) return;
			tables.push(normalizeSqlIdentifier(table));
		}
		remaining = end < 0 ? "" : remaining.slice(end + 1);
	}
	return tables;
}
const sqlLeadingTrivia = /^(?:\s|;|--[^\n]*(?:\n|$)|\/\*(?:[^*]|\*(?!\/))*(?:\*\/|$))*/u;
const transactionControlPrefix = /^(BEGIN|SAVEPOINT|COMMIT|END|RELEASE|ROLLBACK)\b/i;
function readTransactionControl(sql, mode) {
	let control;
	let outerRollback = false;
	let otherChanges = false;
	let statements = 0;
	let remaining = sql;
	while (remaining) {
		remaining = remaining.replace(sqlLeadingTrivia, "");
		if (!remaining) break;
		statements += 1;
		const end = remaining.includes(";") ? findSqlCharacter(remaining, ";") : -1;
		const statement = end < 0 ? remaining : remaining.slice(0, end);
		const next = transactionControlPrefix.exec(statement)?.[1]?.toUpperCase();
		if (next === "ROLLBACK") {
			control = next;
			otherChanges ||= outerRollback;
			outerRollback = !/^ROLLBACK(?: TRANSACTION)? TO\b/iu.test(normalizeSqlWhitespace(statement));
			otherChanges ||= !outerRollback;
		} else if (next || !/^SELECT\b/iu.test(statement) && (changesSchema(statement) || changesData(statement))) otherChanges = true;
		control ||= next;
		if (end < 0 || mode === "statement") break;
		remaining = remaining.slice(end + 1);
	}
	return control ? {
		kind: control,
		single: statements === 1,
		outerRollback: outerRollback && !otherChanges
	} : void 0;
}
function canPreserveTransactionSnapshot(control, inTransaction) {
	return Boolean(inTransaction && control?.single && (control.kind === "SAVEPOINT" || control.kind === "RELEASE" || control.kind === "ROLLBACK"));
}
function classifySqliteMutation(sql, mode) {
	const schemaChange = changesSchema(sql);
	const dataChange = changesData(sql);
	const temporaryTableSchemaChange = schemaChange && changesOnlyTemporaryTable(sql);
	return {
		schemaChange,
		mainSchemaChange: schemaChange && !temporaryTableSchemaChange && !createsOnlyTemporaryObject(sql),
		temporaryTableSchemaChange,
		dataChange,
		temporaryWriteTables: dataChange ? temporaryWriteTables(sql) : void 0,
		control: readTransactionControl(sql, mode)
	};
}
//#endregion
//#region src/infra/sqlite-native-observer.ts
/** The runtime owner reuses its prepared one-row library probe, once per process load. */
function probeSqliteIteratorBehavior(statement) {
	const previous = statement.iterate();
	previous.next();
	previous.next();
	const nextAfterDoneIsTerminal = previous.next().done === true;
	previous.return?.();
	const current = statement.iterate();
	try {
		current.next();
		previous.return?.();
		return {
			nextAfterDoneIsTerminal,
			returnAfterDoneIsInert: current.next().done === true
		};
	} finally {
		current.return?.();
	}
}
const pending = resolveGlobalSingleton(Symbol.for("openclaw.sqliteNativeExecution"), () => /* @__PURE__ */ new WeakMap());
const iteratorFinalizer = new FinalizationRegistry((lifetimes) => {
	for (const lifetime of lifetimes) lifetime.finish(false, true);
});
function createIteratorLifetime(active, activeIterators) {
	const lifetime = {
		finished: false,
		invalidated: false,
		pause: () => lifetime.stopObservation(),
		invalidate: () => {
			lifetime.invalidated = true;
			lifetime.finish();
		},
		stopObservation: (succeeded = false, abandoned = false) => {
			const previous = lifetime.observed;
			lifetime.observed = void 0;
			activeIterators.delete(lifetime);
			previous?.finish(succeeded, abandoned);
		},
		finish: (succeeded = false, abandoned = false) => {
			if (!lifetime.finished) {
				lifetime.finished = true;
				active.delete(lifetime);
				lifetime.stopObservation(succeeded, abandoned);
			}
		}
	};
	active.add(lifetime);
	return lifetime;
}
const bindingMutation = {
	schemaChange: false,
	mainSchemaChange: false,
	temporaryTableSchemaChange: false,
	dataChange: false,
	temporaryWriteTables: void 0,
	control: void 0
};
/** Dispose callbacks may refuse close; native custody expires only after SQLite has closed. */
function observeSqliteNativeClose(database, onClose) {
	for (const method of ["close", Symbol.dispose]) {
		if (typeof database[method] !== "function") continue;
		const close = database[method].bind(database);
		database[method] = () => {
			try {
				close();
			} finally {
				if (!database.isOpen) onClose();
			}
		};
	}
}
function callStatement(method, bindings) {
	return Reflect.apply(method, void 0, bindings);
}
/** Native callbacks can mutate from any SQL, including SELECT and retained prepared statements. */
function observeSqliteNativeOperations(database, native, observe) {
	const begin = (mutation, phase) => {
		const observed = observe(mutation, phase);
		pending.set(database, (pending.get(database) ?? 0) + 1);
		return {
			...observed,
			finish(succeeded, abandoned) {
				try {
					observed.finish(succeeded, abandoned);
				} finally {
					const remaining = (pending.get(database) ?? 1) - 1;
					if (remaining === 0) pending.delete(database);
					else pending.set(database, remaining);
				}
			}
		};
	};
	const activeIterators = /* @__PURE__ */ new Set();
	const execute = (operation, mutation, phase = "execute") => {
		const observed = begin(mutation, phase);
		let succeeded = false;
		try {
			const result = operation();
			if (phase !== "bind") observed.stepped?.();
			succeeded = true;
			return result;
		} finally {
			observed.finish(succeeded);
		}
	};
	database.exec = (sql) => execute(() => native.DatabaseSync.prototype.exec.call(database, sql), classifySqliteMutation(sql, "batch"), "exec");
	database.prepare = (...prepareArgs) => {
		const statement = native.DatabaseSync.prototype.prepare.call(database, ...prepareArgs);
		const mutation = classifySqliteMutation(prepareArgs[0], "statement");
		const run = Object.hasOwn(statement, "run") ? statement.run.bind(statement) : void 0;
		const get = Object.hasOwn(statement, "get") ? statement.get.bind(statement) : void 0;
		const all = Object.hasOwn(statement, "all") ? statement.all.bind(statement) : void 0;
		const iterate = Object.hasOwn(statement, "iterate") ? statement.iterate.bind(statement) : void 0;
		const active = /* @__PURE__ */ new Set();
		let registered = false;
		const reset = (operation, kind = "reuse") => {
			if (active.size === 0) return operation();
			const previous = [...active];
			const result = operation();
			for (const lifetime of previous) if (kind === "return") lifetime.pause();
			else lifetime.invalidate();
			return result;
		};
		const wrap = (resolve) => (...bindings) => execute(() => reset(() => callStatement(resolve(), bindings)), mutation);
		statement.run = wrap(() => run ?? native.StatementSync.prototype.run.bind(statement));
		statement.get = wrap(() => get ?? native.StatementSync.prototype.get.bind(statement));
		statement.all = wrap(() => all ?? native.StatementSync.prototype.all.bind(statement));
		statement.iterate = (...bindings) => {
			if (!registered) {
				iteratorFinalizer.register(statement, active);
				registered = true;
			}
			const rows = execute(() => reset(() => callStatement(iterate ?? native.StatementSync.prototype.iterate.bind(statement), bindings)), bindingMutation, "bind");
			const reference = new WeakRef(rows);
			let done = false;
			const lifetime = createIteratorLifetime(active, activeIterators);
			const nativeNext = rows.next;
			const nativeReturn = rows.return;
			rows.next = function(...args) {
				if (this !== reference.deref() || lifetime.invalidated || done || !database.isOpen) return nativeNext.apply(this, args);
				if (lifetime.finished) {
					lifetime.finished = false;
					active.add(lifetime);
				}
				lifetime.observed ??= begin(mutation, "iterate");
				activeIterators.add(lifetime);
				const result = nativeNext.apply(this, args);
				if (result.done) {
					done = native.iteratorBehavior.nextAfterDoneIsTerminal;
					if (done) lifetime.finish(true);
					else lifetime.stopObservation(true);
				} else lifetime.observed?.stepped?.();
				return result;
			};
			if (nativeReturn) rows.return = function(...args) {
				if (this !== reference.deref() || done && native.iteratorBehavior.returnAfterDoneIsInert || !database.isOpen) return nativeReturn.apply(this, args);
				const result = execute(() => lifetime.finished || lifetime.invalidated ? nativeReturn.apply(this, args) : reset(() => nativeReturn.apply(this, args), "return"), bindingMutation, "bind");
				done = result.done === true;
				lifetime.finish();
				return result;
			};
			return rows;
		};
		for (const method of ["close", Symbol.dispose]) {
			const close = statement[method]?.bind(statement);
			if (close) statement[method] = () => reset(close, "finalize");
		}
		return statement;
	};
	observeSqliteNativeClose(database, () => {
		for (const lifetime of activeIterators) lifetime.invalidate();
	});
	return execute;
}
//#endregion
//#region src/infra/sqlite-pinned-read-snapshot.ts
const snapshots = resolveGlobalSingleton(Symbol.for("openclaw.sqlitePinnedReadSnapshots"), () => /* @__PURE__ */ new WeakMap());
function getSqlitePinnedReadSnapshot(db) {
	return snapshots.get(db);
}
/** First schema admission consumes the same cookie that pins its catalog capture. */
function runSqliteSchemaReadSnapshotSync(db, operation) {
	const parent = snapshots.get(db);
	snapshots.set(db, parent ?? {});
	try {
		return executeWithCachedStatement(db, "PRAGMA schema_version", [], (statement) => {
			const snapshot = statement.iterate();
			try {
				const first = snapshot.next();
				if (first.done) throw new Error("SQLite schema_version query returned no row");
				return operation(Number(first.value.schema_version));
			} finally {
				snapshot.return?.();
			}
		});
	} finally {
		if (!parent) snapshots.delete(db);
	}
}
//#endregion
//#region src/infra/sqlite-schema-admission.ts
const schemaAdmission = {
	name: "sqlite-schema",
	schemaDependent: true,
	read: (value) => {
		return isRecord(value) ? value : void 0;
	}
};
const textEncodingAdmission = {
	name: "sqlite-text-encoding",
	read: (value) => typeof value === "string" ? value : void 0
};
/** Native metadata read shared by admission and pre-admission migrations. */
function readSqliteTextEncoding(database) {
	const retained = getSqliteDatabaseAdmission(database, textEncodingAdmission);
	if (retained !== void 0) return retained;
	const encoding = executeWithCachedStatement(database, "PRAGMA encoding", [], (s) => s.get());
	if (typeof encoding?.encoding !== "string") throw new Error("SQLite did not report its text encoding");
	return encoding.encoding;
}
/** Capture the physical catalog for admission or pre-admission schema maintenance. */
function captureSqliteSchemaFacts(database, revision = 0, validateUserVersion) {
	const retainedTextEncoding = getSqliteDatabaseAdmission(database, textEncodingAdmission);
	const captured = runSqliteSchemaReadSnapshotSync(database, (schemaVersion) => {
		const version = executeWithCachedStatement(database, "PRAGMA user_version", [], (s) => s.get());
		const userVersion = Number(version?.user_version ?? 0);
		validateUserVersion?.(userVersion);
		const textEncoding = retainedTextEncoding ?? readSqliteTextEncoding(database);
		const objects = executeWithCachedStatement(database, "SELECT type, name, tbl_name, sql FROM main.sqlite_schema WHERE type IN ('table', 'view', 'index', 'trigger')", [], (s) => s.all());
		const facts = {
			admissionId: randomUUID(),
			revision,
			userVersion,
			textEncoding,
			schemaVersion,
			tables: /* @__PURE__ */ new Set(),
			views: /* @__PURE__ */ new Set(),
			tableSql: /* @__PURE__ */ new Map(),
			indexes: /* @__PURE__ */ new Set(),
			indexDefinitions: /* @__PURE__ */ new Map(),
			triggers: /* @__PURE__ */ new Map()
		};
		for (const row of objects) {
			if (typeof row.name !== "string") continue;
			const sql = typeof row.sql === "string" ? row.sql : null;
			switch (row.type) {
				case "table":
					facts.tables.add(row.name);
					facts.tableSql.set(row.name, sql);
					break;
				case "view":
					facts.views.add(row.name);
					break;
				case "index":
					facts.indexes.add(row.name);
					if (typeof row.tbl_name === "string") facts.indexDefinitions.set(row.name, {
						table: row.tbl_name,
						sql
					});
					break;
				case "trigger": if (typeof row.tbl_name === "string") facts.triggers.set(row.name, {
					table: row.tbl_name,
					sql
				});
			}
		}
		return facts;
	});
	if (retainedTextEncoding === void 0 && (captured.tables.size > 0 || captured.views.size > 0)) publishSqliteDatabaseAdmission(database, textEncodingAdmission, captured.textEncoding);
	return captured;
}
function captureTrackedSqliteSchemaFacts(database, owner, validateUserVersion) {
	owner.capturing = true;
	try {
		return captureSqliteSchemaFacts(database, owner.revision, validateUserVersion);
	} finally {
		owner.capturing = false;
	}
}
function invalidateTrackedSqliteSchemaFacts(owner) {
	owner.revision += 1;
	owner.facts = void 0;
}
//#endregion
//#region src/infra/sqlite-schema-lifetime.ts
function observeSchemaLifetime(database, owner, snapshot) {
	if (owner.snapshot && owner.snapshot !== snapshot) {
		if (!database.isTransaction || !owner.transactionCatalogBound) invalidateTrackedSqliteSchemaFacts(owner);
		owner.snapshot = void 0;
		owner.qualifiedSnapshot = void 0;
	}
	const processRevision = getSqliteDatabaseSchemaRevision(database);
	const scopeChanged = owner.processRevision !== void 0 && owner.processRevision !== processRevision;
	if (scopeChanged && !owner.transactionalSchema && (database.isTransaction && owner.transactionCatalogBound || owner.facts && snapshot && owner.qualifiedSnapshot === snapshot)) {
		owner.transactionalFacts ||= database.isTransaction;
		owner.snapshot = snapshot;
		return false;
	}
	owner.processRevision = processRevision;
	if (scopeChanged) invalidateTrackedSqliteSchemaFacts(owner);
	if ((owner.transactionalSchema || owner.transactionalTempSchema || owner.transactionalFacts) && !database.isTransaction) {
		if (owner.transactionalSchema) publishSqliteDatabaseSchemaChange(database);
		invalidateTrackedSqliteSchemaFacts(owner);
		owner.transactionalSchema = false;
		owner.transactionalTempSchema = false;
		owner.transactionalFacts = false;
	}
	return scopeChanged;
}
//#endregion
//#region src/infra/sqlite-schema-scope.ts
function observeSqliteTransactionState(database, owner) {
	const inTransaction = database.isTransaction;
	if (owner.transactionOpen !== inTransaction) {
		if (owner.transactionOpen) owner.mutationRevision += 1;
		owner.transactionOpen = inTransaction;
		owner.transactionMutationRevision = void 0;
		owner.transactionSnapshot = void 0;
		owner.transactionRead = false;
		owner.transactionCatalogBound = false;
	}
}
function finishSqliteReadScope(database, owner, wasTransaction, expiresRead, succeeded, openingMutationRevision) {
	const inTransaction = database.isTransaction;
	if (!succeeded && wasTransaction && !inTransaction) owner.mutationRevision += 1;
	owner.transactionOpen = inTransaction;
	if (!wasTransaction || !inTransaction) owner.transactionMutationRevision = inTransaction ? openingMutationRevision : void 0;
	if (wasTransaction !== inTransaction || expiresRead) {
		owner.transactionSnapshot = void 0;
		owner.transactionRead = false;
		owner.transactionCatalogBound = false;
	}
}
//#endregion
//#region src/infra/sqlite-temp-generation-schema.ts
function prepareSqliteTempTrackingSchema(database, schema) {
	const { createSql, objects } = prepareTranscriptIndexSchema(schema);
	const definitions = new Map(objects.map((object) => [object.name.toLowerCase(), object]));
	const names = objects.map((object) => object.name);
	const tableNames = objects.filter((object) => object.type === "table").map((object) => object.name);
	const parameters = [...names, ...tableNames];
	const existing = executeWithCachedStatement(database, `SELECT type, name, tbl_name, sql FROM temp.sqlite_schema
     WHERE name COLLATE NOCASE IN (${names.map(() => "?").join(",")})
       OR (type = 'trigger' AND tbl_name COLLATE NOCASE IN (${tableNames.map(() => "?").join(",")}))`, parameters, (statement) => statement.all(...parameters));
	const unexpected = existing.some((row) => {
		const declared = typeof row.name === "string" ? definitions.get(row.name.toLowerCase()) : void 0;
		return !declared || row.type !== declared.type || row.tbl_name !== declared.table || typeof row.sql !== "string" || normalizeSchemaSql(row.sql) !== normalizeSchemaSql(declared.sql);
	});
	return {
		sql: createSql(new Set(existing.flatMap((row) => row.type === "trigger" && typeof row.name === "string" ? [row.name.toLowerCase()] : []))),
		unexpected
	};
}
function prepareTranscriptIndexSchema(schema) {
	const status = quoteSqliteIdentifier(schema.statusTable);
	const pending = quoteSqliteIdentifier(schema.pendingTable);
	const index = quoteSqliteIdentifier(schema.pendingIndex);
	const statusTable = `${status} (
    id INTEGER PRIMARY KEY CHECK (id = 1), sibling_write_revision INTEGER NOT NULL,
    schema_version INTEGER NOT NULL, complete INTEGER NOT NULL, after_session TEXT,
    completed_traversals INTEGER NOT NULL
  ) STRICT`;
	const pendingTable = `${pending} (session_id TEXT PRIMARY KEY, state INTEGER NOT NULL) STRICT`;
	const pendingIndex = `${index} ON ${pending}(state, session_id)`;
	const triggers = schema.observedTables.flatMap((table) => [
		"INSERT",
		"UPDATE",
		"DELETE"
	].map((operation) => {
		const name = `openclaw_${table}_projection_${operation.toLowerCase()}`;
		const sources = operation === "UPDATE" ? ["OLD", "NEW"] : [operation === "DELETE" ? "OLD" : "NEW"];
		return {
			name,
			table,
			definition: `TRIGGER ${quoteSqliteIdentifier(name)} AFTER ${operation} ON main.${quoteSqliteIdentifier(table)}
          WHEN ${sources.map((source) => `NOT EXISTS (
                SELECT 1 FROM ${pending}
                WHERE session_id = ${source}.session_id AND state = 0
              )`).join(" OR ")} BEGIN
            ${sources.map((source) => `
                  UPDATE ${pending} SET state = 0 WHERE session_id = ${source}.session_id;
                  INSERT INTO ${pending}
                    SELECT ${source}.session_id, 0 WHERE NOT EXISTS (
                      SELECT 1 FROM ${pending} WHERE session_id = ${source}.session_id
                    );`).join("\n")}
          END`
		};
	}));
	const createSql = (existingTriggers) => `
    CREATE TEMP TABLE IF NOT EXISTS ${statusTable};
    INSERT OR IGNORE INTO temp.${status} VALUES (1, -1, -1, 0, NULL, 0);
    UPDATE temp.${status} SET sibling_write_revision = -1;
    CREATE TEMP TABLE IF NOT EXISTS ${pendingTable};
    CREATE INDEX IF NOT EXISTS temp.${pendingIndex};
    ${triggers.map(({ name, definition }) => {
		return `${existingTriggers.has(name.toLowerCase()) ? `DROP TRIGGER IF EXISTS temp.${quoteSqliteIdentifier(name)};` : ""}CREATE TEMP ${definition};`;
	}).join("\n")}
  `;
	return {
		createSql,
		objects: [
			{
				name: schema.statusTable,
				type: "table",
				table: schema.statusTable,
				sql: `CREATE TABLE ${statusTable}`
			},
			{
				name: schema.pendingTable,
				type: "table",
				table: schema.pendingTable,
				sql: `CREATE TABLE ${pendingTable}`
			},
			{
				name: schema.pendingIndex,
				type: "index",
				table: schema.pendingTable,
				sql: `CREATE INDEX ${pendingIndex}`
			},
			...triggers.map((trigger) => ({
				name: trigger.name,
				type: "trigger",
				table: trigger.table,
				sql: `CREATE ${trigger.definition}`
			}))
		]
	};
}
//#endregion
//#region src/infra/sqlite-schema-facts.ts
const owners$1 = resolveGlobalSingleton(Symbol.for("openclaw.sqliteSchemaFacts"), () => /* @__PURE__ */ new WeakMap());
/** Schema publications outside DDL (such as a deferred version marker) share this revision. */
function invalidateSqliteSchemaFacts(database) {
	invalidateSchemaFacts(database, true);
}
function invalidateSchemaFacts(database, publish, change = "main", notify = change !== "temp") {
	const owner = owners$1.get(database);
	if (owner) {
		const changesMain = change === "main";
		owner.isolatedTempTables.clear();
		if (database.isTransaction) owner.transactionMutationRevision = void 0;
		if (changesMain) invalidateLocalSqliteSchemaAdmissions(database);
		if (changesMain && database.isTransaction && !owner.transactionalSchema) owner.transactionBaseFacts = owner.facts;
		if (notify) for (const listener of owner.mutationListeners ?? []) listener(void 0);
		invalidateTrackedSqliteSchemaFacts(owner);
		owner.transactionalSchema ||= changesMain && database.isTransaction;
		owner.transactionalTempSchema ||= change === "temp" && database.isTransaction;
		owner.pendingSchema ||= changesMain && owner.nativeDepth > 0;
		if (publish && changesMain && !database.isTransaction && owner.nativeDepth === 0) publishSqliteDatabaseSchemaChange(database);
	}
}
function trackSchemaChanges(database, owner, native, writable) {
	const settle = (boundary = false, rolledBack = false) => {
		if (rolledBack) {
			const snapshot = getSqlitePinnedReadSnapshot(database);
			const facts = snapshot && (owner.transactionalSchema ? owner.transactionBaseFacts : owner.facts);
			discardSqliteDatabaseTransactionAdmissions(database);
			invalidateTrackedSqliteSchemaFacts(owner);
			owner.transactionalSchema = false;
			owner.transactionalTempSchema = false;
			owner.transactionalFacts = false;
			if (snapshot && owner.admitted && !owner.authorizerActive) {
				owner.facts = facts ? {
					...facts,
					revision: owner.revision
				} : captureTrackedSqliteSchemaFacts(database, owner);
				owner.snapshot = snapshot;
				owner.qualifiedSnapshot = snapshot;
			}
			owner.transactionBaseFacts = void 0;
			return;
		}
		if ((boundary || !database.isTransaction) && (owner.transactionalSchema || owner.transactionalTempSchema || owner.transactionalFacts)) {
			if (owner.transactionalSchema) publishSqliteDatabaseSchemaChange(database);
			invalidateTrackedSqliteSchemaFacts(owner);
			owner.transactionalSchema &&= database.isTransaction;
			owner.transactionalTempSchema &&= database.isTransaction;
			owner.transactionalFacts = false;
		}
	};
	const execute = observeSqliteNativeOperations(database, native, (mutation, phase) => {
		if (owner.settling) return { finish: () => {} };
		const { control, dataChange } = mutation;
		const schemaChange = control?.outerRollback === true ? false : mutation.schemaChange;
		const mainSchemaChange = mutation.mainSchemaChange && control?.outerRollback !== true;
		observeSqliteTransactionState(database, owner);
		const snapshot = phase === "bind" ? void 0 : getSqlitePinnedReadSnapshot(database);
		const iterator = phase !== "bind" && !snapshot && !owner.capturing ? {} : void 0;
		if (snapshot && snapshot !== owner.snapshot && !owner.capturing) {
			if (database.isTransaction && (owner.transactionRead || owner.transactionCatalogBound) && owner.processRevision !== getSqliteDatabaseSchemaRevision(database)) {
				if (!owner.transactionCatalogBound) invalidateTrackedSqliteSchemaFacts(owner);
				owner.transactionalFacts = true;
			} else {
				observeSchemaLifetime(database, owner, void 0);
				if (!owner.facts && !owner.transactionalSchema) {
					const retained = getSqliteDatabaseAdmission(database, schemaAdmission);
					if (retained) owner.facts = {
						...retained,
						revision: owner.revision
					};
				}
			}
			owner.snapshot = snapshot;
			owner.qualifiedSnapshot = snapshot;
		}
		if (owner.nativeDepth === 0) settle();
		const wasTransaction = database.isTransaction;
		if (writable && !wasTransaction && (control?.kind === "BEGIN" || control?.kind === "SAVEPOINT")) getSqliteDatabaseSchemaRevision(database);
		const openingMutationRevision = !wasTransaction && control?.kind === "BEGIN" && control.single ? owner.mutationRevision : void 0;
		if (!wasTransaction && control?.kind === "BEGIN" && owner.admitted) getAdmittedSqliteSchemaFacts(database);
		const expiresRead = Boolean(control) && !canPreserveTransactionSnapshot(control, wasTransaction);
		const rollback = control?.kind === "ROLLBACK";
		const rollsBackSchema = rollback && owner.transactionalSchema && !control.outerRollback;
		const notifySchema = schemaChange && !mutation.temporaryTableSchemaChange || rollback && owner.transactionalSchema;
		const schemaInvalidation = mainSchemaChange || rollsBackSchema ? "main" : rollback ? owner.transactionalTempSchema && !owner.transactionalSchema ? "temp" : "rollback" : mutation.temporaryTableSchemaChange ? "temp" : "local";
		if (rollback) discardSqliteDatabaseTransactionAdmissions(database);
		if (schemaChange || rollback) invalidateSchemaFacts(database, false, schemaInvalidation, notifySchema);
		if (dataChange || mutation.temporaryTableSchemaChange || control?.kind === "ROLLBACK") owner.mutationRevision += 1;
		if (phase !== "bind" && wasTransaction && !control && owner.readDepth === 0 && !owner.transactionCatalogBound) owner.transactionRead = true;
		const changesReadScope = schemaChange || dataChange || control !== void 0;
		const temporaryWrite = mutation.temporaryWriteTables?.every((table) => owner.isolatedTempTables.has(table));
		if (dataChange && !temporaryWrite || mainSchemaChange) beginSqliteDatabaseWrite(database, mainSchemaChange || owner.nativeDepth > 0);
		if (changesReadScope) owner.mutationDepth += 1;
		owner.nativeDepth += 1;
		const finishAdmissions = beginSqliteDatabaseAdmissionOperation(database);
		const pendingBefore = owner.schemaMutationRevision;
		if (mainSchemaChange) owner.schemaMutationRevision += 1;
		owner.pendingSchema ||= mainSchemaChange;
		if (iterator) owner.unmanagedSnapshots.add(iterator);
		return {
			stepped: () => {
				if (database.isTransaction && !control && !owner.transactionRead && !owner.transactionCatalogBound && owner.facts && owner.processRevision === getSqliteDatabaseSchemaRevision(database)) owner.transactionCatalogBound = true;
			},
			finish: (succeeded, abandoned) => {
				if (iterator && owner.unmanagedSnapshots.delete(iterator) && owner.iteratorFacts) {
					invalidateTrackedSqliteSchemaFacts(owner);
					owner.iteratorFacts = false;
				}
				finishAdmissions();
				owner.nativeDepth -= 1;
				if (changesReadScope) owner.mutationDepth -= 1;
				if (!database.isOpen) return;
				if (schemaChange || rollback) {
					if (rollback) discardSqliteDatabaseTransactionAdmissions(database);
					invalidateSchemaFacts(database, false, schemaInvalidation, notifySchema);
				}
				const rolledBack = succeeded && wasTransaction && control?.outerRollback === true && !database.isTransaction && !mainSchemaChange && owner.schemaMutationRevision === pendingBefore;
				if (rolledBack) {
					settle(false, true);
					owner.pendingSchema = false;
				}
				if (owner.nativeDepth === 0) {
					owner.settling = true;
					try {
						const changedSchema = owner.pendingSchema || owner.transactionalSchema;
						if (!rolledBack && owner.pendingSchema && !database.isTransaction && !owner.transactionalSchema) publishSqliteDatabaseSchemaChange(database);
						if (!rolledBack) settle(expiresRead);
						if (changedSchema && !database.isTransaction && !rolledBack) {
							invalidateTrackedSqliteSchemaFacts(owner);
							if (!succeeded) discardSqliteDatabaseTransactionAdmissions(database);
							if (owner.admitted && !owner.authorizerActive && !abandoned) {
								getAdmittedSqliteSchemaFacts(database);
								owner.transactionBaseFacts = void 0;
							}
						}
						owner.pendingSchema = false;
					} finally {
						owner.settling = false;
					}
				}
				finishSqliteReadScope(database, owner, wasTransaction, expiresRead, succeeded, openingMutationRevision);
				if (owner.mutationDepth === 0 && !database.isTransaction) finishSqliteDatabaseWrite(database);
				owner.transactionRead ||= database.isTransaction && Boolean(control && !control.single);
			}
		};
	});
	observeSqliteNativeClose(database, () => {
		finishSqliteDatabaseWrite(database);
		releaseSqliteDatabaseAdmission(database);
	});
	owner.installTempTrackingSchema = (schema) => {
		const { sql, unexpected } = prepareSqliteTempTrackingSchema(database, schema);
		try {
			execute(() => native.DatabaseSync.prototype.exec.call(database, sql), {
				schemaChange: unexpected,
				mainSchemaChange: unexpected,
				temporaryTableSchemaChange: false,
				dataChange: true,
				temporaryWriteTables: [],
				control: void 0
			});
			if (!unexpected) for (const table of [schema.statusTable, schema.pendingTable]) owner.isolatedTempTables.add(table.toLowerCase());
		} catch (error) {
			invalidateSqliteSchemaFacts(database);
			throw error;
		}
	};
	if (typeof database.setAuthorizer === "function") database.setAuthorizer = (callback) => {
		native.DatabaseSync.prototype.setAuthorizer.call(database, callback);
		owner.authorizerActive = callback !== null;
		suspendSqliteDatabaseAdmission(database, owner.authorizerActive);
		invalidateTrackedSqliteSchemaFacts(owner);
	};
	registerNodeSqliteDisposeCallback(database, () => {
		invalidateTrackedSqliteSchemaFacts(owner);
		owner.readRevision = void 0;
		owner.transactionSnapshot = void 0;
	});
}
/** Reuse row facts only inside an admitted synchronous operation. */
function runSqliteReadOperationSync(database, operation) {
	if (isPostgresSqlConnection(database)) return operation();
	const owner = owners$1.get(database);
	if (!owner || owner.authorizerActive) return operation();
	owner.readDepth += 1;
	try {
		if (owner.admitted) getAdmittedSqliteSchemaFacts(database);
		return operation();
	} finally {
		owner.readDepth -= 1;
	}
}
/** Install at native open, before callers can retain statements or install an authorizer. */
function trackSqliteSchema(database, native, writable = true) {
	if (!owners$1.has(database)) {
		const owner = {
			admitted: false,
			revision: 0,
			readDepth: 0,
			mutationRevision: 0,
			mutationDepth: 0,
			transactionOpen: database.isOpen && database.isTransaction,
			transactionRead: false,
			transactionCatalogBound: false,
			nativeDepth: 0,
			pendingSchema: false,
			schemaMutationRevision: 0,
			settling: false,
			capturing: false,
			transactionalSchema: false,
			transactionalTempSchema: false,
			transactionalFacts: false,
			authorizerActive: false,
			unmanagedSnapshots: /* @__PURE__ */ new Set(),
			isolatedTempTables: /* @__PURE__ */ new Set(),
			iteratorFacts: false
		};
		owners$1.set(database, owner);
		trackSchemaChanges(database, owner, native, writable);
		const retained = getSqliteDatabaseAdmission(database, schemaAdmission, { existingOnly: true });
		if (retained) {
			owner.admitted = true;
			owner.facts = {
				...retained,
				revision: owner.revision
			};
			owner.processRevision = getSqliteDatabaseSchemaRevision(database);
		}
	}
}
/** Admission retains schema facts; its header validator must stay synchronous and read-free. */
function admitSqliteSchema(database, validateUserVersion) {
	const owner = owners$1.get(database);
	if (!owner) throw new Error("SQLite schema admission requires a connection tracked from native open");
	owner.admitted = true;
	getAdmittedSqliteSchemaFacts(database, validateUserVersion);
}
/** Consume the physical database's admitted facts and owner-published schema changes. */
function getAdmittedSqliteSchemaFacts(database, validateUserVersion) {
	if (isPostgresSqlConnection(database)) return;
	const owner = owners$1.get(database);
	if (!owner?.admitted || owner.authorizerActive) return;
	const snapshot = getSqlitePinnedReadSnapshot(database);
	const unknownSnapshot = database.isTransaction && (owner.transactionRead || owner.transactionCatalogBound) && owner.processRevision !== getSqliteDatabaseSchemaRevision(database) || owner.unmanagedSnapshots.size > 0;
	const scopeChanged = observeSchemaLifetime(database, owner, snapshot);
	if (!owner.facts) {
		owner.snapshot = snapshot;
		owner.transactionalFacts ||= database.isTransaction && (owner.readDepth === 0 || scopeChanged);
		const localSnapshot = unknownSnapshot || Boolean(snapshot) || owner.transactionalSchema;
		const retained = owner.transactionalSchema || localSnapshot ? void 0 : getSqliteDatabaseAdmission(database, schemaAdmission);
		if (retained) {
			validateUserVersion?.(retained.userVersion);
			owner.facts = {
				...retained,
				revision: owner.revision
			};
			return owner.facts;
		}
		const schemaRevision = getSqliteDatabaseSchemaRevision(database);
		owner.facts = captureTrackedSqliteSchemaFacts(database, owner, validateUserVersion);
		owner.iteratorFacts ||= owner.unmanagedSnapshots.size > 0;
		owner.qualifiedSnapshot = snapshot;
		owner.transactionCatalogBound ||= database.isTransaction;
		if (!localSnapshot) publishSqliteDatabaseAdmission(database, schemaAdmission, owner.facts, { schemaRevision });
	} else validateUserVersion?.(owner.facts.userVersion);
	return owner.facts;
}
//#endregion
//#region src/infra/warning-filter.ts
const warningFilterKey = Symbol.for("openclaw.warning-filter");
function shouldIgnoreWarning(warning) {
	return Boolean(warning.code === "DEP0040" && warning.message?.includes("punycode") || warning.code === "DEP0060" && warning.message?.includes("util._extend") || warning.name === "ExperimentalWarning" && warning.message?.includes("SQLite is an experimental feature"));
}
function normalizeWarningArgs(args) {
	const warningArg = args[0];
	const secondArg = args[1];
	const thirdArg = args[2];
	let name;
	let code;
	let message;
	if (warningArg instanceof Error) {
		name = warningArg.name;
		message = warningArg.message;
		code = warningArg.code;
	} else if (typeof warningArg === "string") message = warningArg;
	if (secondArg && typeof secondArg === "object" && !Array.isArray(secondArg)) {
		const options = secondArg;
		if (typeof options.type === "string") name = options.type;
		if (typeof options.code === "string") code = options.code;
	} else {
		if (typeof secondArg === "string") name = secondArg;
		if (typeof thirdArg === "string") code = thirdArg;
	}
	return {
		name,
		code,
		message
	};
}
/** Installs the global process warning filter once for the current JS realm. */
function installProcessWarningFilter() {
	const state = resolveGlobalSingleton(warningFilterKey, () => ({ installed: false }));
	if (state.installed) return;
	const originalEmitWarning = process.emitWarning.bind(process);
	const wrappedEmitWarning = ((...args) => {
		if (shouldIgnoreWarning(normalizeWarningArgs(args))) return;
		if (args[0] instanceof Error && args[1] && typeof args[1] === "object" && !Array.isArray(args[1])) {
			const warning = args[0];
			const emitted = Object.assign(new Error(warning.message), {
				name: warning.name,
				code: warning.code
			});
			process.emit("warning", emitted);
			return;
		}
		Reflect.apply(originalEmitWarning, process, args);
	});
	process.emitWarning = wrappedEmitWarning;
	state.installed = true;
}
//#endregion
//#region src/infra/node-sqlite.ts
const require = createRequire(import.meta.url);
let validatedSqliteModule;
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
		compareValidSemver(inherited.version, "3.45.0");
		inherited.extensionLoadingSupported;
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
	compareValidSemver(version, "3.45.0");
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
//#region src/infra/sqlite-error-diagnostics.ts
const inspectionOperations = resolveGlobalSingleton(Symbol.for("openclaw.sqliteInspectionOperations"), () => /* @__PURE__ */ new WeakMap());
const nativeOpenFailures = resolveGlobalSingleton(Symbol.for("openclaw.sqliteNativeOpenFailures"), () => /* @__PURE__ */ new WeakSet());
function markSqliteNativeOpenFailure(error) {
	if (error !== null && typeof error === "object") nativeOpenFailures.add(error);
}
/** Record the native effect without changing its error or tagging surrounding authority checks. */
function withSqliteNativeOpen(open) {
	try {
		return open();
	} catch (error) {
		markSqliteNativeOpenFailure(error);
		throw error;
	}
}
function markSqliteInspectionOperation(error, operation) {
	if (error !== null && typeof error === "object" && !inspectionOperations.has(error)) inspectionOperations.set(error, operation);
	return error;
}
const SQLITE_LOCK_ERROR_CODES = /* @__PURE__ */ new Set(["SQLITE_BUSY", "SQLITE_LOCKED"]);
const SQLITE_BUSY_RESULT_CODE = 5;
const SQLITE_LOCKED_RESULT_CODE = 6;
const SQLITE_CORRUPT_RESULT_CODE = 11;
const SQLITE_NOTADB_RESULT_CODE = 26;
const SQLITE_PRIMARY_RESULT_CODE_MASK = 255;
function sqliteErrorCode(error) {
	const code = asOptionalObjectRecord(error)?.code;
	return typeof code === "string" ? code : void 0;
}
function sqliteExtendedResultCode(error) {
	const errcode = asOptionalObjectRecord(error)?.errcode;
	return typeof errcode === "number" && Number.isInteger(errcode) ? errcode : void 0;
}
function sqlitePrimaryResultCode(error) {
	const errcode = sqliteExtendedResultCode(error);
	return errcode === void 0 ? void 0 : errcode & SQLITE_PRIMARY_RESULT_CODE_MASK;
}
function isSqliteLockError(error) {
	const code = sqliteErrorCode(error);
	if (code !== void 0 && SQLITE_LOCK_ERROR_CODES.has(code)) return true;
	const primaryCode = sqlitePrimaryResultCode(error);
	return primaryCode === SQLITE_BUSY_RESULT_CODE || primaryCode === SQLITE_LOCKED_RESULT_CODE;
}
/** Report proven file damage (corrupt page or non-database header), not transient failure. */
function isSqliteCorruptionError(error) {
	const primaryCode = sqlitePrimaryResultCode(error);
	return primaryCode === SQLITE_CORRUPT_RESULT_CODE || primaryCode === SQLITE_NOTADB_RESULT_CODE;
}
//#endregion
//#region src/infra/sqlite-staging-token.ts
const SQLITE_STAGING_TOKEN_FILES = [
	"owner.sqlite",
	"owner.sqlite-journal",
	"owner.sqlite-wal",
	"owner.sqlite-shm"
];
var SqliteStagingRetiredError = class extends Error {
	constructor() {
		super("SQLite snapshot parent retired; aborting snapshot allocation");
	}
};
/** Native transactions fence private staging admission and committed retirement. */
function acquireSqliteStagingToken(directory, mode, options = {}) {
	const location = path.join(directory, SQLITE_STAGING_TOKEN_FILES[0]);
	const readIdentity = (pathname, kind) => {
		const stat = fs$1.lstatSync(pathname, { bigint: true });
		if (!(kind === "directory" ? stat.isDirectory() : stat.isFile()) || process.platform === "win32" && (stat.dev === 0n || stat.ino === 0n)) throw new Error("SQLite staging ownership is unknown");
		return stat;
	};
	const directoryIdentity = readIdentity(directory, "directory");
	const family = SQLITE_STAGING_TOKEN_FILES.map((file) => fs$1.lstatSync(path.join(directory, file), { throwIfNoEntry: false }));
	const existing = family[0];
	if (family.some((file) => file && (!file.isFile() || process.getuid && file.uid !== process.getuid())) || !existing && mode !== "create" && !options.allowMissing) throw new Error("SQLite snapshot token ownership is unknown");
	if (mode === "create" && !existing) fs$1.writeFileSync(location, "", {
		flag: "wx",
		mode: 420
	});
	const tokenExists = existing !== void 0 || mode === "create";
	const existingIdentity = tokenExists ? readIdentity(location, "file") : void 0;
	const db = withSqliteNativeOpen(() => openNodeSqliteDatabase(tokenExists ? resolveExistingSqliteFileUri(location) : location));
	let tokenIdentity;
	const kysely = getNodeSqliteKysely(db);
	const execute = (statement) => executeSqliteQueryTakeFirstSync(db, { compile: () => statement.compile(kysely) });
	let exclusive = mode === "reclaim";
	let retired = false;
	const assertIdentity = () => {
		const currentDirectory = readIdentity(directory, "directory");
		if (directoryIdentity.dev !== currentDirectory.dev || directoryIdentity.ino !== currentDirectory.ino) throw new Error("SQLite staging ownership changed before retirement");
		const currentToken = readIdentity(location, "file");
		if (tokenIdentity.dev !== currentToken.dev || tokenIdentity.ino !== currentToken.ino) throw new Error("SQLite staging ownership changed before retirement");
	};
	const readVersion = () => {
		const row = execute(sql`PRAGMA user_version`);
		return isRecord(row) ? row.user_version : void 0;
	};
	const beginRetirement = () => {
		assertIdentity();
		if (!db.isTransaction || !exclusive) {
			if (db.isTransaction) execute(sql`ROLLBACK`);
			execute(sql`BEGIN EXCLUSIVE`);
			exclusive = true;
		}
		return token;
	};
	const release = (retiring = false) => {
		if (!db.isOpen) return;
		if (retiring) {
			beginRetirement();
			if (!retired) execute(sql`PRAGMA user_version=1`);
			execute(sql`COMMIT`);
			retired = true;
		} else if (db.isTransaction) execute(sql`ROLLBACK`);
		db.close();
		if (retiring) retireSqliteDatabaseAdmissionForPath(location);
	};
	const token = Object.assign(release, { beginRetirement });
	try {
		tokenIdentity = existingIdentity ?? readIdentity(location, "file");
		execute(sql`PRAGMA busy_timeout=0`);
		if (mode === "create") execute(sql`BEGIN IMMEDIATE`);
		else if (mode === "reclaim") execute(sql`BEGIN EXCLUSIVE`);
		else {
			execute(sql`BEGIN`);
			execute(sql`SELECT rootpage FROM sqlite_schema LIMIT 1`);
		}
		const journalMode = execute(sql`PRAGMA journal_mode`);
		if (!isRecord(journalMode) || journalMode.journal_mode !== "delete") throw new Error("SQLite snapshot token journal mode is unknown");
		const version = readVersion();
		if (version !== 0 && (mode !== "reclaim" || version !== 1)) throw new SqliteStagingRetiredError();
		retired = version === 1;
		assertIdentity();
		return token;
	} catch (error) {
		release();
		throw error;
	}
}
//#endregion
//#region src/infra/sqlite-snapshot-retirement.ts
const SQLITE_SNAPSHOT_PREFIX = "openclaw-sqlite-readonly-v2-";
const suffix = "(?:[A-Za-z0-9]{6}|[\\da-f]{8}-[\\da-f]{4}-[\\da-f]{4}-[\\da-f]{4}-[\\da-f]{12})$";
const SQLITE_SNAPSHOT_LEGACY_MARKER = new RegExp(`^openclaw-sqlite-readonly-[1-9]\\d*-${suffix}`, "u");
const tokenMarker = new RegExp(`^${SQLITE_SNAPSHOT_PREFIX}${suffix}`, "u");
const SQLITE_SNAPSHOT_LEGACY_AGE_MS = 864e5;
function releaseTokens(tokens) {
	const failures = [];
	for (const token of tokens) try {
		token();
	} catch (error) {
		failures.push(error);
	}
	if (failures.length) throw new AggregateError(failures, "SQLite snapshot retirement token release failed");
}
const isSqliteSnapshotStagingName = (name) => SQLITE_SNAPSHOT_LEGACY_MARKER.test(name) || tokenMarker.test(name);
function acquireSqliteSnapshotToken(directory, mode) {
	return acquireSqliteStagingToken(directory, mode, { allowMissing: SQLITE_SNAPSHOT_LEGACY_MARKER.test(path.basename(directory)) });
}
/** Hold every nested lifetime before selecting payload; a parent lock alone cannot fence children. */
function beginSqliteSnapshotRetirement(directory, options = {}) {
	const tokens = [];
	const payload = [];
	const release = () => releaseTokens(tokens.filter((token) => token !== options.token));
	if (!fs$1.existsSync(directory)) {
		options.token?.();
		return {
			bytes: 0,
			payload,
			release,
			retire: () => {}
		};
	}
	function inspect(current, inheritedCutoff, layout = "", lock = true) {
		const stat = fs$1.lstatSync(current);
		if (!stat.isDirectory() || process.getuid && stat.uid !== process.getuid()) throw new Error("Snapshot directory ownership is unknown");
		const legacy = !layout && SQLITE_SNAPSHOT_LEGACY_MARKER.test(path.basename(current));
		const cutoff = options.cutoff !== void 0 && legacy ? Math.min(inheritedCutoff, Date.now() - SQLITE_SNAPSHOT_LEGACY_AGE_MS) : inheritedCutoff;
		if (legacy && lock && options.cutoff !== void 0) inspect(current, cutoff, layout, false);
		if (!layout && lock) tokens.push(current === directory && options.token ? options.token.beginRetirement() : acquireSqliteSnapshotToken(current, "reclaim"));
		let bytes = 0;
		let newest = stat.mtimeMs;
		for (const entry of fs$1.readdirSync(current, { withFileTypes: true })) {
			const location = path.join(current, entry.name);
			const item = fs$1.lstatSync(location);
			if (process.getuid && item.uid !== process.getuid()) throw new Error("Snapshot file ownership is unknown");
			if ((!layout || options.cutoff === void 0) && item.isFile() && SQLITE_STAGING_TOKEN_FILES.some((file) => file === entry.name)) continue;
			newest = Math.max(newest, item.mtimeMs);
			if (item.isDirectory()) {
				const nested = isSqliteSnapshotStagingName(entry.name);
				const childLayout = nested ? "" : [layout, entry.name].filter(Boolean).join("/");
				if (options.cutoff !== void 0 && (!nested && ![
					"openclaw",
					"openclaw-state",
					"openclaw-state/state"
				].includes(childLayout) || nested && layout !== "" && layout !== "openclaw")) throw new Error("Unrecognized snapshot directory");
				const child = inspect(location, cutoff, childLayout, lock);
				bytes += child.bytes;
				newest = Math.max(newest, child.newest);
			} else if (options.cutoff === void 0 || item.isFile() && (layout === "openclaw-state/state" ? /^openclaw\.sqlite(?:-wal|-shm|-journal)?$/u.test(entry.name) : !layout && /^(?:first|database\.sqlite(?:\.partial)?(?:-wal|-shm|-journal)?)$/u.test(entry.name))) {
				bytes += item.size;
				if (lock) payload.push(location);
			} else throw new Error("Unrecognized snapshot artifact");
		}
		if (newest >= cutoff) throw new Error(legacy ? "Legacy snapshot contains activity newer than 24 hours" : "Snapshot contains activity within the reclamation grace period");
		return {
			bytes,
			newest
		};
	}
	try {
		const { bytes } = inspect(directory, options.cutoff ?? Number.POSITIVE_INFINITY);
		return {
			bytes,
			payload,
			release,
			retire: () => {
				for (const token of tokens) token(true);
			}
		};
	} catch (error) {
		release();
		throw error;
	}
}
//#endregion
//#region src/infra/sqlite-readonly-location-cleanup.ts
var SqliteSnapshotCleanupError = class extends Error {};
const cleanupState = resolveGlobalSingleton(Symbol.for("openclaw.sqliteSnapshotCleanup"), () => ({
	directories: /* @__PURE__ */ new Map(),
	activeWork: /* @__PURE__ */ new Map(),
	exitHandlerInstalled: false,
	pendingSignalCleanup: void 0,
	signalCleanup: cleanupSnapshotOperations
}));
const snapshotDirectories = cleanupState.directories;
const activeSnapshotWork = cleanupState.activeWork;
function snapshotDirectory(directory) {
	let owner = snapshotDirectories.get(directory);
	if (!owner) {
		owner = { readers: /* @__PURE__ */ new Set() };
		snapshotDirectories.set(directory, owner);
	}
	return owner;
}
function completeSnapshotDirectoryRemoval(directory) {
	snapshotDirectories.delete(directory);
	return true;
}
function cleanupSnapshotOperations() {
	cleanupState.pendingSignalCleanup ??= (async () => {
		const directories = snapshotDirectories.entries();
		while (true) {
			while (activeSnapshotWork.size > 0) {
				for (const stop of activeSnapshotWork.values()) stop();
				await Promise.allSettled(activeSnapshotWork.keys());
			}
			const next = directories.next();
			if (next.done) break;
			const [directory] = next.value;
			await removeTempDirectoryAsync(directory, (error) => emitSnapshotCleanupFailure({
				cleanupRoot: directory,
				operation: "rm",
				code: extractErrorCode(error)
			}));
		}
	})().finally(() => {
		cleanupState.pendingSignalCleanup = void 0;
	});
	return cleanupState.pendingSignalCleanup;
}
/** Join native backup work or a terminated child before removing its private bytes. */
function retainSnapshotWork(work, stop = () => {}) {
	registerSnapshotCleanup();
	activeSnapshotWork.set(work, stop);
	const release = () => activeSnapshotWork.delete(work);
	work.then(release, release);
	return work;
}
function registerSnapshotTempDirectory(directory, release) {
	const owner = snapshotDirectory(directory);
	owner.release = release ?? owner.release;
	registerSnapshotCleanup();
}
function registerSnapshotCleanup() {
	if (!cleanupState.exitHandlerInstalled) {
		cleanupState.exitHandlerInstalled = true;
		process.once("exit", () => {
			for (const stop of activeSnapshotWork.values()) stop();
			if (activeSnapshotWork.size === 0) for (const pendingDir of snapshotDirectories.keys()) removeTempDirectory(pendingDir);
		});
	}
	registerSignalExitFinalizer(cleanupState.signalCleanup);
}
/** Rejection is not retirement: only the reader's successful close releases custody. */
function retainSnapshotTempDirectory(directory) {
	registerSnapshotTempDirectory(directory);
	const owner = snapshotDirectory(directory);
	if (owner.retirementStarted) throw new SqliteSnapshotCleanupError("SQLite snapshot retirement has started");
	const reader = Symbol("sqlite.snapshot.reader");
	owner.readers.add(reader);
	return () => owner.readers.delete(reader);
}
const tempDirectoryRemovalOptions = {
	force: true,
	maxRetries: 3,
	recursive: true,
	retryDelay: 20
};
function emitSnapshotCleanupFailure(report, onCleanupFailure) {
	if (onCleanupFailure) try {
		onCleanupFailure(report);
		return;
	} catch {}
	try {
		getChildLogger({ subsystem: "infra/sqlite-snapshot" }).warn({
			path: report.cleanupRoot,
			operation: report.operation,
			errorCode: report.code
		}, "SQLite read-only snapshot cleanup failed. Check directory permissions and available storage before retrying.");
	} catch {}
}
function assertSnapshotReadersRetired(owner) {
	if (owner?.readers.size) throw new SqliteSnapshotCleanupError("SQLite snapshot still belongs to an active reader");
}
function prepareSnapshotRetirement(directory, owner) {
	assertSnapshotReadersRetired(owner);
	if (owner?.releaseRetained) throw new SqliteSnapshotCleanupError("SQLite snapshot requires asynchronous cleanup");
	if (owner?.retired || !owner?.release && !fs$1.existsSync(path.join(directory, SQLITE_STAGING_TOKEN_FILES[0]))) return;
	if (owner) owner.retirementStarted = true;
	return beginSqliteSnapshotRetirement(directory, { token: owner?.release });
}
/** Delete in the token process: owner death must stop unlinking when its locks disappear. */
function retireSqliteSnapshotPayload(retirement) {
	for (const file of retirement.payload) {
		retireSqliteDatabaseAdmissionForPath(file);
		fs$1.rmSync(file, tempDirectoryRemovalOptions);
	}
	retirement.retire();
}
function removeTempDirectory(tempDir, onFailure) {
	let owner = snapshotDirectories.get(tempDir);
	try {
		const retirement = prepareSnapshotRetirement(tempDir, owner);
		try {
			if (retirement) {
				retireSqliteSnapshotPayload(retirement);
				owner = snapshotDirectory(tempDir);
				owner.release = void 0;
				owner.retired = true;
			}
			fs$1.rmSync(tempDir, tempDirectoryRemovalOptions);
		} finally {
			retirement?.release();
		}
		return completeSnapshotDirectoryRemoval(tempDir);
	} catch (error) {
		onFailure?.(error);
		registerSnapshotTempDirectory(tempDir);
		return false;
	}
}
async function removeTempDirectoryAsync(tempDir, onFailure) {
	let owner = snapshotDirectories.get(tempDir);
	if (owner?.releaseRetained) {
		const removed = await startRemoveTempDirectory(tempDir, onFailure, owner).result;
		if (removed) snapshotDirectories.delete(tempDir);
		return removed;
	}
	try {
		assertSnapshotReadersRetired(owner);
		const retirement = prepareSnapshotRetirement(tempDir, owner);
		try {
			for (const file of retirement?.payload ?? []) {
				retireSqliteDatabaseAdmissionForPath(file);
				await retainSnapshotWork(fs$1.promises.rm(file, tempDirectoryRemovalOptions));
			}
			if (retirement) {
				retirement.retire();
				owner = snapshotDirectory(tempDir);
				owner.release = void 0;
				owner.retired = true;
			}
			await retainSnapshotWork(fs$1.promises.rm(tempDir, tempDirectoryRemovalOptions));
		} finally {
			retirement?.release();
		}
		return completeSnapshotDirectoryRemoval(tempDir);
	} catch (error) {
		onFailure?.(error);
		registerSnapshotTempDirectory(tempDir);
		return false;
	}
}
function startRemoveTempDirectory(directory, onFailure, owner = snapshotDirectories.get(directory)) {
	if (owner?.retiringRetained) return owner.retiringRetained;
	let release;
	const retained = createRetainedOperation(() => {
		if (!release || retained.operation.read().status !== "pending") return;
		release.service();
		const outcome = release.read();
		if (outcome.status === "pending") return;
		if (owner) owner.retiringRetained = void 0;
		if (outcome.status === "rejected") {
			onFailure?.(outcome.error);
			retained.resolve(false);
		} else retained.resolve(completeSnapshotDirectoryRemoval(directory));
	});
	try {
		sealRetainedSnapshotTempDirectory(directory);
		if (!owner?.releaseRetained) throw new SqliteSnapshotCleanupError("SQLite snapshot has no retained cleanup owner");
		owner.retiringRetained = retained.operation;
		release = owner.releaseRetained();
		release.result.then(() => retained.operation.service(), () => retained.operation.service());
		retained.operation.service();
	} catch (error) {
		if (owner) owner.retiringRetained = void 0;
		onFailure?.(error);
		retained.resolve(false);
	}
	return retained.operation;
}
/** A surviving native owner may retire bytes only after their original host readers leave. */
function sealRetainedSnapshotTempDirectory(directory, options) {
	const owner = snapshotDirectories.get(directory);
	if (!owner?.releaseRetained) throw new SqliteSnapshotCleanupError("SQLite snapshot has no retained cleanup owner");
	if (options?.requireRequested && !owner.retirementStarted) throw new SqliteSnapshotCleanupError("SQLite snapshot is still owned; cleanup has not been requested");
	assertSnapshotReadersRetired(owner);
	owner.retirementStarted = true;
}
function adoptPreparedLocation(location, ownedRoot, requireCleanup = false, onCleanupFailure) {
	const tempDir = ownedRoot ?? path.dirname(location);
	registerSnapshotTempDirectory(tempDir);
	let active = true;
	let pending;
	let retainedCleanup;
	let reported = false;
	let cleanupFailure;
	const reportFailure = (error) => {
		cleanupFailure = error;
		if (!requireCleanup && !reported) {
			reported = true;
			emitSnapshotCleanupFailure({
				cleanupRoot: tempDir,
				operation: "rm",
				code: extractErrorCode(error)
			}, onCleanupFailure);
		}
	};
	const complete = (removed) => {
		if (removed) {
			active = false;
			snapshotDirectories.delete(tempDir);
		} else if (requireCleanup) throw new SqliteSnapshotCleanupError(`SQLite read-only worker snapshot cleanup failed: ${tempDir}`, { cause: cleanupFailure });
		return removed;
	};
	const startCleanup = () => {
		if (retainedCleanup?.read().status === "pending") return retainedCleanup;
		if (!active) {
			const retained = createRetainedOperation(() => {});
			retained.resolve(complete(true));
			return retainedCleanup = retained.operation;
		}
		return retainedCleanup = mapRetainedOperation(startRemoveTempDirectory(tempDir, reportFailure), complete);
	};
	return {
		location,
		cleanupRoot: tempDir,
		cleanup: () => {
			if (pending || retainedCleanup?.read().status === "pending") return requireCleanup ? complete(false) : false;
			if (!active) return complete(true);
			return complete(removeTempDirectory(tempDir, reportFailure));
		},
		cleanupAsync: () => {
			if (snapshotDirectories.get(tempDir)?.releaseRetained || retainedCleanup) return startCleanup().result;
			if (pending) return pending;
			if (!active) return Promise.resolve(complete(true));
			pending = Promise.resolve().then(() => removeTempDirectoryAsync(tempDir, reportFailure)).then(complete).finally(() => {
				pending = void 0;
			});
			return pending;
		},
		startCleanup
	};
}
//#endregion
//#region src/bootstrap/node-compiler-args.ts
const COMPILER_FLAGS = /* @__PURE__ */ new Set([
	"--no-maglev",
	"--maglev",
	"--no-concurrent-sparkplug",
	"--concurrent-sparkplug"
]);
/** Forward explicit compiler policy into OpenClaw-owned Node workers. */
function resolveForwardedNodeCompilerArgs(execArgv = process.execArgv) {
	return execArgv.filter((arg) => COMPILER_FLAGS.has(arg.replaceAll("_", "-")));
}
//#endregion
//#region src/process/spawn-broker/protocol.ts
var SpawnBrokerError = class extends Error {
	constructor(message, options) {
		super(message, options);
		this.code = "ERR_SPAWN_BROKER_UNAVAILABLE";
		this.name = "SpawnBrokerError";
	}
};
function serializeBrokerError(error) {
	return {
		message: error.message,
		code: error.code,
		errno: error.errno,
		syscall: error.syscall,
		path: error.path
	};
}
//#endregion
//#region src/process/spawn-broker/pipe.ts
const readers$1 = /* @__PURE__ */ new WeakMap();
const holdReadable = () => {};
/** Publish stream data and EOF after the caller's readiness continuation. */
function releasePipe(socket) {
	const held = restoreReader(socket);
	if (!held) return;
	process.nextTick(() => {
		if (socket.destroyed) return;
		socket.emit("readable");
		if (held.resumed) socket.resume();
	});
}
function restoreReader(socket) {
	const held = readers$1.get(socket);
	if (!held) return;
	socket.read = held.read;
	readers$1.delete(socket);
	socket.removeListener("resume", held.onResume);
	socket.removeListener("readable", holdReadable);
	return held;
}
//#endregion
//#region src/process/spawn-broker/child.ts
/** Native pipes remain native streams; only lifecycle and IPC cross the broker. */
var BrokerChild = class extends EventEmitter {
	constructor(requestId, argv, transmit) {
		super();
		this.requestId = requestId;
		this.transmit = transmit;
		this.callbackContext = new AsyncResource("OpenClawSpawnBrokerChild");
		this.stdin = null;
		this.stdout = null;
		this.stderr = null;
		this.connected = false;
		this.killed = false;
		this.exitCode = null;
		this.signalCode = null;
		this.stdio = [
			null,
			null,
			null,
			null,
			null
		];
		this.opened = createDeferredCore();
		this.completion = createDeferredCore();
		this.pipes = /* @__PURE__ */ new Set();
		this.sends = /* @__PURE__ */ new Map();
		this.sendSequence = 0;
		this.spawnReceived = false;
		this.eventsReleased = false;
		this.pendingEventOverflow = false;
		this.pendingEvents = [];
		this.exited = false;
		this.closed = false;
		this.processNotStarted = false;
		this.spawnfile = argv[0];
		this.spawnargs = [...argv];
		this.opened.promise.catch(() => {});
		this.on("error", () => {});
	}
	/** Only the admission owner can establish that no native process was started. */
	markNotStarted() {
		this.processNotStarted = true;
	}
	get notStarted() {
		return this.processNotStarted;
	}
	ready() {
		return this.opened.promise;
	}
	emit(event, ...args) {
		return this.callbackContext.runInAsyncScope(() => super.emit(event, ...args));
	}
	/** Transport bookkeeping survives disposal of the caller's event listeners. */
	waitForClose() {
		return this.completion.promise;
	}
	attachPipe(fd, socket) {
		socket.emit = this.callbackContext.bind(socket.emit.bind(socket));
		this.stdio[fd] = socket;
		if (fd === 0) this.stdin = socket;
		if (fd === 1) this.stdout = socket;
		if (fd === 2) this.stderr = socket;
		this.pipes.add(socket);
		let acknowledged = false;
		const acknowledge = (error) => {
			if (acknowledged) return;
			acknowledged = true;
			this.transmit({
				type: "output-drained",
				id: this.requestId,
				fd,
				error: error ? serializeBrokerError(error) : void 0
			}).catch(() => {});
		};
		socket.once(fd === 0 ? "finish" : "end", () => acknowledge());
		socket.on("error", acknowledge);
		socket.once("close", () => {
			acknowledge();
			this.pipes.delete(socket);
			this.finishClose();
		});
	}
	receive(message) {
		if (message.type === "spawned") {
			if (this.spawnReceived || this.closed) return;
			this.spawnReceived = true;
			this.pid = message.pid;
			this.spawnfile = message.spawnfile;
			this.spawnargs = message.spawnargs;
			this.connected = message.connected;
			this.stdio.splice(message.stdioLength);
			while (this.stdio.length < message.stdioLength) this.stdio.push(null);
			if (this.connected) this.channel = Object.assign(new EventEmitter(), {
				ref() {},
				unref() {}
			});
			this.opened.resolve();
			setImmediate(() => {
				if (this.closed) return;
				this.emit("spawn");
				setImmediate(() => {
					for (const [fd, pipe] of this.stdio.entries()) if (fd > 0 && pipe instanceof Socket && !pipe.destroyed) releasePipe(pipe);
					this.eventsReleased = true;
					for (const event of this.pendingEvents.splice(0)) event();
				});
			});
			return;
		}
		if (!this.eventsReleased && (this.spawnReceived || message.type !== "error")) {
			this.deferEvent(() => this.emitMessage(message));
			return;
		}
		this.emitMessage(message);
	}
	deferEvent(event) {
		if (this.pendingEventOverflow) return;
		if (this.pendingEvents.length >= 64) {
			this.pendingEventOverflow = true;
			this.pendingEvents.splice(0);
			this.pendingEvents.push(() => {
				this.kill("SIGKILL");
				this.failNow(new SpawnBrokerError("Spawn broker startup event capacity exceeded"));
			});
			return;
		}
		this.pendingEvents.push(event);
	}
	emitMessage(message) {
		switch (message.type) {
			case "error": {
				const error = Object.assign(new Error(message.error.message), message.error);
				this.opened.reject(error);
				this.emit("error", error);
				if (!this.pid) {
					this.exited = true;
					this.finishClose();
				}
				break;
			}
			case "exit":
				this.exited = true;
				this.exitCode = message.code;
				this.signalCode = message.signal;
				this.stdin?.destroy();
				this.emit("exit", message.code, message.signal);
				process.nextTick(() => {
					for (const pipe of this.pipes) if (pipe.readable) pipe.resume();
				});
				this.finishClose();
				break;
			case "ipc-sent":
				this.finishSend(message.sequence, message.error ? Object.assign(new Error(message.error.message), message.error) : null);
				break;
			case "disconnect":
				this.failSends(/* @__PURE__ */ new Error("Child process IPC channel is closed"));
				this.connected = false;
				this.channel = void 0;
				this.emit("disconnect");
				break;
			case "ipc":
				this.emit("message", message.message);
				break;
			case "closed": this.finishClose();
		}
	}
	fail(error) {
		if (this.spawnReceived && !this.eventsReleased) {
			this.deferEvent(() => this.failNow(error));
			return;
		}
		this.failNow(error);
	}
	failNow(error) {
		if (this.closed) return;
		this.opened.reject(error);
		this.failSends(error);
		const wasConnected = this.connected;
		this.connected = false;
		this.channel = void 0;
		if (wasConnected) this.emit("disconnect");
		if (!this.exited) this.emit("error", error);
		for (const pipe of this.pipes) pipe.destroy(error);
		this.exited = true;
		this.finishClose();
	}
	finishClose() {
		if (!this.exited || this.pipes.size > 0 || this.closed) return;
		this.closed = true;
		this.completion.resolve();
		this.emit("close", this.exitCode, this.signalCode);
	}
	kill(signal = "SIGTERM") {
		if (this.exited) return false;
		this.killed = true;
		this.transmit({
			type: "kill",
			id: this.requestId,
			signal
		}).catch((error) => this.fail(toErrorObject(error, "Spawn broker signal delivery failed")));
		return true;
	}
	send(message, handleOrCallback, optionsOrCallback, callback, initiateSpawn) {
		const done = typeof handleOrCallback === "function" ? handleOrCallback : typeof optionsOrCallback === "function" ? optionsOrCallback : callback;
		if (!this.connected || this.sends.size >= 1024) {
			const error = /* @__PURE__ */ new Error(this.connected ? "Child process IPC capacity exceeded" : "Child process IPC channel is closed");
			queueMicrotask(() => done ? done(error) : this.emit("error", error));
			return false;
		}
		const sequence = ++this.sendSequence;
		this.sends.set(sequence, AsyncResource.bind((error) => {
			if (done) done(error);
			else if (error) this.emit("error", error);
		}));
		const handle = typeof handleOrCallback === "function" ? void 0 : handleOrCallback;
		this.transmit({
			type: "ipc",
			id: this.requestId,
			sequence,
			message
		}, handle, initiateSpawn).catch((error) => this.finishSend(sequence, toErrorObject(error, "Spawn broker IPC delivery failed")));
		return true;
	}
	finishSend(sequence, error) {
		const callback = this.sends.get(sequence);
		this.sends.delete(sequence);
		callback?.(error);
	}
	failSends(error) {
		for (const sequence of this.sends.keys()) this.finishSend(sequence, error);
	}
	disconnect() {
		if (!this.connected) return;
		this.connected = false;
		this.transmit({
			type: "disconnect",
			id: this.requestId
		}).catch((error) => this.fail(toErrorObject(error, "Spawn broker disconnect failed")));
	}
	ref() {}
	unref() {}
	[Symbol.dispose]() {
		this.kill("SIGTERM");
	}
};
new Map([
	EvalError,
	RangeError,
	ReferenceError,
	SyntaxError,
	TypeError,
	URIError,
	Error
].map((constructor) => [constructor.name, constructor]));
process.hrtime.bigint.bind(process.hrtime);
//#endregion
//#region src/process/spawn-broker/context.ts
const context = new AsyncLocalStorage();
function getSpawnBroker() {
	return context.getStore();
}
//#endregion
//#region src/state/artifact-preserving-state-reads.ts
const artifactPreservingReads = resolveGlobalSingleton(Symbol.for("openclaw.artifactPreservingStateReads"), () => new AsyncLocalStorage());
function isArtifactPreservingStateRead(kind = "shared", pathname) {
	const scope = artifactPreservingReads.getStore();
	return Boolean(scope && (kind === "shared" || scope.agentDatabases) && (!pathname || ![...scope.privateRoots].some((root) => isPathInside(root, pathname))));
}
//#endregion
//#region node-compile-cache.mjs
if (isMainThread && process.env.OPENCLAW_PACKAGED_COMPILE_CACHE_RESPAWNED === "gateway") {
	delete process.env.NODE_DISABLE_COMPILE_CACHE;
	delete process.env.OPENCLAW_PACKAGED_COMPILE_CACHE_RESPAWNED;
}
const MAX_BYTES = 536870912;
const MAX_AGE_MS = 6048e5;
const MAINTENANCE_INTERVAL_MS = 36e5;
const BUILD_MARKER_RE = /^(?:[a-f0-9]{16}|\d+-\d+|no-package-json|build-[A-Za-z0-9._-]+)$/;
const sanitize = (value) => {
	const segment = value.replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^_+|_+$/g, "");
	return segment && segment !== "." && segment !== ".." ? segment : "unknown";
};
function resolveSafeNodeCompileCacheDirectory(directory) {
	if (process.platform === "win32" && path.resolve(directory).length > 200) {
		process.stderr.write("[openclaw] Compile cache disabled: Windows cache path exceeds 200 characters.\n");
		return;
	}
	return directory;
}
async function maintain(directory) {
	const root = path.dirname(path.dirname(directory));
	const version = path.basename(path.dirname(directory));
	if (path.basename(root) !== "openclaw" || sanitize(version) !== version || !BUILD_MARKER_RE.test(path.basename(directory))) return;
	const now = Date.now();
	const previous = await fs.lstat(root).catch(() => void 0);
	for (const target of [
		root,
		path.dirname(directory),
		directory
	]) {
		const stat = target === root ? previous : await fs.lstat(target).catch(() => void 0);
		if (stat && !stat.isDirectory()) return;
	}
	await fs.mkdir(directory, { recursive: true });
	if (previous && now - previous.mtimeMs < MAINTENANCE_INTERVAL_MS) return;
	await fs.utimes(root, new Date(now), new Date(now));
	const files = [];
	let bytes = 0;
	async function visit(dir) {
		for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
			const file = path.join(dir, entry.name);
			if (entry.isDirectory()) await visit(file);
			else if (entry.isFile()) {
				const stat = await fs.lstat(file);
				bytes += stat.size;
				files.push({
					file,
					size: stat.size,
					mtimeMs: stat.mtimeMs
				});
			}
		}
	}
	await visit(root);
	files.sort((left, right) => left.mtimeMs - right.mtimeMs);
	for (const file of files) if (bytes > MAX_BYTES || now - file.mtimeMs > MAX_AGE_MS) {
		await fs.unlink(file.file);
		bytes -= file.size;
	}
}
if (!isMainThread && typeof workerData?.openclawCompileCacheDirectory === "string") maintain(workerData.openclawCompileCacheDirectory).catch(() => {});
//#endregion
//#region src/infra/node-compile-cache-env.ts
const COMPILE_CACHE_BASE_KEY = Symbol.for("openclaw.nodeCompileCacheBase");
function compileCacheOwner() {
	return resolveGlobalSingleton(COMPILE_CACHE_BASE_KEY, () => ({}));
}
function resolveNodeCompileCacheEnv(env = process.env) {
	if (env.NODE_DISABLE_COMPILE_CACHE !== void 0) return env;
	const directory = env.NODE_COMPILE_CACHE ?? compileCacheOwner().baseDirectory;
	if (directory && !resolveSafeNodeCompileCacheDirectory(directory)) {
		const disabled = {
			...env,
			NODE_DISABLE_COMPILE_CACHE: "1"
		};
		delete disabled.NODE_COMPILE_CACHE;
		return disabled;
	}
	if (env.NODE_COMPILE_CACHE !== void 0) return env;
	return directory ? {
		...env,
		NODE_COMPILE_CACHE: directory
	} : env;
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
//#region src/infra/sqlite-readonly-worker-context.ts
const readOnlyWorkerScope = new AsyncLocalStorage();
//#endregion
//#region src/infra/shell-inline-command.ts
const POSIX_INLINE_COMMAND_FLAGS = /* @__PURE__ */ new Set([
	"-lc",
	"-c",
	"--command",
	"--commands",
	"--cmdline"
]);
[...POSIX_INLINE_COMMAND_FLAGS];
function expandPowerShellSwitchPrefixForms(match, smallestMatch) {
	const forms = [];
	for (let length = smallestMatch.length; length <= match.length; length += 1) {
		const prefix = match.slice(0, length);
		forms.push(`-${prefix}`, `--${prefix}`, `/${prefix}`);
	}
	return forms;
}
function expandPowerShellSwitchForms(names) {
	return names.flatMap((name) => {
		const normalized = normalizeLowercaseStringOrEmpty(name);
		return [
			`-${normalized}`,
			`--${normalized}`,
			`/${normalized}`
		];
	});
}
const POWERSHELL_COMMAND_FLAGS = [
	...expandPowerShellSwitchPrefixForms("command", "c"),
	...expandPowerShellSwitchPrefixForms("commandwithargs", "cwa"),
	...expandPowerShellSwitchForms(["cwa"])
];
const POWERSHELL_FILE_FLAGS = expandPowerShellSwitchPrefixForms("file", "f");
const POWERSHELL_INLINE_FILE_FLAGS = new Set(POWERSHELL_FILE_FLAGS);
new Set(expandPowerShellSwitchPrefixForms("noprofile", "nop"));
[
	...expandPowerShellSwitchPrefixForms("configurationfile", "conf"),
	...expandPowerShellSwitchPrefixForms("configurationname", "config"),
	...expandPowerShellSwitchPrefixForms("custompipename", "cus"),
	...expandPowerShellSwitchPrefixForms("encodedarguments", "encodeda"),
	...expandPowerShellSwitchForms(["ea"]),
	...expandPowerShellSwitchPrefixForms("interactive", "i"),
	...expandPowerShellSwitchPrefixForms("login", "l"),
	...expandPowerShellSwitchPrefixForms("namedpipeservermode", "nam"),
	...expandPowerShellSwitchPrefixForms("noexit", "noe"),
	...expandPowerShellSwitchPrefixForms("psconsolefile", "pscf"),
	...expandPowerShellSwitchForms(["pscf"]),
	...expandPowerShellSwitchPrefixForms("servermode", "s"),
	...expandPowerShellSwitchPrefixForms("settingsfile", "settings"),
	...expandPowerShellSwitchPrefixForms("socketservermode", "so"),
	...expandPowerShellSwitchPrefixForms("sshservermode", "ssh"),
	...expandPowerShellSwitchPrefixForms("v2socketservermode", "v2so")
];
const POWERSHELL_INLINE_ENCODED_COMMAND_FLAGS = /* @__PURE__ */ new Set([...expandPowerShellSwitchPrefixForms("encodedcommand", "e"), ...expandPowerShellSwitchPrefixForms("ec", "e")]);
const POWERSHELL_INLINE_COMMAND_FLAGS = /* @__PURE__ */ new Set([
	...POWERSHELL_COMMAND_FLAGS,
	...POWERSHELL_FILE_FLAGS,
	...POWERSHELL_INLINE_ENCODED_COMMAND_FLAGS
]);
const POWERSHELL_INLINE_REST_COMMAND_FLAGS = new Set(POWERSHELL_COMMAND_FLAGS);
const POWERSHELL_OPTIONS_WITH_SEPARATE_VALUES = /* @__PURE__ */ new Set([
	...expandPowerShellSwitchPrefixForms("configurationfile", "conf"),
	...expandPowerShellSwitchPrefixForms("configurationname", "config"),
	...expandPowerShellSwitchPrefixForms("custompipename", "cus"),
	...expandPowerShellSwitchPrefixForms("encodedarguments", "encodeda"),
	...expandPowerShellSwitchPrefixForms("executionpolicy", "ex"),
	...expandPowerShellSwitchPrefixForms("inputformat", "inp"),
	...expandPowerShellSwitchPrefixForms("outputformat", "o"),
	...expandPowerShellSwitchPrefixForms("psconsolefile", "pscf"),
	...expandPowerShellSwitchPrefixForms("settingsfile", "settings"),
	...expandPowerShellSwitchPrefixForms("token", "to"),
	...expandPowerShellSwitchPrefixForms("utctimestamp", "utc"),
	...expandPowerShellSwitchPrefixForms("version", "v"),
	...expandPowerShellSwitchPrefixForms("windowstyle", "w"),
	...expandPowerShellSwitchPrefixForms("workingdirectory", "w"),
	...expandPowerShellSwitchForms([
		"ea",
		"ep",
		"if",
		"of",
		"pscf",
		"wd"
	])
]);
const POSIX_SHELL_OPTIONS_WITH_SEPARATE_VALUES = /* @__PURE__ */ new Set([
	"--init-file",
	"--rcfile",
	"-O",
	"-o",
	"+O",
	"+o"
]);
function countSeparateValueOptionChars(token) {
	let count = 0;
	for (let index = 1; index < token.length; index += 1) {
		const char = token[index];
		if (char === "o" || char === "O") count += 1;
	}
	return count;
}
function parseCombinedCommandFlag(token) {
	if (token.length < 2 || token[0] !== "-" || token[1] === "-") return null;
	const optionChars = token.slice(1);
	const commandFlagIndex = optionChars.indexOf("c");
	if (commandFlagIndex === -1 || optionChars.includes("-")) return null;
	const suffix = optionChars.slice(commandFlagIndex + 1);
	if (suffix && !/^[A-Za-z]+$/.test(suffix)) return {
		attachedCommand: suffix,
		separateValueCount: 0
	};
	return {
		attachedCommand: null,
		separateValueCount: countSeparateValueOptionChars(token)
	};
}
function combinedSeparateValueOptionCount(token) {
	if (token.length < 2 || token[0] !== "-" && token[0] !== "+" || token[1] === "-" || token.slice(1).includes("-")) return 0;
	return countSeparateValueOptionChars(token);
}
/** Return how many argv tokens a POSIX shell option consumes while scanning. */
function advancePosixInlineOptionScan(token) {
	const combinedValueCount = combinedSeparateValueOptionCount(token);
	if (combinedValueCount > 0) return 1 + combinedValueCount;
	if (POSIX_SHELL_OPTIONS_WITH_SEPARATE_VALUES.has(token)) return 2;
	return 1;
}
function isPowerShellOptionToken(token) {
	return token.startsWith("-") || /^\/[A-Za-z][A-Za-z0-9]*$/.test(token);
}
/** Find the inline command payload for a shell wrapper argv. */
function resolveInlineCommandMatch(argv, flags, options = {}) {
	for (let i = 1; i < argv.length;) {
		const token = argv[i]?.trim();
		if (!token) {
			i += 1;
			continue;
		}
		const lower = normalizeLowercaseStringOrEmpty(token);
		if (lower === "--") break;
		const comparableToken = options.allowCombinedC ? token : lower;
		const exact = flags.has(comparableToken);
		const combined = !exact && options.allowCombinedC ? parseCombinedCommandFlag(token) : null;
		if (exact || combined) {
			if (combined && combined.attachedCommand !== null) return {
				command: combined.attachedCommand.trim() || null,
				valueTokenIndex: i
			};
			const commandIndex = i + 1 + (combined?.separateValueCount ?? 0);
			const valueTokenIndex = !combined && commandIndex >= argv.length ? null : commandIndex;
			const command = exact && options.restValueFlags?.has(comparableToken) ? argv.slice(i + 1).map((arg) => arg.trim()).join(" ").trim() : argv[commandIndex]?.trim();
			return {
				command: command ? command : null,
				valueTokenIndex
			};
		}
		if (options.valueOptions?.has(lower)) {
			i += 2;
			continue;
		}
		const isOptionToken = options.isOptionToken?.(token) ?? (token.startsWith("-") || token.startsWith("+"));
		if (options.stopAtFirstNonOption && !isOptionToken) break;
		if (options.allowCombinedC && !token.startsWith("-") && !token.startsWith("+")) break;
		i += options.allowCombinedC ? advancePosixInlineOptionScan(token) : 1;
	}
	return {
		command: null,
		valueTokenIndex: null
	};
}
/** Find the PowerShell inline command payload and value token index. */
function resolvePowerShellInlineCommandMatch(argv) {
	return resolveInlineCommandMatch(argv, POWERSHELL_INLINE_COMMAND_FLAGS, {
		isOptionToken: isPowerShellOptionToken,
		restValueFlags: POWERSHELL_INLINE_REST_COMMAND_FLAGS,
		stopAtFirstNonOption: true,
		valueOptions: POWERSHELL_OPTIONS_WITH_SEPARATE_VALUES
	});
}
/** Return true when a PowerShell flag treats the next token as script file text. */
function isPowerShellInlineFileCommandFlag(token) {
	return POWERSHELL_INLINE_FILE_FLAGS.has(normalizeLowercaseStringOrEmpty(token));
}
//#endregion
//#region src/process/linux-oom-score.ts
const OOM_SCORE_WRAP_SHELL = "/bin/sh";
const OOM_SCORE_WRAP_SCRIPT = "echo 1000 > /proc/self/oom_score_adj 2>/dev/null; exec \"$0\" \"$@\"";
const OOM_SCORE_RESTORE_EXEC_ENV_SCRIPT = [
	"echo 1000 > /proc/self/oom_score_adj 2>/dev/null; if [ \"${OC_INTERNAL_OOM_EXEC_BASH_ENV+x}\" = x ]; then BASH_ENV=\"$OC_INTERNAL_OOM_EXEC_BASH_ENV\"; export BASH_ENV; fi; unset OC_INTERNAL_OOM_EXEC_BASH_ENV",
	"if [ \"${OC_INTERNAL_OOM_EXEC_ENV+x}\" = x ]; then ENV=\"$OC_INTERNAL_OOM_EXEC_ENV\"; export ENV; fi; unset OC_INTERNAL_OOM_EXEC_ENV",
	"if [ \"${OC_INTERNAL_OOM_EXEC_CDPATH+x}\" = x ]; then CDPATH=\"$OC_INTERNAL_OOM_EXEC_CDPATH\"; export CDPATH; fi; unset OC_INTERNAL_OOM_EXEC_CDPATH",
	"if [ \"${OC_INTERNAL_OOM_EXEC_PS4+x}\" = x ]; then PS4=\"$OC_INTERNAL_OOM_EXEC_PS4\"; export PS4; fi; unset OC_INTERNAL_OOM_EXEC_PS4; exec \"$0\" \"$@\""
].join("; ");
/** Diagnostics attribute the final command without changing the wrapper's execution policy. */
function resolveOomScoreWrappedCommand(command, args) {
	return command === OOM_SCORE_WRAP_SHELL && args[0] === "-c" && (args[1] === OOM_SCORE_WRAP_SCRIPT || args[1] === OOM_SCORE_RESTORE_EXEC_ENV_SCRIPT) && args[2] ? args[2] : void 0;
}
//#endregion
//#region src/process/spawn-diagnostics.ts
const spawnCounts = resolveGlobalSingleton(Symbol.for("openclaw.childProcessSpawnCounts"), () => ({
	counts: /* @__PURE__ */ new Map(),
	sampledAt: performance.now()
}));
const COMMAND_FAMILIES = /^(node|bun|git|ps|pgrep|lsof|sh|bash|zsh|cmd|powershell|pwsh|npm|pnpm|python|python3|uv|ssh|openclaw)$/;
const gitOperation = resolveGlobalSingleton(Symbol.for("openclaw.gitSpawnOperation"), () => new AsyncLocalStorage());
const childOperation = resolveGlobalSingleton(Symbol.for("openclaw.childSpawnOperation"), () => new AsyncLocalStorage());
function unscopedProcessOperation(family, name, args) {
	if (args[0] === "--version" || args[0] === "-v" && (family === "node" || family === "bun" || name === "gh")) return "unscoped.version";
	if (family === "powershell" || family === "pwsh") {
		const argv = [name, ...args];
		const { command, valueTokenIndex } = resolvePowerShellInlineCommandMatch(argv);
		return command !== null && valueTokenIndex !== null && !isPowerShellInlineFileCommandFlag(argv[valueTokenIndex - 1] ?? "") ? "unscoped.shell-command" : "unscoped.shell";
	}
	if (/^(sh|bash|zsh)$/.test(family)) return resolveInlineCommandMatch([name, ...args], POSIX_INLINE_COMMAND_FLAGS, { allowCombinedC: true }).command !== null ? "unscoped.shell-command" : "unscoped.shell";
	if (family === "cmd") return args.some((arg) => /^-[a-z]*c$/.test(arg) || /^\/(?:c|k)$/i.test(arg)) ? "unscoped.shell-command" : "unscoped.shell";
	if (family === "node" || family === "bun") return "unscoped.runtime";
	if (family === "other" && /^(gh|docker|podman|which|uname|sw_vers|sysctl|curl|tar)$/.test(name)) return `unscoped.${name}`;
	return "unscoped.command";
}
function unscopedGitOperation(args) {
	let i = 0;
	while (i < args.length) {
		const arg = args[i];
		if ([
			"-C",
			"-c",
			"--git-dir",
			"--work-tree",
			"--namespace",
			"--config-env"
		].includes(arg)) i += 2;
		else if (/^--(?:git-dir|work-tree|namespace|config-env|attr-source)=/u.test(arg)) i++;
		else if ([
			"--no-pager",
			"--no-optional-locks",
			"--no-lazy-fetch",
			"--literal-pathspecs",
			"--bare"
		].includes(arg)) i++;
		else break;
	}
	const command = args[i] ?? "";
	return /^(config|rev-parse|status|diff|ls-files|rev-list|merge-base|cat-file|symbolic-ref|for-each-ref|show-ref|remote|log|show|hash-object|update-ref|worktree|branch|fetch|clone|init|checkout|read-tree|write-tree|commit-tree|pack-objects|index-pack|maintenance|multi-pack-index|gc|fast-import|add|commit|push|reset|clean|merge|tag|describe|switch|ls-tree|update-index|check-ref-format|diff-tree|diff-index|diff-files|sparse-checkout|checkout-index|check-attr|mktree|var|apply|fsck|ls-remote|rebase|reflog)$/u.test(command) ? `unscoped.${command}` : command === "--version" || command === "version" ? "unscoped.version" : "unscoped.other";
}
/** Capture attribution before native preparation; record only after a successful launch. */
function prepareChildProcessSpawnRecorder(command, args = [], sqliteOperation) {
	if (!areDiagnosticsEnabledForProcess()) return;
	const wrappedCommand = resolveOomScoreWrappedCommand(command, args);
	const commandArgs = wrappedCommand ? args.slice(3) : args;
	const name = path.win32.basename(wrappedCommand ?? command).toLowerCase().replace(/\.(exe|cmd)$/, "");
	const family = COMMAND_FAMILIES.test(name) ? name : "other";
	const operation = family === "git" ? gitOperation.getStore() ?? childOperation.getStore() ?? unscopedGitOperation(commandArgs) : sqliteOperation ?? childOperation.getStore() ?? unscopedProcessOperation(family, name, commandArgs);
	const key = `${family}:${operation}`;
	return () => {
		if (areDiagnosticsEnabledForProcess()) {
			const previous = spawnCounts.counts.get(key);
			spawnCounts.counts.set(key, {
				family,
				operation,
				count: (previous?.count ?? 0) + 1
			});
		}
	};
}
/** Count admitted local and broker launches, excluding failed spawn attempts. */
function recordChildProcessSpawn(command, child, sqliteOperation, args = []) {
	const record = prepareChildProcessSpawnRecorder(command, args, sqliteOperation);
	if (record) child.once("spawn", record);
}
//#endregion
//#region src/infra/agent-database-readers.ts
const readers = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseReaders"), () => ({
	closers: /* @__PURE__ */ new Set(),
	deleted: /* @__PURE__ */ new Map()
}));
/** Match captured read custody without inspecting files or inferring their owners. */
function matchesAgentDatabaseReadCandidatePath(candidate, pathname) {
	const capturedPath = path.resolve(candidate.path);
	const resolvedPath = path.resolve(pathname);
	if (capturedPath === resolvedPath) return true;
	if (candidate.scope !== "sibling-family") return false;
	const captured = path.parse(capturedPath);
	const selected = path.parse(resolvedPath);
	return selected.dir === captured.dir && selected.base.startsWith(`${captured.name}.`) && selected.base.endsWith(captured.ext);
}
/** Every cache that retains agent database connections registers once per isolate. */
function registerAgentDatabaseReaderCloser(closer) {
	readers.closers.add(closer);
	return () => {
		readers.closers.delete(closer);
	};
}
//#endregion
//#region src/state/openclaw-agent-db.paths.ts
const INCOGNITO_AGENT_SQLITE_BASENAME = "incognito-openclaw-agent.sqlite";
(/* @__PURE__ */ new Map()).keys();
//#endregion
//#region src/state/openclaw-state-db.paths.ts
function resolveDatabasePath(options = {}) {
	return options.path === void 0 ? resolveOpenClawStateSqlitePath(options.env ?? process.env) : normalizeDatabasePath(path.resolve(options.path));
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
//#endregion
//#region src/state/agent-creation-claim.ts
const creationClaim = resolveGlobalSingleton(Symbol.for("openclaw.agentCreationClaim"), () => new AsyncLocalStorage());
const creationResources = resolveGlobalSingleton(Symbol.for("openclaw.agentCreationClaimResources"), () => /* @__PURE__ */ new Map());
function getActiveAgentCreationClaim(agentId, statePath) {
	const scope = creationClaim.getStore();
	if (!scope || scope.kind !== "host" || !scope.isActive() || scope.agentId !== normalizeAgentId(agentId) || scope.statePath !== path.resolve(statePath)) return;
	return scope;
}
/** Hold pending native custody until publication hands it to the handle, or disposal succeeds. */
function reserveAgentCreationClaimAdmission(admission, options, close) {
	const scope = getActiveAgentCreationClaim(options.agentId, resolveOpenClawStateSqlitePath(options.env ?? process.env));
	if (!scope) return;
	creationResources.set(admission, scope);
	scope.registerClose(async () => {
		if (creationResources.get(admission) !== scope) return;
		await close();
		creationResources.delete(admission);
	});
	return () => {
		creationResources.delete(admission);
	};
}
//#endregion
//#region src/state/agent-database-admission-error.ts
/** A database owner refused new work; an admitted command's failure is never classified here. */
const AgentDatabaseExecutionAdmissionClosedError = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseExecutionAdmissionClosedError"), () => class AdmissionClosedError extends Error {});
resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseSchemaAdmissionChangedError"), () => class SchemaAdmissionChangedError extends Error {
	constructor() {
		super("Agent schema admission changed before publication; retry the operation");
	}
});
resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseSchemaAdmissionInvalidError"), () => class SchemaAdmissionInvalidError extends Error {
	constructor() {
		super("Invalid agent schema admission receipt");
	}
});
//#endregion
//#region src/state/agent-deletion-cleanup.ts
const databaseCleanup = resolveGlobalSingleton(Symbol.for("openclaw.agentDeletionDatabaseCleanup"), () => new AsyncLocalStorage());
resolveGlobalSingleton(Symbol.for("openclaw.agentDeletionDatabaseCleanupHandles"), () => /* @__PURE__ */ new Map());
resolveGlobalSingleton(Symbol.for("openclaw.agentDeletionDatabaseCleanupExecutions"), () => /* @__PURE__ */ new Map());
/** Resource registration captures only the cleanup scope that admitted this target. */
function captureAgentDeletionResourceOwner(matches) {
	const scope = databaseCleanup.getStore();
	if (!scope?.ownsDatabase || !matches(scope) && (!scope.canonicalPath || !matches({
		agentId: scope.agentId,
		path: scope.canonicalPath
	}))) return;
	scope.assertCurrentHost();
	return scope;
}
resolveGlobalSingleton(Symbol.for("openclaw.maintenanceLiveAuthorityReads"), () => /* @__PURE__ */ new WeakMap());
const maintenanceResources = resolveGlobalSingleton(Symbol.for("openclaw.databaseMaintenanceResources"), () => ({
	current: new AsyncLocalStorage(),
	claims: /* @__PURE__ */ new WeakMap(),
	parents: /* @__PURE__ */ new WeakMap()
}));
function getOpenClawDatabaseMaintenanceScope() {
	return maintenanceResources.current.getStore()?.scope;
}
/** Background work retains command custody without borrowing its native execution path. */
function isOpenClawDatabaseMaintenanceWorkerAccess() {
	return maintenanceResources.current.getStore()?.workerAccess === true;
}
function isOpenClawDatabaseMaintenanceResourceOwned(resource, scope) {
	return maintenanceResources.claims.get(resource)?.scope === scope;
}
function getOpenClawDatabaseMaintenanceResourceScope(resource) {
	return maintenanceResources.claims.get(resource)?.scope;
}
function runMaintenance(scope, operation, workerAccess = isOpenClawDatabaseMaintenanceWorkerAccess()) {
	const accepted = {
		scope,
		active: true,
		workerAccess
	};
	try {
		const result = maintenanceResources.current.run(accepted, operation);
		if (result instanceof Promise) {
			const settled = () => {
				accepted.active = false;
			};
			result.then(settled, settled);
			scope.track(result);
		} else accepted.active = false;
		return result;
	} catch (error) {
		accepted.active = false;
		throw error;
	}
}
/** Retain one exact resource claim for finite commands while its maintenance scope drains. */
function captureOpenClawDatabaseMaintenanceResource(resource, expectedScope) {
	const claim = maintenanceResources.claims.get(resource);
	const assertCurrent = () => {
		expectedScope.assertOwnerCurrent();
		if (claim?.scope !== expectedScope || maintenanceResources.claims.get(resource) !== claim) throw new Error("Database maintenance resource owner changed");
	};
	assertCurrent();
	return {
		assertCurrent,
		async run(operation) {
			assertCurrent();
			return runMaintenance(expectedScope, operation);
		},
		async runWorker(operation) {
			assertCurrent();
			return runMaintenance(expectedScope, operation, true);
		}
	};
}
/** A cached handle used by an independent caller remains with the ordinary cache owner. */
function observeOpenClawDatabaseMaintenanceResource(resource) {
	if (!resource) return;
	const claim = maintenanceResources.claims.get(resource);
	const current = getOpenClawDatabaseMaintenanceScope();
	if (!claim) return;
	const owner = commonMaintenanceAncestor(claim.scope, current);
	if (owner === claim.scope) return;
	claim.scope.assertAdmission();
	claim.release();
	maintenanceResources.claims.delete(resource);
	if (owner) owner.own(resource, claim.phase, claim.close);
}
function commonMaintenanceAncestor(owner, scope) {
	const ancestors = /* @__PURE__ */ new Set();
	for (let current = owner; current; current = maintenanceResources.parents.get(current)) ancestors.add(current);
	for (let current = scope; current; current = maintenanceResources.parents.get(current)) if (ancestors.has(current)) return current;
}
//#endregion
//#region src/state/openclaw-state-db-async-lifecycle.ts
const STATE_DATABASE_READ_ADMISSION_INVALIDATED = "STATE_DATABASE_READ_ADMISSION_INVALIDATED";
var StateDatabaseReadAdmissionInvalidatedError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.code = STATE_DATABASE_READ_ADMISSION_INVALIDATED;
	}
};
function isStateDatabaseReadAdmissionInvalidatedError(error) {
	return extractErrorCode(error) === STATE_DATABASE_READ_ADMISSION_INVALIDATED;
}
/** The cache owns physical identity and admission across drainage and file exclusion. */
function createOpenClawStateDatabaseAsyncLifecycle() {
	const resources = /* @__PURE__ */ new Set();
	const records = /* @__PURE__ */ new Map();
	const recordsByPath = /* @__PURE__ */ new Map();
	const seals = /* @__PURE__ */ new Set();
	const attempts = /* @__PURE__ */ new Map();
	let tail = Promise.resolve();
	const proofFor = () => {
		const proof = new SharedArrayBuffer(BigInt64Array.BYTES_PER_ELEMENT);
		new BigInt64Array(proof)[0] = -1n;
		return proof;
	};
	const generationFor = (identity) => {
		const revision = new SharedArrayBuffer(BigInt64Array.BYTES_PER_ELEMENT);
		return { integrity: {
			identity,
			lifetime: {
				revision: new SharedArrayBuffer(BigInt64Array.BYTES_PER_ELEMENT),
				epoch: 0n
			},
			revision,
			epoch: 0n,
			proof: proofFor()
		} };
	};
	const publishCreatedIdentity = (record, identity) => {
		Atomics.add(new BigInt64Array(record.generation.integrity.revision), 0, 1n);
		Atomics.add(new BigInt64Array(record.generation.integrity.lifetime.revision), 0, 1n);
		records.delete(record.identity.key);
		record.identity = identity;
		record.generation.integrity.identity = identity;
		records.set(identity.key, record);
	};
	const known = (pathname) => recordsByPath.get(pathname) ?? recordsByPath.get(resolveDatabasePath({ path: pathname }));
	const bindPath = (record, pathname) => {
		record.paths.add(pathname);
		if (!recordsByPath.has(pathname)) recordsByPath.set(pathname, record);
	};
	const overlaps = (left, right) => {
		if (left.identity.key === right.identity.key) return true;
		for (const pathname of left.paths) if (right.paths.has(pathname)) return true;
		return false;
	};
	const isSealed = (record) => {
		if (seals.size === 0) return false;
		for (const held of seals) if (held.record === void 0 || overlaps(held.record, record)) return true;
		return false;
	};
	const hasCloseCustody = (record) => isSealed(record) || attempts.has(record);
	const assertOpen = (record) => {
		if (isSealed(record)) throw new StateDatabaseReadAdmissionInvalidatedError("OpenClaw state database read admission is closed");
	};
	const findPhysicalRecord = (identity) => {
		const record = records.get(identity.key);
		if (!record || !identity.key.startsWith("file:") || hasCloseCustody(record)) return record;
		for (const pathname of findChangedDatabasePaths(record.paths, identity)) {
			record.admissions.delete(pathname);
			record.paths.delete(pathname);
			if (recordsByPath.get(pathname) === record) recordsByPath.delete(pathname);
		}
		if (record.paths.size > 0) {
			if (!record.paths.has(record.identity.canonicalPath)) {
				record.identity = identity;
				record.generation.integrity.identity = identity;
			}
			return record;
		}
		invalidate(record);
		forget(record);
	};
	const resolve = (resolvedPath, preparedIdentity) => {
		const cached = recordsByPath.get(resolvedPath);
		if (cached && (!preparedIdentity || cached.identity.key === preparedIdentity.key)) return !preparedIdentity && cached.identity.key.startsWith("path:") ? resolve(resolvedPath, readDatabasePathIdentitySync(resolvedPath)) : cached;
		const identity = preparedIdentity ?? readDatabasePathIdentitySync(resolvedPath);
		let record = findPhysicalRecord(identity);
		if (!record && identity.key.startsWith("file:")) {
			record = [...records.values()].find((candidate) => {
				if (!candidate.identity.key.startsWith("path:")) return false;
				try {
					return readDatabasePathIdentitySync(candidate.identity.canonicalPath).key === identity.key;
				} catch {
					return false;
				}
			});
			if (record) publishCreatedIdentity(record, identity);
		}
		if (!record) {
			record = {
				coordinationKey: identity.key,
				identity,
				paths: /* @__PURE__ */ new Set(),
				generation: generationFor(identity),
				admissions: /* @__PURE__ */ new Map()
			};
			records.set(identity.key, record);
		}
		bindPath(record, resolvedPath);
		bindPath(record, identity.canonicalPath);
		return record;
	};
	const resolveForNative = (pathname) => {
		const resolvedPath = resolveDatabasePath({ path: pathname });
		const cached = recordsByPath.get(resolvedPath);
		if (cached) return cached;
		const identity = inspectDatabasePathIdentitySync(resolvedPath);
		return identity ? resolve(resolvedPath, identity) : void 0;
	};
	const invalidate = (record) => {
		for (const current of record ? [record] : records.values()) {
			Atomics.store(new BigInt64Array(current.generation.integrity.revision), 0, -1n);
			Atomics.store(new BigInt64Array(current.generation.integrity.lifetime.revision), 0, -1n);
			current.generation = generationFor(current.identity);
			current.admissions.clear();
		}
	};
	const seal = (record) => {
		invalidate(record);
		const held = { record };
		seals.add(held);
		return held;
	};
	const release = (attempt) => {
		if (attempt.seal) {
			seals.delete(attempt.seal);
			attempt.seal = void 0;
		}
	};
	const forget = (record) => {
		if (!hasCloseCustody(record) && records.get(record.identity.key) === record) {
			records.delete(record.identity.key);
			for (const pathname of record.paths) if (recordsByPath.get(pathname) === record) {
				recordsByPath.delete(pathname);
				for (const replacement of records.values()) if (replacement.paths.has(pathname)) {
					recordsByPath.set(pathname, replacement);
					break;
				}
			}
		}
	};
	const captureRecord = (record, databasePath) => {
		const previous = record.admissions.get(databasePath);
		if (previous) return previous;
		const generation = record.generation;
		const admission = Object.freeze({
			databasePath,
			coordinationKey: record.coordinationKey,
			get identity() {
				return record.identity;
			},
			captureIntegrity() {
				admission.assertCurrent();
				const current = generation.integrity;
				const epoch = Atomics.load(new BigInt64Array(current.revision), 0);
				const lifetimeEpoch = Atomics.load(new BigInt64Array(current.lifetime.revision), 0);
				if (epoch !== current.epoch || lifetimeEpoch !== current.lifetime.epoch) generation.integrity = {
					...current,
					identity: record.identity,
					lifetime: {
						revision: current.lifetime.revision,
						epoch: lifetimeEpoch
					},
					epoch,
					proof: proofFor()
				};
				return generation.integrity;
			},
			assertCurrent() {
				assertOpen(record);
				if (records.get(record.identity.key) !== record || record.generation !== generation || record.admissions.get(databasePath) !== admission) throw new StateDatabaseReadAdmissionInvalidatedError("OpenClaw state database read admission changed");
			}
		});
		record.admissions.set(databasePath, admission);
		return admission;
	};
	return {
		identity(pathname) {
			return known(pathname)?.identity ?? inspectDatabasePathIdentitySync(pathname);
		},
		knownIdentity(pathname) {
			return known(pathname)?.identity;
		},
		integrity(pathname) {
			const record = resolveForNative(pathname);
			return record && !isSealed(record) ? captureRecord(record, resolveDatabasePath({ path: pathname })).captureIntegrity?.() : void 0;
		},
		publish(pathname) {
			const resolvedPath = resolveDatabasePath({ path: pathname });
			const identity = readDatabasePathIdentitySync(resolvedPath);
			const previous = recordsByPath.get(resolvedPath);
			let record = findPhysicalRecord(identity);
			if (previous && previous.identity.key !== identity.key) {
				if (previous.identity.key.startsWith("path:") && !record) {
					publishCreatedIdentity(previous, identity);
					record = previous;
				} else {
					const failed = attempts.get(previous);
					if (failed) {
						failed.superseded = true;
						failed.seal ??= seal(previous);
					} else invalidate(previous);
					forget(previous);
				}
			}
			if (!record) record = resolve(resolvedPath, identity);
			bindPath(record, resolvedPath);
			bindPath(record, identity.canonicalPath);
			return {
				identity,
				admission: captureRecord(record, resolvedPath)
			};
		},
		invalidate(pathname) {
			if (pathname === void 0) invalidate();
			else {
				const record = known(pathname);
				if (record) invalidate(record);
			}
		},
		register(resource) {
			resources.add(resource);
			for (const attempt of attempts.values()) attempt.queue?.add(resource);
			return () => {
				resources.delete(resource);
			};
		},
		capture(pathname) {
			const cached = recordsByPath.get(pathname);
			const retained = cached?.admissions.get(pathname);
			if (cached && retained && cached.identity.key.startsWith("file:")) {
				retained.assertCurrent();
				return retained;
			}
			const databasePath = resolveDatabasePath({ path: pathname });
			const record = resolve(databasePath);
			assertOpen(record);
			return captureRecord(record, databasePath);
		},
		holdExclusion(pathname) {
			const record = resolve(resolveDatabasePath({ path: pathname }));
			const held = seal(record);
			return () => {
				seals.delete(held);
				for (const current of records.values()) if (overlaps(record, current)) forget(current);
			};
		},
		close(pathname, retireNative) {
			const record = pathname === void 0 ? void 0 : resolveForNative(pathname);
			if (pathname !== void 0 && !record) return Promise.resolve(retireNative());
			let attempt = attempts.get(record);
			if (attempt?.pending) return attempt.pending;
			if (!attempt) {
				attempt = { retained: /* @__PURE__ */ new Set() };
				attempts.set(record, attempt);
			}
			attempt.seal ??= seal(record);
			const current = attempt;
			const pending = tail.then(async () => {
				const closing = /* @__PURE__ */ new Set([...resources, ...current.retained]);
				for (const entry of attempts.values()) for (const resource of entry.retained) closing.add(resource);
				current.queue = closing;
				const errors = [];
				while (current.queue.size) {
					const ordinary = [...current.queue].filter((resource) => resource.phase !== "after-resources");
					if (!ordinary.length && errors.length) {
						for (const resource of current.queue) current.retained.add(resource);
						break;
					}
					const batch = ordinary.length ? ordinary : [...current.queue];
					for (const resource of batch) current.queue.delete(resource);
					await Promise.all(batch.map(async (resource) => {
						try {
							await resource.close(record?.identity);
							current.retained.delete(resource);
						} catch (error) {
							current.retained.add(resource);
							errors.push(error);
						}
					}));
				}
				if (errors.length && !current.superseded) release(current);
				throwSqliteLifecycleErrors(errors, "OpenClaw state resource drainage failed");
				const retired = await retireNative(record?.identity);
				attempts.delete(record);
				release(current);
				if (record === void 0) {
					for (const [key, entry] of attempts) if (!entry.pending) {
						attempts.delete(key);
						release(entry);
					}
					for (const entry of records.values()) forget(entry);
				} else forget(record);
				return retired;
			}).finally(() => {
				current.queue = void 0;
			});
			current.pending = pending;
			tail = pending.then(() => void 0, () => void 0);
			pending.catch(() => {
				current.pending = void 0;
			});
			return pending;
		}
	};
}
//#endregion
//#region src/state/openclaw-agent-db-resources.ts
const resources = resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseAsyncResources"), () => ({
	active: /* @__PURE__ */ new Set(),
	closing: /* @__PURE__ */ new Map(),
	selections: /* @__PURE__ */ new Map()
}));
registerAgentDatabaseReaderCloser(async (candidates, retainedPaths) => {
	const errors = (await Promise.allSettled([.../* @__PURE__ */ new Set([...resources.active, ...resources.closing.keys()])].filter((resource) => !retainedPaths?.has(path.resolve(resource.path)) && candidates.some((candidate) => matchesAgentDatabaseReadCandidatePath(candidate, resource.path))).map((resource) => closeAgentDatabaseResource(resource)))).flatMap((result) => result.status === "rejected" ? [result.reason] : []);
	if (errors.length > 0) throw new AggregateError(errors, "Agent database resource cleanup failed");
});
function matchesAgentDatabaseClose(selection, resource) {
	return (selection.path === void 0 || selection.path === resource.path || resource.ownership === "unresolved" && matchesAgentDatabaseReadCandidatePath(resource, selection.path)) && (selection.rootPath === void 0 || isPathInside$1(selection.rootPath, resource.path) || resource.ownership === "unresolved" && matchesAgentDatabaseReadCandidatePath(resource, selection.rootPath)) && (selection.agentId === void 0 || resource.ownership === "unresolved" || selection.agentId === resource.agentId);
}
/** Retain discovery until the known owner is registered, then release this candidate. */
function registerOpenClawAgentDatabaseReadCandidateResource(resource) {
	return registerAgentDatabaseResource({
		...resource,
		ownership: "unresolved"
	});
}
function registerAgentDatabaseResource(resource, creationOptions) {
	const owned = {
		...resource,
		path: path.resolve(resource.path)
	};
	owned.cleanupOwner = captureAgentDeletionResourceOwner((target) => matchesAgentDatabaseClose(target, owned));
	assertAgentDatabaseResourceAdmission(owned);
	const releaseCreation = creationOptions && owned.ownership === "known" ? reserveAgentCreationClaimAdmission(owned, creationOptions, () => closeAgentDatabaseResource(owned)) : void 0;
	const unregister = () => {
		resources.active.delete(owned);
		releaseCreation?.();
	};
	getOpenClawDatabaseMaintenanceScope()?.own(unregister, "agent-resources", () => closeAgentDatabaseResource(owned));
	resources.active.add(owned);
	return unregister;
}
/** Fresh native opens and resource registrations share the same close custody. */
function assertAgentDatabaseResourceAdmission(owned) {
	if ([...resources.selections.keys()].some((selection) => matchesAgentDatabaseClose(selection, owned)) || [...resources.closing.keys()].some((closing) => (closing.path === owned.path || closing.ownership === "unresolved" && matchesAgentDatabaseReadCandidatePath(closing, owned.path) || owned.ownership === "unresolved" && matchesAgentDatabaseReadCandidatePath(owned, closing.path)) && (closing.ownership === "unresolved" || owned.ownership === "unresolved" || closing.agentId === owned.agentId))) throw new AgentDatabaseExecutionAdmissionClosedError(`Agent database resources are closing: ${owned.path}`);
}
function closeAgentDatabaseResource(resource, onCloseError) {
	if (resource.ownership === "known" && resource.closeSync) {
		resources.closing.set(resource, void 0);
		try {
			resource.revoke();
			resource.closeSync();
			resources.active.delete(resource);
			resources.closing.delete(resource);
			return Promise.resolve();
		} catch (error) {
			if (onCloseError) onCloseError(resource.path, error);
			const failed = Promise.reject(toErrorObject(error, "Agent database cleanup failed"));
			failed.catch(() => {});
			return failed;
		}
	}
	let operation = resources.closing.get(resource);
	if (!operation) {
		operation = Promise.resolve().then(() => resource.close());
		resources.closing.set(resource, operation);
		operation.then(() => {
			resources.active.delete(resource);
			resources.closing.delete(resource);
		}, () => {
			resources.closing.set(resource, void 0);
		}).catch(() => {});
	}
	if (onCloseError) operation.catch((error) => onCloseError(resource.path, error)).catch(() => {});
	resource.revoke();
	return operation;
}
//#endregion
//#region src/infra/sqlite-readonly-auth-schema.ts
/** Project live owner facts; never retain a closed database's schema in the child. */
function captureSqliteAuthSchema(pathname, expectedIdentity) {
	if (getSqliteDatabaseAdmissionIdentityForPath(pathname)?.key !== expectedIdentity) return;
	const schema = getOrLoadSqliteDatabaseAdmissionForPath(pathname, schemaAdmission, () => void 0);
	if (!schema) return;
	const kind = (name) => schema.tables.has(name) ? "table" : schema.views.has(name) || schema.indexes.has(name) || schema.triggers.has(name) ? "other" : "missing";
	return {
		userVersion: schema.userVersion,
		store: kind("auth_profile_store"),
		state: kind("auth_profile_state")
	};
}
//#endregion
//#region src/infra/json-field-transfer.ts
const JSON_FIELD_TRANSFER_BYTES = 65536;
function isJsonTransferField(field) {
	if (!isRecord(field)) return false;
	if (field.kind === "object" || field.kind === "array" || field.kind === "end") return true;
	return (field.kind === "key" || field.kind === "value") && (field.append === void 0 || field.append === true && typeof field.value === "string") && (typeof field.value === "string" || field.kind === "value" && (field.value === null || typeof field.value === "boolean" || typeof field.value === "number"));
}
function createJsonFieldReceiver() {
	let root;
	let hasRoot = false;
	const stack = [];
	let pending;
	const write = (value) => {
		const parent = stack.at(-1);
		if (parent) {
			if (parent.key === void 0) throw new Error("JSON field has no property key");
			Object.defineProperty(parent.container, parent.key, {
				value,
				writable: true,
				enumerable: true,
				configurable: true
			});
			parent.key = void 0;
		} else {
			if (hasRoot) throw new Error("JSON transfer has more than one root");
			root = value;
			hasRoot = true;
		}
	};
	const flush = () => {
		if (!pending) return;
		const value = pending.chunks.join("");
		if (pending.kind === "key") {
			const parent = stack.at(-1);
			if (!parent || parent.key !== void 0) throw new Error("JSON property key has no value or container");
			parent.key = value;
		} else write(value);
		pending = void 0;
	};
	return {
		accept(field) {
			if (!isJsonTransferField(field)) throw new Error("Invalid JSON transfer field");
			if (field.kind === "key" || field.kind === "value") {
				if (field.append) {
					if (!pending || pending.kind !== field.kind || typeof field.value !== "string") throw new Error("Invalid JSON string continuation");
					pending.chunks.push(field.value);
					return;
				}
				flush();
				if (typeof field.value === "string") pending = {
					kind: field.kind,
					chunks: [field.value]
				};
				else write(field.value);
			} else {
				flush();
				if (field.kind === "end") {
					const parent = stack.pop();
					if (!parent || parent.key !== void 0) throw new Error("JSON container ended with an incomplete field");
				} else {
					const container = field.kind === "array" ? [] : {};
					write(container);
					stack.push({ container });
				}
			}
		},
		finish() {
			flush();
			if (stack.length) throw new Error("JSON transfer ended with an incomplete container");
			return root;
		}
	};
}
//#endregion
//#region src/infra/sqlite-worker-transfer.ts
const SQLITE_WORKER_TRANSFER_FRAME_BYTES = 8388608;
/** One owned result cursor; callers supply records and any associated cleanup. */
function createSqliteWorkerTransferOwner() {
	let nextId = 0;
	let current;
	const cleanup = (transfer) => {
		const errors = [];
		for (const [completed, close] of [["iteratorClosed", () => transfer.iterator.return?.()], ["cleaned", () => transfer.cleanup?.()]]) if (!transfer[completed]) try {
			close();
			transfer[completed] = true;
		} catch (error) {
			errors.push(error);
		}
		throwSqliteLifecycleErrors(errors, "SQLite read transfer cleanup failed");
	};
	const cancel = () => {
		if (current) {
			cleanup(current);
			current = void 0;
		}
	};
	const requireTransfer = (id) => {
		if (!current || current.id !== id) throw new Error("SQLite read transfer is no longer active");
		return current;
	};
	return {
		start(iterator, options) {
			if (current) throw new Error("The preceding SQLite read transfer was not released");
			current = {
				id: ++nextId,
				iterator,
				cleanup: options.cleanup,
				iteratorClosed: false,
				cleaned: false,
				counts: new Map(options.kinds.map((kind) => [kind, 0])),
				sequence: 0,
				finished: false
			};
			return {
				id: current.id,
				kinds: [...current.counts.keys()]
			};
		},
		next(id) {
			const transfer = requireTransfer(id);
			if (transfer.finished) throw new Error("SQLite read transfer has already reached its end");
			if (transfer.record && transfer.record.offset === transfer.record.bytes.byteLength) transfer.record = void 0;
			if (!transfer.record) {
				const next = transfer.iterator.next();
				if (next.done) {
					cleanup(transfer);
					transfer.finished = true;
					return {
						id,
						sequence: transfer.sequence++,
						done: true,
						counts: [...transfer.counts]
					};
				}
				const { kind } = next.value;
				const count = transfer.counts.get(kind);
				if (count === void 0) throw new Error("SQLite read transfer returned an unexpected record kind");
				transfer.record = {
					kind,
					bytes: "serialized" in next.value ? next.value.serialized : serialize(next.value.value),
					offset: 0
				};
				transfer.counts.set(kind, count + 1);
			}
			const record = transfer.record;
			const offset = record.offset;
			const end = Math.min(record.bytes.byteLength, offset + SQLITE_WORKER_TRANSFER_FRAME_BYTES);
			record.offset = end;
			return {
				id,
				sequence: transfer.sequence++,
				done: false,
				kind: record.kind,
				recordBytes: record.bytes.byteLength,
				offset,
				recordDone: end === record.bytes.byteLength,
				bytes: new Uint8Array(record.bytes.subarray(offset, end))
			};
		},
		end(id) {
			if (!requireTransfer(id).finished) throw new Error("SQLite read transfer ended before its complete result");
			cancel();
		},
		cancel,
		close: cancel
	};
}
/** Reassembles one transfer; its caller owns transport completion and cancellation. */
function createSqliteWorkerTransferReceiver(handle, consume) {
	const counts = new Map(handle.kinds.map((kind) => [kind, 0]));
	let sequence = 0;
	let finished = false;
	let record;
	return { accept(frame) {
		try {
			if (finished || frame.id !== handle.id || frame.sequence !== sequence++) throw new Error("SQLite read transfer frame is out of order");
			if (frame.done) {
				if (record || frame.counts.length !== counts.size || frame.counts.some(([kind, count]) => counts.get(kind) !== count) || new Set(frame.counts.map(([kind]) => kind)).size !== counts.size) throw new Error("SQLite read transfer ended with an incomplete result");
				finished = true;
				return frame.counts;
			}
			const count = counts.get(frame.kind);
			if (count === void 0 || !Number.isSafeInteger(frame.recordBytes) || frame.recordBytes < 1 || !Number.isSafeInteger(frame.offset) || frame.offset < 0 || frame.bytes.byteLength < 1 || frame.bytes.byteLength > 8388608) throw new Error("SQLite read transfer returned an invalid frame");
			if (!record) {
				if (frame.offset !== 0) throw new Error("SQLite read transfer omitted the start of a record");
				record = {
					kind: frame.kind,
					bytes: new Uint8Array(frame.recordBytes),
					offset: 0
				};
			}
			const end = frame.offset + frame.bytes.byteLength;
			if (record.kind !== frame.kind || record.bytes.byteLength !== frame.recordBytes || record.offset !== frame.offset || end > frame.recordBytes || frame.recordDone !== (end === frame.recordBytes)) throw new Error("SQLite read transfer returned a discontinuous record");
			record.bytes.set(frame.bytes, frame.offset);
			record.offset = end;
			if (frame.recordDone) {
				const value = deserialize(record.bytes);
				const kind = record.kind;
				record = void 0;
				consume({
					kind,
					value
				});
				counts.set(kind, count + 1);
			}
			return;
		} catch (error) {
			record = void 0;
			finished = true;
			throw error;
		}
	} };
}
//#endregion
//#region src/infra/sqlite-readonly-auth-transfer.ts
function decodeFrame(value, label) {
	if (!isRecord(value) || typeof value.id !== "number" || !Number.isSafeInteger(value.id) || typeof value.sequence !== "number" || !Number.isSafeInteger(value.sequence)) throw new Error(`Invalid ${label} transfer frame`);
	const { id, sequence } = value;
	if (value.done === true && Array.isArray(value.counts)) {
		const counts = [];
		for (const entry of value.counts) {
			if (!Array.isArray(entry) || entry.length !== 2 || typeof entry[0] !== "string" || typeof entry[1] !== "number" || !Number.isSafeInteger(entry[1]) || entry[1] < 0) throw new Error(`Invalid ${label} transfer counts`);
			counts.push([entry[0], entry[1]]);
		}
		return {
			id,
			sequence,
			done: true,
			counts
		};
	}
	if (value.done !== false || typeof value.kind !== "string" || typeof value.recordBytes !== "number" || typeof value.offset !== "number" || typeof value.recordDone !== "boolean" || typeof value.bytes !== "string" || value.bytes.length > 4 * Math.ceil(8388608 / 3)) throw new Error(`Invalid ${label} transfer bytes`);
	const bytes = Buffer.from(value.bytes, "base64");
	if (bytes.toString("base64") !== value.bytes) throw new Error(`Invalid ${label} transfer encoding`);
	return {
		id,
		sequence,
		done: false,
		kind: value.kind,
		recordBytes: value.recordBytes,
		offset: value.offset,
		recordDone: value.recordDone,
		bytes
	};
}
function createSqliteReadOnlyTransferReceiver(options) {
	let receiver;
	let transferId;
	let ending = false;
	let completed = false;
	return { accept(value) {
		if (!isRecord(value) || completed) throw new Error(`Invalid ${options.label} transfer response`);
		if (value.type === "start" && !receiver) {
			const handle = value.handle;
			if (!isRecord(handle) || typeof handle.id !== "number" || !Number.isSafeInteger(handle.id) || handle.id < 1 || !Array.isArray(handle.kinds) || handle.kinds.length !== options.kinds.length || handle.kinds.some((kind, index) => kind !== options.kinds[index])) throw new Error(`Invalid ${options.label} transfer handle`);
			transferId = handle.id;
			receiver = createSqliteWorkerTransferReceiver({
				id: transferId,
				kinds: options.kinds
			}, ({ kind, value: record }) => options.acceptRecord(kind, record));
			return { request: {
				type: "next",
				transferId
			} };
		}
		if (!receiver || transferId === void 0) throw new Error(`${options.label.charAt(0).toUpperCase()}${options.label.slice(1)} transfer has not started`);
		if (value.type === "frame" && !ending) {
			const frame = decodeFrame(value.frame, options.label);
			if (!frame.done && options.maxRecordBytes && frame.recordBytes > options.maxRecordBytes) throw new Error(`${options.label} transfer record exceeds its bound`);
			const counts = receiver.accept(frame);
			if (counts) {
				if (counts.length !== options.kinds.length || counts.some(([, count]) => count < 1)) throw new Error(`Incomplete ${options.label} transfer result`);
				ending = true;
			}
			return { request: {
				type: ending ? "end" : "next",
				transferId
			} };
		}
		if (value.type === "complete" && ending) {
			completed = true;
			return { value: options.readResult() };
		}
		throw new Error(`${options.label.charAt(0).toUpperCase()}${options.label.slice(1)} transfer response is out of order`);
	} };
}
function createSqliteAuthTransferReceiver() {
	const receiver = createJsonFieldReceiver();
	return createSqliteReadOnlyTransferReceiver({
		kinds: ["fields"],
		label: "auth profile",
		maxRecordBytes: JSON_FIELD_TRANSFER_BYTES,
		acceptRecord(_kind, batch) {
			if (!Array.isArray(batch)) throw new Error("Invalid auth profile field batch");
			for (const field of batch) receiver.accept(field);
		},
		readResult() {
			const rows = receiver.finish();
			if (!isRecord(rows) || !("store" in rows) || !("state" in rows) || typeof rows.cacheable !== "boolean") throw new Error("Invalid auth profile transfer rows");
			return {
				store: rows.store,
				state: rows.state,
				cacheable: rows.cacheable
			};
		}
	});
}
function createSqliteOperationTransferReceiver(operation) {
	let result;
	return createSqliteReadOnlyTransferReceiver({
		kinds: ["result"],
		label: "SQLite operation",
		acceptRecord(_kind, record) {
			if (result || !isRecord(record) || record.operation !== operation || !("value" in record)) throw new Error("SQLite read-only worker returned a different or duplicate operation");
			result = {
				operation,
				value: record.value
			};
		},
		readResult() {
			if (!result) throw new Error("SQLite read-only worker returned no operation");
			return result;
		}
	});
}
//#endregion
//#region src/infra/private-directory-creation.ts
const refusedCreations = /* @__PURE__ */ new WeakSet();
/** Record a completed native refusal without replacing its semantic code, diagnostics, or identity. */
function markPrivateDirectoryCreationRefused(error) {
	if (error !== null && typeof error === "object") refusedCreations.add(error);
	return error;
}
function isPrivateDirectoryCreationRefused(error) {
	return error !== null && typeof error === "object" && refusedCreations.has(error);
}
//#endregion
//#region src/infra/sqlite-readonly-worker-protocol.ts
const SQLITE_READONLY_WORKER_MAX_BUFFER = 1048576;
function isSqliteSnapshotStagingMode(mode) {
	return mode === "staging-create" || mode === "staging-create-legacy" || mode === "staging-reconcile" || mode === "staging-retire";
}
var SqliteReadOnlyInspectionContentionError = class extends Error {};
function sqliteReadOnlyWorkerRequestArgs(pathname, options) {
	const args = [options.mode, path.resolve(pathname)];
	const stagingRoot = options.stagingRoot && path.resolve(options.stagingRoot);
	const expected = options.mode === "auth-profile-rows" || options.mode === "operation" ? void 0 : options.expectedSourceIdentity;
	if (expected !== void 0) {
		if (options.mode !== "sync") throw new Error("SQLite source identity is supported only for artifact-preserving sync copies");
		args.push(stagingRoot ?? "", JSON.stringify(readDatabaseFileIdentity(expected)));
	} else if (stagingRoot) args.push(stagingRoot);
	return args;
}
function isSqliteReadOnlyWorkerResult(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	if (Object.keys(value).length !== 2 || !("ok" in value)) return false;
	return value.ok === true && "location" in value && typeof value.location === "string" || value.ok === true && "contentVersion" in value && typeof value.contentVersion === "string" && /^(?:[a-f0-9]{64})?$/.test(value.contentVersion) || value.ok === true && "generation" in value && typeof value.generation === "string" || value.ok === true && "warnings" in value && Array.isArray(value.warnings) && value.warnings.every((warning) => typeof warning === "string") || value.ok === false && "message" in value && typeof value.message === "string";
}
function createSqliteReadOnlyWorkerError(message, stderr, options) {
	const stderrTail = toUSVString(sliceUtf16Safe(stderr.trim(), -4e3));
	return new Error(`SQLite read-only worker ${message}${stderrTail ? `\nstderr (tail): ${stderrTail}` : ""}`, options);
}
function parseSqliteReadOnlyWorkerResult(stdout, stderr) {
	if (!stdout.trim()) throw createSqliteReadOnlyWorkerError("returned no JSON result", stderr);
	let message;
	try {
		message = JSON.parse(stdout);
	} catch {
		throw createSqliteReadOnlyWorkerError("returned invalid JSON", stderr);
	}
	if (!isSqliteReadOnlyWorkerResult(message)) throw createSqliteReadOnlyWorkerError("returned an invalid result", stderr);
	return message;
}
function readSqliteReadOnlyWorkerValue(params, mode) {
	if (params.kind === "launch-failed") throw params.error;
	let result;
	try {
		result = parseSqliteReadOnlyWorkerResult(params.stdout, params.stderr);
	} catch (error) {
		if (params.failure) throw createSqliteReadOnlyWorkerError(params.failure, params.stderr, { cause: params.cause });
		throw error;
	}
	if (params.status !== 0 || params.failure || !result.ok) {
		const contention = !result.ok && result.message.startsWith("Retryable SQLite inspection contention: ");
		const message = !result.ok ? contention ? result.message.slice(40) : result.message : params.failure ?? `exited with code ${params.status}`;
		const allocationRefused = params.failure === void 0 && !result.ok && (mode === "staging-create" || mode === "staging-create-legacy") && message.startsWith("SQLite snapshot directory creation refused: ");
		const error = createSqliteReadOnlyWorkerError(allocationRefused ? message.slice(44) : message, params.stderr, { cause: params.cause });
		if (contention) {
			const failure = new SqliteReadOnlyInspectionContentionError(error.message);
			throw allocationRefused ? markPrivateDirectoryCreationRefused(failure) : failure;
		}
		throw error;
	}
	if ((mode === "sync" || mode === "async" || mode === "consolidated" || isSqliteSnapshotStagingMode(mode)) && "location" in result) return result.location;
	if (mode === "content-version" && "contentVersion" in result) return result.contentVersion;
	if ((mode === "file-generation" || mode === "update-generation") && "generation" in result) return result.generation;
	if (mode === "reclaim" && "warnings" in result) return result.warnings;
	throw createSqliteReadOnlyWorkerError("returned a result for a different operation", params.stderr);
}
//#endregion
//#region src/infra/sqlite-readonly-worker-session.ts
function isSameSqliteReadOnlyWorkerLaunch(captured, requested) {
	const keys = Object.keys(requested.env);
	return captured.runtimeGeneration === requested.runtimeGeneration && captured.transport.kind === requested.transport.kind && (captured.transport.kind === "native" || requested.transport.kind === "broker" && captured.transport.owner === requested.transport.owner) && requested.cwd === captured.cwd && keys.length === Object.keys(captured.env).length && keys.every((key) => requested.env[key] === captured.env[key]);
}
function createSqliteReadOnlyWorkerSession(host) {
	const env = { ...host.env };
	const cwd = host.cwd;
	const executable = process.execPath;
	const transport = host.transport.kind === "broker" ? {
		kind: "broker",
		owner: host.transport.owner
	} : { kind: "native" };
	const capturedLaunch = {
		env,
		cwd,
		transport,
		runtimeGeneration: host.runtimeGeneration
	};
	const argv = [...host.argv];
	const spawnOptions = {
		env,
		...transport.kind === "native" && cwd === tryProcessCwd() ? {} : { cwd },
		stdio: [
			"ignore",
			"pipe",
			"pipe",
			"ipc"
		],
		windowsHide: true
	};
	const child = transport.kind === "broker" ? transport.owner.spawn(executable, argv, spawnOptions) : spawn(executable, argv, spawnOptions);
	recordChildProcessSpawn(executable, child, host.pooledRead ? `sqlite.scoped-read.${transport.kind}` : `sqlite.session.${transport.kind}`);
	const setIdle = (idle) => {
		if (transport.kind !== "native") return;
		const method = idle ? "unref" : "ref";
		child[method]();
		child.channel?.[method]?.();
		for (const stream of [child.stdout, child.stderr]) if (stream instanceof Socket) stream[method]();
	};
	let retired = false;
	let sequence = 0;
	let pendingOperation;
	let stderr = "";
	let outputBytes = 0;
	let pending;
	const { promise: closeSignal, resolve: resolveClosed } = createDeferredCore();
	const authReaderResources = /* @__PURE__ */ new Map();
	const closed = closeSignal.then(async () => {
		if (transport.kind === "broker" && child instanceof BrokerChild && !child.notStarted && child.exitCode === null && child.signalCode === null) await transport.owner.waitForCleanup();
		for (const unregister of authReaderResources.values()) unregister();
		authReaderResources.clear();
	});
	const retire = (error) => {
		setIdle(false);
		retired = true;
		if (pending && error !== void 0) pending.failure ??= error;
		child.kill("SIGKILL");
	};
	const sendMessage = (message) => child.send(message, (error) => {
		if (error) retire(error);
	});
	const releasePending = (request) => {
		pending = void 0;
		pendingOperation = void 0;
		request.cleanup();
		if (host.pooledRead) {
			for (const unregister of authReaderResources.values()) unregister();
			authReaderResources.clear();
		}
		return request;
	};
	if (host.retainLifetime !== false) retainSnapshotWork(closed, () => retire(/* @__PURE__ */ new Error("SQLite snapshot owner stopped")));
	let spawned = false;
	let nativeClosed = false;
	child.once("spawn", () => {
		spawned = true;
	});
	child.on("error", (error) => retire(spawned ? error : Object.assign(new Error([[
		"EACCES",
		"ENOENT",
		"EPERM"
	].includes(error.code ?? "") ? `SQLite read-only worker runtime binary not executable: ${executable} (${error.code}, cwd ${cwd}). Check runtime execute permissions and access to the working directory` : `SQLite read-only worker failed to start (executable ${executable}, cwd ${cwd})`, error.message].join(": "), { cause: error }), { code: error.code })));
	child.once("close", (code, signal) => {
		nativeClosed = true;
		retired = true;
		if (pending) {
			const request = releasePending(pending);
			request.reject(request.failure ?? createSqliteReadOnlyWorkerError(`exited with ${signal ? `signal ${signal}` : `code ${code}`}`, stderr));
		}
		resolveClosed();
	});
	const captureOutput = (data, isStderr) => {
		outputBytes += data.length;
		if (isStderr) stderr = sliceUtf16Safe(stderr + data.toString("utf8"), -4e3);
		if (outputBytes > 1048576) retire(createSqliteReadOnlyWorkerError("exceeded its output buffer", stderr));
	};
	const attachOutput = () => {
		child.stdout?.on("data", (data) => captureOutput(data, false));
		child.stderr?.on("data", (data) => captureOutput(data, true));
	};
	const ready = child instanceof BrokerChild ? child.ready().then(attachOutput).catch(retire) : void 0;
	if (!ready) attachOutput();
	child.on("message", (message) => {
		if (retired) return;
		if (!pending || !message || typeof message !== "object" || Object.keys(message).length !== 2 || !("id" in message) || message.id !== pending.id || !("result" in message)) {
			retire(createSqliteReadOnlyWorkerError("returned an unexpected response", stderr));
			return;
		}
		try {
			let value;
			if (pending.transfer && !(typeof message.result === "object" && message.result !== null && "ok" in message.result && message.result.ok === false)) {
				const reply = pending.transfer.accept(message.result);
				if ("request" in reply) {
					sendMessage({
						id: pending.id,
						transfer: reply.request
					});
					return;
				}
				value = reply.value;
			} else value = readSqliteReadOnlyWorkerValue({
				kind: "launched",
				stdout: JSON.stringify(message.result),
				stderr,
				status: 0
			}, pending.mode);
			releasePending(pending).resolve(value);
		} catch (error) {
			if (pending && host.retainOnOperationError && isSqliteSnapshotStagingMode(pending.mode) && isSqliteReadOnlyWorkerResult(message.result) && !message.result.ok) {
				releasePending(pending).reject(error);
				return;
			}
			retire(error);
		}
	});
	const session = {
		closed,
		isRetired() {
			return retired;
		},
		get notStarted() {
			return child instanceof BrokerChild ? child.notStarted : nativeClosed && !spawned;
		},
		createNativeReplacement() {
			return runInDetachedAsyncContext(() => createSqliteReadOnlyWorkerSession({
				...host,
				env,
				cwd,
				argv,
				transport: { kind: "native" }
			}));
		},
		compatible(launch) {
			return !retired && isSameSqliteReadOnlyWorkerLaunch(capturedLaunch, launch);
		},
		run(pathname, options) {
			if (retired) return Promise.reject(/* @__PURE__ */ new Error("SQLite read-only worker is closed"));
			if (options.mode === "auth-profile-rows" && options.source === "canonical" && !options.artifactPreserving) {
				const databasePath = path.resolve(pathname);
				if (!authReaderResources.has(databasePath)) authReaderResources.set(databasePath, registerOpenClawAgentDatabaseReadCandidateResource({
					path: databasePath,
					revoke: () => retire(/* @__PURE__ */ new Error("Auth profile reader owner was revoked")),
					close: () => session.close()
				}));
			}
			return pendingOperation = new Promise((resolve, reject) => {
				const { timeoutMs, size } = host.readBudget(pathname);
				stderr = "";
				outputBytes = 0;
				const abort = () => retire(options.signal?.reason);
				const timer = host.deadlineOwnedByCaller() ? void 0 : setTimeout(() => retire(host.timeoutError(pathname, timeoutMs, size)), timeoutMs);
				const id = ++sequence;
				pending = {
					id,
					mode: options.mode,
					...options.mode === "auth-profile-rows" ? { transfer: createSqliteAuthTransferReceiver() } : options.mode === "operation" ? { transfer: createSqliteOperationTransferReceiver(options.command.type) } : {},
					resolve,
					reject,
					cleanup: () => {
						clearTimeout(timer);
						options.signal?.removeEventListener("abort", abort);
					}
				};
				options.signal?.addEventListener("abort", abort, { once: true });
				if (options.signal?.aborted) {
					abort();
					return;
				}
				const send = () => {
					if (retired) return;
					try {
						const request = {
							id,
							args: host.requestArgs(pathname, options),
							...options.mode === "auth-profile-rows" || options.mode === "operation" ? { [options.mode === "operation" ? "operation" : "auth"]: {
								expectedIdentity: options.expectedIdentity,
								artifactPreserving: options.artifactPreserving,
								...options.mode === "operation" ? { command: serialize(options.command).toString("base64") } : {
									retainReader: !host.pooledRead && options.source === "canonical" && !options.artifactPreserving,
									schema: options.source === "canonical" && !options.artifactPreserving ? captureSqliteAuthSchema(pathname, options.expectedIdentity) : void 0
								}
							} } : {}
						};
						if (options.mode === "operation" && Buffer.byteLength(JSON.stringify(request)) > 1048576) throw new Error("SQLite read-only operation exceeded its request buffer");
						sendMessage(request);
					} catch (error) {
						retire(error);
					}
				};
				if (ready) ready.then(send);
				else send();
			});
		},
		setIdle,
		async close() {
			session.setIdle(false);
			if (retired) {
				await closed;
				return;
			}
			retired = true;
			const timer = setTimeout(() => retire(), host.closeTimeoutMs);
			try {
				sendMessage("close");
			} catch (error) {
				retire(error);
			}
			try {
				await closed;
			} finally {
				clearTimeout(timer);
			}
		}
	};
	host.runtimeGeneration?.retain(session, async () => {
		await pendingOperation?.catch(() => void 0);
		return () => session.close();
	});
	return session;
}
//#endregion
//#region src/infra/diagnostic-flags.ts
const DIAGNOSTICS_ENV = "OPENCLAW_DIAGNOSTICS";
/** Resolves enabled diagnostic flags from config plus `OPENCLAW_DIAGNOSTICS` overrides. */
function resolveDiagnosticFlags(cfg, env = process.env) {
	const configFlags = Array.isArray(cfg?.diagnostics?.flags) ? cfg?.diagnostics?.flags : [];
	const envFlags = parseDiagnosticEnvFlags(env[DIAGNOSTICS_ENV]);
	if (envFlags.disablesAll) return [];
	return normalizeUniqueStringEntriesLower([...configFlags, ...envFlags.flags]);
}
/** Returns whether a diagnostic flag is enabled after config/env resolution. */
function isDiagnosticFlagEnabled(flag, cfg, env = process.env) {
	const enabledFlags = resolveDiagnosticFlags(cfg, env);
	const target = normalizeLowercaseStringOrEmpty(flag);
	if (!target) return false;
	for (const enabled of enabledFlags) {
		if (enabled === "*" || enabled === "all" || enabled === target) return true;
		if (enabled.endsWith(".*") && target === enabled.slice(0, -2)) return true;
		if (enabled.endsWith("*") && target.startsWith(enabled.slice(0, -1))) return true;
	}
	return false;
}
//#endregion
//#region src/infra/sqlite-worker-request-class.ts
const operations = [
	"admit",
	"audit.events.list",
	"audit.writer.process",
	"audit.writer.prune",
	"database.domain.bind",
	"database.domain.close",
	"database.domain.publish",
	"database.inspectIdle",
	"database.prepareWrite",
	"database.walMaintenance",
	"stateLease.acquire",
	"stateLease.release",
	"stateLease.renew",
	"stateLease.verify"
];
const families = [
	"acp",
	"acpSessions",
	"agentDatabaseDeletion",
	"agentDatabaseRegistry",
	"agentDatabases",
	"agentDeletionJournal",
	"agentProvenance",
	"apns",
	"audit",
	"authProfiles",
	"backup",
	"bootstrap",
	"capture",
	"channelIngress",
	"clawProvenance",
	"claws",
	"config",
	"conversation",
	"conversationBindings",
	"database",
	"deliveryQueue",
	"deviceAuth",
	"deviceIdentity",
	"devicePairing",
	"diagnostic",
	"doctor",
	"exec-approvals",
	"execApprovals",
	"generatedHtmlProvenance",
	"githubPublication",
	"githubRepository",
	"legacyMcpOAuth",
	"localWorkspace",
	"managedImages",
	"mcpOAuth",
	"mentions",
	"modelCatalog",
	"nativeHookRelay",
	"node",
	"nodeHost",
	"nodeWorker",
	"onboardingRecommendations",
	"operator",
	"operatorApprovals",
	"pairing",
	"placementJournals",
	"placementTools",
	"placementTranscript",
	"placementTurns",
	"pluginBlob",
	"pluginModelCatalogCredentials",
	"plugins",
	"preparedPoolPresence",
	"projects",
	"promotions",
	"repositoryWorkspaces",
	"restartSentinel",
	"sandboxRegistry",
	"secrets",
	"sessionDelivery",
	"sessionGroups",
	"sessionRepositoryWorkspaces",
	"sessionState",
	"sessionUpstream",
	"skillLibrary",
	"skillUploads",
	"skills",
	"stateLease",
	"subagents",
	"telemetry",
	"tts",
	"tui",
	"updateRuns",
	"usageCache",
	"userModelAccounts",
	"userPreferences",
	"userProfiles",
	"webPush",
	"workerEnvironments",
	"workerInference",
	"workerPlacements",
	"workers",
	"workspace",
	"workshop",
	"worktrees"
];
const sqliteWorkerRequestClasses = /* @__PURE__ */ new Set([...operations, ...families]);
function classifySqliteWorkerExecute(commandType) {
	if (sqliteWorkerRequestClasses.has(commandType)) return commandType;
	const separator = commandType.indexOf(".");
	const family = separator === -1 ? commandType : commandType.slice(0, separator);
	return sqliteWorkerRequestClasses.has(family) ? family : "execute";
}
//#endregion
//#region src/infra/worker-request-diagnostics.ts
const reservations = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerReservationObservation"), () => new AsyncLocalStorage());
const detailedTiming = isDiagnosticFlagEnabled("sqlite.worker-timing");
const coreCommands = /* @__PURE__ */ new Set([
	"session.actor.read",
	"session.actor.acceptInput",
	"session.actor.adoptRun",
	"session.actor.appendToolResult",
	"session.actor.appendTranscriptEvent",
	"session.actor.completeTurn",
	"session.actor.deliveryPending",
	"session.actor.deliverySettled",
	"session.actor.patch",
	"session.entry.read",
	"session.entry.patch.prepare",
	"session.entry.patch.commit",
	"session.entry.replacements.prepare",
	"session.entry.replacements.commit",
	"session.lifecycle.project",
	"session.maintenance.metadata",
	"session.maintenance.prepare",
	"session.maintenance.release",
	"session.maintenance.finalize",
	"session.maintenance.size",
	"session.rowTranscript.backfill",
	"usageCache.writeRollup",
	"usageCache.prune",
	"trajectory.events.append",
	"trajectory.retention.begin",
	"trajectory.retention.delete",
	"session.pendingInputs.read",
	"session.pendingInputs.mutate",
	"session.turn.prepare",
	"session.turn.commit",
	"transcript.prepare",
	"transcript.commit"
]);
const projectionCommands = /* @__PURE__ */ new Map([
	["preflight", "transcript-projection.preflight"],
	["sweep", "transcript-projection.sweep"],
	["claim", "transcript-projection.claim"],
	["deleteChunk", "transcript-projection.deleteChunk"],
	["appendChunk", "transcript-projection.appendChunk"],
	["finalize", "transcript-projection.finalize"]
]);
const projectionModuleSuffixes = ["/config/sessions/session-transcript-projection-publication.worker.js", "/config/sessions/session-transcript-projection-publication.worker.ts"];
const requestPrefixes = [
	["pluginState.", "plugin_state"],
	["session.history.", "transcript_read"],
	["trajectory.", "transcripts"],
	["session.transcript.", "transcripts"],
	["transcripts.", "transcripts"],
	["session.", "sessions"],
	["cron.", "cron"]
];
function classifyWorkerRequest(commandType, commandInput) {
	if (typeof commandType !== "string") return "execute";
	if (coreCommands.has(commandType)) return commandType;
	if (commandType === "auth-profile-rows") return "auth_profiles";
	if (commandType === "database.domain.execute" || commandType === "database.domain.publish") {
		const publication = isRecord(commandInput) ? commandInput : void 0;
		const inner = publication && isRecord(publication.command) ? publication.command : void 0;
		const moduleUrl = publication?.moduleUrl;
		if (commandType === "database.domain.publish" && typeof moduleUrl === "string" && typeof inner?.type === "string" && projectionModuleSuffixes.some((suffix) => moduleUrl.endsWith(suffix))) {
			const projection = projectionCommands.get(inner.type);
			if (projection) return projection;
		}
		const label = inner ? classifyWorkerRequest(inner.type) : "execute";
		return label === "execute" ? "domain_execute" : label;
	}
	for (const [prefix, requestClass] of requestPrefixes) if (commandType.startsWith(prefix)) return requestClass;
	return classifySqliteWorkerExecute(commandType);
}
const queued = resolveGlobalSingleton(Symbol.for("openclaw.workerRequestQueueDepth"), () => /* @__PURE__ */ new Map());
const requestClasses = /* @__PURE__ */ new Set([
	...coreCommands,
	...projectionCommands.values(),
	...sqliteWorkerRequestClasses,
	...requestPrefixes.map(([, requestClass]) => requestClass),
	"task",
	"open",
	"close",
	"execute",
	"domain_execute",
	"auth_profiles"
]);
/** One observation follows a request across admission retries and cancellation. */
function trackWorkerRequest(kind, requestClass, queuedSignal) {
	const label = requestClasses.has(requestClass) ? requestClass : "other";
	const reservation = kind === "sqlite_writer" ? reservations.getStore() : void 0;
	const enqueuedAt = performance.now();
	const timing = kind === "sqlite_writer" && (detailedTiming || hasInternalDiagnosticEventInterest("worker.request")) ? { enqueued: enqueuedAt } : void 0;
	let startedAt;
	let completed = false;
	const emit = (phase, durations = {}) => {
		if (!hasInternalDiagnosticEventInterest("worker.request")) return;
		emitTrustedDiagnosticEvent({
			type: "worker.request",
			kind,
			requestClass: label,
			phase,
			queueDepth: queued.get(kind) ?? 0,
			...durations,
			...phase === "completed" && timing ? { timing } : {}
		});
	};
	const dequeue = () => queued.set(kind, (queued.get(kind) ?? 0) - 1);
	queued.set(kind, (queued.get(kind) ?? 0) + 1);
	emit("queued");
	const observation = {
		timing,
		...reservation ? { recordTransactions: (count) => {
			reservation.transactionCount = (reservation.transactionCount ?? 0) + count;
		} } : {},
		started: () => {
			if (completed || startedAt !== void 0) return;
			startedAt = performance.now();
			if (reservation) reservation.operations.add(reservation.operations.has(label) || reservation.operations.size < 8 ? label : "other");
			if (timing) timing.dispatched = startedAt;
			queuedSignal?.removeEventListener("abort", observation.completed);
			dequeue();
			emit("started", { queueWaitMs: startedAt - enqueuedAt });
		},
		completed: () => {
			if (completed) return;
			completed = true;
			queuedSignal?.removeEventListener("abort", observation.completed);
			if (startedAt === void 0) dequeue();
			emit("completed", startedAt === void 0 ? {} : { durationMs: performance.now() - startedAt });
		}
	};
	queuedSignal?.addEventListener("abort", observation.completed, { once: true });
	if (queuedSignal?.aborted) observation.completed();
	return observation;
}
//#endregion
//#region src/infra/sqlite-readonly-worker-pool.ts
const log$6 = createSubsystemLogger("state/sqlite");
function trackSqliteRead(options) {
	return trackWorkerRequest("sqlite_read", classifyWorkerRequest(options.mode === "operation" ? options.command.type : options.mode), options.signal);
}
function createSqliteReadOnlyWorkerPool(createSession) {
	const scopedReadWorkers = [];
	const SCOPED_READ_WORKER_LIMIT = 4;
	const SCOPED_READ_WORKER_IDLE_MS = 6e4;
	const statefulReadWorkers = /* @__PURE__ */ new WeakMap();
	const readWorkerReleaseWaiters = /* @__PURE__ */ new Set();
	const closingBrokers = /* @__PURE__ */ new WeakSet();
	const assertBrokerOpen = (launch) => {
		if (launch.transport.kind === "broker" && closingBrokers.has(launch.transport.owner)) throw new Error("SQLite read-only worker broker is closing");
	};
	async function closeSlot(slot) {
		const worker = slot.session;
		try {
			await worker?.close();
			slot.session = void 0;
		} catch (error) {
			slot.quarantined = { error };
			for (const released of readWorkerReleaseWaiters) released();
			throw error;
		}
	}
	async function selectScopedReadWorker(options, launch) {
		assertBrokerOpen(launch);
		const stateful = options.mode === "operation" && (options.command.type === "pageCache.begin" || options.command.type === "pageCache.step");
		const scope = readOnlyWorkerScope.getStore();
		if (stateful) {
			if (!scope?.active) throw new Error("Database page-cache warm requires an active read-only worker scope");
			const retained = statefulReadWorkers.get(scope);
			if (retained) {
				if (!isSameSqliteReadOnlyWorkerLaunch(retained.launch, launch)) throw new Error("Database page-cache warm worker launch changed during its scope");
				return retained;
			}
			if (options.command.type === "pageCache.step") throw new Error("Database page-cache warm is no longer active");
		}
		for (;;) {
			assertBrokerOpen(launch);
			options.signal?.throwIfAborted();
			const available = scopedReadWorkers.filter((candidate) => !candidate.leased && !candidate.quarantined);
			let slot = available.find((candidate) => isSameSqliteReadOnlyWorkerLaunch(candidate.launch, launch));
			if (!slot && scopedReadWorkers.length < SCOPED_READ_WORKER_LIMIT) {
				slot = {
					launch,
					tail: Promise.resolve(),
					queued: 0
				};
				scopedReadWorkers.push(slot);
			}
			slot ??= available.find((candidate) => candidate.queued === 0 && !candidate.session);
			slot ??= available.reduce((best, candidate) => !best || candidate.queued < best.queued ? candidate : best, void 0);
			if (slot) {
				if (stateful && scope) {
					const retained = slot;
					const lease = { started: false };
					retained.leased = lease;
					statefulReadWorkers.set(scope, retained);
					scope.releaseReadWorker = async () => {
						try {
							if (lease.started) {
								await retained.tail;
								await closeSlot(retained);
							}
						} finally {
							retained.leased = void 0;
							statefulReadWorkers.delete(scope);
							scope.releaseReadWorker = void 0;
							if (!retained.quarantined && retained.queued === 0 && retained.session && !retained.session.isRetired()) {
								retained.session.setIdle(true);
								armScopedReadWorkerIdle(retained);
							}
							for (const released of readWorkerReleaseWaiters) released();
						}
					};
				}
				return slot;
			}
			if (scopedReadWorkers.every((candidate) => candidate.quarantined)) throw new AggregateError(scopedReadWorkers.map((candidate) => candidate.quarantined?.error), "SQLite read-only worker capacity is held by unconfirmed cleanup");
			let released;
			const availableWorker = runInDetachedAsyncContext(() => new Promise((resolve) => {
				released = resolve;
			}));
			readWorkerReleaseWaiters.add(released);
			try {
				await racePromiseWithAbortSignal(availableWorker, options.signal, (signal) => signal.reason);
			} finally {
				readWorkerReleaseWaiters.delete(released);
			}
		}
	}
	function retireIdleSlot(slot) {
		clearTimeout(slot.idle);
		const closing = runInDetachedAsyncContext(() => closeSlot(slot));
		slot.tail = closing.catch(() => {
			log$6.warn("Idle SQLite read-only worker cleanup failed");
		});
		return closing;
	}
	function armScopedReadWorkerIdle(slot) {
		if (slot.launch.transport.kind === "broker" && closingBrokers.has(slot.launch.transport.owner)) {
			retireIdleSlot(slot);
			return;
		}
		slot.idle = runInDetachedAsyncContext(() => setTimeout(() => {
			retireIdleSlot(slot);
		}, SCOPED_READ_WORKER_IDLE_MS));
		slot.idle.unref();
	}
	return {
		run: async function runSqliteScopedReadWorker(pathname, options, launch, observation = trackSqliteRead(options)) {
			const stateful = options.mode === "operation" && (options.command.type === "pageCache.begin" || options.command.type === "pageCache.step");
			let selected;
			try {
				selected = await selectScopedReadWorker(options, launch);
				assertBrokerOpen(launch);
			} catch (error) {
				observation.completed();
				throw error;
			}
			clearTimeout(selected.idle);
			selected.queued++;
			const previous = selected.tail;
			const operation = runInDetachedAsyncContext(() => racePromiseWithAbortSignal(previous, options.signal, (signal) => signal.reason)).then(async () => {
				options.signal?.throwIfAborted();
				if (selected.quarantined) throw selected.quarantined.error;
				observation.started();
				if (selected.leased && options.mode === "operation" && options.command.type === "pageCache.begin") selected.leased.started = true;
				if (!isSameSqliteReadOnlyWorkerLaunch(selected.launch, launch) || selected.session?.isRetired()) await closeSlot(selected);
				options.signal?.throwIfAborted();
				selected.launch = launch;
				const worker = selected.session ??= createSession({
					...launch,
					pooledRead: true
				});
				worker.setIdle(false);
				try {
					const value = await worker.run(pathname, options);
					options.signal?.throwIfAborted();
					if (!stateful && !getSqliteRuntimeCapabilities().explicitSqliteCloseReleasesNativeResources) await closeSlot(selected);
					return value;
				} catch (error) {
					try {
						await closeSlot(selected);
					} catch (cleanupError) {
						throw createSqliteLifecycleAggregateError([error, cleanupError], "SQLite read and child cleanup failed", error);
					}
					throw error;
				}
			}).finally(() => {
				observation.completed();
				selected.queued--;
				if (!selected.leased && !selected.quarantined && selected.queued === 0 && selected.session && !selected.session.isRetired()) {
					selected.session?.setIdle(true);
					armScopedReadWorkerIdle(selected);
				}
			});
			selected.tail = runInDetachedAsyncContext(() => Promise.allSettled([previous, operation]).then(() => {}));
			return operation;
		},
		async closeBroker(broker) {
			closingBrokers.add(broker);
			const failures = (await Promise.allSettled(scopedReadWorkers.filter((slot) => slot.launch.transport.kind === "broker" && slot.launch.transport.owner === broker && slot.session && slot.queued === 0 && !slot.leased && !slot.quarantined).map(retireIdleSlot))).flatMap((outcome) => outcome.status === "rejected" ? [outcome.reason] : []);
			if (failures.length) throw new AggregateError(failures, "SQLite read-only broker worker cleanup failed");
		}
	};
}
//#endregion
//#region src/infra/sqlite-readonly-worker.ts
const SQLITE_INSPECTION_TIMEOUT_MS = 3e5;
const SQLITE_INSPECTION_BYTES_PER_SECOND = 33554432;
const log$5 = createSubsystemLogger("state/sqlite");
function resolveSqliteInspectionBudget(operation, pathname, sizeBytes) {
	const timeoutMs = resolveTimerTimeoutMs(SQLITE_INSPECTION_TIMEOUT_MS + Math.ceil(40 * Number(sizeBytes ?? 0) / SQLITE_INSPECTION_BYTES_PER_SECOND) * 1e3, SQLITE_INSPECTION_TIMEOUT_MS);
	const size = sizeBytes === void 0 ? "unknown size" : formatByteSize(Number(sizeBytes), {
		style: "iec",
		maxUnit: "giga",
		separator: " ",
		fractionDigits: sizeBytes < 1024n ? 0 : 1
	});
	if (timeoutMs > SQLITE_INSPECTION_TIMEOUT_MS) log$5.debug(`SQLite ${operation} for ${pathname}: ${size}, budget ${timeoutMs / 1e3} seconds`);
	return {
		timeoutMs,
		size
	};
}
function readSqliteInspectionBudget(operation, pathname, mainSizeBytes) {
	let sizeBytes = mainSizeBytes;
	try {
		sizeBytes ??= fs$1.statSync(pathname, { bigint: true }).size;
		for (const suffix of [
			"-wal",
			"-shm",
			"-journal"
		]) try {
			sizeBytes += fs$1.statSync(pathname + suffix, { bigint: true }).size;
		} catch (error) {
			if (!hasErrnoCode(error, "ENOENT")) throw error;
		}
	} catch {}
	return resolveSqliteInspectionBudget(operation, pathname, sizeBytes);
}
function sqliteInspectionTimeoutError(operation, pathname, timeoutMs, size) {
	return /* @__PURE__ */ new Error(`SQLite ${operation} timed out after ${timeoutMs / 1e3} seconds (budget for ${size}) for ${pathname}. Stop the Gateway service and other OpenClaw processes using this database, then retry; if already stopped, check storage performance.`);
}
/** A retained startup inspection is cancelled by its Gateway, not by its foreground wait. */
function isSqliteInspectionDeadlineOwnedByCaller() {
	return readOnlyWorkerScope.getStore()?.deadlineOwnedByCaller === true;
}
/** Bind a one-shot inspection to the active scope's cancellation and close join. */
function runScopedSqliteInspection(signal, inspect) {
	const scope = readOnlyWorkerScope.getStore();
	if (!scope) return inspect(signal);
	if (!scope.active) return Promise.reject(/* @__PURE__ */ new Error("SQLite read-only worker scope closed"));
	const operation = inspect(signal ? AbortSignal.any([signal, scope.controller.signal]) : scope.controller.signal);
	scope.pending.add(operation);
	operation.then(() => scope.pending.delete(operation), () => scope.pending.delete(operation));
	return operation;
}
function sqliteReadOnlyWorkerArgv(pathname, options) {
	const { moduleUrl, runtimeGeneration } = captureRuntimeWorkerSource(resolveRuntimeProcessEntrypointUrl(options.mode === "content-version" || options.mode === "file-generation" ? "sqliteSourceRevision" : "sqliteReadOnly"));
	return {
		runtimeGeneration,
		argv: [
			...resolveForwardedNodeCompilerArgs(),
			...resolveRuntimeWorkerArgv(moduleUrl),
			SQLITE_READONLY_CHILD_ARG,
			...sqliteReadOnlyWorkerRequestArgs(pathname, options)
		]
	};
}
/** Capture launch facts before awaiting another session's retirement. */
function captureSqliteReadOnlyWorkerLaunch(env, source) {
	const broker = source === void 0 ? void 0 : getSpawnBroker();
	return {
		runtimeGeneration: captureRuntimeWorkerSource(resolveRuntimeProcessEntrypointUrl("sqliteReadOnly")).runtimeGeneration,
		env: {
			...resolveNodeCompileCacheEnv(env),
			OPENCLAW_STATE_DIR: resolveStateDir(env)
		},
		cwd: tryProcessCwd() ?? tmpdir(),
		transport: broker ? {
			kind: "broker",
			owner: broker
		} : { kind: "native" }
	};
}
function createScopedSqliteReadOnlyWorker(launch) {
	const workerUrl = resolveRuntimeProcessEntrypointUrl("sqliteReadOnly");
	return runInDetachedAsyncContext(() => createSqliteReadOnlyWorkerSession({
		...launch,
		argv: [
			...resolveRuntimeWorkerArgv(launch.runtimeGeneration?.resolve(workerUrl) ?? workerUrl),
			SQLITE_READONLY_CHILD_ARG,
			"session"
		],
		requestArgs: sqliteReadOnlyWorkerRequestArgs,
		readBudget: (pathname) => readSqliteInspectionBudget("read-only snapshot", pathname),
		deadlineOwnedByCaller: launch.retainLifetime === false ? () => false : isSqliteInspectionDeadlineOwnedByCaller,
		timeoutError: (pathname, timeoutMs, size) => sqliteInspectionTimeoutError("read-only snapshot", pathname, timeoutMs, size),
		closeTimeoutMs: SQLITE_INSPECTION_TIMEOUT_MS
	}));
}
function runSqliteReadOnlyWorker(pathname, inputOptions) {
	const options = (inputOptions.mode === "auth-profile-rows" || inputOptions.mode === "operation") && isArtifactPreservingStateRead("agent", pathname) ? {
		...inputOptions,
		artifactPreserving: true
	} : inputOptions;
	if (options.mode === "reclaim") return readOnlyWorkerScope.exit(() => runSqliteReadOnlyWorkerOnce(pathname, options));
	return runScopedSqliteInspection(options.signal, (signal) => {
		const scope = readOnlyWorkerScope.getStore();
		if (!scope) return runSqliteReadOnlyWorkerOnce(pathname, options);
		const scopedOptions = {
			...options,
			signal
		};
		const useScopedWorker = options.mode === "sync" && !scope.busy;
		if (useScopedWorker) scope.busy = true;
		if (scopedOptions.mode === "auth-profile-rows" || scopedOptions.mode === "operation") {
			const launch = captureSqliteReadOnlyWorkerLaunch(scopedOptions.env, scopedOptions.source);
			return sqliteReadOnlyWorkerPool.run(pathname, scopedOptions, launch);
		}
		return (async () => {
			if (!useScopedWorker) return runSqliteReadOnlyWorkerOnce(pathname, scopedOptions);
			try {
				const launch = captureSqliteReadOnlyWorkerLaunch();
				if (!scope.worker?.compatible(launch)) {
					await scope.worker?.close();
					scopedOptions.signal?.throwIfAborted();
					scope.worker = createScopedSqliteReadOnlyWorker(launch);
				}
				return await scope.worker.run(pathname, scopedOptions);
			} finally {
				scope.busy = false;
			}
		})();
	});
}
const sqliteReadOnlyWorkerPool = createSqliteReadOnlyWorkerPool(createScopedSqliteReadOnlyWorker);
function runSqliteReadOnlyWorkerOnce(pathname, options, launch) {
	if (options.mode === "auth-profile-rows" || options.mode === "operation") return sqliteReadOnlyWorkerPool.run(pathname, options, captureSqliteReadOnlyWorkerLaunch(options.env, options.source));
	const reclaim = options.mode === "reclaim";
	const { argv, runtimeGeneration } = sqliteReadOnlyWorkerArgv(pathname, options);
	return runOneShotSqliteInspection({
		pathname,
		operation: reclaim ? "reclamation" : "read-only snapshot",
		argv,
		runtimeGeneration,
		signal: options.signal,
		deadlineOwnedByCaller: !reclaim && (launch?.deadlineOwnedByCaller ?? isSqliteInspectionDeadlineOwnedByCaller()),
		deadlineStopsOwner: reclaim,
		env: launch?.env,
		cwd: launch?.cwd,
		stoppedFailure: "snapshot owner stopped",
		...reclaim ? { interrupt: (child) => child.stdin?.end() } : {},
		read: (output, deadlineReached) => {
			if (reclaim) {
				const warnings = readSqliteReadOnlyWorkerValue(output, "reclaim");
				if (deadlineReached) {
					const { timeoutMs, size } = readSqliteInspectionBudget("reclamation", pathname);
					warnings.push(sqliteInspectionTimeoutError("reclamation", pathname, timeoutMs, size).message);
				}
				return warnings;
			}
			options.signal?.throwIfAborted();
			return readSqliteReadOnlyWorkerValue(output, options.mode);
		}
	});
}
function runOneShotSqliteInspection(params) {
	const { timeoutMs, size } = readSqliteInspectionBudget(params.operation, params.pathname);
	return new Promise((resolve, reject) => {
		let output = {
			kind: "launched",
			stderr: "",
			stdout: "",
			status: null
		};
		let stopped = false;
		let deadlineReached = false;
		const child = execFile(process.execPath, params.argv, {
			encoding: "utf8",
			windowsHide: true,
			env: params.env ?? resolveNodeCompileCacheEnv(),
			cwd: params.cwd,
			maxBuffer: SQLITE_READONLY_WORKER_MAX_BUFFER,
			timeout: params.deadlineStopsOwner || params.deadlineOwnedByCaller ? void 0 : timeoutMs,
			killSignal: "SIGKILL"
		}, (error, stdout, stderr) => {
			const timedOut = error?.killed && error.signal === "SIGKILL" && error.code == null;
			if (timedOut) deadlineReached = true;
			output = {
				kind: "launched",
				status: child.exitCode,
				failure: error ? stopped ? params.stoppedFailure : timedOut ? sqliteInspectionTimeoutError(params.operation, params.pathname, timeoutMs, size).message : `exited unsuccessfully: ${error.message}` : void 0,
				stderr,
				stdout,
				cause: error ?? void 0
			};
		});
		const interrupt = () => {
			if (params.interrupt) params.interrupt(child);
			else child.kill("SIGKILL");
		};
		const abort = () => {
			if (!stopped) {
				stopped = true;
				interrupt();
			}
		};
		const timer = params.deadlineStopsOwner ? setTimeout(() => {
			deadlineReached = true;
			stopped = true;
			interrupt();
		}, timeoutMs) : void 0;
		const closed = retainSnapshotWork(new Promise((resolveClosed) => {
			child.once("close", () => resolveClosed());
		}), abort);
		params.runtimeGeneration?.retain(child, async () => {
			await closed;
		});
		params.signal?.addEventListener("abort", abort, { once: true });
		if (params.signal?.aborted) abort();
		child.once("close", () => {
			clearTimeout(timer);
			params.signal?.removeEventListener("abort", abort);
			try {
				resolve(params.read(output, deadlineReached));
			} catch (workerError) {
				reject(workerError instanceof Error ? workerError : new Error(String(workerError)));
			}
		});
	});
}
function runSqliteReadOnlyWorkerSync(pathname, stagingRoot, mode = "sync") {
	const { timeoutMs, size } = readSqliteInspectionBudget("read-only snapshot", pathname);
	const started = log$5.isEnabled("trace") ? performance$1.now() : void 0;
	const result = spawnSync(process.execPath, sqliteReadOnlyWorkerArgv(pathname, {
		mode,
		stagingRoot
	}).argv, {
		encoding: "utf8",
		windowsHide: true,
		stdio: "pipe",
		env: resolveNodeCompileCacheEnv(),
		maxBuffer: SQLITE_READONLY_WORKER_MAX_BUFFER,
		timeout: timeoutMs,
		killSignal: "SIGKILL"
	});
	if (started !== void 0) log$5.trace(`SQLite read-only snapshot child durationMs=${performance$1.now() - started}`);
	return readSqliteReadOnlyWorkerValue(result.error ? {
		kind: "launch-failed",
		error: new Error(hasErrnoCode(result.error, "ETIMEDOUT") ? sqliteInspectionTimeoutError("read-only snapshot", pathname, timeoutMs, size).message : `SQLite read-only worker failed to start for ${pathname}: ${result.error.message}`, { cause: result.error })
	} : {
		kind: "launched",
		stdout: result.stdout,
		stderr: result.stderr,
		status: result.status,
		failure: result.status === 0 ? void 0 : `exited with ${result.signal ? `signal ${result.signal}` : `code ${result.status}`}`
	}, mode);
}
//#endregion
//#region src/state/openclaw-quarantine-error.ts
const DATABASE_QUARANTINE_READ_CLEANUP_ERROR_NAME = "OpenClawQuarantineReadCleanupError";
const OpenClawQuarantineReadCleanupError = resolveGlobalSingleton(Symbol.for("openclaw.quarantineReadCleanupError"), () => class QuarantineReadCleanupError extends AggregateError {
	constructor(errors, quarantine) {
		super(errors, "OpenClaw quarantine reader cleanup failed.", { cause: errors[0] });
		this.quarantine = quarantine;
		this.name = DATABASE_QUARANTINE_READ_CLEANUP_ERROR_NAME;
	}
});
//#endregion
//#region src/state/openclaw-state-db-failure.ts
const failurePaths = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseFailurePaths"), () => /* @__PURE__ */ new WeakMap());
/** Preserve the terminal admission owner's path through worker error transport. */
function markOpenClawStateDatabaseFailure(error, pathname) {
	failurePaths.set(error, pathname);
}
/** Cleanup aggregates must retain the original refusal without attributing unrelated errors. */
function findOpenClawStateDatabaseFailure(error, pathname) {
	const pending = [error];
	const seen = /* @__PURE__ */ new Set();
	for (const current of pending) {
		if (!(current instanceof Error) || seen.has(current)) continue;
		seen.add(current);
		if (failurePaths.get(current) === pathname) return current;
		pending.push(current.cause);
		if (current instanceof AggregateError) pending.push(...current.errors);
	}
}
//#endregion
//#region src/agents/agent-create-error.ts
var DuplicateAgentError = class extends Error {};
//#endregion
//#region src/agents/auth-profiles/store-unreadable-error.ts
const AUTH_PROFILE_MIGRATION_COMMAND = "openclaw doctor --fix";
var AuthProfileStoreUnreadableError = class extends Error {
	constructor(databasePath) {
		super(`Auth profile store ${shortenHomePath(databasePath)} is unreadable; run ${AUTH_PROFILE_MIGRATION_COMMAND}.`);
		this.databasePath = databasePath;
		this.code = "AUTH_PROFILE_STORE_UNREADABLE";
		this.action = AUTH_PROFILE_MIGRATION_COMMAND;
		this.name = "AuthProfileStoreUnreadableError";
	}
};
//#endregion
//#region src/agents/mcp-oauth-store-error.ts
var McpOAuthStoreCorruptionError = class extends Error {
	constructor(storeKey, detail, options) {
		super(`MCP OAuth store ${storeKey} is invalid: ${detail}`, options);
		this.name = "McpOAuthStoreCorruptionError";
	}
};
//#endregion
//#region src/agents/workspace-state-identity.ts
const WORKSPACE_ALIAS_REPOINTED_ERROR_CODE = "WORKSPACE_ALIAS_REPOINTED";
var WorkspaceAliasRepointedError = class extends Error {
	constructor(params) {
		super(`workspace path alias points to a different current target: ${params.aliasPath} now resolves to ${params.currentWorkspacePath}, but its stored workspace state belongs to ${params.storedWorkspacePath}. Run \`openclaw doctor --fix\` and confirm the move, or use \`openclaw doctor --fix --force\`.`);
		this.code = WORKSPACE_ALIAS_REPOINTED_ERROR_CODE;
		this.name = "WorkspaceAliasRepointedError";
		this.aliasPath = params.aliasPath;
		this.storedWorkspacePath = params.storedWorkspacePath;
		this.currentWorkspacePath = params.currentWorkspacePath;
	}
};
//#endregion
//#region src/agents/worktrees/errors.ts
var WorktreeRemovalContentionError = class extends Error {
	constructor(kind, message, blockedByRun) {
		super(message);
		this.kind = kind;
		this.blockedByRun = blockedByRun;
		this.name = "WorktreeRemovalContentionError";
	}
};
var WorktreeRemovalLockError = class extends Error {
	constructor(kind, message) {
		super(message);
		this.kind = kind;
		this.name = "WorktreeRemovalLockError";
	}
};
var SessionWorktreeSourceChangedError = class extends Error {};
var SessionWorktreeLifecycleError = class extends Error {
	constructor(message, reason) {
		super(message);
		this.reason = reason;
	}
};
//#endregion
//#region src/config/sessions/goals-operations.types.ts
var SessionGoalOperationError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = "SessionGoalOperationError";
	}
};
//#endregion
//#region src/config/sessions/session-canonical-key-error.ts
var SessionCanonicalKeyMigrationRequiredError = class extends Error {
	constructor(detail) {
		super(`${detail}; stop the Gateway and run openclaw doctor --fix`);
		this.code = "SESSION_CANONICAL_KEY_MIGRATION_REQUIRED";
		this.name = "SessionCanonicalKeyMigrationRequiredError";
	}
};
//#endregion
//#region src/config/sessions/session-mutation-conflict-error.ts
var SqliteSessionMutationConflictError = class extends Error {
	constructor(operationLabel) {
		super(`SQLite session state changed while preparing ${operationLabel}`);
		this.operationLabel = operationLabel;
		this.name = "SqliteSessionMutationConflictError";
	}
};
var SqliteTranscriptMutationConflictError = class extends Error {
	constructor(sessionId) {
		super(`SQLite transcript changed while preparing rewrite for ${sessionId}`);
		this.sessionId = sessionId;
		this.name = "SqliteTranscriptMutationConflictError";
	}
};
var SessionEntryLifecycleUpsertConflictError = class extends Error {
	constructor(sessionKey) {
		super(`SQLite session entry changed before lifecycle upsert for ${sessionKey}`);
		this.sessionKey = sessionKey;
		this.name = "SessionEntryLifecycleUpsertConflictError";
	}
};
//#endregion
//#region src/config/sessions/session-pending-input-custody-error.ts
/** Custody refusal must not release already accepted input for another dispatch. */
var SessionPendingInputCustodyError = class extends Error {};
//#endregion
//#region src/config/sessions/session-transcript-read-fence-error.ts
var SessionTranscriptReadFenceError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "SessionTranscriptReadFenceError";
	}
};
//#endregion
//#region src/config/sessions/session-transcript-writer-claim-error.ts
var SessionTranscriptWriterClaimReboundError = class extends Error {
	constructor(cause) {
		super("session writer claim changed before transcript persistence", { cause });
		this.name = "SessionTranscriptWriterClaimReboundError";
	}
};
//#endregion
//#region src/gateway/model-account-connect-errors.ts
var ModelAccountConnectAuthorityError = class extends Error {
	constructor() {
		super("This account action requires a current authorized connection; reconnect and try again.");
	}
};
//#endregion
//#region src/gateway/worker-environments/session-attachment.ts
var WorkerSessionAlreadyAttachedError = class extends Error {
	constructor(sessionId, environmentId) {
		super(`Session ${sessionId} is already attached to worker environment ${environmentId}`);
		this.sessionId = sessionId;
		this.environmentId = environmentId;
	}
};
//#endregion
//#region src/state/openclaw-state-db-contract.ts
const FIRST_USE_STATE_TABLES = [
	"user_profile_identities",
	"user_background_images",
	"local_workspace_projections",
	"update_runs",
	"session_repository_workspaces",
	"github_repository_publication_requests",
	"github_publication_session_lifecycles",
	"skill_library_entries",
	"skill_library_revisions",
	"skill_library_events",
	"skill_library_uploads",
	"github_personal_publication_requests",
	"cron_job_runtime_authorities",
	"cron_run_trigger_state_retirements",
	"execution_identity_contexts",
	"mcp_oauth_pending_authorizations",
	"node_worker_launch_containers",
	"node_worker_launch_boots",
	"node_worker_launch_cleanup",
	"node_worker_launch_process_scopes",
	"node_worker_launches",
	"node_worker_prepared_workspaces",
	"node_worker_turns",
	"operator_approval_execution_identities",
	"operator_approval_standing_grants",
	"operator_approval_standing_grant_generations",
	"web_push_approval_deliveries",
	"execution_decision_facts",
	"execution_owner_lifecycle_bindings",
	"outbound_message_execution_bindings",
	"outbound_message_progress"
];
const FIRST_USE_STATE_INDEXES = [
	"idx_user_profile_identities_profile_id",
	"idx_user_profile_identities_authorization",
	"idx_update_runs_created",
	"idx_update_runs_active",
	"idx_github_repository_publication_shared_request",
	"idx_github_repository_publication_personal_request",
	"idx_github_personal_publication_owner_session",
	"idx_github_personal_publication_pending",
	"idx_node_worker_launches_terminal_completed",
	"idx_node_worker_turns_terminal_completed",
	"idx_node_worker_turns_active_owner",
	"idx_operator_approval_standing_grants_binding",
	"idx_web_push_approval_deliveries_subscription",
	"execution_identity_contexts_run_created_idx",
	"execution_decision_facts_cursor_id_idx",
	"execution_decision_facts_context_occurred_idx",
	"execution_decision_facts_run_occurred_idx",
	"outbound_message_execution_bindings_execution_event_idx",
	"outbound_message_progress_occurred_idx",
	"outbound_message_progress_run_occurred_idx"
];
[...FIRST_USE_STATE_TABLES];
[...FIRST_USE_STATE_INDEXES];
/** Maximum time one synchronous SQLite call may wait for a lock. */
const OPENCLAW_SQLITE_BUSY_TIMEOUT_MS = 5e3;
/** User-facing guide for schema refusals; lives here so error sites avoid import cycles. */
const OPENCLAW_DATABASE_SCHEMA_DOCS_URL = "https://docs.openclaw.ai/reference/database-schemas";
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/util.js
function getEnumValues(entries) {
	const numericValues = Object.values(entries).filter((v) => typeof v === "number");
	return Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
}
function joinValues(array, separator = "|") {
	return array.map((val) => stringifyPrimitive(val)).join(separator);
}
function jsonStringifyReplacer(_, value) {
	if (typeof value === "bigint") return value.toString();
	return value;
}
var Cached = class {
	constructor(getter) {
		this._getter = getter;
		this._value = void 0;
	}
	get value() {
		const getter = this._getter;
		if (getter !== void 0) {
			this._value = getter();
			this._getter = void 0;
		}
		return this._value;
	}
};
function cached(getter) {
	return new Cached(getter);
}
function nullish(input) {
	return input === null || input === void 0;
}
function cleanRegex(source) {
	const start = source.startsWith("^") ? 1 : 0;
	const end = source.endsWith("$") ? source.length - 1 : source.length;
	return source.slice(start, end);
}
function floatSafeRemainder(val, step) {
	const ratio = val / step;
	const roundedRatio = Math.round(ratio);
	const tolerance = 4 * Number.EPSILON * Math.max(Math.abs(ratio), 1);
	if (Math.abs(ratio - roundedRatio) < tolerance) return 0;
	return ratio - roundedRatio;
}
function assignProp(target, prop, value) {
	Object.defineProperty(target, prop, {
		value,
		writable: true,
		enumerable: true,
		configurable: true
	});
}
/**
* Whichever object a def's `shape` currently answers from: the one the caller passed until the first read, the frozen copy after it.
*
* Its keys and descriptors read without invoking anything, which is what lets a discriminated union check its discriminator, and the cycle walk read a shape, without resolving a getter that references the schema being constructed. A def that answers `shape` from an accessor of its own has none.
*/
function rawShape(def) {
	const desc = Object.getOwnPropertyDescriptor(def, "shape");
	return desc?.get ? desc.get.raw : desc?.value;
}
function sourceShape(schema) {
	return rawShape(schema._zod.def) ?? schema._zod.def.shape;
}
function deferProp(target, key, getter) {
	Object.defineProperty(target, key, {
		get() {
			const value = getter();
			assignProp(this, key, value);
			return value;
		},
		enumerable: true,
		configurable: true
	});
}
function putProp(target, key, value) {
	if (key in target) assignProp(target, key, value);
	else target[key] = value;
}
/**
* Copies `keys` of `source`'s shape onto `target`, each value passed through `wrap`.
*
* A key the source has resolved is copied through now, so the derived shape states it outright and nothing has to resolve it to learn what it holds. A key the source still defers stays deferred, and reads back through the source's own `shape`, so it resolves once and both shapes get that one schema.
*/
function mirrorShape(target, source, keys, wrap) {
	const raw = sourceShape(source);
	for (const key of keys) {
		const desc = Object.getOwnPropertyDescriptor(raw, key);
		if (!desc.enumerable) continue;
		if (desc.get) deferProp(target, key, () => {
			const value = source._zod.def.shape[key];
			return wrap ? wrap(value, key) : value;
		});
		else putProp(target, key, wrap ? wrap(desc.value, key) : desc.value);
	}
}
function mirrorProps(target, source) {
	for (const key of Reflect.ownKeys(source)) {
		const desc = Object.getOwnPropertyDescriptor(source, key);
		if (!desc.enumerable) continue;
		if (desc.get) deferProp(target, key, () => source[key]);
		else putProp(target, key, desc.value);
	}
}
function mergeDefs(...defs) {
	const mergedDescriptors = {};
	for (const def of defs) {
		const descriptors = Object.getOwnPropertyDescriptors(def);
		Object.assign(mergedDescriptors, descriptors);
	}
	return Object.defineProperties({}, mergedDescriptors);
}
function esc(str) {
	return JSON.stringify(str);
}
function slugify(input) {
	return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
const captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {};
function isObject(data) {
	return typeof data === "object" && data !== null && !Array.isArray(data);
}
const allowsEval = /* @__PURE__*/ cached(() => {
	if (globalConfig.jitless) return false;
	if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) return false;
	try {
		new Function("");
		return true;
	} catch (_) {
		return false;
	}
});
function isPlainObject(o) {
	if (isObject(o) === false) return false;
	const ctor = o.constructor;
	if (ctor === void 0) return true;
	if (typeof ctor !== "function") return true;
	const prot = ctor.prototype;
	if (isObject(prot) === false) return false;
	if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) return false;
	return true;
}
function shallowClone(o) {
	if (isPlainObject(o)) return { ...o };
	if (Array.isArray(o)) return [...o];
	if (o instanceof Map) return new Map(o);
	if (o instanceof Set) return new Set(o);
	return o;
}
const propertyKeyTypes = /* @__PURE__*/ new Set([
	"string",
	"number",
	"symbol"
]);
function escapeRegex(str) {
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function clone(inst, def, params) {
	const cl = new inst._zod.constr(def ?? inst._zod.def);
	if (!def || params?.parent) cl._zod.parent = inst;
	return cl;
}
function normalizeParams(_params) {
	const params = _params;
	if (!params) return {};
	if (typeof params === "string") return { error: () => params };
	if (params?.message !== void 0) {
		if (params?.error !== void 0) throw new Error("Cannot specify both `message` and `error` params");
		params.error = params.message;
	}
	delete params.message;
	if (typeof params.error === "string") return {
		...params,
		error: () => params.error
	};
	return params;
}
function stringifyPrimitive(value) {
	if (typeof value === "bigint") return value.toString() + "n";
	if (typeof value === "string") return `"${value}"`;
	return `${value}`;
}
function optionalKeys(shape) {
	return Object.keys(shape).filter((k) => {
		return shape[k]._zod.optin !== void 0 && shape[k]._zod.optout === "optional";
	});
}
const NUMBER_FORMAT_RANGES = /*@__PURE__*/ (() => ({
	safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
	int32: [-2147483648, 2147483647],
	uint32: [0, 4294967295],
	float32: [-34028234663852886e22, 34028234663852886e22],
	float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
}))();
const BIGINT_FORMAT_RANGES = {
	int64: [/* @__PURE__*/ BigInt("-9223372036854775808"), /* @__PURE__*/ BigInt("9223372036854775807")],
	uint64: [/* @__PURE__*/ BigInt(0), /* @__PURE__*/ BigInt("18446744073709551615")]
};
function pick(schema, mask) {
	const currDef = schema._zod.def;
	const checks = currDef.checks;
	if (checks && checks.length > 0) throw new Error(".pick() cannot be used on object schemas containing refinements");
	const newShape = {};
	mirrorShape(newShape, schema, maskedKeys(schema, mask));
	return clone(schema, mergeDefs(currDef, {
		shape: newShape,
		checks: []
	}));
}
function maskedKeys(schema, mask) {
	const raw = sourceShape(schema);
	const keys = [];
	for (const key of Reflect.ownKeys(mask)) {
		if (!Object.getOwnPropertyDescriptor(raw, key)?.enumerable) throw new Error(`Unrecognized key: "${String(key)}"`);
		if (mask[key]) keys.push(key);
	}
	return keys;
}
function omit(schema, mask) {
	const currDef = schema._zod.def;
	const checks = currDef.checks;
	if (checks && checks.length > 0) throw new Error(".omit() cannot be used on object schemas containing refinements");
	const omitted = new Set(maskedKeys(schema, mask));
	const newShape = {};
	mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)).filter((key) => !omitted.has(key)));
	return clone(schema, mergeDefs(currDef, {
		shape: newShape,
		checks: []
	}));
}
function extend(schema, shape) {
	if (!isPlainObject(shape)) throw new Error("Invalid input to extend: expected a plain object");
	const checks = schema._zod.def.checks;
	if (checks && checks.length > 0) {
		const existingShape = sourceShape(schema);
		for (const key of Reflect.ownKeys(shape)) if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
	}
	return clone(schema, mergeDefs(schema._zod.def, { shape: extended(schema, shape) }));
}
function extended(schema, shape) {
	const newShape = {};
	mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)));
	mirrorProps(newShape, shape);
	return newShape;
}
function safeExtend(schema, shape) {
	if (!isPlainObject(shape)) throw new Error("Invalid input to safeExtend: expected a plain object");
	return clone(schema, mergeDefs(schema._zod.def, { shape: extended(schema, shape) }));
}
function merge(a, b) {
	if (!b?._zod?.def) throw new Error("Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.");
	if (a._zod.def.checks?.length) throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
	const newShape = {};
	mirrorShape(newShape, a, Reflect.ownKeys(sourceShape(a)));
	mirrorShape(newShape, b, Reflect.ownKeys(sourceShape(b)));
	return clone(a, mergeDefs(a._zod.def, {
		shape: newShape,
		get catchall() {
			return b._zod.def.catchall;
		},
		checks: b._zod.def.checks ?? []
	}));
}
function partial(Class, schema, mask, name = "partial") {
	const checks = schema._zod.def.checks;
	if (checks && checks.length > 0) throw new Error(`.${name}() cannot be used on object schemas containing refinements`);
	const selected = mask ? new Set(maskedKeys(schema, mask)) : void 0;
	const newShape = {};
	mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)), Class && ((value, key) => selected && !selected.has(key) ? value : new Class({
		type: "optional",
		innerType: value
	})));
	return clone(schema, mergeDefs(schema._zod.def, {
		shape: newShape,
		checks: []
	}));
}
function required(Class, schema, mask) {
	const selected = mask ? new Set(maskedKeys(schema, mask)) : void 0;
	const newShape = {};
	mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)), (value, key) => selected && !selected.has(key) ? value : new Class({
		type: "nonoptional",
		innerType: value
	}));
	return clone(schema, mergeDefs(schema._zod.def, { shape: newShape }));
}
function aborted(x, startIndex = 0) {
	if (x.aborted === true) return true;
	for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue !== true) return true;
	return false;
}
function explicitlyAborted(x, startIndex = 0) {
	if (x.aborted === true) return true;
	for (let i = startIndex; i < x.issues.length; i++) if (x.issues[i]?.continue === false) return true;
	return false;
}
function prefixIssues(path, issues) {
	return issues.map((iss) => {
		var _a;
		(_a = iss).path ?? (_a.path = []);
		iss.path.unshift(path);
		return iss;
	});
}
function unwrapMessage(message) {
	return typeof message === "string" ? message : message?.message;
}
function attachSchema(issues, start, inst) {
	var _a;
	for (let i = start; i < issues.length; i++) (_a = issues[i]).schema ?? (_a.schema = inst);
}
function finalizeIssue(iss, ctx, config) {
	var _a;
	const traits = iss.inst?._zod?.traits;
	if (traits?.has("$ZodType")) {
		if (traits.has("$ZodCheck")) (_a = iss).schema ?? (_a.schema = iss.inst);
		else iss.schema = iss.inst;
	}
	const schemaError = iss.schema !== iss.inst ? iss.schema?._zod.def?.error : void 0;
	const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(schemaError?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config.customError?.(iss)) ?? unwrapMessage(config.localeError?.(iss)) ?? "Invalid input";
	const full = {};
	for (const k of Object.keys(iss)) {
		if (k === "inst" || k === "schema" || k === "continue" || k === "input" || k === "__proto__") continue;
		full[k] = iss[k];
	}
	full.path ?? (full.path = []);
	full.message = message;
	if (ctx?.reportInput) full.input = iss.input;
	return full;
}
const highSurrogate = /[\uD800-\uDBFF]/;
function codePointLength(str) {
	const units = str.length;
	if (!highSurrogate.test(str)) return units;
	let count = units;
	for (let i = 0; i < units - 1; i++) if ((str.charCodeAt(i) & 64512) === 55296 && (str.charCodeAt(i + 1) & 64512) === 56320) {
		count--;
		i++;
	}
	return count;
}
function getLengthableOrigin(input) {
	if (Array.isArray(input)) return "array";
	if (typeof input === "string") return "string";
	return "unknown";
}
function parsedType(data) {
	const t = typeof data;
	switch (t) {
		case "number": return Number.isNaN(data) ? "nan" : "number";
		case "object": {
			if (data === null) return "null";
			if (Array.isArray(data)) return "array";
			const obj = data;
			if (obj && Object.getPrototypeOf(obj) !== Object.prototype && "constructor" in obj && obj.constructor) return obj.constructor.name;
		}
	}
	return t;
}
function issue(...args) {
	const [iss, input, inst] = args;
	if (typeof iss === "string") return {
		message: iss,
		code: "custom",
		input,
		inst
	};
	return { ...iss };
}
/**
* Installs a trait's members on its prototype. Each value builds that member for the instance on first read; the built value shadows the accessor as an own property, so a detached `const { parse } = schema` keeps working.
*
* Call this from a `proto` initializer, which runs once per prototype — never per instance.
*/
function members(proto, table) {
	for (const key in table) {
		const desc = Object.getOwnPropertyDescriptor(table, key);
		if (desc.get) Object.defineProperty(proto, key, {
			...desc,
			enumerable: false
		});
		else defineBound(proto, key, desc.value);
	}
}
/** Shadows a prototype member with an own value, so a getter that builds from the instance runs once. */
function own(inst, key, value, enumerable = true) {
	Object.defineProperty(inst, key, {
		configurable: true,
		writable: true,
		enumerable,
		value
	});
	return value;
}
/** Like {@link own}, for a member that was never an own data property and has to stay out of `Object.keys`. */
function hide(inst, key, value) {
	return own(inst, key, value, false);
}
/** Adds members a table derives from the instance: each builds on first read and shadows as own data, and assignment shadows the same way, as when these were own properties. */
function derived(computes, table) {
	for (const key in computes) {
		const compute = computes[key];
		Object.defineProperty(table, key, {
			configurable: true,
			enumerable: true,
			get() {
				return own(this, key, compute(this));
			},
			set(value) {
				own(this, key, value);
			}
		});
	}
	return table;
}
function defineBound(proto, key, fn) {
	Object.defineProperty(proto, key, {
		configurable: true,
		get() {
			return this == null ? fn : own(this, key, fn.bind(this));
		},
		set(value) {
			own(this, key, value);
		}
	});
}
/** Returns the prototype to install on, or `undefined` if this group is already installed on it. */
function claim(inst, sentinel) {
	const proto = Object.getPrototypeOf(inst);
	return sentinel in proto ? void 0 : proto;
}
let installing;
let broke = false;
const breaker = {
	configurable: true,
	get() {
		broke = true;
	}
};
/**
* Installs a lazily-derived internal on the `_zod` prototype of `inst`'s
* constructor, computed from the internals object itself and cached there on
* first read. One accessor per constructor rather than one per instance.
*/
function defineLazyInternal(inst, key, compute) {
	const proto = Object.getPrototypeOf(inst._zod);
	if (key in proto && installing !== inst._zod) {
		installing = void 0;
		return;
	}
	installing = inst._zod;
	Object.defineProperty(proto, key, {
		configurable: true,
		get() {
			Object.defineProperty(this, key, breaker);
			const outer = broke;
			broke = false;
			try {
				const value = compute(this);
				if (broke) delete this[key];
				else Object.defineProperty(this, key, {
					configurable: true,
					writable: true,
					value
				});
				broke = broke || outer;
				return value;
			} catch (err) {
				delete this[key];
				broke = broke || outer;
				throw err;
			}
		},
		set(value) {
			Object.defineProperty(this, key, {
				configurable: true,
				writable: true,
				value
			});
		}
	});
}
/**
* Installs `key` on `inst`'s prototype, computed by `make` on first read and cached there as an own
* data property. One accessor per constructor rather than one per instance, because an own accessor
* puts every instance after the first into v8 dictionary mode. The key doubles as the sentinel.
*/
function installLazyProp(inst, key, make, enumerable) {
	const proto = claim(inst, key);
	if (!proto) return;
	Object.defineProperty(proto, key, {
		configurable: true,
		get() {
			const desc = {
				configurable: true,
				writable: true,
				enumerable,
				value: void 0
			};
			Object.defineProperty(this, key, desc);
			desc.value = make(this);
			Object.defineProperty(this, key, desc);
			return desc.value;
		},
		set(value) {
			Object.defineProperty(this, key, {
				configurable: true,
				writable: true,
				enumerable,
				value
			});
		}
	});
}
/** Marks the thunk `_catch` synthesises for a constant catch value. `Function.length` cannot tell that thunk from a user callback — rest and defaulted parameters both report arity 0 — and a user callback reads `ctx.error`, whose issues only finalize correctly against the caller's per-parse error map. Provenance can say what arity cannot. A plain string key rather than `Symbol.for`, whose call at module scope no bundler can prove pure — the same shape that anchored `urlCanParse` into every build. */
const CONSTANT_CATCH = "~constantCatch";
/** Wraps a constant catch value in a thunk tagged with {@link CONSTANT_CATCH}. */
function constantCatch(value) {
	const fn = () => value;
	fn[CONSTANT_CATCH] = true;
	return fn;
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/core.js
var _a$1;
const _zodDesc = {
	value: void 0,
	enumerable: false
};
let _E = "captureStackTrace" in Error ? Error : null;
function newError(Definition) {
	const E = _E;
	if (E) {
		const saved = E.stackTraceLimit;
		if (typeof saved === "number") {
			try {
				E.stackTraceLimit = 0;
			} catch {
				_E = null;
				return new Definition();
			}
			try {
				return new Definition();
			} finally {
				E.stackTraceLimit = saved;
			}
		}
	}
	return new Definition();
}
function $constructor(name, initializer, proto, params) {
	const zodProto = {};
	function Internals(def) {
		this.def = def;
		this.constr = _;
		this.traits = /* @__PURE__ */ new Set();
	}
	Internals.prototype = zodProto;
	const protoMembers = proto;
	const initialized = protoMembers && /* @__PURE__ */ new WeakSet();
	function init(inst, def) {
		if (!inst._zod) {
			_zodDesc.value = new Internals(def);
			try {
				Object.defineProperty(inst, "_zod", _zodDesc);
			} finally {
				_zodDesc.value = void 0;
			}
		} else if (inst._zod.traits.has(name)) return;
		inst._zod.traits.add(name);
		initializer(inst, def);
		if (initialized) {
			const own = Object.getPrototypeOf(inst);
			const ctorProto = inst._zod.constr.prototype;
			let up = own;
			while (up && up !== ctorProto) up = Object.getPrototypeOf(up);
			const target = up ?? own;
			if (!initialized.has(target)) {
				initialized.add(target);
				members(target, protoMembers);
			}
		}
		const proto = _.prototype;
		for (const k in proto) {
			if (!Object.prototype.hasOwnProperty.call(proto, k)) continue;
			if (!(k in inst)) inst[k] = proto[k].bind(inst);
		}
	}
	const Parent = params?.Parent ?? Object;
	class Definition extends Parent {}
	Object.defineProperty(Definition, "name", { value: name });
	function _(def) {
		const inst = params?.Parent ? newError(Definition) : this;
		init(inst, def);
		const deferred = inst._zod.deferred;
		if (deferred) {
			for (const fn of deferred) fn();
			inst._zod.deferred = void 0;
		}
		const pp = globalThis.__zod_globalConfig?.postProcessor;
		if (pp) pp(inst);
		return inst;
	}
	Object.defineProperty(_, "init", { value: init });
	Object.defineProperty(_, Symbol.hasInstance, { value: (inst) => {
		if (params?.Parent && inst instanceof params.Parent) return true;
		return inst?._zod?.traits?.has(name);
	} });
	Object.defineProperty(_, "name", { value: name });
	return _;
}
var $ZodAsyncError = class extends Error {
	constructor() {
		super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
	}
};
var $ZodEncodeError = class extends Error {
	constructor(name) {
		super(`Encountered unidirectional transform during encode: ${name}`);
		this.name = "ZodEncodeError";
	}
};
(_a$1 = globalThis).__zod_globalConfig ?? (_a$1.__zod_globalConfig = {});
const globalConfig = globalThis.__zod_globalConfig;
function config(newConfig) {
	if (newConfig) Object.assign(globalConfig, newConfig);
	return globalConfig;
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/errors.js
function _getMessage() {
	const internals = this._zod;
	internals.message ?? (internals.message = JSON.stringify(internals.def, jsonStringifyReplacer, 2));
	return internals.message;
}
function _setMessage(value) {
	this._zod.message = value;
}
const _messageDesc = {
	get: _getMessage,
	set: _setMessage,
	enumerable: true,
	configurable: true
};
const _issuesDesc = {
	value: void 0,
	enumerable: false
};
const _installedToString = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
const initializer$1 = (inst, def) => {
	inst.name = "$ZodError";
	_issuesDesc.value = def;
	Object.defineProperty(inst, "issues", _issuesDesc);
	_issuesDesc.value = void 0;
	Object.defineProperty(inst, "message", _messageDesc);
	const proto = Object.getPrototypeOf(inst);
	if (!_installedToString.has(proto)) {
		_installedToString.add(proto);
		Object.defineProperty(proto, "toString", {
			configurable: true,
			enumerable: false,
			get() {
				const value = () => this.message;
				Object.defineProperty(this, "toString", {
					value,
					configurable: true,
					writable: true
				});
				return value;
			},
			set(value) {
				Object.defineProperty(this, "toString", {
					value,
					configurable: true,
					writable: true
				});
			}
		});
	}
};
const $ZodError = $constructor("$ZodError", initializer$1);
$constructor("$ZodError", initializer$1, void 0, { Parent: Error });
/** Get-or-create `obj[key]` as an own data property. A path segment naming an inherited member
* ("toString", "constructor") would otherwise read through to the prototype, and assigning
* "__proto__" would hit the setter instead of creating a key. */
function node(obj, key, make) {
	if (!Object.prototype.hasOwnProperty.call(obj, key)) {
		if (key === "__proto__") Object.defineProperty(obj, key, {
			value: make(),
			writable: true,
			enumerable: true,
			configurable: true
		});
		else obj[key] = make();
	}
	return obj[key];
}
function flattenError(error, mapper = (issue) => issue.message) {
	const fieldErrors = {};
	const formErrors = [];
	for (const sub of error.issues) if (sub.path.length > 0) node(fieldErrors, sub.path[0], () => []).push(mapper(sub));
	else formErrors.push(mapper(sub));
	return {
		formErrors,
		fieldErrors
	};
}
function formatError(error, mapper = (issue) => issue.message) {
	const fieldErrors = { _errors: [] };
	const processError = (error, path = []) => {
		for (const issue of error.issues) if (issue.code === "invalid_union" && issue.errors.length) issue.errors.map((issues) => processError({ issues }, [...path, ...issue.path]));
		else if (issue.code === "invalid_key") processError({ issues: issue.issues }, [...path, ...issue.path]);
		else if (issue.code === "invalid_element") processError({ issues: issue.issues }, [...path, ...issue.path]);
		else {
			const fullpath = [...path, ...issue.path];
			if (fullpath.length === 0) fieldErrors._errors.push(mapper(issue));
			else {
				let curr = fieldErrors;
				let i = 0;
				while (i < fullpath.length) {
					const el = fullpath[i];
					const terminal = i === fullpath.length - 1;
					if (el === "_errors") {
						if (terminal) curr._errors.push(mapper(issue));
						i++;
						continue;
					}
					if (!Object.prototype.hasOwnProperty.call(curr, el)) Object.defineProperty(curr, el, {
						value: { _errors: [] },
						enumerable: true,
						writable: true,
						configurable: true
					});
					const node = curr[el];
					if (terminal) node._errors.push(mapper(issue));
					curr = node;
					i++;
				}
			}
		}
	};
	processError(error);
	return fieldErrors;
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/parse.js
function finalizeParams(callee, params) {
	return {
		callee: params?.callee ?? callee,
		Err: params?.Err
	};
}
const _parse = (_Err) => {
	const fn = (schema, value, _ctx, _params) => {
		const ctx = _ctx ? {
			..._ctx,
			async: false
		} : { async: false };
		const result = schema._zod.run({
			value,
			issues: []
		}, ctx);
		if (result instanceof Promise) throw new $ZodAsyncError();
		if (result.issues.length) {
			const e = new ((_params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
			captureStackTrace(e, _params?.callee ?? fn);
			throw e;
		}
		return result.value;
	};
	return fn;
};
const _parseAsync = (_Err) => {
	const fn = async (schema, value, _ctx, params) => {
		const ctx = _ctx ? {
			..._ctx,
			async: true
		} : { async: true };
		let result = schema._zod.run({
			value,
			issues: []
		}, ctx);
		if (result instanceof Promise) result = await result;
		if (result.issues.length) {
			const e = new ((params?.Err) ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
			captureStackTrace(e, params?.callee ?? fn);
			throw e;
		}
		return result.value;
	};
	return fn;
};
const _safeParse = (_Err) => (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		async: false
	} : { async: false };
	const result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) throw new $ZodAsyncError();
	return result.issues.length ? failure(_Err, result.issues, ctx) : {
		success: true,
		data: result.value
	};
};
function failure(Err, issues, ctx) {
	let error;
	return {
		success: false,
		get error() {
			if (!error) {
				error = new Err(issues.map((iss) => finalizeIssue(iss, ctx, config())));
				issues = void 0;
				ctx = void 0;
			}
			return error;
		},
		set error(e) {
			error = e;
			issues = void 0;
			ctx = void 0;
		}
	};
}
const _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		async: true
	} : { async: true };
	let result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) result = await result;
	return result.issues.length ? failure(_Err, result.issues, ctx) : {
		success: true,
		data: result.value
	};
};
const COMPILE_INVALID = /* @__PURE__ */ Symbol.for("zod.compile.invalid");
const COMPILE_FALLBACK = /* @__PURE__ */ Symbol.for("zod.compile.fallback");
const validate = ((schema, value, _ctx) => {
	const validator = schema._zod.bag.validator;
	if (validator !== void 0) {
		if (validator(value) !== COMPILE_INVALID) return true;
		if (validator.definite === true && _ctx === void 0) return false;
	}
	return validateFallback(schema, value, _ctx);
});
function validateFallback(schema, value, _ctx) {
	const ctx = _ctx ? {
		..._ctx,
		async: false,
		abortEarly: true
	} : {
		async: false,
		abortEarly: true
	};
	const fallbackRun = schema._zod.bag.fallbackRun;
	let result;
	if (fallbackRun) {
		ctx[COMPILE_FALLBACK] = true;
		result = fallbackRun({
			value,
			issues: []
		}, ctx);
	} else result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) throw new $ZodAsyncError();
	return result.issues.length === 0;
}
const validateAsync$1 = async (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		async: true,
		abortEarly: true
	} : {
		async: true,
		abortEarly: true
	};
	let result = schema._zod.run({
		value,
		issues: []
	}, ctx);
	if (result instanceof Promise) result = await result;
	return result.issues.length === 0;
};
const _encode = (_Err) => {
	const parse = _parse(_Err);
	const fn = (schema, value, _ctx, _params) => {
		const ctx = _ctx ? {
			..._ctx,
			direction: "backward"
		} : { direction: "backward" };
		return parse(schema, value, ctx, finalizeParams(fn, _params));
	};
	return fn;
};
const _decode = (_Err) => {
	const parse = _parse(_Err);
	const fn = (schema, value, _ctx, _params) => {
		return parse(schema, value, _ctx, finalizeParams(fn, _params));
	};
	return fn;
};
const _encodeAsync = (_Err) => {
	const parseAsync = _parseAsync(_Err);
	const fn = async (schema, value, _ctx, _params) => {
		const ctx = _ctx ? {
			..._ctx,
			direction: "backward"
		} : { direction: "backward" };
		return await parseAsync(schema, value, ctx, finalizeParams(fn, _params));
	};
	return fn;
};
const _decodeAsync = (_Err) => {
	const parseAsync = _parseAsync(_Err);
	const fn = async (schema, value, _ctx, _params) => {
		return await parseAsync(schema, value, _ctx, finalizeParams(fn, _params));
	};
	return fn;
};
const _safeEncode = (_Err) => (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		direction: "backward"
	} : { direction: "backward" };
	return _safeParse(_Err)(schema, value, ctx);
};
const _safeDecode = (_Err) => (schema, value, _ctx) => {
	return _safeParse(_Err)(schema, value, _ctx);
};
const _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
	const ctx = _ctx ? {
		..._ctx,
		direction: "backward"
	} : { direction: "backward" };
	return _safeParseAsync(_Err)(schema, value, ctx);
};
const _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
	return _safeParseAsync(_Err)(schema, value, _ctx);
};
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/regexes.js
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link cuid2} instead.
* See https://github.com/paralleldrive/cuid.
*/
const cuid = /^[cC][0-9a-z]{6,}$/;
const cuid2 = /^[0-9a-z]+$/;
const ulid = /^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/;
const xid = /^[0-9a-vA-V]{20}$/;
const ksuid = /^[A-Za-z0-9]{27}$/;
const nanoid = /^[a-zA-Z0-9_-]{21}$/;
function nanoidOfLength(length) {
	return new RegExp(`^[a-zA-Z0-9_-]{${length}}$`);
}
/** ISO 8601-1 duration regex. Does not support the 8601-2 extensions like negative durations or fractional/negative components. */
const duration = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
/** A regex for any UUID-like identifier: 8-4-4-4-12 hex pattern */
const guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
/** Returns a regex for validating an RFC 9562/4122 UUID.
*
* @param version Optionally specify a version 1-8. If no version is specified, all versions are supported. */
const uuid = (version) => {
	if (!version) return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
	return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
};
/** Practical email validation */
const email = /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
const _emoji$1 = `^(?=[\\s\\S]*[\\p{Extended_Pictographic}\\p{Regional_Indicator}\\u20E3])[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$`;
function emoji() {
	return new RegExp(_emoji$1, "u");
}
const ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
const ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
const cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
const cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
const base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
const base64url = /^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2,3})?$/;
const httpProtocol = /^https?$/;
const e164 = /^\+[1-9]\d{6,14}$/;
const dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
/** Anchors a pattern source. The interpolation lives here rather than at the call site because
* esbuild will not drop a `@__PURE__` call whose own argument interpolates a variable, but it
* will drop `anchor(dateSource)`. Keeping it inline pinned `date` into every bundle. */
function anchor(source) {
	return new RegExp(`^${source}$`);
}
const date = /*@__PURE__*/ anchor(dateSource);
function timeSource(args) {
	const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
	return typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : args.seconds ? `${hhmm}:[0-5]\\d(?:\\.\\d+)?` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
}
function time(args) {
	return new RegExp(`^${timeSource(args)}$`);
}
function datetime(args) {
	const opts = ["Z"];
	if (args.offset) opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
	const qualified = `${timeSource({
		precision: args.precision,
		seconds: true
	})}(?:${opts.join("|")})`;
	const timeRegex = args.local ? `${qualified}|${timeSource({ precision: args.precision })}` : qualified;
	return new RegExp(`^${dateSource}T(?:${timeRegex})$`);
}
const anyString = /^[\s\S]{0,}$/;
const number$1 = /^-?\d+(?:\.\d+)?$/;
const lowercase = /^[^A-Z]*$/;
const uppercase = /^[^a-z]*$/;
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/checks.js
const $ZodCheck = /*@__PURE__*/ $constructor("$ZodCheck", (inst, def) => {
	var _a;
	inst._zod ?? (inst._zod = {});
	inst._zod.def = def;
	(_a = inst._zod).onattach ?? (_a.onattach = []);
});
/** Default `when` for length-based checks: run only on non-nullish values with a `length`. */
const _whenHasLength = (payload) => {
	const val = payload.value;
	return !nullish(val) && val.length !== void 0;
};
const numericOriginMap = {
	number: "number",
	bigint: "bigint",
	object: "date"
};
const $ZodCheckLessThan = /*@__PURE__*/ $constructor("$ZodCheckLessThan", (inst, def) => {
	$ZodCheck.init(inst, def);
	const origin = numericOriginMap[typeof def.value];
	inst._zod.check = (payload) => {
		if (def.inclusive ? payload.value <= def.value : payload.value < def.value) return;
		payload.issues.push({
			origin: numericOriginMap[typeof payload.value] ?? origin,
			code: "too_big",
			maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
			input: payload.value,
			inclusive: def.inclusive,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckGreaterThan = /*@__PURE__*/ $constructor("$ZodCheckGreaterThan", (inst, def) => {
	$ZodCheck.init(inst, def);
	const origin = numericOriginMap[typeof def.value];
	inst._zod.check = (payload) => {
		if (def.inclusive ? payload.value >= def.value : payload.value > def.value) return;
		payload.issues.push({
			origin: numericOriginMap[typeof payload.value] ?? origin,
			code: "too_small",
			minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
			input: payload.value,
			inclusive: def.inclusive,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckMultipleOf = /*@__PURE__*/ $constructor("$ZodCheckMultipleOf", (inst, def) => {
	$ZodCheck.init(inst, def);
	inst._zod.check = (payload) => {
		if (typeof payload.value !== typeof def.value) throw new Error("Cannot mix number and bigint in multiple_of check.");
		if (typeof payload.value === "bigint" ? def.value !== BigInt(0) && payload.value % def.value === BigInt(0) : floatSafeRemainder(payload.value, def.value) === 0) return;
		payload.issues.push({
			origin: typeof payload.value,
			code: "not_multiple_of",
			divisor: def.value,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckNumberFormat = /*@__PURE__*/ $constructor("$ZodCheckNumberFormat", (inst, def) => {
	$ZodCheck.init(inst, def);
	def.format = def.format || "float64";
	const isInt = def.format?.includes("int");
	const origin = isInt ? "int" : "number";
	const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
	inst._zod.check = (payload) => {
		const input = payload.value;
		if (isInt) {
			if (!Number.isInteger(input)) {
				payload.issues.push({
					expected: origin,
					format: def.format,
					code: "invalid_type",
					continue: false,
					input,
					inst
				});
				return;
			}
			if (!Number.isSafeInteger(input)) {
				if (input > 0) payload.issues.push({
					input,
					code: "too_big",
					maximum: Number.MAX_SAFE_INTEGER,
					note: "Integers must be within the safe integer range.",
					inst,
					origin,
					inclusive: true,
					continue: !def.abort
				});
				else payload.issues.push({
					input,
					code: "too_small",
					minimum: Number.MIN_SAFE_INTEGER,
					note: "Integers must be within the safe integer range.",
					inst,
					origin,
					inclusive: true,
					continue: !def.abort
				});
				return;
			}
		}
		if (input < minimum) payload.issues.push({
			origin: "number",
			input,
			code: "too_small",
			minimum,
			inclusive: true,
			inst,
			continue: !def.abort
		});
		if (input > maximum) payload.issues.push({
			origin: "number",
			input,
			code: "too_big",
			maximum,
			inclusive: true,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckMaxLength = /*@__PURE__*/ $constructor("$ZodCheckMaxLength", (inst, def) => {
	var _a;
	$ZodCheck.init(inst, def);
	(_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
	inst._zod.check = (payload) => {
		const input = payload.value;
		const units = input.length;
		if ((typeof input === "string" && units > def.maximum ? codePointLength(input) : units) <= def.maximum) return;
		const origin = getLengthableOrigin(input);
		payload.issues.push({
			origin,
			code: "too_big",
			maximum: def.maximum,
			inclusive: true,
			input,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckMinLength = /*@__PURE__*/ $constructor("$ZodCheckMinLength", (inst, def) => {
	var _a;
	$ZodCheck.init(inst, def);
	(_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
	inst._zod.check = (payload) => {
		const input = payload.value;
		const units = input.length;
		if ((typeof input === "string" && units >= def.minimum && units < def.minimum * 2 ? codePointLength(input) : units) >= def.minimum) return;
		const origin = getLengthableOrigin(input);
		payload.issues.push({
			origin,
			code: "too_small",
			minimum: def.minimum,
			inclusive: true,
			input,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckLengthEquals = /*@__PURE__*/ $constructor("$ZodCheckLengthEquals", (inst, def) => {
	var _a;
	$ZodCheck.init(inst, def);
	(_a = inst._zod.def).when ?? (_a.when = _whenHasLength);
	inst._zod.check = (payload) => {
		const input = payload.value;
		const units = input.length;
		const length = typeof input === "string" && units >= def.length && units <= def.length * 2 ? codePointLength(input) : units;
		if (length === def.length) return;
		const origin = getLengthableOrigin(input);
		const tooBig = length > def.length;
		payload.issues.push({
			origin,
			...tooBig ? {
				code: "too_big",
				maximum: def.length
			} : {
				code: "too_small",
				minimum: def.length
			},
			inclusive: true,
			exact: true,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckStringFormat = /*@__PURE__*/ $constructor("$ZodCheckStringFormat", (inst, def) => {
	var _a, _b;
	$ZodCheck.init(inst, def);
	if (def.pattern) (_a = inst._zod).check ?? (_a.check = (payload) => {
		def.pattern.lastIndex = 0;
		if (def.pattern.test(payload.value)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: def.format,
			input: payload.value,
			...def.pattern ? { pattern: def.pattern.toString() } : {},
			inst,
			continue: !def.abort
		});
	});
	else (_b = inst._zod).check ?? (_b.check = () => {});
});
const $ZodCheckRegex = /*@__PURE__*/ $constructor("$ZodCheckRegex", (inst, def) => {
	$ZodCheckStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		def.pattern.lastIndex = 0;
		if (def.pattern.test(payload.value)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "regex",
			input: payload.value,
			pattern: def.pattern.toString(),
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckLowerCase = /*@__PURE__*/ $constructor("$ZodCheckLowerCase", (inst, def) => {
	def.pattern ?? (def.pattern = lowercase);
	$ZodCheckStringFormat.init(inst, def);
});
const $ZodCheckUpperCase = /*@__PURE__*/ $constructor("$ZodCheckUpperCase", (inst, def) => {
	def.pattern ?? (def.pattern = uppercase);
	$ZodCheckStringFormat.init(inst, def);
});
const $ZodCheckIncludes = /*@__PURE__*/ $constructor("$ZodCheckIncludes", (inst, def) => {
	$ZodCheck.init(inst, def);
	const escapedRegex = escapeRegex(def.includes);
	def.pattern = new RegExp(typeof def.position === "number" ? `^.{${def.position},}${escapedRegex}` : escapedRegex);
	inst._zod.check = (payload) => {
		if (payload.value.includes(def.includes, def.position)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "includes",
			includes: def.includes,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckStartsWith = /*@__PURE__*/ $constructor("$ZodCheckStartsWith", (inst, def) => {
	$ZodCheck.init(inst, def);
	const pattern = new RegExp(`^${escapeRegex(def.prefix)}.*`);
	def.pattern ?? (def.pattern = pattern);
	inst._zod.check = (payload) => {
		if (payload.value.startsWith(def.prefix)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "starts_with",
			prefix: def.prefix,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckEndsWith = /*@__PURE__*/ $constructor("$ZodCheckEndsWith", (inst, def) => {
	$ZodCheck.init(inst, def);
	const pattern = new RegExp(`.*${escapeRegex(def.suffix)}$`);
	def.pattern ?? (def.pattern = pattern);
	inst._zod.check = (payload) => {
		if (payload.value.endsWith(def.suffix)) return;
		payload.issues.push({
			origin: "string",
			code: "invalid_format",
			format: "ends_with",
			suffix: def.suffix,
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCheckOverwrite = /*@__PURE__*/ $constructor("$ZodCheckOverwrite", (inst, def) => {
	$ZodCheck.init(inst, def);
	inst._zod.check = (payload) => {
		payload.value = def.tx(payload.value);
	};
});
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/doc.js
var Doc = class {
	constructor(args = [], closed = {}) {
		this.content = [];
		this.indent = 0;
		this.args = args;
		this.closed = closed;
	}
	indented(fn) {
		this.indent += 1;
		try {
			fn(this);
		} finally {
			this.indent -= 1;
		}
	}
	write(arg) {
		if (typeof arg === "function") {
			arg(this, { execution: "sync" });
			arg(this, { execution: "async" });
			return;
		}
		const lines = arg.split("\n").filter((x) => x);
		const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
		const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
		for (const line of dedented) this.content.push(line);
	}
	compile() {
		const F = Function;
		const content = this?.content ?? [``];
		return new F(...Object.keys(this.closed), `return function (${this.args.join(", ")}) {\n${content.join("\n")}\n};`)(...Object.values(this.closed));
	}
};
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/versions.js
const version = {
	major: 4,
	minor: 6,
	patch: 5
};
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/schemas.js
const $ZodType = /*@__PURE__*/ $constructor("$ZodType", (inst, def) => {
	var _a;
	inst ?? (inst = {});
	inst._zod.def = def;
	inst._zod.bag = inst._zod.bag || {};
	inst._zod.version = version;
	const defChecks = inst._zod.def.checks;
	const checks = inst._zod.traits.has("$ZodCheck") ? [inst, ...defChecks ?? []] : defChecks?.length ? [...defChecks] : [];
	for (const ch of checks) for (const fn of ch._zod.onattach) fn(inst);
	if (checks.length === 0) {
		(_a = inst._zod).deferred ?? (_a.deferred = []);
		inst._zod.deferred?.push(() => {
			inst._zod.run = inst._zod.parse;
		});
	} else {
		const runChecks = (payload, checks, ctx) => {
			if (payload.memo) return payload;
			let isAborted = aborted(payload);
			let asyncResult;
			for (const ch of checks) {
				if (ch._zod.def.when) {
					if (explicitlyAborted(payload)) continue;
					if (!ch._zod.def.when(payload)) continue;
				} else if (isAborted) continue;
				const currLen = payload.issues.length;
				const _ = ch._zod.check(payload);
				if (_ instanceof Promise && ctx?.async === false) throw new $ZodAsyncError();
				if (asyncResult || _ instanceof Promise) asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
					await _;
					if (payload.issues.length === currLen) return;
					attachSchema(payload.issues, currLen, inst);
					if (!isAborted) isAborted = aborted(payload, currLen);
				});
				else {
					if (payload.issues.length === currLen) continue;
					attachSchema(payload.issues, currLen, inst);
					if (!isAborted) isAborted = aborted(payload, currLen);
				}
			}
			if (asyncResult) return asyncResult.then(() => {
				return payload;
			});
			return payload;
		};
		const handleCanaryResult = (canary, payload, ctx) => {
			if (aborted(canary)) {
				canary.aborted = true;
				return canary;
			}
			const checkResult = runChecks(payload, checks, ctx);
			if (checkResult instanceof Promise) {
				if (ctx.async === false) throw new $ZodAsyncError();
				return checkResult.then((checkResult) => inst._zod.parse(checkResult, ctx));
			}
			return inst._zod.parse(checkResult, ctx);
		};
		inst._zod.run = (payload, ctx) => {
			if (ctx.skipChecks) return inst._zod.parse(payload, ctx);
			if (ctx.direction === "backward") {
				const canary = inst._zod.parse({
					value: payload.value,
					issues: []
				}, {
					...ctx,
					skipChecks: true
				});
				if (canary instanceof Promise) return canary.then((canary) => {
					return handleCanaryResult(canary, payload, ctx);
				});
				return handleCanaryResult(canary, payload, ctx);
			}
			const result = inst._zod.parse(payload, ctx);
			if (result instanceof Promise) {
				if (ctx.async === false) throw new $ZodAsyncError();
				return result.then((result) => runChecks(result, checks, ctx));
			}
			return runChecks(result, checks, ctx);
		};
	}
}, {
	get "~standard"() {
		return hide(this, "~standard", standardProps(this));
	},
	set "~standard"(value) {
		own(this, "~standard", value);
	}
});
/** The Standard Schema surface for `inst`. Shared so wrappers can extend it without forcing it. */
const toStandardResult = (r, ctx) => r.issues.length ? { issues: r.issues.map((iss) => finalizeIssue(iss, ctx, config())) } : { value: r.value };
async function validateAsync(inst, value) {
	const ctx = { async: true };
	return toStandardResult(await inst._zod.run({
		value,
		issues: []
	}, ctx), ctx);
}
function standardProps(inst) {
	return {
		validate: (value) => {
			const ctx = { async: false };
			try {
				const r = inst._zod.run({
					value,
					issues: []
				}, ctx);
				if (!(r instanceof Promise)) return toStandardResult(r, ctx);
			} catch (_) {}
			return validateAsync(inst, value);
		},
		vendor: "zod",
		version: 1
	};
}
const $ZodString = /*@__PURE__*/ $constructor("$ZodString", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = def.pattern ?? anyString;
	inst._zod.parse = (payload, _) => {
		if (def.coerce) try {
			payload.value = String(payload.value);
		} catch (_) {}
		if (typeof payload.value === "string") return payload;
		payload.issues.push({
			expected: "string",
			code: "invalid_type",
			input: payload.value,
			inst
		});
		return payload;
	};
});
const $ZodStringFormat = /*@__PURE__*/ $constructor("$ZodStringFormat", (inst, def) => {
	$ZodCheckStringFormat.init(inst, def);
	$ZodString.init(inst, def);
});
const $ZodGUID = /*@__PURE__*/ $constructor("$ZodGUID", (inst, def) => {
	def.pattern ?? (def.pattern = guid);
	$ZodStringFormat.init(inst, def);
});
const $ZodUUID = /*@__PURE__*/ $constructor("$ZodUUID", (inst, def) => {
	if (def.version) {
		const v = {
			v1: 1,
			v2: 2,
			v3: 3,
			v4: 4,
			v5: 5,
			v6: 6,
			v7: 7,
			v8: 8
		}[def.version];
		if (v === void 0) throw new Error(`Invalid UUID version: "${def.version}"`);
		def.pattern ?? (def.pattern = uuid(v));
	} else def.pattern ?? (def.pattern = uuid());
	$ZodStringFormat.init(inst, def);
});
const $ZodEmail = /*@__PURE__*/ $constructor("$ZodEmail", (inst, def) => {
	def.pattern ?? (def.pattern = email);
	$ZodStringFormat.init(inst, def);
});
function canParseURL(input) {
	try {
		if (typeof URL !== "undefined" && typeof URL.canParse === "function") return URL.canParse(input);
		new URL(input);
		return true;
	} catch {
		return false;
	}
}
function validateURL(trimmed, def) {
	if (!("normalize" in def) && !("hostname" in def) && !("protocol" in def)) return canParseURL(trimmed) || 2;
	return parseURLObject(trimmed, def);
}
/** Parses a URL while preserving the non-normalizing HTTP guard. */
function parseURLObject(trimmed, def) {
	if (!def.normalize && def.protocol?.source === httpProtocol.source && !/^https?:\/\//i.test(trimmed)) return 1;
	try {
		if (typeof URL !== "undefined") {
			const URLStatic = URL;
			if (typeof URLStatic.parse === "function") return URLStatic.parse(trimmed) ?? 2;
		}
		return new URL(trimmed);
	} catch {
		return 2;
	}
}
const asciiTabOrNewline = /[\t\n\r]/g;
/** The URL parser deletes every ASCII tab, LF and CR from its input before it parses, so `new URL("https://exa\nmple.com")` reports on `example.com`. Applying the same deletion to the returned value closes the half of that divergence which can move the host; the parser's other rewrite, stripping C0 controls at the edges, cannot. */
function stripTabAndNewline(value) {
	return value.replace(asciiTabOrNewline, "");
}
function urlHostnameOk(url, hostname) {
	hostname.lastIndex = 0;
	return hostname.test(url.hostname);
}
function urlProtocolOk(url, protocol) {
	protocol.lastIndex = 0;
	return protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol);
}
const $ZodURL = /*@__PURE__*/ $constructor("$ZodURL", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		try {
			const trimmed = payload.value.trim();
			const url = validateURL(trimmed, def);
			if (url === 1) {
				payload.issues.push({
					code: "invalid_format",
					format: "url",
					note: "Invalid URL format",
					input: payload.value,
					inst,
					continue: !def.abort
				});
				return;
			}
			if (url === 2) {
				payload.issues.push({
					code: "invalid_format",
					format: "url",
					input: payload.value,
					inst,
					continue: !def.abort
				});
				return;
			}
			if (url === true) {
				payload.value = stripTabAndNewline(trimmed);
				return;
			}
			if (def.hostname && !urlHostnameOk(url, def.hostname)) payload.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid hostname",
				pattern: def.hostname.source,
				input: payload.value,
				inst,
				continue: !def.abort
			});
			if (def.protocol && !urlProtocolOk(url, def.protocol)) payload.issues.push({
				code: "invalid_format",
				format: "url",
				note: "Invalid protocol",
				pattern: def.protocol.source,
				input: payload.value,
				inst,
				continue: !def.abort
			});
			payload.value = def.normalize ? url.href : stripTabAndNewline(trimmed);
			return;
		} catch (_) {
			payload.issues.push({
				code: "invalid_format",
				format: "url",
				input: payload.value,
				inst,
				continue: !def.abort
			});
		}
	};
});
const $ZodEmoji = /*@__PURE__*/ $constructor("$ZodEmoji", (inst, def) => {
	def.pattern ?? (def.pattern = emoji());
	$ZodStringFormat.init(inst, def);
});
const $ZodNanoID = /*@__PURE__*/ $constructor("$ZodNanoID", (inst, def) => {
	if (def.length !== void 0 && (!Number.isInteger(def.length) || def.length < 1)) throw new Error(`Invalid nanoid length: ${def.length}`);
	def.pattern ?? (def.pattern = def.length === void 0 ? nanoid : nanoidOfLength(def.length));
	$ZodStringFormat.init(inst, def);
});
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link $ZodCUID2} instead.
* See https://github.com/paralleldrive/cuid.
*/
const $ZodCUID = /*@__PURE__*/ $constructor("$ZodCUID", (inst, def) => {
	def.pattern ?? (def.pattern = cuid);
	$ZodStringFormat.init(inst, def);
});
const $ZodCUID2 = /*@__PURE__*/ $constructor("$ZodCUID2", (inst, def) => {
	def.pattern ?? (def.pattern = cuid2);
	$ZodStringFormat.init(inst, def);
});
const $ZodULID = /*@__PURE__*/ $constructor("$ZodULID", (inst, def) => {
	def.pattern ?? (def.pattern = ulid);
	$ZodStringFormat.init(inst, def);
});
const $ZodXID = /*@__PURE__*/ $constructor("$ZodXID", (inst, def) => {
	def.pattern ?? (def.pattern = xid);
	$ZodStringFormat.init(inst, def);
});
const $ZodKSUID = /*@__PURE__*/ $constructor("$ZodKSUID", (inst, def) => {
	def.pattern ?? (def.pattern = ksuid);
	$ZodStringFormat.init(inst, def);
});
const $ZodISODateTime = /*@__PURE__*/ $constructor("$ZodISODateTime", (inst, def) => {
	def.pattern ?? (def.pattern = datetime(def));
	$ZodStringFormat.init(inst, def);
});
const $ZodISODate = /*@__PURE__*/ $constructor("$ZodISODate", (inst, def) => {
	def.pattern ?? (def.pattern = date);
	$ZodStringFormat.init(inst, def);
});
const $ZodISOTime = /*@__PURE__*/ $constructor("$ZodISOTime", (inst, def) => {
	def.pattern ?? (def.pattern = time(def));
	$ZodStringFormat.init(inst, def);
});
const $ZodISODuration = /*@__PURE__*/ $constructor("$ZodISODuration", (inst, def) => {
	def.pattern ?? (def.pattern = duration);
	$ZodStringFormat.init(inst, def);
});
const $ZodIPv4 = /*@__PURE__*/ $constructor("$ZodIPv4", (inst, def) => {
	def.pattern ?? (def.pattern = ipv4);
	$ZodStringFormat.init(inst, def);
});
/** An IPv6 address is written with hex digits, colons and dots, and nothing else. The guard is what makes the check below an IPv6 check: `new URL("http://[...]")` parses an authority, not an address, so `@` and `\` re-delimit it and `"::@1\\"` validates against the host `0.0.0.1`. The URL parser also deletes ASCII tab, LF and CR rather than failing, which is how `"::1\n"` validated as `::1`. */
const ipv6Alphabet = /^[0-9a-fA-F:.]+$/;
function isValidIPv6(value) {
	if (!ipv6Alphabet.test(value)) return false;
	return canParseURL(`http://[${value}]`);
}
const $ZodIPv6 = /*@__PURE__*/ $constructor("$ZodIPv6", (inst, def) => {
	def.pattern ?? (def.pattern = ipv6);
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		if (!isValidIPv6(payload.value)) payload.issues.push({
			code: "invalid_format",
			format: "ipv6",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodCIDRv4 = /*@__PURE__*/ $constructor("$ZodCIDRv4", (inst, def) => {
	def.pattern ?? (def.pattern = cidrv4);
	$ZodStringFormat.init(inst, def);
});
function isValidCIDRv6(value) {
	const parts = value.split("/");
	if (parts.length !== 2) return false;
	const [address, prefix] = parts;
	if (!prefix) return false;
	const prefixNum = Number(prefix);
	if (`${prefixNum}` !== prefix) return false;
	if (prefixNum < 0 || prefixNum > 128) return false;
	return isValidIPv6(address);
}
const $ZodCIDRv6 = /*@__PURE__*/ $constructor("$ZodCIDRv6", (inst, def) => {
	def.pattern ?? (def.pattern = cidrv6);
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		if (!isValidCIDRv6(payload.value)) payload.issues.push({
			code: "invalid_format",
			format: "cidrv6",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
function isValidBase64(data) {
	if (data === "") return true;
	if (/\s/.test(data)) return false;
	if (data.length % 4 !== 0) return false;
	try {
		atob(data);
		return true;
	} catch {
		return false;
	}
}
const base64Charset = /^[0-9a-zA-Z+/]*={0,2}$/;
const $ZodBase64 = /*@__PURE__*/ $constructor("$ZodBase64", (inst, def) => {
	def.pattern ?? (def.pattern = base64Charset);
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		if (isValidBase64(payload.value)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "base64",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const base64urlCharset = /^[A-Za-z0-9_-]*$/;
function isValidBase64URL(data) {
	if (!base64urlCharset.test(data)) return false;
	const base64 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
	return isValidBase64(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
}
const $ZodBase64URL = /*@__PURE__*/ $constructor("$ZodBase64URL", (inst, def) => {
	def.pattern ?? (def.pattern = base64urlCharset);
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		if (isValidBase64URL(payload.value)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "base64url",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodE164 = /*@__PURE__*/ $constructor("$ZodE164", (inst, def) => {
	def.pattern ?? (def.pattern = e164);
	$ZodStringFormat.init(inst, def);
});
function isValidJWT(token, algorithm = null) {
	try {
		const tokensParts = token.split(".");
		if (tokensParts.length !== 3) return false;
		const [header] = tokensParts;
		if (!header) return false;
		const parsedHeader = JSON.parse(atob(header));
		if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT") return false;
		if (!parsedHeader.alg) return false;
		if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm)) return false;
		return true;
	} catch {
		return false;
	}
}
const $ZodJWT = /*@__PURE__*/ $constructor("$ZodJWT", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	inst._zod.check = (payload) => {
		if (isValidJWT(payload.value, def.alg)) return;
		payload.issues.push({
			code: "invalid_format",
			format: "jwt",
			input: payload.value,
			inst,
			continue: !def.abort
		});
	};
});
const $ZodNumber = /*@__PURE__*/ $constructor("$ZodNumber", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.pattern = number$1;
	inst._zod.parse = (payload, _ctx) => {
		if (def.coerce) try {
			payload.value = Number(payload.value);
		} catch (_) {}
		const input = payload.value;
		if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) return payload;
		const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? String(input) : void 0 : void 0;
		payload.issues.push({
			expected: "number",
			code: "invalid_type",
			input,
			inst,
			...received ? { received } : {}
		});
		return payload;
	};
});
const $ZodNumberFormat = /*@__PURE__*/ $constructor("$ZodNumberFormat", (inst, def) => {
	$ZodCheckNumberFormat.init(inst, def);
	$ZodNumber.init(inst, def);
});
const $ZodUnknown = /*@__PURE__*/ $constructor("$ZodUnknown", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload) => payload;
});
const $ZodNever = /*@__PURE__*/ $constructor("$ZodNever", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, _ctx) => {
		payload.issues.push({
			expected: "never",
			code: "invalid_type",
			input: payload.value,
			inst
		});
		return payload;
	};
});
function handleArrayResult(result, final, index) {
	if (result.issues.length) final.issues.push(...prefixIssues(index, result.issues));
	final.value[index] = result.value;
}
const $ZodArray = /*@__PURE__*/ $constructor("$ZodArray", (inst, def) => {
	$ZodType.init(inst, def);
	const memo = globalConfig.memoizer;
	memo?.attach(inst);
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		if (!Array.isArray(input)) {
			payload.issues.push({
				expected: "array",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		payload.value = memo ? memo.alloc(inst, payload, Array(input.length), ctx) : Array(input.length);
		const proms = [];
		const abortEarly = ctx?.abortEarly;
		for (let i = 0; i < input.length; i++) {
			const item = input[i];
			const result = def.element._zod.run({
				value: item,
				issues: []
			}, ctx);
			if (result instanceof Promise) proms.push(result.then((result) => handleArrayResult(result, payload, i)));
			else {
				handleArrayResult(result, payload, i);
				if (abortEarly && result.issues.length !== 0 && aborted(result)) break;
			}
		}
		if (proms.length) return Promise.all(proms).then(() => payload);
		return payload;
	};
});
function handlePropertyResult(result, final, key, input, optin, optout) {
	const isPresent = key in input;
	const isOptionalOut = optout === "optional";
	if (!isPresent && isOptionalOut && optin === "optional") return;
	if (result.issues.length) {
		if (optin !== void 0 && isOptionalOut && !isPresent) return;
		final.issues.push(...prefixIssues(key, result.issues));
	}
	if (!isPresent && optin === void 0) {
		if (!result.issues.length) final.issues.push({
			code: "invalid_type",
			expected: "nonoptional",
			input: void 0,
			path: [key]
		});
		return;
	}
	if (result.value === void 0) {
		if (isPresent || optin === "defaulted" && !isOptionalOut) final.value[key] = void 0;
	} else final.value[key] = result.value;
}
const NO_SYMBOL_KEYS = [];
function normalizeDef(def) {
	const keys = Object.keys(def.shape);
	const ownSymbols = Object.getOwnPropertySymbols(def.shape);
	const symbolKeys = ownSymbols.length ? ownSymbols : NO_SYMBOL_KEYS;
	const allKeys = symbolKeys.length ? [...keys, ...symbolKeys] : keys;
	for (const k of allKeys) if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) throw new Error(`Invalid element at key "${String(k)}": expected a Zod schema`);
	const okeys = optionalKeys(def.shape);
	return {
		...def,
		allKeys,
		symbolKeys,
		keySet: new Set(keys),
		numKeys: keys.length,
		optionalKeys: new Set(okeys)
	};
}
function handleCatchall(proms, input, payload, ctx, def, inst, abortEarly) {
	const unrecognized = [];
	const keySet = def.keySet;
	const _catchall = def.catchall._zod;
	const t = _catchall.def.type;
	const optin = _catchall.optin;
	const optout = _catchall.optout;
	let seen = 0;
	for (const key in input) {
		if (abortEarly && payload.issues.length !== seen) {
			if (aborted(payload, seen)) break;
			seen = payload.issues.length;
		}
		if (keySet.has(key)) continue;
		if (key === "__proto__") {
			if (t === "never") unrecognized.push(key);
			continue;
		}
		if (t === "never") {
			unrecognized.push(key);
			continue;
		}
		const r = _catchall.run({
			value: input[key],
			issues: []
		}, ctx);
		if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, optin, optout)));
		else handlePropertyResult(r, payload, key, input, optin, optout);
	}
	if (unrecognized.length) payload.issues.push({
		code: "unrecognized_keys",
		keys: unrecognized,
		input,
		inst,
		continue: true
	});
	if (!proms.length) return payload;
	return Promise.all(proms).then(() => {
		return payload;
	});
}
const $ZodObject = /*@__PURE__*/ $constructor("$ZodObject", (inst, def) => {
	$ZodType.init(inst, def);
	const desc = Object.getOwnPropertyDescriptor(def, "shape");
	const sh = desc?.get ? desc.get.raw : def.shape ?? {};
	if (sh) {
		const get = () => {
			const newSh = { ...sh };
			Object.defineProperty(def, "shape", { value: newSh });
			get.raw = newSh;
			return newSh;
		};
		get.raw = sh;
		Object.defineProperty(def, "shape", { get });
	}
	const _normalized = cached(() => normalizeDef(def));
	defineLazyInternal(inst, "propValues", (zod) => {
		const shape = zod.def.shape;
		const propValues = {};
		for (const key in shape) {
			const field = shape[key]._zod;
			if (field.values) {
				if (!Object.prototype.hasOwnProperty.call(propValues, key)) assignProp(propValues, key, /* @__PURE__ */ new Set());
				for (const v of field.values) propValues[key].add(v);
				if (field.optin !== void 0) propValues[key].add(void 0);
			}
		}
		return propValues;
	});
	const isObject$2 = isObject;
	const catchall = def.catchall;
	let value;
	const memo = globalConfig.memoizer;
	memo?.attach(inst);
	inst._zod.parse = (payload, ctx) => {
		value ?? (value = _normalized.value);
		const input = payload.value;
		if (!isObject$2(input)) {
			payload.issues.push({
				expected: "object",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		payload.value = memo ? memo.alloc(inst, payload, {}, ctx) : {};
		const proms = [];
		const shape = value.shape;
		const abortEarly = ctx?.abortEarly;
		let seen = payload.issues.length;
		for (const key of value.allKeys) {
			if (abortEarly && payload.issues.length !== seen) {
				if (aborted(payload, seen)) break;
				seen = payload.issues.length;
			}
			if (key === "__proto__") continue;
			const el = shape[key];
			const optin = el._zod.optin;
			const optout = el._zod.optout;
			const r = el._zod.run({
				value: input[key],
				issues: []
			}, ctx);
			if (r instanceof Promise) proms.push(r.then((r) => handlePropertyResult(r, payload, key, input, optin, optout)));
			else handlePropertyResult(r, payload, key, input, optin, optout);
		}
		if (!catchall) return proms.length ? Promise.all(proms).then(() => payload) : payload;
		return handleCatchall(proms, input, payload, ctx, _normalized.value, inst, abortEarly === true);
	};
});
const $ZodObjectJIT = /*@__PURE__*/ $constructor("$ZodObjectJIT", (inst, def) => {
	$ZodObject.init(inst, def);
	const superParse = inst._zod.parse;
	const _normalized = cached(() => normalizeDef(def));
	const memo = globalConfig.memoizer;
	const generateFastpass = (shape) => {
		const normalized = _normalized.value;
		const syms = normalized.symbolKeys;
		const doc = new Doc(["payload", "ctx"], {
			shape,
			inst,
			memo,
			syms
		});
		const parseStr = (k) => `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
		const prefixStr = (id, k) => `
          let ${id}_ab = false;
          for (let i = 0; i < ${id}.issues.length; i++) {
            const iss = ${id}.issues[i];
            iss.path = iss.path ? [${k}, ...iss.path] : [${k}];
            payload.issues.push(iss);
            if (iss.continue !== true) ${id}_ab = true;
          }
          if (${id}_ab && ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }`;
		doc.write(`const input = payload.value;`);
		const ids = Object.create(null);
		let counter = 0;
		for (const key of normalized.allKeys) ids[key] = `key_${counter++}`;
		doc.write(memo ? `const newResult = memo.alloc(inst, payload, {}, ctx);` : `const newResult = {};`);
		for (const key of normalized.allKeys) {
			if (key === "__proto__") continue;
			const id = ids[key];
			const k = typeof key === "symbol" ? `syms[${syms.indexOf(key)}]` : esc(key);
			const isPresent = `${k} in input`;
			const schema = shape[key];
			const optin = schema?._zod?.optin;
			const isOptionalIn = optin !== void 0;
			const isOptionalOut = schema?._zod?.optout === "optional";
			doc.write(`const ${id} = ${parseStr(k)};`);
			if (isOptionalIn && isOptionalOut) {
				const assign = optin === "optional" ? `${id}_present` : `${id}.value !== undefined || ${id}_present`;
				doc.write(`
        const ${id}_present = ${isPresent};
        if (!${id}.issues.length || ${id}_present) {
          if (${id}.issues.length) {${prefixStr(id, k)}
          }

          if (${assign}) {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
			} else if (!isOptionalIn) doc.write(`
        const ${id}_present = ${isPresent};
        if (${id}.issues.length) {${prefixStr(id, k)}
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
          if (ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }
        }

        if (${id}_present) {
          newResult[${k}] = ${id}.value;
        }

      `);
			else {
				doc.write(`
        if (${id}.issues.length) {${prefixStr(id, k)}
        }
      `);
				if (optin === "defaulted") doc.write(`newResult[${k}] = ${id}.value;`);
				else doc.write(`
        if (${id}.value !== undefined || ${isPresent}) {
          newResult[${k}] = ${id}.value;
        }
      `);
			}
		}
		doc.write(`payload.value = newResult;`);
		doc.write(`return payload;`);
		return doc.compile();
	};
	let fastpass;
	const isObject$1 = isObject;
	const jit = !globalConfig.jitless;
	const fastEnabled = jit && allowsEval.value;
	const catchall = def.catchall;
	let value;
	inst._zod.parse = (payload, ctx) => {
		value ?? (value = _normalized.value);
		const input = payload.value;
		if (!isObject$1(input)) {
			payload.issues.push({
				expected: "object",
				code: "invalid_type",
				input,
				inst
			});
			return payload;
		}
		if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
			if (!fastpass) fastpass = generateFastpass(def.shape);
			payload = fastpass(payload, ctx);
			if (!catchall) return payload;
			return handleCatchall([], input, payload, ctx, value, inst, ctx?.abortEarly === true);
		}
		return superParse(payload, ctx);
	};
});
function handleUnionResults(results, final, inst, ctx) {
	for (const result of results) if (result.issues.length === 0) {
		final.value = result.value;
		return final;
	}
	const nonaborted = results.filter((r) => !aborted(r));
	if (nonaborted.length === 1) {
		final.value = nonaborted[0].value;
		return nonaborted[0];
	}
	final.issues.push({
		code: "invalid_union",
		input: final.value,
		inst,
		errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
	});
	return final;
}
const $ZodUnion = /*@__PURE__*/ $constructor("$ZodUnion", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "optin", (zod) => zod.def.options.some((o) => o._zod.optin === "defaulted") ? "defaulted" : zod.def.options.some((o) => o._zod.optin !== void 0) ? "optional" : void 0);
	defineLazyInternal(inst, "optout", (zod) => zod.def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
	defineLazyInternal(inst, "values", (zod) => {
		if (zod.def.options.every((o) => o._zod.values)) return new Set(zod.def.options.flatMap((option) => Array.from(option._zod.values)));
	});
	defineLazyInternal(inst, "pattern", (zod) => {
		if (zod.def.options.every((o) => o._zod.pattern)) {
			const patterns = zod.def.options.map((o) => o._zod.pattern);
			return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
		}
	});
	const first = def.options.length === 1 ? def.options[0]._zod.run : null;
	inst._zod.parse = (payload, ctx) => {
		if (first) return first(payload, ctx);
		let async = false;
		const results = [];
		for (const option of def.options) {
			const result = option._zod.run({
				value: payload.value,
				issues: []
			}, ctx);
			if (result instanceof Promise) {
				results.push(result);
				async = true;
			} else {
				if (result.issues.length === 0) return result;
				results.push(result);
			}
		}
		if (!async) return handleUnionResults(results, payload, inst, ctx);
		return Promise.all(results).then((results) => {
			return handleUnionResults(results, payload, inst, ctx);
		});
	};
});
function discriminatorMap(def) {
	const map = /* @__PURE__ */ new Map();
	for (const option of def.options) {
		const values = option._zod.propValues?.[def.discriminator];
		if (!values || values.size === 0) throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(option)}"`);
		for (const value of values) if (map.has(value)) {
			if (value !== void 0) throw new Error(`Duplicate discriminator value "${String(value)}"`);
			map.set(value, null);
		} else map.set(value, option);
	}
	return map;
}
const $ZodDiscriminatedUnion = /*@__PURE__*/ $constructor("$ZodDiscriminatedUnion", (inst, def) => {
	def.inclusive = false;
	$ZodUnion.init(inst, def);
	const _super = inst._zod.parse;
	defineLazyInternal(inst, "propValues", (zod) => {
		const propValues = {};
		let undefinedCount = 0;
		for (const option of zod.def.options) {
			const pv = option._zod.propValues;
			if (!pv || Object.keys(pv).length === 0) throw new Error(`Invalid discriminated union option at index "${zod.def.options.indexOf(option)}"`);
			if (pv[zod.def.discriminator]?.has(void 0)) undefinedCount++;
			for (const [k, v] of Object.entries(pv)) {
				if (!Object.prototype.hasOwnProperty.call(propValues, k)) assignProp(propValues, k, /* @__PURE__ */ new Set());
				for (const val of v) propValues[k].add(val);
			}
		}
		if (!zod.def.unionFallback && undefinedCount > 1) propValues[zod.def.discriminator]?.delete(void 0);
		return propValues;
	});
	def.options.forEach((option, i) => {
		const propShape = rawShape(option._zod.def);
		if (propShape && !Object.prototype.hasOwnProperty.call(propShape, def.discriminator)) throw new Error(`Invalid discriminated union option at index "${i}"`);
	});
	const disc = cached(() => discriminatorMap(def));
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		if (!isObject(input)) {
			payload.issues.push({
				code: "invalid_type",
				expected: "object",
				input,
				inst
			});
			return payload;
		}
		const value = input?.[def.discriminator];
		const opt = disc.value.get(value);
		if (opt && (value !== void 0 || ctx.direction !== "backward")) return opt._zod.run(payload, ctx);
		if (def.unionFallback || ctx.direction === "backward") return _super(payload, ctx);
		payload.issues.push({
			code: "invalid_union",
			errors: [],
			note: "No matching discriminator",
			discriminator: def.discriminator,
			options: Array.from(disc.value.keys()).filter((value) => disc.value.get(value) !== null),
			input,
			path: [def.discriminator],
			inst
		});
		return payload;
	};
});
const $ZodIntersection = /*@__PURE__*/ $constructor("$ZodIntersection", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, ctx) => {
		const input = payload.value;
		const left = def.left._zod.run({
			value: input,
			issues: []
		}, ctx);
		const right = def.right._zod.run({
			value: input,
			issues: []
		}, ctx);
		if (left instanceof Promise || right instanceof Promise) return Promise.all([left, right]).then(([left, right]) => {
			return handleIntersectionResults(payload, left, right);
		});
		return handleIntersectionResults(payload, left, right);
	};
});
function mergeValues(a, b) {
	if (a === b) return {
		valid: true,
		data: a
	};
	if (a instanceof Date && b instanceof Date && +a === +b) return {
		valid: true,
		data: a
	};
	if (isPlainObject(a) && isPlainObject(b)) {
		const bKeys = Object.keys(b);
		const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
		const newObj = {
			...a,
			...b
		};
		if (Object.prototype.hasOwnProperty.call(newObj, "__proto__")) delete newObj.__proto__;
		for (const key of sharedKeys) {
			if (key === "__proto__") continue;
			const sharedValue = mergeValues(a[key], b[key]);
			if (!sharedValue.valid) return {
				valid: false,
				mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
			};
			newObj[key] = sharedValue.data;
		}
		return {
			valid: true,
			data: newObj
		};
	}
	if (Array.isArray(a) && Array.isArray(b)) {
		if (a.length !== b.length) return {
			valid: false,
			mergeErrorPath: []
		};
		const newArray = [];
		for (let index = 0; index < a.length; index++) {
			const itemA = a[index];
			const itemB = b[index];
			const sharedValue = mergeValues(itemA, itemB);
			if (!sharedValue.valid) return {
				valid: false,
				mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
			};
			newArray.push(sharedValue.data);
		}
		return {
			valid: true,
			data: newArray
		};
	}
	return {
		valid: false,
		mergeErrorPath: []
	};
}
function handleIntersectionResults(result, left, right) {
	const unrecKeys = /* @__PURE__ */ new Map();
	let unrecIssue;
	const keyIssues = /* @__PURE__ */ new Map();
	const collect = (iss, side) => {
		let keys;
		if (iss.code === "unrecognized_keys" && !iss.path?.length) {
			unrecIssue ?? (unrecIssue = iss);
			keys = iss.keys;
		} else if (iss.code === "invalid_key" && iss.origin === "record" && iss.path?.length === 1) {
			const k = String(iss.path[0]);
			if (!keyIssues.has(k)) keyIssues.set(k, iss);
			keys = [k];
		} else return false;
		for (const k of keys) {
			if (!unrecKeys.has(k)) unrecKeys.set(k, {});
			unrecKeys.get(k)[side] = true;
		}
		return true;
	};
	for (const iss of left.issues) if (!collect(iss, "l")) result.issues.push(iss);
	for (const iss of right.issues) if (!collect(iss, "r")) result.issues.push(iss);
	const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
	if (bothKeys.length) {
		const aggregated = unrecIssue ? bothKeys.filter((k) => unrecIssue.keys.includes(k)) : [];
		if (aggregated.length) result.issues.push({
			...unrecIssue,
			keys: aggregated
		});
		for (const k of bothKeys) if (!aggregated.includes(k) && keyIssues.has(k)) result.issues.push(keyIssues.get(k));
	}
	const merged = mergeValues(left.value, right.value);
	if (!merged.valid) {
		if (aborted(result)) return result;
		throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
	}
	result.value = merged.data;
	return result;
}
const $ZodEnum = /*@__PURE__*/ $constructor("$ZodEnum", (inst, def) => {
	$ZodType.init(inst, def);
	const values = getEnumValues(def.entries);
	const valuesSet = new Set(values);
	inst._zod.values = valuesSet;
	defineLazyInternal(inst, "pattern", (zod) => {
		const patternValues = getEnumValues(zod.def.entries).filter((k) => propertyKeyTypes.has(typeof k));
		return new RegExp(patternValues.length ? `^(${patternValues.map((o) => escapeRegex(o.toString())).join("|")})$` : "^[^\\s\\S]$");
	});
	inst._zod.parse = (payload, _ctx) => {
		const input = payload.value;
		if (valuesSet.has(input)) return payload;
		payload.issues.push({
			code: "invalid_value",
			values,
			input,
			inst
		});
		return payload;
	};
});
const $ZodLiteral = /*@__PURE__*/ $constructor("$ZodLiteral", (inst, def) => {
	$ZodType.init(inst, def);
	const values = new Set(def.values);
	inst._zod.values = values;
	defineLazyInternal(inst, "pattern", (zod) => {
		const vals = zod.def.values;
		return new RegExp(vals.length ? `^(${vals.map((o) => typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$` : "^[^\\s\\S]$");
	});
	inst._zod.parse = (payload, _ctx) => {
		const input = payload.value;
		if (values.has(input)) return payload;
		payload.issues.push({
			code: "invalid_value",
			values: def.values,
			input,
			inst
		});
		return payload;
	};
});
const $ZodTransform = /*@__PURE__*/ $constructor("$ZodTransform", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "optional";
	globalConfig.memoizer?.guard(inst);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
		const _out = def.transform(payload.value, payload);
		if (ctx.async) return (_out instanceof Promise ? _out : Promise.resolve(_out)).then((output) => {
			payload.value = output;
			return payload;
		});
		if (_out instanceof Promise) throw new $ZodAsyncError();
		payload.value = _out;
		return payload;
	};
});
function handleOptionalResult(payload, result) {
	payload.value = result.issues.length ? void 0 : result.value;
	return payload;
}
const $ZodOptional = /*@__PURE__*/ $constructor("$ZodOptional", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional");
	inst._zod.optout = "optional";
	defineLazyInternal(inst, "values", (zod) => {
		const values = zod.def.innerType._zod.values;
		return values ? /* @__PURE__ */ new Set([...values, void 0]) : void 0;
	});
	defineLazyInternal(inst, "pattern", (zod) => {
		const pattern = zod.def.innerType._zod.pattern;
		return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		if (payload.value === void 0) {
			if (def.innerType._zod.optin !== "defaulted") return payload;
			const result = def.innerType._zod.run({
				value: payload.value,
				issues: []
			}, ctx);
			if (result instanceof Promise) return result.then((result) => handleOptionalResult(payload, result));
			return handleOptionalResult(payload, result);
		}
		return def.innerType._zod.run(payload, ctx);
	};
});
const $ZodExactOptional = /*@__PURE__*/ $constructor("$ZodExactOptional", (inst, def) => {
	$ZodOptional.init(inst, def);
	defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
	defineLazyInternal(inst, "pattern", (zod) => zod.def.innerType._zod.pattern);
	inst._zod.parse = (payload, ctx) => {
		return def.innerType._zod.run(payload, ctx);
	};
});
const $ZodNullable = /*@__PURE__*/ $constructor("$ZodNullable", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin);
	defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout);
	defineLazyInternal(inst, "pattern", (zod) => {
		const pattern = zod.def.innerType._zod.pattern;
		return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
	});
	defineLazyInternal(inst, "values", (zod) => {
		return zod.def.innerType._zod.values ? /* @__PURE__ */ new Set([...zod.def.innerType._zod.values, null]) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		if (payload.value === null) return payload;
		return def.innerType._zod.run(payload, ctx);
	};
});
const $ZodDefault = /*@__PURE__*/ $constructor("$ZodDefault", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "defaulted";
	defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		if (payload.value === void 0) {
			payload.value = def.defaultValue;
			/**
			* $ZodDefault returns the default value immediately in forward direction.
			* It doesn't pass the default value into the validator ("prefault"). There's no reason to pass the default value through validation. The validity of the default is enforced by TypeScript statically. Otherwise, it's the responsibility of the user to ensure the default is valid. In the case of pipes with divergent in/out types, you can specify the default on the `in` schema of your ZodPipe to set a "prefault" for the pipe.   */
			return payload;
		}
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then((result) => handleDefaultResult(result, def));
		return handleDefaultResult(result, def);
	};
});
function handleDefaultResult(payload, def) {
	if (payload.value === void 0) payload.value = def.defaultValue;
	return payload;
}
const $ZodPrefault = /*@__PURE__*/ $constructor("$ZodPrefault", (inst, def) => {
	$ZodType.init(inst, def);
	inst._zod.optin = "defaulted";
	defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		if (payload.value === void 0) payload.value = def.defaultValue;
		return def.innerType._zod.run(payload, ctx);
	};
});
const $ZodNonOptional = /*@__PURE__*/ $constructor("$ZodNonOptional", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "values", (zod) => {
		const v = zod.def.innerType._zod.values;
		return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
	});
	inst._zod.parse = (payload, ctx) => {
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then((result) => handleNonOptionalResult(result, inst));
		return handleNonOptionalResult(result, inst);
	};
});
function handleNonOptionalResult(payload, inst) {
	if (!payload.issues.length && payload.value === void 0) payload.issues.push({
		code: "invalid_type",
		expected: "nonoptional",
		input: payload.value,
		inst
	});
	return payload;
}
function handleCatchResult(payload, result, def, ctx) {
	if (!result.issues.length) {
		payload.value = result.value;
		if (result.memo) payload.memo = true;
		return payload;
	}
	payload.value = def.catchValue({
		...result,
		value: payload.value,
		error: { issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config())) },
		input: payload.value
	});
	return payload;
}
const $ZodCatch = /*@__PURE__*/ $constructor("$ZodCatch", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional");
	defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout);
	defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		const result = def.innerType._zod.run({
			value: payload.value,
			issues: []
		}, ctx);
		if (result instanceof Promise) return result.then((result) => handleCatchResult(payload, result, def, ctx));
		return handleCatchResult(payload, result, def, ctx);
	};
});
const $ZodPipe = /*@__PURE__*/ $constructor("$ZodPipe", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "values", (zod) => zod.def.in._zod.values);
	defineLazyInternal(inst, "optin", (zod) => zod.def.in._zod.optin);
	defineLazyInternal(inst, "optout", (zod) => zod.def.out._zod.optout);
	defineLazyInternal(inst, "propValues", (zod) => zod.def.in._zod.propValues);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") {
			const right = def.out._zod.run(payload, ctx);
			if (right instanceof Promise) return right.then((right) => handlePipeResult(right, def.in, ctx));
			return handlePipeResult(right, def.in, ctx);
		}
		const left = def.in._zod.run(payload, ctx);
		if (left instanceof Promise) return left.then((left) => handlePipeResult(left, def.out, ctx));
		return handlePipeResult(left, def.out, ctx);
	};
});
function handlePipeResult(left, next, ctx) {
	if (left.issues.some((iss) => iss.code !== "unrecognized_keys")) {
		left.aborted = true;
		return left;
	}
	return next._zod.run({
		value: left.value,
		issues: left.issues
	}, ctx);
}
const $ZodReadonly = /*@__PURE__*/ $constructor("$ZodReadonly", (inst, def) => {
	$ZodType.init(inst, def);
	defineLazyInternal(inst, "propValues", (zod) => zod.def.innerType._zod.propValues);
	defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
	defineLazyInternal(inst, "optin", (zod) => zod.def.innerType?._zod?.optin);
	defineLazyInternal(inst, "optout", (zod) => zod.def.innerType?._zod?.optout);
	inst._zod.parse = (payload, ctx) => {
		if (ctx.direction === "backward") return def.innerType._zod.run(payload, ctx);
		const result = def.innerType._zod.run(payload, ctx);
		if (result instanceof Promise) return result.then(handleReadonlyResult);
		return handleReadonlyResult(result);
	};
});
function handleReadonlyResult(payload) {
	if (!payload.memo) payload.value = Object.freeze(payload.value);
	return payload;
}
const $ZodCustom = /*@__PURE__*/ $constructor("$ZodCustom", (inst, def) => {
	$ZodCheck.init(inst, def);
	$ZodType.init(inst, def);
	inst._zod.parse = (payload, _) => {
		return payload;
	};
	inst._zod.check = (payload) => {
		const input = payload.value;
		const r = def.fn(input);
		if (r instanceof Promise) return r.then((r) => handleRefineResult(r, payload, input, inst));
		handleRefineResult(r, payload, input, inst);
	};
});
function handleRefineResult(result, payload, input, inst) {
	if (!result) {
		const _iss = {
			code: "custom",
			input,
			inst,
			path: [...inst._zod.def.path ?? []],
			continue: !inst._zod.def.abort
		};
		if (inst._zod.def.params) _iss.params = inst._zod.def.params;
		payload.issues.push(issue(_iss));
	}
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/memoizer.js
var $ZodCyclicError = class extends Error {
	constructor() {
		super(`Cannot parse a reference cycle that closes through a transform`);
		this.name = "ZodCyclicError";
	}
};
/** Keyed off the context object every schema in one parse call already shares. */
const STATE = "~memo";
const NO_ISSUES = [];
function isRef(value) {
	return value !== null && typeof value === "object";
}
function cloneIssues(issues) {
	return issues.map((iss) => iss.path ? {
		...iss,
		path: iss.path.slice()
	} : { ...iss });
}
const recursive = /*@__PURE__*/ new WeakMap();
/** What the walk established, in order of certainty: ordered so the strongest answer among children wins. */
const NONE = 0;
const ASSUMED = 1;
const PROVEN = 2;
/** Whether this schema's subtree contains a cycle, so one parse can re-enter it. */
function isRecursive(inst, stack, resolve) {
	const cached = recursive.get(inst);
	if (cached !== void 0) return cached ? PROVEN : NONE;
	if (stack.has(inst)) return PROVEN;
	stack.add(inst);
	let result = NONE;
	const check = (child) => {
		if (result !== PROVEN && child?._zod) {
			const answer = isRecursive(child, stack, resolve);
			if (answer > result) result = answer;
		}
	};
	const shape = (sh, spread) => {
		let answer = NONE;
		for (const key of Reflect.ownKeys(sh)) {
			const desc = Object.getOwnPropertyDescriptor(sh, key);
			if (spread && !desc.enumerable) continue;
			const child = desc.get ? ASSUMED : desc.value?._zod ? isRecursive(desc.value, stack, resolve) : NONE;
			if (child > answer) answer = child;
		}
		return answer;
	};
	const merge = (answer) => {
		if (answer > result) result = answer;
	};
	const def = inst._zod.def;
	switch (def.type) {
		case "object": {
			const raw = rawShape(def);
			merge(raw ? shape(raw, true) : ASSUMED);
			check(def.catchall);
			break;
		}
		case "array":
			check(def.element);
			break;
		case "tuple":
			for (const el of def.items) check(el);
			check(def.rest);
			break;
		case "record":
		case "map":
			check(def.keyType);
			check(def.valueType);
			break;
		case "set":
			check(def.valueType);
			break;
		case "union":
			for (const el of def.options) check(el);
			break;
		case "intersection":
			check(def.left);
			check(def.right);
			break;
		case "optional":
		case "nullable":
		case "default":
		case "prefault":
		case "catch":
		case "readonly":
		case "nonoptional":
		case "promise":
		case "success":
			check(def.innerType);
			break;
		case "pipe":
			check(def.in);
			check(def.out);
			break;
		case "function":
			check(def.input);
			check(def.output);
			break;
		case "lazy": {
			const inner = def._cachedInner ?? (resolve ? inst._zod.innerType : void 0);
			merge(inner ? isRecursive(inner, stack, false) : ASSUMED);
			break;
		}
		case "template_literal":
		case "string":
		case "number":
		case "int":
		case "boolean":
		case "bigint":
		case "symbol":
		case "undefined":
		case "null":
		case "void":
		case "never":
		case "any":
		case "unknown":
		case "date":
		case "nan":
		case "enum":
		case "literal":
		case "file":
		case "transform":
		case "custom": break;
		default: for (const key in def) {
			const desc = Object.getOwnPropertyDescriptor(def, key);
			if (!desc || desc.get) continue;
			const value = desc.value;
			if (!value || typeof value !== "object") continue;
			if (value._zod) check(value);
			else if (Array.isArray(value)) for (const el of value) check(el);
		}
	}
	stack.delete(inst);
	return settle(inst, result);
}
/** An assumed answer must not outlive the resolution that settles it, so only a certain one is cached. */
function settle(inst, answer) {
	if (answer !== ASSUMED) recursive.set(inst, answer === PROVEN);
	return answer;
}
function bucketFor(state, inst) {
	let bucket = state.buckets.get(inst);
	if (!bucket) {
		bucket = /* @__PURE__ */ new WeakMap();
		state.buckets.set(inst, bucket);
	}
	return bucket;
}
let handoff;
const open = [];
const memo = {
	alloc(_inst, payload, empty) {
		const bucket = handoff;
		if (!bucket) return empty;
		handoff = void 0;
		const entry = {
			value: empty,
			issues: null
		};
		bucket.set(payload.value, entry);
		open.push(entry);
		return empty;
	},
	guard(inst) {
		var _a;
		(_a = inst._zod).deferred ?? (_a.deferred = []);
		inst._zod.deferred.push(() => {
			const base = inst._zod.parse;
			const wrapped = (payload, ctx) => {
				if (ctx.direction !== "backward" && isBackEdge(ctx, payload.value)) throw new $ZodCyclicError();
				return base(payload, ctx);
			};
			inst._zod.parse = wrapped;
			if (inst._zod.run === base) inst._zod.run = wrapped;
		});
	},
	attach(inst) {
		var _a;
		let isRecursiveInst;
		let rechecked = false;
		let lastCtx;
		let lastBucket;
		(_a = inst._zod).deferred ?? (_a.deferred = []);
		inst._zod.deferred.push(() => {
			const base = inst._zod.parse;
			const wrapped = (payload, ctx) => {
				if (isRecursiveInst === void 0) {
					const walked = isRecursive(inst, /* @__PURE__ */ new Set(), false);
					if (walked === NONE) {
						inst._zod.parse = base;
						if (inst._zod.run === wrapped) inst._zod.run = base;
						return base(payload, ctx);
					}
					if (walked === PROVEN || rechecked) isRecursiveInst = true;
					else rechecked = true;
				}
				const input = payload.value;
				if (!isRef(input)) return base(payload, ctx);
				let state = ctx[STATE];
				if (!state) {
					state = {
						buckets: /* @__PURE__ */ new WeakMap(),
						backEdges: void 0
					};
					ctx[STATE] = state;
				}
				let bucket;
				if (lastCtx === ctx) bucket = lastBucket;
				else {
					bucket = bucketFor(state, inst);
					lastCtx = ctx;
					lastBucket = bucket;
				}
				const hit = bucket.get(input);
				if (hit) {
					payload.value = hit.value;
					if (hit.issues) {
						if (hit.issues.length) payload.issues.push(...cloneIssues(hit.issues));
					} else {
						payload.memo = true;
						state.backEdges ?? (state.backEdges = /* @__PURE__ */ new WeakSet());
						state.backEdges.add(hit.value);
					}
					return payload;
				}
				handoff = bucket;
				const depth = open.length;
				const result = base(payload, ctx);
				handoff = void 0;
				const entry = open.length > depth ? open.pop() : void 0;
				if (result instanceof Promise) return result.then((r) => {
					if (entry) entry.issues = r.issues.length ? cloneIssues(r.issues) : NO_ISSUES;
					return r;
				});
				if (entry) entry.issues = result.issues.length ? cloneIssues(result.issues) : NO_ISSUES;
				return result;
			};
			inst._zod.parse = wrapped;
			if (inst._zod.run === base) inst._zod.run = wrapped;
		});
	}
};
/** The memoizer that gives containers cycle support. `zod` installs it by default; `zod/mini` opts in with `config({ memoizer: memoizer() })`. */
function memoizer() {
	return memo;
}
/** Whether this value is a node a back-edge resolved to before it finished. */
function isBackEdge(ctx, value) {
	const backEdges = ctx[STATE]?.backEdges;
	return backEdges !== void 0 && isRef(value) && backEdges.has(value);
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/locales/en.js
const error = () => {
	const Sizable = {
		string: {
			unit: "characters",
			verb: "to have"
		},
		file: {
			unit: "bytes",
			verb: "to have"
		},
		array: {
			unit: "items",
			verb: "to have"
		},
		set: {
			unit: "items",
			verb: "to have"
		},
		map: {
			unit: "entries",
			verb: "to have"
		}
	};
	function getSizing(origin) {
		return Sizable[origin] ?? null;
	}
	const FormatDictionary = {
		regex: "input",
		email: "email address",
		url: "URL",
		emoji: "emoji",
		uuid: "UUID",
		uuidv4: "UUIDv4",
		uuidv6: "UUIDv6",
		nanoid: "nanoid",
		guid: "GUID",
		cuid: "cuid",
		cuid2: "cuid2",
		ulid: "ULID",
		xid: "XID",
		ksuid: "KSUID",
		datetime: "ISO datetime",
		date: "ISO date",
		time: "ISO time",
		duration: "ISO duration",
		ipv4: "IPv4 address",
		ipv6: "IPv6 address",
		mac: "MAC address",
		cidrv4: "IPv4 range",
		cidrv6: "IPv6 range",
		base64: "base64-encoded string",
		base64url: "base64url-encoded string",
		json_string: "JSON string",
		e164: "E.164 number",
		currency_code: "currency code",
		credit_card: "credit card number",
		iban: "IBAN",
		jwt: "JWT",
		template_literal: "input"
	};
	const TypeDictionary = { nan: "NaN" };
	function getTypeName(type, input) {
		if (type === "number" && typeof input === "number" && !Number.isFinite(input)) return String(input);
		return TypeDictionary[type] ?? type;
	}
	return (issue) => {
		switch (issue.code) {
			case "invalid_type": return `Invalid input: expected ${getTypeName(issue.expected)}, received ${getTypeName(parsedType(issue.input), issue.input)}`;
			case "invalid_value":
				if (issue.values.length === 1) return `Invalid input: expected ${stringifyPrimitive(issue.values[0])}`;
				return `Invalid option: expected one of ${joinValues(issue.values, "|")}`;
			case "too_big": {
				const adj = issue.exact ? "exactly " : issue.inclusive ? "<=" : "<";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Too big: expected ${issue.origin ?? "value"} to have ${adj}${issue.maximum.toString()} ${sizing.unit ?? "elements"}`;
				return `Too big: expected ${issue.origin ?? "value"} to be ${adj}${issue.maximum.toString()}`;
			}
			case "too_small": {
				const adj = issue.exact ? "exactly " : issue.inclusive ? ">=" : ">";
				const sizing = getSizing(issue.origin);
				if (sizing) return `Too small: expected ${issue.origin} to have ${adj}${issue.minimum.toString()} ${sizing.unit}`;
				return `Too small: expected ${issue.origin} to be ${adj}${issue.minimum.toString()}`;
			}
			case "invalid_format": {
				const _issue = issue;
				if (_issue.format === "starts_with") return `Invalid string: must start with "${_issue.prefix}"`;
				if (_issue.format === "ends_with") return `Invalid string: must end with "${_issue.suffix}"`;
				if (_issue.format === "includes") return `Invalid string: must include "${_issue.includes}"`;
				if (_issue.format === "regex") return `Invalid string: must match pattern ${_issue.pattern}`;
				return `Invalid ${FormatDictionary[_issue.format] ?? issue.format}`;
			}
			case "not_multiple_of": return `Invalid number: must be a multiple of ${issue.divisor}`;
			case "unrecognized_keys": return `Unrecognized key${issue.keys.length > 1 ? "s" : ""}: ${joinValues(issue.keys, ", ")}`;
			case "invalid_key": return `Invalid key in ${issue.origin}`;
			case "invalid_union":
				if (issue.options && Array.isArray(issue.options) && issue.options.length > 0) return `Invalid discriminator value. Expected ${issue.options.map((o) => `'${o}'`).join(" | ")}`;
				if (issue.inclusive === false) return "Invalid input: more than one option matched";
				return "Invalid input";
			case "invalid_element": return `Invalid value in ${issue.origin}`;
			default: return `Invalid input`;
		}
	};
};
function en_default() {
	return { localeError: error() };
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/registries.js
var _a;
var $ZodRegistry = class {
	constructor() {
		this._map = /* @__PURE__ */ new WeakMap();
		this._idmap = /* @__PURE__ */ new Map();
	}
	add(schema, ..._meta) {
		const meta = _meta[0];
		this._map.set(schema, meta);
		if (meta && typeof meta === "object" && "id" in meta) this._idmap.set(meta.id, schema);
		return this;
	}
	clear() {
		this._map = /* @__PURE__ */ new WeakMap();
		this._idmap = /* @__PURE__ */ new Map();
		return this;
	}
	remove(schema) {
		const meta = this._map.get(schema);
		if (meta && typeof meta === "object" && "id" in meta) this._idmap.delete(meta.id);
		this._map.delete(schema);
		return this;
	}
	get(schema) {
		const p = schema._zod.parent;
		if (p) {
			const pm = { ...this.get(p) ?? {} };
			delete pm.id;
			const f = {
				...pm,
				...this._map.get(schema)
			};
			return Object.keys(f).length ? f : void 0;
		}
		return this._map.get(schema);
	}
	has(schema) {
		return this._map.has(schema);
	}
};
function registry() {
	return new $ZodRegistry();
}
(_a = globalThis).__zod_globalRegistry ?? (_a.__zod_globalRegistry = registry());
const globalRegistry = globalThis.__zod_globalRegistry;
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/api.js
function snapshotChecks(def) {
	if (def.checks) def.checks = [...def.checks];
	return def;
}
// @__NO_SIDE_EFFECTS__
function _string(Class, params) {
	return new Class(snapshotChecks({
		type: "string",
		...normalizeParams(params)
	}));
}
// @__NO_SIDE_EFFECTS__
function _email(Class, params) {
	return new Class({
		type: "string",
		format: "email",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _guid(Class, params) {
	return new Class({
		type: "string",
		format: "guid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uuid(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uuidv4(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v4",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uuidv6(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v6",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uuidv7(Class, params) {
	return new Class({
		type: "string",
		format: "uuid",
		check: "string_format",
		abort: false,
		version: "v7",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _url(Class, params) {
	return new Class({
		type: "string",
		format: "url",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _emoji(Class, params) {
	return new Class({
		type: "string",
		format: "emoji",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _nanoid(Class, params) {
	return new Class({
		type: "string",
		format: "nanoid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link _cuid2} instead.
* See https://github.com/paralleldrive/cuid.
*/
// @__NO_SIDE_EFFECTS__
function _cuid(Class, params) {
	return new Class({
		type: "string",
		format: "cuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _cuid2(Class, params) {
	return new Class({
		type: "string",
		format: "cuid2",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _ulid(Class, params) {
	return new Class({
		type: "string",
		format: "ulid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _xid(Class, params) {
	return new Class({
		type: "string",
		format: "xid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _ksuid(Class, params) {
	return new Class({
		type: "string",
		format: "ksuid",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _ipv4(Class, params) {
	return new Class({
		type: "string",
		format: "ipv4",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _ipv6(Class, params) {
	return new Class({
		type: "string",
		format: "ipv6",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _cidrv4(Class, params) {
	return new Class({
		type: "string",
		format: "cidrv4",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _cidrv6(Class, params) {
	return new Class({
		type: "string",
		format: "cidrv6",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _base64(Class, params) {
	return new Class({
		type: "string",
		format: "base64",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _base64url(Class, params) {
	return new Class({
		type: "string",
		format: "base64url",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _e164(Class, params) {
	return new Class({
		type: "string",
		format: "e164",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _jwt(Class, params) {
	return new Class({
		type: "string",
		format: "jwt",
		check: "string_format",
		abort: false,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _isoDateTime(Class, params) {
	return new Class({
		type: "string",
		format: "datetime",
		check: "string_format",
		offset: false,
		local: false,
		precision: null,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _isoDate(Class, params) {
	return new Class({
		type: "string",
		format: "date",
		check: "string_format",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _isoTime(Class, params) {
	return new Class({
		type: "string",
		format: "time",
		check: "string_format",
		precision: null,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _isoDuration(Class, params) {
	return new Class({
		type: "string",
		format: "duration",
		check: "string_format",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _number(Class, params) {
	return new Class(snapshotChecks({
		type: "number",
		checks: [],
		...normalizeParams(params)
	}));
}
// @__NO_SIDE_EFFECTS__
function _int(Class, params) {
	return new Class({
		type: "number",
		check: "number_format",
		abort: false,
		format: "safeint",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _unknown(Class) {
	return new Class({ type: "unknown" });
}
// @__NO_SIDE_EFFECTS__
function _never(Class, params) {
	return new Class({
		type: "never",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _lt(value, params) {
	return new $ZodCheckLessThan({
		check: "less_than",
		...normalizeParams(params),
		value,
		inclusive: false
	});
}
// @__NO_SIDE_EFFECTS__
function _lte(value, params) {
	return new $ZodCheckLessThan({
		check: "less_than",
		...normalizeParams(params),
		value,
		inclusive: true
	});
}
// @__NO_SIDE_EFFECTS__
function _gt(value, params) {
	return new $ZodCheckGreaterThan({
		check: "greater_than",
		...normalizeParams(params),
		value,
		inclusive: false
	});
}
// @__NO_SIDE_EFFECTS__
function _gte(value, params) {
	return new $ZodCheckGreaterThan({
		check: "greater_than",
		...normalizeParams(params),
		value,
		inclusive: true
	});
}
// @__NO_SIDE_EFFECTS__
function _multipleOf(value, params) {
	return new $ZodCheckMultipleOf({
		check: "multiple_of",
		...normalizeParams(params),
		value
	});
}
// @__NO_SIDE_EFFECTS__
function _maxLength(maximum, params) {
	return new $ZodCheckMaxLength({
		check: "max_length",
		...normalizeParams(params),
		maximum
	});
}
// @__NO_SIDE_EFFECTS__
function _minLength(minimum, params) {
	return new $ZodCheckMinLength({
		check: "min_length",
		...normalizeParams(params),
		minimum
	});
}
// @__NO_SIDE_EFFECTS__
function _length(length, params) {
	return new $ZodCheckLengthEquals({
		check: "length_equals",
		...normalizeParams(params),
		length
	});
}
// @__NO_SIDE_EFFECTS__
function _regex(pattern, params) {
	return new $ZodCheckRegex({
		check: "string_format",
		format: "regex",
		...normalizeParams(params),
		pattern
	});
}
// @__NO_SIDE_EFFECTS__
function _lowercase(params) {
	return new $ZodCheckLowerCase({
		check: "string_format",
		format: "lowercase",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _uppercase(params) {
	return new $ZodCheckUpperCase({
		check: "string_format",
		format: "uppercase",
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _includes(includes, params) {
	return new $ZodCheckIncludes({
		check: "string_format",
		format: "includes",
		...normalizeParams(params),
		includes
	});
}
// @__NO_SIDE_EFFECTS__
function _startsWith(prefix, params) {
	return new $ZodCheckStartsWith({
		check: "string_format",
		format: "starts_with",
		...normalizeParams(params),
		prefix
	});
}
// @__NO_SIDE_EFFECTS__
function _endsWith(suffix, params) {
	return new $ZodCheckEndsWith({
		check: "string_format",
		format: "ends_with",
		...normalizeParams(params),
		suffix
	});
}
// @__NO_SIDE_EFFECTS__
function _overwrite(tx) {
	return new $ZodCheckOverwrite({
		check: "overwrite",
		tx
	});
}
// @__NO_SIDE_EFFECTS__
function _normalize(form) {
	return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
}
// @__NO_SIDE_EFFECTS__
function _trim() {
	return /* @__PURE__ */ _overwrite((input) => input.trim());
}
// @__NO_SIDE_EFFECTS__
function _toLowerCase() {
	return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
}
// @__NO_SIDE_EFFECTS__
function _toUpperCase() {
	return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
}
// @__NO_SIDE_EFFECTS__
function _slugify() {
	return /* @__PURE__ */ _overwrite((input) => slugify(input));
}
// @__NO_SIDE_EFFECTS__
function _array(Class, element, params) {
	return new Class({
		type: "array",
		element,
		...normalizeParams(params)
	});
}
// @__NO_SIDE_EFFECTS__
function _refine(Class, fn, _params) {
	return new Class({
		type: "custom",
		check: "custom",
		fn,
		...normalizeParams(_params)
	});
}
// @__NO_SIDE_EFFECTS__
function _superRefine(fn, params) {
	const ch = /* @__PURE__ */ _check((payload) => {
		payload.addIssue = (issue$2) => {
			if (typeof issue$2 === "string") payload.issues.push(issue(issue$2, payload.value, ch._zod.def));
			else {
				const _issue = issue$2;
				if (_issue.fatal) _issue.continue = false;
				_issue.code ?? (_issue.code = "custom");
				if (!("input" in _issue)) _issue.input = payload.value;
				_issue.inst ?? (_issue.inst = ch);
				_issue.continue ?? (_issue.continue = !ch._zod.def.abort);
				payload.issues.push(issue(_issue));
			}
		};
		return fn(payload.value, payload);
	}, params);
	return ch;
}
// @__NO_SIDE_EFFECTS__
function _check(fn, params) {
	const ch = new $ZodCheck({
		check: "custom",
		...normalizeParams(params)
	});
	ch._zod.check = fn;
	return ch;
}
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/to-json-schema.js
function assignProps(target, ...sources) {
	for (const source of sources) for (const key of Reflect.ownKeys(source)) if (Object.prototype.propertyIsEnumerable.call(source, key)) assignProp(target, key, source[key]);
	return target;
}
function initializeContext(params) {
	let target = params?.target ?? "draft-2020-12";
	if (target === "draft-4") target = "draft-04";
	if (target === "draft-7") target = "draft-07";
	return {
		processors: params.processors ?? {},
		metadataRegistry: params?.metadata ?? globalRegistry,
		target,
		unrepresentable: params?.unrepresentable ?? "throw",
		override: params?.override ?? (() => {}),
		io: params?.io ?? "output",
		counter: 0,
		seen: /* @__PURE__ */ new Map(),
		sharedDefsExtractedFor: void 0,
		sharedEmitDoneFor: void 0,
		cycles: params?.cycles ?? "ref",
		reused: params?.reused ?? "inline",
		intersections: [],
		deferred: [],
		external: params?.external ?? void 0
	};
}
/**
* Applies the `unrepresentable` setting at a site that has no JSON Schema equivalent. Throws
* `message` unless the setting (or the handler's return value) says otherwise. Returns `true` if a
* custom JSON Schema was written into `json`, in which case the caller must not write its own.
*/
function handleUnrepresentable(schema, ctx, json, params, message) {
	const result = typeof ctx.unrepresentable === "function" ? ctx.unrepresentable({
		zodSchema: schema,
		path: params.path,
		message
	}) : ctx.unrepresentable;
	if (result === "any") return false;
	if (result === void 0 || result === "throw") throw new Error(message);
	Object.assign(json, result);
	return true;
}
function processSchema(schema, ctx, _params = {
	path: [],
	schemaPath: []
}) {
	var _a;
	const def = schema._zod.def;
	const seen = ctx.seen.get(schema);
	if (seen) {
		seen.count++;
		if (_params.schemaPath.includes(schema)) seen.cycle = _params.path;
		return seen.schema;
	}
	const result = {
		schema: {},
		count: 1,
		cycle: void 0,
		path: _params.path
	};
	ctx.seen.set(schema, result);
	ctx.sharedDefsExtractedFor = void 0;
	ctx.sharedEmitDoneFor = void 0;
	const overrideSchema = schema._zod.toJSONSchema?.();
	if (overrideSchema) result.schema = overrideSchema;
	else {
		const params = {
			..._params,
			schemaPath: [..._params.schemaPath, schema],
			path: _params.path
		};
		if (schema._zod.processJSONSchema) schema._zod.processJSONSchema(ctx, result.schema, params);
		else {
			const _json = result.schema;
			const processor = ctx.processors[def.type];
			if (!processor) throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
			processor(schema, ctx, _json, params);
		}
		const parent = schema._zod.parent;
		if (parent) {
			if (!result.ref) result.ref = parent;
			processSchema(parent, ctx, params);
			ctx.seen.get(parent).isParent = true;
		}
	}
	const meta = ctx.metadataRegistry.get(schema);
	if (meta) assignProps(result.schema, meta);
	if (ctx.io === "input" && isTransforming(schema)) {
		delete result.schema.examples;
		delete result.schema.default;
	}
	if (ctx.io === "input" && "_prefault" in result.schema) (_a = result.schema).default ?? (_a.default = result.schema._prefault);
	delete result.schema._prefault;
	return ctx.seen.get(schema).schema;
}
function encodeJSONPointerSegment(segment) {
	return segment.replace(/~/g, "~0").replace(/\//g, "~1");
}
function extractDefs(ctx, schema) {
	const root = ctx.seen.get(schema);
	if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
	if (ctx.external && ctx.sharedDefsExtractedFor === ctx.external) return;
	const idToSchema = /* @__PURE__ */ new Map();
	for (const entry of ctx.seen.entries()) {
		const id = ctx.metadataRegistry.get(entry[0])?.id;
		if (id) {
			const existing = idToSchema.get(id);
			if (existing && existing !== entry[0]) throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
			idToSchema.set(id, entry[0]);
		}
	}
	const makeURI = (entry) => {
		const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
		if (ctx.external) {
			const externalId = ctx.external.registry.get(entry[0])?.id;
			const uriGenerator = ctx.external.uri ?? ((id) => id);
			if (externalId) return { ref: uriGenerator(externalId) };
			const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
			entry[1].defId = id;
			return {
				defId: id,
				ref: `${uriGenerator("__shared")}#/${defsSegment}/${encodeJSONPointerSegment(id)}`
			};
		}
		const uriPrefix = `#`;
		const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
		if (entry[1] === root && !entry[1].schema.id) return { ref: uriPrefix };
		const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
		return {
			defId,
			ref: defUriPrefix + encodeJSONPointerSegment(defId)
		};
	};
	const extractToDef = (entry) => {
		if (entry[1].schema.$ref) return;
		const seen = entry[1];
		const { ref, defId } = makeURI(entry);
		seen.def = { ...seen.schema };
		if (defId) seen.defId = defId;
		const schema = seen.schema;
		for (const key in schema) delete schema[key];
		schema.$ref = ref;
	};
	if (ctx.cycles === "throw") for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (seen.cycle) throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
	}
	for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (schema === entry[0]) {
			extractToDef(entry);
			continue;
		}
		if (ctx.external) {
			const ext = ctx.external.registry.get(entry[0])?.id;
			if (schema !== entry[0] && ext) {
				extractToDef(entry);
				continue;
			}
		}
		if (ctx.metadataRegistry.get(entry[0])?.id) {
			extractToDef(entry);
			continue;
		}
		if (seen.cycle) {
			extractToDef(entry);
			continue;
		}
		if (seen.count > 1) {
			if (ctx.reused === "ref") extractToDef(entry);
		}
	}
	if (ctx.external) ctx.sharedDefsExtractedFor = ctx.external;
}
/** Rewrites `anyOf: [{type: "a"}, {type: "b"}]` to `type: ["a", "b"]`, which every JSON Schema draft treats as equivalent and most consumers render far better for the nullable case. Only branches that are a bare type assertion qualify — anything carrying a constraint, `$ref`, `const` or metadata is left alone. Runs after `flattenRef`, so a branch an override decorated or `$defs` extraction turned into a `$ref` is no longer bare and correctly stays in `anyOf`. `oneOf` is excluded: `integer` and `number` overlap, so "exactly one" and "at least one" are not the same there. OpenAPI 3.0 is excluded: its `type` must be a single string. */
function compactTypeUnion(schema) {
	const options = schema.anyOf;
	if (!Array.isArray(options) || options.length === 0 || schema.type !== void 0) return;
	const types = [];
	for (const option of options) {
		if (!option || typeof option !== "object") return;
		compactTypeUnion(option);
		const keys = Object.keys(option);
		if (keys.length !== 1 || keys[0] !== "type") return;
		const type = option.type;
		for (const member of Array.isArray(type) ? type : [type]) {
			if (typeof member !== "string") return;
			if (!types.includes(member)) types.push(member);
		}
	}
	delete schema.anyOf;
	schema.type = types.length === 1 ? types[0] : types;
}
/** Keywords `foldIntersection` knows how to combine. Anything else — `$ref`, `patternProperties`,
* an annotation like `description` — makes a member unfoldable, so a constraint this does not
* understand leaves the `allOf` alone instead of being silently dropped or misattributed. */
const FOLDABLE_KEYS = /* @__PURE__ */ new Set([
	"type",
	"properties",
	"required",
	"additionalProperties"
]);
const UNION_KEYS = ["oneOf", "anyOf"];
/** A member's constraint on a key it does not declare itself. A `catchall` states one; `false`, an absent `additionalProperties`, and the empty schema a loose object emits state nothing. */
function undeclaredConstraint(member) {
	const extra = member.additionalProperties;
	if (extra === void 0 || extra === false || typeof extra !== "object" || extra === null) return null;
	return Object.keys(extra).length ? extra : null;
}
/** Combines object members into the single object they describe together, or returns `null` if any of them carries a keyword outside {@link FOLDABLE_KEYS}. */
function foldObjects(members) {
	const objects = [];
	for (const member of members) {
		if (typeof member !== "object" || member.type !== "object") return null;
		for (const key in member) if (!FOLDABLE_KEYS.has(key)) return null;
		objects.push(member);
	}
	const properties = {};
	const required = /* @__PURE__ */ new Set();
	for (const object of objects) {
		for (const key in object.properties) {
			if (Object.prototype.hasOwnProperty.call(properties, key)) continue;
			const parts = [];
			for (const other of objects) {
				const part = other.properties?.[key] ?? undeclaredConstraint(other);
				if (part === null || part === void 0) continue;
				if (!parts.some((seen) => JSON.stringify(seen) === JSON.stringify(part))) parts.push(part);
			}
			assignProp(properties, key, parts.length === 1 ? parts[0] : foldObjects(parts) ?? { allOf: parts });
		}
		for (const key of object.required ?? []) required.add(key);
	}
	const folded = {
		type: "object",
		properties
	};
	if (required.size) folded.required = [...required];
	if (objects.every((object) => object.additionalProperties === false)) folded.additionalProperties = false;
	else {
		const constraints = [];
		for (const object of objects) {
			const constraint = undeclaredConstraint(object);
			if (constraint && !constraints.some((seen) => JSON.stringify(seen) === JSON.stringify(constraint))) constraints.push(constraint);
		}
		if (constraints.length === 1) folded.additionalProperties = constraints[0];
		else if (constraints.length > 1) folded.additionalProperties = { allOf: constraints };
	}
	return folded;
}
/** `additionalProperties` in an `allOf` member sees only that member's own `properties`, so two
* closed object members reject each other's keys and the schema validates nothing. Zod's parser
* pools the key sets instead — `handleIntersectionResults` reports a key as unrecognized only when
* *every* side rejects it — so the emitted schema has to pool them too, and folding the members
* into one object is the encoding that says so on every target.
*
* This runs from `finalize`, after `extractDefs`, which is what keeps it clear of the `$ref`
* machinery: a member extracted into `$defs` is already a `$ref` by now and declines to fold, so it
* keeps its reference and its own closedness rather than being inlined as a stale copy. */
function foldIntersection(json) {
	const allOf = json.allOf;
	if (!Array.isArray(allOf) || allOf.length < 2) return;
	for (const key of FOLDABLE_KEYS) if (key in json) return;
	const unions = allOf.filter((m) => UNION_KEYS.some((k) => Array.isArray(m[k])));
	let folded = null;
	if (!unions.length) folded = foldObjects(allOf);
	else {
		const union = unions[0];
		const keyword = UNION_KEYS.find((k) => Array.isArray(union[k]));
		if (Object.keys(union).length !== 1) return;
		const rest = allOf.filter((m) => m !== union);
		const branches = union[keyword].map((branch) => foldObjects([...rest, branch]));
		if (branches.some((b) => !b)) return;
		folded = { [keyword]: branches };
	}
	if (!folded) return;
	delete json.allOf;
	assignProps(json, folded);
}
function finalize(ctx, schema) {
	const root = ctx.seen.get(schema);
	if (!root) throw new Error("Unprocessed schema. This is a bug in Zod.");
	const flattenRef = (zodSchema) => {
		const seen = ctx.seen.get(zodSchema);
		if (seen.ref === null) return;
		const schema = seen.def ?? seen.schema;
		const _cached = { ...schema };
		const ref = seen.ref;
		seen.ref = null;
		if (ref) {
			flattenRef(ref);
			const refSeen = ctx.seen.get(ref);
			const refSchema = refSeen.schema;
			if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
				schema.allOf = schema.allOf ?? [];
				schema.allOf.push(refSchema);
			} else assignProps(schema, refSchema);
			assignProps(schema, _cached);
			if (zodSchema._zod.parent === ref) for (const key in schema) {
				if (key === "$ref" || key === "allOf") continue;
				if (!(key in _cached)) delete schema[key];
			}
			if (refSchema.$ref && refSeen.def) for (const key in schema) {
				if (key === "$ref" || key === "allOf") continue;
				if (key in refSeen.def && JSON.stringify(schema[key]) === JSON.stringify(refSeen.def[key])) delete schema[key];
			}
		}
		const parent = zodSchema._zod.parent;
		if (parent && parent !== ref) {
			flattenRef(parent);
			const parentSeen = ctx.seen.get(parent);
			if (parentSeen?.schema.$ref) {
				schema.$ref = parentSeen.schema.$ref;
				if (parentSeen.def) for (const key in schema) {
					if (key === "$ref" || key === "allOf") continue;
					if (key in parentSeen.def && JSON.stringify(schema[key]) === JSON.stringify(parentSeen.def[key])) delete schema[key];
				}
			}
		}
		ctx.override({
			zodSchema,
			jsonSchema: schema,
			path: seen.path ?? []
		});
	};
	if (!ctx.external || ctx.sharedEmitDoneFor !== ctx.external) {
		for (const entry of [...ctx.seen.entries()].reverse()) flattenRef(entry[0]);
		if (ctx.target !== "openapi-3.0") for (const entry of ctx.seen.entries()) compactTypeUnion(entry[1].def ?? entry[1].schema);
		for (const rewrite of ctx.deferred) rewrite();
		if (ctx.intersections.length) {
			const carriers = /* @__PURE__ */ new Map();
			for (const seen of ctx.seen.values()) for (const json of [seen.schema, seen.def]) {
				const allOf = json?.allOf;
				if (!Array.isArray(allOf)) continue;
				const existing = carriers.get(allOf);
				if (existing) existing.push(json);
				else carriers.set(allOf, [json]);
			}
			for (const allOf of ctx.intersections) for (const json of carriers.get(allOf) ?? []) foldIntersection(json);
		}
	}
	const result = {};
	if (ctx.target === "draft-2020-12") result.$schema = "https://json-schema.org/draft/2020-12/schema";
	else if (ctx.target === "draft-07") result.$schema = "http://json-schema.org/draft-07/schema#";
	else if (ctx.target === "draft-04") result.$schema = "http://json-schema.org/draft-04/schema#";
	else if (ctx.target === "openapi-3.0") {}
	if (ctx.external?.uri) {
		const id = ctx.external.registry.get(schema)?.id;
		if (!id) throw new Error("Schema is missing an `id` property");
		result.$id = ctx.external.uri(id);
	}
	assignProps(result, root.defId ? root.schema : root.def ?? root.schema);
	const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
	if (rootMetaId !== void 0 && result.id === rootMetaId) delete result.id;
	const defs = ctx.external?.defs ?? {};
	if (!ctx.external || ctx.sharedEmitDoneFor !== ctx.external) for (const entry of ctx.seen.entries()) {
		const seen = entry[1];
		if (seen.def && seen.defId) {
			if (seen.def.id === seen.defId) delete seen.def.id;
			assignProp(defs, seen.defId, seen.def);
		}
	}
	if (ctx.external) ctx.sharedEmitDoneFor = ctx.external;
	if (ctx.external) {} else if (Object.keys(defs).length > 0) {
		if (ctx.target === "draft-2020-12") result.$defs = defs;
		else result.definitions = defs;
	}
	try {
		const finalized = JSON.parse(JSON.stringify(result));
		Object.defineProperty(finalized, "~standard", {
			value: {
				...schema["~standard"],
				jsonSchema: {
					input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
					output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
				}
			},
			enumerable: false,
			writable: false
		});
		return finalized;
	} catch (_err) {
		throw new Error("Error converting schema to JSON.");
	}
}
function isTransforming(_schema, _ctx) {
	const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
	if (ctx.seen.has(_schema)) return false;
	ctx.seen.add(_schema);
	const def = _schema._zod.def;
	if (def.type === "transform") return true;
	if (def.type === "array") return isTransforming(def.element, ctx);
	if (def.type === "set") return isTransforming(def.valueType, ctx);
	if (def.type === "lazy") return isTransforming(def.getter(), ctx);
	if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault" || def.type === "catch") return isTransforming(def.innerType, ctx);
	if (def.type === "intersection") return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
	if (def.type === "record" || def.type === "map") return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
	if (def.type === "pipe") {
		if (_schema._zod.traits.has("$ZodCodec")) return true;
		return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
	}
	if (def.type === "object") {
		for (const key in def.shape) if (isTransforming(def.shape[key], ctx)) return true;
		return false;
	}
	if (def.type === "union") {
		for (const option of def.options) if (isTransforming(option, ctx)) return true;
		return false;
	}
	if (def.type === "tuple") {
		for (const item of def.items) if (isTransforming(item, ctx)) return true;
		if (def.rest && isTransforming(def.rest, ctx)) return true;
		return false;
	}
	return false;
}
/**
* Creates a toJSONSchema method for a schema instance.
* This encapsulates the logic of initializing context, processing, extracting defs, and finalizing.
*/
const createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
	const ctx = initializeContext({
		...params,
		processors
	});
	processSchema(schema, ctx);
	extractDefs(ctx, schema);
	return finalize(ctx, schema);
};
const createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
	const { libraryOptions, target } = params ?? {};
	const ctx = initializeContext({
		...libraryOptions ?? {},
		target,
		io,
		processors
	});
	processSchema(schema, ctx);
	extractDefs(ctx, schema);
	return finalize(ctx, schema);
};
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/core/json-schema-processors.js
const narrowMin = (agg, key, value) => {
	if (agg[key] === void 0 || value > agg[key]) agg[key] = value;
};
const narrowMax = (agg, key, value) => {
	if (agg[key] === void 0 || value < agg[key]) agg[key] = value;
};
const narrowBoth = (agg, value) => {
	narrowMin(agg, "minimum", value);
	narrowMax(agg, "maximum", value);
};
const addDivisor = (agg, value) => {
	agg.multipleOf ?? (agg.multipleOf = []);
	if (!agg.multipleOf.includes(value)) agg.multipleOf.push(value);
};
const addPattern = (agg, pattern) => {
	agg.patterns ?? (agg.patterns = /* @__PURE__ */ new Set());
	agg.patterns.add(pattern);
};
const intersectMime = (agg, mime) => {
	agg.mime = agg.mime ? agg.mime.filter((m) => mime.includes(m)) : [...mime];
};
const setFormat = (agg, format) => {
	agg.format = format;
	if (format.includes("int")) agg.isInt = true;
};
const minContributor = (agg, def) => narrowMin(agg, "minimum", def.minimum);
const maxContributor = (agg, def) => narrowMax(agg, "maximum", def.maximum);
const formatContributor = (ranges) => (agg, def) => {
	setFormat(agg, def.format);
	const [minimum, maximum] = ranges[def.format];
	narrowMin(agg, "minimum", minimum);
	narrowMax(agg, "maximum", maximum);
};
const contributors = {
	greater_than: (agg, def) => narrowMin(agg, def.inclusive ? "minimum" : "exclusiveMinimum", def.value),
	less_than: (agg, def) => narrowMax(agg, def.inclusive ? "maximum" : "exclusiveMaximum", def.value),
	multiple_of: (agg, def) => addDivisor(agg, def.value),
	number_format: formatContributor(NUMBER_FORMAT_RANGES),
	bigint_format: formatContributor(BIGINT_FORMAT_RANGES),
	min_length: minContributor,
	max_length: maxContributor,
	length_equals: (agg, def) => narrowBoth(agg, def.length),
	min_size: minContributor,
	max_size: maxContributor,
	size_equals: (agg, def) => narrowBoth(agg, def.size),
	string_format: (agg, def) => {
		setFormat(agg, def.format);
		if (def.pattern) addPattern(agg, def.pattern);
		if (def.format === "base64" || def.format === "base64url") agg.contentEncoding = def.format;
		if (def.local || def.precision === -1) agg.laxFormat = true;
	},
	mime_type: (agg, def) => intersectMime(agg, def.mime)
};
function aggregateChecks(schema) {
	const agg = {};
	const def = schema._zod.def;
	const list = schema._zod.traits.has("$ZodCheck") ? [schema, ...def.checks ?? []] : def.checks ?? [];
	for (const ch of list) contributors[ch._zod.def.check]?.(agg, ch._zod.def);
	const bag = schema._zod.bag;
	if (bag.minimum !== void 0) narrowMin(agg, "minimum", bag.minimum);
	if (bag.exclusiveMinimum !== void 0) narrowMin(agg, "exclusiveMinimum", bag.exclusiveMinimum);
	if (bag.maximum !== void 0) narrowMax(agg, "maximum", bag.maximum);
	if (bag.exclusiveMaximum !== void 0) narrowMax(agg, "exclusiveMaximum", bag.exclusiveMaximum);
	if (bag.multipleOf !== void 0) addDivisor(agg, bag.multipleOf);
	if (bag.format !== void 0) {
		agg.format ?? (agg.format = bag.format);
		if (bag.format.includes("int")) agg.isInt = true;
	}
	if (bag.mime) intersectMime(agg, bag.mime);
	for (const pattern of bag.patterns ?? []) addPattern(agg, pattern);
	return agg;
}
const formatMap = {
	guid: "uuid",
	url: "uri",
	datetime: "date-time",
	json_string: "json-string",
	regex: ""
};
const exactPatterns = /* @__PURE__ */ new Map([[base64Charset, base64], [base64urlCharset, base64url]]);
const exactPattern = (p) => exactPatterns.get(p) ?? p;
const stringProcessor = (schema, ctx, _json, _params) => {
	const json = _json;
	json.type = "string";
	const { minimum, maximum, format, patterns, contentEncoding, laxFormat } = aggregateChecks(schema);
	if (typeof minimum === "number") json.minLength = minimum;
	if (typeof maximum === "number") json.maxLength = maximum;
	if (format) {
		json.format = formatMap[format] ?? format;
		if (json.format === "") delete json.format;
		if (format === "time" || laxFormat) delete json.format;
	}
	if (contentEncoding) json.contentEncoding = contentEncoding;
	if (patterns && patterns.size > 0) {
		const patternList = [...patterns].map(exactPattern);
		if (patternList.length === 1) json.pattern = patternList[0].source;
		else if (patternList.length > 1) json.allOf = [...patternList.map((regex) => ({
			...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
			pattern: regex.source
		}))];
	}
};
const numberProcessor = (schema, ctx, _json, params) => {
	const json = _json;
	const { minimum, maximum, multipleOf, exclusiveMaximum, exclusiveMinimum, isInt } = aggregateChecks(schema);
	json.type = isInt ? "integer" : "number";
	const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
	const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
	const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
	if (exMin) {
		if (legacy) {
			json.minimum = exclusiveMinimum;
			json.exclusiveMinimum = true;
		} else json.exclusiveMinimum = exclusiveMinimum;
	} else if (typeof minimum === "number") json.minimum = minimum;
	if (exMax) {
		if (legacy) {
			json.maximum = exclusiveMaximum;
			json.exclusiveMaximum = true;
		} else json.exclusiveMaximum = exclusiveMaximum;
	} else if (typeof maximum === "number") json.maximum = maximum;
	if (multipleOf) {
		const divisors = /* @__PURE__ */ new Set();
		for (const divisor of multipleOf) if (Number.isFinite(divisor) && divisor !== 0) divisors.add(Math.abs(divisor));
		else handleUnrepresentable(schema, ctx, json, params, `A multipleOf divisor of ${divisor} cannot be represented in JSON Schema`);
		const [first, ...rest] = divisors;
		if (first !== void 0) json.multipleOf = first;
		if (rest.length) json.allOf = [...json.allOf ?? [], ...rest.map((m) => ({ multipleOf: m }))];
	}
};
const neverProcessor = (_schema, _ctx, json, _params) => {
	json.not = {};
};
const enumProcessor = (schema, _ctx, json, _params) => {
	const def = schema._zod.def;
	const values = getEnumValues(def.entries);
	if (values.length === 0) {
		json.not = {};
		return;
	}
	if (values.every((v) => typeof v === "number")) json.type = "number";
	if (values.every((v) => typeof v === "string")) json.type = "string";
	json.enum = values;
};
const literalProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	if (def.values.length === 0) {
		json.not = {};
		return;
	}
	const vals = [];
	for (const val of def.values) if (val === void 0) {
		if (handleUnrepresentable(schema, ctx, json, params, "Literal `undefined` cannot be represented in JSON Schema")) return;
	} else if (typeof val === "bigint") {
		if (handleUnrepresentable(schema, ctx, json, params, "BigInt literals cannot be represented in JSON Schema")) return;
		vals.push(Number(val));
	} else vals.push(val);
	if (vals.length === 0) {} else if (vals.length === 1) {
		const val = vals[0];
		json.type = val === null ? "null" : typeof val;
		if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") json.enum = [val];
		else json.const = val;
	} else {
		if (vals.every((v) => typeof v === "number")) json.type = "number";
		if (vals.every((v) => typeof v === "string")) json.type = "string";
		if (vals.every((v) => typeof v === "boolean")) json.type = "boolean";
		if (vals.every((v) => v === null)) json.type = "null";
		json.enum = vals;
	}
};
const customProcessor = (schema, ctx, json, params) => {
	handleUnrepresentable(schema, ctx, json, params, "Custom types cannot be represented in JSON Schema");
};
const transformProcessor = (schema, ctx, json, params) => {
	handleUnrepresentable(schema, ctx, json, params, "Transforms cannot be represented in JSON Schema");
};
const arrayProcessor = (schema, ctx, _json, params) => {
	const json = _json;
	const def = schema._zod.def;
	const { minimum, maximum } = aggregateChecks(schema);
	if (typeof minimum === "number") json.minItems = minimum;
	if (typeof maximum === "number") json.maxItems = maximum;
	json.type = "array";
	json.items = processSchema(def.element, ctx, {
		...params,
		path: [...params.path, "items"]
	});
};
function inputOptin(schema) {
	const def = schema._zod.def;
	if (def.type === "pipe" && def.in._zod.traits.has("$ZodTransform")) return inputOptin(def.out);
	if (def.type === "catch") return inputOptin(def.innerType);
	return schema._zod.optin;
}
const objectProcessor = (schema, ctx, _json, params) => {
	const json = _json;
	const def = schema._zod.def;
	const shape = def.shape;
	if (Object.getOwnPropertySymbols(shape).length && handleUnrepresentable(schema, ctx, json, params, "Symbol keys cannot be represented in JSON Schema")) return;
	json.type = "object";
	json.properties = {};
	for (const key in shape) assignProp(json.properties, key, processSchema(shape[key], ctx, {
		...params,
		path: [
			...params.path,
			"properties",
			key
		]
	}));
	const requiredKeys = [];
	for (const key of Object.keys(shape)) {
		const field = def.shape[key];
		if (ctx.io === "input" ? inputOptin(field) === void 0 : field._zod.optout === void 0) requiredKeys.push(key);
	}
	if (requiredKeys.length > 0) json.required = requiredKeys;
	if (def.catchall?._zod.def.type === "never") json.additionalProperties = false;
	else if (!def.catchall) {
		if (ctx.io === "output") json.additionalProperties = false;
	} else if (def.catchall) json.additionalProperties = processSchema(def.catchall, ctx, {
		...params,
		path: [...params.path, "additionalProperties"]
	});
};
const unionProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	const isExclusive = def.inclusive === false;
	const options = def.options.map((x, i) => processSchema(x, ctx, {
		...params,
		path: [
			...params.path,
			isExclusive ? "oneOf" : "anyOf",
			i
		]
	}));
	if (isExclusive) json.oneOf = options;
	else json.anyOf = options;
};
const intersectionProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	const a = processSchema(def.left, ctx, {
		...params,
		path: [
			...params.path,
			"allOf",
			0
		]
	});
	const b = processSchema(def.right, ctx, {
		...params,
		path: [
			...params.path,
			"allOf",
			1
		]
	});
	const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
	const allOf = [...isSimpleIntersection(a) ? a.allOf : [a], ...isSimpleIntersection(b) ? b.allOf : [b]];
	json.allOf = allOf;
	ctx.intersections.push(allOf);
};
const nullableProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	const inner = processSchema(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	if (ctx.target === "openapi-3.0") {
		seen.ref = def.innerType;
		json.nullable = true;
	} else json.anyOf = [inner, { type: "null" }];
};
const nonoptionalProcessor = (schema, ctx, _json, params) => {
	const def = schema._zod.def;
	processSchema(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
};
/** Round-trips a default value through JSON so the emitted schema is guaranteed to be valid JSON.
* A BigInt has no reliable encoding, so it goes through `unrepresentable` like any other
* unrepresentable value. Returns a sentinel when the caller must not write a default of its own. */
const UNREPRESENTABLE_DEFAULT = Symbol();
function serializeDefaultValue(value, schema, ctx, json, params) {
	let unrepresentable = false;
	const serialized = JSON.stringify(value, (_, val) => {
		if (typeof val !== "bigint") return val;
		unrepresentable = true;
		return null;
	});
	if (!unrepresentable) return JSON.parse(serialized);
	handleUnrepresentable(schema, ctx, json, params, "BigInt defaults cannot be represented in JSON Schema");
	return UNREPRESENTABLE_DEFAULT;
}
const defaultProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	processSchema(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	const value = serializeDefaultValue(def.defaultValue, schema, ctx, json, params);
	if (value !== UNREPRESENTABLE_DEFAULT) json.default = value;
};
const prefaultProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	processSchema(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	if (ctx.io !== "input") return;
	const value = serializeDefaultValue(def.defaultValue, schema, ctx, json, params);
	if (value !== UNREPRESENTABLE_DEFAULT) json._prefault = value;
};
const catchProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	processSchema(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	let catchValue;
	try {
		catchValue = def.catchValue(void 0);
	} catch {
		handleUnrepresentable(schema, ctx, json, params, "Dynamic catch values are not supported in JSON Schema");
		return;
	}
	json.default = catchValue;
};
const pipeProcessor = (schema, ctx, _json, params) => {
	const def = schema._zod.def;
	const inIsTransform = def.in._zod.traits.has("$ZodTransform");
	const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
	processSchema(innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = innerType;
};
const readonlyProcessor = (schema, ctx, json, params) => {
	const def = schema._zod.def;
	processSchema(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
	json.readOnly = true;
};
const optionalProcessor = (schema, ctx, _json, params) => {
	const def = schema._zod.def;
	processSchema(def.innerType, ctx, params);
	const seen = ctx.seen.get(schema);
	seen.ref = def.innerType;
};
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/classic/errors.js
const _installedErrorProtos = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
function _lazyMethod(proto, key, make) {
	Object.defineProperty(proto, key, {
		configurable: true,
		enumerable: false,
		get() {
			const value = make(this);
			Object.defineProperty(this, key, {
				value,
				configurable: true,
				writable: true
			});
			return value;
		},
		set(value) {
			Object.defineProperty(this, key, {
				value,
				configurable: true,
				writable: true
			});
		}
	});
}
const initializer = (inst, issues) => {
	$ZodError.init(inst, issues);
	inst.name = "ZodError";
	const proto = Object.getPrototypeOf(inst);
	if (_installedErrorProtos.has(proto)) return;
	_installedErrorProtos.add(proto);
	_lazyMethod(proto, "format", (self) => (mapper) => formatError(self, mapper));
	_lazyMethod(proto, "flatten", (self) => (mapper) => flattenError(self, mapper));
	_lazyMethod(proto, "addIssue", (self) => (issue) => {
		self.issues.push(issue);
		self.message = JSON.stringify(self.issues, jsonStringifyReplacer, 2);
	});
	_lazyMethod(proto, "addIssues", (self) => (issues) => {
		self.issues.push(...issues);
		self.message = JSON.stringify(self.issues, jsonStringifyReplacer, 2);
	});
	Object.defineProperty(proto, "isEmpty", {
		configurable: true,
		enumerable: false,
		get() {
			return this.issues.length === 0;
		}
	});
};
const ZodRealError = /*@__PURE__*/ $constructor("ZodError", initializer, void 0, { Parent: Error });
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/classic/parse.js
const parse$1 = /* @__PURE__ */ _parse(ZodRealError);
const parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
const safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
const safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
const encode = /* @__PURE__ */ _encode(ZodRealError);
const decode = /* @__PURE__ */ _decode(ZodRealError);
const encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
const decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
const safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
const safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
const safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
const safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);
//#endregion
//#region node_modules/.pnpm/zod@4.6.5/node_modules/zod/v4/classic/schemas.js
function _ensureDefaultLocale() {
	if (!globalConfig.localeError) config(en_default());
}
function _ensureDefaultMemoizer() {
	if (!globalConfig.memoizer) config({ memoizer: memoizer() });
}
const ZodType = /*@__PURE__*/ $constructor("ZodType", (inst, def) => {
	_ensureDefaultLocale();
	$ZodType.init(inst, def);
	inst.def = def;
	inst.type = def.type;
	return inst;
}, {
	check(...chks) {
		const def = this.def;
		return this.clone(mergeDefs(def, { checks: [...def.checks ?? [], ...chks.map((ch) => typeof ch === "function" ? { _zod: {
			check: ch,
			def: { check: "custom" },
			onattach: []
		} } : ch)] }), { parent: true });
	},
	with(...chks) {
		return this.check(...chks);
	},
	clone(def, params) {
		return clone(this, def, params);
	},
	brand() {
		return this;
	},
	register(reg, meta) {
		reg.add(this, meta);
		return this;
	},
	refine(check, params) {
		return this.check(refine(check, params));
	},
	superRefine(refinement, params) {
		return this.check(superRefine(refinement, params));
	},
	overwrite(fn) {
		return this.check(/* @__PURE__ */ _overwrite(fn));
	},
	optional() {
		return optional(this);
	},
	exactOptional() {
		return exactOptional(this);
	},
	nullable() {
		return nullable(this);
	},
	nullish() {
		return optional(nullable(this));
	},
	nonoptional(params) {
		return nonoptional(this, params);
	},
	array() {
		return array(this);
	},
	or(arg) {
		return union([this, arg]);
	},
	and(arg) {
		return intersection(this, arg);
	},
	transform(tx) {
		return pipe(this, transform(tx));
	},
	default(d) {
		return _default(this, d);
	},
	prefault(d) {
		return prefault(this, d);
	},
	catch(params) {
		return _catch(this, params);
	},
	pipe(target) {
		return pipe(this, target);
	},
	readonly() {
		return readonly(this);
	},
	describe(description) {
		const cl = this.clone();
		globalRegistry.add(cl, { description });
		return cl;
	},
	meta(...args) {
		if (args.length === 0) return globalRegistry.get(this);
		const cl = this.clone();
		globalRegistry.add(cl, args[0]);
		return cl;
	},
	isOptional() {
		return this.safeParse(void 0).success;
	},
	isNullable() {
		return this.safeParse(null).success;
	},
	apply(fn, ...args) {
		return args.length === 0 ? fn(this) : fn(this, ...args);
	},
	get "~standard"() {
		return hide(this, "~standard", {
			...standardProps(this),
			jsonSchema: {
				input: createStandardJSONSchemaMethod(this, "input"),
				output: createStandardJSONSchemaMethod(this, "output")
			}
		});
	},
	set "~standard"(value) {
		own(this, "~standard", value);
	},
	parse: function _parse(data, params) {
		return parse$1(this, data, params, { callee: _parse });
	},
	parseAsync: async function _parseAsync(data, params) {
		return await parseAsync(this, data, params, { callee: _parseAsync });
	},
	safeParse(data, params) {
		return safeParse(this, data, params);
	},
	async safeParseAsync(data, params) {
		return safeParseAsync(this, data, params);
	},
	get spa() {
		return this?.safeParseAsync;
	},
	set spa(value) {
		own(this, "spa", value);
	},
	validate(data, params) {
		return validate(this, data, params);
	},
	validateAsync(data, params) {
		return validateAsync$1(this, data, params);
	},
	encode: function _encode(data, params) {
		return encode(this, data, params, { callee: _encode });
	},
	decode: function _decode(data, params) {
		return decode(this, data, params, { callee: _decode });
	},
	encodeAsync: async function _encodeAsync(data, params) {
		return await encodeAsync(this, data, params, { callee: _encodeAsync });
	},
	decodeAsync: async function _decodeAsync(data, params) {
		return await decodeAsync(this, data, params, { callee: _decodeAsync });
	},
	safeEncode(data, params) {
		return safeEncode(this, data, params);
	},
	safeDecode(data, params) {
		return safeDecode(this, data, params);
	},
	async safeEncodeAsync(data, params) {
		return safeEncodeAsync(this, data, params);
	},
	async safeDecodeAsync(data, params) {
		return safeDecodeAsync(this, data, params);
	},
	toJSONSchema(params) {
		return createToJSONSchemaMethod(this, {})(params);
	},
	get description() {
		return globalRegistry.get(this)?.description;
	},
	get _def() {
		return this._zod.def;
	}
});
/** @internal */
const _ZodString = /*@__PURE__*/ $constructor("_ZodString", (inst, def) => {
	$ZodString.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
}, /*@__PURE__*/ derived({
	format: (inst) => aggregateChecks(inst).format ?? null,
	minLength: (inst) => aggregateChecks(inst).minimum ?? null,
	maxLength: (inst) => aggregateChecks(inst).maximum ?? null
}, {
	regex(...args) {
		return this.check(/* @__PURE__ */ _regex(...args));
	},
	includes(...args) {
		return this.check(/* @__PURE__ */ _includes(...args));
	},
	startsWith(...args) {
		return this.check(/* @__PURE__ */ _startsWith(...args));
	},
	endsWith(...args) {
		return this.check(/* @__PURE__ */ _endsWith(...args));
	},
	min(...args) {
		return this.check(/* @__PURE__ */ _minLength(...args));
	},
	max(...args) {
		return this.check(/* @__PURE__ */ _maxLength(...args));
	},
	length(...args) {
		return this.check(/* @__PURE__ */ _length(...args));
	},
	nonempty(...args) {
		return this.check(/* @__PURE__ */ _minLength(1, ...args));
	},
	lowercase(params) {
		return this.check(/* @__PURE__ */ _lowercase(params));
	},
	uppercase(params) {
		return this.check(/* @__PURE__ */ _uppercase(params));
	},
	trim() {
		return this.check(/* @__PURE__ */ _trim());
	},
	normalize(...args) {
		return this.check(/* @__PURE__ */ _normalize(...args));
	},
	toLowerCase() {
		return this.check(/* @__PURE__ */ _toLowerCase());
	},
	toUpperCase() {
		return this.check(/* @__PURE__ */ _toUpperCase());
	},
	slugify() {
		return this.check(/* @__PURE__ */ _slugify());
	}
}));
const ZodString = /*@__PURE__*/ $constructor("ZodString", (inst, def) => {
	$ZodString.init(inst, def);
	_ZodString.init(inst, def);
}, {
	email(params) {
		return this.check(/* @__PURE__ */ _email(ZodEmail, params));
	},
	url(params) {
		return this.check(/* @__PURE__ */ _url(ZodURL, params));
	},
	jwt(params) {
		return this.check(/* @__PURE__ */ _jwt(ZodJWT, params));
	},
	emoji(params) {
		return this.check(/* @__PURE__ */ _emoji(ZodEmoji, params));
	},
	guid(params) {
		return this.check(/* @__PURE__ */ _guid(ZodGUID, params));
	},
	uuid(params) {
		return this.check(/* @__PURE__ */ _uuid(ZodUUID, params));
	},
	uuidv4(params) {
		return this.check(/* @__PURE__ */ _uuidv4(ZodUUID, params));
	},
	uuidv6(params) {
		return this.check(/* @__PURE__ */ _uuidv6(ZodUUID, params));
	},
	uuidv7(params) {
		return this.check(/* @__PURE__ */ _uuidv7(ZodUUID, params));
	},
	nanoid(params) {
		return this.check(/* @__PURE__ */ _nanoid(ZodNanoID, params));
	},
	cuid(params) {
		return this.check(/* @__PURE__ */ _cuid(ZodCUID, params));
	},
	cuid2(params) {
		return this.check(/* @__PURE__ */ _cuid2(ZodCUID2, params));
	},
	ulid(params) {
		return this.check(/* @__PURE__ */ _ulid(ZodULID, params));
	},
	base64(params) {
		return this.check(/* @__PURE__ */ _base64(ZodBase64, params));
	},
	base64url(params) {
		return this.check(/* @__PURE__ */ _base64url(ZodBase64URL, params));
	},
	xid(params) {
		return this.check(/* @__PURE__ */ _xid(ZodXID, params));
	},
	ksuid(params) {
		return this.check(/* @__PURE__ */ _ksuid(ZodKSUID, params));
	},
	ipv4(params) {
		return this.check(/* @__PURE__ */ _ipv4(ZodIPv4, params));
	},
	ipv6(params) {
		return this.check(/* @__PURE__ */ _ipv6(ZodIPv6, params));
	},
	cidrv4(params) {
		return this.check(/* @__PURE__ */ _cidrv4(ZodCIDRv4, params));
	},
	cidrv6(params) {
		return this.check(/* @__PURE__ */ _cidrv6(ZodCIDRv6, params));
	},
	e164(params) {
		return this.check(/* @__PURE__ */ _e164(ZodE164, params));
	},
	datetime(params) {
		return this.check(/* @__PURE__ */ _isoDateTime(ZodISODateTime, params));
	},
	date(params) {
		return this.check(/* @__PURE__ */ _isoDate(ZodISODate, params));
	},
	time(params) {
		return this.check(/* @__PURE__ */ _isoTime(ZodISOTime, params));
	},
	duration(params) {
		return this.check(/* @__PURE__ */ _isoDuration(ZodISODuration, params));
	}
});
function string(params) {
	return /* @__PURE__ */ _string(ZodString, params);
}
const ZodStringFormat = /*@__PURE__*/ $constructor("ZodStringFormat", (inst, def) => {
	$ZodStringFormat.init(inst, def);
	_ZodString.init(inst, def);
});
const ZodISODateTime = /*@__PURE__*/ $constructor("ZodISODateTime", (inst, def) => {
	$ZodISODateTime.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodISODate = /*@__PURE__*/ $constructor("ZodISODate", (inst, def) => {
	$ZodISODate.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodISOTime = /*@__PURE__*/ $constructor("ZodISOTime", (inst, def) => {
	$ZodISOTime.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodISODuration = /*@__PURE__*/ $constructor("ZodISODuration", (inst, def) => {
	$ZodISODuration.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodEmail = /*@__PURE__*/ $constructor("ZodEmail", (inst, def) => {
	$ZodEmail.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodGUID = /*@__PURE__*/ $constructor("ZodGUID", (inst, def) => {
	$ZodGUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodUUID = /*@__PURE__*/ $constructor("ZodUUID", (inst, def) => {
	$ZodUUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodURL = /*@__PURE__*/ $constructor("ZodURL", (inst, def) => {
	$ZodURL.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodEmoji = /*@__PURE__*/ $constructor("ZodEmoji", (inst, def) => {
	$ZodEmoji.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodNanoID = /*@__PURE__*/ $constructor("ZodNanoID", (inst, def) => {
	$ZodNanoID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
/**
* @deprecated CUID v1 is deprecated by its authors due to information leakage
* (timestamps embedded in the id). Use {@link ZodCUID2} instead.
* See https://github.com/paralleldrive/cuid.
*/
const ZodCUID = /*@__PURE__*/ $constructor("ZodCUID", (inst, def) => {
	$ZodCUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodCUID2 = /*@__PURE__*/ $constructor("ZodCUID2", (inst, def) => {
	$ZodCUID2.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodULID = /*@__PURE__*/ $constructor("ZodULID", (inst, def) => {
	$ZodULID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodXID = /*@__PURE__*/ $constructor("ZodXID", (inst, def) => {
	$ZodXID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodKSUID = /*@__PURE__*/ $constructor("ZodKSUID", (inst, def) => {
	$ZodKSUID.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodIPv4 = /*@__PURE__*/ $constructor("ZodIPv4", (inst, def) => {
	$ZodIPv4.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodIPv6 = /*@__PURE__*/ $constructor("ZodIPv6", (inst, def) => {
	$ZodIPv6.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodCIDRv4 = /*@__PURE__*/ $constructor("ZodCIDRv4", (inst, def) => {
	$ZodCIDRv4.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodCIDRv6 = /*@__PURE__*/ $constructor("ZodCIDRv6", (inst, def) => {
	$ZodCIDRv6.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodBase64 = /*@__PURE__*/ $constructor("ZodBase64", (inst, def) => {
	$ZodBase64.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodBase64URL = /*@__PURE__*/ $constructor("ZodBase64URL", (inst, def) => {
	$ZodBase64URL.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodE164 = /*@__PURE__*/ $constructor("ZodE164", (inst, def) => {
	$ZodE164.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodJWT = /*@__PURE__*/ $constructor("ZodJWT", (inst, def) => {
	$ZodJWT.init(inst, def);
	ZodStringFormat.init(inst, def);
});
const ZodNumber = /*@__PURE__*/ $constructor("ZodNumber", (inst, def) => {
	$ZodNumber.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
	inst.isFinite = true;
}, /*@__PURE__*/ derived({
	minValue: (inst) => {
		const { minimum, exclusiveMinimum } = aggregateChecks(inst);
		return Math.max(minimum ?? Number.NEGATIVE_INFINITY, exclusiveMinimum ?? Number.NEGATIVE_INFINITY);
	},
	maxValue: (inst) => {
		const { maximum, exclusiveMaximum } = aggregateChecks(inst);
		return Math.min(maximum ?? Number.POSITIVE_INFINITY, exclusiveMaximum ?? Number.POSITIVE_INFINITY);
	},
	isInt: (inst) => {
		const { isInt, multipleOf } = aggregateChecks(inst);
		return !!isInt || !!multipleOf?.some(Number.isSafeInteger);
	},
	format: (inst) => aggregateChecks(inst).format ?? null
}, {
	gt(value, params) {
		return this.check(/* @__PURE__ */ _gt(value, params));
	},
	gte(value, params) {
		return this.check(/* @__PURE__ */ _gte(value, params));
	},
	min(value, params) {
		return this.check(/* @__PURE__ */ _gte(value, params));
	},
	lt(value, params) {
		return this.check(/* @__PURE__ */ _lt(value, params));
	},
	lte(value, params) {
		return this.check(/* @__PURE__ */ _lte(value, params));
	},
	max(value, params) {
		return this.check(/* @__PURE__ */ _lte(value, params));
	},
	int(params) {
		return this.check(int(params));
	},
	safe(params) {
		return this.check(int(params));
	},
	positive(params) {
		return this.check(/* @__PURE__ */ _gt(0, params));
	},
	nonnegative(params) {
		return this.check(/* @__PURE__ */ _gte(0, params));
	},
	negative(params) {
		return this.check(/* @__PURE__ */ _lt(0, params));
	},
	nonpositive(params) {
		return this.check(/* @__PURE__ */ _lte(0, params));
	},
	multipleOf(value, params) {
		return this.check(/* @__PURE__ */ _multipleOf(value, params));
	},
	step(value, params) {
		return this.check(/* @__PURE__ */ _multipleOf(value, params));
	},
	finite() {
		return this;
	}
}));
function number(params) {
	return /* @__PURE__ */ _number(ZodNumber, params);
}
const ZodNumberFormat = /*@__PURE__*/ $constructor("ZodNumberFormat", (inst, def) => {
	$ZodNumberFormat.init(inst, def);
	ZodNumber.init(inst, def);
});
function int(params) {
	return /* @__PURE__ */ _int(ZodNumberFormat, params);
}
const ZodUnknown = /*@__PURE__*/ $constructor("ZodUnknown", (inst, def) => {
	$ZodUnknown.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => void 0;
});
function unknown() {
	return /* @__PURE__ */ _unknown(ZodUnknown);
}
const ZodNever = /*@__PURE__*/ $constructor("ZodNever", (inst, def) => {
	$ZodNever.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
});
function never(params) {
	return /* @__PURE__ */ _never(ZodNever, params);
}
const ZodArray = /*@__PURE__*/ $constructor("ZodArray", (inst, def) => {
	_ensureDefaultMemoizer();
	$ZodArray.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
	inst.element = def.element;
}, {
	min(n, params) {
		return this.check(/* @__PURE__ */ _minLength(n, params));
	},
	nonempty(params) {
		return this.check(/* @__PURE__ */ _minLength(1, params));
	},
	max(n, params) {
		return this.check(/* @__PURE__ */ _maxLength(n, params));
	},
	length(n, params) {
		return this.check(/* @__PURE__ */ _length(n, params));
	},
	unwrap() {
		return this.element;
	}
});
function array(element, params) {
	return /* @__PURE__ */ _array(ZodArray, element, params);
}
const ZodObject = /*@__PURE__*/ $constructor("ZodObject", (inst, def) => {
	_ensureDefaultMemoizer();
	$ZodObjectJIT.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
	installLazyProp(inst, "shape", (self) => self._zod.def.shape, false);
}, {
	keyof() {
		return _enum(Object.keys(this._zod.def.shape));
	},
	catchall(catchall) {
		return this.clone(mergeDefs(this._zod.def, { catchall }));
	},
	passthrough() {
		return this.clone(mergeDefs(this._zod.def, { catchall: unknown() }));
	},
	loose() {
		return this.clone(mergeDefs(this._zod.def, { catchall: unknown() }));
	},
	strict() {
		return this.clone(mergeDefs(this._zod.def, { catchall: never() }));
	},
	strip() {
		return this.clone(mergeDefs(this._zod.def, { catchall: void 0 }));
	},
	extend(incoming) {
		return extend(this, incoming);
	},
	safeExtend(incoming) {
		return safeExtend(this, incoming);
	},
	merge(other) {
		return merge(this, other);
	},
	pick(mask) {
		return pick(this, mask);
	},
	omit(mask) {
		return omit(this, mask);
	},
	partial(...args) {
		return partial(ZodOptional, this, args[0]);
	},
	exactPartial(...args) {
		return partial(ZodExactOptional, this, args[0], "exactPartial");
	},
	required(...args) {
		return required(ZodNonOptional, this, args[0]);
	}
});
function object(shape, params) {
	const def = {
		type: "object",
		shape: shape ?? {},
		...normalizeParams(params)
	};
	return new ZodObject(def);
}
function strictObject(shape, params) {
	return new ZodObject({
		type: "object",
		shape,
		catchall: never(),
		...normalizeParams(params)
	});
}
const ZodUnion = /*@__PURE__*/ $constructor("ZodUnion", (inst, def) => {
	$ZodUnion.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
	inst.options = def.options;
});
function union(options, params) {
	return new ZodUnion({
		type: "union",
		options,
		...normalizeParams(params)
	});
}
const ZodDiscriminatedUnion = /*@__PURE__*/ $constructor("ZodDiscriminatedUnion", (inst, def) => {
	ZodUnion.init(inst, def);
	$ZodDiscriminatedUnion.init(inst, def);
});
function discriminatedUnion(discriminator, options, params) {
	return new ZodDiscriminatedUnion({
		type: "union",
		options,
		discriminator,
		...normalizeParams(params)
	});
}
const ZodIntersection = /*@__PURE__*/ $constructor("ZodIntersection", (inst, def) => {
	$ZodIntersection.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
});
function intersection(left, right) {
	return new ZodIntersection({
		type: "intersection",
		left,
		right
	});
}
const ZodEnum = /*@__PURE__*/ $constructor("ZodEnum", (inst, def) => {
	$ZodEnum.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
	inst.enum = def.entries;
	inst.options = [...inst._zod.values];
	const keys = new Set(Object.keys(def.entries));
	inst.extract = (values, params) => {
		const newEntries = {};
		for (const value of values) if (keys.has(value)) newEntries[value] = def.entries[value];
		else throw new Error(`Key ${value} not found in enum`);
		return new ZodEnum({
			...def,
			checks: [],
			...normalizeParams(params),
			entries: newEntries
		});
	};
	inst.exclude = (values, params) => {
		const newEntries = { ...def.entries };
		for (const value of values) if (keys.has(value)) delete newEntries[value];
		else throw new Error(`Key ${value} not found in enum`);
		return new ZodEnum({
			...def,
			checks: [],
			...normalizeParams(params),
			entries: newEntries
		});
	};
});
function _enum(values, params) {
	const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
	return new ZodEnum({
		type: "enum",
		entries,
		...normalizeParams(params)
	});
}
const ZodLiteral = /*@__PURE__*/ $constructor("ZodLiteral", (inst, def) => {
	$ZodLiteral.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => literalProcessor(inst, ctx, json, params);
	inst.values = new Set(def.values);
	Object.defineProperty(inst, "value", { get() {
		if (def.values.length > 1) throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
		return def.values[0];
	} });
});
function literal(value, params) {
	return new ZodLiteral({
		type: "literal",
		values: Array.isArray(value) ? value : [value],
		...normalizeParams(params)
	});
}
const ZodTransform = /*@__PURE__*/ $constructor("ZodTransform", (inst, def) => {
	_ensureDefaultMemoizer();
	$ZodTransform.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
	inst._zod.parse = (payload, _ctx) => {
		if (_ctx.direction === "backward") throw new $ZodEncodeError(inst.constructor.name);
		payload.addIssue = (issue$1) => {
			if (typeof issue$1 === "string") payload.issues.push(issue(issue$1, payload.value, def));
			else {
				const _issue = issue$1;
				if (_issue.fatal) _issue.continue = false;
				_issue.code ?? (_issue.code = "custom");
				if (!("input" in _issue)) _issue.input = payload.value;
				_issue.inst ?? (_issue.inst = inst);
				payload.issues.push(issue(_issue));
			}
		};
		const output = def.transform(payload.value, payload);
		if (output instanceof Promise) return output.then((output) => {
			payload.value = output;
			return payload;
		});
		payload.value = output;
		return payload;
	};
});
function transform(fn) {
	return new ZodTransform({
		type: "transform",
		transform: fn
	});
}
const ZodOptional = /*@__PURE__*/ $constructor("ZodOptional", (inst, def) => {
	$ZodOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function optional(innerType) {
	return new ZodOptional({
		type: "optional",
		innerType
	});
}
const ZodExactOptional = /*@__PURE__*/ $constructor("ZodExactOptional", (inst, def) => {
	$ZodExactOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function exactOptional(innerType) {
	return new ZodExactOptional({
		type: "optional",
		innerType
	});
}
const ZodNullable = /*@__PURE__*/ $constructor("ZodNullable", (inst, def) => {
	$ZodNullable.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function nullable(innerType) {
	return new ZodNullable({
		type: "nullable",
		innerType
	});
}
const ZodDefault = /*@__PURE__*/ $constructor("ZodDefault", (inst, def) => {
	$ZodDefault.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
	inst.removeDefault = inst.unwrap;
});
function _default(innerType, defaultValue) {
	return new ZodDefault({
		type: "default",
		innerType,
		get defaultValue() {
			return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
		}
	});
}
const ZodPrefault = /*@__PURE__*/ $constructor("ZodPrefault", (inst, def) => {
	$ZodPrefault.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function prefault(innerType, defaultValue) {
	return new ZodPrefault({
		type: "prefault",
		innerType,
		get defaultValue() {
			return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
		}
	});
}
const ZodNonOptional = /*@__PURE__*/ $constructor("ZodNonOptional", (inst, def) => {
	$ZodNonOptional.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function nonoptional(innerType, params) {
	return new ZodNonOptional({
		type: "nonoptional",
		innerType,
		...normalizeParams(params)
	});
}
const ZodCatch = /*@__PURE__*/ $constructor("ZodCatch", (inst, def) => {
	$ZodCatch.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
	inst.removeCatch = inst.unwrap;
});
function _catch(innerType, catchValue) {
	return new ZodCatch({
		type: "catch",
		innerType,
		catchValue: typeof catchValue === "function" ? catchValue : constantCatch(catchValue)
	});
}
const ZodPipe = /*@__PURE__*/ $constructor("ZodPipe", (inst, def) => {
	$ZodPipe.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
	inst.in = def.in;
	inst.out = def.out;
});
function pipe(in_, out) {
	return new ZodPipe({
		type: "pipe",
		in: in_,
		out
	});
}
const ZodReadonly = /*@__PURE__*/ $constructor("ZodReadonly", (inst, def) => {
	$ZodReadonly.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
	inst.unwrap = () => inst._zod.def.innerType;
});
function readonly(innerType) {
	return new ZodReadonly({
		type: "readonly",
		innerType
	});
}
const ZodCustom = /*@__PURE__*/ $constructor("ZodCustom", (inst, def) => {
	$ZodCustom.init(inst, def);
	ZodType.init(inst, def);
	inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
});
function refine(fn, _params = {}) {
	return /* @__PURE__ */ _refine(ZodCustom, fn, _params);
}
function superRefine(fn, params) {
	return /* @__PURE__ */ _superRefine(fn, params);
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
discriminatedUnion("version", [
	strictObject({
		version: literal(4),
		executor: processIdentitySchema,
		helper: processIdentitySchema,
		action: updateAction,
		cancellation: originalGenerationSchema
	}).refine((value) => {
		const original = safeParseJsonWithSchema(originalUpdateSchema, value.cancellation.payload);
		return original !== null && JSON.stringify(original.helper) === JSON.stringify(value.helper) && JSON.stringify(original.executor) === JSON.stringify(value.executor) && JSON.stringify(original.action) === JSON.stringify(value.action) && (JSON.stringify(value.helper) === JSON.stringify(value.executor) || original.action.mutationProtocol === "original-cancellation-v1");
	}),
	strictObject({
		version: literal(2),
		...commonPayload,
		mutationOriginal: originalGenerationSchema.optional()
	}).refine((value) => {
		if (!value.mutationOriginal) return true;
		const original = safeParseJsonWithSchema(originalUpdateSchema, value.mutationOriginal.payload);
		return original !== null && !value.mutationOriginal.key.includes("/.openclaw-update-child-") && original.action.mutationProtocol === "original-cancellation-v1";
	}),
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
		if (process.platform === "linux") value = fs$1.readFileSync("/proc/sys/kernel/random/boot_id", "utf8").trim();
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
			...boot.platform === "linux" ? { pidNsInode: fs$1.statSync("/proc/self/ns/pid", { bigint: true }).ino.toString() } : {}
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
		heartbeatAt = fs$1.statSync(lockPath).mtimeMs;
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
	return classifyGatewayOwnerProcessNamespace(value, { readHeartbeatAt: () => lockPath ? fs$1.statSync(lockPath).mtimeMs : void 0 });
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
//#region src/infra/private-mode.ts
const CHMOD_UNSUPPORTED_CODES = /* @__PURE__ */ new Set([
	"ENOTSUP",
	"EOPNOTSUPP",
	"EINVAL"
]);
const PRIVATE_PROBE_FILE_MODE = 384;
function hasRestrictivePermissions(target) {
	try {
		return (statSync(target).mode & 63) === 0;
	} catch {
		return false;
	}
}
function filesystemRejectsChmod(target) {
	let probePath;
	try {
		const probeDir = statSync(target).isDirectory() ? target : path.dirname(target);
		probePath = path.join(probeDir, `.openclaw-chmod-probe-${randomUUID()}`);
		writeFileSync(probePath, "", {
			flag: "wx",
			mode: PRIVATE_PROBE_FILE_MODE
		});
	} catch {
		return false;
	}
	try {
		chmodSync(probePath, PRIVATE_PROBE_FILE_MODE);
		return false;
	} catch (err) {
		return err.code === "EPERM";
	} finally {
		try {
			unlinkSync(probePath);
		} catch {}
	}
}
function canIgnorePrivateChmodError(target, code) {
	if (code && CHMOD_UNSUPPORTED_CODES.has(code)) return true;
	if (code !== "EROFS" && code !== "EPERM") return false;
	return hasRestrictivePermissions(target) || code === "EPERM" && filesystemRejectsChmod(target);
}
/**
* Applies a private POSIX mode, reporting unsupported filesystems without
* weakening real permission failures.
*/
function applyPrivateModeSync(target, mode) {
	try {
		chmodSync(target, mode);
		return { applied: true };
	} catch (err) {
		if (!canIgnorePrivateChmodError(target, err.code)) throw err;
		return {
			applied: false,
			error: err
		};
	}
}
//#endregion
//#region src/infra/gateway-state-owner-directory.ts
function ensureOwnerDirectory(directory, created) {
	const firstCreated = fs$1.mkdirSync(directory, {
		recursive: true,
		mode: 448
	});
	if (firstCreated && created) {
		const boundary = path.toNamespacedPath(firstCreated);
		const directories = [];
		for (let current = directory;;) {
			const { dev, ino } = fs$1.lstatSync(current, { bigint: true });
			directories.push({
				path: current,
				dev,
				ino
			});
			if (path.toNamespacedPath(current) === boundary) break;
			const parent = path.dirname(current);
			if (parent === current) throw new Error("Created state ownership directory is outside its expected ancestry");
			current = parent;
		}
		for (const entry of directories) {
			const previous = created.findIndex((candidate) => candidate.path === entry.path);
			if (previous < 0) created.push(entry);
			else created[previous] = entry;
		}
	}
	const observed = fs$1.lstatSync(directory);
	const uid = process.getuid?.();
	if (!observed.isDirectory() || uid !== void 0 && observed.uid !== uid) throw new Error("State ownership directory must be a user-owned real directory");
	if (process.platform !== "win32" && (observed.mode & 4095) !== 448) {
		applyPrivateModeSync(directory, 448);
		if ((fs$1.lstatSync(directory).mode & 63) !== 0) throw new Error("State ownership directory permissions are not private");
	}
}
function removeCreatedProjectionDirectories(directories) {
	let directory = directories[0];
	while (directory) {
		try {
			const observed = fs$1.lstatSync(directory.path, { bigint: true });
			if (observed.isDirectory() && observed.dev === directory.dev && observed.ino === directory.ino) fs$1.rmdirSync(directory.path);
		} catch (error) {
			const code = extractErrorCode(error);
			if (code !== "ENOENT" && code !== "ENOTEMPTY" && code !== "EEXIST") throw error;
		}
		directories.shift();
		directory = directories[0];
	}
}
/** In-process identity is independent of the on-disk lock spelling used by older versions. */
function resolveStateOwnerIdentity(databasePath) {
	const canonicalPath = resolveIdentityPathViaExistingAncestorSync(databasePath);
	return {
		canonicalPath,
		ownerPath: resolveCanonicalStateOwnerPath(canonicalPath),
		key: process.platform === "win32" ? normalizeWindowsPathForComparison$1(canonicalPath) : canonicalPath
	};
}
function resolveCanonicalStateOwnerPath(canonical) {
	const uid = process.getuid?.();
	const directory = process.platform === "win32" ? path.join(os.homedir(), "AppData", "Local", "OpenClaw", "locks", uid === void 0 ? "openclaw-state-owners" : `openclaw-state-owners-${uid}`) : resolveGatewayLockDirForCanonicalStateDir(resolveOpenClawStateDirForDatabasePath(canonical));
	return path.join(resolveIdentityPathViaExistingAncestorSync(directory), `state.${sha256HexPrefixCore(canonical, 16)}.lock`);
}
//#endregion
//#region src/infra/gateway-state-owner-heartbeat.runtime.ts
/** Verify the held inode and exact acquisition bytes before touching it. */
function renewGatewayStateOwnerLock(fd, lockPath, raw, stamp) {
	const held = fs$1.fstatSync(fd, { bigint: true });
	const current = fs$1.statSync(lockPath, { bigint: true });
	const bytes = Buffer.alloc(Buffer.byteLength(raw) + 1);
	const length = fs$1.readSync(fd, bytes, 0, bytes.length, 0);
	if (held.nlink === 0n || held.dev !== current.dev || held.ino !== current.ino || bytes.subarray(0, length).toString("utf8") !== raw) return false;
	fs$1.futimesSync(fd, stamp, stamp);
	return true;
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
//#endregion
//#region src/infra/gateway-state-owner-heartbeat.ts
const now = Date.now.bind(Date);
/** Process and schema owners share one renewal worker and one failure deadline. */
function startGatewayStateOwnerHeartbeat(heldLocks, onLost) {
	const locks = {};
	for (const lock of heldLocks) {
		locks[lock.lockPath] = fs$1.readFileSync(lock.lockPath, "utf8");
		if (!lock.verifyStillHeld()) throw new Error("OpenClaw state ownership is no longer current");
	}
	const rootPath = Object.keys(locks)[0];
	if (!rootPath) throw new Error("Gateway state ownership requires a held lock");
	const rootIdentity = fs$1.statSync(rootPath, { bigint: true });
	const { moduleUrl: url, runtimeGeneration } = captureRuntimeWorkerSource(resolveRuntimeProcessEntrypointUrl("gatewayStateOwnerHeartbeat"));
	return runInDetachedAsyncContext(() => {
		const lastBeat = new BigInt64Array(new SharedArrayBuffer(BigInt64Array.BYTES_PER_ELEMENT));
		Atomics.store(lastBeat, 0, BigInt(now()));
		const { port1, port2 } = new MessageChannel();
		const worker = createCpuTrackedWorker(url, {
			workerData: {
				clock: "epoch",
				locks,
				intervalMs: GATEWAY_OWNER_HEARTBEAT_MS,
				failureMs: 6e4,
				lastBeat: lastBeat.buffer,
				events: port2
			},
			transferList: [port2],
			execArgv: resolveRuntimeWorkerThreadExecArgv(url)
		});
		worker.unref();
		port1.on("message", () => recordWorkerMessage("lifecycle", "from_worker"));
		port1.unref();
		worker.on("error", (err) => onLost(/* @__PURE__ */ new Error(`${coerceErrorMessage(err)}; restart Gateway.`)));
		const inspect = () => {
			const renewedAt = Atomics.load(lastBeat, 0);
			const age = now() - Number(renewedAt);
			const remaining = age < 0 ? 0 : 6e4 - age;
			if (remaining <= 0) try {
				const renewalStartedAt = now();
				const stamp = new Date(renewalStartedAt);
				for (const lock of heldLocks) {
					if (!lock.verifyStillHeld()) {
						if (lock.lockPath !== rootPath) continue;
						throw new Error("owner lock was removed or replaced");
					}
					const fd = fs$1.openSync(lock.lockPath, "r+");
					try {
						const held = fs$1.fstatSync(fd, { bigint: true });
						if (lock.lockPath === rootPath && (held.dev !== rootIdentity.dev || held.ino !== rootIdentity.ino)) throw new Error("owner lock was removed or replaced");
						const raw = fs$1.readFileSync(fd, "utf8");
						if (!lock.verifyStillHeld() || !renewGatewayStateOwnerLock(fd, lock.lockPath, raw, stamp)) throw new Error("owner lock was removed or replaced");
					} finally {
						fs$1.closeSync(fd);
					}
				}
				Atomics.store(lastBeat, 0, BigInt(renewalStartedAt));
				return 6e4;
			} catch (error) {
				onLost(/* @__PURE__ */ new Error(`Gateway state ownership is no longer current at ${rootPath}: ${coerceErrorMessage(error)}; restart the Gateway.`));
			}
			return remaining;
		};
		let timer;
		const watch = () => {
			const remaining = inspect();
			if (remaining > 0) {
				timer = setTimeout(watch, remaining);
				timer.unref();
			}
		};
		watch();
		let termination;
		const stop = () => {
			if (termination) return;
			clearTimeout(timer);
			port1.close();
			worker.postMessage("stop", []);
			termination ??= worker.terminate();
		};
		runtimeGeneration?.retain(worker, async () => async () => {
			stop();
			await termination;
		});
		return {
			worker,
			paths: new Set(Object.keys(locks)),
			inspect,
			stop
		};
	});
}
//#endregion
//#region src/infra/stale-lock-file.ts
function readLockFileOwnerPayload(payload) {
	if (!payload) return null;
	return {
		pid: typeof payload.pid === "number" && Number.isInteger(payload.pid) && payload.pid > 0 ? payload.pid : void 0,
		createdAt: typeof payload.createdAt === "string" ? payload.createdAt : void 0,
		starttime: typeof payload.starttime === "number" && Number.isInteger(payload.starttime) && payload.starttime >= 0 ? payload.starttime : void 0
	};
}
/** Capture only the bounded facts used by this exact stale decision. Never
* resample the owner after failure or copy arbitrary sidecar payload fields. */
function inspectStaleLockOwner(params) {
	const payload = readLockFileOwnerPayload(params.payload);
	if (!payload?.pid) return null;
	const observedStarttime = payload.starttime === void 0 ? null : (params.getProcessStartTime ?? getFileLockProcessStartTime)(payload.pid);
	const identity = {
		pid: payload.pid,
		recordedStarttime: payload.starttime ?? null,
		observedStarttime
	};
	const normalizedStored = process.platform === "darwin" && payload.starttime !== void 0 && payload.starttime > 1e10 ? Math.floor(payload.starttime / 1e6) : payload.starttime;
	if (observedStarttime !== null && observedStarttime !== normalizedStored) return {
		reason: "owner-starttime-changed",
		...identity
	};
	return (params.isPidDefinitelyDead ?? isPidDefinitelyDead)(payload.pid) ? {
		reason: "owner-process-exited",
		...identity
	} : null;
}
function isLockOwnerDefinitelyStale(params) {
	return inspectStaleLockOwner(params) !== null;
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
		raw = fs$1.readFileSync(ownerPath, "utf8");
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
//#region src/infra/sqlite-busy-timeout.ts
const { busyTimeoutByDatabase, trackedDatabases } = resolveGlobalSingleton(Symbol.for("openclaw.sqliteBusyTimeout"), () => ({
	busyTimeoutByDatabase: /* @__PURE__ */ new WeakMap(),
	trackedDatabases: /* @__PURE__ */ new WeakSet()
}));
//#endregion
//#region src/infra/gateway-state-owner.ts
function hasPhysicalOwnership(owner) {
	try {
		return verifyOwnerLock(owner, owner.locks.values().next().value);
	} catch (error) {
		if (owner.lost.signal.aborted) return false;
		throw error;
	}
}
function verifyOwnerLock(owner, lock) {
	owner.lost.signal.throwIfAborted();
	owner.heartbeat?.inspect();
	owner.lost.signal.throwIfAborted();
	if (!lock) return false;
	if (!lock.verifyStillHeld()) {
		loseOwner(owner, /* @__PURE__ */ new Error(`${lock.lockPath}: no longer current; lock removed/replaced; restart the Gateway.`));
		return false;
	}
	const projection = owner.getProjection?.();
	if (projection && owner.heartbeat && !owner.heartbeat.paths.has(projection.lockPath)) {
		const raw = fs$1.readFileSync(projection.lockPath, "utf8");
		if (!projection.verifyStillHeld()) return false;
		owner.heartbeat.worker.postMessage([projection.lockPath, raw], []);
		owner.heartbeat.paths.add(projection.lockPath);
	}
	return true;
}
const log$4 = createSubsystemLogger("gateway/state");
function loseOwner(owner, error) {
	if (owner.lost.signal.aborted) return;
	owner.accepting = false;
	readOwnerPaths.clear();
	owner.heartbeat?.stop();
	log$4.error(error.message);
	owner.lost.abort(error);
}
const readOwnerPaths = resolveGlobalSingleton(Symbol.for("openclaw.gatewayStateReadOwnerPaths"), () => /* @__PURE__ */ new Map());
const owners = resolveGlobalSingleton(Symbol.for("openclaw.gatewayStateOwners"), () => /* @__PURE__ */ new Map());
const schemaOwners = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseSchemaOwners"), () => new AsyncLocalStorage());
/** The synchronous lexical owner is live authority, not the existence of its sidecar. */
function getStateDatabaseSchemaLease(databasePath) {
	const entry = schemaOwners.getStore()?.get(resolveStateOwnerIdentity(databasePath).key);
	if (entry && !entry.active) throw new Error("State schema maintenance scope is no longer current");
	entry?.lease.assertCurrent();
	return entry?.lease;
}
function acquireOwnerFile(databasePath, pathname, payload, busyTimeoutMs = 0, createdDirectories) {
	const deadline = performance.now() + busyTimeoutMs;
	ensureOwnerDirectory(path.dirname(pathname), createdDirectories);
	const observed = { holder: null };
	const parsePayload = (raw) => {
		if (raw !== observed.raw) {
			observed.holder = parseGatewayLockPayload(raw);
			observed.raw = raw;
		}
		return observed.holder;
	};
	const stale = ({ payload: value }) => isGatewayStateOwnerDefinitelyStale(value, pathname);
	if (busyTimeoutMs > 0) try {
		const previous = parsePayload(fs$1.readFileSync(pathname, "utf8"));
		if (previous && !stale({ payload: previous }) && (previous.pid === process.pid || (previous.role ?? "gateway") === "gateway" && isPidAlive(previous.pid))) throw new GatewayStateOwnerContentionError(databasePath);
	} catch (error) {
		if (extractErrorCode(error) !== "ENOENT") throw error;
	}
	for (let retriedMissingParent = false;;) try {
		return acquireFileLockSync(pathname, {
			lockPath: pathname,
			retry: busyTimeoutMs > 0 ? {
				factor: 1.25,
				minTimeout: 10,
				maxTimeout: 25,
				randomize: false
			} : { retries: 0 },
			timeoutMs: Math.max(0, Math.ceil(deadline - performance.now())),
			staleMs: Infinity,
			staleRecovery: "remove-if-unchanged",
			reentrantOwner: payload.ownerId,
			payload: () => payload,
			parsePayload,
			shouldReclaim: stale,
			shouldRemoveStaleLock: stale
		});
	} catch (error) {
		const code = extractErrorCode(error);
		if (code === "ENOENT" && !retriedMissingParent) {
			retriedMissingParent = true;
			ensureOwnerDirectory(path.dirname(pathname), createdDirectories);
			continue;
		}
		if (code === "file_lock_timeout" || code === "file_lock_stale") {
			const { holder } = observed;
			const holderDetail = describeGatewayLockHolder(holder ?? {}, pathname, holder && isPidAlive(holder.pid) ? "live" : "unknown");
			throw new GatewayStateOwnerContentionError(databasePath, error, holderDetail);
		}
		throw error;
	}
}
function leaseForFile(pathname, lock, owner, projection) {
	let released = false;
	const holdsPhysicalLease = () => verifyOwnerLock(owner, lock) && (!projection || projection.verifyStillHeld());
	const lease = {
		path: pathname,
		assertCurrent() {
			if (released || !holdsPhysicalLease()) throw new Error("OpenClaw state ownership is no longer current");
		},
		assertDatabaseAccess(databasePath) {
			if (released || owners.get(owner.key) !== owner || resolveStateOwnerIdentity(databasePath).key !== owner.key || !holdsPhysicalLease()) throw new Error("OpenClaw state maintenance does not own this database");
		},
		run(operation) {
			lease.assertCurrent();
			readOwnerPaths.clear();
			const inherited = new Map(schemaOwners.getStore());
			const entry = {
				lease,
				active: true
			};
			inherited.set(owner.key, entry);
			try {
				return schemaOwners.run(inherited, operation);
			} finally {
				entry.active = false;
				readOwnerPaths.clear();
			}
		},
		release() {
			readOwnerPaths.clear();
			if (!released) {
				projection?.release();
				lock.release();
				released = true;
				owner.locks.delete(lock);
				if (projection) owner.locks.delete(projection);
				if (owner.locks.size === 0 && owners.get(owner.key) === owner) {
					owner.heartbeat?.stop();
					owner.accepting = false;
					owners.delete(owner.key);
				}
			}
			if (owner.locks.size === 0) removeCreatedProjectionDirectories(owner.projectionDirectories);
		}
	};
	return lease;
}
/** Accepted schema work retains the sidecar even when its process owner stops lending. */
function acquireStateDatabaseSchemaLease(databasePath, options = {}) {
	readOwnerPaths.clear();
	const identity = resolveStateOwnerIdentity(databasePath);
	let owner = owners.get(identity.key);
	const pathname = owner?.path ?? identity.ownerPath;
	if (owner && (!owner.accepting || !hasPhysicalOwnership(owner))) throw new GatewayStateOwnerContentionError(databasePath, owner.lost.signal.reason);
	if (owner) assertStateDatabaseAccessAllowed(databasePath);
	const payload = owner?.payload ?? {
		...defaultPayload(databasePath),
		stateOwnerKind: "schema"
	};
	let lock;
	const projectionDirectories = [];
	try {
		lock = acquireOwnerFile(databasePath, pathname, payload, owner ? 0 : options.busyTimeoutMs ?? 5e3, projectionDirectories);
	} catch (error) {
		if (error instanceof GatewayStateOwnerContentionError) try {
			assertStateDatabaseAccessAllowed(databasePath);
		} catch (currentOwnerError) {
			if (currentOwnerError instanceof StateDatabaseAdmissionPendingError) throw currentOwnerError;
		}
		throw error;
	}
	const projectionPath = owner?.projectionPath ?? path.join(resolveGatewayLockDir(resolveOpenClawStateDirForDatabasePath(resolveIdentityPathViaExistingAncestorSync(databasePath))), "gateway.state.lock");
	let projection;
	try {
		projection = owner?.getProjection?.()?.retain() ?? acquireOwnerFile(databasePath, projectionPath, {
			...payload,
			role: payload.role === "gateway" ? "gateway" : "agent-embedded"
		}, 0, projectionDirectories);
	} catch (error) {
		return runWithSqliteCleanup({ release() {
			lock.release();
			removeCreatedProjectionDirectories(projectionDirectories);
		} }, "state schema projection admission", () => {
			throw error;
		});
	}
	if (owner) {
		owner.locks.add(lock);
		owner.locks.add(projection);
		owner.projectionDirectories.push(...projectionDirectories);
	} else {
		owner = {
			key: identity.key,
			path: pathname,
			kind: "schema",
			payload,
			projectionPath,
			locks: /* @__PURE__ */ new Set([lock, projection]),
			projectionDirectories,
			lost: new AbortController(),
			accepting: true
		};
		owners.set(owner.key, owner);
	}
	const lease = leaseForFile(pathname, lock, owner, projection);
	try {
		const heartbeat = owner.heartbeat ??= startGatewayStateOwnerHeartbeat(owner.locks, (error) => loseOwner(owner, error));
		const raw = fs$1.readFileSync(projection.lockPath, "utf8");
		lease.assertCurrent();
		heartbeat.worker.postMessage([projection.lockPath, raw], []);
		heartbeat.paths.add(projection.lockPath);
		return lease;
	} catch (error) {
		return runWithSqliteCleanup(lease, "state schema ownership verification", () => {
			throw error;
		});
	}
}
/** Reads within an admission reuse process custody; the next admission verifies the lock. */
function assertStateDatabaseReadAllowed(databasePath, captured) {
	assertStateDatabaseReadAtOwnerPath(databasePath, captured);
}
function assertStateDatabaseReadAtOwnerPath(databasePath, captured, prepared) {
	if (owners.size === 0) {
		assertStateDatabaseAccessAtOwnerPath(databasePath, prepared ?? resolveStateOwnerIdentity(databasePath), captured);
		return;
	}
	const key = path.resolve(databasePath);
	if (readOwnerPaths.get(key)?.accepting) return;
	readOwnerPaths.delete(key);
	const identity = prepared ?? resolveStateOwnerIdentity(databasePath);
	const owner = owners.get(identity.key);
	const role = owner?.payload.role ?? "gateway";
	if (!owner || owner.kind !== "process" || !owner.accepting || role !== "gateway" && role !== "agent-embedded") {
		assertStateDatabaseAccessAtOwnerPath(databasePath, identity, captured);
		return;
	}
	if (!hasPhysicalOwnership(owner) || owner.getProjection && !owner.getProjection()?.verifyStillHeld()) {
		owner.lost.signal.throwIfAborted();
		throw new Error(`OpenClaw state ownership at ${databasePath} was lost: owner lock was removed or replaced; restart the Gateway.`);
	}
	readOwnerPaths.set(key, owner);
}
/** Ordinary SQLite access observes maintenance; it never borrows schema authority. */
function assertStateDatabaseAccessAllowed(databasePath, captured) {
	assertStateDatabaseAccessAtOwnerPath(databasePath, resolveStateOwnerIdentity(databasePath), captured);
}
/** Retained handles keep their admitted paths; reopening captures a fresh identity. */
function captureStateDatabaseAccess(databasePath) {
	const identity = resolveStateOwnerIdentity(databasePath);
	const { canonicalPath } = identity;
	return {
		canonicalPath,
		assertAccessAllowed(captured) {
			assertStateDatabaseAccessAtOwnerPath(canonicalPath, identity, captured);
		},
		assertReadAllowed(captured) {
			assertStateDatabaseReadAtOwnerPath(canonicalPath, captured, identity);
		}
	};
}
function assertStateDatabaseAccessAtOwnerPath(databasePath, identity, captured) {
	const assertMaintenance = () => {
		const schemaLease = captured ? captured.schemaLease : getStateDatabaseSchemaLease(databasePath);
		if (schemaLease) {
			schemaLease.assertDatabaseAccess(databasePath);
			return;
		}
		const scope = captured ? captured.maintenanceScope : getOpenClawDatabaseMaintenanceScope();
		if (!scope) throw new StateDatabaseMaintenanceScopeError(databasePath);
		scope.assertDatabaseAccess(databasePath);
	};
	const local = owners.get(identity.key);
	if (local) {
		if (!hasPhysicalOwnership(local)) {
			local.lost.signal.throwIfAborted();
			throw new Error(`OpenClaw state ownership at ${databasePath} was lost: owner lock was removed or replaced; restart the Gateway.`);
		}
		const role = local.payload.role ?? "gateway";
		if (!local.accepting || role !== "gateway" && role !== "agent-embedded") assertMaintenance();
		return;
	}
	assertPersistedStateDatabaseAccessAllowed({
		databasePath,
		ownerPath: identity.ownerPath,
		assertMaintenance
	});
}
//#endregion
//#region src/infra/startup-maintenance-required.ts
const GATEWAY_STARTUP_MAINTENANCE_REQUIRED_REASON = "gateway.maintenance_required";
const maintenanceReasons = {
	"state-migrations": "state migration",
	"newer-schema": "a newer OpenClaw build",
	"agent-media": "offline media migration",
	"audit-events-v2": "state database schema migration",
	"legacy-workshop-review-index": "state database schema migration",
	"legacy-cron-run-logs": "cron run history migration",
	"legacy-workspace": "workspace setup state migration",
	"legacy-session-store": "session store migration"
};
var StartupMaintenanceRequiredError = class extends Error {
	constructor(kind, message, options) {
		super(message, options);
		this.kind = kind;
		this.code = GATEWAY_STARTUP_MAINTENANCE_REQUIRED_REASON;
		this.name = "StartupMaintenanceRequiredError";
	}
	get reason() {
		return maintenanceReasons[this.kind];
	}
};
//#endregion
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
//#region src/plugin-state/plugin-blob-store.types.ts
var PluginBlobStoreError = class extends Error {
	constructor(message, options) {
		super(message, { cause: options.cause });
		this.name = "PluginBlobStoreError";
		this.code = options.code;
		this.operation = options.operation;
		if (options.path) this.path = options.path;
	}
};
//#endregion
//#region src/plugin-state/plugin-state-error-cause.ts
function capturePluginStateErrorCause(value, encodeCanonical, seen = /* @__PURE__ */ new Set()) {
	if (value === void 0) return;
	const canonical = encodeCanonical?.(value);
	if (canonical) return { canonical };
	if (value === null || typeof value === "string" || typeof value === "number" || typeof value === "boolean" || typeof value === "bigint" || typeof value === "symbol") return {
		name: "Error",
		message: String(value)
	};
	if (typeof value !== "object") return {
		name: "Error",
		message: "Unknown SQLite error cause"
	};
	if (seen.has(value) || seen.size >= 8) return {
		name: "Error",
		message: "Additional SQLite error cause omitted"
	};
	seen.add(value);
	const name = "name" in value && typeof value.name === "string" ? value.name : "Error";
	const message = "message" in value && typeof value.message === "string" ? value.message : name;
	const code = "code" in value ? value.code : void 0;
	const errcode = "errcode" in value ? value.errcode : void 0;
	const errno = "errno" in value ? value.errno : void 0;
	return {
		name,
		message,
		...typeof code === "string" || typeof code === "number" ? { errorCode: code } : {},
		...typeof errcode === "number" ? { errcode } : {},
		...typeof errno === "number" ? { errno } : {},
		..."cause" in value ? { cause: capturePluginStateErrorCause(value.cause, encodeCanonical, seen) } : {},
		...value instanceof AggregateError ? { errors: value.errors.slice(0, 8).map((error) => capturePluginStateErrorCause(error, encodeCanonical, seen)) } : {}
	};
}
//#endregion
//#region src/plugin-state/plugin-state-error.ts
/** Typed error thrown for plugin-state validation and sqlite failures. */
var PluginStateStoreError = class extends Error {
	constructor(message, options) {
		super(message, { cause: options.cause });
		this.name = "PluginStateStoreError";
		this.code = options.code;
		this.operation = options.operation;
		this.owner = options.owner ?? {
			pid: process.pid,
			threadId,
			version: VERSION
		};
		if (options.path) this.path = options.path;
	}
	toJSON() {
		return {
			name: this.name,
			message: this.message,
			code: this.code,
			operation: this.operation,
			path: this.path,
			owner: this.owner,
			cause: capturePluginStateErrorCause(this.cause)
		};
	}
};
//#endregion
//#region src/secrets/store/secret-store-validation-error.ts
var SecretStoreValidationError = class extends Error {
	constructor(code, message) {
		super(message);
		this.code = code;
		this.name = "SecretStoreValidationError";
	}
};
//#endregion
//#region src/sessions/model-selection-error.ts
const MODEL_SELECTION_LOCKED_MESSAGE = "Model selection is locked for this session.";
/** Retains the caller-visible refusal across the database worker boundary. */
var ModelSelectionLockedError = class extends Error {
	constructor(message = MODEL_SELECTION_LOCKED_MESSAGE) {
		super(message);
		this.name = "ModelSelectionLockedError";
	}
};
//#endregion
//#region src/skills/lifecycle/upload-store-error.ts
var SkillUploadRequestError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "SkillUploadRequestError";
	}
};
//#endregion
//#region src/skills/skill-library-error.ts
var SkillLibraryError = class extends Error {
	constructor(code, message, currentRevision, options) {
		super(message, options);
		this.code = code;
		this.currentRevision = currentRevision;
		this.name = "SkillLibraryError";
	}
};
//#endregion
//#region src/state/openclaw-agent-db-migration-required.ts
var OpenClawAgentDatabaseMediaMigrationRequiredError = class extends StartupMaintenanceRequiredError {
	constructor(pathname, schemaVersion) {
		super("agent-media", `OpenClaw agent database ${pathname} uses schema version ${schemaVersion}; run openclaw doctor --fix to migrate persisted media before using it.`);
		this.pathname = pathname;
		this.schemaVersion = schemaVersion;
		this.name = "OpenClawAgentDatabaseMediaMigrationRequiredError";
	}
};
var OpenClawStateDatabaseSchemaMigrationRequiredError = class extends StartupMaintenanceRequiredError {
	constructor(kind, pathname) {
		super(kind, `OpenClaw state database schema migration required (${kind}) at ${pathname}; run openclaw doctor --fix to migrate it.`);
		this.kind = kind;
		this.pathname = pathname;
		this.name = "OpenClawStateDatabaseSchemaMigrationRequiredError";
	}
};
/** Runtime readers report malformed legacy state without entering repair mode. */
function normalizeOpenClawStateSchemaReadError(error, pathname) {
	if (error instanceof Error && error.message.startsWith(`malformed database schema (idx_skill_workshop_collection_reviews_workspace_time)`)) {
		const required = new OpenClawStateDatabaseSchemaMigrationRequiredError("legacy-workshop-review-index", pathname);
		required.cause = error;
		return required;
	}
	return error;
}
//#endregion
//#region src/state/openclaw-state-lease-error.ts
var OpenClawStateLeaseError = class extends Error {
	constructor(message, options) {
		super(message, { cause: options.cause });
		this.name = "OpenClawStateLeaseError";
		this.code = options.code;
	}
};
//#endregion
//#region src/state/session-metadata-unavailable-error.ts
var SessionMetadataUnavailableError = class extends Error {
	constructor(reason, options, missingTables = []) {
		super(`Session metadata unavailable (${[reason, ...missingTables].join(": ")}); retry after the agent store is ready.`, options);
		this.reason = reason;
		this.missingTables = missingTables;
		this.name = "SessionMetadataUnavailableError";
	}
};
//#endregion
//#region src/state/openclaw-state-worker-error-identity.ts
const MESSAGE_ONLY_ERRORS = {
	"worktree-source-changed": SessionWorktreeSourceChangedError,
	"model-account-authority": ModelAccountConnectAuthorityError,
	"duplicate-agent": DuplicateAgentError,
	"model-selection-locked": ModelSelectionLockedError,
	"session-canonical-key-migration": SessionCanonicalKeyMigrationRequiredError,
	"session-pending-input-custody": SessionPendingInputCustodyError,
	"session-transcript-read-fence": SessionTranscriptReadFenceError,
	"skill-upload-request": SkillUploadRequestError,
	coordinator: SqliteCoordinatorError,
	ownership: OpenClawStateOwnershipError,
	"newer-schema": SqliteSchemaVersionError,
	"range-error": RangeError,
	"syntax-error": SyntaxError,
	"type-error": TypeError
};
function isMessageOnlyErrorIdentity(node) {
	return typeof node.type === "string" && Object.hasOwn(MESSAGE_ONLY_ERRORS, node.type);
}
function unreachableErrorNode(node) {
	throw new Error(`Unexpected shared-state worker error node: ${String(node)}`);
}
function createError(node) {
	if (isMessageOnlyErrorIdentity(node)) {
		const ErrorType = MESSAGE_ONLY_ERRORS[node.type];
		return new ErrorType(node.message);
	}
	switch (node.type) {
		case "session-worktree-owner-mismatch": return new SessionWorktreeLifecycleError(node.message, "owner-mismatch");
		case "worktree-removal-contention": return new WorktreeRemovalContentionError(node.kind, node.message, node.blockedByRun);
		case "worktree-removal-lock": return new WorktreeRemovalLockError(node.kind, node.message);
		case "plugin-state": return new PluginStateStoreError(node.message, {
			code: node.stateCode,
			operation: node.operation,
			path: node.path,
			owner: node.owner
		});
		case "skill-library": return new SkillLibraryError(node.libraryCode, node.message, node.currentRevision);
		case "secret-store-validation": return new SecretStoreValidationError(node.secretCode, node.message);
		case "worker-session-already-attached": return new WorkerSessionAlreadyAttachedError(node.sessionId, node.environmentId);
		case "workspace-alias-repointed": return new WorkspaceAliasRepointedError(node);
		case "session-goal-operation": return new SessionGoalOperationError(node.goalCode, node.message);
		case "session-lifecycle-upsert-conflict": return new SessionEntryLifecycleUpsertConflictError(node.sessionKey);
		case "session-mutation-conflict": return new SqliteSessionMutationConflictError(node.operationLabel);
		case "session-transcript-mutation-conflict": return new SqliteTranscriptMutationConflictError(node.sessionId);
		case "session-transcript-writer-claim-rebound": return new SessionTranscriptWriterClaimReboundError(node.refusal);
		case "session-metadata": return new SessionMetadataUnavailableError(node.reason, void 0, node.missingTables);
		case "error": return new Error(node.message);
		case "mcp-oauth-corruption": return new McpOAuthStoreCorruptionError("", "");
		case "aggregate": return new AggregateError([], node.message);
		case "auth-profile-store-unreadable": return new AuthProfileStoreUnreadableError(node.databasePath);
		case "state-owner-contention": return new GatewayStateOwnerContentionError(node.databasePath);
		case "ownership-metadata": return new OpenClawStateOwnershipMetadataError(node.databasePath, "");
		case "external-ownership": return new OpenClawStateExternalOwnershipError(node.databasePath, node.managerId);
		case "plugin-blob": return new PluginBlobStoreError(node.message, {
			code: node.blobCode,
			operation: node.operation,
			...node.path === void 0 ? {} : { path: node.path }
		});
		case "state-lease": return new OpenClawStateLeaseError(node.message, { code: node.leaseCode });
		case "maintenance": return new StartupMaintenanceRequiredError(node.kind, node.message);
		case "state-migration": return new OpenClawStateDatabaseSchemaMigrationRequiredError(node.kind, node.pathname);
		case "agent-media-migration": return new OpenClawAgentDatabaseMediaMigrationRequiredError(node.pathname, node.schemaVersion);
	}
	return unreachableErrorNode(node);
}
//#endregion
//#region src/state/openclaw-state-worker-error.ts
function isNativeErrorCode(value) {
	return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 2147483647;
}
function decodeErrorGraph(value, options) {
	try {
		if (value.version !== 1) return;
		const nodes = value.nodes;
		if (options.includeOrdinary !== true && !nodes.some((node) => node.stateDatabasePath !== void 0 || node.nativeOpen === true || isNativeErrorCode(node.errcode) || isSqliteLockError(node) || node.type === "aggregate" && node.name === "OpenClawQuarantineReadCleanupError" || node.type !== "error" && node.type !== "aggregate")) return;
		const errors = nodes.map(createError);
		const decodeValue = (entry) => "ref" in entry ? errors[entry.ref] : "value" in entry ? entry.value : void 0;
		for (const [index, node] of nodes.entries()) {
			const error = errors[index];
			error.name = node.name;
			error.message = node.message;
			if (node.nativeOpen) markSqliteNativeOpenFailure(error);
			if (node.stateDatabasePath !== void 0) markOpenClawStateDatabaseFailure(error, node.stateDatabasePath);
			for (const [key, propertyValue] of Object.entries({
				...node.code !== void 0 ? { code: node.code } : {},
				...node.errcode !== void 0 ? { errcode: node.errcode } : {},
				...node.errno !== void 0 ? { errno: node.errno } : {},
				...node.cause ? { cause: decodeValue(node.cause) } : {}
			})) Object.defineProperty(error, key, {
				value: propertyValue,
				configurable: true,
				writable: true
			});
			if (error instanceof AggregateError) error.errors = (node.errors ?? []).map(decodeValue);
		}
		return {
			errors,
			root: value.root
		};
	} catch {
		return;
	}
}
const retainedPayloads = resolveGlobalSingleton(Symbol.for("openclaw.sharedStateWorkerErrorPayloads"), () => /* @__PURE__ */ new WeakMap());
/** Keep the closed wire graph until the receiving caller hydrates it. */
function retainOpenClawStateWorkerErrorPayload(error, payload) {
	if (payload) retainedPayloads.set(error, payload);
}
function hydrateOpenClawStateWorkerError(value, options = {}) {
	if (!(value instanceof Error)) return value;
	const replacements = /* @__PURE__ */ new Map();
	const pending = [{
		error: value,
		finish: false
	}];
	const replace = (child) => child instanceof Error ? replacements.get(child) ?? child : child;
	while (pending.length > 0) {
		const entry = pending.pop();
		const { error } = entry;
		if (!entry.finish) {
			if (replacements.has(error)) continue;
			replacements.set(error, error);
			const payload = retainedPayloads.get(error);
			const graph = payload === void 0 ? void 0 : decodeErrorGraph(payload, options);
			if (graph) {
				replacements.set(error, graph.errors[graph.root]);
				continue;
			}
			pending.push({
				error,
				finish: true
			});
			if (error.cause instanceof Error) pending.push({
				error: error.cause,
				finish: false
			});
			if (error instanceof AggregateError) {
				for (const child of error.errors) if (child instanceof Error) pending.push({
					error: child,
					finish: false
				});
			}
			continue;
		}
		const cause = replace(error.cause);
		const originalErrors = error instanceof AggregateError ? error.errors : void 0;
		const errors = originalErrors?.map(replace);
		if (cause === error.cause && (!errors || errors.every((child, index) => child === originalErrors?.[index]))) continue;
		const replacement = error instanceof AggregateError ? new AggregateError([], error.message) : new Error(error.message);
		Object.setPrototypeOf(replacement, Object.getPrototypeOf(error));
		const descriptors = Object.getOwnPropertyDescriptors(error);
		if ("cause" in error) descriptors.cause = {
			configurable: true,
			writable: true,
			...descriptors.cause,
			value: cause
		};
		if (errors) descriptors.errors = {
			configurable: true,
			writable: true,
			...descriptors.errors,
			value: errors
		};
		Object.defineProperties(replacement, descriptors);
		replacements.set(error, replacement);
	}
	return replacements.get(value);
}
//#endregion
//#region src/infra/worker-native-port.ts
const livePort = /* @__PURE__ */ new Error("Native worker port validation reached the live sentinel");
livePort.stack = void 0;
//#endregion
//#region src/infra/worker-request-kind.ts
const standaloneKinds = {
	"catalog-page.worker.js": "catalog",
	"code-mode.worker.js": "codeMode",
	"disk-budget.worker.js": "diskBudget",
	"document-extractor.worker.js": "document",
	"manager-index.worker.js": "memoryIndex",
	"manager-search.worker.js": "memorySearch",
	"memory-index.worker.js": "memoryIndex",
	"memory-search.worker.js": "memorySearch",
	"run.worker.js": "teamReports",
	"session-history.worker.js": "sessionHistory"
};
new Map([...Object.entries(runtimeProcessEntrypoints).map(([kind, entry]) => [basename(entry.distWorkerPath), kind]), ...Object.entries(standaloneKinds)]);
//#endregion
//#region src/infra/worker-native-lifecycle.ts
const lifetime = resolveGlobalSingleton(Symbol.for("openclaw.nativeWorkerLifetimes"), () => ({
	nextId: 0,
	sources: /* @__PURE__ */ new WeakMap()
}), closeDefaultRetainedNativeWorkerSource);
/** Terminal process cleanup joins the existing unbound owner without starting another. */
async function closeDefaultRetainedNativeWorkerSource() {
	await lifetime.defaultSource?.close();
}
//#endregion
//#region packages/worker-runtime/src/worker-task-native-sections.ts
const nativeSectionKey = Symbol.for("openclaw.workerTaskNativeSection");
const nativeSectionStore = globalThis;
nativeSectionStore[nativeSectionKey] ??= new AsyncLocalStorage();
channel("openclaw.worker.task");
AsyncLocalStorage.snapshot();
//#endregion
//#region src/infra/worker-pool-sizing.ts
function resolveWorkerComputeLimit() {
	return Math.max(1, availableParallelism() - 1);
}
/** Size once at pool creation; serial owners must never inherit host CPU fanout. */
function resolveWorkerPoolSize(kind) {
	return Math.min(kind === "reader" || kind === "file-reader" ? 2 : kind === "compute" ? 4 : 1, resolveWorkerComputeLimit());
}
function resolveSqliteBrokerWorkerCount() {
	return 2;
}
resolveWorkerPoolSize("reader");
//#endregion
//#region src/shared/lazy-promise.ts
/**
* Creates a small promise cache that dedupes concurrent loads and can be cleared manually.
*
* Rejections are evicted by default so transient dynamic-import/runtime failures can recover.
*/
function createLazyPromiseLoader(load, options = {}) {
	let promise;
	const createPromise = () => {
		const loaded = Promise.resolve().then(load);
		if (options.cacheRejections !== true) loaded.catch(() => {
			if (promise === loaded) promise = void 0;
		});
		return loaded;
	};
	return {
		load() {
			promise ??= createPromise();
			return promise;
		},
		peek() {
			return promise;
		},
		clear() {
			promise = void 0;
		}
	};
}
//#endregion
//#region src/shared/lazy-runtime.ts
function createLazyRuntimeSurface(importer, select) {
	const loader = createLazyPromiseLoader(() => importer().then(select), { cacheRejections: true });
	return Object.assign(loader.load, {
		peek: loader.peek,
		clear: loader.clear
	});
}
/** Cache the raw dynamically imported runtime module behind a stable loader. */
function createLazyRuntimeModule(importer) {
	return createLazyRuntimeSurface(importer, (module) => module);
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
resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerOpenRefusedError"), () => class OpenRefusedError extends Error {
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
//#region src/infra/sqlite-worker-database-admission-relay.ts
const REQUESTED$1 = 0;
const GRANTED$1 = 1;
const admissionUpstream = resolveGlobalSingleton(Symbol.for("openclaw.sqliteDatabaseAdmissionUpstream"), () => ({}));
function getSqliteDatabaseAdmissionUpstream() {
	return admissionUpstream.connection;
}
function exchangeDatabaseAdmissions(port, admissions, location, create) {
	const { port1, port2 } = new MessageChannel();
	const decision = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
	const timing = currentSqliteOperationTiming();
	const startedAt = Date.now();
	try {
		port.postMessage({
			kind: "sqlite-database-admissions",
			admissions,
			location,
			create,
			port: port2,
			decision: decision.buffer
		}, [port2]);
		while (Atomics.load(decision, 0) === REQUESTED$1) Atomics.wait(decision, 0, REQUESTED$1);
		const outcome = Atomics.load(decision, 0);
		if (outcome === 4 && location && create === true) throw new StateDatabaseAdmissionPendingError(location, `OpenClaw state at ${location} is undergoing schema admission; retry when it finishes.`);
		if (outcome !== GRANTED$1) throw new SqliteWorkerError("SQLite admission facts exchange failed", "unavailable");
		const reply = readSqliteDatabaseAdmissions(receiveMessageOnPort(port1)?.message);
		if (!reply) throw new SqliteWorkerError("SQLite admission facts reply is unavailable", "unavailable");
		return reply;
	} finally {
		if (timing) timing.databaseAdmissionWaitMs += Date.now() - startedAt;
		port1.close();
		port2.close();
	}
}
//#endregion
//#region src/infra/sqlite-worker-operation-settlement.ts
function readNativeCommitReceipt(value) {
	if (!isRecord(value) || value.version !== 1 || typeof value.sequence !== "number" || !Number.isSafeInteger(value.sequence) || value.sequence < 1 || !Object.hasOwn(value, "facts")) return;
	return {
		version: 1,
		sequence: value.sequence,
		facts: value.facts
	};
}
resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerNativeCommitReceipts"), () => /* @__PURE__ */ new WeakMap());
resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerOperationAdmission"), () => new AsyncLocalStorage());
//#endregion
//#region src/infra/sqlite-worker-request-custody.ts
const ACTIVE = 1;
const DISPATCHED = 2;
const POST_ATTEMPTED = 4;
const CANCELED = 8;
const RETIRED = 16;
function active(state) {
	return (state & ACTIVE) !== 0 && (state & 24) === 0;
}
/** Exact buffers retain generations; request IDs never identify authority. */
function readSqliteWorkerRequestCustody(descriptor) {
	return Atomics.load(descriptor.slot, 0) === 1 && active(Atomics.load(descriptor.request, 0)) && Atomics.load(descriptor.slot, 0) === 1 && active(Atomics.load(descriptor.request, 0));
}
var SqliteWorkerSlotCustody = class {
	constructor() {
		this.state = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
		Atomics.store(this.state, 0, 1);
	}
	createRequest() {
		return new SqliteWorkerRequestCustody(this.state);
	}
	retire() {
		Atomics.store(this.state, 0, 0);
	}
};
var SqliteWorkerRequestCustody = class {
	constructor(slot) {
		this.descriptor = {
			slot,
			request: new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT))
		};
	}
	activate() {
		if (Atomics.compareExchange(this.descriptor.request, 0, 0, ACTIVE) !== 0) throw new SqliteWorkerError("SQLite worker request custody was already used", "closed");
	}
	assertCurrent() {
		if (!readSqliteWorkerRequestCustody(this.descriptor)) throw new SqliteWorkerError("SQLite worker job is no longer current", "closed");
	}
	get dispatched() {
		return (Atomics.load(this.descriptor.request, 0) & DISPATCHED) !== 0;
	}
	get postAttempted() {
		return (Atomics.load(this.descriptor.request, 0) & POST_ATTEMPTED) !== 0;
	}
	accept() {
		this.assertCurrent();
		Atomics.or(this.descriptor.request, 0, DISPATCHED);
	}
	post() {
		Atomics.or(this.descriptor.request, 0, POST_ATTEMPTED);
	}
	cancel() {
		if (!this.dispatched) Atomics.or(this.descriptor.request, 0, CANCELED);
	}
	retire() {
		Atomics.or(this.descriptor.request, 0, RETIRED);
	}
};
//#endregion
//#region src/infra/sqlite-worker-operation-admission.ts
const REQUESTED = 0;
const GRANTED = 1;
const REFUSED = 2;
const TIMED_OUT = 3;
const commitObserverBindings = /* @__PURE__ */ new WeakMap();
const executionAuthorities = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWorkerExecutionAuthorities"), () => /* @__PURE__ */ new WeakMap());
function readSqliteWorkerExecutionAuthority(admission) {
	return executionAuthorities.get(admission);
}
/** The optional continuation runs under live host authority before releasing the native writer. */
const createSqliteWorkerOperationAdmission = (admit, attachment) => createOperationAdmission(admit, attachment);
function createOperationAdmission(admit, attachment, assertRelayCurrent) {
	const { port1, port2 } = new MessageChannel();
	const inOwnerContext = AsyncLocalStorage.snapshot();
	const decisions = /* @__PURE__ */ new Set();
	const databaseAdmissionCursor = createSqliteDatabaseAdmissionCursor();
	const cleanupFailures = [];
	let closed = false;
	let started = false;
	let observeRequest;
	const commitObservers = [];
	let observingCommit = false;
	let failure;
	let committed;
	let nativeReceipt;
	let settlement;
	let databaseAuthority;
	const waiting = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
	const recordFailure = (error, source) => {
		if (!failure || failure.source === "domain" && source !== "domain") failure = {
			error,
			source
		};
	};
	const refuse = (decision, error, source) => {
		if (Atomics.compareExchange(decision, 0, REQUESTED, REFUSED) === REQUESTED) {
			recordFailure(error, source);
			Atomics.notify(decision, 0);
		} else if (Atomics.load(decision, 0) === GRANTED) cleanupFailures.push(error);
	};
	const invalidProtocol = (kind, code = "outcome-unknown") => recordFailure(new SqliteWorkerError(`SQLite worker ${kind} is invalid`, code), "protocol");
	const installCommitted = (receipt) => {
		if (nativeReceipt && receipt.sequence <= nativeReceipt.sequence) return;
		nativeReceipt = receipt;
		const publication = { facts: receipt.facts };
		committed = publication;
		observingCommit = true;
		try {
			inOwnerContext(() => {
				for (const observer of commitObservers) observer(publication);
			});
		} catch (error) {
			recordFailure(Object.assign(new SqliteWorkerError("SQLite committed facts publication failed", "outcome-unknown"), { cause: error }), "protocol");
		} finally {
			observingCommit = false;
		}
	};
	const receive = (message) => {
		recordWorkerMessage(isRecord(message) && message.kind === "sqlite-database-admissions" ? "admission" : "authority", "from_worker", isRecord(message) && typeof message.payloadBytes === "number" ? message.payloadBytes : void 0);
		started = true;
		if (isRecord(message) && message.kind === "sqlite-database-admissions") {
			if (!(message.port instanceof MessagePort) || !(message.decision instanceof SharedArrayBuffer) || message.decision.byteLength !== Int32Array.BYTES_PER_ELEMENT || message.location !== void 0 && typeof message.location !== "string" || message.create !== void 0 && typeof message.create !== "boolean" && message.create !== "admitted") {
				recordFailure(new SqliteWorkerError("SQLite admission facts request is invalid", "unavailable"), "protocol");
				return;
			}
			const decision = new Int32Array(message.decision);
			let coldOpenPath;
			try {
				if (closed) throw new SqliteWorkerError("SQLite worker admission is closed", "closed");
				const assertRelayCreation = message.create === "admitted" ? assertRelayCurrent : void 0;
				if (message.create === "admitted" && !assertRelayCreation) throw new SqliteWorkerError("SQLite creation relay is not admitted", "closed");
				const admissions = readSqliteDatabaseAdmissions(message.admissions);
				if (!admissions) throw new SqliteWorkerError("SQLite admission facts request is invalid", "unavailable");
				installSqliteDatabaseAdmissions(admissions);
				let location = message.location;
				let create = false;
				if (message.location && message.create && !prepareSqliteDatabaseAdmission(message.location)) {
					location = resolveIdentityPathViaExistingAncestorSync(message.location);
					const creationLocation = location;
					const authority = databaseAuthority;
					const assertCreate = authority?.assertCreate?.bind(authority);
					if (message.create === "admitted") create = true;
					else if (authority && assertCreate) {
						if (authority.coldOpenPath && resolveIdentityPathViaExistingAncestorSync(authority.coldOpenPath) === creationLocation) coldOpenPath = authority.coldOpenPath;
						inOwnerContext(() => {
							authority.assertRequest?.();
							authority.assertAccess();
							assertCreate(creationLocation);
						});
						coldOpenPath = void 0;
						create = true;
					}
				}
				if (create) assertRelayCreation?.();
				if (closed) throw new SqliteWorkerError("SQLite worker admission is closed", "closed");
				const upstream = getSqliteDatabaseAdmissionUpstream();
				if (upstream) {
					if (upstream.closed) throw new SqliteWorkerError("SQLite admission upstream is closed", "closed");
					installSqliteDatabaseAdmissions(exchangeDatabaseAdmissions(upstream.port, admissions, location, create ? "admitted" : void 0));
				} else if (location) try {
					if (create) prepareSqliteDatabaseAdmission(location, { create: true });
					retainSqliteDatabaseAdmissionLocation(location);
				} catch (error) {
					if (!isRecord(error) || error.code !== "ENOENT") throw error;
				}
				const scope = message.location === void 0 ? void 0 : {
					location: message.location,
					admissions
				};
				const reply = captureSqliteDatabaseAdmissions(databaseAdmissionCursor, scope);
				message.port.postMessage(reply, []);
				recordWorkerMessage("admission", "to_worker");
				Atomics.store(decision, 0, GRANTED);
			} catch (error) {
				if (error instanceof StateDatabaseAdmissionPendingError && error.databasePath === coldOpenPath) Atomics.store(decision, 0, 4);
				else {
					recordFailure(error, "protocol");
					Atomics.store(decision, 0, REFUSED);
				}
			} finally {
				message.port.close();
				Atomics.notify(decision, 0);
			}
			return;
		}
		if (isRecord(message) && message.kind === "native-commit") {
			const receipt = readNativeCommitReceipt(message.committed);
			if (!receipt) {
				invalidProtocol("commit receipt");
				return;
			}
			installCommitted(receipt);
			return;
		}
		if (isRecord(message) && message.kind === "native-settlement") {
			const value = message.settlement;
			const receipt = isRecord(value) ? readNativeCommitReceipt(value.committed) : void 0;
			if (!isRecord(value) || value.kind !== "completed" && value.kind !== "unknown" || value.committed !== void 0 && !receipt) {
				invalidProtocol("native settlement");
				return;
			}
			if (receipt) installCommitted(receipt);
			settlement = {
				kind: value.kind,
				...committed ? { committed } : {}
			};
			return;
		}
		if (!isRecord(message) || !(message.decision instanceof SharedArrayBuffer) || message.decision.byteLength !== Int32Array.BYTES_PER_ELEMENT || message.stage !== "open" && message.stage !== "prepare" && message.stage !== "transaction" && message.stage !== "commit") {
			invalidProtocol("admission request", "unavailable");
			return;
		}
		const decision = new Int32Array(message.decision);
		const deadlineNs = typeof message.deadlineMs === "number" && Number.isFinite(message.deadlineMs) ? readSqliteWorkerMonotonicNs() + BigInt(Math.max(0, Math.ceil(message.deadlineMs))) * 1000000n : void 0;
		const expired = () => {
			if (deadlineNs !== void 0 && readSqliteWorkerMonotonicNs() >= deadlineNs) {
				if (Atomics.compareExchange(decision, 0, REQUESTED, TIMED_OUT) === REQUESTED) Atomics.notify(decision, 0);
			}
			if (Atomics.load(decision, 0) !== TIMED_OUT) return false;
			if (Array.isArray(message.ports)) {
				for (const port of message.ports) if (port instanceof MessagePort) port.close();
			}
			return true;
		};
		if (expired()) return;
		decisions.add(decision);
		const request = {
			stage: message.stage,
			facts: message.facts
		};
		try {
			inOwnerContext(() => observeRequest?.(request));
		} catch (error) {
			refuse(decision, error, "domain");
			return;
		}
		if (closed) {
			refuse(decision, new SqliteWorkerError("SQLite worker admission is closed", "closed"), "authority");
			return;
		}
		const grant = (beforeRelease) => {
			if (closed || expired() || Atomics.load(decision, 0) !== REQUESTED) return false;
			try {
				inOwnerContext(() => databaseAuthority?.assertAccess());
			} catch (error) {
				refuse(decision, error, "authority");
				return false;
			}
			if (closed || expired() || Atomics.load(decision, 0) !== REQUESTED) return false;
			beforeRelease?.();
			if (expired()) return false;
			const granted = Atomics.compareExchange(decision, 0, REQUESTED, GRANTED) === REQUESTED;
			if (granted) Atomics.notify(decision, 0);
			return granted;
		};
		let source = "authority";
		try {
			inOwnerContext(() => {
				databaseAuthority?.assertRequest?.();
				databaseAuthority?.assertAccess();
			});
			if (request.stage === "prepare" && isRecord(request.facts) && request.facts.kind === "schema-maintenance") {
				const authority = databaseAuthority;
				if (!authority || typeof request.facts.databasePath !== "string" || resolveIdentityPathViaExistingAncestorSync(request.facts.databasePath) !== authority.databasePath) throw new SqliteWorkerError("SQLite schema maintenance target differs from its admitted database", "closed");
				inOwnerContext(() => {
					authority.lease ??= authority.acquireSchema();
					authority.lease.assertCurrent();
					grant();
				});
			} else {
				source = "domain";
				inOwnerContext(admit, request, grant);
			}
		} catch (error) {
			if (error instanceof StateDatabaseAdmissionPendingError && databaseAuthority?.coldOpenPath === error.databasePath && !databaseAuthority.lease && request.stage === "prepare" && isRecord(request.facts) && request.facts.kind === "schema-maintenance" && typeof request.facts.databasePath === "string" && resolveIdentityPathViaExistingAncestorSync(request.facts.databasePath) === databaseAuthority.databasePath) {
				if (Atomics.compareExchange(decision, 0, REQUESTED, 4) === REQUESTED) Atomics.notify(decision, 0);
			} else refuse(decision, error, source);
			return;
		} finally {
			decisions.delete(decision);
		}
		if (Atomics.load(decision, 0) === REQUESTED) refuse(decision, new SqliteWorkerError("SQLite worker admission was not granted", "closed"), "domain");
	};
	port1.on("message", receive).unref();
	const service = () => {
		if (observingCommit) return;
		for (let queued = receiveMessageOnPort(port1); queued; queued = receiveMessageOnPort(port1)) receive(queued.message);
	};
	const admission = {
		port: port2,
		attachment: attachment === void 0 ? void 0 : { value: attachment },
		observeRequests(observer) {
			if (closed || observeRequest) throw new SqliteWorkerError("SQLite request observation is already bound or closed", "closed");
			observeRequest = observer;
		},
		bindDatabaseAuthority(authority) {
			if (closed || databaseAuthority) throw new SqliteWorkerError("SQLite database authority is already bound or closed", "closed");
			databaseAuthority = { ...authority };
		},
		get failure() {
			return failure?.error;
		},
		get failureSource() {
			return failure?.source;
		},
		get cleanupFailures() {
			return cleanupFailures;
		},
		get committed() {
			service();
			return committed;
		},
		get settlement() {
			return settlement;
		},
		waitForSettlement(deadlineMs) {
			while (true) {
				service();
				if (failure !== void 0) throw toErrorObject(failure.error, "SQLite worker admission failed");
				if (settlement?.kind === "completed") return settlement;
				const remaining = deadlineMs - performance.now();
				if (settlement?.kind === "unknown" || closed || remaining <= 0) throw new SqliteWorkerError("SQLite worker native settlement is unknown", "outcome-unknown");
				Atomics.wait(waiting, 0, 0, Math.min(5, remaining));
			}
		},
		service,
		finish() {
			closed = true;
			service();
			for (const decision of decisions) if (Atomics.load(decision, 0) === REQUESTED) refuse(decision, new SqliteWorkerError("SQLite worker admission is closed", "closed"), "authority");
			port1.close();
			port2.close();
			if (databaseAuthority?.lease) try {
				databaseAuthority.lease.release();
				databaseAuthority.lease = void 0;
			} catch (error) {
				cleanupFailures.push(error);
			}
		}
	};
	commitObserverBindings.set(admission, (observer) => {
		if (closed || started) throw new SqliteWorkerError("SQLite commit observation is closed or started", "closed");
		commitObservers.push(observer);
	});
	return admission;
}
//#endregion
//#region src/shared/store-writer-queue.ts
const MAX_WRITERS_PER_TURN = 4;
const WRITER_TURN_BUDGET_MS = 4;
const activeStoreWriters = resolveGlobalSingleton(Symbol.for("openclaw.activeStoreWriters"), () => new AsyncLocalStorage());
const writerTurn = resolveGlobalSingleton(Symbol.for("openclaw.storeWriterTurn"), () => ({
	started: 0,
	startedAt: 0,
	reset: void 0,
	wait: void 0
}));
function claimStoreWriterTurn(immediate) {
	const now = performance$1.now();
	if (!writerTurn.reset) {
		writerTurn.started = 0;
		writerTurn.startedAt = now;
		writerTurn.reset = setImmediate$1().then(() => {
			writerTurn.reset = void 0;
		});
	}
	if (!immediate && (writerTurn.wait || writerTurn.started >= MAX_WRITERS_PER_TURN || now - writerTurn.startedAt >= WRITER_TURN_BUDGET_MS)) return writerTurn.wait ??= setImmediate$1().then(() => {
		writerTurn.wait = void 0;
	});
	writerTurn.started++;
}
function isActiveStoreWriter(queues, storePath, keys) {
	if (!queues.has(storePath)) return false;
	let active = activeStoreWriters.getStore();
	while (active) {
		if (active.active && active.queues === queues && active.storePath === storePath) {
			const heldKeys = active.keys;
			if (heldKeys && (!keys || [...keys].some((key) => !heldKeys.has(key)))) throw new Error("Cannot expand an active store writer's keys");
			return true;
		}
		active = active.parent;
	}
	return false;
}
async function runActiveStoreWriter(queues, storePath, fn, timing, keys) {
	const writer = {
		active: true,
		parent: activeStoreWriters.getStore(),
		queues,
		storePath,
		keys
	};
	if (timing) {
		timing.reentrant = false;
		timing.startedAt = performance$1.now();
	}
	try {
		return await activeStoreWriters.run(writer, fn);
	} finally {
		if (timing) timing.finishedAt = performance$1.now();
		writer.active = false;
	}
}
async function drainStoreWriterQueue(queues, storePath) {
	const queue = queues.get(storePath);
	if (!queue || queue.drainPromise) return;
	const drain = createDeferredCore();
	queue.drainPromise = drain.promise;
	const heldKeys = /* @__PURE__ */ new Set();
	let active = 0;
	let changed = createDeferredCore();
	queue.wake = () => changed.resolve();
	let first = true;
	try {
		while (queue.pending.length > 0 || active > 0) {
			const blocked = /* @__PURE__ */ new Set();
			let task;
			for (const pending of queue.pending) {
				const keys = pending.keys;
				if (!keys) {
					if (active === 0 && blocked.size === 0) task = pending;
					break;
				}
				if (![...keys].some((key) => heldKeys.has(key) || blocked.has(key))) {
					task = pending;
					break;
				}
				for (const key of keys) blocked.add(key);
			}
			if (!task) {
				await changed.promise;
				changed = createDeferredCore();
				continue;
			}
			let wait;
			while (wait = claimStoreWriterTurn(first)) await wait;
			first = false;
			const index = queue.pending.indexOf(task);
			if (index < 0) continue;
			queue.pending.splice(index, 1);
			if (!task.keys) {
				await task.fn().then(task.resolve, task.reject);
				continue;
			}
			const keys = task.keys;
			for (const key of keys) heldKeys.add(key);
			active++;
			const finish = () => {
				for (const key of keys) heldKeys.delete(key);
				active--;
				queue.wake?.();
			};
			task.fn().then((value) => {
				finish();
				task.resolve(value);
			}, (error) => {
				finish();
				task.reject(error);
			});
		}
	} finally {
		queue.drainPromise = null;
		queue.wake = void 0;
		queues.delete(storePath);
		drain.resolve();
	}
}
async function runQueuedStoreWrite(params) {
	if (!params.storePath || typeof params.storePath !== "string") throw new Error(`${params.label}: storePath must be a non-empty string, got ${JSON.stringify(params.storePath)}`);
	params.signal?.throwIfAborted();
	const keys = params.keys?.length ? new Set(params.keys) : void 0;
	if (params.reentrant === true && isActiveStoreWriter(params.queues, params.storePath, keys)) {
		if (params.timing) {
			params.timing.reentrant = true;
			params.timing.startedAt = performance$1.now();
		}
		try {
			return await params.fn();
		} finally {
			if (params.timing) params.timing.finishedAt = performance$1.now();
		}
	}
	const runInAsyncContext = AsyncLocalStorage.snapshot();
	let existingQueue = params.queues.get(params.storePath);
	if (!existingQueue) {
		existingQueue = {
			pending: [],
			drainPromise: null
		};
		params.queues.set(params.storePath, existingQueue);
	}
	const queue = existingQueue;
	let detach = () => {};
	const completion = new Promise((resolve, reject) => {
		detach = () => params.signal?.removeEventListener("abort", abort);
		const abort = () => {
			const index = queue.pending.indexOf(task);
			if (index !== -1) {
				queue.pending.splice(index, 1);
				task.reject(params.signal?.reason);
				queue.wake?.();
			}
		};
		const task = {
			keys,
			fn: async () => {
				detach();
				return await runInAsyncContext(runActiveStoreWriter, params.queues, params.storePath, params.fn, params.timing, keys);
			},
			resolve: (value) => resolve(value),
			reject
		};
		queue.pending.push(task);
		queue.wake?.();
		params.signal?.addEventListener("abort", abort, { once: true });
		runInDetachedAsyncContext(() => void drainStoreWriterQueue(params.queues, params.storePath));
	});
	if (params.signal) completion.then(detach, detach);
	return await completion;
}
resolveGlobalSingleton(Symbol.for("openclaw.agentDatabaseWriteAdmission"), () => ({ queues: /* @__PURE__ */ new Map() })).queues;
resolveGlobalSingleton(Symbol.for("openclaw.workerTaskPools"), () => /* @__PURE__ */ new Set());
createLazyRuntimeModule(() => import("./temp-artifact-cleanup-CVuyUTKD.js"));
resolveGlobalSingleton(Symbol.for("openclaw.workerTaskDatabaseAdmissionChannels"), () => /* @__PURE__ */ new Map());
//#endregion
//#region src/state/openclaw-state-db-schema-policy.ts
const schemaPolicies = resolveGlobalSingleton(Symbol.for("openclaw.stateDatabaseSchemaPolicies"), () => ({
	scopes: new AsyncLocalStorage(),
	existingDatabases: /* @__PURE__ */ new WeakMap()
}));
function canonicalPath(pathname) {
	const resolved = resolveDatabasePath({ path: pathname });
	try {
		return normalizeDatabasePath(realpathSync.native(resolved));
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return resolved;
		throw error;
	}
}
function assertSchemaScopeActive(scope) {
	if (scope && !scope.active) throw new Error("Existing shared-state schema admission has ended.");
}
function getExistingOpenClawStateSchemaPath() {
	const scope = schemaPolicies.scopes.getStore();
	assertSchemaScopeActive(scope);
	return scope?.path;
}
/** Admit this source once; retained reads only need the original scope's live lifetime. */
function captureOpenClawStateSchemaReadAdmission(pathname) {
	const scope = schemaPolicies.scopes.getStore();
	if (!scope) return;
	isExistingOpenClawStateSchema(pathname);
	return {
		path: scope.path,
		assertCurrent: () => assertSchemaScopeActive(scope)
	};
}
/** Check supplied and cached handles before exposing them to another admission policy. */
function isExistingOpenClawStateSchema(pathname, database) {
	const scopedPath = getExistingOpenClawStateSchemaPath();
	const scope = schemaPolicies.scopes.getStore();
	const admittedPath = database && schemaPolicies.existingDatabases.get(database);
	const resolvedPath = resolveDatabasePath({ path: pathname });
	const existing = scopedPath !== void 0 && (scopedPath === resolvedPath || scope?.canonicalPath === resolvedPath || scope?.canonicalPath === canonicalPath(resolvedPath));
	if (scopedPath && !existing) throw new Error(`Existing shared-state schema admission is bound to ${scopedPath}, not ${pathname}.`);
	if (admittedPath && (!existing || admittedPath !== scope?.canonicalPath)) throw new Error(`Shared-state database ${pathname} was admitted without schema repair; close its existing handle before ordinary admission.`);
	return existing;
}
/** The cache owns the handle inventory, including owners retained after failed cleanup. */
function assertExistingOpenClawStateSchemaCacheAdmission(pathname, cache) {
	const scopedPath = getExistingOpenClawStateSchemaPath();
	const scope = schemaPolicies.scopes.getStore();
	const requested = resolveDatabasePath({ path: pathname });
	let resolved = scope && (scopedPath === requested || scope.canonicalPath === requested) ? scope.canonicalPath : void 0;
	for (const databases of [cache.cachedDatabases, cache.retainedDatabaseHandles]) for (const { db } of databases.values()) {
		const admittedPath = schemaPolicies.existingDatabases.get(db);
		if (admittedPath && db.isOpen) {
			resolved ??= canonicalPath(pathname);
			if (admittedPath === resolved) isExistingOpenClawStateSchema(pathname, db);
		}
	}
}
createSubsystemLogger("sqlite/transaction");
const writeAdmissionServices = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWriteAdmissionServices"), () => /* @__PURE__ */ new Map());
/** Locations come from the retained native owner; registration grants no write authority. */
function retainSqliteWriteAdmissionService(nativeLocations, service) {
	const registrations = [...new Set(nativeLocations.map(normalizeDatabasePath))].map((location) => {
		const services = writeAdmissionServices.get(location) ?? /* @__PURE__ */ new Set();
		const retained = () => service();
		services.add(retained);
		writeAdmissionServices.set(location, services);
		return {
			location,
			services,
			retained
		};
	});
	return () => {
		for (const { location, services, retained } of registrations) {
			services.delete(retained);
			if (services.size === 0 && writeAdmissionServices.get(location) === services) writeAdmissionServices.delete(location);
		}
	};
}
//#endregion
//#region src/infra/database-engine/postgres-catalog.ts
function readPostgresCatalog(value) {
	if (!Array.isArray(value) || !value.every((item) => item !== null && typeof item === "object" && typeof item.table === "string" && typeof item.kind === "string" && "value" in item)) throw new Error("PostgreSQL did not return catalog facts");
	return value;
}
//#endregion
//#region src/infra/database-engine/physical-facts.ts
const admissionKey = {
	name: "database.engine.schema",
	schemaDependent: true,
	read(value) {
		if (value && typeof value === "object" && "engine" in value && value.engine === "postgres" && "admissionId" in value && typeof value.admissionId === "string" && "store" in value && typeof value.store === "string" && "namespace" in value && typeof value.namespace === "string" && "storeId" in value && typeof value.storeId === "string" && "version" in value && typeof value.version === "number" && "capabilities" in value && value.capabilities !== null && typeof value.capabilities === "object" && "serverMajor" in value.capabilities && typeof value.capabilities.serverMajor === "number" && value.capabilities.serverMajor >= 16 && "serverEncoding" in value.capabilities && value.capabilities.serverEncoding === "UTF8" && "clientEncoding" in value.capabilities && value.capabilities.clientEncoding === "UTF8" && "catalog" in value) return {
			engine: "postgres",
			admissionId: value.admissionId,
			store: value.store,
			namespace: value.namespace,
			storeId: value.storeId,
			version: value.version,
			capabilities: {
				serverMajor: value.capabilities.serverMajor,
				serverEncoding: "UTF8",
				clientEncoding: "UTF8"
			},
			catalog: readPostgresCatalog(value.catalog)
		};
	}
};
function getPostgresPhysicalFacts(db) {
	return getSqliteDatabaseAdmission(db, admissionKey);
}
//#endregion
//#region src/infra/sqlite-snapshot-file.ts
function sameFileStatFingerprint(left, right) {
	return sameFileIdentity(left, right) && left.size === right.size;
}
//#endregion
//#region src/infra/sqlite-file-generation.ts
function sameFileFingerprint(left, right) {
	return left.dev === right.dev && left.ino === right.ino && sameFileStatFingerprint(left, right) && left.sha256 === right.sha256;
}
function sameOptionalFileFingerprint(left, right) {
	return left === void 0 ? right === void 0 : right !== void 0 && sameFileFingerprint(left, right);
}
function sameSqliteFileGeneration(left, right) {
	return sameFileFingerprint(left.database, right.database) && sameOptionalFileFingerprint(left.journal, right.journal) && sameOptionalFileFingerprint(left.wal?.size === 0n ? void 0 : left.wal, right.wal?.size === 0n ? void 0 : right.wal);
}
function parseFileFingerprint(fingerprint) {
	if (!isRecord(fingerprint)) throw new Error("SQLite file fingerprint must be an object");
	for (const field of [
		"birthtimeNs",
		"ctimeNs",
		"dev",
		"ino",
		"mtimeNs",
		"size"
	]) if (typeof fingerprint[field] !== "string" || !/^-?\d+$/u.test(fingerprint[field])) throw new Error(`SQLite file fingerprint ${field} is invalid`);
	if (typeof fingerprint.sha256 !== "string" || !/^[a-f0-9]{64}$/u.test(fingerprint.sha256)) throw new Error("SQLite file fingerprint sha256 is invalid");
	return {
		birthtimeNs: BigInt(fingerprint.birthtimeNs),
		ctimeNs: BigInt(fingerprint.ctimeNs),
		dev: BigInt(fingerprint.dev),
		ino: BigInt(fingerprint.ino),
		mtimeNs: BigInt(fingerprint.mtimeNs),
		sha256: fingerprint.sha256,
		size: BigInt(fingerprint.size)
	};
}
function parseSqliteFileGeneration(serialized) {
	const generation = JSON.parse(serialized);
	if (!isRecord(generation)) throw new Error("SQLite file generation must be an object");
	return {
		database: parseFileFingerprint(generation.database),
		...generation.journal === void 0 ? {} : { journal: parseFileFingerprint(generation.journal) },
		...generation.wal === void 0 ? {} : { wal: parseFileFingerprint(generation.wal) }
	};
}
//#endregion
//#region src/infra/windows-private-directory.ts
function createPrivateWindowsDirectory(directoryPath) {
	let attempted = false;
	try {
		createDirectorySync(path.resolve(directoryPath), {
			private: true,
			assertBeforeMutation() {
				attempted = true;
			}
		});
	} catch (error) {
		if (!attempted || error instanceof FsSafeError && error.code === "already-exists") throw markPrivateDirectoryCreationRefused(error);
		throw error;
	}
}
//#endregion
//#region src/infra/sqlite-private-directory.ts
function resolvePrivateSqliteSnapshotStagingRoot(env = process.env) {
	const updateTmp = env.OPENCLAW_UPDATE_IN_PROGRESS === "1" ? env.TMPDIR?.trim() : void 0;
	if (updateTmp && path.isAbsolute(updateTmp)) return resolvePreferredOpenClawTmpDir({
		preferredDir: path.join(updateTmp, "openclaw"),
		tmpdir: () => updateTmp
	});
	const appData = process.platform === "win32" ? env.LOCALAPPDATA?.trim() : void 0;
	const defaultRoot = process.platform === "win32" ? "AppData/Local" : ".cache";
	const platformRoot = process.platform === "darwin" ? "Library/Caches" : defaultRoot;
	const cacheRoot = [env.XDG_CACHE_HOME?.trim(), appData].find((root) => root && path.isAbsolute(root)) ?? path.join(resolveRequiredOsHomeDir(env), platformRoot);
	return resolvePreferredOpenClawTmpDir({
		preferredDir: path.join(cacheRoot, "openclaw"),
		tmpdir: () => cacheRoot
	});
}
function createPrivateSqliteTempDirectorySync(rootPath, prefix) {
	if (process.platform !== "win32") try {
		return fs$1.mkdtempSync(path.join(rootPath, prefix));
	} catch (error) {
		throw markPrivateDirectoryCreationRefused(error);
	}
	const directoryPath = path.join(rootPath, `${prefix}${randomUUID()}`);
	createPrivateWindowsDirectory(directoryPath);
	return directoryPath;
}
//#endregion
//#region src/infra/sqlite-schema-issues.ts
/** A completed inspection proved schema drift; native read failures retain their own type. */
var SqliteSchemaMismatchError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "SqliteSchemaMismatchError";
	}
};
//#endregion
//#region src/state/openclaw-state-db-schema-helpers.ts
function tableExists(db, tableName) {
	if (isPostgresSqlConnection(db)) return getPostgresPhysicalFacts(db)?.catalog.some((fact) => fact.table === tableName && fact.kind === "table") ?? false;
	const schema = getAdmittedSqliteSchemaFacts(db);
	if (schema) return schema.tables.has(tableName);
	return executeWithCachedStatement(db, "SELECT 1 AS ok FROM sqlite_master WHERE type = 'table' AND name = ?", [tableName], (statement) => statement.get(tableName))?.ok === 1;
}
//#endregion
//#region src/infra/gateway-scheduler.ts
const log$3 = createSubsystemLogger("gateway/scheduler");
const hostClock = {
	now: () => Date.now(),
	monotonicNow: () => performance.now(),
	arm: (run, delayMs) => {
		const timer = setTimeout(() => {
			runWithMainThreadTask("scheduler:wake", () => {
				run();
			});
		}, delayMs);
		timer.unref();
		return () => clearTimeout(timer);
	}
};
/** Next maintenance slot on one clock after a run, skipping missed slots without replay. */
function nextMaintenanceSlot(slotMs, clockMs, everyMs) {
	if (slotMs - clockMs > everyMs / 2) return slotMs;
	return slotMs + (Math.floor(Math.max(0, clockMs - slotMs) / everyMs) + 1) * everyMs;
}
/** Owns Gateway wakeups; stores and execution owners retain their deadlines and authority. */
var GatewayScheduler = class {
	constructor(options = {}) {
		this.jobs = /* @__PURE__ */ new Map();
		this.pending = /* @__PURE__ */ new Set();
		this.dispatching = false;
		this.timerGeneration = 0;
		this.controller = new AbortController();
		this.clock = options.clock ?? hostClock;
	}
	get signal() {
		return this.controller.signal;
	}
	now() {
		return this.clock.now();
	}
	get nextWakeAtMs() {
		const nowMs = this.now();
		const elapsedMs = this.clock.monotonicNow();
		let next = null;
		for (const job of this.jobs.values()) {
			if (job.running) continue;
			const atMs = nowMs + this.remaining(job, nowMs, elapsedMs);
			next = next === null ? atMs : Math.min(next, atMs);
		}
		return next;
	}
	/** Closes one owner's timers without retiring siblings or losing in-flight joins. */
	scope() {
		const controller = new AbortController();
		const owner = {
			signal: AbortSignal.any([this.signal, controller.signal]),
			jobs: /* @__PURE__ */ new Set()
		};
		const beginClose = () => {
			controller.abort();
			materializeErrorStack(controller.signal.reason);
			materializeErrorStack(owner.signal.reason);
			for (const job of owner.jobs) this.cancel(job);
		};
		const close = () => {
			beginClose();
			const running = [...owner.jobs].flatMap((job) => job.running ?? []);
			return running.length > 0 ? Promise.all(running).then(() => void 0) : void 0;
		};
		return {
			signal: owner.signal,
			now: () => this.now(),
			schedule: (params) => this.scheduleOwned(params, owner),
			beginClose,
			close,
			stop: async () => {
				await close();
			}
		};
	}
	schedule(params) {
		return this.scheduleOwned(params);
	}
	scheduleOwned(params, owner) {
		const relative = "delayMs" in params;
		const nowMs = this.now();
		const requestedAtMs = relative ? nowMs + params.delayMs : params.atMs;
		const atMs = params.phase === "maintenance" ? Math.max(nowMs, Math.floor(requestedAtMs / 1e4) * 1e4) : requestedAtMs;
		if (!Number.isFinite(atMs) || params.everyMs !== void 0 && (!Number.isFinite(params.everyMs) || params.everyMs <= 0)) throw new Error(`Invalid Gateway schedule: ${params.id}`);
		const cancelled = this.signal.aborted || owner?.signal.aborted === true;
		const previous = cancelled ? void 0 : this.jobs.get(params.id);
		const job = {
			id: params.id,
			diagnosticName: `scheduler:${params.id.startsWith("maintenance:") ? params.id.split(":").slice(0, 3).join(":") : params.id.split(/[:/]/u, 1)[0]}`,
			run: params.run,
			everyMs: params.everyMs,
			phase: params.phase,
			atMs,
			elapsedAtMs: relative || params.everyMs !== void 0 ? this.clock.monotonicNow() + Math.max(0, atMs - nowMs) : void 0,
			context: runOutsideAsyncWorkScope(() => AsyncLocalStorage.snapshot()),
			cancelled,
			owner
		};
		if (params.mode === "earliest" && previous && !previous.running) {
			job.atMs = Math.min(job.atMs, previous.atMs);
			if (previous.elapsedAtMs !== void 0) job.elapsedAtMs = job.elapsedAtMs === void 0 ? previous.elapsedAtMs : Math.min(job.elapsedAtMs, previous.elapsedAtMs);
		}
		const cancel = () => this.cancel(job);
		if (!cancelled) {
			owner?.jobs.add(job);
			this.jobs.set(job.id, job);
			if (previous) this.cancel(previous);
			this.arm();
		}
		return {
			get atMs() {
				return job.atMs;
			},
			cancel,
			stop: async () => {
				cancel();
				await job.running;
			}
		};
	}
	cancel(job) {
		job.cancelled = true;
		if (!job.running) job.owner?.jobs.delete(job);
		if (this.jobs.get(job.id) === job) {
			this.jobs.delete(job.id);
			this.arm();
		}
	}
	beginClose() {
		this.controller.abort();
		materializeErrorStack(this.controller.signal.reason);
		this.timerGeneration += 1;
		this.cancelTimer?.();
		this.cancelTimer = void 0;
		for (const job of this.jobs.values()) this.cancel(job);
		this.jobs.clear();
	}
	async stop() {
		this.beginClose();
		await Promise.all(this.pending);
	}
	remaining(job, nowMs, elapsedMs) {
		const wallDelay = job.atMs - nowMs;
		return job.elapsedAtMs === void 0 ? wallDelay : Math.min(wallDelay, job.elapsedAtMs - elapsedMs);
	}
	arm() {
		if (this.signal.aborted || this.dispatching) return;
		this.cancelTimer?.();
		this.cancelTimer = void 0;
		const generation = ++this.timerGeneration;
		const next = this.nextWakeAtMs;
		if (next !== null) {
			const nowMs = this.now();
			const delayMs = Math.min(2147483647, Math.max(0, Math.ceil(next - nowMs)));
			this.cancelTimer = runInDetachedAsyncContext(() => this.clock.arm(() => generation === this.timerGeneration ? this.wake(nowMs + delayMs) : void 0, delayMs));
		}
	}
	wake(expectedAtMs) {
		this.cancelTimer = void 0;
		if (this.signal.aborted) return;
		const nowMs = this.now();
		const elapsedMs = this.clock.monotonicNow();
		const due = [...this.jobs.values()].filter((job) => !job.running && this.remaining(job, nowMs, elapsedMs) <= 0).toSorted((a, b) => this.remaining(a, nowMs, elapsedMs) - this.remaining(b, nowMs, elapsedMs));
		let started;
		if (nowMs - expectedAtMs > 6e4) log$3.debug(`late wake by ${nowMs - expectedAtMs}ms; coalescing ${due.length} due jobs`);
		this.dispatching = true;
		try {
			for (const job of due) {
				if (this.signal.aborted || job.cancelled || job.owner?.signal.aborted || this.jobs.get(job.id) !== job) continue;
				if (job.everyMs === void 0) this.jobs.delete(job.id);
				const running = this.run(job);
				if (running) (started ??= []).push(running);
			}
		} finally {
			this.dispatching = false;
			this.arm();
		}
		return started ? Promise.all(started).then(() => void 0) : void 0;
	}
	run(job) {
		log$3[job.everyMs === void 0 ? "debug" : "trace"](`running ${job.id}`);
		const done = createDeferredCore();
		const work = new AsyncWorkScope();
		job.running = done.promise;
		this.pending.add(done.promise);
		const finish = () => {
			job.running = void 0;
			this.pending.delete(done.promise);
			if (job.everyMs !== void 0 && !job.cancelled && !this.signal.aborted) {
				if (job.phase === "maintenance") {
					const alignmentMs = job.atMs - Math.floor(job.atMs / 1e4) * 1e4;
					job.atMs -= alignmentMs;
					if (job.elapsedAtMs !== void 0) job.elapsedAtMs -= alignmentMs;
					job.atMs = nextMaintenanceSlot(job.atMs, this.now(), job.everyMs);
					if (job.elapsedAtMs !== void 0) job.elapsedAtMs = nextMaintenanceSlot(job.elapsedAtMs, this.clock.monotonicNow(), job.everyMs);
				} else {
					job.atMs = this.now() + job.everyMs;
					job.elapsedAtMs = this.clock.monotonicNow() + job.everyMs;
				}
			} else job.owner?.jobs.delete(job);
			done.resolve();
			this.arm();
		};
		let result = void 0;
		try {
			result = job.context(() => runWithMainThreadTask(job.diagnosticName, () => work.run(job.run)));
		} catch (error) {
			log$3.error(`${job.id} failed: ${String(error)}`);
		}
		if (!result && !work.hasPendingWork) {
			finish();
			return;
		}
		Promise.resolve(result).catch((error) => log$3.error(`${job.id} failed: ${String(error)}`)).then(() => AsyncWorkScope.runWhenAllIdle(() => [work], () => work.drain())).finally(finish);
		return done.promise;
	}
};
BigInt(Number.MAX_SAFE_INTEGER);
resolveGlobalSingleton(Symbol.for("openclaw.sqliteWalCheckpointListeners"), () => /* @__PURE__ */ new Set());
createSubsystemLogger("infra/sqlite-wal");
//#endregion
//#region src/infra/sqlite-wal-write-admission.ts
const admissions = resolveGlobalSingleton(Symbol.for("openclaw.sqliteWalWriteAdmissions"), () => /* @__PURE__ */ new WeakMap());
/** A worker-maintained writer never checkpoints inline; its maintenance owner ticks instead. */
function registerSqliteWalWorkerMaintenance(database, execute, cancel) {
	database.exec("PRAGMA wal_autocheckpoint = 0;");
	const stopCheckpointTick = admissions.get(database)?.stopCheckpointTick;
	admissions.set(database, {
		execute,
		cancel
	});
	stopCheckpointTick?.();
}
function isSqliteWalWorkerMaintained(database) {
	return admissions.get(database)?.execute !== void 0;
}
new Int32Array(new SharedArrayBuffer(4));
createSubsystemLogger("infra/sqlite-wal");
new GatewayScheduler();
let lastSqliteExitGroup;
function detachEmptySqliteExitGroup(group) {
	if (group.pending.size > 0) return;
	if (lastSqliteExitGroup === group) lastSqliteExitGroup = void 0;
	process.removeListener("exit", group.dispatch);
}
/**
* Register a best-effort exit-time close for a SQLite handle cache. Returns an
* unregister callback the cache's orderly close path must invoke, so tests and
* runtime shutdowns do not accumulate listeners on shared worker processes.
*/
function registerSqliteCacheExitClose(closeAll) {
	const registration = {
		close: closeAll,
		fired: false
	};
	let group = lastSqliteExitGroup;
	if (!group || process.listeners("exit").at(-1) !== group.dispatch) {
		const pending = /* @__PURE__ */ new Set([registration]);
		const created = {
			pending,
			dispatch: () => {
				const snapshot = [...pending];
				for (const entry of snapshot) {
					if (entry.fired) continue;
					entry.fired = true;
					pending.delete(entry);
					detachEmptySqliteExitGroup(created);
					try {
						entry.close();
					} catch {}
				}
			}
		};
		process.on("exit", created.dispatch);
		lastSqliteExitGroup = group = created;
	} else group.pending.add(registration);
	const owner = group;
	return () => {
		owner.pending.delete(registration);
		detachEmptySqliteExitGroup(owner);
	};
}
//#endregion
//#region src/infra/sqlite-snapshot-policy.ts
function sqliteSnapshotSourceFileSize(pathname) {
	try {
		const stat = fs$1.statSync(pathname);
		return stat.isFile() ? stat.size : 0;
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return 0;
		throw error;
	}
}
//#endregion
//#region src/infra/disk-space.ts
function finiteNonNegativeNumber(value) {
	const numberValue = Number(value);
	return Number.isFinite(numberValue) && numberValue >= 0 ? numberValue : null;
}
function findExistingDiskSpacePath(targetPath) {
	let current = path.resolve(targetPath);
	while (true) try {
		return fs$1.statSync(current).isDirectory() ? current : path.dirname(current);
	} catch {
		const parent = path.dirname(current);
		if (parent === current) return null;
		current = parent;
	}
}
/** Reads available bytes for the volume containing a target path when statfs is available. */
function tryReadDiskSpace(targetPath) {
	if (typeof fs$1.statfsSync !== "function") return null;
	const checkedPath = findExistingDiskSpacePath(targetPath);
	if (!checkedPath) return null;
	try {
		const stats = fs$1.statfsSync(checkedPath);
		const blockSize = finiteNonNegativeNumber(stats.bsize);
		const availableBlocks = finiteNonNegativeNumber(stats.bavail);
		if (blockSize === null || availableBlocks === null) return null;
		const totalBlocks = finiteNonNegativeNumber(stats.blocks);
		return {
			targetPath,
			checkedPath,
			availableBytes: blockSize * availableBlocks,
			totalBytes: totalBlocks === null ? null : blockSize * totalBlocks
		};
	} catch {
		return null;
	}
}
//#endregion
//#region src/infra/sqlite-snapshot-staging.ts
function sqliteSnapshotStagingError(tempDir, cause, allocation = false, sourcePath) {
	markSqliteInspectionOperation(cause, "snapshot");
	let destination = allocation;
	let capacity = false;
	let sqliteErrcode;
	for (let depth = 0, error = cause; depth < 8 && error instanceof Error; depth += 1) {
		const { code, errcode, path: errorPath } = error;
		capacity ||= ["ENOSPC", "EDQUOT"].includes(code ?? "") || errcode === 13;
		if (capacity || typeof errcode === "number" && [
			13,
			778,
			1034,
			1290
		].includes(errcode) || `${errorPath ?? ""}${path.sep}`.startsWith(`${tempDir}${path.sep}`)) {
			destination = true;
			if (typeof errcode === "number") sqliteErrcode = errcode;
		}
		error = error.cause;
	}
	if (!destination) return cause;
	const guidance = capacity ? "free disk space/quota" : "check filesystem health and write permissions";
	let capacityDetail = "";
	if (capacity && sourcePath) try {
		const estimatedBytes = sqliteSnapshotSourceFileSize(sourcePath) + sqliteSnapshotSourceFileSize(`${sourcePath}-wal`) + sqliteSnapshotSourceFileSize(`${sourcePath}-journal`);
		const availableBytes = tryReadDiskSpace(tempDir)?.availableBytes;
		const liveWal = fs$1.existsSync(`${sourcePath}-wal`) && fs$1.existsSync(`${sourcePath}-shm`);
		capacityDetail = `; estimated ${estimatedBytes} bytes needed; ${availableBytes === void 0 ? "available bytes unknown" : `${availableBytes} bytes available`}; source ${liveWal ? "has live WAL sidecars" : "has no live WAL sidecars"}`;
	} catch {}
	const selector = process.env.OPENCLAW_UPDATE_IN_PROGRESS === "1" ? "TMPDIR" : "XDG_CACHE_HOME";
	const message = `${cause instanceof Error ? cause.message : String(cause)}${sqliteErrcode !== void 0 ? ` (SQLite errcode=${sqliteErrcode})` : ""}; snapshot staging root ${allocation ? tempDir : path.dirname(tempDir)}${capacityDetail}: ${guidance} or set ${selector} to a writable filesystem`;
	const error = new Error(message, { cause });
	return isPrivateDirectoryCreationRefused(cause) ? markPrivateDirectoryCreationRefused(error) : error;
}
function createSqliteSnapshotStagingDirectorySync(root = resolvePrivateSqliteSnapshotStagingRoot(), allowLegacyWorker = false) {
	const owned = createSqliteSnapshotStagingTokenSync(root, allowLegacyWorker);
	registerSnapshotTempDirectory(owned.directory, owned.release);
	return owned.directory;
}
/** Token workers remove disposable payload under their own native retirement fences. */
function createSqliteSnapshotStagingTokenSync(root = resolvePrivateSqliteSnapshotStagingRoot(), allowLegacyWorker = false) {
	let directory;
	try {
		try {
			directory = createPrivateSqliteTempDirectorySync(root, allowLegacyWorker ? `openclaw-sqlite-readonly-${process.pid}-` : SQLITE_SNAPSHOT_PREFIX);
		} catch (error) {
			throw sqliteSnapshotStagingError(root, error, true);
		}
		return {
			directory,
			release: acquireSqliteSnapshotToken(directory, "create")
		};
	} catch (error) {
		if (directory) removeTempDirectory(directory);
		throw error;
	}
}
Buffer.from([
	217,
	213,
	5,
	249,
	32,
	161,
	99,
	215
]);
resolveGlobalSingleton(Symbol.for("openclaw.sqliteSnapshotFlights"), () => ({
	unscoped: /* @__PURE__ */ new Map(),
	scoped: /* @__PURE__ */ new WeakMap()
}));
//#endregion
//#region src/infra/sqlite-live-snapshot.ts
const liveOwners = resolveGlobalSingleton(Symbol.for("openclaw.sqliteLiveSnapshotOwners"), () => /* @__PURE__ */ new Map());
function registerLiveSqliteSnapshotOwner(options) {
	const identity = readDatabasePathIdentitySync(options.databasePath);
	const registration = {
		assertCurrent: options.assertCurrent,
		database: options.database,
		owner: options.owner
	};
	liveOwners.set(identity.key, registration);
	return () => {
		if (liveOwners.get(identity.key) === registration) liveOwners.delete(identity.key);
	};
}
//#endregion
//#region src/infra/sqlite-files.ts
/** SQLite main database plus every journal-mode sidecar that can contain database pages. */
const SQLITE_DATABASE_FILE_SUFFIXES = [
	"",
	"-wal",
	"-shm",
	"-journal"
];
SQLITE_DATABASE_FILE_SUFFIXES.slice(1);
Buffer.from([
	0,
	5,
	22,
	7
]);
createSubsystemLogger("state/sqlite");
/** Resolves the main database and all possible journal-mode sidecar paths. */
function resolveSqliteDatabaseFilePaths(pathname) {
	return SQLITE_DATABASE_FILE_SUFFIXES.map((suffix) => `${pathname}${suffix}`);
}
//#endregion
//#region src/infra/update-rehearsal-paths.ts
/** Declare the private filesystem namespace shared by every rehearsal child. */
function buildUpdateRehearsalPathEnv(root) {
	return {
		HOME: root,
		USERPROFILE: root,
		TMPDIR: root,
		TMP: root,
		TEMP: root,
		XDG_CONFIG_HOME: path.join(root, "config"),
		XDG_CACHE_HOME: path.join(root, "cache"),
		XDG_DATA_HOME: path.join(root, "data"),
		XDG_STATE_HOME: path.join(root, "state"),
		OPENCLAW_HOME: root,
		OPENCLAW_STATE_DIR: root,
		OPENCLAW_CONFIG_PATH: path.join(root, "openclaw.json"),
		OPENCLAW_WORKSPACE_DIR: path.join(root, "workspace"),
		OPENCLAW_SKIP_CHANNELS: "1",
		OPENCLAW_SKIP_PROVIDERS: "1",
		OPENCLAW_SKIP_CRON: "1",
		OPENCLAW_SKIP_GMAIL_WATCHER: "1",
		OPENCLAW_SKIP_CANVAS_HOST: "1",
		OPENCLAW_SKIP_BROWSER_CONTROL_SERVER: "1",
		OPENCLAW_SKIP_STARTUP_MODEL_PREWARM: "1",
		OPENCLAW_NO_AUTO_UPDATE: "1",
		NODE_DISABLE_COMPILE_CACHE: "1"
	};
}
/** Recognize the complete 9.3+ driver contract; update-in-progress alone is also used by live Doctor. */
function resolveUpdateRehearsalRoot(env) {
	const root = env.OPENCLAW_STATE_DIR;
	if (!root || !path.isAbsolute(root) || !["0", "1"].includes(env.OPENCLAW_UPDATE_IN_PROGRESS ?? "") || Object.entries(buildUpdateRehearsalPathEnv(root)).some(([key, value]) => env[key] !== value) || env.OPENCLAW_SERVICE_REPAIR_POLICY !== "external" || env.OPENCLAW_UPDATE_PARENT_ALLOWS_GATEWAY_SERVICE_REPAIR !== "0" || env.OPENCLAW_UPDATE_PARENT_ALLOWS_GATEWAY_ACTIVATION !== "0" || Boolean(env.OPENCLAW_COMPATIBILITY_HOST_VERSION)) return;
	return path.resolve(root);
}
/** Uncopied absolute locators remain inventory; they cannot grant writes outside the private root. */
function isUpdateRehearsalReadOnlyPath(filePath, env) {
	const root = resolveUpdateRehearsalRoot(env);
	if (!root) return false;
	const resolved = path.resolve(filePath);
	return !isPathInside$1(root, resolved) || !isPathInside$1(resolveIdentityPathViaExistingAncestorSync(root), resolveIdentityPathViaExistingAncestorSync(resolved));
}
/** Reuse prepared images only when the entire SQLite family stays in the disposable namespace. */
function isUpdateRehearsalPrivateDatabase(filePath, env) {
	return resolveUpdateRehearsalRoot(env) !== void 0 && resolveSqliteDatabaseFilePaths(filePath).every((file) => !isUpdateRehearsalReadOnlyPath(file, env));
}
//#endregion
//#region src/infra/sqlite-snapshot-source.ts
/** The inspection scope owns private readers until native close and snapshot disposal settle. */
function openSqliteReadOnlyDatabase(pathname, options = {}) {
	const scope = artifactPreservingReads.getStore();
	if (!scope || !isArtifactPreservingStateRead("agent", pathname)) return openNodeSqliteDatabase(pathname, {
		...options,
		readOnly: true
	});
	const snapshot = isUpdateRehearsalPrivateDatabase(pathname, process.env) ? void 0 : prepareSqliteReadOnlyLocationSync(pathname);
	const release = snapshot ? retainSnapshotTempDirectory(snapshot.cleanupRoot ?? path.dirname(snapshot.location)) : void 0;
	const native = {};
	const close = () => {
		native.close?.();
		release?.();
		if (snapshot && !snapshot.cleanup()) throw new SqliteSnapshotCleanupError("SQLite inspection snapshot cleanup failed.");
		scope.readers.delete(close);
	};
	scope.readers.add(close);
	const db = openNodeSqliteDatabase(snapshot?.location ?? pathname, {
		...options,
		readOnly: true
	});
	const dispose = db.close.bind(db);
	native.close = () => {
		if (db.isOpen) dispose();
	};
	db.close = close;
	return db;
}
function prepareSqliteReadOnlyLocationSync(pathname) {
	const stagingRoot = createSqliteSnapshotStagingDirectorySync();
	try {
		return adoptPreparedLocation(runSqliteReadOnlyWorkerSync(pathname, stagingRoot), stagingRoot);
	} catch (error) {
		if (!removeTempDirectory(stagingRoot)) throw new SqliteSnapshotCleanupError(`${coerceErrorMessage(error)}; SQLite snapshot cleanup failed: ${stagingRoot}`, { cause: error });
		throw error;
	}
}
//#endregion
//#region src/state/openclaw-state-db-admission.ts
function getStateSchemaFacts(database) {
	return isPostgresSqlConnection(database) ? getPostgresPhysicalFacts(database) : getAdmittedSqliteSchemaFacts(database);
}
const versionKey = {
	name: "state.schema-version",
	schemaDependent: true,
	read(value) {
		if (typeof value === "object" && value !== null && "userVersion" in value && typeof value.userVersion === "number" && "contentVersion" in value && typeof value.contentVersion === "number") return {
			userVersion: value.userVersion,
			contentVersion: value.contentVersion
		};
	}
};
const connectionVersions = /* @__PURE__ */ new WeakMap();
function rememberConnectionVersion(database, value) {
	const previous = connectionVersions.get(database);
	const install = (entry) => {
		if (entry) connectionVersions.set(database, entry);
		else connectionVersions.delete(database);
	};
	if (!stageSqliteTransactionState(database, {
		stage: () => install(value),
		commit: () => {},
		rollback: () => install(previous)
	})) install(value);
}
function schemaVersionKey(admissionId) {
	return {
		name: `state.schema-version:${admissionId}`,
		read: versionKey.read
	};
}
function getStateSchemaVersionAdmission(database) {
	const schema = getStateSchemaFacts(database);
	if (!schema) return;
	const retained = connectionVersions.get(database);
	if (retained?.schema === schema) return retained.facts;
	const history = getSqliteDatabaseAdmission(database, schemaVersionKey(schema.admissionId));
	const currentSchema = history ? void 0 : getSqliteDatabaseAdmission(database, schemaAdmission);
	if (!history && !isPostgresSqlConnection(database) && currentSchema?.admissionId !== schema.admissionId) return;
	const facts = history ?? getSqliteDatabaseAdmission(database, versionKey);
	if (facts) {
		rememberConnectionVersion(database, {
			schema,
			facts
		});
		if (!history) publishSqliteDatabaseAdmission(database, schemaVersionKey(schema.admissionId), facts);
	}
	return facts;
}
/** A cold snapshot may discover historical facts without replacing a newer publication. */
function rememberStateSchemaVersionAdmission(database, facts) {
	const schema = getStateSchemaFacts(database);
	if (!schema) return;
	rememberConnectionVersion(database, {
		schema,
		facts
	});
	const current = getSqliteDatabaseAdmission(database, schemaAdmission);
	if (!isPostgresSqlConnection(database) && current?.admissionId !== schema.admissionId) return;
	publishSqliteDatabaseAdmission(database, schemaVersionKey(schema.admissionId), facts);
	publishSqliteDatabaseAdmission(database, versionKey, facts);
}
//#endregion
//#region src/infra/sqlite-file-generation-worker.ts
/** Raw descriptor closes must not release a sibling connection's process-wide SQLite locks. */
function readSqliteFileGenerationSync(pathname) {
	return parseSqliteFileGeneration(runSqliteReadOnlyWorkerSync(pathname, void 0, "file-generation"));
}
async function readSqliteFileGeneration(pathname, signal) {
	return parseSqliteFileGeneration(await runSqliteReadOnlyWorker(pathname, {
		mode: "file-generation",
		signal
	}));
}
//#endregion
//#region src/infra/sqlite-terminal-open-latch.ts
function generationMatchesPath(pathname, expected) {
	try {
		return sameSqliteFileGeneration(expected, readSqliteFileGenerationSync(pathname));
	} catch {
		return false;
	}
}
/**
* Per-path latch for terminal database-open failures (newer schema, proven
* corruption). Recording quarantines the path: any live handle is closed and
* every later open fails fast until doctor repairs the file and clears it.
*/
function createSqliteTerminalOpenLatch(options) {
	const failures = /* @__PURE__ */ new Map();
	return {
		/** Read the owner's recorded fact without running filesystem or database inspection. */
		peek: (pathname) => failures.get(path.resolve(pathname))?.error,
		get: (pathname) => {
			const resolvedPath = path.resolve(pathname);
			const failure = failures.get(resolvedPath);
			if (!failure) return;
			if (failure.generation && !generationMatchesPath(resolvedPath, failure.generation)) {
				failures.delete(resolvedPath);
				return;
			}
			return failure.error;
		},
		async getAsync(pathname, isCurrentGeneration) {
			const resolvedPath = path.resolve(pathname);
			const failure = failures.get(resolvedPath);
			if (failure?.generation && !await isCurrentGeneration(resolvedPath, failure.generation)) {
				failures.delete(resolvedPath);
				return;
			}
			return failure?.error;
		},
		record: (pathname, error, generation) => {
			const resolvedPath = path.resolve(pathname);
			if (generation && !generationMatchesPath(resolvedPath, generation)) return false;
			failures.set(resolvedPath, {
				error,
				...generation ? { generation } : {}
			});
			options.closeByPath(resolvedPath, error);
			return true;
		},
		clear: (pathname) => {
			failures.delete(path.resolve(pathname));
		},
		clearAll: (rootPath) => {
			for (const pathname of failures.keys()) if (rootPath === void 0 || isPathInside$1(rootPath, pathname)) failures.delete(pathname);
		}
	};
}
//#endregion
//#region src/state/openclaw-quarantine-store.ts
const OPENCLAW_QUARANTINE_SCHEMA_VERSION = 2;
const OPENCLAW_QUARANTINE_BUSY_TIMEOUT_MS = 5e3;
const quarantineSchemaAdmission = {
	name: "openclaw.quarantine.schema",
	schemaDependent: true,
	read(value) {
		if (typeof value !== "object" || value === null || !("version" in value) || typeof value.version !== "number") return;
		return { version: value.version };
	}
};
function quarantineDecisionAdmission(pathname) {
	return {
		name: `openclaw.quarantine.decision:${path.resolve(pathname)}`,
		read: (value) => value === null || isQuarantineDecision(value) ? value : void 0
	};
}
function isQuarantineDecision(value) {
	return isRecord(value) && (value.kind === "agent" || value.kind === "state") && typeof value.reason === "string" && typeof value.quarantinedAt === "number" && (value.verifiedGenerationJson === null || typeof value.verifiedGenerationJson === "string");
}
function readQuarantineSchemaVersion(database, storePath, fresh = false) {
	const admitted = fresh ? void 0 : getSqliteDatabaseAdmission(database, quarantineSchemaAdmission);
	if (admitted) return admitted.version;
	const userVersion = database.prepare("PRAGMA user_version").get()?.user_version;
	if (typeof userVersion !== "number" || !Number.isInteger(userVersion)) throw new Error(`OpenClaw quarantine store ${storePath} has an invalid schema version.`);
	if (userVersion > OPENCLAW_QUARANTINE_SCHEMA_VERSION) throw new Error(`OpenClaw quarantine store ${storePath} uses newer schema version ${userVersion}.`);
	if (userVersion !== 0) publishSqliteDatabaseAdmission(database, quarantineSchemaAdmission, { version: userVersion });
	return userVersion;
}
/** Runtime guards share the owner's decision; explicit repair may inspect disk. */
function readOpenClawDatabaseQuarantine(pathname, options = {}) {
	const storePath = resolveQuarantineStorePath(options.env ?? process.env);
	const load = () => readPersistedQuarantineDecision(pathname, storePath, options.fresh) ?? null;
	const decision = options.fresh ? load() : getOrLoadSqliteDatabaseAdmissionForPath(storePath, quarantineDecisionAdmission(pathname), load);
	return decision ? resolveQuarantineDecision(decision, pathname, storePath) : void 0;
}
function readPersistedQuarantineDecision(pathname, storePath, fresh = false) {
	if (!existsSync(storePath)) return;
	const database = openSqliteReadOnlyDatabase(storePath, { timeout: OPENCLAW_QUARANTINE_BUSY_TIMEOUT_MS });
	let outcome;
	try {
		outcome = { value: readQuarantineDecision(database, pathname, storePath, fresh) };
	} catch (error) {
		outcome = { error };
	}
	try {
		database.close();
	} catch (closeError) {
		let quarantine;
		let readError = "error" in outcome ? outcome.error : void 0;
		if ("value" in outcome && outcome.value) try {
			quarantine = resolveQuarantineDecision(outcome.value, pathname, storePath);
		} catch (error) {
			readError = error;
		}
		throw new OpenClawQuarantineReadCleanupError(readError === void 0 ? [closeError] : [readError, closeError], quarantine);
	}
	if ("error" in outcome) throw outcome.error;
	return outcome.value;
}
function readQuarantineDecision(database, pathname, storePath, fresh = false) {
	const userVersion = readQuarantineSchemaVersion(database, storePath, fresh);
	if (userVersion === 0) return;
	const generationColumn = userVersion >= 2 ? ", verified_generation" : "";
	const row = database.prepare(`SELECT kind, reason, quarantined_at${generationColumn} FROM quarantined_databases WHERE path = ? LIMIT 1`).get(path.resolve(pathname));
	if (!row) return;
	const verifiedGenerationJson = userVersion >= 2 ? row.verified_generation : void 0;
	if (row.kind !== "agent" && row.kind !== "state" || typeof row.reason !== "string" || typeof row.quarantined_at !== "number" || !Number.isInteger(row.quarantined_at) || verifiedGenerationJson !== void 0 && verifiedGenerationJson !== null && typeof verifiedGenerationJson !== "string") throw new Error(`OpenClaw quarantine store ${storePath} contains an invalid row.`);
	return {
		kind: row.kind,
		quarantinedAt: row.quarantined_at,
		reason: row.reason,
		verifiedGenerationJson: typeof verifiedGenerationJson === "string" ? verifiedGenerationJson : null
	};
}
function resolveQuarantineDecision(decision, pathname, storePath) {
	if (decision.verifiedGenerationJson !== null) {
		let verifiedGeneration;
		try {
			verifiedGeneration = parseSqliteFileGeneration(decision.verifiedGenerationJson);
		} catch {
			throw new Error(`OpenClaw quarantine store ${storePath} contains an invalid row.`);
		}
		try {
			const currentGeneration = readSqliteFileGenerationSync(path.resolve(pathname));
			if (!sameSqliteFileGeneration(verifiedGeneration, currentGeneration)) return;
		} catch {
			return;
		}
	}
	return {
		kind: decision.kind,
		quarantinedAt: decision.quarantinedAt,
		reason: decision.reason
	};
}
/** Runtime opens refuse recorded damage while tolerating a broken quarantine index. */
function readOpenClawDatabaseQuarantineFailure(kind, pathname, options = {}) {
	let quarantine;
	let cleanupFailure;
	try {
		quarantine = readOpenClawDatabaseQuarantine(pathname, options);
	} catch (error) {
		if (!(error instanceof OpenClawQuarantineReadCleanupError)) return;
		if (!error.quarantine) throw error;
		quarantine = error.quarantine;
		cleanupFailure = error;
	}
	if (!quarantine) return;
	const failure = /* @__PURE__ */ new Error(`OpenClaw ${kind} database ${pathname} is quarantined after integrity verification failed: ${quarantine.reason ?? "unknown integrity error"}. Restore the database from a backup or repair it, then run openclaw doctor --fix to clear the quarantine. See ${OPENCLAW_DATABASE_SCHEMA_DOCS_URL}.`);
	failure.name = "SqliteIntegrityError";
	if (cleanupFailure) failure.cause = cleanupFailure;
	return failure;
}
//#endregion
//#region src/state/openclaw-state-db-borrow.ts
/** The canonical cache supplies identity and custody; this owner manages its native references. */
function createStateDatabaseRetainer(state, operations) {
	const admit = (pathname, ownership) => {
		const scope = getOpenClawDatabaseMaintenanceScope();
		if (ownership === "cached-read") scope?.assertReadAdmission();
		else scope?.assertAdmission();
		operations.assertOpen(pathname, ownership);
		return scope;
	};
	const retain = (database, scope, readOnly = false) => {
		operations.capture(database.path).assertCurrent();
		if (state.cachedDatabases.get(database.path) !== database || !database.db.isOpen) throw new Error("OpenClaw state database borrow requires its current canonical handle");
		const owner = state.borrowers.get(database.db) ?? {
			references: /* @__PURE__ */ new Set(),
			retiring: false,
			cleanupComplete: false
		};
		if (owner.retiring) throw new Error("OpenClaw state database native owner is retiring");
		if (!readOnly) observeOpenClawDatabaseMaintenanceResource(database.db);
		state.borrowers.set(database.db, owner);
		const isCurrent = () => !scope || isOpenClawDatabaseMaintenanceResourceOwned(database.db, scope);
		const reference = retainStateDatabaseReference({
			owner,
			retirement: readOnly ? void 0 : {
				ordinary: scope === void 0,
				isCurrent,
				retire: () => {
					if (!isCurrent()) {
						owner.retiring = false;
						return;
					}
					operations.retire(database, scope === void 0);
				}
			},
			stopBeforeRetirement: () => database.walMaintenance.stop(),
			retainFailedClose: () => operations.retainFailed(database),
			ownRetirement: (close) => operations.ownRetirement(database, close),
			onIdle: () => operations.touch(database)
		});
		scope?.own(reference, "shared-references", () => reference.releaseAsync());
		return reference;
	};
	const findReadDatabase = (pathname, ownership) => {
		const resolvedPath = resolveDatabasePath({ path: pathname });
		const database = state.cachedDatabases.get(resolvedPath);
		if (!database?.db.isOpen) return {
			database: void 0,
			scope: void 0
		};
		return {
			database,
			scope: admit(resolvedPath, ownership)
		};
	};
	const retainReadReference = (database, scope) => {
		const reference = retain(database, scope, true);
		const assertCurrent = () => {
			if (state.cachedDatabases.get(database.path) !== database || !database.db.isOpen) throw new Error("Shared-state read lost its original native owner");
		};
		return {
			assertCurrent,
			observe() {
				assertCurrent();
				observeOpenClawDatabaseMaintenanceResource(database.db);
			},
			release: () => reference.release()
		};
	};
	return {
		retain: (database) => retain(database, admit(database.path)),
		retainForIndependentRead(pathname, ownership) {
			const { database, scope } = findReadDatabase(pathname, ownership);
			return database ? retainReadReference(database, scope) : void 0;
		},
		borrowForRead(pathname, ownership) {
			const { database, scope } = findReadDatabase(pathname, ownership);
			if (!database) return;
			if (database.db.isTransaction) throw new Error("Asynchronous shared-state reads cannot run inside a native transaction");
			return {
				database,
				...retainReadReference(database, scope)
			};
		}
	};
}
function assertStateDatabaseBorrowersReleased(owner, pathname) {
	if (owner?.references.size) throw new Error(`OpenClaw state database still has active native borrowers: ${pathname}`);
}
/** Preserve the requesting owner's retirement when the last reference is only a read pin. */
function retainStateDatabaseReference(params) {
	const { owner } = params;
	const reference = {};
	owner.references.add(reference);
	let released = false;
	const release = () => {
		if (released || owner.cleanupComplete) {
			released = true;
			return;
		}
		released = true;
		owner.references.delete(reference);
		if (owner.retirement && !owner.retirement.isCurrent()) {
			owner.retirement = void 0;
			owner.asyncRetirement = void 0;
			owner.retiring = false;
		}
		if (params.retirement?.isCurrent() && !owner.retirement?.ordinary) owner.retirement = params.retirement;
		if (owner.references.size > 0) return;
		if (!owner.retirement) {
			params.onIdle();
			return;
		}
		owner.retiring = true;
		if (owner.asyncRetirement) {
			owner.asyncRetirement.start();
			return;
		}
		try {
			owner.retirement.retire();
		} catch (error) {
			released = false;
			params.retainFailedClose();
			throw error;
		}
		owner.retirement = void 0;
		params.onIdle();
	};
	return {
		release,
		async releaseAsync() {
			if (owner.cleanupComplete) return;
			if ((params.retirement?.isCurrent() && !owner.retirement?.ordinary ? params.retirement : owner.retirement)?.isCurrent()) owner.asyncRetirement ??= createAsyncStateDatabaseRetirement(params);
			release();
			await owner.asyncRetirement?.close();
		}
	};
}
function createAsyncStateDatabaseRetirement(params) {
	const { owner } = params;
	const retained = {};
	let pending;
	let unregister;
	const finish = (retirement) => {
		owner.references.delete(retained);
		if (retirement?.isCurrent()) retirement.retire();
		else owner.retiring = false;
		owner.retirement = void 0;
		owner.asyncRetirement = void 0;
		unregister?.();
		unregister = void 0;
		params.onIdle();
	};
	const run = () => {
		if (pending) return pending;
		if (owner.cleanupComplete || owner.references.size > (owner.references.has(retained) ? 1 : 0)) return Promise.resolve();
		if (!owner.retirement?.isCurrent()) {
			finish();
			return Promise.resolve();
		}
		owner.retiring = true;
		owner.references.add(retained);
		unregister ??= params.ownRetirement(close);
		pending = Promise.resolve().then(async () => {
			await params.stopBeforeRetirement();
			finish(owner.retirement);
		}).catch((error) => {
			owner.references.add(retained);
			params.retainFailedClose();
			throw error;
		});
		pending.catch(() => {});
		return pending;
	};
	function close() {
		const attempt = run();
		return attempt.catch((error) => {
			if (pending === attempt) pending = void 0;
			throw error;
		});
	}
	return {
		start: () => void run(),
		close
	};
}
//#endregion
//#region src/state/openclaw-state-db-schema-version.ts
const CONTENT_VERSION_KEY = "state.schema.contentVersion";
const contentVersionQuery = createSqliteQueryCache((db) => prepareSqliteQuerySync(db, () => getNodeSqliteKysely(db).selectFrom("config_machine_state").select("value_json").where("state_key", "=", CONTENT_VERSION_KEY)));
/** Content and its marker commit together, even while older readers retain their version floor. */
function readStateSchemaContentVersion(db, published, readRow = readStateSchemaContentVersionRow) {
	if (isPostgresSqlConnection(db)) {
		const facts = getStateSchemaVersionAdmission(db);
		if (!facts) throw new Error("Missing PostgreSQL state schema admission; use the matching OpenClaw version or restore the matching PostgreSQL schema and anchor.");
		return Math.max(published ?? facts.userVersion, facts.contentVersion);
	}
	const admitted = getStateSchemaVersionAdmission(db);
	if (admitted) return Math.max(published ?? admitted.userVersion, admitted.contentVersion);
	const version = getAdmittedSqliteSchemaFacts(db)?.userVersion ?? readSqliteUserVersion(db);
	const contentVersion = parseContentVersion(tableExists(db, "config_machine_state") ? readRow(db)?.value_json : void 0);
	rememberStateSchemaVersionAdmission(db, {
		userVersion: version,
		contentVersion
	});
	return Math.max(published ?? version, contentVersion);
}
function readStateSchemaContentVersionRow(db) {
	return contentVersionQuery(db)().rows[0];
}
function parseContentVersion(valueJson) {
	if (valueJson === void 0) return 0;
	let contentVersion;
	try {
		contentVersion = valueJson === null ? null : JSON.parse(valueJson);
	} catch (cause) {
		throw new SqliteSchemaMismatchError(`Invalid shared state schema content version in ${CONTENT_VERSION_KEY}.`, { cause });
	}
	if (typeof contentVersion !== "number" || !Number.isSafeInteger(contentVersion) || contentVersion < 0) throw new SqliteSchemaMismatchError(`Invalid shared state schema content version in ${CONTENT_VERSION_KEY}.`);
	return contentVersion;
}
function assertSupportedStateSchemaVersion(db, pathname, prepared, readRow) {
	if (isPostgresSqlConnection(db)) return readStateSchemaContentVersion(db);
	try {
		const userVersion = prepared?.userVersion ?? getStateSchemaVersionAdmission(db)?.userVersion ?? getAdmittedSqliteSchemaFacts(db)?.userVersion ?? readSqliteUserVersion(db);
		const contentVersion = prepared?.contentVersion ?? (userVersion > 22 ? userVersion : readStateSchemaContentVersion(db, userVersion, readRow));
		if (contentVersion > 22) throw createNewerSqliteSchemaVersionError("OpenClaw state database", pathname, contentVersion, 22);
		return userVersion;
	} catch (error) {
		throw normalizeOpenClawStateSchemaReadError(error, pathname);
	}
}
//#endregion
//#region src/state/openclaw-state-db-cache.admission.ts
/** Refresh cached-handle admission and settle failures against its exact native owner. */
function createStateDatabaseCacheAdmission(owner) {
	return {
		initialize(database) {
			const db = database.db;
			if (isPostgresSqlConnection(db)) {
				assertSupportedStateSchemaVersion(db, database.path);
				return getPostgresPhysicalFacts(db);
			}
			admitSqliteSchema(db);
			return runSqliteReadOperationSync(db, () => {
				assertSupportedStateSchemaVersion(db, database.path);
				return getAdmittedSqliteSchemaFacts(db);
			});
		},
		closeTerminalFailure(pathname, error) {
			markOpenClawStateDatabaseFailure(error, pathname);
			revokeSqliteDatabaseAdmissionsForPath(pathname);
			owner.invalidate(pathname);
			const cached = owner.cachedDatabases.get(pathname);
			const errors = [];
			try {
				if (cached) owner.evict(cached);
			} catch (cleanupError) {
				errors.push(cleanupError);
			}
			try {
				owner.notifyTerminalFailure(pathname, error);
			} catch (notificationError) {
				errors.push(notificationError);
			}
			throwSqliteLifecycleErrors(errors, "Terminal shared-state failure cleanup failed");
		},
		read(pathname, operation) {
			const database = owner.cachedDatabases.get(pathname);
			if (!database) return;
			if (!database.db.isOpen) return operation(database);
			const db = database.db;
			if (isPostgresSqlConnection(db)) {
				assertSupportedStateSchemaVersion(db, database.path);
				database.schemaFacts = getPostgresPhysicalFacts(db);
				return operation(database);
			}
			let admitted = false;
			try {
				return runSqliteReadOperationSync(db, () => {
					const facts = getAdmittedSqliteSchemaFacts(db);
					if (!facts || facts !== database.schemaFacts) {
						assertSupportedStateSchemaVersion(db, database.path);
						database.schemaFacts = facts;
					}
					admitted = true;
					return operation(database);
				});
			} catch (error) {
				if (admitted) throw error;
				const failure = error instanceof Error ? error : new Error(String(error));
				if (isSqliteCorruptionError(failure)) {
					owner.evict(database);
					return;
				}
				if (isSqliteSchemaVersionError(failure)) owner.recordSchemaFailure(database.path, failure);
				throw failure;
			}
		}
	};
}
//#endregion
//#region src/infra/sqlite-handle-lifecycle.ts
/** Idle native connections share one retention window across SQLite owners. */
const SQLITE_IDLE_HANDLE_TTL_MS = 18e5;
//#endregion
//#region src/state/openclaw-state-db-cache.idle.ts
const log = createSubsystemLogger("state/db");
/** Schedule native retirement against the canonical cache's handles and borrow pins. */
function createStateDatabaseIdleRetirement({ cachedDatabases, retainedDatabaseHandles, idleTimers, idleReferences, borrowers }, retire) {
	const touch = (database) => {
		if (!(cachedDatabases.get(database.path) === database && database.db.isOpen) && retainedDatabaseHandles.get(database.db) !== database) return;
		const previous = idleTimers.get(database.db);
		if (previous) {
			previous.refresh();
			return;
		}
		const timer = runInDetachedAsyncContext(() => setTimeout(() => {
			idleTimers.delete(database.db);
			try {
				if (database.db.isOpen && database.db.isTransaction) touch(database);
				else if (!borrowers.get(database.db)?.references.size && !idleReferences.get(database.db)?.size) retire(database, false, {
					busyTimeoutMs: 0,
					checkpointMode: "PASSIVE"
				});
			} catch (error) {
				log.warn("Idle shared-state database cleanup failed", {
					path: database.path,
					error
				});
				touch(database);
			}
		}, SQLITE_IDLE_HANDLE_TTL_MS));
		timer.unref();
		idleTimers.set(database.db, timer);
	};
	return {
		touch,
		/** Retained consumers postpone idle eviction without blocking explicit retirement. */
		retain(database) {
			if (cachedDatabases.get(database.path) !== database || !database.db.isOpen || borrowers.get(database.db)?.retiring) throw new Error("OpenClaw state database idle retention requires its current canonical handle");
			const references = idleReferences.get(database.db) ?? /* @__PURE__ */ new Set();
			const reference = {};
			references.add(reference);
			idleReferences.set(database.db, references);
			return () => {
				if (!references.delete(reference)) return;
				if (cachedDatabases.get(database.path) === database && database.db.isOpen) touch(database);
			};
		}
	};
}
//#endregion
//#region src/infra/fs-safe-env.ts
const nativeModeKey = "OPENCLAW_FS_SAFE_NATIVE_MODE";
const legacyModeKeys = ["FS_SAFE_PYTHON_MODE", "OPENCLAW_FS_SAFE_PYTHON_MODE"];
const legacyKeys = [
	...legacyModeKeys,
	"FS_SAFE_PYTHON",
	"OPENCLAW_FS_SAFE_PYTHON",
	"OPENCLAW_PINNED_PYTHON",
	"OPENCLAW_PINNED_WRITE_PYTHON"
];
const fallbacks = /* @__PURE__ */ new WeakMap();
let warned = false;
function nativeModeIsValid(value) {
	const normalized = value?.trim().toLowerCase() ?? "";
	return /^(?:0|false|off|never|1|true|on|auto|required|require)$/u.test(normalized);
}
function currentFallback(env) {
	const fallback = fallbacks.get(env);
	return fallback && env[fallback.key] === fallback.value ? fallback : void 0;
}
/** Read the operator/config inputs without promoting a derived native fallback. */
function fsSafeEnvInput(env) {
	const fallback = currentFallback(env);
	if (!fallback) return env;
	const input = {
		...env,
		[fallback.key]: fallback.previous
	};
	if (!fallback.existed) delete input[fallback.key];
	return input;
}
/** Retire our unchanged projection before an environment owner writes real inputs. */
function clearFsSafeEnvFallback(env) {
	const fallback = currentFallback(env);
	fallbacks.delete(env);
	if (!fallback) return;
	if (!fallback.existed) delete env[fallback.key];
	else env[fallback.key] = fallback.previous;
}
/** Preserve OpenClaw's retired Python mode env contract below both native names. */
function normalizeFsSafeNativeEnv(env = process.env) {
	clearFsSafeEnvFallback(env);
	const configured = legacyKeys.filter((key) => env[key] !== void 0);
	if (configured.length && env === process.env && !warned) {
		warned = true;
		process.emitWarning(`${configured.join(", ")} is deprecated. OpenClaw maps legacy mode values to native mode only when neither FS_SAFE_NATIVE_MODE nor OPENCLAW_FS_SAFE_NATIVE_MODE selects a mode. Replace Python mode variables with native mode variables; interpreter path settings are ignored.`, {
			code: "FS_SAFE_PYTHON_DEPRECATED",
			type: "DeprecationWarning"
		});
	}
	if (nativeModeIsValid(env.FS_SAFE_NATIVE_MODE) || nativeModeIsValid(env[nativeModeKey])) return;
	const value = legacyModeKeys.map((key) => env[key]).find((entry) => entry !== void 0);
	if (value === void 0) return;
	const keys = Object.keys(env);
	const key = !keys.includes(nativeModeKey) && Object.hasOwn(env, nativeModeKey) ? keys.find((candidate) => candidate.toUpperCase() === nativeModeKey) ?? nativeModeKey : nativeModeKey;
	const existed = Object.hasOwn(env, key);
	const previous = env[key];
	env[key] = value;
	fallbacks.set(env, {
		key,
		value,
		previous,
		existed
	});
}
//#endregion
//#region src/infra/host-env-security-policy.json
var host_env_security_policy_default = {
	blockedEverywhereKeys: [
		"NODE_OPTIONS",
		"NODE_PATH",
		"NODE_REDIRECT_WARNINGS",
		"NODE_REPL_EXTERNAL_MODULE",
		"NODE_REPL_HISTORY",
		"NODE_V8_COVERAGE",
		"PYTHONHOME",
		"PYTHONPATH",
		"PERL5LIB",
		"PERL5OPT",
		"RUBYLIB",
		"RUBYOPT",
		"BASHOPTS",
		"BASH_ENV",
		"ENV",
		"KSH_ENV",
		"BROWSER",
		"GIT_ALLOW_PROTOCOL",
		"GIT_EDITOR",
		"GIT_EXTERNAL_DIFF",
		"GIT_DIR",
		"GIT_WORK_TREE",
		"GIT_COMMON_DIR",
		"GIT_EXEC_PATH",
		"GIT_INDEX_FILE",
		"GIT_OBJECT_DIRECTORY",
		"GIT_ALTERNATE_OBJECT_DIRECTORIES",
		"GIT_NAMESPACE",
		"GIT_PROTOCOL_FROM_USER",
		"GIT_SEQUENCE_EDITOR",
		"GIT_TEMPLATE_DIR",
		"GIT_SSL_NO_VERIFY",
		"GIT_SSL_CAINFO",
		"GIT_SSL_CAPATH",
		"CC",
		"CPP",
		"CXX",
		"CXXCPP",
		"CARGO_BUILD_RUSTC",
		"CARGO_BUILD_RUSTC_WRAPPER",
		"CARGO_BUILD_RUSTC_WORKSPACE_WRAPPER",
		"CARGO_BUILD_RUSTDOC",
		"RUSTC",
		"RUSTC_WRAPPER",
		"RUSTC_WORKSPACE_WRAPPER",
		"RUSTDOC",
		"CMAKE_C_COMPILER",
		"CMAKE_CXX_COMPILER",
		"SHELL",
		"SHELLOPTS",
		"PS4",
		"GCONV_PATH",
		"IFS",
		"SSLKEYLOGFILE",
		"JAVA_OPTS",
		"JAVA_TOOL_OPTIONS",
		"_JAVA_OPTIONS",
		"JDK_JAVA_OPTIONS",
		"PYTHONBREAKPOINT",
		"DOTNET_STARTUP_HOOKS",
		"DOTNET_ADDITIONAL_DEPS",
		"FPATH",
		"GLIBC_TUNABLES",
		"MAVEN_OPTS",
		"MAKE",
		"MAKEFLAGS",
		"MFLAGS",
		"SBT_OPTS",
		"GRADLE_OPTS",
		"ANT_OPTS",
		"HGRCPATH",
		"HGEDITOR",
		"HGMERGE",
		"EXINIT",
		"VIMINIT",
		"MYVIMRC",
		"GVIMINIT",
		"LUA_INIT",
		"LUA_INIT_5_1",
		"LUA_INIT_5_2",
		"LUA_INIT_5_3",
		"LUA_INIT_5_4",
		"EMACSLOADPATH",
		"RUBYSHELL",
		"GIT_HOOK_PATH",
		"SVN_EDITOR",
		"SVN_SSH",
		"BZR_EDITOR",
		"BZR_SSH",
		"BZR_PLUGIN_PATH",
		"SUDO_ASKPASS",
		"JULIA_EDITOR",
		"CONFIG_SITE",
		"CONFIG_SHELL",
		"CMAKE_TOOLCHAIN_FILE",
		"CATALINA_OPTS",
		"CORECLR_PROFILER",
		"HELM_PLUGINS",
		"PACKER_PLUGIN_PATH",
		"VAGRANT_VAGRANTFILE",
		"ERL_AFLAGS",
		"ERL_FLAGS",
		"ERL_ZFLAGS",
		"ELIXIR_ERL_OPTIONS",
		"R_ENVIRON",
		"R_PROFILE",
		"R_ENVIRON_USER",
		"R_PROFILE_USER",
		"TCLLIBPATH",
		"HOSTALIASES"
	],
	blockedOverrideOnlyKeys: [
		"HOME",
		"GRADLE_USER_HOME",
		"ZDOTDIR",
		"GIT_DIR",
		"GIT_WORK_TREE",
		"GIT_COMMON_DIR",
		"GIT_INDEX_FILE",
		"GIT_OBJECT_DIRECTORY",
		"GIT_ALTERNATE_OBJECT_DIRECTORIES",
		"GIT_NAMESPACE",
		"GIT_SSH_COMMAND",
		"GIT_SSH",
		"GIT_PROXY_COMMAND",
		"GIT_ASKPASS",
		"GIT_SSL_NO_VERIFY",
		"GIT_SSL_CAINFO",
		"GIT_SSL_CAPATH",
		"SSH_ASKPASS",
		"LESSOPEN",
		"LESSCLOSE",
		"PAGER",
		"MANPAGER",
		"GIT_PAGER",
		"EDITOR",
		"VISUAL",
		"FCEDIT",
		"SUDO_EDITOR",
		"PROMPT_COMMAND",
		"HISTFILE",
		"PERL5DB",
		"PERL5DBCMD",
		"OPENSSL_CONF",
		"OPENSSL_ENGINES",
		"PYTHONSTARTUP",
		"WGETRC",
		"CURL_HOME",
		"CLASSPATH",
		"CFLAGS",
		"CGO_CFLAGS",
		"CGO_LDFLAGS",
		"GOFLAGS",
		"MAKEFLAGS",
		"MFLAGS",
		"CORECLR_PROFILER_PATH",
		"PHPRC",
		"PHP_INI_SCAN_DIR",
		"DENO_DIR",
		"BUN_CONFIG_REGISTRY",
		"YARN_RC_FILENAME",
		"HTTP_PROXY",
		"HTTPS_PROXY",
		"ALL_PROXY",
		"NO_PROXY",
		"NODE_TLS_REJECT_UNAUTHORIZED",
		"NODE_EXTRA_CA_CERTS",
		"SSL_CERT_FILE",
		"SSL_CERT_DIR",
		"REQUESTS_CA_BUNDLE",
		"CURL_CA_BUNDLE",
		"DOCKER_HOST",
		"DOCKER_TLS_VERIFY",
		"DOCKER_CERT_PATH",
		"PIP_INDEX_URL",
		"PIP_PYPI_URL",
		"PIP_EXTRA_INDEX_URL",
		"PIP_CONFIG_FILE",
		"PIP_FIND_LINKS",
		"PIP_TRUSTED_HOST",
		"UV_INDEX",
		"UV_INDEX_URL",
		"UV_PYTHON",
		"UV_EXTRA_INDEX_URL",
		"UV_DEFAULT_INDEX",
		"DOCKER_CONTEXT",
		"LIBRARY_PATH",
		"LDFLAGS",
		"CPATH",
		"C_INCLUDE_PATH",
		"CPLUS_INCLUDE_PATH",
		"OBJC_INCLUDE_PATH",
		"GOPROXY",
		"GONOSUMCHECK",
		"GONOSUMDB",
		"GONOPROXY",
		"GOPRIVATE",
		"GOENV",
		"GOPATH",
		"HGRCPATH",
		"PYTHONUSERBASE",
		"RUSTC_WRAPPER",
		"RUSTFLAGS",
		"RUSTUP_DIST_ROOT",
		"RUSTUP_DIST_SERVER",
		"RUSTUP_HOME",
		"RUSTUP_TOOLCHAIN",
		"RUSTUP_UPDATE_ROOT",
		"CARGO_HOME",
		"VIRTUAL_ENV",
		"LUA_PATH",
		"LUA_CPATH",
		"GEM_HOME",
		"GEM_PATH",
		"BUNDLE_GEMFILE",
		"COMPOSER_HOME",
		"CONDA_DEFAULT_ENV",
		"CONDA_PREFIX",
		"CARGO_BUILD_RUSTC_WRAPPER",
		"XDG_CACHE_HOME",
		"XDG_CONFIG_DIRS",
		"XDG_CONFIG_HOME",
		"XDG_DATA_DIRS",
		"XDG_DATA_HOME",
		"XDG_RUNTIME_DIR",
		"XDG_STATE_HOME",
		"AWS_CONFIG_FILE",
		"KUBECONFIG",
		"GOOGLE_APPLICATION_CREDENTIALS",
		"AWS_SHARED_CREDENTIALS_FILE",
		"AWS_WEB_IDENTITY_TOKEN_FILE",
		"AZURE_AUTH_LOCATION",
		"HELM_HOME",
		"ANSIBLE_CONFIG",
		"ANSIBLE_LIBRARY",
		"ANSIBLE_CALLBACK_PLUGINS",
		"ANSIBLE_COLLECTIONS_PATH",
		"ANSIBLE_CONNECTION_PLUGINS",
		"ANSIBLE_FILTER_PLUGINS",
		"ANSIBLE_INVENTORY_PLUGINS",
		"ANSIBLE_LOOKUP_PLUGINS",
		"ANSIBLE_MODULE_UTILS",
		"ANSIBLE_REMOTE_TEMP",
		"ANSIBLE_ROLES_PATH",
		"ANSIBLE_STRATEGY_PLUGINS",
		"R_LIBS_USER",
		"TF_CLI_CONFIG_FILE",
		"TF_PLUGIN_CACHE_DIR",
		"AMQP_URL",
		"AWS_ACCESS_KEY_ID",
		"AWS_CONTAINER_CREDENTIALS_FULL_URI",
		"AWS_CONTAINER_CREDENTIALS_RELATIVE_URI",
		"AWS_SECRET_ACCESS_KEY",
		"AWS_SECURITY_TOKEN",
		"AWS_SESSION_TOKEN",
		"AZURE_CLIENT_ID",
		"AZURE_CLIENT_SECRET",
		"DATABASE_URL",
		"GH_TOKEN",
		"GITHUB_TOKEN",
		"GITLAB_TOKEN",
		"MONGODB_URI",
		"NODE_AUTH_TOKEN",
		"NPM_TOKEN",
		"REDIS_URL",
		"SSH_AUTH_SOCK",
		"SYSTEMROOT",
		"WINDIR"
	],
	allowedInheritedOverrideOnlyKeys: [
		"ALL_PROXY",
		"AWS_CONFIG_FILE",
		"AWS_SHARED_CREDENTIALS_FILE",
		"AWS_WEB_IDENTITY_TOKEN_FILE",
		"AZURE_AUTH_LOCATION",
		"CURL_CA_BUNDLE",
		"DOCKER_CERT_PATH",
		"DOCKER_CONTEXT",
		"DOCKER_HOST",
		"DOCKER_TLS_VERIFY",
		"GIT_PAGER",
		"GOOGLE_APPLICATION_CREDENTIALS",
		"GRADLE_USER_HOME",
		"HISTFILE",
		"HOME",
		"HTTPS_PROXY",
		"HTTP_PROXY",
		"KUBECONFIG",
		"MANPAGER",
		"NODE_EXTRA_CA_CERTS",
		"NODE_TLS_REJECT_UNAUTHORIZED",
		"NO_PROXY",
		"PAGER",
		"REQUESTS_CA_BUNDLE",
		"RUSTUP_DIST_ROOT",
		"RUSTUP_DIST_SERVER",
		"RUSTUP_HOME",
		"RUSTUP_TOOLCHAIN",
		"RUSTUP_UPDATE_ROOT",
		"SSH_AUTH_SOCK",
		"SSL_CERT_DIR",
		"SSL_CERT_FILE",
		"SYSTEMROOT",
		"WINDIR",
		"XDG_CACHE_HOME",
		"XDG_CONFIG_DIRS",
		"XDG_CONFIG_HOME",
		"XDG_DATA_DIRS",
		"XDG_DATA_HOME",
		"XDG_RUNTIME_DIR",
		"XDG_STATE_HOME",
		"ZDOTDIR"
	],
	blockedOverridePrefixes: [
		"GIT_CONFIG_",
		"NPM_CONFIG_",
		"CARGO_REGISTRIES_",
		"TF_VAR_"
	],
	blockedPrefixes: [
		"DYLD_",
		"LD_",
		"BASH_FUNC_"
	]
};
//#endregion
//#region src/infra/host-env-security-policy.js
function sortUniqueUppercase(values) {
	return Object.freeze(Array.from(new Set(values.map((value) => value.toUpperCase()))).toSorted((left, right) => left < right ? -1 : left > right ? 1 : 0));
}
function derivePolicyArrays(policy) {
	const blockedEverywhereKeys = policy.blockedEverywhereKeys ?? [];
	const blockedOverrideOnlyKeys = policy.blockedOverrideOnlyKeys ?? [];
	const allowedInheritedOverrideOnlyKeys = policy.allowedInheritedOverrideOnlyKeys ?? [];
	const allowedInheritedOverrideOnlyUpper = new Set(allowedInheritedOverrideOnlyKeys.map((value) => value.toUpperCase()));
	const blockedPrefixes = policy.blockedPrefixes ?? [];
	const blockedOverridePrefixes = policy.blockedOverridePrefixes ?? [];
	const blockedInheritedPrefixes = policy.blockedInheritedPrefixes ?? blockedPrefixes;
	return {
		blockedInheritedKeys: sortUniqueUppercase([...blockedEverywhereKeys, ...blockedOverrideOnlyKeys.filter((value) => !allowedInheritedOverrideOnlyUpper.has(value.toUpperCase()))]),
		blockedInheritedPrefixes: sortUniqueUppercase(blockedInheritedPrefixes),
		blockedKeys: sortUniqueUppercase(blockedEverywhereKeys),
		blockedOverrideKeys: sortUniqueUppercase(blockedOverrideOnlyKeys),
		blockedPrefixes: sortUniqueUppercase(blockedPrefixes),
		blockedOverridePrefixes: sortUniqueUppercase(blockedOverridePrefixes)
	};
}
/**
* Normalizes raw host environment policy JSON into immutable lookup arrays.
*/
function loadHostEnvSecurityPolicy(rawPolicy = host_env_security_policy_default) {
	const derived = derivePolicyArrays(rawPolicy);
	return Object.freeze({
		blockedEverywhereKeys: Object.freeze(rawPolicy.blockedEverywhereKeys ?? []),
		blockedOverrideOnlyKeys: Object.freeze(rawPolicy.blockedOverrideOnlyKeys ?? []),
		allowedInheritedOverrideOnlyKeys: Object.freeze(rawPolicy.allowedInheritedOverrideOnlyKeys ?? []),
		blockedInheritedKeys: derived.blockedInheritedKeys,
		blockedInheritedPrefixes: derived.blockedInheritedPrefixes,
		blockedPrefixes: derived.blockedPrefixes,
		blockedOverridePrefixes: derived.blockedOverridePrefixes,
		blockedKeys: derived.blockedKeys,
		blockedOverrideKeys: derived.blockedOverrideKeys
	});
}
/**
* Process-wide host environment security policy derived from generated JSON.
*/
const HOST_ENV_SECURITY_POLICY = loadHostEnvSecurityPolicy();
new Set(HOST_ENV_SECURITY_POLICY.blockedKeys);
new Set(HOST_ENV_SECURITY_POLICY.blockedInheritedKeys);
new Set(HOST_ENV_SECURITY_POLICY.blockedOverrideKeys);
[...Object.keys(resolveNodeServiceIdentityEnvironment())];
new AsyncLocalStorage();
//#endregion
//#region src/config/config-env-values.ts
function findCaseInsensitiveEnvKey(env, key) {
	if (Object.hasOwn(env, key)) return key;
	const upperKey = key.toUpperCase();
	return Object.keys(env).find((candidate) => candidate.toUpperCase() === upperKey);
}
//#endregion
//#region src/config/config-env-vars.ts
const appliedConfigEnvOwnership = /* @__PURE__ */ new WeakMap();
function resolveAppliedConfigEnvOwnership(env) {
	return {
		...appliedConfigEnvOwnership.get(env),
		...env === process.env ? publishedConfigRuntimeEnvState.ownedEnv : {}
	};
}
new AsyncLocalStorage();
function cloneEnvWithPlatformSemantics(env) {
	let cloned = { ...fsSafeEnvInput(env) };
	if (process.platform === "win32") cloned = new Proxy(cloned, {
		deleteProperty(target, property) {
			if (typeof property !== "string") return Reflect.deleteProperty(target, property);
			const key = findCaseInsensitiveEnvKey(target, property);
			return key ? Reflect.deleteProperty(target, key) : true;
		},
		get(target, property, receiver) {
			if (typeof property !== "string") return Reflect.get(target, property, receiver);
			const key = findCaseInsensitiveEnvKey(target, property);
			return key ? target[key] : Reflect.get(target, property, receiver);
		},
		getOwnPropertyDescriptor(target, property) {
			if (typeof property !== "string") return Reflect.getOwnPropertyDescriptor(target, property);
			const key = findCaseInsensitiveEnvKey(target, property);
			if (!key) return;
			return {
				configurable: true,
				enumerable: true,
				value: target[key],
				writable: true
			};
		},
		has(target, property) {
			return typeof property === "string" ? findCaseInsensitiveEnvKey(target, property) !== void 0 : Reflect.has(target, property);
		},
		set(target, property, value) {
			if (typeof property !== "string") return Reflect.set(target, property, value);
			target[findCaseInsensitiveEnvKey(target, property) ?? property] = value;
			return true;
		}
	});
	appliedConfigEnvOwnership.set(cloned, resolveAppliedConfigEnvOwnership(env));
	normalizeFsSafeNativeEnv(cloned);
	return cloned;
}
let publishedConfigRuntimeEnvState = {
	generation: 0,
	ownedEnv: {},
	sourceConfig: null
};
//#endregion
//#region src/infra/gateway-supervision.ts
const GATEWAY_SUPERVISOR_MODE_ENV = "OPENCLAW_SUPERVISOR_MODE";
function isGatewayExternallySupervised(env = process.env) {
	return env[GATEWAY_SUPERVISOR_MODE_ENV]?.trim().toLowerCase() === "external";
}
//#endregion
//#region src/state/openclaw-state-worker-context.capture.ts
/** Capture read authority without constructing a worker environment. */
function captureOpenClawStateReadContextWithAdmission(pathname, captureAdmission) {
	const schema = captureOpenClawStateSchemaReadAdmission(pathname);
	const capturedAdmission = captureAdmission(pathname);
	const integrity = capturedAdmission.captureIntegrity?.();
	const assertPublicationCurrent = capturedAdmission.assertCurrent;
	let admission = capturedAdmission;
	let runInCapturedSchemaScope;
	if (schema) {
		const inCapturedScope = AsyncLocalStorage.snapshot();
		admission = {
			databasePath: capturedAdmission.databasePath,
			coordinationKey: capturedAdmission.coordinationKey,
			get identity() {
				return capturedAdmission.identity;
			},
			captureIntegrity: capturedAdmission.captureIntegrity,
			assertCurrent() {
				capturedAdmission.assertCurrent();
				schema.assertCurrent();
			}
		};
		runInCapturedSchemaScope = (operation) => inCapturedScope(() => {
			admission.assertCurrent();
			return operation();
		});
	}
	return {
		maintenanceScope: getOpenClawDatabaseMaintenanceScope(),
		admission,
		assertPublicationCurrent,
		existingSchemaPath: schema?.path,
		stateIntegrity: integrity,
		runInCapturedSchemaScope,
		artifactPreservingReads: isArtifactPreservingStateRead("agent", pathname) || void 0
	};
}
/** Read-only workers need resolved runtime facts, not the initialization environment. */
function captureOpenClawStateReadWorkerContextWithAdmission(options, captureAdmission) {
	const source = options.env ?? process.env;
	const env = process.platform === "win32" ? cloneEnvWithPlatformSemantics(source) : source;
	const environment = {
		OPENCLAW_STATE_DIR: resolveStateDir(env),
		...isGatewayExternallySupervised(env) ? { OPENCLAW_SUPERVISOR_MODE: "external" } : {}
	};
	return {
		...captureOpenClawStateReadContextWithAdmission(options.path ?? resolveOpenClawStateSqlitePath(environment), captureAdmission),
		environment
	};
}
/** Capture host facts before asynchronous work, without opening SQLite. */
function captureOpenClawStateWorkerContextWithAdmission(options, captureAdmission) {
	const context = captureOpenClawStateReadWorkerContextWithAdmission(options, captureAdmission);
	return {
		...context,
		initializationEnvironment: mergeProcessEnv([
			options.env ?? process.env,
			{
				OPENCLAW_STATE_DIR: void 0,
				OPENCLAW_SUPERVISOR_MODE: void 0
			},
			context.environment
		]),
		...options.initializationAgentPaths ? { initializationAgentPaths: options.initializationAgentPaths.map((agentPath) => path.resolve(agentPath)) } : {}
	};
}
//#endregion
//#region src/state/openclaw-state-db-cache.wal.ts
/** Bind periodic maintenance and its observations to the cache's exact native owner. */
function createStateDatabaseWalOwner({ cachedDatabases, retainedDatabaseHandles, databaseIdentities, asyncResources }, retainForIdle, requireIdentity) {
	return {
		ownRetirement(database, close) {
			const identity = requireIdentity(database);
			const resource = { async close(selected) {
				if (!selected || selected.key === identity.key) await close();
			} };
			const unregister = asyncResources.register(resource);
			getOpenClawDatabaseMaintenanceResourceScope(database.db)?.own(resource, "shared-references", () => resource.close());
			return unregister;
		},
		async stop(pathname, identity) {
			const databases = /* @__PURE__ */ new Set([...retainedDatabaseHandles.values(), ...cachedDatabases.values()]);
			await Promise.all([...databases].filter((database) => pathname === void 0 || database.path === pathname || identity !== void 0 && databaseIdentities.get(database.db)?.key === identity.key).flatMap(({ walMaintenance }) => walMaintenance ? [walMaintenance.stop()] : []));
		},
		register(database, identity, admission, env) {
			if (!isMainThread || isPostgresSqlConnection(database.db)) return;
			const capturedContext = captureOpenClawStateWorkerContextWithAdmission({
				path: database.path,
				env
			}, () => admission);
			const controller = new AbortController();
			let pending;
			const cancel = () => {
				controller.abort();
				if (!pending) {
					unregister();
					return;
				}
				return pending.then(() => void 0, () => void 0);
			};
			const unregister = asyncResources.register({ async close(selected) {
				if (selected && selected.key !== identity.key) return;
				cancel();
				await database.walMaintenance.stop();
				unregister();
			} });
			const run = async (request) => {
				const maintenanceScope = getOpenClawDatabaseMaintenanceResourceScope(database.db);
				const context = {
					...capturedContext,
					maintenanceScope
				};
				const assertCurrent = () => {
					controller.signal.throwIfAborted();
					context.admission.assertCurrent();
					maintenanceScope?.assertAdmission();
					if (getOpenClawDatabaseMaintenanceResourceScope(database.db) !== maintenanceScope || cachedDatabases.get(database.path) !== database || !database.db.isOpen) throw new StateDatabaseReadAdmissionInvalidatedError("Shared-state WAL maintenance owner changed");
					assertExistingDatabaseIdentity(database.path, identity.key, identity.birthtime);
				};
				let releaseIdle;
				let operationStarted = false;
				try {
					assertCurrent();
					releaseIdle = retainForIdle(database);
					const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-BBAYpy6t.js");
					assertCurrent();
					return await runOpenClawStateWorkerOperation(context, (worker) => worker.execute({
						type: "database.walMaintenance",
						input: request
					}, { signal: controller.signal }), {
						existingOnly: true,
						assertCurrent,
						createAdmission: () => ({
							nativeLocations: [database.path, identity.canonicalPath],
							admission: createSqliteWorkerOperationAdmission((_request, grant) => {
								assertCurrent();
								if (!grant()) throw new StateDatabaseReadAdmissionInvalidatedError("Shared-state WAL maintenance authority expired");
								operationStarted = true;
							})
						})
					});
				} catch (error) {
					if (!operationStarted && (isStateDatabaseReadAdmissionInvalidatedError(error) || controller.signal.aborted && isAbortError(error))) return;
					throw error;
				} finally {
					releaseIdle?.();
				}
			};
			registerSqliteWalWorkerMaintenance(database.db, (operation) => {
				if (controller.signal.aborted) return Promise.resolve(void 0);
				const active = run(operation);
				pending = active;
				return active.finally(() => {
					if (pending === active) pending = void 0;
					if (controller.signal.aborted) unregister();
				});
			}, cancel);
		},
		/** Report the last observation without opening or querying SQLite. */
		readHealth() {
			const database = cachedDatabases.get(path.resolve(resolveOpenClawStateSqlitePath()));
			return database?.db.isOpen ? database.walMaintenance.health : void 0;
		}
	};
}
//#endregion
//#region src/state/openclaw-state-db-handle.ts
const identities = resolveGlobalSingleton(Symbol.for("openclaw.stateNativeIdentities"), () => /* @__PURE__ */ new WeakMap());
/** Physical identity admitted by the native opener, never a later pathname observation. */
function readTrackedStateDatabaseIdentity(database) {
	return identities.get(sqlPublicationAnchor(database));
}
function closeTrackedStateDatabase(database) {
	if (database.isOpen) database.close();
}
/** Finish all native close stages even when a previous stage failed. */
function closeStateDatabaseHandle(database, options) {
	try {
		var _usingCtx$1 = _usingCtx();
		const errors = [];
		if (isPostgresSqlConnection(database.db)) {
			for (const connection of [database.db, database.db.anchor]) {
				if (connection === database.db.anchor && database.db.isOpen) break;
				try {
					if (connection.isOpen) connection.close();
				} catch (error) {
					errors.push(error);
				}
			}
			let cleanupPending = database.db.isOpen || database.db.anchor.isOpen;
			if (!cleanupPending) try {
				database.afterClose?.();
			} catch (error) {
				errors.push(error);
				cleanupPending = true;
			}
			return {
				errors,
				cleanupPending
			};
		}
		const seal = _usingCtx$1.u(prepareSqliteDatabaseCleanClose(database.db));
		const delegated = isSqliteWalWorkerMaintained(database.db);
		const priorCheckpointError = database.walMaintenance?.health?.state === "error";
		let checkpointed = false;
		try {
			checkpointed = database.walMaintenance?.close(options) === true && options?.checkpointMode !== "PASSIVE";
		} catch (error) {
			errors.push(error);
		}
		try {
			clearNodeSqliteKyselyCacheForDatabase(database.db);
		} catch (error) {
			errors.push(error);
		}
		try {
			closeTrackedStateDatabase(database.db);
		} catch (error) {
			errors.push(error);
		}
		let cleanupPending = false;
		if (!database.db.isOpen) try {
			database.afterClose?.();
		} catch (error) {
			errors.push(error);
			cleanupPending = true;
		}
		if (errors.length === 0 && !cleanupPending && options?.checkpointMode !== "PASSIVE" && (checkpointed || delegated && !priorCheckpointError)) seal.publish();
		return {
			errors,
			cleanupPending
		};
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
}
//#endregion
//#region src/state/openclaw-state-db-integrity-admission.ts
const bindings = resolveGlobalSingleton(Symbol.for("openclaw.stateIntegrityBindings"), () => /* @__PURE__ */ new WeakMap());
function invalidate(revision) {
	let previous = Atomics.load(revision, 0);
	while (previous >= 0n) {
		const observed = Atomics.compareExchange(revision, 0, previous, previous + 1n);
		if (observed === previous) return;
		previous = observed;
	}
}
/** Corruption observed in an isolate revokes the exact host proof borrowed by its native handle. */
function invalidateOpenClawStateRuntimeIntegrity(database) {
	revokeSqliteDatabaseAdmissions(database);
	const bound = bindings.get(database);
	if (bound) {
		invalidate(new BigInt64Array(bound.revision));
		invalidate(new BigInt64Array(bound.lifetimeRevision));
	}
}
//#endregion
//#region src/state/openclaw-state-db-snapshot-owner.ts
function createOpenClawStateSnapshotOwnerRegistry() {
	const releases = /* @__PURE__ */ new WeakMap();
	return {
		register(database, getCurrent) {
			if (isPostgresSqlConnection(database.db)) return;
			releases.set(database.db, registerLiveSqliteSnapshotOwner({
				database: database.db,
				databasePath: database.path,
				owner: "openclaw-state",
				assertCurrent: () => {
					if (getCurrent() !== database || !database.db.isOpen) throw new Error("OpenClaw state snapshot owner is no longer current");
				}
			}));
		},
		release(database) {
			if (isPostgresSqlConnection(database)) return;
			releases.get(database)?.();
			releases.delete(database);
		}
	};
}
const openClawStateSnapshotOwners = resolveGlobalSingleton(Symbol.for("openclaw.stateSnapshotOwners"), createOpenClawStateSnapshotOwnerRegistry);
//#endregion
//#region src/state/openclaw-state-db-cache.ts
var openclaw_state_db_cache_exports = /* @__PURE__ */ __exportAll({
	assertPublishedOpenClawStateDatabaseLifecycle: () => assertPublishedOpenClawStateDatabaseLifecycle,
	captureOpenClawStateDatabaseReadAdmission: () => captureOpenClawStateDatabaseReadAdmission,
	clearOpenClawStateDatabaseOpenFailure: () => clearOpenClawStateDatabaseOpenFailure,
	closeOpenClawStateDatabase: () => closeOpenClawStateDatabase,
	closeOpenClawStateDatabaseAsync: () => closeOpenClawStateDatabaseAsync,
	closeOpenClawStateDatabaseByPath: () => closeOpenClawStateDatabaseByPath,
	closeOpenClawStateDatabaseForTest: () => closeOpenClawStateDatabaseForTest,
	getOpenClawStateDatabaseTerminalFailureAsync: () => getOpenClawStateDatabaseTerminalFailureAsync,
	isOpenClawStateDatabaseOpen: () => isOpenClawStateDatabaseOpen,
	openClawStateDatabaseCache: () => openClawStateDatabaseCache,
	publishOpenClawStateDatabaseWorkerAdmission: () => publishOpenClawStateDatabaseWorkerAdmission,
	recordOpenClawStateDatabaseOpenFailure: () => recordOpenClawStateDatabaseOpenFailure,
	registerOpenClawStateDatabaseAsyncResource: () => registerOpenClawStateDatabaseAsyncResource,
	registerOpenClawStateDatabaseLifecycleListener: () => registerOpenClawStateDatabaseLifecycleListener,
	requireOpenClawStateDatabaseIdentity: () => requireOpenClawStateDatabaseIdentity,
	retainOpenClawStateDatabaseForIdle: () => retainOpenClawStateDatabaseForIdle
});
const STATE_DATABASE_LIFECYCLE_KEY = Symbol.for("openclaw.stateDatabaseLifecycle");
const stateDatabaseLifecycle = resolveGlobalSingleton(STATE_DATABASE_LIFECYCLE_KEY, () => ({
	cachedDatabases: /* @__PURE__ */ new Map(),
	retainedDatabaseHandles: /* @__PURE__ */ new Map(),
	idleTimers: /* @__PURE__ */ new WeakMap(),
	idleReferences: /* @__PURE__ */ new WeakMap(),
	unregisterRetainedExitClose: void 0,
	databaseIdentities: /* @__PURE__ */ new WeakMap(),
	borrowers: /* @__PURE__ */ new WeakMap(),
	databaseLifecycleListeners: /* @__PURE__ */ new Set(),
	terminalOpenLatch: createSqliteTerminalOpenLatch({ closeByPath: (pathname, error) => cacheAdmission.closeTerminalFailure(pathname, error) }),
	asyncResources: createOpenClawStateDatabaseAsyncLifecycle()
}), () => closeOpenClawStateDatabaseAsync(), "shared-state");
const { cachedDatabases, retainedDatabaseHandles, idleTimers, idleReferences, databaseIdentities, borrowers, databaseLifecycleListeners, terminalOpenLatch, asyncResources } = stateDatabaseLifecycle;
const { touch: touchStateDatabase, retain: retainOpenClawStateDatabaseForIdle } = createStateDatabaseIdleRetirement(stateDatabaseLifecycle, retireOpenClawStateDatabaseHandle);
const { register: registerStateDatabaseWalAdmission, readHealth: readOpenClawStateWalHealth, ownRetirement: ownStateDatabaseRetirement, stop: stopOpenClawStateDatabaseMaintenance } = createStateDatabaseWalOwner(stateDatabaseLifecycle, retainOpenClawStateDatabaseForIdle, requireOpenClawStateDatabaseIdentity);
function notifyOpenClawStateDatabaseLifecycle(event) {
	const notification = event.kind === "open-error" ? {
		...event,
		identity: event.identity ?? asyncResources.knownIdentity(event.path)
	} : event;
	for (const listener of databaseLifecycleListeners) listener(notification);
}
function notifyOpenClawStateDatabaseClosed(database) {
	notifyOpenClawStateDatabaseLifecycle({
		kind: "closed",
		path: database.path,
		identity: requireOpenClawStateDatabaseIdentity(database)
	});
}
function requireOpenClawStateDatabaseIdentity(database) {
	const identity = databaseIdentities.get(database.db);
	if (!identity) throw new Error("Published shared-state owner has no recorded database identity");
	return identity;
}
const cacheAdmission = createStateDatabaseCacheAdmission({
	cachedDatabases,
	evict: evictCachedOpenClawStateDatabase,
	invalidate: (pathname) => asyncResources.invalidate(pathname),
	notifyTerminalFailure: (pathname, error) => notifyOpenClawStateDatabaseLifecycle({
		kind: "terminal-failure",
		path: pathname,
		error,
		identity: asyncResources.knownIdentity(pathname)
	}),
	recordSchemaFailure: (pathname, error) => {
		terminalOpenLatch.record(pathname, error);
		notifyOpenClawStateDatabaseLifecycle({
			kind: "open-error",
			path: pathname,
			error
		});
	}
});
function registerOpenClawStateDatabaseLifecycleListener(listener) {
	databaseLifecycleListeners.add(listener);
	for (const database of cachedDatabases.values()) if (database.db.isOpen) listener({
		kind: "opened",
		database,
		identity: requireOpenClawStateDatabaseIdentity(database)
	});
	return () => databaseLifecycleListeners.delete(listener);
}
function retainStateDatabaseClose(database) {
	retainedDatabaseHandles.set(database.db, database);
	stateDatabaseLifecycle.unregisterRetainedExitClose ??= registerSqliteCacheExitClose(closeOpenClawStateDatabase);
}
function ownMaintenanceStateDatabaseHandle(database) {
	getOpenClawDatabaseMaintenanceScope()?.own(database.db, "shared-handles", async () => {
		const closingScope = getOpenClawDatabaseMaintenanceScope();
		if (!closingScope || !isOpenClawDatabaseMaintenanceResourceOwned(database.db, closingScope)) return;
		if (cachedDatabases.get(database.path) === database || retainedDatabaseHandles.get(database.db) === database) {
			await database.walMaintenance?.stop();
			if (isOpenClawDatabaseMaintenanceResourceOwned(database.db, closingScope) && (cachedDatabases.get(database.path) === database || retainedDatabaseHandles.get(database.db) === database)) retireOpenClawStateDatabaseHandle(database, false);
		}
	});
}
function closeUnpublishedOpenClawStateDatabaseHandle(database) {
	const errors = closeOpenClawStateDatabaseHandle(database);
	if (retainedDatabaseHandles.get(database.db) === database) ownMaintenanceStateDatabaseHandle(database);
	return errors;
}
/** Retain one exact canonical native owner; only the final reference retires its handle. */
const { retain: retainOpenClawStateDatabase, borrowForRead: borrowOpenClawStateDatabaseForAsyncRead, retainForIndependentRead: retainOpenClawStateDatabaseForIndependentRead } = createStateDatabaseRetainer(stateDatabaseLifecycle, {
	assertOpen(pathname, ownership) {
		assertOpenClawStateDatabaseOpenAllowed(pathname, ownership);
		assertExistingOpenClawStateSchemaCacheAdmission(pathname, stateDatabaseLifecycle);
	},
	capture: (pathname) => asyncResources.capture(pathname),
	retire: retireOpenClawStateDatabaseHandle,
	retainFailed: retainStateDatabaseClose,
	ownRetirement: ownStateDatabaseRetirement,
	touch: touchStateDatabase
});
/** Close both physical-handle owners while retaining every cleanup failure. */
function closeOpenClawStateDatabaseHandle(database, options) {
	clearTimeout(idleTimers.get(database.db));
	idleTimers.delete(database.db);
	try {
		assertStateDatabaseBorrowersReleased(borrowers.get(database.db), database.path);
	} catch (error) {
		const owner = borrowers.get(database.db);
		if (owner) {
			owner.retiring = true;
			owner.retirement = {
				ordinary: true,
				isCurrent: () => true,
				retire: () => {
					throwSqliteLifecycleErrors(closeOpenClawStateDatabaseHandle(database, options), `OpenClaw state database cleanup failed for ${database.path}.`);
					owner.cleanupComplete = true;
					borrowers.delete(database.db);
				}
			};
		}
		retainStateDatabaseClose(database);
		return [error];
	}
	idleReferences.delete(database.db);
	openClawStateSnapshotOwners.release(database.db);
	const { errors, cleanupPending } = closeStateDatabaseHandle(database, options);
	if (database.db.isOpen || cleanupPending) retainStateDatabaseClose(database);
	else retainedDatabaseHandles.delete(database.db);
	if (cachedDatabases.get(database.path)?.db === database.db) cachedDatabases.delete(database.path);
	if (retainedDatabaseHandles.size === 0) {
		stateDatabaseLifecycle.unregisterRetainedExitClose?.();
		stateDatabaseLifecycle.unregisterRetainedExitClose = void 0;
	}
	return errors;
}
function evictCachedOpenClawStateDatabase(database) {
	if (!isPostgresSqlConnection(database.db)) invalidateOpenClawStateRuntimeIntegrity(database.db);
	if (cachedDatabases.get(database.path) !== database) return false;
	asyncResources.invalidate(database.path);
	cachedDatabases.delete(database.path);
	notifyOpenClawStateDatabaseClosed(database);
	closeOpenClawStateDatabaseHandle(database, { checkpointMode: "PASSIVE" });
	return true;
}
/** Evict an exact cached shared-state owner after a proven corruption read. */
function evictOpenClawStateDatabaseAfterCorruption(database, error) {
	return isSqliteCorruptionError(error) && evictCachedOpenClawStateDatabase(database);
}
/** Publish a fully opened handle and bind query corruption to its exact cache owner. */
function publishOpenClawStateDatabase(database, env) {
	const { db, path: pathname } = database;
	const schemaFacts = cacheAdmission.initialize(database);
	const { identity, admission } = asyncResources.publish(pathname);
	databaseIdentities.set(db, readTrackedStateDatabaseIdentity(db) ?? identity);
	cachedDatabases.set(pathname, Object.assign(database, { schemaFacts }));
	registerStateDatabaseWalAdmission(database, identity, admission, env);
	touchStateDatabase(database);
	openClawStateSnapshotOwners.register(database, () => cachedDatabases.get(pathname));
	ownMaintenanceStateDatabaseHandle(database);
	notifyOpenClawStateDatabaseLifecycle({
		kind: "opened",
		database,
		identity
	});
	if (!isPostgresSqlConnection(db)) registerNodeSqliteKyselyQueryErrorHandler(db, (error) => {
		if (!db.isTransaction && isSqliteCorruptionError(error)) evictCachedOpenClawStateDatabase(database);
	});
	terminalOpenLatch.clear(pathname);
	return database;
}
function getCachedOpenClawStateDatabase(pathname, options) {
	return withCachedOpenClawStateDatabase(pathname, options, (database) => database);
}
/** Keep the admitted revision live while a synchronous reader consumes its row facts. */
function withCachedOpenClawStateDatabase(pathname, options, operation) {
	const resolvedPath = resolveDatabasePath({ path: pathname });
	const maintenance = getOpenClawDatabaseMaintenanceScope();
	if (options?.readOnly) maintenance?.assertReadAdmission();
	else maintenance?.assertAdmission();
	assertExistingOpenClawStateSchemaCacheAdmission(resolvedPath, stateDatabaseLifecycle);
	const runtimeFailure = terminalOpenLatch.get(resolvedPath);
	if (runtimeFailure) throw runtimeFailure;
	return cacheAdmission.read(resolvedPath, (database) => {
		if (borrowers.get(database.db)?.retiring) throw new Error(`OpenClaw state database native borrower cleanup is pending: ${pathname}`);
		touchStateDatabase(database);
		return operation(database);
	});
}
function getOpenClawStateDatabaseIfOpenAtPath(pathname) {
	const cached = getCachedOpenClawStateDatabase(pathname);
	observeOpenClawDatabaseMaintenanceResource(cached?.db.isOpen ? cached.db : void 0);
	return cached?.db.isOpen ? cached : void 0;
}
/** Remove a closed cached owner while fresh-open access is held. */
function closeStaleCachedOpenClawStateDatabase(database) {
	if (cachedDatabases.get(database.path) !== database) return;
	asyncResources.invalidate(database.path);
	const errors = closeOpenClawStateDatabaseHandle(database);
	notifyOpenClawStateDatabaseClosed(database);
	throwSqliteLifecycleErrors(errors, `Stale OpenClaw state database cleanup failed for ${database.path}.`);
}
/** Latch background verification damage so later opens fail without rescanning. */
function recordOpenClawStateDatabaseOpenFailure(pathname, error, generation) {
	return terminalOpenLatch.record(resolveDatabasePath({ path: pathname }), error, generation);
}
/** Clear a terminal open failure after doctor rewrites the database file. */
function clearOpenClawStateDatabaseOpenFailure(pathname) {
	const resolvedPath = resolveDatabasePath({ path: pathname });
	terminalOpenLatch.clear(resolvedPath);
	asyncResources.invalidate(resolvedPath);
	notifyOpenClawStateDatabaseLifecycle({
		kind: "failure-cleared",
		path: resolvedPath,
		identity: asyncResources.knownIdentity(resolvedPath)
	});
}
/** Validate the canonical terminal fact before acquiring a domain-operation lease. */
async function getOpenClawStateDatabaseTerminalFailureAsync(context, signal) {
	context.admission.assertCurrent();
	const failure = await terminalOpenLatch.getAsync(context.admission.databasePath, async (pathname, generation) => {
		signal?.throwIfAborted();
		context.admission.assertCurrent();
		const current = await readSqliteFileGeneration(pathname, signal);
		signal?.throwIfAborted();
		context.admission.assertCurrent();
		return sameSqliteFileGeneration(generation, current);
	});
	context.admission.assertCurrent();
	return failure;
}
/** Reject shared-state access after a process-local terminal failure. */
function assertOpenClawStateDatabaseOpenAllowed(pathname, ownership) {
	const resolvedPath = resolveDatabasePath({ path: pathname });
	(ownership === "cached-read" ? assertStateDatabaseReadAllowed : assertStateDatabaseAccessAllowed)(pathname);
	const { identity } = asyncResources.capture(resolvedPath);
	const terminalFailure = terminalOpenLatch.get(resolvedPath);
	if (terminalFailure) throw terminalFailure;
	for (const database of retainedDatabaseHandles.values()) if (borrowers.get(database.db)?.retiring && (database.path === resolvedPath || databaseIdentities.get(database.db)?.key === identity.key)) throw new Error(`OpenClaw state database native borrower cleanup is pending: ${pathname}`);
}
function recordOpenClawStateDatabaseLifecycleOpenError(pathname, error) {
	notifyOpenClawStateDatabaseLifecycle({
		kind: "open-error",
		path: resolveDatabasePath({ path: pathname }),
		error
	});
}
/** Reject a fresh shared-state open after known corruption until repair clears it. */
function assertOpenClawStateDatabaseFreshOpenAllowedAtPath(pathname, env, onNativeCleanupFailure) {
	assertOpenClawStateDatabaseOpenAllowed(pathname);
	let quarantineFailure;
	try {
		quarantineFailure = readOpenClawDatabaseQuarantineFailure("state", pathname, { env });
	} catch (error) {
		if (!(error instanceof OpenClawQuarantineReadCleanupError)) throw error;
		onNativeCleanupFailure?.(error);
		return;
	}
	if (quarantineFailure?.cause instanceof OpenClawQuarantineReadCleanupError) onNativeCleanupFailure?.(quarantineFailure.cause);
	if (quarantineFailure) {
		cacheAdmission.closeTerminalFailure(pathname, quarantineFailure);
		throw quarantineFailure;
	}
}
/** SQLite owns checkpoint exclusion; retirement joins the actual native handle. */
function retireOpenClawStateDatabaseHandle(database, retireAdmission = true, options) {
	assertStateDatabaseBorrowersReleased(borrowers.get(database.db), database.path);
	const borrowedOwner = borrowers.get(database.db);
	try {
		const wasCached = cachedDatabases.get(database.path)?.db === database.db;
		if (retireAdmission) asyncResources.invalidate(database.path);
		const errors = closeOpenClawStateDatabaseHandle(database, options);
		if (wasCached && retireAdmission) try {
			notifyOpenClawStateDatabaseClosed(database);
		} catch (error) {
			errors.push(error);
		}
		throwSqliteLifecycleErrors(errors, `OpenClaw state database cleanup failed for ${database.path}.`);
	} catch (error) {
		if (borrowedOwner) retainStateDatabaseClose(database);
		throw error;
	}
	if (borrowedOwner) {
		borrowedOwner.cleanupComplete = true;
		borrowers.delete(database.db);
	}
}
/** Close cached and disposal-only handles, preserving independent cleanup failures. */
function retireOpenClawStateDatabaseHandles(pathname, options, identity) {
	const databases = /* @__PURE__ */ new Set([...retainedDatabaseHandles.values(), ...cachedDatabases.values()]);
	const errors = [];
	let found = false;
	for (const database of databases) {
		if (pathname !== void 0 && database.path !== pathname && (identity === void 0 || databaseIdentities.get(database.db)?.key !== identity.key)) continue;
		found = true;
		try {
			retireOpenClawStateDatabaseHandle(database, true, options);
		} catch (error) {
			errors.push(error);
		}
	}
	throwSqliteLifecycleErrors(errors, "OpenClaw state database cleanup failed.");
	return found;
}
function closeOpenClawStateDatabaseByPath(pathname, options) {
	return retireOpenClawStateDatabaseHandles(resolveDatabasePath({ path: pathname }), options, asyncResources.identity(pathname));
}
function closeOpenClawStateDatabase(options) {
	retireOpenClawStateDatabaseHandles(void 0, options);
}
/** Register a resource owner before it can admit any shared-state worker opens. */
const registerOpenClawStateDatabaseAsyncResource = asyncResources.register;
/** Capture the canonical read generation before any asynchronous worker admission. */
const captureOpenClawStateDatabaseReadAdmission = asyncResources.capture;
asyncResources.integrity;
/** Bind worker-created storage to its captured admission without publishing a native handle. */
function publishOpenClawStateDatabaseWorkerAdmission(admission) {
	asyncResources.publish(admission.databasePath);
	admission.assertCurrent();
}
/** Orderly lifecycle close; synchronous close remains native/exit cleanup only. */
async function closeOpenClawStateDatabaseAsync(options) {
	await asyncResources.close(void 0, async () => {
		await stopOpenClawStateDatabaseMaintenance();
		return retireOpenClawStateDatabaseHandles(void 0, options);
	});
}
function isOpenClawStateDatabaseOpen(pathname) {
	if (pathname !== void 0) return cachedDatabases.get(resolveDatabasePath({ path: pathname }))?.db.isOpen === true;
	return Array.from(cachedDatabases.values()).some((database) => database.db.isOpen);
}
/**
* Close shared state handles and clear terminal failure latches for test isolation.
* Worker retirement continues after return; await closeOpenClawStateDatabaseAsync()
* before raw SQLite or file access to a database that workers have used.
*/
function closeOpenClawStateDatabaseForTest() {
	closeOpenClawStateDatabase();
	terminalOpenLatch.clearAll();
}
/**
* Owners that register with this cache must serve only the published lifecycle.
* Every runtime chunk shares that lifecycle; only a retired module generation
* (a re-evaluated test graph whose detached work outlived its file) can differ.
*/
function assertPublishedOpenClawStateDatabaseLifecycle() {
	if (readGlobalSingleton(STATE_DATABASE_LIFECYCLE_KEY) !== stateDatabaseLifecycle) throw new Error("OpenClaw state database lifecycle is retired; its owners cannot serve the published lifecycle");
}
/** Process-wide owner for cached shared-state handles and terminal open failures. */
const openClawStateDatabaseCache = {
	assertOpenClawStateDatabaseFreshOpenAllowedAtPath,
	assertOpenClawStateDatabaseOpenAllowed,
	clearOpenClawStateDatabaseOpenFailure,
	closeOpenClawStateDatabase,
	closeOpenClawStateDatabaseByPath,
	closeOpenClawStateDatabaseForTest,
	closeOpenClawStateDatabaseHandle,
	closeUnpublishedOpenClawStateDatabaseHandle,
	closeStaleCachedOpenClawStateDatabase,
	evictCachedOpenClawStateDatabase,
	evictOpenClawStateDatabaseAfterCorruption,
	getCachedOpenClawStateDatabase,
	peekOpenClawStateDatabaseConnection: (pathname) => cachedDatabases.get(resolveDatabasePath({ path: pathname }))?.db,
	withCachedOpenClawStateDatabase,
	getOpenClawStateDatabaseRecordedFailure: terminalOpenLatch.peek,
	getOpenClawStateDatabaseIfOpenAtPath,
	getKnownOpenClawStateDatabaseIdentity: asyncResources.knownIdentity,
	isOpenClawStateDatabaseOpen,
	/** Only the exact published, open owner carries canonical schema readiness. */
	isOpenClawStateDatabaseSchemaReady: (database) => cachedDatabases.get(database.path) === database && database.db.isOpen,
	publishOpenClawStateDatabase,
	recordOpenClawStateDatabaseOpenFailure,
	recordOpenClawStateDatabaseLifecycleOpenError,
	touchStateDatabase
};
//#endregion
export { createDeferredCore as $, runWithMainThreadTask as A, getOpenClawDatabaseMaintenanceScope as B, resolveSqliteBrokerWorkerCount as C, captureStateDatabaseAccess as D, acquireStateDatabaseSchemaLease as E, createSqliteWorkerTransferOwner as F, resolveNodeCompileCacheEnv as G, INCOGNITO_AGENT_SQLITE_BASENAME as H, createSqliteWorkerTransferReceiver as I, captureSqliteDatabaseAdmissions as J, installSqliteNativeRuntimeAdmission as K, StateDatabaseReadAdmissionInvalidatedError as L, findOpenClawStateDatabaseFailure as M, classifyWorkerRequest as N, StateDatabaseAdmissionPendingError as O, trackWorkerRequest as P, throwSqliteLifecycleErrors as Q, isStateDatabaseReadAdmissionInvalidatedError as R, retainSqliteWorkerErrorCode as S, retainOpenClawStateWorkerErrorPayload as T, captureRuntimeWorkerSource as U, resolveQuarantineStorePath as V, resolveRuntimeProcessEntrypointUrl as W, trackSqliteDatabaseAdmissionWorker as X, hasSqliteDatabaseSchemaAdmissionForPath as Y, createSqliteLifecycleAggregateError as Z, SqliteWorkerSlotCustody as _, openclaw_state_db_cache_exports as a, captureSqliteWorkerClosePolicy as at, SqliteWorkerAdmissionTimeoutError as b, registerOpenClawStateDatabaseAsyncResource as c, retainSqliteWriteAdmissionService as d, runInDetachedAsyncContext as et, getExistingOpenClawStateSchemaPath as f, readSqliteWorkerExecutionAuthority as g, createSqliteWorkerOperationAdmission as h, openClawStateDatabaseCache as i, readDatabasePathIdentity as it, OPENCLAW_SQLITE_BUSY_TIMEOUT_MS as j, createCpuTrackedWorker as k, registerOpenClawStateDatabaseLifecycleListener as l, runQueuedStoreWrite as m, captureOpenClawStateDatabaseReadAdmission as n, assertExistingDatabaseIdentity as nt, publishOpenClawStateDatabaseWorkerAdmission as o, ensureSqliteLibrarySelected as ot, isExistingOpenClawStateSchema as p, canShareSqliteDatabaseAdmissions as q, getOpenClawStateDatabaseTerminalFailureAsync as r, inspectDatabasePathIdentitySync as rt, recordOpenClawStateDatabaseOpenFailure as s, assertPublishedOpenClawStateDatabaseLifecycle as t, createSqliteDatabaseAdmissionCursor as tt, SQLITE_IDLE_HANDLE_TTL_MS as u, readSqliteWorkerRequestCustody as v, hydrateOpenClawStateWorkerError as w, SqliteWorkerError as x, SQLITE_WORKER_MAX_MESSAGE_BYTES as y, captureOpenClawDatabaseMaintenanceResource as z };
