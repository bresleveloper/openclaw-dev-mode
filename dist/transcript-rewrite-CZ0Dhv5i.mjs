import { P as withSessionPendingInputRelocation } from "./session-accessor.sqlite-entry-store-BU493wVJ.mjs";
import "./session-accessor-l-4ZHvKn.mjs";
import "./session-manager-ezhBV3sx.mjs";
import { stripCompactionReplayCheckpoint } from "@openclaw/ai/transports";
//#region src/agents/session-raw-append-message.ts
const RAW_APPEND_MESSAGE = Symbol("openclaw.session.rawAppendMessage");
/** Return the unguarded appendMessage implementation for a session manager. */
function getRawSessionAppendMessage(sessionManager) {
	return sessionManager[RAW_APPEND_MESSAGE] ?? sessionManager.appendMessage.bind(sessionManager);
}
/** Stores the unguarded appendMessage implementation on a session manager. */
function setRawSessionAppendMessage(sessionManager, appendMessage) {
	sessionManager[RAW_APPEND_MESSAGE] = appendMessage;
}
//#endregion
//#region src/agents/embedded-agent-runner/transcript-rewrite.ts
/** Rewrites transcript entries by branching and re-appending the active suffix. */
function stripStalePrefixReplay(message) {
	return message.role === "assistant" ? stripCompactionReplayCheckpoint(message) : message;
}
function findTranscriptRewriteMatches(branch, replacementsById) {
	const matchedIndices = [];
	let bytesFreed = 0;
	for (const [index, entry] of branch.entries()) {
		if (entry.type !== "message") continue;
		const replacement = replacementsById.get(entry.id);
		if (!replacement) continue;
		const originalJson = JSON.stringify(entry.message);
		const replacementJson = JSON.stringify(replacement);
		if (originalJson === replacementJson) continue;
		matchedIndices.push(index);
		bytesFreed += Math.max(0, Buffer.byteLength(originalJson) - Buffer.byteLength(replacementJson));
	}
	return {
		matchedIndices,
		bytesFreed
	};
}
function remapEntryId(entryId, rewrittenEntryIds) {
	if (!entryId) return null;
	return rewrittenEntryIds.get(entryId) ?? entryId;
}
async function appendBranchEntry(params) {
	const { sessionManager, entry, rewrittenEntryIds, appendMessage } = params;
	if (entry.type === "message") {
		const message = stripStalePrefixReplay(entry.message);
		return withSessionPendingInputRelocation(entry.id, message, () => appendMessage(message));
	}
	if (entry.type === "compaction") {
		const { __openclaw: identity } = entry;
		return sessionManager.appendCompaction(entry.summary, remapEntryId(entry.firstKeptEntryId, rewrittenEntryIds) ?? entry.firstKeptEntryId, entry.tokensBefore, entry.details, entry.fromHook, {
			runId: identity?.runId,
			...identity
		}, entry.tokensAfter);
	}
	if (entry.type === "reset") return sessionManager.appendResetBoundary(entry.reason, entry.firstKeptEntryId ? remapEntryId(entry.firstKeptEntryId, rewrittenEntryIds) ?? entry.firstKeptEntryId : void 0);
	if (entry.type === "thinking_level_change") return sessionManager.appendThinkingLevelChange(entry.thinkingLevel);
	if (entry.type === "model_change") return sessionManager.appendModelChange(entry.provider, entry.modelId);
	if (entry.type === "custom") return sessionManager.appendCustomEntry(entry.customType, entry.data);
	if (entry.type === "custom_message") return sessionManager.appendCustomMessageEntry(entry.customType, entry.content, entry.display, entry.details);
	if (entry.type === "session_info") {
		if (entry.name) return sessionManager.appendSessionInfo(entry.name);
		return sessionManager.appendSessionInfo("");
	}
	if (entry.type === "branch_summary") return sessionManager.branchWithSummary(remapEntryId(entry.parentId, rewrittenEntryIds), entry.summary, entry.details, entry.fromHook);
	return sessionManager.appendLabelChange(remapEntryId(entry.targetId, rewrittenEntryIds) ?? entry.targetId, entry.label);
}
/**
* Safely rewrites transcript message entries on the active branch by branching
* from the first rewritten message's parent and re-appending the suffix.
*/
async function rewriteTranscriptEntriesInSessionManager(params) {
	const replacementsById = new Map(params.replacements.filter((replacement) => replacement.entryId.trim().length > 0).map((replacement) => [replacement.entryId, params.preserveReplacementCompactionReplay ? replacement.message : stripStalePrefixReplay(replacement.message)]));
	if (replacementsById.size === 0) return {
		changed: false,
		bytesFreed: 0,
		rewrittenEntries: 0,
		reason: "no replacements requested"
	};
	const activeBranch = params.sessionManager.getBranch();
	if (activeBranch.length === 0) return {
		changed: false,
		bytesFreed: 0,
		rewrittenEntries: 0,
		reason: "empty session"
	};
	const { matchedIndices, bytesFreed } = findTranscriptRewriteMatches(activeBranch, replacementsById);
	if (matchedIndices.length === 0) return {
		changed: false,
		bytesFreed: 0,
		rewrittenEntries: 0,
		reason: "no changed matching message entries"
	};
	const rewrite = params.sessionManager.prepareTranscriptRewrite();
	const rewriteManager = rewrite.sessionManager;
	const branch = rewriteManager.getBranch();
	if (branch.length !== activeBranch.length || branch.some((entry, index) => entry.id !== activeBranch[index]?.id)) throw new Error("Session transcript changed before rewrite preparation");
	const firstMatchedIndex = matchedIndices.at(0);
	const firstMatchedEntry = firstMatchedIndex === void 0 ? void 0 : branch.at(firstMatchedIndex);
	if (!firstMatchedEntry || firstMatchedEntry.type !== "message") return {
		changed: false,
		bytesFreed: 0,
		rewrittenEntries: 0,
		reason: "invalid first rewrite target"
	};
	if (!firstMatchedEntry.parentId) rewriteManager.resetLeaf();
	else rewriteManager.branch(firstMatchedEntry.parentId);
	const rawAppendMessage = getRawSessionAppendMessage(rewriteManager);
	const appendMessage = (message) => rawAppendMessage(message, { idempotencyLookup: "caller-checked" });
	const rewrittenEntryIds = /* @__PURE__ */ new Map();
	for (const entry of branch.slice(firstMatchedIndex)) {
		const replacement = entry.type === "message" ? replacementsById.get(entry.id) : void 0;
		const newEntryId = replacement === void 0 ? await appendBranchEntry({
			sessionManager: rewriteManager,
			entry,
			rewrittenEntryIds,
			appendMessage
		}) : (() => {
			const message = replacement;
			return withSessionPendingInputRelocation(entry.id, message, () => appendMessage(message));
		})();
		rewrittenEntryIds.set(entry.id, newEntryId);
	}
	rewrite.commit(rewrittenEntryIds);
	return {
		changed: true,
		bytesFreed,
		rewrittenEntries: matchedIndices.length
	};
}
//#endregion
export { getRawSessionAppendMessage as n, setRawSessionAppendMessage as r, rewriteTranscriptEntriesInSessionManager as t };
