import { h as resolveSessionAgentId } from "./agent-scope-DXrnO3F4.mjs";
import { o as resolveActiveEmbeddedRunSessionId } from "./active-run-projections-Crpg2l0z.mjs";
import { x as queueGuardedEmbeddedAgentMessageWithOutcomeAsync } from "./runs-Czr-I6_B.mjs";
import { t as createUserTurnTranscriptRecorder } from "./user-turn-transcript-CtVHLnLR.mjs";
//#region src/plugins/host-hook-steering.ts
async function steerPluginActiveRun(params) {
	const sessionKey = params.input.sessionKey.trim();
	const sessionId = resolveActiveEmbeddedRunSessionId(sessionKey);
	if (!sessionId) return {
		steered: false,
		reason: "no_active_run"
	};
	const recorder = createUserTurnTranscriptRecorder({
		assertOriginalInputCommit: params.assertCurrent,
		input: {
			text: params.input.text,
			idempotencyKey: params.input.idempotencyKey,
			provenance: {
				kind: "internal_system",
				sourceTool: `plugin:${params.pluginId}`
			},
			display: false,
			senderIsOwner: false
		},
		target: {
			sessionId,
			expectedSessionId: sessionId,
			sessionKey,
			sessionEntry: void 0,
			agentId: resolveSessionAgentId({
				config: params.cfg,
				sessionKey
			}),
			config: params.cfg
		}
	});
	params.assertCurrent();
	const outcome = await queueGuardedEmbeddedAgentMessageWithOutcomeAsync(sessionId, params.input.text, {
		steeringMode: "all",
		debounceMs: 0,
		waitForTranscriptCommit: false,
		isInboundUserMessage: false,
		allowPendingUserInputAnswer: false,
		assertCurrent: params.assertCurrent,
		userTurnTranscriptRecorder: recorder
	}, () => {
		params.assertCurrent();
		return true;
	});
	return outcome.queued ? {
		steered: true,
		...outcome.runId ? { runId: outcome.runId } : {}
	} : {
		steered: false,
		reason: outcome.reason === "guarded_injection_unsupported" ? "active runtime does not support guarded steering" : outcome.reason
	};
}
//#endregion
export { steerPluginActiveRun };
