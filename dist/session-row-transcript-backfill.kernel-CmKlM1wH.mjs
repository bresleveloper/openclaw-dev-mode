import { t as SessionTranscriptColdError } from "./session-cold-storage-state-CzcE3h3O.mjs";
import { n as SessionTranscriptStorageUnavailableError, r as isSessionTranscriptProjectionUnavailableError } from "./session-transcript-projection-error-B7C6SQei.mjs";
import { s as readSessionTranscriptBoundedMessageTailPage } from "./session-accessor.sqlite-active-events-urwlgpH5.mjs";
import { i as sqliteMessageEventWithSeq } from "./session-transcript-entry-message-DRffdoS3.mjs";
import { n as readSessionTerminalFallbackModel } from "./session-fallback-model-GrIUyRG6.mjs";
import { n as projectSessionDisplayMessage } from "./session-display-projection-Dlr8j1Wl.mjs";
//#region src/gateway/session-row-transcript-backfill.kernel.ts
/** The retained history worker reads bounded preview and terminal fallback facts. */
function readSessionRowTranscriptFields(params) {
	const transcriptScope = {
		...params,
		agentId: params.storeAgentId ?? params.agentId
	};
	try {
		const terminalModel = params.includeTerminalModel ? readSessionTerminalFallbackModel({
			sessionEntry: params.sessionEntry,
			sessionScope: transcriptScope
		}) : void 0;
		const tail = readSessionTranscriptBoundedMessageTailPage(transcriptScope, {
			maxMessages: 20,
			maxBytes: 65536,
			offset: 0,
			readOnly: true
		});
		const events = tail.newestContiguousEventCount ? tail.events.slice(-tail.newestContiguousEventCount) : [];
		for (const event of events.toReversed()) {
			const projected = projectSessionDisplayMessage(sqliteMessageEventWithSeq(event), { flattenMarkdown: true });
			if (projected) return {
				lastMessagePreview: Buffer.from(projected.text, "utf16le").toString("utf16le"),
				...terminalModel ? { terminalModel } : {}
			};
		}
		return terminalModel ? { terminalModel } : {};
	} catch (error) {
		if (isSessionTranscriptProjectionUnavailableError(error) || error instanceof SessionTranscriptStorageUnavailableError || error instanceof SessionTranscriptColdError) return {};
		throw error;
	}
}
//#endregion
export { readSessionRowTranscriptFields };
