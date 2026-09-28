import { S as resolveOpenedFileRealPathForHandle, c as isPathInside, t as FsSafeError, w as root } from "./fs-safe-BAPek8At.mjs";
import { t as hasNodeErrorCode } from "./path-guards-D5kuI0Tv.mjs";
import { t as readFileWindowFully } from "./file-read-Csm265gq.mjs";
import { c as sha256File } from "./directory-durability-BKe2aOQN.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { i as createStagedInputPathMatcher } from "./staged-inputs-De-HBXyz.mjs";
import "./workspace-inventory-limits-DfDQlGHa.mjs";
import { a as gitFileMode, c as serializeWorkerWorkspaceManifest, h as isDerivedWorkspacePath } from "./workspace-manifest-453LPGpv.mjs";
import { _ as workspaceStatIdentity, r as activeWorkspaceHashContext } from "./workspace-hash-memo-R41irJvf.mjs";
import { constants } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { createHash } from "node:crypto";
//#region src/gateway/worker-environments/workspace-actual-manifest.ts
function localPath(root, relative) {
	return path.join(root, ...relative.split("/"));
}
function isPortableRootContainedSymlink(root, entryPath, target) {
	if (!target || target.includes("\\") || path.posix.isAbsolute(target) || path.win32.parse(target).root !== "") return false;
	const resolved = path.resolve(path.dirname(localPath(root, entryPath)), target);
	return resolved === root || resolved.startsWith(`${root}${path.sep}`);
}
async function readWorkspaceFileSnapshotWithLimit(expectedPath, maxBytes, root, signal) {
	return await readWorkspaceFile({
		expectedPath,
		maxBytes,
		root,
		signal,
		contents: false
	});
}
async function readWorkspaceFileContentsWithLimit(expectedPath, maxBytes) {
	return await readWorkspaceFile({
		expectedPath,
		maxBytes,
		contents: true
	});
}
async function readWorkspaceFile(params) {
	const { expectedPath, maxBytes, root, signal } = params;
	signal?.throwIfAborted();
	const handle = await fs$1.open(expectedPath, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
	let buffer;
	try {
		signal?.throwIfAborted();
		const { memo: hashMemo, metrics, owner = "gateway" } = activeWorkspaceHashContext() ?? {};
		const before = await handle.stat({ bigint: true });
		const realPath = await resolveOpenedFileRealPathForHandle(handle, expectedPath);
		if (!before.isFile() || root && !isPathInside(root, realPath)) throw new Error("Gateway workspace file changed while it was being read");
		const byteLimit = typeof maxBytes === "number" ? maxBytes : maxBytes(Number(before.size));
		if (before.size > BigInt(byteLimit)) return { type: "unsupported" };
		const identity = workspaceStatIdentity(owner, before);
		let sha256 = params.contents ? void 0 : hashMemo?.get(identity);
		let size = Number(before.size);
		if (sha256) {
			if (metrics) metrics.memoHitCount += 1;
		} else {
			const hashStartedAt = performance.now();
			if (params.contents) {
				buffer = Buffer.allocUnsafe(Number(before.size) + 1);
				size = await readFileWindowFully(handle, buffer, 0, { signal });
				if (size > byteLimit) return { type: "unsupported" };
				sha256 = createHash("sha256").update(buffer.subarray(0, size)).digest("hex");
			} else try {
				({bytes: size, digest: sha256} = await sha256File(handle, {
					maxBytes: byteLimit,
					signal
				}));
			} catch (error) {
				signal?.throwIfAborted();
				if (!(error instanceof FsSafeError) || error.code !== "too-large") throw error;
				if (typeof maxBytes !== "number") throw new Error("Gateway workspace file changed while it was being read", { cause: error });
				return { type: "unsupported" };
			}
			if (metrics) {
				metrics.contentHashCount += 1;
				metrics.contentHashDurationMs += performance.now() - hashStartedAt;
			}
		}
		const after = await handle.stat({ bigint: true });
		signal?.throwIfAborted();
		if (after.size !== BigInt(size) || workspaceStatIdentity(owner, after) !== identity) throw new Error("Gateway workspace file changed while it was being read");
		hashMemo?.set(identity, sha256);
		const snapshot = {
			type: "file",
			mode: gitFileMode(Number(after.mode & 511n)),
			size,
			sha256
		};
		return params.contents && buffer ? {
			...snapshot,
			content: buffer.subarray(0, size)
		} : snapshot;
	} finally {
		await handle.close();
	}
}
async function readActualWorkspaceManifestImpl(params) {
	params.signal?.throwIfAborted();
	let root$1;
	let isStagedInput;
	try {
		root$1 = await fs$1.realpath(params.root);
		isStagedInput = createStagedInputPathMatcher(await root(root$1));
	} catch (error) {
		params.signal?.throwIfAborted();
		throw error;
	}
	const rawEntries = [];
	let totalBytes = 0;
	let manifestPathBytes = 0;
	let traversedEntries = 0;
	let traversedPathBytes = 0;
	const addBytes = (bytes) => {
		totalBytes += bytes;
		if (totalBytes > 4294967296) throw new Error("Gateway workspace manifest exceeds its eligible byte limit");
	};
	const addEntry = (entry, bytes = 0) => {
		addBytes(bytes);
		manifestPathBytes += Buffer.byteLength(entry.path);
		if (manifestPathBytes > 67108864) throw new Error("Gateway workspace manifest paths exceed their byte limit");
		rawEntries.push(entry);
		if (rawEntries.length > 25e4) throw new Error("Gateway workspace manifest has too many entries");
	};
	const scanController = new AbortController();
	const scanSignal = params.signal ? AbortSignal.any([params.signal, scanController.signal]) : scanController.signal;
	const checkTraversal = (relative) => {
		scanSignal.throwIfAborted();
		traversedEntries += 1;
		traversedPathBytes += Buffer.byteLength(relative);
		if (traversedEntries > 25e4) throw new Error("Gateway workspace manifest has too many entries");
		if (traversedPathBytes > 67108864) throw new Error("Gateway workspace manifest paths exceed their byte limit");
	};
	const filePaths = [];
	const runScans = async (start, end, scan) => {
		let next = start;
		let taskFailureWasFirst = false;
		const result = await runTasksWithConcurrency({
			tasks: Array.from({ length: Math.min(4, end - start) }, () => async () => {
				while (next < end && !scanSignal.aborted) await scan(next++);
			}),
			limit: 4,
			errorMode: "stop",
			onTaskError: (error) => {
				if (!scanController.signal.aborted) taskFailureWasFirst = !params.signal?.aborted;
				scanController.abort(error);
			}
		});
		if (result.hasError) {
			if (!taskFailureWasFirst) params.signal?.throwIfAborted();
			throw result.firstError;
		}
		scanSignal.throwIfAborted();
	};
	const addFile = async (relative) => {
		const snapshot = await readWorkspaceFileSnapshotWithLimit(localPath(root$1, relative), (size) => {
			addBytes(size);
			return size;
		}, root$1, scanSignal);
		if (snapshot.type === "file") {
			addEntry({
				path: relative,
				type: "file",
				mode: snapshot.mode,
				size: snapshot.size,
				sha256: snapshot.sha256
			});
			return;
		}
		throw new Error("Gateway workspace manifest exceeds its eligible byte limit");
	};
	const addIncludedPath = async (relative, includedNodes, derivedOnlyDirectories) => {
		if (isDerivedWorkspacePath(relative, await isStagedInput(relative))) return "derived-only";
		checkTraversal(relative);
		const absolute = localPath(root$1, relative);
		const stats = await fs$1.lstat(absolute).catch((error) => {
			if (hasNodeErrorCode(error, "ENOENT") || hasNodeErrorCode(error, "ENOTDIR")) return;
			throw error;
		});
		if (!stats) return "absent";
		if (stats.isDirectory() && !stats.isSymbolicLink()) {
			if (params.preserveDirectories?.has(relative)) {
				addEntry({
					path: relative,
					type: "directory",
					mode: stats.mode & 511
				});
				return "included";
			}
			let hasDerivedEntry = false;
			let hasIncludedEntry = false;
			for await (const entry of await fs$1.opendir(absolute)) {
				scanSignal.throwIfAborted();
				const child = `${relative}/${entry.name}`;
				if (isDerivedWorkspacePath(child, await isStagedInput(child)) || derivedOnlyDirectories.has(child)) hasDerivedEntry = true;
				else if (includedNodes.has(child)) hasIncludedEntry = true;
			}
			if (hasIncludedEntry || !hasDerivedEntry) {
				addEntry({
					path: relative,
					type: "directory",
					mode: stats.mode & 511
				});
				return "included";
			}
			return "derived-only";
		}
		if (stats.isSymbolicLink()) {
			const target = await fs$1.readlink(absolute);
			if (isPortableRootContainedSymlink(root$1, relative, target)) {
				addEntry({
					path: relative,
					type: "symlink",
					mode: 511,
					target
				}, Buffer.byteLength(target));
				return "included";
			}
			return "absent";
		}
		if (stats.isFile()) {
			filePaths.push(relative);
			return "included";
		}
		return "absent";
	};
	const walk = async (relativeDirectory) => {
		const absoluteDirectory = relativeDirectory ? localPath(root$1, relativeDirectory) : root$1;
		let hasDerivedEntry = false;
		let hasNonDerivedEntry = false;
		for await (const directoryEntry of await fs$1.opendir(absoluteDirectory)) {
			const name = directoryEntry.name;
			const relative = relativeDirectory ? `${relativeDirectory}/${name}` : name;
			checkTraversal(relative);
			if (!relativeDirectory && name === ".git") continue;
			if (isDerivedWorkspacePath(relative, await isStagedInput(relative))) {
				hasDerivedEntry = true;
				continue;
			}
			const absolute = localPath(root$1, relative);
			const stats = await fs$1.lstat(absolute);
			if (stats.isDirectory() && !stats.isSymbolicLink()) {
				const child = await walk(relative);
				if (child.included || params.preserveDirectories?.has(relative)) {
					addEntry({
						path: relative,
						type: "directory",
						mode: stats.mode & 511
					});
					hasNonDerivedEntry = true;
				} else hasDerivedEntry ||= child.hasDerivedEntry;
			} else if (stats.isSymbolicLink()) {
				hasNonDerivedEntry = true;
				const target = await fs$1.readlink(absolute);
				if (!isPortableRootContainedSymlink(root$1, relative, target)) continue;
				addEntry({
					path: relative,
					type: "symlink",
					mode: 511,
					target
				}, Buffer.byteLength(target));
			} else if (stats.isFile()) {
				hasNonDerivedEntry = true;
				filePaths.push(relative);
			} else {
				hasNonDerivedEntry = true;
				continue;
			}
		}
		return {
			hasDerivedEntry,
			included: hasNonDerivedEntry || !hasDerivedEntry
		};
	};
	if (params.includePaths) {
		const includedNodes = /* @__PURE__ */ new Set();
		const derivedOnlyDirectories = /* @__PURE__ */ new Set();
		const paths = [...params.includePaths].map((relative) => ({
			relative,
			depth: relative.split("/").length
		})).toSorted((left, right) => right.depth - left.depth || left.relative.localeCompare(right.relative));
		for (let start = 0; start < paths.length;) {
			let end = start + 1;
			while (end < paths.length && paths[end].depth === paths[start].depth) end++;
			await runScans(start, end, async (index) => {
				const { relative } = paths[index];
				const state = await addIncludedPath(relative, includedNodes, derivedOnlyDirectories);
				if (state === "included") includedNodes.add(relative);
				else if (state === "derived-only") derivedOnlyDirectories.add(relative);
			});
			start = end;
		}
	} else await runScans(0, 1, async () => {
		await walk("");
	});
	await runScans(0, filePaths.length, (index) => addFile(filePaths[index]));
	scanSignal.throwIfAborted();
	const directories = rawEntries.filter((entry) => entry.type === "directory").toSorted((left, right) => left.path.localeCompare(right.path));
	const manifest = {
		version: 1,
		baseCommit: params.baseCommit,
		entries: rawEntries.filter((entry) => entry.type !== "directory").toSorted((left, right) => left.path.localeCompare(right.path)),
		directories: directories.map((entry) => entry.path)
	};
	const raw = serializeWorkerWorkspaceManifest(manifest);
	return {
		manifestRef: `sha256:${createHash("sha256").update(raw).digest("hex")}`,
		manifest,
		rawManifest: raw
	};
}
//#endregion
export { readWorkspaceFileSnapshotWithLimit as i, readActualWorkspaceManifestImpl as n, readWorkspaceFileContentsWithLimit as r, isPortableRootContainedSymlink as t };
