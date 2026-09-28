import { t as FsSafeError } from "./fs-safe-BAPek8At.mjs";
import { t as hasNodeErrorCode } from "./path-guards-D5kuI0Tv.mjs";
import { r as WorkerTaskError } from "./worker-task-pool-cppt7dT0.mjs";
import { n as hasGitWorkerContext } from "./git-worker-context-Cywc-SH2.mjs";
import { r as isManagedSandboxSkillsPath } from "./sandbox-workspace-paths-UF9Y-Qu5.mjs";
import { h as isDerivedWorkspacePath, n as MAX_RECONCILIATION_FILE_BYTES } from "./workspace-manifest-453LPGpv.mjs";
import { r as activeWorkspaceHashContext, s as pruneWorkspaceHashMemo } from "./workspace-hash-memo-R41irJvf.mjs";
import { f as runGitBuffered } from "./git-DSwuA7YL.mjs";
import { t as runGitWorkerOperation } from "./git-worker-Da8RAwNx.mjs";
import { c as stagedWorkspaceEntryBytes, s as resolveStagedWorkspaceReadEntry } from "./workspace-result-inventory-TtCqUwu3.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
//#region src/gateway/worker-environments/workspace-manifest-worker.ts
function encodeManifestValue(input) {
	return { payload: new TextEncoder().encode(JSON.stringify(input)) };
}
function computationInputBytes(command) {
	const bytes = 256;
	switch (command.type) {
		case "workspace.manifest.capture":
		case "workspace.manifest.snapshot":
		case "workspace.manifest.file":
		case "workspace.manifest.nodes": return bytes + command.input.payload.byteLength;
		case "workspace.manifest.parse": return bytes + command.input.raw.byteLength;
		case "workspace.manifest.pair": return bytes + command.input.baseRaw.byteLength + command.input.currentRaw.byteLength;
		case "workspace.manifest.stage-input": return bytes + command.input.baseManifestRaw.byteLength + command.input.currentManifestRaw.byteLength;
		case "workspace.manifest.serialize":
		case "workspace.reconcile.preflight":
		case "workspace.manifest.overlay":
		case "workspace.manifest.tree-input": return bytes + command.input.payload.byteLength;
		case "workspace.manifest.staged": return bytes + (command.input.root.length + command.input.ref.length) * 2;
		case "workspace.manifest.entries": return bytes + command.input.root.length * 2 + command.input.entries.reduce((total, { object, entry }) => total + (object.objectId.length + object.mode.length + entry.path.length) * 2 + (entry.type === "symlink" ? entry.target.length * 2 : 128), 0);
	}
	throw new Error("Unsupported workspace computation");
}
function transferableManifestInput(command) {
	switch (command.type) {
		case "workspace.manifest.capture":
		case "workspace.manifest.snapshot":
		case "workspace.manifest.file":
		case "workspace.manifest.nodes": return [command.input.payload.buffer];
		case "workspace.manifest.parse": return [command.input.raw.buffer];
		case "workspace.manifest.pair": return [command.input.baseRaw.buffer, command.input.currentRaw.buffer];
		case "workspace.manifest.stage-input": return [command.input.baseManifestRaw.buffer, command.input.currentManifestRaw.buffer];
		case "workspace.manifest.serialize":
		case "workspace.reconcile.preflight":
		case "workspace.manifest.overlay":
		case "workspace.manifest.tree-input": return [command.input.payload.buffer];
		default: return [];
	}
}
async function compute(command, signal) {
	if (hasGitWorkerContext()) {
		const { executeWorkspaceManifestComputation } = await import("./workspace-manifest-computation.runtime.js");
		return await executeWorkspaceManifestComputation(command);
	}
	return await runGitWorkerOperation(command, {
		signal,
		inputBytes: computationInputBytes(command),
		transferList: transferableManifestInput
	});
}
function captureHashes(includeMemo = true) {
	const context = activeWorkspaceHashContext();
	if (context && includeMemo) pruneWorkspaceHashMemo(context.memo);
	return {
		hashes: context ? {
			owner: context.owner,
			entries: includeMemo ? [...context.memo] : []
		} : void 0,
		accept(result) {
			if (context) {
				for (const [identity, digest] of result.hashes) context.memo.set(identity, digest);
				pruneWorkspaceHashMemo(context.memo);
				if (context.metrics) {
					context.metrics.contentHashCount += result.metrics.contentHashCount;
					context.metrics.contentHashDurationMs += result.metrics.contentHashDurationMs;
					context.metrics.memoHitCount += result.metrics.memoHitCount;
				}
			}
			return result.value;
		}
	};
}
async function captureWorkspaceManifest(params) {
	const { root, baseCommit, preserveDirectories, includePaths, signal } = params;
	const input = {
		root,
		baseCommit,
		preserveDirectories,
		includePaths
	};
	if (hasGitWorkerContext()) {
		const { readActualWorkspaceManifestImpl } = await import("./workspace-actual-manifest-Cyx9bg1e.mjs");
		const { manifest, manifestRef } = await readActualWorkspaceManifestImpl({
			...input,
			signal
		});
		return {
			manifest,
			manifestRef
		};
	}
	signal?.throwIfAborted();
	const hashes = captureHashes();
	return hashes.accept(await compute({
		type: "workspace.manifest.capture",
		input: encodeManifestValue({
			root,
			baseCommit,
			includePaths: includePaths === void 0 ? void 0 : [...includePaths],
			preserveDirectories: preserveDirectories === void 0 ? void 0 : [...preserveDirectories],
			hashes: hashes.hashes
		})
	}, signal));
}
async function captureWorkspaceSnapshot(params) {
	const { root, baseCommit, preserveDirectories, includePaths, signal } = params;
	const input = {
		root,
		baseCommit,
		preserveDirectories,
		includePaths
	};
	if (hasGitWorkerContext()) {
		const { readActualWorkspaceManifestImpl } = await import("./workspace-actual-manifest-Cyx9bg1e.mjs");
		return await readActualWorkspaceManifestImpl({
			...input,
			signal
		});
	}
	signal?.throwIfAborted();
	const hashes = captureHashes();
	return hashes.accept(await compute({
		type: "workspace.manifest.snapshot",
		input: encodeManifestValue({
			root,
			baseCommit,
			includePaths: includePaths === void 0 ? void 0 : [...includePaths],
			preserveDirectories: preserveDirectories === void 0 ? void 0 : [...preserveDirectories],
			hashes: hashes.hashes
		})
	}, signal));
}
async function preflightWorkspaceApply(params) {
	const { root, base, current, signal } = params;
	const input = {
		root,
		base,
		current
	};
	if (hasGitWorkerContext()) {
		const { preflightWorkspaceApplyImpl } = await import("./workspace-reconcile-preflight-BgSqA-5r.mjs");
		return await preflightWorkspaceApplyImpl(input);
	}
	signal?.throwIfAborted();
	const hashes = captureHashes();
	return hashes.accept(await compute({
		type: "workspace.reconcile.preflight",
		input: encodeManifestValue({
			...input,
			hashes: hashes.hashes
		})
	}, signal));
}
async function computeWorkspaceFileSnapshot(path, maxBytes, root, signal) {
	if (hasGitWorkerContext()) {
		const { readWorkspaceFileSnapshotWithLimit } = await import("./workspace-actual-manifest-Cyx9bg1e.mjs");
		return await readWorkspaceFileSnapshotWithLimit(path, maxBytes, root, signal);
	}
	signal?.throwIfAborted();
	const hashes = captureHashes(false);
	return hashes.accept(await compute({
		type: "workspace.manifest.file",
		input: encodeManifestValue({
			path,
			maxBytes,
			root,
			hashes: hashes.hashes
		})
	}, signal));
}
async function readWorkspaceNodes(root, paths) {
	const hashes = captureHashes();
	return new Map(hashes.accept(await compute({
		type: "workspace.manifest.nodes",
		input: encodeManifestValue({
			root,
			paths,
			hashes: hashes.hashes
		})
	})));
}
async function parseWorkspaceManifest(raw, expectedRef, signal) {
	return (await decodeWorkspaceManifest(raw, expectedRef, signal)).manifest;
}
async function decodeWorkspaceManifest(raw, expectedRef, signal) {
	signal?.throwIfAborted();
	return await compute({
		type: "workspace.manifest.parse",
		input: {
			raw: new TextEncoder().encode(raw),
			expectedRef
		}
	}, signal);
}
async function serializeWorkspaceManifest(manifest, signal) {
	signal?.throwIfAborted();
	return await compute({
		type: "workspace.manifest.serialize",
		input: encodeManifestValue({ manifest })
	}, signal);
}
async function overlayWorkspaceManifest(source, prepared, incoming, signal) {
	signal?.throwIfAborted();
	return await compute({
		type: "workspace.manifest.overlay",
		input: encodeManifestValue({
			source,
			prepared,
			incoming
		})
	}, signal);
}
async function parseWorkspaceManifestPair(input, signal) {
	signal?.throwIfAborted();
	const encoder = new TextEncoder();
	return await compute({
		type: "workspace.manifest.pair",
		input: {
			baseRef: input.baseRef,
			currentRef: input.currentRef,
			baseRaw: encoder.encode(input.baseRaw),
			currentRaw: encoder.encode(input.currentRaw)
		}
	}, signal);
}
async function loadStagedWorkspaceManifest(root, ref, signal) {
	return await compute({
		type: "workspace.manifest.staged",
		input: {
			root,
			ref
		}
	}, signal);
}
async function* readStagedWorkspaceManifestEntries(input, signal) {
	let nextEntry = 0;
	while (nextEntry < input.entries.length) {
		signal?.throwIfAborted();
		const entries = [];
		let bytes = 0;
		while (nextEntry < input.entries.length) {
			const entry = input.entries[nextEntry];
			const entryBytes = stagedWorkspaceEntryBytes(entry);
			if (entries.length > 0 && (entries.length === 256 || bytes + entryBytes > 8388608)) break;
			entries.push(resolveStagedWorkspaceReadEntry(input.objectsByPath, entry));
			bytes += entryBytes;
			nextEntry++;
		}
		const contents = await compute({
			type: "workspace.manifest.entries",
			input: {
				root: input.root,
				entries
			}
		}, signal);
		let offset = 0;
		for (const { entry } of entries) {
			signal?.throwIfAborted();
			const content = entry.type === "file" ? contents.subarray(offset, offset + entry.size) : void 0;
			offset += entry.type === "file" ? entry.size : 0;
			yield {
				entry,
				content
			};
		}
	}
}
async function prepareWorkspaceStageInput(input, signal) {
	signal?.throwIfAborted();
	const encoder = new TextEncoder();
	return await compute({
		type: "workspace.manifest.stage-input",
		input: {
			inputPath: input.inputPath,
			stagingRoot: input.stagingRoot,
			stagedResultRef: input.stagedResultRef,
			baseManifestRef: input.baseManifestRef,
			currentManifestRef: input.currentManifestRef,
			baseManifestRaw: encoder.encode(input.baseManifestRaw),
			currentManifestRaw: encoder.encode(input.currentManifestRaw)
		}
	}, signal);
}
async function prepareWorkspaceTreeInput(input) {
	return await compute({
		type: "workspace.manifest.tree-input",
		input: encodeManifestValue(input)
	});
}
//#endregion
//#region src/gateway/worker-environments/workspace-reconcile-fs.ts
const PATCH_TIMEOUT_MS = 6e5;
function localPath(root, relative) {
	return path.join(root, ...relative.split("/"));
}
async function removeEmptyWorkspaceDirectory(root, entryPath) {
	let children;
	try {
		children = await root.list(entryPath);
	} catch (error) {
		if (error instanceof FsSafeError && ["not-found", "path-alias"].includes(error.code)) return;
		throw error;
	}
	if (children.length > 0) return;
	try {
		await root.remove(entryPath);
	} catch (error) {
		if (error instanceof FsSafeError && ["not-found", "path-alias"].includes(error.code)) return;
		if ((await root.list(entryPath).catch(() => void 0))?.length) return;
		throw error;
	}
}
async function readWorkspaceFileSnapshot(root, entryPath) {
	return await computeWorkspaceFileSnapshot(localPath(root, entryPath), MAX_RECONCILIATION_FILE_BYTES, root);
}
async function localWorkspaceNode(root, entryPath) {
	const absolute = localPath(root, entryPath);
	const stats = await fs.lstat(absolute).catch((error) => {
		if (hasNodeErrorCode(error, "ENOENT") || hasNodeErrorCode(error, "ENOTDIR")) return;
		throw error;
	});
	if (!stats) return;
	if (stats.isDirectory() && !stats.isSymbolicLink()) return {
		path: entryPath,
		type: "directory"
	};
	if (stats.isSymbolicLink()) return {
		path: entryPath,
		type: "symlink",
		mode: 511,
		target: await fs.readlink(absolute)
	};
	if (!stats.isFile()) return {
		path: entryPath,
		type: "unsupported"
	};
	const snapshot = await readWorkspaceFileSnapshot(root, entryPath);
	if (snapshot.type === "unsupported") return {
		path: entryPath,
		type: "unsupported"
	};
	return {
		path: entryPath,
		type: "file",
		mode: snapshot.mode,
		size: snapshot.size,
		sha256: snapshot.sha256
	};
}
async function readAbsoluteFileSnapshot(absolute) {
	return await computeWorkspaceFileSnapshot(absolute, MAX_RECONCILIATION_FILE_BYTES);
}
async function absoluteEntryMatches(absolute, entry) {
	const stats = await fs.lstat(absolute).catch(() => void 0);
	if (!stats) return false;
	if (entry.type === "symlink") return stats.isSymbolicLink() && await fs.readlink(absolute) === entry.target;
	if (!stats.isFile() || stats.isSymbolicLink()) return false;
	const snapshot = await readAbsoluteFileSnapshot(absolute).catch((error) => {
		if (error instanceof WorkerTaskError) throw error;
	});
	return snapshot?.type === "file" && snapshot.mode === entry.mode && snapshot.size === entry.size && snapshot.sha256 === entry.sha256;
}
async function entryMatches(root, entry) {
	if (entry.type === "symlink") return await absoluteEntryMatches(localPath(root, entry.path), entry);
	const snapshot = await readWorkspaceFileSnapshot(root, entry.path).catch((error) => {
		if (error instanceof WorkerTaskError) throw error;
	});
	return snapshot?.type === "file" && snapshot.mode === entry.mode && snapshot.size === entry.size && snapshot.sha256 === entry.sha256;
}
async function readWorkspaceTreeFile(params) {
	const listed = await runGitBuffered(params.repositoryRoot, [
		"--literal-pathspecs",
		"ls-tree",
		"-z",
		"--full-tree",
		params.tree,
		"--",
		params.entry.path
	], {
		timeoutMs: PATCH_TIMEOUT_MS,
		maxOutputBytes: 1048576
	});
	if (listed.termination !== "exit" || listed.code !== 0) throw new Error(listed.stderr.toString("utf8").trim() || "git ls-tree failed");
	const record = listed.stdout;
	const terminator = record.indexOf(0);
	const separator = record.indexOf(9);
	if (terminator !== record.byteLength - 1 || separator < 0 || separator > terminator) throw new Error(`Cloud workspace recovery snapshot is missing: ${params.entry.path}`);
	const metadata = record.subarray(0, separator).toString("utf8");
	const match = /^100(?:644|755) blob ([a-f0-9]{40})$/u.exec(metadata);
	const listedPath = record.subarray(separator + 1, terminator);
	if (!match || !listedPath.equals(Buffer.from(params.entry.path))) throw new Error(`Cloud workspace recovery snapshot is invalid: ${params.entry.path}`);
	const blob = await runGitBuffered(params.repositoryRoot, [
		"cat-file",
		"blob",
		match[1]
	], {
		timeoutMs: PATCH_TIMEOUT_MS,
		maxOutputBytes: MAX_RECONCILIATION_FILE_BYTES + 1
	});
	if (blob.termination !== "exit" || blob.code !== 0) throw new Error(blob.stderr.toString("utf8").trim() || "git cat-file failed");
	if (blob.stdout.byteLength !== params.entry.size || createHash("sha256").update(blob.stdout).digest("hex") !== params.entry.sha256) throw new Error(`Cloud workspace recovery snapshot is invalid: ${params.entry.path}`);
	return blob.stdout;
}
async function directoryContainsOnlyJournalPaths(root, directory, paths, directories, isRetainedInput) {
	for (const name of await fs.readdir(localPath(root, directory))) {
		const child = `${directory}/${name}`;
		if (isManagedSandboxSkillsPath(child)) return false;
		if (isDerivedWorkspacePath(child, await isRetainedInput(child))) continue;
		const stats = await fs.lstat(localPath(root, child));
		if (stats.isDirectory() && !stats.isSymbolicLink()) {
			if (!directories.has(child) && !await directoryContainsOnlyDerivedWorkspaceEntries(root, child, isRetainedInput)) return false;
			if (directories.has(child) && !await directoryContainsOnlyJournalPaths(root, child, paths, directories, isRetainedInput)) return false;
		} else if (!paths.has(child)) return false;
	}
	return true;
}
async function directoryContainsOnlyDerivedWorkspaceEntries(root, directory, isRetainedInput) {
	const names = await fs.readdir(localPath(root, directory));
	let foundDerivedEntry = false;
	for (const name of names) {
		const child = `${directory}/${name}`;
		if (isManagedSandboxSkillsPath(child)) return false;
		if (isDerivedWorkspacePath(child, await isRetainedInput(child))) {
			foundDerivedEntry = true;
			continue;
		}
		const stats = await fs.lstat(localPath(root, child));
		if (!stats.isDirectory() || stats.isSymbolicLink() || !await directoryContainsOnlyDerivedWorkspaceEntries(root, child, isRetainedInput)) return false;
		foundDerivedEntry = true;
	}
	return foundDerivedEntry;
}
//#endregion
export { serializeWorkspaceManifest as S, preflightWorkspaceApply as _, localPath as a, readStagedWorkspaceManifestEntries as b, removeEmptyWorkspaceDirectory as c, computeWorkspaceFileSnapshot as d, decodeWorkspaceManifest as f, parseWorkspaceManifestPair as g, parseWorkspaceManifest as h, entryMatches as i, captureWorkspaceManifest as l, overlayWorkspaceManifest as m, directoryContainsOnlyDerivedWorkspaceEntries as n, localWorkspaceNode as o, loadStagedWorkspaceManifest as p, directoryContainsOnlyJournalPaths as r, readWorkspaceTreeFile as s, absoluteEntryMatches as t, captureWorkspaceSnapshot as u, prepareWorkspaceStageInput as v, readWorkspaceNodes as x, prepareWorkspaceTreeInput as y };
