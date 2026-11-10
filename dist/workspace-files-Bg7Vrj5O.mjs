import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import { t as FsSafeError, w as root, y as resolveAbsolutePathForRead } from "./fs-safe-6Z4UiMS4.mjs";
import { n as detectMime } from "./mime-C3j3dfQb.mjs";
import "./git-CljZIJM8.mjs";
import { i as insideGitCheckout } from "./workspace-git-CiP8oVHR.mjs";
import { a as resolveToCwd } from "./path-utils-Bn-ftvxY.mjs";
import { t as WORKSPACE_PREVIEW_MAX_BYTES } from "./workspace-file-limits-loc-yzkf.mjs";
import { a as normalizeRelativePath, c as readWorkspaceFilePrefix, d as sortWorkspaceEntries, f as statWorkspacePath, g as workspaceRelativePath, h as updateWorkspaceFile, i as listWorkspacePath, l as resolveWorkspacePath, m as toWorkspaceBrowserEntry, n as decodeUtf8Strict, o as openWorkspaceRoot, p as toUpdatedAtMs, s as readWorkspaceFile, u as sortDirents } from "./workspace-fs-B8fFK4si.mjs";
import path from "node:path";
//#region src/shared/browser-image-mime-types.ts
const BROWSER_IMAGE_MIME_TYPES = /* @__PURE__ */ new Set([
	"image/avif",
	"image/gif",
	"image/jpeg",
	"image/png",
	"image/webp"
]);
//#endregion
//#region src/gateway/server-methods/session-file-read.ts
/** Containment is decided before probing host paths, including paths that do not exist. */
async function resolveSessionFileReadTarget(boundary, filePath) {
	if (!boundary.root) return;
	const absolutePath = resolveToCwd(filePath, boundary.fileRoot ?? boundary.root);
	if (isPathInside(boundary.root, absolutePath)) return {
		root: boundary.root,
		path: path.relative(boundary.root, absolutePath),
		absolutePath,
		outside: false
	};
	if (!await boundary.authorizeHostRead?.()) return "outside_session_boundary";
	try {
		const { canonicalPath } = await resolveAbsolutePathForRead(absolutePath, { symlinks: "follow" });
		return {
			root: await root(path.dirname(canonicalPath), {
				hardlinks: "allow",
				symlinks: "reject",
				nonBlockingRead: true,
				maxBytes: WORKSPACE_PREVIEW_MAX_BYTES
			}),
			path: path.basename(canonicalPath),
			absolutePath: canonicalPath,
			outside: true
		};
	} catch {
		return;
	}
}
//#endregion
//#region src/gateway/server-methods/workspace-files.ts
const MAX_BROWSER_ENTRIES = 250;
const MAX_SEARCH_ENTRIES = 500;
const MAX_SEARCH_VISITED_ENTRIES = 5e3;
const MIME_SNIFF_PREFIX_BYTES = 4100;
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
function buildSessionRelevanceMap(files, root, fileRoot) {
	const relevance = /* @__PURE__ */ new Map();
	if (!root) {
		for (const file of files) relevance.set(normalizeRelativePath(file.path), file.kind);
		return relevance;
	}
	for (const file of files) {
		const resolved = resolveTouchedFilePath({
			root,
			fileRoot,
			filePath: file.path
		});
		if (!resolved) continue;
		relevance.set(workspaceRelativePath(root, resolved), file.kind);
	}
	return relevance;
}
function displayNameForPath(filePath) {
	return path.basename(filePath) || filePath;
}
function isDetectedTextMime(mimeType) {
	return mimeType.startsWith("text/") || mimeType.endsWith("+xml") || DETECTED_TEXT_MIME_TYPES.has(mimeType);
}
async function populateSessionFilePreview(entry, buffer) {
	const mimeType = await detectMime({ buffer });
	if (mimeType && BROWSER_IMAGE_MIME_TYPES.has(mimeType)) {
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
		entry.hash = sha256Hex(buffer);
		return;
	}
	entry.previewKind = "unsupported";
	if (mimeType) entry.mimeType = mimeType;
}
async function toSessionFileEntry(touched, root, fileRoot, opts = {}) {
	const target = await resolveSessionFileReadTarget({
		root,
		fileRoot,
		authorizeHostRead: opts.authorizeHostRead
	}, touched.path);
	const base = {
		path: touched.path,
		name: displayNameForPath(touched.path),
		kind: touched.kind
	};
	if (!target || target === "outside_session_boundary") {
		if (target === "outside_session_boundary") opts.onOutsideBoundary?.();
		return {
			...base,
			missing: true
		};
	}
	const browserPath = target.path;
	const readRoot = target.outside ? target.root : opts.workspaceRoot ?? target.root;
	const stat = await statWorkspacePath(readRoot, browserPath, opts.assertCurrent);
	if (stat?.isDirectory && !opts.includeContent) return;
	if (!stat?.isFile) return {
		...base,
		missing: true
	};
	const entry = {
		...base,
		...target.outside ? { path: target.absolutePath } : {},
		workspacePath: target.outside ? target.absolutePath : browserPath,
		missing: false,
		size: stat.size,
		updatedAtMs: toUpdatedAtMs(stat.mtimeMs)
	};
	if (!opts.includeContent) return entry;
	const inline = stat.size <= WORKSPACE_PREVIEW_MAX_BYTES;
	const read = inline ? await readWorkspaceFile(readRoot, browserPath, { assertCurrent: opts.assertCurrent }) : await readWorkspaceFilePrefix(readRoot, browserPath, MIME_SNIFF_PREFIX_BYTES);
	if (!read) return {
		...base,
		missing: true
	};
	if (read === "too-large" || read === "unsupported") return entry;
	entry.workspacePath = target.outside ? target.absolutePath : read.canonicalPath;
	entry.size = read.stat.size;
	entry.updatedAtMs = toUpdatedAtMs(read.stat.mtimeMs);
	if (inline) {
		await populateSessionFilePreview(entry, read.buffer);
		if (read.readOnly || target.outside) delete entry.hash;
	} else {
		const mimeType = await detectMime({ buffer: read.buffer });
		if (!(decodeUtf8Strict(read.buffer) !== void 0) || mimeType && !isDetectedTextMime(mimeType)) {
			entry.previewKind = "unsupported";
			if (mimeType) entry.mimeType = mimeType;
		}
	}
	return entry;
}
function resolveSessionFileCandidates(params) {
	return [resolveTouchedFilePath(params), resolveWorkspacePath(params.root, params.filePath)].filter((candidate, index, all) => {
		return candidate !== void 0 && all.indexOf(candidate) === index;
	});
}
async function searchBrowserEntries(params) {
	const entries = [];
	const query = params.query.toLowerCase();
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
		const dirents = await listWorkspacePath(params.root, dir, params.assertCurrent);
		if (!dirents) return;
		for (const dirent of sortDirents(dirents)) {
			if (shouldStop()) return;
			visitedEntries += 1;
			const browserPath = dir ? `${dir}/${dirent.name}` : dirent.name;
			if (browserPath.toLowerCase().includes(query)) {
				const entry = toWorkspaceBrowserEntry(browserPath, dirent, params.relevance);
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
	if (search) return {
		path: "",
		search,
		...await searchBrowserEntries({
			root: params.workspaceRoot ?? params.root,
			query: search,
			relevance,
			assertCurrent: params.assertCurrent
		})
	};
	const browserPath = normalizeRelativePath(params.path);
	if (!resolveWorkspacePath(params.root, browserPath)) return;
	if (!(await statWorkspacePath(params.workspaceRoot ?? params.root, browserPath, params.assertCurrent))?.isDirectory) return;
	const dirents = await listWorkspacePath(params.workspaceRoot ?? params.root, browserPath, params.assertCurrent);
	if (!dirents) return;
	const entries = sortDirents(dirents).slice(0, 251).map((dirent) => {
		const entryPath = browserPath ? `${browserPath}/${dirent.name}` : dirent.name;
		return toWorkspaceBrowserEntry(entryPath, dirent, relevance);
	}).filter((entry) => Boolean(entry));
	const parent = path.dirname(browserPath);
	return {
		path: browserPath,
		...browserPath ? { parentPath: parent === "." ? "" : parent } : {},
		entries: sortWorkspaceEntries(entries.slice(0, MAX_BROWSER_ENTRIES)),
		...entries.length > MAX_BROWSER_ENTRIES ? { truncated: true } : {}
	};
}
async function listSessionWorkspaceFiles(params) {
	const root = params.root;
	const workspaceRoot = root ? await openWorkspaceRoot(root) : void 0;
	const gitCheckout = workspaceRoot && "access" in workspaceRoot ? void 0 : params.diffCwd ? insideGitCheckout(params.diffCwd) : void 0;
	const allowOutside = root && params.files.some((file) => !resolveTouchedFilePath({
		root,
		fileRoot: params.fileRoot,
		filePath: file.path
	})) && await params.authorizeHostRead?.();
	const workspaceFiles = root && !allowOutside ? params.files.filter((file) => Boolean(resolveTouchedFilePath({
		root,
		fileRoot: params.fileRoot,
		filePath: file.path
	}))) : params.files;
	const files = await Promise.all(workspaceFiles.map((file) => toSessionFileEntry(file, params.root, params.fileRoot, {
		workspaceRoot,
		assertCurrent: params.assertCurrent,
		authorizeHostRead: params.authorizeHostRead
	})));
	const browser = await buildBrowserResult({
		...params,
		root,
		fileRoot: params.fileRoot,
		workspaceRoot,
		files: workspaceFiles
	});
	return {
		...root ? { root } : {},
		...gitCheckout === void 0 ? {} : { gitCheckout },
		files: files.filter((file) => file !== void 0),
		...browser ? { browser } : {}
	};
}
async function getSessionWorkspaceFile(params) {
	let outsideBoundary = false;
	const options = {
		includeContent: true,
		assertCurrent: params.assertCurrent,
		authorizeHostRead: params.authorizeHostRead,
		onOutsideBoundary: () => {
			outsideBoundary = true;
		}
	};
	let touched = params.files.find((file) => file.path === params.path);
	if (!touched) {
		if (!params.root) return {};
		const candidates = resolveSessionFileCandidates({
			root: params.root,
			fileRoot: params.fileRoot,
			filePath: params.path
		});
		if (candidates.length > 0 && resolveTouchedFilePath({
			root: params.root,
			fileRoot: params.fileRoot,
			filePath: params.path
		})) {
			const relevance = buildSessionRelevanceMap(params.files, params.root, params.fileRoot);
			for (const candidate of candidates) {
				const browserPath = workspaceRelativePath(params.root, candidate);
				const file = await toSessionFileEntry({
					path: browserPath,
					kind: relevance.get(browserPath) === "modified" ? "modified" : "read"
				}, params.root, params.root, options);
				if (file && !file.missing) return {
					root: params.root,
					file
				};
			}
			return { root: params.root };
		}
		touched = {
			path: params.path,
			kind: "read"
		};
	}
	const file = await toSessionFileEntry(touched, params.root, params.fileRoot, options);
	return {
		...params.root ? { root: params.root } : {},
		file,
		...outsideBoundary ? { reason: "outside_session_boundary" } : {}
	};
}
async function setSessionWorkspaceFile(params) {
	if (params.content.includes("\0")) return { status: "unsafe" };
	const size = Buffer.byteLength(params.content, "utf8");
	if (size > 262144) return {
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
		const candidatePath = workspaceRelativePath(params.root, candidate);
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
export { setSessionWorkspaceFile as a, resolveFileRoot as i, listSessionWorkspaceFiles as n, resolveSessionFileReadTarget as o, populateSessionFilePreview as r, getSessionWorkspaceFile as t };
