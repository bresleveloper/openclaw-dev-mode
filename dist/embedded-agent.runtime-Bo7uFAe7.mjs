import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as truncateUtf8Prefix } from "./utf8-truncate-_hf7tp13.mjs";
import { _ as readAgentAssistantSource, n as bindAgentAssistantSource } from "./agent-events-Bf3Js0D3.mjs";
import { _ as toAgentStoreSessionKey } from "./session-key-CSDERtm3.mjs";
import { f as hasRuntimeContextMarker, g as readRuntimeContextMetadata, p as isRuntimeContextMessage } from "./types-BXd0kI8-.mjs";
import { a as createNativeModelOwnedRuntimeModel } from "./defaults-Bg930vxE.mjs";
import { l as resolveAssistantMessagePhase } from "./chat-message-content-C-d0FKNG.mjs";
import { l as makeZeroUsageSnapshot } from "./usage-BqbJmOEZ.mjs";
import { a as WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES, t as WORKER_INFERENCE_MAX_CONTEXT_MESSAGES } from "./worker-inference-DQS6vE1x.mjs";
import "./worker-admission-DKoRQV__.mjs";
import { g as wrapToolWithGatewayCallerIdentity } from "./gateway-caller-context-Be176_GV.mjs";
import { a as setPluginToolMeta } from "./tool-metadata-CaNEdKPR.mjs";
import { h as bindBeforeToolCallMetadata, i as copyAgentToolMetadata } from "./agent-tool-metadata-Dj6F-G24.mjs";
import { i as projectSessionEntryMessage } from "./session-BEAHkH3E.mjs";
import { I as appendTextDeltaToAssistantMessage } from "./agent-core-BbGXCiXw.mjs";
import "./src-D3H6pm7W.mjs";
import { u as projectRuntimeContextFragments } from "./internal-runtime-context-DLJtDQoI.mjs";
import { i as jsonUtf8BytesOrInfinity } from "./json-utf8-bytes-C0-PtdPX.mjs";
import { n as recordModelFallbackStop } from "./model-fallback-stop-BtVvqU7l.mjs";
import { i as resolveRuntimeOsLabel } from "./os-summary-DH0HB36b.mjs";
import { t as redactAgentDiagnosticPayload } from "./diagnostic-redaction-CUiZdHHf.mjs";
import { i as toWorkerTranscriptMessage, n as isWorkerTranscriptMessageFrameSafe, o as projectWorkerTextOrImageContent, t as WORKER_PROVIDER_REPLAY_LOCAL_RETRY_MESSAGE } from "./transcript-message-CWBx4ChQ.mjs";
import { l as wrapToolWithBeforeToolCallHook } from "./agent-tools.before-tool-call-CtP0G8Wg.mjs";
import { c as mergeAgentRunAttemptTerminal, l as normalizeAgentRunAttemptTerminal, u as projectAgentRunAttemptTerminal } from "./agent-run-terminal-outcome-D-ijbyA8.mjs";
import { m as listRunningSessions } from "./bash-process-registry-D3AARAgk.mjs";
import { o as getShellConfig, r as detectRuntimeShell } from "./shell-utils-bJwhgbCe.mjs";
import { c as hasModelFallbackStop } from "./failover-error-Bjf0VdY2.mjs";
import { t as ModelRegistry } from "./model-registry-pyM1O0Zs.mjs";
import { t as AuthStorage } from "./auth-storage-DHC97REI.mjs";
import { f as parseReplyDirectives } from "./payloads-CZkv8Yff.mjs";
import { n as wrapToolWithAbortSignal } from "./agent-tools.abort-Vm0F-Le2.mjs";
import { i as projectMemoryFlushTools } from "./core-coding-tools-htyTOKJv.mjs";
import { t as event_stream_exports } from "./event-stream-xGBL9CyU.mjs";
import { a as buildRuntimeContextCustomMessage } from "./runtime-context-prompt-D_5rC-8c.mjs";
import { n as DefaultResourceLoader, t as SettingsManager } from "./settings-manager-D9ggLoN1.mjs";
import { t as SessionManager } from "./session-manager-Mve5HWCW.mjs";
import { n as subscribeEmbeddedAgentSession, o as readSubscriptionCompletionEvidence, p as classifyAssistantTurn, t as createAgentSession, u as resolveSettledToolTerminalContinuationInstruction } from "./sdk-Bxnj3yKa.mjs";
import { r as buildUsageWithNoCost, t as buildAssistantMessage } from "./stream-message-shared-CYuIJ_XF.mjs";
import { n as guardSessionManager, t as buildExecutionHostRuntimeFacts } from "./messages-CZ7XNOd9.mjs";
import { n as completeSystemPromptRuntime } from "./system-prompt-runtime-Cr97vE9M.mjs";
import { s as disposeAllCodeModeRuns } from "./code-mode-state-DchVJb10.mjs";
import { t as createAgentHarnessToolSurfaceRuntimeCore } from "./tool-surface-bridge-DwhzBhjb.mjs";
import { a as toToolDefinitions } from "./agent-tool-definition-adapter-Dgpfhmph.mjs";
import { t as getMachineDisplayName } from "./machine-name-e279gKlh.mjs";
import { r as resolveSystemPromptRepoRoot } from "./system-prompt-params-CL2E6h7b.mjs";
import { t as assertSettledTurnFinalizationResult } from "./settled-turn-finalization-result-DJqqJfy5.mjs";
import { t as materializeSkillResources } from "./resources-B8SeIb4_.mjs";
import { a as createWorkerPlacementTools, i as WORKER_TOOL_CONFIG, r as createWorkerBrowserToolRuntime, t as createWorkerComputerTool } from "./computer-runtime-Bl4eBv75.mjs";
import { n as windowWorkerReplayMessages } from "./replay-message-window-fUQVmnF7.mjs";
import { randomUUID } from "node:crypto";
import os from "node:os";
import path from "node:path";
import { getSupportedThinkingLevels } from "@openclaw/ai/internal/runtime";
//#region src/worker/embedded-agent-live.runtime.ts
const MAX_LIVE_EVENT_BYTES = 32768;
const MAX_LIVE_PREVIEW_BYTES = 4096;
function truncateLiveText(value) {
	if (value.length <= MAX_LIVE_PREVIEW_BYTES && Buffer.byteLength(value, "utf8") <= MAX_LIVE_PREVIEW_BYTES) return value;
	const suffix = "…";
	return `${truncateUtf8Prefix(value, MAX_LIVE_PREVIEW_BYTES - Buffer.byteLength(suffix, "utf8"))}${suffix}`;
}
function boundLiveValue(value) {
	try {
		const serialized = JSON.stringify(value);
		if (serialized === void 0) return null;
		if (Buffer.byteLength(serialized, "utf8") <= MAX_LIVE_PREVIEW_BYTES) return value;
		return {
			truncated: true,
			preview: truncateLiveText(serialized)
		};
	} catch {
		return {
			truncated: true,
			preview: "[unserializable live payload]"
		};
	}
}
function redactLiveText(value) {
	const redacted = redactAgentDiagnosticPayload(value);
	return truncateLiveText(typeof redacted === "string" ? redacted : "[unreadable diagnostic text]");
}
function boundLiveEvent(event) {
	if (!((event.kind === "assistant" || event.kind === "thinking") && event.payload.text.length > MAX_LIVE_EVENT_BYTES) && jsonUtf8BytesOrInfinity(event) <= MAX_LIVE_EVENT_BYTES) return event;
	let bounded;
	if (event.kind === "assistant") {
		const text = truncateLiveText(event.payload.text);
		bounded = {
			kind: "assistant",
			payload: {
				...event.payload,
				text,
				delta: text,
				replace: true
			}
		};
	} else if (event.kind === "thinking") bounded = {
		kind: "thinking",
		payload: {
			...event.payload,
			text: truncateLiveText(event.payload.text),
			delta: truncateLiveText(event.payload.delta)
		}
	};
	else if (event.kind === "tool") bounded = {
		kind: "tool",
		payload: {
			...event.payload,
			...event.payload.phase === "start" ? { args: boundLiveValue(event.payload.args) } : event.payload.phase === "update" ? { partialResult: boundLiveValue(event.payload.partialResult) } : { result: boundLiveValue(event.payload.result) }
		}
	};
	else throw new Error(`worker live ${event.kind} event exceeds the protocol payload limit`);
	if (jsonUtf8BytesOrInfinity(bounded) > MAX_LIVE_EVENT_BYTES) throw new Error(`worker live ${event.kind} event cannot fit the protocol payload limit`);
	return bounded;
}
function readAssistantSnapshot(message) {
	if (message.role !== "assistant") return { text: "" };
	const blocks = message.content.flatMap((part) => part.type === "text" ? [{
		text: part.text,
		phase: resolveAssistantMessagePhase({
			...message,
			content: [part]
		})
	}] : []);
	const firstPhase = blocks[0]?.phase;
	const phase = blocks.every((block) => block.phase === firstPhase) ? firstPhase : void 0;
	return {
		text: blocks.filter((block) => phase === "commentary" || block.phase !== "commentary").map((block) => block.text).join(""),
		phase
	};
}
function readAssistantThinking(message) {
	if (message.role !== "assistant") return "";
	return message.content.filter((part) => part.type === "thinking").map((part) => part.thinking).join("");
}
function createWorkerLiveRuntime(client) {
	let previewEnabled = true;
	const enqueueLive = (event) => {
		if (previewEnabled) previewEnabled = client.enqueuePreview(boundLiveEvent(event));
	};
	const startedAt = Date.now();
	let terminalLiveEvent;
	let terminalOutcome = { kind: "ok" };
	let replayInvalid = false;
	const enqueueTerminal = (input) => {
		terminalOutcome = mergeAgentRunAttemptTerminal(terminalOutcome, normalizeAgentRunAttemptTerminal({
			aborted: input.aborted,
			promptError: input.error
		}));
		const terminal = projectAgentRunAttemptTerminal(terminalOutcome);
		const stopReason = terminal.aborted ? "aborted" : terminal.failed ? "error" : input.stopReason;
		terminalLiveEvent = {
			kind: "lifecycle",
			payload: {
				phase: "finishing",
				startedAt,
				endedAt: Date.now(),
				...stopReason ? { stopReason } : {},
				...terminal.aborted ? { aborted: true } : {},
				...replayInvalid ? { replayInvalid: true } : {},
				...typeof terminal.promptError === "string" ? { error: redactLiveText(terminal.promptError) } : {}
			}
		};
	};
	let streamedText = "";
	let streamedPhase;
	let assistantSource;
	let streamedThinking = "";
	const emitAssistantSnapshot = (message, complete = false) => {
		const { text, phase } = readAssistantSnapshot(message);
		if (complete && !text && message.role === "assistant" && message.stopReason === "aborted") return;
		const mediaUrls = complete ? parseReplyDirectives(text).mediaUrls : void 0;
		if (text === streamedText && phase === streamedPhase && !mediaUrls?.length) return;
		const previousText = streamedPhase === "commentary" && phase !== "commentary" ? "" : streamedText;
		const replace = !text.startsWith(previousText);
		enqueueLive({
			kind: "assistant",
			payload: {
				text,
				delta: replace ? text : text.slice(previousText.length),
				...mediaUrls?.length ? { mediaUrls } : {},
				...replace ? { replace: true } : {},
				...phase ? { phase } : {},
				itemId: readAgentAssistantSource(message)?.itemId
			}
		});
		streamedText = text;
		streamedPhase = phase;
	};
	const handleSessionEvent = (event) => {
		if ((event.type === "message_start" || event.type === "message_update" || event.type === "message_end") && event.message.role === "assistant") {
			if (event.type === "message_start" || !assistantSource) assistantSource = { itemId: randomUUID() };
			bindAgentAssistantSource(event.message, assistantSource);
		}
		if (!previewEnabled && event.type !== "agent_end") return;
		if (event.type === "agent_start") {
			enqueueLive({
				kind: "lifecycle",
				payload: {
					phase: "start",
					startedAt
				}
			});
			return;
		}
		if (event.type === "message_start" && event.message.role === "assistant") {
			streamedText = "";
			streamedPhase = void 0;
			streamedThinking = "";
			return;
		}
		if (event.type === "message_update") {
			if (event.assistantMessageEvent.type === "text_delta" || event.assistantMessageEvent.type === "text_end") emitAssistantSnapshot(event.message);
			else if (event.assistantMessageEvent.type === "thinking_delta") {
				streamedThinking = readAssistantThinking(event.message);
				enqueueLive({
					kind: "thinking",
					payload: {
						text: streamedThinking,
						delta: event.assistantMessageEvent.delta,
						itemId: assistantSource?.itemId
					}
				});
			}
			return;
		}
		if (event.type === "message_end" && event.message.role === "assistant") {
			emitAssistantSnapshot(event.message, true);
			const finalThinking = readAssistantThinking(event.message);
			if (finalThinking !== streamedThinking) enqueueLive({
				kind: "thinking",
				payload: {
					text: finalThinking,
					delta: finalThinking,
					itemId: assistantSource?.itemId
				}
			});
			return;
		}
		if (event.type === "tool_execution_start" || event.type === "tool_execution_update" || event.type === "tool_execution_end") {
			const tool = {
				name: event.toolName,
				toolCallId: event.toolCallId
			};
			enqueueLive({
				kind: "tool",
				payload: {
					...event.type === "tool_execution_start" ? {
						phase: "start",
						...tool,
						args: redactAgentDiagnosticPayload(event.args)
					} : event.type === "tool_execution_update" ? {
						phase: "update",
						...tool,
						partialResult: redactAgentDiagnosticPayload(event.partialResult)
					} : {
						phase: "result",
						...tool,
						isError: event.isError,
						result: redactAgentDiagnosticPayload(event.result)
					},
					...event.hideFromChannelProgress ? { hideFromChannelProgress: true } : {}
				}
			});
			return;
		}
		if (event.type === "agent_end") {
			const lastAssistant = event.messages.findLast((message) => message.role === "assistant");
			enqueueTerminal({
				stopReason: lastAssistant?.stopReason,
				aborted: lastAssistant?.stopReason === "aborted",
				...lastAssistant?.stopReason === "error" ? { error: lastAssistant.errorMessage ?? "Worker inference failed." } : {}
			});
		}
	};
	const enqueueRunFailure = (failure) => {
		replayInvalid ||= hasModelFallbackStop(failure.error);
		enqueueTerminal({
			aborted: failure.aborted,
			error: formatErrorMessage(failure.error)
		});
	};
	const emitTerminal = async () => {
		if (!terminalLiveEvent) return;
		await client.emitTerminal(boundLiveEvent(terminalLiveEvent));
	};
	return {
		handleSessionEvent,
		enqueueRunFailure,
		emitTerminal
	};
}
//#endregion
//#region src/worker/embedded-agent-transcript.runtime.ts
function toWorkerInferenceMessage(message) {
	if (hasRuntimeContextMarker(message) && !isRuntimeContextMessage(message)) throw new Error("Cloud worker cannot preserve runtime context with media. Stop or reclaim the cloud worker, then retry locally.");
	if (isRuntimeContextMessage(message)) return {
		kind: "complete",
		message: {
			role: "user",
			content: message.content,
			timestamp: message.timestamp,
			runtimeContext: readRuntimeContextMetadata(message)
		}
	};
	if (message.role === "user") return {
		kind: "complete",
		message: {
			role: "user",
			content: typeof message.content === "string" ? message.content : message.content.map(projectWorkerTextOrImageContent),
			timestamp: message.timestamp,
			...message.operatorMessage ? { operatorMessage: message.operatorMessage } : {}
		}
	};
	const projected = toWorkerTranscriptMessage(message, "inference");
	if (!projected) throw new Error(`Unsupported inference message role: ${message.role}`);
	return projected;
}
function toWorkerInferenceContext(context) {
	const windowed = windowWorkerReplayMessages(context.messages, WORKER_INFERENCE_MAX_CONTEXT_MESSAGES);
	if (windowed.kind === "provider-replay-unavailable") return windowed;
	const messages = [];
	for (const message of windowed.messages) {
		const projected = toWorkerInferenceMessage(message);
		if (projected.kind === "provider-replay-unavailable") return projected;
		messages.push(projected.message);
	}
	return {
		kind: "complete",
		context: {
			...context.systemPrompt === void 0 ? {} : { systemPrompt: context.systemPrompt },
			messages,
			...context.tools ? { tools: context.tools.map((tool) => ({
				name: tool.name,
				description: tool.description,
				parameters: structuredClone(tool.parameters)
			})) } : {}
		}
	};
}
function createWorkerTranscriptRuntime(client, signal) {
	const pendingTranscriptMessages = [];
	let failedCommit;
	const onMessagePersisted = (message) => {
		const projected = toWorkerTranscriptMessage(message, "transcript");
		if (!projected) return;
		if (projected.kind === "provider-replay-unavailable") throw new Error(`Worker transcript cannot persist authoritative provider replay: ${projected.details.reason}.`);
		const itemId = readAgentAssistantSource(message)?.itemId;
		if (projected.message.role === "assistant" && itemId) projected.message.itemId = itemId;
		if (!isWorkerTranscriptMessageFrameSafe(projected.message)) throw new Error("Worker transcript message exceeds the protocol payload limit.");
		pendingTranscriptMessages.push(projected.message);
	};
	const flushTranscript = async () => {
		while (pendingTranscriptMessages.length > 0) {
			if (signal?.aborted) {
				if (failedCommit) throw failedCommit.error;
				return;
			}
			const batch = pendingTranscriptMessages.slice(0, 64);
			try {
				await client.commit(batch);
			} catch (error) {
				failedCommit = { error };
				throw error;
			}
			failedCommit = void 0;
			pendingTranscriptMessages.splice(0, batch.length);
		}
	};
	let sessionWriteQueue = Promise.resolve();
	const withSessionWriteSettlement = (operation) => {
		const result = sessionWriteQueue.then(async () => {
			const value = await operation();
			await flushTranscript();
			return value;
		});
		sessionWriteQueue = result.then(() => void 0, () => void 0);
		return result;
	};
	return {
		onMessagePersisted,
		withSessionWriteSettlement
	};
}
//#endregion
//#region src/worker/native-inference-stream.ts
function stringParts(value, includeKeys, strings) {
	let text = "";
	if (typeof value === "string") {
		strings.push(value);
		text = value;
	} else if (Array.isArray(value)) for (const item of value) text += stringParts(item, includeKeys, strings);
	else if (value !== null && typeof value === "object") for (const [key, item] of Object.entries(value)) {
		if (includeKeys) {
			strings.push(key);
			text += key;
		}
		text += stringParts(item, includeKeys, strings);
	}
	return text;
}
function generatedOutput(message) {
	const { content, role: _role, api: _api, provider: _provider, model: _model, usage: _usage, stopReason: _stopReason, timestamp: _timestamp, ...metadata } = message;
	const strings = [];
	let text = "";
	let structured = "";
	let all = "";
	for (const block of content) if (block.type === "toolCall") {
		strings.push(block.id, block.name);
		const value = block.id + block.name + stringParts(block.arguments, true, strings) + stringParts(block.thoughtSignature, false, strings);
		structured += value;
		all += value;
	} else if (block.type === "text") {
		text += block.text;
		const { type: _type, text: _text, ...fields } = block;
		const value = stringParts(fields, false, strings);
		structured += value;
		all += block.text + value;
	} else {
		text += block.thinking;
		const { type: _type, thinking: _thinking, ...fields } = block;
		const value = stringParts(fields, false, strings);
		structured += value;
		all += block.thinking + value;
	}
	const metadataText = stringParts(metadata, false, strings);
	structured += metadataText;
	all += metadataText;
	return {
		all,
		strings,
		structured,
		text
	};
}
/** Guard provider output before the shared loop can publish it or execute generated tools. */
function createNativeInferenceStreamGuard(native) {
	let completedText = "";
	return (start, signal) => {
		const output = (0, event_stream_exports.createAssistantMessageEventStream)();
		(async () => {
			let pending = [];
			let bytes = 0;
			let toolArgumentBytes = 0;
			let currentMessage;
			try {
				const source = await start();
				const toolArgumentDeltas = /* @__PURE__ */ new Map();
				const incompleteToolArguments = /* @__PURE__ */ new Set();
				const clearToolArguments = (contentIndex) => {
					const delta = toolArgumentDeltas.get(contentIndex);
					if (delta !== void 0) {
						toolArgumentBytes -= Buffer.byteLength(delta);
						toolArgumentDeltas.delete(contentIndex);
					}
					incompleteToolArguments.delete(contentIndex);
				};
				const removePendingToolDelta = (contentIndex) => {
					const priorIndex = pending.findIndex((held) => held.type === "toolcall_delta" && held.contentIndex === contentIndex);
					if (priorIndex >= 0) {
						const prior = pending[priorIndex];
						if (prior) {
							bytes -= Buffer.byteLength(JSON.stringify(prior));
							pending.splice(priorIndex, 1);
						}
					}
				};
				const publish = (raw) => {
					signal?.throwIfAborted();
					let event = structuredClone(raw);
					const terminal = event.type === "done" || event.type === "error";
					currentMessage = (event.type === "done" ? event.message : event.type === "error" ? event.error : event.partial) ?? (event.type === "text_delta" && currentMessage ? appendTextDeltaToAssistantMessage(currentMessage, event.contentIndex, event.delta) : void 0);
					if (!currentMessage) throw new Error("Native stream delta has no message owner");
					native.assertProtocolSafe(event);
					const generated = generatedOutput(currentMessage);
					const text = completedText + generated.text;
					const generatedSequences = [
						text,
						generated.structured,
						generated.all
					];
					native.assertProtocolSafe(generatedSequences);
					const strings = generated.strings;
					if ("delta" in event) strings.push(event.delta);
					if ("content" in event) strings.push(event.content);
					if (event.type === "toolcall_end") strings.push(...generatedOutput({
						...currentMessage,
						content: [event.toolCall]
					}).strings);
					if (event.type === "toolcall_delta") {
						const priorDelta = toolArgumentDeltas.get(event.contentIndex) ?? "";
						const delta = priorDelta + event.delta;
						if (Buffer.byteLength(delta) > WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES) throw new Error("Native tool arguments exceeded the protocol budget");
						toolArgumentBytes += Buffer.byteLength(delta) - Buffer.byteLength(priorDelta);
						if (toolArgumentBytes > WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES) throw new Error("Native tool arguments exceeded the aggregate protocol budget");
						toolArgumentDeltas.set(event.contentIndex, delta);
						strings.push(delta);
						try {
							strings.push(stringParts(JSON.parse(delta), true, strings));
							incompleteToolArguments.delete(event.contentIndex);
						} catch (error) {
							if (!(error instanceof SyntaxError)) throw error;
							incompleteToolArguments.add(event.contentIndex);
						}
						event = {
							...event,
							delta
						};
						removePendingToolDelta(event.contentIndex);
					} else if (event.type === "toolcall_end") {
						removePendingToolDelta(event.contentIndex);
						clearToolArguments(event.contentIndex);
					}
					native.assertProtocolSafe(strings);
					const hasCredentialPrefix = generatedSequences.some(native.hasCredentialPrefix) || strings.some(native.hasCredentialPrefix);
					if (terminal && hasCredentialPrefix) throw new Error("Native stream ended with an unresolved credential prefix");
					if (!terminal && (incompleteToolArguments.size > 0 || hasCredentialPrefix)) {
						bytes += Buffer.byteLength(JSON.stringify(event));
						if (bytes + toolArgumentBytes > WORKER_PROTOCOL_MAX_INFERENCE_PAYLOAD_BYTES) throw new Error("Native credential-prefix buffer exceeded");
						pending.push(event);
						return;
					}
					if (terminal && incompleteToolArguments.size > 0) pending = [];
					if (event.type === "error" && pending.length) throw new Error("Native stream failed with an unresolved credential prefix");
					for (const held of pending) {
						output.push(held);
						if (held.type === "toolcall_delta") clearToolArguments(held.contentIndex);
					}
					pending = [];
					bytes = 0;
					output.push(event);
					if (event.type === "toolcall_delta") clearToolArguments(event.contentIndex);
					if (event.type === "done") completedText = text;
				};
				let terminalSeen = false;
				for await (const event of source) {
					signal?.throwIfAborted();
					if (terminalSeen) throw new Error("Native stream continued after its terminal event");
					if (event.type === "done" || event.type === "error") {
						native.assertProtocolSafe(event);
						terminalSeen = true;
					} else publish(event);
				}
				const final = await source.result();
				publish(final.stopReason === "error" || final.stopReason === "aborted" ? {
					type: "error",
					reason: final.stopReason,
					error: final
				} : {
					type: "done",
					reason: final.stopReason,
					message: final
				});
			} catch {
				const aborted = signal?.aborted === true;
				output.push({
					type: "error",
					reason: aborted ? "aborted" : "error",
					error: {
						role: "assistant",
						content: [],
						provider: native.model.provider,
						model: native.model.id,
						api: native.model.api,
						timestamp: Date.now(),
						stopReason: aborted ? "aborted" : "error",
						errorMessage: aborted ? "Runtime-local inference cancelled" : "Runtime-local inference failed its output boundary",
						usage: makeZeroUsageSnapshot()
					}
				});
			} finally {
				output.end();
			}
		})();
		return output;
	};
}
//#endregion
//#region src/worker/worker-gateway-tools.ts
function createWorkerGatewayToolProxies(surface, client) {
	const tools = [];
	for (const entry of surface.tools) {
		if (entry.execution !== "gateway") continue;
		const tool = {
			...entry.definition,
			execute: async (toolCallId, args, signal, onUpdate) => {
				signal?.throwIfAborted();
				if (!isRecord(args)) throw new Error("Gateway tool arguments must be an object.");
				const seconds = entry.timeout?.argument ? args[entry.timeout.argument] : void 0;
				const timeoutMs = entry.timeout ? Math.max(entry.timeout.minimumMs ?? 0, (typeof seconds === "number" ? seconds : entry.timeout.defaultSeconds ?? 0) * 1e3 + (entry.timeout.paddingMs ?? 0)) : void 0;
				const invocation = {
					generation: surface.generation,
					toolCallId
				};
				const cancel = () => {
					client.cancelGatewayTool(invocation).catch(() => {});
				};
				signal?.addEventListener("abort", cancel, { once: true });
				try {
					const response = await client.invokeGatewayTool({
						...invocation,
						toolId: entry.id,
						arguments: args
					}, {
						replay: entry.replay,
						timeoutMs,
						signal,
						onUpdate: onUpdate ? (result) => onUpdate({
							...result,
							details: result.details
						}) : void 0
					});
					signal?.throwIfAborted();
					if (!response.ok) throw new Error(response.error.message);
					return {
						...response.payload,
						details: response.payload.details
					};
				} finally {
					signal?.removeEventListener("abort", cancel);
				}
			}
		};
		if (entry.plugin) setPluginToolMeta(tool, entry.plugin);
		bindBeforeToolCallMetadata(tool, {
			sourceTool: { ...tool },
			options: { emitDiagnostics: false }
		});
		tools.push(tool);
	}
	return tools;
}
//#endregion
//#region src/worker/embedded-agent.runtime.ts
function toWorkerAgentError(value, fallback) {
	return value instanceof Error ? value : new Error(fallback, { cause: value });
}
async function runWorkerEmbeddedTurn(params) {
	const resources = params.skillResources ? await materializeSkillResources(params.skillResources, () => params.signal?.throwIfAborted(), {
		sessionId: params.sessionId,
		workspaceDir: params.cwd
	}) : void 0;
	try {
		if (params.allowedToolNames.includes("browser") !== (params.browser !== void 0)) throw new Error("Worker Browser authority and launch descriptor must be provided together.");
		if (params.allowedToolNames.includes("computer") !== (params.computer !== void 0)) throw new Error("Worker computer authority and launch descriptor must be provided together.");
		if (params.operationalRunInstance.runId !== params.runId) throw new Error("worker operational run instance disagrees with the admitted turn");
		const toolSurface = params.toolSurface;
		const model = params.nativeInference?.model ?? createNativeModelOwnedRuntimeModel({
			provider: params.modelRef.provider,
			modelId: params.modelRef.model
		});
		if (!params.nativeInference) {
			model.contextWindow = toolSurface.policy.modelContextWindowTokens ?? model.contextWindow;
			if (toolSurface.policy.modelHasVision !== void 0) model.input = toolSurface.policy.modelHasVision ? ["text", "image"] : ["text"];
		}
		const requestedReasoning = params.inferenceOptions?.reasoning;
		if (params.nativeInference && requestedReasoning === "adaptive") throw new Error("Adaptive thinking is not supported by runtime-local worker inference");
		const thinkingLevel = params.nativeInference ? requestedReasoning === "adaptive" ? "off" : requestedReasoning ?? "off" : "medium";
		if (params.nativeInference && !getSupportedThinkingLevels(model).includes(thinkingLevel)) throw new Error("Requested thinking level is not supported by the node-local model");
		if (params.nativeInference && (params.inferenceOptions?.maxTokens !== void 0 && params.inferenceOptions.maxTokens !== model.maxTokens || Object.values(params.inferenceOptions?.thinkingBudgets ?? {}).some((budget) => budget !== void 0 && budget > model.maxTokens))) throw new Error("Worker inference options exceed or override the node-local model budget");
		const authStorage = AuthStorage.inMemory({});
		const modelRegistry = ModelRegistry.inMemory(authStorage);
		const settingsManager = SettingsManager.inMemory({
			compaction: { enabled: false },
			retry: { enabled: false }
		});
		const resourceLoader = new DefaultResourceLoader({
			cwd: params.cwd,
			agentDir: params.stateDir
		});
		const baseSessionManager = SessionManager.inMemory(params.cwd);
		for (const message of params.initialMessages ?? []) await baseSessionManager.appendMessageAsync(structuredClone(message));
		const transcriptRuntime = createWorkerTranscriptRuntime(params.transcript, params.signal);
		const sessionManager = guardSessionManager(baseSessionManager, {
			suppressNextUserMessagePersistence: params.suppressPromptTranscript,
			onMessagePersisted: transcriptRuntime.onMessagePersisted
		});
		const appendCustomMessage = sessionManager.appendCustomMessageEntryAsync.bind(sessionManager);
		sessionManager.appendCustomMessageEntryAsync = async (customType, content, display, details) => {
			const entryId = await appendCustomMessage(customType, content, display, details);
			const entry = sessionManager.getEntry(entryId);
			const message = entry && projectSessionEntryMessage(entry);
			if (!message) throw new Error("Worker custom message was not committed");
			transcriptRuntime.onMessagePersisted(message);
			return entryId;
		};
		const allowedToolNameSet = new Set(params.allowedToolNames);
		for (const entry of toolSurface.tools) if (entry.execution === "placement" && !allowedToolNameSet.has(entry.definition.name)) throw new Error(`Worker tool surface exceeds launch authority: ${entry.definition.name}`);
		const activeToolNames = new Set(toolSurface.tools.map(({ definition }) => definition.name));
		const coreTools = projectMemoryFlushTools(createWorkerPlacementTools({
			...params,
			policy: toolSurface.policy,
			containmentRoot: params.workerContainmentRoot,
			skillsSnapshot: resources?.snapshot
		}), toolSurface.policy.memoryFlushWritePath ? {
			root: params.workerContainmentRoot,
			relativePath: toolSurface.policy.memoryFlushWritePath
		} : void 0);
		const browserRuntime = params.browser && activeToolNames.has("browser") ? await createWorkerBrowserToolRuntime({
			descriptor: params.browser,
			sessionKey: toAgentStoreSessionKey({
				agentId: params.agentId,
				requestKey: params.sessionKey
			}),
			stateDir: params.stateDir,
			workspaceDir: params.cwd,
			...params.browserRuntime ? { runtime: params.browserRuntime } : {}
		}) : void 0;
		const turnLifetime = new AbortController();
		const toolSignal = params.signal ? AbortSignal.any([params.signal, turnLifetime.signal]) : turnLifetime.signal;
		let computerCleanup;
		let toolSurfaceRuntime;
		async function disposeTools(failure) {
			turnLifetime.abort();
			const cleanup = computerCleanup;
			computerCleanup = void 0;
			const failures = failure ? [failure] : [];
			const disposals = await Promise.allSettled([
				() => toolSurfaceRuntime?.cleanup(),
				() => cleanup?.("Worker turn finished"),
				() => browserRuntime?.dispose(),
				disposeAllCodeModeRuns
			].map(async (dispose) => await dispose()));
			for (const disposal of disposals) if (disposal.status === "rejected") {
				const cleanupFailure = toWorkerAgentError(disposal.reason, "Worker tool cleanup failed.");
				recordModelFallbackStop(cleanupFailure);
				failures.push(cleanupFailure);
			}
			return failures.length > 1 ? new AggregateError(failures, "Worker turn failed") : failures[0];
		}
		const { session } = await (async () => {
			try {
				const computerTool = params.computer && activeToolNames.has("computer") ? createWorkerComputerTool({
					...params.computer,
					runId: params.runId,
					registerRunCleanup: (cleanup) => {
						computerCleanup = cleanup;
					}
				}) : void 0;
				const localTools = new Map([
					...coreTools,
					...browserRuntime ? [browserRuntime.tool] : [],
					...computerTool ? [computerTool] : []
				].map((tool) => [tool.name, tool]));
				const gatewayTools = new Map(createWorkerGatewayToolProxies(toolSurface, params.gatewayTools).map((tool) => [tool.name, tool]));
				const tools = toolSurface.tools.map((entry) => {
					if (entry.execution === "gateway") return wrapToolWithAbortSignal(gatewayTools.get(entry.definition.name), toolSignal);
					const source = localTools.get(entry.definition.name);
					if (!source) throw new Error(`Worker placement tool unavailable: ${entry.definition.name}`);
					const tool = copyAgentToolMetadata(source, {
						...source,
						...entry.definition
					});
					if (entry.plugin) setPluginToolMeta(tool, entry.plugin);
					return wrapToolWithGatewayCallerIdentity(wrapToolWithAbortSignal(wrapToolWithBeforeToolCallHook(tool, {
						agentId: params.agentId,
						config: WORKER_TOOL_CONFIG,
						cwd: params.cwd,
						workspaceDir: params.cwd,
						sessionKey: params.sessionKey,
						sessionId: params.sessionId,
						runId: params.runId,
						requester: { senderIsOwner: true }
					}), toolSignal), {
						agentId: params.agentId,
						sessionKey: params.sessionKey,
						operationalRunInstance: params.operationalRunInstance,
						signedAgentRuntimeIdentityToken: params.agentRuntimeIdentityToken
					});
				});
				toolSurfaceRuntime = createAgentHarnessToolSurfaceRuntimeCore({
					agentId: params.agentId,
					sessionId: params.sessionId,
					sessionKey: params.sessionKey,
					runId: params.runId,
					abortSignal: toolSignal,
					presentation: toolSurface.presentation,
					supportsDeferredToolCalls: false,
					modelToolsEnabled: tools.length > 0,
					model
				});
				const projected = toolSurfaceRuntime.compactTools(tools, { prepared: {
					abortSignal: toolSignal,
					preserveToolNames: []
				} }).promptToolPolicy.apply();
				await resourceLoader.reload();
				const systemPrompt = completeSystemPromptRuntime(params.systemPrompt ?? "", {
					host: await getMachineDisplayName(),
					os: resolveRuntimeOsLabel(),
					arch: os.arch(),
					node: process.version,
					shell: detectRuntimeShell() ?? path.basename(getShellConfig().shell),
					repoRoot: resolveSystemPromptRepoRoot({
						workspaceDir: params.cwd,
						cwd: params.cwd
					})
				});
				return await createAgentSession({
					systemPrompt: resources?.rewriteReferences(systemPrompt) ?? systemPrompt,
					cwd: params.cwd,
					modelRegistry,
					model,
					thinkingLevel,
					tools: projected.tools.map((tool) => tool.name),
					customTools: toToolDefinitions(projected.tools),
					sessionManager,
					settingsManager,
					resourceLoader,
					withSessionWriteSettlement: transcriptRuntime.withSessionWriteSettlement
				});
			} catch (error) {
				throw await disposeTools(toWorkerAgentError(error, "Worker agent setup failed."));
			}
		})();
		session.agent.sessionId = params.sessionId;
		const guardNativeStream = params.nativeInference ? createNativeInferenceStreamGuard(params.nativeInference) : void 0;
		session.agent.streamFn = async (_model, context, options) => {
			if (params.nativeInference && guardNativeStream) {
				const native = params.nativeInference;
				return guardNativeStream(() => native.streamFn(model, context, {
					...params.inferenceOptions,
					reasoning: thinkingLevel,
					signal: options?.signal
				}), options?.signal);
			}
			const projected = toWorkerInferenceContext(context);
			if (projected.kind === "provider-replay-unavailable") throw new Error(`${WORKER_PROVIDER_REPLAY_LOCAL_RETRY_MESSAGE} (${projected.details.reason})`);
			return params.inference.stream({
				modelRef: params.modelRef,
				context: projected.context,
				options: structuredClone(params.inferenceOptions),
				...options?.signal ? { signal: options.signal } : {}
			});
		};
		const liveRuntime = createWorkerLiveRuntime(params.live);
		const completion = subscribeEmbeddedAgentSession({
			session,
			runId: params.runId,
			sessionKey: params.sessionKey,
			terminalLifecyclePhase: "finishing",
			codeModeExecToolNames: new Set(toolSurfaceRuntime?.codeModeControlsEnabled ? ["exec"] : [])
		});
		const unsubscribe = session.subscribe(liveRuntime.handleSessionEvent);
		const existingProcesses = new Set(listRunningSessions().map(({ id }) => id));
		const abortTurn = () => session.agent.abort();
		params.signal?.addEventListener("abort", abortTurn, { once: true });
		let runFailure;
		try {
			const content = typeof params.prompt === "string" ? [{
				type: "text",
				text: params.prompt
			}] : [...params.prompt];
			if (resources) {
				for (const [index, part] of content.entries()) if (part.type === "text") content[index] = {
					...part,
					text: resources.rewriteReferences(part.text)
				};
			}
			const fragments = params.runtimeContext ? [...await buildExecutionHostRuntimeFacts({
				...params,
				capabilityToolNames: activeToolNames
			}), ...params.runtimeContext] : [];
			const runtimeContext = buildRuntimeContextCustomMessage(projectRuntimeContextFragments(fragments), fragments, params.inHistorySystemUpdates);
			params.signal?.throwIfAborted();
			await session.agent.prompt([{
				role: "user",
				content,
				timestamp: Date.now()
			}, ...runtimeContext ? [runtimeContext] : []]);
			await completion.waitForPendingEvents();
			params.signal?.throwIfAborted();
			let terminalAssistant = completion.getCurrentAttemptAssistant();
			const running = listRunningSessions().filter(({ id, scopeKey }) => scopeKey === params.sessionKey && !existingProcesses.has(id));
			const attempt = {
				...readSubscriptionCompletionEvidence(completion),
				currentAttemptAssistant: terminalAssistant,
				messagesSnapshot: session.agent.state.messages,
				terminal: { kind: "ok" }
			};
			const answer = classifyAssistantTurn({
				attempt,
				payloadCount: 0
			});
			const instruction = resolveSettledToolTerminalContinuationInstruction({
				provider: model.provider,
				modelId: model.id,
				modelApi: model.api,
				aborted: false,
				timedOut: false,
				attempt,
				allowEmptyStopContinuation: !answer.silent,
				payloadCount: answer.visibleText || running.length ? 1 : 0
			});
			if (instruction && terminalAssistant?.stopReason === "stop") {
				session.agent.state.tools = [];
				await session.sendCustomMessage({
					customType: "openclaw.settled-tool-finalization",
					content: instruction,
					display: false
				}, { triggerTurn: true });
				terminalAssistant = completion.getCurrentAttemptAssistant();
				assertSettledTurnFinalizationResult({ assistant: terminalAssistant });
			}
			params.signal?.throwIfAborted();
			if (terminalAssistant?.stopReason === "error" || terminalAssistant?.stopReason === "aborted") throw new Error(terminalAssistant.errorMessage ?? `Worker inference ${terminalAssistant.stopReason}.`);
			if (running.length > 0) {
				const message = buildAssistantMessage({
					model,
					stopReason: "stop",
					usage: buildUsageWithNoCost({}),
					content: [{
						type: "text",
						text: `Background commands are still running (process sessions: ${running.map(({ id }) => id).join(", ")}). This turn has ended before their results were available.`
					}]
				});
				liveRuntime.handleSessionEvent({
					type: "message_start",
					message
				});
				liveRuntime.handleSessionEvent({
					type: "message_end",
					message
				});
				await sessionManager.appendMessageAsync(message);
			}
		} catch (error) {
			runFailure = params.signal?.aborted ? toWorkerAgentError(params.signal.reason, "Worker agent turn aborted.") : toWorkerAgentError(error, "Worker agent turn failed.");
		}
		try {
			const [cleanupFailure, transcriptFailure] = await Promise.all([disposeTools(runFailure), transcriptRuntime.withSessionWriteSettlement(() => void 0).catch((error) => toWorkerAgentError(error, "Worker transcript flush failed."))]);
			runFailure = cleanupFailure;
			if (runFailure) liveRuntime.enqueueRunFailure({
				aborted: params.signal?.aborted === true,
				error: runFailure
			});
			if (transcriptFailure) throw runFailure ?? transcriptFailure;
			await liveRuntime.emitTerminal();
		} finally {
			turnLifetime.abort();
			params.signal?.removeEventListener("abort", abortTurn);
			unsubscribe();
			completion.unsubscribe();
			session.dispose();
		}
		if (runFailure !== void 0) throw runFailure;
	} finally {
		await resources?.cleanup();
	}
}
//#endregion
export { runWorkerEmbeddedTurn };
