import "./model-ref-shared-BRJ3VRZV.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { l as getActiveAgentRunDelegatedAuthority, u as getAgentRunContext } from "./agent-run-registry-gmaPgO-n.mjs";
import { a as emitAgentEvent, r as captureAgentRunLifecycleGeneration, s as emitAgentEventForRunContext, t as assertAgentRunLifecycleGenerationCurrent } from "./agent-events-Bf3Js0D3.mjs";
import { o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { v as requireActivePluginRegistry } from "./runtime-DkPagH0y.mjs";
import { n as withPluginRuntimeGenerationScope } from "./generation-scope-CwTBwQp1.mjs";
import { t as modelKey } from "./model-key-5zORvMDY.mjs";
import { r as isProviderModelRerouted } from "./provider-model-route-D2MOzv0r.mjs";
import { h as readPreparedRunOperatorAuthority } from "./admitted-run-context-h1ULFETN.mjs";
import { p as resolveAgentRunAbortLifecycleFields } from "./run-termination-Dwf1ksjA.mjs";
import { u as MODEL_FALLBACK_NOTICE_KIND } from "./transcript-only-openclaw-assistant-Dn9Tr_eT.mjs";
import { r as normalizeAgentRunTerminalReceipt, t as formatAgentRunRouteChange } from "./agent-run-terminal-receipt-Cxhd8xRy.mjs";
import { r as normalizeAgentRunTerminalReplySnapshot, t as buildAgentRunTerminalReplySnapshot } from "./agent-run-terminal-reply-Cj4mTBR2.mjs";
import { t as resolveAgentHarnessPolicy } from "./policy-BESW9cGp.mjs";
import { n as getGlobalHookRunner } from "./hook-runner-global-yjqy4fXI.mjs";
import { u as withClaimingHookAdmission } from "./hooks-CU2qx9-T.mjs";
import { i as buildAgentRunTerminalOutcomeFromLifecycleEvent } from "./agent-run-terminal-outcome-D-ijbyA8.mjs";
import { n as FAILOVER_REASONS } from "./provider-failover-07_cMyqo.mjs";
import { h as resolveModelFallbackError } from "./failover-error-Bjf0VdY2.mjs";
import { n as getPreparedModelRuntimePluginGeneration, t as getPreparedModelRuntimeBorrowedSnapshot } from "./prepared-model-runtime-generation-scope-D16PssC2.mjs";
import { t as runWithModelFallback } from "./model-fallback-runner-ZDIjnIyf.mjs";
import { b as resolveSourceReplyDelivery } from "./delivery-evidence-Do1wex_l.mjs";
import { a as assertRequiredWorkerSelection } from "./required-worker-profile-B0DIhkdC.mjs";
import { r as mergeAcceptedSessionSpawnsForRun } from "./accepted-session-spawn-Bo7jgCE_.mjs";
import { a as resolveSessionPlacementRuntimeOverride, c as withRequiredSessionPlacement, d as settleRequesterRun, o as sessionPlacementUsesWorkerInference, u as settleFailedRequesterRun } from "./session-placement-admission-DV-Z5szH.mjs";
import { v as forgetPromptBuildDrainCacheForRun } from "./context-engine-maintenance-DybI5s-J.mjs";
import { r as captureAgentRunTerminalPersistence } from "./agent-run-terminal-writes-D1C5plfs.mjs";
import { n as finalizeAcceptedContextEngineTurn } from "./context-engine-turn-begin-BnNzqIXZ.mjs";
import { r as selectAgentHarness } from "./selection-2hiqqZF8.mjs";
import { t as ensureSelectedAgentHarnessPlugin } from "./runtime-plugin-Cq540iGR.mjs";
import { n as isFallbackCandidateSkipped } from "./fallback-skip-cache-B3vV3oTK.mjs";
import { t as prepareAgentPromptProjects } from "./prompt-projects-CmyCl0nZ.mjs";
import { a as isEmbeddedCyberFailoverTargetUsable, c as resolveEmbeddedCyberFailoverConfig, i as didEmbeddedCyberFailoverTargetCommitWork, l as resolveEmbeddedCyberFailoverTarget, n as mergeEmbeddedAgentRunResultForModelFallbackExhaustion, o as isEmbeddedModelSelectionStrict, r as EMBEDDED_CYBER_FAILOVER_TRIGGER_CODE, s as recordEmbeddedCyberFailoverTargetUnavailable, t as classifyEmbeddedAgentRunResultForModelFallback } from "./result-fallback-classifier-C9vYFB_s.mjs";
import { a as createAssistantErrorTranscript, i as resolveHookModelSelection, t as buildBeforeModelResolveAttachments } from "./setup-DVU5HHwS.mjs";
import { t as createContextEngineLogicalTurnLease } from "./context-engine-logical-turn-9Vm5a-Dl.mjs";
import { createHash } from "node:crypto";
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
	const attempts = [...outerAttempts, ...innerAttempts];
	if (winnerProvider && winnerModel) attempts.push(winnerAttempt ?? {
		provider: winnerProvider,
		model: winnerModel,
		result: "success"
	});
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
			rerouted: terminalReceipt.rerouted || isProviderModelRerouted(requested, terminalReceipt.effective, params.config)
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
		for (const key of ["replayInvalid", "yielded"]) if (meta[key] === true) metadata[key] = true;
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
	if (!classification || !("code" in classification) || !PRESERVED_FOLLOWUP_RESULT_CODES.has(classification.code ?? "")) return classification;
	return {
		...classification,
		preserveResultOnExhaustion: true,
		preserveResultPriority: -1
	};
}
//#endregion
//#region src/agents/embedded-agent-runner/model-fallback-transcript.ts
const log = createSubsystemLogger("model-fallback");
/** Completion, rather than retry admission, owns evidence that the primary recovered. */
async function persistModelFallbackRestoredTranscriptNotice(params) {
	const { runId, fromModel, toModel, entry } = params;
	if (!runId || runId.length > 4096 || !fromModel || fromModel.length > 512 || !toModel || toModel.length > 512 || fromModel === toModel) return false;
	try {
		params.assertCurrent();
		const { appendAssistantMessageToSessionTranscript } = await import("./transcript-Bo5_DCWC.mjs");
		params.assertCurrent();
		const transition = createHash("sha256").update(runId).digest("hex");
		const result = await appendAssistantMessageToSessionTranscript({
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			storePath: params.storePath,
			expectedSessionId: entry.sessionId,
			expectedLifecycleRevision: entry.lifecycleRevision ?? null,
			expectedWriterRunId: entry.activeWriterRunId,
			runId,
			config: params.config,
			assertCurrent: params.assertCurrent,
			idempotencyKey: `model-fallback-restored:${transition}`,
			text: `Selected model ${toModel} restored (was ${fromModel}).`,
			deliveryMirror: {
				kind: MODEL_FALLBACK_NOTICE_KIND,
				phase: "restored",
				runId,
				fromModel,
				toModel
			}
		});
		if (result.ok) return true;
		if (result.code !== "session-rebound") log.warn("Model restoration transcript notice was not persisted.");
	} catch {
		log.warn("Model restoration transcript notice was not persisted.");
	}
	return false;
}
/** Record an operational fact through the existing run owner, never a provider input. */
async function persistModelFallbackTranscriptNotice(params, step, assertRunCurrent) {
	const { identity, preparedRunAdmission } = params;
	const sessionKey = identity.sessionKey?.trim();
	const sessionLifecycleRevision = identity.sessionLifecycleRevision;
	const fromModel = step.fallbackStepFromModel;
	const toModel = step.fallbackStepToModel;
	if (params.behavior.kind === "maintenance" || step.fallbackStepFinalOutcome !== "next_fallback" || !sessionKey || !identity.sessionId || sessionLifecycleRevision === void 0 || !identity.runId || identity.runId.length > 4096 || !fromModel || fromModel.length > 512 || !toModel || toModel.length > 512 || fromModel === toModel || !preparedRunAdmission || preparedRunAdmission.operationalRunInstance.runId !== identity.runId || !getActiveAgentRunDelegatedAuthority(preparedRunAdmission.operationalRunInstance)) return;
	const { writeContext } = captureAgentRunTerminalPersistence(identity.runId);
	if (!writeContext) return;
	const assertCurrent = composeSessionSourceAssertion([preparedRunAdmission.assertSourceCurrent, writeContext.assertCurrent], (assertSource) => {
		assertRunCurrent();
		assertSource();
	});
	try {
		assertCurrent();
		const { appendAssistantMessageToSessionTranscript } = await import("./transcript-Bo5_DCWC.mjs");
		assertCurrent();
		const reason = FAILOVER_REASONS.find((value) => value === step.fallbackStepFromFailureReason);
		const transition = createHash("sha256").update(JSON.stringify([
			identity.runId,
			step.fallbackStepChainPosition,
			fromModel,
			toModel
		])).digest("hex");
		const result = await writeContext.run(() => appendAssistantMessageToSessionTranscript({
			agentId: identity.agentId,
			sessionKey,
			expectedSessionId: identity.sessionId,
			expectedLifecycleRevision: sessionLifecycleRevision,
			expectedWriterRunId: identity.runId,
			runId: identity.runId,
			config: params.selection.cfg,
			assertCurrent,
			idempotencyKey: `model-fallback:${transition}`,
			text: `Model switched from ${fromModel} to ${toModel}${reason ? ` (${reason})` : ""}.`,
			deliveryMirror: {
				kind: MODEL_FALLBACK_NOTICE_KIND,
				runId: identity.runId,
				fromModel,
				toModel,
				...reason ? { reason } : {}
			}
		}));
		if (!result.ok && result.code !== "session-rebound") log.warn("Model fallback transcript notice was not persisted.");
	} catch {
		log.warn("Model fallback transcript notice was not persisted.");
	}
}
//#endregion
//#region src/agents/embedded-agent-runner/run-entry-model-selection.ts
/** Resolve run routing in the retained plugin generation, before candidate preparation. */
async function resolveRunEntryModelSelection(params) {
	const input = params.modelResolve;
	if (!input || input.modelSelectionLocked) return;
	const generation = getPreparedModelRuntimePluginGeneration();
	const snapshot = generation ? getPreparedModelRuntimeBorrowedSnapshot(generation) : void 0;
	const resolve = async () => {
		const hookRunner = getGlobalHookRunner();
		if (!hookRunner?.hasHooks("before_model_resolve")) return;
		params.assertCurrent();
		const projects = await prepareAgentPromptProjects({
			config: snapshot?.config ?? params.selection.cfg,
			workspaceDir: params.workspaceDir,
			cwd: input.cwd,
			sessionId: params.identity.sessionId
		});
		params.assertCurrent();
		return resolveHookModelSelection({
			prompt: input.prompt,
			awaitSessionDiffBaseline: input.awaitSessionDiffBaseline,
			attachments: buildBeforeModelResolveAttachments(input.images),
			provider: params.selection.provider,
			modelId: params.selection.model,
			hookRunner,
			hookContext: withClaimingHookAdmission({
				...input.context,
				...params.identity,
				workspaceDir: params.workspaceDir,
				activeProjectKeys: [...projects.activeProjectKeys],
				modelProviderId: params.selection.provider,
				modelId: params.selection.model
			}, { assertCurrent: params.assertCurrent })
		});
	};
	return snapshot ? withPluginRuntimeGenerationScope(snapshot, resolve) : resolve();
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
		assertRequiredWorkerSelection(params.selection.cfg, { agentRuntime: params.harness.resolveRuntimeOverride(params.selection.provider, params.selection.model) });
		const result = await withRequiredSessionPlacement(params.identity, {
			config: params.selection.cfg,
			assertCurrent: admission?.assertSourceCurrent,
			signal: params.abortSignal
		}, () => runEmbeddedAgentEntryInternal(params));
		await settleRequesterRun(requester, result.result, () => admission?.assertSourceCurrent());
		return result;
	} catch (error) {
		throw await settleFailedRequesterRun(requester, error);
	}
}
async function runEmbeddedAgentEntryInternal(params) {
	const operatorAuthority = readPreparedRunOperatorAuthority(params.preparedRunAdmission);
	const lifecycleGeneration = captureAgentRunLifecycleGeneration(params.identity.runId);
	const runContext = getAgentRunContext(params.identity.runId);
	const placementRuntime = await resolveSessionPlacementRuntimeOverride(params.identity);
	const assertCurrent = () => {
		params.abortSignal?.throwIfAborted();
		params.preparedRunAdmission?.assertSourceCurrent();
		assertAgentRunLifecycleGenerationCurrent(lifecycleGeneration);
	};
	assertCurrent();
	const hookSelection = await resolveRunEntryModelSelection({
		...params,
		workspaceDir: params.harness.workspaceDir,
		assertCurrent
	});
	const hookOwnsFallbacks = hookSelection?.fallbacksOverride !== void 0;
	const runSelection = params.modelResolve?.modelSelectionLocked ? {
		...params.selection,
		fallbacksOverride: []
	} : hookOwnsFallbacks && hookSelection ? {
		...params.selection,
		provider: hookSelection.provider,
		model: hookSelection.modelId,
		fallbacksOverride: hookSelection.fallbacksOverride,
		requestedRouteResolution: hookSelection.provider !== params.selection.provider || hookSelection.modelId !== params.selection.model ? "raw" : params.selection.requestedRouteResolution
	} : params.selection;
	const harnessContext = (provider, modelId) => ({
		config: params.selection.cfg,
		provider,
		modelId,
		agentId: params.identity.agentId,
		sessionKey: params.harness.sessionKey
	});
	const resolveRuntimeOverride = (provider, model) => {
		const requestedRuntime = params.harness.resolveRuntimeOverride(provider, model);
		assertRequiredWorkerSelection(params.selection.cfg, { agentRuntime: requestedRuntime });
		const policy = resolveAgentHarnessPolicy(harnessContext(provider, model));
		if (params.selection.cfg.cloudWorkers?.requiredProfile) return policy.runtime;
		return requestedRuntime || !placementRuntime ? requestedRuntime : policy.runtimeSource === "implicit" ? placementRuntime : void 0;
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
	const awaitSessionDiffBaseline = params.modelResolve?.awaitSessionDiffBaseline;
	const contextEngineLogicalTurnLease = await createContextEngineLogicalTurnLease({
		identity: params.identity,
		config: params.selection.cfg,
		agentDir: params.selection.agentDir,
		workspaceDir: params.harness.workspaceDir,
		awaitSessionDiffBaseline: awaitSessionDiffBaseline ? async () => {
			await awaitSessionDiffBaseline();
			assertCurrent();
		} : void 0
	});
	const assistantErrorTranscript = createAssistantErrorTranscript();
	let failed = true;
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
			...harnessContext(candidate.provider, candidate.model),
			agentHarnessId: candidate.agentHarnessRuntimeOverride,
			agentHarnessRuntimeOverride: candidate.agentHarnessRuntimeOverride,
			workspaceDir: params.harness.workspaceDir,
			pluginRegistry: requireActivePluginRegistry()
		});
		await (params.harness.preparation.kind === "measured" ? params.harness.preparation.run(prepare) : prepare());
		preparedHarnessRuntimes.add(key);
	};
	const canFallback = committedSideEffect ? () => !committedSideEffect() : readChannelDeliveryEvidence ? () => {
		const evidence = readChannelDeliveryEvidence();
		return !evidence.hasDirectlySentBlockReply && !evidence.hasBlockReplyPipelineOutput && !evidence.hasRetryBlockedDelivery;
	} : void 0;
	const hasCommittedSideEffect = canFallback ? () => !canFallback() : void 0;
	try {
		let capturedCyberRefusal;
		const runFallbackSearch = async (selection, runOptions = {}) => runWithModelFallback({
			...selection,
			...params.identity,
			operatorAuthority,
			skipAuthProfileRuntime: await sessionPlacementUsesWorkerInference(params.identity),
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
							...harnessContext(candidate.provider, candidate.model),
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
			onFallbackStep: async (step) => {
				try {
					await params.onFallbackStep?.(step);
				} finally {
					await persistModelFallbackTranscriptNotice(params, step, assertCurrent);
				}
			},
			...params.behavior.kind === "maintenance" ? {} : {
				classifyResult: ({ result }) => result.result.meta.modelFallbackStopReason ? { stopReason: result.result.meta.modelFallbackStopReason } : canFallback?.() === false ? void 0 : result.classification,
				mergeExhaustedResult: ({ latestResult, preferredResult }) => ({
					result: mergeEmbeddedAgentRunResultForModelFallbackExhaustion({
						latestResult: latestResult.result,
						preferredResult: preferredResult.result
					}),
					turnAttempt: latestResult.turnAttempt
				})
			},
			...canFallback ? { canFallbackAfterError: canFallback } : {},
			run: async (provider, model, options) => {
				assistantErrorTranscript.clear();
				if (!options) throw new Error("Model fallback attempt is missing routing provenance");
				const isFallbackRetry = runOptions.forceFallbackRetry === true || candidateIndex > 0;
				const resolvedModelSelection = hookOwnsFallbacks ? {
					provider,
					modelId: model,
					fallbacksOverride: selection.fallbacksOverride
				} : candidateIndex === 0 && options.modelRoutingProvenance.stage === "initial" ? hookSelection : void 0;
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
						resolvedModelSelection,
						modelFallbacksOverride: selection.fallbacksOverride,
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
		const originalFallbackResult = await runFallbackSearch(runSelection, { captureCyberRefusal: true });
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
		if (capturedCyberRefusal && target && !hookOwnsFallbacks && (!operatorAuthority?.modelPolicy || operatorAuthority.modelPolicy.allows(target)) && !isEmbeddedModelSelectionStrict(runSelection) && modelKey(capturedCyberRefusal.provider, capturedCyberRefusal.model) !== modelKey(target.provider, target.model) && !isFallbackCandidateSkipped({
			sessionId: params.identity.sessionId,
			provider: target.provider,
			model: target.model,
			authScope
		})) {
			const recordTargetUnavailable = (attempts) => recordEmbeddedCyberFailoverTargetUnavailable({
				sessionId: params.identity.sessionId,
				target,
				authScope,
				attempts,
				cooloffMs: cyberFailover.cooloffMs
			});
			const restoreOriginalRefusal = () => {
				assistantErrorTranscript.restore(originalErrorTranscript);
				fallbackResult = {
					...originalFallbackResult,
					result: {
						...originalFallbackResult.result,
						turnAttempt: void 0
					}
				};
			};
			try {
				const targetFallbackResult = await runFallbackSearch({
					...params.selection,
					provider: target.provider,
					model: target.model,
					requestedRouteResolution: "resolved",
					fallbacksOverride: []
				}, { forceFallbackRetry: true });
				const usable = targetFallbackResult.outcome === "completed" && isEmbeddedCyberFailoverTargetUsable(targetFallbackResult.result.result);
				if (!usable) recordTargetUnavailable(targetFallbackResult.attempts);
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
				} else restoreOriginalRefusal();
			} catch (error) {
				const resolution = resolveModelFallbackError(error, {
					provider: target.provider,
					model: target.model,
					sessionId: params.identity.sessionId,
					lane: params.identity.lane
				});
				if (resolution.kind !== "failover" || hasCommittedSideEffect?.() === true) throw error;
				if (resolution.error.reason === "auth" || resolution.error.reason === "auth_permanent") recordTargetUnavailable([{
					provider: target.provider,
					model: target.model,
					error: resolution.error.message,
					reason: resolution.error.reason,
					code: resolution.error.code
				}]);
				restoreOriginalRefusal();
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
			config: params.selection.cfg,
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
			fallbackOutcome: outcome,
			terminal
		});
		const releaseAcceptedTerminalWork = acceptedTerminal ? await params.onAcceptedTerminal?.() : void 0;
		try {
			if (acceptedTerminal && fallbackResult.result.turnAttempt) await finalizeAcceptedContextEngineTurn({
				config: params.selection.cfg,
				facts: fallbackResult.result.turnAttempt,
				lease: contextEngineLogicalTurnLease
			});
		} finally {
			if (typeof releaseAcceptedTerminalWork === "function") releaseAcceptedTerminalWork();
		}
		let sessionOverrideSettled = false;
		const settleSessionOverride = async () => {
			if (sessionOverrideSettled) return;
			sessionOverrideSettled = true;
			if (!policyEscalated && outcome === "completed" && params.sessionOverride.kind === "reconcile-completed") await params.sessionOverride.reconcile({
				provider: fallbackResult.provider,
				model: fallbackResult.model
			});
		};
		return {
			...fallbackResult,
			result,
			terminal,
			settleSessionOverride
		};
	} finally {
		forgetPromptBuildDrainCacheForRun(params.identity.runId);
		try {
			assistantErrorTranscript.settle(failed && !params.abortSignal?.aborted);
		} finally {
			await contextEngineLogicalTurnLease.dispose();
		}
	}
}
//#endregion
export { persistModelFallbackRestoredTranscriptNotice as n, buildRunEntryTerminal as r, runEmbeddedAgentEntry as t };
