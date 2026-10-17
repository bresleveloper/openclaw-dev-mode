import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { n as isErrno } from "./errno-FR4CRyya.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { t as LruCache } from "./lru-cache-C3Xgvc4Q.mjs";
import { s as resolveRuntimeServiceBuildId } from "./version-BJGPJZu6.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-D3H3_asn.mjs";
import { t as WorkerTaskPool } from "./worker-task-pool-iI3pfrsK.mjs";
import { a as isPackageProvenControlUiRootSync, c as resolveControlUiRootOverrideSync, i as inspectControlUiRootAssets, l as resolveControlUiRootSync, n as ensureControlUiAssetsBuilt } from "./control-ui-assets-CIZQnoxr.mjs";
import { c as sha256File } from "./directory-durability-CqSvP1tc.mjs";
import { t as copyFileHandle } from "./file-descriptor-B4yBUiAP.mjs";
import { c as normalizeControlUiBasePath } from "./src-D0qIyKKg.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import { t as escapeHtml } from "./html-escape-BMD_QFeA.mjs";
import { s as getGatewayRestartDrainSignal, y as runOutsideGatewayRootWorkAdmission } from "./gateway-work-admission-rc4ZgKq_.mjs";
import { a as classifyMcpAppStandalonePath, i as classifyGatewayProbePath, l as classifyWorkerGatewayPath, s as classifyNodeWorkspaceTransferPath } from "./gateway-http-route-contracts-jBtizxKU.mjs";
import { S as respondPlainText, b as isReadHttpMethod, x as respondNotFound, y as acceptsControlUiHtmlResponse } from "./http-common-D3e5uEH1.mjs";
import { c as resolvePluginDiscoveryIdentity } from "./catalog-discovery-bzOzSctU.mjs";
import { t as parseControlUiSessionPath } from "./parse-Dkrc_qcX.mjs";
import { t as matchesHttpIfModifiedSince } from "./http-conditional-DaagcxHO.mjs";
import { t as resolveHttpContentEncodings } from "./http-content-encoding-DVf1MER7.mjs";
import fs, { constants } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { promisify } from "node:util";
import { createHash, randomUUID } from "node:crypto";
import { isWithinDir } from "@openclaw/fs-safe/path";
import { brotliCompress, constants as constants$1, gzip } from "node:zlib";
import { TLSSocket } from "node:tls";
import { root } from "@openclaw/fs-safe";
//#region packages/session-url-contract/src/focus.ts
const FOCUS_SEGMENT = "/focus";
function normalizePathname(pathname) {
	const trimmed = pathname.trim();
	const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
	return withSlash.length > 1 ? withSlash.replace(/\/+$/u, "") : withSlash;
}
function isControlUiFocusPath(pathname, basePath = "") {
	const normalizedPath = normalizePathname(pathname);
	const root = `${normalizeControlUiBasePath(basePath)}${FOCUS_SEGMENT}`;
	return normalizedPath === root || normalizedPath.startsWith(`${root}/`);
}
//#endregion
//#region src/gateway/control-ui-asset-manifest.ts
const CONTROL_UI_ASSET_MANIFEST_FILENAME = "asset-manifest.json";
const CONTROL_UI_RETAINED_ASSET_MAX_BYTES = 100663296;
const CONTROL_UI_PRECOMPRESSED_ASSET_EXTENSIONS = /* @__PURE__ */ new Set([".br", ".gz"]);
function isControlUiPrecompressedAssetExtension(extension) {
	return CONTROL_UI_PRECOMPRESSED_ASSET_EXTENSIONS.has(extension);
}
function isControlUiRetainedAssetPath(assetPath) {
	return !isControlUiPrecompressedAssetExtension(path.posix.extname(assetPath).toLowerCase());
}
function hashControlUiAssetManifestEntries(entries) {
	const hash = createHash("sha256");
	for (const entry of entries) hash.update(`${entry.path}\0${entry.size}\0${entry.sha256}\n`);
	return hash.digest("hex");
}
//#endregion
//#region src/gateway/control-ui-routing.ts
const CONTROL_UI_PLUGIN_MANAGER_PATH = "/settings/plugins";
/** Keep the plugin recovery surface ahead of plugin-owned HTTP routes. */
function isControlUiPluginManagerRequest(params) {
	if (!isReadHttpMethod(params.method)) return false;
	const path = `${params.basePath}${CONTROL_UI_PLUGIN_MANAGER_PATH}`;
	return params.pathname === path || params.pathname === `${path}/`;
}
/** Core-owned standalone approval document namespace, before plugin routing. */
function isControlUiApprovalDocumentPath(params) {
	const root = `${params.basePath}/approve`;
	if (params.pathname === root || params.pathname === `${root}/`) return true;
	const prefix = `${root}/`;
	if (!params.pathname.startsWith(prefix)) return false;
	const encodedId = params.pathname.slice(prefix.length);
	return encodedId.length > 0 && !encodedId.includes("/");
}
/** Classify an HTTP request as Control UI serving, redirect, 404, or non-Control-UI. */
function classifyControlUiRequest(params) {
	const { basePath, pathname, search, method } = params;
	const spaFallback = isControlUiPluginManagerRequest(params) || acceptsControlUiHtmlResponse(params.accept);
	if (!basePath) {
		if (pathname === "/ui" || pathname.startsWith("/ui/")) return { kind: "not-found" };
		if (classifyGatewayProbePath(pathname) !== "outside" || classifyMcpAppStandalonePath(pathname) !== "outside" || classifyWorkerGatewayPath(pathname) !== "outside" || classifyNodeWorkspaceTransferPath(pathname) !== "outside") return { kind: "not-control-ui" };
		if (pathname === "/plugins" || pathname.startsWith("/plugins/")) {
			if (!(pathname === "/plugins" || pathname === "/plugins/" || resolvePluginDiscoveryIdentity(pathname.slice(9)) !== void 0) || !isReadHttpMethod(method) || !spaFallback) return { kind: "not-control-ui" };
		}
		if (pathname === "/api" || pathname.startsWith("/api/")) return { kind: "not-control-ui" };
		if (pathname === "/j" || pathname.startsWith("/j/")) return { kind: "not-control-ui" };
		if (pathname === "/v1" || pathname.startsWith("/v1/")) return { kind: "not-control-ui" };
		if (!isReadHttpMethod(method)) return { kind: "not-control-ui" };
		return {
			kind: "serve",
			spaFallback
		};
	}
	if (!pathname.startsWith(`${basePath}/`) && pathname !== basePath) return { kind: "not-control-ui" };
	if (!isReadHttpMethod(method)) return { kind: "not-control-ui" };
	if (pathname === basePath) return {
		kind: "redirect",
		location: `${basePath}/${search}`
	};
	return {
		kind: "serve",
		spaFallback
	};
}
//#endregion
//#region src/gateway/control-ui-share.ts
/** This namespace contains only public preview documents and their static card. */
function isControlUiSharePath(pathname, basePath) {
	return pathname === `${basePath}/share` || pathname.startsWith(`${basePath}/share/`);
}
function serveControlUiShareDocument(req, res, url, basePath, publicOrigin) {
	const targetPath = url.pathname.slice(`${basePath}/share`.length);
	const session = parseControlUiSessionPath(targetPath);
	if (!isReadHttpMethod(req.method) || url.href.length > 8192 || !session) {
		respondNotFound(res);
		return;
	}
	const origin = resolveControlUiShareOrigin(req, publicOrigin);
	if (!origin) {
		respondNotFound(res);
		return;
	}
	const search = new URLSearchParams();
	const catalogRouting = [
		"catalog",
		"host",
		"thread"
	].map((key) => [key, url.searchParams.get(key)]);
	if (catalogRouting.every(([, value]) => value)) {
		for (const [key, value] of catalogRouting) if (value) search.set(key, value);
	}
	const suffix = search.size ? `?${search}` : "";
	const target = escapeHtml(`${basePath}${targetPath}${suffix}`);
	const canonical = escapeHtml(`${origin}${url.pathname}${suffix}`);
	const image = escapeHtml(`${origin}${basePath}/share/card.png`);
	const title = session.namespace === "dashboard" ? "OpenClaw dashboard" : "OpenClaw session";
	const description = "Open this shared link in OpenClaw. Access to the session is required.";
	const body = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title><meta name="robots" content="noindex, nofollow">
<meta property="og:type" content="website"><meta property="og:site_name" content="OpenClaw">
<meta property="og:title" content="${title}"><meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical}"><meta property="og:image" content="${image}">
<meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:image:alt" content="OpenClaw logo and lobster mascot">
<meta name="twitter:card" content="summary_large_image">
<style>
:root{color-scheme:dark;font-family:system-ui,sans-serif;background:#0b1016;color:#f5f7fa}
body{margin:0;min-height:100svh;display:grid;place-items:center}main{width:min(680px,calc(100% - 40px));padding:40px 0}
img{display:block;width:100%;height:auto;border-radius:20px}h1{font-size:clamp(28px,5vw,40px);letter-spacing:-.04em;margin:28px 0 12px}
p{color:#b2bdc9;line-height:1.6;margin:0 0 28px}a{display:inline-block;border-radius:12px;padding:14px 22px;background:#ff5c50;color:#160b0a;font-weight:700;text-decoration:none}
a:focus-visible{outline:3px solid #fff;outline-offset:5px}
</style></head><body><main>
<img src="${image}" width="1200" height="630" alt="OpenClaw logo and lobster mascot">
<h1>${title}</h1><p>${description}</p><a href="${target}">Open ${title === "OpenClaw dashboard" ? "dashboard" : "session"}</a>
</main></body></html>`;
	res.statusCode = 200;
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	res.setHeader("Content-Security-Policy", "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'");
	res.setHeader("Cache-Control", "no-store");
	res.setHeader("X-Robots-Tag", "noindex, nofollow");
	res.setHeader("Content-Length", Buffer.byteLength(body));
	res.end(req.method === "HEAD" ? void 0 : body);
}
function resolveControlUiShareOrigin(req, publicOrigin) {
	try {
		const protocol = req.socket instanceof TLSSocket ? "https" : "http";
		const address = new URL(publicOrigin ?? `${protocol}://${req.headers.host}`);
		if (!/^https?:$/u.test(address.protocol) || address.username || address.password || address.pathname !== "/" || address.search || address.hash) return null;
		return address.origin;
	} catch {
		return null;
	}
}
//#endregion
//#region src/gateway/control-ui-static.ts
const CONTROL_UI_IMMUTABLE_CACHE_CONTROL = "public, max-age=31536000, immutable";
const CONTROL_UI_HTML_COMPRESSION_CACHE_MAX_ENTRIES = 4;
const CONTROL_UI_COMPRESSIBLE_EXTENSIONS = /* @__PURE__ */ new Set([
	".css",
	".html",
	".js",
	".json",
	".svg",
	".txt",
	".wasm",
	".webmanifest"
]);
const CONTROL_UI_CONTENT_TYPES = {
	".html": "text/html; charset=utf-8",
	".js": "application/javascript; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".map": "application/json; charset=utf-8",
	".svg": "image/svg+xml",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".gif": "image/gif",
	".webp": "image/webp",
	".ico": "image/x-icon",
	".txt": "text/plain; charset=utf-8",
	".wasm": "application/wasm",
	".webmanifest": "application/manifest+json; charset=utf-8",
	".woff2": "font/woff2"
};
function isControlUiStaticAssetExtension(extension) {
	return extension !== ".html" && Object.hasOwn(CONTROL_UI_CONTENT_TYPES, extension);
}
const CONTROL_UI_DYNAMIC_ENCODINGS = /* @__PURE__ */ new Set(["br", "gzip"]);
const controlUiHtmlCompressionCache = /* @__PURE__ */ new Map();
const compressBrotli = promisify(brotliCompress);
const compressGzip = promisify(gzip);
function resolveControlUiHtmlEncoding(req) {
	return resolveHttpContentEncodings(req.headers?.["accept-encoding"], CONTROL_UI_DYNAMIC_ENCODINGS)[0] ?? "not-acceptable";
}
function isControlUiCompressibleAsset(filePath) {
	return CONTROL_UI_COMPRESSIBLE_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}
function resolveControlUiRepresentation(params) {
	const { req, asset, precompressed } = params;
	const encodings = resolveHttpContentEncodings(req.headers?.["accept-encoding"], precompressed && isControlUiCompressibleAsset(params.contentPath) ? CONTROL_UI_DYNAMIC_ENCODINGS : /* @__PURE__ */ new Set());
	for (const selected of encodings) {
		if (selected === "identity") return { file: asset.file };
		const file = asset[selected];
		if (file instanceof Error) throw file;
		if (file) return {
			file,
			encoding: selected
		};
	}
	return null;
}
function setControlUiEncodingHeaders(res, extension, encoding) {
	res.setHeader("Vary", "Accept-Encoding");
	if (!CONTROL_UI_COMPRESSIBLE_EXTENSIONS.has(extension)) return;
	if (encoding !== "identity") res.setHeader("Content-Encoding", encoding);
}
function setControlUiFileHeaders(res, filePath, options) {
	const extension = path.extname(filePath).toLowerCase();
	res.setHeader("Content-Type", CONTROL_UI_CONTENT_TYPES[extension] ?? "application/octet-stream");
	res.setHeader("Cache-Control", options?.immutable ? CONTROL_UI_IMMUTABLE_CACHE_CONTROL : "no-cache");
	if (options?.lastModifiedMs !== void 0) res.setHeader("Last-Modified", new Date(options.lastModifiedMs).toUTCString());
	setControlUiEncodingHeaders(res, extension, options?.encoding ?? "identity");
}
/** Revalidate no-cache static assets without generating entity tags. */
function isControlUiFileUnmodified(req, lastModifiedMs, nowMs = Date.now()) {
	if (req.method !== "GET" && req.method !== "HEAD") return false;
	const ifNoneMatch = req.headers?.["if-none-match"];
	if (ifNoneMatch !== void 0) return ifNoneMatch.trim() === "*";
	return matchesHttpIfModifiedSince(req, lastModifiedMs, nowMs);
}
function respondControlUiNotModified(res, options) {
	res.statusCode = 304;
	res.setHeader("Cache-Control", options.immutable ? CONTROL_UI_IMMUTABLE_CACHE_CONTROL : "no-cache");
	res.setHeader("Last-Modified", new Date(options.lastModifiedMs).toUTCString());
	res.setHeader("Vary", "Accept-Encoding");
	res.end();
}
function respondHeadForControlUiFile(res, filePath, options) {
	res.statusCode = 200;
	setControlUiFileHeaders(res, filePath, options);
	if (options?.contentLength !== void 0) res.setHeader("Content-Length", String(options.contentLength));
	res.end();
}
function compressControlUiBody(body, encoding) {
	return encoding === "br" ? compressBrotli(body, { params: { [constants$1.BROTLI_PARAM_QUALITY]: 4 } }) : compressGzip(body, { level: 6 });
}
function serveControlUiAsset(res, filePath, body, options) {
	setControlUiFileHeaders(res, filePath, options);
	res.end(body);
}
function cachedCompressedControlUiHtml(body, encoding) {
	const key = `${encoding}\0${body}`;
	const cached = controlUiHtmlCompressionCache.get(key);
	if (cached) {
		controlUiHtmlCompressionCache.delete(key);
		controlUiHtmlCompressionCache.set(key, cached);
		return cached;
	}
	const compression = getOrCreatePromise(controlUiHtmlCompressionCache, key, () => compressControlUiBody(Buffer.from(body), encoding), { cacheRejections: false });
	pruneMapToMaxSize(controlUiHtmlCompressionCache, CONTROL_UI_HTML_COMPRESSION_CACHE_MAX_ENTRIES);
	return compression;
}
function respondControlUiNotAcceptable(res) {
	res.setHeader("Cache-Control", "no-store");
	res.setHeader("Vary", "Accept-Encoding");
	respondPlainText(res, 406, "Not Acceptable");
}
async function sendControlUiHtmlBody(req, res, body) {
	const encoding = resolveControlUiHtmlEncoding(req);
	if (encoding === "not-acceptable") {
		respondControlUiNotAcceptable(res);
		return;
	}
	setControlUiEncodingHeaders(res, ".html", encoding);
	res.end(encoding === "identity" ? body : await cachedCompressedControlUiHtml(body, encoding));
}
//#endregion
//#region src/gateway/control-ui-asset-manifest-parse.ts
const CONTROL_UI_ASSET_SHA256_PATTERN = /^[a-f0-9]{64}$/u;
const CONTROL_UI_ASSET_MANIFEST_MAX_ENTRIES = 8192;
const CONTROL_UI_ASSET_MANIFEST_MAX_FILE_BYTES = 67108864;
const CONTROL_UI_ASSET_MANIFEST_MAX_TOTAL_BYTES = 536870912;
function hasExactKeys(record, keys) {
	const actual = Object.keys(record);
	return actual.length === keys.length && actual.every((key) => keys.includes(key));
}
function isControlUiAssetManifestPath(value) {
	if (!value.startsWith("assets/") || value.includes("\\") || value.includes("\0")) return false;
	const normalized = path.posix.normalize(value);
	return normalized === value && !normalized.endsWith("/");
}
function parseControlUiAssetManifest(value) {
	if (!isRecord(value) || !hasExactKeys(value, [
		"assets",
		"generation",
		"version"
	])) return null;
	if (value.version !== 1 || typeof value.generation !== "string" || !CONTROL_UI_ASSET_SHA256_PATTERN.test(value.generation) || !Array.isArray(value.assets) || value.assets.length === 0 || value.assets.length > CONTROL_UI_ASSET_MANIFEST_MAX_ENTRIES) return null;
	const assets = [];
	const paths = /* @__PURE__ */ new Set();
	let totalBytes = 0;
	for (const candidate of value.assets) {
		if (!isRecord(candidate) || !hasExactKeys(candidate, [
			"path",
			"sha256",
			"size"
		])) return null;
		const assetPath = candidate.path;
		const size = candidate.size;
		const sha256 = candidate.sha256;
		if (typeof assetPath !== "string" || !isControlUiAssetManifestPath(assetPath) || paths.has(assetPath) || typeof size !== "number" || !Number.isSafeInteger(size) || size < 0 || size > CONTROL_UI_ASSET_MANIFEST_MAX_FILE_BYTES || typeof sha256 !== "string" || !CONTROL_UI_ASSET_SHA256_PATTERN.test(sha256)) return null;
		totalBytes += size;
		if (totalBytes > CONTROL_UI_ASSET_MANIFEST_MAX_TOTAL_BYTES) return null;
		paths.add(assetPath);
		assets.push({
			path: assetPath,
			sha256,
			size
		});
	}
	for (let index = 1; index < assets.length; index += 1) if (assets[index - 1].path.localeCompare(assets[index].path) > 0) return null;
	if (hashControlUiAssetManifestEntries(assets) !== value.generation) return null;
	return {
		version: 1,
		generation: value.generation,
		assets
	};
}
//#endregion
//#region src/gateway/control-ui-asset-retention.ts
const CONTROL_UI_RETAINED_GENERATION_LIMIT = 3;
const CONTROL_UI_GENERATION_PATTERN = /^[a-f0-9]{64}$/u;
const CONTROL_UI_STAGING_PATTERN = /^\.staging-[0-9]+-[a-f0-9-]+$/u;
const CONTROL_UI_STAGING_MAX_AGE_MS = 36e5;
const CONTROL_UI_MANIFEST_MAX_BYTES = 4194304;
const CONTROL_UI_ASSET_VERIFICATION_CONCURRENCY = 4;
const log = createSubsystemLogger("gateway/control-ui-assets");
async function readCachedGeneration(directory, signal) {
	try {
		signal?.throwIfAborted();
		const stats = await fs$1.lstat(directory);
		if (!stats.isDirectory()) return null;
		const assetRoot = await root(directory);
		const realPath = assetRoot.rootReal;
		if (!isWithinDir(path.dirname(directory), realPath)) return null;
		const manifest = await readAssetManifest(realPath, signal);
		if (manifest.generation !== path.basename(directory)) return null;
		await verifyAssets(manifest.assets, (asset) => verifyAsset({
			entry: asset,
			signal,
			root: assetRoot
		}));
		const currentStats = await fs$1.lstat(directory);
		signal?.throwIfAborted();
		if (!sameDirectory(stats, currentStats)) return null;
		return {
			assetPaths: new Set(manifest.assets.map((asset) => asset.path)),
			bytes: manifest.assets.reduce((total, asset) => total + asset.size, 0),
			directory,
			generation: manifest.generation,
			stats: currentStats,
			realPath
		};
	} catch {
		signal?.throwIfAborted();
		return null;
	}
}
function sameDirectory(left, right) {
	return right.isDirectory() && left.dev === right.dev && left.ino === right.ino;
}
function compareGenerations(left, right) {
	return right.stats.mtimeMs - left.stats.mtimeMs || left.generation.localeCompare(right.generation);
}
async function readCacheInventory(cacheDir, signal, verified = []) {
	const generations = [];
	const directories = /* @__PURE__ */ new Map();
	let cacheRealPath;
	let entries;
	try {
		signal?.throwIfAborted();
		cacheRealPath = await fs$1.realpath(cacheDir);
		entries = await fs$1.readdir(cacheRealPath, { withFileTypes: true });
	} catch {
		signal?.throwIfAborted();
		return {
			generations,
			directories
		};
	}
	const known = new Map(verified.map((generation) => [generation.generation, generation]));
	for (const entry of entries) {
		signal?.throwIfAborted();
		if (!entry.isDirectory()) continue;
		const directory = path.join(cacheRealPath, entry.name);
		const stats = await fs$1.lstat(directory).catch(() => null);
		if (!stats?.isDirectory()) continue;
		directories.set(directory, stats);
		if (!CONTROL_UI_GENERATION_PATTERN.test(entry.name)) continue;
		const previous = known.get(entry.name);
		const generation = previous && sameDirectory(previous.stats, stats) ? {
			...previous,
			stats
		} : await readCachedGeneration(directory, signal);
		if (generation) generations.push(generation);
	}
	signal?.throwIfAborted();
	return {
		generations: generations.toSorted(compareGenerations),
		directories
	};
}
async function readAssetManifest(root, signal) {
	const manifestPath = path.join(root, CONTROL_UI_ASSET_MANIFEST_FILENAME);
	signal?.throwIfAborted();
	const stats = await fs$1.lstat(manifestPath);
	signal?.throwIfAborted();
	if (!stats.isFile() || stats.size > CONTROL_UI_MANIFEST_MAX_BYTES) throw new Error(`Invalid Control UI asset manifest: ${manifestPath}`);
	const manifest = parseControlUiAssetManifest(JSON.parse(await fs$1.readFile(manifestPath, {
		encoding: "utf8",
		signal
	})));
	signal?.throwIfAborted();
	if (!manifest) throw new Error(`Invalid Control UI asset manifest: ${manifestPath}`);
	return manifest;
}
function selectRetainedAssets(manifest) {
	const assets = manifest.assets.filter((asset) => isControlUiRetainedAssetPath(asset.path));
	return {
		...manifest,
		generation: hashControlUiAssetManifestEntries(assets),
		assets
	};
}
async function verifyAsset(params) {
	params.signal?.throwIfAborted();
	const opened = await params.root.open(params.entry.path, {
		hardlinks: "allow",
		symlinks: "follow-parents-within-root"
	});
	const source = opened.handle;
	let destination;
	try {
		params.signal?.throwIfAborted();
		if (params.destination) destination = await fs$1.open(params.destination, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | (constants.O_NOFOLLOW ?? 0), 384);
		const options = {
			maxBytes: params.entry.size,
			signal: params.signal
		};
		let bytes;
		let digest;
		if (destination) {
			const hash = createHash("sha256");
			bytes = await copyFileHandle(source, destination, {
				...options,
				onChunk: (chunk) => {
					hash.update(chunk);
				}
			});
			digest = hash.digest("hex");
		} else ({bytes, digest} = await sha256File(source, options));
		const sourcePath = path.join(params.root.rootDir, params.entry.path);
		const current = params.destination ? void 0 : await fs$1.lstat(sourcePath);
		if (current && (!current.isFile() || current.size !== params.entry.size || current.dev !== opened.stat.dev || current.ino !== opened.stat.ino || await fs$1.realpath(sourcePath) !== opened.realPath) || bytes !== params.entry.size || digest !== params.entry.sha256) throw new Error(`Control UI asset changed while being retained: ${params.entry.path}`);
		params.signal?.throwIfAborted();
	} finally {
		await Promise.allSettled([source.close(), destination?.close()]);
	}
}
async function verifyAssets(assets, verify) {
	const result = await runTasksWithConcurrency({
		tasks: assets.map((entry) => () => verify(entry)),
		limit: CONTROL_UI_ASSET_VERIFICATION_CONCURRENCY,
		errorMode: "stop"
	});
	if (result.hasError) throw result.firstError;
}
async function publishGeneration(params) {
	const target = path.join(await fs$1.realpath(params.cacheDir), params.manifest.generation);
	const stats = await fs$1.lstat(target).catch((error) => {
		if (!isErrno(error) || error.code !== "ENOENT") throw error;
		return null;
	});
	const verified = stats && (params.verified && sameDirectory(params.verified.stats, stats) ? params.verified : await readCachedGeneration(target, params.signal));
	if (verified) {
		params.signal?.throwIfAborted();
		await fs$1.utimes(target, /* @__PURE__ */ new Date(), /* @__PURE__ */ new Date());
		return verified;
	}
	const staging = path.join(params.cacheDir, `.staging-${process.pid}-${randomUUID()}`);
	params.signal?.throwIfAborted();
	await fs$1.mkdir(staging, {
		recursive: false,
		mode: 448
	});
	try {
		const sourceRoot = await root(params.root);
		const directories = new Set(params.manifest.assets.map((entry) => path.dirname(path.join(staging, entry.path))));
		for (const directory of directories) {
			params.signal?.throwIfAborted();
			await fs$1.mkdir(directory, {
				recursive: true,
				mode: 448
			});
		}
		await verifyAssets(params.manifest.assets, (entry) => verifyAsset({
			destination: path.join(staging, entry.path),
			entry,
			signal: params.signal,
			root: sourceRoot
		}));
		params.signal?.throwIfAborted();
		await fs$1.writeFile(path.join(staging, CONTROL_UI_ASSET_MANIFEST_FILENAME), `${JSON.stringify(params.manifest)}\n`, {
			mode: 384,
			signal: params.signal
		});
		params.signal?.throwIfAborted();
		let collision;
		try {
			await fs$1.rename(staging, target);
		} catch (error) {
			const collisionCodes = process.platform === "win32" ? [
				"EEXIST",
				"ENOTEMPTY",
				"EPERM"
			] : ["EEXIST", "ENOTEMPTY"];
			if (!isErrno(error) || !collisionCodes.includes(error.code ?? "")) throw error;
			collision = error;
		}
		const published = await readCachedGeneration(target, params.signal);
		if (!published) throw collision ?? /* @__PURE__ */ new Error(`Invalid retained Control UI generation: ${target}`);
		params.signal?.throwIfAborted();
		await fs$1.utimes(target, /* @__PURE__ */ new Date(), /* @__PURE__ */ new Date());
		return published;
	} finally {
		await fs$1.rm(staging, {
			recursive: true,
			force: true
		});
	}
}
async function pruneRetainedGenerations(params) {
	const inventory = await readCacheInventory(params.cacheDir, params.signal, params.verified);
	const generations = inventory.generations.toSorted((left, right) => {
		if (left.generation === params.currentGeneration) return -1;
		if (right.generation === params.currentGeneration) return 1;
		return compareGenerations(left, right);
	});
	const retained = /* @__PURE__ */ new Set();
	let retainedBytes = 0;
	for (const generation of generations) if (retained.size < CONTROL_UI_RETAINED_GENERATION_LIMIT && retainedBytes + generation.bytes <= 100663296) {
		retained.add(generation.generation);
		retainedBytes += generation.bytes;
	}
	const previous = generations.find((entry) => entry.generation !== params.currentGeneration);
	if (previous && !retained.has(previous.generation)) log.warn("Control UI asset retention cannot keep the previous generation", {
		generation: previous.generation,
		bytes: previous.bytes,
		retainedBytes,
		maxBytes: CONTROL_UI_RETAINED_ASSET_MAX_BYTES
	});
	for (const [target, stats] of inventory.directories) {
		params.signal?.throwIfAborted();
		const name = path.basename(target);
		const generation = CONTROL_UI_GENERATION_PATTERN.test(name);
		const staleStaging = CONTROL_UI_STAGING_PATTERN.test(name) && params.now - stats.mtimeMs >= CONTROL_UI_STAGING_MAX_AGE_MS;
		if ((!generation || retained.has(name)) && !staleStaging) continue;
		const currentStats = await fs$1.lstat(target).catch(() => null);
		params.signal?.throwIfAborted();
		if (!currentStats || !sameDirectory(stats, currentStats) || stats.mtimeMs !== currentStats.mtimeMs) continue;
		const staging = path.join(params.cacheDir, `.staging-${process.pid}-${randomUUID()}`);
		let owned = false;
		let claimed = false;
		try {
			await fs$1.mkdir(staging, { mode: 448 });
			owned = true;
			params.signal?.throwIfAborted();
			await fs$1.rename(target, path.join(staging, name));
			claimed = true;
			await fs$1.rm(staging, {
				recursive: true,
				force: true
			});
			log.debug("Control UI asset pruning completed", {
				directory: target,
				outcome: "pruned"
			});
		} catch (error) {
			params.signal?.throwIfAborted();
			const gone = !claimed && await fs$1.lstat(target).then(() => false, (cause) => isErrno(cause) && cause.code === "ENOENT");
			log[gone ? "debug" : "warn"]("Control UI asset pruning outcome", {
				directory: target,
				outcome: gone ? "already-pruned" : "deferred",
				error: String(error)
			});
		} finally {
			if (owned && !claimed) await fs$1.rm(staging, {
				recursive: true,
				force: true
			}).catch((error) => {
				log.warn("Control UI asset pruning cleanup deferred", {
					directory: staging,
					outcome: "deferred",
					error: String(error)
				});
			});
		}
	}
	const survivors = [];
	for (const generation of inventory.generations) {
		if (!retained.has(generation.generation)) continue;
		const stats = await fs$1.lstat(generation.directory).catch(() => null);
		params.signal?.throwIfAborted();
		if (stats && sameDirectory(generation.stats, stats)) survivors.push({
			...generation,
			stats
		});
	}
	return survivors.toSorted(compareGenerations);
}
function createControlUiAssetRetention(root) {
	const cacheDir = path.join(resolveStateDir(), "cache", "control-ui-assets");
	let generations = [];
	let preparing;
	let inventory;
	const findAsset = (assetPath) => {
		for (const generation of generations) {
			if (!generation.assetPaths.has(assetPath)) continue;
			return {
				filePath: path.join(generation.directory, assetPath),
				rootPath: generation.directory,
				rootRealPath: generation.realPath
			};
		}
		return null;
	};
	return {
		prepare({ signal } = {}) {
			preparing ??= (async () => {
				inventory = (async () => {
					signal?.throwIfAborted();
					await fs$1.mkdir(cacheDir, {
						recursive: true,
						mode: 448
					});
					await fs$1.chmod(cacheDir, 448);
					const cached = await readCacheInventory(cacheDir, signal);
					signal?.throwIfAborted();
					generations = cached.generations;
				})();
				await inventory;
				const verified = [...generations];
				const manifest = selectRetainedAssets(await readAssetManifest(root, signal));
				const manifestBytes = manifest.assets.reduce((total, asset) => total + asset.size, 0);
				if (manifestBytes <= 100663296) {
					const published = await publishGeneration({
						cacheDir,
						manifest,
						signal,
						root,
						verified: verified.find((entry) => entry.generation === manifest.generation)
					});
					verified.push(published);
				}
				const survivors = await pruneRetainedGenerations({
					cacheDir,
					verified,
					currentGeneration: manifestBytes <= 100663296 ? manifest.generation : void 0,
					now: Date.now(),
					signal
				});
				signal?.throwIfAborted();
				generations = survivors;
			})().catch((error) => {
				preparing = void 0;
				throw error;
			});
			return preparing;
		},
		async resolveAsset(assetPath) {
			const asset = findAsset(assetPath);
			if (asset || !inventory) return asset;
			await inventory.catch(() => void 0);
			return findAsset(assetPath);
		}
	};
}
//#endregion
//#region src/gateway/server-control-ui-root.ts
const MAX_PREPARED_BYTES = 100663296;
const MAX_PREPARED_ENTRIES = 2048;
function fileRuntime() {
	return resolveGlobalSingleton(Symbol.for("openclaw.controlUiRootFiles"), () => ({ roots: /* @__PURE__ */ new WeakMap() }), async (runtime) => {
		const pool = runtime.pool;
		runtime.pool = void 0;
		runtime.roots = /* @__PURE__ */ new WeakMap();
		await pool?.close();
	});
}
function rootFiles(runtime, root) {
	let files = runtime.roots.get(root);
	if (!files) {
		files = {
			controller: new AbortController(),
			pending: /* @__PURE__ */ new Map(),
			cached: new LruCache(MAX_PREPARED_ENTRIES, {
				maxBytes: MAX_PREPARED_BYTES,
				sizeOf: (entry) => entry.bytes
			})
		};
		runtime.roots.set(root, files);
	}
	return files;
}
/** Bundled bytes belong to this root generation; custom roots only share concurrent reads. */
function readControlUiRootAsset(root, fileRel, readBody) {
	const runtime = fileRuntime();
	const owner = rootFiles(runtime, root);
	owner.controller.signal.throwIfAborted();
	const key = `${readBody ? "body" : "metadata"}:${fileRel}`;
	const cachedKey = owner.cached.peek(`body:${fileRel}`) ? `body:${fileRel}` : key;
	const cached = owner.cached.get(cachedKey);
	if (cached) return Promise.resolve(cached.asset);
	const pending = owner.pending.get(key) ?? (!readBody ? owner.pending.get(`body:${fileRel}`) : void 0);
	if (pending) return pending;
	const pool = runtime.pool ??= new WorkerTaskPool({
		workerUrl: resolveRuntimeProcessEntrypointUrl("controlUiFile"),
		maxWorkers: 2,
		sharedCompute: true,
		maxPendingTasks: 2048,
		maxPendingBytes: 8388608
	});
	const read = async (input) => {
		const file = await pool.run({
			...input,
			readBody
		}, {
			signal: owner.controller.signal,
			inputBytes: 2 * (input.rootPath.length + (input.rootRealPath?.length ?? 0) + input.filePath.length)
		});
		return file && {
			...file,
			body: file.body && Buffer.from(file.body.buffer, file.body.byteOffset, file.body.byteLength)
		};
	};
	const preparation = (async () => {
		let location = {
			rootPath: root.path,
			rootRealPath: root.realPath,
			filePath: path.resolve(root.path, fileRel),
			rejectHardlinks: root.kind !== "bundled"
		};
		let file = await read(location);
		if (!file && root.kind === "bundled" && fileRel.startsWith("assets/")) {
			const retained = await root.retainedAssets?.resolveAsset(fileRel);
			if (retained) {
				location = {
					...retained,
					rootPath: retained.rootRealPath,
					rejectHardlinks: true
				};
				file = await read(location);
			}
		}
		if (!file) return null;
		const asset = { file };
		if (root.kind === "bundled" && fileRel.startsWith("assets/") && isControlUiCompressibleAsset(fileRel)) {
			const sourcePath = file.path;
			const sidecar = (suffix) => read({
				...location,
				filePath: `${sourcePath}${suffix}`
			}).catch((error) => error instanceof Error ? error : new Error(String(error)));
			[asset.br, asset.gzip] = await Promise.all([sidecar(".br"), sidecar(".gz")]);
		}
		owner.controller.signal.throwIfAborted();
		if (root.kind === "bundled" && !(asset.br instanceof Error) && !(asset.gzip instanceof Error)) {
			const bytes = (file.body?.byteLength ?? 0) + (asset.br?.body?.byteLength ?? 0) + (asset.gzip?.body?.byteLength ?? 0);
			if (bytes <= MAX_PREPARED_BYTES) owner.cached.set(key, {
				asset,
				bytes
			});
		}
		return asset;
	})().finally(() => owner.pending.delete(key));
	owner.pending.set(key, preparation);
	return preparation;
}
function resolveAutoRoot() {
	return resolveControlUiRootSync({
		moduleUrl: import.meta.url,
		argv1: process.argv[1],
		cwd: process.cwd()
	});
}
function prepareResolvedRootState({ root, configured = false, publicAssetBuildId, log }) {
	try {
		const bundled = !configured && isPackageProvenControlUiRootSync(root, {
			moduleUrl: import.meta.url,
			argv1: process.argv[1],
			cwd: process.cwd()
		});
		const resolvedRoot = {
			path: root,
			realPath: fs.realpathSync(root)
		};
		return bundled ? {
			kind: "bundled",
			...resolvedRoot,
			publicAssetBuildId,
			retainedAssets: createControlUiAssetRetention(root)
		} : {
			kind: "resolved",
			...resolvedRoot
		};
	} catch (error) {
		const message = `Control UI assets are unavailable at ${root}: ${error instanceof Error ? error.message : String(error)}`;
		log.warn(`gateway: ${message}`);
		return configured ? {
			kind: "invalid",
			path: path.resolve(root)
		} : { kind: "failed" };
	}
}
/** Prepare the stable root reference shared by every HTTP listener. */
function createGatewayControlUiRootLifecycle(params) {
	const expectedBuildId = resolveRuntimeServiceBuildId();
	let state = { kind: "preparing" };
	if (params.controlUiRootOverride) {
		const resolvedOverride = resolveControlUiRootOverrideSync(params.controlUiRootOverride);
		const resolvedOverridePath = path.resolve(params.controlUiRootOverride);
		if (!resolvedOverride) {
			params.log.warn(`gateway: controlUi.root not found at ${resolvedOverridePath}`);
			state = {
				kind: "invalid",
				path: resolvedOverridePath
			};
		} else state = prepareResolvedRootState({
			root: resolvedOverride,
			configured: true,
			log: params.log
		});
	} else if (params.controlUiEnabled) {
		const resolvedRoot = resolveAutoRoot();
		const assets = resolvedRoot ? inspectControlUiRootAssets(resolvedRoot, expectedBuildId) : null;
		state = resolvedRoot && assets?.kind === "ready" ? prepareResolvedRootState({
			root: resolvedRoot,
			publicAssetBuildId: assets.publicAssetBuildId,
			log: params.log
		}) : { kind: "preparing" };
	}
	let enabled = params.controlUiEnabled;
	let stopped = false;
	let preparation;
	const prepare = async (signal) => {
		const isStopped = () => stopped || signal.aborted;
		if (isStopped()) return;
		try {
			if (state.kind === "preparing") {
				const resolvedRoot = resolveAutoRoot();
				let assets = resolvedRoot ? inspectControlUiRootAssets(resolvedRoot, expectedBuildId) : null;
				if (assets?.kind !== "ready") {
					const result = await ensureControlUiAssetsBuilt(params.gatewayRuntime, {
						assetRoot: resolvedRoot ?? void 0,
						expectedBuildId,
						moduleUrl: import.meta.url,
						signal
					});
					if (isStopped()) return;
					if (!result.ok) {
						Object.assign(state, { kind: "failed" });
						params.log.warn(`gateway: ${result.message}`);
						return;
					}
					assets = result.assets;
				}
				Object.assign(state, prepareResolvedRootState({
					root: path.dirname(assets.indexPath),
					publicAssetBuildId: assets.publicAssetBuildId,
					log: params.log
				}));
			}
		} catch (error) {
			if (!isStopped()) {
				Object.assign(state, { kind: "failed" });
				const detail = error instanceof Error ? error.message : String(error);
				params.log.warn(`gateway: Control UI assets build failed: ${detail}`);
			}
			return;
		}
		if (state.kind === "bundled") await state.retainedAssets?.prepare({ signal }).catch((error) => {
			if (isStopped()) return;
			const detail = error instanceof Error ? error.message : String(error);
			params.log.warn(`gateway: Control UI asset retention failed: ${detail}`);
		});
	};
	const start = () => {
		if (!enabled || stopped) return Promise.resolve();
		if (preparation) return preparation.controller.signal.aborted ? preparation.promise.then(start) : preparation.promise;
		const controller = new AbortController();
		const signal = AbortSignal.any([controller.signal, getGatewayRestartDrainSignal()]);
		const promise = runOutsideGatewayRootWorkAdmission(() => Promise.resolve().then(() => prepare(signal))).finally(() => {
			preparation = void 0;
		});
		preparation = {
			controller,
			promise
		};
		return promise;
	};
	return {
		state,
		start,
		setEnabled: (nextEnabled) => {
			if (stopped || enabled === nextEnabled) return;
			enabled = nextEnabled;
			if (enabled) {
				if (state.kind === "failed") Object.assign(state, { kind: "preparing" });
				start();
			} else preparation?.controller.abort();
		},
		stop: async () => {
			stopped = true;
			preparation?.controller.abort();
			await preparation?.promise;
			const files = rootFiles(fileRuntime(), state);
			files.controller.abort();
			await Promise.allSettled(files.pending.values());
			files.cached.clear();
		}
	};
}
//#endregion
export { isControlUiPluginManagerRequest as _, resolveControlUiHtmlEncoding as a, respondControlUiNotModified as c, serveControlUiAsset as d, isControlUiSharePath as f, isControlUiApprovalDocumentPath as g, classifyControlUiRequest as h, isControlUiStaticAssetExtension as i, respondHeadForControlUiFile as l, serveControlUiShareDocument as m, readControlUiRootAsset as n, resolveControlUiRepresentation as o, resolveControlUiShareOrigin as p, isControlUiFileUnmodified as r, respondControlUiNotAcceptable as s, createGatewayControlUiRootLifecycle as t, sendControlUiHtmlBody as u, isControlUiPrecompressedAssetExtension as v, isControlUiFocusPath as y };
