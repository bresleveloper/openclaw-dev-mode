import { t as containsAsciiControlCharacter } from "./string-normalization-CECOqf64.mjs";
import { w as root } from "./fs-safe-BUXBSN-4.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import "./canvas-CTYLqV3I.mjs";
import { t as CANVAS_DOCUMENTS_PATH } from "./constants-Cm4bJJ1Q.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region src/canvas/documents.ts
/** Core Canvas document materialization and hosted-path resolution. */
const CANVAS_DOCUMENT_MANIFEST_MAX_BYTES = 2097152;
function normalizeLogicalPath(value) {
	const parts = value.replaceAll("\\", "/").replace(/^\/+/, "").split("/").filter(Boolean);
	if (parts.length === 0 || parts.some((part) => part === "." || part === ".." || part.includes(":") || containsAsciiControlCharacter(part))) throw new Error("canvas document logicalPath invalid");
	return parts.join("/");
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
	const root$1 = await root(resolveCanvasDocumentsDir(options?.stateDir), { maxBytes: CANVAS_DOCUMENT_MANIFEST_MAX_BYTES });
	const manifest = await root$1.readJson(`${id}/manifest.json`);
	if (manifest.id !== id || typeof manifest.localEntrypoint !== "string") throw new Error(`canvas document has no local entrypoint: ${id}`);
	const entrypoint = normalizeLogicalPath(manifest.localEntrypoint);
	if (!entrypoint.toLowerCase().endsWith(".html")) throw new Error(`canvas document entrypoint is not HTML: ${id}`);
	return {
		html: await root$1.readText(`${id}/${entrypoint}`, { maxBytes: options?.maxBytes ?? 10485760 }),
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
		const candidatePath = path.resolve(documentsDir, documentId, normalizedEntrypoint);
		if (!candidatePath.startsWith(`${documentsDir}${path.sep}`)) return null;
		return candidatePath;
	} catch {
		return null;
	}
}
/** Persists the inline widget's HTML bytes and its Canvas manifest. */
async function createCanvasDocument(input, options) {
	const id = input.id?.trim() ? normalizeCanvasDocumentId(input.id) : `cv_${randomUUID().replaceAll("-", "")}`;
	const rootDir = path.join(resolveCanvasDocumentsDir(options?.stateDir), id);
	await fs.rm(rootDir, {
		recursive: true,
		force: true
	}).catch(() => void 0);
	await fs.mkdir(rootDir, { recursive: true });
	const root$2 = await root(rootDir);
	await root$2.write("index.html", input.html);
	const manifest = {
		id,
		kind: "html_bundle",
		...input.title?.trim() ? { title: input.title.trim() } : {},
		...input.surface ? { surface: input.surface } : {},
		...input.retentionScope ? { retentionScope: input.retentionScope } : {},
		...input.cspSandbox ? { cspSandbox: input.cspSandbox } : {},
		createdAt: (/* @__PURE__ */ new Date()).toISOString(),
		entryUrl: `${CANVAS_DOCUMENTS_PATH}/${encodeURIComponent(id)}/index.html`,
		localEntrypoint: "index.html",
		assets: []
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
