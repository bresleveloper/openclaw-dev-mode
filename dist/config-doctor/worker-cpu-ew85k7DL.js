import { t as createSubsystemLogger } from "./subsystem-CxjajkOx.js";
import { c as isRecord } from "./string-coerce-Dyy0qgLy.js";
import { g as resolveGlobalSingleton } from "./runtime-doctor-migrations-8XPPImoy.js";
import { g as hasErrnoCode, m as sliceUtf16Safe } from "./redact-V5IywZh1.js";
import "./src-CkqqhWE1.js";
import { n as coerceErrorMessage } from "./errors-Dp0Hj51M.js";
import { l as expectDefined } from "./types.secrets-CBNculTH.js";
import { s as resolveTimerTimeoutMs } from "./number-coercion-fuMteyiI.js";
import "./utils-CROxhhxU.js";
import { $t as removeTempDirectory, Ct as SqliteSchemaVersionError, Et as StartupMaintenanceRequiredError, Ft as SqliteCoordinatorError, Gt as normalizeSqliteNonNegativeInteger, It as createSqliteLifecycleAggregateError, Lt as runWithSqliteCoordinator, Qt as adoptPreparedLocation, Y as createSqliteSnapshotStagingDirectorySync, Zt as SqliteSnapshotCleanupError, ct as OpenClawStateDatabaseSchemaMigrationRequiredError, en as isSqliteLockError, ft as hasStateDatabaseSourceExclusion, in as resolveExistingSqliteFileUri, it as tableExists, lt as normalizeOpenClawStateSchemaReadError, nn as withSqliteNativeOpen, q as prepareSqliteReadOnlyLocationSyncInProcess, rn as openNodeSqliteDatabase, st as isGatewayExternallySupervised, tn as markSqliteNativeOpenFailure, ut as acquireStateDatabaseCoordinator, xt as StateDatabaseCoordinatorContentionError, yt as sha256FileSync } from "./openclaw-state-db-cache-DbUvW0cs.js";
import { toUSVString } from "node:util";
import path, { basename } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { AsyncLocalStorage } from "node:async_hooks";
import fs, { existsSync } from "node:fs";
import "node:crypto";
import { Worker } from "node:worker_threads";
import { spawnSync } from "node:child_process";
import { readRootJsonObjectSync } from "@openclaw/fs-safe/json";
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
//#region src/infra/runtime-process-entrypoints.ts
const currentModuleUrl = import.meta.url;
const SQLITE_READONLY_CHILD_ARG = "--openclaw-sqlite-readonly-child";
const runtimeProcessEntrypoints = {
	codeModeNode: {
		currentModuleUrl,
		sourceWorkerName: "../agents/code-mode-node.worker",
		distWorkerPath: "agents/code-mode-node.worker.js"
	},
	cronReadOnly: {
		currentModuleUrl,
		sourceWorkerName: "../cron/store/read-only.worker",
		distWorkerPath: "cron/store/read-only.worker.js"
	},
	stateRead: {
		currentModuleUrl,
		sourceWorkerName: "../state/openclaw-state-read.worker",
		distWorkerPath: "state/openclaw-state-read.worker.js"
	},
	spawnBroker: {
		currentModuleUrl,
		sourceWorkerName: "../process/spawn-broker/worker",
		distWorkerPath: "process/spawn-broker/worker.js"
	},
	cronStreamMatcher: {
		currentModuleUrl,
		sourceWorkerName: "../gateway/cron-stream-matcher.worker",
		distWorkerPath: "gateway/cron-stream-matcher.worker.js"
	},
	nativeHookRelayClient: {
		currentModuleUrl,
		sourceWorkerName: "../agents/harness/native-hook-relay-client.worker",
		distWorkerPath: "agents/harness/native-hook-relay-client.worker.js"
	},
	computerHost: {
		currentModuleUrl,
		sourceWorkerName: "../gateway/desktop/computer.worker",
		distWorkerPath: "gateway/desktop/computer.worker.js"
	},
	imageProcessor: {
		currentModuleUrl,
		sourceWorkerName: "../media/image-processor.worker",
		distWorkerPath: "media/image-processor.worker.js"
	},
	gitOperations: {
		currentModuleUrl,
		sourceWorkerName: "git-operation.worker",
		distWorkerPath: "infra/git-operation.worker.js"
	},
	fsSafeCopy: {
		currentModuleUrl,
		sourceWorkerName: "fs-safe-copy.worker",
		distWorkerPath: "infra/fs-safe-copy.worker.js"
	},
	sharedStateStore: {
		currentModuleUrl,
		sourceWorkerName: "../state/openclaw-state.worker",
		distWorkerPath: "state/openclaw-state.worker.js"
	},
	authProfileInlineUsage: {
		currentModuleUrl,
		sourceWorkerName: "../agents/auth-profiles/inline-usage.worker",
		distWorkerPath: "agents/auth-profiles/inline-usage.worker.js"
	},
	agentDatabaseExecution: {
		currentModuleUrl,
		sourceWorkerName: "../state/openclaw-agent-execution.worker",
		distWorkerPath: "state/openclaw-agent-execution.worker.js"
	},
	workspaceMemory: {
		currentModuleUrl,
		sourceWorkerName: "../worker/memory-worker-entry",
		distWorkerPath: "worker/memory-worker-entry.js"
	},
	workspaceSkills: {
		currentModuleUrl,
		sourceWorkerName: "../worker/skills-worker-entry",
		distWorkerPath: "worker/skills-worker-entry.js"
	},
	boardStore: {
		currentModuleUrl,
		sourceWorkerName: "../boards/sqlite-board-store.worker",
		distWorkerPath: "boards/sqlite-board-store.worker.js"
	},
	sessionSharingStore: {
		currentModuleUrl,
		sourceWorkerName: "../config/sessions/session-sharing-store.worker",
		distWorkerPath: "config/sessions/session-sharing-store.worker.js"
	},
	heartbeatOutcomeStore: {
		currentModuleUrl,
		sourceWorkerName: "heartbeat-outcome-store.worker",
		distWorkerPath: "infra/heartbeat-outcome-store.worker.js"
	},
	sqliteStore: {
		currentModuleUrl,
		sourceWorkerName: "sqlite-store.worker",
		distWorkerPath: "infra/sqlite-store.worker.js"
	},
	agentSchemaInspection: {
		currentModuleUrl,
		sourceWorkerName: "../state/openclaw-agent-schema-inspection.worker",
		distWorkerPath: "state/openclaw-agent-schema-inspection.worker.js"
	},
	stateMigrationSnapshot: {
		currentModuleUrl,
		sourceWorkerName: "state-migrations.snapshot.worker",
		distWorkerPath: "infra/state-migrations.snapshot.worker.js"
	},
	githubExec: {
		currentModuleUrl,
		sourceWorkerName: "../agents/github-exec-launcher",
		distWorkerPath: "agents/github-exec-launcher.js"
	},
	sqliteReadOnly: {
		currentModuleUrl,
		sourceWorkerName: "sqlite-readonly-location.worker",
		distWorkerPath: "infra/sqlite-readonly-location.worker.js"
	},
	sqliteIntegrity: {
		currentModuleUrl,
		sourceWorkerName: "sqlite-integrity.worker",
		distWorkerPath: "infra/sqlite-integrity.worker.js"
	},
	preparedModelCatalog: {
		currentModuleUrl,
		sourceWorkerName: "../agents/prepared-model-catalog.worker",
		distWorkerPath: "agents/prepared-model-catalog.worker.js"
	},
	updateRepair: {
		currentModuleUrl,
		sourceWorkerName: "update-repair.worker",
		distWorkerPath: "infra/update-repair.worker.js"
	},
	updateMigratedFinalize: {
		currentModuleUrl,
		sourceWorkerName: "update-migrated-finalize.worker",
		distWorkerPath: "infra/update-migrated-finalize.worker.js"
	},
	updateCandidateState: {
		currentModuleUrl,
		sourceWorkerName: "update-candidate-state.worker",
		distWorkerPath: "infra/update-candidate-state.worker.js"
	},
	doctorLint: {
		currentModuleUrl,
		sourceWorkerName: "../commands/doctor-lint.worker",
		distWorkerPath: "commands/doctor-lint.worker.js"
	},
	databaseVerify: {
		currentModuleUrl,
		sourceWorkerName: "../state/openclaw-database-verify.worker",
		distWorkerPath: "state/openclaw-database-verify.worker.js"
	},
	stateLeaseHeartbeat: {
		currentModuleUrl,
		sourceWorkerName: "../state/openclaw-state-lease-heartbeat.worker",
		distWorkerPath: "state/openclaw-state-lease-heartbeat.worker.js"
	},
	sessionTranscriptArchive: {
		currentModuleUrl,
		sourceWorkerName: "../config/sessions/session-accessor.sqlite-archive.worker",
		distWorkerPath: "config/sessions/session-accessor.sqlite-archive.worker.js"
	},
	sessionTranscript: {
		currentModuleUrl,
		sourceWorkerName: "../config/sessions/session-transcript.worker",
		distWorkerPath: "config/sessions/session-transcript.worker.js"
	},
	sessionManagerMetadata: {
		currentModuleUrl,
		sourceWorkerName: "../agents/sessions/session-manager-metadata.worker",
		distWorkerPath: "agents/sessions/session-manager-metadata.worker.js"
	},
	sessionTranscriptReconcile: {
		currentModuleUrl,
		sourceWorkerName: "../config/sessions/session-transcript-reconcile.worker",
		distWorkerPath: "config/sessions/session-transcript-reconcile.worker.js"
	},
	tailscaleRouteOwner: {
		currentModuleUrl,
		sourceWorkerName: "tailscale-route-owner.worker",
		distWorkerPath: "infra/tailscale-route-owner.worker.js"
	},
	serviceChildRelay: {
		currentModuleUrl,
		sourceWorkerName: "../process/supervisor/service-child-relay",
		distWorkerPath: "process/supervisor/service-child-relay.js"
	},
	terminalPty: {
		currentModuleUrl,
		sourceWorkerName: "../process/terminal-pty-worker",
		distWorkerPath: "process/terminal-pty-worker.js"
	},
	serviceChildGroupAnchor: {
		currentModuleUrl,
		sourceWorkerName: "../process/supervisor/service-child-group-anchor",
		distWorkerPath: "process/supervisor/service-child-group-anchor.js"
	},
	serviceChildWindowsJobAnchor: {
		currentModuleUrl,
		sourceWorkerName: "../process/supervisor/service-child-windows-job-anchor",
		distWorkerPath: "process/supervisor/service-child-windows-job-anchor.js"
	},
	bunSqliteLibrary: {
		currentModuleUrl,
		sourceWorkerName: "bun-sqlite-library",
		distWorkerPath: "infra/bun-sqlite-library.js"
	}
};
new AsyncLocalStorage();
//#endregion
//#region src/daemon/runtime-binary.ts
function normalizeRuntimeBasename(execPath) {
	const trimmed = execPath.trim().replace(/^["']|["']$/g, "");
	const lastSlash = Math.max(trimmed.lastIndexOf("/"), trimmed.lastIndexOf("\\"));
	return (lastSlash === -1 ? trimmed : trimmed.slice(lastSlash + 1)).trim().toLowerCase();
}
/** Returns whether an executable path names a Bun runtime binary. */
function isBunRuntime(execPath) {
	const base = normalizeRuntimeBasename(execPath);
	return base === "bun" || base === "bun.exe";
}
//#endregion
//#region src/infra/runtime-worker-url.ts
/** Resolve an explicit installed root, source sibling, or stable packaged worker path. */
function resolveRuntimeWorkerUrl(params) {
	if (params.root !== void 0) return pathToFileURL(path.join(params.root, "dist", params.distWorkerPath));
	const currentPath = fileURLToPath(params.currentModuleUrl);
	const distIndex = currentPath.replaceAll(path.sep, "/").lastIndexOf("/dist/");
	if (distIndex >= 0) {
		const distRoot = currentPath.slice(0, distIndex + 6);
		let workerPath = params.distWorkerPath;
		if (params.package) {
			const packageRoot = path.resolve(distRoot, "..");
			const manifest = readRootJsonObjectSync({
				rootDir: packageRoot,
				relativePath: "package.json",
				boundaryLabel: "runtime worker package",
				rejectHardlinks: false
			});
			if (!manifest.ok) throw new Error(`Cannot resolve runtime worker package: ${packageRoot}/package.json`);
			if (manifest.value.name === params.package.name) workerPath = params.package.distWorkerPath;
		}
		return pathToFileURL(path.join(distRoot, workerPath));
	}
	const extension = path.extname(currentPath) || ".js";
	return new URL(`./${params.sourceWorkerName}${extension}`, params.currentModuleUrl);
}
function resolveRuntimeWorkerArgv(url, execPath = process.execPath) {
	const entry = fileURLToPath(url);
	return /\.[cm]?ts$/.test(entry) && !isBunRuntime(execPath) ? [
		"--import",
		import.meta.resolve("tsx"),
		entry
	] : [entry];
}
//#endregion
//#region src/infra/node-compile-cache-env.ts
const COMPILE_CACHE_BASE_KEY = Symbol.for("openclaw.nodeCompileCacheBase");
function compileCacheOwner() {
	return resolveGlobalSingleton(COMPILE_CACHE_BASE_KEY, () => ({}));
}
function resolveNodeCompileCacheEnv(env = process.env) {
	if (env.NODE_COMPILE_CACHE !== void 0 || env.NODE_DISABLE_COMPILE_CACHE !== void 0) return env;
	const directory = compileCacheOwner().baseDirectory;
	return directory ? {
		...env,
		NODE_COMPILE_CACHE: directory
	} : env;
}
//#endregion
//#region src/infra/sqlite-readonly-worker-protocol.ts
const SQLITE_READONLY_WORKER_MAX_BUFFER = 1048576;
function isSqliteSnapshotStagingMode(mode) {
	return mode === "staging-create" || mode === "staging-create-legacy" || mode === "staging-reconcile" || mode === "staging-retire";
}
var SqliteReadOnlyInspectionContentionError = class extends Error {};
function isSqliteReadOnlyWorkerResult(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return false;
	if (Object.keys(value).length !== 2 || !("ok" in value)) return false;
	return value.ok === true && "location" in value && typeof value.location === "string" || value.ok === true && "warnings" in value && Array.isArray(value.warnings) && value.warnings.every((warning) => typeof warning === "string") || value.ok === false && "message" in value && typeof value.message === "string";
}
function createSqliteReadOnlyWorkerError(message, stderr) {
	const stderrTail = toUSVString(sliceUtf16Safe(stderr.trim(), -4e3));
	return /* @__PURE__ */ new Error(`SQLite read-only worker ${message}${stderrTail ? `\nstderr (tail): ${stderrTail}` : ""}`);
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
	let result;
	try {
		result = parseSqliteReadOnlyWorkerResult(params.stdout, params.stderr);
	} catch (error) {
		if (params.failure) throw createSqliteReadOnlyWorkerError(params.failure, params.stderr);
		throw error;
	}
	if (params.failure || !result.ok) {
		const contention = !result.ok && result.message.startsWith("Retryable SQLite inspection contention: ");
		const error = createSqliteReadOnlyWorkerError(!result.ok ? contention ? result.message.slice(40) : result.message : params.failure ?? "failed", params.stderr);
		if (contention) throw new SqliteReadOnlyInspectionContentionError(error.message);
		throw error;
	}
	if ((mode === "sync" || mode === "async" || mode === "consolidated" || isSqliteSnapshotStagingMode(mode)) && "location" in result) return result.location;
	if (mode === "reclaim" && "warnings" in result) return result.warnings;
	throw createSqliteReadOnlyWorkerError("returned a result for a different operation", params.stderr);
}
//#endregion
//#region src/infra/sqlite-readonly-worker.ts
const SQLITE_INSPECTION_TIMEOUT_MS = 3e5;
const SQLITE_INSPECTION_BYTES_PER_SECOND = 33554432;
const log = createSubsystemLogger("state/sqlite");
function resolveSqliteInspectionBudget(operation, pathname, sizeBytes) {
	const timeoutMs = resolveTimerTimeoutMs(SQLITE_INSPECTION_TIMEOUT_MS + Math.ceil(40 * Number(sizeBytes ?? 0) / SQLITE_INSPECTION_BYTES_PER_SECOND) * 1e3, SQLITE_INSPECTION_TIMEOUT_MS);
	const size = sizeBytes === void 0 ? "unknown size" : formatByteSize(Number(sizeBytes), {
		style: "iec",
		maxUnit: "giga",
		separator: " ",
		fractionDigits: sizeBytes < 1024n ? 0 : 1
	});
	if (timeoutMs > SQLITE_INSPECTION_TIMEOUT_MS) log.debug(`SQLite ${operation} for ${pathname}: ${size}, budget ${timeoutMs / 1e3} seconds`);
	return {
		timeoutMs,
		size
	};
}
function readSqliteInspectionBudget(operation, pathname, mainSizeBytes) {
	let sizeBytes = mainSizeBytes;
	try {
		sizeBytes ??= fs.statSync(pathname, { bigint: true }).size;
		for (const suffix of [
			"-wal",
			"-shm",
			"-journal"
		]) try {
			sizeBytes += fs.statSync(pathname + suffix, { bigint: true }).size;
		} catch (error) {
			if (!hasErrnoCode(error, "ENOENT")) throw error;
		}
	} catch {}
	return resolveSqliteInspectionBudget(operation, pathname, sizeBytes);
}
function sqliteInspectionTimeoutError(operation, pathname, timeoutMs, size) {
	return /* @__PURE__ */ new Error(`SQLite ${operation} timed out after ${timeoutMs / 1e3} seconds (budget for ${size}) for ${pathname}. Stop the Gateway service and other OpenClaw processes using this database, then retry; if already stopped, check storage performance.`);
}
new AsyncLocalStorage();
function sqliteReadOnlyWorkerRequestArgs(pathname, options) {
	return [
		options.mode,
		path.resolve(pathname),
		...options.stagingRoot ? [options.stagingRoot] : []
	];
}
function sqliteReadOnlyWorkerArgv(pathname, options) {
	return [
		...resolveRuntimeWorkerArgv(resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.sqliteReadOnly)),
		SQLITE_READONLY_CHILD_ARG,
		...sqliteReadOnlyWorkerRequestArgs(pathname, options)
	];
}
function runSqliteReadOnlyWorkerSync(pathname, stagingRoot) {
	const { timeoutMs, size } = readSqliteInspectionBudget("read-only snapshot", pathname);
	const result = spawnSync(process.execPath, sqliteReadOnlyWorkerArgv(pathname, {
		mode: "sync",
		stagingRoot
	}), {
		encoding: "utf8",
		env: resolveNodeCompileCacheEnv(),
		maxBuffer: SQLITE_READONLY_WORKER_MAX_BUFFER,
		timeout: timeoutMs,
		killSignal: "SIGKILL"
	});
	return readSqliteReadOnlyWorkerValue({
		failure: result.error ? hasErrnoCode(result.error, "ETIMEDOUT") ? sqliteInspectionTimeoutError("read-only snapshot", pathname, timeoutMs, size).message : `failed to start: ${result.error.message}` : result.status === 0 ? void 0 : `exited with ${result.signal ? `signal ${result.signal}` : `code ${result.status}`}`,
		stderr: result.stderr,
		stdout: result.stdout
	}, "sync");
}
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
//#region src/gateway/worker-environments/session-attachment.ts
var WorkerSessionAlreadyAttachedError = class extends Error {
	constructor(sessionId, environmentId) {
		super(`Session ${sessionId} is already attached to worker environment ${environmentId}`);
		this.sessionId = sessionId;
		this.environmentId = environmentId;
	}
};
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
//#region src/skills/lifecycle/upload-store-error.ts
var SkillUploadRequestError = class extends Error {
	constructor(message) {
		super(message);
		this.name = "SkillUploadRequestError";
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
//#endregion
//#region src/state/openclaw-state-lease-error.ts
const leaseErrorCodes = [
	"OPENCLAW_STATE_LEASE_INVALID_INPUT",
	"OPENCLAW_STATE_LEASE_HELD",
	"OPENCLAW_STATE_LEASE_ABORTED",
	"OPENCLAW_STATE_LEASE_LOST",
	"OPENCLAW_STATE_LEASE_STORAGE_FAILED"
];
function isOpenClawStateLeaseErrorCode(value) {
	return leaseErrorCodes.some((code) => code === value);
}
var OpenClawStateLeaseError = class extends Error {
	constructor(message, options) {
		super(message, { cause: options.cause });
		this.name = "OpenClawStateLeaseError";
		this.code = options.code;
	}
};
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
const SQLITE_WAL_HEADER_BYTES = 32;
Buffer.from([
	0,
	5,
	22,
	7
]);
const sqliteFilesLog = createSubsystemLogger("state/sqlite");
var SqliteOrphanedSidecarsError = class extends Error {
	constructor(pathname, sidecarPaths, cause) {
		super(`SQLite database is missing at ${pathname}, and orphaned sidecars could not be copied: ${sidecarPaths.join(", ")}. Refusing to open because SQLite could delete orphan WAL or journal state. Preserve the sidecar bytes, restore the main database, and pair it with the matching sidecar before retrying.`, { cause });
		this.name = "SqliteOrphanedSidecarsError";
	}
};
/** Resolves the main database and all possible journal-mode sidecar paths. */
function resolveSqliteDatabaseFilePaths(pathname) {
	return SQLITE_DATABASE_FILE_SUFFIXES.map((suffix) => `${pathname}${suffix}`);
}
function findMatchingOrphanedSidecarCopy(sourcePath, sourceSize) {
	const directory = path.dirname(sourcePath);
	const prefix = `${path.basename(sourcePath)}.orphaned-`;
	const candidates = fs.readdirSync(directory, { withFileTypes: true }).filter((entry) => entry.isFile() && entry.name.startsWith(prefix)).map((entry) => path.join(directory, entry.name)).filter((candidate) => fs.statSync(candidate).size === sourceSize);
	if (candidates.length === 0) return;
	const sourceHash = sha256FileSync(sourcePath);
	for (const candidate of candidates) if (sha256FileSync(candidate) === sourceHash) return candidate;
}
function copyOrphanedSidecar(sourcePath, epochMs) {
	const basePath = `${sourcePath}.orphaned-${epochMs}`;
	for (let suffix = 0;; suffix += 1) {
		const candidate = suffix === 0 ? basePath : `${basePath}-${suffix}`;
		try {
			fs.copyFileSync(sourcePath, candidate, fs.constants.COPYFILE_EXCL);
			return candidate;
		} catch (error) {
			if (error.code !== "EEXIST") throw error;
		}
	}
}
/** Preserve durable orphan sidecars before SQLite creates a replacement main database. */
function quarantineOrphanedSqliteSidecars(pathname) {
	if (fs.existsSync(pathname)) return;
	const sidecars = [{
		path: `${pathname}-wal`,
		minimumBytes: SQLITE_WAL_HEADER_BYTES
	}, {
		path: `${pathname}-journal`,
		minimumBytes: 0
	}].flatMap((sidecar) => {
		const stat = fs.statSync(sidecar.path, { throwIfNoEntry: false });
		return stat?.isFile() === true && stat.size > sidecar.minimumBytes ? [{
			path: sidecar.path,
			size: stat.size
		}] : [];
	});
	if (sidecars.length === 0) return;
	const epochMs = Date.now();
	const copied = [];
	try {
		for (const sidecar of sidecars) {
			if (findMatchingOrphanedSidecarCopy(sidecar.path, sidecar.size)) continue;
			const quarantinePath = copyOrphanedSidecar(sidecar.path, epochMs);
			copied.push({
				quarantinePath,
				sourcePath: sidecar.path
			});
		}
	} catch (error) {
		throw new SqliteOrphanedSidecarsError(pathname, sidecars.map((sidecar) => sidecar.path), error);
	}
	if (copied.length === 0) return;
	const copies = copied.map(({ sourcePath, quarantinePath }) => `${sourcePath} -> ${quarantinePath}`);
	sqliteFilesLog.warn(`SQLite database is missing at ${pathname}; copied orphaned sidecars: ${copies.join(", ")}. Committed frames could not be applied because the main database is missing. The bytes are preserved. Recovery requires restoring the main database and pairing it with the quarantined file.`, {
		databasePath: pathname,
		copiedSidecars: copied
	});
}
//#endregion
//#region src/infra/sqlite-snapshot-source.ts
function prepareSqliteReadOnlyLocationSync(pathname) {
	if (hasStateDatabaseSourceExclusion(pathname)) return prepareSqliteReadOnlyLocationSyncInProcess(pathname);
	const stagingRoot = createSqliteSnapshotStagingDirectorySync();
	try {
		return adoptPreparedLocation(runSqliteReadOnlyWorkerSync(pathname, stagingRoot), stagingRoot);
	} catch (error) {
		if (!removeTempDirectory(stagingRoot)) throw new SqliteSnapshotCleanupError(`${coerceErrorMessage(error)}; SQLite snapshot cleanup failed: ${stagingRoot}`, { cause: error });
		throw error;
	}
}
//#endregion
//#region src/state/openclaw-state-ownership.ts
const STATE_SUPERVISION_KEY = "gateway.supervision";
const MAX_OWNERSHIP_TIMESTAMP_MS = 864e13;
const MANAGER_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/u;
var OpenClawStateOwnershipError = class extends Error {};
function isOpenClawStateWriteContentionError(error) {
	return error instanceof StateDatabaseCoordinatorContentionError || isSqliteLockError(error);
}
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
function parseExternalOwnership(valueJson, databasePath) {
	let value;
	try {
		value = JSON.parse(valueJson);
	} catch {
		throw new OpenClawStateOwnershipMetadataError(databasePath, "reserved value is not valid JSON");
	}
	const record = isRecord(value) ? value : void 0;
	const keys = record ? Object.keys(record).toSorted().join(",") : "";
	const managerId = record?.managerId;
	const claimedAt = record?.claimedAt;
	if (keys !== "claimedAt,managerId,mode,version" || record?.version !== 1 || record?.mode !== "external" || typeof managerId !== "string" || !MANAGER_ID_PATTERN.test(managerId) || typeof claimedAt !== "number" || !Number.isSafeInteger(claimedAt) || claimedAt < 0 || claimedAt > MAX_OWNERSHIP_TIMESTAMP_MS) throw new OpenClawStateOwnershipMetadataError(databasePath, "reserved value does not match the version 1 external ownership contract");
	return {
		version: 1,
		mode: "external",
		managerId,
		claimedAt
	};
}
/** Inspect the reserved ownership row without entering the shared-state lifecycle. */
function inspectOpenClawStateOwnershipFromDatabase(database, databasePath, configMachineStateTableReady = false) {
	try {
		if (!configMachineStateTableReady && !tableExists(database, "config_machine_state")) return null;
		const row = database.prepare("SELECT value_json FROM config_machine_state WHERE state_key = ? LIMIT 1").get(STATE_SUPERVISION_KEY);
		if (!row) return null;
		if (typeof row.value_json !== "string") throw new OpenClawStateOwnershipMetadataError(databasePath, "reserved value is not text");
		return parseExternalOwnership(row.value_json, databasePath);
	} catch (error) {
		throw normalizeOpenClawStateSchemaReadError(error, databasePath);
	}
}
function inspectOwnershipWhileCoordinatorHeld(databasePath, busyTimeoutMs, openStateSchemaReadAdmission) {
	const resolvedPath = path.resolve(databasePath);
	if (!existsSync(resolvedPath)) return null;
	const location = resolveExistingSqliteFileUri(resolvedPath);
	const database = withSqliteNativeOpen(() => openNodeSqliteDatabase(location));
	let closeAdmission;
	try {
		closeAdmission = openStateSchemaReadAdmission?.(database);
		database.exec(`PRAGMA busy_timeout = ${busyTimeoutMs}; PRAGMA trusted_schema = OFF;`);
		return inspectOpenClawStateOwnershipFromDatabase(database, resolvedPath);
	} finally {
		try {
			closeAdmission?.();
		} finally {
			database.close();
		}
	}
}
function acquireOpenClawStateOwnershipCoordinator(databasePath, busyTimeoutMs) {
	return acquireStateDatabaseCoordinator({
		databasePath,
		busyTimeoutMs
	});
}
function assertOwnershipAllowsWrite(status, databasePath, env) {
	if (status && !isGatewayExternallySupervised(env)) throw new OpenClawStateExternalOwnershipError(databasePath, status.managerId);
}
/** Fence and hold one path-based mutation until its main-file preamble is complete. */
function acquireOpenClawStateWriteAccess(options) {
	const resolvedPath = path.resolve(options.databasePath);
	const busyTimeoutMs = normalizeSqliteNonNegativeInteger(options.busyTimeoutMs ?? 5e3, "busyTimeoutMs");
	const access = acquireOpenClawStateOwnershipCoordinator(resolvedPath, busyTimeoutMs);
	try {
		quarantineOrphanedSqliteSidecars(resolvedPath);
		assertOwnershipAllowsWrite(inspectOwnershipWhileCoordinatorHeld(resolvedPath, busyTimeoutMs, options.openStateSchemaReadAdmission), resolvedPath, options.env ?? process.env);
		return access;
	} catch (operationError) {
		let releaseFailed = false;
		let releaseError;
		try {
			access.release();
		} catch (error) {
			releaseFailed = true;
			releaseError = error;
		}
		if (releaseFailed) throw createSqliteLifecycleAggregateError([operationError, releaseError], "state ownership inspection and coordinator release both failed", operationError);
		throw operationError;
	}
}
function runWithOpenClawStateWriteAccess(options, operationLabel, operation) {
	return runWithSqliteCoordinator(acquireOpenClawStateWriteAccess(options), operationLabel, operation);
}
/** Fence shared-state writes once an external manager has claimed ownership. */
function assertOpenClawStateWriteAllowed(options) {
	const resolvedPath = path.resolve(options.databasePath);
	assertOwnershipAllowsWrite(inspectOpenClawStateOwnershipFromDatabase(options.database, resolvedPath, options.schemaReady), resolvedPath, options.env ?? process.env);
}
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
function identifyError(error) {
	if (error instanceof WorkerSessionAlreadyAttachedError) return {
		type: "worker-session-already-attached",
		sessionId: error.sessionId,
		environmentId: error.environmentId
	};
	if (error instanceof PluginBlobStoreError) return {
		type: "plugin-blob",
		blobCode: error.code,
		operation: error.operation,
		...error.path === void 0 ? {} : { path: error.path }
	};
	if (error instanceof WorkspaceAliasRepointedError) return {
		type: "workspace-alias-repointed",
		aliasPath: error.aliasPath,
		storedWorkspacePath: error.storedWorkspacePath,
		currentWorkspacePath: error.currentWorkspacePath
	};
	if (error instanceof McpOAuthStoreCorruptionError) return { type: "mcp-oauth-corruption" };
	if (error instanceof SessionMetadataUnavailableError) return {
		type: "session-metadata",
		reason: error.reason,
		missingTables: [...error.missingTables]
	};
	if (error instanceof SkillUploadRequestError) return { type: "skill-upload-request" };
	if (error instanceof StateDatabaseCoordinatorContentionError) return {
		type: "coordinator-contention",
		family: error.family
	};
	if (error instanceof SqliteCoordinatorError) return { type: "coordinator" };
	if (error instanceof OpenClawStateLeaseError) return {
		type: "state-lease",
		leaseCode: error.code
	};
	if (error instanceof OpenClawStateOwnershipMetadataError) return {
		type: "ownership-metadata",
		databasePath: error.databasePath
	};
	if (error instanceof OpenClawStateExternalOwnershipError) return {
		type: "external-ownership",
		databasePath: error.databasePath,
		managerId: error.managerId
	};
	if (error instanceof OpenClawStateOwnershipError) return { type: "ownership" };
	if (error instanceof SqliteSchemaVersionError) return { type: "newer-schema" };
	if (error instanceof OpenClawStateDatabaseSchemaMigrationRequiredError) return {
		type: "state-migration",
		kind: error.kind,
		pathname: error.pathname
	};
	if (error instanceof OpenClawAgentDatabaseMediaMigrationRequiredError) return {
		type: "agent-media-migration",
		pathname: error.pathname,
		schemaVersion: error.schemaVersion
	};
	if (error instanceof StartupMaintenanceRequiredError) return {
		type: "maintenance",
		kind: error.kind
	};
	if (error instanceof RangeError) return { type: "range-error" };
	if (error instanceof SyntaxError) return { type: "syntax-error" };
	if (error instanceof TypeError) return { type: "type-error" };
	return { type: error instanceof AggregateError ? "aggregate" : "error" };
}
function isMaintenanceKind(kind) {
	return kind === "newer-schema" || kind === "agent-media" || kind === "agent-databases-composite-primary-key" || kind === "audit-events-v2" || kind === "legacy-cron-run-logs" || kind === "legacy-workshop-review-index" || kind === "legacy-workspace" || kind === "legacy-session-store";
}
function isBlobCode(value) {
	return value === "PLUGIN_BLOB_OPEN_FAILED" || value === "PLUGIN_BLOB_WRITE_FAILED" || value === "PLUGIN_BLOB_READ_FAILED" || value === "PLUGIN_BLOB_CORRUPT" || value === "PLUGIN_BLOB_LIMIT_EXCEEDED" || value === "PLUGIN_BLOB_INVALID_INPUT";
}
function isBlobOperation(value) {
	return value === "open" || value === "register" || value === "lookup" || value === "delete" || value === "entries" || value === "clear" || value === "sweep";
}
function parseIdentity(node) {
	switch (node.type) {
		case "worker-session-already-attached": return typeof node.sessionId === "string" && typeof node.environmentId === "string" ? {
			type: node.type,
			sessionId: node.sessionId,
			environmentId: node.environmentId
		} : void 0;
		case "workspace-alias-repointed": return typeof node.aliasPath === "string" && typeof node.storedWorkspacePath === "string" && typeof node.currentWorkspacePath === "string" ? {
			type: node.type,
			aliasPath: node.aliasPath,
			storedWorkspacePath: node.storedWorkspacePath,
			currentWorkspacePath: node.currentWorkspacePath
		} : void 0;
		case "error":
		case "aggregate":
		case "ownership":
		case "newer-schema":
		case "coordinator":
		case "range-error":
		case "syntax-error":
		case "type-error":
		case "skill-upload-request":
		case "mcp-oauth-corruption": return { type: node.type };
		case "session-metadata": return (node.reason === "schema-missing" || node.reason === "table-missing") && Array.isArray(node.missingTables) && node.missingTables.every((table) => typeof table === "string") ? {
			type: node.type,
			reason: node.reason,
			missingTables: [...node.missingTables]
		} : void 0;
		case "coordinator-contention": return node.family === "gateway-lifecycle" || node.family === "state-lifecycle" || node.family === "state-handles" ? {
			type: node.type,
			family: node.family
		} : void 0;
		case "ownership-metadata": return typeof node.databasePath === "string" ? {
			type: node.type,
			databasePath: node.databasePath
		} : void 0;
		case "external-ownership": return typeof node.databasePath === "string" && typeof node.managerId === "string" ? {
			type: node.type,
			databasePath: node.databasePath,
			managerId: node.managerId
		} : void 0;
		case "plugin-blob": return isBlobCode(node.blobCode) && node.code === node.blobCode && isBlobOperation(node.operation) && (node.path === void 0 || typeof node.path === "string") ? {
			type: node.type,
			blobCode: node.blobCode,
			operation: node.operation,
			...typeof node.path === "string" ? { path: node.path } : {}
		} : void 0;
		case "state-lease": return isOpenClawStateLeaseErrorCode(node.leaseCode) && node.code === node.leaseCode ? {
			type: node.type,
			leaseCode: node.leaseCode
		} : void 0;
		case "maintenance": return isMaintenanceKind(node.kind) ? {
			type: node.type,
			kind: node.kind
		} : void 0;
		case "state-migration": return (node.kind === "agent-databases-composite-primary-key" || node.kind === "audit-events-v2" || node.kind === "legacy-cron-run-logs" || node.kind === "legacy-workshop-review-index") && typeof node.pathname === "string" ? {
			type: node.type,
			kind: node.kind,
			pathname: node.pathname
		} : void 0;
		case "agent-media-migration": return typeof node.pathname === "string" && typeof node.schemaVersion === "number" && Number.isSafeInteger(node.schemaVersion) && node.schemaVersion >= 0 ? {
			type: node.type,
			pathname: node.pathname,
			schemaVersion: node.schemaVersion
		} : void 0;
		default: return;
	}
}
function unreachableErrorNode(node) {
	throw new Error(`Unexpected shared-state worker error node: ${String(node)}`);
}
function createError(node) {
	switch (node.type) {
		case "worker-session-already-attached": return new WorkerSessionAlreadyAttachedError(node.sessionId, node.environmentId);
		case "workspace-alias-repointed": return new WorkspaceAliasRepointedError(node);
		case "session-metadata": return new SessionMetadataUnavailableError(node.reason, void 0, node.missingTables);
		case "error": return new Error(node.message);
		case "range-error": return new RangeError(node.message);
		case "syntax-error": return new SyntaxError(node.message);
		case "type-error": return new TypeError(node.message);
		case "skill-upload-request": return new SkillUploadRequestError(node.message);
		case "mcp-oauth-corruption": return new McpOAuthStoreCorruptionError("", "");
		case "aggregate": return new AggregateError([], node.message);
		case "coordinator": return new SqliteCoordinatorError(node.message);
		case "coordinator-contention": return new StateDatabaseCoordinatorContentionError(node.family);
		case "ownership": return new OpenClawStateOwnershipError(node.message);
		case "ownership-metadata": return new OpenClawStateOwnershipMetadataError(node.databasePath, "");
		case "external-ownership": return new OpenClawStateExternalOwnershipError(node.databasePath, node.managerId);
		case "newer-schema": return new SqliteSchemaVersionError(node.message);
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
function isScalar(value) {
	return value === null || typeof value === "string" || typeof value === "boolean" || typeof value === "number" && Number.isFinite(value);
}
function isNativeErrorCode(value) {
	return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 2147483647;
}
function isErrorValue(value, count) {
	if (!isRecord(value) || Object.keys(value).length !== 1) return false;
	if ("ref" in value) return typeof value.ref === "number" && Number.isSafeInteger(value.ref) && value.ref >= 0 && value.ref < count;
	return "value" in value ? isScalar(value.value) : value.undefined === true;
}
function parseNode(value, count) {
	if (!isRecord(value) || typeof value.name !== "string" || typeof value.message !== "string") return;
	const identity = parseIdentity(value);
	if (!identity) return;
	const allowed = /* @__PURE__ */ new Set([
		...Object.keys(identity),
		"name",
		"message",
		"code",
		"errcode",
		"nativeOpen",
		"cause"
	]);
	const errors = [];
	if (identity.type === "aggregate") {
		allowed.add("errors");
		if (!Array.isArray(value.errors)) return;
		for (const entry of value.errors) {
			if (!isErrorValue(entry, count)) return;
			errors.push(entry);
		}
	}
	if (Object.keys(value).some((key) => !allowed.has(key)) || "code" in value && typeof value.code !== "string" && !(typeof value.code === "number" && Number.isFinite(value.code)) || "errcode" in value && !isNativeErrorCode(value.errcode) || "nativeOpen" in value && value.nativeOpen !== true || "cause" in value && !isErrorValue(value.cause, count)) return;
	return {
		...identity,
		name: value.name,
		message: value.message,
		...typeof value.code === "string" || typeof value.code === "number" ? { code: value.code } : {},
		...isNativeErrorCode(value.errcode) ? { errcode: value.errcode } : {},
		...value.nativeOpen === true ? { nativeOpen: true } : {},
		...isErrorValue(value.cause, count) ? { cause: value.cause } : {},
		...identity.type === "aggregate" ? { errors } : {}
	};
}
function decodeErrorGraph(value, options) {
	try {
		if (!isRecord(value) || Object.keys(value).some((key) => ![
			"version",
			"root",
			"nodes"
		].includes(key)) || value.version !== 1 || !Array.isArray(value.nodes) || typeof value.root !== "number" || !Number.isSafeInteger(value.root) || value.root < 0 || value.root >= value.nodes.length) return;
		const nodes = [];
		for (const valueNode of value.nodes) {
			const node = parseNode(valueNode, value.nodes.length);
			if (!node) return;
			nodes.push(node);
		}
		const visited = /* @__PURE__ */ new Set();
		const pending = [value.root];
		let canonical = false;
		for (const ref of pending) {
			if (visited.has(ref)) continue;
			visited.add(ref);
			const node = nodes[ref];
			canonical ||= node.nativeOpen === true || node.type === "aggregate" && node.name === "OpenClawQuarantineReadCleanupError" || node.type !== "error" && node.type !== "aggregate";
			for (const edge of [...node.cause ? [node.cause] : [], ...node.errors ?? []]) if ("ref" in edge) pending.push(edge.ref);
		}
		if (!canonical && options.includeOrdinary !== true || visited.size !== nodes.length) return;
		const errors = nodes.map(createError);
		const decodeValue = (entry) => "ref" in entry ? errors[entry.ref] : "value" in entry ? entry.value : void 0;
		for (const [index, node] of nodes.entries()) {
			const error = errors[index];
			error.name = node.name;
			error.message = node.message;
			if (node.nativeOpen) markSqliteNativeOpenFailure(error);
			if (node.code !== void 0) Object.defineProperty(error, "code", {
				value: node.code,
				configurable: true,
				writable: true
			});
			if (node.errcode !== void 0) Object.defineProperty(error, "errcode", {
				value: node.errcode,
				configurable: true,
				writable: true
			});
			if (node.cause) Object.defineProperty(error, "cause", {
				value: decodeValue(node.cause),
				configurable: true,
				writable: true
			});
			if (error instanceof AggregateError) error.errors = (node.errors ?? []).map(decodeValue);
		}
		const group = Object.freeze({});
		for (const [index, error] of errors.entries()) retainPayload(error, value, index, true, group);
		return {
			errors,
			nodes,
			root: value.root
		};
	} catch {
		return;
	}
}
const retainedPayloadKey = Symbol.for("openclaw.sharedStateWorkerErrorPayload");
function retainPayload(error, payload, node, materialized, group) {
	Object.defineProperty(error, retainedPayloadKey, { value: Object.freeze({
		payload,
		node,
		materialized,
		group
	}) });
}
/** Keep the closed wire graph without binding it to a process-global broker's classes. */
function retainOpenClawStateWorkerErrorPayload(error, payload) {
	retainPayload(error, payload, 0, false, Object.freeze({}));
}
function hydrateOpenClawStateWorkerError(value, options = {}) {
	if (!(value instanceof Error)) return value;
	const groups = /* @__PURE__ */ new Map();
	const nodes = /* @__PURE__ */ new Map();
	const queue = [];
	const add = (error) => {
		const previous = nodes.get(error);
		if (previous) return previous;
		const node = {
			source: error,
			replacement: error,
			parents: /* @__PURE__ */ new Set(),
			changed: false,
			opaque: false
		};
		nodes.set(error, node);
		queue.push(node);
		const retained = Object.getOwnPropertyDescriptor(error, retainedPayloadKey)?.value;
		if (isRecord(retained) && typeof retained.node === "number" && Number.isSafeInteger(retained.node) && retained.node >= 0 && typeof retained.materialized === "boolean" && isRecord(retained.group)) {
			if (!groups.has(retained.group)) groups.set(retained.group, decodeErrorGraph(retained.payload, options));
			const graph = groups.get(retained.group);
			const index = retained.materialized ? retained.node : graph?.root;
			const replacement = index === void 0 ? void 0 : graph?.errors[index];
			const identity = index === void 0 ? void 0 : graph?.nodes[index];
			if (replacement && identity) {
				node.replacement = replacement;
				node.opaque = !retained.materialized;
				node.changed = node.opaque || identifyError(error).type !== identity.type;
			}
		}
		return node;
	};
	const root = add(value);
	for (const node of queue) {
		if (node.opaque) continue;
		const edge = (child) => {
			if (child instanceof Error) add(child).parents.add(node);
		};
		if ("cause" in node.source) {
			node.cause = { value: node.source.cause };
			edge(node.cause.value);
		}
		if (node.source instanceof AggregateError) {
			node.errors = [...node.source.errors];
			node.errors.forEach(edge);
		}
	}
	const affected = queue.filter((node) => node.changed);
	for (const node of affected) for (const parent of node.parents) if (!parent.changed) {
		parent.changed = true;
		affected.push(parent);
	}
	if (!root.changed) return value;
	for (const node of affected) if (node.replacement === node.source) {
		node.replacement = node.source instanceof AggregateError ? new AggregateError([], node.source.message) : new Error(node.source.message);
		Object.setPrototypeOf(node.replacement, Object.getPrototypeOf(node.source));
	}
	const replace = (child) => {
		const node = child instanceof Error ? nodes.get(child) : void 0;
		return node?.changed ? node.replacement : child;
	};
	for (const node of affected) {
		if (node.opaque) continue;
		const descriptors = Object.getOwnPropertyDescriptors(node.source);
		Reflect.deleteProperty(descriptors, retainedPayloadKey);
		if (node.cause) descriptors.cause = {
			configurable: descriptors.cause?.configurable ?? true,
			enumerable: descriptors.cause?.enumerable ?? false,
			writable: descriptors.cause?.writable ?? true,
			value: replace(node.cause.value)
		};
		if (node.errors) descriptors.errors = {
			configurable: descriptors.errors?.configurable ?? true,
			enumerable: descriptors.errors?.enumerable ?? false,
			writable: descriptors.errors?.writable ?? true,
			value: node.errors.map(replace)
		};
		Object.defineProperties(node.replacement, descriptors);
	}
	return root.replacement;
}
//#endregion
//#region src/infra/runtime-process-url.ts
const sealedEntrypoints = /* @__PURE__ */ new Map();
function resolveRuntimeProcessEntrypointUrl(name) {
	return sealedEntrypoints.get(name) ?? resolveRuntimeWorkerUrl(runtimeProcessEntrypoints[name]);
}
//#endregion
//#region src/infra/worker-cpu.ts
const workerScriptNames = /* @__PURE__ */ new Set([
	...Object.values(runtimeProcessEntrypoints).map((entry) => basename(entry.distWorkerPath)),
	"catalog-page.worker.js",
	"code-mode.worker.js",
	"compaction-planning.worker.js",
	"disk-budget.worker.js",
	"document-extractor.worker.js",
	"manager-index.worker.js",
	"manager-search.worker.js",
	"memory-index.worker.js",
	"memory-search.worker.js",
	"session-history.worker.js"
]);
function workerScriptName(filename, evalSource = false) {
	if (evalSource || filename instanceof URL && filename.protocol !== "file:") return "other";
	const name = basename(filename instanceof URL ? fileURLToPath(filename) : filename).replace(/\.[cm]?ts$/u, ".js");
	return workerScriptNames.has(name) ? name : "other";
}
const trackedWorkers = resolveGlobalSingleton(Symbol.for("openclaw.workerCpuSources"), () => {
	process.on("worker", trackWorker);
	return {
		revision: 0,
		workers: /* @__PURE__ */ new Map()
	};
});
function createCpuTrackedWorker(...args) {
	const worker = new Worker(...args);
	trackWorker(worker);
	trackedWorkers.workers.get(worker).script = workerScriptName(args[0], args[1]?.eval);
	return worker;
}
function forgetWorker(worker) {
	if (trackedWorkers.workers.delete(worker)) trackedWorkers.revision++;
}
function trackWorker(worker) {
	if (trackedWorkers.workers.has(worker)) return;
	let pending = false;
	trackedWorkers.workers.set(worker, {
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
	});
	trackedWorkers.revision++;
	worker.once("exit", () => forgetWorker(worker));
}
//#endregion
export { OpenClawStateOwnershipError as a, runWithOpenClawStateWriteAccess as c, resolveNodeCompileCacheEnv as d, retainOpenClawStateWorkerErrorPayload as i, prepareSqliteReadOnlyLocationSync as l, resolveRuntimeProcessEntrypointUrl as n, assertOpenClawStateWriteAllowed as o, hydrateOpenClawStateWorkerError as r, isOpenClawStateWriteContentionError as s, createCpuTrackedWorker as t, resolveSqliteDatabaseFilePaths as u };
