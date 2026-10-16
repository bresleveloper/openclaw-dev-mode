import { t as FsSafeError, w as root } from "./fs-safe-BUXBSN-4.mjs";
import { n as detectMime } from "./mime-CGDYrRzL.mjs";
import { i as resolveCanvasHttpPathToLocalPath, r as resolveCanvasDocumentsDir } from "./documents-CFQyKfP2.mjs";
import { t as buildBoardWidgetContentSecurityPolicy } from "./board-sandbox-Ca0D_WuE.mjs";
import path from "node:path";
//#region src/canvas/serve.runtime.ts
async function readRootFile(root, relativePath) {
	try {
		return await root.read(relativePath, { maxBytes: Infinity });
	} catch (error) {
		if (error instanceof FsSafeError) return null;
		throw error;
	}
}
async function resolveDocumentSandbox(root, relativePath) {
	const documentId = relativePath.split(path.sep)[0];
	if (!documentId) return;
	const opened = await readRootFile(root, path.join(documentId, "manifest.json"));
	if (!opened) return;
	try {
		return JSON.parse(opened.buffer.toString("utf8")).cspSandbox === "scripts" ? "scripts" : void 0;
	} catch {
		return;
	}
}
/** Serves one managed Canvas document request. */
async function handleCanvasDocumentHttpRequest(req, res) {
	const localPath = resolveCanvasHttpPathToLocalPath(req.url ?? "");
	if (!localPath) return false;
	if (req.method !== "GET" && req.method !== "HEAD") {
		res.statusCode = 405;
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		res.end("Method Not Allowed");
		return true;
	}
	try {
		const documentsDir = resolveCanvasDocumentsDir();
		const relativePath = path.relative(documentsDir, localPath);
		const root$1 = await root(documentsDir);
		const opened = await root$1.read(relativePath, { maxBytes: Infinity });
		const lowerPath = opened.realPath.toLowerCase();
		const mime = lowerPath.endsWith(".html") || lowerPath.endsWith(".htm") ? "text/html" : await detectMime({ filePath: opened.realPath }) ?? "application/octet-stream";
		const body = mime === "text/html" ? opened.buffer.toString("utf8") : opened.buffer;
		res.setHeader("Cache-Control", "no-store");
		res.setHeader("Content-Type", mime === "text/html" ? "text/html; charset=utf-8" : mime);
		res.setHeader("Content-Length", String(Buffer.byteLength(body)));
		if (mime === "text/html") {
			if (await resolveDocumentSandbox(root$1, relativePath) === "scripts") {
				res.setHeader("Content-Security-Policy", buildBoardWidgetContentSecurityPolicy({
					grantState: "none",
					resourceOrigins: ["'self'"]
				}));
				res.setHeader("Referrer-Policy", "no-referrer");
			}
		}
		if (req.method === "HEAD") {
			res.end();
			return true;
		}
		res.end(body);
		return true;
	} catch (error) {
		res.statusCode = error instanceof FsSafeError ? 404 : 500;
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		res.end(error instanceof FsSafeError ? "not found" : "error");
		return true;
	}
}
//#endregion
export { handleCanvasDocumentHttpRequest };
