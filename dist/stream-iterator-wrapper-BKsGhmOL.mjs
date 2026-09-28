//#region src/agents/stream-iterator-wrapper.ts
/** Wraps an async iterator with custom next/return/throw behavior. */
function createStreamIteratorWrapper(params) {
	return {
		next() {
			return params.next(params.iterator);
		},
		async return(value) {
			return await params.onReturn?.(params.iterator, value) ?? await params.iterator.return?.(value) ?? {
				done: true,
				value: void 0
			};
		},
		async throw(error) {
			return await params.onThrow?.(params.iterator, error) ?? await params.iterator.throw?.(error) ?? {
				done: true,
				value: void 0
			};
		},
		[Symbol.asyncIterator]() {
			return this;
		}
	};
}
//#endregion
export { createStreamIteratorWrapper as t };
