//#region packages/ai/src/utils/deferred-event-buffer.ts
function createDeferredEventBuffer(sink, onBufferedEvent) {
	let events = [];
	return {
		push(event) {
			events.push(event);
			onBufferedEvent?.();
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
//#endregion
export { createDeferredEventBuffer as t };
