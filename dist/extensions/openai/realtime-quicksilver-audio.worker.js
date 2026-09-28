import { t as createRealtimeVoiceAudioPortSender } from "../../audio-output-port-B-2tgfdC.mjs";
import "../../realtime-voice-provider-C3SkPdAW.mjs";
import { a as OpenAIQuicksilverPendingAudio } from "../../realtime-quicksilver-audio-buffer-CpNltm_9.mjs";
import { t as OpenAIQuicksilverAudioPeer } from "../../realtime-quicksilver-media.runtime-By7W8sBV.mjs";
import { parentPort, workerData } from "node:worker_threads";
//#region extensions/openai/realtime-quicksilver-audio.worker.ts
const port = parentPort;
if (!port) throw new Error("GPT-Live audio runtime requires a worker thread");
const options = workerData;
const directOutput = options.output ? createRealtimeVoiceAudioPortSender(options.output) : void 0;
const controller = new AbortController();
const output = new OpenAIQuicksilverPendingAudio();
let peer;
let stopped = false;
let outputInFlight = false;
let outputGeneration = 0;
let rtpInFlight = false;
let mediaErrorInFlight = false;
function post(message, transfer = []) {
	port.postMessage(message, transfer);
}
function flushOutput() {
	if (stopped || outputInFlight || output.length === 0) return;
	const audio = Buffer.alloc(output.length);
	output.readInto(audio);
	outputInFlight = true;
	post({
		type: "audio",
		audio,
		generation: outputGeneration
	}, [audio.buffer]);
}
function stop() {
	if (stopped) return;
	stopped = true;
	controller.abort();
	peer?.close();
	output.clear();
	directOutput?.close();
	port.close();
}
function fail(error) {
	if (stopped) return;
	post({
		type: "error",
		message: error instanceof Error ? error.message : String(error)
	});
	stop();
}
port.on("message", (message) => {
	if (stopped) return;
	if (message.type === "close") {
		stop();
		return;
	}
	if (!peer) {
		fail(/* @__PURE__ */ new Error("GPT-Live audio worker is not ready"));
		return;
	}
	switch (message.type) {
		case "audio":
			peer.sendAudio(Buffer.from(message.audio.buffer, message.audio.byteOffset, message.audio.byteLength));
			post({ type: "input-ack" });
			return;
		case "clear-output":
			peer.clearOutputAudio();
			outputGeneration = message.generation;
			output.clear();
			directOutput?.clear();
			return;
		case "audio-ack":
			outputInFlight = false;
			flushOutput();
			return;
		case "rtp-ack":
			rtpInFlight = false;
			return;
		case "media-error-ack":
			mediaErrorInFlight = false;
			return;
		case "offer":
		case "answer": (message.type === "offer" ? peer.createOffer() : peer.applyAnswer(message.sdp)).then((value) => {
			if (!stopped) post({
				type: "result",
				id: message.id,
				value: value ?? ""
			});
		}, (error) => {
			if (!stopped) post({
				type: "request-error",
				id: message.id,
				message: error instanceof Error ? error.message : String(error)
			});
		});
	}
});
OpenAIQuicksilverAudioPeer.create({
	iceServers: options.iceServers,
	signal: controller.signal,
	callbacks: {
		onAudio(audio) {
			if (stopped) return;
			if (directOutput) {
				directOutput.sendAudio(audio);
				return;
			}
			output.append(audio);
			flushOutput();
		},
		onRtpPacket() {
			if (stopped || rtpInFlight) return;
			rtpInFlight = true;
			post({ type: "rtp" });
		},
		...options.reportMediaErrors ? { onMediaError(error) {
			if (stopped || mediaErrorInFlight) return;
			mediaErrorInFlight = true;
			post({
				type: "media-error",
				message: error.message
			});
		} } : {},
		onError: fail
	}
}).then((created) => {
	if (stopped) {
		created.close();
		return;
	}
	peer = created;
	post({ type: "ready" });
}, fail);
//#endregion
export {};
