import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { i as asOptionalObjectRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as isAgentPlanProgressToolName } from "./progress-card-input-B6Lf4ir_.mjs";
//#region src/chat/tool-call-grouping.ts
/** Preserve recorded nesting without guessing relationships from names or arrival order. */
function groupToolCalls(cards) {
	const groups = cards.map((card) => ({
		card,
		children: []
	}));
	const identities = /* @__PURE__ */ new Map();
	for (const group of groups) {
		const { runId, callId } = group.card;
		if (runId && callId) {
			const key = JSON.stringify([runId, callId]);
			identities.set(key, identities.has(key) ? null : group);
		}
	}
	const parents = /* @__PURE__ */ new Map();
	for (const group of groups) {
		const { runId, callId, parentToolCallId } = group.card;
		if (!runId || !parentToolCallId || parentToolCallId === callId || callId && identities.get(JSON.stringify([runId, callId])) !== group) continue;
		const parent = identities.get(JSON.stringify([runId, parentToolCallId]));
		if (parent) parents.set(group, parent);
	}
	const visited = /* @__PURE__ */ new Set();
	for (const group of groups) {
		const path = [];
		let current = group;
		while (current && !visited.has(current)) {
			visited.add(current);
			path.push(current);
			current = parents.get(current);
		}
		const cycleStart = current ? path.indexOf(current) : -1;
		if (cycleStart >= 0) for (const member of path.slice(cycleStart)) parents.delete(member);
	}
	const roots = [];
	for (const group of groups) {
		const parent = parents.get(group);
		(parent ? parent.children : roots).push(group);
	}
	return roots;
}
//#endregion
//#region src/agents/agent-activity-presentation.ts
/** Only recorded, unambiguous children replace a successfully completed wrapper. */
function resolveCompletedActivityWrappers(calls) {
	const wrappers = /* @__PURE__ */ new Set();
	const pending = groupToolCalls(calls);
	while (pending.length > 0) {
		const group = pending.pop();
		if (group.children.length > 0 && group.card.activity?.status === "completed") wrappers.add(group.card);
		for (const child of group.children) pending.push(child);
	}
	return wrappers;
}
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
export { projectAgentActivityItem as n, resolveCompletedActivityWrappers as r, isCompleteAgentPreamble as t };
