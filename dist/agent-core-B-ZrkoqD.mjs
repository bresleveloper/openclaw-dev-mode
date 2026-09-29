import { r as __exportAll } from "./rolldown-runtime-Dr7-SnC6.mjs";
import { C as parseStrictNonNegativeInteger, P as resolvePositiveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { t as coerceErrorMessage } from "./error-coercion-C787aVxk.mjs";
import { n as estimateStringChars } from "./cjk-chars-6ld30jSx.mjs";
import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { n as ok, t as err } from "./result-BQGgYouL.mjs";
import { l as runPluginStreamConsumer } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { i as readResponseWithLimit } from "./http-response-body-DXfezLdR.mjs";
import "./http-body-Bl_jph25.mjs";
import { n as PROVIDER_FAILURE_WITH_OUTPUT_ERROR_CODE } from "./types-LFWwv0cF.mjs";
import "./llm-CLV5ZXaS.mjs";
import "./src-BpANEEBH.mjs";
import { a as BRANCH_SUMMARY_PREFIX, c as COMPACTION_SUMMARY_SUFFIX, i as projectSessionEntryMessage, l as bashExecutionToText, o as BRANCH_SUMMARY_SUFFIX, s as COMPACTION_SUMMARY_PREFIX, t as buildSessionContext, u as convertToLlm } from "./session-D9cHHQGH.mjs";
import { A as resolveAgentReasoningOption, C as mergeSummaryFileOperations, D as resolveAgentCoreCompleteFn, E as consumeAgentCoreStream, O as resolveAgentCoreStreamFn, S as formatFileOperations, T as SUMMARIZATION_SYSTEM_PROMPT, a as calculateContextTokens, b as extractFileOpsFromMessage, c as estimateContextTokens, d as findTurnStartIndex, g as shouldCompact, h as prepareCompaction, j as BranchSummaryError, k as runAgentCoreStream, l as estimateTokens, m as getLastAssistantUsage, n as IMAGE_BLOCK_TOKENS, p as generateSummary, s as compact, t as DEFAULT_COMPACTION_SETTINGS, u as findCutPoint, v as computeFileLists, w as serializeConversation, x as extractSummaryText, y as createFileOps } from "./compaction-CAzwgOuQ.mjs";
import { d as getInternalSteeringQueueObserver, f as getInternalSyncSteeringGetter, g as takeInternalToolBatchLifecycle, l as copyInternalToolResultState, n as appendToolLoopWarning, p as getInternalToolExecutionPreparer, r as attachInternalSyncSteeringGetter, u as getInternalBeforeToolBatch } from "./internal-hooks-DUPhyX-W.mjs";
import { n as TranscriptNotContinuableError } from "./errors-wmH7Ncz4.mjs";
import { t as uuidv7 } from "./uuid-Du6j8Hxj.mjs";
import { n as runWithAgentToolExecutionContext } from "./tool-execution-context-C6v2UVPI.mjs";
import { t as event_stream_exports } from "./event-stream-xGBL9CyU.mjs";
import { i as streamSimple, n as completeSimple } from "./stream-BDeJVJpD.mjs";
import "./truncate-DpjxES0d.mjs";
import { createSseByteGuard, createToolArgumentPreviewSchedule, parseStreamingJson, parseTerminalToolCallArguments } from "@openclaw/ai/internal/runtime";
import { replaceCompactionReplayOwnerContent } from "@openclaw/ai/transports";
import { isResponsesOutputLimitToolCallError } from "@openclaw/ai/diagnostics";
import { validateToolArguments } from "@openclaw/ai/validation";
//#region packages/agent-core/src/stream-steering.ts
/** Forward queued input while its normal transcript owner retains commit ordering. */
function createStreamSteering(config, signal, convertSteering) {
	const observer = getInternalSteeringQueueObserver(config.getSteeringMessages);
	let open = true;
	let cleanup;
	let forwarding = Promise.resolve();
	let needsContinuation;
	let finished;
	let failure;
	let submitted = false;
	const stop = () => {
		open = false;
		const release = cleanup;
		cleanup = void 0;
		release?.();
	};
	const onActiveResponse = (control) => {
		if (!open || signal?.aborted) return;
		needsContinuation = control.needsContinuation;
		const outerCleanup = config.onActiveResponse?.(control);
		const forward = () => {
			if (!open || signal?.aborted || failure || !observer || submitted) return;
			const messages = observer.peek();
			if (messages.length === 0) return;
			submitted = true;
			const release = observer.reserve(messages);
			let dispatched = false;
			forwarding = forwarding.then(async () => {
				if (!open || signal?.aborted) {
					release();
					return;
				}
				const converted = await convertSteering([...messages]);
				const userMessages = converted.filter((message) => message.role === "user");
				if (!open || signal?.aborted || userMessages.length !== converted.length || userMessages.length === 0) {
					release();
					stop();
					return;
				}
				dispatched = true;
				if (!await control.steer(userMessages)) {
					release();
					stop();
				}
			}).catch((error) => {
				if (!dispatched) release();
				failure ??= { error };
			});
		};
		const unsubscribe = observer?.subscribe(forward);
		cleanup = () => {
			unsubscribe?.();
			outerCleanup?.();
		};
		forward();
		return stop;
	};
	return {
		onActiveResponse,
		finish() {
			return finished ??= (async () => {
				stop();
				await forwarding;
				if (failure) throw failure.error;
				return needsContinuation?.() === true;
			})();
		}
	};
}
//#endregion
//#region packages/agent-core/src/turn-interruption.ts
/** Canonical empty aborted/error assistant recorded when a run ends without output. */
function createFailureMessage(model, error, aborted) {
	return {
		role: "assistant",
		content: [{
			type: "text",
			text: ""
		}],
		api: model.api,
		provider: model.provider,
		model: model.id,
		stopReason: aborted ? "aborted" : "error",
		errorMessage: error instanceof Error ? error.message : String(error),
		timestamp: Date.now(),
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
		}
	};
}
const INTERRUPTED_TURN_GUIDANCE = `<turn_aborted>
The previous turn was interrupted. Any running background processes may still be active. If any tools or commands were aborted, they may have partially executed.
</turn_aborted>`;
/**
* Aborts that end a turn as an intentional handoff (e.g. yield-style tools)
* mark it with an abort reason carrying `turnHandoff: true`. Interruption
* guidance is skipped for them: the next turn would otherwise be told tools
* may have partially executed after a clean, deliberate stop.
*/
function isTurnHandoffAbort(signal) {
	if (!signal?.aborted) return false;
	const reason = signal.reason;
	return typeof reason === "object" && reason !== null && reason.turnHandoff === true;
}
async function appendInterruptedTurnMessage(messages, emit) {
	const interruption = {
		role: "custom",
		customType: "openclaw:turn-aborted",
		content: INTERRUPTED_TURN_GUIDANCE,
		display: false,
		timestamp: Date.now()
	};
	messages.push(interruption);
	await emit({
		type: "message_start",
		message: interruption
	});
	await emit({
		type: "message_end",
		message: interruption
	});
}
function normalizeCoreContextMessages(messages) {
	return messages.map((message) => {
		if (message.role !== "custom" || message.customType !== "openclaw:turn-aborted") return message;
		return {
			role: "user",
			content: typeof message.content === "string" ? [{
				type: "text",
				text: message.content
			}] : message.content,
			timestamp: message.timestamp
		};
	});
}
//#endregion
//#region packages/agent-core/src/agent-stream-response.ts
function appendTextDeltaToAssistantMessage(message, contentIndex, delta) {
	const content = [...message.content];
	const currentContent = content[contentIndex];
	content[contentIndex] = currentContent?.type === "text" ? {
		...currentContent,
		text: currentContent.text + delta
	} : {
		type: "text",
		text: delta
	};
	return {
		...message,
		content
	};
}
function resolveAssistantMessageUpdate(event, currentMessage) {
	if ("partial" in event && event.partial) return event.partial;
	if (event.type === "text_delta") return appendTextDeltaToAssistantMessage(currentMessage, event.contentIndex, event.delta);
	return currentMessage;
}
function removeNonExecutableToolCalls(message) {
	if (message.stopReason === "toolUse") return message;
	const content = message.content.filter((item) => item.type !== "toolCall" || item.async);
	return content.length === message.content.length ? message : replaceCompactionReplayOwnerContent(message, content);
}
function ensureToolTurnIdentity(message) {
	if (!(message.stopReason === "toolUse" || (message.stopReason === "stop" || message.stopReason === "length") && message.content.some((item) => item.type === "toolCall" && item.async)) || message.responseId?.trim() || message.turnId?.trim()) return message;
	return {
		...message,
		turnId: uuidv7()
	};
}
async function streamAgentResponse(context, config, signal, emit, newMessages, executeAsyncTools, prepareAssistantMessage, streamFn, runtime) {
	const sourceMessages = [...context.messages];
	const convertMessages = async (messages, projectionSignal = signal) => {
		const transformed = config.transformContext ? await config.transformContext(messages, projectionSignal) : messages;
		return config.convertToLlm(normalizeCoreContextMessages(transformed));
	};
	const llmMessages = await convertMessages(sourceMessages);
	let requestPrefix;
	const llmContext = {
		systemPrompt: context.systemPrompt,
		messages: llmMessages,
		tools: context.tools
	};
	const streamFunction = resolveAgentCoreStreamFn(runtime, streamFn);
	const resolvedApiKey = (config.getApiKey ? await config.getApiKey(config.model.provider) : void 0) || config.apiKey;
	const executionAbort = new AbortController();
	const executionSignal = signal ? AbortSignal.any([signal, executionAbort.signal]) : executionAbort.signal;
	const abortFailedResponse = (message) => {
		if (message && (message.stopReason === "error" || message.stopReason === "aborted") && !isResponsesOutputLimitToolCallError(message)) executionAbort.abort(new Error(message.errorMessage ?? "Model response interrupted"));
	};
	const steering = createStreamSteering(config, executionSignal, async (pending) => {
		requestPrefix ??= JSON.stringify(llmMessages);
		const projected = await convertMessages([...sourceMessages, ...pending], executionSignal);
		if (JSON.stringify(projected.slice(0, llmMessages.length)) !== requestPrefix) return [];
		return projected.slice(llmMessages.length);
	});
	const executedIds = /* @__PURE__ */ new Set();
	const batches = [];
	let executions = Promise.resolve();
	let admissions = Promise.resolve();
	let executionFailure;
	const emitToolEvent = async (event) => {
		if (event.type === "message_end" && event.message.role === "toolResult") {
			context.messages.push(event.message);
			newMessages.push(event.message);
		}
		await emit(event);
	};
	const enqueueTools = (message) => {
		if (message.stopReason === "error" || message.stopReason === "aborted") return;
		const calls = message.content.filter((item) => item.type === "toolCall" && !executedIds.has(item.id) && (message.stopReason === "toolUse" || item.async === true));
		if (calls.length === 0) return;
		const hasUnobservedAsyncToolResults = executedIds.size > 0;
		for (const call of calls) executedIds.add(call.id);
		const previousExecutions = executions;
		const previousAdmission = admissions;
		let releaseAdmission;
		admissions = new Promise((resolve) => {
			releaseAdmission = resolve;
		});
		const execution = previousAdmission.then(async () => {
			const batch = await executeAsyncTools(message, calls, executionSignal, emitToolEvent, {
				waitForPrevious: () => previousExecutions,
				onParallelStarted: releaseAdmission,
				hasUnobservedAsyncToolResults
			});
			batches.push(batch);
			if (batch.fatal || batch.terminateRun) executionAbort.abort(batch.fatal?.error ?? /* @__PURE__ */ new Error("Tool batch terminated"));
		}).catch((error) => {
			executionFailure ??= { error };
			executionAbort.abort(error);
		}).finally(releaseAdmission);
		executions = Promise.all([previousExecutions, execution]).then(() => {});
	};
	try {
		const stream = streamFunction(config.model, llmContext, {
			...config,
			apiKey: resolvedApiKey,
			signal: executionSignal,
			onActiveResponse: steering.onActiveResponse,
			asyncToolExecution: true
		});
		return await runAgentCoreStream(stream, async () => {
			const response = await stream;
			let partialMessage = null;
			let partialIndex;
			let committedContentCount = 0;
			let streamedTurnId;
			const remainingFragment = (message) => committedContentCount === 0 ? message : replaceCompactionReplayOwnerContent(message, message.content.slice(committedContentCount));
			const updatePartial = async (message) => {
				const fragment = remainingFragment(message);
				if (partialIndex === void 0) {
					partialIndex = context.messages.length;
					context.messages.push(fragment);
					await emit({
						type: "message_start",
						message: { ...fragment }
					});
				} else context.messages[partialIndex] = fragment;
				return fragment;
			};
			const commitFragment = async (message) => {
				if (partialIndex === void 0) {
					context.messages.push(message);
					await emit({
						type: "message_start",
						message: { ...message }
					});
				} else {
					context.messages.splice(partialIndex, 1);
					context.messages.push(message);
				}
				partialIndex = void 0;
				newMessages.push(message);
				await emit({
					type: "message_end",
					message
				});
			};
			for await (const event of response) switch (event.type) {
				case "start": {
					const message = event.partial;
					partialMessage = message;
					await updatePartial(message);
					break;
				}
				case "text_start":
				case "text_delta":
				case "text_end":
				case "thinking_start":
				case "thinking_delta":
				case "thinking_end":
				case "toolcall_start":
				case "toolcall_delta":
				case "toolcall_end":
					if (partialMessage) {
						const message = resolveAssistantMessageUpdate(event, partialMessage);
						partialMessage = message;
						if (event.contentIndex < committedContentCount) break;
						const fragment = await updatePartial(message);
						await emit({
							type: "message_update",
							assistantMessageEvent: {
								...event,
								contentIndex: event.contentIndex - committedContentCount,
								..."partial" in event ? { partial: fragment } : {}
							},
							message: { ...fragment }
						});
						if (event.type === "toolcall_end" && event.toolCall.async && !executedIds.has(event.toolCall.id) && message.content.slice(committedContentCount, event.contentIndex).every((item) => item.type !== "toolCall" || item.async === true)) {
							const prefix = prepareAssistantMessage(ensureToolTurnIdentity({
								...replaceCompactionReplayOwnerContent(message, message.content.slice(committedContentCount, event.contentIndex + 1)),
								...streamedTurnId ? { turnId: streamedTurnId } : {},
								stopReason: "toolUse",
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
								}
							}));
							streamedTurnId ??= prefix.turnId;
							await commitFragment(prefix);
							committedContentCount = event.contentIndex + 1;
							enqueueTools(prefix);
						}
					}
					break;
				case "done":
				case "error": return await finalizeAssistantMessage(event.type === "done" ? event.message : event.error);
			}
			return await finalizeAssistantMessage();
			async function finalizeAssistantMessage(terminal) {
				abortFailedResponse(terminal);
				const result = await response.result();
				abortFailedResponse(result);
				const outputLimit = isResponsesOutputLimitToolCallError(result);
				if (outputLimit) await executions;
				const finalMessage = prepareAssistantMessage(ensureToolTurnIdentity(removeNonExecutableToolCalls({
					...remainingFragment(result),
					...streamedTurnId ? { turnId: streamedTurnId } : {},
					...outputLimit && signal?.aborted ? { stopReason: "aborted" } : outputLimit && batches.length > 0 && batches.every((batch) => batch.terminate) ? { errorCode: PROVIDER_FAILURE_WITH_OUTPUT_ERROR_CODE } : {}
				})));
				await commitFragment(finalMessage);
				if (executedIds.size > 0) enqueueTools(finalMessage);
				await executions;
				if (executionFailure) throw executionFailure.error;
				const continuationRequired = await steering.finish();
				return {
					message: finalMessage,
					executedIds,
					batches,
					continuationRequired
				};
			}
		}, runtime);
	} finally {
		executionAbort.abort(/* @__PURE__ */ new Error("Model response closed"));
		await executions;
		await steering.finish();
	}
}
//#endregion
//#region packages/agent-core/src/agent-loop.ts
const TOOL_LOOP_RECOVERY_TERMINATED_MESSAGE = "OpenClaw stopped this run because tool-loop recovery encountered another critical loop. No blocked tool action was executed.";
const STEERING_TOOL_SKIP_MESSAGE = "Skipped to process an incoming message.";
const TOOL_ADMISSION_FAILURE_MESSAGE = "Tool execution was blocked before launch.";
const TOOL_ADMISSION_FAILURE_DETAILS = {
	status: "blocked",
	deniedReason: "tool-admission"
};
function getSteeringAtCheckpoint(config) {
	const callback = config.getSteeringMessages;
	if (!callback) return [];
	return getInternalSyncSteeringGetter(callback)?.() ?? callback.call(config);
}
/** Run a prompt-started loop and emit events through a caller-owned sink. */
async function runAgentLoop(prompts, context, config, emit, signal, streamFn, runtime) {
	return runAgentLoopCore(prompts, context, config, emit, signal, streamFn, runtime);
}
/** Continue an existing loop context and emit only newly produced messages. */
async function runAgentLoopContinue(context, config, emit, signal, streamFn, runtime) {
	assertContinuableContext(context);
	return runAgentLoopCore([], context, config, emit, signal, streamFn, runtime);
}
function assertContinuableContext(context) {
	const lastMessage = context.messages.at(-1);
	if (!lastMessage) throw new Error("Cannot continue: no messages in context");
	if (lastMessage.role === "assistant") throw new TranscriptNotContinuableError(lastMessage.role);
}
async function runAgentLoopCore(prompts, context, config, emit, signal, streamFn, runtime) {
	const newMessages = [];
	const state = { context: {
		...context,
		messages: [...context.messages]
	} };
	await emit({ type: "agent_start" });
	await emit({ type: "turn_start" });
	for (const prompt of prompts) {
		if (config.consumeQueuedMessageCancellation?.(prompt)) continue;
		await emit({
			type: "message_start",
			message: prompt
		});
		if (config.consumeQueuedMessageCancellation?.(prompt)) continue;
		await emit({
			type: "message_end",
			message: prompt
		});
		state.context.messages.push(prompt);
		newMessages.push(prompt);
	}
	if (prompts.length > 0 && newMessages.length === 0) {
		await emit({
			type: "agent_end",
			messages: []
		});
		return [];
	}
	return runLoop(state, newMessages, config, signal, emit, streamFn, runtime);
}
/**
* Own one replaceable context slot so this async frame does not retain earlier
* contexts after a next-turn hook replaces them.
*/
async function runLoop(state, newMessages, initialConfig, signal, emit, streamFn, runtime) {
	let config = initialConfig;
	let firstTurn = true;
	let turnOpen = true;
	let turnTainted = isActiveTurnTainted(state.context.messages);
	const toolLoopRecoveryState = initialConfig.toolLoopRecoveryState ?? { criticalToolLoopSeen: false };
	const initialSteering = getSteeringAtCheckpoint(config);
	let pendingMessages = Array.isArray(initialSteering) ? initialSteering : await initialSteering;
	const stopIfAborted = async () => {
		if (!signal?.aborted) return false;
		const abortedMessage = withAssistantTurnTaint(createFailureMessage(config.model, signal.reason instanceof Error ? signal.reason : /* @__PURE__ */ new Error("Agent run aborted"), true), turnTainted);
		newMessages.push(abortedMessage);
		if (!turnOpen) {
			await emit({ type: "turn_start" });
			turnOpen = true;
		}
		await emit({
			type: "message_start",
			message: abortedMessage
		});
		await emit({
			type: "message_end",
			message: abortedMessage
		});
		await emit({
			type: "turn_end",
			message: abortedMessage,
			toolResults: []
		});
		turnOpen = false;
		if (!isTurnHandoffAbort(signal)) await appendInterruptedTurnMessage(newMessages, emit);
		await emit({
			type: "agent_end",
			messages: newMessages
		});
		return true;
	};
	const commitPendingMessages = async () => {
		const messagesToInject = pendingMessages;
		pendingMessages = [];
		let injectedMessage = false;
		for (const message of messagesToInject) {
			if (config.consumeQueuedMessageCancellation?.(message)) continue;
			await emit({
				type: "message_start",
				message
			});
			if (config.consumeQueuedMessageCancellation?.(message)) continue;
			if (message.role === "user") turnTainted = false;
			await emit({
				type: "message_end",
				message
			});
			state.context.messages.push(message);
			newMessages.push(message);
			injectedMessage = true;
		}
		return injectedMessage;
	};
	while (true) {
		let hasMoreToolCalls = true;
		while (hasMoreToolCalls || pendingMessages.length > 0) {
			if (await stopIfAborted()) return newMessages;
			if (!firstTurn) {
				await emit({ type: "turn_start" });
				turnOpen = true;
			} else firstTurn = false;
			if (pendingMessages.length > 0) {
				if (!await commitPendingMessages() && !hasMoreToolCalls) continue;
			}
			if (await stopIfAborted()) return newMessages;
			let streamedSteering = [];
			const streamedConfig = {
				...config,
				getSteeringMessages: async () => {
					if (streamedSteering.length === 0) streamedSteering = await getSteeringAtCheckpoint(config);
					return streamedSteering;
				}
			};
			const streamed = await streamAgentResponse(state.context, config, signal, emit, newMessages, async (assistantMessage, toolCalls, executionSignal, toolEmit, scheduling) => {
				const batch = await executeToolCalls(state.context, assistantMessage, streamedConfig, executionSignal, toolEmit, toolLoopRecoveryState.criticalToolLoopSeen, toolCalls, scheduling, scheduling.hasUnobservedAsyncToolResults);
				if (batch.intervention) toolLoopRecoveryState.criticalToolLoopSeen = true;
				return batch;
			}, (message) => withAssistantTurnTaint(message, turnTainted), streamFn, runtime);
			const { message } = streamed;
			const providerFailed = message.stopReason === "error" || message.stopReason === "aborted";
			const remainingToolCalls = providerFailed ? [] : message.content.filter((item) => item.type === "toolCall" && !streamed.executedIds.has(item.id) && (message.stopReason === "toolUse" || item.async === true));
			const terminalToolBatch = remainingToolCalls.length > 0 ? await executeToolCalls(state.context, message, streamedSteering.length > 0 ? streamedConfig : config, signal, emit, toolLoopRecoveryState.criticalToolLoopSeen, remainingToolCalls, void 0, streamed.executedIds.size > 0) : void 0;
			const batches = [...streamed.batches, ...terminalToolBatch ? [terminalToolBatch] : []];
			const executedToolBatch = batches.length ? {
				messages: batches.flatMap((batch) => batch.messages),
				steeringMessages: [...new Set(batches.flatMap((batch) => batch.steeringMessages))],
				terminate: batches.every((batch) => batch.terminate),
				terminateRun: batches.some((batch) => batch.terminateRun),
				intervention: batches.find((batch) => batch.intervention)?.intervention,
				fatal: batches.find((batch) => batch.fatal)?.fatal
			} : void 0;
			const toolResults = executedToolBatch?.messages ?? [];
			turnTainted ||= toolResults.some(toolResultTaintsTurn);
			hasMoreToolCalls = streamed.continuationRequired || message.stopReason === "stop" && message.endTurn === false && !executedToolBatch?.terminate || executedToolBatch !== void 0 && !executedToolBatch.terminate;
			pendingMessages = executedToolBatch?.steeringMessages ?? [];
			if (executedToolBatch?.intervention) toolLoopRecoveryState.criticalToolLoopSeen = true;
			for (const result of terminalToolBatch?.messages ?? []) {
				state.context.messages.push(result);
				newMessages.push(result);
			}
			await emit({
				type: "turn_end",
				message,
				toolResults
			});
			turnOpen = false;
			if (executedToolBatch?.fatal) throw executedToolBatch.fatal.error;
			if (message.stopReason === "aborted") {
				if (signal?.aborted && !isTurnHandoffAbort(signal)) await appendInterruptedTurnMessage(newMessages, emit);
				await emit({
					type: "agent_end",
					messages: newMessages
				});
				return newMessages;
			}
			if (await stopIfAborted()) return newMessages;
			if (executedToolBatch?.terminateRun) {
				const terminalMessage = {
					...createFailureMessage(config.model, /* @__PURE__ */ new Error(TOOL_LOOP_RECOVERY_TERMINATED_MESSAGE), false),
					content: [{
						type: "text",
						text: TOOL_LOOP_RECOVERY_TERMINATED_MESSAGE
					}]
				};
				state.context.messages.push(terminalMessage);
				newMessages.push(terminalMessage);
				await emit({ type: "turn_start" });
				turnOpen = true;
				await emit({
					type: "message_start",
					message: terminalMessage
				});
				await emit({
					type: "message_end",
					message: terminalMessage
				});
				await emit({
					type: "turn_end",
					message: terminalMessage,
					toolResults: []
				});
				turnOpen = false;
				await emit({
					type: "agent_end",
					messages: newMessages
				});
				return newMessages;
			}
			if (providerFailed) {
				await emit({
					type: "agent_end",
					messages: newMessages
				});
				return newMessages;
			}
			const nextTurnSnapshot = await config.prepareNextTurn?.({
				message,
				toolResults,
				context: state.context,
				newMessages
			});
			if (nextTurnSnapshot) {
				state.context = nextTurnSnapshot.context ?? state.context;
				const nextModel = nextTurnSnapshot.model ?? config.model;
				const nextThinkingLevel = nextTurnSnapshot.thinkingLevel ?? config.thinkingLevel;
				const nextReasoning = (nextTurnSnapshot.thinkingLevel !== void 0 || nextTurnSnapshot.model !== void 0 && nextThinkingLevel !== void 0) && nextThinkingLevel !== void 0 ? resolveAgentReasoningOption(nextModel, nextThinkingLevel) : config.reasoning;
				config = Object.assign({}, config, {
					model: nextModel,
					thinkingLevel: nextThinkingLevel,
					reasoning: nextReasoning
				});
			}
			if (await stopIfAborted()) return newMessages;
			if (pendingMessages.length === 0) {
				if (!nextTurnSnapshot?.stop && await config.shouldStopAfterTurn?.({
					message,
					toolResults,
					context: state.context,
					newMessages
				})) {
					await emit({
						type: "agent_end",
						messages: newMessages
					});
					return newMessages;
				}
				const steering = getSteeringAtCheckpoint(config);
				pendingMessages = Array.isArray(steering) ? steering : await steering;
			}
			if (await stopIfAborted()) return newMessages;
			if (nextTurnSnapshot?.stop) {
				await commitPendingMessages();
				await emit({
					type: "agent_end",
					messages: newMessages
				});
				return newMessages;
			}
		}
		pendingMessages = await config.getFollowUpMessages?.() || [];
		if (pendingMessages.length === 0) {
			const finalSteering = getSteeringAtCheckpoint(config);
			pendingMessages = Array.isArray(finalSteering) ? finalSteering : await finalSteering;
		}
		if (pendingMessages.length === 0) break;
	}
	await emit({
		type: "agent_end",
		messages: newMessages
	});
	return newMessages;
}
/**
* Execute tool calls from an assistant message.
*/
async function executeToolCalls(currentContext, assistantMessage, config, signal, emit, criticalToolLoopSeen, toolCalls = assistantMessage.content.filter((c) => c.type === "toolCall"), scheduling, hasUnobservedAsyncToolResults = false) {
	const batch = {
		currentContext,
		assistantMessage,
		config,
		signal,
		emit,
		resolved: /* @__PURE__ */ new Map(),
		validated: /* @__PURE__ */ new Map(),
		onParallelStarted: scheduling?.onParallelStarted,
		hasUnobservedAsyncToolResults
	};
	if (config.beforeToolBatch) {
		for (const toolCall of toolCalls) {
			if (signal?.aborted) break;
			batch.validated.set(toolCall, await validateToolCallForBatchAdmission(batch, toolCall));
		}
		const calls = toolCalls.flatMap((toolCall) => {
			const validation = batch.validated.get(toolCall);
			return validation?.kind === "prepared" ? [{
				toolCall,
				args: validation.args,
				tool: validation.tool
			}] : [];
		});
		if (calls.length > 0 && !signal?.aborted) {
			const admission = await config.beforeToolBatch({
				assistantMessage,
				calls,
				context: currentContext
			}, signal);
			if (admission?.intervention) return await completeToolLoopInterventionBatch(batch, {
				toolCalls,
				intervention: admission.intervention,
				terminal: criticalToolLoopSeen
			});
			batch.lifecycle = admission ? takeInternalToolBatchLifecycle(admission) : void 0;
			batch.warnings = admission?.warnings;
		}
	}
	let hasSequentialToolCall = false;
	if (config.toolExecution !== "sequential") for (const toolCall of toolCalls) {
		if (signal?.aborted) break;
		const resolution = await resolveToolCallTool(batch, toolCall);
		if (resolution.kind === "resolved" && resolution.tool?.executionMode === "sequential") {
			hasSequentialToolCall = true;
			break;
		}
	}
	const sequential = config.toolExecution === "sequential" || hasSequentialToolCall;
	if (sequential && scheduling) await scheduling.waitForPrevious();
	return executeToolCallGroups(batch, toolCalls, sequential);
}
function hidesToolCallFromChannelProgress(context, toolCall, resolvedToolCalls) {
	const resolution = resolvedToolCalls.get(toolCall);
	return (resolution?.kind === "resolved" ? resolution.tool : context.tools?.find((candidate) => candidate.name === toolCall.name))?.hideFromChannelProgress === true;
}
function validatedToolCallIds(batch, calls) {
	return calls.filter((call) => batch.validated.get(call)?.kind === "prepared").map((call) => call.id);
}
async function executeToolCallGroups(batch, toolCalls, sequential) {
	const finalizedCalls = [];
	const messages = [];
	let steeringMessages = [];
	let cursor = 0;
	let fatal;
	while (cursor < toolCalls.length) {
		if (sequential && !batch.signal?.aborted) {
			const steering = getSteeringAtCheckpoint(batch.config);
			steeringMessages = Array.isArray(steering) ? steering : await steering;
		}
		if (steeringMessages.length > 0) {
			batch.lifecycle?.releaseSkippedCalls(validatedToolCallIds(batch, toolCalls.slice(cursor)));
			break;
		}
		const entries = [];
		try {
			while (cursor < toolCalls.length) {
				const toolCall = toolCalls[cursor++];
				if (!toolCall) continue;
				const entry = await prepareToolCallEntry(batch, toolCall);
				entries.push(entry);
				if (!("kind" in entry)) await emitToolExecutionEnd(entry, batch.emit);
				if (sequential || batch.signal?.aborted) break;
			}
			const hasReady = entries.some((entry) => "kind" in entry);
			if (!batch.signal?.aborted && (!sequential || hasReady)) {
				const steering = getSteeringAtCheckpoint(batch.config);
				steeringMessages = Array.isArray(steering) ? steering : await steering;
			}
			const ordered = entries.map((entry) => "kind" in entry ? void 0 : entry);
			const settle = async (index, entry, outcome) => {
				try {
					const finalized = await finalizeExecutedToolCall(batch, entry, outcome, entry.execution.args);
					if (sequential) entry.execution.dispose();
					await emitToolExecutionEnd(finalized, batch.emit);
					ordered[index] = finalized;
				} finally {
					entry.execution.dispose();
				}
			};
			const launched = steeringMessages.length > 0 || sequential && !hasReady ? void 0 : await launchParallelToolCalls(entries, batch.lifecycle);
			if (!sequential && launched?.started.length && !launched.rejected) batch.onParallelStarted?.();
			for (const { index, entry, outcome } of launched?.completed ?? []) await settle(index, entry, outcome);
			fatal = launched?.rejected ? { error: launched.rejected.error } : void 0;
			const skippedIndex = steeringMessages.length > 0 ? 0 : launched?.rejected?.index ?? entries.length;
			if (sequential && steeringMessages.length > 0) {
				for (const entry of entries) if ("kind" in entry) entry.execution.dispose();
			}
			if (steeringMessages.length > 0 || fatal) {
				const skippedIds = [...entries.slice(skippedIndex).flatMap((entry) => "kind" in entry ? [entry.toolCall.id] : []), ...validatedToolCallIds(batch, toolCalls.slice(cursor))];
				if (sequential || fatal || skippedIds.length > 0) batch.lifecycle?.releaseSkippedCalls(skippedIds);
			}
			for (let index = skippedIndex; index < entries.length; index++) {
				const entry = entries[index];
				if (!entry || !("kind" in entry)) continue;
				if (!sequential) entry.execution.dispose();
				ordered[index] = await completeUnstartedToolCall(batch, entry.toolCall, {
					reason: fatal ? "admission" : "steering",
					args: entry.execution.args,
					startEmitted: true
				});
			}
			if (launched) await Promise.all(launched.started.map(async ({ index, entry, outcome }) => settle(index, entry, await outcome)));
			for (const finalized of ordered) if (finalized) {
				messages.push(await emitToolResultMessage(finalized, batch.emit));
				finalizedCalls.push(finalized);
			}
		} finally {
			for (const entry of entries) if ("kind" in entry) entry.execution.dispose();
		}
		if (steeringMessages.length > 0 || fatal || batch.signal?.aborted) break;
	}
	if (sequential && !fatal && !batch.signal?.aborted && steeringMessages.length === 0) {
		const steering = getSteeringAtCheckpoint(batch.config);
		steeringMessages = Array.isArray(steering) ? steering : await steering;
		if (steeringMessages.length > 0) batch.lifecycle?.releaseSkippedCalls([]);
	}
	const skippedReason = fatal ? "admission" : steeringMessages.length > 0 ? "steering" : void 0;
	for (; cursor < toolCalls.length; cursor++) {
		const toolCall = toolCalls[cursor];
		if (!toolCall) continue;
		const finalized = await completeUnstartedToolCall(batch, toolCall, { reason: skippedReason });
		messages.push(await emitToolResultMessage(finalized, batch.emit));
		finalizedCalls.push(finalized);
	}
	return {
		messages,
		steeringMessages,
		terminate: shouldTerminateToolBatch(finalizedCalls),
		terminateRun: false,
		...fatal ? { fatal } : {}
	};
}
async function prepareToolCallEntry(batch, toolCall) {
	const hideFromChannelProgress = hidesToolCallFromChannelProgress(batch.currentContext, toolCall, batch.resolved);
	await batch.emit({
		type: "tool_execution_start",
		toolCallId: toolCall.id,
		toolName: toolCall.name,
		args: toolCall.arguments,
		...hideFromChannelProgress ? { hideFromChannelProgress: true } : {}
	});
	const preparation = await prepareToolCall(batch, toolCall);
	if (preparation.kind === "immediate") return await finalizeToolCallOutcome(batch, {
		toolCall,
		result: preparation.result,
		isError: preparation.isError,
		executionStarted: false,
		...preparation.errorKind ? { errorKind: preparation.errorKind } : {},
		...hideFromChannelProgress ? { hideFromChannelProgress: true } : {}
	}, toolCall.arguments);
	const execution = await prepareToolCallExecution(preparation, {
		assistantMessage: batch.assistantMessage,
		toolCall: preparation.toolCall,
		hasUnobservedAsyncToolResults: batch.hasUnobservedAsyncToolResults || batch.assistantMessage.content.slice(0, batch.assistantMessage.content.indexOf(toolCall)).some((item) => item.type === "toolCall" && item.async === true)
	}, batch.signal, batch.emit);
	return execution.kind === "immediate" ? await finalizeExecutedToolCall(batch, preparation, execution.outcome, preparation.args) : {
		...preparation,
		execution
	};
}
async function launchParallelToolCalls(entries, batchLifecycle) {
	const ready = entries.flatMap((entry, index) => "kind" in entry ? [{
		entry,
		index
	}] : []);
	const result = {
		started: [],
		completed: []
	};
	let cursor = 0;
	let finish;
	let finished = false;
	const done = new Promise((resolve) => {
		finish = () => {
			if (!finished) {
				finished = true;
				resolve();
			}
		};
	});
	const launchNext = () => {
		const current = ready[cursor++];
		if (!current) {
			finish();
			return;
		}
		const launchState = {};
		let started = false;
		let rejected = false;
		const onStart = () => {
			try {
				batchLifecycle?.commitReadyCalls([{
					toolCallId: current.entry.toolCall.id,
					args: current.entry.execution.args
				}]);
			} catch (error) {
				rejected = true;
				result.rejected = {
					index: current.index,
					error
				};
				finish();
				throw error;
			}
			started = true;
			if (launchState.outcome) result.started.push({
				...current,
				outcome: launchState.outcome
			});
			queueMicrotask(launchNext);
		};
		const outcome = current.entry.execution.execute(onStart);
		launchState.outcome = outcome;
		if (started) result.started.push({
			...current,
			outcome
		});
		outcome.then((completed) => {
			if (!started && !rejected) {
				result.completed.push({
					...current,
					outcome: completed
				});
				queueMicrotask(launchNext);
			}
		}, (error) => {
			if (!rejected) {
				result.rejected = {
					index: current.index,
					error
				};
				finish();
			}
		});
	};
	launchNext();
	await done;
	return result;
}
function shouldTerminateToolBatch(finalizedCalls) {
	return finalizedCalls.length > 0 && finalizedCalls.every((finalized) => finalized.result.terminate === true);
}
function prepareToolCallArguments(tool, toolCall) {
	if (!tool.prepareArguments) return toolCall;
	const preparedArguments = tool.prepareArguments(toolCall.arguments);
	if (preparedArguments === toolCall.arguments) return toolCall;
	return {
		...toolCall,
		arguments: preparedArguments
	};
}
async function resolveToolCallTool(batch, toolCall) {
	const cached = batch.resolved.get(toolCall);
	if (cached) return cached;
	let resolution;
	try {
		let tool = batch.currentContext.tools?.find((t) => t.name === toolCall.name);
		if (!tool) {
			const resolvedTool = await batch.config.resolveDeferredTool?.({
				assistantMessage: batch.assistantMessage,
				toolCall,
				context: batch.currentContext
			}, batch.signal);
			if (resolvedTool && resolvedTool.name !== toolCall.name) throw new Error(`Deferred tool resolver returned "${resolvedTool.name}" for requested "${toolCall.name}"`);
			tool = resolvedTool;
			if (tool) batch.currentContext.tools = [...batch.currentContext.tools ?? [], tool];
		}
		resolution = {
			kind: "resolved",
			...tool ? { tool } : {}
		};
	} catch (error) {
		resolution = {
			kind: "error",
			error
		};
	}
	batch.resolved.set(toolCall, resolution);
	return resolution;
}
async function prepareToolCall(batch, toolCall) {
	const cachedValidation = batch.validated.get(toolCall);
	if (batch.signal?.aborted && !cachedValidation) return {
		kind: "immediate",
		result: createErrorToolResult("Operation aborted"),
		isError: true
	};
	const validation = cachedValidation ?? await validateToolCallForBatchAdmission(batch, toolCall);
	if (validation.kind === "immediate") return validation;
	const { args: validatedArgs } = validation;
	try {
		if (batch.config.beforeToolCall) {
			const beforeResult = await batch.config.beforeToolCall({
				assistantMessage: batch.assistantMessage,
				toolCall,
				args: validatedArgs,
				context: batch.currentContext
			}, batch.signal);
			if (batch.signal?.aborted) return {
				kind: "immediate",
				result: createErrorToolResult("Operation aborted"),
				isError: true
			};
			if (beforeResult?.block) return {
				kind: "immediate",
				result: createErrorToolResult(beforeResult.reason || "Tool execution was blocked"),
				isError: true
			};
		}
		if (batch.signal?.aborted) return {
			kind: "immediate",
			result: createErrorToolResult("Operation aborted"),
			isError: true
		};
		return validation;
	} catch (error) {
		return {
			kind: "immediate",
			result: createErrorToolResult(coerceErrorMessage(error)),
			isError: true
		};
	}
}
async function validateToolCallForBatchAdmission(batch, toolCall) {
	const resolution = await resolveToolCallTool(batch, toolCall);
	if (resolution.kind === "error") return {
		kind: "immediate",
		result: createErrorToolResult(batch.signal?.aborted ? "Operation aborted" : coerceErrorMessage(resolution.error)),
		isError: true
	};
	const tool = resolution.tool;
	if (!tool) return {
		kind: "immediate",
		result: createErrorToolResult(`Tool ${toolCall.name} not found`),
		isError: true
	};
	let preparedToolCall;
	try {
		preparedToolCall = prepareToolCallArguments(tool, toolCall);
	} catch (error) {
		return {
			kind: "immediate",
			result: createErrorToolResult(coerceErrorMessage(error)),
			isError: true
		};
	}
	let validatedArgs;
	try {
		validatedArgs = validateToolArguments(tool, preparedToolCall);
	} catch (error) {
		return {
			kind: "immediate",
			result: createErrorToolResult(coerceErrorMessage(error)),
			isError: true,
			errorKind: "argument-validation"
		};
	}
	return {
		kind: "prepared",
		toolCall,
		tool,
		args: validatedArgs
	};
}
async function prepareToolCallExecution(prepared, executionContext, signal, emit) {
	const updateEvents = [];
	let acceptingUpdates = true;
	const onUpdate = (partialResult) => {
		if (!acceptingUpdates) return;
		updateEvents.push(Promise.resolve(emit({
			type: "tool_execution_update",
			toolCallId: prepared.toolCall.id,
			toolName: prepared.toolCall.name,
			args: prepared.toolCall.arguments,
			partialResult,
			...prepared.tool.hideFromChannelProgress === true ? { hideFromChannelProgress: true } : {}
		})));
	};
	const finishUpdates = async () => {
		acceptingUpdates = false;
		await Promise.all(updateEvents);
	};
	const immediateError = async (error) => {
		await finishUpdates();
		return {
			kind: "immediate",
			outcome: {
				result: createToolExecutionErrorResult(error),
				isError: true,
				executionStarted: false
			}
		};
	};
	const readyExecution = (args, run, disposeSource = () => {}) => {
		let disposed = false;
		const dispose = () => {
			if (!disposed) {
				disposed = true;
				acceptingUpdates = false;
				disposeSource();
			}
		};
		return {
			kind: "ready",
			args,
			dispose,
			async execute(onImplementationStart) {
				let executionStarted = false;
				let implementationStartError;
				try {
					if (signal?.aborted) return {
						result: createErrorToolResult("Operation aborted"),
						isError: true,
						executionStarted: false
					};
					try {
						const result = await run(() => {
							try {
								onImplementationStart?.();
							} catch (error) {
								implementationStartError = { error };
								throw error;
							}
							executionStarted = true;
						});
						if (implementationStartError) throw implementationStartError.error;
						return {
							result,
							isError: false,
							executionStarted
						};
					} catch (error) {
						if (implementationStartError) throw implementationStartError.error;
						return {
							result: createToolExecutionErrorResult(error),
							isError: true,
							executionStarted,
							...executionStarted && signal?.aborted && error === signal.reason ? { callerCancelled: true } : {}
						};
					}
				} finally {
					await finishUpdates();
					dispose();
				}
			}
		};
	};
	const preparer = getInternalToolExecutionPreparer(prepared.tool);
	if (!preparer) return readyExecution(prepared.args, async (onImplementationStart) => {
		if (signal?.aborted) throw signal.reason ?? /* @__PURE__ */ new Error("Operation aborted");
		return await runWithAgentToolExecutionContext(executionContext, () => {
			onImplementationStart();
			return prepared.tool.execute(prepared.toolCall.id, prepared.args, signal, onUpdate);
		});
	});
	let internalPreparation;
	try {
		internalPreparation = await runWithAgentToolExecutionContext(executionContext, () => preparer({
			toolCallId: prepared.toolCall.id,
			args: prepared.args,
			...signal ? { signal } : {},
			onUpdate
		}));
	} catch (error) {
		return await immediateError(error);
	}
	if (internalPreparation.kind === "immediate") {
		internalPreparation.dispose();
		await finishUpdates();
		return {
			kind: "immediate",
			outcome: internalPreparation.outcome.kind === "result" ? {
				result: internalPreparation.outcome.result,
				isError: internalPreparation.outcome.isError,
				executionStarted: false
			} : {
				result: createToolExecutionErrorResult(internalPreparation.outcome.error),
				isError: true,
				executionStarted: false
			}
		};
	}
	const readyPreparation = internalPreparation;
	return readyExecution(readyPreparation.args, (onImplementationStart) => runWithAgentToolExecutionContext(executionContext, () => readyPreparation.execute(onImplementationStart)), readyPreparation.dispose);
}
async function finalizeExecutedToolCall(batch, prepared, executed, finalArgs) {
	let result = executed.result;
	let isError = executed.isError;
	if (executed.executionStarted && batch.config.afterToolCall) try {
		const afterResult = await batch.config.afterToolCall({
			assistantMessage: batch.assistantMessage,
			toolCall: prepared.toolCall,
			args: finalArgs,
			result,
			isError,
			context: batch.currentContext
		}, batch.signal);
		if (afterResult) {
			result = copyInternalToolResultState(result, {
				...result,
				content: afterResult.content ?? result.content,
				details: afterResult.details ?? result.details,
				terminate: afterResult.terminate ?? result.terminate
			});
			isError = afterResult.isError ?? isError;
		}
	} catch (error) {
		result = createErrorToolResult(coerceErrorMessage(error));
		isError = true;
	}
	return await finalizeToolCallOutcome(batch, {
		toolCall: prepared.toolCall,
		result,
		isError,
		executionStarted: executed.executionStarted,
		...prepared.tool.hideFromChannelProgress === true ? { hideFromChannelProgress: true } : {},
		...executed.executionStarted && !executed.callerCancelled && prepared.tool.resultContentSource ? { resultContentSource: prepared.tool.resultContentSource } : {}
	}, finalArgs);
}
async function finalizeToolCallOutcome(batch, finalized, args) {
	const outcome = await applyToolOutcomeHook(batch, finalized, args);
	const warning = batch.warnings?.find((entry) => entry.toolCallId === outcome.toolCall.id);
	return warning ? {
		...outcome,
		result: appendToolLoopWarning(outcome.result, warning)
	} : outcome;
}
async function applyToolOutcomeHook(batch, finalized, args) {
	if (!batch.config.afterToolOutcome) return finalized;
	try {
		const afterResult = await batch.config.afterToolOutcome({
			assistantMessage: batch.assistantMessage,
			toolCall: finalized.toolCall,
			args,
			result: finalized.result,
			isError: finalized.isError,
			executionStarted: finalized.executionStarted,
			...finalized.errorKind ? { errorKind: finalized.errorKind } : {},
			context: batch.currentContext
		}, batch.signal);
		if (!afterResult) return finalized;
		return {
			...finalized,
			result: copyInternalToolResultState(finalized.result, {
				...finalized.result,
				content: afterResult.content ?? finalized.result.content,
				details: afterResult.details ?? finalized.result.details,
				terminate: afterResult.terminate ?? finalized.result.terminate
			}),
			isError: afterResult.isError ?? finalized.isError
		};
	} catch (error) {
		const errorResult = createErrorToolResult(coerceErrorMessage(error));
		return {
			...finalized,
			result: {
				...errorResult,
				...finalized.result.terminate === void 0 ? {} : { terminate: finalized.result.terminate }
			},
			isError: true
		};
	}
}
async function completeToolLoopInterventionBatch(batch, params) {
	const messages = [];
	const finalizedCalls = [];
	for (const toolCall of params.toolCalls) {
		const hideFromChannelProgress = hidesToolCallFromChannelProgress(batch.currentContext, toolCall, batch.resolved);
		await batch.emit({
			type: "tool_execution_start",
			toolCallId: toolCall.id,
			toolName: toolCall.name,
			args: toolCall.arguments,
			...hideFromChannelProgress ? { hideFromChannelProgress: true } : {}
		});
		const isTrigger = toolCall.id === params.intervention.toolCallId;
		const text = params.terminal ? isTrigger ? `${params.intervention.reason}\n\nCritical tool-loop recovery failed because another critical loop was detected. This run is stopping now.` : "This tool was not executed because another call in the batch repeated a critical tool loop. This run is stopping now." : isTrigger ? `${params.intervention.reason}\n\nDo not repeat this exact tool action. Reassess the task. You may answer the user, ask for clarification, or continue with a different tool or different arguments.` : "This tool was not executed because another call in the batch triggered critical tool-loop recovery. Reassess the task before choosing the next action.";
		const validation = batch.validated.get(toolCall);
		const finalized = await finalizeToolCallOutcome(batch, {
			toolCall,
			result: {
				content: [{
					type: "text",
					text
				}],
				details: {
					status: "blocked",
					deniedReason: "tool-loop",
					intervention: params.intervention
				},
				...params.terminal ? { terminate: true } : {}
			},
			isError: true,
			executionStarted: false,
			...hideFromChannelProgress ? { hideFromChannelProgress: true } : {}
		}, validation?.kind === "prepared" ? validation.args : toolCall.arguments);
		await emitToolExecutionEnd(finalized, batch.emit);
		messages.push(await emitToolResultMessage(finalized, batch.emit));
		finalizedCalls.push(finalized);
	}
	return {
		messages,
		steeringMessages: [],
		terminate: params.terminal || shouldTerminateToolBatch(finalizedCalls),
		terminateRun: params.terminal,
		intervention: params.intervention
	};
}
async function completeUnstartedToolCall(batch, toolCall, options = {}) {
	const hideFromChannelProgress = hidesToolCallFromChannelProgress(batch.currentContext, toolCall, batch.resolved);
	if (!options.startEmitted) await batch.emit({
		type: "tool_execution_start",
		toolCallId: toolCall.id,
		toolName: toolCall.name,
		args: toolCall.arguments,
		...hideFromChannelProgress ? { hideFromChannelProgress: true } : {}
	});
	const finalized = await finalizeToolCallOutcome(batch, {
		toolCall,
		result: createErrorToolResult(options.reason === "admission" ? TOOL_ADMISSION_FAILURE_MESSAGE : options.reason === "steering" ? STEERING_TOOL_SKIP_MESSAGE : "Operation aborted", options.reason === "admission" ? TOOL_ADMISSION_FAILURE_DETAILS : options.reason === "steering" ? {
			status: "skipped",
			deniedReason: "steering"
		} : void 0),
		isError: true,
		executionStarted: false,
		...hideFromChannelProgress ? { hideFromChannelProgress: true } : {}
	}, "args" in options ? options.args : toolCall.arguments);
	await emitToolExecutionEnd(finalized, batch.emit);
	return finalized;
}
function createToolExecutionErrorResult(error) {
	const result = createErrorToolResult(coerceErrorMessage(error));
	return typeof error === "object" && error !== null ? copyInternalToolResultState(error, result) : result;
}
function createErrorToolResult(message, details = {}) {
	return {
		content: [{
			type: "text",
			text: message
		}],
		details
	};
}
async function emitToolExecutionEnd(finalized, emit) {
	await emit({
		type: "tool_execution_end",
		toolCallId: finalized.toolCall.id,
		toolName: finalized.toolCall.name,
		result: finalized.result,
		isError: finalized.isError,
		executionStarted: finalized.executionStarted,
		...finalized.errorKind ? { errorKind: finalized.errorKind } : {},
		...finalized.hideFromChannelProgress === true ? { hideFromChannelProgress: true } : {}
	});
}
async function emitToolResultMessage(finalized, emit) {
	const message = copyInternalToolResultState(finalized.result, withToolResultContentSource({
		role: "toolResult",
		toolCallId: finalized.toolCall.id,
		toolName: finalized.toolCall.name,
		content: finalized.result.content ?? [],
		details: finalized.result.details,
		isError: finalized.isError,
		timestamp: Date.now()
	}, finalized.resultContentSource));
	await emit({
		type: "message_start",
		message
	});
	await emit({
		type: "message_end",
		message
	});
	return message;
}
function readTurnTaintMetadata(message) {
	const metadata = Reflect.get(message, "__openclaw");
	const record = asOptionalRecord(metadata);
	if (!record) return;
	return {
		...record.resultContentSource === "network" ? { resultContentSource: record.resultContentSource } : {},
		...record.turnTainted === true ? { turnTainted: true } : {}
	};
}
function toolResultTaintsTurn(message) {
	return readTurnTaintMetadata(message)?.resultContentSource === "network";
}
function isActiveTurnTainted(messages) {
	for (const message of messages.toReversed()) {
		if (message.role === "user") return false;
		const metadata = readTurnTaintMetadata(message);
		if (metadata?.turnTainted === true || metadata?.resultContentSource === "network") return true;
	}
	return false;
}
function withAssistantTurnTaint(message, tainted) {
	if (!tainted) return message;
	return {
		...message,
		__openclaw: {
			...readTurnTaintMetadata(message),
			turnTainted: true
		}
	};
}
function withToolResultContentSource(message, source) {
	if (!source) return message;
	return {
		...message,
		__openclaw: {
			...readTurnTaintMetadata(message),
			resultContentSource: source
		}
	};
}
//#endregion
//#region packages/agent-core/src/agent.ts
function defaultConvertToLlm(messages) {
	return messages.filter((message) => message.role === "user" || message.role === "assistant" || message.role === "toolResult");
}
const DEFAULT_MODEL = {
	id: "unknown",
	name: "unknown",
	api: "unknown",
	provider: "unknown",
	baseUrl: "",
	reasoning: false,
	input: [],
	cost: {
		input: 0,
		output: 0,
		cacheRead: 0,
		cacheWrite: 0
	},
	contextWindow: 0,
	maxTokens: 0
};
function createMutableAgentState(initialState) {
	let tools = initialState?.tools?.slice() ?? [];
	let messages = initialState?.messages?.slice() ?? [];
	return {
		systemPrompt: initialState?.systemPrompt ?? "",
		model: initialState?.model ?? DEFAULT_MODEL,
		thinkingLevel: initialState?.thinkingLevel ?? "off",
		get tools() {
			return tools;
		},
		set tools(nextTools) {
			tools = nextTools.slice();
		},
		get messages() {
			return messages;
		},
		set messages(nextMessages) {
			messages = nextMessages.slice();
		},
		isStreaming: false,
		streamingMessage: void 0,
		pendingToolCalls: /* @__PURE__ */ new Set(),
		errorMessage: void 0
	};
}
var PendingMessageQueue = class {
	constructor(mode) {
		this.messages = [];
		this.listeners = /* @__PURE__ */ new Set();
		this.submitted = /* @__PURE__ */ new Set();
		this.inFlight = [];
		this.cancelled = /* @__PURE__ */ new WeakSet();
		this.mode = mode;
	}
	enqueue(message) {
		this.messages.push(message);
		for (const listener of this.listeners) listener();
	}
	peek() {
		return (this.inFlight.length > 0 ? this.inFlight : this.messages).slice(0, this.mode === "all" ? void 0 : 1);
	}
	subscribe(listener) {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}
	reserve(messages) {
		for (const message of messages) this.submitted.add(message);
		return () => {
			for (const message of messages) this.submitted.delete(message);
		};
	}
	hasItems() {
		return this.messages.length > 0;
	}
	drain() {
		let count = this.mode === "all" ? this.messages.length : 1;
		const boundary = this.messages.findIndex((message) => !this.submitted.has(message));
		if (boundary > 0) count = Math.min(count, boundary);
		const drained = this.messages.splice(0, count);
		this.inFlight.push(...drained);
		return drained;
	}
	commit(message) {
		this.submitted.delete(message);
		this.cancelled.delete(message);
		const index = this.inFlight.indexOf(message);
		if (index >= 0) this.inFlight.splice(index, 1);
	}
	restore() {
		this.messages = [...this.inFlight, ...this.messages];
		this.inFlight = [];
		this.submitted.clear();
	}
	cancelFirst(predicate) {
		const pendingIndex = this.messages.findIndex(predicate);
		const pendingMessage = this.messages[pendingIndex];
		if (pendingMessage) {
			if (this.submitted.has(pendingMessage)) return;
			return this.messages.splice(pendingIndex, 1)[0];
		}
		const inFlightIndex = this.inFlight.findIndex(predicate);
		const message = this.inFlight[inFlightIndex];
		if (!message || this.submitted.has(message)) return;
		this.inFlight.splice(inFlightIndex, 1);
		this.cancelled.add(message);
		return message;
	}
	consumeCancellation(message) {
		return this.cancelled.delete(message);
	}
	clear() {
		this.messages = this.messages.filter((message) => this.submitted.has(message));
		this.inFlight = this.inFlight.filter((message) => this.submitted.has(message));
		this.cancelled = /* @__PURE__ */ new WeakSet();
	}
};
/**
* Stateful wrapper around the low-level agent loop.
*
* `Agent` owns the current transcript, emits lifecycle events, executes tools,
* and exposes queueing APIs for steering and follow-up messages.
*/
var Agent$1 = class {
	constructor(options = {}) {
		this.listeners = /* @__PURE__ */ new Set();
		this.toolLoopRecoveryState = { criticalToolLoopSeen: false };
		this.mutableState = createMutableAgentState(options.initialState);
		this.convertToLlm = options.convertToLlm ?? defaultConvertToLlm;
		this.transformContext = options.transformContext;
		this.runtime = options.runtime;
		this.streamFn = resolveAgentCoreStreamFn(options.runtime, options.streamFn);
		this.getApiKey = options.getApiKey;
		this.onPayload = options.onPayload;
		this.onResponse = options.onResponse;
		this.beforeToolCall = options.beforeToolCall;
		this.resolveDeferredTool = options.resolveDeferredTool;
		this.afterToolCall = options.afterToolCall;
		this.afterToolOutcome = options.afterToolOutcome;
		this.prepareNextTurn = options.prepareNextTurn;
		this.prepareNextTurnWithContext = options.prepareNextTurnWithContext;
		this.steeringQueue = new PendingMessageQueue(options.steeringMode ?? "one-at-a-time");
		this.followUpQueue = new PendingMessageQueue(options.followUpMode ?? "one-at-a-time");
		this.sessionId = options.sessionId;
		this.thinkingBudgets = options.thinkingBudgets;
		this.transport = options.transport ?? "auto";
		this.maxRetryDelayMs = options.maxRetryDelayMs;
		this.toolExecution = options.toolExecution ?? "parallel";
	}
	/**
	* Subscribe to agent lifecycle events.
	*
	* Listener promises are awaited in subscription order and are included in
	* the current run's settlement. Listeners also receive the active abort
	* signal for the current run.
	*
	* `agent_end` is the final emitted event for a run, but the agent does not
	* become idle until all awaited listeners for that event have settled.
	*/
	subscribe(listener) {
		this.listeners.add(listener);
		return () => this.listeners.delete(listener);
	}
	/**
	* Current agent state.
	*
	* Assigning `state.tools` or `state.messages` copies the provided top-level array.
	*/
	get state() {
		return this.mutableState;
	}
	/** Controls how queued steering messages are drained. */
	set steeringMode(mode) {
		this.steeringQueue.mode = mode;
	}
	get steeringMode() {
		return this.steeringQueue.mode;
	}
	/** Controls how queued follow-up messages are drained. */
	set followUpMode(mode) {
		this.followUpQueue.mode = mode;
	}
	get followUpMode() {
		return this.followUpQueue.mode;
	}
	/**
	* Queue a message for the active run. Running tools finish, while sequential
	* tail calls or a parallel batch that has not launched yet are skipped.
	*/
	steer(message) {
		this.steeringQueue.enqueue(message);
	}
	/** Cancel queued input unless a live provider response may already have admitted it. */
	cancelSteeringMessage(predicate) {
		return this.steeringQueue.cancelFirst(predicate);
	}
	/** Queue a message to run only after the agent would otherwise stop. */
	followUp(message) {
		this.followUpQueue.enqueue(message);
	}
	/** Remove queued steering messages that have not been submitted to a live response. */
	clearSteeringQueue() {
		this.steeringQueue.clear();
	}
	/** Remove all queued follow-up messages. */
	clearFollowUpQueue() {
		this.followUpQueue.clear();
	}
	/** Remove all queued steering and follow-up messages. */
	clearAllQueues() {
		this.clearSteeringQueue();
		this.clearFollowUpQueue();
	}
	/** Returns true when either queue still contains pending messages. */
	hasQueuedMessages() {
		return this.steeringQueue.hasItems() || this.followUpQueue.hasItems();
	}
	/** Active abort signal for the current run, if any. */
	get signal() {
		return this.activeRun?.abortController.signal;
	}
	/** Abort the current run, if one is active. */
	abort(reason) {
		this.activeRun?.abortController.abort(reason);
	}
	/**
	* Resolve when the current run and all awaited event listeners have finished.
	*
	* This resolves after `agent_end` listeners settle.
	*/
	waitForIdle() {
		return this.activeRun?.promise ?? Promise.resolve();
	}
	/** Clear transcript state, runtime state, and queued messages. */
	reset() {
		this.mutableState.messages = [];
		this.mutableState.isStreaming = false;
		this.mutableState.streamingMessage = void 0;
		this.mutableState.pendingToolCalls = /* @__PURE__ */ new Set();
		this.mutableState.errorMessage = void 0;
		this.toolLoopRecoveryState.criticalToolLoopSeen = false;
		this.clearAllQueues();
	}
	async prompt(input, images) {
		if (this.activeRun) throw new Error("Agent is already processing a prompt. Use steer() or followUp() to queue messages, or wait for completion.");
		this.toolLoopRecoveryState.criticalToolLoopSeen = false;
		const messages = this.normalizePromptInput(input, images);
		await this.runPromptMessages(messages);
	}
	/** Continue from the current transcript. The last message must be a user or tool-result message. */
	async continue() {
		if (this.activeRun) throw new Error("Agent is already processing. Wait for completion before continuing.");
		const lastMessage = this.mutableState.messages[this.mutableState.messages.length - 1];
		if (!lastMessage) throw new Error("No messages to continue from");
		if (lastMessage.role === "assistant" || lastMessage.role === "toolResult") {
			const queuedSteering = this.steeringQueue.drain();
			if (queuedSteering.length > 0) {
				await this.runPromptMessages(queuedSteering, { skipInitialSteeringPoll: true });
				return;
			}
			const queuedFollowUps = this.followUpQueue.drain();
			if (queuedFollowUps.length > 0) {
				await this.runPromptMessages(queuedFollowUps);
				return;
			}
		}
		if (lastMessage.role === "assistant") throw new TranscriptNotContinuableError(lastMessage.role);
		await this.runContinuation();
	}
	normalizePromptInput(input, images) {
		if (Array.isArray(input)) return input;
		if (typeof input !== "string") return [input];
		const content = [{
			type: "text",
			text: input
		}];
		if (images && images.length > 0) content.push(...images);
		return [{
			role: "user",
			content,
			timestamp: Date.now()
		}];
	}
	async runPromptMessages(messages, options = {}) {
		await this.runWithLifecycle(async (signal) => {
			await runAgentLoop(messages, this.createContextSnapshot(), this.createLoopConfig(options), (event) => this.processEvents(event), signal, this.streamFn);
		});
	}
	async runContinuation() {
		await this.runWithLifecycle(async (signal) => {
			await runAgentLoopContinue(this.createContextSnapshot(), this.createLoopConfig(), (event) => this.processEvents(event), signal, this.streamFn);
		});
	}
	createContextSnapshot() {
		return {
			systemPrompt: this.mutableState.systemPrompt,
			messages: this.mutableState.messages.slice(),
			tools: this.mutableState.tools.slice()
		};
	}
	createLoopConfig(options = {}) {
		let skipInitialSteeringPoll = options.skipInitialSteeringPoll === true;
		const drainSteeringMessages = () => {
			if (skipInitialSteeringPoll) {
				skipInitialSteeringPoll = false;
				return [];
			}
			return this.steeringQueue.drain();
		};
		const getSteeringMessages = attachInternalSyncSteeringGetter(async () => drainSteeringMessages(), drainSteeringMessages, {
			peek: () => this.steeringQueue.peek(),
			reserve: (messages) => this.steeringQueue.reserve(messages),
			subscribe: (listener) => this.steeringQueue.subscribe(listener)
		});
		return {
			model: this.mutableState.model,
			thinkingLevel: this.mutableState.thinkingLevel,
			reasoning: resolveAgentReasoningOption(this.mutableState.model, this.mutableState.thinkingLevel),
			sessionId: this.sessionId,
			onPayload: this.onPayload,
			onResponse: this.onResponse,
			transport: this.transport,
			thinkingBudgets: this.thinkingBudgets,
			maxRetryDelayMs: this.maxRetryDelayMs,
			toolExecution: this.toolExecution,
			beforeToolCall: this.beforeToolCall,
			beforeToolBatch: getInternalBeforeToolBatch(this),
			toolLoopRecoveryState: this.toolLoopRecoveryState,
			resolveDeferredTool: this.resolveDeferredTool,
			afterToolCall: this.afterToolCall,
			afterToolOutcome: this.afterToolOutcome,
			prepareNextTurn: this.prepareNextTurnWithContext || this.prepareNextTurn ? async (context) => {
				if (this.prepareNextTurnWithContext) return await this.prepareNextTurnWithContext(context, this.signal);
				return await this.prepareNextTurn?.(this.signal);
			} : void 0,
			convertToLlm: this.convertToLlm,
			transformContext: this.transformContext,
			getApiKey: this.getApiKey,
			getSteeringMessages,
			getFollowUpMessages: async () => this.followUpQueue.drain(),
			consumeQueuedMessageCancellation: (message) => this.steeringQueue.consumeCancellation(message) || this.followUpQueue.consumeCancellation(message)
		};
	}
	async runWithLifecycle(executor) {
		if (this.activeRun) throw new Error("Agent is already processing.");
		const abortController = new AbortController();
		let resolvePromise = () => {};
		const promise = new Promise((resolve) => {
			resolvePromise = resolve;
		});
		this.activeRun = {
			promise,
			resolve: resolvePromise,
			abortController
		};
		this.mutableState.isStreaming = true;
		this.mutableState.streamingMessage = void 0;
		this.mutableState.errorMessage = void 0;
		try {
			await executor(abortController.signal);
		} catch (error) {
			await this.handleRunFailure(error, abortController.signal.aborted);
		} finally {
			this.finishRun();
		}
	}
	async handleRunFailure(error, aborted) {
		const failureMessage = createFailureMessage(this.mutableState.model, error, aborted);
		await this.processEvents({
			type: "message_start",
			message: failureMessage
		});
		await this.processEvents({
			type: "message_end",
			message: failureMessage
		});
		await this.processEvents({
			type: "turn_end",
			message: failureMessage,
			toolResults: []
		});
		const messages = [failureMessage];
		if (aborted && !isTurnHandoffAbort(this.signal)) await appendInterruptedTurnMessage(messages, (event) => this.processEvents(event));
		await this.processEvents({
			type: "agent_end",
			messages
		});
	}
	finishRun() {
		this.steeringQueue.restore();
		this.followUpQueue.restore();
		this.mutableState.isStreaming = false;
		this.mutableState.streamingMessage = void 0;
		this.mutableState.pendingToolCalls = /* @__PURE__ */ new Set();
		this.activeRun?.resolve();
		this.activeRun = void 0;
	}
	/**
	* Reduce internal state for a loop event, then await listeners.
	*
	* `agent_end` only means no further loop events will be emitted. The run is
	* considered idle later, after all awaited listeners for `agent_end` finish
	* and `finishRun()` clears runtime-owned state.
	*/
	async processEvents(event) {
		switch (event.type) {
			case "agent_start":
			case "turn_start":
			case "tool_execution_update": break;
			case "message_start":
				if (event.message.role !== "toolResult" || this.mutableState.streamingMessage?.role !== "assistant") this.mutableState.streamingMessage = event.message;
				break;
			case "message_update":
				this.mutableState.streamingMessage = event.message;
				break;
			case "message_end":
				if (event.message.role !== "toolResult" || this.mutableState.streamingMessage?.role !== "assistant") this.mutableState.streamingMessage = void 0;
				this.mutableState.messages.push(event.message);
				this.steeringQueue.commit(event.message);
				this.followUpQueue.commit(event.message);
				break;
			case "tool_execution_start": {
				const pendingToolCalls = new Set(this.mutableState.pendingToolCalls);
				pendingToolCalls.add(event.toolCallId);
				this.mutableState.pendingToolCalls = pendingToolCalls;
				break;
			}
			case "tool_execution_end": {
				const pendingToolCalls = new Set(this.mutableState.pendingToolCalls);
				pendingToolCalls.delete(event.toolCallId);
				this.mutableState.pendingToolCalls = pendingToolCalls;
				break;
			}
			case "turn_end":
				if (event.message.role === "assistant" && event.message.errorMessage) this.mutableState.errorMessage = event.message.errorMessage;
				break;
			case "agent_end": this.mutableState.streamingMessage = void 0;
		}
		const signal = this.activeRun?.abortController.signal;
		if (!signal) throw new Error("Agent listener invoked outside active run");
		for (const listener of this.listeners) await listener(event, signal);
	}
};
//#endregion
//#region packages/agent-core/src/harness/prompt-template-arguments.ts
/** Parse an argument string using simple shell-style single and double quotes. */
function parseCommandArgs(argsString) {
	const args = [];
	let current = "";
	let inQuote = null;
	let hasToken = false;
	for (const char of argsString) if (inQuote) {
		if (char === inQuote) inQuote = null;
		else {
			hasToken = true;
			current += char;
		}
	} else if (char === "\"" || char === "'") {
		hasToken = true;
		inQuote = char;
	} else if (/\s/.test(char)) {
		if (hasToken) {
			args.push(current);
			current = "";
			hasToken = false;
		}
	} else {
		hasToken = true;
		current += char;
	}
	if (hasToken) args.push(current);
	return args;
}
/**
* Substitute prompt template placeholders (`$1`, `$@`, `$ARGUMENTS`, `${@:N}`, `${@:N:L}`) with command arguments.
*
* Unsafe integer placeholders resolve to empty text instead of throwing, so malformed templates cannot abort prompt
* loading or invocation.
*/
function substituteArgs(content, args) {
	const allArgs = args.join(" ");
	return content.replace(/\$(\d+)|\$\{@:(\d+)(?::(\d+))?\}|\$ARGUMENTS|\$@/g, (_match, num, startStr, lengthStr) => {
		if (num !== void 0) {
			const parsed = parseStrictNonNegativeInteger(num);
			if (parsed === void 0 || parsed <= 0) return "";
			return args[parsed - 1] ?? "";
		}
		if (startStr !== void 0) {
			const parsedStart = parseStrictNonNegativeInteger(startStr);
			if (parsedStart === void 0) return "";
			let start = parsedStart - 1;
			if (start < 0) start = 0;
			if (lengthStr) {
				const length = parseStrictNonNegativeInteger(lengthStr);
				if (length === void 0) return "";
				return args.slice(start, start + length).join(" ");
			}
			return args.slice(start).join(" ");
		}
		return allArgs;
	});
}
//#endregion
//#region packages/agent-core/src/harness/compaction/branch-summarization.ts
/** Collect entries that should be summarized before navigating to a different session tree entry. */
function collectEntriesForBranchSummaryFromBranches(oldBranch, targetBranch) {
	const oldPath = new Set(oldBranch.map((entry) => entry.id));
	let commonAncestorId = null;
	for (const targetEntry of targetBranch.toReversed()) if (oldPath.has(targetEntry.id)) {
		commonAncestorId = targetEntry.id;
		break;
	}
	const firstSummarizedIndex = commonAncestorId === null ? 0 : oldBranch.findIndex((entry) => entry.id === commonAncestorId) + 1;
	return {
		entries: oldBranch.slice(firstSummarizedIndex),
		commonAncestorId
	};
}
/** Prepare branch entries for summarization within an optional token budget. */
function prepareBranchEntries(entries, tokenBudget = 0) {
	const messages = [];
	const fileOps = createFileOps();
	let totalTokens = 0;
	for (const entry of entries) if (entry.type === "branch_summary" && !entry.fromHook && entry.details) mergeSummaryFileOperations(fileOps, entry.details);
	for (const entry of entries.toReversed()) {
		const message = projectSessionEntryMessage(entry);
		if (!message) continue;
		extractFileOpsFromMessage(message, fileOps);
		const rendered = serializeConversation(convertToLlm([message]));
		const tokens = rendered ? Math.ceil((estimateStringChars(rendered) + (totalTokens > 0 ? 2 : 0)) / 4) : 0;
		if (tokenBudget > 0 && totalTokens + tokens > tokenBudget) break;
		messages.push(message);
		totalTokens += tokens;
	}
	return {
		messages: messages.toReversed(),
		fileOps,
		totalTokens
	};
}
const BRANCH_SUMMARY_PREAMBLE = `The user explored a different conversation branch before returning here.
Summary of that exploration:

`;
const BRANCH_SUMMARY_PROMPT = `Create a structured summary of this conversation branch for context when returning later.

Use this EXACT format:

## Goal
[What was the user trying to accomplish in this branch?]

## Constraints & Preferences
- [Any constraints, preferences, or requirements mentioned]
- [Or "(none)" if none were mentioned]

## Progress
### Done
- [x] [Completed tasks/changes]

### In Progress
- [ ] [Work that was started but not finished]

### Blocked
- [Issues preventing progress, if any]

## Key Decisions
- **[Decision]**: [Brief rationale]

## Next Steps
1. [What should happen next to continue this work]

Keep each section concise. Preserve exact file paths, function names, and error messages.`;
/** Generate a summary for abandoned branch entries. */
async function generateBranchSummary(entries, options) {
	const { model, apiKey, headers, signal, customInstructions, replaceInstructions, reserveTokens = 16384 } = options;
	let instructions;
	if (replaceInstructions && customInstructions) instructions = customInstructions;
	else if (customInstructions) instructions = `${BRANCH_SUMMARY_PROMPT}\n\nAdditional focus: ${customInstructions}`;
	else instructions = BRANCH_SUMMARY_PROMPT;
	const promptPrefix = "<conversation>\n";
	const promptSuffix = `\n</conversation>\n\n${instructions}`;
	const fixedInputTokens = Math.ceil(estimateStringChars(`${SUMMARIZATION_SYSTEM_PROMPT}${promptPrefix}${promptSuffix}`) / 4);
	const contextWindow = model.contextWindow || 128e3;
	const maxSummaryOutputTokens = Math.min(2048, Math.max(1, Math.floor(contextWindow / 4)), model.maxTokens > 0 ? model.maxTokens : 2048);
	const usableReserveTokens = reserveTokens < contextWindow ? reserveTokens : Math.floor(contextWindow / 2);
	const tokenBudget = contextWindow - Math.max(maxSummaryOutputTokens + fixedInputTokens, usableReserveTokens);
	if (tokenBudget <= 0) return err(new BranchSummaryError("summarization_failed", "Branch summary instructions and output reservation exceed the model context window."));
	const { messages, fileOps } = prepareBranchEntries(entries, tokenBudget);
	const conversationText = serializeConversation(convertToLlm(messages));
	if (!conversationText) {
		if (entries.some((entry) => {
			const message = projectSessionEntryMessage(entry);
			return message && serializeConversation(convertToLlm([message])).length > 0;
		})) return err(new BranchSummaryError("summarization_failed", "The latest branch content cannot fit beside the summary instructions and output. Reduce the focus instructions or select a larger context window."));
		return ok({
			summary: "No content to summarize",
			readFiles: [],
			modifiedFiles: []
		});
	}
	const summarizationMessages = [{
		role: "user",
		content: [{
			type: "text",
			text: `${promptPrefix}${conversationText}${promptSuffix}`
		}],
		timestamp: Date.now()
	}];
	const context = {
		systemPrompt: SUMMARIZATION_SYSTEM_PROMPT,
		messages: summarizationMessages
	};
	const streamOptions = {
		apiKey,
		headers,
		signal,
		maxTokens: maxSummaryOutputTokens
	};
	const response = options.streamFn ? await consumeAgentCoreStream(options.streamFn(model, context, streamOptions), options.runtime) : await resolveAgentCoreCompleteFn(options.runtime)(model, context, streamOptions);
	options.runtime?.internalUsageSink?.(response.usage);
	if (response.stopReason === "aborted") return err(new BranchSummaryError("aborted", response.errorMessage || "Branch summary aborted"));
	if (response.stopReason === "error") return err(new BranchSummaryError("summarization_failed", `Branch summary failed: ${response.errorMessage || "Unknown error"}`));
	const summaryText = extractSummaryText(response);
	if (summaryText === void 0) return err(new BranchSummaryError("summarization_failed", "Branch summary failed: model returned no summary text"));
	let summary = BRANCH_SUMMARY_PREAMBLE + summaryText;
	const { readFiles, modifiedFiles } = computeFileLists(fileOps);
	summary += formatFileOperations(readFiles, modifiedFiles);
	return ok({
		summary,
		readFiles,
		modifiedFiles
	});
}
//#endregion
//#region src/agents/runtime/proxy.ts
/**
* Proxy stream function for apps that route LLM calls through a server.
* The server manages auth and proxies requests to LLM providers.
*/
const PROXY_ERROR_BODY_MAX_BYTES = 16777216;
const PROXY_SSE_STREAM_MAX_BYTES = 16777216;
const PROXY_SSE_PENDING_BUFFER_MAX_BYTES = PROXY_SSE_STREAM_MAX_BYTES;
const PROXY_SSE_READ_IDLE_TIMEOUT_MS = 12e4;
var ProxyMessageEventStream = class extends event_stream_exports.EventStream {
	constructor() {
		super((event) => event.type === "done" || event.type === "error", (event) => {
			if (event.type === "done") return event.message;
			if (event.type === "error") return event.error;
			throw new Error("Unexpected event type");
		});
	}
};
/**
* Stream function that proxies through a server instead of calling LLM providers directly.
* The server strips the partial field from delta events to reduce bandwidth.
* We reconstruct the partial message client-side.
*
* Use this as the `streamFn` option when creating an Agent that needs to go through a proxy.
*
* @example
* ```typescript
* const agent = new Agent({
*   streamFn: (model, context, options) =>
*     streamProxy(model, context, {
*       ...options,
*       authToken: await getAuthToken(),
*       proxyUrl: "https://genai.example.com",
*     }),
* });
* ```
*/
function buildProxyRequestOptions(options) {
	return {
		temperature: options.temperature,
		maxTokens: options.maxTokens,
		reasoning: options.reasoning,
		cacheRetention: options.cacheRetention,
		sessionId: options.sessionId,
		promptCacheKey: options.promptCacheKey,
		metadata: options.metadata,
		transport: options.transport,
		thinkingBudgets: options.thinkingBudgets,
		maxRetryDelayMs: options.maxRetryDelayMs,
		timeoutMs: options.timeoutMs
	};
}
function sanitizeProxyModel(model) {
	const { headers: _headers, ...safeModel } = model;
	return safeModel;
}
function resolveProxyReadIdleTimeoutMs(timeoutMs) {
	return resolvePositiveTimerTimeoutMs(timeoutMs, PROXY_SSE_READ_IDLE_TIMEOUT_MS);
}
function createProxyRequestTimeoutError(timeoutMs) {
	const error = /* @__PURE__ */ new Error(`Proxy request timed out after ${timeoutMs}ms`);
	error.name = "TimeoutError";
	return error;
}
function buildProxyRequestAbort(callerSignal, timeoutMs) {
	const timeoutController = new AbortController();
	const timeoutId = setTimeout(() => {
		timeoutController.abort(createProxyRequestTimeoutError(timeoutMs));
	}, timeoutMs);
	return {
		signal: callerSignal ? AbortSignal.any([callerSignal, timeoutController.signal]) : timeoutController.signal,
		clear: () => {
			clearTimeout(timeoutId);
		}
	};
}
function isProxyRequestTimeoutError(params) {
	if (params.callerSignal?.aborted || !params.requestSignal.aborted) return false;
	if (!(params.error instanceof Error)) return false;
	return params.error.name === "AbortError" || params.error.name === "TimeoutError" || params.error.message === "Request was aborted";
}
async function readProxyErrorData(response, readIdleTimeoutMs) {
	const bytes = await readResponseWithLimit(response, PROXY_ERROR_BODY_MAX_BYTES, {
		onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`Proxy error body exceeded ${maxBytes} bytes`),
		chunkTimeoutMs: readIdleTimeoutMs,
		onIdleTimeout: ({ chunkTimeoutMs }) => /* @__PURE__ */ new Error(`Proxy error body stalled: no data received for ${chunkTimeoutMs}ms`)
	});
	return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
}
async function readProxySseChunk(reader, readIdleTimeoutMs, cancel) {
	let timedOut = false;
	return await new Promise((resolve, reject) => {
		const timeoutError = /* @__PURE__ */ new Error(`Proxy SSE stream stalled: no data received for ${readIdleTimeoutMs}ms`);
		const timeoutId = setTimeout(() => {
			timedOut = true;
			cancel(timeoutError);
			reject(timeoutError);
		}, readIdleTimeoutMs);
		reader.read().then((result) => {
			clearTimeout(timeoutId);
			if (!timedOut) resolve(result);
		}, (error) => {
			clearTimeout(timeoutId);
			if (!timedOut) reject(error instanceof Error ? error : new Error(String(error)));
		});
	});
}
function assertProxySsePendingBufferWithinLimit(buffer) {
	if (new TextEncoder().encode(buffer).byteLength <= PROXY_SSE_PENDING_BUFFER_MAX_BYTES) return;
	throw new Error(`Proxy SSE pending buffer exceeded ${PROXY_SSE_PENDING_BUFFER_MAX_BYTES} bytes`);
}
function streamProxy(model, context, options) {
	const stream = new ProxyMessageEventStream();
	(async () => {
		const partial = {
			role: "assistant",
			stopReason: "stop",
			content: [],
			api: model.api,
			provider: model.provider,
			model: model.id,
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
		let reader;
		let readerReachedEof = false;
		let cancellation;
		let cleanupReason;
		const readIdleTimeoutMs = resolveProxyReadIdleTimeoutMs(options.timeoutMs);
		const cancelReader = (reason) => reader ? cancellation ??= reader.cancel(reason).catch(() => void 0) : Promise.resolve();
		const abortHandler = () => void cancelReader("Request aborted by user");
		options.signal?.addEventListener("abort", abortHandler);
		try {
			const requestAbort = buildProxyRequestAbort(options.signal, readIdleTimeoutMs);
			const response = await fetch(`${options.proxyUrl}/api/stream`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${options.authToken}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					model: sanitizeProxyModel(model),
					context,
					options: buildProxyRequestOptions(options)
				}),
				signal: requestAbort.signal
			}).catch((error) => {
				if (isProxyRequestTimeoutError({
					error,
					callerSignal: options.signal,
					requestSignal: requestAbort.signal
				})) throw new Error(`Proxy request timed out after ${readIdleTimeoutMs}ms`, { cause: error instanceof Error ? error : void 0 });
				throw error;
			}).finally(() => {
				requestAbort.clear();
			});
			if (!response.ok) {
				let errorMessage = `Proxy error: ${response.status} ${response.statusText}`;
				try {
					const errorData = await readProxyErrorData(response, readIdleTimeoutMs);
					if (errorData?.error) errorMessage = `Proxy error: ${errorData.error}`;
				} catch (error) {
					if (error instanceof Error && error.message.startsWith("Proxy error body")) throw error;
				}
				throw new Error(errorMessage);
			}
			reader = response.body.getReader();
			const sseReader = createSseByteGuard(reader, {
				maxBytes: PROXY_SSE_STREAM_MAX_BYTES,
				onOverflow: ({ maxBytes }) => /* @__PURE__ */ new Error(`Proxy SSE stream exceeded ${maxBytes} bytes`)
			});
			const decoder = new TextDecoder();
			let buffer = "";
			let terminalEventSeen = false;
			const toolArgumentPreviewSchedules = /* @__PURE__ */ new Map();
			const processSseLine = (line) => {
				if (!line.startsWith("data:")) return false;
				const data = line.slice(5).trim();
				if (!data) return false;
				const event = processProxyEvent(JSON.parse(data), partial, toolArgumentPreviewSchedules);
				if (!event) return false;
				stream.push(event);
				return event.type === "done" || event.type === "error";
			};
			while (!terminalEventSeen) {
				const { done, value } = await readProxySseChunk(sseReader, readIdleTimeoutMs, cancelReader);
				if (done) {
					readerReachedEof = cancellation === void 0;
					break;
				}
				if (options.signal?.aborted) throw new Error("Request aborted by user");
				buffer += decoder.decode(value, { stream: true });
				const lines = buffer.split("\n");
				buffer = lines.pop() || "";
				assertProxySsePendingBufferWithinLimit(buffer);
				for (const line of lines) {
					terminalEventSeen = processSseLine(line);
					if (terminalEventSeen) break;
				}
			}
			if (options.signal?.aborted) throw new Error("Request aborted by user");
			if (readerReachedEof) {
				buffer += decoder.decode();
				if (buffer.trim()) terminalEventSeen = processSseLine(buffer);
			}
			if (!terminalEventSeen) throw new Error("Proxy stream ended before terminal event");
			stream.end();
		} catch (error) {
			cleanupReason = error;
			const errorMessage = error instanceof Error ? error.message : String(error);
			const reason = options.signal?.aborted ? "aborted" : "error";
			partial.stopReason = reason;
			partial.errorMessage = errorMessage;
			stream.push({
				type: "error",
				reason,
				error: partial
			});
			stream.end();
		} finally {
			try {
				if (reader && !readerReachedEof) cancelReader(cleanupReason);
				reader?.releaseLock();
			} catch {}
			options.signal?.removeEventListener("abort", abortHandler);
		}
	})();
	return stream;
}
/**
* Process a proxy event and update the partial message.
*/
function processProxyEvent(proxyEvent, partial, toolArgumentPreviewSchedules) {
	switch (proxyEvent.type) {
		case "start": return {
			type: "start",
			partial
		};
		case "text_start":
			partial.content[proxyEvent.contentIndex] = {
				type: "text",
				text: "",
				...proxyEvent.contentSignature !== void 0 ? { textSignature: proxyEvent.contentSignature } : {}
			};
			return {
				type: "text_start",
				contentIndex: proxyEvent.contentIndex,
				partial
			};
		case "text_delta": {
			const content = partial.content[proxyEvent.contentIndex];
			if (content?.type === "text") {
				content.text += proxyEvent.delta;
				return {
					type: "text_delta",
					contentIndex: proxyEvent.contentIndex,
					delta: proxyEvent.delta,
					partial
				};
			}
			throw new Error("Received text_delta for non-text content");
		}
		case "text_end": {
			const content = partial.content[proxyEvent.contentIndex];
			if (content?.type === "text") {
				if (proxyEvent.contentSignature !== void 0) content.textSignature = proxyEvent.contentSignature;
				return {
					type: "text_end",
					contentIndex: proxyEvent.contentIndex,
					content: content.text,
					partial
				};
			}
			throw new Error("Received text_end for non-text content");
		}
		case "thinking_start":
			partial.content[proxyEvent.contentIndex] = {
				type: "thinking",
				thinking: ""
			};
			return {
				type: "thinking_start",
				contentIndex: proxyEvent.contentIndex,
				partial
			};
		case "thinking_delta": {
			const content = partial.content[proxyEvent.contentIndex];
			if (content?.type === "thinking") {
				content.thinking += proxyEvent.delta;
				return {
					type: "thinking_delta",
					contentIndex: proxyEvent.contentIndex,
					delta: proxyEvent.delta,
					partial
				};
			}
			throw new Error("Received thinking_delta for non-thinking content");
		}
		case "thinking_end": {
			const content = partial.content[proxyEvent.contentIndex];
			if (content?.type === "thinking") {
				content.thinkingSignature = proxyEvent.contentSignature;
				return {
					type: "thinking_end",
					contentIndex: proxyEvent.contentIndex,
					content: content.thinking,
					partial
				};
			}
			throw new Error("Received thinking_end for non-thinking content");
		}
		case "toolcall_start": {
			const content = {
				type: "toolCall",
				id: proxyEvent.id,
				name: proxyEvent.toolName,
				arguments: {},
				partialJson: ""
			};
			partial.content[proxyEvent.contentIndex] = content;
			toolArgumentPreviewSchedules.set(proxyEvent.contentIndex, createToolArgumentPreviewSchedule());
			return {
				type: "toolcall_start",
				contentIndex: proxyEvent.contentIndex,
				partial
			};
		}
		case "toolcall_delta": {
			const content = partial.content[proxyEvent.contentIndex];
			if (content?.type === "toolCall") {
				const streamingContent = content;
				streamingContent.partialJson += proxyEvent.delta;
				const previewSchedule = toolArgumentPreviewSchedules.get(proxyEvent.contentIndex);
				if (!previewSchedule) throw new Error("Received toolcall_delta without a preview schedule");
				if (previewSchedule(streamingContent.partialJson.length)) content.arguments = parseStreamingJson(streamingContent.partialJson);
				partial.content[proxyEvent.contentIndex] = { ...content };
				return {
					type: "toolcall_delta",
					contentIndex: proxyEvent.contentIndex,
					delta: proxyEvent.delta,
					partial
				};
			}
			throw new Error("Received toolcall_delta for non-toolCall content");
		}
		case "toolcall_end": {
			const content = partial.content[proxyEvent.contentIndex];
			if (content?.type === "toolCall") {
				const streamingContent = content;
				content.arguments = streamingContent.partialJson ? parseTerminalToolCallArguments(streamingContent.partialJson) : {};
				toolArgumentPreviewSchedules.delete(proxyEvent.contentIndex);
				delete content.partialJson;
				return {
					type: "toolcall_end",
					contentIndex: proxyEvent.contentIndex,
					toolCall: content,
					partial
				};
			}
			return;
		}
		case "done":
			partial.stopReason = proxyEvent.reason;
			partial.usage = proxyEvent.usage;
			return {
				type: "done",
				reason: proxyEvent.reason,
				message: partial
			};
		case "error":
			partial.stopReason = proxyEvent.reason;
			partial.errorMessage = proxyEvent.errorMessage;
			partial.usage = proxyEvent.usage;
			return {
				type: "error",
				reason: proxyEvent.reason,
				error: partial
			};
		default:
			console.warn(`Unhandled proxy event type: ${proxyEvent.type}`);
			return;
	}
}
//#endregion
//#region src/plugin-sdk/agent-core.ts
var agent_core_exports = /* @__PURE__ */ __exportAll({
	Agent: () => Agent,
	BRANCH_SUMMARY_PREFIX: () => BRANCH_SUMMARY_PREFIX,
	BRANCH_SUMMARY_SUFFIX: () => BRANCH_SUMMARY_SUFFIX,
	COMPACTION_SUMMARY_PREFIX: () => COMPACTION_SUMMARY_PREFIX,
	COMPACTION_SUMMARY_SUFFIX: () => COMPACTION_SUMMARY_SUFFIX,
	DEFAULT_COMPACTION_SETTINGS: () => DEFAULT_COMPACTION_SETTINGS,
	IMAGE_BLOCK_TOKENS: () => IMAGE_BLOCK_TOKENS,
	bashExecutionToText: () => bashExecutionToText,
	buildSessionContext: () => buildSessionContext,
	calculateContextTokens: () => calculateContextTokens,
	collectEntriesForBranchSummaryFromBranches: () => collectEntriesForBranchSummaryFromBranches,
	compact: () => compact,
	estimateContextTokens: () => estimateContextTokens,
	estimateTokens: () => estimateTokens,
	findCutPoint: () => findCutPoint,
	findTurnStartIndex: () => findTurnStartIndex,
	generateBranchSummary: () => generateBranchSummary,
	generateSummary: () => generateSummary,
	getLastAssistantUsage: () => getLastAssistantUsage,
	openClawAgentCoreRuntime: () => openClawAgentCoreRuntime,
	prepareBranchEntries: () => prepareBranchEntries,
	prepareCompaction: () => prepareCompaction,
	runAgentLoop: () => runAgentLoop,
	serializeConversation: () => serializeConversation,
	shouldCompact: () => shouldCompact,
	streamProxy: () => streamProxy,
	uuidv7: () => uuidv7
});
/** Runtime adapter that lets the package agent-core use OpenClaw LLM helpers. */
const openClawAgentCoreRuntime = {
	runStream: runPluginStreamConsumer,
	completeSimple: ((model, context, options) => completeSimple(model, context, options)),
	streamSimple: ((model, context, options) => streamSimple(model, context, options))
};
/** Agent-core class preconfigured with OpenClaw runtime dependencies. */
var Agent = class extends Agent$1 {
	constructor(options = {}) {
		super({
			runtime: openClawAgentCoreRuntime,
			...options
		});
	}
};
//#endregion
export { collectEntriesForBranchSummaryFromBranches as a, parseCommandArgs as c, streamProxy as i, substituteArgs as l, agent_core_exports as n, generateBranchSummary as o, openClawAgentCoreRuntime as r, prepareBranchEntries as s, Agent as t, runAgentLoop as u };
