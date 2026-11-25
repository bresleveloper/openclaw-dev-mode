import{a as emitAgentEvent}from"./agent-events-g2L2aZSF.mjs";
//!src/infra/agent-run-status-events.ts
function emitAgentRunStatusEvent(e){emitAgentEvent({runId:e.runId,stream:`run_status`,data:{phase:e.phase},...e.sessionKey?{sessionKey:e.sessionKey}:{},...e.agentId?{agentId:e.agentId}:{}})}export{emitAgentRunStatusEvent as t};