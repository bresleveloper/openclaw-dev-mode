import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { c as createXaiImageGenerationProviderMetadata, d as createXaiRealtimeVoiceProviderMetadata, f as createXaiVideoGenerationProviderMetadata, l as createXaiMediaUnderstandingProviderMetadata, m as normalizeXaiRealtimeTranscriptionProviderConfig, u as createXaiRealtimeTranscriptionProviderMetadata } from "./capability-provider-metadata-factory-CGFzChAW.mjs";
import { t as createLazyXaiRealtimeVoiceBridge } from "./realtime-voice-lazy-BXQ4I33l.mjs";
import { n as createXaiSpeechProviderMetadata } from "./speech-provider-metadata-factory-UbZbU00a.mjs";
//#region extensions/xai/lazy-capability-provider-factories.ts
const MAX_LAZY_REALTIME_TRANSCRIPTION_AUDIO_BYTES = 2097152;
const loadXaiImageGenerationProvider = createLazyRuntimeModule(async () => (await import("./extensions/xai/image-generation-provider.js")).buildXaiImageGenerationProvider());
const loadXaiMediaUnderstandingProvider = createLazyRuntimeModule(async () => (await import("./extensions/xai/stt.js")).buildXaiMediaUnderstandingProvider());
const loadXaiSpeechProvider = createLazyRuntimeModule(async () => (await import("./extensions/xai/speech-provider.js")).buildXaiSpeechProvider());
const loadXaiVideoGenerationProvider = createLazyRuntimeModule(async () => (await import("./extensions/xai/video-generation-provider.js")).buildXaiVideoGenerationProvider());
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
function createLazyXaiImageGenerationProvider() {
	return {
		...createXaiImageGenerationProviderMetadata(),
		generateImage: async (req) => (await loadXaiImageGenerationProvider()).generateImage(req)
	};
}
function createLazyXaiMediaUnderstandingProvider() {
	return {
		...createXaiMediaUnderstandingProviderMetadata(),
		transcribeAudio: async (req) => {
			const provider = await loadXaiMediaUnderstandingProvider();
			if (!provider.transcribeAudio) throw new Error("xAI media understanding provider missing transcribeAudio");
			return await provider.transcribeAudio(req);
		}
	};
}
function createLazyXaiVideoGenerationProvider(context) {
	return {
		...createXaiVideoGenerationProviderMetadata(context),
		generateVideo: async (req) => (await loadXaiVideoGenerationProvider()).generateVideo(req)
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
	const loadProvider = createLazyRuntimeModule(async () => (await import("./extensions/xai/realtime-transcription-provider-factory.js")).buildXaiRealtimeTranscriptionProvider(context));
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
export { createLazyXaiSpeechProvider as a, createLazyXaiRealtimeVoiceProvider as i, createLazyXaiMediaUnderstandingProvider as n, createLazyXaiVideoGenerationProvider as o, createLazyXaiRealtimeTranscriptionProvider as r, createLazyXaiImageGenerationProvider as t };
