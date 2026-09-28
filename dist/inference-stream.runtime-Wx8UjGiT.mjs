import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./worker-protocol-primitives-vA8IesMt.mjs";
import { n as invalidateComputerFrameIfMissing } from "./computer-tool-Df399oiF.mjs";
import { t as event_stream_exports } from "./event-stream-xGBL9CyU.mjs";
import { i as isWorkerTranscriptMessageFrameSafe, t as WORKER_PROVIDER_REPLAY_LOCAL_RETRY_MESSAGE } from "./transcript-message-D33QMqiJ.mjs";
import { t as fitWorkerReplayImages } from "./replay-message-window-Bl3QzLEm.mjs";
import { createToolArgumentPreviewSchedule, parseStreamingJson, parseTerminalToolCallArguments } from "@openclaw/ai/internal/runtime";
//#region src/worker/inference-stream.runtime.ts
function emptyAssistantMessage(modelRef) {
	return {
		role: "assistant",
		content: [],
		api: "openai-responses",
		provider: modelRef.provider,
		model: modelRef.model,
		stopReason: "stop",
		usage: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0,
			totalTokens: 0,
			cost: {
				input: 0,
				output: 0,
				cacheRead: 0,
				cacheWrite: 0,
				total: 0
			}
		},
		timestamp: Date.now()
	};
}
function processInferenceEvent(payload, partial, toolArgumentPreviewSchedules, tolerateMissingState) {
	const event = payload.event;
	switch (event.type) {
		case "start":
			partial.api = event.resolvedModel.api;
			partial.provider = event.resolvedModel.provider;
			partial.model = event.resolvedModel.model;
			partial.timestamp = event.timestamp;
			return {
				type: "start",
				partial
			};
		case "text_start":
			partial.content[event.contentIndex] = {
				type: "text",
				text: "",
				...event.contentSignature === void 0 ? {} : { textSignature: event.contentSignature }
			};
			return {
				type: "text_start",
				contentIndex: event.contentIndex,
				partial
			};
		case "text_delta": {
			const content = partial.content[event.contentIndex];
			if (content?.type !== "text") {
				if (tolerateMissingState) return;
				throw new Error("worker inference text delta has no active text block");
			}
			content.text += event.delta;
			return {
				type: "text_delta",
				contentIndex: event.contentIndex,
				delta: event.delta,
				partial
			};
		}
		case "text_end": {
			const content = partial.content[event.contentIndex];
			if (content?.type !== "text") {
				if (tolerateMissingState) return;
				throw new Error("worker inference text end has no active text block");
			}
			if (event.contentSignature !== void 0) content.textSignature = event.contentSignature;
			return {
				type: "text_end",
				contentIndex: event.contentIndex,
				content: content.text,
				partial
			};
		}
		case "thinking_start":
			partial.content[event.contentIndex] = {
				type: "thinking",
				thinking: ""
			};
			return {
				type: "thinking_start",
				contentIndex: event.contentIndex,
				partial
			};
		case "thinking_delta": {
			const content = partial.content[event.contentIndex];
			if (content?.type !== "thinking") {
				if (tolerateMissingState) return;
				throw new Error("worker inference thinking delta has no active thinking block");
			}
			content.thinking += event.delta;
			return {
				type: "thinking_delta",
				contentIndex: event.contentIndex,
				delta: event.delta,
				partial
			};
		}
		case "thinking_end": {
			const content = partial.content[event.contentIndex];
			if (content?.type !== "thinking") {
				if (tolerateMissingState) return;
				throw new Error("worker inference thinking end has no active thinking block");
			}
			if (event.contentSignature !== void 0) content.thinkingSignature = event.contentSignature;
			return {
				type: "thinking_end",
				contentIndex: event.contentIndex,
				content: content.thinking,
				partial
			};
		}
		case "toolcall_start": {
			const content = {
				type: "toolCall",
				id: event.id,
				name: event.toolName,
				arguments: {},
				partialJson: ""
			};
			partial.content[event.contentIndex] = content;
			toolArgumentPreviewSchedules.set(event.contentIndex, createToolArgumentPreviewSchedule());
			return {
				type: "toolcall_start",
				contentIndex: event.contentIndex,
				partial
			};
		}
		case "toolcall_delta": {
			const content = partial.content[event.contentIndex];
			if (content?.type !== "toolCall") {
				if (tolerateMissingState) return;
				throw new Error("worker inference tool delta has no active tool call");
			}
			const streaming = content;
			streaming.partialJson += event.delta;
			const previewSchedule = toolArgumentPreviewSchedules.get(event.contentIndex);
			if (!previewSchedule) throw new Error("worker inference tool delta has no preview schedule");
			if (previewSchedule(streaming.partialJson.length)) content.arguments = parseStreamingJson(streaming.partialJson);
			return {
				type: "toolcall_delta",
				contentIndex: event.contentIndex,
				delta: event.delta,
				partial
			};
		}
		case "toolcall_end": {
			const content = partial.content[event.contentIndex];
			if (content?.type !== "toolCall") {
				if (tolerateMissingState) return;
				throw new Error("worker inference tool end has no active tool call");
			}
			content.arguments = parseTerminalToolCallArguments(content.partialJson);
			toolArgumentPreviewSchedules.delete(event.contentIndex);
			delete content.partialJson;
			return {
				type: "toolcall_end",
				contentIndex: event.contentIndex,
				toolCall: content,
				partial
			};
		}
	}
}
function transcriptSafeErrorMessage(modelRef, message) {
	if (isWorkerTranscriptMessageFrameSafe(message)) return message;
	const replacement = emptyAssistantMessage(modelRef);
	replacement.api = message.api;
	replacement.provider = message.provider;
	replacement.model = message.model;
	replacement.timestamp = message.timestamp;
	replacement.stopReason = message.stopReason === "aborted" ? "aborted" : "error";
	replacement.errorMessage = truncateUtf16Safe(message.errorMessage ?? "Worker inference result exceeds the transcript message limit.", 256);
	replacement.usage = structuredClone(message.usage);
	return replacement;
}
function createInferenceRequestMeasure(request) {
	const measureFull = (messages) => Buffer.byteLength(JSON.stringify({
		type: "req",
		id: "00000000-0000-4000-8000-000000000000",
		method: "worker.inference.start",
		params: {
			...request,
			context: {
				...request.context,
				messages
			}
		}
	}), "utf8");
	let envelopeBytes = 0;
	let messageBytes;
	return (messages) => {
		if (messages === request.context.messages) return measureFull(messages);
		if (!messageBytes) {
			envelopeBytes = measureFull([]);
			messageBytes = /* @__PURE__ */ new WeakMap();
		}
		let bytes = envelopeBytes + Math.max(0, messages.length - 1);
		for (const message of messages) {
			let size = messageBytes.get(message);
			if (size === void 0) {
				size = Buffer.byteLength(JSON.stringify(message), "utf8");
				messageBytes.set(message, size);
			}
			bytes += size;
		}
		return bytes;
	};
}
function createWorkerInferenceStreamAdapter(adapter) {
	let modelCallSeq = 0;
	return (inferenceRequest) => {
		const stream = (0, event_stream_exports.createAssistantMessageEventStream)();
		const partial = emptyAssistantMessage(adapter.modelRef);
		const toolArgumentPreviewSchedules = /* @__PURE__ */ new Map();
		let streamHasGap = false;
		let settled = false;
		modelCallSeq += 1;
		const turnSuffix = `:${modelCallSeq}`;
		const identity = {
			runEpoch: adapter.runEpoch,
			sessionId: adapter.sessionId,
			runId: adapter.runId,
			turnId: `${adapter.turnId.slice(0, 256 - turnSuffix.length)}${turnSuffix}`
		};
		let request = {
			...identity,
			modelRef: inferenceRequest.modelRef,
			context: structuredClone(inferenceRequest.context),
			options: structuredClone(inferenceRequest.options)
		};
		const finishError = (error, reason, usage) => {
			if (settled) return;
			settled = true;
			partial.stopReason = reason;
			partial.errorMessage = error instanceof Error ? error.message : String(error);
			if (usage) partial.usage = structuredClone(usage);
			stream.push({
				type: "error",
				reason,
				error: transcriptSafeErrorMessage(adapter.modelRef, partial)
			});
			stream.end();
		};
		const fail = (error) => finishError(error, inferenceRequest.signal?.aborted ? "aborted" : "error");
		const abort = () => {
			adapter.client.cancel(identity).catch(() => void 0).finally(() => finishError("Worker inference aborted.", "aborted"));
		};
		if (inferenceRequest.signal?.aborted) {
			finishError("Worker inference aborted before start.", "aborted");
			return stream;
		}
		try {
			const messages = fitWorkerReplayImages(request.context.messages, createInferenceRequestMeasure(request), adapter.computerContextEpoch?.frameToolCallId);
			if (!messages) throw new Error(request.context.messages.some((message) => message.role === "assistant" && message.providerReplay !== void 0) ? `${WORKER_PROVIDER_REPLAY_LOCAL_RETRY_MESSAGE} (inference payload limit)` : "Worker inference context exceeds the image transport limit. Use fewer or smaller images in this turn, then retry.");
			request = {
				...request,
				context: {
					...request.context,
					messages
				}
			};
			if (adapter.computerContextEpoch) invalidateComputerFrameIfMissing({
				contextEpoch: adapter.computerContextEpoch,
				messages: messages.filter((message) => message.role === "toolResult")
			});
		} catch (error) {
			fail(error);
			return stream;
		}
		inferenceRequest.signal?.addEventListener("abort", abort, { once: true });
		adapter.client.start(request, {
			onStreamGap: () => {
				streamHasGap = true;
			},
			onEvent: (event) => {
				const projected = processInferenceEvent(event, partial, toolArgumentPreviewSchedules, streamHasGap);
				if (projected) stream.push(projected);
			}
		}).then((outcome) => {
			if (settled) return;
			if (outcome.type === "done") {
				settled = true;
				if (!isWorkerTranscriptMessageFrameSafe(outcome.message)) {
					const message = emptyAssistantMessage(adapter.modelRef);
					message.stopReason = "error";
					message.errorMessage = "Worker inference result exceeds the transcript message limit.";
					message.usage = structuredClone(outcome.message.usage);
					stream.push({
						type: "error",
						reason: "error",
						error: message
					});
					stream.end();
					return;
				}
				const reason = outcome.message.stopReason;
				const message = structuredClone(outcome.message);
				stream.push({
					type: "done",
					reason,
					message
				});
				stream.end();
				return;
			}
			finishError(outcome.message, outcome.reason === "cancelled" ? "aborted" : "error", outcome.usage);
		}).catch(fail).finally(() => {
			inferenceRequest.signal?.removeEventListener("abort", abort);
		});
		return stream;
	};
}
//#endregion
export { createWorkerInferenceStreamAdapter };
