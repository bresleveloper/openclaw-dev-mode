import { f as hasRuntimeContextMarker, h as labelRuntimeContextText, l as RUNTIME_CONTEXT_HEADER, p as isRuntimeContextMessage, u as escapeRuntimeContextFooter, v as setRuntimeContextRetention } from "./types-BXd0kI8-.mjs";
import { d as SYSTEM_UPDATE_MESSAGE_CUSTOM_TYPE } from "./messages-Cdi_z_94.mjs";
import { a as RUNTIME_EVENT_USER_PROMPT, o as STEERING_RUNTIME_CONTEXT, r as OPENCLAW_RUNTIME_CONTEXT_CUSTOM_TYPE, u as projectRuntimeContextFragments } from "./internal-runtime-context-DLJtDQoI.mjs";
//#region src/agents/embedded-agent-runner/run/runtime-context-prompt.ts
const RETAIN_STEERING_RUNTIME_CONTEXT = Symbol.for("openclaw.retainSteeringRuntimeContext");
/** Configure transcript retention for steering-owned runtime context. */
function setSteeringRuntimeContextRetention(session, retain) {
	Reflect.set(session, RETAIN_STEERING_RUNTIME_CONTEXT, retain);
}
function shouldRetainSteeringRuntimeContext(session) {
	return Reflect.get(session, RETAIN_STEERING_RUNTIME_CONTEXT) === true;
}
/** Adds turn context without separating an inline prompt header from its user text. */
function appendCurrentInboundContext(context, fragments, legacyText = fragments.map((fragment) => fragment.text).join("\n\n")) {
	const inline = context?.promptJoiner === " ";
	const append = (text) => (inline ? [legacyText, text] : [text, legacyText]).filter(Boolean).join("\n\n");
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
function buildCurrentInboundPrompt(params) {
	return [(params.preferResumableText === true ? params.context?.resumableText ?? params.context?.text : params.context?.text)?.trim() ?? "", params.prompt].filter(Boolean).join(params.context?.promptJoiner ?? "\n\n");
}
/** Bind context to its queued user turn without changing user-authored bytes. */
function attachSteeringRuntimeContext(message, context) {
	if (!context) return;
	const fragments = (context.fragments ?? [{
		kind: "conversation-data",
		text: context.text
	}]).filter((fragment) => fragment.text.trim());
	const runtimeContext = buildRuntimeContextCustomMessage(projectRuntimeContextFragments(fragments), fragments);
	if (!runtimeContext) return;
	for (const target of [runtimeContext, message]) Object.defineProperty(target, STEERING_RUNTIME_CONTEXT, {
		configurable: true,
		enumerable: true,
		value: runtimeContext
	});
}
/** Materialize an attached carrier immediately before its owning user turn. */
function materializeSteeringRuntimeContext(messages) {
	if (!messages.some((message) => Reflect.get(message, STEERING_RUNTIME_CONTEXT))) return messages;
	const projected = [];
	for (const message of messages) {
		const runtimeContext = Reflect.get(message, STEERING_RUNTIME_CONTEXT);
		if (runtimeContext && projected.at(-1) !== runtimeContext) projected.push(runtimeContext);
		projected.push(message);
	}
	return projected;
}
/** Returns the carrier bound to this queued user turn. */
function getSteeringRuntimeContext(message) {
	return Reflect.get(message, STEERING_RUNTIME_CONTEXT);
}
/** Selects explicit producer context without interpreting any prompt text as provenance. */
function resolveRuntimeContextPromptParts(params) {
	const runtimeContext = (params.fragments?.filter((fragment) => fragment.text.trim()))?.map((fragment) => fragment.text).join("\n\n") ?? "";
	const transcriptPrompt = params.transcriptPrompt ?? params.effectivePrompt;
	const runtimeOnly = !transcriptPrompt.trim() && Boolean(runtimeContext) && params.allowRuntimeOnly !== false;
	const prompt = runtimeOnly ? RUNTIME_EVENT_USER_PROMPT : transcriptPrompt || params.effectivePrompt;
	return {
		prompt,
		modelPrompt: params.effectivePrompt && params.effectivePrompt !== prompt ? params.effectivePrompt : void 0,
		runtimeContext: runtimeContext || void 0,
		...runtimeOnly ? { runtimeOnly: true } : {}
	};
}
function applyRuntimeContextCarrierRetention(messages, appendOnlyRuntimeContext) {
	for (const message of messages) if (isRuntimeContextMessage(message)) setRuntimeContextRetention(message, appendOnlyRuntimeContext);
}
function buildRuntimeContextCustomMessage(runtimeContext, fragments, inHistorySystemUpdates = false) {
	const trimmedRuntimeContext = runtimeContext?.trim();
	if (!trimmedRuntimeContext) return;
	if (inHistorySystemUpdates) return buildSystemUpdateMessage(fragments?.length ? projectRuntimeContextFragments(fragments) : trimmedRuntimeContext, "runtime-context", true);
	return buildContextCustomMessage(trimmedRuntimeContext, OPENCLAW_RUNTIME_CONTEXT_CUSTOM_TYPE, {
		source: "openclaw-runtime-context",
		runtimeContextCarrier: true,
		...fragments?.length ? { fragments } : {}
	});
}
function buildSystemUpdateMessage(content, kind, turnScoped) {
	return buildContextCustomMessage(content, SYSTEM_UPDATE_MESSAGE_CUSTOM_TYPE, {
		kind,
		turnScoped
	});
}
function buildContextCustomMessage(content, customType, details) {
	return {
		role: "custom",
		customType,
		content,
		display: false,
		details,
		timestamp: Date.now()
	};
}
/** Project per-request instructions into the transient carrier without changing history. */
function prependRuntimeContextForModel(messages, runtimeContext) {
	if (!runtimeContext.trim()) return messages;
	const carrierIndex = messages.findIndex(hasRuntimeContextMarker);
	const carrier = messages[carrierIndex];
	const prepend = (text) => text.startsWith(`OpenClaw runtime context:\n`) ? `${RUNTIME_CONTEXT_HEADER}\n${escapeRuntimeContextFooter(runtimeContext)}\n\n${text.slice(RUNTIME_CONTEXT_HEADER.length + 1)}` : labelRuntimeContextText([runtimeContext, text].filter(Boolean).join("\n\n"));
	if (!carrier || carrier.role !== "user" || !hasRuntimeContextMarker(carrier)) return [...messages, {
		role: "user",
		content: prepend(""),
		timestamp: messages.at(-1)?.timestamp ?? 0,
		runtimeContext: {}
	}];
	const content = carrier.content;
	const firstTextIndex = typeof content === "string" ? -1 : content.findIndex((part) => part.type === "text");
	const updatedContent = typeof content === "string" ? prepend(content) : firstTextIndex < 0 ? [{
		type: "text",
		text: prepend("")
	}, ...content] : content.map((part, index) => index === firstTextIndex && part.type === "text" ? Object.assign({}, part, { text: prepend(part.text) }) : part);
	return messages.with(carrierIndex, {
		...carrier,
		content: updatedContent
	});
}
//#endregion
export { buildRuntimeContextCustomMessage as a, materializeSteeringRuntimeContext as c, setSteeringRuntimeContextRetention as d, shouldRetainSteeringRuntimeContext as f, buildCurrentInboundPrompt as i, prependRuntimeContextForModel as l, applyRuntimeContextCarrierRetention as n, buildSystemUpdateMessage as o, attachSteeringRuntimeContext as r, getSteeringRuntimeContext as s, appendCurrentInboundContext as t, resolveRuntimeContextPromptParts as u };
