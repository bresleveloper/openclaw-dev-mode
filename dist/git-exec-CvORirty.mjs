import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { d as sleepWithAbort } from "./src-Bzfi3cQM.mjs";
import { P as runWithDiagnosticTraceContext, k as getActiveDiagnosticTraceContext, t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-C91J-XX8.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { a as withGitProcessOperation } from "./spawn-diagnostics-CvEKrJ76.mjs";
import "./backoff-N5Hi0doU.mjs";
import { t as KeyedAsyncQueue } from "./keyed-async-queue-CTreGrmR.mjs";
import { t as createCommandError } from "./command-error-B2V3e5UN.mjs";
import { t as createFixedWindowBudget } from "./fixed-window-rate-limit-BlrEf45U.mjs";
import { i as runCommandWithTimeout, r as runCommandBuffersWithTimeout, t as runCommandBuffered } from "./exec-Bf6uhUA7.mjs";
import fs from "node:fs/promises";
import path from "node:path";
import { isMainThread, threadId } from "node:worker_threads";
import { performance } from "node:perf_hooks";
//#region src/infra/git-operation-timing.ts
const diagnosticNow = () => performance.now();
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
		const startedAt = performance.now();
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
					elapsedMs: Math.round(performance.now() - startedAt)
				};
			},
			markRemovalFailure() {
				failedRemovalStage ??= removalStage;
			},
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
	const started = performance.now();
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
	if (options.timeoutMs - (performance.now() - started) <= RETRY_DELAY_MS) return result;
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
	const remainingMs = Math.floor(options.timeoutMs - (performance.now() - started));
	if (remainingMs <= 0) return result;
	return await attempt(remainingMs);
}
//#endregion
//#region src/infra/git-exec.ts
const GIT_TIMEOUT_MS = 12e4;
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
function createGitCommandError(command, result) {
	const timeoutMs = result.timeoutMs ?? 12e4;
	const error = createCommandError(command, result, { timeoutMs });
	if (result.termination === "timeout") return new GitCommandTimeoutError(`${error.message}\nGit did not finish within its ${timeoutMs / 1e3}s budget; check remote reachability, repository locks, and clone shape (partial clones fetch missing objects lazily).`);
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
function gitNullConfigPath() {
	return process.platform === "win32" ? "NUL" : "/dev/null";
}
//#endregion
export { executeGitCommand as a, gitCommandArgv as c, normalizeGitPathForFilesystem as d, requireGitCommand as f, startGitOperationTiming as g, withGitNetworkRetry as h, enqueueGitRefMutation as i, gitNullConfigPath as l, retryableGitNetworkOperation as m, GitCommandTimeoutError as n, executeGitCommandBuffered as o, requireGitCommandOutput as p, createGitCommandError as r, executeGitCommandBytes as s, GIT_TIMEOUT_MS as t, gitReadOnlyEnvironment as u };
