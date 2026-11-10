import { a as withGitProcessOperation } from "./spawn-diagnostics-CvEKrJ76.mjs";
import { i as runCommandWithTimeout } from "./exec-Bf6uhUA7.mjs";
import { c as gitCommandArgv, i as enqueueGitRefMutation } from "./git-exec-CvORirty.mjs";
import { d as runGitBuffered } from "./git-CljZIJM8.mjs";
import os from "node:os";
//#region src/gateway/worker-environments/workspace-result-inventory.ts
const WORKER_RESULT_REF_PREFIX = "refs/openclaw/worker-results";
const WORKER_RESULT_CANDIDATE_REF_PREFIX = "refs/openclaw/worker-result-candidates";
const WORKER_RESULT_CLEANUP_REF_PREFIX = "refs/openclaw/worker-result-cleanup";
const STAGED_RESULT_MESSAGE = "OpenClaw worker workspace result";
function requireWorkerResultStorageRef(ref) {
	if (!new RegExp(`^(?:refs/openclaw/worker-results|refs/openclaw/worker-result-candidates|refs/openclaw/worker-result-cleanup)/[A-Za-z0-9-]+$`, "u").test(ref)) throw new Error("Cloud workspace staged result reference is invalid");
	return ref;
}
const STAGED_WORKSPACE_READ_MAX_BYTES = 8388608;
function stagedWorkspaceEntryBytes(entry) {
	return entry.type === "file" ? entry.size : Buffer.byteLength(entry.target);
}
function resolveStagedWorkspaceReadEntry(objectsByPath, entry) {
	const object = objectsByPath.get(entry.path);
	if (!object) throw new Error(`Cloud workspace result has no payload for ${entry.path}`);
	return {
		object,
		entry
	};
}
//#endregion
//#region src/gateway/worker-environments/workspace-result-git.ts
const WORKSPACE_RESULT_GIT_TIMEOUT_MS = 6e5;
function workspaceResultCheckpointInitArgs() {
	return [
		"init",
		"--quiet",
		"--bare",
		"--object-format=sha1"
	];
}
async function readWorkspaceResultGit(root, args, options, failureMessage = `git ${args[0]} failed`) {
	const result = await withGitProcessOperation("workspace.result", () => runGitBuffered(root, args, {
		timeoutMs: WORKSPACE_RESULT_GIT_TIMEOUT_MS,
		...options
	}), "default");
	if (result.termination !== "exit" || result.code !== 0) throw new Error(result.stderr.toString("utf8").trim() || failureMessage);
	return result.stdout;
}
function workspaceResultGitCommand(cwd, args) {
	return gitCommandArgv(cwd, args, [`core.hooksPath=${os.devNull}`, "core.fsmonitor=false"]);
}
async function requireWorkspaceResultGit(cwd, args, options = {}) {
	const result = await withGitProcessOperation("workspace.result", () => runCommandWithTimeout(workspaceResultGitCommand(cwd, args), {
		timeoutMs: WORKSPACE_RESULT_GIT_TIMEOUT_MS,
		maxOutputBytes: 1048576,
		baseEnv: options.baseEnv,
		input: options.input,
		beforeInput: options.beforeInput
	}), "default");
	if (result.termination !== "exit" || result.code !== 0) throw new Error((result.stderr || result.stdout || `git ${args[0]} failed`).trim());
	return result.stdout.trim();
}
async function withWorkspaceResultRefMutation(root, operation) {
	const baseEnv = { ...process.env };
	const common = await requireWorkspaceResultGit(root, ["rev-parse", "--git-common-dir"], { baseEnv });
	return await enqueueGitRefMutation(root, common, () => operation(baseEnv));
}
/** Atomically moves/deletes result refs before their caller changes its durable fence. */
async function updateWorkspaceResultRefs(root, updates, assertCurrent) {
	await withWorkspaceResultRefMutation(root, async (baseEnv) => {
		assertCurrent?.();
		const current = typeof updates === "function" ? await updates() : updates;
		assertCurrent?.();
		if (current.length === 0) return;
		const input = current.map(({ ref, objectId }) => objectId === void 0 ? `delete ${ref}\0\0` : `update ${ref}\0${objectId}\0\0`).join("");
		await requireWorkspaceResultGit(root, [
			"update-ref",
			"--stdin",
			"-z"
		], {
			input: Buffer.from(input),
			baseEnv,
			beforeInput: assertCurrent
		});
	});
}
//#endregion
export { withWorkspaceResultRefMutation as a, STAGED_RESULT_MESSAGE as c, WORKER_RESULT_CLEANUP_REF_PREFIX as d, WORKER_RESULT_REF_PREFIX as f, stagedWorkspaceEntryBytes as h, updateWorkspaceResultRefs as i, STAGED_WORKSPACE_READ_MAX_BYTES as l, resolveStagedWorkspaceReadEntry as m, readWorkspaceResultGit as n, workspaceResultCheckpointInitArgs as o, requireWorkerResultStorageRef as p, requireWorkspaceResultGit as r, workspaceResultGitCommand as s, WORKSPACE_RESULT_GIT_TIMEOUT_MS as t, WORKER_RESULT_CANDIDATE_REF_PREFIX as u };
