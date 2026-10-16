import { r as requestGitWorkerCommand } from "./git-worker-context-BSo6KDXb.mjs";
import { r as WORKSPACE_MANIFEST_PROGRAM } from "./workspace-sync-scripts-UY5ll8uc.mjs";
import { createRequire } from "node:module";
import { compileFunction } from "node:vm";
//#region src/gateway/worker-environments/workspace-manifest-script.runtime.ts
const require = createRequire(import.meta.url);
const capture = compileFunction(`${WORKSPACE_MANIFEST_PROGRAM}\nreturn main();`, [
	"process",
	"require",
	"readManifestInput",
	"assertManifestCurrent",
	"readManifestGit",
	"MAX_WORKSPACE_HASH_MEMO_BYTES"
]);
async function captureNodeWorkspaceManifestImpl(input, assertCurrent = () => {}) {
	let stdout = "";
	await capture({
		argv: [process.execPath, ...input.argv],
		env: { HOME: input.home },
		pid: process.pid,
		platform: process.platform,
		stdout: { write: (value) => {
			if (Buffer.byteLength(stdout) + Buffer.byteLength(value) > input.maxHashMemoBytes + 4096) throw new Error("Node workspace manifest output exceeds its byte limit");
			stdout += value;
		} }
	}, require, () => input.memo ?? "", assertCurrent, async (root, args, maxOutputBytes) => {
		const result = await requestGitWorkerCommand({
			type: "git.buffer",
			input: {
				cwd: root,
				args,
				options: {
					maxOutputBytes,
					timeoutMs: 6e5
				}
			}
		});
		if (result.termination !== "exit" || result.code !== 0) throw new Error("Worker workspace Git inventory failed");
		return Buffer.from(result.stdout);
	}, input.maxHashMemoBytes);
	return stdout;
}
//#endregion
export { captureNodeWorkspaceManifestImpl };
