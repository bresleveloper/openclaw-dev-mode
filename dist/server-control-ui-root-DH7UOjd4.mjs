import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as LruCache } from "./lru-cache-C3Xgvc4Q.mjs";
import { s as resolveRuntimeServiceBuildId } from "./version-jg_14gWz.mjs";
import { n as resolveRuntimeProcessEntrypointUrl } from "./runtime-process-url-BCfqgqXF.mjs";
import { t as WorkerTaskPool } from "./worker-task-pool-D6ogd941.mjs";
import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { S as runOutsideGatewayRootWorkAdmission, l as getGatewayRestartDrainSignal } from "./gateway-work-admission-FWbk4b3p.mjs";
import { a as getRemoteControlUiIngressContext, r as assertRemoteControlUiIngressCurrent } from "./ingress-attribution-CP_2XS9r.mjs";
import { a as isPackageProvenControlUiRootSync, c as resolveControlUiRootOverrideSync, i as inspectControlUiRootAssets, l as resolveControlUiRootSync, n as ensureControlUiAssetsBuilt } from "./control-ui-assets-f8KcxxVR.mjs";
import { t as resolveHttpContentEncodings } from "./http-content-encoding-DVf1MER7.mjs";
import { i as respondPlainText } from "./control-ui-http-utils-CpDIFFwm.mjs";
import { t as matchesHttpIfModifiedSince } from "./http-conditional-DaagcxHO.mjs";
import fs from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { brotliCompress, constants as constants$1, gzip } from "node:zlib";
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
	const compression = getOrCreatePromise(controlUiHtmlCompressionCache, key, () => encoding === "br" ? compressBrotli(Buffer.from(body), { params: { [constants$1.BROTLI_PARAM_QUALITY]: 4 } }) : compressGzip(Buffer.from(body), { level: 6 }), { cacheRejections: false });
	pruneMapToMaxSize(controlUiHtmlCompressionCache, CONTROL_UI_HTML_COMPRESSION_CACHE_MAX_ENTRIES);
	return compression;
}
function respondControlUiNotAcceptable(res) {
	res.setHeader("Cache-Control", "no-store");
	res.setHeader("Vary", "Accept-Encoding");
	respondPlainText(res, 406, "Not Acceptable");
}
async function sendControlUiHtmlBody(req, res, body, isCurrent) {
	const encoding = resolveControlUiHtmlEncoding(req);
	if (encoding === "not-acceptable") {
		respondControlUiNotAcceptable(res);
		return;
	}
	setControlUiEncodingHeaders(res, ".html", encoding);
	const encoded = encoding === "identity" ? body : await cachedCompressedControlUiHtml(body, encoding);
	const ingress = getRemoteControlUiIngressContext(req);
	if (ingress) assertRemoteControlUiIngressCurrent(ingress);
	if (isCurrent && !isCurrent()) {
		res.removeHeader("Content-Encoding");
		res.setHeader("Cache-Control", "no-store");
		res.removeHeader("Content-Security-Policy");
		res.removeHeader("X-OpenClaw-Session-Entry");
		respondPlainText(res, 403, "Session access changed. Reload the conversation or log in again.");
		return;
	}
	res.end(encoded);
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
			generation: 0,
			cacheEnabled: true,
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
	const generation = owner.generation;
	const key = `${readBody ? "body" : "metadata"}:${fileRel}`;
	const pendingKey = `${generation}:${key}`;
	const cachedKey = owner.cached.peek(`body:${fileRel}`) ? `body:${fileRel}` : key;
	const cached = owner.cached.get(cachedKey);
	if (cached) return Promise.resolve(cached.asset);
	const pending = owner.pending.get(pendingKey) ?? (!readBody ? owner.pending.get(`${generation}:body:${fileRel}`) : void 0);
	if (pending) return pending;
	const pool = runtime.pool ??= new WorkerTaskPool({
		workerUrl: resolveRuntimeProcessEntrypointUrl("controlUiFile"),
		workerClass: "file-reader",
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
		const location = {
			rootPath: root.path,
			rootRealPath: root.realPath,
			filePath: path.resolve(root.path, fileRel),
			rejectHardlinks: root.kind !== "bundled"
		};
		const file = await read(location);
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
		if (root.kind === "bundled" && owner.cacheEnabled && owner.generation === generation && !(asset.br instanceof Error) && !(asset.gzip instanceof Error)) {
			const bytes = (file.body?.byteLength ?? 0) + (asset.br?.body?.byteLength ?? 0) + (asset.gzip?.body?.byteLength ?? 0);
			if (bytes <= MAX_PREPARED_BYTES) owner.cached.set(key, {
				asset,
				bytes
			});
		}
		return asset;
	})().finally(() => owner.pending.delete(pendingKey));
	owner.pending.set(pendingKey, preparation);
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
			publicAssetBuildId
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
		}
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
			const files = rootFiles(fileRuntime(), state);
			files.generation++;
			files.cacheEnabled = enabled;
			files.cached.clear();
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
export { resolveControlUiHtmlEncoding as a, respondControlUiNotModified as c, serveControlUiAsset as d, isControlUiStaticAssetExtension as i, respondHeadForControlUiFile as l, readControlUiRootAsset as n, resolveControlUiRepresentation as o, isControlUiFileUnmodified as r, respondControlUiNotAcceptable as s, createGatewayControlUiRootLifecycle as t, sendControlUiHtmlBody as u };
