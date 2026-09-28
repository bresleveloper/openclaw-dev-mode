import { N as resolveActiveReplyRunOwnerForSignal } from "./reply-run-registry.state-C5EjI8Kf.mjs";
import { a as getDiagnosticSessionActivitySnapshot } from "./diagnostic-run-activity-DTzzZJ-S.mjs";
import { T as resolveActiveEmbeddedRunOwnerByRunId, b as queueEmbeddedAgentMessageWithOutcomeAsync, n as abortEmbeddedAgentRun, x as queueGuardedEmbeddedAgentMessageWithOutcomeAsync } from "./runs-ciDkXIOQ.mjs";
import { i as resolveActiveEmbeddedRunSessionId } from "./active-run-projections-ChS97Oy4.mjs";
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
