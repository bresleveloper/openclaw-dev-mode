import { l as asNonNegativeFiniteNumber } from "./number-coercion-CuVhdCBs.mjs";
//#region src/gateway/server-methods/attachment-normalize.ts
function normalizeAttachmentContent(content) {
	if (typeof content === "string") return content;
	if (ArrayBuffer.isView(content)) return Buffer.from(content.buffer, content.byteOffset, content.byteLength).toString("base64");
	if (content instanceof ArrayBuffer) return Buffer.from(content).toString("base64");
}
function normalizeRpcAttachmentsToChatAttachments(attachments) {
	return attachments?.map((a) => {
		const sourceRecord = a?.source && typeof a.source === "object" ? a.source : void 0;
		const sourceMimeType = typeof sourceRecord?.media_type === "string" ? sourceRecord.media_type : void 0;
		const sourceContent = sourceRecord?.type === "base64" ? normalizeAttachmentContent(sourceRecord.data) : void 0;
		const sizeBytes = asNonNegativeFiniteNumber(a?.sizeBytes);
		const durationMs = asNonNegativeFiniteNumber(a?.durationMs);
		const width = asNonNegativeFiniteNumber(a?.width);
		const height = asNonNegativeFiniteNumber(a?.height);
		return {
			type: typeof a?.type === "string" ? a.type : void 0,
			mimeType: typeof a?.mimeType === "string" ? a.mimeType : sourceMimeType,
			fileName: typeof a?.fileName === "string" ? a.fileName : void 0,
			content: normalizeAttachmentContent(a?.content) ?? sourceContent,
			...a?.origin === "paste" || a?.origin === "file" ? { origin: a.origin } : {},
			...sizeBytes !== void 0 ? { sizeBytes } : {},
			...durationMs !== void 0 ? { durationMs } : {},
			...width !== void 0 ? { width } : {},
			...height !== void 0 ? { height } : {}
		};
	}).filter((a) => a.content !== void 0) ?? [];
}
//#endregion
export { normalizeRpcAttachmentsToChatAttachments as t };
