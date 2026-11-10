import { r as resolveGlobalMap } from "./global-singleton-DrXvEBww.mjs";
import { r as runOutsideStoreWriterContext } from "./store-writer-queue-AKR6NnXM.mjs";
import { w as runWithGatewayDetachedWorkContinuation } from "./gateway-work-admission-FWbk4b3p.mjs";
import { X as createSessionResetBoundaryId } from "./session-actor-memory-owner-BSARM2d5.mjs";
import { c as normalizeVisibleMessageLimit, i as MAX_VISIBLE_MESSAGE_MAX_MESSAGES, r as MAX_VISIBLE_MESSAGE_MAX_BYTES } from "./session-accessor.sqlite-visible-cursor-CwElG0zY.mjs";
import { r as attachSessionEndTranscriptSource } from "./hooks-CU2qx9-T.mjs";
import { t as capArrayByJsonBytes } from "./session-utils.fs-BfASFo7x.mjs";
import { c as readSessionMessagesAroundIdWithStatsAsync, n as readRecentSessionMessagesWithStatsAsync } from "./session-transcript-readers-ChK_-oGN.mjs";
//#region src/gateway/session-end-transcript-reader.ts
const ENDED_TRANSCRIPT_MAX_BYTES = Math.min(MAX_VISIBLE_MESSAGE_MAX_BYTES, 8388608);
function normalizeEndedTranscriptOptions(options) {
	return {
		maxMessages: normalizeVisibleMessageLimit(options.maxMessages, 1, MAX_VISIBLE_MESSAGE_MAX_MESSAGES, "maxMessages"),
		maxBytes: normalizeVisibleMessageLimit(options.maxBytes, 1024, ENDED_TRANSCRIPT_MAX_BYTES, "maxBytes")
	};
}
function finalizeEndedTranscriptRead(messages, totalMessages, options) {
	const capped = capArrayByJsonBytes(messages, options.maxBytes);
	const strictMessages = capped.bytes <= options.maxBytes ? capped.items : [];
	return {
		messages: strictMessages,
		totalMessages,
		truncated: strictMessages.length < totalMessages
	};
}
function createClosedSessionTranscriptSource(scope) {
	return {
		available: true,
		async readTail(input) {
			const options = normalizeEndedTranscriptOptions(input);
			const page = await readRecentSessionMessagesWithStatsAsync(scope, {
				maxMessages: options.maxMessages,
				maxLines: options.maxMessages * 20 + 20,
				maxBytes: options.maxBytes
			});
			return finalizeEndedTranscriptRead(page.messages, page.totalMessages, options);
		}
	};
}
function createResetBoundaryTranscriptSource(scope, boundaryId) {
	return {
		available: true,
		async readTail(input) {
			const options = normalizeEndedTranscriptOptions(input);
			const page = await readSessionMessagesAroundIdWithStatsAsync(scope, {
				closedResetInterval: true,
				messageId: boundaryId,
				maxMessages: options.maxMessages,
				maxBytes: options.maxBytes,
				direction: "older"
			});
			if (!page.found) throw new Error("Ended session reset boundary is no longer available");
			return finalizeEndedTranscriptRead(page.messages, page.totalMessages, options);
		}
	};
}
function createArchivedSessionTranscriptSource(params) {
	return {
		available: true,
		async readTail(input) {
			const options = normalizeEndedTranscriptOptions(input);
			const { readSessionHistoryPageInWorker } = await import("./session-history-worker-runtime-DT3UfXfX.mjs");
			const page = await readSessionHistoryPageInWorker({
				kind: "recent-page",
				params: {
					target: {
						sessionId: params.sessionId,
						...params.agentId ? { agentId: params.agentId } : {},
						...params.storePath ? { storePath: params.storePath } : {}
					},
					exactArchivePath: params.archivedPath,
					options: {
						maxMessages: options.maxMessages,
						maxLines: options.maxMessages * 20 + 20,
						maxBytes: options.maxBytes
					}
				}
			});
			if (!page.transcriptPath) throw new Error("Ended session archive is no longer available");
			return finalizeEndedTranscriptRead(page.messages, page.totalMessages, options);
		}
	};
}
//#endregion
//#region src/auto-reply/reply/session-hooks.ts
function resolveExplicitSessionEndReason(matchedResetTriggerLower) {
	return matchedResetTriggerLower === "/reset" ? "reset" : "new";
}
function createReplySessionResetBoundary(params) {
	const continuityReason = params.previousReason === "idle" || params.previousReason === "daily" ? params.previousReason : "reset";
	const request = params.resetTriggered ? {
		context: "clear",
		reason: params.explicitReason
	} : {
		context: "preserve-tail",
		reason: continuityReason
	};
	return {
		boundaryId: createSessionResetBoundaryId(),
		cwd: params.cwd,
		...request
	};
}
function buildSessionHookContext(params) {
	return {
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		agentId: params.agentId
	};
}
function buildSessionStartHookPayload(params) {
	return {
		event: {
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			resumedFrom: params.resumedFrom
		},
		context: buildSessionHookContext(params)
	};
}
function emitReplySessionStartHook(hookRunner, params) {
	const payload = buildSessionStartHookPayload(params);
	runWithGatewayDetachedWorkContinuation(async () => {
		await runOutsideStoreWriterContext(() => hookRunner.runSessionStart(payload.event, payload.context));
	}, "hooks:session-start").catch(() => {});
}
function buildSessionEndHookPayload(params) {
	const context = buildSessionHookContext(params);
	attachSessionEndTranscriptSource(context, params.endedTranscript ?? {
		available: false,
		reason: "unsupported-source"
	});
	return {
		event: {
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			messageCount: params.messageCount ?? 0,
			durationMs: params.durationMs,
			reason: params.reason,
			sessionFile: params.sessionFile,
			transcriptArchived: params.transcriptArchived,
			nextSessionId: params.nextSessionId,
			nextSessionKey: params.nextSessionKey
		},
		context
	};
}
function emitReplySessionEndHook(params) {
	const endedTranscript = params.resetBoundaryId ? createResetBoundaryTranscriptSource({
		agentId: params.agentId,
		sessionId: params.sessionId,
		sessionKey: params.sessionKey,
		storePath: params.storePath
	}, params.resetBoundaryId) : {
		available: false,
		reason: "unsupported-source"
	};
	const payload = buildSessionEndHookPayload({
		...params,
		endedTranscript
	});
	runWithGatewayDetachedWorkContinuation(async () => {
		await runOutsideStoreWriterContext(() => params.hookRunner.runSessionEnd(payload.event, payload.context));
	}, "hooks:session-end").catch(() => {});
}
//#endregion
//#region src/gateway/active-sessions-shutdown-tracker.ts
const trackedSessions = resolveGlobalMap(Symbol.for("openclaw.activeSessionsForShutdown"), "close-and-restart");
function noteActiveSessionForShutdown(entry) {
	if (!entry.sessionId) return;
	trackedSessions.set(entry.sessionId, entry);
}
function forgetActiveSessionForShutdown(sessionId) {
	if (!sessionId) return;
	trackedSessions.delete(sessionId);
}
function listActiveSessionsForShutdown() {
	return Array.from(trackedSessions.values());
}
//#endregion
export { buildSessionStartHookPayload as a, emitReplySessionStartHook as c, createClosedSessionTranscriptSource as d, createResetBoundaryTranscriptSource as f, buildSessionEndHookPayload as i, resolveExplicitSessionEndReason as l, listActiveSessionsForShutdown as n, createReplySessionResetBoundary as o, noteActiveSessionForShutdown as r, emitReplySessionEndHook as s, forgetActiveSessionForShutdown as t, createArchivedSessionTranscriptSource as u };
