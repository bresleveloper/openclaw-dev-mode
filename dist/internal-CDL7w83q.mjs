import { n as sha256Hex } from "./node-crypto-Df3MIs6V.mjs";
import { o as normalizeConfiguredMemoryExtraPaths } from "./legacy-2ovrASa7.mjs";
import { c as shouldSkipRootMemoryAuxiliaryPath, i as resolveCanonicalRootMemoryFile } from "./root-memory-files-DBHovRYF.mjs";
import { n as detectMime } from "./mime-1zBUMwu6.mjs";
import { o as estimateStructuredEmbeddingInputBytes } from "./markdown-chunks-DYWd0D11.mjs";
import { a as readRegularFile, c as walkDirectory, n as isFileMissingError, r as isPathInside, s as statRegularFile } from "./fs-utils-BVDi6fm8.mjs";
import { t as hashText } from "./hash-Di28TYtu.mjs";
import { n as buildMemoryMultimodalLabel, r as classifyMemoryMultimodalPath } from "./multimodal-BBZswXZ7.mjs";
import { n as retryTransientMemoryRead } from "./read-retry-B-bw--uT.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { homedir } from "node:os";
import pMap from "p-map";
//#region packages/memory-host-sdk/src/host/concurrency.ts
/** Run tasks with bounded concurrency, stopping admission and draining active work on failure. */
async function runWithConcurrency(tasks, limit) {
	const inFlight = /* @__PURE__ */ new Set();
	try {
		return await pMap(tasks, (task) => {
			const run = Promise.resolve().then(task);
			inFlight.add(run);
			run.then(() => inFlight.delete(run), () => inFlight.delete(run));
			return run;
		}, {
			concurrency: Math.max(1, Math.floor(limit)),
			stopOnError: true
		});
	} catch (error) {
		await Promise.allSettled(inFlight);
		throw error;
	}
}
//#endregion
//#region packages/memory-host-sdk/src/host/explicit-extra-markdown.ts
function isExplicitExtraMarkdownFilePath(filePath, platform = process.platform) {
	return filePath.endsWith(".md") || platform === "win32" && filePath.toLowerCase().endsWith(".md");
}
//#endregion
//#region packages/memory-host-sdk/src/host/internal.ts
const DISABLED_MULTIMODAL_SETTINGS = {
	enabled: false,
	modalities: [],
	maxFileBytes: 0
};
function ensureMemoryHostDir(dir) {
	fs.mkdirSync(dir, { recursive: true });
	return dir;
}
async function statEnumerableMemoryFile(absPath) {
	try {
		const stat = await fs$1.lstat(absPath);
		return stat.isFile() ? stat : null;
	} catch (error) {
		if (isFileMissingError(error)) return null;
		throw error;
	}
}
function normalizeRelPath(value) {
	return value.trim().replace(/^[./]+/, "").replace(/\\/g, "/");
}
function expandHomePath(value) {
	if (value === "~") return homedir();
	if (value.startsWith("~/") || value.startsWith("~\\")) return path.join(homedir(), value.slice(2));
	return value;
}
function normalizeExtraMemoryPathEntries(workspaceDir, extraPaths) {
	return normalizeConfiguredMemoryExtraPaths(extraPaths).map((entry) => {
		const configuredPath = typeof entry === "string" ? entry : entry.path;
		const normalized = { path: path.resolve(workspaceDir, expandHomePath(configuredPath)) };
		if (typeof entry !== "string") normalized.pattern = entry.pattern?.replaceAll("\\", "/");
		return normalized;
	});
}
function normalizeExtraMemoryPaths(workspaceDir, extraPaths) {
	return Array.from(new Set(normalizeExtraMemoryPathEntries(workspaceDir, extraPaths).map((entry) => entry.path)));
}
function matchesExtraMemoryPathEntry(entry, candidatePath) {
	if (!entry.pattern) return true;
	const relativePath = path.relative(entry.path, candidatePath);
	try {
		return !relativePath || isPathInside(entry.path, candidatePath) && path.posix.matchesGlob(relativePath.replaceAll(path.sep, "/"), entry.pattern);
	} catch {
		return false;
	}
}
function isMemoryPath(relPath) {
	const normalized = normalizeRelPath(relPath);
	if (!normalized) return false;
	if (normalized === "MEMORY.md" || normalized === "USER.md" || normalized.toLowerCase() === "dreams.md") return true;
	return normalized.startsWith("memory/");
}
function isAllowedMemoryFilePath(filePath, multimodal) {
	if (filePath.endsWith(".md")) return true;
	return classifyMemoryMultimodalPath(filePath, multimodal ?? DISABLED_MULTIMODAL_SETTINGS) !== null;
}
function shouldDescendMemoryEntry(entry, shouldSkipPath) {
	if (shouldSkipPath?.(entry.path)) return false;
	return entry.kind === "directory" && entry.name !== ".openclaw-repair";
}
var MemorySourceScanError = class extends Error {
	constructor(sourcePath, cause) {
		const code = cause !== null && typeof cause === "object" && "code" in cause && typeof cause.code === "string" ? cause.code : void 0;
		const detail = cause instanceof Error ? cause.message : String(cause);
		super(`memory source scan failed at ${sourcePath}${code ? ` (${code})` : ""}: ${detail}`, { cause });
		this.name = "MemorySourceScanError";
		this.path = sourcePath;
		this.code = code;
	}
};
async function scanMemorySource(sourcePath, run) {
	try {
		return await run();
	} catch (error) {
		if (isFileMissingError(error) || error instanceof MemorySourceScanError) throw error;
		throw new MemorySourceScanError(sourcePath, error);
	}
}
async function collectMemoryFilesFromDir(dir, files, multimodal, shouldSkipPath, extraPathEntry) {
	const scan = await scanMemorySource(dir, () => walkDirectory(dir, {
		symlinks: "skip",
		descend: (entry) => shouldDescendMemoryEntry(entry, shouldSkipPath),
		include: (entry) => !shouldSkipPath?.(entry.path) && entry.kind === "file" && isAllowedMemoryFilePath(entry.path, multimodal) && (!extraPathEntry || matchesExtraMemoryPathEntry(extraPathEntry, entry.path))
	}));
	const operationalFailure = scan.failedDirs.find((failure) => !isFileMissingError(failure.error));
	if (operationalFailure) throw new MemorySourceScanError(operationalFailure.path, operationalFailure.error);
	files.push(...scan.entries.map((entry) => entry.path).toSorted());
}
async function listMemoryFiles(workspaceDir, extraPaths, multimodal, onSkippedSymlinkRoot) {
	const result = [];
	const memoryDir = path.join(workspaceDir, "memory");
	const shouldSkipWorkspaceMemoryPath = (absPath) => shouldSkipRootMemoryAuxiliaryPath({
		workspaceDir,
		absPath
	});
	const addMarkdownFile = async (absPath) => {
		if (!await scanMemorySource(absPath, () => statEnumerableMemoryFile(absPath)) || !absPath.endsWith(".md")) return;
		result.push(absPath);
	};
	const memoryFile = await scanMemorySource(workspaceDir, () => resolveCanonicalRootMemoryFile(workspaceDir));
	if (memoryFile) await addMarkdownFile(memoryFile);
	await addMarkdownFile(path.join(workspaceDir, "USER.md"));
	try {
		const dirStat = await scanMemorySource(memoryDir, () => fs$1.lstat(memoryDir));
		if (!dirStat.isSymbolicLink() && dirStat.isDirectory()) await collectMemoryFilesFromDir(memoryDir, result, void 0, shouldSkipWorkspaceMemoryPath);
	} catch (error) {
		if (!isFileMissingError(error)) throw error;
	}
	const normalizedExtraPaths = normalizeExtraMemoryPathEntries(workspaceDir, extraPaths);
	if (normalizedExtraPaths.length > 0) for (const entry of normalizedExtraPaths) {
		const inputPath = entry.path;
		if (shouldSkipWorkspaceMemoryPath(inputPath)) continue;
		try {
			const stat = await scanMemorySource(inputPath, () => fs$1.lstat(inputPath));
			if (stat.isSymbolicLink()) {
				onSkippedSymlinkRoot?.(inputPath);
				continue;
			}
			if (stat.isDirectory()) {
				await collectMemoryFilesFromDir(inputPath, result, multimodal, shouldSkipWorkspaceMemoryPath, entry);
				continue;
			}
			if (stat.isFile() && (isExplicitExtraMarkdownFilePath(inputPath) || isAllowedMemoryFilePath(inputPath, multimodal))) result.push(inputPath);
		} catch (error) {
			if (!isFileMissingError(error)) throw error;
		}
	}
	if (result.length <= 1) return result;
	const seen = /* @__PURE__ */ new Set();
	const deduped = [];
	for (const entry of result) {
		let key = entry;
		try {
			key = await fs$1.realpath(entry);
		} catch {}
		if (seen.has(key)) continue;
		seen.add(key);
		deduped.push(entry);
	}
	return deduped;
}
async function buildFileEntry(absPath, workspaceDir, multimodal) {
	const stat = await statEnumerableMemoryFile(absPath);
	if (!stat) return null;
	const normalizedPath = path.relative(workspaceDir, absPath).replace(/\\/g, "/");
	const multimodalSettings = multimodal ?? DISABLED_MULTIMODAL_SETTINGS;
	const modality = classifyMemoryMultimodalPath(absPath, multimodalSettings);
	if (modality) {
		if (stat.size > multimodalSettings.maxFileBytes) return null;
		let buffer;
		try {
			buffer = (await retryTransientMemoryRead(() => readRegularFile({
				filePath: absPath,
				maxBytes: multimodalSettings.maxFileBytes
			}), `read multimodal memory file ${absPath}`)).buffer;
		} catch (err) {
			if (isFileMissingError(err)) return null;
			throw err;
		}
		const mimeType = await detectMime({
			buffer: buffer.subarray(0, 512),
			filePath: absPath
		});
		if (!mimeType || !mimeType.startsWith(`${modality}/`)) return null;
		const contentText = buildMemoryMultimodalLabel(modality, normalizedPath);
		const dataHash = sha256Hex(buffer);
		const chunkHash = hashText(JSON.stringify({
			path: normalizedPath,
			contentText,
			mimeType,
			dataHash
		}));
		return {
			path: normalizedPath,
			absPath,
			mtimeMs: stat.mtimeMs,
			size: stat.size,
			hash: chunkHash,
			dataHash,
			kind: "multimodal",
			contentText,
			modality,
			mimeType
		};
	}
	let content;
	try {
		content = (await retryTransientMemoryRead(() => readRegularFile({ filePath: absPath }), `read memory index file ${absPath}`)).buffer.toString("utf-8");
	} catch (err) {
		if (isFileMissingError(err)) return null;
		throw err;
	}
	const hash = hashText(content);
	return {
		path: normalizedPath,
		absPath,
		mtimeMs: stat.mtimeMs,
		size: stat.size,
		hash,
		kind: "markdown"
	};
}
async function loadMultimodalEmbeddingInput(entry) {
	if (entry.kind !== "multimodal" || !entry.contentText || !entry.mimeType) return null;
	const regularFile = await statRegularFile(entry.absPath);
	if (regularFile.missing) return null;
	if (regularFile.stat.size !== entry.size) return null;
	let buffer;
	try {
		buffer = (await retryTransientMemoryRead(() => readRegularFile({
			filePath: entry.absPath,
			maxBytes: entry.size
		}), `read multimodal indexing file ${entry.absPath}`)).buffer;
	} catch (err) {
		if (isFileMissingError(err)) return null;
		throw err;
	}
	const dataHash = sha256Hex(buffer);
	if (entry.dataHash && entry.dataHash !== dataHash) return null;
	return {
		text: entry.contentText,
		parts: [{
			type: "text",
			text: entry.contentText
		}, {
			type: "inline-data",
			mimeType: entry.mimeType,
			data: buffer.toString("base64")
		}]
	};
}
async function buildMultimodalChunkForIndexing(entry) {
	const embeddingInput = await loadMultimodalEmbeddingInput(entry);
	if (!embeddingInput) return null;
	return {
		chunk: {
			startLine: 1,
			endLine: 1,
			text: entry.contentText ?? embeddingInput.text,
			hash: entry.hash,
			embeddingInput
		},
		structuredInputBytes: estimateStructuredEmbeddingInputBytes(embeddingInput)
	};
}
function runMemoryHostTasksWithConcurrency(tasks, limit) {
	return runWithConcurrency(tasks, limit);
}
//#endregion
export { listMemoryFiles as a, normalizeExtraMemoryPaths as c, isMemoryPath as i, runMemoryHostTasksWithConcurrency as l, buildMultimodalChunkForIndexing as n, matchesExtraMemoryPathEntry as o, ensureMemoryHostDir as r, normalizeExtraMemoryPathEntries as s, buildFileEntry as t, isExplicitExtraMarkdownFilePath as u };
