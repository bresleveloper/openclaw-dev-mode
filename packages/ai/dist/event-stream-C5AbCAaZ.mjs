//#region packages/llm-core/src/utils/event-stream.ts
const thinkingAppends = /* @__PURE__ */ new WeakMap();
/** Package-internal mutation fact for native reasoning projection. */
function appendAssistantThinking(block, delta) {
	const before = block.thinking;
	block.thinking += delta;
	thinkingAppends.set(block, {
		before,
		after: block.thinking,
		delta
	});
}
/** Returns only an append whose current and previously observed snapshots still match. */
function readAssistantThinkingAppend(block, previous) {
	const append = thinkingAppends.get(block);
	return append?.before === previous && append.after === block.thinking ? append.delta : void 0;
}
const eventStreamCompletions = /* @__PURE__ */ new WeakMap();
/** Observe native producer settlement without invoking consumer result decorators. */
function getEventStreamCompletion(stream) {
	return eventStreamCompletions.get(stream);
}
/** Bind consumer operations without mutating provider streams or losing producer settlement. */
function bindAssistantMessageEventStream(source, run, options) {
	const push = source.push.bind(source);
	const end = source.end.bind(source);
	const result = options?.result ?? source.result.bind(source);
	const iterate = source[Symbol.asyncIterator].bind(source);
	const bound = {
		push: (event) => run(() => push(event)),
		end: (message) => run(() => end(message)),
		result: () => run(result),
		[Symbol.asyncIterator]: () => {
			const iterator = run(iterate);
			const finish = iterator.return?.bind(iterator);
			const fail = iterator.throw?.bind(iterator);
			return {
				[Symbol.asyncIterator]() {
					return this;
				},
				next: (...args) => run(() => iterator.next(...args)),
				...finish ? { return: (value) => run(() => finish(value)) } : {},
				...fail ? { throw: (error) => run(() => fail(error)) } : {}
			};
		}
	};
	const completion = eventStreamCompletions.get(source);
	if (completion) eventStreamCompletions.set(bound, completion);
	return bound;
}
/** Generic async-iterable event stream with a separately awaited final result. */
var EventStream = class {
	constructor(isComplete, extractResult) {
		this.queue = [];
		this.queueHead = 0;
		this.waiting = [];
		this.done = false;
		this.resultSettled = false;
		this.isComplete = isComplete;
		this.extractResult = extractResult;
		this.finalResultPromise = new Promise((resolve, reject) => {
			this.resolveFinalResult = resolve;
			this.rejectFinalResult = reject;
		});
		eventStreamCompletions.set(this, this.finalResultPromise);
	}
	push(event) {
		if (this.done) return;
		if (this.isComplete(event)) {
			this.done = true;
			this.resultSettled = true;
			this.resolveFinalResult(this.extractResult(event));
		}
		const waiter = this.waiting.shift();
		if (waiter) waiter({
			value: event,
			done: false
		});
		else this.queue.push(event);
	}
	end(result) {
		this.done = true;
		if (result !== void 0) {
			this.resultSettled = true;
			this.resolveFinalResult(result);
		} else if (!this.resultSettled) {
			this.resultSettled = true;
			this.finalResultPromise.catch(() => {});
			this.rejectFinalResult(/* @__PURE__ */ new Error("event stream ended without a terminal event or final result"));
		}
		while (this.waiting.length > 0) {
			const waiter = this.waiting.shift();
			if (!waiter) break;
			waiter({
				value: void 0,
				done: true
			});
		}
	}
	async *[Symbol.asyncIterator]() {
		while (true) if (this.queueHead < this.queue.length) {
			const event = this.queue[this.queueHead];
			this.queue[this.queueHead] = void 0;
			this.queueHead += 1;
			if (this.queueHead >= 1024 && this.queueHead * 2 >= this.queue.length) {
				this.queue = this.queue.slice(this.queueHead);
				this.queueHead = 0;
			}
			yield event;
		} else if (this.done) return;
		else {
			const result = await new Promise((resolve) => {
				this.waiting.push(resolve);
			});
			if (result.done) return;
			yield result.value;
		}
	}
	result() {
		return this.finalResultPromise;
	}
};
/** Assistant-message event stream that resolves on done/error terminal events. */
var AssistantMessageEventStream = class extends EventStream {
	push(event) {
		if (!this.done && event.type === "text_delta" && !event.partial) {
			const previous = this.queue[this.queue.length - 1];
			if (previous?.type === "text_delta" && !previous.partial && previous.contentIndex === event.contentIndex) {
				this.queue[this.queue.length - 1] = {
					...event,
					delta: previous.delta + event.delta
				};
				return;
			}
		}
		if (event.type === "thinking_delta" || event.type === "thinking_end") {
			const block = event.partial.content[event.contentIndex];
			if (block?.type === "thinking") {
				if (this.done || event.type === "thinking_end") {
					thinkingAppends.delete(block);
					this.activeThinkingBlocks?.delete(block);
				} else if (thinkingAppends.has(block)) (this.activeThinkingBlocks ??= /* @__PURE__ */ new Set()).add(block);
			}
		}
		if (event.type === "done" || event.type === "error") this.clearThinkingAppends(event.type === "done" ? event.message : event.error);
		super.push(event);
	}
	end(result) {
		this.clearThinkingAppends(result);
		super.end(result);
	}
	clearThinkingAppends(message) {
		for (const block of message?.content ?? []) if (block.type === "thinking") thinkingAppends.delete(block);
		for (const block of this.activeThinkingBlocks ?? []) thinkingAppends.delete(block);
		this.activeThinkingBlocks = void 0;
	}
	constructor() {
		super((event) => event.type === "done" || event.type === "error", (event) => {
			if (event.type === "done") return event.message;
			else if (event.type === "error") return event.error;
			throw new Error("Unexpected event type for final result");
		});
	}
};
/** Creates an assistant-message stream for provider and plugin adapters. */
function createAssistantMessageEventStream() {
	return new AssistantMessageEventStream();
}
//#endregion
export { createAssistantMessageEventStream as a, bindAssistantMessageEventStream as i, EventStream as n, getEventStreamCompletion as o, appendAssistantThinking as r, readAssistantThinkingAppend as s, AssistantMessageEventStream as t };
