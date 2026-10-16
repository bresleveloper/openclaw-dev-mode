import { D as resolveExpiresAtMsFromDurationMs, j as resolveIntegerOption, o as asDateTimestampMs, r as MAX_TIMER_TIMEOUT_SECONDS, s as asFiniteNumber, u as asPositiveFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
import { n as consumeResponseBytes, t as decodeTextPrefix } from "./src-CdRlGRnW.mjs";
import { t as pruneMapToMaxSize } from "./map-size-BlrH_CnE.mjs";
//#region src/agents/tools/web-shared.ts
const DEFAULT_TIMEOUT_SECONDS = 30;
const DEFAULT_CACHE_TTL_MINUTES = 15;
function resolveTimeoutSeconds(value, fallback) {
	return resolveIntegerOption(value, fallback, {
		min: 1,
		max: MAX_TIMER_TIMEOUT_SECONDS
	});
}
function resolvePositiveTimeoutSeconds(value, fallback) {
	return resolveTimeoutSeconds(asPositiveFiniteNumber(value), fallback);
}
function resolveCacheTtlMs(value, fallbackMinutes) {
	const minutes = asFiniteNumber(value);
	return Math.round((minutes === void 0 ? fallbackMinutes : Math.max(0, minutes)) * 6e4);
}
function normalizeCacheKey(value) {
	return value.trim();
}
function readCache(cache, key, ttlMs = Infinity) {
	const entry = cache.get(key);
	if (!entry || ttlMs <= 0) return null;
	const now = asDateTimestampMs(Date.now());
	if (now === void 0 || now >= entry.expiresAt) {
		cache.delete(key);
		return null;
	}
	return now - entry.insertedAt < ttlMs ? {
		value: entry.value,
		cached: true
	} : null;
}
function writeCache(cache, key, value, ttlMs) {
	if (ttlMs <= 0) return;
	const now = Date.now();
	const expiresAt = resolveExpiresAtMsFromDurationMs(ttlMs, { nowMs: now });
	if (expiresAt === void 0) return;
	pruneMapToMaxSize(cache, 99);
	cache.set(key, {
		value,
		expiresAt,
		insertedAt: now
	});
}
const RESPONSE_CHARSET_SCAN_BYTES = 4096;
const latin1Decoder = new TextDecoder("latin1");
function normalizeCharset(value) {
	const normalized = value?.trim().replace(/^["']|["']$/g, "") ?? "";
	return normalized && normalized.length <= 64 && /^[A-Za-z0-9._:-]+$/.test(normalized) ? normalized : void 0;
}
function readCharsetParam(value) {
	const match = /(?:^|;)\s*charset\s*=\s*(?:"([^"]+)"|'([^']+)'|([^;\s]+))/i.exec(value ?? "");
	return normalizeCharset(match?.[1] ?? match?.[2] ?? match?.[3]);
}
function readAttribute(tag, name) {
	const target = name.toLowerCase();
	for (const match of tag.matchAll(/([A-Za-z0-9:_-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>]+))/g)) if (match[1]?.toLowerCase() === target) return match[2] ?? match[3] ?? match[4] ?? "";
}
function shouldSniffDocumentCharset(contentType) {
	const mediaType = contentType?.split(";", 1)[0]?.trim().toLowerCase();
	if (!mediaType) return true;
	return mediaType === "text/html" || mediaType === "application/xhtml+xml" || mediaType === "text/xml" || mediaType === "application/xml" || mediaType.endsWith("+xml");
}
function sniffCharset(contentType, bytes) {
	if (bytes[0] === 239 && bytes[1] === 187 && bytes[2] === 191) return "utf-8";
	if (bytes[0] === 255 && bytes[1] === 254) return "utf-16le";
	if (bytes[0] === 254 && bytes[1] === 255) return "utf-16be";
	const declaredCharset = readCharsetParam(contentType);
	if (declaredCharset || !shouldSniffDocumentCharset(contentType)) return declaredCharset;
	const head = latin1Decoder.decode(bytes.subarray(0, Math.min(bytes.byteLength, RESPONSE_CHARSET_SCAN_BYTES)));
	const xmlEncoding = /<\?xml\s+[^>]*\bencoding\s*=\s*(?:"([^"]+)"|'([^']+)')/i.exec(head);
	if (xmlEncoding) return normalizeCharset(xmlEncoding[1] ?? xmlEncoding[2]);
	for (const match of head.matchAll(/<meta\b[^>]*>/gi)) {
		const tag = match[0];
		const charset = normalizeCharset(readAttribute(tag, "charset"));
		if (charset) return charset;
		if (/^content-type$/i.test(readAttribute(tag, "http-equiv") ?? "")) {
			const contentCharset = readCharsetParam(readAttribute(tag, "content"));
			if (contentCharset) return contentCharset;
		}
	}
}
function responseContentType(res) {
	const headers = res.headers;
	return typeof headers?.get === "function" ? headers.get("content-type") : null;
}
function decodeResponseBytes(res, bytes, truncated = false) {
	const charset = sniffCharset(responseContentType(res), bytes);
	try {
		return decodeTextPrefix(bytes, {
			encoding: charset ?? "utf-8",
			truncated
		});
	} catch {
		return decodeTextPrefix(bytes, {
			encoding: "utf-8",
			truncated
		});
	}
}
async function readResponseText(res, options) {
	const maxBytesRaw = asPositiveFiniteNumber(options?.maxBytes);
	const maxBytes = maxBytesRaw === void 0 ? void 0 : Math.floor(maxBytesRaw);
	const body = res.body;
	if (maxBytes && body && typeof body === "object" && typeof body.getReader === "function") {
		const reader = body.getReader();
		let bytesRead = 0;
		let truncated = false;
		const parts = [];
		try {
			truncated = (await consumeResponseBytes({
				maxBytes,
				read: () => reader.read(),
				onChunk: (chunk) => {
					bytesRead += chunk.byteLength;
					parts.push(chunk);
				},
				onLimit: () => void 0
			})).truncated;
		} catch {
			truncated = true;
		} finally {
			if (truncated) reader.cancel().catch(() => void 0);
			try {
				reader.releaseLock();
			} catch {}
		}
		return {
			text: decodeResponseBytes(res, parts.length === 1 && parts[0]?.byteLength === bytesRead ? parts[0] : Buffer.concat(parts, bytesRead), truncated),
			truncated,
			bytesRead
		};
	}
	if (maxBytes) {
		if (res instanceof Response && res.body === null) return {
			text: "",
			truncated: false,
			bytesRead: 0
		};
		return {
			text: "",
			truncated: true,
			bytesRead: 0
		};
	}
	if (typeof res.arrayBuffer === "function") try {
		const bytes = new Uint8Array(await res.arrayBuffer());
		return {
			text: decodeResponseBytes(res, bytes),
			truncated: false,
			bytesRead: bytes.byteLength
		};
	} catch {}
	try {
		const text = await res.text();
		return {
			text,
			truncated: false,
			bytesRead: new TextEncoder().encode(text).byteLength
		};
	} catch {
		return {
			text: "",
			truncated: false,
			bytesRead: 0
		};
	}
}
//#endregion
export { readResponseText as a, resolveTimeoutSeconds as c, readCache as i, writeCache as l, DEFAULT_TIMEOUT_SECONDS as n, resolveCacheTtlMs as o, normalizeCacheKey as r, resolvePositiveTimeoutSeconds as s, DEFAULT_CACHE_TTL_MINUTES as t };
