import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { t as workspaceInventoryError } from "./workspace-inventory-error-CmipulKw.mjs";
import { a as runWorkspaceInventoryCommandToFile, o as settleWorkspaceInventoryCommands, t as createWorkspaceGitTransferList } from "./workspace-sync-inventory-CqvrrDw_.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/gateway/worker-environments/workspace-sync-preflight.ts
async function readBoundedGitValue(filePath) {
	const value = await fs.readFile(filePath, "utf8");
	if (Buffer.byteLength(value) > 4096) throw new Error("Cloud workspace Git metadata is unexpectedly large");
	return value.trim();
}
async function preflightWorkerWorkspace(params) {
	const timeoutMs = params.timeoutMs ?? 6e5;
	const timeoutSignal = AbortSignal.timeout(timeoutMs);
	const signal = params.signal ? AbortSignal.any([params.signal, timeoutSignal]) : timeoutSignal;
	const temporaryDirectory = await fs.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-worker-workspace-preflight-"));
	try {
		const canonicalRoot = await fs.realpath(params.localPath);
		const gitRootPath = path.join(temporaryDirectory, "git-root");
		const baseCommitPath = path.join(temporaryDirectory, "base-commit");
		const runGit = (args, outputPath) => runWorkspaceInventoryCommandToFile({
			argv: [
				"git",
				"-C",
				canonicalRoot,
				...args
			],
			outputPath,
			signal,
			timeoutMs
		});
		await settleWorkspaceInventoryCommands([runGit(["rev-parse", "--show-toplevel"], gitRootPath), runGit([
			"rev-parse",
			"--verify",
			"HEAD"
		], baseCommitPath)], signal);
		const [reportedRoot, baseCommit] = await Promise.all([readBoundedGitValue(gitRootPath), readBoundedGitValue(baseCommitPath)]);
		if (await fs.realpath(reportedRoot) !== canonicalRoot) throw workspaceInventoryError("Cloud worker dispatch requires the canonical managed Git worktree root");
		if (!/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u.test(baseCommit)) throw new Error("Cloud workspace Git baseline is not a commit id");
		await createWorkspaceGitTransferList({
			gitRoot: canonicalRoot,
			temporaryDirectory: path.join(temporaryDirectory, "transfer"),
			signal,
			timeoutMs
		});
	} finally {
		await fs.rm(temporaryDirectory, {
			recursive: true,
			force: true
		});
	}
}
//#endregion
export { preflightWorkerWorkspace };
