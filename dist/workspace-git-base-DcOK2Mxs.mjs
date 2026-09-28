import { t as hasNodeErrorCode } from "./path-guards-D5kuI0Tv.mjs";
import { t as normalizeCloudRepo } from "./cloud-worker-project-profiles-DJ5jtY5M.mjs";
import { i as executeGitCommand, u as requireGitCommandOutput } from "./git-exec-B6ZpVpQV.mjs";
import { i as MAX_WORKSPACE_INVENTORY_TOTAL_BYTES, r as MAX_WORKSPACE_INVENTORY_PATH_BYTES } from "./workspace-inventory-limits-DfDQlGHa.mjs";
import { c as requireGit, d as runGit, i as gitEnvironment, n as commandError, u as resolveGitRepositoryPaths } from "./git-DSwuA7YL.mjs";
import { i as workerSshCommandOptions } from "./ssh-D4TnVP7T.mjs";
import { a as runWorkspaceInventoryCommandToFile } from "./workspace-sync-inventory-CqvrrDw_.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
//#region src/gateway/worker-environments/workspace-git-base.ts
const GIT_TIMEOUT_MS = 6e5;
const COMMIT_PATTERN = /^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u;
function workerProjectSeedKey(project) {
	return createHash("sha256").update(`${project.key}\0${project.baseCommit}`).digest("hex");
}
function workerLocalProjectKey(namespace, commonDir) {
	return createHash("sha256").update(JSON.stringify([namespace, commonDir])).digest("hex");
}
async function prepareWorkerProjectSnapshot(params) {
	params.signal?.throwIfAborted();
	const root = await fs.realpath(params.localPath);
	const options = {
		timeoutMs: GIT_TIMEOUT_MS,
		signal: params.signal,
		env: workerSshCommandOptions({ timeoutMs: GIT_TIMEOUT_MS }).baseEnv
	};
	const gitAdmin = await fs.lstat(path.join(root, ".git")).catch((error) => {
		if (hasNodeErrorCode(error, "ENOENT")) return;
		throw error;
	});
	if (!gitAdmin) {
		const bare = await runGit(root, ["rev-parse", "--is-bare-repository"], options);
		params.signal?.throwIfAborted();
		if (bare.code !== 0 || bare.stdout.trim() !== "true") {
			if (params.baseCommit === void 0) return;
			throw new Error("Pinned worker project snapshot is no longer available");
		}
	}
	if (await fs.realpath(await requireGit(root, ["rev-parse", gitAdmin ? "--show-toplevel" : "--absolute-git-dir"], options)) !== root) throw new Error("Worker git workspace sync requires the managed worktree root");
	if (params.baseCommit !== void 0 && !COMMIT_PATTERN.test(params.baseCommit)) throw new Error("Worker project snapshot is not a commit id");
	const head = await runGit(root, [
		"rev-parse",
		"--verify",
		"--quiet",
		`${params.baseCommit ?? "HEAD"}^{commit}`
	], options);
	if (head.code === 1 && params.baseCommit === void 0) return;
	if (head.code !== 0) throw commandError("git rev-parse", head);
	const baseCommit = head.stdout.trim();
	if (!COMMIT_PATTERN.test(baseCommit)) throw new Error("Worker workspace Git base is not a commit id");
	const { canonicalRoot, commonDir } = await resolveGitRepositoryPaths(root, options);
	const origin = await runGit(root, [
		"remote",
		"get-url",
		"origin"
	], options);
	const label = (origin.code === 0 ? normalizeCloudRepo(origin.stdout) : void 0) ?? path.basename(root);
	params.signal?.throwIfAborted();
	return {
		key: workerLocalProjectKey(params.namespace, commonDir),
		root: canonicalRoot,
		baseCommit,
		label
	};
}
async function prepareWorkerWorkspaceGitPack(params) {
	const { root, baseCommit, signal } = params;
	if (!COMMIT_PATTERN.test(baseCommit)) throw new Error("Worker workspace Git base is not a commit id");
	if (params.retainedCommit !== void 0 && (!COMMIT_PATTERN.test(params.retainedCommit) || params.retainedCommit.length !== baseCommit.length)) throw new Error("Worker workspace retained Git base is not a compatible commit id");
	const objectListPath = path.join(params.temporaryRoot, `${baseCommit}.objects`);
	const packPath = path.join(params.temporaryRoot, `${baseCommit}.pack`);
	try {
		let retainedCommit = params.retainedCommit;
		if (retainedCommit) {
			const donor = requireGitCommandOutput("git cat-file", await executeGitCommand(root, ["cat-file", "--batch-check=%(objectname) %(objecttype)"], {
				input: `${retainedCommit}\n`,
				baseEnv: params.baseEnv,
				env: gitEnvironment({ GIT_NO_LAZY_FETCH: "1" }),
				signal,
				timeoutMs: GIT_TIMEOUT_MS
			})).trim();
			if (donor === `${retainedCommit} missing`) retainedCommit = void 0;
			else if (donor !== `${retainedCommit} commit`) throw new Error("Worker workspace retained Git base is not a commit");
		}
		if (retainedCommit) await fs.writeFile(objectListPath, `--shallow ${baseCommit}\n--shallow ${retainedCommit}\n${baseCommit}\n^${retainedCommit}\n`);
		else {
			await runWorkspaceInventoryCommandToFile({
				argv: [
					"git",
					"-C",
					root,
					"rev-list",
					"--objects",
					"--no-object-names",
					`${baseCommit}^{tree}`
				],
				outputPath: objectListPath,
				baseEnv: params.baseEnv,
				signal,
				timeoutMs: GIT_TIMEOUT_MS,
				maxOutputBytes: MAX_WORKSPACE_INVENTORY_PATH_BYTES
			});
			await fs.appendFile(objectListPath, `${baseCommit}\n`);
		}
		await runWorkspaceInventoryCommandToFile({
			argv: [
				"git",
				"-C",
				root,
				"pack-objects",
				"--stdout",
				...retainedCommit ? [
					"--revs",
					"--thin",
					"--shallow",
					"--delta-base-offset"
				] : []
			],
			inputPath: objectListPath,
			baseEnv: params.baseEnv,
			outputPath: packPath,
			signal,
			timeoutMs: GIT_TIMEOUT_MS,
			maxOutputBytes: MAX_WORKSPACE_INVENTORY_TOTAL_BYTES
		});
		return packPath;
	} catch (error) {
		await fs.rm(objectListPath, { force: true });
		await fs.rm(packPath, { force: true });
		throw error;
	}
}
//#endregion
export { workerProjectSeedKey as i, prepareWorkerWorkspaceGitPack as n, workerLocalProjectKey as r, prepareWorkerProjectSnapshot as t };
