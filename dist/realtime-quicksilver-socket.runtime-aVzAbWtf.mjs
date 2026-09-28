import { t as canonicalizeBase64 } from "./base64-B5EyWEOm.mjs";
import { n as rawDataToString } from "./ws-BdD3UP1C.mjs";
import { t as createRealtimeVoiceAudioPortSender } from "./audio-output-port-B-2tgfdC.mjs";
import "./realtime-voice-provider-C3SkPdAW.mjs";
import { t as parseOpenAIQuicksilverEvent } from "./realtime-quicksilver-events-DmOkRrC8.mjs";
import { t as buildOpenAIQuicksilverAudioAppend } from "./realtime-quicksilver-protocol-nZFviYYI.mjs";
import { a as OpenAIQuicksilverPendingAudio, i as OpenAIQuicksilverAudioClock, r as OpenAIQuicksilverAudioAdapter } from "./realtime-quicksilver-audio-buffer-CpNltm_9.mjs";
import { n as QUICKSILVER_SOCKET_AUDIO_BYTES } from "./realtime-quicksilver-socket.shared-BAkFNqz8.mjs";
//#region extensions/openai/realtime-quicksilver-socket.runtime.ts
/** Worker-only media owner. Admission and agent delegation never enter this module. */
var OpenAIQuicksilverSocketRuntime = class {
	constructor(socket, media, post, dispose, bufferedAmount) {
		this.socket = socket;
		this.media = media;
		this.post = post;
		this.dispose = dispose;
		this.bufferedAmount = bufferedAmount;
		this.pending = new OpenAIQuicksilverPendingAudio();
		this.clock = new OpenAIQuicksilverAudioClock(() => {
			const frame = Buffer.alloc(960);
			this.pending.readInto(frame);
			this.sendPcm(frame);
		});
		this.events = [];
		this.eventInFlight = false;
		this.controlBytes = 0;
		this.controlCount = 0;
		this.audioBytes = 0;
		this.started = false;
		this.mediaStopped = false;
		this.failed = false;
		this.closed = false;
		this.audio = new OpenAIQuicksilverAudioAdapter({
			audioFormat: media.audioFormat,
			onAudio: (audio) => this.enqueue({
				type: "audio",
				audio
			})
		});
		socket.once("open", () => this.enqueue({ type: "open" }));
		socket.on("message", (data, binary) => this.onFrame(data, binary));
		socket.on("error", () => this.fail());
		socket.on("close", (code, reason) => {
			if (this.closed) return;
			this.closed = true;
			this.stopAudio();
			this.enqueue({
				type: "close",
				code: code ?? 1006,
				reason: reason?.toString("utf8") ?? ""
			});
		});
	}
	command(command) {
		if (command.type === "event-ack") {
			this.eventInFlight = false;
			this.flush();
			return;
		}
		if (command.type === "audio-output") {
			const output = createRealtimeVoiceAudioPortSender(command.output);
			if (this.mediaStopped || this.closed || this.failed || this.output) {
				output.close();
				return;
			}
			this.discardQueuedAudio();
			this.output = output;
			return;
		}
		if (command.type === "close") {
			this.stopAudio();
			this.socket.close(command.code, command.reason);
			return;
		}
		if (command.type === "stop-audio") {
			this.stopAudio();
			return;
		}
		if (command.type === "audio") {
			try {
				if (!this.mediaStopped && !this.closed && !this.failed) {
					const pcm = this.audio.decodeInput(Buffer.from(command.audio.buffer, command.audio.byteOffset, command.audio.byteLength));
					if (this.media.paced || !this.started) this.pending.append(pcm);
					else this.sendPcm(pcm);
				}
			} finally {
				this.post({ type: "input-ack" });
			}
			return;
		}
		if (command.type === "send") {
			try {
				this.send(command.payload);
			} finally {
				this.post({ type: "send-ack" });
			}
			return;
		}
		if (this.mediaStopped || this.started || this.closed || this.failed) return;
		this.started = true;
		if (this.media.paced) this.clock.start();
		else if (this.pending.length) {
			const pcm = Buffer.alloc(this.pending.length);
			this.pending.readInto(pcm);
			this.sendPcm(pcm);
		}
	}
	sendPcm(pcm) {
		if (pcm.length) this.send(JSON.stringify(buildOpenAIQuicksilverAudioAppend(this.media.model, pcm.toString("base64"))));
	}
	send(payload) {
		if (this.closed || this.failed || this.socket.readyState !== 1) return;
		if (this.bufferedAmount() + Buffer.byteLength(payload) > 1048576) {
			this.fail();
			return;
		}
		try {
			this.socket.send(payload);
		} catch {
			this.fail();
		}
	}
	onFrame(data, isBinary) {
		if (this.failed || this.closed) return;
		const payload = rawDataToString(data);
		const event = isBinary ? null : parseOpenAIQuicksilverEvent(payload, this.media.model);
		if (event?.kind === "audio") {
			if (this.mediaStopped) return;
			const canonical = canonicalizeBase64(event.data);
			if (!canonical) {
				this.fail();
				return;
			}
			const pcm = Buffer.from(canonical, "base64");
			if (this.output) this.output.sendAudio(pcm);
			else this.audio.sendOutput(pcm);
			return;
		}
		if (event?.kind === "audio-cleared") {
			this.output?.clear();
			this.discardQueuedAudio();
			this.audio.reset();
		}
		if (event?.kind === "transcript-done" && event.role === "assistant" && !this.mediaStopped && !this.output) this.audio.finishOutput();
		if (event?.kind === "session-closed") this.stopAudio();
		const bytes = isBinary ? Array.isArray(data) ? Buffer.concat(data) : Buffer.isBuffer(data) ? data : Buffer.from(data) : Buffer.from(payload);
		this.enqueue({
			type: "frame",
			data: bytes,
			isBinary
		});
	}
	stopAudio() {
		this.mediaStopped = true;
		this.output?.close();
		this.clock.stop();
		this.pending.clear();
		this.discardQueuedAudio();
		this.audio.reset();
	}
	discardQueuedAudio() {
		for (let index = this.events.length - 1; index >= 0; index--) if (this.events[index].type === "audio") this.events.splice(index, 1);
		this.audioBytes = 0;
	}
	enqueue(incoming) {
		let event = incoming;
		if (event.type === "audio") {
			if (this.mediaStopped) return;
			if (event.audio.byteLength > 24e4) event = {
				type: "audio",
				audio: Buffer.from(event.audio.subarray(-QUICKSILVER_SOCKET_AUDIO_BYTES))
			};
			this.audioBytes += event.audio.byteLength;
			while (this.audioBytes > 24e4 || this.events.length >= 256) {
				const index = this.events.findIndex((queued) => queued.type === "audio");
				if (index < 0) break;
				const removed = this.events.splice(index, 1)[0];
				if (removed.type === "audio") this.audioBytes -= removed.audio.byteLength;
			}
		} else {
			const bytes = event.type === "frame" ? event.data.byteLength : 0;
			if (event.type !== "error" && event.type !== "close" && (this.controlCount >= 128 || this.controlBytes + bytes > 1048576)) {
				this.fail();
				return;
			}
			this.controlBytes += bytes;
			this.controlCount++;
		}
		this.events.push(event);
		this.flush();
	}
	flush() {
		if (this.eventInFlight) return;
		const event = this.events.shift();
		if (!event) {
			if (this.closed) this.dispose();
			return;
		}
		if (event.type === "audio") this.audioBytes -= event.audio.byteLength;
		else {
			this.controlCount--;
			if (event.type === "frame") this.controlBytes -= event.data.byteLength;
		}
		this.eventInFlight = true;
		this.post(event);
	}
	fail() {
		if (this.failed || this.closed) return;
		this.failed = true;
		this.stopAudio();
		try {
			this.enqueue({ type: "error" });
		} finally {
			this.socket.close(1011, "media transport failed");
		}
	}
};
//#endregion
export { OpenAIQuicksilverSocketRuntime as t };
