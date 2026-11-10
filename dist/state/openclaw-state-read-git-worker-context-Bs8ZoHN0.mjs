import { p as toErrorObject, r as pruneMapToMaxSize, s as resolveGlobalSingleton, u as collectNestedErrorCandidates } from "./openclaw-state-read-listeners-C6ALBiqg.mjs";
import { a as isRecord, r as asOptionalRecord } from "./openclaw-state-read-record-coerce-DWp7lFsP.mjs";
import { F as escapeRegExp, N as sleep, R as expandHomePrefix, c as areDiagnosticsEnabledForProcess, d as getActiveDiagnosticTraceContext, f as runWithDiagnosticTraceContext, t as createSubsystemLogger } from "./openclaw-state-read-subsystem-S9LTuPwa.mjs";
import { C as resolveOptionalIntegerOption, E as normalizeLowercaseStringOrEmpty, N as expectDefined, g as clampPositiveTimerTimeoutMs, p as asPositiveFiniteNumber, w as resolveTimerTimeoutMs, x as resolveIntegerOption } from "./openclaw-state-read-types.secrets-Wz8lmfvB.mjs";
import { l as safeStatSync, n as hasNodeErrorCode } from "./openclaw-state-read-path-DKRN8JwZ.mjs";
import { o as sleepWithAbort } from "./openclaw-state-read-runtime-process-manifest-DvMn2cl1.mjs";
import { t as isPromiseLike } from "./openclaw-state-read-promise-like-D7-l5Fsp.mjs";
import { t as createDeferredCore } from "./openclaw-state-read-deferred-D0La5CRk.mjs";
import { c as resolveEnvironmentValue, n as getProcessInstanceStartTime, o as mergeProcessEnv, s as resolveDiagnosticProcessEnv, t as getFileLockProcessStartTime } from "./openclaw-state-read-pid-alive-BppTQRNj.mjs";
import { a as WorktreeRepositoryError, c as getSpawnBroker, f as killProcessTree, m as truncateUtf8Suffix, o as recordChildProcessSpawn, p as BrokerChild, s as withGitProcessOperation } from "./openclaw-state-read-errors-D64c1s5e.mjs";
import { l as ownedWorkerBytes } from "./openclaw-state-read-sqlite-worker-store-BDES2IEB.mjs";
import "./openclaw-state-read-backoff-CNu4LCc8.mjs";
import { createRequire } from "node:module";
import fs, { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { isMainThread, threadId } from "node:worker_threads";
import { fileURLToPath } from "node:url";
import { stripVTControlCharacters } from "node:util";
import { AsyncLocalStorage } from "node:async_hooks";
import { constants as constants$1 } from "node:os";
import fs$1 from "node:fs/promises";
import { execFileSync, spawnSync } from "node:child_process";
import process$1 from "node:process";
import { isUtf8 } from "node:buffer";
import { performance as performance$1 } from "node:perf_hooks";
import { once } from "node:events";
import { StringDecoder } from "node:string_decoder";
import { execa } from "execa";
import { inspectChildWaitState, isSupported, reapChild } from "@openclaw/proc-safe/reaper";
//#region src/process/exec-result.ts
const commandCleanupUncertain = Symbol.for("openclaw.command-cleanup-uncertain");
const commandCleanupMessage = "Command cleanup could not confirm that owned work stopped";
function isCanonicalCommandProcessCleanupError(candidate) {
	try {
		return Object.getOwnPropertyDescriptor(candidate, commandCleanupUncertain)?.value === true;
	} catch {
		return false;
	}
}
/** An admitted command may still write; callers must retain its artifacts for recovery. */
var CommandProcessCleanupError = class extends Error {
	constructor(options) {
		let message = commandCleanupMessage;
		for (const candidate of collectNestedErrorCandidates(options?.cause)) {
			if (!isCanonicalCommandProcessCleanupError(candidate)) continue;
			try {
				const detail = Object.getOwnPropertyDescriptor(candidate, "message")?.value;
				if (typeof detail === "string" && detail.trim() && detail !== commandCleanupMessage) {
					message = detail;
					break;
				}
			} catch {}
		}
		super(message, options);
		this.code = "ERR_COMMAND_PROCESS_CLEANUP_UNCERTAIN";
		this.cleanup = "uncertain";
		this.name = "CommandProcessCleanupError";
		Object.defineProperty(this, commandCleanupUncertain, { value: true });
	}
};
/** Preserve canonical cleanup classification across cause chains and module copies. */
function hasCommandProcessCleanupError(error) {
	return collectNestedErrorCandidates(error).some(isCanonicalCommandProcessCleanupError);
}
const commandFailureOutcome = Symbol.for("openclaw.command-process-outcome");
/** Lifecycle facts stay private; callers retain the original error and its diagnostics. */
function recordCommandProcessFailure(error, outcome) {
	const failure = toErrorObject(error, "Command failed");
	const target = Object.isExtensible(failure) ? failure : new Error(failure.message, { cause: failure });
	return Object.defineProperty(target, commandFailureOutcome, {
		value: Object.freeze({ ...outcome }),
		configurable: true
	});
}
function readCommandProcessFailure(error) {
	for (const cause of collectNestedErrorCandidates(error)) try {
		const outcome = isRecord(cause) ? Object.getOwnPropertyDescriptor(cause, commandFailureOutcome)?.value : void 0;
		if (isRecord(outcome) && (outcome.pid === void 0 || typeof outcome.pid === "number" && Number.isSafeInteger(outcome.pid) && outcome.pid > 0) && (outcome.code === null || typeof outcome.code === "number") && (outcome.inputReleased === void 0 || typeof outcome.inputReleased === "boolean") && (outcome.cleanup === void 0 || outcome.cleanup === "normal" || outcome.cleanup === "cooperative" || outcome.cleanup === "forced" || outcome.cleanup === "uncertain") && (outcome.termination === "exit" || outcome.termination === "signal" || outcome.termination === "timeout" || outcome.termination === "no-output-timeout")) return {
			pid: outcome.pid,
			code: outcome.code,
			cleanup: outcome.cleanup,
			termination: outcome.termination,
			inputReleased: outcome.inputReleased
		};
	} catch {
		return;
	}
}
function createSanitizedCommandError(result) {
	const code = typeof result.code === "string" ? result.code : void 0;
	const exitCode = typeof result.exitCode === "number" ? result.exitCode : void 0;
	const signal = typeof result.signal === "string" ? result.signal : void 0;
	const message = result.timedOut ? "Command timed out" : result.isMaxBuffer ? "Command output exceeded its capture limit" : result.isCanceled ? "Command was canceled" : result.isTerminated ? `Command was terminated${signal ? ` by ${signal}` : ""}` : exitCode !== void 0 && exitCode !== 0 ? `Command exited with code ${exitCode}` : `Command failed during launch or output capture${code ? ` (${code})` : ""}`;
	return Object.assign(new Error(message), {
		...code ? { code } : {},
		...exitCode !== void 0 ? { exitCode } : {},
		...signal ? { signal } : {}
	});
}
function isPlainCommandExitFailure(result) {
	return result.failed && typeof result.exitCode === "number" && result.exitCode !== 0 && result.signal === void 0 && result.cause === void 0 && !result.timedOut && !result.isCanceled && !result.isMaxBuffer && !result.isTerminated;
}
function isPlainCommandSignalFailure(result) {
	return result.failed && result.exitCode === void 0 && typeof result.signal === "string" && result.cause === void 0 && !result.timedOut && !result.isCanceled && !result.isMaxBuffer && result.isTerminated === true;
}
function resolveProcessExitCode(params) {
	return params.explicitCode ?? params.childExitCode ?? (params.usesWindowsExitCodeShim && params.resolvedSignal == null && !params.timedOut && !params.noOutputTimedOut && !params.killIssuedByTimeout && !params.killIssuedByAbort ? 0 : null);
}
//#endregion
//#region src/infra/openclaw-exec-env.ts
const OPENCLAW_CLI_ENV_VAR = "OPENCLAW_CLI";
const CLI_ENV_VALUE = "1";
function markOpenClawExecEnv(env) {
	return {
		...env,
		[OPENCLAW_CLI_ENV_VAR]: CLI_ENV_VALUE
	};
}
//#endregion
//#region src/plugin-sdk/keyed-async-queue.ts
/** Serialize async work per key while allowing unrelated keys to run concurrently. */
function enqueueKeyedTask(params) {
	params.hooks?.onEnqueue?.();
	const current = (params.tails.get(params.key) ?? Promise.resolve()).catch(() => void 0).then(params.task).finally(() => {
		params.hooks?.onSettle?.();
	});
	const tail = current.then(() => void 0, () => void 0);
	params.tails.set(params.key, tail);
	const cleanup = () => {
		if (params.tails.get(params.key) === tail) params.tails.delete(params.key);
	};
	tail.then(cleanup, cleanup);
	return current;
}
/** Small per-key async queue wrapper for plugin runtimes that need serialized work. */
var KeyedAsyncQueue = class {
	constructor() {
		this.tails = /* @__PURE__ */ new Map();
	}
	/**
	* @deprecated Retained for shipped Plugin SDK compatibility. New callers must
	* not depend on queue storage; remove in a declared Plugin SDK breaking window.
	*/
	getTailMapForTesting() {
		return this.tails;
	}
	enqueue(key, task, hooks) {
		return enqueueKeyedTask({
			tails: this.tails,
			key,
			task,
			...hooks ? { hooks } : {}
		});
	}
};
//#endregion
//#region src/infra/windows-appcontainer-spawn.ts
var AppContainerSpawnUnsupportedError = class extends Error {
	constructor(uvVersion) {
		super(`AppContainer: libuv ${uvVersion} cannot create child pipes; 1.53.0+ required. Run OpenClaw outside the AppContainer or use a Node build with libuv >= 1.53.0.`);
		this.code = "APPCONTAINER_SPAWN_UNSUPPORTED";
		this.name = "AppContainerSpawnUnsupportedError";
	}
};
let checked = false;
let unsupported;
/** libuv before 1.53 loops forever creating child pipes in an AppContainer. */
function assertAppContainerSpawnSupported(stdio) {
	if (process.platform !== "win32") return;
	if (stdio === "ignore" || stdio === "inherit" || Array.isArray(stdio) && stdio.length >= 3 && stdio.every((entry) => entry !== void 0 && entry !== null && entry !== "pipe" && entry !== "overlapped" && entry !== "ipc" && !(typeof entry === "number" && entry < 0))) return;
	if (!checked) {
		checked = true;
		try {
			const { readCurrentAppContainerSid } = createRequire(import.meta.url)("@openclaw/proc-safe/windows-token");
			const sid = readCurrentAppContainerSid();
			const uv = process.versions.uv;
			const major = Number(uv.split(".")[0]);
			const minor = Number(uv.split(".")[1]);
			if (sid !== null && (major < 1 || major === 1 && minor < 53)) unsupported = new AppContainerSpawnUnsupportedError(uv);
		} catch (error) {
			import("./openclaw-state-read-subsystem-S9LTuPwa.mjs").then((n) => n.n).then(({ createSubsystemLogger }) => {
				createSubsystemLogger("process").debug("AppContainer token probe failed; allowing spawn", { error: String(error) });
			}).catch(() => {});
		}
	}
	if (unsupported) throw unsupported;
}
//#endregion
//#region src/infra/windows-install-roots.ts
const DEFAULT_WINDOWS_SYSTEM_ROOT = "C:\\Windows";
const WINDOWS_NT_CURRENT_VERSION_KEY = "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion";
const REG_QUERY_TIMEOUT_MS = 5e3;
let cachedProcessRoots = null;
function locateWindowsRegExe() {
	const filePath = path.win32.join(DEFAULT_WINDOWS_SYSTEM_ROOT, "System32", "reg.exe");
	try {
		fs.accessSync(filePath, fs.constants.R_OK);
		return filePath;
	} catch {
		return null;
	}
}
function trimTrailingSeparators(value) {
	const parsed = path.win32.parse(value);
	let trimmed = value;
	while (trimmed.length > parsed.root.length && /[\\/]/.test(trimmed.at(-1) ?? "")) trimmed = trimmed.slice(0, -1);
	return trimmed;
}
/**
* Windows install roots should be local absolute directories, not drive-relative
* paths, UNC shares, or PATH-like lists that could widen trust unexpectedly.
*/
function normalizeWindowsInstallRoot(raw) {
	if (typeof raw !== "string") return null;
	const trimmed = raw.trim();
	if (!trimmed || trimmed.includes("\0") || trimmed.includes("\r") || trimmed.includes("\n") || trimmed.includes(";")) return null;
	const normalized = trimTrailingSeparators(path.win32.normalize(trimmed));
	if (!path.win32.isAbsolute(normalized) || normalized.startsWith("\\\\")) return null;
	const parsed = path.win32.parse(normalized);
	if (!/^[A-Za-z]:\\$/.test(parsed.root)) return null;
	if (normalized.length <= parsed.root.length) return null;
	return normalized;
}
function getEnvValueCaseInsensitive(env, expectedKey) {
	const direct = env[expectedKey];
	if (direct !== void 0) return direct;
	const upper = expectedKey.toUpperCase();
	const actualKey = Object.keys(env).find((key) => key.toUpperCase() === upper);
	return actualKey ? env[actualKey] : void 0;
}
/** Queries one Windows registry string value via reg.exe; null when absent or unreadable. */
function queryWindowsRegistryValue(key, valueName, deadlineMs) {
	const regExe = locateWindowsRegExe();
	if (!regExe) return null;
	for (const viewArgs of [["/reg:64"], []]) {
		const timeoutMs = deadlineMs === void 0 ? REG_QUERY_TIMEOUT_MS : Math.min(REG_QUERY_TIMEOUT_MS, Math.ceil(deadlineMs - performance.now()));
		if (timeoutMs <= 0) return null;
		assertAppContainerSpawnSupported();
		try {
			const stdout = execFileSync(regExe, [
				"query",
				key,
				"/v",
				valueName,
				...viewArgs
			], {
				env: resolveDiagnosticProcessEnv(),
				encoding: "utf8",
				stdio: [
					"ignore",
					"pipe",
					"ignore"
				],
				timeout: timeoutMs,
				windowsHide: true
			});
			const pattern = new RegExp(`^\\s*${escapeRegExp(valueName)}\\s+REG_[A-Z0-9_]+\\s+(.+)$`, "im");
			const parsed = stdout.match(pattern)?.[1]?.trim();
			if (parsed) return parsed;
		} catch {}
	}
	return null;
}
function resolveSystemRootFromEnv(env) {
	return normalizeWindowsInstallRoot(getEnvValueCaseInsensitive(env, "SystemRoot")) ?? normalizeWindowsInstallRoot(getEnvValueCaseInsensitive(env, "WINDIR")) ?? DEFAULT_WINDOWS_SYSTEM_ROOT;
}
function getProcessRoots(deadlineMs) {
	if (!cachedProcessRoots) {
		const env = {};
		for (const key of [
			"SystemRoot",
			"WINDIR",
			"ProgramFiles",
			"ProgramFiles(x86)",
			"ProgramW6432"
		]) env[key] = getEnvValueCaseInsensitive(process.env, key);
		const roots = {
			env,
			systemRoot: normalizeWindowsInstallRoot(queryWindowsRegistryValue(WINDOWS_NT_CURRENT_VERSION_KEY, "SystemRoot", deadlineMs) ?? void 0) ?? resolveSystemRootFromEnv(env)
		};
		if (deadlineMs !== void 0 && performance.now() >= deadlineMs) return roots;
		cachedProcessRoots = roots;
	}
	return cachedProcessRoots;
}
function getWindowsSystemRoot(env, deadlineMs) {
	if (env !== process.env) return resolveSystemRootFromEnv(env);
	const roots = getProcessRoots(deadlineMs);
	return roots.installRoots?.systemRoot ?? roots.systemRoot;
}
function getWindowsCmdExePath(env = process.env) {
	return getWindowsSystem32ExePath("cmd.exe", env);
}
function getWindowsSystem32ExePath(executableName, env = process.env) {
	if (path.win32.basename(executableName) !== executableName || !/^[A-Za-z0-9_.-]+\.exe$/u.test(executableName)) throw new Error(`Invalid Windows System32 executable name: ${executableName}`);
	return path.win32.join(getWindowsSystemRoot(env), "System32", executableName);
}
//#endregion
//#region src/infra/windows-encoding.ts
const WINDOWS_CODEPAGE_ENCODING_MAP = {
	65001: "utf-8",
	54936: "gb18030",
	874: "windows-874",
	936: "gbk",
	950: "big5",
	932: "shift_jis",
	949: "euc-kr",
	1250: "windows-1250",
	1251: "windows-1251",
	1252: "windows-1252",
	1253: "windows-1253",
	1254: "windows-1254",
	1255: "windows-1255",
	1256: "windows-1256",
	1257: "windows-1257",
	1258: "windows-1258"
};
const WINDOWS_ENCODING_PROBE_TIMEOUT_MS = 5e3;
new Map(Object.entries({
	65001: "utf-8",
	874: "windows-874",
	932: "shift_jis",
	936: "gbk",
	949: "euc-kr",
	950: "big5",
	1258: "windows-1258",
	437: "cp437",
	720: "cp720",
	737: "cp737",
	775: "cp775",
	850: "cp850",
	852: "cp852",
	855: "cp855",
	857: "cp857",
	858: "cp858",
	860: "cp860",
	861: "cp861",
	862: "cp862",
	863: "cp863",
	865: "cp865",
	866: "cp866",
	869: "cp869"
}).map(([codePage, encoding]) => [encoding, Number.parseInt(codePage, 10)]));
let cachedWindowsConsoleEncoding;
/** Extracts a Windows console code page number from localized `chcp` output. */
function parseWindowsCodePage(raw) {
	const codePage = Number(raw.match(/\b(\d{3,5})\b/)?.[1]);
	return codePage > 0 ? codePage : null;
}
/** Resolves and caches the current Windows console encoding for subprocess output. */
function resolveWindowsConsoleEncoding() {
	if (process.platform !== "win32") return null;
	if (cachedWindowsConsoleEncoding !== void 0) return cachedWindowsConsoleEncoding;
	cachedWindowsConsoleEncoding = probeWindowsEncoding(getWindowsCmdExePath, [
		"/d",
		"/s",
		"/c",
		"chcp"
	]);
	return cachedWindowsConsoleEncoding;
}
function probeWindowsEncoding(command, args) {
	assertAppContainerSpawnSupported();
	try {
		const result = spawnSync(command(), args, {
			env: resolveDiagnosticProcessEnv(),
			windowsHide: true,
			encoding: "utf8",
			killSignal: "SIGKILL",
			stdio: [
				"ignore",
				"pipe",
				"pipe"
			],
			timeout: WINDOWS_ENCODING_PROBE_TIMEOUT_MS
		});
		const codePage = parseWindowsCodePage(`${result.stdout ?? ""}\n${result.stderr ?? ""}`);
		return codePage !== null ? WINDOWS_CODEPAGE_ENCODING_MAP[codePage] ?? null : null;
	} catch {
		return null;
	}
}
/** Decodes one complete subprocess output buffer, preferring valid UTF-8 before legacy code pages. */
function decodeWindowsOutputBuffer(params) {
	return decodeWindowsBufferWithFallback({
		...params,
		resolveFallbackEncoding: () => params.windowsEncoding ?? resolveWindowsConsoleEncoding()
	});
}
function decodeUtf16BomBuffer(buffer) {
	const [first, second] = buffer;
	return first === 255 && second === 254 || first === 254 && second === 255 ? new TextDecoder(first === 255 ? "utf-16le" : "utf-16be").decode(buffer) : void 0;
}
function decodeWindowsBufferWithFallback(params) {
	if ((params.platform ?? process.platform) !== "win32") return params.buffer.toString("utf8");
	const utf16 = decodeUtf16BomBuffer(params.buffer);
	if (utf16 !== void 0) return utf16;
	const utf8 = decodeStrictUtf8(params.buffer);
	if (utf8 !== null) return utf8;
	const encoding = params.resolveFallbackEncoding();
	if (!encoding || normalizeLowercaseStringOrEmpty(encoding) === "utf-8") return params.buffer.toString("utf8");
	try {
		return new TextDecoder(encoding).decode(params.buffer);
	} catch {
		return params.buffer.toString("utf8");
	}
}
function decodeStrictUtf8(buffer) {
	try {
		return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
	} catch {
		return null;
	}
}
const EXIT_STDIO_MAX_DRAIN_MS = 1e3;
/** Native and broker exit notifications can precede output EOF. */
function hasChildProcessExited(child) {
	return child.exitCode != null || child.signalCode != null;
}
/**
* Execa waits for stdout/stderr after the direct child exits. Bound that wait
* when detached descendants keep inherited pipes open, while still draining
* short output tails. The returned cleanup must run after awaiting the child.
*/
function releaseChildProcessOutputAfterExit(child) {
	let idleTimer;
	let releaseTimer;
	let deadlineTimer;
	const cleanup = () => {
		clearTimeout(idleTimer);
		clearTimeout(releaseTimer);
		clearTimeout(deadlineTimer);
		child.removeListener("exit", onExit);
		child.stdout?.removeListener("data", onData);
		child.stderr?.removeListener("data", onData);
	};
	const release = () => {
		cleanup();
		child.stdout?.destroy();
		child.stderr?.destroy();
	};
	const scheduleRelease = () => {
		releaseTimer ??= setTimeout(release, 0);
		releaseTimer.unref();
	};
	const armIdleTimer = () => {
		clearTimeout(idleTimer);
		clearTimeout(releaseTimer);
		releaseTimer = void 0;
		idleTimer = setTimeout(scheduleRelease, 100);
		idleTimer.unref();
	};
	const onData = () => {
		if (deadlineTimer) armIdleTimer();
	};
	const onExit = () => {
		deadlineTimer = setTimeout(() => {
			deadlineTimer = void 0;
			scheduleRelease();
		}, EXIT_STDIO_MAX_DRAIN_MS);
		deadlineTimer.unref();
		armIdleTimer();
	};
	child.stdout?.on("data", onData);
	child.stderr?.on("data", onData);
	if (hasChildProcessExited(child)) onExit();
	else child.once("exit", onExit);
	return cleanup;
}
//#endregion
//#region src/process/exec-output.ts
const DEFAULT_COMMAND_OUTPUT_MAX_BYTES = 16777216;
const MAX_PRESERVED_PENDING_LINE_BYTES = 8192;
function createCapturedOutputBuffers() {
	return {
		chunks: [],
		bytes: 0,
		truncatedBytes: 0,
		preservedLines: [],
		decoder: new StringDecoder("utf8"),
		pendingLine: ""
	};
}
function resolveMaxOutputBytes(value, stream) {
	return resolveIntegerOption(asPositiveFiniteNumber(typeof value === "number" ? value : value?.[stream]), DEFAULT_COMMAND_OUTPUT_MAX_BYTES, { min: 1 });
}
function resolveOutputCapture(value, stream) {
	return (typeof value === "string" ? value : value?.[stream]) ?? "tail";
}
function shouldTerminateOnOutput(value, limit) {
	return typeof value === "boolean" ? value : value?.[limit] === true;
}
function appendCapturedOutput(capture, chunk, maxBytes, mode) {
	const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
	if (mode === "discard") {
		capture.truncatedBytes += buffer.byteLength;
		return;
	}
	if (mode === "head") {
		const remaining = Math.max(0, maxBytes - capture.bytes);
		if (remaining > 0) {
			const kept = buffer.subarray(0, remaining);
			capture.chunks.push(kept.byteLength < buffer.byteLength ? Buffer.from(kept) : kept);
			capture.bytes += kept.byteLength;
		}
		capture.truncatedBytes += Math.max(0, buffer.byteLength - remaining);
		return;
	}
	if (buffer.byteLength >= maxBytes) {
		capture.chunks = [Buffer.from(buffer.subarray(buffer.byteLength - maxBytes))];
		capture.truncatedBytes += capture.bytes + buffer.byteLength - maxBytes;
		capture.bytes = maxBytes;
		return;
	}
	capture.chunks.push(buffer);
	capture.bytes += buffer.byteLength;
	while (capture.bytes > maxBytes && capture.chunks.length > 0) {
		const first = expectDefined(capture.chunks[0], "chunks entry at 0");
		const overflow = capture.bytes - maxBytes;
		if (first.byteLength <= overflow) {
			capture.chunks.shift();
			capture.bytes -= first.byteLength;
			capture.truncatedBytes += first.byteLength;
		} else {
			capture.chunks[0] = Buffer.from(first.subarray(overflow));
			capture.bytes -= overflow;
			capture.truncatedBytes += overflow;
		}
	}
}
function trimTruncatedUtf8Boundary(buffer, mode, truncatedBytes, forceUtf8) {
	if (truncatedBytes === 0 || buffer.length === 0 || process$1.platform === "win32" && !forceUtf8) return buffer;
	if (mode === "tail") {
		let start = 0;
		while (start < buffer.length && (expectDefined(buffer[start], "buffer byte") & 192) === 128) start += 1;
		return buffer.subarray(start);
	}
	for (let removed = 0; removed <= 3 && removed <= buffer.length; removed += 1) {
		const end = buffer.length - removed;
		if (isUtf8(buffer.subarray(0, end))) return buffer.subarray(0, end);
	}
	return buffer;
}
function finalizeCapturedOutput(capture, mode, forceUtf8 = false) {
	const buffered = Buffer.concat(capture.chunks, capture.bytes);
	const trimmed = trimTruncatedUtf8Boundary(buffered, mode, capture.truncatedBytes, forceUtf8);
	capture.truncatedBytes += buffered.byteLength - trimmed.byteLength;
	return trimmed;
}
function appendPreservedOutputLines(params) {
	const { capture, maxPreservedOutputLines, preserveOutputLine } = params;
	if (!preserveOutputLine || capture.preservedLines.length >= maxPreservedOutputLines) return;
	const text = Buffer.isBuffer(params.chunk) ? capture.decoder.write(params.chunk) : params.chunk;
	if (!text) return;
	const lines = (capture.pendingLine + text).split(/\r?\n/);
	capture.pendingLine = truncateUtf8Suffix(lines.pop() ?? "", params.maxPendingLineBytes);
	for (const line of lines) if (capture.preservedLines.length < maxPreservedOutputLines && preserveOutputLine(line, params.stream)) capture.preservedLines.push(line);
}
function flushPreservedOutputLine(params) {
	const { capture, maxPreservedOutputLines, preserveOutputLine } = params;
	if (!preserveOutputLine || maxPreservedOutputLines <= 0) return;
	const trailing = truncateUtf8Suffix(capture.pendingLine + capture.decoder.end(), params.maxPendingLineBytes);
	capture.pendingLine = "";
	if (trailing && capture.preservedLines.length < maxPreservedOutputLines && preserveOutputLine(trailing, params.stream)) capture.preservedLines.push(trailing);
}
//#endregion
//#region node-runtime-env.mjs
/** Keep lifecycle children on the explicitly selected runtime without changing npm config. */
function withNodeRuntimePath(env, nodePath, platform = process.platform) {
	const paths = platform === "win32" ? path.win32 : path.posix;
	const keys = Object.keys(env).filter((key) => platform === "win32" ? key.toUpperCase() === "PATH" : key === "PATH");
	const key = keys.length ? keys.reduce((first, entry) => entry < first ? entry : first) : "PATH";
	const directory = paths.dirname(nodePath);
	const entries = (env[key] ? env[key].split(paths.delimiter) : []).filter((entry) => entry !== directory);
	const result = { ...env };
	for (const pathKey of keys.length ? keys : [key]) result[pathKey] = [directory, ...entries].join(paths.delimiter);
	return result;
}
//#endregion
//#region src/process/scoped-child-reaper.ts
const scheduledChildren = /* @__PURE__ */ new WeakSet();
const POLL_INTERVAL_MS = 25;
const CLEANUP_DEADLINE_MS = 3e4;
function readGroupMembers(groupId) {
	let entries;
	try {
		entries = readdirSync("/proc");
	} catch {
		return [];
	}
	const members = [];
	for (const entry of entries) {
		if (!/^\d+$/u.test(entry)) continue;
		let stat;
		try {
			stat = readFileSync(`/proc/${entry}/stat`, "utf8");
		} catch {
			continue;
		}
		const fields = stat.slice(stat.lastIndexOf(")") + 2).split(" ");
		if (Number(fields[2]) === groupId) members.push({
			pid: Number(entry),
			ppid: Number(fields[1]),
			state: fields[0]
		});
	}
	return members;
}
function retainAdoptedCleanup(rootPid, cleanupTimeoutMs) {
	if (!isSupported()) return;
	const deadline = performance.now() + Math.max(CLEANUP_DEADLINE_MS, cleanupTimeoutMs);
	let quietScans = 0;
	const tick = () => {
		if (performance.now() >= deadline) return;
		let remaining = false;
		for (const member of readGroupMembers(rootPid)) {
			if (member.pid === rootPid) continue;
			if (member.ppid === process.pid && member.state === "Z") try {
				if (inspectChildWaitState(member.pid).kind === "exited" && reapChild(member.pid)) continue;
			} catch {}
			remaining = true;
		}
		quietScans = remaining ? 0 : quietScans + 1;
		if (quietScans < 2) schedule();
	};
	const schedule = () => {
		setTimeout(tick, POLL_INTERVAL_MS).unref();
	};
	schedule();
}
/** Retain only the terminated group's adopted children after libuv consumes root exit. */
function scheduleAdoptedChildZombieReapAfterExit(child, usedProcessGroup, cleanupTimeoutMs = CLEANUP_DEADLINE_MS) {
	if (process.platform !== "linux" || !usedProcessGroup || child.pid === void 0 || scheduledChildren.has(child)) return;
	const rootPid = child.pid;
	scheduledChildren.add(child);
	const start = () => retainAdoptedCleanup(rootPid, cleanupTimeoutMs);
	if (child.exitCode !== null || child.signalCode !== null) start();
	else child.once("exit", start);
}
//#endregion
//#region src/process/child-process-tree.ts
function shouldDetachChildForProcessTree() {
	return process.platform !== "win32";
}
function isChildProcessTreeAlive(child) {
	if (typeof child.pid !== "number" || child.pid <= 0) return false;
	const target = shouldDetachChildForProcessTree() ? -child.pid : child.pid;
	try {
		process.kill(target, 0);
		return true;
	} catch (error) {
		return !hasNodeErrorCode(error, "ESRCH");
	}
}
//#endregion
//#region src/process/spawn-broker/execa-message.ts
const decoder = new TextDecoder();
const commonEscapes = /* @__PURE__ */ new Map([
	[" ", " "],
	["\n", "\n"],
	["\b", "\\b"],
	["\f", "\\f"],
	["\r", "\\r"],
	["	", "\\t"]
]);
function renderOutput(output) {
	let text = typeof output === "string" ? output : decoder.decode(output);
	if (text.endsWith("\n")) text = text.slice(0, text.endsWith("\r\n") ? -2 : -1);
	return stripVTControlCharacters(text).replace(/[\p{Separator}\p{Other}]/gu, (character) => {
		const common = commonEscapes.get(character);
		if (common !== void 0) return common;
		const codepoint = character.codePointAt(0);
		const hex = codepoint.toString(16);
		return codepoint <= 65535 ? `\\u${hex.padStart(4, "0")}` : `\\U${hex}`;
	});
}
function decodeExecaMessage(encoded, output) {
	return encoded.messageOutputs ? [encoded.message, ...encoded.messageOutputs.map((stream) => renderOutput(output[stream]))].join("\n\n") : encoded.message;
}
//#endregion
//#region src/process/spawn-broker/execa-protocol.ts
function restoreError(error, output) {
	const restored = new Error(decodeExecaMessage(error, output), { cause: error.cause ? restoreError(error.cause, output) : void 0 });
	return Object.assign(restored, {
		name: error.name,
		code: error.code
	});
}
/** Failed reject:false results are still Errors, as they are with local execa. */
function restoreExecaResult(result) {
	const { error, ...received } = result;
	const properties = {
		...received,
		stdout: received.stdout,
		stderr: received.stderr,
		shortMessage: received.shortMessage,
		code: received.code
	};
	if (error) {
		const restored = restoreError(error, properties);
		return Object.assign(restored, properties, { cause: restored.cause });
	}
	return {
		...properties,
		cause: void 0
	};
}
//#endregion
//#region src/process/spawn-broker/execa-client.ts
function isOutputOption(value) {
	return value === void 0 || value === "pipe" || value === "ignore" || value === "inherit" || typeof value === "object" && value !== null && "file" in value && typeof value.file === "string" && Object.keys(value).length === 1;
}
/** Unsupported native descriptors and independent-lifetime commands remain explicit local paths. */
function brokerExecaOptions(options) {
	if (options.ipc || options.cleanup === false || typeof options.stdin === "number") return;
	if (options.stdout === "inherit" || options.stderr === "inherit" || options.stdio === "inherit" || typeof options.stdout === "number" || typeof options.stderr === "number") return;
	if (options.stdio && typeof options.stdio !== "string" && options.stdio.some((entry, fd) => typeof entry === "number" || fd > 0 && entry === "inherit")) return;
	if (options.cwd !== void 0 && typeof options.cwd !== "string" || options.input !== void 0 && typeof options.input !== "string" && !(options.input instanceof Uint8Array) || options.stdin !== void 0 && options.stdin !== "pipe" && options.stdin !== "ignore" && options.stdin !== "inherit" || !isOutputOption(options.stdout) || !isOutputOption(options.stderr) || options.shell !== void 0 && options.shell !== false) throw new TypeError("Unsupported spawn broker execa stream or invocation options");
	if (Array.isArray(options.stdio) && (options.stdio.length !== 3 || ![
		"pipe",
		"ignore",
		"inherit"
	].includes(String(options.stdio[0])) || !isOutputOption(options.stdio[1]) || !isOutputOption(options.stdio[2]))) throw new TypeError("Unsupported spawn broker execa stdio");
	const { cancelSignal: _cancelSignal, ...serializable } = options;
	return serializable;
}
function spawnBrokerCommand(host, argv, options, prepared) {
	const remote = host.spawnExeca(argv, prepared);
	const child = remote.child;
	const closed = child.waitForClose();
	const onAbort = () => {
		child.killed = true;
		remote.cancel();
	};
	options.cancelSignal?.addEventListener("abort", onAbort, { once: true });
	if (options.cancelSignal?.aborted) onAbort();
	const promise = remote.result.then(async (result) => {
		if (result.timedOut) child.killed = true;
		await closed;
		const restored = restoreExecaResult(result);
		if (restored instanceof Error && (options.reject !== false || restored.code === "ERR_SPAWN_BROKER_UNAVAILABLE")) throw restored;
		return restored;
	}).finally(() => options.cancelSignal?.removeEventListener("abort", onAbort));
	promise.catch(() => {});
	once(child, "spawn").then(() => {
		setImmediate(() => {
			for (const stream of [child.stdout, child.stderr]) if (stream?.readableFlowing === null) stream.resume();
		});
	}, () => {});
	const properties = {
		nodeChildProcess: child,
		get pid() {
			return child.pid;
		},
		get stdin() {
			return child.stdin;
		},
		get stdout() {
			return child.stdout;
		},
		get stderr() {
			return child.stderr;
		},
		kill: (signal) => child.kill(signal ?? options.killSignal)
	};
	const command = Object.assign(promise, properties);
	return Object.defineProperties(command, Object.getOwnPropertyDescriptors(properties));
}
//#endregion
//#region src/infra/executable-path.ts
function isDriveLessWindowsRootedPath(value) {
	return process.platform === "win32" && /^:[\\/]/.test(value);
}
function resolveExecutablePathCandidate(rawExecutable, options) {
	const expanded = rawExecutable.startsWith("~") ? expandHomePrefix(rawExecutable, { env: options?.env }) : rawExecutable;
	if (isDriveLessWindowsRootedPath(expanded)) return;
	const hasPathSeparator = expanded.includes("/") || expanded.includes("\\");
	if (options?.requirePathSeparator && !hasPathSeparator) return;
	if (!hasPathSeparator) return expanded;
	if (path.isAbsolute(expanded)) return path.resolve(expanded);
	const base = options?.cwd && options.cwd.trim() ? options.cwd.trim() : process.cwd();
	return path.resolve(base, expanded);
}
function resolveWindowsExecutableExtensions(executable, env, includeExtensionless = true) {
	if (process.platform !== "win32" || path.extname(executable).length > 0) return [""];
	const extensions = [...resolveWindowsExecutableExtSet(env)];
	return includeExtensionless ? ["", ...extensions] : extensions;
}
function resolveWindowsExecutableExtSet(env) {
	return new Set((resolveEnvironmentValue(env, "PATHEXT") ?? resolveEnvironmentValue(process.env, "PATHEXT") ?? ".EXE;.CMD;.BAT;.COM").split(";").map((ext) => normalizeLowercaseStringOrEmpty(ext)).filter(Boolean));
}
function isRegularFile(filePath) {
	return safeStatSync(filePath)?.isFile() ?? false;
}
const WINDOWS_NATIVE_EXECUTABLE_EXTENSIONS = /* @__PURE__ */ new Set([
	".com",
	".exe",
	".bat",
	".cmd"
]);
/** Checks a supplied path without PATH lookup or lexical normalization. */
function isExecutableFile(filePath, options) {
	if (!isRegularFile(filePath)) return false;
	try {
		if (process.platform === "win32") {
			const ext = normalizeLowercaseStringOrEmpty(path.extname(filePath));
			if (!ext || WINDOWS_NATIVE_EXECUTABLE_EXTENSIONS.has(ext)) return true;
			return resolveWindowsExecutableExtSet(options?.env).has(ext);
		}
		fs.accessSync(filePath, fs.constants.X_OK);
		return true;
	} catch {
		return false;
	}
}
const EXECUTABLE_PATH_CACHE_TTL_MS = 6e4;
const EXECUTABLE_PATH_CACHE_MAX_ENTRIES = 128;
const executablePathCache = /* @__PURE__ */ new Map();
function cacheExecutablePath(key, resolved) {
	executablePathCache.set(key, {
		expiresAt: Date.now() + EXECUTABLE_PATH_CACHE_TTL_MS,
		resolved: resolved ?? null
	});
	pruneMapToMaxSize(executablePathCache, EXECUTABLE_PATH_CACHE_MAX_ENTRIES);
}
function executablePathCacheKey(executable, pathEnv, env, includeExtensionless, requestedCwd) {
	const pathExt = resolveEnvironmentValue(env, "PATHEXT") ?? resolveEnvironmentValue(process.env, "PATHEXT") ?? "";
	let cwd = "";
	try {
		cwd = requestedCwd ?? process.cwd();
	} catch {}
	return `${process.platform}\0${executable}\0${JSON.stringify(pathEnv)}\0${pathExt}\0${includeExtensionless !== false}\0${cwd}\0${requestedCwd !== void 0}`;
}
/** Prepared entries preserve delimiters introduced by caller-owned home expansion. */
function resolveExecutableFromPathEnv(executable, pathEnv, env, options) {
	const cwd = options?.cwd?.trim() ? path.resolve(options.cwd.trim()) : void 0;
	const useCache = options?.useCache !== false;
	const cacheKey = executablePathCacheKey(executable, pathEnv, env, options?.includeExtensionless, cwd);
	const cached = useCache ? executablePathCache.get(cacheKey) : void 0;
	const now = Date.now();
	if (cached && cached.expiresAt > now) {
		cached.expiresAt = now + EXECUTABLE_PATH_CACHE_TTL_MS;
		executablePathCache.delete(cacheKey);
		executablePathCache.set(cacheKey, cached);
		return cached.resolved ?? void 0;
	}
	if (cached) executablePathCache.delete(cacheKey);
	const delimiter = process.platform === "win32" ? ";" : path.delimiter;
	const entries = (typeof pathEnv === "string" ? pathEnv.split(delimiter) : pathEnv).filter((entry) => Boolean(entry) || cwd !== void 0 && process.platform !== "win32");
	const extensions = resolveWindowsExecutableExtensions(executable, env, options?.includeExtensionless);
	for (const entry of entries) {
		const hasParentTraversal = process.platform !== "win32" && entry.split("/").includes("..");
		const rawDirectory = cwd !== void 0 && !path.isAbsolute(entry) ? `${cwd}${path.sep}${entry}` : entry;
		for (const ext of extensions) {
			const candidate = hasParentTraversal ? `${rawDirectory}${path.sep}${executable}${ext}` : path.join(cwd === void 0 ? entry : path.resolve(cwd, entry), executable + ext);
			if (isExecutableFile(candidate, { env })) {
				if (useCache) cacheExecutablePath(cacheKey, candidate);
				return candidate;
			}
		}
	}
	if (useCache) cacheExecutablePath(cacheKey, void 0);
}
//#endregion
//#region src/process/windows-command.ts
const WINDOWS_UNSAFE_CMD_CHARS_RE = /[&|<>%\r\n]/;
function resolveNpmArgvForWindows(argv) {
	if (process$1.platform !== "win32" || argv.length === 0) return null;
	const basename = normalizeLowercaseStringOrEmpty(path.basename(expectDefined(argv[0], "argv entry at 0"))).replace(/\.(cmd|exe|bat)$/, "");
	const cliName = basename === "npx" ? "npx-cli.js" : basename === "npm" ? "npm-cli.js" : null;
	if (!cliName) return null;
	const cliPath = path.join(path.dirname(process$1.execPath), "node_modules", "npm", "bin", cliName);
	if (fs.existsSync(cliPath)) return [
		process$1.execPath,
		cliPath,
		...argv.slice(1)
	];
	const command = argv[0] ?? "";
	return [normalizeLowercaseStringOrEmpty(path.extname(command)) ? command : `${command}.cmd`, ...argv.slice(1)];
}
function createWindowsCommandNotFoundError(command) {
	const error = /* @__PURE__ */ new Error(`spawn ${command} ENOENT`);
	error.code = "ENOENT";
	error.path = command;
	error.syscall = `spawn ${command}`;
	return error;
}
function resolveWindowsCommandFromCwdOrPath(params) {
	if (params.command.includes("/") || params.command.includes("\\")) {
		const candidate = resolveExecutablePathCandidate(params.command, {
			cwd: params.cwd,
			env: params.env
		});
		if (!candidate) return;
		if (path.extname(candidate)) return isRegularFile(candidate) ? candidate : void 0;
		return resolveExecutableFromPathEnv(path.basename(candidate), path.dirname(candidate), params.env, { includeExtensionless: false });
	}
	const cwd = params.cwd?.trim() || process$1.cwd();
	const pathEntries = (resolveEnvironmentValue(params.env, "PATH") ?? resolveEnvironmentValue(process$1.env, "PATH") ?? "").split(";").map((entry) => entry.replace(/^"(.*)"$/, "$1").trim()).filter(Boolean).map((entry) => path.isAbsolute(entry) ? entry : path.resolve(cwd, entry));
	return resolveExecutableFromPathEnv(params.command, pathEntries.join(";"), params.env, { includeExtensionless: false });
}
function resolveSupportedWindowsCommand(params) {
	if (process$1.platform !== "win32") return params.command;
	let resolved = resolveWindowsCommandFromCwdOrPath(params);
	const shimmedCommand = resolveWindowsCommandShim({
		command: params.command,
		cmdCommands: [
			"corepack",
			"pnpm",
			"yarn"
		]
	});
	if (!resolved && shimmedCommand !== params.command) resolved = resolveWindowsCommandFromCwdOrPath({
		...params,
		command: shimmedCommand
	});
	if (!resolved) throw createWindowsCommandNotFoundError(params.command);
	const extension = normalizeLowercaseStringOrEmpty(path.extname(resolved));
	if ([
		".exe",
		".com",
		".cmd",
		".bat"
	].includes(extension)) return resolved;
	throw new Error(`Unsupported Windows command extension ${JSON.stringify(extension || "<none>")} for ${JSON.stringify(params.command)}; use an explicit executable or shell wrapper.`);
}
/** Resolve one shell-free invocation before Execa can apply Windows fallbacks. */
function resolveSafeChildProcessInvocation(params) {
	const finalArgv = resolveNpmArgvForWindows(params.argv) ?? params.argv;
	const cwd = params.cwd instanceof URL ? fileURLToPath(params.cwd) : params.cwd;
	const resolvedCommand = resolveSupportedWindowsCommand({
		command: finalArgv[0] ?? "",
		cwd,
		env: params.env
	});
	const useCmdWrapper = isWindowsBatchCommand(resolvedCommand);
	return {
		command: useCmdWrapper ? resolveSupportedWindowsCommand({
			command: resolveTrustedWindowsCmdExe(),
			cwd,
			env: params.env
		}) : resolvedCommand,
		args: useCmdWrapper ? [
			"/d",
			"/s",
			"/c",
			buildWindowsCmdExeCommandLine(resolvedCommand, finalArgv.slice(1))
		] : finalArgv.slice(1),
		usesWindowsExitCodeShim: process$1.platform === "win32" && (useCmdWrapper || finalArgv !== params.argv),
		windowsHide: true,
		windowsVerbatimArguments: useCmdWrapper ? true : params.windowsVerbatimArguments
	};
}
function isWindowsBatchCommand(resolvedCommand, platform = process$1.platform) {
	if (platform !== "win32") return false;
	const ext = normalizeLowercaseStringOrEmpty(path.extname(resolvedCommand));
	return ext === ".cmd" || ext === ".bat";
}
function buildWindowsCmdExeCommandLine(command, args) {
	return `"${[command, ...args].map((arg) => {
		if (WINDOWS_UNSAFE_CMD_CHARS_RE.test(arg)) throw new Error(`Unsafe Windows cmd.exe argument detected: ${JSON.stringify(arg)}. Pass an explicit shell-wrapper argv at the call site instead.`);
		return `"${arg.replace(/\\+/g, (backslashes, offset) => {
			const next = arg[offset + backslashes.length];
			return next === "\"" || next === void 0 ? backslashes.repeat(2) : backslashes;
		}).replace(/"/g, "\"\"")}"`;
	}).join(" ")}"`;
}
function resolveTrustedWindowsCmdExe(platform = process$1.platform) {
	if (platform !== "win32") return "cmd.exe";
	return getWindowsCmdExePath();
}
/**
* Resolve package-manager commands that Windows exposes through .cmd shims.
* Explicit extensions are preserved so callers can pass already-resolved tools.
*/
function resolveWindowsCommandShim(params) {
	if ((params.platform ?? process$1.platform) !== "win32") return params.command;
	const basename = normalizeLowercaseStringOrEmpty(path.basename(params.command));
	if (path.extname(basename)) return params.command;
	if (params.cmdCommands.includes(basename)) return `${params.command}.cmd`;
	return params.command;
}
//#endregion
//#region src/process/exec-spawn.ts
/**
* Post-SIGKILL teardown and orphan reaping, not cooperative grace. macOS reports
* EPERM, not ESRCH, while only unreaped zombies remain, and loaded hosts have
* exceeded 300 ms. Polling ends at extinction, so only surviving groups wait.
*/
const COMMAND_PROCESS_GROUP_EXIT_CONFIRMATION_MS = 1e4;
/** The single owner for confirming that a force-killed command group is gone. */
async function waitForCommandProcessGroupExit(pid, isOriginalProcess) {
	const deadline = Date.now() + COMMAND_PROCESS_GROUP_EXIT_CONFIRMATION_MS;
	while (isChildProcessTreeAlive({ pid })) {
		if (!isOriginalProcess()) return "replaced";
		const remaining = deadline - Date.now();
		if (remaining <= 0) return isChildProcessTreeAlive({ pid }) ? "alive" : "exited";
		await sleep(Math.min(25, remaining));
	}
	return "exited";
}
const commandAdmissions = /* @__PURE__ */ new WeakMap();
/** Remote PID and pipes arrive together before admission or stream subscription. */
async function waitForCommandSpawn(child) {
	if (child.nodeChildProcess instanceof BrokerChild) try {
		await child.nodeChildProcess.ready();
	} catch {
		await child;
	}
	await commandAdmissions.get(child.nodeChildProcess);
}
const commandProcessScope = new AsyncLocalStorage();
function resolveCommandProcessSignal(signal) {
	const inherited = commandProcessScope.getStore()?.signal;
	return inherited ? AbortSignal.any(signal ? [inherited, signal] : [inherited]) : signal;
}
/** Cleanup helpers must outlive cancellation of the commands they are settling. */
function runOutsideCommandProcessScope(run) {
	return commandProcessScope.exit(run);
}
/** Join the command owner's cleanup separately from its bounded caller result. */
function retainCommandProcessCleanup(cleanup) {
	const scope = commandProcessScope.getStore();
	if (!scope) return;
	const settled = cleanup.then((result) => {
		if (result === "uncertain") scope.failure ??= { error: new CommandProcessCleanupError() };
	}, (error) => {
		scope.failure ??= { error };
	});
	scope.cleanups.add(settled);
	settled.then(() => scope.cleanups.delete(settled));
}
function retainCommandProcess(scope, child, reservation) {
	let pid;
	let startedAt = null;
	let stopped = false;
	let groupExtinct = false;
	let settlementFailed = false;
	let custodySettled = false;
	const settleCustody = () => {
		if (!reservation || settlementFailed || custodySettled) return;
		try {
			reservation.settled();
			custodySettled = true;
		} catch (error) {
			settlementFailed = true;
			throw error;
		}
	};
	const nativeChild = child.nodeChildProcess;
	let observedExit = nativeChild.exitCode != null || nativeChild.signalCode != null;
	const onExit = () => {
		observedExit = true;
	};
	nativeChild.once("exit", onExit);
	const closed = nativeChild instanceof BrokerChild ? nativeChild.waitForClose() : void 0;
	const stop = () => {
		if (stopped || pid === void 0 || process$1.platform === "win32") return;
		stopped = true;
		if (nativeChild.exitCode !== null || nativeChild.signalCode !== null) {
			if (!isChildProcessTreeAlive({ pid })) {
				groupExtinct = true;
				return;
			}
			const currentStart = getFileLockProcessStartTime(pid);
			if (currentStart !== null && currentStart !== startedAt) throw new CommandProcessCleanupError();
		}
		killProcessTree(pid, {
			detached: true,
			force: true
		});
		scheduleAdoptedChildZombieReapAfterExit(nativeChild, true);
	};
	const initialize = () => {
		pid = child.pid;
		if (pid !== void 0) try {
			if (process$1.platform !== "win32") startedAt = getFileLockProcessStartTime(pid);
			reservation?.spawned({
				pid,
				startedAt: getProcessInstanceStartTime(pid)
			});
			if (scope.signal.aborted) stop();
		} catch (error) {
			scope.failure ??= { error };
			stop();
			throw error;
		}
	};
	let bindingError;
	let readiness;
	if (nativeChild instanceof BrokerChild && child.pid === void 0) readiness = nativeChild.ready().then(initialize);
	else try {
		initialize();
		readiness = Promise.resolve();
	} catch (error) {
		bindingError = { error };
		readiness = Promise.reject(toErrorObject(error, "Command process custody admission failed"));
	}
	commandAdmissions.set(nativeChild, readiness);
	const completed = Promise.resolve(child).then(() => void 0, () => void 0).then(async () => {
		await closed;
		nativeChild.removeListener("exit", onExit);
	});
	const initialized = readiness.catch((error) => {
		if (!(nativeChild instanceof BrokerChild && nativeChild.notStarted)) scope.failure ??= { error };
	});
	const owned = {
		stop,
		async settle() {
			await initialized;
			await completed;
			if (groupExtinct) {
				settleCustody();
				return;
			}
			if (pid === void 0) {
				if (nativeChild instanceof BrokerChild && !nativeChild.notStarted) throw new CommandProcessCleanupError();
				settleCustody();
				return;
			}
			if (process$1.platform === "win32") {
				if (!observedExit) throw new CommandProcessCleanupError();
				settleCustody();
				return;
			}
			const groupPid = pid;
			if (await waitForCommandProcessGroupExit(groupPid, () => {
				const current = getFileLockProcessStartTime(groupPid);
				return current === null || current === startedAt;
			}) !== "exited") throw new CommandProcessCleanupError();
			settleCustody();
		}
	};
	scope.children.add(owned);
	completed.then(() => {
		if (pid === void 0 && (!(nativeChild instanceof BrokerChild) || nativeChild.notStarted) || pid !== void 0 && process$1.platform !== "win32" && !isChildProcessTreeAlive({ pid })) try {
			settleCustody();
			scope.children.delete(owned);
		} catch (error) {
			scope.failure ??= { error };
		}
	});
	if (bindingError) throw bindingError.error;
}
function commandCreatesChildPipes(options) {
	if ((options.ipc ?? (options.node === true || options.ipcInput !== void 0 || options.gracefulCancel === true)) || options.input !== void 0 || options.inputFile !== void 0) return true;
	const stdio = typeof options.stdio === "string" || options.stdio === void 0 ? [
		options.stdio,
		options.stdio,
		options.stdio
	] : options.stdio;
	return [
		options.stdin ?? stdio[0],
		options.stdout ?? stdio[1],
		options.stderr ?? stdio[2],
		...stdio.slice(3).filter((entry) => entry !== void 0)
	].some((entry) => entry !== "ignore" && entry !== "inherit" && !(typeof entry === "number" && entry >= 0));
}
function spawnCommandWithInvocation(argv, options = {}) {
	if (process$1.platform === "win32" && commandCreatesChildPipes(options)) assertAppContainerSpawnSupported();
	const scope = commandProcessScope.getStore();
	if (scope?.signal.aborted) throw new Error("Command process scope is closed");
	const { baseEnv, env, windowsVerbatimArguments, cancelSignal, executionTimeoutMs, inheritScopeCancellation = true, ...execaOptions } = options;
	const commandEnv = resolveCommandEnv({
		argv,
		baseEnv,
		env
	});
	const invocation = resolveSafeChildProcessInvocation({
		argv,
		cwd: execaOptions.cwd,
		env: commandEnv,
		windowsVerbatimArguments
	});
	const commandOptions = {
		...execaOptions,
		cancelSignal: inheritScopeCancellation ? resolveCommandProcessSignal(cancelSignal) : cancelSignal,
		...scope ? { killDescendants: true } : {},
		env: commandEnv,
		extendEnv: false,
		shell: false,
		windowsHide: invocation.windowsHide,
		windowsVerbatimArguments: invocation.windowsVerbatimArguments
	};
	const broker = getSpawnBroker();
	const remoteOptions = broker ? brokerExecaOptions(commandOptions) : void 0;
	if (remoteOptions && executionTimeoutMs !== void 0) remoteOptions.executionDeadlineMs = executionTimeoutMs + 1e3;
	const reservation = scope?.custody?.reserve([invocation.command, ...invocation.args]);
	const child = broker && remoteOptions ? spawnBrokerCommand(broker, [invocation.command, ...invocation.args], commandOptions, remoteOptions) : execa(invocation.command, invocation.args, commandOptions);
	const niceGit = argv[0] === "nice" && argv[1] === "-n" && argv[2] === "10" && argv[3] === "git";
	recordChildProcessSpawn(niceGit ? "git" : invocation.command, child.nodeChildProcess, void 0, niceGit ? argv.slice(4) : invocation.args);
	if (scope) retainCommandProcess(scope, child, reservation);
	return {
		child,
		invocation
	};
}
/** Spawn through the canonical argv, environment, and Windows safety boundary. */
function spawnCommand(argv, options = {}) {
	return spawnCommandWithInvocation(argv, options).child;
}
function resolveCommandEnv(params) {
	const baseEnv = params.baseEnv ?? process$1.env;
	const platform = params.platform ?? process$1.platform;
	const cmd = path.basename(params.argv[0] ?? "");
	const shouldSuppressNpmFund = cmd === "npm" || cmd === "npm.cmd" || cmd === "npm.exe" || (cmd === "node" || cmd === "node.exe") && (params.argv[1] ?? "").includes("npm-cli.js");
	const runtime = params.argv[0] ?? "";
	const paths = platform === "win32" ? path.win32 : path.posix;
	const explicitPackageManager = paths.isAbsolute(runtime) && /^(?:node|node\.exe)$/iu.test(paths.basename(runtime)) && /^(?:npm-cli\.js|npx-cli\.js|pnpm\.(?:cjs|js))$/iu.test(paths.basename(params.argv[1] ?? ""));
	const mergedEnv = mergeProcessEnv([baseEnv, params.env], platform);
	const resolvedEnv = explicitPackageManager ? withNodeRuntimePath(mergedEnv, runtime, platform) : mergedEnv;
	if (shouldSuppressNpmFund) {
		resolvedEnv.NPM_CONFIG_FUND ??= "false";
		resolvedEnv.npm_config_fund ??= "false";
	}
	return markOpenClawExecEnv(resolvedEnv);
}
//#endregion
//#region src/process/exec-termination.ts
const WINDOWS_TASKKILL_TIMEOUT_MS = 5e3;
function createCommandTerminationController(params) {
	let processTreeSettlement;
	let cleanup = "normal";
	const readOriginalStart = () => params.processTree && params.child.pid && process$1.platform !== "win32" ? getFileLockProcessStartTime(params.child.pid) : null;
	let awaitingSpawn = params.spawned !== void 0;
	let terminateWhenSpawned = false;
	let originalStart = awaitingSpawn ? null : readOriginalStart();
	let windowsTerminationPromise;
	const isDirectChildAlive = () => !params.isChildExited() && params.child.exitCode == null && params.child.signalCode == null;
	const spawnTaskkill = async (args) => {
		try {
			await runOutsideCommandProcessScope(() => spawnCommand([getWindowsSystem32ExePath("taskkill.exe"), ...args], {
				baseEnv: params.baseEnv,
				env: params.env,
				forceKillAfterDelay: 300,
				reject: false,
				stdio: "ignore",
				timeout: WINDOWS_TASKKILL_TIMEOUT_MS
			}));
		} catch {}
	};
	const startWindowsTermination = (childPid, graceful) => {
		const taskkills = [];
		windowsTerminationPromise = (async () => {
			if (graceful) {
				taskkills.push(spawnTaskkill([
					"/PID",
					String(childPid),
					"/T"
				]));
				await sleep(params.killGraceMs);
				if (isDirectChildAlive()) taskkills.push(spawnTaskkill([
					"/PID",
					String(childPid),
					"/T",
					"/F"
				]));
			} else taskkills.push(spawnTaskkill([
				"/PID",
				String(childPid),
				"/T",
				"/F"
			]));
			await Promise.allSettled(taskkills);
			if (!params.isCommandSettled()) params.cancelController.abort();
		})();
	};
	const terminate = () => {
		if (awaitingSpawn) {
			terminateWhenSpawned = true;
			return false;
		}
		const childPid = params.child.pid;
		const directChildAlive = isDirectChildAlive();
		if (process$1.platform === "win32" && !directChildAlive) return false;
		if (params.processTree && typeof childPid === "number") {
			if (process$1.platform === "win32") {
				startWindowsTermination(childPid, params.processTree.mode !== "force");
				return true;
			}
			const force = params.processTree.mode === "force" || params.killSignal === "SIGKILL" || params.killSignal === constants$1.signals.SIGKILL;
			if (processTreeSettlement) return !force;
			const groupAlive = () => isChildProcessTreeAlive({ pid: childPid });
			const forceAndObserve = async () => {
				const start = getFileLockProcessStartTime(childPid);
				if (start !== null && start !== originalStart) {
					cleanup = "uncertain";
					if (isDirectChildAlive()) params.cancelController.abort();
					return;
				}
				cleanup = "forced";
				killProcessTree(childPid, {
					force: true,
					detached: true
				});
				scheduleAdoptedChildZombieReapAfterExit(params.child, true);
				cleanup = await waitForCommandProcessGroupExit(childPid, () => {
					const current = getFileLockProcessStartTime(childPid);
					return current === null || current === originalStart;
				}) === "exited" ? "forced" : "uncertain";
			};
			if (!directChildAlive && !groupAlive()) return false;
			if (force) {
				processTreeSettlement = forceAndObserve();
				return false;
			}
			cleanup = "cooperative";
			try {
				process$1.kill(-childPid, params.killSignal ?? "SIGTERM");
			} catch (error) {
				if (error.code !== "ESRCH") cleanup = "uncertain";
			}
			scheduleAdoptedChildZombieReapAfterExit(params.child, true, params.killGraceMs + COMMAND_PROCESS_GROUP_EXIT_CONFIRMATION_MS);
			processTreeSettlement = new Promise((resolve) => {
				const deadline = Date.now() + params.killGraceMs;
				const check = () => {
					if (!groupAlive()) {
						cleanup = "cooperative";
						resolve();
						return;
					}
					if (Date.now() < deadline) {
						setTimeout(check, Math.min(25, deadline - Date.now()));
						return;
					}
					forceAndObserve().then(resolve);
				};
				check();
			});
			return true;
		}
		if (!directChildAlive) return false;
		if (process$1.platform === "win32" && typeof childPid === "number") {
			startWindowsTermination(childPid, false);
			return true;
		}
		return false;
	};
	const settle = async () => {
		if (windowsTerminationPromise) {
			await windowsTerminationPromise;
			return "forced";
		}
		await processTreeSettlement;
		return cleanup;
	};
	if (params.spawned) params.spawned.then(() => {
		originalStart = readOriginalStart();
		awaitingSpawn = false;
		if (terminateWhenSpawned && !terminate()) params.cancelController.abort();
	}, () => {
		awaitingSpawn = false;
	});
	return {
		terminate,
		settle
	};
}
//#endregion
//#region src/process/process-deadline.ts
/** Let pending child exit and output notifications run before accepting a deadline. */
function setProcessTimeout(callback, delayMs) {
	let decision;
	const timer = setTimeout(() => {
		decision = setTimeout(callback, 0);
	}, delayMs);
	return {
		clear() {
			clearTimeout(timer);
			clearTimeout(decision);
		},
		refresh() {
			clearTimeout(decision);
			decision = void 0;
			timer.refresh();
		}
	};
}
//#endregion
//#region src/process/exec-runner.ts
async function runCommandWithTimeout(argv, optionsOrTimeout) {
	return await runCommandWithOutputEncoding(argv, optionsOrTimeout, false);
}
/** Preserve the ordinary process lifecycle while deferring decoding to its consumer. */
async function runCommandBuffersWithTimeout(argv, optionsOrTimeout) {
	return await runCommandWithOutputEncoding(argv, optionsOrTimeout, false, true);
}
async function runCommandWithOutputEncoding(argv, optionsOrTimeout, forceUtf8, raw = false) {
	const options = typeof optionsOrTimeout === "number" ? { timeoutMs: optionsOrTimeout } : optionsOrTimeout;
	const { timeoutMs, cwd, input, stdinFileDescriptor, baseEnv, env, noOutputTimeoutMs, killProcessTree, killSignal, killGraceMs } = options;
	const signal = resolveCommandProcessSignal(options.signal);
	const resolvedTimeoutMs = typeof timeoutMs === "number" ? resolveTimerTimeoutMs(timeoutMs, 1) : void 0;
	if (options.requireProcessTreeExtinction && !killProcessTree) throw new Error("Process-tree extinction requires process-tree ownership");
	const hasInput = input !== void 0;
	if (stdinFileDescriptor !== void 0) {
		if (!Number.isInteger(stdinFileDescriptor) || stdinFileDescriptor < 0) throw new Error("stdinFileDescriptor must be a nonnegative integer");
		if (hasInput) throw new Error("Command accepts either input or stdinFileDescriptor, not both");
	}
	if (options.beforeInput && !hasInput) throw new Error("Child input admission requires explicit input");
	const resolvedKillGraceMs = resolveTimerTimeoutMs(killGraceMs, 300, 0);
	if (signal?.aborted) {
		const interrupted = {
			code: null,
			signal: null,
			killed: false,
			termination: "signal",
			cleanup: "normal",
			noOutputTimedOut: false
		};
		return raw ? {
			...interrupted,
			stdout: Buffer.alloc(0),
			stderr: Buffer.alloc(0),
			windowsEncoding: null
		} : {
			...interrupted,
			stdout: "",
			stderr: ""
		};
	}
	const stdoutCapture = createCapturedOutputBuffers();
	const stderrCapture = createCapturedOutputBuffers();
	const maxStdoutBytes = resolveMaxOutputBytes(options.maxOutputBytes, "stdout");
	const maxStderrBytes = resolveMaxOutputBytes(options.maxOutputBytes, "stderr");
	const maxCombinedOutputBytes = resolveOptionalIntegerOption(asPositiveFiniteNumber(options.maxCombinedOutputBytes), { min: 1 });
	const stdoutCaptureMode = resolveOutputCapture(options.outputCapture, "stdout");
	const stderrCaptureMode = resolveOutputCapture(options.outputCapture, "stderr");
	if (maxCombinedOutputBytes !== void 0 && stdoutCaptureMode !== stderrCaptureMode) throw new Error("maxCombinedOutputBytes requires matching stdout and stderr capture modes");
	const usesCombinedTailCapture = maxCombinedOutputBytes !== void 0 && stdoutCaptureMode === "tail" && stderrCaptureMode === "tail";
	const maxPreservedPendingLineBytes = Math.min(Math.max(maxStdoutBytes, maxStderrBytes), MAX_PRESERVED_PENDING_LINE_BYTES);
	const maxPreservedOutputLines = Math.max(0, Math.floor(options.maxPreservedOutputLines ?? 16));
	const windowsEncoding = forceUtf8 ? null : resolveWindowsConsoleEncoding();
	const cancelController = new AbortController();
	let termination;
	let childExitState;
	let commandSettled = false;
	let combinedOutputBytes = 0;
	let combinedCapturedBytes = 0;
	const outputBytesByStream = {
		stdout: 0,
		stderr: 0
	};
	const combinedCapturedBytesByStream = {
		stdout: 0,
		stderr: 0
	};
	const combinedTailChunks = [];
	let noOutputTimer;
	let eofGraceTimer;
	let outputObserverError;
	let outputErrorStream;
	let terminatingOutputError;
	const { child, invocation } = spawnCommandWithInvocation(argv, {
		buffer: false,
		cancelSignal: cancelController.signal,
		inheritScopeCancellation: false,
		cwd,
		detached: Boolean(killProcessTree && process$1.platform !== "win32"),
		encoding: "buffer",
		executionTimeoutMs: resolvedTimeoutMs,
		baseEnv,
		env,
		forceKillAfterDelay: resolvedKillGraceMs,
		killSignal,
		...hasInput && !options.beforeInput ? { input } : {},
		reject: false,
		stdio: [
			options.stdinFileDescriptor ?? (hasInput ? "pipe" : "inherit"),
			"pipe",
			"pipe"
		],
		stripFinalNewline: false,
		windowsVerbatimArguments: options.windowsVerbatimArguments
	});
	const startupReady = child.pid === void 0 ? waitForCommandSpawn(child) : void 0;
	let waitingForSpawn = startupReady !== void 0;
	const startupCanceled = createDeferredCore();
	const nodeChild = child.nodeChildProcess;
	let inputReleased = options.beforeInput ? false : void 0;
	const failedProcess = (error, cleanup = "uncertain") => {
		const failure = recordCommandProcessFailure(error, {
			pid: nodeChild.pid,
			code: childExitState?.code ?? nodeChild.exitCode ?? null,
			cleanup,
			inputReleased,
			termination: termination === "output-limit" ? "signal" : termination ?? (nodeChild.signalCode ? "signal" : "exit")
		});
		return Object.assign(failure, { cleanup });
	};
	const ownsExitedProcessTree = Boolean(killProcessTree && process$1.platform !== "win32");
	const resolvedNoOutputTimeoutMs = clampPositiveTimerTimeoutMs(noOutputTimeoutMs);
	const ownsOutputDeadline = ownsExitedProcessTree && (resolvedTimeoutMs !== void 0 || resolvedNoOutputTimeoutMs !== void 0);
	let releaseOutput;
	const terminationController = createCommandTerminationController({
		child: nodeChild,
		spawned: startupReady,
		cancelController,
		baseEnv,
		env,
		processTree: killProcessTree ? { mode: "graceful" } : void 0,
		isChildExited: () => childExitState !== void 0,
		isCommandSettled: () => commandSettled,
		killGraceMs: resolvedKillGraceMs,
		killSignal
	});
	const processCleanup = (async () => {
		await child.then(() => void 0, () => void 0);
		commandSettled = true;
		await startupReady?.catch(() => {});
		return await terminationController.settle();
	})();
	retainCommandProcessCleanup(processCleanup);
	processCleanup.catch(() => {});
	nodeChild.once("exit", (code, signalValue) => {
		childExitState = {
			code,
			signal: signalValue
		};
		if (!ownsOutputDeadline || code !== 0 || termination) releaseOutput = releaseChildProcessOutputAfterExit(nodeChild);
		if (killProcessTree && !termination && (code !== 0 || options.requireProcessTreeExtinction)) terminationController.terminate();
	});
	const cancel = (reason, eofGraceElapsed = false) => {
		if (termination || commandSettled || childExitState && reason !== "output-limit" && (!ownsExitedProcessTree || childExitState.code !== 0)) return;
		if ((reason === "timeout" || reason === "no-output-timeout") && (childExitState || hasChildProcessExited(nodeChild))) {
			if (!ownsOutputDeadline || (childExitState?.code ?? nodeChild.exitCode) !== 0) return;
			if ((!nodeChild.stdout || nodeChild.stdout.readableEnded) && (!nodeChild.stderr || nodeChild.stderr.readableEnded)) return;
			if (!eofGraceElapsed) {
				eofGraceTimer ??= setProcessTimeout(() => cancel(reason, true), 100);
				return;
			}
		}
		eofGraceTimer?.clear();
		termination = reason;
		if (waitingForSpawn) startupCanceled.resolve(reason);
		if (childExitState) releaseOutput ??= releaseChildProcessOutputAfterExit(nodeChild);
		if (!terminationController.terminate()) cancelController.abort();
	};
	const armNoOutputTimer = () => {
		if (resolvedNoOutputTimeoutMs === void 0 || commandSettled || termination || childExitState && !ownsExitedProcessTree) return;
		if (noOutputTimer) noOutputTimer.refresh();
		else noOutputTimer = setProcessTimeout(() => cancel("no-output-timeout"), resolvedNoOutputTimeoutMs);
	};
	const timeoutTimer = resolvedTimeoutMs === void 0 ? void 0 : setProcessTimeout(() => cancel("timeout"), resolvedTimeoutMs);
	const onAbort = () => cancel("signal");
	signal?.addEventListener("abort", onAbort, { once: true });
	armNoOutputTimer();
	const clearTimers = () => {
		timeoutTimer?.clear();
		noOutputTimer?.clear();
		eofGraceTimer?.clear();
		noOutputTimer = void 0;
		signal?.removeEventListener("abort", onAbort);
	};
	if (startupReady) {
		let interrupted;
		try {
			interrupted = await Promise.race([startupReady.then(() => void 0), startupCanceled.promise]);
		} catch (error) {
			clearTimers();
			throw failedProcess(error, nodeChild instanceof BrokerChild && nodeChild.notStarted ? "normal" : "uncertain");
		}
		if (interrupted) {
			clearTimers();
			processCleanup.finally(() => releaseOutput?.()).catch(() => {});
			const stopped = {
				pid: nodeChild.pid,
				code: interrupted === "timeout" || interrupted === "no-output-timeout" ? 124 : null,
				signal: null,
				killed: nodeChild.killed,
				cleanup: "uncertain",
				termination: interrupted === "output-limit" ? "signal" : interrupted,
				noOutputTimedOut: interrupted === "no-output-timeout",
				outputLimitExceeded: interrupted === "output-limit" || void 0
			};
			return raw ? {
				...stopped,
				stdout: Buffer.alloc(0),
				stderr: Buffer.alloc(0),
				windowsEncoding
			} : {
				...stopped,
				stdout: "",
				stderr: ""
			};
		}
		waitingForSpawn = false;
	}
	const captureOutput = (capture, buffer, maxBytes, stream, captureMode) => {
		outputBytesByStream[stream] += buffer.byteLength;
		const streamLimitExceeded = outputBytesByStream[stream] > maxBytes;
		if (maxCombinedOutputBytes === void 0) {
			appendCapturedOutput(capture, buffer, maxBytes, captureMode);
			if (streamLimitExceeded && shouldTerminateOnOutput(options.terminateOnOutputLimit, stream)) cancel("output-limit");
			return;
		}
		const combinedBytesBeforeChunk = combinedOutputBytes;
		combinedOutputBytes += buffer.byteLength;
		const combinedLimitExceeded = combinedOutputBytes > maxCombinedOutputBytes;
		if (usesCombinedTailCapture) {
			combinedTailChunks.push({
				stream,
				buffer
			});
			combinedCapturedBytes += buffer.byteLength;
			combinedCapturedBytesByStream[stream] += buffer.byteLength;
			const removeCapturedBytes = (index, requestedBytes) => {
				const entry = expectDefined(combinedTailChunks[index], "combined tail chunk");
				const removedBytes = Math.min(requestedBytes, entry.buffer.byteLength);
				if (removedBytes === entry.buffer.byteLength) combinedTailChunks.splice(index, 1);
				else entry.buffer = Buffer.from(entry.buffer.subarray(removedBytes));
				combinedCapturedBytes -= removedBytes;
				combinedCapturedBytesByStream[entry.stream] -= removedBytes;
				(entry.stream === "stdout" ? stdoutCapture : stderrCapture).truncatedBytes += removedBytes;
			};
			while (combinedCapturedBytesByStream[stream] > maxBytes) {
				const index = combinedTailChunks.findIndex((entry) => entry.stream === stream);
				if (index < 0) break;
				removeCapturedBytes(index, combinedCapturedBytesByStream[stream] - maxBytes);
			}
			let combinedOverflow = combinedCapturedBytes - maxCombinedOutputBytes;
			while (combinedOverflow > 0) {
				removeCapturedBytes(0, combinedOverflow);
				combinedOverflow = combinedCapturedBytes - maxCombinedOutputBytes;
			}
		} else {
			const remaining = Math.max(0, maxCombinedOutputBytes - combinedBytesBeforeChunk);
			appendCapturedOutput(capture, buffer, Math.min(maxBytes, capture.bytes + remaining), captureMode);
		}
		if (combinedLimitExceeded && shouldTerminateOnOutput(options.terminateOnOutputLimit, "combined") || streamLimitExceeded && shouldTerminateOnOutput(options.terminateOnOutputLimit, stream)) cancel("output-limit");
	};
	const observeOutputChunk = (chunk, stream) => {
		const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		if (termination || !options.onOutputChunk) return buffer;
		try {
			if (options.onOutputChunk(buffer, stream) === false) cancel("output-limit");
		} catch (error) {
			outputObserverError = error;
			cancel("output-limit");
		}
		return buffer;
	};
	const onOutputError = (error, stream) => {
		outputErrorStream ??= stream;
		if (termination || options.tolerateOutputError?.[stream] === true || !shouldTerminateOnOutput(options.terminateOnOutputError, stream)) return;
		terminatingOutputError = toErrorObject(error, `Command ${stream} stream failed`);
		Object.assign(terminatingOutputError, { outputErrorStream: stream });
		cancel("signal");
	};
	child.stdout?.once("error", (error) => onOutputError(error, "stdout"));
	child.stderr?.once("error", (error) => onOutputError(error, "stderr"));
	const outputStreams = [{
		stream: "stdout",
		capture: stdoutCapture,
		maxBytes: maxStdoutBytes,
		mode: stdoutCaptureMode
	}, {
		stream: "stderr",
		capture: stderrCapture,
		maxBytes: maxStderrBytes,
		mode: stderrCaptureMode
	}];
	for (const { stream, capture, maxBytes, mode } of outputStreams) child[stream]?.on("data", (chunk) => {
		const buffer = observeOutputChunk(chunk, stream);
		appendPreservedOutputLines({
			capture,
			chunk: buffer,
			stream,
			preserveOutputLine: options.preserveOutputLine,
			maxPreservedOutputLines,
			maxPendingLineBytes: maxPreservedPendingLineBytes
		});
		captureOutput(capture, buffer, maxBytes, stream, mode);
		armNoOutputTimer();
	});
	let inputAdmissionError;
	if (options.beforeInput) {
		nodeChild.stdin?.once("error", (cause) => {
			if (hasNodeErrorCode(cause, "EPIPE")) return;
			inputAdmissionError ??= toErrorObject(cause, "Command input failed");
			cancel("signal");
		});
		try {
			if (nodeChild.pid === void 0 || !nodeChild.stdin) throw new Error("Child input admission has no spawned process");
			const admitted = options.beforeInput(nodeChild.pid, nodeChild.spawnargs);
			if (admitted !== void 0) {
				if (isPromiseLike(admitted)) Promise.resolve(admitted).catch(() => void 0);
				throw new TypeError("Child input admission must complete synchronously");
			}
			inputReleased = true;
			nodeChild.stdin.end(input);
		} catch (cause) {
			inputAdmissionError = toErrorObject(cause, "Child input admission failed");
			cancel("signal");
		}
	}
	const result = await child.finally(() => {
		commandSettled = true;
		clearTimers();
		releaseOutput?.();
	}).catch((error) => {
		throw failedProcess(error);
	});
	if (result.timedOut) termination ??= "timeout";
	let cleanup = await processCleanup.catch((error) => {
		throw failedProcess(error);
	});
	const resolvedSignal = result.signal ?? childExitState?.signal ?? nodeChild.signalCode ?? null;
	if (cleanup === "normal" && resolvedSignal) cleanup = "uncertain";
	if (inputAdmissionError) throw failedProcess(inputAdmissionError, cleanup);
	if (terminatingOutputError) throw failedProcess(terminatingOutputError, cleanup);
	if (outputObserverError !== void 0) throw failedProcess(toErrorObject(outputObserverError, "Command output observer failed"), cleanup);
	const isCauseLessWindowsShimResult = !termination && invocation.usesWindowsExitCodeShim && typeof nodeChild.pid === "number" && result.code === void 0 && result.cause === void 0 && !result.timedOut && !result.isCanceled && !result.isMaxBuffer && !result.isTerminated;
	if (result.failed && !termination && !isPlainCommandExitFailure(result) && !isPlainCommandSignalFailure(result) && !isCauseLessWindowsShimResult && !(result.exitCode === 0 && outputErrorStream !== void 0 && options.tolerateOutputError?.[outputErrorStream] === true)) {
		const error = createSanitizedCommandError(result);
		const failedCleanup = typeof nodeChild.pid === "number" ? cleanup === "normal" ? "uncertain" : cleanup : "normal";
		if (outputErrorStream) Object.assign(error, { outputErrorStream });
		throw failedProcess(error, failedCleanup);
	}
	const killIssuedByAbort = termination === "signal" || termination === "output-limit";
	const resolvedCode = resolveProcessExitCode({
		explicitCode: result.exitCode ?? childExitState?.code,
		childExitCode: nodeChild.exitCode,
		resolvedSignal,
		usesWindowsExitCodeShim: invocation.usesWindowsExitCodeShim,
		timedOut: termination === "timeout",
		noOutputTimedOut: termination === "no-output-timeout",
		killIssuedByTimeout: termination === "timeout" || termination === "no-output-timeout",
		killIssuedByAbort
	});
	termination ??= resolvedSignal != null || result.isTerminated ? "signal" : "exit";
	const normalizedCode = termination === "timeout" || termination === "no-output-timeout" ? resolvedCode == null || resolvedCode === 0 ? 124 : resolvedCode : resolvedCode;
	for (const { stream, capture } of outputStreams) flushPreservedOutputLine({
		capture,
		stream,
		preserveOutputLine: options.preserveOutputLine,
		maxPreservedOutputLines,
		maxPendingLineBytes: maxPreservedPendingLineBytes
	});
	if (usesCombinedTailCapture) for (const entry of combinedTailChunks) {
		const capture = entry.stream === "stdout" ? stdoutCapture : stderrCapture;
		capture.chunks.push(entry.buffer);
		capture.bytes += entry.buffer.byteLength;
	}
	const stdout = finalizeCapturedOutput(stdoutCapture, stdoutCaptureMode, forceUtf8);
	const stderr = finalizeCapturedOutput(stderrCapture, stderrCaptureMode, forceUtf8);
	const settled = {
		pid: nodeChild.pid,
		stdoutTruncatedBytes: stdoutCapture.truncatedBytes || void 0,
		stderrTruncatedBytes: stderrCapture.truncatedBytes || void 0,
		preservedStdoutLines: stdoutCapture.preservedLines.length > 0 ? stdoutCapture.preservedLines : void 0,
		preservedStderrLines: stderrCapture.preservedLines.length > 0 ? stderrCapture.preservedLines : void 0,
		code: normalizedCode,
		signal: resolvedSignal,
		killed: nodeChild.killed,
		killIssuedByAbort: killIssuedByAbort || void 0,
		cleanup,
		termination: termination === "output-limit" ? "signal" : termination,
		noOutputTimedOut: termination === "no-output-timeout",
		outputLimitExceeded: termination === "output-limit" || void 0,
		...outputErrorStream ? { outputErrorStream } : {}
	};
	return raw ? {
		...settled,
		stdout,
		stderr,
		windowsEncoding
	} : {
		...settled,
		stdout: forceUtf8 ? stdout.toString("utf8") : decodeWindowsOutputBuffer({
			buffer: stdout,
			windowsEncoding
		}),
		stderr: forceUtf8 ? stderr.toString("utf8") : decodeWindowsOutputBuffer({
			buffer: stderr,
			windowsEncoding
		})
	};
}
//#endregion
//#region src/process/exec.ts
/** Run a one-shot command with raw, independently capped stdout and stderr buffers. */
async function runCommandBuffered(argv, options = {}) {
	if (options.signal?.aborted) return {
		stdout: Buffer.alloc(0),
		stderr: Buffer.alloc(0),
		code: null,
		signal: null,
		killed: false,
		termination: "signal",
		...options.signal.reason instanceof Error ? { error: options.signal.reason } : {}
	};
	const chunks = {
		stdout: [],
		stderr: []
	};
	const capturedBytes = {
		stdout: 0,
		stderr: 0
	};
	const maxCombinedOutputBytes = resolveOptionalIntegerOption(asPositiveFiniteNumber(options.maxCombinedOutputBytes), { min: 1 });
	let outputLimitStream;
	const appendChunk = (chunk, stream) => {
		if (options.discardOutput?.[stream]) return true;
		const maxBytes = resolveMaxOutputBytes(options.maxOutputBytes, stream);
		const combinedBytes = capturedBytes.stdout + capturedBytes.stderr;
		const combinedRemaining = maxCombinedOutputBytes === void 0 ? Number.POSITIVE_INFINITY : Math.max(0, maxCombinedOutputBytes - combinedBytes);
		const remaining = Math.max(0, Math.min(maxBytes - capturedBytes[stream], combinedRemaining));
		if (remaining > 0) {
			const captured = Buffer.from(chunk.subarray(0, remaining));
			chunks[stream].push(captured);
			capturedBytes[stream] += captured.byteLength;
		}
		if (chunk.byteLength > remaining) {
			outputLimitStream ??= stream;
			return false;
		}
		return true;
	};
	const capturedOutput = (stream) => Buffer.concat(chunks[stream], capturedBytes[stream]);
	try {
		const result = await runCommandWithTimeout(argv, {
			baseEnv: options.baseEnv,
			cwd: options.cwd,
			env: options.env,
			input: options.input,
			killProcessTree: options.killProcessTree ?? true,
			killGraceMs: options.killGraceMs,
			onOutputChunk: appendChunk,
			outputCapture: "discard",
			signal: options.signal,
			timeoutMs: options.timeoutMs,
			tolerateOutputError: {
				stdout: options.discardOutput?.stdout || options.tolerateOutputError?.stdout,
				stderr: options.discardOutput?.stderr || options.tolerateOutputError?.stderr
			},
			terminateOnOutputError: options.terminateOnOutputError
		});
		const termination = result.outputLimitExceeded ? "output-limit" : result.termination === "no-output-timeout" ? "timeout" : result.termination;
		return {
			stdout: capturedOutput("stdout"),
			stderr: capturedOutput("stderr"),
			code: termination === "exit" ? result.code : null,
			signal: result.signal,
			killed: result.killed,
			termination,
			...outputLimitStream ? { outputLimitStream } : {},
			...result.outputErrorStream ? { errorStream: result.outputErrorStream } : {},
			...result.cleanup === "uncertain" ? { error: new CommandProcessCleanupError() } : {}
		};
	} catch (error) {
		const commandError = error instanceof Error ? error : /* @__PURE__ */ new Error("Command execution failed");
		const metadata = commandError;
		const errorStream = metadata.outputErrorStream === "stdout" || metadata.outputErrorStream === "stderr" ? metadata.outputErrorStream : void 0;
		return {
			stdout: capturedOutput("stdout"),
			stderr: capturedOutput("stderr"),
			code: typeof metadata.exitCode === "number" ? metadata.exitCode : null,
			signal: null,
			killed: false,
			termination: "error",
			...errorStream ? { errorStream } : {},
			error: readCommandProcessFailure(commandError)?.cleanup === "uncertain" && !hasCommandProcessCleanupError(commandError) ? new CommandProcessCleanupError({ cause: commandError }) : commandError
		};
	}
}
//#endregion
//#region src/infra/git-network-retry.ts
const log = createSubsystemLogger("git/network");
const RETRY_DELAY_MS = 1e3;
/** Resolve owner-prepared Git argv without mistaking a global option value for a command. */
function gitCommandName(args) {
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];
		if ([
			"-c",
			"-C",
			"--git-dir",
			"--work-tree",
			"--namespace",
			"--config-env"
		].includes(arg)) index += 1;
		else if (/^(?:-c.+|-C.+|--(?:git-dir|work-tree|namespace|config-env|attr-source)=.+)$/u.test(arg) || [
			"--no-optional-locks",
			"--no-lazy-fetch",
			"--no-replace-objects",
			"--bare",
			"--literal-pathspecs",
			"--no-pager"
		].includes(arg)) continue;
		else return arg;
	}
}
/** Clone retries require destination cleanup by the clone owner, not this argv classifier. */
function retryableGitNetworkOperation(args) {
	const command = gitCommandName(args);
	return command === "fetch" || command === "ls-remote" ? command : void 0;
}
function isTransientGitFailure(operation, result) {
	if (result.termination !== "exit" || result.code === null || result.code === 0 || result.killed || result.signal || result.outputLimitExceeded || result.outputErrorStream || result.cleanup === "uncertain") return false;
	const stderr = typeof result.stderr === "string" ? result.stderr : Buffer.from(result.stderr).toString("utf8");
	if (/authentication failed|permission denied|access denied|repository not found|could not read username|couldn't find remote ref|not our ref|certificate|host key verification failed|no space left|disk quota|bad object|returned error: (?:401|403|404)\b/iu.test(stderr)) return false;
	if (/cannot lock ref/iu.test(stderr)) return operation === "fetch" && /cannot lock ref '[^']+': (?:is at \S+ but expected \S+|Unable to create '[^']+\.lock': File exists)/iu.test(stderr);
	return /did not send all necessary objects|could not resolve (?:host|proxy)|temporary failure in name resolution|failed to connect|connection (?:reset|timed out|refused|closed)|remote end hung up unexpectedly|unexpected disconnect|early EOF|empty reply from server|TLS connection was non-properly terminated|SSL_ERROR_SYSCALL|HTTP\/2.*(?:stream|internal_error)|RPC failed; curl (?:5|6|7|18|28|35|52|55|56|92)\b|returned error: (?:408|429|500|502|503|504)\b/iu.test(stderr);
}
/** Retry one settled network read inside its original deadline and caller-owned admission. */
async function withGitNetworkRetry(operation, options, run) {
	const started = performance$1.now();
	const attempt = (timeoutMs) => {
		const start = () => {
			options.beforeRun?.();
			return run(timeoutMs);
		};
		return options.startRun ? options.startRun(start) : start();
	};
	const result = await attempt(options.timeoutMs);
	if (!operation || !isTransientGitFailure(operation, result)) return result;
	const cancelled = () => ({
		...result,
		code: null,
		signal: null,
		termination: "signal"
	});
	if (options.signal?.aborted) return cancelled();
	if (options.timeoutMs - (performance$1.now() - started) <= RETRY_DELAY_MS) return result;
	log.warn(`Git ${operation} hit a transient failure; retrying once`, {
		operation,
		attempt: 1,
		maxAttempts: 2,
		delayMs: RETRY_DELAY_MS,
		exitCode: result.code
	});
	try {
		await sleepWithAbort(RETRY_DELAY_MS, options.signal);
	} catch (error) {
		if (options.signal?.aborted) return cancelled();
		throw error;
	}
	if (options.signal?.aborted) return cancelled();
	const remainingMs = Math.floor(options.timeoutMs - (performance$1.now() - started));
	if (remainingMs <= 0) return result;
	return await attempt(remainingMs);
}
//#endregion
//#region src/infra/fixed-window-rate-limit.ts
/** Process-local fixed-window quota; distributed limits require caller-owned persistence. */
function createFixedWindowBudget(params) {
	const maxRequests = resolveIntegerOption(params.maxRequests, 1, { min: 1 });
	const windowMs = resolveIntegerOption(params.windowMs, 1, { min: 1 });
	const now = params.now ?? Date.now;
	let count = 0;
	let windowStartMs = 0;
	return {
		consume() {
			const nowMs = now();
			if (nowMs - windowStartMs >= windowMs) {
				windowStartMs = nowMs;
				count = 0;
			}
			if (count >= maxRequests) return {
				allowed: false,
				retryAfterMs: Math.max(0, windowStartMs + windowMs - nowMs),
				remaining: 0
			};
			count += 1;
			return {
				allowed: true,
				retryAfterMs: 0,
				remaining: Math.max(0, maxRequests - count)
			};
		},
		reset() {
			count = 0;
			windowStartMs = 0;
		}
	};
}
//#endregion
//#region src/infra/git-operation-timing.ts
const diagnosticNow = () => performance$1.now();
const operations = {
	"ref-mutation": {
		stateKey: "openclaw.gitRefMutationDiagnostics",
		message: "slow Git ref mutation",
		phases: [
			"resolveMs",
			"queueWaitMs",
			"queuedOperationMs"
		]
	},
	"worktree-removal": {
		stateKey: "openclaw.worktreeRemovalDiagnostics",
		message: "slow managed worktree removal",
		phases: [
			"admissionMs",
			"bodyMs",
			"finalizeMs"
		]
	},
	"content-read": {
		stateKey: "openclaw.gitContentReadDiagnostics",
		message: "slow Git content read",
		phases: [
			"firstHostRequestMs",
			"workerMs",
			"settlementMs"
		]
	}
};
const removalStages = [
	["preparation", "preparationMs"],
	["snapshot", "snapshotMs"],
	["checkoutRemoval", "checkoutRemovalMs"],
	["finalization", "bodyFinalizeMs"]
];
function startGitOperationTiming(kind, log, details) {
	try {
		if (kind !== "worktree-removal" && (!areDiagnosticsEnabledForProcess() || !log.isEnabled("info"))) return;
		const startedAt = performance$1.now();
		const trace = getActiveDiagnosticTraceContext();
		const operation = operations[kind];
		let firstPhaseEnd;
		let secondPhaseEnd;
		let removalStage;
		let failedRemovalStage;
		let removalStageStartedAt = 0;
		let removalDurations;
		let inventory;
		return {
			recordInventory(counts) {
				inventory = counts;
			},
			removalProgress() {
				return {
					stage: failedRemovalStage ?? removalStage ?? "preparation",
					elapsedMs: Math.round(performance$1.now() - startedAt)
				};
			},
			markRemovalFailure() {
				failedRemovalStage ??= removalStage;
			},
			markPhase() {
				if (firstPhaseEnd === void 0) firstPhaseEnd = performance$1.now();
				else secondPhaseEnd = performance$1.now();
			},
			markRemovalStage(next) {
				if (kind !== "worktree-removal") return;
				try {
					const now = performance$1.now();
					if (removalStage !== void 0) {
						removalDurations ??= {};
						removalDurations[removalStage] = (removalDurations[removalStage] ?? 0) + now - removalStageStartedAt;
					}
					removalStage = next;
					removalStageStartedAt = now;
				} catch {
					removalStage = void 0;
					removalDurations = void 0;
				}
			},
			finish(outcome) {
				try {
					const endedAt = performance$1.now();
					const durationMs = endedAt - startedAt;
					if (durationMs < 1e3 || !areDiagnosticsEnabledForProcess() || !log.isEnabled("info")) return;
					const state = resolveGlobalSingleton(Symbol.for(operation.stateKey), () => ({
						budget: createFixedWindowBudget({
							maxRequests: 60,
							windowMs: 6e4,
							now: diagnosticNow
						}),
						omitted: 0
					}));
					if (!state.budget.consume().allowed) {
						state.omitted = Math.min(Number.MAX_SAFE_INTEGER, state.omitted + 1);
						return;
					}
					const fields = {
						pid: process.pid,
						threadId,
						isMainThread,
						durationMs: Math.round(durationMs),
						[operation.phases[0]]: Math.round((firstPhaseEnd ?? endedAt) - startedAt),
						...firstPhaseEnd !== void 0 && secondPhaseEnd !== void 0 ? {
							[operation.phases[1]]: Math.round(secondPhaseEnd - firstPhaseEnd),
							[operation.phases[2]]: Math.round(endedAt - secondPhaseEnd)
						} : {},
						...Object.fromEntries(removalStages.flatMap(([stage, field]) => {
							const elapsed = removalDurations?.[stage];
							return elapsed === void 0 ? [] : [[field, Math.round(elapsed)]];
						})),
						callbackEntered: (kind === "ref-mutation" ? secondPhaseEnd : firstPhaseEnd) !== void 0,
						outcome,
						omittedObservations: state.omitted,
						...details?.(),
						...kind === "worktree-removal" ? {
							tracked: inventory?.tracked ?? null,
							untracked: inventory?.untracked ?? null
						} : {}
					};
					runWithDiagnosticTraceContext(trace, () => log.info(kind !== "ref-mutation" ? `${operation.message} ${JSON.stringify(fields)}` : operation.message, fields));
					state.omitted = 0;
				} catch {}
			}
		};
	} catch {
		return;
	}
}
/** Inspection consumes local objects; only explicit transfers may hydrate a partial clone. */
function gitReadOnlyEnvironment(args, env = process.env) {
	const command = gitCommandName(args);
	return command && (/^(?:cat-file|check-attr|check-ignore|config|describe|diff|diff-files|diff-index|diff-tree|for-each-ref|log|ls-files|ls-tree|merge-base|name-rev|rev-list|rev-parse|show|show-ref|status)$/.test(command) || command === "worktree" && args[args.indexOf(command) + 1] === "list" || command === "branch" && args.includes("--list")) ? {
		...env,
		GIT_NO_LAZY_FETCH: "1"
	} : env;
}
var GitCommandTimeoutError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "GitCommandTimeoutError";
	}
};
const gitRefMutations = resolveGlobalSingleton(Symbol.for("openclaw.gitRefMutations"), () => new KeyedAsyncQueue());
const refMutationLog = createSubsystemLogger("git/ref-mutation");
async function enqueueGitRefMutation(cwd, commonDirectory, run, signal) {
	const timing = startGitOperationTiming("ref-mutation", refMutationLog);
	let outcome = "threw";
	const admitted = {
		run,
		signal,
		timing,
		completion: createDeferredCore()
	};
	let waiting = admitted;
	const abort = () => {
		const cancelled = waiting;
		waiting = void 0;
		cancelled?.completion.reject(cancelled.signal?.reason);
	};
	try {
		signal?.throwIfAborted();
		const commonPath = normalizeGitPathForFilesystem(commonDirectory);
		const commonDir = await fs$1.realpath(path.resolve(cwd, commonPath));
		signal?.throwIfAborted();
		const key = process.platform === "win32" ? commonDir.toLowerCase() : commonDir;
		timing?.markPhase();
		signal?.addEventListener("abort", abort, { once: true });
		gitRefMutations.enqueue(key, async () => {
			const active = waiting;
			waiting = void 0;
			if (!active) return;
			try {
				active.signal?.removeEventListener("abort", abort);
				active.timing?.markPhase();
				active.completion.resolve(await active.run());
			} catch (error) {
				active.completion.reject(error);
			}
		}).catch((error) => waiting?.completion.reject(error));
		const result = await admitted.completion.promise;
		outcome = "returned";
		return result;
	} finally {
		signal?.removeEventListener("abort", abort);
		timing?.finish(outcome);
	}
}
function normalizeGitPathForFilesystem(value, platform = process.platform) {
	if (platform !== "win32") return value;
	const match = /^\/([a-zA-Z])(?:\/(.*))?$/.exec(value);
	const drive = match?.[1];
	if (!drive) return value;
	return path.win32.normalize(`${drive.toUpperCase()}:/${match[2] ?? ""}`);
}
function gitCommandArgv(cwd, args, config = []) {
	return [
		"git",
		...config.flatMap((value) => ["-c", value]),
		...process.platform === "win32" ? ["-c", "core.longpaths=true"] : [],
		"-C",
		cwd,
		...args
	];
}
function gitExecutionArgv(cwd, args, options) {
	const argv = gitCommandArgv(cwd, args, options.killProcessTree ? ["maintenance.autoDetach=false", "gc.autoDetach=false"] : []);
	return options.lowerPriority && process.platform !== "win32" ? [
		"nice",
		"-n",
		"10",
		...argv
	] : argv;
}
async function executeGitCommand(cwd, args, options = {}) {
	return withGitProcessOperation(options.operation, () => executeGitCommandWithOutput(runCommandWithTimeout, cwd, args, options));
}
/** The same command/timeout contract, with output bytes owned by a worker consumer. */
async function executeGitCommandBytes(cwd, args, options = {}) {
	return withGitProcessOperation(options.operation, () => executeGitCommandWithOutput(runCommandBuffersWithTimeout, cwd, args, options));
}
async function executeGitCommandWithOutput(run, cwd, args, options) {
	const env = gitReadOnlyEnvironment(args, options.env ?? {});
	const timeoutMs = options.timeoutMs ?? 12e4;
	const argv = gitExecutionArgv(cwd, args, options);
	if (options.waitForExit === true) {
		const start = () => {
			options.beforeRun?.();
			return run(argv, {
				...options,
				env,
				timeoutMs: void 0
			});
		};
		return {
			...await (options.startRun ? options.startRun(start) : start()),
			timeoutMs: 0
		};
	}
	return {
		...await withGitNetworkRetry(retryableGitNetworkOperation(args), {
			...options,
			timeoutMs
		}, (attemptTimeoutMs) => run(argv, {
			...options,
			env,
			timeoutMs: attemptTimeoutMs
		})),
		timeoutMs
	};
}
async function executeGitCommandBuffered(cwd, args, options = {}) {
	const env = gitReadOnlyEnvironment(args, options.env ?? {});
	const argv = gitExecutionArgv(cwd, args, {
		...options,
		killProcessTree: options.killProcessTree !== false
	});
	return await withGitProcessOperation(options.operation, () => withGitNetworkRetry(retryableGitNetworkOperation(args), {
		...options,
		timeoutMs: options.timeoutMs ?? 12e4
	}, (timeoutMs) => runCommandBuffered(argv, {
		...options,
		env,
		timeoutMs
	})));
}
//#endregion
//#region src/infra/git-worker-context.ts
const context = new AsyncLocalStorage();
const errorOrigins = /* @__PURE__ */ new WeakMap();
function serializeGitWorkerFailure(error) {
	const code = asOptionalRecord(error)?.code;
	return {
		name: error instanceof Error ? error.name : "Error",
		message: error instanceof Error ? error.message : String(error),
		...typeof code === "string" || typeof code === "number" ? { code } : {},
		...error instanceof Error && errorOrigins.has(error) ? { origin: errorOrigins.get(error) } : {}
	};
}
function restoreGitWorkerFailure(failure) {
	const error = failure.name === "WorktreeRepositoryError" ? new WorktreeRepositoryError(failure.message) : failure.name === "GitCommandTimeoutError" ? new GitCommandTimeoutError(failure.message) : new Error(failure.message);
	error.name = failure.name;
	if (failure.code !== void 0) Object.assign(error, { code: failure.code });
	if (failure.origin !== void 0) errorOrigins.set(error, failure.origin);
	return error;
}
function hasGitWorkerContext() {
	return context.getStore() !== void 0;
}
async function requestHost(request) {
	const state = context.getStore();
	if (!state || state.closed) throw new Error("Git operation requires its worker host");
	const transfers = [];
	if (request.type === "workspace.inventory.write") {
		const bytes = ownedWorkerBytes(request.input.bytes);
		request.input.bytes = bytes;
		transfers.push(bytes.buffer);
	}
	if ((request.type === "git.text" || request.type === "git.buffer") && request.input.options.input instanceof Uint8Array) {
		const input = Uint8Array.from(request.input.options.input);
		request.input.options.input = input;
		transfers.push(input.buffer);
	}
	return await new Promise((resolve, reject) => {
		state.pending.push({
			request,
			transfers,
			resolve,
			reject
		});
		state.drain ??= Promise.resolve().then(() => drainHostRequests(state));
	});
}
/** Independent Git reads keep their parallelism inside the pool's serial host channel. */
async function drainHostRequests(state) {
	try {
		while (state.pending.length > 0) {
			const pending = state.pending.splice(0, 16);
			try {
				if (state.closed) throw new Error("Git operation closed before host execution");
				const batch = {
					type: "git.batch",
					input: { requests: pending.map((entry) => entry.request) }
				};
				const response = await state.channel.request(batch, pending.flatMap((entry) => entry.transfers));
				try {
					const replies = response.input;
					if (!Array.isArray(replies) || replies.length !== pending.length) throw new Error("Git host returned an incomplete batch");
					for (const [index, entry] of pending.entries()) {
						const reply = replies[index];
						if (reply.ok) entry.resolve(reply.value);
						else entry.reject(restoreGitWorkerFailure(reply.error));
					}
				} finally {
					response.consumed();
				}
			} catch (error) {
				for (const entry of pending) entry.reject(error);
			}
		}
	} finally {
		state.drain = void 0;
	}
}
async function requestGitWorkerCommand(command) {
	return await requestHost(command);
}
//#endregion
export { enqueueGitRefMutation as a, executeGitCommandBytes as c, runCommandWithTimeout as d, decodeWindowsOutputBuffer as f, readCommandProcessFailure as g, hasCommandProcessCleanupError as h, serializeGitWorkerFailure as i, normalizeGitPathForFilesystem as l, CommandProcessCleanupError as m, requestGitWorkerCommand as n, executeGitCommand as o, resolveWindowsConsoleEncoding as p, restoreGitWorkerFailure as r, executeGitCommandBuffered as s, hasGitWorkerContext as t, startGitOperationTiming as u };
