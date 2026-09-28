import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import "./errors-DnjwnOju.mjs";
import { t as createWindowsOutputDecoder } from "./windows-encoding-zGMz1ieM.mjs";
import { Writable } from "node:stream";
import { finished } from "node:stream/promises";
//#region src/process/decoded-output.ts
function onDecodedOutput(stream, listener, onRaw) {
	const decoder = createWindowsOutputDecoder();
	const emit = (text) => {
		if (text) listener(text);
	};
	let flushed = false;
	const flush = () => {
		if (flushed) return;
		flushed = true;
		emit(decoder.flush());
	};
	const onData = (chunk) => {
		onRaw?.(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
		emit(decoder.decode(chunk));
	};
	stream.on("data", onData);
	stream.once("end", flush);
	stream.once("close", flush);
	return () => {
		flushed = true;
		stream.off("data", onData);
		stream.off("end", flush);
		stream.off("close", flush);
	};
}
/** One consumer holds native pipe backpressure until each decoded chunk settles. */
function createAwaitedDecodedOutput(stream, onFailure) {
	const subscription = createDeferredCore();
	let subscribed = false;
	let closed = false;
	let decoder;
	let inFlight = Promise.resolve();
	const deliver = (read, callback) => {
		inFlight = (async () => {
			const listener = await subscription.promise;
			if (closed || !listener) return;
			const text = read();
			if (text) await listener(text);
		})();
		inFlight.then(() => callback(), (error) => callback(toErrorObject(error, "Process stdout consumption failed")));
	};
	const sink = new Writable({
		write(chunk, _encoding, callback) {
			deliver(() => (decoder ??= createWindowsOutputDecoder()).decode(chunk), callback);
		},
		final(callback) {
			deliver(() => decoder?.flush() ?? "", callback);
		}
	});
	const onSourceError = (error) => sink.destroy(error);
	const onSourceClose = () => {
		if (stream.readableEnded) sink.end();
		else sink.destroy(/* @__PURE__ */ new Error("Process stdout closed before EOF"));
	};
	stream.once("error", onSourceError);
	stream.once("close", onSourceClose);
	const done = (async () => {
		try {
			await finished(sink);
			if (sink.errored) throw sink.errored;
		} catch (error) {
			if (!closed) {
				closed = true;
				try {
					onFailure(error);
				} catch (stopError) {
					throw new AggregateError([error, stopError], "Process stdout consumption and stop failed", { cause: stopError });
				} finally {
					stream.unpipe(sink);
					stream.resume();
				}
			}
			throw error;
		} finally {
			stream.unpipe(sink);
			subscription.resolve(void 0);
			await inFlight.catch(() => void 0);
			stream.off("error", onSourceError);
			stream.off("close", onSourceClose);
		}
	})();
	done.catch(() => void 0);
	stream.pipe(sink);
	if (stream.errored) sink.destroy(stream.errored);
	else if (stream.destroyed) onSourceClose();
	const consume = (listener) => {
		if (closed || subscribed) return Promise.reject(/* @__PURE__ */ new Error("Process stdout consumption is already owned or closed"));
		subscribed = true;
		subscription.resolve(listener);
		return done;
	};
	return {
		consume,
		drain: () => subscribed || closed ? done : consume(() => {}),
		close: () => {
			closed = true;
			subscription.resolve(void 0);
			if (!sink.writableFinished) {
				stream.unpipe(sink);
				sink.destroy(/* @__PURE__ */ new Error("Process stdout consumption closed"));
			}
		}
	};
}
/** Output failure requests stop separately; both completion paths settle before returning. */
async function joinProcessCompletionAndOutput(completion, output) {
	const [outcome, consumed] = await Promise.allSettled([completion, output]);
	if (outcome.status === "rejected") {
		if (consumed.status === "rejected") throw new AggregateError([outcome.reason, consumed.reason], "Process and stdout consumption failed");
		throw outcome.reason;
	}
	if (consumed.status === "rejected") throw consumed.reason;
	return outcome.value;
}
//#endregion
export { joinProcessCompletionAndOutput as n, onDecodedOutput as r, createAwaitedDecodedOutput as t };
