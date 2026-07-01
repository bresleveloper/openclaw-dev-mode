import { i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import { t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import { n as captureAgentRunLifecycleGeneration, t as assertAgentRunLifecycleGenerationCurrent, y as withAgentRunLifecycleGeneration } from "./agent-events-7y1r8HOP.js";
import { s as resolveBlockMessage, t as getGlobalHookRunner } from "./hook-runner-global-D4fQSLSV.js";
import { m as setReplyPayloadMetadata } from "./reply-payload-HLWc9ssO.js";
import { t as SessionManager } from "./session-manager-D5YeJxMM.js";
import { i as buildUsageWithNoCost, n as buildAssistantMessage } from "./stream-message-shared-CdbBqwfX.js";
import { n as SILENT_REPLY_TOKEN } from "./tokens-Zsy11rTo.js";
import { n as appendExactAssistantMessageToSessionTranscript } from "./transcript-BMyCREan.js";
import { _ as isFailoverErrorMessage, r as classifyFailoverReason } from "./errors-C4-qHiKh.js";
import { d as resolveFailoverStatus, o as isFailoverError, t as FailoverError } from "./failover-error-CZc6_Wx_.js";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-C_j_aIUe.js";
import { i as buildGenericCliContextEngineHostSupport } from "./host-compat-BibWlia2.js";
import { a as finalizeHarnessContextEngineTurn, d as runAgentEndSideEffects, l as waitForDeferredTurnMaintenanceForSession, n as bootstrapHarnessContextEngine, s as runHarnessContextEngineMaintenance, u as awaitAgentEndSideEffects } from "./context-engine-lifecycle-CN3v4MWg.js";
import { n as buildAgentHookContextIdentityFields, t as buildAgentHookContextChannelFields } from "./hook-agent-context-ugCMMoT5.js";
import "./embedded-agent-helpers-D_zioqUQ.js";
import { a as runAgentHarnessLlmInputHook, o as runAgentHarnessLlmOutputHook, s as buildAgentHookContext } from "./lifecycle-hook-helpers-DnHSVpVA.js";
import { t as buildEmbeddedRunPayloads } from "./payloads-C8eo2QCG.js";
import { n as getCliMessagingDeliveryEvidence, t as attachCliMessagingDeliveryEvidence } from "./delivery-evidence-Cmz7UHq4.js";
import { i as formatCliBackendOutputDigest, r as cliBackendLog } from "./log-CRVu7uZX.js";
import { d as loadCliSessionHistoryMessages, m as buildAgentHookConversationMessages, n as claudeCliSessionTranscriptHasContent, u as loadCliSessionContextEngineMessages } from "./attempt-execution.helpers-D6D1aACa.js";
//#region src/agents/cli-runner.ts
/**
* Top-level CLI-backed agent runner orchestration.
*/
const log = createSubsystemLogger("agents/cli-runner");
const cliRunnerDeps = {
	claudeCliSessionTranscriptHasContent,
	delay: async (delayMs) => {
		await new Promise((resolve) => {
			setTimeout(resolve, delayMs);
		});
	}
};
function isClaudeCliProvider(provider) {
	return provider.trim().toLowerCase() === "claude-cli";
}
function shouldRetryFreshCliSessionAfterFailover(params) {
	if (!params.hasHistoryPrompt) return false;
	switch (params.error.reason) {
		case "session_expired": return true;
		case "unknown": return params.error.code === "cli_unknown_empty_failure";
		case "timeout": return params.error.code === "cli_no_output_timeout";
		default: return false;
	}
}
function formatCliEmptyOutputDiagnostics(output) {
	const process = output.diagnostics?.process;
	if (!process) return;
	return [
		`backend=${process.backendId}`,
		`reason=${process.processReason}`,
		`exitCode=${process.exitCode ?? "null"}`,
		`exitSignal=${process.exitSignal ?? "null"}`,
		`durationMs=${process.durationMs}`,
		`stdoutBytes=${process.stdoutBytes}`,
		`stdoutHash=${process.stdoutHash}`,
		`stderrBytes=${process.stderrBytes}`,
		`stderrHash=${process.stderrHash}`,
		`useResume=${process.useResume ? "true" : "false"}`
	].join(" ");
}
/** Checks whether a Claude CLI session binding has reached its transcript file. */
async function isCliBindingFlushed(sessionId, provider, workspaceDir) {
	if (!provider || !isClaudeCliProvider(provider)) return true;
	if (!sessionId) return false;
	for (const delayMs of [
		0,
		50,
		150
	]) {
		if (delayMs > 0) await cliRunnerDeps.delay(delayMs);
		if (await cliRunnerDeps.claudeCliSessionTranscriptHasContent({
			sessionId,
			workspaceDir
		})) return true;
	}
	return false;
}
function flushSessionManagerFile(sessionManager) {
	sessionManager.rewriteFile?.();
}
function buildHandledReplyPayloads(reply) {
	const normalized = reply ?? { text: "NO_REPLY" };
	return [{
		text: normalized.text,
		mediaUrl: normalized.mediaUrl,
		mediaUrls: normalized.mediaUrls,
		replyToId: normalized.replyToId,
		audioAsVoice: normalized.audioAsVoice,
		isError: normalized.isError,
		isReasoning: normalized.isReasoning
	}];
}
function buildCliHookUserMessage(prompt) {
	return {
		role: "user",
		content: prompt,
		timestamp: Date.now()
	};
}
function buildCliHookAssistantMessage(params) {
	return {
		role: "assistant",
		content: [{
			type: "text",
			text: params.text
		}],
		api: "responses",
		provider: params.provider,
		model: params.model,
		...params.usage ? { usage: params.usage } : {},
		stopReason: "stop",
		timestamp: Date.now()
	};
}
function isAgentMessage(value) {
	return Boolean(value && typeof value === "object" && "role" in value);
}
function buildCliContextEngineUserMessage(prompt) {
	return {
		role: "user",
		content: prompt,
		timestamp: Date.now()
	};
}
function buildCliContextEngineAssistantMessage(params) {
	return buildCliHookAssistantMessage(params);
}
function shouldAwaitCliAgentEndHook(params) {
	return !params.messageChannel && !params.messageProvider;
}
async function runCliAgentEndHook(params, hookParams) {
	if (shouldAwaitCliAgentEndHook(params)) {
		await awaitAgentEndSideEffects(hookParams);
		return;
	}
	runAgentEndSideEffects(hookParams);
}
async function persistApprovedCliUserTurnTranscript(params) {
	if (params.suppressNextUserMessagePersistence === true || !params.userTurnTranscriptRecorder) return;
	const target = {
		transcriptPath: params.sessionFile,
		sessionId: params.sessionId,
		agentId: params.agentId,
		...params.sessionKey ? { sessionKey: params.sessionKey } : {},
		cwd: params.cwd ?? params.workspaceDir,
		...params.config ? { config: params.config } : {}
	};
	const persisted = await params.userTurnTranscriptRecorder.persistApproved({ target });
	if (persisted) try {
		const notification = params.onUserMessagePersisted?.(persisted.message);
		if (notification) Promise.resolve(notification).catch((error) => {
			log.warn(`CLI user turn persistence notification failed: ${formatErrorMessage(error)}`);
		});
	} catch (error) {
		log.warn(`CLI user turn persistence notification failed: ${formatErrorMessage(error)}`);
	}
}
async function persistCliAssistantTranscript(params) {
	const { runParams } = params;
	if (!runParams.persistAssistantTranscript || !runParams.sessionKey || !params.text) return false;
	if (runParams.currentInboundEventKind === "room_event") return true;
	try {
		const result = await appendExactAssistantMessageToSessionTranscript({
			sessionKey: runParams.sessionKey,
			agentId: runParams.agentId,
			expectedSessionId: runParams.sessionId,
			storePath: runParams.storePath,
			idempotencyKey: `cli-assistant:${runParams.runId}`,
			config: runParams.config,
			beforeMessageWrite: runAgentHarnessBeforeMessageWriteHook,
			message: buildAssistantMessage({
				model: {
					api: "cli",
					provider: runParams.provider,
					id: params.modelId
				},
				content: [{
					type: "text",
					text: params.text
				}],
				stopReason: "stop",
				usage: buildUsageWithNoCost({
					input: params.usage?.input,
					output: params.usage?.output,
					cacheRead: params.usage?.cacheRead,
					cacheWrite: params.usage?.cacheWrite,
					totalTokens: params.usage?.total
				})
			})
		});
		if (!result.ok) {
			log.warn(`CLI assistant transcript persistence skipped: ${result.reason}`);
			return result.code === "blocked" || result.code === "session-rebound";
		}
		return true;
	} catch (error) {
		log.warn(`CLI assistant transcript persistence failed: ${formatErrorMessage(error)}`);
		return false;
	}
}
async function finalizeCliContextEngineTurn(params) {
	const { context } = params;
	if (!context.contextEngine) return;
	const { params: runParams } = context;
	const prePromptMessages = params.historyMessages.filter(isAgentMessage);
	const turnMessages = [];
	if (context.contextEngineTurnPrompt) turnMessages.push(buildCliContextEngineUserMessage(context.contextEngineTurnPrompt));
	if (params.assistantText) turnMessages.push(buildCliContextEngineAssistantMessage({
		text: params.assistantText,
		provider: runParams.provider,
		model: context.modelId,
		usage: params.output.usage
	}));
	let deferredTurnMaintenance;
	const contextEngineHostSupport = buildGenericCliContextEngineHostSupport({ backendId: context.backendResolved.id });
	if ((await finalizeHarnessContextEngineTurn({
		contextEngine: context.contextEngine,
		promptError: false,
		aborted: runParams.abortSignal?.aborted === true,
		yieldAborted: false,
		sessionIdUsed: runParams.sessionId,
		sessionKey: runParams.sessionKey,
		sessionFile: runParams.sessionFile,
		isHeartbeat: runParams.bootstrapContextRunKind === "heartbeat",
		messagesSnapshot: [...prePromptMessages, ...turnMessages],
		prePromptMessageCount: prePromptMessages.length,
		config: context.contextEngineConfig,
		contextEngineHostSupport,
		providerId: runParams.provider,
		modelId: context.modelId,
		runMaintenance: async (maintenanceParams) => await runHarnessContextEngineMaintenance({
			...maintenanceParams,
			onDeferredMaintenance: (promise) => {
				deferredTurnMaintenance = promise;
			}
		}),
		warn: (message) => log.warn(message)
	})).postTurnFinalizationSucceeded && deferredTurnMaintenance) context.contextEngineDeferredTurnMaintenance = deferredTurnMaintenance;
}
/** Prepares and runs one CLI-backed agent turn. */
function runCliAgent(paramsInput) {
	const lifecycleGeneration = paramsInput.lifecycleGeneration ?? captureAgentRunLifecycleGeneration(paramsInput.runId);
	return withAgentRunLifecycleGeneration(lifecycleGeneration, () => runCliAgentInternal({
		...paramsInput,
		lifecycleGeneration
	}));
}
async function runCliAgentInternal(params) {
	assertAgentRunLifecycleGenerationCurrent(params.lifecycleGeneration);
	params.onExecutionStarted?.();
	if (params.trigger === "cron") {
		const startedAt = Date.now();
		const hookRunner = getGlobalHookRunner();
		if (hookRunner?.hasHooks("before_agent_reply")) {
			const hookContext = {
				runId: params.runId,
				jobId: params.jobId,
				agentId: params.agentId,
				sessionKey: params.sessionKey,
				sessionId: params.sessionId,
				workspaceDir: params.workspaceDir,
				trigger: params.trigger,
				...buildAgentHookContextChannelFields(params),
				...buildAgentHookContextIdentityFields({
					trigger: params.trigger,
					senderId: params.senderId,
					chatId: params.chatId,
					channelContext: params.channelContext
				})
			};
			params.onExecutionPhase?.({
				phase: "before_agent_reply",
				provider: params.provider,
				model: params.model ?? ""
			});
			const hookResult = await hookRunner.runBeforeAgentReply({ cleanedBody: params.prompt }, hookContext);
			if (hookResult?.handled) {
				const finalText = hookResult.reply?.text ?? "NO_REPLY";
				cliBackendLog.info(`cli synthetic turn: provider=${params.provider} model=<synthetic> requestedModel=${params.model ?? ""} durationMs=${Date.now() - startedAt} ${formatCliBackendOutputDigest(finalText)}`);
				return {
					payloads: buildHandledReplyPayloads(hookResult.reply),
					meta: {
						durationMs: Date.now() - startedAt,
						agentMeta: {
							sessionId: params.sessionId,
							provider: params.provider,
							model: params.model ?? ""
						},
						finalAssistantVisibleText: finalText,
						finalAssistantRawText: finalText
					}
				};
			}
			params.onExecutionPhase?.({
				phase: "runtime_plugins",
				provider: params.provider,
				model: params.model ?? ""
			});
		}
	}
	const { prepareCliRunContext } = await import("./prepare.runtime.js");
	const context = await prepareCliRunContext(params);
	let result;
	let runError;
	try {
		result = await runPreparedCliAgent(context);
	} catch (error) {
		runError = error;
	}
	let cleanupError;
	const recordCleanupError = (error) => {
		cleanupError ??= error;
	};
	if (params.cleanupCliLiveSessionOnRunEnd === true) try {
		const { closeClaudeLiveSessionForContext } = await import("./claude-live-session-D48iXAoP.js");
		await closeClaudeLiveSessionForContext(context);
	} catch (error) {
		recordCleanupError(error);
	}
	if (params.cleanupBundleMcpOnRunEnd === true) try {
		const { closeMcpLoopbackServer } = await import("./mcp-http-BFsK4RsT.js");
		await closeMcpLoopbackServer();
	} catch (error) {
		recordCleanupError(error);
	}
	if (cleanupError) if (runError || result?.didSendViaMessagingTool === true) log.warn(`cli run cleanup failed after completion: ${formatErrorMessage(cleanupError)}`);
	else runError = cleanupError instanceof Error ? cleanupError : new Error(formatErrorMessage(cleanupError));
	if (runError) throw runError instanceof Error ? runError : new Error(formatErrorMessage(runError));
	return result;
}
/** Runs an already-prepared CLI agent context through hooks and execution. */
async function runPreparedCliAgent(context) {
	const { executePreparedCliRun } = await import("./execute.runtime.js");
	const { params } = context;
	const hookRunner = getGlobalHookRunner();
	const hasLlmInputHooks = hookRunner?.hasHooks("llm_input") === true;
	const hasLlmOutputHooks = hookRunner?.hasHooks("llm_output") === true;
	const hasAgentEndHooks = hookRunner?.hasHooks("agent_end") === true;
	const hasBeforeAgentRunHooks = hookRunner?.hasHooks("before_agent_run") === true;
	const needsHookHistory = hasLlmInputHooks || hasAgentEndHooks || hasBeforeAgentRunHooks;
	await waitForDeferredTurnMaintenanceForSession(params.sessionKey ?? params.sessionId);
	const historyMessages = needsHookHistory ? await loadCliSessionHistoryMessages({
		sessionId: params.sessionId,
		sessionFile: params.sessionFile,
		sessionKey: params.sessionKey,
		agentId: params.agentId,
		config: params.config
	}) : [];
	const llmInputEvent = {
		runId: params.runId,
		sessionId: params.sessionId,
		provider: params.provider,
		model: context.modelId,
		systemPrompt: context.systemPrompt,
		prompt: params.prompt,
		historyMessages,
		imagesCount: params.images?.length ?? 0
	};
	const hookContext = {
		runId: params.runId,
		jobId: params.jobId,
		agentId: params.agentId,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		workspaceDir: params.workspaceDir,
		trigger: params.trigger,
		...params.config ? { config: params.config } : {},
		...context.contextWindowInfo?.tokens ? { contextTokenBudget: context.contextWindowInfo.tokens } : {},
		...context.contextWindowInfo?.source ? { contextWindowSource: context.contextWindowInfo.source } : {},
		...context.contextWindowInfo?.referenceTokens ? { contextWindowReferenceTokens: context.contextWindowInfo.referenceTokens } : {},
		...buildAgentHookContextChannelFields(params),
		...buildAgentHookContextIdentityFields({
			trigger: params.trigger,
			senderId: params.senderId,
			chatId: params.chatId,
			channelContext: params.channelContext
		})
	};
	const buildAgentEndMessages = (lastAssistant) => [...buildAgentHookConversationMessages({
		historyMessages,
		currentTurnMessages: [buildCliHookUserMessage(params.prompt), ...lastAssistant ? [lastAssistant] : []]
	})];
	const buildFailedAgentEndEvent = (error) => ({
		messages: buildAgentEndMessages(),
		success: false,
		error,
		durationMs: Date.now() - context.started
	});
	const buildBlockedAgentEndEvent = (message) => ({
		messages: buildAgentHookConversationMessages({
			historyMessages,
			currentTurnMessages: [buildCliHookUserMessage(message)]
		}),
		success: false,
		error: message,
		durationMs: Date.now() - context.started
	});
	const buildBlockedBeforeAgentRunResult = (message) => ({
		payloads: [{
			text: message,
			isError: true
		}],
		meta: {
			durationMs: Date.now() - context.started,
			finalAssistantVisibleText: message,
			finalAssistantRawText: message,
			livenessState: "blocked",
			error: {
				kind: "hook_block",
				message
			},
			systemPromptReport: context.systemPromptReport,
			executionTrace: {
				winnerProvider: params.provider,
				winnerModel: context.modelId,
				attempts: [{
					provider: params.provider,
					model: context.modelId,
					result: "error",
					reason: "before_agent_run blocked the run"
				}],
				fallbackUsed: false,
				runner: "cli"
			},
			requestShaping: {
				...params.thinkLevel ? { thinking: params.thinkLevel } : {},
				...context.effectiveAuthProfileId ? { authMode: "auth-profile" } : {}
			},
			completion: {
				finishReason: "blocked",
				stopReason: "blocked",
				refusal: true
			},
			agentMeta: {
				sessionId: params.sessionId ?? "",
				provider: params.provider,
				model: context.modelId
			}
		}
	});
	let deliveredMessagingSideEffect = false;
	const buildCliSourceReplyMirrorPayloads = (evidence) => {
		return buildEmbeddedRunPayloads({
			assistantTexts: [],
			toolMetas: [],
			lastAssistant: void 0,
			inlineToolResultsAllowed: false,
			sessionKey: params.sessionKey ?? "",
			provider: params.provider,
			model: context.modelId,
			didSendViaMessagingTool: evidence.didSendViaMessagingTool,
			didDeliverSourceReplyViaMessageTool: evidence.didDeliverSourceReplyViaMessageTool,
			messagingToolSourceReplyPayloads: evidence.messagingToolSourceReplyPayloads,
			sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
			agentId: params.agentId,
			runId: params.runId
		});
	};
	const resolveCliSourceReplyMirror = (evidence) => {
		const payloads = buildCliSourceReplyMirrorPayloads(evidence);
		return {
			payloads,
			delivered: payloads.length > 0 || params.sourceReplyDeliveryMode === "message_tool_only" && evidence.didDeliverSourceReplyViaMessageTool === true,
			visibleText: payloads.map((payload) => payload.text?.trim() ?? "").filter(Boolean).join("\n\n") || void 0
		};
	};
	const buildDeliveredFailureResult = (error, evidence) => {
		const message = formatErrorMessage(error);
		const { payloads } = resolveCliSourceReplyMirror(evidence);
		deliveredMessagingSideEffect = true;
		return {
			...payloads.length > 0 ? { payloads } : {},
			meta: {
				durationMs: Date.now() - context.started,
				systemPromptReport: context.systemPromptReport,
				stopReason: "error",
				executionTrace: {
					winnerProvider: params.provider,
					winnerModel: context.modelId,
					attempts: [{
						provider: params.provider,
						model: context.modelId,
						result: "error",
						reason: message
					}],
					fallbackUsed: false,
					runner: "cli"
				},
				requestShaping: {
					...params.thinkLevel ? { thinking: params.thinkLevel } : {},
					...context.effectiveAuthProfileId ? { authMode: "auth-profile" } : {}
				},
				completion: {
					finishReason: "error",
					stopReason: "error",
					refusal: false
				},
				agentMeta: {
					sessionId: "",
					provider: params.provider,
					model: context.modelId,
					...context.reusableCliSession.sessionId ? { clearCliSessionBinding: true } : {}
				}
			},
			didSendViaMessagingTool: true,
			...evidence.didDeliverSourceReplyViaMessageTool ? { didDeliverSourceReplyViaMessageTool: true } : {},
			...evidence.messagingToolSentTexts?.length ? { messagingToolSentTexts: evidence.messagingToolSentTexts } : {},
			...evidence.messagingToolSentMediaUrls?.length ? { messagingToolSentMediaUrls: evidence.messagingToolSentMediaUrls } : {},
			...evidence.messagingToolSentTargets?.length ? { messagingToolSentTargets: evidence.messagingToolSentTargets } : {},
			...evidence.messagingToolSourceReplyPayloads?.length ? { messagingToolSourceReplyPayloads: evidence.messagingToolSourceReplyPayloads } : {}
		};
	};
	const persistBlockedBeforeAgentRun = async (block) => {
		try {
			const nowMs = Date.now();
			const sessionManager = SessionManager.open(params.sessionFile);
			sessionManager.appendMessage({
				role: "user",
				content: [{
					type: "text",
					text: block.message
				}],
				timestamp: nowMs,
				idempotencyKey: `hook-block:before_agent_run:user:${params.runId}`,
				__openclaw: { beforeAgentRunBlocked: {
					blockedBy: block.pluginId,
					blockedAt: nowMs
				} }
			});
			flushSessionManagerFile(sessionManager);
		} catch (err) {
			log.warn(`before_agent_run block: failed to persist redacted CLI user message: ${formatErrorMessage(err)}`);
		}
	};
	const toCliRunFailure = (error) => {
		if (isFailoverError(error)) throw error;
		const message = formatErrorMessage(error);
		if (isFailoverErrorMessage(message, { provider: params.provider })) {
			const reason = classifyFailoverReason(message, { provider: params.provider }) ?? "unknown";
			const status = resolveFailoverStatus(reason);
			throw new FailoverError(message, {
				reason,
				provider: params.provider,
				model: context.modelId,
				sessionId: params.sessionId,
				lane: params.lane,
				status
			});
		}
		throw error;
	};
	const executeCliAttempt = async (cliSessionIdToUse, timeoutMs = params.timeoutMs) => {
		const output = await executePreparedCliRun(timeoutMs === params.timeoutMs ? context : {
			...context,
			params: {
				...context.params,
				timeoutMs
			}
		}, cliSessionIdToUse);
		const sourceReplyMirror = resolveCliSourceReplyMirror(output);
		const assistantText = sourceReplyMirror.delivered ? sourceReplyMirror.visibleText ?? "" : output.text.trim();
		if (!assistantText && !output.didSendViaMessagingTool && params.allowEmptyAssistantReplyAsSilent !== true) {
			const emptyOutputDiagnostics = formatCliEmptyOutputDiagnostics(output);
			if (emptyOutputDiagnostics) cliBackendLog.warn(`cli empty response diagnostics: ${emptyOutputDiagnostics}`);
			throw attachCliMessagingDeliveryEvidence(new FailoverError("CLI backend returned an empty response.", {
				reason: "empty_response",
				provider: params.provider,
				model: context.modelId,
				sessionId: params.sessionId,
				lane: params.lane
			}), output);
		}
		const assistantTexts = assistantText ? [assistantText] : [];
		const lastAssistant = assistantText.length > 0 ? buildCliHookAssistantMessage({
			text: assistantText,
			provider: params.provider,
			model: context.modelId,
			usage: output.usage
		}) : void 0;
		if (assistantText.length > 0 && hasLlmOutputHooks) runAgentHarnessLlmOutputHook({
			event: {
				runId: params.runId,
				sessionId: params.sessionId,
				provider: params.provider,
				model: context.modelId,
				...context.contextWindowInfo?.tokens ? { contextTokenBudget: context.contextWindowInfo.tokens } : {},
				...context.contextWindowInfo?.source ? { contextWindowSource: context.contextWindowInfo.source } : {},
				...context.contextWindowInfo?.referenceTokens ? { contextWindowReferenceTokens: context.contextWindowInfo.referenceTokens } : {},
				resolvedRef: `${params.provider}/${context.modelId}`,
				assistantTexts,
				...lastAssistant ? { lastAssistant } : {},
				...output.usage ? { usage: output.usage } : {}
			},
			ctx: hookContext,
			hookRunner
		});
		return {
			output,
			assistantText,
			lastAssistant,
			sourceReplyWasDelivered: sourceReplyMirror.delivered
		};
	};
	const buildCliRunResult = (resultParams) => {
		const text = resultParams.output.text?.trim();
		const rawText = resultParams.output.rawText?.trim();
		const sourceReplyMirror = resolveCliSourceReplyMirror(resultParams.output);
		const finalAssistantVisibleText = sourceReplyMirror.delivered ? sourceReplyMirror.visibleText : text;
		const payloads = sourceReplyMirror.payloads.length > 0 ? sourceReplyMirror.payloads : sourceReplyMirror.delivered ? void 0 : text ? [resultParams.assistantTranscriptOwned ? setReplyPayloadMetadata({ text }, { assistantTranscriptOwned: true }) : { text }] : params.allowEmptyAssistantReplyAsSilent === true ? [{ text: SILENT_REPLY_TOKEN }] : void 0;
		if (resultParams.output.didSendViaMessagingTool) deliveredMessagingSideEffect = true;
		const unflushedCliSessionId = resultParams.effectiveCliSessionId && resultParams.bindingFlushOk === false ? resultParams.effectiveCliSessionId : void 0;
		const persistedCliSessionId = unflushedCliSessionId ? void 0 : resultParams.effectiveCliSessionId;
		const agentSessionId = unflushedCliSessionId ? "" : resultParams.effectiveCliSessionId ?? params.sessionId ?? "";
		const yielded = resultParams.output.yielded === true;
		const stopReason = yielded ? "end_turn" : "completed";
		return {
			payloads,
			meta: {
				durationMs: Date.now() - context.started,
				...resultParams.output.finalPromptText ? { finalPromptText: resultParams.output.finalPromptText } : {},
				...finalAssistantVisibleText || rawText ? {
					...finalAssistantVisibleText ? { finalAssistantVisibleText } : {},
					...rawText ? { finalAssistantRawText: rawText } : {}
				} : {},
				systemPromptReport: context.systemPromptReport,
				...yielded ? {
					yielded: true,
					livenessState: "paused",
					stopReason
				} : {},
				executionTrace: {
					winnerProvider: params.provider,
					winnerModel: context.modelId,
					attempts: [{
						provider: params.provider,
						model: context.modelId,
						result: "success"
					}],
					fallbackUsed: false,
					runner: "cli"
				},
				requestShaping: {
					...params.thinkLevel ? { thinking: params.thinkLevel } : {},
					...context.effectiveAuthProfileId ? { authMode: "auth-profile" } : {}
				},
				completion: {
					finishReason: yielded ? "end_turn" : "stop",
					stopReason,
					refusal: false
				},
				agentMeta: {
					sessionId: agentSessionId,
					provider: params.provider,
					model: context.modelId,
					usage: resultParams.output.usage,
					...resultParams.output.usage ? { lastCallUsage: resultParams.output.usage } : {},
					...persistedCliSessionId ? { cliSessionBinding: {
						sessionId: persistedCliSessionId,
						...context.effectiveAuthProfileId ? { authProfileId: context.effectiveAuthProfileId } : {},
						...context.authEpoch ? { authEpoch: context.authEpoch } : {},
						authEpochVersion: context.authEpochVersion,
						...context.extraSystemPromptHash ? { extraSystemPromptHash: context.extraSystemPromptHash } : {},
						...context.messageToolPolicyHash ? { messageToolPolicyHash: context.messageToolPolicyHash } : {},
						...context.promptToolNamesHash ? { promptToolNamesHash: context.promptToolNamesHash } : {},
						...context.cwdHash ? { cwdHash: context.cwdHash } : {},
						...context.preparedBackend.mcpConfigHash ? { mcpConfigHash: context.preparedBackend.mcpConfigHash } : {},
						...context.preparedBackend.mcpResumeHash ? { mcpResumeHash: context.preparedBackend.mcpResumeHash } : {}
					} } : {},
					...unflushedCliSessionId ? { clearCliSessionBinding: true } : {}
				}
			},
			...resultParams.output.didSendViaMessagingTool ? { didSendViaMessagingTool: true } : {},
			...resultParams.output.didDeliverSourceReplyViaMessageTool ? { didDeliverSourceReplyViaMessageTool: true } : {},
			...resultParams.output.messagingToolSentTexts?.length ? { messagingToolSentTexts: resultParams.output.messagingToolSentTexts } : {},
			...resultParams.output.messagingToolSentMediaUrls?.length ? { messagingToolSentMediaUrls: resultParams.output.messagingToolSentMediaUrls } : {},
			...resultParams.output.messagingToolSentTargets?.length ? { messagingToolSentTargets: resultParams.output.messagingToolSentTargets } : {},
			...resultParams.output.messagingToolSourceReplyPayloads?.length ? { messagingToolSourceReplyPayloads: resultParams.output.messagingToolSourceReplyPayloads } : {}
		};
	};
	const executeRun = async () => {
		await bootstrapHarnessContextEngine({
			hadSessionFile: context.hadSessionFile,
			contextEngine: context.contextEngine,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			sessionFile: params.sessionFile,
			config: context.contextEngineConfig,
			contextEngineHostSupport: buildGenericCliContextEngineHostSupport({ backendId: context.backendResolved.id }),
			providerId: params.provider,
			modelId: context.modelId,
			warn: (message) => log.warn(message)
		});
		const contextEngineHistoryMessages = context.contextEngine ? await loadCliSessionContextEngineMessages({
			sessionId: params.sessionId,
			sessionFile: params.sessionFile,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			config: params.config
		}) : [];
		const finishCliAttempt = async (result, fallbackCliSessionId) => {
			const { output, assistantText, lastAssistant, sourceReplyWasDelivered } = result;
			try {
				const effectiveCliSessionId = output.sessionId ?? fallbackCliSessionId;
				await finalizeCliContextEngineTurn({
					context,
					historyMessages: context.contextEngine ? contextEngineHistoryMessages : historyMessages,
					assistantText,
					output
				});
				const assistantTranscriptOwned = await persistCliAssistantTranscript({
					runParams: params,
					text: sourceReplyWasDelivered ? "" : assistantText,
					modelId: context.modelId,
					usage: output.usage
				});
				const bindingFlushOk = await isCliBindingFlushed(effectiveCliSessionId, params.provider, context.cwd ?? context.workspaceDir);
				await runCliAgentEndHook(params, {
					event: {
						messages: buildAgentEndMessages(lastAssistant),
						success: true,
						durationMs: Date.now() - context.started
					},
					ctx: hookContext,
					hookRunner
				});
				return buildCliRunResult({
					output,
					effectiveCliSessionId,
					bindingFlushOk,
					assistantTranscriptOwned
				});
			} catch (error) {
				throw attachCliMessagingDeliveryEvidence(error, output);
			}
		};
		const finishDeliveredFailure = async (error) => {
			const evidence = getCliMessagingDeliveryEvidence(error);
			if (!evidence) return;
			await runCliAgentEndHook(params, {
				event: buildFailedAgentEndEvent(formatErrorMessage(error)),
				ctx: hookContext,
				hookRunner
			});
			return buildDeliveredFailureResult(error, evidence);
		};
		if (hasBeforeAgentRunHooks && hookRunner) {
			let beforeRunResult;
			try {
				beforeRunResult = await hookRunner.runBeforeAgentRun({
					prompt: params.prompt,
					systemPrompt: context.systemPrompt,
					messages: buildAgentHookConversationMessages({
						historyMessages,
						currentTurnMessages: []
					}),
					channelId: hookContext.channelId,
					accountId: params.agentAccountId,
					senderId: params.senderId ?? void 0,
					senderIsOwner: params.senderIsOwner ?? void 0
				}, buildAgentHookContext(hookContext));
			} catch {
				const blockMessage = resolveBlockMessage({
					outcome: "block",
					reason: "before_agent_run hook failed"
				}, { blockedBy: "before_agent_run" });
				await persistBlockedBeforeAgentRun({
					message: blockMessage,
					pluginId: "before_agent_run"
				});
				await runCliAgentEndHook(params, {
					event: buildBlockedAgentEndEvent(blockMessage),
					ctx: hookContext,
					hookRunner
				});
				return buildBlockedBeforeAgentRunResult(blockMessage);
			}
			const beforeRunDecision = beforeRunResult?.decision;
			if (beforeRunDecision?.outcome === "block") {
				const blockMessage = resolveBlockMessage(beforeRunDecision, { blockedBy: beforeRunResult?.pluginId ?? "unknown" });
				await persistBlockedBeforeAgentRun({
					message: blockMessage,
					pluginId: beforeRunResult?.pluginId ?? "unknown"
				});
				await runCliAgentEndHook(params, {
					event: buildBlockedAgentEndEvent(blockMessage),
					ctx: hookContext,
					hookRunner
				});
				return buildBlockedBeforeAgentRunResult(blockMessage);
			}
		}
		await persistApprovedCliUserTurnTranscript(params);
		runAgentHarnessLlmInputHook({
			event: llmInputEvent,
			ctx: hookContext,
			hookRunner
		});
		try {
			return await finishCliAttempt(await executeCliAttempt(context.reusableCliSession.sessionId), context.reusableCliSession.sessionId);
		} catch (err) {
			const deliveredFailure = await finishDeliveredFailure(err);
			if (deliveredFailure) return deliveredFailure;
			if (isFailoverError(err)) {
				const retryableSessionId = context.reusableCliSession.sessionId;
				if (shouldRetryFreshCliSessionAfterFailover({
					error: err,
					hasHistoryPrompt: Boolean(context.openClawHistoryPrompt)
				}) && retryableSessionId && params.sessionKey) try {
					const retryTimeoutMs = params.timeoutMs - (Date.now() - context.started);
					if (retryTimeoutMs <= 0) throw err;
					if (params.onBeforeFreshCliSessionRetry) {
						if (!await params.onBeforeFreshCliSessionRetry({
							provider: params.provider,
							reason: err.reason,
							sessionId: retryableSessionId
						})) throw err;
					}
					cliBackendLog.warn(`cli session recovery retry: provider=${params.provider} reason=${err.reason} sessionKey=${params.sessionKey}`);
					return await finishCliAttempt(await executeCliAttempt(void 0, retryTimeoutMs));
				} catch (retryErr) {
					const deliveredRetryFailure = await finishDeliveredFailure(retryErr);
					if (deliveredRetryFailure) return deliveredRetryFailure;
					await runCliAgentEndHook(params, {
						event: buildFailedAgentEndEvent(formatErrorMessage(retryErr)),
						ctx: hookContext,
						hookRunner
					});
					return toCliRunFailure(retryErr);
				}
				await runCliAgentEndHook(params, {
					event: buildFailedAgentEndEvent(formatErrorMessage(err)),
					ctx: hookContext,
					hookRunner
				});
				throw err;
			}
			await runCliAgentEndHook(params, {
				event: buildFailedAgentEndEvent(formatErrorMessage(err)),
				ctx: hookContext,
				hookRunner
			});
			return toCliRunFailure(err);
		}
	};
	let runResult;
	let runError;
	let runFailed = false;
	try {
		runResult = await executeRun();
	} catch (error) {
		runFailed = true;
		runError = error;
	}
	try {
		await context.preparedBackend.cleanup?.();
	} catch (cleanupError) {
		if (!deliveredMessagingSideEffect) {
			if (runFailed) cliBackendLog.warn(`CLI run also failed before backend cleanup: ${formatErrorMessage(runError)}`);
			throw cleanupError;
		}
		cliBackendLog.warn(`CLI backend cleanup failed after confirmed message delivery: ${formatErrorMessage(cleanupError)}`);
	}
	if (runFailed) throw runError;
	if (!runResult) throw new Error("CLI run completed without a result");
	return runResult;
}
//#endregion
export { runCliAgent as n, runPreparedCliAgent as r, isCliBindingFlushed as t };
