import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { c as createCompactionSummaryMessage, f as getOpenClawSystemUpdateKind, l as createCustomMessage, s as createBranchSummaryMessage } from "./messages-CeqAykcC.mjs";
import { f as selectResetKeptEntries } from "./tool-result-pairing-DxxMHOQj.mjs";
//#region packages/ai/src/transports/provider-compaction-checkpoint.ts
/** Whether provider replay state is a prefix-bound server compaction checkpoint. */
function isCompactionReplayCheckpoint(replay) {
	const type = replay && typeof replay === "object" ? replay.type : void 0;
	return type === "anthropic-compaction" || type === "openai-responses-compaction" || type === "openai-responses-retained-compaction";
}
/** Strip prefix-bound checkpoints after local history rewrites. */
function stripCompactionReplayCheckpoint(message) {
	if (!isCompactionReplayCheckpoint(message.providerReplay)) return message;
	const replaySafeMessage = { ...message };
	delete replaySafeMessage.providerReplay;
	return replaySafeMessage;
}
//#endregion
//#region packages/agent-core/src/harness/session/session.ts
const SESSION_HISTORY_PRELUDE = Symbol.for("openclaw.sessionHistoryPrelude");
/** The same semantic cut is used before payload acquisition and when building messages. */
function resolveSessionContextWindow(entries) {
	const boundaryIndex = entries.findLastIndex((entry) => entry.type === "reset" || entry.type === "compaction");
	const firstKeptIndex = entries.findIndex((entry) => entry.id === entries[boundaryIndex]?.firstKeptEntryId);
	return {
		boundaryIndex,
		firstKeptIndex: firstKeptIndex >= 0 && firstKeptIndex < boundaryIndex ? firstKeptIndex : boundaryIndex
	};
}
/** Project persisted session entries into the message shared by replay and summarization. */
function projectSessionEntryMessage(entry) {
	switch (entry.type) {
		case "message": return "excludeFromContext" in entry.message && entry.message.excludeFromContext === true ? void 0 : entry.message;
		case "custom_message": return createCustomMessage(entry.customType, entry.content, entry.display, entry.details, entry.timestamp);
		case "branch_summary": return createBranchSummaryMessage(entry.summary, entry.fromId, entry.timestamp);
		case "compaction": return createCompactionSummaryMessage(entry.summary, entry.tokensBefore, entry.timestamp);
		default: return;
	}
}
/** Select the canonical window using only navigation and tool-pairing facts. */
function* iterateSessionContextEntries(pathEntries) {
	const { boundaryIndex, firstKeptIndex } = resolveSessionContextWindow(pathEntries);
	const operatorBoundaryIndex = Math.max(boundaryIndex, pathEntries.findLastIndex((entry) => entry.type === "custom" && entry.customType === "openclaw.system-prompt" && asOptionalRecord(entry.data)?.restart === true));
	const boundary = pathEntries[boundaryIndex];
	const resetKept = boundary?.type === "reset" ? new Set(selectResetKeptEntries(pathEntries.slice(firstKeptIndex, boundaryIndex))) : void 0;
	if (boundary) yield {
		entry: boundary,
		context: "current"
	};
	let index = -1;
	for (const entry of pathEntries) {
		index += 1;
		const retained = index < boundaryIndex;
		if (index === boundaryIndex || retained && (index < firstKeptIndex || resetKept && !resetKept.has(entry))) continue;
		if (index < operatorBoundaryIndex && getOpenClawSystemUpdateKind(entry) === "prompt-update") continue;
		if (!(entry.type === "message" || entry.type === "custom_message" || entry.type === "branch_summary") || !resetKept?.has(entry) && entry.type === "message" && "excludeFromContext" in entry.message && entry.message.excludeFromContext === true) continue;
		yield {
			entry,
			context: retained ? resetKept ? "reset-retained" : "retained" : "current"
		};
	}
}
/** Hydrate selected messages lazily so bounded consumers can stop before later payloads. */
function* iterateSessionContextMessages(pathEntries, readEntry = (entry) => entry) {
	for (const { entry, context } of iterateSessionContextEntries(pathEntries)) {
		if (entry.type === "reset") continue;
		const hydrated = readEntry(entry);
		if (hydrated.type === "branch_summary" && !hydrated.summary) continue;
		let message = context === "reset-retained" && hydrated.type === "message" ? hydrated.message : projectSessionEntryMessage(hydrated);
		if (!message) continue;
		if (context !== "current" && message.role === "assistant") message = stripCompactionReplayCheckpoint(message);
		if (context === "reset-retained" && (message.role === "user" || message.role === "assistant")) {
			message = { ...message };
			Object.defineProperty(message, SESSION_HISTORY_PRELUDE, {
				configurable: true,
				enumerable: false,
				value: true
			});
		}
		yield message;
	}
}
/** Build model context from an ordered session branch and its latest state markers. */
function buildSessionContext(pathEntries) {
	let thinkingLevel = "off";
	let model = null;
	for (const entry of pathEntries) if (entry.type === "thinking_level_change") thinkingLevel = entry.thinkingLevel;
	else if (entry.type === "model_change") model = {
		provider: entry.provider,
		modelId: entry.modelId
	};
	else if (entry.type === "message" && entry.message.role === "assistant") model = {
		provider: entry.message.provider,
		modelId: entry.message.model
	};
	return {
		messages: Array.from(iterateSessionContextMessages(pathEntries)),
		thinkingLevel,
		model
	};
}
//#endregion
export { isCompactionReplayCheckpoint as a, projectSessionEntryMessage as i, iterateSessionContextEntries as n, stripCompactionReplayCheckpoint as o, iterateSessionContextMessages as r, buildSessionContext as t };
