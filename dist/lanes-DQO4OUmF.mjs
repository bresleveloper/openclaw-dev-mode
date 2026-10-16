import { n as SUBAGENT_LANE_PREFIX } from "./lanes-D7a4ntDu.mjs";
//#region src/agents/embedded-agent-runner/lanes.ts
/**
* Resolves command queue lane names for embedded-agent sessions and global work.
*/
function resolveSessionLane(key) {
	const cleaned = key.trim() || "main";
	return cleaned.startsWith("session:") ? cleaned : `session:${cleaned}`;
}
function resolveGlobalLane(lane, context) {
	const cleaned = lane?.trim();
	if (cleaned === "cron") return "cron-nested";
	if (cleaned === "subagent") {
		if (context?.swarmExecutionLane) return context.swarmExecutionLane.lane;
		const owner = context?.spawnedBy?.trim() || context?.sessionKey?.trim() || context?.sessionId.trim();
		if (!owner) throw new Error("Subagent command lane requires a parent or current session identity.");
		return `${SUBAGENT_LANE_PREFIX}${owner}`;
	}
	return cleaned ? cleaned : "main";
}
//#endregion
export { resolveSessionLane as n, resolveGlobalLane as t };
