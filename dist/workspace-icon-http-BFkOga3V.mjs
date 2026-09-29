import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { a as openRootFile, s as readFileDescriptorBounded } from "./boundary-file-read-D-Aa04On.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { i as parseControlUiResourcePath } from "./control-ui-resource-routes-DVy_LnYu.mjs";
import "./control-ui-contract-Dup6xL62.mjs";
import { n as authorizeControlUiSessionOwnerReadRequestOrReply } from "./http-auth-utils-BJQtuB_7.mjs";
import { l as sendMethodNotAllowed, y as respondNotFound } from "./http-common-Ckbyca3h.mjs";
import "./http-utils-BihU3mvk.mjs";
import { n as HTTP_SVG_MAX_BYTES, o as resolveHttpImageRepresentation, s as sendHttpImageResponse, t as HTTP_IMAGE_MAX_BYTES } from "./http-image-response-DQqwbtvS.mjs";
import { close } from "node:fs";
import { promisify } from "node:util";
import path from "node:path";
//#region src/gateway/workspace-icon-http.ts
/**
* Conventional project icon locations in deterministic product precedence.
* Resolution stops at the first valid hit, so this fixed list is the whole
* filesystem cost of opening a workspace and never becomes a recursive scan.
*/
const WORKSPACE_ICON_RELATIVE_PATHS = [
	"favicon.svg",
	"favicon.ico",
	"favicon.png",
	"public/favicon.svg",
	"public/favicon.ico",
	"public/favicon.png",
	"public/favicon-32.png",
	"public/apple-touch-icon.png",
	"static/favicon.svg",
	"static/favicon.ico",
	"static/favicon.png",
	"ui/public/favicon-32.png",
	"ui/public/favicon.svg",
	"ui/public/favicon.ico",
	"ui/public/favicon.png",
	"app/favicon.ico",
	"app/favicon.png",
	"app/icon.svg",
	"app/icon.png",
	"app/icon.ico",
	"src/favicon.ico",
	"src/favicon.svg",
	"src/app/favicon.ico",
	"src/app/icon.svg",
	"src/app/icon.png",
	"assets/icon.svg",
	"assets/icon.png",
	"assets/logo.svg",
	"assets/logo.png"
];
/** Icons are small by construction; anything larger is not a favicon. */
const WORKSPACE_ICON_MAX_BYTES = HTTP_IMAGE_MAX_BYTES;
/** Vector icons are markup the renderer must parse, so they get a tighter cap. */
const SVG_ICON_MAX_BYTES = HTTP_SVG_MAX_BYTES;
const WORKSPACE_ICON_CACHE_MAX_ENTRIES = 32;
const SESSION_WORKSPACE_ICON_CACHE_MAX_ENTRIES = 128;
const closeFileDescriptor = promisify(close);
let workspaceIconCache = /* @__PURE__ */ new Map();
let sessionWorkspaceIconCache = /* @__PURE__ */ new Map();
function clearWorkspaceIconCacheForTest() {
	workspaceIconCache = /* @__PURE__ */ new Map();
	sessionWorkspaceIconCache = /* @__PURE__ */ new Map();
}
async function readWorkspaceIconCandidate(workspaceRoot, relativePath) {
	const opened = await openRootFile({
		absolutePath: path.join(workspaceRoot, relativePath),
		rootPath: workspaceRoot,
		boundaryLabel: "workspace root",
		symlinks: "follow-parents-within-root",
		maxBytes: WORKSPACE_ICON_MAX_BYTES
	});
	if (!opened.ok) return;
	let body;
	try {
		body = await readFileDescriptorBounded(opened.fd, WORKSPACE_ICON_MAX_BYTES);
	} catch {
		return;
	} finally {
		await closeFileDescriptor(opened.fd);
	}
	return await resolveHttpImageRepresentation(relativePath, body);
}
async function scanWorkspaceIcon(workspaceRoot) {
	for (const relativePath of WORKSPACE_ICON_RELATIVE_PATHS) {
		const icon = await readWorkspaceIconCandidate(workspaceRoot, relativePath);
		if (icon) return icon;
	}
	return null;
}
/**
* Resolves a workspace icon once per Gateway process. Project icons are
* process-stable metadata like plugin manifests: a changed icon is picked up on
* the next Gateway start, never by re-scanning the workspace on a hot path.
*/
function resolveWorkspaceIcon(workspaceRoot) {
	const cacheKey = path.resolve(workspaceRoot);
	const cached = workspaceIconCache.get(cacheKey);
	if (cached) {
		workspaceIconCache.delete(cacheKey);
		workspaceIconCache.set(cacheKey, cached);
		return cached;
	}
	const pending = scanWorkspaceIcon(cacheKey);
	workspaceIconCache.set(cacheKey, pending);
	pruneMapToMaxSize(workspaceIconCache, WORKSPACE_ICON_CACHE_MAX_ENTRIES);
	return pending;
}
const getSessionsFilesModule = createLazyRuntimeModule(() => import("./sessions-files-UCjeLRjE.mjs"));
/**
* Prepares the immutable icon snapshot while opening a chat. The HTTP asset
* request only reads this map: no session-store or filesystem work is allowed
* on that hot path, and icon changes become visible after Gateway restart.
*/
async function prepareSessionWorkspaceIcon(params) {
	const preparation = (async () => {
		const workspaceRoot = (await getSessionsFilesModule()).resolveLocalSessionWorkspaceRoot(params);
		return workspaceRoot ? await resolveWorkspaceIcon(workspaceRoot) : null;
	})();
	sessionWorkspaceIconCache.delete(params.sessionKey);
	sessionWorkspaceIconCache.set(params.sessionKey, preparation.catch(() => null));
	pruneMapToMaxSize(sessionWorkspaceIconCache, SESSION_WORKSPACE_ICON_CACHE_MAX_ENTRIES);
	await preparation;
}
function readPreparedSessionWorkspaceIcon(sessionKey) {
	const prepared = sessionWorkspaceIconCache.get(sessionKey);
	if (prepared) {
		sessionWorkspaceIconCache.delete(sessionKey);
		sessionWorkspaceIconCache.set(sessionKey, prepared);
	}
	return prepared;
}
/**
* Serves the icon snapshot prepared when the chat opened. The request names a
* session, never a path, and performs no filesystem or session-store work.
*/
async function handleWorkspaceIconHttpRequest(req, res, opts) {
	const pathname = req.url ? new URL(req.url, "http://localhost").pathname : void 0;
	const parsed = parseControlUiResourcePath("workspaceIcon", pathname, opts.basePath);
	if (!parsed.matched) return false;
	const method = req.method;
	if (method !== "GET" && method !== "HEAD") {
		sendMethodNotAllowed(res, "GET, HEAD");
		return true;
	}
	const requestAuth = await authorizeControlUiSessionOwnerReadRequestOrReply({
		...opts,
		req,
		res
	});
	if (!requestAuth) return true;
	requestAuth.assertCurrent();
	if (!parsed.value) {
		res.setHeader("cache-control", "no-store");
		respondNotFound(res);
		return true;
	}
	const prepared = readPreparedSessionWorkspaceIcon(parsed.value);
	if (!prepared) {
		res.statusCode = 503;
		res.setHeader("cache-control", "no-store");
		res.setHeader("retry-after", "1");
		res.end("workspace icon snapshot is not ready");
		return true;
	}
	const icon = await prepared;
	requestAuth.assertCurrent();
	if (!icon) {
		res.setHeader("cache-control", "no-store");
		respondNotFound(res);
		return true;
	}
	sendHttpImageResponse({
		req,
		res,
		image: icon,
		filename: "workspace-icon"
	});
	return true;
}
//#endregion
export { prepareSessionWorkspaceIcon as a, handleWorkspaceIconHttpRequest as i, WORKSPACE_ICON_MAX_BYTES as n, resolveWorkspaceIcon as o, clearWorkspaceIconCacheForTest as r, SVG_ICON_MAX_BYTES as t };
