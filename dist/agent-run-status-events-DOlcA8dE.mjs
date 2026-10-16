import { i as emitAgentEvent } from "./agent-events-GvNTkbe3.mjs";
//#region src/infra/agent-run-status-events.ts
/** Emits one typed startup status for projection onto an active chat run. */
function emitAgentRunStatusEvent(params) {
	emitAgentEvent({
		runId: params.runId,
		stream: "run_status",
		data: { phase: params.phase },
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		...params.agentId ? { agentId: params.agentId } : {}
	});
}
//#endregion
export { emitAgentRunStatusEvent as t };
