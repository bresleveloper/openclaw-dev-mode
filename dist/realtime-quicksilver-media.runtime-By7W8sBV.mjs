import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import "./error-runtime-Bf1fYXFh.mjs";
import { l as resamplePcm, o as createStreamingPcmResampler } from "./audio-energy-CUNIcCl_.mjs";
import "./realtime-voice-provider-C3SkPdAW.mjs";
import { a as OpenAIQuicksilverPendingAudio, i as OpenAIQuicksilverAudioClock } from "./realtime-quicksilver-audio-buffer-CpNltm_9.mjs";
import { randomInt } from "node:crypto";
//#region extensions/openai/realtime-quicksilver-media.runtime.ts
const QUICKSILVER_SAMPLE_RATE = 48e3;
const RELAY_SAMPLE_RATE = 24e3;
const QUICKSILVER_CHANNELS = 2;
const OPUS_FRAME_SAMPLES = 960;
const INBOUND_REORDER_DEPTH = 4;
const INBOUND_MAX_LATE_PACKETS = 100;
const RTP_SEQUENCE_MODULUS = 65536;
const RTP_SEQUENCE_HALF_RANGE = RTP_SEQUENCE_MODULUS / 2;
function pcmBufferToInt16(pcm) {
	const samples = new Int16Array(Math.floor(pcm.length / 2));
	for (let index = 0; index < samples.length; index += 1) samples[index] = pcm.readInt16LE(index * 2);
	return samples;
}
function convertRelayPcmToQuicksilverPcm(pcm24kMono) {
	return duplicateMonoToStereo(resamplePcm(pcm24kMono, RELAY_SAMPLE_RATE, QUICKSILVER_SAMPLE_RATE));
}
function duplicateMonoToStereo(pcm48kMono) {
	const mono48k = pcmBufferToInt16(pcm48kMono);
	const stereo48k = new Int16Array(mono48k.length * QUICKSILVER_CHANNELS);
	for (let index = 0; index < mono48k.length; index += 1) {
		const sample = mono48k[index] ?? 0;
		stereo48k[index * 2] = sample;
		stereo48k[index * 2 + 1] = sample;
	}
	return stereo48k;
}
function convertQuicksilverPcmToRelayPcm(pcm48kStereo) {
	const frameCount = Math.floor(pcm48kStereo.length / QUICKSILVER_CHANNELS);
	const mono48k = Buffer.alloc(frameCount * 2);
	for (let frame = 0; frame < frameCount; frame += 1) {
		const left = pcm48kStereo[frame * 2] ?? 0;
		const right = pcm48kStereo[frame * 2 + 1] ?? 0;
		mono48k.writeInt16LE(Math.round((left + right) / 2), frame * 2);
	}
	return resamplePcm(mono48k, QUICKSILVER_SAMPLE_RATE, RELAY_SAMPLE_RATE);
}
function forwardSequenceDistance(expected, sequenceNumber) {
	return sequenceNumber - expected + RTP_SEQUENCE_MODULUS & 65535;
}
/** Pure-TypeScript WebRTC media peer with a WASM-only Opus codec. */
var OpenAIQuicksilverAudioPeer = class OpenAIQuicksilverAudioPeer {
	static async create(params) {
		const [werift, libopus] = await Promise.all([import("./lib-TP3iUnPm.mjs"), import("./dist-CoyYG0nB.mjs")]);
		params.signal?.throwIfAborted();
		const peer = new werift.RTCPeerConnection({
			codecs: {
				audio: [werift.useOPUS({ payloadType: 111 })],
				video: []
			},
			...params.iceServers ? { iceServers: params.iceServers } : {}
		});
		const transceiver = peer.addTransceiver("audio", { direction: "sendrecv" });
		let encoder;
		let decoder;
		let encoderFreed = false;
		let decoderFreed = false;
		let peerClosed = false;
		const cleanup = async () => {
			if (encoder && !encoderFreed) {
				encoderFreed = true;
				encoder.free();
			}
			if (decoder && !decoderFreed) {
				decoderFreed = true;
				decoder.free();
			}
			if (!peerClosed) {
				peerClosed = true;
				await peer.close().catch(() => void 0);
			}
		};
		const onAbort = () => void cleanup();
		params.signal?.addEventListener("abort", onAbort, { once: true });
		try {
			encoder = await libopus.createEncoder({
				application: libopus.Application.Voip,
				channels: QUICKSILVER_CHANNELS,
				sampleRate: QUICKSILVER_SAMPLE_RATE,
				frameSize: OPUS_FRAME_SAMPLES
			});
			params.signal?.throwIfAborted();
			decoder = await libopus.createDecoder({
				channels: QUICKSILVER_CHANNELS,
				sampleRate: QUICKSILVER_SAMPLE_RATE
			});
			params.signal?.throwIfAborted();
			params.signal?.removeEventListener("abort", onAbort);
			return new OpenAIQuicksilverAudioPeer({
				callbacks: params.callbacks,
				decoder,
				encoder,
				libopus,
				peer,
				transceiver,
				werift
			});
		} catch (error) {
			params.signal?.removeEventListener("abort", onAbort);
			await cleanup();
			throw error;
		}
	}
	static convertRelayPcm(pcm24kMono) {
		return convertRelayPcmToQuicksilverPcm(pcm24kMono);
	}
	static convertQuicksilverPcm(pcm48kStereo) {
		return convertQuicksilverPcmToRelayPcm(pcm48kStereo);
	}
	constructor(state) {
		this.state = state;
		this.connected = false;
		this.closed = false;
		this.outboundPacketFailed = false;
		this.discardingInboundAudio = false;
		this.inboundRtpState = { pendingPackets: /* @__PURE__ */ new Map() };
		this.audioClock = new OpenAIQuicksilverAudioClock((skippedFrames) => {
			this.timestamp = this.timestamp + skippedFrames * OPUS_FRAME_SAMPLES >>> 0;
			this.sendNextAudioFrame();
		});
		this.pendingAudio = new OpenAIQuicksilverPendingAudio();
		this.pendingResampledAudio = Buffer.alloc(60);
		this.inboundResampler = createStreamingPcmResampler(QUICKSILVER_SAMPLE_RATE, RELAY_SAMPLE_RATE);
		this.outboundResampler = createStreamingPcmResampler(RELAY_SAMPLE_RATE, QUICKSILVER_SAMPLE_RATE);
		this.sequenceNumber = randomInt(65536);
		this.subscribedTracks = /* @__PURE__ */ new Set();
		this.timestamp = randomInt(4294967296);
		state.peer.onTrack.subscribe((track) => this.attachInboundTrack(track));
		state.peer.connectionStateChange.subscribe((connectionState) => {
			if (this.closed) return;
			if (connectionState === "connected") {
				this.connected = true;
				this.audioClock.start();
			} else if ([
				"failed",
				"disconnected",
				"closed"
			].includes(connectionState)) {
				this.connected = false;
				this.audioClock.stop();
				this.state.callbacks.onError(/* @__PURE__ */ new Error(`GPT-Live WebRTC media connection ${connectionState}`));
			}
		});
	}
	async createOffer() {
		const offer = await this.state.peer.createOffer();
		await this.state.peer.setLocalDescription(offer);
		const sdp = this.state.peer.localDescription?.sdp;
		if (!sdp?.trim()) throw new Error("werift did not produce a GPT-Live SDP offer");
		return sdp;
	}
	async applyAnswer(answerSdp) {
		await this.state.peer.setRemoteDescription({
			type: "answer",
			sdp: answerSdp
		});
		this.attachInboundTrack(this.state.transceiver.receiver.track);
	}
	adoptPendingAudio(pendingAudio) {
		if (this.closed) {
			pendingAudio.clear();
			return;
		}
		if (this.pendingAudio.length > 0) {
			pendingAudio.clear();
			throw new Error("GPT-Live WebRTC peer already owns pending audio");
		}
		this.pendingAudio = pendingAudio;
	}
	sendAudio(audio) {
		if (this.closed || audio.length < 2) return;
		this.pendingAudio.append(audio);
	}
	clearOutputAudio() {
		if (this.closed) return;
		const state = this.inboundRtpState;
		this.clearInboundFlushTimer(state);
		this.discardingInboundAudio = true;
		try {
			while (!this.closed && state.pendingPackets.size > 0) this.flushInboundReorderWindow(state, true);
		} catch (error) {
			this.audioClock.stop();
			this.state.callbacks.onError(toErrorObject(error, "OpenAI GPT-Live WebRTC media failed"));
		} finally {
			this.discardingInboundAudio = false;
			this.inboundResampler = createStreamingPcmResampler(QUICKSILVER_SAMPLE_RATE, RELAY_SAMPLE_RATE);
		}
	}
	close() {
		if (this.closed) return;
		this.closed = true;
		this.audioClock.stop();
		this.pendingAudio.clear();
		this.pendingResampledAudio = Buffer.alloc(0);
		this.inboundResampler.flush();
		this.outboundResampler.flush();
		this.resetInboundRtpState();
		this.state.encoder.free();
		this.state.decoder.free();
		this.state.peer.close().catch(() => void 0);
	}
	attachInboundTrack(track) {
		if (track.kind !== "audio" || this.subscribedTracks.has(track.uuid)) return;
		this.subscribedTracks.add(track.uuid);
		track.onReceiveRtp.subscribe((packet) => this.handleInboundRtp(packet));
	}
	reportMediaError(error) {
		(this.state.callbacks.onMediaError ?? this.state.callbacks.onError)(toErrorObject(error, "OpenAI GPT-Live WebRTC media failed"));
	}
	handleInboundRtp(packet) {
		if (this.closed) return;
		try {
			this.state.callbacks.onRtpPacket?.();
			const sequenceNumber = packet.header.sequenceNumber;
			if (this.activeInboundSsrc === void 0) this.activeInboundSsrc = packet.header.ssrc;
			else if (packet.header.ssrc !== this.activeInboundSsrc) throw new Error("GPT-Live WebRTC audio source changed unexpectedly");
			const state = this.inboundRtpState;
			if (state.nextSequence === void 0) {
				state.nextSequence = sequenceNumber + 1 & 65535;
				this.decodeInboundPacket(packet);
				return;
			}
			const distance = forwardSequenceDistance(state.nextSequence, sequenceNumber);
			if (distance >= RTP_SEQUENCE_HALF_RANGE) {
				if (forwardSequenceDistance(sequenceNumber, state.nextSequence) <= INBOUND_MAX_LATE_PACKETS) return;
				throw new Error("GPT-Live WebRTC RTP sequence changed unexpectedly");
			}
			if (state.pendingPackets.has(sequenceNumber)) return;
			if (distance === 0) {
				state.nextSequence = state.nextSequence + 1 & 65535;
				this.decodeInboundPacket(packet);
				this.clearInboundFlushTimer(state);
				this.drainInboundPackets(state);
				return;
			}
			state.pendingPackets.set(sequenceNumber, packet);
			this.flushInboundReorderWindow(state);
			this.scheduleInboundFlush(state);
		} catch (error) {
			this.audioClock.stop();
			this.state.callbacks.onError(toErrorObject(error, "OpenAI GPT-Live WebRTC media failed"));
		}
	}
	resetInboundRtpState() {
		this.clearInboundFlushTimer(this.inboundRtpState);
		this.inboundRtpState.nextSequence = void 0;
		this.inboundRtpState.pendingPackets.clear();
	}
	flushInboundReorderWindow(state, force = false) {
		const expected = state.nextSequence;
		if (expected === void 0 || state.pendingPackets.size === 0) return;
		const pending = [...state.pendingPackets.keys()].map((sequenceNumber) => ({
			sequenceNumber,
			distance: forwardSequenceDistance(expected, sequenceNumber)
		})).filter(({ distance }) => distance < RTP_SEQUENCE_HALF_RANGE).toSorted((left, right) => left.distance - right.distance);
		const nearest = pending[0];
		const farthest = pending.at(-1);
		if (!nearest || !farthest || !force && farthest.distance < INBOUND_REORDER_DEPTH) return;
		this.clearInboundFlushTimer(state);
		const concealCount = Math.min(nearest.distance, INBOUND_REORDER_DEPTH);
		for (let index = 0; index < concealCount; index += 1) {
			state.nextSequence = (state.nextSequence ?? 0) + 1 & 65535;
			this.decodeInboundPacketLoss();
		}
		if (nearest.distance > INBOUND_REORDER_DEPTH) state.nextSequence = nearest.sequenceNumber;
		this.drainInboundPackets(state);
	}
	drainInboundPackets(state) {
		while (state.nextSequence !== void 0) {
			const packet = state.pendingPackets.get(state.nextSequence);
			if (!packet) break;
			state.pendingPackets.delete(state.nextSequence);
			state.nextSequence = state.nextSequence + 1 & 65535;
			this.decodeInboundPacket(packet);
		}
		if (state.pendingPackets.size === 0) this.clearInboundFlushTimer(state);
		else this.scheduleInboundFlush(state);
	}
	scheduleInboundFlush(state) {
		if (this.closed || this.discardingInboundAudio || state.flushTimer || state.pendingPackets.size === 0) return;
		state.flushTimer = setTimeout(() => {
			state.flushTimer = void 0;
			if (this.closed) return;
			try {
				this.flushInboundReorderWindow(state, true);
			} catch (error) {
				this.audioClock.stop();
				this.state.callbacks.onError(toErrorObject(error, "OpenAI GPT-Live WebRTC media failed"));
			}
		}, 80);
		state.flushTimer.unref?.();
	}
	clearInboundFlushTimer(state) {
		if (state.flushTimer) {
			clearTimeout(state.flushTimer);
			state.flushTimer = void 0;
		}
	}
	decodeInboundPacket(packet) {
		const opusPacket = this.state.werift.dePacketizeRtpPackets("opus", [packet]).data;
		let decoded;
		try {
			decoded = this.state.decoder.decode(opusPacket, { maxFrameSize: 5760 });
		} catch (error) {
			if (!(error instanceof this.state.libopus.OpusError && error.code === this.state.libopus.OpusErrorCode.InvalidPacket || opusPacket.length === 0 && error instanceof RangeError) || !this.state.callbacks.onMediaError) throw error;
			this.reportMediaError(error);
			if (this.closed) return;
			decoded = this.state.decoder.decodePacketLoss(OPUS_FRAME_SAMPLES);
		}
		this.emitInboundPcm(decoded);
	}
	decodeInboundPacketLoss() {
		this.emitInboundPcm(this.state.decoder.decodePacketLoss(OPUS_FRAME_SAMPLES));
	}
	emitInboundPcm(decoded) {
		if (this.closed || this.discardingInboundAudio) return;
		const frameCount = Math.floor(decoded.length / QUICKSILVER_CHANNELS);
		const mono48k = Buffer.alloc(frameCount * 2);
		for (let frame = 0; frame < frameCount; frame += 1) {
			const left = decoded[frame * 2] ?? 0;
			const right = decoded[frame * 2 + 1] ?? 0;
			mono48k.writeInt16LE(Math.round((left + right) / 2), frame * 2);
		}
		const relayPcm = this.inboundResampler.process(mono48k);
		if (relayPcm.length > 0) this.state.callbacks.onAudio(relayPcm);
	}
	sendNextAudioFrame() {
		if (!this.connected || this.closed) return;
		const frame = this.takeNextRelayFrame();
		try {
			const resampled = this.outboundResampler.process(frame);
			this.pendingResampledAudio = Buffer.concat([this.pendingResampledAudio, resampled]);
			const monoFrameBytes = OPUS_FRAME_SAMPLES * 2;
			const monoFrame = Buffer.alloc(monoFrameBytes);
			this.pendingResampledAudio.copy(monoFrame, 0, 0, monoFrameBytes);
			this.pendingResampledAudio = Buffer.from(this.pendingResampledAudio.subarray(monoFrameBytes));
			const opusPacket = this.state.encoder.encode(duplicateMonoToStereo(monoFrame), { frameSize: OPUS_FRAME_SAMPLES });
			const rtp = new this.state.werift.RtpPacket(new this.state.werift.RtpHeader({
				marker: false,
				payloadType: 111,
				sequenceNumber: this.sequenceNumber,
				timestamp: this.timestamp
			}), Buffer.from(opusPacket));
			this.sequenceNumber = this.sequenceNumber + 1 & 65535;
			this.timestamp = this.timestamp + OPUS_FRAME_SAMPLES >>> 0;
			this.state.transceiver.sender.sendRtp(rtp).then(() => {
				this.outboundPacketFailed = false;
			}, (error) => {
				if (this.closed) return;
				if (this.outboundPacketFailed) {
					this.audioClock.stop();
					this.state.callbacks.onError(toErrorObject(error, "OpenAI GPT-Live WebRTC media failed"));
					return;
				}
				this.outboundPacketFailed = true;
				this.reportMediaError(error);
			});
		} catch (error) {
			this.audioClock.stop();
			this.state.callbacks.onError(toErrorObject(error, "OpenAI GPT-Live WebRTC media failed"));
		}
	}
	takeNextRelayFrame() {
		const frame = Buffer.alloc(960);
		this.pendingAudio.readInto(frame);
		return frame;
	}
};
//#endregion
export { OpenAIQuicksilverAudioPeer as t };
