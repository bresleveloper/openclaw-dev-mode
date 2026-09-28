import { c as WorktreeRepositoryError } from "./git-worker-context-Cywc-SH2.mjs";
import { c as normalizeGitPathForFilesystem } from "./git-exec-B6ZpVpQV.mjs";
import { d as runGit, o as insideGitCheckout } from "./git-DSwuA7YL.mjs";
import fs from "node:fs/promises";
//#region src/agents/worktrees/repository-paths.ts
async function resolveCheckoutRootFromRealPath(requested, requestedLabel) {
	const rootResult = await runGit(requested, [
		"rev-parse",
		"--show-toplevel",
		"--verify",
		"HEAD^{commit}"
	]);
	if (rootResult.code !== 0) {
		if (rootResult.termination === "exit" && rootResult.stdout.trim()) throw new WorktreeRepositoryError(`git checkout has no commits: ${requestedLabel}. Create an initial commit, then retry.`);
		if (insideGitCheckout(requested)) throw new Error(`Git metadata is unavailable for ${requested}; checkout preserved. Restore the original repository metadata, then use git worktree repair from that repository. Do not recreate its index or delete the checkout to bypass recovery.`);
		throw new WorktreeRepositoryError(`not a git checkout: ${requestedLabel}`);
	}
	const output = rootResult.stdout.replace(/\n$/, "");
	const separator = output.lastIndexOf("\n");
	const root = separator < 0 ? "" : output.slice(0, separator);
	if (!root) throw new WorktreeRepositoryError(`not a git checkout: ${requestedLabel}`);
	return await fs.realpath(normalizeGitPathForFilesystem(root));
}
//#endregion
export { resolveCheckoutRootFromRealPath as t };
