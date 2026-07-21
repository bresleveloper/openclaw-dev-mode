import { R as resolveSessionTranscriptReadTarget } from "./session-accessor-CwhXEUId.js";
import { _ as visitSessionMessagesAsync$1, a as readRecentSessionMessagesWithStatsAsync$1, c as readSessionMessageCountAsync$1, d as readSessionMessagesPageWithStatsAsync$1, f as readSessionMessagesWithSourceAsync$1, h as readSessionTitleFieldsFromTranscriptAsync$1, i as readRecentSessionMessagesAsync$1, m as readSessionTitleFieldsFromTranscript$1, o as readRecentSessionUsageFromTranscript$1, p as readSessionPreviewItemsFromTranscript$1, s as readSessionMessageByIdAsync$1, u as readSessionMessagesAsync$1 } from "./session-utils.fs-CR-Ydxz0.js";
//#region src/gateway/session-transcript-readers.ts
function resolveFileBackedReadScope(scope) {
	const target = resolveSessionTranscriptReadTarget(scope);
	const storePath = resolveConcreteReadStorePath(scope.storePath);
	return {
		agentId: target.agentId,
		sessionFile: target.sessionFile,
		sessionId: target.sessionId,
		...storePath ? { storePath } : {}
	};
}
function resolveConcreteReadStorePath(storePath) {
	const trimmed = storePath?.trim();
	if (!trimmed || trimmed === "(multiple)" || trimmed.includes("{agentId}")) return;
	return trimmed;
}
/** Reads display messages asynchronously through the reader seam. */
async function readSessionMessagesAsync(scope, opts) {
	const target = resolveFileBackedReadScope(scope);
	return await readSessionMessagesAsync$1(target.sessionId, target.storePath, target.sessionFile, opts, target.agentId);
}
/** Reads display messages with source metadata through the reader seam. */
async function readSessionMessagesWithSourceAsync(scope, opts) {
	const target = resolveFileBackedReadScope(scope);
	return await readSessionMessagesWithSourceAsync$1(target.sessionId, target.storePath, target.sessionFile, opts, target.agentId);
}
/** Reads recent display messages asynchronously through the reader seam. */
async function readRecentSessionMessagesAsync(scope, opts) {
	const target = resolveFileBackedReadScope(scope);
	return await readRecentSessionMessagesAsync$1(target.sessionId, target.storePath, target.sessionFile, opts, target.agentId);
}
/** Finds one display message by transcript id through the reader seam. */
async function readSessionMessageByIdAsync(scope, messageId, opts) {
	const target = resolveFileBackedReadScope(scope);
	return await readSessionMessageByIdAsync$1(target.sessionId, target.storePath, target.sessionFile, messageId, {
		...opts,
		agentId: target.agentId
	});
}
/** Visits display messages asynchronously through the reader seam. */
async function visitSessionMessagesAsync(scope, visit, opts) {
	const target = resolveFileBackedReadScope(scope);
	return await visitSessionMessagesAsync$1(target.sessionId, target.storePath, target.sessionFile, visit, opts, target.agentId);
}
/** Counts display messages asynchronously through the reader seam. */
async function readSessionMessageCountAsync(scope) {
	const target = resolveFileBackedReadScope(scope);
	return await readSessionMessageCountAsync$1(target.sessionId, target.storePath, target.sessionFile, target.agentId);
}
/** Reads recent messages with total-count metadata asynchronously through the reader seam. */
async function readRecentSessionMessagesWithStatsAsync(scope, opts) {
	const target = resolveFileBackedReadScope(scope);
	return await readRecentSessionMessagesWithStatsAsync$1(target.sessionId, target.storePath, target.sessionFile, opts, target.agentId);
}
/** Reads one offset page with total-count metadata through the reader seam. */
async function readSessionMessagesPageWithStatsAsync(scope, opts) {
	const target = resolveFileBackedReadScope(scope);
	return await readSessionMessagesPageWithStatsAsync$1(target.sessionId, target.storePath, target.sessionFile, opts, target.agentId);
}
/** Reads title and preview text from a transcript through the reader seam. */
function readSessionTitleFieldsFromTranscript(scope, opts) {
	const target = resolveFileBackedReadScope(scope);
	return readSessionTitleFieldsFromTranscript$1(target.sessionId, target.storePath, target.sessionFile, target.agentId, opts);
}
/** Reads title and preview text asynchronously through the reader seam. */
async function readSessionTitleFieldsFromTranscriptAsync(scope, opts) {
	const target = resolveFileBackedReadScope(scope);
	return await readSessionTitleFieldsFromTranscriptAsync$1(target.sessionId, target.storePath, target.sessionFile, target.agentId, opts);
}
/** Reads aggregate usage from a bounded transcript tail synchronously through the reader seam. */
function readRecentSessionUsageFromTranscript(scope, maxBytes) {
	const target = resolveFileBackedReadScope(scope);
	return readRecentSessionUsageFromTranscript$1(target.sessionId, target.storePath, target.sessionFile, target.agentId, maxBytes);
}
/** Reads compact session preview items through the reader seam. */
function readSessionPreviewItemsFromTranscript(scope, maxItems, maxChars) {
	const target = resolveFileBackedReadScope(scope);
	return readSessionPreviewItemsFromTranscript$1(target.sessionId, target.storePath, target.sessionFile, target.agentId, maxItems, maxChars);
}
//#endregion
export { readSessionMessageCountAsync as a, readSessionMessagesWithSourceAsync as c, readSessionTitleFieldsFromTranscriptAsync as d, visitSessionMessagesAsync as f, readSessionMessageByIdAsync as i, readSessionPreviewItemsFromTranscript as l, readRecentSessionMessagesWithStatsAsync as n, readSessionMessagesAsync as o, readRecentSessionUsageFromTranscript as r, readSessionMessagesPageWithStatsAsync as s, readRecentSessionMessagesAsync as t, readSessionTitleFieldsFromTranscript as u };
