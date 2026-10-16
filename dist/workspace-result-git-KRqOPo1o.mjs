import { i as runCommandWithTimeout } from "./exec-DJvyCA0D.mjs";
import { r as enqueueGitRefMutation, s as gitCommandArgv } from "./git-exec-rH66305f.mjs";
import os from "node:os";
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
function workspaceResultGitCommand(cwd, args) {
	return gitCommandArgv(cwd, args, [`core.hooksPath=${os.devNull}`, "core.fsmonitor=false"]);
}
async function requireWorkspaceResultGit(cwd, args, options = {}) {
	const result = await runCommandWithTimeout(workspaceResultGitCommand(cwd, args), {
		timeoutMs: WORKSPACE_RESULT_GIT_TIMEOUT_MS,
		maxOutputBytes: 1048576,
		baseEnv: options.baseEnv,
		input: options.input,
		beforeInput: options.beforeInput
	});
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
export { workspaceResultCheckpointInitArgs as a, withWorkspaceResultRefMutation as i, requireWorkspaceResultGit as n, workspaceResultGitCommand as o, updateWorkspaceResultRefs as r, WORKSPACE_RESULT_GIT_TIMEOUT_MS as t };
