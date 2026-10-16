import { o as isRecord } from "./record-coerce-CNDovvft.mjs";
import { h as responsesPromptObserver } from "./openai-responses-contracts-BKu8O7l4.mjs";
import { v as sanitizeTransportPayloadText } from "./transport-stream-shared-CCR7hSW0.mjs";
import { C as stripSystemPromptCacheBoundary } from "./simple-options-7QuSKriJ.mjs";
//#region packages/ai/src/transports/openai-responses-prompt-observer-internal.ts
function readFinalResponsesPrompt(request) {
	if (typeof request.instructions === "string") return ["instructions", request.instructions];
	const message = (Array.isArray(request.input) ? request.input : []).find((item) => {
		const role = item.role;
		return role === "developer" || role === "system";
	});
	if (!message) return ["missing", ""];
	const content = message.content;
	const observedPrompt = typeof content === "string" ? content : Array.isArray(content) ? content.flatMap((part) => part.type === "input_text" ? [part.text] : []).join("") : "";
	return [message.role === "developer" ? "input.developer" : "input.system", observedPrompt];
}
function createResponsesPromptEgressObserver(options, assembledPrompt) {
	const observer = options ? responsesPromptObserver.get(options) : void 0;
	if (!observer) return;
	const expectedPrompt = sanitizeTransportPayloadText(stripSystemPromptCacheBoundary(assembledPrompt ?? ""));
	return (request, metadata) => {
		const [promptSource, observedPrompt] = readFinalResponsesPrompt(request);
		observer({
			...metadata,
			promptSource,
			expectedChars: expectedPrompt.length,
			observedChars: observedPrompt.length,
			matchesAssembledPrompt: promptSource !== "missing" && observedPrompt === expectedPrompt
		});
	};
}
//#endregion
//#region packages/ai/src/transports/openai-responses-request-lifecycle.ts
const lifecycleKey = Symbol("openclaw.responsesRequestLifecycle");
/** Private transport carrier: serialized options cannot mint host authority. */
const responsesRequestLifecycle = {
	set(options, lifecycle) {
		Object.defineProperty(options, lifecycleKey, {
			value: lifecycle,
			enumerable: true
		});
	},
	get(options) {
		if (!options) return;
		return Reflect.get(options, lifecycleKey);
	}
};
/** A transport receipt must settle before model output can authorize later work. */
function withResponsesRequestAcceptance(events, lifecycle, signal) {
	if (!lifecycle) return events;
	return { async *[Symbol.asyncIterator]() {
		for await (const event of events) {
			if (isRecord(event) && event.type === "response.created") {
				const response = isRecord(event.response) ? event.response : void 0;
				if (typeof response?.id !== "string" || !response.id.trim()) throw new Error("Provider continuation response has no identity");
				signal?.throwIfAborted();
				lifecycle.assertCurrent();
				await lifecycle.accepted(response.id, signal);
				signal?.throwIfAborted();
				lifecycle.assertCurrent();
			}
			yield event;
		}
	} };
}
//#endregion
export { withResponsesRequestAcceptance as n, createResponsesPromptEgressObserver as r, responsesRequestLifecycle as t };
