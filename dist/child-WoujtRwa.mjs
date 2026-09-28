import { i as extractErrorCode, u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { r as signalProcessTree, t as killProcessTree } from "./kill-tree-BGQdx374.mjs";
import "./errors-DnjwnOju.mjs";
import { t as resolveRuntimeWorkerArgv } from "./runtime-worker-url-B4o9tqvO.mjs";
import { a as SpawnBrokerError, t as BrokerChild } from "./child-C7738Y0I.mjs";
import { t as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-q9v1M311.mjs";
import { t as scheduleAdoptedChildZombieReapAfterExit } from "./scoped-child-reaper-GgqPcup9.mjs";
import { t as _usingCtx } from "./usingCtx-CoYZqMqE.mjs";
import { t as GRACEFUL_CANCEL_TIMEOUT_MS } from "./cancellation-policy-BQ2STJu_.mjs";
import { i as spawnWithFallback, r as spawnProcess } from "./spawn-utils-BqNqLiIK.mjs";
import { a as resolveWindowsCommandShim, i as resolveTrustedWindowsCmdExe, n as isWindowsBatchCommand, t as buildWindowsCmdExeCommandLine } from "./windows-command-C3zotBKl.mjs";
import { n as spawnWindowsJobChild, t as WindowsJobSetupError } from "./managed-windows-job-BiNqdhxc.mjs";
import { i as resolveWindowsExecutablePath, o as resolveWindowsSpawnProgramCandidate } from "./windows-spawn-CR3vyrK9.mjs";
import { n as joinProcessCompletionAndOutput, r as onDecodedOutput, t as createAwaitedDecodedOutput } from "./decoded-output-CqBjhNN5.mjs";
import { t as prepareOomScoreAdjustedSpawn } from "./linux-oom-score-YCP0ajt5.mjs";
import { t as prepareSecretInputStdio } from "./spawn-secret-input-C34dSJDo.mjs";
import { n as isOwnedProcessGroupGone } from "./service-child-group-ownership-Qp-X4dOa.mjs";
import { n as supportsNodeWorkerProcessOwner, t as encodeServiceChildMessage } from "./service-child-protocol-BASUIVtb.mjs";
import { t as reserveStdioEntry } from "./service-child-stdio-Di1Z5Fp4.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { spawn } from "node:child_process";
import { StringDecoder } from "node:string_decoder";
import { setTimeout as setTimeout$1 } from "node:timers/promises";
import { randomUUID } from "node:crypto";
import { performance } from "node:perf_hooks";
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
//#region src/process/spawn-broker/relay-integration.ts
/** Publish cleanup ownership before waiting for the broker's pipe and IPC handoff. */
function spawnServiceChildRelay(params) {
	const child = spawnProcess(process.execPath, resolveRuntimeWorkerArgv(params.workerUrl), {
		stdio: params.stdio,
		detached: params.detached,
		windowsHide: true,
		env: params.env
	});
	const cleanup = createServiceChildCleanup();
	params.onSpawnCleanup?.(cleanup.promise);
	let transportReady;
	if (child instanceof BrokerChild) transportReady = child.ready().catch((error) => {
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
function createManagedChildStdin(stream) {
	if (!stream) return;
	let ended = stream.writableEnded || stream.writableFinished;
	let destroyed = stream.destroyed;
	stream.once("finish", () => {
		ended = true;
	});
	stream.once("close", () => {
		ended = true;
		destroyed = true;
	});
	stream.once("error", () => {
		destroyed = true;
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
				callback?.(/* @__PURE__ */ new Error("stdin is not writable"));
				return;
			}
			try {
				stream.write(data, callback);
			} catch (error) {
				callback?.(error instanceof Error ? error : new Error(String(error)));
			}
		},
		end() {
			ended = true;
			try {
				stream.end();
			} catch {}
		},
		destroy() {
			ended = true;
			destroyed = true;
			try {
				stream.destroy();
			} catch {}
		}
	};
}
//#endregion
//#region src/process/supervisor/adapters/env.ts
/** Convert Node's optional env values into the concrete string map spawn adapters expect. */
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
//#region src/process/supervisor/cleanup-budget.ts
const cleanupBudget = new AsyncLocalStorage();
function getProcessCleanupBudget() {
	return cleanupBudget.getStore();
}
function runWithProcessCleanupBudget(budget, run) {
	return budget ? cleanupBudget.run(budget, run) : run();
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
//#region src/process/supervisor/service-child-control-reader.ts
const CONTROL_PENDING_LINE_LIMIT_BYTES = 262144;
function readServiceChildControl(control, onLine, onOverflow) {
	let pending = "";
	let pendingBytes = 0;
	let decoder = new StringDecoder("utf8");
	const reset = () => {
		pending = "";
		pendingBytes = 0;
		decoder = new StringDecoder("utf8");
	};
	control.on("data", (chunk) => {
		let offset = 0;
		for (;;) {
			const searchLength = CONTROL_PENDING_LINE_LIMIT_BYTES - pendingBytes + 1;
			const boundedChunk = chunk.subarray(offset, offset + searchLength);
			const newline = boundedChunk.indexOf(10);
			if (newline < 0) {
				if (boundedChunk.length === searchLength) {
					onOverflow();
					reset();
				} else {
					pending += decoder.write(boundedChunk);
					pendingBytes += boundedChunk.length;
				}
				return;
			}
			const line = pending + decoder.end(boundedChunk.subarray(0, newline));
			reset();
			onLine(line);
			offset += newline + 1;
		}
	});
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
		if (!piped && !consumer) onDecodedOutput(stream, push, push);
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
			consumer?.close();
			listeners.clear();
			rawListeners.clear();
			pending.length = 0;
			pendingBytes = 0;
		}
	};
}
//#endregion
//#region src/process/supervisor/inherited-process-lineage.ts
let currentFds;
function getInheritedProcessLineageFds() {
	return currentFds ?? [];
}
function bindInheritedProcessLineageFds(fds) {
	currentFds = fds;
	return () => {
		if (currentFds === fds) currentFds = void 0;
	};
}
//#endregion
//#region src/process/supervisor/service-child-relay-preparation.ts
/** Prepare transport facts; the host revalidates authority immediately before spawning. */
function prepareServiceChildRelay(params) {
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
			controlFd,
			lineageFd,
			ownership: params.ownedWorker ? {
				ownedWorker: true,
				cleanupBinding: params.cleanupBinding,
				parentLineageFds: [lineageFd, ...parentLineageFds]
			} : {
				lineageFd,
				parentLineageFds
			},
			spawn: {
				workerUrl: resolveRuntimeProcessEntrypointUrl(useWindowsJobAnchor ? "serviceChildWindowsJobAnchor" : "serviceChildRelay"),
				env: params.ownedWorker ? params.env : process.env,
				detached: useWindowsJobAnchor || params.ownedWorker === true || parentLineageFds.length > 0,
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
/** The relay reaps its anchor before the host releases the retained relay handle. */
function createServiceChildRelayRetirement(params) {
	let requested = false;
	let sequence;
	let signaledAt;
	let signalError;
	let anchorExited = false;
	let relaySignaled = false;
	let exit;
	const recordError = (error) => {
		const failure = toErrorObject(error, "service child retirement signal failed");
		signalError = signalError ? new AggregateError([signalError, failure], "service child retirement signals failed") : failure;
	};
	const reconcile = () => {
		if (!requested || exit || !params.canRetire()) return;
		anchorExited ||= params.anchorGone();
		signaledAt ??= performance.now();
		if (anchorExited) {
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
		receive: (message) => {
			if (sequence === void 0 || message.generation !== params.generation || message.sequence !== sequence) return;
			if (message.signalError) recordError(new Error(message.signalError));
			anchorExited ||= message.anchorExited;
			reconcile();
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
//#endregion
//#region src/process/supervisor/service-child-relay-host.ts
function readChildMessage(raw) {
	return raw;
}
async function createServiceChildRelayAdapter(params) {
	try {
		var _usingCtx$2 = _usingCtx();
		const generation = randomUUID();
		const preparation = _usingCtx$2.u(prepareServiceChildRelay(params));
		const { useWindowsJobAnchor, controlFd, lineageFd } = preparation;
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
			child.kill("SIGKILL");
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
		child.stdin?.on("error", (error) => events.emitError(error, "stdin"));
		let state = "starting";
		let commandPid;
		let anchorPid;
		let outboundSequence = 0;
		let inboundSequence = 0;
		let rootResult;
		let resultError;
		let closingReceipt = false;
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
			const pending = {
				closingReceipt: !closingReceipt,
				controlClose: !control?.closed,
				relayExit: !childExited,
				lineageEof: !lineage?.readableEnded,
				extinctionUnconfirmed: state !== "closed",
				stdoutEnd: !stdoutRelay.ended,
				stderrEnd: !stderrRelay.ended
			};
			const message = "service child cleanup did not complete before its hard deadline; pending: " + JSON.stringify(pending);
			const error = new Error(message, { cause: retirement.diagnostics() });
			resultError ??= error;
			startup.reject(error);
			resultCompletion.reject(error);
			cleanup.completion.reject(error);
			try {
				loseIdentity(message);
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
		const sendChildMessage = (message) => new Promise((resolve, reject) => {
			if (!child.connected) {
				reject(/* @__PURE__ */ new Error("service child lifecycle IPC is closed"));
				return;
			}
			child.send(message, (error) => error ? reject(error) : resolve());
		});
		const sendControlMessage = (message) => {
			if (useWindowsJobAnchor) return sendChildMessage(message);
			return new Promise((resolve, reject) => {
				if (!control || control.destroyed) {
					reject(/* @__PURE__ */ new Error("service child control pipe is closed"));
					return;
				}
				control.write(encodeServiceChildMessage(message), "utf8", (error) => {
					if (error) reject(error);
					else resolve();
				});
			});
		};
		const retirement = createServiceChildRelayRetirement({
			child,
			generation,
			nextSequence: () => ++outboundSequence,
			startedAt: () => cleanupDeadline.startedAt,
			anchorGone: () => {
				if (anchorPid === void 0) return false;
				try {
					process.kill(-anchorPid, 0);
					return false;
				} catch (error) {
					return extractErrorCode(error) === "ESRCH";
				}
			},
			canRetire: () => state === "closing" && control?.closed === true && lineage?.readableEnded === true && stdoutRelay.ended && stderrRelay.ended && performance.now() < cleanupDeadline.at
		});
		lineage?.once("end", () => {
			lineageEnd.resolve();
			retirement.reconcile();
			if (state !== "starting" && state !== "active") return;
			sendControlMessage({
				type: "lineage-closed",
				generation,
				sequence: ++outboundSequence
			}).catch((error) => {
				if (state === "starting" || state === "active") loseIdentity(toErrorObject(error, "lineage notification failed").message);
			});
		});
		lineage?.once("error", (error) => loseIdentity("lineage observation failed", { cause: error }));
		lineage?.once("close", () => {
			if (!lineage.readableEnded) loseIdentity("lineage reader closed before EOF");
		});
		lineage?.resume();
		const onConstructionAbort = () => {
			child.kill("SIGKILL");
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
			if (!rootResult && !resultError && !waitError) rootResult = {
				code: null,
				signal: requestedSignal ?? null
			};
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
			cleanupDeadline.begin();
			if (!lineage?.readableEnded) await Promise.race([lineageEnd.promise, cleanup.completion.promise]);
			if (state !== "closing") return;
			for (;;) {
				retirement.reconcile();
				if (childExited) try {
					process.kill(-anchorPid, 0);
				} catch (cause) {
					const code = extractErrorCode(cause);
					if (code === "ESRCH") {
						finishAuthorityClose(missingReceiptError);
						return;
					}
					if (code !== "EPERM") {
						loseIdentity("owned process group disappearance could not be confirmed", { cause });
						return;
					}
				}
				const remainingMs = cleanupDeadline.at - performance.now();
				if (remainingMs <= 0 && childExited) {
					expireCleanup();
					return;
				}
				await Promise.race([
					...remainingMs > 0 ? [setTimeout$1(Math.min(100, remainingMs))] : [],
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
			if (message.type === "ready" && state === "starting") {
				commandPid = message.commandPid;
				anchorPid = message.anchorPid;
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
				closingReceipt = true;
				state = "closing";
				cleanupDeadline.begin();
				retirement.reconcile();
				if (control) {
					outboundSequence += 1;
					sendControlMessage({
						type: "closing-ack",
						generation,
						sequence: outboundSequence,
						closingSequence: message.sequence
					}).catch((error) => {
						controlError ??= toErrorObject(error, "closing acknowledgement failed");
					});
				}
			} else if (message.type === "startup-error") {
				if (useWindowsJobAnchor) startup.reject(new Error(message.error));
				else loseIdentity(message.error);
				outboundSequence += 1;
				startupErrorAckDelivery = sendControlMessage({
					type: "startup-error-ack",
					generation,
					sequence: outboundSequence
				});
				startupErrorAckDelivery.catch((error) => loseIdentity(toErrorObject(error, "startup error acknowledgement failed").message));
			}
		};
		if (control) {
			readServiceChildControl(control, (line) => {
				try {
					const message = readChildMessage(JSON.parse(line));
					if (!("sequence" in message) || message.type === "retirement") throw new Error("invalid anchor message");
					handleAnchorMessage(message);
				} catch {
					loseIdentity("invalid anchor message");
				}
			}, () => {
				loseIdentity("control pipe pending line exceeded cap");
				child.kill("SIGKILL");
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
			const message = readChildMessage(raw);
			if (!message || typeof message !== "object") {
				if (useWindowsJobAnchor) loseIdentity("invalid anchor message");
				return;
			}
			if (useWindowsJobAnchor) {
				if (!("sequence" in message) || message.type === "retirement") {
					loseIdentity("invalid anchor message");
					return;
				}
				handleAnchorMessage(message);
				return;
			}
			if (message.generation !== generation) return;
			if (message.type === "relay-error") loseIdentity(message.error);
			else if (message.type === "retirement") retirement.receive(message);
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
			type: "start",
			generation,
			command: params.command,
			args: params.args,
			argv0: params.argv0,
			cwd: params.cwd,
			env: params.env ? toStringEnv(params.env) : void 0,
			stdinMode: params.stdinMode,
			secretFd: params.secretInput?.fd,
			controlFd,
			...preparation.ownership,
			...control ? { acknowledgeClosing: true } : {},
			windowsShellCommand: params.windowsShellCommand
		};
		const stdin = createManagedChildStdin(child.stdin);
		params.abortSignal?.addEventListener("abort", onConstructionAbort, { once: true });
		const ready = (async () => {
			try {
				var _usingCtx3 = _usingCtx();
				const delivery = _usingCtx3.u(preparation.transferSecretInput());
				try {
					params.assertCurrent?.();
					if (params.abortSignal?.aborted) onConstructionAbort();
					params.beforeSpawn?.();
					await Promise.race([sendChildMessage(start), constructionAbort.promise]);
					params.assertCurrent?.();
					const [startupResult, secretDeliveryResult] = await Promise.allSettled([startup.promise, delivery?.deliverTo(child, { abortSignal: params.abortSignal })]);
					const startupError = startupResult.status === "rejected" ? startupResult.reason : void 0;
					const secretDeliveryError = secretDeliveryResult.status === "rejected" ? secretDeliveryResult.reason : void 0;
					if (startupError !== void 0 || secretDeliveryError !== void 0) {
						if (useWindowsJobAnchor && startupError !== void 0) {
							await startupErrorAckDelivery;
							await cleanup.completion.promise;
						}
						throw startupError ?? secretDeliveryError;
					}
					if (params.abortSignal?.aborted || waitError) throw waitError ?? /* @__PURE__ */ new Error("service child construction aborted");
					params.assertCurrent?.();
					if (params.input !== void 0) {
						stdin?.write(params.input);
						stdin?.end();
					} else if (params.stdinMode === "pipe-closed") stdin?.end();
				} catch (error) {
					stdoutRelay.drain();
					unpipeStderr?.();
					stderrRelay.drain();
					child.kill("SIGKILL");
					throw error;
				} finally {
					removeConstructionAbortListener();
				}
			} catch (_) {
				_usingCtx3.e = _;
			} finally {
				_usingCtx3.d();
			}
		})();
		ready.catch(() => {});
		function kill(signal = "SIGKILL") {
			const normalized = signal === "SIGTERM" ? "SIGTERM" : "SIGKILL";
			cleanupDeadline.cancel(normalized);
			if (normalized === "SIGKILL") retirement.request();
			if (state !== "active") return;
			requestedSignal = normalized;
			outboundSequence += 1;
			sendControlMessage({
				type: "cancel",
				generation,
				sequence: outboundSequence,
				signal: normalized
			}).catch((error) => {
				if (state === "active") loseIdentity(toErrorObject(error, "service child cancellation failed").message);
			});
		}
		let startGate;
		let startGateClosed = false;
		const openStartGate = params.ownedWorker ? () => {
			if (startGateClosed || state !== "active" || requestedSignal) return Promise.reject(/* @__PURE__ */ new Error("worker lifecycle closed before startup"));
			return startGate ??= sendControlMessage({
				type: "worker-start",
				generation,
				sequence: ++outboundSequence
			});
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
				waitForExtinction: () => cleanup.promise,
				confirmExtinction: () => state === "closed" || Boolean(!useWindowsJobAnchor && anchorPid && childExited && lineage?.readableEnded && stdoutRelay.ended && stderrRelay.ended && isOwnedProcessGroupGone(anchorPid)),
				get cleanupResult() {
					return state === "closed" ? retirement.result : void 0;
				},
				kill,
				openStartGate,
				closeStartGate: params.ownedWorker ? () => {
					startGateClosed = true;
					sendControlMessage({
						type: "worker-close",
						generation,
						sequence: ++outboundSequence
					}).catch((error) => {
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
			command: preparedSpawn.command,
			args: preparedSpawn.args,
			argv0: preparedSpawn.argv0,
			cwd: params.cwd,
			env: preparedSpawn.env,
			stdinMode,
			input: params.input,
			secretInput: params.secretInput,
			oomScoreWrapperSelected: preparedSpawn.wrapped,
			abortSignal: params.abortSignal,
			onSpawnCleanup: params.onSpawnCleanup,
			stderrDestination: params.stderrDestination,
			stdoutConsumption: params.stdoutConsumption
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
			...process.platform === "win32" ? { spawnImpl: (command, args, spawnOptions) => {
				if (!tryWindowsJob) return spawn(command, args, spawnOptions);
				const owned = spawnWindowsJobChild(command, args, {
					...spawnOptions,
					signal: params.abortSignal
				}, async (launch) => {
					await launchGate.promise;
					assertCurrent();
					params.beforeSpawn?.();
					launch();
				});
				if (!owned) return spawn(command, args, spawnOptions);
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
		const awaitedStdout = params.stdoutConsumption === "awaited" ? createAwaitedDecodedOutput(child.stdout, () => {
			if (!hardKillRequested) kill("SIGKILL");
		}) : void 0;
		if (params.stderrDestination) outputUnsubscribers.push(pipeProcessOutput(child.stderr, params.stderrDestination, (error) => events.emitError(error, "stderr")));
		const onStdout = (listener, onRaw) => {
			if (awaitedStdout) throw new Error("Process stdout requires its awaited consumer");
			outputUnsubscribers.push(onDecodedOutput(child.stdout, listener, onRaw));
		};
		const onStderr = (listener, onRaw) => {
			outputUnsubscribers.push(onDecodedOutput(child.stderr, listener, onRaw));
		};
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
		let stdoutDrained = child.stdout == null;
		let stderrDrained = child.stderr == null;
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
				awaitedStdout?.close();
				settleWait({
					code: null,
					signal
				});
			}, FORCE_KILL_WAIT_FALLBACK_MS);
			forceKillWaitFallbackTimer.unref?.();
		};
		const resolveObservedExitState = (fallback) => {
			if (childExitState != null) return childExitState;
			return {
				code: child.exitCode ?? fallback.code,
				signal: child.signalCode ?? fallback.signal
			};
		};
		const scheduleForcedWindowsCloseSettlement = () => {
			if (process.platform !== "win32" || !hardKillRequested || !windowsTreeKillCompleted || childExitState == null || forcedWindowsCloseTimer) return;
			const exitState = childExitState;
			forcedWindowsCloseTimer = setTimeout(() => {
				child.stdout?.destroy();
				child.stderr?.destroy();
				settleWait(resolveObservedExitState(exitState));
			}, FORCED_WINDOWS_CLOSE_SETTLE_MS);
			forcedWindowsCloseTimer.unref?.();
		};
		const isWindowsHardKillSettlementBlocked = () => process.platform === "win32" && hardKillRequested && !windowsTreeKillCompleted;
		const maybeSettleAfterExit = () => {
			if (process.platform !== "win32" && (!workerIpcDisconnected || openWorkerStdio > 0) || isWindowsHardKillSettlementBlocked() || childExitState == null || !stdoutDrained || !stderrDrained) return;
			settleObservedClose(resolveObservedExitState(childExitState));
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
		child.stdout?.once("end", () => {
			stdoutDrained = true;
			maybeSettleAfterExit();
		});
		child.stdout?.once("close", () => {
			stdoutDrained = true;
			maybeSettleAfterExit();
		});
		child.stderr?.once("end", () => {
			stderrDrained = true;
			maybeSettleAfterExit();
		});
		child.stderr?.once("close", () => {
			stderrDrained = true;
			maybeSettleAfterExit();
		});
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
			settleObservedClose(resolveObservedExitState(childCloseState));
		});
		const wait = async () => {
			if (!awaitedStdout) return await completion.promise;
			return await joinProcessCompletionAndOutput(completion.promise, awaitedStdout.drain());
		};
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
							try {
								child.kill("SIGKILL");
							} catch {}
							windowsTreeKillCompleted = true;
							if (childCloseState) {
								settleObservedClose(resolveObservedExitState(childCloseState));
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
					try {
						child.kill("SIGKILL");
					} catch {}
				}
				scheduleForceKillWaitFallback("SIGKILL");
				return;
			}
			if (signal === "SIGTERM" && pid) {
				signalProcessTreeForChild(pid, "SIGTERM");
				return;
			}
			try {
				child.kill(signal);
			} catch {}
		};
		const dispose = () => {
			awaitedStdout?.close();
			clearForcedWindowsCloseTimer();
			if (params.ownedWorker !== void 0) disconnectWorkerIpc();
			for (const unsubscribe of outputUnsubscribers.splice(0)) unsubscribe();
			child.stdout.destroy();
			child.stderr.destroy();
			if (!windowsJob) child.removeAllListeners();
			events.clear();
		};
		const closeStartGate = params.ownedWorker ? disconnectWorkerIpc : void 0;
		let startGateOpened = false;
		const openStartGate = params.ownedWorker ? async () => {
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
		} : void 0;
		const adapter = {
			get pid() {
				return windowsJob?.commandPid ?? child.pid;
			},
			stdin,
			oomScoreWrapperSelected: preparedSpawn.wrapped,
			supportsRawOutput: true,
			onStdout,
			...awaitedStdout ? { consumeStdout: awaitedStdout.consume } : {},
			onStderr,
			onExit: events.onExit,
			onError: events.onError,
			wait,
			...process.platform === "win32" && { waitForExtinction: () => windowsCleanup ?? cleanup.promise.then(() => windowsFallback) },
			kill,
			dispose,
			closeStartGate,
			openStartGate
		};
		if (!windowsCleanup) params.onSpawnCleanup?.(adapter.waitForExtinction?.() ?? cleanup.promise);
		launchGate.resolve();
		const ready = (async () => {
			try {
				if (windowsJob) await windowsJob.ready;
				assertCurrent();
				if (params.ownedWorker !== void 0 && (!child.connected || !child.channel)) throw new Error("worker lifecycle IPC channel was not created");
				if (params.input !== void 0) {
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
export { runWithProcessCleanupBudget as a, getProcessCleanupBudget as i, createServiceChildRelayAdapter as n, toStringEnv as o, bindInheritedProcessLineageFds as r, createChildAdapter as t };
