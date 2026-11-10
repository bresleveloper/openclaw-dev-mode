import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { i as resolveRuntimeWorkerUrl, n as resolveRuntimeWorkerArgv } from "./runtime-worker-url-CvMrvFI1.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { i as withChildProcessOperation } from "./spawn-diagnostics-CvEKrJ76.mjs";
import { r as WorkerTaskError } from "./src-NEpyeLp1.mjs";
import { t as WorkerTaskPool } from "./worker-task-pool-D6ogd941.mjs";
import { r as runCommandBuffersWithTimeout } from "./exec-Bf6uhUA7.mjs";
import { t as WORKTREE_CHECKOUT_TIMEOUT_MS } from "./git-CljZIJM8.mjs";
import { n as setWorktreePreparationTemplate } from "./preparation-timing-BalEUWpk.mjs";
import { deserialize } from "node:v8";
//#region src/agents/worktrees/filesystem-native.ts
function workerUrl() {
	return resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.fsSafeCopy);
}
function assertActive(options) {
	options.signal?.throwIfAborted();
	options.commitGuard();
}
function checkReply(reply) {
	if (reply.type === "failed") throw Object.assign(new Error(reply.message), { code: reply.code });
}
async function read(command, options) {
	assertActive(options);
	const runtime = resolveGlobalSingleton(Symbol.for("openclaw.worktreeFilesystemReads"), () => ({}), (owned) => {
		owned.closing ??= (owned.pool?.close() ?? Promise.resolve()).finally(() => {
			owned.pool = void 0;
			owned.closing = void 0;
		});
		return owned.closing;
	});
	if (runtime.closing) throw new WorkerTaskError("Native worktree reads are closing; retry the operation", "unavailable");
	const reply = await (runtime.pool ??= new WorkerTaskPool({
		workerUrl: workerUrl(),
		workerClass: "reader",
		idleTimeoutMs: 3e4
	})).run(command, {
		inputBytes: command.type === "probe" ? Buffer.byteLength(command.parent) : command.type === "acl" ? Buffer.byteLength(command.path) : command.paths.reduce((bytes, pathname) => bytes + Buffer.byteLength(pathname), 0),
		signal: options.signal,
		timeoutMs: WORKTREE_CHECKOUT_TIMEOUT_MS
	});
	assertActive(options);
	checkReply(reply);
	return reply;
}
async function write(command, options) {
	assertActive(options);
	const result = await withChildProcessOperation("worktree.filesystem", () => runCommandBuffersWithTimeout([process.execPath, ...resolveRuntimeWorkerArgv(workerUrl())], {
		input: JSON.stringify(command),
		beforeInput: () => assertActive(options),
		signal: options.signal,
		timeoutMs: WORKTREE_CHECKOUT_TIMEOUT_MS,
		killGraceMs: WORKTREE_CHECKOUT_TIMEOUT_MS,
		killProcessTree: true,
		requireProcessTreeExtinction: true,
		maxOutputBytes: 65536
	}));
	assertActive(options);
	if (result.code !== 0 || result.termination !== "exit") throw new Error(`Native worktree ${command.type} failed: ${result.termination}`);
	const reply = deserialize(result.stdout);
	checkReply(reply);
	if (reply.type !== "written") throw new Error("Native worktree operation returned no completion receipt");
}
const nativeWorktreeFilesystem = {
	async probe(parent, options) {
		const reply = await read({
			type: "probe",
			parent
		}, options);
		if (reply.type !== "probe") throw new Error("Native worktree check returned an invalid reply");
		setWorktreePreparationTemplate("unavailable", {
			backend: reply.backend ?? "none",
			reason: reply.backend ? "filesystem-supported" : reply.nativeMode === "off" ? "native-disabled" : "filesystem-unsupported-or-native-unavailable"
		});
		return reply.backend;
	},
	async readAcl(path, options) {
		const reply = await read({
			type: "acl",
			path
		}, options);
		if (reply.type !== "acl") throw new Error("Native worktree ACL inspection returned an invalid reply");
		return reply.acl;
	},
	async readMetadata(paths, options) {
		const reply = await read({
			type: "metadata",
			paths
		}, options);
		if (reply.type !== "metadata") throw new Error("Native worktree metadata returned an invalid reply");
		return reply.entries;
	},
	createSource(destination, options) {
		return write({
			type: "create",
			destination
		}, options);
	},
	copy(source, destination, options) {
		return write({
			type: "copy",
			source,
			destination
		}, options);
	}
};
//#endregion
export { nativeWorktreeFilesystem as t };
