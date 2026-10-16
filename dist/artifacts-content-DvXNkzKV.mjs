import { g as readStringValue, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as isHttpUrl } from "./url-protocol-OU3K-ySz.mjs";
import { n as mimeFromDataUrl, r as readArtifactBase64Payload, t as base64FromDataUrl } from "./artifacts-base64-CgvdhGQA.mjs";
//#region src/gateway/server-methods/artifacts-content.ts
function toArtifactSummary(artifact) {
	const { data: _data, url: _url, ...summary } = artifact;
	return summary;
}
function mediaUrlValue(value) {
	if (typeof value === "string") return normalizeOptionalString(value);
	const record = asOptionalRecord(value);
	return normalizeOptionalString(record?.url);
}
function isSafeDownloadUrl(value) {
	const trimmed = value.trim();
	return trimmed.startsWith("/api/") || isHttpUrl(trimmed);
}
function resolveMessageRunId(message) {
	const meta = asOptionalRecord(message["__openclaw"]);
	return normalizeOptionalString(meta?.runId) ?? normalizeOptionalString(message.runId);
}
function resolveBlockDownload(block, opts) {
	const data = readStringValue(block.data)?.trim();
	const content = readStringValue(block.content)?.trim();
	const url = normalizeOptionalString(block.url) ?? normalizeOptionalString(block.openUrl);
	const imageUrl = mediaUrlValue(block.image_url);
	const audioUrl = normalizeOptionalString(block.audio_url);
	const source = asOptionalRecord(block.source);
	const sourceData = readStringValue(source?.data)?.trim();
	const sourceUrl = normalizeOptionalString(source?.url);
	const dataUrl = [
		url,
		sourceUrl,
		imageUrl,
		audioUrl,
		data,
		content,
		sourceData
	].find((value) => typeof value === "string" && /^data:/i.test(value));
	const base64FromDetectedDataUrl = readArtifactBase64Payload(dataUrl ? base64FromDataUrl(dataUrl) : void 0, opts);
	const directBase64 = [
		data,
		sourceData,
		content
	].filter((value) => typeof value === "string" && !/^data:/i.test(value)).map((value) => readArtifactBase64Payload(value, opts)).find((value) => value !== void 0);
	const base64 = base64FromDetectedDataUrl ?? directBase64;
	const remoteUrl = [
		url,
		sourceUrl,
		imageUrl,
		audioUrl
	].find((value) => typeof value === "string" && isSafeDownloadUrl(value));
	const mimeType = normalizeOptionalString(block.mimeType) ?? normalizeOptionalString(block.media_type) ?? normalizeOptionalString(source?.media_type) ?? normalizeOptionalString(source?.mimeType) ?? (dataUrl ? mimeFromDataUrl(dataUrl) : void 0);
	const explicitSize = block.sizeBytes ?? source?.sizeBytes;
	const sizeBytes = typeof explicitSize === "number" && Number.isFinite(explicitSize) && explicitSize >= 0 ? Math.floor(explicitSize) : base64?.sizeBytes;
	if (base64) return {
		mode: "bytes",
		data: base64.data,
		mimeType,
		sizeBytes,
		payloadSizeBytes: base64.sizeBytes
	};
	if (remoteUrl) return {
		mode: "url",
		url: remoteUrl,
		mimeType,
		sizeBytes
	};
	return {
		mode: "unsupported",
		mimeType,
		sizeBytes
	};
}
//#endregion
export { toArtifactSummary as i, resolveBlockDownload as n, resolveMessageRunId as r, mediaUrlValue as t };
