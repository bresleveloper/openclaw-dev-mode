import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as _usingCtx } from "./usingCtx-BhiZp_rS.mjs";
import { b as registerAgentRunContext } from "./agent-run-registry-gmaPgO-n.mjs";
import { i as prepareModelRunCapabilities, n as findModelInCatalog, r as modelSupportsInput } from "./model-catalog-lookup-BJKolYfz.mjs";
import { f as normalizeVerboseLevel } from "./thinking.shared-Be8dhC75.mjs";
import { s as resolveCronScheduledToolPolicy } from "./scheduled-tool-policy-Bjq61U8o.mjs";
import { n as recordModelFallbackStop } from "./model-fallback-stop-BtVvqU7l.mjs";
import { i as resolveThinkingSelectionCore, n as resolveConfiguredThinkingDefaultCore } from "./model-thinking-default-BKqBSSHy.mjs";
import { t as isCliProvider } from "./model-selection-cli-CxV7VRIV.mjs";
import { a as resolveCliBackendConfig } from "./cli-backends-BzVT3JSM.mjs";
import { c as resolveCliRuntimeExecutionProvider } from "./model-runtime-aliases-DJRpB3Nd.mjs";
import { i as resolveSessionRuntimeOverrideForProvider } from "./session-runtime-compat-BQN27lQg.mjs";
import { o as resolveEffectiveAgentRuntime } from "./thinking-runtime-DuxsJR5q.mjs";
import { i as logWarn } from "./logger-DHVmYOKs.mjs";
import { t as resolveFastModeState } from "./fast-mode-DezNRstT.mjs";
import { n as assertCliSessionBindingResultCommitAllowed, t as applyCliSessionBindingResult } from "./cli-session-CBCjrsL6.mjs";
import { c as hasNewGeneratedMediaTaskForSessionKey, s as getGeneratedMediaTaskIdsForSessionKey } from "./media-generation-activity-CdYWMYrm.mjs";
import { i as resolveCronAuthenticatedChannelRequester } from "./tools-allow-provenance-DDhQ9uVg.mjs";
import { r as resolveGroupToolPolicy } from "./agent-tools.policy-t04F-r_I.mjs";
import { o as LiveSessionModelSwitchError } from "./model-fallback-runner-ZDIjnIyf.mjs";
import { n as runAgentHarnessBeforeMessageWriteHook } from "./hook-helpers-C0CV-oid.mjs";
import { i as buildGenericCliContextEngineHostSupport } from "./host-compat-DWLjZN89.mjs";
import { t as createUserTurnTranscriptRecorder } from "./user-turn-transcript-CtVHLnLR.mjs";
import { n as resolveScheduledToolPolicyContext, t as resolveScheduledToolCallerContext } from "./scheduled-tool-policy-BapisiIE.mjs";
import { r as resolveCronAgentLane } from "./lanes-BJoXx6GG.mjs";
import { y as createDeferredEmbeddedRunLifecycleManager } from "./builtin-openclaw-CMvbELtK.mjs";
import { o as resolveBootstrapWarningSignaturesSeen } from "./bootstrap-budget-96UImSUD.mjs";
import { s as withLocalSessionPlacementTurnSettlement } from "./session-placement-admission-DV-Z5szH.mjs";
import { n as resolveAgentLifecycleTerminalMetadata } from "./agent-lifecycle-terminal-SUD9mca8.mjs";
import { n as resolveCliRuntimeToolsAllow } from "./tool-policy-tVbJkh67.mjs";
import { n as resolveCliExecutionAuthProfileId, t as cliBackendAcceptsAuthProfileForwarding } from "./cli-execution-auth-Db8iWS1_.mjs";
import { t as resolveCronJobConfigRevision } from "./config-revision-lawlsaMs.mjs";
import { a as runCliAgent, i as getCliSessionBinding, n as resolveCronFallbacksOverride, o as resolveCronChannelOutputPolicy, t as prepareCronModelResolveInput } from "./run-fallback-policy-ZsbPmtwE.mjs";
import "./run.runtime.js";
import { t as runEmbeddedAgentEntry } from "./run-entry-Bh1g2wCR.mjs";
import { n as registerCronRunExecSource } from "./cron-run-exec-source-BYare2tS.mjs";
import { o as settleCliSessionResult } from "./cli-session-store-BqSinGQ9.mjs";
import { i as prepareCronRunInference, n as assertCronRuntimeAuthorityCandidate } from "./run-admission-DLl9RlcP.mjs";
import { t as prepareCronRunAdmission } from "./run-admission-MzIWF_ve.mjs";
import { n as isLikelyInterimCronMessage } from "./subagent-followup-hints-BBePQpRw.mjs";
import { n as resolveCronPayloadOutcome } from "./helpers-Dt4VJPjQ.mjs";
import { r as finalizeCronPromptForResolvedTools } from "./run-delivery-trace-B5sykZWn.mjs";
import { a as setCronSessionAgentHarnessId, o as setCronSessionRuntimeModel, s as syncCronSessionLiveSelection } from "./run-session-state-BUhYMXD4.mjs";
import { createHash } from "node:crypto";
//#region src/cron/isolated-agent/command-style-prompt.ts
const COMMAND_STYLE_CRON_PREFIX = /^(?:(?:[A-Z_][A-Z0-9_]*=\S+\s+)+)?(?:cd\s+\S+|(?:\.{1,2}|~)?\/\S+|[A-Za-z]:[\\/]\S+|(?:bash|bun|cargo|deno|docker|gh|git|go|make|node|npm|npx|pnpm|python|python3|ruby|sh|tsx|uv|zsh)\b)/u;
/** Detects single-line cron prompts that look like shell commands or command invocations. */
function isCommandStyleCronMessage(message) {
	return !message.trim().includes("\n") && COMMAND_STYLE_CRON_PREFIX.test(message.trim());
}
//#endregion
//#region src/cron/isolated-agent/prompt-cache-key.ts
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
//#region src/cron/isolated-agent/run-prompt-executor.ts
/** Executes one isolated cron prompt with model fallback candidates. */
const cronEmbeddedRuntimeLoader = createLazyImportLoader(() => import("./run-embedded.runtime.js"));
function hasCliSessionReuseMetadata(binding) {
	return Object.entries(binding).some(([key, value]) => key !== "sessionId" && value !== void 0);
}
/** Creates the model-fallback executor for one isolated cron prompt run. */
function createCronPromptExecutor(params) {
	const trigger = params.trigger === "event" ? "event" : "cron";
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
	const finalizePromptForResolvedTools = ({ prompt, messageToolAvailable }) => finalizeCronPromptForResolvedTools({
		prompt,
		messageToolAvailable,
		deliveryRequested: params.deliveryRequested,
		resolvedDelivery: params.resolvedDelivery,
		sourceDelivery,
		messageToolFormatPrompt: params.messageToolFormatPrompt
	});
	let pendingUserTurn;
	let attemptMediaTaskIds = /* @__PURE__ */ new Set();
	let thinkingCatalog = params.thinkingCatalog;
	let hydratedThinkingSelection;
	let preparedSessionAvailable = params.preRunSessionPersisted;
	const currentAttemptCommittedMedia = () => hasNewGeneratedMediaTaskForSessionKey(params.runSessionKey, attemptMediaTaskIds);
	const resolveCandidateExecution = createCronCandidateExecutionResolver(params);
	return async (promptText, runStartedAt) => {
		try {
			var _usingCtx$1 = _usingCtx();
			const inferenceLease = _usingCtx$1.u(new DisposableStack());
			const binding = params.job.inferenceBinding;
			const inference = await prepareCronRunInference({
				binding,
				cfg: params.cfgWithAgentDefaults,
				agentDir: params.agentDir
			});
			const inferenceAuthorization = inference?.runParams.authProfileBinding;
			if (inference) inferenceLease.defer(() => inference.dispose());
			let canReusePreparedSession = preparedSessionAvailable;
			preparedSessionAvailable = false;
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
			const cronAdmission = prepareCronRunAdmission({
				operatorAuthority: params.operatorAuthority,
				admissionSource: params.admissionSource,
				deliveryAttemptFence: params.deliveryAttemptFence,
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
			params.onPromptAdmission(cronAdmission);
			const cronRunExecSource = _usingCtx$1.u(new DisposableStack());
			try {
				cronRunExecSource.defer(registerCronRunExecSource(runId, {
					agentId: params.agentId,
					jobId: params.job.id,
					jobConfigRevision: resolveCronJobConfigRevision(params.job),
					jobName: params.job.name,
					standingGrantAuthority: cronAdmission.standingGrantAuthority
				}));
			} catch {}
			const { modelResolve, currentChannelId } = await prepareCronModelResolveInput({
				...params,
				trigger,
				prompt: promptText,
				messageChannel
			});
			const fallbackResult = await runEmbeddedAgentEntry({
				preparedRunAdmission: cronAdmission.preparedRunAdmission,
				modelResolve,
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
					sessionKey: params.runSessionKey,
					sessionLifecycleRevision: params.cronSession.sessionEntry.lifecycleRevision ?? null
				},
				harness: {
					workspaceDir: params.workspaceDir,
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
					const preparedSessionPersisted = canReusePreparedSession;
					canReusePreparedSession = false;
					params.lifecycle.beginAttempt();
					const notifyExecutionStarted = (info) => params.onExecutionStarted?.({
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
					if ((candidateConfiguredThinkLevel !== "off" || candidateRuntime !== "openclaw") && hydratedThinkingSelection !== thinkingSelectionKey) {
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
					inference?.assertCandidate(providerOverride, cliExecution);
					assertCronRuntimeAuthorityCandidate({
						authority: params.job.runtimeAuthority,
						candidateRuntime,
						cliExecution
					});
					const modelChanged = setCronSessionRuntimeModel({
						entry: params.cronSession.sessionEntry,
						provider: providerOverride,
						model: modelOverride
					});
					const harnessChanged = setCronSessionAgentHarnessId({
						entry: params.cronSession.sessionEntry,
						agentHarnessId: candidateRuntime
					});
					if (!(preparedSessionPersisted && !runOptions.isFallbackRetry && !cliExecution && !modelChanged && !harnessChanged)) {
						await params.persistSessionEntry();
						await params.persistRunContinuationSession?.(void 0, { cliExecutionProvider: cliExecution ? executionProvider : void 0 });
					}
					const fastModeState = resolveFastModeState({
						cfg: params.cfgWithAgentDefaults,
						provider: providerOverride,
						model: modelOverride,
						agentId: params.agentId,
						sessionEntry: params.cronSession.sessionEntry
					});
					const buildCommonRunParams = () => ({
						preparedRunAdmission: cronAdmission.preparedRunAdmission,
						workspaceDir: params.workspaceDir,
						cwd: params.cwd,
						sessionId: params.cronSession.sessionEntry.sessionId,
						sessionKey: params.runSessionKey,
						sessionTarget,
						agentId: params.agentId,
						trigger,
						jobId: params.job.id,
						messageActionTurnCapability: cronAdmission.messageActionTurnCapability,
						config: params.cfgWithAgentDefaults,
						prompt: promptText,
						finalizePromptForResolvedTools,
						model: modelOverride,
						thinkLevel: candidateThinkLevel,
						thinkingExplicit: candidateConfiguredThinkLevel !== void 0,
						timeoutMs: params.timeoutMs,
						runId,
						lane: resolveCronAgentLane(params.lane),
						terminalReplyExpectation: "optional",
						skillsSnapshot: params.skillsSnapshot,
						messageChannel,
						agentAccountId: params.resolvedDelivery.accountId,
						extraSystemPrompt: params.deliverySystemPrompt,
						extraSystemPromptTurnContext: params.deliverySystemPrompt ? {
							start: 0,
							text: params.deliverySystemPrompt
						} : void 0,
						sourceReplyDeliveryMode: sourceDelivery.sourceReplyDeliveryMode,
						requireExplicitMessageTarget: sourceDelivery.messageTool.requireExplicitTarget,
						messageToolFinalByDefault: sourceDelivery.messageTool.finalByDefault,
						scheduledToolPolicy,
						onExecutionStarted: notifyExecutionStarted,
						onExecutionPhase: notifyExecutionPhase,
						bootstrapContextMode,
						bootstrapContextRunKind: "cron",
						bootstrapPromptWarningSignaturesSeen,
						bootstrapPromptWarningSignature: bootstrapPromptWarningSignaturesSeen.at(-1),
						fastMode: fastModeState.requestMode,
						fastModeAutoOnSeconds: fastModeState.fastAutoOnSeconds,
						fastModeStartedAtMs,
						fastModeAutoProgressState,
						isFinalFallbackAttempt: runOptions.isFinalFallbackAttempt,
						modelRoutingProvenance: runOptions.modelRoutingProvenance,
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
							sessionFile: params.runSessionKey,
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
								const resolveForwardedProfile = (selected) => allowCliAuthProfileForwarding ? resolveCliExecutionAuthProfileId({
									cliExecutionProvider: executionProvider,
									authProfileProvider: providerOverride,
									config: params.cfgWithAgentDefaults,
									agentDir: params.agentDir,
									sessionBinding: cliSessionBinding,
									selected
								}) : Promise.resolve(void 0);
								const authProfileId = inference ? await inference.resolveCliAuthProfile(resolveForwardedProfile) : await resolveForwardedProfile(params.liveSelection.authProfileId ? {
									authProfileId: params.liveSelection.authProfileId,
									authProfileIdSource: params.liveSelection.authProfileIdSource === "user" ? "user" : "auto"
								} : void 0);
								if (trigger === "cron" && !binding && authProfileId) {
									const refusal = /* @__PURE__ */ new Error("Automation has no recorded inference account. Explicitly select its account with a model@profile update before running it.");
									recordModelFallbackStop(refusal);
									throw refusal;
								}
								const guardedCliSessionBinding = cliSessionBinding && hasCliSessionReuseMetadata(cliSessionBinding) ? cliSessionBinding : void 0;
								const candidateResult = await runCliAgent({
									...buildCommonRunParams(),
									diagnosticOwner,
									sessionEntry: params.cronSession.sessionEntry,
									contextWindow: params.cronSession.sessionEntry.contextWindow,
									cleanupCliLiveSessionOnRunEnd: params.usesDetachedRunSession,
									sessionFile: params.runSessionKey,
									storePath: params.cronSession.storePath,
									persistAssistantTranscript: true,
									modelProvider: providerOverride,
									requesterModel: {
										provider: providerOverride,
										model: modelOverride
									},
									modelHasVision: modelSupportsInput(findModelInCatalog(thinkingCatalog ?? [], providerOverride, modelOverride), "image"),
									provider: executionProvider,
									authProfileId,
									assertCurrent: inference ? () => {
										assertSettlementCurrent();
										inference.runParams.authProfileBinding?.assertCurrent();
									} : void 0,
									nativeAuthOnly: trigger === "cron" && !binding ? true : void 0,
									cliSessionId: cliSessionBinding?.sessionId,
									cliSessionBinding: guardedCliSessionBinding,
									cliSessionBindingFacts: params.cliSessionBindingFacts,
									toolsAllow: resolveCliRuntimeToolsAllow(params.agentPayload?.toolsAllow),
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
								preparedRunAdmission: cronAdmission.preparedRunAdmission,
								abortSignal: cliAbortSignal,
								trigger,
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
					const result = await runEmbeddedAgent({
						...buildCommonRunParams(),
						promptCacheKey,
						cleanupBundleMcpOnRunEnd: params.usesDetachedRunSession,
						allowGatewaySubagentBinding: true,
						messageTo: params.resolvedDelivery.to,
						messageThreadId: params.resolvedDelivery.threadId,
						currentChannelId,
						agentDir: params.agentDir,
						provider: providerOverride,
						agentHarnessRuntimeOverride: sessionRuntimeOverride,
						modelThinkingCapability: prepareModelRunCapabilities([thinkingCatalog, []], [
							providerOverride,
							modelOverride,
							candidateRuntime
						]).modelThinkingCapability,
						requestedRouteResolution: "resolved",
						modelFallbacksOverride: runOptions.modelFallbacksOverride,
						resolvedModelSelection: runOptions.resolvedModelSelection,
						authProfileId: binding?.profileId ?? params.liveSelection.authProfileId,
						...binding && inferenceAuthorization ? {
							authProfileBinding: {
								profileId: binding.profileId,
								authRequirement: binding.authRequirement,
								assertCurrent: () => inferenceAuthorization.assertCurrent(),
								revalidate: () => inferenceAuthorization.revalidate()
							},
							allowAuthProfileFallback: false,
							onSuccessfulAuthProfile: (profileId) => {
								if (profileId !== binding.profileId) throw new Error("Automation inference account changed during execution.");
							}
						} : {},
						authProfileIdSource: binding?.source ?? (params.liveSelection.authProfileId ? params.liveSelection.authProfileIdSource : void 0),
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
				cronRunExecSource.dispose();
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
		} catch (_) {
			_usingCtx$1.e = _;
		} finally {
			_usingCtx$1.d();
		}
	};
}
//#endregion
//#region src/cron/isolated-agent/run-executor.ts
/** Executes isolated cron prompts with model fallbacks and interim-ack retries. */
const cronSubagentRegistryRuntimeLoader = createLazyImportLoader(() => import("./run-subagent-registry.runtime.js"));
/** Executes an isolated cron prompt, including live model-switch and interim-ack retries. */
async function executeCronRun(params) {
	const resolvedVerboseLevel = normalizeVerboseLevel(params.cronSession.sessionEntry.verboseLevel) ?? normalizeVerboseLevel(params.agentVerboseDefault) ?? "off";
	registerAgentRunContext(params.runId, {
		sessionEventDelivery: params.sourceDelivery.normalFinal === "private" ? false : void 0,
		sessionId: params.cronSession.sessionEntry.sessionId,
		agentId: params.agentId,
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
		const shouldRetryInterimAck = !runResult.meta?.error && !interimHasFatalErrorPayload && !runResult.didSendViaMessagingTool && !hasNewGeneratedMediaTaskForSessionKey(params.runSessionKey, promptMediaTaskIds) && !interimPayloadHasStructuredContent && !interimPayloads.some((payload) => payload?.isError === true) && isLikelyInterimCronMessage(interimOutputText ?? "");
		let hasFreshDescendants = false;
		let hasActiveDescendants = false;
		if (shouldRetryInterimAck) {
			const { readDescendantExecutionState } = await cronSubagentRegistryRuntimeLoader.load();
			const descendants = await readDescendantExecutionState(params.runSessionKey, runStartedAt);
			hasFreshDescendants = descendants.hasFreshDescendants;
			hasActiveDescendants = descendants.hasActiveDescendants;
		}
		if (shouldRetryInterimAck && !params.isAborted() && !hasFreshDescendants && !hasActiveDescendants) execution = await runPrompt([
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
