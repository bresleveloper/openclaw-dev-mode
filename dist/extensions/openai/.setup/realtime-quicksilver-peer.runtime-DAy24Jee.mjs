import { n as OpenAIQuicksilverPendingAudio } from "./realtime-quicksilver-audio-buffer-CgZn7Ci2.mjs";
import { toErrorObject } from "openclaw/plugin-sdk/error-runtime";
import { Worker } from "node:worker_threads";
import { resolveRuntimeWorkerArgv, resolveRuntimeWorkerUrl } from "openclaw/plugin-sdk/process-runtime";
//#region extensions/openai/realtime-quicksilver-peer.runtime.ts
var OpenAIQuicksilverAudioPeer = class OpenAIQuicksilverAudioPeer {
	static async create(params) {
		params.signal?.throwIfAborted();
		const url = resolveRuntimeWorkerUrl({
			currentModuleUrl: import.meta.url,
			sourceWorkerName: "realtime-quicksilver-audio.worker",
			distWorkerPath: "extensions/openai/realtime-quicksilver-audio.worker.js",
			package: {
				name: "@openclaw/openai-provider",
				distWorkerPath: "realtime-quicksilver-audio.worker.js"
			}
		});
		const worker = new Worker(url, {
			workerData: {
				iceServers: params.iceServers,
				reportMediaErrors: Boolean(params.callbacks.onMediaError),
				output: params.output
			},
			execArgv: resolveRuntimeWorkerArgv(url).slice(0, -1),
			transferList: params.output ? [params.output.port] : []
		});
		const peer = new OpenAIQuicksilverAudioPeer(worker, params.callbacks, params.output);
		const abort = () => peer.close();
		params.signal?.addEventListener("abort", abort, { once: true });
		try {
			await peer.ready;
			params.signal?.throwIfAborted();
			return peer;
		} catch (error) {
			peer.close();
			params.signal?.throwIfAborted();
			throw error;
		} finally {
			params.signal?.removeEventListener("abort", abort);
		}
	}
	constructor(worker, callbacks, output) {
		this.worker = worker;
		this.callbacks = callbacks;
		this.output = output;
		this.closed = false;
		this.started = false;
		this.inputInFlight = false;
		this.outputGeneration = 0;
		this.pendingAudio = new OpenAIQuicksilverPendingAudio();
		this.nextRequestId = 0;
		this.requests = /* @__PURE__ */ new Map();
		this.ready = new Promise((resolve, reject) => {
			this.resolveReady = resolve;
			this.rejectReady = reject;
		});
		worker.on("message", (message) => {
			try {
				this.handleMessage(message);
			} catch (error) {
				this.fail(error instanceof Error ? error : new Error(String(error)));
			}
		});
		worker.on("error", (error) => this.fail(toErrorObject(error, "GPT-Live audio worker failed")));
		worker.on("exit", (code) => {
			if (this.closeTimer) {
				clearTimeout(this.closeTimer);
				this.closeTimer = void 0;
			}
			if (!this.closed) this.fail(/* @__PURE__ */ new Error("GPT-Live audio worker exited unexpectedly (code " + code + ")"));
		});
	}
	createOffer() {
		return this.request({
			type: "offer",
			id: ++this.nextRequestId
		});
	}
	async applyAnswer(sdp) {
		await this.request({
			type: "answer",
			id: ++this.nextRequestId,
			sdp
		});
	}
	adoptPendingAudio(pendingAudio) {
		if (this.closed) {
			pendingAudio.clear();
			return;
		}
		if (this.inputInFlight || this.pendingAudio.length > 0) {
			pendingAudio.clear();
			throw new Error("GPT-Live WebRTC peer already owns pending audio");
		}
		this.pendingAudio = pendingAudio;
		this.flushInput();
	}
	sendAudio(audio) {
		if (this.closed) return;
		this.pendingAudio.append(audio);
		this.flushInput();
	}
	clearOutputAudio() {
		if (!this.closed) this.post({
			type: "clear-output",
			generation: ++this.outputGeneration
		});
	}
	close() {
		if (this.closed) return;
		this.closed = true;
		if (this.output) Atomics.store(new Int32Array(this.output.state, 0, 1), 0, 1);
		this.pendingAudio.clear();
		const error = /* @__PURE__ */ new Error("GPT-Live audio worker closed");
		this.rejectReady(error);
		for (const request of this.requests.values()) request.reject(error);
		this.requests.clear();
		this.closeTimer = setTimeout(() => void this.worker.terminate(), 2e3);
		this.closeTimer.unref();
		this.post({ type: "close" });
		this.worker.unref();
	}
	request(command) {
		if (this.closed) return Promise.reject(/* @__PURE__ */ new Error("GPT-Live audio worker closed"));
		return new Promise((resolve, reject) => {
			this.requests.set(command.id, {
				resolve,
				reject
			});
			this.post(command);
		});
	}
	post(command, transfer = []) {
		this.worker.postMessage(command, transfer);
	}
	flushInput() {
		if (this.closed || this.inputInFlight || this.pendingAudio.length === 0) return;
		const audio = Buffer.alloc(this.pendingAudio.length);
		this.pendingAudio.readInto(audio);
		this.inputInFlight = true;
		this.post({
			type: "audio",
			audio
		}, [audio.buffer]);
	}
	handleMessage(message) {
		if (this.closed) return;
		switch (message.type) {
			case "ready":
				this.started = true;
				this.resolveReady();
				return;
			case "result":
			case "request-error": {
				const request = this.requests.get(message.id);
				this.requests.delete(message.id);
				if (message.type === "result") request?.resolve(message.value);
				else request?.reject(new Error(message.message));
				return;
			}
			case "input-ack":
				this.inputInFlight = false;
				this.flushInput();
				return;
			case "audio":
				try {
					if (message.generation !== this.outputGeneration) return;
					this.callbacks.onAudio(Buffer.from(message.audio.buffer, message.audio.byteOffset, message.audio.byteLength));
				} finally {
					if (!this.closed) this.post({ type: "audio-ack" });
				}
				return;
			case "rtp":
				try {
					this.callbacks.onRtpPacket?.();
				} finally {
					if (!this.closed) this.post({ type: "rtp-ack" });
				}
				return;
			case "media-error":
				try {
					this.callbacks.onMediaError?.(new Error(message.message));
				} finally {
					if (!this.closed) this.post({ type: "media-error-ack" });
				}
				return;
			case "error": this.fail(new Error(message.message));
		}
	}
	fail(error) {
		if (this.closed) return;
		const started = this.started;
		this.rejectReady(error);
		this.close();
		if (started) this.callbacks.onError(error);
	}
};
//#endregion
export { OpenAIQuicksilverAudioPeer };
