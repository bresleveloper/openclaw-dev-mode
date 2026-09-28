import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { logVerbose, shouldLogVerbose } from "openclaw/plugin-sdk/runtime-env";
import { Duplex } from "node:stream";
import { spawn } from "node:child_process";
import { StringDecoder } from "node:string_decoder";
import { Application, OpusError, createDecoder, createEncoder } from "libopus-wasm";
import { resolveFfmpegBin } from "openclaw/plugin-sdk/media-runtime";
import { createStreamingPcmResampler } from "openclaw/plugin-sdk/realtime-voice-provider";
import { resolvePreferredOpenClawTmpDir, tempWorkspace } from "openclaw/plugin-sdk/temp-path";
//#region extensions/discord/src/voice/audio-worker-protocol.ts
const DISCORD_AUDIO_OUTPUT_STATUS = 1;
const DiscordAudioOutputStatus = {
	Buffering: 0n,
	Playing: 1n,
	Retiring: 2n,
	Closed: 3n
};
const OUTPUT_STATUS_MASK = 3n;
const OUTPUT_INPUT_RESERVATION = 4n;
function getDiscordAudioOutputStatus(clock) {
	return Atomics.load(clock, DISCORD_AUDIO_OUTPUT_STATUS) & OUTPUT_STATUS_MASK;
}
function setDiscordAudioOutputStatus(clock, status) {
	for (;;) {
		const current = Atomics.load(clock, DISCORD_AUDIO_OUTPUT_STATUS);
		if ((current & OUTPUT_STATUS_MASK) >= status) return;
		const next = current & -4n | status;
		if (Atomics.compareExchange(clock, DISCORD_AUDIO_OUTPUT_STATUS, current, next) === current) return;
	}
}
function admitDiscordAudioInput(clock) {
	for (;;) {
		const current = Atomics.load(clock, DISCORD_AUDIO_OUTPUT_STATUS);
		if ((current & OUTPUT_STATUS_MASK) >= DiscordAudioOutputStatus.Retiring) return false;
		if (Atomics.compareExchange(clock, DISCORD_AUDIO_OUTPUT_STATUS, current, current + OUTPUT_INPUT_RESERVATION) === current) return true;
	}
}
function releaseDiscordAudioInput(clock) {
	Atomics.sub(clock, DISCORD_AUDIO_OUTPUT_STATUS, OUTPUT_INPUT_RESERVATION);
}
function retireDiscordAudioOutput(clock) {
	for (;;) {
		const current = Atomics.load(clock, DISCORD_AUDIO_OUTPUT_STATUS);
		if ((current & OUTPUT_STATUS_MASK) >= DiscordAudioOutputStatus.Retiring) return true;
		if (current >= OUTPUT_INPUT_RESERVATION) return false;
		if (Atomics.compareExchange(clock, DISCORD_AUDIO_OUTPUT_STATUS, current, DiscordAudioOutputStatus.Retiring) === current) return true;
	}
}
function serializeDiscordAudioError(error) {
	if (!(error instanceof Error)) return {
		name: "Error",
		message: String(error)
	};
	return {
		name: error.name,
		message: error.message,
		..."code" in error && typeof error.code === "number" ? { code: error.code } : {},
		..."codeName" in error && typeof error.codeName === "string" ? { codeName: error.codeName } : {},
		..."operation" in error && typeof error.operation === "string" ? { operation: error.operation } : {}
	};
}
function restoreDiscordAudioError(error) {
	return Object.assign(new Error(error.message), error);
}
//#endregion
//#region extensions/discord/src/voice/audio.ts
const SAMPLE_RATE = 48e3;
const CHANNELS = 2;
const BIT_DEPTH = 16;
const FFMPEG_ERROR_OUTPUT_BYTES = 8192;
const DISCORD_OPUS_FRAME_SIZE = 960;
const DISCORD_OPUS_MAX_DECODE_FRAME_SIZE = SAMPLE_RATE * 120 / 1e3;
const DISCORD_OPUS_ENCODE_BATCH_FRAMES = 8;
const DISCORD_OPUS_FRAME_BYTES = DISCORD_OPUS_FRAME_SIZE * CHANNELS * (BIT_DEPTH / 8);
const FFMPEG_PCM_ARGUMENTS = [
	"-analyzeduration",
	"0",
	"-loglevel",
	"error",
	"-vn",
	"-sn",
	"-dn",
	"-f",
	"s16le",
	"-ar",
	String(SAMPLE_RATE),
	"-ac",
	String(CHANNELS)
];
let warnedOpusMissing = false;
function buildWavBuffer(chunks) {
	const pcmBytes = chunks.reduce((total, chunk) => total + chunk.length, 0);
	const blockAlign = 4;
	const byteRate = SAMPLE_RATE * blockAlign;
	const wav = Buffer.allocUnsafe(44 + pcmBytes);
	const header = wav.subarray(0, 44);
	header.write("RIFF", 0);
	header.writeUInt32LE(36 + pcmBytes, 4);
	header.write("WAVE", 8);
	header.write("fmt ", 12);
	header.writeUInt32LE(16, 16);
	header.writeUInt16LE(1, 20);
	header.writeUInt16LE(CHANNELS, 22);
	header.writeUInt32LE(SAMPLE_RATE, 24);
	header.writeUInt32LE(byteRate, 28);
	header.writeUInt16LE(blockAlign, 32);
	header.writeUInt16LE(BIT_DEPTH, 34);
	header.write("data", 36);
	header.writeUInt32LE(pcmBytes, 40);
	let offset = 44;
	for (const chunk of chunks) offset += chunk.copy(wav, offset);
	return wav;
}
function createDiscordOpusEncodeStream() {
	return new DiscordOpusEncodeStream();
}
function createDiscordOpusPlaybackStream(input) {
	const inputSource = typeof input === "string" ? input : "pipe:0";
	const ffmpeg = spawn(resolveFfmpegBin(), [
		"-i",
		inputSource,
		...FFMPEG_PCM_ARGUMENTS,
		"pipe:1"
	], {
		stdio: [
			"pipe",
			"pipe",
			"pipe"
		],
		windowsHide: true
	});
	const opusStream = createDiscordOpusEncodeStream();
	const stderr = Buffer.alloc(FFMPEG_ERROR_OUTPUT_BYTES);
	let stderrBytes = 0;
	let ffmpegClosed = false;
	const killFfmpeg = (signal = "SIGTERM") => {
		if (!ffmpegClosed && !ffmpeg.killed) ffmpeg.kill(signal);
	};
	ffmpeg.stderr.on("data", (chunk) => {
		if (stderrBytes < FFMPEG_ERROR_OUTPUT_BYTES) stderrBytes += chunk.copy(stderr, stderrBytes, 0, FFMPEG_ERROR_OUTPUT_BYTES - stderrBytes);
	});
	ffmpeg.once("error", (err) => {
		opusStream.destroy(err);
	});
	ffmpeg.once("close", (code, signal) => {
		ffmpegClosed = true;
		if (code && code !== 0) {
			const stderrText = new StringDecoder("utf8").write(stderr.subarray(0, stderrBytes)).trim();
			const suffix = stderrText ? `: ${stderrText}` : "";
			opusStream.destroy(/* @__PURE__ */ new Error(`ffmpeg exited with code ${code}${suffix}`));
			return;
		}
		if (signal) opusStream.destroy(/* @__PURE__ */ new Error(`ffmpeg exited with signal ${signal}`));
	});
	for (const readable of [ffmpeg.stdout, ffmpeg.stderr]) readable.on("error", (err) => {
		killFfmpeg("SIGKILL");
		opusStream.destroy(err);
	});
	ffmpeg.stdin.on("error", (err) => {
		if (err.code !== "EPIPE") opusStream.destroy(err);
	});
	ffmpeg.stdout.pipe(opusStream);
	opusStream.once("close", () => {
		if (!opusStream.readableEnded) killFfmpeg();
	});
	if (typeof input !== "string") {
		input.on("error", (err) => {
			ffmpeg.stdin.destroy(err);
			opusStream.destroy(err);
		});
		input.pipe(ffmpeg.stdin);
	} else ffmpeg.stdin.end();
	return opusStream;
}
var DiscordOpusEncodeStream = class extends Duplex {
	#partialFrame = Buffer.alloc(DISCORD_OPUS_FRAME_BYTES);
	#partialBytes = 0;
	#pending;
	#scheduled;
	#readBlocked = false;
	#partialFlushRequested = false;
	#encoder;
	#packetPcmBytes = /* @__PURE__ */ new WeakMap();
	constructor() {
		super({ readableObjectMode: true });
	}
	_construct(done) {
		createEncoder({
			application: Application.Audio,
			channels: CHANNELS,
			sampleRate: SAMPLE_RATE
		}).then((encoder) => {
			this.#encoder = encoder;
			done();
		}, (err) => done(err instanceof Error ? err : new Error(formatErrorMessage(err))));
	}
	_write(chunk, _encoding, done) {
		this.#pending = {
			chunk,
			offset: 0,
			done
		};
		this.#schedule();
	}
	_read() {
		this.#readBlocked = false;
		this.#schedule();
	}
	#schedule() {
		if (this.destroyed || this.#scheduled || this.#readBlocked || !this.#pending) return;
		this.#scheduled = setImmediate(() => {
			this.#scheduled = void 0;
			this.#encodeBatch();
		});
	}
	#encodeBatch() {
		const pending = this.#pending;
		if (!pending || this.destroyed) return;
		try {
			for (let count = 0; count < DISCORD_OPUS_ENCODE_BATCH_FRAMES; count += 1) {
				const remainingBytes = pending.chunk.length - pending.offset;
				if (this.#partialBytes > 0 || remainingBytes < DISCORD_OPUS_FRAME_BYTES) {
					const copied = pending.chunk.copy(this.#partialFrame, this.#partialBytes, pending.offset, pending.offset + DISCORD_OPUS_FRAME_BYTES - this.#partialBytes);
					pending.offset += copied;
					this.#partialBytes += copied;
					if (this.#partialBytes < DISCORD_OPUS_FRAME_BYTES) {
						this.#pending = void 0;
						pending.done();
						this.#flushRequestedPartialFrame();
						return;
					}
					this.#partialBytes = 0;
					this.#readBlocked = !this.#encodeFrame(this.#partialFrame);
				} else {
					const frame = pending.chunk.subarray(pending.offset, pending.offset + DISCORD_OPUS_FRAME_BYTES);
					pending.offset += DISCORD_OPUS_FRAME_BYTES;
					this.#readBlocked = !this.#encodeFrame(frame);
				}
				if (this.destroyed || this.#readBlocked) return;
			}
			this.#schedule();
		} catch (err) {
			this.#pending = void 0;
			pending.done(err instanceof Error ? err : new Error(formatErrorMessage(err)));
		}
	}
	_final(done) {
		try {
			this.flushPartialFrame();
			this.push(null);
			done();
		} catch (err) {
			done(err instanceof Error ? err : new Error(formatErrorMessage(err)));
		}
	}
	flushPartialFrameWhenReady() {
		this.#partialFlushRequested = true;
		if (this.#partialBytes > 0) this.#flushRequestedPartialFrame();
	}
	#flushRequestedPartialFrame() {
		if (!this.#partialFlushRequested || this.#pending || this.writableLength > 0) return;
		this.#partialFlushRequested = false;
		try {
			this.flushPartialFrame();
		} catch (error) {
			this.destroy(error instanceof Error ? error : new Error(formatErrorMessage(error)));
		}
	}
	flushPartialFrame() {
		if (this.destroyed || this.#pending || this.#partialBytes === 0) return false;
		const pcmBytes = this.#partialBytes;
		this.#partialFrame.fill(0, pcmBytes);
		this.#partialBytes = 0;
		this.#readBlocked = !this.#encodeFrame(this.#partialFrame, pcmBytes);
		return true;
	}
	takePcmBytes(packet) {
		const bytes = this.#packetPcmBytes.get(packet) ?? 0;
		this.#packetPcmBytes.delete(packet);
		return bytes;
	}
	_destroy(err, done) {
		this.#encoder?.free();
		clearImmediate(this.#scheduled);
		this.#scheduled = void 0;
		this.#partialFlushRequested = false;
		const pending = this.#pending;
		this.#pending = void 0;
		pending?.done(err ?? /* @__PURE__ */ new Error("Discord Opus encoder was destroyed"));
		this.#partialBytes = 0;
		this.#partialFrame = Buffer.alloc(0);
		done(err);
	}
	#encodeFrame(frame, pcmBytes = frame.length) {
		const packet = Buffer.from(this.#encoder.encode(frame, { frameSize: DISCORD_OPUS_FRAME_SIZE }));
		this.#packetPcmBytes.set(packet, pcmBytes);
		return this.push(packet);
	}
};
function pcmInt16ToBuffer(pcm) {
	return Buffer.from(pcm.buffer, pcm.byteOffset, pcm.byteLength);
}
async function decodeOpusStreamChunks(stream, params) {
	try {
		for await (const { pcm, packet } of decodeOpusFrames(stream, params)) await params.onChunk(pcm, packet);
	} catch (err) {
		params.onError?.(err);
	}
}
async function* decodeOpusFrames(stream, params) {
	let decoder;
	try {
		decoder = await createDecoder({
			channels: CHANNELS,
			sampleRate: SAMPLE_RATE
		});
	} catch (err) {
		params.onError?.(err);
		if (!warnedOpusMissing) {
			warnedOpusMissing = true;
			params.onWarn(`discord voice: no usable opus decoder available (libopus-wasm: ${formatErrorMessage(err)}); cannot decode voice audio`);
		}
		return;
	}
	params.onVerbose("opus decoder: libopus-wasm");
	try {
		for await (const chunk of stream) {
			if (!chunk || !(chunk instanceof Buffer) || chunk.length === 0) continue;
			const decoded = decoder.decode(chunk, { maxFrameSize: DISCORD_OPUS_MAX_DECODE_FRAME_SIZE });
			if (decoded.length > 0) yield {
				pcm: pcmInt16ToBuffer(decoded),
				packet: chunk
			};
		}
	} catch (err) {
		params.onError?.(err);
		if (shouldLogVerbose()) logVerbose(`discord voice: opus decode failed: ${formatErrorMessage(err)}`);
	} finally {
		decoder.free();
	}
}
function createDiscordPcmToRealtimeConverter() {
	const resampler = createStreamingPcmResampler(SAMPLE_RATE, 24e3);
	let trailingFrame = Buffer.alloc(0);
	return {
		process(pcm) {
			const input = trailingFrame.length > 0 ? Buffer.concat([trailingFrame, pcm]) : pcm;
			const completeBytes = input.length - input.length % 4;
			trailingFrame = Buffer.from(input.subarray(completeBytes));
			const mono = Buffer.alloc(completeBytes / 2);
			for (let offset = 0; offset < completeBytes; offset += 4) mono.writeInt16LE(Math.round((input.readInt16LE(offset) + input.readInt16LE(offset + 2)) / 2), offset / 2);
			return resampler.process(mono);
		},
		flush() {
			trailingFrame = Buffer.alloc(0);
			return resampler.flush();
		}
	};
}
function duplicateMonoChannels(mono) {
	const stereo = Buffer.alloc(mono.length * 2);
	for (let offset = 0; offset < mono.length; offset += 2) {
		const sample = mono.readInt16LE(offset);
		stereo.writeInt16LE(sample, offset * 2);
		stereo.writeInt16LE(sample, offset * 2 + 2);
	}
	return stereo;
}
function createRealtimePcmToDiscordConverter() {
	let resampler = createStreamingPcmResampler(24e3, SAMPLE_RATE);
	let history = Buffer.alloc(0);
	let trailingByte = Buffer.alloc(0);
	let replayBytes = 0;
	let flushed = false;
	const takeOutput = (pcm) => {
		const skippedBytes = Math.min(replayBytes, pcm.length);
		replayBytes -= skippedBytes;
		return duplicateMonoChannels(pcm.subarray(skippedBytes));
	};
	return {
		process(pcm) {
			const input = trailingByte.length > 0 ? Buffer.concat([trailingByte, pcm]) : pcm;
			const completeBytes = input.length - input.length % 2;
			const completePcm = input.subarray(0, completeBytes);
			trailingByte = Buffer.from(input.subarray(completeBytes));
			history = Buffer.concat([history, completePcm.subarray(-64)]).subarray(-64);
			return takeOutput(resampler.process(completePcm));
		},
		drain() {
			if (flushed) return Buffer.alloc(0);
			const output = takeOutput(resampler.flush());
			resampler = createStreamingPcmResampler(24e3, SAMPLE_RATE);
			replayBytes = history.length * 2 - resampler.process(history).length;
			return output;
		},
		flush() {
			flushed = true;
			trailingByte = Buffer.alloc(0);
			history = Buffer.alloc(0);
			return takeOutput(resampler.flush());
		}
	};
}
async function writeVoiceWavFile(chunks) {
	const wav = buildWavBuffer(chunks);
	const workspace = await tempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "discord-voice-"
	});
	try {
		return {
			path: await workspace.write("segment.wav", wav),
			durationSeconds: (wav.length - 44) / (BIT_DEPTH / 8 * CHANNELS * SAMPLE_RATE),
			cleanup: () => workspace[Symbol.asyncDispose]()
		};
	} catch (error) {
		await workspace.cleanup();
		throw error;
	}
}
//#endregion
//#region extensions/discord/src/voice/receive-recovery.ts
const DECRYPT_FAILURE_WINDOW_MS = 3e4;
const DECRYPT_FAILURE_RECONNECT_THRESHOLD = 3;
const DECRYPT_FAILURE_MARKER = "DecryptionFailed(";
const DAVE_PASSTHROUGH_DISABLED_MARKER = "UnencryptedWhenPassthroughDisabled";
const WASM_MEMORY_ACCESS_MARKER = "memory access out of bounds";
const OPUS_INVALID_PACKET_CODE = -4;
function createVoiceReceiveRecoveryState() {
	return {
		decryptFailureCount: 0,
		lastDecryptFailureAt: 0,
		decryptRecoveryInFlight: false
	};
}
function isAbortLikeReceiveError(err) {
	if (!err || typeof err !== "object") return false;
	const name = "name" in err && typeof err.name === "string" ? err.name : "";
	const message = "message" in err && typeof err.message === "string" ? err.message : "";
	return name === "AbortError" || message === "Premature close" || message.includes("The operation was aborted") || message.includes("aborted");
}
function isOpusDecodeInvalidPacketError(err) {
	if (!err || typeof err !== "object") return false;
	const maybeOpusError = err;
	const isDecodeOperation = maybeOpusError.operation === "decode" || maybeOpusError.operation === "decodeFloat";
	const isInvalidPacket = maybeOpusError.code === OPUS_INVALID_PACKET_CODE || maybeOpusError.codeName === "InvalidPacket";
	return isDecodeOperation && isInvalidPacket && (err instanceof OpusError || maybeOpusError.name === "OpusError");
}
function analyzeVoiceReceiveError(err) {
	const message = formatErrorMessage(err);
	const normalizedMessage = message.toLowerCase();
	const shouldAttemptPassthrough = message.includes(DAVE_PASSTHROUGH_DISABLED_MARKER);
	const isWasmMemoryAccessFailure = normalizedMessage.includes(WASM_MEMORY_ACCESS_MARKER);
	return {
		message,
		isAbortLike: isAbortLikeReceiveError(err),
		isDecodeCorruption: isOpusDecodeInvalidPacketError(err),
		shouldAttemptPassthrough,
		countsAsDecryptFailure: message.includes(DECRYPT_FAILURE_MARKER) || shouldAttemptPassthrough || isWasmMemoryAccessFailure
	};
}
function noteVoiceDecryptFailure(state, now = Date.now()) {
	if (now - state.lastDecryptFailureAt > 3e4) state.decryptFailureCount = 0;
	state.lastDecryptFailureAt = now;
	state.decryptFailureCount += 1;
	const firstFailure = state.decryptFailureCount === 1;
	if (state.decryptFailureCount < DECRYPT_FAILURE_RECONNECT_THRESHOLD || state.decryptRecoveryInFlight) return {
		firstFailure,
		shouldRecover: false
	};
	state.decryptRecoveryInFlight = true;
	resetVoiceReceiveRecoveryState(state);
	return {
		firstFailure,
		shouldRecover: true
	};
}
function resetVoiceReceiveRecoveryState(state) {
	state.decryptFailureCount = 0;
	state.lastDecryptFailureAt = 0;
}
function finishVoiceDecryptRecovery(state) {
	state.decryptRecoveryInFlight = false;
}
function isDaveReinitializing(session) {
	return session.reinitializing === true;
}
function recoverDaveZeroTransition(params) {
	const { target, sdk, onWarn } = params;
	const networkingState = target.connection.state.networking?.state;
	const daveSession = networkingState?.dave;
	if (target.connection.state.status !== sdk.VoiceConnectionStatus.Ready || networkingState?.code !== sdk.NetworkingStatusCode.Ready || daveSession?.lastTransitionId !== 0 || daveSession.reinitializing !== false || typeof daveSession.recoverFromInvalidTransition !== "function") return "not-attempted";
	try {
		daveSession.recoverFromInvalidTransition(0);
		return "recovered";
	} catch (err) {
		onWarn(`discord voice: failed to recover DAVE transition 0 guild=${target.guildId} channel=${target.channelId}: ${formatErrorMessage(err)}`);
		return isDaveReinitializing(daveSession) ? "failed" : "not-attempted";
	}
}
function enableDaveReceivePassthrough(params) {
	const { target, sdk, reason, expirySeconds, onVerbose, onWarn } = params;
	const networkingState = target.connection.state.networking?.state;
	if (target.connection.state.status !== sdk.VoiceConnectionStatus.Ready || !networkingState || networkingState.code !== sdk.NetworkingStatusCode.Ready && networkingState.code !== sdk.NetworkingStatusCode.Resuming) return false;
	const daveSession = networkingState.dave?.session;
	if (!daveSession) return false;
	try {
		daveSession.setPassthroughMode(true, expirySeconds);
		onVerbose(`enabled DAVE receive passthrough: guild ${target.guildId} channel ${target.channelId} expiry=${expirySeconds}s reason=${reason}`);
		return true;
	} catch (err) {
		onWarn(`discord voice: failed to enable DAVE passthrough guild=${target.guildId} channel=${target.channelId} reason=${reason}: ${formatErrorMessage(err)}`);
		return false;
	}
}
//#endregion
export { setDiscordAudioOutputStatus as S, getDiscordAudioOutputStatus as _, finishVoiceDecryptRecovery as a, retireDiscordAudioOutput as b, resetVoiceReceiveRecoveryState as c, createDiscordPcmToRealtimeConverter as d, createRealtimePcmToDiscordConverter as f, admitDiscordAudioInput as g, DiscordAudioOutputStatus as h, enableDaveReceivePassthrough as i, createDiscordOpusEncodeStream as l, writeVoiceWavFile as m, analyzeVoiceReceiveError as n, noteVoiceDecryptFailure as o, decodeOpusStreamChunks as p, createVoiceReceiveRecoveryState as r, recoverDaveZeroTransition as s, DECRYPT_FAILURE_WINDOW_MS as t, createDiscordOpusPlaybackStream as u, releaseDiscordAudioInput as v, serializeDiscordAudioError as x, restoreDiscordAudioError as y };
