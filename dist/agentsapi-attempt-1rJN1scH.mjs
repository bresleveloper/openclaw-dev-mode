import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { o as racePromiseWithAbortSignal } from "./src-D1BHGNTj.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { a as resolveAgentDir } from "./agent-scope-config-CDYpzA0r.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { N as setActiveEmbeddedRun, i as clearActiveEmbeddedRun } from "./runs-BErx7xDZ.mjs";
import { o as awaitAgentEndSideEffects, s as runAgentEndSideEffects } from "./context-engine-lifecycle-Ckuf4rBi.mjs";
import { t as buildAgentHookContextChannelFields } from "./hook-agent-context-Bx9S6KFK.mjs";
import { t as log } from "./logger-BpegRAAz.mjs";
import { r as buildCurrentInboundPrompt } from "./runtime-context-prompt-CKrto4c6.mjs";
import { s as buildEmbeddedForegroundPromptContext } from "./settled-turn-finalization-result-CYgcNMKN.mjs";
import { t as SessionManager } from "./session-manager-B2n0aSnK.mjs";
import { u as sanitizeToolArgs } from "./embedded-agent-tool-results-C0yTOgai.mjs";
import { o as runAgentHarnessLlmOutputHook } from "./lifecycle-hook-helpers-DqGkgJ4L.mjs";
import { g as resolveAgentHarnessBeforePromptBuildResult } from "./agent-harness-runtime-BxShxpgh.mjs";
import { a as resolveAgentHarnessHistoryLimits, d as createAgentHarnessAttemptCancellation, f as createAgentHarnessAttemptDeadlineController, l as createAgentHarnessAttemptLifecycle, t as AgentHarnessProjectionSettlement, u as emitAgentHarnessAttemptEvent } from "./agent-harness-attempt-runtime-Dv3UHbll.mjs";
import "./agent-sessions-B3WQF18J.mjs";
import { n as agentsApiConfigSchema, r as resolveAgentsApiEnvironment } from "./config-C0jAkmTa.mjs";
import { t as AgentsApiClient } from "./agentsapi-client-BrHNqiHF.mjs";
import { i as resolveAgentsApiSessionAccessError } from "./agentsapi-errors-DmeH76ku.mjs";
import { i as uploadInputs, n as prepareInputs, r as prepareSelfHostedInputs, t as collectOutputs } from "./agentsapi-files-asYo_Iwb.mjs";
import { t as buildAgentsApiMcpTools } from "./agentsapi-mcp-DTAfOAN7.mjs";
import { s as recordAgentsApiNativeToolTranscript } from "./agentsapi-transcript-FYofGdvV.mjs";
import { t as AgentsApiMessageProjection } from "./agentsapi-messages-D634LAfa.mjs";
import { n as buildAgentsApiInstructions, r as buildAgentsApiTurnInput, t as HOSTED_ATTACHMENT_UPLOAD_UNAVAILABLE_FEEDBACK } from "./agentsapi-prompt-BFVHQO0i.mjs";
import { t as resolveAgentsApiReasoningEffort } from "./agentsapi-reasoning-CO6AZ7U1.mjs";
import { t as createAgentsApiSession } from "./agentsapi-session-BAGkoMuZ.mjs";
import { t as buildAgentsApiToolSurface } from "./agentsapi-tools-CbqyeInZ.mjs";
import { createHash } from "node:crypto";
//#region extensions/agentsapi/agentsapi-attempt.ts
async function runAgentsApiAttempt(params, binding, bind, assertOwnerCurrent, assertHarnessCurrent, target, readPluginConfig, promptHistories) {
	const startedAtMs = Date.now();
	const cancellationState = {
		explicitCancellationObserved: false,
		terminalOutcomeFrozen: false,
		sharedAbortAllowedAfterTerminalOutcome: false
	};
	const cancellation = createAgentHarnessAttemptCancellation({
		upstreamSignal: params.abortSignal,
		onAttemptAbort: params.onAttemptAbort,
		state: cancellationState
	});
	const { controller } = cancellation;
	const assertCurrent = () => {
		assertOwnerCurrent();
		controller.signal.throwIfAborted();
	};
	let finalizingProjection = false;
	let finalizingProjectionSignal;
	const assertProjectionCurrent = () => {
		assertOwnerCurrent();
		if (finalizingProjection) finalizingProjectionSignal?.throwIfAborted();
		else controller.signal.throwIfAborted();
	};
	let lastToolError;
	let toolTerminalObserved = false;
	const observeToolTerminal = params.observeToolTerminal;
	const runParams = observeToolTerminal ? {
		...params,
		observeToolTerminal: (observation) => {
			assertProjectionCurrent();
			const resolution = observeToolTerminal(observation);
			assertProjectionCurrent();
			toolTerminalObserved = true;
			lastToolError = resolution.lastToolError;
			return resolution;
		}
	} : params;
	let timeout;
	let settling = false;
	let settlementDeadlineAtMs;
	const deadlines = createAgentHarnessAttemptDeadlineController({
		startedAtMs,
		timeoutMs: params.timeoutMs,
		settlementTimeoutMs: 3e4,
		signal: controller.signal,
		onDeadlineChanged: (deadline) => {
			if (settling && deadline.kind === "bounded") settlementDeadlineAtMs = deadline.deadlineAtMs;
			params.onAttemptDeadlineChanged?.(deadline);
		},
		onTimeout: (expired) => {
			timeout = expired;
			const error = /* @__PURE__ */ new Error(`Agents API ${expired.kind} timed out`);
			params.onAttemptTimeout?.(error);
			cancellation.abortExplicitly(error);
		}
	});
	const beginSettlement = () => {
		settling = true;
		deadlines.beginSettlement(Date.now());
	};
	const emitEvent = (event) => emitAgentHarnessAttemptEvent(params, event, {
		label: "Agents API",
		log
	});
	const lifecycle = createAgentHarnessAttemptLifecycle({
		attempt: params,
		backend: "agentsapi",
		startedAtMs,
		state: {
			lifecycleStarted: false,
			lifecycleTerminalEmitted: false
		},
		emitEvent
	});
	const contextWindow = {
		contextTokenBudget: params.contextWindowInfo?.tokens ?? params.contextTokenBudget,
		contextWindowSource: params.contextWindowInfo?.source,
		contextWindowReferenceTokens: params.contextWindowInfo?.referenceTokens
	};
	const hookContext = {
		runId: params.runId,
		agentId: target.agentId,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		workspaceDir: params.workspaceDir,
		modelProviderId: params.provider,
		modelId: params.model.id,
		trigger: params.trigger,
		inputProvenance: params.inputProvenance,
		...buildAgentHookContextChannelFields(params),
		channelContext: params.channelContext,
		...contextWindow
	};
	let native;
	let remoteSessionId = binding?.sessionId;
	let terminal = { kind: "ok" };
	let reply;
	let projection;
	let usageRecorded = false;
	let projectionClosed = false;
	const projectionSettlement = new AgentHarnessProjectionSettlement(runParams, () => {
		if (projectionClosed || controller.signal.aborted) return false;
		try {
			assertOwnerCurrent();
			return true;
		} catch {
			return false;
		}
	}, { label: "Agents API" });
	let terminalTurnId;
	const toolCleanups = [];
	let toolSurface;
	let outputMedia;
	let startedToolCount = 0;
	let completedToolCount = 0;
	const handle = {
		kind: "embedded",
		toolAuthorityFingerprint: params.toolAuthorityFingerprint,
		sourceReplyDeliveryMode: params.sourceReplyDeliveryMode,
		taskSuggestionDeliveryMode: params.taskSuggestionDeliveryMode,
		supportsTranscriptCommitWait: true,
		runId: params.runId,
		startedAtMs,
		queueMessage: async (text, options) => {
			assertCurrent();
			if (!native?.isAvailable()) throw new Error("Agents API turn is not ready for steering");
			if (options?.images?.length || options?.media?.length) throw new Error("Agents API attachments require a separate turn");
			await native.queueMessage(buildCurrentInboundPrompt({
				context: options?.currentInboundContext,
				prompt: text
			}), async () => {
				await options?.userTurnTranscriptRecorder?.persistApproved();
			});
			options?.userTurnTranscriptRecorder?.markSentToProvider?.();
		},
		isStreaming: () => native?.isAvailable() ?? false,
		isStopped: () => controller.signal.aborted || (native?.isSettled() ?? false),
		isAborted: () => controller.signal.aborted,
		isCompacting: () => false,
		abort: () => cancellation.abortExplicitly(/* @__PURE__ */ new Error("Agents API turn interrupted")),
		cancel: () => cancellation.abortExplicitly(/* @__PURE__ */ new Error("Agents API turn interrupted"))
	};
	try {
		params.replyOperation?.attachBackend(handle);
		setActiveEmbeddedRun(params.sessionId, handle, params.sessionKey, params.sessionFile, params.agentId);
		assertCurrent();
		const pluginConfig = agentsApiConfigSchema.parse(readPluginConfig() ?? {});
		const environment = resolveAgentsApiEnvironment(pluginConfig, params.workspaceDir);
		const surface = buildAgentsApiToolSurface(runParams, controller.signal, assertCurrent, (cleanup) => toolCleanups.push(cleanup));
		toolSurface = surface;
		const mcpTools = await buildAgentsApiMcpTools(params);
		assertCurrent();
		const sessionIdentity = [
			params.model.id,
			...environment.type === "self_hosted" || environment.network != null ? [environment] : [],
			...mcpTools.length ? [mcpTools] : []
		];
		const fingerprint = createHash("sha256").update(JSON.stringify(sessionIdentity)).digest("hex");
		if (binding && binding.configFingerprint !== fingerprint) throw new Error("Agents API model, environment, or MCP configuration changed; reset the OpenClaw session before continuing");
		const inputMedia = environment.type === "openai_hosted" && params.hostCapabilities.resolveInputAttachmentMedia ? await params.hostCapabilities.resolveInputAttachmentMedia() : params.media;
		assertCurrent();
		const inputs = environment.type === "openai_hosted" ? await prepareInputs(inputMedia, params.workspaceDir, assertCurrent, controller.signal) : await prepareSelfHostedInputs(params, assertCurrent, controller.signal);
		const client = new AgentsApiClient(params.resolvedApiKey, assertOwnerCurrent);
		const reasoningEffort = resolveAgentsApiReasoningEffort(params);
		const creatingSession = !remoteSessionId;
		const instructions = creatingSession ? await buildAgentsApiInstructions(params, surface.declarations, environment) : "";
		assertCurrent();
		const recorder = params.userTurnTranscriptRecorder;
		const admittedMessage = recorder?.message ?? await recorder?.resolveMessage();
		assertCurrent();
		const historyLimits = resolveAgentHarnessHistoryLimits(params.contextWindowInfo?.tokens ?? params.contextTokenBudget);
		const historyScope = JSON.stringify([
			params.runId,
			target.agentId,
			target.sessionId,
			target.sessionKey,
			target.storePath,
			params.workspaceDir,
			historyLimits
		]);
		let preparedHistory;
		const promptBuild = await resolveAgentHarnessBeforePromptBuildResult({
			prompt: params.prompt,
			currentInboundContext: params.currentInboundContext,
			currentUserMessage: admittedMessage ?? params.prompt,
			developerInstructions: instructions,
			messages: async () => {
				assertCurrent();
				const retained = recorder && promptHistories.get(recorder);
				if (retained?.scope === historyScope && retained.nativeSessionId === remoteSessionId) return retained.messages;
				if (recorder) promptHistories.delete(recorder);
				const history = await SessionManager.openModelContextAsync(target, {
					cwd: params.workspaceDir,
					admission: recorder?.getAdmissionReceipt(),
					signal: controller.signal,
					limits: historyLimits
				});
				assertCurrent();
				preparedHistory = history.buildSessionContext().messages;
				return preparedHistory;
			},
			ctx: hookContext,
			bootstrapContextRunKind: params.bootstrapContextRunKind,
			toolAuthority: {
				fingerprint: params.toolAuthorityFingerprint,
				activeToolNames: () => surface.declarations.map((tool) => tool.name),
				assertActive: assertCurrent
			}
		});
		assertCurrent();
		if (!remoteSessionId) {
			remoteSessionId = await client.create(controller.signal, promptBuild.developerInstructions, params.model.id, {
				nativeTools: pluginConfig.nativeTools,
				functions: surface.declarations,
				mcpTools,
				files: inputs.files,
				environment,
				reasoning: {
					effort: reasoningEffort,
					...params.reasoningLevel && params.reasoningLevel !== "off" ? { summary: "auto" } : {}
				}
			});
			assertCurrent();
			await bind({
				sessionId: remoteSessionId,
				configFingerprint: fingerprint
			});
		} else await client.setReasoningEffort(remoteSessionId, reasoningEffort, controller.signal);
		assertCurrent();
		if (recorder && preparedHistory) promptHistories.set(recorder, {
			scope: historyScope,
			nativeSessionId: remoteSessionId,
			messages: preparedHistory
		});
		if (!creatingSession && inputs.files.length) {
			if ((await uploadInputs(client, remoteSessionId, inputs.files, assertCurrent, controller.signal)).status === "unavailable") {
				inputs.mappingText = "";
				inputs.feedbackText = [inputs.feedbackText, HOSTED_ATTACHMENT_UPLOAD_UNAVAILABLE_FEEDBACK].filter(Boolean).join("\n");
			}
		}
		projection = new AgentsApiMessageProjection(projectionSettlement.params, remoteSessionId, async (event) => {
			assertCurrent();
			await emitEvent(event);
			assertCurrent();
		}, assertProjectionCurrent);
		reply = projection.reply;
		native = createAgentsApiSession({
			client,
			cleanupClient: new AgentsApiClient(params.resolvedApiKey, assertHarnessCurrent),
			sessionId: remoteSessionId,
			signal: controller.signal,
			assertCurrent,
			onSettled: beginSettlement,
			onReconcile: (turn, items) => projection.reconcile(turn, items, { presentation: !finalizingProjection }),
			onUsageError: (error) => log.warn("Agents API token accounting unavailable", { error }),
			onTranscriptOrderingGap: () => projection.reportTranscriptOrderingGap(),
			onReconcileHistory: async (entries) => {
				for (const { turn, items } of entries) for (const item of items) {
					assertProjectionCurrent();
					await recordAgentsApiNativeToolTranscript(runParams, remoteSessionId, turn.id, item, assertProjectionCurrent, Date.now, { enclosingStatus: turn.status });
					assertProjectionCurrent();
				}
			},
			executeFunction: async (call) => {
				startedToolCount++;
				await emitEvent({
					stream: "tool",
					data: {
						phase: "start",
						name: call.name,
						toolCallId: call.call_id,
						args: asOptionalRecord(sanitizeToolArgs(call.arguments))
					}
				});
				assertCurrent();
				const result = await surface.execute(call);
				assertCurrent();
				projection.recordGatewayTranscriptReceipt(call.turn_id, call.call_id);
				return result;
			},
			onFunctionResult: async (call, result) => {
				completedToolCount++;
				await emitEvent({
					stream: "tool",
					data: {
						phase: "result",
						name: call.name,
						toolCallId: call.call_id,
						isError: !result.success,
						result: { content: [{
							type: "text",
							text: result.success ? result.output : result.error
						}] }
					}
				});
				assertCurrent();
			},
			onEvent: async (event) => {
				await projection.observe(event);
				assertCurrent();
				params.onRunProgress?.({
					reason: event.type,
					provider: "openai",
					model: params.model.id,
					backend: "agentsapi"
				});
			}
		});
		lifecycle.emitLifecycleStart({
			provider: "openai",
			model: params.model.id
		});
		const turnInput = await buildAgentsApiTurnInput(params, surface.declarations, promptBuild.prompt, inputs.mappingText, environment.type, assertCurrent, inputs.feedbackText);
		assertCurrent();
		const result = await native.run(turnInput, async () => {
			await params.userTurnTranscriptRecorder?.persistApproved();
		}, () => params.userTurnTranscriptRecorder?.markSentToProvider?.());
		terminalTurnId = result.turn.id;
		const turns = await native.readUsageTurns();
		assertCurrent();
		projection.recordUsage(params.model, turns);
		usageRecorded = true;
		params.hostCapabilities.reportOutputTokens?.(reply.usage?.output ?? 0);
		if (result.cancelled) terminal = {
			kind: "aborted",
			source: "runtime"
		};
		else if (result.terminatedByTool) {
			await projection.commitUsage(result.turn);
			assertCurrent();
		} else {
			const items = await client.items(remoteSessionId, result.turn.id, controller.signal);
			assertCurrent();
			try {
				if (environment.type === "openai_hosted") outputMedia = await collectOutputs(client, remoteSessionId, result.turn.id, assertCurrent, controller.signal, params.hostCapabilities.prepareReplyMedia);
			} finally {
				await projection.commit(result.turn, items);
				assertCurrent();
			}
		}
	} catch (error) {
		terminal = timeout ? {
			kind: "timeout",
			phase: "prompt",
			source: "runtime",
			aborted: true
		} : params.abortSignal?.aborted ? {
			kind: "aborted",
			source: "external"
		} : cancellationState.explicitCancellationObserved ? {
			kind: "aborted",
			source: "runtime"
		} : {
			kind: "failed",
			source: "prompt",
			error
		};
		if (terminal.kind === "failed") log.warn("Agents API session failed", { error });
	} finally {
		beginSettlement();
		const cleanupMs = Math.max(0, Math.min(3e4, (settlementDeadlineAtMs ?? Date.now() + 3e4) - Date.now()));
		const cleanupSignal = cleanupMs > 0 ? AbortSignal.timeout(cleanupMs) : AbortSignal.abort(/* @__PURE__ */ new Error("Agents API settlement timed out"));
		try {
			await native?.close();
		} catch (error) {
			terminal = {
				kind: "failed",
				source: "prompt",
				error
			};
		}
		try {
			if (native && projection && !usageRecorded) {
				const turns = await native.readUsageTurns();
				assertHarnessCurrent();
				projection.recordUsage(params.model, turns);
			}
		} catch (error) {
			terminal = {
				kind: "failed",
				source: "prompt",
				error
			};
		}
		if ((controller.signal.aborted || terminal.kind !== "ok") && native && projection) {
			let ownerCurrent = false;
			try {
				assertOwnerCurrent();
				ownerCurrent = true;
			} catch {}
			if (ownerCurrent) {
				finalizingProjection = true;
				finalizingProjectionSignal = cleanupSignal;
				try {
					await native.reconcileAfterClose(cleanupSignal);
				} catch (error) {
					log.warn("Agents API terminal history reconciliation failed", { error });
				} finally {
					finalizingProjection = false;
					finalizingProjectionSignal = void 0;
				}
			}
		}
		try {
			await racePromiseWithAbortSignal(projectionSettlement.drain(), cleanupSignal);
		} catch (error) {
			if (!controller.signal.aborted) terminal = {
				kind: "failed",
				source: "prompt",
				error
			};
		}
		projectionClosed = true;
		if (timeout) terminal = {
			kind: "timeout",
			phase: "prompt",
			source: "runtime",
			aborted: true
		};
		else if (terminal.kind === "ok" && controller.signal.aborted) terminal = {
			kind: "aborted",
			source: params.abortSignal?.aborted ? "external" : "runtime"
		};
		cancellation.freezeTerminalOutcome();
		deadlines.dispose();
		cancellation.dispose();
		controller.abort();
		for (const cleanup of toolCleanups.toReversed()) try {
			await cleanup("Agents API attempt settled");
		} catch (error) {
			log.warn("Agents API tool cleanup failed", { error });
		}
		clearActiveEmbeddedRun(params.sessionId, handle, params.sessionKey, params.sessionFile);
		lifecycle.emitLifecycleTerminal({ phase: terminal.kind === "failed" ? "error" : "end" });
	}
	if (terminal.kind === "failed") terminal = {
		...terminal,
		error: resolveAgentsApiSessionAccessError(terminal.error, remoteSessionId)
	};
	const result = {
		terminal,
		sessionIdUsed: params.sessionId,
		sessionFileUsed: params.sessionFile,
		agentHarnessId: "agentsapi",
		messagesSnapshot: (await SessionManager.openAsync(target, params.workspaceDir)).buildSessionContext().messages,
		assistantTexts: reply?.lastAssistant?.content.filter((part) => part.type === "text").map((part) => part.text) ?? [],
		lastAssistant: reply?.lastAssistant,
		currentAttemptAssistant: reply?.lastAssistant,
		currentAttemptCompletedAssistant: reply?.lastAssistant,
		assistantTranscriptOwned: Boolean(reply?.lastAssistant),
		assistantTranscriptIdempotencyKey: reply?.lastAssistant && terminalTurnId ? `agentsapi:${remoteSessionId}:${terminalTurnId}` : void 0,
		toolMetas: [...projection?.toolMetas ?? [], ...toolSurface?.toolMetas ?? []],
		lastToolError: toolTerminalObserved ? lastToolError : toolSurface?.lastToolError ?? projection?.lastToolError,
		...toolSurface?.runtimeFacts,
		didSendViaMessagingTool: false,
		messagingToolSentTexts: [],
		messagingToolSentMediaUrls: [],
		messagingToolSentTargets: [],
		...toolSurface?.delivery,
		...outputMedia && {
			hostOwnedToolMediaUrls: [...outputMedia],
			toolMediaUrls: [.../* @__PURE__ */ new Set([...toolSurface?.delivery.toolMediaUrls ?? [], ...outputMedia])],
			toolTrustedLocalMedia: outputMedia.length && !toolSurface?.delivery.toolMediaUrls?.length ? true : toolSurface?.delivery.toolTrustedLocalMedia
		},
		cloudCodeAssistFormatError: false,
		attemptUsage: projection?.tokenUsage,
		agentHarnessResultClassification: projection?.resultClassification,
		replayMetadata: {
			hadPotentialSideEffects: native?.wasSubmitted() ?? false,
			replaySafe: !native?.wasSubmitted()
		},
		itemLifecycle: {
			startedCount: startedToolCount + (projection?.itemLifecycle.startedCount ?? 0),
			completedCount: completedToolCount + (projection?.itemLifecycle.completedCount ?? 0),
			activeCount: Math.max(0, startedToolCount - completedToolCount) + (projection?.itemLifecycle.activeCount ?? 0)
		}
	};
	assertHarnessCurrent();
	runAgentHarnessLlmOutputHook({
		event: {
			runId: params.runId,
			sessionId: params.sessionId,
			provider: params.provider,
			model: params.model.id,
			resolvedRef: `${params.provider}/${params.model.id}`,
			harnessId: "agentsapi",
			prompt: params.prompt,
			...contextWindow,
			assistantTexts: result.assistantTexts,
			lastAssistant: result.lastAssistant,
			usage: result.attemptUsage
		},
		ctx: hookContext
	});
	const agentEnd = {
		event: {
			runId: params.runId,
			messages: result.messagesSnapshot,
			success: terminal.kind === "ok",
			error: terminal.kind === "failed" ? formatErrorMessage(terminal.error) : void 0,
			durationMs: Date.now() - startedAtMs
		},
		ctx: {
			...hookContext,
			config: params.config,
			foregroundPromptContext: buildEmbeddedForegroundPromptContext({
				...params,
				agentId: target.agentId
			}, params.agentDir ?? resolveAgentDir(params.config ?? {}, target.agentId)),
			skillWorkshopAvailable: false,
			compacted: false
		}
	};
	if (!params.messageChannel && !params.messageProvider) await awaitAgentEndSideEffects(agentEnd);
	else runAgentEndSideEffects(agentEnd);
	return result;
}
//#endregion
export { runAgentsApiAttempt as t };
