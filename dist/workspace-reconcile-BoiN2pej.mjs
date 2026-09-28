import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-BAPek8At.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { i as runCommandWithTimeout, n as runExec, t as runCommandBuffered } from "./exec-shcN2-sN.mjs";
import { c as stagedInputDirectoriesFromEntries, d as stagedInputPathDirectory, i as createStagedInputPathMatcher, o as isStagedInputPath } from "./staged-inputs-De-HBXyz.mjs";
import { i as MAX_RECONCILIATION_TOTAL_BYTES, r as MAX_RECONCILIATION_PACK_BYTES, t as MAX_RECONCILIATION_ENTRIES } from "./workspace-manifest-453LPGpv.mjs";
import { h as withWorkspaceHashMemo, m as withWorkspaceHashContext, r as activeWorkspaceHashContext } from "./workspace-hash-memo-R41irJvf.mjs";
import { a as sameEntry, n as hasPathAncestor, r as manifestNodes, t as changedPaths } from "./workspace-manifest-comparison-D9ne85OI.mjs";
import { _ as preflightWorkspaceApply, a as localPath, c as removeEmptyWorkspaceDirectory, i as entryMatches, l as captureWorkspaceManifest, n as directoryContainsOnlyDerivedWorkspaceEntries, o as localWorkspaceNode, r as directoryContainsOnlyJournalPaths, x as readWorkspaceNodes, y as prepareWorkspaceTreeInput } from "./workspace-reconcile-fs-0dRq_ghi.mjs";
import { n as reconciliationDirectories, r as reconciliationEntries, t as prepareNonDirectoryTargets } from "./workspace-reconcile-derived-paths-CvEilW1Q.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { createHash, randomBytes } from "node:crypto";
//#region src/gateway/worker-environments/workspace-reconcile-core.ts
var ConcurrentWorkspacePathError = class extends Error {};
async function assertWorkspaceMatchesManifest(params) {
	const root = await fs$1.realpath(params.root);
	const expectedNodes = params.entries ? params.entries : [...manifestNodes(params.manifest).values()].filter((entry) => entry !== void 0);
	const actual = await readWorkspaceNodes(root, expectedNodes.map((entry) => entry.path));
	for (const entry of expectedNodes) if (!sameEntry(actual.get(entry.path), entry)) throw new ConcurrentWorkspacePathError(`Gateway workspace changed after cloud dispatch: ${entry.path}`);
}
async function readActualWorkspaceManifest(params) {
	return await captureWorkspaceManifest(params);
}
async function inspectAcceptedWorkerWorkspace(params) {
	const root = await fs$1.realpath(params.root);
	const { memo: hashMemo, metrics } = activeWorkspaceHashContext() ?? {};
	const preserveDirectories = new Set(reconciliationDirectories(params.current.directories, stagedInputDirectoriesFromEntries(params.current.entries)));
	const includePaths = params.current.baseCommit ? /* @__PURE__ */ new Set([...manifestNodes(params.base).keys(), ...manifestNodes(params.current).keys()]) : void 0;
	const actual = await readActualWorkspaceManifest({
		root,
		baseCommit: params.current.baseCommit,
		preserveDirectories,
		includePaths
	});
	if (actual.manifestRef !== params.expectedManifestRef && !params.allowAdvancedLocalState) return;
	const preflight = await preflightWorkspaceApply({
		root,
		base: params.base,
		current: params.current
	});
	const conflictPaths = params.allowAdvancedLocalState ? retainedConflictPaths(preflight) : preflight.conflictPaths;
	const verifyLocalStable = async () => await assertActualWorkspaceManifest({
		root,
		expectedRef: actual.manifestRef,
		baseCommit: actual.manifest.baseCommit,
		preserveDirectories,
		includePaths
	});
	return {
		...actual,
		conflictPaths,
		verifyLocalStable: async () => hashMemo ? await withWorkspaceHashMemo(hashMemo, verifyLocalStable, metrics) : await verifyLocalStable()
	};
}
async function assertActualWorkspaceManifest(params) {
	if ((await readActualWorkspaceManifest(params)).manifestRef !== params.expectedRef) throw new ConcurrentWorkspacePathError("Gateway workspace changed after cloud reconciliation");
}
async function applyWorkspaceDirectoryChanges(params) {
	const workspaceRoot = await root(params.root, { mode: 448 });
	const baseNodes = manifestNodes(params.base);
	const currentNodes = manifestNodes(params.current);
	const directoryPaths = [...params.applyPaths].filter((entryPath) => baseNodes.get(entryPath)?.type === "directory" || currentNodes.get(entryPath)?.type === "directory");
	for (const entryPath of directoryPaths.toSorted()) if (currentNodes.get(entryPath)?.type === "directory") await workspaceRoot.mkdir(entryPath);
	const removedDirectoryPaths = directoryPaths.filter((entryPath) => baseNodes.get(entryPath)?.type === "directory" && !currentNodes.has(entryPath));
	for (const entryPath of removedDirectoryPaths.toSorted((left, right) => right.localeCompare(left))) {
		const baseDirectory = baseNodes.get(entryPath);
		let directoryState;
		try {
			directoryState = await workspaceRoot.stat(entryPath);
		} catch (error) {
			if (error instanceof FsSafeError && ["not-found", "path-alias"].includes(error.code)) continue;
			throw error;
		}
		if (!directoryState.isDirectory || baseDirectory?.type !== "directory") continue;
		await removeEmptyWorkspaceDirectory(workspaceRoot, entryPath);
	}
}
function hasReplacedBaseEntryAncestor(entryPath, baseByPath, currentByPath) {
	const segments = entryPath.split("/");
	for (let index = 1; index < segments.length; index += 1) {
		const ancestor = segments.slice(0, index).join("/");
		const baseEntry = baseByPath.get(ancestor);
		if (baseEntry && !sameEntry(baseEntry, currentByPath.get(ancestor))) return true;
	}
	return false;
}
function retainedConflictPaths(preflight, originalApplyPaths) {
	const retainedApplyPaths = [...preflight.applyPaths].filter((entryPath) => !originalApplyPaths?.has(entryPath) || !preflight.conflictPaths.some((conflictPath) => conflictPath.startsWith(`${entryPath}/`)));
	const conflicts = /* @__PURE__ */ new Set([...preflight.conflictPaths, ...retainedApplyPaths]);
	const blockingConflicts = new Set(preflight.blockingConflictPaths);
	return [...conflicts].filter((entryPath) => !hasPathAncestor(blockingConflicts, entryPath)).toSorted();
}
//#endregion
//#region src/gateway/worker-environments/workspace-reconcile-recovery.ts
const PATCH_TIMEOUT_MS = 6e5;
async function requireGit(cwd, args, input, env) {
	const result = await runCommandWithTimeout([
		"git",
		"-C",
		cwd,
		...args
	], {
		timeoutMs: PATCH_TIMEOUT_MS,
		...input ? { input } : {},
		...env ? { env } : {},
		maxOutputBytes: 1048576
	});
	if (result.termination !== "exit" || result.code !== 0) throw new Error((result.stderr || result.stdout || `git ${args[0]} failed`).trim());
	return result.stdout.trim();
}
async function writeRawWorkspaceTree(params) {
	const ref = `refs/heads/openclaw-snapshot-${randomBytes(16).toString("hex")}`;
	const inputPath = path.join(params.repositoryRoot, ".git", "snapshot-input");
	try {
		await prepareWorkspaceTreeInput({
			...params,
			inputPath,
			ref
		});
		const input = await fs$1.open(inputPath, "r");
		try {
			await runExec("git", [
				"-C",
				params.repositoryRoot,
				"fast-import",
				"--quiet"
			], {
				stdinFileDescriptor: input.fd,
				timeoutMs: PATCH_TIMEOUT_MS,
				maxBuffer: 1048576
			});
		} finally {
			await input.close();
		}
		return await requireGit(params.repositoryRoot, ["rev-parse", `${ref}^{tree}`]);
	} finally {
		await fs$1.rm(inputPath, { force: true });
	}
}
async function readWorkspacePatch(root, baseTree, currentTree) {
	const patchPath = path.join(root, ".git", "workspace.patch");
	const output = await fs$1.open(patchPath, "wx", 384);
	let bytes = 0;
	let limitExceeded = false;
	try {
		const diff = await runCommandWithTimeout([
			"git",
			"-C",
			root,
			"diff",
			"--binary",
			"--full-index",
			"--no-renames",
			baseTree,
			currentTree,
			"--"
		], {
			timeoutMs: PATCH_TIMEOUT_MS,
			killProcessTree: true,
			outputCapture: {
				stdout: "discard",
				stderr: "head"
			},
			maxOutputBytes: {
				stdout: MAX_RECONCILIATION_TOTAL_BYTES,
				stderr: 1048576
			},
			terminateOnOutputLimit: true,
			onOutputChunk: (chunk, stream) => {
				if (stream !== "stdout") return true;
				if (bytes + chunk.byteLength > 805306368) {
					limitExceeded = true;
					return false;
				}
				let offset = 0;
				while (offset < chunk.byteLength) {
					const written = fs.writeSync(output.fd, chunk, offset, chunk.byteLength - offset);
					if (written === 0) throw new Error("Cloud workspace patch write made no progress");
					offset += written;
				}
				bytes += chunk.byteLength;
				return true;
			}
		});
		if (limitExceeded) throw new Error("Cloud workspace patch exceeds its byte limit");
		if (diff.termination !== "exit" || diff.code !== 0) throw new Error(diff.stderr.trim() || "git diff failed");
	} finally {
		await output.close();
	}
	return await fs$1.readFile(patchPath);
}
async function createWorkspacePatch(params) {
	const temporary = await fs$1.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-workspace-patch-"));
	try {
		await requireGit(temporary, [
			"init",
			"--quiet",
			"--object-format=sha1"
		]);
		let bytes = 0;
		for (const entry of params.baseEntries) {
			if (entry.type === "file") {
				if (entry.size > 67108864) throw new Error(`Cloud workspace rollback file is too large: ${entry.path}`);
			}
			bytes += entry.type === "file" ? entry.size : Buffer.byteLength(entry.target);
			if (bytes > 805306368) throw new Error("Cloud workspace rollback exceeds its byte limit");
		}
		const baseTree = await writeRawWorkspaceTree({
			repositoryRoot: temporary,
			entries: params.baseEntries,
			source: { root: params.root }
		});
		const packed = await runCommandBuffered([
			"git",
			"-C",
			temporary,
			"pack-objects",
			"--stdout",
			"--revs"
		], {
			input: Buffer.from(`${baseTree}\n`),
			timeoutMs: PATCH_TIMEOUT_MS,
			maxOutputBytes: {
				stdout: MAX_RECONCILIATION_PACK_BYTES + 1,
				stderr: 1048576
			}
		});
		if (packed.termination !== "exit" || packed.code !== 0) throw new Error(packed.stderr.toString("utf8").trim() || "git pack-objects failed");
		if (packed.stdout.byteLength > 268435456) throw new Error("Cloud workspace recovery snapshot exceeds its byte limit");
		return {
			patch: await readWorkspacePatch(temporary, baseTree, await writeRawWorkspaceTree({
				repositoryRoot: temporary,
				entries: params.appliedEntries,
				source: { root: params.stagingRoot }
			})),
			baseTree,
			basePack: packed.stdout
		};
	} finally {
		await fs$1.rm(temporary, {
			recursive: true,
			force: true
		});
	}
}
async function applyWorkspacePatch(params) {
	if (params.patch.byteLength === 0) return;
	const temporary = await fs$1.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-no-git-"));
	try {
		await requireGit(params.root, [
			"-c",
			"core.autocrlf=false",
			"apply",
			"--no-index",
			"--binary",
			"--whitespace=nowarn",
			...params.reverse ? ["--reverse"] : []
		], params.patch, { GIT_DIR: path.join(temporary, ".git") });
	} finally {
		await fs$1.rm(temporary, {
			recursive: true,
			force: true
		});
	}
}
function validateJournalSnapshot(journal) {
	if (journal.basePack.byteLength > 268435456 || !/^[a-f0-9]{40}$/u.test(journal.baseTree) || createHash("sha256").update(journal.basePack).digest("hex") !== journal.basePackSha256) throw new Error("Cloud workspace reconciliation recovery snapshot is invalid");
}
async function createWorkspaceRecoveryPatch(params) {
	const temporary = await fs$1.mkdtemp(path.join(resolvePreferredOpenClawTmpDir(), "openclaw-workspace-recovery-"));
	try {
		await requireGit(temporary, [
			"init",
			"--quiet",
			"--object-format=sha1"
		]);
		await requireGit(temporary, ["index-pack", "--stdin"], params.journal.basePack);
		await requireGit(temporary, [
			"cat-file",
			"-e",
			`${params.journal.baseTree}^{tree}`
		]);
		const baseEntries = params.journal.baseEntries;
		const appliedEntries = params.journal.appliedEntries;
		const baseByPath = new Map(baseEntries.map((entry) => [entry.path, entry]));
		const appliedByPath = new Map(appliedEntries.map((entry) => [entry.path, entry]));
		const paths = /* @__PURE__ */ new Set([...baseByPath.keys(), ...appliedByPath.keys()]);
		const directories = /* @__PURE__ */ new Set();
		for (const entryPath of paths) {
			const segments = entryPath.split("/");
			for (let index = 1; index < segments.length; index += 1) directories.add(segments.slice(0, index).join("/"));
		}
		const actualEntries = [];
		const actualNodes = await readWorkspaceNodes(params.root, [...paths]);
		for (const entryPath of [...paths].toSorted()) {
			const actual = actualNodes.get(entryPath);
			if (!actual) {
				const baseEntry = baseByPath.get(entryPath);
				const appliedEntry = appliedByPath.get(entryPath);
				if (baseEntry && appliedEntry) throw new ConcurrentWorkspacePathError(`Gateway workspace changed while cloud recovery was pending: ${entryPath}`);
				continue;
			}
			const baseEntry = baseByPath.get(entryPath);
			const appliedEntry = appliedByPath.get(entryPath);
			if (baseEntry && sameEntry(actual, baseEntry)) {
				actualEntries.push(baseEntry);
				continue;
			}
			if (appliedEntry && sameEntry(actual, appliedEntry)) {
				actualEntries.push(appliedEntry);
				continue;
			}
			if (!(actual.type === "directory" && (directories.has(entryPath) && await directoryContainsOnlyJournalPaths(params.root, entryPath, paths, directories, params.isRetainedInput) || await directoryContainsOnlyDerivedWorkspaceEntries(params.root, entryPath, params.isRetainedInput)))) throw new ConcurrentWorkspacePathError(`Gateway workspace changed while cloud recovery was pending: ${entryPath}`);
		}
		return await readWorkspacePatch(temporary, await writeRawWorkspaceTree({
			repositoryRoot: temporary,
			entries: actualEntries,
			source: { root: params.root }
		}), params.filteredBaseTree ? await writeRawWorkspaceTree({
			repositoryRoot: temporary,
			entries: baseEntries,
			source: {
				root: temporary,
				tree: params.journal.baseTree
			}
		}) : params.journal.baseTree);
	} finally {
		await fs$1.rm(temporary, {
			recursive: true,
			force: true
		});
	}
}
async function assertWorkspaceRecoveryBase(params) {
	const baseEntries = params.journal.baseEntries;
	const appliedEntries = params.journal.appliedEntries;
	await assertWorkspaceMatchesManifest({
		root: params.root,
		manifest: {
			version: 1,
			baseCommit: null,
			entries: params.journal.baseEntries
		},
		entries: baseEntries
	});
	const baseDirectoryPaths = new Set(params.journal.baseDirectories ?? []);
	const appliedDirectoryPaths = new Set(params.journal.appliedDirectories ?? []);
	for (const entryPath of baseDirectoryPaths) if ((await localWorkspaceNode(params.root, entryPath))?.type !== "directory") throw new ConcurrentWorkspacePathError(`Gateway workspace changed while cloud recovery was pending: ${entryPath}`);
	const basePaths = new Set(baseEntries.map((entry) => entry.path));
	const baseDirectories = /* @__PURE__ */ new Set();
	for (const entryPath of basePaths) {
		const segments = entryPath.split("/");
		for (let index = 1; index < segments.length; index += 1) baseDirectories.add(segments.slice(0, index).join("/"));
	}
	for (const entry of appliedEntries) {
		if (basePaths.has(entry.path)) continue;
		const existing = await fs$1.lstat(localPath(params.root, entry.path)).catch(() => void 0);
		if (existing?.isDirectory() && !existing.isSymbolicLink() && baseDirectories.has(entry.path) && await directoryContainsOnlyJournalPaths(params.root, entry.path, basePaths, baseDirectories, params.isRetainedInput)) continue;
		if (existing) throw new ConcurrentWorkspacePathError(`Gateway workspace changed while cloud recovery was pending: ${entry.path}`);
	}
	for (const entryPath of appliedDirectoryPaths) {
		if (baseDirectoryPaths.has(entryPath) || basePaths.has(entryPath)) continue;
		const node = await localWorkspaceNode(params.root, entryPath);
		if (node && !(node.type === "directory" && await directoryContainsOnlyDerivedWorkspaceEntries(params.root, entryPath, params.isRetainedInput))) throw new ConcurrentWorkspacePathError(`Gateway workspace changed while cloud recovery was pending: ${entryPath}`);
	}
}
async function assertWorkspaceRecoveryDirectoriesRecoverable(params) {
	const baseDirectories = new Set(params.journal.baseDirectories ?? []);
	const appliedDirectories = new Set(params.journal.appliedDirectories ?? []);
	const baseEntries = new Map(params.journal.baseEntries.map((entry) => [entry.path, entry]));
	const appliedEntries = new Map(params.journal.appliedEntries.map((entry) => [entry.path, entry]));
	const appliedEntryPaths = new Set(appliedEntries.keys());
	const directoryPaths = /* @__PURE__ */ new Set([...baseDirectories, ...appliedDirectories]);
	for (const entryPath of directoryPaths) {
		const local = await localWorkspaceNode(params.root, entryPath);
		if (local?.type === "directory") {
			if (baseEntries.has(entryPath) && appliedDirectories.has(entryPath) && !await directoryContainsOnlyJournalPaths(params.root, entryPath, appliedEntryPaths, appliedDirectories, params.isRetainedInput)) throw new ConcurrentWorkspacePathError(`Gateway workspace changed while cloud recovery was pending: ${entryPath}`);
			continue;
		}
		if (!local) {
			if (baseDirectories.has(entryPath) && appliedDirectories.has(entryPath)) throw new ConcurrentWorkspacePathError(`Gateway workspace changed while cloud recovery was pending: ${entryPath}`);
			continue;
		}
		const baseEntry = baseEntries.get(entryPath);
		const appliedEntry = appliedEntries.get(entryPath);
		if (baseEntry && await entryMatches(params.root, baseEntry) || appliedEntry && await entryMatches(params.root, appliedEntry)) continue;
		throw new ConcurrentWorkspacePathError(`Gateway workspace changed while cloud recovery was pending: ${entryPath}`);
	}
}
async function restoreWorkspaceJournalDirectories(params) {
	const workspaceRoot = await root(params.root, { mode: 448 });
	const baseDirectories = params.journal.baseDirectories ?? [];
	const appliedDirectories = new Set(params.journal.appliedDirectories ?? []);
	for (const entryPath of baseDirectories.toSorted()) await workspaceRoot.mkdir(entryPath);
	const baseDirectoryPaths = new Set(baseDirectories);
	const baseEntryPaths = new Set(params.journal.baseEntries.map((entry) => entry.path));
	for (const entryPath of [...appliedDirectories].toSorted((left, right) => right.localeCompare(left))) {
		if (baseDirectoryPaths.has(entryPath) || baseEntryPaths.has(entryPath)) continue;
		await removeEmptyWorkspaceDirectory(workspaceRoot, entryPath);
	}
}
async function recoverWorkerWorkspaceReconciliation(params) {
	if (params.journal.appliedManifestRef) throw new Error("Cloud workspace result is already applied and awaits fence acceptance");
	if (params.preservePaths?.size) throw new Error("Cloud workspace patch recovery cannot preserve partial paths");
	const root$2 = await fs$1.realpath(params.root);
	validateJournalSnapshot(params.journal);
	const matchesLiveInput = createStagedInputPathMatcher(await root(root$2));
	const journalEntries = [...params.journal.baseEntries, ...params.journal.appliedEntries];
	const stagedInputDirectories = stagedInputDirectoriesFromEntries(journalEntries);
	const journalPaths = [
		...journalEntries.map((entry) => entry.path),
		...params.journal.baseDirectories ?? [],
		...params.journal.appliedDirectories ?? []
	];
	for (const entryPath of journalPaths) {
		const directory = stagedInputPathDirectory(entryPath);
		if (directory && !stagedInputDirectories.has(directory) && await matchesLiveInput(entryPath)) stagedInputDirectories.add(directory);
	}
	const journal = {
		...params.journal,
		baseEntries: reconciliationEntries(params.journal.baseEntries, stagedInputDirectories),
		appliedEntries: reconciliationEntries(params.journal.appliedEntries, stagedInputDirectories),
		baseDirectories: reconciliationDirectories(params.journal.baseDirectories, stagedInputDirectories),
		appliedDirectories: reconciliationDirectories(params.journal.appliedDirectories, stagedInputDirectories)
	};
	const isRetainedInput = async (relative) => isStagedInputPath(relative, stagedInputDirectories) || await matchesLiveInput(relative);
	const recovery = {
		root: root$2,
		journal,
		isRetainedInput,
		filteredBaseTree: journal.baseEntries.length !== params.journal.baseEntries.length
	};
	try {
		await assertWorkspaceRecoveryBase(recovery);
		return;
	} catch {}
	await assertWorkspaceRecoveryDirectoriesRecoverable(recovery);
	const recoveryPatch = await createWorkspaceRecoveryPatch(recovery);
	await prepareNonDirectoryTargets(root$2, journal.baseEntries, isRetainedInput);
	await applyWorkspacePatch({
		root: root$2,
		patch: recoveryPatch
	});
	await restoreWorkspaceJournalDirectories(recovery);
	await assertWorkspaceRecoveryBase(recovery);
}
//#endregion
//#region src/gateway/worker-environments/workspace-accepted-publication.ts
const SETTLEMENT_OUTCOMES = /* @__PURE__ */ new Set([
	"begun",
	"rolled-back",
	"applied",
	"committed"
]);
var AcceptedWorkspacePublicationIndeterminateError = class extends Error {
	constructor(operation, publicationFailure, observationFailure) {
		super("Accepted workspace publication is indeterminate and requires recovery", { cause: publicationFailure });
		this.operation = operation;
		this.name = "AcceptedWorkspacePublicationIndeterminateError";
		Object.defineProperty(this, "observationFailure", { value: observationFailure });
	}
};
function isAcceptedWorkspacePublicationIndeterminateError(error) {
	return error instanceof AcceptedWorkspacePublicationIndeterminateError;
}
function parseAcceptedWorkspaceSettlement(stdout) {
	const lines = stdout.split(/\r?\n/u).filter(Boolean);
	if (lines.length !== 1) throw new Error("Worker returned an invalid accepted workspace settlement outcome");
	let value;
	try {
		value = JSON.parse(lines[0]);
	} catch (error) {
		throw new Error("Worker returned an invalid accepted workspace settlement outcome", { cause: error });
	}
	if (!isRecord(value) || Object.keys(value).length !== 2 || value.version !== 1 || typeof value.outcome !== "string" || !SETTLEMENT_OUTCOMES.has(value.outcome)) throw new Error("Worker returned an invalid accepted workspace settlement outcome");
	return value.outcome;
}
//#endregion
//#region src/gateway/worker-environments/workspace-reconcile-apply.ts
async function applyStagedWorkerWorkspace(params) {
	return await withWorkspaceHashContext(async () => await applyStagedWorkerWorkspaceWithMemo(params));
}
async function applyStagedWorkerWorkspaceWithMemo(params) {
	const { memo: hashMemo, metrics } = activeWorkspaceHashContext();
	const root$1 = await fs$1.realpath(params.root);
	const stagedInputDirectories = stagedInputDirectoriesFromEntries(params.current.entries);
	const baseNodes = manifestNodes(params.base);
	const currentNodes = manifestNodes(params.current);
	const changed = changedPaths(params.base, params.current);
	const acceptance = params.acceptance;
	const acceptExactTarget = async (verify) => {
		await verify();
		params.journal.commit(params.currentManifestRef);
		return {
			manifest: params.current,
			manifestRef: params.currentManifestRef,
			conflictPaths: [],
			verifyLocalStable: verify
		};
	};
	const assertInputOwnership = async () => {
		if (stagedInputDirectories.size === 0) return;
		const workspaceRoot = await root(root$1);
		const isRetainedInput = createStagedInputPathMatcher(workspaceRoot);
		const unownedInputDirectories = /* @__PURE__ */ new Set();
		for (const directory of stagedInputDirectories) if (await workspaceRoot.exists(directory) && !await isRetainedInput(directory)) unownedInputDirectories.add(directory);
		for (const entryPath of currentNodes.keys()) {
			const directory = stagedInputPathDirectory(entryPath);
			if (!directory || !unownedInputDirectories.has(directory)) continue;
			const changesMarker = entryPath === `${directory}/.gitignore` && changed.has(entryPath);
			const selectsLocalPath = !baseNodes.has(entryPath) && await workspaceRoot.exists(entryPath);
			if (changesMarker || selectsLocalPath) throw new ConcurrentWorkspacePathError(`Cloud input conflicts with an unowned Gateway directory: ${directory}. Keep the project directory unchanged and reattach the input.`);
		}
	};
	await assertInputOwnership();
	const preserveDirectories = new Set(reconciliationDirectories(params.current.directories, stagedInputDirectories));
	const includePaths = params.current.baseCommit ? /* @__PURE__ */ new Set([...baseNodes.keys(), ...currentNodes.keys()]) : void 0;
	const createApplyResult = (actual, conflictPaths) => ({
		...actual,
		conflictPaths,
		verifyLocalStable: async () => await withWorkspaceHashMemo(hashMemo, async () => await assertActualWorkspaceManifest({
			root: root$1,
			expectedRef: actual.manifestRef,
			baseCommit: actual.manifest.baseCommit,
			preserveDirectories,
			includePaths
		}), metrics)
	});
	const inspectPaths = () => preflightWorkspaceApply({
		root: root$1,
		base: params.base,
		current: params.current
	});
	const preflight = await inspectPaths();
	if (changed.size === 0) {
		if (acceptance.kind === "exact-target") return await acceptExactTarget(acceptance.verify);
		const actual = await readActualWorkspaceManifest({
			root: root$1,
			baseCommit: params.current.baseCommit,
			preserveDirectories,
			includePaths
		});
		await assertActualWorkspaceManifest({
			root: root$1,
			expectedRef: actual.manifestRef,
			baseCommit: actual.manifest.baseCommit,
			preserveDirectories,
			includePaths
		});
		const conflictPaths = retainedConflictPaths(preflight, preflight.applyPaths);
		await acceptance.publish?.({
			...actual,
			conflictPaths
		});
		params.journal.commit(actual.manifestRef);
		return createApplyResult(actual, conflictPaths);
	}
	const baseByPath = new Map(reconciliationEntries(params.base.entries).map((entry) => [entry.path, entry]));
	const currentByPath = new Map(reconciliationEntries(params.current.entries).map((entry) => [entry.path, entry]));
	const baseEntries = reconciliationEntries(params.base.entries).filter((entry) => changed.has(entry.path) && preflight.applyPaths.has(entry.path));
	const appliedEntries = [];
	for (const entry of reconciliationEntries(params.current.entries)) {
		if (!changed.has(entry.path) || !preflight.applyPaths.has(entry.path)) continue;
		if (!baseByPath.has(entry.path) && !hasReplacedBaseEntryAncestor(entry.path, baseByPath, currentByPath) && await entryMatches(root$1, entry)) continue;
		appliedEntries.push(entry);
	}
	const baseDirectories = [...preflight.applyPaths].filter((entryPath) => baseNodes.get(entryPath)?.type === "directory").toSorted();
	const appliedDirectories = [...preflight.applyPaths].filter((entryPath) => currentNodes.get(entryPath)?.type === "directory").toSorted();
	if (baseEntries.length + appliedEntries.length + baseDirectories.length + appliedDirectories.length > MAX_RECONCILIATION_ENTRIES) throw new Error(`Cloud workspace reconciliation exceeds the ${MAX_RECONCILIATION_ENTRIES} entry limit`);
	const snapshot = await createWorkspacePatch({
		root: root$1,
		stagingRoot: params.stagingRoot,
		baseEntries,
		appliedEntries
	});
	const confirmedPreflight = await inspectPaths();
	if (JSON.stringify([...confirmedPreflight.applyPaths].toSorted()) !== JSON.stringify([...preflight.applyPaths].toSorted()) || JSON.stringify(confirmedPreflight.conflictPaths) !== JSON.stringify(preflight.conflictPaths) || JSON.stringify(confirmedPreflight.blockingConflictPaths) !== JSON.stringify(preflight.blockingConflictPaths)) throw new ConcurrentWorkspacePathError("Gateway workspace changed while cloud reconciliation was being prepared");
	await assertInputOwnership();
	const journal = {
		version: 1,
		temporaryNonce: randomBytes(16).toString("hex"),
		baseManifestRef: params.baseManifestRef,
		currentManifestRef: params.currentManifestRef,
		baseEntries,
		appliedEntries,
		baseDirectories,
		appliedDirectories,
		baseTree: snapshot.baseTree,
		basePackSha256: createHash("sha256").update(snapshot.basePack).digest("hex"),
		basePack: snapshot.basePack
	};
	params.journal.begin(journal);
	try {
		await prepareNonDirectoryTargets(root$1, appliedEntries);
		await applyWorkspacePatch({
			root: root$1,
			patch: snapshot.patch
		});
		await applyWorkspaceDirectoryChanges({
			root: root$1,
			base: params.base,
			current: params.current,
			applyPaths: preflight.applyPaths
		});
		if (acceptance.kind === "exact-target") await inspectPaths();
		else {
			const actual = await readActualWorkspaceManifest({
				root: root$1,
				baseCommit: params.current.baseCommit,
				preserveDirectories,
				includePaths
			});
			const finalPreflight = await inspectPaths();
			await assertActualWorkspaceManifest({
				root: root$1,
				expectedRef: actual.manifestRef,
				baseCommit: actual.manifest.baseCommit,
				preserveDirectories,
				includePaths
			});
			const conflictPaths = retainedConflictPaths(finalPreflight, preflight.applyPaths);
			await acceptance.publish?.({
				...actual,
				conflictPaths
			});
			params.journal.commit(actual.manifestRef);
			return createApplyResult(actual, conflictPaths);
		}
	} catch (error) {
		if (isAcceptedWorkspacePublicationIndeterminateError(error)) throw error;
		try {
			await recoverWorkerWorkspaceReconciliation({
				root: root$1,
				journal
			});
			params.journal.abort();
		} catch (rollbackError) {
			const recoveryError = new Error("Cloud reconciliation failed and rollback needs recovery", { cause: error });
			Object.defineProperty(recoveryError, "rollbackError", { value: rollbackError });
			throw recoveryError;
		}
		throw error;
	}
	return await acceptExactTarget(acceptance.verify);
}
//#endregion
export { recoverWorkerWorkspaceReconciliation as a, parseAcceptedWorkspaceSettlement as i, AcceptedWorkspacePublicationIndeterminateError as n, assertWorkspaceMatchesManifest as o, isAcceptedWorkspacePublicationIndeterminateError as r, inspectAcceptedWorkerWorkspace as s, applyStagedWorkerWorkspace as t };
