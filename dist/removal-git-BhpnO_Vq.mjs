import { r as isMissingPathError, t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { i as withChildProcessOperation } from "./spawn-diagnostics-CvEKrJ76.mjs";
import { a as WorktreeRemovalLockError, i as WorktreeRemovalContentionError } from "./errors-WYf-uyBk.mjs";
import { i as runCommandWithTimeout } from "./exec-Bf6uhUA7.mjs";
import { a as runOutsideCommandProcessScope } from "./exec-spawn-Cn2m7YAI.mjs";
import { d as normalizeGitPathForFilesystem, r as createGitCommandError } from "./git-exec-CvORirty.mjs";
import { c as resolveGitMetadataPath, i as listGitWorktrees, o as requireGit, p as worktreePathExists, t as WORKTREE_CHECKOUT_TIMEOUT_MS, u as runGit } from "./git-CljZIJM8.mjs";
import { n as withContentGitSlot } from "./git-worker-DahANBH3.mjs";
import { lstatSync } from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import fs$1 from "node:fs/promises";
import path from "node:path";
//#region src/agents/worktrees/removal-errors.ts
function isWorktreePermissionError(error) {
	return hasErrnoCode(error, "EACCES") || hasErrnoCode(error, "EPERM");
}
var WorktreeBranchMovedError = class extends Error {};
function isWorktreeRepositoryCorruptionError(error) {
	for (let cause = error; cause instanceof Error; cause = cause.cause) if (/(?:invalid object \d{6} [a-f0-9]{40,64}|not a tree object|(?:loose )?object [^\n]+ (?:is corrupt|is empty)|unable to (?:read|unpack) (?:[a-f0-9]{40,64}|[^\n]*(?:object|tree))|could not fetch [a-f0-9]{40,64} from promisor remote|missing (?:blob|tree|commit) [a-f0-9]{40,64}|packfile [^\n]+ (?:does not match|is truncated))/iu.test(cause.message)) return true;
	return false;
}
/** Removal aborted because snapshot loss was not permitted. */
var WorktreeSnapshotError = class extends Error {
	constructor(snapshotError, options) {
		super(`worktree snapshot failed; removal aborted: ${snapshotError}`, options);
		this.snapshotError = snapshotError;
	}
};
function classifyWorktreeRemovalError(error) {
	if (error instanceof WorktreeRemovalContentionError) return "busy";
	if (error instanceof WorktreeRemovalLockError) return error.kind;
	if (error instanceof WorktreeSnapshotError) return "snapshot-failed";
	return "cleanup-failed";
}
//#endregion
//#region src/agents/worktrees/orphan-paths.ts
async function canonicalPathKey(target) {
	const canonical = await fs$1.realpath(target);
	return process.platform === "win32" ? canonical.toLowerCase() : canonical;
}
async function resolveManagedWorktreePathKeys(records) {
	const managedPaths = /* @__PURE__ */ new Set();
	for (const record of records) try {
		managedPaths.add(await canonicalPathKey(record.path));
	} catch (error) {
		if (isWorktreePermissionError(error)) return;
		if (!isMissingPathError(error)) throw error;
	}
	return managedPaths;
}
async function shouldPreserveOrphanCandidate(target, managedPaths, customRoots) {
	if (/^\.openclaw-retiring-[a-f0-9-]{36}$/u.test(path.basename(target))) return true;
	const targetKey = await canonicalPathKey(target);
	if (managedPaths.has(targetKey) || [...customRoots].some((root) => isPathInside(root, targetKey) || isPathInside(targetKey, root))) return true;
	return await worktreePathExists(path.join(target, ".git"));
}
//#endregion
//#region src/agents/worktrees/removal-git.ts
const log = createSubsystemLogger("agents/worktrees");
let checkoutDeletion = Promise.resolve();
function missingPathOrThrow(error) {
	if (!isMissingPathError(error)) throw error;
}
async function requireManagedWorktreeHead(record, options) {
	const branch = await runGit(record.path, [
		"symbolic-ref",
		"--quiet",
		"HEAD"
	], options);
	if (branch.code !== 0 && branch.code !== 1) throw createGitCommandError("git symbolic-ref --quiet HEAD", branch);
	if (branch.code !== 0 || branch.stdout.trim() !== `refs/heads/${record.branch}`) throw new WorktreeBranchMovedError(`Worktree HEAD no longer owns ${record.branch}; checkout and branch preserved.`);
	return await requireGit(record.path, [
		"rev-parse",
		"--verify",
		"HEAD^{commit}"
	], options);
}
/** Keep native branch deletion's ancestry and checked-out-elsewhere checks. */
async function prepareSnapshotBranchDeletion(record, snapshotRef, snapshot, options) {
	const merges = await runGit(record.repoRoot, [
		"config",
		"--get-all",
		`branch.${record.branch}.merge`
	], options);
	if (merges.code !== 0 && merges.code !== 1) throw createGitCommandError("git config --get-all", merges);
	const source = merges.code === 0 ? merges.stdout.split("\n")[0] : snapshotRef;
	await requireGit(record.repoRoot, ["check-ref-format", source], options);
	const remote = `openclaw-removal-${randomUUID()}`;
	const config = [
		`branch.${record.branch}.remote=${remote}`,
		`remote.${remote}.fetch=+${source}:${snapshotRef}`,
		...merges.code === 1 ? [`branch.${record.branch}.merge=${source}`] : []
	];
	const deletionOptions = {
		...options,
		env: {
			...options?.env,
			GIT_CONFIG_PARAMETERS: config.map((value) => `'${value.replaceAll("'", "'\\''")}'`).join(" ")
		}
	};
	if (await requireGit(record.repoRoot, [
		"rev-parse",
		"--verify",
		`${record.branch}@{upstream}^{commit}`
	], deletionOptions) !== snapshot) throw new Error(`Cannot bind branch cleanup to ${snapshotRef}; checkout preserved.`);
	return deletionOptions;
}
/** Join admitted deletion through its own deadline, independently of caller cancellation. */
async function removeManagedCheckout(record, git, requireLossless, budget, assertCurrent, queueSignal) {
	await withContentGitSlot(() => runOutsideCommandProcessScope(async () => {
		const options = {
			beforeRun: assertCurrent,
			killProcessTree: true,
			lowerPriority: true,
			...budget === "recovery" ? { waitForExit: true } : { timeoutMs: WORKTREE_CHECKOUT_TIMEOUT_MS }
		};
		const remove = async () => {
			const result = await git.run(record.repoRoot, [
				"worktree",
				"remove",
				...requireLossless ? [] : ["--force"],
				"--",
				record.path
			], options);
			if (result.termination !== "exit" || result.code !== 0) throw createGitCommandError("git worktree remove", result);
		};
		if (requireLossless || budget === "recovery") return await remove();
		const link = await fs$1.readFile(path.join(record.path, ".git"));
		const retired = path.join(path.dirname(record.path), `.openclaw-removing-${randomUUID()}`);
		let renamed = false;
		let stub = false;
		try {
			assertCurrent?.();
			await fs$1.rename(record.path, retired);
			renamed = true;
			await fs$1.mkdir(record.path);
			stub = true;
			await fs$1.writeFile(path.join(record.path, ".git"), link, { flag: "wx" });
			await remove();
		} catch (error) {
			if (renamed) {
				if (stub) {
					await fs$1.unlink(path.join(record.path, ".git")).catch(missingPathOrThrow);
					await fs$1.rmdir(record.path).catch(missingPathOrThrow);
				}
				await fs$1.rename(retired, record.path);
			}
			throw error;
		}
		checkoutDeletion = checkoutDeletion.then(async () => {
			await fs$1.unlink(path.join(retired, ".git")).catch(missingPathOrThrow);
			const argv = [
				process.execPath,
				"-e",
				"require(\"node:fs\").rmSync(process.argv[1], { recursive: true, force: true })",
				retired
			];
			const deleted = await withChildProcessOperation("worktree.cleanup", () => runCommandWithTimeout(process.platform === "win32" ? argv : [
				"nice",
				"-n",
				"10",
				...argv
			], {
				timeoutMs: WORKTREE_CHECKOUT_TIMEOUT_MS,
				killProcessTree: true
			}));
			if (deleted.termination !== "exit" || deleted.code !== 0) throw new Error(deleted.stderr || "Retired checkout deletion did not complete");
		}).catch((error) => log.warn(`Retired checkout cleanup failed at ${retired}: ${String(error)}`));
	}), queueSignal);
}
/** Explicit detached retirement never grants ownership of another symbolic branch. */
async function requireExactManagedWorktreeHead(record, expected, options) {
	assertExactStateOwner(record, expected);
	if ((await runGit(record.path, [
		"symbolic-ref",
		"--quiet",
		"HEAD"
	], options)).code !== 1) throw new Error("Exact-state retirement requires detached HEAD; checkout preserved");
	const head = await requireGit(record.path, [
		"rev-parse",
		"--verify",
		"HEAD^{commit}"
	], options);
	const branchHead = await requireGit(record.repoRoot, [
		"rev-parse",
		"--verify",
		`refs/heads/${record.branch}^{commit}`
	], options);
	if (head !== expected.head || branchHead !== expected.branchHead) throw new Error("Worktree HEAD or recorded branch changed; checkout preserved");
	return head;
}
function assertExactStateOwner(record, expected) {
	if (record.removedAt !== void 0 || record.ownerKind !== expected.ownerKind || record.ownerId !== expected.ownerId || record.createdAt !== expected.createdAt || record.lastActiveAt !== expected.lastActiveAt) throw new Error("Worktree exact-state owner or lifecycle changed; checkout preserved");
}
/** Hold Git's own file-ref/index exclusion points through verification and deletion. */
async function withExactStateGitLocks(record, assertCurrent, run, additionalRefs = []) {
	const options = {
		beforeRun: assertCurrent,
		killProcessTree: true
	};
	const storage = await runGit(record.repoRoot, [
		"config",
		"--get",
		"extensions.refStorage"
	], options);
	if (storage.code !== 1 && (storage.code !== 0 || storage.stdout.trim() !== "files")) throw new Error("Exact-state retirement requires Git file refs; source preserved");
	const held = [];
	try {
		for (const name of [
			"index",
			"HEAD",
			`refs/heads/${record.branch}`,
			...additionalRefs
		]) {
			const target = await resolveGitMetadataPath(record.path, name, options) + ".lock";
			assertCurrent();
			await fs$1.mkdir(path.dirname(target), { recursive: true });
			assertCurrent();
			const handle = await fs$1.open(target, "wx", 384);
			const stat = await handle.stat();
			held.push({
				path: target,
				handle,
				dev: stat.dev,
				ino: stat.ino
			});
		}
		assertCurrent();
		return await run();
	} finally {
		for (const lock of held.toReversed()) {
			await lock.handle.close();
			const current = await fs$1.lstat(lock.path).catch(missingPathOrThrow);
			if (current?.dev === lock.dev && current.ino === lock.ino) await fs$1.unlink(lock.path);
		}
	}
}
/** Archive the original inode tree: Git locks cannot revoke pre-existing workfile writers. */
async function retireExactWorktree(params) {
	const { record, git } = params;
	const destination = path.join(path.dirname(record.path), params.retirementName);
	const source = await fs$1.lstat(record.path);
	if (!source.isDirectory()) throw new Error("Exact-state source is no longer a directory; source preserved");
	if (await fs$1.lstat(destination).catch(missingPathOrThrow)) throw new Error("Exact-state retirement destination is occupied; source preserved");
	await git.require(record.repoRoot, [
		"worktree",
		"move",
		"--",
		record.path,
		destination
	], {
		signal: params.signal,
		beforeRun: params.assertCurrent,
		killProcessTree: true
	});
	const moved = await fs$1.lstat(destination);
	if (moved.dev !== source.dev || moved.ino !== source.ino) throw new Error("Exact-state source identity changed; quarantined source and recovery snapshot preserved");
	let retired = false;
	try {
		const quarantined = {
			...record,
			path: destination
		};
		return await withExactStateGitLocks(quarantined, params.assertCurrent, async () => {
			await params.verify(quarantined);
			params.signal?.throwIfAborted();
			params.assertCurrent();
			retired = true;
			return await params.finalize(destination);
		});
	} catch (error) {
		if (!retired) try {
			for (const args of [[
				"worktree",
				"move",
				"--",
				destination,
				record.path
			], [
				"update-ref",
				"-d",
				`refs/openclaw/removals/${record.id}`,
				params.snapshot
			]]) await requireGit(record.repoRoot, args, {
				beforeRun: params.assertRollbackCurrent,
				killProcessTree: true
			});
		} catch (rollbackError) {
			throw new AggregateError([error, rollbackError], `Exact-state retirement stopped; source retained at ${destination} and recovery snapshot preserved`, { cause: rollbackError });
		}
		throw error;
	}
}
/** Synchronous admission/finalization fence after asynchronous native checks. */
function assertExactStateSourceIdentity(target, metadata) {
	const stat = lstatSync(target, {
		bigint: true,
		throwIfNoEntry: false
	});
	if (!stat?.isDirectory() || stat.dev.toString() !== metadata.sourceIdentity.device || stat.ino.toString() !== metadata.sourceIdentity.inode) throw new Error("Retained exact-state source identity changed; sources and snapshot preserved");
}
async function requireExactWorktreeRepository(record, sourcePath, options) {
	const commonAt = async (cwd) => await canonicalPathKey(path.resolve(cwd, normalizeGitPathForFilesystem(await requireGit(cwd, ["rev-parse", "--git-common-dir"], options))));
	if (await commonAt(sourcePath) !== await commonAt(record.repoRoot)) throw new Error("Retained exact-state repository changed; source preserved");
}
async function hasExactWorktreeIndex(sourcePath, metadata, options) {
	const index = await resolveGitMetadataPath(sourcePath, "index", options);
	const original = await fs$1.readFile(index).catch(missingPathOrThrow);
	if (!original) return false;
	if (createHash("sha256").update(original).digest("hex") !== metadata.indexSha256) throw new Error("Retained exact-state index changed; source and snapshot preserved");
	if (metadata.sharedIndex) {
		const bytes = await fs$1.readFile(path.join(path.dirname(index), metadata.sharedIndex.name)).catch(missingPathOrThrow);
		if ((bytes && createHash(metadata.head.length === 64 ? "sha256" : "sha1").update(`blob ${bytes.length}\0`).update(bytes).digest("hex")) !== metadata.sharedIndex.blob) throw new Error("Retained exact-state shared index changed; source and snapshot preserved");
	}
	return true;
}
/** Both restore routes verify repository and detached HEAD while retaining native Git locks. */
async function withExactSnapshotRestore(record, metadata, options, assertCurrent, restore) {
	await requireExactWorktreeRepository(record, record.path, options);
	const live = {
		...record,
		removedAt: void 0
	};
	return await withExactStateGitLocks(live, assertCurrent, async () => {
		await requireExactManagedWorktreeHead(live, {
			...record,
			...metadata
		}, options);
		return await restore();
	});
}
/** Prefer the retained original tree, preserving even writes through old descriptors. */
async function restoreRetiredExactWorktree(params) {
	const { record, metadata, options, assertCurrent } = params;
	const retained = path.join(path.dirname(record.path), metadata.retirementName);
	const statAt = async (target) => await fs$1.lstat(target, { bigint: true }).catch(missingPathOrThrow);
	const [retainedStat, liveStat, registrations] = await Promise.all([
		statAt(retained),
		statAt(record.path),
		listGitWorktrees(record.repoRoot)
	]);
	const retainedRegistered = registrations.some((entry) => entry.path === retained);
	const liveRegistered = registrations.some((entry) => entry.path === record.path);
	if (!retainedStat && !retainedRegistered && !liveRegistered && (!liveStat || liveStat.isDirectory() && (await fs$1.readdir(record.path)).length === 0)) return;
	if ((retainedStat || retainedRegistered) && (liveStat || liveRegistered)) throw new Error("Exact-state live path is occupied; both sources and snapshot preserved");
	const alreadyMoved = !retainedStat && !retainedRegistered;
	const sourcePath = alreadyMoved ? record.path : retained;
	const stat = alreadyMoved ? liveStat : retainedStat;
	const registered = alreadyMoved ? liveRegistered : retainedRegistered;
	if (!stat?.isDirectory() || !registered || stat.dev.toString() !== metadata.sourceIdentity.device || stat.ino.toString() !== metadata.sourceIdentity.inode) throw new Error("Retained exact-state source identity or registration changed; source preserved");
	return await withExactSnapshotRestore({
		...record,
		path: sourcePath
	}, metadata, options, assertCurrent, async () => {
		if (!await hasExactWorktreeIndex(sourcePath, metadata, options)) throw new Error("Retained exact-state index missing; source and snapshot preserved");
		const beforeMove = () => {
			assertCurrent();
			assertExactStateSourceIdentity(sourcePath, metadata);
		};
		await params.admitCapacity([
			record.repoRoot,
			record.path,
			sourcePath
		]);
		beforeMove();
		if (!alreadyMoved) await requireGit(record.repoRoot, [
			"worktree",
			"move",
			"--",
			retained,
			record.path
		], {
			beforeRun: beforeMove,
			killProcessTree: true
		});
		assertCurrent();
		assertExactStateSourceIdentity(record.path, metadata);
		return await params.finalize();
	});
}
//#endregion
export { WorktreeSnapshotError as _, removeManagedCheckout as a, isWorktreeRepositoryCorruptionError as b, requireManagedWorktreeHead as c, withExactSnapshotRestore as d, withExactStateGitLocks as f, WorktreeBranchMovedError as g, shouldPreserveOrphanCandidate as h, prepareSnapshotBranchDeletion as i, restoreRetiredExactWorktree as l, resolveManagedWorktreePathKeys as m, assertExactStateSourceIdentity as n, requireExactManagedWorktreeHead as o, canonicalPathKey as p, hasExactWorktreeIndex as r, requireExactWorktreeRepository as s, assertExactStateOwner as t, retireExactWorktree as u, classifyWorktreeRemovalError as v, isWorktreePermissionError as y };
