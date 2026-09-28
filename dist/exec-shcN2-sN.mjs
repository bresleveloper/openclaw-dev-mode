import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { t as killProcessTree } from "./kill-tree-BGQdx374.mjs";
import { t as getFileLockProcessStartTime } from "./pid-alive-CXdZEzr_.mjs";
import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import { t as isPromiseLike } from "./promise-like-D7-l5Fsp.mjs";
import { t as BrokerChild } from "./child-C7738Y0I.mjs";
import { n as isChildProcessTreeAlive } from "./child-process-tree-Cmpyfjdc.mjs";
import { a as getWindowsSystem32ExePath } from "./windows-install-roots-DK9gNoYN.mjs";
import { i as resolveWindowsConsoleEncoding, n as decodeWindowsOutputBuffer } from "./windows-encoding-zGMz1ieM.mjs";
import { n as truncateUtf8Suffix } from "./utf8-truncate-_hf7tp13.mjs";
import { a as isPlainCommandSignalFailure, i as isPlainCommandExitFailure, n as createSanitizedCommandError, o as resolveProcessExitCode } from "./exec-result-C4wNdxxi.mjs";
import { c as waitForCommandSpawn, i as runOutsideCommandProcessScope, n as resolveCommandProcessSignal, o as spawnCommand, r as retainCommandProcessCleanup, s as spawnCommandWithInvocation } from "./exec-spawn-B7redWCL.mjs";
import process from "node:process";
import { constants } from "node:os";
import { StringDecoder } from "node:string_decoder";
import { isUtf8 } from "node:buffer";
//#region src/process/child-process.ts
const EXIT_STDIO_GRACE_MS = 100;
const EXIT_STDIO_MAX_DRAIN_MS = 1e3;
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
		idleTimer = setTimeout(scheduleRelease, EXIT_STDIO_GRACE_MS);
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
	if (child.exitCode != null || child.signalCode != null) onExit();
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
function normalizeMaxOutputBytes(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return DEFAULT_COMMAND_OUTPUT_MAX_BYTES;
	return Math.max(1, Math.floor(value));
}
function resolveMaxOutputBytes(value, stream) {
	return normalizeMaxOutputBytes(typeof value === "number" ? value : value?.[stream]);
}
function resolveOutputCapture(value, stream) {
	return (typeof value === "string" ? value : value?.[stream]) ?? "tail";
}
function shouldTerminateOnOutputLimit(value, limit) {
	return typeof value === "boolean" ? value : value?.[limit] === true;
}
function shouldTerminateOnOutputError(value, stream) {
	return typeof value === "boolean" ? value : value?.[stream] === true;
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
	if (truncatedBytes === 0 || buffer.length === 0 || process.platform === "win32" && !forceUtf8) return buffer;
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
//#region src/process/exec-termination.ts
const WINDOWS_TASKKILL_TIMEOUT_MS = 5e3;
function createCommandTerminationController(params) {
	let processTreeSettlement;
	let cleanup = "normal";
	const readOriginalStart = () => params.processTree && params.child.pid && process.platform !== "win32" ? getFileLockProcessStartTime(params.child.pid) : null;
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
					setTimeout(resolve, params.killGraceMs).unref();
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
		if (process.platform === "win32" && !directChildAlive) return false;
		if (params.processTree && typeof childPid === "number") {
			if (process.platform === "win32") {
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
				process.kill(-childPid, params.killSignal ?? "SIGTERM");
			} catch (error) {
				if (error.code !== "ESRCH") cleanup = "uncertain";
			}
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
		if (process.platform === "win32" && typeof childPid === "number") {
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
//#region src/process/exec-runner.ts
const WINDOWS_CLOSE_STATE_SETTLE_TIMEOUT_MS = 250;
const WINDOWS_CLOSE_STATE_POLL_MS = 10;
async function runCommandWithTimeout(argv, optionsOrTimeout) {
	return await runCommandWithOutputEncoding(argv, optionsOrTimeout, false);
}
/** Run a command whose stdout and stderr are defined to be UTF-8 on every platform. */
async function runUtf8CommandWithTimeout(argv, optionsOrTimeout) {
	return await runCommandWithOutputEncoding(argv, optionsOrTimeout, true);
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
	const maxCombinedOutputBytes = typeof options.maxCombinedOutputBytes === "number" && Number.isFinite(options.maxCombinedOutputBytes) && options.maxCombinedOutputBytes > 0 ? Math.max(1, Math.floor(options.maxCombinedOutputBytes)) : void 0;
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
	let outputObserverError;
	let outputErrorStream;
	let terminatingOutputError;
	const { child, invocation } = spawnCommandWithInvocation(argv, {
		buffer: false,
		cancelSignal: cancelController.signal,
		inheritScopeCancellation: false,
		cwd,
		detached: Boolean(killProcessTree && process.platform !== "win32"),
		encoding: "buffer",
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
	const ownsExitedProcessTree = Boolean(killProcessTree && process.platform !== "win32");
	const resolvedNoOutputTimeoutMs = typeof noOutputTimeoutMs === "number" && Number.isFinite(noOutputTimeoutMs) && noOutputTimeoutMs > 0 ? resolveTimerTimeoutMs(noOutputTimeoutMs, 1) : void 0;
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
	const cancel = (reason) => {
		if (termination || commandSettled || childExitState && reason !== "output-limit" && (!ownsExitedProcessTree || childExitState.code !== 0)) return;
		termination = reason;
		if (waitingForSpawn) startupCanceled.resolve(reason);
		if (childExitState) releaseOutput ??= releaseChildProcessOutputAfterExit(nodeChild);
		if (!terminationController.terminate()) cancelController.abort();
	};
	const armNoOutputTimer = () => {
		if (resolvedNoOutputTimeoutMs === void 0 || commandSettled || termination || childExitState && !ownsExitedProcessTree) return;
		noOutputTimer = noOutputTimer?.refresh() ?? setTimeout(() => cancel("no-output-timeout"), resolvedNoOutputTimeoutMs);
	};
	const timeoutTimer = resolvedTimeoutMs === void 0 ? void 0 : setTimeout(() => cancel("timeout"), resolvedTimeoutMs);
	const onAbort = () => cancel("signal");
	signal?.addEventListener("abort", onAbort, { once: true });
	armNoOutputTimer();
	const clearTimers = () => {
		if (timeoutTimer) clearTimeout(timeoutTimer);
		clearTimeout(noOutputTimer);
		noOutputTimer = void 0;
		signal?.removeEventListener("abort", onAbort);
	};
	if (startupReady) {
		let interrupted;
		try {
			interrupted = await Promise.race([startupReady.then(() => void 0), startupCanceled.promise]);
		} catch (error) {
			clearTimers();
			throw error;
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
	const captureOutput = (capture, chunk, maxBytes, stream, captureMode) => {
		const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
		outputBytesByStream[stream] += buffer.byteLength;
		const streamLimitExceeded = outputBytesByStream[stream] > maxBytes;
		if (maxCombinedOutputBytes === void 0) {
			appendCapturedOutput(capture, buffer, maxBytes, captureMode);
			if (streamLimitExceeded && shouldTerminateOnOutputLimit(options.terminateOnOutputLimit, stream)) cancel("output-limit");
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
		if (combinedLimitExceeded && shouldTerminateOnOutputLimit(options.terminateOnOutputLimit, "combined") || streamLimitExceeded && shouldTerminateOnOutputLimit(options.terminateOnOutputLimit, stream)) cancel("output-limit");
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
		if (termination || options.tolerateOutputError?.[stream] === true || !shouldTerminateOnOutputError(options.terminateOnOutputError, stream)) return;
		terminatingOutputError = toErrorObject(error, `Command ${stream} stream failed`);
		Object.assign(terminatingOutputError, { outputErrorStream: stream });
		cancel("signal");
	};
	child.stdout?.once("error", (error) => onOutputError(error, "stdout"));
	child.stderr?.once("error", (error) => onOutputError(error, "stderr"));
	child.stdout?.on("data", (chunk) => {
		const buffer = observeOutputChunk(chunk, "stdout");
		appendPreservedOutputLines({
			capture: stdoutCapture,
			chunk: buffer,
			stream: "stdout",
			preserveOutputLine: options.preserveOutputLine,
			maxPreservedOutputLines,
			maxPendingLineBytes: maxPreservedPendingLineBytes
		});
		captureOutput(stdoutCapture, buffer, maxStdoutBytes, "stdout", stdoutCaptureMode);
		armNoOutputTimer();
	});
	child.stderr?.on("data", (chunk) => {
		const buffer = observeOutputChunk(chunk, "stderr");
		appendPreservedOutputLines({
			capture: stderrCapture,
			chunk: buffer,
			stream: "stderr",
			preserveOutputLine: options.preserveOutputLine,
			maxPreservedOutputLines,
			maxPendingLineBytes: maxPreservedPendingLineBytes
		});
		captureOutput(stderrCapture, buffer, maxStderrBytes, "stderr", stderrCaptureMode);
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
	});
	let cleanup = await processCleanup;
	const resolvedSignal = result.signal ?? childExitState?.signal ?? nodeChild.signalCode ?? null;
	if (cleanup === "normal" && resolvedSignal) cleanup = "uncertain";
	if (inputAdmissionError) throw Object.assign(inputAdmissionError, { cleanup });
	if (terminatingOutputError) throw Object.assign(terminatingOutputError, { cleanup });
	if (outputObserverError !== void 0) throw Object.assign(toErrorObject(outputObserverError, "Command output observer failed"), { cleanup });
	const isCauseLessWindowsShimResult = !termination && invocation.usesWindowsExitCodeShim && typeof nodeChild.pid === "number" && result.code === void 0 && result.cause === void 0 && !result.timedOut && !result.isCanceled && !result.isMaxBuffer && !result.isTerminated;
	if (isCauseLessWindowsShimResult) for (let elapsedMs = 0; elapsedMs < WINDOWS_CLOSE_STATE_SETTLE_TIMEOUT_MS; elapsedMs += WINDOWS_CLOSE_STATE_POLL_MS) {
		if (childExitState?.code != null || childExitState?.signal != null || nodeChild.exitCode != null || nodeChild.signalCode != null) break;
		await new Promise((resolve) => {
			setTimeout(resolve, WINDOWS_CLOSE_STATE_POLL_MS);
		});
	}
	if (result.failed && !termination && !isPlainCommandExitFailure(result) && !isPlainCommandSignalFailure(result) && !isCauseLessWindowsShimResult && !(result.exitCode === 0 && outputErrorStream !== void 0 && options.tolerateOutputError?.[outputErrorStream] === true)) {
		const error = createSanitizedCommandError(result);
		Object.assign(error, { cleanup: typeof nodeChild.pid === "number" ? cleanup === "normal" ? "uncertain" : cleanup : "normal" });
		if (outputErrorStream) Object.assign(error, { outputErrorStream });
		throw error;
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
	flushPreservedOutputLine({
		capture: stdoutCapture,
		stream: "stdout",
		preserveOutputLine: options.preserveOutputLine,
		maxPreservedOutputLines,
		maxPendingLineBytes: maxPreservedPendingLineBytes
	});
	flushPreservedOutputLine({
		capture: stderrCapture,
		stream: "stderr",
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
const DEFAULT_EXEC_MAX_BUFFER_BYTES = 1048576;
function decodeExecOutput(buffer) {
	return decodeWindowsOutputBuffer({ buffer: Buffer.from(buffer.buffer, buffer.byteOffset, buffer.byteLength) });
}
async function runExec(command, args, opts = 1e4) {
	const timeout = typeof opts === "number" ? resolveTimerTimeoutMs(opts, 1) : typeof opts.timeoutMs === "number" ? resolveTimerTimeoutMs(opts.timeoutMs, 1) : void 0;
	const maxBuffer = typeof opts === "number" ? DEFAULT_EXEC_MAX_BUFFER_BYTES : opts.maxBuffer ?? DEFAULT_EXEC_MAX_BUFFER_BYTES;
	const resolvedOptions = typeof opts === "number" ? void 0 : opts;
	if (resolvedOptions?.input !== void 0 && resolvedOptions.stdinFileDescriptor !== void 0) throw new Error("runExec accepts either input or stdinFileDescriptor, not both");
	let acceptingOutput = true;
	let awaitingStartup = true;
	let deadlineExpired = false;
	let releaseCancellation = () => {};
	try {
		const subprocess = spawnCommand([command, ...args], {
			baseEnv: resolvedOptions?.baseEnv,
			cancelSignal: resolvedOptions?.signal,
			cwd: resolvedOptions?.cwd,
			encoding: "buffer",
			env: resolvedOptions?.env,
			forceKillAfterDelay: 300,
			...resolvedOptions?.input !== void 0 ? { input: resolvedOptions.input } : {},
			maxBuffer,
			reject: true,
			...resolvedOptions?.stdinFileDescriptor === void 0 ? { stdin: resolvedOptions?.input === void 0 ? "ignore" : void 0 } : { stdin: resolvedOptions.stdinFileDescriptor },
			stripFinalNewline: false,
			timeout
		});
		const startupCanceled = subprocess.nodeChildProcess instanceof BrokerChild && subprocess.pid === void 0 ? createDeferredCore() : void 0;
		if (startupCanceled) {
			const signal = resolveCommandProcessSignal(resolvedOptions?.signal);
			let cancellationOpen = true;
			let deadline;
			const stopCommand = (reason) => {
				if (!cancellationOpen) return;
				releaseCancellation();
				if (reason === "timeout") {
					deadlineExpired = true;
					subprocess.kill();
				}
				if (!awaitingStartup) return;
				acceptingOutput = false;
				const flags = {
					failed: true,
					timedOut: reason === "timeout",
					isCanceled: reason === "signal",
					isMaxBuffer: false,
					isTerminated: false
				};
				const error = createSanitizedCommandError(flags);
				startupCanceled.reject(Object.assign(error, flags, {
					shortMessage: error.message,
					stdout: "",
					stderr: "",
					cleanup: "uncertain"
				}));
			};
			const onAbort = () => stopCommand("signal");
			releaseCancellation = () => {
				cancellationOpen = false;
				clearTimeout(deadline);
				signal?.removeEventListener("abort", onAbort);
			};
			signal?.addEventListener("abort", onAbort, { once: true });
			if (timeout !== void 0) deadline = setTimeout(() => stopCommand("timeout"), timeout);
			if (signal?.aborted) onAbort();
		}
		const completion = (async () => {
			if (subprocess.pid === void 0) await waitForCommandSpawn(subprocess);
			awaitingStartup = false;
			const releaseOutput = releaseChildProcessOutputAfterExit(subprocess.nodeChildProcess);
			let observer = acceptingOutput ? resolvedOptions?.onOutputChunk : void 0;
			const observe = (chunk, stream) => {
				try {
					observer?.(chunk, stream);
				} catch {
					observer = void 0;
				}
			};
			const onStdout = (chunk) => observe(chunk, "stdout");
			const onStderr = (chunk) => observe(chunk, "stderr");
			if (observer) {
				subprocess.nodeChildProcess.stdout?.on("data", onStdout);
				subprocess.nodeChildProcess.stderr?.on("data", onStderr);
			}
			const result = await subprocess.finally(() => {
				releaseCancellation();
				releaseOutput();
				subprocess.nodeChildProcess.stdout?.off("data", onStdout);
				subprocess.nodeChildProcess.stderr?.off("data", onStderr);
			});
			if (deadlineExpired) {
				const error = createSanitizedCommandError({ timedOut: true });
				throw Object.assign(error, result, {
					failed: true,
					timedOut: true,
					shortMessage: error.message
				});
			}
			const { stdout, stderr } = result;
			const decodedStdout = decodeExecOutput(stdout);
			const decodedStderr = decodeExecOutput(stderr);
			if (acceptingOutput && resolvedOptions?.logOutput !== false) {
				const [{ shouldLogVerbose }, { logDebug, logError }] = await Promise.all([import("./globals-BqZPgrwm.mjs"), import("./logger-CNooZUtE.mjs")]);
				if (shouldLogVerbose()) {
					if (decodedStdout.trim()) logDebug(decodedStdout.trim());
					if (decodedStderr.trim()) logError(decodedStderr.trim());
				}
			}
			return {
				stdout: decodedStdout,
				stderr: decodedStderr
			};
		})();
		retainCommandProcessCleanup(completion.then(() => void 0, () => void 0));
		return await (startupCanceled ? Promise.race([completion, startupCanceled.promise]) : completion);
	} catch (err) {
		releaseCancellation();
		if (err && typeof err === "object") {
			const errorWithOutput = err;
			if (deadlineExpired && !errorWithOutput.timedOut) {
				const message = createSanitizedCommandError({ timedOut: true }).message;
				if (err instanceof Error) err.stack = err.stack?.replace(err.message, message);
				Object.assign(err, {
					failed: true,
					timedOut: true,
					message,
					shortMessage: message
				});
			}
			if (errorWithOutput.code === void 0 && typeof errorWithOutput.exitCode === "number") errorWithOutput.code = errorWithOutput.exitCode;
			if (errorWithOutput.stdout instanceof Uint8Array) errorWithOutput.stdout = decodeExecOutput(errorWithOutput.stdout);
			if (errorWithOutput.stderr instanceof Uint8Array) errorWithOutput.stderr = decodeExecOutput(errorWithOutput.stderr);
		}
		if (resolvedOptions?.logOutput !== false) {
			const logging = await Promise.all([import("./globals-BqZPgrwm.mjs"), import("./logger-CNooZUtE.mjs")]).catch(() => void 0);
			if (logging) {
				const [{ danger, shouldLogVerbose }, { logError }] = logging;
				if (shouldLogVerbose()) logError(danger(`Command failed: ${command}`));
			}
		}
		throw err;
	} finally {
		acceptingOutput = false;
		releaseCancellation();
	}
}
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
	const maxCombinedOutputBytes = typeof options.maxCombinedOutputBytes === "number" && Number.isFinite(options.maxCombinedOutputBytes) && options.maxCombinedOutputBytes > 0 ? Math.max(1, Math.floor(options.maxCombinedOutputBytes)) : void 0;
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
			...result.outputErrorStream ? { errorStream: result.outputErrorStream } : {}
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
			error: commandError
		};
	}
}
//#endregion
export { runUtf8CommandWithTimeout as a, createCapturedOutputBuffers as c, runCommandWithTimeout as i, finalizeCapturedOutput as l, runExec as n, createCommandTerminationController as o, runCommandBuffersWithTimeout as r, appendCapturedOutput as s, runCommandBuffered as t, releaseChildProcessOutputAfterExit as u };
