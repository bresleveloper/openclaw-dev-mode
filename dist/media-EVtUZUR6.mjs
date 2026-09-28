import { l as kindFromMime, u as mimeTypeFromFilePath } from "./mime-1zBUMwu6.mjs";
import { l as normalizeMediaFacts, u as projectMediaFacts } from "./media-facts-BEHTU0wM.mjs";
import { t as probeMediaFilesWithinBudget } from "./media-probe-Bdg20gzZ.mjs";
import { t as resolveLocalMediaPath } from "./local-media-path-Buj_gOGY.mjs";
//#region src/channels/inbound-event/media.ts
const MAX_INBOUND_MEDIA_PROBES = 8;
const INBOUND_MEDIA_PROBE_CONCURRENCY = 2;
const INBOUND_MEDIA_PROBE_BUDGET_MS = 3e3;
function resolveMediaPlaceholderKind(media) {
	if (media.kind && media.kind !== "unknown") return media.kind;
	const inferredKind = kindFromMime(media.contentType) ?? kindFromMime(mimeTypeFromFilePath(media.url)) ?? kindFromMime(mimeTypeFromFilePath(media.path));
	return inferredKind && inferredKind !== "unknown" ? inferredKind : "attachment";
}
const PLURAL_MEDIA_PLACEHOLDER_LABELS = {
	image: "images",
	video: "videos",
	audio: "audio attachments",
	document: "files",
	sticker: "stickers",
	attachment: "attachments"
};
/** Renders structured media facts for channel surfaces that can carry text only. */
function formatMediaPlaceholderText(media) {
	if (media.length === 0) return "";
	const kinds = media.map(resolveMediaPlaceholderKind);
	const firstKind = kinds[0] ?? "attachment";
	const kind = kinds.every((candidate) => candidate === firstKind) ? firstKind : kinds.includes("attachment") ? "attachment" : "document";
	const tag = `<media:${kind}>`;
	return media.length === 1 ? tag : `${tag} (${media.length} ${PLURAL_MEDIA_PLACEHOLDER_LABELS[kind]})`;
}
/** Appends an unavailable-media notice to real caption text, or returns the notice alone. */
function formatInboundMediaUnavailableText(params) {
	const body = params.body?.trim() ?? "";
	const notice = params.notice.trim();
	if (!body) return notice;
	return `${body}\n\n${notice}`;
}
/** Normalizes plugin-provided attachments into ordered runtime facts. */
function toInboundMediaFacts(media, defaults = {}) {
	return normalizeMediaFacts(media, defaults);
}
function resolveProbeKind(media) {
	const kind = media.kind ?? kindFromMime(media.contentType) ?? kindFromMime(mimeTypeFromFilePath(media.path));
	return kind === "audio" || kind === "video" ? kind : void 0;
}
/** Adds best-effort audio/video metadata without probing URL-only media. */
async function toInboundMediaFactsWithMetadata(media, defaults = {}) {
	const facts = toInboundMediaFacts(media, defaults);
	const enriched = [...facts];
	const candidates = [];
	for (const [index, fact] of facts.entries()) {
		const kind = resolveProbeKind(fact);
		const localPath = fact.path ? resolveLocalMediaPath(fact.path) : void 0;
		if (kind && localPath) candidates.push({
			fact,
			index,
			kind,
			localPath
		});
	}
	const metadata = await probeMediaFilesWithinBudget(candidates.map((candidate) => ({
		filePath: candidate.localPath,
		kind: candidate.kind
	})), {
		budgetMs: INBOUND_MEDIA_PROBE_BUDGET_MS,
		concurrency: INBOUND_MEDIA_PROBE_CONCURRENCY,
		maxProbes: MAX_INBOUND_MEDIA_PROBES
	});
	for (const [candidateIndex, candidate] of candidates.entries()) enriched[candidate.index] = {
		...candidate.fact,
		...metadata[candidateIndex]
	};
	return enriched;
}
/** Projects facts into history without transient turn-only fields. */
function toHistoryMediaEntries(media, defaults = {}) {
	return toInboundMediaFacts(media, defaults).map((entry) => {
		const historyEntry = {
			path: entry.path,
			url: entry.url,
			contentType: entry.contentType,
			kind: entry.kind,
			messageId: entry.messageId
		};
		if (entry.durationMs) historyEntry.durationMs = entry.durationMs;
		if (entry.width) historyEntry.width = entry.width;
		if (entry.height) historyEntry.height = entry.height;
		return historyEntry;
	});
}
/**
* Builds the legacy singular/plural environment projection.
* @deprecated Pass ordered facts as `media`; use `toInboundMediaFacts` to normalize inputs.
*/
function buildChannelInboundMediaPayload(media) {
	return projectMediaFacts(media);
}
//#endregion
export { toInboundMediaFacts as a, toHistoryMediaEntries as i, formatInboundMediaUnavailableText as n, toInboundMediaFactsWithMetadata as o, formatMediaPlaceholderText as r, buildChannelInboundMediaPayload as t };
