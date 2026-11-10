import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as countStreamingFileMutationLines, t as resolveFileMutationToolName } from "./tool-mutation-names-C0vN6seH.mjs";
import { parseStreamingJson } from "@openclaw/ai/internal/runtime";
//#region src/agents/embedded-agent-live-edit-diff.ts
const LIVE_EDIT_DIFF_MIN_INTERVAL_MS = 250;
const LIVE_EDIT_DIFF_MAX_PARTIAL_JSON_CHARS = 1048576;
const LIVE_EDIT_DIFF_MAX_TRACKED_CALLS = 64;
function readToolCallBlock(event) {
	const contentIndex = event.contentIndex;
	const partial = event.partial;
	if (typeof contentIndex !== "number" || !Number.isInteger(contentIndex) || contentIndex < 0 || !partial || typeof partial !== "object") return;
	const content = partial.content;
	const block = Array.isArray(content) ? content[contentIndex] : void 0;
	return block && typeof block === "object" && !Array.isArray(block) ? block : void 0;
}
function readToolCallId(event) {
	const toolCall = event.toolCall;
	if (toolCall && typeof toolCall === "object" && !Array.isArray(toolCall)) {
		const id = toolCall.id;
		if (typeof id === "string" && id) return id;
	}
	const block = readToolCallBlock(event);
	return typeof block?.id === "string" && block.id ? block.id : void 0;
}
/** Update one run's bounded best-effort diff counters from a model stream event. */
function updateLiveEditDiffProgress(stateByToolCallId, event) {
	if (!event) return;
	const eventType = event.type;
	if (eventType === "toolcall_end") {
		const toolCallId = readToolCallId(event);
		if (toolCallId) stateByToolCallId.delete(toolCallId);
		return;
	}
	if (eventType !== "toolcall_delta") return;
	const block = readToolCallBlock(event);
	const toolCallId = typeof block?.id === "string" ? block.id : "";
	const name = typeof block?.name === "string" ? block.name : "";
	const partialJson = typeof block?.partialJson === "string" ? block.partialJson : "";
	return updateLiveEditDiffProgressFromInput(stateByToolCallId, {
		toolCallId,
		name,
		partialJsonLength: partialJson.length,
		readPartialJson: () => partialJson
	});
}
/** Share bounded counting without assembling cumulative CLI arguments before admission. */
function updateLiveEditDiffProgressFromInput(stateByToolCallId, input) {
	const { toolCallId, name, partialJsonLength } = input;
	const kind = resolveFileMutationToolName(name);
	if (!toolCallId || !kind || !partialJsonLength) return;
	if (partialJsonLength > LIVE_EDIT_DIFF_MAX_PARTIAL_JSON_CHARS) {
		stateByToolCallId.delete(toolCallId);
		return;
	}
	let progress = stateByToolCallId.get(toolCallId);
	if (!progress) {
		if (stateByToolCallId.size >= LIVE_EDIT_DIFF_MAX_TRACKED_CALLS) return;
		progress = {
			added: 0,
			removed: 0,
			emittedAdded: 0,
			emittedRemoved: 0,
			lastCheckedAtMs: 0
		};
		stateByToolCallId.set(toolCallId, progress);
	}
	const now = Date.now();
	if (progress.lastCheckedAtMs > 0 && now - progress.lastCheckedAtMs < LIVE_EDIT_DIFF_MIN_INTERVAL_MS) return;
	progress.lastCheckedAtMs = now;
	const counted = countStreamingFileMutationLines(kind, parseStreamingJson(input.readPartialJson()));
	progress.added = Math.max(progress.added, counted.added);
	progress.removed = Math.max(progress.removed, counted.removed);
	if (progress.added === progress.emittedAdded && progress.removed === progress.emittedRemoved) return;
	progress.emittedAdded = progress.added;
	progress.emittedRemoved = progress.removed;
	return {
		toolCallId,
		name: normalizeLowercaseStringOrEmpty(name),
		diff: {
			added: progress.added,
			removed: progress.removed
		}
	};
}
//#endregion
export { updateLiveEditDiffProgressFromInput as n, updateLiveEditDiffProgress as t };
