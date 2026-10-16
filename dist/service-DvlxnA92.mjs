import { t as containsAsciiControlCharacter } from "./string-normalization-CECOqf64.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as mergeProcessEnv } from "./process-env-DlZFJzq6.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-BUXBSN-4.mjs";
import { r as isMissingPathError, t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { Fn as object, Jn as string, xn as literal } from "./schemas-BOYIvvln.mjs";
import { n as OpenClawStateLeaseError } from "./openclaw-state-lease-error-Ds9BTWol.mjs";
import { c as gitNullConfigPath, d as requireGitCommandOutput, f as startGitOperationTiming, l as normalizeGitPathForFilesystem, n as createGitCommandError } from "./git-exec-rH66305f.mjs";
import { a as writeFileWindowFully } from "./file-descriptor-B4yBUiAP.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import "./openclaw-state-lease-CdKflcqg.mjs";
import { c as WorktreeRepositoryError } from "./git-worker-context-BSo6KDXb.mjs";
import { c as requireGit, f as runGit, h as worktreePathExists, l as requireGitBuffer, o as listGitWorktrees, s as lstatIfExists, t as WORKTREE_CHECKOUT_TIMEOUT_MS, u as resolveGitMetadataPath } from "./git-DK_u9XbK.mjs";
import { t as runGitWorkerOperation } from "./git-worker-pOqNR_b6.mjs";
import { t as createCrustaceanSlug } from "./session-slug-DsU90tbm.mjs";
import { c as worktreeRunLeaseScope, i as WorktreeRemovalContentionError } from "./run-lease-store.kernel-CMstqu0z.mjs";
import { i as readLiveRegistryWorktreeIds, n as getRegistryWorktreeProvisionedPaths, o as readRegistryWorktrees, r as getRegistryWorktreeProvisionedState, s as readWorktreeCleanupState, t as getRegistryWorktreeProvisionedChunk } from "./registry-read-CqOwdsWM.mjs";
import { a as clearRegistryWorktreeProvisionedChunks, b as updateRegistryWorktree, c as finalizeWorktreeRemovalRows, d as getRegistryWorktree, g as listRegistryWorktrees, l as findLiveRegistryWorktreeByOwner, m as insertRegistryWorktreeProvisionedChunk, n as assertRegistrySnapshotRetirement, o as deleteRegistryWorktree, p as insertRegistryWorktree, r as assertWorktreeRemovalClaim, t as abortWorktreeRemovalRow, u as findLiveRegistryWorktreeByPath } from "./registry-Bm5FVBwN.mjs";
import { t as runGitReadOperation } from "./git-read-cache-ULbuhQBO.mjs";
import { t as withWorktreeAllocationLease } from "./allocation-D2ptJdFR.mjs";
import { a as requireWorktreeDiskSpace, i as estimateWorktreeGitBytes, n as directorySizeBytes, r as estimateWorktreeCheckoutTransitionBytes, t as WORKTREE_SETUP_HEADROOM_BYTES } from "./capacity-BLcBSfzr.mjs";
import { t as withWorktreeGitConfig } from "./checkout-git-config-CA7TAxaq.mjs";
import { n as withManagedWorktreeGit, t as usesSourceOnlyWorktreeGit } from "./checkout-policy-CQpGiRNf.mjs";
import { a as detectWorktreeFilesystemBackend, i as hasTemplatesAsync, n as collectWorktreeTemplates, r as prepareWorktreeTemplate } from "./template-cache-DdO3K1S6.mjs";
import { _ as WorktreeSnapshotError, a as removeManagedCheckout, c as requireManagedWorktreeHead, d as withExactStateGitLocks, f as canonicalPathKey, g as WorktreeRemovalLockError, h as WorktreeBranchMovedError, i as prepareSnapshotBranchDeletion, l as restoreRetiredExactWorktree, m as shouldPreserveOrphanCandidate, n as assertExactStateSourceIdentity, o as requireExactManagedWorktreeHead, p as resolveManagedWorktreePathKeys, r as hasExactWorktreeIndex, s as requireExactWorktreeRepository, t as assertExactStateOwner, u as retireExactWorktree, v as classifyWorktreeRemovalError, y as isWorktreePermissionError } from "./removal-git-C1z0ZRNp.mjs";
import { a as removeFailedWorktree, c as resolveRepositoryFromRealPath, d as validateName, f as withWorktreeSource, i as generateName, l as resolveRepositoryIdentity, m as worktreeOwnerMatches, n as cleanupFailedCreate, o as resetFailedWorktreeAdd, r as findWorktreeByName, s as resolveRepository, t as canResetFailedWorktreeAdd, u as runSetupScript } from "./service-preparation-DirAUHyx.mjs";
import { a as reapWorktreeRunLeases, c as lockWorktreeForProcess, l as unlockWorktree, n as claimWorktreeRemoval, o as createWorktreeGcPrefilter, r as hasLiveWorktreeRunLease, s as lockState } from "./run-lease-CixZzbdu.mjs";
import { c as rawPathStat, i as gitPathspecBatches, l as splitNullBuffer } from "./git-path-inventory-BZyLLmiS.mjs";
import { c as inspectProvisionedFiles, i as restoreExactStateMetadata, l as normalizeProvisionedRelativePath, o as hasSafeParentDirectories, r as readExactStateSnapshot, u as resolveGitPath } from "./snapshot-exact-state-BcKdjkDd.mjs";
import { t as exactStateRetirementSchema } from "./snapshot-exact-state-contract-DalOBOq9.mjs";
import { constants, lstatSync } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
//#region src/agents/worktrees/base-ref.ts
var InvalidWorktreeBaseRefError = class extends Error {
	constructor(options) {
		super("Worktree base ref does not resolve to a commit. Choose a local or remote branch and retry.", options);
		this.name = "InvalidWorktreeBaseRefError";
	}
};
async function resolveWorktreeBase(repoRoot, baseRef, signal, assertCurrent) {
	if (baseRef) {
		const verified = await runGit(repoRoot, [
			"-c",
			"core.warnAmbiguousRefs=true",
			"rev-parse",
			"--verify",
			"--end-of-options",
			`${baseRef === "-" ? "@{-1}" : baseRef}^{commit}`
		], {
			signal,
			beforeRun: assertCurrent
		});
		signal?.throwIfAborted();
		if (verified.termination === "exit" && typeof verified.code === "number" && verified.code !== 0) throw new InvalidWorktreeBaseRefError({ cause: createGitCommandError("git rev-parse --verify", verified) });
		const commit = requireGitCommandOutput("git rev-parse --verify", verified).trim();
		if (!commit || commit.includes("\n") || verified.stderr.trim()) throw new InvalidWorktreeBaseRefError({ cause: createGitCommandError("git rev-parse --verify", verified) });
		return {
			commit,
			gitOperand: baseRef !== "-" && baseRef.startsWith("-") ? commit : baseRef,
			recordRef: baseRef,
			remote: false
		};
	}
	const fetched = await runGit(repoRoot, [
		"fetch",
		"--no-auto-maintenance",
		"origin"
	], {
		signal,
		beforeRun: assertCurrent
	});
	signal?.throwIfAborted();
	if (fetched.termination === "exit" && fetched.code === 0) {
		const remoteHead = await runGit(repoRoot, [
			"symbolic-ref",
			"--quiet",
			"--short",
			"refs/remotes/origin/HEAD"
		], {
			signal,
			beforeRun: assertCurrent
		});
		if (remoteHead.termination === "exit" && remoteHead.code === 0 && remoteHead.stdout.trim()) {
			const remoteRef = remoteHead.stdout.trim();
			try {
				return {
					...await resolveWorktreeBase(repoRoot, remoteRef, signal, assertCurrent),
					remote: true
				};
			} catch (error) {
				if (!(error instanceof InvalidWorktreeBaseRefError)) throw error;
			}
		}
	}
	return await resolveWorktreeBase(repoRoot, "HEAD", signal, assertCurrent);
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
//#region src/agents/worktrees/checkout.ts
const log$2 = createSubsystemLogger("agents/worktrees");
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
		beforeRun: () => {
			assertOwned(options);
			options.requireSpace(cloneBytes);
		},
		timeoutMs: WORKTREE_CHECKOUT_TIMEOUT_MS,
		...options.checkoutBudget
	};
}
function digest(value) {
	return createHash("sha256").update(value).digest("hex");
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
async function checkoutKey(options, commit) {
	if ([
		"GIT_INDEX_FILE",
		"GIT_WORK_TREE",
		"GIT_DIR",
		"GIT_COMMON_DIR",
		"GIT_CONFIG",
		"GIT_ATTR_SOURCE"
	].some((key) => process.env[key])) return;
	const config = await requireGit(options.repoRoot, [
		"config",
		"--null",
		"--list"
	], gitOptions(options));
	const checkoutConfig = [];
	for (const field of config.split("\0")) {
		const key = field.split("\n", 1)[0]?.toLowerCase() ?? "";
		if (key.startsWith("branch.")) continue;
		if (/^(filter\.|includeif\.|core\.(attributesfile|worktree|sparsecheckout|splitindex)$|extensions\.worktreeconfig$|index\.sparse$)/u.test(key)) return;
		checkoutConfig.push(field);
	}
	if (await worktreePathExists(path.join(options.commonDir, "info", "attributes"))) return;
	const attributePaths = await Promise.allSettled(["GIT_ATTR_GLOBAL", "GIT_ATTR_SYSTEM"].map((variable) => runGit(options.repoRoot, ["var", variable], gitOptions(options))));
	for (const probe of attributePaths) {
		if (probe.status === "rejected") throw probe.reason;
		const result = probe.value;
		if (result.termination === "exit" && result.code === 1 && !result.stdout.trim() && !result.stderr.trim()) continue;
		if (result.termination !== "exit" || result.code !== 0 || result.stdoutTruncatedBytes || result.stdout.trim() && await worktreePathExists(normalizeGitPathForFilesystem(result.stdout.trim()))) return;
	}
	return digest(`source-v1\n${commit}\n${checkoutConfig.join("\0")}`);
}
async function prepareTemplate(options) {
	const backend = await detectWorktreeFilesystemBackend(path.dirname(options.destination), options);
	if (!backend) return;
	const commit = await requireGit(options.repoRoot, [
		"rev-parse",
		"--verify",
		`${options.base}^{commit}`
	], gitOptions(options));
	const contentKey = await checkoutKey(options, commit);
	if (!contentKey) return;
	const cacheKey = digest(`${options.commonDir}\n${options.worktreeRoot}`);
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
		validate: async (existing) => {
			const status = await runGit(existing.path, [
				"status",
				"--porcelain=v2",
				"--branch",
				"-z",
				"--untracked-files=all",
				"--ignored"
			], gitOptions(options));
			const fields = status.stdout.split("\0");
			const heads = fields.filter((field) => field.startsWith("# branch.oid "));
			return status.termination === "exit" && status.code === 0 && !status.stdoutTruncatedBytes && fields.pop() === "" && fields.every((field) => field.startsWith("# ")) && heads.length === 1 && heads[0] === `# branch.oid ${commit}`;
		},
		prepare: async (preparing) => {
			options.requireSpace();
			await backend.createTemplate(preparing.path, options);
			await requireGit(options.repoRoot, [
				"worktree",
				"add",
				"--detach",
				"--",
				preparing.path,
				commit
			], checkoutGitOptions(options));
		}
	});
	return record ? {
		record,
		backend,
		sourceIndex: await resolveGitMetadataPath(record.path, "index", gitOptions(options))
	} : void 0;
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
	const added = await runGit(input.repoRoot, [
		"worktree",
		"add",
		"--no-checkout",
		...existingBranch ? [] : createdBranch ? ["-b", createdBranch] : ["--detach"],
		"--",
		input.destination,
		existingBranch ?? input.base
	], checkoutGitOptions(input, 0));
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
	const prepare = async () => {
		if (profile && commit !== profile.commit) {
			preserve = true;
			throw new Error("Worktree source commit changed before sparse materialization; preserve it for recovery.");
		}
		const checkoutBytes = await options.prepareCommit?.(commit);
		let template;
		let cloneBytes;
		if (options.enabled && checkoutBytes !== 0 && !profile && !options.sourceOnly) try {
			template = await prepareTemplate(options);
			cloneBytes = template ? await estimateTemplateCloneBytes(template) : void 0;
		} catch (error) {
			assertOwned(options);
			log$2.warn(`worktree acceleration unavailable; using Git checkout: ${String(error)}`);
		}
		assertOwned(options);
		try {
			options.requireSpace(cloneBytes);
		} catch (error) {
			if (!template) throw error;
			options.requireSpace();
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
		if (!template) return options.deferGitCheckout ? added : await checkout();
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
			options.requireSpace(cloneBytes);
			await template.backend.cloneTemplate(template.record.path, options.destination, options);
			const cloneCompletedAtMs = Date.now();
			await assertRegistration();
			assertOwned(options);
			await fs$1.unlink(markerPath);
			assertOwned(options);
			await fs$1.writeFile(markerPath, marker);
			let copied = false;
			if (template.backend.id === "apfs") {
				const { copyApfsCloneIndex } = await import("./checkout-apfs-Un7QphoQ.mjs");
				copied = await copyApfsCloneIndex(template.record.path, options.destination, template.sourceIndex, destinationIndex, {
					...options,
					cloneCompletedAtMs
				});
			}
			if (!copied) {
				assertOwned(options);
				await fs$1.copyFile(template.sourceIndex, destinationIndex, constants.COPYFILE_FICLONE);
			}
			await requireGit(options.destination, ["update-index", "--refresh"], {
				...gitOptions(options),
				timeoutMs: WORKTREE_CHECKOUT_TIMEOUT_MS,
				...options.checkoutBudget
			});
		} catch (error) {
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
			log$2.warn(`worktree snapshot failed; using Git checkout: ${String(error)}`);
			if (options.deferGitCheckout) {
				options.requireSpace();
				return added;
			}
			return await checkout();
		}
		await assertRegistration();
		return {
			...added,
			templateCloned: true
		};
	};
	let failed = true;
	try {
		const result = await prepare();
		failed = result.code !== 0;
		return result;
	} finally {
		if (failed && !preserve) {
			rollbackGuard();
			await assertRegistration(rollbackOptions);
			if (!materializationStarted) await assertUnprepared(rollbackOptions);
			await removeFailedCheckout({
				...options,
				signal: void 0,
				commitGuard: rollbackGuard
			});
		}
	}
}
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
		], options);
		if (result.code === 0 && params.resetIndexTo) await git.require(params.destination, params.sourceOnly ? [
			"read-tree",
			"--reset",
			params.resetIndexTo
		] : ["reset"], indexOptions);
		return result;
	});
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
//#region src/agents/worktrees/empty-source.ts
const INITIAL_COMMIT = `tree 4b825dc642cb6eb9a060e54bf8d69288fbee4904\nauthor OpenClaw <openclaw@localhost> 0 +0000\ncommitter OpenClaw <openclaw@localhost> 0 +0000\n\nEmpty workspace\n`;
const INITIAL_COMMIT_ID = createHash("sha1").update(`commit ${Buffer.byteLength(INITIAL_COMMIT)}\0${INITIAL_COMMIT}`).digest("hex");
function sourceParent(env) {
	return path.join(resolveStateDir(env), "worktree-sources", "empty");
}
function sourceName(ownerId) {
	return createHash("sha256").update(ownerId).digest("hex");
}
async function validateSource(sourceRoot, gitOptions) {
	const root = await fs$1.lstat(sourceRoot);
	const metadata = await fs$1.lstat(path.join(sourceRoot, ".git"));
	const entries = await fs$1.readdir(sourceRoot);
	if (!root.isDirectory() || !metadata.isDirectory() || entries.length !== 1 || entries[0] !== ".git" || await requireGit(sourceRoot, ["symbolic-ref", "HEAD"], gitOptions) !== "refs/heads/main" || await requireGit(sourceRoot, [
		"rev-parse",
		"--verify",
		"HEAD^{commit}"
	], gitOptions) !== INITIAL_COMMIT_ID || await requireGit(sourceRoot, ["status", "--porcelain=v1"], gitOptions) !== "") throw new Error("The empty workspace source has changed.");
}
/** Called under the managed-worktree allocation lease, including source publication. */
async function ensureEmptyWorktreeSource(params) {
	const { env, commitGuard } = params;
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
	await fs$1.mkdir(sourceParent(env), {
		recursive: true,
		mode: 448
	});
	const ownerRoot = path.join(await fs$1.realpath(sourceParent(env)), sourceName(params.ownerId));
	const sourceRoot = path.join(ownerRoot, "workspace");
	if (!await worktreePathExists(sourceRoot)) {
		if (listRegistryWorktrees(env).some((record) => path.relative(sourceRoot, record.repoRoot) === "")) throw new Error(`Empty workspace source is missing: ${sourceRoot}. Restore its original Git metadata before starting this workspace; existing session history and snapshots depend on it.`);
		commitGuard();
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
async function resolveEmptyWorktreeSourceRoot(params) {
	const { env, record } = params;
	if (record.ownerKind !== "session" || !record.ownerId || !await worktreePathExists(sourceParent(env))) return;
	const ownerRoot = path.join(await fs$1.realpath(sourceParent(env)), sourceName(record.ownerId));
	const expected = path.join(ownerRoot, "workspace");
	return path.relative(expected, record.repoRoot) === "" ? expected : void 0;
}
/** Called under the allocation lease after failed creation or final snapshot expiry. */
async function removeUnusedEmptyWorktreeSource(params) {
	const { env, record, commitGuard } = params;
	const expected = await resolveEmptyWorktreeSourceRoot(params);
	if (!expected || !await worktreePathExists(expected)) return;
	const ownerRoot = path.dirname(expected);
	const otherRecords = listRegistryWorktrees(env).filter((other) => other.id !== record.id && path.relative(expected, other.repoRoot) === "");
	if (otherRecords.length > 0) {
		if (record.id && !otherRecords.some((other) => other.ownerKind === "session" && other.ownerId === record.ownerId)) throw new Error(`Empty workspace source still has retained worktrees; preserved ${expected}`);
		return;
	}
	const ownerDirectory = await fs$1.lstat(ownerRoot);
	const root = await fs$1.lstat(expected);
	const metadata = await fs$1.lstat(path.join(expected, ".git"));
	const entries = await fs$1.readdir(expected);
	if (!ownerDirectory.isDirectory() || !root.isDirectory() || !metadata.isDirectory() || entries.length !== 1 || entries[0] !== ".git") throw new Error(`Empty workspace source contains unexpected files; preserved ${expected}`);
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
//#region src/agents/worktrees/gc-limits.ts
/** Enforces retention caps without retrying a record already handled by idle cleanup. */
async function enforceWorktreeCleanupLimits(params) {
	const { limits, progress } = params;
	if (limits.maxCount === void 0 && limits.maxTotalSizeBytes === void 0) {
		progress.recordLimitState(true);
		return [];
	}
	const live = await readRegistryWorktrees(params.env, { liveOnly: true });
	const sizes = /* @__PURE__ */ new Map();
	let totalBytes = 0;
	let inventoryComplete = true;
	if (limits.maxTotalSizeBytes !== void 0) for (const record of live) try {
		const bytes = await directorySizeBytes(record.path);
		sizes.set(record.id, bytes);
		totalBytes += bytes;
	} catch (error) {
		inventoryComplete = false;
		progress.error("size", error, record.id);
	}
	let liveCount = live.length;
	const overLimit = () => limits.maxCount !== void 0 && liveCount > limits.maxCount || limits.maxTotalSizeBytes !== void 0 && totalBytes > limits.maxTotalSizeBytes;
	const refreshTotals = async () => {
		const liveIds = new Set(await readLiveRegistryWorktreeIds(params.env));
		liveCount = liveIds.size;
		if (limits.maxTotalSizeBytes !== void 0) {
			totalBytes = 0;
			inventoryComplete = true;
			for (const id of liveIds) {
				const bytes = sizes.get(id);
				if (bytes === void 0) inventoryComplete = false;
				else totalBytes += bytes;
			}
		}
		return {
			liveIds,
			inventoryComplete
		};
	};
	const inventoriedIds = new Set(live.map((record) => record.id));
	const recordNewIds = (liveIds) => {
		for (const id of liveIds) if (!inventoriedIds.has(id)) progress.record("limits", "deferred", "created during cleanup; run cleanup again", id);
	};
	const initialRefresh = limits.maxTotalSizeBytes === void 0 ? {
		liveIds: inventoriedIds,
		inventoryComplete
	} : await refreshTotals();
	if (!overLimit()) {
		progress.recordLimitState(true, inventoryComplete);
		if (progress.result.limitsSatisfied !== true) recordNewIds(initialRefresh.liveIds);
		return [];
	}
	const removed = [];
	const candidates = live.filter((record) => record.ownerKind === "workboard" || record.ownerKind === "session").toSorted((a, b) => a.lastActiveAt - b.lastActiveAt);
	for (const record of candidates) {
		const { liveIds } = await refreshTotals();
		if (!overLimit()) break;
		if (!liveIds.has(record.id) || !progress.start(record.id)) continue;
		try {
			const protection = await params.protect(record);
			if (protection !== void 0) {
				progress.protect("limits", record.id, protection);
				continue;
			}
			await params.remove(record);
		} catch (error) {
			await params.onError(record, error);
			continue;
		}
		removed.push(record.id);
	}
	const { liveIds: remainingIds, inventoryComplete: finalInventoryComplete } = await refreshTotals();
	progress.recordLimitState(!overLimit(), finalInventoryComplete);
	if (progress.result.limitsSatisfied !== true) {
		for (const record of live) {
			if (!remainingIds.has(record.id) || !progress.start(record.id)) continue;
			if (record.ownerKind !== "workboard" && record.ownerKind !== "session") progress.protect("limits", record.id, "manual worktrees require explicit removal");
		}
		recordNewIds(remainingIds);
	}
	return removed;
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
		if (outcome === "failed") this.result.outcome = "partial";
		else if (this.result.outcome === "completed") this.result.outcome = "deferred";
	}
	protect(stage, id, reason, detail = reason) {
		this.result.protectedCount += 1;
		const counts = this.result.protectionReasons;
		counts[reason] = (counts[reason] ?? 0) + 1;
		this.record(stage, "deferred", detail, id);
	}
	recordLimitState(satisfied, inventoryComplete = true) {
		this.result.limitsSatisfied = satisfied ? inventoryComplete ? true : null : false;
	}
	error(stage, error, id) {
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
	const context = captureOpenClawStateWorkerContext({ env });
	const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-RW5P1VzC.mjs");
	return await runOpenClawStateWorkerOperation(context, (scope) => scope.execute(command), { createAdmission: () => ({
		nativeLocations: [context.admission.databasePath],
		admission: createSqliteWorkerOperationAdmission((_request, grant) => {
			context.admission.assertCurrent();
			assertCurrent?.();
			grant();
		})
	}) });
}
//#endregion
//#region src/agents/worktrees/gc-removal.ts
const log$1 = createSubsystemLogger("agents/worktrees");
async function removeWorktreeIfLossless(params) {
	const assertCurrent = () => {
		params.signal?.throwIfAborted();
		params.commitGuard?.();
	};
	const { env, now, getConfig } = params;
	let record = params.record;
	const { id } = record;
	const claimToken = randomUUID();
	const recordOutcome = (outcome, error) => {
		updateRegistryWorktree(env, id, { runEndCleanup: {
			outcome,
			at: now(),
			...outcome === "failed" ? { reason: truncateUtf16Safe(formatErrorMessage(error), 500) } : {}
		} }, {
			onlyIfLive: true,
			onlyIfActiveAt: record.lastActiveAt,
			assertCurrent
		});
	};
	try {
		claimWorktreeRemoval(env, {
			worktreeId: id,
			token: claimToken,
			assertCurrent
		});
	} catch (error) {
		if (error instanceof WorktreeRemovalContentionError) {
			if (error.kind === "finalized") return false;
			recordOutcome("retained-busy");
			return false;
		}
		try {
			recordOutcome("failed", error);
		} catch {}
		throw error;
	}
	try {
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
			abortWorktreeRemovalRow(env, id, claimToken);
			recordOutcome(retainedOutcome);
			return false;
		}
		return (await params.remove({
			id,
			reason: "run-end",
			requireLossless: true,
			claimToken,
			inspectedHead
		})).removed;
	} catch (error) {
		abortWorktreeRemovalRow(env, id, claimToken);
		try {
			recordOutcome("failed", error);
		} catch {}
		throw error;
	}
}
async function deferWorktreeGcRecord(env, record, reason, assertCurrent) {
	if (await deferWorktreeCleanup(env, {
		observed: record,
		reason
	}, assertCurrent) && reason !== null) log$1.warn(`cleanup deferred for ${record.id}: ${reason}; checkout preserved at ${record.path}. After repair, run openclaw worktrees gc to retry.`);
}
function assertOwnerAllowsCleanup(env, record, params, retiredOwner = false) {
	if (getRegistryWorktree(env, record.id)?.lastActiveAt !== record.lastActiveAt) throw new WorktreeRemovalLockError("busy", "worktree activity changed during cleanup");
	if (record.ownerId !== void 0 && (params.shouldProtectOwner?.(record.ownerKind, record.ownerId) === true || retiredOwner && params.shouldRemoveOwner?.(record.ownerKind, record.ownerId) !== true)) throw new WorktreeRemovalLockError("busy", "worktree owner became active during cleanup");
}
function createWorktreeGcErrorHandler(context) {
	const { env, now, progress, policy, assertCurrent, signal } = context;
	return async (stage, record, initialError, retiredOwner = false) => {
		assertCurrent?.();
		const retainUnreadable = (error) => {
			if (!isWorktreePermissionError(error)) return false;
			progress.protect(stage, record.id, "unreadable", `unreadable: ${formatErrorMessage(error)}`);
			return true;
		};
		if (retainUnreadable(initialError)) return;
		let error = initialError;
		if (error instanceof WorktreeBranchMovedError) await deferWorktreeGcRecord(env, record, "branch-moved", assertCurrent);
		else {
			try {
				if (await hasMissingManagedWorktreeGitdir(record)) {
					await withWorktreeAllocationLease({
						env,
						signal,
						commitGuard: () => {
							assertCurrent?.();
							assertOwnerAllowsCleanup(env, record, policy, retiredOwner);
						}
					}, async (guard) => {
						const token = randomUUID();
						claimWorktreeRemoval(env, {
							worktreeId: record.id,
							token,
							assertCurrent: guard.commitGuard
						});
						try {
							if (!await hasMissingManagedWorktreeGitdir(record)) throw new WorktreeRemovalLockError("busy", "worktree Git metadata changed during cleanup");
							const retired = await retireMissingRegistryWorktree(env, record, now, () => {
								guard.commitGuard?.();
								assertWorktreeRemovalClaim(env, record.id, token);
							});
							if (retired.protection) {
								progress.protect(stage, record.id, retired.protection);
								return;
							}
							if (retired.record?.removedAt !== now) throw new WorktreeRemovalLockError("busy", "worktree retirement was not admitted");
							progress.result.orphansRetired += 1;
							progress.result.retiredCheckoutPaths.push(record.path);
							progress.record("orphans", "retired", `missing-gitdir; checkout files preserved at ${record.path}`, record.id);
						} finally {
							abortWorktreeRemovalRow(env, record.id, token);
						}
					});
					return;
				}
			} catch (retirementError) {
				assertCurrent?.();
				if (retainUnreadable(retirementError)) return;
				if (retirementError instanceof WorktreeRemovalLockError || retirementError instanceof WorktreeRemovalContentionError) error = retirementError;
			}
			log$1.warn(`${stage} cleanup failed for ${record.id}: ${String(error)}`);
			if (/not a git repository|^Git metadata is unavailable /u.test(formatErrorMessage(error))) await deferWorktreeGcRecord(env, record, "Git metadata unavailable; repair and run openclaw worktrees gc", assertCurrent);
		}
		progress.error(stage, error, record.id);
	};
}
//#endregion
//#region src/agents/worktrees/gc-protection.ts
async function autoRemovalProtectionReason(record, prefilter, hasLiveLease, context, policy = {}) {
	if (record.gcProtection) {
		if (!policy.retryDeferred) return record.gcProtection;
		await deferWorktreeGcRecord(context.env, record, null, context.beforeRun);
	}
	if (record.ownerId !== void 0 && policy.shouldProtectOwner?.(record.ownerKind, record.ownerId) === true) return "owner is active";
	if (hasLiveLease(record.id)) return "run lease is active";
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
const SNAPSHOT_CHUNK_BYTES = 1048576;
async function captureParentDirectoryIdentities(root, relativePath) {
	const segments = relativePath.split("/");
	const directories = [root];
	let current = root;
	for (const segment of segments.slice(0, -1)) {
		current = path.join(current, segment);
		directories.push(current);
	}
	const identities = [];
	for (const directory of directories) {
		const stat = await fs$1.lstat(directory);
		if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error(`unsafe provisioned parent directory: ${directory}`);
		identities.push({
			path: directory,
			dev: stat.dev,
			ino: stat.ino
		});
	}
	return identities;
}
async function validateDirectoryIdentities(identities) {
	for (const identity of identities) {
		const stat = await fs$1.lstat(identity.path);
		if (!stat.isDirectory() || stat.isSymbolicLink() || stat.dev !== identity.dev || stat.ino !== identity.ino) throw new Error(`provisioned parent directory changed: ${identity.path}`);
	}
}
function sameFileState(left, right) {
	return left.dev === right.dev && left.ino === right.ino && left.mode === right.mode && left.size === right.size && left.mtimeMs === right.mtimeMs && left.ctimeMs === right.ctimeMs;
}
async function readProvisionedMembership(worktreePath, paths, options) {
	const ignoredUntracked = /* @__PURE__ */ new Set();
	const currentTracked = /* @__PURE__ */ new Set();
	const trackedAtHead = /* @__PURE__ */ new Set();
	for (const batch of gitPathspecBatches(paths)) for (const [target, args] of [
		[ignoredUntracked, [
			"ls-files",
			"--others",
			"--ignored",
			"--exclude-standard",
			"-z"
		]],
		[currentTracked, [
			"ls-files",
			"--cached",
			"-z"
		]],
		[trackedAtHead, [
			"ls-tree",
			"-r",
			"--name-only",
			"-z",
			"HEAD"
		]]
	]) {
		const output = await requireGitBuffer(worktreePath, [
			"--literal-pathspecs",
			...args,
			"--",
			...batch
		], {
			...options,
			killProcessTree: true
		});
		for (const entry of splitNullBuffer(output)) target.add(entry.toString("utf8"));
	}
	return {
		ignoredUntracked,
		currentTracked,
		trackedAtHead
	};
}
/** Stores provisioned bytes outside Git so ignored credentials never enter its object database. */
async function snapshotProvisionedFiles(env, worktreeId, worktreePath, provisionedPaths, options = {}) {
	const commitGuard = () => {
		options.signal?.throwIfAborted();
		options.assertCurrent?.();
	};
	const files = await inspectProvisionedFiles(worktreePath, provisionedPaths);
	if (files === void 0) throw new Error("provisioned path ledger is unavailable");
	const expected = options.expected ? new Map(options.expected.files.map((file) => [file.path, file])) : void 0;
	if (expected && (expected.size !== files.length || files.some((file) => !expected.has(file.path) || expected.get(file.path)?.mode !== file.mode))) throw new Error("provisioned exact-state membership or modes changed after capture");
	if (files.every((file) => file.mode === null)) {
		commitGuard();
		clearRegistryWorktreeProvisionedChunks(env, worktreeId);
		return files.map((file) => ({
			path: file.path,
			mode: null,
			chunks: 0
		}));
	}
	const { ignoredUntracked, currentTracked, trackedAtHead } = await readProvisionedMembership(worktreePath, files.filter((file) => file.mode !== null).map((file) => file.path), {
		signal: options.signal,
		beforeRun: commitGuard
	});
	commitGuard();
	clearRegistryWorktreeProvisionedChunks(env, worktreeId);
	const states = [];
	try {
		for (const file of files) {
			if (file.mode === null) {
				states.push({
					path: file.path,
					mode: null,
					chunks: 0
				});
				continue;
			}
			if (currentTracked.has(file.path)) throw new Error(`provisioned path is now tracked: ${file.path}`);
			if (trackedAtHead.has(file.path)) throw new Error(`provisioned path is tracked at HEAD: ${file.path}`);
			if (!ignoredUntracked.has(file.path)) throw new Error(`provisioned path is no longer ignored: ${file.path}`);
			const parentIdentities = await captureParentDirectoryIdentities(worktreePath, file.path);
			const handle = await fs$1.open(file.target, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
			try {
				await validateDirectoryIdentities(parentIdentities);
				const before = await handle.stat();
				const captured = expected?.get(file.path);
				if (captured && (captured.size !== before.size || captured.mode !== (before.mode & 4095))) throw new Error(`provisioned exact-state size or mode changed after capture: ${file.path}`);
				const digest = options.expected ? createHash(options.expected.algorithm).update(`blob ${before.size}\0`) : void 0;
				const buffer = Buffer.allocUnsafe(SNAPSHOT_CHUNK_BYTES);
				let chunkIndex = 0;
				let offset = 0;
				while (offset < before.size) {
					const { bytesRead } = await handle.read(buffer, 0, Math.min(buffer.byteLength, before.size - offset), offset);
					if (bytesRead === 0) throw new Error(`provisioned file changed while snapshotting: ${file.path}`);
					digest?.update(buffer.subarray(0, bytesRead));
					commitGuard();
					insertRegistryWorktreeProvisionedChunk(env, {
						worktreeId,
						path: file.path,
						chunkIndex,
						data: buffer.subarray(0, bytesRead)
					});
					offset += bytesRead;
					chunkIndex += 1;
				}
				const [after, current] = await Promise.all([handle.stat(), fs$1.lstat(file.target)]);
				await validateDirectoryIdentities(parentIdentities);
				if (!sameFileState(before, after) || !sameFileState(before, current)) throw new Error(`provisioned file changed while snapshotting: ${file.path}`);
				if (digest && digest.digest("hex") !== captured?.blob) throw new Error(`provisioned exact-state bytes changed after capture: ${file.path}`);
				states.push({
					path: file.path,
					mode: before.mode & 4095,
					chunks: chunkIndex
				});
			} finally {
				await handle.close();
			}
		}
		return states;
	} catch (error) {
		clearRegistryWorktreeProvisionedChunks(env, worktreeId);
		throw error;
	}
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
//#region src/agents/worktrees/service-list.ts
async function reconcileListedWorktrees(env, records, now) {
	const listed = [];
	for (const observed of records) {
		const record = observed.removedAt === void 0 && !await worktreePathExists(observed.path) ? (await retireMissingRegistryWorktree(env, observed, now())).record : observed;
		if (record && (record.removedAt === void 0 || record.snapshotRef)) listed.push(record);
	}
	return listed;
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
		commit
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
async function createReceipt(record, snapshot, options) {
	options?.beforeRun?.();
	await fs$1.mkdir(path.dirname(record.path), { recursive: true });
	await fs$1.mkdir(record.path).catch((error) => {
		if (!hasErrnoCode(error, "EEXIST")) throw error;
	});
	if ((await fs$1.readdir(record.path)).length || (await listGitWorktrees(record.repoRoot)).some((entry) => entry.path === record.path)) throw new Error("Exact restore destination is occupied; source and snapshot preserved");
	const stat = await fs$1.lstat(record.path, { bigint: true });
	if (!stat.isDirectory()) throw new Error("Exact restore destination is not a directory");
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
	const receipt = await readExactRestoreReceipt(record, params.options) ?? await createReceipt(record, snapshot, params.options);
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
		assertCurrent();
		await params.add(assertCurrent);
	}
	await requireExactWorktreeRepository(record, record.path, options);
	return await withExactStateGitLocks(record, assertCurrent, async () => {
		await requireExactManagedWorktreeHead({
			...record,
			removedAt: void 0
		}, {
			ownerKind: record.ownerKind,
			ownerId: record.ownerId,
			createdAt: record.createdAt,
			lastActiveAt: record.lastActiveAt,
			head: metadata.head,
			branchHead: metadata.branchHead,
			indexSha256: metadata.indexSha256
		}, options);
		const temporaryRoot = path.join(record.path, ".openclaw-restore-" + receipt.nonce);
		if (metadata.files.some((entry) => Buffer.from(entry.path, "hex").toString("utf8").split("/")[0] === path.basename(temporaryRoot))) throw new Error("Exact restore temporary namespace conflicts with captured data");
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
	const { record, env, provisionedPaths } = params;
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
				case "worktree.assert-current": return;
				case "worktree.snapshot-capacity":
					requireWorktreeDiskSpace([...effect.input.demands, ...effect.input.stateBytes === void 0 ? [] : [{
						path: resolveStateDir(env),
						bytes: effect.input.stateBytes
					}]], effect.input.purpose, true);
					return;
				case "worktree.snapshot-provisioned": return await snapshotProvisionedFiles(env, record.id, record.path, provisionedPaths, {
					signal,
					assertCurrent,
					expected: effect.input.expected
				});
			}
		}
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
		onEffect: async () => {
			params.signal?.throwIfAborted();
			params.assertCurrent();
		}
	});
}
function assertExactSnapshotRecordCurrent(env, original) {
	const current = getRegistryWorktree(env, original.id);
	if (!current || current.ownerKind !== original.ownerKind || current.ownerId !== original.ownerId || current.createdAt !== original.createdAt || current.lastActiveAt !== original.lastActiveAt || current.removedAt !== original.removedAt || current.path !== original.path || current.repoRoot !== original.repoRoot || current.repoFingerprint !== original.repoFingerprint || current.branch !== original.branch || current.snapshotRef !== original.snapshotRef) throw new Error("Exact-state recovery owner or lifecycle changed; source and snapshot preserved");
}
/** Explicit retirement shares the same allocation owner as removal and GC. */
async function retireManagedWorktreeSnapshotById(params, env = process.env) {
	return await withWorktreeAllocationLease({
		...params,
		env
	}, async (guard) => {
		const record = getRegistryWorktree(env, params.id);
		if (!record || record.removedAt === void 0 || record.removedAt !== params.expectedRemovedAt || record.snapshotRef !== params.expectedSnapshotRef) throw new Error("Expected removed worktree snapshot identity does not match");
		await retireManagedWorktreeSnapshot({
			record,
			env,
			signal: guard.signal,
			assertCurrent: () => guard.commitGuard(),
			expected: params
		});
		return {
			retired: true,
			id: record.id
		};
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
		const { localWorkspaceStore } = await import("./local-workspace-store-E1UuzVne.mjs");
		const projectionStore = localWorkspaceStore(env);
		const assertCurrent = () => {
			params.assertCurrent();
			assertRegistrySnapshotRetirement(env, record);
			if (projectionStore.get(record.id)) throw new Error("Snapshot retains local workspace projection custody; preserve its recovery data");
		};
		assertCurrent();
		const retireSnapshot = await prepareExactSnapshotRetirement({
			record,
			expected: params.expected,
			signal,
			assertCurrent
		});
		const { expireLocalWorkspaceProjection } = await import("./local-workspace-projection-Da4BBZ4y.mjs");
		await expireLocalWorkspaceProjection({
			worktree: record,
			env,
			assertCurrent,
			retireSnapshot
		});
		assertCurrent();
		deleteRegistryWorktree(env, record.id, {
			assertCurrent,
			expectedRetired: record
		});
		return;
	}
	const exactRecord = record.snapshotRef?.startsWith("refs/openclaw/snapshots/exact-");
	const expirationToken = exactRecord ? randomUUID() : void 0;
	let claimed = false;
	const assertCurrent = () => {
		params.assertCurrent();
		if (exactRecord) {
			assertExactSnapshotRecordCurrent(env, record);
			if (claimed && expirationToken) assertWorktreeRemovalClaim(env, record.id, expirationToken);
		}
	};
	if (exactRecord && !await worktreePathExists(record.repoRoot)) throw new Error("Exact-state source repository unavailable; recovery and registry preserved");
	if (expirationToken) {
		claimWorktreeRemoval(env, {
			worktreeId: record.id,
			token: expirationToken,
			retiredExact: true,
			assertCurrent
		});
		claimed = true;
	}
	try {
		const { expireLocalWorkspaceProjection } = await import("./local-workspace-projection-Da4BBZ4y.mjs");
		await expireLocalWorkspaceProjection({
			worktree: record,
			env,
			assertCurrent,
			retireSnapshot: async (assertProjectionCurrent) => {
				const beforeRun = () => {
					assertCurrent();
					assertProjectionCurrent();
				};
				if (await worktreePathExists(record.repoRoot)) {
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
						await requireGit(record.repoRoot, [
							"update-ref",
							"-d",
							record.snapshotRef,
							...snapshot ? [snapshot] : []
						], {
							signal,
							beforeRun: exactRecord ? assertNoLiveSource : beforeRun
						});
						if (exactRecord) {
							const receipt = await readExactRestoreReceipt(record, {
								signal,
								beforeRun: assertNoLiveSource
							});
							if (receipt) await clearExactRestoreReceipt(record, receipt, {
								signal,
								beforeRun: assertNoLiveSource
							});
						}
					}
					await requireGit(record.repoRoot, [
						"update-ref",
						"-d",
						"refs/openclaw/removals/" + record.id
					], {
						signal,
						beforeRun
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
		deleteRegistryWorktree(env, record.id, {
			assertCurrent,
			removalToken: expirationToken
		});
	} finally {
		if (expirationToken && claimed) abortWorktreeRemovalRow(env, record.id, expirationToken);
	}
}
//#endregion
//#region src/agents/worktrees/snapshot-restore.ts
function requireLiveSnapshotRecord(env, id) {
	const record = getRegistryWorktree(env, id);
	if (!record || record.removedAt !== void 0) throw new Error("Worktree lifecycle changed during recovery");
	return record;
}
async function restoreSnapshotProjection(worktree, env, assertCurrent) {
	const { withSettledLocalWorkspace } = await import("./local-workspace-projection-Da4BBZ4y.mjs");
	await withSettledLocalWorkspace({
		worktree,
		env,
		assertCurrent,
		restoreSnapshot: true
	}, async () => {});
}
/** An unfinished retirement still has a live row: reuse removal custody until recovery settles. */
async function restoreManagedWorktreeSnapshot(input, context) {
	const record = getRegistryWorktree(context.env, input.id);
	if (!input.recoverExactState || !record || record.removedAt !== void 0) return await restoreSnapshot(input, context);
	const expected = exactStateRetirementSchema.parse(input.recoverExactState);
	const assertOwner = () => {
		input.signal?.throwIfAborted();
		input.commitGuard?.();
		assertExactStateOwner(requireLiveSnapshotRecord(context.env, record.id), expected);
	};
	const token = randomUUID();
	claimWorktreeRemoval(context.env, {
		worktreeId: record.id,
		token,
		assertCurrent: assertOwner
	});
	try {
		return await restoreSnapshot({
			...input,
			commitGuard: () => {
				input.commitGuard?.();
				assertWorktreeRemovalClaim(context.env, record.id, token);
			}
		}, {
			...context,
			recoveryClaim: token
		});
	} finally {
		abortWorktreeRemovalRow(context.env, record.id, token);
	}
}
/** Capture and restoration share the same versioned snapshot and native retention owner. */
async function restoreSnapshot(input, context) {
	const { env, now, getConfig, requireSpace } = context;
	let params = input;
	let finalized = false;
	const onFinalized = () => {
		finalized = true;
	};
	params.signal?.throwIfAborted();
	params.commitGuard?.();
	let record = getRegistryWorktree(env, params.id);
	if (record?.snapshotRef?.startsWith("refs/openclaw/snapshots/exact-")) {
		const original = record;
		const callerGuard = params.commitGuard;
		params = {
			...params,
			commitGuard: () => {
				callerGuard?.();
				if (finalized) return;
				assertExactSnapshotRecordCurrent(env, original);
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
			assertExactStateOwner(requireLiveSnapshotRecord(env, record.id), expected);
			record = {
				...record,
				removedAt: now()
			};
		}
	}
	if (!record?.snapshotRef || record.removedAt === void 0) throw new Error(`worktree ${params.id} is not restorable`);
	if (!await worktreePathExists(record.repoRoot)) throw new Error(`source repository no longer exists: ${record.repoRoot}`);
	const repository = await resolveRepository(record.repoRoot);
	requireSpace(record.path, repository);
	const provisionedState = await getRegistryWorktreeProvisionedState(env, record.id);
	params.commitGuard?.();
	if (provisionedState === void 0) throw new Error(`worktree ${record.id} snapshot lacks provisioned file metadata`);
	const provisionedBytes = provisionedState.reduce((sum, entry) => sum + entry.chunks * SNAPSHOT_CHUNK_BYTES, 0);
	const gitOptions = {
		signal: params.signal,
		beforeRun: params.commitGuard,
		killProcessTree: true
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
			params = {
				...params,
				commitGuard: () => {
					callerGuard?.();
					assertExactStateSourceIdentity(restoreRecord.path, identity);
				}
			};
			await restoreSnapshotProjection(restoreRecord, env, params.commitGuard);
			return await finishRestoredSnapshot(params, context, restoreRecord, provisionedState.map((entry) => entry.path), onFinalized, true);
		};
		if (!await readExactRestoreReceipt(restoreRecord, gitOptions)) {
			const restored = await restoreRetiredExactWorktree({
				record: restoreRecord,
				metadata: exact,
				options: gitOptions,
				assertCurrent: () => params.commitGuard?.(),
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
			finalize,
			add: async (assertCurrent) => {
				const added = await addManagedWorktree({
					env,
					sourceOnly: true,
					now,
					enabled: false,
					repoRoot: restoreRecord.repoRoot,
					commonDir: repository.commonDir,
					worktreeRoot: path.dirname(path.dirname(restoreRecord.path)),
					destination: restoreRecord.path,
					base: exact.head,
					deferGitCheckout: true,
					requireSpace: () => requireSpace(restoreRecord.path, repository, 2 * targetBytes + 2 * provisionedBytes),
					signal: params.signal,
					commitGuard: assertCurrent,
					rollbackGuard: params.rollbackGuard
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
	params.commitGuard?.();
	await fs$1.mkdir(path.dirname(record.path), { recursive: true });
	params.commitGuard?.();
	const sourceOnly = await usesSourceOnlyWorktreeGit(record, env, getConfig ?? getRuntimeConfig);
	const added = await addManagedWorktree({
		env,
		sourceOnly,
		now,
		enabled: getConfig?.().worktreeAcceleration !== false,
		repoRoot: record.repoRoot,
		commonDir: repository.commonDir,
		worktreeRoot: path.dirname(path.dirname(record.path)),
		destination: record.path,
		base: parent,
		branch: record.branch || void 0,
		deferGitCheckout: true,
		requireSpace: (cloneBytes) => requireSpace(record.path, repository, (cloneBytes === void 0 ? 2 * targetBytes : cloneBytes + 2 * changedBytes) + 2 * provisionedBytes),
		signal: params.signal,
		commitGuard: () => params.commitGuard?.(),
		rollbackGuard: params.rollbackGuard
	});
	if (added.code !== 0) throw createGitCommandError("git worktree add", added);
	let restoredProvisionedPaths;
	try {
		const materializationBytes = added.templateCloned ? changedBytes : targetBytes;
		const checkoutOptions = {
			...gitOptions,
			beforeRun: () => {
				params.commitGuard?.();
				requireSpace(record.path, repository, 2 * materializationBytes + 2 * provisionedBytes);
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
		requireSpace(record.path, repository, 2 * provisionedBytes);
		await restoreProvisionedFiles(env, record.id, record.path, provisionedState, params.commitGuard);
		params.commitGuard?.();
		await restoreSnapshotProjection(record, env, params.commitGuard);
		requireSpace(record.path, repository);
		restoredProvisionedPaths = provisionedState.map((state) => state.path);
	} catch (error) {
		const failure = await removeFailedWorktree(record.repoRoot, record.path, record.branch, params.rollbackGuard);
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
		if (!context.recoveryClaim) finalizeWorktreeRemovalRows(env, params.id);
		await requireGit(record.repoRoot, [
			"update-ref",
			"-d",
			`refs/openclaw/removals/${record.id}`
		], gitOptions);
		const { withSettledLocalWorkspace } = await import("./local-workspace-projection-Da4BBZ4y.mjs");
		await withSettledLocalWorkspace({
			worktree: restored,
			env,
			assertCurrent: params.commitGuard,
			finishRestore: true
		}, async () => {});
	};
	if (exact) await finishRecovery();
	updateRegistryWorktree(env, params.id, {
		removedAt: void 0,
		lastActiveAt,
		provisionedPaths: restoredProvisionedPaths,
		runEndCleanup: void 0
	}, { assertCurrent: params.commitGuard });
	onFinalized();
	if (!exact) await finishRecovery();
	return restored;
}
//#endregion
//#region src/agents/worktrees/service.ts
const IDLE_GC_MS = 6048e5;
const SNAPSHOT_RETENTION_MS = 2592e6;
const WORKTREE_GC_INTERVAL_MS = 36e5;
const WORKTREE_GIT_MAINTENANCE_TIMEOUT_MS = 18e5;
const log = createSubsystemLogger("agents/worktrees");
const WORKTREE_CLEANUP_TARGET = 100;
/** A bounded default; manual and actively used worktrees remain protected. */
function resolveWorktreeCleanupLimits() {
	return { maxCount: WORKTREE_CLEANUP_TARGET };
}
var ManagedWorktreeService = class {
	constructor(options = {}) {
		this.listRegistryRecords = () => readRegistryWorktrees(this.env);
		this.env = options.env ?? process.env;
		this.now = options.now ?? Date.now;
		this.getConfig = options.getConfig;
	}
	async worktreesRoot() {
		const root = this.getConfig?.().worktreeRoot ?? path.join(resolveStateDir(this.env), "worktrees");
		await fs$1.mkdir(root, { recursive: true });
		return await fs$1.realpath(root);
	}
	async create(params) {
		return (await this.createWithOutcome(params)).record;
	}
	async createWithOutcome(params) {
		params.signal?.throwIfAborted();
		const repository = await resolveRepository(params.repoRoot);
		return await this.createWithAllocation(params, async (guard, publication) => await this.createForOwner({
			...params,
			...guard
		}, repository, publication));
	}
	async createEmpty(params) {
		return (await this.createEmptyWithOutcome(params)).record;
	}
	async createEmptyWithOutcome(params) {
		let sourceRoot;
		try {
			return await this.createWithAllocation(params, async (guard, publication) => {
				const repoRoot = await ensureEmptyWorktreeSource({
					env: this.env,
					ownerId: params.ownerId,
					signal: guard.signal,
					commitGuard: () => guard.commitGuard?.()
				});
				sourceRoot = repoRoot;
				const repository = await resolveRepository(repoRoot);
				return await this.createForOwner({
					...params,
					...guard,
					repoRoot,
					baseRef: "main",
					runSetupScript: false
				}, repository, publication);
			});
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
	}
	async createForOwner(params, repository, publication) {
		if (params.ownerId) {
			const existing = findLiveRegistryWorktreeByOwner(this.env, params.ownerKind ?? "manual", params.ownerId);
			if (existing && params.profiles?.length) throw new Error("Source profiles require a new worktree; use a new owner and name.");
			if (existing && await worktreePathExists(existing.path)) return await withWorktreeSource(params, async (current) => {
				const validated = await this.rebindLiveRepository(existing, current);
				if (validated.repoRoot !== repository.repoRoot) throw new Error(`worktree owner ${params.ownerKind ?? "manual"} ${params.ownerId} is already bound to another repository`);
				current.commitGuard?.();
				return {
					record: validated,
					materialized: false
				};
			});
			if (existing) await withWorktreeSource(params, (current) => {
				current.commitGuard?.();
				updateRegistryWorktree(this.env, existing.id, { removedAt: this.now() });
			});
		}
		return await this.createForRepository(params, repository, params.name ?? params.suggestedName ?? createCrustaceanSlug(), publication);
	}
	async createWithAllocation(params, run) {
		const publication = {};
		try {
			return await this.withAllocationLease(params, (guard) => run(guard, publication));
		} catch (error) {
			const failures = [error];
			if (params.withSource && publication.record) try {
				await this.rollbackPreparation(publication.record, params.withRollback);
			} catch (cleanupError) {
				failures.push(cleanupError);
			}
			if (failures.length > 1) throw new AggregateError(failures, failures.map(String).join("\n"), { cause: error });
			throw error;
		}
	}
	async rollbackPreparation(prepared, withRollback) {
		await this.withAllocationLease({}, async (allocation) => {
			const remove = async (assertCheckoutCurrent) => {
				const commitGuard = () => {
					allocation.commitGuard?.();
					assertCheckoutCurrent?.();
				};
				commitGuard();
				const current = getRegistryWorktree(this.env, prepared.id);
				if (!current || current.removedAt !== void 0 || current.path !== prepared.path || current.repoRoot !== prepared.repoRoot || current.repoFingerprint !== prepared.repoFingerprint || current.branch !== prepared.branch || current.baseRef !== prepared.baseRef || current.ownerKind !== prepared.ownerKind || current.ownerId !== prepared.ownerId || current.createdAt !== prepared.createdAt || current.lastActiveAt !== prepared.lastActiveAt) throw new Error("Worktree changed before preparation rollback; checkout preserved.");
				await this.removeWithAllocation({
					id: prepared.id,
					reason: "session-create-failed",
					allowSnapshotLoss: prepared.snapshotRef === void 0,
					signal: allocation.signal,
					commitGuard
				}, void 0);
			};
			if (withRollback) await withRollback(remove);
			else await remove();
		});
	}
	async withAllocationLease(params, run) {
		return await withWorktreeAllocationLease({
			...params,
			env: this.env
		}, run);
	}
	requireAllocationSpace(target, repository, bytes = 0) {
		requireWorktreeDiskSpace([
			{
				path: target,
				bytes
			},
			{
				path: repository.commonDir,
				bytes: 0
			},
			{
				path: repository.sourceRoot,
				bytes: 0
			},
			{
				path: resolveStateDir(this.env),
				bytes: 0
			}
		], "worktree allocation");
	}
	async createForRepository(params, repository, inferredName, publication) {
		params.signal?.throwIfAborted();
		params.onProgress?.("checkout");
		const suppliedName = params.name === void 0 ? void 0 : validateName(params.name);
		const existing = suppliedName ? findWorktreeByName(this.env, repository.fingerprint, suppliedName) : void 0;
		if (existing && params.profiles?.length) throw new Error("Source profiles require a new worktree; choose an unused --name.");
		if (existing && (!existing.removedAt || existing.snapshotRef) && !worktreeOwnerMatches(existing, params)) throw new Error(`worktree name is already in use by ${existing.ownerKind}${existing.ownerId ? ` ${existing.ownerId}` : ""}: ${suppliedName}`);
		if (existing && existing.removedAt === void 0) {
			if (await worktreePathExists(existing.path)) return await withWorktreeSource(params, async (current) => ({
				record: await this.rebindLiveRepository(existing, current),
				materialized: false
			}));
			await withWorktreeSource(params, () => updateRegistryWorktree(this.env, existing.id, { removedAt: this.now() }));
		}
		if (existing && existing.removedAt !== void 0 && existing.snapshotRef) return await withWorktreeSource(params, async (current) => {
			const record = await this.restoreWithAllocation({
				id: existing.id,
				signal: current.signal,
				commitGuard: current.commitGuard,
				rollbackGuard: current.rollbackGuard
			});
			publication.record = { ...record };
			return {
				record,
				materialized: true
			};
		});
		let prepared;
		let publicationStarted = false;
		try {
			const materialized = await withWorktreeSource(params, async (current) => {
				const created = await this.materializeRepositoryWorktree(current, repository, inferredName, suppliedName);
				prepared = created;
				return created;
			});
			const provisionedPaths = await this.completeRepositoryWorktreeSetup(params, repository, materialized);
			return await withWorktreeSource(params, (current) => {
				current.signal?.throwIfAborted();
				current.commitGuard?.();
				this.requireAllocationSpace(materialized.worktreePath, repository);
				publicationStarted = true;
				const { name, worktreePath, branch, recordBase } = materialized;
				const createdAt = this.now();
				const record = {
					id: randomUUID(),
					name,
					repoFingerprint: repository.fingerprint,
					repoRoot: repository.repoRoot,
					path: worktreePath,
					branch,
					baseRef: recordBase,
					ownerKind: current.ownerKind ?? "manual",
					...current.ownerId ? { ownerId: current.ownerId } : {},
					createdAt,
					lastActiveAt: createdAt
				};
				insertRegistryWorktree(this.env, record, { provisionedPaths });
				publication.record = { ...record };
				return {
					record,
					materialized: true
				};
			});
		} catch (error) {
			const failures = [error];
			if (prepared && !publicationStarted) try {
				const { worktreePath, branch } = prepared;
				const cleanup = async (assertCheckoutCurrent) => await cleanupFailedCreate(repository.repoRoot, worktreePath, branch, () => {
					params.rollbackGuard();
					assertCheckoutCurrent?.();
				});
				if (params.withRollback) await params.withRollback(cleanup);
				else await cleanup();
			} catch (cleanupError) {
				failures.push(cleanupError);
			}
			if (failures.length > 1) throw new AggregateError(failures, failures.map(String).join("\n"), { cause: error });
			throw error;
		}
	}
	async materializeRepositoryWorktree(params, repository, inferredName, suppliedName) {
		const root = path.join(await this.worktreesRoot(), repository.fingerprint);
		const name = suppliedName ?? await generateName(this.env, repository.repoRoot, repository.fingerprint, root, params, params.suggestedName ?? inferredName);
		const worktreePath = path.join(root, name);
		const branch = `openclaw/${name}`;
		const branchExists = await runGit(repository.repoRoot, [
			"show-ref",
			"--quiet",
			"--verify",
			`refs/heads/${branch}`
		]);
		if (branchExists.code === 0) throw new Error(`branch already exists: ${branch}`);
		if (branchExists.code !== 1) throw createGitCommandError("git show-ref --verify", branchExists);
		params.signal?.throwIfAborted();
		params.commitGuard?.();
		this.requireAllocationSpace(worktreePath, repository);
		params.commitGuard?.();
		if (params.checkoutCommit && !/^[a-f0-9]{40}(?:[a-f0-9]{24})?$/u.test(params.checkoutCommit)) throw new Error("Worktree checkout commit is invalid");
		const base = params.checkoutCommit ? {
			commit: params.checkoutCommit,
			gitOperand: params.checkoutCommit,
			recordRef: params.baseRef ?? params.checkoutCommit,
			remote: false
		} : await resolveWorktreeBase(repository.repoRoot, params.baseRef, params.signal, params.commitGuard);
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
		const setupBytes = runRepositorySetup ? Math.max(WORKTREE_SETUP_HEADROOM_BYTES, await directorySizeBytes(repository.sourceRoot, true, {
			signal: params.signal,
			assertCurrent: params.commitGuard
		})) : 0;
		params.signal?.throwIfAborted();
		params.commitGuard?.();
		let gitBase = params.profiles?.length ? base.commit : base.gitOperand;
		let recordBase = base.recordRef;
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
				enabled: this.getConfig?.().worktreeAcceleration !== false,
				repoRoot: repository.repoRoot,
				commonDir: repository.commonDir,
				worktreeRoot: path.dirname(root),
				destination: worktreePath,
				sourceOnly: params.provisionIgnoredFiles === false,
				branch,
				base: sourceProfile?.commit ?? gitBase,
				sourceProfile,
				prepareCommit: async (commit) => {
					return gitBytes = await estimateWorktreeGitBytes(repository.repoRoot, commit, {
						signal: params.signal,
						assertCurrent: params.commitGuard
					});
				},
				requireSpace: (cloneBytes) => this.requireAllocationSpace(worktreePath, repository, (cloneBytes ?? 2 * gitBytes) + 2 * provisionedBytes + setupBytes),
				signal: params.signal,
				commitGuard: () => params.commitGuard?.(),
				rollbackGuard: params.rollbackGuard
			});
		};
		let added = await addCheckout();
		if (added.code !== 0 && base.remote) {
			if (!await canResetFailedWorktreeAdd(repository.repoRoot, worktreePath, branch, added)) throw createGitCommandError("git worktree add", added);
			await resetFailedWorktreeAdd(repository.repoRoot, worktreePath, branch, params.rollbackGuard);
			params.signal?.throwIfAborted();
			params.commitGuard?.();
			gitBase = "HEAD";
			recordBase = "HEAD";
			added = await addCheckout();
		}
		if (added.code !== 0) throw createGitCommandError("git worktree add", added);
		return {
			name,
			worktreePath,
			branch,
			recordBase,
			provisionedBytes,
			setupBytes,
			runRepositorySetup
		};
	}
	async completeRepositoryWorktreeSetup(params, repository, materialized) {
		const { worktreePath, provisionedBytes, setupBytes, runRepositorySetup } = materialized;
		const provisionedPaths = params.provisionIgnoredFiles === false ? [] : await withWorktreeSource(params, (current) => {
			current.signal?.throwIfAborted();
			current.commitGuard?.();
			this.requireAllocationSpace(worktreePath, repository, 2 * provisionedBytes + setupBytes);
			return provisionIncludedFiles(repository.sourceRoot, worktreePath, {
				signal: current.signal,
				assertCurrent: current.commitGuard
			});
		});
		if (runRepositorySetup) {
			this.requireAllocationSpace(worktreePath, repository, setupBytes);
			await runSetupScript(repository.sourceRoot, worktreePath, params);
		}
		return provisionedPaths;
	}
	async list() {
		return await reconcileListedWorktrees(this.env, listRegistryWorktrees(this.env), this.now);
	}
	findLiveByOwner(ownerKind, ownerId) {
		return findLiveRegistryWorktreeByOwner(this.env, ownerKind, ownerId);
	}
	findLiveById(id) {
		const record = getRegistryWorktree(this.env, id);
		return record?.removedAt === void 0 ? record : void 0;
	}
	/** Resolves the canonical registry root and the caller's own checkout root. */
	async resolveRepositoryPaths(repoRoot) {
		const resolved = await resolveRepository(repoRoot);
		return {
			canonicalRoot: resolved.repoRoot,
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
	async acquire(id) {
		const record = this.requireLiveRecord(id);
		await lockWorktreeForProcess(record);
		const lastActiveAt = this.now();
		updateRegistryWorktree(this.env, id, { lastActiveAt });
		return {
			...record,
			lastActiveAt
		};
	}
	async release(id, guard = {}) {
		const record = getRegistryWorktree(this.env, id);
		if (!record || record.removedAt !== void 0 || !await worktreePathExists(record.path)) return;
		const state = await lockState(record);
		if (state.kind === "live" && state.pid !== process.pid) return;
		if (state.kind === "foreign") return;
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
		let params = input;
		if (params.exactState) {
			if (params.allowSnapshotLoss || params.requireLossless) throw new Error("Exact-state retirement cannot permit snapshot loss or select clean-only removal");
			params = {
				...params,
				exactState: exactStateRetirementSchema.parse(params.exactState)
			};
		}
		const timing = startGitOperationTiming("worktree-removal", log);
		let outcome = "threw";
		try {
			const result = await this.withAllocationLease(params, async (guard) => {
				timing?.markPhase();
				try {
					return await this.removeWithAllocation({
						...params,
						...guard
					}, timing);
				} finally {
					timing?.markRemovalStage();
					timing?.markPhase();
				}
			});
			outcome = "returned";
			return result;
		} finally {
			timing?.finish(outcome);
		}
	}
	async removeWithAllocation(params, timing) {
		timing?.markRemovalStage("preparation");
		params.signal?.throwIfAborted();
		params.commitGuard?.();
		const record = this.requireLiveRecord(params.id);
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
		const claimToken = params.claimToken ?? randomUUID();
		claimWorktreeRemoval(this.env, {
			worktreeId: record.id,
			token: claimToken,
			assertCurrent: params.commitGuard
		});
		try {
			const { withSettledLocalWorkspace } = await import("./local-workspace-projection-Da4BBZ4y.mjs");
			return await withSettledLocalWorkspace({
				worktree: record,
				env: this.env,
				assertCurrent: params.commitGuard,
				retireRuntime: true
			}, (accepted) => this.removeSettledWithAllocation({
				...params,
				claimToken,
				commitGuard: () => {
					params.commitGuard?.();
					accepted?.assertCurrent();
				}
			}, timing, accepted?.prepareArchive));
		} catch (error) {
			timing?.markRemovalStage("finalization");
			abortWorktreeRemovalRow(this.env, record.id, claimToken);
			throw error;
		}
	}
	async removeSettledWithAllocation(input, timing, prepareArchive) {
		let params = input;
		timing?.markRemovalStage("preparation");
		params.signal?.throwIfAborted();
		params.commitGuard?.();
		let record = this.requireLiveRecord(params.id);
		const claimToken = params.claimToken;
		const allocationGuard = params.commitGuard;
		let exactFinalized = false;
		if (params.exactState) {
			const expected = params.exactState;
			const original = record;
			params = {
				...params,
				commitGuard: () => {
					allocationGuard?.();
					if (exactFinalized) return;
					const current = this.requireLiveRecord(params.id);
					assertExactStateOwner(current, expected);
					if (current.path !== original.path || current.branch !== original.branch || current.repoRoot !== original.repoRoot) throw new Error("Worktree exact-state binding changed; checkout preserved");
					assertWorktreeRemovalClaim(this.env, original.id, claimToken);
				}
			};
		}
		record = await this.rebindLiveRepository(record, params);
		const gitOptions = {
			signal: params.signal,
			beforeRun: params.commitGuard,
			killProcessTree: true
		};
		return await withManagedWorktreeGit({
			record,
			env: this.env,
			getConfig: this.getConfig ?? getRuntimeConfig,
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
				const provisionedPaths = await getRegistryWorktreeProvisionedPaths(this.env, record.id);
				params.commitGuard?.();
				if (provisionedPaths === void 0) throw new Error("provisioned path ledger is unavailable");
				capturedProvisionedPaths = provisionedPaths;
				const snapshot = await captureManagedWorktreeSnapshot({
					record,
					env: this.env,
					reason: params.reason,
					exactState: params.exactState,
					retirementName,
					provisionedPaths,
					git,
					signal: params.signal,
					assertCurrent: params.commitGuard
				});
				snapshotRef = snapshot.snapshotRef;
				exactStateDigest = snapshot.exactStateDigest;
				params.commitGuard?.();
				updateRegistryWorktree(this.env, record.id, {
					snapshotRef,
					provisionedState: snapshot.provisionedState
				}, { assertCurrent: params.commitGuard });
			} catch (error) {
				snapshotError = error instanceof Error ? error.message : String(error);
				try {
					clearRegistryWorktreeProvisionedChunks(this.env, record.id);
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
					abortWorktreeRemovalRow(this.env, record.id, claimToken);
					updateRegistryWorktree(this.env, record.id, { runEndCleanup: {
						outcome: "retained-dirty",
						at: this.now()
					} }, {
						onlyIfLive: true,
						onlyIfActiveAt: record.lastActiveAt,
						assertCurrent: params.commitGuard
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
				params.commitGuard?.();
				if (deletionOptions) await git.require(record.repoRoot, [
					"branch",
					"-d",
					"--",
					record.branch
				], deletionOptions);
				await fs$1.rmdir(path.dirname(record.path)).catch(() => void 0);
				params.commitGuard?.();
				const removedAt = this.now();
				updateRegistryWorktree(this.env, record.id, {
					removedAt,
					snapshotRef,
					...params.runEndCleanup ? { runEndCleanup: params.runEndCleanup } : {}
				}, { assertCurrent: params.commitGuard });
				exactFinalized = true;
				finalizeWorktreeRemovalRows(this.env, record.id);
				await git.require(record.repoRoot, [
					"update-ref",
					"-d",
					pendingRef,
					snapshot ?? head
				], gitOptions);
				return {
					removed: true,
					...snapshotRef ? { snapshotRef } : {},
					...snapshotError ? { snapshotError } : {},
					...recoveryPath ? {
						recoveryPath,
						recoveryRetainedUntil: removedAt + SNAPSHOT_RETENTION_MS
					} : {}
				};
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
			await removeManagedCheckout(record, git, params.requireLossless, params.commitGuard);
			return await finalize();
		});
	}
	async recoverRemoval(params) {
		const { recoverManagedWorktreeRemoval } = await import("./removal-recovery-D85emZVn.mjs");
		return await recoverManagedWorktreeRemoval(params, {
			env: this.env,
			now: this.now
		});
	}
	async retireSnapshot(params) {
		return await retireManagedWorktreeSnapshotById(params, this.env);
	}
	async restore(params) {
		return await this.withAllocationLease(params, async (guard) => await this.restoreWithAllocation({
			...params,
			...guard
		}));
	}
	async restoreWithAllocation(params) {
		return await restoreManagedWorktreeSnapshot(params, {
			env: this.env,
			now: this.now,
			getConfig: this.getConfig,
			requireSpace: (target, repository, bytes) => this.requireAllocationSpace(target, repository, bytes)
		});
	}
	async removeIfLossless(id, guard = {}) {
		guard.signal?.throwIfAborted();
		guard.commitGuard?.();
		return await removeWorktreeIfLossless({
			...guard,
			record: this.requireLiveRecord(id),
			env: this.env,
			now: this.now,
			getConfig: this.getConfig ?? getRuntimeConfig,
			prepareRecord: (record) => this.rebindLiveRepository(record, guard),
			remove: async (params) => {
				await this.release(id, guard);
				return await this.remove({
					...guard,
					...params,
					runEndCleanup: {
						outcome: "removed-lossless",
						at: this.now()
					}
				});
			}
		});
	}
	async removeIfLosslessByPath(worktreePath, owner) {
		const record = findLiveRegistryWorktreeByPath(this.env, worktreePath);
		if (!record || !worktreeOwnerMatches(record, owner)) return false;
		return await this.removeIfLossless(record.id);
	}
	async releaseByPath(worktreePath) {
		const record = findLiveRegistryWorktreeByPath(this.env, worktreePath);
		if (record) await this.release(record.id);
	}
	async gc(params = {}) {
		const assertCurrent = () => {
			params.signal?.throwIfAborted();
			params.commitGuard?.();
		};
		assertCurrent();
		const now = this.now();
		const prefilter = createWorktreeGcPrefilter();
		const progress = new WorktreeGcProgress();
		const result = progress.result;
		const { records, leases } = await readWorktreeCleanupState(this.env);
		assertCurrent();
		const liveLeaseScopes = new Set(leases.liveScopes);
		const observedIds = new Set(records.map((record) => record.id));
		const hasLiveLease = (id) => observedIds.has(id) ? liveLeaseScopes.has(worktreeRunLeaseScope(id)) : hasLiveWorktreeRunLease(this.env, id);
		const protect = (record) => autoRemovalProtectionReason(record, prefilter, hasLiveLease, {
			env: this.env,
			getConfig: this.getConfig ?? getRuntimeConfig,
			signal: params.signal,
			beforeRun: assertCurrent
		}, params);
		const onError = createWorktreeGcErrorHandler({
			env: this.env,
			now,
			progress,
			policy: params,
			signal: params.signal,
			assertCurrent
		});
		for (const record of records) {
			assertCurrent();
			let retiredOwner = false;
			try {
				if (record.removedAt === void 0 && !await worktreePathExists(record.path)) {
					const retired = await retireMissingRegistryWorktree(this.env, record, now, assertCurrent);
					if (retired.protection) progress.protect("idle", record.id, retired.protection);
					else if (retired.record?.removedAt === now) result.orphansRetired += 1;
					continue;
				}
				const expiresWhenIdle = record.ownerKind === "workboard" || record.ownerKind === "session";
				if (record.removedAt !== void 0 || !expiresWhenIdle) continue;
				retiredOwner = record.ownerId !== void 0 && params.shouldRemoveOwner?.(record.ownerKind, record.ownerId) === true;
				if (retiredOwner || now - record.lastActiveAt > 6048e5) {
					if (!progress.start(record.id)) continue;
					const protection = await protect(record);
					if (protection !== void 0) {
						progress.protect("idle", record.id, protection);
						continue;
					}
					await this.remove({
						id: record.id,
						reason: retiredOwner ? "owner-gc" : "idle-gc",
						signal: params.signal,
						commitGuard: () => {
							assertCurrent();
							assertOwnerAllowsCleanup(this.env, record, params, retiredOwner);
						}
					});
					result.removed.push(record.id);
				}
			} catch (error) {
				await onError("idle", record, error, retiredOwner);
			}
		}
		try {
			if (await hasTemplatesAsync(this.env)) await this.withAllocationLease(params, async (guard) => {
				await collectWorktreeTemplates(this.env, now - IDLE_GC_MS, {
					signal: guard.signal,
					commitGuard: () => guard.commitGuard?.()
				}, (error, id) => progress.error("templates", error, id));
			});
		} catch (error) {
			assertCurrent();
			progress.error("templates", error);
			log.warn(`worktree template cleanup deferred: ${String(error)}`);
		}
		result.removed.push(...await enforceWorktreeCleanupLimits({
			env: this.env,
			limits: params.limits ?? resolveWorktreeCleanupLimits(),
			progress,
			protect,
			onError: (record, error) => onError("limits", record, error),
			remove: async (record) => {
				await this.remove({
					id: record.id,
					reason: "limit-gc",
					signal: params.signal,
					commitGuard: () => {
						assertCurrent();
						assertOwnerAllowsCleanup(this.env, record, params);
					}
				});
			}
		}));
		let orphansDeleted = 0;
		let snapshotsPruned = 0;
		const expired = records.filter((record) => record.removedAt !== void 0 && now - record.removedAt > 2592e6);
		const hasOrphanCandidates = (await fs$1.readdir(path.join(resolveStateDir(this.env), "worktrees"), { withFileTypes: true }).catch(() => [])).some((entry) => entry.isDirectory() && entry.name !== ".templates");
		if (hasOrphanCandidates || expired.length > 0) try {
			await this.withAllocationLease(params, async (guard) => {
				if (hasOrphanCandidates) try {
					orphansDeleted = await this.reconcileOrphans(listRegistryWorktrees(this.env), guard);
				} catch (error) {
					progress.error("orphans", error);
					log.warn(`worktree orphan cleanup deferred: ${String(error)}`);
				}
				for (const record of expired) try {
					const current = getRegistryWorktree(this.env, record.id);
					if (!current || current.removedAt === void 0 || now - current.removedAt <= 2592e6) continue;
					await retireManagedWorktreeSnapshot({
						record: current,
						env: this.env,
						signal: guard.signal,
						assertCurrent: () => guard.commitGuard?.()
					});
					snapshotsPruned += 1;
				} catch (error) {
					progress.error("snapshots", error, record.id);
					log.warn(`snapshot retention failed for ${record.id}: ${String(error)}`);
				}
			});
		} catch (error) {
			progress.error("orphans", error);
			log.warn(`worktree cleanup deferred: ${String(error)}`);
		}
		try {
			await reapWorktreeRunLeases(this.env, leases.staleScopes, assertCurrent);
		} catch (error) {
			progress.error("idle", error);
		}
		result.orphansDeleted = orphansDeleted;
		result.snapshotsPruned = snapshotsPruned;
		assertCurrent();
		const live = await readRegistryWorktrees(this.env, { liveOnly: true }).catch((error) => {
			assertCurrent();
			log.warn(`worktree Git maintenance inventory failed: ${String(error)}`);
			return [];
		});
		for (const repoRoot of new Set(live.map((record) => record.repoRoot))) {
			assertCurrent();
			try {
				if (!await worktreePathExists(repoRoot)) throw new Error("Repository path is missing");
				const maintained = await runGit(repoRoot, [
					"maintenance",
					"run",
					"--auto"
				], {
					killProcessTree: true,
					signal: params.signal,
					beforeRun: assertCurrent,
					timeoutMs: WORKTREE_GIT_MAINTENANCE_TIMEOUT_MS
				});
				if (maintained.termination !== "exit" || maintained.code !== 0) throw createGitCommandError("git maintenance run --auto", maintained);
			} catch (error) {
				assertCurrent();
				log.warn(`worktree Git maintenance failed for ${repoRoot}: ${String(error)}`);
			}
		}
		assertCurrent();
		return result;
	}
	requireLiveRecord(id) {
		const record = getRegistryWorktree(this.env, id);
		if (!record || record.removedAt !== void 0) throw new Error(`unknown active worktree: ${id}`);
		return record;
	}
	async rebindLiveRepository(record, guard = {}) {
		const worktreePath = await fs$1.realpath(record.path);
		const repository = await resolveRepositoryFromRealPath(worktreePath, record.path);
		if (repository.sourceRoot !== worktreePath) throw new WorktreeRepositoryError(`repository does not own worktree: ${record.path}`);
		if ((await resolveRepository(record.repoRoot)).originUrl !== repository.originUrl) throw new WorktreeRepositoryError(`repository origin does not match: ${record.path}`);
		guard.signal?.throwIfAborted();
		guard.commitGuard?.();
		updateRegistryWorktree(this.env, record.id, { repositoryIdentity: {
			repoRoot: repository.repoRoot,
			repoFingerprint: repository.fingerprint
		} }, { assertCurrent: guard.commitGuard });
		return {
			...record,
			repoRoot: repository.repoRoot,
			repoFingerprint: repository.fingerprint
		};
	}
	async reconcileOrphans(records, guard) {
		const managedPaths = await resolveManagedWorktreePathKeys(records);
		if (!managedPaths) return 0;
		const worktreesRoot = path.join(resolveStateDir(this.env), "worktrees");
		const fingerprints = await fs$1.readdir(worktreesRoot, { withFileTypes: true }).catch(() => []);
		if (fingerprints.length === 0) return 0;
		const defaultRoot = await canonicalPathKey(worktreesRoot);
		const customRoots = /* @__PURE__ */ new Set();
		for (const root of [this.getConfig?.().worktreeRoot, ...records.map((record) => path.dirname(path.dirname(record.path)))]) {
			if (!root) continue;
			try {
				const canonical = await canonicalPathKey(root);
				if (canonical !== defaultRoot) customRoots.add(canonical);
			} catch (error) {
				if (!isMissingPathError(error)) throw error;
			}
		}
		let deleted = 0;
		for (const fingerprint of fingerprints) {
			if (!fingerprint.isDirectory() || fingerprint.name === ".templates") continue;
			const fingerprintPath = path.join(worktreesRoot, fingerprint.name);
			if (await shouldPreserveOrphanCandidate(fingerprintPath, managedPaths, customRoots)) continue;
			const names = await fs$1.readdir(fingerprintPath, { withFileTypes: true }).catch(() => []);
			for (const name of names) {
				if (!name.isDirectory()) continue;
				const candidate = path.join(fingerprintPath, name.name);
				if (await shouldPreserveOrphanCandidate(candidate, managedPaths, customRoots)) continue;
				guard.commitGuard?.();
				await fs$1.rm(candidate, {
					recursive: true,
					force: true
				});
				deleted += 1;
			}
			guard.commitGuard?.();
			await fs$1.rmdir(fingerprintPath).catch(() => void 0);
		}
		return deleted;
	}
};
const managedWorktrees = new ManagedWorktreeService({ getConfig: getRuntimeConfig });
//#endregion
export { managedWorktrees as a, resolveWorktreeBase as c, WORKTREE_GC_INTERVAL_MS as i, ManagedWorktreeService as n, resolveWorktreeCleanupLimits as o, SNAPSHOT_RETENTION_MS as r, InvalidWorktreeBaseRefError as s, IDLE_GC_MS as t };
