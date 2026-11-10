import { d as toErrorObject } from "./error-coercion-BwMr25F8.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-CvMrvFI1.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { a as withGitProcessOperation } from "./spawn-diagnostics-CvEKrJ76.mjs";
import { o as readCommandProcessFailure, r as hasCommandProcessCleanupError, t as CommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { r as WorkerTaskError } from "./src-NEpyeLp1.mjs";
import { t as WorkerTaskPool } from "./worker-task-pool-D6ogd941.mjs";
import { t as ownedWorkerBytes } from "./worker-transfer-bytes-D_DP0IHa.mjs";
import { g as startGitOperationTiming } from "./git-exec-CvORirty.mjs";
import { d as runGitBuffered, f as runGitBytes } from "./git-CljZIJM8.mjs";
import { o as restoreGitWorkerFailure, s as serializeGitWorkerFailure } from "./git-worker-context-Bo3RTsYA.mjs";
import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { performance } from "node:perf_hooks";
//#region src/infra/git-content-budget.ts
const budget = resolveGlobalSingleton(Symbol.for("openclaw.gitContentBudget"), () => ({
	active: 0,
	waiters: /* @__PURE__ */ new Set()
}));
async function withContentGitSlot(run, signal) {
	signal?.throwIfAborted();
	await new Promise((resolve, reject) => {
		const start = () => {
			budget.waiters.delete(start);
			signal?.removeEventListener("abort", abort);
			budget.active++;
			resolve();
		};
		const abort = () => {
			budget.waiters.delete(start);
			reject(toErrorObject(signal?.reason, "Git operation aborted"));
		};
		if (budget.active < 2) start();
		else {
			budget.waiters.add(start);
			signal?.addEventListener("abort", abort, { once: true });
		}
	});
	try {
		signal?.throwIfAborted();
		return await run();
	} finally {
		budget.active--;
		budget.waiters.values().next().value?.();
	}
}
//#endregion
//#region src/infra/git-worker.ts
const POOL_OWNERS = [
	"reads",
	"content",
	"workspace",
	"worktrees",
	"worktreeMaintenance"
];
const MAX_PENDING_OPERATIONS = 128;
const WORKER_PHASE_TIMEOUT_MS = 18e5;
const log = createSubsystemLogger("git/worker");
const SPAWN_OPERATIONS = {
	"repository.identities": "repository.identities",
	"repository.branches": "repository.branches",
	"checkout.revision": "checkout.revision",
	"checkout.context": "checkout.context",
	"checkout.diff": "checkout.diff",
	"checkout.baseline": "checkout.baseline",
	"pull-request.branch-facts": "pull-request.branch-facts",
	"pull-request.branch-comparison": "pull-request.branch-facts",
	"worktree.snapshot": "worktree.snapshot",
	"worktree.snapshot-verify-exact": "worktree.snapshot",
	"worktree.cleanup-inspection": "worktree.cleanup",
	"worktree.cleanup-fingerprint": "worktree.cleanup",
	"worktree.eviction-classify": "worktree.cleanup",
	"worktree.eviction-source": "worktree.cleanup",
	"worktree.eviction-repositories": "worktree.cleanup",
	"worktree.eviction-purge": "worktree.cleanup",
	"worktree.provisioning-inspection": "worktree.provision",
	"worktree.git-size": "worktree.inspect",
	"worktree.checkout-transition-size": "worktree.inspect",
	"worktree.directory-size": "worktree.inspect",
	"workspace.artifacts": "workspace.inventory",
	"workspace.inventory.select": "workspace.inventory",
	"workspace.inventory.existing": "workspace.inventory",
	"workspace.inventory.paths": "workspace.inventory",
	"workspace.inventory.staged-directories": "workspace.inventory",
	"workspace.manifest.capture": "workspace.manifest",
	"workspace.manifest.snapshot": "workspace.manifest",
	"workspace.manifest.parse": "workspace.manifest",
	"workspace.manifest.serialize": "workspace.manifest",
	"workspace.manifest.overlay": "workspace.manifest",
	"workspace.manifest.pair": "workspace.manifest",
	"workspace.manifest.staged": "workspace.manifest",
	"workspace.manifest.entries": "workspace.manifest",
	"workspace.manifest.file": "workspace.manifest",
	"workspace.manifest.nodes": "workspace.manifest",
	"workspace.manifest.stage-input": "workspace.manifest",
	"workspace.manifest.tree-input": "workspace.manifest",
	"workspace.manifest.remote-capture": "workspace.manifest",
	"workspace.reconcile.preflight": "workspace.manifest"
};
function trackPending(pending, operation) {
	pending.add(operation);
	const settled = () => pending.delete(operation);
	operation.then(settled, settled);
}
function runtime() {
	return resolveGlobalSingleton(Symbol.for("openclaw.gitOperations"), () => ({ pending: /* @__PURE__ */ new Set() }), (state) => {
		state.closing ??= (async () => {
			await Promise.all(POOL_OWNERS.map((owner) => state[owner]?.close() ?? Promise.resolve()));
			await Promise.allSettled(state.pending);
			for (const owner of POOL_OWNERS) state[owner] = void 0;
		})().finally(() => {
			state.closing = void 0;
		});
		return state.closing;
	});
}
function poolFor(state, command, contentRead) {
	const owner = command.type === "worktree.snapshot" || command.type === "worktree.cleanup-inspection" || command.type === "worktree.cleanup-fingerprint" || command.type === "worktree.eviction-classify" || command.type === "worktree.eviction-repositories" || command.type === "worktree.eviction-purge" ? "worktreeMaintenance" : command.type.startsWith("worktree.") ? "worktrees" : command.type.startsWith("workspace.") ? "workspace" : contentRead ? "content" : "reads";
	return state[owner] ??= new WorkerTaskPool({
		workerUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.gitOperations),
		workerClass: owner === "reads" || owner === "content" ? "reader" : owner === "workspace" ? "compute" : "writer",
		workerOptions: owner === "workspace" ? { resourceLimits: { maxOldGenerationSizeMb: 1024 } } : void 0,
		sharedCompute: owner === "workspace",
		idleTimeoutMs: 3e4
	});
}
/** The host retains processes and authority; workers own bounded inventory and projection work. */
async function runGitWorkerOperation(command, options = {}) {
	const state = runtime();
	if (state.closing || state.pending.size >= MAX_PENDING_OPERATIONS) throw new WorkerTaskError("Git operation capacity is unavailable; retry the request.", "unavailable");
	options.signal?.throwIfAborted();
	options.assertCurrent?.();
	const transferList = options.transferList?.(command);
	const admitted = transferList ? structuredClone(command, { transfer: [...new Set(transferList)] }) : structuredClone(command);
	const baseEnv = { ...process.env };
	admitted.filesystemRefs = options.git === void 0 && !Object.entries(baseEnv).some(([key, value]) => value !== void 0 && (/^(GIT_DIR|GIT_WORK_TREE|GIT_COMMON_DIR|GIT_CEILING_DIRECTORIES|GIT_DISCOVERY_ACROSS_FILESYSTEM|GIT_NAMESPACE|GIT_SHALLOW_FILE|GIT_GRAFT_FILE|GIT_REPLACE_REF_BASE|GIT_NO_REPLACE_OBJECTS|GIT_INDEX_FILE|GIT_OBJECT_DIRECTORY|GIT_ALTERNATE_OBJECT_DIRECTORIES|GIT_CONFIG_PARAMETERS)$/i.test(key) || /^(HOME|XDG_CONFIG_HOME|GIT_CONFIG_GLOBAL|GIT_CONFIG_SYSTEM)$/i.test(key) && /[\r\n]/u.test(value))) ? createHash("sha256").update(JSON.stringify(Object.entries(baseEnv).filter(([key]) => /^(GIT_|HOME$|XDG_CONFIG_HOME$|PATH$|SUDO_UID$)/i.test(key)))).digest("hex") : void 0;
	const operation = executeOperation(state, admitted, baseEnv, {
		...options,
		git: options.git ? {
			text: options.git.text,
			buffered: options.git.buffered
		} : void 0
	});
	trackPending(state.pending, operation);
	return operation;
}
async function executeOperation(state, command, baseEnv, options) {
	const contentRoot = command.type === "checkout.diff" || command.type === "checkout.baseline" ? command.input.cwd : command.type === "pull-request.branch-facts" || command.type === "pull-request.branch-comparison" ? command.input.root : void 0;
	const contentRead = contentRoot !== void 0;
	const snapshot = command.type === "worktree.snapshot" || command.type === "worktree.snapshot-verify-exact";
	const contentGit = contentRead || snapshot;
	if (snapshot) {
		baseEnv.GIT_NO_LAZY_FETCH = "1";
		baseEnv.GIT_ALLOW_PROTOCOL = "";
	}
	let gitCommandCount = 0;
	let summedGitWallMs = 0;
	let summedGitQueueWaitMs = 0;
	let gitStdoutBytes = 0;
	let gitStderrBytes = 0;
	let gitTimeoutCount = 0;
	let workerQueueWaitMs = null;
	let slowestGitCommand;
	const timing = contentRoot !== void 0 ? startGitOperationTiming("content-read", log, () => ({
		operation: command.type,
		checkoutId: createHash("sha256").update(path.resolve(contentRoot)).digest("hex").slice(0, 16),
		checkoutClass: command.type === "pull-request.branch-facts" && command.input.refreshIndex ? "managed" : "unspecified",
		gitCommandCount,
		workerQueueWaitMs,
		summedGitWallMs: Math.round(summedGitWallMs),
		summedGitQueueWaitMs: Math.round(summedGitQueueWaitMs),
		gitStdoutBytes,
		gitStderrBytes,
		gitTimeoutCount,
		slowestGitCommand
	})) : void 0;
	let firstHostRequest = true;
	let outcome = "threw";
	const hostWork = /* @__PURE__ */ new Set();
	const temporaryDirectories = /* @__PURE__ */ new Set();
	const hostErrors = /* @__PURE__ */ new Map();
	let cleanupFailure;
	let errorSequence = 0;
	const request = async (value, signal) => {
		try {
			signal.throwIfAborted();
			if (!isRecord(value) || typeof value.type !== "string" || !isRecord(value.input)) throw new Error("Invalid Git worker host request");
			const effect = value;
			let result;
			const transferList = [];
			if (effect.type === "git.text" || effect.type === "git.buffer") {
				const queuedAt = timing ? performance.now() : 0;
				const execute = async () => {
					const startedAt = timing ? performance.now() : 0;
					let termination = "threw";
					if (timing) {
						gitCommandCount++;
						summedGitQueueWaitMs += startedAt - queuedAt;
					}
					try {
						const output = await withGitProcessOperation(SPAWN_OPERATIONS[command.type], async () => {
							const runOptions = {
								...effect.input.options,
								operation: SPAWN_OPERATIONS[command.type],
								baseEnv,
								signal,
								beforeRun: options.assertCurrent,
								killProcessTree: true,
								lowerPriority: contentGit
							};
							if (effect.type === "git.text") {
								const textOutput = await (options.git?.text ?? runGitBytes)(effect.input.cwd, effect.input.args, runOptions);
								if (textOutput.cleanup === "uncertain") throw new CommandProcessCleanupError();
								return textOutput;
							}
							const bufferedOutput = await (options.git?.buffered ?? runGitBuffered)(effect.input.cwd, effect.input.args, runOptions);
							if (bufferedOutput.error && (hasCommandProcessCleanupError(bufferedOutput.error) || readCommandProcessFailure(bufferedOutput.error)?.cleanup === "uncertain")) throw bufferedOutput.error;
							return bufferedOutput;
						});
						if (timing) {
							termination = output.termination;
							gitStdoutBytes += output.stdout.byteLength;
							gitStderrBytes += output.stderr.byteLength;
							gitTimeoutCount += Number(termination === "timeout");
						}
						return output;
					} finally {
						if (timing) {
							const durationMs = Math.round(performance.now() - startedAt);
							summedGitWallMs += durationMs;
							if (!slowestGitCommand || durationMs > slowestGitCommand.durationMs) {
								const args = effect.input.args;
								let i = 0;
								while (i < args.length && args[i].startsWith("-")) i += args[i] === "-c" || args[i] === "-C" ? 2 : 1;
								const name = args[i] ?? "";
								slowestGitCommand = {
									command: /^(diff|ls-files|rev-parse|rev-list|merge-base|cat-file|symbolic-ref|for-each-ref|version|log|show|hash-object)$/.test(name) ? name : "other",
									...name === "diff" ? { diffMode: args.includes("--no-index") ? "--no-index" : args.slice(i + 1).find((arg) => /^(--shortstat|--raw|--patch|--name-status)$/.test(arg)) ?? "other" } : {},
									durationMs,
									termination
								};
							}
						}
					}
				};
				const output = await (contentGit ? withContentGitSlot(execute, signal) : execute());
				const stdout = ownedWorkerBytes(output.stdout);
				const stderr = ownedWorkerBytes(output.stderr);
				result = {
					...output,
					stdout,
					stderr
				};
				transferList.push(stdout.buffer, stderr.buffer);
			} else if (effect.type === "git.temporary-directory") {
				const directory = await fs.mkdtemp(path.join(os.tmpdir(), "openclaw-git-operation-"));
				temporaryDirectories.add(directory);
				result = directory;
			} else if (effect.type === "workspace.inventory.write") {
				if (!options.onInventoryChunk) throw new Error("Workspace inventory has no active output owner");
				options.assertCurrent?.();
				await options.onInventoryChunk(effect.input.bytes, { signal });
			} else {
				if (!options.onEffect) throw new Error("Git read operation requested a lifecycle effect");
				options.assertCurrent?.();
				result = await options.onEffect(effect, { signal });
			}
			return {
				input: {
					ok: true,
					value: result
				},
				transferList: [...new Set(transferList)],
				timeoutMs: WORKER_PHASE_TIMEOUT_MS
			};
		} catch (error) {
			if (hasCommandProcessCleanupError(error)) cleanupFailure ??= error instanceof Error ? error : new CommandProcessCleanupError({ cause: error });
			else if (readCommandProcessFailure(error)?.cleanup === "uncertain") cleanupFailure ??= new CommandProcessCleanupError({ cause: error });
			const origin = ++errorSequence;
			hostErrors.set(origin, error);
			return {
				input: {
					ok: false,
					error: {
						...serializeGitWorkerFailure(error),
						origin
					}
				},
				timeoutMs: WORKER_PHASE_TIMEOUT_MS
			};
		}
	};
	try {
		const enqueuedAt = timing ? performance.now() : 0;
		const input = timing ? () => {
			workerQueueWaitMs = Math.round(performance.now() - enqueuedAt);
			return command;
		} : command;
		const reply = await poolFor(state, command, contentRead).run(input, {
			inputBytes: options.inputBytes,
			transferList: options.transferList,
			signal: options.signal,
			timeoutMs: WORKER_PHASE_TIMEOUT_MS,
			onRequest: (value, context) => {
				if (firstHostRequest) {
					firstHostRequest = false;
					timing?.markPhase();
				}
				if (!isRecord(value) || value.type !== "git.batch" || !isRecord(value.input) || !Array.isArray(value.input.requests) || value.input.requests.length === 0 || value.input.requests.length > 16) throw new Error("Invalid Git worker request batch");
				const pending = Promise.all(value.input.requests.map((item) => request(item, context.signal))).then((replies) => ({
					input: replies.map((response) => response.input),
					transferList: [...new Set(replies.flatMap((response) => response.transferList ?? []))],
					timeoutMs: WORKER_PHASE_TIMEOUT_MS
				}));
				trackPending(hostWork, pending);
				return pending;
			}
		});
		timing?.markPhase();
		if (!reply.ok) {
			if (reply.error.origin !== void 0 && hostErrors.has(reply.error.origin)) throw hostErrors.get(reply.error.origin);
			throw restoreGitWorkerFailure(reply.error);
		}
		options.signal?.throwIfAborted();
		options.assertCurrent?.();
		outcome = "returned";
		return reply.value;
	} finally {
		let cleanupSucceeded = false;
		try {
			await Promise.allSettled(hostWork).then(() => {
				if (cleanupFailure) throw cleanupFailure;
				return Promise.all([...temporaryDirectories].map((directory) => fs.rm(directory, {
					recursive: true,
					force: true
				})));
			});
			cleanupSucceeded = true;
		} finally {
			timing?.finish(cleanupSucceeded ? outcome : "threw");
		}
	}
}
//#endregion
export { withContentGitSlot as n, runGitWorkerOperation as t };
