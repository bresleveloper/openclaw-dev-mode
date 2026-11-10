import { L as resolveActiveReplyRunOwnerForSignal } from "./reply-run-registry.state-Hn_UqZjq.mjs";
import { o as getDiagnosticSessionActivitySnapshot } from "./diagnostic-run-activity-CaoGYSHp.mjs";
import { o as resolveActiveEmbeddedRunSessionId } from "./active-run-projections-Crpg2l0z.mjs";
import { T as resolveActiveEmbeddedRunOwnerByRunId, b as queueEmbeddedAgentMessageWithOutcomeAsync, n as abortEmbeddedAgentRun, x as queueGuardedEmbeddedAgentMessageWithOutcomeAsync } from "./runs-Czr-I6_B.mjs";
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
