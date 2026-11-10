import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { n as sanitizeForLog } from "./ansi-Xy3t0ZdY.mjs";
import { t as parseCompactionDetails } from "./compaction-details-BL6y2Xrl.mjs";
import { t as formatTokenCount } from "./token-format-DW77OPWV.mjs";
//#region src/auto-reply/reply/compaction-notice.ts
const COMPACTION_NOTICE_TEXT = {
	start: "🧹 Compacting context...",
	end: "🧹 Compaction complete",
	degraded: "⚠️ Compaction completed with a degraded summary. Older details, exact identifiers, or pending requests may be missing. Resend important context; /new or a larger model can help.",
	incomplete: "🧹 Compaction incomplete",
	skipped: "🧹 Compaction not needed",
	memory_flush_degraded: "⚠️ Memory maintenance temporarily failed; continuing your reply.",
	context_bounded: "⚠️ Continuing with bounded recent context. Older history outside that window is omitted for this turn; resend any earlier details needed for your request. Full history remains saved."
};
function formatCompactionStatus(entry) {
	const count = entry?.compactionCount ?? 0;
	return entry?.compactionQualityDegraded ? `${count} · degraded history (details may be lost)` : count > 0 ? String(count) : void 0;
}
function resolveCompactionCompletionNotice(result, contextBounded) {
	if (parseCompactionDetails(result.result?.details)?.qualityDegraded) return {
		phase: "degraded",
		text: contextBounded ? `${COMPACTION_NOTICE_TEXT.degraded}\n\n${COMPACTION_NOTICE_TEXT.context_bounded}` : void 0
	};
	if (contextBounded) return { phase: "context_bounded" };
	const before = result.result?.tokensBefore;
	const after = result.result?.tokensAfter;
	return {
		phase: "end",
		text: result.compactionKind === "server-endpoint" && typeof before === "number" && typeof after === "number" ? `🧹 Server-side compaction complete (${formatTokenCount(before)} → ${formatTokenCount(after)})` : void 0
	};
}
function formatCompactionModelRef(provider, model) {
	const parts = [provider, model].map((value) => normalizeOptionalString(value)).filter((value) => value !== void 0);
	return parts.length > 0 ? parts.map((value) => sanitizeForLog(value)).join("/") : "unknown model";
}
function shouldNotifyUserAboutCompaction(cfg) {
	return cfg?.agents?.defaults?.compaction?.notifyUser === true;
}
function createNoticePayload(text, params) {
	const payload = {
		text,
		...params.currentMessageId ? { replyToId: params.currentMessageId } : {},
		replyToCurrent: true,
		isCompactionNotice: true
	};
	return params.applyReplyToMode ? params.applyReplyToMode(payload) : payload;
}
function createCompactionNoticePayload(params) {
	return createNoticePayload(params.text ?? COMPACTION_NOTICE_TEXT[params.phase], params);
}
function createCompactionHookNoticePayload(params) {
	if (params.messages.length === 0) return;
	return createNoticePayload(params.messages.join("\n\n"), params);
}
//#endregion
export { resolveCompactionCompletionNotice as a, formatCompactionStatus as i, createCompactionNoticePayload as n, shouldNotifyUserAboutCompaction as o, formatCompactionModelRef as r, createCompactionHookNoticePayload as t };
