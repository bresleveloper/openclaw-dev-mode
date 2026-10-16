import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as resolveRuntimeWorkerUrl } from "./runtime-worker-url-DoBSDhBS.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-Dgz2IR4T.mjs";
import { r as withGitProcessOperation } from "./spawn-diagnostics-BltWCplw.mjs";
import { r as WorkerTaskError } from "./src-WCJCjrey.mjs";
import { t as WorkerTaskPool } from "./worker-task-pool-iI3pfrsK.mjs";
import { a as restoreGitWorkerFailure, o as serializeGitWorkerFailure } from "./git-worker-context-BSo6KDXb.mjs";
import { t as ownedWorkerBytes } from "./worker-transfer-bytes-D_DP0IHa.mjs";
import { m as runGitBytes, p as runGitBuffered } from "./git-DK_u9XbK.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import os from "node:os";
//#region src/infra/git-worker.ts
const MAX_PENDING_OPERATIONS = 128;
const WORKER_PHASE_TIMEOUT_MS = 18e5;
const SPAWN_OPERATIONS = {
	"repository.identities": "repository.identities",
	"repository.branches": "repository.branches",
	"checkout.revision": "checkout.revision",
	"checkout.context": "checkout.context",
	"checkout.diff": "checkout.diff",
	"checkout.baseline": "checkout.baseline",
	"pull-request.branch-facts": "pull-request.branch-facts",
	"worktree.snapshot": "worktree.snapshot",
	"worktree.snapshot-verify-exact": "worktree.snapshot",
	"worktree.cleanup-inspection": "worktree.cleanup",
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
	const owner = command.type === "worktree.snapshot" || command.type === "worktree.cleanup-inspection" ? "worktreeMaintenance" : command.type.startsWith("worktree.") ? "worktrees" : command.type.startsWith("workspace.") ? "workspace" : command.type === "repository.branches" || command.type === "repository.identities" || command.type === "checkout.context" || command.type === "checkout.revision" ? "reads" : "content";
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
	admitted.filesystemRefs = options.git === void 0 && !Object.entries(baseEnv).some(([key, value]) => value !== void 0 && /^(GIT_DIR|GIT_WORK_TREE|GIT_COMMON_DIR|GIT_CEILING_DIRECTORIES|GIT_DISCOVERY_ACROSS_FILESYSTEM|GIT_NAMESPACE|GIT_SHALLOW_FILE|GIT_GRAFT_FILE|GIT_REPLACE_REF_BASE|GIT_NO_REPLACE_OBJECTS|GIT_INDEX_FILE|GIT_OBJECT_DIRECTORY|GIT_ALTERNATE_OBJECT_DIRECTORIES)$/i.test(key));
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
			if (effect.type === "git.text" || effect.type === "git.buffer") {
				const run = effect.type === "git.text" ? options.git?.text ?? runGitBytes : options.git?.buffered ?? runGitBuffered;
				const output = await withGitProcessOperation(SPAWN_OPERATIONS[command.type], () => run(effect.input.cwd, effect.input.args, {
					...effect.input.options,
					operation: SPAWN_OPERATIONS[command.type],
					baseEnv,
					signal,
					beforeRun: options.assertCurrent,
					killProcessTree: true
				}));
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
