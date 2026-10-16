import { t as FsSafeError } from "./fs-safe-BUXBSN-4.mjs";
import { t as hasNodeErrorCode } from "./path-guards-CH7noY0Z.mjs";
import { r as WorkerTaskError } from "./src-WCJCjrey.mjs";
import "./worker-task-pool-iI3pfrsK.mjs";
import { n as hasGitWorkerContext } from "./git-worker-context-BSo6KDXb.mjs";
import { h as isDerivedWorkspacePath, n as MAX_RECONCILIATION_FILE_BYTES } from "./workspace-manifest-q-txD9ZU.mjs";
import { i as isManagedSandboxSkillsPath } from "./sandbox-workspace-paths-8lp0pLw0.mjs";
import { c as pruneWorkspaceHashMemo, i as activeWorkspaceHashContext } from "./workspace-hash-memo-CLHlwU2N.mjs";
import { p as runGitBuffered } from "./git-DK_u9XbK.mjs";
import { t as runGitWorkerOperation } from "./git-worker-pOqNR_b6.mjs";
import { c as stagedWorkspaceEntryBytes, s as resolveStagedWorkspaceReadEntry } from "./workspace-result-inventory-TtCqUwu3.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { createHash } from "node:crypto";
//#region src/gateway/worker-environments/workspace-manifest-worker.ts
function computationInputBytes(input) {
	if (typeof input === "string") return input.length * 2;
	if (ArrayBuffer.isView(input)) return input.byteLength;
	if (input && typeof input === "object") return Object.entries(input).reduce((bytes, [key, value]) => bytes + key.length * 2 + computationInputBytes(value), 64);
	return 8;
}
function transferableManifestInput(command) {
	if ("payload" in command.input) return [command.input.payload.buffer];
	switch (command.type) {
		case "workspace.manifest.parse": return [command.input.raw.buffer];
		case "workspace.manifest.pair": return [command.input.baseRaw.buffer, command.input.currentRaw.buffer];
		case "workspace.manifest.stage-input": return "publication" in command.input ? [command.input.publication.metadata.buffer] : [command.input.baseManifestRaw.buffer, command.input.currentManifestRaw.buffer];
		default: return [];
	}
}
async function computeWorkspaceManifest(command, signal, git) {
	if (hasGitWorkerContext()) {
		const { executeWorkspaceManifestComputation } = await import("./workspace-manifest-computation.runtime.js");
		return await executeWorkspaceManifestComputation(command);
	}
	return await runGitWorkerOperation(command, {
		signal,
		git,
		inputBytes: 256 + computationInputBytes(command.input),
		transferList: transferableManifestInput
	});
}
async function computeValue(type, input, signal) {
	signal?.throwIfAborted();
	return await computeWorkspaceManifest({
		type,
		input: { payload: new TextEncoder().encode(JSON.stringify(input)) }
	}, signal);
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
async function captureWorkspace(type, params) {
	const { root, baseCommit, preserveDirectories, includePaths, signal } = params;
	if (hasGitWorkerContext()) {
		const { readActualWorkspaceManifestImpl } = await import("./workspace-actual-manifest-BxuyQXob.mjs");
		const snapshot = await readActualWorkspaceManifestImpl(params);
		return type === "workspace.manifest.snapshot" ? snapshot : {
			manifest: snapshot.manifest,
			manifestRef: snapshot.manifestRef
		};
	}
	signal?.throwIfAborted();
	const hashes = captureHashes();
	return hashes.accept(await computeValue(type, {
		root,
		baseCommit,
		includePaths: includePaths === void 0 ? void 0 : [...includePaths],
		preserveDirectories: preserveDirectories === void 0 ? void 0 : [...preserveDirectories],
		hashes: hashes.hashes
	}, signal));
}
async function captureWorkspaceManifest(params) {
	return await captureWorkspace("workspace.manifest.capture", params);
}
async function captureWorkspaceSnapshot(params) {
	return await captureWorkspace("workspace.manifest.snapshot", params);
}
async function preflightWorkspaceApply(params) {
	const { root, base, current, signal } = params;
	const input = {
		root,
		base,
		current
	};
	if (hasGitWorkerContext()) {
		const { preflightWorkspaceApplyImpl } = await import("./workspace-reconcile-preflight-BpiVvsdn.mjs");
		return await preflightWorkspaceApplyImpl(input);
	}
	signal?.throwIfAborted();
	const hashes = captureHashes();
	return hashes.accept(await computeValue("workspace.reconcile.preflight", {
		...input,
		hashes: hashes.hashes
	}, signal));
}
async function computeWorkspaceFileSnapshot(path, maxBytes, root, signal) {
	if (hasGitWorkerContext()) {
		const { readWorkspaceFileSnapshotWithLimit } = await import("./workspace-actual-manifest-BxuyQXob.mjs");
		return await readWorkspaceFileSnapshotWithLimit(path, maxBytes, root, signal);
	}
	signal?.throwIfAborted();
	const hashes = captureHashes(false);
	return hashes.accept(await computeValue("workspace.manifest.file", {
		path,
		maxBytes,
		root,
		hashes: hashes.hashes
	}, signal));
}
async function readWorkspaceNodes(root, paths) {
	const hashes = captureHashes();
	return new Map(hashes.accept(await computeValue("workspace.manifest.nodes", {
		root,
		paths,
		hashes: hashes.hashes
	})));
}
async function decodeWorkspaceManifest(raw, expectedRef, signal) {
	signal?.throwIfAborted();
	return await computeWorkspaceManifest({
		type: "workspace.manifest.parse",
		input: {
			raw: new TextEncoder().encode(raw),
			expectedRef
		}
	}, signal);
}
async function serializeWorkspaceManifest(manifest, signal) {
	return await computeValue("workspace.manifest.serialize", { manifest }, signal);
}
async function overlayWorkspaceManifest(source, prepared, incoming, signal) {
	return await computeValue("workspace.manifest.overlay", {
		source,
		prepared,
		incoming
	}, signal);
}
async function parseWorkspaceManifestPair(input, signal) {
	signal?.throwIfAborted();
	const encoder = new TextEncoder();
	return await computeWorkspaceManifest({
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
	return await computeWorkspaceManifest({
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
		const contents = await computeWorkspaceManifest({
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
	return await computeWorkspaceManifest({
		type: "workspace.manifest.stage-input",
		input: {
			inputPath: input.inputPath,
			stagingRoot: input.stagingRoot,
			stagedResultRef: input.stagedResultRef,
			..."publication" in input ? { publication: {
				...input.publication,
				metadata: encoder.encode(input.publication.metadata)
			} } : {
				baseManifestRef: input.baseManifestRef,
				currentManifestRef: input.currentManifestRef,
				baseManifestRaw: encoder.encode(input.baseManifestRaw),
				currentManifestRaw: encoder.encode(input.currentManifestRaw)
			}
		}
	}, signal);
}
async function prepareWorkspaceTreeInput(input) {
	return await computeValue("workspace.manifest.tree-input", input);
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
	return {
		path: entryPath,
		...await computeWorkspaceFileSnapshot(absolute, MAX_RECONCILIATION_FILE_BYTES, root)
	};
}
async function fileEntryMatches(absolute, entry, root) {
	const snapshot = await computeWorkspaceFileSnapshot(absolute, MAX_RECONCILIATION_FILE_BYTES, root).catch((error) => {
		if (error instanceof WorkerTaskError) throw error;
	});
	return snapshot?.type === "file" && snapshot.mode === entry.mode && snapshot.size === entry.size && snapshot.sha256 === entry.sha256;
}
async function absoluteEntryMatches(absolute, entry) {
	const stats = await fs.lstat(absolute).catch(() => void 0);
	if (!stats) return false;
	if (entry.type === "symlink") return stats.isSymbolicLink() && await fs.readlink(absolute) === entry.target;
	if (!stats.isFile() || stats.isSymbolicLink()) return false;
	return await fileEntryMatches(absolute, entry);
}
async function entryMatches(root, entry) {
	if (entry.type === "symlink") return await absoluteEntryMatches(localPath(root, entry.path), entry);
	return await fileEntryMatches(localPath(root, entry.path), entry, root);
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
export { serializeWorkspaceManifest as S, preflightWorkspaceApply as _, localPath as a, readStagedWorkspaceManifestEntries as b, removeEmptyWorkspaceDirectory as c, computeWorkspaceFileSnapshot as d, computeWorkspaceManifest as f, parseWorkspaceManifestPair as g, overlayWorkspaceManifest as h, entryMatches as i, captureWorkspaceManifest as l, loadStagedWorkspaceManifest as m, directoryContainsOnlyDerivedWorkspaceEntries as n, localWorkspaceNode as o, decodeWorkspaceManifest as p, directoryContainsOnlyJournalPaths as r, readWorkspaceTreeFile as s, absoluteEntryMatches as t, captureWorkspaceSnapshot as u, prepareWorkspaceStageInput as v, readWorkspaceNodes as x, prepareWorkspaceTreeInput as y };
