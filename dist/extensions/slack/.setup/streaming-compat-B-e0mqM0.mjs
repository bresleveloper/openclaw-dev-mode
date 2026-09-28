import { normalizeLowercaseStringOrEmpty, normalizeOptionalString } from "openclaw/plugin-sdk/string-coerce-runtime";
import { getChannelStreamingConfigObject, resolveChannelStreamingNativeTransport } from "openclaw/plugin-sdk/channel-streaming-config";
//#region extensions/slack/src/streaming-compat.ts
function normalizeStreamingMode(value) {
	if (typeof value !== "string") return null;
	return (normalizeOptionalString(value) == null ? "" : normalizeLowercaseStringOrEmpty(value)) || null;
}
function parseStreamingMode(value) {
	const normalized = normalizeStreamingMode(value);
	if (normalized === "off" || normalized === "partial" || normalized === "block" || normalized === "progress") return normalized;
	return null;
}
function parseSlackLegacyDraftStreamMode(value) {
	const normalized = normalizeStreamingMode(value);
	if (normalized === "replace" || normalized === "status_final" || normalized === "append") return normalized;
	return null;
}
function mapSlackLegacyDraftStreamModeToStreaming(mode) {
	if (mode === "append") return "block";
	if (mode === "status_final") return "progress";
	return "partial";
}
function resolveSlackStreamingMode(params = {}) {
	const parsedStreaming = parseStreamingMode(getChannelStreamingConfigObject(params)?.mode ?? params.streaming);
	if (parsedStreaming) return parsedStreaming;
	const legacyStreamMode = parseSlackLegacyDraftStreamMode(params.streamMode);
	if (legacyStreamMode) return mapSlackLegacyDraftStreamModeToStreaming(legacyStreamMode);
	if (typeof params.streaming === "boolean") return params.streaming ? "partial" : "off";
	return "progress";
}
function resolveSlackNativeStreaming(params = {}) {
	const canonical = resolveChannelStreamingNativeTransport(params);
	if (typeof canonical === "boolean") return canonical;
	if (typeof params.nativeStreaming === "boolean") return params.nativeStreaming;
	if (typeof params.streaming === "boolean") return params.streaming;
	return true;
}
//#endregion
export { resolveSlackStreamingMode as n, resolveSlackNativeStreaming as t };
