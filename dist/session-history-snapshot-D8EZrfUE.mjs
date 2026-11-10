import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { i as iterateSessionTranscriptSourcePages } from "./session-transcript-source-pages-DzseyJB5.mjs";
import "./chat-display-projection.helpers-DvBIoDrj.mjs";
import { c as getMaxChatHistoryMessagesBytes } from "./server-constants-B-cmoH_0.mjs";
import { c as projectChatDisplayMessagesWithState } from "./chat-display-projection.core-DdRZ3VIg.mjs";
import { l as readIncrementalChatHistoryTail, o as readChatHistoryMessageSeq, r as paginateSessionMessages, u as resolveCursorSeq } from "./session-history-tail-C5LEM5f_.mjs";
//#region src/gateway/session-history-snapshot.ts
/** Keep raw scan context inside the worker; only the completed page crosses isolates. */
async function readSessionHistorySnapshotKernel(params, options) {
	let rawMessages;
	let windowReset = false;
	let totalRawMessages;
	let transcriptPath;
	let projected;
	if (typeof params.limit !== "number") {
		rawMessages = [];
		for await (const page of iterateSessionTranscriptSourcePages(options.readers.readSessionMessagesWithSourceAsync.bind(options.readers), params.target, {
			allowResetArchiveFallback: true,
			readOnly: options.readOnly
		})) {
			rawMessages.push(...page.messages);
			transcriptPath = page.transcriptPath;
		}
		projected = projectChatDisplayMessagesWithState(rawMessages, {
			subagentCoordination: options.readers.subagentCoordination,
			includeCommentaryFallbacks: true,
			maxChars: params.maxChars ?? 8e3,
			resolveCronJobName: options.resolveCronJobName,
			...options.deferProfileDisplay ? {} : { resolveCurrentUserProfileDisplay: options.resolveCurrentUserProfileDisplay }
		});
	} else {
		const cursorSeq = resolveCursorSeq(params.cursor);
		const tail = await readIncrementalChatHistoryTail({
			entry: params.target.sessionEntry,
			readScope: params.target,
			effectiveMaxChars: params.maxChars ?? 8e3,
			max: params.limit,
			maxBytes: getMaxChatHistoryMessagesBytes(),
			...cursorSeq === void 0 ? {} : { beforeSeq: cursorSeq },
			preserveProjectionContext: true,
			...options
		});
		windowReset = tail.windowReset ?? false;
		projected = tail.projection;
		rawMessages = tail.rawMessages;
		totalRawMessages = tail.readPage.totalMessages;
		transcriptPath = tail.readPage.transcriptPath;
	}
	const rawHistoryMessages = rawMessages.filter(isRecord);
	const history = paginateSessionMessages(projected.messages, params.limit, windowReset ? void 0 : params.cursor);
	if (typeof totalRawMessages === "number" && totalRawMessages > rawMessages.length && (!params.cursor || (readChatHistoryMessageSeq(rawHistoryMessages[0]) ?? 0) > 1)) {
		const firstSeq = readChatHistoryMessageSeq(history.messages[0] ?? rawHistoryMessages[0]);
		history.hasMore = true;
		if (typeof firstSeq === "number") history.nextCursor = String(firstSeq);
	}
	return {
		history: {
			...history,
			...windowReset ? { windowReset: true } : {}
		},
		rawTranscriptSeq: totalRawMessages ?? readChatHistoryMessageSeq(rawHistoryMessages.at(-1)) ?? rawHistoryMessages.length,
		turnBoundaryPending: projected.turnBoundaryPending,
		assistantErrorPending: projected.assistantErrorPending,
		transcriptPath
	};
}
//#endregion
export { readSessionHistorySnapshotKernel as t };
