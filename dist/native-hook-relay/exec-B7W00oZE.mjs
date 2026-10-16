import { r as collectNestedErrorCandidates, s as toErrorObject } from "./error-coercion-DKQY4wyF.mjs";
import { a as asPositiveFiniteNumber, c as clampPositiveTimerTimeoutMs, d as resolveIntegerOption, g as normalizeLowercaseStringOrEmpty, h as resolveTimerTimeoutMs, p as resolveOptionalIntegerOption } from "./number-coercion-CmpLVzZ6.mjs";
import { n as resolveDiagnosticProcessEnv, r as resolveEnvironmentValue, t as mergeProcessEnv } from "./process-env-DlZFJzq6.mjs";
import { n as getProcessInstanceStartTime, t as getFileLockProcessStartTime } from "./pid-alive-Cnn-Mjdg.mjs";
import { p as sleep } from "./utils-BfTq4rUg.mjs";
import { A as hasErrnoCode, st as expectDefined } from "./redact-TLu2QTmL.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { n as markOpenClawExecEnv } from "./openclaw-exec-env-_vbUXwNA.mjs";
import { n as resolveExecutableFromPathEnv, r as resolveExecutablePathCandidate, t as isRegularFile } from "./executable-path-CMoZf-QM.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { a as BrokerChild, i as killProcessTree } from "./host-BpNtvl4K.mjs";
import { n as getSpawnBroker, t as recordChildProcessSpawn } from "./spawn-diagnostics-C-w4nT88.mjs";
import { a as getWindowsSystem32ExePath, t as getWindowsCmdExePath } from "./windows-install-roots-DqZZsEhJ.mjs";
import { createRequire } from "node:module";
import process$1 from "node:process";
import { spawnSync } from "node:child_process";
import fsSync, { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { constants } from "node:os";
import { fileURLToPath } from "node:url";
import { AsyncLocalStorage } from "node:async_hooks";
import { stripVTControlCharacters } from "node:util";
import { Buffer as Buffer$1, isUtf8 } from "node:buffer";
import { once } from "node:events";
import { StringDecoder } from "node:string_decoder";
import { execa } from "execa";
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
function decodeWindowsBufferWithFallback(params) {
	if ((params.platform ?? process.platform) !== "win32") return params.buffer.toString("utf8");
	const [first, second] = params.buffer;
	if (first === 255 && second === 254 || first === 254 && second === 255) return new TextDecoder(first === 255 ? "utf-16le" : "utf-16be").decode(params.buffer);
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
//#region src/utils/utf8-truncate.ts
function isContinuationByte(byte) {
	return byte !== void 0 && (byte & 192) === 128;
}
/** Keeps the longest UTF-8 suffix that fits within the byte limit. */
function truncateUtf8Suffix(value, maxBytes) {
	if (maxBytes <= 0) return "";
	if (value.length <= maxBytes && Buffer$1.byteLength(value) <= maxBytes) return value;
	const bytes = Buffer$1.from(Number.isInteger(maxBytes) ? value.slice(-maxBytes - 1) : value);
	let start = bytes.byteLength - maxBytes;
	while (start < bytes.byteLength && isContinuationByte(bytes[start])) start += 1;
	return bytes.subarray(start).toString("utf8");
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
//#region node-runtime-env.mjs
/** Keep lifecycle children on the explicitly selected runtime without changing npm config. */
function withNodeRuntimePath(env, nodePath, platform = process.platform) {
	const paths = platform === "win32" ? path.win32 : path.posix;
	const keys = Object.keys(env).sort().filter((key) => platform === "win32" ? key.toUpperCase() === "PATH" : key === "PATH");
	const key = keys[0] ?? "PATH";
	const directory = paths.dirname(nodePath);
	const entries = (env[key] ? env[key].split(paths.delimiter) : []).filter((entry) => entry !== directory);
	const result = { ...env };
	for (const pathKey of keys.length ? keys : [key]) result[pathKey] = [directory, ...entries].join(paths.delimiter);
	return result;
}
//#endregion
//#region src/process/scoped-child-reaper.ts
const require = createRequire(import.meta.url);
const scheduledChildren = /* @__PURE__ */ new WeakSet();
const POLL_INTERVAL_MS = 25;
const CLEANUP_DEADLINE_MS = 3e4;
const WNOHANG = 1;
let waitPid;
function loadWaitPid() {
	if (waitPid !== void 0) return waitPid;
	try {
		waitPid = require("koffi").load(null).func("int waitpid(int pid, int *status, int options)");
	} catch {
		waitPid = null;
	}
	return waitPid;
}
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
	const wait = loadWaitPid();
	if (!wait) return;
	const deadline = performance.now() + Math.max(CLEANUP_DEADLINE_MS, cleanupTimeoutMs);
	let quietScans = 0;
	const tick = () => {
		if (performance.now() >= deadline) return;
		let remaining = false;
		for (const member of readGroupMembers(rootPid)) {
			if (member.pid === rootPid) continue;
			if (member.ppid === process.pid && member.state === "Z" && wait(member.pid, null, WNOHANG) === member.pid) continue;
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
		return !hasErrnoCode(error, "ESRCH");
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
const SERIALIZABLE_OPTIONS = /* @__PURE__ */ new Set([
	"buffer",
	"cancelSignal",
	"cwd",
	"detached",
	"encoding",
	"env",
	"extendEnv",
	"forceKillAfterDelay",
	"input",
	"killDescendants",
	"killSignal",
	"maxBuffer",
	"reject",
	"shell",
	"stderr",
	"stdin",
	"stdio",
	"stdout",
	"stripFinalNewline",
	"timeout",
	"windowsHide",
	"windowsVerbatimArguments"
]);
function isOutputOption(value) {
	return value === void 0 || value === "pipe" || value === "ignore" || value === "inherit" || typeof value === "object" && value !== null && "file" in value && typeof value.file === "string" && Object.keys(value).length === 1;
}
/** Unsupported native descriptors and independent-lifetime commands remain explicit local paths. */
function brokerExecaOptions(options) {
	if (options.ipc || options.cleanup === false || typeof options.stdin === "number") return;
	if (options.stdout === "inherit" || options.stderr === "inherit" || options.stdio === "inherit" || typeof options.stdout === "number" || typeof options.stderr === "number") return;
	if (options.stdio && typeof options.stdio !== "string" && options.stdio.some((entry, fd) => typeof entry === "number" || fd > 0 && entry === "inherit")) return;
	for (const key of Object.keys(options)) if (!SERIALIZABLE_OPTIONS.has(key)) throw new TypeError(`Unsupported spawn broker execa option: ${key}`);
	if (options.cwd !== void 0 && typeof options.cwd !== "string" || options.input !== void 0 && typeof options.input !== "string" && !(options.input instanceof Uint8Array) || options.stdin !== void 0 && options.stdin !== "pipe" && options.stdin !== "ignore" && options.stdin !== "inherit" || !isOutputOption(options.stdout) || !isOutputOption(options.stderr) || options.shell !== void 0 && options.shell !== false) throw new TypeError("Unsupported spawn broker execa stream or invocation options");
	if (options.stdio !== void 0 && typeof options.stdio === "string" && options.stdio !== "pipe" && options.stdio !== "ignore") throw new TypeError("Unsupported spawn broker execa stdio");
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
//#region src/process/windows-command.ts
const WINDOWS_UNSAFE_CMD_CHARS_RE = /[&|<>%\r\n]/;
function resolveNpmArgvForWindows(argv) {
	if (process$1.platform !== "win32" || argv.length === 0) return null;
	const basename = normalizeLowercaseStringOrEmpty(path.basename(expectDefined(argv[0], "argv entry at 0"))).replace(/\.(cmd|exe|bat)$/, "");
	const cliName = basename === "npx" ? "npx-cli.js" : basename === "npm" ? "npm-cli.js" : null;
	if (!cliName) return null;
	const cliPath = path.join(path.dirname(process$1.execPath), "node_modules", "npm", "bin", cliName);
	if (fsSync.existsSync(cliPath)) return [
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
			const deadline = Date.now() + 300;
			while (isChildProcessTreeAlive({ pid })) {
				const currentStart = getFileLockProcessStartTime(pid);
				const remaining = deadline - Date.now();
				if (currentStart !== null && currentStart !== startedAt || remaining <= 0) throw new CommandProcessCleanupError();
				await sleep(Math.min(25, remaining));
			}
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
function spawnCommandWithInvocation(argv, options = {}) {
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
	recordChildProcessSpawn(invocation.command, child.nodeChildProcess);
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
				await new Promise((resolve) => {
					setTimeout(resolve, params.killGraceMs);
				});
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
			const force = params.processTree.mode === "force" || params.killSignal === "SIGKILL" || params.killSignal === constants.signals.SIGKILL;
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
				const deadline = Date.now() + 300;
				while (groupAlive()) {
					const currentStart = getFileLockProcessStartTime(childPid);
					const remaining = deadline - Date.now();
					if (currentStart !== null && currentStart !== originalStart) {
						cleanup = "uncertain";
						return;
					}
					if (remaining <= 0) {
						cleanup = groupAlive() ? "uncertain" : "forced";
						return;
					}
					await new Promise((resolve) => {
						setTimeout(resolve, Math.min(25, remaining));
					});
				}
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
			scheduleAdoptedChildZombieReapAfterExit(params.child, true, params.killGraceMs + 300);
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
const WINDOWS_CLOSE_STATE_SETTLE_TIMEOUT_MS = 250;
const WINDOWS_CLOSE_STATE_POLL_MS = 10;
async function runCommandWithTimeout(argv, optionsOrTimeout) {
	return await runCommandWithOutputEncoding(argv, optionsOrTimeout, false);
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
			if (hasErrnoCode(cause, "EPIPE")) return;
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
	if (isCauseLessWindowsShimResult) for (let elapsedMs = 0; elapsedMs < WINDOWS_CLOSE_STATE_SETTLE_TIMEOUT_MS; elapsedMs += WINDOWS_CLOSE_STATE_POLL_MS) {
		if (childExitState?.code != null || childExitState?.signal != null || nodeChild.exitCode != null || nodeChild.signalCode != null) break;
		await sleep(WINDOWS_CLOSE_STATE_POLL_MS);
	}
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
export { runCommandWithTimeout as t };
