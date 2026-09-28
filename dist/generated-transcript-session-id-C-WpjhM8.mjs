import path from "node:path";
//#region src/config/sessions/generated-transcript-session-id.ts
function extractGeneratedTranscriptSessionId(sessionFile) {
	const trimmed = sessionFile?.trim();
	if (!trimmed) return;
	const base = path.basename(trimmed);
	if (!base.endsWith(".jsonl")) return;
	const withoutExt = base.slice(0, -6);
	const topicIndex = withoutExt.indexOf("-topic-");
	if (topicIndex > 0) {
		const topicSessionId = withoutExt.slice(0, topicIndex);
		return looksLikeGeneratedSessionId(topicSessionId) ? topicSessionId : void 0;
	}
	const forkMatch = withoutExt.match(/^(\d{4}-\d{2}-\d{2}T[\w-]+(?:Z|[+-]\d{2}(?:-\d{2})?)?)_(.+)$/);
	if (forkMatch?.[2]) return looksLikeGeneratedSessionId(forkMatch[2]) ? forkMatch[2] : void 0;
	return looksLikeGeneratedSessionId(withoutExt) ? withoutExt : void 0;
}
function looksLikeGeneratedSessionId(value) {
	return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
//#endregion
export { extractGeneratedTranscriptSessionId as t };
