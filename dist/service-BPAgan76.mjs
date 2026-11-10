import { t as containsAsciiControlCharacter } from "./string-normalization-D6DKCpwE.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as isMissingPathError, t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { i as resolveRuntimeWorkerUrl, n as resolveRuntimeWorkerArgv } from "./runtime-worker-url-CvMrvFI1.mjs";
import { t as mergeProcessEnv } from "./process-env-BNjOnVtu.mjs";
import { Fn as object, Jn as string, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as runtimeProcessEntrypoints } from "./runtime-process-entrypoints-BMmG9cQl.mjs";
import { s as writeFileWindowFully } from "./file-descriptor-BWLpOgrg.mjs";
import { i as withChildProcessOperation } from "./spawn-diagnostics-CvEKrJ76.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-6Z4UiMS4.mjs";
import { a as WorktreeRemovalLockError, i as WorktreeRemovalContentionError, r as WorktreePendingContentionError, s as hasWorktreeUnknownOutcome } from "./errors-WYf-uyBk.mjs";
import { n as OpenClawStateLeaseError } from "./openclaw-state-lease-error-BPKnfJ8N.mjs";
import { c as SqliteWorkerError, u as hasSqliteWorkerOutcomeUnknown } from "./sqlite-worker-contract-DhDutMia.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import "./openclaw-state-lease-B69mLcu_.mjs";
import { t as createCommandError } from "./command-error-B2V3e5UN.mjs";
import "./config-B3oiWDlr.mjs";
import { i as runCommandWithTimeout, r as runCommandBuffersWithTimeout } from "./exec-Bf6uhUA7.mjs";
import { a as runOutsideCommandProcessScope } from "./exec-spawn-Cn2m7YAI.mjs";
import { d as normalizeGitPathForFilesystem, g as startGitOperationTiming, i as enqueueGitRefMutation, l as gitNullConfigPath, n as GitCommandTimeoutError, p as requireGitCommandOutput, r as createGitCommandError } from "./git-exec-CvORirty.mjs";
import { a as lstatIfExists, c as resolveGitMetadataPath, i as listGitWorktrees, o as requireGit, p as worktreePathExists, s as requireGitBuffer, t as WORKTREE_CHECKOUT_TIMEOUT_MS, u as runGit } from "./git-CljZIJM8.mjs";
import { n as withContentGitSlot, t as runGitWorkerOperation } from "./git-worker-DahANBH3.mjs";
import { t as runGitReadOperation } from "./git-read-cache-BHZXzsG8.mjs";
import { a as withWorktreeMutationLease, f as directorySizeBytes, g as retryWorktreeCapacityReleases, h as requireAllocationSpace, i as withWorktreeAllocationLease, l as reservePendingWorktree, m as estimateWorktreeGitBytes, o as readPendingWorktrees, p as estimateWorktreeCheckoutTransitionBytes, s as readWorktreeSlotCount, u as WORKTREE_SETUP_HEADROOM_BYTES } from "./allocation-qJnLlg7h.mjs";
import { a as withWorktreePreparationTiming, i as timeWorktreePreparationPhase, n as setWorktreePreparationTemplate } from "./preparation-timing-BalEUWpk.mjs";
import { c as withWorktreeRunEnd, i as captureWorktreeRunEndContext, o as retainWorktreeRunEndFailure, r as captureWorktreeRegistryMutation } from "./run-end-lifecycle-DPl2TsZ4.mjs";
import { i as runWorktreeRegistryCommand, r as finalizeWorktreeRemovalRows, t as abortWorktreeRemovalRow } from "./registry-run-end-C_3vIy6v.mjs";
import { a as reapWorktreeRunLeases, c as lockState, i as withGitLockTransition, l as lockWorktreeForProcess, n as claimWorktreeRemoval, o as assertManagedWorktreeRemovalComplete, s as createWorktreeGcPrefilter, u as unlockWorktree } from "./run-lease-D02SNP3d.mjs";
import { a as prepareWorktreeRegistryGuard, c as readLiveRegistryWorktreeByPath, d as readRegistryWorktreeForMutation, f as readRegistryWorktrees, h as requireActiveWorktreeRecord, i as getRegistryWorktreeProvisionedState, l as readLiveRegistryWorktreeIds, m as readWorktreeCleanupState, n as getRegistryWorktreeProvisionedChunk, r as getRegistryWorktreeProvisionedPaths, s as readLiveRegistryWorktreeByOwner, t as captureWorktreeRegistryReadGuard, u as readRegistryWorktree } from "./registry-read-Do2Ks9un.mjs";
import { u as worktreeGcRevision } from "./registry-read.kernel-D89C5gDY.mjs";
import { _ as worktreeRunLeaseScope } from "./registry-run-end.worker-DYWsmg23.mjs";
import { a as insertRegistryWorktree, d as clearRegistryWorktreeProvisionedChunks, f as createProvisionedSnapshotWriter, n as createWorktreeRemovalClaimsGuard, r as deleteRegistryWorktree, t as assertWorktreeRemovalAvailable, u as updateRegistryWorktree } from "./registry-BVVI2fBI.mjs";
import { t as withWorktreeGitConfig } from "./checkout-git-config-CsrQ5-l1.mjs";
import { a as readWorktreeGitInventory, c as withWorktreeSource, f as logWorktreeBase, h as withWorktreeBasePreparation, i as prepareWorktreeDestination, l as withWorktreeSources, m as resolveWorktreeCreationBase, n as createWithWorktreeAllocation, o as rebindLiveWorktreeRepository, r as findWorktreeByName, s as removeFailedWorktree, t as createOwnedWorktree, u as worktreeOwnerMatches } from "./service-preparation-BPHRuGZn.mjs";
import { n as withManagedWorktreeGit, t as usesSourceOnlyWorktreeGit } from "./checkout-policy-D6YWN6Cr.mjs";
import { _ as WorktreeSnapshotError, a as removeManagedCheckout, b as isWorktreeRepositoryCorruptionError, c as requireManagedWorktreeHead, d as withExactSnapshotRestore, g as WorktreeBranchMovedError, h as shouldPreserveOrphanCandidate, i as prepareSnapshotBranchDeletion, l as restoreRetiredExactWorktree, m as resolveManagedWorktreePathKeys, n as assertExactStateSourceIdentity, o as requireExactManagedWorktreeHead, p as canonicalPathKey, r as hasExactWorktreeIndex, s as requireExactWorktreeRepository, t as assertExactStateOwner, u as retireExactWorktree, v as classifyWorktreeRemovalError, y as isWorktreePermissionError } from "./removal-git-BhpnO_Vq.mjs";
import { a as resolveRepositoryPaths, i as resolveRepositoryIdentity, n as resolveRepository } from "./repository-paths-D7rjAU03.mjs";
import { c as rawPathStat, l as splitNullBuffer, o as parseGitTreePaths } from "./git-path-inventory-BM2twRa6.mjs";
import { c as validateDirectoryIdentities, d as readExactStateSnapshot, f as restoreExactStateMetadata, i as hasSafeParentDirectories, o as normalizeProvisionedRelativePath, r as captureParentDirectoryIdentities, s as resolveGitPath, t as SNAPSHOT_CHUNK_BYTES } from "./provisioned-snapshot-CIETRcbd.mjs";
import { t as indexWorktreeEvictionDependencies } from "./gc-dependencies-B22hkB14.mjs";
import { a as detectWorktreeFilesystemBackend, i as hasTemplatesAsync, n as collectWorktreeTemplates, r as prepareWorktreeTemplate } from "./template-cache-9PPxTz2j.mjs";
import { i as validateName } from "./name-C9NcRALZ.mjs";
import { t as exactStateRetirementSchema } from "./snapshot-exact-state-contract-DalOBOq9.mjs";
import { constants, lstatSync } from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { setImmediate } from "node:timers/promises";
//#region src/agents/worktrees/activity.ts
async function acquireManagedWorktree(env, id, now, params = {}) {
	const assertCurrent = () => {
		params.signal?.throwIfAborted();
		params.commitGuard?.();
		assertWorktreeRemovalAvailable(env, id);
	};
	return withWorktreeRunEnd(env, () => withWorktreeMutationLease({
		...params,
		env,
		id,
		commitGuard: assertCurrent,
		workerAuthority: params.workerAuthority && {
			...params.workerAuthority,
			assertCurrent: () => {
				params.workerAuthority?.assertCurrent?.();
				assertCurrent();
			}
		}
	}, (guard) => withGitLockTransition(id, async () => {
		const record = requireActiveWorktreeRecord(id, await readRegistryWorktreeForMutation({
			...guard,
			env,
			id
		}));
		await assertManagedWorktreeRemovalComplete(record, {
			signal: guard.signal,
			beforeRun: guard.commitGuard
		});
		const acquired = await lockWorktreeForProcess(record, {
			signal: guard.signal,
			beforeRun: guard.commitGuard
		});
		try {
			guard.commitGuard();
			const lastActiveAt = now();
			await updateRegistryWorktree(env, id, { lastActiveAt }, { workerAuthority: {
				...guard.workerAuthority,
				predicates: [...guard.workerAuthority.predicates ?? [], {
					kind: "binding",
					record
				}]
			} });
			guard.commitGuard();
			return {
				...record,
				lastActiveAt
			};
		} catch (error) {
			if (acquired && !hasSqliteWorkerOutcomeUnknown(error)) try {
				await runOutsideCommandProcessScope(() => unlockWorktree(record, { beforeRun: guard.rollbackGuard }));
			} catch (cleanupError) {
				throw new AggregateError([error, cleanupError], "Worktree activity publication and Git lock cleanup failed", { cause: cleanupError });
			}
			throw error;
		}
	})));
}
//#endregion
//#region src/agents/worktrees/empty-source.ts
const INITIAL_COMMIT = `tree 4b825dc642cb6eb9a060e54bf8d69288fbee4904\nauthor OpenClaw <openclaw@localhost> 0 +0000\ncommitter OpenClaw <openclaw@localhost> 0 +0000\n\nEmpty workspace\n`;
const INITIAL_COMMIT_ID = createHash("sha1").update(`commit ${Buffer.byteLength(INITIAL_COMMIT)}\0${INITIAL_COMMIT}`).digest("hex");
function sourceParent(env) {
	return path.join(resolveStateDir(env), "worktree-sources", "empty");
}
function sourceName(ownerId) {
	return createHash("sha256").update(ownerId).digest("hex");
}
async function hasEmptySourceLayout(sourceRoot) {
	const root = await fs$1.lstat(sourceRoot);
	const metadata = await fs$1.lstat(path.join(sourceRoot, ".git"));
	const entries = await fs$1.readdir(sourceRoot);
	return root.isDirectory() && metadata.isDirectory() && entries.length === 1 && entries[0] === ".git";
}
async function validateSource(sourceRoot, gitOptions) {
	if (!await hasEmptySourceLayout(sourceRoot) || await requireGit(sourceRoot, ["symbolic-ref", "HEAD"], gitOptions) !== "refs/heads/main" || await requireGit(sourceRoot, [
		"rev-parse",
		"--verify",
		"HEAD^{commit}"
	], gitOptions) !== INITIAL_COMMIT_ID || await requireGit(sourceRoot, ["status", "--porcelain=v1"], gitOptions) !== "") throw new Error("The empty workspace source has changed.");
}
/** Called under the managed-worktree allocation lease, including source publication. */
async function ensureEmptyWorktreeSource(params) {
	const { env, commitGuard } = params;
	const context = captureWorktreeRunEndContext(env);
	const sourceDirectory = sourceParent(context.environment);
	const gitEnv = Object.fromEntries(Object.entries(mergeProcessEnv([process.env, env])).filter(([key]) => !key.toUpperCase().startsWith("GIT_")));
	gitEnv.GIT_CONFIG_NOSYSTEM = "1";
	gitEnv.GIT_CONFIG_GLOBAL = gitNullConfigPath();
	gitEnv.GIT_NO_REPLACE_OBJECTS = "1";
	const gitOptions = {
		baseEnv: gitEnv,
		env: gitEnv,
		signal: params.signal,
		beforeRun: commitGuard
	};
	params.signal?.throwIfAborted();
	commitGuard();
	await fs$1.mkdir(sourceDirectory, {
		recursive: true,
		mode: 448
	});
	const ownerRoot = path.join(await fs$1.realpath(sourceDirectory), sourceName(params.ownerId));
	const sourceRoot = path.join(ownerRoot, "workspace");
	if (!await worktreePathExists(sourceRoot)) {
		const retained = (await readPendingWorktrees(context.environment)).some(({ record }) => path.relative(sourceRoot, record.repoRoot) === "") || (await readRegistryWorktrees(context.environment, {}, context)).some((record) => path.relative(sourceRoot, record.repoRoot) === "");
		context.admission.assertCurrent();
		commitGuard();
		if (retained) throw new Error(`Empty workspace source is missing: ${sourceRoot}. Restore its original Git metadata before starting this workspace; existing session history and snapshots depend on it.`);
		await fs$1.mkdir(ownerRoot, {
			recursive: true,
			mode: 448
		});
		if (!(await fs$1.lstat(ownerRoot)).isDirectory()) throw new Error(`Empty workspace source parent is not a directory: ${ownerRoot}`);
		commitGuard();
		const temporary = await fs$1.mkdtemp(path.join(ownerRoot, ".empty-"));
		try {
			await requireGit(temporary, [
				"init",
				"--quiet",
				"--template=",
				"--object-format=sha1",
				"-b",
				"main"
			], gitOptions);
			await requireGit(temporary, [
				"hash-object",
				"-w",
				"-t",
				"tree",
				"--stdin"
			], {
				...gitOptions,
				input: ""
			});
			await requireGit(temporary, [
				"hash-object",
				"-w",
				"-t",
				"commit",
				"--stdin"
			], {
				...gitOptions,
				input: INITIAL_COMMIT
			});
			await requireGit(temporary, [
				"update-ref",
				"refs/heads/main",
				INITIAL_COMMIT_ID
			], gitOptions);
			await validateSource(temporary, gitOptions);
			commitGuard();
			await fs$1.rename(temporary, sourceRoot);
		} finally {
			await fs$1.rm(temporary, {
				recursive: true,
				force: true
			});
			await fs$1.rmdir(ownerRoot).catch(() => void 0);
		}
		return sourceRoot;
	}
	try {
		await validateSource(sourceRoot, gitOptions);
	} catch (cause) {
		params.signal?.throwIfAborted();
		commitGuard();
		throw new Error(`Empty workspace source is unavailable or modified: ${sourceRoot}. Restore its original Git metadata and keep existing session files; OpenClaw will not recreate it over existing data.`, { cause });
	}
	commitGuard();
	return sourceRoot;
}
/** Called under the allocation lease after failed creation or final snapshot expiry. */
async function removeUnusedEmptyWorktreeSource(params) {
	const { env, record, commitGuard } = params;
	const context = captureWorktreeRunEndContext(env);
	const sourceDirectory = sourceParent(context.environment);
	if (record.ownerKind !== "session" || !record.ownerId || !await worktreePathExists(sourceDirectory)) return;
	const ownerRoot = path.join(await fs$1.realpath(sourceDirectory), sourceName(record.ownerId));
	const expected = path.join(ownerRoot, "workspace");
	if (path.relative(expected, record.repoRoot) !== "" || !await worktreePathExists(expected)) return;
	if ((await readPendingWorktrees(context.environment)).some(({ record: pending }) => path.relative(expected, pending.repoRoot) === "")) return;
	const records = await readRegistryWorktrees(context.environment, {}, context);
	context.admission.assertCurrent();
	params.signal?.throwIfAborted();
	commitGuard();
	const otherRecords = records.filter((other) => other.id !== record.id && path.relative(expected, other.repoRoot) === "");
	if (otherRecords.length > 0) {
		if (record.id && !otherRecords.some((other) => other.ownerKind === "session" && other.ownerId === record.ownerId)) throw new Error(`Empty workspace source still has retained worktrees; preserved ${expected}`);
		return;
	}
	const ownerDirectory = await fs$1.lstat(ownerRoot);
	const empty = await hasEmptySourceLayout(expected);
	if (!ownerDirectory.isDirectory() || !empty) throw new Error(`Empty workspace source contains unexpected files; preserved ${expected}`);
	const worktrees = await listGitWorktrees(expected, {
		signal: params.signal,
		beforeRun: commitGuard
	});
	if (worktrees.length !== 1 || path.relative(expected, worktrees[0].path) !== "") throw new Error(`Empty workspace source still has linked worktrees; preserved ${expected}`);
	commitGuard();
	await fs$1.rm(expected, { recursive: true });
	commitGuard();
	await fs$1.rmdir(ownerRoot).catch(() => void 0);
}
//#endregion
//#region src/agents/worktrees/provisioned-files.ts
async function copyProvisionedFile(params) {
	const relativePath = params.relativePath;
	if (!await hasSafeParentDirectories(params.sourceRoot.rootReal, relativePath) || !await hasSafeParentDirectories(params.destinationRoot.rootReal, relativePath)) return false;
	const source = resolveGitPath(params.sourceRoot.rootReal, relativePath);
	const destination = resolveGitPath(params.destinationRoot.rootReal, relativePath);
	const sourceStat = await fs$1.lstat(source).catch(() => void 0);
	if (!sourceStat?.isFile() || sourceStat.isSymbolicLink()) return false;
	if (await lstatIfExists(destination)) return false;
	try {
		await params.destinationRoot.copyIn(destination, {
			root: params.sourceRoot,
			relativePath: source
		}, {
			overwrite: false,
			maxBytes: Infinity,
			preserveSourceMode: true,
			sourceHardlinks: "allow",
			mutationSymlinks: "reject",
			durable: false,
			assertBeforeMutation: params.assertCurrent,
			signal: params.signal
		});
	} catch (error) {
		if (error instanceof FsSafeError && error.code === "already-exists") return false;
		throw error;
	}
	params.assertCurrent?.();
	return true;
}
/** Copies the current manifest matches and returns only paths this call actually created. */
async function provisionIncludedFiles(repoRoot, worktreePath, options = {}) {
	const inspection = await runGitWorkerOperation({
		type: "worktree.provisioning-inspection",
		input: { sourceRoot: repoRoot }
	}, options);
	const assertCurrent = () => {
		options.signal?.throwIfAborted();
		options.assertCurrent?.();
	};
	if (inspection.paths.length === 0) return [];
	assertCurrent();
	const [sourceRoot, destinationRoot] = await Promise.all([root(repoRoot), root(worktreePath)]);
	const provisioned = [];
	for (const relativePath of inspection.paths) {
		const normalized = normalizeProvisionedRelativePath(relativePath);
		if (normalized && await copyProvisionedFile({
			sourceRoot,
			destinationRoot,
			relativePath: normalized,
			assertCurrent,
			signal: options.signal
		})) provisioned.push(normalized);
	}
	return provisioned.toSorted();
}
/** Restores provisioned bytes and modes from SQLite, never from the mutable source checkout. */
async function restoreProvisionedFiles(env, worktreeId, worktreePath, states, commitGuard) {
	for (const state of states) {
		const normalized = normalizeProvisionedRelativePath(state.path);
		if (!normalized || !await hasSafeParentDirectories(worktreePath, normalized)) throw new Error(`unsafe provisioned path: ${state.path}`);
		const target = resolveGitPath(worktreePath, normalized);
		if (state.mode === null) {
			if (await lstatIfExists(target)) throw new Error(`snapshot expected provisioned path to be absent: ${state.path}`);
			continue;
		}
		commitGuard?.();
		await fs$1.mkdir(path.dirname(target), { recursive: true });
		const parentIdentities = await captureParentDirectoryIdentities(worktreePath, normalized);
		commitGuard?.();
		const handle = await fs$1.open(target, constants.O_CREAT | constants.O_EXCL | constants.O_WRONLY | (constants.O_NOFOLLOW ?? 0), state.mode);
		try {
			await validateDirectoryIdentities(parentIdentities);
			for (let chunkIndex = 0; chunkIndex < state.chunks; chunkIndex += 1) {
				const chunk = await getRegistryWorktreeProvisionedChunk(env, {
					worktreeId,
					path: state.path,
					chunkIndex
				});
				if (!chunk) throw new Error(`provisioned snapshot chunk missing: ${state.path}:${chunkIndex}`);
				commitGuard?.();
				await writeFileWindowFully(handle, chunk, null, { assertBeforeMutation: commitGuard });
			}
			commitGuard?.();
			await handle.chmod(state.mode);
			await validateDirectoryIdentities(parentIdentities);
		} finally {
			await handle.close();
		}
	}
}
//#endregion
//#region src/agents/worktrees/snapshot-restore-exact.ts
const oid = string().regex(/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u);
const receiptSchema = object({
	version: literal(1),
	binding: string().regex(/^[a-f0-9]{64}$/u),
	snapshot: oid,
	nonce: string().uuid(),
	sourceIdentity: object({
		device: string().regex(/^\d+$/u),
		inode: string().regex(/^\d+$/u)
	}).strict()
}).strict();
const receiptRef = (record) => "refs/openclaw/restores/exact-v1/" + record.id;
const binding = (record) => createHash("sha256").update(JSON.stringify([
	record.id,
	record.createdAt,
	record.ownerKind,
	record.ownerId,
	record.repoRoot,
	record.path,
	record.branch
])).digest("hex");
/** A native Git receipt pins the immutable snapshot and the newly allocated inode before checkout. */
async function readExactRestoreReceipt(record, options) {
	const found = await runGit(record.repoRoot, [
		"rev-parse",
		"--verify",
		"--quiet",
		receiptRef(record) + "^{commit}"
	], options);
	if (found.code === 1) return;
	if (found.code !== 0) throw createGitCommandError("git rev-parse exact restore", found);
	const commit = found.stdout.trim();
	const receipt = receiptSchema.parse(JSON.parse((await requireGitBuffer(record.repoRoot, ["show", commit + ":manifest.json"], options)).toString("utf8")));
	if (receipt.binding !== binding(record) || await requireGit(record.repoRoot, ["rev-parse", commit + "^"], options) !== receipt.snapshot) throw new Error("Exact restore receipt ownership changed; source and snapshot preserved");
	return {
		...receipt,
		commit,
		ref: receiptRef(record)
	};
}
async function clearExactRestoreReceipt(record, receipt, options) {
	await requireGit(record.repoRoot, [
		"update-ref",
		"-d",
		receiptRef(record),
		receipt.commit
	], options);
}
async function createReceipt(record, snapshot, options, admitCapacity) {
	options?.beforeRun?.();
	await fs$1.mkdir(path.dirname(record.path), { recursive: true });
	await fs$1.mkdir(record.path).catch((error) => {
		if (!hasErrnoCode(error, "EEXIST")) throw error;
	});
	if ((await fs$1.readdir(record.path)).length || (await listGitWorktrees(record.repoRoot)).some((entry) => entry.path === record.path)) throw new Error("Exact restore destination is occupied; source and snapshot preserved");
	const stat = await fs$1.lstat(record.path, { bigint: true });
	if (!stat.isDirectory()) throw new Error("Exact restore destination is not a directory");
	await admitCapacity([record.repoRoot, record.path]);
	options?.beforeRun?.();
	const receipt = {
		version: 1,
		binding: binding(record),
		snapshot,
		nonce: randomUUID(),
		sourceIdentity: {
			device: stat.dev.toString(),
			inode: stat.ino.toString()
		}
	};
	const blob = await requireGit(record.repoRoot, [
		"hash-object",
		"-w",
		"--stdin"
	], {
		...options,
		input: Buffer.from(JSON.stringify(receipt))
	});
	const tree = await requireGit(record.repoRoot, ["mktree", "-z"], {
		...options,
		input: Buffer.from("100644 blob " + blob + "	manifest.json\0")
	});
	const commit = await requireGit(record.repoRoot, [
		"commit-tree",
		tree,
		"-p",
		snapshot,
		"-m",
		"OpenClaw exact restore v1"
	], {
		...options,
		env: {
			...options?.env,
			GIT_AUTHOR_NAME: "OpenClaw",
			GIT_AUTHOR_EMAIL: "openclaw@localhost",
			GIT_COMMITTER_NAME: "OpenClaw",
			GIT_COMMITTER_EMAIL: "openclaw@localhost"
		}
	});
	await requireGit(record.repoRoot, [
		"update-ref",
		receiptRef(record),
		commit,
		"0".repeat(snapshot.length)
	], options);
	return {
		...receipt,
		commit
	};
}
async function restoreProvisionedAtomically(params) {
	const { record, metadata, temporaryRoot, assertCurrent } = params;
	const root$1 = path.join(temporaryRoot, "provisioned");
	await fs$1.mkdir(root$1, { recursive: true });
	await restoreProvisionedFiles(params.env, record.id, root$1, params.states, assertCurrent);
	const [sourceRoot, destinationRoot] = await Promise.all([root(root$1), root(record.path)]);
	for (const state of params.states) {
		assertCurrent();
		const target = path.join(record.path, state.path);
		const entry = metadata.files.find((file) => file.provisioned && Buffer.from(file.path, "hex").toString("utf8") === state.path);
		if (!entry) throw new Error("Exact restore lacks provisioned metadata");
		const existing = await rawPathStat(target);
		if (existing) {
			if (!existing.isFile() || state.mode === null) throw new Error("Exact restore provisioned path changed; source preserved");
			const opened = await destinationRoot.open(target, { hardlinks: "allow" });
			try {
				const digest = createHash(metadata.head.length === 64 ? "sha256" : "sha1").update("blob " + opened.stat.size + "\0");
				const buffer = Buffer.allocUnsafe(65536);
				for (;;) {
					const { bytesRead } = await opened.handle.read(buffer);
					if (!bytesRead) break;
					digest.update(buffer.subarray(0, bytesRead));
					assertCurrent();
				}
				if (digest.digest("hex") !== entry.blob) throw new Error("Exact restore provisioned bytes changed; source preserved");
			} finally {
				await opened.handle.close();
			}
		} else if (state.mode !== null) await destinationRoot.copyIn(target, {
			root: sourceRoot,
			relativePath: path.join(root$1, state.path)
		}, {
			overwrite: false,
			maxBytes: Infinity,
			preserveSourceMode: true,
			sourceHardlinks: "allow",
			mutationSymlinks: "reject",
			durable: false,
			assertBeforeMutation: assertCurrent
		});
	}
}
/** Resume only the receipt-owned incarnation; keep it and the snapshot on any interrupted attempt. */
async function restoreExactSnapshotFallback(params) {
	const { record, snapshot, metadata } = params;
	const receipt = await readExactRestoreReceipt(record, params.options) ?? await createReceipt(record, snapshot, params.options, params.admitCapacity);
	if (receipt.snapshot !== snapshot) throw new Error("Exact restore snapshot changed; receipt and source preserved");
	const identity = {
		...metadata,
		sourceIdentity: receipt.sourceIdentity
	};
	const assertCurrent = () => {
		params.assertCurrent();
		assertExactStateSourceIdentity(record.path, identity);
	};
	const options = {
		...params.options,
		beforeRun: assertCurrent
	};
	assertCurrent();
	if (!(await listGitWorktrees(record.repoRoot)).some((entry) => entry.path === record.path)) {
		if ((await fs$1.readdir(record.path)).length) throw new Error("Incomplete exact restore registration; source and receipt preserved");
		await params.admitCapacity([record.repoRoot, record.path]);
		assertCurrent();
		await params.add(assertCurrent);
	}
	return await withExactSnapshotRestore(record, metadata, options, assertCurrent, async () => {
		const temporaryRoot = path.join(record.path, ".openclaw-restore-" + receipt.nonce);
		if (metadata.files.some((entry) => Buffer.from(entry.path, "hex").toString("utf8").split("/")[0] === path.basename(temporaryRoot))) throw new Error("Exact restore temporary namespace conflicts with captured data");
		await params.admitCapacity([record.repoRoot, record.path]);
		if (!await hasExactWorktreeIndex(record.path, metadata, options)) {
			assertCurrent();
			await fs$1.rm(temporaryRoot, {
				recursive: true,
				force: true
			});
			await restoreProvisionedAtomically({
				env: params.env,
				record,
				metadata,
				states: params.states,
				temporaryRoot,
				assertCurrent
			});
			await restoreExactStateMetadata({
				checkoutPath: record.path,
				metadata,
				options,
				assertCurrent,
				temporaryRoot
			});
		}
		assertCurrent();
		await fs$1.rm(temporaryRoot, {
			recursive: true,
			force: true
		});
		assertCurrent();
		const result = await params.finalize(identity);
		await clearExactRestoreReceipt(record, receipt, options);
		return result;
	});
}
//#endregion
//#region src/agents/worktrees/snapshot-host.ts
/** Existing snapshot worker and effect owners, supplied with this operation's Git policy. */
async function captureManagedWorktreeSnapshot(params) {
	return withWorktreeRunEnd(params.env, async () => {
		const { record, env, provisionedPaths } = params;
		const writeProvisioned = createProvisionedSnapshotWriter(env, record.id, {
			...params.workerAuthority,
			assertCurrent: () => {
				params.signal?.throwIfAborted();
				(params.workerAuthority ? params.workerAuthority.assertCurrent : params.assertCurrent)?.();
			}
		});
		const exactState = params.exactState && params.retirementName ? {
			branch: record.branch,
			expected: params.exactState,
			retirementName: params.retirementName
		} : void 0;
		if (params.exactState && !exactState) throw new Error("Exact-state capture lacks retirement custody");
		return await runGitWorkerOperation({
			type: "worktree.snapshot",
			input: {
				worktreeId: record.id,
				checkoutPath: record.path,
				repoRoot: record.repoRoot,
				reason: params.reason,
				provisionedPaths,
				...exactState ? { exactState } : {}
			}
		}, {
			signal: params.signal,
			assertCurrent: params.assertCurrent,
			git: params.git.worker,
			onEffect: async (effect, { signal }) => {
				const assertCurrent = () => {
					signal.throwIfAborted();
					params.assertCurrent?.();
				};
				assertCurrent();
				switch (effect.type) {
					case "worktree.snapshot-inventory":
						params.onInventory?.(effect.input);
						return;
					case "worktree.assert-current": return;
					case "worktree.snapshot-capacity":
						await params.requireDiskSpace([...effect.input.demands, ...effect.input.stateBytes === void 0 ? [] : [{
							path: resolveStateDir(env),
							bytes: effect.input.stateBytes
						}]], effect.input.purpose, true, signal);
						assertCurrent();
						return;
					case "worktree.snapshot-provisioned-reset":
					case "worktree.snapshot-provisioned-chunk": return await writeProvisioned(effect, signal);
					case "worktree.eviction-fence":
					case "worktree.eviction-admit": throw new Error("Snapshot capture cannot authorize worktree eviction");
				}
			}
		});
	});
}
async function verifyManagedWorktreeExactSnapshot(params) {
	await runGitWorkerOperation({
		type: "worktree.snapshot-verify-exact",
		input: {
			worktreeId: params.record.id,
			checkoutPath: params.record.path,
			repoRoot: params.record.repoRoot,
			reason: "exact-state verification",
			provisionedPaths: params.provisionedPaths,
			exactState: {
				branch: params.record.branch,
				expected: params.expected,
				retirementName: params.retirementName
			},
			expectedDigest: params.expectedDigest
		}
	}, {
		signal: params.signal,
		assertCurrent: params.assertCurrent,
		git: params.git.worker,
		onEffect: async (_effect, { signal }) => {
			signal.throwIfAborted();
			params.assertCurrent();
		}
	});
}
/** Explicit retirement shares the same allocation owner as removal and GC. */
async function retireManagedWorktreeSnapshotById(input, environment = process.env) {
	const context = captureWorktreeRunEndContext(environment);
	const env = {
		...environment,
		...context.environment
	};
	const params = { ...input };
	return await withWorktreeAllocationLease({
		...params,
		env
	}, async (guard) => {
		const record = await readRegistryWorktree(context, params.id);
		guard.commitGuard();
		if (!record || record.removedAt === void 0 || record.removedAt !== params.expectedRemovedAt || record.snapshotRef !== params.expectedSnapshotRef) throw new Error("Expected removed worktree snapshot identity does not match");
		await retireManagedWorktreeSnapshot({
			record,
			env,
			signal: guard.signal,
			assertCurrent: () => guard.commitGuard(),
			workerAuthority: guard.workerAuthority,
			expected: params
		});
		return {
			retired: true,
			id: record.id
		};
	});
}
async function retireExpiredManagedWorktreeSnapshot(input) {
	const context = captureWorktreeRunEndContext(input.env);
	const params = {
		...input,
		env: {
			...input.env,
			...context.environment
		}
	};
	return await withWorktreeMutationLease({
		...params.guard,
		env: params.env,
		id: params.id
	}, async (guard) => {
		const accept = captureWorktreeRegistryReadGuard(context, "exact-snapshot");
		const record = await readRegistryWorktree(context, params.id);
		guard.commitGuard();
		if (!record || record.removedAt === void 0 || record.removedAt >= params.expiresBefore) return false;
		const assertRecordCurrent = accept(record);
		await retireManagedWorktreeSnapshot({
			record,
			env: params.env,
			signal: guard.signal,
			assertCurrent: guard.commitGuard,
			workerAuthority: guard.workerAuthority,
			assertRecordCurrent
		});
		return true;
	});
}
/** Preparation remains under the allocation owner; Git commits exact ref custody atomically. */
async function prepareExactSnapshotRetirement(params) {
	const { record, expected, signal, assertCurrent } = params;
	const ref = `refs/openclaw/snapshots/${record.id}`;
	if (expected.id !== record.id || expected.expectedSnapshotRef !== ref || record.snapshotRef !== ref || record.removedAt !== expected.expectedRemovedAt || !Number.isSafeInteger(expected.expectedRemovedAt) || expected.expectedRemovedAt < 0 || !/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/u.test(expected.expectedSnapshotOid) || !/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/u.test(expected.expectedRetainedSourceOid) || !/^refs\/(?:heads|remotes)\//u.test(expected.retainedSourceRef)) throw new Error("Invalid exact snapshot retirement identity or retained source ref");
	const options = {
		signal,
		beforeRun: assertCurrent,
		env: {
			GIT_NO_LAZY_FETCH: "1",
			GIT_NO_REPLACE_OBJECTS: "1",
			GIT_OPTIONAL_LOCKS: "0"
		}
	};
	await requireGit(record.repoRoot, ["check-ref-format", ref], options);
	await requireGit(record.repoRoot, ["check-ref-format", expected.retainedSourceRef], options);
	const repository = await resolveRepository(record.repoRoot);
	assertCurrent();
	if (repository.repoRoot !== record.repoRoot || repository.fingerprint !== record.repoFingerprint) throw new Error("Worktree snapshot repository identity changed");
	if (await worktreePathExists(record.path) || (await listGitWorktrees(record.repoRoot, options)).some((entry) => path.resolve(entry.path) === path.resolve(record.path))) throw new Error("Worktree snapshot still has a checkout or Git registration");
	for (const [reference, oid] of [[ref, expected.expectedSnapshotOid], [expected.retainedSourceRef, expected.expectedRetainedSourceOid]]) {
		if ((await runGit(record.repoRoot, [
			"symbolic-ref",
			"--quiet",
			reference
		], options)).code !== 1) throw new Error("Snapshot retirement requires direct, not symbolic, refs");
		if (await requireGit(record.repoRoot, [
			"show-ref",
			"--verify",
			"--hash",
			reference
		], options) !== oid) throw new Error("Snapshot retirement ref OID changed");
	}
	const pendingRef = `refs/openclaw/removals/${record.id}`;
	if ((await runGit(record.repoRoot, [
		"show-ref",
		"--verify",
		"--quiet",
		pendingRef
	], options)).code !== 1) throw new Error("Snapshot retirement has pending removal custody");
	if (await requireGit(record.repoRoot, ["rev-parse", `${expected.expectedSnapshotOid}^{tree}`], options) !== await requireGit(record.repoRoot, ["rev-parse", `${expected.expectedRetainedSourceOid}^{tree}`], options)) throw new Error("Snapshot contains source not covered by the retained commit");
	const parents = (await requireGit(record.repoRoot, [
		"rev-list",
		"--parents",
		"-n",
		"1",
		expected.expectedSnapshotOid
	], options)).split(" ");
	if (parents.length !== 2) throw new Error("Snapshot parent custody is unavailable");
	await requireGit(record.repoRoot, [
		"merge-base",
		"--is-ancestor",
		parents[1],
		expected.expectedRetainedSourceOid
	], options);
	assertCurrent();
	return async (assertProjectionCurrent) => {
		const beforeRun = () => {
			assertCurrent();
			assertProjectionCurrent();
		};
		if (await worktreePathExists(record.path) || (await listGitWorktrees(record.repoRoot, {
			...options,
			beforeRun
		})).some((entry) => path.resolve(entry.path) === path.resolve(record.path))) throw new Error("Worktree snapshot checkout or Git registration reappeared");
		await requireGit(record.repoRoot, ["update-ref", "--stdin"], {
			...options,
			beforeRun,
			input: `start\nverify ${expected.retainedSourceRef} ${expected.expectedRetainedSourceOid}\noption no-deref\nverify ${pendingRef} ${"0".repeat(expected.expectedSnapshotOid.length)}\noption no-deref\ndelete ${ref} ${expected.expectedSnapshotOid}\nprepare\ncommit\n`
		});
	};
}
/** Retire the restore entry point before releasing accepted projection custody. */
async function retireManagedWorktreeSnapshot(params) {
	const { record, env, signal } = params;
	if (params.expected) {
		const { withLocalWorkspaceStore } = await import("./local-workspace-store-DI1tygZh.mjs");
		await withLocalWorkspaceStore({
			...params,
			worktreeId: record.id,
			requireAbsent: true
		}, async (store) => {
			const assertCurrent = await prepareWorktreeRegistryGuard(captureWorktreeRunEndContext(env), {
				...store.workerAuthority,
				predicates: [{
					kind: "snapshot-retirement",
					record
				}],
				assertCurrent: store.assertCurrent
			});
			assertCurrent();
			await (await prepareExactSnapshotRetirement({
				record,
				expected: params.expected,
				signal,
				assertCurrent
			}))(assertCurrent);
			assertCurrent();
			await deleteRegistryWorktree(env, record.id, {
				assertCurrent,
				expectedRetired: record,
				workerAuthority: {
					...store.workerAuthority,
					assertCurrent
				}
			});
		});
		return;
	}
	const exactRecord = record.snapshotRef?.startsWith("refs/openclaw/snapshots/exact-");
	const expirationToken = exactRecord ? randomUUID() : void 0;
	const assertClaim = expirationToken ? createWorktreeRemovalClaimsGuard(env, [record.id], expirationToken) : void 0;
	let claimed = false;
	const assertCurrent = () => {
		params.assertCurrent();
		if (exactRecord) {
			params.assertRecordCurrent?.();
			if (claimed && expirationToken) assertClaim?.();
		}
	};
	if (exactRecord && !await worktreePathExists(record.repoRoot)) throw new Error("Exact-state source repository unavailable; recovery and registry preserved");
	if (expirationToken) {
		await claimWorktreeRemoval(env, {
			worktreeId: record.id,
			token: expirationToken,
			retiredExact: true,
			assertCurrent,
			workerAuthority: {
				...params.workerAuthority,
				assertCurrent: params.workerAuthority ? params.workerAuthority.assertCurrent : params.assertCurrent,
				predicates: [...params.workerAuthority?.predicates ?? [], {
					kind: "exact-snapshot",
					record
				}]
			}
		});
		claimed = true;
	}
	try {
		const { expireLocalWorkspaceProjection } = await import("./local-workspace-projection-B04UXZLe.mjs");
		await expireLocalWorkspaceProjection({
			worktree: record,
			env,
			assertCurrent,
			workerAuthority: params.workerAuthority,
			retireSnapshot: async (assertProjectionCurrent) => {
				const beforeRun = () => {
					assertCurrent();
					assertProjectionCurrent();
				};
				if (await worktreePathExists(record.repoRoot)) {
					const deletions = [`delete refs/openclaw/removals/${record.id}\0\0`];
					let assertDeletionCurrent = beforeRun;
					if (record.snapshotRef) {
						const found = await runGit(record.repoRoot, [
							"rev-parse",
							"--verify",
							"--quiet",
							record.snapshotRef + "^{commit}"
						], {
							signal,
							beforeRun
						});
						if (found.code !== 0 && found.code !== 1) throw createGitCommandError("git rev-parse snapshot", found);
						const snapshot = found.code === 0 ? found.stdout.trim() : void 0;
						const exact = snapshot ? await readExactStateSnapshot(record.repoRoot, snapshot, record.snapshotRef, {
							signal,
							beforeRun
						}) : void 0;
						const assertNoLiveSource = () => {
							beforeRun();
							if (lstatSync(record.path, { throwIfNoEntry: false })) throw new Error("Exact-state source already moved back; source and snapshot preserved");
						};
						const registrations = exactRecord ? await listGitWorktrees(record.repoRoot) : [];
						if (exactRecord) {
							assertDeletionCurrent = assertNoLiveSource;
							assertNoLiveSource();
							if (registrations.some((entry) => entry.path === record.path)) throw new Error("Exact-state live registration remains; source and snapshot preserved");
							if (!snapshot && !record.snapshotRef.startsWith("refs/openclaw/snapshots/exact-v1/")) throw new Error("Unsupported exact-state snapshot version; registry preserved");
						}
						if (exact) {
							const retained = path.join(path.dirname(record.path), exact.retirementName);
							const exists = await worktreePathExists(retained);
							const registered = registrations.some((entry) => entry.path === retained);
							if (exists !== registered) throw new Error("Exact-state retention source is incomplete; source and snapshot preserved");
							if (registered) await requireGit(record.repoRoot, [
								"worktree",
								"remove",
								"--force",
								"--",
								retained
							], {
								beforeRun: () => {
									assertNoLiveSource();
									assertExactStateSourceIdentity(retained, exact);
								},
								killProcessTree: true
							});
						}
						deletions.push(`delete ${record.snapshotRef}\0${snapshot ?? ""}\0`);
						if (exactRecord) {
							const receipt = await readExactRestoreReceipt(record, {
								signal,
								beforeRun: assertNoLiveSource
							});
							if (receipt) deletions.push(`delete ${receipt.ref}\0${receipt.commit}\0`);
						}
					}
					await requireGit(record.repoRoot, [
						"update-ref",
						"--stdin",
						"-z"
					], {
						signal,
						beforeRun: assertDeletionCurrent,
						input: `start\0${deletions.join("")}prepare\0commit\0`
					});
				}
			}
		});
		await removeUnusedEmptyWorktreeSource({
			env,
			record,
			signal,
			commitGuard: assertCurrent
		});
		assertCurrent();
		await deleteRegistryWorktree(env, record.id, {
			assertCurrent,
			removalToken: expirationToken,
			workerAuthority: {
				...params.workerAuthority,
				assertCurrent
			}
		});
	} finally {
		if (expirationToken && claimed) await abortWorktreeRemovalRow(env, record.id, expirationToken);
	}
}
//#endregion
//#region src/agents/worktrees/eviction.ts
const log$6 = createSubsystemLogger("agents/worktrees");
/** Capacity eviction keeps run exclusion but deliberately permits loss of unsaved data. */
async function evictManagedWorktree(params) {
	return withWorktreeRunEnd(params.env, async () => {
		const { env, record, guard } = params;
		const authority = guard.workerAuthority;
		if (!authority?.leaseSet) throw new Error("Worktree eviction requires the allocation lease's worker authority");
		const token = randomUUID();
		const dependencies = [];
		const claimsPredicate = () => ({
			kind: "removal-claims",
			ids: [record.id, ...dependencies],
			token
		});
		const workerAuthority = {
			...authority,
			predicates: [...authority.predicates ?? [], {
				kind: "binding",
				record
			}]
		};
		let assertClaims = createWorktreeRemovalClaimsGuard(env, [record.id], token);
		const assertBinding = await prepareWorktreeRegistryGuard(captureWorktreeRunEndContext(env), { predicates: [{
			kind: "binding",
			record
		}] });
		const assertCurrent = () => {
			guard.commitGuard();
			assertBinding();
			assertClaims();
		};
		await claimWorktreeRemoval(env, {
			worktreeId: record.id,
			token,
			assertCurrent: guard.commitGuard,
			workerAuthority
		});
		let outcome;
		try {
			assertCurrent();
			const { withSettledLocalWorkspace } = await import("./local-workspace-projection-B04UXZLe.mjs");
			outcome = {
				ok: true,
				value: await withSettledLocalWorkspace({
					worktree: record,
					env,
					assertCurrent,
					workerAuthority,
					retireRuntime: true
				}, async (accepted) => {
					const ownerAuthority = accepted?.workerAuthority ?? workerAuthority;
					const heldClaimsAuthority = () => ({
						...ownerAuthority,
						predicates: [...ownerAuthority.predicates ?? [], claimsPredicate()]
					});
					const beforeRun = () => {
						assertCurrent();
						accepted?.assertCurrent();
					};
					let snapshotRef;
					let dirty = false;
					let snapshotError;
					try {
						const signal = AbortSignal.any([...guard.signal ? [guard.signal] : [], AbortSignal.timeout(5e3)]);
						await withManagedWorktreeGit({
							record,
							env,
							getConfig: params.getConfig,
							signal,
							beforeRun
						}, async (git) => {
							const provisionedPaths = await getRegistryWorktreeProvisionedPaths(env, record.id);
							if (!provisionedPaths) throw new Error("provisioned path ledger is unavailable");
							const snapshot = await captureManagedWorktreeSnapshot({
								record,
								env,
								reason: `capacity-${params.reason}`,
								provisionedPaths,
								git,
								signal,
								assertCurrent: beforeRun,
								workerAuthority: heldClaimsAuthority(),
								requireDiskSpace: guard.requireDiskSpace
							});
							snapshotRef = snapshot.snapshotRef;
							beforeRun();
							await updateRegistryWorktree(env, record.id, {
								snapshotRef,
								provisionedState: snapshot.provisionedState
							}, {
								assertCurrent: beforeRun,
								workerAuthority: heldClaimsAuthority()
							});
							dirty = Boolean(await git.require(record.repoRoot, [
								"diff-tree",
								"--no-commit-id",
								"--name-only",
								"-r",
								`${snapshotRef}^`,
								snapshotRef
							], {
								signal,
								beforeRun
							}));
							if (accepted) {
								const snapshotCommit = await git.require(record.repoRoot, ["rev-parse", `${snapshotRef}^{commit}`], {
									signal,
									beforeRun
								});
								await accepted.prepareArchive?.(snapshotCommit);
							}
						});
					} catch (error) {
						if (hasSqliteWorkerOutcomeUnknown(error)) throw error;
						beforeRun();
						snapshotError = String(error);
					}
					beforeRun();
					const live = await readRegistryWorktrees(env, { liveOnly: true });
					const liveIds = new Set(live.map((candidate) => candidate.id));
					beforeRun();
					const settleGuard = () => {
						guard.rollbackGuard();
						assertClaims();
					};
					let deletionAdmitted = false;
					const assertEffectCurrent = () => deletionAdmitted ? settleGuard() : beforeRun();
					const fenceDependencies = async (ids, signal) => {
						for (const id of ids) {
							if (id === record.id || !liveIds.has(id)) throw new Error("Worktree dependency is outside the admitted inventory");
							try {
								await claimWorktreeRemoval(env, {
									worktreeId: id,
									token,
									assertCurrent: assertEffectCurrent,
									workerAuthority: deletionAdmitted ? {
										leaseSet: authority.leaseSet,
										predicates: [{
											kind: "binding",
											record
										}, claimsPredicate()],
										signal
									} : {
										...heldClaimsAuthority(),
										signal
									}
								});
							} catch (error) {
								if (error instanceof WorktreeRemovalContentionError && error.blockedByRun) log$6.warn(`Worktree eviction live-refused: ${record.id}; dependency ${error.blockedByRun.worktreeId}; live pid ${error.blockedByRun.pid}`);
								throw error;
							}
							dependencies.push(id);
							assertClaims = createWorktreeRemovalClaimsGuard(env, [record.id, ...dependencies], token);
							if (dependencies.length % 8 === 0) await setImmediate();
						}
						assertEffectCurrent();
					};
					await runOutsideCommandProcessScope(() => runGitWorkerOperation({
						type: "worktree.eviction-purge",
						input: {
							record,
							live
						}
					}, {
						assertCurrent: assertEffectCurrent,
						onEffect: async (effect, { signal }) => {
							const effectSignal = !deletionAdmitted && guard.signal ? AbortSignal.any([signal, guard.signal]) : signal;
							if (!deletionAdmitted) effectSignal.throwIfAborted();
							assertEffectCurrent();
							if (effect.type === "worktree.eviction-fence") await fenceDependencies(effect.input.worktreeIds, effectSignal);
							else if (effect.type === "worktree.eviction-admit") deletionAdmitted = true;
						}
					}));
					settleGuard();
					const removedAt = params.now();
					await updateRegistryWorktree(env, record.id, {
						removedAt,
						snapshotRef
					}, {
						assertCurrent: settleGuard,
						removalToken: token,
						workerAuthority: {
							leaseSet: authority.leaseSet,
							predicates: [{
								kind: "binding",
								record
							}, claimsPredicate()]
						}
					});
					await finalizeWorktreeRemovalRows(env, {
						worktreeId: record.id,
						lastActiveAt: record.lastActiveAt,
						removedAt,
						token
					}, {
						leaseSet: authority.leaseSet,
						predicates: [claimsPredicate()]
					});
					const reason = dirty || snapshotError ? "dirty-purged" : params.reason;
					log$6.warn(`Worktree evicted: ${record.id}; reason ${reason}; selected ${params.reason}; ${snapshotRef ? `snapshot ${snapshotRef}` : "no recovery snapshot"}${snapshotError ? `; snapshot failed: ${snapshotError}` : ""}`);
					return reason;
				})
			};
		} catch (error) {
			if (hasSqliteWorkerOutcomeUnknown(error)) throw error;
			outcome = {
				ok: false,
				error
			};
		}
		const errors = outcome.ok ? [] : [outcome.error];
		for (const [index, id] of [...dependencies, record.id].entries()) {
			try {
				await abortWorktreeRemovalRow(env, id, token);
			} catch (error) {
				errors.push(error);
				if (hasSqliteWorkerOutcomeUnknown(error)) break;
			}
			if ((index + 1) % 8 === 0) await setImmediate();
		}
		if (errors.length > 1) throw new AggregateError(errors, "Worktree eviction or claim release failed", { cause: errors[0] });
		if (!outcome.ok) throw outcome.error;
		if (errors.length > 0) throw errors[0];
		return outcome.value;
	});
}
//#endregion
//#region src/agents/worktrees/gc-limits.ts
const log$5 = createSubsystemLogger("agents/worktrees");
/** Call under the allocation lease shared by create, restore and background maintenance. */
async function enforceWorktreeCleanupLimits(params) {
	const { maxCount, progress } = params;
	const records = await readRegistryWorktrees(params.env, { liveOnly: true });
	const refresh = async () => {
		return {
			liveIds: new Set(await readLiveRegistryWorktreeIds(params.env)),
			exceeded: await readWorktreeSlotCount(params.env) > maxCount
		};
	};
	let state = await refresh();
	if (!state.exceeded) {
		progress.result.limitsSatisfied = true;
		return [];
	}
	const idle = [];
	const leased = /* @__PURE__ */ new Set();
	for (const record of records) if (await params.hasLiveLease(record)) {
		leased.add(record.id);
		if (progress.start(record.id)) {
			const owner = `${record.ownerKind}:${record.ownerId ?? record.id}`;
			progress.protect("limits", record.id, "live-refused", `${owner} has an active run lease`);
			log$5.info(`Worktree eviction live-refused: ${record.id}; owner ${owner}`);
		}
	} else idle.push(record);
	const commonDirs = new Map((idle.length ? await params.repositories(records) : []).map(({ repoRoot, commonDir }) => [repoRoot, commonDir]));
	const { dependents, sourceContainers, unresolved } = indexWorktreeEvictionDependencies(records, commonDirs);
	const unknownLive = [...unresolved.keys()].some((id) => leased.has(id));
	const blocked = (id) => {
		if (unknownLive) return true;
		for (const child of dependents.get(id) ?? []) if (state.liveIds.has(child)) return true;
		return false;
	};
	const reasons = new Map((await params.classify(idle)).map(({ id, reason }) => [id, reason]));
	const rank = (record) => {
		const reason = reasons.get(record.id);
		return reason === "merged" ? 0 : reason === "squashed" ? 1 : 2;
	};
	idle.sort((a, b) => rank(a) - rank(b) || a.lastActiveAt - b.lastActiveAt || a.id.localeCompare(b.id));
	const removed = [];
	for (const record of idle) {
		if (!state.exceeded || params.shouldYield?.()) break;
		if (blocked(record.id)) continue;
		if (state.liveIds.has(record.id) && progress.start(record.id)) try {
			progress.result.eligibleCount += 1;
			await params.evict(record, reasons.get(record.id) ?? "idle-age");
			removed.push(record.id);
			const containers = [...sourceContainers.get(record.id) ?? []].filter((id) => state.liveIds.has(id));
			if (containers.length > 0) log$5.warn(`Worktree ${record.id} recovery remains inside managed checkout(s) ${containers.join(", ")}; evicting them can also remove its recovery snapshot`);
		} catch (error) {
			await params.onError(record, error);
		}
		state = await refresh();
	}
	progress.result.limitsSatisfied = !state.exceeded;
	return removed;
}
function worktreeCapacityError(maxCount, liveOwners) {
	const owners = liveOwners.map((record) => `${record.ownerKind}:${record.ownerId ?? record.id}`).join(", ");
	const nextStep = owners ? "Wait for active runs to finish or raise worktreeMaxCount in the Gateway configuration." : "Run openclaw worktrees gc to continue cleanup or raise worktreeMaxCount in the Gateway configuration.";
	return /* @__PURE__ */ new Error(`Managed worktree cap ${maxCount} reached${owners ? `; live owners: ${owners}` : ""}. ${nextStep}`);
}
//#endregion
//#region src/agents/worktrees/gc-progress.ts
const MAX_WORKTREE_GC_ISSUES = 64;
var WorktreeGcProgress = class {
	constructor() {
		this.result = {
			removed: [],
			orphansDeleted: 0,
			orphansRetired: 0,
			retiredCheckoutPaths: [],
			snapshotsPruned: 0,
			outcome: "completed",
			issues: [],
			issueCount: 0,
			eligibleCount: 0,
			deferredCount: 0,
			failedCount: 0,
			protectedCount: 0,
			protectionReasons: {},
			limitsSatisfied: null
		};
		this.attemptedIds = /* @__PURE__ */ new Set();
	}
	start(id) {
		if (this.attemptedIds.has(id)) return false;
		this.attemptedIds.add(id);
		return true;
	}
	record(stage, outcome, reason, id) {
		if (id !== void 0 && (stage === "idle" || stage === "limits")) this.attemptedIds.add(id);
		this.result.issueCount += 1;
		if (this.result.issues.length < MAX_WORKTREE_GC_ISSUES) this.result.issues.push({
			...id === void 0 ? {} : { id },
			stage,
			outcome,
			reason: truncateUtf16Safe(reason, 500)
		});
		if (outcome === "failed") this.result.failedCount += 1;
		else if (outcome === "deferred") this.result.deferredCount += 1;
		this.result.outcome = this.result.failedCount > 0 ? "partial" : "deferred";
	}
	protect(stage, id, reason, detail = reason) {
		this.result.protectedCount += 1;
		const counts = this.result.protectionReasons;
		counts[reason] = (counts[reason] ?? 0) + 1;
		this.record(stage, "deferred", detail, id);
	}
	error(stage, error, id) {
		if (stage === "limits" && id && error instanceof WorktreeRemovalContentionError && error.blockedByRun) {
			this.protect(stage, id, "live-refused", `Worktree ${error.blockedByRun.worktreeId} has an active run in pid ${error.blockedByRun.pid}`);
			return;
		}
		if (error instanceof WorktreeBranchMovedError && id && (stage === "idle" || stage === "limits")) {
			this.protect(stage, id, "branch-moved");
			return;
		}
		const reason = classifyWorktreeRemovalError(error);
		const outcome = reason === "busy" || reason === "foreign-lock" || error instanceof OpenClawStateLeaseError && error.code === "OPENCLAW_STATE_LEASE_HELD" ? "deferred" : "failed";
		this.record(stage, outcome, `${reason}: ${formatErrorMessage(error)}`, id);
	}
};
//#endregion
//#region src/agents/worktrees/capacity-owner.ts
const DEFAULT_WORKTREE_MAX_COUNT = 4096;
/** Admission and maintenance share ranking, eviction budgets, and the allocation lease. */
function createWorktreeCapacityOwner({ env, now, getConfig = readRuntimeConfig }) {
	const configuredMaxCount = () => getConfig().worktreeMaxCount ?? DEFAULT_WORKTREE_MAX_COUNT;
	async function admit(guard) {
		const occupied = await readWorktreeSlotCount(env);
		guard.commitGuard();
		const maxCount = configuredMaxCount();
		if (occupied < maxCount) return;
		const progress = new WorktreeGcProgress();
		const ranked = /* @__PURE__ */ new Map();
		const repositories = /* @__PURE__ */ new Map();
		let more;
		do
			({more} = await enforce(maxCount - 1, progress, guard, ranked, repositories));
		while (progress.result.limitsSatisfied !== true && more);
		if (progress.result.limitsSatisfied !== true) {
			const pending = (await readPendingWorktrees(env)).find(({ state }) => state === "pending");
			if (pending) throw new WorktreePendingContentionError(pending.record.id);
			const { records: remainingRecords, leases } = await readWorktreeCleanupState(env);
			const live = new Set(leases.liveScopes);
			throw worktreeCapacityError(maxCount, remainingRecords.filter((record) => record.removedAt === void 0 && live.has(worktreeRunLeaseScope(record.id))));
		}
	}
	async function enforce(maxCount, progress, guard, ranked, repositories) {
		const started = performance.now();
		let attempted = 0;
		let yielded = false;
		const { leases } = await readWorktreeCleanupState(env);
		const live = new Set(leases.liveScopes);
		const cached = (cache, prepare) => async (records) => {
			const missing = records.filter((record) => !cache.has(record.id + worktreeGcRevision(record)));
			for (const [key, value] of await prepare(missing)) cache.set(key, value);
			return records.map((record) => cache.get(record.id + worktreeGcRevision(record)));
		};
		const removed = await enforceWorktreeCleanupLimits({
			env,
			maxCount,
			progress,
			hasLiveLease: (record) => live.has(worktreeRunLeaseScope(record.id)),
			repositories: cached(repositories, (records) => prepareRepositories(records, guard)),
			classify: cached(ranked, (records) => classify(records, guard, repositories)),
			shouldYield: () => yielded = attempted > 0 && (attempted >= 8 || performance.now() - started >= 5e3),
			evict: async (record, reason) => {
				attempted += 1;
				const disposition = await evictManagedWorktree({
					env,
					record,
					reason,
					guard,
					now,
					getConfig
				});
				const counts = progress.result.evictions ??= {};
				counts[disposition] = (counts[disposition] ?? 0) + 1;
			},
			onError: async (record, error) => {
				guard.commitGuard();
				progress.error("limits", error, record.id);
			}
		});
		return {
			removed,
			attempted,
			more: yielded || removed.length > 0
		};
	}
	async function classify(records, guard, repositories, checkpoint) {
		const ranked = /* @__PURE__ */ new Map();
		if (records.length === 0) return ranked;
		const { readKnownWorktreeMergedHeads } = await import("./worktree-merged-heads-BKGtURvE.mjs");
		const config = getConfig();
		for (let offset = 0; offset < records.length; offset += 8) {
			const batch = records.slice(offset, offset + 8);
			const candidates = [];
			for (const record of batch) {
				const repository = repositories.get(record.id + worktreeGcRevision(record));
				candidates.push({
					id: record.id,
					repoRoot: record.repoRoot,
					branch: record.branch,
					head: repository?.heads[path.resolve(record.path)],
					defaultHead: repository?.defaultHead,
					mergedHeads: await readKnownWorktreeMergedHeads(record, config)
				});
			}
			const results = await runGitWorkerOperation({
				type: "worktree.eviction-classify",
				input: { records: candidates }
			}, {
				signal: guard.signal,
				assertCurrent: guard.commitGuard,
				onEffect: () => guard.commitGuard?.()
			});
			for (const [index, candidate] of results.entries()) {
				ranked.set(candidate.id + worktreeGcRevision(batch[index]), candidate);
				await checkpoint?.();
			}
		}
		return ranked;
	}
	async function prepareRepositories(records, guard, checkpoint) {
		const roots = [...new Set(records.map((record) => record.repoRoot))];
		const directories = /* @__PURE__ */ new Map();
		for (let offset = 0; offset < roots.length; offset += 8) {
			const repoRoots = roots.slice(offset, offset + 8);
			const results = await runGitWorkerOperation({
				type: "worktree.eviction-repositories",
				input: { repoRoots }
			}, {
				signal: guard.signal,
				assertCurrent: guard.commitGuard,
				onEffect: () => guard.commitGuard?.()
			});
			for (const directory of results) {
				directories.set(directory.repoRoot, directory);
				await checkpoint?.();
			}
		}
		return new Map(records.map((record) => [record.id + worktreeGcRevision(record), directories.get(record.repoRoot)]));
	}
	async function cleanup(params) {
		const { records, progress, guard, checkpoint } = params;
		const result = progress.result;
		const maxCount = configuredMaxCount();
		if (await readWorktreeSlotCount(env) <= maxCount) {
			result.limitsSatisfied = true;
			return;
		}
		const repositories = await prepareRepositories(records.filter((record) => record.removedAt === void 0), guard, checkpoint);
		const ranked = await classify(records.filter((record) => record.removedAt === void 0 && !params.hasLiveLease(record.id)), guard, repositories, checkpoint);
		do {
			const batch = await withWorktreeAllocationLease({
				...guard,
				env
			}, (allocation) => enforce(maxCount, progress, allocation, ranked, repositories));
			result.removed.push(...batch.removed);
			for (let count = 0; count < Math.max(1, batch.attempted); count += 1) await checkpoint();
			if (!batch.more) break;
		} while (result.limitsSatisfied === false);
	}
	return {
		admit,
		cleanup
	};
}
//#endregion
//#region src/agents/worktrees/checkout-profiles.ts
const PROFILE_DIRECTORY = ".openclaw/worktree-profiles";
const PROFILE_NAME = /^[a-z0-9][a-z0-9-]{0,63}$/u;
const PROFILE_MAX_BYTES = 65536;
/** Resolve repository-owned cone lists without consulting mutable checkout files. */
async function resolveWorktreeSourceProfile(repoRoot, base, names, options) {
	if (names.length === 0 || names.some((name) => typeof name !== "string" || !PROFILE_NAME.test(name))) throw new Error("Select a worktree profile using a lowercase name of up to 64 letters, digits, or hyphens.");
	const assertOwned = () => {
		options.signal?.throwIfAborted();
		options.commitGuard();
	};
	assertOwned();
	const gitOptions = {
		signal: options.signal,
		beforeRun: assertOwned,
		killProcessTree: true
	};
	const commit = await requireGit(repoRoot, [
		"rev-parse",
		"--verify",
		"--end-of-options",
		`${base}^{commit}`
	], gitOptions);
	const directories = /* @__PURE__ */ new Set([PROFILE_DIRECTORY]);
	for (const name of [...new Set(names)].toSorted()) {
		const definition = `${PROFILE_DIRECTORY}/${name}`;
		const entry = await requireGit(repoRoot, [
			"ls-tree",
			"-z",
			commit,
			"--",
			`:(literal)${definition}`
		], {
			...gitOptions,
			maxOutputBytes: 4096,
			terminateOnOutputLimit: true
		});
		const match = /^(?:100644|100755) blob ([a-f0-9]+)\t[^\0]+\0$/u.exec(entry);
		if (!match) throw new Error(`Worktree profile ${definition} must be a tracked regular file at ${commit}.`);
		const contents = await requireGitBuffer(repoRoot, [
			"cat-file",
			"blob",
			match[1]
		], {
			...gitOptions,
			maxOutputBytes: PROFILE_MAX_BYTES
		});
		const text = new TextDecoder("utf-8", { fatal: true }).decode(contents);
		for (const directory of text.split(/\r?\n/u)) {
			if (!directory) continue;
			if (directory.split("/").some((part) => !part || part !== part.trim() || part === "." || part === ".." || part.toLowerCase() === ".git") || containsAsciiControlCharacter(directory) || /[\\:*?[\]!"<>|]/u.test(directory)) throw new Error(`Worktree profile ${definition} contains an invalid cone directory: ${JSON.stringify(directory)}.`);
			directories.add(directory);
		}
	}
	for (const directory of directories) {
		const entry = await requireGitBuffer(repoRoot, [
			"ls-tree",
			"-d",
			"-z",
			commit,
			"--",
			`:(literal)${directory}`
		], {
			...gitOptions,
			maxOutputBytes: PROFILE_MAX_BYTES
		});
		if (!/^040000 tree [a-f0-9]+\t[^\0]+\0$/u.test(entry.toString("utf8"))) throw new Error(`Worktree profile directory ${directory} is not a tracked directory at ${commit}.`);
	}
	assertOwned();
	return {
		commit,
		directories: [...directories].toSorted()
	};
}
//#endregion
//#region src/agents/worktrees/checkout-policy-key.ts
async function resolveWorktreeCheckoutKey(options, scope = "template") {
	const { git, commit } = options;
	if ([
		"GIT_INDEX_FILE",
		"GIT_WORK_TREE",
		"GIT_DIR",
		"GIT_COMMON_DIR",
		"GIT_CONFIG",
		"GIT_ATTR_SOURCE"
	].some((key) => process.env[key])) {
		if (scope === "template") setWorktreePreparationTemplate("unavailable", { reason: "git-environment" });
		return;
	}
	const config = await git.require(options.destination, [
		"config",
		"--null",
		"--list"
	], options.gitOptions);
	const checkoutConfig = [];
	for (const field of config.split("\0")) {
		const key = field.split("\n", 1)[0]?.toLowerCase() ?? "";
		if (key.startsWith("branch.")) continue;
		if (scope === "prompt" && key.startsWith("filter.")) continue;
		if (/^(filter\.|includeif\.|core\.(attributesfile|worktree|sparsecheckout|splitindex)$|index\.sparse$)/u.test(key)) {
			if (scope === "template") setWorktreePreparationTemplate("unavailable", { reason: "checkout-configuration" });
			return;
		}
		checkoutConfig.push(field);
	}
	if (git.sourceOnly) {
		const fields = (await requireGit(options.destination, [
			"config",
			"--null",
			"--show-scope",
			"--list"
		], options.gitOptions)).split("\0");
		checkoutConfig.push(...fields.filter((field, index) => index % 2 === 1 && fields[index - 1] === "worktree" && !field.startsWith("branch.")));
	}
	if (!git.sourceOnly && await worktreePathExists(path.join(options.commonDir, "info", "attributes"))) {
		if (scope === "template") setWorktreePreparationTemplate("unavailable", { reason: "repository-attributes" });
		return;
	}
	const attributePaths = await Promise.allSettled(["GIT_ATTR_GLOBAL", "GIT_ATTR_SYSTEM"].map((variable) => git.run(options.destination, ["var", variable], options.gitOptions)));
	for (const probe of attributePaths) {
		if (probe.status === "rejected") throw probe.reason;
		const result = probe.value;
		if (result.termination === "exit" && result.code === 1 && !result.stdout.trim() && !result.stderr.trim()) continue;
		if (result.termination !== "exit" || result.code !== 0 || result.stdoutTruncatedBytes || result.stdout.trim() && await worktreePathExists(normalizeGitPathForFilesystem(result.stdout.trim()))) {
			if (scope === "template") setWorktreePreparationTemplate("unavailable", { reason: result.code === 0 ? "external-attributes" : "attributes-probe-failed" });
			return;
		}
	}
	return createHash("sha256").update(`source-v2\n${git.sourceOnly}\n${commit}\n${checkoutConfig.join("\0")}`).digest("hex");
}
//#endregion
//#region src/agents/worktrees/checkout-inputs.ts
async function promptPaths(options) {
	const tree = await options.git.worker.buffered(options.destination, [
		"ls-files",
		"-z",
		"--format=%(objectmode) blob %(objectname)%x09%(path)",
		"--",
		":(top,glob)*",
		":(top,icase,glob).agents/**",
		":(top,icase,glob).codex/**",
		":(top,icase,glob)skills/**",
		":(top,icase,glob)users/*/user.md",
		":(top,icase,glob)users/*/.gitattributes",
		":(top,icase)users/.gitattributes"
	], {
		...options.gitOptions,
		maxOutputBytes: 16 * 1024 ** 2
	});
	if (tree.termination === "output-limit") return;
	if (tree.code !== 0 || tree.termination !== "exit") throw createGitCommandError("git ls-files", tree);
	const selected = [];
	for (const entry of parseGitTreePaths(tree.stdout)) {
		const name = entry.path.toString("utf8");
		const normalized = name.toLowerCase();
		if (!Buffer.from(name).equals(entry.path) || normalized === ".worktreeinclude" || normalized === ".codex/config.toml" || path.posix.basename(normalized) === ".gitattributes" && path.posix.basename(name) !== ".gitattributes") return;
		if (normalized.startsWith("users/") && normalized !== "users/.gitattributes" && !/^users\/[a-z0-9][a-z0-9_-]{0,127}\/(?:user\.md|\.gitattributes)$/u.test(normalized)) continue;
		if (!/^100(?:644|755)$/u.test(entry.mode)) return;
		selected.push({
			path: name,
			oid: entry.oid
		});
	}
	if (!selected.length || selected.length > 4096) return;
	const bytes = (await options.git.require(options.repoRoot, ["cat-file", "--batch-check=%(objectsize)"], {
		...options.gitOptions,
		env: { GIT_NO_LAZY_FETCH: "1" },
		input: `${selected.map((entry) => entry.oid).join("\n")}\n`
	})).split("\n").map(Number);
	if (bytes.length !== selected.length || bytes.some((size) => !Number.isSafeInteger(size) || size < 0) || bytes.reduce((total, size) => total + size, 0) > 8 * 1024 ** 2) return;
	return selected.map((entry) => entry.path);
}
/** Materialize immutable prompt inputs; registration and rollback remain with the checkout owner. */
async function prepareWorktreePromptFiles(options) {
	if (!await resolveWorktreeCheckoutKey(options, "prompt")) return false;
	options.onMaterializationStart();
	await options.git.require(options.destination, [
		"read-tree",
		"--no-recurse-submodules",
		options.commit
	], options.checkoutOptions);
	const paths = await promptPaths(options);
	if (!paths) return false;
	const attributes = await options.git.worker.buffered(options.destination, [
		"check-attr",
		"--cached",
		"--all",
		"-z",
		"--stdin"
	], {
		...options.gitOptions,
		input: `${paths.join("\0")}\0`,
		maxOutputBytes: 1024 ** 2
	});
	const fields = splitNullBuffer(attributes.stdout);
	if (!(attributes.code === 0 && attributes.termination === "exit" && fields.length % 3 === 0 && fields.every((field, index) => index % 3 !== 1 || /^(?:text|eol|diff|merge|linguist-[a-z-]+)$/u.test(field.toString("utf8"))))) return false;
	const attributeFiles = paths.filter((name) => path.posix.basename(name) === ".gitattributes").toSorted((a, b) => a.split("/").length - b.split("/").length);
	const files = paths.filter((name) => path.posix.basename(name) !== ".gitattributes");
	for (const batch of [attributeFiles, files]) if (batch.length) await options.git.require(options.destination, [
		"checkout-index",
		"--index",
		"-z",
		"--stdin"
	], {
		...options.checkoutOptions,
		input: `${batch.join("\0")}\0`
	});
	return true;
}
//#endregion
//#region src/agents/worktrees/checkout-materialize.ts
/** Materialization and restore share one filter-safe operation boundary. */
async function materializeManagedWorktree(params, options, indexOptions = options) {
	return await withWorktreeGitConfig(params.destination, params.sourceOnly === true, indexOptions, async (git) => {
		if (params.removeExisting) await git.require(params.destination, [
			"rm",
			"-r",
			"--force",
			"--ignore-unmatch",
			"--",
			"."
		], options);
		const result = await git.run(params.destination, [
			"read-tree",
			"--reset",
			"--no-recurse-submodules",
			"-u",
			params.commit
		], {
			...options,
			env: {
				...options.env,
				GIT_NO_LAZY_FETCH: "1"
			}
		});
		if (result.code === 0 && params.resetIndexTo) await git.require(params.destination, params.sourceOnly ? [
			"read-tree",
			"--reset",
			params.resetIndexTo
		] : ["reset"], indexOptions);
		return result;
	});
}
//#endregion
//#region src/agents/worktrees/checkout.ts
const log$4 = createSubsystemLogger("agents/worktrees");
const btrfsCheckoutMeasurements = /* @__PURE__ */ new Map();
function assertOwned(options) {
	options.signal?.throwIfAborted();
	options.commitGuard();
}
function gitOptions(options) {
	return {
		signal: options.signal,
		beforeRun: () => assertOwned(options),
		killProcessTree: true
	};
}
function checkoutGitOptions(options, cloneBytes) {
	return {
		...gitOptions(options),
		env: { GIT_NO_LAZY_FETCH: "1" },
		refMutationDirectory: options.commonDir,
		startRun: async (run) => {
			assertOwned(options);
			await options.requireSpace(cloneBytes);
			assertOwned(options);
			return await run();
		},
		timeoutMs: WORKTREE_CHECKOUT_TIMEOUT_MS,
		...options.checkoutBudget
	};
}
async function estimateTemplateCloneBytes(template) {
	const index = await fs$1.open(template.sourceIndex, "r");
	try {
		const header = Buffer.alloc(12);
		const { bytesRead } = await index.read(header, 0, header.length, 0);
		const { size } = await index.stat();
		const version = header.readUInt32BE(4);
		const entries = header.readUInt32BE(8);
		if (bytesRead !== 12 || header.toString("ascii", 0, 4) !== "DIRC" || version < 2 || version > 4 || entries > Math.floor((size - 12) / 62)) return;
		return template.backend.estimateCloneBytes(entries, size);
	} finally {
		await index.close();
	}
}
async function prepareTemplate(options) {
	const backend = await detectWorktreeFilesystemBackend(path.dirname(options.destination), options);
	if (!backend) return;
	const commit = options.base;
	let gitMs;
	return await withWorktreeGitConfig(options.destination, options.sourceOnly === true, gitOptions(options), async (git) => {
		setWorktreePreparationTemplate("unavailable", { reason: "checkout-policy" });
		const contentKey = await resolveWorktreeCheckoutKey({
			commonDir: options.commonDir,
			destination: options.destination,
			commit,
			gitOptions: gitOptions(options),
			git
		});
		if (!contentKey) return;
		const cacheKey = createHash("sha256").update(`${options.commonDir}\n${options.worktreeRoot}`).digest("hex");
		const record = await prepareWorktreeTemplate({
			env: options.env,
			now: options.now,
			options,
			cacheKey,
			contentKey,
			repoRoot: options.repoRoot,
			commonDir: options.commonDir,
			worktreeRoot: options.worktreeRoot,
			sourceCommit: commit,
			backend: backend.id,
			reuseOnly: options.deferGitCheckout,
			requireSpace: options.requireSpace,
			validate: async (existing, templateOptions) => {
				if (await resolveWorktreeCheckoutKey({
					...options,
					...templateOptions,
					destination: existing.path,
					commit,
					git,
					gitOptions: gitOptions({
						...options,
						...templateOptions
					})
				}) !== contentKey) return false;
				const status = await git.run(existing.path, [
					"status",
					"--porcelain=v2",
					"--branch",
					"-z",
					"--untracked-files=all",
					"--ignored"
				], gitOptions(templateOptions));
				const fields = status.stdout.split("\0");
				const heads = fields.filter((field) => field.startsWith("# branch.oid "));
				return status.termination === "exit" && status.code === 0 && !status.stdoutTruncatedBytes && fields.pop() === "" && fields.every((field) => field.startsWith("# ")) && heads.length === 1 && heads[0] === `# branch.oid ${commit}`;
			},
			prepare: async (preparing, templateOptions) => {
				await options.requireSpace();
				setWorktreePreparationTemplate("cold", { reason: "template-create" });
				await backend.createTemplate(preparing.path, templateOptions);
				await git.require(options.repoRoot, [
					"worktree",
					"add",
					"--detach",
					"--no-checkout",
					"--",
					preparing.path,
					commit
				], checkoutGitOptions({
					...options,
					...templateOptions
				}));
				if (await resolveWorktreeCheckoutKey({
					...options,
					...templateOptions,
					destination: preparing.path,
					commit,
					git,
					gitOptions: gitOptions({
						...options,
						...templateOptions
					})
				}) !== contentKey) throw new Error("Template and target checkout configurations differ");
				setWorktreePreparationTemplate("cold", { reason: "template-checkout" });
				const started = performance.now();
				await git.require(preparing.path, [
					"read-tree",
					"--reset",
					"--no-recurse-submodules",
					"-u",
					commit
				], checkoutGitOptions({
					...options,
					...templateOptions
				}));
				gitMs = performance.now() - started;
				if (backend.id === "btrfs") btrfsCheckoutMeasurements.set(preparing.cacheKey, {
					commit,
					sourceOnly: options.sourceOnly === true,
					gitMs
				});
			}
		});
		try {
			return record ? {
				record,
				backend,
				gitMs,
				sourceIndex: await resolveGitMetadataPath(record.path, "index", gitOptions(options))
			} : void 0;
		} catch (error) {
			await record?.release(error);
			throw error;
		}
	});
}
/** Git owns registration, branches and indexes; the backend only materializes files. */
async function addManagedWorktree(input) {
	const existingBranch = typeof input.branch === "object" ? input.branch.name : void 0;
	const createdBranch = typeof input.branch === "string" ? input.branch : void 0;
	const expectedRef = existingBranch ? `refs/heads/${existingBranch}` : void 0;
	const expectedCommit = expectedRef ? await requireGit(input.repoRoot, [
		"rev-parse",
		"--verify",
		`${input.base}^{commit}`
	], gitOptions(input)) : void 0;
	const assertExistingSeed = async () => {
		if (!expectedRef) return;
		await requireGit(input.repoRoot, ["check-ref-format", expectedRef], gitOptions(input));
		const actual = await requireGit(input.repoRoot, [
			"rev-parse",
			"--verify",
			expectedRef
		], gitOptions(input));
		const worktrees = await requireGit(input.repoRoot, [
			"worktree",
			"list",
			"--porcelain",
			"-z"
		], gitOptions(input));
		if (actual !== expectedCommit || worktrees.split("\0").includes(`branch ${expectedRef}`)) throw new Error("Caller-owned worktree branch moved or is in use; preserve it for recovery.");
	};
	await assertExistingSeed();
	const profile = input.sourceProfile;
	if (input.sourceOnly && profile) throw new Error("Source-only session checkouts do not support repository source profiles");
	if (profile) {
		if (input.deferGitCheckout || await worktreePathExists(input.destination)) throw new Error("Source profiles require a fresh destination; preserve existing work and choose a new path.");
		if (await requireGit(input.repoRoot, [
			"rev-parse",
			"--verify",
			`${input.base}^{commit}`
		], gitOptions(input)) !== profile.commit) throw new Error("Worktree source profile does not match the checkout commit.");
	}
	await assertExistingSeed();
	const added = await timeWorktreePreparationPhase("registration", () => runGit(input.repoRoot, [
		"worktree",
		"add",
		"--no-checkout",
		...existingBranch ? [] : createdBranch ? ["-b", createdBranch] : ["--detach"],
		"--",
		input.destination,
		existingBranch ?? input.base
	], checkoutGitOptions(input, 0)));
	if (added.code !== 0) return added;
	const rollbackGuard = input.rollbackGuard ?? input.commitGuard;
	const rollbackOptions = {
		beforeRun: rollbackGuard,
		killProcessTree: true
	};
	const absolute = await resolveGitMetadataPath(input.destination, ".", rollbackOptions);
	const relative = path.relative(input.repoRoot, absolute);
	const gitDir = Buffer.byteLength(relative) < Buffer.byteLength(absolute) ? relative : absolute;
	const readRegistration = (commandOptions) => requireGit(input.repoRoot, [
		"--git-dir",
		gitDir,
		"rev-parse",
		"HEAD",
		"--symbolic-full-name",
		"HEAD"
	], commandOptions);
	const registration = await readRegistration(rollbackOptions);
	const [commit, headRef] = registration.split("\n");
	const expectedHeadRef = expectedRef ?? (createdBranch ? `refs/heads/${createdBranch}` : "HEAD");
	if (!commit || headRef !== expectedHeadRef || expectedCommit && commit !== expectedCommit) throw new Error("Worktree registration changed during creation; preserve it for recovery.");
	const options = {
		...input,
		base: commit
	};
	let preserve = Boolean(existingBranch);
	let materializationStarted = false;
	const assertRegistration = async (commandOptions = gitOptions(options)) => {
		if (await readRegistration(commandOptions) !== registration) {
			preserve = true;
			throw new Error("Worktree HEAD changed during preparation; preserve it for recovery.");
		}
	};
	const assertUnprepared = async (commandOptions) => {
		const entries = await fs$1.readdir(options.destination);
		if (entries.length !== 1 || entries[0] !== ".git") {
			preserve = true;
			throw new Error("Worktree target is no longer unprepared; preserve it and choose a new path.");
		}
		await assertRegistration(commandOptions);
	};
	const checkout = async () => {
		await assertRegistration();
		materializationStarted = true;
		const result = await materializeManagedWorktree({
			destination: options.destination,
			commit,
			sourceOnly: options.sourceOnly
		}, checkoutGitOptions(options));
		if (result.code === 0) await assertRegistration();
		return result.code === 0 ? added : result;
	};
	let retainedTemplate;
	const measurementKey = createHash("sha256").update(`${options.commonDir}\n${options.worktreeRoot}`).digest("hex");
	let sampledGit;
	const prepare = async () => {
		if (profile && commit !== profile.commit) {
			preserve = true;
			throw new Error("Worktree source commit changed before sparse materialization; preserve it for recovery.");
		}
		const checkoutBytes = await options.prepareCommit?.(commit);
		let template;
		let cloneBytes;
		let measurement = btrfsCheckoutMeasurements.get(measurementKey);
		if (measurement?.commit !== commit || measurement.sourceOnly !== (options.sourceOnly === true)) {
			measurement = void 0;
			btrfsCheckoutMeasurements.delete(measurementKey);
		}
		let templatePrepareMs = 0;
		const measuredSlower = measurement?.useTemplate === false;
		setWorktreePreparationTemplate("unavailable", { reason: !options.enabled ? "disabled" : measuredSlower ? "measured-git-faster" : checkoutBytes === 0 ? "empty-checkout" : profile ? "source-profile" : "template-prepare" });
		if (options.enabled && !measuredSlower && checkoutBytes !== 0 && !profile) try {
			const started = performance.now();
			template = retainedTemplate = await timeWorktreePreparationPhase("templatePrepare", () => prepareTemplate(options));
			cloneBytes = template ? await estimateTemplateCloneBytes(template) : void 0;
			templatePrepareMs = performance.now() - started;
			if (template) setWorktreePreparationTemplate(void 0, {
				reason: "ready",
				cloneBytes
			});
		} catch (error) {
			if (hasWorktreeUnknownOutcome(error)) throw error;
			assertOwned(options);
			setWorktreePreparationTemplate("unavailable", { errorCode: error instanceof Error && "code" in error ? String(error.code) : "unknown" });
			log$4.warn(`worktree acceleration unavailable; using Git checkout: ${String(error)}`);
		}
		measurement = btrfsCheckoutMeasurements.get(measurementKey);
		const sampleGit = template?.backend.id === "btrfs" && !measurement && template.gitMs === void 0 && !options.deferGitCheckout;
		if (sampleGit) {
			measurement = {
				commit,
				sourceOnly: options.sourceOnly === true
			};
			sampledGit = measurement;
			btrfsCheckoutMeasurements.set(measurementKey, measurement);
			template = void 0;
			cloneBytes = void 0;
			setWorktreePreparationTemplate("unavailable", { reason: "measurement-git-baseline" });
		}
		assertOwned(options);
		try {
			await options.requireSpace(cloneBytes);
		} catch (error) {
			if (!template) throw error;
			await options.requireSpace();
			setWorktreePreparationTemplate("unavailable", {
				reason: "clone-disk-admission",
				cloneBytes
			});
			template = void 0;
			cloneBytes = void 0;
		}
		await assertUnprepared(gitOptions(options));
		if (profile) {
			preserve = true;
			await requireGit(options.destination, [
				"sparse-checkout",
				"set",
				"--cone",
				"--no-sparse-index",
				"--stdin"
			], {
				...checkoutGitOptions(options),
				input: `${profile.directories.join("\n")}\n`
			});
			const result = await checkout();
			if (result.code !== 0) throw createGitCommandError("git read-tree", result);
			return result;
		}
		if (!template) {
			const started = performance.now();
			if (!options.deferGitCheckout && options.onPromptReady && await withWorktreeGitConfig(options.destination, options.sourceOnly === true, gitOptions(options), (git) => prepareWorktreePromptFiles({
				repoRoot: options.repoRoot,
				commonDir: options.commonDir,
				commit,
				destination: options.destination,
				git,
				gitOptions: gitOptions(options),
				checkoutOptions: checkoutGitOptions(options),
				onMaterializationStart: () => {
					materializationStarted = true;
				}
			}))) {
				await assertRegistration();
				assertOwned(options);
				await options.onPromptReady(commit);
				assertOwned(options);
			}
			const result = options.deferGitCheckout ? added : await checkout();
			if (sampleGit && measurement && result.code === 0) measurement.gitMs = performance.now() - started;
			return result;
		}
		const templateStarted = performance.now();
		const destinationIndex = path.resolve(options.repoRoot, normalizeGitPathForFilesystem(await requireGit(options.repoRoot, [
			"--git-dir",
			gitDir,
			"rev-parse",
			"--git-path",
			"index"
		], gitOptions(options))));
		const markerPath = path.join(options.destination, ".git");
		const marker = await fs$1.readFile(markerPath);
		let destinationRemoved = false;
		try {
			assertOwned(options);
			await fs$1.unlink(markerPath);
			assertOwned(options);
			await fs$1.rmdir(options.destination);
			destinationRemoved = true;
			materializationStarted = true;
			await options.requireSpace(cloneBytes);
			const { backend, record } = template;
			await timeWorktreePreparationPhase("templateApply", () => backend.cloneTemplate(record.path, options.destination, options));
			const cloneCompletedAtMs = Date.now();
			await assertRegistration();
			assertOwned(options);
			await fs$1.unlink(markerPath);
			assertOwned(options);
			await fs$1.writeFile(markerPath, marker);
			let copied = false;
			if (template.backend.id === "apfs") {
				const { copyApfsCloneIndex } = await import("./checkout-apfs-hCzOlyOr.mjs");
				copied = await copyApfsCloneIndex(template.record.path, options.destination, template.sourceIndex, destinationIndex, {
					...options,
					cloneCompletedAtMs
				});
			}
			if (!copied) {
				assertOwned(options);
				const sourceIndex = await fs$1.realpath(template.sourceIndex);
				const [sourceRoot, destinationRoot] = await Promise.all([root(path.dirname(sourceIndex)), root(path.dirname(destinationIndex))]);
				await destinationRoot.copyIn(path.basename(destinationIndex), {
					root: sourceRoot,
					relativePath: `./${path.basename(sourceIndex)}`
				}, {
					clone: "auto",
					durable: false,
					mkdir: false,
					overwrite: true,
					preserveSourceMode: true,
					sourceHardlinks: "allow",
					signal: options.signal,
					assertBeforeMutation: () => assertOwned(options)
				});
			}
			await timeWorktreePreparationPhase("indexRefresh", () => withWorktreeGitConfig(options.destination, options.sourceOnly === true, gitOptions(options), (git) => git.require(options.destination, ["update-index", "--refresh"], {
				...gitOptions(options),
				timeoutMs: WORKTREE_CHECKOUT_TIMEOUT_MS,
				...options.checkoutBudget
			})));
		} catch (error) {
			if (hasWorktreeUnknownOutcome(error)) throw error;
			rollbackGuard();
			await assertRegistration(rollbackOptions);
			if (existingBranch) throw new Error("Caller-owned worktree clone failed; preserve its registration and partial checkout for recovery.", { cause: error });
			if (!destinationRemoved) {
				preserve = true;
				if (!await worktreePathExists(markerPath)) {
					rollbackGuard();
					await fs$1.writeFile(markerPath, marker, { flag: "wx" });
				}
				throw error;
			}
			rollbackGuard();
			await fs$1.rm(options.destination, {
				recursive: true,
				force: true
			});
			rollbackGuard();
			await fs$1.mkdir(options.destination);
			rollbackGuard();
			await fs$1.writeFile(markerPath, marker);
			assertOwned(options);
			setWorktreePreparationTemplate("unavailable", {
				reason: "clone-failed",
				errorCode: error instanceof Error && "code" in error ? String(error.code) : "unknown"
			});
			log$4.warn(`worktree snapshot failed; using Git checkout: ${String(error)}`);
			if (options.deferGitCheckout) {
				await options.requireSpace();
				return added;
			}
			return await checkout();
		}
		await assertRegistration();
		if (template.backend.id === "btrfs" && measurement?.gitMs !== void 0 && measurement.useTemplate === void 0 && template.gitMs === void 0) {
			const templateMs = templatePrepareMs + performance.now() - templateStarted;
			measurement.useTemplate = templateMs <= measurement.gitMs + 250;
			log$4.info(`worktree checkout measured: using ${measurement.useTemplate ? "btrfs" : "Git"} (template=${Math.round(templateMs)}ms git=${Math.round(measurement.gitMs)}ms)`);
		}
		return {
			...added,
			templateCloned: true
		};
	};
	let outcome;
	try {
		outcome = { result: await prepare() };
	} catch (error) {
		outcome = { error };
	}
	if (sampledGit && sampledGit.gitMs === void 0 && btrfsCheckoutMeasurements.get(measurementKey) === sampledGit) btrfsCheckoutMeasurements.delete(measurementKey);
	await retainedTemplate?.record.release("error" in outcome ? outcome.error : void 0);
	const failures = "error" in outcome ? [outcome.error] : [];
	if (("error" in outcome || outcome.result.code !== 0) && !preserve && !("error" in outcome && hasWorktreeUnknownOutcome(outcome.error))) try {
		rollbackGuard();
		await assertRegistration(rollbackOptions);
		if (!materializationStarted) await assertUnprepared(rollbackOptions);
		await removeFailedCheckout({
			...options,
			signal: void 0,
			commitGuard: rollbackGuard
		});
	} catch (error) {
		failures.push(error);
	}
	if (failures.length > 1) {
		const failure = new AggregateError(failures, failures.map(String).join("\n"), { cause: failures[0] });
		const primary = failures[0];
		if (primary instanceof OpenClawStateLeaseError) throw new OpenClawStateLeaseError(primary.message, {
			code: primary.code,
			cause: failure
		});
		throw failure;
	}
	if ("error" in outcome) throw outcome.error;
	if (failures.length === 1) throw failures[0];
	return outcome.result;
}
async function removeFailedCheckout(options) {
	assertOwned(options);
	await requireGit(options.repoRoot, [
		"worktree",
		"remove",
		"--force",
		options.destination
	], gitOptions(options));
	if (typeof options.branch === "string") {
		assertOwned(options);
		await requireGit(options.repoRoot, [
			"branch",
			"-D",
			options.branch
		], gitOptions(options));
	}
}
//#endregion
//#region src/agents/worktrees/gc-artifacts.ts
const log$3 = createSubsystemLogger("agents/worktrees");
async function collectRetiredWorktreeArtifacts({ env, getConfig, records, expiresBefore, progress, orphanFailures, withAllocationLease }) {
	const context = captureWorktreeRunEndContext(env);
	let orphansDeleted = 0;
	let snapshotsPruned = 0;
	const pending = await readPendingWorktrees(context.environment);
	const expired = records.filter((record) => record.removedAt !== void 0 && record.removedAt < expiresBefore);
	const entries = await fs$1.readdir(path.join(resolveStateDir(context.environment), "worktrees"), { withFileTypes: true }).catch((error) => {
		if (isMissingPathError(error)) return [];
		progress.error("orphans", error);
	});
	const hasOrphanCandidates = entries?.some((entry) => entry.isDirectory() && entry.name !== ".templates") ?? false;
	if (entries && !hasOrphanCandidates) orphanFailures.clear();
	if (hasOrphanCandidates || expired.length > 0 || pending.length > 0) try {
		await withAllocationLease(async (guard) => {
			const slots = await readPendingWorktrees(context.environment);
			for (const { record, state } of slots) {
				if (state !== "recovering") continue;
				progress.result.retiredCheckoutPaths.push(record.path);
				progress.error("orphans", /* @__PURE__ */ new Error(`Interrupted worktree creation retained at ${record.path}; inspect its Git registration and native processes before manual recovery`), record.id);
			}
			if (hasOrphanCandidates) try {
				const pendingRecords = slots.map(({ record }) => record);
				const currentRecords = await readRegistryWorktrees(context.environment, {}, context);
				context.admission.assertCurrent();
				guard.signal?.throwIfAborted();
				guard.commitGuard?.();
				orphansDeleted = await reconcileOrphans(context.environment, getConfig, [...pendingRecords, ...currentRecords], pendingRecords.map((record) => record.path), guard, progress, orphanFailures);
			} catch (error) {
				progress.error("orphans", error);
				log$3.warn(`worktree orphan cleanup deferred: ${String(error)}`);
			}
			for (const record of expired) try {
				if (await retireExpiredManagedWorktreeSnapshot({
					env,
					id: record.id,
					expiresBefore,
					guard
				})) snapshotsPruned += 1;
			} catch (error) {
				progress.error("snapshots", error, record.id);
				log$3.warn(`snapshot retention failed for ${record.id}: ${String(error)}`);
			}
		});
	} catch (error) {
		progress.error("orphans", error);
		log$3.warn(`worktree cleanup deferred: ${String(error)}`);
	}
	return {
		orphansDeleted,
		snapshotsPruned
	};
}
async function restoreOrphanDirectoryWriteAccess(root, assertCurrent) {
	const uid = process.getuid?.();
	if (uid === void 0) return;
	const visit = async (directory) => {
		const stat = await fs$1.lstat(directory);
		if (!stat.isDirectory() || stat.uid !== uid) return;
		const canonical = await fs$1.realpath(directory);
		if (!isPathInside(root, canonical)) throw new Error(`Orphan directory escaped removal root: ${directory}`);
		if ((stat.mode & 128) === 0) {
			const handle = await fs$1.open(directory, constants.O_RDONLY | constants.O_DIRECTORY | constants.O_NOFOLLOW);
			try {
				const current = await handle.stat();
				if (current.uid !== uid || current.dev !== stat.dev || current.ino !== stat.ino) throw new Error(`Orphan directory changed during permission repair: ${directory}`);
				assertCurrent();
				await handle.chmod(current.mode | 128);
			} finally {
				await handle.close();
			}
		}
		for (const entry of await fs$1.readdir(directory, { withFileTypes: true })) if (entry.isDirectory()) await visit(path.join(directory, entry.name));
	};
	await visit(root);
}
async function reconcileOrphans(env, getConfig, records, pendingPaths, guard, progress, orphanFailures) {
	const managedPaths = await resolveManagedWorktreePathKeys(records);
	if (!managedPaths) return 0;
	for (const pendingPath of pendingPaths) managedPaths.add(process.platform === "win32" ? pendingPath.toLowerCase() : pendingPath);
	const worktreesRoot = path.join(resolveStateDir(env), "worktrees");
	const fingerprints = await fs$1.readdir(worktreesRoot, { withFileTypes: true });
	if (fingerprints.length === 0) return 0;
	const defaultRoot = await canonicalPathKey(worktreesRoot);
	const customRoots = /* @__PURE__ */ new Set();
	for (const root of [getConfig?.().worktreeRoot, ...records.map((record) => path.dirname(path.dirname(record.path)))]) {
		if (!root) continue;
		try {
			const canonical = await canonicalPathKey(root);
			if (canonical !== defaultRoot) customRoots.add(canonical);
		} catch (error) {
			if (!isMissingPathError(error)) throw error;
		}
	}
	let deleted = 0;
	const candidates = /* @__PURE__ */ new Set();
	const assertCurrent = () => {
		guard.signal?.throwIfAborted();
		guard.commitGuard?.();
	};
	for (const fingerprint of fingerprints) {
		if (!fingerprint.isDirectory() || fingerprint.name === ".templates") continue;
		const fingerprintPath = path.join(defaultRoot, fingerprint.name);
		if (await shouldPreserveOrphanCandidate(fingerprintPath, managedPaths, customRoots)) continue;
		const names = await fs$1.readdir(fingerprintPath, { withFileTypes: true }).catch((error) => {
			if (isMissingPathError(error)) return [];
			progress.error("orphans", error, fingerprintPath);
		});
		if (!names) {
			for (const candidate of orphanFailures.keys()) if (isPathInside(fingerprintPath, candidate)) candidates.add(candidate);
			continue;
		}
		for (const name of names) {
			if (!name.isDirectory()) continue;
			const candidate = path.join(fingerprintPath, name.name);
			if (await shouldPreserveOrphanCandidate(candidate, managedPaths, customRoots)) continue;
			candidates.add(candidate);
			const source = await fs$1.lstat(candidate);
			const previous = orphanFailures.get(candidate);
			if (previous) {
				if (source.dev === previous.dev && source.ino === previous.ino) {
					progress.error("orphans", previous.error, candidate);
					continue;
				}
				orphanFailures.delete(candidate);
			}
			try {
				assertCurrent();
				try {
					await fs$1.rm(candidate, {
						recursive: true,
						force: true
					});
				} catch (error) {
					if (!isWorktreePermissionError(error)) throw error;
					const current = await fs$1.lstat(candidate);
					if (!current.isDirectory() || current.dev !== source.dev || current.ino !== source.ino) throw new Error(`Orphan removal root changed during cleanup: ${candidate}`, { cause: error });
					await restoreOrphanDirectoryWriteAccess(candidate, assertCurrent);
					assertCurrent();
					await fs$1.rm(candidate, {
						recursive: true,
						force: true
					});
				}
				orphanFailures.delete(candidate);
				deleted += 1;
			} catch (error) {
				assertCurrent();
				const stat = await fs$1.lstat(candidate).catch(() => void 0);
				if (stat?.dev === source.dev && stat.ino === source.ino) orphanFailures.set(candidate, {
					dev: stat.dev,
					ino: stat.ino,
					error
				});
				progress.error("orphans", error, candidate);
				log$3.warn(`worktree orphan cleanup deferred for ${candidate}; repair access and run openclaw worktrees gc --retry-deferred: ${String(error)}`);
			}
		}
		if (!pendingPaths.some((pendingPath) => isPathInside(fingerprintPath, pendingPath))) {
			guard.commitGuard?.();
			await fs$1.rmdir(fingerprintPath).catch(() => void 0);
		}
	}
	for (const candidate of orphanFailures.keys()) if (!candidates.has(candidate)) orphanFailures.delete(candidate);
	return deleted;
}
//#endregion
//#region src/agents/worktrees/checkout-inspection.ts
/** A broken link is orphaned only when its original repository is still available. */
async function hasMissingManagedWorktreeGitdir(record) {
	const link = await fs$1.readFile(path.join(record.path, ".git"), "utf8");
	const target = /^gitdir: (.+)\r?\n?$/u.exec(link)?.[1]?.trim();
	if (!target) return false;
	const gitdir = path.resolve(record.path, target);
	if (await worktreePathExists(gitdir)) return false;
	const repository = await resolveRepository(record.repoRoot);
	return repository.fingerprint === record.repoFingerprint && path.dirname(gitdir) === path.join(repository.commonDir, "worktrees");
}
async function inspectManagedWorktreeCheckout(record, kind, context) {
	const input = kind === "nested-repository" ? {
		kind,
		checkoutPath: record.path
	} : {
		kind,
		checkoutPath: record.path,
		provisionedPaths: await getRegistryWorktreeProvisionedPaths(context.env, record.id)
	};
	const guard = {
		signal: context.signal,
		assertCurrent: context.beforeRun
	};
	if (input.kind === "provisioned" && input.provisionedPaths !== void 0) return await runGitWorkerOperation({
		type: "worktree.cleanup-inspection",
		input
	}, guard);
	return await withManagedWorktreeGit({
		record,
		...context
	}, async (git) => runGitWorkerOperation({
		type: "worktree.cleanup-inspection",
		input
	}, {
		...guard,
		git: git.worker
	}));
}
//#endregion
//#region src/agents/worktrees/registry-retirement.ts
function isWorktreeRemovalTimeout(error) {
	for (let cause = error; cause instanceof Error; cause = cause.cause) if (cause instanceof GitCommandTimeoutError) return true;
	return false;
}
/** Keep a failed attempt with the registry revision that still owns its checkout. */
async function deferFailedWorktreeRemoval(params) {
	const assertClaim = params.claimToken ? createWorktreeRemovalClaimsGuard(params.env, [params.id], params.claimToken) : void 0;
	const assertCurrent = () => {
		params.assertCurrent();
		assertClaim?.();
	};
	const observed = await readRegistryWorktreeForMutation({
		env: params.env,
		id: params.id,
		commitGuard: assertCurrent
	});
	if (!observed || observed.removedAt !== void 0) return;
	const attempts = Math.min(params.previousAttempts + 1, Number.MAX_SAFE_INTEGER);
	const retry = {
		stage: params.stage,
		elapsedMs: params.elapsedMs,
		attempts,
		retryAt: params.now + Math.min(24, 2 ** Math.min(attempts, 5)) * 60 * 6e4
	};
	return await deferWorktreeCleanup(params.env, {
		observed,
		reason: params.reason,
		retry,
		removalToken: params.claimToken
	}, assertCurrent) ? retry : void 0;
}
async function deferWorktreeCleanup(env, input, assertCurrent) {
	return await mutateCleanupRecord(env, {
		type: "worktrees.deferCleanup",
		input
	}, assertCurrent);
}
async function retireMissingRegistryWorktree(env, observed, removedAt, assertCurrent) {
	return await mutateCleanupRecord(env, {
		type: "worktrees.retireMissing",
		input: {
			observed,
			removedAt
		}
	}, assertCurrent);
}
async function mutateCleanupRecord(env, command, assertCurrent) {
	const context = captureWorktreeRunEndContext(env);
	const captured = structuredClone(command);
	const mutation = captureWorktreeRegistryMutation(context, [{
		id: captured.input.observed.id,
		fields: [captured.type === "worktrees.retireMissing" ? "removal" : "cleanup"]
	}]);
	return await withWorktreeRunEnd(env, async () => {
		try {
			return await runWorktreeRegistryCommand(context, (scope) => scope.execute(captured), {
				assertCurrent: () => mutation.assertAuthority(() => assertCurrent?.()),
				mutation,
				unknownMessage: "Worktree retirement outcome is unknown",
				recover: (committed) => {
					if (committed.result.kind === "unknown") throw new SqliteWorkerError("Worktree retirement committed but its result is unavailable; reread the registry", "unavailable");
					return { value: committed.result.value };
				}
			});
		} catch (error) {
			retainWorktreeRunEndFailure(error);
			throw error;
		}
	});
}
//#endregion
//#region src/agents/worktrees/gc-removal.ts
const log$2 = createSubsystemLogger("agents/worktrees");
async function removeWorktreeIfLossless(params) {
	const assertCurrent = () => {
		params.signal?.throwIfAborted();
		params.commitGuard?.();
	};
	const { env, now, getConfig } = params;
	let record = params.record;
	const { id } = record;
	const claimToken = randomUUID();
	const recordOutcome = async (outcome, error) => {
		await updateRegistryWorktree(env, id, { runEndCleanup: {
			outcome,
			at: now(),
			...outcome === "failed" ? { reason: truncateUtf16Safe(formatErrorMessage(error), 500) } : {}
		} }, {
			onlyIfLive: true,
			onlyIfActiveAt: record.lastActiveAt,
			assertCurrent,
			workerAuthority: params.workerAuthority ?? { assertCurrent }
		});
	};
	let claimed = false;
	try {
		await claimWorktreeRemoval(env, {
			worktreeId: id,
			token: claimToken,
			assertCurrent,
			workerAuthority: {
				...params.workerAuthority,
				assertCurrent: params.workerAuthority ? params.workerAuthority.assertCurrent : assertCurrent,
				predicates: [...params.workerAuthority?.predicates ?? [], {
					kind: "binding",
					record
				}]
			}
		});
		claimed = true;
		record = await params.prepareRecord(record);
		const inspectedHead = await requireManagedWorktreeHead(record, {
			signal: params.signal,
			beforeRun: assertCurrent
		});
		const inspection = await inspectManagedWorktreeCheckout(record, "lossless", {
			env,
			getConfig,
			signal: params.signal,
			beforeRun: assertCurrent
		});
		assertCurrent();
		const retainedOutcome = inspection.retainedReason === "nested-repository" ? "retained-dirty" : inspection.retainedReason === void 0 ? void 0 : `retained-${inspection.retainedReason}`;
		if (retainedOutcome) {
			await abortWorktreeRemovalRow(env, id, claimToken);
			await recordOutcome(retainedOutcome);
			return false;
		}
		return (await params.remove({
			id,
			claimToken,
			inspectedHead
		})).removed;
	} catch (error) {
		if (hasSqliteWorkerOutcomeUnknown(error)) throw error;
		if (claimed) await abortWorktreeRemovalRow(env, id, claimToken);
		else if (error instanceof WorktreeRemovalContentionError) {
			if (error.kind !== "finalized") await recordOutcome("retained-busy");
			return false;
		}
		try {
			await recordOutcome("failed", error);
		} catch (outcomeError) {
			if (hasSqliteWorkerOutcomeUnknown(outcomeError)) throw outcomeError;
		}
		throw error;
	}
}
async function deferWorktreeGcRecord(env, record, reason, assertCurrent) {
	if (await deferWorktreeCleanup(env, {
		observed: record,
		reason
	}, assertCurrent) && reason !== null) log$2.warn(`cleanup deferred for ${record.id}: ${reason}; checkout preserved at ${record.path}. After repair, run openclaw worktrees gc --retry-deferred to retry.`);
}
function assertOwnerPolicyAllowsCleanup(record, params, retiredOwner = false) {
	if (record.ownerId === void 0) return;
	const current = params.readOwnerState?.(record.ownerKind, record.ownerId);
	if (current === "active" || retiredOwner && current !== "retired") throw new WorktreeRemovalLockError("busy", "worktree owner became active during cleanup");
}
function createWorktreeGcRemoval(context) {
	const { env, now, progress, policy, assertCurrent, signal } = context;
	const registryContext = captureWorktreeRunEndContext(env);
	const repositoryFailures = /* @__PURE__ */ new Map();
	for (const record of context.records) {
		if (record.removedAt !== void 0 || record.gcRetry?.stage !== "repository-corrupt") continue;
		const previous = repositoryFailures.get(record.repoRoot);
		repositoryFailures.set(record.repoRoot, {
			attempts: Math.max(previous?.attempts ?? 0, record.gcRetry.attempts),
			reason: previous?.reason ?? (!policy.retryDeferred && now < record.gcRetry.retryAt ? record.gcProtection : void 0)
		});
	}
	const withOwnerCleanup = (record, run) => policy.withOwnerCleanup ? policy.withOwnerCleanup(record, run, signal) : run((mutation) => mutation());
	const prepareOwnerCurrent = async (record, retiredOwner = false) => {
		const assertRegistryCurrent = await prepareWorktreeRegistryGuard(registryContext, {
			predicates: [{
				kind: "activity",
				id: record.id,
				lastActiveAt: record.lastActiveAt
			}],
			assertCurrent
		});
		return () => {
			assertRegistryCurrent();
			assertOwnerPolicyAllowsCleanup(record, policy, retiredOwner);
		};
	};
	const ownerGuard = (record, commitGuard) => ({
		id: record.id,
		signal,
		workerAuthority: {
			assertCurrent: commitGuard,
			predicates: [{
				kind: "activity",
				id: record.id,
				lastActiveAt: record.lastActiveAt
			}]
		},
		commitGuard
	});
	const handleError = async (record, initialError, retiredOwner = false, withOwnerMutation = (mutation) => mutation()) => {
		assertCurrent?.();
		const retainUnreadable = (error) => {
			if (!isWorktreePermissionError(error)) return false;
			progress.protect("idle", record.id, "unreadable", `unreadable: ${formatErrorMessage(error)}`);
			return true;
		};
		if (retainUnreadable(initialError)) return;
		if (isWorktreeRepositoryCorruptionError(initialError)) {
			const reason = `Repository ${record.repoRoot} has missing or corrupt Git objects; repair its object storage, then run openclaw worktrees gc --retry-deferred`;
			const previousAttempts = repositoryFailures.get(record.repoRoot)?.attempts ?? 0;
			const retry = await withOwnerMutation(async () => deferFailedWorktreeRemoval({
				env,
				id: record.id,
				stage: "repository-corrupt",
				reason,
				elapsedMs: 0,
				now,
				previousAttempts,
				assertCurrent: await prepareOwnerCurrent(record, retiredOwner)
			}));
			if (retry) {
				repositoryFailures.set(record.repoRoot, {
					attempts: retry.attempts,
					reason
				});
				log$2.warn(`${reason}; next automatic retry at ${new Date(retry.retryAt).toISOString()}: ${formatErrorMessage(initialError)}`);
			}
			progress.error("idle", `${reason}: ${formatErrorMessage(initialError)}`, record.id);
			return;
		}
		let error = initialError;
		if (error instanceof WorktreeBranchMovedError) await deferWorktreeGcRecord(env, record, "branch-moved", assertCurrent);
		else {
			try {
				if (await hasMissingManagedWorktreeGitdir(record)) {
					const token = randomUUID();
					const assertOwnerCurrent = await prepareOwnerCurrent(record, retiredOwner);
					const custody = {
						env,
						...ownerGuard(record, assertOwnerCurrent)
					};
					await withOwnerMutation(() => claimWorktreeRemoval(env, {
						worktreeId: record.id,
						token,
						assertCurrent: custody.commitGuard,
						workerAuthority: custody.workerAuthority
					}));
					try {
						await withWorktreeAllocationLease(custody, async (guard) => {
							const assertClaim = createWorktreeRemovalClaimsGuard(env, [record.id], token);
							if (!await hasMissingManagedWorktreeGitdir(record)) throw new WorktreeRemovalLockError("busy", "worktree Git metadata changed during cleanup");
							const retired = await withOwnerMutation(() => retireMissingRegistryWorktree(env, record, now, () => {
								guard.commitGuard?.();
								assertClaim();
							}));
							if (retired.protection) {
								progress.protect("idle", record.id, retired.protection);
								return;
							}
							if (retired.record?.removedAt !== now) throw new WorktreeRemovalLockError("busy", "worktree retirement was not admitted");
							progress.result.orphansRetired += 1;
							progress.result.retiredCheckoutPaths.push(record.path);
							progress.record("orphans", "retired", `missing-gitdir; checkout files preserved at ${record.path}`, record.id);
						});
					} finally {
						await abortWorktreeRemovalRow(env, record.id, token);
					}
					return;
				}
			} catch (retirementError) {
				assertCurrent?.();
				if (retainUnreadable(retirementError)) return;
				if (retirementError instanceof WorktreeRemovalLockError || retirementError instanceof WorktreeRemovalContentionError) error = retirementError;
			}
			log$2.warn(`idle cleanup failed for ${record.id}: ${String(error)}`);
			if (/not a git repository|gitfile does not point to a valid repository|^Git metadata is unavailable /u.test(formatErrorMessage(error))) await deferWorktreeGcRecord(env, record, "Git metadata unavailable; repair and run openclaw worktrees gc --retry-deferred", assertCurrent);
		}
		progress.error("idle", error, record.id);
	};
	const repositoryProtection = (repoRoot) => repositoryFailures.get(repoRoot)?.reason;
	return { collect: async (protect, checkpoint) => {
		const evictedIds = new Set(progress.result.removed);
		for (const record of context.records) {
			assertCurrent?.();
			if (evictedIds.has(record.id)) continue;
			let retiredOwner = false;
			try {
				if (record.removedAt === void 0 && !await worktreePathExists(record.path)) {
					const retired = await withOwnerCleanup(record, async (withOwnerMutation) => {
						const assertOwnerCurrent = await prepareOwnerCurrent(record);
						return withOwnerMutation(() => retireMissingRegistryWorktree(env, record, now, assertOwnerCurrent));
					});
					if (retired.protection) progress.protect("idle", record.id, retired.protection);
					else if (retired.record?.removedAt === now) progress.result.orphansRetired += 1;
					continue;
				}
				const expiresWhenIdle = record.ownerKind === "workboard" || record.ownerKind === "session";
				if (record.removedAt !== void 0 || !expiresWhenIdle) continue;
				retiredOwner = record.ownerId !== void 0 && context.classifyOwner?.(record.ownerKind, record.ownerId) === "retired";
				if (retiredOwner || record.lastActiveAt < context.expiresBefore) {
					if (!progress.start(record.id)) continue;
					const repositoryReason = repositoryProtection(record.repoRoot);
					if (repositoryReason) {
						progress.protect("idle", record.id, repositoryReason);
						continue;
					}
					const protection = await protect(record);
					if (protection !== void 0) {
						progress.protect("idle", record.id, protection);
						continue;
					}
					progress.result.eligibleCount += 1;
					await withOwnerCleanup(record, async (withOwnerMutation) => {
						const assertOwnerCurrent = await prepareOwnerCurrent(record, retiredOwner);
						return context.remove({
							...ownerGuard(record, assertOwnerCurrent),
							reason: retiredOwner ? "owner-gc" : "idle-gc",
							withOwnerMutation
						});
					});
					progress.result.removed.push(record.id);
				}
			} catch (error) {
				await withOwnerCleanup(record, (withOwnerMutation) => handleError(record, error, retiredOwner, withOwnerMutation));
			} finally {
				await checkpoint?.();
			}
		}
	} };
}
//#endregion
//#region src/agents/worktrees/gc-protection.ts
async function autoRemovalProtectionReason(record, prefilter, hasLiveLease, context, policy = {}) {
	if (record.ownerId !== void 0 && policy.readOwnerState?.(record.ownerKind, record.ownerId) === "active") return "owner is active";
	if (hasLiveLease(record.id)) return "run lease is active";
	if (record.gcRetry) {
		if (!policy.retryDeferred && context.now < record.gcRetry.retryAt) return record.gcProtection;
	} else {
		const revision = worktreeGcRevision(record);
		const previous = context.deferrals.get(record.id);
		const fingerprint = record.gcProtection || !previous ? await runGitWorkerOperation({
			type: "worktree.cleanup-fingerprint",
			input: { checkoutPath: record.path }
		}, {
			signal: context.signal,
			assertCurrent: context.beforeRun
		}) : previous.fingerprint;
		context.deferrals.set(record.id, {
			revision,
			fingerprint
		});
		if (record.gcProtection) {
			if (!policy.retryDeferred && (!previous || previous.revision === revision && previous.fingerprint === fingerprint)) return record.gcProtection;
			await deferWorktreeGcRecord(context.env, record, null, context.beforeRun);
		}
	}
	const protection = await prefilter(record);
	if (protection !== void 0) {
		if (protection === "branch-moved") await deferWorktreeGcRecord(context.env, record, protection, context.beforeRun);
		return protection;
	}
	const provisioned = await inspectManagedWorktreeCheckout(record, "provisioned", context);
	if (provisioned.retainedReason !== void 0) return `provisioned checkout state is ${provisioned.retainedReason}`;
	if ((await inspectManagedWorktreeCheckout(record, "nested-repository", context)).retainedReason !== void 0) {
		const reason = "worktree contains a nested repository";
		await deferWorktreeGcRecord(context.env, record, reason, context.beforeRun);
		return reason;
	}
}
//#endregion
//#region src/agents/worktrees/git-maintenance.ts
const log$1 = createSubsystemLogger("agents/worktrees");
const operation = "worktree.maintenance";
const WORKTREE_GIT_MAINTENANCE_TIMEOUT_MS = 18e5;
const PACK_BATCH_BYTES = 536870912;
const PACK_BATCH_COUNT = 1024;
const PACK_BATCH_TIMEOUT_MS = 3e5;
const TEMP_PACK_MAX_AGE_MS = 864e5;
const OBJECT_REPAIR_TIMEOUT_MS = 3e5;
const OBJECT_REPAIR_BATCH_SIZE = 256;
const OBJECT_REPAIR_MAX_OBJECTS = 4096;
async function repairWorktreeObjects(repoRoot, remote, params) {
	const started = performance.now();
	const options = () => {
		params.signal?.throwIfAborted();
		params.commitGuard?.();
		const remaining = OBJECT_REPAIR_TIMEOUT_MS - (performance.now() - started);
		if (remaining <= 0) throw new Error("Worktree object repair exceeded its five-minute budget");
		return {
			operation,
			signal: params.signal,
			beforeRun: () => {
				params.signal?.throwIfAborted();
				params.commitGuard?.();
			},
			timeoutMs: Math.ceil(remaining),
			maxOutputBytes: 33554432,
			killProcessTree: true,
			lowerPriority: true,
			env: { GIT_NO_LAZY_FETCH: "1" }
		};
	};
	const heads = [...new Set((await listGitWorktrees(repoRoot, options())).flatMap((worktree) => worktree.head && !/^0+$/.test(worktree.head) ? [worktree.head] : []))];
	const fetched = /* @__PURE__ */ new Set();
	for (;;) {
		const missing = (await requireGit(repoRoot, [
			"rev-list",
			"--objects",
			"--indexed-objects",
			"--no-walk=unsorted",
			"--missing=print",
			"--no-object-names",
			"--stdin"
		], {
			...options(),
			input: `${heads.join("\n")}\n`
		})).split("\n").filter((line) => line.startsWith("?")).map((line) => line.slice(1));
		if (missing.length === 0) {
			if (fetched.size > 0) log$1.info(`Repaired ${fetched.size} missing live worktree objects in ${repoRoot}.`);
			return;
		}
		if (missing.some((oid) => fetched.has(oid))) throw new Error("Worktree object repair incomplete; inspect the promisor remote and retry");
		if (fetched.size >= OBJECT_REPAIR_MAX_OBJECTS) throw new Error(`Worktree object repair reached its ${OBJECT_REPAIR_MAX_OBJECTS}-object limit; retry to recover the remaining objects`);
		for (let offset = 0; offset < missing.length && fetched.size < OBJECT_REPAIR_MAX_OBJECTS; offset += OBJECT_REPAIR_BATCH_SIZE) {
			const batch = missing.slice(offset, offset + Math.min(OBJECT_REPAIR_BATCH_SIZE, OBJECT_REPAIR_MAX_OBJECTS - fetched.size));
			try {
				await requireGit(repoRoot, [
					"fetch",
					"--refetch",
					"--no-auto-maintenance",
					"--no-tags",
					"--no-prune",
					"--no-write-fetch-head",
					"--recurse-submodules=no",
					"--stdin",
					"--",
					remote
				], {
					...options(),
					input: `${batch.join("\n")}\n`
				});
			} catch {
				options();
				throw new Error(`Could not fetch ${batch.length} missing worktree objects; check promisor remote access and retry`);
			}
			for (const oid of batch) fetched.add(oid);
		}
	}
}
async function maintainWorktreePacks(repoRoot, params, report) {
	const assertCurrent = () => {
		params.signal?.throwIfAborted();
		params.commitGuard?.();
	};
	const options = {
		operation,
		signal: params.signal,
		beforeRun: assertCurrent,
		killProcessTree: true,
		lowerPriority: true,
		env: {
			GIT_NO_LAZY_FETCH: "1",
			GIT_ALLOW_PROTOCOL: ""
		}
	};
	const commonDir = await requireGit(repoRoot, ["rev-parse", "--git-common-dir"], options);
	await withContentGitSlot(() => enqueueGitRefMutation(repoRoot, commonDir, async () => {
		const packDirectory = await resolveGitMetadataPath(repoRoot, "objects/pack", options);
		const packs = await fs$1.readdir(packDirectory).catch((error) => {
			if (isMissingPathError(error)) return [];
			throw error;
		});
		assertCurrent();
		const before = packs.filter((name) => name.endsWith(".pack")).length;
		await report(before);
		await cleanTemporaryPacks(packDirectory, packs, params.signal, assertCurrent);
		await report(before, await consolidatePacks(repoRoot, packDirectory, packs, options));
	}, params.signal), params.signal);
}
async function cleanTemporaryPacks(directory, names, signal, assertCurrent) {
	const files = names.filter((name) => /^tmp_pack_[a-zA-Z0-9_-]+$/.test(name)).map((name) => path.join(directory, name));
	if (process.platform !== "linux" || files.length === 0) return;
	assertCurrent();
	const result = await withChildProcessOperation("worktree.maintenance", () => runCommandBuffersWithTimeout([process.execPath, ...resolveRuntimeWorkerArgv(resolveRuntimeWorkerUrl(runtimeProcessEntrypoints.gitPackCleanup))], {
		input: JSON.stringify({
			files,
			olderThan: Date.now() - TEMP_PACK_MAX_AGE_MS
		}),
		beforeInput: assertCurrent,
		signal,
		timeoutMs: 3e4,
		killProcessTree: true,
		requireProcessTreeExtinction: true,
		maxOutputBytes: 4096
	}));
	assertCurrent();
	if (result.termination !== "exit" || result.code !== 0) {
		log$1.warn(`Temporary Git pack cleanup deferred in ${directory}: ${result.termination}`);
		return;
	}
	const counts = JSON.parse(result.stdout.toString("utf8"));
	if (counts.retained > 0) log$1.warn(`Retained ${counts.retained} temporary Git packs in ${directory}: active, changed, or unavailable file lease.`);
	if (counts.removed > 0) log$1.info(`Removed ${counts.removed} stale temporary Git packs from ${directory}.`);
}
async function consolidatePacks(repoRoot, directory, names, options) {
	const present = new Set(names);
	const packs = [];
	for (const name of names) {
		if (!/^pack-[a-f0-9]+\.pack$/.test(name)) continue;
		const stem = name.slice(0, -5);
		if (!present.has(`${stem}.idx`) || present.has(`${stem}.keep`) || present.has(`${stem}.mtimes`)) continue;
		options.beforeRun?.();
		const stat = await fs$1.stat(path.join(directory, name));
		packs.push({
			name,
			size: stat.size,
			promisor: present.has(`${stem}.promisor`)
		});
	}
	packs.sort((a, b) => a.size - b.size || a.name.localeCompare(b.name));
	let objectFormat;
	for (const promisor of [true, false]) {
		const candidates = packs.filter((pack) => pack.promisor === promisor);
		const selected = [];
		let bytes = 0;
		for (const pack of candidates) {
			if (bytes + pack.size > PACK_BATCH_BYTES || selected.length >= PACK_BATCH_COUNT) break;
			selected.push(pack.name);
			bytes += pack.size;
		}
		if (selected.length < 2) continue;
		objectFormat ??= await requireGit(repoRoot, ["rev-parse", "--show-object-format"], options);
		const verifyDeadline = performance.now() + PACK_BATCH_TIMEOUT_MS;
		for (let offset = 0; offset < selected.length; offset += 128) {
			const timeoutMs = Math.ceil(verifyDeadline - performance.now());
			if (timeoutMs <= 0) throw new Error("Git pack verification exceeded its five-minute budget");
			await requireGit(directory, [
				"-c",
				"pack.threads=1",
				"verify-pack",
				`--object-format=${objectFormat}`,
				...selected.slice(offset, offset + 128)
			], {
				...options,
				timeoutMs,
				env: {
					...options.env,
					GIT_CEILING_DIRECTORIES: path.dirname(directory)
				}
			});
		}
		await requireGit(repoRoot, [
			"multi-pack-index",
			"write",
			"--stdin-packs",
			`--preferred-pack=${selected.at(-1)}`
		], {
			...options,
			input: `${selected.map((name) => name.replace(/\.pack$/, ".idx")).join("\n")}\n`
		});
		await requireGit(repoRoot, ["multi-pack-index", "expire"], options);
		const presentAfterExpiry = new Set(await fs$1.readdir(directory));
		const remainingBatch = selected.filter((name) => presentAfterExpiry.has(name));
		if (candidates.length - selected.length + remainingBatch.length < 16 || remainingBatch.length < 2) continue;
		const result = await requireGit(repoRoot, [
			"-c",
			`alias.openclaw-consolidate=${"!if command -v ionice >/dev/null 2>&1; then ionice -c 3 -p $$ >/dev/null 2>&1; fi; git pack-objects --stdin-packs --stdout --window=0 --threads=1 | git index-pack --stdin --threads=1" + (promisor ? " --promisor" : "")}`,
			"openclaw-consolidate"
		], {
			...options,
			timeoutMs: PACK_BATCH_TIMEOUT_MS,
			input: `${remainingBatch.join("\n")}\n`
		});
		const hash = /^pack\s+([a-f0-9]{40}|[a-f0-9]{64})$/.exec(result)?.[1];
		if (!hash) throw new Error("Git pack consolidation returned an invalid pack identity");
		const replacement = `pack-${hash}.pack`;
		await requireGit(repoRoot, [
			"multi-pack-index",
			"write",
			"--stdin-packs",
			`--preferred-pack=${replacement}`
		], {
			...options,
			input: `${[.../* @__PURE__ */ new Set([...remainingBatch, replacement])].map((name) => name.replace(/\.pack$/, ".idx")).join("\n")}\n`
		});
		await requireGit(repoRoot, ["multi-pack-index", "expire"], options);
	}
	const remainingNames = await fs$1.readdir(directory);
	const remaining = remainingNames.filter((name) => /^pack-[a-f0-9]+\.idx$/.test(name));
	if (remaining.length > 0) await requireGit(repoRoot, [
		"multi-pack-index",
		"write",
		"--stdin-packs"
	], {
		...options,
		input: `${remaining.join("\n")}\n`
	});
	return remainingNames.filter((name) => name.endsWith(".pack")).length;
}
function createWorktreeGitMaintenance(env, now = Date.now) {
	const failed = /* @__PURE__ */ new Map();
	const nextRunAt = /* @__PURE__ */ new Map();
	return async (params) => {
		const progress = params.progress ?? new WorktreeGcProgress();
		const assertCurrent = () => {
			params.signal?.throwIfAborted();
			params.commitGuard?.();
		};
		assertCurrent();
		if (params.retryDeferred) failed.clear();
		const records = await readRegistryWorktrees(env).catch((error) => {
			assertCurrent();
			progress.error("git-maintenance", error);
			log$1.warn(`worktree Git maintenance inventory failed: ${String(error)}`);
			return [];
		});
		for (const repoRoot of new Set(records.map((record) => record.repoRoot))) {
			assertCurrent();
			const report = async (stage, counts) => {
				progress.result.gitMaintenance = {
					...progress.result.gitMaintenance,
					...counts,
					repoRoot,
					stage
				};
				await params.checkpoint?.(progress.result);
				assertCurrent();
			};
			progress.result.gitMaintenance = {
				repoRoot,
				stage: "packs"
			};
			if (failed.get(repoRoot) === "packs") {
				progress.record("git-maintenance", "deferred", "Pack maintenance suspended; run worktrees gc --retry-deferred after repair", repoRoot);
				await report("suspended");
				continue;
			}
			if (!params.retryDeferred && now() < (nextRunAt.get(repoRoot) ?? 0)) {
				await report("throttled");
				continue;
			}
			nextRunAt.set(repoRoot, now() + 36e5);
			let stage = "packs";
			try {
				await report(stage);
				await maintainWorktreePacks(repoRoot, params, async (before, after) => {
					if (after !== void 0) progress.result.packsRemoved = (progress.result.packsRemoved ?? 0) + Math.max(0, before - after);
					await report(stage, {
						packsBefore: before,
						packsAfter: after
					});
				});
				const options = {
					operation,
					signal: params.signal,
					beforeRun: assertCurrent,
					timeoutMs: WORKTREE_GIT_MAINTENANCE_TIMEOUT_MS,
					killProcessTree: true,
					lowerPriority: true,
					env: {
						GIT_NO_LAZY_FETCH: "1",
						GIT_ALLOW_PROTOCOL: ""
					}
				};
				let remote;
				if (params.retryDeferred) {
					stage = "objects";
					await report(stage);
					const config = await runGit(repoRoot, [
						"config",
						"--bool",
						"--get-regexp",
						"^remote\\..*\\.promisor$"
					], options);
					if (!(config.termination === "exit" && config.code === 1)) remote = /^remote\.(.+)\.promisor true$/m.exec(requireGitCommandOutput("git config promisor", config))?.[1];
				}
				if (params.retryDeferred && remote) await withContentGitSlot(() => repairWorktreeObjects(repoRoot, remote, params), params.signal);
				stage = "maintenance";
				if (failed.has(repoRoot)) {
					progress.record("git-maintenance", "deferred", "Object or graph maintenance suspended; run worktrees gc --retry-deferred after repair", repoRoot);
					await report("suspended");
					continue;
				}
				await report(stage);
				await withContentGitSlot(() => requireGit(repoRoot, [
					"maintenance",
					"run",
					"--auto",
					"--task=commit-graph",
					"--task=loose-objects"
				], options), params.signal);
				await report("completed");
			} catch (error) {
				assertCurrent();
				failed.set(repoRoot, stage);
				progress.error("git-maintenance", error, repoRoot);
				await report("suspended");
				const recovery = stage === "objects" ? "Check the promisor remote, then run openclaw worktrees gc --retry-deferred to resume object repair." : "Repair the repository, then run openclaw worktrees gc --retry-deferred or restart the Gateway to retry.";
				log$1.warn(`worktree Git maintenance suspended (${stage}) for ${repoRoot}: ${String(error)}\n${recovery}`);
			}
		}
		await params.checkpoint?.(progress.result);
	};
}
//#endregion
//#region src/agents/worktrees/removal-finalization.ts
/** Publish the removed lifecycle and retire its pending ref before releasing checkout custody. */
async function finalizeManagedWorktreeRemoval(params) {
	const { record, env, git, options, snapshotRef, snapshotError, recoveryPath } = params;
	options.beforeRun();
	const removedAt = params.now();
	const update = (patch) => updateRegistryWorktree(env, record.id, patch, {
		assertCurrent: options.beforeRun,
		removalToken: params.claimToken,
		workerAuthority: params.workerAuthority
	});
	const publish = () => update({
		removedAt,
		snapshotRef,
		...params.runEndCleanup ? { runEndCleanup: params.runEndCleanup } : {}
	});
	await (params.withOwnerMutation ? params.withOwnerMutation(publish, { settle: true }) : publish());
	params.onFinalized();
	try {
		if (params.deletionOptions) await git(record.repoRoot, [
			"branch",
			"-d",
			"--",
			record.branch
		], {
			...params.deletionOptions,
			...options
		});
		options.beforeRun();
		await fs$1.rmdir(path.dirname(record.path)).catch(() => void 0);
		await git(record.repoRoot, [
			"update-ref",
			"-d",
			`refs/openclaw/removals/${record.id}`,
			params.snapshotOid
		], options);
		options.beforeRun();
		await finalizeWorktreeRemovalRows(env, {
			worktreeId: record.id,
			lastActiveAt: record.lastActiveAt,
			removedAt,
			token: params.claimToken
		}, params.workerAuthority);
	} catch (error) {
		if (hasSqliteWorkerOutcomeUnknown(error)) throw error;
		if (params.runEndCleanup) try {
			await update({ runEndCleanup: {
				outcome: "failed",
				at: params.now(),
				reason: truncateUtf16Safe(formatErrorMessage(error), 500)
			} });
		} catch (outcomeError) {
			if (hasSqliteWorkerOutcomeUnknown(outcomeError)) throw outcomeError;
		}
		throw error;
	}
	return {
		removed: true,
		...snapshotRef ? { snapshotRef } : {},
		...snapshotError ? { snapshotError } : {},
		...recoveryPath ? {
			recoveryPath,
			recoveryRetainedUntil: removedAt + params.snapshotRetentionMs
		} : {}
	};
}
//#endregion
//#region src/agents/worktrees/removal.ts
async function removeSettledManagedWorktree(input, context, timing, prepareArchive) {
	const { env, now, getConfig, snapshotRetentionMs } = context;
	let params = input;
	timing?.markRemovalStage("preparation");
	params.signal?.throwIfAborted();
	params.commitGuard?.();
	const registryContext = captureWorktreeRunEndContext(env);
	const accept = captureWorktreeRegistryReadGuard(registryContext, "exact-owner");
	let record = requireActiveWorktreeRecord(params.id, await readRegistryWorktree(registryContext, params.id));
	const assertRecordCurrent = accept(record);
	params.commitGuard?.();
	const claimToken = params.claimToken;
	const assertClaim = createWorktreeRemovalClaimsGuard(env, [record.id], claimToken);
	const allocationGuard = params.commitGuard;
	let exactFinalized = false;
	if (params.exactState) {
		const expected = params.exactState;
		const original = record;
		assertExactStateOwner(original, expected);
		params = {
			...params,
			workerAuthority: {
				...params.workerAuthority,
				predicates: [...params.workerAuthority?.predicates ?? [], {
					kind: "exact-owner",
					record: original
				}]
			},
			commitGuard: () => {
				allocationGuard?.();
				if (exactFinalized) return;
				assertRecordCurrent();
				assertClaim();
			}
		};
	}
	record = await rebindLiveWorktreeRepository(env, record, params);
	const gitOptions = {
		signal: params.signal,
		beforeRun: params.commitGuard,
		killProcessTree: true
	};
	return await withManagedWorktreeGit({
		record,
		env,
		getConfig,
		...gitOptions
	}, async (git) => {
		const pendingRef = `refs/openclaw/removals/${record.id}`;
		const pending = await git.run(record.repoRoot, [
			"show-ref",
			"--verify",
			"--quiet",
			pendingRef
		], gitOptions);
		if (pending.code !== 1) {
			if (pending.code !== 0) throw createGitCommandError("git show-ref --verify", pending);
			throw new Error(`Previous worktree removal may be incomplete; inspect ${record.path} before cleanup. Recovery snapshot preserved at ${pendingRef}.`);
		}
		const checkHead = () => params.exactState ? requireExactManagedWorktreeHead(record, params.exactState, gitOptions) : requireManagedWorktreeHead(record, gitOptions);
		const head = await checkHead();
		if (params.inspectedHead && params.inspectedHead !== head) throw new Error("Worktree HEAD changed after lossless inspection; checkout preserved.");
		const state = await lockState(record);
		if (state.kind === "live" || state.kind === "foreign") throw new WorktreeRemovalLockError(state.kind === "live" ? "busy" : "foreign-lock", state.kind === "live" ? `worktree is locked by live OpenClaw pid ${state.pid}` : `worktree has a foreign lock${state.reason ? `: ${state.reason}` : ""}`);
		if (state.kind !== "none") {
			params.commitGuard?.();
			await git.require(record.repoRoot, [
				"worktree",
				"unlock",
				record.path
			], {
				signal: params.signal,
				beforeRun: params.commitGuard,
				killProcessTree: true
			});
		}
		timing?.markRemovalStage("snapshot");
		const retirementName = params.exactState ? `.openclaw-retiring-${randomUUID()}` : void 0;
		let snapshotRef;
		let snapshotError;
		let exactStateDigest;
		let capturedProvisionedPaths = [];
		try {
			const provisionedPaths = await getRegistryWorktreeProvisionedPaths(env, record.id);
			params.commitGuard?.();
			if (provisionedPaths === void 0) throw new Error("provisioned path ledger is unavailable");
			capturedProvisionedPaths = provisionedPaths;
			const snapshot = await captureManagedWorktreeSnapshot({
				record,
				env,
				reason: params.reason,
				exactState: params.exactState,
				retirementName,
				provisionedPaths,
				git,
				signal: params.signal,
				assertCurrent: params.commitGuard,
				workerAuthority: {
					...params.workerAuthority,
					predicates: [...params.workerAuthority?.predicates ?? [], {
						kind: "removal-claim",
						id: record.id,
						token: claimToken
					}]
				},
				requireDiskSpace: params.requireDiskSpace,
				onInventory: (counts) => timing?.recordInventory(counts)
			});
			snapshotRef = snapshot.snapshotRef;
			exactStateDigest = snapshot.exactStateDigest;
			params.commitGuard?.();
			await updateRegistryWorktree(env, record.id, {
				snapshotRef,
				provisionedState: snapshot.provisionedState
			}, { workerAuthority: {
				...params.workerAuthority,
				predicates: [...params.workerAuthority.predicates ?? [], {
					kind: "removal-claim",
					id: record.id,
					token: claimToken
				}]
			} });
		} catch (error) {
			if (hasSqliteWorkerOutcomeUnknown(error)) throw error;
			snapshotError = error instanceof Error ? error.message : String(error);
			try {
				params.rollbackGuard();
				await clearRegistryWorktreeProvisionedChunks(env, record.id, {
					leaseSet: params.workerAuthority.leaseSet,
					predicates: [{
						kind: "removal-claim",
						id: record.id,
						token: claimToken
					}]
				});
			} catch (cleanupError) {
				throw new WorktreeSnapshotError(`${snapshotError}; provisioned snapshot cleanup failed: ${String(cleanupError)}`, { cause: cleanupError });
			}
			if (!params.allowSnapshotLoss) throw new WorktreeSnapshotError(snapshotError, { cause: error });
			snapshotRef = void 0;
		}
		const snapshot = snapshotError || !snapshotRef ? void 0 : await git.require(record.repoRoot, [
			"rev-parse",
			"--verify",
			`${snapshotRef}^{commit}`
		], gitOptions);
		const deletionOptions = snapshot && snapshotRef && !params.exactState ? await prepareSnapshotBranchDeletion(record, snapshotRef, snapshot, gitOptions) : void 0;
		if (await checkHead() !== head || snapshot && await git.require(record.repoRoot, ["rev-parse", `${snapshot}^`], gitOptions) !== head) throw new Error("Worktree HEAD changed after snapshot preparation; checkout and branch preserved.");
		timing?.markRemovalStage("checkoutRemoval");
		params.signal?.throwIfAborted();
		params.commitGuard?.();
		if (params.requireLossless && snapshot) {
			if (await git.require(record.repoRoot, [
				"diff-tree",
				"--no-commit-id",
				"--name-only",
				"-r",
				head,
				snapshot
			], gitOptions)) {
				await abortWorktreeRemovalRow(env, record.id, claimToken);
				await updateRegistryWorktree(env, record.id, { runEndCleanup: {
					outcome: "retained-dirty",
					at: now()
				} }, {
					onlyIfLive: true,
					onlyIfActiveAt: record.lastActiveAt,
					workerAuthority: params.workerAuthority
				});
				return { removed: false };
			}
		}
		if (snapshot) await prepareArchive?.(snapshot);
		await git.require(record.repoRoot, [
			"update-ref",
			pendingRef,
			snapshot ?? head,
			""
		], gitOptions);
		const finalize = async (recoveryPath) => {
			timing?.markRemovalStage("finalization");
			return await finalizeManagedWorktreeRemoval({
				record,
				env,
				claimToken,
				now,
				snapshotRef,
				snapshotOid: snapshot ?? head,
				snapshotError,
				runEndCleanup: params.runEndCleanup,
				recoveryPath,
				snapshotRetentionMs,
				git: params.exactState ? git.require : requireGit,
				options: params.exactState ? gitOptions : {
					...gitOptions,
					signal: void 0,
					beforeRun: () => {
						params.rollbackGuard();
						assertClaim();
					}
				},
				deletionOptions,
				onFinalized: () => {
					exactFinalized = true;
				},
				workerAuthority: {
					leaseSet: params.workerAuthority.leaseSet,
					predicates: [{
						kind: "removal-claim",
						id: record.id,
						token: claimToken
					}]
				},
				withOwnerMutation: params.withOwnerMutation
			});
		};
		const expected = params.exactState;
		if (expected) {
			const digest = exactStateDigest;
			const rollbackGuard = params.rollbackGuard;
			if (!retirementName || !snapshot || !digest || !rollbackGuard) throw new Error("Exact-state snapshot or retirement custody is incomplete; source preserved");
			return await retireExactWorktree({
				record,
				retirementName,
				snapshot,
				git,
				signal: params.signal,
				assertCurrent: () => params.commitGuard?.(),
				assertRollbackCurrent: rollbackGuard,
				finalize,
				verify: async (quarantined) => {
					await verifyManagedWorktreeExactSnapshot({
						record: quarantined,
						expected,
						retirementName,
						expectedDigest: digest,
						provisionedPaths: capturedProvisionedPaths,
						git,
						signal: params.signal,
						assertCurrent: () => params.commitGuard?.()
					});
					await requireExactManagedWorktreeHead(quarantined, expected, gitOptions);
				}
			});
		}
		await removeManagedCheckout(record, git, params.requireLossless, "bounded", params.commitGuard, params.signal);
		return await runOutsideCommandProcessScope(() => finalize());
	});
}
//#endregion
//#region src/agents/worktrees/repository-setup.ts
async function completeRepositoryWorktreeSetup(params, env, repository, materialized) {
	const { worktreePath, provisionedBytes, setupBytes, runRepositorySetup } = materialized;
	const provisionedPaths = params.provisionIgnoredFiles === false ? [] : await withWorktreeSource(params, async (current) => {
		current.signal?.throwIfAborted();
		current.commitGuard?.();
		await requireAllocationSpace(current, env, worktreePath, repository, 2 * provisionedBytes + setupBytes);
		return provisionIncludedFiles(repository.sourceRoot, worktreePath, {
			signal: current.signal,
			assertCurrent: current.commitGuard
		});
	});
	if (runRepositorySetup) {
		await requireAllocationSpace(params, env, worktreePath, repository, setupBytes);
		await timeWorktreePreparationPhase("setup", () => runSetupScript(repository.sourceRoot, worktreePath, params));
	}
	return provisionedPaths;
}
async function runSetupScript(repoRoot, worktreePath, params) {
	const setupScript = path.join(repoRoot, ".openclaw", "worktree-setup.sh");
	const stat = await fs$1.stat(setupScript).catch(() => void 0);
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
//#region src/agents/worktrees/service-list.ts
async function reconcileListedWorktrees(env, records, now) {
	const context = captureWorktreeRunEndContext(env);
	const listed = [];
	for (const observed of records) {
		const record = observed.removedAt === void 0 && !await worktreePathExists(observed.path) ? await withWorktreeMutationLease({
			env,
			id: observed.id
		}, async (guard) => {
			context.admission.assertCurrent();
			const current = await readRegistryWorktree(context, observed.id);
			guard.commitGuard();
			if (!current || current.removedAt !== void 0 || await worktreePathExists(current.path)) return current;
			return (await retireMissingRegistryWorktree(context.environment, current, now(), () => {
				context.admission.assertCurrent();
				guard.commitGuard();
			})).record;
		}) : observed;
		if (record && (record.removedAt === void 0 || record.snapshotRef)) listed.push(record);
	}
	return listed;
}
//#endregion
//#region src/agents/worktrees/snapshot-restore.ts
function requireManagedWorktreeRestoreRecord(id, record) {
	if (!record || record.removedAt !== void 0 && !record.snapshotRef) throw new Error(`worktree ${id} is not restorable`);
	return record;
}
async function settleRestoredProjection(worktree, env, assertCurrent, workerAuthority, phase = "restoreSnapshot") {
	const { withSettledLocalWorkspace } = await import("./local-workspace-projection-B04UXZLe.mjs");
	await withSettledLocalWorkspace({
		worktree,
		env,
		assertCurrent,
		workerAuthority,
		[phase]: true
	}, async () => {});
}
/** Restore retains its canonical source and borrowed Git objects through native settlement. */
async function restoreManagedWorktreeSnapshot(input, dependencies) {
	const { env } = dependencies;
	const registryContext = captureWorktreeRunEndContext(env);
	const preparedRecord = requireManagedWorktreeRestoreRecord(input.id, await readRegistryWorktree(registryContext, input.id));
	input.commitGuard();
	if (!await worktreePathExists(preparedRecord.repoRoot)) throw new Error(`source repository no longer exists: ${preparedRecord.repoRoot}`);
	const repository = await resolveRepository(preparedRecord.repoRoot);
	return await withWorktreeSources(env, async (retainRepository) => {
		const retainSources = await retainRepository({
			...input,
			repository,
			requiredPaths: [preparedRecord.path],
			restoringId: preparedRecord.id
		});
		const context = {
			env,
			registryContext,
			now: dependencies.now,
			getConfig: dependencies.getConfig,
			repository,
			admitCapacity: async (requiredPaths, alreadyCounted) => {
				await retainSources(requiredPaths);
				if (!alreadyCounted) await dependencies.admitCapacity();
			},
			requireSpace: (target, sourceRepository, bytes) => requireAllocationSpace(input, env, target, sourceRepository, bytes)
		};
		const accept = captureWorktreeRegistryReadGuard(registryContext, "exact-owner");
		const record = requireManagedWorktreeRestoreRecord(input.id, await readRegistryWorktree(registryContext, input.id));
		const assertRecordCurrent = accept(record);
		input.commitGuard();
		if (!input.recoverExactState || record.removedAt !== void 0) return await restoreSnapshot(input, context);
		const expected = exactStateRetirementSchema.parse(input.recoverExactState);
		assertExactStateOwner(record, expected);
		const assertOwner = () => {
			input.signal?.throwIfAborted();
			input.commitGuard?.();
			assertRecordCurrent();
		};
		const token = randomUUID();
		const assertClaim = createWorktreeRemovalClaimsGuard(context.env, [record.id], token);
		await claimWorktreeRemoval(context.env, {
			worktreeId: record.id,
			token,
			assertCurrent: assertOwner,
			workerAuthority: {
				...input.workerAuthority,
				predicates: [...input.workerAuthority.predicates ?? [], {
					kind: "exact-owner",
					record
				}]
			}
		});
		try {
			return await restoreSnapshot({
				...input,
				workerAuthority: {
					...input.workerAuthority,
					predicates: [...input.workerAuthority.predicates ?? [], {
						kind: "removal-claim",
						id: record.id,
						token
					}]
				},
				commitGuard: () => {
					input.commitGuard?.();
					assertClaim();
				}
			}, {
				...context,
				recoveryClaim: token
			});
		} finally {
			await abortWorktreeRemovalRow(context.env, record.id, token);
		}
	});
}
/** Capture and restoration share the same versioned snapshot and native retention owner. */
async function restoreSnapshot(input, context) {
	const { env, now, getConfig, requireSpace, repository } = context;
	let params = input;
	let finalized = false;
	const onFinalized = () => {
		finalized = true;
	};
	params.signal?.throwIfAborted();
	params.commitGuard?.();
	const accept = captureWorktreeRegistryReadGuard(context.registryContext, "exact-snapshot");
	let record = requireManagedWorktreeRestoreRecord(params.id, await readRegistryWorktree(context.registryContext, params.id));
	const assertSnapshotCurrent = accept(record);
	params.commitGuard();
	let capacityAdmitted = record.removedAt === void 0;
	if (record?.snapshotRef?.startsWith("refs/openclaw/snapshots/exact-")) {
		const original = record;
		const callerGuard = params.commitGuard;
		params = {
			...params,
			workerAuthority: {
				...params.workerAuthority,
				predicates: [...params.workerAuthority?.predicates ?? [], {
					kind: "exact-snapshot",
					record: original
				}]
			},
			commitGuard: () => {
				callerGuard?.();
				if (finalized) return;
				assertSnapshotCurrent();
			}
		};
	}
	if (!params.recoverExactState && record?.snapshotRef?.startsWith("refs/openclaw/snapshots/exact-v1/") && record.removedAt === void 0) {
		const live = record;
		const options = {
			signal: params.signal,
			beforeRun: params.commitGuard
		};
		const pending = await runGit(live.repoRoot, [
			"show-ref",
			"--verify",
			"--quiet",
			`refs/openclaw/removals/${live.id}`
		], options);
		if (pending.code === 0) throw new Error("Exact retirement recovery is unfinished; retry restore with the original recover-exact-state request");
		if (pending.code !== 1) throw createGitCommandError("git show-ref exact recovery", pending);
		await requireExactWorktreeRepository(live, live.path, options);
		const receipt = await readExactRestoreReceipt(live, options);
		if (receipt) {
			if (receipt.snapshot !== await requireGit(live.repoRoot, ["rev-parse", live.snapshotRef + "^{commit}"], options)) throw new Error("Completed exact restore snapshot changed; source and receipt preserved");
			const assertCurrent = () => {
				params.commitGuard?.();
				assertExactStateSourceIdentity(live.path, receipt);
			};
			assertCurrent();
			await clearExactRestoreReceipt(live, receipt, {
				...options,
				beforeRun: assertCurrent
			});
		}
		params.commitGuard?.();
		return live;
	}
	if (record?.snapshotRef && params.recoverExactState) {
		const expected = exactStateRetirementSchema.parse(params.recoverExactState);
		assertExactStateOwner({
			...record,
			removedAt: void 0
		}, expected);
		if (record.removedAt === void 0) {
			const pending = await runGit(record.repoRoot, [
				"rev-parse",
				"--verify",
				"--quiet",
				`refs/openclaw/removals/${record.id}^{commit}`
			], {
				signal: params.signal,
				beforeRun: params.commitGuard
			});
			if (pending.code !== 0 && pending.code !== 1) throw createGitCommandError("git rev-parse exact recovery", pending);
			const captured = await requireGit(record.repoRoot, ["rev-parse", `${record.snapshotRef}^{commit}`], {
				signal: params.signal,
				beforeRun: params.commitGuard
			});
			const exact = await readExactStateSnapshot(record.repoRoot, captured, record.snapshotRef, {
				signal: params.signal,
				beforeRun: params.commitGuard
			});
			if (!exact || pending.code === 0 && pending.stdout.trim() !== captured || exact.head !== expected.head || exact.branchHead !== expected.branchHead || exact.indexSha256 !== expected.indexSha256) throw new Error("Incomplete retirement recovery does not match the exact-state request");
			if (pending.code === 1 && (!await worktreePathExists(record.path) || !(await listGitWorktrees(record.repoRoot)).some((entry) => entry.path === record.path))) throw new Error("Incomplete exact-state recovery lacks its source and retirement marker; snapshot preserved");
			const quarantine = path.join(path.dirname(record.path), exact.retirementName);
			if (await worktreePathExists(quarantine) !== (await listGitWorktrees(record.repoRoot)).some((entry) => entry.path === quarantine)) throw new Error("Incomplete exact-state retirement; source and snapshot preserved");
			params.commitGuard?.();
			assertSnapshotCurrent();
			assertExactStateOwner(record, expected);
			record = {
				...record,
				removedAt: now()
			};
		}
	}
	if (!record?.snapshotRef || record.removedAt === void 0) throw new Error(`worktree ${params.id} is not restorable`);
	const admitCapacity = async (requiredPaths) => {
		await context.admitCapacity(requiredPaths, capacityAdmitted);
		params.commitGuard?.();
		capacityAdmitted = true;
	};
	await requireSpace(record.path, repository);
	const provisionedState = await getRegistryWorktreeProvisionedState(env, record.id);
	params.commitGuard?.();
	if (provisionedState === void 0) throw new Error(`worktree ${record.id} snapshot lacks provisioned file metadata`);
	const provisionedBytes = provisionedState.reduce((sum, entry) => sum + entry.chunks * SNAPSHOT_CHUNK_BYTES, 0);
	const gitOptions = {
		signal: params.signal,
		beforeRun: params.commitGuard,
		killProcessTree: true
	};
	const registrationOptions = {
		env,
		now,
		repoRoot: record.repoRoot,
		commonDir: repository.commonDir,
		worktreeRoot: path.dirname(path.dirname(record.path)),
		destination: record.path,
		deferGitCheckout: true,
		signal: params.signal,
		rollbackGuard: params.rollbackGuard
	};
	const snapshot = await requireGit(record.repoRoot, [
		"rev-parse",
		"--verify",
		`${record.snapshotRef}^{commit}`
	], gitOptions);
	const exact = await readExactStateSnapshot(record.repoRoot, snapshot, record.snapshotRef, gitOptions);
	if (exact && (exact.branch !== record.branch || await requireGit(record.repoRoot, ["rev-parse", `refs/heads/${record.branch}^{commit}`], gitOptions) !== exact.branchHead)) throw new Error("Recorded branch changed after exact-state retirement; snapshot preserved");
	if (exact) {
		const restoreRecord = record;
		const finalize = async (identity) => {
			const callerGuard = params.commitGuard;
			const workerAuthority = params.workerAuthority;
			params = {
				...params,
				workerAuthority: {
					...workerAuthority,
					assertCurrent: () => {
						workerAuthority.assertCurrent?.();
						assertExactStateSourceIdentity(restoreRecord.path, identity);
					}
				},
				commitGuard: () => {
					callerGuard?.();
					assertExactStateSourceIdentity(restoreRecord.path, identity);
				}
			};
			await settleRestoredProjection(restoreRecord, env, params.commitGuard, params.workerAuthority);
			return await finishRestoredSnapshot(params, context, restoreRecord, provisionedState.map((entry) => entry.path), onFinalized, true);
		};
		if (!await readExactRestoreReceipt(restoreRecord, gitOptions)) {
			const restored = await restoreRetiredExactWorktree({
				record: restoreRecord,
				metadata: exact,
				options: gitOptions,
				assertCurrent: () => params.commitGuard?.(),
				admitCapacity,
				finalize: () => finalize(exact)
			});
			if (restored) return restored;
		}
		const { targetBytes } = await estimateWorktreeCheckoutTransitionBytes(record.repoRoot, exact.head, snapshot, {
			signal: params.signal,
			assertCurrent: params.commitGuard
		});
		return await restoreExactSnapshotFallback({
			record: restoreRecord,
			snapshot,
			metadata: exact,
			env,
			states: provisionedState,
			options: gitOptions,
			assertCurrent: () => params.commitGuard?.(),
			admitCapacity,
			finalize,
			add: async (assertCurrent) => {
				const added = await addManagedWorktree({
					...registrationOptions,
					sourceOnly: true,
					enabled: false,
					base: exact.head,
					requireSpace: () => requireSpace(restoreRecord.path, repository, 2 * targetBytes + 2 * provisionedBytes),
					commitGuard: assertCurrent
				});
				if (added.code !== 0) throw createGitCommandError("git worktree add", added);
			}
		});
	}
	let parent;
	try {
		parent = await requireGit(record.repoRoot, ["rev-parse", `${snapshot}^`], gitOptions);
	} catch (error) {
		const shallow = await runGit(record.repoRoot, ["rev-parse", "--is-shallow-repository"], gitOptions);
		if (shallow.code !== 0 || shallow.stdout.trim() !== "true") throw error;
		throw new Error(`Cannot restore snapshot ${snapshot} in ${record.repoRoot}: shallow clone boundary; run \`git fetch --unshallow\` in ${record.repoRoot}. If the snapshot remains shallow, recover its parent from the original repository before retrying.`, { cause: error });
	}
	const { targetBytes, changedBytes, requiresFullCheckout } = await estimateWorktreeCheckoutTransitionBytes(record.repoRoot, parent, snapshot, {
		signal: params.signal,
		assertCurrent: params.commitGuard
	});
	const target = await lstatIfExists(record.path);
	const registrations = await listGitWorktrees(record.repoRoot, gitOptions);
	if (target && (!target.isDirectory() || (await fs$1.readdir(record.path)).length > 0) || registrations.some((entry) => entry.path === record.path || entry.branch === `refs/heads/${record.branch}`)) throw new Error("Worktree restore destination or branch is occupied; existing checkouts preserved");
	let branch = record.branch || void 0;
	if (record.branch) {
		const ref = `refs/heads/${record.branch}`;
		const retained = await runGit(record.repoRoot, [
			"show-ref",
			"--quiet",
			"--verify",
			ref
		], gitOptions);
		if (retained.code === 0) {
			if (await requireGit(record.repoRoot, [
				"rev-parse",
				"--verify",
				`${ref}^{commit}`
			], gitOptions) !== parent) throw new Error("Recorded branch moved after worktree removal; branch and existing checkouts preserved");
			branch = {
				mode: "existing",
				name: record.branch
			};
		} else if (retained.code !== 1) throw createGitCommandError("git show-ref retained worktree branch", retained);
	}
	const sourceOnly = await usesSourceOnlyWorktreeGit(record, env, getConfig ?? readRuntimeConfig);
	await admitCapacity([record.repoRoot, record.path]);
	params.commitGuard?.();
	await fs$1.mkdir(path.dirname(record.path), { recursive: true });
	params.commitGuard?.();
	const added = await addManagedWorktree({
		...registrationOptions,
		sourceOnly,
		enabled: getConfig?.().worktreeAcceleration !== false,
		base: parent,
		branch,
		requireSpace: (cloneBytes) => requireSpace(record.path, repository, (cloneBytes === void 0 ? 2 * targetBytes : cloneBytes + 2 * changedBytes) + 2 * provisionedBytes),
		commitGuard: () => params.commitGuard?.()
	});
	if (added.code !== 0) throw createGitCommandError("git worktree add", added);
	let restoredProvisionedPaths;
	try {
		const materializationBytes = added.templateCloned ? changedBytes : targetBytes;
		const checkoutOptions = {
			...gitOptions,
			startRun: async (run) => {
				params.commitGuard?.();
				await requireSpace(record.path, repository, 2 * materializationBytes + 2 * provisionedBytes);
				params.commitGuard?.();
				return await run();
			},
			timeoutMs: WORKTREE_CHECKOUT_TIMEOUT_MS
		};
		const materialized = await materializeManagedWorktree({
			destination: record.path,
			commit: snapshot,
			sourceOnly,
			resetIndexTo: parent,
			removeExisting: requiresFullCheckout && added.templateCloned === true
		}, checkoutOptions, gitOptions);
		if (materialized.code !== 0) throw createGitCommandError("git read-tree", materialized);
		params.commitGuard?.();
		await requireSpace(record.path, repository, 2 * provisionedBytes);
		await restoreProvisionedFiles(env, record.id, record.path, provisionedState, params.commitGuard);
		params.commitGuard?.();
		await settleRestoredProjection(record, env, params.commitGuard, params.workerAuthority);
		await requireSpace(record.path, repository);
		restoredProvisionedPaths = provisionedState.map((state) => state.path);
	} catch (error) {
		const failure = await removeFailedWorktree(record.repoRoot, record.path, typeof branch === "string" ? branch : void 0, params.rollbackGuard);
		if (failure) throw new Error(`${String(error)}\nrestore cleanup failed: ${failure.message}`, { cause: error });
		throw error;
	}
	return await finishRestoredSnapshot(params, context, record, restoredProvisionedPaths, onFinalized);
}
async function finishRestoredSnapshot(params, context, record, restoredProvisionedPaths, onFinalized, exact = false) {
	const { env, now } = context;
	const gitOptions = {
		signal: params.signal,
		beforeRun: params.commitGuard,
		killProcessTree: true
	};
	params.commitGuard?.();
	const lastActiveAt = Math.max(now(), record.lastActiveAt + 1);
	const restored = {
		...record,
		lastActiveAt
	};
	delete restored.removedAt;
	delete restored.runEndCleanup;
	const finishRecovery = async () => {
		params.commitGuard?.();
		await requireGit(record.repoRoot, [
			"update-ref",
			"-d",
			`refs/openclaw/removals/${record.id}`
		], gitOptions);
		await settleRestoredProjection(restored, env, params.commitGuard, params.workerAuthority, "finishRestore");
	};
	if (!context.recoveryClaim) await finalizeWorktreeRemovalRows(env, {
		worktreeId: params.id,
		lastActiveAt: record.lastActiveAt,
		removedAt: record.removedAt
	}, params.workerAuthority);
	if (exact) await finishRecovery();
	await updateRegistryWorktree(env, params.id, {
		removedAt: void 0,
		lastActiveAt,
		provisionedPaths: restoredProvisionedPaths,
		runEndCleanup: void 0
	}, {
		assertCurrent: params.commitGuard,
		workerAuthority: params.workerAuthority
	});
	onFinalized();
	if (!exact) await finishRecovery();
	return restored;
}
//#endregion
//#region src/agents/worktrees/service.ts
const IDLE_GC_MS = 6048e5;
const SNAPSHOT_RETENTION_MS = 2592e6;
const WORKTREE_GC_INTERVAL_MS = 36e5;
const log = createSubsystemLogger("agents/worktrees");
async function claimManagedRemoval(env, record, params) {
	const token = params.claimToken ?? randomUUID();
	const claim = () => claimWorktreeRemoval(env, {
		worktreeId: record.id,
		token,
		assertCurrent: params.commitGuard,
		workerAuthority: {
			...params.workerAuthority,
			assertCurrent: params.workerAuthority ? params.workerAuthority.assertCurrent : params.commitGuard,
			predicates: [...params.workerAuthority?.predicates ?? [], {
				kind: "binding",
				record
			}]
		}
	});
	await (params.withOwnerMutation ? params.withOwnerMutation(claim) : claim());
	return token;
}
var ManagedWorktreeService = class {
	constructor(options = {}) {
		this.cleanupDeferrals = /* @__PURE__ */ new Map();
		this.orphanCleanupFailures = /* @__PURE__ */ new Map();
		this.listRegistryRecords = () => readRegistryWorktrees(this.env);
		this.env = options.env ?? process.env;
		this.now = options.now ?? Date.now;
		this.getConfig = options.getConfig;
		this.maintainGit = createWorktreeGitMaintenance(this.env, this.now);
		this.capacity = createWorktreeCapacityOwner({
			env: this.env,
			now: this.now,
			getConfig: this.getConfig
		});
	}
	async create(params) {
		return (await this.createWithOutcome(params)).record;
	}
	async createWithOutcome(params) {
		return withWorktreePreparationTiming("managed", () => withWorktreeRunEnd(this.env, async () => {
			params.signal?.throwIfAborted();
			const repository = await resolveRepository(params.repoRoot);
			return await withWorktreeBasePreparation(repository, async (prepareBase) => createWithWorktreeAllocation({
				...params,
				env: this.env
			}, async (guard, publication) => await withWorktreeSources(this.env, async (retainRepository) => {
				const retainSources = await retainRepository({
					...params,
					...guard,
					repository
				});
				const gitInventory = await readWorktreeGitInventory(repository.repoRoot, params.name);
				const owned = {
					...params,
					...guard,
					retainSources,
					prepareBase,
					gitInventory
				};
				const creation = await this.withAllocationLease(owned, (allocation) => this.reserveForOwner(owned, allocation, repository, publication));
				return typeof creation === "function" ? await creation() : creation;
			}), (record) => this.rollbackPreparation(record, params.withRollback)));
		}));
	}
	async createEmpty(params) {
		return (await this.createEmptyWithOutcome(params)).record;
	}
	async createEmptyWithOutcome(params) {
		return withWorktreePreparationTiming("managed", () => withWorktreeRunEnd(this.env, async () => {
			let sourceRoot;
			try {
				return await createWithWorktreeAllocation({
					...params,
					env: this.env
				}, async (guard, publication) => withWorktreeSources(this.env, async (retainRepository) => {
					const creation = await this.withAllocationLease({
						...params,
						...guard
					}, async (allocation) => {
						const repoRoot = await ensureEmptyWorktreeSource({
							env: this.env,
							ownerId: params.ownerId,
							signal: allocation.signal,
							commitGuard: allocation.commitGuard
						});
						sourceRoot = repoRoot;
						const repository = await resolveRepository(repoRoot);
						const gitInventory = await readWorktreeGitInventory(repoRoot, params.name);
						const prepared = {
							...params,
							...guard,
							repoRoot,
							baseRef: "main",
							runSetupScript: false,
							gitInventory
						};
						const retainSources = await retainRepository({
							...prepared,
							repository
						});
						return await this.reserveForOwner({
							...prepared,
							retainSources
						}, allocation, repository, publication);
					});
					return typeof creation === "function" ? await creation() : creation;
				}), (record) => this.rollbackPreparation(record, params.withRollback));
			} catch (error) {
				if (sourceRoot) {
					const repoRoot = sourceRoot;
					try {
						await this.withAllocationLease({}, async (guard) => {
							await removeUnusedEmptyWorktreeSource({
								env: this.env,
								record: {
									repoRoot,
									ownerKind: "session",
									ownerId: params.ownerId
								},
								signal: guard.signal,
								commitGuard: () => guard.commitGuard?.()
							});
						});
					} catch (cleanupError) {
						throw new AggregateError([error, cleanupError], `${String(error)}\nEmpty workspace cleanup failed: ${String(cleanupError)}`, { cause: cleanupError });
					}
				}
				throw error;
			}
		}));
	}
	async reserveForOwner(params, allocation, repository, publication) {
		return await withWorktreeSource({
			...params,
			...allocation
		}, (current) => createOwnedWorktree({
			...current,
			retainSources: params.retainSources
		}, repository, this.env, this.now, (name) => this.reserveForRepository(params, current, repository, name, publication)));
	}
	async rollbackPreparation(prepared, withRollback) {
		return withWorktreeRunEnd(this.env, async () => {
			await this.withAllocationLease({ id: prepared.id }, async (allocation) => {
				const remove = async (assertCheckoutCurrent) => {
					const commitGuard = () => {
						allocation.commitGuard?.();
						assertCheckoutCurrent?.();
					};
					commitGuard();
					const current = await readRegistryWorktreeForMutation({
						env: this.env,
						id: prepared.id,
						commitGuard
					});
					if (!current || current.removedAt !== void 0 || current.path !== prepared.path || current.repoRoot !== prepared.repoRoot || current.repoFingerprint !== prepared.repoFingerprint || current.branch !== prepared.branch || current.baseRef !== prepared.baseRef || current.ownerKind !== prepared.ownerKind || current.ownerId !== prepared.ownerId || current.createdAt !== prepared.createdAt || current.lastActiveAt !== prepared.lastActiveAt) throw new Error("Worktree changed before preparation rollback; checkout preserved.");
					await this.removeWithAllocation({
						id: prepared.id,
						reason: "session-create-failed",
						allowSnapshotLoss: prepared.snapshotRef === void 0,
						signal: allocation.signal,
						commitGuard,
						workerAuthority: {
							...allocation.workerAuthority,
							assertCurrent: () => {
								allocation.workerAuthority?.assertCurrent?.();
								assertCheckoutCurrent?.();
							}
						},
						rollbackGuard: allocation.rollbackGuard,
						requireDiskSpace: allocation.requireDiskSpace
					}, void 0);
				};
				await (withRollback ? withRollback(remove) : remove());
			});
		});
	}
	async withAllocationLease(params, run) {
		return await withWorktreeAllocationLease({
			...params,
			env: this.env
		}, run);
	}
	async reserveForRepository(params, allocation, repository, inferredName, publication) {
		params.signal?.throwIfAborted();
		params.onProgress?.("checkout");
		const collision = (await readPendingWorktrees(this.env)).find(({ record, state }) => params.name && record.repoFingerprint === repository.fingerprint && record.name === params.name || state === "pending" && params.ownerId && worktreeOwnerMatches(record, params));
		if (collision) {
			if (collision.state === "pending" && worktreeOwnerMatches(collision.record, params)) throw new WorktreePendingContentionError(collision.record.id);
			throw new Error(`Interrupted worktree creation retained at ${collision.record.path}; inspect its Git registration and choose an unused name before retrying.`);
		}
		const suppliedName = params.name === void 0 ? void 0 : validateName(params.name);
		const existing = suppliedName ? await findWorktreeByName(this.env, repository.fingerprint, suppliedName) : void 0;
		if (existing && params.profiles?.length) throw new Error("Source profiles require a new worktree; choose an unused --name.");
		if (existing && (!existing.removedAt || existing.snapshotRef) && !worktreeOwnerMatches(existing, params)) throw new Error(`worktree name is already in use by ${existing.ownerKind}${existing.ownerId ? ` ${existing.ownerId}` : ""}: ${suppliedName}`);
		if (existing && existing.removedAt === void 0) {
			if (await worktreePathExists(existing.path)) return {
				record: await rebindLiveWorktreeRepository(this.env, existing, allocation),
				materialized: false
			};
			await updateRegistryWorktree(this.env, existing.id, { removedAt: this.now() }, { workerAuthority: {
				...allocation.workerAuthority,
				predicates: [...allocation.workerAuthority.predicates ?? [], {
					kind: "binding",
					record: existing
				}]
			} });
		}
		if (existing && existing.removedAt !== void 0 && existing.snapshotRef) {
			const record = await withWorktreeMutationLease({
				...allocation,
				env: this.env,
				id: existing.id
			}, (guard) => this.restoreWithAllocation({
				...guard,
				id: existing.id
			}));
			publication.record = { ...record };
			return {
				record,
				materialized: true
			};
		}
		const destination = await prepareWorktreeDestination({
			env: this.env,
			configuredRoot: this.getConfig?.().worktreeRoot,
			repository,
			gitInventory: params.gitInventory,
			owner: params,
			suppliedName,
			suggestedName: params.suggestedName ?? inferredName
		});
		await params.retainSources([destination.worktreePath]);
		await this.capacity.admit(allocation);
		const createdAt = this.now();
		const pending = {
			id: publication.id,
			name: destination.name,
			repoFingerprint: repository.fingerprint,
			repoRoot: repository.repoRoot,
			path: destination.worktreePath,
			branch: destination.branch,
			baseRef: params.baseRef ?? "HEAD",
			ownerKind: params.ownerKind ?? "manual",
			...params.ownerId ? { ownerId: params.ownerId } : {},
			createdAt,
			lastActiveAt: createdAt
		};
		publication.pending = pending;
		await reservePendingWorktree(this.env, pending, allocation.workerAuthority);
		return () => this.createReservedRepository(params, repository, destination, pending, publication);
	}
	async createReservedRepository(params, repository, destination, pending, publication) {
		let prepared = false;
		try {
			const materialized = await withWorktreeSource(params, async (current) => {
				const created = await this.materializeRepositoryWorktree({
					...current,
					retainSources: params.retainSources,
					prepareBase: params.prepareBase
				}, repository, destination, publication.id);
				prepared = true;
				return created;
			});
			const provisionedPaths = await timeWorktreePreparationPhase("provision", () => completeRepositoryWorktreeSetup(params, this.env, repository, materialized));
			return await timeWorktreePreparationPhase("publication", () => withWorktreeSource(params, async (current) => {
				current.signal?.throwIfAborted();
				current.commitGuard?.();
				await requireAllocationSpace(current, this.env, materialized.worktreePath, repository);
				current.commitGuard();
				const record = {
					...pending,
					baseRef: materialized.recordBase
				};
				await insertRegistryWorktree(this.env, record, {
					pendingId: pending.id,
					provisionedPaths,
					workerAuthority: current.workerAuthority
				});
				publication.pending = void 0;
				publication.record = { ...record };
				current.commitGuard();
				return {
					record,
					materialized: true
				};
			}));
		} catch (error) {
			const failures = [error];
			if (prepared && !publication.record && !hasWorktreeUnknownOutcome(error)) try {
				const { worktreePath, branch } = destination;
				const cleanup = async (assertCheckoutCurrent) => {
					const commitGuard = () => {
						params.rollbackGuard();
						assertCheckoutCurrent?.();
					};
					const published = await readRegistryWorktreeForMutation({
						env: this.env,
						id: pending.id,
						commitGuard
					});
					if (published) {
						publication.record = published;
						return;
					}
					const failure = await removeFailedWorktree(repository.repoRoot, worktreePath, branch, commitGuard);
					if (failure) throw failure;
				};
				await (params.withRollback ? params.withRollback(cleanup) : cleanup());
			} catch (cleanupError) {
				failures.push(new Error(`failed to clean up worktree creation: ${String(cleanupError)}`, { cause: cleanupError }));
			}
			if (failures.length > 1) throw new AggregateError(failures, failures.map(String).join("\n"), { cause: error });
			throw error;
		}
	}
	async materializeRepositoryWorktree(params, repository, destination, worktreeId) {
		const { root, worktreePath, branch } = destination;
		params.signal?.throwIfAborted();
		params.commitGuard?.();
		await requireAllocationSpace(params, this.env, worktreePath, repository);
		params.commitGuard?.();
		const base = await timeWorktreePreparationPhase("base", () => resolveWorktreeCreationBase(repository.repoRoot, params));
		let gitBytes = 0;
		const provisionedBytes = params.provisionIgnoredFiles === false ? 0 : (await runGitWorkerOperation({
			type: "worktree.provisioning-inspection",
			input: { sourceRoot: repository.sourceRoot }
		}, {
			signal: params.signal,
			assertCurrent: params.commitGuard
		})).estimatedBytes;
		const setupStat = params.runSetupScript === false ? void 0 : await fs$1.stat(path.join(repository.sourceRoot, ".openclaw", "worktree-setup.sh")).catch(() => void 0);
		const runRepositorySetup = setupStat?.isFile() === true && (setupStat.mode & 73) !== 0;
		const onPromptReady = params.onPromptReady && !runRepositorySetup && !await worktreePathExists(path.join(repository.sourceRoot, ".worktreeinclude")) ? params.onPromptReady : void 0;
		const setupBytes = runRepositorySetup ? Math.max(WORKTREE_SETUP_HEADROOM_BYTES, await directorySizeBytes(repository.sourceRoot, true, {
			signal: params.signal,
			assertCurrent: params.commitGuard
		})) : 0;
		params.signal?.throwIfAborted();
		params.commitGuard?.();
		const gitBase = params.profiles?.length ? base.commit : base.gitOperand;
		const addCheckout = async () => {
			const sourceProfile = params.profiles?.length ? await resolveWorktreeSourceProfile(repository.repoRoot, gitBase, params.profiles, {
				signal: params.signal,
				commitGuard: () => params.commitGuard?.()
			}) : void 0;
			params.signal?.throwIfAborted();
			params.commitGuard?.();
			await fs$1.mkdir(root, { recursive: true });
			return await addManagedWorktree({
				env: this.env,
				now: this.now,
				waitBudget: params.waitBudget,
				enabled: this.getConfig?.().worktreeAcceleration !== false,
				repoRoot: repository.repoRoot,
				commonDir: repository.commonDir,
				worktreeRoot: path.dirname(root),
				destination: worktreePath,
				sourceOnly: params.provisionIgnoredFiles === false,
				branch,
				base: sourceProfile?.commit ?? gitBase,
				sourceProfile,
				...onPromptReady ? { onPromptReady: async (commit) => onPromptReady({
					id: worktreeId,
					path: worktreePath,
					branch,
					repoRoot: repository.repoRoot,
					commit
				}) } : {},
				prepareCommit: async (commit) => {
					const guard = {
						signal: params.signal,
						assertCurrent: params.commitGuard
					};
					await logWorktreeBase(repository.repoRoot, base, commit, {
						worktreePath,
						ownerId: params.ownerId,
						now: this.now(),
						...guard
					});
					return gitBytes = await estimateWorktreeGitBytes(repository.repoRoot, commit, {
						...guard,
						preparationKey: base.preparationKey
					});
				},
				requireSpace: (cloneBytes) => requireAllocationSpace(params, this.env, worktreePath, repository, (cloneBytes ?? 2 * gitBytes) + 2 * provisionedBytes + setupBytes),
				signal: params.signal,
				commitGuard: () => params.commitGuard?.(),
				rollbackGuard: params.rollbackGuard
			});
		};
		const added = await timeWorktreePreparationPhase("checkout", addCheckout);
		params.signal?.throwIfAborted();
		params.commitGuard?.();
		if (added.code !== 0) throw createGitCommandError("git worktree add", added);
		return {
			worktreePath,
			recordBase: base.recordRef,
			provisionedBytes,
			setupBytes,
			runRepositorySetup
		};
	}
	async list() {
		return await withWorktreeRunEnd(this.env, async () => reconcileListedWorktrees(this.env, await readRegistryWorktrees(this.env), this.now));
	}
	async findLiveByOwner(ownerKind, ownerId) {
		return await readLiveRegistryWorktreeByOwner(captureWorktreeRunEndContext(this.env), ownerKind, ownerId);
	}
	/** Resolves the canonical registry root and the caller's own checkout root. */
	async resolveRepositoryPaths(repoRoot) {
		const resolved = await resolveRepositoryPaths(repoRoot);
		return {
			canonicalRoot: resolved.canonicalRoot,
			sourceRoot: resolved.sourceRoot
		};
	}
	/** Resolves the repository facts shared by managed worktrees and project discovery. */
	async resolveRepositoryIdentity(repoRoot) {
		return await resolveRepositoryIdentity(repoRoot);
	}
	async resolveRepositoryIdentities(roots) {
		return await runGitReadOperation({
			type: "repository.identities",
			input: { roots }
		});
	}
	/**
	* Lists selectable base refs for a repository without touching the network.
	* Base-ref pickers must stay snappy; resolveWorktreeBase() still fetches on create
	* when no explicit ref is chosen.
	*/
	async listRepositoryBranches(repoRoot, options = {}) {
		return await runGitReadOperation({
			type: "repository.branches",
			input: {
				repoRoot,
				...options
			}
		});
	}
	async acquire(id, guard = {}) {
		return await acquireManagedWorktree(this.env, id, this.now, guard);
	}
	async release(id, guard = {}) {
		const record = await readRegistryWorktreeForMutation({
			...guard,
			env: this.env,
			id
		});
		if (!record || record.removedAt !== void 0 || !await worktreePathExists(record.path)) return;
		const state = await lockState(record);
		if (state.kind === "foreign" || state.kind === "live" && state.pid !== process.pid) return;
		if (state.kind !== "none") {
			guard.signal?.throwIfAborted();
			guard.commitGuard?.();
			await unlockWorktree(record, {
				signal: guard.signal,
				beforeRun: guard.commitGuard
			});
		}
	}
	async remove(input) {
		return withWorktreeRunEnd(this.env, async () => {
			let params = input;
			if (params.exactState) {
				if (params.allowSnapshotLoss || params.requireLossless) throw new Error("Exact-state retirement cannot permit snapshot loss or select clean-only removal");
				params = {
					...params,
					exactState: exactStateRetirementSchema.parse(params.exactState)
				};
			}
			let removalPath;
			let deferral;
			const timing = startGitOperationTiming("worktree-removal", log, () => ({
				id: params.id,
				path: removalPath,
				deferred: deferral ?? false
			}));
			let outcome = "threw";
			try {
				const record = requireActiveWorktreeRecord(params.id, await readRegistryWorktreeForMutation({
					...params,
					env: this.env
				}));
				removalPath = record.path;
				assertWorktreeRemovalAvailable(this.env, record.id, params.claimToken);
				if (params.withOwnerMutation && !params.claimToken) params = {
					...params,
					claimToken: await claimManagedRemoval(this.env, record, params)
				};
				const result = await withWorktreeMutationLease({
					...params,
					id: record.id,
					env: this.env
				}, async (guard) => {
					timing?.markPhase();
					try {
						return await this.removeWithAllocation({
							...params,
							...guard
						}, timing, (value) => {
							deferral = value;
						});
					} finally {
						timing?.markRemovalStage();
						timing?.markPhase();
					}
				});
				outcome = "returned";
				return result;
			} catch (error) {
				if (params.withOwnerMutation && params.claimToken && !hasWorktreeUnknownOutcome(error)) await abortWorktreeRemovalRow(this.env, params.id, params.claimToken);
				throw error;
			} finally {
				timing?.finish(outcome);
			}
		});
	}
	async removeWithAllocation(params, timing, onDeferred) {
		timing?.markRemovalStage("preparation");
		params.signal?.throwIfAborted();
		params.commitGuard?.();
		const record = requireActiveWorktreeRecord(params.id, await readRegistryWorktreeForMutation({
			...params,
			env: this.env
		}));
		if (params.exactState) {
			assertExactStateOwner(record, params.exactState);
			const pending = await runGit(record.repoRoot, [
				"show-ref",
				"--verify",
				"--quiet",
				`refs/openclaw/removals/${record.id}`
			], {
				signal: params.signal,
				beforeRun: params.commitGuard
			});
			if (pending.code === 0) throw new Error("Previous worktree removal may be incomplete; source and recovery snapshot preserved");
			if (pending.code !== 1) throw createGitCommandError("git show-ref", pending);
		}
		const claimToken = params.claimToken ?? await claimManagedRemoval(this.env, record, params);
		createWorktreeRemovalClaimsGuard(this.env, [record.id], claimToken)();
		try {
			const { withSettledLocalWorkspace } = await import("./local-workspace-projection-B04UXZLe.mjs");
			return await withSettledLocalWorkspace({
				worktree: record,
				env: this.env,
				assertCurrent: params.commitGuard,
				workerAuthority: params.workerAuthority,
				retireRuntime: true
			}, (accepted) => removeSettledManagedWorktree({
				...params,
				claimToken,
				workerAuthority: {
					...params.workerAuthority,
					...accepted?.workerAuthority,
					leaseSet: accepted?.workerAuthority.leaseSet ?? params.workerAuthority.leaseSet
				},
				commitGuard: () => {
					params.commitGuard?.();
					accepted?.assertCurrent();
				}
			}, {
				env: this.env,
				now: this.now,
				getConfig: this.getConfig ?? readRuntimeConfig,
				snapshotRetentionMs: SNAPSHOT_RETENTION_MS
			}, timing, accepted?.prepareArchive));
		} catch (error) {
			timing?.markRemovalFailure();
			timing?.markRemovalStage("finalization");
			if (hasWorktreeUnknownOutcome(error)) throw error;
			let failure = error;
			try {
				if (timing && isWorktreeRemovalTimeout(error)) {
					const progress = timing.removalProgress();
					const deferred = await deferFailedWorktreeRemoval({
						env: this.env,
						id: record.id,
						...progress,
						reason: `Git ${progress.stage} timed out; cleanup deferred`,
						now: this.now(),
						previousAttempts: record.gcRetry?.attempts ?? 0,
						claimToken,
						assertCurrent: params.rollbackGuard
					});
					onDeferred?.(deferred);
				}
			} catch (deferralError) {
				if (hasWorktreeUnknownOutcome(deferralError)) throw deferralError;
				failure = new AggregateError([error, deferralError], "Worktree removal and timeout recording failed", { cause: deferralError });
			}
			await abortWorktreeRemovalRow(this.env, record.id, claimToken);
			throw failure;
		}
	}
	async recoverRemoval(params) {
		return withWorktreeRunEnd(this.env, async () => {
			const { recoverManagedWorktreeRemoval } = await import("./removal-recovery-cq434OAz.mjs");
			return await recoverManagedWorktreeRemoval(params, {
				env: this.env,
				now: this.now
			});
		});
	}
	async retireSnapshot(params) {
		return withWorktreeRunEnd(this.env, () => retireManagedWorktreeSnapshotById(params, this.env));
	}
	async restore(params) {
		return await withWorktreeRunEnd(this.env, async () => {
			const record = requireManagedWorktreeRestoreRecord(params.id, await readRegistryWorktreeForMutation({
				...params,
				env: this.env
			}));
			return await this.withAllocationLease({
				...params,
				id: record.id
			}, (guard) => this.restoreWithAllocation({
				...params,
				...guard,
				id: record.id
			}));
		});
	}
	async restoreWithAllocation(params) {
		return await restoreManagedWorktreeSnapshot(params, {
			env: this.env,
			now: this.now,
			getConfig: this.getConfig,
			admitCapacity: () => this.capacity.admit(params)
		});
	}
	async removeIfLossless(id, guard = {}) {
		return withWorktreeRunEnd(this.env, async () => {
			guard.signal?.throwIfAborted();
			guard.commitGuard?.();
			return await removeWorktreeIfLossless({
				...guard,
				record: requireActiveWorktreeRecord(id, await readRegistryWorktreeForMutation({
					...guard,
					env: this.env,
					id
				})),
				env: this.env,
				now: this.now,
				getConfig: this.getConfig ?? readRuntimeConfig,
				prepareRecord: (record) => rebindLiveWorktreeRepository(this.env, record, guard),
				remove: async (params) => {
					await this.release(id, guard);
					return await this.remove({
						...guard,
						...params,
						reason: "run-end",
						requireLossless: true,
						runEndCleanup: {
							outcome: "removed-lossless",
							at: this.now()
						}
					});
				}
			});
		});
	}
	async removeIfLosslessByPath(worktreePath, owner, guard = {}) {
		const record = await readLiveRegistryWorktreeByPath(captureWorktreeRunEndContext(this.env), worktreePath);
		if (!record || !worktreeOwnerMatches(record, owner)) return false;
		return await this.removeIfLossless(record.id, guard);
	}
	async releaseByPath(worktreePath, guard = {}) {
		const record = await readLiveRegistryWorktreeByPath(captureWorktreeRunEndContext(this.env), worktreePath);
		if (record) await this.release(record.id, guard);
	}
	async gc(params = {}) {
		return withWorktreeRunEnd(this.env, async () => {
			const assertCurrent = () => {
				params.signal?.throwIfAborted();
				params.commitGuard?.();
			};
			assertCurrent();
			const now = this.now();
			const prefilter = createWorktreeGcPrefilter();
			const progress = new WorktreeGcProgress();
			for (const error of await retryWorktreeCapacityReleases(this.env)) progress.error("limits", error);
			assertCurrent();
			if (params.retryDeferred) {
				await this.maintainGit({
					...params,
					progress
				});
				assertCurrent();
				this.orphanCleanupFailures.clear();
			}
			const { records, leases } = await readWorktreeCleanupState(this.env);
			const classification = {
				...params,
				...await params.prepareOwners?.(records)
			};
			assertCurrent();
			const liveIds = new Set(records.filter((record) => record.removedAt === void 0).map((record) => record.id));
			for (const id of this.cleanupDeferrals.keys()) if (!liveIds.has(id)) this.cleanupDeferrals.delete(id);
			const liveLeaseScopes = new Set(leases.liveScopes);
			const hasLiveLease = (id) => liveLeaseScopes.has(worktreeRunLeaseScope(id));
			const protect = (record) => autoRemovalProtectionReason(record, prefilter, hasLiveLease, {
				env: this.env,
				getConfig: this.getConfig ?? readRuntimeConfig,
				signal: params.signal,
				beforeRun: assertCurrent,
				deferrals: this.cleanupDeferrals,
				now
			}, classification);
			const { collect } = createWorktreeGcRemoval({
				env: this.env,
				records,
				now,
				progress,
				policy: params,
				expiresBefore: now - IDLE_GC_MS,
				classifyOwner: classification.readOwnerState,
				signal: params.signal,
				assertCurrent,
				remove: (input) => this.remove(input)
			});
			await this.capacity.cleanup({
				records,
				hasLiveLease,
				progress,
				guard: params,
				checkpoint: () => params.checkpoint?.(progress.result) ?? Promise.resolve()
			});
			await collect(protect, () => params.checkpoint?.(progress.result));
			try {
				if (await hasTemplatesAsync(this.env)) await collectWorktreeTemplates(this.env, now - IDLE_GC_MS, {
					signal: params.signal,
					commitGuard: assertCurrent
				}, (error, id) => progress.error("templates", error, id));
			} catch (error) {
				assertCurrent();
				progress.error("templates", error);
				log.warn(`worktree template cleanup deferred: ${String(error)}`);
			}
			const { orphansDeleted, snapshotsPruned } = await collectRetiredWorktreeArtifacts({
				env: this.env,
				getConfig: this.getConfig,
				records,
				expiresBefore: now - SNAPSHOT_RETENTION_MS,
				progress,
				orphanFailures: this.orphanCleanupFailures,
				withAllocationLease: (run) => this.withAllocationLease(params, run)
			});
			try {
				await reapWorktreeRunLeases(this.env, leases.staleScopes, assertCurrent);
			} catch (error) {
				progress.error("idle", error);
			}
			progress.result.orphansDeleted = orphansDeleted;
			progress.result.snapshotsPruned = snapshotsPruned;
			assertCurrent();
			if (!params.retryDeferred) await this.maintainGit({
				...params,
				progress
			});
			assertCurrent();
			return progress.result;
		});
	}
};
const managedWorktrees = new ManagedWorktreeService({ getConfig: readRuntimeConfig });
//#endregion
export { managedWorktrees as a, WORKTREE_GC_INTERVAL_MS as i, ManagedWorktreeService as n, WorktreeGcProgress as o, SNAPSHOT_RETENTION_MS as r, IDLE_GC_MS as t };
