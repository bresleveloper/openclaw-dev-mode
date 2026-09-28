import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { i as signalPtySessionTree } from "./kill-tree-BGQdx374.mjs";
import { t as GRACEFUL_CANCEL_TIMEOUT_MS } from "./cancellation-policy-BQ2STJu_.mjs";
import { t as prepareOomScoreAdjustedSpawn } from "./linux-oom-score-YCP0ajt5.mjs";
import { o as toStringEnv, t as createChildAdapter } from "./child-WoujtRwa.mjs";
import { n as resolvePtyTerminalName, r as setPtyTerminalName, t as readPtyTerminalName } from "./pty-terminal-name-C4vYiRnD.mjs";
import crypto from "node:crypto";
import { performance } from "node:perf_hooks";
//#region src/process/supervisor/adapters/pty.ts
const FORCE_KILL_WAIT_FALLBACK_MS = 4e3;
async function createPtyAdapter(params) {
	const { spawnTerminalPty } = await import("./terminal-pty-TXcdM6DH.mjs");
	const baseEnv = params.env ? toStringEnv(params.env) : void 0;
	const preparedSpawn = prepareOomScoreAdjustedSpawn(params.shell, params.args, { env: baseEnv });
	const terminalName = resolvePtyTerminalName(params.name ?? readPtyTerminalName(preparedSpawn.env, process.platform) ?? readPtyTerminalName(process.env, process.platform));
	const spawnEnv = preparedSpawn.env ? toStringEnv(preparedSpawn.env) : process.platform === "win32" ? toStringEnv(process.env) : void 0;
	if (spawnEnv) setPtyTerminalName({
		env: spawnEnv,
		name: terminalName,
		platform: process.platform
	});
	params.assertCurrent?.();
	if (params.abortSignal?.aborted) throw new Error("PTY construction aborted");
	const pty = await spawnTerminalPty({
		file: preparedSpawn.command,
		args: preparedSpawn.args,
		cwd: params.cwd,
		env: spawnEnv,
		name: terminalName,
		cols: params.cols ?? 120,
		rows: params.rows ?? 30
	}, {
		abortSignal: params.abortSignal,
		assertCurrent: () => {
			params.assertCurrent?.();
			params.beforeSpawn?.();
		}
	});
	try {
		params.assertCurrent?.();
		if (params.abortSignal?.aborted) throw new Error("PTY construction aborted");
	} catch (error) {
		try {
			pty.kill();
		} catch {}
		throw error;
	}
	const cleanup = createDeferredCore();
	cleanup.promise.catch(() => {});
	params.onSpawnCleanup?.(cleanup.promise);
	let dataListener = null;
	let exitListener = null;
	const completion = createDeferredCore();
	let waitSettled = false;
	let forceKillWaitFallbackTimer = null;
	let stdinDestroyed = false;
	let stdinEnded = false;
	const clearForceKillWaitFallback = () => {
		if (!forceKillWaitFallbackTimer) return;
		clearTimeout(forceKillWaitFallbackTimer);
		forceKillWaitFallbackTimer = null;
	};
	const settleWait = (value) => {
		if (waitSettled) return;
		waitSettled = true;
		clearForceKillWaitFallback();
		stdinDestroyed = true;
		stdinEnded = true;
		completion.resolve(value);
	};
	const scheduleForceKillWaitFallback = (signal) => {
		clearForceKillWaitFallback();
		forceKillWaitFallbackTimer = setTimeout(() => {
			cleanup.reject(/* @__PURE__ */ new Error("PTY cleanup could not be confirmed before the kill deadline"));
			settleWait({
				code: null,
				signal
			});
		}, FORCE_KILL_WAIT_FALLBACK_MS);
		forceKillWaitFallbackTimer.unref();
	};
	exitListener = pty.onExit((event) => {
		cleanup.resolve();
		const signal = event.signal && event.signal !== 0 ? event.signal : null;
		settleWait({
			code: event.exitCode ?? null,
			signal
		});
	}) ?? null;
	const stdin = {
		get destroyed() {
			return stdinDestroyed;
		},
		get writable() {
			return !stdinDestroyed && !stdinEnded;
		},
		get writableEnded() {
			return stdinEnded;
		},
		get writableFinished() {
			return stdinEnded;
		},
		write: (data, cb) => {
			try {
				pty.write(data);
				cb?.(null);
			} catch (err) {
				cb?.(err);
			}
		},
		end: () => {
			try {
				stdinEnded = true;
				const eof = process.platform === "win32" ? "" : "";
				pty.write(eof);
			} catch {}
		},
		destroy: () => {
			stdinDestroyed = true;
			stdinEnded = true;
		}
	};
	const onStdout = (listener) => {
		dataListener = pty.onData((chunk) => {
			listener(chunk);
		}) ?? null;
	};
	const onStderr = (_listener) => {};
	const wait = async () => await completion.promise;
	const kill = (signal = "SIGKILL") => {
		try {
			if ((signal === "SIGKILL" || signal === "SIGTERM") && typeof pty.pid === "number" && pty.pid > 0) signalPtySessionTree(pty.pid, signal);
			else pty.kill(signal);
		} catch {}
		if (signal === "SIGKILL") scheduleForceKillWaitFallback(signal);
	};
	const dispose = () => {
		stdinDestroyed = true;
		stdinEnded = true;
		try {
			dataListener?.dispose();
		} catch {}
		try {
			exitListener?.dispose();
		} catch {}
		clearForceKillWaitFallback();
		dataListener = null;
		exitListener = null;
		settleWait({
			code: null,
			signal: null
		});
	};
	return {
		pid: pty.pid || void 0,
		stdin,
		oomScoreWrapperSelected: preparedSpawn.wrapped,
		supportsRawOutput: false,
		onStdout,
		onStderr,
		wait,
		kill,
		dispose
	};
}
//#endregion
//#region src/process/supervisor/supervisor.ts
function requiresProcessTree(scope, external) {
	return scope.processTree === "required-all" || scope.processTree === "owned-only" && !external;
}
function recordScopeCleanupFailure(cleanupOwners, error) {
	for (const cleanupOwner of cleanupOwners) cleanupOwner.failure ??= { error };
}
const DEFAULT_MAX_CAPTURED_OUTPUT_CHARS = 1048576;
const loadSupervisorLogRuntime = createLazyRuntimeModule(() => import("./supervisor-log.runtime.js"));
function normalizeTimeoutDuration(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return;
	return Math.max(1, Math.floor(value));
}
function clampCapturedOutputChars(value) {
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) return DEFAULT_MAX_CAPTURED_OUTPUT_CHARS;
	return Math.max(256, Math.floor(value));
}
function appendCapturedOutput(current, chunk, stream, maxChars) {
	const next = current + chunk;
	if (next.length <= maxChars) return next;
	const marker = `[openclaw: captured ${stream} truncated to last ${maxChars} chars]\n`;
	const tailChars = Math.max(0, maxChars - marker.length);
	return `${marker}${sliceUtf16Safe(next, -tailChars)}`;
}
function isTimeoutReason(reason) {
	return reason === "overall-timeout" || reason === "no-output-timeout";
}
function resolveElapsedTimeoutReason(params) {
	if (params.overallTimeoutDeadlineMs !== null && params.nowMs >= params.overallTimeoutDeadlineMs && (params.noOutputTimeoutDeadlineMs === null || params.nowMs < params.noOutputTimeoutDeadlineMs || params.overallTimeoutDeadlineMs <= params.noOutputTimeoutDeadlineMs)) return "overall-timeout";
	return params.noOutputTimeoutDeadlineMs !== null && params.nowMs >= params.noOutputTimeoutDeadlineMs ? "no-output-timeout" : null;
}
function createProcessSupervisor() {
	const ownedRuns = /* @__PURE__ */ new Set();
	const scopeCleanupOwners = /* @__PURE__ */ new Map();
	const startingScopes = /* @__PURE__ */ new Map();
	let shuttingDown = false;
	let shutdownPromise = null;
	let cleanupFailure;
	const cancel = (runId, reason = "manual-cancel") => {
		for (const current of ownedRuns) if (current.runId === runId) current.cancel(reason);
	};
	const cancelActiveScope = (scopeKey, reason) => {
		for (const current of ownedRuns) if (current.waitForExtinction && current.scopeKey === scopeKey) current.cancel(reason);
	};
	const cancelScope = (scopeKey, reason = "manual-cancel") => {
		if (!scopeKey.trim()) return;
		for (const current of ownedRuns) if (current.scopeKey === scopeKey) current.cancel(reason);
	};
	const waitForRuns = async (scopeKey, ignoreStartupFailures = false) => {
		let firstFailure;
		const observed = /* @__PURE__ */ new Set();
		while (true) {
			const selected = Array.from(ownedRuns).filter((current) => !observed.has(current) && (scopeKey === null || current.scopeKey === scopeKey));
			const starts = selected.flatMap((current) => current.pending ? [current.pending] : []);
			const owned = selected.flatMap((current) => {
				if (!current.waitForExtinction) return [];
				observed.add(current);
				return [current.waitForExtinction()];
			});
			if (starts.length === 0 && owned.length === 0) {
				if (firstFailure) throw firstFailure.reason;
				return;
			}
			const results = await Promise.allSettled([...owned, ...starts]);
			firstFailure ??= results.slice(0, ignoreStartupFailures ? owned.length : void 0).find((result) => result.status === "rejected");
		}
	};
	const acquireScopeCleanup = (scopeKey, options) => {
		const cleanupOwner = { processTree: options.processTree };
		const owners = scopeCleanupOwners.get(scopeKey) ?? /* @__PURE__ */ new Set();
		owners.add(cleanupOwner);
		scopeCleanupOwners.set(scopeKey, owners);
		let closing;
		return () => closing ??= (async () => {
			try {
				cancelScope(scopeKey);
				await waitForRuns(scopeKey);
			} catch (error) {
				cleanupOwner.failure ??= { error };
			} finally {
				owners.delete(cleanupOwner);
				if (owners.size === 0) scopeCleanupOwners.delete(scopeKey);
			}
			if (cleanupOwner.failure) throw cleanupOwner.failure.error;
		})();
	};
	const startRun = async (input, owner) => {
		const external = input.cleanupOwnership === "external";
		const treeCleanupOwners = owner.cleanupOwners.filter((scope) => requiresProcessTree(scope, external));
		const requireProcessTree = treeCleanupOwners.length > 0;
		if (!owner.terminationReason) {
			input.assertCurrent?.();
			input.beforeSpawn?.();
			if (input.mode === "pty" && requireProcessTree) throw new Error("PTY is unavailable when execution requires process-tree cleanup");
		}
		const { runId, scopeKey } = owner;
		const startedAtMs = Date.now();
		const startingTerminationReason = owner.terminationReason;
		const settleConstructionResult = (reason, cleanup, output) => {
			const exit = {
				reason,
				exitCode: null,
				exitSignal: null,
				durationMs: Date.now() - startedAtMs,
				stdout: output?.stdout ?? "",
				stderr: output?.stderr ?? "",
				timedOut: isTimeoutReason(reason),
				noOutputTimedOut: reason === "no-output-timeout"
			};
			return {
				runId,
				startedAtMs,
				activity: Object.freeze({
					resultSettled: true,
					lastOutputAtMs: output?.lastOutputAtMs ?? startedAtMs
				}),
				wait: async () => exit,
				...cleanup && { waitForExtinction: () => cleanup },
				cancel: () => void 0
			};
		};
		if (startingTerminationReason) return settleConstructionResult(startingTerminationReason);
		if (input.mode !== "anchored-shell" && input.argv.length === 0) throw new Error("spawn argv cannot be empty");
		const resolvedArgs = input.mode === "child" ? input.resolveArgs?.() : void 0;
		if (owner.terminationReason) return settleConstructionResult(owner.terminationReason);
		input.assertCurrent?.();
		input.beforeSpawn?.();
		if (input.replaceExistingScope && scopeKey) cancelActiveScope(scopeKey, "manual-cancel");
		let forcedReason = owner.terminationReason ?? null;
		let resultSettled = false;
		let lastOutputAtMs = startedAtMs;
		let cleanupSettled = false;
		const outputCompletion = createDeferredCore();
		let outputError;
		const captured = {
			stdout: "",
			stderr: ""
		};
		let outputDetached = false;
		const detachOutput = () => {
			outputDetached = true;
		};
		let forceKillTimer = null;
		let cancelRequested = false;
		const captureOutput = input.captureOutput !== false;
		const maxCapturedOutputChars = clampCapturedOutputChars(input.maxCapturedOutputChars);
		const setForcedReason = (reason) => {
			if (forcedReason || resultSettled) return;
			forcedReason = reason;
		};
		let cancelAdapter = null;
		const constructionAbort = new AbortController();
		const constructionAbortError = /* @__PURE__ */ new Error("adapter construction aborted");
		const constructionAbortPromise = new Promise((_, reject) => {
			const rejectConstruction = () => reject(constructionAbortError);
			if (constructionAbort.signal.aborted) rejectConstruction();
			else constructionAbort.signal.addEventListener("abort", rejectConstruction, { once: true });
		});
		const requestCancel = (reason) => {
			setForcedReason(reason);
			input.onCancel?.(reason);
			cancelAdapter?.(reason);
			if (!cancelAdapter) constructionAbort.abort();
		};
		owner.cancel = requestCancel;
		const createDeadline = (reason, value) => {
			const durationMs = normalizeTimeoutDuration(value);
			let deadlineMs = null;
			let timer;
			const schedule = (remainingMs, deadline) => {
				const intervalMs = resolveTimerTimeoutMs(remainingMs, 1);
				timer = setTimeout(() => {
					if (resultSettled) return;
					const remaining = Math.min(remainingMs - intervalMs, deadline - performance.now());
					if (remaining <= 0) requestCancel(reason);
					else schedule(remaining, deadline);
				}, intervalMs);
			};
			return {
				get deadlineMs() {
					return deadlineMs;
				},
				reset: () => {
					if (!durationMs || resultSettled) return;
					clearTimeout(timer);
					deadlineMs = performance.now() + durationMs;
					schedule(durationMs, deadlineMs);
				},
				clear: () => clearTimeout(timer)
			};
		};
		const overallDeadline = createDeadline("overall-timeout", input.timeoutMs);
		const outputDeadline = createDeadline("no-output-timeout", input.noOutputTimeoutMs);
		const touchOutput = () => {
			lastOutputAtMs = Date.now();
			outputDeadline.reset();
		};
		const settleResult = (adapter) => {
			resultSettled = true;
			outputCompletion.resolve();
			overallDeadline.clear();
			outputDeadline.clear();
			detachOutput();
			if (cleanupSettled) adapter?.dispose();
		};
		try {
			const cleanup = createDeferredCore();
			owner.waitForExtinction = () => cleanup.promise;
			cleanup.promise.catch(() => void 0);
			let constructionCleanup;
			let ownedAdapter;
			const onSpawnCleanup = (promise) => {
				constructionCleanup = promise;
				promise.catch(() => void 0);
			};
			overallDeadline.reset();
			outputDeadline.reset();
			const construction = {
				assertCurrent: input.assertCurrent,
				beforeSpawn: input.beforeSpawn,
				cwd: input.cwd,
				env: input.env,
				abortSignal: constructionAbort.signal,
				onSpawnCleanup
			};
			const startupPromise = input.mode === "pty" ? createPtyAdapter({
				...construction,
				shell: expectDefined(input.argv[0], "spawn executable"),
				args: input.argv.slice(1)
			}).then((adapter) => ({
				adapter,
				ready: Promise.resolve()
			})) : input.mode === "anchored-shell" ? createChildAdapter({
				...construction,
				anchoredShellCommand: input.command
			}) : createChildAdapter({
				...construction,
				...requireProcessTree && !external ? { ownProcessTree: true } : {},
				argv: resolvedArgs ? [...input.argv, ...resolvedArgs] : input.argv,
				argv0: input.argv0,
				exactEnv: input.exactEnv,
				windowsVerbatimArguments: input.windowsVerbatimArguments,
				input: input.input,
				stdinMode: input.stdinMode,
				secretInput: input.secretInput
			});
			const nativeExtinctionPromise = startupPromise.then(async ({ adapter: started, ready }) => {
				ownedAdapter = started;
				started.onError?.((error, source) => {
					if (source === "stdout" || source === "stderr") {
						outputError ??= error;
						recordScopeCleanupFailure(owner.cleanupOwners, error);
					}
				});
				if (constructionAbort.signal.aborted) {
					started.kill("SIGKILL");
					started.wait().catch(() => void 0);
				}
				await Promise.allSettled([ready]);
				const nativeCleanup = constructionCleanup ?? started.waitForExtinction?.();
				if (nativeCleanup) return await nativeCleanup;
				await started.wait();
			}, async () => {
				return await constructionCleanup;
			}).finally(() => {
				cleanupSettled = true;
				if (forceKillTimer) {
					clearTimeout(forceKillTimer);
					forceKillTimer = null;
				}
				if (resultSettled) ownedAdapter?.dispose();
			});
			Promise.all([nativeExtinctionPromise, outputCompletion.promise]).then(([outcome]) => {
				if (outputError) throw outputError;
				return outcome;
			}).then((outcome) => {
				if (requireProcessTree && outcome && outcome.status === "uncertain") recordScopeCleanupFailure(treeCleanupOwners, Object.assign(new Error(`Process-tree cleanup is uncertain: ${outcome.reason}`, { cause: outcome }), { reason: outcome.reason }));
				else if (ownedAdapter && (external || !ownedAdapter.waitForExtinction)) recordScopeCleanupFailure(treeCleanupOwners, /* @__PURE__ */ new Error("process cleanup cannot confirm owned execution-tree settlement"));
				ownedRuns.delete(owner);
				cleanup.resolve(outcome);
			}, (error) => {
				recordScopeCleanupFailure(owner.cleanupOwners, error);
				cleanupFailure ??= { error };
				ownedRuns.delete(owner);
				cleanup.reject(error);
			});
			const settleAbortedConstruction = (reason) => {
				settleResult(ownedAdapter);
				return settleConstructionResult(reason, cleanup.promise, {
					...captured,
					lastOutputAtMs
				});
			};
			let startup;
			try {
				startup = await Promise.race([startupPromise, constructionAbortPromise]);
			} catch (err) {
				if (err !== constructionAbortError || !forcedReason) throw err;
				return settleAbortedConstruction(forcedReason);
			}
			const adapter = startup.adapter;
			const withOutputFence = (deliver, recordsOutput = true) => (chunk) => {
				if (outputDetached) return;
				if (recordsOutput) touchOutput();
				deliver?.(chunk);
			};
			const rawInput = input.mode === "child" ? input : void 0;
			for (const [stream, subscribe, onText, onRaw] of [[
				"stdout",
				adapter.onStdout,
				input.onStdout,
				rawInput?.onStdoutRaw
			], [
				"stderr",
				adapter.onStderr,
				input.onStderr,
				rawInput?.onStderrRaw
			]]) subscribe(withOutputFence((chunk) => {
				if (captureOutput) captured[stream] = appendCapturedOutput(captured[stream], chunk, stream, maxCapturedOutputChars);
				onText?.(chunk);
			}, !adapter.supportsRawOutput), withOutputFence(onRaw));
			try {
				await Promise.race([startup.ready, constructionAbortPromise]);
			} catch (error) {
				if (error === constructionAbortError && forcedReason) return settleAbortedConstruction(forcedReason);
				settleResult(adapter);
				throw error;
			}
			cancelAdapter = (reason) => {
				if (cleanupSettled || cancelRequested && (requireProcessTree || !(resultSettled && forceKillTimer))) return;
				cancelRequested = true;
				if (resultSettled && !requireProcessTree) {
					if (forceKillTimer) {
						clearTimeout(forceKillTimer);
						forceKillTimer = null;
					}
					adapter.kill("SIGKILL");
					return;
				}
				if (process.platform === "win32" && (reason === "overall-timeout" || reason === "no-output-timeout")) {
					adapter.kill("SIGKILL");
					return;
				}
				adapter.kill("SIGTERM");
				forceKillTimer = setTimeout(() => {
					if (!cleanupSettled) adapter.kill("SIGKILL");
				}, GRACEFUL_CANCEL_TIMEOUT_MS);
				forceKillTimer.unref?.();
			};
			const waitOutcome = Promise.allSettled([(async () => {
				const result = await adapter.wait();
				const deadlineReason = resolveElapsedTimeoutReason({
					nowMs: performance.now(),
					overallTimeoutDeadlineMs: overallDeadline.deadlineMs,
					noOutputTimeoutDeadlineMs: outputDeadline.deadlineMs
				});
				const terminalReason = forcedReason ?? deadlineReason;
				settleResult(adapter);
				const reason = terminalReason ?? (result.signal != null ? "signal" : "exit");
				return {
					reason,
					exitCode: result.code,
					exitSignal: result.signal,
					oomScoreWrapperSelected: adapter.oomScoreWrapperSelected === true,
					durationMs: Date.now() - startedAtMs,
					...captured,
					timedOut: isTimeoutReason(reason),
					noOutputTimedOut: terminalReason === "no-output-timeout"
				};
			})().finally(() => {
				if (!resultSettled) settleResult(adapter);
			})]);
			const managedRun = {
				activity: Object.freeze({
					get deadlineAtMs() {
						return overallDeadline.deadlineMs === null ? void 0 : Date.now() + overallDeadline.deadlineMs - performance.now();
					},
					get resultSettled() {
						return resultSettled;
					},
					get lastOutputAtMs() {
						return lastOutputAtMs;
					}
				}),
				runId,
				pid: adapter.pid,
				startedAtMs,
				stdin: adapter.stdin,
				wait: async () => {
					const [outcome] = await waitOutcome;
					if (outcome.status === "rejected") throw outcome.reason;
					return outcome.value;
				},
				...adapter.waitForExtinction && { waitForExtinction: () => cleanup.promise },
				cancel: (reason = "manual-cancel") => {
					requestCancel(reason);
				},
				detachOutput
			};
			if (forcedReason) managedRun.cancel(forcedReason);
			return managedRun;
		} catch (err) {
			settleResult();
			const { warnProcessSupervisorSpawnFailure } = await loadSupervisorLogRuntime();
			warnProcessSupervisorSpawnFailure(`spawn failed: runId=${runId} reason=${String(err)}`);
			throw err;
		}
	};
	const spawn = (input) => {
		if (shuttingDown) return Promise.reject(/* @__PURE__ */ new Error("process supervisor is shut down"));
		const scopeKey = normalizeOptionalString(input.scopeKey);
		const owner = {
			runId: normalizeOptionalString(input.runId) ?? crypto.randomUUID(),
			scopeKey,
			cancel: (reason) => {
				owner.terminationReason ??= reason;
				input.onCancel?.(reason);
			},
			cleanupOwners: scopeKey ? [...scopeCleanupOwners.get(scopeKey) ?? []] : []
		};
		ownedRuns.add(owner);
		const starting = scopeKey ? startingScopes.get(scopeKey) ?? { runs: /* @__PURE__ */ new Set() } : void 0;
		if (scopeKey && starting) startingScopes.set(scopeKey, starting);
		const previous = starting ? input.replaceExistingScope ? Array.from(starting.runs) : starting.replacement ? [starting.replacement] : [] : [];
		const pending = previous.length > 0 ? Promise.allSettled(previous).then(() => startRun(input, owner)) : startRun(input, owner);
		owner.pending = pending;
		starting?.runs.add(pending);
		if (starting && input.replaceExistingScope) starting.replacement = pending;
		const clearPendingStart = () => {
			delete owner.pending;
			if (!owner.waitForExtinction) ownedRuns.delete(owner);
			starting?.runs.delete(pending);
			if (starting?.replacement === pending) delete starting.replacement;
			if (scopeKey && starting?.runs.size === 0 && startingScopes.get(scopeKey) === starting) startingScopes.delete(scopeKey);
		};
		pending.then(clearPendingStart, clearPendingStart);
		return pending;
	};
	const shutdown = () => {
		shuttingDown = true;
		return shutdownPromise ??= Promise.resolve().then(async () => {
			while (ownedRuns.size) {
				for (const owner of ownedRuns) owner.cancel("manual-cancel");
				await waitForRuns(null, true);
			}
			if (cleanupFailure) throw cleanupFailure.error;
		});
	};
	return {
		acquireScopeCleanup,
		spawn,
		cancel,
		cancelScope,
		shutdown
	};
}
//#endregion
//#region src/process/supervisor/index.ts
const holder = resolveGlobalSingleton(Symbol.for("openclaw.processSupervisorHolder"), () => ({ current: null }), async (value) => {
	const supervisor = value.current;
	await supervisor?.shutdown();
	if (value.current === supervisor) value.current = null;
});
/** Return the process-wide supervisor used by runtime code that does not inject one. */
function getProcessSupervisor() {
	if (holder.current) return holder.current;
	holder.current = createProcessSupervisor();
	return holder.current;
}
//#endregion
export { getProcessSupervisor as t };
