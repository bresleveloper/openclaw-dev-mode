import { _t as normalizeAgentRunTerminalReplySnapshot, ht as buildAgentRunTerminalReplySnapshot, xt as normalizeAgentRunTerminalReceipt, yt as formatAgentRunRouteChange } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { r as isProviderModelRerouted } from "./provider-model-route-D-_CCdkJ.mjs";
import { c as getAgentRunContext } from "./agent-run-registry-DO6Dg2r0.mjs";
import { i as emitAgentEvent, n as captureAgentRunLifecycleGeneration, o as emitAgentEventForRunContext } from "./agent-events-BOSJcayE.mjs";
import { y as requireActivePluginRegistry } from "./runtime-BvdPUus5.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-DYrfsfP0.mjs";
import { i as buildAgentRunTerminalOutcomeFromLifecycleEvent } from "./agent-run-terminal-outcome-Dto4EMdr.mjs";
import { p as resolveAgentRunAbortLifecycleFields } from "./run-termination-Cd1iJzC7.mjs";
import { m as resolveModelFallbackError } from "./failover-error-C3SnWYBJ.mjs";
import { t as runWithModelFallback } from "./model-fallback-runner-BUzxeWPx.mjs";
import { r as mergeAcceptedSessionSpawnsForRun } from "./accepted-session-spawn-4qfWSWlu.mjs";
import { b as resolveSourceReplyDelivery } from "./delivery-evidence-B9fCOuaI.mjs";
import { i as createContextEngineLogicalTurnLease, r as finalizeAcceptedContextEngineTurn, t as discardContextEngineTurnAttemptIntent } from "./context-engine-turn-attempt-D2xPfEYf.mjs";
import { r as selectAgentHarness } from "./selection-DSUYiL_W.mjs";
import { t as ensureSelectedAgentHarnessPlugin } from "./runtime-plugin-By74qnwW.mjs";
import { c as settleFailedRequesterRun, i as resolveSessionPlacementRuntimeOverride, l as settleRequesterRun } from "./session-placement-admission-Gs1bL6J1.mjs";
import { a as isEmbeddedCyberFailoverTargetSkipped, c as isSameEmbeddedCyberFailoverTarget, d as resolveEmbeddedCyberFailoverTarget, i as didEmbeddedCyberFailoverTargetCommitWork, l as recordEmbeddedCyberFailoverTargetUnavailable, n as mergeEmbeddedAgentRunResultForModelFallbackExhaustion, o as isEmbeddedCyberFailoverTargetUsable, r as EMBEDDED_CYBER_FAILOVER_TRIGGER_CODE, s as isEmbeddedModelSelectionStrict, t as classifyEmbeddedAgentRunResultForModelFallback, u as resolveEmbeddedCyberFailoverConfig } from "./result-fallback-classifier-BENPsKcd.mjs";
import { t as createAssistantErrorTranscript } from "./assistant-error-transcript-C5DoUz1A.mjs";
//#region src/agents/embedded-agent-runner/run-entry-terminal.ts
function resolveRunEntryTerminalOutcome(params) {
	const meta = params.result.meta;
	return buildAgentRunTerminalOutcomeFromLifecycleEvent({
		phase: params.fallbackExhausted || meta.error ? "error" : "end",
		data: {
			...meta,
			error: meta.error?.message
		}
	});
}
function canAdvanceContextEngineTurn(params) {
	const meta = params.result.meta;
	return params.fallbackOutcome === "completed" && params.terminal.outcome.status === "ok" && meta.yielded !== true && meta.aborted !== true && meta.error === void 0 && meta.timeoutPhase === void 0 && meta.stopReason !== "error" && meta.stopReason !== "timeout";
}
function mergeRunEntryExecutionTrace(params) {
	const currentTrace = params.result.meta.executionTrace;
	const winnerProvider = params.terminalStatus === "ok" ? currentTrace?.winnerProvider ?? params.provider : void 0;
	const winnerModel = params.terminalStatus === "ok" ? currentTrace?.winnerModel ?? params.model : void 0;
	const outerAttempts = params.fallbackAttempts.map((attempt) => ({
		provider: attempt.provider,
		model: attempt.model,
		result: attempt.reason === "timeout" ? "timeout" : "candidate_failed",
		...attempt.reason ? { reason: attempt.reason } : {},
		...typeof attempt.status === "number" ? { status: attempt.status } : {}
	}));
	const innerAttempts = (currentTrace?.attempts ?? []).filter((attempt) => attempt.result !== "success");
	const winnerAttempt = currentTrace?.attempts?.findLast((attempt) => attempt.result === "success" && attempt.provider === winnerProvider && attempt.model === winnerModel);
	const attempts = [
		...outerAttempts,
		...innerAttempts,
		...winnerProvider && winnerModel ? [winnerAttempt ?? {
			provider: winnerProvider,
			model: winnerModel,
			result: "success"
		}] : []
	];
	const terminalReceipt = params.result.meta.agentMeta?.terminalReceipt;
	const requested = {
		provider: params.requestedProvider,
		model: params.requestedModel
	};
	const agentMeta = terminalReceipt ? {
		...params.result.meta.agentMeta,
		terminalReceipt: {
			...terminalReceipt,
			requested,
			rerouted: terminalReceipt.rerouted || isProviderModelRerouted(requested, terminalReceipt.effective)
		}
	} : params.result.meta.agentMeta;
	return {
		...params.result,
		meta: {
			...params.result.meta,
			agentMeta,
			executionTrace: {
				...currentTrace,
				winnerProvider,
				winnerModel,
				attempts: attempts.length > 0 ? attempts : void 0,
				fallbackUsed: currentTrace?.fallbackUsed === true || outerAttempts.length > 0,
				...params.providerPolicyRetry ? { providerPolicyRetry: params.providerPolicyRetry } : {}
			}
		}
	};
}
function buildRunEntryTerminal(params) {
	const meta = params.result.meta;
	const outcome = params.outcome;
	const internalReply = params.result.messagingToolSourceReplyPayloads?.findLast((payload) => payload.sourceReplyFinal === true);
	let terminalReply = normalizeAgentRunTerminalReplySnapshot(meta.terminalReply) ?? buildAgentRunTerminalReplySnapshot(internalReply ? { visibleText: internalReply.text } : {
		visibleText: meta.finalAssistantVisibleText,
		rawText: meta.finalAssistantRawText,
		terminalReplyKind: meta.terminalReplyKind
	});
	const agentMeta = meta.agentMeta;
	const normalizedTerminalReceipt = normalizeAgentRunTerminalReceipt(agentMeta?.terminalReceipt) ?? (resolveSourceReplyDelivery(params.result) === "delivered" && agentMeta?.provider && agentMeta.model ? {
		runId: params.runId,
		sessionId: params.sessionId,
		turnId: params.runId,
		requested: params.requested,
		effective: {
			provider: agentMeta.provider,
			model: agentMeta.model,
			responseModel: agentMeta.model
		},
		successfulToolNames: ["message"],
		sourceReplyDelivered: true,
		rerouted: isProviderModelRerouted(params.requested, {
			provider: agentMeta.provider,
			model: agentMeta.model
		})
	} : void 0);
	const terminalReceipt = normalizedTerminalReceipt?.runId === params.runId ? {
		...normalizedTerminalReceipt,
		terminalDisposition: terminalReply.disposition === "visible" ? "visible" : "not-visible"
	} : void 0;
	const modelRouteChange = formatAgentRunRouteChange(terminalReceipt, params.runId);
	if (modelRouteChange && terminalReply.disposition === "visible") terminalReply = {
		...terminalReply,
		modelRouteChange
	};
	const metadata = { terminalReply };
	if (terminalReceipt) {
		metadata.terminalReceipt = terminalReceipt;
		metadata.assistantTranscriptIdempotencyKey = terminalReceipt.assistantTranscriptIdempotencyKey;
	}
	if (params.behavior.kind === "channel-delivery" || params.behavior.kind === "followup-delivery") for (const key of [
		"stopReason",
		"yielded",
		"timeoutPhase",
		"providerStarted",
		"aborted",
		"livenessState",
		"replayInvalid"
	]) {
		if (!Object.hasOwn(meta, key)) continue;
		metadata[key] = key in outcome ? outcome[key] : meta[key];
	}
	else {
		for (const key of [
			"stopReason",
			"livenessState",
			"timeoutPhase",
			"providerStarted"
		]) if (outcome[key] !== void 0) metadata[key] = outcome[key];
		if (typeof meta.aborted === "boolean") metadata.aborted = meta.aborted;
		if (meta.replayInvalid === true) metadata.replayInvalid = true;
		if (meta.yielded === true) metadata.yielded = true;
	}
	return {
		outcome,
		metadata
	};
}
const PRESERVED_FOLLOWUP_RESULT_CODES = /* @__PURE__ */ new Set([
	"empty_result",
	"reasoning_only_result",
	"planning_only_result"
]);
function preserveFollowupResultForDelivery(classification) {
	if (!classification || !("code" in classification) || !classification.code || !PRESERVED_FOLLOWUP_RESULT_CODES.has(classification.code)) return classification;
	return {
		...classification,
		preserveResultOnExhaustion: true,
		preserveResultPriority: -1
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/run-entry.ts
/** Runs one logical turn across model candidates and advances only the accepted winner. */
async function runEmbeddedAgentEntry(params) {
	const admission = params.preparedRunAdmission;
	const requester = {
		...params.identity,
		preparedRunAdmission: admission,
		abortSignal: params.abortSignal
	};
	try {
		const result = await runEmbeddedAgentEntryInternal(params);
		settleRequesterRun(requester, result.result, () => admission?.assertSourceCurrent());
		return result;
	} catch (error) {
		throw settleFailedRequesterRun(requester, error);
	}
}
async function runEmbeddedAgentEntryInternal(params) {
	const lifecycleGeneration = captureAgentRunLifecycleGeneration(params.identity.runId);
	const runContext = getAgentRunContext(params.identity.runId);
	const placementRuntime = resolveSessionPlacementRuntimeOverride(params.identity);
	const resolveRuntimeOverride = (provider, model) => {
		const requestedRuntime = params.harness.resolveRuntimeOverride(provider, model);
		if (requestedRuntime || !placementRuntime) return requestedRuntime;
		return resolveAgentHarnessPolicy({
			config: params.selection.cfg,
			provider,
			modelId: model,
			agentId: params.identity.agentId,
			sessionKey: params.harness.sessionKey
		}).runtimeSource === "implicit" ? placementRuntime : void 0;
	};
	const clearObservedModel = () => {
		const event = {
			...params.identity,
			lifecycleGeneration,
			stream: "lifecycle",
			data: {
				phase: "model",
				provider: null,
				model: null
			}
		};
		if (runContext) emitAgentEventForRunContext(event, runContext);
		else emitAgentEvent(event);
	};
	const contextEngineLogicalTurnLease = await createContextEngineLogicalTurnLease({
		identity: params.identity,
		config: params.selection.cfg,
		agentDir: params.selection.agentDir,
		workspaceDir: params.harness.workspaceDir
	});
	const assistantErrorTranscript = createAssistantErrorTranscript({
		runId: params.identity.runId,
		config: params.selection.cfg
	});
	let failed = true;
	let unsettledContextEngineTurnAttempt;
	let candidateIndex = 0;
	const committedSideEffect = params.behavior.kind === "command-rpc" ? params.behavior.hasCommittedSideEffect : void 0;
	const readChannelDeliveryEvidence = params.behavior.kind === "channel-delivery" ? params.behavior.readDeliveryEvidence : void 0;
	const preparedHarnessRuntimes = /* @__PURE__ */ new Set();
	const prepareHarnessRuntime = async (candidate) => {
		assistantErrorTranscript.clear();
		const key = [
			candidate.provider,
			candidate.model,
			candidate.agentHarnessRuntimeOverride ?? ""
		].join("\0");
		if (preparedHarnessRuntimes.has(key)) return;
		const prepare = () => ensureSelectedAgentHarnessPlugin({
			config: params.selection.cfg,
			provider: candidate.provider,
			modelId: candidate.model,
			agentId: params.identity.agentId,
			sessionKey: params.harness.sessionKey,
			agentHarnessId: candidate.agentHarnessRuntimeOverride,
			agentHarnessRuntimeOverride: candidate.agentHarnessRuntimeOverride,
			workspaceDir: params.harness.workspaceDir,
			pluginRegistry: requireActivePluginRegistry()
		});
		if (params.harness.preparation.kind === "measured") await params.harness.preparation.run(prepare);
		else await prepare();
		preparedHarnessRuntimes.add(key);
	};
	const canFallback = committedSideEffect ? () => !committedSideEffect() : readChannelDeliveryEvidence ? () => {
		const evidence = readChannelDeliveryEvidence();
		return !evidence.hasDirectlySentBlockReply && !evidence.hasBlockReplyPipelineOutput && !evidence.hasRetryBlockedDelivery;
	} : void 0;
	const hasCommittedSideEffect = canFallback ? () => !canFallback() : void 0;
	try {
		let capturedCyberRefusal;
		const runFallbackSearch = (selection, runOptions = {}) => runWithModelFallback({
			...selection,
			...params.identity,
			abortSignal: params.abortSignal,
			resolveAgentHarnessRuntimeOverride: resolveRuntimeOverride,
			prepareCandidateChain: async (candidates) => {
				for (const candidate of candidates) try {
					const agentHarnessRuntimeOverride = resolveRuntimeOverride(candidate.provider, candidate.model);
					await prepareHarnessRuntime({
						provider: candidate.provider,
						model: candidate.model,
						...agentHarnessRuntimeOverride ? { agentHarnessRuntimeOverride } : {}
					});
					const host = params.harness.resolveContextEngineHost?.(candidate.provider, candidate.model, agentHarnessRuntimeOverride) ?? (() => {
						const harness = selectAgentHarness({
							provider: candidate.provider,
							modelId: candidate.model,
							config: params.selection.cfg,
							agentId: params.identity.agentId,
							sessionKey: params.harness.sessionKey,
							agentHarnessRuntimeOverride
						});
						return {
							id: `agent-harness:${harness.id}`,
							label: `agent harness "${harness.id}"`,
							capabilities: harness.contextEngineHostCapabilities ?? []
						};
					})();
					contextEngineLogicalTurnLease.selectForHost({
						host,
						operation: "agent-run",
						requiresDurableCommit: false
					});
				} catch {
					contextEngineLogicalTurnLease.degradeBeforeStart("a model fallback candidate harness could not be validated before dispatch");
					return;
				}
			},
			prepareAgentHarnessRuntime: prepareHarnessRuntime,
			onFallbackStep: params.onFallbackStep,
			...params.behavior.kind === "maintenance" ? {} : { classifyResult: ({ result }) => result.result.meta.modelFallbackStopReason ? { stopReason: result.result.meta.modelFallbackStopReason } : canFallback?.() === false ? void 0 : result.classification },
			...canFallback ? { canFallbackAfterError: canFallback } : {},
			...params.behavior.kind === "maintenance" ? {} : { mergeExhaustedResult: ({ latestResult, preferredResult }) => ({
				result: mergeEmbeddedAgentRunResultForModelFallbackExhaustion({
					latestResult: latestResult.result,
					preferredResult: preferredResult.result
				}),
				turnAttempt: latestResult.turnAttempt
			}) },
			run: async (provider, model, options) => {
				assistantErrorTranscript.clear();
				if (!options) throw new Error("Model fallback attempt is missing routing provenance");
				const isFallbackRetry = runOptions.forceFallbackRetry === true || candidateIndex > 0;
				candidateIndex += 1;
				let contextEngineTurnCandidate;
				let classified;
				const classifyResult = (result) => {
					if (canFallback?.() === false) {
						if (runOptions.captureCyberRefusal) capturedCyberRefusal = void 0;
						return;
					}
					if (!classified || classified.result !== result) {
						if (params.preparedRunAdmission) {
							const accepted = mergeAcceptedSessionSpawnsForRun(params.preparedRunAdmission.operationalRunInstance, result.acceptedSessionSpawns);
							if (accepted.length) result.acceptedSessionSpawns = accepted;
						}
						const classification = params.behavior.kind === "maintenance" ? void 0 : classifyEmbeddedAgentRunResultForModelFallback({
							result,
							provider,
							model,
							...readChannelDeliveryEvidence?.()
						});
						const effectiveClassification = params.behavior.kind === "followup-delivery" ? preserveFollowupResultForDelivery(classification) : classification;
						const cyberRefusal = effectiveClassification && "code" in effectiveClassification && effectiveClassification.code === "OPENAI_CYBER_POLICY_REFUSAL";
						if (runOptions.captureCyberRefusal) capturedCyberRefusal = cyberRefusal ? {
							provider,
							model
						} : void 0;
						classified = {
							result,
							value: runOptions.captureCyberRefusal && cyberRefusal ? void 0 : effectiveClassification
						};
					}
					return classified.value;
				};
				try {
					const result = await params.runCandidate(provider, model, {
						agentHarnessRuntimeOverride: resolveRuntimeOverride(provider, model),
						assistantErrorTranscript,
						...runOptions.forceFallbackRetry ? { authProfileFailurePolicy: "local" } : {},
						classifyResult,
						allowTransientCooldownProbe: options.allowTransientCooldownProbe,
						isFinalFallbackAttempt: options.isFinalFallbackAttempt,
						isFallbackRetry,
						modelRoutingProvenance: runOptions.forceFallbackRetry ? {
							...options.modelRoutingProvenance,
							stage: "fallback",
							fallbackReason: "unknown"
						} : options.modelRoutingProvenance,
						contextEngineLogicalTurnLease,
						onContextEngineTurnCandidate: (facts) => {
							contextEngineTurnCandidate = facts;
							unsettledContextEngineTurnAttempt = facts;
						}
					});
					return {
						result,
						classification: classifyResult(result),
						turnAttempt: contextEngineTurnCandidate
					};
				} finally {
					clearObservedModel();
				}
			}
		});
		const originalFallbackResult = await runFallbackSearch(params.selection, { captureCyberRefusal: true });
		const originalErrorTranscript = assistantErrorTranscript.snapshot();
		let fallbackResult = originalFallbackResult;
		let policyEscalated = false;
		const cyberFailover = resolveEmbeddedCyberFailoverConfig(params.selection.cfg);
		const target = capturedCyberRefusal && cyberFailover.mode === "auto" ? resolveEmbeddedCyberFailoverTarget({
			cfg: params.selection.cfg,
			agentId: params.identity.agentId,
			raw: cyberFailover.model,
			manifestPlugins: params.selection.manifestPlugins
		}) : null;
		const authScope = params.selection.userLockedAuthProfileId?.trim() || void 0;
		if (capturedCyberRefusal && target && !isEmbeddedModelSelectionStrict(params.selection) && !isSameEmbeddedCyberFailoverTarget(capturedCyberRefusal, target) && !isEmbeddedCyberFailoverTargetSkipped({
			sessionId: params.identity.sessionId,
			target,
			authScope
		})) {
			if (originalFallbackResult.result.turnAttempt) {
				discardContextEngineTurnAttemptIntent({
					facts: originalFallbackResult.result.turnAttempt,
					lease: contextEngineLogicalTurnLease
				});
				unsettledContextEngineTurnAttempt = void 0;
			}
			try {
				const targetFallbackResult = await runFallbackSearch({
					...params.selection,
					provider: target.provider,
					model: target.model,
					requestedRouteResolution: "resolved",
					fallbacksOverride: []
				}, { forceFallbackRetry: true });
				const usable = targetFallbackResult.outcome === "completed" && isEmbeddedCyberFailoverTargetUsable(targetFallbackResult.result.result);
				if (!usable) recordEmbeddedCyberFailoverTargetUnavailable({
					sessionId: params.identity.sessionId,
					target,
					authScope,
					attempts: targetFallbackResult.attempts,
					cooloffMs: cyberFailover.cooloffMs
				});
				const targetResult = targetFallbackResult.result.result;
				if (usable || targetResult.meta.aborted === true || didEmbeddedCyberFailoverTargetCommitWork(targetResult) || hasCommittedSideEffect?.() === true) {
					policyEscalated = usable;
					fallbackResult = {
						...targetFallbackResult,
						attempts: [
							...originalFallbackResult.attempts,
							{
								provider: capturedCyberRefusal.provider,
								model: capturedCyberRefusal.model,
								error: "OpenAI cyber policy refusal",
								reason: "unknown",
								code: EMBEDDED_CYBER_FAILOVER_TRIGGER_CODE
							},
							...targetFallbackResult.attempts
						]
					};
				} else {
					if (targetFallbackResult.result.turnAttempt) {
						discardContextEngineTurnAttemptIntent({
							facts: targetFallbackResult.result.turnAttempt,
							lease: contextEngineLogicalTurnLease
						});
						unsettledContextEngineTurnAttempt = void 0;
					}
					assistantErrorTranscript.restore(originalErrorTranscript);
					fallbackResult = {
						...originalFallbackResult,
						result: {
							...originalFallbackResult.result,
							turnAttempt: void 0
						}
					};
				}
			} catch (error) {
				const resolution = resolveModelFallbackError(error, {
					provider: target.provider,
					model: target.model,
					sessionId: params.identity.sessionId,
					lane: params.identity.lane
				});
				if (resolution.kind !== "failover" || hasCommittedSideEffect?.() === true) throw error;
				if (resolution.error.reason === "auth" || resolution.error.reason === "auth_permanent") recordEmbeddedCyberFailoverTargetUnavailable({
					sessionId: params.identity.sessionId,
					target,
					authScope,
					attempts: [{
						provider: target.provider,
						model: target.model,
						error: resolution.error.message,
						reason: resolution.error.reason,
						code: resolution.error.code
					}],
					cooloffMs: cyberFailover.cooloffMs
				});
				assistantErrorTranscript.restore(originalErrorTranscript);
				fallbackResult = {
					...originalFallbackResult,
					result: {
						...originalFallbackResult.result,
						turnAttempt: void 0
					}
				};
			}
		}
		const abortFields = params.behavior.kind === "command-rpc" ? resolveAgentRunAbortLifecycleFields(params.abortSignal) : {};
		const candidateResult = abortFields.aborted === true ? {
			...fallbackResult.result.result,
			meta: {
				...fallbackResult.result.result.meta,
				...abortFields
			}
		} : fallbackResult.result.result;
		const outcome = fallbackResult.outcome;
		const terminalOutcome = resolveRunEntryTerminalOutcome({
			result: candidateResult,
			fallbackExhausted: outcome === "exhausted"
		});
		failed = terminalOutcome.status === "error";
		const result = mergeRunEntryExecutionTrace({
			result: candidateResult,
			terminalStatus: terminalOutcome.status,
			provider: fallbackResult.provider,
			model: fallbackResult.model,
			requestedProvider: params.selection.provider,
			requestedModel: params.selection.model,
			fallbackAttempts: fallbackResult.attempts,
			...policyEscalated ? { providerPolicyRetry: {
				category: "cyber",
				provider: fallbackResult.provider,
				model: fallbackResult.model
			} } : {}
		});
		const settledResult = {
			...fallbackResult,
			outcome,
			result
		};
		const terminal = buildRunEntryTerminal({
			result,
			outcome: terminalOutcome,
			behavior: params.behavior,
			runId: params.identity.runId,
			requested: {
				provider: params.selection.provider,
				model: params.selection.model
			},
			sessionId: params.identity.sessionId
		});
		const acceptedTerminal = !params.abortSignal?.aborted && canAdvanceContextEngineTurn({
			result,
			fallbackOutcome: settledResult.outcome,
			terminal
		});
		let releaseAcceptedTerminalWork;
		if (acceptedTerminal) {
			const acceptedTerminalWork = await params.onAcceptedTerminal?.();
			if (typeof acceptedTerminalWork === "function") releaseAcceptedTerminalWork = acceptedTerminalWork;
		}
		try {
			if (fallbackResult.result.turnAttempt) {
				if (acceptedTerminal) await finalizeAcceptedContextEngineTurn({
					config: params.selection.cfg,
					facts: fallbackResult.result.turnAttempt,
					lease: contextEngineLogicalTurnLease
				});
				else discardContextEngineTurnAttemptIntent({
					facts: fallbackResult.result.turnAttempt,
					lease: contextEngineLogicalTurnLease
				});
				unsettledContextEngineTurnAttempt = void 0;
			}
		} finally {
			releaseAcceptedTerminalWork?.();
		}
		let sessionOverrideSettled = false;
		const settleSessionOverride = async () => {
			if (sessionOverrideSettled) return;
			sessionOverrideSettled = true;
			if (!policyEscalated && settledResult.outcome === "completed" && params.sessionOverride.kind === "reconcile-completed") await params.sessionOverride.reconcile({
				provider: settledResult.provider,
				model: settledResult.model
			});
		};
		return {
			...settledResult,
			terminal,
			settleSessionOverride
		};
	} finally {
		if (unsettledContextEngineTurnAttempt) discardContextEngineTurnAttemptIntent({
			facts: unsettledContextEngineTurnAttempt,
			lease: contextEngineLogicalTurnLease
		});
		try {
			await assistantErrorTranscript.settle(failed && !params.abortSignal?.aborted);
		} finally {
			await contextEngineLogicalTurnLease.dispose();
		}
	}
}
//#endregion
export { runEmbeddedAgentEntry as t };
