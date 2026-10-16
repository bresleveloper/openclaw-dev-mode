import { j as resolveIntegerOption } from "./number-coercion-CuVhdCBs.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { c as shouldSkipRootMemoryAuxiliaryPath, i as resolveCanonicalRootMemoryFile } from "./root-memory-files-BUq0D-EI.mjs";
import { a as resolveMemoryHostSearchPathConfig, i as resolveMemoryHostAgentWorkspaceDir, n as normalizeConfiguredMemoryExtraPaths, r as resolveMemoryHostAgentContextLimits } from "./config-utils-DnfHy8-v.mjs";
import { n as detectMime } from "./mime-CGDYrRzL.mjs";
import { i as getAgentWorkspaceAccess } from "./workspace-access-CeRsYrid.mjs";
import { t as estimateStructuredEmbeddingInputBytes } from "./embedding-input-limits-Dzm_zeQC.mjs";
import { a as root, i as readRegularFile, n as isPathInside, o as statRegularFile, s as walkDirectory, t as isFileMissingError } from "./fs-utils-CK0xaytO.mjs";
import { t as hashText } from "./hash-BOTtT1fO.mjs";
import { n as buildMemoryMultimodalLabel, r as classifyMemoryMultimodalPath } from "./multimodal-B9eYMDXo.mjs";
import { n as retryTransientMemoryRead } from "./read-retry-Qn2FTJ6v.mjs";
import "./markdown-chunks-XgYdcem0.mjs";
import "./concurrency-BvONODc2.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { homedir } from "node:os";
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
function matchesExtraMemoryPathEntry(entry, candidatePath, options) {
	if (!entry.pattern) return true;
	const relativePath = path.relative(entry.path, candidatePath);
	try {
		if (!relativePath) return true;
		if (!isPathInside(entry.path, candidatePath)) return false;
		const normalizedRelativePath = relativePath.replaceAll(path.sep, "/");
		if (!options?.directory) return path.posix.matchesGlob(normalizedRelativePath, entry.pattern);
		const segments = entry.pattern.split("/");
		if (/[{[(]/.test(entry.pattern) || segments.some((segment) => segment === "." || segment === "..")) return true;
		const parentCount = segments.at(-1) === "**" ? segments.length : segments.length - 1;
		for (let length = 1; length <= parentCount; length += 1) if (path.posix.matchesGlob(normalizedRelativePath, segments.slice(0, length).join("/"))) return true;
		return false;
	} catch {
		return false;
	}
}
function isMemoryPath(relPath) {
	const normalized = relPath.trim().replace(/^[./]+/, "").replace(/\\/g, "/");
	if (!normalized) return false;
	if (normalized === "MEMORY.md" || normalized === "USER.md" || normalized.toLowerCase() === "dreams.md") return true;
	return normalized.startsWith("memory/");
}
function isAllowedMemoryFilePath(filePath, multimodal) {
	if (filePath.endsWith(".md")) return true;
	return classifyMemoryMultimodalPath(filePath, multimodal ?? DISABLED_MULTIMODAL_SETTINGS) !== null;
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
async function collectMemoryFilesFromDir(dir, files, multimodal, shouldSkipPath, extraPathEntries) {
	const scan = await scanMemorySource(dir, () => walkDirectory(dir, {
		symlinks: "skip",
		descend: (entry) => !shouldSkipPath?.(entry.path) && entry.kind === "directory" && entry.name !== ".openclaw-repair" && (!extraPathEntries || extraPathEntries.some((extraPathEntry) => matchesExtraMemoryPathEntry(extraPathEntry, entry.path, { directory: true }))),
		include: (entry) => !shouldSkipPath?.(entry.path) && entry.kind === "file" && isAllowedMemoryFilePath(entry.path, multimodal) && (!extraPathEntries || extraPathEntries.some((extraPathEntry) => matchesExtraMemoryPathEntry(extraPathEntry, entry.path)))
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
	const extraPathsByRoot = /* @__PURE__ */ new Map();
	for (const entry of normalizeExtraMemoryPathEntries(workspaceDir, extraPaths)) {
		const entries = extraPathsByRoot.get(entry.path);
		if (entries) entries.push(entry);
		else extraPathsByRoot.set(entry.path, [entry]);
	}
	for (const [inputPath, entries] of extraPathsByRoot) {
		if (shouldSkipWorkspaceMemoryPath(inputPath)) continue;
		try {
			const stat = await scanMemorySource(inputPath, () => fs$1.lstat(inputPath));
			if (stat.isSymbolicLink()) {
				onSkippedSymlinkRoot?.(inputPath);
				continue;
			}
			if (stat.isDirectory()) {
				await collectMemoryFilesFromDir(inputPath, result, multimodal, shouldSkipWorkspaceMemoryPath, entries);
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
	if (modality && stat.size > multimodalSettings.maxFileBytes) return null;
	let buffer;
	try {
		buffer = (await retryTransientMemoryRead(() => readRegularFile({
			filePath: absPath,
			maxBytes: modality ? multimodalSettings.maxFileBytes : void 0
		}), modality ? `read multimodal memory file ${absPath}` : `read memory index file ${absPath}`)).buffer;
	} catch (err) {
		if (isFileMissingError(err)) return null;
		throw err;
	}
	if (modality) {
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
	return {
		path: normalizedPath,
		absPath,
		mtimeMs: stat.mtimeMs,
		size: stat.size,
		hash: hashText(buffer.toString("utf-8")),
		kind: "markdown"
	};
}
async function buildMultimodalChunkForIndexing(entry) {
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
	const embeddingInput = {
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
//#endregion
//#region packages/memory-host-sdk/src/host/read-file-shared.ts
/** Default number of lines returned by memory read helpers. */
const DEFAULT_MEMORY_READ_LINES = 120;
/** Default max character budget for memory read helper output. */
const DEFAULT_MEMORY_READ_MAX_CHARS = 12e3;
/** Build the continuation notice appended to truncated memory excerpts. */
function buildContinuationNotice(params) {
	const base = typeof params.nextFrom === "number" ? `[More content available. Use from=${params.nextFrom} to continue.]` : "[More content available. Requested excerpt exceeded the default maxChars budget.]";
	const fallback = params.suggestReadFallback ? " If you need the full raw line, use read on the source file." : "";
	return `\n\n${base.slice(0, -1)}${fallback}]`;
}
/** Fit line slices to the response character budget while preserving line boundaries. */
function fitLinesToCharBudget(params) {
	const { lines, maxChars } = params;
	let includedLines = 0;
	let chars = 0;
	for (const line of lines) {
		const nextChars = chars + line.length + (includedLines > 0 ? 1 : 0);
		if (includedLines > 0 && nextChars > maxChars) break;
		includedLines += 1;
		chars = nextChars;
	}
	return {
		text: truncateUtf16Safe(lines.slice(0, includedLines).join("\n"), maxChars),
		includedLines,
		hardTruncatedSingleLine: chars > maxChars
	};
}
/** Build a memory read result from an already-selected line slice. */
function buildMemoryReadResultFromSlice(params) {
	const start = resolveIntegerOption(params.startLine, 1, { min: 1 });
	const fitted = fitLinesToCharBudget({
		lines: params.selectedLines,
		maxChars: resolveIntegerOption(params.maxChars, DEFAULT_MEMORY_READ_MAX_CHARS, { min: 1 })
	});
	const moreSourceLinesRemain = params.moreSourceLinesRemain ?? false;
	const charCapTruncated = fitted.hardTruncatedSingleLine || fitted.includedLines < params.selectedLines.length;
	const nextFrom = !fitted.hardTruncatedSingleLine && (moreSourceLinesRemain || fitted.includedLines < params.selectedLines.length) ? start + fitted.includedLines : void 0;
	const truncated = charCapTruncated || moreSourceLinesRemain;
	return {
		status: "ok",
		text: truncated && (fitted.text || fitted.hardTruncatedSingleLine) ? `${fitted.text}${buildContinuationNotice({
			nextFrom,
			suggestReadFallback: fitted.hardTruncatedSingleLine && params.suggestReadFallback
		})}` : fitted.text,
		path: params.relPath,
		from: start,
		lines: fitted.includedLines,
		...truncated ? { truncated: true } : {},
		...typeof nextFrom === "number" ? { nextFrom } : {}
	};
}
/** Build a memory read result from raw file content and caller range options. */
function buildMemoryReadResult(params) {
	const fileLines = params.content.split("\n");
	if (fileLines.at(-1) === "") fileLines.pop();
	const start = resolveIntegerOption(params.from, 1, { min: 1 });
	const requestedCount = resolveIntegerOption(params.lines ?? params.defaultLines, 120, { min: 1 });
	const selectedLines = fileLines.slice(start - 1, start - 1 + requestedCount);
	const moreSourceLinesRemain = start - 1 + selectedLines.length < fileLines.length;
	return buildMemoryReadResultFromSlice({
		selectedLines,
		relPath: params.relPath,
		startLine: start,
		moreSourceLinesRemain,
		maxChars: params.maxChars,
		suggestReadFallback: params.suggestReadFallback
	});
}
//#endregion
//#region packages/memory-host-sdk/src/host/read-file.ts
function memoryPathNotAllowed() {
	return Object.assign(/* @__PURE__ */ new Error("path is not an allowed Markdown memory file"), { code: "MEMORY_PATH_NOT_ALLOWED" });
}
/** Read a validated memory markdown file from workspace or configured extra paths. */
async function readMemoryFile(params) {
	const rawPath = params.relPath.trim();
	if (!rawPath) throw new Error("path required");
	const absPath = path.isAbsolute(rawPath) ? path.resolve(rawPath) : path.resolve(params.workspaceDir, rawPath);
	const relPath = path.relative(params.workspaceDir, absPath).replace(/\\/g, "/");
	const allowedWorkspace = relPath.length > 0 && !relPath.startsWith("..") && !path.isAbsolute(relPath) && isMemoryPath(relPath);
	const notFound = () => ({
		status: "not_found",
		text: "",
		path: relPath
	});
	const readFromRoot = async (directory) => {
		const filesystem = await root(directory, {
			hardlinks: "allow",
			maxBytes: Infinity,
			symlinks: allowedWorkspace ? "follow-parents-within-root" : "reject"
		});
		let content;
		try {
			content = (await retryTransientMemoryRead(async () => {
				try {
					return await filesystem.read(`./${path.relative(directory, absPath)}`);
				} catch (err) {
					if (err instanceof Error && "code" in err && err.code === "outside-workspace" && err.cause instanceof Error && "code" in err.cause && !isFileMissingError(err.cause) && err.cause.code !== "ELOOP") throw err.cause;
					throw err;
				}
			}, `read memory file ${absPath}`)).buffer.toString("utf-8");
		} catch (err) {
			const code = err && typeof err === "object" && "code" in err ? err.code : void 0;
			if (code === "not-file") throw new Error("path must be a regular file", { cause: err });
			if (code !== "ENOTDIR" && (isFileMissingError(err) || code === "path-mismatch")) return notFound();
			throw err;
		}
		return buildMemoryReadResult({
			content,
			relPath,
			from: params.from,
			lines: params.lines,
			defaultLines: params.defaultLines ?? 120,
			maxChars: params.maxChars,
			suggestReadFallback: allowedWorkspace
		});
	};
	if (allowedWorkspace) {
		if (!absPath.endsWith(".md")) throw memoryPathNotAllowed();
		try {
			return await readFromRoot(params.workspaceDir);
		} catch (err) {
			if (isFileMissingError(err)) return notFound();
			throw err;
		}
	}
	let additionalPathError;
	if ((params.extraPaths?.length ?? 0) > 0) {
		const additionalPaths = normalizeExtraMemoryPathEntries(params.workspaceDir, params.extraPaths);
		for (const additionalPath of additionalPaths) {
			const matchesFile = absPath === additionalPath.path && isExplicitExtraMarkdownFilePath(absPath);
			const matchesDirectory = absPath.endsWith(".md") && isPathInside(additionalPath.path, absPath) && matchesExtraMemoryPathEntry(additionalPath, absPath);
			if (!matchesFile && !matchesDirectory) continue;
			try {
				const stat = await fs$1.lstat(additionalPath.path);
				if (stat.isSymbolicLink()) continue;
				if (stat.isDirectory() && matchesDirectory) return await readFromRoot(additionalPath.path);
				if (stat.isFile() && matchesFile) return await readFromRoot(path.dirname(additionalPath.path));
			} catch (err) {
				const code = err && typeof err === "object" && "code" in err ? err.code : void 0;
				if (err instanceof Error && !isFileMissingError(err) && code !== "symlink" && code !== "outside-workspace") additionalPathError ??= err;
			}
		}
	}
	throw additionalPathError ?? memoryPathNotAllowed();
}
/** Resolve agent memory config and read one memory file for that agent. */
async function readAgentMemoryFile(params) {
	const settings = resolveMemoryHostSearchPathConfig(params.cfg, params.agentId);
	if (!settings) throw new Error("memory search disabled");
	const contextLimits = resolveMemoryHostAgentContextLimits(params.cfg, params.agentId);
	const workspaceDir = resolveMemoryHostAgentWorkspaceDir(params.cfg, params.agentId);
	return await (getAgentWorkspaceAccess(workspaceDir, "memoryFiles")?.memoryFiles?.readFile ?? readMemoryFile)({
		workspaceDir,
		extraPaths: settings.extraPaths,
		relPath: params.relPath,
		from: params.from,
		lines: params.lines,
		maxChars: contextLimits?.memoryGetMaxChars
	});
}
//#endregion
export { buildMemoryReadResult as a, buildMultimodalChunkForIndexing as c, matchesExtraMemoryPathEntry as d, normalizeExtraMemoryPathEntries as f, DEFAULT_MEMORY_READ_MAX_CHARS as i, ensureMemoryHostDir as l, readMemoryFile as n, buildMemoryReadResultFromSlice as o, normalizeExtraMemoryPaths as p, DEFAULT_MEMORY_READ_LINES as r, buildFileEntry as s, readAgentMemoryFile as t, listMemoryFiles as u };
