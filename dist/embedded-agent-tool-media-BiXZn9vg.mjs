import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { l as asNonNegativeFiniteNumber, u as asPositiveFiniteNumber } from "./number-coercion-CkhMiRw8.mjs";
import { c as isRecord, i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as safeParseJson } from "./json-coercion-pfKbZnCJ.mjs";
import { t as AUTOMATIONS_TOOL_NAME } from "./automations-tool-name-DaxQ5QU2.mjs";
import { c as normalizeToolPolicyName } from "./tool-policy-shared-PsZCKeeN.mjs";
import "./tool-policy-14GRhbFd.mjs";
import { a as readToolResultDetails } from "./tool-result-error-IpvGgAny.mjs";
import { r as getCoreTtsToolResultMediaUrls } from "./tts-tool-result-provenance-BbSbWcUn.mjs";
import { a as extractToolResultText } from "./embedded-agent-tool-results-0KH5a_sR.mjs";
//#region src/agents/harness/messaging-media.ts
const MESSAGE_MEDIA_KEYS = [
	"media",
	"mediaUrl",
	"media_url",
	"path",
	"filePath",
	"fileUrl",
	"imageUrl",
	"image_url"
];
const MESSAGE_MEDIA_ARRAY_KEYS = [
	"mediaUrls",
	"media_urls",
	"imageUrls",
	"image_urls"
];
const HARNESS_SCALAR_ALIASES = /* @__PURE__ */ new Set([
	"media_url",
	"imageUrl",
	"image_url"
]);
const ATTACHMENT_MEDIA_KEYS = [
	"media",
	"mediaUrl",
	"path",
	"filePath",
	"fileUrl",
	"url"
];
function mapAgentHarnessMessagingMediaValues(args, mapValue, includeHarnessAliases = true) {
	const mapString = (value) => typeof value === "string" ? mapValue(value) : value;
	const mapArray = (values, map) => {
		if (!Array.isArray(values)) return values;
		const mapped = values.map(map);
		return mapped.some((value, index) => value !== values[index]) ? mapped : values;
	};
	const mapRecord = (record, keys, message = false) => {
		let mapped = record;
		const assign = (key, value) => {
			if (value !== record[key]) {
				if (mapped === record) mapped = { ...record };
				mapped[key] = value;
			}
		};
		for (const key of keys) if (!message || includeHarnessAliases || !HARNESS_SCALAR_ALIASES.has(key)) assign(key, mapString(record[key]));
		if (message) {
			for (const key of includeHarnessAliases ? MESSAGE_MEDIA_ARRAY_KEYS : ["mediaUrls"]) assign(key, mapArray(record[key], mapString));
			assign("attachments", mapArray(record.attachments, (attachment) => isRecord(attachment) ? mapRecord(attachment, ATTACHMENT_MEDIA_KEYS) : attachment));
		}
		return mapped;
	};
	return mapRecord(args, MESSAGE_MEDIA_KEYS, true);
}
/** Ordered references for delivery evidence; repeated sources remain distinct entries. */
function collectAgentHarnessMessagingMediaUrls(record) {
	const urls = [];
	mapAgentHarnessMessagingMediaValues(record, (value) => {
		const trimmed = value.trim();
		if (trimmed) urls.push(trimmed);
		return value;
	});
	return urls;
}
//#endregion
//#region src/agents/embedded-agent-tool-media.ts
function pushUniqueMessagingMediaUrl(urls, value) {
	const normalized = normalizeOptionalString(value);
	if (normalized) urls.add(normalized);
}
function collectMessagingMediaUrlsFromRecord(record) {
	const urls = /* @__PURE__ */ new Set();
	mapAgentHarnessMessagingMediaValues(record, (value) => {
		pushUniqueMessagingMediaUrl(urls, value);
		return value;
	}, false);
	return [...urls];
}
function collectMessagingMediaUrlsFromToolResult(result) {
	const records = [result, asOptionalObjectRecord(result)?.details];
	const outputText = extractToolResultText(result);
	if (outputText) records.push(safeParseJson(outputText));
	return [...new Set(records.flatMap((value) => {
		const record = asOptionalObjectRecord(value);
		return record ? collectMessagingMediaUrlsFromRecord(record) : [];
	}))];
}
const TRUSTED_TOOL_RESULT_MEDIA = /* @__PURE__ */ new Set([
	"agents_list",
	"apply_patch",
	"browser",
	"canvas",
	AUTOMATIONS_TOOL_NAME,
	"edit",
	"exec",
	"gateway",
	"view_image",
	"image_generate",
	"memory_get",
	"memory_search",
	"message",
	"music_generate",
	"nodes",
	"process",
	"read",
	"session_status",
	"sessions_history",
	"sessions_list",
	"sessions_search",
	"sessions_send",
	"sessions_spawn",
	"subagents",
	"tts",
	"video_generate",
	"web_fetch",
	"web_search",
	"x_search",
	"write"
]);
const HTTP_URL_RE = /^https?:\/\//i;
function isCoreToolResultMediaTrustedName(toolName) {
	return Boolean(toolName && TRUSTED_TOOL_RESULT_MEDIA.has(normalizeToolPolicyName(toolName)));
}
function isExternalToolResult(result) {
	const details = readToolResultDetails(result);
	return typeof details?.mcpServer === "string" || typeof details?.mcpTool === "string";
}
function isToolResultMediaTrusted(toolName, result, trustedLocalMediaToolNames) {
	if (!toolName || isExternalToolResult(result)) return false;
	const registeredName = toolName.trim();
	if (registeredName && trustedLocalMediaToolNames?.has(registeredName) === true) return true;
	return isCoreToolResultMediaTrustedName(toolName);
}
function getTrustedOwnedTtsLocalMediaUrls(toolName, result, trustedLocalMediaToolNames) {
	if (!toolName || !isToolResultMediaTrusted(toolName, result, trustedLocalMediaToolNames) || normalizeToolPolicyName(toolName) !== "tts") return;
	const media = readToolResultDetails(result)?.media;
	if (!media || typeof media !== "object" || Array.isArray(media)) return;
	return media.trustedLocalMedia === true ? getCoreTtsToolResultMediaUrls(result) : void 0;
}
function filterToolResultMediaUrls(toolName, mediaUrls, result, trustedLocalMediaToolNames) {
	if (mediaUrls.length === 0) return mediaUrls;
	const trustedOwnedTtsMediaUrls = getTrustedOwnedTtsLocalMediaUrls(toolName, result, trustedLocalMediaToolNames);
	if (isToolResultMediaTrusted(toolName, result, trustedLocalMediaToolNames)) {
		if (trustedLocalMediaToolNames !== void 0) {
			const registeredName = toolName?.trim();
			if (!registeredName || !trustedLocalMediaToolNames.has(registeredName)) return mediaUrls.filter((url) => HTTP_URL_RE.test(url.trim()) || trustedOwnedTtsMediaUrls?.includes(url.trim()));
		}
		return mediaUrls;
	}
	return mediaUrls.filter((url) => HTTP_URL_RE.test(url.trim()));
}
function readToolResultDetailsMedia(result) {
	const details = readToolResultDetails(result);
	return details?.media && typeof details.media === "object" && !Array.isArray(details.media) ? details.media : void 0;
}
const REPLY_ATTACHMENT_METADATA_KEYS = /* @__PURE__ */ new Set([
	"type",
	"path",
	"url",
	"mediaUrl",
	"filePath",
	"mimeType",
	"name",
	"sizeBytes",
	"durationMs",
	"width",
	"height"
]);
const MEDIA_URL_KEYS = [
	"media",
	"path",
	"url",
	"mediaUrl",
	"filePath",
	"fileUrl"
];
function collectStructuredMedia(media) {
	const mediaUrls = /* @__PURE__ */ new Set();
	const attachmentsByUrl = /* @__PURE__ */ new Map();
	const pushString = (value, attachment) => {
		pushUniqueMessagingMediaUrl(mediaUrls, value);
		const normalized = typeof value === "string" ? value.trim() : "";
		if (normalized && attachment && !attachmentsByUrl.has(normalized)) attachmentsByUrl.set(normalized, attachment);
	};
	const pushAttachment = (value) => {
		if (!value || typeof value !== "object" || Array.isArray(value)) return;
		const record = value;
		const attachment = Object.fromEntries(Object.entries(record).filter(([key, entry]) => {
			if (!REPLY_ATTACHMENT_METADATA_KEYS.has(key)) return false;
			if (key === "type") return entry === "image" || entry === "audio" || entry === "video" || entry === "file";
			if (key === "width" || key === "height") return asPositiveFiniteNumber(entry) !== void 0;
			if (key === "sizeBytes" || key === "durationMs") return asNonNegativeFiniteNumber(entry) !== void 0;
			return typeof entry === "string";
		}));
		for (const key of MEDIA_URL_KEYS) pushString(record[key], attachment);
	};
	for (const key of MEDIA_URL_KEYS) pushString(media[key]);
	if (Array.isArray(media.mediaUrls)) for (const value of media.mediaUrls) pushString(value);
	if (Array.isArray(media.attachments)) for (const attachment of media.attachments) pushAttachment(attachment);
	return {
		mediaUrls: [...mediaUrls],
		...attachmentsByUrl.size > 0 ? { attachments: [...mediaUrls].map((url) => attachmentsByUrl.get(url) ?? {}) } : {}
	};
}
function extractToolResultMediaArtifact(result) {
	if (!result || typeof result !== "object") return;
	const record = result;
	const detailsMedia = readToolResultDetailsMedia(record);
	if (detailsMedia) {
		if (detailsMedia.outbound === false) return;
		const structuredMedia = collectStructuredMedia(detailsMedia);
		if (structuredMedia.mediaUrls.length > 0) return {
			...structuredMedia,
			...detailsMedia.audioAsVoice === true ? { audioAsVoice: true } : {},
			...detailsMedia.trustedLocalMedia === true ? { trustedLocalMedia: true } : {}
		};
	}
	if ((Array.isArray(record.content) ? record.content : null)?.some((item) => item && typeof item === "object" && item.type === "image")) {
		const details = record.details;
		const p = normalizeOptionalString(details?.path) ?? "";
		if (p) return { mediaUrls: [p] };
	}
}
//#endregion
export { isCoreToolResultMediaTrustedName as a, filterToolResultMediaUrls as i, collectMessagingMediaUrlsFromToolResult as n, collectAgentHarnessMessagingMediaUrls as o, extractToolResultMediaArtifact as r, mapAgentHarnessMessagingMediaValues as s, collectMessagingMediaUrlsFromRecord as t };
