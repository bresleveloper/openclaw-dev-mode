import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as FsSafeError } from "./fs-safe-BAPek8At.mjs";
import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { n as detectMime } from "./mime-1zBUMwu6.mjs";
import { o as insideGitCheckout } from "./git-DSwuA7YL.mjs";
import { a as resolveToCwd } from "./path-utils-BX048BMU.mjs";
import { a as normalizeRelativePath, c as readWorkspaceFilePrefix, d as sortWorkspaceEntries, f as statWorkspacePath, i as listWorkspacePath, l as resolveWorkspacePath, m as updateWorkspaceFile, n as decodeUtf8Strict, o as openWorkspaceRoot, p as toUpdatedAtMs, s as readWorkspaceFile, t as WORKSPACE_PREVIEW_MAX_BYTES, u as sortDirents } from "./workspace-fs-DfgXp1be.mjs";
import path from "node:path";
import { createHash } from "node:crypto";
//#region src/gateway/server-methods/workspace-files.ts
const MAX_PREVIEW_BYTES = WORKSPACE_PREVIEW_MAX_BYTES;
const MAX_BROWSER_ENTRIES = 250;
const MAX_SEARCH_ENTRIES = 500;
const MAX_SEARCH_VISITED_ENTRIES = 5e3;
const MIME_SNIFF_PREFIX_BYTES = 4100;
const BROWSER_PREVIEW_IMAGE_MIME_TYPES = /* @__PURE__ */ new Set([
	"image/avif",
	"image/gif",
	"image/jpeg",
	"image/png",
	"image/webp"
]);
const DETECTED_TEXT_MIME_TYPES = /* @__PURE__ */ new Set([
	"application/rtf",
	"application/xml",
	"application/x-ms-regedit",
	"model/stl"
]);
const SEARCH_SKIP_DIRS = /* @__PURE__ */ new Set([
	".git",
	".hg",
	".next",
	".turbo",
	".yarn",
	"coverage",
	"dist",
	"node_modules"
]);
function toDisplayPath(root, resolved) {
	const relative = path.relative(root, resolved);
	if (!relative) return "";
	return relative.split(path.sep).join("/");
}
function resolveTouchedFilePath(params) {
	if (!params.root) return;
	const base = params.fileRoot ?? params.root;
	const resolved = resolveToCwd(params.filePath, base);
	if (!isPathInside(params.root, resolved)) return;
	return resolved;
}
function resolveFileRoot(params) {
	if (!params.root) return;
	if (!params.spawnedCwd) return params.root;
	const resolvedCwd = path.resolve(params.spawnedCwd);
	const resolvedRoot = path.resolve(params.root);
	return isPathInside(resolvedRoot, resolvedCwd) ? params.spawnedCwd : params.root;
}
function relevanceForKind(kind) {
	return kind;
}
function mergeRelevance(current, next) {
	if (!current) return next;
	if (!next || current === next) return current;
	return "mixed";
}
function buildSessionRelevanceMap(files, root, fileRoot) {
	const relevance = /* @__PURE__ */ new Map();
	if (!root) {
		for (const file of files) relevance.set(normalizeRelativePath(file.path), relevanceForKind(file.kind));
		return relevance;
	}
	for (const file of files) {
		const resolved = resolveTouchedFilePath({
			root,
			fileRoot,
			filePath: file.path
		});
		if (!resolved) continue;
		relevance.set(toDisplayPath(root, resolved), relevanceForKind(file.kind));
	}
	return relevance;
}
function relevanceForBrowserPath(browserPath, kind, relevance) {
	if (kind === "file") return relevance.get(browserPath);
	const prefix = browserPath ? `${browserPath}/` : "";
	let aggregate;
	for (const [filePath, sessionKind] of relevance) if (filePath.startsWith(prefix) && filePath !== browserPath) aggregate = mergeRelevance(aggregate, sessionKind);
	return aggregate;
}
function displayNameForPath(filePath) {
	return path.basename(filePath) || filePath;
}
function isDetectedTextMime(mimeType) {
	return mimeType.startsWith("text/") || mimeType.endsWith("+xml") || DETECTED_TEXT_MIME_TYPES.has(mimeType);
}
function applyInlineFilePreview(entry, buffer, mimeType) {
	if (mimeType && BROWSER_PREVIEW_IMAGE_MIME_TYPES.has(mimeType)) {
		entry.mimeType = mimeType;
		entry.contentEncoding = "base64";
		entry.previewKind = "image";
		entry.content = buffer.toString("base64");
		return;
	}
	const text = decodeUtf8Strict(buffer);
	if ((!mimeType || isDetectedTextMime(mimeType)) && text !== void 0) {
		entry.mimeType = mimeType ?? "text/plain";
		entry.contentEncoding = "utf8";
		entry.previewKind = "text";
		entry.content = text;
		entry.hash = createHash("sha256").update(buffer).digest("hex");
		return;
	}
	entry.previewKind = "unsupported";
	if (mimeType) entry.mimeType = mimeType;
}
async function populateSessionFilePreview(entry, buffer) {
	applyInlineFilePreview(entry, buffer, await detectMime({ buffer }));
}
function applyOversizedFileMetadata(entry, buffer, mimeType) {
	const prefixIsText = decodeUtf8Strict(buffer) !== void 0;
	if (!mimeType && prefixIsText || mimeType && isDetectedTextMime(mimeType) && prefixIsText) return;
	entry.previewKind = "unsupported";
	if (mimeType) entry.mimeType = mimeType;
}
async function toSessionFileEntry(touched, root, fileRoot, opts = {}) {
	const resolved = resolveTouchedFilePath({
		root,
		fileRoot,
		filePath: touched.path
	});
	const base = {
		path: touched.path,
		name: displayNameForPath(touched.path),
		kind: touched.kind
	};
	if (!resolved) return {
		...base,
		missing: true
	};
	const browserPath = toDisplayPath(root, resolved);
	const stat = await statWorkspacePath(opts.workspaceRoot ?? root, browserPath);
	if (!stat?.isFile) return {
		...base,
		missing: true
	};
	const entry = {
		...base,
		workspacePath: browserPath,
		missing: false,
		size: stat.size,
		updatedAtMs: toUpdatedAtMs(stat.mtimeMs)
	};
	if (!opts.includeContent) return entry;
	if (stat.size <= MAX_PREVIEW_BYTES) {
		const read = await readWorkspaceFile(root, browserPath);
		if (!read) return {
			...base,
			missing: true
		};
		if (read === "too-large") return entry;
		entry.workspacePath = read.canonicalPath;
		entry.size = read.stat.size;
		entry.updatedAtMs = toUpdatedAtMs(read.stat.mtimeMs);
		await populateSessionFilePreview(entry, read.buffer);
		return entry;
	}
	const prefix = await readWorkspaceFilePrefix(root, browserPath, MIME_SNIFF_PREFIX_BYTES);
	if (!prefix) return {
		...base,
		missing: true
	};
	entry.workspacePath = prefix.canonicalPath;
	entry.size = prefix.stat.size;
	entry.updatedAtMs = toUpdatedAtMs(prefix.stat.mtimeMs);
	const mimeType = await detectMime({ buffer: prefix.buffer });
	applyOversizedFileMetadata(entry, prefix.buffer, mimeType);
	return entry;
}
function resolveSessionFileCandidates(params) {
	return [resolveTouchedFilePath(params), resolveWorkspacePath(params.root, params.filePath)].filter((candidate, index, all) => {
		return candidate !== void 0 && all.indexOf(candidate) === index;
	});
}
async function toBrowserEntry(browserPath, dirent, relevance) {
	const kind = dirent.isFile ? "file" : dirent.isDirectory ? "directory" : null;
	if (!kind) return;
	const sessionKind = relevanceForBrowserPath(browserPath, kind, relevance);
	return {
		path: browserPath,
		name: dirent.name,
		kind,
		...kind === "file" ? { size: dirent.size } : {},
		updatedAtMs: toUpdatedAtMs(dirent.mtimeMs),
		...sessionKind ? { sessionKind } : {}
	};
}
function matchesSearch(entryPath, name, query) {
	const normalizedQuery = query.toLowerCase();
	return name.toLowerCase().includes(normalizedQuery) || entryPath.toLowerCase().includes(normalizedQuery);
}
async function searchBrowserEntries(params) {
	const entries = [];
	let visitedEntries = 0;
	let truncated = false;
	const shouldStop = () => {
		if (entries.length >= MAX_SEARCH_ENTRIES || visitedEntries >= MAX_SEARCH_VISITED_ENTRIES) {
			truncated = true;
			return true;
		}
		return false;
	};
	const visit = async (dir) => {
		if (shouldStop()) return;
		const dirents = await listWorkspacePath(params.root, dir);
		if (!dirents) return;
		for (const dirent of sortDirents(dirents)) {
			if (shouldStop()) return;
			visitedEntries += 1;
			const browserPath = dir ? `${dir}/${dirent.name}` : dirent.name;
			if (matchesSearch(browserPath, dirent.name, params.query)) {
				const entry = await toBrowserEntry(browserPath, dirent, params.relevance);
				if (entry) entries.push(entry);
			}
			if (dirent.isDirectory && !SEARCH_SKIP_DIRS.has(dirent.name)) await visit(browserPath);
		}
	};
	await visit("");
	return {
		entries: sortWorkspaceEntries(entries),
		...truncated ? { truncated } : {}
	};
}
async function buildBrowserResult(params) {
	if (!params.root) return;
	const search = normalizeOptionalString(params.search);
	const relevance = buildSessionRelevanceMap(params.files, params.root, params.fileRoot);
	if (search) {
		const result = await searchBrowserEntries({
			root: params.workspaceRoot ?? params.root,
			query: search,
			relevance
		});
		return {
			path: "",
			search,
			entries: result.entries,
			...result.truncated ? { truncated: result.truncated } : {}
		};
	}
	const browserPath = normalizeRelativePath(params.path);
	if (!resolveWorkspacePath(params.root, browserPath)) return;
	if (!(await statWorkspacePath(params.workspaceRoot ?? params.root, browserPath))?.isDirectory) return;
	const dirents = await listWorkspacePath(params.workspaceRoot ?? params.root, browserPath);
	if (!dirents) return;
	const entries = (await Promise.all(sortDirents(dirents).slice(0, 251).map((dirent) => {
		return toBrowserEntry(browserPath ? `${browserPath}/${dirent.name}` : dirent.name, dirent, relevance);
	}))).filter((entry) => Boolean(entry));
	const parent = path.dirname(browserPath);
	return {
		path: browserPath,
		...browserPath ? { parentPath: parent === "." ? "" : parent } : {},
		entries: sortWorkspaceEntries(entries.slice(0, MAX_BROWSER_ENTRIES)),
		...entries.length > MAX_BROWSER_ENTRIES ? { truncated: true } : {}
	};
}
async function listSessionWorkspaceFiles(params) {
	const loaded = params;
	const root = loaded.root;
	const gitCheckout = loaded.diffCwd ? insideGitCheckout(loaded.diffCwd) : void 0;
	const workspaceRoot = root ? await openWorkspaceRoot(root) : void 0;
	const workspaceFiles = root ? loaded.files.filter((file) => Boolean(resolveTouchedFilePath({
		root,
		fileRoot: loaded.fileRoot,
		filePath: file.path
	}))) : loaded.files;
	const files = await Promise.all(workspaceFiles.map((file) => toSessionFileEntry(file, loaded.root, loaded.fileRoot, { workspaceRoot })));
	const browser = await buildBrowserResult({
		root,
		workspaceRoot,
		fileRoot: loaded.fileRoot,
		path: params.path,
		search: params.search,
		files: workspaceFiles
	});
	return {
		...root ? { root } : {},
		...gitCheckout === void 0 ? {} : { gitCheckout },
		files,
		...browser ? { browser } : {}
	};
}
async function getSessionWorkspaceFile(params) {
	const loaded = params;
	const exactTouched = loaded.files.find((file) => file.path === params.path);
	if (exactTouched) return {
		...loaded.root ? { root: loaded.root } : {},
		file: await toSessionFileEntry(exactTouched, loaded.root, loaded.fileRoot, { includeContent: true })
	};
	if (!loaded.root) return {};
	const candidates = resolveSessionFileCandidates({
		root: loaded.root,
		fileRoot: loaded.fileRoot,
		filePath: params.path
	});
	if (candidates.length === 0) return { root: loaded.root };
	const relevance = buildSessionRelevanceMap(loaded.files, loaded.root, loaded.fileRoot);
	for (const candidate of candidates) {
		const browserPath = toDisplayPath(loaded.root, candidate);
		const file = await toSessionFileEntry({
			path: browserPath,
			kind: relevance.get(browserPath) === "modified" ? "modified" : "read"
		}, loaded.root, loaded.root, { includeContent: true });
		if (!file.missing) return {
			root: loaded.root,
			file
		};
	}
	return { root: loaded.root };
}
async function setSessionWorkspaceFile(params) {
	if (params.content.includes("\0")) return { status: "unsafe" };
	const size = Buffer.byteLength(params.content, "utf8");
	if (size > MAX_PREVIEW_BYTES) return {
		status: "too-large",
		size
	};
	if (Buffer.from(params.content, "utf8").toString("utf8") !== params.content) return { status: "unsafe" };
	if (!params.root) return { status: "missing" };
	const candidates = resolveSessionFileCandidates({
		root: params.root,
		fileRoot: params.fileRoot,
		filePath: params.path
	});
	let browserPath;
	for (const candidate of candidates) {
		const candidatePath = toDisplayPath(params.root, candidate);
		if ((await statWorkspacePath(params.root, candidatePath))?.isFile) {
			browserPath = candidatePath;
			break;
		}
	}
	if (!browserPath) return { status: "missing" };
	let update;
	try {
		update = await updateWorkspaceFile(params.root, browserPath, params.content, params.expectedHash, params.assertCurrent);
	} catch (error) {
		if (!(error instanceof FsSafeError)) throw error;
		return { status: "unsafe" };
	}
	if (update.status !== "updated") return update;
	return {
		status: "updated",
		root: params.root,
		file: {
			path: params.path,
			workspacePath: update.canonicalPath,
			name: displayNameForPath(update.canonicalPath),
			kind: "modified",
			missing: false,
			size: update.stat.size,
			updatedAtMs: toUpdatedAtMs(update.stat.mtimeMs),
			hash: update.hash
		}
	};
}
//#endregion
export { setSessionWorkspaceFile as a, resolveFileRoot as i, listSessionWorkspaceFiles as n, populateSessionFilePreview as r, getSessionWorkspaceFile as t };
