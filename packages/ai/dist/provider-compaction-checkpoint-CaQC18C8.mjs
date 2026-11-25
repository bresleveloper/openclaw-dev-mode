// packages/ai/src/transports/provider-compaction-checkpoint.ts
/** Undefined skips a row; null fences older checkpoints without selecting a source. */
function resolveNewestCompactionReplaySource(messages, read) {
	for (let ownerIndex = messages.length - 1; ownerIndex >= 0; ownerIndex -= 1) {
		const message = messages[ownerIndex];
		if (message === void 0) continue;
		const source = read(message);
		if (source !== void 0) return source === null ? void 0 : {
			ownerIndex,
			source
		};
	}
}
/** Content identities, not payloads, determine whether a covered prefix survives a rewrite. */
function resolveCompactionReplayContentRewrite(source, content, replayIndex, indexIsNumber = true) {
	if (content.length === 0 && source.length > 0 || replayIndex > source.length) return { type: "strip" };
	if (content.length === source.length && content.slice(0, replayIndex).every((block, index) => block === source[index])) return { type: "keep" };
	let sourceIndex = 0;
	let nextReplayIndex = 0;
	return !content.every((block) => {
		const index = source.indexOf(block, sourceIndex);
		sourceIndex = index + 1;
		nextReplayIndex += index >= 0 && index < replayIndex ? 1 : 0;
		return index >= 0;
	}) ? { type: "strip" } : indexIsNumber && nextReplayIndex === replayIndex ? { type: "keep" } : {
		type: "reindex",
		replayIndex: nextReplayIndex
	};
}
/** Whether provider replay state is a prefix-bound server compaction checkpoint. */
function isCompactionReplayCheckpoint(replay) {
	const type = replay && typeof replay === "object" ? replay.type : void 0;
	return type === "anthropic-compaction" || type === "openai-responses-compaction" || type === "openai-responses-retained-compaction";
}
/** Strip prefix-bound checkpoint state from an in-place message rewrite. */
function stripCompactionReplayCheckpointInPlace(message) {
	if (isCompactionReplayCheckpoint(message.providerReplay)) delete message.providerReplay;
}
/** Strip prefix-bound checkpoints after local history rewrites. */
function stripCompactionReplayCheckpoint(message) {
	if (!isCompactionReplayCheckpoint(message.providerReplay)) return message;
	const replaySafeMessage = { ...message };
	delete replaySafeMessage.providerReplay;
	return replaySafeMessage;
}
/** Preserve the covered prefix and reindex checkpoints after known content removals. */
function replaceCompactionReplayOwnerContent(message, content) {
	const next = {
		...message,
		content
	};
	const replay = message.providerReplay;
	if (!isCompactionReplayCheckpoint(replay)) return next;
	if (replay.type === "openai-responses-retained-compaction") return next;
	const replayIndex = replay.replayIndex ?? 0;
	const rewrite = resolveCompactionReplayContentRewrite(message.content, content, replayIndex);
	if (rewrite.type === "strip") return stripCompactionReplayCheckpoint(next);
	return rewrite.type === "keep" ? next : {
		...next,
		providerReplay: {
			...replay,
			replayIndex: rewrite.replayIndex
		}
	};
}
export { stripCompactionReplayCheckpoint as a, resolveNewestCompactionReplaySource as i, replaceCompactionReplayOwnerContent as n, stripCompactionReplayCheckpointInPlace as o, resolveCompactionReplayContentRewrite as r, isCompactionReplayCheckpoint as t };
