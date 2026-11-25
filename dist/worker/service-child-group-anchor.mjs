import { createRequire } from "node:module";
import { once } from "node:events";
import fs, { closeSync, fstatSync, openSync, readFile, readFileSync, readSync, readdirSync } from "node:fs";
import { Socket } from "node:net";
import { createHash } from "node:crypto";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { promisify } from "node:util";
import { spawn, spawnSync } from "node:child_process";
import { isatty } from "node:tty";
import { PassThrough, pipeline } from "node:stream";
import { finished } from "node:stream/promises";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
// packages/normalization-core/src/record-coerce.ts
/** Type guard for non-array object records at browser-safe boundaries. */
function isRecord(value) {
	return value !== null && typeof value === "object" && !Array.isArray(value);
}
// src/shared/deferred.ts
const promiseWithResolvers = Promise;
function createDeferredCore() {
	return promiseWithResolvers.withResolvers();
}
// src/shared/monotonic-time.ts
/** Process-local milliseconds: never persist or exchange these readings as epochs. */
function monotonicNow() {
	return performance.now();
}
function monotonicDeadlineAfter(timeoutMs) {
	return monotonicNow() + timeoutMs;
}
/** Signed remaining budget; callers retain their expiration and rounding policy. */
function remainingMonotonicMs(deadline) {
	return deadline - monotonicNow();
}
// node-version.mjs
const NODE_RELEASE_VERSION_RE = /^v?((?:0|[1-9]\d*))\.((?:0|[1-9]\d*))\.((?:0|[1-9]\d*))(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/u;
const NODE_RELEASE_FLOORS = [{
	major: 24,
	minor: 16,
	patch: 0
}, {
	major: 26,
	minor: 1,
	patch: 0
}];
const HIGHEST_RELEASE_FLOOR = NODE_RELEASE_FLOORS[NODE_RELEASE_FLOORS.length - 1];
`${NODE_RELEASE_FLOORS.map(({ major, minor, patch }, index) => `>=${major}.${minor}.${patch}${index < NODE_RELEASE_FLOORS.length - 1 ? ` <${major + 1}` : ""}`).join(" || ").replaceAll(" || ", ", ").replace(/, ([^,]+)$/, ", or $1")}`;
/** Parses release SemVer; future-major prereleases use their numeric core for admission. */
function parseNodeReleaseVersion(value) {
	if (typeof value !== "string") return null;
	const match = NODE_RELEASE_VERSION_RE.exec(value.trim());
	if (!match) return null;
	const version = {
		major: Number(match[1]),
		minor: Number(match[2]),
		patch: Number(match[3])
	};
	return Object.values(version).every(Number.isSafeInteger) && (!match[4] || version.major > HIGHEST_RELEASE_FLOOR.major) ? version : null;
}
function renderProcessNodeVersionCheck() {
	return `((value) => {
  if (typeof value !== "string") return false;
  const match = new RegExp(${JSON.stringify(NODE_RELEASE_VERSION_RE.source)}, "u").exec(value.trim());
  if (!match) return false;
  const version = { major: Number(match[1]), minor: Number(match[2]), patch: Number(match[3]) };
  if (!Object.values(version).every(Number.isSafeInteger)) return false;
  const floors = ${JSON.stringify(NODE_RELEASE_FLOORS)};
  if (match[4] && version.major <= floors[floors.length - 1].major) return false;
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
// node_modules/.pnpm/@openclaw+fs-safe@0.27.1/node_modules/@openclaw/fs-safe/dist/path.js
function isNodeError(value) {
	return Boolean(value && typeof value === "object" && "code" in value);
}
function hasNodeErrorCode(value, code) {
	return isNodeError(value) && value.code === code;
}
// src/shared/global-singleton.ts
/**
* Process-local singleton helpers for registries, caches, and SDK-visible shared state.
* Keys must be symbols so unrelated modules cannot collide on `globalThis` property names.
*/
const GLOBAL_SINGLETON_RESETS_KEY = Symbol.for("openclaw.globalSingletonLifecycleResets");
function resolveGlobalSingletonResetRegistry() {
	const globalStore = globalThis;
	const existing = globalStore[GLOBAL_SINGLETON_RESETS_KEY];
	if (existing instanceof Map) return existing;
	const created = /* @__PURE__ */ new Map();
	globalStore[GLOBAL_SINGLETON_RESETS_KEY] = created;
	return created;
}
/** Resolves a process-local singleton for caches and registries that tolerate helper lookup. */
function resolveGlobalSingleton(key, create, reset, lifecycle = "close-and-restart") {
	const globalStore = globalThis;
	let value;
	if (Object.hasOwn(globalStore, key)) value = globalStore[key];
	else {
		value = create();
		globalStore[key] = value;
	}
	if (reset) resolveGlobalSingletonResetRegistry().set(key, {
		lifecycle,
		reset: () => reset(value)
	});
	return value;
}
// src/shared/detached-async-context.ts
const asyncHooks = typeof process === "undefined" ? void 0 : process.getBuiltinModule?.("node:async_hooks");
asyncHooks && resolveGlobalSingleton(Symbol.for("openclaw.detachedAsyncContext"), () => new asyncHooks.AsyncResource("openclaw.detached-async-context"));
Buffer.from("\nVmRSS:");
Buffer.from("\nVmSwap:");
const nodeVersion = parseNodeReleaseVersion(process.versions.node);
!process.versions.bun && nodeVersion && (nodeVersion.major === 24 && nodeVersion.minor >= 19 || nodeVersion.major === 26 && nodeVersion.minor >= 4 && nodeVersion.minor);
promisify(readFile);
resolveGlobalSingleton(Symbol.for("openclaw.hostExecMemory"), () => ({
	watches: /* @__PURE__ */ new Set(),
	sampling: false,
	assessmentPending: false
}));
// src/process/linux-exec-cgroup.ts
const cgroupMount = "/sys/fs/cgroup";
const controllers = [
	"cpu",
	"io",
	"memory"
];
/** Startup prepares the shared fallback before publishing an active aggregate policy. */
function prepareAgentExecCgroupScope(directory, scopeKey) {
	const scope = scopeKey?.trim();
	const leaf = path.join(directory, scope ? `session-${createHash("sha256").update(scope).digest("hex").slice(0, 32)}` : "unscoped");
	fs.mkdirSync(leaf, { recursive: true });
	const aggregateLimits = fs.readFileSync(path.join(directory, "io.max"), "utf8").trim();
	for (const line of aggregateLimits.split("\n")) {
		const [device, ...fields] = line.split(/\s+/u);
		if (!device) continue;
		const limits = fields.map((field) => {
			const [key, value] = field.split("=");
			const limit = Number(value);
			return `${key}=${limit > 0 && Number.isFinite(limit) ? Math.max(1, Math.floor(limit / 2)) : value}`;
		});
		fs.writeFileSync(path.join(leaf, "io.max"), [device, ...limits].join(" "));
	}
	return leaf;
}
/** Delegation is a kernel capability, resolved from this process's own service leaf. */
function resolveGatewayServiceCgroupDirectory() {
	const relative = /^0::(.+)$/mu.exec(fs.readFileSync("/proc/self/cgroup", "utf8"))?.[1];
	const service = relative && /^(\/(?:[^/]+\/)*[^/]+\.service)\/(?:gateway|agent-exec(?:\/(?:session-[a-f0-9]{32}|unscoped))?)$/u.exec(relative);
	if (!service) return;
	const root = path.join(cgroupMount, service[1]);
	fs.accessSync(root, fs.constants.W_OK | fs.constants.X_OK);
	fs.accessSync(path.join(root, "cgroup.subtree_control"), fs.constants.W_OK);
	fs.accessSync(path.join(root, "gateway", "cgroup.procs"), fs.constants.W_OK);
	const available = new Set(fs.readFileSync(path.join(root, "cgroup.controllers"), "utf8").trim().split(/\s+/u));
	if (!controllers.every((controller) => available.has(controller))) throw new Error("the service has not delegated cpu, io, and memory controllers");
	if (fs.readFileSync(path.join(root, "cgroup.procs"), "utf8").trim()) throw new Error("the service root still contains processes; move its launcher into the gateway leaf");
	return root;
}
/** Helpers discover the same delegated subtree even with an exact application environment. */
function getAgentExecCgroup(scopeKey) {
	if (process.platform !== "linux") return;
	try {
		const root = resolveGatewayServiceCgroupDirectory();
		if (!root) return;
		const enabled = new Set(fs.readFileSync(path.join(root, "cgroup.subtree_control"), "utf8").trim().split(/\s+/u));
		const directory = path.join(root, "agent-exec");
		fs.accessSync(directory, fs.constants.W_OK | fs.constants.X_OK);
		fs.accessSync(path.join(directory, "cgroup.procs"), fs.constants.W_OK);
		const ioPolicy = fs.readFileSync(path.join(directory, "io.max"), "utf8").trim();
		const cpuWeight = fs.readFileSync(path.join(directory, "cpu.weight"), "utf8").trim();
		if (controllers.every((controller) => enabled.has(controller)) && ioPolicy && cpuWeight === "10") {
			const delegated = new Set(fs.readFileSync(path.join(directory, "cgroup.subtree_control"), "utf8").trim().split(/\s+/u));
			if (!controllers.every((controller) => delegated.has(controller))) return directory;
			try {
				return prepareAgentExecCgroupScope(directory, scopeKey);
			} catch (error) {
				process.emitWarning(`Session exec IO policy unavailable; using the shared exec budget: ${String(error)}`);
				return path.join(directory, "unscoped");
			}
		}
	} catch {}
}
/** Dedicated anchors/PTY helpers enter before launching their first application child. */
function enterAgentExecCgroup(scopeKey) {
	const directory = getAgentExecCgroup(scopeKey);
	if (directory) try {
		fs.writeFileSync(path.join(directory, "cgroup.procs"), "0");
	} catch (error) {
		process.emitWarning(`Agent exec cgroup placement failed: ${String(error)}`);
	}
}
// packages/normalization-core/src/string-coerce.ts
/** Trims string input and returns null for non-strings or empty strings. */
function normalizeNullableString(value) {
	if (typeof value !== "string") return null;
	const trimmed = value.trim();
	return trimmed ? trimmed : null;
}
/** Trims string input and returns undefined for non-strings or empty strings. */
function normalizeOptionalString(value) {
	return normalizeNullableString(value) ?? void 0;
}
/** Lowercases a normalized optional string. */
function normalizeOptionalLowercaseString(value) {
	return normalizeOptionalString(value)?.toLowerCase();
}
// src/utils/boolean.ts
/**
* Shared boolean coercion helpers for config, env, and plugin SDK runtime inputs.
*
* `asBoolean` is intentionally strict; string parsing is opt-in through
* `parseBooleanValue` so schema callers do not silently accept ambiguous text.
*/
const DEFAULT_TRUTHY = [
	"true",
	"1",
	"yes",
	"on"
];
const DEFAULT_FALSY = [
	"false",
	"0",
	"no",
	"off"
];
function asBoolean(value) {
	return typeof value === "boolean" ? value : void 0;
}
function parseBooleanValue(value, options = {}) {
	const booleanValue = asBoolean(value);
	if (booleanValue !== void 0) return booleanValue;
	const normalized = normalizeOptionalLowercaseString(value);
	if (!normalized) return;
	if ((options.truthy ?? DEFAULT_TRUTHY).includes(normalized)) return true;
	if ((options.falsy ?? DEFAULT_FALSY).includes(normalized)) return false;
}
// src/process/linux-oom-score-spawn.ts
const CHILD_OOM_SCORE_ADJ_ENV_KEY = "OPENCLAW_CHILD_OOM_SCORE_ADJ";
[
	"echo 1000 > /proc/self/oom_score_adj 2>/dev/null; if [ \"${OC_INTERNAL_OOM_EXEC_BASH_ENV+x}\" = x ]; then BASH_ENV=\"$OC_INTERNAL_OOM_EXEC_BASH_ENV\"; export BASH_ENV; fi; unset OC_INTERNAL_OOM_EXEC_BASH_ENV",
	"if [ \"${OC_INTERNAL_OOM_EXEC_ENV+x}\" = x ]; then ENV=\"$OC_INTERNAL_OOM_EXEC_ENV\"; export ENV; fi; unset OC_INTERNAL_OOM_EXEC_ENV",
	"if [ \"${OC_INTERNAL_OOM_EXEC_CDPATH+x}\" = x ]; then CDPATH=\"$OC_INTERNAL_OOM_EXEC_CDPATH\"; export CDPATH; fi; unset OC_INTERNAL_OOM_EXEC_CDPATH",
	"if [ \"${OC_INTERNAL_OOM_EXEC_PS4+x}\" = x ]; then PS4=\"$OC_INTERNAL_OOM_EXEC_PS4\"; export PS4; fi; unset OC_INTERNAL_OOM_EXEC_PS4; exec \"$0\" \"$@\""
].join("; ");
function raiseChildOomScore(pid) {
	if (pid === void 0) return;
	try {
		fs.writeFileSync(`/proc/${pid}/oom_score_adj`, "1000");
	} catch {}
}
function spawnOomScoreAdjusted(command, args, options) {
	const child = spawn(command, args, options);
	if (!options.shell && shouldAdjustChildOomScore(options)) raiseChildOomScore(child.pid);
	return child;
}
function shouldAdjustChildOomScore(options) {
	if ((options?.platform ?? process.platform) !== "linux") return false;
	return parseBooleanValue(options?.env?.[CHILD_OOM_SCORE_ADJ_ENV_KEY] ?? process.env[CHILD_OOM_SCORE_ADJ_ENV_KEY]) !== false;
}
function isWrapped(command, args) {
	return command === "/bin/sh" && args[0] === "-c" && args[1] === "echo 1000 > /proc/self/oom_score_adj 2>/dev/null; exec \"$0\" \"$@\"";
}
/** Only small spawn owners may temporarily raise their score; never call from the Gateway. */
function spawnWithInheritedOomScore(command, args, options) {
	if (process.platform !== "linux" || !isWrapped(command, args) || !args[2] || options.shell || options.argv0 !== void 0) return spawnOomScoreAdjusted(command, args, options);
	let scoreFd;
	let original;
	try {
		scoreFd = fs.openSync("/proc/self/oom_score_adj", "r+");
		original = fs.readFileSync(scoreFd, "utf8").trim();
		fs.writeSync(scoreFd, "1000", 0, "utf8");
	} catch {
		if (scoreFd !== void 0) fs.closeSync(scoreFd);
		return spawn(command, args, options);
	}
	try {
		return spawn(args[2], args.slice(3), options);
	} finally {
		try {
			fs.writeSync(scoreFd, original, 0, "utf8");
		} catch {
			process.emitWarning("Could not restore spawn owner's Linux OOM score");
		} finally {
			fs.closeSync(scoreFd);
		}
	}
}
// src/process/release-stdin.ts
/**
* Releases inherited stdin before a child entry point disconnects.
*
* Node 26 closes fd 0 when destroying a stdin ReadStream over a regular file or
* /dev/null (stdio "ignore"). libuv then hands fd 0 to the next worker loop and
* aborts when that loop closes it. Such stdin holds no handle that keeps the
* process alive, so it is left open; pipes, sockets and TTYs are still released.
* Bun reports pipe stdin as a ReadStream too, so the fd type decides, not the class.
*/
function releaseProcessStdin() {
	let fileBacked = false;
	try {
		const stat = fstatSync(0);
		fileBacked = stat.isFile() || stat.isCharacterDevice() && !isatty(0);
	} catch {}
	if (!fileBacked) process.stdin.destroy();
}
// src/process/spawn-broker/protocol.ts
function serializeBrokerError(error) {
	return {
		message: error.message,
		code: error.code,
		errno: error.errno,
		syscall: error.syscall,
		path: error.path
	};
}
// src/process/supervisor/cancellation-policy.ts
const GRACEFUL_CANCEL_TIMEOUT_MS = 5e3;
// src/process/supervisor/service-child-stdio.ts
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
// src/process/supervisor/service-child-group-anchor-io.ts
function commandStdio(start) {
	const stdio = [
		start.stdinMode === "inherit" ? "inherit" : "pipe",
		"pipe",
		"pipe"
	];
	if (start.secretFd !== void 0) setStdioEntry(stdio, start.secretFd, start.secretFd);
	const lineageFd = reserveStdioEntry(stdio, start.lineageFd ?? "pipe");
	const inheritedLineageFds = [lineageFd, ...(start.parentLineageFds ?? []).map((fd) => reserveStdioEntry(stdio, fd))];
	if (start.ownedWorker) stdio.push("ipc");
	return {
		stdio,
		lineageFd,
		inheritedLineageFds
	};
}
function delay(ms, retainOwner = false) {
	return new Promise((resolve) => {
		const timer = setTimeout(resolve, ms);
		if (!retainOwner) timer.unref?.();
	});
}
/** Relay owned output, returning a handoff that drains without breaking its writer. */
function relayCommandOutput(source, destination, settled) {
	const relay = new PassThrough();
	let released = false;
	source.once("error", (error) => relay.destroy(error));
	relay.once("close", () => {
		if (!released) source.destroy();
	});
	pipeline(relay, destination, settled);
	source.pipe(relay);
	return async () => {
		released = true;
		source.unpipe(relay);
		relay.end();
		const drained = finished(source, { cleanup: true }).catch(() => void 0);
		source.resume();
		await drained;
	};
}
/** Flush the anchor's last receipt, then release every host channel. */
function finishAnchorTransport(control, code) {
	process.exitCode = code;
	releaseProcessStdin();
	const disconnect = () => {
		control?.off("close", disconnect);
		control?.destroy();
		if (process.connected) process.disconnect?.();
	};
	if (control && !control.destroyed) {
		control.once("close", disconnect);
		control.end(disconnect);
	} else disconnect();
}
/** Close inherited descriptors once, ignoring duplicates. */
function closeFds(fds) {
	for (const fd of new Set(fds ?? [])) closeSync(fd);
}
// packages/normalization-core/src/error-coercion.ts
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
	return typeof code === "string" || typeof code === "number" ? String(code) : void 0;
}
// node_modules/.pnpm/@openclaw+proc-safe@0.4.2/node_modules/@openclaw/proc-safe/dist/errors.js
var ProcSafeError = class extends Error {
	code;
	details;
	constructor(code, message, options = {}) {
		super(message, options);
		this.name = "ProcSafeError";
		this.code = code;
		this.details = options.details;
	}
};
// node_modules/.pnpm/@openclaw+proc-safe@0.4.2/node_modules/@openclaw/proc-safe/dist/native-error.js
const nativeCodes = /* @__PURE__ */ new Set([
	"unsupported-platform",
	"helper-unavailable",
	"access-denied",
	"layout-mismatch",
	"timeout",
	"incomplete",
	"invalid-argument",
	"operation-failed"
]);
/** Internal native errors carry a closed code before the first colon. */
function fromNativeError(error) {
	if (error instanceof ProcSafeError) return error;
	const message = error instanceof Error ? error.message : String(error);
	const code = message.slice(0, message.indexOf(":"));
	const dbusErrorName = /^[^:]+: dbus-error\[([A-Za-z0-9_.]+)\]$/.exec(message)?.[1];
	const peerUidMismatch = /^access-denied: peer-uid-mismatch\[(\d+),(\d+)\]$/.exec(message);
	const pinAccess = /^invalid-argument: insufficient-pin-access\[(lifetime-owner|job-member),(observe|lifetime-owner|job-member)\]$/.exec(message);
	return new ProcSafeError(nativeCodes.has(code) ? code : "operation-failed", message, {
		cause: error,
		...dbusErrorName ? { details: { dbusErrorName } } : {},
		...peerUidMismatch ? { details: {
			reason: "peer-uid-mismatch",
			expectedUid: Number(peerUidMismatch[1]),
			actualUid: Number(peerUidMismatch[2])
		} } : {},
		...pinAccess ? { details: {
			reason: "insufficient-pin-access",
			required: pinAccess[1],
			actual: pinAccess[2]
		} } : {},
		...code === "access-denied" && message === "access-denied: visibility-policy" ? { details: { reason: "visibility-policy" } } : {},
		...code === "operation-failed" && message === "operation-failed: not-a-child" ? { details: { reason: "not-a-child" } } : {}
	});
}
// node_modules/.pnpm/@openclaw+proc-safe@0.4.2/node_modules/@openclaw/proc-safe/dist/native-load-error.js
/** Recognize only a resolver error naming the selected package, not a missing child dependency. */
function isMissingNativePackage(error, packageName) {
	if (!(error instanceof Error) || !("code" in error) || error.code !== "MODULE_NOT_FOUND") return false;
	const firstLine = error.message.split("\n", 1)[0];
	const missing = `Cannot find module '${packageName}'`;
	return firstLine === missing || firstLine?.startsWith(`${missing} from '`) === true && firstLine.endsWith("'");
}
// node_modules/.pnpm/@openclaw+proc-safe@0.4.2/node_modules/@openclaw/proc-safe/dist/native.js
const require = createRequire(import.meta.url);
const initialize = AsyncLocalStorage.snapshot();
let binding;
let attempted = false;
let loadError;
let selectedTarget;
let targetDescription;
function getNativeModeSetting() {
	const mode = process.env.PROC_SAFE_NATIVE ?? "auto";
	if (mode !== "auto" && mode !== "off" && mode !== "require") throw new ProcSafeError("invalid-argument", "PROC_SAFE_NATIVE must be auto, off, or require");
	return {
		mode,
		source: process.env.PROC_SAFE_NATIVE === void 0 ? "default" : "PROC_SAFE_NATIVE"
	};
}
function classifyLoadFailure(error, packageName) {
	try {
		const code = typeof error === "object" && error !== null && "code" in error ? error.code : void 0;
		if (isMissingNativePackage(error, packageName)) try {
			require.resolve(packageName);
		} catch (resolutionError) {
			if (isMissingNativePackage(resolutionError, packageName)) return { reason: "package-missing" };
		}
		return {
			reason: "load-failed",
			code: typeof code === "string" && [
				"ERR_DLOPEN_FAILED",
				"MODULE_NOT_FOUND",
				"ERR_MODULE_NOT_FOUND",
				"ERR_PACKAGE_PATH_NOT_EXPORTED",
				"ERR_INVALID_PACKAGE_CONFIG",
				"EACCES",
				"EPERM",
				"ENOENT"
			].includes(code) ? code : "UNKNOWN"
		};
	} catch {
		return {
			reason: "load-failed",
			code: "UNKNOWN"
		};
	}
}
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
function target() {
	if (targetDescription !== void 0) return selectedTarget;
	const { platform, arch } = process;
	targetDescription = `${platform}-${arch}${platform === "linux" ? `-${isMusl() ? "musl" : "gnu"}` : platform === "win32" ? "-msvc" : ""}`;
	if ((arch === "x64" || arch === "arm64") && [
		"darwin",
		"freebsd",
		"win32",
		"linux"
	].includes(platform)) selectedTarget = targetDescription;
	return selectedTarget;
}
function getNativeBinding() {
	const { mode } = getNativeModeSetting();
	if (mode === "off") return void 0;
	if (!attempted) {
		attempted = true;
		try {
			const selected = target();
			if (selected) {
				binding = initialize(() => require(`@openclaw/proc-safe-${selected}`));
				binding?.readProcessIdentity;
			}
		} catch (error) {
			loadError = error;
			classifyLoadFailure(error, `@openclaw/proc-safe-${selectedTarget}`);
		}
	}
	if (!binding && mode === "require") throw new ProcSafeError("helper-unavailable", "native proc-safe binding is unavailable", { cause: loadError });
	return binding;
}
function validatePid(pid) {
	const max = process.platform === "win32" ? 4294967295 : 2147483647;
	if (!Number.isInteger(pid) || pid <= 0 || pid > max) throw new ProcSafeError("invalid-argument", "pid must be a positive platform PID");
}
// node_modules/.pnpm/@openclaw+proc-safe@0.4.2/node_modules/@openclaw/proc-safe/dist/identity.js
function platformSupported$1() {
	return [
		"darwin",
		"linux",
		"win32",
		"freebsd"
	].includes(process.platform) && ["x64", "arm64"].includes(process.arch);
}
/** null means no kernel object exists; retained exited objects still have an identity. */
function readProcessIdentity(pid) {
	validatePid(pid);
	if (!platformSupported$1()) throw new ProcSafeError("unsupported-platform", "process identity is unsupported on this platform");
	const query = getNativeBinding()?.readProcessIdentity;
	if (!query) throw new ProcSafeError("helper-unavailable", "native process identity is unavailable");
	try {
		const result = query(pid);
		return result === null ? null : Object.freeze(result);
	} catch (error) {
		throw fromNativeError(error);
	}
}
// src/shared/pid-alive.ts
/** Unknown observations never prove death; Linux keeps its thread-aware procfs policy. */
function readNativeLiveness(pid) {
	if (![
		"darwin",
		"win32",
		"freebsd"
	].includes(process.platform) || true) return;
	try {
		const identity = readProcessIdentity(pid);
		return identity !== null && !identity.exited;
	} catch (error) {
		if (error instanceof ProcSafeError && (error.code === "helper-unavailable" || error.code === "unsupported-platform")) return;
		return true;
	}
}
function isValidPid(pid) {
	return Number.isInteger(pid) && pid > 0;
}
function hasLinuxProcfs() {
	return process.platform === "linux" || process.platform === "android";
}
/**
* Reject recycled worker TIDs and terminal leaders without live sibling threads.
* Missing or reaped procfs snapshots require a fresh existence probe.
*/
function exitedLinuxStatus(pid, status) {
	const state = status.match(/^State:\s+(\S)/m)?.[1];
	const threads = status.match(/^Threads:[ \t]+(\d+)[ \t]*$/m)?.[1];
	if (threads === "0") return;
	const tgid = status.match(/^Tgid:[ \t]+(\d+)[ \t]*$/m)?.[1];
	return tgid !== void 0 && Number(tgid) !== pid || (state === "Z" || state === "X") && threads === "1";
}
function isMissingPid(pid) {
	try {
		process.kill(pid, 0);
	} catch (error) {
		return hasNodeErrorCode(error, "ESRCH");
	}
	return false;
}
function isExitedLinuxProcess(pid) {
	if (!hasLinuxProcfs()) return false;
	try {
		const exited = exitedLinuxStatus(pid, fs.readFileSync(`/proc/${pid}/status`, "utf8"));
		if (exited !== void 0) return exited;
	} catch {}
	return isMissingPid(pid);
}
/** Returns true only when the PID is invalid, missing, or a known terminal task. */
function isPidDefinitelyDead(pid) {
	if (!isValidPid(pid)) return true;
	let missing = false;
	try {
		process.kill(pid, 0);
	} catch (error) {
		const code = isNodeError(error) ? error.code : void 0;
		if (code !== "ESRCH" && !(process.platform === "win32" && code === "EPERM")) return false;
		missing = code === "ESRCH";
	}
	const native = readNativeLiveness(pid);
	return native === void 0 ? missing && process.platform !== "freebsd" || isExitedLinuxProcess(pid) : !native;
}
// node_modules/.pnpm/@openclaw+proc-safe@0.4.2/node_modules/@openclaw/proc-safe/dist/inspect.js
function commandResult(result) {
	return Object.freeze({
		executable: result.executable,
		argv: Object.freeze(result.argv),
		...result.commandLine === void 0 ? {} : { commandLine: result.commandLine },
		...result.cwd === void 0 ? {} : { cwd: result.cwd },
		environment: Object.freeze(Object.fromEntries(result.environment.map((entry) => [entry.key, entry.value])))
	});
}
function platformSupported() {
	return ["darwin", "win32"].includes(process.platform) && ["x64", "arm64"].includes(process.arch);
}
/** Complete Darwin or Windows PID census; unreadable facts remain explicitly unknown. */
function listProcesses(options) {
	const start = performance.now();
	const timeoutMs = options?.timeoutMs;
	if (typeof timeoutMs !== "number" || !Number.isFinite(timeoutMs) || timeoutMs <= 0 || options.includeCommand !== void 0 && typeof options.includeCommand !== "boolean") throw new ProcSafeError("invalid-argument", "timeoutMs must be positive and finite; includeCommand must be boolean");
	if (options.pids !== void 0) {
		if (!Array.isArray(options.pids)) throw new ProcSafeError("invalid-argument", "pids must be an array of platform PIDs");
		for (const pid of options.pids) validatePid(pid);
	}
	if (!platformSupported()) throw new ProcSafeError("unsupported-platform", "process census requires Darwin or Windows");
	const query = getNativeBinding()?.listProcesses;
	if (!query) throw new ProcSafeError("helper-unavailable", "native process census is unavailable");
	try {
		const rows = query(timeoutMs, options.includeCommand ?? false, options.pids === void 0 ? void 0 : [...new Set(options.pids)]).map((row) => Object.freeze({
			pid: row.pid,
			owner: row.owner,
			...row.parentPid === void 0 ? {} : { parentPid: row.parentPid },
			...row.processGroupId === void 0 ? {} : { processGroupId: row.processGroupId },
			...row.state === void 0 ? {} : { state: row.state },
			...row.identity === void 0 ? {} : { identity: Object.freeze(row.identity) },
			...row.command === void 0 ? {} : { command: commandResult(row.command) }
		}));
		if (performance.now() - start >= timeoutMs) throw new ProcSafeError("timeout", "process census exceeded timeoutMs");
		return rows;
	} catch (error) {
		throw fromNativeError(error);
	}
}
// src/process/darwin-process-inspection.ts
var DarwinProcessInspectionError = class extends Error {
	constructor(reason, options) {
		super(`Darwin process inspection ${reason}`, options);
		this.reason = reason;
		this.name = "DarwinProcessInspectionError";
		this.code = reason === "deadline" ? "ETIMEDOUT" : reason === "permission" ? "EPERM" : "EIO";
	}
};
function failure(cause) {
	if (cause instanceof DarwinProcessInspectionError) return cause;
	const code = cause && typeof cause === "object" && "code" in cause ? cause.code : void 0;
	return new DarwinProcessInspectionError(code === "ETIMEDOUT" || code === "ABORT_ERR" || code === "timeout" ? "deadline" : [
		"EACCES",
		"EPERM",
		"ERR_ACCESS_DENIED",
		"access-denied"
	].includes(String(code)) ? "permission" : "unavailable", { cause });
}
function remaining(deadline) {
	const ms = Math.floor(deadline - performance.now());
	if (ms <= 0) throw new DarwinProcessInspectionError("deadline");
	return ms;
}
const states = {
	running: "R",
	sleeping: "S",
	stopped: "T",
	zombie: "Z",
	idle: "I",
	unknown: "?"
};
function hasReadableTopology(row) {
	if (row.parentPid === void 0 || row.processGroupId === void 0 || row.state === void 0) {
		if (readProcessIdentity(row.pid) === null) return false;
		throw new DarwinProcessInspectionError("unavailable");
	}
	return true;
}
function topology(row) {
	return {
		pid: row.pid,
		ppid: row.parentPid,
		pgid: row.processGroupId,
		state: states[row.state],
		owner: row.owner
	};
}
function census(deadline, pids) {
	try {
		const rows = listProcesses({
			timeoutMs: remaining(deadline),
			...pids ? { pids } : {}
		}).filter(hasReadableTopology);
		remaining(deadline);
		return rows;
	} catch (cause) {
		remaining(deadline);
		throw failure(cause);
	}
}
/** Synchronous census for the process-group cleanup worker, without spawning ps. */
function* readDarwinProcessCensus(timeoutMs) {
	const deadline = performance.now() + timeoutMs;
	const rows = census(deadline).map(topology);
	for (const row of rows) {
		remaining(deadline);
		yield row;
	}
	remaining(deadline);
}
// src/process/supervisor/service-child-group-ownership.ts
function readLinuxProcessUid(pid) {
	try {
		const lines = readFileSync(`/proc/${pid}/status`, "utf8").split("\n").filter((line) => line.startsWith("Uid:"));
		const ids = (lines.length === 1 ? /^Uid:[ \t]+(\d+)[ \t]+(\d+)[ \t]+(\d+)[ \t]+(\d+)[ \t]*$/.exec(lines[0]) : null)?.slice(1).map(Number);
		const inspectorUid = process.getuid?.();
		return ids?.every((uid) => Number.isSafeInteger(uid) && uid <= 4294967295) ? ids.find((uid) => uid === inspectorUid) ?? ids[0] : void 0;
	} catch {
		return;
	}
}
/** Stop in-group descendants without killing the anchor that observes their lineage. */
function killOwnedProcessGroupMembers() {
	for (const { pid, pgid } of readProcessGroupMembers(1e3)) {
		if (pid === process.pid || pgid !== process.pid) continue;
		try {
			process.kill(pid, "SIGKILL");
		} catch (error) {
			if (extractErrorCode(error) !== "ESRCH") throw error;
		}
	}
}
function parseLinuxProcessGroupMember(pid, stat) {
	const match = /^(\d+) \([\s\S]*\) (\S) (\d+) (-1|\d+)(?:\s|$)/.exec(stat);
	if (!match || Number(match[1]) !== pid) throw new Error("Process group census is unavailable");
	return {
		pid,
		ppid: Number(match[3]),
		pgid: Number(match[4]),
		state: match[2]
	};
}
/** The caller supplies command inspection; group cleanup only reads native topology. */
function* readProcessGroupMembers(timeoutMs, commandInspection) {
	const includeCommand = commandInspection !== void 0;
	if (process.platform === "linux") {
		const deadline = Date.now() + timeoutMs;
		for (const name of readdirSync("/proc")) {
			if (Date.now() >= deadline) throw new Error("Process group census exceeded its deadline");
			if (!/^\d+$/.test(name)) continue;
			const pid = Number(name);
			let stat;
			let argv;
			let uid;
			let opaqueForeignOwner = false;
			try {
				stat = readFileSync(`/proc/${name}/stat`, "utf8");
				if (includeCommand) {
					uid = readLinuxProcessUid(pid);
					try {
						argv = readFileSync(`/proc/${name}/cmdline`, "utf8").split("\0").filter(Boolean);
					} catch (error) {
						const inspectorUid = process.getuid?.();
						opaqueForeignOwner = uid !== void 0 && inspectorUid !== void 0 && uid !== inspectorUid && ["EACCES", "EPERM"].includes(extractErrorCode(error) ?? "");
						if (!opaqueForeignOwner) throw error;
					}
				}
			} catch (error) {
				if (pid !== process.pid && ["ENOENT", "ESRCH"].includes(extractErrorCode(error) ?? "")) continue;
				throw new Error(`Could not classify PID ${pid}: process command inspection failed (${extractErrorCode(error) ?? "unavailable"}).`, { cause: error });
			}
			const member = parseLinuxProcessGroupMember(pid, stat);
			if (Date.now() >= deadline) throw new Error("Process group census is unavailable");
			if (argv?.length === 0) {
				const flags = Number(stat.slice(stat.lastIndexOf(")") + 2).split(/\s+/)[6]);
				if (!(Number.isInteger(flags) && (flags & 2097152) !== 0) && !isPidDefinitelyDead(pid)) {
					const inspectorUid = process.getuid?.();
					if (uid !== void 0 && inspectorUid !== void 0 && uid !== inspectorUid) {
						opaqueForeignOwner = true;
						argv = void 0;
					} else throw new Error(`Could not classify PID ${pid}: live userspace process has no readable arguments.`);
				}
			}
			yield {
				pid,
				pgid: member.pgid,
				state: member.state,
				...argv ? { command: {
					ppid: member.ppid,
					argv,
					...uid === void 0 ? {} : { uid }
				} } : opaqueForeignOwner && uid !== void 0 ? { command: {
					ppid: member.ppid,
					argvUnavailable: true,
					uid
				} } : {}
			};
		}
		if (Date.now() >= deadline) throw new Error("Process group census exceeded its deadline");
		return;
	}
	if (process.platform === "darwin") {
		for (const member of readDarwinProcessCensus(timeoutMs)) {
			const row = {
				pid: member.pid,
				pgid: member.pgid,
				state: member.state
			};
			let command;
			try {
				command = includeCommand ? member.state.startsWith("Z") || member.pid === 0 ? { argv: [] } : commandInspection?.readDarwinCommand(member.pid, member.owner) : void 0;
			} catch (error) {
				if (!(error instanceof ProcSafeError) || error.code !== "incomplete" && error.code !== "layout-mismatch") throw error;
				yield {
					...row,
					ppid: member.ppid
				};
				continue;
			}
			if (includeCommand && !command) continue;
			yield {
				...row,
				...command ? { command: {
					ppid: member.ppid,
					owner: member.owner,
					...command
				} } : {}
			};
		}
		return;
	}
	if (includeCommand) throw new Error(`Exact process command census is unavailable on ${process.platform}.`);
	const deadline = Date.now() + timeoutMs;
	const census = spawnSync("/bin/ps", [
		"-A",
		"-o",
		"pid=,pgid=,stat="
	], {
		encoding: "utf8",
		timeout: timeoutMs,
		maxBuffer: 4194304
	});
	if (census.error || census.status !== 0) throw new Error("Process group census is unavailable");
	for (const line of census.stdout.split("\n")) {
		if (!line.trim()) continue;
		const match = /^\s*(\d+)\s+(\d+)\s+(\S+)\s*$/.exec(line);
		if (!match) throw new Error("Process group census is unavailable");
		const pid = Number(match[1]);
		if (pid !== census.pid) yield {
			pid,
			pgid: Number(match[2]),
			state: match[3]
		};
	}
	if (includeCommand && Date.now() >= deadline) throw new Error("Process group census exceeded its deadline");
}
function isLiveCensusMember({ pid, state }) {
	return !state.startsWith("Z") || process.platform === "linux" && !isPidDefinitelyDead(pid);
}
/** Advisory retirement timing only; the host owns kernel group-disappearance proof. */
function hasLiveOwnedProcessGroupMembers(timeoutMs = 1e3) {
	let observedOwner = false;
	try {
		for (const { pid, pgid, state } of readProcessGroupMembers(Math.max(1, Math.min(1e3, timeoutMs)))) if (pid === process.pid) {
			if (pgid !== process.pid) return;
			observedOwner = true;
		} else if (pgid === process.pid && isLiveCensusMember({
			pid,
			state
		})) return true;
	} catch {
		return;
	}
	return observedOwner ? false : void 0;
}
const MAX_RELEASED_COMMAND_CHARS = 200;
function readLinuxProcessRow(pid) {
	try {
		const stat = readFileSync(`/proc/${pid}/stat`, "utf8");
		const fields = stat.slice(stat.lastIndexOf(")") + 2).split(" ");
		const command = readFileSync(`/proc/${pid}/cmdline`, "utf8").split("\0").filter(Boolean).join(" ");
		return {
			pid,
			ppid: Number(fields[1]),
			pgid: Number(fields[2]),
			live: fields[0] !== "Z" && fields[0] !== "X",
			command: command || void 0
		};
	} catch {
		return;
	}
}
function readProcessRows() {
	if (process.platform === "linux") return readdirSync("/proc").filter((name) => /^\d+$/.test(name)).flatMap((name) => readLinuxProcessRow(Number(name)) ?? []);
	const listing = spawnSync("/bin/ps", [
		"-A",
		"-o",
		"pid=,ppid=,pgid=,stat=,command="
	], {
		encoding: "utf8",
		timeout: 1e3,
		maxBuffer: 8388608
	});
	if (listing.status !== 0 || listing.error) throw listing.error ?? /* @__PURE__ */ new Error(`ps exited with status ${String(listing.status)}`);
	return listing.stdout.split("\n").flatMap((line) => {
		const match = /^\s*(\d+)\s+(\d+)\s+(\d+)\s+(\S+)\s+(.*)$/.exec(line);
		return match ? [{
			pid: Number(match[1]),
			ppid: Number(match[2]),
			pgid: Number(match[3]),
			live: !match[4].startsWith("Z"),
			command: match[5].trim() || void 0
		}] : [];
	});
}
/**
* Name every live process a command left behind: members of the owner's group,
* caller-observed children (adopted orphans), and all of their descendants, even
* those that started a new session. The owner's own helpers (its direct children
* other than the command root) and their descendants are not the command's.
* `earlier` is a previous census: each of its processes that still runs the same
* command stays named, even after the parent that tied it to the command exited.
* Undefined when the process table cannot be read: the caller must then stop the
* tree instead of releasing processes it cannot account for.
*/
function describeReleasedProcesses(rootPid, adoptedPids = [], earlier = []) {
	let rows;
	try {
		rows = readProcessRows();
	} catch {
		return;
	}
	if (rows.length === 0) return;
	const children = /* @__PURE__ */ new Map();
	for (const row of rows) {
		const siblings = children.get(row.ppid);
		if (siblings) siblings.push(row);
		else children.set(row.ppid, [row]);
	}
	const closure = (seeds) => {
		const found = /* @__PURE__ */ new Set();
		const queue = [...seeds];
		for (let pid = queue.pop(); pid !== void 0; pid = queue.pop()) {
			if (found.has(pid)) continue;
			found.add(pid);
			queue.push(...(children.get(pid) ?? []).map((child) => child.pid));
		}
		return found;
	};
	const helpers = closure((children.get(process.pid) ?? []).filter((row) => row.pid !== rootPid && !adoptedPids.includes(row.pid)).map((row) => row.pid));
	const known = new Map(earlier.map(({ pid, command }) => [pid, command]));
	const released = closure(rows.filter((row) => adoptedPids.includes(row.pid) || row.pgid === process.pid || known.has(row.pid) && known.get(row.pid) === truncateCommand(row.command)).map((row) => row.pid).filter((pid) => pid !== process.pid && !helpers.has(pid)));
	return rows.filter((row) => row.live && released.has(row.pid) && !helpers.has(row.pid)).toSorted((left, right) => left.pid - right.pid).map(({ pid, command }) => command === void 0 ? { pid } : {
		pid,
		command: truncateCommand(command)
	});
}
function truncateCommand(command) {
	return command && command.length > MAX_RELEASED_COMMAND_CHARS ? `${command.slice(0, 199)}…` : command;
}
const RELEASE_SETTLE_MS = 2e3;
const RELEASE_SETTLE_POLL_MS = 100;
/**
* After root exit, only what still runs at the end of the settle window was left
* running on purpose: helpers that are still exiting (git, cp, tee) are not services.
* Each census keeps the earlier survivors, so none escapes by outliving its parent.
* A root that still runs is handed off at once. Undefined when the census fails or
* `releasing` turns false (cancellation then owns the tree).
*/
async function settleSurvivors(rootPid, subreaper, releasing) {
	const deadline = monotonicDeadlineAfter(RELEASE_SETTLE_MS);
	let survivors = describeReleasedProcesses(rootPid, subreaper?.children());
	while (survivors?.length && !survivors.some(({ pid }) => pid === rootPid) && remainingMonotonicMs(deadline) > 0 && releasing()) {
		await setTimeout$1(Math.min(RELEASE_SETTLE_POLL_MS, remainingMonotonicMs(deadline)));
		survivors = describeReleasedProcesses(rootPid, subreaper?.children(), survivors);
	}
	return releasing() ? survivors : void 0;
}
// src/process/supervisor/service-child-protocol.ts
function encodeServiceChildMessage(message) {
	return `${JSON.stringify(message)}\n`;
}
// src/process/supervisor/service-child-group-anchor.ts
function runServiceChildGroupAnchor() {
	const launchGrant = createDeferredCore();
	let start;
	let subreaper;
	let descendantsReaped = false;
	let state = "starting";
	let sequence = 0;
	let lastHostSequence = 0;
	let command;
	let lineageCompletion;
	let inheritedLineageClosed = false;
	let workerStarted = false;
	let workerLineageFds = [];
	let control;
	let ownedLineage;
	let rootSettlementStarted = false;
	let rootResultDelivery;
	let rootExit;
	const pendingOutput = /* @__PURE__ */ new Set(["stdout", "stderr"]);
	let releaseOutput = [];
	let lineageClosed = false;
	let lineageObservationFailed = false;
	let markHostLineageClosed;
	let forceCleanup = false;
	let parentLost = false;
	const forceCleanupRequested = createDeferredCore();
	const lineageDone = createDeferredCore();
	const rootExited = createDeferredCore();
	const rootSettledDone = createDeferredCore();
	const startupErrorAcknowledged = createDeferredCore();
	const retirementReady = createDeferredCore();
	let closingSequence;
	let inputEndRequested = false;
	let finishInput;
	const send = async (message) => {
		if (!start || !control || control.destroyed) return;
		sequence += 1;
		await new Promise((resolve) => {
			control.write(encodeServiceChildMessage({
				...message,
				generation: start.generation,
				sequence
			}), () => resolve());
		});
	};
	const finish = (code) => finishAnchorTransport(control, code);
	const closeAuthority = async (reason, hardKill, deadline = monotonicNow() + GRACEFUL_CANCEL_TIMEOUT_MS) => {
		if (!start || state === "closed") return;
		if (start.treeOwnership === "linux-subreaper") {
			if (command && true) throw new Error("native owner cannot close before descendant extinction");
			state = "closed";
			for (const fd of new Set(start.parentLineageFds ?? [])) closeSync(fd);
			closingSequence = sequence + 1;
			await send({
				type: "closing",
				reason
			});
			const acknowledged = await Promise.race([retirementReady.promise, delay(Math.max(0, deadline - monotonicNow())).then(() => false)]);
			finish(acknowledged ? 0 : 1);
			return;
		}
		state = "closed";
		if (hardKill && start.lineageFd === void 0 && !lineageClosed) {
			process.kill(0, "SIGKILL");
			return;
		}
		const requiresAcknowledgement = start.acknowledgeClosing === true;
		closingSequence = requiresAcknowledgement ? sequence + 1 : void 0;
		const remainingMs = deadline - monotonicNow();
		if (remainingMs > 0) send({
			type: "closing",
			reason
		}).then(() => {
			if (!requiresAcknowledgement) retirementReady.resolve(true);
		}, () => retirementReady.resolve(false));
		if (remainingMs <= 0 || !await Promise.race([retirementReady.promise, delay(remainingMs).then(() => false)]) || monotonicNow() >= deadline || hardKill) {
			process.kill(0, "SIGKILL");
			return;
		}
		finish(0);
	};
	const closeInheritedLineage = () => {
		if (start?.lineageFd !== void 0 && !inheritedLineageClosed) {
			inheritedLineageClosed = true;
			closeSync(start.lineageFd);
		}
	};
	const reportStartupFailure = async (error, hardKill = false) => {
		closeInheritedLineage();
		await send({
			type: "startup-error",
			anchorPid: process.pid,
			error: error instanceof Error ? error.message : error,
			...error instanceof Error ? { errorDetails: serializeBrokerError(error) } : {}
		});
		await Promise.race([startupErrorAcknowledged.promise, retirementReady.promise]);
		await closeAuthority("lineage-lost", hardKill);
	};
	const requestCleanup = async (reason, signal = "SIGTERM") => {
		if (!start || state === "closed") return;
		parentLost ||= reason === "parent-lost";
		const force = signal === "SIGKILL" || parentLost && start.terminateOnHostLoss === true;
		if (parentLost && start.terminateOnHostLoss && descendantsReaped);
		if (state === "closing") {
			forceCleanup ||= force;
			if (forceCleanup) forceCleanupRequested.resolve();
			return;
		}
		state = "closing";
		forceCleanup = force;
		if (!command) {
			await reportStartupFailure("command startup cancelled before spawn", true);
			return;
		}
		const deadline = monotonicNow() + GRACEFUL_CANCEL_TIMEOUT_MS;
		const termGraceDone = delay(GRACEFUL_CANCEL_TIMEOUT_MS);
		if (!start.ownedWorker && !forceCleanup && rootExit && pendingOutput.size > 0) await Promise.race([
			rootSettledDone.promise,
			termGraceDone,
			forceCleanupRequested.promise
		]);
		if (start.ownedWorker) {
			const settled = Promise.all([rootExited.promise, lineageDone.promise]);
			if (!forceCleanup) {
				process.kill(0, "SIGTERM");
				await Promise.race([
					settled,
					termGraceDone,
					forceCleanupRequested.promise
				]);
			}
			if (!rootExit) command?.kill("SIGKILL");
			if (!lineageClosed) killOwnedProcessGroupMembers();
			await settled;
			await rootResultDelivery;
			let lineageRecorded = false;
			if (rootExit && lineageClosed && lineageCompletion) try {
				lineageRecorded = lineageCompletion.recordNodeWorkerLineageSettled(start.cleanupBinding);
			} catch {}
			if (!lineageRecorded) await send({
				type: "output",
				stream: "stderr",
				chunk: "node worker lineage completion was not recorded; restart recovery will retain capacity until cleanup can be verified\n"
			});
			if (!forceCleanup) await Promise.race([
				rootSettledDone.promise,
				termGraceDone,
				forceCleanupRequested.promise
			]);
			await closeAuthority(reason, true);
			return;
		}
		if (!forceCleanup) {
			process.kill(0, "SIGTERM");
			await Promise.race([
				lineageDone.promise,
				termGraceDone,
				forceCleanupRequested.promise
			]);
		}
		if (state !== "closing" || !start) return;
		if (lineageClosed && !rootExit && !forceCleanup) await Promise.race([
			rootExited.promise,
			termGraceDone,
			forceCleanupRequested.promise
		]);
		if (state !== "closing" || !start) return;
		if (rootExit && !forceCleanup) {
			await Promise.race([
				rootSettledDone.promise,
				termGraceDone,
				forceCleanupRequested.promise
			]);
			if (state !== "closing" || !start) return;
		}
		for (;;) {
			if (forceCleanup || !rootExit || pendingOutput.size > 0 || !lineageClosed) break;
			const remainingMs = Math.max(0, remainingMonotonicMs(deadline));
			if (remainingMs <= 0) break;
			if (hasLiveOwnedProcessGroupMembers(remainingMs) === false) {
				await closeAuthority(reason, false, deadline);
				return;
			}
			const nextObservationMs = Math.min(100, Math.max(0, remainingMonotonicMs(deadline)));
			if (nextObservationMs <= 0) break;
			await Promise.race([delay(nextObservationMs), forceCleanupRequested.promise]);
		}
		await closeAuthority(reason, true);
	};
	const releaseDescendants = async () => {
		if (!start?.releaseOnRootExit || start.ownedWorker || !command || state !== "active") return;
		const survivors = await settleSurvivors(command.pid, subreaper, () => state === "active");
		if (!survivors) {
			requestCleanup("cancel");
			return;
		}
		state = "closed";
		closingSequence = sequence + 1;
		await send({
			type: "released",
			survivors
		});
		await Promise.race([retirementReady.promise, delay(GRACEFUL_CANCEL_TIMEOUT_MS)]);
		closeFds(start.parentLineageFds);
		ownedLineage?.destroy();
		const drained = Promise.all(releaseOutput.map((release) => release()));
		command.unref();
		const transportClosed = control && !control.destroyed ? once(control, "close").catch(() => void 0) : void 0;
		finish(0);
		await Promise.race([transportClosed, delay(GRACEFUL_CANCEL_TIMEOUT_MS)]);
		await drained;
	};
	const onControlMessage = (message) => {
		if (!start || message.generation !== start.generation || !Number.isSafeInteger(message.sequence) || message.sequence <= lastHostSequence) return;
		if (message.type === "closing-ack") {
			if (state === "closed" && closingSequence !== void 0 && message.closingSequence === closingSequence) {
				lastHostSequence = message.sequence;
				retirementReady.resolve(true);
			}
			return;
		}
		if (state === "closed") return;
		lastHostSequence = message.sequence;
		if (message.type === "launch") {
			launchGrant.resolve();
			return;
		}
		if (message.type === "startup-error-ack") {
			startupErrorAcknowledged.resolve();
			return;
		}
		if (message.type === "lineage-closed") {
			markHostLineageClosed?.();
			return;
		}
		if (message.type === "stdin-end") {
			inputEndRequested = true;
			finishInput?.();
			return;
		}
		if (message.type === "release") {
			releaseDescendants();
			return;
		}
		if (message.type === "worker-close") {
			if (start.ownedWorker && !command) requestCleanup("cancel");
			else if (start.ownedWorker && command?.connected) command.disconnect();
			return;
		}
		if (message.type === "worker-start") {
			if (!start.ownedWorker || workerStarted || state !== "active") return;
			if (!command?.connected) {
				requestCleanup("parent-lost");
				return;
			}
			workerStarted = true;
			command.send({
				type: "openclaw-worker-start-v1",
				lineageFds: workerLineageFds,
				...start.nativeProcessOwner ? { nativeProcessOwner: start.nativeProcessOwner } : {}
			}, (error) => {
				if (error) requestCleanup("parent-lost");
			});
			return;
		}
		requestCleanup("cancel", message.signal);
	};
	const startCommand = async (next) => {
		const controlFd = next.controlFd;
		if (controlFd === void 0) {
			state = "closed";
			finish(1);
			return;
		}
		start = next;
		const socket = process.versions.bun ? new Socket({
			readable: true,
			writable: true
		}) : new Socket({
			fd: controlFd,
			readable: true,
			writable: true
		});
		control = socket;
		socket.setEncoding("utf8");
		let pending = "";
		socket.on("data", (chunk) => {
			pending += chunk;
			for (;;) {
				const newline = pending.indexOf("\n");
				if (newline < 0) break;
				const line = pending.slice(0, newline);
				pending = pending.slice(newline + 1);
				try {
					onControlMessage(JSON.parse(line));
				} catch {
					requestCleanup("parent-lost");
				}
			}
		});
		const onControlLoss = () => {
			retirementReady.resolve(false);
			if (state !== "closed") requestCleanup("parent-lost");
		};
		socket.once("end", onControlLoss);
		socket.once("close", onControlLoss);
		socket.once("error", onControlLoss);
		if (process.versions.bun) socket.connect({ fd: controlFd });
		if (next.executionIntent === "agent-tool") enterAgentExecCgroup(next.executionScopeKey);
		lineageCompletion = (next.ownedWorker, void 0);
		if (next.treeOwnership === "linux-subreaper") try {
			throw new Error("portable workers require their admitted host-native process owner");
		} catch (error) {
			await reportStartupFailure(error instanceof Error ? error : String(error));
			return;
		}
		if (next.type === "prepare") {
			await send({ type: "prepared" });
			await Promise.race([launchGrant.promise, retirementReady.promise]);
		}
		if (start !== next || control !== socket || state !== "starting" || socket.destroyed || socket.readableEnded || socket.writableEnded || !process.connected) {
			await requestCleanup("parent-lost");
			return;
		}
		const { stdio, lineageFd, inheritedLineageFds } = commandStdio(start);
		workerLineageFds = inheritedLineageFds;
		let shutdownOutput;
		try {
			if (process.versions.bun && (process.platform === "darwin" || process.platform === "linux")) {
				const ffi = createRequire(import.meta.url)("bun:ffi");
				const library = process.platform === "darwin" ? "/usr/lib/libSystem.B.dylib" : "libc.so.6";
				shutdownOutput = ffi.dlopen(library, { shutdown: {
					args: ["i32", "i32"],
					returns: "i32"
				} }).symbols.shutdown;
			}
			command = spawnWithInheritedOomScore(start.command, start.args, {
				cwd: start.cwd,
				env: start.env,
				argv0: start.argv0,
				stdio,
				detached: false,
				windowsHide: true
			});
			if (command.pid);
			await once(command, "spawn");
		} catch (error) {
			await reportStartupFailure(error instanceof Error ? error : String(error));
			return;
		}
		const markLineageClosed = () => {
			if (lineageClosed || lineageObservationFailed) return;
			lineageClosed = true;
			lineageDone.resolve();
			if (state === "active" && !start?.releaseOnRootExit) (async () => {
				await rootExited.promise;
				if (state !== "active") return;
				if (rootSettlementStarted) await rootSettledDone.promise;
				if (state !== "active") return;
				requestCleanup("lineage-lost");
			})();
		};
		if (start.lineageFd !== void 0) {
			markHostLineageClosed = markLineageClosed;
			closeInheritedLineage();
		} else {
			const lineage = command.stdio[lineageFd];
			if (!lineage) {
				await send({
					type: "startup-error",
					error: "command lineage pipe was not created"
				});
				await requestCleanup("lineage-lost", "SIGKILL");
				return;
			}
			ownedLineage = lineage;
			lineage.once("end", markLineageClosed);
			const markLineageFailed = () => {
				if (lineageClosed || lineageObservationFailed) return;
				lineageObservationFailed = true;
				lineageDone.resolve();
				requestCleanup("lineage-lost");
			};
			lineage.once("close", () => {
				if (!lineage.readableEnded) markLineageFailed();
			});
			lineage.once("error", markLineageFailed);
			lineage.resume();
		}
		const settleRoot = async () => {
			if (rootSettlementStarted || !rootResultDelivery || pendingOutput.size > 0) return;
			rootSettlementStarted = true;
			await rootResultDelivery;
			rootSettledDone.resolve();
			if (lineageClosed && state === "active" && !start?.releaseOnRootExit) await requestCleanup("lineage-lost");
		};
		const outputCommand = command;
		releaseOutput = ["stdout", "stderr"].map((stream) => relayCommandOutput(outputCommand[stream], process[stream], () => {
			shutdownOutput?.(stream === "stdout" ? 1 : 2, 1);
			pendingOutput.delete(stream);
			settleRoot();
		}));
		if (start.stdinMode !== "inherit" && command.stdin) {
			const destination = command.stdin;
			const endInput = () => {
				if (!start?.terminateOnHostLoss || inputEndRequested) destination.end();
			};
			finishInput = () => {
				if (process.stdin.readableEnded) endInput();
			};
			let inputClosed = false;
			const stopInput = () => {
				process.stdin.unpipe(destination);
				process.stdin.off("end", endInput);
				releaseProcessStdin();
				if (!inputClosed) {
					inputClosed = true;
					send({ type: "stdin-closed" });
				}
			};
			destination.once("error", stopInput);
			destination.once("close", stopInput);
			process.stdin.pipe(destination, { end: false });
			if (process.stdin.readableEnded) endInput();
			else process.stdin.once("end", endInput);
		}
		command.once("error", (error) => {
			if (state === "starting") reportStartupFailure(error.message);
		});
		if (start.ownedWorker) command.on("message", (message) => {
			if (state === "active") send({
				type: "worker-message",
				message
			});
		});
		if (command.pid && state === "starting") {
			state = "active";
			send({
				type: "ready",
				commandPid: command.pid,
				anchorPid: process.pid
			});
		}
		command.once("exit", (code, signal) => {
			rootExit = {
				code,
				signal
			};
			rootResultDelivery = send({
				type: "root-result",
				code,
				signal
			});
			rootExited.resolve();
			settleRoot();
			if (start?.releaseOnRootExit && state === "active") (async () => {
				await Promise.race([rootSettledDone.promise, delay(250)]);
				await rootResultDelivery;
				await releaseDescendants();
			})();
		});
	};
	const onParentSignal = () => {
		if (state === "active" || start && state === "starting") requestCleanup("parent-lost");
	};
	process.on("SIGTERM", onParentSignal);
	process.on("SIGINT", onParentSignal);
	process.once("disconnect", () => {
		retirementReady.resolve(false);
		if (state !== "closed") requestCleanup("parent-lost");
	});
	process.on("message", (raw) => {
		const message = raw;
		if ((message.type === "start" || message.type === "prepare") && !start && state === "starting") {
			if (isRecord(raw) && raw.acknowledgeClosing !== void 0 && raw.acknowledgeClosing !== true) {
				state = "closed";
				finish(1);
				return;
			}
			startCommand(message);
		} else if (message.type === "parent-loss" && message.generation === start?.generation) {
			retirementReady.resolve(false);
			requestCleanup("parent-lost");
		}
	});
}
runServiceChildGroupAnchor();
export { runServiceChildGroupAnchor };
