import { t as asBoolean } from "./boolean-BEb0Fdt8.mjs";
import { t as asNonArrayRecord } from "./record-coerce-TIsquoVR.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { u as readMediaBuffer } from "./store-A0dMc8iV.mjs";
import "./media-store-Bt4g9ij5.mjs";
import { a as FILE_TRANSFER_SUBDIR, o as FILE_WRITE_HARD_MAX_BYTES, s as FILE_WRITE_TOOL_DESCRIPTOR } from "./descriptors-D69ns4FR.mjs";
import { t as inspectStrictBase64 } from "./base64-DHgbKH6a.mjs";
import { n as readRequiredNodePath, r as humanSize, t as invokeNodeToolPayload } from "./node-tool-invoke-DDIRmupL.mjs";
import crypto from "node:crypto";
//#region extensions/file-transfer/src/tools/file-write-tool.ts
function normalizeBase64ForCompare(value) {
	return value.replace(/=+$/u, "").replace(/-/gu, "+").replace(/_/gu, "/");
}
function decodeStrictBase64(value) {
	const decodedBytes = inspectStrictBase64(value);
	if (decodedBytes === void 0) throw new Error("contentBase64 is not valid base64");
	if (decodedBytes > 16777216) throw new Error(`decoded content is ${decodedBytes} bytes; maximum is ${FILE_WRITE_HARD_MAX_BYTES} bytes (${humanSize(FILE_WRITE_HARD_MAX_BYTES)})`);
	const buffer = Buffer.from(value, "base64");
	if (normalizeBase64ForCompare(buffer.toString("base64")) !== normalizeBase64ForCompare(value)) throw new Error("contentBase64 is not valid base64");
	return buffer;
}
async function readSourceBytes(input) {
	const sourceMediaId = input.sourceMediaId?.trim();
	if (sourceMediaId) {
		const { buffer } = await readMediaBuffer(sourceMediaId, FILE_TRANSFER_SUBDIR, FILE_WRITE_HARD_MAX_BYTES);
		return {
			buffer,
			contentBase64: buffer.toString("base64"),
			source: "media"
		};
	}
	if (input.contentBase64 === void 0) throw new Error("contentBase64 or sourceMediaId required");
	return {
		buffer: decodeStrictBase64(input.contentBase64),
		contentBase64: input.contentBase64,
		source: "inline"
	};
}
function createFileWriteTool() {
	return {
		...FILE_WRITE_TOOL_DESCRIPTOR,
		async execute(_toolCallId, params) {
			const raw = asNonArrayRecord(params);
			const { node: nodeQuery, requestedPath: filePath } = readRequiredNodePath(raw);
			const contentBase64 = typeof raw.contentBase64 === "string" ? raw.contentBase64 : void 0;
			const sourceMediaId = typeof raw.sourceMediaId === "string" ? raw.sourceMediaId : void 0;
			const overwrite = asBoolean(raw.overwrite) ?? false;
			const createParents = asBoolean(raw.createParents) ?? false;
			const sourceBytes = await readSourceBytes({
				contentBase64,
				sourceMediaId
			});
			const buffer = sourceBytes.buffer;
			const expectedSha256 = crypto.createHash("sha256").update(buffer).digest("hex");
			const { audit, payload } = await invokeNodeToolPayload({
				node: nodeQuery,
				params: raw,
				command: "file.write",
				commandParams: {
					path: filePath,
					contentBase64: sourceBytes.contentBase64,
					overwrite,
					createParents,
					expectedSha256
				},
				invalidPayloadMessage: "unexpected response from node",
				invalidPayloadError: "unexpected file.write response from node",
				errorAuditExtra: { sizeBytes: buffer.byteLength },
				requireOk: true,
				requestedPath: filePath
			});
			const typed = payload;
			await audit({
				canonicalPath: typed.path,
				decision: "allowed",
				sizeBytes: typed.size,
				sha256: typed.sha256
			});
			const overwriteNote = typed.overwritten ? " (overwrote existing file)" : "";
			return {
				content: [{
					type: "text",
					text: `Wrote ${typed.path} (${humanSize(typed.size)}, sha256:${typed.sha256.slice(0, 12)})${overwriteNote}`
				}],
				details: {
					...typed,
					source: sourceBytes.source
				}
			};
		}
	};
}
//#endregion
export { createFileWriteTool };
