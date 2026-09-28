import { w as root } from "./fs-safe-BAPek8At.mjs";
import { r as isMissingPathError } from "./errno-CkbDOfLk.mjs";
import "./errors-DnjwnOju.mjs";
import { i as requestGitWorkerEffect } from "./git-worker-context-Cywc-SH2.mjs";
import { c as normalizeGitPathForFilesystem, n as createGitCommandError, u as requireGitCommandOutput } from "./git-exec-B6ZpVpQV.mjs";
import { d as stagedInputPathDirectory, i as createStagedInputPathMatcher } from "./staged-inputs-De-HBXyz.mjs";
import { c as requireGit, d as runGit, f as runGitBuffered, l as requireGitBuffer, m as worktreePathExists, n as commandError, t as WORKTREE_CHECKOUT_TIMEOUT_MS } from "./git-DSwuA7YL.mjs";
import { a as parseGitIndexPaths, c as splitNullBuffer, i as gitPathspecBatches, n as containsGitMarker, o as parseGitTreePaths, r as gitPathKey, s as rawPathExists, t as checkoutPathFromGitBytes } from "./git-path-inventory-q-EbMqyF.mjs";
import { a as writeExactStateCommit, d as resolveGitPath, l as lstatIfExists, n as exactSnapshotPrefix, o as hasSafeParentDirectories, s as hasUnsnapshotableProvisionedFiles, t as captureExactState, u as normalizeProvisionedRelativePath } from "./snapshot-exact-state-XfDeSvpM.mjs";
import { constants } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
//#region src/agents/worktrees/capacity.runtime.ts
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
			remote,
			"--no-tags",
			"--no-write-fetch-head",
			"--recurse-submodules=no",
			"--stdin"
		], {
			input: Buffer.from(`${missing.join("\n")}\n`),
			timeoutMs: WORKTREE_CHECKOUT_TIMEOUT_MS
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
async function commitObjectBytes(repoRoot, commit, replacementRefBase) {
	const replacements = replacementRefBase === void 0 ? void 0 : await requireGit(repoRoot, [
		"for-each-ref",
		"--format=%(refname)",
		"--",
		replacementRefBase
	]);
	let cacheKey;
	if (replacements === "") {
		const canonicalRoot = await fs$1.realpath(repoRoot);
		const identity = await fs$1.stat(canonicalRoot);
		cacheKey = JSON.stringify([
			canonicalRoot,
			identity.dev,
			identity.ino,
			commit
		]);
		const cached = checkoutSizeFacts.get(cacheKey);
		if (cached !== void 0) return cached;
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
			checkoutSizeFacts.set(cacheKey, bytes);
			while (checkoutSizeFacts.size > MAX_CHECKOUT_SIZE_FACTS) checkoutSizeFacts.delete(checkoutSizeFacts.keys().next().value);
		}
		return bytes;
	} catch (error) {
		const remaining = await missingCommitObjects(repoRoot, commit);
		if (remaining.length > 0) throw missingObjectsError(commit, remaining.length);
		throw error;
	}
}
async function estimateCheckoutObjectBytes(repoRoot, ref, replacementRefBase) {
	const commit = await resolveCommit(repoRoot, ref);
	await hydrateCommitObjects(repoRoot, commit);
	return await commitObjectBytes(repoRoot, commit, replacementRefBase);
}
async function estimateCheckoutTransitionBytes(repoRoot, baseRef, targetRef, replacementRefBase) {
	const base = await resolveCommit(repoRoot, baseRef);
	const target = await resolveCommit(repoRoot, targetRef);
	await hydrateCommitObjects(repoRoot, base);
	if (target !== base) await hydrateCommitObjects(repoRoot, target);
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
		if (entry.isDirectory() && !entry.isSymbolicLink()) total += await measureDirectoryTreeBytes(child, excludeGit);
		else try {
			total += (await fs$1.lstat(child)).size;
		} catch (error) {
			if (!isMissingPathError(error)) throw error;
		}
	}
	return total;
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
		const stats = await Promise.allSettled(batch.map((entry) => fs$1.lstat(checkoutPathFromGitBytes(checkoutPath, entry))));
		for (const [index, result] of stats.entries()) if (result.status === "rejected") {
			if (!isMissingPathError(result.reason)) throw result.reason;
		} else if (result.value.isDirectory()) untracked.push(Buffer.concat([batch[index], Buffer.from("/")]));
	}
	const ignored = await listCollapsedOtherPaths(checkoutPath, true);
	if (await containsGitMarker(checkoutPath, [...untracked, ...ignored])) return true;
	const ignoredKeys = new Set(ignored.map((entry) => gitPathKey(entry.at(-1) === 47 ? entry.subarray(0, -1) : entry)));
	return await walkCollapsedPaths(checkoutPath, untracked, {
		visitFile: options.untracked,
		skip: ignoredKeys
	}) || await walkCollapsedPaths(checkoutPath, ignored, { visitFile: options.ignored });
}
async function rawDirectoryExists(target) {
	try {
		return (await fs$1.lstat(target)).isDirectory();
	} catch (error) {
		if (isMissingPathError(error)) return false;
		throw error;
	}
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
	if (sparseConfig.code !== 0 && sparseConfig.code !== 1) throw commandError("git config --bool core.sparseCheckout", sparseConfig);
	const sparse = sparseConfig.code === 0 && sparseConfig.stdout.trim() === "true";
	const sourcePaths = /* @__PURE__ */ new Set();
	const sparseCandidates = [];
	const headKeys = new Set(headPaths.map((entry) => gitPathKey(entry.path)));
	for (const entry of index) {
		sourcePaths.add(gitPathKey(entry.path));
		if (!headKeys.has(gitPathKey(entry.path)) && await rawDirectoryExists(checkoutPathFromGitBytes(input.checkoutPath, entry.path))) continue;
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
	if (await inspectOtherPaths(input.checkoutPath, {
		unstattedIndexPaths: unstattedIndexPaths(index),
		untracked: async (entry) => {
			add(entry);
		},
		ignored: async (entry) => {
			const relativePath = entry.toString("utf8");
			if (stagedInputPathDirectory(relativePath) && await isStagedInput(relativePath)) add(entry);
		}
	}) || await containsGitMarker(input.checkoutPath, paths.values())) throw new Error("nested git repositories cannot be snapshotted losslessly");
	return {
		head,
		headPaths,
		paths
	};
}
const snapshotIndexArgs = [
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
async function seedSnapshotIndex(input, inventory, indexEnv) {
	const source = path.resolve(input.checkoutPath, normalizeGitPathForFilesystem(await requireGit(input.checkoutPath, [
		"rev-parse",
		"--git-path",
		"index"
	])));
	const destination = indexEnv.GIT_INDEX_FILE;
	try {
		const stat = await fs$1.stat(source);
		await fs$1.copyFile(source, destination, constants.COPYFILE_FICLONE);
		const timestamp = Math.floor(stat.mtimeMs / 1e3);
		await fs$1.utimes(destination, timestamp, timestamp);
	} catch (error) {
		if (!isMissingPathError(error)) throw error;
	}
	await requireGit(input.checkoutPath, [
		...snapshotIndexArgs,
		"read-tree",
		"--reset",
		inventory.head
	], { env: indexEnv });
	const paths = Buffer.concat(inventory.headPaths.flatMap((entry) => [entry.path, Buffer.from([0])]));
	for (const flag of ["--no-assume-unchanged", "--no-skip-worktree"]) await requireGit(input.checkoutPath, [
		...snapshotIndexArgs,
		"update-index",
		flag,
		"-z",
		"--stdin"
	], {
		env: indexEnv,
		input: paths
	});
}
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
	await seedSnapshotIndex(input, inventory, indexEnv);
	const tracked = new Set(inventory.headPaths.map((entry) => gitPathKey(entry.path)));
	const changed = new Set(splitNullBuffer(await requireGitBuffer(input.checkoutPath, [
		...snapshotIndexArgs,
		"-c",
		"diff.autoRefreshIndex=true",
		"diff",
		"--no-ext-diff",
		"--no-textconv",
		"--no-renames",
		"--name-only",
		"-z",
		"--"
	], { env: indexEnv })).map(gitPathKey));
	const unique = new Map([...inventory.paths].filter(([key]) => changed.has(key) || !tracked.has(key)));
	for (const value of input.provisionedPaths) unique.set(gitPathKey(Buffer.from(value)), Buffer.from(value));
	const provisioned = new Set(input.provisionedPaths.map((value) => gitPathKey(Buffer.from(value))));
	const missing = /* @__PURE__ */ new Set();
	let gitBytes = 0;
	let provisionedBytes = 0;
	for (const [key, value] of unique) try {
		const stat = await fs$1.lstat(checkoutPathFromGitBytes(input.checkoutPath, value));
		if (provisioned.has(key)) provisionedBytes += stat.size;
		else gitBytes += stat.size;
	} catch (error) {
		if (!isMissingPathError(error)) throw error;
		if (tracked.has(key)) missing.add(key);
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
	return {
		missing,
		tracked
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
	const missing = prepared?.missing ?? /* @__PURE__ */ new Set();
	const tracked = prepared?.tracked ?? /* @__PURE__ */ new Set();
	const exact = input.exactState ? await captureExactState({
		checkoutPath: input.checkoutPath,
		...input.exactState,
		paths: inventory.paths.values(),
		provisionedPaths: input.provisionedPaths,
		write: true,
		temporaryDirectory
	}) : void 0;
	const provisionedState = await requestGitWorkerEffect({
		type: "worktree.snapshot-provisioned",
		input: exact ? { expected: {
			algorithm: exact.metadata.head.length === 64 ? "sha256" : "sha1",
			files: exact.metadata.files.filter((entry) => entry.provisioned).map((entry) => ({
				path: Buffer.from(entry.path, "hex").toString("utf8"),
				mode: entry.kind === "missing" ? null : entry.mode,
				size: entry.size,
				blob: entry.blob
			}))
		} } : {}
	});
	const missingPaths = [];
	const trackedPaths = [];
	const addedPaths = [];
	for (const [key, entry] of inventory.paths) if (missing.has(key)) missingPaths.push(entry);
	else if (tracked.has(key)) trackedPaths.push(entry);
	else addedPaths.push(entry);
	missingPaths.sort((left, right) => Buffer.compare(right, left));
	await assertCurrent();
	if (!exact) {
		await requireGit(input.checkoutPath, [
			...snapshotIndexArgs,
			"update-index",
			"--add",
			"--remove",
			"-z",
			"--stdin"
		], {
			env,
			input: Buffer.concat([
				...missingPaths,
				...trackedPaths,
				...addedPaths
			].flatMap((entry) => [entry, Buffer.from([0])]))
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
	const tree = await requireGit(input.checkoutPath, [...snapshotIndexArgs, "write-tree"], { env });
	assertNoProvisionedTreePaths(parseGitTreePaths(await requireGitBuffer(input.checkoutPath, [
		"ls-tree",
		"-r",
		"-z",
		tree
	])), input.provisionedPaths);
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
		case "worktree.snapshot-verify-exact": return await verifyExactStateSnapshot(operation.input);
		case "worktree.snapshot": return await snapshotWorktree(operation.input);
		case "worktree.provisioning-inspection": return await inspectProvisioning(operation.input.sourceRoot);
		case "worktree.cleanup-inspection": return await inspectCleanup(operation.input);
		case "worktree.git-size": return await estimateCheckoutObjectBytes(operation.input.repoRoot, operation.input.ref, operation.input.replacementRefBase);
		case "worktree.checkout-transition-size": return await estimateCheckoutTransitionBytes(operation.input.repoRoot, operation.input.baseRef, operation.input.targetRef, operation.input.replacementRefBase);
		case "worktree.directory-size": return await measureDirectoryTreeBytes(operation.input.root, operation.input.excludeGit);
		default: throw new Error("Unknown managed-worktree Git operation");
	}
}
//#endregion
export { executeGitWorktreeOperation };
