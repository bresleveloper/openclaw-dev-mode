import { M as resolveActiveReplyRunOwnerForSignal } from "./reply-run-registry.state-DhKeZ1Xr.mjs";
import { o as getDiagnosticSessionActivitySnapshot } from "./diagnostic-run-activity-BlCpLag4.mjs";
import { E as resolveActiveEmbeddedRunOwnerByRunId, S as queueGuardedEmbeddedAgentMessageWithOutcomeAsync, n as abortEmbeddedAgentRun, x as queueEmbeddedAgentMessageWithOutcomeAsync } from "./runs-CzCPh-gu.mjs";
import { i as resolveActiveEmbeddedRunSessionId } from "./active-run-projections-DHPboQzB.mjs";
//#region src/talk/agent-run-control.runtime.ts
const realtimeVoiceControlRuntime = {
	abortEmbeddedAgentRun,
	queueEmbeddedAgentMessageWithOutcomeAsync,
	queueGuardedEmbeddedAgentMessageWithOutcomeAsync,
	resolveActiveEmbeddedRunOwnerByRunId,
	resolveActiveEmbeddedRunSessionId,
	resolveActiveReplyRunOwnerForSignal,
	getDiagnosticSessionActivitySnapshot
};
//#endregion
export { realtimeVoiceControlRuntime };
