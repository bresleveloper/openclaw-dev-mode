import { l as kindFromMime } from "./mime-1zBUMwu6.mjs";
import { n as matchesHttpIfNoneMatch, t as matchesHttpIfModifiedSince } from "./http-conditional-vOFTJV-M.mjs";
import { createHash } from "node:crypto";
//#region src/gateway/assistant-media-content-disposition.ts
function buildAssistantMediaContentDisposition(filename, mime) {
	const sanitizedInput = truncateFilenamePreservingExtension(toWellFormedFilename(filename.replace(/[\r\n]/g, "_")), 200);
	const fallback = sanitizedInput.replace(/[^\x20-\x7e]|[%"\\]/g, "_").trim() || "download";
	const extended = encodeURIComponent(sanitizedInput).replace(/[\x27()*]/g, (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`);
	const kind = kindFromMime(mime);
	return `${kind === "image" || kind === "audio" || kind === "video" ? "inline" : "attachment"}; filename="${fallback}"; filename*=UTF-8''${extended}`;
}
function toWellFormedFilename(value) {
	let result = "";
	for (const char of value) {
		const code = char.charCodeAt(0);
		result += char.length === 1 && code >= 55296 && code <= 57343 ? "�" : char;
	}
	return result;
}
function truncateFilenamePreservingExtension(value, maxCodePoints) {
	const chars = Array.from(value);
	if (chars.length <= maxCodePoints) return value;
	const extension = shortFilenameExtension(chars);
	if (extension.length === 0 || extension.length >= maxCodePoints - 1) return chars.slice(0, maxCodePoints).join("");
	return `${chars.slice(0, maxCodePoints - extension.length).join("")}${extension.join("")}`;
}
function shortFilenameExtension(chars) {
	const lastDot = chars.lastIndexOf(".");
	if (lastDot <= 0 || lastDot === chars.length - 1) return [];
	const extension = chars.slice(lastDot);
	return extension.length <= 32 ? extension : [];
}
//#endregion
//#region src/gateway/http-byte-range.ts
function createImmutableFileValidators(file) {
	return {
		etag: `"${createHash("sha256").update(`${file.size}:${file.mtimeMs}`).digest("base64url")}"`,
		mtimeMs: file.mtimeMs
	};
}
function parseByteRange(value, size) {
	const normalized = value.trim();
	if (normalized.includes(",")) return "invalid";
	const match = /^bytes=(\d*)-(\d*)$/i.exec(normalized);
	if (!match || !match[1] && !match[2]) return "invalid";
	const [, rangeStart = "", rangeEnd = ""] = match;
	const fileSize = BigInt(size);
	if (!rangeStart) {
		const suffixLength = BigInt(rangeEnd);
		if (suffixLength === 0n || fileSize === 0n) return "unsatisfiable";
		const start = suffixLength >= fileSize ? 0n : fileSize - suffixLength;
		return {
			start: Number(start),
			end: size - 1
		};
	}
	const start = BigInt(rangeStart);
	if (start >= fileSize) return "unsatisfiable";
	const requestedEnd = rangeEnd ? BigInt(rangeEnd) : fileSize - 1n;
	if (requestedEnd < start) return "unsatisfiable";
	const end = requestedEnd >= fileSize ? fileSize - 1n : requestedEnd;
	return {
		start: Number(start),
		end: Number(end)
	};
}
function resolveByteResponse(params) {
	const etag = params.validators?.etag;
	const originatedAtMs = params.nowMs ?? Date.now();
	const lastModifiedMs = params.validators ? Math.floor(Math.min(params.validators.mtimeMs, originatedAtMs) / 1e3) * 1e3 : void 0;
	const lastModified = lastModifiedMs === void 0 ? void 0 : new Date(lastModifiedMs).toUTCString();
	const headers = params.request?.headers;
	const ifNoneMatch = headers?.["if-none-match"];
	if ((params.method === "GET" || params.method === "HEAD") && (matchesHttpIfNoneMatch(ifNoneMatch, etag) || ifNoneMatch === void 0 && lastModifiedMs !== void 0 && matchesHttpIfModifiedSince(params.request, lastModifiedMs, originatedAtMs))) return {
		kind: "not-modified",
		statusCode: 304,
		etag,
		lastModified
	};
	const full = {
		kind: "full",
		statusCode: 200,
		contentLength: params.file.size,
		etag,
		lastModified
	};
	const rangeHeader = headers?.range;
	if (params.method !== "GET" || typeof rangeHeader !== "string") return full;
	const ifRangeHeader = headers?.["if-range"];
	if (ifRangeHeader !== void 0 && ifRangeHeader !== etag && ifRangeHeader !== lastModified) return full;
	const range = parseByteRange(rangeHeader, params.file.size);
	if (range === "invalid") return full;
	if (range === "unsatisfiable") return {
		kind: "unsatisfiable",
		statusCode: 416,
		contentLength: 0,
		etag,
		lastModified,
		size: params.file.size
	};
	return {
		kind: "partial",
		statusCode: 206,
		contentLength: range.end - range.start + 1,
		etag,
		lastModified,
		range,
		size: params.file.size
	};
}
function writeByteHeaders(res, plan) {
	res.statusCode = plan.statusCode;
	res.setHeader("Accept-Ranges", "bytes");
	if (plan.etag !== void 0) res.setHeader("ETag", plan.etag);
	if (plan.lastModified !== void 0) res.setHeader("Last-Modified", plan.lastModified);
	if (plan.kind === "not-modified") return;
	res.setHeader("Content-Length", String(plan.contentLength));
	if (plan.kind === "partial") res.setHeader("Content-Range", `bytes ${plan.range.start}-${plan.range.end}/${plan.size}`);
	else if (plan.kind === "unsatisfiable") res.setHeader("Content-Range", `bytes */${plan.size}`);
}
function createGatewayByteStream(res, handle, onReadError) {
	let stream;
	let closed = false;
	const close = async () => {
		if (closed) return;
		closed = true;
		if (stream) {
			stream.destroy();
			return;
		}
		await handle.close().catch(() => {});
	};
	const release = () => {
		close();
	};
	res.once("close", release);
	return {
		close,
		async pipe(plan, method, beforeSend) {
			if (method === "HEAD" || !("contentLength" in plan) || plan.contentLength === 0) {
				await close();
				beforeSend?.();
				res.end();
				return;
			}
			if (closed || res.destroyed || res.writableEnded) {
				await close();
				return;
			}
			beforeSend?.();
			stream = handle.createReadStream({
				start: plan.kind === "partial" ? plan.range.start : 0,
				end: plan.kind === "partial" ? plan.range.end : plan.contentLength - 1,
				autoClose: true
			});
			stream.once("end", release).once("close", release);
			stream.once("error", () => {
				release();
				if (!res.destroyed && !res.writableEnded) {
					if (res.headersSent) res.destroy();
					else onReadError();
				}
			});
			stream.pipe(res);
		}
	};
}
//#endregion
export { buildAssistantMediaContentDisposition as a, writeByteHeaders as i, createImmutableFileValidators as n, resolveByteResponse as r, createGatewayByteStream as t };
