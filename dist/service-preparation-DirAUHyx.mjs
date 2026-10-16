import { i as runCommandWithTimeout } from "./exec-DJvyCA0D.mjs";
import { t as createCommandError } from "./command-error-CFVNEvkJ.mjs";
import { l as normalizeGitPathForFilesystem, n as createGitCommandError } from "./git-exec-rH66305f.mjs";
import { c as WorktreeRepositoryError } from "./git-worker-context-BSo6KDXb.mjs";
import { a as insideGitCheckout, c as requireGit, d as resolveGitRepositoryPaths, f as runGit, h as worktreePathExists, o as listGitWorktrees } from "./git-DK_u9XbK.mjs";
import { g as listRegistryWorktrees } from "./registry-Bm5FVBwN.mjs";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
//#region src/agents/worktrees/owner.ts
function worktreeOwnerMatches(record, params) {
	return record.ownerKind === (params.ownerKind ?? "manual") && (record.ownerId ?? void 0) === (params.ownerId ?? void 0);
}
//#endregion
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
	return await fs.realpath(normalizeGitPathForFilesystem(root));
}
//#endregion
//#region src/agents/worktrees/service-preparation.ts
const NAME_PATTERN = /^[a-z0-9][a-z0-9-]{0,63}$/;
async function withWorktreeSource(params, run) {
	const { withSource, ...operation } = params;
	params.commitGuard?.();
	if (!withSource) return await run(operation);
	return await withSource((source) => {
		const commitGuard = () => {
			params.commitGuard?.();
			source.assertCurrent();
		};
		commitGuard();
		const signal = params.signal && source.signal ? AbortSignal.any([params.signal, source.signal]) : source.signal ?? params.signal;
		const rollbackGuard = () => {
			params.rollbackGuard();
			source.assertCheckoutCurrent?.();
		};
		return run({
			...operation,
			signal,
			commitGuard,
			rollbackGuard
		});
	});
}
function validateName(name) {
	if (!NAME_PATTERN.test(name)) throw new Error("worktree name must match [a-z0-9][a-z0-9-]{0,63}");
	return name;
}
function findWorktreeByName(env, fingerprint, name) {
	return listRegistryWorktrees(env).find((record) => record.repoFingerprint === fingerprint && record.name === name);
}
async function nameIsUnavailable(env, repoRoot, fingerprint, root, name, owner) {
	const worktreePath = path.join(root, name);
	const registered = findWorktreeByName(env, fingerprint, name);
	if (owner.ownerId && registered && registered.removedAt === void 0 && worktreeOwnerMatches(registered, owner)) return false;
	if (registered || await worktreePathExists(worktreePath)) return true;
	const branch = `openclaw/${name}`;
	const branchExists = await runGit(repoRoot, [
		"show-ref",
		"--quiet",
		"--verify",
		`refs/heads/${branch}`
	]);
	if (branchExists.code === 0) return true;
	if (branchExists.code !== 1) throw createGitCommandError("git show-ref --verify", branchExists);
	return (await listGitWorktrees(repoRoot)).some((entry) => path.resolve(entry.path) === path.resolve(worktreePath));
}
function appendNameOrdinal(name, ordinal) {
	const suffix = `-${ordinal}`;
	return `${name.slice(0, 64 - suffix.length).replace(/-+$/g, "")}${suffix}`;
}
async function generateName(env, repoRoot, fingerprint, root, owner, suggestedName) {
	validateName(suggestedName);
	for (let ordinal = 1; ordinal <= 1e3; ordinal += 1) {
		const candidate = ordinal === 1 ? suggestedName : appendNameOrdinal(suggestedName, ordinal);
		if (!await nameIsUnavailable(env, repoRoot, fingerprint, root, candidate, owner)) return candidate;
	}
	throw new Error(`no available worktree name for ${suggestedName}`);
}
async function resolveRepositoryFromRealPath(requested, requestedLabel) {
	const sourceRoot = await resolveCheckoutRootFromRealPath(requested, requestedLabel);
	const { canonicalRoot, commonDir } = await resolveGitRepositoryPaths(sourceRoot);
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
}
async function resolveRepository(repoRoot) {
	return await resolveRepositoryFromRealPath(await fs.realpath(repoRoot).catch(() => {
		throw new Error(`repository does not exist: ${repoRoot}`);
	}), repoRoot);
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
async function cleanupFailedCreate(...args) {
	const failure = await removeFailedWorktree(...args);
	if (failure) throw new Error(`failed to clean up worktree creation: ${failure.message}`);
}
async function removeFailedWorktree(repoRoot, worktreePath, branch, rollbackGuard) {
	const options = {
		beforeRun: rollbackGuard,
		killProcessTree: true
	};
	const removed = await runGit(repoRoot, [
		"worktree",
		"remove",
		"--force",
		worktreePath
	], options);
	const deletedBranch = await runGit(repoRoot, [
		"branch",
		"-D",
		branch
	], options);
	if (removed.code !== 0 || deletedBranch.code !== 0) return removed.code !== 0 ? createGitCommandError("git worktree remove", removed) : createGitCommandError("git branch -D", deletedBranch);
}
async function resetFailedWorktreeAdd(repoRoot, worktreePath, branch, rollbackGuard) {
	const options = {
		beforeRun: rollbackGuard,
		killProcessTree: true
	};
	if ((await listGitWorktrees(repoRoot, options)).some((entry) => path.resolve(entry.path) === path.resolve(worktreePath))) {
		const removed = await runGit(repoRoot, [
			"worktree",
			"remove",
			"--force",
			worktreePath
		], options);
		if (removed.code !== 0) throw createGitCommandError("git worktree remove", removed);
	} else if (await worktreePathExists(worktreePath)) {
		rollbackGuard();
		await fs.rm(worktreePath, {
			recursive: true,
			force: true
		});
	}
	if ((await runGit(repoRoot, [
		"show-ref",
		"--quiet",
		"--verify",
		`refs/heads/${branch}`
	], options)).code === 0) await requireGit(repoRoot, [
		"branch",
		"-D",
		branch
	], options);
}
async function canResetFailedWorktreeAdd(repoRoot, worktreePath, branch, failure) {
	const message = (failure.stderr || failure.stdout).trim().split("\n").slice(-12).join("\n");
	const createdBranch = message.includes(`Preparing worktree (new branch '${branch}')`);
	if (message.includes("unable to checkout working tree") || createdBranch) return true;
	if ((await listGitWorktrees(repoRoot)).some((entry) => path.resolve(entry.path) === path.resolve(worktreePath)) || await worktreePathExists(worktreePath)) return false;
	return (await runGit(repoRoot, [
		"show-ref",
		"--quiet",
		"--verify",
		`refs/heads/${branch}`
	])).code === 1;
}
async function runSetupScript(repoRoot, worktreePath, params) {
	const setupScript = path.join(repoRoot, ".openclaw", "worktree-setup.sh");
	const stat = await fs.stat(setupScript).catch(() => void 0);
	if (!stat?.isFile() || (stat.mode & 73) === 0) return;
	const timeoutMs = 12e4;
	params.onProgress?.("setup");
	const runInCallerContext = AsyncLocalStorage.snapshot();
	const cancellation = new AbortController();
	const signal = params.signal ? AbortSignal.any([params.signal, cancellation.signal]) : cancellation.signal;
	let pending;
	let result;
	try {
		result = await (await withWorktreeSource(params, (current) => {
			current.signal?.throwIfAborted();
			current.commitGuard?.();
			pending = runInCallerContext(() => runCommandWithTimeout([setupScript], {
				timeoutMs,
				cwd: worktreePath,
				signal,
				killProcessTree: true,
				env: {
					OPENCLAW_SOURCE_TREE_PATH: repoRoot,
					OPENCLAW_WORKTREE_PATH: worktreePath
				}
			}));
			pending.catch(() => void 0);
			return { completion: pending };
		})).completion;
	} catch (error) {
		if (pending) {
			cancellation.abort(error);
			await pending.catch(() => void 0);
		}
		throw error;
	}
	params.signal?.throwIfAborted();
	if (result.code !== 0) throw createCommandError("worktree setup", result, { timeoutMs });
}
//#endregion
export { removeFailedWorktree as a, resolveRepositoryFromRealPath as c, validateName as d, withWorktreeSource as f, generateName as i, resolveRepositoryIdentity as l, worktreeOwnerMatches as m, cleanupFailedCreate as n, resetFailedWorktreeAdd as o, resolveCheckoutRootFromRealPath as p, findWorktreeByName as r, resolveRepository as s, canResetFailedWorktreeAdd as t, runSetupScript as u };
