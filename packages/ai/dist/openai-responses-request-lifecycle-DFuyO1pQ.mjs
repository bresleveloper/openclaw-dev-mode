import { o as isRecord } from "./record-coerce-DwRYMj3t.mjs";
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
export { withResponsesRequestAcceptance as n, responsesRequestLifecycle as t };
