import { t as bindGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { a as isRuntimeToolAllowed } from "./tool-policy-match-Bv2XOvEF.mjs";
import { n as findModelInCatalog, r as modelSupportsInput } from "./model-catalog-lookup-C3iQmurZ.mjs";
import { u as normalizeVerboseLevel } from "./thinking.shared-BKzBCWpI.mjs";
import { i as logWarn } from "./logger-BHMMVs5C.mjs";
import { _ as registerAgentRunContext } from "./agent-run-registry-DO6Dg2r0.mjs";
import { s as isCliProvider } from "./model-selection-CaFyCMqp.mjs";
import { i as resolveThinkingSelectionCore, n as resolveConfiguredThinkingDefaultCore } from "./model-thinking-default-BQDdsH3k.mjs";
import { t as AgentHarnessPreflightError } from "./errors-Bd6GQRkh.mjs";
import { i as resolveCliBackendConfig } from "./cli-backends-SxX34tmf.mjs";
import { s as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-CJA2j26Y.mjs";
import { i as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-DmCrQjUt.mjs";
import { o as resolveEffectiveAgentRuntime, r as needsThinkHydration } from "./thinking-runtime-Dvszh-e-.mjs";
import { s as resolveCronScheduledToolPolicy } from "./scheduled-tool-policy-pqnwO5x1.mjs";
import { i as resolveCronAuthenticatedChannelRequester } from "./tools-allow-provenance-CBVsstVi.mjs";
import { a as createOperationalRunInstanceRef, c as prepareAgentRunAdmission } from "./admitted-run-context-BNasoszr.mjs";
import { a as withPostAdmissionExecutionOwnerBinding } from "./execution-owner-binding-C2u1SaeA.mjs";
import { i as hasNewGeneratedMediaTaskForSessionKey, r as getGeneratedMediaTaskIdsForSessionKey } from "./task-status-access-DAiFRv97.mjs";
import { t as resolveCronJobConfigRevision } from "./config-revision-DtL_Z8FS.mjs";
import { a as captureCronJobMessageSourceAuthority, i as captureCronJobMessageActionAuthority } from "./active-jobs-BdNx3YyC.mjs";
import { r as resolveGroupToolPolicy } from "./agent-tools.policy-CIWGcFBI.mjs";
import { i as LiveSessionModelSwitchError } from "./model-fallback-runner-BUzxeWPx.mjs";
import { n as assertCliSessionBindingResultCommitAllowed, t as applyCliSessionBindingResult } from "./cli-session-Cg8Oaz0V.mjs";
import { n as mintMessageActionTurnCapability, s as revokeMessageActionTurnCapability } from "./message-action-turn-capability-CfssNzR2.mjs";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-BzSlbw21.mjs";
import { i as buildGenericCliContextEngineHostSupport } from "./host-compat-xESS3bi6.mjs";
import { t as createUserTurnTranscriptRecorder } from "./user-turn-transcript-Cqq1jlt5.mjs";
import { t as resolveFastModeState } from "./fast-mode-D3LS63Ki.mjs";
import { r as resolveCronAgentLane } from "./lanes-CI0_P-yC.mjs";
import { n as resolveScheduledToolPolicyContext, t as resolveScheduledToolCallerContext } from "./scheduled-tool-policy-DRmktKAO.mjs";
import { x as createDeferredEmbeddedRunLifecycleManager } from "./builtin-openclaw-CzzhJmXX.mjs";
import { s as resolveBootstrapWarningSignaturesSeen } from "./bootstrap-budget-DZWwd3xP.mjs";
import { o as withLocalSessionPlacementTurnSettlement } from "./session-placement-admission-Gs1bL6J1.mjs";
import { n as resolveAgentLifecycleTerminalMetadata } from "./agent-lifecycle-terminal-BnQVcmxj.mjs";
import { n as resolveCliRuntimeToolsAllow } from "./tool-policy-B3nZbUgX.mjs";
import { n as resolveCliExecutionAuthProfileId, t as cliBackendAcceptsAuthProfileForwarding } from "./cli-execution-auth-DMFSGoax.mjs";
import { t as runEmbeddedAgentEntry } from "./run-entry-DT0ooTWY.mjs";
import { n as registerCronRunExecSource } from "./cron-run-exec-source-BYare2tS.mjs";
import { n as rootedAgentRunParams } from "./rooted-run-params-BC-utLzW.mjs";
import { r as settleCliSessionResult } from "./cli-session-store-CB_iDG7n.mjs";
import { n as assertCronExecutionRootRuntime } from "./execution-root-runtime-Cn0UlMtn.mjs";
import { a as appendCronDeliveryInstruction, d as resolveCronChannelOutputPolicy, f as resolveCurrentChannelTarget, i as runCliAgent, o as buildCronDeliveryTargetRuntimeContext, r as getCliSessionBinding, t as resolveCronFallbacksOverride } from "./run-fallback-policy-D2P9NH5d.mjs";
import { d as syncCronSessionLiveSelection, l as setCronSessionAgentHarnessId, m as resolveCronPayloadOutcome, u as setCronSessionRuntimeModel } from "./run-session-state-BnckQvmH.mjs";
import { n as isLikelyInterimCronMessage } from "./subagent-followup-hints-BWIIEDjt.mjs";
import { createHash } from "node:crypto";
//#region src/cron/isolated-agent/run-admission.ts
function assertCronRuntimeAuthorityCandidate(params) {
	const authority = params.authority;
	if (!authority) return;
	if (params.candidateRuntime !== authority.runtimeId || params.cliExecution) throw new AgentHarnessPreflightError(`This automation carries ${authority.namespace} authority captured for the ${authority.runtimeId} runtime, but the selected execution runtime is ${params.candidateRuntime}. Restore that runtime and auth profile, or explicitly replace the automation's toolsAllow cap from an authenticated creator turn.`);
}
/** Owns one prompt admission and its private message grant through settlement. */
function prepareCronPromptRunAdmission(params) {
	const { runId, scheduledToolPolicy } = params;
	const operationalRunInstance = createOperationalRunInstanceRef(runId);
	const resolveGatewayContext = getPluginRuntimeGatewayRequestScope()?.resolveGatewayContext;
	const basePreparedRunAdmission = prepareAgentRunAdmission({
		operationalRunInstance,
		admissionSource: params.admissionSource,
		cfg: params.cfg,
		facts: {
			runId,
			agentId: params.agentId,
			ingress: params.executionIdentity?.ingress ?? {
				kind: "schedule",
				boundary: "cron.isolated-agent",
				state: "present"
			},
			...params.executionIdentity?.invoker ? { invoker: params.executionIdentity.invoker } : {}
		},
		onAdmitted: (admitted) => bindGatewayContextResolver(admitted, resolveGatewayContext)
	});
	const preparedRunAdmission = params.executionIdentity?.onPostAdmission ? withPostAdmissionExecutionOwnerBinding(basePreparedRunAdmission, params.executionIdentity.onPostAdmission) : basePreparedRunAdmission;
	const scheduledMessageAuthority = scheduledToolPolicy && isRuntimeToolAllowed("message", params.toolsAllow) ? captureCronJobMessageActionAuthority({
		jobId: params.jobId,
		operationalRunInstance
	}) : void 0;
	const scheduledMessageSourceAuthority = scheduledMessageAuthority ? captureCronJobMessageSourceAuthority({
		jobId: params.jobId,
		operationalRunInstance
	}) : void 0;
	const messageActionTurnCapability = scheduledMessageAuthority && scheduledToolPolicy ? mintMessageActionTurnCapability({
		agentId: params.agentId,
		runId,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		requesterAccountId: scheduledToolPolicy.mode === "account" ? scheduledToolPolicy.ownerAccountId : void 0,
		scheduled: {
			policy: scheduledToolPolicy,
			assertCurrent: scheduledMessageAuthority,
			...scheduledMessageSourceAuthority ? { assertSourceCurrent: scheduledMessageSourceAuthority } : {},
			...params.channelRequester ? { channelRequester: params.channelRequester } : {}
		},
		expiresWithRun: true
	}) : void 0;
	return {
		preparedRunAdmission,
		messageActionTurnCapability,
		close: () => {
			revokeMessageActionTurnCapability(messageActionTurnCapability);
			preparedRunAdmission.close();
		}
	};
}
//#endregion
//#region src/cron/isolated-agent/run-candidate-runtime.ts
/** Shares candidate execution policy between harness preparation and dispatch. */
function createCronCandidateExecutionResolver(params) {
	return (provider, model, sessionRuntimeOverride) => {
		const executionProvider = sessionRuntimeOverride ? isCliProvider(sessionRuntimeOverride, params.cfgWithAgentDefaults) ? sessionRuntimeOverride : provider : resolveCliRuntimeExecutionProvider({
			provider,
			cfg: params.cfgWithAgentDefaults,
			agentId: params.agentId,
			modelId: model
		}) ?? provider;
		const runtime = sessionRuntimeOverride ?? resolveEffectiveAgentRuntime({
			cfg: params.cfgWithAgentDefaults,
			provider,
			modelId: model,
			agentId: params.agentId,
			sessionKey: params.runSessionKey,
			sessionEntry: params.cronSession.sessionEntry
		});
		return {
			sessionRuntimeOverride,
			executionProvider,
			cliExecution: isCliProvider(executionProvider, params.cfgWithAgentDefaults),
			runtime
		};
	};
}
//#endregion
//#region src/cron/isolated-agent/run-executor.ts
/** Executes isolated cron prompts with model fallbacks and interim-ack retries. */
const cronEmbeddedRuntimeLoader = createLazyImportLoader(() => import("./run-embedded.runtime.js"));
const cronSubagentRegistryRuntimeLoader = createLazyImportLoader(() => import("./run-subagent-registry.runtime.js"));
function hasCliSessionReuseMetadata(binding) {
	return Object.entries(binding).some(([key, value]) => key !== "sessionId" && value !== void 0);
}
const COMMAND_STYLE_CRON_PREFIX = /^(?:(?:[A-Z_][A-Z0-9_]*=\S+\s+)+)?(?:cd\s+\S+|(?:\.{1,2}|~)?\/\S+|[A-Za-z]:[\\/]\S+|(?:bash|bun|cargo|deno|docker|gh|git|go|make|node|npm|npx|pnpm|python|python3|ruby|sh|tsx|uv|zsh)\b)/u;
function resolveIsolatedCronPromptCacheKey(params) {
	if (params.job.sessionTarget !== "isolated") return;
	const material = JSON.stringify({
		version: 1,
		kind: "isolated-cron",
		jobId: params.job.id,
		agentId: params.agentId,
		agentSessionKey: params.agentSessionKey,
		provider: params.provider,
		model: params.model
	});
	return `openclaw-cron-${createHash("sha256").update(material).digest("hex").slice(0, 32)}`;
}
/** Detects single-line cron prompts that look like shell commands or command invocations. */
function isCommandStyleCronMessage(message) {
	return !message.trim().includes("\n") && COMMAND_STYLE_CRON_PREFIX.test(message.trim());
}
/** Creates the model-fallback executor for one isolated cron prompt run. */
function createCronPromptExecutor(params) {
	const sessionFile = params.runSessionKey;
	const cronFallbacksOverride = params.modelFallbacksOverride ?? resolveCronFallbacksOverride({
		cfg: params.cfg,
		job: params.job,
		agentId: params.agentId,
		useSubagentFallbacks: params.useSubagentFallbacks,
		inheritDefaultFallbacksForAgentStringModel: params.inheritDefaultFallbacksForAgentStringModel
	});
	const fastModeStartedAtMs = Date.now();
	const fastModeAutoProgressState = {
		offAnnounced: false,
		resetAnnounced: false
	};
	let bootstrapPromptWarningSignaturesSeen = resolveBootstrapWarningSignaturesSeen(params.cronSession.sessionEntry.systemPromptReport);
	const bootstrapContextMode = params.agentPayload?.lightContext ?? isCommandStyleCronMessage(params.agentPayload?.message ?? "") ? "lightweight" : void 0;
	const scheduledToolPolicy = resolveScheduledToolPolicyContext({
		toolsAllow: params.agentPayload?.toolsAllow,
		scheduledToolPolicy: resolveCronScheduledToolPolicy({
			toolsAllow: params.agentPayload?.toolsAllow,
			scheduledToolPolicy: params.job.scheduledToolPolicy,
			owner: params.job.owner
		}),
		callerOrigin: params.job.toolsAllowProvenance?.callerOrigin,
		execTarget: params.job.toolsAllowExecTarget
	});
	const { sourceDelivery, runId } = params;
	const sourceReplyDeliveryMode = sourceDelivery.sourceReplyDeliveryMode;
	const messageChannel = sourceDelivery.target.channel ?? params.resolvedDelivery.channel;
	if (scheduledToolPolicy?.mode === "account") {
		const callerContext = resolveScheduledToolCallerContext({ scheduledToolPolicy });
		resolveGroupToolPolicy({
			config: params.cfgWithAgentDefaults,
			sessionKey: scheduledToolPolicy.ownerSessionKey,
			messageProvider: callerContext.local ? messageChannel : callerContext.channel ?? void 0,
			accountId: scheduledToolPolicy.ownerAccountId,
			requireConfiguredAccount: true,
			senderPolicyMode: "never"
		});
	}
	const finalizePromptForResolvedTools = ({ prompt, messageToolAvailable }) => {
		const deliveryMessageToolAvailable = sourceDelivery.messageTool.enabled && messageToolAvailable;
		if (sourceReplyDeliveryMode === "message_tool_only" && !deliveryMessageToolAvailable) throw new Error("Cron source delivery requires the message tool, but the selected runtime does not expose it. Allow the message tool, choose a compatible runtime, or use automatic delivery.");
		const promptWithDeliveryGuidance = appendCronDeliveryInstruction({
			commandBody: prompt,
			deliveryRequested: params.deliveryRequested,
			messageToolEnabled: deliveryMessageToolAvailable,
			resolvedDeliveryOk: params.resolvedDelivery.ok,
			requireExplicitMessageTarget: sourceDelivery.messageTool.requireExplicitTarget
		});
		const deliveryTargetRuntimeContext = buildCronDeliveryTargetRuntimeContext({
			resolvedDeliveryOk: params.resolvedDelivery.ok,
			messageToolAvailable: deliveryMessageToolAvailable,
			resolvedDelivery: params.resolvedDelivery,
			sourceDelivery
		});
		return deliveryTargetRuntimeContext ? `${promptWithDeliveryGuidance}\n\n${deliveryTargetRuntimeContext}`.trim() : promptWithDeliveryGuidance;
	};
	let pendingUserTurn;
	let attemptMediaTaskIds = /* @__PURE__ */ new Set();
	let thinkingCatalog = params.thinkingCatalog;
	let hydratedThinkingSelection;
	const currentAttemptCommittedMedia = () => hasNewGeneratedMediaTaskForSessionKey(params.runSessionKey, attemptMediaTaskIds);
	const resolveCandidateExecution = createCronCandidateExecutionResolver(params);
	return async (promptText, runStartedAt) => {
		params.lifecycle.beginAttempt();
		const sessionTarget = {
			agentId: params.agentId,
			sessionId: params.cronSession.sessionEntry.sessionId,
			sessionKey: params.runSessionKey,
			storePath: params.cronSession.storePath
		};
		const userTurnTranscriptRecorder = pendingUserTurn?.promptText === promptText ? pendingUserTurn.recorder : createUserTurnTranscriptRecorder({
			input: {
				text: promptText,
				provenance: params.inputProvenance
			},
			target: {
				...sessionTarget,
				sessionEntry: params.cronSession.sessionEntry,
				cwd: params.workspaceDir,
				config: params.cfgWithAgentDefaults
			},
			beforeMessageWrite: runAgentHarnessBeforeMessageWriteHook,
			errorContext: "cron user turn transcript"
		});
		pendingUserTurn = {
			promptText,
			recorder: userTurnTranscriptRecorder
		};
		const { preparedRunAdmission, messageActionTurnCapability, close: closePromptAdmission } = prepareCronPromptRunAdmission({
			admissionSource: params.admissionSource,
			cfg: params.cfgWithAgentDefaults,
			agentId: params.agentId,
			runId,
			sessionId: params.cronSession.sessionEntry.sessionId,
			sessionKey: params.runSessionKey,
			jobId: params.job.id,
			channelRequester: resolveCronAuthenticatedChannelRequester(params.job),
			toolsAllow: params.agentPayload?.toolsAllow,
			scheduledToolPolicy,
			executionIdentity: params.executionIdentity
		});
		const onExecutionStarted = async (info) => {
			params.onExecutionStarted?.(info);
			await params.executionIdentity?.onExecutionStarted?.();
		};
		let unregisterCronRunExecSource = () => {};
		try {
			unregisterCronRunExecSource = registerCronRunExecSource(runId, {
				agentId: params.agentId,
				jobId: params.job.id,
				jobConfigRevision: resolveCronJobConfigRevision(params.job),
				jobName: params.job.name
			});
		} catch {}
		const fallbackResult = await runEmbeddedAgentEntry({
			preparedRunAdmission,
			selection: {
				cfg: params.cfgWithAgentDefaults,
				provider: params.liveSelection.provider,
				model: params.liveSelection.model,
				requestedRouteResolution: "resolved",
				agentDir: params.agentDir,
				userLockedAuthProfileId: params.liveSelection.authProfileIdSource === "user" ? params.liveSelection.authProfileId : void 0,
				fallbacksOverride: cronFallbacksOverride
			},
			identity: {
				runId,
				sessionId: params.cronSession.sessionEntry.sessionId,
				lane: resolveCronAgentLane(params.lane),
				agentId: params.agentId,
				sessionKey: params.runSessionKey
			},
			harness: {
				workspaceDir: params.executionRoot ?? params.workspaceDir,
				sessionKey: params.runSessionKey,
				preparation: { kind: "direct" },
				resolveRuntimeOverride: (provider) => resolveSessionRuntimeOverrideForProvider({
					provider,
					entry: params.cronSession.sessionEntry,
					cfg: params.cfgWithAgentDefaults
				}),
				resolveContextEngineHost: (provider, model, runtimeOverride) => {
					const { executionProvider, cliExecution } = resolveCandidateExecution(provider, model, runtimeOverride);
					if (!cliExecution) return;
					const backend = resolveCliBackendConfig(executionProvider, params.cfgWithAgentDefaults, { agentId: params.agentId });
					return buildGenericCliContextEngineHostSupport({
						backendId: backend?.id ?? executionProvider,
						...backend?.contextEngineHostCapabilities ? { capabilities: backend.contextEngineHostCapabilities } : {}
					});
				}
			},
			behavior: {
				kind: "command-rpc",
				hasCommittedSideEffect: currentAttemptCommittedMedia
			},
			sessionOverride: { kind: "preserve" },
			abortSignal: params.abortSignal,
			runCandidate: async (providerOverride, modelOverride, runOptions) => {
				params.lifecycle.beginAttempt();
				const notifyExecutionStarted = (info) => onExecutionStarted({
					...info,
					...runOptions.isFallbackRetry ? { isFallback: true } : {},
					provider: providerOverride,
					model: modelOverride
				});
				const notifyExecutionPhase = (info) => params.onExecutionPhase?.({
					...info,
					provider: providerOverride,
					model: modelOverride
				});
				attemptMediaTaskIds = getGeneratedMediaTaskIdsForSessionKey(params.runSessionKey);
				if (params.abortSignal?.aborted) throw new Error(params.abortReason());
				const { sessionRuntimeOverride, executionProvider, cliExecution, runtime: candidateRuntime } = resolveCandidateExecution(providerOverride, modelOverride, runOptions.agentHarnessRuntimeOverride);
				const candidateConfiguredThinkLevel = params.immutableThinkLevel ?? resolveConfiguredThinkingDefaultCore({
					cfg: params.cfgWithAgentDefaults,
					agentId: params.agentId,
					provider: providerOverride,
					model: modelOverride
				});
				const thinkingSelectionKey = `${providerOverride}/${modelOverride}\0${candidateRuntime}`;
				if ((candidateConfiguredThinkLevel !== "off" || candidateRuntime !== "openclaw") && hydratedThinkingSelection !== thinkingSelectionKey && needsThinkHydration(thinkingCatalog, providerOverride, modelOverride, candidateRuntime)) {
					hydratedThinkingSelection = thinkingSelectionKey;
					const runtimeCatalog = await params.loadThinkingCatalog(providerOverride, modelOverride, candidateRuntime);
					if (runtimeCatalog.length > 0) thinkingCatalog = runtimeCatalog;
				}
				const { level: candidateThinkLevel } = resolveThinkingSelectionCore({
					cfg: params.cfgWithAgentDefaults,
					agentId: params.agentId,
					provider: providerOverride,
					model: modelOverride,
					level: candidateConfiguredThinkLevel,
					catalog: thinkingCatalog,
					agentRuntime: candidateRuntime
				});
				const rootedExecution = params.executionRoot ? { root: params.executionRoot } : void 0;
				assertCronExecutionRootRuntime(params.executionRoot, candidateRuntime, cliExecution && Boolean(rootedExecution));
				assertCronRuntimeAuthorityCandidate({
					authority: params.job.runtimeAuthority,
					candidateRuntime,
					cliExecution
				});
				setCronSessionRuntimeModel({
					entry: params.cronSession.sessionEntry,
					provider: providerOverride,
					model: modelOverride
				});
				setCronSessionAgentHarnessId({
					entry: params.cronSession.sessionEntry,
					agentHarnessId: candidateRuntime
				});
				await params.persistSessionEntry();
				await params.persistRunContinuationSession?.();
				await params.setRunContinuationCliExecutionProvider?.(cliExecution ? executionProvider : void 0);
				const bootstrapPromptWarningSignature = bootstrapPromptWarningSignaturesSeen.at(-1);
				const fastModeState = resolveFastModeState({
					cfg: params.cfgWithAgentDefaults,
					provider: providerOverride,
					model: modelOverride,
					agentId: params.agentId,
					sessionEntry: params.cronSession.sessionEntry
				});
				const buildCommonRunParams = () => ({
					preparedRunAdmission,
					sessionId: params.cronSession.sessionEntry.sessionId,
					sessionKey: params.runSessionKey,
					sessionTarget,
					agentId: params.agentId,
					trigger: "cron",
					jobId: params.job.id,
					messageActionTurnCapability,
					config: params.cfgWithAgentDefaults,
					prompt: promptText,
					finalizePromptForResolvedTools,
					model: modelOverride,
					thinkLevel: candidateThinkLevel,
					timeoutMs: params.timeoutMs,
					runId,
					lane: resolveCronAgentLane(params.lane),
					terminalReplyExpectation: "optional",
					skillsSnapshot: params.skillsSnapshot,
					messageChannel,
					agentAccountId: params.resolvedDelivery.accountId,
					sourceReplyDeliveryMode,
					requireExplicitMessageTarget: sourceDelivery.messageTool.requireExplicitTarget,
					scheduledToolPolicy,
					onExecutionStarted: notifyExecutionStarted,
					onExecutionPhase: notifyExecutionPhase,
					bootstrapContextMode,
					bootstrapContextRunKind: "cron",
					bootstrapPromptWarningSignaturesSeen,
					bootstrapPromptWarningSignature,
					fastMode: fastModeState.mode,
					fastModeAutoOnSeconds: fastModeState.fastAutoOnSeconds,
					fastModeStartedAtMs,
					fastModeAutoProgressState,
					isFinalFallbackAttempt: runOptions.isFinalFallbackAttempt,
					contextEngineLogicalTurnLease: runOptions.contextEngineLogicalTurnLease,
					onContextEngineTurnCandidate: runOptions.onContextEngineTurnCandidate,
					userTurnTranscriptRecorder,
					suppressNextUserMessagePersistence: userTurnTranscriptRecorder.hasPersisted() || userTurnTranscriptRecorder.isBlocked()
				});
				if (cliExecution) {
					const allowCliAuthProfileForwarding = cliBackendAcceptsAuthProfileForwarding({
						provider: executionProvider,
						config: params.cfgWithAgentDefaults,
						agentId: params.agentId
					});
					const deferredLifecycle = createDeferredEmbeddedRunLifecycleManager({
						runId,
						agentId: params.agentId,
						sessionId: params.cronSession.sessionEntry.sessionId,
						sessionKey: params.runSessionKey,
						sessionFile,
						abortSignal: params.abortSignal
					});
					try {
						const cliAbortSignal = deferredLifecycle.signal;
						const result = await withLocalSessionPlacementTurnSettlement({
							sessionId: params.cronSession.sessionEntry.sessionId,
							sessionKey: params.runSessionKey,
							agentId: params.agentId,
							runId
						}, async (assertSettlementCurrent) => {
							const diagnosticOwner = deferredLifecycle.handoffToCli();
							const cliSessionBinding = params.cronSession.isNewSession ? void 0 : await getCliSessionBinding(params.cronSession.sessionEntry, executionProvider);
							const authProfileId = allowCliAuthProfileForwarding ? resolveCliExecutionAuthProfileId({
								cliExecutionProvider: executionProvider,
								authProfileProvider: providerOverride,
								config: params.cfgWithAgentDefaults,
								agentDir: params.agentDir,
								sessionBinding: cliSessionBinding,
								selected: params.liveSelection.authProfileId ? {
									authProfileId: params.liveSelection.authProfileId,
									authProfileIdSource: params.liveSelection.authProfileIdSource === "user" ? "user" : "auto"
								} : void 0
							}) : void 0;
							const guardedCliSessionBinding = cliSessionBinding && hasCliSessionReuseMetadata(cliSessionBinding) ? cliSessionBinding : void 0;
							const candidateResult = await runCliAgent({
								...buildCommonRunParams(),
								diagnosticOwner,
								sessionEntry: params.cronSession.sessionEntry,
								contextWindow: params.cronSession.sessionEntry.contextWindow,
								cleanupCliLiveSessionOnRunEnd: params.usesDetachedRunSession,
								sessionFile,
								storePath: params.cronSession.storePath,
								persistAssistantTranscript: true,
								workspaceDir: params.executionRoot ?? params.workspaceDir,
								bootstrapWorkspaceDir: params.workspaceDir,
								rootedExecution,
								modelProvider: providerOverride,
								requesterModel: {
									provider: providerOverride,
									model: modelOverride
								},
								modelHasVision: modelSupportsInput(findModelInCatalog(thinkingCatalog ?? [], providerOverride, modelOverride), "image"),
								provider: executionProvider,
								authProfileId,
								cliSessionId: cliSessionBinding?.sessionId,
								cliSessionBinding: guardedCliSessionBinding,
								cliSessionBindingFacts: {
									sourceReplyDeliveryMode,
									requireExplicitMessageTarget: sourceDelivery.messageTool.requireExplicitTarget
								},
								toolsAllow: resolveCliRuntimeToolsAllow(params.agentPayload?.toolsAllow, params.agentPayload?.toolsAllowIsDefault),
								abortSignal: cliAbortSignal
							});
							const classification = runOptions.classifyResult(candidateResult);
							const settledEntry = { ...params.cronSession.sessionEntry };
							if ((candidateResult.meta.agentMeta?.clearCliSessionBinding === true || !cliAbortSignal.aborted && !classification) && applyCliSessionBindingResult(settledEntry, executionProvider, candidateResult.meta.agentMeta)) {
								const assertCommitAllowed = () => assertCliSessionBindingResultCommitAllowed(candidateResult.meta.agentMeta, assertSettlementCurrent, cliAbortSignal);
								return await settleCliSessionResult(candidateResult, async () => {
									await params.persistSessionEntry(assertCommitAllowed, settledEntry);
									await params.persistRunContinuationSession?.(assertCommitAllowed);
								});
							}
							return candidateResult;
						}, {
							preparedRunAdmission,
							abortSignal: cliAbortSignal,
							trigger: "cron",
							isFinalFallbackAttempt: runOptions.isFinalFallbackAttempt
						});
						bootstrapPromptWarningSignaturesSeen = resolveBootstrapWarningSignaturesSeen(result.meta?.systemPromptReport);
						return result;
					} catch (error) {
						deferredLifecycle.signal.throwIfAborted();
						throw error;
					} finally {
						await deferredLifecycle.complete();
					}
				}
				const { runEmbeddedAgent } = await cronEmbeddedRuntimeLoader.load();
				const promptCacheKey = resolveIsolatedCronPromptCacheKey({
					job: params.job,
					agentId: params.agentId,
					agentSessionKey: params.agentSessionKey,
					provider: providerOverride,
					model: modelOverride
				});
				const currentChannelId = await resolveCurrentChannelTarget({
					channel: messageChannel,
					to: params.resolvedDelivery.to,
					threadId: params.resolvedDelivery.threadId
				});
				const result = await runEmbeddedAgent({
					...buildCommonRunParams(),
					promptCacheKey,
					cleanupBundleMcpOnRunEnd: params.usesDetachedRunSession,
					allowGatewaySubagentBinding: true,
					messageTo: params.resolvedDelivery.to,
					messageThreadId: params.resolvedDelivery.threadId,
					currentChannelId,
					agentDir: params.agentDir,
					...rootedAgentRunParams(params.workspaceDir, params.executionRoot),
					provider: providerOverride,
					agentHarnessRuntimeOverride: sessionRuntimeOverride,
					requestedRouteResolution: "resolved",
					modelFallbacksOverride: cronFallbacksOverride,
					authProfileId: params.liveSelection.authProfileId,
					authProfileIdSource: params.liveSelection.authProfileId ? params.liveSelection.authProfileIdSource : void 0,
					authProfileFailurePolicy: runOptions.authProfileFailurePolicy ?? "local_transient",
					verboseLevel: params.resolvedVerboseLevel,
					runTimeoutOverrideMs: params.runTimeoutOverrideMs,
					toolsAllow: params.agentPayload?.toolsAllow,
					scheduledRuntimeAuthority: params.job.runtimeAuthority,
					scheduledRuntimeAuthorityRecoveryRequired: params.job.runtimeAuthorityRecoveryRequired === true,
					execSession: params.cronSession.sessionEntry,
					execOverrides: params.suppressExecNotifyOnExit ? {
						notifyOnExit: false,
						notifyOnExitEmptySuccess: false
					} : void 0,
					deferTerminalLifecycle: true,
					onAgentEvent: params.lifecycle.note,
					disableMessageTool: !sourceDelivery.messageTool.enabled,
					forceMessageTool: sourceDelivery.messageTool.force,
					allowTransientCooldownProbe: runOptions.allowTransientCooldownProbe,
					assistantErrorTranscript: runOptions.assistantErrorTranscript,
					abortSignal: params.abortSignal,
					onLaneWait: params.onLaneWait
				});
				bootstrapPromptWarningSignaturesSeen = resolveBootstrapWarningSignaturesSeen(result.meta?.systemPromptReport);
				return result;
			}
		}).catch((error) => {
			params.lifecycle.capture("error", error);
			throw error;
		}).finally(() => {
			unregisterCronRunExecSource();
			closePromptAdmission();
		});
		const executionError = params.lifecycle.getDeferredError() ?? (fallbackResult.result.meta.error || fallbackResult.outcome === "exhausted" ? "Agent run failed" : void 0);
		if (executionError) params.lifecycle.capture("error", executionError, resolveAgentLifecycleTerminalMetadata(fallbackResult.result.meta));
		else params.lifecycle.capture("end", fallbackResult.result);
		params.liveSelection.provider = fallbackResult.provider;
		params.liveSelection.model = fallbackResult.model;
		setCronSessionRuntimeModel({
			entry: params.cronSession.sessionEntry,
			provider: fallbackResult.provider,
			model: fallbackResult.model
		});
		const completed = {
			runResult: fallbackResult.result,
			fallbackProvider: fallbackResult.provider,
			fallbackModel: fallbackResult.model,
			runStartedAt,
			runEndedAt: Date.now()
		};
		params.onPromptCompleted(completed);
		await params.persistRunContinuationSession?.();
		pendingUserTurn = void 0;
		return completed;
	};
}
/** Executes an isolated cron prompt, including live model-switch and interim-ack retries. */
async function executeCronRun(params) {
	const resolvedVerboseLevel = normalizeVerboseLevel(params.cronSession.sessionEntry.verboseLevel) ?? normalizeVerboseLevel(params.agentVerboseDefault) ?? "off";
	registerAgentRunContext(params.runId, {
		sessionKey: params.runSessionKey,
		sessionId: params.cronSession.sessionEntry.sessionId,
		verboseLevel: resolvedVerboseLevel
	});
	const runStartedAt = params.runStartedAt ?? Date.now();
	const completedPromptRuns = [];
	const runPrompt = createCronPromptExecutor({
		...params,
		resolvedVerboseLevel,
		onPromptCompleted: (run) => {
			completedPromptRuns.push(run);
			params.onPromptCompleted?.(completedPromptRuns);
		}
	});
	const MAX_MODEL_SWITCH_RETRIES = 2;
	let modelSwitchRetries = 0;
	let promptMediaTaskIds = /* @__PURE__ */ new Set();
	let execution;
	while (true) try {
		promptMediaTaskIds = getGeneratedMediaTaskIdsForSessionKey(params.runSessionKey);
		execution = await runPrompt(params.commandBody, runStartedAt);
		break;
	} catch (err) {
		if (!(err instanceof LiveSessionModelSwitchError) || hasNewGeneratedMediaTaskForSessionKey(params.runSessionKey, promptMediaTaskIds)) throw err;
		modelSwitchRetries += 1;
		if (modelSwitchRetries > MAX_MODEL_SWITCH_RETRIES) {
			logWarn(`[cron:${params.job.id}] LiveSessionModelSwitchError retry limit reached (${MAX_MODEL_SWITCH_RETRIES}); aborting`);
			throw err;
		}
		params.liveSelection.provider = err.provider;
		params.liveSelection.model = err.model;
		params.liveSelection.agentRuntimeOverride = err.agentRuntimeOverride;
		params.liveSelection.authProfileId = err.authProfileId;
		params.liveSelection.authProfileIdSource = err.authProfileId ? err.authProfileIdSource : void 0;
		syncCronSessionLiveSelection({
			entry: params.cronSession.sessionEntry,
			liveSelection: params.liveSelection
		});
		try {
			await params.persistSessionEntry();
			await params.persistRunContinuationSession?.();
		} catch (persistErr) {
			logWarn(`[cron:${params.job.id}] Failed to persist model switch session entry: ${String(persistErr)}`);
		}
		continue;
	}
	const { runResult } = execution;
	if (!params.isAborted()) {
		const interimPayloads = runResult.payloads ?? [];
		const { deliveryPayloadHasStructuredContent: interimPayloadHasStructuredContent, hasFatalErrorPayload: interimHasFatalErrorPayload, outputText: interimOutputText } = resolveCronPayloadOutcome({
			payloads: interimPayloads,
			runLevelError: runResult.meta?.error,
			failureSignal: runResult.meta?.failureSignal,
			finalAssistantVisibleText: runResult.meta?.finalAssistantVisibleText,
			preferFinalAssistantVisibleText: (await resolveCronChannelOutputPolicy(params.resolvedDelivery.channel, { deliveryRequested: params.deliveryRequested })).preferFinalAssistantVisibleText
		});
		const interimText = interimOutputText?.trim() ?? "";
		const shouldRetryInterimAck = !runResult.meta?.error && !interimHasFatalErrorPayload && !runResult.didSendViaMessagingTool && !hasNewGeneratedMediaTaskForSessionKey(params.runSessionKey, promptMediaTaskIds) && !interimPayloadHasStructuredContent && !interimPayloads.some((payload) => payload?.isError === true) && isLikelyInterimCronMessage(interimText);
		let hasFreshDescendants = false;
		let hasActiveDescendants = false;
		if (shouldRetryInterimAck) {
			const { countActiveDescendantRuns, listDescendantRunsForRequester } = await cronSubagentRegistryRuntimeLoader.load();
			hasFreshDescendants = listDescendantRunsForRequester(params.runSessionKey).some((entry) => {
				const descendantStartedAt = typeof entry.execution.startedAt === "number" ? entry.execution.startedAt : entry.createdAt;
				return typeof descendantStartedAt === "number" && descendantStartedAt >= runStartedAt;
			});
			hasActiveDescendants = countActiveDescendantRuns(params.runSessionKey) > 0;
		}
		if (shouldRetryInterimAck && !hasFreshDescendants && !hasActiveDescendants) execution = await runPrompt([
			"Your previous response was only an acknowledgement and did not complete this cron task.",
			"Complete the original task now.",
			"Do not send a status update like 'on it'.",
			"Use tools when needed, including sessions_spawn for parallel subtasks, wait for spawned subagents to finish, then return only the final summary."
		].join(" "), Date.now());
	}
	return {
		...execution,
		runStartedAt,
		completedPromptRuns
	};
}
//#endregion
export { executeCronRun };
