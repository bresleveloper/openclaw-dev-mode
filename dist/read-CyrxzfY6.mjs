import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./utils-aKqR_F_U.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { d as isTranscriptSessionActive, p as readTranscriptCaptureSnapshot } from "./capture-operations-Cb-IOv0_.mjs";
import { n as sanitizeTranscriptSourceLocator } from "./source-locator-CLW5DWGY.mjs";
import { r as normalizeExportText } from "./store-K2ivV-ir.mjs";
//#region src/transcripts/read.ts
/** Only public locator fields cross the Gateway; provider-private keys stay in the archive. */
function projectTranscriptSource(source) {
	const safe = sanitizeTranscriptSourceLocator(source);
	const kind = safe.kind;
	return {
		providerId: safe.providerId,
		...[
			"live-audio",
			"live-caption",
			"posthoc-transcript",
			"recording-stt"
		].includes(kind ?? "") ? { kind } : {},
		...safe.accountId !== void 0 ? { accountId: safe.accountId } : {},
		...safe.guildId !== void 0 ? { guildId: safe.guildId } : {},
		...safe.channelId !== void 0 ? { channelId: safe.channelId } : {},
		...safe.meetingUrl && /^https?:\/\//u.test(safe.meetingUrl) ? { meetingUrl: safe.meetingUrl } : {},
		...safe.threadTs !== void 0 ? { threadTs: safe.threadTs } : {},
		...safe.fileId !== void 0 ? { fileId: safe.fileId } : {}
	};
}
function projectTranscriptSession(entry, active = isTranscriptSessionActive(entry.session), providerName, captures = readTranscriptCaptureSnapshot()) {
	const { session } = entry;
	const source = projectTranscriptSource(session.source);
	const owner = session.metadata?.agentId;
	return {
		selector: entry.selector,
		sessionId: session.sessionId,
		title: session.title === void 0 ? void 0 : sanitizeTerminalText(session.title),
		providerId: source.providerId,
		providerName,
		source,
		startedAt: session.startedAt,
		stoppedAt: session.stoppedAt,
		active,
		activeSubscription: captures.some((capture) => capture.state === "armed" && capture.session.sessionId === session.sessionId && capture.session.startedAt === session.startedAt),
		agentId: typeof owner === "string" ? owner : null,
		updatedAt: entry.updatedAt,
		lastUtteranceAt: entry.lastUtteranceAt,
		utteranceCount: entry.utteranceCount,
		participants: entry.participants.map(sanitizeTerminalText),
		hasSummary: entry.hasSummary,
		summarySource: entry.summarySource,
		overview: entry.overview === void 0 ? void 0 : truncateUtf16Safe(sanitizeTerminalText(entry.overview), 280)
	};
}
function projectTranscriptMarkdown(markdown) {
	return normalizeExportText(markdown).split("\n").map(sanitizeTerminalText).join("\n");
}
function projectTranscriptNotes(stored) {
	if (stored.markdown === void 0) return;
	const summary = stored.summary;
	return {
		generatedAt: summary?.generatedAt ?? "",
		overview: summary?.overview ?? "",
		decisions: summary?.decisions ?? [],
		actionItems: summary?.actionItems ?? [],
		risks: summary?.risks ?? [],
		participants: (summary?.participants ?? []).map(sanitizeTerminalText),
		source: summary?.source,
		model: summary?.model,
		utteranceCount: summary?.utteranceCount ?? 0,
		markdown: projectTranscriptMarkdown(stored.markdown)
	};
}
/** Downloads and reader pages share an allowlist; raw provider metadata stays local. */
function projectTranscriptUtterance(utterance) {
	return {
		sequence: utterance.sequence,
		id: utterance.id,
		startedAt: utterance.startedAt,
		endedAt: utterance.endedAt,
		speakerId: utterance.speakerId,
		speakerLabel: utterance.speakerLabel === void 0 ? void 0 : sanitizeTerminalText(utterance.speakerLabel),
		text: sanitizeTerminalText(utterance.text),
		final: utterance.final
	};
}
//#endregion
export { projectTranscriptUtterance as a, projectTranscriptSource as i, projectTranscriptNotes as n, projectTranscriptSession as r, projectTranscriptMarkdown as t };
