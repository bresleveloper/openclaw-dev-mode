import { n as createRealtimeVoiceAudioQueue } from "./realtime-session-lifecycle-CJCE-3t7.mjs";
//#region src/talk/audio-output-port.ts
/** Keeps continuous media off the control event loop with one outstanding PCM message. */
function createRealtimeVoiceAudioPortSender(output) {
	const fence = new Int32Array(output.state, 0, 1);
	const queue = createRealtimeVoiceAudioQueue("drop-oldest");
	let closed = false;
	let inFlight = false;
	let pendingFlush;
	const live = () => !closed && Atomics.load(fence, 0) === 0;
	const flush = () => {
		if (!live() || inFlight) return;
		const audio = queue.dequeue();
		if (!audio) {
			if (pendingFlush !== void 0) {
				const marker = pendingFlush;
				pendingFlush = void 0;
				output.port.postMessage({
					type: "flushed",
					marker
				}, []);
			}
			return;
		}
		const bytes = new Uint8Array(audio.length);
		bytes.set(audio);
		inFlight = true;
		output.port.postMessage({
			type: "audio",
			audio: bytes
		}, [bytes.buffer]);
	};
	const acknowledge = (message) => {
		if (!live()) return;
		if (message.type === "flush") pendingFlush = message.marker;
		else if (message.type === "ack") inFlight = false;
		else return;
		flush();
	};
	const close = () => {
		if (closed) return;
		closed = true;
		Atomics.store(fence, 0, 1);
		queue.clear();
		pendingFlush = void 0;
		output.port.off("message", acknowledge);
		output.port.off("close", close);
		output.port.close();
	};
	output.port.on("message", acknowledge);
	output.port.on("close", close);
	return {
		sendAudio(audio) {
			if (!live()) return;
			queue.enqueue(audio);
			flush();
		},
		clear() {
			if (!live()) return;
			queue.clear();
			output.port.postMessage({ type: "clear" }, []);
		},
		close
	};
}
//#endregion
export { createRealtimeVoiceAudioPortSender as t };
