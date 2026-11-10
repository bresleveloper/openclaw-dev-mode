import { a as asOptionalRecord } from "./record-coerce-TIsquoVR.mjs";
import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { M as setActiveEmbeddedRun, a as clearActiveEmbeddedRun } from "./runs-Czr-I6_B.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import { t as log } from "./logger-BpVUgEyL.mjs";
import { i as buildCurrentInboundPrompt } from "./runtime-context-prompt-D_5rC-8c.mjs";
import { t as SessionManager } from "./session-manager-Mve5HWCW.mjs";
import { g as resolveAgentHarnessBeforePromptBuildResult, w as resolveAgentExecutorController } from "./agent-harness-runtime-k_z2ig1L.mjs";
import { a as resolveAgentHarnessHistoryLimits, d as createAgentHarnessAttemptCancellation, f as createAgentHarnessAttemptDeadlineController, l as createAgentHarnessAttemptLifecycle, t as AgentHarnessProjectionSettlement, u as emitAgentHarnessAttemptEvent } from "./agent-harness-attempt-runtime-D5l5bBQl.mjs";
import "./agent-sessions-ntysgJrS.mjs";
import { t as createAgentsApiAttemptHooks } from "./agentsapi-attempt-hooks-s49FIDiA.mjs";
import { a as resolveAgentsApiNativeToolPolicy, i as resolveAgentsApiEnvironment, n as agentsApiConfigSchema, r as requireAgentsApiSessionFingerprint } from "./config-gtw8-BMW.mjs";
import { t as AgentsApiClient } from "./agentsapi-client-DzhjNWzN.mjs";
import { t as ensureAgentsApiEnvironment } from "./agentsapi-environment-BlybUrHw.mjs";
import { i as resolveAgentsApiSessionAccessError } from "./agentsapi-errors-C5phEUd2.mjs";
import { i as uploadInputs, n as prepareInputs, r as prepareSelfHostedInputs, t as collectOutputs } from "./agentsapi-files-JvepgjSI.mjs";
import { t as buildAgentsApiMcpTools } from "./agentsapi-mcp-BBxWgvQu.mjs";
import { n as bindAgentsApiTranscriptAuthority, s as recordAgentsApiNativeHistory } from "./agentsapi-transcript-D8MyqCGN.mjs";
import { t as AgentsApiMessageProjection } from "./agentsapi-messages-CGX5G30Q.mjs";
import { n as buildAgentsApiInstructions, r as buildAgentsApiTurnInput, t as HOSTED_ATTACHMENT_UPLOAD_UNAVAILABLE_FEEDBACK } from "./agentsapi-prompt-Dz46rGtt.mjs";
import { t as resolveAgentsApiReasoningEffort } from "./agentsapi-reasoning-Dd6djlL3.mjs";
import { t as createAgentsApiSession } from "./agentsapi-session-CdLtzhKh.mjs";
import { t as buildAgentsApiToolSurface } from "./agentsapi-tools-DkxQc2M9.mjs";
//#region extensions/agentsapi/agentsapi-attempt.ts
async function runAgentsApiAttempt(params, binding, bind, assertOwnerCurrent, assertHarnessCurrent, target, readPluginConfig, promptHistories, prepareNativeCleanup, onTerminalSessionFailure) {
	const startedAtMs = Date.now();
	const startedAtMonotonicMs = performance.now();
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
	const assertCurrent = bindAgentsApiTranscriptAuthority(assertOwnerCurrent, controller.signal);
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
		startedAtMonotonicMs,
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
	const hooks = createAgentsApiAttemptHooks(params, target.agentId, startedAtMs);
	let native;
	let remoteSessionId = binding?.sessionId;
	const logFailure = (message, error) => log.warn(message, {
		error: formatErrorMessage(error),
		runId: params.runId,
		sessionId: params.sessionId,
		nativeSessionId: remoteSessionId
	});
	let activeBinding = binding;
	const saveBinding = async (next) => {
		await bind(next);
		activeBinding = next;
		prepareNativeCleanup?.(next, params.resolvedApiKey);
	};
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
		if (binding) prepareNativeCleanup?.(binding, params.resolvedApiKey);
		const pluginConfig = agentsApiConfigSchema.parse(readPluginConfig() ?? {});
		const { webSearchEnabled, nativeTools } = resolveAgentsApiNativeToolPolicy(params, pluginConfig);
		const environment = resolveAgentsApiEnvironment(pluginConfig, params.workspaceDir);
		if (binding && binding.executorControllerPluginId !== (environment.type === "self_hosted" ? pluginConfig.executorController : void 0)) throw new Error("Agents API executor controller changed; reset the OpenClaw session before continuing");
		const controllerPluginId = pluginConfig.executorController;
		const executorController = environment.type === "self_hosted" && controllerPluginId ? resolveAgentExecutorController(controllerPluginId) : void 0;
		if (environment.type === "self_hosted" && executorController) environment.workspace_directory = executorController.workspaceDirectory;
		const surface = pluginConfig.forwarding.gatewayTools ? await buildAgentsApiToolSurface(runParams, controller.signal, assertCurrent, (cleanup) => toolCleanups.push(cleanup)) : void 0;
		toolSurface = surface;
		const declarations = surface?.declarations ?? [];
		const mcpTools = pluginConfig.forwarding.mcpServers ? await buildAgentsApiMcpTools(params) : [];
		assertCurrent();
		const fingerprint = requireAgentsApiSessionFingerprint({
			existingFingerprint: binding?.configFingerprint,
			model: params.model.id,
			environment,
			mcpTools,
			webSearchEnabled,
			forwarding: pluginConfig.forwarding
		});
		const inputMedia = environment.type === "openai_hosted" && params.hostCapabilities.resolveInputAttachmentMedia ? await params.hostCapabilities.resolveInputAttachmentMedia() : params.media;
		assertCurrent();
		const inputs = environment.type === "openai_hosted" ? await prepareInputs(inputMedia, params.workspaceDir, assertCurrent, controller.signal) : await prepareSelfHostedInputs(params, assertCurrent, controller.signal);
		const client = new AgentsApiClient(params.resolvedApiKey, assertOwnerCurrent);
		const reasoningEffort = resolveAgentsApiReasoningEffort(params);
		const creatingSession = !remoteSessionId;
		const instructions = creatingSession ? await buildAgentsApiInstructions(params, declarations, environment) : "";
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
			ctx: hooks.hookContext,
			bootstrapContextRunKind: params.bootstrapContextRunKind,
			toolAuthority: {
				fingerprint: params.toolAuthorityFingerprint,
				activeToolNames: () => declarations.map((tool) => tool.name),
				assertActive: assertCurrent
			}
		});
		assertCurrent();
		if (!remoteSessionId) {
			remoteSessionId = await client.create(controller.signal, promptBuild.developerInstructions, params.model.id, {
				nativeTools,
				functions: declarations,
				mcpTools,
				files: inputs.files,
				environment,
				reasoning: {
					effort: reasoningEffort,
					...params.reasoningLevel && params.reasoningLevel !== "off" ? { summary: "auto" } : {}
				}
			});
			assertCurrent();
			await saveBinding({
				sessionId: remoteSessionId,
				configFingerprint: fingerprint,
				...executorController ? { executorControllerPluginId: controllerPluginId } : {}
			});
		} else await client.setReasoningEffort(remoteSessionId, reasoningEffort, controller.signal);
		assertCurrent();
		let connectEnvironment;
		if (environment.type === "self_hosted" && executorController) {
			const workspaceDirectory = environment.workspace_directory;
			if (!activeBinding) throw new Error("Agents API self-hosted session is missing its saved binding");
			connectEnvironment = async (environmentId) => {
				const currentBinding = activeBinding;
				if (!currentBinding) throw new Error("Agents API self-hosted session is missing its saved binding");
				await ensureAgentsApiEnvironment({
					controller: executorController,
					client,
					binding: currentBinding,
					bind: saveBinding,
					sessionKey: target.sessionKey,
					agentId: target.agentId,
					workspaceDirectory,
					environmentId,
					signal: controller.signal,
					assertCurrent
				});
			};
		}
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
			onUsageError: (error) => logFailure("Agents API token accounting unavailable", error),
			onTranscriptOrderingGap: () => projection.reportTranscriptOrderingGap(),
			onReconcileHistory: (entries) => recordAgentsApiNativeHistory(runParams, remoteSessionId, entries, assertProjectionCurrent),
			connectEnvironment,
			onSessionFailed: async () => {
				if (activeBinding) await onTerminalSessionFailure?.(activeBinding);
			},
			executeFunction: async (call) => {
				assertCurrent();
				if (!surface) throw new Error(`Agents API Gateway tool forwarding is disabled; refusing remote function call: ${call.name}`);
				startedToolCount++;
				await emitEvent({
					stream: "tool",
					data: {
						phase: "start",
						name: call.name,
						toolCallId: call.call_id,
						args: asOptionalRecord(call.arguments)
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
		const turnInput = await buildAgentsApiTurnInput(params, declarations, promptBuild.prompt, inputs.mappingText, environment.type, assertCurrent, inputs.feedbackText);
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
		if (terminal.kind === "failed") logFailure("Agents API session failed", error);
	} finally {
		beginSettlement();
		const cleanupMs = Math.max(0, Math.min(3e4, (settlementDeadlineAtMs ?? Date.now() + 3e4) - Date.now()));
		const cleanupSignal = cleanupMs > 0 ? AbortSignal.timeout(cleanupMs) : AbortSignal.abort(/* @__PURE__ */ new Error("Agents API settlement timed out"));
		try {
			await native?.close();
		} catch (error) {
			logFailure("Agents API native cleanup failed", error);
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
			logFailure("Agents API usage recording failed", error);
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
					logFailure("Agents API terminal history reconciliation failed", error);
				} finally {
					finalizingProjection = false;
					finalizingProjectionSignal = void 0;
				}
			}
		}
		try {
			await racePromiseWithAbortSignal(projectionSettlement.drain(), cleanupSignal);
		} catch (error) {
			logFailure("Agents API projection settlement failed", error);
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
			logFailure("Agents API tool cleanup failed", error);
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
	await hooks.complete(result);
	return result;
}
//#endregion
export { runAgentsApiAttempt as t };
