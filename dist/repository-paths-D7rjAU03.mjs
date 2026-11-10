import { a as withGitProcessOperation } from "./spawn-diagnostics-CvEKrJ76.mjs";
import { o as WorktreeRepositoryError } from "./errors-WYf-uyBk.mjs";
import { d as normalizeGitPathForFilesystem, r as createGitCommandError } from "./git-exec-CvORirty.mjs";
import { l as resolveGitRepositoryPaths, u as runGit } from "./git-CljZIJM8.mjs";
import { i as insideGitCheckout } from "./workspace-git-CiP8oVHR.mjs";
import { i as timeWorktreePreparationPhase } from "./preparation-timing-BalEUWpk.mjs";
import { createHash } from "node:crypto";
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
		if (rootResult.termination === "exit" && rootResult.stdout.trim()) {
			const head = await runGit(requested, [
				"symbolic-ref",
				"--quiet",
				"HEAD"
			]);
			const ref = head.stdout.trim();
			if (head.termination === "exit" && head.code === 0 && !head.stderr.trim() && ref.startsWith("refs/heads/")) {
				const target = await runGit(requested, [
					"show-ref",
					"--verify",
					"--quiet",
					ref
				]);
				if (target.termination === "exit" && target.code === 1 && !target.stderr.trim()) throw new WorktreeRepositoryError(`git checkout has no commits: ${requestedLabel}. Create an initial commit, then retry.`, { reason: "unborn" });
			}
		}
		if (insideGitCheckout(requested)) throw new Error(`Git metadata is unavailable for ${requested}; checkout preserved. Restore the original repository metadata, then use git worktree repair from that repository. Do not recreate its index or delete the checkout to bypass recovery.`);
		throw new WorktreeRepositoryError(`not a git checkout: ${requestedLabel}`);
	}
	const output = rootResult.stdout.replace(/\n$/, "");
	const separator = output.lastIndexOf("\n");
	const root = separator < 0 ? "" : output.slice(0, separator);
	if (!root) throw new WorktreeRepositoryError(`not a git checkout: ${requestedLabel}`);
	return {
		root: await fs.realpath(normalizeGitPathForFilesystem(root)),
		commit: output.slice(separator + 1)
	};
}
async function resolveRepositoryPathsFromRealPath(requested, requestedLabel) {
	const { root: sourceRoot } = await resolveCheckoutRootFromRealPath(requested, requestedLabel);
	return {
		sourceRoot,
		...await resolveGitRepositoryPaths(sourceRoot)
	};
}
async function resolveRepositoryFromRealPath(requested, requestedLabel) {
	return withGitProcessOperation("repository.identities", async () => {
		const { sourceRoot, canonicalRoot, commonDir } = await resolveRepositoryPathsFromRealPath(requested, requestedLabel);
		const origin = await runGit(canonicalRoot, [
			"config",
			"--get",
			"remote.origin.url"
		]);
		if (origin.termination !== "exit" || origin.code !== 0 && origin.code !== 1) throw createGitCommandError("git config --get remote.origin.url", origin);
		const originUrl = origin.code === 0 ? origin.stdout.trim() : "";
		return {
			repoRoot: canonicalRoot,
			sourceRoot,
			commonDir,
			originUrl,
			fingerprint: createHash("sha256").update(`${commonDir}\n${originUrl}`).digest("hex").slice(0, 16)
		};
	}, "default");
}
async function withRepositoryRealPath(repoRoot, read) {
	return await timeWorktreePreparationPhase("repository", async () => {
		return await read(await fs.realpath(repoRoot).catch(() => {
			throw new Error(`repository does not exist: ${repoRoot}`);
		}), repoRoot);
	});
}
function resolveRepository(repoRoot) {
	return withRepositoryRealPath(repoRoot, resolveRepositoryFromRealPath);
}
function resolveRepositoryPaths(repoRoot) {
	return withGitProcessOperation("repository.identities", () => withRepositoryRealPath(repoRoot, resolveRepositoryPathsFromRealPath), "default");
}
async function resolveRepositoryIdentity(repoRoot) {
	const resolved = await resolveRepository(repoRoot);
	return {
		checkoutRoot: resolved.sourceRoot,
		repoRoot: resolved.repoRoot,
		originUrl: resolved.originUrl,
		fingerprint: resolved.fingerprint
	};
}
//#endregion
export { resolveRepositoryPaths as a, resolveRepositoryIdentity as i, resolveRepository as n, resolveRepositoryFromRealPath as r, resolveCheckoutRootFromRealPath as t };
