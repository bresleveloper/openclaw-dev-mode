import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { r as isMissingPathError } from "./errno-FR4CRyya.mjs";
import "./errors-DPfGDWk1.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { a as readGitObjectStorageDependencies, o as readGitRefs, r as readGitMetadataDirectories, s as readGitWorktreeAdministrations } from "./git-root-toH5zPNI.mjs";
import { w as root } from "./fs-safe-6Z4UiMS4.mjs";
import { d as normalizeGitPathForFilesystem, p as requireGitCommandOutput, r as createGitCommandError } from "./git-exec-CvORirty.mjs";
import { a as lstatIfExists, d as runGitBuffered, i as listGitWorktrees, o as requireGit, p as worktreePathExists, s as requireGitBuffer, t as WORKTREE_CHECKOUT_TIMEOUT_MS, u as runGit } from "./git-CljZIJM8.mjs";
import { a as requestGitWorkerEffect } from "./git-worker-context-Bo3RTsYA.mjs";
import { a as parseGitIndexPaths, c as rawPathStat, i as gitPathspecBatches, l as splitNullBuffer, n as containsGitMarker, o as parseGitTreePaths, r as gitPathKey, s as rawPathExists, t as checkoutPathFromGitBytes } from "./git-path-inventory-BM2twRa6.mjs";
import { a as hasUnsnapshotableProvisionedFiles, i as hasSafeParentDirectories, l as captureExactState, n as snapshotProvisionedFiles, o as normalizeProvisionedRelativePath, p as writeExactStateCommit, s as resolveGitPath, u as exactSnapshotPrefix } from "./provisioned-snapshot-CIETRcbd.mjs";
import { n as indexWorktreePaths } from "./gc-dependencies-B22hkB14.mjs";
import { a as createStagedInputPathMatcher, f as stagedInputPathDirectory } from "./staged-inputs-Hv7T90Jl.mjs";
import fs from "node:fs";
import { createHash } from "node:crypto";
import fs$1 from "node:fs/promises";
import path from "node:path";
import { safeRealpathSync } from "@openclaw/fs-safe/path";
import { setImmediate } from "node:timers/promises";
//#region src/agents/worktrees/capacity.runtime.ts
const log = createSubsystemLogger("agents/worktrees");
async function missingCommitObjects(repoRoot, commit) {
	return (await requireGitBuffer(repoRoot, [
		"rev-list",
		"--objects",
		"--missing=print",
		"--no-object-names",
		"--max-count=1",
		commit
	], { env: { GIT_NO_LAZY_FETCH: "1" } })).toString("utf8").split("\n").filter((line) => line.startsWith("?")).map((line) => line.slice(1));
}
async function readOptionalGitConfig(repoRoot, args) {
	const result = await runGit(repoRoot, ["config", ...args]);
	return result.termination === "exit" && result.code === 1 ? "" : requireGitCommandOutput(`git config ${args.join(" ")}`, result).trim();
}
function missingObjectsError(commit, count) {
	return /* @__PURE__ */ new Error(`Repository is missing ${count} objects for ${commit}; fetch or repair the clone.`);
}
async function resolveCommit(repoRoot, ref) {
	return await requireGit(repoRoot, [
		"rev-parse",
		"--verify",
		"--end-of-options",
		`${ref === "-" ? "@{-1}" : ref}^{commit}`
	]);
}
async function hydrateCommitObjects(repoRoot, commit) {
	const missing = await missingCommitObjects(repoRoot, commit);
	if (missing.length > 0) {
		const remote = await readOptionalGitConfig(repoRoot, ["--get", "extensions.partialclone"]) || /^remote\.(.+)\.promisor true$/m.exec(await readOptionalGitConfig(repoRoot, [
			"--bool",
			"--get-regexp",
			"^remote\\..*\\.promisor$"
		]))?.[1];
		if (!remote) throw missingObjectsError(commit, missing.length);
		await requireGit(repoRoot, [
			"fetch",
			"--refetch",
			"--no-auto-maintenance",
			remote,
			"--no-tags",
			"--no-write-fetch-head",
			"--recurse-submodules=no",
			"--stdin"
		], {
			input: Buffer.from(`${missing.join("\n")}\n`),
			timeoutMs: WORKTREE_CHECKOUT_TIMEOUT_MS
		}).catch((error) => {
			log.warn(`worktree prefetch failed: ${missing.length} missing objects for ${commit}; check the promisor remote.`);
			throw error;
		});
	}
}
function allocatedBlobBytes(size) {
	const value = Number(size);
	if (!size || !Number.isSafeInteger(value) || value < 0) throw new Error("Cannot estimate worktree checkout size; inspect the repository objects and retry.");
	return Math.max(4096, Math.ceil(value / 4096) * 4096);
}
const checkoutSizeFacts = /* @__PURE__ */ new Map();
const MAX_CHECKOUT_SIZE_FACTS = 32;
async function commitObjectBytes(repoRoot, commit, replacementRefBase, preparationKey) {
	const replacements = replacementRefBase === void 0 ? void 0 : await requireGit(repoRoot, [
		"for-each-ref",
		"--format=%(refname)",
		"--",
		replacementRefBase
	]);
	let cacheKey;
	let cached;
	if (replacements === "") {
		const canonicalRoot = await fs$1.realpath(repoRoot);
		const identity = await fs$1.stat(canonicalRoot);
		cacheKey = JSON.stringify([
			canonicalRoot,
			identity.dev,
			identity.ino,
			commit
		]);
		cached = checkoutSizeFacts.get(cacheKey);
		if (cached && preparationKey && cached.preparationKey === preparationKey) return cached.bytes;
	}
	await hydrateCommitObjects(repoRoot, commit);
	if (cached && cacheKey) {
		checkoutSizeFacts.set(cacheKey, {
			bytes: cached.bytes,
			preparationKey
		});
		return cached.bytes;
	}
	try {
		const sizes = (await requireGitBuffer(repoRoot, [
			"ls-tree",
			"-r",
			"--format=%(objectsize)",
			commit,
			"--"
		], { env: { GIT_NO_LAZY_FETCH: "1" } })).toString("utf8");
		let bytes = 0;
		for (const size of sizes.split("\n")) {
			if (!size || size === "-") continue;
			bytes += allocatedBlobBytes(size);
		}
		if (cacheKey) {
			checkoutSizeFacts.set(cacheKey, {
				bytes,
				preparationKey
			});
			pruneMapToMaxSize(checkoutSizeFacts, MAX_CHECKOUT_SIZE_FACTS);
		}
		return bytes;
	} catch (error) {
		const remaining = await missingCommitObjects(repoRoot, commit);
		if (remaining.length > 0) throw missingObjectsError(commit, remaining.length);
		throw error;
	}
}
async function estimateCheckoutObjectBytes(repoRoot, ref, replacementRefBase, preparationKey) {
	return await commitObjectBytes(repoRoot, await resolveCommit(repoRoot, ref), replacementRefBase, preparationKey);
}
async function estimateCheckoutTransitionBytes(repoRoot, baseRef, targetRef, replacementRefBase) {
	const base = await resolveCommit(repoRoot, baseRef);
	const target = await resolveCommit(repoRoot, targetRef);
	if (target !== base) await hydrateCommitObjects(repoRoot, base);
	const targetBytes = await commitObjectBytes(repoRoot, target, replacementRefBase);
	if (target === base) return {
		targetBytes,
		changedBytes: 0,
		requiresFullCheckout: false
	};
	const diff = await runGitBuffered(repoRoot, [
		"diff-tree",
		"--no-commit-id",
		"--raw",
		"-z",
		"--no-renames",
		"--no-abbrev",
		"-r",
		base,
		target,
		"--"
	], { env: { GIT_NO_LAZY_FETCH: "1" } });
	if (diff.termination === "output-limit") return {
		targetBytes,
		changedBytes: targetBytes,
		requiresFullCheckout: true
	};
	if (diff.termination !== "exit" || diff.code !== 0) throw createGitCommandError("git diff-tree", diff);
	const changes = diff.stdout.toString("utf8").split("\0");
	if (changes.at(-1) !== "" || changes.length % 2 !== 1) throw new Error("Cannot estimate worktree overlay size; inspect the repository diff and retry.");
	const blobs = [];
	let checkoutAttributesChanged = false;
	for (let offset = 0; offset < changes.length - 1; offset += 2) {
		const metadata = /^:[0-7]{6} ([0-7]{6}) [a-f0-9]+ ([a-f0-9]+) [AMDT]$/u.exec(changes[offset]);
		if (!metadata || changes[offset + 1] === void 0) throw new Error("Cannot estimate worktree overlay size; inspect the repository diff and retry.");
		const changedPath = changes[offset + 1];
		checkoutAttributesChanged ||= changedPath === ".gitattributes" || changedPath.endsWith("/.gitattributes");
		if (metadata[1] !== "000000" && metadata[1] !== "160000") blobs.push(metadata[2]);
	}
	if (checkoutAttributesChanged) return {
		targetBytes,
		changedBytes: targetBytes,
		requiresFullCheckout: true
	};
	if (blobs.length === 0) return {
		targetBytes,
		changedBytes: 0,
		requiresFullCheckout: false
	};
	const sizes = (await requireGitBuffer(repoRoot, ["cat-file", "--batch-check=%(objecttype) %(objectsize)"], {
		input: Buffer.from(`${blobs.join("\n")}\n`),
		env: { GIT_NO_LAZY_FETCH: "1" }
	})).toString("utf8").trimEnd().split("\n");
	if (sizes.length !== blobs.length || sizes.some((size) => !size.startsWith("blob "))) throw new Error("Cannot estimate worktree overlay size; inspect the repository objects and retry.");
	return {
		targetBytes,
		changedBytes: sizes.reduce((bytes, size) => bytes + allocatedBlobBytes(size.slice(5)), 0),
		requiresFullCheckout: false
	};
}
/** Measure without following links; unreadable trees must never be counted as empty. */
async function measureDirectoryTreeBytes(root, excludeGit = false) {
	let entries;
	try {
		entries = await fs$1.readdir(root, { withFileTypes: true });
	} catch (error) {
		if (isMissingPathError(error)) return 0;
		throw error;
	}
	let total = 0;
	for (const entry of entries) {
		if (excludeGit && entry.name === ".git") continue;
		const child = path.join(root, entry.name);
		if (entry.isDirectory()) total += await measureDirectoryTreeBytes(child, excludeGit);
		else total += (await rawPathStat(child))?.size ?? 0;
	}
	return total;
}
//#endregion
//#region src/agents/worktrees/eviction.runtime.ts
const classifications = /* @__PURE__ */ new Map();
const defaultPatches = /* @__PURE__ */ new Map();
function gitOptions(root, storage = readGitMetadataDirectories(root)) {
	if (!storage) throw new Error(`Git metadata is unavailable for ${root}`);
	return {
		env: {
			GIT_DIR: storage.gitDir,
			GIT_COMMON_DIR: storage.commonDir,
			GIT_WORK_TREE: void 0,
			GIT_OBJECT_DIRECTORY: path.join(storage.commonDir, "objects"),
			GIT_ALTERNATE_OBJECT_DIRECTORIES: void 0,
			GIT_NO_REPLACE_OBJECTS: "1",
			GIT_NO_LAZY_FETCH: "1"
		},
		maxOutputBytes: 67108864,
		terminateOnOutputLimit: true
	};
}
function dependencyInspectionBudget() {
	const started = performance.now();
	return () => {
		if (performance.now() - started >= 5e3) throw new Error("Worktree dependency inspection exceeded its 5-second budget; retry cleanup");
	};
}
function checkoutKey(checkout) {
	const resolved = safeRealpathSync(checkout) ?? path.resolve(checkout);
	return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}
function administrationInventory(commonDir, assertBudget) {
	const inventory = readGitWorktreeAdministrations(commonDir, assertBudget);
	const byCheckout = /* @__PURE__ */ new Map();
	for (const entry of inventory.entries) {
		assertBudget();
		const key = checkoutKey(entry.checkoutPath);
		const entries = byCheckout.get(key) ?? [];
		entries.push(entry);
		byCheckout.set(key, entries);
	}
	return {
		...inventory,
		byCheckout
	};
}
function readWorktreeSourceDependencies(input) {
	const assertBudget = dependencyInspectionBudget();
	const sourceStorage = readGitMetadataDirectories(input.sourceRoot, assertBudget);
	let complete = sourceStorage !== void 0;
	const requiredPaths = /* @__PURE__ */ new Set([
		...input.requiredPaths,
		input.sourceRoot,
		checkoutKey(input.sourceRoot),
		input.commonDir,
		...sourceStorage?.paths ?? []
	]);
	for (const commonDir of /* @__PURE__ */ new Set([input.commonDir, sourceStorage?.commonDir])) {
		if (!commonDir) continue;
		const objects = readGitObjectStorageDependencies(commonDir, assertBudget);
		complete &&= objects.complete;
		for (const dependency of objects.paths) requiredPaths.add(dependency);
	}
	const repositories = /* @__PURE__ */ new Map();
	const inventories = /* @__PURE__ */ new Map();
	const ownedPaths = [];
	for (const record of input.records) {
		assertBudget();
		ownedPaths.push(record, {
			id: record.id,
			path: checkoutKey(record.path)
		});
		if (!repositories.has(record.repoRoot)) repositories.set(record.repoRoot, readGitMetadataDirectories(record.repoRoot, assertBudget));
		const storage = repositories.get(record.repoRoot);
		if (storage && !inventories.has(storage.commonDir)) inventories.set(storage.commonDir, administrationInventory(storage.commonDir, assertBudget));
		const administrations = storage ? inventories.get(storage.commonDir) : void 0;
		for (const entry of administrations?.byCheckout.get(checkoutKey(record.path)) ?? []) ownedPaths.push({
			id: record.id,
			path: entry.adminPath
		}, {
			id: record.id,
			path: entry.physicalAdminPath
		});
	}
	const ancestors = indexWorktreePaths(ownedPaths);
	const worktreeIds = /* @__PURE__ */ new Set();
	for (const required of requiredPaths) {
		assertBudget();
		for (const id of ancestors(required)) worktreeIds.add(id);
	}
	return {
		worktreeIds: [...worktreeIds],
		ownedPaths,
		complete
	};
}
async function prepareWorktreeEvictionRepositories(repoRoots) {
	const repositories = [];
	for (const repoRoot of repoRoots) {
		const repository = {
			repoRoot,
			commonDir: readGitMetadataDirectories(repoRoot)?.commonDir,
			heads: {}
		};
		try {
			repository.defaultHead = await defaultBranchHead(repoRoot);
			if (repository.defaultHead) {
				for (const checkout of await listGitWorktrees(repoRoot, gitOptions(repoRoot))) if (checkout.head && !/^0+$/u.test(checkout.head)) repository.heads[path.resolve(checkout.path)] = checkout.head;
			}
		} catch {
			await requestGitWorkerEffect({
				type: "worktree.assert-current",
				input: {}
			});
		}
		repositories.push(repository);
	}
	return repositories;
}
async function defaultBranchHead(repoRoot) {
	const remoteHead = await runGit(repoRoot, [
		"rev-parse",
		"--verify",
		"refs/remotes/origin/HEAD^{commit}"
	], gitOptions(repoRoot));
	if (remoteHead.code === 0) return remoteHead.stdout.trim();
	return (await runGit(repoRoot, [
		"config",
		"--get",
		"remote.origin.url"
	], gitOptions(repoRoot))).code === 1 ? await requireGit(repoRoot, [
		"rev-parse",
		"--verify",
		"HEAD^{commit}"
	], gitOptions(repoRoot)) : void 0;
}
async function patchIds(repoRoot, patch) {
	const ids = await requireGit(repoRoot, ["patch-id", "--stable"], {
		...gitOptions(repoRoot),
		input: patch
	});
	return new Set(ids.split("\n").map((line) => line.split(" ")[0]).filter(Boolean));
}
async function classifyBranch(repoRoot, head, upstream) {
	const cacheKey = `${repoRoot}:${head}:${upstream}`;
	const cached = classifications.get(cacheKey);
	if (cached) return cached;
	const ancestor = await runGit(repoRoot, [
		"merge-base",
		"--is-ancestor",
		head,
		upstream
	], gitOptions(repoRoot));
	let reason = "idle-age";
	if (ancestor.code === 0) reason = "merged";
	else if (ancestor.code === 1) {
		const base = await requireGit(repoRoot, [
			"merge-base",
			head,
			upstream
		], gitOptions(repoRoot));
		const cherry = await requireGit(repoRoot, [
			"cherry",
			upstream,
			head
		], gitOptions(repoRoot));
		if (cherry.trim() && !cherry.split("\n").some((line) => line.startsWith("+"))) reason = "squashed";
		else {
			const branchIds = await patchIds(repoRoot, await requireGitBuffer(repoRoot, [
				"diff",
				"--binary",
				"--no-ext-diff",
				"--no-textconv",
				base,
				head
			], gitOptions(repoRoot)));
			const historyKey = `${repoRoot}:${base}:${upstream}`;
			let landedIds = defaultPatches.get(historyKey);
			if (!landedIds) {
				landedIds = await patchIds(repoRoot, await requireGitBuffer(repoRoot, [
					"log",
					"--no-merges",
					"--format=medium",
					"--binary",
					"--no-ext-diff",
					"--no-textconv",
					"-p",
					`${base}..${upstream}`
				], gitOptions(repoRoot)));
				defaultPatches.set(historyKey, landedIds);
				pruneMapToMaxSize(defaultPatches, 64);
			}
			if (branchIds.size > 0 && [...branchIds].every((id) => landedIds.has(id))) reason = "squashed";
		}
	} else throw createGitCommandError("git merge-base --is-ancestor", ancestor);
	classifications.set(cacheKey, reason);
	pruneMapToMaxSize(classifications, 8192);
	return reason;
}
async function classifyWorktreeEvictions(records) {
	const candidates = [];
	for (const record of records) {
		let reason = "idle-age";
		try {
			const { head, defaultHead: upstream } = record;
			if (head && upstream) {
				reason = await classifyBranch(record.repoRoot, head, upstream);
				if (reason === "idle-age" && record.mergedHeads?.some((landed) => landed.sha === head)) {
					if ((await runGit(record.repoRoot, [
						"show-ref",
						"--verify",
						"--quiet",
						`refs/remotes/origin/${record.branch}`
					], gitOptions(record.repoRoot))).code === 1) for (const landed of record.mergedHeads) {
						if (landed.sha !== head || !landed.mergeCommitSha) continue;
						if ((await runGit(record.repoRoot, [
							"merge-base",
							"--is-ancestor",
							landed.mergeCommitSha,
							upstream
						], gitOptions(record.repoRoot))).code === 0) {
							reason = "squashed";
							break;
						}
					}
				}
			}
		} catch {
			await requestGitWorkerEffect({
				type: "worktree.assert-current",
				input: {}
			});
		}
		candidates.push({
			id: record.id,
			reason
		});
	}
	return candidates;
}
/** The host holds the registry removal claim and joins this write without cancellation. */
async function purgeWorktreeCheckout(record, live) {
	const checkout = path.resolve(record.path);
	const source = path.resolve(record.repoRoot);
	const stat = fs.lstatSync(checkout, {
		bigint: true,
		throwIfNoEntry: false
	});
	if (stat && !stat.isDirectory()) throw new Error("Managed worktree checkout is not a directory; repair its path before eviction");
	const physicalCheckout = stat ? fs.realpathSync.native(checkout) : checkout;
	const sourceStorage = readGitMetadataDirectories(source);
	const primary = (sourceStorage ? await listGitWorktrees(source, gitOptions(source, sourceStorage)).catch(() => []) : [])[0]?.path;
	const assertBudget = dependencyInspectionBudget();
	let deletionStorage = readGitMetadataDirectories(source, assertBudget);
	const readAdministration = (storage) => {
		if (!storage) return;
		const inventory = administrationInventory(storage.commonDir, assertBudget);
		const matches = inventory.byCheckout.get(checkoutKey(checkout)) ?? [];
		if (!inventory.complete || matches.length > 1) throw new Error("Managed worktree administration is unavailable or ambiguous; retry cleanup");
		return matches[0];
	};
	const administration = readAdministration(deletionStorage);
	const registered = administration !== void 0;
	const targets = [{
		path: checkout,
		physicalPath: physicalCheckout,
		stat,
		physicalStat: stat
	}];
	if (administration) {
		const adminStat = fs.lstatSync(administration.adminPath, { bigint: true });
		targets.push({
			path: administration.adminPath,
			physicalPath: administration.physicalAdminPath,
			stat: adminStat,
			physicalStat: fs.statSync(administration.adminPath, { bigint: true })
		});
	}
	const assertTargetsCurrent = () => {
		for (const target of targets) {
			const current = fs.lstatSync(target.path, {
				bigint: true,
				throwIfNoEntry: false
			});
			const physical = current ? fs.statSync(target.path, { bigint: true }) : void 0;
			if (target.stat ? !current || current.dev !== target.stat.dev || current.ino !== target.stat.ino || physical?.dev !== target.physicalStat?.dev || physical?.ino !== target.physicalStat?.ino || fs.realpathSync.native(target.path) !== target.physicalPath : current !== void 0) throw new Error("Managed worktree purge target changed; retry cleanup");
		}
	};
	const others = live.filter((candidate) => candidate.id !== record.id);
	const roots = [.../* @__PURE__ */ new Set([source, ...others.map((candidate) => candidate.repoRoot)])];
	const contains = (target) => {
		return targets.some(({ physicalPath }) => {
			const relative = path.relative(physicalPath, target);
			return relative === "" || relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative);
		});
	};
	const fenced = /* @__PURE__ */ new Set();
	let admitted = false;
	for (;;) {
		await setImmediate();
		assertTargetsCurrent();
		const objects = /* @__PURE__ */ new Map();
		const objectDependencies = (storage) => {
			if (!storage) return;
			let dependencies = objects.get(storage.commonDir);
			if (!dependencies) {
				dependencies = readGitObjectStorageDependencies(storage.commonDir, assertBudget);
				objects.set(storage.commonDir, dependencies);
			}
			return dependencies;
		};
		const repositories = /* @__PURE__ */ new Map();
		for (const root of roots) {
			const storage = readGitMetadataDirectories(root, assertBudget);
			repositories.set(root, {
				physicalRoot: safeRealpathSync(root) ?? root,
				storage,
				objects: objectDependencies(storage)
			});
			assertBudget();
		}
		const currentSource = repositories.get(source);
		const currentAdministration = readAdministration(currentSource.storage);
		if (currentAdministration?.adminPath !== administration?.adminPath || currentAdministration?.physicalAdminPath !== administration?.physicalAdminPath) throw new Error("Managed worktree purge administration changed; retry cleanup");
		deletionStorage = currentSource.storage;
		if (contains(currentSource.physicalRoot)) throw new Error("Managed worktree eviction cannot remove the source repository");
		if (primary && (path.resolve(primary) === checkout || path.resolve(primary).startsWith(`${checkout}${path.sep}`))) throw new Error("Managed worktree eviction cannot remove the primary repository");
		const checkoutStorage = readGitMetadataDirectories(checkout, assertBudget);
		const checkoutCommonDir = checkoutStorage && path.relative(checkoutStorage.gitDir, checkoutStorage.commonDir) !== "" ? checkoutStorage.commonDir : void 0;
		const checkoutObjects = checkoutCommonDir ? objectDependencies(checkoutStorage) : void 0;
		if ([
			...currentSource.storage?.paths ?? [],
			checkoutCommonDir,
			...currentSource.objects?.paths ?? [],
			...checkoutObjects?.paths ?? []
		].some((directory) => directory !== void 0 && contains(directory))) throw new Error("Managed worktree eviction cannot remove its source Git metadata; relocate the shared Git directory outside the checkout first");
		if (currentSource.objects?.complete === false || checkoutObjects?.complete === false) throw new Error("Managed worktree source Git object dependencies are incomplete; repair its object storage before eviction");
		const unresolved = [];
		for (const candidate of others) {
			const repository = repositories.get(candidate.repoRoot);
			const physicalPath = safeRealpathSync(candidate.path);
			const storage = readGitMetadataDirectories(candidate.path, assertBudget);
			const checkoutDependencies = objectDependencies(storage);
			if ([
				candidate.path,
				physicalPath,
				candidate.repoRoot,
				repository.physicalRoot,
				...repository.storage?.paths ?? [],
				...storage?.paths ?? [],
				...repository.objects?.paths ?? [],
				...checkoutDependencies?.paths ?? []
			].some((target) => target != null && contains(target))) throw new Error(`Worktree acquired a live checkout or repository dependency: ${candidate.id}; retry cleanup after that checkout retires`);
			if ((!repository.storage || !storage || !repository.objects?.complete || !checkoutDependencies?.complete) && !fenced.has(candidate.id)) unresolved.push(candidate.id);
			assertBudget();
		}
		assertBudget();
		assertTargetsCurrent();
		if (unresolved.length === 0) {
			if (admitted) break;
			await requestGitWorkerEffect({
				type: "worktree.eviction-admit",
				input: {}
			});
			admitted = true;
			continue;
		}
		await requestGitWorkerEffect({
			type: "worktree.eviction-fence",
			input: { worktreeIds: unresolved }
		});
		for (const id of unresolved) fenced.add(id);
	}
	if (registered) await requireGit(source, [
		"worktree",
		"remove",
		"--force",
		"--force",
		"--",
		checkout
	], {
		...gitOptions(source, deletionStorage),
		killProcessTree: true,
		waitForExit: true
	});
	else if (stat) await fs$1.rm(checkout, {
		recursive: true,
		force: true
	});
}
//#endregion
//#region src/agents/worktrees/gc-fingerprint.runtime.ts
/** A deferral is a scheduling hint, never permission to delete a checkout. */
async function readWorktreeCleanupFingerprint(checkoutPath) {
	try {
		const directories = readGitMetadataDirectories(checkoutPath);
		if (!directories) return null;
		const { gitDir: gitdir, commonDir: common } = directories;
		const head = await fs$1.readFile(path.join(gitdir, "HEAD"), "utf8");
		const reference = head.startsWith("ref: ") ? head.slice(5).trim() : void 0;
		const tip = reference ? readGitRefs(common, [reference]).get(reference) : head;
		const identities = await Promise.all([
			checkoutPath,
			path.join(checkoutPath, ".git"),
			path.join(gitdir, "HEAD"),
			path.join(gitdir, "index")
		].map(async (entry) => {
			const stat = await fs$1.lstat(entry, { bigint: true });
			return [
				stat.dev,
				stat.ino,
				stat.size,
				stat.mtimeNs,
				stat.ctimeNs
			].map(String);
		}));
		return createHash("sha256").update(JSON.stringify([
			directories,
			head,
			tip,
			identities
		])).digest("hex");
	} catch {
		return null;
	}
}
//#endregion
//#region src/agents/worktrees/snapshot-inventory.ts
const assertCurrent = () => requestGitWorkerEffect({
	type: "worktree.assert-current",
	input: {}
});
function openRawDirectory(directoryPath) {
	const openDirectory = fs$1.opendir;
	return openDirectory(directoryPath, { encoding: "buffer" });
}
async function listCollapsedOtherPaths(checkoutPath, ignored) {
	return splitNullBuffer(await requireGitBuffer(checkoutPath, [
		"ls-files",
		"-z",
		"--others",
		...ignored ? ["--ignored"] : [],
		"--exclude-standard",
		"--directory"
	]));
}
async function walkCollapsedPaths(checkoutPath, entries, options) {
	const visitDirectory = async (relative) => {
		if (await rawPathExists(checkoutPathFromGitBytes(checkoutPath, Buffer.concat([relative, Buffer.from("/.git")])))) return true;
		const directory = await openRawDirectory(checkoutPathFromGitBytes(checkoutPath, relative));
		for await (const entry of directory) {
			if (!Buffer.isBuffer(entry.name)) throw new Error("Expected raw directory-entry bytes");
			const child = Buffer.concat([
				relative,
				Buffer.from("/"),
				entry.name
			]);
			if (options.skip?.has(gitPathKey(child))) continue;
			if (entry.isDirectory()) {
				if (await visitDirectory(child)) return true;
			} else await options.visitFile?.(child);
		}
		return false;
	};
	for (const entry of entries) if (entry.at(-1) === 47) {
		if (await visitDirectory(entry.subarray(0, -1))) return true;
	} else await options.visitFile?.(entry);
	return false;
}
/** Index entries whose flags make Git skip its worktree comparison for that path. */
function unstattedIndexPaths(index) {
	return index.filter((entry) => entry.assumeUnchanged || entry.skipWorktree).map((entry) => entry.path);
}
/**
* Inspect untracked and ignored paths without buffering every filename through Git.
* Resolves true when a nested repository marker is found; ignored paths nested in
* untracked trees stay out of the untracked visit so ignore semantics are preserved.
* `unstattedIndexPaths` carries the index entries Git will not compare against the
* filesystem, whose replacements only a direct stat can discover.
*/
async function inspectOtherPaths(checkoutPath, options = {}) {
	const untracked = await listCollapsedOtherPaths(checkoutPath, false);
	const candidates = /* @__PURE__ */ new Map();
	for (const entry of [...splitNullBuffer(await requireGitBuffer(checkoutPath, [
		"diff-files",
		"-z",
		"--name-only",
		"--diff-filter=DU"
	])), ...options.unstattedIndexPaths ?? []]) candidates.set(gitPathKey(entry), entry);
	const replaced = [...candidates.values()];
	for (let offset = 0; offset < replaced.length; offset += 64) {
		const batch = replaced.slice(offset, offset + 64);
		const stats = await Promise.allSettled(batch.map((entry) => rawPathStat(checkoutPathFromGitBytes(checkoutPath, entry))));
		for (const [index, result] of stats.entries()) if (result.status === "rejected") throw result.reason;
		else if (result.value?.isDirectory()) untracked.push(Buffer.concat([batch[index], Buffer.from("/")]));
	}
	const ignored = await listCollapsedOtherPaths(checkoutPath, true);
	if (await containsGitMarker(checkoutPath, [...untracked, ...ignored])) return true;
	const ignoredKeys = new Set(ignored.map((entry) => gitPathKey(entry.at(-1) === 47 ? entry.subarray(0, -1) : entry)));
	return await walkCollapsedPaths(checkoutPath, untracked, {
		visitFile: options.untracked,
		skip: ignoredKeys
	}) || await walkCollapsedPaths(checkoutPath, ignored, { visitFile: options.ignored });
}
async function collectSnapshotInventory(input) {
	const head = await requireGit(input.checkoutPath, [
		"rev-parse",
		"--verify",
		"HEAD^{commit}"
	]);
	const headPaths = parseGitTreePaths(await requireGitBuffer(input.checkoutPath, [
		"ls-tree",
		"-r",
		"-z",
		head
	]));
	const index = parseGitIndexPaths(await requireGitBuffer(input.checkoutPath, [
		"ls-files",
		"--stage",
		"-v",
		"-z"
	]));
	const provisioned = new Set(input.provisionedPaths.map((entry) => gitPathKey(Buffer.from(entry))));
	const paths = /* @__PURE__ */ new Map();
	const add = (entry) => {
		const key = gitPathKey(entry);
		if (!provisioned.has(key)) paths.set(key, entry);
	};
	const sparseConfig = await runGit(input.checkoutPath, [
		"config",
		"--bool",
		"core.sparseCheckout"
	]);
	if (sparseConfig.code !== 0 && sparseConfig.code !== 1) throw createGitCommandError("git config --bool core.sparseCheckout", sparseConfig);
	const sparse = sparseConfig.code === 0 && sparseConfig.stdout.trim() === "true";
	const sourcePaths = /* @__PURE__ */ new Set();
	const sparseCandidates = [];
	const headKeys = new Set(headPaths.map((entry) => gitPathKey(entry.path)));
	for (const entry of index) {
		sourcePaths.add(gitPathKey(entry.path));
		if (!headKeys.has(gitPathKey(entry.path)) && (await rawPathStat(checkoutPathFromGitBytes(input.checkoutPath, entry.path)))?.isDirectory()) continue;
		if (!entry.skipWorktree || await rawPathExists(checkoutPathFromGitBytes(input.checkoutPath, entry.path)) || !sparse) add(entry.path);
		else sparseCandidates.push(entry.path);
	}
	if (sparseCandidates.length > 0) {
		const included = await requireGitBuffer(input.checkoutPath, [
			"sparse-checkout",
			"check-rules",
			"-z"
		], { input: Buffer.concat(sparseCandidates.flatMap((entry) => [entry, Buffer.from([0])])) });
		for (const entry of splitNullBuffer(included)) add(entry);
	}
	for (const entry of headPaths) if (!sourcePaths.has(gitPathKey(entry.path))) add(entry.path);
	const isStagedInput = createStagedInputPathMatcher(await root(input.checkoutPath));
	let untracked = 0;
	if (await inspectOtherPaths(input.checkoutPath, {
		unstattedIndexPaths: unstattedIndexPaths(index),
		untracked: async (entry) => {
			untracked++;
			add(entry);
		},
		ignored: async (entry) => {
			const relativePath = entry.toString("utf8");
			if (stagedInputPathDirectory(relativePath) && await isStagedInput(relativePath)) add(entry);
		}
	}) || await containsGitMarker(input.checkoutPath, paths.values())) throw new Error("nested git repositories cannot be snapshotted losslessly");
	await requestGitWorkerEffect({
		type: "worktree.snapshot-inventory",
		input: {
			tracked: sourcePaths.size,
			untracked
		}
	});
	const status = splitNullBuffer(await requireGitBuffer(input.checkoutPath, [
		"-c",
		"core.ignoreStat=false",
		"-c",
		"core.trustctime=true",
		"-c",
		"core.checkStat=default",
		...process.platform === "win32" ? [] : ["-c", "core.filemode=true"],
		"--no-optional-locks",
		"status",
		"--porcelain=v1",
		"-z",
		"--untracked-files=no",
		"--no-renames"
	]));
	const changed = new Set(status.map((entry) => gitPathKey(entry.subarray(3))));
	for (const entry of unstattedIndexPaths(index)) if (paths.has(gitPathKey(entry))) changed.add(gitPathKey(entry));
	return {
		head,
		headPaths,
		paths,
		changed
	};
}
const snapshotIndexArgs = [
	"-c",
	"submodule.recurse=false",
	"-c",
	"core.splitIndex=false",
	"-c",
	"core.sparseCheckout=false",
	"-c",
	"index.sparse=false",
	"-c",
	"core.ignoreStat=false",
	"-c",
	"core.trustctime=true",
	"-c",
	"core.checkStat=default",
	...process.platform === "win32" ? [] : ["-c", "core.filemode=true"]
];
async function prepareSnapshotIndex(input, inventory, indexEnv, temporaryDirectory) {
	const metadataBytes = [...inventory.headPaths.map((entry) => entry.path), ...inventory.paths.values()].reduce((total, entry) => total + 512 + 2 * entry.length, 0);
	await requestGitWorkerEffect({
		type: "worktree.snapshot-capacity",
		input: {
			demands: [{
				path: temporaryDirectory,
				bytes: 2 * metadataBytes
			}],
			purpose: "worktree safety snapshot index"
		}
	});
	const tracked = new Set(inventory.headPaths.map((entry) => gitPathKey(entry.path)));
	const unique = new Map([...inventory.paths].filter(([key]) => inventory.changed.has(key) || !tracked.has(key)));
	for (const value of input.provisionedPaths) unique.set(gitPathKey(Buffer.from(value)), Buffer.from(value));
	const provisioned = new Set(input.provisionedPaths.map((value) => gitPathKey(Buffer.from(value))));
	let gitBytes = 0;
	let provisionedBytes = 0;
	const candidates = [...unique];
	const missing = /* @__PURE__ */ new Set();
	for (let offset = 0; offset < candidates.length; offset += 64) {
		const batch = candidates.slice(offset, offset + 64);
		const stats = await Promise.allSettled(batch.map(([, value]) => rawPathStat(checkoutPathFromGitBytes(input.checkoutPath, value))));
		for (const [index, result] of stats.entries()) {
			const key = batch[index][0];
			if (result.status === "rejected") throw result.reason;
			if (result.value) {
				if (provisioned.has(key)) provisionedBytes += result.value.size;
				else gitBytes += result.value.size;
			} else if (tracked.has(key)) missing.add(key);
		}
	}
	const common = normalizeGitPathForFilesystem(await requireGit(input.repoRoot, ["rev-parse", "--git-common-dir"]));
	await requestGitWorkerEffect({
		type: "worktree.snapshot-capacity",
		input: {
			demands: [{
				path: path.resolve(input.repoRoot, common),
				bytes: 2 * gitBytes + metadataBytes
			}, {
				path: temporaryDirectory,
				bytes: 2 * metadataBytes
			}],
			stateBytes: 2 * provisionedBytes,
			purpose: "worktree safety snapshot"
		}
	});
	const paths = candidates.filter(([key]) => !provisioned.has(key)).map(([, entry]) => entry);
	const rank = (entry) => missing.has(gitPathKey(entry)) ? 0 : tracked.has(gitPathKey(entry)) ? 1 : 2;
	paths.sort((left, right) => rank(left) - rank(right) || (rank(left) === 0 ? Buffer.compare(right, left) : 0));
	if (paths.length > 0) await requireGit(input.checkoutPath, [
		...snapshotIndexArgs,
		"read-tree",
		"--reset",
		inventory.head
	], { env: indexEnv });
	return {
		paths,
		changed: paths.length > 0
	};
}
function assertNoProvisionedTreePaths(tree, provisionedPaths) {
	const provisioned = new Set(provisionedPaths.map((entry) => gitPathKey(Buffer.from(entry))));
	for (const entry of tree) {
		if (entry.mode === "160000") throw new Error("nested git repositories cannot be snapshotted losslessly");
		for (let end = entry.path.length; end >= 0; end = entry.path.lastIndexOf(47, end - 1)) {
			const prefix = entry.path.subarray(0, end);
			if (provisioned.has(gitPathKey(prefix))) throw new Error(`provisioned path entered Git snapshot: ${prefix.toString("utf8")}`);
			if (end === 0) break;
		}
	}
}
async function snapshotWorktree(input) {
	await assertCurrent();
	const temporaryDirectory = await requestGitWorkerEffect({
		type: "git.temporary-directory",
		input: {}
	});
	const snapshotRef = input.exactState ? `${exactSnapshotPrefix}${input.worktreeId}` : `refs/openclaw/snapshots/${input.worktreeId}`;
	const filemodeArgs = process.platform === "win32" ? [] : ["-c", "core.filemode=true"];
	const env = {
		GIT_INDEX_FILE: path.join(temporaryDirectory, "index"),
		GIT_AUTHOR_NAME: "OpenClaw",
		GIT_AUTHOR_EMAIL: "openclaw@localhost",
		GIT_COMMITTER_NAME: "OpenClaw",
		GIT_COMMITTER_EMAIL: "openclaw@localhost"
	};
	const inventory = await collectSnapshotInventory(input);
	await assertCurrent();
	const prepared = input.exactState ? void 0 : await prepareSnapshotIndex(input, inventory, env, temporaryDirectory);
	const exact = input.exactState ? await captureExactState({
		checkoutPath: input.checkoutPath,
		...input.exactState,
		paths: inventory.paths.values(),
		provisionedPaths: input.provisionedPaths,
		write: true,
		temporaryDirectory
	}) : void 0;
	const provisionedState = await snapshotProvisionedFiles(input.checkoutPath, input.provisionedPaths, exact ? {
		algorithm: exact.metadata.head.length === 64 ? "sha256" : "sha1",
		files: exact.metadata.files.filter((entry) => entry.provisioned).map((entry) => ({
			path: Buffer.from(entry.path, "hex").toString("utf8"),
			mode: entry.kind === "missing" ? null : entry.mode,
			size: entry.size,
			blob: entry.blob
		}))
	} : void 0);
	await assertCurrent();
	if (prepared?.changed) {
		await requireGit(input.checkoutPath, [
			...snapshotIndexArgs,
			"update-index",
			"--add",
			"--remove",
			"-z",
			"--stdin"
		], {
			env,
			input: Buffer.concat(prepared.paths.flatMap((entry) => [entry, Buffer.from([0])]))
		});
		await assertCurrent();
	}
	if (exact) {
		await requireGit(input.checkoutPath, [
			...snapshotIndexArgs,
			"read-tree",
			"--empty"
		], { env });
		await requireGit(input.checkoutPath, [
			...snapshotIndexArgs,
			"update-index",
			"-z",
			"--index-info"
		], {
			env,
			input: Buffer.concat(exact.treeEntries)
		});
	}
	const unchanged = prepared?.changed === false;
	const tree = unchanged ? await requireGit(input.checkoutPath, ["rev-parse", `${inventory.head}^{tree}`]) : await requireGit(input.checkoutPath, [...snapshotIndexArgs, "write-tree"], { env });
	const treePaths = unchanged ? inventory.headPaths : parseGitTreePaths(await requireGitBuffer(input.checkoutPath, [
		"ls-tree",
		"-r",
		"-z",
		tree
	]));
	assertNoProvisionedTreePaths(treePaths, input.provisionedPaths);
	const objects = await requireGitBuffer(input.checkoutPath, ["cat-file", "--batch-check=%(objectname) %(objecttype)"], { input: Buffer.from([...new Set(treePaths.filter((entry) => entry.mode !== "160000").map((entry) => entry.oid))].map((oid) => `${oid}\n`).join("")) });
	const missingObject = /^([a-f0-9]{40,64}) missing$/mu.exec(objects.toString("ascii"));
	if (missingObject) throw new Error(`Worktree snapshot has missing blob ${missingObject[1]}; repair the repository before retrying cleanup. Checkout preserved.`);
	const assertHeadCurrent = async () => {
		if (await requireGit(input.checkoutPath, [
			"rev-parse",
			"--verify",
			"HEAD^{commit}"
		]) !== inventory.head) throw new Error("Worktree HEAD changed while preparing its snapshot; retry cleanup.");
		await assertCurrent();
	};
	await assertHeadCurrent();
	const exactCommit = exact ? await writeExactStateCommit(input.checkoutPath, exact) : void 0;
	if (exact) await verifyExactStateSnapshot({
		...input,
		expectedDigest: exact.digest
	});
	const commit = await requireGit(input.checkoutPath, [
		...filemodeArgs,
		"commit-tree",
		tree,
		"-p",
		inventory.head,
		...exactCommit ? ["-p", exactCommit] : [],
		"-m",
		`OpenClaw worktree snapshot: ${input.reason}`
	], { env });
	await assertHeadCurrent();
	await requireGit(input.checkoutPath, [
		"update-ref",
		"--stdin",
		"-z"
	], { input: Buffer.from(`start\0verify HEAD\0${inventory.head}\0${input.exactState ? `verify refs/heads/${input.exactState.branch}\0${input.exactState.expected.branchHead}\0` : ""}update ${snapshotRef}\0${commit}\0\0prepare\0commit\0`) });
	return {
		snapshotRef,
		provisionedState,
		...exact ? { exactStateDigest: exact.digest } : {}
	};
}
async function verifyExactStateSnapshot(input) {
	if (!input.exactState) throw new Error("Exact-state verification requires captured authority");
	await assertCurrent();
	const inventory = await collectSnapshotInventory(input);
	const captured = await captureExactState({
		checkoutPath: input.checkoutPath,
		...input.exactState,
		paths: inventory.paths.values(),
		provisionedPaths: input.provisionedPaths,
		write: false
	});
	await assertCurrent();
	if (captured.digest !== input.expectedDigest) throw new Error("Worktree contents or metadata changed after exact-state capture; checkout preserved");
	return true;
}
async function inspectNestedRepository(checkoutPath) {
	const index = parseGitIndexPaths(await requireGitBuffer(checkoutPath, [
		"ls-files",
		"--stage",
		"-v",
		"-z"
	]));
	if (index.some((entry) => entry.mode === "160000")) return true;
	return await containsGitMarker(checkoutPath, index.map((entry) => entry.path)) || await inspectOtherPaths(checkoutPath, { unstattedIndexPaths: unstattedIndexPaths(index) });
}
//#endregion
//#region src/agents/worktrees/git-worktree-operations.runtime.ts
async function inspectProvisioning(sourceRoot) {
	const includePath = path.join(sourceRoot, ".worktreeinclude");
	if (!await worktreePathExists(includePath)) return {
		paths: [],
		estimatedBytes: 0
	};
	if (!(await fs$1.stat(includePath)).isFile()) throw new Error(".worktreeinclude must resolve to a regular file");
	const included = splitNullBuffer(await requireGitBuffer(sourceRoot, [
		"ls-files",
		"--others",
		"--ignored",
		`--exclude-from=${includePath}`,
		"-z"
	])).map((entry) => entry.toString("utf8"));
	const paths = [];
	for (const batch of gitPathspecBatches(included)) {
		const candidates = await requireGitBuffer(sourceRoot, [
			"--literal-pathspecs",
			"ls-files",
			"--others",
			"--ignored",
			"--exclude-standard",
			"-z",
			"--",
			...batch
		]);
		paths.push(...splitNullBuffer(candidates).map((entry) => entry.toString("utf8")));
	}
	let estimatedBytes = 0;
	for (const relativePath of paths) {
		const normalized = normalizeProvisionedRelativePath(relativePath);
		if (!normalized || !await hasSafeParentDirectories(sourceRoot, normalized)) continue;
		const stat = await lstatIfExists(resolveGitPath(sourceRoot, normalized));
		if (stat?.isFile()) estimatedBytes += Math.max(4096, stat.size);
	}
	return {
		paths,
		estimatedBytes
	};
}
async function inspectCleanup(input) {
	if (input.kind === "nested-repository") return { retainedReason: await inspectNestedRepository(input.checkoutPath) ? "nested-repository" : void 0 };
	if (input.kind === "provisioned") return { retainedReason: await hasUnsnapshotableProvisionedFiles(input.checkoutPath, input.provisionedPaths) ? "provisioned-drift" : void 0 };
	const status = await requireGitBuffer(input.checkoutPath, ["status", "--porcelain"]);
	const unpushed = await requireGitBuffer(input.checkoutPath, [
		"log",
		"HEAD",
		"--not",
		"--remotes",
		"--oneline"
	]);
	const drift = await hasUnsnapshotableProvisionedFiles(input.checkoutPath, input.provisionedPaths);
	return { retainedReason: status.toString("utf8").trim() ? "dirty" : unpushed.toString("utf8").trim() ? "unpushed" : drift ? "provisioned-drift" : await inspectNestedRepository(input.checkoutPath) ? "nested-repository" : void 0 };
}
async function executeGitWorktreeOperation(operation) {
	switch (operation.type) {
		case "worktree.eviction-source": return readWorktreeSourceDependencies(operation.input);
		case "worktree.eviction-repositories": return await prepareWorktreeEvictionRepositories(operation.input.repoRoots);
		case "worktree.eviction-classify": return await classifyWorktreeEvictions(operation.input.records);
		case "worktree.eviction-purge": return await purgeWorktreeCheckout(operation.input.record, operation.input.live);
		case "worktree.cleanup-fingerprint": return await readWorktreeCleanupFingerprint(operation.input.checkoutPath);
		case "worktree.snapshot-verify-exact": return await verifyExactStateSnapshot(operation.input);
		case "worktree.snapshot": return await snapshotWorktree(operation.input);
		case "worktree.provisioning-inspection": return await inspectProvisioning(operation.input.sourceRoot);
		case "worktree.cleanup-inspection": return await inspectCleanup(operation.input);
		case "worktree.git-size": return await estimateCheckoutObjectBytes(operation.input.repoRoot, operation.input.ref, operation.input.replacementRefBase, operation.input.preparationKey);
		case "worktree.checkout-transition-size": return await estimateCheckoutTransitionBytes(operation.input.repoRoot, operation.input.baseRef, operation.input.targetRef, operation.input.replacementRefBase);
		case "worktree.directory-size": return await measureDirectoryTreeBytes(operation.input.root, operation.input.excludeGit);
		default: throw new Error("Unknown managed-worktree Git operation");
	}
}
//#endregion
export { executeGitWorktreeOperation };
