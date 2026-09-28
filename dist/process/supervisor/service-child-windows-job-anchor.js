import { t as coerceErrorMessage } from "../../error-coercion-C787aVxk.mjs";
import { t as createDeferredCore } from "../../deferred-D0La5CRk.mjs";
import { a as asOptionalRecord, l as isStringRecord } from "../../record-coerce-DItp3I4t.mjs";
import { r as resolveEnvironmentValue, t as mergeProcessEnv } from "../../process-env-DlZFJzq6.mjs";
import { t as getWindowsCmdExePath } from "../../windows-install-roots-DK9gNoYN.mjs";
import { t as createWindowsOutputDecoder } from "../../windows-encoding-zGMz1ieM.mjs";
import { n as createWindowsJobBindings } from "../../service-child-windows-job-native-DZ9lDQG9.mjs";
//#region src/process/supervisor/service-child-windows-job-start.ts
function buildWindowsJobEnvironmentBlock(env) {
	const merged = mergeProcessEnv([env], "win32");
	for (const [key, value] of Object.entries(merged)) if (key.includes("\0") || value.includes("\0")) throw new Error("owned command environment contains a NUL byte");
	const entries = Object.keys(merged).toSorted((left, right) => {
		const leftFolded = left.toUpperCase();
		const rightFolded = right.toUpperCase();
		return leftFolded < rightFolded ? -1 : leftFolded > rightFolded ? 1 : 0;
	}).map((key) => `${key}=${merged[key]}`);
	return Buffer.from(`${entries.join("\0")}\0\0`, "utf16le");
}
function isWindowsJobServiceStart(value) {
	const message = asOptionalRecord(value);
	return Boolean(message && message.type === "start" && typeof message.generation === "string" && typeof message.command === "string" && Array.isArray(message.args) && message.args.every((arg) => typeof arg === "string") && (message.argv0 === void 0 || typeof message.argv0 === "string") && (message.cwd === void 0 || typeof message.cwd === "string") && (message.env === void 0 || isStringRecord(message.env)) && (message.stdinMode === "inherit" || message.stdinMode === "pipe-open" || message.stdinMode === "pipe-closed") && (message.secretFd === void 0 || typeof message.secretFd === "number") && (message.controlFd === void 0 || typeof message.controlFd === "number") && (message.windowsShellCommand === void 0 || typeof message.windowsShellCommand === "string"));
}
//#endregion
//#region src/process/supervisor/service-child-windows-job-anchor.ts
const JOB_OBJECT_BASIC_ACCOUNTING_INFORMATION = 1;
const JOB_OBJECT_EXTENDED_LIMIT_INFORMATION = 9;
const STARTF_USESTDHANDLES = 256;
const WAIT_OBJECT_0 = 0;
const WAIT_TIMEOUT = 258;
const WAIT_FAILED = 4294967295;
const ERROR_BROKEN_PIPE = 109;
const IDLE_OBSERVATION_MS = 10;
const OUTPUT_BUFFER_BYTES = 65536;
const OUTPUT_ROUNDS_PER_TURN = 2;
function sendProcessMessage(message) {
	return new Promise((resolve, reject) => {
		if (!process.connected || !process.send) {
			reject(/* @__PURE__ */ new Error("Windows Job anchor IPC is closed"));
			return;
		}
		process.send(message, (error) => error ? reject(error) : resolve());
	});
}
function runServiceChildWindowsJobAnchor() {
	let start;
	let state = "starting";
	let sequence = 0;
	let lastHostSequence = 0;
	let outboundQueue = Promise.resolve();
	let job;
	let processHandle;
	let bindings;
	let pendingCommandStdio;
	let rootObserved = false;
	let extinctionProven = false;
	let terminationRequested = false;
	let closeReason;
	let lifecycleTimer;
	let lifecycleImmediate;
	let lifecycleRunning = false;
	let lifecycleRerun = false;
	const outputStreams = [];
	const outputBuffer = Buffer.allocUnsafe(OUTPUT_BUFFER_BYTES);
	const startupErrorAcknowledged = createDeferredCore();
	const cleanupFinished = createDeferredCore();
	cleanupFinished.promise.catch(() => {});
	const send = (payload) => {
		if (!start) return Promise.reject(/* @__PURE__ */ new Error("Windows Job anchor has not started"));
		sequence += 1;
		const message = {
			...payload,
			generation: start.generation,
			sequence
		};
		const delivery = outboundQueue.then(() => sendProcessMessage(message));
		outboundQueue = delivery.catch(() => {});
		return delivery;
	};
	const deliver = async (payload) => {
		if (!process.connected) {
			if (!closeReason) requestCleanup("parent-lost");
			return;
		}
		try {
			await send(payload);
		} catch (error) {
			if (process.connected) throw error;
			if (!closeReason) requestCleanup("parent-lost");
		}
	};
	const stopLifecycle = () => {
		clearTimeout(lifecycleTimer);
		clearImmediate(lifecycleImmediate);
		lifecycleTimer = void 0;
		lifecycleImmediate = void 0;
	};
	const finishAnchor = (exitCode) => {
		stopLifecycle();
		process.exitCode = exitCode;
		if (process.connected) process.disconnect?.();
	};
	const closeOutputHandle = (stream) => {
		const handle = stream.handle;
		if (handle === void 0) return;
		if (!bindings) throw new Error(`${stream.name} output bindings were not initialized`);
		if (!bindings.CloseHandle(handle)) throw bindings.lastError(`CloseHandle(${stream.name} pipe)`);
		stream.handle = void 0;
	};
	const closeNativeHandles = () => {
		let closeError;
		for (const stream of outputStreams) try {
			closeOutputHandle(stream);
		} catch (error) {
			closeError ??= error instanceof Error ? error : new Error(coerceErrorMessage(error));
		}
		for (const handle of [processHandle, job]) if (handle !== void 0 && bindings && !bindings.CloseHandle(handle)) {
			const error = bindings.lastError("CloseHandle");
			closeError ??= error;
		}
		processHandle = void 0;
		job = void 0;
		if (closeError) throw closeError;
	};
	const closeAuthority = async (reason) => {
		if (state === "closed") return;
		state = "closed";
		stopLifecycle();
		try {
			if (process.connected) await send({
				type: "closing",
				reason
			});
			closeNativeHandles();
			cleanupFinished.resolve();
			finishAnchor(0);
		} catch (error) {
			try {
				closeNativeHandles();
			} catch {}
			cleanupFinished.reject(error);
			finishAnchor(1);
		}
	};
	const failAuthority = async (error) => {
		if (state === "closed") return;
		state = "closed";
		stopLifecycle();
		try {
			if (process.connected && start) await send({
				type: "result-error",
				error: coerceErrorMessage(error)
			}).catch(() => {});
			closeNativeHandles();
		} catch {} finally {
			cleanupFinished.reject(error);
			finishAnchor(1);
		}
	};
	const finishOutput = async (stream) => {
		if (stream.ended) return;
		closeOutputHandle(stream);
		stream.ended = true;
		const tail = stream.decoder?.flush();
		if (tail) await deliver({
			type: "output",
			stream: stream.name,
			chunk: tail
		});
		await deliver({
			type: "output-end",
			stream: stream.name
		});
	};
	const observeOutput = async (stream) => {
		if (stream.ended) return false;
		if (!bindings || stream.handle === void 0 || !stream.decoder) throw new Error(`${stream.name} output ownership was not initialized`);
		const available = [0];
		if (!bindings.PeekNamedPipe(stream.handle, null, 0, null, available, null)) {
			const errorCode = bindings.getLastErrorCode();
			if (errorCode !== ERROR_BROKEN_PIPE) throw new Error(`PeekNamedPipe(${stream.name}) failed (Win32 error ${errorCode})`);
			await finishOutput(stream);
			return true;
		}
		const availableBytes = available[0];
		if (typeof availableBytes !== "number" || !Number.isSafeInteger(availableBytes) || availableBytes < 0) throw new Error(`PeekNamedPipe(${stream.name}) returned an invalid byte count`);
		if (availableBytes === 0) return false;
		const requestedBytes = Math.min(availableBytes, outputBuffer.length);
		const bytesRead = [0];
		if (!bindings.ReadFile(stream.handle, outputBuffer, requestedBytes, bytesRead, null)) {
			const errorCode = bindings.getLastErrorCode();
			if (errorCode !== ERROR_BROKEN_PIPE) throw new Error(`ReadFile(${stream.name}) failed (Win32 error ${errorCode})`);
			await finishOutput(stream);
			return true;
		}
		const count = bytesRead[0];
		if (typeof count !== "number" || !Number.isSafeInteger(count) || count < 0 || count > requestedBytes) throw new Error(`ReadFile(${stream.name}) returned an invalid byte count`);
		if (count === 0) throw new Error(`ReadFile(${stream.name}) returned no available bytes`);
		const text = stream.decoder.decode(outputBuffer.subarray(0, count));
		if (text) await deliver({
			type: "output",
			stream: stream.name,
			chunk: text
		});
		return true;
	};
	const observeRoot = async () => {
		if (rootObserved) return false;
		if (!bindings || !processHandle) throw new Error("Windows root process ownership was not initialized");
		const waitResult = bindings.WaitForSingleObject(processHandle, 0);
		if (waitResult === WAIT_TIMEOUT) return false;
		if (waitResult === WAIT_FAILED) throw bindings.lastError("WaitForSingleObject(root)");
		if (waitResult !== WAIT_OBJECT_0) throw new Error(`WaitForSingleObject(root) returned unexpected result ${waitResult}`);
		const exitCode = [0];
		if (!bindings.GetExitCodeProcess(processHandle, exitCode)) throw bindings.lastError("GetExitCodeProcess");
		const code = exitCode[0];
		if (typeof code !== "number" || !Number.isSafeInteger(code) || code < 0 || code > 4294967295) throw new Error("GetExitCodeProcess returned an invalid exit code");
		rootObserved = true;
		await deliver({
			type: "root-result",
			code,
			signal: null
		});
		return true;
	};
	const observeJob = () => {
		if (extinctionProven) return false;
		if (!bindings || !job) throw new Error("Windows Job ownership was not initialized");
		const accounting = {};
		if (!bindings.QueryInformationJobObject(job, JOB_OBJECT_BASIC_ACCOUNTING_INFORMATION, accounting, bindings.basicAccountingSize, null)) throw bindings.lastError("QueryInformationJobObject");
		const count = accounting.ActiveProcesses;
		if (typeof count !== "number" || !Number.isSafeInteger(count) || count < 0) throw new Error("QueryInformationJobObject returned an invalid active process count");
		extinctionProven = count === 0;
		return extinctionProven;
	};
	const runLifecycle = async () => {
		if (lifecycleRunning || state === "closed" || !processHandle) {
			lifecycleRerun ||= lifecycleRunning;
			return;
		}
		lifecycleRunning = true;
		let advanced = false;
		try {
			advanced = await observeRoot() || advanced;
			advanced = rootObserved && observeJob() || advanced;
			for (let round = 0; round < OUTPUT_ROUNDS_PER_TURN; round += 1) {
				let outputAdvanced = false;
				for (const stream of outputStreams) outputAdvanced = await observeOutput(stream) || outputAdvanced;
				advanced ||= outputAdvanced;
				if (!outputAdvanced) break;
			}
			if (extinctionProven && rootObserved && outputStreams.every((stream) => stream.ended)) {
				await closeAuthority(closeReason ?? "lineage-closed");
				return;
			}
		} catch (error) {
			await failAuthority(error);
			return;
		} finally {
			lifecycleRunning = false;
		}
		const immediate = advanced || lifecycleRerun;
		lifecycleRerun = false;
		scheduleLifecycle(immediate);
	};
	const scheduleLifecycle = (immediate) => {
		if (state === "closed" || !processHandle) return;
		if (lifecycleRunning) {
			lifecycleRerun ||= immediate;
			return;
		}
		if (immediate && lifecycleTimer) {
			clearTimeout(lifecycleTimer);
			lifecycleTimer = void 0;
		}
		if (lifecycleTimer || lifecycleImmediate) return;
		if (immediate) {
			lifecycleImmediate = setImmediate(() => {
				lifecycleImmediate = void 0;
				runLifecycle();
			});
			return;
		}
		lifecycleTimer = setTimeout(() => {
			lifecycleTimer = void 0;
			runLifecycle();
		}, IDLE_OBSERVATION_MS);
		if (state === "active" && process.connected) lifecycleTimer.unref();
	};
	const requestCleanup = (reason) => {
		if (state === "closed") return cleanupFinished.promise;
		closeReason ??= reason;
		state = "closing";
		if (!processHandle) {
			closeAuthority(reason);
			return cleanupFinished.promise;
		}
		if (!terminationRequested && !extinctionProven) {
			terminationRequested = true;
			if (!bindings || !job) {
				failAuthority(/* @__PURE__ */ new Error("Windows Job cleanup authority was not initialized"));
				return cleanupFinished.promise;
			}
			if (!bindings.TerminateJobObject(job, 1)) {
				const error = bindings.lastError("TerminateJobObject");
				failAuthority(error);
				return cleanupFinished.promise;
			}
		}
		scheduleLifecycle(true);
		return cleanupFinished.promise;
	};
	const reportStartupError = async (error) => {
		if (!process.connected) return;
		await send({
			type: "startup-error",
			error: coerceErrorMessage(error)
		});
		await startupErrorAcknowledged.promise;
	};
	const startCommand = async (next) => {
		start = next;
		if (typeof next.windowsShellCommand !== "string") {
			state = "closed";
			finishAnchor(1);
			return;
		}
		try {
			const koffi = (await import("koffi")).default;
			if (state !== "starting") return;
			bindings = createWindowsJobBindings(koffi);
			bindings.assertLayouts();
			job = bindings.requireHandle(bindings.CreateJobObjectW(null, null), "CreateJobObjectW");
			if (!bindings.SetExtendedLimits(job, JOB_OBJECT_EXTENDED_LIMIT_INFORMATION, bindings.extendedLimits, bindings.extendedLimitsSize)) throw bindings.lastError("SetInformationJobObject(KILL_ON_JOB_CLOSE)");
			const commandStdio = bindings.createCommandStdio();
			pendingCommandStdio = commandStdio;
			let processAttributes;
			const processInfo = {};
			try {
				processAttributes = bindings.createProcessAttributeList(commandStdio.inheritedHandles, job);
				const shell = resolveEnvironmentValue(next.env, "COMSPEC", "win32") || getWindowsCmdExePath(next.env);
				const commandLine = Buffer.from(`"${shell}" /d /s /c "${next.windowsShellCommand}"\0`, "utf16le");
				if (!bindings.CreateProcessW(shell, commandLine, null, null, 1, 134743552, next.env === void 0 ? null : buildWindowsJobEnvironmentBlock(next.env), next.cwd ?? null, {
					StartupInfo: {
						cb: bindings.startupInfoExSize,
						dwFlags: STARTF_USESTDHANDLES,
						hStdInput: commandStdio.stdinHandle,
						hStdOutput: commandStdio.stdoutWriteHandle,
						hStdError: commandStdio.stderrWriteHandle
					},
					lpAttributeList: processAttributes.attributeList
				}, processInfo)) throw bindings.lastError("CreateProcessW(JOB_LIST)");
				processHandle = bindings.requireHandle(processInfo.hProcess, "CreateProcessW process");
				const threadHandle = bindings.requireHandle(processInfo.hThread, "CreateProcessW thread");
				if (!bindings.CloseHandle(threadHandle)) throw bindings.lastError("CloseHandle(command thread)");
			} finally {
				processAttributes?.release();
				pendingCommandStdio?.closeChildHandles();
			}
			const commandPid = Number(processInfo.dwProcessId);
			const handles = commandStdio.takeOutputReadHandles();
			outputStreams.push({
				name: "stdout",
				handle: handles.stdoutReadHandle,
				ended: false
			}, {
				name: "stderr",
				handle: handles.stderrReadHandle,
				ended: false
			});
			for (const stream of outputStreams) stream.decoder = createWindowsOutputDecoder();
			state = "active";
			const readyDelivery = send({
				type: "ready",
				commandPid,
				anchorPid: process.pid
			});
			scheduleLifecycle(true);
			await readyDelivery;
		} catch (error) {
			if (state === "closed") return;
			if (state === "closing") {
				await cleanupFinished.promise.catch(() => {});
				return;
			}
			if (processHandle && outputStreams.some((stream) => !stream.decoder)) for (const stream of outputStreams) {
				closeOutputHandle(stream);
				stream.ended = true;
			}
			await reportStartupError(error);
			await (processHandle ? requestCleanup("lineage-lost") : closeAuthority("lineage-lost"));
		} finally {
			pendingCommandStdio?.close();
			pendingCommandStdio = void 0;
		}
	};
	process.once("disconnect", () => {
		startupErrorAcknowledged.resolve();
		if (!start) {
			state = "closed";
			process.exitCode = 1;
			return;
		}
		requestCleanup("parent-lost");
	});
	process.once("SIGTERM", () => void requestCleanup("parent-lost"));
	process.once("SIGINT", () => void requestCleanup("parent-lost"));
	process.on("message", (raw) => {
		if (isWindowsJobServiceStart(raw) && start === void 0 && state === "starting") {
			startCommand(raw);
			return;
		}
		const message = asOptionalRecord(raw);
		if (!start || state === "closed" || !message || message.type !== "cancel" && message.type !== "startup-error-ack" || typeof message.generation !== "string" || typeof message.sequence !== "number" || message.generation !== start.generation || message.sequence <= lastHostSequence) {
			if (start && state !== "closed") requestCleanup("lineage-lost");
			return;
		}
		lastHostSequence = message.sequence;
		if (message.type === "startup-error-ack") startupErrorAcknowledged.resolve();
		else requestCleanup("cancel");
	});
}
runServiceChildWindowsJobAnchor();
//#endregion
export { runServiceChildWindowsJobAnchor };
