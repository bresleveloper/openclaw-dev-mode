import { i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.mjs";
import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { n as isAgentPlanProgressToolName } from "./progress-card-input-CXyAxVII.mjs";
//#region src/agents/agent-activity-presentation.ts
function projectAgentActivityItem(item, facts = {}) {
	if (item.kind === "analysis") return {
		...item,
		hideFromChannelProgress: true
	};
	const name = normalizeLowercaseStringOrEmpty(item.name);
	const details = asOptionalObjectRecord(asOptionalObjectRecord(facts.result)?.details);
	if (item.phase === "end" && item.status === "completed" && (name === "exec" || name === "bash" || name === "process") && details?.status === "completed" && details.exitReason !== "manual-cancel" && typeof details.exitCode === "number" && Number.isFinite(details.exitCode) && details.exitCode !== 0) return {
		...item,
		status: "failed"
	};
	return (facts.nativeOperation === "wait" || facts.nativeOperation === "process.poll" || isAgentPlanProgressToolName(name) || name === "sessions_yield" || name === "process" && asOptionalObjectRecord(facts.args)?.action === "poll") && (item.status === "running" || item.status === "completed") ? {
		...item,
		hideFromChannelProgress: true
	} : item;
}
function isCompleteAgentPreamble(item) {
	return !item.progressText?.trim() || item.phase !== "start" && item.phase !== "update";
}
//#endregion
export { projectAgentActivityItem as n, isCompleteAgentPreamble as t };
