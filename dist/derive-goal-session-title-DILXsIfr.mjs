import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { i as stripInboundMetadata } from "./strip-inbound-meta-Cqak81y4.mjs";
//#region src/gateway/derive-goal-session-title.ts
/**
* Deterministic session-title fallback when LLM labeling is unavailable.
* Prefers a task-bearing sentence from already-sanitized user text; never
* requires a model or local runtime.
*/
const DERIVED_GOAL_TITLE_MAX_LEN = 60;
/** Leading host wrappers that are not recoverable user intent (Tang-aligned). */
const HOST_ENVELOPE_PREFIXES = [
	"# agents.md instructions for ",
	"<environment_context>",
	"<permissions instructions>",
	"<skills_instructions>",
	"<apps_instructions>",
	"<plugins_instructions>",
	"<recommended_plugins>",
	"<external_openclaw_",
	"openclaw runtime context"
];
const TASK_VERBS = /* @__PURE__ */ new Set([
	"add",
	"analyze",
	"build",
	"check",
	"compare",
	"create",
	"debug",
	"design",
	"draft",
	"explain",
	"find",
	"fix",
	"give",
	"help",
	"implement",
	"investigate",
	"list",
	"make",
	"plan",
	"prepare",
	"recommend",
	"recover",
	"rename",
	"resume",
	"review",
	"summarize",
	"test",
	"update",
	"write"
]);
function truncateTitle(text, maxLen) {
	if (text.length <= maxLen) return text;
	const cut = truncateUtf16Safe(text, maxLen - 1);
	const lastSpace = cut.lastIndexOf(" ");
	if (lastSpace > maxLen * .6) return `${cut.slice(0, lastSpace)}…`;
	return `${cut}…`;
}
function isHostEnvelope(text) {
	const folded = text.trimStart().toLowerCase();
	return HOST_ENVELOPE_PREFIXES.some((prefix) => folded.startsWith(prefix));
}
function toSentenceCase(text) {
	if (!text) return text;
	const first = text[0];
	if (!first || first !== first.toLowerCase()) return text;
	return `${first.toUpperCase()}${text.slice(1)}`;
}
function pickGoalSentence(normalized) {
	const sentences = normalized.split(/(?<=[.!?])\s+/);
	for (const sentence of sentences) {
		const lead = sentence.replace(/^["'`([{]+/, "").split(/\s+/)[0]?.toLowerCase();
		if (lead && TASK_VERBS.has(lead)) return sentence.trim();
	}
	return normalized;
}
/**
* Build a compact topic label from a first user message without calling a model.
* Returns undefined when no usable user task remains after stripping envelopes.
*/
function deriveGoalSessionTitle(firstUserMessage, maxLen = DERIVED_GOAL_TITLE_MAX_LEN) {
	if (!firstUserMessage) return;
	const stripped = stripInboundMetadata(firstUserMessage).replace(/\s+/g, " ").trim();
	if (!stripped || isHostEnvelope(stripped)) return;
	if (stripped.startsWith("/")) return;
	const goal = pickGoalSentence(stripped);
	if (!goal) return;
	return truncateTitle(toSentenceCase(goal), maxLen);
}
//#endregion
export { deriveGoalSessionTitle as t };
