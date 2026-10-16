import { c as resolveBlockMessage } from "./hooks-ADSXph0M.mjs";
//#region src/agents/harness/before-agent-run.ts
async function runBeforeAgentRunGate(runner, event, context) {
	if (!runner?.hasHooks("before_agent_run")) return;
	let result;
	try {
		result = await runner.runBeforeAgentRun({
			...event,
			messages: structuredClone(event.messages)
		}, context);
	} catch {
		result = {
			pluginId: "before_agent_run",
			decision: {
				outcome: "block",
				reason: "before_agent_run hook failed"
			}
		};
	}
	if (result?.decision.outcome !== "block") return;
	const blockedBy = result.pluginId ?? "unknown";
	return {
		blockedBy,
		message: resolveBlockMessage(result.decision, { blockedBy })
	};
}
function buildAgentRunBlockedUserMessage(runId, block) {
	const timestamp = Date.now();
	return {
		role: "user",
		content: [{
			type: "text",
			text: block.message
		}],
		timestamp,
		idempotencyKey: `hook-block:before_agent_run:user:${runId}`,
		__openclaw: { beforeAgentRunBlocked: {
			blockedBy: block.blockedBy,
			blockedAt: timestamp
		} }
	};
}
//#endregion
export { runBeforeAgentRunGate as n, buildAgentRunBlockedUserMessage as t };
