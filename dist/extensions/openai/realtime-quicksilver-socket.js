import { r as resolveRuntimeWorkerUrl, t as resolveRuntimeWorkerArgv } from "../../runtime-worker-url-B4o9tqvO.mjs";
import "../../process-runtime-BF3dUvYO.mjs";
import { a as QuicksilverSocketAudioQueue, t as QUICKSILVER_SOCKET_AUDIO_BATCH_BYTES } from "../../realtime-quicksilver-socket.shared-BAkFNqz8.mjs";
import { Worker } from "node:worker_threads";
import { EventEmitter } from "node:events";
//#region extensions/openai/realtime-quicksilver-socket.ts
/** A local socket-shaped control adapter, not a second media transport. */
var OpenAIQuicksilverWorkerSocket = class OpenAIQuicksilverWorkerSocket extends EventEmitter {
	static create(url, options, media, callbacks) {
		const workerUrl = resolveRuntimeWorkerUrl({
			currentModuleUrl: import.meta.url,
			sourceWorkerName: "realtime-quicksilver-socket.worker",
			distWorkerPath: "extensions/openai/realtime-quicksilver-socket.worker.js",
			package: {
				name: "@openclaw/openai-provider",
				distWorkerPath: "realtime-quicksilver-socket.worker.js"
			}
		});
		const worker = new Worker(workerUrl, {
			workerData: {
				url,
				options: {
					headers: options.headers,
					maxPayload: options.maxPayload
				},
				...media
			},
			execArgv: resolveRuntimeWorkerArgv(workerUrl).slice(0, -1)
		});
		return new OpenAIQuicksilverWorkerSocket(worker, callbacks, media.audioFormat?.encoding === "g711_ulaw");
	}
	constructor(worker, callbacks, telephony) {
		super();
		this.worker = worker;
		this.callbacks = callbacks;
		this.telephony = telephony;
		this.readyState = 0;
		this.mediaStopped = false;
		this.started = false;
		this.inputInFlight = false;
		this.sendInFlight = false;
		this.failed = false;
		this.exited = false;
		this.sends = [];
		this.sendBytes = 0;
		this.closePosted = false;
		this.pending = new QuicksilverSocketAudioQueue(telephony ? 4e4 : 24e4);
		worker.on("message", (message) => this.receive(message));
		worker.on("error", () => {
			if (!this.closePosted) this.fail();
		});
		worker.on("exit", () => {
			this.exited = true;
			if (this.closeTimer) clearTimeout(this.closeTimer);
			if (this.readyState !== 3) {
				if (this.readyState !== 2 || !this.closePosted) this.fail();
				this.finishClose(1006, "media worker exited");
			}
		});
	}
	send(payload) {
		if (this.readyState !== 1) return;
		const bytes = Buffer.byteLength(payload);
		if (this.sends.length >= 128 || this.sendBytes + bytes > 1048576) {
			this.fail();
			return;
		}
		this.sends.push(payload);
		this.sendBytes += bytes;
		this.flushSends();
	}
	sendAudio(audio) {
		if (this.mediaStopped || this.readyState >= 2) return;
		this.pending.append(audio);
		this.flushInput();
	}
	setAudioOutputPort(output) {
		if (this.audioOutputState) throw new Error("GPT-Live audio output is already bound");
		if (this.mediaStopped || this.readyState !== 1) {
			Atomics.store(new Int32Array(output.state), 0, 1);
			output.port.close();
			return;
		}
		this.audioOutputState = new Int32Array(output.state);
		this.post({
			type: "audio-output",
			output
		}, [output.port]);
	}
	startAudio() {
		if (this.mediaStopped || this.started || this.readyState !== 1) return;
		this.started = true;
		this.post({ type: "start-audio" });
	}
	stopAudio() {
		if (this.mediaStopped) return;
		this.mediaStopped = true;
		if (this.audioOutputState) Atomics.store(this.audioOutputState, 0, 1);
		this.pending.clear();
		this.post({ type: "stop-audio" });
	}
	close(code = 1e3, reason = "session closed") {
		if (this.readyState >= 2) return;
		this.stopAudio();
		this.readyState = 2;
		this.closing = {
			code,
			reason
		};
		this.scheduleCloseDeadline();
		this.flushSends();
	}
	scheduleCloseDeadline() {
		if (this.closeTimer || this.exited) return;
		this.closeTimer = setTimeout(() => {
			this.worker.terminate();
		}, 2e3);
		this.closeTimer.unref();
	}
	closeTransport() {
		if (!this.closing || this.closePosted) return;
		this.closePosted = true;
		this.post({
			type: "close",
			...this.closing
		});
	}
	post(command, transfer = []) {
		if (this.exited) return;
		this.worker.postMessage(command, transfer);
	}
	flushInput() {
		if (this.inputInFlight || this.mediaStopped || !this.pending.length || this.readyState !== 1) return;
		this.inputInFlight = true;
		this.post({
			type: "audio",
			audio: this.pending.take(this.telephony ? 1600 : QUICKSILVER_SOCKET_AUDIO_BATCH_BYTES)
		});
	}
	flushSends() {
		if (this.sendInFlight || this.readyState === 0 || this.readyState === 3 || this.closePosted) return;
		const payload = this.sends.shift();
		if (payload === void 0) {
			this.closeTransport();
			return;
		}
		this.sendBytes -= Buffer.byteLength(payload);
		this.sendInFlight = true;
		this.post({
			type: "send",
			payload
		});
	}
	receive(message) {
		if (message.type === "input-ack") {
			this.inputInFlight = false;
			this.flushInput();
			return;
		}
		if (message.type === "send-ack") {
			this.sendInFlight = false;
			this.flushSends();
			return;
		}
		try {
			if (message.type === "close") {
				this.finishClose(message.code, message.reason);
				return;
			}
			if (message.type === "error") {
				if (!this.closePosted) this.fail();
				return;
			}
			if (this.readyState >= 2) return;
			switch (message.type) {
				case "open":
					this.readyState = 1;
					this.flushInput();
					this.emit("open");
					break;
				case "frame":
					this.emit("message", Buffer.from(message.data.buffer, message.data.byteOffset, message.data.byteLength), message.isBinary);
					break;
				case "audio": if (!this.mediaStopped && !this.audioOutputState) this.callbacks.onAudio(Buffer.from(message.audio.buffer, message.audio.byteOffset, message.audio.byteLength));
			}
		} finally {
			this.post({ type: "event-ack" });
		}
	}
	finishClose(code, reason) {
		if (this.readyState === 3) return;
		this.mediaStopped = true;
		if (this.audioOutputState) Atomics.store(this.audioOutputState, 0, 1);
		this.pending.clear();
		this.sends.length = 0;
		this.sendBytes = 0;
		this.readyState = 3;
		this.closing = void 0;
		this.emit("close", code, Buffer.from(reason));
	}
	fail() {
		if (this.failed || this.readyState === 3) return;
		this.failed = true;
		try {
			this.emit("error", /* @__PURE__ */ new Error("GPT-Live media worker transport failed"));
		} finally {
			this.stopAudio();
			this.readyState = 2;
			this.sends.length = 0;
			this.sendBytes = 0;
			this.closing = {
				code: 1011,
				reason: "media transport failed"
			};
			this.scheduleCloseDeadline();
			this.closeTransport();
		}
	}
};
//#endregion
export { OpenAIQuicksilverWorkerSocket };
