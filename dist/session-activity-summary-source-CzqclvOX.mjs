import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as sliceUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { b as redactToolPayloadText } from "./redact-DJ8j6ADa.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { a as prepareSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { o as waitForSessionTranscriptProjection, r as startSessionTranscriptIndexReconcile } from "./session-transcript-reconcile-Dv1lK4ND.mjs";
import { t as SessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { r as resolveSessionTranscriptReadFence } from "./session-transcript-read-fence-DfxRHzep.mjs";
import { n as extractAssistantTextForPhase, t as extractAssistantPhaseText } from "./chat-message-content-C-d0FKNG.mjs";
import { H as extractTextFromChatContent } from "./user-facing-text-DC1sCo4O.mjs";
import { o as readSessionTranscriptActivePathEntryRelation, s as readSessionTranscriptBoundedMessageTailPage } from "./session-accessor.sqlite-active-events-BE94zNkI.mjs";
import { t as readSessionTranscriptWatermark } from "./session-accessor.sqlite-transcript-watermark-D3Is2Kik.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import "./activity-summary-CfqWjwl5.mjs";
//#region src/gateway/session-activity-summary-source.ts
/** Runs in the existing transcript worker; only byte-bounded bodies leave it. */
function readActivitySummaryBatch(params) {
	const snapshot = readSessionTranscriptBoundedMessageTailPage(params.scope, {
		maxBytes: 0,
		maxMessages: 0,
		offset: 0,
		readOnly: true
	});
	let previous = params.previous;
	if (previous && (previous.generation !== (snapshot.snapshot.generation ?? null) || previous.coveredMessages > snapshot.totalMessages || previous.leafEntryId && !["exact", "ancestor"].includes(readSessionTranscriptActivePathEntryRelation(params.scope, previous.leafEntryId, { readOnly: true })))) previous = void 0;
	const watermark = readSessionTranscriptWatermark(params.scope);
	const covered = previous?.coveredMessages ?? 0;
	let batchSize = Math.min(64, snapshot.totalMessages - covered);
	const readPage = (maxMessages, includeEarlier = false) => readSessionTranscriptBoundedMessageTailPage(params.scope, {
		maxBytes: 131072,
		maxMessages,
		offset: snapshot.totalMessages - covered - maxMessages,
		readOnly: true,
		oversizedMessageCheck: {
			roles: ["user", "assistant"],
			includeEarlier
		}
	});
	const earlierOmission = previous?.omittedContent && (previous.formatRevision === 3 || readPage(0, true).hasOversizedMessages);
	let page = readPage(batchSize);
	while (batchSize > 1 && page.events.length < page.scannedMessages) {
		batchSize = Math.max(1, Math.floor(batchSize / 2));
		page = readPage(batchSize);
	}
	if (page.totalMessages !== snapshot.totalMessages || page.snapshot.generation !== snapshot.snapshot.generation || page.snapshot.indexedSeq !== snapshot.snapshot.indexedSeq) return;
	return {
		previous,
		snapshot,
		watermark,
		covered,
		page,
		omitted: earlierOmission === true || page.hasOversizedMessages === true
	};
}
async function readActivitySummarySource(params) {
	const { readRestoredSessionTranscript } = await import("./session-cold-storage-read-CPd3lsyF.mjs");
	const { withSessionHistoryWorkerDatabase } = await import("./session-transcript-worker-runtime-CDROZSI7.mjs");
	const resolved = await prepareSqliteTranscriptReadScope(params.scope);
	params.assertCurrent();
	const options = toDatabaseOptions(resolved);
	const scope = {
		...params.scope,
		agentId: resolved.agentId,
		storePath: resolveOpenClawAgentSqlitePath(options)
	};
	const admission = resolveSessionTranscriptReadFence(resolved);
	return withSessionHistoryWorkerDatabase(options, async (owner) => {
		const read = async () => {
			params.assertCurrent();
			const source = await owner.readActivitySummarySource({
				scope,
				previous: params.previous,
				admission
			});
			params.assertCurrent();
			if (!source) return;
			const notes = source.page.events.flatMap(({ event }) => {
				const message = isRecord(event) ? event.message : void 0;
				if (!isRecord(message) || message.role !== "user" && message.role !== "assistant") return [];
				const text = message.role === "assistant" ? extractAssistantPhaseText(message) ?? extractAssistantTextForPhase(message, { phase: "commentary" }) : extractTextFromChatContent(message.content);
				const cleaned = redactToolPayloadText(text ?? "").replace(/\s+/gu, " ").trim();
				if (!cleaned) return [];
				const excerpt = cleaned.length <= 800 ? cleaned : `${sliceUtf16Safe(cleaned, 0, 395)} … ${sliceUtf16Safe(cleaned, -400)}`;
				return [`${message.role}: ${excerpt}`];
			});
			return {
				...source,
				notes
			};
		};
		for (let retry = false;; retry = true) try {
			return await readRestoredSessionTranscript(scope, read, { assertCurrent: params.assertCurrent });
		} catch (error) {
			if (retry || !(error instanceof SessionTranscriptProjectionUnavailableError)) throw error;
			params.assertCurrent();
			startSessionTranscriptIndexReconcile({
				...options,
				preferredSessionId: resolved.sessionId
			});
			await waitForSessionTranscriptProjection(scope);
		}
	});
}
//#endregion
export { readActivitySummarySource as n, readActivitySummaryBatch as t };
