//#region src/agents/internal-event-contract.ts
const AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION = "task_completion";
const GENERATED_MEDIA_COMPLETION_SOURCES = /* @__PURE__ */ new Set([
	"image_generation",
	"video_generation",
	"music_generation"
]);
/** Only the producer that substituted placeholder text records absence. */
function hasVisibleCompletionResult(event) {
	return event.noVisibleResult !== true;
}
/** Identify failed child events without loading the delivery runtime. */
function hasFailedSubagentNoOutputCompletion(events) {
	return events?.some((event) => event.type === "task_completion" && event.source === "subagent" && event.status !== "ok" && !hasVisibleCompletionResult(event)) === true;
}
/** Identifies completion events that can resume an exact cron run. */
function hasGeneratedMediaCompletionEvent(events) {
	return Boolean(events?.some((event) => event.type === "task_completion" && GENERATED_MEDIA_COMPLETION_SOURCES.has(event.source)));
}
//#endregion
export { hasVisibleCompletionResult as i, hasFailedSubagentNoOutputCompletion as n, hasGeneratedMediaCompletionEvent as r, AGENT_INTERNAL_EVENT_TYPE_TASK_COMPLETION as t };
