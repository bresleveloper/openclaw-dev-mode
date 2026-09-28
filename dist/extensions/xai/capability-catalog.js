import { D as serializeXaiRealtimeToolResult, d as createXaiRealtimeVoiceProviderMetadata, m as normalizeXaiRealtimeTranscriptionProviderConfig, s as assertXaiRealtimeVoiceRequestSupported, u as createXaiRealtimeTranscriptionProviderMetadata } from "./.setup/capability-provider-metadata-factory-VkSZouOh.mjs";
import { n as createXaiSpeechProviderMetadata } from "./.setup/speech-provider-metadata-factory-D8wVBGbN.mjs";
import { createLazyRuntimeModule } from "openclaw/plugin-sdk/lazy-runtime";
import { createRealtimeVoiceAudioQueue } from "openclaw/plugin-sdk/realtime-voice-audio-queue";
import { createLazyRealtimeVoiceBridgeLifecycle } from "openclaw/plugin-sdk/realtime-voice-provider";
//#region extensions/xai/realtime-voice-lazy.ts
const MAX_LAZY_REALTIME_VOICE_USER_MESSAGES = 128;
const MAX_LAZY_REALTIME_VOICE_USER_MESSAGE_BYTES = 262144;
const MAX_LAZY_REALTIME_VOICE_TOOL_RESULTS = 128;
const MAX_LAZY_REALTIME_VOICE_TOOL_RESULT_BYTES = 262144;
const loadXaiRealtimeVoiceProvider = createLazyRuntimeModule(async () => (await import("./.setup/realtime-voice-provider-CBr1zGV2.mjs")).buildXaiRealtimeVoiceProvider());
function createLazyXaiRealtimeVoiceBridge(req) {
	assertXaiRealtimeVoiceRequestSupported(req);
	let acceptsInput = false;
	let pendingMediaTimestamp;
	let pendingGreeting;
	let pendingUserMessageCount = 0;
	let pendingUserMessageBytes = 0;
	let pendingToolResultCount = 0;
	let pendingToolResultBytes = 0;
	const pendingAudio = createRealtimeVoiceAudioQueue("reject-newest");
	const pendingOperations = [];
	const lifecycle = createLazyRealtimeVoiceBridgeLifecycle({
		label: "xAI",
		request: req,
		load: async (request) => (await loadXaiRealtimeVoiceProvider()).createBridge(request),
		clearPending: () => {
			acceptsInput = false;
			pendingAudio.clear();
			pendingOperations.length = 0;
			pendingMediaTimestamp = void 0;
			pendingGreeting = void 0;
			pendingUserMessageCount = 0;
			pendingUserMessageBytes = 0;
			pendingToolResultCount = 0;
			pendingToolResultBytes = 0;
		},
		onConnected: (bridge, isCurrent) => flushPendingInput(bridge, isCurrent)
	});
	const replacePendingOperation = (previous, next) => {
		if (previous) {
			const previousIndex = pendingOperations.indexOf(previous);
			if (previousIndex >= 0) pendingOperations.splice(previousIndex, 1);
		}
		pendingOperations.push(next);
		return next;
	};
	const flushPendingInput = async (loadedBridge, isCurrent) => {
		if (!isCurrent()) return;
		while (true) {
			if (!isCurrent()) return;
			const operation = pendingOperations.shift();
			if (!operation) {
				acceptsInput = true;
				return;
			}
			switch (operation.type) {
				case "audio": {
					const chunk = pendingAudio.dequeue();
					if (!chunk) throw new Error("xAI realtime voice pending audio queue invariant violated");
					loadedBridge.sendAudio(chunk);
					break;
				}
				case "media-timestamp":
					if (pendingMediaTimestamp === operation) pendingMediaTimestamp = void 0;
					loadedBridge.setMediaTimestamp(operation.timestamp);
					break;
				case "user-message":
					loadedBridge.sendUserMessage?.(operation.text);
					break;
				case "tool-result":
					await loadedBridge.submitToolResult(operation.callId, operation.result, operation.options);
					break;
				case "greeting":
					if (pendingGreeting === operation) pendingGreeting = void 0;
					loadedBridge.triggerGreeting?.(operation.instructions);
			}
			if (!isCurrent()) return;
			if (operation.type === "user-message") {
				pendingUserMessageCount -= 1;
				pendingUserMessageBytes -= operation.bytes;
			} else if (operation.type === "tool-result") {
				pendingToolResultCount -= 1;
				pendingToolResultBytes -= operation.bytes;
			}
		}
	};
	return {
		get supportsToolResultContinuation() {
			return lifecycle.bridge?.supportsToolResultContinuation ?? false;
		},
		connect: lifecycle.connect,
		sendAudio: (audio) => {
			if (!lifecycle.isActive()) return;
			const bridge = lifecycle.bridge;
			if (acceptsInput && bridge) {
				bridge.sendAudio(audio);
				return;
			}
			if (pendingAudio.enqueue(audio)) pendingOperations.push({ type: "audio" });
		},
		setMediaTimestamp: (timestamp) => {
			if (!lifecycle.isActive()) return;
			const bridge = lifecycle.bridge;
			if (acceptsInput && bridge) {
				bridge.setMediaTimestamp(timestamp);
				return;
			}
			pendingMediaTimestamp = replacePendingOperation(pendingMediaTimestamp, {
				timestamp,
				type: "media-timestamp"
			});
		},
		sendUserMessage: (text) => {
			if (!lifecycle.isActive()) return;
			const bridge = lifecycle.bridge;
			if (acceptsInput && bridge) {
				bridge.sendUserMessage?.(text);
				return;
			}
			const messageBytes = Buffer.byteLength(text, "utf8");
			if (pendingUserMessageCount >= MAX_LAZY_REALTIME_VOICE_USER_MESSAGES || pendingUserMessageBytes + messageBytes > MAX_LAZY_REALTIME_VOICE_USER_MESSAGE_BYTES) {
				req.onError?.(/* @__PURE__ */ new Error("xAI realtime voice pending user message overflow during lazy startup"));
				return;
			}
			pendingOperations.push({
				bytes: messageBytes,
				text,
				type: "user-message"
			});
			pendingUserMessageCount += 1;
			pendingUserMessageBytes += messageBytes;
		},
		triggerGreeting: (instructions) => {
			if (!lifecycle.isActive()) return;
			const bridge = lifecycle.bridge;
			if (acceptsInput && bridge) {
				bridge.triggerGreeting?.(instructions);
				return;
			}
			pendingGreeting = replacePendingOperation(pendingGreeting, {
				instructions,
				type: "greeting"
			});
		},
		handleBargeIn: (options) => {
			if (lifecycle.isActive()) lifecycle.bridge?.handleBargeIn?.(options);
		},
		submitToolResult: (callId, result, options) => {
			if (!lifecycle.isActive() || options?.willContinue === true) return;
			const bridge = lifecycle.bridge;
			if (acceptsInput && bridge) return bridge.submitToolResult(callId, result, options);
			let serialized;
			try {
				serialized = serializeXaiRealtimeToolResult(result);
			} catch (error) {
				req.onError?.(error);
				throw error;
			}
			const pending = {
				callId,
				result: JSON.parse(serialized),
				...options ? { options } : {}
			};
			const resultBytes = Buffer.byteLength(JSON.stringify(pending), "utf8");
			if (pendingToolResultCount >= MAX_LAZY_REALTIME_VOICE_TOOL_RESULTS || pendingToolResultBytes + resultBytes > MAX_LAZY_REALTIME_VOICE_TOOL_RESULT_BYTES) {
				const error = /* @__PURE__ */ new Error("xAI realtime voice pending tool result overflow during lazy startup");
				req.onError?.(error);
				throw error;
			}
			pendingOperations.push({
				...pending,
				bytes: resultBytes,
				type: "tool-result"
			});
			pendingToolResultCount += 1;
			pendingToolResultBytes += resultBytes;
		},
		acknowledgeMark: (markName) => {
			if (lifecycle.isActive()) lifecycle.bridge?.acknowledgeMark(markName);
		},
		close: lifecycle.close,
		isConnected: () => lifecycle.isActive() && (lifecycle.bridge?.isConnected() ?? false)
	};
}
//#endregion
//#region extensions/xai/lazy-capability-provider-factories.ts
const MAX_LAZY_REALTIME_TRANSCRIPTION_AUDIO_BYTES = 2097152;
createLazyRuntimeModule(async () => (await import("./.setup/image-generation-provider-CXwoIarx.mjs")).buildXaiImageGenerationProvider());
createLazyRuntimeModule(async () => (await import("./.setup/stt-Ch4Gl8So.mjs")).buildXaiMediaUnderstandingProvider());
const loadXaiSpeechProvider = createLazyRuntimeModule(async () => (await import("./.setup/speech-provider-DPWxWWd7.mjs")).buildXaiSpeechProvider());
createLazyRuntimeModule(async () => (await import("./.setup/video-generation-provider-iNIZbEz8.mjs")).buildXaiVideoGenerationProvider());
function createPendingTranscriptionAudioQueue() {
	let chunks = [];
	let head = 0;
	let bytes = 0;
	const clear = () => {
		chunks = [];
		head = 0;
		bytes = 0;
	};
	return {
		clear,
		drain: () => {
			const pending = chunks.slice(head).filter((chunk) => chunk !== void 0);
			clear();
			return pending;
		},
		enqueue: (audio) => {
			if (audio.byteLength > MAX_LAZY_REALTIME_TRANSCRIPTION_AUDIO_BYTES) return;
			const chunk = Buffer.from(audio);
			chunks.push(chunk);
			bytes += chunk.byteLength;
			while (bytes > MAX_LAZY_REALTIME_TRANSCRIPTION_AUDIO_BYTES && head < chunks.length) {
				const dropped = chunks[head];
				chunks[head] = void 0;
				head += 1;
				bytes -= dropped?.byteLength ?? 0;
			}
			if (head > 256 && head * 2 >= chunks.length) {
				chunks = chunks.slice(head);
				head = 0;
			}
		}
	};
}
function createLazyXaiRealtimeTranscriptionSession(req, loadXaiRealtimeTranscriptionProvider) {
	let session;
	let sessionPromise;
	let activeConnect;
	let generation = 0;
	let closedSessionGeneration;
	let closed = false;
	let acceptsInput = false;
	const pendingAudio = createPendingTranscriptionAudioQueue();
	const closeSession = (closeGeneration, loadedSession = session) => {
		if (!loadedSession || closedSessionGeneration === closeGeneration) return;
		closedSessionGeneration = closeGeneration;
		loadedSession.close();
	};
	const loadSession = async () => {
		if (!sessionPromise) sessionPromise = loadXaiRealtimeTranscriptionProvider().then((provider) => provider.createSession(req));
		session = await sessionPromise;
		return session;
	};
	return {
		connect: async () => {
			if (closed) {
				generation += 1;
				closed = false;
			}
			const connectGeneration = generation;
			if (activeConnect?.generation === connectGeneration) {
				await activeConnect.promise;
				return;
			}
			const promise = (async () => {
				const loadedSession = await loadSession();
				if (connectGeneration !== generation || closed) {
					if (connectGeneration === generation && closed) closeSession(connectGeneration, loadedSession);
					return;
				}
				const providerConnect = loadedSession.connect();
				for (const audio of pendingAudio.drain()) loadedSession.sendAudio(audio);
				acceptsInput = true;
				await providerConnect;
				if (connectGeneration === generation && closed) closeSession(connectGeneration, loadedSession);
			})();
			const connectTask = {
				generation: connectGeneration,
				promise
			};
			activeConnect = connectTask;
			try {
				await promise;
			} finally {
				if (activeConnect === connectTask) activeConnect = void 0;
			}
		},
		sendAudio: (audio) => {
			if (closed) return;
			if (acceptsInput && session) {
				session.sendAudio(audio);
				return;
			}
			pendingAudio.enqueue(audio);
		},
		close: () => {
			if (closed) return;
			closed = true;
			acceptsInput = false;
			pendingAudio.clear();
			closeSession(generation);
		},
		isConnected: () => !closed && (session?.isConnected() ?? false)
	};
}
function createLazyXaiSpeechProvider(context) {
	return {
		...createXaiSpeechProviderMetadata(context),
		listVoices: async (req) => {
			const provider = await loadXaiSpeechProvider();
			if (!provider.listVoices) throw new Error("xAI speech provider missing listVoices");
			return await provider.listVoices(req);
		},
		synthesize: async (req) => await (await loadXaiSpeechProvider()).synthesize(req),
		streamSynthesize: async (req) => {
			const provider = await loadXaiSpeechProvider();
			if (!provider.streamSynthesize) throw new Error("xAI speech provider missing streamSynthesize");
			return await provider.streamSynthesize(req);
		},
		synthesizeTelephony: async (req) => {
			const provider = await loadXaiSpeechProvider();
			if (!provider.synthesizeTelephony) throw new Error("xAI speech provider missing synthesizeTelephony");
			return await provider.synthesizeTelephony(req);
		}
	};
}
function createLazyXaiRealtimeTranscriptionProvider(context) {
	const loadProvider = createLazyRuntimeModule(async () => (await import("./.setup/realtime-transcription-provider-factory-BZjLjURr.mjs")).buildXaiRealtimeTranscriptionProvider(context));
	return {
		...createXaiRealtimeTranscriptionProviderMetadata(context),
		createSession: (req) => {
			normalizeXaiRealtimeTranscriptionProviderConfig(req.providerConfig);
			return createLazyXaiRealtimeTranscriptionSession(req, loadProvider);
		}
	};
}
function createLazyXaiRealtimeVoiceProvider(context) {
	return {
		...createXaiRealtimeVoiceProviderMetadata(context),
		createBridge: createLazyXaiRealtimeVoiceBridge
	};
}
//#endregion
//#region extensions/xai/capability-catalog.ts
const catalog = (context) => ({
	speechProviders: [createLazyXaiSpeechProvider(context)],
	realtimeTranscriptionProviders: [createLazyXaiRealtimeTranscriptionProvider(context)],
	realtimeVoiceProviders: [createLazyXaiRealtimeVoiceProvider(context)]
});
//#endregion
export { catalog as default };
