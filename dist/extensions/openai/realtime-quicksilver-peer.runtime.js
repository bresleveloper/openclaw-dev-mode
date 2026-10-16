import { d as toStringifiedError, u as toErrorObject } from "../../error-coercion-CvJK4lmH.mjs";
import { i as resolveRuntimeWorkerUrl, n as resolveRuntimeWorkerArgv } from "../../runtime-worker-url-DoBSDhBS.mjs";
import { n as createCpuTrackedWorker } from "../../worker-cpu-DU6Cf6Aq.mjs";
import "../../error-runtime-BmospGvZ.mjs";
import "../../process-runtime-CYiH_oPH.mjs";
import { a as createDeferred } from "../../extension-shared-GoQu59iC.mjs";
import { a as OpenAIQuicksilverPendingAudio } from "../../realtime-quicksilver-audio-buffer-BQ7ahbkO.mjs";
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
		const worker = createCpuTrackedWorker(url, {
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
			await peer.ready.promise;
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
		this.ready = createDeferred();
		worker.on("message", (message) => {
			try {
				this.handleMessage(message);
			} catch (error) {
				this.fail(toStringifiedError(error));
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
		this.ready.reject(error);
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
		const audio = this.pendingAudio.take();
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
				this.ready.resolve();
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
			case "rtp":
			case "media-error":
				try {
					if (message.type === "audio") {
						if (message.generation !== this.outputGeneration) return;
						this.callbacks.onAudio(Buffer.from(message.audio.buffer, message.audio.byteOffset, message.audio.byteLength));
					} else if (message.type === "rtp") this.callbacks.onRtpPacket?.();
					else this.callbacks.onMediaError?.(new Error(message.message));
				} finally {
					if (!this.closed) this.post({ type: `${message.type}-ack` });
				}
				return;
			case "error": this.fail(new Error(message.message));
		}
	}
	fail(error) {
		if (this.closed) return;
		const started = this.started;
		this.ready.reject(error);
		this.close();
		if (started) this.callbacks.onError(error);
	}
};
//#endregion
export { OpenAIQuicksilverAudioPeer };
