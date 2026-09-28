import { r as lowercasePreservingWhitespace } from "./string-coerce-CIXf7egm.mjs";
import { t as FsSafeError, w as root } from "./fs-safe-BAPek8At.mjs";
import { n as detectMime } from "./mime-1zBUMwu6.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./media-mime-D8SxWw0k.mjs";
import "./security-runtime-HdPo6iAV.mjs";
import { r as isA2uiPath, t as A2UI_PATH } from "./a2ui-shared-BVnsAcOM.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/canvas/src/host/file-resolver.ts
/**
* Safe file resolution helpers for Canvas-hosted static assets.
*/
function pathEscapesRoot(decodedPath) {
	let depth = 0;
	for (const segment of decodedPath.split("/")) {
		if (segment === "" || segment === ".") continue;
		if (segment === "..") {
			if (depth === 0) return true;
			depth--;
			continue;
		}
		depth++;
	}
	return false;
}
function tryNormalizeUrlPath(rawPath) {
	let decoded;
	try {
		decoded = decodeURIComponent(rawPath || "/");
	} catch {
		return null;
	}
	if (pathEscapesRoot(decoded)) return null;
	const normalized = path.posix.normalize(decoded);
	return normalized.startsWith("/") ? normalized : `/${normalized}`;
}
/** Opens a Canvas-hosted file only when the request stays inside the root. */
async function resolveFileWithinRoot(rootReal, urlPath) {
	const normalized = tryNormalizeUrlPath(urlPath);
	if (normalized === null) return null;
	const rel = normalized.replace(/^\/+/, "");
	if (rel.split("/").some((p) => p === "..")) return null;
	const root$1 = await root(rootReal);
	const tryOpen = async (relative) => {
		try {
			return await root$1.open(relative);
		} catch (err) {
			if (err instanceof FsSafeError) return null;
			throw err;
		}
	};
	if (normalized.endsWith("/")) return await tryOpen(path.posix.join(rel, "index.html"));
	try {
		const st = await root$1.stat(rel);
		if (st.isSymbolicLink) return null;
		if (st.isDirectory) return await tryOpen(path.posix.join(rel, "index.html"));
	} catch (err) {
		if (err instanceof FsSafeError) return null;
		throw err;
	}
	return await tryOpen(rel);
}
//#endregion
//#region extensions/canvas/src/host/a2ui-route.ts
async function handleA2uiHttpRequestWithRootResolver(req, res, resolveRootReal) {
	const urlRaw = req.url;
	if (!urlRaw) return false;
	const url = new URL(urlRaw, "http://localhost");
	const basePath = isA2uiPath(url.pathname) ? A2UI_PATH : void 0;
	if (!basePath) return false;
	if (req.method !== "GET" && req.method !== "HEAD") {
		res.statusCode = 405;
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		res.end("Method Not Allowed");
		return true;
	}
	const a2uiRootReal = await resolveRootReal();
	if (!a2uiRootReal) {
		res.statusCode = 503;
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		res.end("A2UI assets not found");
		return true;
	}
	const result = await resolveFileWithinRoot(a2uiRootReal, url.pathname.slice(basePath.length) || "/");
	if (!result) {
		res.statusCode = 404;
		res.setHeader("Content-Type", "text/plain; charset=utf-8");
		res.end("not found");
		return true;
	}
	try {
		const lower = lowercasePreservingWhitespace(result.realPath);
		const mime = lower.endsWith(".html") || lower.endsWith(".htm") ? "text/html" : await detectMime({ filePath: result.realPath }) ?? "application/octet-stream";
		res.setHeader("Cache-Control", "no-store");
		if (mime === "text/html") {
			const buf = await result.handle.readFile({ encoding: "utf8" });
			res.setHeader("Content-Type", "text/html; charset=utf-8");
			if (req.method === "HEAD") {
				res.setHeader("Content-Length", String(Buffer.byteLength(buf)));
				res.end();
				return true;
			}
			res.end(buf);
			return true;
		}
		res.setHeader("Content-Type", mime);
		if (req.method === "HEAD") {
			res.setHeader("Content-Length", String(result.stat.size));
			res.end();
			return true;
		}
		res.end(await result.handle.readFile());
		return true;
	} finally {
		await result.handle.close().catch(() => {});
	}
}
//#endregion
//#region extensions/canvas/src/host/a2ui.ts
/**
* HTTP handler for serving bundled A2UI renderer assets.
*/
let cachedA2uiRootReal;
let resolvingA2uiRoot = null;
let cachedA2uiResolvedAtMs = 0;
const A2UI_ROOT_RETRY_NULL_AFTER_MS = 1e4;
async function resolveA2uiRoot() {
	const here = path.dirname(fileURLToPath(import.meta.url));
	const entryDir = process.argv[1] ? path.dirname(path.resolve(process.argv[1])) : null;
	const candidates = [
		path.resolve(here, "a2ui"),
		path.resolve(here, "canvas-host/a2ui"),
		...entryDir ? [path.resolve(entryDir, "a2ui"), path.resolve(entryDir, "canvas-host/a2ui")] : [],
		path.resolve(here, "../../extensions/canvas/src/host/a2ui"),
		path.resolve(here, "../extensions/canvas/src/host/a2ui"),
		path.resolve(process.cwd(), "extensions/canvas/src/host/a2ui"),
		path.resolve(process.cwd(), "dist/canvas-host/a2ui")
	];
	if (process.execPath) candidates.unshift(path.resolve(path.dirname(process.execPath), "a2ui"));
	for (const dir of candidates) try {
		const bundlePath = path.join(dir, "a2ui.bundle.js");
		const v09BundlePath = path.join(dir, "a2ui-v0.9.bundle.js");
		await fs.stat(bundlePath);
		await fs.stat(v09BundlePath);
		return dir;
	} catch {}
	return null;
}
async function resolveA2uiRootReal() {
	if (cachedA2uiRootReal !== void 0 && (cachedA2uiRootReal !== null || Date.now() - cachedA2uiResolvedAtMs < A2UI_ROOT_RETRY_NULL_AFTER_MS)) return cachedA2uiRootReal;
	if (!resolvingA2uiRoot) resolvingA2uiRoot = (async () => {
		const root = await resolveA2uiRoot();
		cachedA2uiRootReal = root ? await fs.realpath(root) : null;
		cachedA2uiResolvedAtMs = Date.now();
		resolvingA2uiRoot = null;
		return cachedA2uiRootReal;
	})();
	return resolvingA2uiRoot;
}
/** Handles one HTTP request for the hosted A2UI asset surface. */
async function handleA2uiHttpRequest(req, res) {
	return await handleA2uiHttpRequestWithRootResolver(req, res, resolveA2uiRootReal);
}
/** Read an explicitly registered public renderer bundle without request or Gateway authority. */
async function readPublicA2uiResource(resourcePath) {
	const root = await resolveA2uiRootReal();
	const opened = root ? await resolveFileWithinRoot(root, resourcePath.slice(A2UI_PATH.length)) : null;
	if (!opened) return;
	try {
		return {
			body: await opened.handle.readFile(),
			contentType: "application/javascript; charset=utf-8"
		};
	} finally {
		await opened.handle.close();
	}
}
//#endregion
export { readPublicA2uiResource as n, handleA2uiHttpRequest as t };
