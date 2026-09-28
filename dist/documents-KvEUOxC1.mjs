import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import { f as sanitizeUntrustedFileName } from "./fs-safe-advanced-CJC-NYf3.mjs";
import { w as root } from "./fs-safe-BAPek8At.mjs";
import "./utils-aKqR_F_U.mjs";
import { E as resolveStateDir } from "./paths-DehQwyE0.mjs";
import { t as escapeHtml } from "./html-escape-BMD_QFeA.mjs";
import { t as CANVAS_DOCUMENTS_PATH } from "./constants-Cm4bJJ1Q.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region src/canvas/documents.ts
/** Core Canvas document materialization and hosted-path resolution. */
const CANVAS_DOCUMENT_READ_MAX_BYTES = 2097152;
function isPdfPathLike(value) {
	return /\.pdf(?:[?#].*)?$/i.test(value.trim());
}
function buildPdfWrapper(url) {
	const escaped = escapeHtml(url);
	return `<!doctype html><html><body style="margin:0;background:#e5e7eb;"><object data="${escaped}" type="application/pdf" style="width:100%;height:100vh;border:0;"><iframe src="${escaped}" style="width:100%;height:100vh;border:0;"></iframe><p style="padding:16px;font:14px system-ui,sans-serif;">Unable to render PDF preview. <a href="${escaped}" target="_blank" rel="noopener noreferrer">Open PDF</a>.</p></object></body></html>`;
}
function hasControlCharacter(value) {
	for (const char of value) {
		const code = char.charCodeAt(0);
		if (code < 32 || code === 127) return true;
	}
	return false;
}
function normalizeLogicalPath(value) {
	const parts = value.replaceAll("\\", "/").replace(/^\/+/, "").split("/").filter(Boolean);
	if (parts.length === 0 || parts.some((part) => part === "." || part === ".." || part.includes(":") || hasControlCharacter(part))) throw new Error("canvas document logicalPath invalid");
	return parts.join("/");
}
function canvasDocumentId() {
	return `cv_${randomUUID().replaceAll("-", "")}`;
}
function normalizeCanvasDocumentId(value) {
	const normalized = value.trim();
	if (!normalized || normalized === "." || normalized === ".." || !/^[A-Za-z0-9._-]+$/.test(normalized)) throw new Error("canvas document id invalid");
	return normalized;
}
/** Stable root for existing and newly created Canvas documents. */
function resolveCanvasDocumentsDir(stateDir = resolveStateDir()) {
	return path.resolve(stateDir, "canvas", "documents");
}
/** Reads the managed HTML entrypoint for a core Canvas document. */
async function readCanvasDocumentHtmlSource(documentId, options) {
	const id = normalizeCanvasDocumentId(documentId);
	const root$1 = await root(resolveCanvasDocumentsDir(options?.stateDir), { maxBytes: CANVAS_DOCUMENT_READ_MAX_BYTES });
	const manifest = await root$1.readJson(`${id}/manifest.json`);
	if (manifest.id !== id || typeof manifest.localEntrypoint !== "string") throw new Error(`canvas document has no local entrypoint: ${id}`);
	const entrypoint = normalizeLogicalPath(manifest.localEntrypoint);
	if (!entrypoint.toLowerCase().endsWith(".html")) throw new Error(`canvas document entrypoint is not HTML: ${id}`);
	return {
		html: await root$1.readText(`${id}/${entrypoint}`, { maxBytes: options?.maxBytes ?? CANVAS_DOCUMENT_READ_MAX_BYTES }),
		...manifest.cspSandbox === "scripts" ? { cspSandbox: "scripts" } : {}
	};
}
async function pruneCanvasDocumentsForScope(params) {
	const entries = await fs.readdir(params.documentsDir, { withFileTypes: true });
	const scopedDocuments = (await Promise.all(entries.filter((entry) => entry.isDirectory()).map(async (entry) => {
		try {
			const manifest = JSON.parse(await fs.readFile(path.join(params.documentsDir, entry.name, "manifest.json"), "utf8"));
			if (manifest.retentionScope !== params.retentionScope || typeof manifest.createdAt !== "string") return null;
			return {
				id: entry.name,
				createdAt: manifest.createdAt
			};
		} catch {
			return null;
		}
	}))).filter((entry) => entry !== null);
	const deleteCount = Math.max(0, scopedDocuments.length - params.maxDocuments);
	const oldest = scopedDocuments.toSorted((left, right) => left.createdAt.localeCompare(right.createdAt) || left.id.localeCompare(right.id)).slice(0, deleteCount);
	await Promise.all(oldest.map((entry) => fs.rm(path.join(params.documentsDir, entry.id), {
		recursive: true,
		force: true
	})));
}
/** Resolves the on-disk directory for one Canvas document id. */
function resolveCanvasDocumentDir(documentId, options) {
	return path.join(resolveCanvasDocumentsDir(options?.stateDir), documentId);
}
/** Builds the hosted URL path for a Canvas document entrypoint. */
function buildCanvasDocumentEntryUrl(documentId, entrypoint) {
	const encodedEntrypoint = normalizeLogicalPath(entrypoint).split("/").map((segment) => encodeURIComponent(segment)).join("/");
	return `${CANVAS_DOCUMENTS_PATH}/${encodeURIComponent(documentId)}/${encodedEntrypoint}`;
}
/** Maps a Canvas hosted document URL path back to its managed local file. */
function resolveCanvasHttpPathToLocalPath(requestPath, options) {
	const trimmed = requestPath.trim();
	const prefix = `${CANVAS_DOCUMENTS_PATH}/`;
	if (!trimmed.startsWith(prefix)) return null;
	const relative = trimmed.replace(/[?#].*$/, "").slice(prefix.length);
	const segments = [];
	for (const segment of relative.split("/")) {
		if (!segment) continue;
		try {
			segments.push(decodeURIComponent(segment));
		} catch {
			return null;
		}
	}
	if (segments.length < 2) return null;
	const [rawDocumentId, ...entrySegments] = segments;
	if (!rawDocumentId) return null;
	try {
		const documentId = normalizeCanvasDocumentId(rawDocumentId);
		const normalizedEntrypoint = normalizeLogicalPath(entrySegments.join("/"));
		const documentsDir = resolveCanvasDocumentsDir(options?.stateDir);
		const candidatePath = path.resolve(resolveCanvasDocumentDir(documentId, options), normalizedEntrypoint);
		if (!candidatePath.startsWith(`${documentsDir}${path.sep}`)) return null;
		return candidatePath;
	} catch {
		return null;
	}
}
async function copyAssets(root, assets, workspaceDir) {
	const copied = [];
	for (const asset of assets ?? []) {
		const logicalPath = normalizeLogicalPath(asset.logicalPath);
		const sourcePath = asset.sourcePath.startsWith("~") ? resolveUserPath(asset.sourcePath) : path.isAbsolute(asset.sourcePath) ? path.resolve(asset.sourcePath) : path.resolve(workspaceDir, asset.sourcePath);
		await root.copyIn(logicalPath, sourcePath);
		copied.push({
			logicalPath,
			...asset.contentType ? { contentType: asset.contentType } : {}
		});
	}
	return copied;
}
async function materializeEntrypoint(rootDir, root, input, workspaceDir) {
	const entrypoint = input.entrypoint;
	if (!entrypoint) throw new Error("canvas document entrypoint required");
	if (entrypoint.type === "html") {
		const fileName = "index.html";
		await root.write(fileName, entrypoint.value);
		return {
			localEntrypoint: fileName,
			entryUrl: buildCanvasDocumentEntryUrl(path.basename(rootDir), fileName)
		};
	}
	if (entrypoint.type === "url") {
		if (input.kind === "document" && isPdfPathLike(entrypoint.value)) {
			const fileName = "index.html";
			await root.write(fileName, buildPdfWrapper(entrypoint.value));
			return {
				localEntrypoint: fileName,
				externalUrl: entrypoint.value,
				entryUrl: buildCanvasDocumentEntryUrl(path.basename(rootDir), fileName)
			};
		}
		return {
			externalUrl: entrypoint.value,
			entryUrl: entrypoint.value
		};
	}
	const resolvedPath = entrypoint.value.startsWith("~") ? resolveUserPath(entrypoint.value) : path.isAbsolute(entrypoint.value) ? path.resolve(entrypoint.value) : path.resolve(workspaceDir, entrypoint.value);
	if (input.kind === "image" || input.kind === "video_asset") {
		const copiedName = sanitizeUntrustedFileName(path.basename(resolvedPath), "asset");
		await root.copyIn(copiedName, resolvedPath);
		const wrapper = input.kind === "image" ? `<!doctype html><html><body style="margin:0;background:#0f172a;display:flex;align-items:center;justify-content:center;"><img src="${escapeHtml(copiedName)}" style="max-width:100%;max-height:100vh;object-fit:contain;" /></body></html>` : `<!doctype html><html><body style="margin:0;background:#0f172a;"><video src="${escapeHtml(copiedName)}" controls autoplay style="width:100%;height:100vh;object-fit:contain;background:#000;"></video></body></html>`;
		await root.write("index.html", wrapper);
		return {
			localEntrypoint: "index.html",
			entryUrl: buildCanvasDocumentEntryUrl(path.basename(rootDir), "index.html")
		};
	}
	const fileName = sanitizeUntrustedFileName(path.basename(resolvedPath), "document");
	await root.copyIn(fileName, resolvedPath);
	if (input.kind === "document" && isPdfPathLike(fileName)) {
		await root.write("index.html", buildPdfWrapper(fileName));
		return {
			localEntrypoint: "index.html",
			entryUrl: buildCanvasDocumentEntryUrl(path.basename(rootDir), "index.html")
		};
	}
	return {
		localEntrypoint: fileName,
		entryUrl: buildCanvasDocumentEntryUrl(path.basename(rootDir), fileName)
	};
}
/** Creates a Canvas document directory, copies assets, and writes its manifest. */
async function createCanvasDocument(input, options) {
	const workspaceDir = options?.workspaceDir ?? process.cwd();
	const id = input.id?.trim() ? normalizeCanvasDocumentId(input.id) : canvasDocumentId();
	const rootDir = resolveCanvasDocumentDir(id, { stateDir: options?.stateDir });
	await fs.rm(rootDir, {
		recursive: true,
		force: true
	}).catch(() => void 0);
	await fs.mkdir(rootDir, { recursive: true });
	const root$2 = await root(rootDir);
	const assets = await copyAssets(root$2, input.assets, workspaceDir);
	const entry = await materializeEntrypoint(rootDir, root$2, input, workspaceDir);
	const manifest = {
		id,
		kind: input.kind,
		...input.title?.trim() ? { title: input.title.trim() } : {},
		...typeof input.preferredHeight === "number" ? { preferredHeight: input.preferredHeight } : {},
		...input.surface ? { surface: input.surface } : {},
		...input.retentionScope ? { retentionScope: input.retentionScope } : {},
		...input.cspSandbox ? { cspSandbox: input.cspSandbox } : {},
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		entryUrl: entry.entryUrl,
		...entry.localEntrypoint ? { localEntrypoint: entry.localEntrypoint } : {},
		...entry.externalUrl ? { externalUrl: entry.externalUrl } : {},
		assets
	};
	await root$2.writeJson("manifest.json", manifest, { space: 2 });
	if (input.retentionScope && options?.maxDocumentsPerScope) await pruneCanvasDocumentsForScope({
		documentsDir: resolveCanvasDocumentsDir(options.stateDir),
		retentionScope: input.retentionScope,
		maxDocuments: options.maxDocumentsPerScope
	});
	return manifest;
}
//#endregion
export { resolveCanvasHttpPathToLocalPath as i, readCanvasDocumentHtmlSource as n, resolveCanvasDocumentsDir as r, createCanvasDocument as t };
