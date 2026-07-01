import { a as OPENCLAW_RUNTIME_CONTEXT_NOTICE, c as extractInternalRuntimeContext, i as OPENCLAW_RUNTIME_CONTEXT_CUSTOM_TYPE, n as INTERNAL_RUNTIME_CONTEXT_END, o as OPENCLAW_RUNTIME_EVENT_HEADER, r as OPENCLAW_NEXT_TURN_RUNTIME_CONTEXT_HEADER, t as INTERNAL_RUNTIME_CONTEXT_BEGIN } from "./internal-runtime-context-BH_40W4f.js";
//#region src/agents/embedded-agent-runner/run/runtime-context-prompt.ts
/**
* Builds runtime context prompt fragments and custom session messages.
*/
const OPENCLAW_RUNTIME_EVENT_USER_PROMPT = "Continue the OpenClaw runtime event.";
/** Combines inbound context and the current prompt using the channel-provided joiner. */
function buildCurrentInboundPrompt(params) {
	const prefix = (params.preferResumableText === true ? params.context?.resumableText ?? params.context?.text : params.context?.text)?.trim() ?? "";
	if (!prefix) return params.prompt;
	if (!params.prompt) return prefix;
	return [prefix, params.prompt].join(params.context?.promptJoiner ?? "\n\n");
}
function removeLastPromptOccurrence(text, prompt) {
	const index = text.lastIndexOf(prompt);
	if (index === -1) return null;
	return [text.slice(0, index).trimEnd(), text.slice(index + prompt.length).trimStart()].filter((part) => part.length > 0).join("\n\n").trim();
}
/**
* Separates user-authored prompt text from hidden runtime context. Transcript
* prompt stays user-visible; model prompt may carry runtime-only additions that
* should be delivered as hidden context instead of persisted as user text.
*/
function resolveRuntimeContextPromptParts(params) {
	const transcriptPrompt = params.transcriptPrompt;
	const shouldExtractInternalRuntimeContext = transcriptPrompt !== void 0;
	const extracted = shouldExtractInternalRuntimeContext ? extractInternalRuntimeContext(params.effectivePrompt) : { text: params.effectivePrompt };
	const modelPrompt = params.modelPrompt === void 0 ? void 0 : shouldExtractInternalRuntimeContext ? extractInternalRuntimeContext(params.modelPrompt) : { text: params.modelPrompt };
	const modelPromptText = modelPrompt?.text ?? transcriptPrompt ?? extracted.text;
	const prompt = transcriptPrompt ?? extracted.text;
	if (!prompt.trim() && params.emptyTranscriptMode === "model-prompt") return {
		prompt: extracted.text,
		...modelPromptText.trim() && modelPromptText !== extracted.text ? { modelPrompt: modelPromptText } : {},
		...extracted.runtimeContext ? { runtimeContext: extracted.runtimeContext } : {}
	};
	const runtimeContext = [modelPrompt ? removeLastPromptOccurrence(extracted.text, modelPrompt.text)?.trim() ?? (transcriptPrompt ? removeLastPromptOccurrence(extracted.text, transcriptPrompt)?.trim() : void 0) : transcriptPrompt ? removeLastPromptOccurrence(extracted.text, transcriptPrompt)?.trim() : void 0, extracted.runtimeContext].filter((value) => Boolean(value?.trim())).join("\n\n") || (!prompt.trim() ? extracted.text.trim() : void 0);
	if (!prompt.trim()) return runtimeContext ? {
		prompt: OPENCLAW_RUNTIME_EVENT_USER_PROMPT,
		...modelPromptText.trim() && modelPromptText !== OPENCLAW_RUNTIME_EVENT_USER_PROMPT ? { modelPrompt: modelPromptText } : {},
		runtimeContext,
		runtimeOnly: true,
		runtimeSystemContext: buildRuntimeContextMessageContent({
			runtimeContext,
			kind: "runtime-event"
		})
	} : {
		prompt: "",
		...modelPromptText ? { modelPrompt: modelPromptText } : {}
	};
	return {
		prompt,
		...modelPromptText.trim() && modelPromptText !== prompt ? { modelPrompt: modelPromptText } : {},
		...runtimeContext ? { runtimeContext } : {}
	};
}
function buildRuntimeContextMessageContent(params) {
	return [
		params.kind === "runtime-event" ? OPENCLAW_RUNTIME_EVENT_HEADER : OPENCLAW_NEXT_TURN_RUNTIME_CONTEXT_HEADER,
		OPENCLAW_RUNTIME_CONTEXT_NOTICE,
		"",
		INTERNAL_RUNTIME_CONTEXT_BEGIN,
		params.runtimeContext,
		INTERNAL_RUNTIME_CONTEXT_END
	].join("\n");
}
/** Creates a non-displayed custom transcript message for runtime context, if any exists. */
function buildRuntimeContextCustomMessage(runtimeContext) {
	const trimmedRuntimeContext = runtimeContext?.trim();
	if (!trimmedRuntimeContext) return;
	return {
		role: "custom",
		customType: OPENCLAW_RUNTIME_CONTEXT_CUSTOM_TYPE,
		content: buildRuntimeContextMessageContent({
			runtimeContext: trimmedRuntimeContext,
			kind: "next-turn"
		}),
		display: false,
		details: { source: "openclaw-runtime-context" },
		timestamp: Date.now()
	};
}
//#endregion
export { buildRuntimeContextCustomMessage as n, resolveRuntimeContextPromptParts as r, buildCurrentInboundPrompt as t };
