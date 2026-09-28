import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as pruneMapToMaxSize } from "./map-size-CNcWiFKu.mjs";
import { i as readResponseWithLimit, n as readResponseTextPrefix } from "./http-response-body-DXfezLdR.mjs";
import "./http-body-Bl_jph25.mjs";
import { t as normalizeHostname } from "./hostname-BEfh3sRX.mjs";
import { c as isBlockedHostnameOrIp } from "./ssrf-BQRtcdBp.mjs";
import { i as fetchWithSsrFGuard, s as withStrictGuardedFetchMode } from "./fetch-guard-EFfAF2PS.mjs";
import { p as createImageProcessor, u as readImageMetadataFromHeader } from "./image-ops-CU4vxSlO.mjs";
import { isIP } from "node:net";
import { DOMParser } from "linkedom";
import pLimit from "p-limit";
import { fileTypeFromBuffer } from "file-type";
//#region src/gateway/control-ui-link-preview.ts
const HTML_MAX_BYTES = 524288;
const IMAGE_MAX_BYTES = 2097152;
const ICON_MAX_BYTES = 65536;
const IMAGE_OUTPUT_MAX_BYTES = 262144;
const REQUEST_TIMEOUT_MS = 5e3;
const PREVIEW_TIMEOUT_MS = 15e3;
const CACHE_MAX_ENTRIES = 64;
const SUCCESS_TTL_MS = 36e5;
const FAILURE_TTL_MS = 3e5;
const loads = pLimit(4);
const processor = createImageProcessor();
const cache = /* @__PURE__ */ new Map();
/** Public presentation only: never reuse browser credentials or private-network policy. */
function parseControlUiLinkPreviewUrl(value, base) {
	if (typeof value !== "string" || !value.trim() || value.length > 2048) return null;
	const url = URL.parse(value, base);
	if (!url || !["http:", "https:"].includes(url.protocol) || url.username || url.password || isIP(normalizeHostname(url.hostname)) || isBlockedHostnameOrIp(url.hostname)) return null;
	url.hash = "";
	return url;
}
function parsePageMetadata(html, finalUrl) {
	const document = new DOMParser().parseFromString(html, "text/html");
	const head = document.querySelector("head") ?? document;
	const baseHref = head.querySelector("base[href]")?.getAttribute("href");
	const baseUrl = URL.parse(baseHref ?? "", finalUrl)?.href ?? finalUrl;
	const metadata = /* @__PURE__ */ new Map();
	for (const element of head.querySelectorAll("meta")) {
		const key = (element.getAttribute("property") ?? element.getAttribute("name"))?.toLowerCase();
		const value = element.getAttribute("content")?.trim();
		if (key && value && !metadata.has(key)) metadata.set(key, value);
	}
	const title = metadata.get("og:title") ?? metadata.get("twitter:title") ?? head.querySelector("title")?.textContent;
	const description = metadata.get("og:description") ?? metadata.get("twitter:description") ?? metadata.get("description");
	const image = [
		"og:image:secure_url",
		"og:image",
		"og:image:url",
		"twitter:image",
		"twitter:image:src"
	].map((key) => parseControlUiLinkPreviewUrl(metadata.get(key), baseUrl)?.href).find(Boolean);
	const icons = [];
	for (const element of head.querySelectorAll("link")) {
		const rel = element.getAttribute("rel")?.toLowerCase().split(/\s+/u) ?? [];
		if (!rel.includes("icon") && !rel.includes("apple-touch-icon")) continue;
		const url = parseControlUiLinkPreviewUrl(element.getAttribute("href"), baseUrl)?.href;
		if (url && element.getAttribute("type") !== "image/svg+xml" && !icons.includes(url)) {
			icons.push(url);
			if (icons.length === 2) break;
		}
	}
	return {
		title: title ? truncateUtf16Safe(title.replace(/\s+/gu, " ").trim(), 180) : void 0,
		description: description ? truncateUtf16Safe(description.replace(/\s+/gu, " ").trim(), 400) : void 0,
		image,
		icons
	};
}
async function fetchPreviewResource(url, accept, signal, isEnabled, read) {
	try {
		const { response, finalUrl, release } = await fetchWithSsrFGuard(withStrictGuardedFetchMode({
			url,
			maxRedirects: 3,
			timeoutMs: REQUEST_TIMEOUT_MS,
			signal,
			init: {
				headers: { Accept: accept },
				credentials: "omit"
			},
			beforeRequest: () => {
				signal.throwIfAborted();
				if (!isEnabled()) throw new Error("Link previews disabled");
			},
			resolveDispatcherPolicy: (target) => {
				if (!parseControlUiLinkPreviewUrl(target.href)) throw new Error("Not a public preview URL");
			}
		}));
		try {
			return response.ok ? await read(response, finalUrl) : void 0;
		} finally {
			await release();
		}
	} catch {
		return;
	}
}
async function loadImage(url, icon, signal, isEnabled) {
	return await fetchPreviewResource(url, "image/*", signal, isEnabled, async (response) => {
		const bytes = await readResponseWithLimit(response, icon ? ICON_MAX_BYTES : IMAGE_MAX_BYTES, {
			signal,
			chunkTimeoutMs: REQUEST_TIMEOUT_MS
		});
		const detected = await fileTypeFromBuffer(bytes);
		if (icon && detected?.mime === "image/x-icon") return `data:image/x-icon;base64,${bytes.toString("base64")}`;
		if (!detected || ![
			"image/png",
			"image/apng",
			"image/jpeg",
			"image/webp",
			"image/gif",
			"image/avif"
		].includes(detected.mime)) return;
		const size = readImageMetadataFromHeader(bytes);
		if (!size || size.width <= 0 || size.height <= 0 || size.width > 16e6 / size.height) return;
		const result = await processor.encode(bytes, {
			format: "png",
			resize: {
				maxSide: icon ? 64 : 640,
				fit: "inside",
				enlarge: false
			},
			signal
		});
		return result.data.length <= (icon ? ICON_MAX_BYTES : IMAGE_OUTPUT_MAX_BYTES) ? `data:image/png;base64,${result.data.toString("base64")}` : void 0;
	});
}
async function loadPreview(url, isEnabled) {
	const signal = AbortSignal.timeout(PREVIEW_TIMEOUT_MS);
	const page = await fetchPreviewResource(url.href, "text/html,application/xhtml+xml", signal, isEnabled, async (response, finalUrl) => {
		const type = response.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
		if (type !== "text/html" && type !== "application/xhtml+xml") return;
		const { text } = await readResponseTextPrefix(response, HTML_MAX_BYTES, {
			signal,
			chunkTimeoutMs: REQUEST_TIMEOUT_MS
		});
		return {
			...parsePageMetadata(text, finalUrl),
			finalUrl
		};
	});
	const iconUrls = /* @__PURE__ */ new Set([...page?.icons ?? [], new URL("/favicon.ico", page?.finalUrl ?? url.href).href]);
	const [imageDataUrl, faviconDataUrl] = await Promise.all([page?.image ? loadImage(page.image, false, signal, isEnabled) : void 0, (async () => {
		for (const iconUrl of iconUrls) {
			const icon = await loadImage(iconUrl, true, signal, isEnabled);
			if (icon) return icon;
		}
	})()]);
	return isEnabled() ? {
		...page?.title ? { title: page.title } : {},
		...page?.description ? { description: page.description } : {},
		...imageDataUrl ? { imageDataUrl } : {},
		...faviconDataUrl ? { faviconDataUrl } : {}
	} : {};
}
/** Anonymous bounded cache: no user, browser-profile, cookie, or authentication state enters it. */
async function loadControlUiLinkPreview(url, isEnabled) {
	const target = parseControlUiLinkPreviewUrl(url.href);
	if (!isEnabled() || !target) return {};
	const now = Date.now();
	const existing = cache.get(target.href);
	if (existing && existing.expiresAt > now) {
		const result = await existing.promise;
		return isEnabled() ? result : {};
	}
	if (loads.activeCount + loads.pendingCount >= 32) return {};
	const entry = {
		expiresAt: Number.POSITIVE_INFINITY,
		promise: loads(() => loadPreview(target, isEnabled)).catch(() => ({}))
	};
	cache.delete(target.href);
	cache.set(target.href, entry);
	pruneMapToMaxSize(cache, CACHE_MAX_ENTRIES);
	const result = await entry.promise;
	entry.expiresAt = Date.now() + (Object.keys(result).length ? SUCCESS_TTL_MS : FAILURE_TTL_MS);
	return isEnabled() ? result : {};
}
//#endregion
export { loadControlUiLinkPreview, parseControlUiLinkPreviewUrl };
