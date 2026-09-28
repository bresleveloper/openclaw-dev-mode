import { S as setDiscordAudioOutputStatus, _ as getDiscordAudioOutputStatus, b as retireDiscordAudioOutput, f as createRealtimePcmToDiscordConverter, h as DiscordAudioOutputStatus, i as enableDaveReceivePassthrough, l as createDiscordOpusEncodeStream, n as analyzeVoiceReceiveError, p as decodeOpusStreamChunks, s as recoverDaveZeroTransition, u as createDiscordOpusPlaybackStream, v as releaseDiscordAudioInput, x as serializeDiscordAudioError } from "../../.setup/receive-recovery-DHst8WRx.mjs";
import { createRequire } from "node:module";
import { formatErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { createSubsystemLogger } from "openclaw/plugin-sdk/runtime-env";
import { parentPort, workerData } from "node:worker_threads";
import { PassThrough, pipeline } from "node:stream";
import { REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ } from "openclaw/plugin-sdk/realtime-voice-provider";
import { createRealtimeVoiceOutputActivityTracker, isRealtimeVoiceAudioAudible } from "openclaw/plugin-sdk/realtime-voice";
//#region extensions/discord/src/voice/sdk-runtime.ts
let cachedDiscordVoiceSdk = null;
function loadDiscordVoiceSdk() {
	if (cachedDiscordVoiceSdk) return cachedDiscordVoiceSdk;
	cachedDiscordVoiceSdk = createRequire(import.meta.url)("@discordjs/voice");
	return cachedDiscordVoiceSdk;
}
//#endregion
//#region extensions/discord/src/voice/realtime-player.runtime.ts
const DISCORD_REALTIME_PLAYBACK_IDLE_MS = 2e3;
/** One physical player serves every speaker lane in the room. */
var DiscordRealtimePlayer = class {
	hold(hold) {
		this.holds = Math.max(0, this.holds + (hold ? 1 : -1));
		this.drain();
	}
	constructor(player) {
		this.player = player;
		this.queue = [];
		this.changing = false;
		this.closed = false;
		this.holds = 0;
		this.onIdle = () => {
			const request = this.current;
			this.current = void 0;
			if (request) this.transition(() => request.onIdle());
		};
		const stop = player.stop.bind(player);
		player.stop = (force) => {
			const request = this.current;
			if (request && !force && !request.onRetiring()) return false;
			return stop(force);
		};
		player.on(loadDiscordVoiceSdk().AudioPlayerStatus.Idle, this.onIdle);
	}
	enqueue(request) {
		if (this.closed || this.current === request) return;
		if (!this.queue.includes(request)) this.queue.push(request);
		this.drain();
	}
	isRetiring(request) {
		if (this.current !== request) return false;
		const state = this.player.state;
		return state.status !== loadDiscordVoiceSdk().AudioPlayerStatus.Idle && state.resource.silenceRemaining >= 0;
	}
	cancel(request) {
		this.queue = this.queue.filter((queued) => queued !== request);
		if (this.current !== request) {
			this.drain();
			return;
		}
		this.current = void 0;
		this.transition(() => this.player.stop(true));
	}
	close() {
		if (this.closed) return;
		this.closed = true;
		this.queue = [];
		this.current = void 0;
		this.player.off(loadDiscordVoiceSdk().AudioPlayerStatus.Idle, this.onIdle);
		this.player.stop(true);
	}
	/** Prevent retiring one lane from granting playback to a sibling that is also retiring. */
	transition(action) {
		const wasChanging = this.changing;
		this.changing = true;
		try {
			action();
		} finally {
			this.changing = wasChanging;
			this.drain();
		}
	}
	drain() {
		if (this.closed || this.changing || this.current || this.holds > 0) return;
		const next = this.queue[0];
		if (!next?.isReady()) return;
		this.queue.shift();
		this.current = next;
		this.transition(() => {
			try {
				this.player.play(next.createResource());
				next.onStart();
			} catch (error) {
				this.current = void 0;
				this.player.stop(true);
				next.onError(error);
			}
		});
	}
};
//#endregion
//#region extensions/discord/src/voice/realtime-output.runtime.ts
const logger = createSubsystemLogger("discord/voice");
const DISCORD_RAW_PCM_FRAME_BYTES = 3840;
const DISCORD_RAW_PCM_BYTES_PER_MS = 192;
const DISCORD_REALTIME_OUTPUT_PREROLL_FRAMES = 25;
const DISCORD_CONTINUOUS_PREROLL_FRAMES = 6;
const DISCORD_CONTINUOUS_START_DEADLINE_MS = 120;
const DISCORD_REALTIME_OUTPUT_PLAYBACK_WATCHDOG_MARGIN_MS = 3e3;
/** One output stream retains ownership through queued and audible playback. */
var DiscordRealtimeOutput = class {
	constructor(params) {
		this.params = params;
		this.activity = createRealtimeVoiceOutputActivityTracker();
		this.converter = createRealtimePcmToDiscordConverter();
		this.stream = new PassThrough({ highWaterMark: DISCORD_RAW_PCM_FRAME_BYTES * 128 });
		this.ready = false;
		this.playbackMarks = [];
		this.playedPcmBytes = 0;
		this.lastAudiblePcmEndBytes = 0;
		this.buffers = [];
		this.bufferedBytes = 0;
		this.closed = false;
		this.failed = false;
		this.stream.once("close", () => {
			if (!this.activity.snapshot().playbackStarted) this.close("stream-close");
		});
	}
	pendingBytes() {
		return this.closed ? 0 : Math.max(0, this.activity.snapshot().sourceAudioBytes * 4 - this.playedPcmBytes);
	}
	isAcceptingAudio() {
		return !this.closed && getDiscordAudioOutputStatus(this.params.clock) < DiscordAudioOutputStatus.Retiring && !this.activity.snapshot().streamEnding && (!this.request || !this.params.player.isRetiring(this.request));
	}
	hasUnplayedAudibleAudio() {
		return !this.closed && this.playedPcmBytes < this.lastAudiblePcmEndBytes;
	}
	markPlayback(acknowledge) {
		if (!this.closed) this.playbackMarks.push({
			endBytes: this.activity.snapshot().sinkAudioBytes,
			acknowledge
		});
	}
	append(sourcePcm, audible) {
		if (!this.isAcceptingAudio()) return;
		const previous = this.activity.snapshot();
		const sinkBytes = Math.floor((previous.sourceAudioBytes + sourcePcm.length) / 2) * 8;
		const audioMs = (sinkBytes - previous.sinkAudioBytes) / DISCORD_RAW_PCM_BYTES_PER_MS;
		this.activity.markAudio({
			audioMs,
			sourceAudioBytes: sourcePcm.length,
			sinkAudioBytes: sinkBytes - previous.sinkAudioBytes
		});
		if (audible) {
			this.clearSilenceTimer();
			this.silentSince = void 0;
			this.lastAudiblePcmEndBytes = this.activity.snapshot().sinkAudioBytes;
		}
		this.writeConverted(this.converter.process(sourcePcm));
		this.scheduleSilenceRetirement();
		if (this.params.continuous) this.enqueuePlayback();
		const prerollFrames = this.params.continuous ? DISCORD_CONTINUOUS_PREROLL_FRAMES : DISCORD_REALTIME_OUTPUT_PREROLL_FRAMES;
		if (this.activity.snapshot().sinkAudioBytes >= DISCORD_RAW_PCM_FRAME_BYTES * prerollFrames) this.startPlayback();
		else if (this.params.continuous && !this.ready && !this.startupTimer) {
			this.startupTimer = setTimeout(() => {
				this.startupTimer = void 0;
				this.startPlayback();
			}, DISCORD_CONTINUOUS_START_DEADLINE_MS);
			this.startupTimer.unref?.();
		}
	}
	appendAdmitted(sourcePcm, audible) {
		try {
			this.append(sourcePcm, audible);
		} finally {
			releaseDiscordAudioInput(this.params.clock);
		}
	}
	writeConverted(pcm) {
		if (pcm.length === 0 || this.closed) return;
		if (this.activity.snapshot().playbackStarted && !this.drainHandler) {
			if (!this.stream.write(pcm)) this.waitForDrain();
			return;
		}
		this.buffers.push(pcm);
		this.bufferedBytes += pcm.length;
	}
	finish(reason, playBuffered) {
		if (this.closed) return;
		this.publishRetiring();
		this.clearSilenceTimer();
		if (playBuffered) this.writeConverted(this.converter.flush());
		this.activity.markStreamEnding();
		const activity = this.activity.snapshot();
		logger.info(`discord voice: realtime audio playback finishing reason=${reason} ${this.params.logContext} audioMs=${Math.floor(activity.audioMs)} chunks=${activity.chunks}`);
		if (!playBuffered) {
			this.close(reason);
			return;
		}
		this.startPlayback();
		if (this.activity.snapshot().playbackStarted) {
			this.scheduleWatchdog(reason);
			if (!this.drainHandler) this.stream.end();
		}
	}
	close(reason) {
		if (this.closed) return;
		const playbackRetirement = reason === "player-idle" || reason === "output-pipeline-error" || reason === "playback-watchdog";
		const heardMarks = playbackRetirement ? this.playbackMarks.filter((mark) => mark.endBytes <= this.playedPcmBytes) : [];
		const lostPlaybackMarks = playbackRetirement && this.playbackMarks.some((mark) => mark.endBytes > this.playedPcmBytes);
		this.closed = true;
		setDiscordAudioOutputStatus(this.params.clock, DiscordAudioOutputStatus.Closed);
		this.clearSilenceTimer();
		clearTimeout(this.startupTimer);
		this.startupTimer = void 0;
		this.playbackMarks = [];
		this.clearWatchdog();
		const activity = this.activity.snapshot();
		logger.info(`discord voice: realtime audio playback stopped reason=${reason} ${this.params.logContext} audioMs=${Math.floor(activity.audioMs)} elapsedMs=${this.activity.elapsedPlaybackMs()} chunks=${activity.chunks} discordBytes=${activity.sinkAudioBytes} realtimeBytes=${activity.sourceAudioBytes}`);
		this.buffers = [];
		this.bufferedBytes = 0;
		if (this.drainHandler) {
			this.stream.off("drain", this.drainHandler);
			this.drainHandler = void 0;
		}
		this.stream.end();
		this.stream.destroy();
		if (lostPlaybackMarks) this.params.onError(/* @__PURE__ */ new Error(`Discord realtime audio stopped before playback completed: ${reason}`));
		this.params.onClose(this, reason);
		if (this.request) {
			this.params.player.cancel(this.request);
			this.request = void 0;
		}
		try {
			for (const mark of heardMarks) mark.acknowledge();
		} catch (error) {
			this.params.onError(error);
		}
	}
	startPlayback() {
		if (this.closed || this.ready) return;
		clearTimeout(this.startupTimer);
		this.startupTimer = void 0;
		if (this.bufferedBytes < DISCORD_RAW_PCM_FRAME_BYTES) this.writeConverted(this.converter.drain());
		this.ready = true;
		this.enqueuePlayback();
	}
	publishRetiring() {
		if (!this.closed) setDiscordAudioOutputStatus(this.params.clock, DiscordAudioOutputStatus.Retiring);
	}
	enqueuePlayback() {
		this.request ??= {
			isReady: () => this.ready,
			createResource: () => this.createResource(),
			onStart: () => {
				this.activity.markPlaybackStarted();
				setDiscordAudioOutputStatus(this.params.clock, this.activity.snapshot().streamEnding ? DiscordAudioOutputStatus.Retiring : DiscordAudioOutputStatus.Playing);
				Atomics.store(this.params.clock, 2, 1n);
				this.params.onStart();
				if (this.activity.snapshot().streamEnding) {
					this.scheduleWatchdog("player-start");
					if (!this.drainHandler) this.stream.end();
				}
			},
			onRetiring: () => this.activity.snapshot().sinkAudioBytes <= this.playedPcmBytes && retireDiscordAudioOutput(this.params.clock),
			onIdle: () => this.close(this.failed ? "output-pipeline-error" : "player-idle"),
			onError: this.params.onError
		};
		this.params.player.enqueue(this.request);
	}
	createResource() {
		const voiceSdk = loadDiscordVoiceSdk();
		const opusStream = createDiscordOpusEncodeStream();
		opusStream.once("error", () => {
			this.failed = true;
		});
		pipeline(this.stream, opusStream, (error) => {
			if (!error || this.closed) return;
			logger.warn(`discord voice: realtime output pipeline failed ${this.params.logContext}: ${formatErrorMessage(error)}`);
			this.close("output-pipeline-error");
		});
		const buffered = Buffer.concat(this.buffers, this.bufferedBytes);
		this.buffers = [];
		this.bufferedBytes = 0;
		if (buffered.length > 0 && !this.stream.write(buffered)) this.waitForDrain();
		if (this.params.continuous && buffered.length > 0 && buffered.length < DISCORD_RAW_PCM_FRAME_BYTES) opusStream.flushPartialFrameWhenReady();
		const resource = voiceSdk.createAudioResource(opusStream, { inputType: voiceSdk.StreamType.Opus });
		const read = resource.read.bind(resource);
		resource.read = () => {
			if (this.params.isOpen?.() === false || getDiscordAudioOutputStatus(this.params.clock) === DiscordAudioOutputStatus.Closed) {
				this.close("port-closed");
				return null;
			}
			let packet;
			try {
				packet = read();
				if (!packet && opusStream.flushPartialFrame()) packet = read();
				if (packet) {
					this.playedPcmBytes += opusStream.takePcmBytes(packet);
					Atomics.store(this.params.clock, 0, BigInt(this.playedPcmBytes));
					if (resource.silenceRemaining >= 0) this.publishRetiring();
					const remaining = this.activity.snapshot().sinkAudioBytes - this.playedPcmBytes;
					if (remaining > 0 && remaining <= DISCORD_RAW_PCM_FRAME_BYTES) this.writeConverted(this.converter.drain());
					this.scheduleSilenceRetirement();
				}
			} catch (error) {
				opusStream.destroy(error instanceof Error ? error : new Error(formatErrorMessage(error)));
				return null;
			}
			if (this.playbackMarks.length > 0) queueMicrotask(() => this.acknowledgePlayedMarks());
			return packet;
		};
		return resource;
	}
	acknowledgePlayedMarks() {
		try {
			while (!this.closed) {
				const mark = this.playbackMarks[0];
				if (!mark || mark.endBytes > this.playedPcmBytes) return;
				this.playbackMarks.shift();
				mark.acknowledge();
			}
		} catch (error) {
			this.params.onError(error);
		}
	}
	scheduleSilenceRetirement() {
		const activity = this.activity.snapshot();
		if (!this.params.continuous || this.closed || activity.streamEnding || !activity.playbackStarted || this.hasUnplayedAudibleAudio()) return;
		this.silentSince ??= performance.now();
		if (activity.sinkAudioBytes <= this.lastAudiblePcmEndBytes || this.silenceTimer) return;
		this.silenceTimer = setTimeout(() => {
			this.silenceTimer = void 0;
			if (!this.closed && !this.activity.snapshot().streamEnding && !this.hasUnplayedAudibleAudio() && retireDiscordAudioOutput(this.params.clock)) this.finish("continuous-idle", true);
		}, Math.max(0, DISCORD_REALTIME_PLAYBACK_IDLE_MS - (performance.now() - this.silentSince)));
		this.silenceTimer.unref?.();
	}
	clearSilenceTimer() {
		clearTimeout(this.silenceTimer);
		this.silenceTimer = void 0;
	}
	waitForDrain() {
		if (this.drainHandler || this.closed) return;
		logger.info(`discord voice: realtime audio playback buffering ${this.params.logContext} bufferedBytes=${this.stream.writableLength + this.stream.readableLength}`);
		this.drainHandler = () => {
			this.drainHandler = void 0;
			if (this.closed) return;
			let refreshWatchdog = this.activity.snapshot().streamEnding;
			while (this.buffers.length > 0) {
				const buffered = this.buffers.shift();
				if (!buffered) break;
				this.bufferedBytes -= buffered.length;
				const writable = this.stream.write(buffered);
				if (refreshWatchdog) {
					this.scheduleWatchdog("output-drain");
					refreshWatchdog = false;
				}
				if (!writable) {
					this.waitForDrain();
					return;
				}
			}
			if (this.activity.snapshot().streamEnding) this.stream.end();
		};
		this.stream.once("drain", this.drainHandler);
	}
	scheduleWatchdog(reason) {
		this.clearWatchdog();
		const timeoutMs = this.activity.playbackWatchdogDelayMs({
			marginMs: DISCORD_REALTIME_OUTPUT_PLAYBACK_WATCHDOG_MARGIN_MS,
			minMs: DISCORD_REALTIME_OUTPUT_PLAYBACK_WATCHDOG_MARGIN_MS
		});
		if (timeoutMs === void 0) return;
		this.watchdog = setTimeout(() => {
			this.watchdog = void 0;
			logger.warn(`discord voice: realtime audio playback watchdog fired reason=${reason} ${this.params.logContext} audioMs=${Math.floor(this.activity.snapshot().audioMs)} elapsedMs=${this.activity.elapsedPlaybackMs()}`);
			this.close("playback-watchdog");
		}, timeoutMs);
	}
	clearWatchdog() {
		clearTimeout(this.watchdog);
		this.watchdog = void 0;
	}
};
//#endregion
//#region extensions/discord/src/voice/continuous-output.runtime.ts
/** A transferred endpoint is owned by one already-admitted provider generation.
* No socket, response policy, credential, or speaker admission crosses this port. */
var DiscordContinuousOutput = class {
	constructor(params) {
		this.params = params;
		this.outputs = /* @__PURE__ */ new Set();
		this.closed = false;
		this.enabled = params.enabled;
		params.port.on("message", (message) => {
			try {
				if (this.closed || Atomics.load(params.state, 0) !== 0) return;
				if (message.type === "flushed") {
					params.post({
						type: "continuous-flushed",
						id: params.id,
						marker: message.marker
					});
					return;
				}
				if (!this.enabled) return;
				if (message.type === "audio") this.append(Buffer.from(message.audio));
				else if (message.type === "clear") this.clear();
			} catch (error) {
				this.fail(error);
			} finally {
				if (message.type === "audio") params.port.postMessage({ type: "ack" }, []);
			}
		});
		params.port.on("messageerror", (error) => this.fail(error));
		params.port.on("close", () => this.close());
	}
	append(audio) {
		if (!audio.length) return;
		if (this.generating && !this.generating.isAcceptingAudio()) this.generating = void 0;
		const audible = isRealtimeVoiceAudioAudible(audio, REALTIME_VOICE_AUDIO_FORMAT_PCM16_24KHZ);
		if (!audible && !this.generating) return;
		if ([...this.outputs].reduce((total, output) => total + output.pendingBytes(), 0) + audio.length * 4 > 2304e4 || !this.generating && this.outputs.size >= 32) throw new Error("Discord realtime direct audio backlog exceeded.");
		if (!this.generating) {
			const latch = Atomics.load(this.params.clock, 2);
			const speechEpoch = latch < 0n ? -latch : latch;
			const output = new DiscordRealtimeOutput({
				player: this.params.player,
				clock: new BigInt64Array(new SharedArrayBuffer(24)),
				continuous: true,
				logContext: this.params.logContext,
				isOpen: () => {
					const current = Atomics.load(this.params.clock, 2);
					return !this.closed && this.enabled && Atomics.load(this.params.state, 0) === 0 && (current === speechEpoch || current === -speechEpoch);
				},
				onStart: () => {
					const current = Atomics.compareExchange(this.params.clock, 2, speechEpoch, -speechEpoch);
					if (current !== speechEpoch && current !== -speechEpoch) {
						output.close("exact-speech-retired");
						return;
					}
					this.params.post({
						type: "continuous-start",
						id: this.params.id,
						speechEpoch
					});
				},
				onClose: (closed) => {
					this.outputs.delete(closed);
					if (this.generating === closed) this.generating = void 0;
					Atomics.store(this.params.clock, 0, BigInt(this.outputs.size));
					if (this.outputs.size === 0) {
						Atomics.store(this.params.clock, 1, 0n);
						this.params.post({
							type: "continuous-idle",
							id: this.params.id,
							speechEpoch
						});
					}
				},
				onError: (error) => this.fail(error)
			});
			this.outputs.add(output);
			this.generating = output;
			Atomics.store(this.params.clock, 0, BigInt(this.outputs.size));
		}
		Atomics.add(this.params.clock, 1, BigInt(audio.length));
		this.generating.append(audio, audible);
	}
	activate() {
		this.enabled = true;
	}
	flush(marker) {
		if (!this.closed) this.params.port.postMessage({
			type: "flush",
			marker
		}, []);
	}
	clear() {
		this.generating = void 0;
		this.params.player.transition(() => {
			for (const output of [...this.outputs].toReversed()) output.close("provider-clear");
		});
	}
	close() {
		if (this.closed) return;
		this.closed = true;
		Atomics.store(this.params.state, 0, 1);
		this.clear();
		this.params.port.close();
	}
	fail(error) {
		if (this.closed) return;
		this.params.post({
			type: "continuous-error",
			id: this.params.id,
			error: serializeDiscordAudioError(error)
		});
		this.close();
	}
};
//#endregion
//#region extensions/discord/src/voice/audio-worker.ts
const PLAYBACK_READY_TIMEOUT_MS = 6e4;
const MAX_CAPTURE_PACKETS = 1e3;
const MAX_CAPTURE_BYTES = 1048576;
/** Owns every Discord socket, codec, resource and packet deadline in one isolate. */
var DiscordAudioWorker = class {
	constructor(options, post) {
		this.options = options;
		this.post = post;
		this.sdk = loadDiscordVoiceSdk();
		this.captures = /* @__PURE__ */ new Map();
		this.outputs = /* @__PURE__ */ new Map();
		this.continuous = /* @__PURE__ */ new Map();
		this.stopped = false;
		this.stopAbort = new AbortController();
		this.tasks = /* @__PURE__ */ new Set();
		this.onPlayerError = (error) => this.post({
			type: "error",
			error: serializeDiscordAudioError(error)
		});
		this.onDisconnected = () => {
			if (!this.stopped && this.connection) this.recoverConnection(this.connection);
		};
		this.onDestroyed = () => {
			this.stop();
		};
		this.onSpeakingStart = (userId) => {
			if (this.stopped) return;
			for (const capture of this.captures.values()) if (capture.userId === userId) {
				clearTimeout(capture.timer);
				capture.timer = void 0;
			}
			this.post({
				type: "speaking",
				userId,
				speaking: true
			});
		};
		this.onSpeakingEnd = (userId) => {
			if (this.stopped) return;
			for (const [id, capture] of this.captures) if (capture.userId === userId) this.finalizeLater(id, capture);
			this.post({
				type: "speaking",
				userId,
				speaking: false
			});
		};
		this.player = options.realtime ? this.sdk.createAudioPlayer({ behaviors: { maxMissedFrames: DISCORD_REALTIME_PLAYBACK_IDLE_MS / 20 } }) : this.sdk.createAudioPlayer();
		this.roomPlayer = new DiscordRealtimePlayer(this.player);
		this.player.on("stateChange", (_old, state) => this.post({
			type: "player",
			status: state.status
		}));
		this.player.on("error", this.onPlayerError);
	}
	async connect() {
		const deadline = Date.now() + this.options.connectTimeoutMs;
		for (let attempt = 0; attempt < 2; attempt += 1) {
			if (this.stopped) return;
			const connection = this.sdk.joinVoiceChannel({
				guildId: this.options.guildId,
				channelId: this.options.channelId,
				group: this.options.group,
				selfDeaf: this.options.selfDeaf,
				selfMute: this.options.selfMute,
				daveEncryption: this.options.daveEncryption,
				decryptionFailureTolerance: this.options.decryptionFailureTolerance,
				adapterCreator: (methods) => {
					this.adapter = methods;
					return {
						sendPayload: (payload) => {
							this.post({
								type: "gateway-send",
								payload
							});
							return true;
						},
						destroy: () => {}
					};
				}
			});
			this.connection = connection;
			connection.on("error", (error) => this.post({
				type: "error",
				error: serializeDiscordAudioError(error)
			}));
			try {
				await this.sdk.entersState(connection, this.sdk.VoiceConnectionStatus.Ready, AbortSignal.any([this.stopAbort.signal, AbortSignal.timeout(Math.max(1, deadline - Date.now()))]));
				if (this.stopped) return;
				connection.subscribe(this.player);
				connection.on("stateChange", (_old, state) => {
					this.post({
						type: "connection",
						status: state.status
					});
				});
				connection.on(this.sdk.VoiceConnectionStatus.Destroyed, this.onDestroyed);
				connection.on(this.sdk.VoiceConnectionStatus.Disconnected, this.onDisconnected);
				connection.receiver.speaking.on("start", this.onSpeakingStart);
				connection.receiver.speaking.on("end", this.onSpeakingEnd);
				for (const userId of connection.receiver.speaking.users.keys()) this.post({
					type: "speaking",
					userId,
					speaking: true
				});
				this.post({
					type: "connection",
					status: connection.state.status
				});
				this.post({ type: "ready" });
				return;
			} catch (error) {
				if (this.stopped) return;
				if (connection.state.status !== this.sdk.VoiceConnectionStatus.Destroyed) connection.destroy();
				if (attempt === 0 && !this.stopped && Date.now() < deadline && error instanceof Error && error.message.toLowerCase().includes("operation was aborted")) continue;
				throw error;
			}
		}
	}
	receive(command) {
		if (this.stopped) return;
		switch (command.type) {
			case "gateway-server":
				this.adapter?.onVoiceServerUpdate(command.data);
				break;
			case "gateway-state":
				this.adapter?.onVoiceStateUpdate(command.data);
				break;
			case "gateway-failed":
				this.post({
					type: "error",
					error: {
						name: "Error",
						message: "Discord main gateway could not send voice signalling."
					}
				});
				this.adapter?.destroy();
				this.stop();
				break;
			case "stop":
				this.stop();
				break;
			case "continuous-port": {
				const lane = new DiscordContinuousOutput({
					id: command.id,
					enabled: command.enabled,
					port: command.port,
					state: new Int32Array(command.state),
					clock: new BigInt64Array(command.clock),
					player: this.roomPlayer,
					post: this.post,
					logContext: "guild=" + this.options.guildId + " channel=" + this.options.channelId
				});
				this.continuous.set(command.id, lane);
				command.port.once("close", () => this.continuous.delete(command.id));
				break;
			}
			case "continuous-activate":
				this.continuous.get(command.id)?.activate();
				break;
			case "continuous-clear":
				this.continuous.get(command.id)?.clear();
				break;
			case "continuous-flush":
				this.continuous.get(command.id)?.flush(command.marker);
				break;
			case "continuous-close":
				this.continuous.get(command.id)?.close();
				this.continuous.delete(command.id);
				break;
			case "capture":
				this.track(this.capture(command.id, command.userId, command.recordingEpoch));
				break;
			case "capture-stop": {
				const capture = this.captures.get(command.id);
				if (capture) this.stopCapture(capture);
				break;
			}
			case "capture-ack": {
				const capture = this.captures.get(command.id);
				if (capture) {
					capture.pendingPackets = Math.max(0, capture.pendingPackets - 1);
					capture.pendingBytes = Math.max(0, capture.pendingBytes - command.bytes);
				}
				break;
			}
			case "passthrough":
				this.enablePassthrough(command.reason, command.expirySeconds);
				break;
			case "output-create": {
				const output = new DiscordRealtimeOutput({
					player: this.roomPlayer,
					clock: new BigInt64Array(command.clock),
					logContext: "guild=" + this.options.guildId + " channel=" + this.options.channelId,
					continuous: command.continuous,
					onStart: () => this.post({
						type: "output-start",
						id: command.id
					}),
					onClose: (_output, reason) => {
						this.outputs.delete(command.id);
						queueMicrotask(() => this.post({
							type: "output-close",
							id: command.id,
							reason
						}));
					},
					onError: (error) => this.post({
						type: "output-error",
						id: command.id,
						error: serializeDiscordAudioError(error)
					})
				});
				this.outputs.set(command.id, output);
				break;
			}
			case "output-audio":
				this.outputs.get(command.id)?.appendAdmitted(Buffer.from(command.audio), command.audible);
				break;
			case "output-mark":
				this.outputs.get(command.id)?.markPlayback(() => this.post({
					type: "output-mark",
					id: command.id,
					markId: command.markId
				}));
				break;
			case "output-finish":
				this.outputs.get(command.id)?.finish(command.reason, command.playBuffered);
				break;
			case "output-close":
				this.outputs.get(command.id)?.close(command.reason);
				break;
			case "output-hold":
				this.roomPlayer.hold(command.hold);
				break;
			case "output-shutdown":
				this.retireOutputs();
				break;
			case "player-stop":
				this.fileAbort?.abort();
				this.player.stop(true);
				break;
			case "file-play":
				this.track(this.playFile(command.id, command.path));
				break;
			case "stream-play": {
				const stream = new PassThrough();
				this.fileInput = {
					id: command.id,
					stream
				};
				this.track(this.playFile(command.id, stream));
				break;
			}
			case "stream-chunk":
				if (this.fileInput?.id !== command.id) break;
				if (this.fileInput.stream.write(Buffer.from(command.audio))) this.post({
					type: "stream-drain",
					id: command.id
				});
				else this.fileInput.stream.once("drain", () => this.post({
					type: "stream-drain",
					id: command.id
				}));
				break;
			case "stream-end": if (this.fileInput?.id === command.id) this.fileInput.stream.end();
		}
	}
	retireOutputs() {
		this.roomPlayer.transition(() => {
			for (const lane of this.continuous.values()) lane.close();
			this.continuous.clear();
			const retiring = [...this.outputs.values()];
			for (const output of retiring) output.close("session-close");
		});
	}
	async recoverConnection(connection) {
		const recovery = new AbortController();
		const signal = AbortSignal.any([
			this.stopAbort.signal,
			recovery.signal,
			AbortSignal.timeout(this.options.reconnectGraceMs)
		]);
		try {
			await Promise.race([this.sdk.entersState(connection, this.sdk.VoiceConnectionStatus.Signalling, signal), this.sdk.entersState(connection, this.sdk.VoiceConnectionStatus.Connecting, signal)]);
		} catch (error) {
			if (!this.stopped) {
				this.post({
					type: "error",
					error: serializeDiscordAudioError(error)
				});
				await this.stop();
			}
		} finally {
			recovery.abort();
		}
	}
	enablePassthrough(reason, expirySeconds) {
		if (!this.connection) return;
		enableDaveReceivePassthrough({
			target: {
				guildId: this.options.guildId,
				channelId: this.options.channelId,
				connection: this.connection
			},
			sdk: this.sdk,
			reason,
			expirySeconds,
			onVerbose: (message) => this.post({
				type: "log",
				level: "verbose",
				message
			}),
			onWarn: (message) => this.post({
				type: "log",
				level: "warn",
				message
			})
		});
	}
	stopCapture(capture) {
		if (capture.closed) return;
		capture.closed = true;
		clearTimeout(capture.timer);
		if (!capture.stream.destroyed) capture.stream.destroy();
	}
	finalizeLater(id, capture) {
		clearTimeout(capture.timer);
		capture.timer = setTimeout(() => {
			if (this.captures.get(id) === capture) this.stopCapture(capture);
		}, this.options.captureSilenceGraceMs);
	}
	async capture(id, userId, recordingEpoch) {
		const connection = this.connection;
		if (!connection || this.captures.has(id)) return;
		const stream = connection.receiver.subscribe(userId, { end: { behavior: this.sdk.EndBehaviorType.Manual } });
		const capture = {
			userId,
			stream,
			pendingPackets: 0,
			pendingBytes: 0,
			closed: false
		};
		this.captures.set(id, capture);
		const input = new PassThrough({ objectMode: true });
		const recordingClock = new BigInt64Array(recordingEpoch);
		const receipts = /* @__PURE__ */ new WeakMap();
		let failed = false;
		let abortReported = false;
		let decodedFrames = 0;
		const onError = (error) => {
			if (failed) return;
			const analysis = analyzeVoiceReceiveError(error);
			if (analysis.isAbortLike && !analysis.countsAsDecryptFailure) {
				if (!abortReported) this.post({
					type: "capture-error",
					id,
					error: serializeDiscordAudioError(error)
				});
				abortReported = true;
				return;
			}
			failed = true;
			let recovery = "not-attempted";
			if (analysis.shouldAttemptPassthrough) {
				recovery = recoverDaveZeroTransition({
					target: {
						guildId: this.options.guildId,
						channelId: this.options.channelId,
						connection
					},
					sdk: this.sdk,
					onWarn: (message) => this.post({
						type: "log",
						level: "warn",
						message
					})
				});
				if (recovery !== "failed") this.enablePassthrough("receive decrypt error", 15);
			}
			this.post({
				type: "capture-error",
				id,
				error: {
					...serializeDiscordAudioError(error),
					...recovery === "failed" ? { daveRecoveryFailed: true } : {}
				}
			});
		};
		const accept = (packet) => {
			if (failed || capture.closed || !packet.length) return;
			if (capture.pendingPackets >= MAX_CAPTURE_PACKETS || capture.pendingBytes + packet.length > MAX_CAPTURE_BYTES) {
				onError(/* @__PURE__ */ new Error("Discord voice receive backlog exceeded; try speaking again."));
				this.stopCapture(capture);
				input.destroy();
				return;
			}
			capture.pendingPackets += 1;
			capture.pendingBytes += packet.length;
			const owned = Buffer.from(packet);
			receipts.set(owned, {
				receivedAt: Date.now(),
				recordingEpoch: Atomics.load(recordingClock, 0)
			});
			input.write(owned);
		};
		const end = () => input.end();
		const finalized = () => {
			clearTimeout(capture.timer);
			capture.closed = true;
			this.post({
				type: "capture-finalized",
				id
			});
			input.end();
		};
		stream.on("data", accept);
		stream.on("end", end);
		stream.once("close", finalized);
		stream.on("error", onError);
		if (!connection.receiver.speaking.users.has(userId)) this.finalizeLater(id, capture);
		try {
			await decodeOpusStreamChunks(input, {
				onChunk: async (pcm, packet) => {
					const receipt = receipts.get(packet);
					if (!failed && receipt) this.post({
						type: "capture-frame",
						id,
						frame: {
							pcm,
							packet,
							...receipt
						}
					});
					if (++decodedFrames % 8 === 0) await new Promise((resolve) => {
						setImmediate(resolve);
					});
				},
				onError,
				onVerbose: (message) => this.post({
					type: "log",
					level: "verbose",
					message
				}),
				onWarn: (message) => this.post({
					type: "log",
					level: "warn",
					message
				})
			});
		} finally {
			clearTimeout(capture.timer);
			this.captures.delete(id);
			stream.off("data", accept);
			stream.off("end", end);
			stream.off("error", onError);
			this.stopCapture(capture);
			input.destroy();
			this.post({
				type: "capture-end",
				id
			});
		}
	}
	async playFile(id, input) {
		const abort = new AbortController();
		this.fileAbort?.abort();
		this.fileAbort = abort;
		let error;
		const onError = (cause) => {
			error = serializeDiscordAudioError(cause);
			abort.abort();
		};
		let playbackStarted = false;
		const onIdle = () => {
			if (!playbackStarted) abort.abort();
		};
		this.player.on("error", onError);
		this.player.on(this.sdk.AudioPlayerStatus.Idle, onIdle);
		try {
			this.player.play(this.sdk.createAudioResource(createDiscordOpusPlaybackStream(input), { inputType: this.sdk.StreamType.Opus }));
			await this.sdk.entersState(this.player, this.sdk.AudioPlayerStatus.Playing, AbortSignal.any([AbortSignal.timeout(PLAYBACK_READY_TIMEOUT_MS), abort.signal]));
			playbackStarted = true;
			await this.sdk.entersState(this.player, this.sdk.AudioPlayerStatus.Idle, abort.signal);
		} catch (cause) {
			error ??= serializeDiscordAudioError(cause);
		} finally {
			this.player.off("error", onError);
			this.player.off(this.sdk.AudioPlayerStatus.Idle, onIdle);
			if (this.fileAbort === abort) this.fileAbort = void 0;
			if (this.fileInput?.id === id) {
				this.fileInput.stream.destroy();
				this.fileInput = void 0;
			}
			this.post({
				type: "file-end",
				id,
				...error ? { error } : {}
			});
		}
	}
	track(task) {
		this.tasks.add(task);
		task.catch((error) => this.post({
			type: "error",
			error: serializeDiscordAudioError(error)
		})).finally(() => this.tasks.delete(task));
	}
	async stop() {
		if (this.stopped) return;
		this.stopped = true;
		this.stopAbort.abort();
		this.post({
			type: "connection",
			status: this.sdk.VoiceConnectionStatus.Destroyed
		});
		this.retireOutputs();
		this.roomPlayer.close();
		this.fileAbort?.abort();
		this.fileInput?.stream.destroy();
		for (const capture of this.captures.values()) this.stopCapture(capture);
		const connection = this.connection;
		connection?.receiver.speaking.off("start", this.onSpeakingStart);
		connection?.receiver.speaking.off("end", this.onSpeakingEnd);
		connection?.off(this.sdk.VoiceConnectionStatus.Disconnected, this.onDisconnected);
		connection?.off(this.sdk.VoiceConnectionStatus.Destroyed, this.onDestroyed);
		this.player.off("error", this.onPlayerError);
		if (connection && connection.state.status !== this.sdk.VoiceConnectionStatus.Destroyed) connection.destroy();
		this.post({ type: "gateway-destroy" });
		await Promise.allSettled(this.tasks);
		this.post({ type: "stopped" });
	}
};
//#endregion
//#region extensions/discord/src/voice/audio-worker.runtime.ts
const port = parentPort;
if (!port) throw new Error("Discord audio runtime requires a worker MessagePort.");
const media = new DiscordAudioWorker(workerData, (event) => {
	port.postMessage(event);
	if (event.type === "stopped") port.close();
});
port.on("message", (command) => {
	try {
		media.receive(command);
	} catch (error) {
		port.postMessage({
			type: "error",
			error: serializeDiscordAudioError(error)
		});
		media.stop();
	}
});
port.on("close", () => {
	media.stop();
});
media.connect().catch((error) => {
	port.postMessage({
		type: "error",
		error: serializeDiscordAudioError(error)
	});
	media.stop();
});
//#endregion
export {};
