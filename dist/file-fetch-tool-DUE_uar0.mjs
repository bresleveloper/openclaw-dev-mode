import { u as readPositiveIntegerParam } from "./common-BofcG96e.mjs";
import { a as wrapExternalContent } from "./external-content-Bkm4w5qo.mjs";
import "./security-runtime-6domDoE8.mjs";
import { f as saveMediaBuffer } from "./store-BOkrav0N.mjs";
import "./media-store-DTUgE8Z1.mjs";
import "./param-readers-gVcVc5Er.mjs";
import { a as FILE_TRANSFER_SUBDIR, i as FILE_FETCH_TOOL_DESCRIPTOR } from "./descriptors-CuxGfPJm.mjs";
import { t as IMAGE_MIME_INLINE_SET } from "./mime-YhVRnsMm.mjs";
import { r as FILE_FETCH_HARD_MAX_BYTES } from "./file-fetch-protocol-DfFx1zZa.mjs";
import { n as readRequiredNodePath, r as humanSize, t as invokeNodeToolPayload } from "./node-tool-invoke-BScviGCX.mjs";
import { t as decodeFetchPayload } from "./fetch-payload-mhJgiC4_.mjs";
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
			const { canonicalPath, size, mimeType, base64, sha256, buffer } = decodeFetchPayload("file.fetch", payload);
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
