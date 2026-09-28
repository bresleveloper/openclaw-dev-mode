import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { n as createRealtimeVoiceAudioQueue } from "./realtime-session-lifecycle-CJCE-3t7.mjs";
import { t as createLazyRealtimeVoiceBridgeLifecycle } from "./realtime-voice-provider-C3SkPdAW.mjs";
import { y as serializeXaiRealtimeToolResult } from "./realtime-voice-config-BZr_Tp5F.mjs";
import { s as assertXaiRealtimeVoiceRequestSupported } from "./capability-provider-metadata-factory-CGFzChAW.mjs";
//#region extensions/xai/realtime-voice-lazy.ts
const MAX_LAZY_REALTIME_VOICE_USER_MESSAGES = 128;
const MAX_LAZY_REALTIME_VOICE_USER_MESSAGE_BYTES = 262144;
const MAX_LAZY_REALTIME_VOICE_TOOL_RESULTS = 128;
const MAX_LAZY_REALTIME_VOICE_TOOL_RESULT_BYTES = 262144;
const loadXaiRealtimeVoiceProvider = createLazyRuntimeModule(async () => (await import("./extensions/xai/realtime-voice-provider.js")).buildXaiRealtimeVoiceProvider());
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
export { createLazyXaiRealtimeVoiceBridge as t };
