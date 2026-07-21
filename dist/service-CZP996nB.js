import { v as resolveStateDir } from "./paths-BMBAvkNf.js";
import { t as createSubsystemLogger } from "./subsystem-C3fiUGN1.js";
import { g as executeSqliteQuerySync, i as openOpenClawStateDatabase, o as runOpenClawStateWriteTransaction, v as getNodeSqliteKysely } from "./openclaw-state-db-CIiPwqG3.js";
import { r as runCommandWithTimeout } from "./exec-Dj7k1ich.js";
import { a as removeEmptyParents, c as runGit, i as pathExists, o as requireGit, r as listGitWorktrees, s as requireGitRaw, t as commandError } from "./git-BYAbpu1o.js";
import { constants } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import os from "node:os";
import { createHash, randomBytes, randomUUID } from "node:crypto";
//#region src/agents/worktrees/registry.ts
function dbFor(env) {
	return openOpenClawStateDatabase({ env }).db;
}
function kyselyFor(db) {
	return getNodeSqliteKysely(db);
}
function rowToRecord(row) {
	return {
		id: row.id,
		name: row.path.split(/[\\/]/).at(-1) ?? row.id,
		repoFingerprint: row.repo_fingerprint,
		repoRoot: row.repo_root,
		path: row.path,
		branch: row.branch,
		baseRef: row.base_ref,
		ownerKind: row.owner_kind,
		...row.owner_id ? { ownerId: row.owner_id } : {},
		...row.snapshot_ref ? { snapshotRef: row.snapshot_ref } : {},
		createdAt: row.created_at,
		lastActiveAt: row.last_active_at,
		...row.removed_at == null ? {} : { removedAt: row.removed_at }
	};
}
function recordToRow(record) {
	return {
		id: record.id,
		repo_fingerprint: record.repoFingerprint,
		repo_root: record.repoRoot,
		path: record.path,
		branch: record.branch,
		base_ref: record.baseRef,
		owner_kind: record.ownerKind,
		owner_id: record.ownerId ?? null,
		snapshot_ref: record.snapshotRef ?? null,
		created_at: record.createdAt,
		last_active_at: record.lastActiveAt,
		removed_at: record.removedAt ?? null
	};
}
function listRegistryWorktrees(env) {
	const db = dbFor(env);
	return executeSqliteQuerySync(db, kyselyFor(db).selectFrom("worktrees").selectAll().orderBy("created_at", "desc").orderBy("id", "asc")).rows.map(rowToRecord);
}
function getRegistryWorktree(env, id) {
	const db = dbFor(env);
	const row = executeSqliteQuerySync(db, kyselyFor(db).selectFrom("worktrees").selectAll().where("id", "=", id)).rows[0];
	return row ? rowToRecord(row) : void 0;
}
function findLiveRegistryWorktreeByPath(env, worktreePath) {
	const db = dbFor(env);
	const row = executeSqliteQuerySync(db, kyselyFor(db).selectFrom("worktrees").selectAll().where("path", "=", worktreePath).where("removed_at", "is", null).orderBy("created_at", "desc").limit(1)).rows[0];
	return row ? rowToRecord(row) : void 0;
}
function findLiveRegistryWorktreeByOwner(env, ownerKind, ownerId) {
	const db = dbFor(env);
	const row = executeSqliteQuerySync(db, kyselyFor(db).selectFrom("worktrees").selectAll().where("owner_kind", "=", ownerKind).where("owner_id", "=", ownerId).where("removed_at", "is", null).orderBy("created_at", "desc").limit(1)).rows[0];
	return row ? rowToRecord(row) : void 0;
}
function findRegistryWorktreeByPath(env, worktreePath) {
	const db = dbFor(env);
	const row = executeSqliteQuerySync(db, kyselyFor(db).selectFrom("worktrees").selectAll().where("path", "=", worktreePath).orderBy("created_at", "desc").limit(1)).rows[0];
	return row ? rowToRecord(row) : void 0;
}
function insertRegistryWorktree(env, record) {
	const db = dbFor(env);
	runOpenClawStateWriteTransaction(() => {
		executeSqliteQuerySync(db, kyselyFor(db).insertInto("worktrees").values(recordToRow(record)));
	});
}
function updateRegistryWorktree(env, id, patch) {
	const db = dbFor(env);
	const values = {};
	if (patch.lastActiveAt !== void 0) values.last_active_at = patch.lastActiveAt;
	if ("removedAt" in patch) values.removed_at = patch.removedAt ?? null;
	if ("snapshotRef" in patch) values.snapshot_ref = patch.snapshotRef ?? null;
	runOpenClawStateWriteTransaction(() => {
		executeSqliteQuerySync(db, kyselyFor(db).updateTable("worktrees").set(values).where("id", "=", id));
	});
}
function deleteRegistryWorktree(env, id) {
	const db = dbFor(env);
	runOpenClawStateWriteTransaction(() => {
		executeSqliteQuerySync(db, kyselyFor(db).deleteFrom("worktrees").where("id", "=", id));
	});
}
//#endregion
//#region src/agents/worktrees/service.ts
const IDLE_GC_MS = 10080 * 60 * 1e3;
const SNAPSHOT_RETENTION_MS = 720 * 60 * 60 * 1e3;
const WORKTREE_GC_INTERVAL_MS = 3600 * 1e3;
const NAME_PATTERN = /^[a-z0-9][a-z0-9-]{0,63}$/;
const SNAPSHOT_REF_PREFIX = "refs/openclaw/snapshots";
const OPENCLAW_LOCK_PATTERN = /^openclaw pid=(\d+)$/;
const log = createSubsystemLogger("agents/worktrees");
function resultMessage(result) {
	return (result.stderr || result.stdout).trim().split("\n").slice(-12).join("\n");
}
function validateName(name) {
	if (!NAME_PATTERN.test(name)) throw new Error("worktree name must match [a-z0-9][a-z0-9-]{0,63}");
	return name;
}
function generateName() {
	return `wt-${randomBytes(4).toString("hex")}`;
}
async function resolveRepository(repoRoot) {
	const rootResult = await runGit(await fs$1.realpath(repoRoot).catch(() => {
		throw new Error(`repository does not exist: ${repoRoot}`);
	}), ["rev-parse", "--show-toplevel"]);
	if (rootResult.code !== 0) throw new Error(`not a git checkout: ${repoRoot}`);
	const sourceRoot = await fs$1.realpath(rootResult.stdout.trim());
	const commonRaw = await requireGit(sourceRoot, ["rev-parse", "--git-common-dir"]);
	const commonDir = await fs$1.realpath(path.isAbsolute(commonRaw) ? commonRaw : path.resolve(sourceRoot, commonRaw));
	const primary = (await listGitWorktrees(sourceRoot))[0]?.path ?? sourceRoot;
	const canonicalRoot = await fs$1.realpath(primary);
	const origin = await runGit(canonicalRoot, [
		"config",
		"--get",
		"remote.origin.url"
	]);
	const originUrl = origin.code === 0 ? origin.stdout.trim() : "";
	return {
		repoRoot: canonicalRoot,
		sourceRoot,
		commonDir,
		originUrl,
		fingerprint: createHash("sha256").update(`${commonDir}\n${originUrl}`).digest("hex").slice(0, 16)
	};
}
async function resolveBase(repoRoot, baseRef) {
	if (baseRef) return {
		base: baseRef,
		remote: false
	};
	if ((await runGit(repoRoot, ["fetch", "origin"])).code === 0) {
		const remoteHead = await runGit(repoRoot, [
			"symbolic-ref",
			"--quiet",
			"--short",
			"refs/remotes/origin/HEAD"
		]);
		if (remoteHead.code === 0 && remoteHead.stdout.trim()) return {
			base: remoteHead.stdout.trim(),
			remote: true
		};
	}
	return {
		base: "HEAD",
		remote: false
	};
}
async function ensureNoSymlinkDirectory(root, relativePath) {
	const segments = relativePath.split(/[\\/]/).filter(Boolean);
	let current = root;
	for (const segment of segments.slice(0, -1)) {
		current = path.join(current, segment);
		try {
			const stat = await fs$1.lstat(current);
			if (stat.isSymbolicLink() || !stat.isDirectory()) return false;
		} catch (error) {
			if (error.code === "ENOENT") continue;
			throw error;
		}
	}
	return true;
}
async function copyIncludedFiles(repoRoot, worktreePath) {
	const includePath = path.join(repoRoot, ".worktreeinclude");
	if (!await pathExists(includePath)) return;
	const candidatesRaw = await requireGitRaw(repoRoot, [
		"ls-files",
		"--others",
		"--ignored",
		"--exclude-standard",
		"-z"
	]);
	const includedRaw = await requireGitRaw(repoRoot, [
		"ls-files",
		"--others",
		"--ignored",
		`--exclude-from=${includePath}`,
		"-z"
	]);
	const included = new Set(includedRaw.split("\0").filter(Boolean));
	for (const relativePath of candidatesRaw.split("\0").filter(Boolean)) {
		if (!included.has(relativePath) || path.isAbsolute(relativePath)) continue;
		const normalized = path.normalize(relativePath);
		if (normalized === ".." || normalized.startsWith(`..${path.sep}`)) continue;
		if (!await ensureNoSymlinkDirectory(repoRoot, normalized) || !await ensureNoSymlinkDirectory(worktreePath, normalized)) continue;
		const source = path.join(repoRoot, normalized);
		const destination = path.join(worktreePath, normalized);
		const sourceStat = await fs$1.lstat(source).catch(() => void 0);
		if (!sourceStat?.isFile() || sourceStat.isSymbolicLink()) continue;
		await fs$1.mkdir(path.dirname(destination), { recursive: true });
		await fs$1.copyFile(source, destination, constants.COPYFILE_EXCL).catch((error) => {
			if (error.code !== "EEXIST") throw error;
		});
		await fs$1.chmod(destination, sourceStat.mode);
	}
}
async function cleanupFailedCreate(repoRoot, worktreePath, branch) {
	const removed = await runGit(repoRoot, [
		"worktree",
		"remove",
		"--force",
		worktreePath
	]);
	const deletedBranch = await runGit(repoRoot, [
		"branch",
		"-D",
		branch
	]);
	await runGit(repoRoot, ["worktree", "prune"]);
	if (removed.code !== 0 || deletedBranch.code !== 0) throw new Error(`failed to clean up worktree creation: ${resultMessage(removed) || resultMessage(deletedBranch)}`);
}
async function resetFailedWorktreeAdd(repoRoot, worktreePath, branch) {
	if ((await listGitWorktrees(repoRoot)).some((entry) => path.resolve(entry.path) === path.resolve(worktreePath))) {
		const removed = await runGit(repoRoot, [
			"worktree",
			"remove",
			"--force",
			worktreePath
		]);
		if (removed.code !== 0) throw commandError("git worktree remove", removed);
	} else if (await pathExists(worktreePath)) await fs$1.rm(worktreePath, {
		recursive: true,
		force: true
	});
	if ((await runGit(repoRoot, [
		"show-ref",
		"--quiet",
		"--verify",
		`refs/heads/${branch}`
	])).code === 0) await requireGit(repoRoot, [
		"branch",
		"-D",
		branch
	]);
	await requireGit(repoRoot, ["worktree", "prune"]);
}
async function canResetFailedWorktreeAdd(repoRoot, worktreePath, branch, failure) {
	const message = resultMessage(failure);
	const createdBranch = message.includes(`Preparing worktree (new branch '${branch}')`);
	if (message.includes("unable to checkout working tree") || createdBranch) return true;
	if ((await listGitWorktrees(repoRoot)).some((entry) => path.resolve(entry.path) === path.resolve(worktreePath)) || await pathExists(worktreePath)) return false;
	return (await runGit(repoRoot, [
		"show-ref",
		"--quiet",
		"--verify",
		`refs/heads/${branch}`
	])).code === 1;
}
async function runSetupScript(repoRoot, worktreePath) {
	const setupScript = path.join(repoRoot, ".openclaw", "worktree-setup.sh");
	const stat = await fs$1.stat(setupScript).catch(() => void 0);
	if (!stat?.isFile() || (stat.mode & 73) === 0) return;
	const result = await runCommandWithTimeout([setupScript], {
		timeoutMs: 12e4,
		cwd: worktreePath,
		env: {
			OPENCLAW_SOURCE_TREE_PATH: repoRoot,
			OPENCLAW_WORKTREE_PATH: worktreePath
		}
	});
	if (result.code !== 0) throw new Error(`worktree setup failed${resultMessage(result) ? `:\n${resultMessage(result)}` : ""}`);
}
function processIsAlive(pid) {
	try {
		process.kill(pid, 0);
		return true;
	} catch (error) {
		return error.code === "EPERM";
	}
}
async function lockState(record) {
	const entry = (await listGitWorktrees(record.repoRoot)).find((candidate) => path.resolve(candidate.path) === path.resolve(record.path));
	if (!entry || entry.lockedReason === void 0) return { kind: "none" };
	const match = OPENCLAW_LOCK_PATTERN.exec(entry.lockedReason);
	if (!match) return {
		kind: "foreign",
		reason: entry.lockedReason
	};
	const pid = Number(match[1]);
	return processIsAlive(pid) ? {
		kind: "live",
		pid
	} : {
		kind: "dead",
		pid
	};
}
async function snapshotWorktree(record, reason) {
	const tempDir = await fs$1.mkdtemp(path.join(os.tmpdir(), "openclaw-worktree-index-"));
	const indexPath = path.join(tempDir, "index");
	const snapshotRef = `${SNAPSHOT_REF_PREFIX}/${record.id}`;
	const env = {
		GIT_INDEX_FILE: indexPath,
		GIT_AUTHOR_NAME: "OpenClaw",
		GIT_AUTHOR_EMAIL: "openclaw@localhost",
		GIT_COMMITTER_NAME: "OpenClaw",
		GIT_COMMITTER_EMAIL: "openclaw@localhost"
	};
	try {
		await requireGit(record.path, ["read-tree", "HEAD"], { env });
		await requireGit(record.path, ["add", "-A"], { env });
		const tree = await requireGit(record.path, ["write-tree"], { env });
		if ((await requireGit(record.path, [
			"ls-tree",
			"-r",
			tree
		])).split("\n").some((entry) => entry.startsWith("160000 "))) throw new Error("nested git repositories cannot be snapshotted losslessly");
		const parent = await requireGit(record.path, ["rev-parse", "HEAD"]);
		const commit = await requireGit(record.path, [
			"commit-tree",
			tree,
			"-p",
			parent,
			"-m",
			`OpenClaw worktree snapshot: ${reason}`
		], { env });
		await requireGit(record.repoRoot, [
			"update-ref",
			snapshotRef,
			commit
		]);
		return snapshotRef;
	} finally {
		await fs$1.rm(tempDir, {
			recursive: true,
			force: true
		});
	}
}
var ManagedWorktreeService = class {
	constructor(options = {}) {
		this.env = options.env ?? process.env;
		this.now = options.now ?? Date.now;
	}
	async create(params) {
		const repository = await resolveRepository(params.repoRoot);
		const name = validateName(params.name ?? generateName());
		const root = path.join(resolveStateDir(this.env), "worktrees", repository.fingerprint);
		const worktreePath = path.join(root, name);
		const existing = findRegistryWorktreeByPath(this.env, worktreePath);
		if (existing?.name === name && existing.removedAt === void 0) {
			if (await pathExists(existing.path)) return existing;
			updateRegistryWorktree(this.env, existing.id, { removedAt: this.now() });
		}
		if (existing?.name === name && existing.removedAt !== void 0 && existing.snapshotRef) return await this.restore({ id: existing.id });
		await fs$1.mkdir(root, { recursive: true });
		const branch = `openclaw/${name}`;
		const branchExists = await runGit(repository.repoRoot, [
			"show-ref",
			"--quiet",
			"--verify",
			`refs/heads/${branch}`
		]);
		if (branchExists.code === 0) throw new Error(`branch already exists: ${branch}`);
		if (branchExists.code !== 1) throw commandError("git show-ref --verify", branchExists);
		const base = await resolveBase(repository.repoRoot, params.baseRef);
		let usedBase = base.base;
		let added = await runGit(repository.repoRoot, [
			"worktree",
			"add",
			worktreePath,
			"-b",
			branch,
			usedBase
		]);
		if (added.code !== 0 && base.remote) {
			if (!await canResetFailedWorktreeAdd(repository.repoRoot, worktreePath, branch, added)) throw commandError("git worktree add", added);
			await resetFailedWorktreeAdd(repository.repoRoot, worktreePath, branch);
			usedBase = "HEAD";
			added = await runGit(repository.repoRoot, [
				"worktree",
				"add",
				worktreePath,
				"-b",
				branch,
				usedBase
			]);
		}
		if (added.code !== 0) throw commandError("git worktree add", added);
		try {
			await copyIncludedFiles(repository.sourceRoot, worktreePath);
			if (params.runSetupScript !== false) await runSetupScript(repository.sourceRoot, worktreePath);
		} catch (error) {
			try {
				await cleanupFailedCreate(repository.repoRoot, worktreePath, branch);
			} catch (cleanupError) {
				throw new Error(`${String(error)}\n${String(cleanupError)}`, { cause: cleanupError });
			}
			throw error;
		}
		const createdAt = this.now();
		const record = {
			id: randomUUID(),
			name,
			repoFingerprint: repository.fingerprint,
			repoRoot: repository.repoRoot,
			path: worktreePath,
			branch,
			baseRef: usedBase,
			ownerKind: params.ownerKind ?? "manual",
			...params.ownerId ? { ownerId: params.ownerId } : {},
			createdAt,
			lastActiveAt: createdAt
		};
		insertRegistryWorktree(this.env, record);
		return record;
	}
	async list() {
		const records = listRegistryWorktrees(this.env);
		for (const record of records) if (record.removedAt === void 0 && !await pathExists(record.path)) {
			const removedAt = this.now();
			updateRegistryWorktree(this.env, record.id, { removedAt });
			record.removedAt = removedAt;
		}
		return records.filter((record) => record.removedAt === void 0 || record.snapshotRef);
	}
	findLiveByOwner(ownerKind, ownerId) {
		return findLiveRegistryWorktreeByOwner(this.env, ownerKind, ownerId);
	}
	async acquire(id) {
		const record = this.requireLiveRecord(id);
		const result = await runGit(record.repoRoot, [
			"worktree",
			"lock",
			"--reason",
			`openclaw pid=${process.pid}`,
			record.path
		]);
		if (result.code !== 0) {
			const state = await lockState(record);
			if (state.kind !== "live" || state.pid !== process.pid) throw commandError("git worktree lock", result);
		}
		const lastActiveAt = this.now();
		updateRegistryWorktree(this.env, id, { lastActiveAt });
		return {
			...record,
			lastActiveAt
		};
	}
	async release(id) {
		const record = getRegistryWorktree(this.env, id);
		if (!record || record.removedAt !== void 0 || !await pathExists(record.path)) return;
		const state = await lockState(record);
		if (state.kind === "live" && state.pid !== process.pid) return;
		if (state.kind === "foreign") return;
		if (state.kind !== "none") {
			const result = await runGit(record.repoRoot, [
				"worktree",
				"unlock",
				record.path
			]);
			if (result.code !== 0) throw commandError("git worktree unlock", result);
		}
	}
	async remove(params) {
		const record = this.requireLiveRecord(params.id);
		const state = await lockState(record);
		if ((state.kind === "live" || state.kind === "foreign") && !params.force) throw new Error(state.kind === "live" ? `worktree is locked by live OpenClaw pid ${state.pid}` : `worktree has a foreign lock${state.reason ? `: ${state.reason}` : ""}`);
		if (state.kind !== "none") await requireGit(record.repoRoot, [
			"worktree",
			"unlock",
			record.path
		]);
		let snapshotRef = record.snapshotRef;
		let snapshotError;
		try {
			snapshotRef = await snapshotWorktree(record, params.reason);
			updateRegistryWorktree(this.env, record.id, { snapshotRef });
		} catch (error) {
			snapshotError = error instanceof Error ? error.message : String(error);
			if (!params.force) throw new Error(`worktree snapshot failed; removal aborted: ${snapshotError}`, { cause: error });
		}
		const removed = await runGit(record.repoRoot, [
			"worktree",
			"remove",
			"--force",
			record.path
		]);
		if (removed.code !== 0) throw commandError("git worktree remove", removed);
		const branchDelete = await runGit(record.repoRoot, [
			"branch",
			"-D",
			record.branch
		]);
		if (branchDelete.code !== 0) throw commandError("git branch -D", branchDelete);
		await requireGit(record.repoRoot, ["worktree", "prune"]);
		await removeEmptyParents(path.dirname(record.path), path.join(resolveStateDir(this.env), "worktrees"));
		const removedAt = this.now();
		updateRegistryWorktree(this.env, record.id, {
			removedAt,
			snapshotRef
		});
		return {
			removed: true,
			...snapshotRef ? { snapshotRef } : {},
			...snapshotError ? { snapshotError } : {}
		};
	}
	async restore(params) {
		const record = getRegistryWorktree(this.env, params.id);
		if (!record?.snapshotRef || record.removedAt === void 0) throw new Error(`worktree ${params.id} is not restorable`);
		if (!await pathExists(record.repoRoot)) throw new Error(`source repository no longer exists: ${record.repoRoot}`);
		const parent = await requireGit(record.repoRoot, ["rev-parse", `${record.snapshotRef}^`]);
		await fs$1.mkdir(path.dirname(record.path), { recursive: true });
		await requireGit(record.repoRoot, [
			"worktree",
			"add",
			"--detach",
			record.path,
			record.snapshotRef
		]);
		let branchCreated = false;
		try {
			await requireGit(record.repoRoot, [
				"branch",
				record.branch,
				parent
			]);
			branchCreated = true;
			await requireGit(record.path, [
				"symbolic-ref",
				"HEAD",
				`refs/heads/${record.branch}`
			]);
			await requireGit(record.path, ["reset"]);
			await copyIncludedFiles(record.repoRoot, record.path);
		} catch (error) {
			const removed = await runGit(record.repoRoot, [
				"worktree",
				"remove",
				"--force",
				record.path
			]);
			const branchDeleted = branchCreated ? await runGit(record.repoRoot, [
				"branch",
				"-D",
				record.branch
			]) : void 0;
			if (removed.code !== 0 || branchDeleted && branchDeleted.code !== 0) throw new Error(`${String(error)}\nrestore cleanup failed: ${resultMessage(removed) || (branchDeleted ? resultMessage(branchDeleted) : "")}`, { cause: error });
			throw error;
		}
		const lastActiveAt = this.now();
		updateRegistryWorktree(this.env, params.id, {
			removedAt: void 0,
			lastActiveAt
		});
		const restored = {
			...record,
			lastActiveAt
		};
		delete restored.removedAt;
		return restored;
	}
	async removeIfLossless(id) {
		const record = this.requireLiveRecord(id);
		const status = await requireGit(record.path, ["status", "--porcelain"]);
		const unpushed = await requireGit(record.path, [
			"log",
			"HEAD",
			"--not",
			"--remotes",
			"--oneline"
		]);
		await this.release(id);
		if (status || unpushed) return false;
		await this.remove({
			id,
			reason: "run-end"
		});
		return true;
	}
	async removeIfLosslessByPath(worktreePath) {
		const record = findLiveRegistryWorktreeByPath(this.env, worktreePath);
		if (!record) return false;
		return await this.removeIfLossless(record.id);
	}
	async releaseByPath(worktreePath) {
		const record = findLiveRegistryWorktreeByPath(this.env, worktreePath);
		if (record) await this.release(record.id);
	}
	async gc(params = {}) {
		const now = this.now();
		const removed = [];
		const records = listRegistryWorktrees(this.env);
		for (const record of records) try {
			if (record.removedAt === void 0 && !await pathExists(record.path)) {
				updateRegistryWorktree(this.env, record.id, { removedAt: now });
				record.removedAt = now;
			}
			const expiresWhenIdle = record.ownerKind === "workboard" || record.ownerKind === "session";
			if (record.removedAt === void 0 && expiresWhenIdle && now - record.lastActiveAt > 6048e5) {
				if (record.ownerId !== void 0 && params.isOwnerActive?.(record.ownerKind, record.ownerId) === true) continue;
				const state = await lockState(record);
				if (state.kind === "live" || state.kind === "foreign") continue;
				if (state.kind === "dead") await requireGit(record.repoRoot, [
					"worktree",
					"unlock",
					record.path
				]);
				await this.remove({
					id: record.id,
					reason: "idle-gc"
				});
				removed.push(record.id);
			}
		} catch (error) {
			log.warn(`idle cleanup failed for ${record.id}: ${String(error)}`);
		}
		const orphansDeleted = await this.reconcileOrphans(records);
		let snapshotsPruned = 0;
		for (const record of listRegistryWorktrees(this.env)) {
			if (record.removedAt === void 0 || now - record.removedAt <= 2592e6) continue;
			try {
				if (record.snapshotRef && await pathExists(record.repoRoot)) await requireGit(record.repoRoot, [
					"update-ref",
					"-d",
					record.snapshotRef
				]);
				deleteRegistryWorktree(this.env, record.id);
				snapshotsPruned += 1;
			} catch (error) {
				log.warn(`snapshot retention failed for ${record.id}: ${String(error)}`);
			}
		}
		return {
			removed,
			orphansDeleted,
			snapshotsPruned
		};
	}
	requireLiveRecord(id) {
		const record = getRegistryWorktree(this.env, id);
		if (!record || record.removedAt !== void 0) throw new Error(`unknown active worktree: ${id}`);
		return record;
	}
	async reconcileOrphans(records) {
		const managedPaths = new Set(records.map((record) => path.resolve(record.path)));
		const worktreesRoot = path.join(resolveStateDir(this.env), "worktrees");
		const fingerprints = await fs$1.readdir(worktreesRoot, { withFileTypes: true }).catch(() => []);
		let deleted = 0;
		for (const fingerprint of fingerprints) {
			if (!fingerprint.isDirectory()) continue;
			const fingerprintPath = path.join(worktreesRoot, fingerprint.name);
			const names = await fs$1.readdir(fingerprintPath, { withFileTypes: true }).catch(() => []);
			for (const name of names) {
				if (!name.isDirectory()) continue;
				const candidate = path.join(fingerprintPath, name.name);
				if (managedPaths.has(path.resolve(candidate))) continue;
				const repository = await resolveRepository(candidate).catch(() => void 0);
				if (repository) {
					if ((await listGitWorktrees(repository.repoRoot).catch(() => [])).some((entry) => path.resolve(entry.path) === path.resolve(candidate))) continue;
				}
				await fs$1.rm(candidate, {
					recursive: true,
					force: true
				});
				deleted += 1;
			}
			await fs$1.rmdir(fingerprintPath).catch(() => void 0);
		}
		return deleted;
	}
};
const managedWorktrees = new ManagedWorktreeService();
//#endregion
export { managedWorktrees as a, WORKTREE_GC_INTERVAL_MS as i, ManagedWorktreeService as n, SNAPSHOT_RETENTION_MS as r, IDLE_GC_MS as t };
