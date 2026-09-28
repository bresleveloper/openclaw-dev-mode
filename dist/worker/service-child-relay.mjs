import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import fs, { closeSync, createWriteStream, openSync, readSync, readdirSync } from "node:fs";
import { setTimeout } from "node:timers/promises";
import path from "node:path";
import { URL as URL$1, fileURLToPath, pathToFileURL } from "node:url";
import { AsyncLocalStorage } from "node:async_hooks";
import os, { platform } from "node:os";
import { getSystemErrorName } from "node:util";
//#region src/infra/runtime-process-entrypoints.ts
const currentModuleUrl = import.meta.url;
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
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.18.1/node_modules/@openclaw/fs-safe/dist/byte-budget.js
function normalizeMaxBytes(value, options = {}) {
	const selected = value === void 0 ? options.defaultValue : value;
	if (selected === void 0 || selected === Number.POSITIVE_INFINITY) return selected;
	if (!Number.isSafeInteger(selected) || selected < 0) throw new RangeError("maxBytes must be a non-negative safe integer or Infinity");
	return selected;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.18.1/node_modules/@openclaw/fs-safe/dist/errors.js
const OPERATIONAL_CODES = /* @__PURE__ */ new Set([
	"helper-failed",
	"helper-unavailable",
	"not-empty",
	"not-found",
	"not-removable",
	"permission-unverified",
	"read-failed",
	"timeout",
	"unsupported-platform"
]);
function categorizeFsSafeError(code) {
	return OPERATIONAL_CODES.has(code) ? "operational" : "policy";
}
var FsSafeError = class extends Error {
	code;
	category;
	details;
	constructor(code, message, options = {}) {
		super(message, options);
		this.name = "FsSafeError";
		this.code = code;
		this.category = categorizeFsSafeError(code);
		this.details = options.details;
	}
};
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.18.1/node_modules/@openclaw/fs-safe/dist/bounded-read.js
const READ_CHUNK_BYTES = 65536;
const MAX_INITIAL_READ_BYTES = 16777216;
function createInitialBuffer(maxBytes, size, allocate = Buffer.allocUnsafe) {
	return allocate(Math.min(maxBytes, size, MAX_INITIAL_READ_BYTES) + 1);
}
function createScratchBuffer(maxBytes, allocate = Buffer.allocUnsafe) {
	return allocate(Math.min(READ_CHUNK_BYTES, maxBytes + 1));
}
function growReadBuffer(buffer, maxBytes, allocate = Buffer.allocUnsafe) {
	const grown = allocate(Math.min(maxBytes + 1, Math.max(READ_CHUNK_BYTES, buffer.length * 2)));
	buffer.copy(grown);
	return grown;
}
function finishReadBuffer(buffer, total, allocate) {
	if (total === 0) return Buffer.alloc(0);
	const result = buffer.subarray(0, total);
	if (total >= buffer.length / 2) return result;
	if (!allocate) return Buffer.from(result);
	const compact = allocate(total);
	result.copy(compact);
	return compact;
}
function addReadBytes(total, bytesRead, maxBytes, createLimitError) {
	const next = total + bytesRead;
	if (next > maxBytes) {
		if (createLimitError) throw createLimitError();
		throw new FsSafeError("too-large", `file exceeds limit of ${maxBytes} bytes (got at least ${next})`);
	}
	return next;
}
function regularFileSize(fd) {
	try {
		const stat = fs.fstatSync(fd);
		return stat.isFile() && Number.isSafeInteger(stat.size) && stat.size >= 0 ? stat.size : void 0;
	} catch {
		return;
	}
}
function readBoundedSync(maxBytes, readChunk, options = {}) {
	normalizeMaxBytes(maxBytes);
	let total = 0;
	const { observeRegularFileSize, createLimitError } = options;
	const size = options.initialSize ?? observeRegularFileSize?.();
	let buffer = size === void 0 ? createScratchBuffer(maxBytes) : createInitialBuffer(maxBytes, size);
	if (size !== void 0) {
		const bytesRead = readChunk(buffer, buffer.length);
		if (bytesRead === 0) return finishReadBuffer(buffer, 0);
		const currentSize = bytesRead < buffer.length ? observeRegularFileSize?.() : void 0;
		total = addReadBytes(total, bytesRead, maxBytes, createLimitError);
		if (currentSize !== void 0 && currentSize > 0 && bytesRead >= currentSize) return finishReadBuffer(buffer, total);
	}
	while (true) {
		if (total === buffer.length) buffer = growReadBuffer(buffer, maxBytes);
		const remaining = buffer.subarray(total);
		const bytesRead = readChunk(remaining, remaining.length);
		if (bytesRead === 0) return finishReadBuffer(buffer, total);
		total = addReadBytes(total, bytesRead, maxBytes, createLimitError);
	}
}
/** Sync bounded read from a numeric descriptor. The caller owns the descriptor. */
function readFileDescriptorBoundedSync(fd, maxBytes) {
	return readBoundedSync(maxBytes, (buffer, length) => fs.readSync(fd, buffer, 0, length, null), {
		initialSize: maxBytes <= READ_CHUNK_BYTES ? maxBytes : void 0,
		observeRegularFileSize: () => regularFileSize(fd)
	});
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.18.1/node_modules/@openclaw/fs-safe/dist/string-coerce.js
function normalizeNullableString(value) {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	return trimmed ? trimmed : null;
}
function normalizeOptionalString(value) {
	return normalizeNullableString(value) ?? void 0;
}
function normalizeOptionalLowercaseString(value) {
	return normalizeOptionalString(value)?.toLowerCase();
}
function normalizeLowercaseStringOrEmpty(value) {
	return normalizeOptionalLowercaseString(value) ?? "";
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.18.1/node_modules/@openclaw/fs-safe/dist/windows-path-syntax.js
function isWindowsSeparator(value, offset) {
	const code = value.charCodeAt(offset);
	return code === 47 || code === 92;
}
function hasWindowsDrivePrefix(value, offset = 0) {
	const letter = value.charCodeAt(offset) | 32;
	return letter >= 97 && letter <= 122 && value.charCodeAt(offset + 1) === 58;
}
/** Classify a raw prefix without normalizing any path components. */
function windowsNamespaceMarker(value) {
	const marker = value[2];
	return (marker === "." || marker === "?") && isWindowsSeparator(value, 0) && isWindowsSeparator(value, 1) && isWindowsSeparator(value, 3) ? marker : void 0;
}
function rootedWindowsDriveColonIndex(value) {
	const colon = hasWindowsDrivePrefix(value) ? 1 : windowsNamespaceMarker(value) !== void 0 && hasWindowsDrivePrefix(value, 4) ? 5 : -1;
	return colon >= 0 && isWindowsSeparator(value, colon + 1) ? colon : -1;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.18.1/node_modules/@openclaw/fs-safe/dist/windows-path-alias.js
function isBareWindowsNamespaceDrive(value) {
	return value.length === 6 && windowsNamespaceMarker(value) !== void 0 && hasWindowsDrivePrefix(value, 4);
}
/**
* Resolve a path without letting Node erase the separator from an exact
* extended-length drive root such as `\\?\C:\`. Bare `\\?\C:` input remains
* unchanged so the surrounding alias admission rejects it.
*/
function resolvePathPreservingWindowsRoot(value) {
	if (value.length === 7 && process.platform === "win32" && rootedWindowsDriveColonIndex(value) === 5) return value.includes("/") ? value.replaceAll("/", "\\") : value;
	return repairResolvedWindowsRoot(value, path.resolve(value));
}
/**
* Preserve a namespaced drive root after a caller has already resolved the
* input. This lets admission fast paths keep exactly one live path.resolve
* call while retaining the same root-repair behavior as the general helper.
*/
function repairResolvedWindowsRoot(value, resolved) {
	if (resolved.length === 6 && process.platform === "win32" && isBareWindowsNamespaceDrive(resolved) && !hasWindowsPathAlias(value, "filesystem")) return `${resolved}\\`;
	return resolved;
}
/**
* Resolve path segments against a base while preserving a namespaced drive
* root when Node normalizes a legitimate rooted input back to that root.
* Raw bare namespace drives stay bare so admission checks still reject them.
*/
function resolvePathFromBasePreservingWindowsRoot(base, ...segments) {
	const resolved = path.resolve(base, ...segments);
	if (resolved.length !== 6 || process.platform !== "win32" || !isBareWindowsNamespaceDrive(resolved)) return resolved;
	if (hasWindowsPathAlias(base, "filesystem") || segments.some((segment) => hasWindowsPathAlias(segment, "filesystem"))) return resolved;
	return `${resolved}\\`;
}
/**
* Adapt an admitted namespaced drive root for Node's Windows filesystem layer.
* Node removes the root separator from these paths during filesystem dispatch,
* so use the equivalent ordinary drive root for the operation. This is not an
* admission check: callers must validate attacker-controlled input first.
*/
function pathForWindowsFilesystem(value) {
	if (process.platform !== "win32" || rootedWindowsDriveColonIndex(value) !== 5) return value;
	if (value.length === 7) return `${value[4]}:\\`;
	const resolved = path.resolve(value);
	if (isBareWindowsNamespaceDrive(resolved) && !hasWindowsPathAlias(value, "filesystem")) return `${resolved[4]}:\\`;
	return value;
}
/** Returns true when a Windows pathname can address an alternate filesystem namespace. */
function hasWindowsPathAlias(value, kind, platform = process.platform) {
	if (platform !== "win32") return false;
	const firstColon = value.indexOf(":");
	if (firstColon === -1) return false;
	if (kind === "relative") return true;
	return firstColon !== rootedWindowsDriveColonIndex(value) || value.indexOf(":", firstColon + 1) !== -1;
}
function assertNoWindowsPathAlias(value, kind = "filesystem", message = "path uses a Windows filesystem namespace alias", platform = process.platform) {
	if (hasWindowsPathAlias(value, kind, platform)) throw new FsSafeError("invalid-path", message, { details: { reason: "windows-path-alias" } });
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.18.1/node_modules/@openclaw/fs-safe/dist/local-file-access.js
const ENCODED_FILE_URL_SEPARATOR_RE = /%(?:2f|5c)/i;
const FILE_URL_PREFIX_RE = /^file:\/\//i;
function isFileUrl(input) {
	return FILE_URL_PREFIX_RE.test(input);
}
function isLocalFileUrlHost(hostname) {
	const normalized = normalizeLowercaseStringOrEmpty(hostname);
	return normalized === "" || normalized === "localhost";
}
function hasEncodedFileUrlSeparator(pathname) {
	return ENCODED_FILE_URL_SEPARATOR_RE.test(pathname);
}
function isWindowsNetworkPath(filePath, platform = process.platform) {
	if (platform !== "win32") return false;
	return isWindowsSeparator(filePath, 0) && isWindowsSeparator(filePath, 1) && !(windowsNamespaceMarker(filePath) === "?" && rootedWindowsDriveColonIndex(filePath) === 5);
}
function safeFileURLToPath(fileUrl, platform = process.platform) {
	let parsed;
	try {
		parsed = new URL$1(fileUrl);
	} catch {
		throw new Error(`Invalid file:// URL: ${fileUrl}`);
	}
	if (parsed.protocol !== "file:") throw new Error(`Invalid file:// URL: ${fileUrl}`);
	if (!isLocalFileUrlHost(parsed.hostname)) throw new Error(`file:// URLs with remote hosts are not allowed: ${fileUrl}`);
	if (hasEncodedFileUrlSeparator(parsed.pathname)) throw new Error(`file:// URLs cannot encode path separators: ${fileUrl}`);
	const filePath = fileURLToPath(parsed, { windows: platform === "win32" });
	if (hasWindowsPathAlias(filePath, "filesystem", platform)) throw new Error(`Local file URL cannot use Windows filesystem namespace aliases: ${filePath}`);
	if (isWindowsNetworkPath(filePath, platform)) throw new Error(`Local file URL cannot use Windows network paths: ${filePath}`);
	return filePath;
}
function trySafeFileURLToPath(fileUrl, platform = process.platform) {
	try {
		return safeFileURLToPath(fileUrl, platform);
	} catch {
		return;
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.18.1/node_modules/@openclaw/fs-safe/dist/device-path.js
const POSIX_BLOCKED_DEVICE_PATHS = /* @__PURE__ */ new Set([
	"/dev/zero",
	"/dev/random",
	"/dev/urandom",
	"/dev/full",
	"/dev/stdin",
	"/dev/stdout",
	"/dev/stderr",
	"/dev/tty",
	"/dev/console"
]);
const WINDOWS_RESERVED_DEVICE_NAMES = /* @__PURE__ */ new Set([
	"CON",
	"PRN",
	"AUX",
	"NUL",
	"CLOCK$",
	"CONIN$",
	"CONOUT$",
	"COM1",
	"COM2",
	"COM3",
	"COM4",
	"COM5",
	"COM6",
	"COM7",
	"COM8",
	"COM9",
	"COM¹",
	"COM²",
	"COM³",
	"LPT1",
	"LPT2",
	"LPT3",
	"LPT4",
	"LPT5",
	"LPT6",
	"LPT7",
	"LPT8",
	"LPT9",
	"LPT¹",
	"LPT²",
	"LPT³"
]);
const WINDOWS_SEPARATOR_CHAR_CODE = 92;
const WINDOWS_IGNORED_SPACE_CHAR_CODE = 32;
const WINDOWS_IGNORED_DOT_CHAR_CODE = 46;
function trimTrailingWindowsSeparators(value) {
	let end = value.length;
	while (end > 0 && value.charCodeAt(end - 1) === WINDOWS_SEPARATOR_CHAR_CODE) end -= 1;
	return end === value.length ? value : value.slice(0, end);
}
function trimTrailingWindowsIgnoredChars(value) {
	let end = value.length;
	while (end > 0) {
		const charCode = value.charCodeAt(end - 1);
		if (charCode !== WINDOWS_IGNORED_SPACE_CHAR_CODE && charCode !== WINDOWS_IGNORED_DOT_CHAR_CODE) break;
		end -= 1;
	}
	return end === value.length ? value : value.slice(0, end);
}
function candidateReadPaths(filePath, platform) {
	if (!isFileUrl(filePath)) return [filePath];
	const parsed = trySafeFileURLToPath(filePath, platform);
	return parsed === void 0 ? [filePath] : [filePath, parsed];
}
function normalizePosixPath(filePath, cwd) {
	if (path.posix.isAbsolute(filePath)) return path.posix.normalize(filePath);
	const base = cwd && path.posix.isAbsolute(cwd) ? cwd : process.cwd();
	return path.posix.resolve(base, filePath);
}
function matchPosixDeviceReadPath(filePath, cwd) {
	const normalized = normalizePosixPath(filePath, cwd);
	if (POSIX_BLOCKED_DEVICE_PATHS.has(normalized)) return {
		path: normalized,
		reason: "posix-device"
	};
	if (normalized === "/dev/fd" || normalized.startsWith("/dev/fd/")) return {
		path: normalized,
		reason: "posix-fd"
	};
	if (/^\/proc\/(?:self|thread-self|\d+)\/fd(?:\/|$)/.test(normalized)) return {
		path: normalized,
		reason: "posix-fd"
	};
}
function normalizeWindowsDeviceBaseName(filePath) {
	const normalized = trimTrailingWindowsSeparators(filePath.replace(/\//g, "\\"));
	const start = normalized.lastIndexOf("\\") + 1;
	const stream = normalized.indexOf(":", start);
	const extension = normalized.indexOf(".", start);
	const end = Math.min(stream < 0 ? normalized.length : stream, extension < 0 ? normalized.length : extension);
	return trimTrailingWindowsIgnoredChars(normalized.slice(start, end)).toUpperCase();
}
function matchWindowsDeviceReadPath(filePath) {
	const normalized = filePath.replace(/\//g, "\\");
	if (/^\\\\\.\\/.test(normalized) || /^\\\\\?\\GLOBALROOT\\Device\\/i.test(normalized)) return {
		path: normalized,
		reason: "windows-device"
	};
	const baseName = normalizeWindowsDeviceBaseName(filePath);
	if (WINDOWS_RESERVED_DEVICE_NAMES.has(baseName)) return {
		path: normalized,
		reason: "windows-device"
	};
}
function matchUnsafeDeviceReadPath(filePath, options = {}) {
	const platform = options.platform ?? process.platform;
	for (const candidate of candidateReadPaths(filePath, platform)) {
		const match = platform === "win32" ? matchWindowsDeviceReadPath(candidate) : matchPosixDeviceReadPath(candidate, options.cwd);
		if (match) return match;
	}
}
function isUnsafeDeviceReadPath(filePath, options) {
	return matchUnsafeDeviceReadPath(filePath, options) !== void 0;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.18.1/node_modules/@openclaw/fs-safe/dist/file-observation.js
const active = new AsyncLocalStorage();
function recordFileObservationFailure(error, kind) {
	const failures = active.getStore();
	if (!failures) return;
	let kinds = failures.get(error);
	if (!kinds) failures.set(error, kinds = /* @__PURE__ */ new Set());
	kinds.add(kind);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.18.1/node_modules/@openclaw/fs-safe/dist/strict-file-identity.js
function identityMismatch$1() {
	const error = new FsSafeError("path-mismatch", "file identity changed or could not be verified");
	recordFileObservationFailure(error, "identity");
	return error;
}
function inspectFileIdentitySync(inspect, expected, platform = process.platform, mismatch = identityMismatch$1) {
	let knownDev;
	let knownIno;
	if (expected) {
		knownDev = expected.dev;
		if (typeof knownDev !== "bigint") throw mismatch();
		knownIno = expected.ino;
		if (typeof knownIno !== "bigint") throw mismatch();
		if (platform === "win32" && (knownDev === 0n || knownIno === 0n)) throw mismatch();
	}
	for (let attempt = 0; attempt < 2; attempt++) {
		const stat = inspect();
		let complete = true;
		const dev = stat.dev;
		if (typeof dev !== "bigint") throw mismatch();
		if (platform === "win32" && dev === 0n) complete = false;
		else {
			if (knownDev !== void 0 && knownDev !== dev) throw mismatch();
			knownDev = dev;
		}
		const ino = stat.ino;
		if (typeof ino !== "bigint") throw mismatch();
		if (platform === "win32" && ino === 0n) complete = false;
		else {
			if (knownIno !== void 0 && knownIno !== ino) throw mismatch();
			knownIno = ino;
		}
		if (complete) return stat;
	}
	throw mismatch();
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.18.1/node_modules/@openclaw/fs-safe/dist/native-binding.js
function captureNativeFdClose(binding) {
	if (typeof binding.closeOwnedFd !== "function") throw new FsSafeError("helper-unavailable", "native descriptor ownership is unavailable");
	return binding.closeOwnedFd.bind(binding);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.18.1/node_modules/@openclaw/fs-safe/dist/native-config.js
let overrideConfig = {};
let legacyWarningEmitted = false;
const legacyModeEnvKeys = ["FS_SAFE_PYTHON_MODE", "OPENCLAW_FS_SAFE_PYTHON_MODE"];
const legacyPathEnvKeys = [
	"FS_SAFE_PYTHON",
	"OPENCLAW_FS_SAFE_PYTHON",
	"OPENCLAW_PINNED_PYTHON",
	"OPENCLAW_PINNED_WRITE_PYTHON"
];
function parseMode(value) {
	if (!value) return;
	const normalized = value.trim().toLowerCase();
	if (normalized === "0" || normalized === "false" || normalized === "off" || normalized === "never") return "off";
	if (normalized === "1" || normalized === "true" || normalized === "on" || normalized === "auto") return "auto";
	if (normalized === "required" || normalized === "require") return "require";
}
function warnLegacyPythonConfiguration(source, mappedMode) {
	if (legacyWarningEmitted) return;
	legacyWarningEmitted = true;
	process.emitWarning(`${source} is a deprecated 0.4 compatibility bridge; mapped to native mode "${mappedMode}". Use configureFsSafeNative({ mode: "${mappedMode}" }) or FS_SAFE_NATIVE_MODE=${mappedMode}. Python interpreter paths are no longer used.`, {
		code: "FS_SAFE_PYTHON_DEPRECATED",
		type: "DeprecationWarning"
	});
}
function readLegacyPythonMode() {
	const configuredKeys = [...legacyModeEnvKeys, ...legacyPathEnvKeys].filter((key) => process.env[key] !== void 0);
	if (configuredKeys.length === 0) return;
	const mappedMode = parseMode(legacyModeEnvKeys.map((key) => process.env[key]).find((value) => value !== void 0)) ?? "auto";
	warnLegacyPythonConfiguration(`Legacy ${configuredKeys.join(", ")}`, mappedMode);
	return mappedMode;
}
function getFsSafeNativeConfig() {
	const legacyMode = readLegacyPythonMode();
	return { mode: overrideConfig.mode ?? parseMode(process.env.FS_SAFE_NATIVE_MODE) ?? parseMode(process.env.OPENCLAW_FS_SAFE_NATIVE_MODE) ?? legacyMode ?? "auto" };
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.18.1/node_modules/@openclaw/fs-safe/dist/native.js
const require = createRequire(import.meta.url);
let binding;
let loadError;
let attempted = false;
let loadBinding = loadBundledBinding;
function isMuslFilename(file) {
	return file.includes("libc.musl-") || file.includes("ld-musl-");
}
function isMuslFromReport() {
	try {
		if (!process.report || typeof process.report.getReport !== "function") return void 0;
		const report = process.report.getReport();
		if (report.header?.glibcVersionRuntime) return false;
		if (report.sharedObjects?.some(isMuslFilename)) return true;
	} catch {}
}
function isMuslFromFilesystem() {
	for (const directory of ["/lib", "/usr/lib"]) try {
		if (readdirSync(directory).some(isMuslFilename)) return true;
	} catch {}
}
function readUInt(buffer, offset, bytes, littleEndian) {
	if (offset < 0 || offset + bytes > buffer.length) return void 0;
	if (bytes === 2) return littleEndian ? buffer.readUInt16LE(offset) : buffer.readUInt16BE(offset);
	if (bytes === 4) return littleEndian ? buffer.readUInt32LE(offset) : buffer.readUInt32BE(offset);
	const value = littleEndian ? buffer.readBigUInt64LE(offset) : buffer.readBigUInt64BE(offset);
	return value <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(value) : void 0;
}
function isMuslFromElfInterpreter() {
	let fd;
	try {
		fd = openSync(process.execPath, "r");
		const header = Buffer.alloc(64);
		if (readSync(fd, header, 0, header.length, 0) < 52) return void 0;
		if (!header.subarray(0, 4).equals(Buffer.from([
			127,
			69,
			76,
			70
		]))) return void 0;
		const elfClass = header[4];
		const dataEncoding = header[5];
		if (elfClass !== 1 && elfClass !== 2 || dataEncoding !== 1 && dataEncoding !== 2) return;
		const littleEndian = dataEncoding === 1;
		const is64Bit = elfClass === 2;
		const tableOffset = readUInt(header, is64Bit ? 32 : 28, is64Bit ? 8 : 4, littleEndian);
		const entrySize = readUInt(header, is64Bit ? 54 : 42, 2, littleEndian);
		const entryCount = readUInt(header, is64Bit ? 56 : 44, 2, littleEndian);
		if (tableOffset === void 0 || entrySize === void 0 || entryCount === void 0 || entrySize < (is64Bit ? 56 : 32) || entryCount > 1024) return;
		const programHeader = Buffer.alloc(entrySize);
		for (let index = 0; index < entryCount; index += 1) {
			const offset = tableOffset + index * entrySize;
			if (readSync(fd, programHeader, 0, entrySize, offset) !== entrySize) return void 0;
			if (readUInt(programHeader, 0, 4, littleEndian) !== 3) continue;
			const interpreterOffset = readUInt(programHeader, is64Bit ? 8 : 4, is64Bit ? 8 : 4, littleEndian);
			const interpreterSize = readUInt(programHeader, is64Bit ? 32 : 16, is64Bit ? 8 : 4, littleEndian);
			if (interpreterOffset === void 0 || interpreterSize === void 0 || interpreterSize < 1 || interpreterSize > 4096) return;
			const interpreter = Buffer.alloc(interpreterSize);
			if (readSync(fd, interpreter, 0, interpreterSize, interpreterOffset) !== interpreterSize) return;
			return isMuslFilename(interpreter.toString("utf8"));
		}
	} catch {
		return;
	} finally {
		if (fd !== void 0) try {
			closeSync(fd);
		} catch {}
	}
}
function isMusl() {
	if (process.platform !== "linux") return false;
	for (const detector of [
		isMuslFromReport,
		isMuslFromElfInterpreter,
		isMuslFromFilesystem
	]) {
		const result = detector();
		if (result !== void 0) return result;
	}
	return false;
}
function targetFor(platform, arch, musl) {
	if (platform === "win32" && arch === "x64") return "win32-x64-msvc";
	if (platform === "darwin" && arch === "x64") return "darwin-x64";
	if (platform === "darwin" && arch === "arm64") return "darwin-arm64";
	if (platform === "linux" && (arch === "x64" || arch === "arm64")) return `linux-${arch}-${musl ? "musl" : "gnu"}`;
}
function bundledTarget() {
	return targetFor(process.platform, process.arch, isMusl());
}
function nativePackageForTarget(target) {
	return `@openclaw/fs-safe-${target}`;
}
function loadBundledBinding() {
	const target = bundledTarget();
	if (!target) throw new Error(`Unsupported OS or architecture: ${process.platform}-${process.arch}`);
	const loaded = require(nativePackageForTarget(target));
	captureNativeFdClose(loaded);
	return loaded;
}
function getNativeBinding() {
	const { mode } = getFsSafeNativeConfig();
	if (mode === "off") return void 0;
	if (!attempted) {
		attempted = true;
		try {
			const loaded = loadBinding();
			captureNativeFdClose(loaded);
			binding = loaded;
		} catch (error) {
			loadError = error;
		}
	}
	if (binding) return binding;
	if (mode === "require") throw new FsSafeError("helper-unavailable", "native fs-safe helper is unavailable", { cause: loadError });
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.18.1/node_modules/@openclaw/fs-safe/dist/realpath.js
const runtimePlatform = process.versions.bun ? platform() : void 0;
const bunPosix = runtimePlatform === "darwin" || runtimePlatform === "linux" ? runtimePlatform : void 0;
function resolve(input, native) {
	if (bunPosix) {
		if (input.includes("\0")) throw Object.assign(/* @__PURE__ */ new TypeError("realpath input must not contain null bytes"), { code: "ERR_INVALID_ARG_VALUE" });
		const binding = getNativeBinding();
		if (binding?.canonicalizePath) {
			const result = binding.canonicalizePath(input, !native);
			if (result.path !== void 0) return result.path;
			const errno = -result.errno;
			const code = getSystemErrorName(errno);
			throw Object.assign(/* @__PURE__ */ new Error(`${code}: realpath '${input}'`), {
				code,
				errno,
				syscall: "realpath",
				path: input
			});
		}
		if (getFsSafeNativeConfig().mode === "require") throw new FsSafeError("helper-unavailable", "native fs-safe canonicalization is unavailable");
	}
	return native ? fs.realpathSync.native(input) : fs.realpathSync(input);
}
const realpathSync = Object.assign((input) => resolve(input, false), { native: (input) => resolve(input, true) });
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.18.1/node_modules/@openclaw/fs-safe/dist/safe-path-segment.js
const DRIVE_RELATIVE_SEGMENT = /(?:^|\/)[A-Za-z]:(?!\\)/;
function assertNoDriveRelativePathSegments(value, label) {
	if (DRIVE_RELATIVE_SEGMENT.test(value)) throw new FsSafeError("invalid-path", `${label} must not contain a drive letter`);
	return value;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.18.1/node_modules/@openclaw/fs-safe/dist/path.js
const NOT_FOUND_CODES = /* @__PURE__ */ new Set(["ENOENT", "ENOTDIR"]);
const SYMLINK_OPEN_CODES = /* @__PURE__ */ new Set([
	"ELOOP",
	"EINVAL",
	"ENOTSUP"
]);
const POSIX_SEPARATOR_CHAR_CODE = 47;
function normalizeWindowsPathForComparison(input) {
	let normalized = path.win32.normalize(input);
	if (normalized.startsWith("\\\\?\\")) {
		normalized = normalized.slice(4);
		if (normalized.toUpperCase().startsWith("UNC\\")) normalized = `\\\\${normalized.slice(4)}`;
	}
	return normalized.replaceAll("/", "\\").toLowerCase();
}
function resolveWindowsPathForComparison(input) {
	const resolved = path.win32.resolve(input);
	return resolved[1] === ":" && path.win32.isAbsolute(resolved) ? resolved.toLowerCase() : normalizeWindowsPathForComparison(resolved.length === 6 ? resolvePathPreservingWindowsRoot(input) : resolved);
}
function isNodeError(value) {
	return Boolean(value && typeof value === "object" && "code" in value);
}
function assertNoNulPathInput(filePath, message = "path contains a NUL byte") {
	if (filePath.includes("\0")) throw new FsSafeError("invalid-path", message);
}
function isNotFoundPathError(value) {
	return isNodeError(value) && typeof value.code === "string" && NOT_FOUND_CODES.has(value.code);
}
function isSymlinkOpenError(value) {
	return isNodeError(value) && typeof value.code === "string" && SYMLINK_OPEN_CODES.has(value.code);
}
function isPathInside(root, target) {
	if (process.platform === "win32") {
		const rootForCompare = resolveWindowsPathForComparison(root);
		const targetForCompare = resolveWindowsPathForComparison(target);
		if (rootForCompare[1] === ":" && path.win32.isAbsolute(rootForCompare) && !targetForCompare.includes(":", 2) && (targetForCompare === rootForCompare || targetForCompare.startsWith(rootForCompare) && (rootForCompare.endsWith("\\") || targetForCompare[rootForCompare.length] === "\\"))) return true;
		const relative = path.win32.relative(rootForCompare, targetForCompare);
		const firstSegment = relative.split(path.win32.sep)[0];
		return relative === "" || firstSegment !== ".." && !path.win32.isAbsolute(relative);
	}
	if (root.length > 0 && root.charCodeAt(0) === POSIX_SEPARATOR_CHAR_CODE && target.length >= root.length && target.charCodeAt(0) === POSIX_SEPARATOR_CHAR_CODE && !target.includes("/..") && (target === root || target.startsWith(root) && (root.charCodeAt(root.length - 1) === POSIX_SEPARATOR_CHAR_CODE || target.charCodeAt(root.length) === POSIX_SEPARATOR_CHAR_CODE))) return true;
	const resolvedRoot = path.resolve(root);
	const resolvedTarget = path.resolve(target);
	const relative = path.relative(resolvedRoot, resolvedTarget);
	const firstSegment = relative.split(path.posix.sep)[0];
	return relative === "" || firstSegment !== ".." && !path.isAbsolute(relative);
}
function isPathRelativeEscape(relativePath) {
	return relativePath === ".." || relativePath.startsWith(`..${path.sep}`) || path.isAbsolute(relativePath);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.18.1/node_modules/@openclaw/fs-safe/dist/read-open-flags.js
function resolveReadOpenFlags(options) {
	const constants = options?.constants ?? fs.constants;
	const noFollow = process.platform !== "win32" && options?.followSymlinks !== true && typeof constants.O_NOFOLLOW === "number" ? constants.O_NOFOLLOW : 0;
	const nonBlocking = process.platform !== "win32" && typeof constants.O_NONBLOCK === "number" ? constants.O_NONBLOCK : 0;
	return constants.O_RDONLY | noFollow | nonBlocking;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.18.1/node_modules/@openclaw/fs-safe/dist/error-detail.js
const UNSAFE_ERROR_DETAIL_CHARACTERS = /[\u0000-\u001f\u007f-\u009f\u2028\u2029]/gu;
function formatErrorDetail(value) {
	return value.replace(UNSAFE_ERROR_DETAIL_CHARACTERS, (character) => `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`);
}
function shortPath(value) {
	const home = os.homedir();
	const prefix = home.endsWith(path.sep) ? home : `${home}${path.sep}`;
	return formatErrorDetail(value === home ? "~" : value.startsWith(prefix) ? `~${path.sep}${value.slice(prefix.length)}` : value);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.18.1/node_modules/@openclaw/fs-safe/dist/root-path-errors.js
const rootPathEscapeErrors = /* @__PURE__ */ new WeakSet();
function rootPathEscapeError(message) {
	const error = new Error(message);
	rootPathEscapeErrors.add(error);
	return error;
}
function sanitizeRootPathError(error) {
	if (error instanceof Error) error.message = formatErrorDetail(error.message);
	return error;
}
function pathEscapeError(params) {
	return rootPathEscapeError(`Path escapes ${params.boundaryLabel} (${shortPath(params.rootPath)}): ${shortPath(params.absolutePath)}`);
}
function symlinkEscapeError(params) {
	return rootPathEscapeError(`Symlink escapes ${params.boundaryLabel} (${shortPath(params.rootCanonicalPath)}): ${shortPath(params.symlinkPath)}`);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.18.1/node_modules/@openclaw/fs-safe/dist/native-directory-observation.js
function validateNativeDirectoryObservation(observation) {
	if (!observation || typeof observation.dev !== "bigint" || observation.dev < 0n || typeof observation.ino !== "bigint" || observation.ino < 0n || typeof observation.realPath !== "string" || observation.realPath.includes("\0") || !path.isAbsolute(observation.realPath) && !path.win32.isAbsolute(observation.realPath)) throw new FsSafeError("path-mismatch", "native directory observation is invalid");
	return observation;
}
/** Exact identity, type, and canonical path captured from one retained handle. */
function inspectNativeDirectoryObservation(backend, pathname, expected, platform = process.platform) {
	return inspectFileIdentitySync(() => validateNativeDirectoryObservation(backend.observeDirectory(pathname)), expected, platform);
}
function extendNativeDirectoryObservationGuard(observation, dir) {
	const guard = observation;
	guard.dir = dir;
	guard.identity = guard;
	guard.nativeDirectoryObservation = true;
	return guard;
}
function isNativeDirectoryObservationGuard(guard) {
	return typeof guard === "object" && guard !== null && guard.nativeDirectoryObservation === true;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.18.1/node_modules/@openclaw/fs-safe/dist/root-errors.js
function directoryComponentNotDirectoryError(cause) {
	return cause === void 0 ? new FsSafeError("not-file", "directory component must be a directory") : new FsSafeError("not-file", "directory component must be a directory", { cause });
}
function hardlinkedPathNotAllowedError() {
	return new FsSafeError("hardlink", "hardlinked path not allowed");
}
/** Existing boundaries retain only Error instances as their cause. */
function errorCauseOptions(error) {
	return { cause: error instanceof Error ? error : void 0 };
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.18.1/node_modules/@openclaw/fs-safe/dist/directory-entry-path.js
/** Strip only trailing separators: lstat must inspect the entry, not follow a leaf link. */
function directoryEntryPath(dir, platform = process.platform) {
	const windows = platform === "win32";
	if (typeof dir === "string") {
		const last = dir[dir.length - 1];
		if (last !== "/" && (!windows || last !== "\\")) return dir;
	}
	let rootLength = (windows ? path.win32 : path.posix).parse(dir).root.length;
	if (windows && /^[\\/]{2}[?.][\\/]UNC[\\/]/i.test(dir)) {
		const uncRoot = path.win32.parse(`\\\\${dir.slice(8)}`).root;
		if (uncRoot.length > 1) rootLength = Math.max(rootLength, uncRoot.length + 6);
	}
	let end = dir.length;
	while (end > rootLength && (dir[end - 1] === "/" || windows && dir[end - 1] === "\\")) end--;
	return end === rootLength || end === dir.length ? dir : dir.slice(0, end);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.18.1/node_modules/@openclaw/fs-safe/dist/stat-observation.js
function identityMismatch() {
	const error = new FsSafeError("path-mismatch", "file identity changed or could not be verified");
	recordFileObservationFailure(error, "identity");
	throw error;
}
function safeNumber(value) {
	return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}
function safeExpected(identity) {
	return typeof identity.dev === "bigint" && typeof identity.ino === "bigint" && identity.dev >= 0n && identity.ino >= 0n && identity.dev <= 9007199254740991n && identity.ino <= 9007199254740991n;
}
function observeStatSync(inspect, expected, initial, platform = process.platform, captureIdentity) {
	if (platform === "win32" || !initial && expected && !safeExpected(expected)) {
		const stat = inspectFileIdentitySync(() => {
			const current = initial;
			initial = void 0;
			return current ?? inspect(true);
		}, expected, platform);
		return captureIdentity ? {
			stat,
			identity: expected ?? {
				dev: stat.dev,
				ino: stat.ino
			}
		} : stat;
	}
	const stat = initial ?? inspect(false);
	const { dev: rawDev, ino: rawIno } = stat;
	const numericDev = safeNumber(rawDev);
	const numericIno = safeNumber(rawIno);
	const dev = numericDev ? BigInt(rawDev) : typeof rawDev === "bigint" ? rawDev : void 0;
	const ino = numericIno ? BigInt(rawIno) : typeof rawIno === "bigint" ? rawIno : void 0;
	if (expected && (dev !== void 0 && dev !== expected.dev || ino !== void 0 && ino !== expected.ino)) identityMismatch();
	if (numericDev && numericIno) return captureIdentity ? {
		stat,
		identity: expected ?? {
			dev,
			ino
		}
	} : stat;
	const exact = inspectFileIdentitySync(() => {
		const current = inspect(true);
		if (dev !== void 0 && current.dev !== dev || ino !== void 0 && current.ino !== ino) identityMismatch();
		return current;
	}, expected, platform);
	return captureIdentity ? {
		stat: exact,
		identity: expected ?? {
			dev: exact.dev,
			ino: exact.ino
		}
	} : exact;
}
/** Operation-local metadata plus exact identity; never use projected PathStat IDs. */
function inspectStatObservationSync(inspect, expected, initial, platform = process.platform) {
	return observeStatSync(inspect, expected, initial, platform, true);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.18.1/node_modules/@openclaw/fs-safe/dist/directory-guard.js
function directoryOperationPath(dir) {
	assertNoWindowsPathAlias(dir, "filesystem");
	return pathForWindowsFilesystem(directoryEntryPath(dir));
}
function inspectDirectoryIdentitySync(dir, expected, initial, platform = process.platform) {
	return inspectDirectoryIdentityAtPathSync(directoryOperationPath(dir), expected === void 0 ? void 0 : {
		dev: expected.dev,
		ino: expected.ino
	}, initial, platform);
}
function inspectDirectoryIdentityAtPathSync(operationPath, expected, initial, platform = process.platform) {
	return inspectFileIdentitySync(() => {
		const stat = initial ?? fs.lstatSync(operationPath, { bigint: true });
		initial = void 0;
		if (stat.isSymbolicLink() || !stat.isDirectory()) throw directoryComponentNotDirectoryError();
		return stat;
	}, expected, platform);
}
function extendDirectoryObservationGuard(observation, dir, realPath) {
	const guard = observation;
	guard.dir = dir;
	guard.realPath = realPath;
	return guard;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.18.1/node_modules/@openclaw/fs-safe/dist/root-boundary.js
function windowsComparablePath(value, normalize) {
	const original = normalize ? path.win32.normalize(value.replaceAll("/", "\\")) : value.replaceAll("/", "\\");
	if (/^\\\\\?\\UNC\\/i.test(original)) return {
		original,
		comparison: `\\\\${original.slice(8)}`,
		originalIndex: (comparisonIndex) => comparisonIndex + 6
	};
	if (original.startsWith("\\\\?\\")) return {
		original,
		comparison: original.slice(4),
		originalIndex: (comparisonIndex) => comparisonIndex + 4
	};
	return {
		original,
		comparison: original,
		originalIndex: (comparisonIndex) => comparisonIndex
	};
}
function trimWindowsTrailingSeparators(value) {
	const rootLength = path.win32.parse(value).root.length;
	let end = value.length;
	while (end > rootLength && value[end - 1] === "\\") end -= 1;
	return value.slice(0, end);
}
function trimWindowsLeadingSeparators(value) {
	let start = 0;
	while (value[start] === "\\") start += 1;
	return value.slice(start);
}
function exactWindowsRootPrefix(rootPath, candidatePath) {
	const root = trimWindowsTrailingSeparators(rootPath.replaceAll("/", "\\"));
	const candidate = candidatePath.replaceAll("/", "\\");
	let relativePath;
	if (candidate === root) relativePath = "";
	else {
		const rootWithSep = root.endsWith("\\") ? root : `${root}\\`;
		if (!candidate.startsWith(rootWithSep)) return void 0;
		relativePath = trimWindowsLeadingSeparators(candidate.slice(rootWithSep.length));
	}
	return {
		admission: "exact",
		candidateRootPath: root,
		path: relativePath === "" ? root : `${root}${root.endsWith("\\") ? "" : "\\"}${relativePath}`,
		relativePath
	};
}
function windowsRootPrefix(rootPath, candidatePath) {
	const exact = exactWindowsRootPrefix(rootPath, candidatePath);
	if (exact) return exact;
	const trusted = windowsComparablePath(rootPath, true);
	const supplied = windowsComparablePath(candidatePath, false);
	const root = trimWindowsTrailingSeparators(trusted.original);
	const rootComparison = trimWindowsTrailingSeparators(trusted.comparison);
	const candidate = supplied.comparison;
	if (!path.win32.isAbsolute(supplied.original)) return void 0;
	let relativePath;
	let candidateRootPath;
	let admission;
	if (candidate === rootComparison) {
		relativePath = "";
		candidateRootPath = supplied.original;
		admission = "exact";
	} else if (candidate.toLowerCase() === rootComparison.toLowerCase()) {
		relativePath = "";
		candidateRootPath = supplied.original;
		admission = "identity";
	} else {
		const rootWithSep = rootComparison.endsWith("\\") ? rootComparison : `${rootComparison}\\`;
		const candidatePrefix = candidate.slice(0, rootWithSep.length);
		if (candidatePrefix === rootWithSep) admission = "exact";
		else if (candidatePrefix.toLowerCase() === rootWithSep.toLowerCase()) admission = "identity";
		else return;
		relativePath = trimWindowsLeadingSeparators(candidate.slice(rootWithSep.length));
		candidateRootPath = supplied.original.slice(0, supplied.originalIndex(rootComparison.length));
	}
	const rebasedPath = relativePath === "" ? root : `${root}${root.endsWith("\\") ? "" : "\\"}${relativePath}`;
	return {
		candidateRootPath,
		path: rebasedPath,
		relativePath,
		admission
	};
}
function exactRootIdentity(rootPath, expected) {
	if (typeof expected?.dev === "bigint" && typeof expected.ino === "bigint") return {
		dev: expected.dev,
		ino: expected.ino
	};
	const observed = inspectDirectoryIdentitySync(rootPath);
	return {
		dev: observed.dev,
		ino: observed.ino
	};
}
/**
* Admit a path at a trusted directory boundary.
*
* On Windows, an exact structural prefix is allocation-only and performs no
* filesystem observation. A match which depends on case folding is accepted
* only when the candidate prefix names the exact trusted root object. Accepted
* paths are always returned under the trusted root spelling.
*/
function admitPathInsideRoot(params) {
	if (process.platform !== "win32" || path.sep === "/" && params.rootPath.startsWith("/") && params.rootPath[1] !== "/" && params.rootPath[1] !== "\\") {
		if (params.rootPath.startsWith("/") && params.candidatePath.startsWith("/") && !params.candidatePath.includes("/..") && (params.candidatePath === params.rootPath || params.candidatePath.startsWith(params.rootPath) && (params.rootPath.endsWith("/") || params.candidatePath[params.rootPath.length] === "/"))) {
			const relativeStart = params.rootPath.endsWith("/") ? params.rootPath.length : params.rootPath.length + 1;
			return {
				admission: "exact",
				path: params.candidatePath,
				relativePath: params.candidatePath === params.rootPath ? "" : params.candidatePath.slice(relativeStart)
			};
		}
		const root = path.resolve(params.rootPath);
		const candidate = path.resolve(params.candidatePath);
		const relativePath = path.relative(root, candidate);
		if (isPathRelativeEscape(relativePath)) return void 0;
		return {
			path: candidate,
			relativePath: relativePath === "." ? "" : relativePath,
			admission: "exact"
		};
	}
	const match = windowsRootPrefix(params.rootPath, params.candidatePath);
	if (!match) return void 0;
	const admitted = () => ({
		admission: match.admission,
		path: match.path,
		relativePath: match.relativePath
	});
	if (match.admission === "exact") return admitted();
	const cached = params.identityCache?.get(match.candidateRootPath);
	if (cached !== void 0) return cached ? admitted() : void 0;
	try {
		const expected = exactRootIdentity(params.rootPath, params.rootIdentity);
		const candidateRootPath = params.resolveCandidateRoot ? realpathSync.native(match.candidateRootPath) : match.candidateRootPath;
		if (params.inspectCandidateRoot) params.inspectCandidateRoot(candidateRootPath, expected);
		else inspectDirectoryIdentitySync(candidateRootPath, expected);
		params.identityCache?.set(match.candidateRootPath, true);
		return admitted();
	} catch {
		params.identityCache?.set(match.candidateRootPath, false);
		return;
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.18.1/node_modules/@openclaw/fs-safe/dist/root-path-existing.js
function absolutePathWithRawSegments(candidate) {
	if (path.sep !== "\\") {
		if (path.isAbsolute(candidate)) return candidate;
		const base = process.cwd();
		return `${base}${base.endsWith(path.sep) ? "" : path.sep}${candidate}`;
	}
	const raw = path.sep === "\\" ? candidate.replaceAll("/", "\\") : candidate;
	const absolute = path.isAbsolute(raw);
	if (absolute && raw[0] !== "\\") return raw;
	const drive = path.parse(raw).root;
	if (absolute && drive !== "\\") return raw;
	const base = drive ? path.resolve(drive) : process.cwd();
	return `${base}${base.endsWith(path.sep) ? "" : path.sep}${raw.slice(drive.length)}`;
}
function rawPathRelativeToCanonicalRoot(candidate, rootCanonicalPath, options = {}) {
	assertNoWindowsPathAlias(candidate);
	assertNoWindowsPathAlias(rootCanonicalPath);
	const absolute = absolutePathWithRawSegments(candidate);
	const raw = process.platform === "win32" ? absolute.replaceAll("/", path.sep) : absolute;
	const filesystemRoot = path.parse(raw).root;
	const segments = raw.slice(filesystemRoot.length).split(path.sep);
	const finalComponentIndex = segments.findLastIndex((segment) => segment !== "" && segment !== ".");
	let prefix = filesystemRoot;
	let traversedSymlink = false;
	const identityCache = process.platform === "win32" ? /* @__PURE__ */ new Map() : void 0;
	for (let index = 0; index < segments.length; index += 1) {
		prefix += `${prefix.endsWith(path.sep) ? "" : path.sep}${segments[index]}`;
		let canonical;
		let isSymlink = false;
		try {
			const operationPath = pathForWindowsFilesystem(prefix);
			const stat = fs.lstatSync(operationPath);
			isSymlink = stat.isSymbolicLink();
			if (isSymlink && options.rejectFinalSymlink && index === finalComponentIndex) throw new FsSafeError("symlink", "final symlink not allowed");
			if (!isSymlink && !stat.isDirectory() && index < segments.length - 1) return void 0;
			traversedSymlink ||= isSymlink;
			canonical = realpathSync.native(operationPath);
			assertNoWindowsPathAlias(canonical);
			if (isSymlink && index < segments.length - 1 && !fs.statSync(pathForWindowsFilesystem(canonical)).isDirectory()) return void 0;
			if (isSymlink && !isPathInside(rootCanonicalPath, canonical) && !isPathInside(canonical, rootCanonicalPath)) throw new FsSafeError("outside-workspace", `symlink prefix resolves outside the root ancestry: ${formatErrorDetail(candidate)}`);
		} catch (error) {
			if (error instanceof FsSafeError) throw error;
			if (isSymlink) return void 0;
			continue;
		}
		const admitted = admitPathInsideRoot({
			rootPath: rootCanonicalPath,
			candidatePath: canonical,
			rootIdentity: options.rootIdentity,
			identityCache
		});
		if (!admitted) continue;
		if (options.rejectSymlinks && traversedSymlink) throw new FsSafeError("symlink", "symlink path component not allowed");
		return [admitted.relativePath, ...segments.slice(index + 1)].filter(Boolean).join(path.sep);
	}
}
function pathExists(targetPath) {
	try {
		return fs.lstatSync(pathForWindowsFilesystem(targetPath), { throwIfNoEntry: false }) !== void 0;
	} catch (error) {
		if (isNotFoundPathError(error)) return false;
		throw error;
	}
}
function pathExistsSync(targetPath) {
	return fs.existsSync(pathForWindowsFilesystem(targetPath));
}
function resolveExistingAncestor(targetPath, mode) {
	const exists = mode === "native" ? pathExists : pathExistsSync;
	const canonicalize = mode === "native" ? realpathSync.native : realpathSync;
	assertNoWindowsPathAlias(targetPath);
	const normalized = resolvePathPreservingWindowsRoot(targetPath);
	assertNoWindowsPathAlias(normalized);
	let cursor = normalized;
	const filesystemRoot = path.parse(normalized).root;
	while (cursor !== filesystemRoot && !exists(cursor)) cursor = path.dirname(cursor);
	if (!exists(cursor)) return normalized;
	let rawResolvedAncestor;
	try {
		rawResolvedAncestor = canonicalize(pathForWindowsFilesystem(cursor));
	} catch {
		return normalized;
	}
	assertNoWindowsPathAlias(rawResolvedAncestor);
	const resolvedAncestor = resolvePathPreservingWindowsRoot(rawResolvedAncestor);
	assertNoWindowsPathAlias(resolvedAncestor);
	const resolved = cursor === normalized ? resolvedAncestor : path.resolve(resolvedAncestor, `.${path.sep}${normalized.slice(cursor.length)}`);
	assertNoWindowsPathAlias(resolved);
	return resolved;
}
function resolveSymlinkHopPath(symlinkPath, mode, rejectUnresolved) {
	try {
		const rawRealPath = (mode === "native" ? realpathSync.native : realpathSync)(symlinkPath);
		assertNoWindowsPathAlias(rawRealPath, "filesystem", "resolved symlink path uses a Windows filesystem namespace alias");
		const realPath = resolvePathPreservingWindowsRoot(rawRealPath);
		assertNoWindowsPathAlias(realPath, "filesystem", "resolved symlink path uses a Windows filesystem namespace alias");
		return realPath;
	} catch (error) {
		if (isSymlinkOpenError(error) || rejectUnresolved && isNotFoundPathError(error)) throw new FsSafeError("symlink", "symlink path could not be resolved", errorCauseOptions(error));
		if (!isNotFoundPathError(error)) throw error;
		const linkTarget = fs.readlinkSync(symlinkPath);
		assertNoWindowsPathAlias(linkTarget, "filesystem", "symlink target uses a Windows filesystem namespace alias");
		const resolved = resolveExistingAncestor(resolvePathFromBasePreservingWindowsRoot(resolvePathPreservingWindowsRoot(path.dirname(symlinkPath)), linkTarget), mode);
		assertNoWindowsPathAlias(resolved, "filesystem", "resolved symlink path uses a Windows filesystem namespace alias");
		return resolved;
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.18.1/node_modules/@openclaw/fs-safe/dist/root-path-observation.js
var RootPathObservationError = class extends Error {
	error;
	parentReceipt;
	traversalFailure;
	constructor(error, parentReceipt, traversalFailure = false) {
		super("root path observation failed", { cause: error });
		this.error = error;
		this.parentReceipt = parentReceipt;
		this.traversalFailure = traversalFailure;
		this.name = "RootPathObservationError";
	}
};
function straightTraversalPath(value) {
	if (value.length === 0) return false;
	const windows = process.platform === "win32";
	let segmentStart = 0;
	for (let index = 0; index <= value.length; index += 1) {
		if (!(index === value.length || value[index] === "/" || windows && value[index] === "\\")) continue;
		const segmentLength = index - segmentStart;
		if (segmentLength === 0 || segmentLength === 1 && value.charCodeAt(segmentStart) === 46 || segmentLength === 2 && value.charCodeAt(segmentStart) === 46 && value.charCodeAt(segmentStart + 1) === 46) return false;
		segmentStart = index + 1;
	}
	return true;
}
function createRootPathTraversalObservation(context, request) {
	const { state } = context;
	const rootTraversal = state.finalComponentIndex < 0 && (state.relativePath === "" || state.relativePath === ".");
	if (!request || !context.observationEligible || request.rootGuard.dir !== context.rootCanonicalPath || request.rootGuard.realPath !== context.rootCanonicalPath || context.rootPath !== context.rootCanonicalPath || !rootTraversal && !straightTraversalPath(state.relativePath) || !rootTraversal && state.finalComponentIndex !== state.segments.length - 1) return void 0;
	if (state.finalComponentIndex >= 0) {
		const directoryIndex = request.kind === "stat" ? state.finalComponentIndex - 1 : state.finalComponentIndex;
		return {
			enabled: true,
			request,
			targetIndex: state.finalComponentIndex,
			directoryIndex,
			directoryGuard: directoryIndex < 0 ? request.rootGuard : void 0,
			directoryObserver: directoryIndex < 0 ? void 0 : request.directoryObserver
		};
	}
	if (!rootTraversal) return void 0;
	let directoryGuard = request.rootGuard;
	let directoryObserver = request.kind === "stat" ? void 0 : request.directoryObserver;
	if (request.kind === "directory") {
		if (directoryObserver) try {
			const observed = inspectNativeDirectoryObservation(directoryObserver, request.rootGuard.dir, request.rootGuard.identity);
			const admitted = admitPathInsideRoot({
				rootPath: context.rootCanonicalPath,
				candidatePath: observed.realPath,
				rootIdentity: context.resolveParams.rootIdentity
			});
			if (!admitted || admitted.relativePath !== "") throw new FsSafeError("path-mismatch", "root path changed during operation");
			observed.realPath = admitted.path;
			directoryGuard = extendNativeDirectoryObservationGuard(observed, request.rootGuard.dir);
		} catch (error) {
			if (error instanceof FsSafeError && error.code === "path-mismatch") throw new RootPathObservationError(error);
			directoryObserver = void 0;
		}
		if (!directoryObserver) try {
			const admitted = admitPathInsideRoot({
				rootPath: context.rootCanonicalPath,
				candidatePath: realpathSync.native(request.rootGuard.dir),
				rootIdentity: context.resolveParams.rootIdentity
			});
			if (!admitted || admitted.relativePath !== "") throw new FsSafeError("path-mismatch", "root path changed during operation");
		} catch (error) {
			throw new RootPathObservationError(error);
		}
	}
	return {
		enabled: true,
		request,
		targetIndex: -1,
		directoryIndex: -1,
		directoryGuard,
		directoryObserver,
		targetPath: context.rootCanonicalPath,
		target: directoryGuard
	};
}
function inspectRootPathTraversalEntry(pathname, directorySlot, observation) {
	if (directorySlot && observation.directoryObserver) try {
		return extendNativeDirectoryObservationGuard(inspectNativeDirectoryObservation(observation.directoryObserver, pathname), pathname);
	} catch {
		observation.directoryObserver = void 0;
	}
	const first = process.platform === "win32" ? fs.lstatSync(pathname, { bigint: true }) : fs.lstatSync(pathname);
	if (first.isSymbolicLink() || directorySlot && !first.isDirectory()) return { stat: first };
	try {
		return inspectStatObservationSync((bigint) => bigint ? fs.lstatSync(pathname, { bigint: true }) : fs.lstatSync(pathname), void 0, first);
	} catch (error) {
		if (error instanceof FsSafeError && error.code === "path-mismatch") throw new RootPathObservationError(error);
		throw error;
	}
}
function captureRootPathObservedDirectory(observation, observed, publicPath, canonicalPath, rootCanonicalPath, rootIdentity) {
	if (!isNativeDirectoryObservationGuard(observed) && !observed.stat.isDirectory()) return false;
	let realPath;
	try {
		realPath = isNativeDirectoryObservationGuard(observed) ? observed.realPath : realpathSync.native(canonicalPath);
	} catch (error) {
		throw new RootPathObservationError(error);
	}
	const admitted = admitPathInsideRoot({
		rootPath: rootCanonicalPath,
		candidatePath: realPath,
		rootIdentity
	});
	if (!admitted) throw new RootPathObservationError(new FsSafeError("outside-workspace", "directory is outside workspace root"));
	if (isNativeDirectoryObservationGuard(observed)) {
		observed.dir = publicPath;
		observed.realPath = admitted.path;
		observation.directoryGuard = observed;
	} else observation.directoryGuard = extendDirectoryObservationGuard(observed, publicPath, admitted.path);
	return true;
}
Object.freeze({
	allowFinalSymlinkForUnlink: false,
	allowFinalHardlinkForUnlink: false
}), Object.freeze({
	allowFinalSymlinkForUnlink: true,
	allowFinalHardlinkForUnlink: true
});
function resolveRootPathSyncWithCanonicalRootObservation(params, observeRoot) {
	return resolveRootPathInternal(params, {
		mode: "ordinary",
		observeRoot
	});
}
function resolveRootPathInternal(params, options = {}) {
	try {
		return traverseRootPath(params, options);
	} catch (error) {
		throw sanitizeRootPathError(error);
	}
}
function prepareRootTraversal(params, rootPath, rootCanonicalPath, absolutePath, rawAbsolutePath) {
	let raw = rawAbsolutePath;
	let trustedAbsolutePath = false;
	const direct = admitRawPathInsideRoot(rootPath, raw, params.rootIdentity);
	if (direct) {
		raw = direct.path;
		trustedAbsolutePath = direct.admission === "identity";
	} else {
		const canonical = admitRawPathInsideRoot(rootCanonicalPath, raw, params.rootIdentity);
		const relative = canonical?.relativePath ?? rawPathRelativeToCanonicalRoot(raw, rootCanonicalPath, params);
		if (relative === void 0) throw pathEscapeError({
			rootPath,
			absolutePath: raw,
			boundaryLabel: params.boundaryLabel
		});
		trustedAbsolutePath = canonical?.admission === "identity";
		raw = relative === "" ? rootPath : `${rootPath}${path.sep}${relative}`;
	}
	return {
		params,
		rawAbsolutePath: raw,
		rootPath,
		rootCanonicalPath,
		absolutePath: trustedAbsolutePath ? resolvePathPreservingWindowsRoot(raw) : absolutePath,
		observationEligible: raw === rawAbsolutePath && !trustedAbsolutePath
	};
}
function captureValidRootPathInputs(params) {
	const rootPath = params.rootPath;
	assertNoNulPathInput(rootPath, "root path contains a NUL byte");
	const absolutePath = params.absolutePath;
	assertNoNulPathInput(absolutePath, "absolute path contains a NUL byte");
	assertNoWindowsPathAlias(rootPath, "filesystem", "root path uses a Windows filesystem namespace alias");
	assertNoWindowsPathAlias(absolutePath, "filesystem", "absolute path uses a Windows filesystem namespace alias");
	assertNoEmbeddedDriveRelativeSegment(rootPath, "root path");
	assertNoEmbeddedDriveRelativeSegment(absolutePath, "absolute path");
	const rootCanonicalPath = params.rootCanonicalPath;
	if (rootCanonicalPath !== void 0) {
		assertNoNulPathInput(rootCanonicalPath, "canonical root path contains a NUL byte");
		assertNoWindowsPathAlias(rootCanonicalPath, "filesystem", "canonical root path uses a Windows filesystem namespace alias");
		assertNoEmbeddedDriveRelativeSegment(rootCanonicalPath, "canonical root path");
	}
	const policy = params.policy;
	const rootIdentity = params.rootIdentity;
	return {
		rootPath,
		absolutePath,
		rootCanonicalPath,
		rootIdentity: rootIdentity == null ? void 0 : {
			dev: rootIdentity.dev,
			ino: rootIdentity.ino
		},
		boundaryLabel: params.boundaryLabel,
		policy: policy == null ? void 0 : { allowFinalSymlinkForUnlink: policy.allowFinalSymlinkForUnlink },
		rejectSymlinks: params.rejectSymlinks,
		rejectFinalSymlink: params.rejectFinalSymlink,
		rejectUnresolvedSymlinks: params.rejectUnresolvedSymlinks
	};
}
function assertNoEmbeddedDriveRelativeSegment(filePath, label) {
	if (process.platform !== "win32") return;
	const root = path.parse(filePath).root;
	assertNoDriveRelativePathSegments(filePath.slice(root.length).replaceAll("\\", "/"), label);
}
function createLexicalTraversalContext(params) {
	const relative = admitRawPathInsideRoot(params.rootPath, params.rawAbsolutePath, params.params.rootIdentity)?.relativePath;
	if (relative === void 0) throw new Error("Path traversal must begin at the root");
	const segments = splitTraversalSegments(relative);
	return {
		state: {
			segments,
			relativePath: relative,
			reuseLexicalCanonical: false,
			finalComponentIndex: segments.findLastIndex((segment) => segment !== "."),
			allowFinalSymlink: params.params.policy?.allowFinalSymlinkForUnlink === true,
			canonicalCursor: params.rootCanonicalPath,
			lexicalCursor: params.rootPath,
			preserveFinalSymlink: false,
			missingDepth: 0
		},
		resolveParams: params.params,
		rootPath: params.rootPath,
		rootCanonicalPath: params.rootCanonicalPath,
		absolutePath: params.absolutePath,
		observationEligible: params.observationEligible
	};
}
function createLexicalTraversalObservation(context, request) {
	const observation = createRootPathTraversalObservation(context, request);
	if (observation && observation.targetIndex >= 0) context.state.reuseLexicalCanonical = true;
	return observation;
}
function splitTraversalSegments(value) {
	const segments = value.split(process.platform === "win32" ? /[\\/]+/ : /\/+/).filter(Boolean);
	if (value.endsWith("/") || process.platform === "win32" && value.endsWith("\\")) segments.push(".");
	return segments;
}
function admitRawPathInsideRoot(rootPath, candidatePath, rootIdentity) {
	if (!path.isAbsolute(candidatePath)) return;
	const root = rootPath;
	const candidate = process.platform === "win32" ? candidatePath.replaceAll("/", path.sep) : candidatePath;
	if (process.platform === "win32") return admitPathInsideRoot({
		rootPath: root,
		candidatePath: candidate,
		rootIdentity
	});
	if (candidate === root) return {
		admission: "exact",
		path: candidate,
		relativePath: ""
	};
	const rootWithSep = root.endsWith(path.sep) ? root : `${root}${path.sep}`;
	return candidate.slice(0, rootWithSep.length) === rootWithSep ? {
		admission: "exact",
		path: candidate,
		relativePath: candidate.slice(rootWithSep.length)
	} : void 0;
}
function assertLexicalCursorInsideBoundary(context, candidatePath) {
	return assertInsideBoundary({
		boundaryLabel: context.resolveParams.boundaryLabel,
		rootCanonicalPath: context.rootCanonicalPath,
		rootIdentity: context.resolveParams.rootIdentity,
		candidatePath,
		absolutePath: context.absolutePath
	});
}
function advanceCanonicalCursorForSegment(context, segment) {
	const candidatePath = context.state.reuseLexicalCanonical ? context.state.lexicalCursor : resolvePathFromBasePreservingWindowsRoot(context.state.canonicalCursor, segment);
	context.state.canonicalCursor = assertLexicalCursorInsideBoundary(context, candidatePath);
}
function disableLexicalTraversalObservation(context, observation) {
	observation.enabled = false;
	context.state.reuseLexicalCanonical = false;
}
function finalizeLexicalResolution(context, kind) {
	context.state.canonicalCursor = assertLexicalCursorInsideBoundary(context, context.state.canonicalCursor);
	return {
		absolutePath: context.absolutePath,
		canonicalPath: context.state.canonicalCursor,
		rootPath: context.rootPath,
		rootCanonicalPath: context.rootCanonicalPath,
		relativePath: relativeInsideRoot(context.rootCanonicalPath, context.state.canonicalCursor),
		exists: kind.exists,
		kind: kind.kind
	};
}
function applyResolvedSymlinkHop(context, linkCanonical) {
	let admitted;
	try {
		admitted = assertLexicalCursorInsideBoundary(context, linkCanonical);
	} catch {
		throw symlinkEscapeError({
			boundaryLabel: context.resolveParams.boundaryLabel,
			rootCanonicalPath: context.rootCanonicalPath,
			symlinkPath: context.state.lexicalCursor
		});
	}
	context.state.canonicalCursor = admitted;
	context.state.lexicalCursor = admitted;
}
function applyParentTraversalStep(context) {
	context.state.lexicalCursor = resolvePathFromBasePreservingWindowsRoot(context.state.lexicalCursor, "..");
	advanceCanonicalCursorForSegment(context, "..");
	if (context.state.missingDepth > 0) context.state.missingDepth -= 1;
}
function assertDirectoryBeforeMoreSegments(stat, pathname, isLast) {
	if (!isLast && !stat.isDirectory()) throw Object.assign(/* @__PURE__ */ new Error(`Path component is not a directory: ${pathname}`), { code: "ENOTDIR" });
}
function assertResolvedLinkDirectory(pathname, isLast) {
	if (isLast) return;
	assertDirectoryBeforeMoreSegments(fs.statSync(pathForWindowsFilesystem(pathname)), pathname, isLast);
}
function traverseRootPath(params, { mode = "native", observation: observationOutput, observeRoot, removalReceipts }) {
	const input = captureValidRootPathInputs(params);
	const rawAbsolutePath = absolutePathWithRawSegments(input.absolutePath);
	const rootPath = resolvePathPreservingWindowsRoot(input.rootPath);
	const absolutePath = resolvePathPreservingWindowsRoot(rawAbsolutePath);
	const rootCanonicalPath = input.rootCanonicalPath ? resolvePathPreservingWindowsRoot(input.rootCanonicalPath) : resolveExistingAncestor(rootPath, mode);
	assertNoWindowsPathAlias(rootPath);
	assertNoWindowsPathAlias(absolutePath);
	assertNoWindowsPathAlias(rootCanonicalPath);
	observeRoot?.(rootCanonicalPath);
	const context = createLexicalTraversalContext(prepareRootTraversal(input, rootPath, rootCanonicalPath, absolutePath, rawAbsolutePath));
	const { state } = context;
	const observation = createLexicalTraversalObservation(context, observationOutput?.request);
	for (let idx = 0; idx < state.segments.length; idx += 1) {
		const segment = state.segments[idx] ?? "";
		const isLast = idx === state.segments.length - 1;
		if (segment === ".") continue;
		if (segment === "..") {
			applyParentTraversalStep(context);
			continue;
		}
		state.lexicalCursor = path.join(state.lexicalCursor, segment);
		if (state.missingDepth > 0) {
			advanceCanonicalCursorForSegment(context, segment);
			state.missingDepth += 1;
			continue;
		}
		let stat;
		let observed;
		try {
			if (removalReceipts && !isLast) {
				const directoryStat = fs.lstatSync(pathForWindowsFilesystem(state.lexicalCursor), { bigint: true });
				if (directoryStat.isDirectory() && !directoryStat.isSymbolicLink()) removalReceipts.observeDirectory(state.lexicalCursor, directoryStat);
				stat = directoryStat;
			} else {
				const directorySlot = observation?.enabled === true && idx === observation.directoryIndex;
				const targetSlot = observation?.enabled === true && idx === observation.targetIndex;
				if (directorySlot || targetSlot) observed = inspectRootPathTraversalEntry(state.lexicalCursor, directorySlot, observation);
				stat = isNativeDirectoryObservationGuard(observed) ? void 0 : observed?.stat ?? fs.lstatSync(state.lexicalCursor);
			}
		} catch (error) {
			if (observation?.enabled && observation.request.kind === "stat" && idx === observation.targetIndex && observation.directoryGuard) {
				const parentReceipt = {
					kind: "stat-parent",
					rootGuard: observation.request.rootGuard,
					directoryGuard: observation.directoryGuard,
					directoryObserver: observation.directoryObserver,
					targetPath: state.lexicalCursor
				};
				throw new RootPathObservationError(error instanceof RootPathObservationError ? error.error : sanitizeRootPathError(error), parentReceipt, !(error instanceof RootPathObservationError));
			}
			if (!isNotFoundPathError(error)) throw error;
			advanceCanonicalCursorForSegment(context, segment);
			state.missingDepth = 1;
			continue;
		}
		if (isNativeDirectoryObservationGuard(observed)) {
			advanceCanonicalCursorForSegment(context, segment);
			captureRootPathObservedDirectory(observation, observed, state.lexicalCursor, state.canonicalCursor, context.rootCanonicalPath, context.resolveParams.rootIdentity);
			if (idx === observation.targetIndex) {
				observation.targetPath = state.canonicalCursor;
				observation.target = observed;
			}
			continue;
		}
		if (!stat) throw new Error("directory observation did not return metadata");
		const isSymbolicLink = stat.isSymbolicLink();
		if (!isSymbolicLink) assertDirectoryBeforeMoreSegments(stat, state.lexicalCursor, isLast);
		if (isSymbolicLink && (context.resolveParams.rejectFinalSymlink === true && idx === state.finalComponentIndex || context.resolveParams.rejectSymlinks === true && isLast)) throw new FsSafeError("symlink", "symlink path component not allowed");
		const preserveFinalSymlink = isSymbolicLink && state.allowFinalSymlink && isLast;
		if (!isSymbolicLink || preserveFinalSymlink) {
			state.preserveFinalSymlink = preserveFinalSymlink;
			advanceCanonicalCursorForSegment(context, segment);
			if (observation?.enabled && isSymbolicLink) disableLexicalTraversalObservation(context, observation);
			if (observation?.enabled && idx === observation.directoryIndex) {
				if (!(observed?.identity && captureRootPathObservedDirectory(observation, observed, state.canonicalCursor, state.canonicalCursor, context.rootCanonicalPath, context.resolveParams.rootIdentity))) disableLexicalTraversalObservation(context, observation);
			}
			if (observation?.enabled && idx === observation.targetIndex) {
				observation.targetPath = state.canonicalCursor;
				observation.target = observed?.identity ? observed : void 0;
			}
			if (state.preserveFinalSymlink) break;
			continue;
		}
		if (observation?.enabled) disableLexicalTraversalObservation(context, observation);
		const linkCanonical = resolveSymlinkHopPath(state.lexicalCursor, mode, context.resolveParams.rejectUnresolvedSymlinks);
		applyResolvedSymlinkHop(context, linkCanonical);
		if (context.resolveParams.rejectSymlinks === true) throw new FsSafeError("symlink", "symlink path component not allowed");
		assertResolvedLinkDirectory(linkCanonical, isLast);
	}
	const completeObservation = observation?.enabled === true && observation.directoryGuard !== void 0 && observation.targetPath === state.canonicalCursor && observation.target !== void 0;
	const kind = completeObservation ? {
		exists: true,
		kind: isNativeDirectoryObservationGuard(observation.target) ? "directory" : toResolvedKind(observation.target.stat)
	} : getPathKindSync(state.canonicalCursor, state.preserveFinalSymlink);
	if (completeObservation && observationOutput) observationOutput.receipt = {
		kind: observation.request.kind,
		rootGuard: observation.request.rootGuard,
		directoryGuard: observation.directoryGuard,
		directoryObserver: observation.directoryObserver,
		targetPath: observation.targetPath,
		target: observation.target
	};
	return finalizeLexicalResolution(context, kind);
}
function getPathKindSync(absolutePath, preserveFinalSymlink) {
	try {
		const operationPath = pathForWindowsFilesystem(absolutePath);
		return {
			exists: true,
			kind: toResolvedKind(preserveFinalSymlink ? fs.lstatSync(operationPath) : fs.statSync(operationPath))
		};
	} catch (error) {
		if (isNotFoundPathError(error)) return {
			exists: false,
			kind: "missing"
		};
		throw error;
	}
}
function toResolvedKind(stat) {
	if (stat.isFile()) return "file";
	if (stat.isDirectory()) return "directory";
	if (stat.isSymbolicLink()) return "symlink";
	return "other";
}
function relativeInsideRoot(rootPath, targetPath) {
	const relative = path.relative(resolvePathPreservingWindowsRoot(rootPath), resolvePathPreservingWindowsRoot(targetPath));
	if (!relative || relative === ".") return "";
	if (isPathRelativeEscape(relative)) return "";
	return relative;
}
function assertInsideBoundary(params) {
	const admitted = admitPathInsideRoot({
		rootPath: params.rootCanonicalPath,
		candidatePath: params.candidatePath,
		rootIdentity: params.rootIdentity
	});
	if (admitted) return admitted.path;
	throw new Error(`Path resolves outside ${params.boundaryLabel} (${shortPath(params.rootCanonicalPath)}): ${shortPath(params.absolutePath)}`);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.18.1/node_modules/@openclaw/fs-safe/dist/root-symlink-policy.js
function readSymlinkResolution(symlinks) {
	return {
		rejectSymlinks: symlinks !== "follow-within-root" && symlinks !== "follow-parents-within-root",
		rejectFinalSymlink: symlinks === "follow-parents-within-root"
	};
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.18.1/node_modules/@openclaw/fs-safe/dist/pinned-open.js
function isExpectedPathError$1(error) {
	const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "";
	return code === "ENOENT" || code === "ENOTDIR" || code === "ELOOP";
}
function openPinnedFileSync(params) {
	const filePath = params.filePath;
	const resolvedPath = params.resolvedPath;
	const ioFs = params.ioFs ?? fs;
	const allowedType = params.allowedType ?? "file";
	const rejectPathSymlink = params.rejectPathSymlink === true;
	const statPolicy = {
		rejectHardlinks: params.rejectHardlinks,
		maxBytes: params.maxBytes
	};
	const openReadFlags = resolveReadOpenFlags({ constants: ioFs.constants });
	let fd = null;
	try {
		assertNoWindowsPathAlias(filePath, "filesystem", "file path uses a Windows filesystem namespace alias");
		if (resolvedPath !== void 0) assertNoWindowsPathAlias(resolvedPath, "filesystem", "resolved path uses a Windows filesystem namespace alias");
		if (isUnsafeDeviceReadPath(filePath)) return {
			ok: false,
			reason: "validation"
		};
		if (rejectPathSymlink) {
			if (ioFs.lstatSync(filePath).isSymbolicLink()) return {
				ok: false,
				reason: "validation"
			};
		}
		const realPath = resolvedPath ?? (ioFs === fs ? realpathSync(filePath) : ioFs.realpathSync(filePath));
		assertNoWindowsPathAlias(realPath, "filesystem", "resolved path uses a Windows filesystem namespace alias");
		if (isUnsafeDeviceReadPath(realPath)) return {
			ok: false,
			reason: "validation"
		};
		const preOpenStat = inspectFileIdentitySync(() => {
			const stat = ioFs.lstatSync(realPath, { bigint: true });
			assertAllowedStat(stat, allowedType, statPolicy);
			return stat;
		});
		fd = ioFs.openSync(realPath, openReadFlags);
		const openedStat = ioFs.fstatSync(fd);
		const identity = inspectFileIdentitySync(() => {
			const stat = ioFs.fstatSync(fd, { bigint: true });
			assertAllowedStat(stat, allowedType, statPolicy);
			return stat;
		}, preOpenStat);
		const pathIdentity = inspectFileIdentitySync(() => {
			const stat = ioFs.lstatSync(realPath, { bigint: true });
			assertAllowedStat(stat, allowedType, statPolicy);
			return stat;
		}, identity);
		const opened = {
			ok: true,
			path: params.finalAdmission?.({
				path: realPath,
				preRealpathIdentity: pathIdentity,
				descriptorIdentity: identity
			}) ?? realPath,
			fd,
			stat: openedStat,
			identity
		};
		fd = null;
		return opened;
	} catch (error) {
		if (error instanceof FsSafeError) return {
			ok: false,
			reason: "validation",
			error
		};
		if (isExpectedPathError$1(error)) return {
			ok: false,
			reason: "path",
			error
		};
		return {
			ok: false,
			reason: "io",
			error
		};
	} finally {
		if (fd !== null) try {
			ioFs.closeSync(fd);
		} catch {}
	}
}
function assertAllowedStat(stat, allowedType, params) {
	if (stat.isSymbolicLink() || !(allowedType === "directory" ? stat.isDirectory() : stat.isFile())) throw new FsSafeError("not-file", "path does not have the required file type");
	if (params.rejectHardlinks && stat.isFile() && stat.nlink > 1n) throw new FsSafeError("hardlink", "path must not be hardlinked");
	if (params.maxBytes !== void 0 && stat.isFile() && stat.size > params.maxBytes) throw new FsSafeError("too-large", "file exceeds byte limit");
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.18.1/node_modules/@openclaw/fs-safe/dist/root-file-final-admission.js
function rootIdentityMismatch(cause) {
	return new FsSafeError("path-mismatch", "canonical root directory identity changed or could not be verified", cause === void 0 ? {} : { cause });
}
function isExpectedPathError(error) {
	const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "";
	return code === "ENOENT" || code === "ENOTDIR" || code === "ELOOP";
}
function inspectCanonicalRoot(ioFs, rootPath, expected) {
	try {
		assertNoWindowsPathAlias(rootPath);
		const operationPath = ioFs === fs ? pathForWindowsFilesystem(rootPath) : rootPath;
		return inspectFileIdentitySync(() => {
			const stat = ioFs.lstatSync(operationPath, { bigint: true });
			if (!stat.isDirectory() || stat.isSymbolicLink()) throw rootIdentityMismatch();
			return stat;
		}, expected);
	} catch (error) {
		if (expected && isExpectedPathError(error)) throw rootIdentityMismatch(error);
		throw error;
	}
}
function observeCanonicalRoot(ioFs, rootPath) {
	try {
		const stat = inspectCanonicalRoot(ioFs, rootPath);
		const identity = Object.freeze({
			dev: stat.dev,
			ino: stat.ino
		});
		let observedPath = rootPath;
		if (process.platform === "win32" && ioFs === fs) {
			observedPath = realpathSync.native(pathForWindowsFilesystem(rootPath));
			if (observedPath !== rootPath) inspectCanonicalRoot(ioFs, observedPath, identity);
		}
		return {
			ok: true,
			path: observedPath,
			identity
		};
	} catch (error) {
		return {
			ok: false,
			error
		};
	}
}
function resolveConsumedPath(ioFs, filePath) {
	return ioFs === fs ? realpathSync.native(filePath) : ioFs.realpathSync(filePath);
}
function createRootFileFinalAdmission(ioFs, root, boundaryLabel, rejectHardlinks = true) {
	const inspectRoot = (candidateRootPath, expected) => {
		inspectCanonicalRoot(ioFs, candidateRootPath, expected);
	};
	return ({ path: consumedPath, descriptorIdentity }) => {
		inspectCanonicalRoot(ioFs, root.path, root.identity);
		const canonicalPath = resolveConsumedPath(ioFs, consumedPath);
		assertNoWindowsPathAlias(canonicalPath, "filesystem", "resolved file path uses a Windows filesystem namespace alias");
		const admitted = admitPathInsideRoot({
			rootPath: root.path,
			candidatePath: canonicalPath,
			rootIdentity: root.identity,
			inspectCandidateRoot: inspectRoot
		});
		if (!admitted) throw new FsSafeError("outside-workspace", `resolved path escapes ${boundaryLabel}`);
		try {
			const current = inspectFileIdentitySync(() => ioFs.lstatSync(admitted.path, { bigint: true }), descriptorIdentity);
			if (rejectHardlinks && current.isFile() && current.nlink > 1n) throw hardlinkedPathNotAllowedError();
		} catch (error) {
			if (isExpectedPathError(error)) throw new FsSafeError("path-mismatch", "canonical file identity changed or could not be verified", { cause: error });
			throw error;
		}
		inspectCanonicalRoot(ioFs, root.path, root.identity);
		return admitted.path;
	};
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.18.1/node_modules/@openclaw/fs-safe/dist/root-file.js
function absoluteRootFilePath(filePath) {
	if (path.isAbsolute(filePath)) return filePath;
	const drive = path.parse(filePath).root;
	return `${drive ? path.resolve(drive) : process.cwd()}${path.sep}${filePath.slice(drive.length)}`;
}
function openRootFileSync(params) {
	const ioFs = params.ioFs ?? fs;
	const rawAbsolutePath = params.absolutePath;
	let resolved;
	try {
		const absolutePath = absoluteRootFilePath(rawAbsolutePath);
		assertNoWindowsPathAlias(absolutePath);
		const rootPath = params.rootPath;
		const rootRealPath = params.rootRealPath;
		const boundaryLabel = params.boundaryLabel;
		let rootObservation;
		resolved = mapResolvedRootPath(absolutePath, boundaryLabel, resolveRootPathSyncWithCanonicalRootObservation({
			absolutePath,
			rootPath,
			rootCanonicalPath: rootRealPath,
			boundaryLabel,
			...readSymlinkResolution(params.symlinks ?? (params.rejectSymlinks === false ? "follow-within-root" : "reject")),
			skipLexicalRootCheck: params.skipLexicalRootCheck
		}, (rootCanonicalPath) => {
			rootObservation = observeCanonicalRoot(ioFs, rootCanonicalPath);
		}), rootObservation);
	} catch (error) {
		resolved = toBoundaryValidationError(error);
	}
	return finalizeRootFileOpen({
		resolved,
		maxBytes: params.maxBytes,
		rejectHardlinks: params.rejectHardlinks,
		allowedType: params.allowedType,
		ioFs
	});
}
function openRootFileResolved(params) {
	const rejectHardlinks = params.rejectHardlinks ?? true;
	const opened = openPinnedFileSync({
		filePath: params.absolutePath,
		resolvedPath: params.resolvedPath,
		rejectHardlinks,
		maxBytes: params.maxBytes,
		allowedType: params.allowedType,
		ioFs: params.ioFs,
		finalAdmission: createRootFileFinalAdmission(params.ioFs, params.rootObservation, params.boundaryLabel, rejectHardlinks)
	});
	if (!opened.ok) return opened;
	return {
		ok: true,
		path: opened.path,
		fd: opened.fd,
		stat: opened.stat,
		rootRealPath: params.rootRealPath
	};
}
function finalizeRootFileOpen(params) {
	if ("ok" in params.resolved) return params.resolved;
	return openRootFileResolved({
		absolutePath: params.resolved.absolutePath,
		resolvedPath: params.resolved.resolvedPath,
		rootRealPath: params.resolved.rootRealPath,
		boundaryLabel: params.resolved.boundaryLabel,
		rootObservation: params.resolved.rootObservation,
		maxBytes: params.maxBytes,
		rejectHardlinks: params.rejectHardlinks,
		allowedType: params.allowedType,
		ioFs: params.ioFs
	});
}
function toBoundaryValidationError(error) {
	return {
		ok: false,
		reason: "validation",
		error
	};
}
function mapResolvedRootPath(absolutePath, boundaryLabel, resolved, rootObservation) {
	if (!rootObservation) return toBoundaryValidationError(new FsSafeError("path-mismatch", "canonical root identity was not observed"));
	if (!rootObservation.ok) return toRootObservationError(rootObservation.error);
	return {
		absolutePath,
		resolvedPath: resolved.canonicalPath,
		rootRealPath: rootObservation.path,
		boundaryLabel,
		rootObservation
	};
}
function toRootObservationError(error) {
	if (error instanceof FsSafeError) return toBoundaryValidationError(error);
	const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : "";
	if (code === "ENOENT" || code === "ENOTDIR" || code === "ELOOP") return {
		ok: false,
		reason: "path",
		error
	};
	return {
		ok: false,
		reason: "io",
		error
	};
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.18.1/node_modules/@openclaw/fs-safe/dist/json.js
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function resolveInvalidMessage(invalidMessage, relativePath) {
	if (typeof invalidMessage === "function") return invalidMessage(relativePath);
	return invalidMessage ?? `${relativePath} has an unexpected shape`;
}
function readRootStructuredFileSyncInternal(options, parser) {
	let absolutePath;
	let relativePath;
	let rootDir;
	let rootRealPath;
	try {
		rootDir = options.rootDir;
		relativePath = options.relativePath;
		rootRealPath = options.rootRealPath;
		assertNoWindowsPathAlias(rootDir);
		assertNoWindowsPathAlias(relativePath, "relative");
		if (rootRealPath !== void 0) assertNoWindowsPathAlias(rootRealPath);
		absolutePath = path.resolve(rootDir, relativePath);
		assertNoWindowsPathAlias(absolutePath);
	} catch (error) {
		return {
			ok: false,
			reason: "open",
			failure: {
				ok: false,
				reason: "validation",
				error
			}
		};
	}
	const boundaryLabel = options.boundaryLabel;
	const rejectHardlinks = options.rejectHardlinks;
	const maxBytes = options.maxBytes;
	const opened = openRootFileSync({
		absolutePath,
		rootPath: rootDir,
		rootRealPath,
		boundaryLabel,
		rejectHardlinks,
		maxBytes,
		allowedType: "file"
	});
	if (!opened.ok) return {
		ok: false,
		reason: "open",
		failure: opened
	};
	try {
		const raw = maxBytes === void 0 ? fs.readFileSync(opened.fd, "utf8") : readFileDescriptorBoundedSync(opened.fd, maxBytes).toString("utf8");
		const parse = parser.parse;
		const parsed = Reflect.apply(parse, parser, [raw]);
		const validate = parser.validate;
		if (validate && !Reflect.apply(validate, parser, [parsed])) return {
			ok: false,
			reason: "invalid",
			error: resolveInvalidMessage(parser.invalidMessage, relativePath)
		};
		return {
			ok: true,
			value: parsed,
			stat: opened.stat,
			path: opened.path,
			rootRealPath: opened.rootRealPath
		};
	} catch (error) {
		return {
			ok: false,
			reason: "parse",
			error: `failed to parse ${relativePath}: ${String(error)}`
		};
	} finally {
		fs.closeSync(opened.fd);
	}
}
function readRootJsonObjectSync(options) {
	return readRootStructuredFileSyncInternal(options, {
		parse: (raw) => JSON.parse(raw),
		validate: isRecord,
		invalidMessage: (relativePath) => `${relativePath} must contain a JSON object`
	});
}
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
//#region src/infra/runtime-process-url.ts
const sealedEntrypoints = /* @__PURE__ */ new Map();
function registerSealedRuntimeProcessEntrypoint(name, url) {
	sealedEntrypoints.set(name, url);
}
function resolveRuntimeProcessEntrypointUrl(name) {
	return sealedEntrypoints.get(name) ?? resolveRuntimeWorkerUrl(runtimeProcessEntrypoints[name]);
}
//#endregion
//#region packages/normalization-core/src/error-coercion.ts
function readProperty(value, key) {
	try {
		return value[key];
	} catch {
		return;
	}
}
function extractErrorCode(err) {
	if (!err || typeof err !== "object") return;
	const code = readProperty(err, "code");
	if (typeof code === "string") return code;
	if (typeof code === "number") return String(code);
}
//#endregion
//#region src/process/supervisor/service-child-group-ownership.ts
/** Only kernel absence, observed outside the owned group, confirms extinction. */
function isOwnedProcessGroupGone(pgid) {
	try {
		process.kill(-pgid, 0);
		return false;
	} catch (error) {
		const code = extractErrorCode(error);
		if (code === "ESRCH") return true;
		if (code === "EPERM") return false;
		throw error;
	}
}
//#endregion
//#region src/process/supervisor/service-child-stdio.ts
function setStdioEntry(stdio, fd, value) {
	while (stdio.length <= fd) stdio.push("ignore");
	stdio[fd] = value;
}
function reserveStdioEntry(stdio, value) {
	let fd = 3;
	while (stdio[fd] !== void 0 && stdio[fd] !== "ignore") fd += 1;
	setStdioEntry(stdio, fd, value);
	return fd;
}
//#endregion
//#region src/process/supervisor/service-child-relay.ts
registerSealedRuntimeProcessEntrypoint("serviceChildGroupAnchor", new URL("./service-child-group-anchor.mjs", import.meta.url));
function runServiceChildRelay() {
	let generation;
	let anchor;
	let parentLost = false;
	let forcedSequence;
	let signalError;
	let anchorExit;
	let parentLineageFds = [];
	let parentLineageReleased = false;
	const report = (message) => {
		if (!process.connected) return;
		try {
			process.send?.(message, () => {});
		} catch {}
	};
	const reportRetirement = () => {
		if (generation && forcedSequence !== void 0) report({
			type: "retirement",
			generation,
			sequence: forcedSequence,
			anchorExited: anchorExit !== void 0,
			signalError
		});
	};
	const settleAnchorExit = () => {
		if (!anchorExit || !parentLineageReleased) return;
		if (forcedSequence !== void 0 && !parentLost && process.connected) reportRetirement();
		else process.exit(anchorExit.code === 0 || anchorExit.signal === "SIGKILL" ? 0 : 1);
	};
	const releaseParentLineage = async () => {
		if (parentLineageFds.length > 0) {
			let reportedFailure = false;
			for (;;) {
				try {
					if (isOwnedProcessGroupGone(anchor.pid)) break;
				} catch (error) {
					if (!reportedFailure) {
						reportedFailure = true;
						report({
							type: "relay-error",
							generation,
							error: error instanceof Error ? error.message : String(error)
						});
					}
				}
				await setTimeout(100);
			}
			for (const fd of parentLineageFds) closeSync(fd);
			parentLineageFds = [];
		}
		parentLineageReleased = true;
		settleAnchorExit();
	};
	const notifyParentLoss = () => {
		if (parentLost) return;
		parentLost = true;
		if (anchorExit) {
			settleAnchorExit();
			return;
		}
		if (anchor?.connected) anchor.send({
			type: "parent-loss",
			generation
		});
	};
	process.once("disconnect", notifyParentLoss);
	process.once("SIGTERM", notifyParentLoss);
	process.once("SIGINT", notifyParentLoss);
	process.on("message", (raw) => {
		const start = raw;
		if (start?.type === "cancel") {
			if (!generation || !anchor || start.generation !== generation || start.signal !== "SIGKILL" || !Number.isSafeInteger(start.sequence) || start.sequence <= 0 || forcedSequence !== void 0) return;
			forcedSequence = start.sequence;
			if (!anchorExit) try {
				if (!anchor.kill("SIGKILL")) signalError ??= "retained anchor SIGKILL was not delivered";
			} catch (error) {
				signalError = error instanceof Error ? error.message : String(error);
			}
			reportRetirement();
			return;
		}
		if (generation) return;
		if (!start || start.type !== "start" || !start.generation) {
			process.exitCode = 1;
			return;
		}
		generation = start.generation;
		if (start.controlFd === void 0) {
			report({
				type: "relay-error",
				generation,
				error: "service child control fd is missing"
			});
			process.exitCode = 1;
			return;
		}
		const anchorUrl = resolveRuntimeProcessEntrypointUrl("serviceChildGroupAnchor");
		const stdio = [
			"inherit",
			"inherit",
			"inherit"
		];
		parentLineageFds = start.parentLineageFds ?? [];
		for (const fd of [
			start.controlFd,
			start.lineageFd,
			...parentLineageFds,
			start.secretFd
		]) if (fd !== void 0) setStdioEntry(stdio, fd, fd);
		reserveStdioEntry(stdio, "ipc");
		try {
			anchor = spawn(process.execPath, resolveRuntimeWorkerArgv(anchorUrl), {
				stdio,
				detached: true,
				windowsHide: true,
				env: process.env
			});
		} catch (error) {
			report({
				type: "relay-error",
				generation,
				error: error instanceof Error ? error.message : String(error)
			});
			process.exitCode = 1;
			return;
		}
		if (!anchor.connected) {
			report({
				type: "relay-error",
				generation,
				error: "anchor lifecycle IPC was not created"
			});
			anchor.kill("SIGKILL");
			process.exitCode = 1;
			return;
		}
		anchor.once("spawn", () => {
			closeSync(start.controlFd);
			if (start.lineageFd !== void 0) closeSync(start.lineageFd);
			if (process.versions.bun) for (const fd of [1, 2]) {
				const output = createWriteStream("", {
					fd,
					autoClose: true
				});
				output.once("error", (error) => {
					report({
						type: "relay-error",
						generation: start.generation,
						error: error.message
					});
					notifyParentLoss();
				});
				output.end();
			}
			else {
				process.stdout.destroy();
				process.stderr.destroy();
			}
			anchor?.send(start);
			if (parentLost) anchor?.send({
				type: "parent-loss",
				generation
			});
		});
		anchor.once("error", (error) => {
			if (forcedSequence !== void 0) {
				signalError = error.message;
				reportRetirement();
			} else report({
				type: "relay-error",
				generation,
				error: error.message
			});
		});
		anchor.once("exit", (code, signal) => {
			anchorExit = {
				code,
				signal
			};
			releaseParentLineage().catch((error) => {
				report({
					type: "relay-error",
					generation,
					error: error instanceof Error ? error.message : String(error)
				});
			});
		});
	});
}
runServiceChildRelay();
//#endregion
export {};
