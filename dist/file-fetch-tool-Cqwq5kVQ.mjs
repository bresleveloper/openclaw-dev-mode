import { a as wrapExternalContent } from "./external-content-Bkm4w5qo.mjs";
import "./security-runtime-CpTHQYW2.mjs";
import { u as readPositiveIntegerParam } from "./common-Dyxcwsy8.mjs";
import { f as saveMediaBuffer } from "./store-A0dMc8iV.mjs";
import "./media-store-Bt4g9ij5.mjs";
import "./param-readers-B4Zo5Lzz.mjs";
import { a as FILE_TRANSFER_SUBDIR, i as FILE_FETCH_TOOL_DESCRIPTOR } from "./descriptors-D69ns4FR.mjs";
import { t as IMAGE_MIME_INLINE_SET } from "./mime-2T0HwsBn.mjs";
import { r as FILE_FETCH_HARD_MAX_BYTES } from "./file-fetch-protocol-DfFx1zZa.mjs";
import { n as readRequiredNodePath, r as humanSize, t as invokeNodeToolPayload } from "./node-tool-invoke-ClYOYWOk.mjs";
import crypto from "node:crypto";
//#region extensions/file-transfer/src/tools/file-fetch-tool.ts
function createFileFetchTool() {
	return {
		...FILE_FETCH_TOOL_DESCRIPTOR,
		execute: async (_toolCallId, args) => {
			const params = args;
			const { node, requestedPath: filePath } = readRequiredNodePath(params);
			const requestedMax = readPositiveIntegerParam(params, "maxBytes") ?? 8388608;
			const { audit, payload } = await invokeNodeToolPayload({
				node,
				params,
				command: "file.fetch",
				commandParams: {
					path: filePath,
					maxBytes: Math.max(1, Math.min(requestedMax, FILE_FETCH_HARD_MAX_BYTES))
				},
				requestedPath: filePath
			});
			const canonicalPath = typeof payload.path === "string" ? payload.path : "";
			const size = typeof payload.size === "number" ? payload.size : -1;
			const mimeType = typeof payload.mimeType === "string" ? payload.mimeType : "";
			const hasBase64 = typeof payload.base64 === "string";
			const base64 = hasBase64 ? payload.base64 : "";
			const sha256 = typeof payload.sha256 === "string" ? payload.sha256 : "";
			if (!canonicalPath || size < 0 || !mimeType || !hasBase64 || !sha256) throw new Error("invalid file.fetch payload (missing fields)");
			const buffer = Buffer.from(base64, "base64");
			if (buffer.byteLength !== size) throw new Error(`file.fetch size mismatch: payload says ${size} bytes, decoded ${buffer.byteLength}`);
			if (crypto.createHash("sha256").update(buffer).digest("hex") !== sha256) throw new Error("file.fetch sha256 mismatch (integrity failure)");
			const saved = await saveMediaBuffer(buffer, mimeType, FILE_TRANSFER_SUBDIR, FILE_FETCH_HARD_MAX_BYTES, canonicalPath);
			const localPath = saved.path;
			const shortHash = sha256.slice(0, 12);
			const isInlineImage = IMAGE_MIME_INLINE_SET.has(mimeType) && base64.length > 0;
			const isInlineText = size <= 8192 && (mimeType.startsWith("text/") || mimeType === "application/json" || mimeType === "application/xml" || mimeType === "application/yaml");
			let summaryText = `Fetched ${canonicalPath} (${humanSize(size)}, ${mimeType}, sha256:${shortHash}) saved at ${localPath}\nmediaId: ${saved.id}`;
			if (isInlineText) {
				const decodedText = buffer.toString("utf-8");
				const text = decodedText.startsWith("﻿") ? decodedText.slice(1) : decodedText;
				summaryText += `\n\n--- contents ---\n${text}`;
			}
			const content = [{
				type: "text",
				text: wrapExternalContent(summaryText, { source: "unknown" })
			}];
			if (isInlineImage) content.push({
				type: "image",
				data: base64,
				mimeType
			});
			await audit({
				canonicalPath,
				decision: "allowed",
				sizeBytes: size,
				sha256
			});
			return {
				content,
				details: {
					path: canonicalPath,
					size,
					mimeType,
					sha256,
					localPath,
					mediaId: saved.id,
					media: { mediaUrls: [localPath] }
				}
			};
		}
	};
}
//#endregion
export { createFileFetchTool };
