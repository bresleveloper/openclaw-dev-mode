import { n as INTERNAL_RUNTIME_CONTEXT_END, r as OPENCLAW_RUNTIME_CONTEXT_CUSTOM_TYPE, t as INTERNAL_RUNTIME_CONTEXT_BEGIN } from "./internal-runtime-context-BH-o1oq1.mjs";
//#region src/agents/embedded-agent-runner/run/runtime-context-prompt.ts
const OPENCLAW_RUNTIME_EVENT_USER_PROMPT = "Continue the OpenClaw runtime event.";
/** Appends turn additions to both full and resumed projections without changing their provenance. */
function appendCurrentInboundContext(context, fragments, legacyText = fragments.map((fragment) => fragment.text).join("\n\n")) {
	const append = (text) => [text, legacyText].filter(Boolean).join("\n\n");
	return {
		...context,
		text: append(context?.text),
		...context?.resumableText !== void 0 ? { resumableText: append(context.resumableText) } : {},
		fragments: [...context?.fragments ?? (context?.text ? [{
			kind: "conversation-data",
			text: context.text
		}] : []), ...fragments]
	};
}
/** Combines inbound context and the current prompt using the channel-provided joiner. */
function buildCurrentInboundPrompt(params) {
	return [(params.preferResumableText === true ? params.context?.resumableText ?? params.context?.text : params.context?.text)?.trim() ?? "", params.prompt].filter(Boolean).join(params.context?.promptJoiner ?? "\n\n");
}
/** Selects explicit producer context without interpreting any prompt text as provenance. */
function resolveRuntimeContextPromptParts(params) {
	const runtimeContext = (params.fragments?.filter((fragment) => fragment.text.trim()))?.map((fragment) => fragment.text).join("\n\n") ?? "";
	const transcriptPrompt = params.transcriptPrompt ?? params.effectivePrompt;
	const runtimeOnly = !transcriptPrompt.trim() && Boolean(runtimeContext) && params.allowRuntimeOnly !== false;
	const prompt = runtimeOnly ? OPENCLAW_RUNTIME_EVENT_USER_PROMPT : transcriptPrompt || params.effectivePrompt;
	return {
		prompt,
		modelPrompt: params.effectivePrompt && params.effectivePrompt !== prompt ? params.effectivePrompt : void 0,
		runtimeContext: runtimeContext || void 0,
		...runtimeOnly ? { runtimeOnly: true } : {}
	};
}
function buildRuntimeContextMessageContent(runtimeContext) {
	return [
		INTERNAL_RUNTIME_CONTEXT_BEGIN,
		runtimeContext,
		INTERNAL_RUNTIME_CONTEXT_END
	].join("\n");
}
/** Creates a non-displayed custom transcript message for runtime context, if any exists. */
function buildRuntimeContextCustomMessage(runtimeContext, fragments) {
	const trimmedRuntimeContext = runtimeContext?.trim();
	if (!trimmedRuntimeContext) return;
	return {
		role: "custom",
		customType: OPENCLAW_RUNTIME_CONTEXT_CUSTOM_TYPE,
		content: buildRuntimeContextMessageContent(trimmedRuntimeContext),
		display: false,
		details: {
			source: "openclaw-runtime-context",
			runtimeContextCarrier: true,
			...fragments?.length ? { fragments } : {}
		},
		timestamp: Date.now()
	};
}
/** Project per-request instructions into the transient carrier without changing history. */
function prependRuntimeContextForModel(messages, runtimeContext) {
	if (!runtimeContext.trim()) return messages;
	const carrierIndex = messages.findIndex((message) => message.role === "user" && message.runtimeContextCarrier === true);
	const carrier = messages[carrierIndex];
	const prepend = (text) => text.startsWith(`<<<BEGIN_OPENCLAW_INTERNAL_CONTEXT>>>\n`) ? `${INTERNAL_RUNTIME_CONTEXT_BEGIN}\n${runtimeContext}\n\n${text.slice(INTERNAL_RUNTIME_CONTEXT_BEGIN.length + 1)}` : buildRuntimeContextMessageContent([runtimeContext, text].filter(Boolean).join("\n\n"));
	if (carrier?.role !== "user") return [...messages, {
		role: "user",
		content: prepend(""),
		runtimeContextCarrier: true,
		timestamp: messages.at(-1)?.timestamp ?? 0
	}];
	const content = carrier.content;
	const firstTextIndex = typeof content === "string" ? -1 : content.findIndex((part) => part.type === "text");
	const updated = {
		...carrier,
		content: typeof content === "string" ? prepend(content) : firstTextIndex < 0 ? [{
			type: "text",
			text: prepend("")
		}, ...content] : content.map((part, index) => index === firstTextIndex && part.type === "text" ? Object.assign({}, part, { text: prepend(part.text) }) : part)
	};
	return messages.map((message, index) => index === carrierIndex ? updated : message);
}
//#endregion
export { prependRuntimeContextForModel as a, buildRuntimeContextMessageContent as i, buildCurrentInboundPrompt as n, resolveRuntimeContextPromptParts as o, buildRuntimeContextCustomMessage as r, appendCurrentInboundContext as t };
