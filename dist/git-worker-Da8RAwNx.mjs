import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-DazJcPEG.mjs";
import { r as resolveRuntimeWorkerUrl } from "./runtime-worker-url-B4o9tqvO.mjs";
import { r as WorkerTaskError, t as WorkerTaskPool } from "./worker-task-pool-cppt7dT0.mjs";
import { a as restoreGitWorkerFailure, o as serializeGitWorkerFailure } from "./git-worker-context-Cywc-SH2.mjs";
import { t as ownedWorkerBytes } from "./worker-transfer-bytes-D_DP0IHa.mjs";
import { f as runGitBuffered, p as runGitBytes } from "./git-DSwuA7YL.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
//#region src/infra/git-worker.ts
const MAX_PENDING_OPERATIONS = 128;
const WORKER_PHASE_TIMEOUT_MS = 18e5;
function runtime() {
	return resolveGlobalSingleton(Symbol.for("openclaw.gitOperations"), () => ({ pending: /* @__PURE__ */ new Set() }), (state) => {
		state.closing ??= (async () => {
			await Promise.all([
				state.reads?.close(),
				state.content?.close(),
				state.workspace?.close(),
				state.worktrees?.close(),
				state.worktreeMaintenance?.close()
			]);
			await Promise.allSettled(state.pending);
			state.reads = void 0;
			state.content = void 0;
			state.workspace = void 0;
			state.worktrees = void 0;
			state.worktreeMaintenance = void 0;
		})().finally(() => {
			state.closing = void 0;
		});
		return state.closing;
	});
}
function poolFor(state, command) {
	const owner = command.type === "worktree.snapshot" || command.type === "worktree.cleanup-inspection" ? "worktreeMaintenance" : command.type.startsWith("worktree.") ? "worktrees" : command.type.startsWith("workspace.") ? "workspace" : command.type === "repository.branches" || command.type === "checkout.context" ? "reads" : "content";
	return state[owner] ??= new WorkerTaskPool({
		workerUrl: resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.gitOperations),
		maxWorkers: owner === "content" || owner === "workspace" ? Math.max(1, Math.min(2, os.availableParallelism() - 1)) : 1,
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
	admitted.filesystemRefs = options.git === void 0 && !Object.entries(baseEnv).some(([key, value]) => value !== void 0 && /^(GIT_DIR|GIT_WORK_TREE|GIT_COMMON_DIR|GIT_CEILING_DIRECTORIES|GIT_DISCOVERY_ACROSS_FILESYSTEM|GIT_NAMESPACE)$/i.test(key));
	const operation = executeOperation(poolFor(state, admitted), admitted, baseEnv, {
		...options,
		git: options.git ? {
			text: options.git.text,
			buffered: options.git.buffered
		} : void 0
	});
	state.pending.add(operation);
	operation.then(() => state.pending.delete(operation), () => state.pending.delete(operation));
	return operation;
}
async function executeOperation(pool, command, baseEnv, options) {
	const hostWork = /* @__PURE__ */ new Set();
	const temporaryDirectories = /* @__PURE__ */ new Set();
	const hostErrors = /* @__PURE__ */ new Map();
	let errorSequence = 0;
	const request = async (value, signal) => {
		try {
			signal.throwIfAborted();
			if (!isRecord(value) || typeof value.type !== "string" || !isRecord(value.input)) throw new Error("Invalid Git worker host request");
			const effect = value;
			let result;
			const transferList = [];
			if (effect.type === "git.text") {
				const output = await (options.git?.text ?? runGitBytes)(effect.input.cwd, effect.input.args, {
					...effect.input.options,
					baseEnv,
					signal,
					beforeRun: options.assertCurrent,
					killProcessTree: true
				});
				const stdout = ownedWorkerBytes(output.stdout);
				const stderr = ownedWorkerBytes(output.stderr);
				result = {
					...output,
					stdout,
					stderr
				};
				transferList.push(stdout.buffer, stderr.buffer);
			} else if (effect.type === "git.buffer") {
				const output = await (options.git?.buffered ?? runGitBuffered)(effect.input.cwd, effect.input.args, {
					...effect.input.options,
					baseEnv,
					signal,
					beforeRun: options.assertCurrent,
					killProcessTree: true
				});
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
		const reply = await pool.run(command, {
			inputBytes: options.inputBytes,
			transferList: options.transferList,
			signal: options.signal,
			timeoutMs: WORKER_PHASE_TIMEOUT_MS,
			onRequest: (value, context) => {
				if (!isRecord(value) || value.type !== "git.batch" || !isRecord(value.input) || !Array.isArray(value.input.requests) || value.input.requests.length === 0 || value.input.requests.length > 16) throw new Error("Invalid Git worker request batch");
				const pending = Promise.all(value.input.requests.map((item) => request(item, context.signal))).then((replies) => ({
					input: replies.map((response) => response.input),
					transferList: [...new Set(replies.flatMap((response) => response.transferList ?? []))],
					timeoutMs: WORKER_PHASE_TIMEOUT_MS
				}));
				hostWork.add(pending);
				pending.then(() => hostWork.delete(pending), () => hostWork.delete(pending));
				return pending;
			}
		});
		if (!reply.ok) {
			if (reply.error.origin !== void 0 && hostErrors.has(reply.error.origin)) throw hostErrors.get(reply.error.origin);
			throw restoreGitWorkerFailure(reply.error);
		}
		options.signal?.throwIfAborted();
		options.assertCurrent?.();
		return reply.value;
	} finally {
		await Promise.allSettled(hostWork);
		await Promise.all([...temporaryDirectories].map((directory) => fs.rm(directory, {
			recursive: true,
			force: true
		})));
	}
}
//#endregion
export { runGitWorkerOperation as t };
