// packages/ai/src/utils/deferred-event-buffer.ts
function createDeferredEventBuffer(sink) {
	let events = [];
	return {
		push(event) {
			events.push(event);
		},
		flush() {
			for (const event of events) sink.push(event);
			events = [];
		},
		discard() {
			events = [];
		}
	};
}
export { createDeferredEventBuffer as t };
