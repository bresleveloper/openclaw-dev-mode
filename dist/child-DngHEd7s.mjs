import { a as extractErrorCode, d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as signalProcessTree, t as killProcessTree } from "./kill-tree-D8IW3UNJ.mjs";
import { t as sleep } from "./sleep-BJ5slSa3.mjs";
import "./errors-DPfGDWk1.mjs";
import { n as resolveRuntimeWorkerArgv } from "./runtime-worker-url-CvMrvFI1.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-BCfqgqXF.mjs";
import { t as formatChildRuntimeSpawnWarning } from "./child-runtime-viability-X4GxYG5L.mjs";
import { r as GRACEFUL_CANCEL_TIMEOUT_MS } from "./host-lcL0oJAA.mjs";
import { t as SpawnBrokerError } from "./protocol-foRdUdX7.mjs";
import { t as BrokerChild } from "./child-DRcH2L5b.mjs";
import { n as isOwnedProcessGroupGone, t as assertProcessGroupControl } from "./service-child-group-ownership-D1TLR2xv.mjs";
import { t as prepareOomScoreAdjustedSpawn } from "./linux-oom-score-BCVNjaDp.mjs";
import { i as withChildProcessOperation } from "./spawn-diagnostics-CvEKrJ76.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { t as scheduleAdoptedChildZombieReapAfterExit } from "./scoped-child-reaper-C-aGFL-9.mjs";
import { n as stripNodeStartupHooks } from "./node-runtime-env-CYkSIfJc.mjs";
import { a as resolveWindowsCommandShim, i as resolveTrustedWindowsCmdExe, n as isWindowsBatchCommand, t as buildWindowsCmdExeCommandLine } from "./windows-command-DciDw8YG.mjs";
import { n as spawnWindowsJobChild, t as WindowsJobSetupError } from "./managed-windows-job-BWs4tBlT.mjs";
import { i as resolveWindowsExecutablePath, o as resolveWindowsSpawnProgramCandidate } from "./windows-spawn-BwP7BByc.mjs";
import { n as joinProcessCompletionAndOutput, r as onDecodedOutput, t as createAwaitedDecodedOutput } from "./decoded-output-Pq9RWQJS.mjs";
import { n as spawnWithFallback, t as spawnProcess } from "./spawn-utils-o4xgZL-d.mjs";
import { t as resolveLaunchableNodePath } from "./stable-node-path-CijB3tz6.mjs";
import { t as getProcessCleanupBudget } from "./cleanup-budget-B-yQr9sD.mjs";
import { createWriteStream, write, writev } from "node:fs";
import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { performance } from "node:perf_hooks";
import { createPipe } from "@openclaw/fs-safe/pipe";
//#region src/process/pipe-output.ts
/** Keep native backpressure while leaving the caller's diagnostic destination open. */
function pipeProcessOutput(source, destination, reportError) {
	const cleanup = () => {
		source.off("close", cleanup);
		destination.off("unpipe", onUnpipe);
		destination.off("error", onError);
		source.unpipe(destination);
		source.resume();
	};
	const onUnpipe = (stream) => {
		if (stream === source) queueMicrotask(cleanup);
	};
	const onError = (error) => {
		cleanup();
		reportError(error);
	};
	source.once("close", cleanup);
	destination.on("unpipe", onUnpipe);
	destination.on("error", onError);
	source.pipe(destination, { end: false });
	return cleanup;
}
//#endregion
//#region src/process/spawn-secret-input.ts
function prepareSecretInputStdio(stdio, secretInput) {
	if (!secretInput) return;
	if (!Number.isInteger(secretInput.fd) || secretInput.fd < 3) throw new Error("secret input file descriptor must be an integer greater than 2");
	while (stdio.length <= secretInput.fd) stdio.push("ignore");
	const pipe = process.platform === "win32" ? void 0 : createPipe();
	let writer = pipe?.writer;
	stdio[secretInput.fd] = pipe?.reader.fd ?? "overlapped";
	return {
		[Symbol.dispose]() {
			pipe?.reader.close();
			writer?.close();
			writer = void 0;
		},
		async deliverTo(child, options) {
			pipe?.reader.close();
			const streamWriter = writer;
			const stream = streamWriter === void 0 ? child.stdio[secretInput.fd] : createWriteStream("", {
				fd: streamWriter.fd,
				fs: {
					write,
					writev,
					close(_fd, callback) {
						try {
							streamWriter.close();
							callback(null);
						} catch (error) {
							callback(toErrorObject(error, "secret input close failed"));
						}
					}
				}
			});
			writer = void 0;
			if (!stream || typeof stream.end !== "function") throw new Error(`secret input file descriptor ${secretInput.fd} is unavailable`);
			const abortSignal = options?.abortSignal;
			if (abortSignal?.aborted) {
				stream.destroy();
				throw new Error("secret delivery aborted");
			}
			let data;
			try {
				data = secretInput.createData();
				await new Promise((resolve, reject) => {
					let settled = false;
					const settle = (error) => {
						if (settled) return;
						settled = true;
						abortSignal?.removeEventListener("abort", onAbort);
						if (error) reject(error);
						else resolve();
					};
					const onAbort = () => {
						stream.destroy();
						settle(/* @__PURE__ */ new Error("secret delivery aborted"));
					};
					const onError = (error) => settle(error);
					abortSignal?.addEventListener("abort", onAbort, { once: true });
					stream.on("error", onError);
					stream.once("close", () => stream.off("error", onError));
					stream.write(data, settle);
				});
			} finally {
				data?.fill(0);
				stream.destroy();
			}
		}
	};
}
//#endregion
//#region src/process/supervisor/service-child-output-relay.ts
const PUSHED_OUTPUT_BUFFER_LIMIT_BYTES = 262144;
function createOutputRelay(stream, piped = false, onFailure, onStreamFailure) {
	const consumer = onFailure && stream ? createAwaitedDecodedOutput(stream, onFailure) : void 0;
	const listeners = /* @__PURE__ */ new Set();
	const rawListeners = /* @__PURE__ */ new Set();
	const pending = [];
	let pendingBytes = 0;
	let active = false;
	let ended = false;
	let failed = false;
	let unsubscribe;
	const fail = (error) => {
		failed = true;
		onStreamFailure?.(error);
	};
	const deliver = (chunk) => {
		if (typeof chunk === "string") listeners.forEach((listener) => listener(chunk));
		else rawListeners.forEach((listener) => listener(chunk));
	};
	const activate = (keepOutput) => {
		if (active || piped) return;
		active = true;
		if (keepOutput) pending.forEach(deliver);
		pending.length = 0;
		pendingBytes = 0;
		stream?.resume();
	};
	const push = (chunk) => {
		if (active) {
			deliver(chunk);
			return true;
		}
		const chunkBytes = Buffer.isBuffer(chunk) ? chunk.length : Buffer.byteLength(chunk);
		if (!stream && pendingBytes + chunkBytes > PUSHED_OUTPUT_BUFFER_LIMIT_BYTES) return false;
		pending.push(chunk);
		if (!stream || Buffer.isBuffer(chunk)) pendingBytes += chunkBytes;
		if (stream && pendingBytes >= stream.readableHighWaterMark) stream.pause();
		return true;
	};
	const end = () => {
		ended = true;
	};
	if (stream) {
		if (!piped && !consumer) unsubscribe = onDecodedOutput(stream, push, push);
		stream.once("end", end);
		stream.on("error", fail);
		stream.once("close", () => {
			if (!ended) fail(/* @__PURE__ */ new Error("service child stream closed before EOF"));
		});
	}
	return {
		get ended() {
			return ended && !failed;
		},
		push,
		end,
		subscribe: (listener, onRaw) => {
			if (consumer) throw new Error("Process stdout requires its awaited consumer");
			listeners.add(listener);
			if (onRaw) rawListeners.add(onRaw);
			activate(true);
		},
		consume: consumer?.consume,
		drain: () => consumer ? consumer.drain() : activate(false),
		clear: () => {
			unsubscribe?.();
			consumer?.close();
			listeners.clear();
			rawListeners.clear();
			pending.length = 0;
			pendingBytes = 0;
		}
	};
}
//#endregion
//#region src/process/supervisor/service-child-cleanup.ts
function createServiceChildCleanup() {
	const completion = createDeferredCore();
	let authorityClose;
	const promise = (async () => {
		const [outcome] = await Promise.allSettled([completion.promise]);
		const closed = await authorityClose;
		const failure = closed?.status === "rejected" ? closed : outcome;
		if (failure.status === "rejected") throw failure.reason;
	})();
	return {
		completion,
		promise,
		outcome: Promise.allSettled([promise]),
		bindAuthorityClose: (close, onFailure) => () => {
			authorityClose = Promise.allSettled([close()]).then(([result]) => {
				if (result.status === "rejected") onFailure(result.reason);
				return result;
			});
		}
	};
}
//#endregion
//#region src/process/supervisor/service-child-protocol.ts
function readServiceChildMessage(raw) {
	return raw;
}
/** The retained private IPC peer owns delivery acknowledgement for these frames. */
function sendServiceChildMessage(child, message) {
	return new Promise((resolve, reject) => {
		if (!child.connected) {
			reject(/* @__PURE__ */ new Error("service child lifecycle IPC is closed"));
			return;
		}
		child.send(message, (error) => error ? reject(error) : resolve());
	});
}
function encodeServiceChildMessage(message) {
	return `${JSON.stringify(message)}\n`;
}
function supportsNodeWorkerProcessOwner(platform = process.platform) {
	return platform === "linux" || platform === "darwin";
}
//#endregion
//#region src/process/spawn-broker/relay-integration.ts
function createServiceChildControlSender(params) {
	return (payload, initiate) => {
		const message = Object.assign({
			type: payload.type,
			generation: params.generation,
			sequence: params.nextSequence()
		}, payload);
		const settlement = initiate ? params.startup.catch(() => params.cleanup) : void 0;
		settlement?.catch(() => {});
		if (params.useWindowsJobAnchor) return initiateServiceChildRelay(params.child, message, initiate && ((launch) => initiate(launch, settlement)));
		return new Promise((resolve, reject) => {
			const control = params.getControl();
			if (!control || control.destroyed) {
				reject(/* @__PURE__ */ new Error("service child control pipe is closed"));
				return;
			}
			const launch = () => control.write(encodeServiceChildMessage(message), "utf8", (error) => {
				if (error) reject(error);
				else resolve();
			});
			if (initiate) initiate(launch, settlement);
			else launch();
		});
	};
}
/** Admit the target command when its final frame enters native IPC, after any broker queue. */
function initiateServiceChildRelay(child, message, initiateSpawn) {
	return new Promise((resolve, reject) => {
		if (!child.connected) {
			reject(/* @__PURE__ */ new Error("service child lifecycle IPC is closed"));
			return;
		}
		const done = (error) => error ? reject(error) : resolve();
		if (child instanceof BrokerChild) child.send(message, void 0, void 0, done, initiateSpawn);
		else {
			const launch = () => child.send(message, done);
			if (initiateSpawn) initiateSpawn(launch);
			else launch();
		}
	});
}
/** Publish cleanup ownership before waiting for the broker's pipe and IPC handoff. */
function spawnServiceChildRelay(params) {
	const executable = resolveLaunchableNodePath();
	const env = { ...params.env };
	if (env.NODE_OPTIONS !== void 0) env.NODE_OPTIONS = stripNodeStartupHooks(env.NODE_OPTIONS);
	const child = withChildProcessOperation("service.relay", () => spawnProcess(executable, resolveRuntimeWorkerArgv(params.workerUrl, executable), {
		stdio: params.stdio,
		detached: params.detached,
		windowsHide: true,
		env
	}), "default");
	const cleanup = createServiceChildCleanup();
	params.onSpawnCleanup?.(cleanup.promise);
	let transportReady;
	if (child instanceof BrokerChild) transportReady = child.ready().catch((error) => {
		if (error instanceof Error) error.message = formatChildRuntimeSpawnWarning(error) ?? error.message;
		cleanup.completion.reject(error);
		throw error;
	});
	else if (child.pid === void 0) {
		const closed = new Promise((resolve) => {
			child.once("close", () => resolve());
		});
		transportReady = new Promise((resolve) => {
			child.once("error", resolve);
		}).then(async (error) => {
			await closed;
			cleanup.completion.resolve();
			error.message = formatChildRuntimeSpawnWarning(error) ?? error.message;
			throw error;
		});
	}
	return {
		child,
		cleanup,
		transportReady
	};
}
//#endregion
//#region src/process/supervisor/adapters/child-stdin.ts
/** Keep direct children and service relays on the same observable stdin lifecycle. */
function createManagedChildStdin(stream, end = () => stream?.end(), onWriteError) {
	if (!stream) return;
	let ended = stream.writableEnded || stream.writableFinished;
	let destroyed = stream.destroyed;
	let closedError;
	stream.once("finish", () => {
		ended = true;
	});
	stream.once("close", () => {
		ended = true;
		destroyed = true;
	});
	stream.once("error", (error) => {
		destroyed = true;
		onWriteError?.(error);
	});
	return {
		get destroyed() {
			return destroyed || stream.destroyed;
		},
		get writable() {
			return !destroyed && !ended && stream.writable;
		},
		get writableEnded() {
			return ended || stream.writableEnded;
		},
		get writableFinished() {
			return stream.writableFinished;
		},
		write(data, callback) {
			if (destroyed || ended || !stream.writable) {
				const error = Object.assign(/* @__PURE__ */ new Error("stdin is not writable"), { code: "EPIPE" });
				callback?.(error);
				onWriteError?.(error);
				return;
			}
			try {
				stream.write(data, (error) => {
					const code = extractErrorCode(error);
					callback?.(closedError && (code === "ECANCELED" || code === "ERR_STREAM_DESTROYED") ? closedError : error);
				});
			} catch (error) {
				callback?.(error instanceof Error ? error : new Error(String(error)));
			}
		},
		end() {
			if (ended || destroyed || stream.destroyed || stream.writableEnded) return;
			ended = true;
			try {
				end();
			} catch {}
		},
		destroy() {
			ended = true;
			destroyed = true;
			if (onWriteError) closedError ??= Object.assign(/* @__PURE__ */ new Error("stdin is not writable"), { code: "EPIPE" });
			try {
				stream.destroy(closedError);
			} catch {}
		}
	};
}
//#endregion
//#region src/process/supervisor/adapters/env.ts
function toStringEnv(env) {
	if (!env) return {};
	const out = {};
	for (const [key, value] of Object.entries(env)) {
		if (value === void 0) continue;
		out[key] = value;
	}
	return out;
}
//#endregion
//#region src/process/supervisor/adapters/process-events.ts
/** Preserve terminal facts and startup errors until the transport owner subscribes. */
function createProcessAdapterEvents() {
	let exit;
	const exitListeners = /* @__PURE__ */ new Set();
	const errorListeners = /* @__PURE__ */ new Set();
	const pendingErrors = /* @__PURE__ */ new Map();
	return {
		onExit: (listener) => {
			exitListeners.add(listener);
			if (exit) listener(exit.code, exit.signal);
		},
		onError: (listener) => {
			errorListeners.add(listener);
			for (const [source, error] of pendingErrors) listener(error, source);
			pendingErrors.clear();
		},
		emitExit: (code, signal) => {
			exit = {
				code,
				signal
			};
			for (const listener of exitListeners) listener(code, signal);
		},
		emitError: (error, source) => {
			if (errorListeners.size === 0) {
				if (!pendingErrors.has(source)) pendingErrors.set(source, error);
			} else for (const listener of errorListeners) listener(error, source);
		},
		clear: () => {
			exitListeners.clear();
			errorListeners.clear();
			pendingErrors.clear();
		}
	};
}
//#endregion
//#region src/process/supervisor/service-child-cleanup-deadline.ts
/** One deadline spans cancellation, receipt, native joins, and output drain. */
function createServiceChildCleanupDeadline(params) {
	let deadline;
	let startedAt;
	let budget;
	let expiryTimer;
	let expiryPoll;
	let escalationTimer;
	const begin = (shutdownBudget) => {
		if (!params.enabled() || deadline !== void 0 && (!shutdownBudget || budget)) return;
		clearTimeout(expiryTimer);
		clearImmediate(expiryPoll);
		clearTimeout(escalationTimer);
		const now = performance.now();
		startedAt ??= now;
		budget = shutdownBudget;
		deadline = budget?.deadline ?? startedAt + 5e3;
		const remainingMs = budget ? Math.max(0, deadline - now) : GRACEFUL_CANCEL_TIMEOUT_MS;
		if (budget) escalationTimer = setTimeout(params.force, Math.min(GRACEFUL_CANCEL_TIMEOUT_MS, remainingMs / 2));
		expiryTimer = setTimeout(() => {
			expiryPoll = setImmediate(params.expire);
		}, Math.ceil(remainingMs));
	};
	return {
		get at() {
			return deadline;
		},
		get startedAt() {
			return startedAt;
		},
		get budget() {
			return budget;
		},
		begin,
		cancel(signal) {
			const shutdownBudget = getProcessCleanupBudget();
			if (shutdownBudget || signal === "SIGKILL") begin(shutdownBudget);
		},
		clear() {
			clearTimeout(expiryTimer);
			clearImmediate(expiryPoll);
			clearTimeout(escalationTimer);
		}
	};
}
//#endregion
//#region src/process/bounded-line-framer.ts
/** Frames LF-delimited bytes without decoding or consuming an incomplete final line. */
function createBoundedLineFramer(maxBytes, overflowMessage) {
	let chunks = [];
	let byteLength = 0;
	const clear = () => {
		chunks = [];
		byteLength = 0;
	};
	return {
		get pendingByteLength() {
			return byteLength;
		},
		clear,
		*push(chunk) {
			let offset = 0;
			while (offset < chunk.length) {
				const searchable = chunk.subarray(offset, offset + maxBytes - byteLength + 1);
				const newline = searchable.indexOf(10);
				const end = offset + (newline === -1 ? searchable.length : newline);
				byteLength += end - offset;
				if (byteLength > maxBytes) throw new Error(overflowMessage);
				chunks.push(chunk.subarray(offset, end));
				if (newline === -1) break;
				const line = Buffer.concat(chunks, byteLength);
				clear();
				offset = end + 1;
				yield line;
			}
		}
	};
}
//#endregion
//#region src/process/supervisor/service-child-control-reader.ts
const CONTROL_PENDING_LINE_LIMIT_BYTES = 262144;
function readServiceChildControl(control, onLine, onOverflow) {
	const frames = createBoundedLineFramer(CONTROL_PENDING_LINE_LIMIT_BYTES, "Control line overflow");
	control.on("data", (chunk) => {
		const lines = frames.push(chunk);
		for (;;) {
			let next;
			try {
				next = lines.next();
			} catch {
				frames.clear();
				onOverflow();
				return;
			}
			if (next.done) return;
			onLine(next.value.toString("utf8"));
		}
	});
}
//#endregion
//#region src/process/supervisor/inherited-process-lineage.ts
const inherited = resolveGlobalSingleton(Symbol.for("openclaw.inheritedProcessLineage"), () => ({}));
function getInheritedNativeProcessOwner() {
	return inherited.nativeProcessOwner;
}
function bindInheritedNativeProcessOwner(entrypoint) {
	inherited.nativeProcessOwner = entrypoint;
	return () => {
		if (inherited.nativeProcessOwner === entrypoint) inherited.nativeProcessOwner = void 0;
	};
}
function getInheritedProcessLineageFds() {
	return inherited.fds ?? [];
}
function bindInheritedProcessLineageFds(fds) {
	inherited.fds = fds;
	return () => {
		if (inherited.fds === fds) inherited.fds = void 0;
	};
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
//#region src/process/supervisor/service-child-relay-preparation.ts
/** Prepare transport facts; the host revalidates authority immediately before spawning. */
function prepareServiceChildRelay(params) {
	const nativeProcessOwner = getInheritedNativeProcessOwner() ?? (process.platform === "linux" && !process.versions.bun && true ? resolveRuntimeProcessEntrypointUrl("serviceChildGroupAnchor").href : void 0);
	const useLinuxSubreaper = nativeProcessOwner !== void 0 && (!params.ownedWorker || params.nativeProcessOwnerSupported === true);
	if (!useLinuxSubreaper) assertProcessGroupControl();
	const useWindowsJobAnchor = process.platform === "win32" && params.windowsShellCommand !== void 0;
	if (params.ownedWorker && !supportsNodeWorkerProcessOwner()) throw new Error("Owned worker relay requires Linux or macOS");
	if (useWindowsJobAnchor && params.stdoutConsumption === "awaited") throw new Error("Windows Job output does not support awaited stdout consumption");
	const stdio = useWindowsJobAnchor ? [
		"ignore",
		"ignore",
		"ignore"
	] : [
		params.stdinMode === "inherit" ? "inherit" : "pipe",
		"pipe",
		"pipe"
	];
	const secretDelivery = prepareSecretInputStdio(stdio, useWindowsJobAnchor ? void 0 : params.secretInput);
	let deliveryTransferred = false;
	const deliveryOwner = {
		transferSecretInput() {
			deliveryTransferred = true;
			return secretDelivery;
		},
		[Symbol.dispose]() {
			if (!deliveryTransferred) secretDelivery?.[Symbol.dispose]();
		}
	};
	try {
		const controlFd = useWindowsJobAnchor ? void 0 : reserveStdioEntry(stdio, "pipe");
		const lineageFd = useWindowsJobAnchor ? void 0 : reserveStdioEntry(stdio, "pipe");
		const parentLineageFds = useWindowsJobAnchor ? [] : getInheritedProcessLineageFds().map((fd) => reserveStdioEntry(stdio, fd));
		reserveStdioEntry(stdio, "ipc");
		return {
			useWindowsJobAnchor,
			useLinuxSubreaper,
			nativeProcessOwner: useLinuxSubreaper ? nativeProcessOwner : void 0,
			controlFd,
			lineageFd,
			ownership: params.ownedWorker ? {
				ownedWorker: true,
				cleanupBinding: params.cleanupBinding,
				parentLineageFds: [lineageFd, ...parentLineageFds]
			} : useLinuxSubreaper ? { parentLineageFds: [lineageFd, ...parentLineageFds] } : {
				lineageFd,
				parentLineageFds
			},
			spawn: {
				workerUrl: useLinuxSubreaper ? new URL(nativeProcessOwner) : resolveRuntimeProcessEntrypointUrl(useWindowsJobAnchor ? "serviceChildWindowsJobAnchor" : "serviceChildRelay"),
				env: params.ownedWorker ? params.env : process.env,
				detached: useWindowsJobAnchor || useLinuxSubreaper || params.ownedWorker === true || parentLineageFds.length > 0,
				stdio
			},
			...deliveryOwner
		};
	} catch (error) {
		deliveryOwner[Symbol.dispose]();
		throw error;
	}
}
//#endregion
//#region src/process/supervisor/service-child-relay-retirement.ts
/** Retain admitted transport for cancellation; transport loss asks the native owner to drain. */
function stopServiceChildOwner(child, retainDescendantCustody, cancelAdmitted) {
	if (cancelAdmitted) {
		cancelAdmitted();
		return;
	}
	if (retainDescendantCustody) {
		if (child.connected) child.disconnect();
	} else child.kill("SIGKILL");
}
/** The relay reaps its anchor before the host releases the retained relay handle. */
function createServiceChildRelayRetirement(params) {
	let requested = false;
	let sequence;
	let signaledAt;
	let signalError;
	let relaySignaled = false;
	let exit;
	const recordError = (error) => {
		const failure = toErrorObject(error, "service child retirement signal failed");
		signalError = signalError ? new AggregateError([signalError, failure], "service child retirement signals failed") : failure;
	};
	const reconcile = () => {
		if (!requested || exit || !params.canRetire()) return;
		signaledAt ??= performance.now();
		if (params.anchorGone()) {
			if (relaySignaled) return;
			relaySignaled = true;
			try {
				if (!params.child.kill("SIGKILL")) recordError(/* @__PURE__ */ new Error("retained relay SIGKILL was not delivered"));
			} catch (error) {
				recordError(error);
			}
		} else if (sequence === void 0) {
			sequence = params.nextSequence();
			try {
				params.child.send({
					type: "cancel",
					generation: params.generation,
					sequence,
					signal: "SIGKILL"
				}, (error) => {
					if (error) recordError(error);
				});
			} catch (error) {
				recordError(error);
			}
		}
	};
	const diagnostics = () => ({
		durationMs: (exit?.at ?? performance.now()) - params.startedAt(),
		escalationAfterMs: signaledAt === void 0 ? void 0 : signaledAt - params.startedAt(),
		signalError
	});
	return {
		request: () => {
			requested = true;
			reconcile();
		},
		reconcile,
		recordSignalError(error) {
			if (signaledAt === void 0) return false;
			recordError(error);
			return true;
		},
		observeExit: (code, signal) => {
			exit = {
				code,
				signal,
				at: performance.now()
			};
		},
		diagnostics,
		get result() {
			return exit && signaledAt !== void 0 ? {
				reason: "forced-relay-exit",
				signalRequested: "SIGKILL",
				...diagnostics(),
				escalationAfterMs: signaledAt - params.startedAt(),
				exit: {
					code: exit.code,
					signal: exit.signal
				}
			} : void 0;
		}
	};
}
/** Builds the hard-deadline failure; stability bundles keep messages, not cause payloads. */
function createServiceChildCleanupExpiryError(pending, owner, diagnostics) {
	const ownerError = new Error("service child cleanup owner: " + JSON.stringify({
		...owner,
		durationMs: diagnostics.durationMs,
		escalationAfterMs: diagnostics.escalationAfterMs
	}), { cause: diagnostics.signalError });
	Object.defineProperties(ownerError, {
		durationMs: { value: diagnostics.durationMs },
		escalationAfterMs: { value: diagnostics.escalationAfterMs },
		signalError: { value: diagnostics.signalError }
	});
	return new Error("service child cleanup did not complete before its hard deadline; pending: " + JSON.stringify(pending), { cause: ownerError });
}
/** Join startup cleanup without letting its failure replace the anchor's startup failure. */
async function joinStartupFailureCleanup(startupError, acknowledgement, cleanup) {
	await acknowledgement?.catch(() => {});
	const cleanupError = await cleanup.then(() => void 0, (error) => error);
	return cleanupError === void 0 || cleanupError === startupError ? startupError : new AggregateError([startupError, cleanupError], toErrorObject(startupError, "service child startup failed").message);
}
//#endregion
//#region src/process/supervisor/service-child-relay-startup.ts
/** Join startup admission and secret delivery before handing caller input to the command. */
async function startServiceChildRelay(options) {
	try {
		var _usingCtx$3 = _usingCtx();
		const { params, preparation, child, start, stdin } = options;
		const delivery = _usingCtx$3.u(preparation.transferSecretInput());
		try {
			params.assertCurrent?.();
			if (params.abortSignal?.aborted) options.onConstructionAbort();
			params.beforeSpawn?.();
			await Promise.race([sendServiceChildMessage(child, start), options.constructionAbort]);
			params.assertCurrent?.();
			const [startupResult, secretDeliveryResult] = await Promise.allSettled([options.startup, delivery?.deliverTo(child, { abortSignal: params.abortSignal })]);
			if (startupResult.status === "rejected") throw await joinStartupFailureCleanup(startupResult.reason, options.getStartupErrorAckDelivery(), options.cleanup);
			if (secretDeliveryResult.status === "rejected") throw secretDeliveryResult.reason;
			if (params.input !== void 0 && params.prepareInput) await params.prepareInput();
			const waitError = options.getWaitError();
			if (params.abortSignal?.aborted || waitError) throw waitError ?? /* @__PURE__ */ new Error("service child construction aborted");
			params.assertCurrent?.();
			if (params.input !== void 0) {
				stdin?.write(params.input);
				stdin?.end();
			} else if (params.stdinMode === "pipe-closed") stdin?.end();
		} catch (error) {
			options.onFailure();
			throw error;
		} finally {
			options.removeConstructionAbortListener();
		}
	} catch (_) {
		_usingCtx$3.e = _;
	} finally {
		_usingCtx$3.d();
	}
}
//#endregion
//#region src/process/supervisor/service-child-relay-host.ts
async function createServiceChildRelayAdapter(params) {
	try {
		var _usingCtx$2 = _usingCtx();
		const generation = randomUUID();
		const preparation = _usingCtx$2.u(prepareServiceChildRelay(params));
		const { useWindowsJobAnchor, useLinuxSubreaper, controlFd, lineageFd } = preparation;
		if (params.abortSignal?.aborted) throw new Error("service child construction aborted");
		params.assertCurrent?.();
		params.beforeSpawn?.();
		const { child, cleanup, transportReady } = spawnServiceChildRelay({
			...preparation.spawn,
			onSpawnCleanup: params.onSpawnCleanup
		});
		if (transportReady) await transportReady;
		const control = controlFd === void 0 ? null : child.stdio[controlFd];
		const lineage = lineageFd === void 0 ? null : child.stdio[lineageFd];
		if (!child.connected || !useWindowsJobAnchor && (!control || !lineage || !child.stdout || !child.stderr)) {
			stopServiceChildOwner(child, useLinuxSubreaper);
			const error = /* @__PURE__ */ new Error("service child cleanup identity lost: lifecycle channels were not created");
			cleanup.completion.reject(error);
			throw error;
		}
		const stopOnOutputFailure = params.stdoutConsumption === "awaited" ? () => requestedSignal !== "SIGKILL" && kill("SIGKILL") : void 0;
		const events = createProcessAdapterEvents();
		const outputFailure = (stream, error) => {
			resultError ??= error;
			events.emitError(error, stream);
			settleWait();
		};
		const stdoutRelay = createOutputRelay(child.stdout ?? void 0, false, stopOnOutputFailure, (error) => outputFailure("stdout", error));
		const stderrRelay = createOutputRelay(child.stderr ?? void 0, Boolean(params.stderrDestination), void 0, (error) => outputFailure("stderr", error));
		const unpipeStderr = child.stderr && params.stderrDestination ? pipeProcessOutput(child.stderr, params.stderrDestination, (error) => events.emitError(error, "stderr")) : void 0;
		if (!params.terminateOnHostLoss) child.stdin?.on("error", (error) => events.emitError(error, "stdin"));
		let state = "starting";
		let commandPid;
		let anchorPid = useLinuxSubreaper ? child.pid : void 0;
		let outboundSequence = 0;
		let inboundSequence = 0;
		let rootResult;
		let resultError;
		let closingReceipt;
		let controlError;
		let childError;
		let childDisconnected = false;
		let childExited = false;
		const relayExit = createDeferredCore();
		const lineageEnd = createDeferredCore();
		let requestedSignal;
		let waitError;
		const startup = createDeferredCore();
		const resultCompletion = createDeferredCore();
		startup.promise.catch(() => {});
		const constructionAbort = createDeferredCore();
		constructionAbort.promise.catch(() => {});
		let startupErrorAckDelivery;
		let completionSettled = false;
		Promise.allSettled([resultCompletion.promise, cleanup.outcome]).then(() => {
			completionSettled = true;
			cleanupDeadline.clear();
		});
		const settleWait = () => {
			retirement.reconcile();
			const error = resultError ?? (rootResult ? void 0 : waitError);
			if (error) {
				if (!rootResult && waitError && params.stdoutConsumption === "awaited") {
					stdoutRelay.clear();
					child.stdout?.resume();
				}
				resultCompletion.reject(error);
				return;
			}
			if (!rootResult || !stdoutRelay.ended || !stderrRelay.ended) return;
			if (requestedSignal && state !== "closed" && state !== "identity-lost") return;
			resultCompletion.resolve(rootResult);
		};
		child.stdout?.once("end", settleWait);
		child.stdout?.once("close", settleWait);
		child.stderr?.once("end", settleWait);
		child.stderr?.once("close", settleWait);
		const loseIdentity = (message, options) => {
			if (state === "closed" || state === "identity-lost") return;
			state = "identity-lost";
			waitError = new Error(`service child cleanup identity lost: ${message}`, options);
			try {
				events.emitError(waitError, "process");
			} catch (error) {
				waitError = toErrorObject(error, "service child cleanup error observer failed");
			}
			if (!commandPid) startup.reject(waitError);
			settleWait();
			cleanup.completion.reject(waitError);
			if (!params.ownedWorker) lineage?.destroy();
			if (!useWindowsJobAnchor && child.connected) child.disconnect();
		};
		const expireCleanup = () => {
			if (completionSettled) return;
			const error = createServiceChildCleanupExpiryError({
				closingReceipt: !closingReceipt,
				controlClose: !control?.closed,
				relayExit: !childExited,
				lineageEof: !lineage?.readableEnded,
				extinctionUnconfirmed: state !== "closed",
				stdoutEnd: !stdoutRelay.ended,
				stderrEnd: !stderrRelay.ended
			}, {
				generation,
				relayPid: child.pid,
				anchorPid,
				commandPid,
				treeOwnership: useLinuxSubreaper ? "linux-subreaper" : "process-group"
			}, retirement.diagnostics());
			resultError ??= error;
			startup.reject(error);
			resultCompletion.reject(error);
			cleanup.completion.reject(error);
			try {
				loseIdentity(error.message);
			} finally {
				control?.destroy();
				if (!params.ownedWorker) lineage?.destroy();
				child.stdout?.destroy();
				child.stderr?.destroy();
			}
		};
		const cleanupDeadline = createServiceChildCleanupDeadline({
			enabled: () => !useWindowsJobAnchor && !completionSettled,
			expire: expireCleanup,
			force: () => kill("SIGKILL")
		});
		const sendControlMessage = createServiceChildControlSender({
			child,
			getControl: () => control,
			useWindowsJobAnchor,
			startup: startup.promise,
			cleanup: cleanup.completion.promise,
			generation,
			nextSequence: () => ++outboundSequence
		});
		const retirement = createServiceChildRelayRetirement({
			child,
			generation,
			nextSequence: () => ++outboundSequence,
			startedAt: () => cleanupDeadline.startedAt,
			anchorGone: () => {
				try {
					return useLinuxSubreaper ? closingReceipt === "linux-subreaper" : anchorPid !== void 0 && isOwnedProcessGroupGone(anchorPid);
				} catch {
					return false;
				}
			},
			canRetire: () => (!useLinuxSubreaper || closingReceipt === "linux-subreaper") && state === "closing" && control?.closed === true && lineage?.readableEnded === true && stdoutRelay.ended && stderrRelay.ended && performance.now() < cleanupDeadline.at
		});
		lineage?.once("end", () => {
			lineageEnd.resolve();
			retirement.reconcile();
			if (state !== "starting" && state !== "active") return;
			sendControlMessage({ type: "lineage-closed" }).catch((error) => {
				if (state === "starting" || state === "active") loseIdentity(toErrorObject(error, "lineage notification failed").message);
			});
		});
		lineage?.once("error", (error) => loseIdentity("lineage observation failed", { cause: error }));
		lineage?.once("close", () => {
			if (!lineage.readableEnded) loseIdentity("lineage reader closed before EOF");
		});
		lineage?.resume();
		const onConstructionAbort = () => {
			stopServiceChildOwner(child, useLinuxSubreaper);
			loseIdentity("construction aborted");
			constructionAbort.reject(waitError ?? /* @__PURE__ */ new Error("service child construction aborted"));
		};
		const removeConstructionAbortListener = () => {
			params.abortSignal?.removeEventListener("abort", onConstructionAbort);
		};
		const finishAuthorityClose = (missingReceiptError) => {
			if (state === "closed" || state === "identity-lost") return;
			if (!closingReceipt) {
				loseIdentity(missingReceiptError);
				return;
			}
			state = "closed";
			if (!rootResult && !resultError && !waitError) {
				rootResult = {
					code: null,
					signal: requestedSignal ?? null
				};
				events.emitExit(rootResult.code, rootResult.signal);
			}
			settleWait();
			cleanup.completion.resolve();
			if (retirement.result) cleanupDeadline.budget?.warn("service child relay required forced retirement; cleanup completed");
		};
		const finishPosixAuthority = async () => {
			const missingReceiptError = childError?.message ?? controlError?.message ?? "anchor channel closed without a matching closing receipt";
			retirement.reconcile();
			if (state === "closed" || state === "identity-lost") return;
			if (!closingReceipt || !anchorPid) {
				loseIdentity(missingReceiptError);
				return;
			}
			if (useLinuxSubreaper && closingReceipt !== "linux-subreaper") {
				loseIdentity("native owner closed without kernel descendant extinction");
				return;
			}
			cleanupDeadline.begin();
			if (!lineage?.readableEnded) await Promise.race([lineageEnd.promise, cleanup.completion.promise]);
			if (state !== "closing") return;
			for (;;) {
				retirement.reconcile();
				if (childExited) {
					let extinct = useLinuxSubreaper;
					try {
						extinct ||= isOwnedProcessGroupGone(anchorPid);
					} catch (cause) {
						loseIdentity("owned process group disappearance could not be confirmed", { cause });
						return;
					}
					if (extinct) {
						finishAuthorityClose(missingReceiptError);
						return;
					}
				}
				const remainingMs = cleanupDeadline.at - performance.now();
				if (remainingMs <= 0 && childExited) {
					expireCleanup();
					return;
				}
				await Promise.race([
					...remainingMs > 0 ? [sleep(Math.min(100, remainingMs))] : [],
					...!childExited ? [relayExit.promise] : [],
					cleanup.completion.promise
				]);
				if (state !== "closing") return;
			}
		};
		const handleAnchorMessage = (message) => {
			if (message.generation !== generation || message.sequence <= inboundSequence) {
				loseIdentity("stale anchor generation or sequence");
				return;
			}
			inboundSequence = message.sequence;
			if (message.type === "prepared" && state === "starting" && params.initiateSpawn) sendControlMessage({ type: "launch" }, params.initiateSpawn).catch((error) => loseIdentity(String(error)));
			else if (message.type === "ready" && state === "starting") {
				if (message.treeOwnership === "linux-subreaper" !== useLinuxSubreaper) {
					loseIdentity("process owner did not admit the selected ownership contract");
					return;
				}
				commandPid = message.commandPid;
				anchorPid = useLinuxSubreaper ? child.pid : message.anchorPid;
				state = "active";
				startup.resolve();
			} else if (message.type === "root-result") {
				stdin?.destroy?.();
				if (!resultError && !rootResult) {
					rootResult = {
						code: message.code,
						signal: message.signal
					};
					events.emitExit(message.code, message.signal);
				}
				settleWait();
			} else if (message.type === "stdin-closed") stdin?.destroy?.();
			else if (message.type === "worker-message" && params.ownedWorker) try {
				params.onWorkerMessage?.(message.message);
			} catch {}
			else if (message.type === "result-error") {
				resultError ??= /* @__PURE__ */ new Error(`service child result unavailable: ${message.error}`);
				settleWait();
			} else if (message.type === "output") {
				if (!(message.stream === "stdout" ? stdoutRelay : stderrRelay).push(message.chunk)) {
					resultError ??= /* @__PURE__ */ new Error(`service child ${message.stream} exceeded its pre-subscription buffer`);
					settleWait();
				}
			} else if (message.type === "output-end") {
				(message.stream === "stdout" ? stdoutRelay : stderrRelay).end();
				settleWait();
			} else if (message.type === "closing") {
				if (state === "closed" || state === "identity-lost") return;
				closingReceipt = message.descendantsReaped === true ? "linux-subreaper" : "process-group";
				state = "closing";
				cleanupDeadline.begin();
				if (useLinuxSubreaper && closingReceipt === "linux-subreaper") retirement.request();
				retirement.reconcile();
				if (control) sendControlMessage({
					type: "closing-ack",
					closingSequence: message.sequence
				}).catch((error) => {
					controlError ??= toErrorObject(error, "closing acknowledgement failed");
				});
			} else if (message.type === "startup-error") {
				anchorPid ??= message.anchorPid;
				cleanupDeadline.begin();
				if (useWindowsJobAnchor || anchorPid !== void 0) startup.reject(Object.assign(new Error(message.error), message.errorDetails));
				else loseIdentity(message.error);
				startupErrorAckDelivery = sendControlMessage({ type: "startup-error-ack" });
				startupErrorAckDelivery.catch((error) => loseIdentity(toErrorObject(error, "startup error acknowledgement failed").message));
			}
		};
		if (control) {
			readServiceChildControl(control, (line) => {
				try {
					const message = readServiceChildMessage(JSON.parse(line));
					if (!("sequence" in message)) throw new Error("invalid anchor message");
					handleAnchorMessage(message);
				} catch {
					loseIdentity("invalid anchor message");
				}
			}, () => {
				kill("SIGKILL");
				loseIdentity("control pipe pending line exceeded cap");
				stopServiceChildOwner(child, useLinuxSubreaper);
			});
			const finishControl = cleanup.bindAuthorityClose(finishPosixAuthority, (reason) => {
				state = "identity-lost";
				waitError = toErrorObject(reason, "service child authority close failed");
				startup.reject(reason);
				settleWait();
				cleanup.completion.reject(reason);
				if (!params.ownedWorker) lineage?.destroy();
				if (child.connected) child.disconnect();
			});
			control.once("end", finishControl);
			control.once("close", () => {
				if (!control.readableEnded) finishControl();
			});
			control.on("error", (error) => {
				controlError ??= error;
			});
		}
		child.on("message", (raw) => {
			const message = readServiceChildMessage(raw);
			if (!message || typeof message !== "object") {
				if (useWindowsJobAnchor) loseIdentity("invalid anchor message");
				return;
			}
			if (useWindowsJobAnchor) {
				if (!("sequence" in message)) {
					loseIdentity("invalid anchor message");
					return;
				}
				handleAnchorMessage(message);
				return;
			}
			if (message.generation !== generation) return;
			if (message.type === "relay-error") {
				if (!retirement.recordSignalError(new Error(message.error))) loseIdentity(message.error);
			}
		});
		child.once("error", (error) => {
			childError ??= error;
			events.emitError(error, "process");
		});
		const finishWindowsAuthority = () => {
			if (!useWindowsJobAnchor || !childDisconnected || !childExited) return;
			finishAuthorityClose(childError?.message ?? "Windows service child anchor exited without a closing receipt");
		};
		child.once("disconnect", () => {
			childDisconnected = true;
			finishWindowsAuthority();
		});
		child.once("exit", (code, signal) => {
			childExited = true;
			retirement.observeExit(code, signal);
			relayExit.resolve();
			removeConstructionAbortListener();
			if (useWindowsJobAnchor) finishWindowsAuthority();
		});
		const start = {
			type: params.initiateSpawn ? "prepare" : "start",
			generation,
			command: params.command,
			args: params.args,
			argv0: params.argv0,
			cwd: params.cwd,
			env: toStringEnv(params.env ?? process.env),
			stdinMode: params.stdinMode,
			secretFd: params.secretInput?.fd,
			terminateOnHostLoss: params.terminateOnHostLoss,
			controlFd,
			...preparation.ownership,
			treeOwnership: useLinuxSubreaper ? "linux-subreaper" : void 0,
			nativeProcessOwner: preparation.nativeProcessOwner,
			...control ? { acknowledgeClosing: true } : {},
			windowsShellCommand: params.windowsShellCommand
		};
		const stdin = createManagedChildStdin(child.stdin, params.terminateOnHostLoss ? () => {
			sendControlMessage({ type: "stdin-end" }).then(() => child.stdin?.end(), (error) => loseIdentity(toErrorObject(error, "stdin EOF delivery failed").message));
		} : void 0, params.terminateOnHostLoss ? (error) => events.emitError(error, "stdin") : void 0);
		params.abortSignal?.addEventListener("abort", onConstructionAbort, { once: true });
		const ready = startServiceChildRelay({
			params,
			preparation,
			child,
			start,
			stdin,
			startup: startup.promise,
			constructionAbort: constructionAbort.promise,
			onConstructionAbort,
			getWaitError: () => waitError,
			getStartupErrorAckDelivery: () => startupErrorAckDelivery,
			cleanup: cleanup.promise,
			onFailure: () => {
				stdoutRelay.drain();
				unpipeStderr?.();
				stderrRelay.drain();
				stopServiceChildOwner(child, useLinuxSubreaper, commandPid ? kill : void 0);
			},
			removeConstructionAbortListener
		});
		ready.catch(() => {});
		function kill(signal = "SIGKILL") {
			const normalized = signal === "SIGTERM" ? "SIGTERM" : "SIGKILL";
			cleanupDeadline.cancel(normalized);
			if (normalized === "SIGKILL") retirement.request();
			if (state !== "active") return;
			requestedSignal = normalized;
			sendControlMessage({
				type: "cancel",
				signal: normalized
			}).catch((error) => {
				if (state === "active") loseIdentity(toErrorObject(error, "service child cancellation failed").message);
			});
		}
		let startGate;
		let startGateClosed = false;
		const openStartGate = params.ownedWorker ? () => {
			if (startGateClosed || state !== "active" || requestedSignal) return Promise.reject(/* @__PURE__ */ new Error("worker lifecycle closed before startup"));
			return startGate ??= sendControlMessage({ type: "worker-start" });
		} : void 0;
		return {
			adapter: {
				get pid() {
					return params.ownedWorker ? anchorPid : commandPid;
				},
				stdin,
				oomScoreWrapperSelected: params.oomScoreWrapperSelected,
				supportsRawOutput: !useWindowsJobAnchor,
				onStdout: stdoutRelay.subscribe,
				...stdoutRelay.consume ? { consumeStdout: stdoutRelay.consume } : {},
				onStderr: stderrRelay.subscribe,
				onExit: events.onExit,
				onError: events.onError,
				wait: async () => {
					const output = stdoutRelay.drain();
					stderrRelay.drain();
					settleWait();
					return output ? await joinProcessCompletionAndOutput(resultCompletion.promise, output) : await resultCompletion.promise;
				},
				...useLinuxSubreaper ? { treeOwnership: "linux-subreaper" } : {},
				waitForExtinction: () => cleanup.promise,
				confirmExtinction: () => state === "closed" || Boolean(!useWindowsJobAnchor && !useLinuxSubreaper && anchorPid && childExited && lineage?.readableEnded && stdoutRelay.ended && stderrRelay.ended && isOwnedProcessGroupGone(anchorPid)),
				get cleanupResult() {
					return state === "closed" ? retirement.result : void 0;
				},
				kill,
				openStartGate,
				closeStartGate: params.ownedWorker ? () => {
					startGateClosed = true;
					sendControlMessage({ type: "worker-close" }).catch((error) => {
						if (state === "active") loseIdentity("worker startup channel could not be closed", { cause: error });
					});
				} : void 0,
				dispose: () => {
					if (unpipeStderr) {
						unpipeStderr();
						child.stderr?.destroy();
					}
					stdoutRelay.clear();
					stderrRelay.clear();
					events.clear();
				}
			},
			ready
		};
	} catch (_) {
		_usingCtx$2.e = _;
	} finally {
		_usingCtx$2.d();
	}
}
//#endregion
//#region src/process/supervisor/adapters/child.ts
const FORCE_KILL_WAIT_FALLBACK_MS = 4e3;
const FORCED_WINDOWS_CLOSE_SETTLE_MS = 250;
const WINDOWS_PACKAGE_MANAGER_SHIMS = [
	"npm",
	"pnpm",
	"yarn",
	"npx"
];
function resolveChildInvocation(params) {
	const command = params.argv[0] ?? "";
	const candidate = resolveWindowsSpawnProgramCandidate({
		command,
		env: params.env,
		execPath: process.platform === "win32" ? resolveWindowsExecutablePath("node", params.env ?? process.env) : void 0
	});
	const args = [...candidate.leadingArgv, ...params.argv.slice(1)];
	const resolvedCommand = candidate.resolution === "direct" && candidate.command === command ? resolveWindowsCommandShim({
		command,
		cmdCommands: WINDOWS_PACKAGE_MANAGER_SHIMS
	}) : candidate.command;
	if (!isWindowsBatchCommand(resolvedCommand)) return {
		command: resolvedCommand,
		args,
		windowsVerbatimArguments: params.windowsVerbatimArguments
	};
	return {
		command: resolveTrustedWindowsCmdExe(),
		args: [
			"/d",
			"/s",
			"/c",
			buildWindowsCmdExeCommandLine(resolvedCommand, args)
		],
		windowsVerbatimArguments: true
	};
}
const WORKER_START_MESSAGE = { type: "openclaw-worker-start-v1" };
async function createChildAdapter(params) {
	try {
		var _usingCtx$1 = _usingCtx();
		if (params.anchoredShellCommand !== void 0) return await createServiceChildRelayAdapter({
			assertCurrent: params.assertCurrent,
			beforeSpawn: params.beforeSpawn,
			initiateSpawn: params.initiateSpawn,
			command: process.platform === "win32" ? params.anchoredShellCommand : "/bin/sh",
			args: process.platform === "win32" ? [] : ["-c", params.anchoredShellCommand],
			windowsShellCommand: process.platform === "win32" ? params.anchoredShellCommand : void 0,
			cwd: params.cwd,
			env: params.env,
			stdinMode: "pipe-closed",
			oomScoreWrapperSelected: false,
			abortSignal: params.abortSignal,
			onSpawnCleanup: params.onSpawnCleanup,
			stderrDestination: params.stderrDestination
		});
		const baseEnv = params.env ? toStringEnv(params.env) : void 0;
		const windowsShell = process.platform === "win32" && params.windowsShell === true;
		const invocation = windowsShell ? {
			command: params.argv[0],
			args: params.argv.slice(1),
			windowsVerbatimArguments: params.windowsVerbatimArguments
		} : resolveChildInvocation({
			argv: params.argv,
			env: baseEnv,
			windowsVerbatimArguments: params.windowsVerbatimArguments
		});
		const argv0 = invocation.command === params.argv[0] ? params.argv0 : void 0;
		const preparedSpawn = params.exactEnv ? {
			command: invocation.command,
			args: invocation.args,
			argv0,
			env: baseEnv,
			wrapped: false
		} : prepareOomScoreAdjustedSpawn(invocation.command, invocation.args, {
			env: baseEnv,
			argv0
		});
		const stdinMode = params.stdinMode ?? (params.input !== void 0 ? "pipe-closed" : "inherit");
		if (process.platform !== "win32" && params.ownedWorker === void 0 && (params.ownProcessTree === true || process.env.OPENCLAW_SERVICE_MARKER?.trim())) return await createServiceChildRelayAdapter({
			assertCurrent: params.assertCurrent,
			beforeSpawn: params.beforeSpawn,
			initiateSpawn: params.initiateSpawn,
			command: preparedSpawn.command,
			args: preparedSpawn.args,
			argv0: preparedSpawn.argv0,
			cwd: params.cwd,
			env: preparedSpawn.env,
			stdinMode,
			input: params.input,
			prepareInput: params.prepareInput,
			secretInput: params.secretInput,
			oomScoreWrapperSelected: preparedSpawn.wrapped,
			abortSignal: params.abortSignal,
			onSpawnCleanup: params.onSpawnCleanup,
			stderrDestination: params.stderrDestination,
			stdoutConsumption: params.stdoutConsumption,
			terminateOnHostLoss: params.terminateOnHostLoss
		});
		const useDetached = process.platform !== "win32";
		const stdio = [
			stdinMode === "inherit" ? "inherit" : "pipe",
			"pipe",
			"pipe"
		];
		const secretDelivery = _usingCtx$1.u(prepareSecretInputStdio(stdio, params.secretInput));
		if (params.ownedWorker !== void 0) stdio.push("ipc");
		const options = {
			cwd: params.cwd,
			env: preparedSpawn.env,
			argv0: preparedSpawn.argv0,
			stdio,
			detached: useDetached,
			windowsHide: true,
			windowsVerbatimArguments: invocation.windowsVerbatimArguments,
			...windowsShell ? { shell: true } : {}
		};
		const assertCurrent = () => {
			params.assertCurrent?.();
			if (params.abortSignal?.aborted) throw new Error("child construction aborted");
		};
		let windowsJob;
		let windowsCleanup;
		const launchGate = createDeferredCore();
		let windowsFallback = {
			status: "uncertain",
			reason: "job-unavailable"
		};
		let tryWindowsJob = true;
		const spawnChild = () => spawnWithFallback({
			...process.platform === "win32" ? { spawnImpl: (command, args, spawnOptions, initiateSpawn) => {
				const launchNative = () => spawn(command, args, spawnOptions);
				if (!tryWindowsJob) return initiateSpawn ? initiateSpawn(launchNative) : launchNative();
				const owned = spawnWindowsJobChild(command, args, {
					...spawnOptions,
					signal: params.abortSignal
				}, async (launch) => {
					await launchGate.promise;
					assertCurrent();
					params.beforeSpawn?.();
					if (initiateSpawn) {
						const settlement = windowsJob?.ready.catch(async () => {
							if ((await windowsJob?.certify())?.status !== "confirmed") throw new Error("Windows Job launch retirement is unconfirmed");
						});
						settlement?.catch(() => {});
						initiateSpawn(launch, settlement);
					} else launch();
				});
				if (!owned) return initiateSpawn ? initiateSpawn(launchNative) : launchNative();
				windowsJob = owned.job;
				windowsCleanup = owned.job.certify();
				windowsCleanup.catch(() => {});
				params.onSpawnCleanup?.(windowsCleanup);
				return owned.child;
			} } : {},
			assertCurrent: () => {
				assertCurrent();
				params.beforeSpawn?.();
			},
			initiateSpawn: params.initiateSpawn,
			argv: [preparedSpawn.command, ...preparedSpawn.args],
			options,
			fallbacks: useDetached && params.ownedWorker === void 0 ? [{ detached: false }] : []
		});
		let spawned;
		try {
			spawned = await spawnChild();
			if (windowsJob) await windowsJob.admission;
		} catch (error) {
			if (!(error instanceof WindowsJobSetupError)) throw error;
			await windowsJob?.certify();
			windowsFallback = {
				status: "uncertain",
				reason: error.reason,
				cause: error.cause
			};
			windowsJob = void 0;
			windowsCleanup = void 0;
			tryWindowsJob = false;
			spawned = await spawnChild();
		}
		const child = spawned.child;
		const events = createProcessAdapterEvents();
		if (params.onWorkerMessage) child.on("message", (message) => {
			try {
				if (!windowsJob?.isControlMessage(message)) params.onWorkerMessage?.(message);
			} catch {}
		});
		const disconnectWorkerIpc = () => {
			if (!child.connected) return;
			try {
				child.disconnect();
			} catch (error) {
				if (error.code !== "ERR_IPC_DISCONNECTED") throw error;
			}
		};
		child.stdout.on("error", (error) => events.emitError(error, "stdout"));
		child.stderr.on("error", (error) => events.emitError(error, "stderr"));
		child.stdin?.on("error", (error) => events.emitError(error, "stdin"));
		const childStdin = spawned.child.stdin;
		const stdin = createManagedChildStdin(childStdin);
		const outputUnsubscribers = [];
		const stdoutRelay = createOutputRelay(child.stdout, false, params.stdoutConsumption === "awaited" ? () => {
			if (!hardKillRequested) kill("SIGKILL");
		} : void 0);
		if (params.stderrDestination) outputUnsubscribers.push(pipeProcessOutput(child.stderr, params.stderrDestination, (error) => events.emitError(error, "stderr")));
		const completion = createDeferredCore();
		const cleanup = createDeferredCore();
		completion.promise.catch(() => {});
		let waitSettled = false;
		let processClosed = false;
		let forceKillWaitFallbackTimer = null;
		let forcedWindowsCloseTimer = null;
		let hardKillRequested = false;
		let treeSignaling;
		const cleanupOutcome = Promise.allSettled([cleanup.promise]).then((outcomes) => {
			clearForceKillWaitFallback();
			return outcomes;
		});
		let windowsTreeKillCompleted = false;
		let childExitState = null;
		let childCloseState = null;
		const pendingOutput = new Set([child.stdout, child.stderr].filter((stream) => stream != null));
		let workerIpcDisconnected = false;
		let openWorkerStdio = 0;
		const clearForceKillWaitFallback = () => {
			if (!forceKillWaitFallbackTimer) return;
			clearTimeout(forceKillWaitFallbackTimer);
			forceKillWaitFallbackTimer = null;
		};
		const clearForcedWindowsCloseTimer = () => {
			if (!forcedWindowsCloseTimer) return;
			clearTimeout(forcedWindowsCloseTimer);
			forcedWindowsCloseTimer = null;
		};
		const settleWait = (value) => {
			if (waitSettled) return;
			waitSettled = true;
			clearForcedWindowsCloseTimer();
			completion.resolve(value);
		};
		const settleObservedClose = (value) => {
			processClosed = true;
			if (treeSignaling) treeSignaling = treeSignaling.then(() => cleanup.resolve(), cleanup.reject);
			else cleanup.resolve();
			settleWait(value);
		};
		const rejectPendingWait = (error) => {
			if (waitSettled) return;
			waitSettled = true;
			clearForcedWindowsCloseTimer();
			completion.reject(error);
		};
		const scheduleForceKillWaitFallback = (signal) => {
			if (forceKillWaitFallbackTimer || waitSettled) return;
			forceKillWaitFallbackTimer = setTimeout(() => {
				cleanup.reject(/* @__PURE__ */ new Error("child cleanup could not be confirmed before the kill deadline"));
				if (stdoutRelay.consume) stdoutRelay.clear();
				settleWait({
					code: null,
					signal
				});
			}, FORCE_KILL_WAIT_FALLBACK_MS);
			forceKillWaitFallbackTimer.unref?.();
		};
		const scheduleForcedWindowsCloseSettlement = () => {
			if (process.platform !== "win32" || !hardKillRequested || !windowsTreeKillCompleted || childExitState == null || forcedWindowsCloseTimer) return;
			const exitState = childExitState;
			forcedWindowsCloseTimer = setTimeout(() => {
				child.stdout?.destroy();
				child.stderr?.destroy();
				settleWait(childExitState ?? exitState);
			}, FORCED_WINDOWS_CLOSE_SETTLE_MS);
			forcedWindowsCloseTimer.unref?.();
		};
		const isWindowsHardKillSettlementBlocked = () => process.platform === "win32" && hardKillRequested && !windowsTreeKillCompleted;
		const maybeSettleAfterExit = () => {
			if (process.platform !== "win32" && (!workerIpcDisconnected || openWorkerStdio > 0) || isWindowsHardKillSettlementBlocked() || childExitState == null || pendingOutput.size > 0) return;
			settleObservedClose(childExitState);
		};
		if (params.ownedWorker) {
			child.once("disconnect", () => {
				workerIpcDisconnected = true;
				maybeSettleAfterExit();
			});
			for (const stream of child.stdio.slice(1)) {
				if (!stream || stream.closed) continue;
				openWorkerStdio += 1;
				stream.once("close", () => {
					openWorkerStdio -= 1;
					maybeSettleAfterExit();
				});
			}
		}
		for (const stream of pendingOutput) {
			const markDrained = () => {
				pendingOutput.delete(stream);
				maybeSettleAfterExit();
			};
			stream.once("end", markDrained);
			stream.once("close", markDrained);
		}
		child.on("error", (error) => {
			events.emitError(error, "process");
			if (params.ownedWorker || error instanceof SpawnBrokerError) rejectPendingWait(error);
		});
		child.once("exit", (code, signal) => {
			childExitState = {
				code,
				signal
			};
			events.emitExit(code, signal);
			scheduleForcedWindowsCloseSettlement();
			maybeSettleAfterExit();
		});
		child.once("close", (code, signal) => {
			childCloseState = {
				code,
				signal
			};
			childExitState ??= childCloseState;
			if (isWindowsHardKillSettlementBlocked()) return;
			settleObservedClose(childExitState);
		});
		const childIsDetached = useDetached && !spawned.usedFallback;
		const attachedLinuxFallback = process.platform === "linux" && !childIsDetached;
		let attachedTerminationStarted = false;
		let attachedTermination;
		const scheduleAdoptedReapForChild = () => {
			scheduleAdoptedChildZombieReapAfterExit(child, childIsDetached);
		};
		const signalProcessTreeForChild = (pid, signal) => {
			if (attachedLinuxFallback) {
				if (attachedTerminationStarted) {
					if (signal === "SIGKILL") attachedTermination?.force();
				} else if (!childExitState) {
					attachedTerminationStarted = true;
					attachedTermination = killProcessTree(pid, {
						detached: false,
						graceMs: GRACEFUL_CANCEL_TIMEOUT_MS,
						force: signal === "SIGKILL"
					});
				}
				return;
			}
			signalProcessTree(pid, signal, { detached: childIsDetached });
			scheduleAdoptedReapForChild();
		};
		const signalProcessTreeForChildAndWait = (pid, signal) => new Promise((resolve) => {
			if (attachedLinuxFallback) {
				signalProcessTreeForChild(pid, signal);
				resolve();
				return;
			}
			signalProcessTree(pid, signal, {
				detached: childIsDetached,
				onComplete: () => {
					scheduleAdoptedReapForChild();
					resolve();
				}
			});
		});
		const signalChild = (signal) => {
			try {
				child.kill(signal);
			} catch {}
		};
		const kill = (signal) => {
			if (windowsJob) {
				try {
					windowsJob.stop();
				} catch (error) {
					cleanup.reject(error);
					rejectPendingWait(error);
				}
				scheduleForceKillWaitFallback(signal ?? "SIGKILL");
				return;
			}
			if (processClosed) {
				if (signal === void 0 || signal === "SIGKILL") attachedTermination?.force();
				return;
			}
			const pid = child.pid ?? void 0;
			if (signal === void 0 || signal === "SIGKILL") {
				hardKillRequested = true;
				scheduleForcedWindowsCloseSettlement();
				if (pid) {
					const previousSignal = treeSignaling;
					treeSignaling = (async () => {
						try {
							await signalProcessTreeForChildAndWait(pid, "SIGKILL");
							signalChild("SIGKILL");
							windowsTreeKillCompleted = true;
							if (childCloseState) {
								settleObservedClose(childExitState ?? childCloseState);
								return;
							}
							maybeSettleAfterExit();
							scheduleForcedWindowsCloseSettlement();
						} catch (error) {
							cleanup.reject(error);
							rejectPendingWait(error);
						} finally {
							await previousSignal;
						}
					})();
				} else {
					windowsTreeKillCompleted = true;
					signalChild("SIGKILL");
				}
				scheduleForceKillWaitFallback("SIGKILL");
				return;
			}
			if (signal === "SIGTERM" && pid) {
				signalProcessTreeForChild(pid, "SIGTERM");
				return;
			}
			signalChild(signal);
		};
		const dispose = () => {
			stdoutRelay.clear();
			clearForcedWindowsCloseTimer();
			if (params.ownedWorker !== void 0) disconnectWorkerIpc();
			for (const unsubscribe of outputUnsubscribers.splice(0)) unsubscribe();
			child.stdout.destroy();
			child.stderr.destroy();
			if (!windowsJob) child.removeAllListeners();
			events.clear();
		};
		let startGateOpened = false;
		const adapter = {
			get pid() {
				return windowsJob?.commandPid ?? child.pid;
			},
			stdin,
			oomScoreWrapperSelected: preparedSpawn.wrapped,
			supportsRawOutput: true,
			onStdout: stdoutRelay.subscribe,
			...stdoutRelay.consume ? { consumeStdout: stdoutRelay.consume } : {},
			onStderr: (listener, onRaw) => {
				outputUnsubscribers.push(onDecodedOutput(child.stderr, listener, onRaw));
			},
			onExit: events.onExit,
			onError: events.onError,
			wait: async () => {
				const output = stdoutRelay.drain();
				return output ? await joinProcessCompletionAndOutput(completion.promise, output) : await completion.promise;
			},
			...process.platform === "win32" && { waitForExtinction: () => windowsCleanup ?? cleanup.promise.then(() => windowsFallback) },
			kill,
			dispose,
			closeStartGate: params.ownedWorker ? disconnectWorkerIpc : void 0,
			openStartGate: params.ownedWorker ? async () => {
				if (startGateOpened) return;
				startGateOpened = true;
				await new Promise((resolve, reject) => {
					if (!child.connected) {
						reject(/* @__PURE__ */ new Error("worker lifecycle IPC channel closed before startup"));
						return;
					}
					try {
						child.send(WORKER_START_MESSAGE, (error) => {
							if (error) {
								reject(error);
								return;
							}
							resolve();
						});
					} catch (error) {
						reject(toErrorObject(error, "worker lifecycle IPC send failed"));
					}
				});
			} : void 0
		};
		if (!windowsCleanup) params.onSpawnCleanup?.(adapter.waitForExtinction?.() ?? cleanup.promise);
		launchGate.resolve();
		const ready = (async () => {
			try {
				if (windowsJob) await windowsJob.ready;
				assertCurrent();
				if (params.ownedWorker !== void 0 && (!child.connected || !child.channel)) throw new Error("worker lifecycle IPC channel was not created");
				if (params.input !== void 0) {
					if (params.prepareInput) {
						await params.prepareInput();
						assertCurrent();
					}
					childStdin?.write(params.input);
					stdin?.end();
				} else if (stdinMode === "pipe-closed") stdin?.end();
				if (params.secretInput) {
					assertCurrent();
					await secretDelivery?.deliverTo(child, { abortSignal: params.abortSignal });
				}
			} catch (error) {
				kill("SIGKILL");
				try {
					const [outcome] = await cleanupOutcome;
					if (outcome.status === "rejected") throw outcome.reason;
				} finally {
					dispose();
				}
				throw error;
			}
		})();
		ready.catch(() => {});
		return {
			adapter,
			ready
		};
	} catch (_) {
		_usingCtx$1.e = _;
	} finally {
		_usingCtx$1.d();
	}
}
//#endregion
export { createBoundedLineFramer as a, prepareSecretInputStdio as c, bindInheritedProcessLineageFds as i, createServiceChildRelayAdapter as n, toStringEnv as o, bindInheritedNativeProcessOwner as r, supportsNodeWorkerProcessOwner as s, createChildAdapter as t };
