import { g as REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME } from "./agent-run-control-shared-DXVEJ-0Y.mjs";
import "./realtime-voice-provider-C3SkPdAW.mjs";
import { r as isOpenAIGptLiveApiModel } from "./realtime-quicksilver-0VQEPDSP.mjs";
import { r as buildOpenAIQuicksilverDelegationPrompt } from "./realtime-quicksilver-instructions-CkYwSLJz.mjs";
//#region extensions/openai/realtime-quicksilver-bridge-delegation.ts
/** Admits one direct-bridge delegation before consuming its transcript or invoking host tools. */
function dispatchOpenAIQuicksilverBridgeDelegation(params) {
	const { id, input, callbacks } = params;
	if (!params.isActive()) return;
	if (!input.trim()) {
		params.sendReply("Ask the user to repeat their request; no user transcript was received.");
		return;
	}
	const handleInput = callbacks.handleDelegationInput;
	if (handleInput) {
		let responded = false;
		try {
			if (handleInput(input, (message) => {
				if (!responded && params.isActive()) {
					responded = true;
					params.sendReply(message);
				}
			}) === "control") {
				params.transcript.clearPendingUserInput();
				return;
			}
		} catch {
			params.onError(/* @__PURE__ */ new Error("GPT-Live control admission failed"));
			return;
		}
	}
	if (!params.isActive()) return;
	const snapshot = params.transcript.consume();
	params.transcript.publish(snapshot.publication, {
		onTranscript: callbacks.onTranscript,
		isCurrent: params.isCurrent
	});
	if (!params.isActive()) return;
	params.activeDelegations.add(id);
	callbacks.onEvent?.({
		direction: "server",
		type: isOpenAIGptLiveApiModel(params.model) ? "session.delegation.created" : "delegation.created",
		itemId: id
	});
	if (!params.isActive()) return;
	callbacks.onToolCall?.({
		itemId: id,
		callId: id,
		name: REALTIME_VOICE_AGENT_CONSULT_TOOL_NAME,
		args: { question: params.prompt ?? buildOpenAIQuicksilverDelegationPrompt({
			input,
			transcript: snapshot.context
		}) }
	});
}
//#endregion
export { dispatchOpenAIQuicksilverBridgeDelegation as t };
