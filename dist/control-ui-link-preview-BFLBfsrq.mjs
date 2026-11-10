import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import { r as withResponseBodyTimeout } from "./http-response-body-timeout-eMZmV6xc.mjs";
import { i as readResponseWithLimit } from "./http-response-body-B70cE6fn.mjs";
import { t as normalizeHostname } from "./hostname-Db1ZcSGB.mjs";
import { o as isBlockedHostnameOrIp } from "./ssrf-K50Tjeok.mjs";
import { i as fetchWithSsrFGuard, o as withStrictGuardedFetchMode } from "./fetch-guard-DRapCKeS.mjs";
import { f as readImageMetadataFromHeader, h as createImageProcessor } from "./image-ops-DM5GUpDi.mjs";
import { isIP } from "node:net";
import pLimit from "p-limit";
import { Parser } from "htmlparser2";
import { fileTypeFromBuffer } from "file-type";
//#region src/gateway/control-ui-link-preview.ts
const HTML_MAX_BYTES = 65536;
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
const principals = /* @__PURE__ */ new WeakMap();
let nextPrincipal = 0;
const cache = /* @__PURE__ */ new Map();
/** Public presentation only: never reuse browser credentials or private-network policy. */
function parseControlUiLinkPreviewUrl(value, base) {
	if (typeof value !== "string" || !value.trim() || value.length > 2048) return null;
	const url = URL.parse(value, base);
	if (!url || !["http:", "https:"].includes(url.protocol) || url.username || url.password || isIP(normalizeHostname(url.hostname)) || isBlockedHostnameOrIp(url.hostname)) return null;
	url.hash = "";
	return url;
}
async function readPageMetadata(response, finalUrl, signal) {
	const metadata = /* @__PURE__ */ new Map();
	const links = [];
	let baseHref;
	let titleText;
	let inTitle = false;
	let finished = false;
	const parser = new Parser({
		onopentag(name, attrs) {
			if (name === "body") {
				finished = true;
				parser.pause();
			} else if (name === "base") baseHref ??= attrs.href;
			else if (name === "title" && titleText === void 0) {
				titleText = "";
				inTitle = true;
			} else if (name === "meta") {
				const key = (attrs.property ?? attrs.name)?.toLowerCase();
				const value = attrs.content?.trim();
				if (key && value && !metadata.has(key)) metadata.set(key, value);
			} else if (name === "link") links.push(attrs);
		},
		ontext(text) {
			if (inTitle) titleText += text;
		},
		onclosetag(name) {
			if (name === "title") inTitle = false;
			else if (name === "head") {
				finished = true;
				parser.pause();
			}
		}
	});
	const reader = response.body?.getReader();
	if (reader) try {
		await withResponseBodyTimeout({
			signal,
			timeoutMs: REQUEST_TIMEOUT_MS,
			onTimeout: void 0,
			cancel: (error) => reader.cancel(error),
			read: async (refreshTimeout) => {
				const decoder = new TextDecoder();
				let remaining = HTML_MAX_BYTES;
				while (remaining > 0) {
					refreshTimeout?.();
					const { done, value } = await reader.read();
					if (done) {
						parser.end(decoder.decode());
						return;
					}
					const chunk = value.subarray(0, remaining);
					remaining -= chunk.byteLength;
					parser.write(decoder.decode(chunk, { stream: true }));
					if (finished) return;
				}
				parser.end();
			}
		});
	} finally {
		reader.cancel().catch(() => void 0);
		reader.releaseLock();
	}
	const baseUrl = URL.parse(baseHref ?? "", finalUrl)?.href ?? finalUrl;
	const title = metadata.get("og:title") ?? metadata.get("twitter:title") ?? titleText;
	const description = metadata.get("og:description") ?? metadata.get("twitter:description") ?? metadata.get("description");
	const image = [
		"og:image:secure_url",
		"og:image",
		"og:image:url",
		"twitter:image",
		"twitter:image:src"
	].map((key) => parseControlUiLinkPreviewUrl(metadata.get(key), baseUrl)?.href).find(Boolean);
	const icons = [];
	for (const attrs of links) {
		const rel = attrs.rel?.toLowerCase().split(/\s+/u) ?? [];
		if (!rel.includes("icon") && !rel.includes("apple-touch-icon")) continue;
		const url = parseControlUiLinkPreviewUrl(attrs.href, baseUrl)?.href;
		if (url && attrs.type !== "image/svg+xml" && !icons.includes(url)) {
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
async function loadImage(bytes, icon, signal) {
	try {
		if (!bytes || bytes.length > (icon ? ICON_MAX_BYTES : IMAGE_MAX_BYTES)) return;
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
	} catch {
		return;
	}
}
async function loadPreview(url, isEnabled, signal) {
	if (signal.aborted || !isEnabled()) return {};
	const page = await fetchPreviewResource(url.href, "text/html,application/xhtml+xml", signal, isEnabled, async (response, finalUrl) => {
		const type = response.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
		if (type !== "text/html" && type !== "application/xhtml+xml") return;
		return {
			...await readPageMetadata(response, finalUrl, signal),
			finalUrl
		};
	});
	const iconUrls = /* @__PURE__ */ new Set([...page?.icons ?? [], new URL("/favicon.ico", page?.finalUrl ?? url.href).href]);
	const images = /* @__PURE__ */ new Map();
	const imageBytes = (target) => {
		let pending = images.get(target);
		if (!pending) {
			pending = fetchPreviewResource(target, "image/*", signal, isEnabled, (response) => readResponseWithLimit(response, target === page?.image ? IMAGE_MAX_BYTES : ICON_MAX_BYTES, {
				signal,
				chunkTimeoutMs: REQUEST_TIMEOUT_MS
			}));
			images.set(target, pending);
		}
		return pending;
	};
	const [imageDataUrl, faviconDataUrl] = await Promise.all([page?.image ? imageBytes(page.image).then((bytes) => loadImage(bytes, false, signal)) : void 0, (async () => {
		for (const iconUrl of iconUrls) {
			const icon = await loadImage(await imageBytes(iconUrl), true, signal);
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
/** Anonymous requests, isolated to the requesting principal and owner revision. */
async function loadControlUiLinkPreview(url, isEnabled, scope) {
	if (!isEnabled()) return {};
	let principal = principals.get(scope.principal);
	if (principal === void 0) {
		principal = ++nextPrincipal;
		principals.set(scope.principal, principal);
	}
	const key = JSON.stringify([
		principal,
		scope.revision,
		url.href
	]);
	const now = Date.now();
	const existing = cache.get(key);
	if (existing && existing.expiresAt > now) {
		const result = await existing.promise;
		return isEnabled() ? result : {};
	}
	if (loads.activeCount + loads.pendingCount >= 32) return {};
	const signal = AbortSignal.timeout(PREVIEW_TIMEOUT_MS);
	const entry = {
		expiresAt: Number.POSITIVE_INFINITY,
		promise: racePromiseWithAbortSignal(loads(() => loadPreview(url, isEnabled, signal)), signal).catch(() => ({}))
	};
	cache.delete(key);
	cache.set(key, entry);
	pruneMapToMaxSize(cache, CACHE_MAX_ENTRIES);
	const result = await entry.promise;
	entry.expiresAt = Date.now() + (Object.keys(result).length ? SUCCESS_TTL_MS : FAILURE_TTL_MS);
	return isEnabled() ? result : {};
}
//#endregion
export { loadControlUiLinkPreview, parseControlUiLinkPreviewUrl };
