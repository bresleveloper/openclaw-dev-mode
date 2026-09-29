import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { a as openRootFile, s as readFileDescriptorBounded } from "./boundary-file-read-D-Aa04On.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { i as isPluginActivityToolName, r as PLUGIN_ACTIVITY_ICON_MAX_BYTES } from "./manifest-registry-build-BbQTPsvD.mjs";
import { n as startsWithSvgRootElement } from "./svg-image-1iOdCRUI.mjs";
import { d as readClawHubStringField, i as fetchClawHubJson, v as resolveClawHubImageUrl } from "./clawhub-client-D8cfvjQG.mjs";
import { t as normalizeHostname } from "./hostname-BEfh3sRX.mjs";
import { c as isBlockedHostnameOrIp } from "./ssrf-BQRtcdBp.mjs";
import "./image-processor-config-StN3hXY9.mjs";
import { p as createImageProcessor, u as readImageMetadataFromHeader } from "./image-ops-CU4vxSlO.mjs";
import { r as readRemoteMediaBuffer } from "./fetch-BtTl3cm9.mjs";
import { i as parseControlUiResourcePath } from "./control-ui-resource-routes-DVy_LnYu.mjs";
import "./control-ui-contract-Dup6xL62.mjs";
import { t as authorizeControlUiReadRequestOrReply } from "./http-auth-utils-BJQtuB_7.mjs";
import { l as sendMethodNotAllowed, y as respondNotFound } from "./http-common-Ckbyca3h.mjs";
import "./http-utils-BihU3mvk.mjs";
import { a as resolveManagedPluginActivityIconSource, c as resolveManagedSetupCatalogIconUrl, o as resolveManagedPluginIconSources } from "./management-service-BPiOYlEh.mjs";
import { a as resolveHttpImageMimeType, i as createHttpImageRepresentation, s as sendHttpImageResponse } from "./http-image-response-DQqwbtvS.mjs";
import { n as resolveClawHubCatalogIconUrl } from "./catalog-icon-registry-b1MkOn00.mjs";
import { closeSync } from "node:fs";
import { isIP } from "node:net";
import pLimit from "p-limit";
import { fileTypeFromBuffer } from "file-type";
//#region src/infra/clawhub-plugin-icons.ts
/** Branding needs one package read, not versions, README or security enrichment. */
async function fetchClawHubPluginIconUrls(params) {
	const value = await fetchClawHubJson({
		...params,
		path: `/api/v1/packages/${encodeURIComponent(params.packageName)}`,
		retryTransientReads: false
	});
	if (!isRecord(value) || !isRecord(value.package)) throw new Error("Malformed ClawHub plugin icon response: expected a package object.");
	if (value.package.name !== params.packageName) throw new Error("ClawHub plugin icon response changed the requested package identity.");
	const owner = value.owner;
	if (owner != null && !isRecord(owner)) throw new Error("Malformed ClawHub plugin icon response: expected an owner object.");
	return [readClawHubStringField(value.package, "icon", "plugin icon"), owner ? readClawHubStringField(owner, "image", "plugin owner") : void 0].flatMap((url) => url ? [resolveClawHubImageUrl(url, params.baseUrl) ?? url] : []);
}
//#endregion
//#region src/gateway/plugin-icon-http.ts
const PLUGIN_ID_RE = /^(?:[a-z0-9][a-z0-9._-]{0,127}|@[a-z0-9][a-z0-9._-]{0,63}\/[a-z0-9][a-z0-9._-]{0,127})$/iu;
const SVG_MIME_TYPE = "image/svg+xml";
const PLUGIN_ICON_CACHE_MAX_ENTRIES = 128;
const LINK_FAVICON_MAX_BYTES = 65536;
const LINK_FAVICON_NEGATIVE_CACHE_TTL_MS = 3e5;
const LINK_FAVICON_MAX_OUTSTANDING_FETCHES = 32;
const linkFaviconFetchLimit = pLimit(4);
const PLUGIN_ICON_MAX_BYTES = 262144;
const PLUGIN_ICON_MAX_REDIRECTS = 3;
const PLUGIN_ICON_REQUEST_TIMEOUT_MS = 5e3;
const PLUGIN_ICON_CACHE_TTL_MS = 36e5;
let pluginIconCache = /* @__PURE__ */ new Map();
const pluginIconImageProcessor = createImageProcessor();
function normalizeLinkFaviconHostname(value) {
	if (value.length > 253) return null;
	const normalized = normalizeHostname(value);
	if (!normalized || isIP(normalized) !== 0 || isBlockedHostnameOrIp(normalized)) return null;
	try {
		return new URL(`https://${normalized}/`).hostname === normalized ? normalized : null;
	} catch {
		return null;
	}
}
async function validateImageMime(body, contentType) {
	if (contentType === SVG_MIME_TYPE) {
		const text = body.toString("utf8");
		return !text.includes("\0") && !/<!doctype|<!entity/iu.test(text) && startsWithSvgRootElement(text);
	}
	const detected = await fileTypeFromBuffer(body);
	return resolveHttpImageMimeType(detected?.mime) === contentType;
}
function rememberIcon(cache, cacheKey, entry) {
	cache.delete(cacheKey);
	cache.set(cacheKey, entry);
	pruneMapToMaxSize(cache, PLUGIN_ICON_CACHE_MAX_ENTRIES);
	return entry;
}
async function normalizeIconPayload(params) {
	const contentType = resolveHttpImageMimeType(params.contentType);
	if (!contentType || !await validateImageMime(params.body, contentType)) return null;
	if (contentType === SVG_MIME_TYPE || contentType === "image/x-icon") return createHttpImageRepresentation(params.body, contentType);
	const metadata = readImageMetadataFromHeader(params.body);
	if (!metadata || !Number.isInteger(metadata.width) || !Number.isInteger(metadata.height) || metadata.width <= 0 || metadata.height <= 0 || metadata.width > 25e6 / metadata.height) return null;
	const normalized = await pluginIconImageProcessor.encode(params.body, {
		format: "png",
		compressionLevel: 9,
		resize: {
			fit: "inside",
			maxSide: 256,
			enlarge: false
		}
	});
	if (normalized.data.byteLength > params.maxBytes) return null;
	return createHttpImageRepresentation(normalized.data, "image/png");
}
async function loadPackageIcon(params) {
	const cacheKey = `${params.cacheScope}\0file:${params.rootPath}\0${params.iconPath}`;
	const now = Date.now();
	const cached = pluginIconCache.get(cacheKey);
	if (cached && cached.expiresAt > now) {
		pluginIconCache.delete(cacheKey);
		pluginIconCache.set(cacheKey, cached);
		return await cached.promise;
	}
	if (cached) pluginIconCache.delete(cacheKey);
	const pending = (async () => {
		const maxBytes = params.activity ? PLUGIN_ACTIVITY_ICON_MAX_BYTES : PLUGIN_ICON_MAX_BYTES;
		const opened = await openRootFile({
			absolutePath: params.iconPath,
			rootPath: params.rootPath,
			boundaryLabel: "plugin package directory",
			maxBytes,
			rejectHardlinks: true
		});
		if (!opened.ok) return null;
		try {
			const body = await readFileDescriptorBounded(opened.fd, maxBytes);
			if (body.byteLength < 1) return null;
			return await normalizeIconPayload({
				body,
				contentType: params.activity ? SVG_MIME_TYPE : "image/png",
				maxBytes
			});
		} catch {
			return null;
		} finally {
			closeSync(opened.fd);
		}
	})();
	const entry = rememberIcon(pluginIconCache, cacheKey, {
		expiresAt: now + PLUGIN_ICON_CACHE_TTL_MS,
		promise: pending
	});
	const result = await pending;
	if (!result && pluginIconCache.get(cacheKey) === entry) pluginIconCache.delete(cacheKey);
	return result;
}
async function loadCatalogIcon(params) {
	let parsed;
	try {
		parsed = new URL(params.iconUrl);
	} catch {
		return null;
	}
	if (parsed.protocol !== "https:" || parsed.username || parsed.password || !parsed.hostname || parsed.hash) return null;
	const cacheKey = `${params.cacheScope}\0${parsed.href}`;
	const now = Date.now();
	const cached = pluginIconCache.get(cacheKey);
	if (cached && cached.expiresAt > now) {
		pluginIconCache.delete(cacheKey);
		pluginIconCache.set(cacheKey, cached);
		return await cached.promise;
	}
	if (cached) pluginIconCache.delete(cacheKey);
	const load = async () => {
		try {
			const loaded = await readRemoteMediaBuffer({
				url: parsed.href,
				maxBytes: params.maxBytes ?? 262144,
				maxRedirects: 3,
				requireHttps: params.requireHttps,
				timeoutMs: PLUGIN_ICON_REQUEST_TIMEOUT_MS,
				responseHeaderTimeoutMs: PLUGIN_ICON_REQUEST_TIMEOUT_MS,
				readIdleTimeoutMs: PLUGIN_ICON_REQUEST_TIMEOUT_MS,
				requestInit: { headers: { Accept: "image/avif,image/webp,image/png,image/jpeg,image/gif,image/svg+xml" } }
			});
			return await normalizeIconPayload({
				body: loaded.buffer,
				contentType: loaded.contentType,
				maxBytes: params.maxBytes ?? 262144
			});
		} catch {
			return null;
		}
	};
	if (params.limitConcurrency && linkFaviconFetchLimit.activeCount + linkFaviconFetchLimit.pendingCount >= LINK_FAVICON_MAX_OUTSTANDING_FETCHES) return null;
	const pending = params.limitConcurrency ? linkFaviconFetchLimit(load) : load();
	const entry = rememberIcon(pluginIconCache, cacheKey, {
		expiresAt: now + PLUGIN_ICON_CACHE_TTL_MS,
		promise: pending
	});
	const result = await pending;
	if (!result && pluginIconCache.get(cacheKey) === entry) {
		if (params.retainFailureForMs) entry.expiresAt = Date.now() + params.retainFailureForMs;
		else pluginIconCache.delete(cacheKey);
	}
	return result;
}
function clearPluginIconCacheForTest() {
	pluginIconCache = /* @__PURE__ */ new Map();
}
async function loadPluginIcon(cacheScope, sources) {
	const cacheKey = `${cacheScope}\0sources:${JSON.stringify(sources)}`;
	const cached = pluginIconCache.get(cacheKey);
	if (cached && cached.expiresAt > Date.now()) return await cached.promise;
	const pending = (async () => {
		for (const source of sources) if (source.kind === "file") {
			const icon = await loadPackageIcon({
				cacheScope,
				iconPath: source.path,
				rootPath: source.rootPath
			});
			if (icon) return icon;
		} else try {
			const urls = await fetchClawHubPluginIconUrls({
				...source,
				skipAuth: true,
				timeoutMs: PLUGIN_ICON_REQUEST_TIMEOUT_MS
			});
			for (const iconUrl of urls) {
				const icon = await loadCatalogIcon({
					cacheScope,
					iconUrl
				});
				if (icon) return icon;
			}
		} catch {}
		return null;
	})();
	const entry = rememberIcon(pluginIconCache, cacheKey, {
		expiresAt: Date.now() + PLUGIN_ICON_CACHE_TTL_MS,
		promise: pending
	});
	const result = await pending;
	if (!result && pluginIconCache.get(cacheKey) === entry) pluginIconCache.delete(cacheKey);
	return result;
}
async function handlePluginIconHttpRequest(req, res, opts) {
	const requestUrl = req.url ? new URL(req.url, "http://localhost") : void 0;
	const pathname = requestUrl?.pathname;
	const pluginRequest = parseControlUiResourcePath("pluginIcon", pathname, opts.basePath);
	const activityRequest = parseControlUiResourcePath("pluginActivityIcon", pathname, opts.basePath);
	const catalogRequest = parseControlUiResourcePath("catalogIcon", pathname, opts.basePath);
	const faviconRequest = parseControlUiResourcePath("linkFavicon", pathname, opts.basePath);
	if (!pluginRequest.matched && !activityRequest.matched && !catalogRequest.matched && !faviconRequest.matched) return false;
	const packageRequest = activityRequest.matched ? activityRequest : pluginRequest;
	const pluginId = packageRequest.matched && packageRequest.value && PLUGIN_ID_RE.test(packageRequest.value) ? packageRequest.value : null;
	const toolNames = activityRequest.matched ? requestUrl?.searchParams.getAll("tool") ?? [] : [];
	const toolName = toolNames[0];
	const catalogIconUrl = catalogRequest.matched ? catalogRequest.value : null;
	const faviconHostname = faviconRequest.matched ? faviconRequest.value ? normalizeLinkFaviconHostname(faviconRequest.value) : null : null;
	const method = req.method;
	if (method !== "GET" && method !== "HEAD") {
		sendMethodNotAllowed(res, "GET, HEAD");
		return true;
	}
	const requestAuth = await authorizeControlUiReadRequestOrReply({
		...opts,
		req,
		res,
		cfg: opts.cfg ?? opts.config
	});
	if (!requestAuth) return true;
	requestAuth.assertCurrent();
	if (activityRequest.matched && (toolNames.length > 1 || toolName !== void 0 && !isPluginActivityToolName(toolName))) {
		respondNotFound(res);
		return true;
	}
	if (faviconRequest.matched && opts.config.gateway?.controlUi?.automaticallyFetchFavicons === false) {
		respondNotFound(res);
		return true;
	}
	const pluginIcon = pluginId ? activityRequest.matched ? await resolveManagedPluginActivityIconSource({
		config: opts.config,
		pluginId,
		toolName
	}) : await resolveManagedPluginIconSources({
		config: opts.config,
		pluginId
	}) : void 0;
	requestAuth.assertCurrent();
	const remoteIconUrl = catalogIconUrl ? resolveManagedSetupCatalogIconUrl({
		config: opts.config,
		iconUrl: catalogIconUrl
	}) ?? resolveClawHubCatalogIconUrl(catalogIconUrl) : faviconHostname ? `https://${faviconHostname}/favicon.ico` : void 0;
	if (!pluginIcon && !remoteIconUrl) {
		respondNotFound(res);
		return true;
	}
	const cacheScope = pluginId ? `${activityRequest.matched ? "plugin-activity" : "plugin"}:${pluginId}` : faviconHostname ? "favicon" : "catalog";
	const icon = Array.isArray(pluginIcon) ? await loadPluginIcon(cacheScope, pluginIcon) : pluginIcon ? await loadPackageIcon({
		cacheScope,
		iconPath: pluginIcon.path,
		rootPath: pluginIcon.rootPath,
		activity: activityRequest.matched
	}) : await loadCatalogIcon({
		cacheScope,
		iconUrl: remoteIconUrl,
		...faviconHostname ? {
			maxBytes: LINK_FAVICON_MAX_BYTES,
			requireHttps: true,
			retainFailureForMs: LINK_FAVICON_NEGATIVE_CACHE_TTL_MS,
			limitConcurrency: true
		} : {}
	});
	requestAuth.assertCurrent();
	if (!icon) {
		respondNotFound(res);
		return true;
	}
	sendHttpImageResponse({
		req,
		res,
		image: icon,
		filename: faviconHostname ? "link-favicon" : activityRequest.matched ? "plugin-activity-icon" : "plugin-icon"
	});
	return true;
}
//#endregion
export { LINK_FAVICON_MAX_BYTES, PLUGIN_ICON_CACHE_TTL_MS, PLUGIN_ICON_MAX_BYTES, PLUGIN_ICON_MAX_REDIRECTS, PLUGIN_ICON_REQUEST_TIMEOUT_MS, clearPluginIconCacheForTest, handlePluginIconHttpRequest };
