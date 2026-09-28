import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { s as sleepWithAbort } from "./src-D4OikzaT.mjs";
import { N as runWithDiagnosticTraceContext, O as getActiveDiagnosticTraceContext, t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-CVabF32H.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import "./backoff-CszdOMiF.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { i as runCommandWithTimeout, r as runCommandBuffersWithTimeout, t as runCommandBuffered } from "./exec-shcN2-sN.mjs";
import { t as createFixedWindowBudget } from "./fixed-window-rate-limit-wyPr2JvV.mjs";
import { t as createCommandError } from "./command-error-CLRWADNl.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { performance } from "node:perf_hooks";
import { isMainThread, threadId } from "node:worker_threads";
//#region src/infra/git-network-retry.ts
const log = createSubsystemLogger("git/network");
const RETRY_DELAY_MS = 1e3;
/** Clone retries require destination cleanup by the clone owner, not this argv classifier. */
function retryableGitNetworkOperation(args) {
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];
		if (arg === "-c" || arg === "-C" || arg === "--git-dir" || arg === "--work-tree") index += 1;
		else if (/^(?:-c.+|-C.+|--(?:git-dir|work-tree|config-env)=.+)$/u.test(arg) || [
			"--no-optional-locks",
			"--no-lazy-fetch",
			"--no-replace-objects",
			"--bare"
		].includes(arg)) continue;
		else return arg === "fetch" || arg === "ls-remote" ? arg : void 0;
	}
}
function isTransientGitFailure(result) {
	if (result.termination !== "exit" || result.code === null || result.code === 0 || result.killed || result.signal || result.outputLimitExceeded || result.outputErrorStream || result.cleanup === "uncertain") return false;
	const stderr = typeof result.stderr === "string" ? result.stderr : Buffer.from(result.stderr).toString("utf8");
	if (/authentication failed|permission denied|access denied|repository not found|could not read username|couldn't find remote ref|not our ref|certificate|host key verification failed|no space left|disk quota|cannot lock ref|bad object|returned error: (?:401|403|404)\b/iu.test(stderr)) return false;
	return /did not send all necessary objects|could not resolve (?:host|proxy)|temporary failure in name resolution|failed to connect|connection (?:reset|timed out|refused|closed)|remote end hung up unexpectedly|unexpected disconnect|early EOF|empty reply from server|TLS connection was non-properly terminated|SSL_ERROR_SYSCALL|HTTP\/2.*(?:stream|internal_error)|RPC failed; curl (?:5|6|7|18|28|35|52|55|56|92)\b|returned error: (?:408|429|500|502|503|504)\b/iu.test(stderr);
}
/** Retry one settled network read inside its original deadline and caller-owned admission. */
async function withGitNetworkRetry(operation, options, run) {
	const started = performance.now();
	options.beforeRun?.();
	const result = await run(options.timeoutMs);
	if (!operation || !isTransientGitFailure(result)) return result;
	const cancelled = () => ({
		...result,
		code: null,
		signal: null,
		termination: "signal"
	});
	if (options.signal?.aborted) return cancelled();
	if (options.timeoutMs - (performance.now() - started) <= RETRY_DELAY_MS) return result;
	log.warn(`Git ${operation} hit a transient transport failure; retrying once`, {
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
	const remainingMs = Math.floor(options.timeoutMs - (performance.now() - started));
	if (remainingMs <= 0) return result;
	options.beforeRun?.();
	return await run(remainingMs);
}
//#endregion
//#region src/infra/git-operation-timing.ts
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
	}
};
const removalStages = [
	["preparation", "preparationMs"],
	["snapshot", "snapshotMs"],
	["checkoutRemoval", "checkoutRemovalMs"],
	["finalization", "bodyFinalizeMs"]
];
function startGitOperationTiming(kind, log) {
	try {
		if (!areDiagnosticsEnabledForProcess() || !log.isEnabled("info")) return;
		const startedAt = performance.now();
		const trace = getActiveDiagnosticTraceContext();
		const operation = operations[kind];
		let firstPhaseEnd;
		let secondPhaseEnd;
		let removalStage;
		let removalStageStartedAt = 0;
		let removalDurations;
		return {
			markPhase() {
				if (firstPhaseEnd === void 0) firstPhaseEnd = performance.now();
				else secondPhaseEnd = performance.now();
			},
			markRemovalStage(next) {
				if (kind !== "worktree-removal") return;
				try {
					const now = performance.now();
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
					const endedAt = performance.now();
					const durationMs = endedAt - startedAt;
					if (durationMs < 1e3 || !areDiagnosticsEnabledForProcess() || !log.isEnabled("info")) return;
					const state = resolveGlobalSingleton(Symbol.for(operation.stateKey), () => ({
						budget: createFixedWindowBudget({
							maxRequests: 60,
							windowMs: 6e4,
							now: () => performance.now()
						}),
						omitted: 0
					}));
					if (!state.budget.consume().allowed) {
						state.omitted = Math.min(Number.MAX_SAFE_INTEGER, state.omitted + 1);
						return;
					}
					runWithDiagnosticTraceContext(trace, () => log.info(operation.message, {
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
						omittedObservations: state.omitted
					}));
					state.omitted = 0;
				} catch {}
			}
		};
	} catch {
		return;
	}
}
//#endregion
//#region src/infra/git-exec.ts
const GIT_TIMEOUT_MS = 12e4;
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
		const commonDir = await fs.realpath(path.resolve(cwd, commonPath));
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
function withForegroundGitMaintenance(argv) {
	return argv[0] === "git" ? [
		"git",
		"-c",
		"maintenance.autoDetach=false",
		"-c",
		"gc.autoDetach=false",
		...argv.slice(1)
	] : argv;
}
async function executeGitCommand(cwd, args, options = {}) {
	const timeoutMs = options.timeoutMs ?? 12e4;
	const argv = [
		"git",
		"-C",
		cwd,
		...args
	];
	return {
		...await withGitNetworkRetry(retryableGitNetworkOperation(args), {
			...options,
			timeoutMs
		}, (attemptTimeoutMs) => runCommandWithTimeout(options.killProcessTree ? withForegroundGitMaintenance(argv) : argv, {
			...options,
			timeoutMs: attemptTimeoutMs
		})),
		timeoutMs
	};
}
/** The same command/timeout contract, with output bytes owned by a worker consumer. */
async function executeGitCommandBytes(cwd, args, options = {}) {
	const timeoutMs = options.timeoutMs ?? 12e4;
	const argv = [
		"git",
		"-C",
		cwd,
		...args
	];
	return {
		...await withGitNetworkRetry(retryableGitNetworkOperation(args), {
			...options,
			timeoutMs
		}, (attemptTimeoutMs) => runCommandBuffersWithTimeout(options.killProcessTree ? withForegroundGitMaintenance(argv) : argv, {
			...options,
			timeoutMs: attemptTimeoutMs
		})),
		timeoutMs
	};
}
async function executeGitCommandBuffered(cwd, args, options = {}) {
	const argv = [
		"git",
		"-C",
		cwd,
		...args
	];
	return await withGitNetworkRetry(retryableGitNetworkOperation(args), {
		...options,
		timeoutMs: options.timeoutMs ?? 12e4
	}, (timeoutMs) => runCommandBuffered(options.killProcessTree === false ? argv : withForegroundGitMaintenance(argv), {
		...options,
		timeoutMs
	}));
}
function createGitCommandError(command, result) {
	const timeoutMs = result.timeoutMs ?? 12e4;
	const error = createCommandError(command, result, { timeoutMs });
	if (result.termination === "timeout") error.message += `\nGit did not finish within its ${timeoutMs / 1e3}s budget; check remote reachability, repository locks, and clone shape (partial clones fetch missing objects lazily).`;
	return error;
}
async function requireGitCommand(cwd, args, options = {}) {
	return requireGitCommandOutput(`git ${args.join(" ")}`, await executeGitCommand(cwd, args, options)).trim();
}
function requireGitCommandOutput(command, result, createError = createGitCommandError) {
	if (result.termination !== "exit" || result.code !== 0) throw createError(command, result);
	if (result.stdoutTruncatedBytes) throw createError(command, {
		...result,
		code: null,
		outputLimitExceeded: true
	});
	return result.stdout;
}
/**
* Null device path that Git for Windows can open as a config file.
*
* `os.devNull` returns `\.\nul` on Windows, which Git rejects with
* "unable to access '\.\nul': Invalid argument" (exit 128) when passed via
* `GIT_CONFIG_GLOBAL` or `GIT_CONFIG_SYSTEM` — it must open and parse those
* files. "NUL" is the path Git for Windows understands. Config *values* such
* as `core.hooksPath` accept the device path and need no change.
*/
function gitNullConfigPath() {
	return process.platform === "win32" ? "NUL" : "/dev/null";
}
//#endregion
export { executeGitCommandBuffered as a, normalizeGitPathForFilesystem as c, startGitOperationTiming as d, retryableGitNetworkOperation as f, executeGitCommand as i, requireGitCommand as l, createGitCommandError as n, executeGitCommandBytes as o, withGitNetworkRetry as p, enqueueGitRefMutation as r, gitNullConfigPath as s, GIT_TIMEOUT_MS as t, requireGitCommandOutput as u };
