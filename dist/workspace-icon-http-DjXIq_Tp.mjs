import { a as openRootFile, s as readFileDescriptorBounded } from "./boundary-file-read-CCth2Hwg.mjs";
import { t as LruCache } from "./lru-cache-C3Xgvc4Q.mjs";
import { a as isWorkspaceAccessUnavailableError, i as getAgentWorkspaceAccess } from "./workspace-access-CeRsYrid.mjs";
import { i as resolveSessionStoreIdentity } from "./session-store-key-Ci099tm9.mjs";
import { i as withReadySessionRows } from "./session-row-prepared-read-eHG52FnK.mjs";
import { i as parseControlUiResourcePath } from "./control-ui-resource-routes-y_jZ6jnp.mjs";
import "./control-ui-contract-B_YMMx3J.mjs";
import { n as getSessionRowProjection } from "./session-row-projection-access-C2RDnj28.mjs";
import { t as resolveSessionWorkspaceRoots } from "./session-workspace-roots-BvtSgErM.mjs";
import { d as sendMethodNotAllowed, x as respondNotFound } from "./http-common-DJ7rKVvj.mjs";
import { n as authorizeControlUiSessionOwnerReadRequestOrReply } from "./http-auth-utils-Bk1YwS0V.mjs";
import "./http-utils-yY7ta13a.mjs";
import { n as HTTP_SVG_MAX_BYTES, o as resolveHttpImageRepresentation, s as sendHttpImageResponse, t as HTTP_IMAGE_MAX_BYTES } from "./http-image-response-CJ3oDAly.mjs";
import { close } from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
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
const closeFileDescriptor = promisify(close);
let workspaceIconCache = new LruCache(WORKSPACE_ICON_CACHE_MAX_ENTRIES);
function clearWorkspaceIconCacheForTest() {
	workspaceIconCache = new LruCache(WORKSPACE_ICON_CACHE_MAX_ENTRIES);
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
* Reuses immutable icon bytes while the workspace remains in the bounded cache.
* Only cold/evicted roots scan the fixed candidate list; ordinary requests never
* freshness-poll project files.
*/
function resolveWorkspaceIcon(workspaceRoot) {
	const cacheKey = path.resolve(workspaceRoot);
	const cached = workspaceIconCache.get(cacheKey);
	if (cached) return cached;
	const pending = scanWorkspaceIcon(cacheKey);
	workspaceIconCache.set(cacheKey, pending);
	return pending;
}
function respondWorkspaceIconUnavailable(res) {
	res.statusCode = 503;
	res.setHeader("cache-control", "no-store");
	res.setHeader("retry-after", "1");
	res.end("workspace icon snapshot is not ready");
}
/**
* Resolve cold and evicted icons through the existing prepared session-row owner.
* Store reads stay in its worker; bounded filesystem reads are asynchronous and
* the current session/root and request authority fence publication of the bytes.
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
	const projection = getSessionRowProjection(opts);
	if (!projection) {
		respondWorkspaceIconUnavailable(res);
		return true;
	}
	const sessionKey = parsed.value;
	const queries = (cfg) => {
		const { agentId, canonicalKey } = resolveSessionStoreIdentity({
			cfg,
			sessionKey
		});
		return [{
			agentId,
			key: canonicalKey
		}];
	};
	const select = (read) => {
		const query = queries(read.state.cfg)[0];
		const row = read.describe(query);
		const entry = row?.storedEntry ?? row?.entry;
		let localRoot = row && entry?.sessionId && !entry.execNode && !entry.repositoryWorkspaceId ? resolveSessionWorkspaceRoots(read.state.cfg, row.agentId, entry).root : void 0;
		if (localRoot) try {
			if (getAgentWorkspaceAccess(localRoot)) localRoot = void 0;
		} catch (error) {
			if (!isWorkspaceAccessUnavailableError(error)) throw error;
			localRoot = void 0;
		}
		return {
			generation: row?.generation,
			sessionId: entry?.sessionId,
			root: localRoot
		};
	};
	const selected = await withReadySessionRows(projection, queries, select);
	requestAuth.assertCurrent();
	const icon = selected.root ? await resolveWorkspaceIcon(selected.root) : null;
	await withReadySessionRows(projection, queries, (read) => {
		requestAuth.assertCurrent();
		const current = select(read);
		if (current.generation !== selected.generation || current.sessionId !== selected.sessionId || current.root !== selected.root) respondWorkspaceIconUnavailable(res);
		else if (!icon) {
			res.setHeader("cache-control", "no-store");
			respondNotFound(res);
		} else sendHttpImageResponse({
			req,
			res,
			image: icon,
			filename: "workspace-icon"
		});
	});
	return true;
}
//#endregion
export { SVG_ICON_MAX_BYTES, WORKSPACE_ICON_MAX_BYTES, clearWorkspaceIconCacheForTest, handleWorkspaceIconHttpRequest, resolveWorkspaceIcon };
