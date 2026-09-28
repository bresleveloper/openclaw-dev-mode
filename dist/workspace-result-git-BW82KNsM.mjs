import { i as runCommandWithTimeout } from "./exec-shcN2-sN.mjs";
import { r as enqueueGitRefMutation } from "./git-exec-B6ZpVpQV.mjs";
import os from "node:os";
//#region src/gateway/worker-environments/workspace-result-git.ts
const WORKSPACE_RESULT_GIT_TIMEOUT_MS = 6e5;
function workspaceResultGitCommand(cwd, args) {
	return [
		"git",
		"-c",
		`core.hooksPath=${os.devNull}`,
		"-c",
		"core.fsmonitor=false",
		"-C",
		cwd,
		...args
	];
}
async function requireWorkspaceResultGit(cwd, args, options = {}) {
	const result = await runCommandWithTimeout(workspaceResultGitCommand(cwd, args), {
		timeoutMs: WORKSPACE_RESULT_GIT_TIMEOUT_MS,
		maxOutputBytes: 1048576,
		baseEnv: options.baseEnv,
		input: options.input
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
async function updateWorkspaceResultRefs(root, updates) {
	await withWorkspaceResultRefMutation(root, async (baseEnv) => {
		const current = typeof updates === "function" ? updates() : updates;
		if (current.length === 0) return;
		const input = current.map(({ ref, objectId }) => objectId === void 0 ? `delete ${ref}\0\0` : `update ${ref}\0${objectId}\0\0`).join("");
		await requireWorkspaceResultGit(root, [
			"update-ref",
			"--stdin",
			"-z"
		], {
			input: Buffer.from(input),
			baseEnv
		});
	});
}
//#endregion
export { workspaceResultGitCommand as a, withWorkspaceResultRefMutation as i, requireWorkspaceResultGit as n, updateWorkspaceResultRefs as r, WORKSPACE_RESULT_GIT_TIMEOUT_MS as t };
