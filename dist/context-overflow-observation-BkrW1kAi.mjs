import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as isLikelyContextOverflowError } from "./context-overflow-kbcu3uXy.mjs";
//#region src/agents/embedded-agent-helpers/context-overflow-observation.ts
function isCompactionFailureError(errorMessage) {
	if (!errorMessage) return false;
	const lower = normalizeLowercaseStringOrEmpty(errorMessage);
	return (lower.includes("summarization failed") || lower.includes("compaction")) && (isLikelyContextOverflowError(errorMessage) || lower.includes("context overflow"));
}
const OBSERVED_OVERFLOW_TOKEN_PATTERNS = [
	/input length(?:\s+and\s+max_tokens)?\s+exceed\s+context(?:\s+limit|\s+window)?\s*\(i\.e\s*([\d,]+)\s*\+\s*([\d,]+)\s*>\s*[\d,]+\)/i,
	/input length\s+and\s+`max_tokens`\s+exceed\s+context\s+limit:\s*([\d,]+)\s*\+\s*([\d,]+)\s*>\s*[\d,]+/i,
	/prompt is too long:\s*([\d,]+)\s+tokens\s*>\s*[\d,]+\s+maximum/i,
	/prompt is too long:\s*([\d,]+)\s*,\s*model maximum context length\s*:\s*[\d,]+/i,
	/requested\s+([\d,]+)\s+tokens/i,
	/token limit\s*:\s*[\d,]+\s*\(requested\s*:\s*([\d,]+)\)/i,
	/resulted in\s+([\d,]+)\s+tokens/i
];
function extractObservedOverflowTokenCount(errorMessage) {
	if (!errorMessage) return;
	for (const pattern of OBSERVED_OVERFLOW_TOKEN_PATTERNS) {
		const counts = errorMessage.match(pattern)?.slice(1).map((capture) => {
			const raw = capture.replaceAll(",", "");
			return raw ? Number(raw) : NaN;
		});
		if (counts?.every((count, index) => Number.isFinite(count) && (index === 0 ? count > 0 : count >= 0))) return Math.floor(counts.reduce((sum, count) => sum + count, 0));
	}
}
//#endregion
export { isCompactionFailureError as n, extractObservedOverflowTokenCount as t };
