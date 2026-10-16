import { randomUUID } from "node:crypto";
import { consumeAcpTurnStream } from "openclaw/plugin-sdk/acp-runtime";
import { clearActiveEmbeddedRun, emitAgentEvent, resolveAgentHarnessBeforePromptBuildResult, resolveBootstrapContextForRun, setActiveEmbeddedRun } from "openclaw/plugin-sdk/agent-harness-runtime";
import { SessionManager, buildSessionContext } from "openclaw/plugin-sdk/agent-sessions";
import { DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS } from "openclaw/plugin-sdk/approval-runtime";
import { toErrorObject } from "openclaw/plugin-sdk/error-runtime";
import { resolveStorePath } from "openclaw/plugin-sdk/session-store-runtime";
import { appendSessionTranscriptMessageByIdentityStrict } from "openclaw/plugin-sdk/session-transcript-runtime";
//#region extensions/acpx/src/harness-attempt.ts
async function runAcpHarnessAttempt(params) {
	const { input, runtime } = params;
	if (!input.agentId || !input.sessionKey) throw new Error("ACP chat requires an owned OpenClaw session");
	const agentId = input.agentId;
	const sessionKey = input.sessionKey;
	const controller = new AbortController();
	const signal = AbortSignal.any([
		controller.signal,
		params.generationSignal,
		...input.abortSignal ? [input.abortSignal] : []
	]);
	const eventGate = { open: !signal.aborted };
	const stopDelivery = () => {
		eventGate.open = false;
	};
	const assertActive = () => {
		signal.throwIfAborted();
		input.hostCapabilities.assertActive();
	};
	const transcript = {
		agentId,
		sessionKey,
		sessionId: input.sessionId,
		storePath: resolveStorePath(input.config?.session?.store, { agentId })
	};
	const recorder = input.userTurnTranscriptRecorder;
	if (!recorder) throw new Error("ACP chat requires its admitted transcript recorder");
	let handle;
	let text = "";
	let reasoning = "";
	let started = false;
	let settled = false;
	let timedOut = false;
	let denied = false;
	let approvalFailure;
	let failure;
	let cancelled = false;
	let terminalAnchor;
	let assistant;
	let assistantIdempotencyKey;
	const toolMetas = [];
	let messages = [];
	const activeRun = {
		kind: "embedded",
		runId: input.runId,
		toolAuthorityFingerprint: input.toolAuthorityFingerprint,
		queueMessage: async () => {
			throw new Error(`${params.label} does not support live message injection`);
		},
		isStreaming: () => started && !settled,
		isAborted: () => signal.aborted,
		isCompacting: () => false,
		cancel: () => controller.abort(),
		abort: () => controller.abort(),
		sourceReplyDeliveryMode: input.sourceReplyDeliveryMode
	};
	let activeRegistered = false;
	let timer;
	assertActive();
	try {
		setActiveEmbeddedRun(input.sessionId, activeRun, sessionKey, input.sessionFile, agentId);
		activeRegistered = true;
		input.replyOperation?.attachBackend(activeRun);
		signal.addEventListener("abort", stopDelivery, { once: true });
		timer = setTimeout(() => {
			timedOut = true;
			input.onAttemptTimeout?.(/* @__PURE__ */ new Error("ACP turn timed out"));
			controller.abort();
		}, input.timeoutMs);
		timer.unref();
		const sessionContext = await SessionManager.openModelContextAsync(transcript, {
			cwd: input.workspaceDir,
			signal
		});
		const entries = sessionContext.getBranch();
		messages = sessionContext.buildSessionContext().messages;
		assertActive();
		const target = {
			agentId,
			sessionKey: `agent:${agentId}:harness:${params.harnessId}:${input.sessionId}`,
			agent: params.agent,
			agentCommand: params.command,
			mode: "persistent",
			bridgeSession: {
				agentId,
				sessionKey,
				native: true
			},
			cwd: input.workspaceDir
		};
		handle = await runtime.ensureSession(target);
		assertActive();
		const status = await runtime.getStatus({ handle });
		assertActive();
		if (status.models?.currentModelId !== input.modelId) await runtime.setModel({
			handle,
			model: input.modelId,
			signal,
			assertActive
		});
		assertActive();
		const lastRequestId = status.lastRequestId;
		const previousAssistantIndex = lastRequestId ? entries.findLastIndex((entry) => entry.type === "message" && "idempotencyKey" in entry.message && entry.message.idempotencyKey === `${lastRequestId}:acp:assistant`) : -1;
		const previousUserIndex = lastRequestId && previousAssistantIndex < 0 ? entries.findLastIndex((entry) => entry.type === "message" && entry.message.role === "user" && (entry.id === lastRequestId || lastRequestId.startsWith(`${entry.id}:acp:`))) : -1;
		if (lastRequestId && previousAssistantIndex < 0 && previousUserIndex < 0) throw new Error("ACP conversation history cannot be reconciled; reset this session before continuing");
		await recorder.persistApproved({ expectedSessionId: input.sessionId });
		assertActive();
		const admission = recorder.getAdmissionReceipt();
		if (recorder.isBlocked() || !recorder.hasPersisted() || !admission) throw new Error("ACP input was not admitted to its transcript");
		const previousIndex = previousAssistantIndex >= 0 ? previousAssistantIndex : previousUserIndex;
		const previous = buildSessionContext(entries.slice(previousIndex + 1).filter((entry) => entry.id !== admission.entryId)).messages;
		const bootstrap = !lastRequestId ? await resolveBootstrapContextForRun({
			workspaceDir: input.workspaceDir,
			config: input.config,
			sessionKey,
			sessionId: input.sessionId,
			agentId,
			chatType: input.chatType,
			contextMode: input.bootstrapContextMode,
			runKind: input.bootstrapContextRunKind
		}) : void 0;
		const built = await resolveAgentHarnessBeforePromptBuildResult({
			prompt: input.prompt,
			currentInboundContext: input.currentInboundContext,
			messages,
			developerInstructions: [...bootstrap?.contextFiles.map((file) => `${file.path}\n${file.content}`) ?? [], input.extraSystemPrompt].filter(Boolean).join("\n\n"),
			ctx: {
				runId: input.runId,
				agentId,
				sessionId: input.sessionId,
				sessionKey,
				workspaceDir: input.workspaceDir,
				config: input.config,
				trigger: input.trigger,
				modelProviderId: input.provider,
				modelId: input.modelId
			},
			bootstrapContextRunKind: input.bootstrapContextRunKind
		});
		if (built.toolsAllow) throw new Error("ACP cannot enforce this prompt-hook tool restriction");
		const onPermissionRequest = async (request, context) => {
			try {
				assertActive();
				const approvalSignal = AbortSignal.any([signal, context.signal]);
				const detail = JSON.stringify(request.raw.toolCall);
				const supportsAllowOnce = request.raw.options.some((option) => option.kind === "allow_once");
				const requestResult = await input.hostCapabilities.requestApproval({
					title: `${params.label} permission request`,
					description: request.raw.toolCall.title ?? "Native tool action",
					detail,
					signal: approvalSignal,
					severity: "warning",
					toolName: request.inferredKind ?? "other",
					toolCallId: request.raw.toolCall.toolCallId,
					allowedDecisions: supportsAllowOnce ? ["allow-once", "deny"] : ["deny"],
					timeoutMs: DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS,
					transportTimeoutMs: DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS + 1e4
				});
				const result = requestResult?.id ? await input.hostCapabilities.waitForApproval({
					approvalId: requestResult.id,
					timeoutMs: DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS,
					transportTimeoutMs: DEFAULT_PLUGIN_APPROVAL_TIMEOUT_MS + 1e4,
					signal: approvalSignal
				}) : void 0;
				assertActive();
				approvalSignal.throwIfAborted();
				const allowed = supportsAllowOnce && result?.decision === "allow-once";
				denied ||= !allowed;
				return { outcome: allowed ? "allow_once" : "reject_once" };
			} catch (error) {
				if (!signal.aborted && !context.signal.aborted) approvalFailure = toErrorObject(error, "Native approval request failed");
				denied = true;
				return { outcome: "cancel" };
			}
		};
		const requestId = `${admission.entryId}:acp:${randomUUID()}`;
		const turn = {
			handle,
			text: [
				built.developerInstructions ? `Conversation instructions:\n${built.developerInstructions}` : void 0,
				previous.length ? `Conversation context before this turn:\n${JSON.stringify(previous)}` : void 0,
				`Current turn:\n${built.prompt}`
			].filter(Boolean).join("\n\n"),
			mode: "prompt",
			requestId,
			signal,
			assertActive,
			onPermissionRequest,
			...input.images?.length ? { attachments: input.images.map((image) => ({
				data: image.data,
				mediaType: image.mimeType
			})) } : {}
		};
		const outcome = await consumeAcpTurnStream({
			runtime,
			turn,
			eventGate,
			onBeforePrompt: assertActive,
			onPromptStarted: () => {
				started = true;
				recorder.markSentToProvider?.();
				input.onExecutionStarted?.();
			},
			onOutputEvent: async (event) => {
				assertActive();
				if (event.type === "text_delta") {
					if (event.stream === "thought") {
						reasoning += event.text;
						await input.onReasoningStream?.({ text: reasoning });
					} else {
						if (!text) {
							await input.onAssistantMessageStart?.();
							assertActive();
						}
						text += event.text;
						const update = {
							stream: "assistant",
							data: {
								text,
								delta: event.text
							}
						};
						emitAgentEvent({
							runId: input.runId,
							sessionKey,
							sessionId: input.sessionId,
							...update
						});
						await input.onAgentEvent?.(update);
						assertActive();
						await input.onPartialReply?.({ text });
					}
				} else {
					const existing = event.toolCallId ? toolMetas.find((tool) => tool.toolCallId === event.toolCallId) : void 0;
					const metadata = {
						toolName: event.title ?? event.kind ?? "tool",
						toolCallId: event.toolCallId,
						meta: event.text,
						isError: event.status === "failed"
					};
					if (existing) Object.assign(existing, metadata);
					else toolMetas.push(metadata);
					await input.onToolResult?.({ text: event.text });
				}
			}
		});
		if (approvalFailure) throw approvalFailure;
		cancelled = outcome.terminalStatus === "cancelled";
		if (!text.trim() && denied) text = `${params.label} could not complete this turn because permission was not granted.`;
		else if (!text.trim() && toolMetas.some((tool) => tool.isError)) text = `${params.label} reported a failed tool operation and did not return an answer.`;
		const usage = (await runtime.getStatus({ handle })).usage?.perRequest?.[requestId];
		assistant = {
			role: "assistant",
			provider: input.provider,
			model: input.modelId,
			api: input.model.api,
			content: [...reasoning ? [{
				type: "thinking",
				thinking: reasoning
			}] : [], ...text ? [{
				type: "text",
				text
			}] : []],
			stopReason: cancelled ? "aborted" : "stop",
			timestamp: Date.now(),
			usage: {
				input: usage?.inputTokens ?? 0,
				output: usage?.outputTokens ?? 0,
				cacheRead: usage?.cachedReadTokens ?? 0,
				cacheWrite: usage?.cachedWriteTokens ?? 0,
				totalTokens: usage?.totalTokens ?? 0,
				cost: {
					input: 0,
					output: 0,
					cacheRead: 0,
					cacheWrite: 0,
					total: 0
				}
			}
		};
		const key = `${requestId}:acp:assistant`;
		const written = await appendSessionTranscriptMessageByIdentityStrict({
			...transcript,
			config: input.config,
			runId: input.runId,
			updateMode: "inline",
			message: {
				...assistant,
				idempotencyKey: key
			},
			prepareMessageAfterIdempotencyCheck: (message) => {
				input.hostCapabilities.assertActive();
				return message;
			}
		});
		if (written.kind !== "result") throw new Error("ACP assistant transcript was not committed");
		assistant = written.result.message;
		assistantIdempotencyKey = key;
		terminalAnchor = written.result.anchor;
		messages = (await SessionManager.openModelContextAsync(transcript, {
			cwd: input.workspaceDir,
			through: written.result.anchor
		})).buildSessionContext().messages;
	} catch (error) {
		failure = error;
	} finally {
		settled = true;
		clearTimeout(timer);
		signal.removeEventListener("abort", stopDelivery);
		if (activeRegistered) clearActiveEmbeddedRun(input.sessionId, activeRun, sessionKey, input.sessionFile);
	}
	return {
		terminal: timedOut ? {
			kind: "timeout",
			phase: "prompt",
			source: "runtime",
			aborted: true
		} : signal.aborted || cancelled ? {
			kind: "aborted",
			source: "external"
		} : failure ? {
			kind: "failed",
			source: "prompt",
			error: failure
		} : { kind: "ok" },
		sessionIdUsed: input.sessionId,
		sessionFileUsed: input.sessionFile,
		agentHarnessId: params.harnessId,
		runtimeModelSelection: {
			provider: input.provider,
			model: input.modelId
		},
		messagesSnapshot: messages,
		assistantTexts: text ? [text] : [],
		lastAssistant: assistant,
		currentAttemptAssistant: assistant,
		...assistantIdempotencyKey ? {
			assistantTranscriptOwned: true,
			assistantTranscriptIdempotencyKey: assistantIdempotencyKey,
			contextEngineTerminalAnchor: terminalAnchor
		} : {},
		toolMetas,
		didSendViaMessagingTool: false,
		messagingToolSentTexts: [],
		messagingToolSentMediaUrls: [],
		messagingToolSentTargets: [],
		cloudCodeAssistFormatError: false,
		replayMetadata: {
			hadPotentialSideEffects: toolMetas.length > 0,
			replaySafe: !started
		},
		itemLifecycle: {
			startedCount: toolMetas.length,
			completedCount: failure ? 0 : toolMetas.length,
			activeCount: 0
		}
	};
}
//#endregion
export { runAcpHarnessAttempt };
