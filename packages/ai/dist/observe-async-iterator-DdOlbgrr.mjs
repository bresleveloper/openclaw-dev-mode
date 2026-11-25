// packages/llm-core/src/utils/observe-async-iterator.ts
/**
* Observe without a forwarding generator's per-event promises. Serial reads use
* one stable continuation; overlapping operations retain generator FIFO/context.
* The default close uses AsyncIteratorClose: source errors do not close, while
* consumer/observer throws call return() and take precedence over cleanup errors.
* onClose can retain a caller-owned cleanup policy; onFinally runs once after start.
*/
function observeAsyncIterator(options) {
	let source;
	let nextSource;
	let started = false;
	let closed = false;
	let reading = false;
	let active;
	const queue = [];
	function enqueue(operation) {
		if (!reading) {
			reading = true;
			return active = operation();
		}
		let resolve;
		let reject;
		const promise = new Promise((resolvePending, rejectPending) => {
			resolve = resolvePending;
			reject = rejectPending;
		});
		queue.push({
			operation,
			promise,
			resolve,
			reject
		});
		return promise;
	}
	function settled() {
		const pending = queue.shift();
		if (pending) {
			const advance = () => {
				active = pending.promise;
				pending.operation().then(pending.resolve, pending.reject);
			};
			active.then(advance, advance);
		} else reading = false;
	}
	function finish() {
		try {
			if (started) options.onFinally?.();
		} finally {
			settled();
		}
	}
	function close(reason) {
		return options.onClose ? options.onClose(source, reason) : source?.return?.();
	}
	async function fail(error, reason) {
		closed = true;
		try {
			if (reason) try {
				const closing = close(reason);
				if (closing !== void 0) await closing;
			} catch {}
			options.onError?.(error);
			throw error;
		} finally {
			finish();
		}
	}
	const rejectRead = (error) => fail(error);
	function observeNext(result) {
		let done;
		try {
			done = result.done;
		} catch (error) {
			return rejectRead(error);
		}
		if (done) {
			closed = true;
			try {
				options.onDone?.();
				return {
					done: true,
					value: void 0
				};
			} catch (error) {
				options.onError?.(error);
				throw error;
			} finally {
				finish();
			}
		}
		let value;
		try {
			value = result.value;
		} catch (error) {
			return rejectRead(error);
		}
		try {
			options.onEvent(value);
			settled();
			return {
				done: false,
				value
			};
		} catch (error) {
			return fail(error, "observer");
		}
	}
	function read() {
		if (closed) {
			settled();
			return Promise.resolve({
				done: true,
				value: void 0
			});
		}
		try {
			if (!started) {
				options.onStart?.();
				started = true;
				source = options.iterator();
				nextSource = source.next.bind(source);
			}
			return Promise.resolve(nextSource()).then(observeNext, rejectRead);
		} catch (error) {
			return rejectRead(error);
		}
	}
	async function end(reason, value) {
		if (!started && !closed && reason === "return" && options.onUnopenedReturn) {
			closed = true;
			try {
				return await options.onUnopenedReturn(value);
			} finally {
				settled();
			}
		}
		let resolved = value;
		if (reason === "return") try {
			resolved = await value;
		} catch (error) {
			return end("throw", error);
		}
		if (closed || !started) {
			closed = true;
			settled();
			if (reason === "throw") throw resolved;
			return {
				done: true,
				value: resolved
			};
		}
		if (reason === "throw") return fail(resolved, reason);
		closed = true;
		try {
			await close(reason);
			return {
				done: true,
				value: resolved
			};
		} finally {
			finish();
		}
	}
	return {
		[Symbol.asyncIterator]() {
			return this;
		},
		next() {
			return enqueue(read);
		},
		return(value) {
			return enqueue(() => end("return", value));
		},
		throw(error) {
			return enqueue(() => end("throw", error));
		}
	};
}
export { observeAsyncIterator as t };
